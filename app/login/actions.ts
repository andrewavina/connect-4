'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

function getOrigin() {
  // Prefer explicit site URL; fall back to Vercel URL in prod; localhost in dev
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) return site.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  if (!email) redirect('/login?error=missing_email');

  const supabase = await createClient();
  const origin = getOrigin();

  // This triggers Supabase to send the email magic link
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Where the link will land to complete sign-in:
      emailRedirectTo: `${origin}/auth/confirm?next=/game`,
      shouldCreateUser: true, // create on first sign-in
    },
  });

  if (error) {
    // don’t leak whether an email exists; just show generic UI
    redirect(`/login?sent=1`);
  }
  redirect(`/login?sent=1`);
}
