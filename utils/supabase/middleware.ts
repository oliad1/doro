import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
	getAll() {
	  return request.cookies.getAll()
	},
	setAll(cookiesToSet) {
	  try {
	    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
	    supabaseResponse = NextResponse.next({
	      request,
	    });
	    cookiesToSet.forEach(({ name, value, options }) =>
	      supabaseResponse.cookies.set(name, value, options)
	    );
	  } catch {
	    //This can be ignored
	  }
	}
      }
    }
  );

  //DO NOT RUN CODE BETWEEN THESE LINES
  
  const { data: { user } } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    //no user, redirect back to login
    const url = request.nextUrl.clone()
    url.pathname = '/login';
    return NextResponse.redirect(url)
  }
}
