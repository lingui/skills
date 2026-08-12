---
name: enhanced-message-context
description: Add translator comments to Lingui messages so translations are accurate. Use when adding or modifying translatable messages, when strings are short or ambiguous ("Back", "Delete", "Post"), when placeholders are unclear ({count}, {name}), when deciding between comment and context, or when auditing extracted .po catalogs for missing translator context.
---

# Enhanced Message Context

When implementing Lingui i18n, add translator comments to messages so translators have context to provide the best translation. Even when the message text is self-explanatory, it is important to know where and how it appears in the UI to choose the correct tone, length, and wording.

## Know the App Domain First

Before writing comments, identify what the product is about — check `package.json` description, the README, and route/component names. The domain disambiguates terms that are otherwise unresolvable: in a parking app, "Park" is a parking spot, not a nature park; in a social app, "Post" is likely a noun. Reference the domain in comments whenever a term is domain-sensitive.

## When to Add Comments

Prioritize in tiers:

**Must comment** — translations will be wrong without it:

- **Ambiguous short strings**: 1-2 word phrases with multiple meanings or parts of speech
  - "Back" (noun or verb?), "Delete" (button or confirmation?), "Close" (verb or adjective?)
- **Action labels without a visible object**: the code shows what's acted on, the translator can't see it
  - "Remove" (remove what?), "Apply" (apply to what?)
- **Domain-sensitive terms**: words whose meaning depends on the product
  - "Post" (verb or noun?), "Tag" (noun or verb?), "Park" (spot or greenspace?)
- **Grammatical-gender dependence**: the translation depends on what the message refers to
  - "Selected" (masculine/feminine/neutral depends on what is selected)
- **Unclear placeholders**: names that don't reveal what they contain
  - `{count}` (count of what?), `{name}` (user name, file name, project name?)

**Should comment** — quality improves noticeably:

- **UI jargon**: "Toast", "Drawer", "Chip", "Modal" — component names translators may read literally
- **Abbreviations**: "Qty", "Avg", "N/A"
- **Sentence fragments**: text completed by surrounding UI ("per month", "of 24")
- **Labels isolated from surroundings**: table column headers, tooltips, menu items

**Lower priority — but still valuable**: full, self-explanatory sentences. A brief location comment ("Validation hint below the password field") still helps translators choose tone and length. Plural branches don't need separate comments — one comment on the whole message covers all forms.

## Writing Effective Comments

A good translator comment includes:

1. **Location**: Where in the UI the message appears
   - "Button in the top navigation bar"
   - "Tooltip for the save icon"
   - "Column header in the users table"

2. **Action/Purpose**: What happens or what it means
   - "Navigates back to the previous page"
   - "Deletes the selected item permanently"
   - "Shows the number of unread notifications"

3. **Disambiguation**: Clarify part of speech or meaning
   - "Used as a verb, not a noun"
   - "Refers to email addresses, not postal addresses"
   - "Singular form, user will see 'item' or 'items' based on count"

### Quality Rules

- **Describe where it appears and what it refers to — not what the word means.**
  - Bad: "Save — means to store"
  - Good: "Save button in the document editor toolbar"
- **Keep it under ~80 characters.** A comment is a hint, not documentation.
- **Reference the app domain** when the term is domain-sensitive: "Park — a parking spot, not a nature park"
- **Write comments in the source language** of the project.
- **Use consistent terminology** across all comments (same words for the same UI areas).

### comment vs context

They solve different problems — don't mix them up:

- **`comment`** is advice for the translator. It never changes the message identity.
- **`context`** changes the message ID: the same text with two `context` values becomes two catalog entries translated independently. Use it only when the same source text genuinely needs different translations ("right" as direction vs. correctness).
- **Never use `context` as a namespace** (`auth.login`, `settings.title`). Identical strings with identical meaning should share one catalog entry; namespacing splits them into duplicate translation work.

## API Reference

Lingui provides three ways to add translator comments:

### 1. JS Macro (`t`)

For JavaScript code outside JSX:

```js
import { t } from "@lingui/core/macro";

// With comment
const backLabel = t({
  comment: "Button in the navigation bar that returns to the previous page",
  message: "Back",
});

// With comment and variable
const uploadSuccess = t({
  comment: "Success message showing the name of the file that was uploaded",
  message: `File ${fileName} uploaded successfully`,
});
```

