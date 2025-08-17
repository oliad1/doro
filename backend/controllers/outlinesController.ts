import { Router } from "express";
import OutlinesService from "../services/implementations/outlinesService";
import IOutlinesService from "../services/interfaces/outlinesService.interface";
import { getErrorMessage } from "../utils/errorUtils";
import { GetCoursesProps } from "../types/outlinesTypes"; 
import { isAuthorizedByExistence } from "../middlewares/auth";

const outlinesRouter: Router = Router();

const outlinesService: IOutlinesService = new OutlinesService();

outlinesRouter.get("/course/:id", async (req, res) => {
  try {
    const courseId: string = req.params.id;
    const data = await outlinesService.getCourse(courseId);
    res.status(200).json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

outlinesRouter.get("/courses", isAuthorizedByExistence(), async (req, res) => {
  try {
    const isVerified = req.query.isVerified ? req.query.isVerified=="true" : false;
    const page = Number(req.query.page) || 1;
    const props: GetCoursesProps = {
      isVerified,
      page,
      ...(req.query.search) && {
	search: req.query.search as string
      },
      ...(req.query.dept) && {
	dept: req.query.dept as string
      },
      ...(Number.isInteger(Number(req.query.fac))) && {
	fac: Number(req.query.fac)
      },
    };
    const data = await outlinesService.getCourses(props);
    res.status(200).json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});


export default outlinesRouter;
