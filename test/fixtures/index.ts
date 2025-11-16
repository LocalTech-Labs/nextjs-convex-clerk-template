/**
 * Test fixtures and mock data
 * Use these to create consistent test data across tests
 */

/**
 * Mock user data
 */
export const mockUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date('2025-01-01').toISOString(),
};

/**
 * Mock authenticated user
 */
export const mockAuthUser = {
  ...mockUser,
  isAuthenticated: true,
  role: 'user',
};

/**
 * Mock admin user
 */
export const mockAdminUser = {
  ...mockUser,
  id: 'admin-123',
  name: 'Admin User',
  email: 'admin@example.com',
  isAuthenticated: true,
  role: 'admin',
};

/**
 * Factory function to create mock users
 */
export const createMockUser = (overrides?: Partial<typeof mockUser>) => ({
  ...mockUser,
  ...overrides,
});

/**
 * Mock API responses
 */
export const mockApiResponse = {
  success: {
    status: 200,
    data: { success: true },
  },
  error: {
    status: 500,
    data: { error: 'Internal Server Error' },
  },
  notFound: {
    status: 404,
    data: { error: 'Not Found' },
  },
  unauthorized: {
    status: 401,
    data: { error: 'Unauthorized' },
  },
};

/**
 * Mock form data
 */
export const mockFormData = {
  login: {
    email: 'test@example.com',
    password: 'password123',
  },
  signup: {
    email: 'newuser@example.com',
    password: 'SecurePass123!',
    name: 'New User',
  },
};

/**
 * Example usage:
 * 
 * import { mockUser, createMockUser } from '@/test/fixtures';
 * 
 * test('renders user profile', () => {
 *   render(<UserProfile user={mockUser} />);
 *   expect(screen.getByText(mockUser.name)).toBeInTheDocument();
 * });
 */

