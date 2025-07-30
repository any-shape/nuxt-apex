# nuxt-apex

An advanced Nuxt 3/4 module that automatically generates fully-typed API composables for all your server endpoints.

## Motivation

**Stop writing manual API calls** — No more `useFetch('/api/posts/42')` scattered throughout your app with zero type safety.

```ts
// pages/users.vue ❌
const { data } = await useFetch('/api/users', { 
  method: 'POST', 
  body: { name: 'John', email: 'john@example.com' } 
}) // No autocomplete, no type checking, URL typos break silently

// pages/posts.vue ❌  
const { data } = await useFetch(`/api/posts/${postId}`) // Manual string building

// pages/orders.vue ❌
const { data } = await useFetch('/api/orders', {
  method: 'PUT',
  body: orderData
}) // Hope the payload structure is correct 🤞
```

**With nuxt-apex, every endpoint becomes a typed composable:**

```ts
// All auto-generated, fully typed, with autocomplete ✅
const users = await useTFetchUsersPostAsync({ name: 'John', email: 'john@example.com' })
const post = useTFetchPostsGetById({ id: postId })
const order = await useTFetchOrdersPutAsync(orderData)
```

**Works with any API complexity** — Simple CRUD, complex business logic, authentication, middleware, error handling. If you can define it with `defineApexHandler`, you get a typed composable.

- **Zero Boilerplate** — Write your API once, get typed composables everywhere.
- **Always in Sync** — Change your API types, composables update automatically.
- **Full Type Safety** — Catch API contract mismatches at compile time, not runtime.

## Installation

```bash
npm install nuxt-apex
```

Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-apex']
})
```

Start your dev server and nuxt-apex will automatically scan your `server/api/` directory:

```bash
npm run dev
```

## Usage

### Basic Example

**File: `server/api/posts/[id].get.ts`** (follows Nuxt's file-based routing)
```ts
// Your current Nuxt API route (still works!)
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return { id: Number(id), title: 'Amazing title' }
})

// Just change defineEventHandler → defineApexHandler + add types
interface Input {
  id: number
}

export default defineApexHandler<Input>(async (data, event) => {
  return { id: data.id, title: 'Amazing title' }  // Now fully typed!
})
```

**File: `pages/posts.vue`**
```ts
// Auto-fetching composable (runs immediately)
const { data, error, pending } = useTFetchPostsGetById({ id: 42 })

// Async version for on-demand usage (button clicks, form submissions, etc.)
async function handleClick() {
  const data = await useTFetchPostsGetByIdAsync({ id: 42 })
  // Handle the response...
}
```

### With Validation (Optional)

```ts
import { z } from 'zod'

export default defineApexHandler<Input>(async (data, event) => {
  return { id: data.id, title: 'Amazing title' }
}, {
  id: z.coerce.number().int().positive().min(1)  // Zod validation
})

