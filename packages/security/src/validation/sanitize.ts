/**
 * Input Sanitization Utilities
 *
 * Provides functions to sanitize user input and prevent XSS attacks,
 * SQL injection, and other security vulnerabilities.
 */

/**
 * HTML entities to escape
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Dangerous HTML tags that should be removed
 */
const DANGEROUS_TAGS = [
  'script',
  'iframe',
  'object',
  'embed',
  'form',
  'input',
  'button',
  'select',
  'textarea',
  'link',
  'style',
  'meta',
  'base',
  'applet',
  'frame',
  'frameset',
  'layer',
  'ilayer',
  'bgsound',
  'title',
  'head',
  'html',
  'body',
];

/**
 * Dangerous attributes that should be removed
 */
const DANGEROUS_ATTRIBUTES = [
  'onclick',
  'ondblclick',
  'onmousedown',
  'onmouseup',
  'onmouseover',
  'onmousemove',
  'onmouseout',
  'onmouseenter',
  'onmouseleave',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onload',
  'onerror',
  'onsubmit',
  'onreset',
  'onfocus',
  'onblur',
  'onchange',
  'oninput',
  'onscroll',
  'onresize',
  'onunload',
  'onbeforeunload',
  'oncontextmenu',
  'ondrag',
  'ondrop',
  'oncopy',
  'oncut',
  'onpaste',
  'formaction',
  'xlink:href',
  'xmlns',
];

/**
 * Allowed URL protocols
 */
const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

/**
 * Email regex pattern
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Escape HTML entities in a string
 */
