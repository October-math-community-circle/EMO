"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { auth } from "@/app/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/app/hooks/useUser";
import { FirebaseError } from "firebase/app";

export default function VerifyEmailPage() {
  const [isChecking, setIsChecking] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const user = useUser();
  const router = useRouter();

  const checkVerification = async () => {
    setIsChecking(true);

    try {
      if (user) {
        await auth.currentUser?.reload();
        if (user.emailVerified) {
          setMessage("Email verified successfully! Redirecting...");
          setTimeout(() => {
            router.push("/register");
          }, 1000);
        } else {
          setMessage(
            "Email not verified yet. Please check your inbox and click the verification link.",
          );
        }
      }
    } catch (error) {
      console.log({ fetchingError: error });
      setMessage("Error checking verification status. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const resendVerificationEmail = async () => {
    setIsSending(true);
    setMessage("");
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setMessage("Verification email sent! Please check your inbox.");
      }
    } catch (error: unknown) {
      console.error("Error sending verification email:", error);
      if ((error as FirebaseError)?.code === "auth/too-many-requests") {
        setMessage(
          "Too many requests. Please wait a few minutes before trying again.",
        );
      } else {
        setMessage("Error sending verification email. Please try again later.");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            {user?.emailVerified ? (
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
            ) : (
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            {user?.emailVerified ? "Email Verified!" : "Verify Your Email"}
          </CardTitle>
          {user ? <p className="text-sm text-gray-500">{user.email}</p> : null}
        </CardHeader>

        <CardContent className="space-y-6">
          {user?.emailVerified ? (
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
          ) : (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-700 text-sm">
                  {"We've"} sent a verification email to your inbox. Please
                  click the link in the email to verify your account.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={checkVerification}
                  className="w-full"
                  size="lg"
                  disabled={isChecking}
                >
                  {isChecking ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
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
                      Checking...
                    </span>
                  ) : (
                    "I've Verified My Email"
                  )}
                </Button>

                <Button
                  onClick={resendVerificationEmail}
                  variant="outline"
                  className="w-full"
                  size="lg"
                  disabled={isSending}
                >
                  {isSending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
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
                      Sending...
                    </span>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
              </div>

              {message && (
                <div
                  className={`p-3 rounded-lg text-sm text-center ${
                    message.includes("success") || message.includes("sent")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : message.includes("Error") ||
                          message.includes("not verified") ||
                          message.includes("Too many")
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {message}
                </div>
              )}
            </>
          )}

          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">Need help? </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
