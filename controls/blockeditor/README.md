[![coverage](http://ej2.syncfusion.com/badges/ej2-blockeditor/coverage.svg)](http://ej2.syncfusion.com/badges/ej2-blockeditor)

# JavaScript Block Editor Component

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
> **Platform reference:** [https://ai.syncfusion.com/javascript/llms.txt](https://ai.syncfusion.com/javascript/llms.txt)

The Syncfusion [JavaScript Block Editor](https://www.syncfusion.com/rich-text-editor-sdk/javascript-block-editor?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm) is a modern, block-based editor for creating rich and structured content. It is ideal for document editing, knowledge bases, note-taking, and content creation applications. The editor features an intuitive user interface, mobile support, and a modular architecture. It supports a variety of block types, inline elements such as mentions, links, and labels, slash commands, contextual menus, and real-time collaboration for simultaneous multi-user editing. The editor also provides well-structured content models and can generate valid HTML when required.

<p align="center">
  <a href="https://help.syncfusion.com/rich-text-editor-sdk/typescript/block-editor/getting-started?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm">Getting Started</a> .
  <a href="https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm#/fluent2/block-editor/overview.html">Online demos</a> .
  <a href="https://www.syncfusion.com/rich-text-editor-sdk/javascript-block-editor?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm">Learn more</a>
</p>

<p align="center">
<img alt="JavaScript Block Editor Control" src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/javascript/javascript-blockeditor.webp">
</p>

## ⚡️ Quick Start

This guide uses Vite as the bundler and development environment for the JavaScript Block Editor. Install [Node.js](https://nodejs.org/) 24.13.0 or higher before proceeding. For detailed information about Vite's capabilities and configuration options, refer to the [Vite documentation](https://vitejs.dev/).

### Create a TypeScript application

To set up a TypeScript application, run the following command.

```sh
npm create vite@latest my-app -- --template vanilla-ts
```

This command will prompt you to install the required packages and start the application. As Syncfusion packages are not installed yet, select the `No` option.

Then, navigate to the project directory and install the dependencies:

```sh
cd my-app
npm install
```

### Install the Block Editor package

```sh
npm install @syncfusion/ej2-blockeditor
```

### Add the CSS reference

Install the Syncfusion<sup>®</sup> [Tailwind 3](https://www.npmjs.com/package/@syncfusion/ej2-tailwind3-theme) theme package:

```sh
npm install @syncfusion/ej2-tailwind3-theme --save
```

Then add the following CSS reference to the `src/style.css` file:

```css
@import "../node_modules/@syncfusion/ej2-tailwind3-theme/styles/blockeditor/index.css";
```

### Add the Block Editor component to your application

In the `index.html` file, add a target element:

```html
<!DOCTYPE html>
<html>
  <body>
    <!-- Your Block Editor container -->
    <div id="blockEditor"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

In the `src/main.ts` file, import the Block Editor component as shown below:

```ts
import { BlockEditor } from '@syncfusion/ej2-blockeditor';
import './style.css';

const editor = new BlockEditor({
  height: '500px'
});
editor.appendTo('#blockEditor');
```

### Run the application

```sh
npm run dev
```

Now, open your project in a browser, and the Block Editor will be displayed! 🚀

<blockquote>
    <p>ℹ️ <b>Note:</b></p>
    <span>For more information on using Block Editor with Syncfusion, refer to our <a href="https://help.syncfusion.com/rich-text-editor-sdk/typescript/block-editor/getting-started?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm">Documentation</a>.</span>
</blockquote>

## ✨ Key features

* [Real-time collaboration](https://help.syncfusion.com/rich-text-editor-sdk/typescript/block-editor/real-time-collaboration?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm): Real-time collaboration enables multiple users to create and edit content simultaneously with synchronized updates across all connected clients. It helps teams work together efficiently while maintaining content consistency and reducing editing conflicts.
* [Multiple block types](https://help.syncfusion.com/rich-text-editor-sdk/typescript/block-editor/built-in-blocks/built-in-blocks?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm#block-types): Includes Heading levels 1-4, Table, Paragraph, Table, Lists, Checklist, Quote, Callout, Divider, Code block, and more.
* [Slash commands](https://help.syncfusion.com/rich-text-editor-sdk/typescript/block-editor/editor-menus?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm#slash-command-menu): Interactive `/` commands to insert or transform content blocks, with filtering and keyboard shortcuts.
* [Drag and drop](https://help.syncfusion.com/rich-text-editor-sdk/typescript/block-editor/drag-drop?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm): Reorder blocks effortlessly with built-in drag-and-drop support.
* [Rich text formatting](https://help.syncfusion.com/rich-text-editor-sdk/typescript/block-editor/editor-menus?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm#inline-toolbar): Apply styles such as Bold, Italic, Underline, Strikethrough, Uppercase and more.
* [Action menu](https://help.syncfusion.com/rich-text-editor-sdk/typescript/block-editor/editor-menus?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm#block-action-menu): Perform block-level operations such as Move, Delete, and Duplicate.
* [Contextmenu support](https://help.syncfusion.com/rich-text-editor-sdk/typescript/block-editor/editor-menus?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm#context-menu): Right-click context menus for quick block actions.
* [Inline content support](https://help.syncfusion.com/rich-text-editor-sdk/typescript/block-editor/built-in-blocks/inline-content?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm): Insert inline elements like Links, Labels and Mention directly within blocks.
* [Undo/Redo operations](https://help.syncfusion.com/rich-text-editor-sdk/typescript/block-editor/undo-redo?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm): Undo and redo support for the user interactions.
* [Events for Customization](https://help.syncfusion.com/rich-text-editor-sdk/typescript/block-editor/events?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm): The Block Editor includes a rich set of events such as block addition, removal, update, selection change, command execution, paste, and mention selection allowing developers to customize and extend functionality easily.
* [Accessibility & WCAG 2.0 Compliance](https://help.syncfusion.com/rich-text-editor-sdk/javascript/block-editor/accessibility?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm): Accessibility support for assistive technologies and keyboard navigation.
* [Keyboard Navigation](https://help.syncfusion.com/rich-text-editor-sdk/typescript/block-editor/keyboard-shortcuts?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm): Navigate and manage blocks efficiently using intuitive keyboard shortcuts for a faster editing experience.


<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com/">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Syncfusion logo">
  </a>
</p>

## 🛠️ Supported frameworks

Input controls are also offered in following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg" height="50" />](https://www.syncfusion.com/angular-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## 🏗️ Showcase samples

* Real-Time Collaborative Editing - [Live Demo](https://ej2.syncfusion.com/showcase/typescript/blockeditor-collaborative-editing/)
* Expanse Tracker - [Source](https://github.com/syncfusion/ej2-sample-ts-expensetracker), [Live Demo]( https://ej2.syncfusion.com/showcase/typescript/expensetracker/?utm_source=npm&utm_campaign=numerictextbox#/expense)
* Loan Calculator - [Source](https://github.com/syncfusion/ej2-sample-ts-loancalculator), [Live Demo]( https://ej2.syncfusion.com/showcase/typescript/loancalculator/?utm_source=npm&utm_campaign=slider)
* Cloud Pricing - [Live Demo](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=slider#/fluent2/slider/azure-pricing.html)

## 📚 Resources

* [Documentation](https://help.syncfusion.com/rich-text-editor-sdk/typescript/block-editor/getting-started?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [Custom Resource Generator](https://crg.syncfusion.com/)
* [What's New](https://www.syncfusion.com/products/whatsnew/essential-js2?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/essential-js2?utm_medium=listing&utm_source=github)
* [E-Books](https://www.syncfusion.com/ebooks?tag=javascript&utm_medium=listing&utm_source=github)

## 🤝 Support

Product support is available through following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/rich-text-editor-sdk/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-javascript-ui-controls/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/rich-text-editor-sdk?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm)
* Live chat

## 🔄 Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/controls/blockeditor/CHANGELOG.md/?utm_source=npm&utm_campaign=input). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## ⚖️ License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [JavaScript UI controls](https://www.syncfusion.com/javascript-ui-controls), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A [free community license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/license/?utm_source=npm&utm_campaign=input) for more info.

© Copyright 2026 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.
