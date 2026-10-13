import Link from "next/link";

export default function NotFound() {
return (
<main className="wrap" style={{ padding: "100px 0" }}>
<span className="eyebrow">404 — NOT FOUND</span>
<h1>Halaman tidak ditemukan.</h1>
<p>Sepertinya halaman yang kamu cari belum tersedia.</p>
<Link className="button" href="/">
Kembali ke beranda ↗
</Link>
</main>
);
}
