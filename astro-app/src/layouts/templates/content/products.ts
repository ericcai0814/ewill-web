/**
 * 產品頁硬編碼內容
 * Template 根據 page.slug 載入對應產品內容
 */

export interface ProductContent {
  hero: {
    image_id: string;
  };
  intro: {
    label: string;
    title: string;
    description: string;
  };
  features: {
    id: string;
    image_id: string;
    title: string;
    description: string;
    bullets?: string[];
  }[];
  gallery?: {
    title: string;
    images: { id: string; image_id: string }[];
  };
  cta: {
    title: string;
    description: string;
    button_text: string;
    button_link: string;
  };
}

// 產品內容映射表
export const PRODUCT_CONTENT: Record<string, ProductContent> = {
  // ========== LOGSEC ==========
  logsec: {
    hero: { image_id: 'logsec_banner' },
    intro: {
      label: '資安預警解決方案',
      title: 'LOGSEC 平台功能概覽',
      description: `LOGSEC 平台透過行為記錄整合與即時告警機制，協助企業建置完整的操作流程監控與資安事件應對能力。
涵蓋系統日誌集中管理、操作軌跡可視化、異常行為即時通報、模組化擴充部署與顧問支援服務，強化企業對內部操作與異常風險的掌握力。`,
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'logsec_1_fix',
        title: '整合日誌，安全更清晰',
        description: `客戶設備產生日誌繁多且分散，難以有效追蹤分析。LOGSEC 可將日誌統一整合並圖形化呈現，快速揭露威脅與異常。
原本需耗時數小時的檢視，如今僅需數分鐘即可完成，大幅提升資安效率。`,
      },
      {
        id: 'feature_2',
        image_id: 'logsec_2_fix2',
        title: '全方位登入活動與告警監控',
        description: '即時掌握登入嘗試、失敗與告警異常，提升帳號安全防護。',
      },
      {
        id: 'feature_3',
        image_id: 'graylog_7_fix_20250822',
        title: 'LOGSEC 集中式日誌管理方法',
        description: `LOGSEC 解決方案將 IT 環境中各個部分的日誌數據集中到一個平台，便於組織、豐富和分析。
透過整合日誌，您可以真正發揮數據的潛力。`,
      },
      {
        id: 'feature_4',
        image_id: 'graylog_3',
        title: '快速查詢與視覺化日誌資料',
        description: '支援即時查詢，快速追蹤事件來源與詳情，提高排查效率。',
      },
      {
        id: 'feature_5',
        image_id: 'graylog_4_fix_20250822',
        title: '智能異常行為偵測分析',
        description: '精準辨識可疑行為與異常使用者，強化安全監控能力。',
      },
      {
        id: 'feature_6',
        image_id: 'graylog_6_fix_20250822',
        title: '封鎖 IP 統計與全球分布圖',
        description: '即時呈現來源國統計與全球封鎖 IP 分佈，強化防禦佈局。',
      },
      {
        id: 'feature_7',
        image_id: 'graylog_5_fix_20250822',
        title: '簡化管理，強化防護，一次到位',
        description: '複雜日誌不再困擾，我們以集中化與即時告警，打造防護網，全面守護您的企業安全。',
      },
    ],
    cta: {
      title: '立即了解 LOGSEC 解決方案',
      description: '讓專業顧問協助您評估企業日誌管理與資安監控需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== Acunetix ==========
  acunetix: {
    hero: { image_id: 'bn_acu_1209_scaled' },
    intro: {
      label: '網站安全掃描',
      title: '網絡應用程序和 API 安全',
      description: '您不需要投入更多時間來處理應用安全，您只需要 Acunetix。通過六個簡單的步驟，即可自動化您的網絡應用程序和 API 安全管理。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'acunetix_1',
        title: '確保全面掃描與安全防護',
        description: `Acunetix 會自動創建並更新您的所有網站、應用程序和 API 的列表，確保發現所有需要掃描的內容。
這意味著您不會遺漏任何未掃描且容易受到攻擊的潛在入口點。`,
      },
      {
        id: 'feature_2',
        image_id: 'acunetix_2',
        title: '深入掃描應用程序的每個角落',
        description: `輕鬆掃描大多數其他漏洞掃描器無法觸及的區域。無論是單頁應用（SPAs）、腳本密集型網站，還是使用 HTML5 及 JavaScript 構建的應用程序，Acunetix 都能有效進行掃描。
此外，您還可以錄製巨集以自動掃描受密碼保護的區域和難以觸及的部分，並檢測其他掃描器無法看到的未鏈接文件和 API 端點。`,
      },
      {
        id: 'feature_3',
        image_id: 'acunetix_3',
        title: '檢測漏洞',
        description: `快速找到使您面臨風險的安全漏洞，偵測超過 12,000 個漏洞，包括零日漏洞。
使用世界上最準確的掃描器找出您的安全漏洞，立即揭示發現的漏洞。
同時掃描多個環境，通過結合 DAST + IAST 掃描獲得更全面的覆蓋範圍。`,
      },
    ],
    cta: {
      title: '立即體驗 Acunetix 網站弱點掃描',
      description: '讓專業顧問協助您評估 Web 應用程式安全需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== Bitdefender ==========
  bitdefender: {
    hero: { image_id: 'hero_bitdefender' },
    intro: {
      label: '防毒與威脅防護',
      title: 'Bitdefender GravityZone',
      description: '最全面企業入侵防禦平台，統一的預防、偵測、回應，全面防護端點、網路、雲端。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'product_gravityzone_architecture',
        title: 'Bitdefender 分層的新世代端點保護平台',
        description: '使用自動調整分層體系結構，其中包括端點控制、預防、偵測、修復與能見性。',
      },
      {
        id: 'feature_2',
        image_id: 'product_bitdefender_2',
        title: 'GravityZone 雲端主控台',
        description: '具備多達36個圖表輪播功能，完整協助管理者快速了解系統防護狀態。',
      },
      {
        id: 'feature_3',
        image_id: 'product_bitdefender_3',
        title: '為什麼選擇 Bitdefender',
        description: '全球領先的資安防護品牌，提供多層次防禦架構與即時威脅偵測能力。',
      },
    ],
    gallery: {
      title: '國際認證與獎項',
      images: [
        { id: 'partner_1', image_id: 'partner_bitdefender_1' },
        { id: 'partner_2', image_id: 'partner_bitdefender_2' },
        { id: 'partner_3', image_id: 'partner_bitdefender_3' },
        { id: 'partner_4', image_id: 'partner_bitdefender_4' },
        { id: 'partner_5', image_id: 'partner_bitdefender_5' },
      ],
    },
    cta: {
      title: '立即體驗 Bitdefender 企業端點防護',
      description: '讓專業顧問協助您評估端點安全需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== Palo Alto ==========
  palo_alto: {
    hero: { image_id: 'hero_paloalto' },
    intro: {
      label: '次世代防火牆',
      title: 'Palo Alto Networks',
      description: '全球領先的次世代防火牆，整合入侵防禦、應用識別、沙箱與雲端情資，打造企業端對端的進階防護與整體資安架構。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'paloalto_1',
        title: '次世代防火牆技術',
        description: 'Palo Alto Networks 採用先進的 App-ID、User-ID、Content-ID 技術，提供精細的應用程式控制與使用者識別。',
      },
      {
        id: 'feature_2',
        image_id: 'paloalto_2',
        title: '威脅情報與自動化防護',
        description: '整合 WildFire 雲端沙箱與 AutoFocus 威脅情報，即時偵測與阻擋未知威脅。',
      },
      {
        id: 'feature_3',
        image_id: 'paloalto_3',
        title: '統一安全平台',
        description: '透過 Strata 統一安全平台，整合網路、雲端與端點防護，簡化資安管理。',
      },
    ],
    cta: {
      title: '立即了解 Palo Alto Networks 解決方案',
      description: '讓專業顧問協助您評估企業防火牆需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== Fortinet ==========
  fortinet: {
    hero: { image_id: 'hero_fortinet' },
    intro: {
      label: '整合式資安平台',
      title: 'Fortinet Security Fabric',
      description: '整合式資安平台，提供防火牆、VPN、入侵防禦、網頁過濾與終端監控，兼具高效能與易部署。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'fortinet_1',
        title: 'FortiGate 次世代防火牆',
        description: '業界領先的次世代防火牆，整合網路安全、SD-WAN、無線控制等功能。',
      },
      {
        id: 'feature_2',
        image_id: 'fortinet_2',
        title: 'Security Fabric 整合架構',
        description: '透過 Security Fabric 整合所有 Fortinet 產品，實現統一可視化與自動化防護。',
      },
      {
        id: 'feature_3',
        image_id: 'fortinet_3',
        title: 'FortiGuard 威脅情報',
        description: 'FortiGuard Labs 提供即時威脅情報更新，確保企業始終獲得最新防護。',
      },
    ],
    cta: {
      title: '立即了解 Fortinet 解決方案',
      description: '讓專業顧問協助您評估企業資安需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== SecurityScorecard ==========
  security_scorecard: {
    hero: { image_id: 'hero_securityscorecard' },
    intro: {
      label: '資安評級服務',
      title: 'SecurityScorecard',
      description: 'SecurityScorecard 以非侵入方式持續監控企業資安狀態，覆蓋十大風險類別，提供清晰的資安評級。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'securityscorecard_1',
        title: '十大風險類別評估',
        description: '涵蓋網路安全、DNS 健康、端點安全、IP 聲譽等十大風險類別的全面評估。',
      },
      {
        id: 'feature_2',
        image_id: 'securityscorecard_2',
        title: '供應鏈風險管理',
        description: '即時監控供應商與合作夥伴的資安狀態，降低第三方風險。',
      },
      {
        id: 'feature_3',
        image_id: 'securityscorecard_3',
        title: '合規報告與儀表板',
        description: '自動產生合規報告，透過儀表板即時掌握企業整體資安狀態。',
      },
    ],
    cta: {
      title: '立即了解 SecurityScorecard 資安評級',
      description: '讓專業顧問協助您評估企業資安成熟度',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== Tenable Nessus ==========
  tenable_nessus: {
    hero: { image_id: 'hero_tenable' },
    intro: {
      label: '弱點掃描工具',
      title: 'Tenable Nessus',
      description: '業界領先的弱點掃描工具，能偵測逾 75,000 種漏洞，支援合規檢查與修補建議。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'tenable_1',
        title: '全面弱點偵測',
        description: '涵蓋超過 75,000 種 CVE 漏洞偵測，提供業界最完整的弱點資料庫。',
      },
      {
        id: 'feature_2',
        image_id: 'tenable_2',
        title: '合規檢查',
        description: '內建 PCI DSS、HIPAA、CIS 等多項合規檢查範本，協助企業符合法規要求。',
      },
      {
        id: 'feature_3',
        image_id: 'tenable_3',
        title: '修補優先順序建議',
        description: '根據風險評分提供修補優先順序建議，有效分配資安資源。',
      },
    ],
    cta: {
      title: '立即了解 Tenable Nessus',
      description: '讓專業顧問協助您評估弱點掃描需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== Deep Instinct ==========
  deep_instinct: {
    hero: { image_id: 'hero_deepinstinct' },
    intro: {
      label: '深度學習端點防護',
      title: 'Deep Instinct',
      description: '採用深度學習技術的端點防護平台，能在惡意程式執行前預測偵測並防禦。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'deepinstinct_1',
        title: '深度學習預測防禦',
        description: '運用深度學習 AI，在威脅執行前進行預測與防禦，有效阻擋零日攻擊。',
      },
      {
        id: 'feature_2',
        image_id: 'deepinstinct_2',
        title: '極低誤判率',
        description: '深度學習模型具備極低誤判率，減少資安團隊處理誤報的負擔。',
      },
      {
        id: 'feature_3',
        image_id: 'deepinstinct_3',
        title: '跨平台防護',
        description: '支援 Windows、macOS、Linux、iOS、Android 等多平台防護。',
      },
    ],
    cta: {
      title: '立即了解 Deep Instinct',
      description: '讓專業顧問協助您評估端點防護需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== SonarQube ==========
  sonarqube: {
    hero: { image_id: 'hero_sonarqube' },
    intro: {
      label: '原始碼分析',
      title: 'SonarQube',
      description: '原始碼靜態分析平台，支援多種語言，自動檢查程式碼安全性、品質與可維護性。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'sonarqube_1',
        title: '多語言支援',
        description: '支援 Java、C#、JavaScript、Python、Go 等 30 多種程式語言的靜態分析。',
      },
      {
        id: 'feature_2',
        image_id: 'sonarqube_2',
        title: '安全弱點偵測',
        description: '偵測 OWASP Top 10、CWE 等安全弱點，在開發階段即發現潛在風險。',
      },
      {
        id: 'feature_3',
        image_id: 'sonarqube_3',
        title: 'CI/CD 整合',
        description: '無縫整合 Jenkins、GitLab CI、Azure DevOps 等 CI/CD 工具。',
      },
    ],
    cta: {
      title: '立即了解 SonarQube',
      description: '讓專業顧問協助您評估程式碼品質需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== IST ==========
  ist: {
    hero: { image_id: 'hero_ist' },
    intro: {
      label: '端點安全管理',
      title: 'IST 端點安全系統',
      description: '提供精確的內部行為管理與監控，防範資訊外洩與未授權存取。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'ist_1',
        title: '內部行為監控',
        description: '即時監控員工電腦使用行為，防範內部威脅與資料外洩。',
      },
      {
        id: 'feature_2',
        image_id: 'ist_2',
        title: '存取控制',
        description: '精細的存取控制策略，確保只有授權人員能存取敏感資料。',
      },
      {
        id: 'feature_3',
        image_id: 'ist_3',
        title: '稽核報表',
        description: '完整的稽核紀錄與報表，滿足合規與審計需求。',
      },
    ],
    cta: {
      title: '立即了解 IST 端點安全',
      description: '讓專業顧問協助您評估內部安全需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== Array ==========
  array: {
    hero: { image_id: 'hero_array' },
    intro: {
      label: 'SSL VPN 解決方案',
      title: 'Array Networks',
      description: '高效能 SSL VPN、應用交付與流量管理方案，支援身分驗證、單一登入與加密傳輸。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'array_1',
        title: 'SSL VPN 遠端存取',
        description: '安全的遠端存取解決方案，支援任何裝置的安全連線。',
      },
      {
        id: 'feature_2',
        image_id: 'array_2',
        title: '應用交付控制器',
        description: '高效能應用交付控制器，提供負載平衡與應用加速功能。',
      },
      {
        id: 'feature_3',
        image_id: 'array_3',
        title: '單一登入整合',
        description: '整合企業應用的單一登入功能，提升使用者體驗與安全性。',
      },
    ],
    cta: {
      title: '立即了解 Array Networks',
      description: '讓專業顧問協助您評估遠端存取需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== Vicarius vRX ==========
  vicarius_vrx: {
    hero: { image_id: 'hero_vicarius' },
    intro: {
      label: '漏洞管理平台',
      title: 'Vicarius vRX',
      description: '零代理式漏洞管理平台，支援自動偵測、弱點排序、虛擬修補與威脅可視化。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'vicarius_1',
        title: '零代理式部署',
        description: '無需安裝代理程式，快速部署漏洞掃描與管理功能。',
      },
      {
        id: 'feature_2',
        image_id: 'vicarius_2',
        title: '虛擬修補',
        description: '在正式修補前提供虛擬修補功能，即時降低漏洞風險。',
      },
      {
        id: 'feature_3',
        image_id: 'vicarius_3',
        title: '風險優先排序',
        description: '根據實際威脅情境進行風險排序，優先處理高風險漏洞。',
      },
    ],
    cta: {
      title: '立即了解 Vicarius vRX',
      description: '讓專業顧問協助您評估漏洞管理需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== Ubuntu ==========
  ubuntu: {
    hero: { image_id: 'hero_ubuntu' },
    intro: {
      label: '開源作業系統',
      title: 'Ubuntu',
      description: '開源系統，擁有強大社群支持和高度安全性，具備靈活性和穩定性。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'ubuntu_1',
        title: 'Ubuntu Server',
        description: '企業級 Linux 伺服器作業系統，提供長期支援與安全更新。',
      },
      {
        id: 'feature_2',
        image_id: 'ubuntu_2',
        title: '容器與雲端支援',
        description: '原生支援 Docker、Kubernetes，並與主流雲端平台無縫整合。',
      },
      {
        id: 'feature_3',
        image_id: 'ubuntu_3',
        title: 'Canonical 企業支援',
        description: '透過 Canonical 提供企業級技術支援與維護服務。',
      },
    ],
    cta: {
      title: '立即了解 Ubuntu 企業解決方案',
      description: '讓專業顧問協助您評估 Linux 平台需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== VMware ==========
  vmware: {
    hero: { image_id: 'hero_vmware' },
    intro: {
      label: '虛擬化平台',
      title: 'VMware',
      description: '提供強大虛擬化技術，高效利用硬體資源，具備高可用性和容錯機制。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'vmware_1',
        title: 'vSphere 虛擬化平台',
        description: '業界領先的企業虛擬化平台，提供高效能與高可用性。',
      },
      {
        id: 'feature_2',
        image_id: 'vmware_2',
        title: 'vCenter 集中管理',
        description: '透過 vCenter Server 集中管理所有虛擬化基礎架構。',
      },
      {
        id: 'feature_3',
        image_id: 'vmware_3',
        title: 'vSAN 軟體定義儲存',
        description: 'vSAN 提供軟體定義儲存，簡化儲存管理並降低成本。',
      },
    ],
    cta: {
      title: '立即了解 VMware 虛擬化解決方案',
      description: '讓專業顧問協助您評估虛擬化需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== Proxmox VE ==========
  proxmox_ve: {
    hero: { image_id: 'hero_proxmox' },
    intro: {
      label: '開源虛擬化',
      title: 'Proxmox VE',
      description: '高性價比的開源虛擬化解決方案，支持 KVM 和 LXC 技術。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'proxmox_1',
        title: 'KVM 與 LXC 支援',
        description: '同時支援 KVM 完整虛擬化與 LXC 容器虛擬化技術。',
      },
      {
        id: 'feature_2',
        image_id: 'proxmox_2',
        title: 'Web 管理介面',
        description: '直覺的 Web 管理介面，簡化虛擬機與容器的管理。',
      },
      {
        id: 'feature_3',
        image_id: 'proxmox_3',
        title: '高可用叢集',
        description: '內建高可用叢集功能，確保服務持續運作。',
      },
    ],
    cta: {
      title: '立即了解 Proxmox VE',
      description: '讓專業顧問協助您評估開源虛擬化需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== AI Agent ==========
  ai_agent: {
    hero: { image_id: 'hero_aiagent' },
    intro: {
      label: 'AI 智慧應用',
      title: 'AI Agent',
      description: '企業級 AI 智慧代理解決方案，協助企業導入人工智慧應用。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'aiagent_1',
        title: '智慧客服機器人',
        description: '基於 AI 的智慧客服解決方案，提升客戶服務效率。',
      },
      {
        id: 'feature_2',
        image_id: 'aiagent_2',
        title: '文件智能處理',
        description: 'AI 驅動的文件辨識與處理，加速業務流程自動化。',
      },
      {
        id: 'feature_3',
        image_id: 'aiagent_3',
        title: '企業知識庫',
        description: '建構企業專屬 AI 知識庫，提升員工工作效率。',
      },
    ],
    cta: {
      title: '立即了解 AI Agent 解決方案',
      description: '讓專業顧問協助您評估 AI 應用需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== AI Forecasting ==========
  ai_forecasting: {
    hero: { image_id: 'hero_aiforecasting' },
    intro: {
      label: 'AI 預測分析',
      title: 'AI Forecasting',
      description: '運用 AI 進行需求預測與資源規劃，提升企業決策效率。',
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'aiforecasting_1',
        title: '需求預測',
        description: 'AI 驅動的需求預測，協助企業精準掌握市場趨勢。',
      },
      {
        id: 'feature_2',
        image_id: 'aiforecasting_2',
        title: '庫存優化',
        description: '智慧庫存管理，降低庫存成本並避免缺貨風險。',
      },
      {
        id: 'feature_3',
        image_id: 'aiforecasting_3',
        title: '生產排程',
        description: 'AI 輔助生產排程，提升產線效率與資源利用率。',
      },
    ],
    cta: {
      title: '立即了解 AI Forecasting',
      description: '讓專業顧問協助您評估 AI 預測需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== Data Middleware (數據中台) ==========
  data_middleware: {
    hero: { image_id: 'data_middleware_banner' },
    intro: {
      label: '數據中台',
      title: '什麼是數據中台？',
      description: `數據中台是企業數位轉型的核心引擎，透過統一整合企業內外部的各類數據資源，打破資料孤島，消除資訊斷層，
為企業提供即時、可靠且高價值的數據基礎。數據中台不僅彙聚了業務、行銷、運營、財務等多元數據，
更能靈活支援各部門數據應用，加速決策效率，推動業務創新。`,
    },
    features: [
      {
        id: 'benefit_1',
        image_id: 'data_middleware_1',
        title: '數據整合與治理',
        description: '自動連結各類數據源，高效清洗、標準化及管理數據，讓資料更純淨、更可靠。',
      },
      {
        id: 'benefit_2',
        image_id: 'data_middleware_2',
        title: '即時洞察分析',
        description: '結合先進分析引擎，快速生成可視化報表，幫助管理層及時掌握市場動態。',
      },
      {
        id: 'benefit_3',
        image_id: 'data_middleware_3',
        title: '彈性服務調用',
        description: '資料服務即插即用，各部門可依需求靈活獲取所需數據，提升作業效率。',
      },
      {
        id: 'benefit_4',
        image_id: 'data_middleware_4',
        title: '數據賦能業務',
        description: '促進行銷精準投放、客戶關係管理、供應鏈優化等應用，全面提升競爭力。',
      },
      {
        id: 'benefit_5',
        image_id: 'data_middleware_5',
        title: '安全合規無憂',
        description: '嚴格遵循國際數據安全規範，確保資料安全與合規，讓企業無後顧之憂。',
      },
    ],
    cta: {
      title: '立即行動，搶佔智慧製造先機！',
      description: '現在就是數據驅動企業成長的最佳時機！',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },

  // ========== Jennifer APM ==========
  jennifer_apm: {
    hero: { image_id: 'hero_jennifer' },
    intro: {
      label: '應用效能監控',
      title: '強大的實時應用性能管理器',
      description: `Jennifer APM 提供即時的應用程式效能監控與分析，協助 IT 團隊快速定位問題根因，
確保系統穩定運行並提升使用者體驗。`,
    },
    features: [
      {
        id: 'feature_1',
        image_id: 'feature_jennifer_bd_2',
        title: '即時事件警報',
        description: `JENNIFER 會擷取異常應用程式交易事件，例如回應時間錯誤的交易、交易錯誤/異常和錯誤的 SQL 語句等，
並即時發出警報。`,
      },
      {
        id: 'feature_2',
        image_id: 'feature_jennifer_bd_3',
        title: '即時故障控制',
        description: 'JENNIFER 的即時故障控制功能保證了網路系統在突發災難情況下的穩定運作。',
      },
    ],
    gallery: {
      title: '支援的平台',
      images: [
        { id: 'platform_1', image_id: 'partner_jennifer_1' },
        { id: 'platform_2', image_id: 'partner_jennifer_2' },
        { id: 'platform_3', image_id: 'partner_jennifer_3' },
        { id: 'platform_4', image_id: 'partner_jennifer_4' },
      ],
    },
    cta: {
      title: '立即體驗 Jennifer APM 應用效能監控',
      description: '讓專業顧問協助您評估應用程式效能監控需求',
      button_text: '聯繫我們',
      button_link: '/contact/',
    },
  },
};

// 取得產品內容的輔助函數
export function getProductContent(slug: string): ProductContent | null {
  return PRODUCT_CONTENT[slug] || null;
}
