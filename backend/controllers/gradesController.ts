import { Router } from "express";
import GradesService from "../services/implementations/gradesService";
import IGradesService from "../services/interfaces/gradesService.interface";
import { getErrorMessage } from "../utils/errorUtils";
import { isAuthorizedByExistence, getJWTHeader } from "../middlewares/auth";
import { UpsertGradeProps } from "../types/gradesTypes";

const gradesRouter = Router();

const gradesService: IGradesService = new GradesService();

gradesRouter.get("/term/:term", isAuthorizedByExistence(), async (req, res) => {
  try {
    const term = req.params.term;
    const jwt = getJWTHeader(req)!;
    const data = await gradesService.getGrades(jwt, term);
    res.status(200).json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

gradesRouter.post("/grade", isAuthorizedByExistence(), async (req, res) => {
  try {
    const body = req.body.body as UpsertGradeProps;
    const jwt = getJWTHeader(req)!;
    const data = await gradesService.upsertGrade(jwt, body);
    res.status(200).json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

gradesRouter.delete("/grade", isAuthorizedByExistence(), async (req, res) => {
  try {
    const { id } = req.body;
    const jwt = getJWTHeader(req)!;
    const data = await gradesService.deleteGrade(jwt, id);
    res.status(200).json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default gradesRouter;
