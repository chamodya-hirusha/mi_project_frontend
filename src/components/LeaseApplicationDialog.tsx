"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, FileText, MapPin, Loader2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Branch } from "@/types";
import { getUserLocation, calculateDistance } from "@/lib/locationUtils";
import { demoBranches } from "@/data/demoBranches";

interface LeaseApplicationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleId: string;
    vehicleTitle: string;
}

const LeaseApplicationDialog = ({ isOpen, onClose, vehicleId, vehicleTitle }: LeaseApplicationDialogProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const [selectedOption, setSelectedOption] = useState<"contact" | "form" | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [nearestBranch, setNearestBranch] = useState<Branch | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [callRequestSent, setCallRequestSent] = useState(false);

    // Load branches from localStorage
    const loadBranches = (): Branch[] => {
        try {
            const branches = localStorage.getItem("branches");
            if (branches) {
                const parsed = JSON.parse(branches);
                // Filter only active branches
                return parsed.filter((b: Branch) => b.status === "active");
            }
            // Fallback to demo branches if no branches in localStorage
            return demoBranches.filter((b: Branch) => b.status === "active");
        } catch {
            // If parsing fails, use demo branches as fallback
            return demoBranches.filter((b: Branch) => b.status === "active");
        }
    };

    // Find nearest branch based on user location
    const findNearestBranch = async () => {
        setIsLoadingLocation(true);
        try {
            // Get user's current location
            const coords = await getUserLocation();
            setUserLocation(coords);

            // Load all active branches
            const branches = loadBranches();

            if (branches.length === 0) {
                toast({
                    title: "No branches available",
                    description: "No active branches found. Please contact support.",
                    variant: "destructive",
                });
                setIsLoadingLocation(false);
                return;
            }

            // Find branch with coordinates
            let nearest: Branch | null = null;
            let minDistance = Infinity;

            for (const branch of branches) {
                if (branch.location.coordinates) {
                    const distance = calculateDistance(coords, branch.location.coordinates);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearest = branch;
                    }
                }
            }

            // If no branch has coordinates, use first active branch as fallback
            if (!nearest && branches.length > 0) {
                nearest = branches[0];
                toast({
                    title: "Location-based matching unavailable",
                    description: "Showing first available branch. Branch coordinates may not be set.",
                });
            }

            setNearestBranch(nearest);
        } catch (error: any) {
            console.error("Error getting location:", error);
            toast({
                title: "Location access denied",
                description: error.message || "Unable to get your location. Please enable location permissions or use the form option.",
                variant: "destructive",
            });

            // Fallback: use first active branch
            const branches = loadBranches().filter(b => b.status === "active");
            if (branches.length > 0) {
                setNearestBranch(branches[0]);
                toast({
                    title: "Using default branch",
                    description: "Showing first available branch.",
                });
            }
        } finally {
            setIsLoadingLocation(false);
        }
    };

    // Handle contact lease officer option
    const handleContactOfficer = async () => {
        setSelectedOption("contact");
        await findNearestBranch();
    };

    // Handle fill lease form option
    const handleFillForm = () => {
        setSelectedOption("form");
        onClose();
        router.push(`/lease-application/${vehicleId}`);
    };

    // Send call request
    const handleCallRequest = () => {
        if (!nearestBranch) return;

        // Store call request in localStorage (for admin to see)
        const callRequests = JSON.parse(localStorage.getItem("lease_call_requests") || "[]");
        const newRequest = {
            id: `call-request-${Date.now()}`,
            vehicleId,
            vehicleTitle,
            branchId: nearestBranch.id,
            branchName: nearestBranch.name,
            branchPhone: nearestBranch.contactNumber,
            userLocation: userLocation,
            timestamp: new Date().toISOString(),
            status: "pending",
        };
        callRequests.push(newRequest);
        localStorage.setItem("lease_call_requests", JSON.stringify(callRequests));

        setCallRequestSent(true);
        toast({
            title: "Call request sent",
            description: `Your request has been sent to ${nearestBranch.name}. They will contact you soon.`,
        });
    };

    // Reset state when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedOption(null);
            setNearestBranch(null);
            setUserLocation(null);
            setCallRequestSent(false);
            setIsLoadingLocation(false);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Apply for Leasing</DialogTitle>
                    <DialogDescription>
                        Choose how you would like to proceed with your lease application for {vehicleTitle}
                    </DialogDescription>
                </DialogHeader>

                {!selectedOption ? (
                    <div className="space-y-3 mt-4">
                        <Card
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={handleContactOfficer}
                        >
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">Contact Lease Officer</CardTitle>
                                        <CardDescription>
                                            Speak directly with a lease officer at the nearest branch
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={handleFillForm}
                        >
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                        <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">Fill Lease Form</CardTitle>
                                        <CardDescription>
                                            Complete the lease application form online
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                ) : selectedOption === "contact" ? (
                    <div className="space-y-4 mt-4">
                        {isLoadingLocation ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                                <p className="text-sm text-muted-foreground">Finding nearest branch...</p>
                            </div>
                        ) : nearestBranch ? (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            Nearest Branch
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="font-semibold text-lg">{nearestBranch.name}</p>
                                            <p className="text-sm text-muted-foreground">{nearestBranch.address}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">{nearestBranch.contactNumber}</span>
                                            </div>
                                            {nearestBranch.openingHours && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">{nearestBranch.openingHours}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Manager:</span>
                                                <span className="text-sm text-muted-foreground">{nearestBranch.managerName}</span>
                                            </div>
                                        </div>

                                        {userLocation && nearestBranch.location.coordinates && (
                                            <Badge variant="secondary" className="mt-2">
                                                {calculateDistance(userLocation, nearestBranch.location.coordinates).toFixed(1)} km away
                                            </Badge>
                                        )}
                                    </CardContent>
                                </Card>

                                {!callRequestSent ? (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleCallRequest}
                                            className="flex-1"
                                            size="lg"
                                        >
                                            <Phone className="w-4 h-4 mr-2" />
                                            Request Call
                                        </Button>
                                        <Button
                                            onClick={() => window.location.href = `tel:${nearestBranch.contactNumber.replace(/\s/g, '')}`}
                                            variant="outline"
                                            className="flex-1"
                                            size="lg"
                                        >
                                            Call Now
                                        </Button>
                                    </div>
                                ) : (
                                    <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                        <CardContent className="pt-6">
                                            <div className="text-center space-y-2">
                                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                                                    <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                                                </div>
                                                <p className="font-semibold text-green-900 dark:text-green-100">Call Request Sent!</p>
                                                <p className="text-sm text-green-700 dark:text-green-300">
                                                    {nearestBranch.name} will contact you soon at your registered number.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setSelectedOption(null)}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleFillForm}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Or Fill Form Instead
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">Unable to find a branch. Please try the form option.</p>
                                <Button onClick={handleFillForm} className="w-full">
                                    Fill Lease Form
                                </Button>
                            </div>
                        )}
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
};

export default LeaseApplicationDialog;
