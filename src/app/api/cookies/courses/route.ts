import { getClient } from "@/lib/sql";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    const cookieStore = await cookies()

    if (!cookieStore.has('user_metadata')){
        console.error("User doesn't have metadata")
        return NextResponse.json({ error: "User doesn't have metadata" }, { status: 404 })
    }
    
    if (!cookieStore.has('courses')){
        console.log("No course information available")

        //Run POST METHOD
        const metadata = cookieStore.get('user_metadata')
        const formatted_metadata = JSON.parse(metadata!.value)

        const terms: string[] = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]

        let courses = []

        for (const term of terms) {
            const data = await (await getClient())
                .from('profiles')
                .select(term)
                .eq('id', formatted_metadata.id)

            // console.log(term, data, data.error)
            //TODO: Fix typescript error
            const termData = data!.data![0][term]

            if (data.error) {
                console.error("ERROR: ", data.error.message)
                return NextResponse.json({ message: data.error.message }, { status: 400 })
            }

            if (!data) {
                console.error("No data returned")
                return NextResponse.json({ message: "No data returned" }, { status: 404 })
            }

            courses.push((termData)??[])
        }

        const coursesString = JSON.stringify(courses);

        cookieStore.set('courses', coursesString)

        return NextResponse.json({ data: coursesString }, { status: 200 })

    } else {
        console.log("Courses cached in cookies")

        const value = cookieStore.get('courses')

        if (!value){
            console.error("Internal Server Error")
            return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
        }

        return NextResponse.json({ data: value.value }, { status: 200 })
    }
}