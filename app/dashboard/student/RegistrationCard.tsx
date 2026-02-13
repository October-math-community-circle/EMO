"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Registration } from "@/types/registration";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useRouter } from "next/navigation";

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

// Yup validation schema
const registrationSchema = yup.object({
  governorate: yup
    .string()
    .required("Governorate is required")
    .oneOf(GOVERNORATES, "Please select a valid governorate"),
  nationalId: yup
    .string()
    .required("National ID is required")
    .matches(/^[0-9]{14}$/, "National ID must be exactly 14 digits"),
});

export function RegistrationCard({
  registration,
}: {
  registration: Registration;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<yup.InferType<typeof registrationSchema>>({
    mode: "onTouched",
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      governorate: registration.governorate,
      nationalId: registration.nationalId,
    },
  });
  const onSubmit = async ({
    governorate,
    nationalId,
  }: yup.InferType<typeof registrationSchema>) => {
    setSubmitError("");
    try {
      await updateDoc(doc(db, "registrations", registration.id), {
        governorate,
        nationalId,
      });
      router.refresh();
      setIsModalOpen(false);
    } catch (err) {
      console.log({ submissionError: err });
      setSubmitError("An error occurred. Please try again.");
    }
  };

  const handleOpenModal = () => {
    reset({
      governorate: registration.governorate,
      nationalId: registration.nationalId,
    });
    setSubmitError("");
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">OMCC 2026</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={registration.expired ? "warning" : "success"}>
                {registration.expired ? "Expired" : "Active"}
              </Badge>
              {!registration.expired && (
                <Button variant="outline" size="sm" onClick={handleOpenModal}>
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Governorate</p>
              <p className="font-medium">{registration.governorate}</p>
            </div>
            <div>
              <p className="text-muted-foreground">National ID</p>
              <p className="font-medium font-mono">{registration.nationalId}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Registration ID</p>
              <p className="font-medium font-mono text-xs">{registration.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Mark</p>
              <p className="font-medium">
                {registration.marked ? registration.mark : "Not Marked"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Registration"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Governorate
            </label>
            <select
              {...register("governorate")}
              className={`flex h-11 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.governorate ? "border-red-500" : "border-input"
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select your governorate</option>
              {GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
            {errors.governorate && (
              <p className="text-sm text-red-600">
                {errors.governorate.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              National ID
            </label>
            <Input
              type="text"
              {...register("nationalId")}
              placeholder="Enter your 14-digit National ID"
              maxLength={14}
              disabled={isSubmitting}
              className={errors.nationalId ? "border-red-500" : ""}
            />
            {errors.nationalId && (
              <p className="text-sm text-red-600">
                {errors.nationalId.message}
              </p>
            )}
          </div>

          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {submitError}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
