import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@repo/auth";
import { serverUserCaller } from "@repo/api";

export async function proxy(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	// THIS IS NOT SECURE!
	// This is the recommended approach to optimistically redirect users
	// We recommend handling auth checks in each page/route
	if (!session) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}
	const caller = await serverUserCaller(request);

	const user = await caller.user.getCurrent();
	const url = request.nextUrl.clone();
	const referer = request.headers.get("referer");
	if (!user) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	if (url.pathname.startsWith("/admin") && user.userRole !== "admin") {
		if (referer) {
			return NextResponse.redirect(referer);
		} else {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/admin/:path*"], // Specify the routes the middleware applies to
};