### 2. React Macro (`Trans`)

For JSX elements:

```jsx
import { Trans } from "@lingui/react/macro";

// With comment
<Trans comment="Button that deletes the selected email message">Delete</Trans>

// With comment in a component
<button>
  <Trans comment="Label for button that saves changes to user profile">
    Save
  </Trans>
</button>
```

### 3. Deferred/Lazy Messages (`defineMessage` / `msg`)

For messages defined separately from their usage:

```js
import { defineMessage } from "@lingui/core/macro";

const messages = {
  deleteButton: defineMessage({
    comment: "Button that permanently removes the item from the database",
    message: "Delete",
  }),

  statusLabel: defineMessage({
    comment: "Shows whether the service is currently operational. Values: 'Active', 'Inactive', 'Pending'",
    message: "Status: {status}",
  }),
};
```

## Examples

### Example 1: Ambiguous Short Word

**Before** (no context):

```jsx
<button onClick={goBack}>
  <Trans>Back</Trans>
</button>
```

**After** (with context):

```jsx
<button onClick={goBack}>
  <Trans comment="Button in the toolbar that navigates to the previous page">
    Back
  </Trans>
</button>
```

### Example 2: UI Label Without Context

**Before** (no context):

```jsx
const columns = [
  { key: "name", label: t`Name` },
  { key: "status", label: t`Status` },
];
```

**After** (with context):

```jsx
const columns = [
  { 
    key: "name", 
    label: t({
      comment: "Column header in the projects table showing project name",
      message: "Name"
    })
  },
  { 
    key: "status", 
    label: t({
      comment: "Column header showing project status: Active, Inactive, or Archived",
      message: "Status"
    })
  },
  { 
    key: "created", 
    label: t({
      comment: "Column header showing the date when the project was created",
      message: "Created"
    })
  },
];
```

### Example 3: Domain-Specific Term

**Before** (ambiguous):

```jsx
<button onClick={handlePost}>
  <Trans>Post</Trans>
</button>
```

**After** (clarified as verb):

```jsx
<button onClick={handlePost}>
  <Trans comment="Button that publishes the content. Used as a verb (to post), not a noun (a post)">
    Post
  </Trans>
</button>
```

### Example 4: Variable Without Clear Meaning

**Before** (unclear what count represents):

```js
const message = t`${count} items selected`;
```

**After** (clarified):

```js
const message = t({
  comment: "Shows the number of email messages currently selected in the inbox",
  message: `${count} items selected`,
});
```

### Example 5: Self-Explanatory Message (Lower Priority, Still Valuable)

```jsx
// Message is clear on its own; adding a comment with location still helps translators
<Trans comment="Validation hint shown below the password field on the sign-up form">
  Your password must contain at least 8 characters, including one uppercase letter and one number.
</Trans>
```

## Workflow

When implementing or reviewing Lingui messages:

1. **Know the domain**: Identify what the app is about (see above) so comments can disambiguate domain terms
2. **Read the message**: Look at the string itself
3. **Check context**: Consider where and how it's used in the code
4. **Ask**: "Could a translator misinterpret this without seeing the UI?"
5. **If yes**: Add a `comment` field with location, purpose, and any disambiguation
6. **If no**: A brief location comment still helps tone and length — keep it short

## Post-Extraction Review Pass

After a batch of i18n work, audit the catalog instead of trusting that comments were added along the way:

1. Run `lingui extract`
2. Scan the source-locale `.po` file for entries with **no `#.` line** (that's where `comment` lands)
3. For each uncommented entry, apply the tiers above: if it's a "must comment" case (short/ambiguous, unclear placeholder, domain term), go back to the source and add the comment
4. Re-run `lingui extract` and confirm the `#.` lines appear

```po
#. Button in the toolbar that navigates to the previous page
#: src/components/Toolbar.tsx:24
msgid "Back"
msgstr ""
```

## Notes

- Comments are extracted into message catalogs for translators
- Comments are stripped from production builds (zero runtime cost)
- Comments appear in translation management systems (TMS)
- Use consistent terminology across all comments in your project
