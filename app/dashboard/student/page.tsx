import { Card, CardContent } from "@/components/ui/Card";
import getUser from "@/lib/utils/getUser";
import { db } from "@/app/firebase-admin";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Mark, Registration } from "@/types/registration";
import { RegistrationCard } from "./RegistrationCard";
import { FieldPath, Timestamp } from "firebase-admin/firestore";
import { Competition } from "@/types/competition";
export const dynamic = "force-dynamic";
export default async function StudentDashboard() {
  const user = await getUser();
  const registrations = (
    await db.collection("registrations").where("uid", "==", user?.uid).get()
  ).docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.createTime.toDate().toISOString(),
  })) as Registration[];
  const marks: Mark[] = [];
  const competitions: Competition[] = (
    await db
      .collection("competitions")
      .where(
        FieldPath.documentId(),
        "in",
        registrations.map((reg) => reg.competitionId),
      )
      .get()
  ).docs.map((doc) => ({
    ...(doc.data() as Competition),
    id: doc.id,
    createdAt: doc.createTime.toDate().toISOString(),
  })) as Competition[];
  for (const reg of registrations) {
    if (reg.marked) {
      const markDoc = await db
        .collection("marks")
        .where("registrationId", "==", reg.id)
        .get();
      if (markDoc.empty) continue;
      marks.push({
        ...(markDoc.docs[0].data() as Mark),
        id: markDoc.docs[0].id,
        markedAt: ((markDoc.docs[0].data() as Mark).markedAt as Timestamp)
          .toDate()
          .toString(),
      });
    }
  }
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Registrations</h1>
        <p className="text-muted-foreground mt-1">
          View your competition registrations
        </p>
      </div>

      <div className="space-y-4">
        {registrations.length === 0 ? (
          <Card className="flex justify-center items-center">
            <CardContent className="p-6! text-center">
              <p className="text-muted-foreground mb-4">
                You have no registrations yet.
              </p>
              <Link href="/register">
                <Button>Register Now</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          registrations.map((reg) => (
            <RegistrationCard
              mark={
                marks.find(
                  (mark) => mark.registrationId === reg.id,
                ) as Mark | null
              }
              competition={
                competitions.find(
                  ({ id }) => id === reg.competitionId,
                ) as Competition
              }
              key={reg.id}
              registration={reg}
            />
          ))
        )}
      </div>
    </div>
  );
}
