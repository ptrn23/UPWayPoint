"use client";

import { Pin } from "@/types/waypoint";
import { getFilterColor } from "@/components/TopBar";

interface ExpandedPinViewProps {
  pin: Pin;
  onClose: () => void;
}

export function ExpandedPinView({ pin, onClose }: ExpandedPinViewProps) {
  const color = getFilterColor(pin.type);
  const mockTime = "2026-02-21 11:45 AM PST";

  const mockImages = [
    { id: 1, size: "large" },
    { id: 2, size: "small" },
    { id: 3, size: "small" },
    { id: 4, size: "large" },
    { id: 5, size: "small" },
    { id: 6, size: "small" },
    { id: 7, size: "large" },
  ];

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

        {/* HORIZONTAL BENTO GALLERY */}
        <div className="photo-gallery custom-scrollbar">
          {mockImages.map((img) => (
            <div key={img.id} className={`photo-placeholder ${img.size}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
          ))}
        </div>

        {/* BODY: INTEL DASHBOARD */}
        <div className="modal-body">
          <p className="description">{pin.description}</p>

          <div className="meta-grid">
            {/* PIN ID */}
            <div className="meta-item">
              <span className="meta-label">PIN ID</span>
              <span className="meta-value font-mono">{pin.id.padStart(7, '0')}</span>
            </div>

            {/* OWNER */}
            <div className="meta-item">
              <span className="meta-label">OWNED BY</span>
              <span className="meta-value text-muted">Unclaimed</span>
            </div>

            {/* COORDINATES */}
            <div className="meta-item col-span-2">
              <span className="meta-label">COORDINATES (LAT, LNG)</span>
              <span className="meta-value font-mono">
                {pin.position.lat.toFixed(6)}, {pin.position.lng.toFixed(6)}
              </span>
            </div>

            {/* STATUS */}
            <div className="meta-item">
              <span className="meta-label">STATUS</span>
              <span className="meta-value text-neon-green">VERIFIED</span>
            </div>

            {/* RATING */}
            <div className="meta-item">
              <span className="meta-label">AVG RATING</span>
              <span className="meta-value text-neon-yellow">★ 5.0 / 5.0</span>
            </div>

            {/* TIMESTAMPS */}
            <div className="meta-item">
              <span className="meta-label">CREATED AT</span>
              <span className="meta-value">{mockTime}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">LAST UPDATED</span>
              <span className="meta-value">{mockTime}</span>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed; inset: 0; 
          background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);
          z-index: 200; display: flex; align-items: center; justify-content: center;
          padding: 24px; animation: fadeIn 0.2s ease-out; pointer-events: auto;
        }

        .modal-content {
          background: rgba(10, 10, 12, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-top: 4px solid ${color}; border-radius: 24px;
          width: 100%; max-width: 500px; padding: 28px;
          display: flex; flex-direction: column;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
          animation: scalePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          max-height: 90vh; overflow-y: auto; /* Ensures card scrolls if screen is small */
        }
        .modal-content::-webkit-scrollbar { display: none; }

        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .badge { font-family: var(--font-chakra); font-size: 12px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; }
        h2 { font-family: var(--font-chakra); color: white; font-size: 26px; font-weight: 800; margin: 4px 0 0 0; }
        
        .close-btn {
          background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%; width: 44px; height: 44px; color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
          flex-shrink: 0;
        }
        .close-btn:active { transform: scale(0.9); background: rgba(255, 255, 255, 0.1); }

        .photo-gallery {
          display: grid;
          grid-template-rows: repeat(2, 90px);
          grid-auto-flow: column;
          gap: 12px;
          margin-bottom: 24px;
          overflow-x: auto;
          overscroll-behavior-x: contain;
          padding-bottom: 8px;
          scroll-snap-type: x mandatory;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }

        .photo-placeholder {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          scroll-snap-align: start;
          position: relative;
          overflow: hidden;
        }

        .photo-placeholder::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          animation: shimmer 2s infinite;
        }

        .photo-placeholder.large {
          grid-row: span 2; /* Spans both rows (192px tall including gap) */
          width: 192px;
        }

        .photo-placeholder.small {
          grid-row: span 1; /* Spans 1 row (90px tall) */
          width: 140px;
        }

        .custom-scrollbar::-webkit-scrollbar {
          height: 6px; /* Thin horizontal scrollbar */
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          transition: background 0.2s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3); /* Highlights when hovered */
        }

        .modal-body { display: flex; flex-direction: column; gap: 24px; }
        .description { font-family: var(--font-nunito); font-size: 15px; color: #ccc; line-height: 1.5; margin: 0; }
        
        .meta-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
          background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px; padding: 20px;
        }
        .meta-item { display: flex; flex-direction: column; gap: 4px; }
        .col-span-2 { grid-column: span 2; } 

        .meta-label { font-family: var(--font-chakra); font-size: 10px; font-weight: 800; color: #666; letter-spacing: 0.1em; }
        .meta-value { font-family: var(--font-nunito); font-size: 14px; font-weight: 700; color: #eee; }

        .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; letter-spacing: 0.05em; }
        .text-muted { color: #888; font-style: italic; }
        .text-neon-green { color: var(--neon-green, #00FF99); text-shadow: 0 0 10px rgba(0, 255, 153, 0.3); }
        .text-neon-yellow { color: var(--neon-yellow, #FFD700); text-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scalePop { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes shimmer { 100% { left: 200%; } }
      `}</style>
    </div>
  );
}