# Changelog

## [Unreleased]

## 32.1.25 (2026-01-27)

### PDF Data Extract

#### Bug Fixes

- Resolved an issue where shape annotations were not properly redacted during the redaction process.

## 32.1.20 (2025-12-23)

### PDF Data Extract

#### Bug Fixes

- Resolved a script error that occurred while adding annotations and redactions.
- Resolved an issue where redaction was not applied correctly on rotated PDF documents.

## 32.1.19 (2025-12-16)

### PDF Data Extract

#### Key Features

- Added support for parsing accessibility tags from PDF documents to enhance content accessibility.
- Introduced image extraction capability, allowing users to retrieve images directly from PDF documents.

#### Breaking Changes

Improved API architecture to ensure type safety and maintainability.

Replaced inline object literals and primitive arrays with strongly typed classes:

| Types        | Description                                                                                           |
|--------------|-------------------------------------------------------------------------------------------------------|
| Rectangle    | Represents a bounding box with `x`, `y`, `width`, and `height` values for position and size.          |
| PdfColor     | Encapsulates color data with properties `r`, `g`, `b`, and an optional `isTransparent` flag.          |
| Point        | Represents a coordinate with `x` and `y` values, providing a clear abstraction for location data.     |
| Size         | Represents dimensions with `width` and `height` values, offering improved clarity and expressiveness. |

## 31.1.23 (2025-10-07)

### PDF Data Extract

#### Bug Fixes

- Resolved an issue where redaction annotation with bounds collection were not preserved correctly.

## 30.1.37 (2025-06-25)

### PDF Data Extract

#### Key Features

The Essential JavaScript PDF Data Extract library is a feature-rich, high-performance, non-UI PDF library written natively in JavaScript. Here are its key features.

- Extract text content from PDF documents with accuracy and efficiency.
- Extract text as decoded, easily readable content, ensuring proper formatting.
- Extract text lines along with their bounds, including bounds for characters, words, and text lines.
- Safeguard confidential information by redacting text and other content within PDFs.
