"use client";

import { useState } from "react";
import { Pin } from "@/types/waypoint";
import { getFilterColor } from "@/components/TopBar";
import { PinDetailsCard } from "@/components/PinDetailsCard";
import { ExpandedPinView } from "@/components/ExpandedPinView";

interface HUDProps {
  selectedPin: Pin | null;
  onLockClick: () => void;
  isLocked: boolean;
  onClearSelection?: () => void;
  onAddPinClick?: () => void;
}

export function HeadsUpDisplay({ selectedPin, onLockClick, isLocked, onClearSelection, onAddPinClick }: HUDProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClear = () => {
    setIsExpanded(false);
    if (onClearSelection) onClearSelection();
  };

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
        
        {/* ADD PIN BUTTON (Only if NO pin is selected) */}
        {!selectedPin && (
          <button 
            className="add-pin-btn"
            onClick={onAddPinClick}
            title="Deploy New Waypoint"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        )}

        {/* DETAILS CARD (Only if pin IS selected) */}
        {selectedPin && (
          <PinDetailsCard 
            pin={selectedPin} 
            isLocked={isLocked} 
            onLockClick={onLockClick} 
            onClose={onClearSelection}
            onExpand={() => setIsExpanded(true)}
          />
        )}

        {/* EXPANDED MODAL LAYER (Renders on top of everything if isExpanded is true) */}
        {selectedPin && isExpanded && (
          <ExpandedPinView 
            pin={selectedPin} 
            onClose={() => setIsExpanded(false)}
          />
        )}
      </div>

      {/* TACTICAL BUTTON STYLING */}
      <style jsx>{`
        .add-pin-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(0, 229, 255, 0.1);
          border: 2px solid var(--neon-blue, #00E5FF);
          color: var(--neon-blue, #00E5FF);
          box-shadow: 0 0 20px rgba(0, 229, 255, 0.2), inset 0 0 10px rgba(0, 229, 255, 0.1);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: pulseGlow 2s infinite alternate;
        }

        .add-pin-btn:hover {
          background: rgba(0, 229, 255, 0.2);
          box-shadow: 0 0 30px rgba(0, 229, 255, 0.4), inset 0 0 15px rgba(0, 229, 255, 0.2);
          transform: scale(1.1);
          color: #fff;
        }

        .add-pin-btn:active {
          transform: scale(0.95);
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 15px rgba(0, 229, 255, 0.2), inset 0 0 10px rgba(0, 229, 255, 0.1); }
          100% { box-shadow: 0 0 25px rgba(0, 229, 255, 0.5), inset 0 0 15px rgba(0, 229, 255, 0.2); }
        }
      `}</style>
    </div>
  );
}