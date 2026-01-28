"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "./Button";
import { useUser } from "@/app/hooks/useUser";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Competition", href: "/competitions" },
  { label: "Results", href: "/results" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const user = useUser();
  console.log({ user });
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
          ? "bg-white/90 backdrop-blur-md border-border py-2 shadow-sm"
          : "bg-white border-transparent py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className={`relative overflow-hidden rounded-full border-2 transition-all duration-300 ${
                  scrolled
                    ? "h-10 w-10 border-primary/20"
                    : "h-12 w-12 border-primary/10"
                }`}
              >
                <Image
                  src="/logo.jpg"
                  alt="OMCC Logo"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-black tracking-tighter text-foreground transition-all duration-300 ${
                    scrolled ? "text-xl" : "text-2xl"
                  }`}
                >
                  OMCC
                </span>
                <span
                  className={`font-bold tracking-widest uppercase text-primary -mt-1 hidden sm:block transition-all duration-300 ${
                    scrolled ? "text-[0.5rem] opacity-80" : "text-[0.6rem]"
                  }`}
                >
                  Egyptian Math Olympiad
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1 bg-zinc-100/50 p-1 rounded-full border border-zinc-200/50">
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
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-zinc-100 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute bg-current transition-all duration-300 h-0.5 w-6 rounded-full ${
                    isOpen ? "rotate-45 top-3" : "top-1.5"
                  }`}
                />
                <span
                  className={`absolute bg-current transition-all duration-300 h-0.5 w-6 rounded-full top-3 ${
                    isOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute bg-current transition-all duration-300 h-0.5 w-6 rounded-full ${
                    isOpen ? "-rotate-45 top-3" : "top-4.5" // 4.5 is roughly 18px/4 = 4.5 units? No, Tailwind uses rems mostly.
                    // Actually 1.5 top is 6px. 3 top is 12px. 4.5 top is 18px.
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Container */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out border-b border-border bg-white ${
          isOpen ? "max-h-96" : "max-h-0"
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
          <div className="pt-4 mt-2 border-t border-dashed border-border px-1">
            <Button
              onClick={async () => {
                await signOut(auth);
              }}
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
    </nav>
  );
}
