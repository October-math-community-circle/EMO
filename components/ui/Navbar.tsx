"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "./Button";
import { useUser } from "@/app/hooks/useUser";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Register", href: "/register" },
  //{ label: "About", href: "https://" },
  //  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const user = useUser();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(Math.floor(window.scrollY) > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-border shadow-sm"
          : "bg-white border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2.5">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className={`relative overflow-hidden rounded-full border-2 transition-all duration-300 ${
                  scrolled
                    ? "h-14 w-14 border-primary/20"
                    : "h-16 w-16 border-primary/10"
                }`}
              >
                <Image
                  src="/logo.png"
                  alt="EGSO Logo"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-black tracking-tighter text-foreground transition-all duration-300 ${
                    scrolled ? "text-xl" : "text-2xl"
                  }`}
                >
                  EGSO
                </span>
                <span
                  className={`font-bold tracking-widest uppercase text-black font-semibold -mt-1 transition-all duration-300 ${
                    scrolled ? "text-[0.5rem] opacity-80" : "text-[0.6rem]"
                  }`}
                >
                  EG Science Olympiad
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <div
              className={`flex items-center gap-1 bg-zinc-100/50 p-1 rounded-full border border-zinc-200/50
                transition-all duration-300
              ${scrolled ? "scale-95" : ""}
            `}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white text-primary shadow-sm ring-1 ring-zinc-200"
                        : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {user ? (
                <Link
                  href={`/dashboard/${user.claims.role}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    pathname === "/dashboard"
                      ? "bg-white text-primary shadow-sm ring-1 ring-zinc-200"
                      : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50"
                  }`}
                >
                  Dashboard
                </Link>
              ) : null}
              <a
                href="https://aast.edu"
                target="_blank"
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                  text-muted-foreground hover:text-foreground hover:bg-zinc-200/50`}
              >
                About
              </a>
            </div>
            <Button
              onClick={async () => {
                await signOut(auth);
              }}
              variant="outline"
              size={scrolled ? "sm" : "md"}
              className={`w-full justify-center ${user ? "" : "hidden!"}`}
            >
              sign out
            </Button>
            <Link href="/auth/login" className={user ? "hidden!" : ""}>
              <Button
                variant="primary"
                size={scrolled ? "sm" : "md"}
                className={`shadow-red-500/20 hover:shadow-red-500/30 transition-all`}
              >
                Login Portal
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-zinc-100 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute left-0 bg-current transition-all duration-300 h-0.5 w-6 rounded-full ${
                    isOpen ? "rotate-45 top-2.75" : "top-1.5"
                  }`}
                />
                <span
                  className={`absolute left-0 bg-current transition-all duration-300 h-0.5 w-6 rounded-full top-2.75 ${
                    isOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 bg-current transition-all duration-300 h-0.5 w-6 rounded-full ${
                    isOpen ? "-rotate-45 top-2.75" : "top-4.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Container */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out border-b border-border bg-white ${
          isOpen ? "max-h-max" : "max-h-0"
        }`}
      >
        <div className="space-y-1 px-4 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? "bg-primary/5 text-primary"
                    : "text-foreground hover:bg-zinc-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {user ? (
            <Link
              href={`/dashboard/${user.claims.role}`}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                pathname === `/dashboard/${user.claims.role}`
                  ? "bg-primary/5 text-primary"
                  : "text-foreground hover:bg-zinc-50"
              }`}
            >
              Dashboard
            </Link>
          ) : null}
          <a
                href="https://aast.edu"
                target="_blank"
                className={`block px-4 py-3 rounded-lg 
                             text-base font-medium transition-colors 
                            text-foreground hover:bg-zinc-50`}
              >
                About
              </a>
          <div className=" mt-2 border-t border-dashed border-border px-1">
            <Button
              onClick={async () => {
                await signOut(auth);
              }}
              variant="outline"
              className={`w-full justify-center ${user ? "" : "hidden!"}`}
            >
              sign out
            </Button>
            <Link
              className={user ? "hidden!" : ""}
              href="/auth/login"
              onClick={() => setIsOpen(false)}
            >
              <Button className="w-full justify-center">Access Portal</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Red Alert Support Banner - Redesigned for a cleaner look */}
      <div className="bg-primary text-white py-2 relative border-t border-white/10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/*  <div className="flex items-center justify-center gap-3 text-center">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
            <p className="text-[11px] sm:text-[13px] font-medium tracking-tight">
              We are currently seeking an urgent sponsor to support our upcoming
              olympiads.
              <Link
                href="/contact"
                prefetch
                className="ml-2.5 font-bold hover:underline transition-all inline-flex items-center gap-1 group"
              >
                Partner with us
                <span className="group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </Link>
            </p>
          </div> */}
          <div className="flex items-center justify-center gap-3 text-center mt-0.5">
            <p className="font-bold text-[11px] sm:text-[13px]  tracking-tight ">
              We are the same people, the same plans, and everything is fine. we
              just changed the name of the organization.
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
