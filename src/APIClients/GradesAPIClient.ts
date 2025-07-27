import { createClient } from "@/utils/supabase/client";
import { TermCourse } from "@/types/Types";

const supabase = createClient();

const getTermGrades = async (termCourses: TermCourse[]): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("grades")
      .select(`
	submitted_at,
	grade,
	assessments (
	  weight,
	  assessment_groups (
	    outlines (
	      code
	    )
	  )
	)
      `);

    if (error) {
      throw new Error(`Response status ${status}`)
    }
    return data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

const upsertGrade = async (id: string, value: number) : Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("grades")
      .upsert({
	assessment_id: id,
	grade: value
      }, {
	  onConflict: ['assessment_id', 'profile'],
	  ignoreDuplicates: false
	})
      .select(`
	id,
	submitted_at,
	assessments (
	  id,
	  assessment_groups (
	    id
	  )
	)
      `);

    if (error) {
      console.log("Error: There was a problem querying the course outline");
      throw new Error(`Error: There was a problem querying the course outline`);
    }

    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

const deleteGrade = async (id: string) : Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("grades")
      .delete()
      .eq("assessment_id", id)
      .select(`
	id,
	submitted_at,
	assessments (
	  id,
	  assessment_groups (
	    id
	  )
	)
      `);

    if (error) {
      console.log(`Error: There was a problem deleting the grade ${id}`);
      throw new Error(`Error: There was a problem deleting the grade ${id}`);
    }

    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

export default {
  getTermGrades,
  upsertGrade,
  deleteGrade
}
