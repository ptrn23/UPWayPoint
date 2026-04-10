import { useLanguage } from "@/hooks/useLanguage";

export function ThemeToggle({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) {
    const { t } = useLanguage();


    return (
        <button
            type="button"
            className="w-full text-left px-4 py-3 bg-transparent border-none rounded-lg text-secondary font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 hover:bg-panel-hover hover:text-primary flex justify-between items-center"
            onClick={toggleTheme}
        >
            <span>{t("settings.theme")}</span>
            <div className="flex items-center gap-1.5 font-chakra text-[11px] font-extrabold">
                {theme === "dark" ? (
                    <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--theme-moon)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                        <span style={{ color: "var(--theme-moon)" }}>{t("settings.theme.night")}</span>
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
                        <span style={{ color: "var(--theme-sun)" }}>{t("settings.theme.day")}</span>
                    </>
                )}
            </div>
        </button>
    );
}