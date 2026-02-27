"use server";

import { db } from "@/app/firebase-admin";
import type { CompetitionStatus } from "@/types/competition";
import { FieldValue } from "firebase-admin/firestore";

// ─── Create a new competition ────────────────────────────────────────────────

export async function createCompetition(data: {
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  location?: string;
  maxParticipants?: number;
  status: string;
  prizeInfo?: string;
  createdBy: string;
}) {
  try {
    const docRef = await db.collection("competitions").add({
      ...data,
      maxParticipants: data.maxParticipants || 0,
      createdAt: FieldValue.serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating competition:", error);
    return { success: false, error: "Failed to create competition" };
  }
}

// ─── Fetch all competitions ──────────────────────────────────────────────────

export async function getCompetitions() {
  try {
    const snapshot = await db
      .collection("competitions")
      .orderBy("createdAt", "desc")
      .get();

    const competitions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? "",
    }));

    return { success: true, data: competitions };
  } catch (error) {
    console.error("Error fetching competitions:", error);
    return { success: false, error: "Failed to fetch competitions", data: [] };
  }
}

// ─── Update competition status ───────────────────────────────────────────────

export async function updateCompetitionStatus(
  id: string,
  status: CompetitionStatus,
) {
  try {
    await db.collection("competitions").doc(id).update({ status });
    return { success: true };
  } catch (error) {
    console.error("Error updating competition status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
