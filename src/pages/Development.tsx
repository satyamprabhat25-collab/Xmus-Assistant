import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code, ArrowLeft, Crown, Lock, ExternalLink, TrendingUp, Terminal, Database, Cloud, GitBranch, Globe, Sparkles, Box, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { PremiumModal } from '@/components/PremiumModal';

const devToolsLinks = [
  { id: '1', title: 'GitHub', description: 'Code hosting and collaboration', url: 'https://github.com/', image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400', clicks: 890000 },
  { id: '2', title: 'VS Code', description: 'Free source code editor', url: 'https://code.visualstudio.com/', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400', clicks: 780000 },
  { id: '3', title: 'JetBrains', description: 'Professional IDEs for developers', url: 'https://www.jetbrains.com/', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400', clicks: 450000, premium: true },
  { id: '4', title: 'Vercel', description: 'Deploy web projects instantly', url: 'https://vercel.com/', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400', clicks: 560000, premium: true },
  { id: '5', title: 'Netlify', description: 'Build, deploy & scale web apps', url: 'https://www.netlify.com/', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400', clicks: 340000 },
  { id: '6', title: 'Railway', description: 'Infrastructure platform for devs', url: 'https://railway.app/', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400', clicks: 180000, premium: true },
  { id: '7', title: 'Supabase', description: 'Open source Firebase alternative', url: 'https://supabase.com/', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400', clicks: 290000 },
  { id: '8', title: 'PlanetScale', description: 'Serverless MySQL platform', url: 'https://planetscale.com/', image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400', clicks: 210000, premium: true },
];

const learningLinks = [
  { id: '1', title: 'freeCodeCamp', description: 'Learn to code for free', url: 'https://www.freecodecamp.org/' },
  { id: '2', title: 'Codecademy', description: 'Interactive coding lessons', url: 'https://www.codecademy.com/', premium: true },
  { id: '3', title: 'LeetCode', description: 'Practice coding problems', url: 'https://leetcode.com/', premium: true },
  { id: '4', title: 'HackerRank', description: 'Coding challenges & hiring', url: 'https://www.hackerrank.com/' },
];

const frameworkLinks = [
  { id: '1', title: 'React', description: 'UI library by Meta', url: 'https://react.dev/' },
  { id: '2', title: 'Next.js', description: 'React framework for production', url: 'https://nextjs.org/', premium: true },
  { id: '3', title: 'Vue.js', description: 'Progressive JavaScript framework', url: 'https://vuejs.org/' },
  { id: '4', title: 'Svelte', description: 'Cybernetically enhanced web apps', url: 'https://svelte.dev/' },
];

export default function DevelopmentPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 via-zinc-500/5 to-background" />
        <div className="container max-w-7xl mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-600 to-zinc-600 text-white px-4 py-2 rounded-full mb-6">
              <Code className="h-5 w-5" />
              <span className="font-semibold">Development</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Build
              <span className="bg-gradient-to-r from-slate-500 to-zinc-500 bg-clip-text text-transparent"> Amazing </span>
              Things
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Access the best development tools, IDEs, hosting platforms, and learning resources.
            </p>
          </div>
        </div>
      </section>

      {/* Dev Tools */}
      <section className="container max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-display font-bold text-2xl md:text-3xl mb-8 flex items-center gap-3">
          <Terminal className="h-8 w-8 text-slate-500" />
          Developer Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {devToolsLinks.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleLinkClick(e, link.url, link.premium || false, link.title)}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-500/30 transition-all duration-300 hover:-translate-y-1"
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
                <h3 className="font-semibold mb-1 group-hover:text-slate-500 transition-colors">{link.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{link.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {(link.clicks / 1000).toFixed(0)}k
                  </span>
                  <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                    Visit <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Learning & Frameworks */}
      <section className="bg-secondary/30 py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Learning */}
            <div>
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-3">
                <Cpu className="h-6 w-6 text-slate-500" />
                Learn to Code
              </h2>
              <div className="space-y-4">
                {learningLinks.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, link.url, link.premium || false, link.title)}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-slate-500/30 transition-all"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-500 to-zinc-600 flex items-center justify-center">
                      <Code className="h-6 w-6 text-white" />
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

            {/* Frameworks */}
            <div>
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-3">
                <Box className="h-6 w-6 text-slate-500" />
                Frameworks
              </h2>
              <div className="space-y-4">
                {frameworkLinks.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, link.url, link.premium || false, link.title)}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-slate-500/30 transition-all"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-500 to-zinc-600 flex items-center justify-center">
                      <GitBranch className="h-6 w-6 text-white" />
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
        <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">Ready to Level Up?</h2>
        <p className="text-muted-foreground mb-6">Unlock premium IDEs, hosting platforms, and advanced learning resources</p>
        <Link to="/premium">
          <Button size="lg" className="gap-2 bg-gradient-to-r from-slate-600 to-zinc-600 hover:from-slate-700 hover:to-zinc-700">
            <Sparkles className="h-5 w-5" />
            Get Premium Access
          </Button>
        </Link>
      </section>
    </div>
  );
}
