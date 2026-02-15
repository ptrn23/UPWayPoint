import { Pin } from "@/types/waypoint";

interface NeonPinProps {
  pin: Pin;
  isSelected: boolean;
  isLocked: boolean;
  onClick: () => void;
}

export function NeonPin({ pin, isSelected, isLocked, onClick }: NeonPinProps) {
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

  return (
      <div
        className="pin-interactive-area"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        style={{
          width: "44px", height: "44px",
          display: "flex", justifyContent: "center", alignItems: "center",
          cursor: "pointer",
          transform: isSelected ? "scale(1.2)" : "scale(1)", 
          transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
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