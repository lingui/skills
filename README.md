# Lingui Skills

This repository contains Agent Skills for [Lingui](https://lingui.dev), a lightweight internationalization (i18n) framework for JavaScript and TypeScript.

## What are Agent Skills?

Skills are reusable capabilities for AI coding agents. They provide procedural knowledge and best practices that help AI agents implement features correctly and efficiently.

## Installation

Install all Lingui skills with a single command:

```bash
npx skills add lingui/skills
```

This gives your AI coding agent access to comprehensive Lingui knowledge including best practices, common pitfalls, and configuration patterns.

### Claude Code Plugin

Alternatively, install the skills as a [Claude Code plugin](https://code.claude.com/docs/en/discover-plugins). In Claude Code, run:

```
/plugin marketplace add lingui/skills
/plugin install lingui@lingui-skills
```

All skills load automatically. Every commit to `main` is a new plugin version, so newly added skills reach you as soon as the plugin updates. Turn on auto-update once (run `/plugin`, open the **Marketplaces** tab, select `lingui-skills`, choose **Enable auto-update**), or update by hand:

```
/plugin update lingui@lingui-skills
/reload-plugins
```

Where the `/plugin` panel is not available, such as in IDE extensions, run `claude plugin update lingui@lingui-skills` in a terminal instead. A running session keeps the version it started with, so new skills appear after `/reload-plugins` or a restart. Note that `/plugin marketplace update` only refreshes the catalog and does not update the installed plugin.

### Other Agent Tools (Plugin Install)

The repo is also installable as a plugin via the [`plugins` CLI](https://npmx.dev/package/plugins), which auto-detects your installed agent tools (Claude Code, Cursor, Codex, Grok Build, Kimi Code, GitHub Copilot CLI, VS Code) and installs through each tool's native plugin system:

```bash
npx plugins add lingui/skills
```

### Gemini CLI

The repo is a [Gemini CLI extension](https://geminicli.com/docs/extensions/) — install it with:

```bash
gemini extensions install https://github.com/lingui/skills
```

### GitHub CLI

The [GitHub CLI](https://cli.github.com) (v2.90+) can install the skills for GitHub Copilot or any other supported agent:

```bash
gh skill install lingui/skills --all
```

Use `--agent <name>` (e.g. `--agent cursor`) to target a specific tool, and `gh skill update` to pull newer versions.

## Available Skills

### lingui-best-practices

Comprehensive guide for implementing internationalization with Lingui in React and JavaScript applications.

**What it covers:**

- Choosing the right macro (`Trans`, `t`, `msg`, `Plural`) for each situation
- Setting up Lingui with `I18nProvider`
- Using `Trans` macro for JSX translations
- Using `useLingui()` for non-JSX translations
- Pluralization with `Plural` component
- Naming placeholders with `ph()` instead of positional `{0}`
- Date and number formatting
- Message extraction and compilation workflow
- Catalog hygiene: build-script integration, gitignore rules, CI drift check
- Single-sourced locale metadata (direction, display names, fallback resolution)
- Configuration patterns and Lingui 6 upgrade notes (ESM-only, Node ≥ 22.19)
- Common mistakes and how to avoid them

**Use when:**

- Adding internationalization to a new or existing project
- Translating React components
- Working with message catalogs
- Setting up or modifying `lingui.config.js`
- Debugging i18n issues

### lingui-framework-setup

Framework-native Lingui setup recipes for the five major React stacks: Next.js App Router (RSC), Vite SPA (SWC and Babel), React Router 7 framework mode, Remix v2, and TanStack Start.

**What it covers:**

- Detection-first setup: identify the framework, compiler (SWC vs Babel), and router before recommending anything
- Server-side locale resolution under SSR (cookie + `Accept-Language`) and why browser detection breaks there
- Per-request/per-locale i18n instances — avoiding cross-request locale bleed
- The `@vitejs/plugin-react` v6 trap (removed `babel` option) and the SWC plugin pinning discipline
- Locale-prefixed URL strategies, middleware/proxy handling (including the Next 16 rename), language switchers per stack
- A verification sequence that proves the macro transform actually ran

**Use when:**

- Adding Lingui to a Next.js, Vite, React Router 7, Remix, or TanStack Start project
- Wiring locale detection, locale-prefixed URLs, or SSR locale resolution
- A working Lingui setup breaks after a framework upgrade
- Macros silently stop being transformed after a build-tool change

### enhanced-message-context

Add translator comments to Lingui messages so translators get the context they need. Comments describe where a message appears, what it does, and how to disambiguate it - improving translation quality without runtime cost.

**What it covers:**

- Tiered guidance on when to add `comment` fields (must / should / lower priority)
- Detecting the app domain and using it to disambiguate terms
- How to write effective comments (location, action/purpose, disambiguation, under ~80 chars)
- `comment` vs `context` — and why `context` must not be used for namespacing
- A post-extraction review pass to catch uncommented `.po` entries
- API usage for `t`, `Trans`, and `defineMessage` with comments

**Use when:**

- Adding or modifying translatable messages
- Working with short or ambiguous strings (e.g., "Back", "Delete", "Post")
- Creating table headers, button labels, or tooltips without surrounding UI context
- Messages with placeholders whose meaning isn't obvious (e.g., `{count}`, `{name}`)

### swc-plugin-compatibility

Diagnose and fix `@lingui/swc-plugin` compatibility errors with Next.js, Rspack, or other SWC runtimes.

**Use when you see errors like:**

- `failed to invoke plugin on 'Some("...")'`
- `failed to run Wasm plugin transform`
- `RuntimeError: out of bounds memory access`
- `LayoutError called Result::unwrap()`
- A successful build where macros are silently not transformed

**What it covers:**

- Why SWC plugin compatibility errors happen
- How to find compatible plugin versions
- Version pinning strategies
- The plugin tuple-shape trap that silently disables macros
- Alternative solutions (Babel plugin) and the `@vitejs/plugin-react@6` caveat

### find-unwrapped-strings

Audits a Lingui project for hardcoded user-facing strings that were never wrapped — the ones a green build hides: display copy in data modules, toast and error helper maps, config labels.

**What it covers:**

- Installing `eslint-plugin-lingui` as a permanent guardrail, with tuned `no-unlocalized-strings` options
- Why the plugin's `recommended` presets don't enable the rule, and why `--rule` on the CLI discards tuned ignores
- Judging every hit against the skip-list — string *role*, not string shape
- Wrapping display copy defined outside components with `msg` descriptors, and why `t` at module scope silently never updates
- A bounded fix loop (2 rounds / ~40 files) that always reports residuals as wrapped / skipped-with-reason / out-of-budget
- Growing the rule's ignores from confirmed false positives instead of weakening it

**Use when:**

- Text renders in the source language even though the catalogs look complete
- Auditing what an i18n setup or migration missed
- Checking i18n coverage on a project where Lingui is already established
- The audit lint rule is noisy and you need it quiet without losing the guardrail

### migrate-i18next-to-lingui

Migration playbook for converting i18next/react-i18next projects to Lingui.

**What it covers:**

- Setup and tooling for Babel/SWC/Vite
- Code migration patterns for React and JS/TS (`useTranslation`, `Trans`, `t`)
- Plural/context/namespace migration strategies
- Catalog conversion and verification (`lingui extract`, `lingui compile`)
- A post-migration recall check that finds leftover i18next code and unwrapped strings

**Use when:**

- Migrating an existing i18next or react-i18next codebase
- Preserving translation keys with explicit Lingui IDs
- Moving from JSON namespaces to Lingui catalogs

## Quick Start

1. **Install all Lingui skills:**
   ```bash
   npx skills add lingui/skills
   ```

2. **Use with your AI coding agent:**
   The skills will automatically be available when working on projects that use Lingui, or when you mention terms like "i18n", "internationalization", "translation", "Lingui", etc.

3. **Manual trigger:**
   You can explicitly reference the skills in your prompts:
   ```
   "Using the Lingui skills, help me add internationalization to my React app"
   ```

### Installing Individual Skills

If you prefer, you can install specific skills:
```bash
npx skills add lingui/skills --skill lingui-best-practices
npx skills add lingui/skills --skill lingui-framework-setup
npx skills add lingui/skills --skill swc-plugin-compatibility
npx skills add lingui/skills --skill enhanced-message-context
npx skills add lingui/skills --skill find-unwrapped-strings
npx skills add lingui/skills --skill migrate-i18next-to-lingui
```

## Compatibility

These skills are compatible with:
- [Claude Code](https://claude.ai/product/claude-code)
- [Cursor](https://cursor.sh)
- [OpenAI Codex](https://openai.com/codex/)
- [Gemini CLI](https://geminicli.com)
- [GitHub Copilot](https://github.com/features/copilot)
- [OpenCode](https://opencode.ai)
- [Cline](https://cline.bot/)
- [Windsurf](https://codeium.com/windsurf)
- And other agents supporting the [Agent Skills](https://agentskills.io) format

## Resources

- [Lingui Documentation](https://lingui.dev)
- [Lingui GitHub](https://github.com/lingui/js-lingui)
- [Skills.sh](https://skills.sh)
- [Lingui Discord Community](https://discord.gg/gFWwAYnMtA)

## Contributing

Have suggestions for improving these skills? Found an error?

1. Open an issue in this repository
2. Submit a pull request with improvements
3. Join the [Lingui Discord](https://discord.gg/gFWwAYnMtA) to discuss

## License

MIT — see [LICENSE](LICENSE).
