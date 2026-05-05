"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Car, Truck, Package, Bike, Bus, Tractor, CarFront } from "lucide-react";
import { useRouter } from "next/navigation";

const vehicleTypes = [
  { name: "Car", image: "https://th.bing.com/th/id/OIP.mGWet8mn7j4-Vcg2mJ8P6AHaKl?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3", slug: "car" },
  {
    name: "SUV",
    image: "https://www.evanshalshaw.com/-/media/evanshalshaw/blog/what-does-suv-mean/kia-sorento-exterior-front-1920x774px.ashx",
    slug: "suv"
  },
  {
    name: "Van",
    image: "https://png.pngtree.com/thumb_back/fh260/background/20230711/pngtree-white-background-blank-body-3d-illustration-of-a-small-load-transporting-image_3840807.jpg",
    slug: "van"
  },
  {
    name: "Bike",
    image: "https://images.unsplash.com/photo-1598548841213-9cdbcdf8ec47?fm=jpg&q=60&w=1200",
    slug: "bike"
  },
  {
    name: "Three Wheel",
    image: "https://lencar.lk/wp-content/uploads/2023/06/e-otto-electric-three-wheeler-in-sri-lanka-64929b1bf2435.webp",
    slug: "three-wheel"
  },
  {
    name: "Truck",
    image: "https://www.heavyhaulers.com/blog/wp-content/uploads/2021/07/AdobeStock_187341488-scaled.jpeg",
    slug: "truck"
  },
  {
    name: "Bus",
    image: "https://i.pinimg.com/474x/e7/48/67/e74867b353be83b45a5fecb0f17d1fab.jpg",
    slug: "bus"
  },
  {
    name: "Heavy",
    image: "https://www.pfleet.com/hs-fs/hubfs/types%20of%20construction%20vehicles.jpg?width=1500",
    slug: "heavy"
  }


];

const popularModels = [
  { name: "Toyota Prius", slug: "toyota-prius" },
  { name: "Toyota Camry", slug: "toyota-camry" },
  { name: "Toyota CHR", slug: "toyota-chr" },
  { name: "Suzuki Alto", slug: "suzuki-alto" },
  { name: "Honda CRV", slug: "honda-crv" },
  { name: "Honda Shuttle", slug: "honda-shuttle" },
  { name: "Toyota Premio", slug: "toyota-premio" },
  { name: "Hyundai Eon", slug: "hyundai-eon" },
  { name: "Nissan Leaf", slug: "nissan-leaf" },
  { name: "Toyota Land Cruiser", slug: "land-cruiser" },
  { name: "Toyota Corolla", slug: "toyota-corolla" },
  { name: "Land Rover Defender", slug: "defender" },
  { name: "Honda Civic", slug: "honda-civic" },
  { name: "Toyota Allion", slug: "toyota-allion" },
  { name: "Toyota Aqua", slug: "toyota-aqua" },
  { name: "BYD Seal", slug: "byd-seal" },
  { name: "Nissan Patrol", slug: "nissan-patrol" },
  { name: "Honda Accord", slug: "honda-accord" },
];

const VehicleTypes = () => {
  const router = useRouter();

  return (
    <section className="py-12 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Explore Vehicles
          </h2>
          <p className="text-muted-foreground text-base">
            Find your perfect vehicle by type or model
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vehicle Types */}
          <Card className="p-8 border-2 border-border hover:shadow-xl hover:border-primary/50 transition-all bg-gradient-to-br from-card to-card/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">Discover Vehicles by Type</h2>
                <p className="text-sm text-muted-foreground">
                  Find the perfect vehicle to suit your needs
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="mb-6 text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => router.push('/listings?category=vehicles')}
            >
              Explore All Vehicles <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {vehicleTypes.map((type, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all group hover:shadow-lg cursor-pointer h-32 sm:h-36"
                  onClick={() => router.push(`/listings?category=vehicles&type=${type.slug}`)}
                >
                  {/* Full Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={type.image}
                      alt={type.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient Overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70 group-hover:from-primary/40 group-hover:via-primary/50 group-hover:to-primary/80 transition-all duration-300" />
                  </div>

                  {/* Text Content */}
                  <div className="relative h-full flex items-end justify-center p-3">
                    <p className="text-white font-bold text-sm sm:text-base uppercase tracking-wide drop-shadow-lg group-hover:scale-110 transition-transform">
                      {type.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Popular Models */}
          <Card className="hidden md:block p-8 border-2 border-border hover:shadow-xl hover:border-primary/50 transition-all bg-gradient-to-br from-card to-card/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">Popular Car Models</h2>
                <p className="text-sm text-muted-foreground">
                  Explore your favorite vehicles by model
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="mb-6 text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => router.push('/listings?category=vehicles')}
            >
              Explore All Vehicles <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <div className="grid grid-cols-3 gap-3">
              {popularModels.map((model, index) => (
                <div
                  key={index}
                  className="text-center p-4 border-2 border-border rounded-xl cursor-pointer hover:bg-primary/10 hover:border-primary transition-all group hover:shadow-md"
                  onClick={() => router.push(`/listings?category=vehicles&model=${model.slug}`)}
                >
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
                    {model.name}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default VehicleTypes;
