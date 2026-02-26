// src/__tests__/genealogy.test.ts
// LT-407: Unit Tests for core genealogy business logic
// Run with: npx vitest run

import { describe, it, expect } from 'vitest';
import { processAncestryBook, sortProfilesByTraditionalSeniority } from '../application/genealogy-use-cases/ProcessAncestryBook';
import { getDisplayBirthDate } from '../shared/genealogy/GenealogyConfig';
import type { Profile } from '../domain/profiles/Profile';

// ─── Test Helpers ───────────────────────────────────────────────────────────

const makeProfile = (overrides: Partial<Profile> & { id: string; full_name: string }): Profile => ({
    status: 'Alive',
    ...overrides,
});

// ─── getDisplayBirthDate Tests ───────────────────────────────────────────────

describe('getDisplayBirthDate', () => {
    it('returns lunar date when birth_date_lunar is provided', () => {
        const profile = makeProfile({ id: '1', full_name: 'Test', birth_date_lunar: '15/4 Giáp Ngọ', birth_date: '1954-06-15' });
        const result = getDisplayBirthDate(profile);
        expect(result?.type).toBe('lunar');
        expect(result?.value).toBe('15/4 Giáp Ngọ');
        expect(result?.label).toBe('Âm lịch');
    });

    it('falls back to solar date when no lunar date is given', () => {
        const profile = makeProfile({ id: '1', full_name: 'Test', birth_date: '1990-05-20' });
        const result = getDisplayBirthDate(profile);
        expect(result?.type).toBe('solar');
        expect(result?.value).toBe('1990-05-20');
        expect(result?.label).toBe('Dương lịch');
    });

    it('returns null when both dates are absent', () => {
        const profile = makeProfile({ id: '1', full_name: 'Test' });
        expect(getDisplayBirthDate(profile)).toBeNull();
    });
});

// ─── sortProfilesByTraditionalSeniority Tests ────────────────────────────────

describe('sortProfilesByTraditionalSeniority', () => {
    it('places Male profiles before Female profiles', () => {
        const profiles: Profile[] = [
            makeProfile({ id: '1', full_name: 'Daughter', gender: 'Female', seniority_index: 1 }),
            makeProfile({ id: '2', full_name: 'Son', gender: 'Male', seniority_index: 2 }),
        ];
        const sorted = sortProfilesByTraditionalSeniority(profiles);
        expect(sorted[0].gender).toBe('Male');
        expect(sorted[1].gender).toBe('Female');
    });

    it('sorts by seniority_index before birth_date when gender is the same', () => {
        const profiles: Profile[] = [
            makeProfile({ id: '1', full_name: 'Tu Lang', gender: 'Male', seniority_index: 4, birth_date: '1950-01-01' }),
            makeProfile({ id: '2', full_name: 'Nhi Lang', gender: 'Male', seniority_index: 2, birth_date: '1962-01-01' }),
        ];
        const sorted = sortProfilesByTraditionalSeniority(profiles);
        expect(sorted[0].full_name).toBe('Nhi Lang');
        expect(sorted[1].full_name).toBe('Tu Lang');
    });

    it('falls back to birth_date when seniority_index is equal', () => {
        const profiles: Profile[] = [
            makeProfile({ id: '1', full_name: 'Younger', gender: 'Male', birth_date: '1990-01-01' }),
            makeProfile({ id: '2', full_name: 'Older', gender: 'Male', birth_date: '1960-01-01' }),
        ];
        const sorted = sortProfilesByTraditionalSeniority(profiles);
        expect(sorted[0].full_name).toBe('Older');
    });

    // LT-509: Regression tests

    it('treats null seniority_index as lowest rank (Infinity)', () => {
        const profiles: Profile[] = [
            makeProfile({ id: '1', full_name: 'No Rank', gender: 'Male', seniority_index: null }),
            makeProfile({ id: '2', full_name: 'Has Rank', gender: 'Male', seniority_index: 1 }),
        ];
        const sorted = sortProfilesByTraditionalSeniority(profiles);
        expect(sorted[0].full_name).toBe('Has Rank');
        expect(sorted[1].full_name).toBe('No Rank');
    });

    it('is stable when both seniority_index AND birth_date are null', () => {
        const profiles: Profile[] = [
            makeProfile({ id: '1', full_name: 'Alpha', gender: 'Male' }),
            makeProfile({ id: '2', full_name: 'Beta', gender: 'Male' }),
        ];
        // Should not throw, order doesn't matter but must be deterministic
        expect(() => sortProfilesByTraditionalSeniority(profiles)).not.toThrow();
    });

    it('sorts females among themselves by seniority_index', () => {
        const profiles: Profile[] = [
            makeProfile({ id: '1', full_name: 'Nhi Nuong', gender: 'Female', seniority_index: 2 }),
            makeProfile({ id: '2', full_name: 'Nhat Nuong', gender: 'Female', seniority_index: 1 }),
        ];
        const sorted = sortProfilesByTraditionalSeniority(profiles);
        expect(sorted[0].full_name).toBe('Nhat Nuong');
        expect(sorted[1].full_name).toBe('Nhi Nuong');
    });

    it('keeps Male group before Female group regardless of seniority_index values', () => {
        // Female with seniority_index=1 must still appear after Male with seniority_index=99
        const profiles: Profile[] = [
            makeProfile({ id: '1', full_name: 'First Daughter', gender: 'Female', seniority_index: 1 }),
            makeProfile({ id: '2', full_name: 'Last Son', gender: 'Male', seniority_index: 99 }),
        ];
        const sorted = sortProfilesByTraditionalSeniority(profiles);
        expect(sorted[0].gender).toBe('Male');
        expect(sorted[1].gender).toBe('Female');
    });
});

