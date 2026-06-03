'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { label: 'Chicken Meals', href: '/menu#chicken-meals' },
  { label: 'Burgers', href: '/menu#burgers' },
  { label: 'Wings & Strips', href: '/menu#wings' },
  { label: 'Wraps & Sides', href: '/menu#wraps' },
  { label: 'Café & Drinks', href: '/menu#beverages' },
];

interface NavbarProps {
  /** On the menu page, the CTA says "Back to Home"; on others it says "Order Now" */
  isMenuPage?: boolean;
}

export default function Navbar({ isMenuPage = false }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="bg-surface/90 backdrop-blur-md fixed top-0 w-full z-50 shadow-[0_4px_12px_rgba(42,31,29,0.05)]">
        <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          {/* Brand */}
          <Link href="/" className="flex items-center">
            <Image
              src="/filbeylogo.svg"
              alt="Filbey Fried Chicken & Burgers Chennai Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-gutter items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-on-surface-variant font-label-lg text-label-lg hover:text-secondary transition-colors duration-200 cursor-pointer active:scale-95"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          {isMenuPage ? (
            <Link
              href="/"
              className="hidden lg:flex items-center justify-center bg-primary text-on-primary font-label-lg text-label-lg py-3 px-6 rounded-full hover:bg-primary-container transition-colors shadow-md"
            >
              Back to Home
            </Link>
          ) : (
            <Link
              href="/menu"
              className="hidden lg:flex items-center justify-center bg-primary text-on-primary font-label-lg text-label-lg py-3 px-6 rounded-full hover:bg-primary-container transition-colors shadow-md"
            >
              Order Now
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            id="menu-btn"
            className="lg:hidden text-primary"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
              menu
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-surface z-[60] flex flex-col pt-24 px-margin-mobile transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          id="close-menu"
          className="absolute top-6 right-4 text-primary"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
            close
          </span>
        </button>

        <nav className="flex flex-col gap-6 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-on-surface-variant font-label-lg text-2xl hover:text-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {isMenuPage ? (
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="mt-8 flex items-center justify-center bg-primary text-on-primary font-label-lg text-label-lg py-4 rounded-full hover:bg-primary-container transition-colors shadow-md"
          >
            Back to Home
          </Link>
        ) : (
          <Link
            href="/menu"
            onClick={() => setOpen(false)}
            className="mt-8 flex items-center justify-center bg-primary text-on-primary font-label-lg text-label-lg py-4 rounded-full hover:bg-primary-container transition-colors shadow-md"
          >
            Order Now
          </Link>
        )}
      </div>
    </>
  );
}
