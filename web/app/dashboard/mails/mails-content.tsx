import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import MailsLayout from "./mails-layout";

export async function MailsContent({
  emailAddressId,
}: {
  emailAddressId?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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

  return (
    <MailsLayout
      emailAddresses={emailAddresses}
      emailAddressIdToShowMailsFor={emailAddressIdToShowMailsFor}
    />
  );
}
