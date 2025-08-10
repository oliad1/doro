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
	grades (
	  grade,
	  submitted_at,
	  assessment_id
	),
	outlines (
	  code,
	  name,
	  description,
	  conditions (
	    scheme,
	    group_id:group_id (
	      name
	    ),
	    lower,
	    formula,
	    condition_group_id (
	      symbol
	    )
	  ),
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
    const payload = {
      "term": term,
      "course_id": course.id,
    };

    const { data, error, status } = await supabase
      .from("enrollments")
      .upsert(payload)
      .select(`
	id
      `);

    if (error) {
      throw new Error(`Response status ${status}`)
    }
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

const dropCourse = async (course: TermCourse, term: Term) => {
  try {
    const { data, error, status } = await supabase
      .from("enrollments")
      .delete()
      .eq("term", term)
      .eq("course_id", course.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Response status ${status}`)
    }
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

const dropEnrollment = async (enrollmentId: string) => {
  try {
    const { data, error, status } = await supabase
      .from("enrollments")
      .delete()
      .eq("id", enrollmentId)
      .single();

    if (error) {
      throw new Error(`Response status ${status}`)
    }
    return Array.isArray(data) ? data[0] : data;
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
  dropEnrollment,
};
