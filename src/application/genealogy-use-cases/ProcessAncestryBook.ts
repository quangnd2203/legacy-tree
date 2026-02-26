import { Profile } from '../../domain/profiles/Profile';
import {
    VI_ORDINAL_NUMBERS,
    RANK_SUFFIX,
    TITLE_LABELS,
    HEAD_PRIORITY_WEIGHTS,
    FALLBACK_YEAR,
} from '../../shared/genealogy/GenealogyConfig';

// ─── Domain Types ───────────────────────────────────────────────────────────

export interface FamilyUnit {
    head: Profile;
    partners: Profile[];
    children: Profile[];
    generation: number;
}

// ─── Pure Utility Functions ─────────────────────────────────────────────────
const getYearFromDate = (dateStr?: string | null): number => {
    if (!dateStr) return FALLBACK_YEAR;
    const year = new Date(dateStr).getFullYear();
    return isNaN(year) ? FALLBACK_YEAR : year;
};

/**
 * Traditional Vietnamese sorting:
 * 1. Gender: Male (0), Female (1), Other (2)
 * 2. Seniority: Older (smaller birth year) first.
 */
/**
 * Sorts profiles using traditional Vietnamese seniority rules:
 * 1. Gender: Male (0) before Female (1) before Other (2)
 * 2. Seniority Index: Lower index = more senior (Manual override field)
 * 3. Birth year: Older (lower year) first (Fallback when index is equal or absent)
 *
 * Used for both sibling ordering within a family unit AND unit ordering within a generation.
 */
export function sortProfilesByTraditionalSeniority(profiles: Profile[]): Profile[] {
    const genderOrder: Record<string, number> = { Male: 0, Female: 1, Other: 2 };
    return [...profiles].sort((a, b) => {
        // 1. Gender check
        const ga = genderOrder[a.gender ?? 'Other'] ?? 2;
        const gb = genderOrder[b.gender ?? 'Other'] ?? 2;
        if (ga !== gb) return ga - gb;

        // 2. Seniority Index check (Manual override)
        const sa = a.seniority_index ?? 999;
        const sb = b.seniority_index ?? 999;
        if (sa !== sb) return sa - sb;

        // 3. Age check (Fallback)
        return getYearFromDate(a.birth_date) - getYearFromDate(b.birth_date);
    });
}


/**
 * Returns the ordinal rank label for a profile based on their gender-ordered
 * position among their siblings (e.g. "Nhất Lang", "Nhị Nương").
 * Considers generation 1 as the Root Ancestor.
 */
export function getRankLabel(
    profile: Profile,
    allProfiles: Profile[],
    generation: number
): string {
    if (generation === 1) return TITLE_LABELS.ROOT_ANCESTOR;

    const father = allProfiles.find(p => p.id === profile.father_id);
    const siblings = father
        ? sortProfilesByTraditionalSeniority(allProfiles.filter(p => p.father_id === father.id))
        : [];

    const siblingsOfSameGender = siblings.filter(c => c.gender === profile.gender);
    const genderIdx = siblingsOfSameGender.findIndex(c => c.id === profile.id);

    const orderName =
        genderIdx !== -1
            ? VI_ORDINAL_NUMBERS[genderIdx] || (genderIdx + 1).toString()
            : '';

    if (!orderName) return TITLE_LABELS.FALLBACK;

    if (profile.gender === 'Male') return `${orderName} ${RANK_SUFFIX.Male}`;
    if (profile.gender === 'Female') return `${orderName} ${RANK_SUFFIX.Female}`;
    return TITLE_LABELS.FALLBACK;
}

/**
 * Returns the rank label for a child relative to their siblings within
 * a family unit (used in the children list of a unit).
 */
export function getChildRankLabel(child: Profile, siblings: Profile[]): string {
    const siblingsOfSameGender = siblings.filter(c => c.gender === child.gender);
    const genderIdx = siblingsOfSameGender.findIndex(c => c.id === child.id);
    const orderName =
        genderIdx !== -1
            ? VI_ORDINAL_NUMBERS[genderIdx] || (genderIdx + 1).toString()
            : '';

    if (child.gender === 'Male') return orderName ? `${orderName} ${RANK_SUFFIX.Male}` : TITLE_LABELS.FALLBACK;
    if (child.gender === 'Female') return orderName ? `${orderName} ${RANK_SUFFIX.Female}` : TITLE_LABELS.FALLBACK;
    return RANK_SUFFIX.Other;
}

/**
 * Returns the display names of a head's parents (father & mother).
 */
