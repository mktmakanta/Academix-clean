import { createClient } from '@/lib/supabase/server';
import { PostEditor } from '@/components/admin/PostEditor';
import { notFound } from 'next/navigation';
import type { Post } from '@/types';

export const dynamic = 'force-dynamic';

interface EditPostPageProps {
  params: { id: string };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !post) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
          Edit Story
        </h1>
        <p className="text-sm text-gray-500 mt-1 truncate max-w-lg">{(post as Post).title}</p>
      </div>
      <PostEditor mode="edit" post={post as Post} />
    </div>
  );
}
