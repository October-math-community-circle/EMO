import { Metadata } from "next";
import VerifyUser from "./verifyUser";
import getUser from "@/lib/utils/getUser";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address for EGSO",
};
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getUser();
  const params = await searchParams;
  const oobCode = params?.oobCode as string;
  return (
    <VerifyUser
      oobCode={oobCode || ""}
      isVerified={user?.email_verified || false}
    />
  );
}
