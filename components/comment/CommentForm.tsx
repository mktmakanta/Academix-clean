'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface CommentFormProps {
  postId: string;
  currentUser: User | null;
}

export function CommentForm({ postId, currentUser }: CommentFormProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${window.location.pathname}`,
      },
    });
  };

  const handleSubmit = async () => {
    if (!comment.trim() || !currentUser) return;
    setIsSubmitting(true);
    setError(null);

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: currentUser.id,
      comment: comment.trim(),
    });

    if (error) {
      setError('Failed to post your response. Please try again.');
    } else {
      setComment('');
      router.refresh();
    }

    setIsSubmitting(false);
  };

  if (!currentUser) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 text-center">
        <p className="text-gray-600 mb-4 text-sm">
          Sign in to share your thoughts on this story.
        </p>
        <button
          onClick={handleSignIn}
          className="inline-flex items-center gap-3 bg-white border border-gray-300 text-gray-800 font-medium text-sm px-5 py-2.5 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-5">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {currentUser.user_metadata?.avatar_url ? (
            <Image
              src={currentUser.user_metadata.avatar_url}
              alt="You"
              width={36}
              height={36}
              className="rounded-full"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-green-700 flex items-center justify-center text-white text-sm font-semibold">
              {getInitials(currentUser.user_metadata?.full_name || currentUser.email || 'U')}
            </div>
          )}
        </div>

        <div className="flex-1">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What are your thoughts?"
            rows={3}
            className="w-full text-sm text-gray-800 placeholder-gray-400 resize-none border-none outline-none bg-transparent leading-relaxed"
          />

          {error && <p className="text-red-600 text-xs mt-1">{error}</p>}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Signed in as {currentUser.user_metadata?.full_name || currentUser.email}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!comment.trim() || isSubmitting}
              className="text-sm font-semibold bg-green-700 text-white px-4 py-1.5 rounded-full hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Respond'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
