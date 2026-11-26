# Changelog

## [Unreleased]

## 35.2.14 (2026-11-26)

### Word

#### Features

- Added support for **creating, modifying and updating fields** in DOCX documents.
- Added support for **cloning all document object model (DOM) elements** in DOCX documents.
- Added support for **importing content from one DOCX document to another**, enabling seamless document merging while preserving formatting, styles, lists, images, bookmarks, and document structure.
- Added support for **encryption and decryption** in DOCX documents.

## 35.2.12 (2026-11-18)

### Word

#### Features

- Added support for **creating and modifying bookmarks** in DOCX documents.
- Added support for **creating and modifying legacy form fields** (CheckBox, Dropdown, TextInput) in DOCX documents.

## 35.1.43 (2026-11-03)

### Word

#### Features

- Added support for converting **HTML to DOCX** format.
- Added support for converting documents between **DOCX, DOCM, DOTX, and DOTM** formats.

## 35.1.42 (2026-10-27)

### Word

#### Bug Fixes

- Improved paragraph handling when text content contains line break characters (\r or \n).
- Improved preservation of section layout in DOCX documents containing multiple sections.
- Improved preservation of hyperlinks associated with appended pictures in DOCX documents.
- Improved support for appending picture content controls to DOCX documents.

#### Features

- Added support for **creating and modifying chart elements** in DOCX documents.
- Added support for **creating equations using LaTeX and Math DOM, and modifying MathML equations** in DOCX documents.
- Added support for **creating and modifying built-in and custom document properties** in DOCX documents.

## 35.1.39 (2026-10-07)

### Word

#### Key features

Introducing the new JavaScript Word Library, a lightweight solution for creating, editing, and saving Microsoft Word documents entirely within client-side browser environments. It enables comprehensive Word document processing without requiring Microsoft Word or server-side dependencies. Here are its key features:
 
- Create documents from scratch: Create Word documents programmatically using an intuitive document object model for better flexibility, control, and maintainability.
- Open, modify, and save: Load existing .docx files, update document content and formatting, and save changes seamlessly without requiring Microsoft Word installation.
- Work with rich document elements: Add and format paragraphs, lists, tables, images, hyperlinks, headers, footers, content controls to generate professional-quality Word documents.