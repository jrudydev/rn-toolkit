# Experience Container System

## Overview

A comprehensive, server-driven layout system for building dynamic dashboards and feed-based UIs. This system allows domain teams to register their "experiences" (content modules) and display them in configurable containers (lists, grids, carousels) with customizable card templates.

**Status**: PLANNED (Future Phase)
**Package**: `@astacinco/rn-sdui` (extension)
**Tier**: PAID

---

## Vision

Inspired by enterprise-grade dashboard systems, this enables:

- **Domain Team Autonomy**: Teams register their experiences without touching core code
- **Layout Flexibility**: Same content can render as list, grid, or carousel
- **Card Templates**: Pre-built card layouts that can be mixed and matched
- **Section Structure**: Headers and footers per section for navigation and CTAs
- **Server-Driven**: All configuration comes from backend schemas

---

## Architecture

```
Experience Container System
│
├── SDUISection (wrapper with header/footer)
│   ├── SectionHeader
│   │   ├── title
│   │   ├── subtitle
│   │   ├── action (button/link)
│   │   └── badge
│   │
│   ├── Container (layout type - swappable)
│   │   ├── SDUIList       ← Virtualized vertical list
│   │   ├── SDUIGrid       ← Grid with configurable columns
│   │   ├── SDUICarousel   ← Horizontal scroll with snap
│   │   └── SDUIStack      ← Simple non-virtualized stack
│   │
│   └── SectionFooter
│       ├── text
│       ├── action (see all, load more)
│       └── pagination info
│
├── Card Templates (registrable)
│   ├── BasicCard        ← Title, subtitle, image
│   ├── MediaCard        ← Large image/video focus
│   ├── ListItemCard     ← Horizontal layout for lists
│   ├── CompactCard      ← Minimal, icon-focused
│   ├── ActionCard       ← CTA-focused with buttons
│   └── CustomCard       ← User-registered templates
│
└── Experience Registry
    ├── registerExperience()
    ├── getExperience()
    └── listExperiences()
```

---

## Schema Design

### Full Dashboard Example

```json
{
  "type": "dashboard",
  "sections": [
    {
      "id": "featured",
      "header": {
        "title": "Featured",
        "action": { "type": "navigate", "route": "/featured" }
      },
      "container": {
        "type": "carousel",
        "props": {
          "itemWidth": 280,
          "snapToInterval": 300,
          "showPagination": true
        }
      },
      "cardTemplate": "MediaCard",
      "data": {
        "source": "api",
        "endpoint": "/api/featured",
        "refreshInterval": 300
      },
      "footer": {
        "text": "See all featured",
        "action": { "type": "navigate", "route": "/featured" }
      }
    },
    {
      "id": "recent-activity",
      "header": {
        "title": "Recent Activity",
        "subtitle": "Your latest updates"
      },
      "container": {
        "type": "list",
        "props": {
          "estimatedItemSize": 72,
          "maxItems": 5
        }
      },
      "cardTemplate": "ListItemCard",
      "data": {
        "source": "api",
        "endpoint": "/api/activity"
      }
    },
    {
      "id": "quick-actions",
      "header": {
        "title": "Quick Actions"
      },
      "container": {
        "type": "grid",
        "props": {
          "numColumns": 4,
          "spacing": 12
        }
      },
      "cardTemplate": "CompactCard",
      "data": {
        "source": "static",
        "items": [
          { "icon": "send", "label": "Send", "action": { "type": "navigate", "route": "/send" } },
          { "icon": "receive", "label": "Receive", "action": { "type": "navigate", "route": "/receive" } },
          { "icon": "history", "label": "History", "action": { "type": "navigate", "route": "/history" } },
          { "icon": "settings", "label": "Settings", "action": { "type": "navigate", "route": "/settings" } }
        ]
      }
    }
  ]
}
```

### Container Types Schema

#### List Container
```json
{
  "type": "list",
  "props": {
    "estimatedItemSize": 80,
    "maxItems": 10,
    "showSeparators": true,
    "refreshable": true,
    "loadMore": {
      "enabled": true,
      "threshold": 0.8,
      "endpoint": "/api/items?page={{nextPage}}"
    }
  }
}
```

#### Grid Container
```json
{
  "type": "grid",
  "props": {
    "numColumns": 2,
    "spacing": 16,
    "itemAspectRatio": 1.2,
    "estimatedItemSize": 180
  }
}
```

#### Carousel Container
```json
{
  "type": "carousel",
  "props": {
    "itemWidth": 300,
    "itemSpacing": 16,
    "snapToInterval": 316,
    "showPagination": true,
    "autoPlay": {
      "enabled": true,
      "interval": 5000
    },
    "loop": true
  }
}
```

---

## Implementation Stages

### Stage 1: SDUIList (Foundation)
**Complexity**: Medium
**Dependencies**: `@shopify/flash-list`

Core virtualized list with FlashList backend.

