import { createClient } from "@/utils/supabase/client";
import { Term, TermCourse } from "@/types/Types";

const supabase = createClient();

const getCourses = async (term: Term) => {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const authId = auth?.user?.id;
    
    if (!authId) {
      throw new Error(`User is not authenticated`);
    };

    const { data, error, status } = await supabase
      .from("enrollments")
      .select(`
	*,
	outlines (
	  code
	)
      `)
      .eq("term", term)
      .eq("profile", authId);

    if (error) {
      throw new Error(`Response status ${status}`)
    }

    if (!data) {
      throw new Error(`Response status ${status}`)
    }

    const transformedData = data.map((course) => ({
      id: course.course_id,
      code: course.outlines.code
    }));

    return transformedData;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

const addCourse = async (course: TermCourse, term: Term) => {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const authId = auth?.user?.id;

    if (authId && course && term) {
      const payload = {
	"term": term,
	"course_id": course.id,
	"profile": authId
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
    const { data: auth } = await supabase.auth.getUser();
    const authId = auth?.user?.id;

    if (authId && course && term) {
      const { data, error, status } = await supabase
	.from("enrollments")
	.delete()
	.eq("term", term)
	.eq("course_id", course.id)
	.eq("profile", authId)
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
  addCourse,
  dropCourse,
};
