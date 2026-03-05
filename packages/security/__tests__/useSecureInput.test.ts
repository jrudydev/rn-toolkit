import { renderHook, act } from '@testing-library/react-native';
import { useSecureInput } from '../src/hooks/useSecureInput';

describe('useSecureInput', () => {
  describe('basic functionality', () => {
    it('initializes_with_empty_value', () => {
      const { result } = renderHook(() => useSecureInput());

      expect(result.current.value).toBe('');
      expect(result.current.sanitizedValue).toBe('');
    });

    it('initializes_with_provided_value', () => {
      const { result } = renderHook(() =>
        useSecureInput({ initialValue: 'hello' })
      );

      expect(result.current.value).toBe('hello');
    });

    it('updates_value_on_change', () => {
      const { result } = renderHook(() => useSecureInput());

      act(() => {
        result.current.onChange('new value');
      });

      expect(result.current.value).toBe('new value');
    });

    it('clears_value', () => {
      const { result } = renderHook(() =>
        useSecureInput({ initialValue: 'hello' })
      );

      act(() => {
        result.current.clear();
      });

      expect(result.current.value).toBe('');
    });
  });

  describe('max length', () => {
    it('truncates_value_at_max_length', () => {
      const { result } = renderHook(() =>
        useSecureInput({ maxLength: 5 })
      );

      act(() => {
        result.current.onChange('hello world');
      });

      expect(result.current.value).toBe('hello');
    });

    it('allows_values_under_max_length', () => {
      const { result } = renderHook(() =>
        useSecureInput({ maxLength: 10 })
      );

      act(() => {
        result.current.onChange('hello');
      });

      expect(result.current.value).toBe('hello');
    });
  });

  describe('text sanitization', () => {
    it('sanitizes_html_tags', () => {
      const { result } = renderHook(() =>
        useSecureInput({ sanitizer: 'text' })
      );

      act(() => {
        result.current.onChange('<script>alert("xss")</script>Hello');
      });

      expect(result.current.sanitizedValue).toBe('Hello');
    });

    it('keeps_raw_value_with_tags', () => {
      const { result } = renderHook(() =>
        useSecureInput({ sanitizer: 'text' })
      );

      act(() => {
        result.current.onChange('<p>Hello</p>');
      });

      expect(result.current.value).toBe('<p>Hello</p>');
      expect(result.current.sanitizedValue).toBe('Hello');
    });
  });

  describe('email sanitization', () => {
    it('normalizes_email', () => {
      const { result } = renderHook(() =>
        useSecureInput({ sanitizer: 'email' })
      );

      act(() => {
        result.current.onChange('  USER@EXAMPLE.COM  ');
      });

      expect(result.current.sanitizedValue).toBe('user@example.com');
    });

    it('marks_valid_email_as_valid', () => {
      const { result } = renderHook(() =>
        useSecureInput({ sanitizer: 'email' })
      );

      act(() => {
        result.current.onChange('test@example.com');
      });

      expect(result.current.isValid).toBe(true);
    });

    it('marks_invalid_email_as_invalid', () => {
      const { result } = renderHook(() =>
        useSecureInput({ sanitizer: 'email' })
      );

      act(() => {
        result.current.onChange('not-an-email');
      });

      expect(result.current.isValid).toBe(false);
    });
  });

  describe('url sanitization', () => {
    it('normalizes_url', () => {
      const { result } = renderHook(() =>
        useSecureInput({ sanitizer: 'url' })
      );

      act(() => {
        result.current.onChange('https://example.com');
      });

      expect(result.current.sanitizedValue).toBe('https://example.com/');
    });

    it('marks_valid_url_as_valid', () => {
      const { result } = renderHook(() =>
        useSecureInput({ sanitizer: 'url' })
      );

      act(() => {
        result.current.onChange('https://example.com');
      });

      expect(result.current.isValid).toBe(true);
    });

    it('marks_invalid_url_as_invalid', () => {
      const { result } = renderHook(() =>
        useSecureInput({ sanitizer: 'url' })
      );

      act(() => {
        result.current.onChange('javascript:alert(1)');
      });

      expect(result.current.isValid).toBe(false);
    });
  });

  describe('isValid for non-validating sanitizers', () => {
    it('returns_true_for_text_sanitizer', () => {
      const { result } = renderHook(() =>
        useSecureInput({ sanitizer: 'text' })
      );

      act(() => {
        result.current.onChange('any text');
      });

      expect(result.current.isValid).toBe(true);
    });

    it('returns_true_for_empty_value', () => {
      const { result } = renderHook(() =>
        useSecureInput({ sanitizer: 'email' })
      );

      expect(result.current.isValid).toBe(true);
    });
  });
});
