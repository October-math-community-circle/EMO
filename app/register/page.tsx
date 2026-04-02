import { db } from "@/app/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { Competition } from "@october-math-community-circle/shared-utitilies/competition";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Register for Olympiad competitions",
  description: "Register for Olympiad competitions",
  openGraph: {
    title: "Register for Olympiad competitions",
    description: "Register for Olympiad competitions",
  },
  twitter: {
    title: "Register for Olympiad competitions",
    description: "Register for Olympiad competitions",
  },
};

type CompetitionWithDetails = Competition & {
  formattedStartDate?: string;
  durationHours?: number;
};
export default async function CompetitionsListPage() {
  const competitions: CompetitionWithDetails[] = (
    await db.collection("competitions").where("status", "==", "open").get()
  ).docs
    .toSorted((a, b) => b.createTime.toMillis() - a.createTime.toMillis())
    .map((compDoc) => {
      const compData = compDoc.data() as Competition;
      const start = (compData.startDate as Timestamp)?.toDate();
      const end = (compData.endDate as Timestamp)?.toDate();

      return {
        id: compDoc.id,
        ...compData,
        formattedStartDate: start
          ? start.toLocaleString("en-US", {
              timeZone: "Africa/Cairo",
              dateStyle: "medium",
              timeStyle: "short",
            })
          : undefined,
        durationHours:
          start && end
            ? Math.round(((end.getTime() - start.getTime()) / 3600000) * 10) /
              10
            : undefined,
      };
    }) as CompetitionWithDetails[];
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-foreground mb-4">
            Available Competitions
          </h1>
          <p className="text-lg text-muted-foreground">
            Select a competition below to complete your registration.
          </p>
        </div>

        {competitions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Active Competitions
            </h3>
            <p className="text-gray-500">
              There are currently no open competitions available for
              registration. Please check back later!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {competitions.map((comp) => (
              <div
                key={comp.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {comp.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Open
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-6 flex-grow">
                  {comp.description ||
                    "No description provided for this competition."}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    {comp.location === "Online"
                      ? "Online Competition"
                      : comp.location || "Location TBD"}
                  </div>

                  {comp.formattedStartDate && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {comp.formattedStartDate} (Cairo Time)
                    </div>
                  )}

                  {comp.durationHours && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Duration: {comp.durationHours} hours
                    </div>
                  )}

                  {comp.maxParticipants ? (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Max Participants: {comp.maxParticipants}
                    </div>
                  ) : null}
                </div>

                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <Link href={`/register/${comp.id}`} className="block w-full">
                    <Button className="w-full">Register Now</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
