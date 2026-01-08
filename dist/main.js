/**
 * 鎰威科技 - 首頁 JavaScript
 * 
 * 功能：
 * - Schema.org JSON-LD 注入
 * - 導覽列滾動效果
 * - 廣告彈窗控制
 */

// ============================================================
// Schema.org JSON-LD 結構化資料
// 來源：pages/index/index.yml 的 aio 區塊
// ============================================================

const schemaOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "鎰威科技股份有限公司",
  "alternateName": "Ewill Technology",
  "url": "https://www.ewill.com.tw",
  "logo": "https://www.ewill.com.tw/assets/logo.png",
  "description": "鎰威科技是台灣領先的企業數位轉型與資訊安全服務供應商，代理國際資安品牌並提供智慧製造整合解決方案。",
  "foundingDate": "1998",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "台北市",
    "addressRegion": "台灣",
    "addressCountry": "TW"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["Chinese", "English"]
  },
  "sameAs": [
    "https://www.linkedin.com/company/ewill-technology",
    "https://www.facebook.com/ewilltechnology"
  ]
};

const schemaWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "鎰威科技官方網站",
  "url": "https://www.ewill.com.tw",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.ewill.com.tw/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const schemaWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "鎰威科技 | 企業資安與智慧製造數位轉型專家",
  "description": "鎰威科技專注於企業數位轉型，整合資訊安全、AI 智慧製造與大數據應用。",
  "primaryImageOfPage": "https://www.ewill.com.tw/assets/home_banner.jpg",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "首頁",
      "item": "https://www.ewill.com.tw/"
    }]
  }
};

const schemaFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "鎰威科技提供哪些服務？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "鎰威科技提供三大服務項目：軟體開發服務（SSDLC 與 V-model 流程）、資訊安全服務（SecurityScorecard、IST、Acunetix 等工具）、系統規劃服務（Ubuntu、VMware、Proxmox VE 虛擬化方案）。"
      }
    },
    {
      "@type": "Question",
      "name": "鎰威科技有哪些產品解決方案？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "鎰威科技提供五大解決方案：智慧管理（3D 儀表板、承商管理、環境監控）、資安評估（風險盤點、量化資安成熟度）、資安檢測（滲透測試、弱點掃描）、資安防護（端點防護、威脅偵測）、資安強化（弱點修補、教育訓練）。"
      }
    },
    {
      "@type": "Question",
      "name": "鎰威科技代理哪些國際資安品牌？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "鎰威科技代理多家國際知名資安品牌，包括 Palo Alto Networks、Fortinet、Acunetix、SecurityScorecard、Array Networks、Vicarius、IST、LOGSEC 等。"
      }
    },
    {
      "@type": "Question",
      "name": "什麼是智慧製造？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "智慧製造是運用 AI、IoT、大數據等技術，整合生產設備與資訊系統，實現自動化、數據化與智能化的現代製造模式。鎰威科技提供完整的智慧製造導入服務，包含 MES、WMS、SCM 等系統。"
      }
    }
  ]
};

// 注入 JSON-LD
function injectSchemaJsonLd() {
  const schemas = [schemaOrganization, schemaWebSite, schemaWebPage, schemaFAQ];
  
  schemas.forEach(schema => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
  
  console.log('✅ Schema.org JSON-LD 已注入');
}

// ============================================================
// 導覽列滾動效果
// ============================================================

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });
}

// ============================================================
// 廣告彈窗控制 - 首訪彈窗（全屏置中）
// ============================================================

function initPopupBanner() {
  const overlay = document.querySelector('.popup-overlay');
  const popup = overlay?.querySelector('.popup-banner');
  const closeBtn = popup?.querySelector('.close');
  
  if (!overlay || !popup) return;
  
  const POPUP_KEY = 'ewill_logsec_popup_shown';
  const hasShown = localStorage.getItem(POPUP_KEY);
  
  // 只在首次訪問時顯示
  if (!hasShown) {
    setTimeout(() => {
      overlay.classList.add('active');
    }, 2000);
  }
  
  // 關閉彈窗函數
  const closePopup = () => {
    overlay.classList.remove('active');
    localStorage.setItem(POPUP_KEY, 'true');
  };
  
  // 關閉按鈕
  closeBtn?.addEventListener('click', closePopup);
  
  // 點擊遮罩關閉
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closePopup();
    }
  });
  
  // ESC 鍵關閉
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closePopup();
    }
  });
  
  // 點擊廣告連結也記錄已顯示
  popup.querySelector('a')?.addEventListener('click', () => {
    localStorage.setItem(POPUP_KEY, 'true');
  });
}

// ============================================================
// Fade-in Animation on Scroll
// ============================================================

function initScrollAnimation() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.card, .section-header').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ============================================================
// 初始化
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  injectSchemaJsonLd();
  initNavbarScroll();
  initPopupBanner();
  initScrollAnimation();
  
  console.log('🚀 鎰威科技首頁已載入');
});


