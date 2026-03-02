import { useState } from 'react';
import { Network, X, RefreshCw } from 'lucide-react';
import { useAssets } from '../context/AssetContext';
import { fetchPriceFromUrl } from '../services/api';
import { type AssetCategory } from '../types';

interface AddAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddAssetModal({ isOpen, onClose }: AddAssetModalProps) {
    const { addAsset } = useAssets();

    const [category, setCategory] = useState<AssetCategory>('Hisse');
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitCost, setUnitCost] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');

    // New features variables
    const [sourceUrl, setSourceUrl] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState('');

    if (!isOpen) return null;

    const handleFetchPrice = async () => {
        if (!sourceUrl) return;
        setIsFetching(true);
        setFetchError('');

        const price = await fetchPriceFromUrl(sourceUrl);
        if (price !== null) {
            setCurrentPrice(price.toString());
        } else {
            setFetchError('Fiyat okunamadı. URL kısıtlanmış veya eleman bulunamıyor olabilir.');
        }
        setIsFetching(false);
    };

    const handleClose = () => {
        // Reset form
        setCategory('Hisse');
        setName('');
        setQuantity('');
        setUnitCost('');
        setCurrentPrice('');
        setSourceUrl('');
        setFetchError('');
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        addAsset({
            category,
            name,
            quantity: parseFloat(quantity),
            unitCost: parseFloat(unitCost),
            currentPrice: currentPrice ? parseFloat(currentPrice) : parseFloat(unitCost),
            sourceUrl: sourceUrl || undefined
        });

        handleClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground">Yeni Varlık Ekle</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Varlık Türü</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as AssetCategory)}
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                            required
                        >
                            <option value="Hisse">Hisse Senedi</option>
                            <option value="Altın">Altın</option>
                            <option value="Döviz">Döviz</option>
                            <option value="Kripto">Kripto Para</option>
                            <option value="Gayrimenkul">Gayrimenkul</option>
                            <option value="Manuel">Manuel (Diğer)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Varlık Adı</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Örn: THYAO, Gram Altın"
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Canlı Veri Kaynağı (URL - İsteğe Bağlı)</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                    <Network size={16} />
                                </div>
                                <input
                                    type="url"
                                    value={sourceUrl}
                                    onChange={(e) => setSourceUrl(e.target.value)}
                                    placeholder="Örn: https://bigpara.hurriyet.com.tr/..."
                                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground text-sm"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleFetchPrice}
                                disabled={!sourceUrl || isFetching}
                                className="px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg font-medium text-sm hover:bg-primary/20 disabled:opacity-50 transition-colors flex flex-shrink-0 items-center gap-2"
                            >
                                {isFetching ? <RefreshCw size={16} className="animate-spin" /> : <span>Fiyatı Çek</span>}
                            </button>
                        </div>
                        {fetchError && <p className="text-xs text-destructive mt-1">{fetchError}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Miktar</label>
                            <input
                                type="number"
                                step="any"
                                min="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Alış Fiyatı (TL)</label>
                            <input
                                type="number"
                                step="any"
                                min="0"
                                value={unitCost}
                                onChange={(e) => setUnitCost(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="text-sm font-medium text-foreground">Güncel Fiyat (TL)</label>
                        <input
                            type="number"
                            step="any"
                            min="0"
                            value={currentPrice}
                            onChange={(e) => setCurrentPrice(e.target.value)}
                            placeholder="Varsayılan: Alış Fiyatı"
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                            required={category === 'Manuel' && !sourceUrl}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 bg-muted text-muted-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                        >
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
