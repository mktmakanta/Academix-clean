import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Post } from '@/types';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, created_at, published')
    .order('created_at', { ascending: false });

  const allPosts = (posts as Partial<Post>[]) || [];
  const published = allPosts.filter((p) => p.published);
  const drafts = allPosts.filter((p) => !p.published);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            Your Stories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {published.length} published · {drafts.length} drafts
          </p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <span>+</span>
          <span>Write a story</span>
        </Link>
      </div>

      {allPosts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
          <p className="text-gray-400 mb-4" style={{ fontFamily: "'Lora', Georgia, serif" }}>
            You haven&apos;t written anything yet.
          </p>
          <Link href="/admin/new" className="text-sm text-green-700 hover:underline font-medium">
            Write your first story →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {allPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                      post.published
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  {post.created_at && (
                    <span className="text-xs text-gray-400">{formatDate(post.created_at)}</span>
                  )}
                </div>
                <p className="font-medium text-gray-900 truncate">{post.title || 'Untitled'}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {post.published && (
                  <Link
                    href={`/post/${post.slug}`}
                    className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
                    target="_blank"
                  >
                    View
                  </Link>
                )}
                <Link
                  href={`/admin/edit/${post.id}`}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
