
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage("Password harus minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const { data: { user }, error: sessionError } =
        await supabase.auth.getUser();

      if (sessionError || !user) {
        setErrorMessage(
          "Link reset tidak valid atau sudah kedaluwarsa. Minta email reset baru."
        );
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMessage("Password belum berhasil diubah. Silakan coba lagi.");
        return;
      }

      setMessage("Password berhasil diubah! Mengarahkan ke halaman login...");

      await supabase.auth.signOut();
      router.replace("/admin/login");
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">AYRIRA</h1>
          <p className="mt-2 text-gray-500">Buat Password Baru</p>
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password baru
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Minimal 8 karakter"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
            Ulangi password baru
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Ulangi password"
          />
        </div>

        {errorMessage && (
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        {message && (
          <p role="status" className="text-sm text-green-700">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black p-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : "Simpan Password Baru"}
        </button>
      </form>
    </main>
  );
}
