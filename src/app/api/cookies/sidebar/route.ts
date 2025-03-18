import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const sidebar = (await cookies()).get('sidebar:state')

        if (!sidebar) {
            return NextResponse.json(
                { data: null, message: "No sidebar cookie found" },
                { status: 404 }
            )
        }

        console.log("sidebar", sidebar.value)
        return NextResponse.json({ data: sidebar.value }, { status: 200 })
    } catch (error) {
        console.error("Error retrieving sidebar cookie:", error)
        return NextResponse.json(
            { error: "Failed to retrieve sidebar" },
            { status: 500 }
        )
    }
}