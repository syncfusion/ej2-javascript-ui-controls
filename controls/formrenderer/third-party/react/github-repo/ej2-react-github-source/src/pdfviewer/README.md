# React PDF Viewer Component

The [React PDF Viewer](https://www.syncfusion.com/pdf-viewer-sdk/react-pdf-viewer?utm_source=npm&utm_medium=listing&utm_campaign=react-pdf-viewer-npm) component enables you to view, annotate, prepare and fill forms, and print PDF files from your web applications.

<p align="center">
    <a href="https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=react-pdf-viewer-npm">Getting started</a> . 
    <a href="https://document.syncfusion.com/demos/pdf-viewer/react/index.html#/tailwind3/pdfviewer/default/?utm_source=npm&utm_medium=listing&utm_campaign=react-pdf-viewer-npm#/bootstrap5/pdfviewer/default">Online demos</a> . 
    <a href="https://www.syncfusion.com/pdf-viewer-sdk/react-pdf-viewer?utm_source=npm&utm_medium=listing&utm_campaign=react-pdf-viewer-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/react/react-pdf-viewer.png" alt="React PDF Viewer Component"/>
</p>

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Bootstrap logo">
  </a>
</p>

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

## Setup

### Create a React Application

You can use [`create-react-app`](https://github.com/facebookincubator/create-react-app) to setup applications. To create React app use the following command.

```bash
npx create-react-app my-app --template typescript
cd my-app
npm start
```

### Adding Syncfusion&reg; PDF Viewer package

All Syncfusion&reg; react packages are published in the [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install the react PDF Viewer package, use the following command.

```bash
npm install @syncfusion/ej2-react-pdfviewer --save
```

### Adding CSS references for PDF Viewer

Add CSS references needed for a PDF Viewer in **src/index.css** from the **../node_modules/@syncfusion** package folder.

```css
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';
@import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../node_modules/@syncfusion/ej2-lists/styles/material.css';
@import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
@import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-notifications/styles/material.css';  
@import "../node_modules/@syncfusion/ej2-react-pdfviewer/styles/material.css";
```

### Add PDF Viewer component

In the **src/index.js** file, use the following code snippet to render the Syncfusion&reg; React PDF Viewer control and import **index.css** to apply styles to the PDF Viewer:

```typescript
import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  LinkAnnotation,
  BookmarkView,
  ThumbnailView,
  Print,
  TextSelection,
  TextSearch,
  Annotation,
  FormFields,
  FormDesigner,
  Inject,
} from '@syncfusion/ej2-react-pdfviewer';
import { SampleBase } from './sample-base';
export class Default extends SampleBase {
  render() {
    return (
      <div>
        <div className="control-section">
          <PdfViewerComponent
            id="container"
            documentPath="PDF_Succinctly.pdf"
            serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer"
            toolbarSettings={{ showTooltip: true, toolbarItems: ['OpenOption',  'PanTool', 'AnnotationEditTool', 'FormDesignerEditTool', ], annotationToolbarItems: ['HandWrittenSignatureTool'], formDesignerToolbarItems: ['TextboxTool', 'PasswordTool', ] }} 
            style={{ height: '640px' }}
          >
            <Inject
              services={[
                Toolbar,
                Magnification,
                Navigation,
                LinkAnnotation,
                BookmarkView,
                ThumbnailView,
                Print,
                TextSelection,
                TextSearch,
                Annotation,
                FormFields,
                FormDesigner,
              ]}
            />
          </PdfViewerComponent>
        </div>
      </div>
    );
  }
}

const root = createRoot(document.getElementById('sample'));
root.render(<Default />);
```

## Supported frameworks

PDF Viewer component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/pdf-viewer-sdk/javascript-pdf-viewer?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/pdf-viewer-sdk/javascript-pdf-viewer?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/pdf-viewer-sdk/angular-pdf-viewer/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/pdf-viewer-sdk/angular-pdf-viewer/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/pdf-viewer-sdk/vue-pdf-viewer?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/pdf-viewer-sdk/vue-pdf-viewer?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/pdf-viewer-sdk/asp-net-core-pdf-viewer?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/pdf-viewer-sdk/asp-net-core-pdf-viewer?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/pdf-viewer-sdk/asp-net-mvc-pdf-viewer?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/pdf-viewer-sdk/asp-net-mvc-pdf-viewer?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Key features

* [View PDF Document](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/getting-started) - Open and display both the normal and the protected PDF files with AES and RC4 encryption.
* [Annotations](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/annotation/overview) - Annotate with text markup, shapes, stamps, ink, and sticky notes.
* [Form Fields](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/forms/overview) - Form filling and form designing can be done.
* [Signature](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/angular/annotation/signature-annotation) - Hand-written and digital signatures are allowed.
* [Toolbar](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/toolbar-customization/overview) - Built-in-toolbar and custom toolbars to perform user interaction of PDF Viewer functionalities.
* [Navigation](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/interactive-pdf-navigation/overview) - Easy navigation with the help of bookmarks, thumbnails, hyperlinks, and table of contents.
* [Magnification](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/magnification/magnification) - Fit to page, fit to width, and automatic (fits to the visible area).
* [Search](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/text-search/overview) - Search a text easily across the PDF document.	
* [Core Interactions](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/interaction-mode) - Allows scrolling, zooming, panning, selection, and page navigation.
* [Print](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/print/overview) - Print the entire document or a specific page directly from the browser.
* [Globalization](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/localization/default-language) - Provides inherent support to localize the UI.

## Resources

* [AI Coding Assistant](https://ej2.syncfusion.com/react/documentation/ai-tools/ai-powered-development)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/?theme=tailwind3)
* [What's New](https://www.syncfusion.com/products/whatsnew/pdf-viewer-sdk?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/pdf-viewer-sdk)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=react&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/pdf-viewer-sdk?utm_source=npm&utm_medium=listing&utm_campaign=react-pdf-viewer-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-react-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/pdf-viewer-sdk?utm_source=npm&utm_medium=listing&utm_campaign=react-pdf-viewer-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-react-ui-components/blob/master/components/pdfviewer/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=react-pdf-viewer-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [React UI components](https://www.syncfusion.com/react-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.
