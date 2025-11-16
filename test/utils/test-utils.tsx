import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

/**
 * Custom render function that wraps components with common providers
 * Add your app's providers here (e.g., ThemeProvider, AuthProvider, etc.)
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  // You can add providers here as needed
  // Example:
  // const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  //   return (
  //     <ThemeProvider>
  //       <AuthProvider>
  //         {children}
  //       </AuthProvider>
  //     </ThemeProvider>
  //   );
  // };
  
  return render(ui, { ...options });
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override render method
export { customRender as render };

