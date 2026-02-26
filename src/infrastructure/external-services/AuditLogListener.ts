import { eventDispatcher, DomainEvents } from '@domain/core/EventDispatcher';
import { ProfileCreatedEvent, ProfileUpdatedEvent, ProfileDeletedEvent } from '@domain/profiles/ProfileEvents';
import type { ClanSettingsUpdatedEvent } from '@domain/clan-settings/ClanSettingsEvents';

/**
 * Service lắng nghe các Domain Events để ghi Log hoặc thực hiện các tác vụ ngoại vi.
 * Trong thực tế, đây có thể là nơi gọi đến một Analytics service hoặc Audit DB.
 */
export function initAuditLogListener() {
    // Lắng nghe sự kiện Tạo hồ sơ
    eventDispatcher.subscribe<ProfileCreatedEvent>(DomainEvents.PROFILE_CREATED, (event) => {
        console.log(`[AUDIT LOG] Thành viên mới đã được tạo: ID=${event.profileId}, Tên=${event.metadata?.full_name}`);
    });

    // Lắng nghe sự kiện Cập nhật hồ sơ
    eventDispatcher.subscribe<ProfileUpdatedEvent>(DomainEvents.PROFILE_UPDATED, (event) => {
        console.log(`[AUDIT LOG] Hồ sơ đã được cập nhật: ID=${event.profileId}, Các trường thay đổi: ${event.changedFields.join(', ')}`);
    });

    // Lắng nghe sự kiện Xóa hồ sơ
    eventDispatcher.subscribe<ProfileDeletedEvent>(DomainEvents.PROFILE_DELETED, (event) => {
        console.warn(`[AUDIT LOG] CẢNH BÁO: Hồ sơ đã bị xóa khỏi hệ thống: ID=${event.profileId}`);
    });

    // LT-904: Lắng nghe sự kiện Cập nhật Clan Settings
    eventDispatcher.subscribe<ClanSettingsUpdatedEvent>(DomainEvents.CLAN_SETTINGS_UPDATED, (event) => {
        console.log(`[AUDIT LOG] Cài đặt dòng họ đã được cập nhật. Các trường: ${event.changedFields.join(', ')}`);
    });

    console.log('[AuditLogListener] Đã khởi tạo các bộ lắng nghe sự kiện Domain.');
}
