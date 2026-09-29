# Angular Markdown Editor

A feature-rich Markdown Editor component for Angular applications built on the Syncfusion EJ2 framework.

## Features

- **Rich Toolbar** - Full-featured toolbar for formatting and editing
- **Live Preview** - Real-time preview of Markdown content
- **Essential Markdown Support** - Headers, lists, links, images, tables, and more
- **Keyboard Shortcuts** - Quick formatting with keyboard shortcuts
- **Customizable** - Theme and styling support

## Installation

```bash
npm install @syncfusion/ej2-markdowneditor
```

## Usage

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MarkdownEditorModule } from '@syncfusion/ej2-markdowneditor';

@NgModule({
  imports: [
    BrowserModule,
    MarkdownEditorModule
  ]
})
export class AppModule { }
```

```html
<ej-markdowneditor></ej-markdowneditor>
```
