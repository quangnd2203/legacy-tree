// src/presentation/components/ProfileForm.tsx
// LT-901: Refactored — form cha chỉ quản lý state + logic, JSX delegate xuống 4 Fieldsets.
// Trước: 469 dòng | Sau: ~130 dòng

import { useState, useEffect } from 'react';
import { CreateProfileDto, ProfileStatus, ProfileGender, Profile } from '../../domain/profiles/Profile';
import { createProfile, updateProfile, getProfiles } from '../../application/profile-use-cases/ProfileUseCases';
import { useProfileImageUpload } from './ProfileImageUpload';
import { UploadCloud, AlertTriangle, RefreshCw } from 'lucide-react';

import type { ProfileFormData } from './profile-form/types';
import { PersonalInfoFieldset } from './profile-form/PersonalInfoFieldset';
import { StatusContactFieldset } from './profile-form/StatusContactFieldset';
import { LineageFieldset } from './profile-form/LineageFieldset';
import { DeceasedInfoFieldset } from './profile-form/DeceasedInfoFieldset';

interface ProfileFormProps {
    initialData?: Profile;
    onSuccess: () => void;
    onCancel: () => void;
}

export function ProfileForm({ initialData, onSuccess, onCancel }: ProfileFormProps) {
    const [formData, setFormData] = useState<ProfileFormData>({
        full_name: '',
        birth_date: null,
        birth_time: null,
        birth_date_lunar: null,
        status: 'Alive',
        image_url: null,
        phone_number: '',
        death_anniversary: null,
        grave_location_coords: null,
        grave_image_url: null,
        father_id: null,
        partner_id: null,
        gender: 'Male' as ProfileGender,
        seniority_index: null,
    });

    const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // LT-507: Image upload logic extracted to useProfileImageUpload hook
    const {
        previewPortrait, previewGrave,
        portraitInputRef, graveInputRef,
        handleFileChange, uploadImages,
    } = useProfileImageUpload({
        initialPortraitUrl: initialData?.image_url,
        initialGraveUrl: initialData?.grave_image_url,
    });

    useEffect(() => {
        const loadProfiles = async () => {
            setFetching(true);
            try {
                const data = await getProfiles();
                const filtered = initialData ? data.filter(p => p.id !== initialData.id) : data;
                setAllProfiles(filtered);
            } catch (err: unknown) {
                console.error('Lỗi tải danh sách quan hệ:', err);
            } finally {
                setFetching(false);
            }
        };
        loadProfiles();

        if (initialData) {
            setFormData({
                full_name: initialData.full_name,
                birth_date: initialData.birth_date || null,
                birth_time: initialData.birth_time || null,
                birth_date_lunar: initialData.birth_date_lunar || null,
                status: initialData.status,
                image_url: initialData.image_url || null,
                phone_number: initialData.phone_number || '',
                death_anniversary: initialData.death_anniversary || null,
                grave_location_coords: initialData.grave_location_coords || null,
                grave_image_url: initialData.grave_image_url || '',
                father_id: initialData.father_id || null,
                partner_id: initialData.partner_id || null,
                gender: initialData.gender || 'Male',
                seniority_index: initialData.seniority_index ?? null,
            });
        }
    }, [initialData]);

    // ─── Handlers (giữ ở cha vì cần logic xuyên suốt) ─────────────────────────

    const handleChange = (updates: Partial<ProfileFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleDateChange = (dateStr: string) => {
        setFormData(prev => ({ ...prev, birth_date: dateStr || null }));
    };

    const handleFatherChange = (fatherId: string | null) => {
        let newIndex = formData.seniority_index;
        if (fatherId) {
            const siblings = allProfiles.filter(p => p.father_id === fatherId);
            if (!initialData || initialData.father_id !== fatherId) {
                newIndex = siblings.length + 1;
            }
        }
        setFormData(prev => ({ ...prev, father_id: fatherId, seniority_index: newIndex }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { portraitUrl, graveUrl } = await uploadImages();
            const submitData: CreateProfileDto & { status: ProfileStatus } = {
                ...formData,
                image_url: portraitUrl,
                grave_image_url: graveUrl,
            };

            if (submitData.status === 'Alive') {
                submitData.death_anniversary = null;
                submitData.grave_location_coords = null;
                submitData.grave_image_url = null;
            }

            if (submitData.father_id === '') submitData.father_id = null;
            if (submitData.partner_id === '') submitData.partner_id = null;

            if (initialData) {
                await updateProfile(initialData.id, submitData);
            } else {
                await createProfile(submitData);
            }
            onSuccess();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu hồ sơ.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // ─── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="bg-white rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <UploadCloud size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                            {initialData ? 'Cập nhật Thông tin' : 'Hồ sơ mới'}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cơ sở dữ liệu Gia tộc • Node ID: #{initialData?.id?.slice(0, 8) || 'Draft'}</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl mb-8 flex items-start gap-3 text-xs font-bold leading-relaxed">
                    <AlertTriangle size={16} className="shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                <PersonalInfoFieldset
                    formData={formData}
                    onChange={handleChange}
                    preview={previewPortrait}
                    inputRef={portraitInputRef}
                    onFileChange={(e) => handleFileChange(e, 'portrait')}
                    onDateChange={handleDateChange}
                />

                <StatusContactFieldset
                    formData={formData}
                    onChange={handleChange}
                />

                <LineageFieldset
                    formData={formData}
                    onChange={handleChange}
                    allProfiles={allProfiles}
                    fetching={fetching}
                    onFatherChange={handleFatherChange}
                />

                {formData.status === 'Deceased' && (
                    <DeceasedInfoFieldset
                        formData={formData}
                        onChange={handleChange}
                        preview={previewGrave}
                        inputRef={graveInputRef}
                        onFileChange={(e) => handleFileChange(e, 'grave')}
                    />
                )}

                {/* Submit / Cancel */}
                <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:bg-slate-200 active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="animate-spin" size={18} />
                                ĐANG ĐỒNG BỘ...
                            </>
                        ) : (
                            <>{initialData ? 'LƯU THAY ĐỔI' : 'GHI DANH HẬU DUỆ'}</>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="md:w-32 py-5 border border-slate-200 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 text-slate-400 transition-all active:scale-95 text-xs"
                    >
                        HỦY BỎ
                    </button>
                </div>
            </form>
        </div>
    );
}
