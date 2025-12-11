import { Router } from "express";
import StatusService from "../services/implementations/statusService";
import IStatusService from "../services/interfaces/statusService.interface";
import { getErrorMessage } from "../utils/errorUtils";
import { isAuthorizedByExistence, getJWTHeader } from "../middlewares/auth";
import { UpsertStatusProps } from "../types/assessmentStatusesTypes";

const statusRouter = Router();

const statusService: IStatusService = new StatusService();

statusRouter.post("/status", isAuthorizedByExistence(), async (req, res) => {
  try {
    const body = req.body.body as UpsertStatusProps;
    const jwt = getJWTHeader(req)!;
    const data = await statusService.upsertStatus(jwt, body);
    res.status(200).json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

statusRouter.delete("/status", isAuthorizedByExistence(), async (req, res) => {
  try {
    const { id } = req.body;
    const jwt = getJWTHeader(req)!;
    const data = await statusService.deleteStatus(jwt, id);
    res.status(200).json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default statusRouter;
