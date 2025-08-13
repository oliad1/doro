import { createClient } from "@/utils/supabase/client";
import { CreateCourseState } from "@/stores/create-course-store";
import { DEPARTMENTS } from '@/constants/SearchConstants';
import { getParamsFromUrl } from "@/utils/helpers";

const supabase = createClient();

const getCourse = async (course_id: string) : Promise<any> => {
  try {
    const { data, error, status } = await supabase
      .from("outlines")
      .select(`
	code,
	name,
	description,
	personnels (
	  *
	),
	assessment_groups ( 
	  *,
	  assessments (
	    *,
	    grades (
	      grade,
	      submitted_at,
	      assessment_id
	    )
	  )
	)
      `)
      .eq("id", course_id)
//      .eq("assessment_groups.assessments.grades.profile", authId)
      .single();

    if (error) {
      throw new Error(`Response status ${status}`);
    }

    return data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

const searchCourses = async (searchParams: string): Promise<{ data: any[], hasNextPage: boolean } | void> => {
  try {
    const { page, search, dept, fac } = getParamsFromUrl(searchParams);

    const pageValue = Number.parseInt(page!);
    const facultyIndex = Number.parseInt(fac!);
    const start = 10*(pageValue-1); //0, 10

    let searchQuery = supabase
      .from("outlines")
      .select(`
	id,
	code,
	name,
	description
      `)
      .like("code", `%${search ?? ''}%`)
      .like('code', `%${dept ?? ''}%`)
      .range(start, (start + 10))
      .is("author", null);

    if (fac){
      const facFilters = DEPARTMENTS[facultyIndex].map((code) => `code.ilike.${code}%`).join(',');
      searchQuery = searchQuery.or(facFilters)
    }

    const { data, error, status } = await searchQuery;

    if (error) {
      throw new Error(`Response status ${status}`);
    }

    const hasNextPage = data.length > 10;

    if (hasNextPage) {
      data.pop();
    }

    return { data, hasNextPage };
  } catch (error) {
    console.log("Error:", error);
    return;
  }
};

const getCommunityCourses = async () => {
  try {
    const { data, error, status } = await supabase
      .from("outlines")
      .select(`
	id,
	code,
	name,
	description,
	enrollments,
	author
      `)
      .not("author", "is", null);

    if (error) {
      throw new Error(`Response status ${status}. Error: ${JSON.stringify(error)}`);
    }

    return data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};


const createCourse = async (course_data: CreateCourseState) => {
  try {
    const { data, error, status } = await supabase
      .rpc("create_course", {
	_course_type: course_data.courseType,
	_code: course_data.code,
	_name: course_data.name,
	_description: course_data.description,
	_assessment_groups: course_data.assessmentGroups,
	_assessments: course_data.assessments,
	_condition_groups: course_data.conditionGroups,
	_conditions: course_data.conditions,
	_personnels: course_data.personnels,
    });

    if (error) {
      throw new Error(`Response status ${status}`);
    }

    return data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export default {
  getCourse,
  createCourse,
  getCommunityCourses,
  searchCourses,
}
