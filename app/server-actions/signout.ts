"use server";
import { cookies } from "next/headers";
export async function signout() {
  const cookiesObj = await cookies();
  cookiesObj.delete("session");
}
