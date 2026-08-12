# Skill Evals

Test cases for the skills in this repo. Each skill has an `evals.json` (task prompts + verifiable expectations) and a `files/` directory with minimal fixture projects the tasks run against.

```
evals/
  <skill-name>/
    evals.json          # prompts, expected outputs, expectations
    files/<fixture>/    # minimal project the prompt operates on
```

The format follows the [skill-creator](https://github.com/anthropics/claude-plugins-official) `evals.json` schema, so the skill-creator plugin can run, grade, and benchmark these directly. `files` paths are relative to the repo root.

## Design principles

- **Fixtures are static.** They have no lockfiles and are never installed or built; every prompt says so explicitly. All expectations are checkable from the resulting file tree and the agent's final answer — most reduce to a grep.
- **Each fixture contains traps.** Decoy content that should NOT change (URLs that mustn't be localized, `.po` files that mustn't be gitignored, identical strings that mustn't get `context`). Expectations assert the traps were avoided, which is what separates a with-skill run from a baseline.
- **Expectations discriminate.** They encode the specific behaviors the skills teach (ICU plural instead of ternary, tuple plugin entries, extension-scoped gitignore, comment-vs-context), not generic "task completed" checks that any run would pass.

## Running an eval by hand

1. Copy the fixture to a scratch directory: `cp -r evals/<skill>/files/<fixture> /tmp/eval-run && cd /tmp/eval-run && git init -q && git add -A`
   (the git init makes "what changed" and gitignore expectations checkable via `git status` / `git check-ignore`)
2. Run an agent on the prompt from `evals.json` — with the skill installed for the with-skill arm, without it for the baseline.
3. Grade each expectation against the diff and the agent's answer. Record pass/fail with evidence.

## Running with skill-creator

The skill-creator plugin automates the loop: it spawns with-skill and baseline runs per eval, grades expectations into `grading.json`, aggregates a `benchmark.json`, and opens a review viewer. Point it at a skill in `skills/` and the matching `evals/<skill-name>/evals.json`. Keep workspaces outside the repo (they're transient run artifacts, not source).

Its scripts expect this workspace layout (learned the hard way — the aggregator globs `eval-*`, requires `run-N/` per configuration, and the viewer only shows directories containing `outputs/`):

```
<skill>-workspace/iteration-1/
  eval-<id>-<name>/
    eval_metadata.json            # {eval_id, eval_name, prompt, assertions}
    with_skill/run-1/
      project/                    # the fixture copy the agent worked on (git init'd)
      grading.json  timing.json   # grader output + tokens/duration from the run
      eval_metadata.json          # copy (viewer looks in run dir or its parent)
      outputs/                    # what the reviewer sees: ANSWER.md, changes.patch
    without_skill/run-1/ ...      # same shape
```

## Current coverage

| Skill | Evals | What they test |
|---|---|---|
| lingui-best-practices | 2 | macro selection on a real component (plural ternary, attributes, module-level labels, complex interpolations); catalog hygiene wiring (scripts, gitignore, drift check) |
| swc-plugin-compatibility | 2 | the silent bare-string plugin entry; the Wasm crash → exact-pin diagnosis |
| enhanced-message-context | 2 | must-comment strings with domain awareness; comment-vs-context on a genuine collision |
| migrate-i18next-to-lingui | 1 | full migration of a react-i18next app (plurals, rich-text Trans, catalog preservation) |

## Adding an eval

Keep fixtures under ~10 files. Give every eval at least one trap expectation (something that must NOT happen). Word expectations so a grader can verify them from the file tree or final answer alone — no builds, no installs, no network.
