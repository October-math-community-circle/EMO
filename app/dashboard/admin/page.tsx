"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
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
  getCompetitions,
} from "@/app/server-actions/adminActions";
import Link from "next/link";
import { db } from "@/app/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  limit,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { auth } from "@/app/firebase";
import type { Registration, Mark } from "@/types/registration";
import {
  ToastContainer,
  ToastOptions,
  TypeOptions,
  toast,
} from "react-toastify";
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

type Tab = "registrations" | "marks" | "competitions";
type SortDir = "asc" | "desc";

interface Stats {
  total: number;
  marked: number;
  unmarked: number;
  avgScore: number;
}

// Joined type for the marks tab
interface RegistrationWithMark extends Registration {
  markValue?: number;
  markedBy?: string;
  markedAt?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("registrations");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    marked: 0,
    unmarked: 0,
    avgScore: 0,
  });
  const [loading, setLoading] = useState(true);

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

  // Toast

  // ─── Data fetching ──────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    const [regRes, marksRes, statsRes, compRes] = await Promise.all([
      getRegistrations({
        governorate: govFilter,
        markedStatus: markedFilter,
        searchQuery: appliedSearch,
      }),
      getMarks(),
      getDashboardStats(),
      getCompetitions(),
    ]);
    if (regRes.success) setRegistrations(regRes.data as Registration[]);
    if (marksRes.success) setMarks(marksRes.data as Mark[]);
    if (statsRes.success) setStats(statsRes.data);
    if (compRes.success) setCompetitions(compRes.data);
    setLoading(false);
  }, [govFilter, markedFilter, appliedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Build joined data for marks tab ────────────────────────────────────
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

  // Sort joined data by mark
  const sortedJoined = [...joinedData].sort((a, b) => {
    const aVal = a.markValue ?? -1;
    const bVal = b.markValue ?? -1;
    return sortDir === "desc" ? bVal - aVal : aVal - bVal;
  });

  // ─── Handlers ───────────────────────────────────────────────────────────
  const showToast = (type: TypeOptions, text: string) => {
    toast(text, { type, autoClose: 3000 });
  };

  const handleSaveMark = async (registrationId: string) => {
    const val = Number(editingMark);
    if (isNaN(val) || val < 0 || val > 100) {
      showToast("error", "Mark must be between 0 and 100");
      return;
    }
    setSavingId(registrationId);
    try {
      const adminUid = auth.currentUser?.uid || "admin";

      // Check if a mark already exists for this registration
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
      fetchData();
    } catch (error) {
      console.error("Error saving mark:", error);
      showToast("error", "Failed to save mark");
    }
    setSavingId(null);
  };

  const handleExportCsv = () => {
    if (registrations.length === 0) {
      showToast("error", "No records to export.");
      return;
    }
    const headers = ["National ID", "Governorate", "Status", "Registered At"];
    const rows = registrations.map((r) => [
      r.nationalId,
      r.governorate,
      r.marked ? "Marked" : "Pending",
      r.createdAt ? new Date(r.createdAt as string).toLocaleDateString() : "-",
    ]);

    const csvContent =
      headers.join(",") + "\n" + rows.map((e) => e.join(",")).join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `registrations-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteCompetition = async (id: string, title: string) => {
    try {
      await deleteDoc(doc(db, "competitions", id));
      showToast("success", "Competition deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting competition:", error);
      showToast("error", "Failed to delete competition");
    }
  };

  // ─── Stat cards ─────────────────────────────────────────────────────────
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

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-zinc-50/50 to-white">
      <ToastContainer position="bottom-right" />
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage registrations and upload marks
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link href="/dashboard/admin/competitions">
              <Button variant="primary" className="gap-2">
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
                Competitions
              </Button>
            </Link>
            <Button
              variant="outline"
              disabled={loading}
              onClick={fetchData}
              className="flex-1 sm:flex-none gap-2"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          {statCards.map((s) => (
            <Card key={s.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
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
          {(["registrations", "marks", "competitions"] as Tab[]).map((tab) => (
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

        {/* ═══════════════════════ REGISTRATIONS TAB ═══════════════════════ */}
        {activeTab === "registrations" && (
          <>
            {/* Actions bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                variant="outline"
                onClick={handleExportCsv}
                className="gap-2"
                disabled={registrations.length === 0 || loading}
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Export to CSV
              </Button>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Governorate
                    </label>
                    <select
                      title="Filter by governorate"
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={govFilter}
                      disabled={loading}
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
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Status
                    </label>
                    <select
                      title="Filter by status"
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={markedFilter}
                      disabled={loading}
                      onChange={(e) =>
                        setMarkedFilter(
                          e.target.value as "all" | "marked" | "unmarked",
                        )
                      }
                    >
                      <option value="all">All</option>
                      <option value="marked">Marked</option>
                      <option value="unmarked">Unmarked</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Search
                    </label>
                    <div className="flex gap-2 items-center">
                      <Input
                        className="h-10!"
                        placeholder="National ID or Governorate..."
                        value={search}
                        disabled={loading}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setAppliedSearch(search);
                        }}
                      />
                      <Button
                        variant="primary"
                        disabled={loading}
                        onClick={() => setAppliedSearch(search)}
                        className="shrink-0 h-10"
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
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {loading ? (
                  <LoadingState />
                ) : registrations.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    {/* Desktop */}
                    <div className="hidden md:block">
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
                              <TableCell className="text-muted-foreground font-medium">
                                {i + 1}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {r.nationalId}
                              </TableCell>
                              <TableCell>{r.governorate}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={r.marked ? "success" : "warning"}
                                >
                                  {r.marked ? "Marked" : "Pending"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {r.createdAt
                                  ? new Date(
                                      r.createdAt as string,
                                    ).toLocaleDateString()
                                  : "—"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {/* Mobile */}
                    <div className="md:hidden divide-y divide-border">
                      {registrations.map((r, i) => (
                        <div key={r.id} className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {i + 1}
                              </div>
                              <div>
                                <p className="font-mono text-sm">
                                  {r.nationalId}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {r.governorate}
                                </p>
                              </div>
                            </div>
                            <Badge variant={r.marked ? "success" : "warning"}>
                              {r.marked ? "Marked" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* ═══════════════════════════ MARKS TAB ═══════════════════════════ */}
        {activeTab === "marks" && (
          <>
            {/* Actions bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                variant="outline"
                onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}
                className="gap-2"
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
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
                Sort: {sortDir === "desc" ? "Highest First" : "Lowest First"}
              </Button>
            </div>

            {/* Marks table */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {loading ? (
                  <LoadingState />
                ) : sortedJoined.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    {/* Desktop */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[60px]">#</TableHead>
                            <TableHead>National ID</TableHead>
                            <TableHead>Governorate</TableHead>
                            <TableHead
                              className="cursor-pointer select-none hover:text-primary transition-colors"
                              onClick={() =>
                                setSortDir(sortDir === "desc" ? "asc" : "desc")
                              }
                            >
                              Mark {sortDir === "desc" ? "↓" : "↑"}
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedJoined.map((r, i) => (
                            <TableRow key={r.id}>
                              <TableCell className="text-muted-foreground font-medium">
                                {i + 1}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {r.nationalId}
                              </TableCell>
                              <TableCell>{r.governorate}</TableCell>
                              <TableCell>
                                {editingId === r.id ? (
                                  <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={editingMark}
                                    onChange={(e) =>
                                      setEditingMark(e.target.value)
                                    }
                                    className="w-20 h-8 text-sm"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        handleSaveMark(r.id);
                                      if (e.key === "Escape") {
                                        setEditingId(null);
                                        setEditingMark("");
                                      }
                                    }}
                                  />
                                ) : (
                                  <span
                                    className={`font-bold text-lg ${r.markValue !== undefined ? "text-foreground" : "text-muted-foreground/40"}`}
                                  >
                                    {r.markValue !== undefined
                                      ? r.markValue
                                      : "—"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={r.marked ? "success" : "warning"}
                                >
                                  {r.marked ? "Marked" : "Pending"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {editingId === r.id ? (
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      size="sm"
                                      variant="primary"
                                      onClick={() => handleSaveMark(r.id)}
                                      disabled={savingId === r.id}
                                    >
                                      {savingId === r.id ? "Saving..." : "Save"}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingId(null);
                                        setEditingMark("");
                                      }}
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
                    </div>
                    {/* Mobile */}
                    <div className="md:hidden divide-y divide-border">
                      {sortedJoined.map((r, i) => (
                        <div key={r.id} className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {i + 1}
                              </div>
                              <div>
                                <p className="font-mono text-sm">
                                  {r.nationalId}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {r.governorate}
                                </p>
                              </div>
                            </div>
                            <Badge variant={r.marked ? "success" : "warning"}>
                              {r.marked ? "Marked" : "Pending"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs text-muted-foreground">
                                Mark:{" "}
                              </span>
                              {editingId === r.id ? (
                                <Input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={editingMark}
                                  onChange={(e) =>
                                    setEditingMark(e.target.value)
                                  }
                                  className="w-20 h-8 text-sm inline-block"
                                  autoFocus
                                />
                              ) : (
                                <span
                                  className={`font-bold text-lg ${r.markValue !== undefined ? "" : "text-muted-foreground/40"}`}
                                >
                                  {r.markValue !== undefined
                                    ? r.markValue
                                    : "—"}
                                </span>
                              )}
                            </div>
                            {editingId === r.id ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleSaveMark(r.id)}
                                  disabled={savingId === r.id}
                                >
                                  {savingId === r.id ? "..." : "Save"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingId(null);
                                    setEditingMark("");
                                  }}
                                >
                                  ✕
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* ═══════════════════════════ COMPETITIONS TAB ═══════════════════════════ */}
        {activeTab === "competitions" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                All Competitions
              </h2>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {loading ? (
                  <LoadingState />
                ) : competitions.length === 0 ? (
                  <EmptyState
                    message="No competitions created yet."
                    description="Click the 'Competitions' button above to create one."
                  />
                ) : (
                  <>
                    {/* Desktop */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[60px]">#</TableHead>
                            <TableHead>Competition Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Participants</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {competitions.map((c, i) => (
                            <TableRow key={c.id}>
                              <TableCell className="text-muted-foreground font-medium">
                                {i + 1}
                              </TableCell>
                              <TableCell>
                                <Link
                                  href={`/dashboard/admin/competitions/${c.id}`}
                                  className="font-semibold text-primary hover:underline"
                                >
                                  {c.title}
                                </Link>
                              </TableCell>
                              <TableCell>
                                {c.isOnline ? (
                                  <Badge variant="secondary">Online</Badge>
                                ) : (
                                  <span className="text-sm truncate max-w-[150px] inline-block">
                                    {c.location || "N/A"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    c.status === "open"
                                      ? "success"
                                      : c.status === "draft"
                                        ? "outline"
                                        : c.status === "cancelled"
                                          ? "danger"
                                          : "warning"
                                  }
                                >
                                  {c.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {c.maxParticipants > 0
                                  ? `${c.currentParticipants || 0} / ${c.maxParticipants}`
                                  : "Unlimited"}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Link
                                    href={`/dashboard/admin/competitions/${c.id}`}
                                  >
                                    <Button size="sm" variant="outline">
                                      Edit
                                    </Button>
                                  </Link>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() =>
                                      handleDeleteCompetition(c.id, c.title)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {/* Mobile */}
                    <div className="md:hidden divide-y divide-border">
                      {competitions.map((c, i) => (
                        <div key={c.id} className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {i + 1}
                              </div>
                              <div>
                                <Link
                                  href={`/dashboard/admin/competitions/${c.id}`}
                                  className="font-semibold text-sm hover:underline"
                                >
                                  {c.title}
                                </Link>
                                <p className="text-xs text-muted-foreground uppercase">
                                  {c.status}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link
                                href={`/dashboard/admin/competitions/${c.id}`}
                              >
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() =>
                                  handleDeleteCompetition(c.id, c.title)
                                }
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Footer count */}
        {!loading && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Showing{" "}
            {activeTab === "registrations"
              ? registrations.length
              : activeTab === "marks"
                ? sortedJoined.length
                : competitions.length}{" "}
            record
            {(activeTab === "registrations"
              ? registrations.length
              : activeTab === "marks"
                ? sortedJoined.length
                : competitions.length) !== 1
              ? "s"
              : ""}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <svg
          className="animate-spin h-8 w-8 text-primary"
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
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    </div>
  );
}

function EmptyState({
  message = "No records found",
  description = "Try adjusting your filters",
}: {
  message?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <svg
        className="w-12 h-12 mb-3 opacity-40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p className="text-sm font-medium">{message}</p>
      <p className="text-xs mt-1">{description}</p>
    </div>
  );
}
