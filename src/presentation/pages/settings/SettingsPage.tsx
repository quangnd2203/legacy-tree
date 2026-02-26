// src/presentation/components/ClanSettings/ClanSettingsPage.tsx
// LT-403: Page wrapper
import { Settings } from 'lucide-react';
import { ClanSettingsForm } from './components/ClanSettingsForm';

export function SettingsPage() {
    return (
        <div className="h-full overflow-y-auto bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                        <Settings size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            Cài đặt Dòng Họ
                        </h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            Quản lý thông tin định danh • Chỉ Trưởng Tộc
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <ClanSettingsForm />
                </div>
            </div>
        </div>
    );
}
