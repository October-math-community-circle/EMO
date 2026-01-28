'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { competitions } from '@/lib/data';

export default function StudentDashboard() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <div className="flex space-x-4 mt-2 border-b border-border pb-2 md:pb-0 md:border-0">
                        <button className="text-primary font-semibold border-b-2 border-primary pb-1">Current Competitions</button>
                        <button className="text-muted-foreground hover:text-foreground font-medium">My Registrations</button>
                        <button className="text-muted-foreground hover:text-foreground font-medium">Results</button>
                    </div>
                </div>
                <Button>New registration</Button>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Current Competitions</h2>

                {competitions.map((comp) => (
                    <Card key={comp.id} className="bg-white">
                        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-gray-900">{comp.title}</h3>
                                    {comp.status === 'Open' ? (
                                        <Badge variant="success">Registration Open</Badge>
                                    ) : (
                                        <Badge variant="warning">{comp.status}</Badge>
                                    )}
                                </div>
                                <div className="text-sm text-gray-600 space-x-4">
                                    <span>Division: <span className="font-medium text-gray-900">{comp.division}</span></span>
                                    <span>Round: <span className="font-medium text-gray-900">{comp.round}</span></span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                {comp.status === 'Open' ? (
                                    <Button size="sm" className="w-full md:w-auto">Register</Button>
                                ) : (
                                    <Button variant="outline" size="sm" className="w-full md:w-auto">View Details</Button>
                                )}
                                <span className="text-xs text-gray-500">{comp.date} • {comp.location}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Next Round</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="font-bold text-gray-900">National Round</p>
                                <p className="text-sm text-gray-500">Oct 26, 2024</p>
                                <p className="text-sm text-gray-500">Cairo</p>
                            </div>
                            <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Coach Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">DA</div>
                            <div>
                                <p className="font-bold text-gray-900">Dr. Azza Ali</p>
                                <p className="text-sm text-gray-500">azza.ali@example.com</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
