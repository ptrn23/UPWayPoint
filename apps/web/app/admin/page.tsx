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
        </main>
    );
}