"use server";

import { db } from "@/app/firebase-admin";
import { Competition } from "@/types/competition";
import { Mark, Registration } from "@/types/registration";

// ─── Fetch all registrations ────────────────────────────────────────────────

export async function getRegistrations(filters?: {
  governorate?: string;
  markedStatus?: "all" | "marked" | "unmarked";
  searchQuery?: string;
  competitionId?: string;
}): Promise<{
  success: boolean;
  data: Registration[];
  error?: string;
}> {
  try {
    let query: FirebaseFirestore.Query = db.collection("registrations");

    if (filters?.governorate && filters.governorate !== "all") {
      query = query.where("governorate", "==", filters.governorate);
    }

    if (filters?.competitionId) {
      query = query.where("competitionId", "==", filters.competitionId);
    }

    if (filters?.markedStatus === "marked") {
      query = query.where("marked", "==", true);
    } else if (filters?.markedStatus === "unmarked") {
      query = query.where("marked", "==", false);
    }

    const snapshot = await query.get();
    let registrations: Registration[] = snapshot.docs.map((doc) => ({
      ...(doc.data() as Registration),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? "",
    }));

    // Client-side substring search (Firestore doesn't support it natively)
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      registrations = registrations.filter(
        (r: Registration) =>
          r.nationalId?.toLowerCase().includes(q) ||
          r.governorate?.toLowerCase().includes(q),
      );
    }

    return { success: true, data: registrations };
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return { success: false, error: "Failed to fetch registrations", data: [] };
  }
}

// ─── Fetch all marks ────────────────────────────────────────────────────────

export async function getMarks(competitionId?: string): Promise<{
  success: boolean;
  data: Mark[];
  error?: string;
}> {
  try {
    let query = db.collection("marks");

    // If competitionId is provided, we need to find registrations for that competition first
    // Or we could join them if we had a better schema, but for now let's filter after fetching or
    // fetch registrations first.
    // Actually, searching marks by registrationIds is better.

    let marksSnapshot;
    if (competitionId) {
      const regSnap = await db
        .collection("registrations")
        .where("competitionId", "==", competitionId)
        .get();
      const regIds = regSnap.docs.map((d) => d.id);

      if (regIds.length === 0) return { success: true, data: [] };

      // Firestore 'in' query limit is 30. If more, we'd need to chunk.
      // For now let's hope it's not huge for a simple dashboard or fetch all and filter client side.
      // Let's fetch all marks and filter by registrationId for simplicity in this server action.
      marksSnapshot = await db.collection("marks").get();
      const marks = marksSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((m: any) => regIds.includes(m.registrationId))
        .map((m: any) => ({
          ...m,
          markedAt: m.markedAt?.toDate?.()?.toISOString() ?? "",
        }));
      return { success: true, data: marks };
    }

    marksSnapshot = await db.collection("marks").get();
    const marks = marksSnapshot.docs.map((doc) => ({
      ...(doc.data() as Mark),
      id: doc.id,
      markedAt: doc.data().markedAt?.toDate?.()?.toISOString() ?? "",
    }));
    return { success: true, data: marks };
  } catch (error) {
    console.error("Error fetching marks:", error);
    return { success: false, error: "Failed to fetch marks", data: [] };
  }
}

// ─── Dashboard stats ────────────────────────────────────────────────────────

export async function getDashboardStats(competitionId?: string): Promise<{
  success: boolean;
  data: { total: number; marked: number; unmarked: number; avgScore: number };
  error?: string;
}> {
  try {
    let regQuery = db.collection("registrations");
    if (competitionId) {
      regQuery = regQuery.where("competitionId", "==", competitionId) as any;
    }

    const regSnap = await regQuery.get();

    const regIds = regSnap.docs.map((d) => d.id);

    let marksSnap;
    if (competitionId) {
      // Fetch all marks and filter (same strategy as getMarks)
      marksSnap = await db.collection("marks").get();
      const filteredMarks = marksSnap.docs.filter((d) =>
        regIds.includes(d.data().registrationId),
      );

      const total = regSnap.size;
      const marked = regSnap.docs.filter(
        (d) => d.data().marked === true,
      ).length;
      const unmarked = total - marked;

      const markValues = filteredMarks.map((d) => d.data().mark as number);
      const avgScore =
        markValues.length > 0
          ? Math.round(
              markValues.reduce((sum, m) => sum + (m || 0), 0) /
                markValues.length,
            )
          : 0;
      return { success: true, data: { total, marked, unmarked, avgScore } };
    }

    const marksSnapFull = await db.collection("marks").get();

    const total = regSnap.size;
    const marked = regSnap.docs.filter((d) => d.data().marked === true).length;
    const unmarked = total - marked;

    const markValues = marksSnapFull.docs.map((d) => d.data().mark as number);
    const avgScore =
      markValues.length > 0
        ? Math.round(
            markValues.reduce((sum, m) => sum + (m || 0), 0) /
              markValues.length,
          )
        : 0;

    return { success: true, data: { total, marked, unmarked, avgScore } };
  } catch (error) {
    console.error("Error getting stats:", error);
    return {
      success: false,
      data: { total: 0, marked: 0, unmarked: 0, avgScore: 0 },
    };
  }
}

// ─── Fetch all competitions ──────────────────────────────────────────────────

export async function getCompetitions(): Promise<{
  success: boolean;
  data: Competition[];
  error?: string;
}> {
  try {
    const snapshot = await db
      .collection("competitions")
      .orderBy("createdAt", "desc")
      .get();
    const competitions: Competition[] = snapshot.docs.map((doc) => ({
      ...(doc.data() as Competition),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? "",
    }));

    return { success: true, data: competitions };
  } catch (error) {
    console.error("Error fetching competitions:", error);
    return { success: false, error: "Failed to fetch competitions", data: [] };
  }
}
