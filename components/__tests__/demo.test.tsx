import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';

// Simple demo component to test
function DemoComponent({ name }: { name: string }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>This is a demo component.</p>
    </div>
  );
}

describe('DemoComponent', () => {
  it('renders with the provided name', () => {
    render(<DemoComponent name="World" />);
    
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    expect(screen.getByText('This is a demo component.')).toBeInTheDocument();
  });

  it('renders with a different name', () => {
    render(<DemoComponent name="Testing" />);
    
    expect(screen.getByText('Hello, Testing!')).toBeInTheDocument();
  });
});

