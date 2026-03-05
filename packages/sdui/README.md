# @rn-toolkit/sdui

Server-Driven UI engine for React Native. Render dynamic UIs from JSON schemas.

## Installation

```bash
npm install @rn-toolkit/sdui @rn-toolkit/primitives @rn-toolkit/theming
```

## Quick Start

```typescript
import { ThemeProvider } from '@rn-toolkit/theming';
import { SDUIRenderer, registerBuiltInComponents } from '@rn-toolkit/sdui';

// Register built-in components (call once at app start)
registerBuiltInComponents();

// Define your schema (typically from server)
const profileSchema = {
  type: 'screen',
  children: [
    { type: 'text', props: { content: 'Welcome', variant: 'title' } },
    {
      type: 'card',
      children: [
        { type: 'text', props: { content: 'Your profile content here' } },
      ],
    },
    {
      type: 'button',
      props: { label: 'Edit Profile' },
      actions: {
        onPress: { type: 'navigate', payload: { to: '/edit-profile' } },
      },
    },
  ],
};

function ProfileScreen() {
  const handleAction = (action) => {
    if (action.type === 'navigate') {
      navigation.navigate(action.payload.to);
    }
  };

  return (
    <ThemeProvider>
      <SDUIRenderer schema={profileSchema} onAction={handleAction} />
    </ThemeProvider>
  );
}
```

## Schema Structure

### SDUISchema (Root)

```typescript
interface SDUISchema {
  type: 'screen';
  id?: string;
  props?: Record<string, unknown>;
  children: SDUINode[];
}
```

### SDUINode (Components)

```typescript
interface SDUINode {
  type: string;           // Component type (e.g., 'text', 'button')
  key?: string;           // React key (auto-generated if not provided)
  props?: Record<string, unknown>;  // Component props
  children?: SDUINode[];  // Nested components
  actions?: Record<string, SDUIAction>;  // Event handlers
}
```

### SDUIAction

```typescript
interface SDUIAction {
  type: 'navigate' | 'api' | 'setState' | 'custom';
  payload?: Record<string, unknown>;
}
```

## Built-in Components

| Type | Maps To | Key Props |
|------|---------|-----------|
| `text` | `Text` | `content`, `variant` |
| `button` | `Button` | `label`, `variant`, `size` |
| `card` | `Card` | `variant` |
| `stack` | `VStack/HStack` | `direction`, `spacing` |
| `vstack` | `VStack` | `spacing`, `align` |
| `hstack` | `HStack` | `spacing`, `align` |
| `container` | `Container` | `padding`, `maxWidth` |
| `input` | `Input` | `label`, `placeholder` |
| `divider` | `Divider` | `variant` |
| `image` | `Image` | `uri`, `variant`, `size` |

## Custom Components

Register your own components:

```typescript
import { ComponentRegistry } from '@rn-toolkit/sdui';

// Register a custom component
ComponentRegistry.register('myCustomCard', MyCustomCard, {
  // Optional default props
  elevation: 2,
});

// Now use in schema
const schema = {
  type: 'screen',
  children: [
    { type: 'myCustomCard', props: { title: 'Hello' } },
  ],
};
```

## Action Handling

Actions are triggered by events (like `onPress`):

```typescript
const schema = {
  type: 'screen',
  children: [
    {
      type: 'button',
      props: { label: 'Go Home' },
      actions: {
        onPress: {
          type: 'navigate',
          payload: { to: '/home', params: { id: '123' } },
        },
      },
    },
  ],
};

function Screen() {
  const handleAction = (action) => {
    switch (action.type) {
      case 'navigate':
        navigation.navigate(action.payload.to, action.payload.params);
        break;
      case 'api':
        fetch(action.payload.endpoint);
        break;
      case 'custom':
        // Handle custom actions
        break;
    }
  };

  return <SDUIRenderer schema={schema} onAction={handleAction} />;
}
```

## Example: Linktree Profile

```typescript
const linktreeProfileSchema = {
  type: 'screen',
  id: 'profile',
  children: [
    {
      type: 'vstack',
      props: { spacing: 'md', align: 'center' },
      children: [
        {
          type: 'image',
          props: { uri: 'https://...', variant: 'avatar', size: 96 },
        },
        { type: 'text', props: { content: '@username', variant: 'title' } },
        { type: 'text', props: { content: 'Bio goes here', variant: 'caption' } },
        { type: 'divider' },
        {
          type: 'vstack',
          props: { spacing: 'sm' },
          children: [
            {
              type: 'card',
              props: { variant: 'elevated' },
              children: [
                { type: 'text', props: { content: 'My Website' } },
              ],
              actions: {
                onPress: { type: 'custom', payload: { action: 'openLink', url: 'https://...' } },
              },
            },
            {
              type: 'card',
              props: { variant: 'elevated' },
              children: [
                { type: 'text', props: { content: 'My Twitter' } },
              ],
              actions: {
                onPress: { type: 'custom', payload: { action: 'openLink', url: 'https://...' } },
              },
            },
          ],
        },
      ],
    },
  ],
};
```

## Testing

```typescript
import { renderWithTheme } from '@rn-toolkit/testing';
import { SDUIRenderer, registerBuiltInComponents } from '@rn-toolkit/sdui';

beforeAll(() => {
  registerBuiltInComponents();
});

describe('Profile SDUI', () => {
  it('renders schema correctly', () => {
    const { getByText } = renderWithTheme(
      <SDUIRenderer schema={profileSchema} />
    );

    expect(getByText('Welcome')).toBeTruthy();
  });
});
```

## API Reference

### SDUIRenderer

| Prop | Type | Description |
|------|------|-------------|
| `schema` | `SDUISchema` | The schema to render |
| `onAction` | `ActionHandler` | Custom action handler |
| `testID` | `string` | Test ID for root container |

### ComponentRegistry

| Method | Description |
|--------|-------------|
| `register(type, component, defaultProps?)` | Register a component |
| `get(type)` | Get a registered component |
| `has(type)` | Check if type is registered |
| `unregister(type)` | Remove a component |
| `getRegisteredTypes()` | List all registered types |
| `clear()` | Clear all registrations |
