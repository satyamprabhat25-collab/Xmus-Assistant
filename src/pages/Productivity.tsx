import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowLeft, Crown, Lock, ExternalLink, TrendingUp, FileText, Calendar, CheckSquare, MessageSquare, Globe, Sparkles, Layers, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { PremiumModal } from '@/components/PremiumModal';

const productivityLinks = [
  { id: '1', title: 'Notion', description: 'All-in-one workspace for notes & tasks', url: 'https://www.notion.so/', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400', clicks: 890000, premium: true },
  { id: '2', title: 'Linear', description: 'Modern project management', url: 'https://linear.app/', image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=400', clicks: 450000, premium: true },
  { id: '3', title: 'Todoist', description: 'Task management made simple', url: 'https://todoist.com/', image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400', clicks: 560000 },
  { id: '4', title: 'Trello', description: 'Visual project management', url: 'https://trello.com/', image: 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=400', clicks: 780000 },
  { id: '5', title: 'Asana', description: 'Work management platform', url: 'https://asana.com/', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400', clicks: 670000, premium: true },
  { id: '6', title: 'ClickUp', description: 'One app to replace them all', url: 'https://clickup.com/', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400', clicks: 340000 },
  { id: '7', title: 'Monday.com', description: 'Work operating system', url: 'https://monday.com/', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400', clicks: 520000, premium: true },
  { id: '8', title: 'Airtable', description: 'Spreadsheet meets database', url: 'https://airtable.com/', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', clicks: 410000, premium: true },
];

const noteLinks = [
  { id: '1', title: 'Obsidian', description: 'Knowledge base on local markdown', url: 'https://obsidian.md/', premium: true },
  { id: '2', title: 'Roam Research', description: 'Note-taking for networked thought', url: 'https://roamresearch.com/', premium: true },
  { id: '3', title: 'Evernote', description: 'Note-taking & organization', url: 'https://evernote.com/' },
  { id: '4', title: 'Bear', description: 'Beautiful notes app for Apple', url: 'https://bear.app/' },
];

const calendarLinks = [
  { id: '1', title: 'Calendly', description: 'Easy scheduling ahead', url: 'https://calendly.com/', premium: true },
  { id: '2', title: 'Cal.com', description: 'Open source scheduling', url: 'https://cal.com/' },
  { id: '3', title: 'Fantastical', description: 'Calendar app for professionals', url: 'https://flexibits.com/fantastical', premium: true },
  { id: '4', title: 'Cron', description: 'Next-gen calendar for teams', url: 'https://cron.com/' },
];

export default function ProductivityPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-background" />
        <div className="container max-w-7xl mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full mb-6">
              <Briefcase className="h-5 w-5" />
              <span className="font-semibold">Productivity</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Work
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"> Smarter </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Organize your life with the best productivity tools, note-taking apps, and calendars.
            </p>
          </div>
        </div>
      </section>

      {/* Project Management */}
      <section className="container max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-display font-bold text-2xl md:text-3xl mb-8 flex items-center gap-3">
          <Layers className="h-8 w-8 text-amber-500" />
          Project Management
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productivityLinks.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleLinkClick(e, link.url, link.premium || false, link.title)}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1"
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
                <h3 className="font-semibold mb-1 group-hover:text-amber-500 transition-colors">{link.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{link.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {(link.clicks / 1000).toFixed(0)}k
                  </span>
                  <span className="text-sm font-medium text-amber-500 flex items-center gap-1">
                    Visit <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Notes & Calendars */}
      <section className="bg-secondary/30 py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Notes */}
            <div>
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-3">
                <FileText className="h-6 w-6 text-amber-500" />
                Note-Taking
              </h2>
              <div className="space-y-4">
                {noteLinks.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, link.url, link.premium || false, link.title)}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-amber-500/30 transition-all"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
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

            {/* Calendars */}
            <div>
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-3">
                <Calendar className="h-6 w-6 text-amber-500" />
                Calendars & Scheduling
              </h2>
              <div className="space-y-4">
                {calendarLinks.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, link.url, link.premium || false, link.title)}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-amber-500/30 transition-all"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
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
        <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">Boost Your Productivity</h2>
        <p className="text-muted-foreground mb-6">Unlock premium tools like Notion, Linear, Asana, and more</p>
        <Link to="/premium">
          <Button size="lg" className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
            <Sparkles className="h-5 w-5" />
            Get Premium Access
          </Button>
        </Link>
      </section>
    </div>
  );
}
