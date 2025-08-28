import { Router } from "express";
import EnrollmentsService from "../services/implementations/enrollmentsService";
import IEnrollmentsService from "../services/interfaces/enrollmentsService.interface";
import { getErrorMessage } from "../utils/errorUtils";
import { isAuthorizedByExistence, getJWTHeader } from "../middlewares/auth";

const enrollmentsRouter = Router();

const enrollmentsService: IEnrollmentsService = new EnrollmentsService();

enrollmentsRouter.get("/course/:id", isAuthorizedByExistence(), async (req, res) => {
  try {
    const courseId = req.params.id;
    const jwt = getJWTHeader(req)!;
    const data = await enrollmentsService.getEnrollment(jwt, courseId);
    res.status(200).json(data.outlines);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

enrollmentsRouter.get("/term/:term", isAuthorizedByExistence(), async (req, res) => {
  try {
    const term = req.params.term;
    const jwt = getJWTHeader(req)!;
    const data = await enrollmentsService.getEnrollments(jwt, term);
    res.status(200).json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

enrollmentsRouter.get("/dates/:id", isAuthorizedByExistence(), async (req, res) => {
  try {
    const id = req.params.id;
    const jwt = getJWTHeader(req)!;
    const data = await enrollmentsService.getEnrollmentDates(jwt, id);
    res.status(200).json(data.outlines);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

enrollmentsRouter.post("/course/", isAuthorizedByExistence(), async (req, res) => {
  try {
    const { term , course_id } = req.body;
    const jwt = getJWTHeader(req)!;
    const data = await enrollmentsService.addEnrollment(jwt, term, course_id);
    res.status(200).json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

enrollmentsRouter.delete("/course/", isAuthorizedByExistence(), async (req, res) => {
  try {
    const { id } = req.body;
    const jwt = getJWTHeader(req)!;
    const data = await enrollmentsService.dropEnrollment(jwt, id);
    res.status(200).json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});


export default enrollmentsRouter;
