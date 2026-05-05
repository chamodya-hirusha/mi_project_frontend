"use client";

import { useEffect } from "react";
import { demoListings } from "@/data/demoData";
import { demoApplications } from "@/data/demoApplications";
import { demoBranches } from "@/data/demoBranches";
import { demoUsers } from "@/data/demoUsers";
import { seedDemoAnalytics } from "@/data/demoAnalytics";
import { seedDemoAds } from "@/data/demoAds";

export function DataSeeder({ children }: { children: React.ReactNode }) {
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
        } else if (pendingAdded) {
            localStorage.setItem("listings", JSON.stringify(listings));
        }

        // Seed demo applications
        const storedApplications = localStorage.getItem("leaseApplications");
        if (!storedApplications || JSON.parse(storedApplications).length === 0) {
            localStorage.setItem("leaseApplications", JSON.stringify(demoApplications));
        }

        // Seed demo branches
        const storedBranches = localStorage.getItem("branches");
        if (!storedBranches || JSON.parse(storedBranches).length === 0) {
            localStorage.setItem("branches", JSON.stringify(demoBranches));
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
                if (demoUser.email === "admin@tradehub.lk" || demoUser.role === "super-admin") {
                    if (existingUser.status !== "active" || existingUser.role !== "super-admin") {
                        existingUser.status = "active";
                        existingUser.role = "super-admin";
                        existingUser.isAdmin = true;
                        usersUpdated = true;
                    }
                }
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
        }

        // Seed demo notifications for rejected ads
        const storedNotifications = localStorage.getItem("notifications");
        const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];

        const rejectedVehicle = demoListings.find(v => v.status === "rejected" && v.rejectionReason);
        if (rejectedVehicle && !notifications.find((n: any) => n.vehicleId === rejectedVehicle.id)) {
            const rejectionNotification = {
                id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
                userId: rejectedVehicle.userId,
                type: "ad_rejected" as const,
                title: "Your ad has been rejected",
                message: `Your vehicle ad "${rejectedVehicle.title}" has been rejected. Reason: ${rejectedVehicle.rejectionReason}`,
                vehicleId: rejectedVehicle.id,
                vehicleTitle: rejectedVehicle.title,
                rejectionReason: rejectedVehicle.rejectionReason,
                read: false,
                createdAt: new Date(Date.now() - 172800000).toISOString(),
            };
            notifications.unshift(rejectionNotification);
            localStorage.setItem("notifications", JSON.stringify(notifications));
        }

        // Seed demo analytics data
        seedDemoAnalytics();
        seedDemoAds();
    }, []);

    return <>{children}</>;
}
