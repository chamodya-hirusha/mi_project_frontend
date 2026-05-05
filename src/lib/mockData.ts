// Mock data for development and testing
import { VehicleListing, LeaseRating, LeaseSettings, Branch, Testimonial } from "@/types";

// Default Lease Settings
export const defaultLeaseSettings: LeaseSettings = {
    minInterestRate: 8.5,
    maxInterestRate: 18.0,
    defaultInterestRate: 12.5,
    minLoanDuration: 12, // 1 year
    maxLoanDuration: 84, // 7 years
    minDownPaymentPercentage: 10,
    processingFee: 25000,
    companyName: "TradeHub Leasing",
    companyEmail: "leasing@tradehub.lk",
    companyPhone: "+94 11 234 5678",
};

// Company Leasing Rating
export const companyRating: LeaseRating = {
    companyName: "TradeHub Leasing",
    overallRating: 4.6,
    totalReviews: 1247,
    successfulLeases: 3850,
    averageApprovalTime: "2-3 days",
    interestRateRange: {
        min: 8.5,
        max: 18.0,
    },
    testimonials: [
        {
            id: "t1",
            customerName: "Nimal Perera",
            rating: 5,
            comment: "Excellent service! Got my car loan approved within 2 days. Very professional staff and transparent process.",
            date: "2025-11-15",
            vehicleType: "Car",
        },
        {
            id: "t2",
            customerName: "Kamala Silva",
            rating: 5,
            comment: "Best leasing rates in Colombo. The monthly payments were very affordable and the process was smooth.",
            date: "2025-11-10",
            vehicleType: "SUV",
        },
        {
            id: "t3",
            customerName: "Rajitha Fernando",
            rating: 4,
            comment: "Good experience overall. The approval process was quick and the staff was helpful throughout.",
            date: "2025-11-05",
            vehicleType: "Van",
        },
    ],
};

// Sample Branches
export const sampleBranches: Branch[] = [
    {
        id: "branch-1",
        name: "TradeHub Colombo Main Branch",
        location: {
            province: "Western Province",
            district: "Colombo District",
            town: "Colombo",
            coordinates: { lat: 6.9271, lng: 79.8612 },
        },
        address: "123 Galle Road, Colombo 03",
        contactNumber: "+94 11 234 5678",
        email: "colombo@tradehub.lk",
        managerName: "Sunil Jayawardena",
        status: "active",
        openingHours: "Mon-Fri: 9AM-5PM, Sat: 9AM-1PM",
    },
    {
        id: "branch-2",
        name: "TradeHub Kandy Branch",
        location: {
            province: "Central Province",
            district: "Kandy District",
            town: "Kandy",
            coordinates: { lat: 7.2906, lng: 80.6337 },
        },
        address: "45 Peradeniya Road, Kandy",
        contactNumber: "+94 81 222 3344",
        email: "kandy@tradehub.lk",
        managerName: "Kumara Dissanayake",
        status: "active",
        openingHours: "Mon-Fri: 9AM-5PM, Sat: 9AM-1PM",
    },
    {
        id: "branch-3",
        name: "TradeHub Galle Branch",
        location: {
            province: "Southern Province",
            district: "Galle District",
            town: "Galle",
            coordinates: { lat: 6.0535, lng: 80.2210 },
        },
        address: "78 Main Street, Galle Fort",
        contactNumber: "+94 91 223 4567",
        email: "galle@tradehub.lk",
        managerName: "Anura Wickramasinghe",
        status: "active",
        openingHours: "Mon-Fri: 9AM-5PM, Sat: 9AM-1PM",
    },
    {
        id: "branch-4",
        name: "TradeHub Negombo Branch",
        location: {
            province: "Western Province",
            district: "Gampaha District",
            town: "Negombo",
            coordinates: { lat: 7.2083, lng: 79.8358 },
        },
        address: "12 Lewis Place, Negombo",
        contactNumber: "+94 31 222 7788",
        email: "negombo@tradehub.lk",
        managerName: "Saman Fernando",
        status: "active",
        openingHours: "Mon-Fri: 9AM-5PM",
    },
];

