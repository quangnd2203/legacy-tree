// src/presentation/pages/settings/hooks/useClanSettings.ts
import { useState, useEffect, useCallback } from 'react';
import type { ClanSettings, UpdateClanSettingsDto } from '@domain/clan-settings/ClanSettings';
import { getClanSettings, updateClanSettings } from '@application/clan-settings-use-cases/ClanSettingsUseCases';

interface UseClanSettingsReturn {
    settings: ClanSettings | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    updateSettings: (dto: UpdateClanSettingsDto) => Promise<boolean>;
    refresh: () => void;
}

export function useClanSettings(): UseClanSettingsReturn {
    const [settings, setSettings] = useState<ClanSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getClanSettings();
                if (!cancelled) setSettings(data);
            } catch (err: any) {
                if (!cancelled) setError(err.message || 'Không tải được cài đặt dòng họ.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [refreshKey]);

    const updateSettings = useCallback(async (dto: UpdateClanSettingsDto): Promise<boolean> => {
        setSaving(true);
        setError(null);
        try {
            // TD-002: pass current id so repository skips the extra get() round-trip
            const updated = await updateClanSettings({ id: settings?.id ?? undefined, ...dto });
            setSettings(updated);
            return true;
        } catch (err: any) {
            setError(err.message || 'Lưu cài đặt thất bại.');
            return false;
        } finally {
            setSaving(false);
        }
    }, [settings?.id]);

    const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

    return { settings, loading, saving, error, updateSettings, refresh };
}
