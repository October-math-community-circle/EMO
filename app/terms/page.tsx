import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms & Conditions",
  openGraph: {
    title: "Terms & Conditions",
    description: "Terms & Conditions",
  },
  twitter: {
    title: "Terms & Conditions",
    description: "Terms & Conditions",
  },
};
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-zinc-50/50 to-white selection:bg-primary/20 overflow-x-hidden">
      {/* Premium Header Decoration */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary via-orange-500 to-red-600"></div>

      <div className="container mx-auto px-4 py-24 max-w-4xl relative">
        {/* Floating Background Decoration */}
        <div className="absolute top-40 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-40 -right-20 w-96 h-96 bg-orange-200/10 rounded-full blur-[120px] -z-10 animate-pulse transition-all duration-3000"></div>

        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-bold uppercase tracking-widest">
            Policy & Guidelines
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground">
            Terms <span className="text-primary italic">&</span> Conditions
          </h1>
          <p className="text-muted-foreground text-lg">
            Last Updated: February 2026
          </p>
        </div>

        <Card className="border-zinc-200 shadow-2xl shadow-zinc-200/50 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-zinc-950 p-10 md:p-14 text-white">
            <CardTitle className="text-3xl font-bold">
              The EMO Agreement
            </CardTitle>
            <p className="text-zinc-400 mt-4 leading-relaxed">
              By participating in the Egyptian Math Olympiad, you agree to
              uphold the standards of excellence, integrity, and intellectual
              honesty that our community represents.
            </p>
          </CardHeader>
          <CardContent className="p-10 md:p-14 space-y-12">
            {/* Section 1: Information Responsibility */}
            <section className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                  01
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Integrity of Information
                </h2>
              </div>
              <div className="pl-14 space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  At EMO, we trust our participants to lead with honesty. You
                  are{" "}
                  <strong className="text-foreground">
                    solely responsible
                  </strong>{" "}
                  for the accuracy and truthfulness of the information provided
                  during registration.
                </p>
                <p>
                  Any discrepancies or false data regarding your identity,
                  academic status, or contact details may result in immediate
                  disqualification to maintain the competitive fairness for all
                  other participants.
                </p>
              </div>
            </section>

            {/* Section 2: Eligibility & Age */}
            <section className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                  02
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Eligibility Requirements
                </h2>
              </div>
              <div className="pl-14">
                <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-8 space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To ensure a fair playing field, the competition is designed
                    for dedicated students within a specific academic window. To
                    be eligible to compete, you must meet the following
                    criteria:
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Age Range",
                        value: "Between 15 and 20 years old",
                      },
                      {
                        title: "Academic Status",
                        value: "Not graduated from secondary school",
                      },
                      { title: "Residency", value: "Resident of Egypt" },
                      { title: "Identity", value: "Valid National ID Holder" },
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="bg-white p-4 rounded-2xl border border-zinc-200"
                      >
                        <span className="block text-xs font-bold text-primary uppercase tracking-wider mb-1">
                          {item.title}
                        </span>
                        <span className="text-foreground font-semibold">
                          {item.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3: Conduct */}
            <section className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                  03
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Community Standards
                </h2>
              </div>
              <div className="pl-14 space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  Participation in EMO is a privilege. We expect all candidates
                  to treat their peers, proctors, and the community at large
                  with respect. Scientific integrity and the avoidance of
                  plagiarism are non-negotiable pillars of our mission.
                </p>
              </div>
            </section>

            {/* Button / Acceptance */}
            <div className="pt-8 flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-8 text-center italic">
                By registering, you acknowledge that you have read, understood,
                and agree to be bound by these criteria.
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-14 px-12 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  Back to Registration
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Questions about these terms? Reach out to our team at{" "}
            <a
              href="mailto:octobermathcommunitycircle@proton.me"
              className="text-primary font-bold hover:underline"
            >
              octobermathcommunitycircle@proton.me
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
