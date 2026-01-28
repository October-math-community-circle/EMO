'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

export default function AdminDashboard() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
                <div className="flex space-x-2">
                    <Button variant="outline">Settings</Button>
                    <Button>Logout</Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-gray-500 text-sm font-medium">Active Competitions</div>
                        <div className="text-3xl font-bold text-gray-900 mt-2">3</div>
                        <div className="text-xs text-green-600 mt-1">Active</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-gray-500 text-sm font-medium">Registered Students</div>
                        <div className="text-3xl font-bold text-gray-900 mt-2">1,500</div>
                        <div className="text-xs text-gray-500 mt-1">Total registered</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-gray-500 text-sm font-medium">Pending Results</div>
                        <div className="text-3xl font-bold text-gray-900 mt-2">25</div>
                        <div className="text-xs text-amber-600 mt-1">Needs approval</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-gray-500 text-sm font-medium">Approved Results</div>
                        <div className="text-3xl font-bold text-gray-900 mt-2">450</div>
                        <div className="text-xs text-blue-600 mt-1">Approved</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Actions */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Actions</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-900">Student Registration - Karim Said</p>
                                        <p className="text-xs text-gray-500">Applied 2 hours ago</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="primary">Approve</Button>
                                        <Button size="sm" variant="danger">Reject</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Quick Links / Recent Activity */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
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
                                    <TableRow>
                                        <TableCell>Registration Portal</TableCell>
                                        <TableCell><Badge variant="success">Online</Badge></TableCell>
                                        <TableCell className="text-right">99.9%</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Result Processing</TableCell>
                                        <TableCell><Badge variant="warning">Maintenance</Badge></TableCell>
                                        <TableCell className="text-right">98.5%</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Email Notification</TableCell>
                                        <TableCell><Badge variant="success">Online</Badge></TableCell>
                                        <TableCell className="text-right">100%</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
