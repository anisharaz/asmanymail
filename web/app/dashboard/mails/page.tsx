import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import SelectEmailsToShow from "./select-email-to-show";

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
    <div>
      <SelectEmailsToShow
        emailAddresses={emailAddresses}
        selectedEmailId={emailsToShow}
      />
      <div>{emailsToShow}</div>
      <div>emails</div>
    </div>
  );
}

export default MailsPage;
