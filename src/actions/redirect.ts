'use server'

import { redirect } from 'next/navigation'

export async function navigate(href: string) {
    redirect(`${href}`);
}