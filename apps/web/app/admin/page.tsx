"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { PIN_CATEGORIES, getPinColor } from "@/data/pin-categories";
import { useTheme } from "@/lib/ThemeContext";

export default function AdminDashboard() {
    const router = useRouter();

    const { data, isLoading } = trpc.user.getCurrent.useQuery();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const goToMap = () => router.push("/");

    const handleSignOut = async () => {
        await signOut();
        router.refresh();
    };

    const globalPinStats = {
        totalPins: 1240,
        verifiedPins: 1105,
        pendingPins: 85,
        rejectedPins: 50,
        categoryBreakdown: {
            academic: 450,
            food: 320,
            social: 150,
            transit: 200,
            utility: 120,
        }
    };

    const globalVerificationRate = Math.round((globalPinStats.verifiedPins / globalPinStats.totalPins) * 100) || 0;

    const globalUserStats = {
        totalUsers: 342,
        totalComments: 1840,
        avgPins: 3.6,
        avgComments: 5.3,
        newUsers7Days: 14,
        newUsers30Days: 45,
    };

    const globalPendingPins = [
        { id: "gp1", title: "Palma Hall Annex", lat: 14.6534, lng: 121.0691, type: "academic", submittedBy: "u1" },
        { id: "gp2", title: "KNL Tricycle Terminal", lat: 14.6552, lng: 121.0621, type: "transit", submittedBy: "u2" },
        { id: "gp3", title: "Gyud Food", lat: 14.6542, lng: 121.0665, type: "food", submittedBy: "u3" },
    ];

    const globalVerifiedPins = [
        { id: "v1", title: "Main Library", lat: 14.6540, lng: 121.0660, type: "academic", submittedBy: "u1" },
        { id: "v2", title: "Area 2 Kiosk 4", lat: 14.6530, lng: 121.0685, type: "food", submittedBy: "u2" },
        { id: "v3", title: "AS Parking", lat: 14.6538, lng: 121.0688, type: "utility", submittedBy: "u3" },
    ];

    return (
        <div className="dashboard-layout">
            {/* --- MOBILE OVERLAY --- */}
            {isSidebarOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* --- SIDEBAR --- */}
            <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <h2 className="brand">UP WAYPOINT</h2>
                </div>

                <nav className="sidebar-nav custom-vertical-scrollbar">
                    <div className="nav-group">
                        <span className="nav-label">COMMAND CENTER</span>
                        <button className="nav-item active">SYSTEM OVERVIEW</button>
                        <button className="nav-item">VERIFICATION QUEUE</button>
                        <button className="nav-item">USER MANAGEMENT</button>
                        <button className="nav-item" onClick={goToMap}>RETURN TO MAP</button>
                    </div>

                    <div className="nav-group" style={{ marginTop: '24px' }}>
                        <span className="nav-label">DISPLAY SETTINGS</span>
                        <button
                            className="nav-item theme-toggle-btn"
                            onClick={toggleTheme}
                        >
                            <span>UI THEME</span>
                            <div className="theme-status">
                                {theme === "dark" ? (
                                    <>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                        </svg>
                                        <span style={{ color: "var(--neon-blue)" }}>NIGHT</span>
                                    </>
                                ) : (
                                    <>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--pin-transit)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="5"></circle>
                                            <line x1="12" y1="1" x2="12" y2="3"></line>
                                            <line x1="12" y1="21" x2="12" y2="23"></line>
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                            <line x1="1" y1="12" x2="3" y2="12"></line>
                                            <line x1="21" y1="12" x2="23" y2="12"></line>
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                        </svg>
                                        <span style={{ color: "var(--pin-transit)" }}>DAY</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <button className="sign-out-btn" onClick={handleSignOut}>
                        SIGN OUT
                    </button>
                </div>
            </aside>

            <div className="main-wrapper">
                {/* --- HEADER --- */}
                <header className="dashboard-header">
                    <div className="header-left">
                        <button
                            className="hamburger-btn"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>
                        <h1 className="header-title" style={{ color: '#ff4d4d' }}>Admin Dashboard</h1>
                    </div>
                </header>

                {/* --- MAIN --- */}
                <main className="content-area custom-vertical-scrollbar">
                    <div className="content-container">
                        <div className="greeting-section">
                            <h2 className="greeting-title">
                                {isLoading ? "LOADING..." : `Welcome, ${data?.name ? data.name.toUpperCase() : "ADMIN"}!`}
                            </h2>
                            <p className="greeting-subtitle">You have accessed the restricted area. 🚨</p>
                        </div>

                        {/* --- DASHBOARD GRID --- */}
                        <div className="dashboard-grid">
                            <div className="module-card">
                                <div className="card-header">
                                    <h3>OVERALL PIN STATISTICS</h3>
                                </div>
                                <div className="card-body telemetry-body">

                                    {/* Top Stats Grid */}
                                    <div className="telemetry-top-grid">
                                        <div className="stat-block">
                                            <span className="stat-label">TOTAL PINS IN MAP</span>
                                            <span className="stat-value">{globalPinStats.totalPins}</span>
                                        </div>
                                        <div className="stat-block">
                                            <span className="stat-label">AWAITING ACTION</span>
                                            <span className="stat-value" style={{ color: 'var(--neon-yellow, #FFD700)' }}>
                                                {globalPinStats.pendingPins}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Verification Integrity Bar */}
                                    <div className="integrity-section">
                                        <div className="integrity-header">
                                            <span className="stat-label">GLOBAL VERIFICATION</span>
                                            <span className="integrity-percent" style={{ color: 'var(--pin-food)' }}>
                                                {globalVerificationRate}%
                                            </span>
                                        </div>
                                        <div className="progress-track">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${globalVerificationRate}%`,
                                                    background: 'var(--pin-food)',
                                                    boxShadow: '0 0 10px color-mix(in srgb, var(--pin-food) 50%, transparent)'
                                                }}
                                            ></div>
                                        </div>
                                        <div className="integrity-details">
                                            <span className="detail-item verified">{globalPinStats.verifiedPins} VERIFIED</span>
                                            <span className="detail-item pending">{globalPinStats.pendingPins} PENDING</span>
                                            <span className="detail-item rejected">{globalPinStats.rejectedPins} REJECTED</span>
                                        </div>
                                    </div>

                                    {/* Category Distribution */}
                                    <div className="distribution-section">
                                        <span className="stat-label">CATEGORY BREAKDOWN</span>
                                        <div className="category-list">
                                            {PIN_CATEGORIES.map((category) => {
                                                const count = globalPinStats.categoryBreakdown[category.id as keyof typeof globalPinStats.categoryBreakdown] || 0;
                                                const percentage = globalPinStats.totalPins > 0 ? (count / globalPinStats.totalPins) * 100 : 0;

                                                return (
                                                    <div key={category.id} className="category-row">
                                                        <div className="cat-info">
                                                            <span className="cat-name" style={{ color: category.color }}>{category.label}</span>
                                                            <span className="cat-count">{count}</span>
                                                        </div>
                                                        <div className="cat-track">
                                                            <div
                                                                className="cat-fill"
                                                                style={{
                                                                    width: `${percentage}%`,
                                                                    backgroundColor: category.color,
                                                                    boxShadow: `0 0 10px color-mix(in srgb, ${category.color} 50%, transparent)`
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="module-card">
                                <div className="card-header">
                                    <h3>OVERALL USER STATISTICS</h3>
                                </div>

                                <div className="card-body telemetry-body">
                                    <div className="telemetry-top-grid">
                                        <div className="stat-block">
                                            <span className="stat-label">TOTAL USERS</span>
                                            <span className="stat-value">{globalUserStats.totalUsers}</span>
                                        </div>
                                        <div className="stat-block">
                                            <span className="stat-label">TOTAL COMMENTS</span>
                                            <span className="stat-value">{globalUserStats.totalComments}</span>
                                        </div>
                                        <div className="stat-block">
                                            <span className="stat-label">AVERAGE PINS / USER</span>
                                            <span className="stat-value" style={{ fontSize: '24px' }}>{globalUserStats.avgPins}</span>
                                        </div>
                                        <div className="stat-block">
                                            <span className="stat-label">AVERAGE COMMENTS / USER</span>
                                            <span className="stat-value" style={{ fontSize: '24px' }}>{globalUserStats.avgComments}</span>
                                        </div>
                                        <div className="stat-block">
                                            <span className="stat-label">NEW USERS FOR THE LAST 7 DAYS</span>
                                            <span className="stat-value" style={{ fontSize: '24px' }}>{globalUserStats.newUsers7Days}</span>
                                        </div>
                                        <div className="stat-block">
                                            <span className="stat-label">NEW USERS FOR THE LAST 30 DAYS</span>
                                            <span className="stat-value" style={{ fontSize: '24px' }}>{globalUserStats.newUsers30Days}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="module-card">
                                <div className="card-header">
                                    <h3>PENDING PIN VERIFICATIONS</h3>
                                </div>

                                <div className="card-body">
                                    <div className="pin-list">
                                        {globalPendingPins.map((pin) => {
                                            const color = getPinColor(pin.type);
                                            return (
                                                <div key={pin.id} className="pin-list-item">
                                                    <div className="pin-info-group">
                                                        <div
                                                            className="list-diamond"
                                                            style={{
                                                                borderColor: color,
                                                                backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`
                                                            }}
                                                        >
                                                            <span style={{ color }}>{pin.title.charAt(0).toUpperCase()}</span>
                                                        </div>

                                                        <div className="pin-text">
                                                            <span className="pin-title">{pin.title}</span>
                                                            <span className="pin-coords">
                                                                By {pin.submittedBy} • {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="pin-actions" style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            type="button"
                                                            className="locate-btn"
                                                            title="Locate on Map"
                                                            onClick={() => console.log("Locate pin:", pin.id)}
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                                                            </svg>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="reject-btn"
                                                            title="Reject Pin"
                                                            onClick={() => console.log("Reject pin:", pin.id)}
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                                            </svg>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="approve-btn"
                                                            title="Verify & Approve Pin"
                                                            onClick={() => console.log("Approve pin:", pin.id)}
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                            </svg>
                                                        </button>
                                                    </div>

                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* 4. Newly Verified Pins */}
                            <div className="module-card">
                                <div className="card-header">
                                    <h3>RECENTLY VERIFIED PINS</h3>
                                </div>

                                <div className="card-body">
                                    <div className="pin-list">
                                        {globalVerifiedPins.map((pin) => {
                                            const color = getPinColor(pin.type);
                                            return (
                                                <div key={pin.id} className="pin-list-item">
                                                    <div className="pin-info-group">
                                                        <div
                                                            className="list-diamond"
                                                            style={{
                                                                borderColor: color,
                                                                backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`
                                                            }}
                                                        >
                                                            <span style={{ color }}>{pin.title.charAt(0).toUpperCase()}</span>
                                                        </div>

                                                        <div className="pin-text">
                                                            <span className="pin-title">{pin.title}</span>
                                                            <span className="pin-coords">
                                                                By {pin.submittedBy} • {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="pin-actions">
                                                        <button
                                                            type="button"
                                                            className="locate-btn"
                                                            title="Locate on Map"
                                                            onClick={() => console.log("Locate verified pin:", pin.id)}
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="module-card">
                                <div className="card-header">
                                    <h3>NEWEST REGISTRATIONS</h3>
                                </div>
                                <div className="card-body">
                                    <div className="placeholder-content">
                                        Newest Accounts List Go Here
                                    </div>
                                </div>
                            </div>

                            <div className="module-card">
                                <div className="card-header">
                                    <h3>TOP USERS</h3>
                                </div>
                                <div className="card-body">
                                    <div className="placeholder-content">
                                        Top Users (Leaderboard) Go Here
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>

            <style jsx>{`
        /* --- LAYOUT SHELL --- */
        .dashboard-layout {
          display: flex;
          height: 100vh;
          width: 100vw;
          background-color: var(--bg-base);
          overflow: hidden;
        }

        /* --- SIDEBAR --- */
        .sidebar {
          width: 280px;
          background-color: var(--bg-panel);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 100;
        }

        .sidebar-header {
          height: 72px;
          display: flex;
          align-items: center;
          padding: 0 24px;
          border-bottom: 1px solid var(--border-color);
        }

        .brand {
          font-family: var(--font-cubao-wide), sans-serif;
          font-size: 18px;
          color: var(--text-primary);
          letter-spacing: 0.1em;
          margin: 0;
        }

        .sidebar-nav {
          flex: 1;
          padding: 24px 16px;
          overflow-y: auto;
        }

        .nav-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-label {
          font-family: var(--font-chakra);
          font-size: 11px;
          font-weight: 800;
          color: var(--text-secondary);
          letter-spacing: 0.15em;
          padding: 0 8px;
          margin-bottom: 4px;
        }

        .nav-item {
          text-align: left;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: var(--text-secondary);
          font-family: var(--font-chakra);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-item:hover {
          background: var(--bg-panel-hover);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: color-mix(in srgb, #ff4d4d 10%, transparent);
          color: #ff4d4d;
          border-left: 3px solid #ff4d4d;
          border-radius: 0 8px 8px 0;
        }

        .theme-toggle-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .theme-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-chakra);
          font-size: 11px;
          font-weight: 800;
        }

        .sidebar-footer {
          padding: 24px;
          border-top: 1px solid var(--border-color);
        }

        .sign-out-btn {
          width: 100%;
          background: transparent;
          border: 1px solid var(--border-color);
          color: #ff4d4d;
          padding: 12px;
          border-radius: 8px;
          font-family: var(--font-chakra);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sign-out-btn:hover {
          background: color-mix(in srgb, #ff4d4d 10%, transparent);
          border-color: #ff4d4d;
        }

        /* --- MAIN AREA --- */
        .main-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .dashboard-header {
          height: 72px;
          background-color: var(--bg-panel);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          flex-shrink: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .hamburger-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 4px;
        }

        .header-title {
          font-family: var(--font-chakra);
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: 0.05em;
        }

        .content-area {
          flex: 1;
          padding: 32px;
          background-color: var(--bg-base);
          overflow-y: auto;
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .greeting-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .greeting-title {
          font-family: var(--font-chakra);
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .greeting-subtitle {
          font-family: var(--font-nunito);
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0;
        }

        /* --- DASHBOARD GRID & CARDS --- */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .module-card {
          background: var(--bg-panel);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .card-header h3 {
          font-family: var(--font-chakra);
          font-size: 14px;
          font-weight: 800;
          color: var(--text-secondary);
          letter-spacing: 0.15em;
          margin: 0;
        }

        .status-badge {
          background: color-mix(in srgb, var(--neon-green) 15%, transparent);
          color: var(--neon-green);
          border: 1px solid var(--neon-green);
          padding: 4px 8px;
          border-radius: 4px;
          font-family: var(--font-chakra);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .count-badge {
          background: color-mix(in srgb, var(--neon-yellow, #FFD700) 15%, transparent);
          color: var(--neon-yellow, #FFD700);
          border: 1px solid var(--neon-yellow, #FFD700);
          padding: 2px 8px;
          border-radius: 12px;
          font-family: var(--font-nunito);
          font-weight: 800;
          font-size: 12px;
        }
        
        .card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .placeholder-content {
          height: 100%;
          min-height: 200px;
          border: 1px dashed var(--border-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          font-family: var(--font-chakra);
          background: var(--bg-panel-hover);
        }

        /* --- PRESERVED UTILITY CLASSES FROM USER DASHBOARD --- */
        .stat-label { font-family: var(--font-chakra); font-size: 10px; font-weight: 800; color: var(--text-secondary); letter-spacing: 0.15em; }
        .stat-block { background: var(--bg-panel-hover); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 4px; }
        .stat-value { font-family: var(--font-cubao-wide); font-size: 32px; color: var(--text-primary); letter-spacing: 0.05em; }
        
        .pin-list { display: flex; flex-direction: column; gap: 12px; }
        .pin-list-item { display: flex; align-items: center; justify-content: space-between; background: var(--bg-panel-hover); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 16px; transition: all 0.2s ease; }
        .pin-list-item:hover { border-color: color-mix(in srgb, var(--text-secondary) 50%, transparent); background: color-mix(in srgb, var(--bg-panel-hover) 80%, var(--border-color)); }
        .pin-info-group { display: flex; align-items: center; gap: 16px; }
        .list-diamond { width: 32px; height: 32px; transform: rotate(45deg); border: 1.5px solid; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); }
        .list-diamond span { transform: rotate(-45deg); font-family: var(--font-cubao-wide); font-size: 14px; }
        .pin-text { display: flex; flex-direction: column; gap: 4px; }
        .pin-title { font-family: var(--font-chakra); font-size: 14px; font-weight: 700; color: var(--text-primary); letter-spacing: 0.05em; }
        .pin-coords { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; color: var(--text-secondary); letter-spacing: 0.05em; }

        .locate-btn { background: transparent; border: 1px solid var(--border-color); border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
        .locate-btn:hover { background: color-mix(in srgb, var(--neon-blue) 15%, transparent); border-color: var(--neon-blue); color: var(--neon-blue); transform: scale(1.05); }

        .telemetry-body {
          gap: 24px;
        }

        .stat-label {
          font-family: var(--font-chakra);
          font-size: 10px;
          font-weight: 800;
          color: var(--text-secondary);
          letter-spacing: 0.15em;
        }

        .telemetry-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .stat-block {
          background: var(--bg-panel-hover);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-family: var(--font-cubao-wide);
          font-size: 32px;
          color: var(--text-primary);
          letter-spacing: 0.05em;
        }
        
        .integrity-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .integrity-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .integrity-percent {
          font-family: var(--font-chakra);
          font-size: 14px;
          font-weight: 800;
          color: var(--neon-green);
        }
        
        .progress-track {
          height: 6px;
          background: var(--bg-panel-hover);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--pin-food);
          box-shadow: 0 0 10px color-mix(in srgb, var(--pin-food) 50%, transparent);
          border-radius: 3px;
          transition: width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .integrity-details {
          display: flex;
          gap: 12px;
          font-family: var(--font-chakra);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .detail-item.verified { color: var(--neon-green); }
        .detail-item.pending { color: var(--neon-yellow, #FFD700); }
        .detail-item.rejected { color: #ff4d4d; }

        /* Category Distribution */
        .distribution-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .category-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cat-info {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-chakra);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .cat-count {
          color: var(--text-primary);
          font-family: var(--font-nunito);
        }

        .cat-track {
          height: 4px;
          background: var(--bg-panel-hover);
          border-radius: 2px;
          overflow: hidden;
        }

        .cat-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* Admin Action Buttons */
        .approve-btn { 
          background: transparent; 
          border: 1px solid var(--border-color); 
          border-radius: 8px; 
          width: 36px; 
          height: 36px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: var(--text-secondary); 
          cursor: pointer; 
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          flex-shrink: 0; 
        }
        
        .approve-btn:hover { 
          background: color-mix(in srgb, var(--neon-green) 15%, transparent); 
          border-color: var(--neon-green); 
          color: var(--neon-green); 
          transform: scale(1.05); 
        }
        
        .approve-btn:active { 
          transform: scale(0.95); 
        }

       .reject-btn { 
          background: transparent; 
          border: 1px solid var(--border-color); 
          border-radius: 8px; 
          width: 36px; 
          height: 36px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: var(--text-secondary); 
          cursor: pointer; 
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          flex-shrink: 0; 
        }
        
        .reject-btn:hover { 
          background: color-mix(in srgb, #ff4d4d 15%, transparent); 
          border-color: #ff4d4d; 
          color: #ff4d4d; 
          transform: scale(1.05); 
        }
        
        .reject-btn:active { 
          transform: scale(0.95); 
        } 

        /* Custom Scrollbar */
        .custom-vertical-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-vertical-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-vertical-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }

        /* --- MOBILE RESPONSIVENESS --- */
        @media (max-width: 768px) {
          .sidebar { position: fixed; top: 0; left: 0; height: 100%; transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          .mobile-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 99; }
          .hamburger-btn { display: flex; align-items: center; justify-content: center; }
          .dashboard-header { padding: 0 16px; }
          .dashboard-grid { grid-template-columns: 1fr; }
          .content-area { padding: 24px 16px; }
        }
      `}</style>
        </div>
    );
}