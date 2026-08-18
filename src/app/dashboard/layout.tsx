import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const fullName = user.user_metadata?.full_name ?? user.email ?? "Seller";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-heading font-extrabold tracking-[0.3em] text-lg">HORIZON</span>
            <span className="text-xs uppercase tracking-widest text-amber-400 border border-amber-400/30 px-2 py-0.5">
              Seller
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium tracking-wide uppercase text-slate-300">
            <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
              My Listings
            </Link>
            <Link href="/dashboard/listings/new" className="hover:text-amber-400 transition-colors">
              New Listing
            </Link>
            <Link href="/properties" className="hover:text-amber-400 transition-colors">
              View Site
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-slate-300 max-w-[140px] truncate">{fullName}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-xs uppercase tracking-widest text-slate-300 border border-white/10 px-4 py-2 rounded-lg hover:border-amber-400/40 hover:text-amber-400 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{children}</main>
    </div>
  );
}