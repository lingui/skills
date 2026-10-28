# Lingui + Vue 3 (Vite)

Covers Vue 3 apps built with Vite and `@vitejs/plugin-vue`: client-rendered SPAs with or without Vue Router. Nuxt has brief notes at the end. Vue 2 is not supported — `@lingui/vue` needs Vue 3.4+.

Why the setup differs from React: the Vue compiler, not Babel or SWC, compiles `<template>` blocks, so a JS macro transform never sees `<Trans>` there. `@lingui/vue` adds a template transform for the build, and `@lingui/extractor-vue` runs it at extract time.

## Packages

```bash
npm install '@lingui/core@^6' '@lingui/vue@^6' '@lingui/detect-locale@^6'
npm install -D '@lingui/cli@^6' '@lingui/vite-plugin@^6' '@lingui/extractor-vue@^6' '@babel/core'
```

`@babel/core` is an optional peer of `@lingui/vue` that `linguiVue()` loads at build time. npm usually hoists a copy from `@lingui/cli`, but strict installers (pnpm) don't — install it explicitly. No macro-transform package: `linguiVue()` runs the Babel macro itself (below).

## Build tool integration

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { lingui } from '@lingui/vite-plugin'
import { linguiVue } from '@lingui/vue/vite'

export default defineConfig({
  plugins: [vue(), linguiVue(), lingui()],
})
```

- `linguiVue()` registers the template transform in `@vitejs/plugin-vue` and runs the Babel macro on `<script setup>`, `.ts/.js` and `.tsx/.jsx` modules that import `@lingui/core/macro` or `@lingui/vue/macro`. Put it after `vue()`.
- `lingui()` stays without options: here it compiles `.po` catalogs only, because the native macro transform has no Vue support and `linguiVue()` owns the macros.
- Vue JSX (`@vitejs/plugin-vue-jsx`): add `vueJsx()` after `linguiVue()` and import the macros from `@lingui/vue/macro` in `.tsx` files.

`lingui()` makes `.po` files importable as compiled message modules — no `lingui compile` step, nothing to gitignore. Add the type declaration next to the `*.vue` one:

```ts
// src/env.d.ts (or src/vite-env.d.ts — append)
declare module '*.po' {
  import type { Messages } from '@lingui/core'
  export const messages: Messages
}
```

## lingui.config.ts

```ts
import { defineConfig } from '@lingui/vue/config'
import { createVueExtractor } from '@lingui/extractor-vue'
import babel from '@lingui/cli/api/extractors/babel'

export default defineConfig({
  sourceLocale: 'en',
  locales: ['en', 'es', 'fr'],
  catalogs: [
    { path: '<rootDir>/src/locales/{locale}/messages', include: ['src'] },
  ],
  extractors: [babel, createVueExtractor()],
})
```

- `defineConfig` from `@lingui/vue/config` sets `macro.jsxPackage`, `macro.jsxRuntime: "vue"` and `runtimeConfigModule` for Vue. With the plain `@lingui/cli` `defineConfig`, the macro only recognizes `@lingui/react/macro`, so `@lingui/vue/macro` imports are not transformed.
- `extractors` must list `createVueExtractor()`. Without it `lingui extract` skips `.vue` files without an error and the catalogs come out nearly empty. Keep `babel` for plain `.ts` modules.

Create the shared `src/i18n/locales.ts` module (`resolveLocale`, `getDirection`, `localeDisplayName`) per the lingui-best-practices skill before writing anything below — every snippet imports from it.

## The i18n module (no URL locale — the default SPA shape)

Copy `src/i18n/index.ts` (`detectLocale`, `loadCatalog`, `saveLocale`) from the "The i18n module" section of [vite-spa.md](vite-spa.md) as written, with its two load-bearing rules. It has no React code: detection, catalog loading and persistence are framework-neutral.

## Provider wiring

```ts
// src/main.ts
import { createApp } from 'vue'
import { createLingui } from '@lingui/vue'
import { i18n, detectLocale, loadCatalog } from './i18n'
import App from './App.vue'

await loadCatalog(detectLocale()) // before mount: no flash of source text, and I18nProvider renders nothing until a locale is active

