# Svelte Frontend

Modern admin panel built with SvelteKit 5, TypeScript, and Tailwind CSS following feature-first architecture.

## Tech Stack

- **Framework**: SvelteKit 5 (with Svelte 5 runes: `$state`, `$props`, `$derived`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components + Skeleton UI
- **State Management**: Svelte stores (writable, derived)
- **Code Quality**: ESLint + Prettier
- **Build Tool**: Vite

## Project Structure

```
svelte-frontend/
├── src/
│   ├── app.css                      # Global styles with Tailwind
│   ├── app.html                     # HTML template
│   ├── routes/                      # SvelteKit routes (delegates to features)
│   │   ├── +layout.svelte          # Root layout with sidebar
│   │   ├── +page.svelte            # Dashboard (delegates to dashboard feature)
│   │   └── users/
│   │       └── +page.svelte        # Users page (delegates to users feature)
│   ├── features/                    # Feature-based modules
│   │   ├── dashboard/
│   │   │   ├── components/         # Dashboard-specific components
│   │   │   ├── routes/             # Dashboard route implementation
│   │   │   └── services/           # Dashboard business logic
│   │   └── users/
│   │       ├── components/         # User-specific components (UserModal, UsersTable)
│   │       ├── routes/             # Users route implementation
│   │       ├── services/           # User business logic (UserService)
│   │       └── stores/             # User state management (usersStore)
│   └── lib/
│       ├── api/                     # API clients
│       │   └── users.ts            # User API endpoints with pagination & filtering
│       ├── components/              # Shared/reusable components (organized by category)
│       │   ├── buttons/
│       │   │   └── Button.svelte
│       │   ├── cards/
│       │   │   ├── Card.svelte
│       │   │   ├── CardSkeleton.svelte
│       │   │   └── StatCard.svelte
│       │   ├── feedback/
│       │   │   ├── EmptyState.svelte
│       │   │   ├── ErrorState.svelte
│       │   │   └── LoadingState.svelte
│       │   ├── layout/
│       │   │   ├── PageHeader.svelte
│       │   │   └── Sidebar.svelte
│       │   ├── modals/
│       │   │   └── DeleteModal.svelte
│       │   ├── navigation/
│       │   │   └── Pagination.svelte
│       │   ├── tables/
│       │   │   ├── Table.svelte
│       │   │   └── TableSkeleton.svelte
│       │   └── index.ts            # Barrel export for clean imports
│       ├── i18n/                    # Internationalization
│       │   ├── en.ts               # English translations
│       │   └── index.ts            # i18n utilities
│       ├── types/                   # TypeScript type definitions
│       │   └── index.ts            # Shared types
│       └── utils/                   # Utility functions
│           └── index.ts            # Helper functions
├── .env                             # Environment variables (create from .env.example)
├── .prettierrc                      # Prettier config
├── eslint.config.js                 # ESLint config
├── svelte.config.js                 # SvelteKit config with $lib, $features aliases
├── tailwind.config.js               # Tailwind CSS config
├── tsconfig.json                    # TypeScript config
└── vite.config.js                   # Vite config
```

## Key Architecture Decisions

### Feature-First Structure

- **Routes delegate to features**: `src/routes/users/+page.svelte` → `src/features/users/routes/+page.svelte`
- **Feature modules**: Each feature has its own components, services, stores, and routes
- **Shared components**: Reusable UI components in `src/lib/components/`

## Installation

1. **Clone the repository**

```bash
cd svelte-frontend
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your backend URLs:

```env
VITE_API_BASE_URL=http://localhost:9000/api
VITE_USER_SERVICE_URL=http://localhost:9001/api
```

## Running the Project

### Development Mode

```bash
npm run dev
```

App will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

### Type Checking

```bash
npm run check
```

### Linting & Formatting

```bash
# Check formatting and lint
npm run lint

# Auto-format code
npm run format
```

## Development Guidelines

### Code Style

- **Indentation**: Tabs (configured in Prettier)
- **Import style**: Use `$lib` and `$features` aliases, not relative paths
- **Component naming**: PascalCase for components, camelCase for utilities

### Svelte 5 Patterns

```svelte
<script lang="ts">
	// Props
	let { title, items }: { title: string; items: string[] } = $props();

	// State
	let count = $state(0);

	// Derived
	let doubled = $derived(count * 2);

	// Effects
	$effect(() => {
		console.log('Count changed:', count);
	});
</script>
```

### Component Structure

````svelte
<script lang="ts">
	// 1. Imports
	import { onMount } from 'svelte';
	import type { User } from '$lib/types';

	// 2. Props
	let { user }: { user: User } = $props();

	// 3. State
	let loading = $state(false);

	// 4. Lifecycle
	onMount(() => {
		// Initialize
	});

	// 5. Functions
	function handleClick() {
		// Handle event
	}
</script>

### Creating New Features 1. **Create feature directory** ```bash mkdir -p src/features/my-feature/{(components,
routes,
services,
stores)}
````

2. **Add route in `src/routes`**

```svelte
<!-- src/routes/my-feature/+page.svelte -->
<script lang="ts">
	import MyFeaturePage from '$features/my-feature/routes/+page.svelte';
</script>

<MyFeaturePage />
```

3. **Implement feature logic in `src/features/my-feature/routes/+page.svelte`**

## Key Features

### Users Management

- List users with pagination
- Create, edit, delete users
- Filter by email, name, age range
- Real-time form validation
- Loading skeletons
- Error handling

### Dashboard

- User statistics
- Recent users table
- Responsive cards
- Parallel data loading

### UI/UX

- Responsive sidebar (mobile + desktop)
- Dark themed sidebar
- Smooth transitions (fade, scale)
- Loading states with skeletons
- Error states with retry
- Empty states

### Internationalization

- Type-safe i18n with `t()` function
- English translations (easily extendable)
- Nested translation keys

## Contributing

1. Follow the code style guidelines
2. Write type-safe code
3. Use feature-first architecture
4. Add i18n for user-facing text
5. Test in both mobile and desktop views
