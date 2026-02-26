import { useEffect, useState, useCallback } from 'react';
import { Profile } from '@domain/profiles/Profile';
import { getProfiles } from '@application/profile-use-cases/ProfileUseCases';
import { processAncestryBook, type FamilyUnit } from '@application/genealogy-use-cases/ProcessAncestryBook';

interface UseMembersPageResult {
    profiles: Profile[];
    orderedProfiles: Profile[];
    loading: boolean;
    error: string | null;
    refresh: () => void;
}

export function useMembersPage(): UseMembersPageResult {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfiles = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getProfiles();
            setProfiles(data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Lỗi khi tải danh sách hồ sơ';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    // Apply sorting logic (Traditional Seniority)
    const units = processAncestryBook(profiles);
    const orderedProfiles: Profile[] = [];
    const seenIds = new Set<string>();
    const unitsByHeadId = new Map(units.map((u: FamilyUnit) => [u.head.id, u]));

    const addProfileWithFamily = (p: Profile) => {
        if (seenIds.has(p.id)) return;
        orderedProfiles.push(p);
        seenIds.add(p.id);

        // 1. Tìm partner qua unitsByHeadId (logic cho trường hợp p là Head của một FamilyUnit)
        const unit = unitsByHeadId.get(p.id) as FamilyUnit | undefined;
        if (unit) {
            unit.partners.forEach((partner: Profile) => {
                if (!seenIds.has(partner.id)) {
                    orderedProfiles.push(partner);
                    seenIds.add(partner.id);
                }
            });
        }

        // 2. LT-1003: Reverse partner lookup
        // Nếu p không phải head (vd: con gái), tìm partner bằng cách scan profiles
        if (p.partner_id && !seenIds.has(p.partner_id)) {
            const partner = profiles.find(x => x.id === p.partner_id);
            if (partner) {
                orderedProfiles.push(partner);
                seenIds.add(partner.id);
            }
        }

        // Kiểm tra ngược lại (có ai coi p là partner không)
        const reversePartner = profiles.find(
            x => x.partner_id === p.id && !seenIds.has(x.id)
        );
        if (reversePartner) {
            orderedProfiles.push(reversePartner);
            seenIds.add(reversePartner.id);
        }
    };

    units.forEach((unit: FamilyUnit) => {
        addProfileWithFamily(unit.head);
        unit.children.forEach(addProfileWithFamily);
    });

    profiles.forEach(p => {
        if (!seenIds.has(p.id)) {
            orderedProfiles.push(p);
            seenIds.add(p.id);
        }
    });

    return { profiles, orderedProfiles, loading, error, refresh: fetchProfiles };
}
