"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ChevronLeft, Car } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="relative inline-block">
            <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-blue-600 select-none">
              404
            </h1>
            <div className="absolute -bottom-2 right-4 bg-background border-2 border-primary rounded-lg px-3 py-1 rotate-12 shadow-lg">
              <span className="text-primary font-bold text-sm tracking-widest uppercase">Lost Turn</span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Looks like you hit a dead end
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed px-4">
              The page you are looking for might have been moved, deleted, or never existed in the first place. Let's get you back on track.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-12 rounded-xl shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-200">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/listings" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full h-12 rounded-xl border border-border hover:bg-muted transition-colors duration-200">
                <Search className="w-5 h-5 mr-2" />
                Browse Vehicles
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Quick Links</p>
            <div className="flex gap-4 text-sm font-medium text-primary">
              <Link href="/post-ad" className="hover:underline">Post an Ad</Link>
              <span className="text-muted-foreground/30">•</span>
              <Link href="/auth" className="hover:underline">Login / Register</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
