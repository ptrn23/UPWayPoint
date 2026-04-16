"use client";

import { getPinColor } from "@/data/pin-categories";
import { trpc } from "@/lib/trpc";
import { clsxm } from "@repo/ui/clsxm";

interface PinDetailsCardProps {
  pinId: string;
  isLocked: boolean;
  isNavigating?: boolean;
  onLockClick: () => void;
  onNavigateClick: () => void;
  onClose?: () => void;
  onExpand: () => void;
}

export function PinDetailsCard({
  pinId,
  isLocked,
  isNavigating = false,
  onLockClick,
  onNavigateClick,
  onClose,
  onExpand,
}: PinDetailsCardProps) {
  const { data: pin, isLoading: isPinLoading } =
    trpc.pin.getSimpleById.useQuery(
      { id: pinId },
      { refetchOnWindowFocus: false },
    );
  const color = getPinColor(
    pin?.pinTags ? pin?.pinTags[0]?.tag.title || "" : "",
  );

  if (isPinLoading)
    return (
      <div
        className="p-[24px] w-full max-w-[400px] flex flex-col gap-[16px] bg-[var(--bg-panel)] backdrop-filter-[blur(20px)] border border-solid border-[1px] border-[var(--border-color)] border-t-[3px] rounded-[20px] shadow-[0_20px_40px_[var(--border-color)]]"
        style={{
          borderTop: "3px solid black",
          animation:
            "slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), pulse 1s ease-in-out infinite",
          minHeight: "156px",
        }}
      ></div>
    );

  return (
    <div
      className="p-6 w-full z-[25] max-w-[400px] flex flex-col gap-4 bg-panel backdrop-blur-[20px] border border-border-color border-t-[3px] rounded-[20px] shadow-[0_20px_40px_var(--border-color)] animate-[slideUp_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]"
      style={{ borderTopColor: color }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h2 className="font-chakra text-[20px] font-extrabold text-primary m-0">
            {pin?.title}
          </h2>
          <span
            className="font-cubao-wide text-[11px] uppercase tracking-[0.1em]"
            style={{ color: color }}
          >
            {pin?.pinTags?.map((pt) => pt.tag.title).join(", ")}
          </span>
        </div>

        {/* close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="bg-transparent border-none text-secondary cursor-pointer p-1 flex items-center justify-center transition-colors duration-200 hover:text-primary"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* BODY */}
      <div>
        <p className="font-nunito text-[14px] text-primary m-0 leading-relaxed">
          {pin?.description}
        </p>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex gap-2 mt-2 w-full">
        {/* DETAILS BUTTON */}
        <button
          type="button"
          className="flex flex-1 justify-center items-center gap-1.5 px-2 py-3 rounded-xl bg-transparent border border-border-color text-primary font-chakra font-black text-[11px] sm:text-[12px] tracking-[0.05em] cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-panel-hover active:scale-95 min-w-0"
          onClick={onExpand}
        >
          <span className="truncate">DETAILS</span>
        </button>

        {/* TRACK BUTTON */}
        <button
          type="button"
          className={clsxm(
            "flex flex-1 justify-center items-center gap-1.5 px-2 py-3 rounded-xl border border-transparent font-chakra font-black text-[11px] sm:text-[12px] tracking-[0.05em] cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] active:scale-95 min-w-0 text-[color:var(--bg-base)]",
            isLocked ? "bg-primary/60 scale-95" : "bg-primary hover:opacity-90"
          )}
          onClick={onLockClick}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d={isLocked ? "M7 11V7a5 5 0 0 1 10 0v4" : "M7 11V7a5 5 0 0 1 9.9-1"} />
          </svg>
          <span className="truncate">{isLocked ? "TRACKING" : "TRACK"}</span>
        </button>

        {/* NAVIGATE BUTTON */}
        <button
          type="button"
          className={clsxm(
            "flex flex-1 justify-center items-center gap-1.5 px-2 py-3 rounded-xl border border-transparent font-chakra font-black text-[11px] sm:text-[12px] tracking-[0.05em] cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] active:scale-95 min-w-0 text-[color:var(--bg-base)]",
            isNavigating ? "bg-neon-blue" : "bg-primary hover:opacity-90"
          )}
          onClick={onNavigateClick}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={clsxm("shrink-0", isNavigating && "animate-pulse")}>
            {isNavigating ? (
              <>
                <circle cx="12" cy="5" r="2" />
                <path d="m9 20 3-6 3 6" />
                <path d="m6 8 6 2 6-2" />
                <path d="M12 10v4" />
              </>
            ) : (
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            )}
          </svg>
          <span className="truncate">{isNavigating ? "NAVIGATING" : "NAVIGATE"}</span>
        </button>
      </div>
    </div>
  );
}
