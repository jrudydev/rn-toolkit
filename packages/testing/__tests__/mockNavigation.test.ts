import { mockNavigation } from '../src/mocks/mockNavigation';

describe('mockNavigation', () => {
  it('starts_atInitialRoute_byDefault', () => {
    const nav = mockNavigation();

    expect(nav.currentRoute()).toBe('/home');
  });

  it('starts_atCustomInitialRoute_whenProvided', () => {
    const nav = mockNavigation('/dashboard');

    expect(nav.currentRoute()).toBe('/dashboard');
  });

  it('navigates_toNewRoute', () => {
    const nav = mockNavigation();

    nav.navigate('/profile');

    expect(nav.currentRoute()).toBe('/profile');
  });

  it('replaces_routeParams_whenProvided', () => {
    const nav = mockNavigation();

    nav.navigate('/profile/:id', { id: '123' });

    expect(nav.currentRoute()).toBe('/profile/123');
  });

  it('replaces_multipleRouteParams', () => {
    const nav = mockNavigation();

    nav.navigate('/users/:userId/posts/:postId', { userId: '42', postId: '99' });

    expect(nav.currentRoute()).toBe('/users/42/posts/99');
  });

  it('tracks_navigationHistory', () => {
    const nav = mockNavigation('/home');

    nav.navigate('/profile');
    nav.navigate('/settings');

    expect(nav.getHistory()).toEqual(['/home', '/profile', '/settings']);
  });

  it('navigates_back_inHistory', () => {
    const nav = mockNavigation('/home');

    nav.navigate('/profile');
    nav.navigate('/settings');
    nav.back();

    expect(nav.currentRoute()).toBe('/profile');
  });

  it('doesNotNavigate_backPastInitialRoute', () => {
    const nav = mockNavigation('/home');

    nav.back();
    nav.back();
    nav.back();

    expect(nav.currentRoute()).toBe('/home');
  });

  it('clears_forwardHistory_whenNavigatingFromMiddle', () => {
    const nav = mockNavigation('/home');

    nav.navigate('/a');
    nav.navigate('/b');
    nav.navigate('/c');
    nav.back(); // at /b
    nav.back(); // at /a
    nav.navigate('/x'); // should clear /b and /c

    expect(nav.getHistory()).toEqual(['/home', '/a', '/x']);
  });

  it('resets_toInitialState', () => {
    const nav = mockNavigation('/home');

    nav.navigate('/a');
    nav.navigate('/b');
    nav.reset();

    expect(nav.currentRoute()).toBe('/home');
    expect(nav.getHistory()).toEqual(['/home']);
  });

  it('returns_internalState_forAssertions', () => {
    const nav = mockNavigation('/home');

    nav.navigate('/profile');

    const state = nav.getState();
    expect(state.history).toEqual(['/home', '/profile']);
    expect(state.currentIndex).toBe(1);
  });
});
