"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import VehicleCard from "@/components/VehicleCard";
import { VehicleListing } from "@/types";
import { useLocation } from "@/contexts/LocationContext";
import { sortByProximity } from "@/lib/locationUtils";

const FeaturedListings = () => {
  const [vehicles, setVehicles] = useState<VehicleListing[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const router = useRouter();
  const { userLocation } = useLocation();

  useEffect(() => {
    const storedListings = JSON.parse(localStorage.getItem("listings") || "[]");
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    // Filter approved and featured vehicles
    let featuredVehicles = storedListings
      .filter((v: VehicleListing) => v.status === "approved" && v.featured);

    // Sort by proximity if user location is available (nearest first)
    if (userLocation) {
      featuredVehicles = sortByProximity(featuredVehicles, userLocation);
    } else {
      // Otherwise sort by most recent
      featuredVehicles.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    }

    // Take top 6
    featuredVehicles = featuredVehicles.slice(0, 6);

    setVehicles(featuredVehicles);
    setFavorites(storedFavorites);
  }, [userLocation]);

  const handleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const handleViewAll = () => {
    router.push('/listings');
  };

  if (vehicles.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background via-muted/10 to-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-6 h-6 text-primary fill-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Featured Vehicles
              </h2>
            </div>
            <p className="text-muted-foreground text-base">
              Handpicked premium vehicles available now
            </p>
          </div>
          <Button
            variant="outline"
            className="text-primary hover:text-primary-foreground hover:bg-primary border-primary group transition-all"
            onClick={handleViewAll}
          >
            View All Vehicles
            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onFavorite={handleFavorite}
              isFavorite={favorites.includes(vehicle.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
