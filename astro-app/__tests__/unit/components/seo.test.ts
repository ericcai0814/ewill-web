/**
 * SEO 元件邏輯測試
 *
 * 測試 JSON-LD 結構化資料轉換邏輯
 */
import { describe, it, expect } from 'vitest';

// 從 SEO.astro 提取的型別和邏輯（測試用）
interface JsonLdItem {
  type:
    | 'Organization'
    | 'WebSite'
    | 'WebPage'
    | 'Article'
    | 'Product'
    | 'FAQPage'
    | 'BreadcrumbList'
    | 'Service'
    | 'Event';
  data: Record<string, unknown>;
}

const siteName = '鎰威科技';
const canonicalURL = 'https://www.ewill.com.tw/test/';

function convertToJsonLd(item: JsonLdItem): object {
  const { type, data } = item;

  switch (type) {
    case 'Organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name,
        alternateName: data.alternateName,
        url: data.url,
        logo: data.logo,
        description: data.description,
        foundingDate: data.foundingDate,
        address: data.address
          ? {
              '@type': 'PostalAddress',
              addressLocality: (data.address as Record<string, unknown>).addressLocality,
              addressRegion: (data.address as Record<string, unknown>).addressRegion,
              addressCountry: (data.address as Record<string, unknown>).addressCountry,
            }
          : undefined,
        contactPoint: data.contactPoint
          ? {
              '@type': 'ContactPoint',
              contactType: (data.contactPoint as Record<string, unknown>).contactType,
              availableLanguage: (data.contactPoint as Record<string, unknown>).availableLanguage,
            }
          : undefined,
        sameAs: data.sameAs,
      };

    case 'WebSite':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: data.name,
        url: data.url,
        potentialAction: data.potentialAction
          ? {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: (data.potentialAction as Record<string, unknown>).target,
              },
              'query-input': (data.potentialAction as Record<string, unknown>).query_input,
            }
          : undefined,
      };

    case 'WebPage':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: data.name,
        description: data.description,
        primaryImageOfPage: data.primaryImageOfPage,
        url: canonicalURL,
      };

    case 'Article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.headline || 'Test Title',
        description: data.description || 'Test Description',
        image: data.image || 'https://example.com/image.jpg',
        author: data.author
          ? {
              '@type': 'Organization',
              name: (data.author as Record<string, unknown>).name || siteName,
            }
          : { '@type': 'Organization', name: siteName },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.ewill.com.tw/assets/logo.png',
          },
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified,
      };

    case 'Product':
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name || 'Test Product',
        description: data.description || 'Test Description',
        image: data.image || 'https://example.com/image.jpg',
        brand: {
          '@type': 'Brand',
          name: data.brand || siteName,
        },
        offers: data.offers,
      };

    case 'FAQPage':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (data.items as Array<{ question: string; answer: string }>)?.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };

    case 'BreadcrumbList':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: (
          data.items as Array<{ name: string; url: string; position: number }>
        )?.map((item) => ({
          '@type': 'ListItem',
          position: item.position,
          name: item.name,
          item: item.url,
        })),
      };

    case 'Service':
      return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: data.serviceType,
        name: data.name,
        description: data.description,
        provider: {
          '@type': 'Organization',
          name: siteName,
        },
        areaServed: {
          '@type': 'Country',
          name: 'Taiwan',
        },
        offers: data.offers
          ? (data.offers as Array<{ name: string; description: string }>)?.map((offer) => ({
              '@type': 'Offer',
              name: offer.name,
              description: offer.description,
            }))
          : undefined,
      };

    case 'Event':
      return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location
          ? {
              '@type': 'Place',
              name: (data.location as Record<string, unknown>).name,
              address: (data.location as Record<string, unknown>).address,
            }
          : undefined,
        organizer: {
          '@type': 'Organization',
          name: siteName,
        },
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode:
          data.attendanceMode || 'https://schema.org/OfflineEventAttendanceMode',
      };

    default:
      return {
        '@context': 'https://schema.org',
        ...data,
      };
  }
}

// 產生 robots meta content 的邏輯
function getRobotsContent(noindex: boolean, nofollow: boolean): string {
  return [noindex ? 'noindex' : 'index', nofollow ? 'nofollow' : 'follow'].join(', ');
}

// OG 圖片類型判斷邏輯
function getOgImageType(ogImage: string): string {
  if (ogImage.endsWith('.webp')) return 'image/webp';
  if (ogImage.endsWith('.png')) return 'image/png';
  return 'image/jpeg';
}

