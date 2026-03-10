import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm font-semibold text-gray-900 hover:text-green-700 transition-colors"
            >
              Admin
            </Link>
            <nav className="hidden sm:flex items-center gap-4">
              <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Posts
              </Link>
              <Link href="/admin/new" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                New Post
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">{user?.email}</span>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              ← View Blog
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</div>
    </div>
  );
}
