import { createClient } from "@/../utils/supabase/client";

const supabase = createClient();

const getCourse = async (id: string) : Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("outlines")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log("Error: There was a problem querying the course outline");
      throw new Error(`Error: There was a problem querying the course outline`);
    }

    return data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

export default {
  getCourse
}
