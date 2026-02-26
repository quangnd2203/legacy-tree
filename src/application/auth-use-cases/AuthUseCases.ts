import { supabase } from '../../infrastructure/core/supabase';

export const loginWithPassword = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
        email,
        password,
    });
};

export const signOut = async () => {
    return await supabase.auth.signOut();
};

export const getSession = async () => {
    return await supabase.auth.getSession();
};

export const onAuthStateChange = (callback: (event: any, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
};
