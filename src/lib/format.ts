export const CURRENCY_SYMBOLS = { NGN: "₦", USD: "$", EUR: "€", GBP: "£" } as const

export type CurrencyCode = keyof typeof CURRENCY_SYMBOLS

export function formatPrice(price: string | number, currency: CurrencyCode = "NGN"): string {
  if (typeof price === "string") return price
  return `${CURRENCY_SYMBOLS[currency]} ${price.toLocaleString()}`
}

export function parsePrice(price: string): number {
  return parseInt(price.replace(/[^0-9]/g, ""), 10) || 0
}

export function formatPriceShort(price: number, currency: CurrencyCode = "NGN"): string {
  const symbol = CURRENCY_SYMBOLS[currency]
  if (price >= 1_000_000_000) return `${symbol} ${(price / 1_000_000_000).toFixed(1)}B`
  if (price >= 1_000_000) return `${symbol} ${(price / 1_000_000).toFixed(1)}M`
  if (price >= 1_000) return `${symbol} ${(price / 1_000).toFixed(0)}K`
  return `${symbol} ${price.toLocaleString()}`
}
