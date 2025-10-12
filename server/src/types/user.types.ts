import {Document} from 'mongoose';

export interface ILocation {
    address: string;
    latitude?: number;
    longitude?: number;
}

export interface IUser {
    name: string
    email: string
    phone: string
    password: string
    role: 'customer' | 'driver' | 'dealer'
    location?: ILocation

    // for customer
    walletBalance?: number

    // for dealer
    dealerTypes?: ('ewaste' | 'plastic' | 'PET' )[]

    // for driver
    driverStatus?: 'available' | 'busy' | 'offline'
}

export interface IUserDocument extends IUser, Document {
    _id: string,
    comparePassword(candidatePassword: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}