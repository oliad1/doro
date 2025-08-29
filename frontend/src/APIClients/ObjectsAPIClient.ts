import baseAPIClient from "@/APIClients/BaseAPIClient";
import { isSuccess } from "../utils/apiUtils";

const base = await baseAPIClient();

const getUrl = async (object_id: string) => {
  try {
    const res = await base.get(
      `/objects/url/${object_id}`, {
    });

    if (!isSuccess(res)) {
      throw new Error(`Response status ${res.status}`);
    }

    return res.data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export default {
  getUrl,
}
