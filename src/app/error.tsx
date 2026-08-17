"use client"

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-heading font-bold text-4xl text-text-primary mb-4">Something went wrong</h1>
        <p className="font-body text-sm text-text-body mb-8 leading-relaxed">
          We encountered an unexpected error. Our team has been notified.
        </p>
        <button
          onClick={reset}
          className="inline-block bg-bg-dark text-white font-body font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
