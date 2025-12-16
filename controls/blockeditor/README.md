[![coverage](http://ej2.syncfusion.com/badges/ej2-blockeditor/coverage.svg)](http://ej2.syncfusion.com/badges/ej2-blockeditor)

# JavaScript Block Editor Component

A modern, block-based content editor for web applications. It provides an intuitive interface for composing rich, structured documents using interactive content blocks, inline elements, and contextual tools.

## What's Included in the JavaScript Block Editor Package

The JavaScript Block Editor package includes the following,

### JavaScript Block Editor

The [JavaScript Block Editor](https://www.syncfusion.com/javascript-ui-controls/js-blockeditor?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm) is a modern, block-based editor for composing rich, structured documents. It’s ideal for document editing, knowledge bases, note-taking, and content creation tools. The editor provides an intuitive UI with mobile support and modular architecture. It offers multiple block types, inline content (mentions, links, labels), slash commands, and contextual menus, returning well-structured content models and valid HTML when needed.

<p align="center">
  <a href="https://ej2.syncfusion.com/documentation/block-editor/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm">Getting Started</a> .
  <a href="https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm#/fluent2/block-editor/overview.html">Online demos</a> .
  <a href="https://www.syncfusion.com/javascript-ui-controls/js-blockeditor?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm">Learn more</a>
</p>

<p align="center">
<img alt="JavaScript Block Editor Control" src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/javascript/javascript-blockeditor.png">
</p>

## ⚡️ Quick Start

The JavaScript Block Editor is easy to set up. Install the package, add a container, import the editor, and initialize it.

### Installation

Install via npm:

```sh
npm install @syncfusion/ej2-blockeditor

 ### Add the Editor Element

 In your HTML file, add a target element:

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Include the required CSS for the Block Editor in your build -->
  </head>
  <body>
    <!-- Your Block Editor container -->
    <div id="blockEditor"></div>
  </body>
</html>
```

### Import the Module

Import the Block Editor module into your application:

```ts
// Example import. Adjust based on your bundler/exports.
import { BlockEditor } from '@syncfusion/ej2-blockeditor';
```

### Initialize the Editor

Create an instance of the Block Editor and append it to a target element:

```ts
const editor = new BlockEditor({
  height: '500px'
});

editor.appendTo('#blockEditor');
```

### Run the Application

Now, open your project in a browser, and the Block Editor will be displayed! 🚀

<blockquote>
    <p>ℹ️ <b>Note:</b></p>
    <span>For more information on using Block Editor with Syncfusion, refer to our <a href="https://ej2.syncfusion.com/documentation/block-editor/getting-started?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm">Documentation</a>.</span>
</blockquote>

## ✨ Key features

* **Multiple block types**: Includes Heading levels 1-4, Table, Paragraph, Table, Lists, Checklist, Quote, Callout, Divider, Code block, and more.
* **Inline conten**: Insert mentions, anchors, and labels; includes cleanup of mention artifacts.
* **Slash commands**: Interactive `/` commands to insert or transform content blocks, with filtering and keyboard shortcuts.
* **Drag and drop**: Reorder blocks effortlessly with built-in drag-and-drop support.
* **Rich text formatting**: Apply styles such as Bold, Italic, Underline, Strikethrough, Uppercase and more.
* **Action menu**: Perform block-level operations such as Move, Delete, and Duplicate.
* **Contextmenu support**: Right-click context menus for quick block actions.
* **Inline content support**: Insert inline elements like Links, Labels and Mention directly within blocks.
* **Undo/Redo operations**: Undo and redo support for the user interactions.
* **Events for Customization**: The Block Editor includes a rich set of events such as block addition, removal, update, selection change, command execution, paste, and mention selection allowing developers to customize and extend functionality easily.
* **Accessibility & WCAG 2.0 Compliance**: Accessibility support for assistive technologies and keyboard navigation.
* **Keyboard Navigation**: Navigate and manage blocks efficiently using intuitive keyboard shortcuts for a faster editing experience.


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

* Expanse Tracker - [Source](https://github.com/syncfusion/ej2-sample-ts-expensetracker), [Live Demo]( https://ej2.syncfusion.com/showcase/typescript/expensetracker/?utm_source=npm&utm_campaign=numerictextbox#/expense)
* Loan Calculator - [Source](https://github.com/syncfusion/ej2-sample-ts-loancalculator), [Live Demo]( https://ej2.syncfusion.com/showcase/typescript/loancalculator/?utm_source=npm&utm_campaign=slider)
* Cloud Pricing - [Live Demo](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=slider#/fluent2/slider/azure-pricing.html)

## 📚 Resources

* [Documentation](https://ej2.syncfusion.com/documentation/block-editor/getting-started)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [Custom Resource Generator](https://crg.syncfusion.com/)
* [What's New](https://www.syncfusion.com/products/whatsnew/essential-js2?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/essential-js2?utm_medium=listing&utm_source=github)
* [E-Books](https://www.syncfusion.com/ebooks?tag=javascript&utm_medium=listing&utm_source=github)

## 🤝 Support

Product support is available through following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/essential-js2?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-javascript-ui-controls/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/javascript?utm_source=npm&utm_medium=listing&utm_campaign=javascript-blockeditor-npm)
* Live chat

## 🔄 Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/controls/blockeditor/CHANGELOG.md/?utm_source=npm&utm_campaign=input). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## ⚖️ License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [JavaScript UI controls](https://www.syncfusion.com/javascript-ui-controls), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A [free community license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/license/?utm_source=npm&utm_campaign=input) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup>, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio license and copyright applies to this distribution.
