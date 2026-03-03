import { useState } from 'react';
import { Network, X, RefreshCw } from 'lucide-react';
import { useAssets } from '../context/AssetContext';
import { type AssetCategory } from '../types';
import { fetchPriceFromUrl } from '../services/api';

interface AddDebtCreditModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddDebtCreditModal({ isOpen, onClose }: AddDebtCreditModalProps) {
    const { addAsset } = useAssets();

    const [category, setCategory] = useState<AssetCategory>('Borç');
    const [subCategory, setSubCategory] = useState('TL');
    const [contactName, setContactName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitCost, setUnitCost] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');

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
        setCategory('Borç');
        setSubCategory('TL');
        setContactName('');
        setQuantity('');
        setUnitCost('');
        setCurrentPrice('');
        setSourceUrl('');
        setFetchError('');
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const parsedUnitCost = unitCost ? parseFloat(unitCost) : 1;
        const parsedCurrentPrice = currentPrice ? parseFloat(currentPrice) : parsedUnitCost;

        // Combine contact name and sub category into the main name
        const finalName = `${contactName.trim()} (${subCategory})`;

        addAsset({
            category,
            name: finalName,
            quantity: parseFloat(quantity),
            unitCost: parsedUnitCost,
            currentPrice: parsedCurrentPrice,
            sourceUrl: sourceUrl || undefined
        });

        handleClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
                    <h2 className="text-xl font-bold text-foreground">Borç / Alacak Ekle</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">İşlem Türü</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as AssetCategory)}
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                required
                            >
                                <option value="Borç">Borç (Ödenecek)</option>
                                <option value="Alacak">Alacak (Tahsil Edilecek)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Varlık Türü (Cinsi)</label>
                            <select
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                required
                            >
                                <option value="TL">Türk Lirası (TL)</option>
                                <option value="Dolar">Amerikan Doları (USD)</option>
                                <option value="Euro">Euro (EUR)</option>
                                <option value="Sterlin">İngiliz Sterlini (GBP)</option>
                                <option value="Gram Altın">Gram Altın</option>
                                <option value="Çeyrek Altın">Çeyrek Altın</option>
                                <option value="Diğer">Diğer</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Kimden / Kime</label>
                            <input
                                type="text"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                placeholder="Örn: Ahmet, Banka, X Kurumu"
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Dövizli Borç/Alacak için Canlı Kur Linki (Opsiyonel)
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                        <Network size={16} />
                                    </div>
                                    <input
                                        type="url"
                                        value={sourceUrl}
                                        onChange={(e) => setSourceUrl(e.target.value)}
                                        placeholder="Örn: Kur linki..."
                                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground text-sm"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleFetchPrice}
                                    disabled={!sourceUrl || isFetching}
                                    className="px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg font-medium text-sm hover:bg-primary/20 disabled:opacity-50 transition-colors flex flex-shrink-0 items-center gap-2"
                                >
                                    {isFetching ? <RefreshCw size={16} className="animate-spin" /> : <span>Kuru Çek</span>}
                                </button>
                            </div>
                            {fetchError && <p className="text-xs text-destructive mt-1">{fetchError}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Miktar (TL veya Döviz Adedi)
                            </label>
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
                            <label className="text-sm font-medium text-foreground">
                                Kur Çarpanı (TL ise boş bırakın veya 1 yazın)
                            </label>
                            <input
                                type="number"
                                step="any"
                                min="0"
                                value={currentPrice}
                                onChange={(e) => setCurrentPrice(e.target.value)}
                                placeholder="Varsayılan: 1 (TL)"
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
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
        </div>
    );
}
