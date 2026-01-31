import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface NeonPinProps {
  position: { lat: number; lng: number };
  type: "academic" | "food" | "social" | "transit";
  icon: string;
  isSelected: boolean;
  isLocked: boolean;
  onClick: () => void;
}

export function NeonPin({ position, type, icon, isSelected, isLocked, onClick }: NeonPinProps) {
  const getColor = () => {
    switch (type) {
      case "academic": return "var(--neon-maroon)";
      case "food": return "var(--neon-green)";
      case "social": return "var(--neon-pink)";
      case "transit": return "var(--neon-yellow)";
      default: return "white";
    }
  };

  const color = getColor();

  return (
    <AdvancedMarker position={position} onClick={onClick}>
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
            {icon}
          </div>
        </div>
      </div>
    </AdvancedMarker>
  );
}