import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "access_token";

export function proxy(request: NextRequest) {
  if (!request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile", "/posts/new", "/posts/:id/edit", "/my-posts", "/admin/:path*"],
};
