// src/presentation/components/profile-form/DeceasedInfoFieldset.tsx
// Fieldset 4: Thông tin Tiền nhân — Ngày kỵ nhật, Địa điểm an nghỉ, Ảnh mộ phần.
// Chỉ hiển thị khi status === 'Deceased'.

import { Image as ImageIcon, UploadCloud } from 'lucide-react';
import type { ImageFieldsetProps } from './types';

export function DeceasedInfoFieldset({
    formData, onChange, preview, inputRef, onFileChange,
}: ImageFieldsetProps) {
    return (
        <div className="p-8 bg-rose-50/50 rounded-3xl border border-rose-100 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-2">
                <ImageIcon size={16} className="text-rose-400" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-500">Tiền nhân • Phụng Thờ & Mộ Phần</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-[10px] font-black uppercase mb-2 text-rose-400 tracking-widest">Ngày kỵ nhật (Lịch Âm)</label>
                    <input
                        type="text"
                        className="w-full bg-white border border-rose-200 rounded-xl p-3 focus:border-rose-400 outline-none transition-all font-bold text-sm text-slate-800 placeholder:text-rose-200"
                        value={formData.death_anniversary || ''}
                        onChange={e => onChange({ death_anniversary: e.target.value })}
                        placeholder="Ví dụ: 15/08 Âm lịch"
                        required={false}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase mb-2 text-rose-400 tracking-widest">Địa điểm An nghỉ</label>
                    <input
                        type="text"
                        className="w-full bg-white border border-rose-200 rounded-xl p-3 focus:border-rose-400 outline-none transition-all font-bold text-sm text-slate-800 placeholder:text-rose-200"
                        value={formData.grave_location_coords || ''}
                        onChange={e => onChange({ grave_location_coords: e.target.value })}
                        placeholder="Địa chỉ hoặc ghi chú mộ phần..."
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <label className="block text-[10px] font-black uppercase mb-3 text-rose-400 tracking-widest">Ảnh Bia Ký / Mộ Phần</label>
                    <div className="flex gap-6 items-start">
                        <div
                            onClick={() => inputRef.current?.click()}
                            className="w-24 h-24 border-2 border-rose-100 rounded-2xl bg-white flex items-center justify-center cursor-pointer overflow-hidden shrink-0 hover:border-rose-400 transition-all shadow-sm"
                        >
                            {preview ? (
                                <img src={preview} alt="Grave" className="w-full h-full object-cover" />
                            ) : (
                                <UploadCloud size={20} className="text-rose-100" />
                            )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium leading-relaxed bg-white border border-slate-50 rounded-xl p-4 italic">
                            "Kính mong con cháu cung cấp tư liệu hình ảnh bia ký hoặc nơi an táng để gia tộc dễ dàng tìm kiếm, hướng về nguồn cội mỗi dịp thanh minh, giỗ chạp."
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
            </div>
        </div>
    );
}
