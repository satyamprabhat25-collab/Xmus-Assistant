import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Subscription {
  id: string;
  plan: string;
  status: string;
  starts_at: string;
  expires_at: string;
  amount: number;
  currency: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setIsPremium(false);
      setIsLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        setSubscription(data as Subscription);
        setIsPremium(true);
      } else {
        setSubscription(null);
        setIsPremium(false);
      }
      setIsLoading(false);
    };

    fetchSubscription();
  }, [user]);

  const daysRemaining = subscription
    ? Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    subscription,
    isPremium,
    isLoading,
    daysRemaining,
  };
}
