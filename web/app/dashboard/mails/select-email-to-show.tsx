"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface EmailAddress {
  id: string;
  email: string;
}

interface SelectEmailsToShowProps {
  emailAddresses: EmailAddress[];
  selectedEmailId: string;
}

function SelectEmailsToShow({
  emailAddresses,
  selectedEmailId,
}: SelectEmailsToShowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentEmailId = searchParams.get("emailAddressId");

  const handleEmailChange = (emailId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("emailAddressId", emailId);
    router.push(`?${params.toString()}`);
  };

  return (
    <Select
      value={selectedEmailId || undefined}
      onValueChange={handleEmailChange}
    >
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select an email address" />
      </SelectTrigger>
      <SelectContent>
        {emailAddresses.map((email) => (
          <SelectItem key={email.id} value={email.id}>
            {email.email}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SelectEmailsToShow;
