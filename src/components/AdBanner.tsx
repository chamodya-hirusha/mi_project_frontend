import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { trackAdClick } from "@/lib/analytics";

export interface AdBannerData {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    linkUrl: string;
    advertiser?: string;
    type: "banner" | "rectangle" | "square" | "skyscraper";
    position?: string;
    enabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface AdBannerProps {
    size?: "banner" | "rectangle" | "square" | "skyscraper";
    position?: string;
    className?: string;
    showDemo?: boolean;
}

// Demo ads data
const demoAds: AdBannerData[] = [
    {
        id: "demo-ad-1",
        title: "Premium Car Insurance",
        description: "Get comprehensive coverage for your vehicle. Special rates for TradeHub customers!",
        imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=400&fit=crop",
        linkUrl: "#",
        advertiser: "SecureAuto Insurance",
        type: "banner",
    },
    {
        id: "demo-ad-2",
        title: "Vehicle Financing Solutions",
        description: "Low interest rates starting from 7.5%. Quick approval in 24 hours!",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop",
        linkUrl: "#",
        advertiser: "QuickFinance Bank",
        type: "banner",
    },
    {
        id: "demo-ad-3",
        title: "Premium Car Detailing Service",
        description: "Professional car wash and detailing. Book now and get 20% off!",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
        linkUrl: "#",
        advertiser: "ShineAuto Detailing",
        type: "banner",
    },
    {
        id: "demo-ad-4",
        title: "Auto Parts & Accessories",
        description: "Original parts for all vehicle brands. Free delivery islandwide!",
        imageUrl: "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=300&h=250&fit=crop",
        linkUrl: "#",
        advertiser: "AutoParts Pro",
        type: "rectangle",
    },
    {
        id: "demo-ad-5",
        title: "Vehicle Inspection Service",
        description: "Professional pre-purchase inspections. Trusted by thousands!",
        imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=250&fit=crop",
        linkUrl: "#",
        advertiser: "InspectPro",
        type: "rectangle",
    },
    {
        id: "demo-ad-6",
        title: "Car Rental Services",
        description: "Rent a car for your next trip. Best rates guaranteed!",
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=250&fit=crop",
        linkUrl: "#",
        advertiser: "RentACar SL",
        type: "rectangle",
    },
    {
        id: "demo-ad-7",
        title: "GPS Tracking Systems",
        description: "Keep your vehicle safe with our GPS tracking solutions.",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=250&h=250&fit=crop",
        linkUrl: "#",
        advertiser: "TrackSecure",
        type: "square",
    },
    {
        id: "demo-ad-8",
        title: "Vehicle Registration Services",
        description: "Fast and easy vehicle registration. We handle all paperwork!",
        imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=250&h=250&fit=crop",
        linkUrl: "#",
        advertiser: "RegiFast",
        type: "square",
    },
];

const AdBanner = ({ size = "banner", position, className = "", showDemo = true }: AdBannerProps) => {
    const [ads, setAds] = useState<AdBannerData[]>([]);
    const [isClosed, setIsClosed] = useState(false);
    const [adContainerId] = useState(`ad-container-${position || "default"}-${Math.random().toString(36).substr(2, 9)}`);
    const [api, setApi] = useState<any>(null);
    const [current, setCurrent] = useState(0);

    // Auto-play plugin for the carousel - configured to always work automatically
    const autoplayPlugin = Autoplay({
        delay: 4000, // Auto-rotate every 4 seconds
        stopOnInteraction: false, // Don't stop when user interacts
        stopOnMouseEnter: false, // Don't stop on hover
        stopOnFocusIn: false, // Don't stop on focus
    });

    useEffect(() => {
        // Check if this ad position was closed by user
        const closedAds = JSON.parse(localStorage.getItem("closedAds") || "[]");
        if (closedAds.includes(position)) {
            setIsClosed(true);
            return;
        }

        if (showDemo) {
            // Try to load ads from localStorage first
            const storedAds = JSON.parse(localStorage.getItem("adBanners") || "[]");
            const positionAds = storedAds.filter(
                (ad: AdBannerData) => 
                    ad.position === position && 
                    ad.enabled !== false &&
                    (size === "rectangle" ? ad.type === "rectangle" : 
                     size === "square" ? ad.type === "square" : 
                     ad.type === "banner")
            );

            if (positionAds.length > 0) {
                // Use all stored ads for this position
                setAds(positionAds);
                return;
            }

            // Fallback to demo ads
            let filteredAds = demoAds;
            if (size === "rectangle") {
                filteredAds = demoAds.filter((ad) => ad.type === "rectangle");
            } else if (size === "square") {
                filteredAds = demoAds.filter((ad) => ad.type === "square");
            } else {
                filteredAds = demoAds.filter((ad) => ad.type === "banner");
            }

            // Filter by position if specified
            if (position) {
                filteredAds = filteredAds.filter((ad) => ad.position === position);
            }

            if (filteredAds.length > 0) {
                setAds(filteredAds);
            }
        } else {
            // For Google Ads integration, this is where you would load the ad
            // Example: window.adsbygoogle = window.adsbygoogle || [].push({});
            setAds([]);
        }
    }, [size, showDemo, position]);

    // Track current slide
    useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsClosed(true);
        
        // Store closed ad position in localStorage
        const closedAds = JSON.parse(localStorage.getItem("closedAds") || "[]");
        if (!closedAds.includes(position)) {
            closedAds.push(position);
            localStorage.setItem("closedAds", JSON.stringify(closedAds));
        }
    };

