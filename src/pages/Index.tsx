"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedListings from "@/components/FeaturedListings";
import VehicleBrands from "@/components/VehicleBrands";
import VehicleTypes from "@/components/VehicleTypes";
import Footer from "@/components/Footer";
import AIAssistantChat from "@/components/AIAssistantChat";
import AdBanner from "@/components/AdBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Shield, Calculator, MapPin, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

const Index = () => {
  useEffect(() => {
    trackPageView("/");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Ad Banner - Empty space between Hero and Why Choose Us */}
      <section className="py-6 md:py-8 bg-background">
        <div className="container mx-auto px-4">
          <AdBanner size="banner" position="after-hero" showDemo={true} />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Why Choose TradeHub Leasing?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
              Sri Lanka's trusted platform for buying and leasing vehicles
            </p>
          </div>

          {/* Mobile: Two Parts */}
          <div className="grid grid-cols-2 md:hidden gap-4 sm:gap-5">
            {/* Part 1: Left Side */}
            <div className="grid grid-rows-3 gap-4 sm:gap-5">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg flex flex-col">
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Verified Listings</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    All vehicle listings are verified by our team before going live
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg flex flex-col">
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Easy Leasing</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Calculate payments instantly and apply for leasing in minutes
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg flex flex-col">
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Nationwide Coverage</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Find vehicles across all 9 provinces in Sri Lanka
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Part 2: Right Side */}
            <div className="grid grid-rows-3 gap-4 sm:gap-5">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg flex flex-col">
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Quick Approval</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Get lease approval within 2-3 business days
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg flex flex-col">
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Competitive Rates</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Interest rates starting from 8.5% with flexible terms
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg flex flex-col">
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Car className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Wide Selection</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    From economy cars to luxury vehicles, find what you need
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Desktop: Original 3 Column Grid */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Verified Listings</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      All vehicle listings are verified by our team before going live
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Easy Leasing</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Calculate payments instantly and apply for leasing in minutes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Nationwide Coverage</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Find vehicles across all 9 provinces in Sri Lanka
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Quick Approval</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Get lease approval within 2-3 business days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Competitive Rates</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Interest rates starting from 8.5% with flexible terms
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Wide Selection</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      From economy cars to luxury vehicles, find what you need
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <FeaturedListings />
      <VehicleTypes />
      <VehicleBrands />

      {/* Ad Banner - Empty space between Vehicle Brands and CTA */}
      <section className="py-6 md:py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <AdBanner size="rectangle" position="before-cta" showDemo={true} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-transparent border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Vehicle?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're buying or leasing, we make it easy. Start browsing now or post your own vehicle for sale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/listings">
                <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg w-full sm:w-auto">
                  <Car className="w-5 h-5 mr-2" />
                  Browse Vehicles
                </Button>
              </Link>
              <Link href="/post-ad">
                <Button size="lg" variant="outline" className="shadow-lg w-full sm:w-auto">
                  Post Your Vehicle
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner - Empty space between CTA and Footer */}
      <section className="py-6 md:py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <AdBanner size="banner" position="before-footer" showDemo={true} />
        </div>
      </section>

      <Footer />
      <AIAssistantChat />
    </div>
  );
};

export default Index;
