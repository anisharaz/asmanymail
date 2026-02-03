import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";

// Initialize AWS clients
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const s3Client = new S3Client({ region: process.env.AWS_REGION });

const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "asmanymail-deleted-email-attachments";
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const DYNAMODB_BATCH_SIZE = 25; // DynamoDB BatchWrite supports up to 25 items per request

export const handler = async (event) => {
    console.log("Starting attachment deletion process...");

    let deletedS3Objects = 0;
    let deletedDynamoDBItems = 0;
    let errors = [];

    try {
        // Validate required environment variables
        if (!S3_BUCKET_NAME) {
            throw new Error("S3_BUCKET_NAME environment variable is required");
        }

        // Scan DynamoDB table to get all entries
        let lastEvaluatedKey = null;
        let allItems = [];

        do {
            const scanParams = {
                TableName: DYNAMODB_TABLE_NAME,
                ...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey }),
            };

            const scanResult = await docClient.send(new ScanCommand(scanParams));

            if (scanResult.Items && scanResult.Items.length > 0) {
                allItems.push(...scanResult.Items);
            }

            lastEvaluatedKey = scanResult.LastEvaluatedKey;
        } while (lastEvaluatedKey);

        console.log(`Found ${allItems.length} DynamoDB items to process`);

        if (allItems.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "No items found to delete",
                    deletedS3Objects: 0,
                    deletedDynamoDBItems: 0,
                }),
            };
        }

        // Collect all S3 keys from all DynamoDB items
        const allS3Keys = [];
        for (const item of allItems) {
            const attachmentPaths = item.attachmentPaths || [];
            allS3Keys.push(...attachmentPaths);
        }

        console.log(`Collected ${allS3Keys.length} S3 keys to delete`);

        // Delete all S3 objects in a single batch operation
        if (allS3Keys.length > 0) {
            const deleteParams = {
                Bucket: S3_BUCKET_NAME,
                Delete: {
                    Objects: allS3Keys.map(path => ({ Key: path })),
                    Quiet: false,
                },
            };

            const deleteResult = await s3Client.send(new DeleteObjectsCommand(deleteParams));

            deletedS3Objects = deleteResult.Deleted?.length || 0;

            if (deleteResult.Errors && deleteResult.Errors.length > 0) {
                console.error("S3 deletion errors:", deleteResult.Errors);
                errors.push({
                    type: "s3_deletion",
                    s3Errors: deleteResult.Errors,
                });
            }

            console.log(`Deleted ${deletedS3Objects} objects from S3`);
        }

        // Delete all DynamoDB items in batches after successful S3 deletion
        for (let i = 0; i < allItems.length; i += DYNAMODB_BATCH_SIZE) {
            const batch = allItems.slice(i, i + DYNAMODB_BATCH_SIZE);

            try {
                const deleteRequests = batch.map(item => ({
                    DeleteRequest: {
                        Key: {
                            emailId: item.emailId,
                        },
                    },
                }));

                const batchWriteParams = {
                    RequestItems: {
                        [DYNAMODB_TABLE_NAME]: deleteRequests,
                    },
                };

                await docClient.send(new BatchWriteCommand(batchWriteParams));
                deletedDynamoDBItems += batch.length;
                console.log(`Deleted batch of ${batch.length} DynamoDB items`);
            } catch (batchError) {
                console.error("Error deleting DynamoDB batch:", batchError);
                errors.push({
                    type: "dynamodb_batch_deletion",
                    error: batchError.message,
                    affectedItems: batch.map(item => item.emailId),
                });
            }
        }

        console.log(`Deleted ${deletedDynamoDBItems} DynamoDB items`);

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: "Attachment deletion process completed",
                deletedS3Objects,
                deletedDynamoDBItems,
                totalItemsProcessed: allItems.length,
                errors: errors.length > 0 ? errors : undefined,
            }),
        };

        console.log("Process completed:", response.body);
        return response;

    } catch (error) {
        console.error("Fatal error in Lambda execution:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to complete attachment deletion process",
                error: error.message,
                deletedS3Objects,
                deletedDynamoDBItems,
            }),
        };
    }
};
