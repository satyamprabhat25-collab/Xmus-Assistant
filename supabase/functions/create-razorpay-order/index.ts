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

const PAYMENT_TIMEOUT = 30000; // 30 seconds

async function callRazorpayWithRetry(url: string, options: RequestInit, attempt = 1): Promise<any> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PAYMENT_TIMEOUT);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      const textResponse = await response.text();
      console.error("Razorpay returned non-JSON:", textResponse.substring(0, 200));
      throw new Error("Razorpay returned an invalid response. Please try again.");
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Failed to parse Razorpay response as JSON:", parseError);
      throw new Error("Razorpay returned a malformed JSON response");
    }

    if (response.status >= 400 && response.status < 500) {
      const errorMsg = data.error?.description || data.description || `Client error: ${response.status}`;
      console.error(`Razorpay 4xx error (no retry):`, errorMsg);
      throw new Error(errorMsg);
    }

    if (!response.ok) {
      throw new Error(`Razorpay error: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.message?.includes("Client error") || error.message?.includes("invalid response")) {
      throw error;
    }

    console.error(`Razorpay error (attempt ${attempt}/3):`, error.message);

    if (attempt >= 3) {
      throw new Error(`Razorpay unavailable after 3 attempts: ${error.message}`);
    }
    await new Promise(r => setTimeout(r, 2000 * Math.pow(2, attempt - 1)));
    return callRazorpayWithRetry(url, options, attempt + 1);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate Razorpay keys first
    const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID');
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error("Razorpay keys not configured");
      return new Response(
        JSON.stringify({ 
          error: "Payment system not configured",
          details: "Please contact support"
        }),
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

    const { planId } = await req.json();
    const plan = plans[planId];
    
    if (!plan) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Razorpay order - receipt max 40 chars
    const shortId = user.id.substring(0, 8);
    const orderData = {
      amount: plan.amount * 100, // Amount in cents
      currency: 'USD',
      receipt: `rcpt_${shortId}_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan_id: planId,
      },
    };

    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    
    const order = await callRazorpayWithRetry('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!order.id) {
      console.error('Razorpay order missing ID:', order);
      return new Response(
        JSON.stringify({ error: 'Failed to create order - missing order ID' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: RAZORPAY_KEY_ID,
        planName: plan.name,
        planId,
        duration: plan.duration,
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
