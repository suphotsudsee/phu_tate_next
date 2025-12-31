import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "phu_tate_next",
    time: new Date().toISOString(),
  });
}
