"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignIn() {
	const handleLogin = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "/dashboard",
		});
	};

	const router = useRouter();

	const goToMap = () => router.push("/");

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0f1115] overflow-hidden p-4">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-[380px] rounded-[24px] border border-white/10 bg-[#0a0a0c]/60 backdrop-blur-[20px] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-fade-up">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-neon-blue/50 bg-neon-blue/10 shadow-[0_0_20px_var(--shadow-glow)]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--neon-blue)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 3 21 12 12 21 3 12" />
            </svg>
          </div>

          <h1 className="font-cubao-wide font-thin text-[32px] text-white m-0 mb-2 uppercase">
            UP WayPoint
          </h1>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {/* Primary Action: Go to Map */}
          <button
            type="button"
            className="relative flex w-full items-center justify-center gap-3 rounded-xl p-[14px_24px] font-chakra text-[14px] font-semibold tracking-[0.05em] cursor-pointer transition-all duration-200 active:scale-[0.98] bg-neon-blue/5 border border-neon-blue text-neon-blue shadow-[inset_0_0_10px_rgba(0,229,255,0.1)] hover:bg-neon-blue/15 hover:shadow-[0_0_20px_rgba(0,229,255,0.3),inset_0_0_15px_rgba(0,229,255,0.2)] hover:[text-shadow:0_0_8px_rgba(0,229,255,0.8)] hover:text-white"
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

          {/* AUTH BUTTON */}
          <button 
            type="button" 
            className="relative flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 p-[14px_24px] font-chakra text-[14px] font-semibold text-white cursor-pointer transition-all duration-200 tracking-[0.05em] hover:bg-white/10 hover:border-white/20 active:scale-[0.98]" 
            onClick={handleLogin}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>
        
        {/* FOOTER */}
        <div className="mt-8 text-center font-nunito text-[12px] text-[#555] leading-relaxed">
          <a href="https://github.com/ptrn23/UPWayPoint" className="text-[#555] hover:text-[#888] transition-colors">
            Source code available here
          </a>
          <br />
          v1.2.0
        </div>
      </div>
    </main>
  );
}
