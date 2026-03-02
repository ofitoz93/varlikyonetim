import { type ReactNode } from 'react';

interface LayoutProps {
    sidebar: ReactNode;
    children: ReactNode;
}

export function Layout({ sidebar, children }: LayoutProps) {
    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {sidebar}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                <div className="max-w-7xl mx-auto space-y-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
