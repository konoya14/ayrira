"use client";

import { useMemo, useState } from "react";
import { formatRupiah, samplePackages, sampleProducts, type Product } from "@/lib/catalog";

export default function Home() {
const [search, setSearch] = useState("");
const [category, setCategory] = useState("Semua");
const [selected, setSelected] = useState<Product | null>(null);
const [pack, setPack] = useState(samplePackages[0]);
const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6289602172127";

const categories = ["Semua", ...Array.from(new Set(sampleProducts.map(p => p.category)))];
const filtered = useMemo(() => sampleProducts.filter(p =>
(category === "Semua" || p.category === category) &&
(p.name + " " + p.category).toLowerCase().includes(search.toLowerCase())
), [search, category]);

function order(product: Product) {
const message = [
"Halo Ayrira, aku mau order!",
"",
"Produk: ${product.name}",
"Paket: ${pack.label}",
"Harga: ${formatRupiah(pack.price)}",
"Total: ${formatRupiah(pack.price)}",
"",
"Mohon info langkah selanjutnya ya. Terima kasih!"
].join("\n");
window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");

return <main>
<header className="nav wrap">
<a className="brand" href="#"><span className="brand-mark">A</span><span>Ayrira<small>PREMIUM DIGITAL STORE</small></span></a>
<nav><a href="#katalog">Katalog</a><a href="#testimoni">Testimoni</a><a href="#tentang">Tentang</a></nav>
<a className="nav-cta" href="#katalog">Jelajahi ↗</a>
</header>

<section className="hero wrap">
  <div className="hero-copy">
    <span className="eyebrow"><i /> YOUR DIGITAL ESSENTIALS</span>
    <h1>Digital favorites,<br/><em>made simpler.</em></h1>
    <p>Temukan pilihan produk digital favoritmu dengan proses pemesanan yang praktis dan ramah.</p>
    <a className="button" href="#katalog">Lihat katalog <span>↗</span></a>
    <div className="trust"><span>✓ Pilihan produk terkurasi</span><span>✓ Order praktis via WhatsApp</span></div>
  </div>
  <div className="hero-art" aria-label="Ilustrasi kartu produk digital">
    <div className="orb orb-one"/><div className="orb orb-two"/>
    <div className="floating-card card-a"><span>✳</span><b>Creative</b><small>Make something great</small></div>
    <div className="floating-card card-b"><span>♫</span><b>Your soundtrack</b><small>For every moment</small></div>
    <div className="hero-center"><span>A</span><b>AYRIRA</b><small>BETTER DIGITAL DAYS</small></div>
    <div className="spark spark-a">✦</div><div className="spark spark-b">✳</div>
  </div>
</section>

<section className="benefits wrap">
  <div><span>01</span><p><b>Simple catalog</b><small>Temukan produk dengan mudah</small></p></div>
  <div><span>02</span><p><b>Clear pricing</b><small>Harga paket ditampilkan jelas</small></p></div>
  <div><span>03</span><p><b>Chat to order</b><small>Lanjutkan pesanan via WhatsApp</small></p></div>
</section>

<section className="catalog wrap" id="katalog">
  <div className="section-heading"><div><span className="eyebrow">CURATED FOR YOU</span><h2>Temukan favoritmu.</h2><p>Jelajahi katalog digital Ayrira.</p></div><span className="catalog-count">{filtered.length} produk</span></div>
  <div className="filters">
    <label className="search"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari aplikasi atau kategori..." aria-label="Cari produk"/></label>
    <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter kategori">{categories.map(c => <option key={c}>{c}</option>)}</select>
  </div>
  <div className="products">
    {filtered.map((product, i) => <article className="product" key={product.id}>
      <div className={`product-icon icon-${i % 5}`}><span>{product.image}</span></div>
      <div className="product-meta"><span>{product.category}</span>{product.popular && <b>POPULER</b>}</div>
      <h3>{product.name}</h3><p>{product.description}</p>
      <div className="product-bottom"><div><small>Mulai dari</small><strong>{formatRupiah(product.startingPrice)}</strong></div><button onClick={() => { setSelected(product); setPack(samplePackages[0]); }} className="details">Lihat paket ↗</button></div>
    </article>)}
    {filtered.length === 0 && <div className="empty">Produk tidak ditemukan. Coba kata kunci lain.</div>}
  </div>
</section>

<section className="testimonial wrap" id="testimoni">
  <div><span className="eyebrow">KATA MEREKA</span><h2>Pengalaman yang<br/><em>lebih sederhana.</em></h2><p>Area testimoni akan menampilkan ulasan pelanggan yang sudah diverifikasi admin.</p></div>
  <div className="quote"><span>“</span><p>Testimoni pelanggan akan tampil di sini setelah toko mulai menerima ulasan.</p><small>— Preview testimoni Ayrira</small></div>
</section>

<section className="bottom-cta wrap" id="tentang"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Temukan yang kamu butuhkan.</h2><p>Pilih produk, tentukan paket, dan lanjutkan melalui WhatsApp.</p></div><a className="button light" href="#katalog">Jelajahi katalog ↗</a></section>
<footer className="footer wrap"><a className="brand" href="#"><span className="brand-mark">A</span><span>Ayrira<small>PREMIUM DIGITAL STORE</small></span></a><span>© {new Date().getFullYear()} Ayrira. Made for better digital days.</span><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">Hubungi kami ↗</a></footer>

{selected && <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}>
  <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => e.stopPropagation()}>
    <button className="close" onClick={() => setSelected(null)} aria-label="Tutup">×</button>
    <span className="eyebrow">PILIH PAKET</span><div className="modal-icon">{selected.image}</div><h2 id="modal-title">{selected.name}</h2><p>{selected.description}</p>
    <label className="field-label" htmlFor="package">Durasi paket</label>
    <select id="package" value={pack.id} onChange={e => setPack(samplePackages.find(p => p.id === e.target.value) || samplePackages[0])}>{samplePackages.map(p => <option key={p.id} value={p.id}>{p.label} — {formatRupiah(p.price)}</option>)}</select>
    <div className="total"><span>Total sementara</span><strong>{formatRupiah(pack.price)}</strong></div>
    <p className="disclaimer">Harga di atas adalah data contoh. Pastikan paket dan harga telah kamu sesuaikan sebelum website dipublikasikan untuk pelanggan.</p>
    <button className="button order-button" onClick={() => order(selected)}>Lanjut order via WhatsApp ↗</button>
  </section>
</div>}

  </main>;
}
