import { profileRepository } from '@infrastructure/repository/SupabaseProfileRepository';
import { CreateProfileDto, UpdateProfileDto } from '@domain/profiles/Profile';
import { eventDispatcher, DomainEvents } from '@domain/core/EventDispatcher';
import { ProfileCreatedEvent, ProfileUpdatedEvent, ProfileDeletedEvent } from '@domain/profiles/ProfileEvents';

export const getProfiles = async () => {
    return await profileRepository.getAll();
};

export const createProfile = async (profile: CreateProfileDto) => {
    const newProfile = await profileRepository.create(profile);

    // Dispatch Domain Event
    const event: ProfileCreatedEvent = {
        profileId: newProfile.id,
        occurredAt: new Date(),
        metadata: { full_name: newProfile.full_name }
    };
    await eventDispatcher.dispatch(DomainEvents.PROFILE_CREATED, event);

    return newProfile;
};

export const updateProfile = async (id: string, profile: UpdateProfileDto) => {
    const updatedProfile = await profileRepository.update(id, profile);

    // Dispatch Domain Event
    const event: ProfileUpdatedEvent = {
        profileId: id,
        changedFields: Object.keys(profile),
        occurredAt: new Date()
    };
    await eventDispatcher.dispatch(DomainEvents.PROFILE_UPDATED, event);

    return updatedProfile;
};

export const deleteProfile = async (id: string) => {
    await profileRepository.delete(id);

    // Dispatch Domain Event
    const event: ProfileDeletedEvent = {
        profileId: id,
        occurredAt: new Date()
    };
    await eventDispatcher.dispatch(DomainEvents.PROFILE_DELETED, event);
};
