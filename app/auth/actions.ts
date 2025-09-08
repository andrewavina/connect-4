'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; // your server client

export async function signOut() {
  const supabase = await createClient();
  console.log('signOut: ', supabase);
  // await supabase.auth.signOut(); // default 'global'
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    redirect('/'); // or "/login"
  }
}
