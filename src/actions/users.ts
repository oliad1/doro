"use server"
import { Provider } from "@supabase/supabase-js";
import { getRedirectUrl } from '@/utils/helpers';
import { createClient } from '@/utils/supabase/server';
import { cookies } from "next/headers";

export const loginAction = async (provider: Provider) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
	redirectTo: getRedirectUrl()
      }
    });

    if (error){
      console.error('Auth Error:', error.message);
      return { error: error.message };
    }

    return { errorMessage: null, url: data.url };
  } catch (error) {
    console.error('Unexpected error occurred', error);
    return { error: "Unexpected error occured" };
  }
}

export const logoutAction = async () => {
  try {
    const supabase = await createClient();
    const cookieStore = await cookies();

    const { error } = await supabase.auth.signOut();

    if (error){
      console.error('Sign Out Error:', error.message);
      return error;
    }

    cookieStore.set('user_metadata', '', { maxAge: 0 });

    return null;
  } catch (error) {
    console.error('Unexpected error occurred', error);
    return error;
  }
}
