import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Nếu chưa login mà vào /admin → chuyển hướng
  if (!token && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Nếu đã login mà vào /auth → chuyển hướng về dashboard
  if (token && req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

// Áp dụng middleware cho các route sau
export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
