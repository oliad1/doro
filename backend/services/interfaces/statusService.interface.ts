import {
  StatusActionDTO,
  UpsertStatusProps,
} from "../../types/assessmentStatusesTypes";

interface IDatesService {
  upsertStatus(
    jwt: string,
    payload: UpsertStatusProps,
  ): Promise<StatusActionDTO>;
  deleteStatus(jwt: string, id: string): Promise<StatusActionDTO>;
}

export default IDatesService;
