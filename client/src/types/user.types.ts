import { WasteType } from "./garbage.types";

export interface Location {
    address: string;
    latitude?: number;
    longitude?: number;
}

export type USER_ROLES_TYPE = 'customer' | 'driver' | 'dealer';
export interface User {
    _id: string
    name: string
    email: string
    phone: string
    password: string
    role: USER_ROLES_TYPE
    location?: Location

    // for customer
    walletBalance?: number

    // for dealer
    dealerTypes?: WasteType[]

    // for driver
    driverStatus?: 'available' | 'busy' | 'offline'

    createdAt: string;
    updatedAt: string;
}

export interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'customer' | 'driver' | 'dealer';
    location: Location;
    dealerTypes?: ('ewaste' | 'plastic' | 'PET')[];
}

export interface LoginData {
  email: string;
  password: string;
}