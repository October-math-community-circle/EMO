'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { studentResults } from '@/lib/data';

export default function CoachDashboard() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
                <div className="flex gap-2">
                    <Button variant="outline">Import CSV</Button>
                    <Button>Add Student</Button>
                </div>
            </div>

            <div className="flex gap-2 mb-6">
                <select title='Round' className="h-10 rounded-md border border-gray-300 px-3 py-2 text-sm bg-white">
                    <option>Round: All</option>
                    <option>National</option>
                    <option>Regional</option>
                </select>
                <select title='Status' className="h-10 rounded-md border border-gray-300 px-3 py-2 text-sm bg-white">
                    <option>Status: All</option>
                    <option>Qualified</option>
                    <option>Pending</option>
                </select>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Division</TableHead>
                            <TableHead>Round</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentResults.map((result) => (
                            <TableRow key={result.id}>
                                <TableCell className="font-medium">{result.studentName}</TableCell>
                                <TableCell>{result.division}</TableCell>
                                <TableCell>{result.round}</TableCell>
                                <TableCell>
                                    <Badge variant={result.status === 'Qualified' ? 'success' : 'warning'}>
                                        {result.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{result.score > 0 ? `${result.score}/100` : '-'}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
