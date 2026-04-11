import { useLanguage } from "../hooks/useLanguage";

export function LanguageToggle() {
  const { langName, cycleLanguage, t } = useLanguage();

  return (
    <button
      type="button"
      className="w-full text-left px-4 py-3 bg-transparent border-none rounded-lg text-secondary font-chakra text-[13px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 hover:bg-panel-hover hover:text-primary flex justify-between items-center"
      onClick={cycleLanguage}
    >
      <span>{t("settings.language")}</span>
      <div className="flex items-center gap-1.5 font-chakra text-[11px] font-extrabold text-neon-blue">
        {/* Globe Icon */}
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
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span>{langName}</span>
      </div>
    </button>
  );
}
