# Headless Editor — Knowledge Pack Index

Verified against source as of **2026-08-31**. Every statement is traceable to `src/`.
Entries 01–10 are the original architecture packs; entries 11–15 are the public-API
documentation packs (Headless Editor feature/extension/API reference).

## Architecture (system internals)

| # | File | Scope |
|---|---|---|
| 01 | [01-overview-and-repo-structure.md](01-overview-and-repo-structure.md) | What the system is; repo layout; init/teardown pipeline |
| 02 | [02-core-types-and-contracts.md](02-core-types-and-contracts.md) | `EditorNode`, `Selection`, `EditorState`, `EditorConfig`, command types |
| 03 | [03-schema-and-document-model.md](03-schema-and-document-model.md) | Schema manager, node/mark/attribute definitions, content expressions, NodeContent DSL |
| 04 | [04-command-system.md](04-command-system.md) | Command execution pipeline (registry → executor → dispatch) |
| 05 | [05-extension-system.md](05-extension-system.md) | Extension SDK: `defineExtension`, contributors, resolver, lifecycle |
| 06 | [06-events-services-and-pm-layer.md](06-events-services-and-pm-layer.md) | EventBus, aggregation, services, PM encapsulation |
| 07 | [07-ui-bridge.md](07-ui-bridge.md) | Selection/focus/keymap plugins wiring view → events |
| 08 | [08-extension-priority-matrix.md](08-extension-priority-matrix.md) | Priority tiers 100/50/10 and filler ordering |
| 09 | [09-api-reference.md](09-api-reference.md) *(legacy)* | Earlier API reference — superseded by 11 for the editor API |
| 09b | [09-selection-save-restore.md](09-selection-save-restore.md) | Selection snapshot lifecycle (save/restore/consume) |
| 10 | [10-extension-lifecycle-phases.md](10-extension-lifecycle-phases.md) | Phase-by-phase walkthrough of one `Editor.create()` call |

## Public API & Feature Reference (new)

| # | File | Scope |
|---|---|---|
| 11 | [11-headless-editor-api.md](11-headless-editor-api.md) | `HeadlessEditor` class: `EditorConfig`, lifecycle, commands/chain/can, document access, selection, node queries, marks queries, file upload, events — the complete method index |
| 12 | [12-command-catalog.md](12-command-catalog.md) | Every framework + extension command: name, payload type (verbatim), owning extension, meta, errors, usage patterns |
| 13 | [13-extension-catalog.md](13-extension-catalog.md) | Every built-in extension: options (with defaults), nodes/marks, commands, shortcuts, input rules, parse/render rules, NodeViews, and a complete usage example |
| 14 | [14-events-catalog.md](14-events-catalog.md) | Every public `editor.on()` event: payload types, cancelability, aggregation rules, file-upload lifecycle |
| 15 | [15-content-io-and-clipboard.md](15-content-io-and-clipboard.md) | Content input (JSON/HTML), `DocumentSerializer`, `getHtml()`, paste pipeline (4 stages), drop, file upload pipeline, history behavior, open items |

## Reading order for a new consumer

1. **Using the editor** → 11 (create, config, commands)
2. **Needing a specific feature** → 13 (find the extension, its options and commands)
3. **Command reference** → 12
4. **Reacting to changes** → 14
5. **Import/export/paste** → 15

## Authoring extensions

→ 05 for the SDK contract, 08 for priorities, 10 for the exact phase sequencing, and
13 §9–§10 for the `domSpecs`/`nodeViews` public surface plus a worked example.

## Accuracy rules

- ProseMirror is an internal dependency (`src/pm/`); it is never referenced as a public API.
- Where packs disagree, the **higher-numbered pack reflects the current code** (10 over 05,
  11 over 09, 12–15 supersede any older catalog content).
- Known gaps are listed under "Verified Open Items" in the relevant pack rather than
  being papered over.
