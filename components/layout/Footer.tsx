import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="text-lg font-bold text-gray-900 hover:text-green-700 transition-colors"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            Academix <span className="text-green-700">Hub</span>
          </Link>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} AcademixHub. Empowering minds through shared knowledge.
          </p>
        </div>
      </div>
    </footer>
  );
}
