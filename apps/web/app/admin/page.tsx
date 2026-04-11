"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { PIN_CATEGORIES, getPinColor } from "@/data/pin-categories";
import { useTheme } from "@/lib/ThemeContext";
import Link from "next/link";
import type { PinDiffType } from "@/types/pins";
import { DiffsModal } from "@/components/DiffsModal";
import { PinRouterOutputs } from "@repo/api";
import { AnimationToggle } from "@/components/AnimationToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/hooks/useLanguage";

export default function AdminDashboard() {
  const router = useRouter();
  const { t } = useLanguage();

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
    onSuccess: () => {
      utils.pin.getAllAdmin.invalidate();
      utils.modification.getPending.invalidate();
    },
  });
  const approvePin = trpc.pin.approve.useMutation({
    onSuccess: () => {
      utils.pin.getAll.invalidate();
      utils.pin.getAllAdmin.invalidate();
      utils.modification.getPending.invalidate();
    },
  });

  const deletePin = trpc.pin.adminDelete.useMutation({
    onSuccess: () => {
      utils.pin.getAllAdmin.invalidate();
    },
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const [isDeletingPin, setIsDeletingPin] = useState(false);
  const [modId, setModId] = useState<string>("");
  const [diffs, setDiffs] = useState<PinDiffType | undefined>();
  const [current, setCurrent] = useState<
    PinRouterOutputs["getSimpleById"] | undefined
  >();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
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
              {t("admin.control")}
            </span>

            <button
              type="button"
              className="text-left px-4 py-3 font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 bg-transparent text-secondary border-none rounded-lg hover:bg-panel-hover hover:text-primary"
              onClick={() => scrollToSection("overview")}
            >
              {t("user.overview")}
            </button>

            <button
              type="button"
              className="text-left px-4 py-3 font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 bg-transparent text-secondary border-none rounded-lg hover:bg-panel-hover hover:text-primary"
              onClick={() => scrollToSection("pin-management")}
            >
              {t("admin.pin-management")}
            </button>

            {/* <button
							type="button"
							className={`nav-item ${activeSection === "user-management" ? "active" : ""}`}
							onClick={() => scrollToSection("user-management")}
						>
							{t("admin.user-management")}
						</button> */}

            <button
              type="button"
              className="text-left px-4 py-3 bg-transparent border-none rounded-lg text-secondary font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 hover:bg-panel-hover hover:text-primary"
              onClick={goToMap}
            >
              {t("user.goto.map")}
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-6">
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
            <h1 className="font-chakra text-[16px] font-bold m-0 tracking-[0.05em] text-pin-social">
              {t("admin.dashboard")}
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
                  : `Welcome, ${data?.name ? data.name.toUpperCase() : t("user.admin")}!`}
              </h2>
              <p className="font-nunito text-[15px] text-secondary m-0">
                {t("admin.message")}
              </p>
            </div>

            <div className="flex flex-col gap-16">
              <section id="overview" className="scroll-mt-6">
                <h2 className="font-chakra text-[20px] font-bold text-primary tracking-[0.1em] m-0 mb-6 pb-3 border-b border-border-color">
                  {t("user.overview")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-panel border border-border-color rounded-[16px] p-6 flex flex-col gap-5 transition-transform transition-shadow duration-200">
                    <div className="flex justify-between items-center border-b border-border-color pb-3">
                      <h3 className="font-chakra text-[14px] font-extrabold text-secondary tracking-[0.15em] m-0">
                        {t("admin.pin.statistics")}
                      </h3>
                    </div>
                    <div className="flex-1 flex flex-col gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-panel-hover border border-border-color rounded-xl p-4 flex flex-col gap-1">
                          <span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.15em]">
                            {t("admin.total.pins")}
                          </span>
                          <span className="font-cubao-wide text-[32px] text-primary tracking-[0.05em]">
                            {totalPins}
                          </span>
                        </div>
                        <div className="bg-panel-hover border border-border-color rounded-xl p-4 flex flex-col gap-1">
                          <span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.15em]">
                            {t("admin.pending.pins")}
                          </span>
                          <span
                            className="font-cubao-wide text-[32px] text-primary tracking-[0.05em]"
                            style={{ color: "var(--status-warning)" }}
                          >
                            {pendingPinCount}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                          <span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.15em]">
                            {t("admin.global.verification")}
                          </span>
                          <span className="font-chakra text-[14px] font-extrabold text-status-success">
                            {globalVerificationRate}%
                          </span>
                        </div>
                        <div className="h-[6px] bg-panel-hover rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
                            style={{
                              width: `${globalVerificationRate}%`,
                              background: "var(--status-success)",
                              boxShadow:
                                "0 0 10px color-mix(in srgb, var(--status-success) 50%, transparent)",
                            }}
                          ></div>
                        </div>
                        <div className="flex gap-3 font-chakra text-[10px] font-bold tracking-[0.05em] mt-1">
                          <span className="text-status-success">
                            {activePinCount} {t("user.verified")}
                          </span>
                          <span className="text-status-warning">
                            {pendingPinCount} {t("user.pending")}
                          </span>
                          <span className="text-status-danger">
                            {rejectedPinCount} {t("user.rejected")}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2.5">
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
                        {t("admin.user.statistics")}
                      </h3>
                    </div>
                    <div className="flex-1 flex flex-col gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-panel-hover border border-border-color rounded-xl p-4 flex flex-col gap-1">
                          <span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.15em]">
                            {t("admin.total.users")}
                          </span>
                          <span className="font-cubao-wide text-[32px] text-primary tracking-[0.05em]">
                            {globalUserStats.totalUsers}
                          </span>
                        </div>
                        <div className="bg-panel-hover border border-border-color rounded-xl p-4 flex flex-col gap-1">
                          <span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.15em]">
                            {t("admin.total.comments")}
                          </span>
                          <span className="font-cubao-wide text-[32px] text-primary tracking-[0.05em]">
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
                <h2 className="font-chakra text-[20px] font-bold text-primary tracking-[0.1em] m-0 mb-6 pb-3 border-b border-border-color">
                  {t("admin.pin-management")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-panel border border-border-color rounded-[16px] p-6 flex flex-col gap-5 transition-transform transition-shadow duration-200">
                    <div className="flex justify-between items-center border-b border-border-color pb-3">
                      <h3 className="font-chakra text-[14px] font-extrabold text-secondary tracking-[0.15em] m-0">
                        {t("admin.pending.pins")}
                      </h3>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex flex-col gap-3">
                        {pendingPins?.map((pin) => {
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
                                    By {pin.owner} • {pin.latitude.toFixed(4)},{" "}
                                    {pin.longitude.toFixed(4)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
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

                                <button
                                  type="button"
                                  title="Reject Pin"
                                  className="w-9 h-9 bg-transparent border border-border-color rounded-lg flex items-center justify-center text-secondary cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-status-danger/15 hover:border-status-danger hover:text-status-danger hover:scale-105 active:scale-95"
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
                                  className="w-9 h-9 bg-transparent border border-border-color rounded-lg flex items-center justify-center text-secondary cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-status-success/15 hover:border-status-success hover:text-status-success hover:scale-105 active:scale-95"
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

                  <div className="bg-panel border border-border-color rounded-[16px] p-6 flex flex-col gap-5 transition-transform transition-shadow duration-200">
                    <div className="flex justify-between items-center border-b border-border-color pb-3">
                      <h3 className="font-chakra text-[14px] font-extrabold text-secondary tracking-[0.15em] m-0">
                        {t("admin.recently.verified.pins")}
                      </h3>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex flex-col gap-3">
                        {activePins?.map((pin) => {
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
                                    By {pin.owner} • {pin.latitude.toFixed(4)},{" "}
                                    {pin.longitude.toFixed(4)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
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
                                {isDeletingPin ? (
                                  <>
                                    <button
                                      type="button"
                                      className="w-9 h-9 bg-transparent border border-border-color rounded-lg flex items-center justify-center text-secondary cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-status-danger/15 hover:border-status-danger hover:text-status-danger hover:scale-105 active:scale-95"
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
                                      className="w-9 h-9 bg-transparent border border-border-color rounded-lg flex items-center justify-center text-secondary cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-status-success/15 hover:border-status-success hover:text-status-success hover:scale-105 active:scale-95"
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
                                    className="w-9 h-9 bg-transparent border border-border-color rounded-lg flex items-center justify-center text-secondary cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-status-danger/15 hover:border-status-danger hover:text-status-danger hover:scale-105 active:scale-95"
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

                  <div className="bg-panel border border-border-color rounded-[16px] p-6 flex flex-col gap-5 transition-transform transition-shadow duration-200">
                    <div className="flex justify-between items-center border-b border-border-color pb-3">
                      <h3 className="font-chakra text-[14px] font-extrabold text-secondary tracking-[0.15em] m-0">
                        {t("admin.pending.modifications")}
                      </h3>
                    </div>

                    {diffs && (
                      <DiffsModal
                        onCancel={() => setDiffs(undefined)}
                        current={current}
                        diffs={diffs}
                        modId={modId}
                      />
                    )}
                    <div className="flex-1 flex flex-col">
                      <div className="flex flex-col gap-3">
                        {pendingModifications?.map((mod) => {
                          const color = "var(--text-primary)";
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
                                    {t("admin.modification.by")} {mod.user.name}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
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
                                    setModId(mod.id);
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
              </section>

              {/* <section id="user-management" className="scroll-mt-6">
								<h2 className="font-chakra text-[20px] font-bold text-primary tracking-[0.1em] m-0 mb-6 pb-3 border-b border-border-color">USER MANAGEMENT</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="bg-panel border border-border-color rounded-[16px] p-6 flex flex-col gap-5 transition-transform transition-shadow duration-200">
										<div className="flex justify-between items-center border-b border-border-color pb-3">
											<h3 className="font-chakra text-[14px] font-extrabold text-secondary tracking-[0.15em] m-0">NEWEST USERS</h3>
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

									<div className="bg-panel border border-border-color rounded-[16px] p-6 flex flex-col gap-5 transition-transform transition-shadow duration-200">
										<div className="flex justify-between items-center border-b border-border-color pb-3">
											<h3 className="font-chakra text-[14px] font-extrabold text-secondary tracking-[0.15em] m-0">TOP USERS BY PINS</h3>
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
    </div>
  );
}
