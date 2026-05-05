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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { User, Branch } from "@/types";
import { Search, MoreHorizontal, UserX, UserCheck, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { hashPassword } from "@/lib/security";
import { usePagination } from "@/hooks/usePagination";

const AdminUsers = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [selectedRole, setSelectedRole] = useState("user");
    const [selectedBranch, setSelectedBranch] = useState("");

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
        loadUsers();
        loadBranches();
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
        let filtered = [...users];

        if (searchQuery) {
            filtered = filtered.filter(
                (u) =>
                    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.phoneNumber.includes(searchQuery)
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((u) => u.status === statusFilter);
        }

        if (roleFilter !== "all") {
            filtered = filtered.filter((u) => u.role === roleFilter);
        }

        setFilteredUsers(filtered);
    }, [users, searchQuery, statusFilter, roleFilter]);

    const updateUserStatus = (userId: string, newStatus: "active" | "suspended") => {
        const updated = users.map((u) =>
            u.id === userId ? { ...u, status: newStatus } : u
        );

        setUsers(updated);
        localStorage.setItem("users", JSON.stringify(updated));

        toast({
            title: "Status Updated",
            description: `User has been ${newStatus}`,
        });
    };

    const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        // Check if email exists
        if (users.find(u => u.email === email)) {
            toast({
                title: "Error",
                description: "User with this email already exists",
                variant: "destructive",
            });
            setIsLoading(false);
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
            role: selectedRole, // 'admin', 'branch-manager', 'user'
        };

        if (selectedRole === "branch-manager") {
            if (!selectedBranch) {
                toast({
                    title: "Error",
                    description: "Please select a branch for the Branch Manager",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }
            newUser.branchId = selectedBranch;
        }

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        toast({
            title: "Success",
            description: "New user created successfully",
        });

        setIsLoading(false);
        setIsAddDialogOpen(false);
        // Reset form
        setSelectedRole("user");
        setSelectedBranch("");
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        router.push("/admin/login");
    };

    const pagination = usePagination({ data: filteredUsers, itemsPerPage: 10 });

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
                            <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
                            <p className="text-muted-foreground mt-1">
                                Manage registered users and their accounts
                            </p>
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New User
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Add New User</DialogTitle>
                                    <DialogDescription>
                                        Create a new user account.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddUser}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                            <Label htmlFor="name" className="sm:text-right">
                                                Name
                                            </Label>
                                            <Input id="name" name="name" className="sm:col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                            <Label htmlFor="email" className="sm:text-right">
                                                Email
                                            </Label>
                                            <Input id="email" name="email" type="email" className="sm:col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                            <Label htmlFor="phone" className="sm:text-right">
                                                Phone
                                            </Label>
                                            <Input id="phone" name="phone" className="sm:col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                            <Label htmlFor="password" className="sm:text-right">
                                                Password
                                            </Label>
                                            <Input id="password" name="password" type="password" className="sm:col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                            <Label htmlFor="role" className="sm:text-right">
                                                Role
                                            </Label>
                                            <Select onValueChange={setSelectedRole} defaultValue="user">
                                                <SelectTrigger className="sm:col-span-3">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="user">User</SelectItem>
                                                    <SelectItem value="ad-manager">Ads Manager</SelectItem>
                                                    <SelectItem value="branch-manager">Branch Manager</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {selectedRole === "branch-manager" && (
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="branch" className="sm:text-right">
                                                    Branch
                                                </Label>
                                                <Select onValueChange={setSelectedBranch}>
                                                    <SelectTrigger className="sm:col-span-3">
                                                        <SelectValue placeholder="Select branch" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {branches.map((branch) => (
                                                            <SelectItem key={branch.id} value={branch.id}>
                                                                {branch.name} ({branch.location.town})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? "Creating..." : "Create User"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        placeholder="Search users by name, email or phone..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={statusFilter === "all" ? "default" : "outline"}
                                        onClick={() => setStatusFilter("all")}
                                        size="sm"
                                        className="text-xs sm:text-sm"
                                    >
                                        All
                                    </Button>
                                    <Button
                                        variant={statusFilter === "active" ? "default" : "outline"}
                                        onClick={() => setStatusFilter("active")}
                                        size="sm"
                                        className="text-xs sm:text-sm"
                                    >
                                        Active
                                    </Button>
                                    <Button
                                        variant={statusFilter === "suspended" ? "default" : "outline"}
                                        onClick={() => setStatusFilter("suspended")}
                                        size="sm"
                                        className="text-xs sm:text-sm"
                                    >
                                        Suspended
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={roleFilter === "all" ? "default" : "outline"}
                                        onClick={() => setRoleFilter("all")}
                                        size="sm"
                                        className="text-xs sm:text-sm"
                                    >
                                        All Roles
                                    </Button>
                                    <Button
                                        variant={roleFilter === "ad-manager" ? "default" : "outline"}
                                        onClick={() => setRoleFilter("ad-manager")}
                                        size="sm"
                                        className="text-xs sm:text-sm"
                                    >
                                        Ads Managers
                                    </Button>
                                    <Button
                                        variant={roleFilter === "branch-manager" ? "default" : "outline"}
                                        onClick={() => setRoleFilter("branch-manager")}
                                        size="sm"
                                        className="text-xs sm:text-sm"
                                    >
                                        Branch Managers
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Users ({filteredUsers.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 text-xs md:text-sm text-muted-foreground">
                                Showing {pagination.startIndex} to {pagination.endIndex} of {pagination.totalItems} users
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {pagination.paginatedData.map((user) => (
                                    <Card key={user.id}>
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                    <p className="text-xs text-muted-foreground">{user.phoneNumber}</p>
                                                </div>
                                                <Badge
                                                    variant={user.status === "active" ? "default" : "destructive"}
                                                    className={user.status === "active" ? "bg-green-600" : ""}
                                                >
                                                    {user.status === "active" ? "Active" : user.status === "suspended" ? "Suspended" : user.status}
                                                </Badge>
                                            </div>
                                            <div className="pt-2 border-t text-xs text-muted-foreground">
                                                Joined: {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => navigator.clipboard.writeText(user.email)}
                                                >
                                                    Copy Email
                                                </Button>
                                                {user.status === "active" ? (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => updateUserStatus(user.id, "suspended")}
                                                    >
                                                        <UserX className="w-4 h-4 mr-1" />
                                                        Suspend
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                                        onClick={() => updateUserStatus(user.id, "active")}
                                                    >
                                                        <UserCheck className="w-4 h-4 mr-1" />
                                                        Activate
                                                    </Button>
                                                )}
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
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Joined Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pagination.paginatedData.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.phoneNumber}</TableCell>
                                                <TableCell>
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={user.status === "active" ? "default" : "destructive"}
                                                        className={user.status === "active" ? "bg-green-600" : ""}
                                                    >
                                                        {user.status === "active" ? "Active" : user.status === "suspended" ? "Suspended" : user.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() => navigator.clipboard.writeText(user.email)}
                                                            >
                                                                Copy Email
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            {user.status === "active" ? (
                                                                <DropdownMenuItem
                                                                    className="text-destructive"
                                                                    onClick={() => updateUserStatus(user.id, "suspended")}
                                                                >
                                                                    <UserX className="mr-2 h-4 w-4" />
                                                                    Suspend User
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem
                                                                    className="text-green-600"
                                                                    onClick={() => updateUserStatus(user.id, "active")}
                                                                >
                                                                    <UserCheck className="mr-2 h-4 w-4" />
                                                                    Activate User
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
