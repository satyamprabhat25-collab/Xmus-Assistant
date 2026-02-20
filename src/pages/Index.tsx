import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Cpu, Trophy, Film, Music, Newspaper, Rocket, Heart, Star, TrendingUp,
  Crown, ArrowRight, Search, Sparkles, Globe, Zap, ChevronRight, Play, Code,
  Palette, Briefcase, Gamepad2, Brain, Camera, Headphones, Monitor, Wrench,
  ExternalLink, Lock, Users, Award } from
'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { PremiumModal } from '@/components/PremiumModal';

// Categories with icons
const categories = [
{ id: '1', name: 'Space & Universe', slug: 'space', icon: Rocket, color: 'from-indigo-500 to-purple-600', count: 15, premium: true },
{ id: '2', name: 'AI & Technology', slug: 'ai', icon: Brain, color: 'from-violet-500 to-purple-600', count: 25, premium: true },
{ id: '3', name: 'Games', slug: 'games', icon: Gamepad2, color: 'from-emerald-500 to-green-600', count: 30, premium: true },
{ id: '4', name: 'Entertainment', slug: 'entertainment', icon: Film, color: 'from-pink-500 to-rose-600', count: 45 },
{ id: '5', name: 'Music & Audio', slug: 'music', icon: Headphones, color: 'from-cyan-500 to-blue-600', count: 20 },
{ id: '6', name: 'Productivity', slug: 'productivity', icon: Briefcase, color: 'from-amber-500 to-orange-600', count: 22, premium: true },
{ id: '7', name: 'Development', slug: 'development', icon: Code, color: 'from-slate-500 to-zinc-600', count: 28 },
{ id: '8', name: 'Design', slug: 'design', icon: Palette, color: 'from-fuchsia-500 to-pink-600', count: 18, premium: true }];


// Premium Featured Links - Big Cards
const premiumFeaturedLinks = [
{
  id: '1', title: 'NASA Eyes', description: 'Explore the solar system in stunning 3D visualization',
  image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600', category: 'Space',
  url: 'https://eyes.nasa.gov/', clicks: 125000, premium: true
},
{
  id: '2', title: 'DALL-E 3', description: 'Create photorealistic images from text descriptions',
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600', category: 'AI',
  url: 'https://openai.com/dall-e-3', clicks: 89000, premium: true
},
{
  id: '3', title: 'Figma', description: 'Professional collaborative design platform',
  image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600', category: 'Design',
  url: 'https://www.figma.com/', clicks: 156000, premium: true
},
{
  id: '4', title: 'Discord', description: 'Voice, video & text communication platform',
  image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600', category: 'Social',
  url: 'https://discord.com/', clicks: 234000, premium: true
},
{
  id: '5', title: 'Notion', description: 'All-in-one workspace for notes, tasks & wikis',
  image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600', category: 'Productivity',
  url: 'https://www.notion.so/', clicks: 178000, premium: true
},
{
  id: '6', title: 'Unity', description: 'Professional game development engine',
  image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=600', category: 'Games',
  url: 'https://unity.com/', clicks: 98000, premium: true
},
{
  id: '7', title: 'TinyWow', description: 'Free AI-powered PDF, video, image & other online tools',
  image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600', category: 'Tools',
  url: 'https://tinywow.com/', clicks: 145000, premium: true
},
{
  id: '8', title: 'Summarize.tech', description: 'AI-powered video summarization tool',
  image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600', category: 'AI',
  url: 'https://www.summarize.tech/', clicks: 67000, premium: true
}];


// Free Featured Links
const freeFeaturedLinks = [
{
  id: '1', title: 'ChatGPT', description: 'AI assistant for conversations & tasks',
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400', category: 'AI',
  url: 'https://chat.openai.com/', clicks: 450000
},
{
  id: '2', title: 'Solar System Scope', description: 'Interactive 3D solar system explorer',
  image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400', category: 'Space',
  url: 'https://www.solarsystemscope.com/', clicks: 89000
},
{
  id: '3', title: 'Canva', description: 'Easy graphic design for everyone',
  image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', category: 'Design',
  url: 'https://www.canva.com/', clicks: 320000
},
{
  id: '4', title: 'Crunchyroll', description: 'Watch anime & read manga',
  image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400', category: 'Entertainment',
  url: 'https://www.crunchyroll.com/', clicks: 280000
}];


// Trending Links
const trendingLinks = [
{ id: '1', title: 'WolframAlpha - Computational Knowledge', url: 'https://www.wolframalpha.com/', clicks: 189000 },
{ id: '2', title: 'Midjourney - AI Art Generator', url: 'https://www.midjourney.com/', clicks: 245000, premium: true },
{ id: '3', title: 'GitHub - Code Repository', url: 'https://github.com/', clicks: 356000 },
{ id: '4', title: 'Spotify - Music Streaming', url: 'https://open.spotify.com/', clicks: 420000 },
{ id: '5', title: 'Linear - Project Management', url: 'https://linear.app/', clicks: 78000, premium: true },
{ id: '6', title: 'Pinterest - Visual Discovery', url: 'https://www.pinterest.com/', clicks: 290000 },
{ id: '7', title: 'Unreal Engine - Game Dev', url: 'https://www.unrealengine.com/', clicks: 134000, premium: true },
{ id: '8', title: 'Khan Academy - Free Learning', url: 'https://www.khanacademy.org/', clicks: 267000 }];


