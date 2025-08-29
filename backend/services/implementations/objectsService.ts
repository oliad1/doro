import { s3 } from "../../utils/s3/client";
import IObjectsService from "../interfaces/objectsService.interface";
import logger from "../../utils/logger";
import { getErrorMessage } from "../../utils/errorUtils";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const Logger = logger(__filename);

class ObjectsService implements IObjectsService {
  constructor () {
  }

  async getUrl(object_id: string): Promise<string> {
    let data: Promise<string>;

    try {
      const getObjectParams = {
	Bucket: process.env.BUCKET_NAME!,
	Key: object_id
      }

      const command = new GetObjectCommand(getObjectParams);

      data = getSignedUrl(s3, command, { expiresIn: 3600 });
    } catch (error: unknown) {
      Logger.error(`Failed to get courses. Reason: ${getErrorMessage(error)}`);
      throw error;
    }

    return data;
  };
};

export default ObjectsService;
