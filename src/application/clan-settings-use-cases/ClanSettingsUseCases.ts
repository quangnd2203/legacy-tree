// src/application/clan-settings-use-cases/ClanSettingsUseCases.ts
import { clanSettingsRepository } from '@infrastructure/repository/SupabaseClanSettingsRepository';
import type { ClanSettings, UpdateClanSettingsDto } from '@domain/clan-settings/ClanSettings';
import { eventDispatcher, DomainEvents } from '@domain/core/EventDispatcher';
import type { ClanSettingsUpdatedEvent } from '@domain/clan-settings/ClanSettingsEvents';

/**
 * Get the singleton clan settings from the database.
 * Returns null if the settings have not been configured yet.
 */
export const getClanSettings = async (): Promise<ClanSettings | null> => {
    return await clanSettingsRepository.get();
};

/**
 * Update (upsert) the clan settings.
 * Creates a new row if none exists, otherwise updates the existing singleton row.
 * LT-904: Dispatches CLAN_SETTINGS_UPDATED domain event after successful upsert.
 */
export const updateClanSettings = async (dto: UpdateClanSettingsDto): Promise<ClanSettings> => {
    const result = await clanSettingsRepository.upsert(dto);

    const event: ClanSettingsUpdatedEvent = {
        occurredAt: new Date(),
        changedFields: Object.keys(dto),
        updatedBy: undefined,
    };
    await eventDispatcher.dispatch(DomainEvents.CLAN_SETTINGS_UPDATED, event);

    return result;
};
