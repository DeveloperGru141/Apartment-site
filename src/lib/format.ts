export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`
}

export function formatPrice(price: number, status?: string): string {
  const base = formatNaira(price)
  if (status === "For Rent") return `${base} / yr`
  if (status === "Off-Plan") return `From ${base}`
  return base
}