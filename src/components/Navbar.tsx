"use client";

import { Button } from "@/components/ui/button";
import { Car, Home, Laptop, Briefcase, ChevronDown, Menu, User, LogOut, MapPin, Globe, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, LANGUAGES, LanguageCode } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { language, setLanguage, t, currentLanguageOption } = useLanguage();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    toast({
      title: t.nav_signedOut,
      description: t.nav_signedOutDesc,
    });
    router.push("/");
  };

  const handlePostAd = () => {
    if (!currentUser) {
      toast({
        title: t.nav_authRequired,
        description: t.nav_authRequiredDesc,
        variant: "destructive",
      });
      router.push("/auth");
      return;
    }
    router.push("/post-ad");
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    const langName = LANGUAGES.find(l => l.code === lang)?.name || lang;
    toast({
      title: t.nav_langChanged,
      description: `${t.nav_langChangedDesc} ${langName}`,
    });
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-white'} border-b border-border`}>
      {/* Top Bar */}
      <div className={`transition-all duration-300 ${isScrolled ? 'bg-gradient-to-r from-primary/3 to-transparent' : 'bg-gradient-to-r from-primary/5 to-transparent'} border-b border-border/50`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - Mobile Menu Button (Mobile Only) + Logo */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button - Leftmost on Mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden -ml-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="bg-primary text-primary-foreground px-3.5 py-2 rounded-lg font-extrabold text-lg shadow-md group-hover:shadow-lg transition-all">
                  Trade
                </div>
                <span className="text-xl font-bold text-foreground">Hub.lk</span>
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1.5 text-sm">
                    <Globe className="w-4 h-4" />
                    <span className="hidden lg:inline">{currentLanguageOption.nativeName}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {LANGUAGES.map((lang) => (
                    <DropdownMenuItem 
                      key={lang.code} 
                      onClick={() => handleLanguageChange(lang.code)}
                      className={language === lang.code ? "bg-muted font-bold" : ""}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.nativeName}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Actions */}
              {currentUser ? (
                <div className="hidden md:flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted/50">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col items-start text-sm">
                          <span className="font-medium">Hi, {currentUser.name}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer">
                        <Laptop className="w-4 h-4 mr-2" />
                        {t.nav_dashboard}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/edit-profile")} className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        {t.nav_editProfile}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        {t.nav_signOut}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/auth")}
                  className="hidden md:flex items-center gap-1.5 text-sm"
                >
                  <User className="w-4 h-4" />
                  {t.nav_signIn}
                </Button>
              )}

              {/* Language Selector - Mobile Only */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {LANGUAGES.map((lang) => (
                    <DropdownMenuItem 
                      key={lang.code} 
                      onClick={() => handleLanguageChange(lang.code)}
                      className={language === lang.code ? "bg-muted font-bold" : ""}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.nativeName}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Button - Mobile Only */}
              {currentUser ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => router.push("/dashboard")}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => router.push("/auth")}
                >
                  <User className="h-5 w-5" />
                </Button>
              )}

              {/* Post Ad Button - Desktop Only */}
              <Button
                onClick={handlePostAd}
                className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-4 md:px-6 text-sm shadow-md hover:shadow-lg transition-all"
              >
                <span className="hidden sm:inline">{t.nav_postAd}</span>
                <span className="sm:hidden">POST AD</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Bar */}
      <div className="hidden md:block bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-center h-10 sm:h-12 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 min-w-max">
              <button
                onClick={() => router.push('/listings?category=vehicles')}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-primary hover:text-primary/80 transition-colors whitespace-nowrap py-2"
              >
                <Car className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden sm:inline">{t.nav_allVehicles}</span>
                <span className="sm:hidden">ALL</span>
              </button>
              <button
                onClick={() => router.push('/listings?type=Car')}
                className="text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap py-2"
              >
                {t.nav_cars}
              </button>
              <button
                onClick={() => router.push('/listings?type=SUV')}
                className="text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap py-2"
              >
                {t.nav_suvs}
              </button>
              <button
                onClick={() => router.push('/listings?type=Van')}
                className="text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap py-2"
              >
                {t.nav_vans}
              </button>
              <button
                onClick={() => router.push('/listings?type=Bike')}
                className="text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap py-2"
              >
                <span className="hidden sm:inline">{t.nav_motorbikes}</span>
                <span className="sm:hidden">Bikes</span>
              </button>
              <button
                onClick={() => router.push('/listings?type=Three-Wheeler')}
                className="text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap py-2"
              >
                <span className="hidden md:inline">{t.nav_threeWheelers}</span>
                <span className="md:hidden">3-Wheel</span>
              </button>
              <button
                onClick={() => router.push('/listings?type=Truck')}
                className="text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap py-2"
              >
                {t.nav_trucks}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => { router.push('/listings?category=vehicles'); setIsMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition-colors rounded-lg text-left"
              >
                <Car className="w-4 h-4" />
                {t.nav_allVehicles}
              </button>
              <button
                onClick={() => { router.push('/listings?type=Car'); setIsMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors rounded-lg text-left pl-10"
              >
                {t.nav_cars}
              </button>
              <button
                onClick={() => { router.push('/listings?type=SUV'); setIsMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors rounded-lg text-left pl-10"
              >
                {t.nav_suvs}
              </button>
              <button
                onClick={() => { router.push('/listings?type=Van'); setIsMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors rounded-lg text-left pl-10"
              >
                {t.nav_vans}
              </button>
              <button
                onClick={() => { router.push('/listings?type=Bike'); setIsMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors rounded-lg text-left pl-10"
              >
                {t.nav_motorbikes}
              </button>
              <button
                onClick={() => { router.push('/listings?type=Three-Wheeler'); setIsMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors rounded-lg text-left pl-10"
              >
                {t.nav_threeWheelers}
              </button>
              <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-border">
                <Button
                  onClick={() => { handlePostAd(); setIsMenuOpen(false); }}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  {t.nav_postAd}
                </Button>

                {currentUser ? (
                  <>
                    <div className="px-4 py-2 text-sm text-muted-foreground">Hi, {currentUser.name}</div>
                    <Button variant="outline" size="sm" onClick={() => { router.push("/dashboard"); setIsMenuOpen(false); }} className="w-full justify-start">
                      {t.nav_dashboard}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full justify-start">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t.nav_signOut}
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => { router.push("/auth"); setIsMenuOpen(false); }}>
                    <User className="h-4 w-4 mr-2" />
                    {t.nav_signIn}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
