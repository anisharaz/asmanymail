import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import MailsPageClient from "./page-client";

async function MailsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const emailAddressId = (await searchParams).emailAddressId;
  const emailAddresses = await prisma.emailAddresses.findMany({
    where: {
      userId: session?.user.id as string,
    },
    select: {
      id: true,
      email: true,
    },
  });

  const emailsToShow = emailAddressId ? emailAddressId : emailAddresses[0]?.id;

  return (
    <MailsPageClient
      emailAddresses={emailAddresses}
      emailsToShow={emailsToShow}
    />
  );
}

export default MailsPage;
