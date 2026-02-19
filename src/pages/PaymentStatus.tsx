import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking');

  useEffect(() => {
    const checkPayment = async () => {
      const paymentLinkId = localStorage.getItem('pendingPaymentLinkId');
      const razorpayStatus = searchParams.get('razorpay_payment_link_status');

      if (razorpayStatus === 'paid' || paymentLinkId) {
        try {
          // Verify with backend
          if (paymentLinkId) {
            const { data } = await supabase.functions.invoke('check-payment-status', {
              body: { paymentLinkId },
            });

            if (data?.status === 'paid') {
              setStatus('success');
              localStorage.removeItem('pendingPaymentLinkId');
              localStorage.removeItem('pendingPlanId');
              toast.success('🎉 Welcome to Premium!');
              return;
            }
          }

          // If razorpay says paid via callback params
          if (razorpayStatus === 'paid') {
            setStatus('success');
            localStorage.removeItem('pendingPaymentLinkId');
            localStorage.removeItem('pendingPlanId');
            toast.success('🎉 Welcome to Premium!');
            return;
          }

          setStatus('failed');
        } catch {
          setStatus('failed');
        }
      } else {
        setStatus('failed');
      }
    };

    checkPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === 'checking' && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <h1 className="text-2xl font-bold">Verifying Payment...</h1>
            <p className="text-muted-foreground">Please wait while we confirm your payment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground">Welcome to Premium! Enjoy your exclusive features.</p>
            <Button onClick={() => navigate('/dashboard')} size="lg">Go to Dashboard</Button>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Payment Not Confirmed</h1>
            <p className="text-muted-foreground">Your payment could not be verified. If you completed the payment, it may take a moment to process.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/premium')}>Try Again</Button>
              <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
