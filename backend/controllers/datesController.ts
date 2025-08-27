import { Router } from "express";
import DatesService from "../services/implementations/datesService";
import IDatesService from "../services/interfaces/datesService.interface";
import { getErrorMessage } from "../utils/errorUtils";
import { isAuthorizedByExistence, getJWTHeader } from "../middlewares/auth";
import { UpsertDateProps } from "../types/datesTypes";

const datesRouter = Router();

const datesService: IDatesService = new DatesService();

datesRouter.post("/date", isAuthorizedByExistence(), async (req, res) => {
  try {
    const body = req.body.body as UpsertDateProps;
    const jwt = getJWTHeader(req)!;
    const data = await datesService.upsertDate(jwt, body);
    res.status(200).json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

datesRouter.delete("/date", isAuthorizedByExistence(), async (req, res) => {
  try {
    const { id } = req.body;
    const jwt = getJWTHeader(req)!;
    const data = await datesService.deleteDate(jwt, id);
    res.status(200).json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default datesRouter;
