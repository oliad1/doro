import { createClient } from "@/../utils/supabase/client";

const supabase = createClient();

const getUser = async (): Promise<any> => {
  try {
    const res = await fetch('/api/cookies/user');
    const status = res.status;

    if (res.status !== 204) {
      const { data: metadataCookie, error } = await res.json();

      if (error){
	throw new Error(`Response status ${status}`);
      }

      if (!metadataCookie) {
	throw new Error(`Response status ${status}`);
      }

      return JSON.parse(metadataCookie);
    }

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log("Error:", error.message);
      throw new Error(`Error: ${error.message}`);
    }

    if (!data || !data.user) {
      console.log("Error: user is null");
      throw new Error(`Error: user is null`);
    }
   /*
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (userError) {
      console.log("Error: There was a problem querying the user");
      throw new Error(`Error: There was a problem querying the user`);
    }

    if (!userData || !userData?.length) {
      const { error: insertError } = await supabase
	.from("profiles")
	.insert({
	  "id": data.user.id,
	});

      if (insertError) {
	console.log("Error: There was a problem creating the user");
	throw new Error(`Error: There was a problem creating the user`);
      }

      console.log("Successfully inserted new user to table");
    }
    */
    
    const cookiePostRes = await fetch('/api/cookies/user', {
      method: 'POST',
      headers: {
	'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return data.user;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export default {
  getUser,
};
