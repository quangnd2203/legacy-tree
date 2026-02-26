// src/presentation/components/ProfileImageUpload.tsx
// LT-507: Extracted from ProfileForm.tsx — manages portrait & grave image upload states
import { useState, useRef, useEffect } from 'react';
import { Camera, UploadCloud } from 'lucide-react';
import { storageService } from '../../infrastructure/external-services/SupabaseStorageService';

const BUCKET_NAME = 'profiles';

export interface ProfileImageUploadRef {
    uploadImages: () => Promise<{ portraitUrl: string | null; graveUrl: string | null }>;
}

interface ProfileImageUploadProps {
    initialPortraitUrl?: string | null;
    initialGraveUrl?: string | null;
    showGrave?: boolean; // Only shown for Deceased profiles
    onPortraitChange?: (url: string | null) => void;
}

/** Upload helper: returns the public URL after uploading a file to Supabase Storage */
async function uploadToStorage(file: File, prefix: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${prefix}_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    await storageService.uploadFile(BUCKET_NAME, fileName, file);
    return storageService.getPublicUrl(BUCKET_NAME, fileName);
}

export function ProfileImageUpload({
    initialPortraitUrl,
    initialGraveUrl,
    showGrave = false,
    onPortraitChange,
}: ProfileImageUploadProps) {
    const [portraitFile, setPortraitFile] = useState<File | null>(null);
    const [graveFile, setGraveFile] = useState<File | null>(null);
    const [previewPortrait, setPreviewPortrait] = useState<string | null>(null);
    const [previewGrave, setPreviewGrave] = useState<string | null>(null);

    const portraitInputRef = useRef<HTMLInputElement>(null);
    const graveInputRef = useRef<HTMLInputElement>(null);

    // Sync with initial data (e.g., when editing an existing profile)
    useEffect(() => {
        if (initialPortraitUrl) setPreviewPortrait(initialPortraitUrl);
        if (initialGraveUrl) setPreviewGrave(initialGraveUrl);
    }, [initialPortraitUrl, initialGraveUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'portrait' | 'grave') => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'portrait') {
                setPortraitFile(file);
                setPreviewPortrait(reader.result as string);
                onPortraitChange?.(null); // Signal that there's a new file pending upload
            } else {
                setGraveFile(file);
                setPreviewGrave(reader.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    /**
     * Upload any pending files and return the resulting URLs.
     * If no new file was selected, returns the existing initial URL (unchanged).
     * Called by ProfileForm.handleSubmit before saving the profile.
     */
    async function uploadImages(): Promise<{ portraitUrl: string | null; graveUrl: string | null }> {
        let portraitUrl = initialPortraitUrl ?? null;
        let graveUrl = initialGraveUrl ?? null;

        if (portraitFile) portraitUrl = await uploadToStorage(portraitFile, 'portrait');
        if (graveFile) graveUrl = await uploadToStorage(graveFile, 'grave');

        return { portraitUrl, graveUrl };
    }

    // Expose uploadImages via a ref-like pattern using a data attribute approach.
    // ProfileForm accesses this via a passed ref: uploadImagesRef.current = uploadImages
    // We use the simpler callback approach: pass uploadImages up via onUploadReady.

    return (
        <>
            {/* ── Portrait Upload ────────────────────────────────────────── */}
            <div className="relative group shrink-0">
                <div
                    onClick={() => portraitInputRef.current?.click()}
                    className="w-32 h-40 rounded-2xl border-2 border-slate-100 bg-slate-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-all hover:border-indigo-200 hover:ring-4 hover:ring-indigo-50"
                >
                    {previewPortrait ? (
                        <img src={previewPortrait} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <>
                            <Camera size={24} className="text-slate-300 mb-2" />
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter text-center px-4 leading-tight">
                                Click để chọn<br />Ảnh chân dung
                            </span>
                        </>
                    )}
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                        <UploadCloud size={20} className="text-white" />
                    </div>
                </div>
                <input
                    type="file"
                    ref={portraitInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'portrait')}
                />
            </div>

            {/* ── Grave Image Upload (Deceased only) ────────────────────── */}
            {showGrave && (
                <div className="flex gap-6 items-start">
                    <div
                        onClick={() => graveInputRef.current?.click()}
                        className="w-24 h-24 border-2 border-rose-100 rounded-2xl bg-white flex items-center justify-center cursor-pointer overflow-hidden shrink-0 hover:border-rose-400 transition-all shadow-sm"
                    >
                        {previewGrave ? (
                            <img src={previewGrave} alt="Grave" className="w-full h-full object-cover" />
                        ) : (
                            <UploadCloud size={20} className="text-rose-100" />
                        )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium leading-relaxed bg-white border border-slate-50 rounded-xl p-4 italic">
                        "Kính mong con cháu cung cấp tư liệu hình ảnh bia ký hoặc nơi an táng để gia tộc dễ dàng tìm kiếm, hướng về nguồn cội mỗi dịp thanh minh, giỗ chạp."
                    </div>
                    <input
                        type="file"
                        ref={graveInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'grave')}
                    />
                </div>
            )}

            {/* Hidden anchor so ProfileForm can call uploadImages() */}
            {/* ProfileForm uses the useProfileImageUpload hook pattern below */}
        </>
    );
}

/**
 * Hook version for ProfileForm to call uploadImages imperatively.
 * Usage: const { imageUploadProps, uploadImages } = useProfileImageUpload({ ... });
 */
export function useProfileImageUpload(opts: {
    initialPortraitUrl?: string | null;
    initialGraveUrl?: string | null;
}) {
    const [portraitFile, setPortraitFile] = useState<File | null>(null);
    const [graveFile, setGraveFile] = useState<File | null>(null);
    const [previewPortrait, setPreviewPortrait] = useState<string | null>(opts.initialPortraitUrl ?? null);
    const [previewGrave, setPreviewGrave] = useState<string | null>(opts.initialGraveUrl ?? null);
    const portraitInputRef = useRef<HTMLInputElement>(null);
    const graveInputRef = useRef<HTMLInputElement>(null);

    // Sync when editing profile changes
    useEffect(() => {
        setPreviewPortrait(opts.initialPortraitUrl ?? null);
        setPreviewGrave(opts.initialGraveUrl ?? null);
    }, [opts.initialPortraitUrl, opts.initialGraveUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'portrait' | 'grave') => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'portrait') { setPortraitFile(file); setPreviewPortrait(reader.result as string); }
            else { setGraveFile(file); setPreviewGrave(reader.result as string); }
        };
        reader.readAsDataURL(file);
    };

    const uploadImages = async (): Promise<{ portraitUrl: string | null; graveUrl: string | null }> => {
        let portraitUrl = opts.initialPortraitUrl ?? null;
        let graveUrl = opts.initialGraveUrl ?? null;
        if (portraitFile) portraitUrl = await uploadToStorage(portraitFile, 'portrait');
        if (graveFile) graveUrl = await uploadToStorage(graveFile, 'grave');
        return { portraitUrl, graveUrl };
    };

    return {
        previewPortrait,
        previewGrave,
        portraitInputRef,
        graveInputRef,
        handleFileChange,
        uploadImages,
    };
}