```typescript
// Schema
{
  "type": "list",
  "props": {
    "estimatedItemSize": 80,
    "refreshable": true
  },
  "children": [...]
}

// Component
<SDUIList
  data={items}
  estimatedItemSize={80}
  renderItem={({ item }) => <SDUIRenderer schema={item} />}
  onRefresh={handleRefresh}
/>
```

**Deliverables**:
- [ ] SDUIList component with FlashList
- [ ] Pull-to-refresh support
- [ ] Infinite scroll / pagination
- [ ] Loading and empty states
- [ ] SDUI schema integration
- [ ] Tests (unit + snapshot)

---

### Stage 2: SDUIGrid
**Complexity**: Medium
**Dependencies**: Stage 1

Grid layout with configurable columns, built on FlashList.

```typescript
// Schema
{
  "type": "grid",
  "props": {
    "numColumns": 2,
    "spacing": 16
  },
  "children": [...]
}

// Component
<SDUIGrid
  data={items}
  numColumns={2}
  spacing={16}
  renderItem={({ item }) => <SDUIRenderer schema={item} />}
/>
```

**Deliverables**:
- [ ] SDUIGrid component
- [ ] Column configuration (1-4 columns)
- [ ] Spacing/gap support
- [ ] Aspect ratio control
- [ ] Responsive column count (optional)
- [ ] Tests

---

### Stage 3: SDUICarousel
**Complexity**: Medium-High
**Dependencies**: Stage 1

Horizontal scrolling carousel with snap behavior.

```typescript
// Schema
{
  "type": "carousel",
  "props": {
    "itemWidth": 280,
    "autoPlay": true,
    "loop": true
  },
  "children": [...]
}

// Component
<SDUICarousel
  data={items}
  itemWidth={280}
  autoPlay
  loop
  renderItem={({ item }) => <SDUIRenderer schema={item} />}
/>
```

**Deliverables**:
- [ ] SDUICarousel component
- [ ] Horizontal FlashList or ScrollView
- [ ] Snap-to-item behavior
- [ ] Pagination indicators
- [ ] Auto-play with pause on touch
- [ ] Loop support
- [ ] Tests

---

### Stage 4: SDUISection
**Complexity**: Low-Medium
**Dependencies**: Stages 1-3

Section wrapper with header and footer.

```typescript
// Schema
{
  "type": "section",
  "header": {
    "title": "Featured",
    "action": { "type": "navigate", "route": "/featured" }
  },
  "container": { "type": "carousel", ... },
  "footer": {
    "text": "See all",
    "action": { "type": "navigate", "route": "/featured" }
  },
  "children": [...]
}

// Component
<SDUISection
  header={{ title: "Featured", action: ... }}
  footer={{ text: "See all", action: ... }}
>
  <SDUICarousel ... />
</SDUISection>
```

**Deliverables**:
- [ ] SDUISection component
- [ ] SectionHeader sub-component
- [ ] SectionFooter sub-component
- [ ] Action handling (navigate, custom)
- [ ] Badge support in header
- [ ] Tests

---

### Stage 5: Card Templates
**Complexity**: Medium
**Dependencies**: Stage 4

Pre-built card layouts for common patterns.

```typescript
// Card Template Registry
registerCardTemplate('MediaCard', MediaCardComponent);
registerCardTemplate('ListItemCard', ListItemCardComponent);

// Schema
{
  "type": "section",
  "cardTemplate": "MediaCard",
  "children": [
    { "title": "Item 1", "image": "...", "subtitle": "..." }
  ]
}
```

**Card Templates**:

| Template | Layout | Use Case |
|----------|--------|----------|
| BasicCard | Image top, title, subtitle | General content |
| MediaCard | Large image, overlay text | Featured/hero items |
| ListItemCard | Horizontal: icon, text, chevron | Activity lists |
| CompactCard | Icon + label only | Quick actions, grids |
| ActionCard | CTA buttons prominent | Promotions, offers |

**Deliverables**:
- [ ] Card template registry
- [ ] 5 built-in card templates
- [ ] Template prop mapping from schema
- [ ] Custom template registration API
- [ ] Theme integration for all cards
- [ ] Tests

---

### Stage 6: Experience Registry
**Complexity**: High
**Dependencies**: Stage 5

Domain team registration system for modular experiences.

```typescript
// Domain team registers their experience
registerExperience({
  id: 'payments-history',
  name: 'Payment History',
  team: 'payments',
  version: '1.0.0',
  schema: paymentsHistorySchema,
  // Optional: custom components
  components: {
    'PaymentCard': PaymentCardComponent,
  },
});

// Dashboard fetches registered experiences
const dashboard = await fetchDashboard('/api/dashboard');
// Returns schema referencing registered experiences by ID
```

**Deliverables**:
- [ ] Experience registry API
- [ ] `registerExperience()` function
- [ ] `getExperience(id)` function
- [ ] Version management
- [ ] Team namespacing
- [ ] Component registration per experience
- [ ] Dashboard composer
- [ ] Tests

---

## Component API Reference

### SDUIList

