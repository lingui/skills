---
name: migrate-i18next-to-lingui
description: Migrate i18next/react-i18next projects to Lingui. Use when the user wants to replace i18next, react-i18next, useTranslation, i18n.t(), Trans i18nKey, or i18next JSON catalogs with Lingui equivalents. Covers package installation, config setup, code transformation patterns, plural migration, namespace handling, and catalog conversion.
---

# Migrate i18next to Lingui

## Migration Checklist

```
- [ ] Step 1: Install Lingui packages
- [ ] Step 2: Create lingui.config.js
- [ ] Step 3: Set up build tooling (Babel/SWC/Vite)
- [ ] Step 4: Replace i18n initialization
- [ ] Step 5: Migrate React components (useTranslation → useLingui, Trans → Trans)
- [ ] Step 6: Migrate JS/TS strings (t() → t``)
- [ ] Step 7: Migrate plurals
- [ ] Step 8: Migrate namespaces
- [ ] Step 9: Convert existing translation catalogs
- [ ] Step 10: Run lingui extract && lingui compile
- [ ] Step 11: Remove i18next packages
```

## Step 1: Install Lingui

```bash
# Core (always required)
npm install @lingui/core @lingui/react

# CLI (dev)
npm install --save-dev @lingui/cli

# Macro support - pick one based on build tool:
# Babel
npm install --save-dev babel-plugin-macros
# SWC
npm install --save-dev @lingui/swc-plugin
# Vite
npm install --save-dev @lingui/vite-plugin
```

## Step 2: Create `lingui.config.js`

```js
import { defineConfig } from "@lingui/cli";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "de", "fr"], // match your existing locales
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
});
```

## Step 3: Configure Build Tooling

**Vite** (`vite.config.ts`):
```ts
import { lingui } from "@lingui/vite-plugin";
import react from "@vitejs/plugin-react";

export default { plugins: [react(), lingui()] };
```

**Babel** (`.babelrc` or `babel.config.js`):
```json
{ "plugins": ["macros"] }
```

**Next.js with SWC** (`next.config.js`):
```js
module.exports = {
  experimental: {
    swcPlugins: [["@lingui/swc-plugin", {}]],
  },
};
```

## Step 4: Replace i18n Initialization

**Before (i18next):**
```js
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).init({
  lng: "en",
  resources: { en: { translation: { key: "Hello world" } } },
});
```

**After (Lingui):**
```js
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { messages } from "./locales/en/messages";

i18n.load("en", messages);
i18n.activate("en");

function App() {
  return <I18nProvider i18n={i18n}>{/* app */}</I18nProvider>;
}
```

**Dynamic locale switching:**
```js
async function changeLocale(locale) {
  const { messages } = await import(`./locales/${locale}/messages`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}
```

## Step 5: Migrate React Components

### `useTranslation` → `useLingui`

**Before:**
```jsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  return <p>{t("greeting")}</p>;
}
```

**After:**
```jsx
import { useLingui } from "@lingui/react/macro";

function MyComponent() {
  const { t } = useLingui();
  return <p>{t`Hello World`}</p>;
}
```

### `Trans` component

**Before:**
```jsx
import { Trans } from "react-i18next";

<Trans i18nKey="welcome">Hello World!</Trans>
```

**After:**
```jsx
import { Trans } from "@lingui/react/macro";

<Trans>Hello World!</Trans>
```

For explicit IDs (when preserving i18next keys):
```jsx
<Trans id="welcome">Hello World!</Trans>
```

### `Trans` with interpolation

**Before:**
```jsx
<Trans i18nKey="greeting" values={{ name }}>Hello {{ name }}!</Trans>
```

**After:**
```jsx
<Trans>Hello {name}!</Trans>
```

## Step 6: Migrate JS/TS Strings

### Simple strings

| i18next | Lingui |
|---------|--------|
| `t('key')` | `t\`Message text\`` |
| `t('key', { name })` | `t\`Hello ${name}\`` |
| `t('key', { defaultValue: 'Hi' })` | `t\`Hi\`` |

**Before:**
```js
import i18next from "i18next";

const msg = i18next.t("greeting", { name: "Tom" });
```

**After:**
```jsx
import { useLingui } from "@lingui/react/macro";

function MyComponent() {
  const { t } = useLingui();
  const msg = t`Hello ${name}`;
}
```

**In vanilla JS (outside components):**
```js
import { t } from "@lingui/core/macro";

const msg = t`Hello ${name}`;
```

### Preserving explicit keys from i18next

If you want to keep the i18next message IDs:
```js
import { t } from "@lingui/core/macro";

// i18next: t('navigation.home')
const msg = t({ id: "navigation.home", message: "Home" });
```

