import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Asset, type DashboardStats } from '../types';
import { fetchPriceFromUrl } from '../services/api';
import { supabase } from '../lib/supabase';

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
    const [assets, setAssets] = useState<Asset[]>([]);
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
        const multiplier = asset.category === 'Borç' ? -1 : 1;
        const totalValue = asset.quantity * asset.currentPrice * multiplier;
        const profitLoss = (asset.currentPrice - asset.unitCost) * asset.quantity * multiplier;
        const profitLossPercentage = asset.unitCost > 0
            ? ((asset.currentPrice - asset.unitCost) / asset.unitCost) * 100 * multiplier
            : 0;

        return {
            ...asset,
            totalValue,
            profitLoss,
            profitLossPercentage
        };
    };

    const addAsset = async (newAssetData: Omit<Asset, 'id' | 'totalValue' | 'profitLoss' | 'profitLossPercentage'>) => {
        // Optimistic UI update
        const tempId = Math.random().toString(36).substr(2, 9);
        const newAsset = calculateDerivedValues({
            ...newAssetData,
            id: tempId,
        });
        setAssets(prev => [...prev, newAsset]);

        const { data, error } = await supabase.from('assets').insert([{
            name: newAssetData.name,
            category: newAssetData.category,
            quantity: newAssetData.quantity,
            unit_cost: newAssetData.unitCost,
            current_price: newAssetData.currentPrice,
            source_url: newAssetData.sourceUrl
        }]).select();

        if (error) {
            console.error('Error adding asset to Supabase:', error);
            // Revert optimistic update
            setAssets(prev => prev.filter(a => a.id !== tempId));
        } else if (data && data.length > 0) {
            // Replace temporary ID with actual DB ID
            setAssets(prev => prev.map(a => a.id === tempId ? calculateDerivedValues({
                ...a,
                id: data[0].id
            }) : a));
        }
    };

    const removeAsset = async (id: string) => {
        // Optimistic UI update
        const previousAssets = [...assets];
        setAssets(prev => prev.filter(a => a.id !== id));

        const { error } = await supabase.from('assets').delete().eq('id', id);

        if (error) {
            console.error('Error removing asset from Supabase:', error);
            // Revert optimistic update
            setAssets(previousAssets);
        }
    };

    const refreshPrices = async () => {
        setIsRefreshing(true);
        const updatedAssets = await Promise.all(assets.map(async (asset) => {
            if (asset.sourceUrl) {
                const newPrice = await fetchPriceFromUrl(asset.sourceUrl);
                if (newPrice !== null && newPrice !== asset.currentPrice) {
                    // Update in Supabase
                    const { error } = await supabase.from('assets')
                        .update({ current_price: newPrice })
                        .eq('id', asset.id);

                    if (!error) {
                        return calculateDerivedValues({
                            ...asset,
                            currentPrice: newPrice
                        });
                    } else {
                        console.error('Error updating price in Supabase:', error);
                    }
                }
            }
            return asset;
        }));

        setAssets(updatedAssets);
        setIsRefreshing(false);
    };

    useEffect(() => {
        const fetchAssets = async () => {
            const { data, error } = await supabase.from('assets').select('*');

            if (error) {
                console.error('Error fetching assets from Supabase:', error);
                return;
            }

            if (data) {
                const mappedAssets = data.map(dbAsset => calculateDerivedValues({
                    id: dbAsset.id,
                    name: dbAsset.name,
                    category: dbAsset.category,
                    quantity: dbAsset.quantity,
                    unitCost: dbAsset.unit_cost,
                    currentPrice: dbAsset.current_price,
                    sourceUrl: dbAsset.source_url
                }));

                setAssets(mappedAssets);
            }
        };

        fetchAssets();
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
