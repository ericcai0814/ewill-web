import Link from 'next/link'

const footerLinks = {
  services: [
    { label: '軟體開發服務', href: '/services#software' },
    { label: '資訊安全服務', href: '/services#security' },
    { label: '系統規劃服務', href: '/services#system' },
  ],
  solutions: [
    { label: '智慧管理', href: '/solutions#smart' },
    { label: '資安評估', href: '/solutions#assessment' },
    { label: '資安防護', href: '/solutions#defense' },
  ],
  company: [
    { label: '關於我們', href: '/about' },
    { label: 'ESG', href: '/esg' },
    { label: '聯絡我們', href: '/contact' },
  ],
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: 'rgb(248, 250, 252)' }}>
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold" style={{ color: '#0a1628' }}>
                <span style={{ color: '#00d4aa' }}>e</span>will
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#64748b' }}>
              鎰威科技專注於推動企業數位轉型，結合資訊安全、AI 科技與大數據應用。
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/ewill-technology"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: '#64748b' }}
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/ewilltechnology"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: '#64748b' }}
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6" style={{ color: '#0a1628' }}>服務項目</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors text-sm hover:opacity-70"
                    style={{ color: '#64748b' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-lg font-semibold mb-6" style={{ color: '#0a1628' }}>產品解決方案</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors text-sm hover:opacity-70"
                    style={{ color: '#64748b' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-6" style={{ color: '#0a1628' }}>公司資訊</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors text-sm hover:opacity-70"
                    style={{ color: '#64748b' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-sm" style={{ color: '#64748b' }}>
              <p>台北市</p>
              <p className="mt-1">service@ewill.com.tw</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center" style={{ borderTop: '1px solid #e2e8f0' }}>
          <p className="text-sm" style={{ color: '#94a3b8' }}>
            © {new Date().getFullYear()} 鎰威科技股份有限公司. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-sm hover:opacity-70" style={{ color: '#94a3b8' }}>
              隱私權政策
            </Link>
            <Link href="/terms" className="text-sm hover:opacity-70" style={{ color: '#94a3b8' }}>
              服務條款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
