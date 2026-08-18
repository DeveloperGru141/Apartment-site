import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ListingForm from "@/components/dashboard/ListingForm";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (!user) return null;

  const { data: listing } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("seller_id", user.id)
    .single();

  if (!listing) notFound();

  return <ListingForm mode="edit" listing={listing} />;
}