// Sample Vehicle Listings
export const sampleVehicles: VehicleListing[] = [
    {
        id: "vehicle-1",
        title: "Toyota Aqua Hybrid 2020 - Excellent Condition",
        description: "Well-maintained Toyota Aqua hybrid vehicle. Full service history, single owner. Perfect for city driving with excellent fuel efficiency. All original parts, never been in an accident.",
        price: 5800000,
        vehicleType: "Car",
        make: "Toyota",
        model: "Aqua",
        year: 2020,
        mileage: 35000,
        transmission: "Automatic",
        fuelType: "Hybrid",
        condition: "Used",
        engineCapacity: "1500cc",
        color: "Silver",
        images: [
            "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800",
            "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800",
        ],
        location: {
            province: "Western Province",
            district: "Colombo District",
            town: "Colombo",
            coordinates: { lat: 6.9271, lng: 79.8612 },
        },
        userId: "user-1",
        userName: "Kasun Perera",
        userEmail: "kasun@example.com",
        contactNumber: "+94 77 123 4567",
        createdAt: "2025-11-20T10:30:00Z",
        featured: true,
        status: "approved",
        views: 234,
        leasingAvailable: true,
        leaseRental: 95000, // Monthly lease rental
    },
    {
        id: "vehicle-2",
        title: "Honda Vezel 2018 - Premium SUV",
        description: "Luxurious Honda Vezel in pristine condition. Fully loaded with leather seats, sunroof, and advanced safety features. Ideal family SUV with spacious interior.",
        price: 7200000,
        vehicleType: "SUV",
        make: "Honda",
        model: "Vezel",
        year: 2018,
        mileage: 48000,
        transmission: "Automatic",
        fuelType: "Petrol",
        condition: "Used",
        engineCapacity: "1500cc",
        color: "Black",
        images: [
            "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
        ],
        location: {
            province: "Central Province",
            district: "Kandy District",
            town: "Kandy",
            coordinates: { lat: 7.2906, lng: 80.6337 },
        },
        userId: "user-2",
        userName: "Sanduni Silva",
        userEmail: "sanduni@example.com",
        contactNumber: "+94 71 234 5678",
        createdAt: "2025-11-19T14:20:00Z",
        featured: true,
        status: "approved",
        views: 187,
        leasingAvailable: true,
        leaseRental: 118000, // Monthly lease rental
    },
    {
        id: "vehicle-3",
        title: "Toyota KDH Van 2019 - 14 Seater",
        description: "Spacious Toyota KDH van perfect for family trips or business use. Well-maintained with full AC, comfortable seating for 14 passengers. Ideal for tours and travel.",
        price: 8500000,
        vehicleType: "Van",
        make: "Toyota",
        model: "KDH",
        year: 2019,
        mileage: 62000,
        transmission: "Manual",
        fuelType: "Diesel",
        condition: "Used",
        engineCapacity: "3000cc",
        color: "White",
        images: [
            "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800",
        ],
        location: {
            province: "Western Province",
            district: "Gampaha District",
            town: "Negombo",
            coordinates: { lat: 7.2083, lng: 79.8358 },
        },
        userId: "user-3",
        userName: "Mahesh Fernando",
        userEmail: "mahesh@example.com",
        contactNumber: "+94 75 345 6789",
        createdAt: "2025-11-18T09:15:00Z",
        featured: false,
        status: "approved",
        views: 156,
        leasingAvailable: true,
        leaseRental: 139000, // Monthly lease rental
    },
    {
        id: "vehicle-4",
        title: "Yamaha FZ 2021 - Sports Bike",
        description: "Powerful Yamaha FZ sports bike in excellent condition. Low mileage, well-maintained. Perfect for enthusiasts looking for performance and style.",
        price: 580000,
        vehicleType: "Bike",
        make: "Yamaha",
        model: "FZ",
        year: 2021,
        mileage: 8500,
        transmission: "Manual",
        fuelType: "Petrol",
        condition: "Used",
        engineCapacity: "150cc",
        color: "Blue",
        images: [
            "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800",
        ],
        location: {
            province: "Southern Province",
            district: "Galle District",
            town: "Galle",
            coordinates: { lat: 6.0535, lng: 80.2210 },
        },
        userId: "user-4",
        userName: "Dilshan Mendis",
        userEmail: "dilshan@example.com",
        contactNumber: "+94 76 456 7890",
        createdAt: "2025-11-17T16:45:00Z",
        featured: false,
        status: "approved",
        views: 98,
        leasingAvailable: true,
        leaseRental: 9500, // Monthly lease rental
    },
    {
        id: "vehicle-5",
        title: "Suzuki Alto 2022 - Brand New",
        description: "Brand new Suzuki Alto, never registered. Perfect first car with excellent fuel economy. Affordable and reliable city car.",
        price: 3200000,
        vehicleType: "Car",
        make: "Suzuki",
        model: "Alto",
        year: 2022,
        mileage: 0,
        transmission: "Manual",
        fuelType: "Petrol",
        condition: "Brand New",
        engineCapacity: "800cc",
        color: "Red",
        images: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
        ],
        location: {
            province: "Western Province",
            district: "Colombo District",
            town: "Maharagama",
            coordinates: { lat: 6.8481, lng: 79.9265 },
        },
        userId: "user-5",
        userName: "Nimali Wijesinghe",
        userEmail: "nimali@example.com",
        contactNumber: "+94 77 567 8901",
        createdAt: "2025-11-16T11:30:00Z",
        featured: true,
        status: "approved",
        views: 312,
        leasingAvailable: true,
        leaseRental: 52000, // Monthly lease rental
    },
];

// Initialize localStorage with sample data if empty
export const initializeMockData = () => {
    if (!localStorage.getItem("leaseSettings")) {
        localStorage.setItem("leaseSettings", JSON.stringify(defaultLeaseSettings));
    }

    if (!localStorage.getItem("companyRating")) {
        localStorage.setItem("companyRating", JSON.stringify(companyRating));
    }

    if (!localStorage.getItem("branches")) {
        localStorage.setItem("branches", JSON.stringify(sampleBranches));
    }

    // Add sample vehicles to existing listings
    const existingListings = JSON.parse(localStorage.getItem("listings") || "[]");
    if (existingListings.length === 0) {
        localStorage.setItem("listings", JSON.stringify(sampleVehicles));
    }
};
