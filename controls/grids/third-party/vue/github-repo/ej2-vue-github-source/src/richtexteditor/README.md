# Vue Rich Text Editor Component | Vue Markdown Editor

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
> **Platform reference:** [https://ai.syncfusion.com/vue/llms.txt](https://ai.syncfusion.com/vue/llms.txt)

The [Vue Rich Text Editor](https://www.syncfusion.com/rich-text-editor-sdk/vue-rich-text-editor?utm_source=npm&utm_medium=listing&utm_campaign=vue-rich-text-editor-npm) is a feature-rich WYSIWYG HTML editor and Markdown editor. The Rich Text Editor is widely used to create blogs, forum posts, notes sections, comment sections, messaging applications, and more. The control provides an efficient user interface for a better editing experience with mobile support. It has a variety of tools to edit and format rich content, and it return a valid HTML markup or Markdown (MD) content. It allows users to insert images, links, tables, media files and lists with modular architectures.

<div align="center">
    <h4>
        <a href="https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/getting-started?utm_source=npm&utm_medium=listing&utm_campaign=vue-richtexteditor-npm">📖Getting started</a> &#x2022;
        <a href="https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-richtexteditor-npm#/tailwind3/rich-text-editor/tools.html">🚀Online demos</a> &#x2022; 
        <a href="https://www.syncfusion.com/rich-text-editor-sdk/vue-rich-text-editor?utm_source=npm&utm_medium=listing&utm_campaign=vue-richtexteditor-npm">🌐Learn more</a>
    </h4>
</div>

<p align="center">
        <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/javascript/javascript-rich-text-editor-new.gif" alt="Vue RichTextEditor Component"/>
</p>

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Bootstrap logo">
  </a>
</p>

## ⚡️ Quick Start

This guide uses Vite as the bundler and development environment for the Vue Rich Text Editor. Install [Node.js](https://nodejs.org/) 24.13.0 or higher before proceeding. For detailed information about Vite's capabilities and configuration options, refer to the [Vite documentation](https://vitejs.dev/).

### Create a Vue application

To set up a Vue application, run the following command.

```sh
npm create vite@latest my-app -- --template vue
```

This command prompts you to install the required packages and start the application. As Syncfusion packages are not installed yet, select the `No` option when prompted.

Then, navigate to the project directory and install the dependencies:

```sh
cd my-app
npm install
```

### Install the Rich Text Editor package

```sh
npm install @syncfusion/ej2-vue-richtexteditor --save
```

### Add the CSS reference

Install the Syncfusion<sup>®</sup> [Tailwind 3](https://www.npmjs.com/package/@syncfusion/ej2-tailwind3-theme) theme package:

```sh
npm install @syncfusion/ej2-tailwind3-theme --save
```

Then add the following CSS reference to the `src/App.vue` file:

```css
@import "../node_modules/@syncfusion/ej2-tailwind3-theme/styles/rich-text-editor/index.css";
```

### Add the Rich Text Editor component with required modules

Add the Vue Rich Text Editor component to the `src/App.vue` file with the basic required modules, `Toolbar`, `Image`, `Link`, `HtmlEditor`, and `QuickToolbar`, provided using the `provide` option:

```html
<template>
    <ejs-richtexteditor ref="defaultRTE" :height="400">
       <p>Start editing your content here.</p>
    </ejs-richtexteditor>
</template>

<script setup>
    import { RichTextEditorComponent as EjsRichtexteditor, Toolbar, Link, Image, HtmlEditor, QuickToolbar } from "@syncfusion/ej2-vue-richtexteditor";
    import { provide } from "vue";

    provide('richtexteditor', [Toolbar, Link, Image, HtmlEditor, QuickToolbar]);
</script>

<style>
@import "../node_modules/@syncfusion/ej2-tailwind3-theme/styles/rich-text-editor/index.css";
</style>
```

<blockquote>
    <p>ℹ️ <b>Note:</b></p>
    <span>For detailed information on module injection, refer to the Syncfusion<sup>®</sup> Rich Text Editor Module <a href="https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/module">Documentation</a>.</span>
</blockquote>

### Run the application

```sh
npm run dev
```

Now, open your project in a browser, and the Rich Text Editor will be displayed! 🚀

> Refer to the [Getting Started with Vue 2](https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/get-started/#getting-started) documentation for using Syncfusion<sup>®</sup> Vue components in Vue 2 applications.

## 🛠️ Supported frameworks

Rich Text Editor component is also offered in the following frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg" height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## 🏗️ Showcase samples

* [Vue HTML editor demo](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-rich-text-editor-npm/#/tailwind3/rich-text-editor/tools.html)
* [Blog posting using Vue rich text editor demo](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-rich-text-editor-npm/#/tailwind3/rich-text-editor/blog-posting.html)
* [Vue Markdown editor demo](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-rich-text-editor-npm/#/tailwind3/rich-text-editor/markdown-editor.html)
* [Vue live Markdown editor demo](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-rich-text-editor-npm/#/tailwind3/rich-text-editor/online-html-editor.html)

## ✨ Key features

* [AI Assistant](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-rich-text-editor-npm/#/tailwind3/rich-text-editor/ai-assistant.html) - The AI Assistant helps generate, rewrite, summarize, and refine editor content. It is designed to speed up content creation and improve editing productivity.

* [Paste from MS Word](https://ej2.syncfusion.com/vue/demos/#/tailwind3/rich-text-editor/paste-cleanup.html) - Paste from MS Word brings content into the editor with formatting cleanup and structure preservation. It helps users reuse Word content without carrying over unwanted styles.

* [IFrame](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-rich-text-editor-npm/#/tailwind3/rich-text-editor/iframe.html) - IFrame mode renders the editor content inside an isolated document context. It helps improve style encapsulation and reduces interference from external page styles.

* [@Mentions](https://ej2.syncfusion.com/vue/demos/#/tailwind3/rich-text-editor/mention-integration.html) - Mentions let users tag people, topics, or items with an autocomplete suggestion list. They make collaboration and inline referencing faster and more accurate.

* [Slash Menu](https://ej2.syncfusion.com/vue/demos/#/tailwind3/rich-text-editor/smart-suggestion.html) - Slash menu support lets users trigger editor commands by typing a forward slash. It provides a quick way to insert content blocks and formatting actions.

* [Checklist](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#/tailwind3/rich-text-editor/tools.html) - Checklist support enables users to create interactive task lists in the editor. It is useful for organizing work items and tracking progress within content.

* [Accessibility & WCAG 2.0 Compliance](https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/accessibility) - Accessibility support helps the editor work with assistive technologies and keyboard navigation. It ensures the component can be used more effectively by a broader audience.

* [Preventing Cross-Site Scripting (XSS)](https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/validation-security/xhtml-validation#cross-site-scripting-xss) - XSS protection helps validate and sanitize editor content before it is used or rendered. It reduces security risks by blocking malicious scripts and unsafe markup.

* [HTML code editing](https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/editor-value#source-code-editing) - HTML code editing lets users view and edit the underlying markup directly. It is helpful when precise control over the document structure is required.

* [Markdown editor](https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/editor-types/editor-modes#markdown-editor) - Markdown editor mode lets users create and edit content using Markdown syntax. It is ideal for lightweight authoring and text-based workflows.

* [Custom Toolbar Items](https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/tools/custom-tools) - Custom toolbar items allow additional actions to be added to the editor toolbar. They help tailor the editing experience to specific application needs.

* [Quick Toolbar](https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/toolbar/quick-toolbar) - Quick Toolbar shows contextual actions for selected content such as text, images, and tables. It helps users apply common operations without leaving the editing area.

* [File Browser](https://ej2.syncfusion.com/vue/demos/#/tailwind3/rich-text-editor/file-browser.html) - File Browser integration allows users to browse and select files within editor workflows. It supports file-based content management in a more seamless way.

* [Emoji Picker](https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/smart-editing/emoji-picker) - Emoji picker support lets users insert emojis into the editor content. It helps make messages and content more expressive and engaging.

* [Insert Media](https://ej2.syncfusion.com/vue/demos/#/tailwind3/rich-text-editor/insert-media.html) - Insert Media allows audio and video content to be embedded in the editor. It is useful for creating richer and more interactive documents.

* [Toolbar](https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/toolbar/?utm_source=npm&utm_medium=listing&utm_campaign=vue-rich-text-editor-npm#toolbar-items) - Toolbar support provides editing controls and customization options for the editor. It supports floating behavior, multiple layout types, and toolbar positioning for flexible UI setups.

* [Export and Import](https://ej2.syncfusion.com/vue/demos/#/tailwind3/rich-text-editor/export-document.html) - Export and Import support allows content to be moved between the editor and document formats such as PDF and Word. It simplifies content sharing, archiving, and document processing.

* [Undo and redo](https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/undo-redo) - Undo and redo support lets users reverse or repeat recent editing actions. It improves editing confidence by making changes easier to correct.

* [Module injection](https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=vue-rich-text-editor-npm#module-injection) - Module injection lets the editor load only the features that are needed. It helps reduce bundle size and keeps the component more efficient.

* [Third-party integration](https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/third-party-integration/?utm_source=npm&utm_medium=listing&utm_campaign=vue-rich-text-editor-npm#third-party-integration) - Third-party integration lets the editor work with external libraries and services. It extends the editor with additional capabilities beyond the built-in feature set.

## 📚 Resources

* [Documentation](https://help.syncfusion.com/rich-text-editor-sdk/vue/rich-text-editor/getting-started)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/rich-text-editor-sdk)
* [Road Map](https://www.syncfusion.com/products/roadmap/rich-text-editor-sdk)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=vue&type=all)

## 🤝 Support

Product support is available through following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/rich-text-editor-sdk)
* [GitHub issues](https://github.com/syncfusion/ej2-vue-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-richtexteditor-npm)
* Live chat

## Other Popular Vue Components

Explore other popular Syncfusion<sup>®</sup> Vue components curated from UI components, standalone SDKs, and document solution suites.

<table>
    <tr>
        <td align="center">
            <a href="https://www.syncfusion.com/vue-components/vue-grid">Vue DataGrid</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/vue-components/vue-charts">Vue Charts</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/vue-components/vue-file-manager">Vue File Manager</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/gantt-sdk/vue-gantt-chart">Vue Gantt Chart</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/diagram-sdk/vue-diagram">Vue Diagram</a>
        </td>
    </tr>
    <tr>
        <td align="center">
            <a href="https://www.syncfusion.com/scheduler-sdk/vue-scheduler">Vue Scheduler</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/docx-editor-sdk/vue-docx-editor">Vue DOCX Editor</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/pdf-viewer-sdk/vue-pdf-viewer">Vue PDF Viewer</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/spreadsheet-editor-sdk/vue-spreadsheet-editor">Vue Spreadsheet Editor</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/vue-components/vue-maps-library">Vue Maps</a>
        </td>
    </tr>
</table>

## 🔄 Change log

Check the changelog [here](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/components/richtexteditor/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=vue-rich-text-editor-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## ⚖️ License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Vue UI components](https://www.syncfusion.com/vue-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).
> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.
See [LICENSE FILE](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=vue-rich-text-editor-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential<sup>®</sup> Studio license and copyright applies to this distribution.