"use client";
import { useEffect, useState, useRef } from "react";
import { type Emails } from "@/lib/generated/prisma/client";
import { Badge } from "@/components/ui/badge";

function AllMails({ emailAddressId }: { emailAddressId: string }) {
  const [emails, setEmails] = useState<Emails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  const isEmailNew = (emailDate: Date | string) => {
    const now = new Date();
    const emailTime = new Date(emailDate);
    const diffInMinutes = (now.getTime() - emailTime.getTime()) / (1000 * 60);
    return diffInMinutes < 5;
  };

  useEffect(() => {
    if (!emailAddressId) {
      setLoading(false);
      return;
    }

    const fetchEmails = async (silent = false) => {
      try {
        if (!silent) {
          setLoading(true);
        }
        setError(null);
        const response = await fetch(
          `/api/mails?emailAddressId=${emailAddressId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch emails");
        }

        const data = await response.json();
        setEmails(data.emails);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchEmails(false);
    isInitialLoad.current = false;

    // Set up polling every 5 seconds
    const intervalId = setInterval(() => {
      fetchEmails(true); // Silent fetch
    }, 5000);

    return () => clearInterval(intervalId);
  }, [emailAddressId]);

  if (loading) {
    return <div>Loading emails...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (emails.length === 0) {
    return <div>No emails found for this address.</div>;
  }

  return (
    <div>
      <h2>All mails for {emailAddressId}</h2>
      <ul>
        {emails.map((email) => (
          <li key={email.id} className="flex items-center gap-2 py-1">
            <div>
              <strong>From:</strong> {email.from} | <strong>Subject:</strong>{" "}
              {email.subject} | <strong>Date:</strong>{" "}
              {new Date(email.date).toLocaleString()}
            </div>
            {isEmailNew(email.date) && (
              <Badge variant="default" className="ml-2">
                NEW
              </Badge>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllMails;
