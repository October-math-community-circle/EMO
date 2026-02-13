import { NextRequest, NextResponse } from "next/server";
import { auth, db } from "./app/firebase-admin";

const proxyHandlers: Record<
  string,
  (req: NextRequest) => Promise<NextResponse>
> = {
  "/auth/login": async (req: NextRequest) => {
    const user = await getUser(req);
    if (user) {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
    return NextResponse.next();
  },
  "/auth/register": async (req: NextRequest) => {
    const user = await getUser(req);
    if (user) {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
    return NextResponse.next();
  },
  "/register": async (req: NextRequest) => {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
    }
    console.log({ proxyUser: user });

    if (!user.email_verified) {
      return NextResponse.redirect(new URL("/auth/verify", req.nextUrl.origin));
    }
    const isRegistered = (
      await db
        .collection("registrations")
        .where("uid", "==", user.uid)
        .where("expired", "==", false)
        .get()
    ).empty;
    if (!isRegistered) {
      return NextResponse.redirect(
        new URL("/register/registered", req.nextUrl.origin),
      );
    }
    return NextResponse.next();
  },
  "/register/registered": async (req: NextRequest) => {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
    }
    const isRegistered = (
      await db
        .collection("registrations")
        .where("uid", "==", user.uid)
        .where("expired", "==", false)
        .get()
    ).empty;
    if (isRegistered) {
      return NextResponse.redirect(new URL("/register", req.nextUrl.origin));
    }
    return NextResponse.next();
  },
  "/auth/verify": async (req: NextRequest) => {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
    }
    if (user.email_verified) {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
    return NextResponse.next();
  },
};
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (req.headers.has("Next-Action") && req.method === "POST") {
    console.log("server action");
    return NextResponse.next();
  }
  if (proxyHandlers[pathname]) {
    return proxyHandlers[pathname](req);
  }
  return NextResponse.next();
}
async function getUser(req: NextRequest) {
  const JWT = req.cookies.get("session");
  try {
    const user = await auth.verifySessionCookie(JWT?.value || "");
    return user;
  } catch (error) {
    console.log({ getUserError: error });
    return null;
  }
}
export const config = {
  matcher: [
    "/dashboard/admin",
    "/dashboard/coach",
    "/dashboard/student",
    "/register/registered",
    "/auth/login",
    "/auth/register",
    "/auth/verify",
    "/register",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
