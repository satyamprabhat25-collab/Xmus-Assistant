import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { LucixAIWidget } from '@/components/LucixAIWidget';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-2xl mx-auto pb-20 md:pb-8 pt-4">
        {children}
      </main>
      <MobileNav />
      <LucixAIWidget />
    </div>
  );
}
