// src/domain/clan-settings/ClanSettingsEvents.ts
// Domain Events cho module Clan Settings

export interface ClanSettingsUpdatedEvent {
    occurredAt: Date;
    changedFields: string[];
    updatedBy?: string | null;
}
