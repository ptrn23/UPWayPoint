"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { PIN_CATEGORIES, getPinColor } from "@/data/pin-categories";
import { useTheme } from "@/lib/ThemeContext";
import Link from "next/link";
import { DiffsModal } from "@/components/DiffsModal";
import { AnimationToggle } from "@/components/AnimationToggle";
import type { ModificationRouterOutputs, PinRouterOutputs } from "@repo/api";
import type { PinDiffType } from "@/types/pins";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/hooks/useLanguage";

export default function Dashboard() {
	const [mod, setMod] =
		useState<ModificationRouterOutputs["getPendingByUser"][number]>();
	const [diffs, setDiffs] = useState<PinDiffType | undefined>();
	const [current, setCurrent] = useState<
		PinRouterOutputs["getSimpleById"] | undefined
	>();

	const router = useRouter();
	const { t } = useLanguage();
	const { data, isLoading } = trpc.user.getCurrent.useQuery();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const { data: userMods } = trpc.modification.getPendingByUser.useQuery(
		undefined,
		{ refetchOnWindowFocus: false },
	);

	const { data: userPins } = trpc.pin.getCurrentUsersPins.useQuery(undefined, {
		refetchOnWindowFocus: false,
	});

	const { data: userComments } = trpc.comment.getCurrentUsersComments.useQuery(
		undefined,
		{
			refetchOnWindowFocus: false,
		},
	);

	// const [isEditingBio, setIsEditingBio] = useState(false);
	// const [bioInput, setBioInput] = useState("");
	const { theme, toggleTheme } = useTheme();

	// const handleSaveBio = () => {
	// 	// TODO: Hook this up to trpc.user.updateBio.useMutation()
	// 	console.log("Saving new bio:", bioInput);
	// 	setIsEditingBio(false);
	// };

	const goToMap = () => router.push("/");
	const goToAdmin = () => router.push("/admin");

	const handleSignOut = async () => {
		await signOut();
		router.refresh();
	};
	const stats = useMemo(() => {
		return {
			totalPins: userPins?.filter((p) => p.status !== "DELETED").length,
			verifiedPins: userPins?.filter((p) => p.status === "ACTIVE").length,
			pendingPins: userPins?.filter((p) => p.status === "PENDING_VERIFICATION")
				.length,
			rejectedPins: userPins?.filter((p) => p.status === "ARCHIVED").length,
			comments: userComments?.length,
			categoryBreakdown: {
				academic: userPins?.filter(
					(p) =>
						p.pinTags.map((pt) => pt.tag.title).includes("academic") &&
						p.status !== "DELETED",
				).length,
				food: userPins?.filter(
					(p) =>
						p.pinTags.map((pt) => pt.tag.title).includes("food") &&
						p.status !== "DELETED",
				).length,
				social: userPins?.filter(
					(p) =>
						p.pinTags.map((pt) => pt.tag.title).includes("social") &&
						p.status !== "DELETED",
				).length,
				utility: userPins?.filter(
					(p) =>
						p.pinTags.map((pt) => pt.tag.title).includes("utility") &&
						p.status !== "DELETED",
				).length,
				transit: userPins?.filter(
					(p) =>
						p.pinTags.map((pt) => pt.tag.title).includes("transit") &&
						p.status !== "DELETED",
				).length,
			},
			pendingList: userPins?.filter((p) => p.status === "PENDING_VERIFICATION"),
			recentList: userPins?.filter((p) => p.status === "ACTIVE").slice(0, 5),
			pendingModifications: userMods?.filter((m) => m.status === "PENDING"),
			appliedModifications: userMods?.filter((m) => m.status === "APPLIED"),
			rejectedModifications: userMods?.filter((m) => m.status === "REJECTED"),
		};
	}, [userPins, userComments, userMods]);

	const verificationRate =
		stats.verifiedPins && stats.totalPins
			? Math.round((stats.verifiedPins / stats.totalPins) * 100)
			: 0;

	return (
		<div className="flex h-screen w-screen bg-base overflow-hidden">
			{/* --- MOBILE OVERLAY --- */}
			{isSidebarOpen && (
				// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
				// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[99] md:hidden"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			{/* --- SIDEBAR --- */}
			<aside
				className={`w-[280px] bg-panel border-r border-border-color flex flex-col shrink-0 transition-transform duration-300 z-[100] max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:-translate-x-full ${isSidebarOpen ? "max-md:translate-x-0" : ""}`}
			>
				<div className="h-[72px] flex items-center px-6 border-b border-border-color">
					<h2 className="font-cubao-wide text-[18px] text-primary tracking-[0.1em] m-0">
						UP WAYPOINT
					</h2>
				</div>

				<nav className="flex-1 py-6 px-4 overflow-y-auto custom-vertical-scrollbar">
					<div className="flex flex-col gap-2">
						<span className="font-chakra text-[11px] font-extrabold text-secondary tracking-[0.15em] px-2 mb-1">
							MAIN
						</span>
						<button
							type="button"
							className="text-left px-4 py-3 bg-transparent border-none rounded-lg text-secondary font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 hover:bg-panel-hover hover:text-primary"
						>
							{t("user.overview")}
						</button>
						{data?.userRole === "admin" && (
							<button
								type="button"
								className="text-left px-4 py-3 bg-transparent border-none rounded-lg text-secondary font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 hover:bg-panel-hover hover:text-primary"
								onClick={goToAdmin}
							>
								<div
									style={{ display: "flex", alignItems: "center", gap: "8px" }}
								>
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<rect
											x="3"
											y="11"
											width="18"
											height="11"
											rx="2"
											ry="2"
										></rect>
										<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
									</svg>
									{t("user.goto.admin")}
								</div>
							</button>
						)}
						<button
							type="button"
							className="text-left px-4 py-3 bg-transparent border-none rounded-lg text-secondary font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 hover:bg-panel-hover hover:text-primary"
							onClick={goToMap}
						>
							{t("user.goto.map")}
						</button>
					</div>
					<div className="flex flex-col gap-2" style={{ marginTop: "24px" }}>
						<span className="font-chakra text-[11px] font-extrabold text-secondary tracking-[0.15em] px-2 mb-1">
							{t("settings.display")}
						</span>
						<ThemeToggle theme={theme} toggleTheme={toggleTheme} />
						<AnimationToggle />
						<LanguageToggle />
					</div>
				</nav>

				<div className="p-6 border-t border-border-color">
					<button
						type="button"
						className="w-full bg-transparent border border-border-color text-status-danger p-3 rounded-lg font-chakra text-[12px] font-bold cursor-pointer transition-all duration-200 hover:bg-status-danger/10 hover:border-status-danger"
						onClick={handleSignOut}
					>
						{t("user.signout")}
					</button>
				</div>
			</aside>

			<div className="flex-1 flex flex-col min-w-0">
				{/* --- HEADER --- */}
				<header className="h-[72px] bg-panel border-b border-border-color flex items-center justify-between px-4 md:px-8 shrink-0">
					<div className="flex items-center gap-4">
						<button
							type="button"
							className="md:hidden bg-transparent border-none text-primary cursor-pointer p-1 flex items-center justify-center"
							onClick={() => setIsSidebarOpen(true)}
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="3" y1="12" x2="21" y2="12"></line>
								<line x1="3" y1="6" x2="21" y2="6"></line>
								<line x1="3" y1="18" x2="21" y2="18"></line>
							</svg>
						</button>
						<h1 className="font-chakra text-[16px] font-bold text-primary m-0 tracking-[0.05em]">
							{t("user.dashboard")}
						</h1>
					</div>
				</header>

				{/* --- MAIN --- */}
				<main className="flex-1 p-6 md:p-8 bg-base overflow-y-auto custom-vertical-scrollbar">
					<div className="max-w-[1200px] mx-auto flex flex-col gap-8">
						<div className="flex flex-col gap-2">
							<h2 className="font-chakra text-[28px] font-extrabold text-primary m-0">
								{isLoading
									? t("user.loading")
									: `Welcome, ${data?.name ? data.name.toUpperCase() : t("user.unknown")}!`}
							</h2>
							<p className="font-nunito text-[15px] text-secondary m-0">
								{t("user.message")}
							</p>
						</div>

						{/* --- DASHBOARD GRID --- */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="bg-panel border border-border-color rounded-[16px] p-6 flex flex-col gap-5 transition-transform transition-shadow duration-200">
								<div className="flex justify-between items-center border-b border-border-color pb-3">
									<h3 className="font-chakra text-[14px] font-extrabold text-secondary tracking-[0.15em] m-0">
										{t("user.profile")}
									</h3>
									<span className="bg-status-success/15 text-status-success border border-status-success px-2 py-1 rounded text-[10px] font-chakra font-bold tracking-[0.1em]">
										{data?.userRole === "admin" ? t("user.admin") : t("user.regular")}
									</span>
								</div>

								<div className="flex-1 flex flex-col gap-6">
									<div className="flex items-center gap-5">
										<div className="w-[72px] h-[72px] rounded-full border-2 border-[color-mix(in_srgb,var(--neon-blue)_50%,transparent)] p-1 relative after:content-[''] after:absolute after:-inset-[6px] after:rounded-full after:border after:border-dashed after:border-[color-mix(in_srgb,var(--neon-blue)_30%,transparent)] after:animate-spin-slow">
											<div className="w-full h-full rounded-full bg-neon-blue/15 text-neon-blue flex items-center justify-center font-cubao-wide text-[28px]">
												{data?.name ? data.name.charAt(0).toUpperCase() : "O"}
											</div>
										</div>
										<div className="flex flex-col gap-1">
											<span className="font-chakra text-[20px] font-bold text-primary tracking-[0.05em]">
												{data?.name || t("user.unknown.name")}
											</span>
											<span className="font-mono text-[12px] text-secondary">
												{(data as { email?: string })?.email || t("user.unknown.email")}
											</span>
										</div>
									</div>

									{/* <div className="bio-section">
										<div className="bio-header">
											<span className="bio-label">BIO</span>
											{!isEditingBio && (
												<button
													className="edit-bio-btn"
													onClick={() => {
														setBioInput((data as any)?.bio || "");
														setIsEditingBio(true);
													}}
												>
													<svg
														width="12"
														height="12"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
														<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
													</svg>
													EDIT
												</button>
											)}
										</div>

										{isEditingBio ? (
											<div className="bio-edit-mode">
												<textarea
													className="bio-input custom-vertical-scrollbar"
													value={bioInput}
													onChange={(e) => setBioInput(e.target.value)}
													maxLength={150}
													rows={3}
													placeholder="Enter your bio here..."
												/>
												<div className="bio-actions">
													<button
														className="tactical-button-primary small-btn"
														onClick={handleSaveBio}
													>
														SAVE
													</button>
													<button
														className="tactical-button small-btn"
														onClick={() => setIsEditingBio(false)}
													>
														CANCEL
													</button>
												</div>
											</div>
										) : (
											<p className="bio-text">
												{(data as any)?.bio ||
													"No bio here. Click EDIT to add a short bio about yourself!"}
											</p>
										)}
									</div> */}
								</div>
							</div>

							<div className="bg-panel border border-border-color rounded-[16px] p-6 flex flex-col gap-5 transition-transform transition-shadow duration-200">
								<div className="flex justify-between items-center border-b border-border-color pb-3">
									<h3 className="font-chakra text-[14px] font-extrabold text-secondary tracking-[0.15em] m-0">
										{t("user.statistics")}
									</h3>
								</div>

								<div className="flex-1 flex flex-col gap-6">
									{/* Top Stats Grid */}
									<div className="grid grid-cols-2 gap-4">
										<div className="bg-panel-hover border border-border-color rounded-xl p-4 flex flex-col gap-1">
											<span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.15em]">
												{t("user.pins.total")}
											</span>
											<span className="font-cubao-wide text-[32px] text-primary tracking-[0.05em]">
												{stats.totalPins}
											</span>
										</div>
										<div className="bg-panel-hover border border-border-color rounded-xl p-4 flex flex-col gap-1">
											<span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.15em]">
												{t("user.comments.total")}
											</span>
											<span className="font-cubao-wide text-[32px] text-primary tracking-[0.05em]">
												{stats.comments}
											</span>
										</div>
									</div>

									{/* Verification Integrity Bar */}
									<div className="flex flex-col gap-2">
										<div className="flex justify-between items-end">
											<span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.15em]">
												{t("user.verifications")}
											</span>
											<span className="font-chakra text-[14px] font-extrabold text-status-success">
												{verificationRate}%
											</span>
										</div>
										<div className="h-[6px] bg-panel-hover rounded-full overflow-hidden">
											<div
												className="h-full bg-status-success shadow-[0_0_10px_color-mix(in_srgb,var(--status-success)_50%,transparent)] rounded-full transition-all duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
												style={{ width: `${verificationRate}%` }}
											></div>
										</div>
										<div className="flex gap-3 font-chakra text-[10px] font-bold tracking-[0.05em]">
											<span className="text-status-success">
												{stats.verifiedPins} {t("user.verified")}
											</span>
											<span className="text-status-warning">
												{stats.pendingPins} {t("user.pending")}
											</span>
											<span className="text-status-danger">
												{stats.rejectedPins} {t("user.rejected")}
											</span>
										</div>
									</div>

									{/* Category Distribution */}
									<div className="flex flex-col gap-3">
										<span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.15em]">
											{t("user.category.distribution")}
										</span>
										<div className="flex flex-col gap-2.5">
											{PIN_CATEGORIES.map((category) => {
												const count =
													stats.categoryBreakdown[
														category.id as keyof typeof stats.categoryBreakdown
													] || 0;
												const percentage =
													stats.totalPins && stats.totalPins > 0
														? (count / stats.totalPins) * 100
														: 0;

												return (
													<div
														key={category.id}
														className="flex flex-col gap-1"
													>
														<div className="flex justify-between font-chakra text-[11px] font-bold tracking-[0.1em]">
															<span style={{ color: category.color }}>
																{category.label}
															</span>
															<span className="text-primary font-nunito">
																{count}
															</span>
														</div>
														<div className="h-1 bg-panel-hover rounded-full overflow-hidden">
															<div
																className="h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
																style={{
																	width: `${percentage}%`,
																	backgroundColor: category.color,
																	boxShadow: `0 0 10px color-mix(in srgb, ${category.color} 50%, transparent)`,
																}}
															></div>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</div>

							<div className="bg-panel border border-border-color rounded-[16px] p-6 flex flex-col gap-5 transition-transform transition-shadow duration-200">
								<div className="flex justify-between items-center border-b border-border-color pb-3">
									<h3 className="font-chakra text-[14px] font-extrabold text-secondary tracking-[0.15em] m-0">
										{t("user.pending.pins")}
									</h3>
									<span className="bg-[color-mix(in_srgb,var(--status-warning)_15%,transparent)] text-status-warning border border-status-warning px-2 py-0.5 rounded-[12px] font-nunito font-extrabold text-[12px]">
										{stats.pendingList?.length}
									</span>
								</div>
								<div className="flex-1 flex flex-col">
									<div className="flex flex-col gap-3">
										{stats.pendingList?.map((pin) => {
											const color = getPinColor(
												pin.pinTags?.[0]?.tag.title || "",
											);
											return (
												<div
													key={pin.id}
													className="flex items-center justify-between bg-panel-hover border border-border-color rounded-xl py-3 px-4 transition-all duration-200 hover:border-[color-mix(in_srgb,var(--text-secondary)_50%,transparent)] hover:bg-[color-mix(in_srgb,var(--bg-panel-hover)_80%,var(--border-color))]"
												>
													<div className="flex items-center gap-4">
														<div
															className="w-8 h-8 rotate-45 border-[1.5px] flex items-center justify-center shrink-0 shadow-[0_4px_10px_var(--border-color)]"
															style={{
																borderColor: color,
																backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
															}}
														>
															<span
																className="-rotate-45 font-cubao-wide text-[14px]"
																style={{ color }}
															>
																{pin.title.charAt(0).toUpperCase()}
															</span>
														</div>

														<div className="flex flex-col gap-1">
															<span className="font-chakra text-[14px] font-bold text-primary tracking-[0.05em]">
																{pin.title}
															</span>
															<span className="font-mono text-[11px] text-secondary tracking-[0.05em]">
																{pin.latitude.toFixed(4)},{" "}
																{pin.longitude.toFixed(4)}
															</span>
														</div>
													</div>

													<Link
														className="w-9 h-9 bg-transparent border border-border-color rounded-lg flex items-center justify-center text-secondary cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-neon-blue/15 hover:border-neon-blue hover:text-neon-blue hover:scale-105 active:scale-95"
														href={`/?pin=${pin.id}`}
														target="_blank"
													>
														<svg
															width="18"
															height="18"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2.5"
														>
															<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
														</svg>
													</Link>
												</div>
											);
										})}
									</div>
								</div>
							</div>

							<div className="bg-panel border border-border-color rounded-[16px] p-6 flex flex-col gap-5 transition-transform transition-shadow duration-200">
								<div className="flex justify-between items-center border-b border-border-color pb-3">
									<h3 className="font-chakra text-[14px] font-extrabold text-secondary tracking-[0.15em] m-0">
										{t("user.recent.pins")}
									</h3>
									<span className="bg-[color-mix(in_srgb,var(--status-warning)_15%,transparent)] text-status-warning border border-status-warning px-2 py-0.5 rounded-[12px] font-nunito font-extrabold text-[12px]">
										{stats.recentList?.length}
									</span>
								</div>
								<div className="flex-1 flex flex-col">
									<div className="flex flex-col gap-3">
										{stats.recentList?.map((pin) => {
											const color = getPinColor(
												pin.pinTags?.[0]?.tag.title || "",
											);
											return (
												<div
													key={pin.id}
													className="flex items-center justify-between bg-panel-hover border border-border-color rounded-xl py-3 px-4 transition-all duration-200 hover:border-[color-mix(in_srgb,var(--text-secondary)_50%,transparent)] hover:bg-[color-mix(in_srgb,var(--bg-panel-hover)_80%,var(--border-color))]"
												>
													<div className="flex items-center gap-4">
														<div
															className="w-8 h-8 rotate-45 border-[1.5px] flex items-center justify-center shrink-0 shadow-[0_4px_10px_var(--border-color)]"
															style={{
																borderColor: color,
																backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
															}}
														>
															<span
																className="-rotate-45 font-cubao-wide text-[14px]"
																style={{ color }}
															>
																{pin.title.charAt(0).toUpperCase()}
															</span>
														</div>

														<div className="flex flex-col gap-1">
															<span className="font-chakra text-[14px] font-bold text-primary tracking-[0.05em]">
																{pin.title}
															</span>
															<span className="font-mono text-[11px] text-secondary tracking-[0.05em]">
																{pin.latitude.toFixed(4)},{" "}
																{pin.longitude.toFixed(4)}
															</span>
														</div>
													</div>

													<Link
														className="w-9 h-9 bg-transparent border border-border-color rounded-lg flex items-center justify-center text-secondary cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-neon-blue/15 hover:border-neon-blue hover:text-neon-blue hover:scale-105 active:scale-95"
														href={`/?pin=${pin.id}`}
														target="_blank"
													>
														<svg
															width="18"
															height="18"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2.5"
														>
															<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
														</svg>
													</Link>
												</div>
											);
										})}
									</div>
								</div>
							</div>

							<div className="bg-panel border border-border-color rounded-[16px] p-6 flex flex-col gap-5 transition-transform transition-shadow duration-200">
								<div className="flex justify-between items-center border-b border-border-color pb-3">
									<h3 className="font-chakra text-[14px] font-extrabold text-secondary tracking-[0.15em] m-0">
										{t("user.pending.modifications")}
									</h3>
									<span className="bg-[color-mix(in_srgb,var(--status-warning)_15%,transparent)] text-status-warning border border-status-warning px-2 py-0.5 rounded-[12px] font-nunito font-extrabold text-[12px]">
										{stats.pendingModifications?.length}
									</span>
								</div>

								{diffs && mod && (
									<DiffsModal
										isUser
										isApplied={mod.status !== "PENDING"}
										onCancel={() => setDiffs(undefined)}
										current={current}
										diffs={diffs}
										modId={mod.id}
									/>
								)}
								<div className="flex-1 flex flex-col">
									<div className="flex flex-col gap-3">
										{stats.pendingModifications?.map((mod) => {
											const color = getPinColor(
												mod.pin.pinTags?.[0]?.tag.title || "",
											);
											return (
												<div
													key={mod.id}
													className="flex items-center justify-between bg-panel-hover border border-border-color rounded-xl py-3 px-4 transition-all duration-200 hover:border-[color-mix(in_srgb,var(--text-secondary)_50%,transparent)] hover:bg-[color-mix(in_srgb,var(--bg-panel-hover)_80%,var(--border-color))]"
												>
													<div className="flex items-center gap-4">
														<div
															className="w-8 h-8 rotate-45 border-[1.5px] flex items-center justify-center shrink-0 shadow-[0_4px_10px_var(--border-color)]"
															style={{
																borderColor: color,
																backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
															}}
														>
															<span
																className="-rotate-45 font-cubao-wide text-[14px]"
																style={{ color }}
															>
																{mod.pin.title.charAt(0).toUpperCase()}
															</span>
														</div>

														<div className="flex flex-col gap-1">
															<span className="font-chakra text-[14px] font-bold text-primary tracking-[0.05em]">
																{mod.pin.title}
															</span>
															<span className="font-mono text-[11px] text-secondary tracking-[0.05em]">
																{mod.pin.latitude.toFixed(4)},{" "}
																{mod.pin.longitude.toFixed(4)}
															</span>
														</div>
													</div>

													<div className="flex flex-row items-center gap-3">
														<Link
															className="w-9 h-9 bg-transparent border border-border-color rounded-lg flex items-center justify-center text-secondary cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-neon-blue/15 hover:border-neon-blue hover:text-neon-blue hover:scale-105 active:scale-95"
															href={`/?pin=${mod.pin.id}`}
															target="_blank"
														>
															<svg
																width="18"
																height="18"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="2.5"
															>
																<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
															</svg>
														</Link>
														<button
															type="button"
															className="w-9 h-9 bg-transparent border border-border-color rounded-lg flex items-center justify-center text-secondary cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-neon-blue/15 hover:border-neon-blue hover:text-neon-blue hover:scale-105 active:scale-95"
															onClick={() => {
																setDiffs(
																	mod.after
																		? (mod.after as PinDiffType)
																		: undefined,
																);
																setCurrent(mod.pin);
																setMod(mod);
															}}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="24"
																height="24"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
																className="lucide lucide-file-diff-icon lucide-file-diff"
															>
																<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
																<path d="M9 10h6" />
																<path d="M12 13V7" />
																<path d="M9 17h6" />
															</svg>
														</button>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>

							<div className="bg-panel border border-border-color rounded-[16px] p-6 flex flex-col gap-5 transition-transform transition-shadow duration-200">
								<div className="flex justify-between items-center border-b border-border-color pb-3">
									<h3 className="font-chakra text-[14px] font-extrabold text-secondary tracking-[0.15em] m-0">
										{t("user.applied.modifications")}
									</h3>
									<span className="bg-[color-mix(in_srgb,var(--status-warning)_15%,transparent)] text-status-warning border border-status-warning px-2 py-0.5 rounded-[12px] font-nunito font-extrabold text-[12px]">
										{stats.appliedModifications?.length}
									</span>
								</div>

								<div className="flex-1 flex flex-col">
									<div className="flex flex-col gap-3">
										{stats.appliedModifications?.map((mod) => {
											const color = getPinColor(
												mod.pin.pinTags?.[0]?.tag.title || "",
											);
											return (
												<div
													key={mod.id}
													className="flex items-center justify-between bg-panel-hover border border-border-color rounded-xl py-3 px-4 transition-all duration-200 hover:border-[color-mix(in_srgb,var(--text-secondary)_50%,transparent)] hover:bg-[color-mix(in_srgb,var(--bg-panel-hover)_80%,var(--border-color))]"
												>
													<div className="flex items-center gap-4">
														<div
															className="w-8 h-8 rotate-45 border-[1.5px] flex items-center justify-center shrink-0 shadow-[0_4px_10px_var(--border-color)]"
															style={{
																borderColor: color,
																backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
															}}
														>
															<span
																className="-rotate-45 font-cubao-wide text-[14px]"
																style={{ color }}
															>
																{mod.pin.title.charAt(0).toUpperCase()}
															</span>
														</div>

														<div className="flex flex-col gap-1">
															<span className="font-chakra text-[14px] font-bold text-primary tracking-[0.05em]">
																{mod.pin.title}
															</span>
															<span className="font-mono text-[11px] text-secondary tracking-[0.05em]">
																{mod.pin.latitude.toFixed(4)},{" "}
																{mod.pin.longitude.toFixed(4)}
															</span>
														</div>
													</div>

													<div className="flex flex-row items-center gap-3">
														<Link
															className="w-9 h-9 bg-transparent border border-border-color rounded-lg flex items-center justify-center text-secondary cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-neon-blue/15 hover:border-neon-blue hover:text-neon-blue hover:scale-105 active:scale-95"
															href={`/?pin=${mod.pin.id}`}
															target="_blank"
														>
															<svg
																width="18"
																height="18"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="2.5"
															>
																<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
															</svg>
														</Link>
														<button
															type="button"
															className="w-9 h-9 bg-transparent border border-border-color rounded-lg flex items-center justify-center text-secondary cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-neon-blue/15 hover:border-neon-blue hover:text-neon-blue hover:scale-105 active:scale-95"
															onClick={() => {
																setDiffs(
																	mod.after
																		? (mod.after as PinDiffType)
																		: undefined,
																);
																setCurrent(mod.pin);
																setMod(mod);
															}}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="24"
																height="24"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
																className="lucide lucide-file-diff-icon lucide-file-diff"
															>
																<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
																<path d="M9 10h6" />
																<path d="M12 13V7" />
																<path d="M9 17h6" />
															</svg>
														</button>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
							<div className="bg-panel border border-border-color rounded-[16px] p-6 flex flex-col gap-5 transition-transform transition-shadow duration-200">
								<div className="flex justify-between items-center border-b border-border-color pb-3">
									<h3 className="font-chakra text-[14px] font-extrabold text-secondary tracking-[0.15em] m-0">
										{t("user.pending.pins")}
									</h3>
									<span className="bg-[color-mix(in_srgb,var(--status-warning)_15%,transparent)] text-status-warning border border-status-warning px-2 py-0.5 rounded-[12px] font-nunito font-extrabold text-[12px]">
										{stats.rejectedModifications?.length}
									</span>
								</div>

								<div className="flex-1 flex flex-col">
									<div className="flex flex-col gap-3">
										{stats.rejectedModifications?.map((mod) => {
											const color = getPinColor(
												mod.pin.pinTags?.[0]?.tag.title || "",
											);
											return (
												<div
													key={mod.id}
													className="flex items-center justify-between bg-panel-hover border border-border-color rounded-xl py-3 px-4 transition-all duration-200 hover:border-[color-mix(in_srgb,var(--text-secondary)_50%,transparent)] hover:bg-[color-mix(in_srgb,var(--bg-panel-hover)_80%,var(--border-color))]"
												>
													<div className="flex items-center gap-4">
														<div
															className="w-8 h-8 rotate-45 border-[1.5px] flex items-center justify-center shrink-0 shadow-[0_4px_10px_var(--border-color)]"
															style={{
																borderColor: color,
																backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
															}}
														>
															<span
																className="-rotate-45 font-cubao-wide text-[14px]"
																style={{ color }}
															>
																{mod.pin.title.charAt(0).toUpperCase()}
															</span>
														</div>

														<div className="flex flex-col gap-1">
															<span className="font-chakra text-[14px] font-bold text-primary tracking-[0.05em]">
																{mod.pin.title}
															</span>
															<span className="font-mono text-[11px] text-secondary tracking-[0.05em]">
																{mod.pin.latitude.toFixed(4)},{" "}
																{mod.pin.longitude.toFixed(4)}
															</span>
														</div>
													</div>

													<div className="flex flex-row items-center gap-3">
														<Link
															className="w-9 h-9 bg-transparent border border-border-color rounded-lg flex items-center justify-center text-secondary cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-neon-blue/15 hover:border-neon-blue hover:text-neon-blue hover:scale-105 active:scale-95"
															href={`/?pin=${mod.pin.id}`}
															target="_blank"
														>
															<svg
																width="18"
																height="18"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="2.5"
															>
																<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
															</svg>
														</Link>
														<button
															type="button"
															className="w-9 h-9 bg-transparent border border-border-color rounded-lg flex items-center justify-center text-secondary cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-neon-blue/15 hover:border-neon-blue hover:text-neon-blue hover:scale-105 active:scale-95"
															onClick={() => {
																setDiffs(
																	mod.after
																		? (mod.after as PinDiffType)
																		: undefined,
																);
																setCurrent(mod.pin);
																setMod(mod);
															}}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="24"
																height="24"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
																className="lucide lucide-file-diff-icon lucide-file-diff"
															>
																<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
																<path d="M9 10h6" />
																<path d="M12 13V7" />
																<path d="M9 17h6" />
															</svg>
														</button>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
