import { getClient } from "@/lib/sql";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    try {
        const { searchParams } = new URL(request.url)

        const departments = [
            ["AE", "BME", "CHE", "CIVE", "ECE", "ME", "MSCI", "MSE", "MTE", "NE", "SE", "SYDE"],
            ["AMATH", "ACTSC", "CO", "CS", "MATH", "STAT"],
            ["ASTRN", "BIOL", "CHEM", "EARTH", "OPTOM", "PHYS", "SCBUS", "SCI"],
            ["HEALTH", "HLTH", "KIN", "PHS", "REC"],
            ["ERS", "GEOG", "INTEG", "PLAN"],
            ["AFM", "APPLS", "ANTH", "BLKST", "CLAS", "COMMST", "EASIA", "ECON", "EMLS", "ENGL", "FINE", "FR", "GER", "GBDA", "GSJ", "GGOV", "HIST", "ISS", "ITAL", "ITALST", "JS", "LS", "MEDVL", "MUSIC", "PACS", "PHIL", "PSCI", "PSYCH", "RS", "SDS", "SMF", "SOC", "SOCWK", "SWK", "SWREN", "SPAN", "TS"],
            ["BET", "PD", "SAF", "ARCH", "DAC", "ENBUS", "SFM"]
        ];

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
        
        let courseQuery = (await getClient())
            .from('outlines')
            .select("id, course_code, course_name, course_description")
            .like("course_code", `%${search ?? ''}%`)
            .like('course_code', `%${dept ?? ''}%`)
            .range(start, (start + 10))

        if (searchParams.has('fac')){
            const facFilters = departments[facultyIndex].map((code) => `course_code.ilike.${code}%`).join(',');
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