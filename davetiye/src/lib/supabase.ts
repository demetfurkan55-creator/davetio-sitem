import { createBrowserClient } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return { url, anonKey };
}

/**
 * Tarayıcıda (Client Components) kullanım — oturum çerezleri tarayıcıda yönetilir.
 */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}

/**
 * Sunucuda (Server Components, Server Actions) kullanım — Next.js çerezleri ile oturum.
 */
export async function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /* Server-only render sırasında set edilemeyebilir; Route Handler’da tekrar deneyin. */
        }
      },
    },
  });
}

/**
 * Sunucu tarafında çerez gerektirmeyen, salt okuma veya servis işleri için `@supabase/supabase-js` istemcisi.
 * Yönetici anahtarı ile kullanım için `SUPABASE_SERVICE_ROLE_KEY` tanımlayıp `createSupabaseServiceRoleClient` kullanın.
 */
export function createSupabaseAnonClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseEnv();
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Yalnızca güvenilir sunucu ortamında; asla istemciye sızdırmayın. */
export function createSupabaseServiceRoleClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
