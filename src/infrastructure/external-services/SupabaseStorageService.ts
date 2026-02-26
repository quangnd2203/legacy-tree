import { supabase } from '../core/supabase';

export interface StorageService {
    uploadFile(bucket: string, path: string, file: File): Promise<string>;
    getPublicUrl(bucket: string, path: string): string;
    deleteFile(bucket: string, path: string): Promise<void>;
}

export class SupabaseStorageService implements StorageService {
    async uploadFile(bucket: string, path: string, file: File): Promise<string> {
        const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
            upsert: true,
        });

        if (error) {
            throw new Error(`Lỗi upload file: ${error.message}`);
        }

        return data.path;
    }

    getPublicUrl(bucket: string, path: string): string {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    }

    async deleteFile(bucket: string, path: string): Promise<void> {
        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) {
            throw new Error(`Lỗi xóa file: ${error.message}`);
        }
    }
}

export const storageService = new SupabaseStorageService();
