"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { PIN_CATEGORIES, getPinColor } from "@/data/pin-categories";
import { useTheme } from "@/lib/ThemeContext";
import Link from "next/link";

export default function AdminDashboard() {
	const router = useRouter();

	const { data, isLoading } = trpc.user.getCurrent.useQuery();

	const { data: pendingModifications } =
		trpc.modification.getPending.useQuery();

	const { data: pinCounts } = trpc.pin.getStatusCounts.useQuery();
	const { data: userCount } = trpc.user.getCount.useQuery();
	const { data: commentCount } = trpc.comment.getCount.useQuery();
	const { data: pendingPins } = trpc.pin.getAllAdmin.useQuery({
		status: "PENDING_VERIFICATION",
	});

	const { data: activePins } = trpc.pin.getAllAdmin.useQuery({
		status: "ACTIVE",
		limit: 5,
	});
	const utils = trpc.useUtils();
	const rejectPin = trpc.pin.reject.useMutation({
		onSuccess: (output) => {
			utils.pin.getAllAdmin.invalidate();
			utils.modification.getPending.invalidate();
		},
	});
	const approvePin = trpc.pin.approve.useMutation({
		onSuccess: (output) => {
			utils.pin.getAll.invalidate();
			utils.pin.getAllAdmin.invalidate();
			utils.modification.getPending.invalidate();
		},
	});
	const applyMod = trpc.pin.applyUpdate.useMutation({
		onSuccess: (output) => {
			utils.modification.getPending.invalidate();
			utils.pin.getAll.invalidate();
			utils.pin.getAllAdmin.invalidate();
			utils.pin.getStatusCounts.invalidate();
		},
	});
	const rejectMod = trpc.pin.rejectUpdate.useMutation({
		onSuccess: (output) => {
			utils.modification.getPending.invalidate();
		},
	});

	const deletePin = trpc.pin.adminDelete.useMutation({
		onSuccess: (output) => {
			utils.pin.getAllAdmin.invalidate();
		},
	});

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();
	const [activeSection, setActiveSection] = useState("overview");

	const [isDeletingPin, setIsDeletingPin] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				});
			},
			{
				root: document.querySelector(".content-area"),
				rootMargin: "-10% 0px -70% 0px",
			},
		);

		const sections = document.querySelectorAll(".dashboard-section");
		sections.forEach((section) => {
			observer.observe(section);
		});

		return () => observer.disconnect();
	}, []);

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
			setActiveSection(sectionId);
			if (window.innerWidth <= 768) setIsSidebarOpen(false);
		}
	};

	const goToMap = () => router.push("/");

	const handleSignOut = async () => {
		await signOut();
		router.refresh();
	};

	const activePinCount = pinCounts?.ACTIVE || 0;
	const rejectedPinCount = pinCounts?.ARCHIVED || 0;
	const pendingPinCount = pinCounts?.PENDING_VERIFICATION || 0;
	const totalPins = activePinCount + rejectedPinCount + pendingPinCount;

	const pinTagCounts = {
		academic: 0,
		food: 0,
		transit: 0,
		utility: 0,
		social: 0,
	};

	const globalVerificationRate = useMemo(
		() => Math.round((activePinCount / (totalPins || 1)) * 100) || 0,
		[activePinCount, totalPins],
	);

	const globalUserStats = {
		totalUsers: userCount,
		totalComments: commentCount,
		// avgPins: 3.6,
		// avgComments: 5.3,
		// newUsers7Days: 14,
		// newUsers30Days: 45,
	};

	return (
		<div className="flex h-screen w-screen bg-base overflow-hidden">
			{/* --- MOBILE OVERLAY --- */}
			{isSidebarOpen && (
				// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
				// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
				<div className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[99] md:hidden" onClick={() => setIsSidebarOpen(false)} />
			)}

			{/* --- SIDEBAR --- */}
			<aside className={`w-[280px] bg-panel border-r border-border-color flex flex-col shrink-0 transition-transform duration-300 z-[100] max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:-translate-x-full ${isSidebarOpen ? "max-md:translate-x-0" : ""}`}>
				<div className="h-[72px] flex items-center px-6 border-b border-border-color">
					<h2 className="font-cubao-wide text-[18px] text-primary tracking-[0.1em] m-0">UP WAYPOINT</h2>
				</div>

				<nav className="flex-1 py-6 px-4 overflow-y-auto custom-vertical-scrollbar">
					<div className="flex flex-col gap-2">
						<span className="font-chakra text-[11px] font-extrabold text-secondary tracking-[0.15em] px-2 mb-1">COMMAND CENTER</span>

						<button
							type="button"
							className={`text-left px-4 py-3 font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 ${
								activeSection === "overview" 
									? "bg-pin-social/10 text-pin-social border-l-[3px] border-pin-social rounded-r-lg" 
									: "bg-transparent text-secondary border-none rounded-lg hover:bg-panel-hover hover:text-primary"
							}`}
							onClick={() => scrollToSection("overview")}
						>
							OVERVIEW
						</button>

						<button
							type="button"
							className={`text-left px-4 py-3 font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 ${
								activeSection === "overview" 
									? "bg-pin-social/10 text-pin-social border-l-[3px] border-pin-social rounded-r-lg" 
									: "bg-transparent text-secondary border-none rounded-lg hover:bg-panel-hover hover:text-primary"
							}`}
							onClick={() => scrollToSection("pin-management")}
						>
							PIN MANAGEMENT
						</button>

						{/* <button
							type="button"
							className={`nav-item ${activeSection === "user-management" ? "active" : ""}`}
							onClick={() => scrollToSection("user-management")}
						>
							USER MANAGEMENT
						</button> */}

						<button type="button" className="text-left px-4 py-3 bg-transparent border-none rounded-lg text-secondary font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 hover:bg-panel-hover hover:text-primary" onClick={goToMap}>
							RETURN TO MAP
						</button>
					</div>

					<div className="flex flex-col gap-2 mt-6">
						<span className="font-chakra text-[11px] font-extrabold text-secondary tracking-[0.15em] px-2 mb-1">DISPLAY SETTINGS</span>
						<button
							type="button"
							className="w-full text-left px-4 py-3 bg-transparent border-none rounded-lg text-secondary font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 hover:bg-panel-hover hover:text-primary flex justify-between items-center"
							onClick={toggleTheme}
						>
							<span>UI THEME</span>
							<div className="flex items-center gap-1.5 font-chakra text-[11px] font-extrabold">
								{theme === "dark" ? (
									<>
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--theme-moon)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
											<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
										</svg>
										<span style={{ color: "var(--theme-moon)" }}>NIGHT</span>
									</>
								) : (
									<>
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--theme-sun)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
											<circle cx="12" cy="12" r="5"></circle>
											<line x1="12" y1="1" x2="12" y2="3"></line>
											<line x1="12" y1="21" x2="12" y2="23"></line>
											<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
											<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
											<line x1="1" y1="12" x2="3" y2="12"></line>
											<line x1="21" y1="12" x2="23" y2="12"></line>
											<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
											<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
										</svg>
										<span style={{ color: "var(--theme-sun)" }}>DAY</span>
									</>
								)}
							</div>
						</button>
					</div>
				</nav>

				<div className="p-6 border-t border-border-color">
					<button type="button" className="w-full bg-transparent border border-border-color text-status-danger p-3 rounded-lg font-chakra text-[12px] font-bold cursor-pointer transition-all duration-200 hover:bg-status-danger/10 hover:border-status-danger" onClick={handleSignOut}>
						SIGN OUT
					</button>
				</div>
			</aside>

			<div className="flex-1 flex flex-col min-w-0">
				{/* --- HEADER --- */}
				<header className="h-[72px] bg-panel border-b border-border-color flex items-center justify-between px-4 md:px-8 shrink-0">
					<div className="flex items-center gap-4">
						<button type="button" className="md:hidden bg-transparent border-none text-primary cursor-pointer p-1 flex items-center justify-center" onClick={() => setIsSidebarOpen(true)}>
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
						<h1 className="font-chakra text-[16px] font-bold m-0 tracking-[0.05em] text-pin-social">
							Admin Dashboard
						</h1>
					</div>
				</header>

				{/* --- MAIN --- */}
				<main className="flex-1 p-6 md:p-8 bg-base overflow-y-auto custom-vertical-scrollbar">
					<div className="max-w-[1200px] mx-auto flex flex-col gap-8">
						<div className="flex flex-col gap-2">
							<h2 className="font-chakra text-[28px] font-extrabold text-primary m-0">
								{isLoading
									? "LOADING..."
									: `Welcome, ${data?.name ? data.name.toUpperCase() : "ADMIN"}!`}
							</h2>
							<p className="font-nunito text-[15px] text-secondary m-0">
								You have accessed the restricted area. 🚨
							</p>
						</div>

						<div className="flex flex-col gap-16">
							<section id="overview" className="scroll-mt-6">
								<h2 className="font-chakra text-[20px] font-bold text-primary tracking-[0.1em] m-0 mb-6 pb-3 border-b border-border-color">OVERVIEW</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="module-card">
										<div className="card-header">
											<h3>OVERALL PIN STATISTICS</h3>
										</div>
										<div className="card-body telemetry-body">
											{/* Top Stats Grid */}
											<div className="telemetry-top-grid">
												<div className="stat-block">
													<span className="stat-label">TOTAL PINS</span>
													<span className="stat-value">{totalPins}</span>
												</div>
												<div className="stat-block">
													<span className="stat-label">PENDING PINS</span>
													<span
														className="stat-value"
														style={{ color: "var(--status-warning)" }}
													>
														{pendingPinCount}
													</span>
												</div>
											</div>

											<div className="integrity-section">
												<div className="integrity-header">
													<span className="stat-label">
														GLOBAL VERIFICATION
													</span>
													<span
														className="integrity-percent"
														style={{ color: "var(--status-success)" }}
													>
														{globalVerificationRate}%
													</span>
													</div>
													<div className="progress-track">
													<div
														className="progress-fill"
														style={{
															width: `${globalVerificationRate}%`,
															background: "var(--status-success)",
															boxShadow:
																"0 0 10px color-mix(in srgb, var(--status-success) 50%, transparent)",
														}}
													></div>
												</div>
												<div className="integrity-details">
													<span className="detail-item verified">
														{activePinCount} VERIFIED
													</span>
													<span className="detail-item pending">
														{pendingPinCount} PENDING
													</span>
													<span className="detail-item rejected">
														{rejectedPinCount} REJECTED
													</span>
												</div>
											</div>

											<div className="distribution-section">
												<span className="stat-label">CATEGORY BREAKDOWN</span>
												<div className="category-list">
													{PIN_CATEGORIES.map((category) => {
														const count =
															pinTagCounts[
																category.id as keyof typeof pinTagCounts
															] || 0;
														const percentage =
															totalPins > 0
																? (count / (totalPins || 1)) * 100
																: 0;

														return (
															<div key={category.id} className="category-row">
																<div className="cat-info">
																	<span
																		className="cat-name"
																		style={{ color: category.color }}
																	>
																		{category.label}
																	</span>
																	<span className="cat-count">{count}</span>
																</div>
																<div className="cat-track">
																	<div
																		className="cat-fill"
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

									<div className="module-card">
										<div className="card-header">
											<h3>OVERALL USER STATISTICS</h3>
										</div>

										<div className="card-body telemetry-body">
											<div className="telemetry-top-grid">
												<div className="stat-block">
													<span className="stat-label">TOTAL USERS</span>
													<span className="stat-value">
														{globalUserStats.totalUsers}
													</span>
												</div>
												<div className="stat-block">
													<span className="stat-label">TOTAL COMMENTS</span>
													<span className="stat-value">
														{globalUserStats.totalComments}
													</span>
												</div>
												{/* <div className="stat-block">
													<span className="stat-label">
														AVERAGE PINS / USER
													</span>
													<span
														className="stat-value"
														style={{ fontSize: "24px" }}
													>
														{globalUserStats.avgPins}
													</span>
												</div>
												<div className="stat-block">
													<span className="stat-label">
														AVERAGE COMMENTS / USER
													</span>
													<span
														className="stat-value"
														style={{ fontSize: "24px" }}
													>
														{globalUserStats.avgComments}
													</span>
												</div>
												<div className="stat-block">
													<span className="stat-label">
														NEW USERS FOR THE LAST WEEK
													</span>
													<span
														className="stat-value"
														style={{ fontSize: "24px" }}
													>
														{globalUserStats.newUsers7Days}
													</span>
												</div>
												<div className="stat-block">
													<span className="stat-label">
														NEW USERS FOR THE LAST MONTH
													</span>
													<span
														className="stat-value"
														style={{ fontSize: "24px" }}
													>
														{globalUserStats.newUsers30Days}
													</span>
												</div> */}
											</div>
										</div>
									</div>
								</div>
							</section>

							<section id="pin-management" className="scroll-mt-6">
								<h2 className="font-chakra text-[20px] font-bold text-primary tracking-[0.1em] m-0 mb-6 pb-3 border-b border-border-color">PIN MANAGEMENT</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="module-card">
										<div className="card-header">
											<h3>PENDING PIN VERIFICATIONS</h3>
										</div>

										<div className="card-body">
											<div className="pin-list">
												{pendingPins?.map((pin) => {
													const color = getPinColor(
														pin.pinTags?.[0]?.tag.title || "",
													);
													return (
														<div key={pin.id} className="pin-list-item">
															<div className="pin-info-group">
																<div
																	className="list-diamond"
																	style={{
																		borderColor: color,
																		backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
																	}}
																>
																	<span style={{ color }}>
																		{pin.title.charAt(0).toUpperCase()}
																	</span>
																</div>

																<div className="pin-text">
																	<span className="pin-title">{pin.title}</span>
																	<span className="pin-coords">
																		By {pin.owner} • {pin.latitude.toFixed(4)},{" "}
																		{pin.longitude.toFixed(4)}
																	</span>
																</div>
															</div>

															<div
																className="pin-actions"
																style={{ display: "flex", gap: "8px" }}
															>
																<Link
																	className="locate-btn"
																	style={{
																		background: "transparent",
																		border: "1px solid var(--border-color)",
																		borderRadius: "8px",
																		width: "36px",
																		height: "36px",
																		display: "flex",
																		alignItems: "center",
																		justifyContent: "center",
																		color: "var(--text-secondary)",
																		cursor: "pointer",
																		transition: "all 0.2s",
																		flexShrink: "0",
																	}}
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

																<button
																	type="button"
																	className="reject-btn"
																	title="Reject Pin"
																	onClick={() =>
																		rejectPin.mutate({ id: pin.id })
																	}
																>
																	<svg
																		width="18"
																		height="18"
																		viewBox="0 0 24 24"
																		fill="none"
																		stroke="currentColor"
																		strokeWidth="2.5"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	>
																		<line x1="18" y1="6" x2="6" y2="18"></line>
																		<line x1="6" y1="6" x2="18" y2="18"></line>
																	</svg>
																</button>

																<button
																	type="button"
																	className="approve-btn"
																	title="Verify & Approve Pin"
																	onClick={() =>
																		approvePin.mutate({ id: pin.id })
																	}
																>
																	<svg
																		width="18"
																		height="18"
																		viewBox="0 0 24 24"
																		fill="none"
																		stroke="currentColor"
																		strokeWidth="2.5"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	>
																		<polyline points="20 6 9 17 4 12"></polyline>
																	</svg>
																</button>
															</div>
														</div>
													);
												})}
											</div>
										</div>
									</div>

									<div className="module-card">
										<div className="card-header">
											<h3>RECENTLY VERIFIED PINS</h3>
										</div>

										<div className="card-body">
											<div className="pin-list">
												{activePins?.map((pin) => {
													const color = getPinColor(
														pin.pinTags?.[0]?.tag.title || "",
													);
													return (
														<div key={pin.id} className="pin-list-item">
															<div className="pin-info-group">
																<div
																	className="list-diamond"
																	style={{
																		borderColor: color,
																		backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
																	}}
																>
																	<span style={{ color }}>
																		{pin.title.charAt(0).toUpperCase()}
																	</span>
																</div>

																<div className="pin-text">
																	<span className="pin-title">{pin.title}</span>
																	<span className="pin-coords">
																		By {pin.owner} • {pin.latitude.toFixed(4)},{" "}
																		{pin.longitude.toFixed(4)}
																	</span>
																</div>
															</div>

															<div
																className="pin-actions"
																style={{ display: "flex", gap: "8px" }}
															>
																<Link
																	className="locate-btn"
																	style={{
																		background: "transparent",
																		border: "1px solid var(--border-color)",
																		borderRadius: "8px",
																		width: "36px",
																		height: "36px",
																		display: "flex",
																		alignItems: "center",
																		justifyContent: "center",
																		color: "var(--text-secondary)",
																		cursor: "pointer",
																		transition: "all 0.2s",
																		flexShrink: "0",
																	}}
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
																{isDeletingPin ? (
																	<>
																		<button
																			type="button"
																			className="reject-btn"
																			title="Reject Pin"
																			onClick={() => setIsDeletingPin(false)}
																		>
																			<svg
																				width="18"
																				height="18"
																				viewBox="0 0 24 24"
																				fill="none"
																				stroke="currentColor"
																				strokeWidth="2.5"
																				strokeLinecap="round"
																				strokeLinejoin="round"
																			>
																				<line
																					x1="18"
																					y1="6"
																					x2="6"
																					y2="18"
																				></line>
																				<line
																					x1="6"
																					y1="6"
																					x2="18"
																					y2="18"
																				></line>
																			</svg>
																		</button>

																		<button
																			type="button"
																			className="approve-btn"
																			title="Verify & Approve Pin"
																			onClick={() =>
																				deletePin.mutate({ id: pin.id })
																			}
																		>
																			<svg
																				width="18"
																				height="18"
																				viewBox="0 0 24 24"
																				fill="none"
																				stroke="currentColor"
																				strokeWidth="2.5"
																				strokeLinecap="round"
																				strokeLinejoin="round"
																			>
																				<polyline points="20 6 9 17 4 12"></polyline>
																			</svg>
																		</button>
																	</>
																) : (
																	<button
																		type="button"
																		className="reject-btn"
																		onClick={() => {
																			setIsDeletingPin(true);
																		}}
																	>
																		<svg
																			width="18"
																			height="18"
																			viewBox="0 0 24 24"
																			fill="none"
																			stroke="currentColor"
																			strokeWidth="2.5"
																			strokeLinecap="round"
																			strokeLinejoin="round"
																		>
																			<polyline points="3 6 5 6 21 6"></polyline>
																			<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
																		</svg>
																	</button>
																)}
															</div>
														</div>
													);
												})}
											</div>
										</div>
									</div>

									<div className="module-card">
										<div className="card-header">
											<h3>RECENT MODIFICATION REQUESTS</h3>
										</div>

										<div className="card-body">
											<div className="pin-list">
												{pendingModifications?.map((mod) => {
													const color = "var(--text-primary)";
													return (
														<div key={mod.id} className="pin-list-item">
															<div className="pin-info-group">
																<div
																	className="list-diamond"
																	style={{
																		borderColor: color,
																		backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
																	}}
																>
																	<span style={{ color }}>
																		{mod.pin.title.charAt(0).toUpperCase()}
																	</span>
																</div>

																<div className="pin-text">
																	<span className="pin-title">
																		{mod.pin.title}
																	</span>
																	<span className="pin-coords">
																		Modification by {mod.user.name}
																	</span>
																</div>
															</div>

															<div
																className="pin-actions"
																style={{ display: "flex", gap: "8px" }}
															>
																<Link
																	className="locate-btn"
																	style={{
																		background: "transparent",
																		border: "1px solid var(--border-color)",
																		borderRadius: "8px",
																		width: "36px",
																		height: "36px",
																		display: "flex",
																		alignItems: "center",
																		justifyContent: "center",
																		color: "var(--text-secondary)",
																		cursor: "pointer",
																		transition: "all 0.2s",
																		flexShrink: "0",
																	}}
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
																	className="reject-btn"
																	title="Reject Pin"
																	onClick={() =>
																		rejectMod.mutate({ id: mod.id })
																	}
																>
																	<svg
																		width="18"
																		height="18"
																		viewBox="0 0 24 24"
																		fill="none"
																		stroke="currentColor"
																		strokeWidth="2.5"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	>
																		<line x1="18" y1="6" x2="6" y2="18"></line>
																		<line x1="6" y1="6" x2="18" y2="18"></line>
																	</svg>
																</button>

																<button
																	type="button"
																	className="approve-btn"
																	title="Verify & Approve Pin"
																	onClick={() =>
																		applyMod.mutate({ id: mod.id })
																	}
																>
																	<svg
																		width="18"
																		height="18"
																		viewBox="0 0 24 24"
																		fill="none"
																		stroke="currentColor"
																		strokeWidth="2.5"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	>
																		<polyline points="20 6 9 17 4 12"></polyline>
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
							</section>

							{/* <section id="user-management" className="scroll-mt-6">
								<h2 className="font-chakra text-[20px] font-bold text-primary tracking-[0.1em] m-0 mb-6 pb-3 border-b border-border-color">USER MANAGEMENT</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="module-card">
										<div className="card-header">
											<h3>NEWEST USERS</h3>
										</div>
										<div className="card-body">
											<div className="user-list">
												{recentUsers.map((user) => (
													<div key={user.id} className="user-list-item">
														<div className="user-info-group">
															<div className="user-avatar">
																{user.name.charAt(0).toUpperCase()}
															</div>
															<div className="user-text">
																<span className="user-name">{user.name}</span>
																<span className="user-meta">
																	{user.email} • {user.joinedAt}
																</span>
															</div>
														</div>

														<button
															type="button"
															className="view-user-btn"
															title="Access Operator Profile"
															onClick={() => console.log("View user:", user.id)}
														>
															<svg
																width="18"
																height="18"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="2.5"
																strokeLinecap="round"
																strokeLinejoin="round"
															>
																<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
																<circle cx="12" cy="7" r="4"></circle>
															</svg>
														</button>
													</div>
												))}
											</div>
										</div>
									</div>

									<div className="module-card">
										<div className="card-header">
											<h3>TOP USERS BY PINS</h3>
										</div>
										<div className="card-body">
											<div className="user-list">
												{topUsers.map((user, index) => (
													<div key={user.id} className="user-list-item">
														<div className="user-info-group">
															<div
																className="user-avatar"
																style={{
																	borderColor:
																		index === 0
																			? "var(--neon-yellow)"
																			: "var(--neon-blue)",
																	color:
																		index === 0
																			? "var(--neon-yellow)"
																			: "var(--neon-blue)",
																	background:
																		index === 0
																			? "color-mix(in srgb, var(--neon-yellow) 15%, transparent)"
																			: "color-mix(in srgb, var(--neon-blue) 15%, transparent)",
																}}
															>
																{user.name.charAt(0).toUpperCase()}
															</div>
															<div className="user-text">
																<span className="user-name">{user.name}</span>
																<span className="user-meta">
																	Rank #{user.rank} Operator
																</span>
															</div>
														</div>

														<div className="pin-count-display">
															<span
																className="count-number"
																style={{
																	color:
																		index === 0
																			? "var(--neon-yellow)"
																			: "var(--text-primary)",
																}}
															>
																{user.pinCount}
															</span>
															<span className="count-label">PINS</span>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							</section> */}
						</div>
					</div>
				</main>
			</div>

			<style jsx>{`
        .module-card {
          background: var(--bg-panel);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .card-header h3 {
          font-family: var(--font-chakra);
          font-size: 14px;
          font-weight: 800;
          color: var(--text-secondary);
          letter-spacing: 0.15em;
          margin: 0;
        }

        .status-badge {
          background: color-mix(in srgb, var(--status-success) 15%, transparent);
  		  color: var(--status-success);
  		  border: 1px solid var(--status-success);
          padding: 4px 8px;
          border-radius: 4px;
          font-family: var(--font-chakra);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .count-badge {
          background: color-mix(in srgb, var(--status-warning) 15%, transparent);
		  color: var(--status-warning);
		  border: 1px solid var(--status-warning);
          padding: 2px 8px;
          border-radius: 12px;
          font-family: var(--font-nunito);
          font-weight: 800;
          font-size: 12px;
        }
        
        .card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .placeholder-content {
          height: 100%;
          min-height: 200px;
          border: 1px dashed var(--border-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          font-family: var(--font-chakra);
          background: var(--bg-panel-hover);
        }

        /* --- PRESERVED UTILITY CLASSES FROM USER DASHBOARD --- */
        .stat-label { font-family: var(--font-chakra); font-size: 10px; font-weight: 800; color: var(--text-secondary); letter-spacing: 0.15em; }
        .stat-block { background: var(--bg-panel-hover); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 4px; }
        .stat-value { font-family: var(--font-cubao-wide); font-size: 32px; color: var(--text-primary); letter-spacing: 0.05em; }
        
        .pin-list { display: flex; flex-direction: column; gap: 12px; }
        .pin-list-item { display: flex; align-items: center; justify-content: space-between; background: var(--bg-panel-hover); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 16px; transition: all 0.2s ease; }
        .pin-list-item:hover { border-color: color-mix(in srgb, var(--text-secondary) 50%, transparent); background: color-mix(in srgb, var(--bg-panel-hover) 80%, var(--border-color)); }
        .pin-info-group { display: flex; align-items: center; gap: 16px; }
        .list-diamond { width: 32px; height: 32px; transform: rotate(45deg); border: 1.5px solid; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px var(--border-color); }
        .list-diamond span { transform: rotate(-45deg); font-family: var(--font-cubao-wide); font-size: 14px; }
        .pin-text { display: flex; flex-direction: column; gap: 4px; }
        .pin-title { font-family: var(--font-chakra); font-size: 14px; font-weight: 700; color: var(--text-primary); letter-spacing: 0.05em; }
        .pin-coords { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; color: var(--text-secondary); letter-spacing: 0.05em; }

        .locate-btn { background: transparent; border: 1px solid var(--border-color); border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
        .locate-btn:hover { background: color-mix(in srgb, var(--neon-blue) 15%, transparent); border-color: var(--neon-blue); color: var(--neon-blue); transform: scale(1.05); }

        .telemetry-body {
          gap: 24px;
        }

        .stat-label {
          font-family: var(--font-chakra);
          font-size: 10px;
          font-weight: 800;
          color: var(--text-secondary);
          letter-spacing: 0.15em;
        }

        .telemetry-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .stat-block {
          background: var(--bg-panel-hover);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-family: var(--font-cubao-wide);
          font-size: 32px;
          color: var(--text-primary);
          letter-spacing: 0.05em;
        }
        
        .integrity-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .integrity-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .integrity-percent {
          font-family: var(--font-chakra);
          font-size: 14px;
          font-weight: 800;
          color: var(--neon-green);
        }
        
        .progress-track {
          height: 6px;
          background: var(--bg-panel-hover);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--status-success);
          box-shadow: 0 0 10px color-mix(in srgb, var(--status-success) 50%, transparent);
          border-radius: 3px;
          transition: width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .integrity-details {
          display: flex;
          gap: 12px;
          font-family: var(--font-chakra);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .detail-item.verified { color: var(--status-success); }
		.detail-item.pending { color: var(--status-warning); }
		.detail-item.rejected { color: var(--status-danger); }

        /* Category Distribution */
        .distribution-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .category-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cat-info {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-chakra);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .cat-count {
          color: var(--text-primary);
          font-family: var(--font-nunito);
        }

        .cat-track {
          height: 4px;
          background: var(--bg-panel-hover);
          border-radius: 2px;
          overflow: hidden;
        }

        .cat-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* Admin Action Buttons */
        .approve-btn { 
          background: transparent; 
          border: 1px solid var(--border-color); 
          border-radius: 8px; 
          width: 36px; 
          height: 36px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: var(--text-secondary); 
          cursor: pointer; 
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          flex-shrink: 0; 
        }
        
        .approve-btn:hover { 
          background: color-mix(in srgb, var(--status-success) 15%, transparent); 
		  border-color: var(--status-success); 
		  color: var(--status-success); 
		  transform: scale(1.05);
        }
        
        .approve-btn:active { 
          transform: scale(0.95); 
        }

       .reject-btn { 
          background: transparent; 
          border: 1px solid var(--border-color); 
          border-radius: 8px; 
          width: 36px; 
          height: 36px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: var(--text-secondary); 
          cursor: pointer; 
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          flex-shrink: 0; 
        }
        
        .reject-btn:hover { 
		  background: color-mix(in srgb, var(--status-danger) 15%, transparent); 
		  border-color: var(--status-danger); 
		  color: var(--status-danger); 
		  transform: scale(1.05); 
		}
        
        .reject-btn:active { 
          transform: scale(0.95); 
        } 

        /* --- USER LIST STYLES --- */
        .user-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .user-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-panel-hover);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.2s ease;
        }

        .user-list-item:hover {
          border-color: color-mix(in srgb, var(--text-secondary) 50%, transparent);
          background: color-mix(in srgb, var(--bg-panel-hover) 80%, var(--border-color));
        }

        .user-info-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Circular Avatar Layout */
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid var(--neon-blue);
          color: var(--neon-blue);
          background: color-mix(in srgb, var(--neon-blue) 15%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: var(--font-cubao-wide);
          font-size: 16px;
        }

        .user-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .user-name {
          font-family: var(--font-chakra);
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.05em;
        }

        .user-meta {
          font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
          font-size: 11px;
          color: var(--text-secondary);
        }

        /* Admin Action Buttons */
        .view-user-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          flex-shrink: 0;
        }

        .view-user-btn:hover {
          background: color-mix(in srgb, var(--neon-blue) 15%, transparent);
          border-color: var(--neon-blue);
          color: var(--neon-blue);
          transform: scale(1.05);
        }

        .view-user-btn:active {
          transform: scale(0.95);
        }

        /* Leaderboard Count Alignment */
        .pin-count-display {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .count-number {
          font-family: var(--font-cubao-wide);
          font-size: 20px;
          color: var(--text-primary);
          line-height: 1;
        }

        .count-label {
          font-family: var(--font-chakra);
          font-size: 10px;
          font-weight: 800;
          color: var(--text-secondary);
          letter-spacing: 0.1em;
        }

        /* Custom Scrollbar */
        .custom-vertical-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-vertical-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-vertical-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }
      `}</style>
		</div>
	);
}
