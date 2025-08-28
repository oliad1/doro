import { EnrollmentsInfoDTO, EnrollmentsSidebarDTO, EnrollmentsCourseActionDTO, EnrollmentsDateDTO } from "../../types/enrollmentsTypes";

interface IEnrollmentsService {
  getEnrollment(jwt: string, id: string): Promise<EnrollmentsInfoDTO>,
  getEnrollments(jwt: string, term: string): Promise<EnrollmentsSidebarDTO[]>
  getEnrollmentDates(jwt: string, id: string): Promise<EnrollmentsDateDTO>
  addEnrollment(jwt: string, term: string, course_id: string): Promise<EnrollmentsCourseActionDTO>
  dropEnrollment(jwt: string, id: string): Promise<EnrollmentsCourseActionDTO>
}

export default IEnrollmentsService;
