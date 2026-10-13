export type Product = {
id: string;
name: string;
category: string;
description: string;
image: string;
startingPrice: number;
popular?: boolean;
};

export const sampleProducts: Product[] = [
{ id: "canva", name: "Canva Premium", category: "Desain & Editing", description: "Untuk desain konten dan kebutuhan kreatif.", image: "✳", startingPrice: 15000, popular: true },
{ id: "spotify", name: "Spotify Premium", category: "Musik & Podcast", description: "Dengarkan musik favorit tanpa gangguan.", image: "♫", startingPrice: 12000, popular: true },
{ id: "capcut", name: "CapCut Pro", category: "Video Editing", description: "Perangkat bantu untuk editing video.", image: "⌁", startingPrice: 12000 },
{ id: "netflix", name: "Netflix", category: "Streaming", description: "Pilihan hiburan untuk waktu santai.", image: "N", startingPrice: 18000 },
{ id: "youtube", name: "YouTube Premium", category: "Streaming", description: "Pengalaman menonton yang lebih nyaman.", image: "▶", startingPrice: 15000 },
{ id: "cloud", name: "Cloud Storage", category: "Produktivitas", description: "Contoh produk penyimpanan digital.", image: "☁", startingPrice: 17000 },
];

export const samplePackages = [
{ id: "month-1", label: "1 Bulan", price: 15000 },
{ id: "month-3", label: "3 Bulan", price: 35000 },
{ id: "year-1", label: "1 Tahun", price: 90000 },
];

export function formatRupiah(amount: number) {
return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}
