"use server";

import { auth, db } from "@/app/firebase-admin";
import getUser from "@/lib/utils/getUser";
import { serverActionWrapperRESPONSE } from "@/lib/utils/serverActionWrapper";
import { Student } from "@/types/auth";
import { Competition } from "@/types/competition";
import { Mark, Registration } from "@/types/registration";
import { Timestamp } from "firebase-admin/firestore";

// --- Internal Implementation Functions ---

async function getStudentsInternal(
  userUids: string[],
): Promise<Record<string, Student>> {
  const students = await Promise.all(
    userUids.map((studentUid) => db.collection("users").doc(studentUid).get()),
  );
  const studentsObj: Record<string, Student> = {};
  students.forEach((studentDoc) => {
    if (!studentDoc.exists) return;
    const student = studentDoc.data() as Student;
    studentsObj[studentDoc.id] = {
      ...student,
      id: studentDoc.id,
      createdAt:
        (student.createdAt as Timestamp)?.toDate?.()?.toISOString() ?? "",
      dob: (student.dob as Timestamp)?.toDate?.()?.toISOString() ?? "",
    };
  });
  return studentsObj;
}

async function getRegistrationsInternal(filters?: {
  governorate?: string;
  markedStatus?: "all" | "marked" | "unmarked";
  searchQuery?: string;
  competitionId?: string;
}): Promise<Registration[]> {
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
  let registrations = snapshot.docs.map((doc) => {
    const regData = doc.data() as Registration;
    return {
      ...regData,
      id: doc.id,
      createdAt:
        (regData.createdAt as Timestamp)?.toDate()?.toISOString() ?? "",
    };
  });

  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    registrations = registrations.filter(
      (r) =>
        r.nationalId?.toLowerCase().includes(q) ||
        r.governorate?.toLowerCase().includes(q),
    );
  }
  return registrations;
}

async function getMarksInternal(competitionId?: string): Promise<Mark[]> {
  let query = db.collection("marks");
  if (competitionId) {
    query = query.where("competitionId", "==", competitionId) as any;
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => {
    const markData = doc.data() as Mark;
    return {
      ...markData,
      id: doc.id,
      markedAt:
        (markData.markedAt as Timestamp)?.toDate?.()?.toISOString() ?? "",
    };
  });
}
async function getDashboardStatsInternal(competitionId?: string) {
  let regQuery = db.collection("registrations");
  if (competitionId) {
    regQuery = regQuery.where("competitionId", "==", competitionId) as any;
  }

  const regSnap = await regQuery.get();
  // Reuse your other internal marks fetcher
  const marks = await getMarksInternal(competitionId);

  // If we have a competitionId, we filter marks by registrationId

  const total = regSnap.size;
  const marked = regSnap.docs.filter((d) => d.data().marked === true).length;
  const unmarked = total - marked;

  const markValues = marks.map(({ mark }) => Number(mark) || 0);
  const avgScore =
    markValues.length > 0
      ? Math.round(
          markValues.reduce((sum, m) => sum + m, 0) / markValues.length,
        )
      : 0;

  return { total, marked, unmarked, avgScore };
}

async function getCompetitionsInternal(): Promise<Competition[]> {
  const snapshot = await db.collection("competitions").get();

  return snapshot.docs
    .toSorted((a, b) => b.createTime.toMillis() - a.createTime.toMillis())
    .map((doc) => {
      const compData = doc.data() as Competition;
      return {
        ...compData,
        id: doc.id,
        startDate:
          (compData.startDate as Timestamp)?.toDate?.()?.toISOString() ?? "",
        endDate:
          (compData.endDate as Timestamp)?.toDate?.()?.toISOString() ?? "",
        createdAt:
          (compData.createdAt as Timestamp)?.toDate?.()?.toISOString() ?? "",
      };
    }); // Simple descending sort
}

export async function createAdminUser(email: string, password: string) {
  const currUser = await getUser();
  if (currUser?.role !== "admin") {
    throw new Error("You are not authorized to perform this action");
  }
  const userRecord = await auth.createUser({
    email,
    password,
  });
  await auth.setCustomUserClaims(userRecord.uid, { role: "admin" });
  return null;
}
// --- Wrapped Exports ---
export const createAdmin = serverActionWrapperRESPONSE(
  createAdminUser,
  null,
  "Failed to create admin",
);
export const getStudents = serverActionWrapperRESPONSE(
  getStudentsInternal,
  {},
  "Failed to fetch students",
);

export const getRegistrations = serverActionWrapperRESPONSE(
  getRegistrationsInternal,
  [],
  "Failed to fetch registrations",
);

export const getMarks = serverActionWrapperRESPONSE(
  getMarksInternal,
  [],
  "Failed to fetch marks",
);
export const getDashboardStats = serverActionWrapperRESPONSE(
  getDashboardStatsInternal,
  { total: 0, marked: 0, unmarked: 0, avgScore: 0 },
  "Failed to load dashboard stats",
);

export const getCompetitions = serverActionWrapperRESPONSE(
  getCompetitionsInternal,
  [],
  "Failed to load competitions",
);

// Note: Repeat this pattern for getDashboardStats and getCompetitions
