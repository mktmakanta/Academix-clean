'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { Post } from '@/types';
import { RichTextEditor } from './RichTextEditor';

interface PostEditorProps {
  mode: 'create' | 'edit';
  post?: Post;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function PostEditor({ mode, post }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [author, setAuthor] = useState(post?.author || '');
  const [content, setContent] = useState(post?.content || '');
  const [published, setPublished] = useState(post?.published ?? false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    post?.cover_image
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-covers/${post.cover_image}`
      : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async (publishOverride?: boolean) => {
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!content.trim()) { setError('Content is required.'); return; }
    if (!author.trim()) { setError('Author name is required.'); return; }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let coverImagePath = post?.cover_image || null;

      if (coverFile) {
        const ext = coverFile.name.split('.').pop();
        const fileName = `${Date.now()}-${slugify(title)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('post-covers')
          .upload(fileName, coverFile, { upsert: true });
        if (uploadError) throw new Error(`Cover upload failed: ${uploadError.message}`);
        coverImagePath = fileName;
      }

      const shouldPublish = publishOverride !== undefined ? publishOverride : published;
      const slug = mode === 'create' ? slugify(title) : (post?.slug || slugify(title));

      const payload = {
        title: title.trim(),
        slug,
        excerpt: excerpt.trim() || null,
        author: author.trim(),
        content,
        cover_image: coverImagePath,
        published: shouldPublish,
      };

      if (mode === 'create') {
        const { error } = await supabase.from('posts').insert(payload);
        if (error) throw error;
        setSuccess('Story created successfully!');
        setTimeout(() => router.push('/admin'), 1500);
      } else {
        const { error } = await supabase.from('posts').update(payload).eq('id', post!.id);
        if (error) throw error;
        setSuccess('Story updated successfully!');
        if (shouldPublish) setTimeout(() => router.push(`/post/${slug}`), 1500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Cover Image Upload */}
        <div className="border-b border-gray-100">
          <label className="block cursor-pointer">
            {coverPreview ? (
              <div className="relative group">
                <div className="relative aspect-[3/1] w-full overflow-hidden">
                  <Image src={coverPreview} alt="Cover preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Change cover image</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/1] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-400">Click to add a cover image</span>
                <span className="text-xs text-gray-300">JPG, PNG, WebP recommended</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
          </label>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Story title..."
            className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 border-none outline-none bg-transparent"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          />
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Write a short excerpt or subtitle..."
            rows={2}
            className="w-full text-lg text-gray-600 placeholder-gray-300 border-none outline-none bg-transparent resize-none leading-relaxed"
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name..."
            className="w-full text-sm text-gray-500 placeholder-gray-300 border-none outline-none bg-transparent"
          />
          <div className="border-t border-gray-100" />
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        <div className="border-t border-gray-100 px-6 sm:px-8 py-4 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div
              onClick={() => setPublished(!published)}
              className={`relative w-10 h-5 rounded-full transition-colors ${published ? 'bg-green-600' : 'bg-gray-300'}`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${published ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </div>
            <span className="text-sm text-gray-600 font-medium">
              {published ? 'Publish immediately' : 'Save as draft'}
            </span>
          </label>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin')}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave()}
              disabled={isLoading}
              className="text-sm bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading
                ? 'Saving...'
                : mode === 'create'
                ? published ? 'Publish Story' : 'Save Draft'
                : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
