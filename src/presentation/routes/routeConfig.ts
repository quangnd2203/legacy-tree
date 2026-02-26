// src/presentation/routes/routeConfig.ts
// Tập trung toàn bộ định nghĩa route path và nav config tại đây.
// Không import React — file này là pure data/config.
//
// ── SCOPE DECISION 25/02/2026 ──────────────────────────────────────────────
// ✅ Bản tin (/news)     — Admin đăng thông báo: cáo phó, chạp giỗ kỵ, tin tức họ
// ❌ Sự kiện (/events)   — Dropped: overlap với Bản tin, phức tạp (âm lịch text)
// ❌ Tạo viên (/network) — Dropped: scope chưa rõ, không có nhu cầu thực tế
// ❌ Danh bạ (/directory) — Dropped: đã có /members phục vụ đúng chức năng này

import {
    Users, GitBranch, BookOpen, Newspaper,
    type LucideIcon,
} from 'lucide-react';

// ─── Route Paths ─────────────────────────────────────────────────────────────

export const ROUTES = {
    HOME: '/',
    TREE: '/tree',
    ANCESTRY: '/ancestry',
    MEMBERS: '/members',
    SETTINGS: '/settings',
    LOGIN: '/login',
    NEWS: '/news',
} as const;

export type AppRoutePath = typeof ROUTES[keyof typeof ROUTES];

// ─── Navigation Items ─────────────────────────────────────────────────────────

export interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
    path: AppRoutePath;
}

export const NAV_ITEMS: NavItem[] = [
    { id: 'news', label: 'Bản tin', icon: Newspaper, path: ROUTES.NEWS },
    { id: 'tree', label: 'Cây gia phả', icon: GitBranch, path: ROUTES.TREE },
    { id: 'ancestry', label: 'Phả ký phả chí', icon: BookOpen, path: ROUTES.ANCESTRY },
    { id: 'members', label: 'Thành viên', icon: Users, path: ROUTES.MEMBERS },
];
