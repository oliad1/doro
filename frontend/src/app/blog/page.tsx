import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import NavBar from "@/components/Landing/NavBar";

import { client } from "@/sanity/client";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <div>
      <div className="container mx-auto min-h-screen max-w-3xl p-8">
        <h1 className="text-4xl mb-8">Posts</h1>
        <ul className="flex flex-col gap-y-4">
          {posts?.length == 0 ? (
            <p className="text-muted-foreground">Content coming soon.</p>
          ) : (
            posts.map((post) => (
              <li className="hover:underline" key={post._id}>
                <Link href={`/blog/${post.slug.current}`}>
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p className="text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
