import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    getAllProvinces,
    getDistrictsByProvince,
    getTownsByDistrict,
    getLocationCoordinates,
    sriLankanLocations,
} from "@/lib/locationData";
import { MapPin, Loader2 } from "lucide-react";

interface LocationSelectorProps {
    value: {
        province: string;
        district: string;
        town: string;
    };
    onChange: (location: {
        province: string;
        district: string;
        town: string;
        coordinates?: { lat: number; lng: number };
    }) => void;
    required?: boolean;
    showLabels?: boolean;
}

// Fuzzy match helper: checks if a string contains any keyword
const fuzzyMatch = (source: string, target: string): boolean => {
    const s = source.toLowerCase().replace(/\s+district|\s+province/g, "").trim();
    const t = target.toLowerCase().replace(/\s+district|\s+province/g, "").trim();
    return s.includes(t) || t.includes(s);
};

// Find the best matching province/district/town from IP API response
const matchLocation = (city: string, region: string) => {
    for (const province of sriLankanLocations) {
        // Check if region matches province
        const provinceMatch = fuzzyMatch(province.name, region) || fuzzyMatch(region, province.name);

        for (const district of province.districts) {
            const districtMatch = fuzzyMatch(district.name, region) || fuzzyMatch(district.name, city);

            if (provinceMatch || districtMatch) {
                // Try to find a matching town
                const matchedTown = district.towns.find(
                    (t) => fuzzyMatch(t.name, city)
                );

                return {
                    province: province.name,
                    district: district.name,
                    town: matchedTown?.name || "",
                };
            }
        }
    }

    // Fallback: just try to match by city across all towns
    for (const province of sriLankanLocations) {
        for (const district of province.districts) {
            const matchedTown = district.towns.find((t) => fuzzyMatch(t.name, city));
            if (matchedTown) {
                return {
                    province: province.name,
                    district: district.name,
                    town: matchedTown.name,
                };
            }
        }
    }

    return null;
};

const LocationSelector = ({
    value,
    onChange,
    required = false,
    showLabels = true,
}: LocationSelectorProps) => {
    const [provinces] = useState<string[]>(getAllProvinces());
    const [districts, setDistricts] = useState<string[]>([]);
    const [towns, setTowns] = useState<string[]>([]);
    const [isDetecting, setIsDetecting] = useState(false);

    // Auto-detect location from IP on mount (only if no location is already set)
    useEffect(() => {
        if (value.province || value.district || value.town) return; // Skip if already set (e.g., edit mode)

        const detectLocation = async () => {
            setIsDetecting(true);
            try {
                const res = await fetch("https://ip-api.com/json/?fields=city,regionName,country");
                if (!res.ok) return;

                const data = await res.json();

                // Only auto-fill for Sri Lanka
                if (data.country !== "Sri Lanka" && data.country !== "LK") {
                    // Still attempt if country is unknown, just try matching
                }

                const city: string = data.city || "";
                const region: string = data.regionName || "";

                if (!city && !region) return;

                const matched = matchLocation(city, region);
                if (matched) {
                    const coords = matched.town
                        ? getLocationCoordinates(matched.province, matched.district, matched.town)
                        : null;

                    onChange({
                        ...matched,
                        coordinates: coords || undefined,
                    });
                }
            } catch (_) {
                // Silently fail — user can still select manually
            } finally {
                setIsDetecting(false);
            }
        };

        detectLocation();
    }, []); // Run only once on mount

    // Update districts list when province changes
    useEffect(() => {
        if (value.province) {
            setDistricts(getDistrictsByProvince(value.province));
        } else {
            setDistricts([]);
            setTowns([]);
        }
    }, [value.province]);

    // Update towns list when district changes
    useEffect(() => {
        if (value.province && value.district) {
            setTowns(getTownsByDistrict(value.province, value.district));
        } else {
            setTowns([]);
        }
    }, [value.province, value.district]);

    const handleProvinceChange = (province: string) => {
        onChange({ province, district: "", town: "" });
    };

    const handleDistrictChange = (district: string) => {
        onChange({ province: value.province, district, town: "" });
    };

    const handleTownChange = (town: string) => {
        const coordinates = getLocationCoordinates(value.province, value.district, town);
        onChange({
            province: value.province,
            district: value.district,
            town,
            coordinates: coordinates || undefined,
        });
    };

    return (
        <div className="space-y-4">
            {/* Auto-detect banner */}
            {isDetecting && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-lg border border-border animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    <span>Detecting your location...</span>
                </div>
            )}

            {!isDetecting && value.province && (
                <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                    <MapPin className="w-3 h-3 text-green-500" />
                    <span>Location auto-detected. You can change it below.</span>
                </div>
            )}

            {/* Province Selector */}
            <div className="space-y-2">
                {showLabels && (
                    <Label htmlFor="province">
                        Province {required && <span className="text-destructive">*</span>}
                    </Label>
                )}
                <Select value={value.province} onValueChange={handleProvinceChange}>
                    <SelectTrigger id="province">
                        <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                        {provinces.map((province) => (
                            <SelectItem key={province} value={province}>
                                {province}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* District Selector */}
            <div className="space-y-2">
                {showLabels && (
                    <Label htmlFor="district">
                        District {required && <span className="text-destructive">*</span>}
                    </Label>
                )}
                <Select
                    value={value.district}
                    onValueChange={handleDistrictChange}
                    disabled={!value.province}
                >
                    <SelectTrigger id="district">
                        <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                        {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                                {district}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Town Selector */}
            <div className="space-y-2">
                {showLabels && (
                    <Label htmlFor="town">
                        Town {required && <span className="text-destructive">*</span>}
                    </Label>
                )}
                <Select
                    value={value.town}
                    onValueChange={handleTownChange}
                    disabled={!value.district}
                >
                    <SelectTrigger id="town">
                        <SelectValue placeholder="Select Town" />
                    </SelectTrigger>
                    <SelectContent>
                        {towns.map((town) => (
                            <SelectItem key={town} value={town}>
                                {town}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default LocationSelector;
