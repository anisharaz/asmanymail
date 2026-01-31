import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { permanentRedirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    permanentRedirect("/dashboard/mails");
  }
  return <>{children}</>;
}
