"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from './button'

const GetStartedCTA = () => {
  return (
    <section className="w-full py-20 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-0">
        <svg width="100%" height="100%" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M250 0L500 433H0L250 0Z" stroke="rgba(138, 43, 226, 0.4)" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">All it takes is <span className="text-purple-light">#one-click</span></h2>
          <p className="text-gray-400 mb-8">to be a career pro.</p>

          <Link href="http://app.proism.in/" target="_blank">
            <Button className="rounded-full px-8 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium neon-glow">
              Ready Yet? Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default GetStartedCTA