    const handleAdClick = (ad: AdBannerData) => (e: React.MouseEvent) => {
        if (ad && ad.linkUrl !== "#") {
            // Track ad click (analytics)
            trackAdClick({
                id: ad.id,
                title: ad.title,
                advertiser: ad.advertiser,
                position: position || "unknown",
                type: ad.type,
                linkUrl: ad.linkUrl,
            });
            
            window.open(ad.linkUrl, "_blank", "noopener,noreferrer");
        }
        e.preventDefault();
    };

    // Size classes
    const sizeClasses = {
        banner: "w-full h-[200px] md:h-[250px]",
        rectangle: "w-full max-w-[300px] h-[250px]",
        square: "w-full max-w-[250px] h-[250px]",
        skyscraper: "w-full max-w-[160px] h-[600px]",
    };

    if (!showDemo && ads.length === 0) {
        // Google Ads placeholder
        return (
            <div className={`${className} flex items-center justify-center bg-muted/30 border border-dashed border-border rounded-lg`}>
                <div
                    id={adContainerId}
                    className={`${sizeClasses[size]} flex items-center justify-center`}
                >
                    {/* Google Ads will be injected here */}
                    <ins
                        className="adsbygoogle"
                        style={{ display: "block" }}
                        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                        data-ad-slot="XXXXXXXXXX"
                        data-ad-format={size === "banner" ? "horizontal" : "auto"}
                    />
                </div>
            </div>
        );
    }

    if (ads.length === 0 || isClosed) return null;

    // If only one ad, don't show carousel controls
    const showCarousel = ads.length > 1;

    return (
        <div className={`${className} relative ${sizeClasses[size]}`}>
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[autoplayPlugin]}
                className="w-full h-full"
            >
                <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all h-full relative w-full">
                    {/* Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-30 h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                        onClick={handleClose}
                    >
                        <X className="w-4 h-4" />
                    </Button>

                    <CarouselContent className="h-full -ml-0">
                        {ads.map((ad, index) => (
                            <CarouselItem key={ad.id} className="h-full pl-0">
                                <div
                                    className="relative w-full h-full cursor-pointer group"
                                    onClick={handleAdClick(ad)}
                                >
                                    {/* Ad Image */}
                                    <img
                                        src={ad.imageUrl}
                                        alt={ad.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />

                                    {/* Overlay with Ad Content */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-6">
                                        <div className="text-white">
                                            {ad.advertiser && (
                                                <span className="text-xs md:text-sm font-medium text-primary mb-1 block">
                                                    {ad.advertiser}
                                                </span>
                                            )}
                                            <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2">
                                                {ad.title}
                                            </h3>
                                            {ad.description && (
                                                <p className="text-xs md:text-sm text-white/90 line-clamp-2 mb-3">
                                                    {ad.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-primary">
                                                <span>Learn More</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ad Badge */}
                                    <div className="absolute top-2 left-2 z-10">
                                        <span className="bg-primary/90 text-primary-foreground text-[10px] px-2 py-1 rounded font-medium">
                                            Ad
                                        </span>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation Buttons - Only show if multiple ads */}
                    {showCarousel && (
                        <>
                            <CarouselPrevious className="left-2 h-10 w-10 bg-black/50 hover:bg-black/70 text-white border-0 shadow-lg" />
                            <CarouselNext className="right-2 h-10 w-10 bg-black/50 hover:bg-black/70 text-white border-0 shadow-lg" />
                        </>
                    )}

                    {/* Dots Indicator - Only show if multiple ads */}
                    {showCarousel && ads.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                            {ads.map((_, index) => (
                                <button
                                    key={index}
                                    className={`h-2 rounded-full transition-all ${
                                        index === current
                                            ? "w-8 bg-primary"
                                            : "w-2 bg-white/50 hover:bg-white/70"
                                    }`}
                                    onClick={() => api?.scrollTo(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </Card>
            </Carousel>
        </div>
    );
};

export default AdBanner;
