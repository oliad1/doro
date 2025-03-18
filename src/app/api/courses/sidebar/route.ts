import { getClient } from "@/lib/sql";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        const cookieStore = await cookies()
        const terms = {
            "1A": 0,
            "1B": 1,
            "2A": 2,
            "2B": 3,
            "3A": 4,
            "3B": 5,
            "4A": 6,
            "4B": 7
        }

        const index = 0;

        if (cookieStore.has('selected_courses')) {
            const term = cookieStore.get('term')

            if (term) {
                for (const [key, value] of Object.entries(terms)) {
                    if (key === term.value) {
                        console.log(`Term: ${key}, Index: ${value}`);
                        // Perform some logic using `key` and `value`
                    }
                }
            } else {
                console.error("No term found in cookies.");
                return NextResponse.json({ data: null, error: "No term found" }, { status: 404 })
            }

            const payload = {
                value: JSON.stringify({ term: index, course: cookieStore.get('selected_courses') })
            }

            console.log("Courses data returned successfully")
            return NextResponse.json({ data: payload }, { status: 200 })
        } else {

        }

        console.log("No courses data returned")
        return NextResponse.json({data: null}, {status: 201})

    } catch (error) {
        console.error("Internal Server Error");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}

export async function POST(Req:NextRequest){
    try {
        const cookieStore = await cookies()
        
        const { value: { code, id } } = await Req.json()
        
        // Validate input
        if (!code || !id) {
            return NextResponse.json(
                { error: "Invalid Request (Course Code / ID is required)" },
                { status: 400 }
            )
        }

        console.log("CODE: ", code)
        console.log("ID: ", id)

        if (!cookieStore.has('user_metadata') || !cookieStore.has('term')){
            console.error("User doesn't have metadata / Term data is not stored")
            return NextResponse.json({error: "User doesn't have metadata / Term data is not stored"}, {status: 404})
        }

        const metadata = cookieStore.get('user_metadata')
        const term = cookieStore.get('term')

        const formatted_metadata = JSON.parse(metadata!.value)
        const value = term!.value

        let { data, error } : {data: any, error: any} = await (await getClient())
            .from('profiles')
            .select(`${value}`)
            .eq('id', formatted_metadata.id)
            .single()

        let courseArray = []; //empty array

        if (data && Array.isArray(data[`${value}`])) {
            courseArray = data[`${value}`]
        } else {
            console.warn("Data is not formmated as an array. Initializing a new array");
            courseArray = []
        }

        courseArray.push({ id, code });
        console.log("Updated course array: ", courseArray);

        if (error) {
            console.error("Error returning selected_courses: ", error.message)
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        if (value in ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]){
            await (await getClient())
                .from('profiles')
                .update({ [value] : courseArray })
                .eq('id', formatted_metadata.id);
        }

        // // Set cookie with some additional options
        (await cookies()).set(`${value}`, JSON.stringify(courseArray), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            // maxAge: 60 * 60 * 24 * 7 // 1 week
        })

        

        return NextResponse.json(
            { message: "Course successfully added" },
            { status: 200 }
        )
    } catch (error){
        console.error("Internal Server Error")
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}