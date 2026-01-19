/**
 * EventCard 元件邏輯測試
 *
 * 測試元件內的純函數邏輯，不需要渲染完整元件
 */
import { describe, it, expect } from 'vitest';
import type { EventCategory } from '@ewill/shared';

// 從 EventCard.astro 提取的邏輯（測試用）
const CATEGORY_LABELS: Record<EventCategory, string> = {
  seminar: '研討會',
  webinar: '線上講座',
  press_release: '新聞發布',
  exhibition: '展覽',
  other: '其他活動',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getCategoryLabel(category: EventCategory): string {
  return CATEGORY_LABELS[category] || '活動新聞';
}

function getEventUrl(page_slug: string): string {
  return `/events/${page_slug}/`;
}

describe('EventCard 邏輯', () => {
  describe('formatDate', () => {
    it('應該正確格式化日期', () => {
      // 使用 UTC 時間避免時區問題
      const result = formatDate('2024-12-25T00:00:00Z');
      // 預期格式：2024年12月25日
      expect(result).toMatch(/2024.*12.*25/);
    });

    it('應該處理不同的日期格式', () => {
      const result1 = formatDate('2024-01-01');
      const result2 = formatDate('2024-06-15T12:00:00');

      expect(result1).toMatch(/2024.*1.*1/);
      expect(result2).toMatch(/2024.*6.*15/);
    });

    it('應該處理月份和日期的中文格式', () => {
      const result = formatDate('2024-03-08');
      // 應該包含「月」和「日」
      expect(result).toContain('月');
      expect(result).toContain('日');
    });
  });

  describe('getCategoryLabel', () => {
    it('應該回傳正確的分類標籤 - seminar', () => {
      expect(getCategoryLabel('seminar')).toBe('研討會');
    });

    it('應該回傳正確的分類標籤 - webinar', () => {
      expect(getCategoryLabel('webinar')).toBe('線上講座');
    });

    it('應該回傳正確的分類標籤 - press_release', () => {
      expect(getCategoryLabel('press_release')).toBe('新聞發布');
    });

    it('應該回傳正確的分類標籤 - exhibition', () => {
      expect(getCategoryLabel('exhibition')).toBe('展覽');
    });

    it('應該回傳正確的分類標籤 - other', () => {
      expect(getCategoryLabel('other')).toBe('其他活動');
    });

    it('應該處理未知分類', () => {
      // TypeScript 會報錯，但運行時可能遇到未知分類
      const result = getCategoryLabel('unknown' as EventCategory);
      expect(result).toBe('活動新聞');
    });
  });

  describe('getEventUrl', () => {
    it('應該生成正確的活動 URL', () => {
      expect(getEventUrl('event_20241225')).toBe('/events/event_20241225/');
    });

    it('應該處理含有特殊字元的 slug', () => {
      expect(getEventUrl('my-event-2024')).toBe('/events/my-event-2024/');
    });

    it('應該處理空 slug', () => {
      expect(getEventUrl('')).toBe('/events//');
    });
  });

  describe('CATEGORY_LABELS', () => {
    it('應該包含所有預期的分類', () => {
      const expectedCategories: EventCategory[] = [
        'seminar',
        'webinar',
        'press_release',
        'exhibition',
        'other',
      ];

      expectedCategories.forEach((category) => {
        expect(CATEGORY_LABELS).toHaveProperty(category);
        expect(typeof CATEGORY_LABELS[category]).toBe('string');
        expect(CATEGORY_LABELS[category].length).toBeGreaterThan(0);
      });
    });
  });
});
