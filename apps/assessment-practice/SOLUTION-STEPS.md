# Link Management Assessment - Step-by-Step Solution

Work through each step. Test before moving on.

---

## Challenge Requirements Map

| Step | Challenge Requirement |
|------|----------------------|
| 5-6 | **Core Task 1:** Link List Display |
| 6-7 | **Core Task 2:** Toggle Link Visibility |
| 8 | **Core Task 3:** Link Count with Pluralization |
| 13-15 | **Core Task 4:** Add Link |
| 9-11 | **Required Challenge:** Debounced Search |
| 12 | **Required Challenge:** Dark Mode Toggle |
| 16-17 | **Bonus:** Form Validation |
| 18-19 | **Bonus:** Loading States |
| 20 | **Bonus:** Empty States |

---

## Setup Steps

### Step 1: Verify project runs
```bash
npx expo start
```
**Test:** App loads without errors

---

### Step 2: Add ThemeProvider wrapper
```tsx
import { ThemeProvider } from '@astacinco/rn-theming';

export default function App() {
  return (
    <ThemeProvider mode="auto">
      <LinkManagementScreen />
    </ThemeProvider>
  );
}
```
**Test:** App renders, no errors

---

### Step 3: Add I18nProvider wrapper
```tsx
import { I18nProvider, ConsoleAdapter } from '@astacinco/rn-i18n';
import { en, es } from './i18n/en';

const i18nAdapter = new ConsoleAdapter({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es'],
  resources: { en, es },
});

export default function App() {
  return (
    <ThemeProvider mode="auto">
      <I18nProvider adapter={i18nAdapter}>
        <LinkManagementScreen />
      </I18nProvider>
    </ThemeProvider>
  );
}
```
**Test:** Console logs locale on load

---

### Step 4: Import primitives and layout components

**4a. Import React Native layout components:**
```tsx
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
```

**4b. Import primitives:**
```tsx
import {
  Text, Button, Card, VStack, HStack,
  Container, Input, Divider, Switch
} from '@astacinco/rn-primitives';
```

**Test:** No import errors

---

## Core Tasks

### Step 5: Display mock links as Card list

**5a. Create LinkCard interface and component:**
```tsx
interface LinkCardProps {
  link: Link;
  onToggle: (id: string) => void;
}

function LinkCard({ link, onToggle }: LinkCardProps) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated">
      <VStack spacing="xs">
        <Text variant="subtitle">{link.title}</Text>
        <Text variant="caption" color={colors.textMuted}>{link.url}</Text>
        <Text variant="caption" color={colors.textSecondary}>
          {link.clicks} clicks
        </Text>
      </VStack>
    </Card>
  );
}
```

**5b. Create LinkManagementScreen with no-op handler:**
```tsx
function LinkManagementScreen() {
  const { colors, mode } = useTheme();
  const [links, setLinks] = useState<Link[]>(mockLinks);

  // No-op placeholder - implement in Step 7
  const handleToggle = (_id: string) => {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={mode === 'light' ? 'dark' : 'light'} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <VStack spacing="md">
          {links.map(link => (
            <LinkCard key={link.id} link={link} onToggle={handleToggle} />
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
```

**Structure explained:**
- `SafeAreaView` - keeps content away from notch/home bar
- `StatusBar` - adapts to theme (dark icons on light, light icons on dark)
- `ScrollView` - allows scrolling when links overflow screen
- `VStack` - vertical layout for the link cards

**Test:** See 8 link cards displayed, scrollable

---

### Step 6: Add Switch to each card

Update LinkCard to include Switch and HStack layout:
```tsx
function LinkCard({ link, onToggle }: LinkCardProps) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated" style={{ opacity: link.enabled ? 1 : 0.5 }}>
      <HStack spacing="md" justify="space-between" align="center">
        <VStack spacing="xs" style={{ flex: 1 }}>
          <Text variant="subtitle">{link.title}</Text>
          <Text variant="caption" color={colors.textMuted}>{link.url}</Text>
          <Text variant="caption" color={colors.textSecondary}>
            {link.clicks} clicks
          </Text>
        </VStack>
        <Switch value={link.enabled} onValueChange={() => onToggle(link.id)} />
      </HStack>
    </Card>
  );
}
```

**Test:**
- Switches visible on right side
- Tapping does nothing yet (no-op)
- Disabled cards show 50% opacity

---

### Step 7: Implement handleToggle

Replace the no-op with real implementation:
```tsx
const handleToggle = (id: string) => {
  setLinks(prev =>
    prev.map(link =>
      link.id === id ? { ...link, enabled: !link.enabled } : link
    )
  );
};
```

