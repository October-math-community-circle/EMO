import { db } from "@/app/firebase-admin";
import {
  getDashboardStats,
  getMarks,
  getRegistrations,
  getStudents,
} from "@/app/server-actions/adminActions";
import { notFound } from "next/navigation";
import CompetitionDashboard from "./clientDashboard";
import { Competition } from "@october-math-community-circle/shared-utitilies/competition";
import { Timestamp } from "firebase-admin/firestore";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const compDoc = await db.collection("competitions").doc(id).get();
  if (!compDoc.exists) return notFound();
  const [regRes, marksRes, statsRes] = await Promise.all([
    getRegistrations({
      governorate: "",
      markedStatus: "all",
      searchQuery: "",
      competitionId: id,
    }),
    getMarks(id),
    getDashboardStats(id),
  ]);

  const comp = compDoc.data() as Competition;
  const students = await getStudents(regRes.data.map((r) => r.uid));

  return (
    <CompetitionDashboard
      competitionId={id}
      initialData={{
        competition: {
          id: compDoc.id,
          ...comp,
          startDate:
            (comp.startDate as Timestamp)?.toDate()?.toISOString() || "",
          endDate: (comp.endDate as Timestamp)?.toDate()?.toISOString() || "",
          createdAt: (comp.createdAt as Timestamp).toDate().toString(),
        },
        marks: marksRes.data,
        registrations: regRes.data,
        stats: statsRes.data,
        students: students.data,
      }}
    />
  );
}

export default page;
