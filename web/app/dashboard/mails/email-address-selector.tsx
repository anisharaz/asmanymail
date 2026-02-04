"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface EmailAddress {
  id: string;
  email: string;
}

interface EmailAddressSelectorProps {
  emailAddresses: EmailAddress[];
  selectedEmailAddressId: string;
}

export function EmailAddressSelector({
  emailAddresses,
  selectedEmailAddressId,
}: EmailAddressSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleEmailChange = (emailId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("emailAddressId", emailId);

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 rounded-md flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
      <Select
        value={selectedEmailAddressId || undefined}
        onValueChange={handleEmailChange}
        disabled={isPending}
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

export function EmailAddressSelectorSkeleton() {
  return <Skeleton className="h-10 w-70" />;
}
