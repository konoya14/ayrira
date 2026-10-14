
import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!rawSupabaseUrl || !supabaseKey) {
  throw new Error("Konfigurasi Supabase belum lengkap.");
}

// Ambil URL dasar saja, tanpa /rest/v1 atau path lainnya.
const supabaseUrl = new URL(rawSupabaseUrl).origin;

export const supabase = createClient(supabaseUrl, supabaseKey);
