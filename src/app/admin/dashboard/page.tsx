"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Product = {
id: string;
name: string;
description: string;
price: number;
image_url: string | null;
is_active: boolean;
created_at: string;
};

const emptyForm = {
name: "",
description: "",
price: "",
image_url: "",
is_active: true,
};

export default function AdminDashboardPage() {
const router = useRouter();

const [email, setEmail] = useState("");
const [checking, setChecking] = useState(true);
const [isAdmin, setIsAdmin] = useState(false);
const [products, setProducts] = useState<Product[]>([]);
const [loadingProducts, setLoadingProducts] = useState(false);
const [saving, setSaving] = useState(false);
const [message, setMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");
const [form, setForm] = useState(emptyForm);
const [editingId, setEditingId] = useState<string | null>(null);

const loadProducts = useCallback(async () => {
setLoadingProducts(true);
setErrorMessage("");

try {  
  const { data, error } = await supabase  
    .from("products")  
    .select("*")  
    .order("created_at", { ascending: false });  

  if (error) throw error;  

  setProducts((data ?? []) as Product[]);  
} catch {  
  setErrorMessage("Produk gagal dimuat. Periksa koneksi database.");  
} finally {  
  setLoadingProducts(false);  
}

}, []);

useEffect(() => {
let active = true;

async function checkAccess() {  
  try {  
    const { data, error } = await supabase.auth.getUser();  

    if (!active) return;  

    if (error || !data.user) {  
      router.replace("/admin/login");  
      return;  
    }  

    setEmail(data.user.email ?? "");  

    const { data: membership, error: membershipError } =  
      await supabase  
        .from("admin_users")  
        .select("user_id")  
        .eq("user_id", data.user.id)  
        .maybeSingle();  

    if (!active) return;  

    if (membershipError || !membership) {  
      setIsAdmin(false);  
      setChecking(false);  
      return;  
    }  

    setIsAdmin(true);  
    setChecking(false);  
    await loadProducts();  
  } catch {  
    if (!active) return;  
    setErrorMessage("Gagal memeriksa akses admin. Coba muat ulang.");  
    setChecking(false);  
  }  
}  

void checkAccess();  

return () => {  
  active = false;  
};

}, [router, loadProducts]);

async function handleLogout() {
await supabase.auth.signOut();
router.replace("/admin/login");
}

function resetForm() {
setForm(emptyForm);
setEditingId(null);
setMessage("");
setErrorMessage("");
}

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
event.preventDefault();
setSaving(true);
setMessage("");
setErrorMessage("");

const price = Number(form.price);  

if (!form.name.trim() || form.price.trim() === "" ||  
    !Number.isFinite(price) || price < 0) {  
  setErrorMessage("Isi nama dan harga produk dengan benar.");  
  setSaving(false);  
  return;  
}  

const payload = {  
  name: form.name.trim(),  
  description: form.description.trim(),  
  price,  
  image_url: form.image_url.trim() || null,  
  is_active: form.is_active,  
};  

try {  
  const result = editingId  
    ? await supabase  
        .from("products")  
        .update(payload)  
        .eq("id", editingId)  
    : await supabase.from("products").insert(payload);  

  if (result.error) throw result.error;  

  setMessage(editingId ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!");  
  setForm(emptyForm);  
  setEditingId(null);  
  await loadProducts();  
} catch {  
  setErrorMessage("Gagal menyimpan produk. Periksa koneksi dan hak akses database.");  
} finally {  
  setSaving(false);  
}

}

function startEdit(product: Product) {
setEditingId(product.id);
setForm({
name: product.name,
description: product.description ?? "",
price: String(product.price),
image_url: product.image_url ?? "",
is_active: product.is_active,
});
setMessage("");
setErrorMessage("");
window.scrollTo({ top: 0, behavior: "smooth" });
}

async function toggleProduct(product: Product) {
setMessage("");
setErrorMessage("");

const { error } = await supabase  
  .from("products")  
  .update({ is_active: !product.is_active })  
  .eq("id", product.id);  

if (error) {  
  setErrorMessage("Status produk gagal diubah.");  
  return;  
}  

setMessage("Status produk berhasil diubah.");  
await loadProducts();

}

async function deleteProduct(product: Product) {
if (!window.confirm(Hapus produk "${product.name}"?)) return;

setMessage("");  
setErrorMessage("");  

const { error } = await supabase  
  .from("products")  
  .delete()  
  .eq("id", product.id);  

if (error) {  
  setErrorMessage("Produk gagal dihapus.");  
  return;  
}  

setMessage("Produk berhasil dihapus.");  
if (editingId === product.id) resetForm();  
await loadProducts();

}

if (checking) {
return (
<main className="flex min-h-screen items-center justify-center">
Memeriksa login dan akses admin...
</main>
);
}

if (!isAdmin) {
return (
<main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
<section className="max-w-md rounded-2xl border bg-white p-6 text-center">
<h1 className="text-xl font-bold">Akses admin ditolak</h1>
<p className="mt-3 text-gray-600">
Akun ini belum terdaftar sebagai admin AYRIRA.
</p>
<button  
onClick={handleLogout}  
className="mt-5 rounded-lg bg-black px-4 py-2 text-white"  
>
Keluar
</button>
</section>
</main>
);
}

return (
<main className="min-h-screen bg-gray-50 p-6">
<div className="mx-auto max-w-5xl space-y-6">
<header className="flex flex-wrap items-center justify-between gap-4">
<div>
<h1 className="text-2xl font-bold">AYRIRA Admin</h1>
<p className="mt-1 text-sm text-gray-500">{email}</p>
</div>
<button  
onClick={handleLogout}  
className="rounded-lg border bg-white px-4 py-2"  
>
Keluar
</button>
</header>

<section className="rounded-2xl border bg-white p-6">  
      <h2 className="text-xl font-semibold">  
        {editingId ? "Edit Produk" : "Tambah Produk"}  
      </h2>  

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">  
        <div>  
          <label htmlFor="product-name" className="mb-1 block text-sm font-medium">  
            Nama produk  
          </label>  
          <input  
            id="product-name"  
            required  
            value={form.name}  
            onChange={(e) => setForm({ ...form, name: e.target.value })}  
            className="w-full rounded-lg border p-3"  
            placeholder="Contoh: Paket Premium"  
          />  
        </div>  

        <div>  
          <label htmlFor="product-description" className="mb-1 block text-sm font-medium">  
            Deskripsi  
          </label>  
          <textarea  
            id="product-description"  
            value={form.description}  
            onChange={(e) => setForm({ ...form, description: e.target.value })}  
            className="w-full rounded-lg border p-3"  
            rows={3}  
            placeholder="Deskripsi produk"  
          />  
        </div>  

        <div>  
          <label htmlFor="product-price" className="mb-1 block text-sm font-medium">  
            Harga (Rupiah)  
          </label>  
          <input  
            id="product-price"  
            type="number"  
            min="0"  
            step="1"  
            required  
            value={form.price}  
            onChange={(e) => setForm({ ...form, price: e.target.value })}  
            className="w-full rounded-lg border p-3"  
            placeholder="Contoh: 25000"  
          />  
        </div>  

        <div>  
          <label htmlFor="product-image" className="mb-1 block text-sm font-medium">  
            URL gambar (opsional)  
          </label>  
          <input  
            id="product-image"  
            type="url"  
            value={form.image_url}  
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}  
            className="w-full rounded-lg border p-3"  
            placeholder="https://..."  
          />  
        </div>  

        <label className="flex items-center gap-2 text-sm">  
          <input  
            type="checkbox"  
            checked={form.is_active}  
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}  
          />  
          Produk aktif dan boleh ditampilkan  
        </label>  

        <div className="flex flex-wrap gap-3">  
          <button  
            type="submit"  
            disabled={saving}  
            className="rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-60"  
          >  
            {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Produk"}  
          </button>  

          {editingId && (  
            <button  
              type="button"  
              onClick={resetForm}  
              className="rounded-lg border px-5 py-3"  
            >  
              Batal Edit  
            </button>  
          )}  
        </div>  
      </form>  
    </section>  

    {message && (  
      <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">  
        {message}  
      </p>  
    )}  

    {errorMessage && (  
      <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">  
        {errorMessage}  
      </p>  
    )}  

    <section className="rounded-2xl border bg-white p-6">  
      <div className="flex flex-wrap items-center justify-between gap-3">  
        <h2 className="text-xl font-semibold">  
          Daftar Produk ({products.length})  
        </h2>  
        <button  
          onClick={() => void loadProducts()}  
          disabled={loadingProducts}  
          className="rounded-lg border px-4 py-2 disabled:opacity-60"  
        >  
          {loadingProducts ? "Memuat..." : "Muat Ulang"}  
        </button>  
      </div>  

      {loadingProducts && products.length === 0 ? (  
        <p className="mt-5 text-gray-500">Memuat produk...</p>  
      ) : products.length === 0 ? (  
        <p className="mt-5 text-gray-500">  
          Belum ada produk. Tambahkan produk pertama lewat formulir di atas.  
        </p>  
      ) : (  
        <div className="mt-5 space-y-4">  
          {products.map((product) => (  
            <article  
              key={product.id}  
              className="rounded-xl border p-4"  
            >  
              <div className="flex flex-col justify-between gap-4 sm:flex-row">  
                <div className="min-w-0">  
                  <h3 className="font-semibold">{product.name}</h3>  
                  <p className="mt-1 text-sm text-gray-600">  
                    {product.description || "Tidak ada deskripsi"}  
                  </p>  
                  <p className="mt-2 font-medium">  
                    {new Intl.NumberFormat("id-ID", {  
                      style: "currency",  
                      currency: "IDR",  
                      maximumFractionDigits: 0,  
                    }).format(Number(product.price))}  
                  </p>  
                  <p className="mt-1 text-xs text-gray-500">  
                    Status: {product.is_active ? "Aktif" : "Nonaktif"}  
                  </p>  
                </div>  

                <div className="flex flex-wrap items-start gap-2">  
                  <button  
                    onClick={() => startEdit(product)}  
                    className="rounded-lg border px-3 py-2 text-sm"  
                  >  
                    Edit  
                  </button>  
                  <button  
                    onClick={() => void toggleProduct(product)}  
                    className="rounded-lg border px-3 py-2 text-sm"  
                  >  
                    {product.is_active ? "Nonaktifkan" : "Aktifkan"}  
                  </button>  
                  <button  
                    onClick={() => void deleteProduct(product)}  
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700"  
                  >  
                    Hapus  
                  </button>  
                </div>  
              </div>  
            </article>  
          ))}  
        </div>  
      )}  
    </section>  
  </div>  
</main>

);
}
