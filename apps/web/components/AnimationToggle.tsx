import { useAnimationPreference } from "../hooks/usePreferences"; // Adjust this path!

export function AnimationToggle() {
    const { animationsEnabled, setAnimationsEnabled } = useAnimationPreference();

    return (
        <button
            type="button"
            className="w-full text-left px-4 py-3 bg-transparent border-none rounded-lg text-secondary font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 hover:bg-panel-hover hover:text-primary flex justify-between items-center"
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
        >
            <span>ANIMATIONS</span>
            <div className="flex items-center gap-1.5 font-chakra text-[11px] font-extrabold">
                {animationsEnabled ? (
                    <>
                        {/* ON Icon (Lightning Bolt) */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--status-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        <span style={{ color: "var(--status-success)" }}>ON</span>
                    </>
                ) : (
                    <>
                        {/* OFF Icon (Crossed Lightning Bolt) */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" opacity="0.3" />
                            <line x1="2" y1="2" x2="22" y2="22" stroke="var(--status-danger)" />
                        </svg>
                        <span style={{ color: "var(--text-secondary)" }}>OFF</span>
                    </>
                )}
            </div>
        </button>
    );
}