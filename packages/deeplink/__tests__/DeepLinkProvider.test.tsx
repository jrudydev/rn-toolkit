/**
 * DeepLinkProvider Tests
 */

import React, { type ReactNode } from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider } from '@rn-toolkit/theming';
import { DeepLinkProvider } from '../src/DeepLinkProvider';
import { useDeepLink } from '../src/hooks/useDeepLink';
import type { RouteDefinition, RouteBadge } from '../src/types';

// Test routes
const routes: Record<string, RouteDefinition> = {
  home: { path: '/', name: 'Home' },
  profile: { path: '/profile/:id', name: 'Profile' },
  settings: { path: '/settings', name: 'Settings' },
};

// Test component that uses deep link
function TestConsumer() {
  const { currentRoute, canGoBack, history } = useDeepLink();
  return (
    <>
      <Text testID="route-name">{currentRoute?.name ?? 'none'}</Text>
      <Text testID="can-go-back">{String(canGoBack)}</Text>
      <Text testID="history-length">{history.length}</Text>
    </>
  );
}

// Wrapper
function TestWrapper({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('DeepLinkProvider', () => {
  describe('initialization', () => {
    it('renders_children', () => {
      const { getByText } = render(
        <DeepLinkProvider routes={routes}>
          <Text>Child</Text>
        </DeepLinkProvider>,
        { wrapper: TestWrapper }
      );

      expect(getByText('Child')).toBeTruthy();
    });

    it('registers_providedRoutes', async () => {
      function RouteChecker() {
        const { registry } = useDeepLink();
        return (
          <>
            <Text testID="has-home">{String(registry.has('home'))}</Text>
            <Text testID="has-profile">{String(registry.has('profile'))}</Text>
          </>
        );
      }

      const { getByTestId } = render(
        <DeepLinkProvider routes={routes}>
          <RouteChecker />
        </DeepLinkProvider>,
        { wrapper: TestWrapper }
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(getByTestId('has-home').props.children).toBe('true');
      expect(getByTestId('has-profile').props.children).toBe('true');
    });

    it('sets_initialRoute', async () => {
      const { getByTestId } = render(
        <DeepLinkProvider routes={routes} initialRoute="home">
          <TestConsumer />
        </DeepLinkProvider>,
        { wrapper: TestWrapper }
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(getByTestId('route-name').props.children).toBe('Home');
    });

    it('handles_noInitialRoute', async () => {
      const { getByTestId } = render(
        <DeepLinkProvider routes={routes}>
          <TestConsumer />
        </DeepLinkProvider>,
        { wrapper: TestWrapper }
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(getByTestId('route-name').props.children).toBe('none');
    });
  });

  describe('badge management', () => {
    it('fetches_badgesFromFunction', async () => {
      const fetchBadges = jest.fn().mockResolvedValue([
        { routeId: 'messages', count: 10 },
      ]);

      function BadgeChecker() {
        const { badges } = useDeepLink();
        return <Text testID="badge-count">{badges.get('messages') ?? 0}</Text>;
      }

      const { getByTestId } = render(
        <DeepLinkProvider routes={routes} badgeConfig={{ fetchBadges }}>
          <BadgeChecker />
        </DeepLinkProvider>,
        { wrapper: TestWrapper }
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(fetchBadges).toHaveBeenCalled();
      expect(getByTestId('badge-count').props.children).toBe(10);
    });

    it('calls_onBadgesUpdate', async () => {
      const onBadgesUpdate = jest.fn();
      const badges: RouteBadge[] = [{ routeId: 'inbox', count: 3 }];

      render(
        <DeepLinkProvider
          routes={routes}
          badgeConfig={{
            fetchBadges: async () => badges,
            onBadgesUpdate,
          }}
        >
          <TestConsumer />
        </DeepLinkProvider>,
        { wrapper: TestWrapper }
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(onBadgesUpdate).toHaveBeenCalledWith(badges);
    });
  });

  describe('navigation', () => {
    it('tracks_history', async () => {
      function Navigator() {
        const { navigate, history } = useDeepLink();
        React.useEffect(() => {
          navigate('profile', { id: '1' });
        }, [navigate]);
        return <Text testID="history-len">{history.length}</Text>;
      }

      const { getByTestId } = render(
        <DeepLinkProvider routes={routes} initialRoute="home">
          <Navigator />
        </DeepLinkProvider>,
        { wrapper: TestWrapper }
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(Number(getByTestId('history-len').props.children)).toBeGreaterThanOrEqual(1);
    });

    it('supports_replace_navigation', async () => {
      function Navigator() {
        const { navigate, history } = useDeepLink();
        const [step, setStep] = React.useState(0);

        React.useEffect(() => {
          if (step === 0) {
            navigate('profile', { id: '1' });
            setStep(1);
          } else if (step === 1) {
            navigate('settings', undefined, { replace: true });
            setStep(2);
          }
        }, [navigate, step]);

        return <Text testID="history-len">{history.length}</Text>;
      }

      const { getByTestId } = render(
        <DeepLinkProvider routes={routes} initialRoute="home">
          <Navigator />
        </DeepLinkProvider>,
        { wrapper: TestWrapper }
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Replace should not add to history
      expect(Number(getByTestId('history-len').props.children)).toBeLessThanOrEqual(2);
    });

    it('supports_reset_navigation', async () => {
      function Navigator() {
        const { navigate, reset, history } = useDeepLink();
        const [step, setStep] = React.useState(0);

        React.useEffect(() => {
          if (step === 0) {
            navigate('profile', { id: '1' });
            setStep(1);
          } else if (step === 1) {
            navigate('settings');
            setStep(2);
          } else if (step === 2) {
            reset('home');
            setStep(3);
          }
        }, [navigate, reset, step]);

        return <Text testID="history-len">{history.length}</Text>;
      }

      const { getByTestId } = render(
        <DeepLinkProvider routes={routes} initialRoute="home">
          <Navigator />
        </DeepLinkProvider>,
        { wrapper: TestWrapper }
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      // Reset should clear history
      expect(Number(getByTestId('history-len').props.children)).toBe(1);
    });
  });

  describe('state management', () => {
    it('preserves_navigationState', async () => {
      function StateUser() {
        const { navigate, getState } = useDeepLink();
        const [initialized, setInitialized] = React.useState(false);

        React.useEffect(() => {
          if (!initialized) {
            navigate('profile', { id: '1' }, { state: { tab: 'posts' } });
            setInitialized(true);
          }
        }, [navigate, initialized]);

        const state = getState<{ tab: string }>();
        return <Text testID="state">{state?.tab ?? 'none'}</Text>;
      }

      const { getByTestId } = render(
        <DeepLinkProvider routes={routes} initialRoute="home">
          <StateUser />
        </DeepLinkProvider>,
        { wrapper: TestWrapper }
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(getByTestId('state').props.children).toBe('posts');
    });

    it('updates_state', async () => {
      function StateUser() {
        const { navigate, getState, setState } = useDeepLink();
        const [updated, setUpdated] = React.useState(false);

        React.useEffect(() => {
          navigate('profile', { id: '1' });
        }, [navigate]);

        React.useEffect(() => {
          if (!updated) {
            setState({ count: 42 });
            setUpdated(true);
          }
        }, [setState, updated]);

        const state = getState<{ count: number }>();
        return <Text testID="state">{state?.count ?? 0}</Text>;
      }

      const { getByTestId } = render(
        <DeepLinkProvider routes={routes} initialRoute="home">
          <StateUser />
        </DeepLinkProvider>,
        { wrapper: TestWrapper }
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(getByTestId('state').props.children).toBe(42);
    });
  });
});
