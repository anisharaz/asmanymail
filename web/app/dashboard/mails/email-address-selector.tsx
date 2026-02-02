"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
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

  const handleEmailChange = (emailId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("emailAddressId", emailId);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedEmailId || undefined}
        onValueChange={handleEmailChange}
      >
        <SelectTrigger className="w-70">
          <SelectValue placeholder="Select an email address" />
        </SelectTrigger>
        <SelectContent>
          {emailAddresses.map((email) => (
            <SelectItem key={email.id} value={email.id}>
              {email.email + "@" + process.env.NEXT_PUBLIC_EMAIL_DOMAIN}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectEmailsToShow;
