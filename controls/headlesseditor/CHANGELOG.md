# Changelog

## [Unreleased]

## 35.1.43 (2026-11-03)

### Headless Editor

#### Features

The Headless Editor introduces a UI-independent, extensible editing engine built on ProseMirror. It provides the core document model, editing operations, commands, extensions, events, and structured content capabilities required to build customized rich-text and structured-content editing experiences.

- **Headless Editing:** Provides a UI-independent editing engine that can be integrated with different editor interfaces and application frameworks.
- **ProseMirror-Based Editing:** Uses ProseMirror as the underlying document model and editing engine for nodes, transactions, selections, and plugins.
- **Extension Architecture:** Provides an extensible architecture for adding, configuring, and composing editor functionality.
- **Command Framework:** Provides centralized commands for content manipulation, formatting, selection, list operations, and document transformations.
- **Document Model:** Supports nodes, inline marks, nested content, and schema-based document structures.
- **Rich Content:** Provides built-in support for headings, paragraphs, lists, links, images, tables, code blocks, callouts, and collapsible sections.
- **Custom NodeViews:** Supports custom NodeViews for rendering and interacting with complex document nodes such as images, tables, and other structured content.
- **Event System:** Provides events for editor lifecycle, content changes, selection changes, focus, paste, delete, and file operations.
- **Schema Management:** Provides schema definition, validation, and migration capabilities for maintaining structured and consistent document content.
- **File and Upload Handling:** Provides reusable file handling and upload-state infrastructure for media and other file-based editing scenarios.
- **Keyboard Support:** Provides configurable keyboard bindings for implementing customized editing interactions.
- **Selection Management:** Provides selection APIs for managing and customizing document selections.
- **Reusable Editing Foundation:** Provides a common editing foundation for building rich-text and structured-content editor experiences with customized user interfaces.

| Platform   | Demo                                   |
| ---------- | ----------------------------------------------- |
| JavaScript | [View Demo](https://ej2.syncfusion.com/javascript/demos/#/tailwind3/headless-editor/full-featured-editing.html) |
| TypeScript | [View Demo](https://ej2.syncfusion.com/demos/#/tailwind3/headless-editor/full-featured-editing.html) |

#### Bug Fixes

- Now, the unwanted tool configuration files are removed from the package root so that they are no longer published in the package.