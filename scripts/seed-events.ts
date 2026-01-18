/**
 * seed-events.ts
 *
 * 將現有活動資料從 YAML/MD 匯入到 Neon DB
 *
 * 執行方式：
 * cd astro-app && npx tsx ../scripts/seed-events.ts
 */
// 載入環境變數（如果在 astro-app 目錄下執行，會自動讀取 .env）
import { config } from 'dotenv';
import { resolve } from 'path';

// 嘗試從 astro-app/.env 載入
config({ path: resolve(process.cwd(), '.env') });
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { events, type NewEvent } from '../astro-app/lib/db/schema';
import type { EventCategory, EventStatus, AioData } from '@ewill/shared';

// 確認環境變數
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('錯誤: 缺少 DATABASE_URL 環境變數');
  process.exit(1);
}

// 初始化 DB
const sql = neon(databaseUrl);
const db = drizzle(sql);

// ============================================================================
// 活動資料（從 YAML/MD 整理）
// ============================================================================

const EVENTS_DATA: Omit<NewEvent, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    event_id: 'event_20251021',
    title: '鎰威科技 × Dell Technologies 活動回顧',
    summary: '鎰威科技與 Dell Technologies 聯合舉辦活動回顧。分享企業 IT 基礎架構、虛擬化與資料保護最新趨勢，協助企業建構現代化資料中心與混合雲環境。',
    category: 'seminar' as EventCategory,
    status: 'published' as EventStatus,
    event_date: new Date('2025-10-21T09:00:00+08:00'),
    end_date: new Date('2025-10-21T17:00:00+08:00'),
    cover_image_id: 'event_info_photo_1',
    hero_image_id: 'event_info_photo_1',
    page_slug: 'event_20251021',
    content: `### 鎰威科技 × Dell Technologies 成功舉辦

鎰威科技與 Dell Technologies 聯合舉辦活動，分享企業 IT 基礎架構、虛擬化與資料保護最新趨勢，協助企業建構現代化資料中心與混合雲環境。

本次活動聚焦以下主題：

- **企業 IT 基礎架構現代化**：如何透過 Dell 解決方案優化資料中心效能
- **虛擬化與容器技術**：探討 VMware、Proxmox VE 等虛擬化平台的最佳實踐
- **資料保護策略**：建立完整的備份與災難復原機制
- **混合雲部署**：整合地端與雲端資源的策略

感謝所有與會者的參與，讓這次活動圓滿成功！`,
    gallery: ['event_info_photo_1'],
    seo: {
      title: '鎰威科技 × Dell Technologies 活動回顧 | 2025/10/21 - 鎰威科技',
      description: '鎰威科技與 Dell Technologies 聯合舉辦活動回顧。分享企業 IT 基礎架構、虛擬化與資料保護最新趨勢，協助企業建構現代化資料中心與混合雲環境。',
      keywords: ['Dell Technologies', '鎰威科技活動', 'IT 基礎架構', '資料中心', '虛擬化', '企業活動'],
    },
    aio: {
      webpage: {
        type: 'EventPage',
        name: '鎰威科技 × Dell Technologies 活動回顧',
        description: '鎰威科技與 Dell Technologies 聯合舉辦活動回顧。',
      },
    } as AioData,
  },
  {
    event_id: 'event_20251118',
    title: '智慧製造入門研討會 | MES、WMS、AI 應用全解析',
    summary: '鎰威科技 2025 智慧製造線上研討會，深入解析智慧製造入門關鍵解決方案。專家探討 MES 製造執行系統、WMS 倉儲管理、AI 應用導入策略，助企業掌握數位轉型先機。',
    category: 'webinar' as EventCategory,
    status: 'published' as EventStatus,
    event_date: new Date('2025-11-18T14:00:00+08:00'),
    end_date: new Date('2025-11-18T16:00:00+08:00'),
    cover_image_id: 'event_info_smartmfg',
    hero_image_id: 'event_info_smartmfg',
    page_slug: 'event_20251118',
    content: `### 智慧製造線上研討會首部曲登場！揭開智慧製造入門關鍵解決方案全解析

在數位科技快速發展、全球供應鏈競爭激烈的時代，智慧製造已成為企業轉型升級的重要關鍵。為協助企業掌握產業最新趨勢、加速智慧工廠落地應用，鎰威科技特別舉辦「智慧製造線上研討會首部曲」，深入剖析企業從傳統製造邁向智慧製造所需導入的第一步與核心解決方案。

本次研討會將聚焦智慧工廠必備的四大關鍵技術導入方向，協助製造業迎接數位浪潮、提升競爭優勢：

#### 研討會主題亮點

**✔ MES系統 / IoT整合應用**

MES 是製造業邁向智慧工廠不可或缺的基石，可協助企業提升生產效率、降低製造成本、縮短製程時間、提升良率，迎戰數位化時代的挑戰與轉型契機。

**✔ OT資訊安全解決方案**

智慧工廠需要快速連網與大量設備整合，資安風險同時升高。研討會將介紹如何建立工廠 OT 防線，保障企業營運穩定，防止資料外洩與人為操作風險，打造安全可靠的智慧產線。

**✔ 智能倉儲管理（WMS）**

結合智慧料架、AGV / 無人搬運車與物流整合，達成倉儲自動化、庫存精準管理與物流效率提升，讓生產鏈條銜接無縫、降低人力成本、提升供應鏈反應速度。

**✔ RMA AI平台**

透過 AI 與智慧演算法，大幅縮短客戶退回產品故障處理與維修鑑定時間，不僅提升售後服務效率，也強化產品品質與客戶滿意度，打造更優質的客戶體驗。

---

本次研討會將以實務案例與成功導入經驗為核心，協助企業了解：

- ✔ 如何從零開始導入智慧製造
- ✔ 企業導入前最常遇到的問題與誤區
- ✔ 如何制定成本可控、效益最大化的導入策略
- ✔ 智慧工廠從生產、倉儲到售後的完整鏈結

鎰威科技表示，智慧製造並非一次到位，而是依照企業規模、產線特性與資訊化成熟度，階段性導入更有效。本研討會將提供企業「可馬上著手」的導入方向，協助製造業提前布局未來市場。`,
    gallery: null,
    seo: {
      title: '智慧製造入門研討會 | MES、WMS、AI 應用全解析 - 鎰威科技',
      description: '鎰威科技 2025 智慧製造線上研討會，深入解析智慧製造入門關鍵解決方案。專家探討 MES 製造執行系統、WMS 倉儲管理、AI 應用導入策略，助企業掌握數位轉型先機，提升生產力與競爭力。',
      keywords: ['智慧製造研討會', '線上研討會', 'Webinar', '智慧製造', '數位轉型', '工業 4.0', 'MES 導入', 'WMS 導入'],
    },
    aio: {
      webpage: {
        type: 'EventPage',
        name: '智慧製造入門研討會',
        description: '鎰威科技智慧製造線上研討會活動頁面。',
      },
      event: {
        type: 'Event',
        name: '智慧製造入門關鍵解決方案全解析 線上研討會',
        description: '深入解析智慧製造導入策略，涵蓋 MES、WMS、AI 應用等關鍵議題。',
        startDate: '2025-11-18T14:00:00+08:00',
        endDate: '2025-11-18T16:00:00+08:00',
        attendanceMode: 'OnlineEventAttendanceMode',
        location: {
          name: '線上活動',
          address: 'https://www.ewill.com.tw/events/event_20251118/',
        },
      },
    } as AioData,
  },
  {
    event_id: 'event_20251119',
    title: 'LOGSEC 資安預警解決方案發布',
    summary: '鎰威科技正式推出 LOGSEC 資安預警解決方案，主打高效搜尋、跨系統整合與事件視覺化。整合防火牆、端點防護、AD 等多來源日誌，秒級搜尋體驗，協助企業加速事件調查、縮短 MTTR。',
    category: 'press_release' as EventCategory,
    status: 'published' as EventStatus,
    event_date: new Date('2025-11-19T10:00:00+08:00'),
    end_date: null,
    cover_image_id: 'event_info_news_m',
    hero_image_id: 'event_info_news_m',
    page_slug: 'event_20251119',
    content: `### 鎰威科技推出 LOGSEC 資安預警解決方案！以更快、更彈性、更透明的方式強化企業資安可視化能力

隨著企業面臨資安威脅多樣化、法規要求日益嚴格，如何有效整合日誌、提升事件調查效率並建立安全可視化，已成為 IT 團隊的重要課題。鎰威科技近日正式推出 LOGSEC 資安預警解決方案，主打高效搜尋、跨系統整合、事件視覺化與稽核追蹤能力，協助企業加速日誌治理、縮短事件回應與分析時間。

LOGSEC 是專為企業級環境設計的資安預警分析平台，可整合防火牆、端點防護、AD、系統日誌、網路設備與雲端服務等多來源資料，讓 IT 與資安團隊能在單一儀表板掌握企業整體安全狀態。平台內建多維度查詢與過濾機制，支援秒級回應的搜尋體驗，有效降低事件調查所需的人力與時間成本。

鎰威科技表示，企業在事件調查時常面臨資料來源分散、搜尋效率不足與紀錄難以追溯的問題。LOGSEC 透過整合式事件視圖與自訂查詢語法，可將各系統的日誌集中分析，快速連結攻擊軌跡、存取行為與異常事件，協助資安人員找出問題根因，縮短整體 MTTR（平均回應時間）。

在資料呈現方面，我們深知如何將冷冰冰的數據化繁為簡呈現關鍵指標讓管理人員直覺化的判斷有無問題，縮短人員判斷問題的時間。LOGSEC 提供多樣的可視化儀表板，包括攻擊來源、登入異常、機敏存取紀錄、設備狀態與網路流量趨勢等，使管理者能以圖形化方式快速解讀資安風險。

為因應合規與稽核需求，LOGSEC 內建查閱紀錄、權限管理與報表匯出功能，可對應政府單位與金融產業常見的審查項目。

LOGSEC 的部署模式具高度彈性，支援私有雲與混合雲環境，亦可與既有 SIEM 併行運作。

更多資訊可參考新聞稿全文：https://www.ithome.com.tw/pr/172427`,
    gallery: null,
    seo: {
      title: 'LOGSEC 資安預警解決方案發布 | 企業日誌管理新選擇 - 鎰威科技',
      description: '鎰威科技正式推出 LOGSEC 資安預警解決方案，主打高效搜尋、跨系統整合與事件視覺化。整合防火牆、端點防護、AD 等多來源日誌，秒級搜尋體驗，協助企業加速事件調查、縮短 MTTR，強化資安可視化能力。',
      keywords: ['LOGSEC', '資安預警', '日誌管理', 'SIEM', '事件調查', '資安可視化'],
    },
    aio: {
      webpage: {
        type: 'EventPage',
        name: 'LOGSEC 資安預警解決方案發布',
        description: '鎰威科技正式推出 LOGSEC 資安預警解決方案。',
      },
    } as AioData,
  },
  {
    event_id: 'event_20251124',
    title: '免密碼登入與零信任身份防護方案 | 動信 x 鎰威科技',
    summary: '動信攜手鎰威科技，推出企業免密碼、零信任身份防護解決方案。導入 FIDO2 無密碼認證、多因子驗證 MFA，強化企業身份安全，降低帳密外洩風險，提升使用者體驗。',
    category: 'press_release' as EventCategory,
    status: 'published' as EventStatus,
    event_date: new Date('2025-09-18T10:00:00+08:00'),
    end_date: null,
    cover_image_id: 'event_info_passwordless',
    hero_image_id: 'event_info_passwordless',
    page_slug: 'event_20251124',
    content: `### 動信攜手鎰威科技　快速導入企業免密碼、零信任身份防護

2025 年 9 月 18日，台北 — 美商動信安全 (GoTrust) 台灣分公司今日宣布與鎰威科技有限公司 (Ewill Technology) 正式成為經銷合作夥伴。鎰威將憑藉其資安與系統整合專業，推廣 GoTrust 免密碼零信任身分驗證方案，協助企業與公部門在數位轉型中兼顧使用者體驗與最高級別使用者登入防護。

GoTrust 免密碼零信任系統從伺服器到客戶端軟體，全部通過 FIDO 與台灣資安院認證，並擁有台灣及美國兩項發明專利，支援各式認證通訊協定，能與雲端、地端各式應用無縫接軌，可快速保護企業員工登入電腦、服務器、VPN、遠端桌面、VMware、Microsoft 365 等各式混合雲環境。其專利的手機生物辨識登入電腦，更是本產品一大亮點之一，徹底讓企業員工擺脫又長又難記、且要定時換密碼的困擾，也大幅降低被釣魚的風險。

鎰威科技總經理吳聲振表示：「傳統密碼已是最脆弱的一環。透過 GoTrust 免密碼與零信任架構，我們可提供客戶更安全、直覺且符合國際標準的方案。」

動信 (GoTrust) CEO 李殿基補充：「GoTrust 是國際免密碼產品的先驅，專注產品開發，我們非常期待與鎰威這樣有豐富市場經驗、並有強大技術後盾的夥伴攜手，落實零信任於台灣各行業的身份防護。」

GoTrust 免密碼解決方案已與美國資安大廠 Ivanti 合作多年，至今已超過 40 萬名歐美大型企業員工使用。本次攜手鎰威，將加速台灣企業導入國際級身分驗證防護，兼顧安全、效率與使用者體驗，為企業在保護數位資產發揮更大價值。

---

#### 關於鎰威科技 (Ewill Technology)

鎰威科技專注資訊安全與系統整合，服務範疇涵蓋端點安全、網路防護、虛擬化環境與開源系統應用。秉持「專業、效率、熱情、誠信」理念，致力提供全方位資安解決方案。更多資訊請見 www.ewill.com.tw`,
    gallery: null,
    seo: {
      title: '免密碼登入與零信任身份防護方案 | 動信 x 鎰威科技',
      description: '動信攜手鎰威科技，推出企業免密碼、零信任身份防護解決方案。導入 FIDO2 無密碼認證、多因子驗證 MFA，強化企業身份安全，降低帳密外洩風險，提升使用者體驗。',
      keywords: ['免密碼登入', 'Passwordless', '零信任', 'Zero Trust', '身份驗證', 'FIDO2', 'MFA 多因子驗證'],
    },
    aio: {
      webpage: {
        type: 'EventPage',
        name: '免密碼與零信任身份防護方案',
        description: '動信與鎰威科技合作推出的企業身份安全解決方案。',
      },
      faq: [
        {
          question: '什麼是免密碼認證？',
          answer: '免密碼認證是使用生物辨識、安全金鑰或手機 App 等方式取代傳統密碼的認證技術。基於 FIDO2/WebAuthn 標準，可大幅降低密碼遭竊或網路釣魚的風險。',
        },
        {
          question: '為什麼企業需要零信任身份防護？',
          answer: '傳統的網路邊界安全已不足以應對現代威脅。零信任架構的核心理念是「永不信任，持續驗證」，無論使用者在內網或外網，都需要持續驗證身份，確保只有合法使用者能存取資源。',
        },
        {
          question: '導入免密碼方案需要更換硬體嗎？',
          answer: '不一定。動信解決方案支援多種認證方式，包括手機 App、Windows Hello、安全金鑰等。員工可使用現有的智慧型手機或筆電進行無密碼認證，無需額外採購硬體。',
        },
      ],
    } as AioData,
  },
];

// ============================================================================
// 主程式
// ============================================================================

async function seedEvents() {
  console.log('🌱 開始匯入活動資料...\n');

  try {
    // 先清除現有資料（可選）
    console.log('📋 清除現有活動資料...');
    await db.delete(events);
    console.log('✅ 已清除現有資料\n');

    // 插入新資料
    console.log('📥 插入活動資料...');
    for (const eventData of EVENTS_DATA) {
      await db.insert(events).values(eventData);
      console.log(`  ✅ ${eventData.event_id}: ${eventData.title}`);
    }

    console.log(`\n🎉 成功匯入 ${EVENTS_DATA.length} 筆活動資料！`);
  } catch (error) {
    console.error('❌ 匯入失敗:', error);
    process.exit(1);
  }
}

// 執行
seedEvents();
