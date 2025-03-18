import { getAuth, verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest){
    const response = NextResponse.next()

    const cookieStore = await cookies()
    const firstLogIn = !cookieStore.has('term')

    const isAuthenticated = await verifyAuth();

    console.log("IS AUTH:", isAuthenticated)

    if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (firstLogIn) {
        const payload = {
            title: "1A",
            index: 0,
        }

        cookieStore.set('term', JSON.stringify(payload));
    }

    return response;
}

export const config = {
    matcher: ["/home", "/search", "/course/:path"], 
}