import StatusRepository from "../../repositories/statusesRepository";
import {
  StatusActionDTO,
  StatusDTO,
  UpsertStatusProps,
} from "../../types/assessmentStatusesTypes";
import IStatusService from "../implementations/statusService";
import logger from "../../utils/logger";
import { getErrorMessage } from "../../utils/errorUtils";

const Logger = logger(__filename);

class StatusService implements IStatusService {
  statusRepository: StatusRepository;

  constructor() {
    this.statusRepository = new StatusRepository();
  }

  async upsertStatus(
    jwt: string,
    payload: UpsertStatusProps,
  ): Promise<StatusActionDTO> {
    let data: Promise<StatusActionDTO>;

    try {
      data = this.statusRepository.upsertStatus(jwt, payload);
    } catch (error: unknown) {
      Logger.error(
        `Failed to insert status. Reason: ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return data;
  }

  async deleteStatus(jwt: string, id: string): Promise<StatusActionDTO> {
    let data: Promise<StatusActionDTO>;

    try {
      data = this.statusRepository.deleteStatus(jwt, id);
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete status. Reason: ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return data;
  }
}

export default StatusService;
