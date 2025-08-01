import { createClient } from "@/utils/supabase/client";
import { Term, TermCourse } from "@/types/Types";

const supabase = createClient();

const getCourses = async (term: Term) => {
  try {
    const { data, error, status } = await supabase
      .from("enrollments")
      .select(`
	id,
	profile,
	outlines (
	  code
	)
      `)
      .eq("term", term);

    if (error) {
      throw new Error(`Response status ${status}`)
    }

    if (!data) {
      throw new Error(`Response status ${status}`)
    }

    const transformedData = data.map((enrollment) => ({
      id: enrollment.id,
      code: enrollment.outlines.code
    }));

    return transformedData;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

const getEnrollment = async (enrollment_id: string) => {
  try {
    const { data, error, status } = await supabase
      .from("enrollments")
      .select(`
	outlines (
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
	)
      `)
      .eq("id", enrollment_id)
      .single();

    if (error) {
      throw new Error(`Response status ${status}`)
    }

    if (!data) {
      throw new Error(`Response status ${status}`)
    }

    return data.outlines;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
  
};

const addCourse = async (course: TermCourse, term: Term) => {
  try {
    if (course && term) {
      const payload = {
	"term": term,
	"course_id": course.id,
      };
      
      const { data, error, status } = await supabase
	.from("enrollments")
	.upsert(payload)
	.select();

      if (error) {
	throw new Error(`Response status ${status}`)
      }
      return Array.isArray(data) ? data[0] : data;
    }
    return null;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

const dropCourse = async (course: TermCourse, term: Term) => {
  try {
    if (course && term) {
      const { data, error, status } = await supabase
	.from("enrollments")
	.delete()
	.eq("term", term)
	.eq("course_id", course.id)
	.single();

      if (error) {
	throw new Error(`Response status ${status}`)
      }
      return Array.isArray(data) ? data[0] : data;
    }
    return null;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

export default {
  getCourses,
  getEnrollment,
  addCourse,
  dropCourse,
};
