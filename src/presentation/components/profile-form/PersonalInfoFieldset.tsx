// src/presentation/components/profile-form/PersonalInfoFieldset.tsx
// Fieldset 1: Ảnh chân dung, Họ tên, Ngày sinh (Dương + Âm), Giờ sinh.

import { Camera, UploadCloud } from 'lucide-react';
import type { ImageFieldsetProps } from './types';

interface PersonalInfoFieldsetProps extends ImageFieldsetProps {
    onDateChange: (dateStr: string) => void;
}

export function PersonalInfoFieldset({
    formData, onChange, preview, inputRef, onFileChange, onDateChange,
}: PersonalInfoFieldsetProps) {
    return (
        <div className="flex flex-col md:flex-row gap-10 items-start pb-10 border-b border-slate-50">
            {/* Ảnh chân dung */}
            <div className="relative group shrink-0">
                <div
                    onClick={() => inputRef.current?.click()}
                    className="w-32 h-40 rounded-2xl border-2 border-slate-100 bg-slate-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-all hover:border-indigo-200 hover:ring-4 hover:ring-indigo-50"
                >
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <>
                            <Camera size={24} className="text-slate-300 mb-2" />
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter text-center px-4 leading-tight">Click để chọn<br />Ảnh chân dung</span>
                        </>
                    )}
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                        <UploadCloud size={20} className="text-white" />
                    </div>
                </div>
                <input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={onFileChange}
                />
            </div>

            {/* Thông tin cá nhân */}
            <div className="flex-1 space-y-6 w-full">
                <div>
                    <label className="block text-[10px] font-black uppercase mb-2 text-slate-400 tracking-widest">Họ và Tên Thành Viên</label>
                    <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-lg text-slate-900 placeholder:font-medium placeholder:italic placeholder:text-slate-300"
                        value={formData.full_name}
                        onChange={e => onChange({ full_name: e.target.value })}
                        placeholder="Ví dụ: Nguyễn Văn A..."
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase mb-2 text-slate-400 tracking-widest">Ngày sinh (Dương lịch)</label>
                        <input
                            type="date"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-400 outline-none transition-all font-bold text-slate-800"
                            value={formData.birth_date || ''}
                            onChange={e => onDateChange(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase mb-2 text-slate-400 tracking-widest">Giờ sinh (Nếu có)</label>
                        <input
                            type="time"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-400 outline-none transition-all font-bold text-slate-800"
                            value={formData.birth_time || ''}
                            onChange={e => onChange({ birth_time: e.target.value || null })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase mb-2 text-indigo-400 tracking-widest font-serif italic">Ngày sinh Âm lịch (Nếu có)</label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full bg-indigo-50/30 border border-indigo-100 rounded-xl p-4 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-800 placeholder:font-medium placeholder:italic placeholder:text-slate-300 shadow-sm"
                            value={formData.birth_date_lunar || ''}
                            onChange={e => onChange({ birth_date_lunar: e.target.value || null })}
                            placeholder="Ví dụ: 15/4 Giáp Ngọ, Giờ Thìn tháng Chạp..."
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter bg-white px-2 py-1 rounded-sm border border-indigo-100 shadow-xs">
                                Lunar Date
                            </div>
                        </div>
                    </div>
                    <p className="mt-2 text-[9px] text-indigo-400/60 italic leading-tight">
                        * Ưu tiên hiển thị trong Phả ký nếu thông tin này được cung cấp.
                    </p>
                </div>
            </div>
        </div>
    );
}
