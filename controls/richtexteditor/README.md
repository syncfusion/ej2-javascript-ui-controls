[![coverage](http://ej2.syncfusion.com/badges/ej2-richtexteditor/coverage.svg)](http://ej2.syncfusion.com/badges/ej2-richtexteditor)

# JavaScript Rich Text Editor | JavaScript Markdown Editor

The [JavaScript RichTextEditor](https://www.syncfusion.com/javascript-ui-controls/js-wysiwyg-rich-text-editor?utm_source=npm&utm_medium=listing&utm_campaign=javascript-richtexteditor-npm) is a feature-rich WYSIWYG HTML editor and WYSIWYG Markdown editor. The Rich Text Editor is widely used to create blogs, forum posts, notes sections, comment sections, messaging applications, and more. The control provides an efficient user interface for a better editing experience with mobile support. It has a variety of tools to edit and format rich content, and it return a valid HTML markup or Markdown (MD) content. It allows users to insert images, links, tables, media files and lists with modular architectures.

<div align="center">
  <h4> <a href="https://ej2.syncfusion.com/documentation/rich-text-editor/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-richtexteditor-npm">📖Getting started</a> &#x2022; 
    <a href="https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-richtexteditor-npm#/bootstrap5/rich-text-editor/tools.html">🚀Online demos</a> &#x2022; 
    <a href="https://www.syncfusion.com/javascript-ui-controls/js-wysiwyg-rich-text-editor?utm_source=npm&utm_medium=listing&utm_campaign=javascript-richtexteditor-npm">🌐Learn more</a>
    </h4>
</div>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/javascript/javascript-rich-text-editor-new.gif" alt="JavaScript Rich Text Editor Control"/>
</p>
<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/syncfusion/syncfusion-trusted-companies.webp" alt="Bootstrap logo">
  </a>
</p>

## ⚡️ Quick Start
The JavaScript Rich Text Editor is easy to set up. Simply install the package, import the module, and add the editor to your app.

### Installation

To install the Rich Text Editor and its dependencies via npm, run the following command:

```sh
npm install @syncfusion/ej2-richtexteditor --save
```

 ### Add the Editor Element

 In your HTML file, add a target element:

```html
<!DOCTYPE html>
<html>
    <head>
        <!-- Includes all CSS for the Rich Text Editor -->
    </head>
    <body>
        <!-- Your Rich Text Editor container -->
        <div id="richTextEditor"></div>
    </body>
</html>
```

### Import the Module
Import the Rich Text Editor module into your application:

```ts
import { RichTextEditor, Toolbar, Link, Image, HtmlEditor, QuickToolbar } from '@syncfusion/ej2-richtexteditor';

RichTextEditor.Inject(Toolbar, Link, Image, HtmlEditor, QuickToolbar);

```

 ### Initialize the Editor

 Create an instance of the Rich Text Editor and append it to a target element:

 ```ts
 let editor = new RichTextEditor({
    height: '300px',
    toolbarSettings: {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'Undo', 'Redo']
    }
});
editor.appendTo('#richTextEditor');
 ```

### Run the Application
Now, open your project in a browser, and the Rich Text Editor will be displayed! 🚀

<blockquote>
    <p>ℹ️ <b>Note:</b></p>
    <span>For more information on using Rich Text Editor with Syncfusion, refer to our <a href="https://ej2.syncfusion.com/documentation/rich-text-editor/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-richtexteditor-npm">Documentation</a>.</span>
</blockquote>

## 🛠️ Supported frameworks

Rich Text Editor control is also offered in following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg" height="50" />](https://www.syncfusion.com/angular-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## 🏗️ Showcase samples

* [JavaScript HTML editor demo](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#/bootstrap5/rich-text-editor/tools.html)
* [Blog posting using JavaScript rich text editor demo](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#/bootstrap5/rich-text-editor/blog-posting.html)
* [JavaScript Markdown editor demo](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#/bootstrap5/rich-text-editor/markdown-editor.html)
* [JavaScript Live HTML editor demo](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#/bootstrap5/rich-text-editor/online-html-editor.html)

## ✨ Key features

* [Edit mode](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#/bootstrap5/rich-text-editor/iframe.html) - HTML content is possible to edit in a `div` element or an `iframe` in the rich text editor.

* [@Mentions](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#/bootstrap5/rich-text-editor/mention-integration.html) - Easily mention users, tags, or items with an autocomplete suggestion list.

* [Slash Menu Support](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#/bootstrap5/rich-text-editor/smart-suggestion.html) - Quickly insert content blocks using the `/` command.

* [Checklist Suport](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#/bootstrap5/rich-text-editor/tools.html) - Allows users to create checklists (to-do lists) directly within the editor. Users can easily add interactive checkbox items to their content.

* [Accessibility & WCAG 2.0 Compliance](https://ej2.syncfusion.com/documentation/rich-text-editor/accessibility/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-richtexteditor-npm) - Ensures full accessibility support, making it user-friendly for people who rely on assistive technologies (AT) or keyboard navigation.

* [Preventing Cross-Site Scripting (XSS)](https://ej2.syncfusion.com/aspnetcore/documentation/rich-text-editor/prevent-cross-site-scripting/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-richtexteditor-npm) The Rich Text Editor allows users to edit the content with security by preventing cross-site scripting (XSS).

* [HTML code editing](https://ej2.syncfusion.com/documentation/rich-text-editor/miscellaneous/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#code-view) - The rich text editor allows users to edit the HTML code directly in the HTML code view.

* [Markdown editor](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#/bootstrap5/rich-text-editor/markdown-editor-preview.html) - The rich text editor allows you to edit Markdown content using the Markdown syntax.

* [Markdown content preview](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#/bootstrap5/rich-text-editor/markdown-editor-preview.html) - Preview of the modified Markdown content in the editor, you can give users the ability to see what the formatted content will look like before they save it.

* [Tools](https://ej2.syncfusion.com/documentation/rich-text-editor/tools.html?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#built-in-tools) - The rich text editor handles a wide range of features, including inserting images, hyperlinks, tables, formatting tools, and more.
* [Toolbar appearance](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#/bootstrap5/rich-text-editor/types.html) - The rich text editor can provide a fully customizable toolbar that allows users to access the various formatting and editing options that are available.

* [Export and Import](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#/bootstrap5/rich-text-editor/export-word.html) - Supports exporting content to PDF, and Word formats.

* [Copy and paste](https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-richtexteditor-npm") - Copy and paste from Microsoft Word, Outlook, or other editors or sources while preserving formatting, styles, and structure.

* [Undo and redo](https://ej2.syncfusion.com/documentation/rich-text-editor/miscellaneous.html?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#undoredo-manager) - Users can use undo and redo actions to reverse or repeat actions they took while editing the content.

* [Module injection](https://ej2.syncfusion.com/documentation/rich-text-editor/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm/#module-injection) - It is possible to create a editor that utilizes a modular library to load the necessary functionality on demand. This can be useful for optimizing the performance of the editor.

* [Third-party integration](https://ej2.syncfusion.com/documentation/rich-text-editor/third-party-integration/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm) - It is possible to integrate a third-party library into a rich text editor to add additional functionality or features to the editor like `Code-mirror`, `Embedly` and more.

## 🤝 Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/essential-js2?utm_source=npm&utm_medium=listing&utm_campaign=javascript-richtexteditor-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-javascript-ui-controls/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/javascript?utm_source=npm&utm_medium=listing&utm_campaign=javascript-richtexteditor-npm)
* Live chat

## 🔄 Change log
 
Check the changelog [here](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/controls/richtexteditor/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## ⚖️ License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 80+ [JavaScript UI controls](https://www.syncfusion.com/javascript-ui-controls), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A [free community license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=javascript-rich-text-editor-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential<sup>®</sup> Studio license and copyright applies to this distribution.