import OutlinesRepository from "../../repositories/outlinesRepository";
import { CourseSearchDTO, GetCoursesProps } from "../../types/outlinesTypes";
import IOutlinesService from "../interfaces/outlinesService.interface";
import logger from "../../utils/logger";
import { getErrorMessage } from "../../utils/errorUtils";

const Logger = logger(__filename);

class OutlinesService implements IOutlinesService {
  outlinesRepository: OutlinesRepository;
  
  constructor() {
    this.outlinesRepository = new OutlinesRepository();
  }

  async getCourses(props: GetCoursesProps): Promise<CourseSearchDTO[]> {
    let data: Promise<CourseSearchDTO[]>;

    try {
      data = this.outlinesRepository.getCourses(props);
    } catch (error: unknown) {
      Logger.error(`Failed to get courses. Reason: ${getErrorMessage(error)}`);
      throw error;
    }

    return data;
  };
};

export default OutlinesService;
