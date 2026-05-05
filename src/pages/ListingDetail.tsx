"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LeaseCalculator from "@/components/LeaseCalculator";
import {
  Heart,
  Share2,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Car,
  ChevronLeft,
  ChevronRight,
  Video,
  Clock,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VehicleListing, Message, Conversation } from "@/types";
import { trackVehicleView, trackPageView } from "@/lib/analytics";
import LeaseApplicationDialog from "@/components/LeaseApplicationDialog";
import ChatWithOwner from "@/components/chat/ChatWithOwner";
import { useLanguage } from "@/contexts/LanguageContext";

const ListingDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  const { t } = useLanguage();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<VehicleListing | null>(null);
  const [similarVehicles, setSimilarVehicles] = useState<VehicleListing[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [leaseDialogOpen, setLeaseDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentImageIndex(0);
    setShowVideo(false);
    setShowFullNumber(false);

    const storedListings = localStorage.getItem("listings");
    const userStr = localStorage.getItem("currentUser");
    const user = userStr ? JSON.parse(userStr) : null;
    setCurrentUser(user);

    if (storedListings && id) {
      const allListings: VehicleListing[] = JSON.parse(storedListings);
      const foundVehicle = allListings.find((v) => v.id === id);

      if (foundVehicle) {
        // Only allow viewing approved ads, or ads owned by the current user
        const isOwner = user && foundVehicle.userId === user.id;
        const isAdmin = user && (
          user.email === "admin@tradehub.lk" ||
          user.role === "super-admin" ||
          user.role === "admin" ||
          user.role === "branch-manager" ||
          user.role === "ad-manager" ||
          user.isAdmin === true
        );

        if (foundVehicle.status !== "approved" && !isOwner && !isAdmin) {
          toast({
            title: "Ad Not Available",
            description: "This advertisement is not available for viewing.",
            variant: "destructive",
          });
          router.push("/listings");
          return;
        }

        setVehicle(foundVehicle);

        // Increment views in localStorage
        const updatedListings = allListings.map(v => 
          v.id === id ? { ...v, views: (v.views || 0) + 1 } : v
        );
        localStorage.setItem("listings", JSON.stringify(updatedListings));

        // Track vehicle view
        trackVehicleView(
          foundVehicle.id,
          foundVehicle.title,
          foundVehicle.location
        );

        // Track page view
        trackPageView(`/listing/${id}`);

        // Find similar vehicles (same type or make) - only approved ones
        const similar = allListings
          .filter(
            (v) =>
              v.id !== id &&
              v.status === "approved" &&
              (v.vehicleType === foundVehicle.vehicleType || v.make === foundVehicle.make)
          )
          .slice(0, 4);
        setSimilarVehicles(similar);
        setIsLoading(false);
      } else {
        // Vehicle not found in listings
        setIsLoading(false);
      }
    } else if (storedListings) {
      // If we have listings but no vehicle found after parsing
      setIsLoading(false);
    }
  }, [id, router, toast]);

  useEffect(() => {
    if (vehicle) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favorites.includes(vehicle.id));
    }
  }, [vehicle]);

  const handleFavorite = () => {
    if (!vehicle) return;
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((fid: string) => fid !== vehicle.id);
      toast({
        title: "Removed from favorites",
        description: "Vehicle removed from your favorites list",
      });
    } else {
      newFavorites = [...favorites, vehicle.id];
      toast({
        title: "Added to favorites",
        description: "Vehicle added to your favorites list",
      });
    }

    setIsFavorite(!isFavorite);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vehicle?.title,
        text: vehicle?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Vehicle link copied to clipboard",
      });
    }
  };

  const calculateTimeAgo = (dateStr: string) => {
    const postDate = new Date(dateStr);
    const now = new Date();
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSecs < 60) return "Just now";
    if (diffInMins < 60) return `${diffInMins} mins`;
    if (diffInHours < 24) return `${diffInHours} hours`;
    return `${diffInDays} days`;
  };

  const handleContact = (method: string) => {
    if (vehicle?.contactNumber) {
      if (method === "WhatsApp") {
        window.open(`https://wa.me/94${vehicle.contactNumber.replace(/^0/, "")}`, "_blank");
      } else if (method === "Phone") {
        window.open(`tel:${vehicle.contactNumber}`, "_blank");
      }
    }
    toast({
      title: "Contact Seller",
      description: `Opening ${method}...`,
    });
  };

  const handleChatWithOwner = () => {
    if (!vehicle) return;

    setMessageDialogOpen(true);
  };

  const handleSendMessage = () => {
    if (!vehicle || !currentUser || !messageContent.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    // Get or create conversation
    const conversations: Conversation[] = JSON.parse(localStorage.getItem("conversations") || "[]");
    const messages: Message[] = JSON.parse(localStorage.getItem("messages") || "[]");

    // Find existing conversation or create new one
    let conversation = conversations.find(
      (c) =>
        c.vehicleId === vehicle.id &&
        c.participants.some((p) => p.userId === currentUser.id) &&
        c.participants.some((p) => p.userId === vehicle.userId)
    );

    if (!conversation) {
      conversation = {
        id: crypto.randomUUID(),
        participants: [
          {
            userId: currentUser.id,
            userName: currentUser.name,
            userEmail: currentUser.email,
          },
          {
            userId: vehicle.userId,
            userName: vehicle.userName,
            userEmail: vehicle.userEmail,
          },
        ],
        vehicleId: vehicle.id,
        vehicleTitle: vehicle.title,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
      };
      conversations.push(conversation);
    }

    // Create message
    const message: Message = {
      id: crypto.randomUUID(),
      conversationId: conversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderEmail: currentUser.email,
      receiverId: vehicle.userId,
      receiverName: vehicle.userName,
      receiverEmail: vehicle.userEmail,
      vehicleId: vehicle.id,
      vehicleTitle: vehicle.title,
      content: messageContent.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    messages.push(message);

    // Update conversation
    conversation.lastMessage = message.content;
    conversation.lastMessageAt = message.createdAt;
    conversation.unreadCount = conversation.participants.find((p) => p.userId === vehicle.userId) ? 1 : 0;

    // Save to localStorage
    localStorage.setItem("conversations", JSON.stringify(conversations));
    localStorage.setItem("messages", JSON.stringify(messages));

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the seller",
    });

    setMessageContent("");
    setMessageDialogOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const nextImage = () => {
    if (vehicle) {
      setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
    }
  };

  const prevImage = () => {
    if (vehicle) {
      setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading vehicle details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Vehicle not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Breadcrumb */}
        <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/listings" className="hover:text-foreground">
            Vehicles
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{vehicle.make} {vehicle.model}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative h-64 sm:h-80 md:h-96 bg-black group">
                {showVideo && vehicle.video ? (
                  <video
                    src={vehicle.video}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                    poster={vehicle.images[0]}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={vehicle.images[currentImageIndex]}
                    alt={vehicle.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Navigation Arrows */}
                {!showVideo && vehicle.images.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-background/90 hover:bg-background shadow-lg"
                    onClick={handleFavorite}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-background/90 hover:bg-background shadow-lg"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {vehicle.featured && (
                    <Badge className="bg-yellow-500">Featured</Badge>
                  )}
                  {vehicle.condition === "Brand New" && (
                    <Badge className="bg-green-500">Brand New</Badge>
                  )}
                  {vehicle.leasingAvailable && (
                    <Badge className="bg-blue-500">Leasing Available</Badge>
                  )}
                </div>

                {/* Image Counter & Time Ago Badge */}
                <div className="absolute bottom-4 left-4 flex gap-2 z-10">
                  <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">
                      {calculateTimeAgo(vehicle.createdAt)}
                    </span>
                  </div>
                </div>

                {!showVideo && vehicle.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-xl z-10 border border-white/20">
                    <span className="text-sm font-black tracking-tighter">
                      {currentImageIndex + 1} / {vehicle.images.length}
                    </span>
                  </div>
                )}

                {/* Video Play Overlay */}
                {!showVideo && vehicle.video && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors z-20 group/play"
                  >
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl group-hover/play:scale-110 transition-transform">
                      <Video className="w-8 h-8 text-white fill-white" />
                    </div>
                  </button>
                )}
              </div>

              {/* Thumbnail Strip */}
              <div className="p-4 border-t">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {/* Video Thumbnail */}
                  {vehicle.video && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden relative ${showVideo ? "border-primary" : "border-border"}`}
                    >
                      <img src={vehicle.images[0]} alt="Video Thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 right-1 bg-primary px-1 rounded text-[10px] text-white font-bold">VIDEO</div>
                    </button>
                  )}

                  {/* Image Thumbnails */}
                  {vehicle.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setShowVideo(false);
                        setCurrentImageIndex(idx);
                      }}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${!showVideo && idx === currentImageIndex ? "border-primary" : "border-border"}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Details */}
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-4 flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                      {vehicle.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{vehicle.location.town}, {vehicle.location.district}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{t.listing_posted} {calculateTimeAgo(vehicle.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>{t.listing_expires} {new Date(new Date(vehicle.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full">
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        <span>{vehicle.views ? (vehicle.views + 1).toLocaleString() : '1'} {t.listing_views}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left md:text-right shrink-0">
                    <p className="text-3xl font-black text-primary tracking-tight">
                      {formatCurrency(vehicle.price)}
                    </p>
                    {vehicle.negotiable && (
                      <p className="text-xs text-muted-foreground mt-1 font-medium">{t.listing_negotiable}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.postAd_year}</p>
                  <p className="text-sm sm:text-base font-semibold">{vehicle.year}</p>
                </div>
                <div className="text-center">
                  <Gauge className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.postAd_mileageKm}</p>
                  <p className="text-sm sm:text-base font-semibold">{vehicle.mileage.toLocaleString()} km</p>
                </div>
                <div className="text-center">
                  <Fuel className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.postAd_fuelType}</p>
                  <p className="text-sm sm:text-base font-semibold">{vehicle.fuelType}</p>
                </div>
                <div className="text-center">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.postAd_transmission}</p>
                  <p className="text-sm sm:text-base font-semibold">{vehicle.transmission}</p>
                </div>
              </div>

              {/* Full Specs */}
              <div className="border-t pt-3 sm:pt-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{t.listing_specs}</h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t.postAd_makeBrand}</p>
                    <p className="font-semibold">{vehicle.make}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.postAd_model}</p>
                    <p className="font-semibold">{vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.postAd_vehicleType}</p>
                    <p className="font-semibold">{vehicle.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.postAd_condition}</p>
                    <Badge variant="secondary">{vehicle.condition}</Badge>
                  </div>
                  {vehicle.engineCapacity && (
                    <div>
                      <p className="text-sm text-muted-foreground">Engine Capacity</p>
                      <p className="font-semibold">{vehicle.engineCapacity}</p>
                    </div>
                  )}
                  {vehicle.color && (
                    <div>
                      <p className="text-sm text-muted-foreground">Color</p>
                      <p className="font-semibold">{vehicle.color}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Preview */}
              {vehicle.video && (
                <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-5 h-5 text-primary" />
                    <h2 className="text-lg sm:text-xl font-semibold">{t.listing_videoPreview}</h2>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-black shadow-inner border border-border">
                    <video
                      src={vehicle.video}
                      controls
                      className="w-full h-full object-contain"
                      poster={vehicle.images[0]}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{t.listing_description}</h2>
                <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap">
                  {vehicle.description}
                </p>
              </div>
            </Card>

            {/* Leasing Calculator */}
            {vehicle.leasingAvailable && (
              <div>
                <LeaseCalculator vehiclePrice={vehicle.price} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Contact Card */}
            <Card className="p-4 sm:p-6 lg:sticky lg:top-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t.listing_contactSeller}</h3>

              <div className="space-y-3">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 shadow-md"
                  size="lg"
                  onClick={handleChatWithOwner}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t.listing_chatOwner}
                </Button>

                <Button
                  className="w-full"
                  variant="outline"
                  size="lg"
                  onClick={() => handleContact("WhatsApp")}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t.listing_chatWhatsApp}
                </Button>

                <Button
                  className="w-full"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    if (!showFullNumber) {
                      setShowFullNumber(true);
                    } else {
                      handleContact("Phone");
                    }
                  }}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {showFullNumber ? (
                    <span>{vehicle.contactNumber}</span>
                  ) : (
                    <span>
                      {vehicle.contactNumber.substring(0, 3)}****{vehicle.contactNumber.substring(7, 10)}
                      <span className="ml-2 text-xs opacity-70">(Click to reveal)</span>
                    </span>
                  )}
                </Button>

                {vehicle.leasingAvailable && (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                    onClick={() => setLeaseDialogOpen(true)}
                    disabled={currentUser && (
                      currentUser.email === "admin@tradehub.lk" ||
                      currentUser.role === "super-admin" ||
                      currentUser.role === "admin" ||
                      currentUser.role === "branch-manager" ||
                      currentUser.role === "ad-manager" ||
                      currentUser.isAdmin === true
                    )}
                    title={currentUser && (
                      currentUser.email === "admin@tradehub.lk" ||
                      currentUser.role === "super-admin" ||
                      currentUser.role === "admin" ||
                      currentUser.role === "branch-manager" ||
                      currentUser.role === "ad-manager" ||
                      currentUser.isAdmin === true
                    ) ? "Admins cannot apply for leasing" : ""}
                  >
                    <Car className="w-5 h-5 mr-2" />
                    {t.listing_applyLeasing}
                  </Button>
                )}
              </div>

              <div className="border-t mt-4 sm:mt-6 pt-4 sm:pt-6">
                <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">{t.listing_sellerInfo}</h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <p>
                    <span className="text-muted-foreground">{t.listing_name}:</span>{" "}
                    <span className="font-medium">{vehicle.userName}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">{t.listing_location}:</span>{" "}
                    <span className="font-medium">
                      {vehicle.location.town}, {vehicle.location.district}
                    </span>
                  </p>
                </div>
              </div>

              <div className="border-t mt-4 sm:mt-6 pt-4 sm:pt-6">
                <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">{t.listing_safetyTips}</h4>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1.5 sm:space-y-2">
                  <li>• {t.listing_tip1}</li>
                  <li>• {t.listing_tip2}</li>
                  <li>• {t.listing_tip3}</li>
                  <li>• {t.listing_tip4}</li>
                  <li>• {t.listing_tip5}</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* Similar Vehicles */}
        {similarVehicles.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t.listing_similarVehicles}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {similarVehicles.map((v) => (
                <Link key={v.id} href={`/listing/${v.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                    <div className="h-40 bg-muted">
                      <img src={v.images[0]} alt={v.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-2">{v.title}</h3>
                      <p className="text-primary font-bold">{formatCurrency(v.price)}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {v.year} • {v.mileage.toLocaleString()} km
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {vehicle && (
        <ChatWithOwner
          isOpen={messageDialogOpen}
          onClose={() => setMessageDialogOpen(false)}
          vehicle={vehicle}
        />
      )}

      <LeaseApplicationDialog
        isOpen={leaseDialogOpen}
        onClose={() => setLeaseDialogOpen(false)}
        vehicleId={vehicle?.id || ""}
        vehicleTitle={vehicle?.title || ""}
      />

      <Footer />
    </div>
  );
};

export default ListingDetail;
