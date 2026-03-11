# Scenario 4: Analytics Dashboard

**Time Limit:** 90 minutes
**Difficulty:** Hard
**Packages:** 4 (rn-primitives, rn-theming, rn-i18n, rn-performance)

---

## Scenario

You're building an analytics dashboard for a creator platform. It shows key metrics,
recent activity, and allows filtering by date range. Performance matters - the
dashboard loads multiple data sources.

---

## What You're Building

A dashboard screen with:
1. Header with user greeting and date
2. Key metrics cards (views, clicks, earnings)
3. Time period selector (Today, Week, Month)
4. Top performing links list
5. Recent activity feed
6. Pull-to-refresh functionality

---

## Functional Requirements

### FR1: Header
- [ ] Greeting based on time of day ("Good morning/afternoon/evening")
- [ ] Current date formatted with i18n
- [ ] Theme toggle in corner

### FR2: Metrics Cards
- [ ] Total Views card with number
- [ ] Total Clicks card with number
- [ ] Earnings card with formatted currency
- [ ] Each card shows % change from previous period
- [ ] Use Badge component for change indicator

### FR3: Time Period Selector
- [ ] Three options: Today, This Week, This Month
- [ ] Selected state styling
- [ ] Metrics update when selection changes
- [ ] Debounce rapid selection changes (300ms)

### FR4: Top Links
- [ ] List of top 5 performing links
- [ ] Show rank, title, and click count
- [ ] Use Avatar for link thumbnail
- [ ] Use Badge for rank number

### FR5: Activity Feed
- [ ] Recent events (clicks, new followers, etc.)
- [ ] Timestamp for each event
- [ ] Different icons/colors by event type
- [ ] Scrollable list

### FR6: Performance
- [ ] Track render performance
- [ ] Debounce filter changes
- [ ] Show loading states while data "loads"

---

## Technical Requirements

```tsx
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';
import { Text, Button, Card, VStack, HStack, Avatar, Badge, Divider } from '@astacinco/rn-primitives';
import { I18nProvider, useTranslation, useLocale } from '@astacinco/rn-i18n';
import { useDebounce, usePerformance } from '@astacinco/rn-performance';
```

---

## Mock Data

```typescript
type TimePeriod = 'today' | 'week' | 'month';

interface Metrics {
  views: number;
  viewsChange: number;
  clicks: number;
  clicksChange: number;
  earnings: number;
  earningsChange: number;
}

const mockMetrics: Record<TimePeriod, Metrics> = {
  today: {
    views: 1234,
    viewsChange: 12.5,
    clicks: 89,
    clicksChange: -3.2,
    earnings: 45.67,
    earningsChange: 8.1,
  },
  week: {
    views: 8456,
    viewsChange: 23.1,
    clicks: 623,
    clicksChange: 15.4,
    earnings: 312.45,
    earningsChange: 18.7,
  },
  month: {
    views: 34521,
    viewsChange: 45.2,
    clicks: 2341,
    clicksChange: 32.1,
    earnings: 1234.56,
    earningsChange: 28.9,
  },
};

interface TopLink {
  id: string;
  title: string;
  clicks: number;
  thumbnail?: string;
}

const mockTopLinks: TopLink[] = [
  { id: '1', title: 'My Portfolio', clicks: 456, thumbnail: '...' },
  { id: '2', title: 'YouTube Channel', clicks: 321, thumbnail: '...' },
  { id: '3', title: 'Instagram', clicks: 234, thumbnail: '...' },
  { id: '4', title: 'Newsletter', clicks: 123, thumbnail: '...' },
  { id: '5', title: 'Discord', clicks: 89, thumbnail: '...' },
];

interface Activity {
  id: string;
  type: 'click' | 'follow' | 'share';
  message: string;
  timestamp: Date;
}

const mockActivity: Activity[] = [
  { id: '1', type: 'click', message: 'Someone clicked your Portfolio link', timestamp: new Date() },
  { id: '2', type: 'follow', message: 'New follower: @user123', timestamp: new Date(Date.now() - 300000) },
  // ... more items
];
```

---

## Translations

```typescript
const en = {
  dashboard: {
    greeting: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
    },
    metrics: {
      views: 'Total Views',
      clicks: 'Total Clicks',
      earnings: 'Earnings',
      change: '{{value}}% from last period',
    },
    period: {
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
    },
    topLinks: 'Top Performing Links',
    activity: 'Recent Activity',
    clicksCount: {
      one: '{{count}} click',
      other: '{{count}} clicks',
    },
  },
};
```

---

## Grading Rubric

| Criteria | Points |
|----------|--------|
| Metrics Cards + Badge | 20 |
| Time Period Selector | 15 |
| Top Links List | 15 |
| Activity Feed | 15 |
| i18n (date, currency, plurals) | 15 |
| Performance (debounce, measure) | 10 |
| TypeScript Quality | 10 |

---

## Tips

1. Start with the layout structure
2. Build MetricCard as a reusable component
3. Use `formatCurrency` and `formatNumber` from i18n
4. Track time period with debounced state
5. Use `measure` to track data loading time
6. Badge variants: success for positive change, error for negative
