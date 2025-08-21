import EnrollmentsRepository from "../../repositories/enrollmentsRepository";
import { EnrollmentsInfoDTO, EnrollmentsSidebarDTO, EnrollmentsCourseActionDTO } from "../../types/enrollmentsTypes";
import IEnrollmentsService from "../interfaces/enrollmentsService.interface";
import logger from "../../utils/logger";
import { getErrorMessage } from "../../utils/errorUtils";

const Logger = logger(__filename);

class EnrollmentsService implements IEnrollmentsService {
  enrollmentsRepository: EnrollmentsRepository;

  constructor () {
    this.enrollmentsRepository = new EnrollmentsRepository();
  }

  async getEnrollment(jwt: string, id: string): Promise<EnrollmentsInfoDTO> {
    let data: Promise<EnrollmentsInfoDTO>;

    try {
      data = this.enrollmentsRepository.getEnrollment(jwt, id);
    } catch (error: unknown) {
      Logger.error(`Failed to get course info. Reason: ${getErrorMessage(error)}`);
      throw error;
    }

    return data;
  };

  async getEnrollments(jwt: string, term: string): Promise<EnrollmentsSidebarDTO[]> {
    let data: Promise<EnrollmentsSidebarDTO[]>;

    try {
      data = this.enrollmentsRepository.getEnrollments(jwt, term);
    } catch (error: unknown) {
      Logger.error(`Failed to get term enrollments. Reason: ${getErrorMessage(error)}`);
      throw error;
    }

    return data;
  };

  async addEnrollment(jwt: string, term: string, course_id: string): Promise<EnrollmentsCourseActionDTO> {
    let data: Promise<EnrollmentsCourseActionDTO>;
    
    try {
      data = this.enrollmentsRepository.addEnrollment(jwt, term, course_id);
    } catch (error: unknown) {
      Logger.error(`Failed to add enrollment. Reason: ${getErrorMessage(error)}`);
      throw error;
    }

    return data;
  };

  async dropEnrollment(jwt: string, id: string): Promise<EnrollmentsCourseActionDTO> {
    let data: Promise<EnrollmentsCourseActionDTO>;
    
    try {
      data = this.enrollmentsRepository.dropEnrollment(jwt, id);
    } catch (error: unknown) {
      Logger.error(`Failed to drop enrollment. Reason: ${getErrorMessage(error)}`);
      throw error;
    }

    return data;
  };

};

export default EnrollmentsService;