// More Premium Links Grid
const morePremiumLinks = [
{ title: 'Adobe Creative Cloud', url: 'https://www.adobe.com/creativecloud.html', icon: Palette, category: 'Design' },
{ title: 'Unsplash Pro', url: 'https://unsplash.com/', icon: Camera, category: 'Photos' },
{ title: 'Steam', url: 'https://store.steampowered.com/', icon: Gamepad2, category: 'Games' },
{ title: 'Duolingo Plus', url: 'https://www.duolingo.com/', icon: BookOpen, category: 'Learning' },
{ title: 'Grammarly', url: 'https://www.grammarly.com/', icon: BookOpen, category: 'Writing' },
{ title: 'Loom', url: 'https://www.loom.com/', icon: Monitor, category: 'Video' }];


export default function Index() {
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [searchQuery, setSearchQuery] = useState('');
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [selectedLinkTitle, setSelectedLinkTitle] = useState('');

  const handleLinkClick = (e: React.MouseEvent, url: string, isPremiumLink: boolean, title: string) => {
    if (isPremiumLink && !isPremium) {
      e.preventDefault();
      setSelectedLinkTitle(title);
      setPremiumModalOpen(true);
      return;
    }
    // Premium users or free links - open normally
  };

  return (
    <div className="min-h-screen bg-background">
      <PremiumModal
        open={premiumModalOpen}
        onOpenChange={setPremiumModalOpen}
        linkTitle={selectedLinkTitle} />


      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Globe className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Fluxo</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Explore</Link>
            <Link to="/music" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Music</Link>
            <Link to="/development" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Dev</Link>
            <Link to="/premium" className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-1">
              <Crown className="h-4 w-4 text-amber-500" />
              Premium
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ?
            <>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Users className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                {isPremium &&
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
              }
              </> :

            <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button size="sm" className="gap-1">
                    <Sparkles className="h-4 w-4" />
                    Join Free
                  </Button>
                </Link>
              </>
            }
          </div>
        </div>
      </header>

      {/* MASSIVE Hero Section */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Qzk2QkEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 h-20 w-20 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-32 w-32 rounded-full bg-accent/20 blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/4 h-16 w-16 rounded-full bg-amber-500/20 blur-2xl animate-pulse delay-300" />
        
        <div className="container max-w-7xl mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/20 px-6 py-2 rounded-full mb-6">
              <Award className="h-5 w-5 text-amber-500" />
              <span className="font-medium">🚀 Discover 500+ Premium Links</span>
            </div>
            
            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-8">
              Your Ultimate
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Content Portal
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Access the best AI tools, games, design software, productivity apps, and more. 
              <span className="text-foreground font-medium"> All in one place.</span>
            </p>

            {/* Search Bar - Larger */}
            <div className="relative max-w-2xl mx-auto mb-10">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <Input
                placeholder="Search for AI tools, games, design software..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-6 h-16 text-lg rounded-2xl border-2 border-border focus:border-primary shadow-xl bg-background/80 backdrop-blur-sm" />

              <Button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl h-12 px-6" size="lg">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-foreground">500+</p>
                <p className="text-sm text-muted-foreground">Premium Links</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-foreground">8</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid - Larger */}
      <section className="container max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">Browse Categories</h2>
            <p className="text-lg text-muted-foreground">Explore content organized by your interests</p>
          </div>
          <Button variant="outline" className="gap-2 hidden md:flex">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) =>
          <div
            key={category.id}
            onClick={(e) => handleLinkClick(e, '#', category.premium || false, category.name)}
            className="group relative bg-card border border-border rounded-3xl p-8 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 cursor-pointer">

              {category.premium &&
            <Badge className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                  <Lock className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
            }
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                <category.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.count} links</p>
            </div>
          )}
        </div>
      </section>

      {/* Premium Featured - Large Cards */}
      <section className="bg-gradient-to-br from-amber-500/5 via-background to-orange-500/5 py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Crown className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="font-display font-bold text-3xl md:text-4xl">Premium Collection</h2>
                <p className="text-lg text-muted-foreground">Exclusive access for premium members</p>
              </div>
            </div>
            <Link to="/premium">
              <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                <Sparkles className="h-4 w-4" />
                Get Premium
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumFeaturedLinks.map((link) =>
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleLinkClick(e, link.url, link.premium, link.title)}
              className="group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl hover:border-amber-500/30 transition-all duration-300 block hover:-translate-y-2">

                <div className="relative aspect-video overflow-hidden">
                  <img src={link.image} alt={link.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                    <Lock className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge variant="secondary" className="mb-2 text-xs bg-white/20 backdrop-blur-sm text-white border-0">
                      {link.category}
                    </Badge>
                    <h3 className="font-semibold text-white text-lg">{link.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{link.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {(link.clicks / 1000).toFixed(0)}k clicks
                    </span>
                    <span className="text-sm font-medium text-amber-500 flex items-center gap-1">
                      {isPremium ? 'Open' : 'Unlock'} <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Free Featured Links */}
      <section className="container max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Star className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl">Free to Access</h2>
              <p className="text-lg text-muted-foreground">Popular links available for everyone</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {freeFeaturedLinks.map((link) =>
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-300 block hover:-translate-y-2">

              <div className="relative aspect-video overflow-hidden">
                <img src={link.image} alt={link.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-5">
                <Badge variant="secondary" className="mb-2 text-xs">{link.category}</Badge>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{link.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{link.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {(link.clicks / 1000).toFixed(0)}k clicks
                  </span>
                  <span className="text-sm font-medium text-primary flex items-center gap-1">
                    Visit <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </a>
          )}
        </div>
      </section>

      {/* Trending + Premium CTA */}
      <section className="bg-secondary/30 py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Trending Links */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h2 className="font-display font-bold text-3xl">Trending Now</h2>
              </div>

              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg">
                {trendingLinks.map((link, index) =>
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleLinkClick(e, link.url, link.premium || false, link.title)}
                  className="flex items-center gap-5 p-5 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">

                    <span className="text-3xl font-bold text-muted-foreground w-10">{index + 1}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg flex items-center gap-2">
                        {link.title}
                        {link.premium && <Lock className="h-4 w-4 text-amber-500" />}
                      </h3>
                      <span className="text-sm text-muted-foreground">{(link.clicks / 1000).toFixed(0)}k clicks</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </a>
                )}
              </div>
            </div>

            {/* Premium CTA */}
            <div>
              <div className="sticky top-24">
                <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-[3px] rounded-3xl shadow-2xl">
                  <div className="bg-card rounded-3xl p-8">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg">
                      <Crown className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-display font-bold text-2xl mb-3">Unlock Everything</h3>
                    <p className="text-muted-foreground mb-6">
                      Get unlimited access to NASA, Figma, Discord, AI tools, games, and 500+ premium links.
                    </p>
                    
                    <div className="space-y-3 mb-8 p-5 bg-secondary/50 rounded-2xl">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Monthly</span>
                        <span className="font-bold text-primary text-lg">$5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Quarterly</span>
                        <span className="font-bold text-primary text-lg">$10</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-border pt-3">
                        <span className="text-sm font-medium flex items-center gap-2">
                          Yearly 
                          <Badge className="bg-green-500 text-white border-0 text-xs">Save 67%</Badge>
                        </span>
                        <span className="font-bold text-primary text-lg">$19</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-4 mb-8">
                      {['NASA Eyes & Space Tools', 'Figma, Notion, Discord', 'All AI Image Generators', 'Professional Games & Dev Tools', 'Ad-free experience'].map((feature) =>
                      <li key={feature} className="flex items-center gap-3 text-sm">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                            <Zap className="h-3 w-3 text-white" />
                          </div>
                          {feature}
                        </li>
                      )}
                    </ul>
                    <Link to="/premium">
                      <Button className="w-full gap-2 h-14 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" size="lg">
                        <Sparkles className="h-5 w-5" />
                        Get Premium Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Premium Links */}
      <section className="container max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">More Premium Tools</h2>
          <p className="text-lg text-muted-foreground">Professional software and exclusive content</p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {morePremiumLinks.map((link) =>
          <a
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleLinkClick(e, link.url, true, link.title)}
            className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 text-center hover:-translate-y-1">

              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <link.icon className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{link.title}</h3>
              <p className="text-xs text-muted-foreground">{link.category}</p>
              <Lock className="h-3 w-3 text-amber-500 mx-auto mt-2" />
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30">
        <div className="container max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <span className="font-display font-bold text-2xl">Fluxo</span>
              </div>
              <p className="text-muted-foreground">
                Your ultimate content portal for discovering the best links on the web.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Categories</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/music" className="hover:text-foreground transition-colors">Music & Audio</Link></li>
                <li><Link to="/development" className="hover:text-foreground transition-colors">Development</Link></li>
                <li><Link to="/productivity" className="hover:text-foreground transition-colors">Productivity</Link></li>
                <li><Link to="/explore" className="hover:text-foreground transition-colors">All Categories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Account</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link to="/premium" className="hover:text-foreground transition-colors">Premium</Link></li>
                <li><Link to="/settings" className="hover:text-foreground transition-colors">Settings</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Legal</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2024 Fluxo. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">Made with ❤️ for content discovery</p>
          </div>
        </div>
      </footer>
    </div>);

}