import MainLayout from "@/components/layout/MainLayout"
import Hero from "@/components/home/Hero"
import Features from "@/components/home/Features"
import Testimonials from "@/components/home/Testimonials"


export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <Features />
      <Testimonials />
      </MainLayout>
  )
}
