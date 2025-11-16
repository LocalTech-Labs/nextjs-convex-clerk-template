# Testing Quick Start Guide

Get started with testing in under 5 minutes!

## 🚀 Setup (One-time)

If you haven't already installed Playwright browsers:

```bash
npm run playwright:install
```

That's it! All testing dependencies are already installed.

## 🧪 Running Tests

### Unit Tests

```bash
# Run all unit tests once
npm run test

# Watch mode (auto-reruns on file changes) - great for TDD
npm run test:watch

# Open interactive UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Run all e2e tests (headless)
npm run test:e2e

# Run with UI mode (recommended for debugging)
npm run test:e2e:ui

# See the browser (headed mode)
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug
```

### All Tests

```bash
# Run everything
npm run test:all
```

## 📝 Writing Your First Test

### Unit Test Example

Create `components/MyButton/__tests__/MyButton.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { MyButton } from '../MyButton';

describe('MyButton', () => {
  it('renders and handles clicks', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<MyButton onClick={handleClick}>Click me</MyButton>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Test Example

Create `e2e/my-feature.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('user can complete flow', async ({ page }) => {
  await page.goto('/');
  
  await page.click('text=Get Started');
  await expect(page).toHaveURL('/signup');
  
  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('text=Welcome')).toBeVisible();
});
```

## 📁 Test File Locations

```
project/
├── components/
│   └── __tests__/          # Component tests
│       └── *.test.tsx
├── app/
│   └── __tests__/          # Page tests
│       └── *.test.tsx
├── lib/
│   └── __tests__/          # Utility tests
│       └── *.test.ts
├── hooks/
│   └── __tests__/          # Hook tests
│       └── *.test.ts
└── e2e/
    └── *.spec.ts           # E2E tests
```

## 🎯 Common Testing Patterns

### Testing Components

```typescript
import { render, screen } from '@/test/utils/test-utils';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Testing User Interactions

```typescript
import userEvent from '@testing-library/user-event';

test('handles click', async () => {
  const user = userEvent.setup();
  render(<MyButton />);
  await user.click(screen.getByRole('button'));
});
```

### Testing Forms

```typescript
test('submits form', async () => {
  const user = userEvent.setup();
  render(<MyForm />);
  
  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

### Mocking API Calls

```typescript
import { vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'test' }),
}));
```

### Testing with Convex

```typescript
import { mockUseQuery } from '@/test/mocks/convex';

vi.mock('convex/react', () => ({
  useQuery: mockUseQuery({ users: [{ id: '1', name: 'Test' }] }),
}));
```

## 🔍 Debugging Tests

### Unit Tests

```bash
# Run specific test file
npm run test -- components/__tests__/button.test.tsx

# Run tests matching pattern
npm run test -- --grep="MyComponent"

# Use the UI for debugging
npm run test:ui
```

### E2E Tests

```bash
# Run specific test file
npx playwright test e2e/home.spec.ts

# Run specific test by name
npx playwright test -g "user can login"

# Debug mode (pause and step through)
npm run test:e2e:debug

# See the browser
npm run test:e2e:headed
```

## 📊 Viewing Coverage

After running `npm run test:coverage`:

```bash
# Open the HTML coverage report
open coverage/index.html
```

## 🎨 VS Code Integration

Recommended extensions (already in `.vscode/extensions.json`):
- Vitest (`vitest.explorer`) - Run tests from sidebar
- Playwright (`ms-playwright.playwright`) - Run e2e tests from editor

## 💡 Quick Tips

1. **Use `screen.debug()`** to see what's rendered in tests
2. **Prefer `getByRole`** over `getByTestId` for accessibility
3. **Use `waitFor`** for async operations
4. **Keep tests focused** - one concept per test
5. **Mock external dependencies** to isolate tests

## 🐛 Common Issues

### "Cannot find module"
- Ensure imports use the `@/` alias
- Check `vitest.config.ts` path resolution

### "Element not found"
- Use `screen.debug()` to see rendered output
- Check if element needs `await` (async operations)
- Verify element is actually rendered (conditional rendering?)

### "Test timeout"
- Increase timeout in config
- Check for missing `await` on async operations
- Verify dev server is running for e2e tests

## 📚 More Resources

- **Full Testing Guide**: See [TESTING.md](./TESTING.md)
- **Vitest Docs**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/
- **Playwright Docs**: https://playwright.dev/

---

Happy Testing! 🎉

