"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import LocationSelector from "@/components/LocationSelector";
import LocationBanner from "@/components/LocationBanner";
import { useLocation as useLocationContext } from "@/contexts/LocationContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { VehicleListing, Location } from "@/types";
import { filterByLocation, sortByProximity, calculateDistance } from "@/lib/locationUtils";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { trackSearch, trackPageView } from "@/lib/analytics";

const Listings = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { userLocation } = useLocationContext();
  const searchQuery = searchParams.get("q") || "";

  const [vehicles, setVehicles] = useState<VehicleListing[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleListing[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Filters
  const [locationFilter, setLocationFilter] = useState<Location>({
    province: "",
    district: "",
    town: "",
  });
  const [filters, setFilters] = useState({
    vehicleType: searchParams.get("type") || "",
    make: searchParams.get("brand") || "",
    transmission: "",
    fuelType: "",
    condition: "",
    yearMin: "",
    yearMax: "",
    priceMin: "",
    priceMax: "",
    mileageMax: "",
    keywords: "",
    leasingOnly: false,
  });

  // Scroll to top when navigating to this page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    trackPageView("/listings");
  }, [pathname, searchParams]);

  // Update filters when URL params change
  useEffect(() => {
    const type = searchParams.get("type");
    const brand = searchParams.get("brand");

    if (type || brand) {
      setFilters(prev => ({
        ...prev,
        vehicleType: type || prev.vehicleType,
        make: brand || prev.make
      }));
    }
  }, [searchParams]);

  // Load vehicles and favorites
  useEffect(() => {
    const storedListings = localStorage.getItem("listings");
    const storedFavorites = localStorage.getItem("favorites");

    if (storedListings) {
      const allListings: VehicleListing[] = JSON.parse(storedListings);
      // Only show approved vehicles
      const approvedVehicles = allListings.filter(v => v.status === "approved");
      setVehicles(approvedVehicles);
    }

    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Use user location from context
  const userCoords = userLocation;

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedVehicles,
    goToPage,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({ data: filteredVehicles, itemsPerPage: 12 });

  // Apply filters
  useEffect(() => {
    let filtered = [...vehicles];

    // Search query
    if (searchQuery) {
      filtered = filtered.filter((v) =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter.province || locationFilter.district || locationFilter.town) {
      filtered = filterByLocation(filtered, {
        province: locationFilter.province || undefined,
        district: locationFilter.district || undefined,
        town: locationFilter.town || undefined,
      });
    }

    // Vehicle type filter
    if (filters.vehicleType) {
      filtered = filtered.filter((v) => v.vehicleType === filters.vehicleType);
    }

    // Make filter
    if (filters.make) {
      filtered = filtered.filter((v) =>
        v.make.toLowerCase().includes(filters.make.toLowerCase())
      );
    }

    // Transmission filter
    if (filters.transmission) {
      filtered = filtered.filter((v) => v.transmission === filters.transmission);
    }

    // Fuel type filter
    if (filters.fuelType) {
      filtered = filtered.filter((v) => v.fuelType === filters.fuelType);
    }

    // Condition filter
    if (filters.condition) {
      filtered = filtered.filter((v) => v.condition === filters.condition);
    }

    // Year range filter
    if (filters.yearMin) {
      filtered = filtered.filter((v) => v.year >= parseInt(filters.yearMin));
    }
    if (filters.yearMax) {
      filtered = filtered.filter((v) => v.year <= parseInt(filters.yearMax));
    }

    // Price range filter
    if (filters.priceMin) {
      filtered = filtered.filter((v) => v.price >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter((v) => v.price <= parseFloat(filters.priceMax));
    }

    // Mileage filter
    if (filters.mileageMax) {
      filtered = filtered.filter((v) => v.mileage <= parseInt(filters.mileageMax));
    }

    // Keywords filter
    if (filters.keywords) {
      filtered = filtered.filter((v) =>
        v.title.toLowerCase().includes(filters.keywords.toLowerCase()) ||
        v.description.toLowerCase().includes(filters.keywords.toLowerCase())
      );
    }

    // Leasing only filter
    if (filters.leasingOnly) {
      filtered = filtered.filter((v) => v.leasingAvailable);
    }

    // Sorting
    // Priority: If user location is available, sort by proximity first (nearest to farthest)
    if (userCoords) {
      filtered = sortByProximity(filtered, userCoords);

      // If user explicitly selected a different sort option, apply it after proximity
      if (sortBy === "price-low") {
        // Within same distance, sort by price
        filtered.sort((a, b) => {
          const coordsA = a.location.coordinates;
          const coordsB = b.location.coordinates;
          if (!coordsA || !coordsB) return 0;
          const distA = calculateDistance(userCoords, coordsA);
          const distB = calculateDistance(userCoords, coordsB);
          if (Math.abs(distA - distB) < 1) { // Within 1km, sort by price
            return a.price - b.price;
          }
          return distA - distB;
        });
      } else if (sortBy === "price-high") {
        filtered.sort((a, b) => {
          const coordsA = a.location.coordinates;
          const coordsB = b.location.coordinates;
          if (!coordsA || !coordsB) return 0;
          const distA = calculateDistance(userCoords, coordsA);
          const distB = calculateDistance(userCoords, coordsB);
          if (Math.abs(distA - distB) < 1) {
            return b.price - a.price;
          }
          return distA - distB;
        });
      } else if (sortBy === "year-new") {
        filtered.sort((a, b) => {
          const coordsA = a.location.coordinates;
          const coordsB = b.location.coordinates;
          if (!coordsA || !coordsB) return 0;
          const distA = calculateDistance(userCoords, coordsA);
          const distB = calculateDistance(userCoords, coordsB);
          if (Math.abs(distA - distB) < 1) {
            return b.year - a.year;
          }
          return distA - distB;
        });
      } else if (sortBy === "mileage-low") {
        filtered.sort((a, b) => {
          const coordsA = a.location.coordinates;
          const coordsB = b.location.coordinates;
          if (!coordsA || !coordsB) return 0;
          const distA = calculateDistance(userCoords, coordsA);
          const distB = calculateDistance(userCoords, coordsB);
          if (Math.abs(distA - distB) < 1) {
            return a.mileage - b.mileage;
          }
          return distA - distB;
        });
      }
      // If sortBy is "recent" or default, proximity sorting is already applied
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "year-new") {
      filtered.sort((a, b) => b.year - a.year);
    } else if (sortBy === "mileage-low") {
      filtered.sort((a, b) => a.mileage - b.mileage);
    } else {
      // Recent (default when no location)
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    }

    setFilteredVehicles(filtered);

    // Track search when filters are applied
    if (searchQuery || Object.values(filters).some(v => v !== "" && v !== false) ||
      Object.values(locationFilter).some(v => v !== "")) {
      const searchFilters = {
        vehicleType: filters.vehicleType || undefined,
        make: filters.make || undefined,
        province: locationFilter.province || undefined,
        district: locationFilter.district || undefined,
        town: locationFilter.town || undefined,
        priceMin: filters.priceMin || undefined,
        priceMax: filters.priceMax || undefined,
        yearMin: filters.yearMin || undefined,
        yearMax: filters.yearMax || undefined,
      };
      trackSearch(searchQuery || "", searchFilters);
    }
  }, [vehicles, searchQuery, locationFilter, filters, sortBy, userCoords]);

  const handleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const clearFilters = () => {
    setLocationFilter({ province: "", district: "", town: "" });
    setFilters({
      vehicleType: "",
      make: "",
      transmission: "",
      fuelType: "",
      condition: "",
      yearMin: "",
      yearMax: "",
      priceMin: "",
      priceMax: "",
      mileageMax: "",
      keywords: "",
      leasingOnly: false,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="border-b border-border py-4 sm:py-6 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Browse Vehicles in Sri Lanka
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <LocationBanner />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 sm:p-6 lg:sticky lg:top-4">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                  Filters
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs hover:text-destructive"
                >
                  Clear All
                </Button>
              </div>

              {/* Location Filter */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">LOCATION</h3>
                <LocationSelector
                  value={locationFilter}
                  onChange={setLocationFilter}
                  showLabels={false}
                />
              </div>

              {/* Proximity Info */}
              {userCoords && (
                <div className="mb-4 sm:mb-6 p-2 sm:p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-primary">
                        Showing nearest first
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Vehicles sorted by distance from your location
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Vehicle Type */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">VEHICLE TYPE</h3>
                <Select value={filters.vehicleType} onValueChange={(val) => setFilters({ ...filters, vehicleType: val === "all" ? "" : val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Bike">Bike</SelectItem>
                    <SelectItem value="Three-Wheeler">Three-Wheeler</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Make/Brand */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">MAKE/BRAND</h3>
                <Input
                  placeholder="e.g., Toyota, Honda"
                  value={filters.make}
                  onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                />
              </div>

              {/* Transmission */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">TRANSMISSION</h3>
                <Select value={filters.transmission} onValueChange={(val) => setFilters({ ...filters, transmission: val === "all" ? "" : val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fuel Type */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">FUEL TYPE</h3>
                <Select value={filters.fuelType} onValueChange={(val) => setFilters({ ...filters, fuelType: val === "all" ? "" : val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Condition */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">CONDITION</h3>
                <Select value={filters.condition} onValueChange={(val) => setFilters({ ...filters, condition: val === "all" ? "" : val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Brand New">Brand New</SelectItem>
                    <SelectItem value="Used">Used</SelectItem>
                    <SelectItem value="Reconditioned">Reconditioned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Year Range */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">YEAR</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.yearMin}
                    onChange={(e) => setFilters({ ...filters, yearMin: e.target.value })}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.yearMax}
                    onChange={(e) => setFilters({ ...filters, yearMax: e.target.value })}
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">PRICE (LKR)</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                  />
                </div>
              </div>

              {/* Mileage */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">MAX MILEAGE (km)</h3>
                <Input
                  placeholder="e.g., 50000"
                  type="number"
                  value={filters.mileageMax}
                  onChange={(e) => setFilters({ ...filters, mileageMax: e.target.value })}
                />
              </div>

              {/* Leasing Available */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="leasing"
                    checked={filters.leasingOnly}
                    onCheckedChange={(checked) => setFilters({ ...filters, leasingOnly: checked })}
                  />
                  <Label htmlFor="leasing" className="text-xs sm:text-sm font-medium">
                    Leasing Available Only
                  </Label>
                </div>
              </div>
            </Card>
          </div>

          {/* Vehicle Grid */}
          <div className="lg:col-span-3">
            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Showing {filteredVehicles.length} result{filteredVehicles.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Label htmlFor="sort" className="text-xs sm:text-sm whitespace-nowrap">Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort" className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="year-new">Year: Newest First</SelectItem>
                    <SelectItem value="mileage-low">Mileage: Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results */}
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-8 sm:py-16">
                <div className="max-w-md mx-auto px-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Search className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">No vehicles found</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button onClick={clearFilters} variant="outline" size="sm" className="text-xs sm:text-sm">
                    Clear All Filters
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">
                  Showing {startIndex} to {endIndex} of {totalItems} vehicles
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      distance={
                        userCoords && vehicle.location.coordinates
                          ? Math.round(
                            Math.sqrt(
                              Math.pow(userCoords.lat - vehicle.location.coordinates.lat, 2) +
                              Math.pow(userCoords.lng - vehicle.location.coordinates.lng, 2)
                            ) * 111
                          )
                          : undefined
                      }
                      onFavorite={handleFavorite}
                      isFavorite={favorites.includes(vehicle.id)}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={previousPage}
                            className={!canGoPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => goToPage(page)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}
                        <PaginationItem>
                          <PaginationNext
                            onClick={nextPage}
                            className={!canGoNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Listings;
