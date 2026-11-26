# JavaScript PPTX Editor Control

The [JavaScript PPTX Editor](https://www.syncfusion.com/pptx-editor-sdk/javascript-pptx-editor?utm_source=npm&utm_medium=listing&utm_campaign=javascript-pptx-editor-npm) control is a feature-rich UI component that enables you to view, navigate, present, print, and export PowerPoint presentations (PPTX) online without requiring Microsoft PowerPoint or server-side rendering services. Also known as the presentation viewer and editor, it provides a high-performance, accurate solution for displaying PPTX files directly in the browser with an intuitive user experience. In the initial phase, the SDK is available as a viewer only. Editing capabilities will be considered in a future phase.

This example demonstrates how to open and view PowerPoint presentations directly in the browser with high performance and accuracy. The PPTX Editor provides an intuitive user experience for navigating slides, presenting content, printing presentations, and exporting files. It supports essential PowerPoint elements and is optimized to efficiently handle both small and large presentations.

<p align="center">
  <a href="https://help.syncfusion.com/document-processing/powerpoint/pptx-editor/javascript-es5/getting-started?utm_source=npm&utm_medium=listing&utm_campaign=javascript-pptx-editor-npm">Getting Started</a> .
  <a href="https://document.syncfusion.com/demos/pptx-editor/javascript/?utm_source=npm&utm_medium=listing&utm_campaign=javascript-pptx-editor-npm#/tailwind3/pptx-editor/default.html">Online demos</a> . 
  <a href="https://www.syncfusion.com/pptx-editor-sdk/javascript-pptx-editor?utm_source=npm&utm_medium=listing&utm_campaign=javascript-pptx-editor-npm">Learn more</a>  
</p>

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Syncfusion">
  </a>
</p>

## Setup

To install PPTX Editor and its dependent packages, use the following command.

```sh
npm install @syncfusion/ej2-pptxeditor
```

## Add PPTX Editor control

To add the JavaScript Pptx editor control in the application, place the following code in the **App.ts** file.

```typescript
import { PptxEditor, Toolbar, ThumbnailView, Magnification, Navigation, Print, SlideShow } from '@syncfusion/ej2-pptxeditor';

PptxEditor.Inject(Toolbar, ThumbnailView, Magnification, Navigation, Print, SlideShow);

let editor: PptxEditor = new PptxEditor({ id: 'pptxEditor', documentPath: "/Sample.pptx" });
editor.appendTo('#PptxEditor');
```

Add an HTML div element to act as the PPTXEditor control in **index.html** using the following code.

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <title>Essential JS 2</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <meta name="description" content="Essential JS 2" />
    <meta name="author" content="Syncfusion" />
    <link rel="shortcut icon" href="resources/favicon.ico" />
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" />

    <!--style reference from app-->
    <link href="/styles/styles.css" rel="stylesheet" />
</head>

<body>
    <!--Element which will render as PPTXEditor -->
    <div id="PptxEditor"></div>
</body>

</html>
```

## Supported frameworks

The PPTX Editor control is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg" height="50" />](https://www.syncfusion.com/pptx-editor-sdk/angular-pptx-editor?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/pptx-editor-sdk/angular-pptx-editor?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/pptx-editor-sdk/react-pptx-editor?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/pptx-editor-sdk/react-pptx-editor?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/pptx-editor-sdk/vue-pptx-editor?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/pptx-editor-sdk/vue-pptx-editor?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/pptx-editor-sdk/asp-net-core-pptx-editor?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/pptx-editor-sdk/asp-net-core-pptx-editor?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/pptx-editor-sdk/asp-net-mvc-pptx-editor?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/pptx-editor-sdk/asp-net-mvc-pptx-editor?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Key features

* Browser-based viewing - Open and view PowerPoint presentations directly in modern web browsers without installing Microsoft PowerPoint.
* Rich slide rendering - Display slides containing text, images, shapes, tables, and other presentation elements with high fidelity.
* Easy navigation - Move through slides using thumbnails, keyboard shortcuts, mouse interactions, or touch gestures.
* Zoom support - Zoom in and out to review slide content with improved readability.
* High performance - Utilize slide virtualization to quickly load and navigate large presentations.
* Slideshow mode - Present slides in full-screen mode for a seamless presentation experience.
* Speaker notes - View presentation notes alongside slides to assist during reviews and presentations.
* Print support - Print presentations directly from the PPTX Editor.
* Export support - Save and export presentations in PowerPoint (.pptx) format.

## Resources

* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/pptx-editor-sdk?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/pptx-editor-sdk?utm_medium=listing&utm_source=github)
* [E-Books](https://www.syncfusion.com/ebooks?tag=javascript&utm_medium=listing&utm_source=github)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/essential-js2?utm_source=npm&utm_medium=listing&utm_campaign=javascript-pptx-editor-npm#)
* [GitHub issues](https://github.com/syncfusion/ej2-javascript-ui-controls/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/javascript?utm_source=npm&utm_medium=listing&utm_campaign=javascript-pptx-editor-npm#)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/controls/pptxeditor/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=javascript-pptx-editor-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [JavaScript UI controls](https://www.syncfusion.com/javascript-ui-controls), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A [free community license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=javascript-pptx-editor-npm) for more info.

© Copyright 2026 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.
