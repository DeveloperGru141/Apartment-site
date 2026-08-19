import Link from "next/link";
import { Plus, Pencil, Archive, ArchiveRestore, Trash2, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { archiveListing, deleteListing, unarchiveListing } from "@/app/dashboard/actions";
import { formatPrice } from "@/lib/format";

const STATUS_STYLES: Record<string, string> = {
  "For Rent": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "For Sale": "bg-amber-500/15 text-amber-300 border-amber-500/30",
}

const PUBLISH_STYLES: Record<string, string> = {
  live: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  archived: "bg-slate-500/15 text-slate-300 border-slate-500/30",
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (!user) return null;

  const { data: listings } = await supabase
    .from("properties")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  const rows = listings ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-sm font-medium tracking-widest uppercase text-slate-400 mb-2">Seller Dashboard</p>
          <h1 className="font-heading text-3xl font-bold text-white">My Listings</h1>
          <p className="text-slate-400 mt-2 text-sm">
            {rows.length} {rows.length === 1 ? "listing" : "listings"} — including pending and archived.
          </p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className="shine-sweep inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm uppercase tracking-wider rounded-lg px-6 py-3.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> List New Property
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/15 rounded-2xl">
          <h2 className="font-heading text-xl font-bold text-white">No listings yet</h2>
          <p className="text-slate-400 mt-2 mb-8">Your first property is one form away from the HORIZON portfolio.</p>
          <Link
            href="/dashboard/listings/new"
            className="shine-sweep inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm uppercase tracking-wider rounded-lg px-6 py-3.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> List Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rows.map((listing) => {
            const cover = listing.images[0];
            return (
              <div
                key={listing.id}
                className="group rounded-xl overflow-hidden bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {cover ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={cover} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs uppercase tracking-widest">
                      No image
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${STATUS_STYLES[listing.status] ?? "bg-white/10 text-white"}`}>
                      {listing.status}
                    </span>
                    <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${PUBLISH_STYLES[listing.publish_status] ?? "bg-white/10 text-white"}`}>
                      {listing.publish_status}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="font-heading font-bold text-lg text-white line-clamp-1">{listing.title}</h2>
                  <p className="flex items-center gap-1.5 text-slate-400 text-sm mt-1 mb-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{listing.location}</span>
                  </p>
                  <p className="font-heading font-extrabold text-xl text-amber-400 mb-4">
                    {formatPrice(Number(listing.price), listing.status)}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/listings/${listing.id}/edit`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2.5 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Link>

                    {listing.publish_status === "archived" ? (
                      <form action={unarchiveListing}>
                        <input type="hidden" name="id" value={listing.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 rounded-lg px-4 py-2.5 transition-colors"
                        >
                          <ArchiveRestore className="w-3.5 h-3.5" /> Restore
                        </button>
                      </form>
                    ) : (
                      <form action={archiveListing}>
                        <input type="hidden" name="id" value={listing.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded-lg px-4 py-2.5 transition-colors"
                        >
                          <Archive className="w-3.5 h-3.5" /> Archive
                        </button>
                      </form>
                    )}

                    <form
                      action={deleteListing}
                      onSubmit={(e) => {
                        if (!window.confirm("Delete this listing permanently? This cannot be undone.")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={listing.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-red-500/15 hover:bg-red-500/25 text-red-300 rounded-lg px-4 py-2.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}