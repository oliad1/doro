"use server"
import { getAuth } from "@/lib/auth";
import { Provider } from "@supabase/supabase-js";

export const loginAction = async (provider: Provider) => {
    try {
        const { data, error } = await (await getAuth()).signInWithOAuth({
            provider,
            options: {
                redirectTo: (process.env.NODE_ENV==="production")?`http://doro.study/api/auth/`:'http://localhost:3000/api/auth/'
            }
        });

        if (error){
            console.error('Auth Error:', error.message);
            return { errorMessage: error.message };
        }

        return { errorMessage: null, url: data.url };
    } catch (error) {
        console.error('Unexpected error occurred', error);
        return { errorMessage: "Unexpected error occured" };
    }
}

export const logoutAction = async () => {
    try {
        const { error } = await (await getAuth()).signOut();

        if (error){
            console.error('Sign Out Error:', error.message);
            return error;
        }

        const response = await fetch('/api/cookies/user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        console.log("DELETE TEST: ", response)

        window.location.href='/login'

        return null;
    } catch (error) {
        console.error('Unexpected error occurred', error);
        return error;
    }
}