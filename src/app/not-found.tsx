import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — BTL TV",
  robots: "noindex",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-btl-red/20 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-500 text-sm mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-2.5 bg-btl-red hover:bg-btl-red-dark text-white text-sm font-medium rounded-lg transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/shows"
            className="inline-flex items-center px-6 py-2.5 border border-white/20 hover:border-white/40 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Browse Shows
          </Link>
        </div>
      </div>
    </main>
  );
}
