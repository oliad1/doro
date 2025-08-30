import { CourseSearchDTO, GetCoursesProps } from "../types/outlinesTypes";
import { DEPARTMENTS } from "../constants/RepositoryConstants";
import { supabase, jwtSupabaseClient } from "../models/index";

class OutlinesRepository {
  async getCourses(props: GetCoursesProps): Promise<CourseSearchDTO[]> {
    const { isVerified, page } = props; 
    const search = props.search;
    const dept = props.dept;
    const fac = props.fac;
    const term = props.term;
    const types = props.types;

    let coursesModel = supabase
      .from("outlines")
      .select(`
	id,
	code,
	name,
	description,
	author,
	enrollments,
	term,
	url,
	types_filter:types ${types?.length ? '!inner' : ''} (
	  type
	),
	types:types (
	  type
	)
      `);

    if (!isVerified) {
      coursesModel = coursesModel
	.not("author", "is", null)
	.order("enrollments", { ascending: false });
    } else {
      coursesModel = coursesModel.is("author", null);
    }

    const start = 10*(page-1); //0, 10

    coursesModel = coursesModel.range(start, (start+10));

    if (search && search.length) {
      coursesModel = coursesModel.or(`code.ilike.${search}%, name.ilike.${search}%`);
    }

    if (dept && dept.length) {
      coursesModel = coursesModel.like("code", `%${dept}%`);
    }

    if (typeof fac == "number") {
      const facFilters = DEPARTMENTS[fac].map((code) => `code.ilike.${code}%`).join(',');
      coursesModel = coursesModel.or(facFilters);
    }

    if (typeof term == "number") {
      coursesModel = coursesModel.eq("term", term);
    }

    if (types?.length) {
      coursesModel = coursesModel.in("types_filter.type", types);
    }

    const { data, error } = await coursesModel;

    if (error) {
      throw new Error(`${error.message}`);
    }

    return data;
  };

  async incrementEnrollment(jwt: string, course_id: string): Promise<any> {
    try {
      const { data, error } = await jwtSupabaseClient(jwt)
	.rpc("increment_enrollment", {
	  _course_id: course_id
	});

      if (error) {
	throw new Error(`Failed to increment enrollment. Reason: ${error.message}`);
      }

      return data;
    } catch (error: unknown) {
      console.log("Error:", error);
      return;
    }
  };

  async decrementEnrollment(jwt: string, enrollment_id: string): Promise<any> {
    try {
      const { data, error } = await supabase
	.rpc("decrement_enrollment", {
	  _enrollment_id: enrollment_id
	});
      
      if (!data || error) {
	throw new Error(`Failed to decrement enrollment. Reason: ${error?.message}`);
      }

      return data;
    } catch (error: unknown) {
      console.log("Error:", error);
      return;
    }
  };
};

export default OutlinesRepository;
