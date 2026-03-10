import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p
        className="text-6xl font-bold text-gray-200 mb-4"
        style={{ fontFamily: "'Lora', Georgia, serif" }}
      >
        404
      </p>
      <h1
        className="text-2xl font-bold text-gray-900 mb-3"
        style={{ fontFamily: "'Lora', Georgia, serif" }}
      >
        Studies not found
      </h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        The educational content you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/"
        className="text-sm font-semibold bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-gray-700 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
