import { useState } from 'react';
import { X, MessageCircle, ExternalLink, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PLAY_STORE_URL = 'https://play.google.com/store/search?q=lucix+ai&c=apps';

export function LucixAIWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const openPlayStore = () => {
    window.open(PLAY_STORE_URL, '_blank');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.5)',
        }}
        aria-label="Open Lucix AI"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Sparkles className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-44 right-4 md:bottom-24 md:right-6 z-50 w-72 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div
            className="p-4 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Lucix AI</h3>
              <p className="text-white/80 text-xs">Your AI Assistant • Free</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Chat with <span className="font-semibold text-foreground">Lucix AI</span> — your intelligent assistant, available for free on Android!
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Smart AI conversations
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Completely free to use
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Available on Android
              </div>
            </div>

            <Button
              onClick={openPlayStore}
              className="w-full gap-2 text-sm"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              <Download className="h-4 w-4" />
              Download on Play Store
              <ExternalLink className="h-3 w-3" />
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Free • No subscription needed
            </p>
          </div>
        </div>
      )}
    </>
  );
}
