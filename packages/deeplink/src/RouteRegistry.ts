/**
 * Route Registry
 *
 * Manages route definitions and provides path matching/building.
 */

import type {
  RouteDefinition,
  RouteParams,
  ParsedRoute,
  RouteRegistry as IRouteRegistry,
} from './types';

/**
 * Parse a path pattern into segments
 */
function parsePattern(pattern: string): { segments: string[]; paramNames: string[]; optionalParams: Set<string> } {
  const segments = pattern.split('/').filter(Boolean);
  const paramNames: string[] = [];
  const optionalParams = new Set<string>();

  for (const segment of segments) {
    if (segment.startsWith(':')) {
      let paramName = segment.slice(1);
      const isOptional = paramName.endsWith('?');
      if (isOptional) {
        paramName = paramName.slice(0, -1);
        optionalParams.add(paramName);
      }
      paramNames.push(paramName);
    }
  }

  return { segments, paramNames, optionalParams };
}

/**
 * Match a path against a pattern
 */
function matchPath(
  path: string,
  pattern: string
): { match: boolean; params: RouteParams } {
  const pathSegments = path.split('/').filter(Boolean);
  const { segments: patternSegments, optionalParams } = parsePattern(pattern);

  // Count required segments (non-optional)
  const requiredSegments = patternSegments.filter(seg => {
    if (!seg.startsWith(':')) return true;
    const paramName = seg.slice(1).replace('?', '');
    return !optionalParams.has(paramName);
  });

  // Check length constraints
  if (pathSegments.length < requiredSegments.length) {
    return { match: false, params: {} };
  }
  if (pathSegments.length > patternSegments.length) {
    return { match: false, params: {} };
  }

  const params: RouteParams = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSeg = patternSegments[i];
    const pathSeg = pathSegments[i];

    if (patternSeg.startsWith(':')) {
      // Parameter segment
      let paramName = patternSeg.slice(1);
      const isOptional = paramName.endsWith('?');
      if (isOptional) {
        paramName = paramName.slice(0, -1);
      }

      if (pathSeg !== undefined) {
        params[paramName] = decodeURIComponent(pathSeg);
      } else if (!isOptional) {
        return { match: false, params: {} };
      }
    } else if (patternSeg !== pathSeg) {
      // Literal segment doesn't match
      return { match: false, params: {} };
    }
  }

  return { match: true, params };
}

/**
 * Build a path from a pattern and params
 */
function buildPath(pattern: string, params: RouteParams = {}): string {
  const { segments, optionalParams } = parsePattern(pattern);

  const builtSegments: string[] = [];

  for (const segment of segments) {
    if (segment.startsWith(':')) {
      let paramName = segment.slice(1);
      const isOptional = paramName.endsWith('?');
      if (isOptional) {
        paramName = paramName.slice(0, -1);
      }

      const value = params[paramName];
      if (value === undefined) {
        if (isOptional || optionalParams.has(paramName)) {
          // Skip optional parameter
          continue;
        }
        throw new Error(`Missing required parameter: ${paramName}`);
      }
      builtSegments.push(encodeURIComponent(String(value)));
    } else {
      builtSegments.push(segment);
    }
  }

  return '/' + builtSegments.join('/');
}

/**
 * Parse URL into path, query, and hash
 */
function parseUrl(url: string): { path: string; query: Record<string, string>; hash: string } {
  // Remove scheme if present
  let cleanUrl = url;
  const schemeMatch = url.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//);
  if (schemeMatch) {
    cleanUrl = url.slice(schemeMatch[0].length);
    // Remove host if present
    const hostEnd = cleanUrl.indexOf('/');
    if (hostEnd !== -1) {
      cleanUrl = cleanUrl.slice(hostEnd);
    } else {
      cleanUrl = '/';
    }
  }

  // Extract hash
  let hash = '';
  const hashIndex = cleanUrl.indexOf('#');
  if (hashIndex !== -1) {
    hash = cleanUrl.slice(hashIndex + 1);
    cleanUrl = cleanUrl.slice(0, hashIndex);
  }

  // Extract query
  const query: Record<string, string> = {};
  const queryIndex = cleanUrl.indexOf('?');
  if (queryIndex !== -1) {
    const queryString = cleanUrl.slice(queryIndex + 1);
    cleanUrl = cleanUrl.slice(0, queryIndex);

    for (const pair of queryString.split('&')) {
      const [key, value] = pair.split('=');
      if (key) {
        query[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
      }
    }
  }

  return { path: cleanUrl || '/', query, hash };
}

/**
 * Create a route registry
 */
export function createRouteRegistry(): IRouteRegistry {
  const routes = new Map<string, RouteDefinition>();

  const registry: IRouteRegistry = {
    register<P extends RouteParams>(id: string, definition: RouteDefinition<P>): void {
      routes.set(id, definition as RouteDefinition);
    },

    get(id: string): RouteDefinition | undefined {
      return routes.get(id);
    },

    has(id: string): boolean {
      return routes.has(id);
    },

    getAll(): Map<string, RouteDefinition> {
      return new Map(routes);
    },

    match(pathOrUrl: string): ParsedRoute | null {
      const { path, query, hash } = parseUrl(pathOrUrl);

      // Try to match against all registered routes
      for (const [id, definition] of routes) {
        const { match, params } = matchPath(path, definition.path);
        if (match) {
          return {
            pattern: definition.path,
            path,
            name: definition.name || id,
            params,
            query,
            hash,
          };
        }
      }

      return null;
    },

    build<P extends RouteParams>(id: string, params?: P): string | null {
      const definition = routes.get(id);
      if (!definition) {
        return null;
      }

      const mergedParams = {
        ...definition.defaultParams,
        ...params,
      } as RouteParams;

      return buildPath(definition.path, mergedParams);
    },

    unregister(id: string): void {
      routes.delete(id);
    },
  };

  return registry;
}

/**
 * Default route registry instance
 */
export const defaultRegistry = createRouteRegistry();
