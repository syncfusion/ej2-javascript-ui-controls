# Angular Block Editor Component

> **Using this package with an AI coding agent**
>
> Before generating Syncfusion® code, ask your AI coding agent to run the Syncfusion® setup using the following prompt:
>
> ```text
> Set up this project for Syncfusion® before generating code. Fetch
> and follow the official instructions at https://ai.syncfusion.com/,
> then report the detected platform, installed skill pack, MCP 
> status, and any required licensing action.
> ```
> The setup detects your project’s platform and loads the appropriate Syncfusion® skill pack. No Syncfusion® account or MCP key is required to install or read Syncfusion® agent skills.
>
> **Platform reference:** [https://ai.syncfusion.com/angular/llms.txt](https://ai.syncfusion.com/angular/llms.txt)

The Syncfusion [Angular Block Editor](https://www.syncfusion.com/rich-text-editor-sdk/angular-block-editor?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm) is a modern, block-based editor for creating rich and structured content. It is ideal for document editing, knowledge bases, note-taking, and content creation applications. The editor features an intuitive user interface, mobile support, and a modular architecture. It supports a variety of block types, inline elements such as mentions, links, and labels, slash commands, contextual menus, and real-time collaboration for simultaneous multi-user editing. The editor also provides well-structured content models and can generate valid HTML when required.

<p align="center">
  <a href="https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/getting-started?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm">Getting Started</a> .
  <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm#/fluent2/block-editor/overview">Online demos</a> .
  <a href="https://www.syncfusion.com/rich-text-editor-sdk/angular-block-editor?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm">Learn more</a>
</p>

<p align="center">
<img alt="Angular Block Editor Component" src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-blockeditor.webp">
</p>

## ⚡️ Quick Start

This guide uses the Angular CLI as the development environment for the Angular Block Editor. Install [Node.js](https://nodejs.org/) v18 or later, and the [Angular CLI](https://github.com/angular/angular-cli) v14 or later, before proceeding.

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

### Install the Block Editor package

The `@syncfusion/ej2-angular-blockeditor` package supports Angular 14 and later.

```sh
npm install @syncfusion/ej2-angular-blockeditor
```

### Add the CSS reference

Install the Syncfusion<sup>®</sup> [Tailwind 3](https://www.npmjs.com/package/@syncfusion/ej2-tailwind3-theme) theme package:

```sh
npm install @syncfusion/ej2-material3-theme --save
```

Then add the following CSS reference to the `src/styles.css` file:

```css
@import '../node_modules/@syncfusion/ej2-material3-theme/styles/blockeditor/index.css';
```

### Add the Block Editor component to your application

Add the Block Editor component to the `src/app/app.ts` file:

```typescript
import { Component } from '@angular/core';
import { BlockEditorModule } from '@syncfusion/ej2-angular-blockeditor';

@Component({
  selector: 'app-root',
  imports: [BlockEditorModule],
  template: `<ejs-blockeditor id="blockEditor" height="500px"></ejs-blockeditor>`
})
export class App {}
```

### Run the application

```sh
ng serve --open
```

Now, open your project in a browser, and the Block Editor will be displayed! 🚀

<blockquote>
    <p>ℹ️ <b>Note:</b></p>
    <span>For more information on using Block Editor with Syncfusion, refer to our <a href="https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/getting-started?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm">Documentation</a>.</span>
</blockquote>

## ✨ Key features

* [Real-time collaboration](https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/real-time-collaboration?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm): Real-time collaboration enables multiple users to create and edit content simultaneously with synchronized updates across all connected clients. It helps teams work together efficiently while maintaining content consistency and reducing editing conflicts.
* [Multiple block types](https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/built-in-blocks/built-in-blocks?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm#block-types): Includes Heading levels 1-4, Table, Paragraph, Table, Lists, Checklist, Quote, Callout, Divider, Code block, and more.
* [Slash commands](https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/editor-menus?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm#slash-command-menu): Interactive `/` commands to insert or transform content blocks, with filtering and keyboard shortcuts.
* [Drag and drop](https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/drag-drop?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm): Reorder blocks effortlessly with built-in drag-and-drop support.
* [Rich text formatting](https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/editor-menus?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm#inline-toolbar): Apply styles such as Bold, Italic, Underline, Strikethrough, Uppercase and more.
* [Action menu](https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/editor-menus?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm#block-action-menu): Perform block-level operations such as Move, Delete, and Duplicate.
* [Contextmenu support](https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/editor-menus?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm#context-menu): Right-click context menus for quick block actions.
* [Inline content support](https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/built-in-blocks/inline-content?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm): Insert inline elements like Links, Labels and Mention directly within blocks.
* [Undo/Redo operations](https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/undo-redo?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm): Undo and redo support for the user interactions.
* [Events for Customization](https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/events?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm): The Block Editor includes a rich set of events such as block addition, removal, update, selection change, command execution, paste, and mention selection allowing developers to customize and extend functionality easily.
* [Accessibility & WCAG 2.0 Compliance](https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/accessibility?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm): Accessibility support for assistive technologies and keyboard navigation.
* [Keyboard Navigation](https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/keyboard-shortcuts?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm): Navigate and manage blocks efficiently using intuitive keyboard shortcuts for a faster editing experience.

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com/">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Syncfusion logo">
  </a>
</p>

## 🛠️ Supported frameworks

blockeditor components are also offered in following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## 🏗️ Showcase samples

* Real-Time Collaborative Editing - [Live Demo](https://ej2.syncfusion.com/showcase/angular/blockeditor-collaborative-editing/)
* Loan Calculator - [Source](https://github.com/syncfusion/ej2-showcase-angular-loancalculator), [Live Demo]( https://ej2.syncfusion.com/showcase/angular/loancalculator/?utm_source=npm&utm_campaign=slider)
* Cloud Pricing - [Live Demo](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=slider#/fluent2/range-slider/azure-pricing)

## 📚 Resources

* [Documentation](https://help.syncfusion.com/rich-text-editor-sdk/angular/block-editor/getting-started?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/angular?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/angular)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## 🤝 Support

Product support is available through following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/rich-text-editor-sdk/?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/rich-text-editor-sdk?utm_source=npm&utm_medium=listing&utm_campaign=angular-blockeditor-npm)
* Live chat

## 🔄 Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/blockeditor/CHANGELOG.md/?utm_source=npm&utm_campaign=input). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## ⚖️ License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license/?utm_source=npm&utm_campaign=input) for more info.

© Copyright 2025 Syncfusion<sup>®</sup>, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio license and copyright applies to this distribution.