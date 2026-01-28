"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import * as yup from "yup";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/app/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ForwardedRef, MutableRefObject, RefObject, useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseAuthError } from "firebase-admin/auth";
import authRedirect from "@/app/auth/authRedirect";
// create a yup schema for form validation with hook form using yup
const capitalLettersRegex = /[A-Z]/g;
const smallLetterRegex = /[a-z]/g;
const includeNumber = /\d+/gi;
const maxDob = new Date();
const schema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Valid email is required").required(),
  phone: yup.string().required("Phone number is required"),
  school: yup.string().required("School is required"),
  dob: yup.date().max(maxDob, "Date of birth must be before today").required(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .matches(capitalLettersRegex, {
      message: "Please add at least 1 capital letter",
    })
    .matches(includeNumber, { message: "Please include at least 1 number" })
    .matches(smallLetterRegex, {
      message: "Please add at least 1 small letter",
    })
    .required("Password is required"),
});
function RegisterPage({}, ref: ForwardedRef<boolean>) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });
  const createUser = async ({
    school,
    dob,
    email,
    fullName,
    password,
    phone,
  }: yup.InferType<typeof schema>) => {
    try {
      alert("submitting");
      (ref as RefObject<boolean>).current = true;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const userDoc = doc(db, "users", userCredential.user.uid);
      await setDoc(userDoc, {
        fullName,
        email,
        phone,
        school,
        dob,
        createdAt: serverTimestamp(),
        type: "student",
      });
      // Show success modal
      setRegisteredEmail(email);
      setShowSuccess(true);
    } catch (error) {
      console.log(error);
      alert(error);
      if ((error as FirebaseAuthError).code === "auth/email-already-in-use") {
        setError("email", {
          message: "Email already in use",
        });
      }
    }
  };
  const { push } = useRouter();
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Student Registration
          </CardTitle>
          <p className="text-sm text-gray-500">
            Join the Egyptian Math Olympiad
          </p>
        </CardHeader>
        <CardContent>
          {/* eslint-disable-next-line react-hooks/refs */}
          <form onSubmit={handleSubmit(createUser)} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  {...register("fullName")}
                  placeholder="Ahmed Hassan"
                  label="Full Name"
                  disabled={isSubmitting}
                  error={
                    errors.fullName && touchedFields.fullName
                      ? errors.fullName.message
                      : ""
                  }
                />
              </div>

              <div>
                <Input
                  {...register("email")}
                  placeholder="ahmed@example.com"
                  type="email"
                  label="Email"
                  disabled={isSubmitting}
                  error={
                    errors.email && touchedFields.email
                      ? errors.email.message
                      : ""
                  }
                />
              </div>
              <div>
                <Input
                  {...register("phone")}
                  placeholder="+20 123 456 7890"
                  label="Phone"
                  disabled={isSubmitting}
                  error={
                    errors.phone && touchedFields.phone
                      ? errors.phone.message
                      : ""
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  {...register("school")}
                  placeholder="Cairo STEM School"
                  label="School"
                  disabled={isSubmitting}
                  error={
                    errors.school && touchedFields.school
                      ? errors.school.message
                      : ""
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  {...register("dob")}
                  type="date"
                  label="Date of Birth"
                  disabled={isSubmitting}
                  error={
                    errors.dob && touchedFields.dob ? errors.dob.message : ""
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  {...register("password")}
                  disabled={isSubmitting}
                  type={showPassword ? "text" : "password"}
                  placeholder="eg: 123@.l"
                  label="Password"
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
                    errors.password && touchedFields.password
                      ? errors.password.message
                      : ""
                  }
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!isValid || isSubmitting}
            >
              Submit Registration
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already registered?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccess}
        onClose={() => {
          push("/", { scroll: true });
          setShowSuccess(false);
        }}
        title="Registration Successful! 🎉"
      >
        <div className="space-y-4">
          <p className="text-lg">
            Welcome to the <strong>Egyptian Math Olympiad</strong>!
          </p>
          <p className="text-gray-600">
            Your account has been created successfully with email:{" "}
            <span className="font-semibold text-primary">
              {registeredEmail}
            </span>
          </p>
          <p className="text-gray-600">
            You can now log in to access your student dashboard and start your
            journey to mathematical excellence.
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

export default authRedirect(RegisterPage);
