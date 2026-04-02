"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { ref as storageRef, uploadBytesResumable } from "firebase/storage";
import { Problem } from "@october-math-community-circle/shared-utitilies/competition";
import { storage } from "@/app/firebase";

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
    .oneOf(STATUSES.map((s) => s.value)),
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
      }),
    )
    .default([])
    .min(1, "At least one problem is required"),
  pdfFile: yup
    .mixed()
    .required("PDF file is required")
    .test("file-type", "File must be a PDF", (value) => {
      if (!value) return false;
      return (value as File).type === "application/pdf";
    }),
});

type FormData = yup.InferType<typeof schema>;

// ─── Page ─────────────-──────────────────────────────────────────────────────

export default function CreateCompetitionPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdCompetitionId, setCreatedCompetitionId] = useState<
    string | null
  >(null);
  // const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting, isValid },
    getValues,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      status: "draft",
      maxParticipants: 0,
      problems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "problems" as never,
  });

  const showToast = (type: TypeOptions, text: string) => {
    toast(text, { type, autoClose: 3000 });
  };

  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setValue("pdfFile", file);
      setPdfPreviewUrl(URL.createObjectURL(file));
    } else if (file) {
      showToast("error", "Please upload a valid PDF file.");
      e.target.value = ""; // reset input
    } else {
      reset({ ...getValues(), pdfFile: undefined });
      setPdfPreviewUrl(null);
    }
  };

  // ─── Submit via Firebase Client SDK ───────────────────────────────────────

  const onSubmit = async (data: FormData) => {
    try {
      const createdBy = auth.currentUser?.uid || "admin";

      // Parse startDate as Egyptian Time (UTC+2) explicitly
      const start = new Date(`${data.startDate}+02:00`);
      // Compute endDate in milliseconds (duration is in hours)
      const end = new Date(start.getTime() + data.duration * 60 * 60 * 1000);
      const competitionDocRef = doc(collection(db, "competitions"));
      const problemDocs = await Promise.all(
        data.problems.map((problem) =>
          addDoc(collection(db, "problems"), {
            ...problem,
            answer: Number(problem.answer),
            competitionId: competitionDocRef.id,
          }),
        ),
      );
      const problemsMap: Record<string, string> = {};
      problemDocs.forEach((problemDoc, id) => {
        problemsMap[problemDoc.id] = data.problems[id].title;
      });
      await uploadBytesResumable(
        storageRef(storage, `problems/${competitionDocRef.id}.pdf`),
        data.pdfFile as File,
      );
      const { pdfFile, ...compData } = data;
      await setDoc(competitionDocRef, {
        ...compData,
        startDate: Timestamp.fromDate(start),
        endDate: Timestamp.fromDate(end),
        location: isOnline ? "Online" : data.location,
        maxParticipants: data.maxParticipants || 0,
        createdBy,
        createdAt: serverTimestamp(),
        problems: problemsMap,
        problemSheetRef: `problems/${competitionDocRef.id}.pdf`,
      });
      showToast("success", "Competition created successfully!");
      setCreatedCompetitionId(competitionDocRef.id);
      setIsSuccessModalOpen(true);
      reset();
      setPdfPreviewUrl(null);
    } catch (error) {
      console.error("Error creating competition:", error);
      showToast("error", "Failed to create competition");
    }
  };
  const dashboardLinkRef = useRef<HTMLAnchorElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-zinc-50/50 to-white">
      <ToastContainer position="bottom-right" />
      <div
        className={`container mx-auto px-4 py-6 sm:py-8 transition-all duration-300 ${pdfPreviewUrl ? "max-w-7xl" : "max-w-4xl"}`}
      >
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

        {/* ═══════════════════════ CREATE FORM & PREVIEW ═══════════════════════ */}
        <div
          className={`grid grid-cols-1 ${pdfPreviewUrl ? "lg:grid-cols-2" : ""} gap-6 items-start`}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary text-white p-6 sm:p-8">
              <CardTitle className="text-xl sm:text-2xl font-bold text-white">
                Competition Details
              </CardTitle>
              <p className="text-red-100 mt-1 text-sm">
                Fill in the details below to create a new math competition.
              </p>
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8 mt-2"
              >
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
                            setValue("location", "Online", {
                              shouldDirty: true,
                            });
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
                    <div className="space-y-1 hidden">
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
                        error={errors.prizeInfo?.message}
                      />
                    </div>
                  </div>

                  {/* PDF Input Section */}
                  <div className="mt-8">
                    <div className="flex items-center gap-3 pb-2 border-b border-border mb-5">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        3
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Competition Document
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <p className="cursor-pointer text-sm font-medium leading-none">
                        Upload PDF{" "}
                        <span className="text-muted-foreground font-normal">
                          (Client-side only)
                        </span>
                      </p>
                      <Input
                        className="cursor-pointer"
                        type="file"
                        accept="application/pdf"
                        {...register("pdfFile")}
                        onChange={handlePdfUpload}
                        disabled={isSubmitting}
                        ref={pdfInputRef}
                        error={errors.pdfFile?.message}
                      />
                      <Button
                        onClick={() => {
                          setPdfPreviewUrl(null);
                          reset({ ...getValues(), pdfFile: undefined });
                          (pdfInputRef.current as HTMLInputElement).value = "";
                        }}
                        hidden={!pdfPreviewUrl}
                        variant="secondary"
                        disabled={isSubmitting}
                      >
                        Cancel File
                      </Button>
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
                    onClick={() => {
                      reset();
                      setPdfPreviewUrl(null);
                    }}
                    disabled={isSubmitting}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* PDF Previewer */}
          {pdfPreviewUrl && (
            <Card className="overflow-hidden flex flex-col h-[calc(100vh-8rem)] sticky top-29">
              <CardHeader className="bg-primary p-4 border-b flex-none">
                <CardTitle className="text-lg text-white font-bold">
                  PDF Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0! flex-1">
                <iframe
                  src={pdfPreviewUrl}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Success Modal */}
        <Modal
          isOpen={isSuccessModalOpen}
          onClose={() => {
            setIsSuccessModalOpen(false);
            dashboardLinkRef.current?.click();
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
                    dashboardLinkRef.current?.click();
                  }
                }}
                className="w-full sm:w-auto"
              >
                View / Edit Competition
              </Button>
              <Link
                ref={dashboardLinkRef}
                prefetch
                hidden
                href={"/dashboard/admin"}
              ></Link>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
