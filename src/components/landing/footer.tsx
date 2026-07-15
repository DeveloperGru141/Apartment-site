import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/#home" },
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "About Us", href: "/#about" },
  { label: "Blog", href: "/#blog" },
];

const policies = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Cookie Policy", href: "/legal/cookies" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "Facebook", href: "https://facebook.com" },
];

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-4 gap-10 md:gap-12">
          <div>
            <span className="text-lg font-bold tracking-[0.3em]">HORIZON</span>
            <p className="mt-4 text-gray-400 font-body font-normal text-base leading-relaxed text-sm">
              Curating the world&apos;s finest luxury residences for those who
              demand nothing but the extraordinary.
            </p>
          </div>

          <div>
            <h4 className="font-body font-semibold text-sm tracking-normal mb-6">
              QUICK LINKS
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 font-body font-normal text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-sm tracking-normal mb-6">
              POLICIES
            </h4>
            <ul className="space-y-3">
              {policies.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 font-body font-normal text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-sm tracking-normal mb-6">
              FOLLOW US
            </h4>
            <div className="flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 font-body font-normal text-sm hover:text-white transition-colors duration-200"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 font-body font-normal text-xs">
            &copy; 2026 HORIZON. All rights reserved.
          </p>
          <p className="text-gray-500 font-body font-normal text-xs">
            Designed for discerning living
          </p>
        </div>
      </div>
    </footer>
  );
}
