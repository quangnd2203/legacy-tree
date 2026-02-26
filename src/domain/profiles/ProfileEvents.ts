export interface ProfileCreatedEvent {
    profileId: string;
    occurredAt: Date;
    metadata?: Record<string, any>;
}

export interface ProfileUpdatedEvent {
    profileId: string;
    changedFields: string[];
    occurredAt: Date;
}

export interface ProfileDeletedEvent {
    profileId: string;
    occurredAt: Date;
}
