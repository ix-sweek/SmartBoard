"use client";
import { signOut } from "next-auth/react";

export function UserMenu({ email, image }: { email: string; image?: string | null }) {
  return (
    <div className="user-menu">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="avatar" />
      ) : (
        <div className="avatar fallback">{email.slice(0, 1).toUpperCase()}</div>
      )}
      <span className="muted">{email}</span>
      <button className="btn secondary" onClick={() => signOut({ callbackUrl: "/signin" })}>
        Sign out
      </button>
    </div>
  );
}
