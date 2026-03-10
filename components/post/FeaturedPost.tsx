import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/types';
import { formatDate, getPublicImageUrl } from '@/lib/utils';

interface FeaturedPostProps {
  post: Post;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const coverUrl = post.cover_image
    ? getPublicImageUrl('post-covers', post.cover_image)
    : null;

  return (
    <article className="group grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
      <div className="md:col-span-3 order-2 md:order-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-green-700 uppercase tracking-widest">
            Featured
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-xs font-medium text-gray-500">{post.author}</span>
          <span className="text-gray-300">·</span>
          <time className="text-xs text-gray-400">{formatDate(post.created_at)}</time>
        </div>

        <Link href={`/post/${post.slug}`}>
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-green-700 transition-colors"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
        )}

        <Link
          href={`/post/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 border border-gray-300 px-5 py-2.5 rounded-full hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
        >
          Read story
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {coverUrl ? (
        <Link href={`/post/${post.slug}`} className="md:col-span-2 order-1 md:order-2 block">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-gray-100">
            <Image
              src={coverUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>
        </Link>
      ) : (
        <div className="md:col-span-2 order-1 md:order-2 aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm" />
      )}
    </article>
  );
}
