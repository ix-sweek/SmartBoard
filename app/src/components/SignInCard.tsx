"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

const ERRORS: Record<string, string> = {
  OAuthAccountNotLinked: "This email is already linked to another sign-in method.",
  AccessDenied: "Access was denied. Please grant the requested permissions.",
  Configuration: "Server is misconfigured. Check NEXTAUTH and Google credentials.",
  default: "Sign-in failed. Please try again.",
};

export function SignInCard({ callbackUrl, error }: { callbackUrl: string; error?: string }) {
  const [loading, setLoading] = useState(false);
  const message = error ? ERRORS[error] ?? ERRORS.default : null;

  return (
    <div className="auth-card">
      <div className="auth-logo">SB</div>
      <h1>Welcome to SmartBoard</h1>
      <p className="muted">
        Your self-hosted dashboard for boards, Gmail, and Calendar — all in one place.
      </p>

      {message && <div className="auth-error">{message}</div>}

      <button
        className="btn google"
        disabled={loading}
        onClick={() => {
          setLoading(true);
          signIn("google", { callbackUrl });
        }}
      >
        <GoogleIcon />
        {loading ? "Redirecting…" : "Continue with Google"}
      </button>

      <p className="muted small">
        By continuing you grant read-only access to your Gmail inbox and Calendar so SmartBoard
        can show them on your dashboard.
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C41.1 35.7 44 30.3 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );
}
