import { db } from "@/app/firebase-admin";
import getUser from "@/lib/utils/getUser";
import { forbidden, notFound, redirect } from "next/navigation";
import { CompetitionRegisterPage } from "./clientRegisterPage";
import { Competition } from "@october-math-community-circle/shared-utitilies/competition";

import { FieldPath, Timestamp } from "firebase-admin/firestore";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();
  if (user?.role !== "student") forbidden();
  const competitionDocument = await db.collection("competitions").doc(id).get();
  if (competitionDocument.exists == false) return notFound();
  const isNotRegistered = (
    await db
      .collection("registrations")
      .where("uid", "==", user.uid)
      .where("competitionId", "==", id)
      .get()
  ).empty;
  if (isNotRegistered == false) {
    return redirect("/register/registered");
  }
  const competitionData = competitionDocument.data() as Competition;

  return (
    <CompetitionRegisterPage
      competitionTitle={competitionData.title}
      competitionStartDate={(competitionData.startDate as Timestamp)
        ?.toDate()
        ?.toISOString()}
      competitionEndDate={(competitionData.endDate as Timestamp)
        ?.toDate()
        ?.toISOString()}
      id={id}
    />
  );
}

export default page;
