import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import Link from "next/link";
import { notFound } from "next/navigation";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      const imageUrl = urlFor(value)
        ?.width(800)
        .fit("max")
        .auto("format")
        .url();

      if (!imageUrl) return null;

      return (
        <img src={imageUrl} alt={value.alt || ""} className="my-6 rounded-xl" />
      );
    },
  },
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    await params,
    options,
  );

  if (!post) {
    notFound();
  }

  const postImageUrl = post.image
    ? urlFor(post.image)?.width(550).height(310).url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl px-8 pb-8 flex flex-col gap-4">
      <Link href="/blog" className="hover:underline">
        ← Back to posts
      </Link>
      {postImageUrl && (
        <img
          src={postImageUrl}
          alt={post.title}
          className="aspect-video rounded-xl"
          width="550"
          height="310"
        />
      )}
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <div className="prose">
        <p className="text-muted-foreground">
          {new Date(post.publishedAt).toLocaleDateString()}
        </p>
        <div className="mt-4">
          {Array.isArray(post.body) && (
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          )}
        </div>
      </div>
    </main>
  );
}
