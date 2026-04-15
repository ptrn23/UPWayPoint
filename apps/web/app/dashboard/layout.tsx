
import { auth } from "@repo/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in");
  }

  return (<>
    {children}
  </>);
}