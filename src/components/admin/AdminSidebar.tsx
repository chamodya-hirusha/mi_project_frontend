"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Car,
    FileText,
    Users,
    MapPin,
    Settings,
    LogOut,
    BarChart3,
    Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
    onLogout?: () => void;
}

const navItems = [
    {
        title: "Overview",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Vehicles",
        href: "/admin/vehicles",
        icon: Car,
    },
    {
        title: "Lease Applications",
        href: "/admin/applications",
        icon: FileText,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Branches",
        href: "/admin/branches",
        icon: MapPin,
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
    },
    {
        title: "Ad Management",
        href: "/admin/ads",
        icon: Megaphone,
    },
    {
        title: "Finance Settings",
        href: "/admin/finance",
        icon: Settings,
    },
];

const AdminSidebar = ({ onLogout }: AdminSidebarProps) => {
    const pathname = usePathname();
    const userStore = typeof window !== 'undefined' ? localStorage.getItem("currentUser") : null;
    const userData = userStore ? JSON.parse(userStore) : {};
    const role = userData.role || "";

    const roleLabels: Record<string, string> = {
        "super-admin": "Platform Admin",
        "admin": "Platform Admin",
        "branch-manager": "Leasing Management",
        "ad-manager": "Ad Management",
    };
    const subtitle = roleLabels[role] || "Leasing Management";

    return (
        <div className="hidden md:flex flex-col h-full bg-card border-r border-border">
            {/* Header */}
            <div className="p-6 border-b border-border">
                <h2 className="text-2xl font-bold text-primary">TradeHub Admin</h2>
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
                    const isBranchManager = user.role === "branch-manager";
                    const isAdManager = user.role === "ad-manager";

                    // Hide sensitive pages for branch managers
                    if (isBranchManager && (item.title === "Users" || item.title === "Branches" || item.title === "Analytics" || item.title === "Ad Management" || item.title === "Finance Settings")) {
                        return null;
                    }

                    // Ads Manager can only see Vehicles and Ad Management
                    if (isAdManager && !["Vehicles", "Ad Management"].includes(item.title)) {
                        return null;
                    }

                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg hover font-medium transition-all",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={onLogout}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default AdminSidebar;
