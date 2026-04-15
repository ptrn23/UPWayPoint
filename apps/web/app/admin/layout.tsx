
import { auth } from "@repo/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { serverUserCaller } from "@repo/api";


export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers()
  const session = await auth.api.getSession({
    headers: h
  })
  const caller = await serverUserCaller(h);

  if (!session) {
    redirect("/sign-in");
  }

  const user = await caller.user.getCurrent();

  if (!user || user.userRole !== "admin") {
    redirect("/sign-in");
  }

  return (<>
    {children}
  </>);
}