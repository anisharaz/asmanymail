import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { cookies, headers } from "next/headers";
import { permanentRedirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session
    ? await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      })
    : null;

  if ((user?.completedSignup as string) === "false") {
    permanentRedirect("/welcome");
  }

  const cookieStore = await cookies();
  let defaultOpen;

  if (cookieStore.get("sidebar_state")) {
    defaultOpen =
      cookieStore.get("sidebar_state")?.value === "true" ? true : false;
  } else {
    defaultOpen = true;
  }

  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="mx-auto w-full">
          <div className="">
            <SidebarTrigger size={"lg"} />
          </div>
          <div className="h-6 bg-muted/50 text-muted-foreground text-center text-sm flex items-center justify-center border-b">
            Email receive-only Mode
          </div>
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}

export default DashboardLayout;
