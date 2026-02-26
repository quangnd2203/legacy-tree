import { useCallback, useEffect, useState } from 'react';
import { Profile } from '@domain/profiles/Profile';
import { getProfiles } from '@application/profile-use-cases/ProfileUseCases';
import { FamilyUnit, processAncestryBook } from '@application/genealogy-use-cases/ProcessAncestryBook';

interface UseAncestryBookResult {
    profiles: Profile[];
    familyUnits: FamilyUnit[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

/**
 * useAncestryBook — Custom hook for the Ancestry Book page.
 *
 * Handles data fetching, processing, loading and error states.
 * AncestryPage.tsx only needs to consume this hook and render the result.
 */
export function useAncestryBook(refreshTrigger: number = 0): UseAncestryBookResult {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [familyUnits, setFamilyUnits] = useState<FamilyUnit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAndProcess = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProfiles();
            setProfiles(data);
            setFamilyUnits(processAncestryBook(data));
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Không thể tải dữ liệu gia phả. Vui lòng thử lại.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAndProcess();
    }, [fetchAndProcess, refreshTrigger]);

    return { profiles, familyUnits, loading, error, refetch: fetchAndProcess };
}
