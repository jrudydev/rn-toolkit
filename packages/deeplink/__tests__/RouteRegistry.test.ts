/**
 * RouteRegistry Tests
 */

import { createRouteRegistry } from '../src/RouteRegistry';

describe('RouteRegistry', () => {
  describe('register', () => {
    it('registers_route_withValidDefinition', () => {
      const registry = createRouteRegistry();

      registry.register('home', { path: '/', name: 'Home' });

      expect(registry.has('home')).toBe(true);
      expect(registry.get('home')).toEqual({ path: '/', name: 'Home' });
    });

    it('registers_route_withParams', () => {
      const registry = createRouteRegistry();

      registry.register('profile', {
        path: '/profile/:id',
        name: 'Profile',
      });

      expect(registry.has('profile')).toBe(true);
    });

    it('registers_route_withMultipleParams', () => {
      const registry = createRouteRegistry();

      registry.register('post', {
        path: '/users/:userId/posts/:postId',
        name: 'Post',
      });

      expect(registry.has('post')).toBe(true);
    });

    it('registers_route_withMeta', () => {
      const registry = createRouteRegistry();

      registry.register('settings', {
        path: '/settings',
        name: 'Settings',
        requiresAuth: true,
        meta: { icon: 'gear' },
      });

      const route = registry.get('settings');
      expect(route?.requiresAuth).toBe(true);
      expect(route?.meta).toEqual({ icon: 'gear' });
    });
  });

  describe('get', () => {
    it('returns_undefined_whenRouteNotFound', () => {
      const registry = createRouteRegistry();

      expect(registry.get('nonexistent')).toBeUndefined();
    });

    it('returns_definition_whenRouteExists', () => {
      const registry = createRouteRegistry();
      registry.register('home', { path: '/', name: 'Home' });

      expect(registry.get('home')).toEqual({ path: '/', name: 'Home' });
    });
  });

  describe('has', () => {
    it('returns_false_whenRouteNotRegistered', () => {
      const registry = createRouteRegistry();

      expect(registry.has('unknown')).toBe(false);
    });

    it('returns_true_whenRouteRegistered', () => {
      const registry = createRouteRegistry();
      registry.register('home', { path: '/' });

      expect(registry.has('home')).toBe(true);
    });
  });

  describe('getAll', () => {
    it('returns_emptyMap_whenNoRoutes', () => {
      const registry = createRouteRegistry();

      expect(registry.getAll().size).toBe(0);
    });

    it('returns_allRoutes_whenMultipleRegistered', () => {
      const registry = createRouteRegistry();
      registry.register('home', { path: '/' });
      registry.register('profile', { path: '/profile/:id' });
      registry.register('settings', { path: '/settings' });

      const all = registry.getAll();
      expect(all.size).toBe(3);
      expect(all.has('home')).toBe(true);
      expect(all.has('profile')).toBe(true);
      expect(all.has('settings')).toBe(true);
    });
  });

  describe('match', () => {
    it('matches_exactPath', () => {
      const registry = createRouteRegistry();
      registry.register('home', { path: '/', name: 'Home' });

      const result = registry.match('/');

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Home');
      expect(result?.path).toBe('/');
      expect(result?.pattern).toBe('/');
    });

    it('matches_pathWithParam', () => {
      const registry = createRouteRegistry();
      registry.register('profile', { path: '/profile/:id', name: 'Profile' });

      const result = registry.match('/profile/123');

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Profile');
      expect(result?.params).toEqual({ id: '123' });
      expect(result?.pattern).toBe('/profile/:id');
    });

    it('matches_pathWithMultipleParams', () => {
      const registry = createRouteRegistry();
      registry.register('post', {
        path: '/users/:userId/posts/:postId',
        name: 'Post',
      });

      const result = registry.match('/users/42/posts/99');

      expect(result).not.toBeNull();
      expect(result?.params).toEqual({ userId: '42', postId: '99' });
    });

    it('parses_queryParams', () => {
      const registry = createRouteRegistry();
      registry.register('search', { path: '/search', name: 'Search' });

      const result = registry.match('/search?q=test&page=1');

      expect(result).not.toBeNull();
      expect(result?.query).toEqual({ q: 'test', page: '1' });
    });

    it('parses_hash', () => {
      const registry = createRouteRegistry();
      registry.register('docs', { path: '/docs', name: 'Docs' });

      const result = registry.match('/docs#section-1');

      expect(result).not.toBeNull();
      expect(result?.hash).toBe('section-1');
    });

    it('handles_fullDeepLink', () => {
      const registry = createRouteRegistry();
      registry.register('profile', { path: '/profile/:id', name: 'Profile' });

      const result = registry.match('myapp://example.com/profile/123?tab=posts#recent');

      expect(result).not.toBeNull();
      expect(result?.params).toEqual({ id: '123' });
      expect(result?.query).toEqual({ tab: 'posts' });
      expect(result?.hash).toBe('recent');
    });

    it('returns_null_whenNoMatch', () => {
      const registry = createRouteRegistry();
      registry.register('home', { path: '/' });

      const result = registry.match('/unknown/path');

      expect(result).toBeNull();
    });

    it('matches_optionalParams', () => {
      const registry = createRouteRegistry();
      registry.register('category', {
        path: '/category/:id?',
        name: 'Category',
      });

      // With param
      const withParam = registry.match('/category/electronics');
      expect(withParam).not.toBeNull();
      expect(withParam?.params.id).toBe('electronics');

      // Without param
      const withoutParam = registry.match('/category');
      expect(withoutParam).not.toBeNull();
      expect(withoutParam?.params.id).toBeUndefined();
    });
  });

  describe('build', () => {
    it('builds_simplePath', () => {
      const registry = createRouteRegistry();
      registry.register('home', { path: '/' });

      expect(registry.build('home')).toBe('/');
    });

    it('builds_pathWithParam', () => {
      const registry = createRouteRegistry();
      registry.register('profile', { path: '/profile/:id' });

      expect(registry.build('profile', { id: '123' })).toBe('/profile/123');
    });

    it('builds_pathWithMultipleParams', () => {
      const registry = createRouteRegistry();
      registry.register('post', { path: '/users/:userId/posts/:postId' });

      const path = registry.build('post', { userId: '42', postId: '99' });
      expect(path).toBe('/users/42/posts/99');
    });

    it('builds_pathWithDefaultParams', () => {
      const registry = createRouteRegistry();
      registry.register('profile', {
        path: '/profile/:id',
        defaultParams: { id: 'me' },
      });

      expect(registry.build('profile')).toBe('/profile/me');
    });

    it('overrides_defaultParams', () => {
      const registry = createRouteRegistry();
      registry.register('profile', {
        path: '/profile/:id',
        defaultParams: { id: 'me' },
      });

      expect(registry.build('profile', { id: '123' })).toBe('/profile/123');
    });

    it('returns_null_whenRouteNotFound', () => {
      const registry = createRouteRegistry();

      expect(registry.build('nonexistent')).toBeNull();
    });

    it('handles_optionalParams', () => {
      const registry = createRouteRegistry();
      registry.register('category', { path: '/category/:id?' });

      // With param
      expect(registry.build('category', { id: 'tech' })).toBe('/category/tech');

      // Without param
      expect(registry.build('category')).toBe('/category');
    });
  });

  describe('unregister', () => {
    it('removes_registeredRoute', () => {
      const registry = createRouteRegistry();
      registry.register('home', { path: '/' });

      registry.unregister('home');

      expect(registry.has('home')).toBe(false);
    });

    it('doesNothing_whenRouteNotFound', () => {
      const registry = createRouteRegistry();

      // Should not throw
      registry.unregister('nonexistent');

      expect(registry.getAll().size).toBe(0);
    });
  });
});
