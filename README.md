# Svelte Frontend

Modern admin panel built with SvelteKit 5, TypeScript, and Tailwind CSS following feature-first architecture.

## 📂 Project Structure

```
svelte-frontend/
├── scripts/
│   └── generate-api-client.sh    # Generate types from OpenAPI
│
└── src/
    ├── routes/                    # SvelteKit routes (delegates to features)
    │   ├── +layout.svelte         # Root layout with sidebar
    │   ├── +page.svelte           # Dashboard page
    │   └── users/
    │       └── +page.svelte       # Users page
    │
    ├── features/                  # Feature-based modules
    │   ├── dashboard/
    │   │   ├── components/        # Dashboard-specific components
    │   │   ├── routes/            # Dashboard route implementation
    │   │   └── services/          # Dashboard business logic
    │   └── users/
    │       ├── components/        # UserModal, UsersTable, UserTable
    │       ├── routes/            # Users route implementation
    │       ├── services/          # UserService (business logic)
    │       └── stores/            # usersStore (state management)
    │
    └── lib/
        ├── api/                   # API clients
        │   ├── users.ts           # User API client (fetch wrapper)
        │   └── generated/         # Auto-generated types from OpenAPI
        │       └── users/
        │           └── types.ts   # TypeScript types (auto-generated)
        ├── components/            # Shared/reusable components
        │   ├── buttons/
        │   ├── cards/
        │   ├── feedback/
        │   ├── layout/
        │   ├── modals/
        │   ├── navigation/
        │   └── tables/
        ├── i18n/                  # Internationalization
        ├── stores/                # Global stores
        ├── types/                 # Shared types
        └── utils/                 # Utility functions
            └── index.ts           # formatDate, buildQueryParams, etc.
```

### Architecture Pattern

**Feature-First Structure:**

- Routes delegate to features: `routes/users/+page.svelte` → `features/users/routes/+page.svelte`
- Each feature has: components, services, stores, routes
- Shared components in `lib/components/`

**API Integration:**

- `lib/api/generated/` - Auto-generated types from backend OpenAPI
- `lib/api/users.ts` - Manual API client using generated types
- `features/*/services/` - Business logic layer
- `features/*/stores/` - State management

## 🛠️ Technology Stack

### Frontend

- **Framework**: SvelteKit 5 with Svelte 5 runes (`$state`, `$props`, `$derived`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components + Skeleton UI
- **State Management**: Svelte stores (writable, derived)
- **Code Quality**: ESLint + Prettier
- **Build Tool**: Vite

### Code Quality

- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode

### Key Features

- Feature-first architecture
- Type-safe API integration with OpenAPI
- Internationalization (i18n)
- Responsive design (mobile + desktop)
- Loading states & skeletons
- Error handling & retry

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm
- Backend running at `http://localhost:9000`

### Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp .env.example .env
# Edit .env: VITE_API_BASE_URL=http://localhost:9000/api

# 3. Generate types from backend OpenAPI
bash scripts/generate-api-client.sh

# 4. Start dev server
pnpm run dev
# App at http://localhost:5173
```

### Build for Production

```bash
# Build
pnpm run build

# Preview
pnpm run preview
```

## 📋 API Integration

### Type-Safe API Calls

Frontend uses auto-generated TypeScript types from backend OpenAPI specs:

```typescript
import type { User, CreateUserRequest } from '$lib/api/generated/users/types';
import { userApi } from '$lib/api/users';

// Type-safe API calls
const users: User[] = await userApi.getAllUsersSimple();
const newUser: User = await userApi.createUser({
	email: 'john@example.com',
	name: 'John Doe',
	birthdate: '1990-01-15'
});
```

### Workflow

1. **Backend updates OpenAPI** → `scala-play-backend/scripts/merge-openapi.sh`
2. **Frontend generates types** → `bash scripts/generate-api-client.sh`
3. **TypeScript validates** → No runtime type mismatches!

### API Client Structure

- **Generated Types** (`lib/api/generated/users/types.ts`)
  - Auto-generated, don't edit manually
  - Auto-formatted with Prettier after generation

- **API Client** (`lib/api/users.ts`)
  - Manual wrapper around fetch
  - Uses generated types

- **Feature Services** (`features/users/services/userService.ts`)
  - Business logic + notifications
  - Integrates with stores

- **Stores** (`features/users/stores/usersStore.ts`)
  - State management with pagination
  - Reactive UI updates

## 🔧 Development

### Commands

```bash
# Development
pnpm run dev                        # Start dev server

# Generate types from OpenAPI
bash scripts/generate-api-client.sh

# Type checking
pnpm run check                      # Check types

# Linting & Formatting
pnpm run lint                       # ESLint
pnpm run format                     # Prettier format all files

# Build
pnpm run build                      # Production build
pnpm run preview                    # Preview build
```

### Component Structure

```svelte
<script lang="ts">
	// 1. Imports
	import { onMount } from 'svelte';
	import type { User } from '$lib/api/generated/users/types';

	// 2. Props
	let { user }: { user: User } = $props();

	// 3. State (Svelte 5 runes)
	let loading = $state(false);
	let count = $state(0);

	// 4. Derived
	let doubled = $derived(count * 2);

	// 5. Effects
	$effect(() => {
		console.log('Count changed:', count);
	});

	// 6. Lifecycle
	onMount(() => {
		// Initialize
	});

	// 7. Functions
	function handleClick() {
		count++;
	}
</script>

<!-- Template -->
<button onclick={handleClick}>
	{user.name}: {doubled}
</button>
```

### Creating New Features

```bash
# 1. Create feature directory
mkdir -p src/features/my-feature/{components,routes,services,stores}

# 2. Add route
# src/routes/my-feature/+page.svelte
```

```svelte
<script lang="ts">
	import MyFeaturePage from '$features/my-feature/routes/+page.svelte';
</script>

<MyFeaturePage />
```

### Import Aliases

- `$lib/*` - `src/lib/*`
- `$features/*` - `src/features/*`
- `$app/*` - SvelteKit app modules

## 📊 Key Features

### Users Management

- List users with pagination
- Create, edit, delete users with birthdate field
- Type-safe API integration
- Real-time form validation
- Loading skeletons & error handling

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

---

**Built with ❤️ using SvelteKit 5 + TypeScript + Tailwind CSS**
