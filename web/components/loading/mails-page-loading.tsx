import { Skeleton } from "@/components/ui/skeleton";

export default function MailsPageLoading() {
  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)]">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col space-y-3 p-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-4 p-4 border rounded-lg"
            >
              <Skeleton className="h-12 w-12 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-3 w-full max-w-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
