import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import type { Metadata } from "next";
import { forbidden } from "next/navigation";
export const metadata: Metadata = {
  title: "EG Science Olympiad",
  description: "EG Science Olympiad",
  openGraph: {
    title: "EG Science Olympiad",
    description: "EG Science Olympiad",
    url: "https://www.egyptmathematicalfoundation.org",
    siteName: "EG Science Olympiad",
    images: [
      {
        url: "https://www.egyptmathematicalfoundation.org/logo.png",
        width: 1200,
        height: 630,
        alt: "EG Science Olympiad",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EG Science Olympiad",
    description: "EG Science Olympiad",
    images: ["https://www.egyptmathematicalfoundation.org/logo.png"],
  },
};
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Asymmetrical Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Excellence. Structure. International Representation.
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                Building Egypt’s Future in <br />
                <span className="text-primary">International Olympiads</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                EGSO is a national academic initiative dedicated to organizing,
                developing, and advancing Egypt’s participation in international
                scientific Olympiads.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto text-base h-12">
                    Join the Community
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-base h-12"
                  >
                    Explore Our Mission
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative lg:h-150 w-full">
              {/* Abstract Composition */}
              <div className="absolute top-0 right-0 w-4/5 h-full bg-zinc-100 rounded-[2rem] transform rotate-3"></div>
              <div className="absolute top-10 right-10 w-4/5 h-full bg-white border border-border rounded-[2rem] shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                {/* Floating UI Elements Simulation */}
                <div className="relative z-10 grid gap-6 p-8 w-full max-w-sm">
                  <Card className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="p-4 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        ∑
                      </div>
                      <div>
                        <div className="h-2 w-24 bg-zinc-200 rounded mb-2"></div>
                        <div className="h-2 w-16 bg-zinc-100 rounded"></div>
                      </div>
                    </div>
                  </Card>
                  <Card className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 translate-x-8">
                    <div className="p-4 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center text-warning font-bold">
                        π
                      </div>
                      <div>
                        <div className="h-2 w-24 bg-zinc-200 rounded mb-2"></div>
                        <div className="h-2 w-16 bg-zinc-100 rounded"></div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Description */}
      <section className="py-24 bg-zinc-50/50 border-y border-border">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-2xl font-medium text-foreground leading-relaxed">
            "We work to create a structured, transparent, and sustainable
            Olympiad system across Mathematics, Physics, Chemistry, Biology, and
            related disciplines preparing Egyptian students to compete at the
            highest international level."
          </p>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              What We Do
            </h2>
            <p className="text-lg text-muted-foreground">
              EGSO supports preparation and representation in leading global
              competitions through a comprehensive framework.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "National Training Programs",
                desc: "Structured Olympiad-level training designed to meet international standards.",
                icon: "A+",
              },
              {
                title: "Selection & Evaluation",
                desc: "Transparent academic selection processes aligned with global competition frameworks.",
                icon: "📋",
              },
              {
                title: "International Representation",
                desc: "Official coordination of Egypt’s participation in international Olympiads.",
                icon: "🌍",
              },
              {
                title: "Academic Mentorship",
                desc: "Guidance from experienced trainers, researchers, and former competitors.",
                icon: "👨‍🏫",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="h-full border-zinc-200 hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-8 pt-8">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission and Vision Grid */}
      <section className="py-24 bg-zinc-900 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <span className="h-8 w-1 bg-primary"></span>
                  Our Mission
                </h2>
                <ul className="space-y-4">
                  {[
                    "Discover and nurture exceptional scientific talent",
                    "Build a sustainable national Olympiad pathway",
                    "Raise Egypt’s competitive standing internationally",
                    "Establish institutional credibility and academic excellence",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-4 text-zinc-400"
                    >
                      <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs shrink-0 mt-1">
                        ✓
                      </span>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="p-8 lg:p-12 rounded-4xl bg-zinc-800/50 border border-zinc-700 h-full flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                <p className="text-xl text-zinc-300 leading-relaxed italic">
                  "To position Egypt as a respected and consistent presence in
                  international scientific Olympiads through discipline,
                  structure, and long-term development."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
              Get Involved
            </h2>
            <p className="text-lg text-muted-foreground">
              EGSO welcomes all who wish to contribute to scientific excellence
              in Egypt.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              "Students aspiring to competition",
              "Mentors & academic contributors",
              "Institutional partners & sponsors",
              "Researchers & advisors",
            ].map((target, i) => (
              <div
                key={i}
                className=" flex justify-center items-center text-center p-6 rounded-2xl bg-zinc-50 border border-zinc-100"
              >
                <p className="font-semibold text-foreground">{target}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="pb-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="relative rounded-4xl bg-zinc-950 overflow-hidden border border-white/5 px-8 py-20 text-center lg:text-left lg:px-20 lg:py-24 group">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                  Ready to be part of <br className="hidden lg:block" />
                  <span className="text-primary italic">the future?</span>
                </h2>
                <p className="text-zinc-400 text-lg mb-10 max-w-md leading-relaxed">
                  Join Egypt's national initiative to advance scientific
                  excellence on the global stage. Start your journey today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="h-14 px-8 text-base bg-white text-zinc-950 hover:bg-zinc-100 font-semibold shadow-xl shadow-black/20"
                    >
                      Create Student Account
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      size="lg"
                      className="h-14 px-8 text-base border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all font-medium"
                    >
                      Partner With Us
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex justify-end relative">
                <div className="relative">
                  {/* Decorative element */}
                  <div className="h-64 w-64 rounded-full border border-primary/20 flex items-center justify-center animate-pulse">
                    <div className="h-48 w-48 rounded-full border border-primary/10 flex items-center justify-center">
                      <div className="h-32 w-32 rounded-full bg-primary/20 blur-2xl"></div>
                      <span className="text-6xl font-bold text-primary opacity-50 absolute">
                        EGSO
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
