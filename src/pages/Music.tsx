import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Headphones, ArrowLeft, Crown, Lock, ExternalLink, TrendingUp, Play, Radio, Mic, Music2, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { PremiumModal } from '@/components/PremiumModal';

const musicLinks = [
  { id: '1', title: 'Spotify', description: 'Stream millions of songs and podcasts', url: 'https://open.spotify.com/', image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400', clicks: 890000 },
  { id: '2', title: 'SoundCloud', description: 'Discover and share music', url: 'https://soundcloud.com/', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', clicks: 450000 },
  { id: '3', title: 'Apple Music', description: 'Over 100 million songs ad-free', url: 'https://music.apple.com/', image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=400', clicks: 670000, premium: true },
  { id: '4', title: 'YouTube Music', description: 'Official music videos and more', url: 'https://music.youtube.com/', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', clicks: 780000 },
  { id: '5', title: 'Tidal', description: 'Hi-Fi music streaming', url: 'https://tidal.com/', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', clicks: 230000, premium: true },
  { id: '6', title: 'Deezer', description: 'Music streaming service', url: 'https://www.deezer.com/', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', clicks: 340000 },
  { id: '7', title: 'Bandcamp', description: 'Support independent artists', url: 'https://bandcamp.com/', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400', clicks: 180000 },
  { id: '8', title: 'Audius', description: 'Decentralized music streaming', url: 'https://audius.co/', image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400', clicks: 120000, premium: true },
];

const podcastLinks = [
  { id: '1', title: 'Pocket Casts', description: 'Powerful podcast player', url: 'https://pocketcasts.com/', premium: true },
  { id: '2', title: 'Overcast', description: 'Smart podcast player for iOS', url: 'https://overcast.fm/' },
  { id: '3', title: 'Castbox', description: 'Podcast & Radio', url: 'https://castbox.fm/' },
];

const productionLinks = [
  { id: '1', title: 'Ableton Live', description: 'Music production software', url: 'https://www.ableton.com/', premium: true },
  { id: '2', title: 'FL Studio', description: 'Digital audio workstation', url: 'https://www.image-line.com/', premium: true },
  { id: '3', title: 'Audacity', description: 'Free audio editor', url: 'https://www.audacityteam.org/' },
  { id: '4', title: 'GarageBand', description: 'Free music creation', url: 'https://www.apple.com/garageband/' },
];

export default function MusicPage() {
  const { isPremium } = useSubscription();
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [selectedLinkTitle, setSelectedLinkTitle] = useState('');

  const handleLinkClick = (e: React.MouseEvent, url: string, isPremiumLink: boolean, title: string) => {
    if (isPremiumLink && !isPremium) {
      e.preventDefault();
      setSelectedLinkTitle(title);
      setPremiumModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PremiumModal open={premiumModalOpen} onOpenChange={setPremiumModalOpen} linkTitle={selectedLinkTitle} />

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

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-background" />
        <div className="container max-w-7xl mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full mb-6">
              <Headphones className="h-5 w-5" />
              <span className="font-semibold">Music & Audio</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Your Sound
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent"> Universe </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Stream music, discover podcasts, and create your own beats with the best audio tools.
            </p>
          </div>
        </div>
      </section>

      {/* Music Streaming */}
      <section className="container max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-display font-bold text-2xl md:text-3xl mb-8 flex items-center gap-3">
          <Music2 className="h-8 w-8 text-cyan-500" />
          Music Streaming
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {musicLinks.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleLinkClick(e, link.url, link.premium || false, link.title)}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-video overflow-hidden">
                <img src={link.image} alt={link.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {link.premium && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    <Lock className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1 group-hover:text-cyan-500 transition-colors">{link.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{link.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {(link.clicks / 1000).toFixed(0)}k
                  </span>
                  <span className="text-sm font-medium text-cyan-500 flex items-center gap-1">
                    Visit <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Podcasts & Production */}
      <section className="bg-secondary/30 py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Podcasts */}
            <div>
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-3">
                <Mic className="h-6 w-6 text-cyan-500" />
                Podcast Players
              </h2>
              <div className="space-y-4">
                {podcastLinks.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, link.url, link.premium || false, link.title)}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-cyan-500/30 transition-all"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Radio className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold flex items-center gap-2">
                        {link.title}
                        {link.premium && <Lock className="h-4 w-4 text-amber-500" />}
                      </h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Production */}
            <div>
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-3">
                <Play className="h-6 w-6 text-cyan-500" />
                Music Production
              </h2>
              <div className="space-y-4">
                {productionLinks.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, link.url, link.premium || false, link.title)}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-cyan-500/30 transition-all"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold flex items-center gap-2">
                        {link.title}
                        {link.premium && <Lock className="h-4 w-4 text-amber-500" />}
                      </h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">Want More Audio Tools?</h2>
        <p className="text-muted-foreground mb-6">Unlock premium music production software and exclusive platforms</p>
        <Link to="/premium">
          <Button size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            <Sparkles className="h-5 w-5" />
            Get Premium Access
          </Button>
        </Link>
      </section>
    </div>
  );
}
