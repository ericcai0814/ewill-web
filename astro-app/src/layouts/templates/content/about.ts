/**
 * 關於頁硬編碼內容
 * Template 自主決定所有顯示內容
 */

export const ABOUT_CONTENT = {
  intro: {
    label: 'About Us',
    title: '公司簡介',
    description: `鎰威科技專注於推動企業數位轉型，結合資訊安全、AI 科技與大數據應用，從架構規劃到服務導入，提供專業高效的一站式安全服務。我們秉持「專業、效率、信任、創新」的精神與持續提供優質服務的態度，攜手客戶共同邁向成長與成功。`,
  },

  core_values: [
    {
      name: '專業 (Professional)',
      description: '持續精進技術能力，提供最專業的服務品質',
    },
    {
      name: '效率 (Efficiency)',
      description: '優化服務流程，快速回應客戶需求',
    },
    {
      name: '信任 (Trust)',
      description: '建立長期合作關係，成為客戶信賴的夥伴',
    },
    {
      name: '創新 (Innovation)',
      description: '導入最新技術，協助客戶保持競爭優勢',
    },
  ],

  certifications: [
    {
      name: 'ISO 27001:2013 資訊安全管理系統認證',
      issuer: '國際認證機構',
      scope: '資訊安全服務',
    },
    {
      name: 'TTQS 人才發展品質管理系統',
      issuer: '勞動部勞動力發展署',
      level: '銀牌',
    },
    {
      name: '資訊安全服務機構能量登錄',
      issuer: '數位發展部',
      scope: '資安服務',
    },
    {
      name: '自動化服務能量登錄',
      issuer: '經濟部',
      scope: '智慧製造',
    },
  ],

  service_areas: [
    '資訊安全評估與顧問',
    '智慧製造系統整合',
    '數位轉型規劃導入',
  ],

  // 圖片 ID
  images: {
    hero: 'banner1209',
    hero_mobile: 'bn_about_m',
    certifications: 'certifications_grid',
    team: 'team_photo',
  },
};
