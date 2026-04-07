"use client";
import { useEffect, useState } from "react";

type Mail = { id: string; from: string; subject: string; snippet: string; date: string };
type Event = { id: string; summary: string; start: string; end: string; location?: string };

export function GoogleWidgets() {
  const [mail, setMail] = useState<Mail[] | null>(null);
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [m, e] = await Promise.all([
          fetch("/api/google/gmail").then((r) => r.json()),
          fetch("/api/google/calendar").then((r) => r.json()),
        ]);
        if (cancelled) return;
        if (m.error) setError(m.error); else setMail(m.messages ?? []);
        if (!e.error) setEvents(e.events ?? []);
      } catch (err) {
        if (!cancelled) setError(String(err));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="widget">
        <h2>Upcoming events</h2>
        {error && <p className="muted">Error: {error}</p>}
        {!events ? (
          <p className="muted">Loading…</p>
        ) : events.length === 0 ? (
          <p className="muted">Nothing scheduled.</p>
        ) : (
          <ul>
            {events.map((e) => (
              <li key={e.id}>
                <strong>{e.summary || "(no title)"}</strong>
                <div className="muted">{new Date(e.start).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="widget">
        <h2>Recent mail</h2>
        {!mail ? (
          <p className="muted">Loading…</p>
        ) : mail.length === 0 ? (
          <p className="muted">Inbox empty.</p>
        ) : (
          <ul>
            {mail.map((m) => (
              <li key={m.id}>
                <strong>{m.subject || "(no subject)"}</strong>
                <div className="muted">{m.from}</div>
                <div className="muted">{m.snippet}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
