import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
	const cookieStore = await cookies();

        if (!cookieStore.has('sidebar:state')) {
	    cookieStore.set('sidebar:state', 'true');
        }

        return NextResponse.json({ data: cookieStore.get('sidebar:state')?.value }, { status: 200 })
    } catch (error) {
        console.error("Error retrieving sidebar cookie:", error)
        return NextResponse.json(
            { error: "Failed to retrieve sidebar" },
            { status: 500 }
        )
    }
}
