import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HomepageClient } from "./homepage-client";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard/mails");
  }

  return <HomepageClient />;
}