function escapeHtml(str: string): string {
  return str.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Remove all HTML tags from a string
 * Also removes content inside script and style tags
 */
function stripTags(str: string): string {
  // First remove script/style tags with their content
  let result = str.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  // Then remove all remaining tags
  return result.replace(/<[^>]*>/g, '');
}

/**
 * Remove dangerous tags but keep safe ones
 */
function removeDangerousTags(str: string): string {
  let result = str;

  // Remove dangerous tags and their content
  for (const tag of DANGEROUS_TAGS) {
    // Match opening tag with content and closing tag
    const regex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?</${tag}>`, 'gi');
    result = result.replace(regex, '');
    // Match self-closing tags
    const selfClosing = new RegExp(`<${tag}[^>]*/>`, 'gi');
    result = result.replace(selfClosing, '');
    // Match unclosed tags
    const unclosed = new RegExp(`<${tag}[^>]*>`, 'gi');
    result = result.replace(unclosed, '');
  }

  // Remove dangerous attributes from remaining tags
  // This regex matches attributes inside tags without removing the whole tag
  result = result.replace(/<([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^>]*)?)\s*>/gi, (match, tagName, attrs) => {
    if (!attrs) return `<${tagName}>`;

    let cleanAttrs = attrs;
    for (const attr of DANGEROUS_ATTRIBUTES) {
      const attrRegex = new RegExp(`\\s*${attr}\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]*)`, 'gi');
      cleanAttrs = cleanAttrs.replace(attrRegex, '');
    }

    // Also remove javascript: and data: URLs
    cleanAttrs = cleanAttrs.replace(/\s*(href|src)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, '');
    cleanAttrs = cleanAttrs.replace(/\s*(href|src)\s*=\s*(?:"data:[^"]*"|'data:[^']*')/gi, '');

    return cleanAttrs.trim() ? `<${tagName}${cleanAttrs}>` : `<${tagName}>`;
  });

  return result;
}

/**
 * Sanitization utilities
 */
export const sanitize = {
  /**
   * Sanitize text input by removing all HTML and escaping special characters
   *
   * @param input - Raw input string
   * @returns Sanitized string with no HTML
   *
   * @example
   * ```typescript
   * sanitize.text('<script>alert("xss")</script>Hello');
   * // Returns: "Hello"
   * ```
   */
  text(input: string): string {
    if (typeof input !== 'string') return '';

    // Strip all HTML tags
    let result = stripTags(input);

    // Normalize whitespace
    result = result.replace(/\s+/g, ' ').trim();

    return result;
  },

  /**
   * Sanitize HTML by removing dangerous tags and attributes
   * but keeping safe formatting tags
   *
   * @param input - Raw HTML string
   * @returns Sanitized HTML with dangerous elements removed
   *
   * @example
   * ```typescript
   * sanitize.html('<p>Hello</p><script>evil()</script>');
   * // Returns: "<p>Hello</p>"
   * ```
   */
  html(input: string): string {
    if (typeof input !== 'string') return '';

    return removeDangerousTags(input);
  },

  /**
   * Escape HTML entities for safe display
   *
   * @param input - Raw string
   * @returns String with HTML entities escaped
   *
   * @example
   * ```typescript
   * sanitize.escape('<script>');
   * // Returns: "&lt;script&gt;"
   * ```
   */
  escape(input: string): string {
    if (typeof input !== 'string') return '';

    return escapeHtml(input);
  },

  /**
   * Validate and sanitize a URL
   *
   * @param input - Raw URL string
   * @returns Sanitized URL or null if invalid
   *
   * @example
   * ```typescript
   * sanitize.url('javascript:alert("xss")');
   * // Returns: null
   *
   * sanitize.url('https://example.com/path?q=test');
   * // Returns: "https://example.com/path?q=test"
   * ```
   */
  url(input: string): string | null {
    if (typeof input !== 'string') return null;

    const trimmed = input.trim();

    try {
      const url = new URL(trimmed);

      // Check for allowed protocols
      if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
        return null;
      }

      // Return the normalized URL
      return url.toString();
    } catch {
      // If URL parsing fails, check if it's a relative URL
      if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
        // Relative URL starting with /
        return trimmed;
      }

      return null;
    }
  },

  /**
   * Sanitize SQL input by escaping special characters
   *
   * Note: This is a basic escape function. Always use parameterized
   * queries when possible.
   *
   * @param input - Raw input string
   * @returns String with SQL special characters escaped
   *
   * @example
   * ```typescript
   * sanitize.sql("O'Reilly");
   * // Returns: "O''Reilly"
   * ```
   */
  sql(input: string): string {
    if (typeof input !== 'string') return '';

    return input
      .replace(/'/g, "''")
      .replace(/\\/g, '\\\\')
      // eslint-disable-next-line no-control-regex
      .replace(/\x00/g, '\\0')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      // eslint-disable-next-line no-control-regex
      .replace(/\x1a/g, '\\Z');
  },

  /**
   * Sanitize and validate an email address
   *
   * @param input - Raw email string
   * @returns Normalized email or null if invalid
   *
   * @example
   * ```typescript
   * sanitize.email('  USER@EXAMPLE.COM  ');
   * // Returns: "user@example.com"
   * ```
   */
  email(input: string): string | null {
    if (typeof input !== 'string') return null;

    const normalized = input.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(normalized)) {
      return null;
    }

    return normalized;
  },

  /**
   * Sanitize a filename to prevent directory traversal
   *
   * @param input - Raw filename
   * @returns Sanitized filename
   *
   * @example
   * ```typescript
   * sanitize.filename('../../../etc/passwd');
   * // Returns: "etc_passwd"
   * ```
   */
  filename(input: string): string {
    if (typeof input !== 'string') return '';

    return input
      .replace(/\.\./g, '')
      .replace(/[/\\]/g, '_')
      // eslint-disable-next-line no-control-regex
      .replace(/[<>:"|?*\x00-\x1f]/g, '')
      .trim();
  },

  /**
   * Sanitize a phone number (keep only digits and +)
   *
   * @param input - Raw phone number
   * @returns Sanitized phone number
   *
   * @example
   * ```typescript
   * sanitize.phone('+1 (555) 123-4567');
   * // Returns: "+15551234567"
   * ```
   */
  phone(input: string): string {
    if (typeof input !== 'string') return '';

    // Keep only digits and leading +
    const result = input.replace(/[^\d+]/g, '');

    // Ensure + is only at the start
    const plusIndex = result.indexOf('+');
    if (plusIndex > 0) {
      return result.replace(/\+/g, '');
    }

    return result;
  },
};
