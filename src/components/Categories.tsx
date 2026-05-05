"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import vehicleImg from "@/assets/category-vehicles.jpg";
import propertyImg from "@/assets/category-property.jpg";
import electronicsImg from "@/assets/category-electronics.jpg";
import furnitureImg from "@/assets/category-furniture.jpg";
import { ChevronRight } from "lucide-react";

const mainCategories = [
  {
    title: "VEHICLES",
    count: "17,161 Vehicle Ads Available",
    image: vehicleImg,
    slug: "vehicles",
  },
  {
    title: "PROPERTIES",
    count: "18,611 Property Ads Available",
    image: propertyImg,
    slug: "properties",
  },
  {
    title: "ELECTRONICS",
    count: "962 Electronics Ads Available",
    image: electronicsImg,
    slug: "electronics",
  },
  {
    title: "HOME & LIVING",
    count: "277 Home & Living Ads Available",
    image: furnitureImg,
    slug: "home-living",
  },
];

const Categories = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/5">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Find what you're looking for in our wide selection of products and services
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainCategories.map((category, index) => (
            <Link key={index} href={`/listings?category=${category.slug}`}>
              <Card
                className="bg-card border-2 border-border overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:scale-[1.02] hover:border-primary/50 group relative"
              >
                <div className="relative h-64 overflow-hidden bg-muted">
                  <img
                    src={typeof category.image === 'string' ? category.image : category.image.src}
                    alt={category.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2 group-hover:text-primary-foreground transition-colors">
                      {category.title}
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </h3>
                    <p className="text-sm text-white/90 font-medium">
                      {category.count}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-primary-foreground shadow-lg">
                      Explore
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
