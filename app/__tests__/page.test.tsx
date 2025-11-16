import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    // Add your specific assertions based on your home page content
    // This is a placeholder test
    expect(document.querySelector('main')).toBeInTheDocument();
  });
});

