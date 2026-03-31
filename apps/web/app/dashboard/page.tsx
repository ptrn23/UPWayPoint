"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { PIN_CATEGORIES, getPinColor } from "@/data/pin-categories";
import { useTheme } from "@/lib/ThemeContext";
import Link from "next/link";

export default function Dashboard() {
	const router = useRouter();
	const { data, isLoading } = trpc.user.getCurrent.useQuery();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
			pendingList: userPins
				?.filter((p) => p.status === "PENDING_VERIFICATION")
				.slice(0, 5),
			recentList: userPins?.filter((p) => p.status === "ACTIVE").slice(0, 5),
		};
	}, [userPins, userComments]);

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
      <aside className={`w-[280px] bg-panel border-r border-border-color flex flex-col shrink-0 transition-transform duration-300 z-[100] max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:-translate-x-full ${isSidebarOpen ? "max-md:translate-x-0" : ""}`}>
        <div className="h-[72px] flex items-center px-6 border-b border-border-color">
          <h2 className="font-cubao-wide text-[18px] text-primary tracking-[0.1em] m-0">UP WAYPOINT</h2>
        </div>

				<nav className="flex-1 py-6 px-4 overflow-y-auto custom-vertical-scrollbar">
					<div className="flex flex-col gap-2">
						<span className="font-chakra text-[11px] font-extrabold text-secondary tracking-[0.15em] px-2 mb-1">MAIN</span>
						<button type="button" className="text-left px-4 py-3 bg-neon-blue/10 text-neon-blue border-l-3 border-neon-blue rounded-r-lg font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200">
							OVERVIEW
						</button>
						{data?.userRole === "admin" && (
							<button
								type="button"
								className="text-left px-4 py-3 bg-neon-blue/10 text-neon-blue border-l-3 border-neon-blue rounded-r-lg font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200"
								onClick={goToAdmin}
								style={{
                  color: "var(--status-danger)",
                  border: "1px solid color-mix(in srgb, var(--status-danger) 30%, transparent)",
                  background: "color-mix(in srgb, var(--status-danger) 5%, transparent)",
                }}
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
									GO TO ADMIN DASHBOARD
								</div>
							</button>
						)}
						<button type="button" className="text-left px-4 py-3 bg-transparent border-none rounded-lg text-secondary font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 hover:bg-panel-hover hover:text-primary" onClick={goToMap}>
							RETURN TO MAP
						</button>
					</div>
					<div className="flex flex-col gap-2" style={{ marginTop: "24px" }}>
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
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="var(--theme-moon)"
											strokeWidth="2.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
										</svg>
										<span style={{ color: "var(--theme-moon)" }}>NIGHT</span>
									</>
								) : (
									<>
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="var(--theme-sun)"
											strokeWidth="2.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
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

			<div className="main-wrapper">
				{/* --- HEADER --- */}
				<header className="dashboard-header">
					<div className="header-left">
						<button
							type="button"
							className="hamburger-btn"
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
						<h1 className="header-title">User Dashboard</h1>
					</div>
				</header>

				{/* --- MAIN --- */}
				<main className="content-area custom-vertical-scrollbar">
					<div className="content-container">
						<div className="greeting-section">
							<h2 className="greeting-title">
								{isLoading
									? "LOADING..."
									: `Welcome, ${data?.name ? data.name.toUpperCase() : "UNKNOWN"}!`}
							</h2>
							<p className="greeting-subtitle">You made it!</p>
						</div>

						{/* --- DASHBOARD GRID --- */}
						<div className="dashboard-grid">
							<div className="module-card operator-card">
								<div className="card-header">
									<h3>YOUR PROFILE</h3>
									<span className="bg-status-success/15 text-status-success border border-status-success px-2 py-1 rounded text-[10px] font-chakra font-bold tracking-[0.1em]">
                    {data?.userRole === "admin" ? "ADMIN" : "REGULAR USER"}
                  </span>
								</div>

								<div className="card-body operator-body">
									<div className="operator-profile">
										<div className="avatar-container">
											<div className="avatar-fallback">
												{data?.name ? data.name.charAt(0).toUpperCase() : "O"}
											</div>
										</div>
										<div className="operator-details">
											<span className="operator-name">
												{data?.name || "UNKNOWN NAME"}
											</span>
											<span className="operator-email">
												{(data as any)?.email || "UNKNOWN EMAIL"}
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

							<div className="module-card telemetry-card">
								<div className="card-header">
									<h3>YOUR STATISTICS</h3>
								</div>

								<div className="card-body telemetry-body">
									{/* Top Stats Grid */}
									<div className="telemetry-top-grid">
										<div className="stat-block">
											<span className="stat-label">TOTAL PINS ADDED</span>
											<span className="stat-value">{stats.totalPins}</span>
										</div>
										<div className="stat-block">
											<span className="stat-label">TOTAL COMMENTS</span>
											<span className="stat-value">{stats.comments}</span>
										</div>
									</div>

									{/* Verification Integrity Bar */}
									<div className="integrity-section">
										<div className="integrity-header">
											<span className="stat-label">VERIFICATIONS</span>
											<span className="integrity-percent">
												{verificationRate}%
											</span>
										</div>
										<div className="progress-track">
											<div
												className="progress-fill"
												style={{ width: `${verificationRate}%` }}
											></div>
										</div>
										<div className="integrity-details">
											<span className="detail-item verified">
												{stats.verifiedPins} VERIFIED
											</span>
											<span className="detail-item pending">
												{stats.pendingPins} PENDING
											</span>
											<span className="detail-item rejected">
												{stats.rejectedPins} REJECTED
											</span>
										</div>
									</div>

									{/* Category Distribution */}
									<div className="distribution-section">
										<span className="stat-label">CATEGORY DISTRIBUTION</span>
										<div className="category-list">
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

							<div className="module-card pending-card">
								<div className="card-header">
									<h3>YOUR PENDING PINS</h3>
									<span className="count-badge">
										{stats.pendingList?.length}
									</span>
								</div>
								<div className="card-body">
									<div className="pin-list">
										{stats.pendingList?.map((pin) => {
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
																{pin.latitude.toFixed(4)},{" "}
																{pin.longitude.toFixed(4)}
															</span>
														</div>
													</div>

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
												</div>
											);
										})}
									</div>
								</div>
							</div>

							<div className="module-card recent-card">
								<div className="card-header">
									<h3>YOUR RECENT PINS</h3>
									<span className="count-badge">
										{stats.recentList?.length}
									</span>
								</div>
								<div className="card-body">
									<div className="pin-list">
										{stats.recentList?.map((pin) => {
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
																{pin.latitude.toFixed(4)},{" "}
																{pin.longitude.toFixed(4)}
															</span>
														</div>
													</div>

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

			<style jsx>{`
        /* --- MAIN AREA --- */
        .main-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0; /* Prevents flex blowout */
        }

        .dashboard-header {
          height: 72px;
          background-color: var(--bg-panel);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          flex-shrink: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .hamburger-btn {
          display: none; /* Hidden on desktop */
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 4px;
        }

        .header-title {
          font-family: var(--font-chakra);
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: 0.05em;
        }

        .content-area {
          flex: 1;
          padding: 32px;
          background-color: var(--bg-base);
          overflow-y: auto;
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .greeting-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .greeting-title {
          font-family: var(--font-chakra);
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .greeting-subtitle {
          font-family: var(--font-nunito);
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0;
        }

        /* --- DASHBOARD GRID & CARDS --- */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

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

        /* Card Headers */
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

        /* Badges */

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

        .dummy-avatar {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: var(--bg-panel-hover);
          margin-bottom: 16px;
        }
        
        .dummy-lines { display: flex; flex-direction: column; gap: 8px; }
        .line { height: 12px; background: var(--bg-panel-hover); border-radius: 4px; }
        .line.short { width: 40%; }
        .line.long { width: 80%; }

        .dummy-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .stat-box {
          height: 60px;
          background: var(--bg-panel-hover);
          border-radius: 8px;
        }

        .dummy-list { display: flex; flex-direction: column; gap: 12px; }
        .list-item {
          height: 48px;
          background: var(--bg-panel-hover);
          border-radius: 8px;
        }

        .placeholder-content {
          height: 300px;
          border: 1px dashed var(--border-color);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          font-family: var(--font-chakra);
        }

        /* --- OPERATOR IDENTITY MODULE --- */
        .operator-body {
          gap: 24px;
        }

        .operator-profile {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .avatar-container {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 2px solid color-mix(in srgb, var(--neon-blue) 50%, transparent);
          padding: 4px;
          position: relative;
        }

        .avatar-container::after {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px dashed color-mix(in srgb, var(--neon-blue) 30%, transparent);
          animation: spin 20s linear infinite;
        }

        .avatar-img, .avatar-fallback {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-fallback {
          background: color-mix(in srgb, var(--neon-blue) 15%, transparent);
          color: var(--neon-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-cubao-wide);
          font-size: 28px;
        }

        .operator-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .operator-name {
          font-family: var(--font-chakra);
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.05em;
        }

        .operator-email {
          font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
          font-size: 12px;
          color: var(--text-secondary);
        }

        /* Service Bio Section */
        .bio-section {
          background: var(--bg-panel-hover);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bio-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .bio-label {
          font-family: var(--font-chakra);
          font-size: 10px;
          font-weight: 800;
          color: var(--text-secondary);
          letter-spacing: 0.15em;
        }

        .edit-bio-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-chakra);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: color 0.2s;
        }

        .edit-bio-btn:hover {
          color: var(--neon-blue);
        }

        .bio-text {
          font-family: var(--font-nunito);
          font-size: 14px;
          color: var(--text-primary);
          line-height: 1.5;
          margin: 0;
        }

        .bio-edit-mode {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bio-input {
          background: var(--bg-base);
          border: 1px solid var(--neon-blue);
          border-radius: 8px;
          padding: 12px;
          color: var(--text-primary);
          font-family: var(--font-nunito);
          font-size: 14px;
          resize: none;
          outline: none;
          box-shadow: inset 0 0 10px color-mix(in srgb, var(--neon-blue) 10%, transparent);
        }

        .bio-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .small-btn {
          padding: 8px 16px;
          font-size: 11px;
        }

        /* --- TELEMETRY MODULE STYLES --- */
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

        /* --- PIN LIST STYLES --- */
        .pin-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pin-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-panel-hover);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.2s ease;
        }

        .pin-list-item:hover {
          border-color: color-mix(in srgb, var(--text-secondary) 50%, transparent);
          background: color-mix(in srgb, var(--bg-panel-hover) 80%, var(--border-color));
        }

        .pin-info-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .list-diamond {
          width: 32px;
          height: 32px;
          transform: rotate(45deg);
          border: 1.5px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px var(--border-color);
        }

        .list-diamond span {
          transform: rotate(-45deg);
          font-family: var(--font-cubao-wide);
          font-size: 14px;
        }

        /* Text Block */
        .pin-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pin-title {
          font-family: var(--font-chakra);
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.05em;
        }

        .pin-coords {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 11px;
          color: var(--text-secondary);
          letter-spacing: 0.05em;
        }

        /* Locate Button */
        .locate-btn {
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

        .locate-btn:hover {
          background: color-mix(in srgb, var(--neon-blue) 15%, transparent);
          border-color: var(--neon-blue);
          color: var(--neon-blue);
          transform: scale(1.05);
        }

        .locate-btn:active {
          transform: scale(0.95);
        }

        /* Verification Integrity */
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

        /* Custom Scrollbar */
        .custom-vertical-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-vertical-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-vertical-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }

        /* --- MOBILE RESPONSIVENESS --- */
        @media (max-width: 768px) {
          
          .mobile-overlay {
            position: fixed;
            inset: 0;
            background: var(--border-color);
            backdrop-filter: blur(4px);
            z-index: 99;
          }

          .hamburger-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .dashboard-header {
            padding: 0 16px;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .content-area {
            padding: 24px 16px;
          }
        }
      `}</style>
		</div>
	);
}
