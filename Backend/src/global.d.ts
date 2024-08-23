export interface PharmacyProperties {
    id: string;
    name: string;
    address: string;
    email: string;
    website?: string;
    Tel: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
    services: string[];
}

export interface Geometry {
    type: "Point";
    coordinates: [number, number];
}