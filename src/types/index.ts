// Type definitions for Vehicle Leasing Platform

export interface Location {
    province: string;
    district: string;
    town: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface VehicleListing {
    id: string;

    // Basic Info
    title: string;
    description: string;
    price: number;
    negotiable: boolean;

    // Vehicle Details
    vehicleType: "Car" | "Van" | "SUV" | "Bike" | "Three-Wheeler" | "Truck" | "Bus" | "Other";
    make: string; // Brand (e.g., Toyota, Honda)
    model: string; // Model (e.g., Corolla, Civic)
    year: number;
    mileage: number; // in km
    transmission: "Manual" | "Automatic" | "Semi-Automatic";
    fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
    condition: "Brand New" | "Used" | "Reconditioned";
    engineCapacity?: string; // e.g., "1500cc"
    color?: string;

    // Images and Videos
    images: string[]; // Array of image URLs (up to 6)
    video?: string; // Optional video URL or path

    // Location
    location: Location;

    // Seller Info
    userId: string;
    userName: string;
    userEmail: string;
    contactNumber: string;

    // Metadata
    createdAt: string;
    updatedAt?: string;
    featured: boolean;
    status: "pending" | "approved" | "rejected" | "sold";
    views?: number;

    // Leasing Eligibility
    leasingAvailable: boolean;
    leaseRental?: number; // Monthly lease rental amount
    rejectionReason?: string;
}

export interface LeaseApplication {
    id: string;

    // Vehicle Reference
    vehicleId: string;
    vehicleTitle: string;
    vehiclePrice: number;

    // Applicant Personal Info
    applicantId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    nic: string; // National Identity Card
    dateOfBirth: string;
    address: string;
    location: Location;

    // Employment Details
    employmentStatus: "Employed" | "Self-Employed" | "Business Owner" | "Other";
    employerName?: string;
    occupation: string;
    monthlyIncome: number;
    employmentDuration: string; // e.g., "3 years"

    // Loan Details
    downPayment: number;
    loanAmount: number;
    loanDuration: number; // in months
    monthlyPayment: number;
    interestRate: number;

    // References
    referenceContact1?: string;
    referenceContact2?: string;

    // Application Status
    status: "pending" | "in-review" | "approved" | "rejected" | "cancelled";
    submittedAt: string;
    reviewedAt?: string;
    reviewedBy?: string; // Admin ID

    // Admin Assignment
    assignedBranch?: string;
    assignedBranchId?: string;

    // Notes
    applicantNotes?: string;
    adminNotes?: string;
}

export interface LeaseRating {
    companyName: string;
    overallRating: number; // out of 5
    totalReviews: number;
    successfulLeases: number;
    averageApprovalTime: string; // e.g., "3-5 days"
    interestRateRange: {
        min: number;
        max: number;
    };
    testimonials: Testimonial[];
}

export interface Testimonial {
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
    vehicleType: string;
}

export interface Branch {
    id: string;
    name: string;
    location: Location;
    address: string;
    contactNumber: string;
    email: string;
    managerName: string;
    status: "active" | "inactive";
    openingHours?: string;
}

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: "super-admin" | "admin" | "branch-manager" | "ad-manager";
    branchId?: string; // For branch managers
}

export interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string; // In production, this would be hashed
    createdAt: string;
    status: "active" | "suspended";
    isAdmin?: boolean;
    role?: "super-admin" | "admin" | "branch-manager" | "ad-manager";
    branchId?: string; // For branch managers
}

export interface DashboardStats {
    totalVehicles: number;
    pendingVehicles: number;
    approvedVehicles: number;
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    totalUsers: number;
    totalBranches: number;
    totalRevenue: number;
    monthlyRevenue: number;
}

export interface LeaseSettings {
    minInterestRate: number;
    maxInterestRate: number;
    defaultInterestRate: number;
    minLoanDuration: number; // months
    maxLoanDuration: number; // months
    minDownPaymentPercentage: number;
    processingFee: number;
    companyName: string;
    companyEmail: string;
    companyPhone: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: "ad_rejected" | "ad_approved" | "ad_pending";
    title: string;
    message: string;
    vehicleId?: string;
    vehicleTitle?: string;
    rejectionReason?: string;
    read: boolean;
    createdAt: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderEmail: string;
    receiverId: string;
    receiverName: string;
    receiverEmail: string;
    vehicleId: string;
    vehicleTitle: string;
    content: string;
    read: boolean;
    createdAt: string;
}

export interface Conversation {
    id: string;
    participants: {
        userId: string;
        userName: string;
        userEmail: string;
    }[];
    vehicleId: string;
    vehicleTitle: string;
    lastMessage?: string;
    lastMessageAt?: string;
    unreadCount: number;
    createdAt: string;
}