"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const router = useRouter();
  const { data, isLoading } = trpc.user.getCurrent.useQuery();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const goToMap = () => router.push("/");
  
  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

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
        
        <nav className="sidebar-nav">
          <div className="nav-group">
            <span className="nav-label">MAIN</span>
            <button className="nav-item active">OVERVIEW</button>
            <button className="nav-item" onClick={goToMap}>RETURN TO MAP</button>
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
            <h1 className="header-title">User Dashboard</h1>
          </div>
        </header>

        {/* --- MAIN --- */}
        <main className="content-area custom-vertical-scrollbar">
          <div className="content-container">
            <div className="greeting-section">
              <h2 className="greeting-title">
                {isLoading ? "LOADING..." : `Welcome, ${data?.name ? data.name.toUpperCase() : "UNKNOWN"}!`}
              </h2>
              <p className="greeting-subtitle">You made it!</p>
            </div>
            
            <div className="placeholder-content">
               <p>Data will be displayed here.</p>
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
          background: color-mix(in srgb, var(--neon-blue) 10%, transparent);
          color: var(--neon-blue);
          border-left: 3px solid var(--neon-blue);
          border-radius: 0 8px 8px 0;
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
          min-width: 0; /* Prevents flex blowout */
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
          display: none; /* Hidden on desktop */
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

        .placeholder-content {
          height: 300px;
          border: 1px dashed var(--border-color);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          font-family: var(--font-chakra);
        }

        /* Custom Scrollbar */
        .custom-vertical-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-vertical-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-vertical-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }

        /* --- MOBILE RESPONSIVENESS --- */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          
          .mobile-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            z-index: 99;
          }

          .hamburger-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .dashboard-header {
            padding: 0 16px;
          }

          .content-area {
            padding: 24px 16px;
          }
        }
      `}</style>
    </div>
  );
}