"use client";

import { ForwardedRef, RefObject, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { FirebaseAuthError } from "firebase-admin/auth";
import authRedirect from "@/app/auth/authRedirect";

const schema = yup.object({
  email: yup
    .string()
    .email("Valid email is required")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

function LoginPage({}, ref: ForwardedRef<boolean>) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isLoading, isValid },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async (data: yup.InferType<typeof schema>) => {
    try {
      (ref as RefObject<boolean>).current = true;
      setErrorMessage("");
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
      if ((error as FirebaseAuthError).code === "auth/user-not-found") {
        setError("email", {
          message: "email not found",
        });
      } //make validation for wrong password
      else if ((error as FirebaseAuthError).code === "auth/wrong-password") {
        setError("password", {
          message: "wrong password",
        });
      }
    }
  };

  return (
    <div
      className="flex min-h-[calc(100vh-4rem)] items-center
     justify-center  pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Login
          </CardTitle>
          <p className="text-sm text-gray-500">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent>
          {/* eslint-disable-next-line react-hooks/refs */}
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              disabled={isLoading}
              error={touchedFields.email ? errors.email?.message : undefined}
              {...register("email")}
            />
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isLoading}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer focus:outline-none hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              }
              error={
                touchedFields.password ? errors.password?.message : undefined
              }
              {...register("password")}
            />

            <div className="flex items-center justify-between">
              <Link
                href="#"
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Forgot Password?
              </Link>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600 text-center">{errorMessage}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              {"Don't"} have an account?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-primary hover:underline"
              >
                Register now
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccess}
        onClose={() => {
          router.push("/");
          setShowSuccess(false);
        }}
        title="Login Successful! 🎉"
      >
        <div className="space-y-4">
          <p className="text-lg">
            Welcome back to the <strong>Egyptian Math Olympiad</strong>!
          </p>
          <p className="text-gray-600">
            You have successfully logged in. Get ready to challenge yourself!
          </p>
          <div className="flex gap-3 mt-6">
            <Link href="/" className="flex-1" prefetch scroll>
              <Button
                onClick={() => setShowSuccess(false)}
                className="w-full"
                size="lg"
              >
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default authRedirect(LoginPage);
