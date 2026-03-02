export async function fetchPriceFromUrl(url: string): Promise<number | null> {
    try {
        if (!url) return null;

        // Use allorigins to bypass CORS
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const html = data.contents;

        if (!html) return null;

        // Parse HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        let priceText: string | null = null;

        // Specific logic for Bigpara
        if (url.includes('bigpara.hurriyet.com.tr')) {
            // Bigpara usually stores the main price in an element with class 'value' or inside `.kurDetail span.value`
            const priceElement =
                doc.querySelector('.kurBox .value') ||
                doc.querySelector('.kurDetail .value') ||
                doc.querySelector('span.value') ||
                doc.querySelector('.up') ||
                doc.querySelector('.down') ||
                doc.querySelector('.price'); // Common alternatives

            if (priceElement) {
                priceText = priceElement.textContent;
            }
        } else {
            // Generic fallback: Try to find common price classes or attributes
            const genericElement = doc.querySelector('.price, .value, [data-price], .current-price');
            if (genericElement) {
                priceText = genericElement.getAttribute('data-price') || genericElement.textContent;
            }
        }

        if (priceText) {
            // Parse string like "315,50" or "3.150,00" to float 315.50 / 3150.00
            let cleanedText = priceText.replace(/TL/gi, '').replace(/TRY/gi, '').trim();

            // If contains both dot and comma (e.g. 1.234,56), remove dot and replace comma with dot
            if (cleanedText.includes('.') && cleanedText.includes(',')) {
                cleanedText = cleanedText.replace(/\./g, '').replace(',', '.');
            }
            // If only comma exists (e.g. 315,50), replace with dot
            else if (cleanedText.includes(',') && !cleanedText.includes('.')) {
                cleanedText = cleanedText.replace(',', '.');
            }

            const parsedFloat = parseFloat(cleanedText);
            return isNaN(parsedFloat) ? null : parsedFloat;
        }

        return null;

    } catch (error) {
        console.error("Fiyat çekme hatası:", error);
        return null;
    }
}
