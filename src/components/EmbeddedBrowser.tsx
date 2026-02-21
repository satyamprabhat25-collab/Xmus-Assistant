import { useState } from 'react';
import { X, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmbeddedBrowserProps {
  url: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EmbeddedBrowser({ url, title, isOpen, onClose }: EmbeddedBrowserProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-medium text-sm truncate">{title}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Iframe */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Loading {title}...</p>
            </div>
          </div>
        )}
        <iframe
          src={url}
          title={title}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
}
