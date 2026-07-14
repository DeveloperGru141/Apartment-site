export default function Footer() {
  return (
    <footer className="bg-bg-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-4 gap-10 md:gap-12">
          <div>
            <span className="text-lg font-bold tracking-[0.3em]">LUXORA</span>
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
              {["Home", "Services", "Portfolio", "About Us", "Blog"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 font-body font-normal text-sm hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-sm tracking-normal mb-6">
              POLICIES
            </h4>
            <ul className="space-y-3">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Disclaimer",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 font-body font-normal text-sm hover:text-white transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-sm tracking-normal mb-6">
              FOLLOW US
            </h4>
            <div className="flex gap-4">
              {["Instagram", "LinkedIn", "Twitter", "Facebook"].map(
                (social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-400 font-body font-normal text-sm hover:text-white transition-colors duration-200"
                  >
                    {social}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 font-body font-normal text-xs">
            &copy; 2026 LUXORA. All rights reserved.
          </p>
          <p className="text-gray-500 font-body font-normal text-xs">
            Designed for discerning living
          </p>
        </div>
      </div>
    </footer>
  );
}
