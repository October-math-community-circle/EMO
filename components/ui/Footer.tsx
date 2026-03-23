"use client";
import Link from "next/link";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="relative h-16 w-16 mr-3 rounded-full overflow-hidden border border-border">
                <Image
                  src="/logo.png"
                  alt="EGSO"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-foreground">
                  EGSO
                </span>
                <p className="text-sm text-muted-foreground">
                  Egypt Science Olympiad
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground tracking-widest uppercase mb-6">
              Competition
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Past Papers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground tracking-widest uppercase mb-6">
              Participants
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="/auth/register"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Student Registration
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Coach Portal
                </a>
              </li>
            </ul>
          </div>

          <div className="">
            <h3 className="text-sm font-bold text-foreground tracking-widest uppercase mb-6">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="text-sm text-muted-foreground break-all">
                {/*  <a
                  href="mailto:admin@egyptmathematicalfoundation.org"
                  target="_blank"
                  className="hover:text-primary transition-colors"
                >
                  admin@egyptmathematicalfoundation.org
                </a> */}
              </li>
              <li className="flex gap-4 mt-4">
                <div className="w-8 h-8 rounded bg-zinc-100 hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-center text-foreground font-bold text-xs">
                  <a target="_blank" href="#">
                    FB
                  </a>
                </div>
                <div className="w-8 h-8 rounded bg-zinc-100 hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-center text-foreground font-bold text-xs">
                  <a target="_blank" href="#">
                    <FaLinkedin size={15} />
                  </a>
                </div>
                <div className="w-8 h-8 rounded bg-zinc-100 hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-center text-foreground font-bold text-xs">
                  <a target="_blank" href="#">
                    <FaYoutube size={15} />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row flex-wrap justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EG Science Olympiad. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
              Privacy
            </span>
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
              <Link href="/terms" prefetch>
                Terms
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
