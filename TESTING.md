# Testing Guide

This project uses a comprehensive testing setup with **Vitest** for unit/component testing and **Playwright** for end-to-end (e2e) testing.

## Table of Contents

- [Setup](#setup)
- [Unit Testing](#unit-testing)
- [E2E Testing](#e2e-testing)
- [Test Scripts](#test-scripts)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)

## Setup

### Initial Setup

After cloning the repository, install dependencies:

```bash
npm install
```

### Install Playwright Browsers

For e2e testing, install Playwright browsers:

```bash
npm run playwright:install
```

This will download Chromium, Firefox, and WebKit browsers needed for testing.

## Unit Testing

### Tech Stack

- **Vitest**: Fast unit test runner with native ESM support
- **React Testing Library**: Test React components the way users interact with them
- **Testing Library User Event**: Simulate user interactions
- **jsdom**: Provides a DOM environment for testing

### Running Unit Tests

```bash
# Run tests once
npm run test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Writing Unit Tests

Tests should be placed in `__tests__` directories or named with `.test.tsx` or `.spec.tsx` extensions.

#### Example Component Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders with correct text', () => {
    render(<MyComponent title="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<MyComponent onClick={handleClick} />);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Utilities

We provide a custom `render` function in `test/utils/test-utils.tsx` that wraps components with common providers. Use this instead of the standard React Testing Library render:

```typescript
import { render, screen } from '@/test/utils/test-utils';
```

### Mocking

#### Mock Functions

```typescript
import { vi } from 'vitest';

const mockFn = vi.fn();
mockFn.mockReturnValue('mocked value');
```

#### Mock Modules

```typescript
vi.mock('@/lib/api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'test' }),
}));
```

#### Mock Next.js Router

The Next.js router is automatically mocked in `test/setup.ts`. To customize:

```typescript
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/custom-path',
  }),
}));
```

## E2E Testing

### Tech Stack

- **Playwright**: Modern e2e testing framework with cross-browser support

### Running E2E Tests

```bash
# Run e2e tests (headless)
npm run test:e2e

# Run with UI mode (recommended for development)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/home.spec.ts

# Run specific browser
npx playwright test --project=chromium
```

### Writing E2E Tests

E2E tests should be placed in the `e2e/` directory with `.spec.ts` extension.

#### Example E2E Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Flow', () => {
  test('user can complete signup', async ({ page }) => {
    await page.goto('/signup');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome');
  });
});
```

#### Page Object Model

For complex flows, use Page Object Model:

```typescript
// e2e/pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// e2e/auth.spec.ts
import { LoginPage } from './pages/login.page';

test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

### Test Configuration

Playwright configuration is in `playwright.config.ts`:

- Tests run across multiple browsers (Chromium, Firefox, WebKit)
- Mobile viewports included (Pixel 5, iPhone 12)
- Automatic dev server startup
- Screenshots/videos on failure
- Traces on retry

## Test Scripts

| Command | Description |
|---------|-------------|
| `npm run test` | Run unit tests once |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:ui` | Run unit tests with Vitest UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:e2e` | Run e2e tests |
| `npm run test:e2e:ui` | Run e2e tests with Playwright UI |
| `npm run test:e2e:headed` | Run e2e tests in headed mode |
| `npm run test:e2e:debug` | Debug e2e tests |
| `npm run test:all` | Run all tests (unit + e2e) |
| `npm run playwright:install` | Install Playwright browsers |

## Best Practices

### Unit Testing

1. **Test User Behavior**: Focus on how users interact with your components, not implementation details
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Avoid Testing Implementation**: Don't test component internal state
4. **Keep Tests Simple**: One assertion per test when possible
5. **Mock External Dependencies**: Mock API calls, third-party libraries
6. **Use Setup Files**: Keep common test setup in `test/setup.ts`

### E2E Testing

1. **Test Critical Paths**: Focus on core user journeys
2. **Keep Tests Independent**: Each test should run independently
3. **Use Page Objects**: Organize complex interactions
4. **Wait Properly**: Use Playwright's auto-waiting, avoid arbitrary timeouts
5. **Test Accessibility**: Include basic a11y checks
6. **Mock External Services**: Mock third-party APIs in e2e tests when appropriate

### General

1. **Naming Conventions**: Use descriptive test names that explain what's being tested
2. **Arrange-Act-Assert**: Structure tests with clear setup, action, and assertion phases
3. **Coverage Goals**: Aim for 80%+ coverage on critical paths
4. **Run Tests Locally**: Always run tests before committing
5. **Keep Tests Fast**: Unit tests should be < 1s, e2e tests < 30s

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Vitest Issues

**Tests not running**:
- Check `vitest.config.ts` configuration
- Ensure test files match pattern: `**/*.{test,spec}.{js,ts,jsx,tsx}`

**Import errors**:
- Verify path aliases in `vitest.config.ts` match `tsconfig.json`
- Check if you need to add more setup to `test/setup.ts`

### Playwright Issues

**Browsers not installed**:
```bash
npm run playwright:install
```

**Tests timing out**:
- Increase timeout in `playwright.config.ts`
- Check if dev server is starting properly
- Use `await page.waitForLoadState('networkidle')`

**Flaky tests**:
- Avoid arbitrary `setTimeout`, use Playwright's auto-waiting
- Use proper locators: `page.getByRole()`, `page.getByText()`
- Add debug screenshots: `await page.screenshot({ path: 'debug.png' })`

## Coverage Reports

After running `npm run test:coverage`, open the HTML report:

```bash
open coverage/index.html
```

Coverage thresholds can be configured in `vitest.config.ts`.

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

