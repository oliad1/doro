import { Router } from "express";
import ObjectsService from "../services/implementations/objectsService";
import IObjectsService from "../services/interfaces/objectsService.interface";
import { getErrorMessage } from "../utils/errorUtils";

const objectsRouter: Router = Router();

const objectsService: IObjectsService = new ObjectsService();

objectsRouter.get("/url/:id", async (req, res) => {
  try {
    const object_id = req.params.id;
    const data = await objectsService.getUrl(object_id);
    res.status(200).json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default objectsRouter;
