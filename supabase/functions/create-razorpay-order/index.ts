import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const plans: Record<string, { amount: number; duration: number; name: string }> = {
  monthly: { amount: 5, duration: 30, name: 'Monthly Premium' },
  quarterly: { amount: 10, duration: 90, name: 'Quarterly Premium' },
  yearly: { amount: 19, duration: 365, name: 'Yearly Premium' },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID');
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error("Razorpay keys not configured");
      return new Response(
        JSON.stringify({ error: "Payment system not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { planId, callbackUrl } = await req.json();
    const plan = plans[planId];
    
    if (!plan) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    // Create a Razorpay Payment Link - works on all platforms (mobile, web, Capacitor, all countries)
    const paymentLinkData = {
      amount: plan.amount * 100, // Amount in smallest currency unit (cents for USD)
      currency: 'USD',
      accept_partial: false,
      description: plan.name,
      customer: {
        email: user.email || '',
      },
      notify: {
        email: true,
      },
      reminder_enable: false,
      notes: {
        user_id: user.id,
        plan_id: planId,
      },
      callback_url: callbackUrl || '',
      callback_method: 'get',
    };

    console.log('Creating payment link for user:', user.id, 'plan:', planId);

    const response = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentLinkData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Razorpay payment link error:', data);
      return new Response(
        JSON.stringify({ error: data.error?.description || 'Failed to create payment link' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!data.short_url) {
      console.error('No short_url in response:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to generate payment URL' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Payment link created:', data.id);

    // Store the payment link reference for verification later
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    await adminClient.from('subscriptions').insert({
      user_id: user.id,
      plan: planId,
      status: 'pending',
      amount: plan.amount,
      currency: 'USD',
      starts_at: new Date().toISOString(),
      expires_at: new Date().toISOString(), // Will be updated on payment confirmation
      razorpay_order_id: data.id, // Store payment link ID
    });

    return new Response(
      JSON.stringify({
        paymentUrl: data.short_url,
        paymentLinkId: data.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error.message || error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
