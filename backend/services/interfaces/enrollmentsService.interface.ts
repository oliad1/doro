import { EnrollmentsInfoDTO, EnrollmentsSidebarDTO, EnrollmentsCourseActionDTO } from "../../types/enrollmentsTypes";

interface IEnrollmentsService {
  getEnrollment(jwt: string, id: string): Promise<EnrollmentsInfoDTO>,
  getEnrollments(jwt: string, term: string): Promise<EnrollmentsSidebarDTO[]>
  addEnrollment(jwt: string, term: string, course_id: string): Promise<EnrollmentsCourseActionDTO>
  dropEnrollment(jwt: string, id: string): Promise<EnrollmentsCourseActionDTO>
}

export default IEnrollmentsService;
