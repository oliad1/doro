import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    const term = await req.json();

    if (!term) {
      return NextResponse.json(
	{ error: "Term is required" },
	{ status: 400 }
      )
    }

    cookieStore.set('term', term, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      // maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return NextResponse.json({ status: 200 })
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

    const term = cookieStore.get('term')?.value;

    if (!cookieStore.has('term') || !term) {
      cookieStore.set('term', "1A");

      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json({ data: term }, {status: 200})
  } catch (error) {
    console.error("Error retrieving term cookie:", error)
    return NextResponse.json(
      { error: "Failed to retrieve term" },
      { status: 500 }
    )
  }
}
