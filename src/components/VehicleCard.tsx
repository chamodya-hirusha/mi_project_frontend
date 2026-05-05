"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Gauge, Fuel, Calendar, CreditCard } from "lucide-react";
import { VehicleListing } from "@/types";
import { defaultLeaseSettings } from "@/lib/mockData";
import { useEffect, useState } from "react";

interface VehicleCardProps {
    vehicle: VehicleListing;
    distance?: number;
    onFavorite?: (id: string) => void;
    isFavorite?: boolean;
}

const VehicleCard = ({ vehicle, distance, onFavorite, isFavorite = false }: VehicleCardProps) => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem("currentUser");
        if (userStr) {
            const user = JSON.parse(userStr);
            const adminCheck = user.email === "admin@tradehub.lk" ||
                user.role === "super-admin" ||
                user.role === "admin" ||
                user.role === "branch-manager" ||
                user.role === "ad-manager" ||
                user.isAdmin === true;
            setIsAdmin(adminCheck);
        }
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatMileage = (mileage: number) => {
        if (mileage === 0) return "Brand New";
        if (mileage >= 1000) {
            return `${(mileage / 1000).toFixed(0)}k km`;
        }
        return `${mileage} km`;
    };

    // Calculate best lease rental if not provided
    const calculateLeaseRental = (price: number): number => {
        // Use default values: 20% down payment, 48 months, 12.5% interest rate
        const downPaymentPercent = 20;
        const loanDuration = 48; // months
        const interestRate = defaultLeaseSettings.defaultInterestRate;

        const downPayment = (price * downPaymentPercent) / 100;
        const loanAmount = price - downPayment;

        // Monthly interest rate
        const monthlyRate = interestRate / 100 / 12;

        // Calculate monthly payment using amortization formula
        const monthlyPayment = monthlyRate === 0
            ? loanAmount / loanDuration
            : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanDuration)) /
            (Math.pow(1 + monthlyRate, loanDuration) - 1);

        return Math.round(monthlyPayment);
    };

    // Get lease rental - use existing value or calculate
    const leaseRental = vehicle.leaseRental || calculateLeaseRental(vehicle.price);

    return (
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border">
            <Link href={`/listing/${vehicle.id}`}>
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                        src={vehicle.images[0] || "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"}
                        alt={vehicle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badges Overlay */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {vehicle.featured && (
                            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                        )}
                        {vehicle.condition === "Brand New" && (
                            <Badge className="bg-green-600 text-white">Brand New</Badge>
                        )}
                        {vehicle.leasingAvailable && (
                            <Badge variant="secondary" className="bg-blue-600 text-white">
                                Leasing Available
                            </Badge>
                        )}
                    </div>

                    {/* Favorite Button */}
                    {onFavorite && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onFavorite(vehicle.id);
                            }}
                            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                        >
                            <Heart
                                className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
                                    }`}
                            />
                        </button>
                    )}

                    {/* Distance Badge */}
                    {distance !== undefined && (
                        <div className="absolute bottom-3 right-3">
                            <Badge variant="secondary" className="bg-white/90 text-gray-900">
                                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance}km`} away
                            </Badge>
                        </div>
                    )}
                </div>
            </Link>

            <CardContent className="p-4">
                <Link href={`/listing/${vehicle.id}`}>
                    {/* Title and Price */}
                    <div className="mb-3">
                        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                            {vehicle.title}
                        </h3>
                        <p className="text-2xl font-bold text-primary mt-1">
                            {formatPrice(vehicle.price)}
                        </p>
                        {/* Best Lease Rental - Always shown for all vehicles */}
                        <div className="mt-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground font-medium">Best Lease Rental</p>
                                    <p className="text-base font-bold text-green-600 dark:text-green-400">
                                        {formatPrice(leaseRental)}<span className="text-xs font-normal text-muted-foreground">/month</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Info Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{vehicle.year}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Gauge className="w-4 h-4" />
                            <span>{formatMileage(vehicle.mileage)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Fuel className="w-4 h-4" />
                            <span>{vehicle.fuelType}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs">⚙️</span>
                            <span>{vehicle.transmission}</span>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">
                            {vehicle.location.town}, {vehicle.location.district}
                        </span>
                    </div>
                </Link>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <Link href={`/listing/${vehicle.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                            View Details
                        </Button>
                    </Link>
                    {vehicle.leasingAvailable && (
                        isAdmin ? (
                            <Button
                                className="w-full"
                                size="sm"
                                disabled
                                title="Admins cannot apply for leasing"
                            >
                                Apply Lease
                            </Button>
                        ) : (
                            <Link href={`/listing/${vehicle.id}`} className="flex-1">
                                <Button className="w-full" size="sm">
                                    Apply Lease
                                </Button>
                            </Link>
                        )
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default VehicleCard;