// ─── processAncestryBook Tests ──────────────────────────────────────────────

describe('processAncestryBook', () => {
    const ancestor = makeProfile({ id: 'a1', full_name: 'Cụ Tổ', gender: 'Male', birth_date: '1900-01-01' });
    const wife = makeProfile({ id: 'a2', full_name: 'Cụ Bà', gender: 'Female', partner_id: 'a1' });
    const son1 = makeProfile({ id: 's1', full_name: 'Con Trai 1', gender: 'Male', father_id: 'a1', seniority_index: 1, birth_date: '1930-01-01' });
    const son1Wife = makeProfile({ id: 's1w', full_name: 'Dâu 1', gender: 'Female', partner_id: 's1' });
    const son2 = makeProfile({ id: 's2', full_name: 'Con Trai 2', gender: 'Male', father_id: 'a1', seniority_index: 2, birth_date: '1935-01-01' });
    const son2Wife = makeProfile({ id: 's2w', full_name: 'Dâu 2', gender: 'Female', partner_id: 's2' });
    const daughter = makeProfile({ id: 'd1', full_name: 'Con Gái 1', gender: 'Female', father_id: 'a1', seniority_index: 1, birth_date: '1928-01-01' });
    const grandchild = makeProfile({ id: 'g1', full_name: 'Cháu Nội 1', gender: 'Male', father_id: 's1', birth_date: '1960-01-01' });

    it('creates a FamilyUnit for the root ancestor', () => {
        const units = processAncestryBook([ancestor]);
        expect(units.length).toBeGreaterThanOrEqual(1);
        expect(units[0].head.id).toBe('a1');
    });

    it('does NOT create a standalone household for a daughter with a father in the system', () => {
        const units = processAncestryBook([ancestor, wife, son1, son1Wife, daughter]);
        const daughterUnit = units.find(u => u.head.id === 'd1');
        expect(daughterUnit).toBeUndefined();
    });

    it('sorts household units within the same generation by seniority_index', () => {
        const profiles = [ancestor, wife, son1, son1Wife, son2, son2Wife];
        const units = processAncestryBook(profiles);
        const gen2Units = units.filter(u => u.generation === 2);
        expect(gen2Units[0].head.full_name).toBe('Con Trai 1');
        expect(gen2Units[1].head.full_name).toBe('Con Trai 2');
    });

    it('assigns correct generation numbers', () => {
        const profiles = [ancestor, wife, son1, son1Wife, grandchild];
        const units = processAncestryBook(profiles);
        const ancestorUnit = units.find(u => u.head.id === 'a1');
        const sonUnit = units.find(u => u.head.id === 's1');
        expect(ancestorUnit?.generation).toBe(1);
        expect(sonUnit?.generation).toBe(2);
    });

    it('includes partners in the correct FamilyUnit', () => {
        const ancestorUnit = processAncestryBook([ancestor, wife])[0];
        expect(ancestorUnit.partners.some(p => p.id === 'a2')).toBe(true);
    });
});
