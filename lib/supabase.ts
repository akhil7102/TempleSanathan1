import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

let _supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  _supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
} else {
  console.warn(
    'Supabase is not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY environment variables.'
  );
}

export const supabaseClient = _supabase;

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type DbResult<T> = { data: T | null; error: Error | null };

function notConfiguredError() {
  return new Error(
    'Backend not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY and reload.'
  );
}

export async function signUp(email: string, password: string) {
  if (!supabaseClient) {
    return { data: null, error: notConfiguredError() } as const;
  }
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  if (!supabaseClient) {
    return { data: null, error: notConfiguredError() } as const;
  }
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  if (!supabaseClient) {
    return { error: notConfiguredError() } as const;
  }
  const { error } = await supabaseClient.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  if (!supabaseClient) return null;
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
}

export async function submitTempleSubmission(templeData: any) {
  if (!supabaseClient) {
    return { data: null, error: notConfiguredError() } as const;
  }
  const { data: userRes } = await supabaseClient.auth.getUser();
  const submitted_by = userRes.user?.id || null;
  if (!submitted_by) {
    return { data: null, error: new Error('Please sign in to submit a temple.') } as const;
  }
  const { data, error } = await supabaseClient
    .from('temple_submissions')
    .insert([{ temple_data: templeData, status: 'pending', submitted_by }])
    .select()
    .single();
  return { data, error };
}