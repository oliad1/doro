import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    const title = await req.json();

    // Validate input
    if (!title) {
      return NextResponse.json(
	{ error: "Term is required" },
	{ status: 400 }
      )
    }

    // Set cookie with some additional options
    cookieStore.set('term', title, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      // maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return NextResponse.json(
      { message: "Term updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error setting term cookie:", error)
    return NextResponse.json(
      { error: "Failed to set term" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();

    if (!cookieStore.has('term')){
      cookieStore.set('term', "1A");

      return new NextResponse(null, { status: 204 });
    }

    const term = cookieStore.get('term')?.value;

    return NextResponse.json({ data: { term: term } }, {status: 200})
  } catch (error) {
    console.error("Error retrieving term cookie:", error)
    return NextResponse.json(
      { error: "Failed to retrieve term" },
      { status: 500 }
    )
  }
}
