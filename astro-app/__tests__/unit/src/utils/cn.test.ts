/**
 * src/utils/cn.ts 單元測試
 */
import { describe, it, expect } from 'vitest';
import { cn } from '../../../../src/utils/cn';

describe('src/utils/cn', () => {
  describe('基本功能', () => {
    it('應該合併多個 class 字串', () => {
      expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
    });

    it('應該處理單一 class', () => {
      expect(cn('px-4')).toBe('px-4');
    });

    it('應該處理空字串', () => {
      expect(cn('')).toBe('');
    });

    it('應該處理 undefined', () => {
      expect(cn(undefined)).toBe('');
    });

    it('應該處理 null', () => {
      expect(cn(null)).toBe('');
    });

    it('應該處理 false', () => {
      expect(cn(false)).toBe('');
    });
  });

  describe('條件式 class', () => {
    it('應該支援條件式 class（true）', () => {
      const isActive = true;
      expect(cn('base', isActive && 'active')).toBe('base active');
    });

    it('應該支援條件式 class（false）', () => {
      const isActive = false;
      expect(cn('base', isActive && 'active')).toBe('base');
    });

    it('應該支援三元運算子', () => {
      const variant = 'primary';
      expect(cn('btn', variant === 'primary' ? 'btn-primary' : 'btn-secondary')).toBe(
        'btn btn-primary'
      );
    });
  });

  describe('Tailwind 衝突解決', () => {
    it('應該解決 padding 衝突（後者優先）', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4');
    });

    it('應該解決 margin 衝突', () => {
      expect(cn('mt-2', 'mt-4')).toBe('mt-4');
    });

    it('應該解決 background 衝突', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('應該解決 text color 衝突', () => {
      expect(cn('text-white', 'text-black')).toBe('text-black');
    });

    it('應該解決 font size 衝突', () => {
      expect(cn('text-sm', 'text-lg')).toBe('text-lg');
    });

    it('應該解決 flex 衝突', () => {
      expect(cn('flex-row', 'flex-col')).toBe('flex-col');
    });

    it('不同屬性不應該衝突', () => {
      expect(cn('px-2', 'py-4', 'mx-2')).toBe('px-2 py-4 mx-2');
    });
  });

  describe('物件語法', () => {
    it('應該支援物件語法', () => {
      expect(cn({ 'bg-red-500': true, 'text-white': true })).toBe('bg-red-500 text-white');
    });

    it('應該根據條件過濾物件屬性', () => {
      expect(cn({ active: true, disabled: false })).toBe('active');
    });

    it('應該支援混合字串和物件', () => {
      expect(cn('base', { active: true, hidden: false })).toBe('base active');
    });
  });

  describe('陣列語法', () => {
    it('應該支援陣列語法', () => {
      expect(cn(['px-4', 'py-2'])).toBe('px-4 py-2');
    });

    it('應該支援巢狀陣列', () => {
      expect(cn(['px-4', ['py-2', 'mx-2']])).toBe('px-4 py-2 mx-2');
    });

    it('應該過濾陣列中的 falsy 值', () => {
      expect(cn(['px-4', false, null, undefined, 'py-2'])).toBe('px-4 py-2');
    });
  });

  describe('複雜組合', () => {
    it('應該處理複雜的組合情境', () => {
      const isActive = true;
      const isDisabled = false;
      const size = 'large';

      const result = cn(
        'btn',
        isActive && 'btn-active',
        isDisabled && 'btn-disabled',
        {
          'btn-sm': size === 'small',
          'btn-lg': size === 'large',
        },
        ['rounded', 'shadow']
      );

      expect(result).toBe('btn btn-active btn-lg rounded shadow');
    });

    it('應該處理 responsive class', () => {
      expect(cn('px-2 md:px-4 lg:px-6')).toBe('px-2 md:px-4 lg:px-6');
    });

    it('應該處理 hover/focus class', () => {
      expect(cn('bg-blue-500 hover:bg-blue-600 focus:ring-2')).toBe(
        'bg-blue-500 hover:bg-blue-600 focus:ring-2'
      );
    });

    it('應該解決帶有修飾符的衝突', () => {
      expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe('hover:bg-blue-500');
    });
  });

  describe('邊界情況', () => {
    it('應該處理多個空格', () => {
      expect(cn('px-4  py-2')).toBe('px-4 py-2');
    });

    it('應該處理沒有參數的情況', () => {
      expect(cn()).toBe('');
    });

    it('應該處理很長的 class 列表', () => {
      const classes = Array(100)
        .fill(null)
        .map((_, i) => `class-${i}`);
      const result = cn(...classes);
      expect(result.split(' ')).toHaveLength(100);
    });
  });
});
