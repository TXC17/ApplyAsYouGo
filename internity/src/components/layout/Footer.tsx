"use client"

import React from 'react'
import Link from 'next/link'

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/applyasyougo.in/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.59 15.3c-.9 0-1.62-.73-1.62-1.62 0-.9.73-1.62 1.62-1.62.9 0 1.62.73 1.62 1.62 0 .9-.73 1.62-1.62 1.62Z" />
        <path d="M15.41 15.3c-.9 0-1.62-.73-1.62-1.62 0-.9.73-1.62 1.62-1.62.9 0 1.62.73 1.62 1.62 0 .9-.72 1.62-1.62 1.62Z" />
        <path d="M19.18 5.53C18.24 5.05 17.22 4.72 16.17 4.56c-.18.31-.39.75-.53 1.09-1.15-.17-2.29-.17-3.43 0-.14-.34-.35-.78-.54-1.09-1.05.16-2.07.49-3.01.97-1.91 2.85-2.44 5.65-2.17 8.4.94.67 1.86 1.09 2.75 1.35.22-.3.42-.61.59-.95-.33-.12-.64-.28-.93-.47.08-.06.15-.13.22-.2 1.71.77 3.58.77 5.29 0 .08.07.15.14.22.2-.29.19-.6.35-.93.47.18.34.37.65.59.95.9-.26 1.81-.68 2.75-1.35.31-3.13-.53-5.9-2.36-8.4Z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/applyasyougo',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: 'Email',
    href: 'mailto:info@applyasyougo.in',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
]

const Footer = () => {
  return (
    <footer className="w-full bg-black border-t border-gray-800 pt-10 pb-6 px-6 md:px-12 text-sm text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        {/* Logo + Tagline */}
        <Link href="/" className="flex flex-col space-y-1 text-white">
          <span className="text-xl font-semibold tracking-wide">Apply As You Go</span>
          <span className="text-xs text-gray-400 leading-tight">
            Enabling tomorrow’s<br />on-demand workforce
          </span>
        </Link>

        {/* Navigation and Socials */}
        <div className="flex flex-col md:items-end gap-6">
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            <Link href="/blog" className="transition hover:text-white">Blog</Link>
            <Link href="/our-story" className="transition hover:text-white">About</Link>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            {socialLinks.map(({ name, href, icon }) => (
              <Link
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="p-2 border border-gray-800 rounded-full hover:text-white hover:border-white transition"
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Axios & Apply As You Go. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
