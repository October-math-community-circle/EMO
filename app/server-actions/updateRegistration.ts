"use server";

import { db } from "@/app/firebase-admin";
import { revalidatePath } from "next/cache";

export async function updateRegistration(
  registrationId: string,
  data: { governorate: string; nationalId: string },
) {
  try {
    await db.collection("registrations").doc(registrationId).update({
      governorate: data.governorate,
      nationalId: data.nationalId,
    });
    revalidatePath("/dashboard/student");
    return { success: true };
  } catch (error) {
    console.error("Error updating registration:", error);
    return { success: false, error: "Failed to update registration" };
  }
}
