import { NextResponse } from "next/server";
import { autoLoginByLineUserId } from "@/lib/lab.service";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const lineUserId = body?.lineUserId;
  if (!lineUserId) return NextResponse.json({ success: false }, { status: 400 });

  const result = await autoLoginByLineUserId(lineUserId);
  return NextResponse.json(result);
}
