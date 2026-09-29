# Angular Rich Text Editor | Angular Markdown Editor

> **Using this package with an AI coding agent**
>
> Before generating Syncfusion code, ask your AI coding agent to run the Syncfusion setup using the following prompt:
>
> ```text
> Set up this project for Syncfusion before generating code. Fetch
> and follow the official instructions at https://ai.syncfusion.com,
> then report the detected platform, installed skill pack, MCP
> status, and any required licensing action.
> ```
> The setup detects your project’s platform and loads the appropriate Syncfusion skill pack. No Syncfusion account or MCP key is required to install or read Syncfusion agent skills.
>
> **Platform reference:** [https://ai.syncfusion.com/angular/llms.txt](https://ai.syncfusion.com/angular/llms.txt)

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

This guide uses the Angular CLI as the development environment for the Angular Rich Text Editor. Install [Node.js](https://nodejs.org/), and the [Angular CLI](https://github.com/angular/angular-cli), before proceeding.

### Create an Angular application

To set up the Angular CLI globally, run the following command.

```sh
npm install -g @angular/cli
```

Then create a new application:

```sh
ng new my-app
```

This command prompts you to configure the stylesheet format, Server-Side Rendering (SSR/SSG), and AI tooling options. Select the options that best fit the project.

Navigate to the project folder:

```sh
cd my-app
```

### Install the Rich Text Editor package

The `@syncfusion/ej2-angular-richtexteditor` package supports Angular 14 and later.

```sh
npm install @syncfusion/ej2-angular-richtexteditor --save
```

### Add the CSS reference

Install the Syncfusion<sup>®</sup> [Tailwind 3](https://www.npmjs.com/package/@syncfusion/ej2-tailwind3-theme) theme package:

```sh
npm install @syncfusion/ej2-tailwind3-theme --save
```

Then add the following CSS reference to the `src/styles.css` file:

```css
@import '../node_modules/@syncfusion/ej2-tailwind3-theme/styles/rich-text-editor/index.css';
```

### Add the Rich Text Editor component with required modules

Add the Rich Text Editor component to the `src/app/app.ts` file with the basic required modules, `Toolbar`, `Image`, `Link`, `HtmlEditor`, and `QuickToolbar`, provided using the `providers` array, and add the control's HTML elements to the component `template`:

```typescript
import { Component } from '@angular/core';
import { RichTextEditorModule, ToolbarService, LinkService, ImageService, HtmlEditorService, QuickToolbarService } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-root',
  imports: [RichTextEditorModule],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, QuickToolbarService],
  template: `<ejs-richtexteditor id="editor" height="300px">
                <ng-template #valueTemplate>
                    <p>Start editing your content here.</p>
                </ng-template>
             </ejs-richtexteditor>`
})
export class App {}
```

<blockquote>
    <p>ℹ️ <b>Note:</b></p>
    <span>The example above imports only the required services (<code>ToolbarService</code>, <code>LinkService</code>, <code>ImageService</code>, <code>HtmlEditorService</code>, <code>QuickToolbarService</code>) to keep the bundle size small. For detailed information on module injection, refer to the Syncfusion<sup>®</sup> Rich Text Editor Module <a href="https://help.syncfusion.com/rich-text-editor-sdk/angular/rich-text-editor/module">Documentation</a>.</span>
</blockquote>

### Run the application

```sh
ng serve --open
```

Now, open your project in a browser, and the Rich Text Editor will be displayed! 🚀

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

* [Accessibility & WCAG 2.0 Compliance](https://help.syncfusion.com/rich-text-editor-sdk/angular/rich-text-editor/accessibility) - Accessibility support helps the editor work with assistive technologies and keyboard navigation. It ensures the component can be used more effectively by a broader audience.

* [Preventing Cross-Site Scripting (XSS)](https://help.syncfusion.com/rich-text-editor-sdk/angular/rich-text-editor/validation-security/xhtml-validation#cross-site-scripting-xss-prevention) - XSS protection helps validate and sanitize editor content before it is used or rendered. It reduces security risks by blocking malicious scripts and unsafe markup.

* [HTML code editing](https://help.syncfusion.com/rich-text-editor-sdk/angular/rich-text-editor/editor-value#source-code-editing) - HTML code editing lets users view and edit the underlying markup directly. It is helpful when precise control over the document structure is required.

* [Markdown editor](https://help.syncfusion.com/rich-text-editor-sdk/angular/rich-text-editor/editor-types/editor-mode#markdown-editor) - Markdown editor mode lets users create and edit content using Markdown syntax. It is ideal for lightweight authoring and text-based workflows.

* [Custom Toolbar Items](https://help.syncfusion.com/rich-text-editor-sdk/angular/rich-text-editor/toolbar/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm#toolbar-items) - Custom toolbar items allow additional actions to be added to the editor toolbar. They help tailor the editing experience to specific application needs.

* [Quick Toolbar](https://help.syncfusion.com/rich-text-editor-sdk/angular/rich-text-editor/toolbar/quick-toolbar) - Quick Toolbar shows contextual actions for selected content such as text, images, and tables. It helps users apply common operations without leaving the editing area.

* [File Browser](https://ej2.syncfusion.com/angular/demos/#/tailwind3/rich-text-editor/file-browser) - File Browser integration allows users to browse and select files within editor workflows. It supports file-based content management in a more seamless way.

* [Emoji Picker](https://help.syncfusion.com/rich-text-editor-sdk/angular/rich-text-editor/smart-editing/emoji-picker) - Emoji picker support lets users insert emojis into the editor content. It helps make messages and content more expressive and engaging.

* [Insert Media](https://ej2.syncfusion.com/angular/demos/#/tailwind3/rich-text-editor/insert-media) - Insert Media allows audio and video content to be embedded in the editor. It is useful for creating richer and more interactive documents.

* [Toolbar](https://help.syncfusion.com/rich-text-editor-sdk/angular/rich-text-editor/toolbar/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm/#toolbar-items) - Toolbar support provides editing controls and customization options for the editor. It supports floating behavior, multiple layout types, and toolbar positioning for flexible UI setups.

* [Export and Import](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm/#/tailwind3/rich-text-editor/export-document) - Export and Import support allows content to be moved between the editor and document formats such as PDF and Word. It simplifies content sharing, archiving, and document processing.

* [Undo and redo](https://help.syncfusion.com/rich-text-editor-sdk/angular/rich-text-editor/undo-redo) - Undo and redo support lets users reverse or repeat recent editing actions. It improves editing confidence by making changes easier to correct.

* [Module injection](https://help.syncfusion.com/rich-text-editor-sdk/angular/rich-text-editor/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm/#module-injection) - Module injection lets the editor load only the features that are needed. It helps reduce bundle size and keeps the component more efficient.

* [Third-party integration](https://help.syncfusion.com/rich-text-editor-sdk/angular/rich-text-editor/third-party-integration/?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm) - Third-party integration lets the editor work with external libraries and services. It extends the editor with additional capabilities beyond the built-in feature set.

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

## Other Popular Angular Components

Explore other popular Syncfusion<sup>®</sup> Angular components curated from UI components, standalone SDKs, and document solution suites.

<table>
    <tr>
        <td align="center">
            <a href="https://www.syncfusion.com/angular-components/angular-data-grid">Angular DataGrid</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/angular-components/angular-charts">Angular Charts</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/angular-components/angular-file-manager">Angular File Manager</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/gantt-sdk/angular-gantt-chart">Angular Gantt Chart</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/diagram-sdk/angular-diagram">Angular Diagram</a>
        </td>
    </tr>
    <tr>
        <td align="center">
            <a href="https://www.syncfusion.com/scheduler-sdk/angular-scheduler">Angular Scheduler</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/docx-editor-sdk/angular-docx-editor">Angular DOCX Editor</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/pdf-viewer-sdk/angular-pdf-viewer">Angular PDF Viewer</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/spreadsheet-editor-sdk/angular-spreadsheet-editor">Angular Spreadsheet Editor</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/angular-components/angular-maps-library">Angular Maps</a>
        </td>
    </tr>
</table>

## 🔄 Change log

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/richtexteditor/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## ⚖️ License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=angular-rich-text-editor-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential<sup>®</sup> Studio license and copyright applies to this distribution.