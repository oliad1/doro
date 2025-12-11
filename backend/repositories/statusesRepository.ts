import {
  StatusActionDTO,
  UpsertStatusProps,
} from "../types/assessmentStatusesTypes";
import { jwtSupabaseClient } from "../models/index";

class StatusRepository {
  async upsertStatus(
    jwt: string,
    payload: UpsertStatusProps,
  ): Promise<StatusActionDTO> {
    const { data, error } = await jwtSupabaseClient(jwt)
      .from("assessment_statuses")
      .upsert(payload, {
        onConflict: "assessment_id,enrollment_id",
        ignoreDuplicates: false,
      })
      .select(
        `
	id,
	status,
	assessments!assessment_id (
	  id,
	  assessment_groups (
	    id
	  )
	)
      `,
      )
      .single();

    if (!data || error) {
      throw new Error(`Failed to upsert status. Error: ${error.message}`);
    }

    return data;
  }

  async deleteStatus(jwt: string, id: string): Promise<StatusActionDTO> {
    const { data, error } = await jwtSupabaseClient(jwt)
      .from("assessment_statuses")
      .delete()
      .eq("assessment_id", id)
      .select(
        `
	id,
	assessments!assessment_id (
	  id,
	  assessment_groups (
	    id
	  )
	)
      `,
      )
      .single();

    if (!data || error) {
      throw new Error(`Failed to delete status.`);
    }

    return data;
  }
}

export default StatusRepository;