**How it works:**
1. `prev.map()` - iterate all links
2. `link.id === id` - find the toggled one
3. `{ ...link, enabled: !link.enabled }` - flip enabled
4. Others return unchanged

**Test:** Tap switch → opacity toggles

---

### Step 8: Add link count with pluralization

**8a. Get translation hook:**
```tsx
const { t, tp } = useTranslation();
```

**8b. Wrap content in Container and add count text above links:**
```tsx
<Container>
  <VStack spacing="lg">
    <Text variant="caption" color={colors.textSecondary}>
      {tp('links.showing', links.length, { total: links.length })}
    </Text>

    <Divider />

    <VStack spacing="md">
      {links.map(link => (
        <LinkCard key={link.id} link={link} onToggle={handleToggle} />
      ))}
    </VStack>
  </VStack>
</Container>
```

**Note:** Container provides a single root element and consistent padding.

**Test:** Shows "Showing 8 of 8 links"

---

## Required Challenges

### Step 9: Add search Input

**9a. Add search state:**
```tsx
const [searchText, setSearchText] = useState('');
```

**9b. Add Input above count:**
```tsx
<Input
  value={searchText}
  onChangeText={setSearchText}
  placeholder={t('common.search')}
/>

<Text variant="caption" color={colors.textSecondary}>
  {tp('links.showing', links.length, { total: links.length })}
</Text>
```

**Test:** Input appears, you can type (no filtering yet)

---

### Step 10: Add useDebounce hook

```tsx
import { useDebounce } from '@astacinco/rn-performance';

// In component:
const debouncedSearch = useDebounce(searchText, 300);
```

**Test:** No errors (filtering comes next)

---

### Step 11: Filter links based on debounced search

**11a. Create filtered list:**
```tsx
const filteredLinks = links.filter(link =>
  link.title.toLowerCase().includes(debouncedSearch.toLowerCase())
);
```

**11b. Update count and list to use filteredLinks:**
```tsx
<Text variant="caption" color={colors.textSecondary}>
  {tp('links.showing', filteredLinks.length, { total: links.length })}
</Text>

<Divider />

<VStack spacing="md">
  {filteredLinks.map(link => (
    <LinkCard key={link.id} link={link} onToggle={handleToggle} />
  ))}
</VStack>
```

**Test:**
- Type "pod" → 300ms delay → shows only "Podcast"
- Count updates to "1 of 8 links"
- Clear search → all 8 return

---

### Step 12: Add theme toggle button

**12a. Get setMode from useTheme:**
```tsx
const { colors, mode, setMode } = useTheme();
```

**12b. Add header with title and toggle:**
```tsx
<HStack justify="space-between" align="center">
  <Text variant="title">{t('links.title')}</Text>
  <Button
    label={mode === 'light' ? '🌙' : '☀️'}
    variant="outline"
    size="sm"
    onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
  />
</HStack>
```

**Test:** Tap button → theme switches light/dark

---

## Add Link Feature

### Step 13: Add + button and showAddForm state

**13a. Add state:**
```tsx
const [showAddForm, setShowAddForm] = useState(false);
```

**13b. Add + button next to theme toggle:**
```tsx
<HStack justify="space-between" align="center">
  <Text variant="title">{t('links.title')}</Text>
  <HStack spacing="sm">
    <Button
      label="+"
      variant="primary"
      size="sm"
      onPress={() => setShowAddForm(true)}
    />
    <Button
      label={mode === 'light' ? '🌙' : '☀️'}
      variant="outline"
      size="sm"
      onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
    />
  </HStack>
</HStack>
```

**Test:** + button visible (form comes next)

---

### Step 14: Create AddLinkForm component

```tsx
interface AddLinkFormProps {
  onAdd: (title: string, url: string) => void;
  onCancel: () => void;
}

function AddLinkForm({ onAdd, onCancel }: AddLinkFormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (title.trim() && url.trim()) {
      onAdd(title.trim(), url.trim());
      setTitle('');
      setUrl('');
    }
  };

  return (
    <Card variant="outlined">
      <VStack spacing="md">
        <Text variant="subtitle">{t('links.addLink')}</Text>
        <Input
          value={title}
          onChangeText={setTitle}
          placeholder={t('links.linkTitle')}
          label={t('links.linkTitle')}
        />
        <Input
          value={url}
          onChangeText={setUrl}
          placeholder={t('links.linkUrl')}
          label={t('links.linkUrl')}
        />
        <HStack spacing="sm" justify="end">
          <Button
            label={t('common.cancel')}
            variant="outline"
            size="sm"
            onPress={onCancel}
          />
          <Button
            label={t('common.add')}
            variant="primary"
            size="sm"
            onPress={handleSubmit}
          />
        </HStack>
      </VStack>
    </Card>
  );
}
```

