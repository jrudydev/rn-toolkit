# @rn-toolkit/security

Enterprise-grade security utilities for React Native applications.

## Features

- **Secure Storage** - Keychain (iOS) / Keystore (Android) wrapper
- **Input Sanitization** - XSS prevention, HTML stripping, URL validation
- **Schema Validation** - SDUI schema validation with malicious payload detection
- **Secure Components** - Ready-to-use secure input components

## Installation

```bash
npm install @rn-toolkit/security expo-secure-store
```

## Usage

### Secure Storage

Store sensitive data securely using the device's native secure storage.

```typescript
import { SecureStorage } from '@rn-toolkit/security';

// Store a value
await SecureStorage.set('auth_token', 'your-secret-token');

// Retrieve a value
const token = await SecureStorage.get('auth_token');

// Delete a value
await SecureStorage.delete('auth_token');

// Check if a key exists
const exists = await SecureStorage.has('auth_token');

// Store JSON objects
await SecureStorage.setJSON('user', { id: '123', name: 'John' });
const user = await SecureStorage.getJSON('user');
```

### Input Sanitization

Prevent XSS attacks and sanitize user input.

```typescript
import { sanitize } from '@rn-toolkit/security';

// Sanitize text input (removes HTML, scripts)
const cleanText = sanitize.text('<script>alert("xss")</script>Hello');
// Result: "Hello"

// Sanitize HTML (allows safe tags, removes dangerous ones)
const cleanHtml = sanitize.html('<p>Hello</p><script>evil()</script>');
// Result: "<p>Hello</p>"

// Validate and sanitize URLs
const cleanUrl = sanitize.url('javascript:alert("xss")');
// Result: null (invalid)

const validUrl = sanitize.url('https://example.com/path');
// Result: "https://example.com/path"

// Sanitize for SQL (escape special characters)
const safeSql = sanitize.sql("O'Reilly");
// Result: "O''Reilly"

// Sanitize email
const email = sanitize.email('  USER@EXAMPLE.COM  ');
// Result: "user@example.com"
```

### Schema Validation

Validate SDUI schemas before rendering to prevent malicious payloads.

```typescript
import { validateSchema, SchemaValidator } from '@rn-toolkit/security';

// Quick validation
const result = validateSchema(sduiSchema);
if (!result.valid) {
  console.error('Invalid schema:', result.errors);
}

// Create a custom validator with options
const validator = new SchemaValidator({
  allowedTypes: ['text', 'button', 'card', 'stack'],
  maxDepth: 10,
  maxChildren: 100,
  allowCustomActions: false,
});

const customResult = validator.validate(schema);
```

### Secure Components

```typescript
import { SecureTextInput, useSecureInput } from '@rn-toolkit/security';

// Use the secure input component
<SecureTextInput
  label="Password"
  secureTextEntry
  onChangeText={setPassword}
  sanitize="text"
/>

// Or use the hook for custom implementations
function MyInput() {
  const { value, onChange, sanitizedValue } = useSecureInput({
    sanitizer: 'text',
    maxLength: 100,
  });

  return <TextInput value={value} onChangeText={onChange} />;
}
```

## Security Best Practices

1. **Never store plain text passwords** - Use secure storage for tokens only
2. **Always sanitize user input** - Before displaying or sending to backend
3. **Validate schemas** - Before rendering any server-driven UI
4. **Use HTTPS** - Sanitize URLs to ensure only HTTPS is allowed
5. **Implement defense in depth** - Layer multiple security measures

## API Reference

### SecureStorage

| Method | Description |
|--------|-------------|
| `set(key, value)` | Store a string value |
| `get(key)` | Retrieve a string value |
| `delete(key)` | Delete a value |
| `has(key)` | Check if key exists |
| `setJSON(key, obj)` | Store a JSON object |
| `getJSON(key)` | Retrieve a JSON object |
| `clear()` | Clear all stored values |

### sanitize

| Method | Description |
|--------|-------------|
| `text(input)` | Remove all HTML and scripts |
| `html(input)` | Allow safe HTML, remove dangerous tags |
| `url(input)` | Validate and sanitize URLs |
| `sql(input)` | Escape SQL special characters |
| `email(input)` | Normalize and validate email |

### validateSchema

| Option | Description |
|--------|-------------|
| `allowedTypes` | Array of allowed component types |
| `maxDepth` | Maximum nesting depth |
| `maxChildren` | Maximum children per node |
| `allowCustomActions` | Allow custom action types |

## License

Commercial License - Part of @rn-toolkit paid tier.
