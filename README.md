# Introduction

**nuxt-apex** is an advanced Nuxt 3/4 module that automatically generates fully-typed API composables for all your server endpoints. No more manual typing or repetitive useFetch wrappers — just write your endpoints and let nuxt-apex handle the rest.

- **Never write boilerplate for API calls again.**
- **Type-safe, IntelliSense-ready, and always in sync with your backend.**
- **Productivity boost for every project: small apps to enterprise-scale.**

## Why use nuxt-apex?

- **Eliminate Manual Typing**

  Stop duplicating types between server and client. nuxt-apex extracts types directly from your API handlers and uses them to generate composables — so your payloads, responses, and errors are always correct.

- **Maximum Type Safety**

  All generated composables are strongly typed. Get full type checking and autocompletion for parameters, payload, and returned data out of the box.

- **Automatic Composable Generation**

  For every API endpoint, nuxt-apex creates a ready-to-use composable like useTFetchPostsGetById. No more mapping URLs to functions manually.

- **Zero Boilerplate, Maximum Productivity**

  Focus on your business logic. All the client-server plumbing is handled for you automatically.

- **Supports Modern Nuxt & TypeScript Workflows**

  Designed for high-performance apps using Nuxt 3/4 and TypeScript. Works seamlessly with your existing API structure.

## How does it work?
- Scan your API directory for all endpoints (e.g. /server/api/).
- Extract type information from your endpoint handlers using TypeScript (ts-morph).
- Auto-generate composables (like useTFetchOrdersPost) with inferred parameter and result types.
- Keep everything in sync — update your API, and composables/types are regenerated instantly.

## Short Example

```typescript
// /server/api/posts/[id].get.ts

export default defineApexEventHandler(async (event) => {
  // Your handler code...
})

// pages/posts.vue
const { data, error } = useTFetchPostsGetById({ id: 42 })
// data, params, errors — all fully typed and in sync!
```

# Getting Started
