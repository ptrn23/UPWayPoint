"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

export default function AdminDashboard() {
    const router = useRouter();
    const { data } = trpc.user.getCurrent.useQuery();

    const handleSignOut = async () => {
        await signOut();
        router.refresh();
    };

    const goToDashboard = () => router.push("/dashboard");
    const goToMap = () => router.push("/");

    return (
        <main className="dashboard-container">
            
            <div className="glow-orb"></div>

            <div className="dashboard-card admin-card">
                
                {/* HEADER SECTION */}
                <div className="header-section">
                    <div className="status-icon">
                        {/* Admin Shield/Lock Icon */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--neon-maroon, #FF0055)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            <rect x="10" y="10" width="4" height="6" rx="1"></rect>
                        </svg>
                    </div>
                    
                    <h1 className="title">
                        ADMIN: {data?.name ? data.name.toUpperCase() : "UNKNOWN"}
                    </h1>
                    <p className="subtitle">You have accessed the restricted area. 🚨</p>
                </div>

                {/* ACTIONS PORTAL */}
                <div className="action-grid">
                    <button className="action-btn secondary-btn" onClick={goToMap}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                        </svg>
                        GO TO MAP
                    </button>

					<button className="action-btn primary-btn admin-btn" onClick={goToDashboard}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        RETURN TO DASHBOARD
                    </button>
                </div>

                {/* FOOTER & SIGN OUT */}
                <div className="footer-section">
                    <button type="button" onClick={handleSignOut} className="sign-out-btn">
                        [ SIGN OUT ]
                    </button>
                </div>

            </div>

			<style jsx>{`
                .dashboard-container {
                    position: relative;
                    display: flex;
                    min-height: 100vh;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--bg-color, #0f1115);
                    overflow: hidden;
                    padding: 16px;
                }

                /* Admin Red/Maroon Glow */
                .glow-orb {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 500px;
                    height: 500px;
                    background: rgba(255, 0, 85, 0.08); 
                    border-radius: 50%;
                    filter: blur(120px);
                    pointer-events: none;
                }

                .dashboard-card {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 420px;
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    /* Maroon accent line for Admin */
                    border-top: 2px solid var(--neon-maroon, #FF0055); 
                    background: rgba(10, 10, 12, 0.6);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    padding: 40px 32px;
                    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
                    animation: fadeUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .header-section {
                    text-align: center;
                    margin-bottom: 40px;
                }

                /* Admin icon styling */
                .status-icon {
                    margin: 0 auto 20px auto;
                    display: flex;
                    height: 64px;
                    width: 64px;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    border: 1px solid rgba(255, 0, 85, 0.4);
                    background: rgba(255, 0, 85, 0.1);
                    box-shadow: 0 0 20px rgba(255, 0, 85, 0.2);
                }

                .title {
                    font-family: var(--font-cubao-wide), sans-serif;
                    font-weight: 100;
                    font-size: 32px;
                    color: white;
                    margin: 0 0 8px 0;
                    letter-spacing: 0.05em;
                }

                .subtitle {
                    font-family: var(--font-nunito), sans-serif;
                    font-size: 14px;
                    color: #8899A6;
                    margin: 0;
                    line-height: 1.5;
                }

                /* ACTIONS */
                .action-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    width: 100%;
                }

                .action-btn {
                    position: relative;
                    display: flex;
                    width: 100%;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    border-radius: 12px;
                    padding: 14px 24px;
                    font-family: var(--font-chakra), sans-serif;
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .action-btn:active {
                    transform: scale(0.98);
                }

                /* PRIMARY ADMIN BUTTON (Maroon) */
                .primary-btn.admin-btn {
                    background: rgba(255, 0, 85, 0.05);
                    border: 1px solid var(--neon-maroon, #FF0055);
                    color: var(--neon-maroon, #FF0055);
                    box-shadow: inset 0 0 10px rgba(255, 0, 85, 0.1);
                }

                .primary-btn.admin-btn:hover {
                    background: rgba(255, 0, 85, 0.15);
                    box-shadow: 0 0 20px rgba(255, 0, 85, 0.3), inset 0 0 15px rgba(255, 0, 85, 0.2);
                    text-shadow: 0 0 8px rgba(255, 0, 85, 0.8);
                    color: #fff;
                }

                /* SECONDARY BUTTON */
                .secondary-btn {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    color: #aaa;
                }

                .secondary-btn:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.4);
                    color: #fff;
                }

                /* FOOTER & SIGN OUT */
                .footer-section {
                    margin-top: 40px;
                    text-align: center;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    padding-top: 24px;
                }

                .sign-out-btn {
                    background: none;
                    border: none;
                    font-family: var(--font-chakra), sans-serif;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    color: var(--neon-maroon, #FF0055);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .sign-out-btn:hover {
                    color: #fff;
                    text-shadow: 0 0 10px rgba(255, 0, 85, 0.8);
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </main>
    );
}