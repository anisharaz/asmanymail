import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import MailsLayout from "./mails-layout";
import { GetEmails } from "@/lib/data/get-emails";
import { permanentRedirect } from "next/navigation";

async function MailsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    permanentRedirect("/auth/login");
  }
  const emailAddressId = (await searchParams).emailAddressId;
  const page = (await searchParams).page || "1";
  const emailAddresses = await prisma.emailAddresses.findMany({
    where: {
      userId: session?.user.id as string,
    },
    select: {
      id: true,
      email: true,
    },
  });

  const emailAddressIdToShowMailsFor = emailAddressId
    ? emailAddressId
    : emailAddresses[0]?.id;

  const checkEmailAddressBelongsToUser = await prisma.emailAddresses.findUnique(
    {
      where: {
        userId: session?.user.id as string,
        id: emailAddressIdToShowMailsFor,
      },
    },
  );
  if (!checkEmailAddressBelongsToUser) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Mails</h1>
        <p className="text-red-500">
          Email address not found or does not belong to you.
        </p>
      </div>
    );
  }

  const emails = await GetEmails({
    emailAddressId: emailAddressIdToShowMailsFor,
    pageNumber: parseInt(page, 10),
  });

  const totalEmails = await prisma.emails.count({
    where: {
      emailAddressId: emailAddressIdToShowMailsFor,
    },
  });

  const totalPages = Math.ceil(totalEmails / 10);
  const currentPage = parseInt(page, 10);

  return (
    <MailsLayout
      emailAddresses={emailAddresses}
      emailAddressIdToShowMailsFor={emailAddressIdToShowMailsFor}
      emails={emails}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}

export default MailsPage;
