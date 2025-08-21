import { CourseSearchDTO, GetCoursesProps } from "../types/outlinesTypes";
import { DEPARTMENTS } from "../constants/RepositoryConstants";
import { supabase } from "../models/index";

class OutlinesRepository {
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
