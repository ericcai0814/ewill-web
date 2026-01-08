'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const navItems = [
  { label: '關於我們', href: '/about' },
  { label: '服務項目', href: '/services' },
  { label: '產品解決方案', href: '/solutions' },
  { label: 'ESG', href: '/esg' },
  { label: '聯絡我們', href: '/contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        backgroundColor: isScrolled ? 'rgba(248, 250, 252, 0.95)' : 'rgb(248, 250, 252)',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold" style={{ color: '#0a1628' }}>
              <span style={{ color: '#00d4aa' }}>e</span>will
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-medium transition-colors hover:opacity-100"
                  style={{ color: '#4a5568' }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="hidden lg:inline-flex px-6 py-2.5 font-semibold rounded-lg transition-colors"
            style={{ backgroundColor: '#00d4aa', color: '#0a1628' }}
          >
            免費諮詢
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2"
            style={{ color: '#0a1628' }}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden rounded-lg mb-4 p-4"
            style={{ backgroundColor: 'rgb(248, 250, 252)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
          >
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block font-medium py-2"
                    style={{ color: '#4a5568' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="block w-full text-center px-6 py-3 font-semibold rounded-lg"
                  style={{ backgroundColor: '#00d4aa', color: '#0a1628' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  免費諮詢
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}
