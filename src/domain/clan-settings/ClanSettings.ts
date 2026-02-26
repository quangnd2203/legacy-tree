// src/domain/clan-settings/ClanSettings.ts
// Domain model — NO framework imports

export interface ClanSettings {
    id: string;

    // Định danh dòng họ
    clan_name: string;
    branch_name?: string | null;       // Phái
    sub_branch_name?: string | null;   // Chi

    // Quê quán
    hometown_village?: string | null;
    hometown_commune?: string | null;
    hometown_district?: string | null;
    hometown_province?: string | null;

    // Thông tin cuốn phả
    book_title?: string | null;
    book_compiled_year?: string | null;
    book_compiler_name?: string | null;
    generation_display_offset?: number | null;

    // Lời tựa (HTML đã sanitize)
    preface_poem?: string | null;

    updated_at?: string;
    updated_by?: string | null;
}

// id is optional: if passed (e.g. from hook's cached settings), 
// the repository uses it directly and skips a second get() round-trip.
export type UpdateClanSettingsDto = Partial<Omit<ClanSettings, 'updated_at' | 'updated_by'>>;
