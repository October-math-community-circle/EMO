import { db } from "@/app/firebase-admin";
import {
  getDashboardStats,
  getMarks,
  getRegistrations,
} from "@/app/server-actions/adminActions";
import { notFound } from "next/navigation";
import CompetitionDashboard from "./clientDashboard";
import { Competition } from "@/types/competition";
import { Timestamp } from "firebase-admin/firestore";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [regRes, marksRes, statsRes, compDoc] = await Promise.all([
    getRegistrations({
      governorate: "",
      markedStatus: "all",
      searchQuery: "",
      competitionId: id,
    }),
    getMarks(id),
    getDashboardStats(id),
    db.collection("competitions").doc(id).get(),
  ]);

  if (!compDoc.exists) return notFound();
  const comp = compDoc.data() as Competition;
  return (
    <CompetitionDashboard
      competitionId={id}
      initialData={{
        competition: {
          id: compDoc.id,
          ...comp,
          createdAt: (comp.createdAt as Timestamp).toDate().toString(),
        },
        marks: marksRes.data,
        registrations: regRes.data,
        stats: statsRes.data,
      }}
    />
  );
}

export default page;
