import { useState } from 'react';
import { LayoutDashboard, Wallet, TrendingUp, Settings, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'assets', label: 'Varlıklarım', icon: Wallet },
        { id: 'markets', label: 'Piyasalar', icon: TrendingUp },
        { id: 'settings', label: 'Ayarlar', icon: Settings },
    ];

    const handleTabClick = (id: string) => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border text-card-foreground">
                <div className="font-bold text-xl tracking-tight text-primary">VarlıkTakip</div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-md hover:bg-muted text-muted-foreground"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Container */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 hidden md:block">
                    <h1 className="text-2xl font-bold tracking-tight text-primary">VarlıkTakip</h1>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabClick(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                                activeTab === item.id
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm"
                            )}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-border mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            OF
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-foreground">Özhan Fitoz</p>
                            <p className="text-muted-foreground text-xs">Premium Plan</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
