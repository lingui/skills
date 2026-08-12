---
name: swc-plugin-compatibility
description: Diagnose and fix Lingui SWC plugin compatibility errors with Next.js, Vite, Rspack, or other SWC runtimes. Use when seeing errors like "failed to invoke plugin", "failed to run Wasm plugin transform", "out of bounds memory access", or "LayoutError" during builds with @lingui/swc-plugin — or when macros are silently not transformed (build succeeds but Trans/t render as raw untranslated output).
---

# SWC Plugin Compatibility

If you see errors like these during your build:

```
failed to invoke plugin on 'Some("/app/src/file.ts")'
failed to run Wasm plugin transform
RuntimeError: out of bounds memory access
LayoutError called Result::unwrap()
```

**This is NOT a bug.** You're using an incompatible version of `@lingui/swc-plugin` with your SWC runtime.

## Why This Happens

SWC plugin support is experimental. The plugin API does not follow semantic versioning.

SWC uses Rkyv to transfer the AST between the core and plugins. Both must agree on the exact memory layout of the AST. If the layout changes (e.g., new ECMAScript features), older plugins cannot read the data correctly.

This layout cannot be negotiated at runtime - it must match at compile time.

## How to Fix

### Step 1: Check the Compatibility Table

Go to the [compatibility table](https://github.com/lingui/swc-plugin?tab=readme-ov-file#compatibility) and find the plugin version that matches your runtime.

### Step 2: Use the Plugin Compatibility Site

For precise matching, use https://plugins.swc.rs/:

1. Select your runtime (e.g., `next`)
2. Select your runtime version (e.g., `next@15.0.1`)
3. Find a compatible `@lingui/swc-plugin` version

### Step 3: Pin Your Versions

```json
{
  "devDependencies": {
    "@lingui/swc-plugin": "5.10.0"
  }
}
```

Use an **exact version** (no `^` or `~`) to prevent accidental upgrades.

## Version Compatibility Quick Reference

| Plugin Version | @lingui/core | Notes |
|----------------|--------------|-------|
| `5.*` | `@lingui/core@5.*` | Current |
| `4.*` | `@lingui/core@4.*` | Legacy |

**Important**: `@lingui/swc-plugin` does not need to match other `@lingui/*` package versions exactly. It follows its own versioning scheme.

## Rules to Avoid Build Breakage

1. **Pin an exact plugin version** compatible with your runtime
2. **Don't auto-bump `@lingui/swc-plugin`** - check release notes first
3. **Don't auto-bump your runtime** (Next.js, Rspack, etc.) - runtimes may bump `swc-core` in minor/patch releases
4. **Check compatibility after any upgrade** that touches SWC or the plugin

## Understanding Runtimes

By "runtime" we mean the tool executing SWC: Next.js, Rspack, or `@swc/core`.

Some runtimes (like Next.js) embed SWC directly and don't use `@swc/core` from npm. This means:

- You cannot control `swc-core` version via `package.json`
- Plugin compatibility depends on the runtime's embedded SWC version

## Example: Next.js Configuration

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [
      ['@lingui/swc-plugin', {
        // Plugin options
      }],
    ],
  },
};

module.exports = nextConfig;
```

## Example: .swcrc Configuration

```json
{
  "$schema": "https://json.schemastore.org/swcrc",
  "jsc": {
    "experimental": {
      "plugins": [
        ["@lingui/swc-plugin", {}]
      ]
    }
  }
}
```

## Example: Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { lingui } from "@lingui/vite-plugin";

export default defineConfig({
  plugins: [
    react({ plugins: [["@lingui/swc-plugin", {}]] }),
    lingui(),
  ],
});
```

## Silent Failure: Wrong Plugin Entry Shape

Every SWC plugin entry must be a `[name, options]` **tuple**, even with empty options. Passing the plugin name as a bare string silently disables the macro transform: the build succeeds, but `<Trans>` never resolves and messages render as raw macro output.

```ts
// ❌ Silently does nothing
react({ plugins: ["@lingui/swc-plugin"] })

// ✅ Tuple with options object
react({ plugins: [["@lingui/swc-plugin", {}]] })
```

The same applies to Next.js `swcPlugins` and `.swcrc` `plugins` arrays.

## What If No Compatible Version Exists?

If your runtime uses a newer `swc-core` that no plugin version supports yet, you have three options — make this an explicit choice rather than guessing:

1. **Pin the runtime** to the newest version that still has a compatible plugin (check https://plugins.swc.rs), and wait for a plugin release before upgrading
2. **Switch to the Babel transform** (`babel-plugin-lingui-macro`) — see the caveat below
3. Open an issue or PR at https://github.com/lingui/swc-plugin

### Babel Fallback Caveat: @vitejs/plugin-react 6

`@vitejs/plugin-react@6` (2026) dropped its internal Babel and **removed the `babel` option entirely**. On v6+, the classic form:

```ts
react({ babel: { plugins: ["@lingui/babel-plugin-lingui-macro"] } })
```

no longer works — a TypeScript config fails with TS2353 ("babel does not exist in type..."); a plain JS config is **silently ignored** and macros never get transformed.

Your options on Vite:

- Stay on SWC: `@vitejs/plugin-react-swc` + a pinned compatible `@lingui/swc-plugin` (preferred)
- Pin `@vitejs/plugin-react@^5`, which still supports the `babel` option
