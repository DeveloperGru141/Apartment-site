"use client"

import { MessageSquare } from "lucide-react"
import { getWhatsAppInquiryLink } from "@/lib/whatsapp"

export default function FloatingConcierge() {
  const whatsappUrl = getWhatsAppInquiryLink()

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900/90 border border-amber-500/40 text-white px-4 py-3 shadow-2xl backdrop-blur-lg hover:bg-slate-800 transition-all hover:scale-105 group"
    >
      <div className="relative flex items-center justify-center">
        <MessageSquare className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
      </div>
      <div className="text-left hidden sm:block">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none">HORIZON</p>
        <p className="text-xs font-medium text-amber-400 tracking-wide leading-tight">Private Concierge</p>
      </div>
    </a>
  )
}
