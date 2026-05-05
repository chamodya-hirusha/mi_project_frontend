import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUserLocation } from "@/lib/locationUtils";
import { useToast } from "@/hooks/use-toast";
import { trackUserLocation } from "@/lib/analytics";

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationContextType {
  userLocation: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  hasRequested: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRequested, setHasRequested] = useState(false);
  const { toast } = useToast();

  // Load location from sessionStorage on mount
  useEffect(() => {
    const storedLocation = sessionStorage.getItem("userLocation");
    if (storedLocation) {
      try {
        const location = JSON.parse(storedLocation);
        setUserLocation(location);
        setHasRequested(true);
      } catch (e) {
        console.error("Failed to parse stored location", e);
      }
    }
  }, []);

  const requestLocation = async () => {
    if (hasRequested && userLocation) {
      return; // Already have location
    }

    setIsLoading(true);
    setError(null);

    try {
      const location = await getUserLocation();
      setUserLocation(location);
      setHasRequested(true);
      
      // Store in sessionStorage
      sessionStorage.setItem("userLocation", JSON.stringify(location));
      
      // Track user location
      trackUserLocation(location);
      
      toast({
        title: "Location detected",
        description: "We've detected your location to show you nearby listings",
      });
    } catch (err: any) {
      const errorMessage = 
        err.code === 1
          ? "Location access denied. Please enable location permissions to see nearby listings."
          : err.code === 2
          ? "Location unavailable. Please check your device settings."
          : err.code === 3
          ? "Location request timed out. Please try again."
          : "Unable to get your location. Please try again later.";
      
      setError(errorMessage);
      
      // Only show toast for permission denied (code 1)
      if (err.code === 1) {
        toast({
          title: "Location Access Denied",
          description: "Enable location permissions to see nearby listings",
          variant: "default",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically request location on first visit (with user consent prompt)
  useEffect(() => {
    // Only auto-request if we haven't requested before and don't have stored location
    const storedLocation = sessionStorage.getItem("userLocation");
    if (!storedLocation && !hasRequested) {
      // Small delay to let the page load first
      const timer = setTimeout(() => {
        requestLocation();
      }, 1000);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        isLoading,
        error,
        requestLocation,
        hasRequested,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
