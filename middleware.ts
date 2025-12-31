import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pass-through middleware; place auth or logging here as needed.
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}
