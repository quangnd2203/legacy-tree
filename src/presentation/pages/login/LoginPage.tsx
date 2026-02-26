import { useState } from 'react';
import * as AuthUseCases from '../../../application/auth-use-cases/AuthUseCases';
import { useAuth } from '../../context/AuthContext';

export function LoginPage() {
    const { user, signOut } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await AuthUseCases.loginWithPassword(
            email,
            password,
        );

        if (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    if (user) {
        return (
            <div className="border border-black p-6 bg-white w-full max-w-sm mx-auto mt-8">
                <h2 className="text-xl font-bold mb-4">Đã đăng nhập</h2>
                <p className="mb-4">Tài khoản: {user.email}</p>
                <button
                    onClick={signOut}
                    className="w-full bg-black text-white py-2 px-4 hover:bg-gray-800 transition-colors font-semibold"
                >
                    Đăng xuất
                </button>
            </div>
        );
    }

    return (
        <div className="border border-black p-8 bg-white w-full max-w-sm mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6 text-center tracking-tight">Đăng Nhập Quản Trị</h2>

            {error && (
                <div className="bg-red-50 border border-red-500 text-red-700 p-3 mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 p-2 focus:border-black focus:outline-none transition-colors"
                        required
                        placeholder="admin@legacytree.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="password">
                        Mật khẩu
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 p-2 focus:border-black focus:outline-none transition-colors"
                        required
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 px-4 hover:bg-gray-800 transition-colors mt-6 font-semibold disabled:bg-gray-400"
                >
                    {loading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                </button>
            </form>
        </div>
    );
}
