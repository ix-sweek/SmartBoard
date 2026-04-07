import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBoard, requireUser } from "@/lib/api";

export async function POST(
  req: Request,
  { params }: { params: { id: string; listId: string } },
) {
  const u = await requireUser();
  if ("error" in u) return u.error;
  const b = await requireBoard(u.userId, params.id);
  if ("error" in b) return b.error;

  const list = await prisma.list.findFirst({ where: { id: params.listId, boardId: params.id } });
  if (!list) return NextResponse.json({ error: "list not found" }, { status: 404 });

  const { title } = (await req.json()) as { title?: string };
  if (!title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

  const count = await prisma.card.count({ where: { listId: params.listId } });
  const card = await prisma.card.create({
    data: { title: title.trim(), listId: params.listId, position: count },
  });
  return NextResponse.json({ id: card.id, title: card.title, dueDate: null });
}
