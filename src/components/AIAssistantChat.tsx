"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    Car,
    MapPin,
    Calendar,
    Gauge,
    Fuel,
    Settings,
    Sparkles
} from "lucide-react";
import { VehicleListing } from "@/types";
import { useRouter } from "next/navigation";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    vehicles?: VehicleListing[];
}

const AIAssistantChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I'm your AI assistant. I can help you find the perfect vehicle based on your requirements. Just tell me what you're looking for! For example:\n\n• \"I need a Toyota car under 5 million\"\n• \"Show me SUVs in Colombo\"\n• \"Find me a hybrid vehicle from 2020\"\n• \"I want a brand new automatic car\"",
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Scroll to bottom when new messages are added
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                setTimeout(() => {
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }, 100);
            }
        }
    }, [messages, isProcessing]);

    // Parse user requirements from natural language
    const parseRequirements = (text: string) => {
        const lowerText = text.toLowerCase();
        const requirements: {
            vehicleType?: string;
            make?: string;
            model?: string;
            priceMax?: number;
            priceMin?: number;
            yearMin?: number;
            yearMax?: number;
            fuelType?: string;
            transmission?: string;
            condition?: string;
            location?: { province?: string; district?: string; town?: string };
            keywords?: string[];
        } = {};

        // Extract vehicle type
        const vehicleTypes = ["car", "suv", "van", "bike", "three-wheeler", "truck", "bus"];
        for (const type of vehicleTypes) {
            if (lowerText.includes(type)) {
                requirements.vehicleType = type === "three-wheeler" ? "Three-Wheeler" : type.charAt(0).toUpperCase() + type.slice(1);
                break;
            }
        }

        // Extract make/brand
        const brands = ["toyota", "honda", "suzuki", "nissan", "mazda", "mitsubishi", "hyundai", "bmw", "mercedes", "audi", "volkswagen", "ford", "chevrolet"];
        for (const brand of brands) {
            if (lowerText.includes(brand)) {
                requirements.make = brand.charAt(0).toUpperCase() + brand.slice(1);
                break;
            }
        }

        // Extract model (common models)
        const models = ["aqua", "axio", "vezel", "civic", "accord", "alto", "wagon r", "leaf", "corolla", "prius"];
        for (const model of models) {
            if (lowerText.includes(model)) {
                requirements.model = model;
                break;
            }
        }

        // Extract price range
        const priceMatch = lowerText.match(/(?:under|below|less than|max|maximum|up to)\s*(?:rs\.?|lkr|rupees?)?\s*(\d+(?:[,\s]\d+)*(?:\.\d+)?)\s*(?:million|lakh|k)?/i);
        if (priceMatch) {
            let price = parseFloat(priceMatch[1].replace(/[,\s]/g, ""));
            if (lowerText.includes("million")) price *= 1000000;
            else if (lowerText.includes("lakh")) price *= 100000;
            else if (lowerText.includes("k")) price *= 1000;
            requirements.priceMax = price;
        }

        const priceMinMatch = lowerText.match(/(?:above|over|more than|min|minimum|from)\s*(?:rs\.?|lkr|rupees?)?\s*(\d+(?:[,\s]\d+)*(?:\.\d+)?)\s*(?:million|lakh|k)?/i);
        if (priceMinMatch) {
            let price = parseFloat(priceMinMatch[1].replace(/[,\s]/g, ""));
            if (lowerText.includes("million")) price *= 1000000;
            else if (lowerText.includes("lakh")) price *= 100000;
            else if (lowerText.includes("k")) price *= 1000;
            requirements.priceMin = price;
        }

        // Extract year range
        const yearMatch = lowerText.match(/(?:from|after|since)\s*(\d{4})/i);
        if (yearMatch) {
            requirements.yearMin = parseInt(yearMatch[1]);
        }

        const yearMaxMatch = lowerText.match(/(?:before|until|up to)\s*(\d{4})/i);
        if (yearMaxMatch) {
            requirements.yearMax = parseInt(yearMaxMatch[1]);
        }

        // Extract fuel type
        if (lowerText.includes("hybrid")) requirements.fuelType = "Hybrid";
        else if (lowerText.includes("electric")) requirements.fuelType = "Electric";
        else if (lowerText.includes("diesel")) requirements.fuelType = "Diesel";
        else if (lowerText.includes("petrol")) requirements.fuelType = "Petrol";

        // Extract transmission
        if (lowerText.includes("automatic")) requirements.transmission = "Automatic";
        else if (lowerText.includes("manual")) requirements.transmission = "Manual";
        else if (lowerText.includes("semi-automatic")) requirements.transmission = "Semi-Automatic";

        // Extract condition
        if (lowerText.includes("brand new") || lowerText.includes("new")) requirements.condition = "Brand New";
        else if (lowerText.includes("used")) requirements.condition = "Used";
        else if (lowerText.includes("reconditioned") || lowerText.includes("recon")) requirements.condition = "Reconditioned";

        // Extract location
        const provinces = ["western", "central", "southern", "northern", "eastern", "north western", "north central", "uva", "sabaragamuwa"];
        const districts = ["colombo", "gampaha", "kalutara", "kandy", "matale", "nuwara eliya", "galle", "matara", "hambantota"];
        const towns = ["colombo", "kandy", "galle", "gampaha", "kurunegala"];

        for (const province of provinces) {
            if (lowerText.includes(province)) {
                requirements.location = { province: province.charAt(0).toUpperCase() + province.slice(1) + " Province" };
                break;
            }
        }

        for (const district of districts) {
            if (lowerText.includes(district)) {
                if (!requirements.location) requirements.location = {};
                requirements.location.district = district.charAt(0).toUpperCase() + district.slice(1) + " District";
                break;
            }
        }

        for (const town of towns) {
            if (lowerText.includes(town)) {
                if (!requirements.location) requirements.location = {};
                requirements.location.town = town.charAt(0).toUpperCase() + town.slice(1);
                break;
            }
        }

        // Extract keywords
        const keywords: string[] = [];
        const keywordPatterns = ["fuel efficient", "economy", "luxury", "family", "sport", "compact", "sedan", "hatchback"];
        for (const keyword of keywordPatterns) {
            if (lowerText.includes(keyword)) {
                keywords.push(keyword);
            }
        }
        if (keywords.length > 0) {
            requirements.keywords = keywords;
        }

        return requirements;
    };

    // Search vehicles based on requirements
    const searchVehicles = (requirements: ReturnType<typeof parseRequirements>): VehicleListing[] => {
        const storedListings = localStorage.getItem("listings");
        if (!storedListings) return [];

        const allVehicles: VehicleListing[] = JSON.parse(storedListings);
        let filtered = allVehicles.filter((v) => v.status === "approved");

        // Apply filters
        if (requirements.vehicleType) {
            filtered = filtered.filter((v) => v.vehicleType.toLowerCase() === requirements.vehicleType!.toLowerCase());
        }

        if (requirements.make) {
            filtered = filtered.filter((v) => v.make.toLowerCase().includes(requirements.make!.toLowerCase()));
        }

        if (requirements.model) {
            filtered = filtered.filter((v) => v.model.toLowerCase().includes(requirements.model!.toLowerCase()));
        }

        if (requirements.priceMin) {
            filtered = filtered.filter((v) => v.price >= requirements.priceMin!);
        }

        if (requirements.priceMax) {
            filtered = filtered.filter((v) => v.price <= requirements.priceMax!);
        }

        if (requirements.yearMin) {
            filtered = filtered.filter((v) => v.year >= requirements.yearMin!);
        }

        if (requirements.yearMax) {
            filtered = filtered.filter((v) => v.year <= requirements.yearMax!);
        }

        if (requirements.fuelType) {
            filtered = filtered.filter((v) => v.fuelType === requirements.fuelType);
        }

        if (requirements.transmission) {
            filtered = filtered.filter((v) => v.transmission === requirements.transmission);
        }

        if (requirements.condition) {
            filtered = filtered.filter((v) => v.condition === requirements.condition);
        }

        if (requirements.location) {
            if (requirements.location.province) {
                filtered = filtered.filter((v) => v.location.province === requirements.location!.province);
            }
            if (requirements.location.district) {
                filtered = filtered.filter((v) => v.location.district === requirements.location!.district);
            }
            if (requirements.location.town) {
                filtered = filtered.filter((v) => v.location.town.toLowerCase().includes(requirements.location!.town!.toLowerCase()));
            }
        }

        // Keyword matching in title/description
        if (requirements.keywords && requirements.keywords.length > 0) {
            filtered = filtered.filter((v) => {
                const searchText = `${v.title} ${v.description}`.toLowerCase();
                return requirements.keywords!.some((keyword) => searchText.includes(keyword));
            });
        }

        // Sort by relevance (featured first, then by price)
        filtered.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return a.price - b.price;
        });

        return filtered.slice(0, 10); // Return top 10 results
    };

    // Generate response based on requirements
    const generateResponse = (requirements: ReturnType<typeof parseRequirements>, vehicles: VehicleListing[]): string => {
        if (vehicles.length === 0) {
            return "I couldn't find any vehicles matching your requirements. Try adjusting your search criteria, or ask me something like:\n\n• \"Show me all cars\"\n• \"Find SUVs under 10 million\"\n• \"I need a Toyota in Colombo\"";
        }

        const criteria: string[] = [];
        if (requirements.vehicleType) criteria.push(requirements.vehicleType);
        if (requirements.make) criteria.push(requirements.make);
        if (requirements.priceMax) criteria.push(`under ${(requirements.priceMax / 1000000).toFixed(1)}M`);
        if (requirements.location?.town) criteria.push(`in ${requirements.location.town}`);
        if (requirements.fuelType) criteria.push(requirements.fuelType);
        if (requirements.condition) criteria.push(requirements.condition);

        const criteriaText = criteria.length > 0 ? ` matching: ${criteria.join(", ")}` : "";
        return `I found ${vehicles.length} vehicle${vehicles.length > 1 ? "s" : ""}${criteriaText}. Here are the results:`;
    };

    const handleSend = () => {
        if (!inputValue.trim() || isProcessing) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsProcessing(true);

        // Simulate AI processing delay
        setTimeout(() => {
            const requirements = parseRequirements(userMessage.content);
            const vehicles = searchVehicles(requirements);
            const response = generateResponse(requirements, vehicles);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response,
                vehicles: vehicles.length > 0 ? vehicles : undefined,
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setIsProcessing(false);
        }, 800);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50 bg-primary hover:bg-primary/90"
                    size="icon"
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 w-[90vw] sm:w-96 h-[600px] shadow-2xl z-50 flex flex-col border-2">
                    <CardContent className="p-0 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">AI Assistant</h3>
                                    <p className="text-xs opacity-90">I can help you find vehicles</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-primary-foreground hover:bg-primary-foreground/20"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                        {message.role === "assistant" && (
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Bot className="w-4 h-4 text-primary" />
                                            </div>
                                        )}
                                        <div className={`flex flex-col gap-2 max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                                            <div
                                                className={`rounded-lg px-4 py-2 ${message.role === "user"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                    }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            </div>

                                            {/* Vehicle Cards */}
                                            {message.vehicles && message.vehicles.length > 0 && (
                                                <div className="space-y-3 w-full">
                                                    {message.vehicles.map((vehicle) => (
                                                        <Card
                                                            key={vehicle.id}
                                                            className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50"
                                                            onClick={() => {
                                                                router.push(`/listing/${vehicle.id}`);
                                                                setIsOpen(false);
                                                            }}
                                                        >
                                                            <CardContent className="p-3">
                                                                <div className="flex gap-3">
                                                                    <img
                                                                        src={vehicle.images[0] || "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"}
                                                                        alt={vehicle.title}
                                                                        className="w-20 h-20 object-cover rounded"
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-semibold text-sm line-clamp-1 mb-1">
                                                                            {vehicle.title}
                                                                        </h4>
                                                                        <p className="text-lg font-bold text-primary mb-2">
                                                                            {formatPrice(vehicle.price)}
                                                                        </p>
                                                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                                            <div className="flex items-center gap-1">
                                                                                <Calendar className="w-3 h-3" />
                                                                                <span>{vehicle.year}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <Gauge className="w-3 h-3" />
                                                                                <span>{vehicle.mileage.toLocaleString()} km</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <Fuel className="w-3 h-3" />
                                                                                <span>{vehicle.fuelType}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <Settings className="w-3 h-3" />
                                                                                <span>{vehicle.transmission}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                                                            <MapPin className="w-3 h-3" />
                                                                            <span className="line-clamp-1">
                                                                                {vehicle.location.town}, {vehicle.location.district}
                                                                            </span>
                                                                        </div>
                                                                        {vehicle.leasingAvailable && (
                                                                            <Badge variant="secondary" className="mt-2 text-xs">
                                                                                Leasing Available
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                    {message.vehicles.length >= 10 && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full"
                                                            onClick={() => {
                                                                router.push("/listings");
                                                                setIsOpen(false);
                                                            }}
                                                        >
                                                            View All Results
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {message.role === "user" && (
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <User className="w-4 h-4 text-primary" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isProcessing && (
                                    <div className="flex gap-3 justify-start">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="bg-muted rounded-lg px-4 py-2">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-4 border-t">
                            <div className="flex gap-2">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Describe what you're looking for..."
                                    className="flex-1"
                                    disabled={isProcessing}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isProcessing}
                                    size="icon"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Try: "Show me Toyota cars under 5 million" or "Find SUVs in Colombo"
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default AIAssistantChat;
