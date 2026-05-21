"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// --- Types ---

type SimpleLink = { type: "link"; href: string; label: string };
type DropdownItem = {
  type: "dropdown";
  label: string;
  children: { href: string; label: string }[];
};
type NavItem = SimpleLink | DropdownItem;

// --- Nav structure ---

const navItems: NavItem[] = [
  { type: "link", href: "/", label: "Home" },
  { type: "link", href: "/services", label: "Services" },
  {
    type: "dropdown",
    label: "Training",
    children: [
      { href: "/training", label: "Courses" },
      { href: "/why-safe", label: "Why SAFe?" },
    ],
  },
  { type: "link", href: "/about", label: "About" },
  { type: "link", href: "/contact", label: "Contact" },
];

// --- Chevron icon ---

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// --- Component ---

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  return (
    <nav className="sticky top-0 z-50 w-full bg-navy border-b border-navyMid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo-name.jpg"
            alt="Atomic Agility"
            height={40}
            width={160}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            if (item.type === "link") {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white hover:text-cyan transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
              );
            }

            // Dropdown item
            const isOpen = activeDropdown === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {/* Trigger */}
                <button
                  className="flex items-center gap-1.5 text-white hover:text-cyan transition-colors duration-200 font-medium"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                >
                  {item.label}
                  <ChevronDown open={isOpen} />
                </button>

                {/* Panel — pt-3 bridges the gap between button and panel */}
                {isOpen && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3 z-50">
                    <div className="rounded-xl border border-[#00487B] bg-navy shadow-2xl overflow-hidden min-w-[160px]">
                      {item.children.map((child, idx) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium text-white hover:text-cyan hover:bg-navyMid transition-colors duration-150 ${
                            idx < item.children.length - 1
                              ? "border-b border-[#00487B]"
                              : ""
                          }`}
                          onClick={() => setActiveDropdown(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 text-white"
          onClick={() => {
            setMenuOpen((prev) => !prev);
            setMobileExpanded(null);
          }}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy border-t border-navyMid px-4 py-3 flex flex-col">
          {navItems.map((item) => {
            if (item.type === "link") {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white hover:text-cyan transition-colors duration-200 font-medium py-2.5"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            }

            // Mobile expandable dropdown
            const isExpanded = mobileExpanded === item.label;
            return (
              <div key={item.label}>
                <button
                  className="flex items-center justify-between w-full text-white hover:text-cyan transition-colors duration-200 font-medium py-2.5"
                  onClick={() =>
                    setMobileExpanded(isExpanded ? null : item.label)
                  }
                  aria-expanded={isExpanded}
                >
                  {item.label}
                  <ChevronDown open={isExpanded} />
                </button>

                {isExpanded && (
                  <div className="flex flex-col pl-4 pb-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="text-muted hover:text-cyan transition-colors duration-200 font-medium py-2"
                        onClick={() => {
                          setMenuOpen(false);
                          setMobileExpanded(null);
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}
