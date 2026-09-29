# Angular Barcode Generator Component

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

The [Angular Barcode](https://www.syncfusion.com/angular-components/angular-barcode?utm_source=npm&utm_medium=listing&utm_campaign=angular-barcode-npm) (QR Code) Generator Component is a light-weight and high-performance control that displays industry-standard 1D and 2D barcodes in Angular applications. Generated barcodes are optimized for printing and on-screen scanning. It is designed for ease of use and does not require fonts.

<p align="center">
    <a href="https://ej2.syncfusion.com/angular/documentation/barcode/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-barcode-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-barcode-npm#/bootstrap5/barcode/default-functionalities">Online demos</a> . 
    <a href="https://www.syncfusion.com/angular-components/angular-barcode?utm_source=npm&utm_medium=listing&utm_campaign=angular-barcode-npm">Learn more</a>
</p>

<p align="center">
	<img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-barcode.png" alt="Angular Barcode Control"/>
</p>


<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/syncfusion/syncfusion-trusted-companies.webp" alt="Bootstrap logo">
  </a>
</p>

## Setup

### Create an Angular Application

You can use [Angular CLI](https://github.com/angular/angular-cli) to setup your Angular applications. To install the Angular CLI, use the following command.

```bash
npm install -g @angular/cli
```

Create a new Angular application using the following Angular CLI command.

```bash
ng new my-app
cd my-app
```

### Adding Syncfusion Barcode Generator package

All Syncfusion Angular packages are available in [npmjs.com](https://www.npmjs.com/~syncfusionorg). To install the Angular barcode generator package, use the following command.

```bash
npm install @syncfusion/ej2-angular-barcode-generator --save
```

The above command does the below configuration to your Angular app.
 
 * Adds `@syncfusion/ej2-angular-barcode-generator` package and its peer dependencies to your `package.json` file.
 * Imports the `BarcodeGeneratorAllModule`, `QRCodeGeneratorAllModule`, `DataMatrixGeneratorAllModule` in your application module `app.module.ts`.
 * Registers the Syncfusion UI default theme (material) in the `angular.json` file.

This makes it easy to add the Syncfusion Angular Barcode Generator module to your project and start using it in your application.

### Add Barcode Generator component

In **src/app/app.component.ts**, use `<ejs-barcodegenerator>` selector in the `template` attribute of the `@Component` directive to render the Syncfusion Angular Barcode Generator component.

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `<ejs-barcodegenerator id="barcode" width="200px" height="150px" mode="SVG" type="Codabar" value="123456789">`
})
export class AppComponent implements OnInit {}
```

## Supported frameworks

Barcode component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Expense Tracker - [Source](https://github.com/syncfusion/ej2-showcase-angular-expensetracker?utm_source=npm&utm_medium=listing&utm_campaign=angular-barcode-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/expensetracker/#/dashboard?utm_source=npm&utm_medium=listing&utm_campaign=angular-barcode-npm)
* Loan Calculator - [Source](https://github.com/syncfusion/ej2-sample-ng-loancalculator?utm_source=npm&utm_medium=listing&utm_campaign=angular-barcode-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/loancalculator/?utm_source=npm&utm_medium=listing&utm_campaign=angular-barcode-npm)
* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-angular-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/angular/fitness-tracker-app/)

## Key features

* Barcode Symbologies - Supports a wide range of barcode symbologies, including:
	* [QR Code](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/qrCode)
	* [Data Matrix](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/datamatrix)
	* [Code 39](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/code39)
	* [Code 39 Extended](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/code39Extd)
	* [Codabar](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/codabar)
	* [Code 32](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/code32)
	* [Code 93](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/Code93)
	* [Code 128](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/Code128)
	* [Code 128A](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/Code128A)
	* [Code 128B](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/Code128B)
	* [Code 128C](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/Code128C)
	* [EAN-8](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/default-functionalities)
	* [EAN-13](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/ean13)
	* [UPC-A](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/upcA)
	* [UPC-E](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/barcode/upcE)
* Text Customization - Allows you to customize the text displayed.
* Exporting - Barcode can be exported as .png or .jpeg fromat image and can also be exported as base64 string.

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/angular-js2?utm_source=npm&utm_medium=listing&utm_campaign=angular-barcode-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_source=npm&utm_medium=listing&utm_campaign=angular-barcode-npm)
* Live chat

## Changelog

Check the changelog [here](https://ej2.syncfusion.com/angular/documentation/release-notes?utm_source=npm&utm_medium=listing&utm_campaign=angular-barcode-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 80+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=angular-barcode-npm) for more info.

&copy; Copyright 2022 Syncfusion, Inc. All Rights Reserved. The Syncfusion Essential Studio license and copyright applies to this distribution.