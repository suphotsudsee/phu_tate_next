import { NextResponse } from "next/server";
import { bindCidToLineLogin } from "@/lib/lab.service";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const idNumber = body?.idNumber;
  if (!idNumber) return NextResponse.json({ success: false }, { status: 400 });

  const result = await bindCidToLineLogin({
    idNumber,
    lineUserId: body?.lineUserId,
    lineDisplayName: body?.lineDisplayName,
  });

  return NextResponse.json(result);
}
