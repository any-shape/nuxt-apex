# nuxt-apex

### Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Customizing & Configuration](#customizing--configuration)
- [Notes on Output Location and Caching](#notes-on-output-location-and-caching)
- [FAQ & Troubleshooting](#faq--troubleshooting)

<br/>

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
- **Scan your API directory for all endpoints (e.g. /server/api/).**
- **Extract type information from your endpoint handlers using TypeScript (ts-morph).**
- **Auto-generate composables (like useTFetchOrdersPost) with inferred parameter and result types.**
- **Keep everything in sync — update your API, and composables/types are regenerated instantly.**

<br/>

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

<br/>

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

// defineApexHandler - is a new server util provided by the module
export default defineApexHandler<Input>(async (data /*become { id: number } type*/, event) => {
  return { id: data.id, title: 'Amazing title' }
})

// you can use Zod for validation Input data as second arg
import { z } from 'zod'
export default defineApexHandler<Input>(async (data /*become { id: number } type*/, event) => {
  return { id: data.id, title: 'Amazing title' }
}, {
  id: z.coerce.number().int().positive().min(1)
})

//or use callback style with z instance provided (second arg is `data` object for more precise validation)

export default defineApexHandler<Input>(async (data /*become { id: number } type*/, event) => {
  return { id: data.id, title: 'Amazing title' }
}, (z, d) => ({
  id: z.coerce.number().int().positive().min(1)
}))

// For more examples see playground folder
```

***File /pages/posts.vue***
```ts
const { data, error, pending, execute } = useTFetchPostsGetById({ id: 42 }) // data, params, errors — all fully typed and in sync!

// or you can use async version of the composable

async fucntion doGreatJob() {
  const data = await useTFetchPostsGetByIdAsync({ id: 42 })
  // ...amazing code
}

// For more examples see playground folder
```

## Type Inference & DX
All parameters, payloads, and responses are strongly typed

> [!TIP]
> Hover for full type details in VSCode/WebStorm/etc.

No manual typing — types flow from backend handler to frontend composable

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

- **Use composables at the top level of your setup to leverage auto-fetching.**
- **Use async versions of the composables for “on-demand” API calls (e.g. on button click).**
- **Types will always reflect your backend contracts — no manual sync needed.**
- **Try to not use complex types if it possible.**

<br/>

# Customizing & Configuration

**nuxt-apex** is highly configurable. All options can be set in your nuxt.config.ts — either to match your project’s structure or optimize for performance and workflow.

## Module Options
You can pass options via the modules array in your Nuxt config:

```ts
export default defineNuxtConfig({
  modules: [
    ['nuxt-apex', {
      // All available options:
      sourcePath: 'api', // API source folder (default: 'api')
      outputPath: 'composables/.nuxt-apex', // Output for composables (default: 'composables/.nuxt-apex')
      composableName: 'useTFetch', // Composable prefix (default: 'useTFetch')
      tsMorphOptions: {/* ... */}, // Advanced: pass ts-morph options
      listenFileDependenciesChanges: true, // Auto-regenerate on file changes (default: true)
      serverEventHandlerName: 'defineApexHandler', // Name for event handler function (default: 'defineApexHandler')
      tsConfigFilePath: undefined, // Path to tsconfig.json (default tsconfig.json under /server dir)
      ignore: [], // Array of endpoint patterns to ignore
      cacheFolder: 'composables/.nuxt-apex', // Cache folder (default: same as output)
      concurrency: 50, // Concurrency for generation (default: 50)
    }]
  ]
})
```

### tsMorphOptions (advanced)
You can fine-tune how TypeScript types are extracted.
Default settings (recommended for most projects):

```ts
tsMorphOptions: {
  skipFileDependencyResolution: true,
  compilerOptions: {
    skipLibCheck: true,
    allowJs: false,
    declaration: false,
    noEmit: true,
    preserveConstEnums: false,
  },
}
```

## Best Practices

- **Keep listenFileDependenciesChanges enabled for best DX in development.**
- **Match outputPath and cacheFolder if you want to keep generated files together.**
- **Use ignore for test, mock, or internal endpoints.**

<br/>

# Notes on Output Location and Caching
Let's talk why **composables should be saved in the real** composables/ folder (and not in .nuxt or node_modules). Nuxt treat files in the /composables folder specially:

- Only composables in this folder (or subfolders) are automatically registered and available globally.
- Nuxt’s addImports and addImportsDir cannot fully “register” composables from outside the /composables tree.

<br/>

> [!WARNING]
> **If you try to generate composables inside .nuxt/, node_modules/, or other hidden/internal folders, Nuxt won’t treat them as composables.
> Result: They act like plain utilities, lose Nuxt context, and break features (like correct useFetch behavior).**

<br/>

- **Key consequence:**

  Your generated composables must be inside /composables for them to be recognized and work as true composables — otherwise, things like context-aware hooks (useFetch, etc.) will break or throw errors if called outside the Nuxt context.

- **Example of what can go wrong:**

  Invoking a “composable” from .nuxt or node_modules may throw useFetch can only be used within a Nuxt app setup function, or simply act as a common function, losing access to Nuxt runtime features (SSR context, plugins, etc.).

### Where to keep cache files?

- It’s best to keep cache files next to the generated composables, in a subfolder like composables/.nuxt-apex/ (the default).
- Don’t move cache to .nuxt or node_modules—those folders are cleared or rebuilt during Nuxt build steps and package installs, risking data loss, race conditions, or missed cache hits.

### Why?

- **Stability**: Keeping cache with the generated composables ensures you never lose the cache during rebuilds, hot reload, or package updates.
- **Portability**: Makes it easier to share, debug, and migrate your composable setup.
- **Nuxt compatibility**: .nuxt is meant for Nuxt’s internal build artifacts, and node_modules can be cleaned/overwritten by the package manager at any time.

<br/>

# FAQ & Troubleshooting

#### Q: Why aren’t my generated composables showing up in my app?
- A: Make sure your outputPath is inside the real /composables directory (not `.nuxt` or `node_modules`). Only files in /composables are treated as Nuxt composables and available for auto-imports.

#### Q: I get errors like useFetch can only be used within a Nuxt app setup function. Why?
- A: This happens if you try to use a generated composable that isn’t located in the composables folder.
  Solution: Ensure your composables are saved in /composables (e.g., composables/.nuxt-apex/).
  Files in `.nuxt` or `node_modules` are treated as utilities, not composables, and lose Nuxt context.

#### Q: Why are some endpoints missing composables?
- A: Check the following:
  - Endpoint files must be inside your configured sourcePath.
  - They must export a function named as in serverEventHandlerName (default: defineApexHandler).
  - The file is not excluded by your ignore pattern.

#### Q: How do I add a new endpoint and get a composable for it?
- A: Check the following:
  - Add your endpoint TypeScript file to the sourcePath folder.
  - Export your handler using the `serverEventHandlerName`.
  - Restart the dev server (or wait for hot reload if file watching is enabled).
  - The new composable will be auto-generated.

#### Q: How do I ignore internal or test endpoints?
- A: Use the ignore option in your config with glob patterns:

```ts
ignore: ['api/internal/**', 'api/dev-only.ts', '**/*.test.ts']
```

#### Q: Can I use custom type validators (like Zod)?
- A: Yes! nuxt-apex supports extracting types even if you use schema validators. Just ensure your types are exported and/or that your handler matches the serverEventHandlerName.

#### Q: My types are not inferred correctly or show as unknown. Why?
- A: Check the following:
  - Make sure your handler’s input/output types are explicitly declared and exported.
  - Check your tsMorphOptions and tsConfigFilePath if you have a custom TypeScript setup.
  - Restart the dev server to force type extraction.

#### Q: Is it safe to delete the cache folder?
- A: Yes, but it may slow down the next composable generation (as everything will be re-parsed).
  Do not move the cache folder to .nuxt or node_modules—it may be wiped during builds.

#### Q: Can I change composable names or output structure?
- A: Yes! Use `composableName` to set a custom prefix, and `outputPath` for the output folder.
  For more advanced naming, follow project updates for custom naming callback support.

#### Q: What should I do if I see build or generation errors?
- A: Check the following:
  - Double-check your `sourcePath`, `outputPath`, and all custom config options.
  - Verify your TypeScript config is valid and all endpoint files are correct.
  - Enable `listenFileDependenciesChanges` and/or increase concurrency if you have a large API.

#### Q: Will generated composables survive nuxt build or dependency reinstall?
- A: Yes — if you use the /composables directory for output.
  Never put them in `.nuxt` or `node_modules`, as these folders can be deleted or rebuilt by Nuxt and your package manager.

#### Q: Can I regenerate composables manually?
- A: Yes — remove it and it cache file from the folder and just restart your Nuxt dev server, or run a clean build.
  Changes in endpoints or types are picked up automatically when file watching is enabled.

<br/>

> [!TIP]
> **Still stuck?**
> Check your Nuxt and nuxt-apex versions, and open an issue with your config, endpoint structure, and error message for fast help.
