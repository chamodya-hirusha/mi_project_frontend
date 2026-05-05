"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileMenu from "@/components/admin/AdminMobileMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Branch, User } from "@/types";
import { Search, MapPin, Phone, Mail, Building, Plus, Users, UserPlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/usePagination";
import { hashPassword } from "@/lib/security";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminBranches = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Branch user management
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [branchUsersDialogOpen, setBranchUsersDialogOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [newUserRole, setNewUserRole] = useState("branch-manager");

    useEffect(() => {
        // Check if user is admin
        const user = localStorage.getItem("currentUser");
        if (!user) {
            router.push("/admin/login");
            return;
        }

        const parsedUser = JSON.parse(user);
        // Only allow super-admin or admin to access this page
        if (parsedUser.role !== "admin" && parsedUser.role !== "super-admin") {
            toast({
                title: "Access Denied",
                description: "You do not have permission to view this page.",
                variant: "destructive",
            });
            router.push("/admin");
            return;
        }

        setCurrentUser(parsedUser);
        loadBranches();
        loadUsers();
    }, [router, toast]);

    const loadUsers = () => {
        const stored = localStorage.getItem("users");
        if (stored) {
            setUsers(JSON.parse(stored));
        }
    };

    const loadBranches = () => {
        const stored = localStorage.getItem("branches");
        if (stored) {
            setBranches(JSON.parse(stored));
        }
    };

    useEffect(() => {
        let filtered = [...branches];

        if (searchQuery) {
            filtered = filtered.filter(
                (b) =>
                    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    b.location.town.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    b.managerName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredBranches(filtered);
    }, [branches, searchQuery]);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        router.push("/admin/login");
    };

    const handleBranchClick = (branch: Branch) => {
        setSelectedBranch(branch);
        setBranchUsersDialogOpen(true);
    };

    const getBranchUsers = (branchId: string) => {
        return users.filter((u) => u.branchId === branchId);
    };

    const assignUserToBranch = (userId: string) => {
        if (!selectedBranch) return;

        const user = users.find((u) => u.id === userId);
        if (!user) return;

        const previousBranch = branches.find((b) => b.id === user.branchId);

        const updatedUsers = users.map((u) =>
            u.id === userId ? { ...u, branchId: selectedBranch.id, role: u.role === "branch-manager" ? "branch-manager" : (u.role || "user") } : u
        );
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        loadUsers();

        toast({
            title: "Success",
            description: previousBranch
                ? `User reassigned from ${previousBranch.name} to ${selectedBranch.name}`
                : "User assigned to branch successfully",
        });
    };

    const removeUserFromBranch = (userId: string) => {
        if (!selectedBranch) return;

        const updatedUsers = users.map((u) =>
            u.id === userId ? { ...u, branchId: undefined } : u
        );
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        loadUsers();

        toast({
            title: "Success",
            description: "User removed from branch successfully",
        });
    };

    const handleCreateUserForBranch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreatingUser(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        // Check if email exists
        if (users.find((u) => u.email === email)) {
            toast({
                title: "Error",
                description: "User with this email already exists",
                variant: "destructive",
            });
            setIsCreatingUser(false);
            return;
        }

        if (!selectedBranch) {
            setIsCreatingUser(false);
            return;
        }

        const newUser: any = {
            id: `user-${Date.now()}`,
            name: formData.get("name") as string,
            email: email,
            phoneNumber: formData.get("phone") as string,
            password: hashPassword(formData.get("password") as string),
            createdAt: new Date().toISOString(),
            status: "active",
            role: newUserRole,
            branchId: selectedBranch.id,
        };

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        loadUsers();

        toast({
            title: "Success",
            description: "New user created and assigned to branch successfully",
        });

        setIsCreatingUser(false);
        // Reset form
        (e.target as HTMLFormElement).reset();
    };

    const handleAddBranch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        const newBranch: Branch = {
            id: `branch-${Date.now()}`,
            name: formData.get("name") as string,
            location: {
                province: formData.get("province") as string,
                district: formData.get("district") as string,
                town: formData.get("town") as string,
            },
            address: formData.get("address") as string,
            contactNumber: formData.get("contact") as string,
            email: formData.get("email") as string,
            managerName: formData.get("manager") as string,
            status: "active",
            openingHours: "Mon-Fri: 8:30 AM - 5:00 PM", // Default
        };

        const updatedBranches = [...branches, newBranch];
        setBranches(updatedBranches);
        localStorage.setItem("branches", JSON.stringify(updatedBranches));

        toast({
            title: "Success",
            description: "New branch created successfully",
        });

        setIsLoading(false);
        setIsAddDialogOpen(false);
    };

    const pagination = usePagination({ data: filteredBranches, itemsPerPage: 9 });

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
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Branch Management</h1>
                            <p className="text-muted-foreground mt-1">
                                Manage leasing branches and locations
                            </p>
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Branch
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Branch</DialogTitle>
                                    <DialogDescription>
                                        Enter the details for the new leasing branch.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddBranch}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                            <Label htmlFor="name" className="sm:text-right">
                                                Branch Name
                                            </Label>
                                            <Input id="name" name="name" className="sm:col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                            <Label htmlFor="town" className="sm:text-right">
                                                Town
                                            </Label>
                                            <Input id="town" name="town" className="sm:col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                            <Label htmlFor="district" className="sm:text-right">
                                                District
                                            </Label>
                                            <Input id="district" name="district" className="sm:col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                            <Label htmlFor="province" className="sm:text-right">
                                                Province
                                            </Label>
                                            <Input id="province" name="province" className="sm:col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                            <Label htmlFor="address" className="sm:text-right">
                                                Address
                                            </Label>
                                            <Input id="address" name="address" className="sm:col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                            <Label htmlFor="contact" className="sm:text-right">
                                                Contact No
                                            </Label>
                                            <Input id="contact" name="contact" className="sm:col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                            <Label htmlFor="email" className="sm:text-right">
                                                Email
                                            </Label>
                                            <Input id="email" name="email" type="email" className="sm:col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                            <Label htmlFor="manager" className="sm:text-right">
                                                Manager
                                            </Label>
                                            <Input id="manager" name="manager" className="sm:col-span-3" required />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? "Creating..." : "Create Branch"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Search branches by name, location or manager..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Branches Grid */}
                    <div className="mb-4 text-sm text-muted-foreground">
                        Showing {pagination.startIndex} to {pagination.endIndex} of {pagination.totalItems} branches
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pagination.paginatedData.map((branch) => {
                            const branchUsers = getBranchUsers(branch.id);
                            return (
                                <Card
                                    key={branch.id}
                                    className="hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => handleBranchClick(branch)}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl">{branch.name}</CardTitle>
                                            <Badge variant={branch.status === "active" ? "default" : "secondary"}>
                                                {branch.status === "active" ? "Active" : branch.status === "inactive" ? "Inactive" : branch.status.charAt(0).toUpperCase() + branch.status.slice(1).toLowerCase()}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-start gap-3 text-sm">
                                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="font-medium">{branch.location.town}</p>
                                                <p className="text-muted-foreground">{branch.address}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span>{branch.contactNumber}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <span className="truncate">{branch.email}</span>
                                        </div>

                                        <div className="pt-3 border-t">
                                            <p className="text-xs text-muted-foreground mb-1">Branch Manager</p>
                                            <p className="font-medium">{branch.managerName}</p>
                                        </div>

                                        <div className="pt-2 border-t">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-muted-foreground mb-1">Assigned Users</p>
                                                <Badge variant="outline">{branchUsers.length}</Badge>
                                            </div>
                                            {branchUsers.length > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    {branchUsers.slice(0, 2).map((user) => (
                                                        <p key={user.id} className="text-sm font-medium truncate">
                                                            {user.name}
                                                        </p>
                                                    ))}
                                                    {branchUsers.length > 2 && (
                                                        <p className="text-xs text-muted-foreground">
                                                            +{branchUsers.length - 2} more
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-2">
                                            <p className="text-xs text-muted-foreground mb-1">Opening Hours</p>
                                            <p className="text-sm">{branch.openingHours}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
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
                </div>
            </div>

            {/* Branch Users Management Dialog */}
            <Dialog open={branchUsersDialogOpen} onOpenChange={setBranchUsersDialogOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto p-4 md:p-6">
                    <DialogHeader>
                        <DialogTitle>Manage Users - {selectedBranch?.name}</DialogTitle>
                        <DialogDescription>
                            View assigned users, assign existing users, or create new users for this branch
                        </DialogDescription>
                    </DialogHeader>

                    {selectedBranch && (
                        <Tabs defaultValue="assigned" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="assigned">
                                    <Users className="w-4 h-4 mr-2" />
                                    Assigned ({getBranchUsers(selectedBranch.id).length})
                                </TabsTrigger>
                                <TabsTrigger value="existing">
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Assign Existing
                                </TabsTrigger>
                                <TabsTrigger value="create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create New
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="assigned" className="space-y-4">
                                {getBranchUsers(selectedBranch.id).length === 0 ? (
                                    <div className="text-center py-8">
                                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">No users assigned to this branch</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {getBranchUsers(selectedBranch.id).map((user) => (
                                            <Card key={user.id}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <p className="font-medium">{user.name}</p>
                                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                                            <p className="text-sm text-muted-foreground">{user.phoneNumber}</p>
                                                            {user.role && (
                                                                <Badge variant="outline" className="mt-1">
                                                                    {user.role}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeUserFromBranch(user.id)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="existing" className="space-y-4">
                                {users.filter((u) => u.branchId !== selectedBranch.id || !u.branchId).length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">No available users to assign</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {users
                                            .filter((u) => u.branchId !== selectedBranch.id || !u.branchId)
                                            .map((user) => {
                                                const userCurrentBranch = branches.find((b) => b.id === user.branchId);
                                                return (
                                                    <Card key={user.id}>
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <p className="font-medium">{user.name}</p>
                                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                                    <p className="text-sm text-muted-foreground">{user.phoneNumber}</p>
                                                                    <div className="flex gap-2 mt-1">
                                                                        {user.role && (
                                                                            <Badge variant="outline">
                                                                                {user.role}
                                                                            </Badge>
                                                                        )}
                                                                        {userCurrentBranch && (
                                                                            <Badge variant="secondary">
                                                                                {userCurrentBranch.name}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => assignUserToBranch(user.id)}
                                                                >
                                                                    {userCurrentBranch ? "Reassign" : "Assign"}
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="create" className="space-y-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <form onSubmit={handleCreateUserForBranch}>
                                            <div className="grid gap-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="new-user-name">Name</Label>
                                                        <Input id="new-user-name" name="name" required />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="new-user-email">Email</Label>
                                                        <Input id="new-user-email" name="email" type="email" required />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="new-user-phone">Phone</Label>
                                                        <Input id="new-user-phone" name="phone" required />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="new-user-password">Password</Label>
                                                        <Input id="new-user-password" name="password" type="password" required />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="new-user-role">Role</Label>
                                                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="branch-manager">Branch Manager</SelectItem>
                                                            <SelectItem value="user">User</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Button type="submit" disabled={isCreatingUser} className="w-full sm:w-auto">
                                                    {isCreatingUser ? "Creating..." : "Create User"}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminBranches;
