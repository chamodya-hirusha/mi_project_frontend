"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, X, Car, Video } from "lucide-react";
import LocationSelector from "@/components/LocationSelector";
import { VehicleListing, Location } from "@/types";
import OTPVerification from "@/components/OTPVerification";
import { isPhoneVerified as checkPhoneVerified } from "@/lib/otp";
import { useLanguage } from "@/contexts/LanguageContext";

import { useSearchParams } from "next/navigation";

const PostAd = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userPhone, setUserPhone] = useState<string>("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Vehicle form state
  const [vehicleType, setVehicleType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [condition, setCondition] = useState("");
  const [leasingAvailable, setLeasingAvailable] = useState(true);
  const [negotiable, setNegotiable] = useState(false);

  const [location, setLocation] = useState<Location>({
    province: "",
    district: "",
    town: "",
  });

  // Translated option arrays
  const vehicleTypes = [
    { value: "Car",           label: t.postAd_typeCar },
    { value: "Van",           label: t.postAd_typeVan },
    { value: "SUV",           label: t.postAd_typeSUV },
    { value: "Bike",          label: t.postAd_typeBike },
    { value: "Three-Wheeler", label: t.postAd_typeThreeWheeler },
    { value: "Truck",         label: t.postAd_typeTruck },
    { value: "Bus",           label: t.postAd_typeBus },
    { value: "Other",         label: t.postAd_typeOther },
  ];
  const transmissions = [
    { value: "Manual",        label: t.postAd_tranManual },
    { value: "Automatic",     label: t.postAd_tranAutomatic },
    { value: "Semi-Automatic",label: t.postAd_tranSemiAuto },
  ];
  const fuelTypes = [
    { value: "Petrol",   label: t.postAd_fuelPetrol },
    { value: "Diesel",   label: t.postAd_fuelDiesel },
    { value: "Electric", label: t.postAd_fuelElectric },
    { value: "Hybrid",   label: t.postAd_fuelHybrid },
  ];
  const conditions = [
    { value: "Brand New",    label: t.postAd_condBrandNew },
    { value: "Used",         label: t.postAd_condUsed },
    { value: "Reconditioned",label: t.postAd_condReconditioned },
  ];

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
    const parsedUser = JSON.parse(user);
    setCurrentUser(parsedUser);

    let phone = parsedUser.phone || parsedUser.phoneNumber;
    if (!phone) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const fullUser = users.find((u: any) => u.id === parsedUser.id);
      phone = fullUser?.phone || fullUser?.phoneNumber;
    }
    if (phone) {
      setUserPhone(phone);
      setIsPhoneVerified(checkPhoneVerified(phone));
    }

    if (editId) {
      const allListings: VehicleListing[] = JSON.parse(localStorage.getItem("listings") || "[]");
      const listingToEdit = allListings.find(l => l.id === editId);

      if (listingToEdit) {
        if (listingToEdit.userId !== parsedUser.id && parsedUser.role !== "super-admin" && parsedUser.role !== "admin") {
          toast({ title: "Access Denied", description: "You do not have permission to edit this listing", variant: "destructive" });
          router.push("/dashboard");
          return;
        }

        setIsEditing(true);
        setVehicleType(listingToEdit.vehicleType);
        setCondition(listingToEdit.condition);
        setTransmission(listingToEdit.transmission);
        setFuelType(listingToEdit.fuelType);
        setLocation(listingToEdit.location);
        setImagePreviews(listingToEdit.images);
        setVideoPreview(listingToEdit.video || null);
        setLeasingAvailable(listingToEdit.leasingAvailable ?? true);
        setNegotiable(listingToEdit.negotiable ?? false);

        setTimeout(() => {
          if (formRef.current) {
            const form = formRef.current;
            (form.elements.namedItem("title") as HTMLInputElement).value = listingToEdit.title;
            (form.elements.namedItem("description") as HTMLTextAreaElement).value = listingToEdit.description;
            (form.elements.namedItem("price") as HTMLInputElement).value = listingToEdit.price.toString();
            (form.elements.namedItem("make") as HTMLInputElement).value = listingToEdit.make;
            (form.elements.namedItem("model") as HTMLInputElement).value = listingToEdit.model;
            (form.elements.namedItem("year") as HTMLInputElement).value = listingToEdit.year.toString();
            (form.elements.namedItem("mileage") as HTMLInputElement).value = listingToEdit.mileage.toString();
            (form.elements.namedItem("engineCapacity") as HTMLInputElement).value = listingToEdit.engineCapacity || "";
            (form.elements.namedItem("color") as HTMLInputElement).value = listingToEdit.color || "";
            (form.elements.namedItem("contact") as HTMLInputElement).value = listingToEdit.contactNumber;
          }
        }, 100);
      }
    }
  }, [router, toast, editId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imagePreviews.length + files.length > 6) {
      toast({ title: "Too many images", description: "You can upload maximum 6 images", variant: "destructive" });
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
        setImageFiles((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "Video is too large", description: "Maximum video size is 50MB", variant: "destructive" });
      return;
    }
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      if (video.duration > 60) {
        toast({ title: "Video is too long", description: "Maximum video duration is 1 minute (60 seconds)", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
        setVideoFile(file);
      };
      reader.readAsDataURL(file);
    };
    video.src = URL.createObjectURL(file);
  };

  const removeVideo = () => {
    setVideoPreview(null);
    setVideoFile(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userPhone) {
      toast({ title: "Phone Number Required", description: "Please update your profile with a phone number before posting an ad.", variant: "destructive" });
      router.push("/dashboard");
      return;
    }
    if (!isPhoneVerified) {
      setShowOTPDialog(true);
      return;
    }
    await submitForm(e);
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    if (!location.province || !location.district || !location.town) {
      toast({ title: "Location required", description: "Please select Province, District, and Town", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    if (imagePreviews.length === 0) {
      toast({ title: "Images required", description: "Please upload at least one image of the vehicle", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const vehicle: VehicleListing = {
      id: isEditing ? (editId as string) : crypto.randomUUID(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      vehicleType: vehicleType as any,
      make: formData.get("make") as string,
      model: formData.get("model") as string,
      year: parseInt(formData.get("year") as string),
      mileage: parseInt(formData.get("mileage") as string),
      transmission: transmission as any,
      fuelType: fuelType as any,
      condition: condition as any,
      engineCapacity: formData.get("engineCapacity") as string,
      color: formData.get("color") as string,
      images: imagePreviews.length > 0 ? imagePreviews : ["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800"],
      video: videoPreview || undefined,
      location: location,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      contactNumber: formData.get("contact") as string,
      createdAt: new Date().toISOString(),
      featured: false,
      status: "pending",
      views: 0,
      leasingAvailable: leasingAvailable,
      negotiable: negotiable,
    };

    const allListings = JSON.parse(localStorage.getItem("listings") || "[]");
    if (isEditing) {
      const index = allListings.findIndex((l: any) => l.id === editId);
      if (index !== -1) {
        vehicle.views = allListings[index].views || 0;
        vehicle.createdAt = allListings[index].createdAt;
        allListings[index] = vehicle;
      }
    } else {
      allListings.unshift(vehicle);
    }
    localStorage.setItem("listings", JSON.stringify(allListings));

    toast({
      title: isEditing ? t.postAd_adUpdated : t.postAd_adPosted,
      description: isEditing ? t.postAd_adUpdatedDesc : t.postAd_adPostedDesc,
    });

    setIsLoading(false);
    router.push("/dashboard");
  };

  const handleOTPVerified = () => {
    setIsPhoneVerified(true);
    setShowOTPDialog(false);
    setTimeout(() => {
      const form = formRef.current;
      if (form) {
        const syntheticEvent = { preventDefault: () => {}, currentTarget: form, target: form } as unknown as React.FormEvent<HTMLFormElement>;
        handleSubmit(syntheticEvent);
      }
    }, 100);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      {userPhone && (
        <OTPVerification
          isOpen={showOTPDialog}
          onClose={() => setShowOTPDialog(false)}
          onVerified={handleOTPVerified}
          phoneNumber={userPhone}
        />
      )}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4 sm:mb-8 text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4" />
          {t.postAd_backToHome}
        </Link>

        <div className="max-w-3xl mx-auto mt-4 sm:mt-8">
          <Card className="shadow-lg border-border">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <Car className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl">
                    {isEditing ? t.postAd_editVehicleAd : t.postAd_postVehicleAd}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    {isEditing ? t.postAd_updateDetails : t.postAd_fillDetails}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

                {/* Basic Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold border-b pb-2">{t.postAd_basicInfo}</h3>
                  <div className="space-y-2">
                    <Label htmlFor="title">{t.postAd_adTitle} *</Label>
                    <Input id="title" name="title" placeholder="e.g., Toyota Aqua Hybrid 2020 - Excellent Condition" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t.postAd_description} *</Label>
                    <Textarea id="description" name="description" placeholder="Describe your vehicle in detail..." rows={6} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">{t.postAd_priceLKR} *</Label>
                    <Input id="price" name="price" type="number" placeholder="5800000" min="0" required />
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold border-b pb-2">{t.postAd_vehicleDetails}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label>{t.postAd_vehicleType} *</Label>
                      <Select value={vehicleType} onValueChange={setVehicleType} required>
                        <SelectTrigger><SelectValue placeholder={t.postAd_selectType} /></SelectTrigger>
                        <SelectContent>
                          {vehicleTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t.postAd_condition} *</Label>
                      <Select value={condition} onValueChange={setCondition} required>
                        <SelectTrigger><SelectValue placeholder={t.postAd_selectCondition} /></SelectTrigger>
                        <SelectContent>
                          {conditions.map((cond) => (
                            <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="make">{t.postAd_makeBrand} *</Label>
                      <Input id="make" name="make" placeholder="e.g., Toyota, Honda, Suzuki" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">{t.postAd_model} *</Label>
                      <Input id="model" name="model" placeholder="e.g., Aqua, Civic, Alto" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">{t.postAd_year} *</Label>
                      <Input id="year" name="year" type="number" placeholder="2020" min="1990" max={new Date().getFullYear() + 1} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileage">{t.postAd_mileageKm} *</Label>
                      <Input id="mileage" name="mileage" type="number" placeholder="35000" min="0" required />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.postAd_transmission} *</Label>
                      <Select value={transmission} onValueChange={setTransmission} required>
                        <SelectTrigger><SelectValue placeholder={t.postAd_selectTransmission} /></SelectTrigger>
                        <SelectContent>
                          {transmissions.map((trans) => (
                            <SelectItem key={trans.value} value={trans.value}>{trans.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t.postAd_fuelType} *</Label>
                      <Select value={fuelType} onValueChange={setFuelType} required>
                        <SelectTrigger><SelectValue placeholder={t.postAd_selectFuelType} /></SelectTrigger>
                        <SelectContent>
                          {fuelTypes.map((fuel) => (
                            <SelectItem key={fuel.value} value={fuel.value}>{fuel.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="engineCapacity">{t.postAd_engineCapacity}</Label>
                      <Input id="engineCapacity" name="engineCapacity" placeholder="e.g., 1500cc" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">{t.postAd_color}</Label>
                      <Input id="color" name="color" placeholder="e.g., Silver, Black" />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold border-b pb-2">
                    {t.postAd_vehicleImages} * ({t.postAd_imagesUpTo6})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden border-2 border-border">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => removeImage(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {imagePreviews.length < 6 && (
                      <div className="relative aspect-video">
                        <Label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">{t.postAd_addImage}</span>
                          <Input id="image-upload" name="images" type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                        </Label>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{t.postAd_uploadClear}</p>
                </div>

                {/* Video */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold border-b pb-2">
                    {t.postAd_vehicleVideo} ({t.postAd_videoOptional})
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {videoPreview ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-border bg-black">
                        <video src={videoPreview} className="w-full h-full object-contain" controls />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 z-10" onClick={removeVideo}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="relative aspect-video max-w-md mx-auto w-full">
                        <Label htmlFor="video-upload" className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                          <Video className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground font-medium">{t.postAd_uploadVehicleVideo}</span>
                          <span className="text-xs text-muted-foreground mt-1">{t.postAd_videoFormats}</span>
                          <Input id="video-upload" name="video" type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
                        </Label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold border-b pb-2">{t.postAd_location}</h3>
                  <LocationSelector value={location} onChange={setLocation} required showLabels />
                </div>

                {/* Contact */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold border-b pb-2">{t.postAd_contactInfo}</h3>
                  <div className="space-y-2">
                    <Label htmlFor="contact">{t.postAd_contactNumber} *</Label>
                    <Input id="contact" name="contact" type="tel" placeholder="+94 77 123 4567" required />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="leasing" checked={leasingAvailable} onCheckedChange={(checked) => setLeasingAvailable(checked as boolean)} />
                      <Label htmlFor="leasing" className="text-sm font-normal cursor-pointer">
                        {t.postAd_leasingAvailable}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="negotiable" checked={negotiable} onCheckedChange={(checked) => setNegotiable(checked as boolean)} />
                      <Label htmlFor="negotiable" className="text-sm font-normal cursor-pointer">
                        {t.listing_negotiable}
                      </Label>
                    </div>
                  </div>
                </div>

                {!isPhoneVerified && userPhone && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>{t.postAd_verificationRequired}:</strong> {t.postAd_verifyMobile}
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all" disabled={isLoading} size="lg">
                  {isLoading ? t.postAd_saving : (isEditing ? t.postAd_updateAdvertisement : t.postAd_postAd)}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostAd;
