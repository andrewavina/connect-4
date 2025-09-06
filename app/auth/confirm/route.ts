// app/auth/confirm/route.ts
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = (searchParams.get('type') ?? 'email') as EmailOtpType;
  const next = searchParams.get('next') ?? '/game';

  if (!token_hash) redirect('/login?error=invalid_link');

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash });

  if (!error) redirect(next);
  redirect('/login?error=expired_or_invalid');
}
