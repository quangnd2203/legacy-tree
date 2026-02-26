// src/presentation/components/profile-form/types.ts
// Shared types cho tất cả Fieldset components trong ProfileForm.
// Tách riêng để tránh circular imports.

import type { ProfileStatus, ProfileGender, Profile } from '@domain/profiles/Profile';

/**
 * Dữ liệu form — mirror CreateProfileDto + status.
 * Dùng chung cho tất cả Fieldsets.
 */
export interface ProfileFormData {
    full_name: string;
    birth_date: string | null;
    birth_time: string | null;
    birth_date_lunar: string | null;
    status: ProfileStatus;
    image_url: string | null;
    phone_number: string;
    death_anniversary: string | null;
    grave_location_coords: string | null;
    grave_image_url: string | null;
    father_id: string | null;
    partner_id: string | null;
    gender: ProfileGender;
    seniority_index: number | null;
}

/**
 * Props cơ bản mà mọi Fieldset đều nhận.
 */
export interface FieldsetProps {
    formData: ProfileFormData;
    onChange: (updates: Partial<ProfileFormData>) => void;
}

/**
 * Props mở rộng cho Fieldset cần danh sách profiles (Lineage).
 */
export interface LineageFieldsetProps extends FieldsetProps {
    allProfiles: Profile[];
    fetching: boolean;
    onFatherChange: (fatherId: string | null) => void;
}

/**
 * Props mở rộng cho Fieldset có image upload.
 */
export interface ImageFieldsetProps extends FieldsetProps {
    preview: string | null;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
