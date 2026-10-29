import { supabase, supabaseUrl } from '../lib/supabase';
import { Order, FoodItem } from '../types';

export const SUPABASE_SQL_SCHEMA = `-- CampusBite Supabase Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/rfqwtgfjjhdcljfynoek/sql)

-- 1. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    token TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_phone TEXT,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    gst_amount NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    final_total NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    razorpay_payment_id TEXT,
    pickup_slot TEXT NOT NULL,
    status TEXT NOT NULL,
    prep_time_est_min INTEGER DEFAULT 10,
    counter_number TEXT,
    rating INTEGER,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & allow public anon inserts and reads for demo applet
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on orders"
ON public.orders FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow public insert on orders"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public update on orders"
ON public.orders FOR UPDATE
TO anon, authenticated
USING (true);

-- 2. Create Student Feedback Table
CREATE TABLE IF NOT EXISTS public.order_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    student_name TEXT,
    rating INTEGER NOT NULL,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on order_feedback"
ON public.order_feedback FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public select on order_feedback"
ON public.order_feedback FOR SELECT
TO anon, authenticated
USING (true);
`;

export interface SupabaseSyncStatus {
  connected: boolean;
  message: string;
  isTableReady: boolean;
}

/**
 * Checks connection to the user's Supabase project
 */
export async function testSupabaseConnection(): Promise<SupabaseSyncStatus> {
  try {
    const { data, error } = await supabase.from('orders').select('id').limit(1);

    if (error) {
      // If table doesn't exist yet (PGRST204 or 42P01), connection succeeded but table is missing
      if (error.code === '42P01' || error.message.includes('relation "public.orders" does not exist') || error.message.includes('schema cache')) {
        return {
          connected: true,
          isTableReady: false,
          message: 'Connected to Supabase project rfqwtgfjjhdcljfynoek. The "orders" table has not been created yet in SQL editor.',
        };
      }
      return {
        connected: false,
        isTableReady: false,
        message: `Supabase connection response: ${error.message}`,
      };
    }

    return {
      connected: true,
      isTableReady: true,
      message: 'Connected to Supabase project rfqwtgfjjhdcljfynoek. Database table "orders" is active and receiving live orders!',
    };
  } catch (err: any) {
    return {
      connected: false,
      isTableReady: false,
      message: err?.message || 'Could not reach Supabase endpoint',
    };
  }
}

/**
 * Syncs a placed order into Supabase
 */
export async function syncOrderToSupabase(order: Order): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: order.id,
      token: order.token,
      student_name: order.studentName,
      student_email: order.studentEmail,
      student_phone: order.studentPhone,
      items: order.items,
      subtotal: order.subtotal,
      gst_amount: order.gstAmount,
      discount: order.discount,
      final_total: order.finalTotal,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      razorpay_payment_id: order.razorpayPaymentId || null,
      pickup_slot: order.pickupSlot,
      status: order.status,
      prep_time_est_min: order.prepTimeEstMin,
      counter_number: order.counterNumber,
      created_at: order.createdAt,
    };

    const { error } = await supabase.from('orders').insert([payload]);

    if (error) {
      console.warn('Supabase sync notice:', error.message);
      return { success: false, error: error.message };
    }

    console.log(`[Supabase] Successfully saved order ${order.token} to cloud database!`);
    return { success: true };
  } catch (err: any) {
    console.warn('Supabase order sync error:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Updates order status in Supabase (accepted, preparing, ready, collected)
 */
export async function syncOrderStatusToSupabase(
  orderId: string,
  status: string,
  extra?: { rating?: number; feedback?: string }
): Promise<void> {
  try {
    const updatePayload: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (extra?.rating !== undefined) updatePayload.rating = extra.rating;
    if (extra?.feedback !== undefined) updatePayload.feedback = extra.feedback;

    const { error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId);

    if (error) {
      console.warn('Supabase status update notice:', error.message);
    } else {
      console.log(`[Supabase] Updated order ${orderId} status to "${status}" in cloud!`);
    }
  } catch (err) {
    console.warn('Supabase update failed:', err);
  }
}
