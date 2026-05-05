"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import LocationSelector from "@/components/LocationSelector";
import LeaseCalculator from "@/components/LeaseCalculator";
import LeaseRating from "@/components/LeaseRating";
import { VehicleListing, LeaseApplication, Location } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackLeaseApplication } from "@/lib/analytics";

const LeaseApplicationPage = () => {
    const params = useParams();
    const vehicleId = params?.vehicleId as string;
    const router = useRouter();
    const { toast } = useToast();

    const [vehicle, setVehicle] = useState<VehicleListing | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [employmentStatus, setEmploymentStatus] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [location, setLocation] = useState<Location>({
        province: "",
        district: "",
        town: "",
    });

    const [loanDetails, setLoanDetails] = useState({
        downPayment: 0,
        loanAmount: 0,
        monthlyPayment: 0,
        loanDuration: 48,
        interestRate: 12.5,
    });

    useEffect(() => {
        // Check authentication
        const user = localStorage.getItem("currentUser");
        if (!user) {
            toast({
                title: "Authentication required",
                description: "Please sign in to apply for vehicle leasing",
                variant: "destructive",
            });
            router.push("/auth");
            return;
        }
        setCurrentUser(JSON.parse(user));

        // Load vehicle
        const listings = JSON.parse(localStorage.getItem("listings") || "[]");
        const foundVehicle = listings.find((v: VehicleListing) => v.id === vehicleId);

        if (!foundVehicle) {
            toast({
                title: "Vehicle not found",
                description: "The vehicle you're trying to lease doesn't exist",
                variant: "destructive",
            });
            router.push("/listings");
            return;
        }

        if (!foundVehicle.leasingAvailable) {
            toast({
                title: "Leasing not available",
                description: "This vehicle is not available for leasing",
                variant: "destructive",
            });
            router.push(`/listing/${vehicleId}`);
            return;
        }

        setVehicle(foundVehicle);
        setIsLoading(false);
    }, [vehicleId, router, toast]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        // Validation
        if (!location.province || !location.district || !location.town) {
            toast({
                title: "Location required",
                description: "Please select your Province, District, and Town",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        if (!termsAccepted) {
            toast({
                title: "Terms not accepted",
                description: "Please accept the terms and conditions",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        const application: LeaseApplication = {
            id: crypto.randomUUID(),

            // Vehicle Reference
            vehicleId: vehicle!.id,
            vehicleTitle: vehicle!.title,
            vehiclePrice: vehicle!.price,

            // Applicant Personal Info
            applicantId: currentUser.id,
            fullName: formData.get("fullName") as string,
            email: formData.get("email") as string,
            phoneNumber: formData.get("phoneNumber") as string,
            nic: formData.get("nic") as string,
            dateOfBirth: formData.get("dateOfBirth") as string,
            address: formData.get("address") as string,
            location: location,

            // Employment Details
            employmentStatus: employmentStatus as any,
            employerName: formData.get("employerName") as string,
            occupation: formData.get("occupation") as string,
            monthlyIncome: parseFloat(formData.get("monthlyIncome") as string),
            employmentDuration: formData.get("employmentDuration") as string,

            // Loan Details
            downPayment: loanDetails.downPayment,
            loanAmount: loanDetails.loanAmount,
            loanDuration: loanDetails.loanDuration,
            monthlyPayment: loanDetails.monthlyPayment,
            interestRate: loanDetails.interestRate,

            // References
            referenceContact1: formData.get("referenceContact1") as string,
            referenceContact2: formData.get("referenceContact2") as string,

            // Application Status
            status: "pending",
            submittedAt: new Date().toISOString(),

            // Notes
            applicantNotes: formData.get("notes") as string,
        };

        // Save to localStorage
        const applications = JSON.parse(localStorage.getItem("leaseApplications") || "[]");
        applications.unshift(application);
        localStorage.setItem("leaseApplications", JSON.stringify(applications));

        // Track lease application
        trackLeaseApplication({
            id: application.id,
            vehicleId: application.vehicleId,
            vehicleTitle: application.vehicleTitle,
            vehiclePrice: application.vehiclePrice,
            applicantId: application.applicantId,
            applicantName: application.fullName,
            applicantLocation: application.location,
            employmentStatus: application.employmentStatus,
            monthlyIncome: application.monthlyIncome,
            loanAmount: application.loanAmount,
            downPayment: application.downPayment,
            loanDuration: application.loanDuration,
            monthlyPayment: application.monthlyPayment,
            interestRate: application.interestRate,
            status: application.status,
        });

        toast({
            title: "Application Submitted!",
            description: "Your lease application has been submitted successfully. We'll contact you within 2-3 business days.",
        });

        setIsLoading(false);
        router.push("/dashboard");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-32 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">Preparing application...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!vehicle || !currentUser) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-32 text-center">
                    <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
                    <p className="text-muted-foreground">Please wait while we redirect you.</p>
                </div>
                <Footer />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
                <Link href={`/listing/${vehicleId}`} className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4 sm:mb-6 text-sm sm:text-base">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Vehicle Details
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Main Application Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b p-4 sm:p-6">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl sm:text-2xl">Vehicle Lease Application</CardTitle>
                                        <CardDescription className="text-sm sm:text-base">
                                            Apply for financing on {vehicle.title}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                    {/* Personal Information */}
                                    <div className="space-y-3 sm:space-y-4">
                                        <h3 className="text-base sm:text-lg font-semibold border-b pb-2">Personal Information</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName">Full Name *</Label>
                                                <Input
                                                    id="fullName"
                                                    name="fullName"
                                                    defaultValue={currentUser.name}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="nic">NIC Number *</Label>
                                                <Input
                                                    id="nic"
                                                    name="nic"
                                                    placeholder="e.g., 199012345678"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                                <Input
                                                    id="dateOfBirth"
                                                    name="dateOfBirth"
                                                    type="date"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phoneNumber">Phone Number *</Label>
                                                <Input
                                                    id="phoneNumber"
                                                    name="phoneNumber"
                                                    type="tel"
                                                    placeholder="+94 77 123 4567"
                                                    defaultValue={currentUser.phoneNumber}
                                                    required
                                                />
                                            </div>

                                            <div className="md:col-span-2 space-y-2">
                                                <Label htmlFor="email">Email Address *</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    defaultValue={currentUser.email}
                                                    required
                                                />
                                            </div>

                                            <div className="md:col-span-2 space-y-2">
                                                <Label htmlFor="address">Residential Address *</Label>
                                                <Textarea
                                                    id="address"
                                                    name="address"
                                                    placeholder="Enter your complete residential address"
                                                    rows={3}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-3">Location *</h4>
                                            <LocationSelector
                                                value={location}
                                                onChange={setLocation}
                                                required
                                                showLabels={false}
                                            />
                                        </div>
                                    </div>

                                    {/* Employment Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold border-b pb-2">Employment Information</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="employmentStatus">Employment Status *</Label>
                                                <Select value={employmentStatus} onValueChange={setEmploymentStatus} required>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Employed">Employed</SelectItem>
                                                        <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                                                        <SelectItem value="Business Owner">Business Owner</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="occupation">Occupation *</Label>
                                                <Input
                                                    id="occupation"
                                                    name="occupation"
                                                    placeholder="e.g., Software Engineer"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="employerName">Employer Name</Label>
                                                <Input
                                                    id="employerName"
                                                    name="employerName"
                                                    placeholder="Company/Business Name"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="employmentDuration">Employment Duration *</Label>
                                                <Input
                                                    id="employmentDuration"
                                                    name="employmentDuration"
                                                    placeholder="e.g., 3 years"
                                                    required
                                                />
                                            </div>

                                            <div className="md:col-span-2 space-y-2">
                                                <Label htmlFor="monthlyIncome">Monthly Income (LKR) *</Label>
                                                <Input
                                                    id="monthlyIncome"
                                                    name="monthlyIncome"
                                                    type="number"
                                                    placeholder="150000"
                                                    min="0"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* References */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold border-b pb-2">References</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="referenceContact1">Reference Contact 1</Label>
                                                <Input
                                                    id="referenceContact1"
                                                    name="referenceContact1"
                                                    type="tel"
                                                    placeholder="+94 77 XXX XXXX"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="referenceContact2">Reference Contact 2</Label>
                                                <Input
                                                    id="referenceContact2"
                                                    name="referenceContact2"
                                                    type="tel"
                                                    placeholder="+94 77 XXX XXXX"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Notes */}
                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                                        <Textarea
                                            id="notes"
                                            name="notes"
                                            placeholder="Any additional information you'd like to share..."
                                            rows={4}
                                        />
                                    </div>

                                    {/* Terms and Conditions */}
                                    <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                                        <div className="flex items-start space-x-2">
                                            <Checkbox
                                                id="terms"
                                                checked={termsAccepted}
                                                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <Label
                                                    htmlFor="terms"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    I accept the terms and conditions *
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    I confirm that all information provided is accurate and I agree to the
                                                    terms and conditions of TradeHub Leasing.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                                        disabled={isLoading || !termsAccepted}
                                        size="lg"
                                    >
                                        {isLoading ? (
                                            "Submitting Application..."
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                                Submit Lease Application
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Vehicle Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Vehicle Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <img
                                    src={vehicle.images[0]}
                                    alt={vehicle.title}
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                                <h4 className="font-semibold line-clamp-2">{vehicle.title}</h4>
                                <p className="text-2xl font-bold text-primary">
                                    {new Intl.NumberFormat("en-LK", {
                                        style: "currency",
                                        currency: "LKR",
                                        minimumFractionDigits: 0,
                                    }).format(vehicle.price)}
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Year:</span>
                                        <span className="font-medium ml-1">{vehicle.year}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Mileage:</span>
                                        <span className="font-medium ml-1">{vehicle.mileage.toLocaleString()} km</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Fuel:</span>
                                        <span className="font-medium ml-1">{vehicle.fuelType}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Trans:</span>
                                        <span className="font-medium ml-1">{vehicle.transmission}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Lease Calculator */}
                        <LeaseCalculator
                            vehiclePrice={vehicle.price}
                            onCalculate={(result) => {
                                setLoanDetails({
                                    downPayment: result.downPayment,
                                    loanAmount: result.loanAmount,
                                    monthlyPayment: result.monthlyPayment,
                                    loanDuration: 48, // This should be synced with calculator
                                    interestRate: 12.5, // This should be synced with calculator
                                });
                            }}
                        />

                        {/* Company Rating */}
                        <LeaseRating />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default LeaseApplicationPage;
