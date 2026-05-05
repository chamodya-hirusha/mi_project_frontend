import { useLocation } from "@/contexts/LocationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Loader2, X, AlertCircle } from "lucide-react";
import { useState } from "react";

const LocationBanner = () => {
  const { userLocation, isLoading, error, requestLocation, hasRequested } = useLocation();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if location is available or if dismissed
  if (userLocation || isDismissed) {
    return null;
  }

  // Don't show if there's no error and we haven't requested yet (will auto-request)
  if (!error && !hasRequested) {
    return null;
  }

  return (
    <Card className="mb-4 border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-primary mt-0.5 animate-spin" />
            ) : error ? (
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            ) : (
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">
                {isLoading
                  ? "Detecting your location..."
                  : error
                  ? "Location Access Needed"
                  : "Enable Location Services"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? "Please allow location access to see nearby listings"
                  : error
                  ? "Enable location to see vehicles near you and get better search results"
                  : "Share your location to see nearby vehicle listings"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isLoading && (
              <Button
                size="sm"
                onClick={requestLocation}
                disabled={isLoading}
                variant={error ? "default" : "outline"}
              >
                {error ? "Try Again" : "Enable"}
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setIsDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationBanner;
