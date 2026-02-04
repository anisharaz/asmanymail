"use client";
import { Suspense } from "react";
import { useState } from "react";
import MailList from "./mail-list";
import MailDetailView from "./mail-detail-view";
import { cn } from "@/lib/utils";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  MailsListSkeleton,
  MailDetailSkeleton,
} from "@/components/loading/mails-loading-skeletons";

interface MailsLayoutClientProps {
  emailAddresses: { id: string; email: string }[];
  emailAddressIdToShowMailsFor: string;
}

function MailsLayoutClient({
  emailAddresses,
  emailAddressIdToShowMailsFor,
}: MailsLayoutClientProps) {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)]">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 w-full h-full"
      >
        <ResizablePanel
          defaultSize={selectedEmailId ? 50 : 100}
          minSize={30}
          className={cn("w-full h-full", selectedEmailId && "hidden md:block")}
        >
          <Suspense fallback={<MailsListSkeleton />}>
            <MailList
              emailAddressIdToShowMailsFor={emailAddressIdToShowMailsFor}
              onEmailSelect={setSelectedEmailId}
              selectedEmailId={selectedEmailId}
              emailAddresses={emailAddresses}
            />
          </Suspense>
        </ResizablePanel>
        {selectedEmailId && (
          <>
            <ResizableHandle withHandle className="hidden md:flex" />
            <ResizablePanel
              defaultSize={50}
              minSize={30}
              className="w-full h-full"
            >
              <Suspense fallback={<MailDetailSkeleton />}>
                <MailDetailView
                  emailId={selectedEmailId}
                  onClose={() => setSelectedEmailId(null)}
                />
              </Suspense>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}

export default MailsLayoutClient;
