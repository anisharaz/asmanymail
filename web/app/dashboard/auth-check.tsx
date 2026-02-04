import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { permanentRedirect } from "next/navigation";

export async function DashboardAuthCheck() {
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

  return null;
}
