// src/presentation/components/ClanSettings/ClanSettingsForm.tsx
// LT-403 + LT-404: Trang cài đặt Dòng Họ - Admin only
import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { type LucideIcon, Settings, Save, MapPin, BookOpen, Users, ScrollText } from 'lucide-react';
import { useClanSettings } from '../hooks/useClanSettings';
import { PrefaceEditor } from './PrefaceEditor';
import type { UpdateClanSettingsDto } from '@domain/clan-settings/ClanSettings';

const SectionHeader = ({ icon: Icon, title }: { icon: LucideIcon; title: string }) => (
    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
            <Icon size={14} />
        </div>
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">{title}</h3>
    </div>
);

const FormField = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div>
        <label className="block text-[10px] font-black uppercase mb-2 text-slate-400 tracking-widest">{label}</label>
        {children}
        {hint && <p className="mt-1.5 text-[9px] text-slate-400 italic">{hint}</p>}
    </div>
);

const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-300";

export function ClanSettingsForm() {
    const { settings, loading, saving, error, updateSettings } = useClanSettings();
    const [form, setForm] = useState<UpdateClanSettingsDto>({});
    const [saved, setSaved] = useState(false);
    const [prefaceHtml, setPrefaceHtml] = useState('');

    useEffect(() => {
        if (settings) {
            setForm({
                clan_name: settings.clan_name,
                branch_name: settings.branch_name ?? '',
                sub_branch_name: settings.sub_branch_name ?? '',
                hometown_village: settings.hometown_village ?? '',
                hometown_commune: settings.hometown_commune ?? '',
                hometown_district: settings.hometown_district ?? '',
                hometown_province: settings.hometown_province ?? '',
                book_title: settings.book_title ?? '',
                book_compiled_year: settings.book_compiled_year ?? '',
                book_compiler_name: settings.book_compiler_name ?? '',
                generation_display_offset: settings.generation_display_offset ?? 1,
            });
            setPrefaceHtml(settings.preface_poem ?? '');
        }
    }, [settings]);

    const set = (key: keyof UpdateClanSettingsDto, value: any) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Sanitize HTML before saving — mandatory security step
        const cleanPoem = DOMPurify.sanitize(prefaceHtml);
        const success = await updateSettings({ ...form, preface_poem: cleanPoem });
        if (success) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm italic">
            Đang tải cài đặt dòng họ...
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-10 max-w-3xl mx-auto">

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-xs font-medium">
                    {error}
                </div>
            )}

            {saved && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-xs font-black uppercase tracking-wider">
                    ✅ Đã lưu cài đặt dòng họ thành công!
                </div>
            )}

            {/* ── ĐỊNH DANH DÒNG HỌ ── */}
            <section>
                <SectionHeader icon={Users} title="Định Danh Dòng Họ" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <FormField label="Tên Đại Tộc *">
                        <input
                            type="text"
                            className={inputClass}
                            value={form.clan_name ?? ''}
                            onChange={e => set('clan_name', e.target.value)}
                            placeholder="VD: Nguyễn Đăng Tộc"
                            required
                        />
                    </FormField>
                    <FormField label="Phái (Nhánh lớn)">
                        <input
                            type="text"
                            className={inputClass}
                            value={form.branch_name ?? ''}
                            onChange={e => set('branch_name', e.target.value || null)}
                            placeholder="VD: Đệ Nhất Phái"
                        />
                    </FormField>
                    <FormField label="Chi (Nhánh nhỏ)">
                        <input
                            type="text"
                            className={inputClass}
                            value={form.sub_branch_name ?? ''}
                            onChange={e => set('sub_branch_name', e.target.value || null)}
                            placeholder="VD: Đệ Tứ Chi"
                        />
                    </FormField>
                </div>
            </section>

            {/* ── QUÊ QUÁN ── */}
            <section>
                <SectionHeader icon={MapPin} title="Quê Quán Gốc" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Làng / Thôn / Ấp">
                        <input
                            type="text"
                            className={inputClass}
                            value={form.hometown_village ?? ''}
                            onChange={e => set('hometown_village', e.target.value || null)}
                            placeholder="VD: Thôn Xuân Tây"
                        />
                    </FormField>
                    <FormField label="Xã / Phường / Thị trấn">
                        <input
                            type="text"
                            className={inputClass}
                            value={form.hometown_commune ?? ''}
                            onChange={e => set('hometown_commune', e.target.value || null)}
                            placeholder="VD: Xã Điền Môn"
                        />
                    </FormField>
                    <FormField label="Huyện / Quận / Thị xã">
                        <input
                            type="text"
                            className={inputClass}
                            value={form.hometown_district ?? ''}
                            onChange={e => set('hometown_district', e.target.value || null)}
                            placeholder="VD: Huyện Phong Điền"
                        />
                    </FormField>
                    <FormField label="Tỉnh / Thành phố">
                        <input
                            type="text"
                            className={inputClass}
                            value={form.hometown_province ?? ''}
                            onChange={e => set('hometown_province', e.target.value || null)}
                            placeholder="VD: Thừa Thiên Huế"
                        />
                    </FormField>
                </div>
            </section>

            {/* ── THÔNG TIN CUỐN PHẢ ── */}
            <section>
                <SectionHeader icon={BookOpen} title="Thông Tin Cuốn Phả" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Tiêu đề cuốn phả">
                        <input
                            type="text"
                            className={inputClass}
                            value={form.book_title ?? ''}
                            onChange={e => set('book_title', e.target.value || null)}
                            placeholder="VD: Đệ Tứ Chi Gia Phổ"
                        />
                    </FormField>
                    <FormField label="Người lập phả">
                        <input
                            type="text"
                            className={inputClass}
                            value={form.book_compiler_name ?? ''}
                            onChange={e => set('book_compiler_name', e.target.value || null)}
                            placeholder="VD: Nguyễn Văn A"
                        />
                    </FormField>
                    <FormField label="Năm lập phả">
                        <input
                            type="text"
                            className={inputClass}
                            value={form.book_compiled_year ?? ''}
                            onChange={e => set('book_compiled_year', e.target.value || null)}
                            placeholder="VD: Năm Giáp Ngọ 1954"
                        />
                    </FormField>
                    <FormField
                        label="Đời bắt đầu tính từ Thủy Tổ"
                        hint={`Đời 1 trong cuốn phả này = Đời ${form.generation_display_offset ?? 1} tính từ Thủy Tổ của Tộc. Mặc định: 1`}
                    >
                        <input
                            type="number"
                            min={1}
                            className={inputClass}
                            value={form.generation_display_offset ?? 1}
                            onChange={e => set('generation_display_offset', parseInt(e.target.value) || 1)}
                        />
                    </FormField>
                </div>
            </section>

            {/* ── BÀI THƠ LỜI TỰA ── */}
            <section>
                <SectionHeader icon={ScrollText} title="Bài Thơ / Lời Tựa" />
                <p className="text-[10px] text-slate-400 mb-4 italic">
                    Hiển thị trang trọng ở đầu Sách Gia Phả. Hỗ trợ định dạng in đậm, in nghiêng, căn giữa (phù hợp cho thơ).
                </p>
                <PrefaceEditor value={prefaceHtml} onChange={setPrefaceHtml} />

                {prefaceHtml && (
                    <div className="mt-4">
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-2">Preview:</p>
                        <div
                            className="p-5 bg-amber-50/30 rounded-xl border border-amber-100 font-serif text-slate-700 text-sm leading-loose prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(prefaceHtml) }}
                        />
                    </div>
                )}
            </section>

            {/* ── SUBMIT ── */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={14} />
                    {saving ? 'Đang lưu...' : 'Lưu Cài đặt'}
                </button>
            </div>
        </form>
    );
}
