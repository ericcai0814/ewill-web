import Link from 'next/link'

export function AboutSection() {
  return (
    <section className="py-24" style={{ backgroundColor: 'rgb(248, 250, 252)' }}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-medium tracking-wider uppercase" style={{ color: '#00d4aa' }}>
            About Us
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold" style={{ color: '#0a1628' }}>
            關於我們
          </h2>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: '#4a5568' }}>
            鎰威科技專注於推動企業數位轉型，結合資訊安全、AI 科技與大數據應用。
            從架構規劃到服務導入，提供專業高效的一站式安全服務。
            秉持專業、效率、信任、創新的精神與持續提供優質服務的態度，
            攜手客戶共同邁向成長與成功。
          </p>

          {/* Values */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {['專業', '效率', '信任', '創新'].map((value) => (
              <div
                key={value}
                className="p-6 rounded-xl transition-colors"
                style={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0'
                }}
              >
                <span className="text-2xl font-bold" style={{ color: '#00d4aa' }}>{value}</span>
              </div>
            ))}
          </div>

          <Link 
            href="/about" 
            className="inline-flex mt-12 px-8 py-4 text-lg font-medium rounded-lg transition-colors"
            style={{ 
              backgroundColor: '#00d4aa',
              color: '#0a1628'
            }}
          >
            了解更多
          </Link>
        </div>
      </div>
    </section>
  )
}
