'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ResourcesPage() {
    const materials = [
        { title: 'Algebra Fundamentals', type: 'PDF', size: '2.4 MB', level: 'Junior', downloads: 1200 },
        { title: 'Number Theory Advanced', type: 'Video', size: 'N/A', level: 'Senior', downloads: 850 },
        { title: 'Geometry Question Bank 2023', type: 'PDF', size: '5.1 MB', level: 'All', downloads: 3000 },
        { title: 'Combinatorics Cheat Sheet', type: 'PDF', size: '1.2 MB', level: 'Advanced', downloads: 500 },
    ];

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Materials</h1>
                <p className="text-gray-600">Access curated resources to prepare for the Olympiad.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((item, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className={`
                             h-12 w-12 rounded-lg flex items-center justify-center text-xl font-bold
                             ${item.type === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                         `}>
                                    {item.type === 'PDF' ? 'PDF' : 'VID'}
                                </div>
                                <Badge variant="secondary">{item.level}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">{item.size !== 'N/A' ? `${item.size} • ` : ''} {item.downloads} downloads</p>
                            <Button variant="outline" className="w-full">Download / View</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <section className="mt-16 bg-blue-50 rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">Need more resources?</h2>
                    <p className="text-gray-600">Join our community forum to discuss problems and share solutions.</p>
                </div>
                <Button size="lg">Join Community</Button>
            </section>
        </div>
    );
}
