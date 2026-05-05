import { SearchEvent, ViewEvent, PageViewEvent, UserLocationEvent, LeaseApplicationEvent, AdClickEvent } from "@/lib/analytics";

// Demo search queries
const demoSearchQueries = [
  "Toyota Aqua",
  "Honda Civic",
  "Suzuki Alto",
  "Nissan Leaf",
  "BMW 3 Series",
  "Mercedes Benz",
  "Hyundai Elantra",
  "Mazda 3",
  "Toyota Corolla",
  "Honda Accord",
  "SUV",
  "Electric Car",
  "Hybrid Vehicle",
  "Used Car",
  "Brand New",
  "",
  "",
  "",
];

// Demo provinces in Sri Lanka
const provinces = [
  "Western Province",
  "Central Province",
  "Southern Province",
  "Northern Province",
  "Eastern Province",
  "North Western Province",
  "North Central Province",
  "Uva Province",
  "Sabaragamuwa Province",
];

// Demo districts
const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Vavuniya",
  "Batticaloa",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Moneragala",
  "Ratnapura",
  "Kegalle",
];

// Generate demo analytics data
export const generateDemoAnalytics = () => {
  const now = Date.now();
  const searches: SearchEvent[] = [];
  const views: ViewEvent[] = [];
  const pageViews: PageViewEvent[] = [];
  const locations: UserLocationEvent[] = [];
  const leaseApplications: LeaseApplicationEvent[] = [];

  // Get demo vehicles from localStorage
  const storedListings = localStorage.getItem("listings");
  const vehicles = storedListings ? JSON.parse(storedListings) : [];

  // Generate search events (last 90 days)
  for (let i = 0; i < 500; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const timestamp = new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const query = demoSearchQueries[Math.floor(Math.random() * demoSearchQueries.length)];
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    const district = districts[Math.floor(Math.random() * districts.length)];

    searches.push({
      id: `search_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      query: query || "",
      filters: {
        vehicleType: Math.random() > 0.7 ? ["Car", "SUV", "Van", "Bike"][Math.floor(Math.random() * 4)] : undefined,
        make: Math.random() > 0.6 ? ["Toyota", "Honda", "Suzuki", "Nissan"][Math.floor(Math.random() * 4)] : undefined,
        province: Math.random() > 0.5 ? province : undefined,
        district: Math.random() > 0.7 ? district : undefined,
        priceMin: Math.random() > 0.8 ? "1000000" : undefined,
        priceMax: Math.random() > 0.8 ? "10000000" : undefined,
        yearMin: Math.random() > 0.8 ? "2015" : undefined,
        yearMax: Math.random() > 0.8 ? "2024" : undefined,
      },
      userLocation: Math.random() > 0.3 ? {
        lat: 6.9 + (Math.random() - 0.5) * 0.5,
        lng: 79.8 + (Math.random() - 0.5) * 0.5,
        province: province,
        district: district,
      } : undefined,
      timestamp,
      userId: Math.random() > 0.6 ? `user-${Math.floor(Math.random() * 10)}` : undefined,
      sessionId: `session_${Math.floor(Math.random() * 100)}`,
    });
  }

  // Generate view events (last 90 days)
  const approvedVehicles = vehicles.filter((v: any) => v.status === "approved");
  for (let i = 0; i < 800; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const timestamp = new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const vehicle = approvedVehicles[Math.floor(Math.random() * approvedVehicles.length)];
    
    if (vehicle) {
      const province = provinces[Math.floor(Math.random() * provinces.length)];
      const district = districts[Math.floor(Math.random() * districts.length)];

      views.push({
        id: `view_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        vehicleId: vehicle.id,
        vehicleTitle: vehicle.title,
        vehicleLocation: vehicle.location || {
          province: province,
          district: district,
          town: "City",
        },
        userLocation: Math.random() > 0.3 ? {
          lat: 6.9 + (Math.random() - 0.5) * 0.5,
          lng: 79.8 + (Math.random() - 0.5) * 0.5,
          province: province,
          district: district,
        } : undefined,
        timestamp,
        userId: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 10)}` : undefined,
        sessionId: `session_${Math.floor(Math.random() * 100)}`,
        referrer: Math.random() > 0.7 ? "https://google.com" : undefined,
      });
    }
  }

  // Generate page view events (last 90 days)
  const pages = ["/", "/listings", "/listing/", "/dashboard", "/post-ad", "/auth"];
  for (let i = 0; i < 1200; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const timestamp = new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const page = pages[Math.floor(Math.random() * pages.length)];
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    const district = districts[Math.floor(Math.random() * districts.length)];

    pageViews.push({
      id: `page_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      page: page === "/listing/" ? `/listing/${approvedVehicles[Math.floor(Math.random() * approvedVehicles.length)]?.id || "demo"}` : page,
      timestamp,
      userId: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 10)}` : undefined,
      sessionId: `session_${Math.floor(Math.random() * 100)}`,
      userLocation: Math.random() > 0.4 ? {
        lat: 6.9 + (Math.random() - 0.5) * 0.5,
        lng: 79.8 + (Math.random() - 0.5) * 0.5,
        province: province,
        district: district,
      } : undefined,
      referrer: Math.random() > 0.6 ? ["https://google.com", "https://facebook.com", undefined][Math.floor(Math.random() * 3)] : undefined,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    });
  }

  // Generate location events (last 90 days)
  for (let i = 0; i < 300; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const timestamp = new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    const district = districts[Math.floor(Math.random() * districts.length)];

    locations.push({
      id: `location_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      location: {
        lat: 6.9 + (Math.random() - 0.5) * 0.5,
        lng: 79.8 + (Math.random() - 0.5) * 0.5,
        province: province,
        district: district,
      },
      timestamp,
      sessionId: `session_${Math.floor(Math.random() * 100)}`,
    });
  }

  // Generate lease application events (last 90 days)
  const employmentStatuses = ["Employed", "Self-Employed", "Business Owner", "Other"];
  for (let i = 0; i < 200; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const timestamp = new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const vehicle = approvedVehicles[Math.floor(Math.random() * approvedVehicles.length)];
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    const district = districts[Math.floor(Math.random() * districts.length)];
    const employmentStatus = employmentStatuses[Math.floor(Math.random() * employmentStatuses.length)];
    
    if (vehicle) {
      const loanAmount = Math.floor(vehicle.price * (0.5 + Math.random() * 0.4)); // 50-90% of vehicle price
      const downPayment = vehicle.price - loanAmount;
      const loanDuration = [24, 36, 48, 60, 72][Math.floor(Math.random() * 5)];
      const interestRate = 8.5 + Math.random() * 4; // 8.5% to 12.5%
      const monthlyPayment = Math.round((loanAmount * (interestRate / 100 / 12)) / (1 - Math.pow(1 + (interestRate / 100 / 12), -loanDuration)));
      const monthlyIncome = Math.floor(monthlyPayment * (1.5 + Math.random() * 1.5)); // 1.5x to 3x monthly payment

      const statuses: Array<"pending" | "in-review" | "approved" | "rejected" | "cancelled"> = ["pending", "in-review", "approved", "rejected", "cancelled"];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      leaseApplications.push({
        id: `lease_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        applicationId: `app_${i}_${Date.now()}`,
        vehicleId: vehicle.id,
        vehicleTitle: vehicle.title,
        vehiclePrice: vehicle.price,
        applicantId: `user-${Math.floor(Math.random() * 10)}`,
        applicantName: `Applicant ${i + 1}`,
        applicantLocation: {
          province: province,
          district: district,
          town: "City",
        },
        employmentStatus: employmentStatus,
        monthlyIncome: monthlyIncome,
        loanAmount: loanAmount,
        downPayment: downPayment,
        loanDuration: loanDuration,
        monthlyPayment: monthlyPayment,
        interestRate: Math.round(interestRate * 10) / 10,
        status: status,
        timestamp,
        userId: Math.random() > 0.3 ? `user-${Math.floor(Math.random() * 10)}` : undefined,
        sessionId: `session_${Math.floor(Math.random() * 100)}`,
      });
    }
  }

  // Generate demo ad clicks
  const adClicks: AdClickEvent[] = [];
  const adPositions = ["after-hero", "before-featured", "after-featured", "after-types", "before-cta", "before-footer"];
  const adTypes: Array<"banner" | "rectangle" | "square" | "skyscraper"> = ["banner", "rectangle", "square"];
  const demoAds = [
    { id: "demo-ad-1", title: "Premium Car Insurance", advertiser: "SecureAuto Insurance" },
    { id: "demo-ad-2", title: "Vehicle Financing Solutions", advertiser: "QuickFinance Bank" },
    { id: "demo-ad-3", title: "Premium Car Detailing Service", advertiser: "ShineAuto Detailing" },
    { id: "demo-ad-4", title: "Auto Parts & Accessories", advertiser: "AutoParts Pro" },
    { id: "demo-ad-5", title: "Vehicle Inspection Service", advertiser: "InspectPro" },
    { id: "demo-ad-6", title: "Car Rental Services", advertiser: "RentACar SL" },
  ];

  for (let i = 0; i < 150; i++) {
    const ad = demoAds[Math.floor(Math.random() * demoAds.length)];
    const position = adPositions[Math.floor(Math.random() * adPositions.length)];
    const type = adTypes[Math.floor(Math.random() * adTypes.length)];
    const userLocation = locations[Math.floor(Math.random() * locations.length)]?.location;
    const sessionId = `session_${Math.floor(Math.random() * 1000)}`;
    const userId = Math.random() > 0.3 ? `user_${Math.floor(Math.random() * 50)}` : undefined;
    
    const clickTime = new Date();
    clickTime.setDate(clickTime.getDate() - Math.floor(Math.random() * 30));

    adClicks.push({
      id: `adclick_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      adId: ad.id,
      adTitle: ad.title,
      advertiser: ad.advertiser,
      adPosition: position,
      adType: type,
      linkUrl: "https://example.com",
      userLocation: userLocation ? {
        lat: userLocation.lat,
        lng: userLocation.lng,
        province: userLocation.province,
        district: userLocation.district,
        town: userLocation.town,
      } : undefined,
      timestamp: clickTime.toISOString(),
      userId,
      sessionId,
      referrer: Math.random() > 0.5 ? "https://google.com" : undefined,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    });
  }

  return {
    searches,
    views,
    pageViews,
    locations,
    leaseApplications,
    adClicks,
  };
};

