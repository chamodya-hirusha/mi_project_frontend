"use client";

import { ChevronRight, Car, Shirt, Building2, Baby, Gamepad2, Sprout, Flag, GraduationCap, UtensilsCrossed, Sparkles } from "lucide-react";
import Link from "next/link";

const subcategories = [
  { name: "Automotive", count: "115 ads", icon: Car, color: "bg-red-100", slug: "automotive" },
  { name: "Fashion", count: "79 ads", icon: Shirt, color: "bg-blue-100", slug: "fashion" },
  { name: "Businesses & Industries", count: "59 ads", icon: Building2, color: "bg-purple-100", slug: "business" },
  { name: "Mother & Baby Care", count: "15 ads", icon: Baby, color: "bg-pink-100", slug: "baby-care" },
  { name: "Toys & Games", count: "29 ads", icon: Gamepad2, color: "bg-yellow-100", slug: "toys" },
  { name: "Agriculture", count: "7 ads", icon: Sprout, color: "bg-green-100", slug: "agriculture" },
  { name: "Made in Sri Lanka", count: "11 ads", icon: Flag, color: "bg-orange-100", slug: "sri-lanka" },
  { name: "Education", count: "29 ads", icon: GraduationCap, color: "bg-indigo-100", slug: "education" },
  { name: "Food and Beverage", count: "12 ads", icon: UtensilsCrossed, color: "bg-red-100", slug: "food" },
  { name: "Health and Beauty", count: "50 ads", icon: Sparkles, color: "bg-pink-100", slug: "beauty" },
];

const Subcategories = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-background to-muted/5">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Browse by Category</h2>
          <p className="text-muted-foreground text-base">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {subcategories.map((cat, index) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={index}
                href={`/listings?category=${cat.slug}`}
                className="flex items-center gap-3 p-5 bg-card border-2 border-border rounded-xl hover:shadow-xl hover:border-primary cursor-pointer transition-all group hover:scale-105"
              >
                <div className={`w-16 h-16 ${cat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-muted-foreground font-medium">{cat.count}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Subcategories;
