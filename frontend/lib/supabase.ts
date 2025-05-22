import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'milk-delivery-app',
    },
  },
});

export const updateBillPaymentStatus = async (billId: string, isPaid: boolean) => {
  const { error } = await supabase
    .from('bills')
    .update({ 
      isPaid,
      paidOn: isPaid ? new Date().toISOString() : null 
    })
    .eq('id', billId);

  if (error) {
    throw error;
  }
};