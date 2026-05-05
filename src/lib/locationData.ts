// Sri Lankan Location Data Structure
// Complete hierarchy: Provinces → Districts → Towns

export interface Town {
    name: string;
    coordinates?: { lat: number; lng: number };
}

export interface District {
    name: string;
    towns: Town[];
    coordinates?: { lat: number; lng: number };
}

export interface Province {
    name: string;
    districts: District[];
}

export const sriLankanLocations: Province[] = [
    {
        name: "Western Province",
        districts: [
            {
                name: "Colombo District",
                coordinates: { lat: 6.9271, lng: 79.8612 },
                towns: [
                    { name: "Colombo", coordinates: { lat: 6.9271, lng: 79.8612 } },
                    { name: "Dehiwala", coordinates: { lat: 6.8517, lng: 79.8650 } },
                    { name: "Mount Lavinia", coordinates: { lat: 6.8381, lng: 79.8637 } },
                    { name: "Moratuwa", coordinates: { lat: 6.7730, lng: 79.8816 } },
                    { name: "Kotte", coordinates: { lat: 6.8905, lng: 79.9046 } },
                    { name: "Maharagama", coordinates: { lat: 6.8481, lng: 79.9265 } },
                    { name: "Homagama", coordinates: { lat: 6.8444, lng: 80.0025 } },
                    { name: "Avissawella", coordinates: { lat: 6.9522, lng: 80.2097 } },
                    { name: "Piliyandala", coordinates: { lat: 6.8014, lng: 79.9227 } },
                ],
            },
            {
                name: "Gampaha District",
                coordinates: { lat: 7.0873, lng: 80.0143 },
                towns: [
                    { name: "Gampaha", coordinates: { lat: 7.0873, lng: 80.0143 } },
                    { name: "Negombo", coordinates: { lat: 7.2083, lng: 79.8358 } },
                    { name: "Kelaniya", coordinates: { lat: 6.9553, lng: 79.9219 } },
                    { name: "Wattala", coordinates: { lat: 6.9889, lng: 79.8917 } },
                    { name: "Ja-Ela", coordinates: { lat: 7.0747, lng: 79.8919 } },
                    { name: "Minuwangoda", coordinates: { lat: 7.1714, lng: 79.9531 } },
                    { name: "Mirigama", coordinates: { lat: 7.2420, lng: 80.1222 } },
                    { name: "Kiribathgoda", coordinates: { lat: 6.9789, lng: 79.9292 } },
                    { name: "Kadawatha", coordinates: { lat: 7.0017, lng: 79.9533 } },
                ],
            },
            {
                name: "Kalutara District",
                coordinates: { lat: 6.5854, lng: 79.9607 },
                towns: [
                    { name: "Kalutara", coordinates: { lat: 6.5854, lng: 79.9607 } },
                    { name: "Panadura", coordinates: { lat: 6.7133, lng: 79.9025 } },
                    { name: "Horana", coordinates: { lat: 6.7156, lng: 80.0631 } },
                    { name: "Mathugama", coordinates: { lat: 6.5286, lng: 80.1339 } },
                    { name: "Beruwala", coordinates: { lat: 6.4789, lng: 79.9828 } },
                    { name: "Aluthgama", coordinates: { lat: 6.4267, lng: 80.0014 } },
                    { name: "Agalawatta", coordinates: { lat: 6.5656, lng: 80.0581 } },
                    { name: "Bandaragama", coordinates: { lat: 6.7111, lng: 79.9889 } },
                ],
            },
        ],
    },
    {
        name: "Central Province",
        districts: [
            {
                name: "Kandy District",
                coordinates: { lat: 7.2906, lng: 80.6337 },
                towns: [
                    { name: "Kandy", coordinates: { lat: 7.2906, lng: 80.6337 } },
                    { name: "Peradeniya", coordinates: { lat: 7.2633, lng: 80.5939 } },
                    { name: "Gampola", coordinates: { lat: 7.1644, lng: 80.5764 } },
                    { name: "Nawalapitiya", coordinates: { lat: 7.0539, lng: 80.5347 } },
                    { name: "Katugastota", coordinates: { lat: 7.3236, lng: 80.6281 } },
                    { name: "Digana", coordinates: { lat: 7.2667, lng: 80.7833 } },
                    { name: "Kundasale", coordinates: { lat: 7.2978, lng: 80.6814 } },
                ],
            },
            {
                name: "Matale District",
                coordinates: { lat: 7.4675, lng: 80.6234 },
                towns: [
                    { name: "Matale", coordinates: { lat: 7.4675, lng: 80.6234 } },
                    { name: "Dambulla", coordinates: { lat: 7.8608, lng: 80.6517 } },
                    { name: "Sigiriya", coordinates: { lat: 7.9569, lng: 80.7603 } },
                    { name: "Galewela", coordinates: { lat: 7.7522, lng: 80.5700 } },
                    { name: "Ukuwela", coordinates: { lat: 7.4431, lng: 80.7058 } },
                ],
            },
            {
                name: "Nuwara Eliya District",
                coordinates: { lat: 6.9497, lng: 80.7891 },
                towns: [
                    { name: "Nuwara Eliya", coordinates: { lat: 6.9497, lng: 80.7891 } },
                    { name: "Hatton", coordinates: { lat: 6.8917, lng: 80.5950 } },
                    { name: "Talawakele", coordinates: { lat: 6.9392, lng: 80.6558 } },
                    { name: "Nanu Oya", coordinates: { lat: 6.9456, lng: 80.7647 } },
                    { name: "Ragala", coordinates: { lat: 7.0550, lng: 80.8081 } },
                    { name: "Ginigathena", coordinates: { lat: 7.0272, lng: 80.5403 } },
                ],
            },
        ],
    },
    {
        name: "Southern Province",
        districts: [
            {
                name: "Galle District",
                coordinates: { lat: 6.0535, lng: 80.2210 },
                towns: [
                    { name: "Galle", coordinates: { lat: 6.0535, lng: 80.2210 } },
                    { name: "Hikkaduwa", coordinates: { lat: 6.1408, lng: 80.1033 } },
                    { name: "Ambalangoda", coordinates: { lat: 6.2358, lng: 80.0539 } },
                    { name: "Elpitiya", coordinates: { lat: 6.2919, lng: 80.1639 } },
                    { name: "Karapitiya", coordinates: { lat: 6.0658, lng: 80.2403 } },
                    { name: "Baddegama", coordinates: { lat: 6.1869, lng: 80.2003 } },
                    { name: "Bentota", coordinates: { lat: 6.4258, lng: 79.9953 } },
                ],
            },
            {
                name: "Matara District",
                coordinates: { lat: 5.9549, lng: 80.5550 },
                towns: [
                    { name: "Matara", coordinates: { lat: 5.9549, lng: 80.5550 } },
                    { name: "Weligama", coordinates: { lat: 5.9700, lng: 80.4297 } },
                    { name: "Dikwella", coordinates: { lat: 5.9667, lng: 80.6833 } },
                    { name: "Akuressa", coordinates: { lat: 6.1014, lng: 80.4869 } },
                    { name: "Kamburupitiya", coordinates: { lat: 6.0614, lng: 80.5275 } },
                    { name: "Hakmana", coordinates: { lat: 6.1167, lng: 80.6167 } },
                    { name: "Deniyaya", coordinates: { lat: 6.3500, lng: 80.5500 } },
                ],
            },
            {
                name: "Hambantota District",
                coordinates: { lat: 6.1429, lng: 81.1212 },
                towns: [
                    { name: "Hambantota", coordinates: { lat: 6.1429, lng: 81.1212 } },
                    { name: "Tangalle", coordinates: { lat: 6.0237, lng: 80.7969 } },
                    { name: "Tissamaharama", coordinates: { lat: 6.2833, lng: 81.2833 } },
                    { name: "Ambalantota", coordinates: { lat: 6.1228, lng: 81.0289 } },
                    { name: "Beliatta", coordinates: { lat: 6.0500, lng: 80.7333 } },
                    { name: "Weeraketiya", coordinates: { lat: 6.1167, lng: 80.8667 } },
                ],
            },
        ],
    },
    {
        name: "Northern Province",
        districts: [
            {
                name: "Jaffna District",
                coordinates: { lat: 9.6615, lng: 80.0255 },
                towns: [
                    { name: "Jaffna", coordinates: { lat: 9.6615, lng: 80.0255 } },
                    { name: "Chavakachcheri", coordinates: { lat: 9.6667, lng: 80.1667 } },
                    { name: "Point Pedro", coordinates: { lat: 9.8167, lng: 80.2333 } },
                    { name: "Nallur", coordinates: { lat: 9.6667, lng: 80.0333 } },
                    { name: "Chunnakam", coordinates: { lat: 9.7167, lng: 80.0333 } },
                    { name: "Kodikamam", coordinates: { lat: 9.7500, lng: 80.1167 } },
                ],
            },
            {
                name: "Kilinochchi District",
                coordinates: { lat: 9.3833, lng: 80.4000 },
                towns: [
                    { name: "Kilinochchi", coordinates: { lat: 9.3833, lng: 80.4000 } },
                    { name: "Paranthan", coordinates: { lat: 9.3667, lng: 80.3833 } },
                    { name: "Pooneryn", coordinates: { lat: 9.4667, lng: 80.2167 } },
                    { name: "Pallai", coordinates: { lat: 9.4333, lng: 80.3500 } },
                ],
            },
            {
                name: "Mannar District",
                coordinates: { lat: 8.9808, lng: 79.9042 },
                towns: [
                    { name: "Mannar", coordinates: { lat: 8.9808, lng: 79.9042 } },
                    { name: "Talaimannar", coordinates: { lat: 9.1167, lng: 79.7167 } },
                    { name: "Nanattan", coordinates: { lat: 9.0000, lng: 80.0667 } },
                    { name: "Pesalai", coordinates: { lat: 9.0167, lng: 79.8667 } },
                ],
            },
            {
                name: "Vavuniya District",
                coordinates: { lat: 8.7514, lng: 80.4971 },
                towns: [
                    { name: "Vavuniya", coordinates: { lat: 8.7514, lng: 80.4971 } },
                    { name: "Cheddikulam", coordinates: { lat: 8.9667, lng: 80.5000 } },
                    { name: "Nedunkeni", coordinates: { lat: 8.7667, lng: 80.3333 } },
                ],
            },
            {
                name: "Mullaitivu District",
                coordinates: { lat: 9.2672, lng: 80.8142 },
                towns: [
                    { name: "Mullaitivu", coordinates: { lat: 9.2672, lng: 80.8142 } },
                    { name: "Puthukudiyiruppu", coordinates: { lat: 9.2500, lng: 80.7833 } },
                    { name: "Mankulam", coordinates: { lat: 9.0500, lng: 80.6667 } },
                    { name: "Mallavi", coordinates: { lat: 9.1833, lng: 80.5667 } },
                ],
            },
        ],
    },
    {
        name: "Eastern Province",
        districts: [
            {
                name: "Trincomalee District",
                coordinates: { lat: 8.5874, lng: 81.2152 },
                towns: [
                    { name: "Trincomalee", coordinates: { lat: 8.5874, lng: 81.2152 } },
                    { name: "Kantale", coordinates: { lat: 8.3500, lng: 81.0167 } },
                    { name: "Kinniya", coordinates: { lat: 8.5000, lng: 81.1833 } },
                    { name: "Mutur", coordinates: { lat: 8.4667, lng: 81.2833 } },
                    { name: "Nilaveli", coordinates: { lat: 8.7000, lng: 81.1833 } },
                ],
            },
            {
                name: "Batticaloa District",
                coordinates: { lat: 7.7310, lng: 81.6747 },
                towns: [
                    { name: "Batticaloa", coordinates: { lat: 7.7310, lng: 81.6747 } },
                    { name: "Kattankudy", coordinates: { lat: 7.6833, lng: 81.7167 } },
                    { name: "Eravur", coordinates: { lat: 7.7833, lng: 81.6000 } },
                    { name: "Valaichchenai", coordinates: { lat: 7.9167, lng: 81.5667 } },
                    { name: "Kalkudah", coordinates: { lat: 7.9167, lng: 81.5833 } },
                ],
            },
            {
                name: "Ampara District",
                coordinates: { lat: 7.2975, lng: 81.6681 },
                towns: [
                    { name: "Ampara", coordinates: { lat: 7.2975, lng: 81.6681 } },
                    { name: "Kalmunai", coordinates: { lat: 7.4167, lng: 81.8333 } },
                    { name: "Akkaraipattu", coordinates: { lat: 7.2167, lng: 81.8500 } },
                    { name: "Sammanthurai", coordinates: { lat: 7.3667, lng: 81.8333 } },
                    { name: "Pothuvil", coordinates: { lat: 6.8833, lng: 81.8333 } },
                    { name: "Dehiattakandiya", coordinates: { lat: 7.8500, lng: 81.1667 } },
                ],
            },
        ],
    },
    {
        name: "North Western Province",
        districts: [
            {
                name: "Kurunegala District",
                coordinates: { lat: 7.4863, lng: 80.3647 },
                towns: [
                    { name: "Kurunegala", coordinates: { lat: 7.4863, lng: 80.3647 } },
                    { name: "Kuliyapitiya", coordinates: { lat: 7.4697, lng: 80.0403 } },
                    { name: "Pannala", coordinates: { lat: 7.3333, lng: 80.0000 } },
                    { name: "Narammala", coordinates: { lat: 7.4333, lng: 80.2000 } },
                    { name: "Polgahawela", coordinates: { lat: 7.3333, lng: 80.3000 } },
                    { name: "Wariyapola", coordinates: { lat: 7.6167, lng: 80.2500 } },
                    { name: "Nikaweratiya", coordinates: { lat: 7.7500, lng: 80.1167 } },
                    { name: "Giriulla", coordinates: { lat: 7.3167, lng: 80.1333 } },
                ],
            },
            {
                name: "Puttalam District",
                coordinates: { lat: 8.0362, lng: 79.8283 },
                towns: [
                    { name: "Puttalam", coordinates: { lat: 8.0362, lng: 79.8283 } },
                    { name: "Chilaw", coordinates: { lat: 7.5756, lng: 79.7953 } },
                    { name: "Wennappuwa", coordinates: { lat: 7.3500, lng: 79.8333 } },
                    { name: "Dankotuwa", coordinates: { lat: 7.3167, lng: 79.8833 } },
                    { name: "Kalpitiya", coordinates: { lat: 8.2333, lng: 79.7667 } },
                    { name: "Marawila", coordinates: { lat: 7.4500, lng: 79.8333 } },
                    { name: "Anamaduwa", coordinates: { lat: 8.0167, lng: 79.9833 } },
                ],
            },
        ],
    },
    {
        name: "North Central Province",
        districts: [
            {
                name: "Anuradhapura District",
                coordinates: { lat: 8.3114, lng: 80.4037 },
                towns: [
                    { name: "Anuradhapura", coordinates: { lat: 8.3114, lng: 80.4037 } },
                    { name: "Kekirawa", coordinates: { lat: 8.0333, lng: 80.6000 } },
                    { name: "Mihintale", coordinates: { lat: 8.3500, lng: 80.5167 } },
                    { name: "Tambuttegama", coordinates: { lat: 8.0833, lng: 80.3000 } },
                    { name: "Galenbindunuwewa", coordinates: { lat: 8.2000, lng: 80.5000 } },
                    { name: "Eppawala", coordinates: { lat: 8.1833, lng: 80.4667 } },
                    { name: "Medawachchiya", coordinates: { lat: 9.1167, lng: 80.5000 } },
                ],
            },
            {
                name: "Polonnaruwa District",
                coordinates: { lat: 7.9403, lng: 81.0188 },
                towns: [
                    { name: "Polonnaruwa", coordinates: { lat: 7.9403, lng: 81.0188 } },
                    { name: "Hingurakgoda", coordinates: { lat: 8.0333, lng: 80.9667 } },
                    { name: "Kaduruwela", coordinates: { lat: 7.9667, lng: 81.0167 } },
                    { name: "Medirigiriya", coordinates: { lat: 8.1667, lng: 80.9500 } },
                    { name: "Welikanda", coordinates: { lat: 7.7167, lng: 81.1833 } },
                ],
            },
        ],
    },
    {
        name: "Uva Province",
        districts: [
            {
                name: "Badulla District",
                coordinates: { lat: 6.9934, lng: 81.0550 },
                towns: [
                    { name: "Badulla", coordinates: { lat: 6.9934, lng: 81.0550 } },
                    { name: "Bandarawela", coordinates: { lat: 6.8333, lng: 80.9833 } },
                    { name: "Haputale", coordinates: { lat: 6.7667, lng: 80.9667 } },
                    { name: "Ella", coordinates: { lat: 6.8667, lng: 81.0467 } },
                    { name: "Welimada", coordinates: { lat: 6.9000, lng: 80.9167 } },
                    { name: "Mahiyanganaya", coordinates: { lat: 7.3333, lng: 81.0000 } },
                    { name: "Diyatalawa", coordinates: { lat: 6.8167, lng: 80.9333 } },
                    { name: "Passara", coordinates: { lat: 6.8833, lng: 81.2167 } },
                ],
            },
            {
                name: "Monaragala District",
                coordinates: { lat: 6.8728, lng: 81.3506 },
                towns: [
                    { name: "Monaragala", coordinates: { lat: 6.8728, lng: 81.3506 } },
                    { name: "Wellawaya", coordinates: { lat: 6.7333, lng: 81.1000 } },
                    { name: "Kataragama", coordinates: { lat: 6.4136, lng: 81.3344 } },
                    { name: "Bibile", coordinates: { lat: 7.1667, lng: 81.2167 } },
                    { name: "Buttala", coordinates: { lat: 6.7500, lng: 81.2333 } },
                    { name: "Siyambalanduwa", coordinates: { lat: 6.8167, lng: 81.5333 } },
                ],
            },
        ],
    },
    {
        name: "Sabaragamuwa Province",
        districts: [
            {
                name: "Ratnapura District",
                coordinates: { lat: 6.6828, lng: 80.4014 },
                towns: [
                    { name: "Ratnapura", coordinates: { lat: 6.6828, lng: 80.4014 } },
                    { name: "Embilipitiya", coordinates: { lat: 6.3406, lng: 80.8508 } },
                    { name: "Balangoda", coordinates: { lat: 6.6500, lng: 80.7000 } },
                    { name: "Pelmadulla", coordinates: { lat: 6.6167, lng: 80.5333 } },
                    { name: "Eheliyagoda", coordinates: { lat: 6.8500, lng: 80.2667 } },
                    { name: "Kuruwita", coordinates: { lat: 6.7167, lng: 80.3667 } },
                ],
            },
            {
                name: "Kegalle District",
                coordinates: { lat: 7.2513, lng: 80.3464 },
                towns: [
                    { name: "Kegalle", coordinates: { lat: 7.2513, lng: 80.3464 } },
                    { name: "Mawanella", coordinates: { lat: 7.2542, lng: 80.4408 } },
                    { name: "Rambukkana", coordinates: { lat: 7.3167, lng: 80.3833 } },
                    { name: "Warakapola", coordinates: { lat: 7.2167, lng: 80.2000 } },
                    { name: "Ruwanwella", coordinates: { lat: 7.0667, lng: 80.2500 } },
                    { name: "Yatiyanthota", coordinates: { lat: 7.0167, lng: 80.3000 } },
                ],
            },
        ],
    },
];

