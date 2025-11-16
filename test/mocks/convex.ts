/**
 * Mock utilities for Convex functions in tests
 * Use these to mock Convex queries, mutations, and actions
 */

import { vi } from 'vitest';

/**
 * Mock a Convex query
 * @example
 * const mockGetUser = mockConvexQuery({ id: '123', name: 'Test User' });
 */
export const mockConvexQuery = (returnValue: any) => {
  return vi.fn().mockResolvedValue(returnValue);
};

/**
 * Mock a Convex mutation
 * @example
 * const mockCreateUser = mockConvexMutation({ id: '123' });
 */
export const mockConvexMutation = (returnValue: any) => {
  return vi.fn().mockResolvedValue(returnValue);
};

/**
 * Mock a Convex action
 * @example
 * const mockSendEmail = mockConvexAction({ success: true });
 */
export const mockConvexAction = (returnValue: any) => {
  return vi.fn().mockResolvedValue(returnValue);
};

/**
 * Mock the useQuery hook from Convex
 */
export const mockUseQuery = (data: any, loading = false, error?: Error) => {
  return vi.fn(() => {
    if (error) throw error;
    return loading ? undefined : data;
  });
};

/**
 * Mock the useMutation hook from Convex
 */
export const mockUseMutation = () => {
  return vi.fn(() => vi.fn());
};

/**
 * Mock the useAction hook from Convex
 */
export const mockUseAction = () => {
  return vi.fn(() => vi.fn());
};

/**
 * Example usage in tests:
 * 
 * import { mockUseQuery } from '@/test/mocks/convex';
 * 
 * vi.mock('convex/react', () => ({
 *   useQuery: mockUseQuery({ users: [{ id: '1', name: 'Test' }] }),
 *   useMutation: mockUseMutation(),
 * }));
 */

