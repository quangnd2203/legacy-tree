// src/presentation/routes/PrivateRoute.tsx
// LT-601: Route guard — redirect unauthenticated users to /login.
// Waits for auth loading state to resolve before deciding (prevents flash redirect).

import { Navigate } from 'react-router-dom';
import { useAuth } from '@presentation/context/AuthContext';
import { ROUTES } from '@presentation/routes/routeConfig';
import { BookOpen } from 'lucide-react';

interface PrivateRouteProps {
    children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
    const { user, loading } = useAuth();

    // Wait for session to resolve — avoid flash redirect on initial page load
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-[#F8FAFC]">
                <div className="text-center animate-pulse">
                    <BookOpen size={48} className="text-indigo-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium lowercase tracking-widest text-xs">Đang xác thực...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <>{children}</>;
}
