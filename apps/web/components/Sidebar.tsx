"use client";

import { useTheme } from "@/lib/ThemeContext";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { theme, toggleTheme } = useTheme();
    const { data: sessionData } = useSession();
    const router = useRouter();

    if (!isOpen) return null;

    const handleNavigation = (path: string) => {
        onClose();
        router.push(path);
    };

    return (
        <>
            <div className="sidebar-overlay" onClick={onClose}></div>

            <div className="sidebar-panel">
                <div className="sidebar-header">
                    <h2 className="brand-title">UP WAYPOINT</h2>
                    <button type="button" onClick={onClose} className="close-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="sidebar-content custom-vertical-scrollbar">
                    {/* PRIMARY ACTIONS */}
                    <div className="menu-group">
                        <span className="group-label">SYSTEM ACCESS</span>
                        <button 
                            className="tactical-button menu-item primary-action"
                            onClick={() => handleNavigation(sessionData?.user ? "/dashboard" : "/sign-in")}
                        >
                            {sessionData?.user ? "DASHBOARD" : "LOGIN"}
                        </button>
                    </div>

                    {/* SETTINGS */}
                    <div className="menu-group">
                        <span className="group-label">DISPLAY SETTINGS</span>
                        <button className="tactical-button menu-item" onClick={toggleTheme}>
                            SWITCH TO {theme === "dark" ? "DAY" : "NIGHT"} MODE
                        </button>
                    </div>

                    {/* PLACEHOLDERS */}
                    <div className="menu-group">
                        <span className="group-label">DATABASE</span>
                        <button className="tactical-button menu-item" onClick={() => {}}>
                            SAVED WAYPOINTS
                        </button>
                        <button className="tactical-button menu-item" onClick={() => {}}>
                            ABOUT US
                        </button>
                    </div>
                </div>

                <div className="sidebar-footer">
                    <span>UP WAYPOINT v1.3.0</span>
                    <span>SYSTEM ONLINE</span>
                </div>
            </div>

            <style jsx>{`
                .sidebar-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    z-index: 400;
                    animation: fadeIn 0.2s ease-out;
                }

                .sidebar-panel {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: 100%;
                    max-width: 320px;
                    background: var(--bg-panel);
                    border-right: 1px solid var(--border-color);
                    z-index: 401;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 20px 0 50px rgba(0,0,0,0.1);
                    animation: slideRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .sidebar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px;
                    border-bottom: 1px solid var(--border-color);
                }

                .brand-title {
                    margin: 0;
                    font-family: var(--font-cubao-wide);
                    font-size: 20px;
                    letter-spacing: 0.1em;
                    color: var(--text-primary);
                }

                .close-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px;
                    transition: color 0.2s;
                }

                .close-btn:hover { color: var(--text-primary); }

                .sidebar-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .menu-group {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .group-label {
                    font-family: var(--font-chakra);
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--text-secondary);
                    letter-spacing: 0.15em;
                }

                .menu-item {
                    width: 100%;
                    text-align: left;
                    padding: 16px;
                    font-size: 14px;
                    display: flex;
                    justify-content: flex-start;
                    background: transparent;
                }

                .primary-action {
                    background: rgba(0, 229, 255, 0.1);
                    border-color: var(--neon-blue);
                    color: var(--neon-blue);
                }

                .primary-action:hover {
                    background: var(--neon-blue);
                    color: var(--bg-base);
                    box-shadow: 0 0 15px var(--shadow-glow);
                }

                .sidebar-footer {
                    padding: 20px 24px;
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    font-family: var(--font-chakra);
                    font-size: 10px;
                    font-weight: 700;
                    color: var(--text-secondary);
                    letter-spacing: 0.1em;
                }

                @keyframes slideRight {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </>
    );
}