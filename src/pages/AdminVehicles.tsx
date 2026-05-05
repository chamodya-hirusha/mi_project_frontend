"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileMenu from "@/components/admin/AdminMobileMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VehicleListing } from "@/types";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/usePagination";

const AdminVehicles = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [vehicles, setVehicles] = useState<VehicleListing[]>([]);
    const [filteredVehicles, setFilteredVehicles] = useState<VehicleListing[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Rejection Dialog State
    const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

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
            parsedUser.role === "ad-manager" ||
            parsedUser.isAdmin === true;

        if (!hasAdminAccess) {
            toast({
                title: "Access Denied",
                description: "You don't have permission to access the admin dashboard",
                variant: "destructive",
            });
            router.push("/");
            return;
        }

        setCurrentUser(parsedUser);
        loadVehicles();
    }, [router, toast]);

    const loadVehicles = () => {
        const stored = localStorage.getItem("listings");
        if (stored) {
            const allVehicles = JSON.parse(stored);
            setVehicles(allVehicles);
            const pendingCount = allVehicles.filter((v: VehicleListing) => v.status === "pending").length;
            console.log(`📋 Loaded ${allVehicles.length} vehicles, ${pendingCount} pending approval`);
        }
    };

    useEffect(() => {
        let filtered = [...vehicles];

        if (searchQuery) {
            filtered = filtered.filter(
                (v) =>
                    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    v.model.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((v) => v.status === statusFilter);
        }

        setFilteredVehicles(filtered);
    }, [vehicles, searchQuery, statusFilter]);

    const updateVehicleStatus = (vehicleId: string, newStatus: "approved" | "rejected", reason?: string) => {
        const vehicle = vehicles.find((v) => v.id === vehicleId);
        if (!vehicle) return;

        const updated = vehicles.map((v) =>
            v.id === vehicleId ? { ...v, status: newStatus, rejectionReason: reason, updatedAt: new Date().toISOString() } : v
        );

        setVehicles(updated);
        localStorage.setItem("listings", JSON.stringify(updated));

        // Create notification for the user
        const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
        const notification = {
            id: crypto.randomUUID(),
            userId: vehicle.userId,
            type: newStatus === "approved" ? "ad_approved" : "ad_rejected",
            title: newStatus === "approved"
                ? "Your ad has been approved!"
                : "Your ad has been rejected",
            message: newStatus === "approved"
                ? `Your vehicle ad "${vehicle.title}" has been approved and is now live on the site.`
                : `Your vehicle ad "${vehicle.title}" has been rejected. ${reason ? `Reason: ${reason}` : ""}`,
            vehicleId: vehicle.id,
            vehicleTitle: vehicle.title,
            rejectionReason: reason,
            read: false,
            createdAt: new Date().toISOString(),
        };
        notifications.unshift(notification);
        localStorage.setItem("notifications", JSON.stringify(notifications));

        toast({
            title: newStatus === "approved" ? "Ad Approved" : "Ad Rejected",
            description: newStatus === "approved"
                ? "The ad is now live on the site."
                : "The rejection reason has been sent to the user.",
            variant: newStatus === "approved" ? "default" : "destructive",
        });
    };

    const handleRejectClick = (vehicleId: string) => {
        setSelectedVehicleId(vehicleId);
        setRejectionReason("");
        setRejectionDialogOpen(true);
    };

    const confirmRejection = () => {
        if (selectedVehicleId) {
            updateVehicleStatus(selectedVehicleId, "rejected", rejectionReason);
            setRejectionDialogOpen(false);
            setSelectedVehicleId(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        toast({
            title: "Logged out",
            description: "You have been successfully logged out",
        });
        router.push("/auth");
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge className="bg-yellow-500">Pending</Badge>;
            case "approved":
                return <Badge className="bg-green-500">Approved</Badge>;
            case "rejected":
                return <Badge className="bg-red-500">Rejected</Badge>;
            default:
                return <Badge>{status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}</Badge>;
        }
    };

    const pendingVehicles = vehicles.filter(v => v.status === "pending");

    const VehiclesTable = ({ data }: { data: VehicleListing[] }) => {
        const pagination = usePagination({ data, itemsPerPage: 10 });

        return (
            <>
                <div className="mb-4 text-xs md:text-sm text-muted-foreground">
                    Showing {pagination.startIndex} to {pagination.endIndex} of {pagination.totalItems} vehicles
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {pagination.paginatedData.map((vehicle) => (
                        <Card key={vehicle.id}>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex gap-3">
                                    <img
                                        src={vehicle.images[0]}
                                        alt={vehicle.title}
                                        className="w-20 h-20 object-cover rounded flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm line-clamp-2">{vehicle.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {vehicle.make} {vehicle.model} • {vehicle.year}
                                        </p>
                                        <p className="text-sm font-semibold text-primary mt-1">
                                            {formatCurrency(vehicle.price)}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {getStatusBadge(vehicle.status)}
                                    </div>
                                </div>
                                <div className="pt-2 border-t text-xs text-muted-foreground">
                                    <p>{vehicle.location.town}, {vehicle.location.district}</p>
                                </div>
                                <div className="flex gap-2">
                                    {vehicle.status === "pending" && (
                                        <>
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 flex-1"
                                                onClick={() => updateVehicleStatus(vehicle.id, "approved")}
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="flex-1"
                                                onClick={() => handleRejectClick(vehicle.id)}
                                            >
                                                <XCircle className="w-4 h-4 mr-1" />
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => router.push(`/listing/${vehicle.id}`)}
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Make/Model</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pagination.paginatedData.map((vehicle) => (
                                <TableRow key={vehicle.id}>
                                    <TableCell>
                                        <img
                                            src={vehicle.images[0]}
                                            alt={vehicle.title}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium line-clamp-2 max-w-xs">
                                            {vehicle.title}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        {vehicle.make} {vehicle.model}
                                    </TableCell>
                                    <TableCell>{vehicle.year}</TableCell>
                                    <TableCell className="font-semibold">
                                        {formatCurrency(vehicle.price)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p>{vehicle.location.town}</p>
                                            <p className="text-muted-foreground text-xs">
                                                {vehicle.location.district}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {vehicle.status === "pending" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => updateVehicleStatus(vehicle.id, "approved")}
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleRejectClick(vehicle.id)}
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.push(`/listing/${vehicle.id}`)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {pagination.totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={pagination.previousPage}
                                        className={!pagination.canGoPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                                    if (
                                        page === 1 ||
                                        page === pagination.totalPages ||
                                        (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                                    ) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() => pagination.goToPage(page)}
                                                    isActive={pagination.currentPage === page}
                                                    className="cursor-pointer"
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    } else if (page === pagination.currentPage - 2 || page === pagination.currentPage + 2) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }
                                    return null;
                                })}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={pagination.nextPage}
                                        className={!pagination.canGoNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </>
        );
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
                <div className="p-4 md:p-8 space-y-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Vehicle Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and approve vehicle listings
                        </p>
                    </div>

                    <Tabs defaultValue="pending" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 max-w-full md:max-w-[400px]">
                            <TabsTrigger value="pending" className="text-xs md:text-sm">
                                Pending ({pendingVehicles.length})
                            </TabsTrigger>
                            <TabsTrigger value="all" className="text-xs md:text-sm">All Listings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pending Approvals</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {pendingVehicles.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-muted-foreground">No pending approvals</p>
                                        </div>
                                    ) : (
                                        <VehiclesTable data={pendingVehicles} />
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="all" className="mt-6">
                            <div className="space-y-6">
                                {/* Filters */}
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                            <div className="flex-1 relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                <Input
                                                    placeholder="Search vehicles..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                <Button
                                                    variant={statusFilter === "all" ? "default" : "outline"}
                                                    onClick={() => setStatusFilter("all")}
                                                    size="sm"
                                                    className="text-xs sm:text-sm"
                                                >
                                                    All
                                                </Button>
                                                <Button
                                                    variant={statusFilter === "pending" ? "default" : "outline"}
                                                    onClick={() => setStatusFilter("pending")}
                                                    size="sm"
                                                    className="text-xs sm:text-sm"
                                                >
                                                    Pending
                                                </Button>
                                                <Button
                                                    variant={statusFilter === "approved" ? "default" : "outline"}
                                                    onClick={() => setStatusFilter("approved")}
                                                    size="sm"
                                                    className="text-xs sm:text-sm"
                                                >
                                                    Approved
                                                </Button>
                                                <Button
                                                    variant={statusFilter === "rejected" ? "default" : "outline"}
                                                    onClick={() => setStatusFilter("rejected")}
                                                    size="sm"
                                                    className="text-xs sm:text-sm"
                                                >
                                                    Rejected
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Vehicles Table */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>All Vehicles ({filteredVehicles.length})</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {filteredVehicles.length === 0 ? (
                                            <div className="text-center py-12">
                                                <p className="text-muted-foreground">No vehicles found</p>
                                            </div>
                                        ) : (
                                            <VehiclesTable data={filteredVehicles} />
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
                        <DialogContent className="p-4 md:p-6">
                            <DialogHeader>
                                <DialogTitle>Reject Advertisement</DialogTitle>
                                <DialogDescription>
                                    Please provide a reason for rejecting this advertisement. This will be sent to the user.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Label htmlFor="reason" className="mb-2 block">Rejection Reason</Label>
                                <Textarea
                                    id="reason"
                                    placeholder="e.g., Inappropriate images, Incorrect details..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    rows={4}
                                    className="w-full"
                                />
                            </div>
                            <DialogFooter className="flex-col sm:flex-row gap-2">
                                <Button variant="outline" onClick={() => setRejectionDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                                <Button variant="destructive" onClick={confirmRejection} disabled={!rejectionReason.trim()} className="w-full sm:w-auto">
                                    Reject Ad
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default AdminVehicles;
