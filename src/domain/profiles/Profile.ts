export type ProfileStatus = 'Alive' | 'Deceased';
export type ProfileGender = 'Male' | 'Female' | 'Other';

export interface Profile {
    id: string;
    full_name: string;
    birth_date?: string | null; // Solar date
    birth_date_lunar?: string | null; // Lunar date (text)
    birth_time?: string | null; // Solar time
    status: ProfileStatus;
    image_url?: string | null;
    death_anniversary?: string | null; // Lunar (text)
    grave_location_coords?: string | null;
    grave_image_url?: string | null;
    phone_number?: string | null;
    father_id?: string | null;
    partner_id?: string | null;
    gender?: ProfileGender | null;
    seniority_index?: number | null; // Traditional rank (1=Firstborn, etc.)
    created_at?: string;
}

export type CreateProfileDto = Omit<Profile, 'id' | 'created_at'>;
export type UpdateProfileDto = Partial<CreateProfileDto>;
