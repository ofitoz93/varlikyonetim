import { useState } from 'react';
import { Plus, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import { useAssets } from '../context/AssetContext';
import { cn } from '../lib/utils';
import { AddAssetModal } from './AddAssetModal';
import { AddDebtCreditModal } from './AddDebtCreditModal';

export function AssetsTable() {
    const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
    const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
    const { assets, removeAsset, refreshPrices, isRefreshing } = useAssets();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Varlıklarım</h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={refreshPrices}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors shadow-sm font-medium disabled:opacity-50"
                    >
                        <RefreshCw size={20} className={cn(isRefreshing && "animate-spin")} />
                        <span className="hidden sm:inline">Fiyatları Güncelle</span>
                    </button>
                    <button
                        onClick={() => setIsDebtModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors shadow-sm font-medium"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Borç / Alacak Ekle</span>
                    </button>
                    <button
                        onClick={() => setIsAssetModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Yeni Varlık Ekle</span>
                    </button>
                </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted text-muted-foreground text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Varlık Adı</th>
                                <th className="px-6 py-4 font-medium hidden md:table-cell">Kategori</th>
                                <th className="px-6 py-4 font-medium text-right">Miktar</th>
                                <th className="px-6 py-4 font-medium text-right hidden sm:table-cell">Birim Maliyet</th>
                                <th className="px-6 py-4 font-medium text-right">Güncel Fiyat</th>
                                <th className="px-6 py-4 font-medium text-right">Toplam Değer</th>
                                <th className="px-6 py-4 font-medium text-right">Kar / Zarar</th>
                                <th className="px-6 py-4 font-medium text-center">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {assets.map((asset) => {
                                const isProfit = asset.profitLoss >= 0;

                                return (
                                    <tr key={asset.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-foreground flex items-center gap-2">
                                                {asset.name}
                                                {asset.sourceUrl && (
                                                    <a href={asset.sourceUrl} target="_blank" rel="noreferrer" title="Canlı Veri Kaynağı" className="text-muted-foreground hover:text-primary">
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground md:hidden">{asset.category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                                {asset.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-foreground">
                                            {asset.quantity.toLocaleString('tr-TR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-muted-foreground hidden sm:table-cell">
                                            ₺{asset.unitCost.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-foreground">
                                            ₺{asset.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-foreground">
                                            ₺{asset.totalValue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className={cn("font-bold", isProfit ? "text-success" : "text-destructive")}>
                                                {isProfit ? '+' : ''}₺{asset.profitLoss.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                            </div>
                                            <div className={cn("text-xs font-medium", isProfit ? "text-success/80" : "text-destructive/80")}>
                                                {isProfit ? '+' : ''}{asset.profitLossPercentage.toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => removeAsset(asset.id)}
                                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                title="Sil"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {assets.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                                        Henüz hiç varlık eklemediniz. "Yeni Varlık Ekle" butonu ile ilk varlığınızı kaydedebilirsiniz.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddAssetModal
                isOpen={isAssetModalOpen}
                onClose={() => setIsAssetModalOpen(false)}
            />
            <AddDebtCreditModal
                isOpen={isDebtModalOpen}
                onClose={() => setIsDebtModalOpen(false)}
            />
        </div>
    );
}
