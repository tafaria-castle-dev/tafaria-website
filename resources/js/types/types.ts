export type BoardType = 'FB' | 'HB' | 'BB';
export type Residency = 'East African Resident' | 'Nonresident';
export type TabType = 'experiences' | 'recreation';

export interface Room {
    id: string;
    name: string;
    description: string;
    number_of_rooms: number;
    rates: {
        single: {
            bnb: { kshs: number; usd: number };
            half_board: { kshs: number; usd: number };
            full_board: { kshs: number; usd: number };
        };
        double: {
            bnb: { kshs: number; usd: number };
            half_board: { kshs: number; usd: number };
            full_board: { kshs: number; usd: number };
        };
    };
    created_at: string;
    updated_at: string;
}

export interface AdditionalDetailRecord {
    opening_hours?: string;
    what_to_carry?: string;
    how_to_get_here_description?: string;
}

export interface LeisureRoom {
    id: string;
    name: string;
    description: string;
    number_of_rooms: number;
    rates: {
        single: {
            bnb: { kshs: number; usd: number };
            half_board: { kshs: number; usd: number };
            full_board: { kshs: number; usd: number };
        };
        double: {
            bnb: { kshs: number; usd: number };
            half_board: { kshs: number; usd: number };
            full_board: { kshs: number; usd: number };
        };
    };
    created_at: string;
    updated_at: string;
}

export interface Meal {
    id: string;
    name: string;
    description: string;
    child_rate_kshs: number;
    child_rate_usd: number;
    adult_rate_kshs: number;
    adult_rate_usd: number;
    created_at: string;
    updated_at: string;
}

export interface ConferencePackage {
    id: string;
    name: string;
    description: string;
    rate_kshs: number;
    rate_usd: number;
    created_at: string;
    updated_at: string;
}

export interface LeisureExperience {
    id: number;
    title: string;
    description: string | null;
    image_url: string | null;
    price_adults: number | null;
    price_kids: number | null;
}

export interface RatesDescription {
    id: number;
    description: string;
    audio_url: string | null;
    type: string;
}

export interface ChildPolicy {
    age: string;
    sharing: string;
    nonSharing: string;
}

export interface Supplement {
    type: string;
    KES: number;
    USD: number;
}
