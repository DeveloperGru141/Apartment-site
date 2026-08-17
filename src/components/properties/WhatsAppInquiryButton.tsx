import { getWhatsAppInquiryLink } from "@/lib/whatsapp"

interface WhatsAppInquiryButtonProps {
  title: string
  location: string
  price: string
  agentWhatsapp?: string
  className?: string
}

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
      className={`shine-sweep block w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs tracking-wider uppercase rounded-lg py-2.5 font-semibold transition-colors ${className}`}
    >
      Inquire via WhatsApp
    </a>
  )
}