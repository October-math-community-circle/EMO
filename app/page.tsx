import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Asymmetrical Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Registration Open 2024
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                Redefining <br />
                <span className="text-primary">Mathematical Excellence</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                Join {"Egypt's"} premier academic competition. We challenge the
                status quo and cultivate the next generation of problem solvers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto text-base h-12">
                    Join the Competition
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-base h-12"
                  >
                    Discover OMCC
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8 text-muted-foreground">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-background bg-zinc-200"
                    />
                  ))}
                </div>
                <div className="text-sm font-medium">
                  <span className="text-foreground font-bold">5000+</span>{" "}
                  Students Joined
                </div>
              </div>
            </div>

            <div className="relative lg:h-[600px] w-full">
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

      {/* Metrics Section */}
      <section className="py-20 border-y border-border bg-zinc-50/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Active Participants", value: "5k+" },
              { label: "Partner Schools", value: "200+" },
              { label: "Awards Granted", value: "150" },
              { label: "Years active", value: "15" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-4xl font-bold tracking-tight text-foreground mb-1">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-20 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
              Why the Egyptian Math Olympiad?
            </h2>
            <p className="text-lg text-muted-foreground">
              We provide a platform that goes beyond standard curriculum,
              offering students a chance to tackle problems that matter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "National Recognition",
                desc: "Gain recognition from top universities and institutions across Egypt.",
              },
              {
                title: "International Standards",
                desc: "Our problems are curated to meet IMO standards, preparing you for the global stage.",
              },
              {
                title: "Community Driven",
                desc: "Join a network of like-minded peers, mentors, and professors.",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="h-full border-zinc-200 hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-8">
                  <div className="h-12 w-12 bg-zinc-100 flex items-center justify-center mb-6">
                    <span className="text-xl font-bold text-primary">
                      {i + 1}
                    </span>
                  </div>
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

      {/* Modern CTA */}
      <section className="py-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="relative rounded-[2rem] bg-zinc-900 overflow-hidden px-8 py-20 text-center lg:text-left lg:px-20 lg:py-24">
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  Ready to challenge yourself?
                </h2>
                <p className="text-zinc-400 text-lg mb-8 max-w-md">
                  Register now for the upcoming season and gain access to our
                  exclusive preparation materials.
                </p>
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    variant="primary"
                    className="h-14 px-8 text-base bg-primary text-white"
                  >
                    Create Student Account
                  </Button>
                </Link>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="h-64 w-64 bg-gradient-to-tr from-primary to-orange-600 rounded-full blur-[80px] opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
