// src/presentation/routes/AppRoutes.tsx
// Nơi duy nhất định nghĩa toàn bộ <Route> của ứng dụng.
// Dùng React.lazy() + Suspense để code-split theo từng trang,
// tránh nạp toàn bộ vendor bundle (xyflow, tiptap...) khi load lần đầu.

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { GitBranch } from 'lucide-react';
import { ROUTES } from './routeConfig';
import { PrivateRoute } from './PrivateRoute';
import type { Profile } from '@domain/profiles/Profile';

// ─── Lazy-loaded Pages ────────────────────────────────────────────────────────
// Mỗi page chỉ được tải xuống khi user điều hướng tới route đó lần đầu.

const TreePage = lazy(() => import('../pages/tree/TreePage')
    .then(m => ({ default: m.TreePage })));

const AncestryPage = lazy(() => import('../pages/ancestry/AncestryPage')
    .then(m => ({ default: m.AncestryPage })));

const MembersPage = lazy(() => import('../pages/members/MembersPage')
    .then(m => ({ default: m.MembersPage })));

const SettingsPage = lazy(() => import('../pages/settings/SettingsPage')
    .then(m => ({ default: m.SettingsPage })));

const LoginPage = lazy(() => import('../pages/login/LoginPage')
    .then(m => ({ default: m.LoginPage })));

// ─── Loading Fallback ─────────────────────────────────────────────────────────

function PageLoader() {
    return (
        <div className="h-full flex items-center justify-center text-gray-300">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin" />
                <span className="text-xs font-medium text-gray-400">Đang tải...</span>
            </div>
        </div>
    );
}

// ─── 404 Fallback ─────────────────────────────────────────────────────────────

function NotFoundPage() {
    const navigate = useNavigate();
    return (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <GitBranch size={48} className="mb-4 opacity-20" />
            <p className="font-bold text-sm">Trang này đang được phát triển</p>
            <button
                onClick={() => navigate(ROUTES.TREE)}
                className="mt-4 text-xs font-bold text-indigo-500 hover:underline"
            >
                Quay lại Phả đồ
            </button>
        </div>
    );
}

// ─── Login Page Wrapper ───────────────────────────────────────────────────────

function LoginPageWrapper() {
    return (
        <div className="h-full flex items-center justify-center p-8 bg-[#F8FAFC]">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                        <GitBranch size={28} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Legacy Tree</h2>
                    <p className="text-sm text-gray-400 mt-1 uppercase font-bold tracking-widest text-[10px]">Portal đăng nhập</p>
                </div>
                <LoginPage />
            </div>
        </div>
    );
}

// ─── Members Page Wrapper ─────────────────────────────────────────────────────

interface MembersPageWrapperProps {
    onEdit: (profile: Profile) => void;
    refreshKey: number;
}

function MembersPageWrapper({ onEdit, refreshKey }: MembersPageWrapperProps) {
    return (
        <div className="h-full overflow-y-auto p-6 bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <MembersPage onEdit={onEdit} key={refreshKey} />
                </div>
            </div>
        </div>
    );
}

// ─── AppRoutes ────────────────────────────────────────────────────────────────

export interface AppRoutesProps {
    onEditProfile: (profile: Profile) => void;
    refreshKey: number;
}

export function AppRoutes({ onEditProfile, refreshKey }: AppRoutesProps) {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.TREE} replace />} />
                <Route path={ROUTES.TREE} element={<TreePage onEditProfile={onEditProfile} refreshTrigger={refreshKey} />} />
                <Route path={ROUTES.ANCESTRY} element={<AncestryPage refreshTrigger={refreshKey} />} />
                <Route path={ROUTES.MEMBERS} element={<MembersPageWrapper onEdit={onEditProfile} refreshKey={refreshKey} />} />
                <Route path={ROUTES.SETTINGS} element={
                    <PrivateRoute>
                        <SettingsPage />
                    </PrivateRoute>
                } />
                <Route path={ROUTES.LOGIN} element={<LoginPageWrapper />} />
                {/* Catch-all: trang đang phát triển */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}
