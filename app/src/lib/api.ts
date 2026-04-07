import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  return { userId: (session.user as { id: string }).id };
}

export async function requireBoard(userId: string, boardId: string) {
  const board = await prisma.board.findFirst({ where: { id: boardId, ownerId: userId } });
  if (!board) return { error: NextResponse.json({ error: "not found" }, { status: 404 }) };
  return { board };
}
