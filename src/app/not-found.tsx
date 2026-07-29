import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-heading font-bold text-4xl text-text-primary mb-4">Page not found</h1>
        <p className="font-body text-sm text-text-body mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-bg-dark text-white font-body font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
