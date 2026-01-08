import Image from 'next/image'

interface HeroSectionProps {
  desktopImage: string
  mobileImage: string
  alt: string
}

export function HeroSection({ desktopImage, mobileImage, alt }: HeroSectionProps) {
  return (
    <section className="relative w-full pt-20">
      {/* Desktop Banner */}
      <div className="hidden md:block relative w-full h-[600px]">
        <Image
          src={desktopImage}
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      
      {/* Mobile Banner */}
      <div className="block md:hidden relative w-full h-[400px]">
        <Image
          src={mobileImage}
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </section>
  )
}

