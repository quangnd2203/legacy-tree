// src/presentation/context/ClanSettingsContext.tsx
// TD-003: Single shared source of truth for ClanSettings across the whole app.
// Instead of each component calling useClanSettings() independently (multiple DB fetches),
// the Dashboard wraps children in this provider → 1 fetch total per session.
import { createContext, useContext } from 'react';
import { useClanSettings } from '../pages/settings/hooks/useClanSettings';
import type { ClanSettings, UpdateClanSettingsDto } from '../../domain/clan-settings/ClanSettings';

interface ClanSettingsContextValue {
    settings: ClanSettings | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    updateSettings: (dto: UpdateClanSettingsDto) => Promise<boolean>;
    refresh: () => void;
}

const ClanSettingsContext = createContext<ClanSettingsContextValue | null>(null);

/** Wrap at Dashboard level to share a single clan settings fetch across all child components. */
export function ClanSettingsProvider({ children }: { children: React.ReactNode }) {
    const value = useClanSettings();
    return (
        <ClanSettingsContext.Provider value={value}>
            {children}
        </ClanSettingsContext.Provider>
    );
}

/**
 * Consume clan settings from the shared context.
 * Must be used inside <ClanSettingsProvider>.
 * Throws a clear error if used outside the provider (prevents silent bugs).
 */
export function useClanSettingsContext(): ClanSettingsContextValue {
    const ctx = useContext(ClanSettingsContext);
    if (!ctx) throw new Error('useClanSettingsContext must be used inside <ClanSettingsProvider>');
    return ctx;
}
