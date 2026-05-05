"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// High-quality vehicle images with dark/black backgrounds for the carousel
const vehicleImages = [
  "/assets/vehicles/toyota_axio_front.png",
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1920&q=90",
];

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [api, setApi] = useState<CarouselApi>();
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/listings?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/listings");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Auto-play plugin for the carousel
  const autoplayPlugin = Autoplay({
    delay: 4000,
    stopOnInteraction: false,
    stopOnMouseEnter: false,
  });

  return (
    <section className="relative border-b border-border py-16 overflow-hidden">
      {/* Background Carousel - Video-like effect */}
      <div className="absolute inset-0 z-0">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayPlugin]}
          setApi={setApi}
          className="w-full h-full"
        >
          <CarouselContent className="h-full -ml-0">
            {vehicleImages.map((image, index) => (
              <CarouselItem key={index} className="h-full pl-0 basis-full">
                <div
                  className="h-full w-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${image})`,
                    height: "100%",
                    minHeight: "800px",
                  }}
                >
                  {/* Light overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Content Layer - Above the carousel */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <div className="mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              Find Your <span className="text-primary">Dream Vehicle</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md">
            Browse thousands of vehicles across Sri Lanka. Buy outright or apply for easy leasing.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row items-center gap-4 p-4">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by make, model, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg h-14 pl-12 border-0 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 h-14 px-8 rounded-lg shadow-md hover:shadow-lg transition-all w-full md:w-auto"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5 mr-2" />
              Search Vehicles
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg border border-border shadow-lg">
              <div className="text-2xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Vehicles Listed</div>
            </div>
            <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg border border-border shadow-lg">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg border border-border shadow-lg">
              <div className="text-2xl font-bold text-primary">8.5%+</div>
              <div className="text-sm text-muted-foreground">Interest Rates</div>
            </div>
            <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg border border-border shadow-lg">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
