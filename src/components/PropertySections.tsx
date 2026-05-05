"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home, Building2, Store, Map, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";

const popularAreas = [
  { name: "Colombo", slug: "colombo" },
  { name: "Gampaha", slug: "gampaha" },
  { name: "Kurunegala", slug: "kurunegala" },
  { name: "Matara", slug: "matara" },
  { name: "Negombo", slug: "negombo" },
  { name: "Ratnapura", slug: "ratnapura" },
  { name: "Anuradhapura", slug: "anuradhapura" },
  { name: "Maharagama", slug: "maharagama" },
  { name: "Panadura", slug: "panadura" },
  { name: "Matale", slug: "matale" },
  { name: "Gampola", slug: "gampola" },
  { name: "Ambalangoda", slug: "ambalangoda" },
  { name: "Hambantota", slug: "hambantota" },
  { name: "Minuwangoda", slug: "minuwangoda" },
  { name: "Badulla", slug: "badulla" },
  { name: "Kelaniya", slug: "kelaniya" },
  { name: "Puttalam", slug: "puttalam" },
  { name: "Moratuwa", slug: "moratuwa" },
];

const propertyTypes = [
  { name: "House", icon: Home, slug: "house", color: "text-blue-500" },
  { name: "Lands", icon: Landmark, slug: "lands", color: "text-green-500" },
  { name: "Apartments", icon: Building2, slug: "apartments", color: "text-purple-500" },
  { name: "Commercial", icon: Store, slug: "commercial", color: "text-orange-500" },
];

const PropertySections = () => {
  const router = useRouter();

  return (
    <section className="py-16 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Find Your Perfect Property
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Explore properties by location or type across Sri Lanka
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Popular Areas */}
          <Card className="p-8 border-2 border-border hover:shadow-xl hover:border-primary/50 transition-all bg-gradient-to-br from-card to-card/50">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Popular Property Areas</h3>
              <p className="text-sm text-muted-foreground">
                Find properties in Sri Lanka's most sought-after locations
              </p>
            </div>
            <Button
              variant="outline"
              className="mb-6 text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-all w-full"
              onClick={() => router.push('/listings?category=properties')}
            >
              Explore All Properties <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <div className="grid grid-cols-3 gap-3">
              {popularAreas.map((area, index) => (
                <div
                  key={index}
                  className="text-center p-4 border-2 border-border rounded-xl cursor-pointer hover:bg-primary/10 hover:border-primary transition-all group hover:shadow-md hover:scale-105"
                  onClick={() => router.push(`/listings?category=properties&location=${area.slug}`)}
                >
                  <Map className="w-5 h-5 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
                    {area.name}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Property Types */}
          <Card className="p-8 border-2 border-primary bg-gradient-to-br from-category-primary via-category-primary/90 to-category-primary/80 hover:shadow-2xl transition-all">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2 text-primary-foreground">
                Property Types
              </h3>
              <p className="text-sm text-primary-foreground/90">
                Browse properties for sale or rent
              </p>
            </div>
            <Button
              variant="outline"
              className="mb-6 w-full bg-white/20 backdrop-blur-sm text-primary-foreground border-2 border-primary-foreground hover:bg-white hover:text-primary font-semibold transition-all shadow-lg hover:shadow-xl"
              onClick={() => router.push('/listings?category=properties')}
            >
              Explore All Properties <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <div className="grid grid-cols-2 gap-4">
              {/* For Sale */}
              <div className="border-2 border-primary-foreground rounded-xl p-6 hover:bg-primary-foreground/10 transition-all bg-background/10 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-4 text-center text-primary-foreground">FOR SALE</h3>
                <div className="grid grid-cols-2 gap-3">
                  {propertyTypes.map((type, index) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={index}
                        className="text-center p-4 bg-white rounded-xl cursor-pointer hover:shadow-xl hover:scale-110 transition-all group border border-primary-foreground/20"
                        onClick={() => router.push(`/listings?category=properties&type=${type.slug}&purpose=sale`)}
                      >
                        <div className="flex justify-center mb-2 group-hover:scale-125 transition-transform duration-300">
                          <IconComponent className={`w-10 h-10 ${type.color || 'text-primary'}`} />
                        </div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {type.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* For Rent */}
              <div className="border-2 border-primary-foreground rounded-xl p-6 hover:bg-primary-foreground/10 transition-all bg-background/10 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-4 text-center text-primary-foreground">FOR RENT</h3>
                <div className="grid grid-cols-2 gap-3">
                  {propertyTypes.map((type, index) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={index}
                        className="text-center p-4 bg-white rounded-xl cursor-pointer hover:shadow-xl hover:scale-110 transition-all group border border-primary-foreground/20"
                        onClick={() => router.push(`/listings?category=properties&type=${type.slug}&purpose=rent`)}
                      >
                        <div className="flex justify-center mb-2 group-hover:scale-125 transition-transform duration-300">
                          <IconComponent className={`w-10 h-10 ${type.color || 'text-primary'}`} />
                        </div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {type.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PropertySections;
