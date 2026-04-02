"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import MapPicker from "@/components/ui/MapPicker";
import { ToastContainer, toast, TypeOptions } from "react-toastify";
import { db } from "@/app/firebase";
import {
  doc,
  updateDoc,
  Timestamp,
  addDoc,
  collection,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import {
  Competition,
  Problem,
} from "@october-math-community-circle/shared-utitilies/competition";
import { Modal } from "@/components/ui/Modal";

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "closed", label: "Closed" },
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
    .oneOf([
      "draft",
      "open",
      "in_progress",
      "completed",
      "cancelled",
      "closed",
    ]),
  startDate: yup.string().required("Start Date is required"),
  duration: yup
    .number()
    .typeError("Duration must be a number")
    .required("Duration is required")
    .min(1, "Duration must be at least 1 hour"),
  prizeInfo: yup.string().default(""),
  problems: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required("Problem title is required"),
        answer: yup
          .number()
          .transform((value, original) => (original === "" ? undefined : value))
          .required("Answer is required")
          .typeError("Answer must be a number"),
        id: yup.string().optional(),
      }),
    )
    .default([])
    .min(1, "At least one problem is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function EditCompetitionForm({
  id,
  initialData,
  initialProblems,
  // pdfURL,
}: {
  id: string;
  initialData: Competition;
  initialProblems: Problem[];
  // pdfURL: string;
}) {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(initialData.location === "Online");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      location:
        initialData.location === "Online" ? "" : initialData.location || "",
      maxParticipants: initialData.maxParticipants || 0,
      status: initialData.status || "draft",
      startDate: initialData.startDate
        ? new Date(initialData.startDate as string)
            .toLocaleString("sv-SE", { hour12: false })
            .replace(" ", "T")
            .slice(0, 16)
        : "",
      duration:
        initialData.startDate && initialData.endDate
          ? Math.round(
              ((new Date(initialData.endDate as string).getTime() -
                new Date(initialData.startDate as string).getTime()) /
                (60 * 60 * 1000)) *
                100,
            ) / 100
          : undefined,
      problems: initialProblems,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "problems" as never,
  });

  const showToast = (type: TypeOptions, text: string) => {
    toast(text, { type, autoClose: 3000 });
  };

  // ─── Submit Update ────────────────────────────────────────────────────────

  const onSubmit = async (data: FormData) => {
    try {
      const docRef = doc(db, "competitions", id);

      // Parse startDate as Egyptian Time (UTC+2) explicitly
      const start = new Date(`${data.startDate}+02:00`);
      // Compute endDate in milliseconds (duration is in hours)
      const end = new Date(start.getTime() + data.duration * 60 * 60 * 1000);
      const batch = writeBatch(db);
      const problemsMap: Record<string, string> = {};
      await Promise.all(
        data.problems
          .map((problem) => {
            if (
              problem?.id &&
              initialProblems.find((p) => p.id === problem.id) !== undefined
            ) {
              problemsMap[problem.id] = problem.title;
              batch.update(doc(db, "problems", problem.id), {
                title: problem.title,
                answer: Number(problem.answer),
                competitionId: id,
              });
              return null;
            } else {
              const newProblemDoc = doc(collection(db, "problems"));
              problemsMap[newProblemDoc.id] = problem.title;
              return setDoc(newProblemDoc, {
                title: problem.title,
                answer: Number(problem.answer),
                competitionId: id,
              });
            }
          })
          .filter((p) => p !== null),
      );
      initialProblems.forEach((problem) => {
        if (data.problems.find((p) => p?.id === problem.id) == undefined) {
          batch.delete(doc(db, "problems", problem.id as string));
        }
      });
      await batch.commit();
      await updateDoc(docRef, {
        ...data,
        startDate: Timestamp.fromDate(start),
        endDate: Timestamp.fromDate(end),
        location: isOnline ? "Online" : data.location,
        maxParticipants: data.maxParticipants || 0,
        problems: problemsMap,
      });
      showToast("success", "Competition updated successfully!");
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error updating competition:", error);
      showToast("error", "Failed to update competition");
    }
  };

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
                Edit Competition
              </h1>
            </div>
            <p className="text-muted-foreground text-sm mt-1 ml-8">
              Update existing competition details
            </p>
          </div>
        </div>

        {/* ═══════════════════════ EDIT FORM ═══════════════════════ */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-linear-to-r from-primary to-red-700 text-white p-6 sm:p-8">
            <CardTitle className="text-xl sm:text-2xl font-bold text-white">
              Competition Details
            </CardTitle>
            <p className="text-red-100 mt-1 text-sm">
              Modify the fields below to update the competition.
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
                      placeholder='e.g. "EGSO 2026 Preliminary Round"'
                      {...register("title")}
                      disabled={isSubmitting}
                      error={errors.title?.message}
                    />
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

                  <div className="space-y-1">
                    <label className="text-sm font-medium leading-none">
                      Start Date (Egyptian Time) *
                    </label>
                    <Input
                      type="datetime-local"
                      {...register("startDate")}
                      disabled={isSubmitting}
                      error={errors.startDate?.message}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium leading-none">
                      Duration (in hours) *
                    </label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 2"
                      {...register("duration")}
                      disabled={isSubmitting}
                      error={errors.duration?.message}
                    />
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
                      error={errors.maxParticipants?.message}
                    />
                  </div>

                  <div className="space-y-1">
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
                  </div>
                </div>
              </div>
              {/* Section 4: Problems */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-border mb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      4
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Problems
                    </h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ title: "", answer: 0 })}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Problem
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-4 bg-zinc-50 rounded-lg border border-dashed">
                      No problems added yet. Click &quot;Add Problem&quot; to
                      start.
                    </p>
                  )}
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 bg-zinc-50 rounded-lg border relative group"
                    >
                      <div className="absolute top-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700 bg-white/80 p-1.5 rounded-md"
                          title="Remove Problem"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                      <h4 className="font-medium text-sm mb-3">
                        Problem {index + 1}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-medium leading-none">
                            Title *
                          </label>
                          <Input
                            type="text"
                            placeholder="e.g. Find the value of x"
                            {...register(`problems.${index}.title` as const)}
                            disabled={isSubmitting}
                            error={errors.problems?.[index]?.title?.message}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium leading-none">
                            Answer (Number) *
                          </label>
                          <Input
                            type="number"
                            step="any"
                            placeholder="e.g. 42"
                            {...register(`problems.${index}.answer` as const)}
                            disabled={isSubmitting}
                            error={errors.problems?.[index]?.answer?.message}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
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
                      Saving Changes...
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
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/dashboard/admin")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push("/dashboard/admin");
        }}
        title="Competition Updated!"
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
              The competition has been successfully updated and saved.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full"
            >
              Continue Editing
            </Button>
            <Link href={"/dashboard/admin"} prefetch>
              <Button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full"
              >
                Go to Competitions List
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
