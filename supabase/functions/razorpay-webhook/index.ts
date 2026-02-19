import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const plans: Record<string, { duration: number }> = {
  monthly: { duration: 30 },
  quarterly: { duration: 90 },
  yearly: { duration: 365 },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!RAZORPAY_KEY_SECRET) {
      console.error("Razorpay secret not configured");
      return new Response(JSON.stringify({ error: "Not configured" }), { status: 500, headers: corsHeaders });
    }

    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    // Verify webhook signature
    if (signature) {
      const encoder = new TextEncoder();
      const key = encoder.encode(RAZORPAY_KEY_SECRET);
      const data = encoder.encode(body);
      const hmac = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
      const sig = await crypto.subtle.sign("HMAC", hmac, data);
      const expectedSignature = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');

      if (expectedSignature !== signature) {
        console.error("Invalid webhook signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400, headers: corsHeaders });
      }
    }

    const event = JSON.parse(body);
    console.log('Webhook event:', event.event);

    // Handle payment link paid event
    if (event.event === 'payment_link.paid') {
      const paymentLink = event.payload?.payment_link?.entity;
      const payment = event.payload?.payment?.entity;

      if (!paymentLink || !payment) {
        console.error('Missing payment data in webhook');
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
      }

      const userId = paymentLink.notes?.user_id;
      const planId = paymentLink.notes?.plan_id;

      if (!userId || !planId) {
        console.error('Missing user_id or plan_id in notes');
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
      }

      const plan = plans[planId];
      if (!plan) {
        console.error('Invalid plan:', planId);
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
      }

      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + plan.duration);

      // Update the pending subscription to active
      const { error: updateError } = await supabaseClient
        .from('subscriptions')
        .update({
          status: 'active',
          razorpay_payment_id: payment.id,
          starts_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .eq('razorpay_order_id', paymentLink.id)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Failed to update subscription:', updateError);
        // Fallback: create new subscription record
        await supabaseClient.from('subscriptions').insert({
          user_id: userId,
          plan: planId,
          status: 'active',
          amount: paymentLink.amount / 100,
          currency: 'USD',
          starts_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          razorpay_order_id: paymentLink.id,
          razorpay_payment_id: payment.id,
        });
      }

      console.log('Subscription activated for user:', userId, 'plan:', planId);
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: corsHeaders });
  }
});
