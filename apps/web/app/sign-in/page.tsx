'use client'

import { authClient } from '@/lib/auth-client'

export default function SignIn() {
  const handleLogin = async () => {
    await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' })
  }

  return (
    <main className="sign-in-container">
      
      {/* BACKGROUND GLOW */}
      <div className="glow-orb"></div>

      {/* LOGIN CARD */}
      <div className="login-card">
        
        {/* HEADER SECTION */}
        <div className="header-section">
          <div className="shield-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue, #00E5FF)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 3 21 12 12 21 3 12" />
            </svg>
          </div>
          
          <h1 className="login-title">UP WayPoint</h1>
        </div>

        {/* AUTH BUTTON */}
        <button className="auth-btn" onClick={handleLogin}>
          <svg className="google-icon" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
        
        {/* FOOTER */}
        <div className="footer-text">
          <a href="https://github.com/ptrn23/UPWayPoint"> Source code available here </a> <br />
          v1.2.0
        </div>
      </div>

      <style jsx>{`
        .sign-in-container {
          position: relative;
          display: flex;
          min-height: 100vh;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-color, #0f1115);
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
          background: rgba(0, 229, 255, 0.1);
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }

        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 380px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(10, 10, 12, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 32px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
          animation: fadeUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .header-section {
          text-align: center;
          margin-bottom: 32px;
        }

        .shield-icon {
          margin: 0 auto 20px auto;
          display: flex;
          height: 56px;
          width: 56px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(0, 229, 255, 0.5);
          background: rgba(0, 229, 255, 0.1);
          box-shadow: 0 0 20px rgba(0, 229, 255, 0.2);
        }

        .login-title {
          font-family: var(--font-cubao-wide), sans-serif;
          font-weight: 100;
          font-size: 32px;
          color: white;
          margin: 0 0 8px 0;
          text-transform: uppercase;
        }

        .login-subtitle {
          font-family: var(--font-nunito), sans-serif;
          font-size: 14px;
          color: #8899A6;
          margin: 0;
        }

        .auth-btn {
          position: relative;
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          padding: 14px 24px;
          font-family: var(--font-chakra), sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.05em;
        }

        .auth-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .auth-btn:active {
          transform: scale(0.98);
        }

        .google-icon {
          height: 20px;
          width: 20px;
        }

        .footer-text {
          margin-top: 32px;
          text-align: center;
          font-family: var(--font-nunito), sans-serif;
          font-size: 12px;
          color: #555;
          line-height: 1.5;
        }

        .footer-text a {
          color: #555;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </main>
  )
}