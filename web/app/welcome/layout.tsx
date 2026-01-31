import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { permanentRedirect } from "next/navigation";

async function WelcomeLayout({ children }: { children: React.ReactNode }) {
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

  if ((user?.completedSignup as string) === "true") {
    permanentRedirect("/dashboard/mails");
  }

  return <>{children}</>;
}

export default WelcomeLayout;
