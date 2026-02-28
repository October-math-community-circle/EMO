const protectedPrefixes = ["/dashboard", "/register"];
export default function isProtectedRoute(pathname: string) {
  return (
    (protectedPrefixes.some((prefix) => pathname.startsWith(prefix)) &&
      pathname !== "/register/registered") ||
    pathname === "/auth/verify"
  );
}
