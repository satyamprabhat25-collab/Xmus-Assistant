import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Check, Sparkles, ArrowLeft, Zap, Star, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
declare global {
  interface Window {
    Razorpay: any;
  }
}
const plans = [{
  id: 'monthly',
  name: 'Monthly',
  price: 5,
  priceDisplay: '$5',
  period: 'month',
  description: 'Perfect for trying out premium features',
  popular: false
}, {
  id: 'quarterly',
  name: 'Quarterly',
  price: 10,
  priceDisplay: '$10',
  period: '3 months',
  description: 'Save 33% compared to monthly',
  popular: false
}, {
  id: 'yearly',
  name: 'Yearly',
  price: 19,
  priceDisplay: '$19',
  period: 'year',
  description: 'Best value - save 68%!',
  popular: true
}];
const features = [{
  icon: Zap,
  title: 'AI Image Generator',
  description: 'Create unlimited AI-generated images'
}, {
  icon: Star,
  title: 'Premium Links',
  description: 'Access exclusive curated content'
}, {
  icon: Shield,
  title: 'Ad-Free Experience',
  description: 'Browse without any interruptions'
}, {
  icon: Globe,
  title: 'Early Access',
  description: 'Get new features before everyone else'
}];
export default function Premium() {
  const {
    user,
    session
  } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  useEffect(() => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      toast.error('Payment system failed to load. Please refresh the page.');
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      navigate('/auth');
      return;
    }
    if (!razorpayLoaded || !window.Razorpay) {
      toast.error('Payment system is loading. Please wait a moment and try again.');
      return;
    }
    setIsLoading(true);
    try {
      // Create order
      const {
        data,
        error
      } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          planId
        }
      });
      if (error) {
        console.error('Order creation error:', error);
        toast.error(error.message || 'Failed to create order. Please try again.');
        setIsLoading(false);
        return;
      }
      if (!data || !data.orderId) {
        console.error('Invalid order data:', data);
        toast.error('Failed to create order. Please try again.');
        setIsLoading(false);
        return;
      }
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Lapi Premium',
        description: data.planName,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const {
              data: verifyData,
              error: verifyError
            } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId
              }
            });
            if (verifyError) {
              console.error('Verification error:', verifyError);
              toast.error('Payment verification failed. Please contact support.');
              return;
            }
            toast.success('🎉 Welcome to Premium! Enjoy your exclusive access.');
            navigate('/dashboard');
          } catch (err) {
            console.error('Verification error:', err);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          email: user.email
        },
        theme: {
          color: '#f59e0b'
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
          escape: true,
          backdropclose: false
        }
      };

      // Double check Razorpay is available before creating instance
      if (typeof window.Razorpay !== 'function') {
        console.error('Razorpay not available as function');
        toast.error('Payment system not ready. Please refresh and try again.');
        setIsLoading(false);
        return;
      }
      try {
        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response: any) {
          console.error('Payment failed:', response.error);
          toast.error(response.error.description || 'Payment failed. Please try again.');
          setIsLoading(false);
        });

        // Small delay to ensure modal can render properly
        setTimeout(() => {
          razorpay.open();
        }, 100);
      } catch (razorpayError: any) {
        console.error('Razorpay initialization error:', razorpayError);
        toast.error('Failed to open payment window. Please try again.');
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error?.message || 'Failed to initiate payment. Please try again.');
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Globe className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">​WWW.FLUXO.COM</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-background" />
        <div className="container max-w-7xl mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full mb-6">
              <Crown className="h-5 w-5" />
              <span className="font-semibold">Premium Membership</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Unlock the Full
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"> Power </span>
              of Lapi
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Get unlimited access to AI tools, premium content, and exclusive features.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {plans.map(plan => <Card key={plan.id} className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl ${selectedPlan === plan.id ? 'border-2 border-primary shadow-lg scale-105' : 'border-border hover:border-primary/50'} ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`} onClick={() => setSelectedPlan(plan.id)}>
                {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-4">
                    Most Popular
                  </Badge>}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-5xl font-bold">{plan.priceDisplay}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <Button className="w-full gap-2" size="lg" variant={selectedPlan === plan.id ? 'default' : 'outline'} onClick={e => {
                e.stopPropagation();
                handleSubscribe(plan.id);
              }} disabled={isLoading}>
                    <Sparkles className="h-4 w-4" />
                    {isLoading ? 'Processing...' : 'Subscribe Now'}
                  </Button>
                </CardContent>
              </Card>)}
          </div>

          {/* Features */}
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-center mb-8">
              Everything You Get with Premium
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map(feature => <div key={feature.title} className="flex items-start gap-4 p-6 bg-card border border-border rounded-2xl">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>)}
            </div>
          </div>

          {/* All Features List */}
          <div className="max-w-2xl mx-auto mt-12 p-8 bg-card border border-border rounded-2xl">
            <h3 className="font-semibold text-lg mb-6 text-center">All Premium Features</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {['Unlimited AI Image Generation', 'Access to Premium Links', 'Ad-Free Browsing', 'Early Access to New Features', 'Priority Customer Support', 'Save Unlimited Favorites', 'Create Unlimited Collections', 'Exclusive Space & Universe Content'].map(feature => <div key={feature} className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>)}
            </div>
          </div>

          {/* Payment Notice */}
          <div className="text-center mt-12 text-muted-foreground text-sm">
            <p>Secure payments powered by Razorpay</p>
            <p className="mt-2">Cancel anytime • No hidden fees • Instant access</p>
          </div>
        </div>
      </section>
    </div>;
}