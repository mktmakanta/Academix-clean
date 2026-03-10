import { formatDate } from '@/lib/utils';

interface AuthorBadgeProps {
  author: string;
  date: string;
  readTime?: number;
}

export function AuthorBadge({ author, date, readTime }: AuthorBadgeProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #1a8917 0%, #156912 100%)' }}
      >
        {author.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{author}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <time>{formatDate(date)}</time>
          {readTime && (
            <>
              <span>·</span>
              <span>{readTime} min read</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
