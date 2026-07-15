"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About Us", href: "#about" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-4 mx-auto w-[92%] bg-white/40 backdrop-blur-lg border border-white/30 shadow-sm rounded-full z-50">
        <div className="flex items-center justify-between w-full px-6 md:px-8 py-3">
          <Link
            href="/"
            className="font-heading font-extrabold tracking-widest text-xl text-text-primary uppercase"
          >
            HORIZON
          </Link>

          <div className="hidden md:flex gap-10 items-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-body font-medium text-sm text-text-primary transition-colors duration-300 hover:text-text-muted"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="font-body font-medium text-sm text-text-primary transition-colors duration-300 hover:text-text-muted"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="font-body font-semibold text-xs uppercase tracking-wider px-6 py-3 bg-[#111111] text-white rounded-none transition-colors duration-300 hover:bg-[#222222]"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="block md:hidden p-2 z-50 relative"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span
              className={`block h-0.5 w-5 bg-[#111111] transition-all duration-300 ease-out ${open ? "translate-y-2 rotate-45" : "rotate-0 translate-y-0"}`}
            />
            <span
              className={`block h-0.5 w-5 bg-[#111111] mt-1.5 transition-all duration-300 ease-out ${open ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
            />
            <span
              className={`block h-0.5 w-5 bg-[#111111] mt-1.5 transition-all duration-300 ease-out ${open ? "-translate-y-2 -rotate-45" : "-rotate-0 translate-y-0"}`}
            />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 h-screen w-full bg-white z-40 transition-transform duration-300 ease-out md:hidden ${open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="font-heading font-extrabold tracking-widest text-xl text-text-primary uppercase"
            onClick={() => setOpen(false)}
          >
            HORIZON
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-2"
            aria-label="Close menu"
          >
            <span className="block h-0.5 w-5 bg-[#111111] translate-y-2 rotate-45" />
            <span className="block h-0.5 w-5 bg-[#111111] mt-1.5 -translate-y-2 -rotate-45" />
          </button>
        </div>

        <div className="flex flex-col gap-8 px-6 mt-12">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-heading font-bold text-2xl text-text-primary transition-colors duration-300 hover:text-text-muted"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            className="font-body font-semibold text-sm uppercase tracking-wider px-6 py-4 border border-[#111111] text-[#111111] text-center mt-4"
            onClick={() => setOpen(false)}
          >
            Sign In/Sign up
          </Link>
          <Link
            href="/signup"
            className="font-body font-semibold text-sm uppercase tracking-wider px-6 py-4 bg-[#111111] text-white text-center mt-4"
            onClick={() => setOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
}
