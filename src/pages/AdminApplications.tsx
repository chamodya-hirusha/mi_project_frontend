"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileMenu from "@/components/admin/AdminMobileMenu";
import AdminLeaseApplications from "@/components/admin/AdminLeaseApplications";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const AdminApplications = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        // Check if user is admin
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

        // Check if user has admin privileges
        const hasAdminAccess = parsedUser.email === "admin@tradehub.lk" ||
            parsedUser.role === "super-admin" ||
            parsedUser.role === "admin" ||
            parsedUser.role === "branch-manager" ||
            parsedUser.isAdmin === true;

        if (!hasAdminAccess || parsedUser.role === "ad-manager") {
            toast({
                title: "Access Denied",
                description: parsedUser.role === "ad-manager"
                    ? "Ads Managers do not have access to Lease Applications"
                    : "You don't have permission to access the admin dashboard",
                variant: "destructive",
            });
            router.push(parsedUser.role === "ad-manager" ? "/admin" : "/");
            return;
        }

        setCurrentUser(parsedUser);
    }, [router, toast]);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        toast({
            title: "Logged out",
            description: "You have been successfully logged out",
        });
        router.push("/auth");
    };

    if (!currentUser) return null;

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar - Desktop Only */}
            <div className="hidden md:block w-64 flex-shrink-0">
                <AdminSidebar onLogout={handleLogout} />
            </div>
            <div className="flex-1 overflow-auto flex flex-col">
                {/* Mobile Header */}
                <div className="md:hidden sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-primary">TradeHub Admin</h2>
                    <AdminMobileMenu onLogout={handleLogout} />
                </div>
                <div className="p-4 md:p-8">
                    <AdminLeaseApplications />
                </div>
            </div>
        </div>
    );
};

export default AdminApplications;
