"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import MapPicker from "@/components/ui/MapPicker";
import { ToastContainer, toast, TypeOptions } from "react-toastify";
import { Modal } from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import { db, auth } from "@/app/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

// ─── Validation ──────────────────────────────────────────────────────────────

const schema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  location: yup.string().default(""),
  maxParticipants: yup
    .number()
    .transform((value, original) => (original === "" ? 0 : value))
    .default(0)
    .min(0, "Must be 0 or more"),
  status: yup
    .string()
    .required("Status is required")
    .oneOf(["draft", "open", "in_progress", "completed", "cancelled"]),
  prizeInfo: yup.string().default(""),
});

type FormData = yup.InferType<typeof schema>;

// ─── Page ─────────────-──────────────────────────────────────────────────────

export default function CreateCompetitionPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdCompetitionId, setCreatedCompetitionId] = useState<
    string | null
  >(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      status: "draft",
      maxParticipants: 0,
    },
  });

  const showToast = (type: TypeOptions, text: string) => {
    toast(text, { type, autoClose: 3000 });
  };

  // ─── Submit via Firebase Client SDK ───────────────────────────────────────

  const onSubmit = async (data: FormData) => {
    try {
      const createdBy = auth.currentUser?.uid || "admin";
      const docRef = await addDoc(collection(db, "competitions"), {
        ...data,
        location: isOnline ? "Online" : data.location,
        isOnline,
        maxParticipants: data.maxParticipants || 0,
        createdBy,
        createdAt: serverTimestamp(),
      });
      showToast("success", "Competition created successfully!");
      setCreatedCompetitionId(docRef.id);
      setIsSuccessModalOpen(true);
      reset();
      setSubmitted(true);
    } catch (error) {
      console.error("Error creating competition:", error);
      showToast("error", "Failed to create competition");
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-zinc-50/50 to-white">
      <ToastContainer position="bottom-right" />
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link
                href="/dashboard/admin"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Create Competition
              </h1>
            </div>
            <p className="text-muted-foreground text-sm mt-1 ml-8">
              Set up a new math competition
            </p>
          </div>
        </div>

        {/* ═══════════════════════ CREATE FORM ═══════════════════════ */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-linear-to-r from-primary to-red-700 text-white p-6 sm:p-8">
            <CardTitle className="text-xl sm:text-2xl font-bold text-white">
              Competition Details
            </CardTitle>
            <p className="text-red-100 mt-1 text-sm">
              Fill in the details below to create a new math competition.
            </p>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-2">
              {/* Section 1: Basic Information */}
              <div>
                <div className="flex items-center gap-3 pb-2 border-b border-border mb-5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-medium leading-none">
                      Competition Title *
                    </label>
                    <Input
                      type="text"
                      placeholder='e.g. "OMCC 2026 Preliminary Round"'
                      {...register("title")}
                      disabled={isSubmitting}
                    />
                    <p
                      className="text-sm text-danger min-h-5"
                      style={{
                        visibility: errors.title ? "visible" : "hidden",
                      }}
                    >
                      {errors.title?.message}
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-medium leading-none">
                      Description *
                    </label>
                    <textarea
                      placeholder="Describe the competition, its goals, rules, and any relevant details..."
                      {...register("description")}
                      disabled={isSubmitting}
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                    <p
                      className="text-sm text-danger min-h-5"
                      style={{
                        visibility: errors.description ? "visible" : "hidden",
                      }}
                    >
                      {errors.description?.message}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium leading-none">
                      Status *
                    </label>
                    <select
                      {...register("status")}
                      disabled={isSubmitting}
                      className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <p
                      className="text-sm text-danger min-h-5"
                      style={{
                        visibility: errors.status ? "visible" : "hidden",
                      }}
                    >
                      {errors.status?.message}
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Location
                    </label>

                    {/* Online / Physical toggle */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsOnline(false);
                          setValue("location", "", { shouldDirty: true });
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${
                          !isOnline
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-input"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Physical Location
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOnline(true);
                          setValue("location", "Online", { shouldDirty: true });
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${
                          isOnline
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-input"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        Online
                      </button>
                    </div>

                    {/* Show map only for physical location */}
                    {!isOnline ? (
                      <MapPicker
                        value={watch("location") || ""}
                        onChange={(link) =>
                          setValue("location", link, { shouldDirty: true })
                        }
                        disabled={isSubmitting}
                      />
                    ) : (
                      <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                        <svg
                          className="w-5 h-5 text-blue-600 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        <p className="text-sm text-blue-700 font-medium">
                          This competition will be held online. No physical
                          location needed.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Additional Details */}
              <div>
                <div className="flex items-center gap-3 pb-2 border-b border-border mb-5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Additional Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-sm font-medium leading-none">
                      Max Participants{" "}
                      <span className="text-muted-foreground font-normal">
                        (0 = unlimited)
                      </span>
                    </label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      {...register("maxParticipants")}
                      disabled={isSubmitting}
                    />
                    <p
                      className="text-sm text-danger min-h-5"
                      style={{
                        visibility: errors.maxParticipants
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      {errors.maxParticipants?.message}
                    </p>
                  </div>

                  {<div className="space-y-1 hidden">
                    <label className="text-sm font-medium leading-none">
                      Prize Information{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </label>
                    <Input
                      type="text"
                      placeholder='e.g. "₤50,000 total prizes"'
                      {...register("prizeInfo")}
                      disabled={isSubmitting}
                    />
                  </div>}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 text-base font-semibold gap-2"
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
                      Creating...
                    </span>
                  ) : (
                    <>
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create Competition
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => reset()}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Success Modal */}
        <Modal
          isOpen={isSuccessModalOpen}
          onClose={() => {
            setIsSuccessModalOpen(false);
            router.push("/dashboard/admin");
          }}
          title="Competition Created!"
        >
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-center text-gray-600">
                The competition has been successfully created and saved to the
                database.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setCreatedCompetitionId(null);
                  setSubmitted(false);
                  setIsOnline(false);
                }}
                className="w-full sm:w-auto"
              >
                Create Another
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  if (createdCompetitionId) {
                    router.push(
                      `/dashboard/admin/competitions/${createdCompetitionId}`,
                    );
                  } else {
                    router.push("/dashboard/admin");
                  }
                }}
                className="w-full sm:w-auto"
              >
                View / Edit Competition
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
