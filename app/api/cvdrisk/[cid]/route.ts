import { NextResponse } from "next/server";
import { fetchCvdRisk } from "@/lib/lab.service";

export async function GET(_: Request, { params }: { params: { cid: string } }) {
  const result = await fetchCvdRisk(params.cid);
  return NextResponse.json(result);
}
