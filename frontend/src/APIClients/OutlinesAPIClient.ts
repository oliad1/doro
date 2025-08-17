import { createClient } from "@/utils/supabase/client";
import { CreateCourseState } from "@/stores/create-course-store";
import { DEPARTMENTS } from '@/constants/SearchConstants';
import { getParamsFromUrl } from "@/utils/helpers";
import { isSuccess } from "@/utils/apiUtils";
import baseAPIClient from "@/APIClients/BaseAPIClient";

const supabase = createClient();
const base = await baseAPIClient();

const getCourse = async (course_id: string) : Promise<any|void> => {
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
    return;
  }
};

const searchCourses = async (searchParams: string, isVerified: boolean): Promise<{ data: any[], hasNextPage: boolean } | void> => {
  try {
    //const { page, search, dept, fac } = getParamsFromUrl(searchParams);

    const { data: { session } } = await supabase.auth.getSession();
    const jwt = session!.access_token;
    
    const res = await base.get(`/outlines/courses/?isVerified=${isVerified.toString()}&${searchParams.substring(1)}`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    if (!isSuccess(res)) {
      throw new Error(`Response status ${res.status}`);
    }

    const data = res.data;

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
  searchCourses,
  createCourse,
};