```typescript
interface SDUIListProps<T> {
  // Data
  data: T[];
  keyExtractor?: (item: T, index: number) => string;

  // FlashList props
  estimatedItemSize: number;

  // Rendering
  renderItem: (info: { item: T; index: number }) => ReactElement;
  ListHeaderComponent?: ReactElement;
  ListFooterComponent?: ReactElement;
  ListEmptyComponent?: ReactElement;
  ItemSeparatorComponent?: ReactElement;

  // Refresh
  refreshable?: boolean;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;

  // Pagination
  onEndReached?: () => void;
  onEndReachedThreshold?: number;

  // Styling
  contentContainerStyle?: ViewStyle;
}
```

### SDUIGrid

```typescript
interface SDUIGridProps<T> extends Omit<SDUIListProps<T>, 'ItemSeparatorComponent'> {
  numColumns: 1 | 2 | 3 | 4;
  spacing?: number;
  itemAspectRatio?: number;
}
```

### SDUICarousel

```typescript
interface SDUICarouselProps<T> {
  data: T[];
  renderItem: (info: { item: T; index: number }) => ReactElement;

  // Sizing
  itemWidth: number;
  itemSpacing?: number;

  // Behavior
  snapToInterval?: number;
  decelerationRate?: 'fast' | 'normal';

  // Auto-play
  autoPlay?: boolean;
  autoPlayInterval?: number;
  pauseOnTouch?: boolean;

  // Loop
  loop?: boolean;

  // Pagination
  showPagination?: boolean;
  paginationStyle?: 'dots' | 'numbers' | 'progress';

  // Events
  onSnapToItem?: (index: number) => void;
}
```

### SDUISection

```typescript
interface SDUISectionProps {
  // Header
  header?: {
    title: string;
    subtitle?: string;
    badge?: string | number;
    action?: SDUIAction;
    rightElement?: ReactElement;
  };

  // Footer
  footer?: {
    text?: string;
    action?: SDUIAction;
    pagination?: {
      current: number;
      total: number;
    };
  };

  // Content
  children: ReactElement;

  // Styling
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  footerStyle?: ViewStyle;
}
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────┐  │
│  │  Dashboard  │    │ Experience  │    │       Data APIs             │  │
│  │   Config    │    │  Registry   │    │  /api/featured              │  │
│  │   API       │    │   (teams)   │    │  /api/activity              │  │
│  └──────┬──────┘    └──────┬──────┘    │  /api/items?page=N          │  │
│         │                  │           └──────────────┬──────────────┘  │
│         └──────────────────┴──────────────────────────┘                 │
│                                   │                                      │
└───────────────────────────────────┼─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      Dashboard Renderer                          │    │
│  │                                                                  │    │
│  │  1. Fetch dashboard config (section layout)                      │    │
│  │  2. Resolve experience IDs to schemas                            │    │
│  │  3. Render sections with appropriate containers                  │    │
│  │  4. Apply card templates to items                                │    │
│  │  5. Handle actions (navigate, API calls)                         │    │
│  │                                                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │  SDUIList  │  │  SDUIGrid  │  │SDUICarousel│  │ SDUISection│        │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘        │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     Card Template Registry                       │    │
│  │  BasicCard | MediaCard | ListItemCard | CompactCard | ActionCard │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Testing Strategy

### Unit Tests
- Each container component (List, Grid, Carousel)
- Section header/footer rendering
- Card template rendering
- Action handling

### Integration Tests
- Full dashboard rendering from schema
- Data fetching and display
- Refresh and pagination flows
- Experience registry resolution

### Snapshot Tests
- All card templates (light + dark themes)
- Section layouts
- Empty/loading states

### Performance Tests
- 10,000+ item list rendering
- Scroll performance metrics
- Memory usage monitoring

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@shopify/flash-list` | ^1.6.0 | Virtualized list rendering |
| `react-native-reanimated` | ^3.x | Carousel animations |
| `react-native-gesture-handler` | ^2.x | Touch handling |

---

## Timeline Estimate

| Stage | Effort | Dependencies |
|-------|--------|--------------|
| Stage 1: SDUIList | 1-2 sessions | FlashList setup |
| Stage 2: SDUIGrid | 1 session | Stage 1 |
| Stage 3: SDUICarousel | 1-2 sessions | Stage 1 |
| Stage 4: SDUISection | 1 session | Stages 1-3 |
| Stage 5: Card Templates | 1-2 sessions | Stage 4 |
| Stage 6: Experience Registry | 2-3 sessions | Stage 5 |

**Total**: 7-11 sessions (not including testing and polish)

---

## Open Questions

1. **Offline Support**: Should sections cache their data for offline use?
2. **Skeleton Loading**: Built-in skeleton screens per card template?
3. **Analytics**: Auto-track section views and interactions?
4. **A/B Testing**: Support for variant schemas per experience?
5. **Accessibility**: How to handle focus navigation across containers?

---

## References

- [Shopify FlashList](https://shopify.github.io/flash-list/)
- [React Native Reanimated Carousel](https://github.com/dohooo/react-native-reanimated-carousel)
- Similar patterns: Netflix home feed, Spotify browse, Airbnb explore
