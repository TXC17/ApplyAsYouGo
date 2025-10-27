"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/context/context";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const { isLoggedIn, logoutUser } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navLinks = [
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/our-story" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-4">
      {/* Logo & Burger */}
      <div className="flex w-full justify-between md:w-auto items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-white text-lg font-semibold tracking-tight">
            Apply As You Go
          </span>
        </Link>

        {/* Burger Icon */}
        <button
          className="md:hidden text-white focus:outline-none hover:scale-105 transition-transform"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-white",
              pathname === link.href ? "text-white" : "text-gray-400"
            )}
          >
            {link.name}
          </Link>
        ))}

        {isClient && (
          <>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard">
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                  >
                    Dashboard
                  </HoverBorderGradient>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logoutUser()
                    router.push("/")
                  }}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/signup">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                >
                  Login / Signup
                </HoverBorderGradient>
              </Link>
            )}
          </>
        )}
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col items-start gap-4 w-full bg-black/80 rounded-xl p-4 backdrop-blur-md shadow-lg transition-all">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-white",
                pathname === link.href ? "text-white" : "text-gray-400"
              )}
            >
              {link.name}
            </Link>
          ))}

          {isClient && (
            <>
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border border-white/30 text-white hover:bg-white/10 text-sm"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      logoutUser()
                      router.push("/")
                      setMenuOpen(false)
                    }}
                    className="w-full border border-white/30 text-white hover:bg-white/10 text-sm"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border border-white/30 text-white hover:bg-white/10 text-sm"
                  >
                    Login / Signup
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
