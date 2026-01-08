import { Card } from '@/components/ui'

const solutions = [
  {
    id: 'smart',
    title: '智慧管理',
    description: '提供 3D 數位戰情儀表板、承商管理系統及環境監測系統，實現數據集中、視覺化管理，提升管理效率與安全性。',
    image: '/assets/solutions_card_1.png',
    href: '/solutions#smart_management',
  },
  {
    id: 'assessment',
    title: '資安評估',
    description: '全面盤點企業資訊環境，找出潛在風險與漏洞，掌握現有防護狀況，量化資安成熟度，作為後續強化與改善的依據。',
    image: '/assets/solutions_card_2.png',
    href: '/solutions#security_assessment',
  },
  {
    id: 'testing',
    title: '資安檢測',
    description: '模擬真實攻擊情境，針對系統與應用進行滲透測試與弱點掃描，揭露防線弱點，協助企業主動修補風險。',
    image: '/assets/whatweoffer_card_1.png',
    href: '/solutions#security_testing',
  },
  {
    id: 'defense',
    title: '資安防護',
    description: '導入先進防禦技術，整合端點防護、行為分析、威脅偵測與即時防禦機制，強化資安韌性，快速攔截各類攻擊行為。',
    image: '/assets/whatweoffer_card_2.png',
    href: '/solutions#security_defense',
  },
  {
    id: 'enhancement',
    title: '資安強化',
    description: '依評估與檢測結果，制定資安強化計畫，推動弱點修補、教育訓練與自動化防護，強化防禦深度，確保合規與營運安全。',
    image: '/assets/whatweoffer_card_3.png',
    href: '/solutions#security_enhancement',
  },
]

export function SolutionsSection() {
  return (
    <section
      id="solutions"
      className="py-24 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      }}
    >
      {/* Background Decoration */}
      <div
        className="absolute right-0 bottom-0 w-[300px] h-[300px] opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/home-bg.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'right bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-medium tracking-wider uppercase" style={{ color: '#00d4aa' }}>
            Solutions
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold" style={{ color: '#0a1628' }}>
            產品解決方案
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: '#4a5568' }}>
            鎰威科技提供五大解決方案，全面強化企業營運與資安防護。
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution) => (
            <Card
              key={solution.id}
              image={{ src: solution.image, alt: solution.title }}
              title={solution.title}
              description={solution.description}
              href={solution.href}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