export function getParentNames(head: Profile, allProfiles: Profile[]): string {
    const father = allProfiles.find(p => p.id === head.father_id);
    const mother = allProfiles.find(
        p =>
            (p.partner_id === father?.id || father?.partner_id === p.id) &&
            p.id !== father?.id
    );
    if (father && mother) return `${father.full_name} & ${mother.full_name}`;
    return father?.full_name || mother?.full_name || TITLE_LABELS.UNKNOWN_PARENTS;
}

// ─── Priority Scoring ───────────────────────────────────────────────────────

function getPriority(p: Profile): number {
    let score = 0;
    if (p.father_id) score += HEAD_PRIORITY_WEIGHTS.BLOODLINE;
    if (p.gender === 'Male') score += HEAD_PRIORITY_WEIGHTS.MALE_GENDER;
    const birthYear = getYearFromDate(p.birth_date);
    score +=
        (HEAD_PRIORITY_WEIGHTS.SENIORITY_BASE - (birthYear === FALLBACK_YEAR ? HEAD_PRIORITY_WEIGHTS.SENIORITY_BASE : birthYear)) /
        HEAD_PRIORITY_WEIGHTS.SENIORITY_DIVISOR;
    return score;
}

// ─── Generation Calculation ─────────────────────────────────────────────────

/**
 * Builds a generation map (id → generation number) for all profiles.
 *
 * Algorithm:
 * - Root ancestors (no father_id and no blood-relative partner) get generation = 1.
 * - Each profile inherits generation = calcGen(father_id) + 1, computed recursively.
 * - Spouse propagation: A partner with no father_id inherits the generation of their
 *   blood-relative spouse, so married-in members appear on the same generation row.
 *
 * @param allProfiles Flat list of all profiles in the family tree.
 * @returns A record mapping each profile's id to its generation number (1-indexed).
 */
export function buildGenMap(allProfiles: Profile[]): Record<string, number> {
    const genMap: Record<string, number> = {};

    const calcGen = (id: string): number => {
        if (genMap[id] !== undefined) return genMap[id];
        const p = allProfiles.find(x => x.id === id);
        if (!p) return 0;
        if (!p.father_id) {
            genMap[id] = 1;
            return 1;
        }
        const g = calcGen(p.father_id) + 1;
        genMap[id] = g;
        return g;
    };

    allProfiles.forEach(p => calcGen(p.id));

    // Propagate generation to spouses who have no father_id
    allProfiles.forEach(p => {
        if (!p.father_id) {
            const partner = allProfiles.find(
                x => (x.partner_id === p.id || p.partner_id === x.id) && x.father_id
            );
            if (partner) genMap[p.id] = genMap[partner.id];
        }
    });

    return genMap;
}

// ─── Main Use-Case ──────────────────────────────────────────────────────────

/**
 * processAncestryBook — Core use-case for the Ancestry Book feature.
 *
 * Takes a flat list of profiles and returns a sorted list of FamilyUnits
 * ready for rendering, with correct generation numbers, head selection,
 * deduplication, and children lists.
 */
/**
 * processAncestryBook — Core use-case for the Ancestry Book feature.
 *
 * Takes a flat list of profiles and returns a sorted list of FamilyUnits
 * ready for rendering, with correct generation numbers, head selection,
 * deduplication, and children lists.
 *
 * Key rules enforced:
 * - **Head selection**: Within a couple, the profile with higher "priority score"
 *   (blood male = highest) becomes the household head to avoid duplicate pages.
 * - **Daughter exclusion**: Female profiles with a father_id do NOT become household
 *   heads — they are listed only in their father's children section (traditional rule).
 * - **Deduplication**: `familyKey` = sorted IDs of head + partners ensures each
 *   family group appears exactly once even if both members are candidates.
 * - **Sort order**: Units are sorted by generation, then by traditional seniority
 *   (Gender > Seniority Index > Birth Year) within each generation.
 *
 * @param allProfiles Flat list of all profiles fetched from the database.
 * @returns Sorted array of FamilyUnit objects ready for the AncestryBook component.
 */
