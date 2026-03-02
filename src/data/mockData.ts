import { type Asset, type ChartData, type TrendData } from '../types';

export const mockAssets: Asset[] = [
    {
        id: '1',
        name: 'Gram Altın',
        category: 'Altın',
        quantity: 150,
        unitCost: 1800,
        currentPrice: 3100,
        totalValue: 465000,
        profitLoss: 195000,
        profitLossPercentage: 72.22,
    },
    {
        id: '2',
        name: 'THYAO',
        category: 'Hisse',
        quantity: 500,
        unitCost: 240,
        currentPrice: 315,
        totalValue: 157500,
        profitLoss: 37500,
        profitLossPercentage: 31.25,
        sourceUrl: 'https://bigpara.hurriyet.com.tr/borsa/hisse-fiyatlari/thyao-turk-hava-yollari-detay/'
    },
    {
        id: '3',
        name: 'Amerikan Doları',
        category: 'Döviz',
        quantity: 2000,
        unitCost: 28.50,
        currentPrice: 34.20,
        totalValue: 68400,
        profitLoss: 11400,
        profitLossPercentage: 20.00,
    },
    {
        id: '4',
        name: 'Bitcoin',
        category: 'Kripto',
        quantity: 0.15,
        unitCost: 1200000,
        currentPrice: 2150000,
        totalValue: 322500,
        profitLoss: 142500,
        profitLossPercentage: 79.16,
    },
    {
        id: '5',
        name: 'Arsa (İzmir)',
        category: 'Gayrimenkul',
        quantity: 1,
        unitCost: 450000,
        currentPrice: 850000,
        totalValue: 850000,
        profitLoss: 400000,
        profitLossPercentage: 88.88,
    }
];

export const mockDistributionData: ChartData[] = [
    { name: 'Altın', value: 465000, color: '#F59E0B' }, // Amber
    { name: 'Hisse', value: 157500, color: '#3B82F6' }, // Blue
    { name: 'Döviz', value: 68400, color: '#10B981' },  // Emerald
    { name: 'Kripto', value: 322500, color: '#8B5CF6' }, // Violet
    { name: 'Gayrimenkul', value: 850000, color: '#EF4444' } // Red
];

// Son 6 ayın trend verileri (Mock)
export const mockTrendData: TrendData[] = [
    { date: 'Eyl', value: 1250000 },
    { date: 'Ekim', value: 1320000 },
    { date: 'Kas', value: 1410000 },
    { date: 'Ara', value: 1580000 },
    { date: 'Oca', value: 1720000 },
    { date: 'Şub', value: 1863400 },
];
