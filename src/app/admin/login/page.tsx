
"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert("Login Supabase akan dihubungkan pada langkah berikutnya.");
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

        <button
          type="submit"
          className="w-full rounded-lg bg-black p-3 font-semibold text-white"
        >
          Masuk
        </button>

        <p className="text-center text-xs text-gray-500">
          Area khusus administrator AYRIRA
        </p>
      </form>
    </main>
  );
}
