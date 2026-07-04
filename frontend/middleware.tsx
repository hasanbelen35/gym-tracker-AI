import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return NextResponse.next();
  }
  // is not auth
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let role: string | undefined;

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("utf-8")
    );

    role = payload.role;
    console.log(role)
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // MEMBER routes
  if (role === "member" && !pathname.startsWith("/athlete")) {
    return NextResponse.redirect(new URL("/dashboard/athlete", request.url));
  }

  // GYM routes
  if (role === "gym" && !pathname.startsWith("/gym")) {
    return NextResponse.redirect(new URL("/dashboard/gym", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/athlete/:path*",
    "/gym/:path*",
    "/login",
    "/register",
  ],
};