export function processAncestryBook(allProfiles: Profile[]): FamilyUnit[] {
    const genMap = buildGenMap(allProfiles);

    const candidates = allProfiles.filter(p => {
        // Traditional rule: Daughters (Female with a father in the lineage) 
        // usually do not start a new household unit in the father's ancestry book.
        if (p.gender === 'Female' && p.father_id) return false;

        const hasChildren = allProfiles.some(x => x.father_id === p.id);
        const hasPartner = p.partner_id || allProfiles.some(x => x.partner_id === p.id);
        const isRoot =
            !p.father_id &&
            !allProfiles.some(
                x => (x.partner_id === p.id || p.partner_id === x.id) && x.father_id
            );
        return hasChildren || hasPartner || isRoot;
    });

    const units: FamilyUnit[] = [];
    const processedFamilyKeys = new Set<string>();

    candidates.forEach(p => {
        const partners = allProfiles.filter(x => x.partner_id === p.id || p.partner_id === x.id);
        const familyKey = [p.id, ...partners.map(x => x.id)].sort().join('_');

        if (processedFamilyKeys.has(familyKey)) return;

        const myScore = getPriority(p);
        const isHead = partners.every(partner => getPriority(partner) <= myScore);
        if (isHead) {
            const rawChildren = allProfiles
                .filter(x => x.father_id === p.id || partners.some(pt => x.father_id === pt.id));
            const children = sortProfilesByTraditionalSeniority(rawChildren);

            // Skip rootless singles with no family (unless they are the very first entry)
            if (!p.father_id && partners.length === 0 && children.length === 0 && units.length > 0)
                return;

            // Remove duplicates while preserving order
            const uniqueChildren: Profile[] = [];
            const seenIds = new Set<string>();
            children.forEach(c => {
                if (!seenIds.has(c.id)) {
                    uniqueChildren.push(c);
                    seenIds.add(c.id);
                }
            });

            units.push({
                head: p,
                partners,
                children: uniqueChildren,
                generation: genMap[p.id] || 1,
            });
            processedFamilyKeys.add(familyKey);
        }
    });

    // ─── Build a position-map: unitId → position within siblings (for sort key) ───
    // We index each unit's position within its father's children list so that
    // the full lineage path (e.g. "0001.0002.0001") can be compared lexicographically.
    // This ensures: son of older father always comes before son of younger father.
    const unitByHeadId = new Map<string, FamilyUnit>();
    units.forEach(u => unitByHeadId.set(u.head.id, u));

    const profileById = new Map<string, Profile>();
    allProfiles.forEach(p => profileById.set(p.id, p));

    /**
     * Build a comparable lineage key for a unit head.
     * e.g. root "Sửu" → "0001"
     *       Son "Song"  → "0001.0001"
     *       Son "Thanh" → "0001.0002"
     *       Grandson "Lĩnh" (son of Song)  → "0001.0001.0002"
     *       Grandson "Quang" (son of Thanh) → "0001.0002.0001"
     * Comparing those strings → "0001.0001.0002" < "0001.0002.0001" ✅
     */
    const getLineageKey = (profile: Profile): string => {
        const parts: string[] = [];
        let current: Profile | undefined = profile;

        while (current) {
            // Find this profile's rank among its father's children (or among root units)
            const fatherId: string | null | undefined = current.father_id;
            let siblings: Profile[];
            if (fatherId) {
                siblings = allProfiles.filter(x => x.father_id === fatherId);
            } else {
                // Root level: siblings are other root units
                siblings = allProfiles.filter(x => !x.father_id);
            }
            const sorted = sortProfilesByTraditionalSeniority(siblings);
            const rank = sorted.findIndex(s => s.id === current!.id);
            parts.unshift(String(rank >= 0 ? rank + 1 : 999).padStart(4, '0'));

            current = fatherId ? profileById.get(fatherId) : undefined;
        }

        return parts.join('.');
    };

    // Cache the lineage keys — avoid recomputing for every comparison
    const lineageKeyCache = new Map<string, string>();
    const getLineageKeyCached = (p: Profile): string => {
        if (!lineageKeyCache.has(p.id)) {
            lineageKeyCache.set(p.id, getLineageKey(p));
        }
        return lineageKeyCache.get(p.id)!;
    };

    // Sort: generation first, then lineage path (ancestry order), then own seniority
    units.sort((a, b) => {
        if (a.generation !== b.generation) return a.generation - b.generation;

        const keyA = getLineageKeyCached(a.head);
        const keyB = getLineageKeyCached(b.head);
        if (keyA !== keyB) return keyA < keyB ? -1 : 1;

        // Same lineage path (e.g. same father) — fall back to own seniority
        const genderOrder: Record<string, number> = { Male: 0, Female: 1, Other: 2 };
        const ga = genderOrder[a.head.gender ?? 'Other'] ?? 2;
        const gb = genderOrder[b.head.gender ?? 'Other'] ?? 2;
        if (ga !== gb) return ga - gb;

        const sa = a.head.seniority_index ?? 999;
        const sb = b.head.seniority_index ?? 999;
        if (sa !== sb) return sa - sb;

        return getYearFromDate(a.head.birth_date) - getYearFromDate(b.head.birth_date);
    });

    return units;
}
