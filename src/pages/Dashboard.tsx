import { Link, Navigate } from 'react-router-dom';
import { Crown, Calendar, Clock, CreditCard, ArrowLeft, CheckCircle, XCircle, Sparkles, Globe, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const { subscription, isPremium, isLoading: subLoading, daysRemaining } = useSubscription();

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const planDuration = subscription?.plan === 'yearly' ? 365 : subscription?.plan === 'quarterly' ? 90 : 30;
  const progressPercentage = subscription ? Math.min(100, (daysRemaining / planDuration) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Globe className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Fluxo</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
            Welcome back, {profile?.display_name || 'User'}!
          </h1>
          <p className="text-muted-foreground">Manage your account and subscription</p>
        </div>

        <div className="grid gap-6">
          {/* Subscription Status */}
          <Card className={`relative overflow-hidden ${isPremium ? 'border-amber-500/50' : ''}`}>
            {isPremium && (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
            )}
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isPremium ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-secondary'}`}>
                    <Crown className={`h-6 w-6 ${isPremium ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Subscription Status
                      {isPremium ? (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                          Premium Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Free Plan</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {isPremium ? 'You have full access to all premium features' : 'Upgrade to unlock premium content'}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6">
              {isPremium && subscription ? (
                <>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-secondary/50 rounded-xl">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm">Plan</span>
                      </div>
                      <p className="font-semibold capitalize">{subscription.plan}</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-xl">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Started</span>
                      </div>
                      <p className="font-semibold">{format(new Date(subscription.starts_at), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-xl">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Expires</span>
                      </div>
                      <p className="font-semibold">{format(new Date(subscription.expires_at), 'MMM d, yyyy')}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Time Remaining</span>
                      <span className="font-semibold">{daysRemaining} days left</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                  </div>

                  <div className="flex gap-3">
                    <Link to="/premium">
                      <Button variant="outline" className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        Extend Subscription
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">You're on the Free Plan</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Upgrade to Premium to unlock AI tools, exclusive links, and an ad-free experience.
                  </p>
                  <Link to="/premium">
                    <Button className="gap-2" size="lg">
                      <Sparkles className="h-5 w-5" />
                      Upgrade to Premium
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Premium Features */}
          <Card>
            <CardHeader>
              <CardTitle>Premium Features</CardTitle>
              <CardDescription>What you {isPremium ? 'have access to' : 'can unlock'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'AI Image Generator', desc: 'Create unlimited AI images', available: isPremium },
                  { title: 'Premium Links', desc: 'NASA, Figma, Discord & more', available: isPremium },
                  { title: 'Ad-Free Browsing', desc: 'No interruptions', available: isPremium },
                  { title: 'Early Access', desc: 'New features first', available: isPremium },
                  { title: 'Unlimited Favorites', desc: 'Save unlimited links', available: isPremium },
                  { title: 'Priority Support', desc: 'Get help faster', available: isPremium },
                ].map((feature) => (
                  <div key={feature.title} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                    {feature.available ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link to={`/profile/${profile?.username}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">View Profile</h3>
                    <p className="text-sm text-muted-foreground">See your public profile</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/settings">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Settings</h3>
                    <p className="text-sm text-muted-foreground">Manage your account</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
