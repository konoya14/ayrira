
export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  startingPrice: number;
  popular?: boolean;
  image_url?: string | null;
  is_active?: boolean;
};

export const sampleProducts: Product[] = [];

export const samplePackages = [
  { id: "month-1", label: "1 Bulan", price: 15000 },
  { id: "month-3", label: "3 Bulan", price: 35000 },
  { id: "year-1", label: "1 Tahun", price: 90000 },
];

export function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}