/**
 * Seed demo analytics data
 * Seeds data if any analytics category is empty
 */
export const seedDemoAnalytics = () => {
  const existingSearches = localStorage.getItem("analytics_searches");
  const existingViews = localStorage.getItem("analytics_views");
  const existingPageViews = localStorage.getItem("analytics_pageviews");
  const existingLocations = localStorage.getItem("analytics_locations");
  const existingLeaseApps = localStorage.getItem("analytics_lease_applications");
  const existingAdClicks = localStorage.getItem("analytics_ad_clicks");

  // Check if any category is missing or empty
  const hasSearches = existingSearches && JSON.parse(existingSearches).length > 0;
  const hasViews = existingViews && JSON.parse(existingViews).length > 0;
  const hasPageViews = existingPageViews && JSON.parse(existingPageViews).length > 0;
  const hasLocations = existingLocations && JSON.parse(existingLocations).length > 0;
  const hasLeaseApps = existingLeaseApps && JSON.parse(existingLeaseApps).length > 0;
  const hasAdClicks = existingAdClicks && JSON.parse(existingAdClicks).length > 0;

  // Generate demo data
  const demoData = generateDemoAnalytics();
  
  // Seed if any category is missing
  if (!hasSearches || !hasViews || !hasPageViews || !hasLocations || !hasLeaseApps || !hasAdClicks) {
    // Only seed categories that are missing
    if (!hasSearches) {
      localStorage.setItem("analytics_searches", JSON.stringify(demoData.searches));
    }
    if (!hasViews) {
      localStorage.setItem("analytics_views", JSON.stringify(demoData.views));
    }
    if (!hasPageViews) {
      localStorage.setItem("analytics_pageviews", JSON.stringify(demoData.pageViews));
    }
    if (!hasLocations) {
      localStorage.setItem("analytics_locations", JSON.stringify(demoData.locations));
    }
    if (!hasLeaseApps) {
      localStorage.setItem("analytics_lease_applications", JSON.stringify(demoData.leaseApplications));
    }
    if (!hasAdClicks) {
      localStorage.setItem("analytics_ad_clicks", JSON.stringify(demoData.adClicks));
    }
    
    console.log("✅ Demo analytics data seeded");
    console.log(`📊 Searches: ${demoData.searches.length}, Views: ${demoData.views.length}, Page Views: ${demoData.pageViews.length}, Locations: ${demoData.locations.length}, Lease Applications: ${demoData.leaseApplications.length}, Ad Clicks: ${demoData.adClicks.length}`);
  } else {
    // Even if data exists, ensure ad clicks are seeded if missing
    if (!hasAdClicks) {
      const demoData = generateDemoAnalytics();
      localStorage.setItem("analytics_ad_clicks", JSON.stringify(demoData.adClicks));
      console.log("✅ Ad clicks data seeded");
      console.log(`📊 Ad Clicks: ${demoData.adClicks.length}`);
    } else {
      console.log("ℹ️ Analytics data already exists, skipping seed");
    }
  }
};

/**
 * Force seed all demo analytics data (overwrites existing data)
 */
export const forceSeedDemoAnalytics = () => {
  const demoData = generateDemoAnalytics();
  
  localStorage.setItem("analytics_searches", JSON.stringify(demoData.searches));
  localStorage.setItem("analytics_views", JSON.stringify(demoData.views));
  localStorage.setItem("analytics_pageviews", JSON.stringify(demoData.pageViews));
  localStorage.setItem("analytics_locations", JSON.stringify(demoData.locations));
  localStorage.setItem("analytics_lease_applications", JSON.stringify(demoData.leaseApplications));
  localStorage.setItem("analytics_ad_clicks", JSON.stringify(demoData.adClicks));
  
  console.log("✅ All demo analytics data force seeded");
  console.log(`📊 Searches: ${demoData.searches.length}, Views: ${demoData.views.length}, Page Views: ${demoData.pageViews.length}, Locations: ${demoData.locations.length}, Lease Applications: ${demoData.leaseApplications.length}, Ad Clicks: ${demoData.adClicks.length}`);
};
