# @rn-toolkit/primitives

Theme-aware UI primitives for React Native. All components automatically adapt to light/dark modes.

## Installation

```bash
npm install @rn-toolkit/primitives @rn-toolkit/theming
```

## Quick Start

```typescript
import { ThemeProvider } from '@rn-toolkit/theming';
import { Text, Button, Card, VStack } from '@rn-toolkit/primitives';

function App() {
  return (
    <ThemeProvider mode="auto">
      <VStack spacing="md">
        <Text variant="title">Welcome</Text>
        <Card>
          <Text>This is a themed card</Text>
        </Card>
        <Button label="Get Started" onPress={() => {}} />
      </VStack>
    </ThemeProvider>
  );
}
```

## Components

### Text

Themed text with variants.

```typescript
<Text variant="title">Title Text</Text>
<Text variant="subtitle">Subtitle Text</Text>
<Text variant="body">Body Text</Text>
<Text variant="caption">Caption Text</Text>
<Text variant="label">Label Text</Text>
```

**Props:**
- `variant` - `'title' | 'subtitle' | 'body' | 'caption' | 'label'` (default: `'body'`)
- `color` - Override text color (uses theme colors by default)
- All standard `Text` props from React Native

### Button

Themed button with variants.

```typescript
<Button label="Primary" variant="primary" onPress={handlePress} />
<Button label="Secondary" variant="secondary" onPress={handlePress} />
<Button label="Outline" variant="outline" onPress={handlePress} />
<Button label="Ghost" variant="ghost" onPress={handlePress} />
<Button label="Disabled" disabled onPress={handlePress} />
```

**Props:**
- `label` - Button text (required)
- `variant` - `'primary' | 'secondary' | 'outline' | 'ghost'` (default: `'primary'`)
- `size` - `'sm' | 'md' | 'lg'` (default: `'md'`)
- `disabled` - Disable the button
- `loading` - Show loading state
- `onPress` - Press handler (required)

### Card

Themed card container.

```typescript
<Card>
  <Text>Card content</Text>
</Card>

<Card variant="outlined">
  <Text>Outlined card</Text>
</Card>

<Card variant="elevated">
  <Text>Elevated card with shadow</Text>
</Card>
```

**Props:**
- `variant` - `'filled' | 'outlined' | 'elevated'` (default: `'filled'`)
- `padding` - Override padding

### Stack (VStack, HStack)

Layout components for vertical and horizontal stacking.

```typescript
<VStack spacing="md" align="center">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</VStack>

<HStack spacing="sm" justify="space-between">
  <Button label="Cancel" variant="ghost" />
  <Button label="Save" />
</HStack>
```

**Props:**
- `spacing` - Gap between items: `'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `align` - Align items: `'start' | 'center' | 'end' | 'stretch'`
- `justify` - Justify content: `'start' | 'center' | 'end' | 'space-between' | 'space-around'`

### Container

Themed container with padding and optional max width.

```typescript
<Container>
  <Text>Full width content</Text>
</Container>

<Container maxWidth={600} centered>
  <Text>Centered content with max width</Text>
</Container>
```

**Props:**
- `padding` - Override padding
- `maxWidth` - Maximum width in pixels
- `centered` - Center the container horizontally

### Input

Themed text input.

```typescript
<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
/>

<Input
  label="Password"
  secureTextEntry
  value={password}
  onChangeText={setPassword}
  error="Password is required"
/>
```

**Props:**
- `label` - Input label
- `placeholder` - Placeholder text
- `error` - Error message to display
- `disabled` - Disable the input
- All standard `TextInput` props

### Divider

Themed horizontal divider.

```typescript
<Divider />
<Divider variant="thick" />
<Divider color="#FF0000" />
```

**Props:**
- `variant` - `'thin' | 'thick'` (default: `'thin'`)
- `color` - Override divider color

## Theme Integration

All components use the `useTheme()` hook from `@rn-toolkit/theming`. They automatically:

- Adapt colors to light/dark mode
- Use consistent spacing tokens
- Apply proper typography styles
- Support scoped theming

## Testing

Use `@rn-toolkit/testing` for testing primitives:

```typescript
import { renderWithTheme, createThemeSnapshot } from '@rn-toolkit/testing';
import { Button } from '@rn-toolkit/primitives';

describe('Button', () => {
  createThemeSnapshot(<Button label="Click" onPress={() => {}} />);
});
```
