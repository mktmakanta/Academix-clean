import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/types';
import { formatDate, getPublicImageUrl } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const coverUrl = post.cover_image
    ? getPublicImageUrl('post-covers', post.cover_image)
    : null;

  return (
    <article className="group flex flex-col">
      {coverUrl && (
        <Link href={`/post/${post.slug}`} className="block mb-4">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-gray-100">
            <Image
              src={coverUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {post.author}
          </span>
          <span className="text-gray-300">·</span>
          <time className="text-xs text-gray-400">{formatDate(post.created_at)}</time>
        </div>

        <Link href={`/post/${post.slug}`}>
          <h2
            className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-green-700 transition-colors line-clamp-3"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
        )}

        <Link
          href={`/post/${post.slug}`}
          className="mt-3 text-xs font-semibold text-gray-400 hover:text-green-700 transition-colors self-start"
        >
          Read story →
        </Link>
      </div>
    </article>
  );
}
