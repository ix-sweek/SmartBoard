import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBoard, requireUser } from "@/lib/api";

export async function DELETE(_req: Request, { params }: { params: { id: string; listId: string } }) {
  const u = await requireUser();
  if ("error" in u) return u.error;
  const b = await requireBoard(u.userId, params.id);
  if ("error" in b) return b.error;

  await prisma.list.deleteMany({ where: { id: params.listId, boardId: params.id } });
  return NextResponse.json({ ok: true });
}
