import Image from 'next/image';
import type { Comment } from '@/types';
import { formatTimeAgo, getInitials } from '@/lib/utils';

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-6">
      {comments.map((comment) => {
        const profile = comment.profiles;
        const avatarUrl = profile?.avatar;
        const name = profile?.name || 'Anonymous';

        return (
          <div key={comment.id} className="flex gap-3">
            <div className="flex-shrink-0">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={name} width={36} height={36} className="rounded-full" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold">
                  {getInitials(name)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900">{name}</span>
                <span className="text-xs text-gray-400">{formatTimeAgo(comment.created_at)}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {comment.comment}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
