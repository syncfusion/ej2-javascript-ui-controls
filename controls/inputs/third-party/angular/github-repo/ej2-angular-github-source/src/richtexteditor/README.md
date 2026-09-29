# Angular Rich Text Editor | Angular Markdown Editor

The [Angular RichTextEditor](https://www.syncfusion.com/rich-text-editor-sdk/angular-rich-text-editor?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm) is a feature-rich WYSIWYG HTML editor and Markdown editor. The Rich Text Editor is widely used to create blogs, forum posts, notes sections, comment sections, messaging applications, and more. The component provides an efficient user interface for a better editing experience with mobile support. It has a variety of tools to edit and format rich content, and it return a valid HTML markup or Markdown (MD) content. It allows users to insert images, links, tables, media files and lists with modular architectures.

<div align="center">
    <h4>
        <a href="https://help.syncfusion.com/rich-text-editor-sdk/angular/rich-text-editor/getting-started">📖Getting started</a> &#x2022;
        <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm#/tailwind3/rich-text-editor/tools">🚀Online demos</a> &#x2022; 
        <a href="https://www.syncfusion.com/rich-text-editor-sdk/angular-rich-text-editor?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm">🌐Learn more</a>
    </h4>
</div>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/javascript/javascript-rich-text-editor-new.gif" alt="Angular RichTextEditor Component"/>
</p>

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Bootstrap logo">
  </a>
</p>

## ⚡️ Quick Start

Syncfusion <sup>®</sup> Rich Text Editor is easy to integrate into Angular applications. Just install the package, configure the module, and drop the component into your template.

### 🛠️ Installation

Install the Rich Text Editor and its dependencies using npm:

```bash
npm install @syncfusion/ej2-angular-richtexteditor --save
```

This command will:

 * Adds `@syncfusion/ej2-angular-richtexteditor` package and its peer dependencies to your `package.json` file.
 * Registers the Syncfusion<sup>®</sup> UI default theme (tailwind) in the `angular.json` file.

### ⚙️ Setup

#### 1. Create an Angular Application

You can use [Angular CLI](https://github.com/angular/angular-cli) to setup your Angular applications. To install the Angular CLI, use the following command.

```bash
npm install -g @angular/cli
ng new my-app
cd my-app
```

#### 2. Import the Rich Text Editor Module

In `app.module.ts`, import the required module:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RichTextEditorAllModule],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

<blockquote>
    <p>ℹ️ <b>Note:</b></p>
    <span><code>RichTextEditorAllModule</code> includes all features of the Rich Text Editor. To reduce bundle size, consider importing only the required modules individually. For detailed information on module injection, refer to the Syncfusion Rich Text Editor Module <a href="https://ej2.syncfusion.com/angular/documentation/rich-text-editor/module">Documentation</a>.</span>
</blockquote>

### 🧩 Add the Rich Text Editor Component

In **src/app/app.component.ts**, use `<ejs-richtexteditor>` selector in `template` attribute of  `@Component` directive to render the Syncfusion<sup>®</sup> Angular Rich Text Editor component.

```typescript
import { Component } from '@angular/core';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
@Component({
    selector: 'app-root',
    template: `<ejs-richtexteditor id='defaultRTE'>
                    <ng-template #valueTemplate>
                        <p>Start editing your content here.</p>
                    </ng-template>
                </ejs-richtexteditor>`,
    providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class AppComponent { }
```

## 🛠️ Supported frameworks

Rich Text Editor component is also offered in following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## 🏗️ Showcase samples

* [Angular HTML editor demo](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm/#/tailwind3/rich-text-editor/tools)
* [Blog posting using angular rich text editor demo](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm/#/tailwind3/rich-text-editor/blog-posting)
* [Angular Markdown editor demo](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm/#/tailwind3/rich-text-editor/markdown-editor)
* [Angular live HTML editor demo](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm/#/tailwind3/rich-text-editor/online-html-editor)

## ✨ Key features

* [AI Assistant](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm/#/tailwind3/rich-text-editor/ai-assistant) - The AI Assistant helps generate, rewrite, summarize, and refine editor content. It is designed to speed up content creation and improve editing productivity.

* [Paste from MS Word](https://ej2.syncfusion.com/angular/demos/#/tailwind3/rich-text-editor/paste-cleanup) - Paste from MS Word brings content into the editor with formatting cleanup and structure preservation. It helps users reuse Word content without carrying over unwanted styles.

* [IFrame](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm/#/tailwind3/rich-text-editor/iframe) - IFrame mode renders the editor content inside an isolated document context. It helps improve style encapsulation and reduces interference from external page styles.

* [@Mentions](https://ej2.syncfusion.com/angular/demos/#/tailwind3/rich-text-editor/mention-integration) - Mentions let users tag people, topics, or items with an autocomplete suggestion list. They make collaboration and inline referencing faster and more accurate.

* [Slash Menu](https://ej2.syncfusion.com/angular/demos/#/tailwind3/rich-text-editor/smart-suggestion) - Slash menu support lets users trigger editor commands by typing a forward slash. It provides a quick way to insert content blocks and formatting actions.

* [Checklist](https://ej2.syncfusion.com/angular/demos/#/tailwind3/rich-text-editor/tools) - Checklist support enables users to create interactive task lists in the editor. It is useful for organizing work items and tracking progress within content.

* [Accessibility & WCAG 2.0 Compliance](https://ej2.syncfusion.com/angular/documentation/rich-text-editor/accessibility) - Accessibility support helps the editor work with assistive technologies and keyboard navigation. It ensures the component can be used more effectively by a broader audience.

* [Preventing Cross-Site Scripting (XSS)](https://ej2.syncfusion.com/angular/documentation/rich-text-editor/validation-security/xhtml-validation#cross-site-scripting-xss-prevention) - XSS protection helps validate and sanitize editor content before it is used or rendered. It reduces security risks by blocking malicious scripts and unsafe markup.

* [HTML code editing](https://ej2.syncfusion.com/angular/documentation/rich-text-editor/editor-value#source-code-editing) - HTML code editing lets users view and edit the underlying markup directly. It is helpful when precise control over the document structure is required.

* [Markdown editor](https://ej2.syncfusion.com/angular/documentation/rich-text-editor/editor-types/editor-mode#markdown-editor) - Markdown editor mode lets users create and edit content using Markdown syntax. It is ideal for lightweight authoring and text-based workflows.

* [Custom Toolbar Items](https://ej2.syncfusion.com/angular/documentation/rich-text-editor/toolbar/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm#toolbar-items) - Custom toolbar items allow additional actions to be added to the editor toolbar. They help tailor the editing experience to specific application needs.

* [Quick Toolbar](https://ej2.syncfusion.com/angular/documentation/rich-text-editor/toolbar/quick-toolbar) - Quick Toolbar shows contextual actions for selected content such as text, images, and tables. It helps users apply common operations without leaving the editing area.

* [File Browser](https://ej2.syncfusion.com/angular/demos/#/tailwind3/rich-text-editor/file-browser) - File Browser integration allows users to browse and select files within editor workflows. It supports file-based content management in a more seamless way.

* [Emoji Picker](https://ej2.syncfusion.com/angular/documentation/rich-text-editor/smart-editing/emoji-picker) - Emoji picker support lets users insert emojis into the editor content. It helps make messages and content more expressive and engaging.

* [Insert Media](https://ej2.syncfusion.com/angular/demos/#/tailwind3/rich-text-editor/insert-media) - Insert Media allows audio and video content to be embedded in the editor. It is useful for creating richer and more interactive documents.

* [Toolbar](https://ej2.syncfusion.com/angular/documentation/rich-text-editor/toolbar/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm/#toolbar-items) - Toolbar support provides editing controls and customization options for the editor. It supports floating behavior, multiple layout types, and toolbar positioning for flexible UI setups.

* [Export and Import](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm/#/tailwind3/rich-text-editor/export-document) - Export and Import support allows content to be moved between the editor and document formats such as PDF and Word. It simplifies content sharing, archiving, and document processing.

* [Undo and redo](https://ej2.syncfusion.com/angular/documentation/rich-text-editor/undo-redo) - Undo and redo support lets users reverse or repeat recent editing actions. It improves editing confidence by making changes easier to correct.

* [Module injection](https://ej2.syncfusion.com/angular/documentation/rich-text-editor/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm/#module-injection) - Module injection lets the editor load only the features that are needed. It helps reduce bundle size and keeps the component more efficient.

* [Third-party integration](https://ej2.syncfusion.com/angular/documentation/rich-text-editor/third-party-integration/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm) - Third-party integration lets the editor work with external libraries and services. It extends the editor with additional capabilities beyond the built-in feature set.

## 📚 Resources

* [Documentation](https://help.syncfusion.com/rich-text-editor-sdk/angular/rich-text-editor/getting-started)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/rich-text-editor-sdk)
* [Road Map](https://www.syncfusion.com/products/roadmap/rich-text-editor-sdk)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## 🤝 Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/rich-text-editor-sdk)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm)
* Live chat

## 🔄 Change log

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/richtexteditor/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## ⚖️ License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential<sup>®</sup> Studio license and copyright applies to this distribution.