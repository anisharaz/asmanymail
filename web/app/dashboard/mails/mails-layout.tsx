"use client";
import { useState } from "react";
import MailList from "./mail-list";
import MailDetailView from "./mail-detail-view";
import { cn } from "@/lib/utils";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { type Emails, type Attachments } from "@/lib/generated/prisma/client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";

interface MailsLayoutProps {
  emailAddresses: { id: string; email: string }[];
  emailAddressIdToShowMailsFor: string;
  emails: (Emails & { attachments: Attachments[] })[];
  currentPage: number;
  totalPages: number;
}

function MailsLayout({
  emailAddresses,
  emailAddressIdToShowMailsFor,
  emails,
  currentPage,
  totalPages,
}: MailsLayoutProps) {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const selectedEmail =
    emails.find((email) => email.id === selectedEmailId) || null;
  const router = useRouter();
  const searchParams = useSearchParams();

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 7; // Total number of page buttons to show

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const leftSiblingIndex = Math.max(currentPage - 1, 2);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages - 1);

      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

      if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        // Show more pages on the left
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
      } else if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
        // Show more pages on the right
        pages.push("ellipsis");
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show ellipsis on both sides
        pages.push("ellipsis");
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex flex-col w-full h-[calc(100vh-36px)]">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 w-full h-full"
      >
        <ResizablePanel
          defaultSize={selectedEmailId ? 50 : 100}
          minSize={30}
          className={cn("w-full h-full", selectedEmailId && "hidden md:block")}
        >
          <MailList
            emailAddressIdToShowMailsFor={emailAddressIdToShowMailsFor}
            onEmailSelect={setSelectedEmailId}
            selectedEmailId={selectedEmailId}
            emailAddresses={emailAddresses}
            emails={emails}
          />
        </ResizablePanel>
        {selectedEmailId && selectedEmail && (
          <>
            <ResizableHandle withHandle className="hidden md:flex" />
            <ResizablePanel
              defaultSize={50}
              minSize={30}
              className="w-full h-full"
            >
              <MailDetailView
                email={selectedEmail}
                onClose={() => setSelectedEmailId(null)}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
      {totalPages > 1 && (
        <>
          <Separator />
          <div className="p-3 md:p-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) changePage(currentPage - 1);
                    }}
                    className={cn(
                      currentPage === 1 && "pointer-events-none opacity-50",
                    )}
                  />
                </PaginationItem>
                {pageNumbers.map((page, index) =>
                  page === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          changePage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) changePage(currentPage + 1);
                    }}
                    className={cn(
                      currentPage === totalPages &&
                        "pointer-events-none opacity-50",
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}

export default MailsLayout;
