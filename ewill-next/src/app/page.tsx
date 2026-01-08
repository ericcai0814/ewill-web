import {
  HeroSection,
  AboutSection,
  ServicesSection,
  SolutionsSection,
} from '@/components/sections'
import { PopupBanner } from '@/components/ui'

export default function HomePage() {
  return (
    <>
      {/* Hero Banner */}
      <HeroSection
        desktopImage="/assets/home-banner-1209.png"
        mobileImage="/assets/bn-home-m.jpg"
        alt="首頁主視覺橫幅，深藍色科技背景搭配專業標語"
      />

      {/* About Section */}
      <AboutSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Solutions Section */}
      <SolutionsSection />

      {/* First Visit Popup */}
      <PopupBanner
        image="/assets/logsec-popup-829.png"
        alt="LOGSEC 產品推廣廣告"
        href="/logsec"
        storageKey="ewill_logsec_popup_shown"
        delay={2000}
      />
    </>
  )
}
