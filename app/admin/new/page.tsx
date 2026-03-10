import { PostEditor } from '@/components/admin/PostEditor';

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
          New Story
        </h1>
        <p className="text-sm text-gray-500 mt-1">Write and publish a new article</p>
      </div>
      <PostEditor mode="create" />
    </div>
  );
}
