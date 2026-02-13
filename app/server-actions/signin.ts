"use server";
import { auth } from "@/app/firebase-admin";
import { cookies } from "next/headers";

export async function signin(jwt: string) {
  try {
    const expiresIn = 3600 * 1000 * 24 * 5;
    const cookie = await auth.createSessionCookie(jwt, { expiresIn });
    const cookiesObj = await cookies();
    cookiesObj.set("session", cookie, {
      httpOnly: true,
      maxAge: expiresIn,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    console.log("signIn action");
  } catch (error) {
    console.log({ signInServerActionError: error });
  } finally {
    return null;
  }
}
