import HeroScene from "@/components/hero-scene"

export default function PortfolioPage() {
  return (
    <div className="relative w-full min-h-screen">
      <HeroScene />

      {/* Fallback/Mobile Content would be handled here or inside the Scroll component for better hydration */}
      <div className="sr-only">
        <h1>Tanish Jagtap Portfolio</h1>
        <p>Interactive 3D Portfolio experience showcasing web development and design skills.</p>
      </div>
    </div>
  )
}
