// Location utility functions for distance calculation and vehicle sorting

interface Coordinates {
    lat: number;
    lng: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (
    coord1: Coordinates,
    coord2: Coordinates
): number => {
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRadians(coord2.lat - coord1.lat);
    const dLon = toRadians(coord2.lng - coord1.lng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(coord1.lat)) *
        Math.cos(toRadians(coord2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};

/**
 * Sort vehicles by proximity to user's location
 * Nearest vehicles first, vehicles without coordinates at the end
 */
export const sortByProximity = <T extends { location: { coordinates?: Coordinates } }>(
    items: T[],
    userCoordinates: Coordinates
): T[] => {
    return items.sort((a, b) => {
        const coordsA = a.location.coordinates;
        const coordsB = b.location.coordinates;

        // Both have coordinates: sort by distance (nearest first)
        if (coordsA && coordsB) {
            const distanceA = calculateDistance(userCoordinates, coordsA);
            const distanceB = calculateDistance(userCoordinates, coordsB);
            return distanceA - distanceB;
        }

        // Items without coordinates go to the end
        if (!coordsA && !coordsB) return 0; // Both without coordinates: maintain order
        if (!coordsA) return 1; // a has no coordinates, b does: a goes after b
        if (!coordsB) return -1; // b has no coordinates, a does: b goes after a

        return 0;
    });
};

/**
 * Get distance label for display
 */
export const getDistanceLabel = (distance: number): string => {
    if (distance < 1) {
        return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance}km away`;
};

/**
 * Filter vehicles by location
 */
export const filterByLocation = <T extends { location: { province: string; district: string; town: string } }>(
    items: T[],
    filters: {
        province?: string;
        district?: string;
        town?: string;
    }
): T[] => {
    return items.filter((item) => {
        if (filters.province && item.location.province !== filters.province) {
            return false;
        }
        if (filters.district && item.location.district !== filters.district) {
            return false;
        }
        if (filters.town && item.location.town !== filters.town) {
            return false;
        }
        return true;
    });
};

/**
 * Get user's current location (using browser geolocation API)
 */
export const getUserLocation = (): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
};

/**
 * Find nearest towns/districts to a coordinate
 */
export const findNearestLocations = (
    userCoords: Coordinates,
    maxResults: number = 5
): string[] => {
    // This would require the full location database with coordinates
    // For now, returning empty array - can be enhanced later
    return [];
};
