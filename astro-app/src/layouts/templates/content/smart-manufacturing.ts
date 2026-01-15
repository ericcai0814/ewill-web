/**
 * 智慧製造頁面硬編碼內容
 * Template 根據 page.slug 載入對應內容
 */

export interface SmartManufacturingContent {
  intro: {
    label: string;
    title: string;
    description: string;
  };
  sections: {
    id: string;
    type: string;
    title: string;
    description?: string;
    columns?: number;
    variant?: string;
    layout?: string;
    features?: {
      id: string;
      image_id?: string;
      title: string;
      description: string;
      link?: string;
    }[];
  }[];
  cta: {
    title: string;
    description: string;
    button_text: string;
    button_link: string;
  };
  images: {
    hero: string;
  };
}

// 智慧製造內容映射表
export const SMART_MANUFACTURING_CONTENT: Record<string, SmartManufacturingContent> = {
  // ========== 智慧製造解決方案總覽 ==========
  smartmanufacturing_ai: {
    intro: {
      label: 'Smart Manufacturing',
      title: '智慧製造',
      description: `透過智慧製造整合方案，我們提供先進規劃與排程（APS）、製造執行系統（MES）、智慧供應鏈管理（SCM）及智慧倉儲管理（WMS）。
透過數據整合、即時監控與可視化管理，協助企業全面提升生產效率、供應彈性與營運競爭力。`,
    },
    sections: [
      {
        id: 'smart_manufacturing',
        type: 'feature_showcase',
        title: '智慧製造解決方案',
        layout: 'alternating',
        features: [
          {
            id: 'aps',
            image_id: 'solutions_card_1',
            title: 'APS 智慧生產核心',
            description: '即時分析產線狀況，自動排程優化人力與設備資源配置。快速應對訂單變更與設備異常，確保生產流程順暢，全面提升產能利用率與交期可靠度。',
            link: '/aps/',
          },
          {
            id: 'mes',
            image_id: 'whatweoffer_card_3',
            title: 'MES 製造執行系統',
            description: '串接 ERP 與現場設備，實現資訊流與物流的整合。即時監控產線運作，快速掌握生產動態，強化品質追溯，有效降低錯誤率並提升生產透明度。',
            link: '/mes/',
          },
          {
            id: 'scm',
            image_id: 'solutions_card_2',
            title: 'SCM 智慧供應鏈管理系統',
            description: '整合上下游資源，強化跨部門協作。透過精準需求預測與即時預警機制，降低庫存積壓與物流成本，確保交付準時率並提升客戶滿意度。',
            link: '/scm/',
          },
          {
            id: 'wms',
            image_id: 'whatweoffer_card_1',
            title: 'WMS 智慧倉儲管理系統',
            description: '即時掌握庫存流動，實現收貨、分揀與出庫等全流程自動化。支援 AGV 與智慧料架整合，提升作業效率與出貨準確性。',
            link: '/wms/',
          },
        ],
      },
      {
        id: 'smart_management',
        type: 'product_intro',
        title: '智慧管理',
        description: `透過智慧管理系統，我們提供承商管理系統與環境監測系統，協助企業實現數據集中化與視覺化管理，
提升跨單位溝通效率與即時事件追蹤能力。結合多因子認證、數據整合與動態分析，
確保在安全管理、環境監測及營運效率上達到最佳效能，推動企業智慧化與永續發展。`,
      },
      {
        id: 'smart_management_solutions',
        type: 'feature_showcase',
        title: '智慧管理解決方案',
        layout: 'alternating',
        features: [
          {
            id: 'cms_568',
            image_id: '568_card',
            title: '承商管理系統',
            description: '數位化管理承攬廠商及工地人員，實現多因子認證進場和快速身份核查，防止非法入場，並利用視覺化數據分析，提升管理效率與決策精確性。',
            link: '/cms_568/',
          },
          {
            id: 'env_monitor',
            image_id: 'environment_card',
            title: '環境監測系統',
            description: '整合環境監測數據和 CCTV，提供即時數據更新與視覺化展示，提升數據管理效率及應急處理能力，實現集中管理，全面掌控環境狀況。',
          },
        ],
      },
      {
        id: 'ai_application',
        type: 'product_intro',
        title: 'AI 應用服務',
        description: `我們的 AI 解決方案結合 AI Agent 智能代理人與 AI 數據分析與預測，協助企業全面提升營運效能。
透過自動化、即時互動、數據驅動決策與嚴格的安全合規保障，
我們為企業打造量身訂製的智慧架構，實現效率提升、風險控管與市場先機，助您邁向數位轉型的智能未來。`,
      },
      {
        id: 'ai_solutions',
        type: 'feature_showcase',
        title: 'AI 解決方案',
        layout: 'alternating',
        features: [
          {
            id: 'ai_agent',
            image_id: 'whatweoffer_card_3',
            title: 'AI Agent 解決方案',
            description: '自動化工作，全天候回應需求，提升服務效率。結合自然語言處理與機器學習，生成分析報告，協助企業專注高價值任務，加速數位轉型。',
            link: '/ai_agent/',
          },
          {
            id: 'ai_forecast',
            image_id: 'solutions_card_1',
            title: 'AI 數據分析與預測',
            description: '整合多元數據，透過機器學習進行精準預測。以視覺化報表動態掌握商機與風險，同時嚴格保障數據安全，打造企業專屬競爭力。',
            link: '/ai_forecasting/',
          },
        ],
      },
      {
        id: 'data_applications',
        type: 'product_intro',
        title: '數據應用',
        description: `透過數據中台，統一整合企業內外部多元數據，打破資料孤島，提供即時且可靠的數據基礎，
支援跨部門靈活應用與高效決策。結合 3D 數位戰情儀表板，以視覺化方式集中管理數據，
即時共享資訊、簡化操作流程，提升跨單位溝通效率，降低管理成本並加速決策。`,
      },
      {
        id: 'data_solutions',
        type: 'feature_showcase',
        title: '數據解決方案',
        layout: 'alternating',
        features: [
          {
            id: 'data_platform',
            image_id: 'management_card',
            title: '數據中台',
            description: '整合企業內外部數據資源，打破資料孤島，提供即時可視化洞察。加速決策與創新，同時嚴格保障數據安全，全面提升核心競爭力。',
            link: '/data_middleware/',
          },
          {
            id: 'dashboard_3d',
            image_id: 'environment_card',
            title: '3D 數位戰情儀表板',
            description: '統一數據集中管理，提升跨單位溝通效率。3D 視覺化平台即時共享信息、簡化操作流程，降低管理成本，提高決策效率。',
          },
        ],
      },
    ],
    cta: {
      title: '立即行動，搶佔智慧製造先機！',
      description: '讓專業顧問為您規劃專屬智慧製造解決方案',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
    images: {
      hero: 'ai_banner',
    },
  },

  // ========== MES 製造執行系統 ==========
  mes: {
    intro: {
      label: '製造執行系統',
      title: '什麼是 MES 製造執行系統？',
      description: `MES（Manufacturing Execution System，製造執行系統）是一套專為現代製造業打造的智能管理平台。
它串接企業內部的 ERP 系統與現場生產設備，實現資訊流與物流的無縫整合，
協助企業即時掌控、追蹤與優化整個生產流程。`,
    },
    sections: [
      {
        id: 'advantages',
        type: 'feature_grid',
        title: 'MES 的核心優勢',
        columns: 3,
        variant: 'icon',
        features: [
          { id: 'advantage_1', title: '即時數據監控', description: '隨時掌握產線動態，生產狀態一目了然，快速發現瓶頸與異常。' },
          { id: 'advantage_2', title: '資源調度', description: '靈活調度資源，提升產能利用率。' },
          { id: 'advantage_3', title: '品質全程追溯', description: '每一件產品從原料進廠到最終出貨全程記錄，有效強化品質管理。' },
          { id: 'advantage_4', title: '減少人為錯誤', description: '標準化作業流程，降低錯誤率與返工成本。' },
          { id: 'advantage_5', title: '數位化無紙化管理', description: '省去繁瑣紙本紀錄，促進環保並提升資料準確性。' },
        ],
      },
      {
        id: 'why_choose',
        type: 'feature_grid',
        title: '為什麼選擇我們的 MES 系統？',
        columns: 3,
        variant: 'minimal',
        features: [
          { id: 'reason_1', title: '易於整合', description: '可與主流 ERP、WMS、PLM 等系統無縫接軌，資料互通無礙。' },
          { id: 'reason_2', title: '直覺化操作介面', description: '簡易上手，減少員工培訓時間，提高導入效率。' },
          { id: 'reason_3', title: '專業顧問服務', description: '導入前後全程技術支援，協助企業穩健轉型智慧製造。' },
        ],
      },
    ],
    cta: {
      title: '立即行動，搶佔智慧製造先機！',
      description: '讓專業顧問為您規劃專屬 MES 解決方案',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
    images: {
      hero: 'mes_banner_2',
    },
  },

  // ========== WMS 倉儲管理系統 ==========
  wms: {
    intro: {
      label: '倉儲管理系統',
      title: '什麼是 WMS？',
      description: `WMS（Warehouse Management System，倉儲管理系統）是一套專為現代企業設計的智慧倉儲解決方案，
協助企業全面管理庫存、優化作業流程、提升作業透明度，從而降低成本並提升服務品質。`,
    },
    sections: [
      {
        id: 'advantages',
        type: 'feature_grid',
        title: 'WMS 系統的核心優勢',
        columns: 3,
        variant: 'icon',
        features: [
          { id: 'advantage_1', title: '即時庫存掌握', description: '動態追蹤庫存流動，精準掌握每一筆進出貨資訊，實現零庫存差異。' },
          { id: 'advantage_2', title: '作業流程自動化', description: '自動化收貨、分揀、補貨等流程，大幅提升倉儲作業效率。' },
          { id: 'advantage_3', title: '彈性擴展整合', description: '輕鬆與 ERP、電商平台、物流運輸系統無縫整合，滿足多元業務需求。' },
          { id: 'advantage_4', title: '數據分析決策', description: '即時生成報表，洞察營運關鍵數據，協助管理層快速做出精準判斷。' },
          { id: 'advantage_5', title: 'AGV 與智慧設備整合', description: '可整合 AGV、定位系統（UWB）、智慧料架，有效提升效率並降低人工作業錯誤。' },
        ],
      },
      {
        id: 'why_choose',
        type: 'feature_grid',
        title: '為什麼選擇我們的 WMS 解決方案？',
        columns: 3,
        variant: 'minimal',
        features: [
          { id: 'reason_1', title: '提升庫存準確度', description: '整合定位系統及智慧料架，即時追蹤庫存動態，減少人工盤點錯誤。' },
          { id: 'reason_2', title: '優化作業效率', description: '整合 AGV 自動化入庫、出庫、補貨、盤點，有效縮短作業時間。' },
          { id: 'reason_3', title: '降低營運成本', description: '精準的庫存管理和流程優化，減少不必要的庫存與搬運。' },
          { id: 'reason_4', title: '強化客戶服務', description: '準確且快速的訂單處理，縮短出貨時間，提高訂單履約率。' },
          { id: 'reason_5', title: '減少人為錯誤', description: '通過條碼等自動識別技術，降低人工操作失誤，確保貨品準確出入庫。' },
        ],
      },
    ],
    cta: {
      title: '立即行動，搶佔智慧製造先機！',
      description: '讓專業顧問為您規劃專屬 WMS 解決方案',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
    images: {
      hero: 'wms_banner_2',
    },
  },

  // ========== SCM 供應鏈管理系統 ==========
  scm: {
    intro: {
      label: '供應鏈管理系統',
      title: '什麼是 SCM 系統？',
      description: `SCM（Supply Chain Management，供應鏈管理）系統是一套整合企業上下游資源、提升協作效率的關鍵工具。
它協助企業全面掌握供應、製造、倉儲、物流及銷售等流程，實現資訊即時流通、成本最小化與利潤最大化。`,
    },
    sections: [
      {
        id: 'advantages',
        type: 'feature_grid',
        title: 'SCM 系統的核心優勢',
        columns: 4,
        variant: 'icon',
        features: [
          { id: 'advantage_1', title: '提高運營效率', description: '自動化並優化供應鏈各環節，減少人工操作和重複性工作，有效縮短生產與交貨周期。' },
          { id: 'advantage_2', title: '降低成本', description: '透過精準的需求預測、庫存管理和運輸規劃，減少庫存積壓、避免過度採購，大幅降低倉儲和物流成本。' },
          { id: 'advantage_3', title: '加強資訊透明度', description: '將供應鏈各環節數據集中管理，實現即時資訊共享，提高決策的準確性與反應速度。' },
          { id: 'advantage_4', title: '提升客戶滿意度', description: '精確的訂單管理與配送協調，確保產品按時、按量交付，減少延誤與錯誤。' },
        ],
      },
      {
        id: 'features',
        type: 'feature_showcase',
        title: '為什麼選擇我們的 SCM 系統？',
        layout: 'alternating',
        features: [
          {
            id: 'feature_1',
            image_id: 'scm',
            title: '端到端供應鏈可視化',
            description: '我們的供應鏈方案能協助企業實現全鏈路追蹤、跨工廠即時協同、全流程預警機制，優化庫存結構、減少資金佔用、建立數據驅動的管理文化，快速應對市場與供應變化。',
          },
        ],
      },
    ],
    cta: {
      title: '立即行動，搶佔智慧製造先機！',
      description: '讓專業顧問為您規劃專屬 SCM 解決方案',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
    images: {
      hero: 'scm_banner_2',
    },
  },

  // ========== APS 先進規劃排程系統 ==========
  aps: {
    intro: {
      label: '智慧排程系統',
      title: '什麼是 APS 系統？',
      description: `APS（Advanced Planning & Scheduling，先進規劃與排程）系統，是一種以「決策支援」為核心的製造業先進智能生產排程系統。
是現代製造業邁向智慧化、數位化不可或缺的關鍵利器。透過先進的演算法，APS 系統能夠在極短時間內完成複雜生產計畫的自動排程，
實現資源最佳分配，協助企業於快速變化的市場中立於不敗之地。`,
    },
    sections: [
      {
        id: 'advantages',
        type: 'feature_grid',
        title: 'APS 系統的核心優勢',
        columns: 3,
        variant: 'icon',
        features: [
          { id: 'advantage_1', title: '提升生產效率', description: '即時分析產線狀況，自動調整生產排程，降低等待與閒置時間，顯著提升整體產能。' },
          { id: 'advantage_2', title: '精準交期控管', description: '根據訂單需求與資源狀況，精確預測並承諾交期，增強客戶信賴。' },
          { id: 'advantage_3', title: '彈性應變能力', description: '快速因應突發訂單變更或設備異常，自動重排最佳生產流程，減少損失。' },
          { id: 'advantage_4', title: '全面資源整合', description: '整合人力、設備、物料等資源，達到最大利用率，降低營運成本。' },
          { id: 'advantage_5', title: '數據即時可視化', description: '提供即時、動態的生產數據儀表板，管理層能隨時掌握現場狀況，做出精準決策。' },
        ],
      },
      {
        id: 'features',
        type: 'feature_showcase',
        title: '為什麼選擇我們的 APS 解決方案？',
        layout: 'alternating',
        features: [
          {
            id: 'feature_1',
            image_id: 'product_aps_2',
            title: '專業顧問服務',
            description: '由專業顧問為您規劃專屬 APS 解決方案，助您的企業實現智慧生產、效率翻倍、營運升級！',
          },
        ],
      },
    ],
    cta: {
      title: '立即行動，搶佔智慧製造先機！',
      description: '讓專業顧問為您規劃專屬 APS 解決方案',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
    images: {
      hero: 'hero_aps',
    },
  },

  // ========== CMS 568 承攬商管理系統 ==========
  cms_568: {
    intro: {
      label: '承攬商管理系統',
      title: 'CMS 568 承攬商管理系統',
      description: `符合勞動部職安法規要求，提供承攬商資格審查、人員進出場管理、安全教育訓練紀錄與工安稽核功能。
數位化承攬商管理流程，降低職災風險，確保廠區作業安全合規。`,
    },
    sections: [
      {
        id: 'challenges',
        type: 'feature_grid',
        title: '承攬商管理的五大核心挑戰',
        columns: 3,
        variant: 'icon',
        features: [
          { id: 'challenge_1', title: '紙本作業低效', description: '承攬商與勞務包統計繁瑣，管理難度高。' },
          { id: 'challenge_2', title: '人員進出管控困難', description: '無法即時紀錄與驗證進出廠區的人員，增加安全風險。' },
          { id: 'challenge_3', title: '工作執行追蹤不足', description: '無法有效確認工人在場內是否確實執行工作，影響管理效能。' },
          { id: 'challenge_4', title: '出入場換證繁瑣', description: '人工驗證程序費時費力，影響工作效率。' },
          { id: 'challenge_5', title: '工安稽查不易', description: '缺乏即時監控與紀錄，導致違規與工安事件難以追溯。' },
        ],
      },
      {
        id: 'main_feature',
        type: 'feature_showcase',
        title: '六大系統特色',
        description: '透過多因子認證、遠端監控、數位化管理與即時數據分析，全面提升承攬商管理效率。',
        layout: 'image-left',
        features: [
          {
            id: 'main_feature',
            image_id: 'product_568_main',
            title: '全方位承攬商管理',
            description: '確保人員進出管控、工時紀錄及工安稽查合規透明。簡化行政流程，減少人工作業負擔，降低違規與工安風險，打造更安全、高效的施工環境。',
          },
        ],
      },
      {
        id: 'features',
        type: 'feature_showcase',
        title: '系統核心功能',
        layout: 'alternating',
        features: [
          { id: 'feature_1', image_id: 'feature_568_1', title: '多因子認證進場', description: '大批人員同時進場，警衛無法負荷，透過多因子認證確保身份驗證，提升效率。' },
          { id: 'feature_2', image_id: 'feature_568_2', title: '遠端監看人員及設備', description: '即時監控人員出廠狀況，精準計算廠內有效與無效人力，確保工時管理透明化。' },
          { id: 'feature_3', image_id: 'feature_568_3', title: '承攬商制度化管理', description: '數位化管理上百家承攬商資料，提升合約追蹤與績效評估效率，確保合作品質。' },
          { id: 'feature_4', image_id: 'feature_568_4', title: '線上點工及審核', description: '即時掌握工地違規行為，提升工安管理效能，並確保意外責任可追溯。' },
          { id: 'feature_5', image_id: 'feature_568_5', title: '隨機稽查人員', description: '簡化申請與審核流程，減少繁瑣紙本作業，提升行政效率與施工進度。' },
        ],
      },
      {
        id: 'verification',
        type: 'product_intro',
        title: '智慧身份驗證與工安管理',
        description: `透過多因子認證與一碼快速身份確認，確保人員身份準確，防止代刷、未授權進入及違規滯留。
系統自動記錄進出場狀況，嚴格落實工安規範，避免人數虛報與工時造假，降低安全風險。
搭配廠務分析儀表板，即時整合進出數據，提供階層式分析與條件查詢，讓管理決策更精準。`,
      },
      {
        id: 'verification_features',
        type: 'feature_showcase',
        title: '驗證與分析功能',
        layout: 'alternating',
        features: [
          { id: 'demo_1', image_id: 'demo_568_1', title: '多因子認證進場', description: '防止人員代刷、闘入，確保身份驗證正確。阻擋非合格人員進廠，提升工安管控能力。' },
          { id: 'demo_2', image_id: 'demo_568_2', title: '一碼快速身份確認', description: '快速查核人員身份與施工區域，減少管理盲點。確保進場人員到達指定工作區域。' },
          { id: 'demo_3', image_id: 'demo_568_3', title: '符合工安規範', description: '確保人員遵守「先進後出」規定，杜絕違規行為。防止承攬商虛報進場人數，確保工時紀錄真實有效。' },
          { id: 'demo_4', image_id: 'demo_568_4', title: '廠務分析儀表板', description: '一頁式整合資訊，即時呈現關鍵數據。階層式分析從總覽到細節，快速定位問題來源。' },
        ],
      },
    ],
    cta: {
      title: '立即體驗 CMS 568 承攬商管理系統',
      description: '讓專業顧問協助您評估承攬商管理需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
    images: {
      hero: 'hero_568',
    },
  },
};

// 取得智慧製造內容的輔助函數
export function getSmartManufacturingContent(slug: string): SmartManufacturingContent | null {
  return SMART_MANUFACTURING_CONTENT[slug] || null;
}
