# React Barcode Generator Component

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
> **Platform reference:** [https://ai.syncfusion.com/react/llms.txt](https://ai.syncfusion.com/react/llms.txt)

The [React Barcode](https://www.syncfusion.com/react-components/react-barcode?utm_source=npm&utm_medium=listing&utm_campaign=react-barcode-npm) (QR Code) Generator Component is a light-weight and high-performance control that displays industry-standard 1D and 2D barcodes in Angular applications. Generated barcodes are optimized for printing and on-screen scanning. It is designed for ease of use and does not require fonts.

<p align="center">
    <a href="https://ej2.syncfusion.com/react/documentation/barcode/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=react-barcode-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-barcode-npm#/bootstrap5/barcode/ean8">Online demos</a> . 
    <a href="https://www.syncfusion.com/react-components/react-barcode?utm_source=npm&utm_medium=listing&utm_campaign=react-barcode-npm">Learn more</a>
</p>

<p align="center">
	<img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/react/react-barcode.png" alt="React Barcode Component"/>
</p>


<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/syncfusion/syncfusion-trusted-companies.webp" alt="Bootstrap logo">
  </a>
</p>

## Setup

### Create a React Application

You can use [`create-react-app`](https://github.com/facebookincubator/create-react-app) to setup applications. To create React app use the following command.

```bash
npx create-react-app my-app --template typescript
cd my-app
npm start
```

### Adding Syncfusion Barcode Generator package

All Syncfusion react packages are published in the [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install the react barcode generator package, use the following command.

```bash
npm install @syncfusion/ej2-react-barcode-generator --save
```

### Add Barcode component

In the **src/App.tsx** file, use the following code snippet to render the Syncfusion Barcode component

```typescript
import { BarcodeGeneratorComponent } from '@syncfusion/ej2-react-barcode-generator';
import * as React from 'react';
import './App.css';

function App() {  
    return <BarcodeGeneratorComponent
              id="barcode"
              width={'200px'}
              height={'150px'}
              type="Ean8"
              value="11223344"></BarcodeGeneratorComponent>
};
export default App;
```

## Supported frameworks

Barcode component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Loan Calculator - [Source](https://github.com/syncfusion/ej2-showcase-react-loan-calculator), [Live Demo](https://ej2.syncfusion.com/showcase/react/loancalculator/?utm_source=npm&utm_medium=listing&utm_campaign=react-barcode-npm#/default)
* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-react-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/react/fitness-tracker-app/)

## Key features

* Barcode Symbologies - Supports a wide range of barcode symbologies, including:
	* [QR Code](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/qrcode)
	* [Data Matrix](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/datamatrix)
	* [Code 39](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/code39)
	* [Code 39 Extended](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/code39Extd)
	* [Codabar](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/default-functionality)
	* [Code 32](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/code32)
	* [Code 93](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/code93)
	* [Code 128](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/code128)
	* [Code 128A](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/code128A)
	* [Code 128B](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/code128B)
	* [Code 128C](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/code128C)
	* [EAN-8](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/ean8)
	* [EAN-13](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/ean13)
	* [UPC-A](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/upca)
	* [UPC-E](https://ej2.syncfusion.com/react/demos/#/bootstrap5/barcode/upce)
* Text Customization - Allows you to customize the text displayed.
* Exporting - Barcode can be exported as .png or .jpeg fromat image and can also be exported as base64 string.

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/react-js2?utm_source=npm&utm_medium=listing&utm_campaign=react-barcode-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-react-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/react?utm_source=npm&utm_medium=listing&utm_campaign=react-barcode-npm)
* Live chat

## Changelog

Check the changelog [here](https://ej2.syncfusion.com/react/documentation/release-notes). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 80+ [React UI components](https://www.syncfusion.com/react-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-react-ui-components/blob/master/license) for more info.

&copy; Copyright 2022 Syncfusion, Inc. All Rights Reserved. The Syncfusion Essential Studio license and copyright applies to this distribution.