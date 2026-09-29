# Angular Image Editor Component (React Photo Editor Component)

> **Using this package with an AI coding agent**
>
> Before generating Syncfusion® code, ask your AI coding agent to run the Syncfusion® setup using the following prompt:
>
> ```text
> Set up this project for Syncfusion® before generating code. Fetch
> and follow the official instructions at https://ai.syncfusion.com/,
> then report the detected platform, installed skill pack, MCP 
> status, and any required licensing action.
> ```
> The setup detects your project’s platform and loads the appropriate Syncfusion® skill pack. No Syncfusion® account or MCP key is required to install or read Syncfusion® agent skills.
>
> **Platform reference:** [https://ai.syncfusion.com/angular/llms.txt](https://ai.syncfusion.com/angular/llms.txt)

The [Angular Image Editor](https://www.syncfusion.com/angular-components/angular-image-editor?utm_source=npm&utm_medium=listing&utm_campaign=angular-image-editor-npm) component is a graphical user interface used for editing images. It provides built-in support for rotate, flip, zoom, and crop the images based on the selection. It also has support for inserting an annotations including rectangle, ellipse, line, text, and freehand drawings.

<p align="center">
    <a href="https://ej2.syncfusion.com/angular/documentation/image-editor/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-image-editor-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-image-editor-npm#/bootstrap5/image-editor/default">Online demos</a> . 
    <a href="https://www.syncfusion.com/angular-components/angular-image-editor?utm_source=npm&utm_medium=listing&utm_campaign=angular-image-editor-npm">Learn more</a>
</p>

![Angular Image Editor Component](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-image-editor.gif)

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/syncfusion/syncfusion-trusted-companies.webp" alt="Bootstrap logo">
  </a>
</p>

## Setup

### Create an Angular application

You can use [Angular CLI](https://github.com/angular/angular-cli) to setup your Angular application. To install the Angular CLI, use the following command.

```bash
npm install -g @angular/cli
```

Create a new Angular application using the following Angular CLI command.

```bash
ng new my-app
cd my-app
```

### Adding Syncfusion Angular Image Editor package

All Syncfusion Angular packages are available in [npmjs.com](https://www.npmjs.com/~syncfusionorg). To install the angular image editor package, use the following command.

```bash
ng add @syncfusion/ej2-angular-image-editors
```

The above command does the below configuration to your Angular app.
 
 * Adds `@syncfusion/ej2-angular-image-editors` package and its peer dependencies to your `package.json` file.
 * Imports the `ImageEditorModule` in your application module `app.module.ts`.
 * Registers the Syncfusion UI default theme (material) in the `angular.json` file.

This makes it easy to add the Syncfusion Angular Image Editor module to your project and start using it in your application.

### Add Syncfusion Angular Image Editor component

In **src/app/app.component.ts**, use `<ejs-imageeditor>` selector in the `template` attribute of the `@Component` directive to render the Syncfusion Angular Image Editor component.

```typescript
import { Component } from '@angular/core';
@Component({
    selector: 'app-root',
    template: `<div id="wrapperDiv" style="width:550px;height:350px;">
                <ejs-imageeditor></ejs-imageeditor>
              </div>`
})
export class AppComponent {

}
```

## Supported frameworks

Image Editor component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Key features

* [Load and save images in various formats](https://ej2.syncfusion.com/angular/documentation/image-editor/open-save): The Image Editor control allows users to load and edit existing images, as well as export the edited version in PNG, SVG, and JPG formats.
* [Selection and cropping](https://ej2.syncfusion.com/angular/documentation/image-editor/selection-cropping): The control provides selection and cropping functionality, allowing users to crop images based on a customizable selection region with various aspect ratios and the ability to reposition the selection by dragging and resizing.
* [Image transformations](https://ej2.syncfusion.com/angular/documentation/image-editor/transform): The control offers basic image editing features such as rotate, flip, zoom, and crop to adjust the appearance and composition of images.
* [Image annotation](https://ej2.syncfusion.com/angular/documentation/image-editor/annotation): Users can insert annotations including text, rectangle, ellipse, freehand draw, and lines to mark up and annotate their images.
* Image Finetunes: Includes support to adjust the brightness, contrast, saturation, hue, exposure, opacity, and blur of their images to achieve the desired look and feel.
* Image Filters: Includes support for image filtering by applying various pre-set filters such as Default, Chrome, Warm, Cold, GrayScale, Sepia, Invert to alter their appearance.
* [Customizable toolbar](https://ej2.syncfusion.com/angular/documentation/image-editor/toolbar/#custom-toolbar-items): The control includes a customizable toolbar to simplify user interaction and make it easy to access various image editing operations.
* RTL and localization support: The control supports RTL (right-to-left) mode and provides inherent support for localization, allowing users to easily translate the user interface into different languages.
* Various theme support: The component supports a range of themes, including fluent, tailwind css, bootstrap 5, material, and high contrast, giving users the ability to customize the look and feel of the image editor to match their preferences or brand guidelines.

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/angular-js2?utm_source=npm&utm_medium=listing&utm_campaign=angular-image-editor-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_source=npm&utm_medium=listing&utm_campaign=angular-image-editor-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/documenteditor/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=angular-image-editor-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use.Syncfusion<sup>®</sup> Essential Studio<sup>®</sup>licensed software, including this component, is subject to the terms and conditions ofSyncfusion<sup>®</sup> Essential Studio<sup>®</sup>[EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 80+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=angular-image-editor-npm) for more info.

&copy; Copyright 2024Syncfusion<sup>®</sup> Essential Studio<sup>®</sup>Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.
