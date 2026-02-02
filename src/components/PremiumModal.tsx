import { Link } from 'react-router-dom';
import { Crown, Sparkles, X, Zap, Star, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkTitle?: string;
}

export function PremiumModal({ open, onOpenChange, linkTitle }: PremiumModalProps) {
  const features = [
    { icon: Zap, text: 'Unlimited AI Image Generator' },
    { icon: Star, text: 'Access Premium Links & Tools' },
    { icon: Shield, text: 'Ad-Free Experience' },
    { icon: Globe, text: 'Early Access to New Features' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-amber-500/5 border-amber-500/20">
        <DialogHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-display">
            Premium Content
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {linkTitle && (
            <div className="text-center p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <p className="text-sm text-muted-foreground">You're trying to access:</p>
              <p className="font-semibold text-foreground">{linkTitle}</p>
            </div>
          )}

          <p className="text-center text-muted-foreground">
            This content is exclusive to Premium members. Unlock access to all premium links and features!
          </p>

          <div className="space-y-2">
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-secondary/50 rounded-xl text-center">
            <p className="text-sm text-muted-foreground mb-1">Starting from just</p>
            <p className="text-3xl font-bold text-primary">$5<span className="text-base font-normal text-muted-foreground">/month</span></p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/premium" className="w-full">
            <Button className="w-full gap-2 h-12 text-base" size="lg">
              <Sparkles className="h-5 w-5" />
              Get Premium Now
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
