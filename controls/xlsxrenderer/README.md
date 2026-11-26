[![coverage](http://ej2.syncfusion.com/badges/ej2-xlsx-renderer/coverage.svg)](http://ej2.syncfusion.com/badges/ej2-xlsx-renderer)

# JavaScript Excel to PDF Converter Library


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


The **JavaScript Excel to PDF Converter** library (`@syncfusion/ej2-xlsx-renderer`) is a high-fidelity client-side conversion engine that converts Excel workbooks (`.xlsx` files, binary buffers, or in-memory workbook models) into PDF documents in any JavaScript or TypeScript application. It can be used standalone against any workbook model.


## Setup


To install the Excel to PDF Converter library, use the following command.


```sh
npm install @syncfusion/ej2-xlsx-renderer
```


`@syncfusion/ej2-base`, `@syncfusion/ej2-pdf`, and `@syncfusion/ej2-xlsx` are runtime dependencies and are installed automatically.


## Supported frameworks


The Excel to PDF Converter library is headless (UI-independent), so it runs wherever JavaScript or TypeScript runs. It can be used from the following framework wrappers.


| [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg" height="50" />](https://www.syncfusion.com/angular-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; |
| :-----: | :-----: | :-----: | :-----: | :-----: |


## Key features


* **High-fidelity workbook conversion**: Convert multi-sheet workbooks to PDF while preserving fonts, formatting, number formats, alignments, borders, and merged cells.
* **Layout and pagination options**: Full page setup support including paper sizes (Letter, Legal, A3, A4, etc.), orientations (Portrait, Landscape), custom margins, page breaks, and fit options (`FitSheetOnOnePage`, `FitAllColumnsOnOnePage`, `FitAllRowsOnOnePage`).
* **Header and footer tokens**: Expand standard header/footer tokens (`&P`, `&N`, `&A`, `&F`, `&D`, `&T`) across left, center, and right sections, with support for first-page and different odd/even headers.
* **Row and column headings**: Render row numbers and column letter headings matching Excel print settings.
* **Gridlines display control**: Control gridline visibility based on worksheet view settings or explicit print options (`Auto`, `Visible`, `Invisible`).
* **Visual elements and shapes**: Support for images (PNG, JPEG), AutoShapes, callouts, text boxes, and basic chart representations.
* **Conditional formatting & comments**: Render data bars, color scales, icon sets, cell comments, and threaded comments.
* **Rich text run rendering**: Support for multi-style inline rich text runs inside individual cells.
* **Headless execution**: Operates with zero DOM dependency in Web Workers, Node.js, and modern browser environments.


## Getting started


The converter is used standalone. The following snippets cover workbook and raw file conversion.


### Standalone — quickest way to convert an Excel workbook


```ts
import { ExcelToPdfConverter } from '@syncfusion/ej2-xlsx-renderer';
import { Workbook } from '@syncfusion/ej2-xlsx';


// 1. Create or open an Excel workbook using ej2-xlsx
const workbook = Workbook.create();
const sheet = workbook.addSheet('Report');
sheet.cell(1, 1).value = 'Revenue Summary';
sheet.cell(2, 1).value = 125000;


// 2. Convert to PDF
const converter = new ExcelToPdfConverter({
  includeGridlines: true,
  renderHeadings: true
});


const result = await converter.convert(workbook);
console.log('Total pages generated:', result.pageCount);
console.log('PDF bytes length:', result.pdf.length);
```


### Convert using raw `.xlsx` file bytes


```ts
import { convertExcelToPdf } from '@syncfusion/ej2-xlsx-renderer';


// Convert directly from ArrayBuffer or Uint8Array
const result = await convertExcelToPdf(xlsxArrayBuffer, {
  layoutOptions: 1 // FitSheetOnOnePage
});


// Download or save the PDF file
const blob = new Blob([result.pdf], { type: 'application/pdf' });
```


### Convert selected worksheets


```ts
import { ExcelToPdfConverter } from '@syncfusion/ej2-xlsx-renderer';


const converter = new ExcelToPdfConverter();
const result = await converter.convert(workbook, {
  sheets: [workbook.sheets[0].name]
});
```


## Resources


* [What's New](https://www.syncfusion.com/products/whatsnew/essential-js2?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/essential-js2?utm_medium=listing&utm_source=github)
* [E-Books](https://www.syncfusion.com/ebooks?tag=javascript&utm_medium=listing&utm_source=github)
* [Source code (GitHub)](https://github.com/syncfusion/ej2-javascript-ui-controls?utm_source=npm&utm_medium=listing&utm_campaign=javascript-xlsx-renderer-npm)


## Support


Product support is available through the following mediums.


* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/essential-js2?utm_source=npm&utm_medium=listing&utm_campaign=javascript-xlsx-renderer-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-javascript-ui-controls/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/javascript?utm_source=npm&utm_medium=listing&utm_campaign=javascript-xlsx-renderer-npm)
* Live chat


## Changelog


Check the changelog [here](https://help.syncfusion.com/document-processing/release-notes). Get minor improvements and bug fixes every week to stay up to date with frequent updates.


## License and copyright


> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this library, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [JavaScript UI controls](https://www.syncfusion.com/javascript-ui-controls), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).


> A [free community license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.


See [LICENSE FILE](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=javascript-xlsx-renderer-npm) for more info.


© Copyright 2026 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.
