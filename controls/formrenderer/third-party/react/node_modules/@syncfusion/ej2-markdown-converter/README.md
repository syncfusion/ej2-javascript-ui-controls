# JavaScript Markdown Converter

The JavaScript Markdown Converter is a lightweight, stateless, and efficient utility for converting **Markdown content to HTML**. It is designed to work seamlessly with Syncfusion EJ2 components, including the Markdown Editor, and other applications that require reliable Markdown processing.

<div align="center">
</div>

## ⚡️ Quick Start
The JavaScript Markdown Converter is easy to set up. Simply install the package, import the module, and use the provided static API to convert Markdown into HTML.

### Installation

To install the Markdown Converter via npm, run the following command:

```sh
npm install @syncfusion/ej2-markdown-converter --save
```

### Import the Module
Import the Markdown Converter module into your application:

```ts
import { MarkdownConverter } from '@syncfusion/ej2-markdown-converter';

```

### Convert Markdown to HTML
Use the static method parseToHtml() to convert Markdown to HTML:

 ```ts
// Convert Markdown to HTML
const markdown = '# Hello World\nThis is **Markdown** text.';
const html = MarkdownConverter.parseToHtml(markdown) as string;
console.log('HTML Output:', html);
 ```

### Run the Application
Open your project in a browser and verify the converted HTML output in the console. 🚀

## 🛠️ Supported frameworks

Markdown Converter control is also offered in following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg" height="50" />](https://www.syncfusion.com/angular-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |


## ✨ Key features

- **Markdown to HTML Conversion** – Convert Markdown content to HTML with high accuracy.

- **Preserves Formatting** – Maintains headings, lists, links, images, tables, and inline styles during conversion.

- **Configurable Options** – Customize conversion behavior with the following options:
  - `async` – Enables asynchronous conversion for large content processing.
  - `gfm` – Support GitHub Flavored Markdown.
  - `lineBreak` – Converts single line breaks into `<br>` elements..
  - `silence` – Suppresses errors and skips invalid Markdown instead of throwing exceptions.
  
  **Example:**
  ```ts
  // Convert Markdown to HTML
  const markdown = '# Hello World\nThis is **Markdown** text.';
  const html: string | Promise<string> = MarkdownConverter.parseToHtml(markdown, {
      gfm: true,
      async: true,
      lineBreak: true,
      silent: true
  }) as string;
  console.log('HTML Output:', html);
  ```

- **Modular Architecture** – Easily integrate with Rich Text Editor or use as a standalone utility.

- **Performance Optimized** – Fast and reliable conversion for large content blocks.

- **Cross-Platform Support** – Works in modern browsers and supports mobile-friendly applications.

## 🤝 Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/essential-js2?utm_source=npm&utm_medium=listing&utm_campaign=javascript-markdownconverter-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-javascript-ui-controls/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/javascript?utm_source=npm&utm_medium=listing&utm_campaign=javascript-markdownconverter-npm)
* Live chat

## 🔄 Change log
 
Check the changelog [here](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/controls/markdownconverter/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=javascript-markdown-converter-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## ⚖️ License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 80+ [JavaScript UI controls](https://www.syncfusion.com/javascript-ui-controls), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A [free community license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=javascript-markdown-converter-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential<sup>®</sup> Studio license and copyright applies to this distribution.