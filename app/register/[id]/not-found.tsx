import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CompetitionNotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-16 bg-linear-to-br from-white via-red-50/20 to-white">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[10rem] sm:text-[14rem] font-black text-primary/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-border">
              <span className="text-4xl sm:text-5xl font-bold text-primary">
                Missing!
              </span>
            </div>
          </div>
        </div>

        {/* Math-themed decoration */}
        <div className="flex justify-center gap-4 mb-8 text-4xl opacity-60">
          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
            ?
          </span>
          <span className="animate-bounce" style={{ animationDelay: "100ms" }}>
            ≠
          </span>
          <span className="animate-bounce" style={{ animationDelay: "200ms" }}>
            ∅
          </span>
          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
            ∄
          </span>
          <span className="animate-bounce" style={{ animationDelay: "400ms" }}>
            !
          </span>
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          Competition Not Found
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          We couldn&apos;t find the competition you&apos;re looking for. It
          might have ended, or the link might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" prefetch>
            <Button size="lg" className="w-full sm:w-auto px-8">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Home
            </Button>
          </Link>
          <Link href="/dashboard/student" prefetch>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8"
            >
              My Registrations
            </Button>
          </Link>
        </div>

        {/* Fun Math Fact */}
        <div className="mt-8 bg-zinc-50 rounded-xl p-6 border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            Math Fact
          </p>
          <p className="text-sm text-foreground">
            In mathematics, the symbol{" "}
            <span className="font-mono text-primary font-bold">∄</span> means
            &quot;there does not exist&quot;.
          </p>
        </div>
      </div>
    </div>
  );
}