createApp(App).use(createLingui({ i18n })).mount('#app')
```

`createLingui` is the plugin form; wrapping the root in `<I18nProvider :i18n="i18n">` is equivalent. Set `index.html`'s `<html lang>` to the source locale and remove any hardcoded `dir`.

In components, import the macros from `@lingui/vue/macro` in `<script setup>`; the template transform compiles `<Trans>`, `<Plural>`, `<Select>`, `<SelectOrdinal>` and `` t`...` `` in templates:

```vue
<script setup lang="ts">
import { Trans, Plural, useLingui } from '@lingui/vue/macro'

defineProps<{ count: number }>()
const { t } = useLingui()
</script>

<template>
  <h1><Trans>Inbox</Trans></h1>
  <input :placeholder="t`Search`" />
  <Plural :value="count" _0="No messages" one="# message" other="# messages" />
</template>
```

Message syntax in templates (`{{ name }}` placeholders, `_0` exact forms, slot-based plural forms) is in the lingui-best-practices skill.

## Language switcher (no URL locale)

```vue
<!-- src/components/LanguageSwitcher.vue -->
<script setup lang="ts">
import { useLingui } from '@lingui/vue'
import { locales, localeDisplayName, loadCatalog, saveLocale, type Locale } from '../i18n'

const { i18n } = useLingui() // ShallowRef<I18n>: read i18n.value.locale

async function onChange(e: Event) {
  const locale = (e.target as HTMLSelectElement).value as Locale
  saveLocale(locale)
  await loadCatalog(locale)
}
</script>

<template>
  <select :value="i18n.locale" aria-label="Language" @change="onChange">
    <option v-for="locale in locales" :key="locale" :value="locale">
      {{ localeDisplayName(locale) }}
    </option>
  </select>
</template>
```

`useLingui()` returns `i18n` as a `ShallowRef` that is triggered on every locale or catalog change. Templates unwrap it (`i18n.locale`). In `<script>`, read `i18n.value.locale` inside a `computed`, so formatters and labels follow the switch.

## Locale-prefixed URLs (optional)

If the user wants `/es/about`-style URLs, ask them to choose: unprefixed source locale, all locales prefixed, or stay URL-free. With Vue Router:

- **The path becomes the only locale source.** Drop `detectLocale`/`saveLocale` for routing.
- Nest routes under `/:locale` and load the catalog in a `router.beforeEach` guard. Validate the param there and redirect unknown values — `:locale` matches any first segment, so `/xyz/about` arrives with `locale === 'xyz'`.
- The switcher becomes a link to the same path under the target locale, keeping `query` and `hash`.
- Production hosting must rewrite unknown paths to `index.html` (the same rules as the React Vite SPA: Netlify `_redirects`, Vercel `rewrites`, nginx `try_files`). Dev and `vite preview` hide the problem.

## Nuxt (brief notes)

Nuxt registers `@vitejs/plugin-vue` itself, so add only `linguiVue()` and `lingui()` to `vite.plugins` in `nuxt.config.ts`. Create the `i18n` instance in a Nuxt plugin with `setupI18n()` and `nuxtApp.vueApp.use(createLingui({ i18n }))` — the plugin runs per request on the server, which keeps locales from leaking between requests. Resolve the locale from the request (cookie, `Accept-Language`, route). Point `catalogs[].include` at the `app` directory. Follow the SSR section of the `@lingui/vue` docs; this skill has no full Nuxt recipe.

## Gotchas

- `<Trans>` renders source text, or `lingui extract` finds no `.vue` messages → the three wiring points: `linguiVue()` in `plugins`, `createVueExtractor()` in `extractors`, `defineConfig` from `@lingui/vue/config`.
- `v-if`/`v-for` or `<slot>` inside a `<Trans>` message → not supported; put the directive on `<Trans>` itself or move it out of the message.
- Changed `compilerOptions` (`whitespace`, `delimiters`) in the Vue plugin → pass the same `compilerOptions` to `createVueExtractor()`, or message IDs at build and extract time differ.

## Verification

```bash
npx lingui extract --clean   # .po files update; the count includes .vue messages
npx vue-tsc --noEmit         # tsc alone does not check .vue files
npm run build
npm run preview
```

Then prove the transform ran: fill in one `msgstr` in a non-source `.po`, load `?lang=<that locale>` in `preview`, and confirm the translated string renders — in a template `<Trans>` and in a `t` call in `<script setup>`, since they go through different transforms.
