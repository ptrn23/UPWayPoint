"use client";

import { useTheme } from "@/lib/ThemeContext";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { data: sessionData } = useSession();
  const router = useRouter();

  if (!isOpen) return null;

  const handleNavigation = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-border-color backdrop-blur-[4px] z-[400] animate-fade-in"
        onClick={onClose}
      ></div>

      {/* SIDEBAR PANEL */}
      <div className="fixed top-0 left-0 h-screen w-full max-w-[320px] bg-panel border-r border-border-color z-[401] flex flex-col shadow-[20px_0_50px_var(--border-color)] animate-slide-right">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-border-color">
          <h2 className="m-0 font-cubao-wide text-[20px] tracking-[0.1em] text-primary">
            UP WAYPOINT
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-transparent border-none text-secondary cursor-pointer flex items-center justify-center p-1 transition-colors duration-200 hover:text-primary shrink-0"
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-vertical-scrollbar">
          {/* PRIMARY ACTIONS */}
          <div className="flex flex-col gap-3">
            <span className="font-chakra text-[11px] font-extrabold text-secondary tracking-[0.15em]">
              SYSTEM ACCESS
            </span>
            <button
              type="button"
              className="w-full flex justify-between items-center px-4 py-3 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-lg font-chakra text-[13px] font-bold tracking-[0.05em] cursor-pointer transition-all duration-200 hover:bg-neon-blue hover:text-base hover:shadow-[0_0_15px_var(--shadow-glow)]"
              onClick={() =>
                handleNavigation(sessionData?.user ? "/dashboard" : "/sign-in")
              }
            >
              <span>
                {sessionData?.user ? "ACCESS DASHBOARD" : "SYSTEM LOGIN"}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          {/* SETTINGS */}
          <div className="flex flex-col gap-3">
            <span className="font-chakra text-[11px] font-extrabold text-secondary tracking-[0.15em]">
              DISPLAY SETTINGS
            </span>
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
        </div>

        {/* FOOTER */}
        <div className="py-5 px-6 border-t border-border-color flex justify-between font-chakra text-[10px] font-bold text-secondary tracking-[0.1em]">
          <span>UP WAYPOINT v1.3.0</span>
          <span>SYSTEM ONLINE</span>
        </div>
      </div>
    </>
  );
}
