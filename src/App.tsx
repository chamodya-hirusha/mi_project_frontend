import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PostAd from "./pages/PostAd";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Dashboard from "./pages/Dashboard";
import LeaseApplication from "./pages/LeaseApplication";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";
import { LocationProvider } from "@/contexts/LocationContext";

import { useEffect } from "react";
import { demoListings } from "@/data/demoData";
import { demoApplications } from "@/data/demoApplications";
import { demoBranches } from "@/data/demoBranches";
import { demoUsers } from "@/data/demoUsers";
import { hashPassword } from "@/lib/security";
import { seedDemoAnalytics } from "@/data/demoAnalytics";
import { seedDemoAds } from "@/data/demoAds";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Seed demo listings
    const storedListings = localStorage.getItem("listings");
    let listings = storedListings ? JSON.parse(storedListings) : [];

    // Always ensure pending vehicles from demo data exist
    const pendingVehicles = demoListings.filter((l: any) => l.status === "pending");
    const existingPendingIds = listings.filter((l: any) => l.status === "pending").map((l: any) => l.id);

    // Add any missing pending vehicles
    let pendingAdded = false;
    pendingVehicles.forEach((pending: any) => {
      if (!existingPendingIds.includes(pending.id)) {
        listings.push(pending);
        pendingAdded = true;
      }
    });

    // Check if we need to seed or re-seed all demo data
    const shouldReseed = listings.length < 10 ||
      (listings[0]?.id?.startsWith('demo-') && !listings[0].images[0]?.includes('toyota_axio_front.png'));

    if (shouldReseed) {
      localStorage.setItem("listings", JSON.stringify(demoListings));
      console.log("✅ Demo listings re-seeded with pending vehicles");
      console.log(`📊 Total vehicles: ${demoListings.length}, Pending: ${pendingVehicles.length}`);
    } else if (pendingAdded) {
      localStorage.setItem("listings", JSON.stringify(listings));
      console.log(`✅ Added ${pendingVehicles.length - existingPendingIds.length} missing pending vehicles to listings`);
    } else {
      console.log(`ℹ️ Pending vehicles check: Found ${existingPendingIds.length} pending vehicles in localStorage`);
    }

    // Seed demo applications
    const storedApplications = localStorage.getItem("leaseApplications");
    if (!storedApplications || JSON.parse(storedApplications).length === 0) {
      localStorage.setItem("leaseApplications", JSON.stringify(demoApplications));
      console.log("Demo applications seeded");
    }

    // Seed demo branches
    const storedBranches = localStorage.getItem("branches");
    if (!storedBranches || JSON.parse(storedBranches).length === 0) {
      localStorage.setItem("branches", JSON.stringify(demoBranches));
      console.log("Demo branches seeded");
    }

    // Seed demo users
    const storedUsers = localStorage.getItem("users");
    let users = storedUsers ? JSON.parse(storedUsers) : [];
    let usersUpdated = false;

    demoUsers.forEach(demoUser => {
      const existingUser = users.find((u: any) => u.email === demoUser.email);
      if (!existingUser) {
        users.push(demoUser);
        usersUpdated = true;
      } else {
        // Ensure admin and super-admin users are always active and have correct role
        if (demoUser.email === "admin@tradehub.lk" || demoUser.role === "super-admin") {
          if (existingUser.status !== "active" || existingUser.role !== "super-admin") {
            existingUser.status = "active";
            existingUser.role = "super-admin";
            existingUser.isAdmin = true;
            usersUpdated = true;
          }
        }
        // Ensure demo user is always active
        if (demoUser.email === "demo@user.com") {
          if (existingUser.status !== "active") {
            existingUser.status = "active";
            usersUpdated = true;
          }
        }
      }
    });

    if (usersUpdated) {
      localStorage.setItem("users", JSON.stringify(users));
      console.log("Demo users seeded");
    }

    // Seed demo notifications for rejected ads
    const storedNotifications = localStorage.getItem("notifications");
    const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];

    // Add notification for the rejected demo vehicle if it doesn't exist
    const rejectedVehicle = demoListings.find(v => v.status === "rejected" && v.rejectionReason);
    if (rejectedVehicle && !notifications.find((n: any) => n.vehicleId === rejectedVehicle.id)) {
      const rejectionNotification = {
        id: crypto.randomUUID(),
        userId: rejectedVehicle.userId,
        type: "ad_rejected" as const,
        title: "Your ad has been rejected",
        message: `Your vehicle ad "${rejectedVehicle.title}" has been rejected. Reason: ${rejectedVehicle.rejectionReason}`,
        vehicleId: rejectedVehicle.id,
        vehicleTitle: rejectedVehicle.title,
        rejectionReason: rejectedVehicle.rejectionReason,
        read: false,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      };
      notifications.unshift(rejectionNotification);
      localStorage.setItem("notifications", JSON.stringify(notifications));
      console.log("Demo notifications seeded");
    }

    // Seed demo analytics data
    seedDemoAnalytics();
    seedDemoAds();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/post-ad" element={<PostAd />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lease-application/:vehicleId" element={<LeaseApplication />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LocationProvider>
    </QueryClientProvider>
  );
};

export default App;
