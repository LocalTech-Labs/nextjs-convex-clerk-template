import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('merges class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toBe('base-class active-class');
    });

    it('deduplicates tailwind classes', () => {
      const result = cn('p-4', 'p-2');
      // The latter class should override the former
      expect(result).toBe('p-2');
    });

    it('handles undefined and null values', () => {
      const result = cn('base', undefined, null, 'extra');
      expect(result).toBe('base extra');
    });

    it('handles empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });
  });
});

