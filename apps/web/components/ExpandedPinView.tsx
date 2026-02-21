"use client";

import { Pin } from "@/types/waypoint";
import { getFilterColor } from "@/components/TopBar";

interface ExpandedPinViewProps {
  pin: Pin;
  onClose: () => void;
}

export function ExpandedPinView({ pin, onClose }: ExpandedPinViewProps) {
  const color = getFilterColor(pin.type);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <span className="badge" style={{ color }}>{pin.type}</span>
            <h2>{pin.title}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* EMPTY BODY FOR FUTURE FEATURES */}
        <div className="modal-body">
          <div className="placeholder-box">
            <p>Full location intel will go here.</p>
            <p className="sub-text">(Images, Hours, Reviews, Routing)</p>
          </div>
        </div>

      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0; /* Stretches to all 4 corners of the screen */
          background: rgba(0, 0, 0, 0.6); /* Blackens the map */
          backdrop-filter: blur(8px); /* Blurs the map */
          z-index: 200; /* Extremely high z-index to sit on top of everything */
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease-out;
          pointer-events: auto; /* Captures clicks so you can't click the map */
        }

        .modal-content {
          background: rgba(10, 10, 12, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-top: 4px solid ${color};
          border-radius: 24px;
          width: 100%;
          max-width: 500px;
          min-height: 400px; /* Gives it a nice chunky size for now */
          padding: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
          animation: scalePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .badge {
          font-family: var(--font-chakra);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        h2 {
          font-family: var(--font-chakra);
          color: white;
          font-size: 24px;
          font-weight: 800;
          margin: 4px 0 0 0;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn:active {
          transform: scale(0.9);
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-body {
          flex: 1;
          display: flex;
        }

        .placeholder-box {
          flex: 1;
          border: 2px dashed rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #888;
          font-family: var(--font-nunito);
          text-align: center;
        }

        .sub-text { font-size: 12px; opacity: 0.5; margin-top: 8px; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scalePop { 
          from { opacity: 0; transform: scale(0.95) translateY(20px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }
      `}</style>
    </div>
  );
}