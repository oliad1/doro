import { createClient } from "@/utils/supabase/client";
import { Term, TermCourse } from "@/types/Types";
import { isSuccess } from "@/utils/apiUtils";
import baseAPIClient from "@/APIClients/BaseAPIClient";

const supabase = createClient();
const base = await baseAPIClient();

const getEnrollments = async (term: Term) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const jwt = session!.access_token;
    
    const res = await base.get(
      `/enrollments/term/${term}`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    if (!isSuccess(res)) {
      throw new Error(`Response status ${res.status}`);
    }

    const transformedData = res.data.map((enrollment: any) => ({
      id: enrollment.id,
      code: enrollment.outlines.code,
      verified: enrollment.outlines.author==null,
      c_id: enrollment.outlines.id,
      url: enrollment.outlines.url
    }));

    return transformedData;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

const getEnrollment = async (enrollment_id: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const jwt = session!.access_token;
    
    const res = await base.get(
      `/enrollments/course/${enrollment_id}`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    if (!isSuccess(res)) {
      throw new Error(`Response status ${res.status}`);
    }

    return res.data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

const addEnrollment = async (course: TermCourse, term: Term) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const jwt = session!.access_token;
    
    const res = await base.post(
      `/enrollments/course`, {
	term: term,
	course_id: course.id
      }, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    if (!isSuccess(res)) {
      throw new Error(`Response status ${res.status}`);
    }

    return res.data; 
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

const dropEnrollment = async (id: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const jwt = session!.access_token;
    
    const res = await base.delete(
      `/enrollments/course`, {
      headers: { Authorization: `Bearer ${jwt}` },
      data: {
	id: id,
      }
    });

    if (!isSuccess(res)) {
      throw new Error(`Response status ${res.status}`);
    }

    return res.data; 
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

export default {
  getEnrollments,
  getEnrollment,
  addEnrollment,
  dropEnrollment,
};
