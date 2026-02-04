import { Skeleton } from "@/components/ui/skeleton";

export function MailListItemSkeleton() {
  return (
    <div className="flex items-start gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 border-b">
      <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-12" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-3 w-full max-w-xs" />
        </div>
      </div>
    </div>
  );
}

export function InlineMailListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="divide-y divide-border">
      {[...Array(count)].map((_, i) => (
        <MailListItemSkeleton key={i} />
      ))}
    </div>
  );
}
