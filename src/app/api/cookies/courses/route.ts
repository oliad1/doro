import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';
import { TERMS } from '@/constants/SidebarConstants';

export async function GET(){
  const cookieStore = await cookies();

  if (!cookieStore.has('user_metadata')){
    console.error("User doesn't have metadata")
    return NextResponse.json({ error: "User doesn't have metadata" }, { status: 404 })
  }

  console.log("No course information available")

  //Run POST METHOD
  const metadata = cookieStore.get('user_metadata');

  if (!metadata) {
    const NO_METADATA = "User doesn't have metadata";
    console.error(NO_METADATA);
    return NextResponse.json({ error: NO_METADATA }, { status: 404 });
  }

  const formatted_metadata = JSON.parse(metadata!.value);
  const supabase = await createClient();

  let courses = [];

  for (const term of TERMS) {
    const { data, error } = await supabase
      .from('profiles')
      .select(term)
      .eq('id', formatted_metadata.id);

    if (error) {
      console.error("Error fetching term:", term, error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    //TODO: Fix typescript error
    
    if (!data || data.length === 0 || !data[0]){
      console.warn(`No data returned for term: ${term}`);
    } else {
      const termData = data![0][term];
      courses.push(termData ?? []);
    }
  }

  return NextResponse.json( { courses } , { status: 200 })
}
