"use client";
import { useRef } from "react";

export function NewBoardForm({ action }: { action: (fd: FormData) => void }) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={action}
      style={{ display: "flex", gap: 8 }}
      onSubmit={() => setTimeout(() => ref.current?.reset(), 0)}
    >
      <input className="input" name="title" placeholder="Board title" required />
      <button className="btn" type="submit">Create</button>
    </form>
  );
}
