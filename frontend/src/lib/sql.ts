"use server"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '../../database.types';

export async function getClient() {
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

    return client;
}