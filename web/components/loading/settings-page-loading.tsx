import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function SettingsPageLoading() {
  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Add New Email Form Skeleton */}
      <Card className="border-2">
        <div className="p-6 space-y-4">
          <Skeleton className="h-6 w-56" />
          <div className="flex gap-3 items-center">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </Card>

      {/* Email List Skeleton */}
      <Card className="border-2">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-8 ml-auto" />
          </div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-9 w-20" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
