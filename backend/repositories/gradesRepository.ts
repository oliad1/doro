import {
  GradesDTO,
  UpsertGradeProps,
  GradeActionDTO,
} from "../types/gradesTypes";
import { jwtSupabaseClient } from "../models/index";

class GradesRepository {
  async getGrades(jwt: string): Promise<GradesDTO[]> {
    const { data, error } = await jwtSupabaseClient(jwt).from("grades").select(`
	submitted_at,
	grade,
	enrollments (
	  term
	),
	assessments (
	  weight,
	  assessment_groups (
	    outlines (
	      code
	    )
	  )
	)
      `);

    if (!data || error) {
      throw new Error(`Failed to get grades.`);
    }

    return data;
  }

  async upsertGrade(
    jwt: string,
    payload: UpsertGradeProps,
  ): Promise<GradeActionDTO> {
    const { data, error } = await jwtSupabaseClient(jwt)
      .from("grades")
      .upsert(payload, {
        onConflict: "assessment_id,enrollment_id",
        ignoreDuplicates: false,
      })
      .select(
        `
	id,
	submitted_at,
	assessments (
	  id,
	  assessment_groups (
	    id
	  )
	)
      `,
      )
      .single();

    if (!data || error) {
      throw new Error(`Failed to insert grade. Error: ${error.message}`);
    }

    return data;
  }

  async deleteGrade(jwt: string, id: string): Promise<GradeActionDTO> {
    const { data, error } = await jwtSupabaseClient(jwt)
      .from("grades")
      .delete()
      .eq("assessment_id", id)
      .select(
        `
	id,
	submitted_at,
	assessments (
	  id,
	  assessment_groups (
	    id
	  )
	)
      `,
      )
      .single();

    if (!data || error) {
      throw new Error(`Failed to delete grade.`);
    }

    return data;
  }
}

export default GradesRepository;
