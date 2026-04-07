import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBoard, requireUser } from "@/lib/api";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const u = await requireUser();
  if ("error" in u) return u.error;
  const b = await requireBoard(u.userId, params.id);
  if ("error" in b) return b.error;

  const { title } = (await req.json()) as { title?: string };
  if (!title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

  const count = await prisma.list.count({ where: { boardId: params.id } });
  const list = await prisma.list.create({
    data: { title: title.trim(), boardId: params.id, position: count },
  });
  return NextResponse.json(list);
}
