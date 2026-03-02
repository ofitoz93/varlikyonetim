import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownRight, ArrowUpRight, TrendingUp, Trophy, Wallet } from 'lucide-react';
import { useAssets } from '../context/AssetContext';
import { mockTrendData } from '../data/mockData';
import { cn } from '../lib/utils';
import { type ChartData } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
    'Altın': '#F59E0B',
    'Hisse': '#3B82F6',
    'Döviz': '#10B981',
    'Kripto': '#8B5CF6',
    'Gayrimenkul': '#EF4444',
    'Manuel': '#6B7280',
};

export function Dashboard() {
    const { stats, assets } = useAssets();
    const isProfit = stats.totalProfitLoss >= 0;

    // Calculate distribution data based on current assets
    const distributionMap = new Map<string, number>();
    assets.forEach(asset => {
        const current = distributionMap.get(asset.category) || 0;
        distributionMap.set(asset.category, current + asset.totalValue);
    });

    const distributionData: ChartData[] = Array.from(distributionMap.entries()).map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] || '#6B7280'
    }));

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Value Card */}
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <h3 className="text-muted-foreground font-medium text-sm">Toplam Varlık</h3>
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Wallet size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-3xl font-bold text-foreground">
                            ₺{stats.totalValue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Total Profit/Loss Card */}
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <h3 className="text-muted-foreground font-medium text-sm">Toplam Kar / Zarar</h3>
                        <div className={cn("p-2 rounded-lg", isProfit ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-end gap-2">
                        <p className="text-3xl font-bold text-foreground">
                            {isProfit ? '+' : ''}₺{stats.totalProfitLoss.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <div className={cn("flex items-center text-sm font-medium mb-1", isProfit ? "text-success" : "text-destructive")}>
                            {isProfit ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            {stats.totalProfitLossPercentage}%
                        </div>
                    </div>
                </div>

                {/* Top Performer Card */}
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <h3 className="text-muted-foreground font-medium text-sm">En Çok Kazandıran Varlık</h3>
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                            <Trophy size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-xl font-bold text-foreground truncate">{stats.topPerformer?.name || 'Veri Yok'}</p>
                        {stats.topPerformer && (
                            <div className="flex items-center gap-2 mt-1">
                                <span className={cn("text-sm font-medium flex items-center", stats.topPerformer.profitLossPercentage >= 0 ? "text-success" : "text-destructive")}>
                                    {stats.topPerformer.profitLossPercentage >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    {stats.topPerformer.profitLossPercentage.toFixed(2)}%
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    ({stats.topPerformer.profitLoss >= 0 ? '+' : ''}₺{stats.topPerformer.profitLoss.toLocaleString('tr-TR', { minimumFractionDigits: 0 })})
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Distribution Pie Chart */}
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border lg:col-span-1 flex flex-col min-h-[400px]">
                    <h3 className="text-foreground font-bold mb-6">Varlık Dağılımı</h3>
                    <div className="flex-1 min-h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any) => `₺${Number(value).toLocaleString('tr-TR')}`}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 mt-4">
                        {distributionData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-muted-foreground">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trend Area Chart (6 months) */}
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border lg:col-span-2 flex flex-col min-h-[400px]">
                    <h3 className="text-foreground font-bold mb-6">Varlık Trendi (Son 6 Ay)</h3>
                    <div className="flex-1 w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockTrendData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#243b53" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#243b53" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#829ab1', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}k`}
                                    tick={{ fill: '#829ab1', fontSize: 12 }}
                                    dx={-10}
                                />
                                <Tooltip
                                    formatter={(value: any) => [`₺${Number(value).toLocaleString('tr-TR')}`, 'Toplam Varlık']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#243b53"
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
