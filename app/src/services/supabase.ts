import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseAnonKey } from '../config/secrets';

let supabaseClient: SupabaseClient | null = null;

export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (supabaseClient) return supabaseClient;
  const url = await getSupabaseUrl();
  const anonKey = await getSupabaseAnonKey();
  supabaseClient = createClient(url, anonKey);
  return supabaseClient;
}
