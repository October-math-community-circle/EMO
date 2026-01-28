'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { leaderboardData } from '@/lib/data';

export default function ResultsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Results Leaderboard</h1>
                <p className="text-gray-600">Check the top performers in the recent rounds.</p>
            </div>

            <Card className="p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Round</label>
                        <select title='Round' className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm">
                            <option>National Round 2024</option>
                            <option>Regional Round 2024</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                        <select title='Division' className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm">
                            <option>Senior</option>
                            <option>Junior</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <Input placeholder="Search by name or school" />
                    </div>
                    <Button variant="outline">Export CSV</Button>
                </div>
            </Card>

            <Card className="overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Rank</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Institution</TableHead>
                            <TableHead>Division</TableHead>
                            <TableHead>Total Score</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboardData.map((row) => (
                            <TableRow key={row.rank}>
                                <TableCell className="font-bold">
                                    <div className={`
                             flex items-center justify-center w-8 h-8 rounded-full font-bold
                             ${row.rank === 1 ? 'bg-yellow-100 text-yellow-700' : ''}
                             ${row.rank === 2 ? 'bg-gray-100 text-gray-700' : ''}
                             ${row.rank === 3 ? 'bg-orange-100 text-orange-700' : ''}
                          `}>
                                        {row.rank}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{row.name}</TableCell>
                                <TableCell>{row.institution}</TableCell>
                                <TableCell>{row.division}</TableCell>
                                <TableCell className="font-bold">{row.score}</TableCell>
                                <TableCell>
                                    <Badge variant={row.rank === 1 ? 'warning' : row.rank === 2 ? 'secondary' : 'outline'}>
                                        {row.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
