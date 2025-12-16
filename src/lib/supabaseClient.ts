//src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

// --- DATABASE CONNECTION CONFIG ---
// On Vercel, these are loaded from Environment Variables.
// Locally, it will fallback to the strings below if .env is missing (optional).

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://knveunccizkashkbkvsu.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtudmV1bmNjaXprYXNoa2JrdnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NjU0MzYsImV4cCI6MjA4MTI0MTQzNn0.grn00jklTDB5wF6xOW8-Nc_DsNaGg_T5PEX4SE4lAII';

let supabaseInstance;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Key is missing.');
  }
  // Initialize the Supabase client
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} catch (e) {
  console.error("Failed to initialize Supabase client:", e);
  
  // Safe Fallback to prevent crash
  supabaseInstance = {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ 
          data: [], 
          error: { message: 'Initialization Failed: Check Vercel Environment Variables' } 
        })
      })
    })
  } as any;
}

export const supabase = supabaseInstance;