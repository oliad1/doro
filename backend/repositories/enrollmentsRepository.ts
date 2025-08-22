import { EnrollmentsInfoDTO, EnrollmentsSidebarDTO, EnrollmentsCourseActionDTO } from "../types/enrollmentsTypes";
import { jwtSupabaseClient } from "../models/index";

class EnrollmentsRepository {
  async getEnrollment(jwt: string, id: string): Promise<EnrollmentsInfoDTO> {
    const { data, error } = await jwtSupabaseClient(jwt)
      .from("enrollments")
      .select(`
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
	    name,
	    role,
	    email
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
      .eq("id", id)
      .single();
    
    if (!data || error) {
      throw new Error(`Course ${id} not found.`);
    }

    return data;
  };

  async getEnrollments(jwt: string, term: string): Promise<EnrollmentsSidebarDTO[]> {
    const { data, error } = await jwtSupabaseClient(jwt)
      .from("enrollments")
      .select(`
	id,
	outlines (
	  code
	)
      `)
      .eq("term", term);

    if (!data || error) {
      throw new Error(`${term} enrollments not found.`);
    }

    return data;
  };

  async addEnrollment(jwt: string, term: string, course_id: string): Promise<EnrollmentsCourseActionDTO> {
    const { data, error } = await jwtSupabaseClient(jwt)
      .from("enrollments")
      .insert({
	term: term,
	course_id: course_id
      })
      .select("id")
      .single();
    
    if (!data || error) {
      throw new Error(`Could not enroll in ${course_id}.`);
    }

    return data;
  };

  async dropEnrollment(jwt: string, id: string): Promise<EnrollmentsCourseActionDTO> {
    const { data, error } = await jwtSupabaseClient(jwt)
      .from("enrollments")
      .delete()
      .eq("id", id)
      .select("id")
      .single();
    
    if (!data || error) {
      throw new Error(`Could not drop enrollment ${id}.`);
    }

    return data;
  }
}

export default EnrollmentsRepository;
