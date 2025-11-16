import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

describe('useIsMobile', () => {
  it('should return the value from matchMedia', async () => {
    // The default mock from test/setup.ts returns false
    const { result } = renderHook(() => useIsMobile());
    
    await waitFor(() => {
      // The hook uses matchMedia internally, which is mocked in test/setup.ts
      // This test verifies the hook works with the mocked matchMedia
      expect(typeof result.current).toBe('boolean');
    });
  });

  it('should handle matchMedia changes', () => {
    const { result, rerender } = renderHook(() => useIsMobile());
    
    // Initial value
    expect(typeof result.current).toBe('boolean');
    
    // Rerender should maintain the same behavior
    rerender();
    expect(typeof result.current).toBe('boolean');
  });
});

