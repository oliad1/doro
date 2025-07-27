import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const getCourse = async (id: string) : Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("outlines")
      .select(`
	code,
	name,
	description,
	assessment_groups ( 
	  *,
	  assessments (
	    *,
	    grades(
	      grade,
	      submitted_at,
	      assessment_id
	    )
	  )
	)
      `)
      .eq("id", id)
//      .eq("assessment_groups.assessments.grades.profile", authId)
      .single();

    if (error) {
      console.log("Error: There was a problem querying the course outline");
      throw new Error(`Error: There was a problem querying the course outline`);
    }

    return data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

export default {
  getCourse
}
