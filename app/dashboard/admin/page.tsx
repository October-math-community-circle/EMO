"use client";

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

// Mock data for demonstration
const STATS = [
  {
    label: "Active Competitions",
    value: "3",
    status: "Active",
    statusColor: "text-success",
  },
  {
    label: "Registered Students",
    value: "1,500",
    status: "Total registered",
    statusColor: "text-muted-foreground",
  },
  {
    label: "Pending Results",
    value: "25",
    status: "Needs approval",
    statusColor: "text-warning",
  },
  {
    label: "Approved Results",
    value: "450",
    status: "Approved",
    statusColor: "text-primary",
  },
];

const PENDING_REGISTRATIONS = [
  {
    id: 1,
    name: "Karim Said",
    email: "karim@example.com",
    school: "Cairo International School",
    time: "2 hours ago",
  },
  {
    id: 2,
    name: "Sara Ahmed",
    email: "sara@example.com",
    school: "Alexandria STEM School",
    time: "4 hours ago",
  },
  {
    id: 3,
    name: "Omar Hassan",
    email: "omar@example.com",
    school: "Future International Academy",
    time: "6 hours ago",
  },
];

const SYSTEM_SERVICES = [
  {
    name: "Registration Portal",
    status: "Online",
    variant: "success" as const,
    uptime: "99.9%",
  },
  {
    name: "Result Processing",
    status: "Maintenance",
    variant: "warning" as const,
    uptime: "98.5%",
  },
  {
    name: "Email Notification",
    status: "Online",
    variant: "success" as const,
    uptime: "100%",
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-zinc-50/50 to-white">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage competitions, students, and results
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          {STATS.map((stat, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="text-muted-foreground text-xs sm:text-sm font-medium">
                  {stat.label}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
                  {stat.value}
                </div>
                <div className={`text-xs mt-1 ${stat.statusColor}`}>
                  {stat.status}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Pending Registrations Table - Takes 2 columns on XL */}
          <section className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Pending Registrations
              </h2>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="primary" className="gap-1.5">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Accept All
                </Button>
                <Badge variant="warning" className="text-xs">
                  {PENDING_REGISTRATIONS.length} pending
                </Badge>
              </div>
            </div>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Desktop Table View */}
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead className="hidden md:table-cell">
                          School
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Applied
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PENDING_REGISTRATIONS.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {student.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {student.school}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                            {student.time}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="primary">
                                Approve
                              </Button>
                              <Button size="sm" variant="outline">
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden divide-y divide-border">
                  {PENDING_REGISTRATIONS.map((student) => (
                    <div key={student.id} className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {student.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {student.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">School:</span>{" "}
                        {student.school}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {student.time}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="primary">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* System Status - 1 column on XL */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                System Status
              </h2>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-xs text-muted-foreground">
                  All systems operational
                </span>
              </div>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Uptime</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SYSTEM_SERVICES.map((service, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-foreground">
                          {service.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant={service.variant}>
                            {service.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {service.uptime}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col gap-1"
                >
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="text-xs">New Competition</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col gap-1"
                >
                  <svg
                    className="w-5 h-5 text-primary"
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
                  <span className="text-xs">Upload Results</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col gap-1"
                >
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="text-xs">View Students</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col gap-1"
                >
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span className="text-xs">View Reports</span>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
