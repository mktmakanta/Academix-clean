import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1
        className="text-2xl font-bold text-gray-900 mb-3"
        style={{ fontFamily: "'Lora', Georgia, serif" }}
      >
        Authentication Error
      </h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        Something went wrong during sign in. Please try again.
      </p>
      <Link
        href="/"
        className="text-sm font-semibold bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-gray-700 transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
