type EventHandler<T = any> = (event: T) => void | Promise<void>;

class EventDispatcher {
    private static instance: EventDispatcher;
    private handlers: Map<string, EventHandler[]> = new Map();

    private constructor() { }

    public static getInstance(): EventDispatcher {
        if (!EventDispatcher.instance) {
            EventDispatcher.instance = new EventDispatcher();
        }
        return EventDispatcher.instance;
    }

    /**
     * Đăng ký lắng nghe một sự kiện
     */
    public subscribe<T>(eventName: string, handler: EventHandler<T>): void {
        if (!this.handlers.has(eventName)) {
            this.handlers.set(eventName, []);
        }
        this.handlers.get(eventName)?.push(handler);
    }

    /**
     * Phát đi một sự kiện
     */
    public async dispatch<T>(eventName: string, event: T): Promise<void> {
        const eventHandlers = this.handlers.get(eventName);
        if (eventHandlers) {
            const promises = eventHandlers.map(handler => handler(event));
            await Promise.all(promises);
        }

        // Log cơ bản để kiểm chứng trong quá trình phát triển (Audit Log giả lập)
        console.log(`[Domain Event Dispatcher] Event: ${eventName}`, event);
    }
}

export const eventDispatcher = EventDispatcher.getInstance();

// Định nghĩa các hằng số tên sự kiện để tránh typo
export const DomainEvents = {
    PROFILE_CREATED: 'PROFILE_CREATED',
    PROFILE_UPDATED: 'PROFILE_UPDATED',
    PROFILE_DELETED: 'PROFILE_DELETED',
    CLAN_SETTINGS_UPDATED: 'CLAN_SETTINGS_UPDATED', // LT-904
};
