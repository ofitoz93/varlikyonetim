export type AssetCategory = 'Altın' | 'Hisse' | 'Döviz' | 'Kripto' | 'Gayrimenkul' | 'Manuel';

export interface Asset {
    id: string;
    name: string;
    category: AssetCategory;
    quantity: number;
    unitCost: number;
    currentPrice: number;
    totalValue: number; // quantity * currentPrice
    profitLoss: number; // (currentPrice - unitCost) * quantity
    profitLossPercentage: number; // ((currentPrice - unitCost) / unitCost) * 100
    sourceUrl?: string; // Canlı fiyatın çekileceği kaynak URL
}

export interface DashboardStats {
    totalValue: number;
    totalProfitLoss: number;
    totalProfitLossPercentage: number;
    topPerformer: Asset | null;
}

export interface ChartData {
    name: string;
    value: number;
    color?: string;
}

export interface TrendData {
    date: string;
    value: number;
}
