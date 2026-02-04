import { Suspense } from "react";
import { MailsContent } from "./mails-content";
import { MailsListSkeleton } from "@/components/loading/mails-loading-skeletons";

function MailsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  return (
    <Suspense fallback={<MailsListSkeleton />}>
      <MailsPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function MailsPageContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const emailAddressId = params.emailAddressId;

  return <MailsContent emailAddressId={emailAddressId} />;
}

export default MailsPage;
