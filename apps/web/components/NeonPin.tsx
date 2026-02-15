import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Pin } from "@/types/waypoint";

interface NeonPinProps {
  pin: Pin;
  isSelected: boolean;
  isLocked: boolean;
}

export function NeonPin({ pin, isSelected, isLocked }: NeonPinProps) {
  const getColor = () => {
    switch (pin.type) {
      case "academic": return "var(--neon-maroon)";
      case "food": return "var(--neon-green)";
      case "social": return "var(--neon-pink)";
      case "transit": return "var(--neon-yellow)";
      case "utility": return "var(--neon-blue)";
      default: return "white";
    }
  };

  const color = getColor();

  return (
    <AdvancedMarker position={pin.position}>
      <div
        style={{
          width: "44px", height: "44px",
          display: "flex", justifyContent: "center", alignItems: "center",
          cursor: "pointer",
          transform: isSelected ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.2s ease"
        }}
      >
        {/* diamond shape */}
        <div style={{
          width: "100%", height: "100%",
          transform: "rotate(45deg)",
          border: "2px solid",
          borderColor: color,
          backgroundColor: isSelected ? color : "rgba(0,0,0,0.2)", // fill if selected
          boxShadow: isLocked ? `0 0 30px ${color}` : `0 0 10px ${color}`, // glow if locked
          display: "flex", justifyContent: "center", alignItems: "center",
          transition: "all 0.3s"
        }}>
          {/* icon */}
          <div style={{
            transform: "rotate(-45deg)",
            fontSize: "18px",
            color: isSelected ? "black" : color, // contrast text if filled
            fontWeight: "bold"
          }}>
            {pin.icon}
          </div>
        </div>
      </div>
    </AdvancedMarker>
  );
}