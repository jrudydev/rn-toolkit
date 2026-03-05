import { sanitize } from '../src/validation/sanitize';

describe('sanitize', () => {
  describe('text', () => {
    it('removes_HTML_tags', () => {
      expect(sanitize.text('<p>Hello</p>')).toBe('Hello');
    });

    it('removes_script_tags', () => {
      expect(sanitize.text('<script>alert("xss")</script>Hello')).toBe('Hello');
    });

    it('removes_nested_tags', () => {
      expect(sanitize.text('<div><p>Hello</p></div>')).toBe('Hello');
    });

    it('normalizes_whitespace', () => {
      expect(sanitize.text('Hello    World')).toBe('Hello World');
    });

    it('trims_whitespace', () => {
      expect(sanitize.text('  Hello  ')).toBe('Hello');
    });

    it('handles_empty_string', () => {
      expect(sanitize.text('')).toBe('');
    });

    it('handles_non_string_input', () => {
      // @ts-expect-error - testing invalid input
      expect(sanitize.text(null)).toBe('');
      // @ts-expect-error - testing invalid input
      expect(sanitize.text(undefined)).toBe('');
      // @ts-expect-error - testing invalid input
      expect(sanitize.text(123)).toBe('');
    });
  });

  describe('html', () => {
    it('keeps_safe_tags', () => {
      expect(sanitize.html('<p>Hello</p>')).toBe('<p>Hello</p>');
    });

    it('removes_script_tags', () => {
      expect(sanitize.html('<p>Hello</p><script>evil()</script>')).toBe('<p>Hello</p>');
    });

    it('removes_iframe_tags', () => {
      expect(sanitize.html('<p>Hello</p><iframe src="evil.com"></iframe>')).toBe('<p>Hello</p>');
    });

    it('removes_onclick_attributes', () => {
      // Note: button is in dangerous tags list, so it gets removed entirely
      // Use a safe tag like <div> to test attribute removal
      expect(sanitize.html('<div onclick="evil()">Click</div>')).toBe('<div>Click</div>');
    });

    it('removes_onerror_attributes', () => {
      expect(sanitize.html('<img onerror="evil()" src="x">')).toBe('<img src="x">');
    });

    it('removes_button_tags', () => {
      // Buttons are considered dangerous (form injection)
      expect(sanitize.html('<button onclick="evil()">Click</button>')).toBe('');
    });

    it('removes_javascript_urls', () => {
      const input = '<a href="javascript:alert(1)">Click</a>';
      expect(sanitize.html(input)).not.toContain('javascript:');
    });

    it('handles_empty_string', () => {
      expect(sanitize.html('')).toBe('');
    });
  });

  describe('escape', () => {
    it('escapes_less_than', () => {
      expect(sanitize.escape('<')).toBe('&lt;');
    });

    it('escapes_greater_than', () => {
      expect(sanitize.escape('>')).toBe('&gt;');
    });

    it('escapes_ampersand', () => {
      expect(sanitize.escape('&')).toBe('&amp;');
    });

    it('escapes_quotes', () => {
      expect(sanitize.escape('"')).toBe('&quot;');
      expect(sanitize.escape("'")).toBe('&#x27;');
    });

    it('escapes_multiple_characters', () => {
      expect(sanitize.escape('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      );
    });
  });

  describe('url', () => {
    it('allows_https_urls', () => {
      expect(sanitize.url('https://example.com')).toBe('https://example.com/');
    });

    it('allows_http_urls', () => {
      expect(sanitize.url('http://example.com')).toBe('http://example.com/');
    });

    it('allows_mailto_urls', () => {
      expect(sanitize.url('mailto:test@example.com')).toBe('mailto:test@example.com');
    });

    it('allows_tel_urls', () => {
      expect(sanitize.url('tel:+1234567890')).toBe('tel:+1234567890');
    });

    it('blocks_javascript_urls', () => {
      expect(sanitize.url('javascript:alert(1)')).toBeNull();
    });

    it('blocks_data_urls', () => {
      expect(sanitize.url('data:text/html,<script>alert(1)</script>')).toBeNull();
    });

    it('blocks_file_urls', () => {
      expect(sanitize.url('file:///etc/passwd')).toBeNull();
    });

    it('allows_relative_urls', () => {
      expect(sanitize.url('/path/to/page')).toBe('/path/to/page');
    });

    it('returns_null_for_invalid_urls', () => {
      expect(sanitize.url('not a url')).toBeNull();
    });

    it('handles_empty_string', () => {
      expect(sanitize.url('')).toBeNull();
    });
  });

  describe('sql', () => {
    it('escapes_single_quotes', () => {
      expect(sanitize.sql("O'Reilly")).toBe("O''Reilly");
    });

    it('escapes_backslashes', () => {
      expect(sanitize.sql('path\\to\\file')).toBe('path\\\\to\\\\file');
    });

    it('escapes_newlines', () => {
      expect(sanitize.sql('line1\nline2')).toBe('line1\\nline2');
    });

    it('handles_empty_string', () => {
      expect(sanitize.sql('')).toBe('');
    });

    it('handles_normal_text', () => {
      expect(sanitize.sql('normal text')).toBe('normal text');
    });
  });

  describe('email', () => {
    it('normalizes_email', () => {
      expect(sanitize.email('  USER@EXAMPLE.COM  ')).toBe('user@example.com');
    });

    it('validates_valid_email', () => {
      expect(sanitize.email('test@example.com')).toBe('test@example.com');
    });

    it('returns_null_for_invalid_email', () => {
      expect(sanitize.email('not-an-email')).toBeNull();
    });

    it('returns_null_for_email_without_domain', () => {
      expect(sanitize.email('test@')).toBeNull();
    });

    it('returns_null_for_email_without_at', () => {
      expect(sanitize.email('test.example.com')).toBeNull();
    });

    it('handles_empty_string', () => {
      expect(sanitize.email('')).toBeNull();
    });
  });

  describe('filename', () => {
    it('removes_directory_traversal', () => {
      // Double dots are removed, slashes become underscores
      expect(sanitize.filename('../../../etc/passwd')).toBe('___etc_passwd');
    });

    it('replaces_slashes_with_underscores', () => {
      expect(sanitize.filename('path/to/file.txt')).toBe('path_to_file.txt');
    });

    it('removes_dangerous_characters', () => {
      expect(sanitize.filename('file<>:"|?*.txt')).toBe('file.txt');
    });

    it('handles_normal_filename', () => {
      expect(sanitize.filename('document.pdf')).toBe('document.pdf');
    });
  });

  describe('phone', () => {
    it('removes_formatting', () => {
      expect(sanitize.phone('+1 (555) 123-4567')).toBe('+15551234567');
    });

    it('keeps_leading_plus', () => {
      expect(sanitize.phone('+1234567890')).toBe('+1234567890');
    });

    it('removes_plus_if_not_leading', () => {
      expect(sanitize.phone('123+456+789')).toBe('123456789');
    });

    it('handles_digits_only', () => {
      expect(sanitize.phone('1234567890')).toBe('1234567890');
    });
  });
});
