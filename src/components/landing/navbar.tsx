"use client";

import { useState } from "react";

const navLinks = ["Home", "Services", "About Us", "Blog", "Contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-b from-white/95 via-white/60 to-transparent backdrop-blur-md">
        <div className="flex items-center justify-between w-full px-6 md:px-16 py-5">
          <span className="font-heading font-extrabold tracking-widest text-xl text-[#111111] uppercase">
            LUXORA
          </span>

          <div className="hidden md:flex gap-10 items-center">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="font-body font-medium text-sm text-[#111111] transition-colors duration-300 hover:text-[#666666]"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <a
              href="#"
              className="font-body font-semibold text-xs uppercase tracking-wider px-6 py-3 bg-[#111111] text-white rounded-none transition-colors duration-300 hover:bg-[#222222]"
            >
              Book A Stay
            </a>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="block md:hidden p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-5 bg-[#111111] transition-transform duration-300 ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-[#111111] mt-1.5 transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-[#111111] mt-1.5 transition-transform duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 h-screen w-full bg-white z-[60] transition-transform duration-300 md:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="font-heading font-extrabold tracking-widest text-xl text-[#111111] uppercase">
            LUXORA
          </span>
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
              key={link}
              href="#"
              className="font-heading font-bold text-2xl text-[#111111] transition-colors duration-300 hover:text-[#666666]"
              onClick={() => setOpen(false)}
            >
              {link}
            </a>
          ))}
          <a
            href="#"
            className="font-body font-semibold text-sm uppercase tracking-wider px-6 py-4 bg-[#111111] text-white rounded-none transition-colors duration-300 hover:bg-[#222222] text-center mt-4"
            onClick={() => setOpen(false)}
          >
            Book A Stay
          </a>
        </div>
      </div>
    </>
  );
}
