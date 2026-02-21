"use client";

import { Pin } from "@/types/waypoint";
import { getFilterColor } from "@/components/TopBar";

interface PinDetailsCardProps {
  pin: Pin;
  isLocked: boolean;
  onLockClick: () => void;
  onClose?: () => void;
}

export function PinDetailsCard({ pin, isLocked, onLockClick, onClose }: PinDetailsCardProps) {
  const color = getFilterColor(pin.type);

  return (
    <div className="details-card">
      {/* HEADER */}
      <div className="card-header">
        <div>
          <h2>{pin.title}</h2>
          <span className="badge" style={{ color: color }}>
            {pin.type}
          </span>
        </div>
        
        {/* Optional Close Button */}
        {onClose && (
          <button onClick={onClose} className="close-btn">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="card-body">
        <p>{pin.description}</p>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="card-footer">
        <button 
          className="lock-button"
          onClick={onLockClick}
          style={{
            background: isLocked ? "var(--neon-blue, #00D1FF)" : "white",
          }}
        >
          {isLocked ? "TARGET LOCKED" : "LOCK TARGET"}
        </button>
      </div>

      <style jsx>{`
        .details-card {
          background: rgba(10, 10, 12, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top: 3px solid ${color}; /* Dynamic top accent */
          border-radius: 20px;
          padding: 24px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          pointer-events: auto; /* Ensure card is clickable */
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        h2 {
          font-size: 20px;
          font-weight: 800;
          margin: 0 0 4px 0;
          color: white;
          font-family: var(--font-chakra);
        }

        .badge {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 900;
          font-family: var(--font-chakra);
        }

        .close-btn {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          color: white;
        }

        .card-body p {
          font-size: 14px;
          color: #ccc;
          margin: 0;
          line-height: 1.5;
          font-family: var(--font-nunito);
        }

        .card-footer {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }

        .lock-button {
          flex: 1;
          padding: 14px;
          border-radius: 12px;
          border: none;
          color: black;
          font-weight: 900;
          font-family: var(--font-chakra);
          font-size: 13px;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .lock-button:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}