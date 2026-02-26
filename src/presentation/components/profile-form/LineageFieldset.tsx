// src/presentation/components/profile-form/LineageFieldset.tsx
// Fieldset 3: Quan hệ Phụ Hệ (Cha), Thứ tự vai vế, Phối ngẫu.

import { GitBranch } from 'lucide-react';
import type { LineageFieldsetProps } from './types';

export function LineageFieldset({
    formData, onChange, allProfiles, fetching, onFatherChange,
}: LineageFieldsetProps) {
    return (
        <div className="p-8 bg-indigo-50/30 rounded-3xl border border-indigo-100/50 space-y-8">
            <div className="flex items-center gap-2">
                <GitBranch size={16} className="text-indigo-400" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Quan hệ Phụ Hệ & Phối Ngẫu</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cha (Phụ thân) */}
                <div>
                    <label className="block text-[10px] font-black uppercase mb-2 text-indigo-400 tracking-widest">Dưới trướng cha (Phụ thân)</label>
                    <div className="relative">
                        <select
                            className="w-full bg-white border border-indigo-100 rounded-xl p-3 focus:border-indigo-400 outline-none transition-all font-bold text-slate-700 text-xs cursor-pointer disabled:opacity-50 appearance-none shadow-sm shadow-indigo-100/20"
                            value={formData.father_id || ''}
                            onChange={e => onFatherChange(e.target.value || null)}
                            disabled={fetching}
                        >
                            <option value="">-- KHÔNG CÓ / CHƯA RÕ --</option>
                            {allProfiles.map(p => (
                                <option key={p.id} value={p.id}>{p.full_name} ({p.birth_date ? new Date(p.birth_date).getFullYear() : '?'})</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-300">
                            <span className="text-[10px]">▼</span>
                        </div>
                    </div>
                </div>

                {/* Thứ tự vai vế */}
                <div>
                    <label className="block text-[10px] font-black uppercase mb-2 text-indigo-400 tracking-widest">
                        Thứ tự vai vế (Tự động tính)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            min="1"
                            className="w-full bg-white border border-indigo-100 rounded-xl p-3 focus:border-indigo-400 outline-none transition-all font-bold text-slate-800 text-sm placeholder:font-medium placeholder:italic shadow-sm shadow-indigo-100/20"
                            value={formData.seniority_index || ''}
                            onChange={e => onChange({ seniority_index: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Hệ thống sẽ tự tính khi chọn Cha..."
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter bg-indigo-50 px-2 py-1 rounded-sm border border-indigo-100">
                                Auto Rank
                            </div>
                        </div>
                    </div>
                    <p className="mt-2 text-[9px] text-indigo-400/60 italic leading-tight">
                        * Gợi ý: {formData.father_id ? "Người cha được chọn đã có " + allProfiles.filter(p => p.father_id === formData.father_id).length + " con." : "Hãy chọn Cha để hệ thống gợi ý thứ bậc."}
                    </p>
                </div>
            </div>

            {/* Phối ngẫu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-[10px] font-black uppercase mb-2 text-indigo-400 tracking-widest">Bạn đời kết nghĩa (Phối ngẫu)</label>
                    <div className="relative">
                        <select
                            className="w-full bg-white border border-indigo-100 rounded-xl p-3 focus:border-indigo-400 outline-none transition-all font-bold text-slate-700 text-xs cursor-pointer disabled:opacity-50 appearance-none shadow-sm shadow-indigo-100/20"
                            value={formData.partner_id || ''}
                            onChange={e => onChange({ partner_id: e.target.value || null })}
                            disabled={fetching}
                        >
                            <option value="">-- CHƯA CÓ / ĐỘC THÂN --</option>
                            {allProfiles.map(p => (
                                <option key={p.id} value={p.id}>{p.full_name} ({p.birth_date ? new Date(p.birth_date).getFullYear() : '?'})</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-300">
                            <span className="text-[10px]">▼</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
