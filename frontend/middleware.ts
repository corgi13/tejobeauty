import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // For now, just pass through all requests to avoid locale issues
  // We can re-enable i18n later once the basic app is working
  return NextResponse.next();
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
