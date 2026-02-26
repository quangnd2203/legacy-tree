/**
 * GenealogyConfig — Shared configuration for the LegacyTree genealogy domain.
 * All magic strings, magic numbers, and business constants live here.
 * Components and use-cases MUST import from this file instead of hardcoding.
 */
import type { Profile } from '../../domain/profiles/Profile';

// ─── Clan Metadata (Legacy / Fallback) ────────────────────────────────────
// @deprecated Since Sprint 4: These static values are superseded by the
// dynamic `clan_settings` table. Use `useClanSettingsContext()` instead.
// Kept only as emergency fallback in case the DB row is missing.
/** @deprecated Use clanSettings.clan_name from ClanSettingsContext */
export const CLAN_NAME = 'Nguyễn Đăng Tộc';
/** @deprecated Use clanSettings.clan_name from ClanSettingsContext */
export const CLAN_MOTTO = 'Lưu Truyền Vạn Đời';
/** @deprecated Use clanSettings.book_title from ClanSettingsContext */
export const BOOK_TITLE = 'SÁCH GIA PHẢ';
export const BOOK_FOOTER = 'Gia phả bất tận • Phúc lộc trường tồn';
export const NO_DESCENDANTS_TEXT = 'Hệ phả chưa ghi nhận thông tin hậu duệ.';

// ─── Vietnamese Ordinal Number System (1–10) ───────────────────────────────
// Used for seniority titles: Nhất/Nhị/Tam/Tứ... Lang, Nhất Nương...
export const VI_ORDINAL_NUMBERS: readonly string[] = [
    'Nhất', 'Nhị', 'Tam', 'Tứ', 'Ngũ',
    'Lục', 'Thất', 'Bát', 'Cửu', 'Thập',
];

// ─── Rank Suffix by Gender ─────────────────────────────────────────────────
// "Nhất Lang" for males, "Nhất Nương" for females
export const RANK_SUFFIX = {
    Male: 'Lang',
    Female: 'Nương',
    Other: 'Con',
} as const;

// ─── Special Title Labels ──────────────────────────────────────────────────
export const TITLE_LABELS = {
    ROOT_ANCESTOR: 'Thủy Tổ',    // Generation 1 head
    FALLBACK: 'Hậu duệ',          // When rank cannot be determined
    UNKNOWN_YEAR: '',
    UNKNOWN_DATE: '',
    UNKNOWN_PARENTS: '...',
    UNKNOWN_ANNIVERSARY: 'Chưa cập nhật',
    ALIVE: 'Còn sống',
    DECEASED: 'Đã mất',
} as const;

// ─── Head-of-Household Priority Weights ────────────────────────────────────
// Higher score = more likely to be the HEAD of a family unit.
// Governed by traditional Vietnamese patrilineal lineage convention.
export const HEAD_PRIORITY_WEIGHTS = {
    BLOODLINE: 1000,   // Has a father_id (internal bloodline member) vs. in-law
    MALE_GENDER: 100,  // Traditional patriarchal convention
    SENIORITY_BASE: 2100, // Subtract year from birth_date from this for seniority score
    SENIORITY_DIVISOR: 100,
} as const;

// ─── Fallback Values ───────────────────────────────────────────────────────
export const FALLBACK_YEAR = 9999; // Used for sorting when birth date is unknown

// ─── Dual-Date Display Helper ───────────────────────────────────────────────
// Priority: birth_date_lunar (Âm lịch, nhập tay) → birth_date (Dương lịch, ISO)
// NOTE: Solar-to-Lunar auto-conversion is an Optional/Future feature. Not implemented yet.
export type BirthDateDisplay = {
    value: string;
    type: 'lunar' | 'solar';
    label: string; // "Âm lịch" or "Dương lịch"
};

export function getDisplayBirthDate(
    profile: Pick<Profile, 'birth_date' | 'birth_date_lunar'>
): BirthDateDisplay | null {
    if (profile.birth_date_lunar) {
        return { value: profile.birth_date_lunar, type: 'lunar', label: 'Âm lịch' };
    }
    if (profile.birth_date) {
        return { value: profile.birth_date, type: 'solar', label: 'Dương lịch' };
    }
    return null;
}
