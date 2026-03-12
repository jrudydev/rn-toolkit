import { useWindowDimensions } from 'react-native';

/**
 * Breakpoint values in pixels
 */
export const breakpoints = {
  sm: 640,   // Mobile
  md: 768,   // Tablet
  lg: 1024,  // Desktop
  xl: 1280,  // Large desktop
} as const;

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

export interface ResponsiveInfo {
  /** Current viewport width */
  width: number;
  /** Current viewport height */
  height: number;
  /** Current breakpoint name */
  breakpoint: Breakpoint;
  /** True if viewport is mobile size (< 768px) */
  isMobile: boolean;
  /** True if viewport is tablet size (768px - 1023px) */
  isTablet: boolean;
  /** True if viewport is desktop size (>= 1024px) */
  isDesktop: boolean;
  /** True if viewport width is >= breakpoint */
  up: (bp: Breakpoint) => boolean;
  /** True if viewport width is < breakpoint */
  down: (bp: Breakpoint) => boolean;
}

/**
 * Hook for responsive layouts
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isMobile, isDesktop, breakpoint } = useResponsive();
 *
 *   return (
 *     <View style={{ flexDirection: isMobile ? 'column' : 'row' }}>
 *       <Text>Current breakpoint: {breakpoint}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useResponsive(): ResponsiveInfo {
  const { width, height } = useWindowDimensions();

  const getBreakpoint = (): Breakpoint => {
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    return 'sm';
  };

  const breakpoint = getBreakpoint();

  return {
    width,
    height,
    breakpoint,
    isMobile: width < breakpoints.md,
    isTablet: width >= breakpoints.md && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg,
    up: (bp: Breakpoint) => width >= breakpoints[bp],
    down: (bp: Breakpoint) => width < breakpoints[bp],
  };
}
