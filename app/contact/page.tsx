import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FaFacebook, FaLinkedin, FaYoutube, FaEnvelope } from "react-icons/fa6";

export const metadata = {
  title: "Contact Us | Egyptian Math Olympiad",
  description:
    "Get in touch with the October Math Community Circle for any inquiries about the Egyptian Math Olympiad.",
};

export default function ContactPage() {
  const contactInfo = [
    {
      title: "Email",
      value: "octobermathcommunitycircle@proton.me",
      icon: <FaEnvelope className="w-8 h-8 text-primary font-bold" />,
      link: "mailto:octobermathcommunitycircle@proton.me",
      description: "Our primary way of communication for official inquiries.",
    },
    {
      title: "Facebook",
      value: "Egyptian Math Olympiad",
      icon: <FaFacebook className="w-8 h-8 text-blue-600" />,
      link: "https://www.facebook.com/profile.php?id=61579737463401",
      description:
        "Follow us for updates, announcements, and community highlights.",
    },
    {
      title: "LinkedIn",
      value: "October Math Community Circle",
      icon: <FaLinkedin className="w-8 h-8 text-blue-700" />,
      link: "https://eg.linkedin.com/company/october-math-community-circle",
      description:
        "Connect with us professionally and stay updated on our corporate news.",
    },
    {
      title: "YouTube",
      value: "@OctoberMathCommunityCircle",
      icon: <FaYoutube className="w-8 h-8 text-red-600" />,
      link: "https://www.youtube.com/@OctoberMathCommunityCircle",
      description: "Watch our educational content and competition highlights.",
    },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col justify-center bg-slate-50/50 py-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl mb-6">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Have questions or want to collaborate? Connect with the October Math
          Community Circle through any of our official channels.
        </p>
      </div>

      <div className="max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contactInfo.map((info) => (
            <a
              key={info.title}
              href={info.link}
              target={info.title === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group block h-full"
            >
              <Card className="h-full hover:shadow-xl hover:border-primary/40 transition-all duration-500 border-border bg-white overflow-hidden group-hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/10 group-hover:bg-primary transition-colors duration-500"></div>
                <CardHeader className="flex flex-row items-center space-x-6 p-8">
                  <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-primary/5 transition-colors duration-500 shadow-sm border border-slate-100">
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {info.title}
                    </CardTitle>
                    <p className="text-base font-semibold text-foreground/70 break-all">
                      {info.value}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8 pt-0">
                  <p className="text-base text-muted-foreground leading-relaxed italic">
                    {info.description}
                  </p>
                  <div className="mt-6 flex items-center text-primary font-bold text-sm tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 duration-500 gap-2">
                    Connect Now
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="max-w-4xl mx-auto mt-24 text-center border-t border-slate-200 pt-16">
        <h3 className="text-xl font-bold mb-4">Need immediate help?</h3>
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="/register"
            className="px-6 py-2 rounded-full border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-sm font-medium"
          >
            Competition Registration
          </a>
          <a
            href="/about"
            className="px-6 py-2 rounded-full border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-sm font-medium"
          >
            About OMCC
          </a>
          <a
            href="/"
            className="px-6 py-2 rounded-full border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-sm font-medium"
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
