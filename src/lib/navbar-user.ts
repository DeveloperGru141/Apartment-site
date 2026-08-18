import { createClient } from "@/lib/supabase/server"

export interface NavbarUser {
  name: string
}

export async function getNavbarUser(): Promise<NavbarUser | null> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()
  const user = data.session?.user

  if (!user) return null

  const name =
    typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name
      : user.email?.split("@")[0] ?? "Seller"

  return { name }
}