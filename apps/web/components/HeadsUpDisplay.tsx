import { Pin } from "@/types/waypoint";
import { getFilterColor } from "@/components/TopBar";
import { PinDetailsCard } from "@/components/PinDetailsCard";

interface HUDProps {
  selectedPin: Pin | null;
  onLockClick: () => void;
  isLocked: boolean;
  onClearSelection?: () => void;
}

export function HeadsUpDisplay({ selectedPin, onLockClick, isLocked, onClearSelection }: HUDProps) {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 90, // lower than TopBar if needed
      display: "flex", flexDirection: "column", justifyContent: "flex-end"
    }}>
      
      {/* BOTTOM SECTION */}
      <div style={{ 
        padding: "20px", 
        pointerEvents: "auto", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: "10px",
        marginBottom: "20px" 
      }}>
        
        {/* RADAR / PROXIMITY (Only if NO pin is selected) */}
        {!selectedPin && (
          <div className="radar-container" style={{
            background: "rgba(3, 3, 4, 0.6)",
            backdropFilter: "blur(10px)",
            padding: "10px 15px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            gap: "20px",
            animation: "fadeIn 0.5s ease-out"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ color: "var(--neon-maroon)", animation: "pulse 2s infinite" }}>▲</div>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "14px", color: "white" }}>Quezon Hall</div>
                <div style={{ fontSize: "12px", color: "#888" }}>150m NE</div>
              </div>
            </div>
          </div>
        )}

        {/* DETAILS CARD (Only if pin IS selected) */}
        {selectedPin && (
          <PinDetailsCard 
            pin={selectedPin} 
            isLocked={isLocked} 
            onLockClick={onLockClick} 
            onClose={onClearSelection}
          />
        )}
      </div>
    </div>
  );
}