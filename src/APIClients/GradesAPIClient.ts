import { createClient } from "@/../utils/supabase/client";
import { TermCourse } from "@/types/ProfileTypes";

const supabase = createClient();

const getTermGrades = async (termCourses: TermCourse[]): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("grades")
      .select(`
	*
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
      .select();

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

const deleteGrade = async (id: string) : Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("grades")
      .delete()
      .eq("assessment_id", id)
      .select();

    if (error) {
      console.log(`Error: There was a problem deleting the grade ${id}`);
      throw new Error(`Error: There was a problem deleting the grade ${id}`);
    }

    return data;
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
