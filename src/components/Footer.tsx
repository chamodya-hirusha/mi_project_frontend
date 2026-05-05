import { Facebook, Instagram, Twitter, Mail, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-category-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8">
          {/* Mobile: Part 1 - Overview & About TradeHub (stacked) | Desktop: Column 1 - Overview */}
          <div className="flex flex-col gap-6 md:gap-0">
            {/* Overview */}
            <div>
              <h3 className="font-bold mb-3 md:mb-4 text-sm md:text-lg">OVERVIEW</h3>
              <ul className="space-y-1.5 md:space-y-2">
                <li><a href="#" className="hover:text-secondary transition-colors text-xs md:text-base">Home</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors text-xs md:text-base">Privacy policy</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors text-xs md:text-base">FAQ</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors text-xs md:text-base">Membership</a></li>
              </ul>
            </div>

            {/* About TradeHub - Only visible on mobile, hidden on desktop */}
            <div className="md:hidden">
              <h3 className="font-bold mb-3 text-sm">ABOUT TRADEHUB</h3>
              <ul className="space-y-1.5">
                <li><a href="#" className="hover:text-secondary transition-colors text-xs">About Us</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors text-xs">Terms and Conditions</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors text-xs">Privacy policy</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors text-xs">Partnerships</a></li>
              </ul>
            </div>
          </div>

          {/* Desktop: Column 2 - About TradeHub (hidden on mobile) */}
          <div className="hidden md:block">
            <h3 className="font-bold mb-4 text-lg">ABOUT TRADEHUB</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-secondary transition-colors text-base">About Us</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors text-base">Terms and Conditions</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors text-base">Privacy policy</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors text-base">Partnerships</a></li>
            </ul>
          </div>

          {/* Mobile: Part 2 - TradeHub Auto & App Downloads (stacked) | Desktop: Column 3 - TradeHub Auto */}
          <div className="flex flex-col gap-6 md:gap-0">
            {/* TradeHub */}
            <div>
              <h3 className="font-bold mb-3 md:mb-4 text-sm md:text-lg">TRADEHUB AUTO</h3>
              <p className="mb-3 md:mb-4 text-xs md:text-sm">
                TradeHub.lk is Sri Lanka's premier vehicle marketplace and leasing platform. Connect with trusted sellers, browse thousands of verified vehicles, and apply for leasing instantly. From cars and bikes to heavy machinery, we have it all.
              </p>
              <a href="/listings" className="text-secondary hover:text-secondary/80 hover:underline flex items-center gap-1 transition-colors font-medium text-xs md:text-base">
                BROWSE VEHICLES <span>→</span>
              </a>
            </div>

            {/* Experience TradeHub in Your Pocket - Only visible on mobile, hidden on desktop */}
            <div className="md:hidden">
              <h3 className="font-bold mb-3 text-sm">EXPERIENCE TRADEHUB IN YOUR POCKET</h3>
              <p className="mb-3 text-xs">Download the TradeHub.lk App</p>
              <div className="space-y-2">
                <a href="#" className="block bg-black text-white rounded-lg px-2 py-2 hover:bg-black/80 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
                    <div>
                      <div className="text-[10px]">GET IT ON</div>
                      <div className="font-bold text-xs">Google Play</div>
                    </div>
                  </div>
                </a>
                <a href="#" className="block bg-black text-white rounded-lg px-2 py-2 hover:bg-black/80 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" /></svg>
                    <div>
                      <div className="text-[10px]">Download on the</div>
                      <div className="font-bold text-xs">App Store</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Desktop: Column 4 - App Downloads (hidden on mobile) */}
          <div className="hidden md:block">
            <h3 className="font-bold mb-4 text-lg">EXPERIENCE TRADEHUB IN YOUR POCKET</h3>
            <p className="mb-4 text-sm">Download the TradeHub.lk App</p>
            <div className="space-y-3">
              <a href="#" className="block bg-black text-white rounded-lg px-4 py-2.5 hover:bg-black/80 transition-all hover:shadow-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
                  <div>
                    <div className="text-xs">GET IT ON</div>
                    <div className="font-bold text-base">Google Play</div>
                  </div>
                </div>
              </a>
              <a href="#" className="block bg-black text-white rounded-lg px-4 py-2.5 hover:bg-black/80 transition-all hover:shadow-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" /></svg>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="font-bold text-base">App Store</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Hotline */}
            <div>
              <h4 className="font-semibold mb-2">Hotline</h4>
              <p className="text-xl font-bold">+94 *** *** ***</p>
            </div>

            {/* Email */}
            <div>
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-xl font-bold">SUPPORT@TRADEHUB.LK</p>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold mb-2">Connected Here</h4>
              <p className="mb-3">STAY SOCIALLY CONNECTED</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-secondary transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-secondary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-secondary transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-secondary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-secondary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex justify-between items-center text-xs md:text-sm border-t border-primary-foreground/20 pt-6">
            <p>© 2026 Braintisa. All rights reserved.</p>
            <p>Built with Braintisa technology</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
