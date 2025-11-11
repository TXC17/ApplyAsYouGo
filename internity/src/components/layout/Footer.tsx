"use client"

import React from 'react'
import Link from 'next/link'

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

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-4">
          <Link href="/blog" className="transition hover:text-white">Blog</Link>
          <Link href="/our-story" className="transition hover:text-white">About</Link>
          <Link href="/contact" className="transition hover:text-white">Contact</Link>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Axios & Apply As You Go. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
