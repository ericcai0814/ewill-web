import { Card } from '@/components/ui'

const services = [
  {
    id: 'software',
    title: '軟體開發服務',
    description: '結合 SSDLC 和 V-model 流程，從需求到部署貫穿安全測試，確保系統高穩定性和可靠性，實現高效、安全的數位轉型。',
    image: '/assets/whatweoffer_card_1.png',
    href: '/services#software_development',
  },
  {
    id: 'security',
    title: '資訊安全服務',
    description: '透過多項資安工具進行評級檢測、弱點掃描和日誌管理，提供端點安全、網路防護，確保企業系統穩定與數據安全。',
    image: '/assets/whatweoffer_card_2.png',
    href: '/services#security_services',
  },
  {
    id: 'system',
    title: '系統規劃服務',
    description: '提供 Ubuntu、VMware 和 Proxmox VE 三大虛擬化方案，具備靈活性、安全性與高效資源管理，滿足企業多樣需求。',
    image: '/assets/whatweoffer_card_3.png',
    href: '/services#system_planning',
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-24" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-medium tracking-wider uppercase" style={{ color: '#00d4aa' }}>
            What We Offer
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold" style={{ color: '#0a1628' }}>
            服務項目
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: '#4a5568' }}>
            服務項目包含「軟體開發服務」、「資訊安全服務」和「系統規劃服務」，全方位滿足企業數位轉型需求。
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card
              key={service.id}
              image={{ src: service.image, alt: service.title }}
              title={service.title}
              description={service.description}
              href={service.href}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
