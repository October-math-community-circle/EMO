import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Registered",
  description: "Registered",
  openGraph: {
    title: "Registered",
    description: "Registered",
  },
  twitter: {
    title: "Already Registered",
    description: "Already Registered",
  },
};
export default function AlreadyRegistered() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-white via-primary/5 to-white">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Checkmark Animation */}
        <div className="relative mb-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto bg-success/10 rounded-full flex items-center justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-success/20 rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Math-themed decoration */}
        <div className="flex justify-center gap-4 mb-8 text-4xl opacity-60">
          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
            ✓
          </span>
          <span className="animate-bounce" style={{ animationDelay: "100ms" }}>
            ∑
          </span>
          <span className="animate-bounce" style={{ animationDelay: "200ms" }}>
            π
          </span>
          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
            ∞
          </span>
          <span className="animate-bounce" style={{ animationDelay: "400ms" }}>
            ✓
          </span>
        </div>

        {/* Main Message */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 sm:px-8 py-6 shadow-lg border border-border mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Already Registered!
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            You&apos;ve already completed your registration. Your spot in the
            competition is secured!
          </p>
        </div>

        {/* Status info */}
        <div className="bg-success/10 rounded-xl p-4 sm:p-6 border border-success/20 mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
            <span className="text-sm font-semibold text-success uppercase tracking-wider">
              Registration Complete
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Check your email for confirmation and next steps.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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
        </div>

        {/* Fun Math Fact */}
        <div className="bg-zinc-50 rounded-xl p-4 sm:p-6 border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            While you wait...
          </p>
          <p className="text-sm text-foreground">
            Did you know? The number{" "}
            <span className="font-mono text-primary font-medium">1729</span> is
            known as the &quot;Hardy-Ramanujan number&quot; — the smallest
            number expressible as the sum of two cubes in two different ways!
          </p>
        </div>
      </div>
    </div>
  );
}
