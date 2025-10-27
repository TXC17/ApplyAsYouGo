"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
// import RotatingText from "../RotatingText/RotatingText"
// import GlitchText from "../GlitchText/GlitchText"
import BlurText from "../BlurText/BlurText"
// import Waves from "../Hyperspeed/Hyperspeed"
// import Hyperspeed from "../Hyperspeed/Hyperspeed"
// import Orb from "../Orb/Orb"
import Iridescence from "../Iridescence/Iridescence"
import { ArrowRight } from "lucide-react"
import { useAuth } from "@/app/context/context"

const Hero = () => {
  const ApplyAsYouGoTextRef = useRef<HTMLDivElement>(null)
  const { isLoggedIn } = useAuth()

  return (
    <section className="relative w-full h-screen flex items-center justify-center mt-0 pt-0 pb-0 overflow-hidden">
      {/* Iridescence Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence
          color={[1, 1, 1]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          {/* Main heading - INCREASED TEXT SIZE */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
            <span className="flex flex-wrap items-center justify-center">
              <BlurText
                text="Effortless"
                delay={100}
                animateBy="words"
                direction="top"
                className="text-black mr-3"
              />
                     <BlurText
                       text="Job Search"
                       delay={150}
                       animateBy="words"
                       direction="top"
                       className="text-black"
                     />
            </span>
          </h1>

          {/* Subheading - INCREASED TEXT SIZE */}
          <p className="text-black text-xl md:text-2xl mb-12 max-w-2xl">
            Land your dream job faster with Apply As You Go.
            One-click resumes, smarter job matches, and a job hunt that works for you.
          </p>

          {/* CTA Button - THIS IS THE HIGHLIGHTED BUTTON CODE */}
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button
                className="rounded-full px-10 py-7 bg-gradient-to-r from-[rgba(8,8,8,0.7)] to-[rgba(10,10,10,0.7)] 
                 hover:from-[rgba(19,19,24,0.85)] hover:to-[rgba(19,19,24,0.85)] 
                 text-[#f1eece] text-lg font-medium shadow-lg backdrop-blur-sm 
                 border border-transparent hover:border-[#f1eece] hover:shadow-[0_0_15px_#f1eece] 
                 transition duration-300"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-6 w-6 text-[#f1eece]" />
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button
                className="rounded-full px-10 py-7 bg-gradient-to-r from-[rgba(8,8,8,0.7)] to-[rgba(10,10,10,0.7)] 
               hover:from-[rgba(19,19,24,0.85)] hover:to-[rgba(19,19,24,0.85)] 
               text-[#f1eece] text-lg font-medium shadow-lg backdrop-blur-sm 
               border border-transparent hover:border-[#f1eece] hover:shadow-[0_0_15px_#f1eece] 
               transition duration-300"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-6 w-6 text-[#f1eece]" />
              </Button>
            </Link>
          )}



        </div>
      </div>
    </section>
  )
}

export default Hero

