import { createClient } from "@/utils/supabase/client";
import baseAPIClient from "@/APIClients/BaseAPIClient";
import { isSuccess } from "../utils/apiUtils";

const supabase = createClient();
const base = await baseAPIClient();

const getTermDates = async (term: string): Promise<any> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const jwt = session!.access_token;

    const res = await base.get(`/dates/term/${term}`, {
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

const upsertDate = async (
  assessment_id: string,
  date: Date | undefined,
  enrollment_id: string,
): Promise<any> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const jwt = session!.access_token;

    const res = await base.post(
      `/dates/date`,
      {
        body: { assessment_id, date, enrollment_id },
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

const deleteDate = async (id: string): Promise<any> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const jwt = session!.access_token;

    const res = await base.delete(`/dates/date`, {
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
  getTermDates,
  upsertDate,
  deleteDate,
};
