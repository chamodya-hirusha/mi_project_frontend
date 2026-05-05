"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileMenu from "@/components/admin/AdminMobileMenu";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    BarChart3,
    Search,
    Eye,
    MapPin,
    TrendingUp,
    Users,
    Car,
    Globe,
    Calendar,
    Filter,
    Download,
    Trash2,
    FileText,
    DollarSign,
    Briefcase,
    X,
    ExternalLink,
    CheckCircle2,
    Clock,
    ChevronDown,
    ChevronUp,
    SlidersHorizontal
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip, LineChart, Line, AreaChart, Area } from "recharts";
import { getAnalyticsData, clearAnalyticsData, SearchEvent, ViewEvent, PageViewEvent, UserLocationEvent, LeaseApplicationEvent, AdClickEvent } from "@/lib/analytics";
import { generateDemoAnalytics, forceSeedDemoAnalytics } from "@/data/demoAnalytics";
import { getAllProvinces, getDistrictsByProvince } from "@/lib/locationData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminAnalytics = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [analytics, setAnalytics] = useState<{
        searches: SearchEvent[];
        views: ViewEvent[];
        pageViews: PageViewEvent[];
        locations: UserLocationEvent[];
        leaseApplications: LeaseApplicationEvent[];
        adClicks: AdClickEvent[];
    }>({
        searches: [],
        views: [],
        pageViews: [],
        locations: [],
        leaseApplications: [],
        adClicks: [],
    });
    const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all" | "custom">("30d");
    const [customDateFrom, setCustomDateFrom] = useState<Date | undefined>(undefined);
    const [customDateTo, setCustomDateTo] = useState<Date | undefined>(undefined);
    // Global Filters
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    // Advanced Filters
    const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);
    const [selectedVehicleMake, setSelectedVehicleMake] = useState<string | null>(null);
    const [selectedAdType, setSelectedAdType] = useState<string | null>(null);
    const [selectedAdvertiser, setSelectedAdvertiser] = useState<string | null>(null);
    const [selectedEmploymentStatus, setSelectedEmploymentStatus] = useState<string | null>(null);
    const [loanAmountMin, setLoanAmountMin] = useState<string>("");
    const [loanAmountMax, setLoanAmountMax] = useState<string>("");
    const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
    // Modal Dialog Filters (for viewing details)
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [selectedLoanDuration, setSelectedLoanDuration] = useState<number | null>(null);
    // Searches filters
    const [selectedSearchQuery, setSelectedSearchQuery] = useState<string | null>(null);
    const [selectedSearchRegion, setSelectedSearchRegion] = useState<string | null>(null);
    // Views filters
    const [selectedViewVehicleId, setSelectedViewVehicleId] = useState<string | null>(null);
    const [selectedViewRegion, setSelectedViewRegion] = useState<string | null>(null);
    // Regional Data filters
    const [selectedPopularRegion, setSelectedPopularRegion] = useState<string | null>(null);
    const [selectedPopularVehicleId, setSelectedPopularVehicleId] = useState<string | null>(null);
    // Traffic filters
    const [selectedTrafficRegion, setSelectedTrafficRegion] = useState<string | null>(null);
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    // Ad Clicks filters (for modal dialogs)
    const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
    const [selectedAdPosition, setSelectedAdPosition] = useState<string | null>(null);

    useEffect(() => {
        const user = localStorage.getItem("currentUser");
        if (!user) {
            toast({
                title: "Access Denied",
                description: "Please sign in to access the admin dashboard",
                variant: "destructive",
            });
            router.push("/auth");
            return;
        }

        const parsedUser = JSON.parse(user);
        const hasAdminAccess = parsedUser.email === "admin@tradehub.lk" ||
            parsedUser.role === "super-admin" ||
            parsedUser.role === "admin" ||
            parsedUser.isAdmin === true;

        if (!hasAdminAccess || parsedUser.role === "ad-manager") {
            toast({
                title: "Access Denied",
                description: parsedUser.role === "ad-manager"
                    ? "Ads Managers do not have access to Analytics"
                    : "You don't have permission to access this page",
                variant: "destructive",
            });
            router.push(parsedUser.role === "ad-manager" ? "/admin" : "/");
            return;
        }

        setCurrentUser(parsedUser);
        loadAnalytics();
    }, [router, toast]);

    const loadAnalytics = () => {
        const data = getAnalyticsData();
        const now = new Date();
        let cutoffDate: Date;
        let maxDate: Date = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow to include today

        switch (dateRange) {
            case "7d":
                cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "30d":
                cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "90d":
                cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case "custom":
                cutoffDate = customDateFrom || new Date(0);
                maxDate = customDateTo ? new Date(customDateTo.getTime() + 24 * 60 * 60 * 1000) : new Date(now.getTime() + 24 * 60 * 60 * 1000);
                break;
            default:
                cutoffDate = new Date(0);
        }

        const filterByDate = <T extends { timestamp: string }>(items: T[]): T[] => {
            return items.filter(item => {
                const itemDate = new Date(item.timestamp);
                return itemDate >= cutoffDate && itemDate < maxDate;
            });
        };

        // Filter by date first
        let filteredData = {
            searches: filterByDate(data.searches),
            views: filterByDate(data.views),
            pageViews: filterByDate(data.pageViews),
            locations: filterByDate(data.locations),
            leaseApplications: filterByDate(data.leaseApplications),
            adClicks: filterByDate(data.adClicks || []),
        };

        // Apply all filters comprehensively
        filteredData.searches = filteredData.searches.filter(s => {
            // Location filters
            const location = s.userLocation || { province: s.filters.province, district: s.filters.district };
            if (selectedProvince && location && location.province !== selectedProvince) return false;
            if (selectedDistrict && location && location.district && location.district !== selectedDistrict) return false;

            // User ID filter
            if (selectedUserId && s.userId !== selectedUserId) return false;

            // Session ID filter
            if (selectedSessionId && s.sessionId !== selectedSessionId) return false;

            // Vehicle type filter
            if (selectedVehicleType && s.filters.vehicleType !== selectedVehicleType) return false;

            // Vehicle make filter
            if (selectedVehicleMake && s.filters.make !== selectedVehicleMake) return false;

            return true;
        });

        filteredData.views = filteredData.views.filter(v => {
            // Location filters
            const location = v.userLocation || { province: v.vehicleLocation.province, district: v.vehicleLocation.district };
            if (selectedProvince && location && location.province !== selectedProvince) return false;
            if (selectedDistrict && location && location.district && location.district !== selectedDistrict) return false;

            // User ID filter
            if (selectedUserId && v.userId !== selectedUserId) return false;

            // Session ID filter
            if (selectedSessionId && v.sessionId !== selectedSessionId) return false;

            return true;
        });

        filteredData.pageViews = filteredData.pageViews.filter(p => {
            // Location filters
            const location = p.userLocation;
            if (selectedProvince && location && location.province !== selectedProvince) return false;
            if (selectedDistrict && location && location.district && location.district !== selectedDistrict) return false;

            // User ID filter
            if (selectedUserId && p.userId !== selectedUserId) return false;

            // Session ID filter
            if (selectedSessionId && p.sessionId !== selectedSessionId) return false;

            return true;
        });

        filteredData.leaseApplications = filteredData.leaseApplications.filter(a => {
            // Location filters
            if (selectedProvince && a.applicantLocation.province !== selectedProvince) return false;
            if (selectedDistrict && a.applicantLocation.district !== selectedDistrict) return false;

            // User ID filter
            if (selectedUserId && a.userId !== selectedUserId) return false;

            // Session ID filter
            if (selectedSessionId && a.sessionId !== selectedSessionId) return false;

            // Employment status filter
            if (selectedEmploymentStatus && a.employmentStatus !== selectedEmploymentStatus) return false;

            // Loan amount filters
            if (loanAmountMin && a.loanAmount < parseFloat(loanAmountMin)) return false;
            if (loanAmountMax && a.loanAmount > parseFloat(loanAmountMax)) return false;

            return true;
        });

        filteredData.adClicks = filteredData.adClicks.filter(ac => {
            // Location filters
            const location = ac.userLocation;
            if (selectedProvince && location && location.province !== selectedProvince) return false;
            if (selectedDistrict && location && location.district && location.district !== selectedDistrict) return false;

            // User ID filter
            if (selectedUserId && ac.userId !== selectedUserId) return false;

            // Session ID filter
            if (selectedSessionId && ac.sessionId !== selectedSessionId) return false;

            // Ad type filter
            if (selectedAdType && ac.adType !== selectedAdType) return false;

            // Advertiser filter
            if (selectedAdvertiser && ac.advertiser !== selectedAdvertiser) return false;

            return true;
        });

        setAnalytics(filteredData);
    };

    const handleClearData = () => {
        clearAnalyticsData();
        setAnalytics({
            searches: [],
            views: [],
            pageViews: [],
            locations: [],
            leaseApplications: [],
        });
        toast({
            title: "Analytics Cleared",
            description: "All analytics data has been cleared",
        });
        loadAnalytics();
    };

    const handleSeedDemoData = () => {
        forceSeedDemoAnalytics();

        toast({
            title: "Demo Data Seeded",
            description: "All demo analytics data including ad clicks has been generated and stored",
        });

        loadAnalytics();
    };

    // Get most searched vehicles
    const getMostSearchedVehicles = () => {
        const searchCounts: Record<string, { query: string; count: number; filters: any }> = {};

        analytics.searches.forEach(search => {
            const key = search.query.toLowerCase().trim() || "empty";
            if (!searchCounts[key]) {
                searchCounts[key] = {
                    query: search.query || "(empty)",
                    count: 0,
                    filters: search.filters,
                };
            }
            searchCounts[key].count++;
        });

        return Object.values(searchCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);
    };

    // Get searches by region
    const getSearchesByRegion = () => {
        const regionCounts: Record<string, number> = {};

        analytics.searches.forEach(search => {
            const region = search.userLocation?.province ||
                search.filters.province ||
                "Unknown";
            regionCounts[region] = (regionCounts[region] || 0) + 1;
        });

        return Object.entries(regionCounts)
            .map(([region, count]) => ({ region, count }))
            .sort((a, b) => b.count - a.count);
    };

    // Get most viewed vehicles
    const getMostViewedVehicles = () => {
        const viewCounts: Record<string, { vehicleId: string; title: string; count: number; location: any }> = {};

        analytics.views.forEach(view => {
            if (!viewCounts[view.vehicleId]) {
                viewCounts[view.vehicleId] = {
                    vehicleId: view.vehicleId,
                    title: view.vehicleTitle,
                    count: 0,
                    location: view.vehicleLocation,
                };
            }
            viewCounts[view.vehicleId].count++;
        });

        return Object.values(viewCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);
    };

    // Get views by region
    const getViewsByRegion = () => {
        const regionCounts: Record<string, number> = {};

        analytics.views.forEach(view => {
            const region = view.userLocation?.province ||
                view.vehicleLocation.province ||
                "Unknown";
            regionCounts[region] = (regionCounts[region] || 0) + 1;
        });

        return Object.entries(regionCounts)
            .map(([region, count]) => ({ region, count }))
            .sort((a, b) => b.count - a.count);
    };

    // Get popular vehicles by region
    const getPopularVehiclesByRegion = () => {
        const regionVehicles: Record<string, Record<string, number>> = {};

        analytics.views.forEach(view => {
            const region = view.vehicleLocation.province || "Unknown";
            if (!regionVehicles[region]) {
                regionVehicles[region] = {};
            }
            regionVehicles[region][view.vehicleId] = (regionVehicles[region][view.vehicleId] || 0) + 1;
        });

        const result: Array<{ region: string; vehicles: Array<{ vehicleId: string; title: string; count: number }> }> = [];

        Object.entries(regionVehicles).forEach(([region, vehicles]) => {
            const topVehicles = Object.entries(vehicles)
                .map(([vehicleId, count]) => {
                    const view = analytics.views.find(v => v.vehicleId === vehicleId);
                    return {
                        vehicleId,
                        title: view?.vehicleTitle || "Unknown",
                        count,
                    };
                })
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

            result.push({ region, vehicles: topVehicles });
        });

        return result.sort((a, b) => {
            const totalA = a.vehicles.reduce((sum, v) => sum + v.count, 0);
            const totalB = b.vehicles.reduce((sum, v) => sum + v.count, 0);
            return totalB - totalA;
        });
    };

    // Get traffic by region (where users come from)
    const getTrafficByRegion = () => {
        const regionCounts: Record<string, number> = {};

        analytics.locations.forEach(location => {
            const region = location.location.province || "Unknown";
            regionCounts[region] = (regionCounts[region] || 0) + 1;
        });

        // Also count from page views
        analytics.pageViews.forEach(pageView => {
            const region = pageView.userLocation?.province || "Unknown";
            regionCounts[region] = (regionCounts[region] || 0) + 1;
        });

        return Object.entries(regionCounts)
            .map(([region, count]) => ({ region, count }))
            .sort((a, b) => b.count - a.count);
    };

    // Get page views stats
    const getPageViewsStats = () => {
        const pageCounts: Record<string, number> = {};

        analytics.pageViews.forEach(pageView => {
            pageCounts[pageView.page] = (pageCounts[pageView.page] || 0) + 1;
        });

        return Object.entries(pageCounts)
            .map(([page, count]) => ({ page, count }))
            .sort((a, b) => b.count - a.count);
    };

    // Get unique sessions
    const getUniqueSessions = () => {
        const sessions = new Set<string>();
        analytics.searches.forEach(s => sessions.add(s.sessionId));
        analytics.views.forEach(v => sessions.add(v.sessionId));
        analytics.pageViews.forEach(p => sessions.add(p.sessionId));
        return sessions.size;
    };

    // Get unique users
    const getUniqueUsers = () => {
        const users = new Set<string>();
        analytics.searches.forEach(s => s.userId && users.add(s.userId));
        analytics.views.forEach(v => v.userId && users.add(v.userId));
        analytics.pageViews.forEach(p => p.userId && users.add(p.userId));
        analytics.leaseApplications.forEach(a => a.userId && users.add(a.userId));
        (analytics.adClicks || []).forEach(ac => ac.userId && users.add(ac.userId));
        return users.size;
    };

    // Get most clicked ads
    const getMostClickedAds = () => {
        const adCounts: Record<string, { adId: string; title: string; advertiser?: string; count: number; linkUrl: string }> = {};

        analytics.adClicks.forEach(click => {
            if (!adCounts[click.adId]) {
                adCounts[click.adId] = {
                    adId: click.adId,
                    title: click.adTitle,
                    advertiser: click.advertiser,
                    count: 0,
                    linkUrl: click.linkUrl,
                };
            }
            adCounts[click.adId].count++;
        });

        return Object.values(adCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);
    };

    // Get ad clicks by position
    const getAdClicksByPosition = () => {
        const positionCounts: Record<string, number> = {};

        (analytics.adClicks || []).forEach(click => {
            positionCounts[click.adPosition] = (positionCounts[click.adPosition] || 0) + 1;
        });

        return Object.entries(positionCounts)
            .map(([position, count]) => ({ position, count }))
            .sort((a, b) => b.count - a.count);
    };

    // Get ad clicks by advertiser
    const getAdClicksByAdvertiser = () => {
        const advertiserCounts: Record<string, number> = {};

        (analytics.adClicks || []).forEach(click => {
            const advertiser = click.advertiser || "Unknown";
            advertiserCounts[advertiser] = (advertiserCounts[advertiser] || 0) + 1;
        });

        return Object.entries(advertiserCounts)
            .map(([advertiser, count]) => ({ advertiser, count }))
            .sort((a, b) => b.count - a.count);
    };

    // Get ad clicks by region
    const getAdClicksByRegion = () => {
        const regionCounts: Record<string, number> = {};

        (analytics.adClicks || []).forEach(click => {
            const region = click.userLocation?.province || "Unknown";
            regionCounts[region] = (regionCounts[region] || 0) + 1;
        });

        return Object.entries(regionCounts)
            .map(([region, count]) => ({ region, count }))
            .sort((a, b) => b.count - a.count);
    };

    // Get ad clicks by type
    const getAdClicksByType = () => {
        const typeCounts: Record<string, number> = {};

        (analytics.adClicks || []).forEach(click => {
            typeCounts[click.adType] = (typeCounts[click.adType] || 0) + 1;
        });

        return Object.entries(typeCounts)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count);
    };

    // Get lease applications by status
    const getLeaseApplicationsByStatus = () => {
        const statusCounts: Record<string, number> = {};
        analytics.leaseApplications.forEach(app => {
            statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
        });
        return Object.entries(statusCounts)
            .map(([status, count]) => ({ status, count }))
            .sort((a, b) => b.count - a.count);
    };

    // Get lease applications by region
    const getLeaseApplicationsByRegion = () => {
        const regionCounts: Record<string, number> = {};
        analytics.leaseApplications.forEach(app => {
            const region = app.applicantLocation.province || "Unknown";
            regionCounts[region] = (regionCounts[region] || 0) + 1;
        });
        return Object.entries(regionCounts)
            .map(([region, count]) => ({ region, count }))
            .sort((a, b) => b.count - a.count);
    };

    // Get lease applications by employment status
    const getLeaseApplicationsByEmployment = () => {
        const employmentCounts: Record<string, number> = {};
        analytics.leaseApplications.forEach(app => {
            employmentCounts[app.employmentStatus] = (employmentCounts[app.employmentStatus] || 0) + 1;
        });
        return Object.entries(employmentCounts)
            .map(([status, count]) => ({ status, count }))
            .sort((a, b) => b.count - a.count);
    };

    // Get average loan amounts
    const getAverageLoanAmounts = () => {
        if (analytics.leaseApplications.length === 0) return { average: 0, min: 0, max: 0, total: 0 };
        const amounts = analytics.leaseApplications.map(app => app.loanAmount);
        return {
            average: Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length),
            min: Math.min(...amounts),
            max: Math.max(...amounts),
            total: amounts.reduce((a, b) => a + b, 0),
        };
    };

    // Get most applied vehicles
    const getMostAppliedVehicles = () => {
        const vehicleCounts: Record<string, { vehicleId: string; title: string; count: number; totalLoanAmount: number }> = {};
        analytics.leaseApplications.forEach(app => {
            if (!vehicleCounts[app.vehicleId]) {
                vehicleCounts[app.vehicleId] = {
                    vehicleId: app.vehicleId,
                    title: app.vehicleTitle,
                    count: 0,
                    totalLoanAmount: 0,
                };
            }
            vehicleCounts[app.vehicleId].count++;
            vehicleCounts[app.vehicleId].totalLoanAmount += app.loanAmount;
        });
        return Object.values(vehicleCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);
    };

    // Get loan duration distribution
    const getLoanDurationDistribution = () => {
        const durationCounts: Record<number, number> = {};
        analytics.leaseApplications.forEach(app => {
            durationCounts[app.loanDuration] = (durationCounts[app.loanDuration] || 0) + 1;
        });
        return Object.entries(durationCounts)
            .map(([duration, count]) => ({ duration: parseInt(duration), count }))
            .sort((a, b) => a.duration - b.duration);
    };

    // Get available provinces and districts for filters
    const availableProvinces = getAllProvinces();
    const availableDistricts = selectedProvince ? getDistrictsByProvince(selectedProvince) : [];

    // Get unique values for filter dropdowns
    const getUniqueUserIds = () => {
        const userIds = new Set<string>();
        analytics.searches.forEach(s => s.userId && userIds.add(s.userId));
        analytics.views.forEach(v => v.userId && userIds.add(v.userId));
        analytics.pageViews.forEach(p => p.userId && userIds.add(p.userId));
        analytics.leaseApplications.forEach(a => a.userId && userIds.add(a.userId));
        (analytics.adClicks || []).forEach(ac => ac.userId && userIds.add(ac.userId));
        return Array.from(userIds).sort();
    };

    const getUniqueSessionIds = () => {
        const sessionIds = new Set<string>();
        analytics.searches.forEach(s => sessionIds.add(s.sessionId));
        analytics.views.forEach(v => sessionIds.add(v.sessionId));
        analytics.pageViews.forEach(p => sessionIds.add(p.sessionId));
        analytics.leaseApplications.forEach(a => sessionIds.add(a.sessionId));
        (analytics.adClicks || []).forEach(ac => sessionIds.add(ac.sessionId));
        return Array.from(sessionIds).sort();
    };

    const getUniqueVehicleTypes = () => {
        const types = new Set<string>();
        analytics.searches.forEach(s => s.filters.vehicleType && types.add(s.filters.vehicleType));
        return Array.from(types).sort();
    };

    const getUniqueVehicleMakes = () => {
        const makes = new Set<string>();
        analytics.searches.forEach(s => s.filters.make && makes.add(s.filters.make));
        return Array.from(makes).sort();
    };

    const getUniqueAdTypes = () => {
        const types = new Set<string>();
        (analytics.adClicks || []).forEach(ac => types.add(ac.adType));
        return Array.from(types).sort();
    };

    const getUniqueAdvertisers = () => {
        const advertisers = new Set<string>();
        (analytics.adClicks || []).forEach(ac => ac.advertiser && advertisers.add(ac.advertiser));
        return Array.from(advertisers).sort();
    };

    const getUniqueEmploymentStatuses = () => {
        const statuses = new Set<string>();
        analytics.leaseApplications.forEach(a => statuses.add(a.employmentStatus));
        return Array.from(statuses).sort();
    };

    // Calculate KPI metrics
    const totalLoanAmount = analytics.leaseApplications.reduce((sum, app) => sum + app.loanAmount, 0);
    const totalApplications = analytics.leaseApplications.length;
    const approvedCount = analytics.leaseApplications.filter(app => app.status === "approved").length;
    const pendingCount = analytics.leaseApplications.filter(app => app.status === "pending" || app.status === "in-review").length;

    if (!currentUser) return null;

    const mostSearched = getMostSearchedVehicles();
    const searchesByRegion = getSearchesByRegion();
    const mostViewed = getMostViewedVehicles();
    const viewsByRegion = getViewsByRegion();
    const popularByRegion = getPopularVehiclesByRegion();
    const trafficByRegion = getTrafficByRegion();
    const pageViewsStats = getPageViewsStats();
    const uniqueSessions = getUniqueSessions();
    const uniqueUsers = getUniqueUsers();
    const leaseAppsByStatus = getLeaseApplicationsByStatus();
    const leaseAppsByRegion = getLeaseApplicationsByRegion();
    const leaseAppsByEmployment = getLeaseApplicationsByEmployment();
    const loanStats = getAverageLoanAmounts();
    const mostAppliedVehicles = getMostAppliedVehicles();
    const loanDurationDistribution = getLoanDurationDistribution();

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar - Desktop Only */}
            <div className="hidden md:block w-64 flex-shrink-0">
                <AdminSidebar onLogout={() => router.push("/auth")} />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto flex flex-col">
                {/* Mobile Header */}
                <div className="md:hidden sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-primary">Analytics</h2>
                    <AdminMobileMenu onLogout={() => router.push("/auth")} />
                </div>

                <div className="p-4 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <BarChart3 className="w-8 h-8 text-primary" />
                                Analytics Dashboard
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Comprehensive insights into user behavior and site traffic
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Select
                                value={dateRange}
                                onValueChange={(value: any) => {
                                    setDateRange(value);
                                    if (value !== "custom") {
                                        setCustomDateFrom(undefined);
                                        setCustomDateTo(undefined);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select date range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">Last 7 days</SelectItem>
                                    <SelectItem value="30d">Last 30 days</SelectItem>
                                    <SelectItem value="90d">Last 90 days</SelectItem>
                                    <SelectItem value="all">All time</SelectItem>
                                    <SelectItem value="custom">Custom Range</SelectItem>
                                </SelectContent>
                            </Select>

                            {dateRange === "custom" && (
                                <div className="flex items-center gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" size="sm" className="w-[200px] justify-start text-left font-normal">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {customDateFrom ? format(customDateFrom, "PPP") : "From date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <CalendarComponent
                                                mode="single"
                                                selected={customDateFrom}
                                                onSelect={setCustomDateFrom}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" size="sm" className="w-[200px] justify-start text-left font-normal">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {customDateTo ? format(customDateTo, "PPP") : "To date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <CalendarComponent
                                                mode="single"
                                                selected={customDateTo}
                                                onSelect={setCustomDateTo}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSeedDemoData}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Seed Demo Data
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Clear Data
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Clear All Analytics Data?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete all analytics data.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleClearData}>
                                            Clear Data
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>

                    {/* Global Filter Bar */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5" />
                                Advanced Filters
                            </CardTitle>
                            <CardDescription>
                                Filter analytics data by multiple criteria. All charts and metrics update automatically.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Basic Location Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <Label htmlFor="province-filter">Province</Label>
                                    <Select
                                        value={selectedProvince || "all"}
                                        onValueChange={(value) => {
                                            setSelectedProvince(value === "all" ? null : value);
                                            setSelectedDistrict(null);
                                        }}
                                    >
                                        <SelectTrigger id="province-filter">
                                            <SelectValue placeholder="All Provinces" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Provinces</SelectItem>
                                            {availableProvinces.map((province) => (
                                                <SelectItem key={province} value={province}>
                                                    {province}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="district-filter">District</Label>
                                    <Select
                                        value={selectedDistrict || "all"}
                                        onValueChange={(value) => setSelectedDistrict(value === "all" ? null : value)}
                                        disabled={!selectedProvince}
                                    >
                                        <SelectTrigger id="district-filter">
                                            <SelectValue placeholder={selectedProvince ? "All Districts" : "Select Province First"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Districts</SelectItem>
                                            {availableDistricts.map((district) => (
                                                <SelectItem key={district} value={district}>
                                                    {district}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="user-id-filter">User ID</Label>
                                    <Select
                                        value={selectedUserId || "all"}
                                        onValueChange={(value) => setSelectedUserId(value === "all" ? null : value)}
                                    >
                                        <SelectTrigger id="user-id-filter">
                                            <SelectValue placeholder="All Users" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Users</SelectItem>
                                            {getUniqueUserIds().slice(0, 50).map((userId) => (
                                                <SelectItem key={userId} value={userId}>
                                                    {userId.length > 20 ? `${userId.substring(0, 20)}...` : userId}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="session-id-filter">Session ID</Label>
                                    <Select
                                        value={selectedSessionId || "all"}
                                        onValueChange={(value) => setSelectedSessionId(value === "all" ? null : value)}
                                    >
                                        <SelectTrigger id="session-id-filter">
                                            <SelectValue placeholder="All Sessions" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Sessions</SelectItem>
                                            {getUniqueSessionIds().slice(0, 50).map((sessionId) => (
                                                <SelectItem key={sessionId} value={sessionId}>
                                                    {sessionId.length > 20 ? `${sessionId.substring(0, 20)}...` : sessionId}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Advanced Filters - Collapsible */}
                            <Collapsible open={isAdvancedFiltersOpen} onOpenChange={setIsAdvancedFiltersOpen}>
                                <CollapsibleTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        <span className="flex items-center gap-2">
                                            <Filter className="w-4 h-4" />
                                            Advanced Filters
                                        </span>
                                        {isAdvancedFiltersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-4 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <Label htmlFor="vehicle-type-filter">Vehicle Type</Label>
                                            <Select
                                                value={selectedVehicleType || "all"}
                                                onValueChange={(value) => setSelectedVehicleType(value === "all" ? null : value)}
                                            >
                                                <SelectTrigger id="vehicle-type-filter">
                                                    <SelectValue placeholder="All Types" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Vehicle Types</SelectItem>
                                                    {getUniqueVehicleTypes().map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="vehicle-make-filter">Vehicle Make</Label>
                                            <Select
                                                value={selectedVehicleMake || "all"}
                                                onValueChange={(value) => setSelectedVehicleMake(value === "all" ? null : value)}
                                            >
                                                <SelectTrigger id="vehicle-make-filter">
                                                    <SelectValue placeholder="All Makes" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Makes</SelectItem>
                                                    {getUniqueVehicleMakes().map((make) => (
                                                        <SelectItem key={make} value={make}>
                                                            {make}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="ad-type-filter">Ad Type</Label>
                                            <Select
                                                value={selectedAdType || "all"}
                                                onValueChange={(value) => setSelectedAdType(value === "all" ? null : value)}
                                            >
                                                <SelectTrigger id="ad-type-filter">
                                                    <SelectValue placeholder="All Ad Types" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Ad Types</SelectItem>
                                                    {getUniqueAdTypes().map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="advertiser-filter">Advertiser</Label>
                                            <Select
                                                value={selectedAdvertiser || "all"}
                                                onValueChange={(value) => setSelectedAdvertiser(value === "all" ? null : value)}
                                            >
                                                <SelectTrigger id="advertiser-filter">
                                                    <SelectValue placeholder="All Advertisers" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Advertisers</SelectItem>
                                                    {getUniqueAdvertisers().map((advertiser) => (
                                                        <SelectItem key={advertiser} value={advertiser}>
                                                            {advertiser}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="employment-status-filter">Employment Status</Label>
                                            <Select
                                                value={selectedEmploymentStatus || "all"}
                                                onValueChange={(value) => setSelectedEmploymentStatus(value === "all" ? null : value)}
                                            >
                                                <SelectTrigger id="employment-status-filter">
                                                    <SelectValue placeholder="All Statuses" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Employment Statuses</SelectItem>
                                                    {getUniqueEmploymentStatuses().map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="loan-amount-min">Loan Amount Min (LKR)</Label>
                                            <Input
                                                id="loan-amount-min"
                                                type="number"
                                                placeholder="Min amount"
                                                value={loanAmountMin}
                                                onChange={(e) => setLoanAmountMin(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="loan-amount-max">Loan Amount Max (LKR)</Label>
                                            <Input
                                                id="loan-amount-max"
                                                type="number"
                                                placeholder="Max amount"
                                                value={loanAmountMax}
                                                onChange={(e) => setLoanAmountMax(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>

                            {/* Active Filters Display & Clear Button */}
                            {(selectedProvince || selectedDistrict || selectedUserId || selectedSessionId ||
                                selectedVehicleType || selectedVehicleMake || selectedAdType || selectedAdvertiser ||
                                selectedEmploymentStatus || loanAmountMin || loanAmountMax) && (
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
                                            {selectedProvince && (
                                                <Badge variant="secondary" className="gap-1">
                                                    Province: {selectedProvince}
                                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedProvince(null)} />
                                                </Badge>
                                            )}
                                            {selectedDistrict && (
                                                <Badge variant="secondary" className="gap-1">
                                                    District: {selectedDistrict}
                                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDistrict(null)} />
                                                </Badge>
                                            )}
                                            {selectedUserId && (
                                                <Badge variant="secondary" className="gap-1">
                                                    User: {selectedUserId.substring(0, 10)}...
                                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedUserId(null)} />
                                                </Badge>
                                            )}
                                            {selectedSessionId && (
                                                <Badge variant="secondary" className="gap-1">
                                                    Session: {selectedSessionId.substring(0, 10)}...
                                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSessionId(null)} />
                                                </Badge>
                                            )}
                                            {selectedVehicleType && (
                                                <Badge variant="secondary" className="gap-1">
                                                    Type: {selectedVehicleType}
                                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedVehicleType(null)} />
                                                </Badge>
                                            )}
                                            {selectedVehicleMake && (
                                                <Badge variant="secondary" className="gap-1">
                                                    Make: {selectedVehicleMake}
                                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedVehicleMake(null)} />
                                                </Badge>
                                            )}
                                            {selectedAdType && (
                                                <Badge variant="secondary" className="gap-1">
                                                    Ad Type: {selectedAdType}
                                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedAdType(null)} />
                                                </Badge>
                                            )}
                                            {selectedAdvertiser && (
                                                <Badge variant="secondary" className="gap-1">
                                                    Advertiser: {selectedAdvertiser}
                                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedAdvertiser(null)} />
                                                </Badge>
                                            )}
                                            {selectedEmploymentStatus && (
                                                <Badge variant="secondary" className="gap-1">
                                                    Employment: {selectedEmploymentStatus}
                                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedEmploymentStatus(null)} />
                                                </Badge>
                                            )}
                                            {(loanAmountMin || loanAmountMax) && (
                                                <Badge variant="secondary" className="gap-1">
                                                    Loan: {loanAmountMin || "0"} - {loanAmountMax || "∞"}
                                                    <X className="w-3 h-3 cursor-pointer" onClick={() => { setLoanAmountMin(""); setLoanAmountMax(""); }} />
                                                </Badge>
                                            )}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedProvince(null);
                                                setSelectedDistrict(null);
                                                setSelectedUserId(null);
                                                setSelectedSessionId(null);
                                                setSelectedVehicleType(null);
                                                setSelectedVehicleMake(null);
                                                setSelectedAdType(null);
                                                setSelectedAdvertiser(null);
                                                setSelectedEmploymentStatus(null);
                                                setLoanAmountMin("");
                                                setLoanAmountMax("");
                                            }}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Clear All Filters
                                        </Button>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {/* Additional Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics.searches.length.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {mostSearched.length} unique queries
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics.views.length.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {mostViewed.length} unique vehicles
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                                <Globe className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics.pageViews.length.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {pageViewsStats.length} unique pages
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ad Clicks</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{(analytics.adClicks || []).length.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Total advertisement clicks
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{uniqueUsers.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Registered users
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Analytics Tabs */}
                    <Tabs defaultValue="searches" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="searches">Searches</TabsTrigger>
                            <TabsTrigger value="views">Vehicle Views</TabsTrigger>
                            <TabsTrigger value="lease-applications">Lease Applications</TabsTrigger>
                            <TabsTrigger value="ad-clicks">Ad Clicks</TabsTrigger>
                            <TabsTrigger value="regions">Regional Data</TabsTrigger>
                            <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
                        </TabsList>

                        {/* Searches Tab */}
                        <TabsContent value="searches" className="space-y-4">
                            {/* Market Demand Chart - Horizontal Bar Chart */}
                            <Card className="border-2 shadow-lg">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-bold">Market Demand - Most Searched Vehicles</CardTitle>
                                    <CardDescription className="text-sm">Visual representation of vehicle search trends</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {mostSearched.length > 0 ? (
                                        <ChartContainer
                                            config={{
                                                searches: {
                                                    label: "Searches",
                                                    color: "hsl(221, 83%, 53%)",
                                                },
                                            }}
                                            className="h-[450px] w-full"
                                        >
                                            <BarChart
                                                data={mostSearched.slice(0, 10).map(item => ({ name: item.query.length > 20 ? item.query.substring(0, 20) + "..." : item.query, searches: item.count }))}
                                                layout="vertical"
                                                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                                            >
                                                <defs>
                                                    <linearGradient id="searchesGradient" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="hsl(221, 83%, 53%)" stopOpacity={1} />
                                                        <stop offset="100%" stopColor="hsl(221, 83%, 63%)" stopOpacity={0.8} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                                <XAxis
                                                    type="number"
                                                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                                                    tickLine={{ stroke: "hsl(var(--border))" }}
                                                />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    width={160}
                                                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                                                    tickLine={{ stroke: "hsl(var(--border))" }}
                                                />
                                                <ChartTooltip
                                                    content={<ChartTooltipContent
                                                        indicator="line"
                                                        className="bg-background/95 backdrop-blur-sm border-2 shadow-xl"
                                                    />}
                                                />
                                                <Bar
                                                    dataKey="searches"
                                                    fill="url(#searchesGradient)"
                                                    radius={[0, 8, 8, 0]}
                                                    stroke="hsl(221, 83%, 45%)"
                                                    strokeWidth={1}
                                                />
                                            </BarChart>
                                        </ChartContainer>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">No search data available</p>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Most Searched Vehicles</CardTitle>
                                        <CardDescription>Click a query to view all searches</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {mostSearched.length > 0 ? (
                                                mostSearched.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 rounded border cursor-pointer transition-all hover:bg-muted"
                                                        onClick={() => setSelectedSearchQuery(item.query)}
                                                    >
                                                        <div className="flex-1">
                                                            <p className="font-medium">{item.query}</p>
                                                            {item.filters.vehicleType && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    Type: {item.filters.vehicleType}
                                                                    {item.filters.make && ` • ${item.filters.make}`}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Badge variant="secondary">{item.count}</Badge>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-muted-foreground text-center py-4">No search data available</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Searches by Region</CardTitle>
                                        <CardDescription>Click a region to view all searches</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {searchesByRegion.length > 0 ? (
                                            <>
                                                <ChartContainer
                                                    config={{
                                                        searches: {
                                                            label: "Searches",
                                                            color: "hsl(221, 83%, 53%)",
                                                        },
                                                    }}
                                                    className="h-[320px] mb-4"
                                                >
                                                    <BarChart
                                                        data={searchesByRegion.slice(0, 8).map(item => ({
                                                            name: item.region.length > 15 ? item.region.substring(0, 15) + "..." : item.region,
                                                            searches: item.count
                                                        }))}
                                                        layout="vertical"
                                                        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                                                    >
                                                        <defs>
                                                            <linearGradient id="searchesRegionGradient" x1="0" y1="0" x2="1" y2="0">
                                                                <stop offset="0%" stopColor="hsl(221, 83%, 53%)" stopOpacity={1} />
                                                                <stop offset="100%" stopColor="hsl(221, 83%, 63%)" stopOpacity={0.8} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                                        <XAxis
                                                            type="number"
                                                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                                                        />
                                                        <YAxis
                                                            dataKey="name"
                                                            type="category"
                                                            width={120}
                                                            tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                                                        />
                                                        <ChartTooltip
                                                            content={<ChartTooltipContent
                                                                className="bg-background/95 backdrop-blur-sm border-2 shadow-xl"
                                                            />}
                                                        />
                                                        <Bar
                                                            dataKey="searches"
                                                            fill="url(#searchesRegionGradient)"
                                                            radius={[0, 6, 6, 0]}
                                                            stroke="hsl(221, 83%, 45%)"
                                                            strokeWidth={1}
                                                        />
                                                    </BarChart>
                                                </ChartContainer>
                                                <div className="space-y-2">
                                                    {searchesByRegion.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-2 rounded border cursor-pointer transition-all hover:bg-muted"
                                                            onClick={() => setSelectedSearchRegion(item.region)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                                <span className="font-medium">{item.region}</span>
                                                            </div>
                                                            <Badge variant="secondary">{item.count}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-muted-foreground text-center py-4">No regional search data</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Most Searched Vehicles Modal */}
                            <Dialog open={selectedSearchQuery !== null} onOpenChange={(open) => !open && setSelectedSearchQuery(null)}>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>Search Events - "{selectedSearchQuery || ""}"</DialogTitle>
                                        <DialogDescription>
                                            {selectedSearchQuery && analytics.searches.filter(s => s.query.toLowerCase().trim() === (selectedSearchQuery.toLowerCase().trim() || "")).length} search event(s) with this query
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-y-auto">
                                        {selectedSearchQuery && (
                                            <>
                                                {analytics.searches.filter(s => s.query.toLowerCase().trim() === (selectedSearchQuery.toLowerCase().trim() || "")).length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Query</TableHead>
                                                                    <TableHead>Filters</TableHead>
                                                                    <TableHead>User Location</TableHead>
                                                                    <TableHead>User ID</TableHead>
                                                                    <TableHead>Session ID</TableHead>
                                                                    <TableHead>Date & Time</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {analytics.searches
                                                                    .filter(s => s.query.toLowerCase().trim() === (selectedSearchQuery.toLowerCase().trim() || ""))
                                                                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                                    .map((search) => (
                                                                        <TableRow key={search.id}>
                                                                            <TableCell>
                                                                                <span className="font-medium">{search.query || "(empty)"}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm space-y-1">
                                                                                    {search.filters.vehicleType && <p>Type: {search.filters.vehicleType}</p>}
                                                                                    {search.filters.make && <p>Make: {search.filters.make}</p>}
                                                                                    {search.filters.province && <p>Province: {search.filters.province}</p>}
                                                                                    {search.filters.district && <p>District: {search.filters.district}</p>}
                                                                                    {search.filters.priceMin && <p>Min Price: {search.filters.priceMin}</p>}
                                                                                    {search.filters.priceMax && <p>Max Price: {search.filters.priceMax}</p>}
                                                                                    {!search.filters.vehicleType && !search.filters.make && !search.filters.province && (
                                                                                        <p className="text-muted-foreground">No filters</p>
                                                                                    )}
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {search.userLocation ? (
                                                                                    <div className="text-sm">
                                                                                        <p>{search.userLocation.province || "Unknown"}</p>
                                                                                        <p className="text-muted-foreground text-xs">
                                                                                            {search.userLocation.district || ""}
                                                                                        </p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <span className="text-muted-foreground text-sm">Unknown</span>
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm">{search.userId || "Guest"}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-xs text-muted-foreground font-mono">{search.sessionId}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p>{new Date(search.timestamp).toLocaleDateString()}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {new Date(search.timestamp).toLocaleTimeString()}
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-muted-foreground">
                                                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                        <p className="text-lg font-medium">No searches found</p>
                                                        <p className="text-sm">No search events with query "{selectedSearchQuery}"</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/* Searches by Region Modal */}
                            <Dialog open={selectedSearchRegion !== null} onOpenChange={(open) => !open && setSelectedSearchRegion(null)}>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>Searches - {selectedSearchRegion || ""}</DialogTitle>
                                        <DialogDescription>
                                            {selectedSearchRegion && analytics.searches.filter(s => (s.userLocation?.province || s.filters.province || "Unknown") === selectedSearchRegion).length} search event(s) from this region
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-y-auto">
                                        {selectedSearchRegion && (
                                            <>
                                                {analytics.searches.filter(s => (s.userLocation?.province || s.filters.province || "Unknown") === selectedSearchRegion).length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Query</TableHead>
                                                                    <TableHead>Filters</TableHead>
                                                                    <TableHead>User Location</TableHead>
                                                                    <TableHead>User ID</TableHead>
                                                                    <TableHead>Date & Time</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {analytics.searches
                                                                    .filter(s => (s.userLocation?.province || s.filters.province || "Unknown") === selectedSearchRegion)
                                                                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                                    .map((search) => (
                                                                        <TableRow key={search.id}>
                                                                            <TableCell>
                                                                                <span className="font-medium">{search.query || "(empty)"}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm space-y-1">
                                                                                    {search.filters.vehicleType && <p>Type: {search.filters.vehicleType}</p>}
                                                                                    {search.filters.make && <p>Make: {search.filters.make}</p>}
                                                                                    {!search.filters.vehicleType && !search.filters.make && (
                                                                                        <p className="text-muted-foreground">No filters</p>
                                                                                    )}
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {search.userLocation ? (
                                                                                    <div className="text-sm">
                                                                                        <p>{search.userLocation.province || "Unknown"}</p>
                                                                                        <p className="text-muted-foreground text-xs">
                                                                                            {search.userLocation.district || ""}
                                                                                        </p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <span className="text-muted-foreground text-sm">Unknown</span>
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm">{search.userId || "Guest"}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p>{new Date(search.timestamp).toLocaleDateString()}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {new Date(search.timestamp).toLocaleTimeString()}
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-muted-foreground">
                                                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                        <p className="text-lg font-medium">No searches found</p>
                                                        <p className="text-sm">No searches from region "{selectedSearchRegion}"</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </TabsContent>

                        {/* Views Tab */}
                        <TabsContent value="views" className="space-y-4">
                            {/* Most Viewed Vehicles - Bar Chart */}
                            <Card className="border-2 shadow-lg">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-bold">Most Viewed Vehicles</CardTitle>
                                    <CardDescription className="text-sm">Top vehicles by view count</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {mostViewed.length > 0 ? (
                                        <ChartContainer
                                            config={{
                                                views: {
                                                    label: "Views",
                                                    color: "hsl(173, 80%, 40%)",
                                                },
                                            }}
                                            className="h-[450px] w-full"
                                        >
                                            <BarChart
                                                data={mostViewed.slice(0, 10).map(item => ({
                                                    name: item.title.length > 25 ? item.title.substring(0, 25) + "..." : item.title,
                                                    views: item.count
                                                }))}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                                            >
                                                <defs>
                                                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="hsl(173, 80%, 40%)" stopOpacity={1} />
                                                        <stop offset="100%" stopColor="hsl(173, 80%, 50%)" stopOpacity={0.7} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                                <XAxis
                                                    dataKey="name"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={100}
                                                    tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                                                    tickLine={{ stroke: "hsl(var(--border))" }}
                                                />
                                                <YAxis
                                                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                                                    tickLine={{ stroke: "hsl(var(--border))" }}
                                                />
                                                <ChartTooltip
                                                    content={<ChartTooltipContent
                                                        className="bg-background/95 backdrop-blur-sm border-2 shadow-xl"
                                                    />}
                                                />
                                                <Bar
                                                    dataKey="views"
                                                    fill="url(#viewsGradient)"
                                                    radius={[8, 8, 0, 0]}
                                                    stroke="hsl(173, 80%, 35%)"
                                                    strokeWidth={1}
                                                />
                                            </BarChart>
                                        </ChartContainer>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">No view data available</p>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Most Viewed Vehicles</CardTitle>
                                        <CardDescription>Click a vehicle to view all views</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {mostViewed.length > 0 ? (
                                                mostViewed.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 rounded border cursor-pointer transition-all hover:bg-muted"
                                                        onClick={() => setSelectedViewVehicleId(item.vehicleId)}
                                                    >
                                                        <div className="flex-1">
                                                            <p className="font-medium">{item.title}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {item.location.province}, {item.location.district}
                                                            </p>
                                                        </div>
                                                        <Badge variant="secondary">{item.count}</Badge>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-muted-foreground text-center py-4">No view data available</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Views by Region</CardTitle>
                                        <CardDescription>Click a region to view all views</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {viewsByRegion.length > 0 ? (
                                            <>
                                                <ChartContainer
                                                    config={{
                                                        views: {
                                                            label: "Views",
                                                            color: "hsl(173, 80%, 40%)",
                                                        },
                                                    }}
                                                    className="h-[320px] mb-4"
                                                >
                                                    <BarChart
                                                        data={viewsByRegion.slice(0, 8).map(item => ({
                                                            name: item.region.length > 15 ? item.region.substring(0, 15) + "..." : item.region,
                                                            views: item.count
                                                        }))}
                                                        layout="vertical"
                                                        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                                                    >
                                                        <defs>
                                                            <linearGradient id="viewsRegionGradient" x1="0" y1="0" x2="1" y2="0">
                                                                <stop offset="0%" stopColor="hsl(173, 80%, 40%)" stopOpacity={1} />
                                                                <stop offset="100%" stopColor="hsl(173, 80%, 50%)" stopOpacity={0.8} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                                        <XAxis
                                                            type="number"
                                                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                                                        />
                                                        <YAxis
                                                            dataKey="name"
                                                            type="category"
                                                            width={120}
                                                            tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                                                        />
                                                        <ChartTooltip
                                                            content={<ChartTooltipContent
                                                                className="bg-background/95 backdrop-blur-sm border-2 shadow-xl"
                                                            />}
                                                        />
                                                        <Bar
                                                            dataKey="views"
                                                            fill="url(#viewsRegionGradient)"
                                                            radius={[0, 6, 6, 0]}
                                                            stroke="hsl(173, 80%, 35%)"
                                                            strokeWidth={1}
                                                        />
                                                    </BarChart>
                                                </ChartContainer>
                                                <div className="space-y-2">
                                                    {viewsByRegion.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-2 rounded border cursor-pointer transition-all hover:bg-muted"
                                                            onClick={() => setSelectedViewRegion(item.region)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                                <span className="font-medium">{item.region}</span>
                                                            </div>
                                                            <Badge variant="secondary">{item.count}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-muted-foreground text-center py-4">No regional view data</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Most Viewed Vehicles Modal */}
                            <Dialog open={selectedViewVehicleId !== null} onOpenChange={(open) => !open && setSelectedViewVehicleId(null)}>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                                    <DialogHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <DialogTitle>
                                                    Views - {selectedViewVehicleId && mostViewed.find(v => v.vehicleId === selectedViewVehicleId)?.title}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    {selectedViewVehicleId && analytics.views.filter(v => v.vehicleId === selectedViewVehicleId).length} view event(s) for this vehicle
                                                </DialogDescription>
                                            </div>
                                            {selectedViewVehicleId && (
                                                <Button
                                                    onClick={() => {
                                                        navigate(`/listing/${selectedViewVehicleId}`);
                                                    }}
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    View Ad
                                                </Button>
                                            )}
                                        </div>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-y-auto">
                                        {selectedViewVehicleId && (
                                            <>
                                                {analytics.views.filter(v => v.vehicleId === selectedViewVehicleId).length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Vehicle & Actions</TableHead>
                                                                    <TableHead>Vehicle Location</TableHead>
                                                                    <TableHead>User Location</TableHead>
                                                                    <TableHead>User ID</TableHead>
                                                                    <TableHead>Referrer</TableHead>
                                                                    <TableHead>Date & Time</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {analytics.views
                                                                    .filter(v => v.vehicleId === selectedViewVehicleId)
                                                                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                                    .map((view) => (
                                                                        <TableRow key={view.id}>
                                                                            <TableCell>
                                                                                <p className="font-medium">{view.vehicleTitle}</p>
                                                                                <p className="text-xs text-muted-foreground">ID: {view.vehicleId}</p>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p>{view.vehicleLocation.province}</p>
                                                                                    <p className="text-muted-foreground text-xs">
                                                                                        {view.vehicleLocation.district}, {view.vehicleLocation.town}
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {view.userLocation ? (
                                                                                    <div className="text-sm">
                                                                                        <p>{view.userLocation.province || "Unknown"}</p>
                                                                                        <p className="text-muted-foreground text-xs">
                                                                                            {view.userLocation.district || ""}
                                                                                        </p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <span className="text-muted-foreground text-sm">Unknown</span>
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm">{view.userId || "Guest"}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm text-muted-foreground">
                                                                                    {view.referrer ? (
                                                                                        <a href={view.referrer} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                                                            {new URL(view.referrer).hostname}
                                                                                        </a>
                                                                                    ) : (
                                                                                        "Direct"
                                                                                    )}
                                                                                </span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p>{new Date(view.timestamp).toLocaleDateString()}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {new Date(view.timestamp).toLocaleTimeString()}
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-muted-foreground">
                                                        <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                        <p className="text-lg font-medium">No views found</p>
                                                        <p className="text-sm">No view events for this vehicle</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/* Views by Region Modal */}
                            <Dialog open={selectedViewRegion !== null} onOpenChange={(open) => !open && setSelectedViewRegion(null)}>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>Views - {selectedViewRegion || ""}</DialogTitle>
                                        <DialogDescription>
                                            {selectedViewRegion && analytics.views.filter(v => (v.userLocation?.province || v.vehicleLocation.province || "Unknown") === selectedViewRegion).length} view event(s) from this region
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-y-auto">
                                        {selectedViewRegion && (
                                            <>
                                                {analytics.views.filter(v => (v.userLocation?.province || v.vehicleLocation.province || "Unknown") === selectedViewRegion).length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Vehicle & Actions</TableHead>
                                                                    <TableHead>Vehicle Location</TableHead>
                                                                    <TableHead>User Location</TableHead>
                                                                    <TableHead>User ID</TableHead>
                                                                    <TableHead>Date & Time</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {analytics.views
                                                                    .filter(v => (v.userLocation?.province || v.vehicleLocation.province || "Unknown") === selectedViewRegion)
                                                                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                                    .map((view) => (
                                                                        <TableRow key={view.id}>
                                                                            <TableCell>
                                                                                <p className="font-medium">{view.vehicleTitle}</p>
                                                                                <p className="text-xs text-muted-foreground">ID: {view.vehicleId}</p>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p>{view.vehicleLocation.province}</p>
                                                                                    <p className="text-muted-foreground text-xs">
                                                                                        {view.vehicleLocation.district}, {view.vehicleLocation.town}
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {view.userLocation ? (
                                                                                    <div className="text-sm">
                                                                                        <p>{view.userLocation.province || "Unknown"}</p>
                                                                                        <p className="text-muted-foreground text-xs">
                                                                                            {view.userLocation.district || ""}
                                                                                        </p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <span className="text-muted-foreground text-sm">Unknown</span>
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm">{view.userId || "Guest"}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p>{new Date(view.timestamp).toLocaleDateString()}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {new Date(view.timestamp).toLocaleTimeString()}
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-muted-foreground">
                                                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                        <p className="text-lg font-medium">No views found</p>
                                                        <p className="text-sm">No views from region "{selectedViewRegion}"</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </TabsContent>

                        {/* Lease Applications Tab */}
                        <TabsContent value="lease-applications" className="space-y-4">
                            {/* Application Pipeline - Donut Chart */}
                            <Card className="border-2 shadow-lg">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-bold">Application Pipeline - Applications by Status</CardTitle>
                                    <CardDescription className="text-sm">Visual breakdown of application status distribution</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {leaseAppsByStatus.length > 0 ? (
                                        <ChartContainer
                                            config={{
                                                approved: { label: "Approved", color: "hsl(142, 76%, 36%)" },
                                                pending: { label: "Pending", color: "hsl(38, 92%, 50%)" },
                                                "in-review": { label: "In Review", color: "hsl(217, 91%, 60%)" },
                                                rejected: { label: "Rejected", color: "hsl(0, 84%, 60%)" },
                                                cancelled: { label: "Cancelled", color: "hsl(0, 0%, 45%)" },
                                            }}
                                            className="h-[450px] w-full"
                                        >
                                            <PieChart>
                                                <defs>
                                                    <filter id="shadow">
                                                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
                                                    </filter>
                                                </defs>
                                                <Pie
                                                    data={leaseAppsByStatus.map(item => ({ name: item.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()), value: item.count }))}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={140}
                                                    innerRadius={60}
                                                    paddingAngle={3}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    stroke="hsl(var(--background))"
                                                    strokeWidth={3}
                                                >
                                                    {leaseAppsByStatus.map((entry, index) => {
                                                        const colors = [
                                                            "hsl(142, 76%, 36%)",
                                                            "hsl(38, 92%, 50%)",
                                                            "hsl(217, 91%, 60%)",
                                                            "hsl(0, 84%, 60%)",
                                                            "hsl(0, 0%, 45%)"
                                                        ];
                                                        return (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={colors[index % colors.length]}
                                                                style={{ filter: "url(#shadow)" }}
                                                            />
                                                        );
                                                    })}
                                                </Pie>
                                                <ChartTooltip
                                                    content={<ChartTooltipContent
                                                        className="bg-background/95 backdrop-blur-sm border-2 shadow-xl"
                                                    />}
                                                />
                                                <Legend
                                                    wrapperStyle={{ paddingTop: "20px" }}
                                                    iconType="circle"
                                                    formatter={(value) => <span className="text-sm font-medium">{value}</span>}
                                                />
                                            </PieChart>
                                        </ChartContainer>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">No application data available</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Loan Duration Distribution - Vertical Column Chart */}
                            <Card className="border-2 shadow-lg">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-bold">Loan Duration Distribution</CardTitle>
                                    <CardDescription className="text-sm">Distribution of loan terms showing that 24 months is the top choice</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {loanDurationDistribution.length > 0 ? (
                                        <ChartContainer
                                            config={{
                                                count: {
                                                    label: "Applications",
                                                    color: "hsl(262, 83%, 58%)",
                                                },
                                            }}
                                            className="h-[450px] w-full"
                                        >
                                            <BarChart
                                                data={loanDurationDistribution.map(item => ({ name: `${item.duration} months`, count: item.count }))}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                                            >
                                                <defs>
                                                    <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="hsl(262, 83%, 58%)" stopOpacity={1} />
                                                        <stop offset="100%" stopColor="hsl(262, 83%, 68%)" stopOpacity={0.7} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                                                    tickLine={{ stroke: "hsl(var(--border))" }}
                                                />
                                                <YAxis
                                                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                                                    tickLine={{ stroke: "hsl(var(--border))" }}
                                                />
                                                <ChartTooltip
                                                    content={<ChartTooltipContent
                                                        className="bg-background/95 backdrop-blur-sm border-2 shadow-xl"
                                                    />}
                                                />
                                                <Bar
                                                    dataKey="count"
                                                    fill="url(#durationGradient)"
                                                    radius={[8, 8, 0, 0]}
                                                    stroke="hsl(262, 83%, 50%)"
                                                    strokeWidth={1}
                                                />
                                            </BarChart>
                                        </ChartContainer>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">No loan duration data available</p>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Loan Statistics</CardTitle>
                                        <CardDescription>Average loan amounts and totals</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Total Applications</span>
                                                <span className="font-semibold">{analytics.leaseApplications.length}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Average Loan Amount</span>
                                                <span className="font-semibold">LKR {loanStats.average.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Total Loan Amount</span>
                                                <span className="font-semibold">LKR {loanStats.total.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Min Loan</span>
                                                <span className="font-semibold">LKR {loanStats.min.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Max Loan</span>
                                                <span className="font-semibold">LKR {loanStats.max.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Applications by Status</CardTitle>
                                        <CardDescription>Click a status to view applications</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {leaseAppsByStatus.length > 0 ? (
                                                leaseAppsByStatus.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 rounded border cursor-pointer transition-all hover:bg-muted"
                                                        onClick={() => setSelectedStatus(item.status)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-muted-foreground" />
                                                            <span className="font-medium capitalize">{item.status.replace("-", " ")}</span>
                                                        </div>
                                                        <Badge variant="secondary">{item.count}</Badge>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-muted-foreground text-center py-4">No application data</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Applications by Region</CardTitle>
                                        <CardDescription>Click a region to view applications</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {leaseAppsByRegion.length > 0 ? (
                                            <>
                                                <ChartContainer
                                                    config={{
                                                        applications: {
                                                            label: "Applications",
                                                            color: "hsl(24, 95%, 53%)",
                                                        },
                                                    }}
                                                    className="h-[320px] mb-4"
                                                >
                                                    <BarChart
                                                        data={leaseAppsByRegion.slice(0, 8).map(item => ({
                                                            name: item.region.length > 15 ? item.region.substring(0, 15) + "..." : item.region,
                                                            applications: item.count
                                                        }))}
                                                        layout="vertical"
                                                        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                                                    >
                                                        <defs>
                                                            <linearGradient id="appsRegionGradient" x1="0" y1="0" x2="1" y2="0">
                                                                <stop offset="0%" stopColor="hsl(24, 95%, 53%)" stopOpacity={1} />
                                                                <stop offset="100%" stopColor="hsl(24, 95%, 63%)" stopOpacity={0.8} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                                        <XAxis
                                                            type="number"
                                                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                                                        />
                                                        <YAxis
                                                            dataKey="name"
                                                            type="category"
                                                            width={120}
                                                            tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                                                        />
                                                        <ChartTooltip
                                                            content={<ChartTooltipContent
                                                                className="bg-background/95 backdrop-blur-sm border-2 shadow-xl"
                                                            />}
                                                        />
                                                        <Bar
                                                            dataKey="applications"
                                                            fill="url(#appsRegionGradient)"
                                                            radius={[0, 6, 6, 0]}
                                                            stroke="hsl(24, 95%, 45%)"
                                                            strokeWidth={1}
                                                        />
                                                    </BarChart>
                                                </ChartContainer>
                                                <div className="space-y-2">
                                                    {leaseAppsByRegion.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-2 rounded border cursor-pointer transition-all hover:bg-muted"
                                                            onClick={() => setSelectedRegion(item.region)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                                <span className="font-medium">{item.region}</span>
                                                            </div>
                                                            <Badge variant="secondary">{item.count}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-muted-foreground text-center py-4">No regional data</p>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Applications by Employment Status</CardTitle>
                                        <CardDescription>Click a status to view applications</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {leaseAppsByEmployment.length > 0 ? (
                                            <>
                                                <ChartContainer
                                                    config={Object.fromEntries(
                                                        leaseAppsByEmployment.map((item, idx) => [
                                                            item.status,
                                                            {
                                                                label: item.status,
                                                                color: `hsl(${idx * 72}, 70%, 50%)`,
                                                            },
                                                        ])
                                                    )}
                                                    className="h-[320px] mb-4"
                                                >
                                                    <PieChart>
                                                        <defs>
                                                            <filter id="pieShadow">
                                                                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
                                                            </filter>
                                                        </defs>
                                                        <Pie
                                                            data={leaseAppsByEmployment.map(item => ({ name: item.status, value: item.count }))}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                                                            outerRadius={110}
                                                            innerRadius={40}
                                                            paddingAngle={2}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                            stroke="hsl(var(--background))"
                                                            strokeWidth={2}
                                                        >
                                                            {leaseAppsByEmployment.map((entry, index) => {
                                                                const colors = ["hsl(0, 70%, 50%)", "hsl(72, 70%, 50%)", "hsl(144, 70%, 50%)", "hsl(216, 70%, 50%)"];
                                                                return (
                                                                    <Cell
                                                                        key={`cell-${index}`}
                                                                        fill={colors[index % colors.length]}
                                                                        style={{ filter: "url(#pieShadow)" }}
                                                                    />
                                                                );
                                                            })}
                                                        </Pie>
                                                        <ChartTooltip
                                                            content={<ChartTooltipContent
                                                                className="bg-background/95 backdrop-blur-sm border-2 shadow-xl"
                                                            />}
                                                        />
                                                        <Legend
                                                            wrapperStyle={{ paddingTop: "15px" }}
                                                            iconType="circle"
                                                            formatter={(value) => <span className="text-sm font-medium">{value}</span>}
                                                        />
                                                    </PieChart>
                                                </ChartContainer>
                                                <div className="space-y-2">
                                                    {leaseAppsByEmployment.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-2 rounded border cursor-pointer transition-all hover:bg-muted"
                                                            onClick={() => setSelectedEmploymentStatus(item.status)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Briefcase className="w-4 h-4 text-muted-foreground" />
                                                                <span className="font-medium">{item.status}</span>
                                                            </div>
                                                            <Badge variant="secondary">{item.count}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-muted-foreground text-center py-4">No employment data</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Most Applied Vehicles</CardTitle>
                                        <CardDescription>Click a vehicle to view applications</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {mostAppliedVehicles.length > 0 ? (
                                            <>
                                                <ChartContainer
                                                    config={{
                                                        applications: {
                                                            label: "Applications",
                                                            color: "hsl(24, 95%, 53%)",
                                                        },
                                                    }}
                                                    className="h-[320px] mb-4"
                                                >
                                                    <BarChart
                                                        data={mostAppliedVehicles.slice(0, 8).map(item => ({
                                                            name: item.title.length > 20 ? item.title.substring(0, 20) + "..." : item.title,
                                                            applications: item.count
                                                        }))}
                                                        margin={{ top: 10, right: 20, left: 10, bottom: 80 }}
                                                    >
                                                        <defs>
                                                            <linearGradient id="mostAppliedGradient" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="hsl(24, 95%, 53%)" stopOpacity={1} />
                                                                <stop offset="100%" stopColor="hsl(24, 95%, 63%)" stopOpacity={0.7} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                                        <XAxis
                                                            dataKey="name"
                                                            angle={-45}
                                                            textAnchor="end"
                                                            height={100}
                                                            tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                                                            tickLine={{ stroke: "hsl(var(--border))" }}
                                                        />
                                                        <YAxis
                                                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                                                            tickLine={{ stroke: "hsl(var(--border))" }}
                                                        />
                                                        <ChartTooltip
                                                            content={<ChartTooltipContent
                                                                className="bg-background/95 backdrop-blur-sm border-2 shadow-xl"
                                                            />}
                                                        />
                                                        <Bar
                                                            dataKey="applications"
                                                            fill="url(#mostAppliedGradient)"
                                                            radius={[8, 8, 0, 0]}
                                                            stroke="hsl(24, 95%, 45%)"
                                                            strokeWidth={1}
                                                        />
                                                    </BarChart>
                                                </ChartContainer>
                                                <div className="space-y-2">
                                                    {mostAppliedVehicles.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-2 rounded border cursor-pointer transition-all hover:bg-muted"
                                                            onClick={() => setSelectedVehicleId(item.vehicleId)}
                                                        >
                                                            <div className="flex-1">
                                                                <p className="font-medium">{item.title}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Total: LKR {item.totalLoanAmount.toLocaleString()}
                                                                </p>
                                                            </div>
                                                            <Badge variant="secondary">{item.count} applications</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-muted-foreground text-center py-4">No application data</p>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Loan Duration Distribution</CardTitle>
                                        <CardDescription>Click a duration to view applications</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {loanDurationDistribution.length > 0 ? (
                                                loanDurationDistribution.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 rounded border cursor-pointer transition-all hover:bg-muted"
                                                        onClick={() => setSelectedLoanDuration(item.duration)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                                            <span className="font-medium">{item.duration} months</span>
                                                        </div>
                                                        <Badge variant="secondary">{item.count}</Badge>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-muted-foreground text-center py-4">No duration data</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Applications Modal */}
                            <Dialog open={selectedStatus !== null} onOpenChange={(open) => !open && setSelectedStatus(null)}>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Applications - {selectedStatus ? selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1).replace("-", " ") : ""}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {selectedStatus && analytics.leaseApplications.filter(app => app.status === selectedStatus).length} application(s) with this status
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-y-auto">
                                        {selectedStatus && (
                                            <>
                                                {analytics.leaseApplications.filter(app => app.status === selectedStatus).length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Applicant</TableHead>
                                                                    <TableHead>Vehicle & Actions</TableHead>
                                                                    <TableHead>Location</TableHead>
                                                                    <TableHead>Employment</TableHead>
                                                                    <TableHead>Loan Amount</TableHead>
                                                                    <TableHead>Down Payment</TableHead>
                                                                    <TableHead>Monthly Payment</TableHead>
                                                                    <TableHead>Duration</TableHead>
                                                                    <TableHead>Interest Rate</TableHead>
                                                                    <TableHead>Date</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {analytics.leaseApplications
                                                                    .filter(app => app.status === selectedStatus)
                                                                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                                    .map((app) => (
                                                                        <TableRow key={app.id}>
                                                                            <TableCell>
                                                                                <div>
                                                                                    <p className="font-medium">{app.applicantName}</p>
                                                                                    <p className="text-xs text-muted-foreground">ID: {app.applicantId}</p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="space-y-1">
                                                                                    <p className="font-medium">{app.vehicleTitle}</p>
                                                                                    <p className="text-sm text-muted-foreground">
                                                                                        LKR {app.vehiclePrice.toLocaleString()}
                                                                                    </p>
                                                                                    <Button
                                                                                        onClick={() => navigate(`/listing/${app.vehicleId}`)}
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        className="gap-1.5 mt-2 w-full"
                                                                                    >
                                                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                                                        View Ad
                                                                                    </Button>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p className="font-medium">{app.applicantLocation.town}</p>
                                                                                    <p className="text-muted-foreground">{app.applicantLocation.district}</p>
                                                                                    <p className="text-muted-foreground text-xs">{app.applicantLocation.province}</p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div>
                                                                                    <p className="text-sm font-medium">{app.employmentStatus}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        Income: LKR {app.monthlyIncome.toLocaleString()}/mo
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="font-semibold">LKR {app.loanAmount.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm">LKR {app.downPayment.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="font-semibold text-primary">LKR {app.monthlyPayment.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span>{app.loanDuration} months</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm">{app.interestRate}%</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p>{new Date(app.timestamp).toLocaleDateString()}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {new Date(app.timestamp).toLocaleTimeString()}
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-muted-foreground">
                                                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                        <p className="text-lg font-medium">No applications found</p>
                                                        <p className="text-sm">No applications with status "{selectedStatus}"</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/* Applications by Region Modal */}
                            <Dialog open={selectedRegion !== null} onOpenChange={(open) => !open && setSelectedRegion(null)}>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Applications - {selectedRegion || ""}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {selectedRegion && analytics.leaseApplications.filter(app => app.applicantLocation.province === selectedRegion).length} application(s) from this region
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-y-auto">
                                        {selectedRegion && (
                                            <>
                                                {analytics.leaseApplications.filter(app => app.applicantLocation.province === selectedRegion).length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Applicant</TableHead>
                                                                    <TableHead>Vehicle & Actions</TableHead>
                                                                    <TableHead>Location</TableHead>
                                                                    <TableHead>Employment</TableHead>
                                                                    <TableHead>Loan Amount</TableHead>
                                                                    <TableHead>Down Payment</TableHead>
                                                                    <TableHead>Monthly Payment</TableHead>
                                                                    <TableHead>Duration</TableHead>
                                                                    <TableHead>Status</TableHead>
                                                                    <TableHead>Date</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {analytics.leaseApplications
                                                                    .filter(app => app.applicantLocation.province === selectedRegion)
                                                                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                                    .map((app) => (
                                                                        <TableRow key={app.id}>
                                                                            <TableCell>
                                                                                <div>
                                                                                    <p className="font-medium">{app.applicantName}</p>
                                                                                    <p className="text-xs text-muted-foreground">ID: {app.applicantId}</p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="space-y-1">
                                                                                    <p className="font-medium">{app.vehicleTitle}</p>
                                                                                    <p className="text-sm text-muted-foreground">
                                                                                        LKR {app.vehiclePrice.toLocaleString()}
                                                                                    </p>
                                                                                    <Button
                                                                                        onClick={() => navigate(`/listing/${app.vehicleId}`)}
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        className="gap-1.5 mt-2 w-full"
                                                                                    >
                                                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                                                        View Ad
                                                                                    </Button>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p className="font-medium">{app.applicantLocation.town}</p>
                                                                                    <p className="text-muted-foreground">{app.applicantLocation.district}</p>
                                                                                    <p className="text-muted-foreground text-xs">{app.applicantLocation.province}</p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div>
                                                                                    <p className="text-sm font-medium">{app.employmentStatus}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        Income: LKR {app.monthlyIncome.toLocaleString()}/mo
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="font-semibold">LKR {app.loanAmount.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm">LKR {app.downPayment.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="font-semibold text-primary">LKR {app.monthlyPayment.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span>{app.loanDuration} months</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Badge variant={
                                                                                    app.status === "approved" ? "default" :
                                                                                        app.status === "rejected" ? "destructive" :
                                                                                            app.status === "pending" ? "secondary" :
                                                                                                app.status === "in-review" ? "outline" : "secondary"
                                                                                }>
                                                                                    {app.status.replace("-", " ")}
                                                                                </Badge>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p>{new Date(app.timestamp).toLocaleDateString()}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {new Date(app.timestamp).toLocaleTimeString()}
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-muted-foreground">
                                                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                        <p className="text-lg font-medium">No applications found</p>
                                                        <p className="text-sm">No applications from region "{selectedRegion}"</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/* Applications by Employment Status Modal */}
                            <Dialog open={selectedEmploymentStatus !== null} onOpenChange={(open) => !open && setSelectedEmploymentStatus(null)}>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Applications - {selectedEmploymentStatus || ""}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {selectedEmploymentStatus && analytics.leaseApplications.filter(app => app.employmentStatus === selectedEmploymentStatus).length} application(s) with this employment status
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-y-auto">
                                        {selectedEmploymentStatus && (
                                            <>
                                                {analytics.leaseApplications.filter(app => app.employmentStatus === selectedEmploymentStatus).length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Applicant</TableHead>
                                                                    <TableHead>Vehicle & Actions</TableHead>
                                                                    <TableHead>Location</TableHead>
                                                                    <TableHead>Monthly Income</TableHead>
                                                                    <TableHead>Loan Amount</TableHead>
                                                                    <TableHead>Down Payment</TableHead>
                                                                    <TableHead>Monthly Payment</TableHead>
                                                                    <TableHead>Duration</TableHead>
                                                                    <TableHead>Status</TableHead>
                                                                    <TableHead>Date</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {analytics.leaseApplications
                                                                    .filter(app => app.employmentStatus === selectedEmploymentStatus)
                                                                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                                    .map((app) => (
                                                                        <TableRow key={app.id}>
                                                                            <TableCell>
                                                                                <div>
                                                                                    <p className="font-medium">{app.applicantName}</p>
                                                                                    <p className="text-xs text-muted-foreground">ID: {app.applicantId}</p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <p className="font-medium">{app.vehicleTitle}</p>
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    LKR {app.vehiclePrice.toLocaleString()}
                                                                                </p>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p className="font-medium">{app.applicantLocation.town}</p>
                                                                                    <p className="text-muted-foreground">{app.applicantLocation.district}</p>
                                                                                    <p className="text-muted-foreground text-xs">{app.applicantLocation.province}</p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="font-semibold">LKR {app.monthlyIncome.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="font-semibold">LKR {app.loanAmount.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm">LKR {app.downPayment.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="font-semibold text-primary">LKR {app.monthlyPayment.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span>{app.loanDuration} months</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Badge variant={
                                                                                    app.status === "approved" ? "default" :
                                                                                        app.status === "rejected" ? "destructive" :
                                                                                            app.status === "pending" ? "secondary" :
                                                                                                app.status === "in-review" ? "outline" : "secondary"
                                                                                }>
                                                                                    {app.status.replace("-", " ")}
                                                                                </Badge>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p>{new Date(app.timestamp).toLocaleDateString()}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {new Date(app.timestamp).toLocaleTimeString()}
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Button
                                                                                    onClick={() => navigate(`/listing/${app.vehicleId}`)}
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="gap-1"
                                                                                >
                                                                                    <ExternalLink className="w-3 h-3" />
                                                                                    View Ad
                                                                                </Button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-muted-foreground">
                                                        <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                        <p className="text-lg font-medium">No applications found</p>
                                                        <p className="text-sm">No applications with employment status "{selectedEmploymentStatus}"</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/* Most Applied Vehicles Modal */}
                            <Dialog open={selectedVehicleId !== null} onOpenChange={(open) => !open && setSelectedVehicleId(null)}>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                                    <DialogHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <DialogTitle>
                                                    Applications - {selectedVehicleId && mostAppliedVehicles.find(v => v.vehicleId === selectedVehicleId)?.title}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    {selectedVehicleId && analytics.leaseApplications.filter(app => app.vehicleId === selectedVehicleId).length} application(s) for this vehicle
                                                </DialogDescription>
                                            </div>
                                            {selectedVehicleId && (
                                                <Button
                                                    onClick={() => {
                                                        navigate(`/listing/${selectedVehicleId}`);
                                                    }}
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    View Ad
                                                </Button>
                                            )}
                                        </div>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-y-auto">
                                        {selectedVehicleId && (
                                            <>
                                                {analytics.leaseApplications.filter(app => app.vehicleId === selectedVehicleId).length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Applicant</TableHead>
                                                                    <TableHead>Vehicle & Actions</TableHead>
                                                                    <TableHead>Location</TableHead>
                                                                    <TableHead>Employment</TableHead>
                                                                    <TableHead>Loan Amount</TableHead>
                                                                    <TableHead>Down Payment</TableHead>
                                                                    <TableHead>Monthly Payment</TableHead>
                                                                    <TableHead>Duration</TableHead>
                                                                    <TableHead>Status</TableHead>
                                                                    <TableHead>Date</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {analytics.leaseApplications
                                                                    .filter(app => app.vehicleId === selectedVehicleId)
                                                                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                                    .map((app) => (
                                                                        <TableRow key={app.id}>
                                                                            <TableCell>
                                                                                <div>
                                                                                    <p className="font-medium">{app.applicantName}</p>
                                                                                    <p className="text-xs text-muted-foreground">ID: {app.applicantId}</p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="space-y-1">
                                                                                    <p className="font-medium">{app.vehicleTitle}</p>
                                                                                    <p className="text-sm text-muted-foreground">
                                                                                        LKR {app.vehiclePrice.toLocaleString()}
                                                                                    </p>
                                                                                    <Button
                                                                                        onClick={() => navigate(`/listing/${app.vehicleId}`)}
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        className="gap-1.5 mt-2 w-full"
                                                                                    >
                                                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                                                        View Ad
                                                                                    </Button>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p className="font-medium">{app.applicantLocation.town}</p>
                                                                                    <p className="text-muted-foreground">{app.applicantLocation.district}</p>
                                                                                    <p className="text-muted-foreground text-xs">{app.applicantLocation.province}</p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div>
                                                                                    <p className="text-sm font-medium">{app.employmentStatus}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        Income: LKR {app.monthlyIncome.toLocaleString()}/mo
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="font-semibold">LKR {app.loanAmount.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm">LKR {app.downPayment.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="font-semibold text-primary">LKR {app.monthlyPayment.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span>{app.loanDuration} months</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Badge variant={
                                                                                    app.status === "approved" ? "default" :
                                                                                        app.status === "rejected" ? "destructive" :
                                                                                            app.status === "pending" ? "secondary" :
                                                                                                app.status === "in-review" ? "outline" : "secondary"
                                                                                }>
                                                                                    {app.status.replace("-", " ")}
                                                                                </Badge>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p>{new Date(app.timestamp).toLocaleDateString()}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {new Date(app.timestamp).toLocaleTimeString()}
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-muted-foreground">
                                                        <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                        <p className="text-lg font-medium">No applications found</p>
                                                        <p className="text-sm">No applications for this vehicle</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/* Loan Duration Distribution Modal */}
                            <Dialog open={selectedLoanDuration !== null} onOpenChange={(open) => !open && setSelectedLoanDuration(null)}>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Applications - {selectedLoanDuration !== null ? `${selectedLoanDuration} months` : ""}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {selectedLoanDuration !== null && analytics.leaseApplications.filter(app => app.loanDuration === selectedLoanDuration).length} application(s) with this loan duration
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-y-auto">
                                        {selectedLoanDuration !== null && (
                                            <>
                                                {analytics.leaseApplications.filter(app => app.loanDuration === selectedLoanDuration).length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Applicant</TableHead>
                                                                    <TableHead>Vehicle & Actions</TableHead>
                                                                    <TableHead>Location</TableHead>
                                                                    <TableHead>Employment</TableHead>
                                                                    <TableHead>Loan Amount</TableHead>
                                                                    <TableHead>Down Payment</TableHead>
                                                                    <TableHead>Monthly Payment</TableHead>
                                                                    <TableHead>Interest Rate</TableHead>
                                                                    <TableHead>Status</TableHead>
                                                                    <TableHead>Date</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {analytics.leaseApplications
                                                                    .filter(app => app.loanDuration === selectedLoanDuration)
                                                                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                                    .map((app) => (
                                                                        <TableRow key={app.id}>
                                                                            <TableCell>
                                                                                <div>
                                                                                    <p className="font-medium">{app.applicantName}</p>
                                                                                    <p className="text-xs text-muted-foreground">ID: {app.applicantId}</p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <p className="font-medium">{app.vehicleTitle}</p>
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    LKR {app.vehiclePrice.toLocaleString()}
                                                                                </p>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p className="font-medium">{app.applicantLocation.town}</p>
                                                                                    <p className="text-muted-foreground">{app.applicantLocation.district}</p>
                                                                                    <p className="text-muted-foreground text-xs">{app.applicantLocation.province}</p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div>
                                                                                    <p className="text-sm font-medium">{app.employmentStatus}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        Income: LKR {app.monthlyIncome.toLocaleString()}/mo
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="font-semibold">LKR {app.loanAmount.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm">LKR {app.downPayment.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="font-semibold text-primary">LKR {app.monthlyPayment.toLocaleString()}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm">{app.interestRate}%</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Badge variant={
                                                                                    app.status === "approved" ? "default" :
                                                                                        app.status === "rejected" ? "destructive" :
                                                                                            app.status === "pending" ? "secondary" :
                                                                                                app.status === "in-review" ? "outline" : "secondary"
                                                                                }>
                                                                                    {app.status.replace("-", " ")}
                                                                                </Badge>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p>{new Date(app.timestamp).toLocaleDateString()}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {new Date(app.timestamp).toLocaleTimeString()}
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Button
                                                                                    onClick={() => navigate(`/listing/${app.vehicleId}`)}
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="gap-1"
                                                                                >
                                                                                    <ExternalLink className="w-3 h-3" />
                                                                                    View Ad
                                                                                </Button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-muted-foreground">
                                                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                        <p className="text-lg font-medium">No applications found</p>
                                                        <p className="text-sm">No applications with loan duration of {selectedLoanDuration} months</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </TabsContent>

                        {/* Ad Clicks Tab */}
                        <TabsContent value="ad-clicks" className="space-y-4">
                            {/* Ad Value - Clicks by Position - Horizontal Bar Chart */}
                            <Card className="border-2 shadow-lg">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-bold">Ad Value - Clicks by Position</CardTitle>
                                    <CardDescription className="text-sm">Visual representation of ad performance by position. Higher bars indicate more clicks.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {getAdClicksByPosition().length > 0 ? (
                                        <ChartContainer
                                            config={Object.fromEntries(
                                                getAdClicksByPosition().map((item, idx) => [
                                                    item.position,
                                                    {
                                                        label: item.position.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
                                                        color: `hsl(${idx * 60 + 200}, 70%, 50%)`,
                                                    },
                                                ])
                                            )}
                                            className="h-[450px] w-full"
                                        >
                                            <BarChart
                                                data={getAdClicksByPosition().map((item, idx) => ({
                                                    name: item.position.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
                                                    clicks: item.count,
                                                    fill: `hsl(${idx * 60 + 200}, 70%, 50%)`,
                                                }))}
                                                layout="vertical"
                                                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                                            >
                                                <defs>
                                                    {getAdClicksByPosition().map((item, idx) => (
                                                        <linearGradient key={idx} id={`positionGradient${idx}`} x1="0" y1="0" x2="1" y2="0">
                                                            <stop offset="0%" stopColor={`hsl(${idx * 60 + 200}, 70%, 50%)`} stopOpacity={1} />
                                                            <stop offset="100%" stopColor={`hsl(${idx * 60 + 200}, 70%, 60%)`} stopOpacity={0.8} />
                                                        </linearGradient>
                                                    ))}
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                                <XAxis
                                                    type="number"
                                                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                                                    tickLine={{ stroke: "hsl(var(--border))" }}
                                                />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    width={180}
                                                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                                                    tickLine={{ stroke: "hsl(var(--border))" }}
                                                />
                                                <ChartTooltip
                                                    content={<ChartTooltipContent
                                                        className="bg-background/95 backdrop-blur-sm border-2 shadow-xl"
                                                    />}
                                                />
                                                <Bar
                                                    dataKey="clicks"
                                                    radius={[0, 8, 8, 0]}
                                                    stroke="hsl(var(--background))"
                                                    strokeWidth={2}
                                                >
                                                    {getAdClicksByPosition().map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={`url(#positionGradient${index})`}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ChartContainer>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">No ad click data available</p>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Total Ad Clicks</CardTitle>
                                        <CardDescription>All ad click events</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-primary">
                                            {(analytics.adClicks || []).length.toLocaleString()}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Total clicks on advertisement banners
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Unique Ad Clickers</CardTitle>
                                        <CardDescription>Users who clicked ads</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-primary">
                                            {new Set((analytics.adClicks || []).map(ac => ac.userId || ac.sessionId)).size.toLocaleString()}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Unique users/sessions
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Most Clicked Ads</CardTitle>
                                        <CardDescription>Click an ad to view all clicks</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {getMostClickedAds().length > 0 ? (
                                            <>
                                                <ChartContainer
                                                    config={{
                                                        clicks: {
                                                            label: "Clicks",
                                                            color: "hsl(340, 75%, 55%)",
                                                        },
                                                    }}
                                                    className="h-[320px] mb-4"
                                                >
                                                    <BarChart
                                                        data={getMostClickedAds().slice(0, 8).map(ad => ({
                                                            name: ad.title.length > 20 ? ad.title.substring(0, 20) + "..." : ad.title,
                                                            clicks: ad.count
                                                        }))}
                                                        layout="vertical"
                                                        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                                                    >
                                                        <defs>
                                                            <linearGradient id="mostClickedGradient" x1="0" y1="0" x2="1" y2="0">
                                                                <stop offset="0%" stopColor="hsl(340, 75%, 55%)" stopOpacity={1} />
                                                                <stop offset="100%" stopColor="hsl(340, 75%, 65%)" stopOpacity={0.8} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                                        <XAxis
                                                            type="number"
                                                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                                                        />
                                                        <YAxis
                                                            dataKey="name"
                                                            type="category"
                                                            width={150}
                                                            tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                                                        />
                                                        <ChartTooltip
                                                            content={<ChartTooltipContent
                                                                className="bg-background/95 backdrop-blur-sm border-2 shadow-xl"
                                                            />}
                                                        />
                                                        <Bar
                                                            dataKey="clicks"
                                                            fill="url(#mostClickedGradient)"
                                                            radius={[0, 6, 6, 0]}
                                                            stroke="hsl(340, 75%, 50%)"
                                                            strokeWidth={1}
                                                        />
                                                    </BarChart>
                                                </ChartContainer>
                                                <div className="space-y-2">
                                                    {getMostClickedAds().map((ad, index) => (
                                                        <div
                                                            key={ad.adId}
                                                            onClick={() => setSelectedAdId(ad.adId)}
                                                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium truncate">{ad.title}</p>
                                                                {ad.advertiser && (
                                                                    <p className="text-sm text-muted-foreground truncate">
                                                                        {ad.advertiser}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <Badge variant="secondary" className="ml-2">
                                                                {ad.count} clicks
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p>No ad clicks yet</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Clicks by Position</CardTitle>
                                        <CardDescription>Click a position to view all clicks</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {getAdClicksByPosition().map((item, index) => (
                                                <div
                                                    key={item.position}
                                                    onClick={() => setSelectedAdPosition(item.position)}
                                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium">
                                                            {item.position.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                        </p>
                                                    </div>
                                                    <Badge variant="secondary" className="ml-2">
                                                        {item.count} clicks
                                                    </Badge>
                                                </div>
                                            ))}
                                            {getAdClicksByPosition().length === 0 && (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                    <p>No ad clicks by position yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Clicks by Advertiser</CardTitle>
                                        <CardDescription>Click an advertiser to view all clicks</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {getAdClicksByAdvertiser().map((item, index) => (
                                                <div
                                                    key={item.advertiser}
                                                    onClick={() => setSelectedAdvertiser(item.advertiser)}
                                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.advertiser}</p>
                                                    </div>
                                                    <Badge variant="secondary" className="ml-2">
                                                        {item.count} clicks
                                                    </Badge>
                                                </div>
                                            ))}
                                            {getAdClicksByAdvertiser().length === 0 && (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                    <p>No ad clicks by advertiser yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Clicks by Region</CardTitle>
                                        <CardDescription>Ad clicks by user location</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {getAdClicksByRegion().map((item, index) => (
                                                <div
                                                    key={item.region}
                                                    className="flex items-center justify-between p-3 rounded-lg border"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.region}</p>
                                                    </div>
                                                    <Badge variant="secondary" className="ml-2">
                                                        {item.count} clicks
                                                    </Badge>
                                                </div>
                                            ))}
                                            {getAdClicksByRegion().length === 0 && (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                    <p>No ad clicks by region yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Clicks by Ad Type</CardTitle>
                                        <CardDescription>Ad clicks by banner type</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {getAdClicksByType().length > 0 ? (
                                            <>
                                                <ChartContainer
                                                    config={Object.fromEntries(
                                                        getAdClicksByType().map((item, idx) => [
                                                            item.type,
                                                            {
                                                                label: item.type.charAt(0).toUpperCase() + item.type.slice(1),
                                                                color: `hsl(${idx * 90}, 70%, 50%)`,
                                                            },
                                                        ])
                                                    )}
                                                    className="h-[320px] mb-4"
                                                >
                                                    <PieChart>
                                                        <defs>
                                                            <filter id="adTypeShadow">
                                                                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
                                                            </filter>
                                                        </defs>
                                                        <Pie
                                                            data={getAdClicksByType().map(item => ({ name: item.type.charAt(0).toUpperCase() + item.type.slice(1), value: item.count }))}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                                                            outerRadius={110}
                                                            innerRadius={40}
                                                            paddingAngle={2}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                            stroke="hsl(var(--background))"
                                                            strokeWidth={2}
                                                        >
                                                            {getAdClicksByType().map((entry, index) => {
                                                                const colors = ["hsl(0, 70%, 50%)", "hsl(90, 70%, 50%)", "hsl(180, 70%, 50%)", "hsl(270, 70%, 50%)"];
                                                                return (
                                                                    <Cell
                                                                        key={`cell-${index}`}
                                                                        fill={colors[index % colors.length]}
                                                                        style={{ filter: "url(#adTypeShadow)" }}
                                                                    />
                                                                );
                                                            })}
                                                        </Pie>
                                                        <ChartTooltip
                                                            content={<ChartTooltipContent
                                                                className="bg-background/95 backdrop-blur-sm border-2 shadow-xl"
                                                            />}
                                                        />
                                                        <Legend
                                                            wrapperStyle={{ paddingTop: "15px" }}
                                                            iconType="circle"
                                                            formatter={(value) => <span className="text-sm font-medium">{value}</span>}
                                                        />
                                                    </PieChart>
                                                </ChartContainer>
                                                <div className="space-y-2">
                                                    {getAdClicksByType().map((item, index) => (
                                                        <div
                                                            key={item.type}
                                                            className="flex items-center justify-between p-3 rounded-lg border"
                                                        >
                                                            <div className="flex-1">
                                                                <p className="font-medium capitalize">{item.type}</p>
                                                            </div>
                                                            <Badge variant="secondary" className="ml-2">
                                                                {item.count} clicks
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p>No ad clicks by type yet</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Dialog for Ad Clicks by Ad ID */}
                            <Dialog open={selectedAdId !== null} onOpenChange={() => setSelectedAdId(null)}>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Ad Click Details</DialogTitle>
                                        <DialogDescription>
                                            All clicks for this advertisement
                                        </DialogDescription>
                                    </DialogHeader>
                                    {selectedAdId && (
                                        <div>
                                            {(analytics.adClicks || []).filter(ac => ac.adId === selectedAdId).length > 0 ? (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Ad Title</TableHead>
                                                            <TableHead>Advertiser</TableHead>
                                                            <TableHead>Position</TableHead>
                                                            <TableHead>Link URL</TableHead>
                                                            <TableHead>User Location</TableHead>
                                                            <TableHead>User</TableHead>
                                                            <TableHead>Date</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {analytics.adClicks
                                                            .filter(ac => ac.adId === selectedAdId)
                                                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                            .map((click) => (
                                                                <TableRow key={click.id}>
                                                                    <TableCell>
                                                                        <p className="font-medium">{click.adTitle}</p>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span className="text-sm">{click.advertiser || "N/A"}</span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="outline">
                                                                            {click.adPosition.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <a
                                                                            href={click.linkUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-primary hover:underline text-sm flex items-center gap-1"
                                                                        >
                                                                            {click.linkUrl.length > 40 ? `${click.linkUrl.substring(0, 40)}...` : click.linkUrl}
                                                                            <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {click.userLocation ? (
                                                                            <div className="text-sm">
                                                                                <p>{click.userLocation.province || "Unknown"}</p>
                                                                                <p className="text-muted-foreground text-xs">
                                                                                    {click.userLocation.district || ""}
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-muted-foreground text-sm">Unknown</span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span className="text-sm">{click.userId || "Guest"}</span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="text-sm">
                                                                            <p>{new Date(click.timestamp).toLocaleDateString()}</p>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {new Date(click.timestamp).toLocaleTimeString()}
                                                                            </p>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            ) : (
                                                <div className="text-center py-12 text-muted-foreground">
                                                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                    <p className="text-lg font-medium">No clicks found</p>
                                                    <p className="text-sm">No clicks for this ad</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>

                            {/* Dialog for Ad Clicks by Position */}
                            <Dialog open={selectedAdPosition !== null} onOpenChange={() => setSelectedAdPosition(null)}>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Ad Clicks by Position</DialogTitle>
                                        <DialogDescription>
                                            All clicks for ads in this position
                                        </DialogDescription>
                                    </DialogHeader>
                                    {selectedAdPosition && (
                                        <div>
                                            {(analytics.adClicks || []).filter(ac => ac.adPosition === selectedAdPosition).length > 0 ? (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Ad Title</TableHead>
                                                            <TableHead>Advertiser</TableHead>
                                                            <TableHead>Type</TableHead>
                                                            <TableHead>Link URL</TableHead>
                                                            <TableHead>User Location</TableHead>
                                                            <TableHead>User</TableHead>
                                                            <TableHead>Date</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {(analytics.adClicks || [])
                                                            .filter(ac => ac.adPosition === selectedAdPosition)
                                                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                            .map((click) => (
                                                                <TableRow key={click.id}>
                                                                    <TableCell>
                                                                        <p className="font-medium">{click.adTitle}</p>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span className="text-sm">{click.advertiser || "N/A"}</span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="outline" className="capitalize">{click.adType}</Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <a
                                                                            href={click.linkUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-primary hover:underline text-sm flex items-center gap-1"
                                                                        >
                                                                            {click.linkUrl.length > 40 ? `${click.linkUrl.substring(0, 40)}...` : click.linkUrl}
                                                                            <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {click.userLocation ? (
                                                                            <div className="text-sm">
                                                                                <p>{click.userLocation.province || "Unknown"}</p>
                                                                                <p className="text-muted-foreground text-xs">
                                                                                    {click.userLocation.district || ""}
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-muted-foreground text-sm">Unknown</span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span className="text-sm">{click.userId || "Guest"}</span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="text-sm">
                                                                            <p>{new Date(click.timestamp).toLocaleDateString()}</p>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {new Date(click.timestamp).toLocaleTimeString()}
                                                                            </p>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            ) : (
                                                <div className="text-center py-12 text-muted-foreground">
                                                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                    <p className="text-lg font-medium">No clicks found</p>
                                                    <p className="text-sm">No clicks for ads in this position</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>

                            {/* Dialog for Ad Clicks by Advertiser */}
                            <Dialog open={selectedAdvertiser !== null} onOpenChange={() => setSelectedAdvertiser(null)}>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Ad Clicks by Advertiser</DialogTitle>
                                        <DialogDescription>
                                            All clicks for ads from this advertiser
                                        </DialogDescription>
                                    </DialogHeader>
                                    {selectedAdvertiser && (
                                        <div>
                                            {analytics.adClicks.filter(ac => (ac.advertiser || "Unknown") === selectedAdvertiser).length > 0 ? (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Ad Title</TableHead>
                                                            <TableHead>Position</TableHead>
                                                            <TableHead>Type</TableHead>
                                                            <TableHead>Link URL</TableHead>
                                                            <TableHead>User Location</TableHead>
                                                            <TableHead>User</TableHead>
                                                            <TableHead>Date</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {(analytics.adClicks || [])
                                                            .filter(ac => (ac.advertiser || "Unknown") === selectedAdvertiser)
                                                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                            .map((click) => (
                                                                <TableRow key={click.id}>
                                                                    <TableCell>
                                                                        <p className="font-medium">{click.adTitle}</p>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="outline">
                                                                            {click.adPosition.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="outline" className="capitalize">{click.adType}</Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <a
                                                                            href={click.linkUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-primary hover:underline text-sm flex items-center gap-1"
                                                                        >
                                                                            {click.linkUrl.length > 40 ? `${click.linkUrl.substring(0, 40)}...` : click.linkUrl}
                                                                            <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {click.userLocation ? (
                                                                            <div className="text-sm">
                                                                                <p>{click.userLocation.province || "Unknown"}</p>
                                                                                <p className="text-muted-foreground text-xs">
                                                                                    {click.userLocation.district || ""}
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-muted-foreground text-sm">Unknown</span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span className="text-sm">{click.userId || "Guest"}</span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="text-sm">
                                                                            <p>{new Date(click.timestamp).toLocaleDateString()}</p>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {new Date(click.timestamp).toLocaleTimeString()}
                                                                            </p>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            ) : (
                                                <div className="text-center py-12 text-muted-foreground">
                                                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                    <p className="text-lg font-medium">No clicks found</p>
                                                    <p className="text-sm">No clicks for ads from this advertiser</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </TabsContent>

                        {/* Regional Data Tab */}
                        <TabsContent value="regions" className="space-y-4">
                            {/* Regional Traffic Overview Chart */}
                            <Card className="border-2 shadow-lg">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-bold">Regional Traffic Overview</CardTitle>
                                    <CardDescription className="text-sm">Traffic distribution across all regions</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {trafficByRegion.length > 0 ? (
                                        <ChartContainer
                                            config={{
                                                traffic: {
                                                    label: "Traffic",
                                                    color: "hsl(280, 70%, 50%)",
                                                },
                                            }}
                                            className="h-[450px] w-full"
                                        >
                                            <BarChart
                                                data={trafficByRegion.map(item => ({
                                                    name: item.region.length > 12 ? item.region.substring(0, 12) + "..." : item.region,
                                                    traffic: item.count
                                                }))}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                                            >
                                                <defs>
                                                    <linearGradient id="regionalTrafficGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="hsl(280, 70%, 50%)" stopOpacity={1} />
                                                        <stop offset="100%" stopColor="hsl(280, 70%, 60%)" stopOpacity={0.7} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                                <XAxis
                                                    dataKey="name"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={100}
                                                    tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                                                    tickLine={{ stroke: "hsl(var(--border))" }}
                                                />
                                                <YAxis
                                                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                                                    tickLine={{ stroke: "hsl(var(--border))" }}
                                                />
                                                <ChartTooltip
                                                    content={<ChartTooltipContent
                                                        className="bg-background/95 backdrop-blur-sm border-2 shadow-xl"
                                                    />}
                                                />
                                                <Bar
                                                    dataKey="traffic"
                                                    fill="url(#regionalTrafficGradient)"
                                                    radius={[8, 8, 0, 0]}
                                                    stroke="hsl(280, 70%, 45%)"
                                                    strokeWidth={1}
                                                />
                                            </BarChart>
                                        </ChartContainer>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">No regional traffic data available</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Popular Vehicles by Region</CardTitle>
                                    <CardDescription>Click a region or vehicle to view details</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {popularByRegion.length > 0 ? (
                                            popularByRegion.map((regionData, index) => (
                                                <div key={index} className="border rounded-lg p-4">
                                                    <h3
                                                        className="font-semibold text-lg mb-3 flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                                                        onClick={() => setSelectedPopularRegion(regionData.region)}
                                                    >
                                                        <MapPin className="w-5 h-5 text-primary" />
                                                        {regionData.region}
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {regionData.vehicles.map((vehicle, vIndex) => (
                                                            <div
                                                                key={vIndex}
                                                                className="flex items-center justify-between p-2 bg-muted/50 rounded cursor-pointer transition-all hover:bg-muted"
                                                                onClick={() => {
                                                                    setSelectedPopularRegion(regionData.region);
                                                                    setSelectedPopularVehicleId(vehicle.vehicleId);
                                                                }}
                                                            >
                                                                <span className="text-sm">{vehicle.title}</span>
                                                                <Badge variant="secondary">{vehicle.count} views</Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground text-center py-4">No regional vehicle data</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Popular Vehicles by Region Modal */}
                            <Dialog open={selectedPopularRegion !== null} onOpenChange={(open) => !open && setSelectedPopularRegion(null)}>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                                    <DialogHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <DialogTitle>
                                                    Popular Vehicles - {selectedPopularRegion || ""}
                                                    {selectedPopularVehicleId && ` - ${mostViewed.find(v => v.vehicleId === selectedPopularVehicleId)?.title}`}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    {selectedPopularRegion && selectedPopularVehicleId && (
                                                        <>
                                                            {analytics.views.filter(v =>
                                                                v.vehicleId === selectedPopularVehicleId &&
                                                                (v.userLocation?.province || v.vehicleLocation.province || "Unknown") === selectedPopularRegion
                                                            ).length} view event(s) for this vehicle in this region
                                                        </>
                                                    )}
                                                    {selectedPopularRegion && !selectedPopularVehicleId && (
                                                        <>
                                                            {popularByRegion.find(r => r.region === selectedPopularRegion)?.vehicles.reduce((sum, v) => sum + v.count, 0) || 0} total view(s) in this region
                                                        </>
                                                    )}
                                                </DialogDescription>
                                            </div>
                                            {selectedPopularVehicleId && (
                                                <Button
                                                    onClick={() => {
                                                        navigate(`/listing/${selectedPopularVehicleId}`);
                                                    }}
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    View Ad
                                                </Button>
                                            )}
                                        </div>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-y-auto">
                                        {selectedPopularRegion && (
                                            <>
                                                {selectedPopularVehicleId ? (
                                                    analytics.views.filter(v =>
                                                        v.vehicleId === selectedPopularVehicleId &&
                                                        (v.userLocation?.province || v.vehicleLocation.province || "Unknown") === selectedPopularRegion
                                                    ).length > 0 ? (
                                                        <div className="overflow-x-auto">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>Vehicle & Actions</TableHead>
                                                                        <TableHead>User Location</TableHead>
                                                                        <TableHead>User ID</TableHead>
                                                                        <TableHead>Date & Time</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {analytics.views
                                                                        .filter(v =>
                                                                            v.vehicleId === selectedPopularVehicleId &&
                                                                            (v.userLocation?.province || v.vehicleLocation.province || "Unknown") === selectedPopularRegion
                                                                        )
                                                                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                                        .map((view) => (
                                                                            <TableRow key={view.id}>
                                                                                <TableCell>
                                                                                    <div className="space-y-1">
                                                                                        <p className="font-medium">{view.vehicleTitle}</p>
                                                                                        <p className="text-xs text-muted-foreground">ID: {view.vehicleId}</p>
                                                                                        <Button
                                                                                            onClick={() => navigate(`/listing/${view.vehicleId}`)}
                                                                                            variant="outline"
                                                                                            size="sm"
                                                                                            className="gap-1.5 mt-2 w-full"
                                                                                        >
                                                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                                                            View Ad
                                                                                        </Button>
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {view.userLocation ? (
                                                                                        <div className="text-sm">
                                                                                            <p>{view.userLocation.province || "Unknown"}</p>
                                                                                            <p className="text-muted-foreground text-xs">
                                                                                                {view.userLocation.district || ""}
                                                                                            </p>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <span className="text-muted-foreground text-sm">Unknown</span>
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <span className="text-sm">{view.userId || "Guest"}</span>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <div className="text-sm">
                                                                                        <p>{new Date(view.timestamp).toLocaleDateString()}</p>
                                                                                        <p className="text-xs text-muted-foreground">
                                                                                            {new Date(view.timestamp).toLocaleTimeString()}
                                                                                        </p>
                                                                                    </div>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-12 text-muted-foreground">
                                                            <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                            <p className="text-lg font-medium">No views found</p>
                                                            <p className="text-sm">No views for this vehicle in this region</p>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="space-y-4">
                                                        {popularByRegion.find(r => r.region === selectedPopularRegion)?.vehicles.map((vehicle, index) => (
                                                            <Card key={index}>
                                                                <CardHeader>
                                                                    <div className="flex items-center justify-between">
                                                                        <CardTitle className="text-lg">{vehicle.title}</CardTitle>
                                                                        <Badge variant="secondary">{vehicle.count} views</Badge>
                                                                    </div>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <div className="flex gap-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            onClick={() => setSelectedPopularVehicleId(vehicle.vehicleId)}
                                                                            className="flex-1"
                                                                        >
                                                                            View All {vehicle.count} View Events
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline"
                                                                            onClick={() => navigate(`/listing/${vehicle.vehicleId}`)}
                                                                            className="gap-2"
                                                                        >
                                                                            <ExternalLink className="w-4 h-4" />
                                                                            View Ad
                                                                        </Button>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </TabsContent>

                        {/* Traffic Sources Tab */}
                        <TabsContent value="traffic" className="space-y-4">
                            {/* Traffic by Region - Area Chart */}
                            <Card className="border-2 shadow-lg">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-bold">Traffic by Region</CardTitle>
                                    <CardDescription className="text-sm">Visual representation of site traffic across regions</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {trafficByRegion.length > 0 ? (
                                        <ChartContainer
                                            config={{
                                                traffic: {
                                                    label: "Page Views",
                                                    color: "hsl(280, 70%, 50%)",
                                                },
                                            }}
                                            className="h-[450px] w-full"
                                        >
                                            <AreaChart
                                                data={trafficByRegion.slice(0, 10).map(item => ({ name: item.region.length > 15 ? item.region.substring(0, 15) + "..." : item.region, traffic: item.count }))}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                                            >
                                                <defs>
                                                    <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="hsl(280, 70%, 50%)" stopOpacity={0.8} />
                                                        <stop offset="100%" stopColor="hsl(280, 70%, 50%)" stopOpacity={0.1} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                                <XAxis
                                                    dataKey="name"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={100}
                                                    tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                                                    tickLine={{ stroke: "hsl(var(--border))" }}
                                                />
                                                <YAxis
                                                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                                                    tickLine={{ stroke: "hsl(var(--border))" }}
                                                />
                                                <ChartTooltip
                                                    content={<ChartTooltipContent
                                                        className="bg-background/95 backdrop-blur-sm border-2 shadow-xl"
                                                    />}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="traffic"
                                                    stroke="hsl(280, 70%, 45%)"
                                                    strokeWidth={3}
                                                    fill="url(#trafficGradient)"
                                                    fillOpacity={1}
                                                />
                                            </AreaChart>
                                        </ChartContainer>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">No traffic data available</p>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Traffic by Region</CardTitle>
                                        <CardDescription>Click a region to view all page views</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {trafficByRegion.length > 0 ? (
                                                trafficByRegion.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 rounded border cursor-pointer transition-all hover:bg-muted"
                                                        onClick={() => setSelectedTrafficRegion(item.region)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                                            <span className="font-medium">{item.region}</span>
                                                        </div>
                                                        <Badge variant="secondary">{item.count}</Badge>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-muted-foreground text-center py-4">No traffic data</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Page Views</CardTitle>
                                        <CardDescription>Click a page to view all views</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {pageViewsStats.length > 0 ? (
                                                pageViewsStats.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 rounded border cursor-pointer transition-all hover:bg-muted"
                                                        onClick={() => setSelectedPage(item.page)}
                                                    >
                                                        <span className="font-medium">{item.page}</span>
                                                        <Badge variant="secondary">{item.count}</Badge>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-muted-foreground text-center py-4">No page view data</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Traffic by Region Modal */}
                            <Dialog open={selectedTrafficRegion !== null} onOpenChange={(open) => !open && setSelectedTrafficRegion(null)}>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>Page Views - {selectedTrafficRegion || ""}</DialogTitle>
                                        <DialogDescription>
                                            {selectedTrafficRegion && analytics.pageViews.filter(pv => (pv.userLocation?.province || "Unknown") === selectedTrafficRegion).length} page view(s) from this region
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-y-auto">
                                        {selectedTrafficRegion && (
                                            <>
                                                {analytics.pageViews.filter(pv => (pv.userLocation?.province || "Unknown") === selectedTrafficRegion).length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Page</TableHead>
                                                                    <TableHead>User Location</TableHead>
                                                                    <TableHead>User ID</TableHead>
                                                                    <TableHead>Referrer</TableHead>
                                                                    <TableHead>User Agent</TableHead>
                                                                    <TableHead>Date & Time</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {analytics.pageViews
                                                                    .filter(pv => (pv.userLocation?.province || "Unknown") === selectedTrafficRegion)
                                                                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                                    .map((pageView) => (
                                                                        <TableRow key={pageView.id}>
                                                                            <TableCell>
                                                                                <span className="font-medium">{pageView.page}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {pageView.userLocation ? (
                                                                                    <div className="text-sm">
                                                                                        <p>{pageView.userLocation.province || "Unknown"}</p>
                                                                                        <p className="text-muted-foreground text-xs">
                                                                                            {pageView.userLocation.district || ""}
                                                                                        </p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <span className="text-muted-foreground text-sm">Unknown</span>
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm">{pageView.userId || "Guest"}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm text-muted-foreground">
                                                                                    {pageView.referrer ? (
                                                                                        <a href={pageView.referrer} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                                                            {new URL(pageView.referrer).hostname}
                                                                                        </a>
                                                                                    ) : (
                                                                                        "Direct"
                                                                                    )}
                                                                                </span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-xs text-muted-foreground font-mono">
                                                                                    {pageView.userAgent ? pageView.userAgent.substring(0, 50) + "..." : "Unknown"}
                                                                                </span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p>{new Date(pageView.timestamp).toLocaleDateString()}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {new Date(pageView.timestamp).toLocaleTimeString()}
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-muted-foreground">
                                                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                        <p className="text-lg font-medium">No page views found</p>
                                                        <p className="text-sm">No page views from region "{selectedTrafficRegion}"</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/* Page Views Modal */}
                            <Dialog open={selectedPage !== null} onOpenChange={(open) => !open && setSelectedPage(null)}>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>Page Views - {selectedPage || ""}</DialogTitle>
                                        <DialogDescription>
                                            {selectedPage && analytics.pageViews.filter(pv => pv.page === selectedPage).length} page view(s) for this page
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-y-auto">
                                        {selectedPage && (
                                            <>
                                                {analytics.pageViews.filter(pv => pv.page === selectedPage).length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Page</TableHead>
                                                                    <TableHead>User Location</TableHead>
                                                                    <TableHead>User ID</TableHead>
                                                                    <TableHead>Session ID</TableHead>
                                                                    <TableHead>Referrer</TableHead>
                                                                    <TableHead>Date & Time</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {analytics.pageViews
                                                                    .filter(pv => pv.page === selectedPage)
                                                                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                                    .map((pageView) => (
                                                                        <TableRow key={pageView.id}>
                                                                            <TableCell>
                                                                                <span className="font-medium">{pageView.page}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {pageView.userLocation ? (
                                                                                    <div className="text-sm">
                                                                                        <p>{pageView.userLocation.province || "Unknown"}</p>
                                                                                        <p className="text-muted-foreground text-xs">
                                                                                            {pageView.userLocation.district || ""}
                                                                                        </p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <span className="text-muted-foreground text-sm">Unknown</span>
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm">{pageView.userId || "Guest"}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-xs text-muted-foreground font-mono">{pageView.sessionId}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="text-sm text-muted-foreground">
                                                                                    {pageView.referrer ? (
                                                                                        <a href={pageView.referrer} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                                                            {new URL(pageView.referrer).hostname}
                                                                                        </a>
                                                                                    ) : (
                                                                                        "Direct"
                                                                                    )}
                                                                                </span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm">
                                                                                    <p>{new Date(pageView.timestamp).toLocaleDateString()}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {new Date(pageView.timestamp).toLocaleTimeString()}
                                                                                    </p>
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-muted-foreground">
                                                        <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                        <p className="text-lg font-medium">No page views found</p>
                                                        <p className="text-sm">No page views for "{selectedPage}"</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
