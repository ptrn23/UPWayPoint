import { getFilterColor } from "@/components/TopBar";

interface HUDProps {
  selectedPin: any;
  onLockClick: () => void;
  isLocked: boolean;
}

export function HeadsUpDisplay({ selectedPin, onLockClick, isLocked }: HUDProps) {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 90, // Lower than TopBar if needed
      display: "flex", flexDirection: "column", justifyContent: "flex-end" // Align to bottom
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
          <div className="details-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0, color: "white" }}>
                  {selectedPin.title || selectedPin.name}
                </h2>
                <span style={{ 
                  fontSize: "11px", 
                  textTransform: "uppercase", 
                  color: getFilterColor(selectedPin.type), 
                  letterSpacing: "2px",
                  fontWeight: "800"
                }}>
                  {selectedPin.type}
                </span>
              </div>
            </div>
            
            <p style={{ 
                fontSize: "14px", 
                color: "#ccc", 
                margin: "12px 0",
                lineHeight: "1.4"
            }}>
                {selectedPin.description || selectedPin.desc}
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="lock-button"
                onClick={onLockClick}
                style={{
                  flex: 1, padding: "14px", borderRadius: "10px", border: "none",
                  background: isLocked ? "var(--neon-blue, #00D1FF)" : "white",
                  color: "black", fontWeight: "900", cursor: "pointer",
                  letterSpacing: "1px", transition: "all 0.2s"
                }}
              >
                {isLocked ? "TARGET LOCKED" : "LOCK TARGET"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}