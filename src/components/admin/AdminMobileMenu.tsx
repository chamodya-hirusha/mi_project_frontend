// /**
//  * AdminMobileMenu Component
//  * 
//  * Provides a responsive mobile navigation menu for the admin panel using a Sheet (drawer).
//  * Replicates the sidebar functionality for smaller screens with role-based access control.
//  */

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import {
//     LayoutDashboard,
//     Car,
//     FileText,
//     Users,
//     MapPin,
//     Settings,
//     LogOut,
//     Menu,
//     BarChart3,
//     Megaphone,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//     Sheet,
//     SheetContent,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
// } from "@/components/ui/sheet";
// import { useState } from "react";

// /**
//  * Props for AdminMobileMenu
//  */
// interface AdminMobileMenuProps {
//     /** Callback for when the user logs out */
//     onLogout?: () => void;
// }

// /**
//  * Shared navigation items with AdminSidebar
//  */
// const navItems = [
//     {
//         title: "Overview",
//         href: "/admin",
//         icon: LayoutDashboard,
//     },
//     {
//         title: "Vehicles",
//         href: "/admin/vehicles",
//         icon: Car,
//     },
//     {
//         title: "Lease Applications",
//         href: "/admin/applications",
//         icon: FileText,
//     },
//     {
//         title: "Users",
//         href: "/admin/users",
//         icon: Users,
//     },
//     {
//         title: "Branches",
//         href: "/admin/branches",
//         icon: MapPin,
//     },
//     {
//         title: "Analytics",
//         href: "/admin/analytics",
//         icon: BarChart3,
//     },
//     {
//         title: "Ad Management",
//         href: "/admin/ads",
//         icon: Megaphone,
//     },
//     {
//         title: "Finance Settings",
//         href: "/admin/finance",
//         icon: Settings,
//     },
// ];

// const AdminMobileMenu = ({ onLogout }: AdminMobileMenuProps) => {
//     const pathname = usePathname();
//     const [open, setOpen] = useState(false);

//     // Retrieve user session for role-based rendering
//     const userStore = typeof window !== 'undefined' ? localStorage.getItem("currentUser") : null;
//     const userData = userStore ? JSON.parse(userStore) : {};
//     const role = userData.role || "";

//     /** Friendly labels for the current user's role */
//     const roleLabels: Record<string, string> = {
//         "super-admin": "Platform Admin",
//         "admin": "Platform Admin",
//         "branch-manager": "Leasing Management",
//         "ad-manager": "Ad Management",
//     };
//     const subtitle = roleLabels[role] || "Leasing Management";

//     /** Closes the menu when a link is clicked */
//     const handleLinkClick = () => {
//         setOpen(false);
//     };

//     return (
//         <Sheet open={open} onOpenChange={setOpen}>
//             {/* Hamburger Trigger Button */}
//             <SheetTrigger asChild>
//                 <Button variant="ghost" size="icon" className="md:hidden">
//                     <Menu className="h-5 w-5" />
//                 </Button>
//             </SheetTrigger>
            
//             <SheetContent side="left" className="w-64 p-0">
//                 <div className="flex flex-col h-full">
//                     {/* Header with Title and Subtitle */}
//                     <SheetHeader className="p-6 border-b border-border">
//                         <SheetTitle className="text-2xl font-bold text-primary text-left">
//                             TradeHub Admin
//                         </SheetTitle>
//                         <p className="text-sm text-muted-foreground mt-1 text-left">
//                             {subtitle}
//                         </p>
//                     </SheetHeader>

//                     {/* Navigation Links with Role-Based Filtering */}
//                     <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//                         {navItems.map((item) => {
//                             const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
//                             const isBranchManager = user.role === "branch-manager";
//                             const isAdManager = user.role === "ad-manager";

//                             // Apply the same RBAC rules as the sidebar
//                             if (isBranchManager && (item.title === "Users" || item.title === "Branches" || item.title === "Analytics" || item.title === "Ad Management" || item.title === "Finance Settings")) {
//                                 return null;
//                             }

//                             if (isAdManager && !["Vehicles", "Ad Management"].includes(item.title)) {
//                                 return null;
//                             }

//                             const isActive = pathname === item.href;
//                             const Icon = item.icon;

//                             return (
//                                 <Link
//                                     key={item.href}
//                                     href={item.href}
//                                     onClick={handleLinkClick}
//                                     className={cn(
//                                         "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all",
//                                         isActive
//                                             ? "bg-primary text-primary-foreground shadow-md"
//                                             : "hover:bg-muted text-muted-foreground hover:text-foreground"
//                                     )}
//                                 >
//                                     <Icon className="w-5 h-5" />
//                                     <span>{item.title}</span>
//                                 </Link>
//                             );
//                         })}
//                     </nav>

//                     {/* Logout Button at the Bottom */}
//                     <div className="p-4 border-t border-border">
//                         <Button
//                             variant="ghost"
//                             className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
//                             onClick={() => {
//                                 if (onLogout) {
//                                     onLogout();
//                                 }
//                                 setOpen(false);
//                             }}
//                         >
//                             <LogOut className="w-5 h-5 mr-3" />
//                             Logout
//                         </Button>
//                     </div>
//                 </div>
//             </SheetContent>
//         </Sheet>
//     );
// };

// export default AdminMobileMenu;

