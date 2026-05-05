"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/usePagination";
import {
    Package,
    Heart,
    Settings,
    Edit,
    Trash2,
    Eye,
    MessageCircle,
    TrendingUp,
    Clock,
    AlertCircle,
    MapPin,
    Search,
    ChevronRight,
    ArrowUpRight,
    Calendar,
    Gauge,
    Fuel,
    CheckCircle
} from "lucide-react";
import { VehicleListing, Conversation, Message } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
    const { t } = useLanguage();
    const router = useRouter();
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [myListings, setMyListings] = useState<VehicleListing[]>([]);
    const [favorites, setFavorites] = useState<any[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
    const [replyContent, setReplyContent] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [listingToDelete, setListingToDelete] = useState<string | null>(null);
    const [deleteReason, setDeleteReason] = useState("");
    const [conversationVehicle, setConversationVehicle] = useState<VehicleListing | null>(null);

    useEffect(() => {
        const user = localStorage.getItem("currentUser");
        if (!user) {
            toast({
                title: t.nav_authRequired,
                description: t.nav_authRequiredDesc,
                variant: "destructive",
            });
            router.push("/auth");
            return;
        }
        setCurrentUser(JSON.parse(user));

        const allListings: VehicleListing[] = JSON.parse(localStorage.getItem("listings") || "[]");
        const userData = JSON.parse(user);
        let userListings = allListings.filter((l: VehicleListing) => l.userId === userData.id);

        if (userListings.length === 0 && userData.email === "demo@user.com") {
            const updatedListings = allListings.map((l: VehicleListing) => {
                if (l.userId === "demo-user" || (l.userName === "Demo User" && !l.userId)) {
                    return {
                        ...l,
                        userId: userData.id,
                        userName: userData.name,
                        userEmail: userData.email,
                    };
                }
                return l;
            });
            localStorage.setItem("listings", JSON.stringify(updatedListings));
            userListings = updatedListings.filter((l: VehicleListing) => l.userId === userData.id);
        }

        userListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMyListings(userListings);

        const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavorites(storedFavorites);
    }, [router, toast, t]);

    const loadConversations = () => {
        const storedConversations: Conversation[] = JSON.parse(localStorage.getItem("conversations") || "[]");
        const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");

        const userConversations = storedConversations.filter((c) =>
            c.participants.some((p) => p.userId === userData.id)
        );

        userConversations.sort((a, b) => {
            const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : new Date(a.createdAt).getTime();
            const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : new Date(b.createdAt).getTime();
            return timeB - timeA;
        });

        setConversations(userConversations);
    };

    useEffect(() => {
        if (currentUser) {
            loadConversations();
        }
    }, [currentUser]);

    const handleDeleteListing = (id: string) => {
        setListingToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteListing = () => {
        if (!listingToDelete) return;

        const allListings: VehicleListing[] = JSON.parse(localStorage.getItem("listings") || "[]");
        const updatedListings = allListings.filter((l: VehicleListing) => l.id !== listingToDelete);
        localStorage.setItem("listings", JSON.stringify(updatedListings));
        setMyListings(updatedListings.filter((l: VehicleListing) => l.userId === currentUser.id));

        setDeleteDialogOpen(false);
        setListingToDelete(null);
        setDeleteReason("");

        toast({
            title: "Listing Deleted",
            description: "Your advertisement has been removed from the platform.",
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge className="bg-yellow-500 hover:bg-yellow-600">{t.dash_pending}</Badge>;
            case "approved":
                return <Badge className="bg-green-500 hover:bg-green-600">{t.dash_active}</Badge>;
            case "rejected":
                return <Badge className="bg-red-500 hover:bg-red-600">{t.dash_rejected}</Badge>;
            case "sold":
                return <Badge className="bg-gray-500 hover:bg-gray-600">Sold</Badge>;
            default:
                return <Badge>{status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}</Badge>;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const loadConversationMessages = (conversationId: string) => {
        const storedMessages: Message[] = JSON.parse(localStorage.getItem("messages") || "[]");
        const messages = storedMessages
            .filter((m) => m.conversationId === conversationId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setConversationMessages(messages);
    };

    const handleOpenConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
        loadConversationMessages(conversation.id);
        
        // Load vehicle details
        const allListings: VehicleListing[] = JSON.parse(localStorage.getItem("listings") || "[]");
        const vehicle = allListings.find((v) => v.id === conversation.vehicleId);
        setConversationVehicle(vehicle || null);

        // Mark messages as read
        const storedMessages: Message[] = JSON.parse(localStorage.getItem("messages") || "[]");
        const updatedMessages = storedMessages.map((m) => {
            if (m.conversationId === conversation.id && m.receiverId === currentUser?.id) {
                return { ...m, read: true };
            }
            return m;
        });
        localStorage.setItem("messages", JSON.stringify(updatedMessages));

        // Update unread count in conversations
        const storedConversations: Conversation[] = JSON.parse(localStorage.getItem("conversations") || "[]");
        const updatedConversations = storedConversations.map(c => {
            if (c.id === conversation.id) return { ...c, unreadCount: 0 };
            return c;
        });
        localStorage.setItem("conversations", JSON.stringify(updatedConversations));
        loadConversations();
    };

    const handleSendReply = () => {
        if (!selectedConversation || !replyContent.trim() || !currentUser) return;

        const storedMessages: Message[] = JSON.parse(localStorage.getItem("messages") || "[]");
        const otherParticipant = selectedConversation.participants.find((p) => p.userId !== currentUser.id);

        if (!otherParticipant) return;

        const message: Message = {
            id: `msg-${Date.now()}`,
            conversationId: selectedConversation.id,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderEmail: currentUser.email,
            receiverId: otherParticipant.userId,
            receiverName: otherParticipant.userName,
            receiverEmail: otherParticipant.userEmail,
            vehicleId: selectedConversation.vehicleId,
            vehicleTitle: selectedConversation.vehicleTitle,
            content: replyContent.trim(),
            read: false,
            createdAt: new Date().toISOString(),
        };

        storedMessages.push(message);
        localStorage.setItem("messages", JSON.stringify(storedMessages));

        const storedConversations: Conversation[] = JSON.parse(localStorage.getItem("conversations") || "[]");
        const updatedConversations = storedConversations.map((c) => {
            if (c.id === selectedConversation.id) {
                return {
                    ...c,
                    lastMessage: message.content,
                    lastMessageAt: message.createdAt,
                };
            }
            return c;
        });
        localStorage.setItem("conversations", JSON.stringify(updatedConversations));
        loadConversations();

        loadConversationMessages(selectedConversation.id);
        setReplyContent("");
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} mins`;
        if (diffHours < 24) return `${diffHours} hours`;
        return `${diffDays} days`;
    };

    const getInitials = (name?: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const listingsPagination = usePagination({ data: myListings, itemsPerPage: 6 });
    const [allListingsForFavs, setAllListingsForFavs] = useState<VehicleListing[]>([]);
    
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("listings") || "[]");
        setAllListingsForFavs(stored);
    }, []);

    const favoriteListings = allListingsForFavs.filter((l: VehicleListing) =>
        favorites.includes(l.id) && l.status === "approved"
    );
    const favoritesPagination = usePagination({ data: favoriteListings, itemsPerPage: 6 });
    const messagesPagination = usePagination({ data: conversations, itemsPerPage: 10 });

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
                {/* Profile Header */}
                <Card className="mb-6 sm:mb-8 border-none bg-gradient-to-br from-primary/5 via-primary/2 to-background shadow-xl">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="relative group cursor-pointer" onClick={() => router.push("/edit-profile")}>
                                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-primary/20 ring-offset-4 ring-offset-background transition-all group-hover:ring-primary/40 shadow-2xl">
                                    <AvatarImage src={currentUser?.avatar} />
                                    <AvatarFallback className="text-3xl sm:text-4xl bg-primary text-primary-foreground font-bold">
                                        {getInitials(currentUser.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                                    <Edit className="text-white w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex-1 text-center sm:text-left space-y-3">
                                <div>
                                    <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{currentUser.name}</h1>
                                        {currentUser.verified && (
                                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20 px-3 py-1 font-bold animate-pulse">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Verified Pro
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground font-medium flex items-center justify-center sm:justify-start gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        {currentUser.email}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 pt-2">
                                    <div className="flex flex-col items-center sm:items-start">
                                        <span className="text-2xl font-bold text-foreground">{myListings.length}</span>
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.dash_myAds}</span>
                                    </div>
                                    <Separator orientation="vertical" className="h-10 hidden sm:block" />
                                    <div className="flex flex-col items-center sm:items-start">
                                        <span className="text-2xl font-bold text-foreground">{favorites.length}</span>
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.dash_favs}</span>
                                    </div>
                                    <Separator orientation="vertical" className="h-10 hidden sm:block" />
                                    <div className="flex flex-col items-center sm:items-start">
                                        <span className="text-2xl font-bold text-foreground">{conversations.length}</span>
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.dash_msgs}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-4">
                                    <Button variant="default" className="gap-2 shadow-lg" onClick={() => router.push("/post-ad")}>
                                        <Package className="w-4 h-4" />
                                        {t.dash_postAd}
                                    </Button>
                                    <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5" onClick={() => router.push("/edit-profile")}>
                                        <Settings className="w-4 h-4" />
                                        {t.dash_settings}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Dashboard Tabs */}
                <Tabs defaultValue="my-ads" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-muted/50 rounded-xl mb-8">
                        <TabsTrigger value="my-ads" className="py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all sm:gap-2">
                            <Package className="w-4 h-4" />
                            <span className="hidden sm:inline font-bold">{t.dash_myAds}</span>
                            <span className="sm:hidden font-bold">Ads</span>
                        </TabsTrigger>
                        <TabsTrigger value="favorites" className="py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all sm:gap-2">
                            <Heart className="w-4 h-4" />
                            <span className="hidden sm:inline font-bold">{t.dash_favs}</span>
                            <span className="sm:hidden font-bold">Saved</span>
                        </TabsTrigger>
                        <TabsTrigger value="messages" className="py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all sm:gap-2">
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden sm:inline font-bold">{t.dash_msgs}</span>
                            <span className="sm:hidden font-bold">Msgs</span>
                        </TabsTrigger>
                        <TabsTrigger value="stats" className="py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all sm:gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span className="hidden sm:inline font-bold">Statistics</span>
                            <span className="sm:hidden font-bold">Stats</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* My Ads Tab */}
                    <TabsContent value="my-ads" className="mt-0">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-extrabold tracking-tight">{t.dash_myAds}</h2>
                                <p className="text-muted-foreground font-medium">Manage and track your active listings</p>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder="Search your ads..." className="pl-10 h-10 bg-muted/30 border-none" />
                            </div>
                        </div>

                        {myListings.length === 0 ? (
                            <Card className="border-dashed py-20 flex flex-col items-center justify-center text-center bg-muted/5">
                                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                                    <Package className="w-10 h-10 text-primary/40" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{t.dash_noAds}</h3>
                                <p className="text-muted-foreground max-w-xs mx-auto mb-8 font-medium">
                                    Ready to sell? Post your first advertisement and reach thousands of buyers.
                                </p>
                                <Button size="lg" onClick={() => router.push("/post-ad")} className="px-10 h-12 rounded-full font-bold shadow-xl shadow-primary/20">
                                    {t.dash_postAd}
                                </Button>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {listingsPagination.paginatedData.map((listing) => (
                                    <Card key={listing.id} className="overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all border-muted/50">
                                        <div className="flex flex-col sm:flex-row h-full">
                                            <div className="relative w-full sm:w-72 h-56 sm:h-auto overflow-hidden">
                                                <img
                                                    src={listing.images?.[0] || "/placeholder.svg"}
                                                    alt={listing.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                                <div className="absolute top-3 left-3">
                                                    {getStatusBadge(listing.status)}
                                                </div>
                                            </div>
                                            <CardContent className="flex-1 p-6 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start gap-4 mb-3">
                                                        <div>
                                                            <h3 className="text-xl font-extrabold tracking-tight group-hover:text-primary transition-colors line-clamp-1 mb-1">
                                                                {listing.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                                                                <MapPin className="w-3.5 h-3.5" />
                                                                {listing.location.town}, {listing.location.district}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-black text-primary tracking-tighter">
                                                                {formatCurrency(listing.price)}
                                                            </p>
                                                            {listing.negotiable && <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t.listing_negotiable}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 pt-2">
                                                        <div className="flex items-center gap-1.5 text-xs font-bold bg-muted/50 px-3 py-1.5 rounded-full border border-muted-foreground/10">
                                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                                            {listing.year}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs font-bold bg-muted/50 px-3 py-1.5 rounded-full border border-muted-foreground/10">
                                                            <Gauge className="w-3.5 h-3.5 text-primary" />
                                                            {listing.mileage.toLocaleString()} km
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs font-bold bg-muted/50 px-3 py-1.5 rounded-full border border-muted-foreground/10">
                                                            <Fuel className="w-3.5 h-3.5 text-primary" />
                                                            {listing.fuelType}
                                                        </div>
                                                    </div>
                                                    {listing.status === "rejected" && listing.rejectionReason && (
                                                        <Alert variant="destructive" className="mt-4 bg-destructive/5 border-destructive/20">
                                                            <AlertCircle className="h-4 w-4" />
                                                            <AlertTitle className="text-xs font-black uppercase tracking-wider">Rejection Reason</AlertTitle>
                                                            <AlertDescription className="text-sm font-medium">
                                                                {listing.rejectionReason}
                                                            </AlertDescription>
                                                        </Alert>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-muted/50">
                                                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                                        <div className="flex items-center gap-1.5">
                                                            <Eye className="w-4 h-4" />
                                                            <span>{listing.views || 0} {t.dash_views}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{formatTime(listing.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg font-bold border-muted-foreground/20" onClick={() => router.push(`/listing/${listing.id}`)}>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg font-bold border-muted-foreground/20 hover:bg-primary/5 hover:text-primary hover:border-primary/20" onClick={() => router.push(`/post-ad?edit=${listing.id}`)}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg font-bold text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteListing(listing.id)}>
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </Card>
                                ))}
                                {listingsPagination.totalPages > 1 && (
                                    <div className="pt-8">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious 
                                                        onClick={listingsPagination.previousPage} 
                                                        className={cn("cursor-pointer", !listingsPagination.canGoPrevious && "pointer-events-none opacity-50")}
                                                    />
                                                </PaginationItem>
                                                {Array.from({ length: listingsPagination.totalPages }, (_, i) => i + 1).map((page) => (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink 
                                                            onClick={() => listingsPagination.goToPage(page)} 
                                                            isActive={listingsPagination.currentPage === page}
                                                            className="cursor-pointer"
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}
                                                <PaginationItem>
                                                    <PaginationNext 
                                                        onClick={listingsPagination.nextPage} 
                                                        className={cn("cursor-pointer", !listingsPagination.canGoNext && "pointer-events-none opacity-50")}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </div>
                        )}
                    </TabsContent>

                    {/* Favorites Tab */}
                    <TabsContent value="favorites" className="mt-0">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-extrabold tracking-tight">{t.dash_favs}</h2>
                                <p className="text-muted-foreground font-medium">{favoriteListings.length} {favoriteListings.length === 1 ? "vehicle" : "vehicles"} saved</p>
                            </div>
                            <Button variant="link" className="font-bold text-primary px-0 flex items-center gap-1" onClick={() => router.push("/listings")}>
                                {t.nav_allVehicles}
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>

                        {favoriteListings.length === 0 ? (
                            <Card className="border-dashed py-20 flex flex-col items-center justify-center text-center bg-muted/5">
                                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                                    <Heart className="w-10 h-10 text-primary/40" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{t.dash_noFavs}</h3>
                                <p className="text-muted-foreground max-w-xs mx-auto mb-8 font-medium">
                                    Found something you like? Click the heart icon to save it here for later.
                                </p>
                                <Button size="lg" onClick={() => router.push("/listings")} className="px-10 h-12 rounded-full font-bold border-primary shadow-lg shadow-primary/10">
                                    Explore Vehicles
                                </Button>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {favoritesPagination.paginatedData.map((listing) => (
                                    <Card key={listing.id} className="overflow-hidden group hover:shadow-xl transition-all border-muted/50 cursor-pointer h-full flex flex-col" onClick={() => router.push(`/listing/${listing.id}`)}>
                                        <div className="relative h-56 overflow-hidden">
                                            <img
                                                src={listing.images[0] || "/placeholder.svg"}
                                                alt={listing.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-primary/90 backdrop-blur-md border-none font-bold shadow-lg">
                                                    {listing.vehicleType}
                                                </Badge>
                                            </div>
                                            <div className="absolute bottom-3 right-3">
                                                <div className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-red-500 shadow-xl">
                                                    <Heart className="w-5 h-5 fill-current" />
                                                </div>
                                            </div>
                                        </div>
                                        <CardContent className="p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-extrabold text-lg line-clamp-1 group-hover:text-primary transition-colors mb-2">{listing.title}</h3>
                                                <p className="text-2xl font-black text-primary tracking-tighter mb-4">{formatPrice(listing.price)}</p>
                                                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{listing.year}</span>
                                                    <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5" />{listing.mileage.toLocaleString()} km</span>
                                                </div>
                                            </div>
                                            <div className="mt-5 pt-4 border-t border-muted/50 flex items-center justify-between">
                                                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" /> {listing.location.district}
                                                </span>
                                                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Messages Tab */}
                    <TabsContent value="messages" className="mt-0 h-[700px]">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                            <Card className="lg:col-span-1 overflow-hidden flex flex-col border-muted/50 bg-muted/5 shadow-xl">
                                <CardHeader className="p-6 border-b border-muted bg-background/50 backdrop-blur-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <CardTitle className="text-2xl font-black tracking-tight">{t.dash_msgs}</CardTitle>
                                        <Badge variant="secondary" className="font-bold">{conversations.length} total</Badge>
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder="Search messages..." className="pl-10 h-10 bg-background/50 border-none shadow-sm" />
                                    </div>
                                </CardHeader>
                                <ScrollArea className="flex-1 overflow-y-auto">
                                    {conversations.length === 0 ? (
                                        <div className="p-12 text-center text-muted-foreground">
                                            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                            <p className="font-bold">{t.dash_noMsgs}</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-muted/50">
                                            {conversations.map((conversation) => {
                                                const otherParticipant = conversation.participants.find(p => p.userId !== currentUser?.id);
                                                const isSelected = selectedConversation?.id === conversation.id;
                                                return (
                                                    <div
                                                        key={conversation.id}
                                                        className={cn(
                                                            "p-5 cursor-pointer transition-all hover:bg-primary/5 group relative",
                                                            isSelected ? "bg-primary/10 border-l-4 border-l-primary" : ""
                                                        )}
                                                        onClick={() => handleOpenConversation(conversation)}
                                                    >
                                                        <div className="flex gap-4">
                                                            <Avatar className="w-12 h-12 shadow-md">
                                                                <AvatarFallback className="font-bold bg-muted text-muted-foreground">
                                                                    {getInitials(otherParticipant?.userName || "U")}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <h4 className="font-black text-sm truncate pr-2">{otherParticipant?.userName}</h4>
                                                                    <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                                                                        {formatTime(conversation.lastMessageAt || conversation.createdAt)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[11px] font-black uppercase text-primary tracking-widest mb-1 truncate">
                                                                    {conversation.vehicleTitle}
                                                                </p>
                                                                <p className={cn(
                                                                    "text-sm line-clamp-1",
                                                                    conversation.unreadCount > 0 ? "font-black text-foreground" : "text-muted-foreground font-medium"
                                                                )}>
                                                                    {conversation.lastMessage || "No messages yet"}
                                                                </p>
                                                            </div>
                                                            {conversation.unreadCount > 0 && (
                                                                <div className="absolute right-5 bottom-5 w-2.5 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/30" />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </ScrollArea>
                            </Card>

                            <Card className="lg:col-span-2 overflow-hidden flex flex-col border-muted/50 shadow-2xl bg-gradient-to-b from-background to-muted/10">
                                {selectedConversation ? (
                                    <>
                                        <div className="p-4 sm:p-6 border-b border-muted bg-background/50 backdrop-blur-xl flex flex-row items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="w-12 h-12 shadow-lg ring-2 ring-primary/10">
                                                    <AvatarFallback className="font-bold">
                                                        {getInitials(selectedConversation.participants.find(p => p.userId !== currentUser.id)?.userName || "U")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-black text-lg tracking-tight">
                                                        {selectedConversation.participants.find(p => p.userId !== currentUser.id)?.userName}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Online</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {conversationVehicle && (
                                                <div 
                                                    className="hidden sm:flex items-center gap-3 bg-muted/40 p-2 rounded-xl cursor-pointer hover:bg-muted/60 transition-all border border-muted/50"
                                                    onClick={() => router.push(`/listing/${conversationVehicle.id}`)}
                                                >
                                                    <img src={conversationVehicle.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shadow-md" />
                                                    <div className="pr-2">
                                                        <p className="text-[10px] font-black uppercase text-primary tracking-widest">{conversationVehicle.vehicleType}</p>
                                                        <p className="text-xs font-extrabold max-w-[150px] truncate">{conversationVehicle.title}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <ScrollArea className="flex-1 p-6">
                                            <div className="space-y-6">
                                                {conversationMessages.map((msg, idx) => {
                                                    const isMe = msg.senderId === currentUser.id;
                                                    return (
                                                        <div
                                                            key={msg.id}
                                                            className={cn(
                                                                "flex flex-col group max-w-[85%] sm:max-w-[70%]",
                                                                isMe ? "ml-auto items-end" : "mr-auto items-start"
                                                            )}
                                                        >
                                                            <div
                                                                className={cn(
                                                                    "px-5 py-3 rounded-2xl shadow-sm relative overflow-hidden",
                                                                    isMe
                                                                        ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/20"
                                                                        : "bg-background rounded-tl-none border border-muted/50"
                                                                )}
                                                            >
                                                                <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                                {isMe && msg.read && <span className="text-[10px] font-black text-primary tracking-tighter uppercase">Read</span>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </ScrollArea>
                                        <CardFooter className="p-4 sm:p-6 border-t border-muted bg-background/50 backdrop-blur-xl flex flex-col gap-4">
                                            <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                                                <div className="flex -space-x-2">
                                                    <Avatar className="w-6 h-6 border-2 border-background ring-2 ring-primary/20 ring-offset-2">
                                                        <AvatarImage src={currentUser?.avatar} />
                                                        <AvatarFallback />
                                                    </Avatar>
                                                </div>
                                                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary/80 italic">
                                                    Quick tools and automated replies are active.
                                                </p>
                                            </div>
                                            <div className="flex w-full gap-3 items-end">
                                                <div className="flex-1 relative">
                                                    <Textarea
                                                        placeholder="Write your message..."
                                                        className="min-h-[100px] bg-muted/20 border-none rounded-2xl p-4 focus-visible:ring-primary/20 text-sm font-medium resize-none shadow-inner"
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault();
                                                                handleSendReply();
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <Button
                                                    size="icon"
                                                    className="h-14 w-14 rounded-2xl shadow-xl shadow-primary/20 flex-shrink-0"
                                                    onClick={handleSendReply}
                                                    disabled={!replyContent.trim()}
                                                >
                                                    <MessageCircle className="w-6 h-6" />
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-muted/5">
                                        <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                                            <MessageCircle className="w-12 h-12 text-primary/30" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Your Conversations</h3>
                                        <p className="text-muted-foreground font-medium max-w-[250px] mx-auto">
                                            Select a chat to view messages from potential buyers or sellers.
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Statistics Tab placeholder */}
                    <TabsContent value="stats" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "Total Views", value: "12,450", icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12%" },
                                { title: "Active Conversations", value: conversations.length.toString(), icon: MessageCircle, color: "text-green-500", bg: "bg-green-500/10", trend: "+5%" },
                                { title: "Favorite Counts", value: "842", icon: Heart, color: "text-red-500", bg: "bg-red-500/10", trend: "+18%" },
                                { title: "Listing Performance", value: "High", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10", trend: "Steady" }
                            ].map((stat, i) => (
                                <Card key={i} className="border-none shadow-xl bg-gradient-to-br from-background to-muted/30">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
                                        <div className={cn("p-2 rounded-xl", stat.bg)}>
                                            <stat.icon className={cn("w-4 h-4", stat.color)} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-black tracking-tighter mb-1">{stat.value}</div>
                                        <p className="text-xs font-bold text-green-500 flex items-center gap-1">
                                            <ArrowUpRight className="w-3 h-3" />
                                            {stat.trend} from last month
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        
                        <Card className="mt-8 border-none shadow-2xl bg-muted/5 border-dashed">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold tracking-tight">Listing Insights</CardTitle>
                                <CardDescription className="text-sm font-medium">Detailed analytics are coming soon to your dashboard.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-64 flex items-center justify-center">
                                <TrendingUp className="w-24 h-24 text-primary/10 animate-pulse" />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="max-w-[400px] rounded-3xl border-none shadow-2xl">
                    <DialogHeader>
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-destructive" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-center tracking-tight">{t.dash_deleteConfirmTitle}</DialogTitle>
                        <DialogDescription className="text-center font-medium leading-relaxed">
                            {t.dash_deleteConfirmDesc}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="delete-reason" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">{t.dash_deleteReason}</Label>
                            <Textarea
                                id="delete-reason"
                                placeholder="..."
                                className="min-h-[100px] bg-muted/30 border-none rounded-2xl resize-none font-medium"
                                value={deleteReason}
                                onChange={(e) => setDeleteReason(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-col gap-3">
                        <Button variant="destructive" size="lg" onClick={confirmDeleteListing} className="w-full h-12 rounded-2xl font-black tracking-tighter shadow-xl shadow-destructive/20 uppercase">
                            {t.dash_deleteBtn}
                        </Button>
                        <Button variant="ghost" size="lg" onClick={() => setDeleteDialogOpen(false)} className="w-full h-12 rounded-2xl font-bold text-muted-foreground hover:bg-muted font-black border-transparent">
                            {t.profile_cancel}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default Dashboard;
