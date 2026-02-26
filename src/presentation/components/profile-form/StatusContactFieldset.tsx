// src/presentation/components/profile-form/StatusContactFieldset.tsx
// Fieldset 2: Trạng thái (Alive/Deceased), Số điện thoại, Giới tính.

import type { ProfileStatus, ProfileGender } from '@domain/profiles/Profile';
import type { FieldsetProps } from './types';

export function StatusContactFieldset({ formData, onChange }: FieldsetProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
                <label className="block text-[10px] font-black uppercase mb-2 text-slate-400 tracking-widest">Trạng thái Hiện Tại</label>
                <div className="relative">
                    <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:bg-white focus:border-indigo-400 outline-none transition-all font-black uppercase text-xs appearance-none cursor-pointer text-slate-700"
                        value={formData.status}
                        onChange={e => onChange({ status: e.target.value as ProfileStatus })}
                    >
                        <option value="Alive">🟢 CÒN SỐNG</option>
                        <option value="Deceased">⚪ ĐÃ MẤT</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <span className="text-[10px]">▼</span>
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-black uppercase mb-2 text-slate-400 tracking-widest">Số điện thoại</label>
                <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:bg-white focus:border-indigo-400 outline-none transition-all font-bold text-slate-800 placeholder:font-medium text-sm"
                    value={formData.phone_number || ''}
                    onChange={e => onChange({ phone_number: e.target.value })}
                    placeholder="09xx..."
                />
            </div>
            <div>
                <label className="block text-[10px] font-black uppercase mb-2 text-slate-400 tracking-widest text-center">Giới tính</label>
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                    {(['Male', 'Female', 'Other'] as ProfileGender[]).map(g => (
                        <label key={g} className={`flex-1 flex items-center justify-center gap-1.5 cursor-pointer py-2.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all ${formData.gender === g ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'
                            }`}>
                            <input
                                type="radio"
                                name="gender"
                                value={g}
                                checked={formData.gender === g}
                                onChange={() => onChange({ gender: g })}
                                className="hidden"
                            />
                            <span className="text-lg leading-none">{g === 'Male' ? '♂' : g === 'Female' ? '♀' : '○'}</span>
                            <span>{g === 'Male' ? 'Nam' : g === 'Female' ? 'Nữ' : 'Khác'}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
