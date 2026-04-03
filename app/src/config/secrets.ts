import * as SecureStore from 'expo-secure-store';

export async function getSupabaseUrl(): Promise<string> {
  const value = await SecureStore.getItemAsync('SUPABASE_URL');
  if (!value) throw new Error('Supabase URL not configured');
  return value;
}

export async function getSupabaseAnonKey(): Promise<string> {
  const value = await SecureStore.getItemAsync('SUPABASE_ANON_KEY');
  if (!value) throw new Error('Supabase anon key not configured');
  return value;
}

export async function getClaudeApiKey(): Promise<string> {
  const value = await SecureStore.getItemAsync('CLAUDE_API_KEY');
  if (!value) throw new Error('Claude API key not configured');
  return value;
}

export async function getWhisperApiKey(): Promise<string> {
  const value = await SecureStore.getItemAsync('WHISPER_API_KEY');
  if (!value) throw new Error('Whisper API key not configured');
  return value;
}

export async function getElevenLabsApiKey(): Promise<string> {
  const value = await SecureStore.getItemAsync('ELEVENLABS_API_KEY');
  if (!value) throw new Error('ElevenLabs API key not configured');
  return value;
}
