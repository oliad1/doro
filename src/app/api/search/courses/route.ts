import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/../utils/supabase/server'; 
import { DEPARTMENTS } from '@/constants/SearchConstants';

export async function GET(request: NextRequest){
    try {
        const { searchParams } = new URL(request.url)

        const page = searchParams.get('page')
        const search = searchParams.get('search')
        const dept = searchParams.get('dept')
        const faculty = searchParams.get('fac')
        // const { value: { page, search }} = await Req.json()

        console.log("SERVER SEARCH CONDITION: ", searchParams.has('page'))

        if (!searchParams.has('page')){
            return NextResponse.redirect(new URL('/404', request.url));
        }

        console.log("SERVER SIDE SEARCH PARAMS:", page, search, dept, faculty)

        const pageValue = Number.parseInt(page!)
        const facultyIndex = Number.parseInt(faculty!)

        const start:number = 10*(pageValue-1); //0, 10

	const supabase = await createClient();
        
        let courseQuery = supabase
            .from('outlines')
            .select("id, course_code, course_name, course_description")
            .like("course_code", `%${search ?? ''}%`)
            .like('course_code', `%${dept ?? ''}%`)
            .range(start, (start + 10))

        if (searchParams.has('fac')){
            const facFilters = DEPARTMENTS[facultyIndex].map((code) => `course_code.ilike.${code}%`).join(',');
            courseQuery = courseQuery.or(facFilters)
        }

        const { data, error } = await courseQuery

        // Error handling for courseQuery
        if (error) {
            console.error("Error fetching course information", error.message);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        //Non-error, sometimes the query returns nothing
        if (!data || !data[0]) {
        //     console.error("No classes found");
            return NextResponse.json({ data: null }, { status: 201 });
        }

        const ids = data.map(row => row.id);
        const courseCodes = data.map(row => row.course_code);
        const courseNames = data.map(row => row.course_name);
        const courseDescriptions = data.map(row => row.course_description);

        return NextResponse.json({ ids, courseCodes, courseNames, courseDescriptions }, { status: 200 });
        // return NextResponse.json({data: null}, {status: 205});
    }
    catch (error) {
        console.error("Internal Server Error");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
