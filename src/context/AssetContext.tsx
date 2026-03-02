import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Asset, type DashboardStats } from '../types';
import { mockAssets } from '../data/mockData';
import { fetchPriceFromUrl } from '../services/api';

interface AssetContextType {
    assets: Asset[];
    stats: DashboardStats;
    addAsset: (asset: Omit<Asset, 'id' | 'totalValue' | 'profitLoss' | 'profitLossPercentage'>) => void;
    removeAsset: (id: string) => void;
    refreshPrices: () => Promise<void>;
    isRefreshing: boolean;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
    const [assets, setAssets] = useState<Asset[]>(mockAssets);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Derive stats dynamically from assets
    const stats: DashboardStats = {
        totalValue: assets.reduce((sum, a) => sum + a.totalValue, 0),
        totalProfitLoss: assets.reduce((sum, a) => sum + a.profitLoss, 0),
        totalProfitLossPercentage: 0,
        topPerformer: assets.length > 0 ? assets.reduce((prev, current) =>
            (prev.profitLossPercentage > current.profitLossPercentage) ? prev : current
        ) : null
    };

    if (assets.length > 0) {
        const totalCost = assets.reduce((sum, a) => sum + (a.unitCost * a.quantity), 0);
        if (totalCost > 0) {
            stats.totalProfitLossPercentage = parseFloat(((stats.totalProfitLoss / totalCost) * 100).toFixed(2));
        }
    }

    const calculateDerivedValues = (asset: any): Asset => {
        const totalValue = asset.quantity * asset.currentPrice;
        const profitLoss = (asset.currentPrice - asset.unitCost) * asset.quantity;
        const profitLossPercentage = asset.unitCost > 0
            ? ((asset.currentPrice - asset.unitCost) / asset.unitCost) * 100
            : 0;

        return {
            ...asset,
            totalValue,
            profitLoss,
            profitLossPercentage
        };
    };

    const addAsset = (newAssetData: Omit<Asset, 'id' | 'totalValue' | 'profitLoss' | 'profitLossPercentage'>) => {
        const newAsset = calculateDerivedValues({
            ...newAssetData,
            id: Math.random().toString(36).substr(2, 9),
        });
        setAssets(prev => [...prev, newAsset]);
    };

    const removeAsset = (id: string) => {
        setAssets(prev => prev.filter(a => a.id !== id));
    };

    const refreshPrices = async () => {
        setIsRefreshing(true);
        const updatedAssets = await Promise.all(assets.map(async (asset) => {
            if (asset.sourceUrl) {
                const newPrice = await fetchPriceFromUrl(asset.sourceUrl);
                if (newPrice !== null) {
                    return calculateDerivedValues({
                        ...asset,
                        currentPrice: newPrice
                    });
                }
            }
            return asset;
        }));

        setAssets(updatedAssets);
        setIsRefreshing(false);
    };

    // Optionally fetch once on mount if there's any URL
    useEffect(() => {
        // delay initial fetch slightly
        const timer = setTimeout(() => {
            if (assets.some(a => !!a.sourceUrl)) {
                refreshPrices();
            }
        }, 1000);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AssetContext.Provider value={{ assets, stats, addAsset, removeAsset, refreshPrices, isRefreshing }}>
            {children}
        </AssetContext.Provider>
    );
}

export function useAssets() {
    const context = useContext(AssetContext);
    if (context === undefined) {
        throw new Error('useAssets must be used within an AssetProvider');
    }
    return context;
}
