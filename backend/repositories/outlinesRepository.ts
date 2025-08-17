import { CourseInfoDTO, CourseSearchDTO, GetCoursesProps } from "../types/outlinesTypes";
import { DEPARTMENTS } from "../constants/RepositoryConstants";
import { supabase } from "../models/index";

class OutlinesRepository {
  async getCourse(id: string): Promise<CourseInfoDTO> {
    const { data, error } = await supabase
      .from("outlines")
      .select(`
	code,
	name,
	description,
	personnels (
	  name,
	  email,
	  role
	),
	assessment_groups ( 
	  weight,
	  count,
	  drop,
	  name,
	  type,
	  optional,
	  assessments (
	    weight,
	    index,
	    due_date,
	    name,
	    grades (
	      grade,
	      submitted_at,
	      assessment_id
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

  async getCourses(props: GetCoursesProps): Promise<CourseSearchDTO[]> {
    const { isVerified, page } = props; 
    const search = props.search;
    const dept = props.dept;
    const fac = props.fac;

    let coursesModel = supabase
      .from("outlines")
      .select(`
	id,
	code,
	name,
	description,
	author,
	enrollments
      `);

    if (!isVerified) {
      coursesModel = coursesModel.not("author", "is", null);
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

    const { data, error } = await coursesModel;

    if (error) {
      throw new Error(`${error.message}`);
    }

    return data;
  };
};

export default OutlinesRepository;
