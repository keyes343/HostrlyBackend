export interface User_type {
    age?: number;
    googleID?: string;
    googleName?: string;
    username?: string;
    contactDetails?: {
        address: string;
        phone: string;
        neighbour?: {
            name: string;
            phone: number;
        };
    }
    foodPref?: { hates: {}; loves: {}; };
    paymentHist?: {};
    lastLogin?: {};
}