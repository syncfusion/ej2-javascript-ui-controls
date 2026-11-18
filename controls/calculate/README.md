[![coverage](http://ej2.syncfusion.com/badges/ej2-calculate/coverage.svg)](http://ej2.syncfusion.com/badges/ej2-calculate)

# JavaScript Calculate Library

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

The **JavaScript Calculate** library is an Excel-compatible formula calculation engine that parses and evaluates Excel-like / ECMA-376 formulas in any JavaScript or TypeScript application. It powers the built-in formula support of the [JavaScript Spreadsheet](https://www.syncfusion.com/javascript-ui-controls/js-spreadsheet?utm_source=npm&utm_medium=listing&utm_campaign=javascript-calculate-npm) and can also be used standalone against a simple key/value store or hosted against any workbook / grid model through `ICalculateHost`.

## Setup

To install the Calculate library, use the following command.

```sh
npm install @syncfusion/ej2-calculate
```

`@syncfusion/ej2-base` is the single runtime dependency and is installed automatically. If you consume the engine through the Spreadsheet, install `@syncfusion/ej2-spreadsheet` instead — the Calculate library ships built in and requires no separate wiring.

## Supported frameworks

The Calculate library is headless (UI-independent), so it runs wherever JavaScript or TypeScript runs. It is consumed by the Spreadsheet control across the following framework wrappers.

| [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg" height="50" />](https://www.syncfusion.com/angular-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Key features

* **Built-in formula library** ~367 pre-defined Excel-compatible / ECMA-376 functions across math, trigonometry, statistical, financial, logical, text, date-time, lookup and reference, engineering, database, information, matrix, complex-number, and array categories.
* **Custom functions** : Register user-defined functions with `defineFunction` and evaluate them alongside the built-in catalog.
* **Named ranges**: Assign meaningful names to cells or ranges and refer them in formulas.
* **Dependency tracking and recalculation**: Automatic and Manual calculation modes driven by a cell dependency graph, including volatile functions such as `RAND` and `NOW`.
* **Culture-aware argument separators**: Evaluate culture-based formulas with locale-specific argument separators and formatted numeric arguments.
* **Multi-sheet references**: Refer cells and ranges across sheets of the same workbook.
* **Standard Excel error tokens**: `#DIV/0!`, `#VALUE!`, `#REF!`, `#NAME?`, `#N/A`, `#NULL!`, `#NUM!`, and more.
* Headless key/value mode: Evaluate formulas against a simple key/value store with no workbook or UI.
* **Host adapter (`ICalculateHost`)**: Integrate with any workbook / grid / xlsx model — Spreadsheet's `Workbook` implements it out of the box.

## Getting started

The engine works with the Spreadsheet out of the box — a `Calculate` instance is created and wired internally. The following snippets cover the standalone and hosted modes.

### Standalone (key / value) — quickest way to try the engine

```ts
import { Calculate } from '@syncfusion/ej2-calculate';

const calculate = new Calculate();
calculate.setKeyValue('A1', '10');
calculate.setKeyValue('B1', '20');
calculate.setKeyValue('C1', '=A1+B1');

console.log(calculate.getKeyValue('C1')); // 30
console.log(calculate.computeExpression('=SUM(1,2,3)')); // 6

calculate..destroy(); // clear maps / listeners when finished
```

### Custom functions

```ts
calculate.defineFunction('DOUBLE', (x: string | number) => Number(x) * 2, 'Doubles a number', 'Custom');
console.log(calculate.computeFormula('=DOUBLE(21)')); // 42
```

### Hosted mode (Spreadsheet / workbook / custom grid)

Implement `ICalculateHost` and pass the host into the constructor.

```ts
import { Calculate, ICalculateHost } from '@syncfusion/ej2-calculate';

const host: ICalculateHost = {
  getValueRowCol(sheetFamilyID, row, col) {
    /* read cell value for 1-based row/col */
    return '';
  },
  setValueRowCol(sheetFamilyID, value, row, col) {
    /* write calculated value back to the model */
  },
  getSheetInfo() {
    return []; /* { visibleName, sheet }[] */
  },
  parseDate(value) {
    return {}; /* culture-aware date parse result */
  }
};

const calculate = new Calculate(host);
const familyId = calculate.createSheetFamilyID();
calculate.registerGridAsSheet('Sheet1', host, familyId);
```

## Resources

* [What's New](https://www.syncfusion.com/products/whatsnew/essential-js2?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/essential-js2?utm_medium=listing&utm_source=github)
* [E-Books](https://www.syncfusion.com/ebooks?tag=javascript&utm_medium=listing&utm_source=github)
* [Source code (GitHub)](https://github.com/syncfusion/ej2-javascript-ui-controls?utm_source=npm&utm_medium=listing&utm_campaign=javascript-calculate-npm)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/essential-js2?utm_source=npm&utm_medium=listing&utm_campaign=javascript-calculate-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-javascript-ui-controls/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/javascript?utm_source=npm&utm_medium=listing&utm_campaign=javascript-calculate-npm)
* Live chat

## Changelog

Check the changelog [here](https://help.syncfusion.com/document-processing/release-notes). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this library, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [JavaScript UI controls](https://www.syncfusion.com/javascript-ui-controls), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A [free community license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=javascript-calculate-npm) for more info.

© Copyright 2026 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.
