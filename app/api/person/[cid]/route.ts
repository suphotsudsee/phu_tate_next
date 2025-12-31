import { NextResponse } from "next/server";
import { fetchPersonDetail } from "@/lib/lab.service";

export async function GET(_: Request, { params }: { params: { cid: string } }) {
  const person = await fetchPersonDetail(params.cid);
  if (!person) return NextResponse.json({ success: false }, { status: 404 });
  return NextResponse.json({ success: true, person });
}
