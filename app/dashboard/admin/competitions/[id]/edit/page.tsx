import { db } from "@/app/firebase-admin";
import { notFound } from "next/navigation";
import EditCompetitionForm from "./EditCompetitionForm";
import {
  Competition,
  Problem,
} from "@october-math-community-circle/shared-utitilies/competition";
import { Timestamp } from "firebase-admin/firestore";
//import { storage } from "@/app/firebase-admin";
//import { getDownloadURL } from "firebase-admin/storage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // Server-side fetch using firebase-admin
  const competitionDoc = await db.collection("competitions").doc(id).get();

  if (!competitionDoc.exists) {
    return notFound();
  }
  const competitionData: Competition = competitionDoc.data() as Competition;
  const problemsArr = [];
  for (const problemId in competitionData.problems) {
    problemsArr.push(db.collection("problems").doc(problemId).get());
  }
  const problemDocs = await Promise.all(problemsArr);
  return (
    <EditCompetitionForm
      id={id}
      initialData={{
        ...competitionData,
        id: competitionDoc.id,
        createdAt: (competitionData.createdAt as Timestamp)
          ?.toDate()
          .toISOString(),
        startDate: (competitionData.startDate as Timestamp)
          .toDate()
          .toISOString(),
        endDate: (competitionData.endDate as Timestamp).toDate().toISOString(),
      }}
      initialProblems={problemDocs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Problem),
      }))}
    />
  );
}