**Render conditionally in LinkManagementScreen:**
```tsx
{showAddForm && (
  <AddLinkForm
    onAdd={handleAddLink}
    onCancel={() => setShowAddForm(false)}
  />
)}
```

**Note:** handleAddLink is a no-op for now:
```tsx
const handleAddLink = (_title: string, _url: string) => {};
```

**Test:** Tap + → form appears with inputs and buttons

---

### Step 15: Implement handleAddLink

Replace no-op with real implementation:
```tsx
const handleAddLink = (title: string, url: string) => {
  const newLink = createLink(title, url);
  setLinks(prev => [...prev, newLink]);
  setShowAddForm(false);
};
```

**Test:**
- Fill form → tap Add
- New link appears at bottom
- Form closes
- Count updates to "9 of 9 links"

---

## Bonus Challenges

### Step 16: Add validation state to AddLinkForm

> **Completes: Bonus - Form Validation (Part 1)**

**16a. Add error state:**
```tsx
const [titleError, setTitleError] = useState('');
const [urlError, setUrlError] = useState('');
```

**16b. Add error prop to both inputs:**
```tsx
<Input
  value={title}
  onChangeText={setTitle}
  placeholder={t('links.linkTitle')}
  label={t('links.linkTitle')}
  error={titleError || undefined}
/>
<Input
  value={url}
  onChangeText={setUrl}
  placeholder={t('links.linkUrl')}
  label={t('links.linkUrl')}
  error={urlError || undefined}
/>
```

**Note:** Use `|| undefined` to avoid passing empty string, which causes "text node cannot be a child of View" error.

**Test:** No visible change yet (validation logic comes next)

---

### Step 17: Add validation logic to handleSubmit

> **Completes: Bonus - Form Validation (Part 2)**

Replace the simple handleSubmit with validation:
```tsx
const handleSubmit = () => {
  let hasError = false;

  if (!title.trim()) {
    setTitleError('Title is required');
    hasError = true;
  } else {
    setTitleError('');
  }

  if (!url.trim()) {
    setUrlError('URL is required');
    hasError = true;
  } else {
    setUrlError('');
  }

  if (!hasError) {
    onAdd(title.trim(), url.trim());
    setTitle('');
    setUrl('');
  }
};
```

**Test:** Submit empty form → error messages appear under inputs

---

### Step 18: Add loading state

> **Completes: Bonus - Loading States (Part 1)**

**18a. Add loading state:**
```tsx
const [isLoading, setIsLoading] = useState(false);
```

**18b. Update Add button to show loading text:**
```tsx
<Button
  label={isLoading ? 'Adding...' : t('common.add')}
  variant="primary"
  size="sm"
  onPress={handleSubmit}
/>
```

**Test:** No visible change yet (async logic comes next)

---

### Step 19: Add async delay to handleSubmit

> **Completes: Bonus - Loading States (Part 2)**

Update handleSubmit to be async with delay:
```tsx
const handleSubmit = async () => {
  let hasError = false;

  // ... validation logic ...

  if (!hasError) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onAdd(title.trim(), url.trim());
    setIsLoading(false);
    setTitle('');
    setUrl('');
  }
};
```

**Test:** Submit valid form → button shows "Adding..." for 500ms → completes

---

### Step 20: Add empty states

> **Completes: Bonus - Empty States**

Add conditional rendering when no links match:
```tsx
{filteredLinks.length === 0 ? (
  <Card variant="filled">
    <VStack spacing="sm" align="center">
      <Text variant="body" color={colors.textSecondary}>
        {searchText ? 'No results found' : 'No links yet'}
      </Text>
      {!searchText && (
        <Button
          label="Add your first link"
          variant="primary"
          size="sm"
          onPress={() => setShowAddForm(true)}
        />
      )}
    </VStack>
  </Card>
) : (
  <VStack spacing="md">
    {filteredLinks.map(link => (
      <LinkCard key={link.id} link={link} onToggle={handleToggle} />
    ))}
  </VStack>
)}
```

**Test:**
- Search gibberish → "No results found"
- Clear all data → "No links yet" with button

---

## Final Checklist

| Task | Status |
|------|:------:|
| Links display as cards | ⬜ |
| Toggle switch works | ⬜ |
| Count shows with pluralization | ⬜ |
| Search filters with debounce | ⬜ |
| Theme toggle works | ⬜ |
| Add link form works | ⬜ |
| (Bonus) Form validation | ⬜ |
| (Bonus) Loading states | ⬜ |
| (Bonus) Empty states | ⬜ |
