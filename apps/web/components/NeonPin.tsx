import type { PinRouterOutputs } from "@repo/api";
import { getPinColor } from "@/data/pin-categories";
type Pin = PinRouterOutputs["getAll"][number];

interface NeonPinProps {
  pin: Pin;
  isSelected: boolean;
  isLocked: boolean;
  isVisible: boolean;
  onClick: () => void;
}

export function NeonPin({
  pin,
  isSelected,
  isLocked,
  isVisible,
  onClick,
}: NeonPinProps) {
  const color = getPinColor(pin?.pinTags[0]?.tag.title || "");

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className={`w-11 h-11 flex justify-center items-center transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
        isVisible
          ? "cursor-pointer pointer-events-auto opacity-100"
          : "cursor-default pointer-events-none opacity-0"
      } ${isVisible ? (isSelected ? "scale-[1.2]" : "scale-100") : "scale-0"}`}
      onClick={(e) => {
        e.stopPropagation();
        if (isVisible) onClick();
      }}
    >
      {/* diamond shape */}
      <div
        className="w-full h-full rotate-45 border-2 flex justify-center items-center transition-all duration-300 ease-out"
        style={{
          borderColor: color,
          backgroundColor: isSelected ? color : "var(--bg-panel)",
          boxShadow: isLocked
            ? `0 0 30px 5px ${color}`
            : isSelected
              ? `0 0 15px ${color}`
              : `none`,
        }}
      >
        {/* icon */}
        <div
          className="-rotate-45 text-[18px] font-cubao-wide"
          style={{
            color: isSelected ? "var(--bg-base)" : color,
          }}
        >
          {pin?.title[0]?.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
