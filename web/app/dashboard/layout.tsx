import { Suspense } from "react";
import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardAuthCheck } from "./auth-check";
import { Skeleton } from "@/components/ui/skeleton";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <>
      <Suspense fallback={null}>
        <DashboardAuthCheck />
      </Suspense>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="mx-auto w-full">
          <div className="">
            <SidebarTrigger size={"lg"} />
          </div>
          <Suspense fallback={<DashboardLayoutSkeleton />}>{children}</Suspense>
        </main>
      </SidebarProvider>
    </>
  );
}

function DashboardLayoutSkeleton() {
  return (
    <div className="flex flex-col space-y-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export default DashboardLayout;
