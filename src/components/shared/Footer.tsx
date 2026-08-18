import Link from "next/link";
import { getWhatsAppInquiryLink } from "@/lib/whatsapp";
import { ScrollRevealItem } from "@/components/shared/ScrollReveal";
import { NEIGHBORHOODS } from "@/lib/images";

const propertyTypes = [
  { label: "Apartments", type: "Apartment" },
  { label: "Penthouses", type: "Penthouse" },
  { label: "Duplexes", type: "Detached Duplex" },
  { label: "Terraces & Townhouses", type: "Terrace" },
  { label: "Maisonettes", type: "Maisonette" },
  { label: "Commercial", type: "Commercial" },
];

const neighborhoods = NEIGHBORHOODS.map((name) => ({
  label: name,
  name,
}));

const companyLinks = [
  { label: "Agents", href: "/agents" },
  { label: "Journal", href: "/journal" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    svg: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    svg: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com",
    svg: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4l6.5 8.5L4 20h2l5.5-7 4.5 7h6L15.5 11.5 22 4h-2l-5.5 7L10 4H4z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    svg: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <ScrollRevealItem index={0} variant="fade-up">
            <h3 className="mb-4 text-xl font-bold tracking-widest">HORIZON</h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Your premier destination for luxury property listings across Nigeria&apos;s most desirable neighborhoods.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {link.svg}
                </a>
              ))}
            </div>
          </ScrollRevealItem>

          <ScrollRevealItem index={1} variant="fade-up">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Property Types</h4>
            <ul className="space-y-3">
              {propertyTypes.map((item) => (
                <li key={item.type}>
                  <Link
                    href={`/properties?propertyType=${encodeURIComponent(item.type)}`}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollRevealItem>

          <ScrollRevealItem index={2} variant="fade-up">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Neighborhoods</h4>
            <ul className="space-y-3">
              {neighborhoods.map((item) => (
                <li key={item.name}>
                  <Link
                    href={`/properties?neighborhood=${encodeURIComponent(item.name)}`}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollRevealItem>

          <ScrollRevealItem index={3} variant="fade-up">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollRevealItem>

          <ScrollRevealItem index={4} variant="fade-up">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contact Concierge</h4>
            <p className="mb-4 text-sm leading-relaxed text-gray-400">
              Speak directly with our team for private viewings and inquiries.
            </p>
            <a
              href={getWhatsAppInquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="shine-sweep inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Concierge WhatsApp
            </a>
            <p className="mt-3 text-xs text-gray-500">
              Reply within 15 minutes during business hours.
            </p>
          </ScrollRevealItem>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-400">
              &copy; 2026 HORIZON. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              Lagos &bull; Abuja &bull; London &bull; New York
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
