"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const router = useRouter();
  const { data } = trpc.user.getCurrent.useQuery();

  const goToMap = () => router.push("/");
  const goToAdmin = () => router.push("/admin");

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <main className="dashboard-container">
      <div className="glow-orb"></div>

      <div className="dashboard-card">
        {/* HEADER SECTION */}
        <div className="header-section">
          <div className="status-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--neon-green)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <h1 className="title">
            Welcome, {data?.name ? data.name.toUpperCase() : "UNKNOWN"}!
          </h1>
          <p className="subtitle">You made it to the protected area. 🎉</p>
        </div>

        {/* ACTIONS PORTAL */}
        <div className="action-grid">
          {/* Primary Action: Go to Map */}
          <button
            type="button"
            className="action-btn primary-btn"
            onClick={goToMap}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            GO TO MAP
          </button>

          {/* Secondary Action: Admin */}
          <button
            type="button"
            className="action-btn secondary-btn"
            onClick={goToAdmin}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            ADMIN OVERRIDE
          </button>
        </div>

        {/* FOOTER & SIGN OUT */}
        <div className="footer-section">
          <button
            type="button"
            onClick={handleSignOut}
            className="sign-out-btn"
          >
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
          background-color: var(--bg-base);
          overflow: hidden;
          padding: 16px;
        }
    
        .glow-orb {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          background: color-mix(in srgb, var(--neon-green) 8%, transparent); 
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
          border: 1px solid var(--border-color);
          border-top: 2px solid var(--neon-green);
          background: var(--bg-panel);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 40px 32px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
          animation: fadeUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .header-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .status-icon {
          margin: 0 auto 20px auto;
          display: flex;
          height: 64px;
          width: 64px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid color-mix(in srgb, var(--neon-green) 40%, transparent);
          background: color-mix(in srgb, var(--neon-green) 10%, transparent);
          box-shadow: 0 0 20px color-mix(in srgb, var(--neon-green) 20%, transparent);
        }

        .title {
          font-family: var(--font-cubao-wide), sans-serif;
          font-weight: 100;
          font-size: 32px;
          color: var(--text-primary);
          margin: 0 0 8px 0;
          letter-spacing: 0.05em;
        }

        .subtitle {
          font-family: var(--font-nunito), sans-serif;
          font-size: 14px;
          color: var(--text-secondary);
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

        /* PRIMARY BUTTON (Go to Map) */
        .primary-btn {
          background: color-mix(in srgb, var(--neon-blue) 5%, transparent);
          border: 1px solid var(--neon-blue);
          color: var(--neon-blue);
          box-shadow: inset 0 0 10px color-mix(in srgb, var(--neon-blue) 10%, transparent);
        }

        .primary-btn:hover {
          background: var(--neon-blue);
          box-shadow: 0 0 20px color-mix(in srgb, var(--neon-blue) 30%, transparent), inset 0 0 15px color-mix(in srgb, var(--neon-blue) 20%, transparent);
          color: var(--bg-base);
        }

        /* SECONDARY BUTTON (Admin) */
        .secondary-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }

        .secondary-btn:hover {
          background: var(--bg-panel-hover);
          border-color: var(--text-primary);
          color: var(--text-primary);
        }

        /* FOOTER & SIGN OUT */
        .footer-section {
          margin-top: 40px;
          text-align: center;
          border-top: 1px solid var(--border-color);
          padding-top: 24px;
        }

        .sign-out-btn {
          background: none;
          border: none;
          font-family: var(--font-chakra), sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #ff4d4d;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sign-out-btn:hover {
          color: #ff4d4d;
          text-shadow: 0 0 10px color-mix(in srgb, #ff4d4d 80%, transparent);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}