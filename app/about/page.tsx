import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-primary/20 overflow-x-hidden">
      {/* Immersive Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/math_olympiad_hero_abstract_1772195100076.png"
            alt="Mathematical Excellence Abstract"
            fill
            className="object-cover opacity-60 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-white/20 via-white/80 to-white"></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/40 shadow-sm text-primary animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                Our Infinite Journey
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Beyond the <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-red-600 to-orange-600">
                Calculated
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              Mathematics isn&apos;t just about answers. It&apos;s about asking
              the right questions. Join the community redefining academic
              excellence across Egypt.
            </p>

            <div className="pt-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-16 px-10 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-transform duration-300 pointer-events-auto"
                >
                  Start Your Odyssey
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="w-1 h-12 rounded-full bg-linear-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* Values: Glassmorphic Cards */}
      <section className="py-32 bg-zinc-50/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-zinc-200 to-transparent"></div>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6">
              Our DNA
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We aren&apos;t just organizing an event; we&apos;re fostering a
              culture of intellectual fearlessness.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Radical Curiosity",
                desc: "We encourage students to tear down the walls of 'why' and explore the infinite mechanics of 'how'.",
                icon: "∑",
                gradient: "from-red-50 to-white",
              },
              {
                title: "Absolute Equity",
                desc: "Brilliance is universal. We ensure that every student, regardless of their background, has an equal shot at glory.",
                icon: "π",
                gradient: "from-orange-50 to-white",
              },
              {
                title: "Global Mastery",
                desc: "We don&apos;t settle for local standards. Our aim is to forge the next generation of global mathematical leaders.",
                icon: "∞",
                gradient: "from-zinc-100 to-white",
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className={`group relative bg-white border border-zinc-200 p-12 rounded-[2.5rem] shadow-xl hover:shadow-primary/5 transition-all duration-700`}
              >
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                <div className="relative z-10">
                  <div className="h-16 w-16 bg-zinc-900 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mb-10 transition-transform duration-500 group-hover:rotate-10">
                    {pillar.icon}
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-5">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA: Immersive & Bold */}
      <section className="py-40 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="relative p-16 md:p-32 rounded-[4rem] bg-zinc-900 border border-zinc-800 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(220,38,38,0.2),transparent_60%)]"></div>

            {/* Floating Orbs for "Smoothness" */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-[60px] animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-orange-600/10 rounded-full blur-[80px] animate-pulse transition-all duration-3000"></div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-10">
              <h2 className="text-5xl md:text-7xl font-black text-white leading-tight px-4">
                Ready to solve for <br />
                <span className="italic text-primary">tomorrow?</span>
              </h2>
              <p className="text-zinc-400 text-xl md:text-2xl leading-relaxed">
                The next season is calling. Join thousands of students unlocking
                their true potential.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <Link href="/auth/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-20 px-12 text-xl font-bold rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 w-full sm:px-16 transition-all shadow-white/10 shadow-2xl"
                  >
                    Register Now
                  </Button>
                </Link>
                <Link
                  href="/contact"
                  className="text-zinc-400 hover:text-white transition-colors text-lg font-medium underline-offset-8 hover:underline"
                >
                  Contact the Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
