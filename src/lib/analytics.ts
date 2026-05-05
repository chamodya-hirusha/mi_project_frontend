/**
 * Analytics tracking utility
 * Collects data about user behavior, searches, views, and traffic
 */

export interface SearchEvent {
  id: string;
  query: string;
  filters: {
    vehicleType?: string;
    make?: string;
    province?: string;
    district?: string;
    town?: string;
    priceMin?: string;
    priceMax?: string;
    yearMin?: string;
    yearMax?: string;
  };
  userLocation?: {
    lat: number;
    lng: number;
    province?: string;
    district?: string;
    town?: string;
  };
  timestamp: string;
  userId?: string;
  sessionId: string;
}

export interface ViewEvent {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleLocation: {
    province: string;
    district: string;
    town: string;
  };
  userLocation?: {
    lat: number;
    lng: number;
    province?: string;
    district?: string;
    town?: string;
  };
  timestamp: string;
  userId?: string;
  sessionId: string;
  referrer?: string;
}

export interface PageViewEvent {
  id: string;
  page: string;
  timestamp: string;
  userId?: string;
  sessionId: string;
  userLocation?: {
    lat: number;
    lng: number;
    province?: string;
    district?: string;
    town?: string;
  };
  referrer?: string;
  userAgent?: string;
}

export interface UserLocationEvent {
  id: string;
  location: {
    lat: number;
    lng: number;
    province?: string;
    district?: string;
    town?: string;
  };
  timestamp: string;
  sessionId: string;
}

export interface LeaseApplicationEvent {
  id: string;
  applicationId: string;
  vehicleId: string;
  vehicleTitle: string;
  vehiclePrice: number;
  applicantId: string;
  applicantName: string;
  applicantLocation: {
    province: string;
    district: string;
    town: string;
  };
  employmentStatus: string;
  monthlyIncome: number;
  loanAmount: number;
  downPayment: number;
  loanDuration: number;
  monthlyPayment: number;
  interestRate: number;
  status: "pending" | "in-review" | "approved" | "rejected" | "cancelled";
  timestamp: string;
  userId?: string;
  sessionId: string;
}

export interface AdClickEvent {
  id: string;
  adId: string;
  adTitle: string;
  advertiser?: string;
  adPosition: string;
  adType: "banner" | "rectangle" | "square" | "skyscraper";
  linkUrl: string;
  userLocation?: {
    lat: number;
    lng: number;
    province?: string;
    district?: string;
    town?: string;
  };
  timestamp: string;
  userId?: string;
  sessionId: string;
  referrer?: string;
  userAgent?: string;
}

// Get or create session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

// Get current user ID
const getUserId = (): string | undefined => {
  try {
    const user = localStorage.getItem("currentUser");
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.id;
    }
  } catch {
    // Ignore errors
  }
  return undefined;
};

// Get user location from context or sessionStorage
const getUserLocation = (): { lat: number; lng: number; province?: string; district?: string; town?: string } | undefined => {
  try {
    const location = sessionStorage.getItem("userLocation");
    if (location) {
      const coords = JSON.parse(location);
      return {
        lat: coords.lat,
        lng: coords.lng,
      };
    }
  } catch {
    // Ignore errors
  }
  return undefined;
};

// Get referrer
const getReferrer = (): string | undefined => {
  return document.referrer || undefined;
};

// Get user agent
const getUserAgent = (): string | undefined => {
  return navigator.userAgent || undefined;
};

/**
 * Track a search event
 */
export const trackSearch = (query: string, filters: SearchEvent["filters"]) => {
  try {
    const searchEvent: SearchEvent = {
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      query,
      filters,
      userLocation: getUserLocation(),
      timestamp: new Date().toISOString(),
      userId: getUserId(),
      sessionId: getSessionId(),
    };

    const searches = JSON.parse(localStorage.getItem("analytics_searches") || "[]");
    searches.push(searchEvent);
    
    // Keep only last 10000 searches
    if (searches.length > 10000) {
      searches.splice(0, searches.length - 10000);
    }
    
    localStorage.setItem("analytics_searches", JSON.stringify(searches));
  } catch (error) {
    console.error("Failed to track search:", error);
  }
};

/**
 * Track a vehicle view
 */
export const trackVehicleView = (vehicleId: string, vehicleTitle: string, vehicleLocation: ViewEvent["vehicleLocation"]) => {
  try {
    const viewEvent: ViewEvent = {
      id: `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      vehicleId,
      vehicleTitle,
      vehicleLocation,
      userLocation: getUserLocation(),
      timestamp: new Date().toISOString(),
      userId: getUserId(),
      sessionId: getSessionId(),
      referrer: getReferrer(),
    };

    const views = JSON.parse(localStorage.getItem("analytics_views") || "[]");
    views.push(viewEvent);
    
    // Keep only last 10000 views
    if (views.length > 10000) {
      views.splice(0, views.length - 10000);
    }
    
    localStorage.setItem("analytics_views", JSON.stringify(views));
  } catch (error) {
    console.error("Failed to track vehicle view:", error);
  }
};

/**
 * Track a page view
 */
export const trackPageView = (page: string) => {
  try {
    const pageViewEvent: PageViewEvent = {
      id: `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      page,
      timestamp: new Date().toISOString(),
      userId: getUserId(),
      sessionId: getSessionId(),
      userLocation: getUserLocation(),
      referrer: getReferrer(),
      userAgent: getUserAgent(),
    };

    const pageViews = JSON.parse(localStorage.getItem("analytics_pageviews") || "[]");
    pageViews.push(pageViewEvent);
    
    // Keep only last 10000 page views
    if (pageViews.length > 10000) {
      pageViews.splice(0, pageViews.length - 10000);
    }
    
    localStorage.setItem("analytics_pageviews", JSON.stringify(pageViews));
  } catch (error) {
    console.error("Failed to track page view:", error);
  }
};

