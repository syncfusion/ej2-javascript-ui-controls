# Changelog

## [Unreleased]

## 32.1.23 (2026-01-13)

### Markdown Converter

The JavaScript Markdown Converter is a lightweight, stateless, and efficient utility for converting Markdown content to HTML.

Explore the demos: [Overview](https://ej2.syncfusion.com/demos/#/fluent2/mark-down-editor/overview.html) and [Default Functionalities](https://ej2.syncfusion.com/demos/#/fluent2/mark-down-editor/default-functionalities.html).

#### Features

- **Markdown to HTML Conversion** – Converts Markdown content to HTML with high accuracy using the `MarkdownConverter.toHtml(markdownValue: string, options?: MarkdownConverterOptions)` method.
- **Configurable Options** – Customize conversion behaviour by passing options to `toHtml` method:
    - `async` – Enables or disables asynchronous conversion for large content processing.
    - `gfm` – Enables or disables support for GitHub Flavoured  Markdown.
    - `lineBreak` – Enables or disables conversion of single line breaks into `<br>` elements.
    - `silence` – Enables or disables error suppression, skipping invalid Markdown instead of throwing exceptions.
