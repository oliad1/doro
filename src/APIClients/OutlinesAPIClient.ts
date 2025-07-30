import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const getCourse = async (course_id: string) : Promise<any> => {
  try {
    const { data, error, status } = await supabase
      .from("outlines")
      .select(`
	code,
	name,
	description,
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
}

export default {
  getCourse,
}
