"use server";

import { db } from "@/app/firebase-admin";
import { serverActionWrapperRESPONSE } from "@/lib/utils/serverActionWrapper";
import { revalidatePath } from "next/cache";

const updateRegistrationInternal = async (
  registrationId: string,
  data: { governorate: string; nationalId: string },
) => {
  await db.collection("registrations").doc(registrationId).update({
    governorate: data.governorate,
    nationalId: data.nationalId,
  });
  revalidatePath("/dashboard/student");
};
export const updateRegistration = serverActionWrapperRESPONSE(
  updateRegistrationInternal,
  null as unknown as void,
  "Error updating registration",
);
