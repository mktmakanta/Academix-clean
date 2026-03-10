import type { Comment } from '@/types';
import type { User } from '@supabase/supabase-js';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUser: User | null;
}

export function CommentSection({ postId, comments, currentUser }: CommentSectionProps) {
  return (
    <section>
      <h2
        className="text-2xl font-bold text-gray-900 mb-8"
        style={{ fontFamily: "'Lora', Georgia, serif" }}
      >
        Responses ({comments.length})
      </h2>

      <div className="mb-10">
        <CommentForm postId={postId} currentUser={currentUser} />
      </div>

      {comments.length > 0 ? (
        <CommentList comments={comments} />
      ) : (
        <p className="text-gray-400 text-sm italic">
          No responses yet. Be the first to share your thoughts.
        </p>
      )}
    </section>
  );
}
