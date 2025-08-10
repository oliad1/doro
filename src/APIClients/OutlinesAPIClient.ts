import { createClient } from "@/utils/supabase/client";
import { CreateCourseState } from "@/stores/create-course-store";

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
}
