import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBoard, requireUser } from "@/lib/api";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; cardId: string } },
) {
  const u = await requireUser();
  if ("error" in u) return u.error;
  const b = await requireBoard(u.userId, params.id);
  if ("error" in b) return b.error;

  // Make sure the card belongs to one of this board's lists.
  const card = await prisma.card.findFirst({
    where: { id: params.cardId, list: { boardId: params.id } },
  });
  if (!card) return NextResponse.json({ error: "not found" }, { status: 404 });

  await prisma.card.delete({ where: { id: card.id } });
  return NextResponse.json({ ok: true });
}
