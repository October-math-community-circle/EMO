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
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useUser } from "../hooks/useUser";
import { db } from "../firebase";
import { Registration } from "@/types/registration";

// Competition categories
const COMPETITION_CATEGORIES = [
  { id: "junior", label: "Junior (Grade 7-9)", ageRange: "12-15 years" },
  { id: "senior", label: "Senior (Grade 10-12)", ageRange: "15-18 years" },
  { id: "open", label: "Open Category", ageRange: "Any age" },
];

// Egyptian Governorates
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

// Validation schema
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
});

type FormData = yup.InferType<typeof schema>;

export default function CompetitionRegisterPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [RegistrationId, setRegistrationId] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      agreeToTerms: false,
    },
  });
  const user = useUser();
  const onSubmit = async ({
    governorate,
    nationalId,
  }: yup.InferType<typeof schema>) => {
    try {
      const doc = await addDoc(collection(db, "registrations"), {
        governorate,
        nationalId,
        uid: user?.uid,
        expired: false,
        createdAt: serverTimestamp(),
        mark: 0,
        marked: false,
      });
      setRegistrationId(doc.id);
      setShowSuccess(true);
    } catch (error) {
      console.error({ registerationError: error });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-red-100 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Registration Open for OMCC 2026
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4 tracking-tight">
          Egyptian Math Olympiad
          <span className="block text-primary">Competition Registration</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of young mathematicians across Egypt and showcase your
          problem-solving skills. Register now to participate in the prestigious
          October Math Community Circle competition.
        </p>
      </div>

      {/* Stats Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "5000+", label: "Participants" },
            { value: "27", label: "Governorates" },
            { value: "500+", label: "Schools" },
            { value: "₤50K", label: "In Prizes" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-border p-4 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Form */}
      <Card className="max-w-4xl mx-auto overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-red-700 text-white p-8">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
            Participant Information
          </CardTitle>
          <p className="text-red-100 mt-2">
            Please fill in all required fields accurately. Make sure your
            information matches your official documents.
          </p>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-4">
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
                <div className="space-y-1">
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

              <div className="space-y-4">
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

      {/* Important Dates Section */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-center text-foreground mb-6">
          Important Dates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              date: "Feb 1 - Mar 15",
              title: "Registration Period",
              desc: "Online registration open",
              icon: "📝",
              active: true,
            },
            {
              date: "April 5, 2026",
              title: "Preliminary Round",
              desc: "Online elimination round",
              icon: "💻",
              active: false,
            },
            {
              date: "May 15, 2026",
              title: "Final Competition",
              desc: "On-site at Cairo University",
              icon: "🏆",
              active: false,
            },
          ].map((event) => (
            <div
              key={event.title}
              className={`relative p-5 rounded-xl border-2 transition-all ${
                event.active
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border bg-white hover:shadow-md"
              }`}
            >
              {event.active && (
                <div className="absolute -top-3 left-4 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
                  Current
                </div>
              )}
              <div className="text-3xl mb-3">{event.icon}</div>
              <div
                className={`text-sm font-medium ${
                  event.active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {event.date}
              </div>
              <div className="text-lg font-semibold text-foreground mt-1">
                {event.title}
              </div>
              <div className="text-sm text-muted-foreground">{event.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Registration Successful! 🎉"
      >
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-600 mb-1">Your Registration ID</p>
            <p className="text-2xl font-bold text-green-700 font-mono">
              {RegistrationId}
            </p>
          </div>

          <p className="text-gray-600">
            Thank you for registering for the{" "}
            <strong>Egyptian Math Olympiad 2026</strong>! We have sent a
            confirmation email with your registration details.
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