describe('SEO 元件邏輯', () => {
  describe('convertToJsonLd', () => {
    describe('Organization', () => {
      it('應該正確轉換 Organization 資料', () => {
        const item: JsonLdItem = {
          type: 'Organization',
          data: {
            name: '鎰威科技',
            url: 'https://www.ewill.com.tw',
            logo: 'https://www.ewill.com.tw/logo.png',
          },
        };

        const result = convertToJsonLd(item);

        expect(result).toHaveProperty('@context', 'https://schema.org');
        expect(result).toHaveProperty('@type', 'Organization');
        expect(result).toHaveProperty('name', '鎰威科技');
        expect(result).toHaveProperty('url', 'https://www.ewill.com.tw');
      });

      it('應該處理含有 address 的 Organization', () => {
        const item: JsonLdItem = {
          type: 'Organization',
          data: {
            name: '鎰威科技',
            address: {
              addressLocality: '台北市',
              addressRegion: '內湖區',
              addressCountry: 'TW',
            },
          },
        };

        const result = convertToJsonLd(item) as Record<string, unknown>;
        const address = result.address as Record<string, unknown>;

        expect(address).toHaveProperty('@type', 'PostalAddress');
        expect(address).toHaveProperty('addressLocality', '台北市');
      });
    });

    describe('WebSite', () => {
      it('應該正確轉換 WebSite 資料', () => {
        const item: JsonLdItem = {
          type: 'WebSite',
          data: {
            name: '鎰威科技',
            url: 'https://www.ewill.com.tw',
          },
        };

        const result = convertToJsonLd(item);

        expect(result).toHaveProperty('@type', 'WebSite');
        expect(result).toHaveProperty('name', '鎰威科技');
      });
    });

    describe('WebPage', () => {
      it('應該正確轉換 WebPage 資料', () => {
        const item: JsonLdItem = {
          type: 'WebPage',
          data: {
            name: '關於我們',
            description: '了解鎰威科技',
          },
        };

        const result = convertToJsonLd(item);

        expect(result).toHaveProperty('@type', 'WebPage');
        expect(result).toHaveProperty('url', canonicalURL);
      });
    });

    describe('Article', () => {
      it('應該正確轉換 Article 資料', () => {
        const item: JsonLdItem = {
          type: 'Article',
          data: {
            headline: '最新消息',
            datePublished: '2024-01-01',
            dateModified: '2024-01-02',
          },
        };

        const result = convertToJsonLd(item) as Record<string, unknown>;

        expect(result).toHaveProperty('@type', 'Article');
        expect(result).toHaveProperty('headline', '最新消息');
        expect(result.publisher).toHaveProperty('@type', 'Organization');
      });

      it('應該使用預設作者', () => {
        const item: JsonLdItem = {
          type: 'Article',
          data: {},
        };

        const result = convertToJsonLd(item) as Record<string, unknown>;
        const author = result.author as Record<string, unknown>;

        expect(author).toHaveProperty('name', siteName);
      });
    });

    describe('FAQPage', () => {
      it('應該正確轉換 FAQ 資料', () => {
        const item: JsonLdItem = {
          type: 'FAQPage',
          data: {
            items: [
              { question: '什麼是 AI？', answer: 'AI 是人工智慧' },
              { question: '如何聯絡？', answer: '請填寫表單' },
            ],
          },
        };

        const result = convertToJsonLd(item) as Record<string, unknown>;
        const mainEntity = result.mainEntity as Array<Record<string, unknown>>;

        expect(result).toHaveProperty('@type', 'FAQPage');
        expect(mainEntity).toHaveLength(2);
        expect(mainEntity[0]).toHaveProperty('@type', 'Question');
        expect(mainEntity[0]).toHaveProperty('name', '什麼是 AI？');
      });
    });

    describe('BreadcrumbList', () => {
      it('應該正確轉換麵包屑資料', () => {
        const item: JsonLdItem = {
          type: 'BreadcrumbList',
          data: {
            items: [
              { name: '首頁', url: '/', position: 1 },
              { name: '服務', url: '/services/', position: 2 },
            ],
          },
        };

        const result = convertToJsonLd(item) as Record<string, unknown>;
        const elements = result.itemListElement as Array<Record<string, unknown>>;

        expect(result).toHaveProperty('@type', 'BreadcrumbList');
        expect(elements).toHaveLength(2);
        expect(elements[0]).toHaveProperty('position', 1);
      });
    });

    describe('Event', () => {
      it('應該正確轉換 Event 資料', () => {
        const item: JsonLdItem = {
          type: 'Event',
          data: {
            name: '研討會',
            description: '年度研討會',
            startDate: '2024-12-25',
            endDate: '2024-12-26',
          },
        };

        const result = convertToJsonLd(item) as Record<string, unknown>;

        expect(result).toHaveProperty('@type', 'Event');
        expect(result).toHaveProperty('name', '研討會');
        expect(result).toHaveProperty('eventStatus', 'https://schema.org/EventScheduled');
      });

      it('應該處理線上活動模式', () => {
        const item: JsonLdItem = {
          type: 'Event',
          data: {
            name: '線上研討會',
            attendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
          },
        };

        const result = convertToJsonLd(item) as Record<string, unknown>;

        expect(result).toHaveProperty(
          'eventAttendanceMode',
          'https://schema.org/OnlineEventAttendanceMode'
        );
      });
    });

    describe('Service', () => {
      it('應該正確轉換 Service 資料', () => {
        const item: JsonLdItem = {
          type: 'Service',
          data: {
            name: '資安服務',
            serviceType: 'Security Service',
            description: '企業資安解決方案',
          },
        };

        const result = convertToJsonLd(item) as Record<string, unknown>;

        expect(result).toHaveProperty('@type', 'Service');
        expect(result).toHaveProperty('name', '資安服務');
        expect(result.areaServed).toHaveProperty('name', 'Taiwan');
      });
    });
  });

  describe('getRobotsContent', () => {
    it('應該回傳預設的 index, follow', () => {
      expect(getRobotsContent(false, false)).toBe('index, follow');
    });

    it('應該回傳 noindex, follow', () => {
      expect(getRobotsContent(true, false)).toBe('noindex, follow');
    });

    it('應該回傳 index, nofollow', () => {
      expect(getRobotsContent(false, true)).toBe('index, nofollow');
    });

    it('應該回傳 noindex, nofollow', () => {
      expect(getRobotsContent(true, true)).toBe('noindex, nofollow');
    });
  });

  describe('getOgImageType', () => {
    it('應該識別 WebP 圖片', () => {
      expect(getOgImageType('image.webp')).toBe('image/webp');
    });

    it('應該識別 PNG 圖片', () => {
      expect(getOgImageType('image.png')).toBe('image/png');
    });

    it('應該預設為 JPEG', () => {
      expect(getOgImageType('image.jpg')).toBe('image/jpeg');
      expect(getOgImageType('image.jpeg')).toBe('image/jpeg');
      expect(getOgImageType('image')).toBe('image/jpeg');
    });
  });
});
