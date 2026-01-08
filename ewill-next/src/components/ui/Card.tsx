import Image from 'next/image'
import Link from 'next/link'

interface CardProps {
  image: {
    src: string
    alt: string
  }
  title: string
  description?: string
  href?: string
  className?: string
}

export function Card({
  image,
  title,
  description,
  href,
  className = '',
}: CardProps) {
  const content = (
    <article 
      className={`group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="relative h-[200px] overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 
          className="text-xl font-bold mb-2 transition-colors"
          style={{ color: '#0a1628' }}
        >
          {title}
        </h3>
        {description && (
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: '#4a5568' }}>
            {description}
          </p>
        )}
        {href && (
          <span className="inline-block mt-4 font-medium transition-transform group-hover:translate-x-1" style={{ color: '#00d4aa' }}>
            了解更多 →
          </span>
        )}
      </div>
    </article>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
