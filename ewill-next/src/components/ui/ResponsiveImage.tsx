'use client'

import Image from 'next/image'

interface ResponsiveImageProps {
  desktop: string
  mobile: string
  alt: string
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
}

export function ResponsiveImage({
  desktop,
  mobile,
  alt,
  className = '',
  priority = false,
  fill = false,
  sizes = '100vw',
}: ResponsiveImageProps) {
  return (
    <>
      {/* Desktop */}
      <div className={`hidden md:block ${fill ? 'relative w-full h-full' : ''}`}>
        <Image
          src={desktop}
          alt={alt}
          className={className}
          priority={priority}
          fill={fill}
          sizes={sizes}
          {...(!fill && { width: 1920, height: 600 })}
        />
      </div>
      {/* Mobile */}
      <div className={`block md:hidden ${fill ? 'relative w-full h-full' : ''}`}>
        <Image
          src={mobile}
          alt={alt}
          className={className}
          priority={priority}
          fill={fill}
          sizes={sizes}
          {...(!fill && { width: 750, height: 400 })}
        />
      </div>
    </>
  )
}

