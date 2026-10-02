import { MessageCircle } from "lucide-react"
import { getWhatsAppInquiryLink } from "@/lib/whatsapp"

interface WhatsAppInquiryButtonProps {
  title: string
  location?: string
  price?: string
  agentWhatsapp?: string
  className?: string
}

/** Secondary outline inquiry action. Routes to the concierge number unless an explicit override is passed. */
export default function WhatsAppInquiryButton({
  title,
  location,
  price,
  agentWhatsapp,
  className = "",
}: WhatsAppInquiryButtonProps) {
  return (
    <a
      href={getWhatsAppInquiryLink({ title, location, price, agentWhatsapp })}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Inquire on WhatsApp about ${title}`}
      className={`flex w-full items-center justify-center gap-2 min-h-11 rounded-control border border-line bg-transparent px-4 py-2.5 text-fg text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-fg hover:border-accent ${className}`}
    >
      <MessageCircle className="w-4 h-4 shrink-0" />
      Inquire on WhatsApp
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}
