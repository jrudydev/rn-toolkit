# @astacinco/rn-primitives

Theme-aware UI primitives for React Native. All components automatically adapt to light/dark modes.

## Installation

```bash
npm install @astacinco/rn-primitives @astacinco/rn-theming
```

## Quick Start

```typescript
import { ThemeProvider } from '@astacinco/rn-theming';
import { Text, Button, Card, VStack } from '@astacinco/rn-primitives';

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

### Switch

Themed toggle switch.

```typescript
<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
/>

<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  label="Enable notifications"
  labelPosition="right"
  size="lg"
/>
```

**Props:**
- `value` - Current switch state (required)
- `onValueChange` - Callback when toggled (required)
- `label` - Optional label text
- `labelPosition` - `'left' | 'right'` (default: `'right'`)
- `size` - `'sm' | 'md' | 'lg'` (default: `'md'`)
- `disabled` - Disable the switch
- `activeColor` - Override active track color
- `inactiveColor` - Override inactive track color

### Avatar

User avatar with image or fallback initials.

```typescript
// With image
<Avatar
  source={{ uri: 'https://example.com/photo.jpg' }}
  size="md"
/>

// With fallback initials
<Avatar
  fallback="John Doe"
  size="lg"
/>
```

**Props:**
- `source` - Image source (same as RN Image)
- `fallback` - Name to generate initials from
- `size` - `'xs' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
- `rounded` - Circular shape (default: `true`)
- `borderWidth` - Border width in pixels
- `customSize` - Override size with exact pixels

### Badge

Notification badge, positioned on children or standalone.

```typescript
// Count badge on avatar
<Badge count={5} position="top-right">
  <Avatar source={...} />
</Badge>

// Dot badge
<Badge dot variant="error">
  <Icon name="bell" />
</Badge>

// Standalone badge
<Badge count={99} maxCount={99} standalone />
```

**Props:**
- `count` - Number to display
- `dot` - Show as dot instead of count
- `variant` - `'default' | 'primary' | 'error' | 'success' | 'warning'`
- `position` - `'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'`
- `size` - `'sm' | 'md' | 'lg'`
- `maxCount` - Max number before showing "99+"
- `showZero` - Show badge when count is 0
- `standalone` - Render without positioning on children
- `offset` - `[x, y]` fine-tune position

### Tag

Inline label for categories, status, or attributes.

```typescript
// Basic usage
<Tag label="New" />

// With color
<Tag label="Success" color="success" />
<Tag label="Warning" color="warning" />
<Tag label="Error" color="error" />

// Filled variant
<Tag label="Active" color="primary" variant="filled" />

// Sizes
<Tag label="Small" size="sm" />
<Tag label="Large" size="lg" />
```

**Props:**
- `label` - Tag text (required)
- `color` - `'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'`
- `variant` - `'outlined' | 'filled'` (default: `'outlined'`)
- `size` - `'sm' | 'md' | 'lg'` (default: `'md'`)

### Timer

Countdown timer with controls.

```typescript
// Basic timer
<Timer durationMinutes={5} />

// With callbacks
<Timer
  durationMinutes={90}
  onStart={() => console.log('Started')}
  onComplete={() => console.log('Done!')}
  onPause={() => console.log('Paused')}
  showProgress
  showControls
/>

// Auto-start timer
<Timer durationMinutes={60} autoStart />
```

**Props:**
- `durationMinutes` - Timer duration in minutes (required)
- `autoStart` - Start automatically (default: `false`)
- `showControls` - Show start/pause/reset buttons (default: `true`)
- `showProgress` - Show progress bar (default: `true`)
- `lowTimeThreshold` - Seconds remaining for low-time warning (default: `300`)
- `onStart` - Callback when timer starts
- `onPause` - Callback when timer pauses
- `onReset` - Callback when timer resets
- `onComplete` - Callback when timer reaches zero
- `onTick` - Callback each second with remaining time

### Tabs

Horizontal tab selector.

```typescript
const options = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

<Tabs
  options={options}
  selected={selectedTab}
  onSelect={setSelectedTab}
/>

// Variants
<Tabs options={options} selected={tab} onSelect={setTab} variant="pills" />
<Tabs options={options} selected={tab} onSelect={setTab} variant="outlined" />
<Tabs options={options} selected={tab} onSelect={setTab} variant="filled" />

// Sizes
<Tabs options={options} selected={tab} onSelect={setTab} size="sm" />
<Tabs options={options} selected={tab} onSelect={setTab} size="lg" />
```

**Props:**
- `options` - Array of `{ value: T, label: string }` (required)
- `selected` - Currently selected value (required)
- `onSelect` - Callback when tab is selected (required)
- `variant` - `'pills' | 'outlined' | 'filled'` (default: `'pills'`)
- `size` - `'sm' | 'md' | 'lg'` (default: `'md'`)
- `scrollable` - Enable horizontal scrolling (default: `true`)

### MarkdownViewer

Render markdown content with theme styling.

```typescript
<MarkdownViewer content="# Hello\n\nThis is **bold** text." />
```

**Props:**
- `content` - Markdown string to render (required)
- `style` - Override container style

**Note:** Requires `react-native-markdown-display` as an optional peer dependency. Falls back to plain text if not installed.

## Theme Integration

All components use the `useTheme()` hook from `@astacinco/rn-theming`. They automatically:

- Adapt colors to light/dark mode
- Use consistent spacing tokens
- Apply proper typography styles
- Support scoped theming

## Testing

Use `@astacinco/rn-testing` for testing primitives:

```typescript
import { renderWithTheme, createThemeSnapshot } from '@astacinco/rn-testing';
import { Button } from '@astacinco/rn-primitives';

describe('Button', () => {
  createThemeSnapshot(<Button label="Click" onPress={() => {}} />);
});
```
