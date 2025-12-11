import DatesRepository from "../../repositories/datesRepository";
import {
  DatesActionDTO,
  UpsertDateProps,
  DatesDTO,
} from "../../types/datesTypes";
import IDatesService from "../implementations/datesService";
import logger from "../../utils/logger";
import { getErrorMessage } from "../../utils/errorUtils";

const Logger = logger(__filename);

class DatesService implements IDatesService {
  datesRepository: DatesRepository;

  constructor() {
    this.datesRepository = new DatesRepository();
  }

  async upsertDate(
    jwt: string,
    payload: UpsertDateProps,
  ): Promise<DatesActionDTO> {
    let data: Promise<DatesActionDTO>;

    try {
      data = this.datesRepository.upsertDate(jwt, payload);
    } catch (error: unknown) {
      Logger.error(`Failed to insert date. Reason: ${getErrorMessage(error)}`);
      throw error;
    }

    return data;
  }

  async deleteDate(jwt: string, id: string): Promise<DatesActionDTO> {
    let data: Promise<DatesActionDTO>;

    try {
      data = this.datesRepository.deleteDate(jwt, id);
    } catch (error: unknown) {
      Logger.error(`Failed to delete date. Reason: ${getErrorMessage(error)}`);
      throw error;
    }

    return data;
  }
}

export default DatesService;
