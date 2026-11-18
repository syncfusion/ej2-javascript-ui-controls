# Changelog

## [Unreleased]

## 35.1.43 (2026-11-03)

### RichTextEditorUI

#### Features

The Modern Rich Text Editor introduces a modern, extensible WYSIWYG editing experience built on the Headless Editor, with ProseMirror providing the underlying document model and editing engine. It is designed for applications such as document authoring, email composition, CMS platforms, blogs, knowledge bases, messaging, and business applications, offering a flexible foundation for creating and managing rich content.

- **Inline Formats:** Bold, Italic, Underline, Strikethrough, Subscript, Superscript, Font Family, Font Size, Font Color, Background Color, Inline Code, and case formatting options.
- **Block Formats:** Paragraph, Headings, Code Block, Horizontal Line, and Blockquote.
- **Lists:** Bullet, Numbered, Checklist, and configurable list styles support.
- **Links:** Insert, edit, open, copy, and remove links with contextual actions.
- **Image:** Insert, replace, resize, caption, alternative text, alignment, wrapping, and dimension controls.
- **Table:** Create and manage tables with rows, columns, headers, alignment, and content formatting.
- **Toolbar:** Configurable built-in toolbar items with flexible layouts and custom item support.
- **Quick Toolbar:** Contextual actions for text selection, links, images, and tables.
- **Slash Commands:** Insert and format content using slash command actions for headings, lists, links, tables, and media.
- **More formatting options:** Collapsible Headings, Code Blocks, Callout, Blockquotes, and Horizontal Rules.

#### Bug Fixes

- `#I1058430` - Now, the Modern Rich Text Editor README displays images correctly by using valid image paths and ensuring proper image rendering.

- `#I1063128` - Now, the `enable` property of the Modern Rich Text Editor enables or disables the editor dynamically when the property value is changed at runtime.

- `#I1063129` - Now, the `value` property of the Modern Rich Text Editor is re-serialized into the current `valueFormat` when the `valueFormat` property is changed at runtime.