import { CourseInfoDTO, CourseSearchDTO, GetCoursesProps } from "../../types/outlinesTypes";

interface IOutlinesService {
  getCourse(id: string) : Promise<CourseInfoDTO>
  getCourses(props: GetCoursesProps) : Promise<CourseSearchDTO[]>
}

export default IOutlinesService;