// or use callback style with z instance provided (second arg is `data` object for more precise validation)
export default defineApexHandler<Input>(async (data, event) => {
  return { id: data.id, title: 'Amazing title' }
}, (z, d) => ({
  id: z.coerce.number().int().positive().min(1)  // Zod validation
}))
```

### Configuration

```ts
export default defineNuxtConfig({
  modules: ['nuxt-apex'],
  apex: {
    sourcePath: 'api',                              // API source folder
    outputPath: 'composables/.nuxt-apex',           // Output for composables
    cacheFolder: 'node_modules/.cache/nuxt-apex',   // Output for cache
    composablePrefix: 'useTFetch',                  // Composable prefix
    namingFunction: undefined,                      // Custom naming function
    listenFileDependenciesChanges: true,            // Watch for file changes
    serverEventHandlerName: 'defineApexHandler',    // Server event handler name
    tsConfigFilePath: undefined,                    // Path to tsconfig.json
    ignore: ['api/internal/**'],                    // Patterns to ignore
    concurrency: 50,                                // Concurrency limit
    tsMorphOptions: { /* ... */ },                  // ts-morph options
  }
})
```

**Custom Naming Function:** If you need more control over composable names, provide a custom naming function & composablePrefix:
```ts
apex: {
  composablePrefix: 'useApi',
  namingFunction: (path: string) => {
    const method = ...
    return `${path.split('/').map(capitalize).join('')}${capitalize(method)}`
    // Result: useApiPostsIdGet instead of useTFetchPostsGetById
  }
}
```

### Two Flavors of Composables

nuxt-apex generates **two versions** of each composable:

**1. Auto-fetching version** (use in setup):
```ts
// Runs immediately when component mounts
const { data, error, pending, refresh } = useTFetchPostsGetById({ id: 42 })
```

**2. Async version** (use for on-demand calls):
```ts
// Perfect for button clicks, form submissions, conditional fetching
async function submitOrder() {
  try {
    const result = await useTFetchOrdersPostAsync(orderData)
    // Handle success
  } catch (error) {
    // Handle error
  }
}
```

### Advanced Options

All composables accept an optional second argument with the same options as Nuxt's `useFetch`:

```ts
const { data, pending, error, execute } = useTFetchPostsGetById(
  { id: 42 }, 
  { 
    immediate: false,    // Don't fetch automatically
    watch: false,        // Don't watch for parameter changes
    server: false,       // Skip server-side rendering
    lazy: true,          // Don't block navigation
    // ...all other useFetch options work here
  }
)
```

## Notes on Output

⚠️ **Important**: Composables must be generated inside the `composables/` directory (not `.nuxt` or `node_modules`) to work properly with Nuxt's auto-import system.

**Why this matters:**

Nuxt has special behavior for the `composables/` folder:
- Only files in `composables/` (or subfolders) are automatically registered as true composables
- Files outside this folder are treated as regular utilities and lose Nuxt context
- This means they can't access SSR context, plugins, or other Nuxt runtime features

**What happens if you put them elsewhere:**

```ts
// ❌ If composables are in .nuxt/ or node_modules/
const data = useTFetchPostsGetById({ id: 42 })
// Error: "useFetch can only be used within a Nuxt app setup function"
```

**The fix is simple** - just ensure your `outputPath` points to somewhere inside `composables/`:

```ts
// nuxt.config.ts ✅
apex: {
  outputPath: 'composables/.nuxt-apex', // Inside composables/ - works perfectly
  // outputPath: '.nuxt/apex',          // ❌ Outside composables/ - breaks
}
```

**Default behavior:** nuxt-apex automatically uses `composables/.nuxt-apex` as the output path, so this works out of the box. Only change it if you need a custom structure.

### Cache Location Strategy

nuxt-apex uses caching to speed up composable generation. You have two options:

**Option 1: Default (node_modules cache)**
```ts
apex: {
  cacheFolder: 'node_modules/.cache/nuxt-apex' // Default
}
```
**Pros:**
- ✅ Keeps your project clean - cache files don't clutter your source code
- ✅ Gitignored by default - no accidental commits of cache files
- ✅ Standard location that tools expect

**Cons:**
- ❌ Cache is lost when `node_modules` is deleted or with `git pull` conflicts
- ❌ Slower regeneration after fresh installs

**Option 2: Local cache (synced with git)**
```ts
apex: {
  cacheFolder: 'composables/.nuxt-apex/'
}
```
**Pros:**
- ✅ Cache survives `node_modules` deletion
- ✅ Faster setup for new team members (cache comes with git clone)
- ✅ More predictable builds across environments

**Cons:**
- ❌ Cache files are committed to your repository
- ❌ Larger git repository size
- ❌ Potential merge conflicts in cache files

**Recommendation:** Use the default unless you have a large API and slow generation times, or your team frequently deletes `node_modules`.

**Default behavior:** nuxt-apex automatically uses `composables/.nuxt-apex` as the output path, so this works out of the box. Only change it if you need a custom structure.
