"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import {
  getRegistrations,
  getMarks,
  getDashboardStats,
} from "@/app/server-actions/adminActions";
import Link from "next/link";
import { db } from "@/app/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "@/app/firebase";
import type { Registration, Mark } from "@/types/registration";
import { ToastContainer, toast, TypeOptions } from "react-toastify";
import { Competition } from "@/types/competition";

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

type Tab = "registrations" | "marks";
type SortDir = "asc" | "desc";

interface Stats {
  total: number;
  marked: number;
  unmarked: number;
  avgScore: number;
}

interface RegistrationWithMark extends Registration {
  markValue?: number;
  markedBy?: string;
  markedAt?: string;
}

export default function CompetitionDashboard({
  competitionId,
  initialData,
}: {
  competitionId: string;
  initialData: {
    registrations: Registration[];
    marks: Mark[];
    stats: Stats;
    competition: Competition;
  };
}) {
  const [activeTab, setActiveTab] = useState<Tab>("registrations");
  const [registrations, setRegistrations] = useState<Registration[]>(
    initialData.registrations,
  );
  const [marks, setMarks] = useState<Mark[]>(initialData.marks);
  const [competition, setCompetition] = useState<Competition>(
    initialData.competition,
  );
  const [stats, setStats] = useState<Stats>({
    total: 0,
    marked: 0,
    unmarked: 0,
    avgScore: 0,
  });
  const [loading, setLoading] = useState(false);

  // Filters
  const [govFilter, setGovFilter] = useState("all");
  const [markedFilter, setMarkedFilter] = useState<
    "all" | "marked" | "unmarked"
  >("all");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  // Sort (marks tab)
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMark, setEditingMark] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const showToast = (type: TypeOptions, text: string) => {
    toast(text, { type, autoClose: 3000 });
  };

  const fetchData = useCallback(async () => {
    if (!competitionId) return;
    setLoading(true);
    try {
      const [regRes, marksRes, statsRes, compDoc] = await Promise.all([
        getRegistrations({
          governorate: govFilter,
          markedStatus: markedFilter,
          searchQuery: appliedSearch,
          competitionId: competitionId,
        }),
        getMarks(competitionId),
        getDashboardStats(competitionId),
        getDoc(doc(db, "competitions", competitionId)),
      ]);

      if (regRes.success) setRegistrations(regRes.data as Registration[]);
      if (marksRes.success) setMarks(marksRes.data as Mark[]);
      if (statsRes.success) setStats(statsRes.data);
      if (compDoc.exists())
        setCompetition({ id: compDoc.id, ...(compDoc.data() as Competition) });
    } catch (error) {
      console.error("Error fetching competition dashboard data:", error);
      showToast("error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [competitionId, govFilter, markedFilter, appliedSearch]);

  const handleSaveMark = async (registrationId: string) => {
    const val = Number(editingMark);
    if (isNaN(val) || val < 0 || val > 100) {
      showToast("error", "Mark must be between 0 and 100");
      return;
    }
    setSavingId(registrationId);
    try {
      const adminUid = auth.currentUser?.uid || "admin";

      const marksQuery = query(
        collection(db, "marks"),
        where("registrationId", "==", registrationId),
        limit(1),
      );
      const existing = await getDocs(marksQuery);

      if (existing.empty) {
        await addDoc(collection(db, "marks"), {
          registrationId,
          mark: val,
          markedAt: serverTimestamp(),
          markedBy: adminUid,
        });
        await updateDoc(doc(db, "registrations", registrationId), {
          marked: true,
        });
        showToast("success", "Mark saved!");
      } else {
        await updateDoc(doc(db, "marks", existing.docs[0].id), {
          mark: val,
          markedAt: serverTimestamp(),
          markedBy: adminUid,
        });
        showToast("success", "Mark updated!");
      }

      setEditingId(null);
      setEditingMark("");
      await fetchData();
    } catch (error) {
      console.error("Error saving mark:", error);
      showToast("error", "Failed to save mark");
    }
    setSavingId(null);
  };

  const marksMap = new Map(marks.map((m) => [m.registrationId, m]));
  const joinedData: RegistrationWithMark[] = registrations.map((r) => {
    const m = marksMap.get(r.id);
    return {
      ...r,
      markValue: m?.mark,
      markedBy: typeof m?.markedBy === "string" ? m.markedBy : undefined,
      markedAt: typeof m?.markedAt === "string" ? m.markedAt : undefined,
    };
  });

  const sortedJoined = [...joinedData].sort((a, b) => {
    const aVal = a.markValue ?? -1;
    const bVal = b.markValue ?? -1;
    return sortDir === "desc" ? bVal - aVal : aVal - bVal;
  });

  const statCards = [
    {
      label: "Total Students",
      value: stats.total,
      icon: "👥",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Marked",
      value: stats.marked,
      icon: "✅",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Unmarked",
      value: stats.unmarked,
      icon: "⏳",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Avg Score",
      value: stats.avgScore,
      icon: "📊",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-zinc-50/50 to-white">
      <ToastContainer position="bottom-right" />
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin"
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
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
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {competition?.title || "Competition Dashboard"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage registrations and marks for this competition
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link href={`/dashboard/admin/competitions/${competitionId}/edit`}>
              <Button variant="outline" className="gap-2">
                Edit Competition
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          {statCards.map((s) => (
            <Card key={s.label} className="hover:shadow-md transition-shadow">
              <CardContent className="!p-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-lg`}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs sm:text-sm font-medium">
                      {s.label}
                    </div>
                    <div
                      className={`text-2xl sm:text-3xl font-bold ${s.color}`}
                    >
                      {s.value}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          {(["registrations", "marks"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground cursor-pointer"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Registrations Tab */}
        {activeTab === "registrations" && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4 sm:p-6 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium mb-1.5">
                      Governorate
                    </label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-transparent px-3"
                      value={govFilter}
                      onChange={(e) => setGovFilter(e.target.value)}
                    >
                      <option value="all">All Governorates</option>
                      {GOVERNORATES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1.5">Status</label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-transparent px-3"
                      value={markedFilter}
                      onChange={(e) => setMarkedFilter(e.target.value as any)}
                    >
                      <option value="all">All</option>
                      <option value="marked">Marked</option>
                      <option value="unmarked">Unmarked</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1.5">Search</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="National ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && setAppliedSearch(search)
                        }
                      />
                      <Button
                        onClick={async () => {
                          setAppliedSearch(search);
                          await fetchData();
                        }}
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-20 text-center text-muted-foreground">
                    Loading...
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="p-20 text-center text-muted-foreground">
                    No students found.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">#</TableHead>
                        <TableHead>National ID</TableHead>
                        <TableHead>Governorate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registered</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations.map((r, i) => (
                        <TableRow key={r.id}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell className="font-mono">
                            {r.nationalId}
                          </TableCell>
                          <TableCell>{r.governorate}</TableCell>
                          <TableCell>
                            {r.marked ? "Marked" : "Pending"}
                          </TableCell>
                          <TableCell>
                            {r.createdAt && typeof r.createdAt === "string"
                              ? new Date(r.createdAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Marks Tab */}
        {activeTab === "marks" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}
              >
                Sort: {sortDir === "desc" ? "Highest First" : "Lowest First"}
              </Button>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-20 text-center text-muted-foreground">
                    Loading...
                  </div>
                ) : sortedJoined.length === 0 ? (
                  <div className="p-20 text-center text-muted-foreground">
                    No marks added yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">#</TableHead>
                        <TableHead>National ID</TableHead>
                        <TableHead>Mark</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedJoined.map((r, i) => (
                        <TableRow key={r.id}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{r.nationalId}</TableCell>
                          <TableCell>
                            {editingId === r.id ? (
                              <Input
                                className="w-20"
                                type="number"
                                value={editingMark}
                                onChange={(e) => setEditingMark(e.target.value)}
                                autoFocus
                              />
                            ) : (
                              <span className="font-bold">
                                {r.markValue ?? "N/A"}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {editingId === r.id ? (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  onClick={async () =>
                                    await handleSaveMark(r.id)
                                  }
                                  disabled={savingId === r.id}
                                >
                                  {savingId === r.id ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingId(r.id);
                                  setEditingMark(
                                    r.markValue !== undefined
                                      ? String(r.markValue)
                                      : "",
                                  );
                                }}
                              >
                                {r.marked ? "Edit" : "Add Mark"}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
