import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
} from "./utils/consts/token.const";

export default async function middleware(req: NextRequest) {
  const access_token = req.cookies.get(ACCESS_TOKEN_NAME)?.value;
  const refresh_token = req.cookies.get(REFRESH_TOKEN_NAME)?.value;
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();
  if (pathname.includes("auth") && !pathname.includes("logout")) {
    if (access_token || refresh_token) {
      NextResponse.redirect(new URL("/", req.url));
      return res;
    }
  } else if (!access_token && !refresh_token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  if (access_token && refresh_token && pathname.includes("logout")) {
    res.cookies.delete(ACCESS_TOKEN_NAME);
    res.cookies.delete(REFRESH_TOKEN_NAME);
  }
  return res;
}
export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
