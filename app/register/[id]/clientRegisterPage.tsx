"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import * as yup from "yup";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useUser } from "../../hooks/useUser";
import { db } from "../../firebase";
import { useParams } from "next/navigation";

const GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbiya",
  "Ismailia",
  "Menofia",
  "Minya",
  "Qaliubiya",
  "New Valley",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "Sharkia",
  "South Sinai",
  "Kafr El Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "North Sinai",
  "Sohag",
];

const schema = yup.object({
  governorate: yup.string().required("Governorate is required"),
  nationalId: yup
    .string()
    .required("National ID is required")
    .matches(/^[0-9]{14}$/, "National ID must be exactly 14 digits"),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], "You must agree to the terms and conditions")
    .required(),
  grade: yup
    .number()
    .oneOf([10, 11], "You must be in grade 10 or 11 to participate")
    .required("grade is required"),
});

type FormData = yup.InferType<typeof schema>;

export function CompetitionRegisterPage({
  params,
  competitionTitle,
}: {
  params: {
    id: string;
  };
  competitionTitle: string;
}) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [RegistrationId, setRegistrationId] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: { agreeToTerms: false },
  });
  const user = useUser();

  const onSubmit = async ({
    governorate,
    nationalId,
    grade,
  }: yup.InferType<typeof schema>) => {
    try {
      const docInfo = await addDoc(collection(db, "registrations"), {
        governorate,
        nationalId,
        uid: user?.uid,
        competitionId: params.id,
        expired: false,
        createdAt: serverTimestamp(),
        marked: false,
        grade,
      });
      setRegistrationId(docInfo.id);
      setShowSuccess(true);
    } catch (error) {
      console.error({ registerationError: error });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-red-50/30 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-red-100 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Registration Open
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4 tracking-tight">
          {competitionTitle}
          <span className="block text-primary">Competition Registration</span>
        </h1>
      </div>

      {/* Registration Form */}
      <Card className="max-w-4xl mx-auto overflow-hidden">
        <CardHeader className="bg-linear-to-r from-primary to-red-700 text-white p-8">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
            Participant Information
          </CardTitle>
          <p className="text-red-100 mt-2">
            Please fill in all required fields accurately. Make sure your
            information matches your official documents.
          </p>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Personal Information Section */}
            <div>
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  1
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Personal Information
                </h3>
              </div>

              <>
                <div className="space-y-1 mt-4">
                  <label className="text-sm font-medium leading-none">
                    Governorate
                  </label>
                  <select
                    {...register("governorate")}
                    className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <option value="">Select your governorate</option>
                    {GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                  <p
                    className="text-sm text-danger min-h-5"
                    style={{
                      visibility: errors.governorate ? "visible" : "hidden",
                    }}
                  >
                    {errors.governorate?.message}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium leading-none">
                    National ID
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your 14-digit National ID"
                    {...register("nationalId")}
                    disabled={isSubmitting}
                    maxLength={14}
                  />
                  <p
                    className="text-sm text-danger min-h-5"
                    style={{
                      visibility: errors.nationalId ? "visible" : "hidden",
                    }}
                  >
                    {errors.nationalId?.message}
                  </p>
                </div>
              </>
              <div className="space-y-1">
                <label className="text-sm font-medium leading-none">
                  Grade
                </label>
                <select
                  {...register("grade")}
                  className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <option value="">Select your grade</option>
                  <option value={10}>{10}</option>
                  <option value={11}>{11}</option>
                </select>
                <p
                  className="text-sm text-danger min-h-5"
                  style={{
                    visibility: errors.grade ? "visible" : "hidden",
                  }}
                >
                  {errors.grade?.message}
                </p>
              </div>
            </div>
            {/* Additional Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  2
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Additional Information
                </h3>
              </div>

              <div className="space-y-4 mt-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("agreeToTerms")}
                    className="w-5 h-5 rounded border-input text-primary focus:ring-primary cursor-pointer mt-0.5"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-primary underline hover:no-underline"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    . I confirm that all information provided is accurate.
                  </span>
                </label>
                <p
                  className="text-sm text-danger"
                  style={{
                    visibility: errors.agreeToTerms ? "visible" : "hidden",
                  }}
                >
                  {errors.agreeToTerms?.message}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full text-base font-semibold"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
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
                    Processing Registration...
                  </span>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Registration Successful! 🎉"
      >
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-600 mb-1">Your Registration ID</p>
            <p className="text-xl md:text-2xl font-bold text-green-700 font-mono">
              {RegistrationId}
            </p>
          </div>

          <p className="text-gray-600">
            Thank you for registering for the{" "}
            <strong>{competitionTitle}</strong>!
          </p>
          <div className="flex gap-2 flex-col">
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                onClick={() => setShowSuccess(false)}
                className="w-full"
                size="lg"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
