import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 dot-grid">
      <div className="text-center space-y-6 max-w-md">
        {/* 404 visual */}
        <div className="relative">
          <p className="text-8xl font-bold gradient-text opacity-20 select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-6xl font-bold gradient-text">404</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#f8fafc]">Page Not Found</h1>
        <p className="text-[#a7b2cc]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link href="/news" className="btn btn-secondary">
            Browse News
          </Link>
        </div>
      </div>
    </div>
  );
}
