import { AdBannerData } from "@/components/AdBanner";

/**
 * Generate demo ad banners for admin management
 */
export const generateDemoAds = (): AdBannerData[] => {
    const positions = ["after-hero", "before-featured", "after-featured", "after-types", "before-cta", "before-footer"];
    const now = new Date().toISOString();

    const demoAds: AdBannerData[] = [
        {
            id: "demo-ad-1",
            title: "Premium Car Insurance",
            description: "Get comprehensive coverage for your vehicle. Special rates for TradeHub customers!",
            imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=400&fit=crop",
            linkUrl: "https://example.com/insurance",
            advertiser: "SecureAuto Insurance",
            type: "banner",
            position: "after-hero",
            enabled: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: "demo-ad-2",
            title: "Vehicle Financing Solutions",
            description: "Low interest rates starting from 7.5%. Quick approval in 24 hours!",
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop",
            linkUrl: "https://example.com/financing",
            advertiser: "QuickFinance Bank",
            type: "banner",
            position: "before-featured",
            enabled: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: "demo-ad-3",
            title: "Premium Car Detailing Service",
            description: "Professional car wash and detailing. Book now and get 20% off!",
            imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
            linkUrl: "https://example.com/detailing",
            advertiser: "ShineAuto Detailing",
            type: "banner",
            position: "after-featured",
            enabled: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: "demo-ad-4",
            title: "Auto Parts & Accessories",
            description: "Original parts for all vehicle brands. Free delivery islandwide!",
            imageUrl: "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=300&h=250&fit=crop",
            linkUrl: "https://example.com/parts",
            advertiser: "AutoParts Pro",
            type: "rectangle",
            position: "after-types",
            enabled: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: "demo-ad-5",
            title: "Vehicle Inspection Service",
            description: "Professional pre-purchase inspections. Trusted by thousands!",
            imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=250&fit=crop",
            linkUrl: "https://example.com/inspection",
            advertiser: "InspectPro",
            type: "rectangle",
            position: "before-cta",
            enabled: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: "demo-ad-6",
            title: "Car Rental Services",
            description: "Rent a car for your next trip. Best rates guaranteed!",
            imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=250&fit=crop",
            linkUrl: "https://example.com/rental",
            advertiser: "RentACar SL",
            type: "rectangle",
            position: "before-cta",
            enabled: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: "demo-ad-7",
            title: "GPS Tracking Systems",
            description: "Keep your vehicle safe with our GPS tracking solutions.",
            imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=250&h=250&fit=crop",
            linkUrl: "https://example.com/gps",
            advertiser: "TrackSecure",
            type: "square",
            position: "after-types",
            enabled: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: "demo-ad-8",
            title: "Vehicle Registration Services",
            description: "Fast and easy vehicle registration. We handle all paperwork!",
            imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=250&h=250&fit=crop",
            linkUrl: "https://example.com/registration",
            advertiser: "RegiFast",
            type: "square",
            position: "after-featured",
            enabled: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: "demo-ad-9",
            title: "Best Car Loans Available",
            description: "Competitive rates and flexible terms. Apply online today!",
            imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=400&fit=crop",
            linkUrl: "https://example.com/loans",
            advertiser: "EasyLoan Finance",
            type: "banner",
            position: "before-footer",
            enabled: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: "demo-ad-10",
            title: "Professional Car Maintenance",
            description: "Expert mechanics and quality service. Book your appointment now!",
            imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=250&fit=crop",
            linkUrl: "https://example.com/maintenance",
            advertiser: "AutoCare Services",
            type: "rectangle",
            position: "after-hero",
            enabled: true,
            createdAt: now,
            updatedAt: now,
        },
    ];

    return demoAds;
};

/**
 * Seed demo ads into localStorage
 */
export const seedDemoAds = () => {
    const existingAds = localStorage.getItem("adBanners");
    const hasAds = existingAds && JSON.parse(existingAds).length > 0;

    if (!hasAds) {
        const demoAds = generateDemoAds();
        localStorage.setItem("adBanners", JSON.stringify(demoAds));
        console.log("✅ Demo ads seeded");
        console.log(`📊 Ads: ${demoAds.length}`);
        return true;
    }
    return false;
};

/**
 * Force seed demo ads (overwrites existing)
 */
export const forceSeedDemoAds = () => {
    const demoAds = generateDemoAds();
    localStorage.setItem("adBanners", JSON.stringify(demoAds));
    console.log("✅ Demo ads force seeded");
    console.log(`📊 Ads: ${demoAds.length}`);
};
