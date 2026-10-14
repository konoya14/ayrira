
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatRupiah,
  samplePackages,
  type Product,
} from "@/lib/catalog";
import { supabase } from "@/lib/supabase";

type DatabaseProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  is_active: boolean;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [selected, setSelected] = useState<Product | null>(null);
  const [pack, setPack] = useState(samplePackages[0]);

  const whatsapp =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6289602172127";

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, description, price, image_url, is_active")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal memuat produk:", error.message);
        setLoadError("Produk belum bisa dimuat. Silakan coba lagi.");
        setProducts([]);
      } else {
        const rows = (data ?? []) as DatabaseProduct[];

        setProducts(
          rows.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            category: "Produk Digital",
            image: item.image_url || "✳",
            image_url: item.image_url,
            startingPrice: Number(item.price),
            popular: false,
            is_active: item.is_active,
          }))
        );
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  const categories = [
    "Semua",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "Semua" || p.category === category) &&
          (p.name + " " + p.category)
            .toLowerCase()
            .includes(search.toLowerCase())
      ),
    [products, search, category]
  );

  function order(product: Product) {
    const message = [
      "Halo Ayrira, aku mau order!",
      "",
      `Produk: ${product.name}`,
      `Durasi: ${pack.label}`,
      `Harga produk di katalog: ${formatRupiah(product.startingPrice)}`,
      `Harga paket yang dipilih: ${formatRupiah(pack.price)}`,
      "",
      "Mohon konfirmasi harga dan ketersediaan paket sebelum pembayaran. Terima kasih!",
    ].join("\n");

    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main>
      <header className="nav wrap">
        <a className="brand" href="#">
          <span className="brand-mark">A</span>
          <span>Ayrira<small>PREMIUM DIGITAL STORE</small></span>
        </a>
        <nav>
          <a href="#katalog">Katalog</a>
          <a href="#testimoni">Testimoni</a>
          <a href="#tentang">Tentang</a>
        </nav>
        <a className="nav-cta" href="#katalog">Jelajahi ↗</a>
      </header>

      <section className="hero wrap">
        <div className="hero-copy">
          <span className="eyebrow"><i /> YOUR DIGITAL ESSENTIALS</span>
          <h1>Digital favorites,<br /><em>made simpler.</em></h1>
          <p>Temukan pilihan produk digital favoritmu dengan proses pemesanan yang praktis dan ramah.</p>
          <a className="button" href="#katalog">Lihat katalog <span>↗</span></a>
          <div className="trust">
            <span>✓ Pilihan produk terkurasi</span>
            <span>✓ Order praktis via WhatsApp</span>
          </div>
        </div>
        <div className="hero-art" aria-label="Ilustrasi kartu produk digital">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="floating-card card-a">
            <span>✳</span><b>Creative</b><small>Make something great</small>
          </div>
          <div className="floating-card card-b">
            <span>♫</span><b>Your soundtrack</b><small>For every moment</small>
          </div>
          <div className="hero-center">
            <span>A</span><b>AYRIRA</b><small>BETTER DIGITAL DAYS</small>
          </div>
          <div className="spark spark-a">✦</div>
          <div className="spark spark-b">✳</div>
        </div>
      </section>

      <section className="benefits wrap">
        <div><span>01</span><p><b>Simple catalog</b><small>Temukan produk dengan mudah</small></p></div>
        <div><span>02</span><p><b>Clear pricing</b><small>Harga paket ditampilkan jelas</small></p></div>
        <div><span>03</span><p><b>Chat to order</b><small>Lanjutkan pesanan via WhatsApp</small></p></div>
      </section>

      <section className="catalog wrap" id="katalog">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CURATED FOR YOU</span>
            <h2>Temukan favoritmu.</h2>
            <p>Jelajahi katalog digital Ayrira.</p>
          </div>
          <span className="catalog-count">
            {loading ? "Memuat..." : `${filtered.length} produk`}
          </span>
        </div>

        <div className="filters">
          <label className="search">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari aplikasi atau kategori..."
              aria-label="Cari produk"
            />
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter kategori"
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="products">
          {loading && <div className="empty">Sedang memuat produk...</div>}
          {!loading && loadError && (
            <div className="empty">
              <p>{loadError}</p>
              <button onClick={() => window.location.reload()}>Coba lagi</button>
            </div>
          )}
          {!loading && !loadError && filtered.map((product, i) => (
            <article className="product" key={product.id}>
              <div className={`product-icon icon-${i % 5}`}>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "inherit",
                    }}
                  />
                ) : <span>{product.image}</span>}
              </div>
              <div className="product-meta">
                <span>{product.category}</span>
                {product.popular && <b>POPULER</b>}
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-bottom">
                <div>
                  <small>Harga produk</small>
                  <strong>{formatRupiah(product.startingPrice)}</strong>
                </div>
                <button
                  className="details"
                  onClick={() => {
                    setSelected(product);
                    setPack({
                      id: samplePackages[0].id,
                      label: samplePackages[0].label,
                      price: product.startingPrice,
                    });
                  }}
                >
                  Lihat paket ↗
                </button>
              </div>
            </article>
          ))}
          {!loading && !loadError && filtered.length === 0 && (
            <div className="empty">Belum ada produk aktif. Coba lagi nanti ya!</div>
          )}
        </div>
      </section>

      <section className="testimonial wrap" id="testimoni">
        <div>
          <span className="eyebrow">KATA MEREKA</span>
          <h2>Pengalaman yang<br /><em>lebih sederhana.</em></h2>
          <p>Area testimoni akan menampilkan ulasan pelanggan yang sudah diverifikasi admin.</p>
        </div>
        <div className="quote">
          <span>“</span>
          <p>Testimoni pelanggan akan tampil di sini setelah toko mulai menerima ulasan.</p>
          <small>— Preview testimoni Ayrira</small>
        </div>
      </section>

      <section className="bottom-cta wrap" id="tentang">
        <div>
          <span className="eyebrow">READY WHEN YOU ARE</span>
          <h2>Temukan yang kamu butuhkan.</h2>
          <p>Pilih produk, tentukan paket, dan lanjutkan melalui WhatsApp.</p>
        </div>
        <a className="button light" href="#katalog">Jelajahi katalog ↗</a>
      </section>

      <footer className="footer wrap">
        <a className="brand" href="#">
          <span className="brand-mark">A</span>
          <span>Ayrira<small>PREMIUM DIGITAL STORE</small></span>
        </a>
        <span>© {new Date().getFullYear()} Ayrira. Made for better digital days.</span>
        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">Hubungi kami ↗</a>
      </footer>

      {selected && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close" onClick={() => setSelected(null)} aria-label="Tutup">×</button>
            <span className="eyebrow">PILIH PAKET</span>
            <div className="modal-icon">
              {selected.image_url ? (
                <img
                  src={selected.image_url}
                  alt={selected.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "inherit",
                  }}
                />
              ) : selected.image}
            </div>
            <h2 id="modal-title">{selected.name}</h2>
            <p>{selected.description}</p>

            <label className="field-label" htmlFor="package">Durasi paket</label>
            <select
              id="package"
              value={pack.id}
              onChange={(e) =>
                setPack(samplePackages.find((p) => p.id === e.target.value) || samplePackages[0])
              }
            >
              {samplePackages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} — {formatRupiah(p.price)}
                </option>
              ))}
            </select>

            <div className="total">
              <span>Total sementara</span>
              <strong>{formatRupiah(pack.price)}</strong>
            </div>
            <p className="disclaimer">
              Harga durasi masih berupa contoh. Konfirmasikan harga paket yang berlaku melalui WhatsApp sebelum pembayaran.
            </p>
            <button className="button order-button" onClick={() => order(selected)}>
              Lanjut order via WhatsApp ↗
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
