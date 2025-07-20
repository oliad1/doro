import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();

    if (cookieStore.has('user_metadata')){
      const metadata = cookieStore.get('user_metadata');

      if (metadata?.value){
	return NextResponse.json({ data: metadata.value }, {status: 200 })
      }
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error retrieving metadata cookie:", error);
    return NextResponse.json({ error: "Failed to retrieve metadata" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    const { user } = await req.json();

    if (!user) {
      return NextResponse.json(
	{ error: "User metadata is required" },
	{ status: 400 }
      )
    }

    // Set cookie with some additional options
    cookieStore.set('user_metadata', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      // maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return NextResponse.json(
      { message: "User data fetched successfully" },
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

export async function DELETE(){
  try {
    const cookieStore = await cookies()

    const test = cookieStore.delete('user_metadata');

    console.log("TESTING DELETE COOKIE", test);

    return NextResponse.json({data: test}, {status: 200});
  } catch (error){
    console.error("Unexpected error deleting auth cookie:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
