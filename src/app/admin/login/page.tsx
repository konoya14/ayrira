
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErrorMessage("");
    setNotice("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage("Login gagal. Periksa email dan password kamu.");
        return;
      }

      router.replace("/admin/dashboard");
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setErrorMessage("");
    setNotice("");

    if (!email.trim()) {
      setErrorMessage("Masukkan email admin terlebih dahulu.");
      return;
    }

    setResetLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        }
      );

     
if (error) {
  setErrorMessage(`Gagal: ${error.message}`);
  return;
}


      setNotice(
        "Jika email terdaftar, instruksi reset password akan dikirim. Periksa inbox dan folder spam."
      );
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setResetLoading(false);
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
          <p className="mt-2 text-gray-500">Admin Login</p>
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email admin
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Email admin"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Password"
          />
        </div>

        {errorMessage && (
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        {notice && (
          <p role="status" className="text-sm text-green-700">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || resetLoading}
          className="w-full rounded-lg bg-black p-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

        <button
          type="button"
          onClick={handleResetPassword}
          disabled={loading || resetLoading}
          className="w-full text-sm font-medium text-blue-700 underline disabled:opacity-60"
        >
          {resetLoading ? "Mengirim email..." : "Lupa password?"}
        </button>

        <p className="text-center text-xs text-gray-500">
          Area khusus administrator AYRIRA
        </p>
      </form>
    </main>
  );
}
