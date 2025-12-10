# nuxt-apex

[![ci](https://github.com/any-shape/nuxt-apex/actions/workflows/ci.yml/badge.svg?branch=dev)](https://github.com/any-shape/nuxt-apex/actions/workflows/ci.yml)
![size](https://img.shields.io/npm/unpacked-size/nuxt-apex)
![GitHub package.json dev/peer/optional dependency version (branch)](https://img.shields.io/github/package-json/dependency-version/any-shape/nuxt-apex/dev/nuxt/main)
![GitHub License](https://img.shields.io/github/license/any-shape/nuxt-apex)

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
// All auto-generated, fully typed, aliase supported, with autocomplete ✅
const post = useTFetchPostsGetById({ id: postId })
const users = await useTFetchUsersPostAsync({ name: 'John', email: 'john@example.com' })
const order = await useTFetchOrdersPutAsync(orderData)

// or can be aliased like (see Configuration section for more info)
const post = getPost({ id: postId })
const users = await addUsers({ name: 'John', email: 'john@example.com' })
const order = await updateOrder(orderData)
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
    outputPath: '.nuxt/nuxt-apex/files',            // Output for composables
    cacheFolder: '.nuxt/nuxt-apex/cache',           // Output for cache
    composablePrefix: 'useTFetch',                  // Composable prefix
    namingFunction: undefined,                      // Custom naming function
    listenFileDependenciesChanges: true,            // Watch for file changes
    serverEventHandlerName: 'defineApexHandler',    // Server event handler name
    tsConfigFilePath: 'simple',                     // Path to tsconfig.json or 'simple' that create a simple one config especially for nuxt-apex module
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

**Aliases:** If you need to alias a composable, provide it on top of the `defineApexHandler`:
```ts
interface Input {
  id: number
}

// as: getPosts      <--- like this
/* as: getPosts */   <--- or like this
/**                  <--- or like this
* @alias getPosts
*/
export default defineApexHandler<Input>(async (data, event) => {
  return { id: data.id, title: 'Amazing title' }
})
```

Now in the client call `getPosts` instead of `useTFetchPostsGetById`:
```ts
const { data, error, pending } = getPosts({ id: 42 })
```

***You can still use the original `useTFetchPostsGetById` if you need to.***

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
