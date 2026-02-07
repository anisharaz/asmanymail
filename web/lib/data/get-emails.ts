import prisma from "../db";

export async function GetEmails({
  emailAddressId,
  pageNumber,
}: {
  emailAddressId: string;
  pageNumber: number;
}) {
  const emails = await prisma.emails.findMany({
    where: {
      emailAddressId,
    },
    include: {
      attachments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (pageNumber - 1) * 10,
    take: 10,
  });

  return emails;
}
