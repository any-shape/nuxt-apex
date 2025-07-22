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

# Getting Started

### Installation
Add **nuxt-apex** to your project:

```bash
# With npm
npm install nuxt-apex

# Or with pnpm
pnpm add nuxt-apex

# Or with yarn
yarn add nuxt-apex
```

### Module Registration
Add **nuxt-apex** to the modules section of your nuxt.config.ts:

```ts
export default defineNuxtConfig({
  modules: [
    'nuxt-apex'
  ],
  apex: {
    // module options here if you need some customizations
  },
  // ...other config
})
```

### Project Structure
For nuxt-apex to work, your API endpoints should follow Nuxt’s convention.
> Default: all endpoints are under /server/api/.

Example:

```bash
/server/api/
  ├─ posts/
  │   ├─ [id].get.ts
  │   └─ index.post.ts
  └─ users/
      └─ [uid].put.ts
```
> [!TIP]
> You can customize the API root if needed (see Configuration).

### Generating Typed Composables
**nuxt-apex** will automatically scan your /server/api/ directory on `dev start` and `build` and generate fully typed composables for each endpoint.

No manual steps required — just run your app:

```bash
npm run dev
```

### That’s It!
You’re now ready to develop with maximum DX and type safety. 
> [!TIP]
> Check out the Usage section for advanced patterns, custom options, and more.

# Usage

Once nuxt-apex is set up, every API endpoint in your /server/api/ directory gets its own composable with:

 - **Fully inferred request/response types**

    Consistent naming: **useTFetch** + **\<Path\>** + **\<Method\>**. *(Example: /api/posts/[id].get.ts → useTFetchPostsGetById)*

- **Standard return signature:**

  ```ts
  { data, error, pending, execute, ... } // (Same API as useFetch)
  ```

## Example

***File /server/api/posts/[id].get.ts***
```ts
interface Input {
  id: number
}

// defineApexEventHandler - is a new server util provided by the module
export default defineApexEventHandler<Input>(async (data /*become { id: number } type*/, event) => {
  return { id: data.id, title: 'Amazing title' }
})
```

***File /pages/posts.vue***
```ts
const { data, error, pending, execute } = useTFetchPostsGetById({ id: 42 }) // data, params, errors — all fully typed and in sync!

// or you can use async version of the composable

async fucntion doGreatJob() {
  const data = await useTFetchPostsGetByIdAsync({ id: 42 })
  // ...amazing code
} 
```

## Type Inference & DX
All parameters, payloads, and responses are strongly typed

> [!TIP]
> Hover for full type details in VSCode/WebStorm/etc.

No manual typing—types flow from backend handler to frontend composable

```ts
// VSCode will show autocomplete and type errors instantly:
useTFetchPostsGetById({ id: '123' }) // TS Error: id must be a number!
```

## Advanced Options
All composables accept an optional second argument, matching useFetch:

```ts
const { data, pending, error, execute } = useTFetchPostsGetById( // or async version — useTFetchPostsGetByIdAsync
  { id: 42 }, 
  { immediate: false, watch: false }
)
// Use .execute() to trigger the request manually
```

## Naming Conventions
- Paths map to PascalCase composable names:
  - /api/posts/[id].get.ts → useTFetchPostsGetById
  - /api/users/[uid].put.ts → useTFetchUsersPut
- [id], [uid], etc. map to parameter names.

> [!TIP]
> Custom naming can be configured — see Configuration.

## Best Practices

- Use composables at the top level of your setup to leverage auto-fetching
- Use async versions of the composables for “on-demand” API calls (e.g. on button click) 
- Types will always reflect your backend contracts—no manual sync needed
