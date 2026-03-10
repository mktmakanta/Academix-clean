import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import type { Post, Comment } from '@/types';
import { formatDate, getPublicImageUrl } from '@/lib/utils';
import { CommentSection } from '@/components/comment/CommentSection';
import { AuthorBadge } from '@/components/post/AuthorBadge';

export const dynamic = 'force-dynamic';

interface PostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, cover_image')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!post) return { title: 'Post Not Found' };

  const coverUrl = post.cover_image
    ? getPublicImageUrl('post-covers', post.cover_image)
    : undefined;

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: coverUrl ? [coverUrl] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (error || !post) notFound();

  const typedPost = post as Post;
  const coverUrl = typedPost.cover_image
    ? getPublicImageUrl('post-covers', typedPost.cover_image)
    : null;

  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles(id, name, avatar)')
    .eq('post_id', typedPost.id)
    .order('created_at', { ascending: true });

  const { data: suggestedPosts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_image, created_at, author')
    .neq('id', typedPost.id)
    .eq('published', true)
    .limit(4);

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <article className="min-h-screen">
      {/* Post Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <h1
          className="text-4xl sm:text-5xl font-bold leading-tight mb-6 text-gray-900"
          style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
          {typedPost.title}
        </h1>
        <div className="flex items-center gap-4 mb-8">
          <AuthorBadge author={typedPost.author} date={typedPost.created_at} />
        </div>
      </div>

      {/* Cover Image */}
      {coverUrl && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-10">
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-sm">
            <Image src={coverUrl} alt={typedPost.title} fill className="object-cover" priority />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: typedPost.content }}
        />

        <div className="border-t border-gray-200 my-12" />

        <CommentSection
          postId={typedPost.id}
          comments={(comments as Comment[]) || []}
          currentUser={user}
        />

        {/* Suggested Posts */}
        {suggestedPosts && suggestedPosts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold mb-10" style={{ fontFamily: "'Lora', Georgia, serif" }}>
              Recommended Posts
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              {suggestedPosts.map((p) => {
                const img = p.cover_image
                  ? getPublicImageUrl('post-covers', p.cover_image)
                  : null;
                return (
                  <a key={p.id} href={`/post/${p.slug}`} className="block group">
                    {img && (
                      <div className="relative w-full aspect-[16/9] mb-4 overflow-hidden">
                        <Image
                          src={img}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span>{p.author}</span>
                    </div>
                    <h3 className="text-xl font-bold leading-snug mb-2 group-hover:underline" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="text-gray-600 line-clamp-2">{p.excerpt}</p>
                    )}
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
