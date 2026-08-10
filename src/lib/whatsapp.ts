const WHATSAPP_NUMBER = '2348108574293'

interface PropertyInquiryDetails {
  title?: string
  location?: string
  price?: string
  agentWhatsapp?: string
}

export function getWhatsAppInquiryLink(property?: PropertyInquiryDetails): string {
  let message = 'Hello HORIZON Concierge, I would like to make a private inquiry.'

  if (property?.title) {
    message = `Hello HORIZON Concierge, I am interested in inquiring about "${property.title}"`
    if (property?.location) {
      message += ` in ${property.location}`
    }
    if (property?.price) {
      message += ` (${property.price})`
    }
    message += `. Please share more details and availability for a private viewing.`
  }

  const target = property?.agentWhatsapp ?? WHATSAPP_NUMBER

  return `https://wa.me/${target}?text=${encodeURIComponent(message)}`
}
