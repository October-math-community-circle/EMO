"use server";

import { auth, db } from "@/app/firebase-admin";
import { serverActionWrapperRESPONSE } from "@/lib/utils/serverActionWrapper";
import { Student } from "@october-math-community-circle/shared-utitilies/auth";
import { Timestamp } from "firebase-admin/firestore";

async function createUserInternal(
  userData: Student,
  uid: string,
  jwt: string,
): Promise<null> {
  await auth.verifyIdToken(jwt);
  const isAvailable = await db.collection("user").doc(uid).get();
  if (isAvailable.exists == true) return null;
  await db
    .collection("users")
    .doc(uid)
    .set({
      ...userData,
      dob: Timestamp.fromDate(new Date(userData.dob as string)),
      createdAt: Timestamp.now(),
    });
  return null;
}
export const createUserDoc = serverActionWrapperRESPONSE(
  createUserInternal,
  null,
  "failed to Create User",
);
