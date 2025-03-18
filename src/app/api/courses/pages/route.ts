import { getClient } from "@/lib/sql";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(Req: NextRequest){
    try {
        let courseData;
        const { value: id } = await Req.json()

        //TODO: Not working for now
        // if (!request){ //Invalid request
        //     console.error("Invalid request. GET requires a course uuid")
        //     return NextResponse.json({error: "Invalid Request. GET requires a course uuid"}, {status: 401})
        // }

        //Cache data since class weights, prof, etc, is saved
        const cookieStore = await cookies()

        if (cookieStore.has('course_pages')){
            const value = cookieStore.get('course_pages')
            courseData = JSON.parse(value!.value)

            console.log("ID DATA:", id.id)

            for (let i=0; i < courseData[0].length; i++){
                //Need to use a for loop
                if (courseData[0][i].id == id.id) { //TODO: This doesn't really work...
                    console.log("Course data already cached")
                    return NextResponse.json({ data: courseData[0][i] }, { status: 201 })
                } //ELSE CASE: course cache exists just not for this specific course
            }
        }

        const { data, error } = await (await getClient())
            .from('outlines')
            .select()
            .eq('id', id.id)

        if (error) {
            console.error('ERROR: ', error.message)
            return NextResponse.json({error: error.message}, {status: 400})
        }

        if (!data || !data[0]){
            console.error("No data found")
            return NextResponse.json({error: "No data found"}, {status: 404})
        }

        if (!cookieStore.has('course_pages')){
            courseData = []
        }

        courseData.push(data)

        cookieStore.set('course_pages', JSON.stringify(courseData))

        console.log("Successfully returned course metadata")
        return NextResponse.json({data: data[0]}, {status: 200})
    } catch (error) {
        console.error("Internal Server Error")
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}