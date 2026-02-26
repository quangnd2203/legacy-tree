// src/infrastructure/repository/SupabaseClanSettingsRepository.ts
import { supabase } from '../core/supabase';
import type { ClanSettings, UpdateClanSettingsDto } from '@domain/clan-settings/ClanSettings';

export const clanSettingsRepository = {
    async get(): Promise<ClanSettings | null> {
        const { data, error } = await supabase
            .from('clan_settings')
            .select('*')
            .limit(1)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    async upsert(dto: UpdateClanSettingsDto): Promise<ClanSettings> {
        const payload: Record<string, unknown> = {
            ...dto,
            updated_at: new Date().toISOString(),
        };

        // LT-905 fix: `this` is undefined in plain object context.
        // Fetch the singleton id directly instead of calling this.get().
        if (!payload['id']) {
            const { data: existing } = await supabase
                .from('clan_settings')
                .select('id')
                .limit(1)
                .maybeSingle();
            if (existing) payload['id'] = existing.id;
        }

        const { data, error } = await supabase
            .from('clan_settings')
            .upsert(payload)
            .select()
            .single();

        if (error) throw error;
        return data;
    },
};
