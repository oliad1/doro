import { CourseSearchDTO, GetCoursesProps } from "../../types/outlinesTypes";

interface IOutlinesService {
  getCourses(props: GetCoursesProps) : Promise<CourseSearchDTO[]>
}

export default IOutlinesService;
