import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // BrowserRouter ki jagah HashRouter
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Compose from "./pages/Compose";
import PostDetail from "./pages/PostDetail";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import Premium from "./pages/Premium";
import PaymentStatus from "./pages/PaymentStatus";
import Dashboard from "./pages/Dashboard";
import Music from "./pages/Music";
import Development from "./pages/Development";
import Productivity from "./pages/Productivity";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter> {/* Yahan HashRouter hona chahiye */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/compose" element={<Compose />} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/music" element={<Music />} />
            <Route path="/development" element={<Development />} />
            <Route path="/productivity" element={<Productivity />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;