### Module-level / lazy strings

**Before (i18next):**
```js
const LABELS = {
  active: "Active",
  inactive: "Inactive",
};
// translated at render time
```

**After (Lingui):**
```js
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";

const LABELS = {
  active: msg`Active`,
  inactive: msg`Inactive`,
};

function StatusDisplay({ status }) {
  const { _ } = useLingui();
  return <div>{_(LABELS[status])}</div>;
}
```

## Step 7: Migrate Plurals

i18next uses separate keys per plural form. Lingui uses ICU MessageFormat in a single message.

**Before (i18next):**
```json
{
  "item_one": "{{count}} item",
  "item_other": "{{count}} items"
}
```
```js
t("item", { count });
```

**After (Lingui) - JSX:**
```jsx
import { Plural } from "@lingui/react/macro";

<Plural value={count} one="# item" other="# items" />
```

**After (Lingui) - JS strings:**
```js
import { plural } from "@lingui/core/macro";

const msg = plural(count, {
  one: "# item",
  other: "# items",
});
```

**Exact matches** (i18next `_0`):
```jsx
<Plural
  value={count}
  _0="No items"
  one="# item"
  other="# items"
/>
```

## Step 8: Migrate Namespaces

i18next namespaces (`useTranslation('common')`) map to Lingui **catalog paths**. Two approaches:

**Option A - Single catalog (simplest):**
Remove namespaces and use one unified catalog. Update `lingui.config.js` to include all source directories.

**Option B - Multiple catalogs (preserves namespace separation):**
```js
// lingui.config.js
catalogs: [
  {
    path: "<rootDir>/src/locales/{locale}/common",
    include: ["src/components/common"],
  },
  {
    path: "<rootDir>/src/locales/{locale}/auth",
    include: ["src/components/auth"],
  },
]
```

With multiple catalogs, load them all at startup:
```js
import { messages as commonMessages } from "./locales/en/common";
import { messages as authMessages } from "./locales/en/auth";

i18n.load("en", { ...commonMessages, ...authMessages });
i18n.activate("en");
```

## Step 9: Convert Existing Translation Catalogs

See [catalog-conversion.md](references/catalog-conversion.md) for and patterns.

**Key concept:** i18next uses JSON with dotted keys; Lingui uses `.po` files with the message as the ID (or an explicit ID you provide).

## Step 10: Build & Verify

```bash
npx lingui extract    # extracts all messages → .po files
npx lingui compile    # compiles .po → .js message catalogs
```

Add to `package.json`:
```json
{
  "scripts": {
    "i18n:extract": "lingui extract",
    "i18n:compile": "lingui compile"
  }
}
```

For TypeScript:
```bash
npx lingui compile --typescript
```

## Step 11: Remove i18next

```bash
npm uninstall i18next react-i18next
```

## Common Patterns Reference

### Date/Number Formatting

**Before (i18next):**
```js
t("intlDateTime", { val: new Date() });
```

**After (Lingui):**
```jsx
import { useLingui } from "@lingui/react/macro";

function Component() {
  const { i18n } = useLingui();
  return <span>{new Intl.DateTimeFormat(i18n.locale).format(date)}</span>;
}
```

### Context (disambiguation)

**Before (i18next):**
```js
t("right", { context: "direction" });
```

**After (Lingui):**
```jsx
<Trans context="direction">right</Trans>
// or
t({ message: "right", context: "direction" });
```

### Gender / Select

**Before (i18next):**
```json
{ "pronoun_male": "He", "pronoun_female": "She", "pronoun_other": "They" }
```

**After (Lingui):**
```js
import { select } from "@lingui/core/macro";

const pronoun = select(gender, {
  male: "He",
  female: "She",
  other: "They",
});
```

## Pitfalls

- **Don't call `t\`...\`` at module level.** Use `msg\`...\`` instead and translate with `_(descriptor)` at render time.
- **After locale change**, call both `i18n.load(locale, messages)` and `i18n.activate(locale)`.
- **Wrap the entire app** in `<I18nProvider i18n={i18n}>` before any component uses `useLingui` or `Trans`.
- **Always run `lingui compile`** before building for production; the app imports compiled `.js` catalogs, not `.po` files.
- **Generated IDs change if message text changes.** If stability matters, use explicit `id` props.

## Additional Resources

- [Detailed migration patterns](references/migration-patterns.md)
- [Catalog conversion guide](references/catalog-conversion.md)
- [Lingui docs](https://lingui.dev)
- [Lingui vs i18next comparison](https://lingui.dev/misc/i18next)
