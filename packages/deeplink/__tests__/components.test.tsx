/**
 * Deep Link Components Tests
 */

import React, { type ReactNode } from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { ThemeProvider } from '@rn-toolkit/theming';
import { DeepLinkProvider } from '../src/DeepLinkProvider';
import { SmartTabBar, type TabDefinition } from '../src/components/SmartTabBar';
import { SmartHeader } from '../src/components/SmartHeader';
import type { RouteDefinition, RouteBadge } from '../src/types';

// Test routes
const routes: Record<string, RouteDefinition> = {
  home: { path: '/', name: 'Home' },
  profile: { path: '/profile/:id', name: 'Profile' },
  notifications: { path: '/notifications', name: 'Notifications' },
  settings: { path: '/settings', name: 'Settings' },
};

// Mock badges
const mockBadges: RouteBadge[] = [
  { routeId: 'notifications', count: 5 },
];

// Test wrapper
function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <DeepLinkProvider
        routes={routes}
        initialRoute="home"
        badgeConfig={{ fetchBadges: async () => mockBadges }}
      >
        {children}
      </DeepLinkProvider>
    </ThemeProvider>
  );
}

// Increase timeout for memory-constrained environments
jest.setTimeout(30000);

describe('SmartTabBar', () => {
  const tabs: TabDefinition[] = [
    { routeId: 'home', label: 'Home' },
    { routeId: 'notifications', label: 'Notifications', showBadge: true },
    { routeId: 'profile', label: 'Profile', params: { id: 'me' } },
  ];

  it('renders_allTabs', async () => {
    const { getByTestId } = render(<SmartTabBar tabs={tabs} />, {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(getByTestId('smart-tab-bar')).toBeTruthy();
    expect(getByTestId('tab-home')).toBeTruthy();
    expect(getByTestId('tab-notifications')).toBeTruthy();
    expect(getByTestId('tab-profile')).toBeTruthy();
  });

  it('shows_labels', async () => {
    const { getByText } = render(<SmartTabBar tabs={tabs} showLabels />, {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Notifications')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
  });

  it('hides_labels_whenDisabled', async () => {
    const { queryByText } = render(
      <SmartTabBar tabs={tabs} showLabels={false} />,
      { wrapper: TestWrapper }
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(queryByText('Home')).toBeNull();
  });

  it('shows_badge', async () => {
    const { getByTestId } = render(<SmartTabBar tabs={tabs} />, {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(getByTestId('badge-notifications')).toBeTruthy();
  });

  it('navigates_onTabPress', async () => {
    const onTabPress = jest.fn();

    const { getByTestId } = render(
      <SmartTabBar tabs={tabs} onTabPress={onTabPress} />,
      { wrapper: TestWrapper }
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    fireEvent.press(getByTestId('tab-profile'));

    expect(onTabPress).toHaveBeenCalledWith('profile');
  });

  it('uses_customTestID', async () => {
    const tabsWithTestId: TabDefinition[] = [
      { routeId: 'home', label: 'Home', testID: 'custom-home-tab' },
    ];

    const { getByTestId } = render(<SmartTabBar tabs={tabsWithTestId} />, {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(getByTestId('custom-home-tab')).toBeTruthy();
  });

  it('formats_largeBadgeCount', async () => {
    const largeBadges: RouteBadge[] = [{ routeId: 'notifications', count: 150 }];

    const LargeWrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>
        <DeepLinkProvider
          routes={routes}
          initialRoute="home"
          badgeConfig={{ fetchBadges: async () => largeBadges }}
        >
          {children}
        </DeepLinkProvider>
      </ThemeProvider>
    );

    const { getByText } = render(
      <SmartTabBar tabs={tabs} maxBadgeCount={99} />,
      { wrapper: LargeWrapper }
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(getByText('99+')).toBeTruthy();
  });

  it('renders_iconFunction', async () => {
    const iconFn = jest.fn(() => null);
    const tabsWithIcon: TabDefinition[] = [
      { routeId: 'home', label: 'Home', icon: iconFn },
    ];

    render(<SmartTabBar tabs={tabsWithIcon} />, {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(iconFn).toHaveBeenCalled();
  });
});

describe('SmartHeader', () => {
  it('renders_header', async () => {
    const { getByTestId } = render(<SmartHeader title="Test" />, {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(getByTestId('smart-header')).toBeTruthy();
  });

  it('displays_title', async () => {
    const { getByTestId } = render(<SmartHeader title="My Screen" />, {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(getByTestId('header-title').props.children).toBe('My Screen');
  });

  it('uses_routeName_whenNoTitle', async () => {
    const { getByTestId } = render(<SmartHeader />, {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Should use route name "Home" from initial route
    expect(getByTestId('header-title').props.children).toBe('Home');
  });

  it('hides_backButton_whenCannotGoBack', async () => {
    const { queryByTestId } = render(<SmartHeader />, {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // No back button on first screen
    expect(queryByTestId('header-back-button')).toBeNull();
  });

  it('hides_backButton_whenDisabled', async () => {
    const { queryByTestId } = render(<SmartHeader showBackButton={false} />, {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(queryByTestId('header-back-button')).toBeNull();
  });

  it('renders_transparent', async () => {
    const { getByTestId } = render(<SmartHeader transparent />, {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(getByTestId('smart-header')).toBeTruthy();
  });
});
