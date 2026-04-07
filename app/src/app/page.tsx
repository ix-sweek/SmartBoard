import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GoogleWidgets } from "@/components/GoogleWidgets";
import { NewBoardForm } from "@/components/NewBoardForm";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="container">
        <div className="header">
          <h1>SmartBoard</h1>
        </div>
        <div className="widget">
          <h2>Sign in</h2>
          <p className="muted">Connect your Google account to use the dashboard, Gmail and Calendar widgets.</p>
          <form action="/api/auth/signin/google" method="POST">
            <button className="btn" type="submit">Sign in with Google</button>
          </form>
        </div>
      </div>
    );
  }

  const userId = (session.user as { id: string }).id;
  const boards = await prisma.board.findMany({
    where: { ownerId: userId },
    orderBy: { position: "asc" },
  });

  async function createBoard(formData: FormData) {
    "use server";
    const title = String(formData.get("title") ?? "").trim();
    if (!title) return;
    const sess = await getServerSession(authOptions);
    if (!sess?.user) return;
    const uid = (sess.user as { id: string }).id;
    const count = await prisma.board.count({ where: { ownerId: uid } });
    await prisma.board.create({ data: { title, ownerId: uid, position: count } });
    redirect("/");
  }

  return (
    <div className="container">
      <div className="header">
        <h1>SmartBoard</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span className="muted">{session.user.email}</span>
          <form action="/api/auth/signout" method="POST">
            <button className="btn secondary" type="submit">Sign out</button>
          </form>
        </div>
      </div>

      <div className="side">
        <div>
          <div className="widget" style={{ marginBottom: 16 }}>
            <h2>New board</h2>
            <NewBoardForm action={createBoard} />
          </div>

          <h2 style={{ fontSize: 18 }}>Your boards</h2>
          {boards.length === 0 ? (
            <p className="muted">No boards yet. Create your first one above.</p>
          ) : (
            <div className="grid boards">
              {boards.map((b) => (
                <Link key={b.id} href={`/board/${b.id}`} className="card-tile">
                  <strong>{b.title}</strong>
                  <div className="muted">Updated {b.updatedAt.toLocaleDateString()}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <GoogleWidgets />
      </div>
    </div>
  );
}
