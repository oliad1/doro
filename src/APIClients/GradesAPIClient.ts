import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const getTermGrades = async (term: string): Promise<any> => {
  try {
    const { data, error, status } = await supabase
      .from("grades")
      .select(`
	submitted_at,
	grade,
	enrollments (
	  term
	),
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

    const filteredData = data.filter((grade) => grade.enrollments.term==term);

    return filteredData;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

const upsertGrade = async (id: string, value: number, enrollmentId: string) : Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("grades")
      .upsert({
	assessment_id: id,
	grade: value,
	enrollment_id: enrollmentId,
      }, {
	  onConflict: ['assessment_id', 'enrollment_id'],
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
