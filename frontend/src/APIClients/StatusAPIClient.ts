import { createClient } from "@/utils/supabase/client";
import baseAPIClient from "@/APIClients/BaseAPIClient";
import { isSuccess } from "../utils/apiUtils";

const supabase = createClient();
const base = await baseAPIClient();

const getTermTasks = async (term: string): Promise<any> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const jwt = session!.access_token;

    const res = await base.get(`/statuses/term/${term}`, {
      headers: { Authorization: `Bearer ${jwt}` },
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

const upsertStatus = async (
  assessment_id: string,
  status: string | undefined,
  enrollment_id: string,
): Promise<any> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const jwt = session!.access_token;

    const res = await base.post(
      `/statuses/status`,
      {
        body: {
          assessment_id,
          ...(status != undefined && { status }),
          enrollment_id,
        },
      },
      {
        headers: { Authorization: `Bearer ${jwt}` },
      },
    );

    if (!isSuccess(res)) {
      throw new Error(`Response status ${res.status}`);
    }

    return res.data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

const deleteStatus = async (id: string): Promise<any> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const jwt = session!.access_token;

    const res = await base.delete(`/statuses/status`, {
      headers: { Authorization: `Bearer ${jwt}` },
      data: { id },
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
  getTermTasks,
  upsertStatus,
  deleteStatus,
};
