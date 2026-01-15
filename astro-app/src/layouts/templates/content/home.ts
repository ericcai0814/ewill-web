/**
 * 首頁硬編碼內容
 * Template 自主決定所有顯示內容
 */

export const HOME_CONTENT = {
  about: {
    label: 'About Us',
    title: '關於我們',
    text: `鎰威科技專注於推動企業數位轉型，結合資訊安全、AI 科技與大數據應用。
從架構規劃到服務導入，提供專業高效的一站式安全服務。
秉持專業、效率、信任、創新的精神與持續提供優質服務的態度，
攜手客戶共同邁向成長與成功。`,
  },

  services: {
    label: 'What We Offer',
    title: '服務項目',
    description: '服務項目包含「軟體開發服務」、「資訊安全服務」和「系統規劃服務」，全方位滿足企業數位轉型需求。',
    items: [
      {
        id: 'service_software',
        title: '軟體開發服務',
        description: '結合 SSDLC 和 V-model 流程，從需求到部署貫穿安全測試，確保系統高穩定性和可靠性，實現高效、安全的數位轉型。',
        link: '/services/#software_development',
        link_text: '了解更多',
      },
      {
        id: 'service_security',
        title: '資訊安全服務',
        description: '透過多項資安工具進行評級檢測、弱點掃描和日誌管理，提供端點安全、網路防護，確保企業系統穩定與數據安全。',
        link: '/services/#security_services',
        link_text: '了解更多',
      },
      {
        id: 'service_system',
        title: '系統規劃服務',
        description: '提供 Ubuntu、VMware 和 Proxmox VE 三大虛擬化方案，具備靈活性、安全性與高效資源管理，滿足企業多樣需求。',
        link: '/services/#system_planning',
        link_text: '了解更多',
      },
    ],
  },

  solutions: {
    label: 'Solutions',
    title: '產品解決方案',
    description: '鎰威科技提供五大解決方案，全面強化企業營運與資安防護。',
    items: [
      {
        id: 'solution_smart',
        title: '智慧管理',
        description: '提供 3D 數位戰情儀表板、承商管理系統及環境監測系統，實現數據集中、視覺化管理，提升管理效率與安全性。',
        link: '/solutions/#smart_management',
        link_text: '了解更多',
      },
      {
        id: 'solution_assess',
        title: '資安評估',
        description: '全面盤點企業資訊環境，找出潛在風險與漏洞，掌握現有防護狀況，量化資安成熟度，作為後續強化與改善的依據。',
        link: '/solutions/#security_assessment',
        link_text: '了解更多',
      },
      {
        id: 'solution_testing',
        title: '資安檢測',
        description: '模擬真實攻擊情境，針對系統與應用進行滲透測試與弱點掃描，揭露防線弱點，協助企業主動修補風險。',
        link: '/solutions/#security_testing',
        link_text: '了解更多',
      },
      {
        id: 'solution_defense',
        title: '資安防護',
        description: '導入先進防禦技術，整合端點防護、行為分析、威脅偵測與即時防禦機制，強化資安韌性，快速攔截各類攻擊行為。',
        link: '/solutions/#security_defense',
        link_text: '了解更多',
      },
      {
        id: 'solution_enhance',
        title: '資安強化',
        description: '依評估與檢測結果，制定資安強化計畫，推動弱點修補、教育訓練與自動化防護，強化防禦深度。',
        link: '/solutions/#security_enhancement',
        link_text: '了解更多',
      },
    ],
  },

  popup: {
    link: '/logsec',
    trigger: 'first_visit',
  },

  // 圖片 ID（Template 用於 getAssetById）
  images: {
    hero: 'hero_banner',
    hero_mobile: 'bn_home_m',
    popup: 'popup_logsec',
    service_cards: {
      service_software: 'service_software',
      service_security: 'service_security',
      service_system: 'service_system',
    },
    solution_cards: {
      solution_smart: 'solution_smart',
      solution_assess: 'solution_assess',
      solution_testing: 'solution_testing',
      solution_defense: 'solution_defense',
      solution_enhance: 'solution_enhance',
    },
  },
};
