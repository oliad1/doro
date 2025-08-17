"use server"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '../../database.types';

export async function verifyAuth(){
    const cookieStore = await cookies();
    const prefix = 'sb-gtnvcvlloakaqinwtxzb-auth-token.'
    const loginVerifier = 'sb-gtnvcvlloakaqinwtxzb-auth-token-code-verifier'

    return (cookieStore.has(`${prefix}0`) || cookieStore.has(`${prefix}1`) || cookieStore.has(`${loginVerifier}`))
}

export async function getAuth() {
    const cookieStore = await cookies()

    const client = createServerClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {}
                },
            },
        }
    );

    return client.auth;
}