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

interface MailsLayoutProps {
  emailAddresses: { id: string; email: string }[];
  emailAddressIdToShowMailsFor: string;
}

function MailsLayout({
  emailAddresses,
  emailAddressIdToShowMailsFor,
}: MailsLayoutProps) {
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
          <MailList
            emailAddressIdToShowMailsFor={emailAddressIdToShowMailsFor}
            onEmailSelect={setSelectedEmailId}
            selectedEmailId={selectedEmailId}
            emailAddresses={emailAddresses}
          />
        </ResizablePanel>
        {selectedEmailId && (
          <>
            <ResizableHandle withHandle className="hidden md:flex" />
            <ResizablePanel
              defaultSize={50}
              minSize={30}
              className="w-full h-full"
            >
              <MailDetailView
                emailId={selectedEmailId}
                onClose={() => setSelectedEmailId(null)}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}

export default MailsLayout;
