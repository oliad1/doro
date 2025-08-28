import { DatesActionDTO, UpsertDateProps, DatesDTO } from "../../types/datesTypes";

interface IDatesService {
  upsertDate(jwt: string, payload: UpsertDateProps): Promise<DatesActionDTO>
  deleteDate(jwt: string, id: string): Promise<DatesActionDTO>
}

export default IDatesService;
