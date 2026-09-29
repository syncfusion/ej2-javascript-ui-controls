# karma-templates

Component-scoped Karma configs for fast, targeted test runs during development.

These are **permanent templates** — they live in source control and are copied to the repo
root when needed. They are **not** the temp files created by the `fix-bug` agent.

## Usage

```powershell
# Copy the template you need to the repo root, then run it
Copy-Item karma-templates/karma.drop-down-list.conf.js ./karma.drop-down-list.conf.js
npx karma start karma.drop-down-list.conf.js

# Or run directly from the templates folder (path is relative to repo root)
npx karma start karma-templates/karma.drop-down-list.conf.js
```

## Available Configs

| File | Spec directories included | CR issues included |
|------|--------------------------|-------------------|
| `karma.auto-complete.conf.js` | `spec/auto-complete/` | ✅ `spec/cr-issues/auto-complete.spec.js` |
| `karma.combo-box.conf.js` | `spec/combo-box/` | ✅ `spec/cr-issues/combo-box.spec.js` |
| `karma.drop-down-list.conf.js` | `spec/drop-down-list/` | ✅ `spec/cr-issues/drop-down-list.spec.js` |
| `karma.drop-down-tree.conf.js` | `spec/drop-down-tree/` + `spec/hierarchical-data/` + `spec/list-data/` + `spec/remote-data/` | — |
| `karma.list-box.conf.js` | `spec/list-box/` | — |
| `karma.mention.conf.js` | `spec/mention/` | — |
| `karma.multi-select.conf.js` | `spec/multi-select/` | ✅ `spec/cr-issues/multi-select.spec.js` |
| `karma.drop-down-base.conf.js` | `spec/drop-down-base/` + `spec/common/` | — |

## Notes

- All configs use `singleRun: true` and `ChromeHeadless` only.
- Coverage check is **disabled** in these configs — they are for fast iteration only.
- Always run `npm test` (full suite) before opening a PR to enforce coverage targets.
- **DropDownTree** is the only component with specs split across 4 directories —
  all are included in `karma.drop-down-tree.conf.js`.
- **DropDownBase** changes cascade to 5+ components. After this config passes,
  always run the full suite.

## Agent Usage

The `fix-bug` agent (`.github/agents/fix-bug.agent.md`) references these templates
in Phase 4 (Fast Test Loop). Instead of generating a temp config from scratch, it
copies the relevant template to the repo root, uses it, then deletes the copy.

The `karma.*.conf.js` pattern is in `.gitignore` — copies at the repo root are
never committed.
