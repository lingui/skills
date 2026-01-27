# Lingui Skills

This repository contains Agent Skills for [Lingui](https://lingui.dev) - a powerful internationalization framework for JavaScript applications.

## What are Agent Skills?

Skills are reusable capabilities for AI coding agents. They provide procedural knowledge and best practices that help AI agents implement features correctly and efficiently.

## Installation

Install all Lingui skills with a single command:

```bash
npx skills add lingui/skills
```

This gives your AI coding agent access to comprehensive Lingui knowledge including best practices, common pitfalls, and configuration patterns.

## Available Skills

### lingui-best-practices

Comprehensive guide for implementing internationalization with Lingui in React and JavaScript applications.

**What it covers:**

- Setting up Lingui with `I18nProvider`
- Using `Trans` macro for JSX translations
- Using `useLingui()` for non-JSX translations
- Pluralization with `Plural` component
- Date and number formatting
- Message extraction and compilation workflow
- Configuration patterns
- Common mistakes and how to avoid them

**Use when:**

- Adding internationalization to a new or existing project
- Translating React components
- Working with message catalogs
- Setting up or modifying `lingui.config.js`
- Debugging i18n issues

### swc-plugin-compatibility

Diagnose and fix `@lingui/swc-plugin` compatibility errors with Next.js, Rspack, or other SWC runtimes.

**Use when you see errors like:**

- `failed to invoke plugin on 'Some("...")'`
- `failed to run Wasm plugin transform`
- `RuntimeError: out of bounds memory access`
- `LayoutError called Result::unwrap()`

**What it covers:**

- Why SWC plugin compatibility errors happen
- How to find compatible plugin versions
- Version pinning strategies
- Alternative solutions (Babel plugin)

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
npx skills add lingui/skills/lingui-best-practices
npx skills add lingui/skills/swc-plugin-compatibility
```

## Compatibility

These skills are compatible with:
- [Cursor](https://cursor.sh)
- [Claude Code](https://claude.ai/product/claude-code)
- [Cline](https://cline.bot/)
- [Windsurf](https://codeium.com/windsurf)
- [GitHub Copilot](https://github.com/features/copilot)
- And other agents supporting the skills.sh format

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

MIT License - See the main [Lingui repository](https://github.com/lingui/js-lingui) for details.