/**
 * Track user location
 */
export const trackUserLocation = (location: UserLocationEvent["location"]) => {
  try {
    const locationEvent: UserLocationEvent = {
      id: `location_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      location,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
    };

    const locations = JSON.parse(localStorage.getItem("analytics_locations") || "[]");
    locations.push(locationEvent);
    
    // Keep only last 5000 location events
    if (locations.length > 5000) {
      locations.splice(0, locations.length - 5000);
    }
    
    localStorage.setItem("analytics_locations", JSON.stringify(locations));
  } catch (error) {
    console.error("Failed to track user location:", error);
  }
};

/**
 * Track lease application submission
 */
export const trackLeaseApplication = (application: {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  vehiclePrice: number;
  applicantId: string;
  applicantName: string;
  applicantLocation: {
    province: string;
    district: string;
    town: string;
  };
  employmentStatus: string;
  monthlyIncome: number;
  loanAmount: number;
  downPayment: number;
  loanDuration: number;
  monthlyPayment: number;
  interestRate: number;
  status: string;
}) => {
  try {
    const applicationEvent: LeaseApplicationEvent = {
      id: `lease_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      applicationId: application.id,
      vehicleId: application.vehicleId,
      vehicleTitle: application.vehicleTitle,
      vehiclePrice: application.vehiclePrice,
      applicantId: application.applicantId,
      applicantName: application.applicantName,
      applicantLocation: application.applicantLocation,
      employmentStatus: application.employmentStatus,
      monthlyIncome: application.monthlyIncome,
      loanAmount: application.loanAmount,
      downPayment: application.downPayment,
      loanDuration: application.loanDuration,
      monthlyPayment: application.monthlyPayment,
      interestRate: application.interestRate,
      status: application.status as any,
      timestamp: new Date().toISOString(),
      userId: getUserId(),
      sessionId: getSessionId(),
    };

    const applications = JSON.parse(localStorage.getItem("analytics_lease_applications") || "[]");
    applications.push(applicationEvent);
    
    // Keep only last 5000 applications
    if (applications.length > 5000) {
      applications.splice(0, applications.length - 5000);
    }
    
    localStorage.setItem("analytics_lease_applications", JSON.stringify(applications));
  } catch (error) {
    console.error("Failed to track lease application:", error);
  }
};

/**
 * Track lease application status change
 */
export const trackLeaseApplicationStatusChange = (applicationId: string, oldStatus: string, newStatus: string) => {
  try {
    const applications = JSON.parse(localStorage.getItem("analytics_lease_applications") || "[]");
    const application = applications.find((a: LeaseApplicationEvent) => a.applicationId === applicationId);
    
    if (application) {
      application.status = newStatus as any;
      localStorage.setItem("analytics_lease_applications", JSON.stringify(applications));
    }
  } catch (error) {
    console.error("Failed to track lease application status change:", error);
  }
};

/**
 * Track ad click
 */
export const trackAdClick = (ad: {
  id: string;
  title: string;
  advertiser?: string;
  position: string;
  type: "banner" | "rectangle" | "square" | "skyscraper";
  linkUrl: string;
}) => {
  try {
    const adClickEvent: AdClickEvent = {
      id: `adclick_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      adId: ad.id,
      adTitle: ad.title,
      advertiser: ad.advertiser,
      adPosition: ad.position,
      adType: ad.type,
      linkUrl: ad.linkUrl,
      userLocation: getUserLocation(),
      timestamp: new Date().toISOString(),
      userId: getUserId(),
      sessionId: getSessionId(),
      referrer: getReferrer(),
      userAgent: getUserAgent(),
    };

    const adClicks = JSON.parse(localStorage.getItem("analytics_ad_clicks") || "[]");
    adClicks.push(adClickEvent);
    
    // Keep only last 10000 ad clicks
    if (adClicks.length > 10000) {
      adClicks.splice(0, adClicks.length - 10000);
    }
    
    localStorage.setItem("analytics_ad_clicks", JSON.stringify(adClicks));
  } catch (error) {
    console.error("Failed to track ad click:", error);
  }
};

/**
 * Get all analytics data
 */
export const getAnalyticsData = () => {
  try {
    return {
      searches: JSON.parse(localStorage.getItem("analytics_searches") || "[]") as SearchEvent[],
      views: JSON.parse(localStorage.getItem("analytics_views") || "[]") as ViewEvent[],
      pageViews: JSON.parse(localStorage.getItem("analytics_pageviews") || "[]") as PageViewEvent[],
      locations: JSON.parse(localStorage.getItem("analytics_locations") || "[]") as UserLocationEvent[],
      leaseApplications: JSON.parse(localStorage.getItem("analytics_lease_applications") || "[]") as LeaseApplicationEvent[],
      adClicks: JSON.parse(localStorage.getItem("analytics_ad_clicks") || "[]") as AdClickEvent[],
    };
  } catch (error) {
    console.error("Failed to get analytics data:", error);
    return {
      searches: [],
      views: [],
      pageViews: [],
      locations: [],
      leaseApplications: [],
      adClicks: [],
    };
  }
};

/**
 * Clear all analytics data
 */
export const clearAnalyticsData = () => {
  localStorage.removeItem("analytics_searches");
  localStorage.removeItem("analytics_views");
  localStorage.removeItem("analytics_pageviews");
  localStorage.removeItem("analytics_locations");
  localStorage.removeItem("analytics_lease_applications");
  localStorage.removeItem("analytics_ad_clicks");
};
