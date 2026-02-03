import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { cookies, headers } from "next/headers";
import { permanentRedirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    permanentRedirect("/auth/login");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if ((user?.completedSignup as string) === "false") {
    permanentRedirect("/welcome");
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="mx-auto w-full">
          <div className="">
            <SidebarTrigger size={"lg"} />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}

export default DashboardLayout;
