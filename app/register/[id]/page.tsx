import { db } from "@/app/firebase-admin";
import getUser from "@/lib/utils/getUser";
import { notFound, redirect } from "next/navigation";
import { CompetitionRegisterPage } from "./clientRegisterPage";
import { Competition } from "@/types/competition";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log({ id });

  const user = await getUser();
  if (user?.role !== "student") redirect("/");
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
      params={{ id }}
    />
  );
}

export default page;
