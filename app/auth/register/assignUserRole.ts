"use server";

import { auth } from "@/app/firebase-admin";

export async function assignUserRole(uid: string) {
  try {
    await auth.setCustomUserClaims(uid, {
      role: "student",
    });
  } catch (error) {
    console.log({ assignUserClaims: error });
  }
}
