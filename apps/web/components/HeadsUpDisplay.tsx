interface HUDProps {
  selectedPin: any;
  onLockClick: () => void;
  isLocked: boolean;
}

export function HeadsUpDisplay({ selectedPin, onLockClick, isLocked }: HUDProps) {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "space-between"
    }}>
      
      {/* TOP BAR */}
      <div style={{ padding: "20px", pointerEvents: "auto", display: "flex", justifyContent: "space-between" }}>
        <div className="hud-glass" style={{ padding: "8px 16px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", backdropFilter: "blur(5px)" }}>
          <span style={{ color: "var(--neon-green)" }}>●</span> ONLINE
        </div>
        <div className="hud-glass" style={{ width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--neon-blue)", fontWeight: "bold", backdropFilter: "blur(5px)" }}>
          UP
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div style={{ padding: "20px", pointerEvents: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        
        {/* RADAR */}
        {!selectedPin && (
          <div className="hud-glass" style={{ padding: "10px 15px", borderRadius: "12px", display: "flex", gap: "20px", boxShadow: "var(--shadow-hard)", backdropFilter: "blur(5px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", opacity: 1 }}>
              <div style={{ color: "var(--neon-maroon)" }}>▲</div>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "14px" }}>Quezon Hall</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>150m NE</div>
              </div>
            </div>
          </div>
        )}

        {/* DETAILS CARD */}
        {selectedPin && (
          <div style={{
            background: "var(--hud-glass-solid)", backdropFilter: "blur(20px)",
            border: "var(--hud-border)", borderRadius: "16px", padding: "20px",
            boxShadow: "var(--shadow-hard)", width: "100%", maxWidth: "400px",
            animation: "slideUp 0.3s ease-out", 
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>{selectedPin.name}</h2>
                <span style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "1px" }}>{selectedPin.type}</span>
              </div>
            </div>
            <p style={{ 
                fontSize: "14px", 
                color: "var(--text-muted)", 
                margin: "10px 0",
                fontFamily: "var(--font-nunito)" 
            }}>
                {selectedPin.desc}
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                onClick={onLockClick}
                style={{
                  flex: 1, padding: "12px", borderRadius: "8px", border: "none",
                  background: isLocked ? "var(--neon-blue)" : "white",
                  color: "black", fontWeight: "bold", cursor: "pointer"
                }}
              >
                {isLocked ? "UNLOCK TARGET" : "LOCK TARGET"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}