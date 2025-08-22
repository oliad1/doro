import { createClient } from "@/utils/supabase/client";
import baseAPIClient from "@/APIClients/BaseAPIClient";
import { isSuccess } from "../utils/apiUtils";

const supabase = createClient();
const base = await baseAPIClient();

const getTermGrades = async (term: string): Promise<any> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const jwt = session!.access_token;
    
    const res = await base.get(
      `/grades/term/${term}`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    if (!isSuccess(res)) {
      throw new Error(`Response status ${res.status}`);
    }

    return res.data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

const upsertGrade = async (assessment_id: string, grade: number, enrollment_id: string) : Promise<any> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const jwt = session!.access_token;
    
    const res = await base.post(
      `/grades/grade`, {
      body: {assessment_id, grade, enrollment_id}
      }, {
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
}

const deleteGrade = async (id: string) : Promise<any> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const jwt = session!.access_token;
    
    const res = await base.delete(
      `/grades/grade`, {
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
}

export default {
  getTermGrades,
  upsertGrade,
  deleteGrade,
}
