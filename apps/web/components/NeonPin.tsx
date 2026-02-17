import { Pin } from "@/types/waypoint";

interface NeonPinProps {
  pin: Pin;
  isSelected: boolean;
  isLocked: boolean;
  isVisible: boolean;
  onClick: () => void;
}

export function NeonPin({ pin, isSelected, isLocked, isVisible, onClick }: NeonPinProps) {
  const getColor = () => {
    switch (pin.type) {
      case "academic": return "var(--neon-maroon, #ff0000)";
      case "food": return "var(--neon-green, #00ff00)";
      case "social": return "var(--neon-pink, #ff00ff)";
      case "transit": return "var(--neon-yellow, #ffff00)";
      case "utility": return "var(--neon-blue, #0000ff)";
      default: return "white";
    }
  };

  const color = getColor();
  const baseScale = isVisible ? (isSelected ? 1.2 : 1) : 0;
  const opacity = isVisible ? 1 : 0;
  const pointerEvents = isVisible ? "auto" : "none";

  return (
      <div
        className="pin-interactive-area"
        onClick={(e) => {
          e.stopPropagation();
          if (isVisible) onClick();
        }}
        style={{
          width: "44px", height: "44px",
          display: "flex", justifyContent: "center", alignItems: "center",
          cursor: isVisible ? "pointer" : "default",
          pointerEvents: pointerEvents as any,
          transform: `scale(${baseScale})`, 
          opacity: opacity,
          transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease"
        }}
      >
        {/* diamond shape */}
        <div style={{
          width: "100%", height: "100%",
          transform: "rotate(45deg)",
          border: `2px solid ${color}`,
          backgroundColor: isSelected ? color : "rgba(3, 3, 4, 0.6)",
          boxShadow: isLocked 
            ? `0 0 30px 5px ${color}` 
            : isSelected ? `0 0 15px ${color}` : `none`, 
          display: "flex", justifyContent: "center", alignItems: "center",
          transition: "all 0.3s ease"
        }}>
          {/* icon */}
          <div style={{
            transform: "rotate(-45deg)",
            fontSize: "18px",
            color: isSelected ? "#000" : color,
            fontWeight: "bold"
          }}>
            {pin.icon}
          </div>
        </div>
      </div>
  );
}