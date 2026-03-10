import { createClient } from '@/lib/supabase/server';
import { PostCard } from '@/components/post/PostCard';
import { FeaturedPost } from '@/components/post/FeaturedPost';
import type { Post } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
  }

  const allPosts = (posts as Post[]) || [];
  const featuredPost = allPosts[0] || null;
  const remainingPosts = allPosts.slice(1);

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-2xl">
            <h1
              className="text-5xl sm:text-6xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              Learning, simplified.
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              A place to read, resonate, and refine your perspective on the
              ever-changing landscape of modern education.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {allPosts.length === 0 ? (
          <div className="text-center py-24">
            <p
              className="text-2xl text-gray-400 mb-3"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              No stories yet.
            </p>
            <p className="text-gray-500">Check back soon for new articles.</p>
          </div>
        ) : (
          <>
            {featuredPost && (
              <div className="mb-12 pb-12 border-b border-gray-200">
                <FeaturedPost post={featuredPost} />
              </div>
            )}
            {remainingPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
