"use client";

import { useEffect, useState } from "react";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/app/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { FirebaseError } from "firebase/app";

type VerificationState = "verifying" | "success" | "error";

function getErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-action-code":
        return "This verification link is invalid or has already been used.";
      case "auth/expired-action-code":
        return "This verification link has expired. Please request a new one.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/user-not-found":
        return "No account found for this verification link.";
      default:
        return "An unexpected error occurred. Please try again later.";
    }
  }
  return "An unexpected error occurred. Please try again later.";
}

export default function VerifyUser({
  oobCode,
  isVerified,
}: {
  oobCode: string | undefined;
  isVerified: boolean | null;
}) {
  const [state, setState] = useState<VerificationState>(
    isVerified ? "success" : oobCode ? "verifying" : "error",
  );
  const [errorMessage, setErrorMessage] = useState(
    oobCode
      ? ""
      : "No verification code found. Please use the link from your email.",
  );
  useEffect(() => {
    if (isVerified) return;
    if (!oobCode) return;
    const verify = async () => {
      try {
        await applyActionCode(auth, oobCode);
        // Reload the user so the auth context picks up emailVerified: true
        await auth.currentUser?.reload();
        setState("success");
      } catch (error) {
        console.error("Email verification failed:", error);
        setErrorMessage(getErrorMessage(error));
        setState("error");
      }
    };

    verify();
  }, [oobCode]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
            {state === "verifying" && (
              <svg
                className="animate-spin h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {state === "success" && (
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {state === "error" && (
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            {state === "verifying" && "Verifying Your Email..."}
            {state === "success" && "Email Verified!"}
            {state === "error" && "Verification Failed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {state === "verifying" && (
            <div className="text-center">
              <p className="text-gray-600">
                Please wait while we verify your email address.
              </p>
            </div>
          )}

          {state === "success" && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 font-medium">
                  Your email has been verified successfully!
                </p>
              </div>
              <Link href="/">
                <Button className="w-full" size="lg">
                  Continue to Home
                </Button>
              </Link>
            </div>
          )}

          {state === "error" && (
            <div className="text-center space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium">{errorMessage}</p>
              </div>
              <Link href="/auth/verify">
                <Button variant="outline" className="w-full" size="lg">
                  Resend Verification Email
                </Button>
              </Link>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Need help?{" "}
              <Link
                href="/contact"
                className="font-semibold text-primary hover:underline"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
