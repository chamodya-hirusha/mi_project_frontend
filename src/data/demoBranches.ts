import { Branch } from "@/types";

export const demoBranches: Branch[] = [
    {
        id: "branch-1",
        name: "Colombo Head Office",
        location: {
            province: "Western Province",
            district: "Colombo District",
            town: "Colombo 03",
            coordinates: {
                lat: 6.9271,
                lng: 79.8612,
            },
        },
        address: "No. 123, Galle Road, Colombo 03",
        contactNumber: "011-2345678",
        email: "colombo@tradehub.lk",
        managerName: "Saman Perera",
        status: "active",
        openingHours: "Mon-Fri: 8:30 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM",
    },
    {
        id: "branch-2",
        name: "Gampaha Branch",
        location: {
            province: "Western Province",
            district: "Gampaha District",
            town: "Gampaha",
            coordinates: {
                lat: 7.0913,
                lng: 80.0081,
            },
        },
        address: "No. 45, Kandy Road, Gampaha",
        contactNumber: "033-2233445",
        email: "gampaha@tradehub.lk",
        managerName: "Kamal Gunaratne",
        status: "active",
        openingHours: "Mon-Fri: 8:30 AM - 5:00 PM",
    },
    {
        id: "branch-3",
        name: "Kandy Branch",
        location: {
            province: "Central Province",
            district: "Kandy District",
            town: "Kandy",
            coordinates: {
                lat: 7.2906,
                lng: 80.6337,
            },
        },
        address: "No. 89, Peradeniya Road, Kandy",
        contactNumber: "081-2233445",
        email: "kandy@tradehub.lk",
        managerName: "Nimal Bandara",
        status: "active",
        openingHours: "Mon-Fri: 8:30 AM - 5:00 PM, Sat: 9:00 AM - 12:00 PM",
    },
    {
        id: "branch-4",
        name: "Galle Branch",
        location: {
            province: "Southern Province",
            district: "Galle District",
            town: "Galle",
            coordinates: {
                lat: 6.0535,
                lng: 80.2210,
            },
        },
        address: "No. 22, Matara Road, Galle",
        contactNumber: "091-2233445",
        email: "galle@tradehub.lk",
        managerName: "Sunil Silva",
        status: "active",
        openingHours: "Mon-Fri: 8:30 AM - 5:00 PM",
    },
    {
        id: "branch-5",
        name: "Kurunegala Branch",
        location: {
            province: "North Western Province",
            district: "Kurunegala District",
            town: "Kurunegala",
            coordinates: {
                lat: 7.4813,
                lng: 80.3654,
            },
        },
        address: "No. 15, Negombo Road, Kurunegala",
        contactNumber: "037-2233445",
        email: "kurunegala@tradehub.lk",
        managerName: "Chathura Liyanage",
        status: "active",
        openingHours: "Mon-Fri: 8:30 AM - 5:00 PM",
    },
];
