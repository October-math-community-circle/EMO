import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
    return (
        <footer className="bg-white border-t border-border">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <div className="flex items-center mb-6">
                            <div className="relative h-10 w-10 mr-3 rounded-full overflow-hidden border border-border">
                                <Image src="/logo.jpg" alt="OMCC" fill className="object-cover" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-foreground">OMCC</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The Egyptian Math Olympiad is the premier platform for fostering mathematical excellence and critical thinking in Egypt.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-foreground tracking-widest uppercase mb-6">Competition</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">National Round</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Regional Rounds</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Past Papers</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-foreground tracking-widest uppercase mb-6">Participants</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Student Registration</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Coach Portal</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Results</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-foreground tracking-widest uppercase mb-6">Contact</h3>
                        <ul className="space-y-4">
                            <li className="text-sm text-muted-foreground">contact@omcc.eg</li>
                            <li className="text-sm text-muted-foreground">+20 (2) 123 456 789</li>
                            <li className="flex gap-4 mt-4">
                                <div className="w-8 h-8 rounded bg-zinc-100 hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-center text-foreground font-bold text-xs">FB</div>
                                <div className="w-8 h-8 rounded bg-zinc-100 hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-center text-foreground font-bold text-xs">X</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Egyptian Math Olympiad. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Privacy</span>
                        <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Terms</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
