import { DatesActionDTO, UpsertDateProps } from "../types/datesTypes";
import { jwtSupabaseClient } from "../models/index";

class GradesRepository {
  async upsertDate(jwt: string, payload: UpsertDateProps): Promise<DatesActionDTO> {
    const { data, error } = await jwtSupabaseClient(jwt)
      .from("dates")
      .upsert(payload, {
	  onConflict: 'assessment_id,enrollment_id',
	  ignoreDuplicates: false
	})
      .select(`
	id,
	assessments (
	  id,
	  assessment_groups (
	    id
	  )
	)
      `)
      .single();
    
    if (!data || error) {
      throw new Error(`Failed to insert date. Error: ${error.message}`);
    }

    return data;
  };

  async deleteDate(jwt: string, id: string): Promise<DatesActionDTO> {
    const { data, error } = await jwtSupabaseClient(jwt)
      .from("dates")
      .delete()
      .eq("assessment_id", id)
      .select(`
	id,
	assessments (
	  id,
	  assessment_groups (
	    id
	  )
	)
      `)
      .single();

    if (!data || error) {
      throw new Error(`Failed to delete date.`);
    }

    return data;
  };
};

export default GradesRepository;
