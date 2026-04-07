import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { authOptions, getGoogleAccessToken } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const accessToken = await getGoogleAccessToken(userId);
  if (!accessToken) return NextResponse.json({ error: "no google account" }, { status: 400 });

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth });

  const list = await gmail.users.messages.list({ userId: "me", maxResults: 8, q: "in:inbox" });
  const ids = list.data.messages ?? [];
  const messages = await Promise.all(
    ids.map(async ({ id }) => {
      const m = await gmail.users.messages.get({
        userId: "me",
        id: id!,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "Date"],
      });
      const headers = m.data.payload?.headers ?? [];
      const h = (n: string) => headers.find((x) => x.name === n)?.value ?? "";
      return {
        id: m.data.id!,
        from: h("From"),
        subject: h("Subject"),
        date: h("Date"),
        snippet: m.data.snippet ?? "",
      };
    }),
  );

  return NextResponse.json({ messages });
}
