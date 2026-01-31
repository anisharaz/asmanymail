import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { permanentRedirect } from "next/navigation";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    permanentRedirect("/auth/login");
  }

  return <>{children}</>;
}

export default DashboardLayout;
