// src/infrastructure/repository/SupabaseProfileRepository.ts
import { supabase } from '../core/supabase';
import { Profile, CreateProfileDto, UpdateProfileDto } from '@domain/profiles/Profile';

export const profileRepository = {
    async getAll(): Promise<Profile[]> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*');
        // Sort intentionally removed: ordering logic belongs at Application layer (ProcessAncestryBook.ts)

        if (error) throw error;
        return data || [];
    },

    async getById(id: string): Promise<Profile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .maybeSingle(); // LT-906: .single() throws when not found; .maybeSingle() returns null

        if (error) throw error;
        return data;
    },

    async create(profile: CreateProfileDto): Promise<Profile> {
        const { data, error } = await supabase
            .from('profiles')
            .insert(profile)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, profile: UpdateProfileDto): Promise<Profile> {
        const { data, error } = await supabase
            .from('profiles')
            .update(profile)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
