import { Skeleton } from "@/components/ui/skeleton";

export default function MailsLoading() {
  return (
    <div className="flex h-screen">
      {/* Left sidebar with email list */}
      <div className="w-1/3 border-r p-4 space-y-4">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Email list items */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2 p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ))}
      </div>

      {/* Right side with email detail */}
      <div className="flex-1 p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
