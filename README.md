# Ayrira — Starter Website

Starter awal untuk toko aplikasi digital Ayrira dengan Next.js (App Router), Supabase, dan Vercel.

## Isi tahap pertama
- Halaman katalog responsif dengan tema maroon, cream, dan dusty pink.
- Data katalog contoh untuk memulai.
- Skema SQL Supabase untuk profil admin, produk, paket, pesanan, testimoni, dan pengaturan toko.
- RLS (Row Level Security) untuk membatasi akses database.
- Struktur dasar untuk dikembangkan menjadi dashboard admin dan checkout WhatsApp.

> Penting: ini starter awal, belum merupakan toko siap produksi. Login admin, formulir CRUD, dan pencatatan pesanan perlu diselesaikan dan diuji sebelum menerima pesanan sungguhan. Jangan menjual akses aplikasi dengan cara yang melanggar ketentuan penyedia aplikasi.

## Jalankan melalui HP Android
Cara termudah tanpa laptop:
1. Buat akun GitHub dan buat repository baru bernama `ayrira`.
2. Unggah isi folder proyek ini ke repository. Jika sulit mengunggah banyak file dari HP, ekstrak ZIP di pengelola file lalu gunakan fitur upload file GitHub melalui browser.
3. Buat project Supabase dan buka SQL Editor.
4. Salin seluruh isi `supabase/schema.sql` ke SQL Editor, lalu jalankan.
5. Di Supabase, buka Project Settings → API (atau Connect) dan catat Project URL serta publishable/anon key.
6. Impor repository GitHub ke Vercel.
7. Di Vercel → Project Settings → Environment Variables, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL proyek Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = publishable/anon key Supabase
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` = nomor tujuan dalam format internasional tanpa `+`, contoh `62812...`
8. Deploy. Setelah berhasil, buka URL Vercel yang diberikan.

## Jalankan lokal (opsional)
Butuh Node.js 20.9+:
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Catatan keamanan
- Jangan pernah menaruh `service_role` / secret key Supabase di variabel `NEXT_PUBLIC_*` atau kode browser.
- Buat akun admin melalui Supabase Auth. Jangan membuat pendaftaran admin publik.
- Setelah membuat user admin di Supabase Auth, jalankan SQL ini dengan UUID user tersebut di SQL Editor:
```sql
insert into public.profiles (id, display_name, role)
values ('UUID_USER_ADMIN', 'Admin Ayrira', 'admin')
on conflict (id) do update set role = 'admin';
```
- Kebijakan RLS hanya memberi hak tulis kepada user yang perannya `admin`.
- Halaman dashboard belum dibangun dalam starter ini; RLS sudah disiapkan sebagai fondasi. Sebelum menambahkan dashboard, implementasikan login Supabase Auth dan pemeriksaan sesi di server.
- Harga pada browser tidak boleh dianggap sebagai sumber kebenaran. Untuk checkout nyata, server harus membaca harga dari database dan menyimpan snapshot harga ke tabel orders.
- Nomor WhatsApp dan email bukan rahasia, tetapi jangan memasukkan password, OTP, atau service role key ke chat atau repository.
