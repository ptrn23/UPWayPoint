"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

const SignOutButton = () => {
	const router = useRouter();

	const handleSignOut = async () => {
		await signOut();
		router.refresh();
	};

	return (
		<button
			type="button"
			onClick={handleSignOut}
			className="text-xs text-red-300 transition hover:text-red-200"
		>
			Sign Out
		</button>
	);
};

export default function Dashboard() {
	const { data } = trpc.user.getCurrent.useQuery();

	// if (!data) redirect('/sign-in')
	return (
		<section className="p-10">
			<h1 className="text-2xl font-bold">
				Welcome, {data?.name || "Unknown"}!
			</h1>
			<p className="mt-2">You made it to the protected area. 🎉</p>
			<SignOutButton />
		</section>
	);
}
