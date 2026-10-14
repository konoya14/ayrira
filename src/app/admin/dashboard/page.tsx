"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkLogin() {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user) {
        router.replace("/admin/login");
        return;
      }

      setEmail(data.user.email ?? "");
      setChecking(false);
    }

    void checkLogin();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Memeriksa login...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">AYRIRA Admin</h1>

          <button
            onClick={handleLogout}
            className="rounded-lg border bg-white px-4 py-2"
          >
            Keluar
          </button>
        </header>

        <section className="mt-8 rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-semibold">
            Selamat datang di Dashboard!
          </h2>

          <p className="mt-2 text-gray-600">
            Kamu berhasil masuk ke halaman admin AYRIRA.
          </p>

          <p className="mt-4 text-sm text-gray-500">
            Email akun: {email}
          </p>
        </section>
      </div>
    </main>
  );
}
