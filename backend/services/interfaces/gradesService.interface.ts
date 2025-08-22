import { GradesDTO, GradeActionDTO, UpsertGradeProps } from "../../types/gradesTypes";

interface IGradesService {
  getGrades(jwt: string, term: string): Promise<GradesDTO[]>
  upsertGrade(jwt: string, payload: UpsertGradeProps): Promise<GradeActionDTO>
  deleteGrade(jwt: string, id: string): Promise<GradeActionDTO>
}

export default IGradesService;
