import GradesRepository from "../../repositories/gradesRepository";
import {
  GradesDTO,
  GradeActionDTO,
  UpsertGradeProps,
} from "../../types/gradesTypes";
import IGradesService from "../implementations/gradesService";
import logger from "../../utils/logger";
import { getErrorMessage } from "../../utils/errorUtils";

const Logger = logger(__filename);

class GradesService implements IGradesService {
  gradesRepository: GradesRepository;

  constructor() {
    this.gradesRepository = new GradesRepository();
  }

  async getGrades(jwt: string, term: string): Promise<GradesDTO[]> {
    let data: GradesDTO[];

    try {
      data = await this.gradesRepository.getGrades(jwt);
      data = data.filter((grade) => grade.enrollments?.term == term);
    } catch (error: unknown) {
      Logger.error(`Failed to get grades. Reason: ${getErrorMessage(error)}`);
      throw error;
    }

    return data;
  }

  async upsertGrade(
    jwt: string,
    payload: UpsertGradeProps,
  ): Promise<GradeActionDTO> {
    let data: Promise<GradeActionDTO>;

    try {
      data = this.gradesRepository.upsertGrade(jwt, payload);
    } catch (error: unknown) {
      Logger.error(`Failed to insert grade. Reason: ${getErrorMessage(error)}`);
      throw error;
    }

    return data;
  }

  async deleteGrade(jwt: string, id: string): Promise<GradeActionDTO> {
    let data: Promise<GradeActionDTO>;

    try {
      data = this.gradesRepository.deleteGrade(jwt, id);
    } catch (error: unknown) {
      Logger.error(`Failed to delete grade. Reason: ${getErrorMessage(error)}`);
      throw error;
    }

    return data;
  }
}

export default GradesService;