// Helper functions for location queries

export const getAllProvinces = (): string[] => {
    return sriLankanLocations.map((province) => province.name);
};

export const getDistrictsByProvince = (provinceName: string): string[] => {
    const province = sriLankanLocations.find((p) => p.name === provinceName);
    return province ? province.districts.map((d) => d.name) : [];
};

export const getTownsByDistrict = (
    provinceName: string,
    districtName: string
): string[] => {
    const province = sriLankanLocations.find((p) => p.name === provinceName);
    if (!province) return [];

    const district = province.districts.find((d) => d.name === districtName);
    return district ? district.towns.map((t) => t.name) : [];
};

export const getLocationCoordinates = (
    provinceName: string,
    districtName: string,
    townName: string
): { lat: number; lng: number } | null => {
    const province = sriLankanLocations.find((p) => p.name === provinceName);
    if (!province) return null;

    const district = province.districts.find((d) => d.name === districtName);
    if (!district) return null;

    const town = district.towns.find((t) => t.name === townName);
    return town?.coordinates || district.coordinates || null;
};

export const getDistrictCoordinates = (
    provinceName: string,
    districtName: string
): { lat: number; lng: number } | null => {
    const province = sriLankanLocations.find((p) => p.name === provinceName);
    if (!province) return null;

    const district = province.districts.find((d) => d.name === districtName);
    return district?.coordinates || null;
};
