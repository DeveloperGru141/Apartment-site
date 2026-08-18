export default function RootLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center animate-pulse">
        <p className="font-heading font-extrabold tracking-[0.3em] text-lg text-white">HORIZON</p>
        <p className="text-xs text-slate-400 mt-3 uppercase tracking-widest">Loading portfolio…</p>
      </div>
    </div>
  )
}