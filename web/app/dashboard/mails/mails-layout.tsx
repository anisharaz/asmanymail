import MailsLayoutClient from "./mails-layout-client";

interface MailsLayoutProps {
  emailAddresses: { id: string; email: string }[];
  emailAddressIdToShowMailsFor: string;
}

function MailsLayout({
  emailAddresses,
  emailAddressIdToShowMailsFor,
}: MailsLayoutProps) {
  return (
    <MailsLayoutClient
      emailAddresses={emailAddresses}
      emailAddressIdToShowMailsFor={emailAddressIdToShowMailsFor}
    />
  );
}

export default MailsLayout;
