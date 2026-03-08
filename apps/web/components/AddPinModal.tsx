"use client";

import { useState } from "react";
import { Pin } from "@/types/waypoint";

interface AddPinModalProps {
  coords: { lat: number; lng: number };
  onSave: (pin: Pin) => void;
  onCancel: () => void;
}

export function AddPinModal({ coords, onSave, onCancel }: AddPinModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"academic" | "food" | "social" | "utility">("utility");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const iconMap = {
      academic: "?",
      food: "?",
      social: "?",
      utility: "?"
    };

    const newPin: Pin = {
      id: `pin-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      position: coords,
      type: type,
      icon: title.trim().charAt(0).toUpperCase() || iconMap[type]
    };

    onSave(newPin);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        
        <div className="modal-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue, #00E5FF)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <h2 className="modal-title">ADD NEW PIN</h2>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label>PIN TITLE</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Quezon Hall" 
              required
              autoFocus
            />
          </div>

          <div className="input-group">
            <label>DESCRIPTION</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Enter description..." 
              rows={3}
            />
          </div>

          <div className="input-group">
            <label>PIN TYPE</label>
            <div className="type-selector">
              {(["academic", "food", "social", "utility"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`type-btn ${type === t ? "active" : ""}`}
                  onClick={() => setType(t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="action-row">
            <button type="button" className="cancel-btn" onClick={onCancel}>CANCEL</button>
            <button type="submit" className="save-btn" disabled={!title.trim()}>CONFIRM</button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 20px;
        }

        .modal-card {
          width: 100%;
          max-width: 400px;
          background: rgba(10, 10, 12, 0.85);
          border: 1px solid rgba(0, 229, 255, 0.3);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 0 30px rgba(0, 229, 255, 0.1);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 16px;
        }

        .modal-title {
          font-family: var(--font-cubao-wide), sans-serif;
          color: white;
          font-size: 20px;
          margin: 0;
          letter-spacing: 0.05em;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-family: var(--font-chakra), sans-serif;
          font-size: 12px;
          color: var(--neon-blue, #00E5FF);
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        input, textarea {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 12px;
          color: white;
          font-family: var(--font-nunito), sans-serif;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }

        input:focus, textarea:focus {
          border-color: var(--neon-blue, #00E5FF);
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
        }

        .type-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .type-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #aaa;
          padding: 10px;
          border-radius: 6px;
          font-family: var(--font-chakra), sans-serif;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .type-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .type-btn.active {
          background: rgba(0, 229, 255, 0.15);
          border-color: var(--neon-blue, #00E5FF);
          color: var(--neon-blue, #00E5FF);
          box-shadow: inset 0 0 8px rgba(0, 229, 255, 0.2);
        }

        .action-row {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }

        .cancel-btn, .save-btn {
          flex: 1;
          padding: 14px;
          border-radius: 8px;
          font-family: var(--font-chakra), sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #aaa;
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .save-btn {
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid var(--neon-blue, #00E5FF);
          color: var(--neon-blue, #00E5FF);
        }

        .save-btn:hover:not(:disabled) {
          background: var(--neon-blue, #00E5FF);
          color: black;
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.4);
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}