import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { BoardView } from "@/components/BoardView";

export default async function BoardPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");
  const userId = (session.user as { id: string }).id;

  const board = await prisma.board.findFirst({
    where: { id: params.id, ownerId: userId },
    include: {
      lists: {
        orderBy: { position: "asc" },
        include: { cards: { orderBy: { position: "asc" } } },
      },
    },
  });
  if (!board) notFound();

  return (
    <div className="container">
      <div className="header">
        <h1>
          <Link href="/" style={{ color: "var(--muted)" }}>← </Link>
          {board.title}
        </h1>
      </div>
      <BoardView
        boardId={board.id}
        initialLists={board.lists.map((l) => ({
          id: l.id,
          title: l.title,
          cards: l.cards.map((c) => ({ id: c.id, title: c.title, dueDate: c.dueDate?.toISOString() ?? null })),
        }))}
      />
    </div>
  );
}
