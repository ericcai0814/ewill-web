'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface PopupBannerProps {
  image: string
  alt: string
  href: string
  storageKey?: string
  delay?: number
}

export function PopupBanner({
  image,
  alt,
  href,
  storageKey = 'ewill_popup_shown',
  delay = 2000,
}: PopupBannerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasShown = localStorage.getItem(storageKey)
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [storageKey, delay])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem(storageKey, 'true')
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div className="relative max-w-[80vw] max-h-[80vh] animate-scale-in">
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors z-10"
          aria-label="關閉"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <Link href={href} onClick={handleClose}>
          <Image
            src={image}
            alt={alt}
            width={800}
            height={600}
            className="rounded-xl shadow-2xl"
            priority
          />
        </Link>
      </div>
    </div>
  )
}

