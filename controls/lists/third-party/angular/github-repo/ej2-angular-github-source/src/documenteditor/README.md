# Angular DOCX Editor Component

The [Angular DOCX Editor](https://www.syncfusion.com/docx-editor-sdk/angular-docx-editor?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm) component is a feature rich UI component with document editing capabilities like Microsoft Word. Also known as the document editor, it is used to create, edit, view, and print Word documents. It provides all the common Word processing features including editing text, formatting content, resizing images and tables, finding and replacing text, bookmarks, tables of contents, track changes, commenting, restrict editing, printing, importing and exporting Word documents.

An example [DOCX Editor server-side Web API projects for ASP.NET MVC, ASP.NET Core, and Java is available in GitHub](https://github.com/SyncfusionExamples/EJ2-DocumentEditor-WebServices?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm) which contains all the mandatory Web APIs for opening Word documents, paste with formatting, restrict editing, spell-checking, and saving documents other than SFDT/DOCX format. Apart from these operations, all the user interactions and editing operations run purely in the client-side provides much faster editing experience to the users.

Syncfusion provides a predefined [DOCX Editor server docker image](https://hub.docker.com/r/syncfusion/word-processor-server?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm) targeting ASP.NET Core 2.1 framework. You can directly pull this docker image and deploy it in server on the go. You can also create own docker image by customizing the existing [docker project from GitHub](https://github.com/SyncfusionExamples/Word-Processor-Server-Docker?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm).

<p align="center">
  <a href="https://help.syncfusion.com/document-processing/word/word-processor/angular/getting-started?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm">Getting Started</a> . 
  <a href="https://document.syncfusion.com/demos/docx-editor/angular/#/tailwind3/document-editor/default?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm#">Online demos</a> . 
  <a href="https://www.syncfusion.com/docx-editor-sdk/angular-docx-editor?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm">Learn more</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-word-processor.png" alt="Angular DOCX Editor Component">
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
> and follow the official instructions at https://ai.syncfusion.com/,
> then report the detected platform, installed skill pack, MCP 
> status, and any required licensing action.
> ```
> The setup detects your project’s platform and loads the appropriate Syncfusion skill pack. No Syncfusion account or MCP key is required to install or read Syncfusion agent skills.
>
> **Platform reference:** [https://ai.syncfusion.com/docx-editor-sdk/llms.txt](https://ai.syncfusion.com/docx-editor-sdk/llms.txt)

## Setup

### Create an Angular Application

To create an example **Angular** app use the following commands.

```bash
git clone https://github.com/angular/quickstart.git quickstart
cd quickstart
npm install
```

### Adding Syncfusion DOCX Editor package

All Syncfusion Angular packages are published in [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install Angular Document editor package, use the following command.

```bash
npm install @syncfusion/ej2-angular-documenteditor --save
```

### Adding CSS references for DOCX Editor

Install the styles package from npm using the following command:

```bash
npm install @syncfusion/ej2-tailwind3-theme
```

The Tailwind 3 theme package includes an `index.css` file that automatically imports all required DOCX Editor styles. Add the required DOCX Editor theme style reference to **src/styles/styles.css** file.

```html
@import "../node_modules/@syncfusion/ej2-tailwind3-theme/styles/document-editor/index.css";
@import "../node_modules/@syncfusion/ej2-tailwind3-theme/styles/document-editor-container/index.css";
```

### Registering DocumentEditorContainer module

Import DocumentEditorContainer module into Angular application(app.module.ts) from the package @syncfusion/ej2-angular-documenteditor [src/app/app.module.ts].

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DocumentEditorContainerModule } from '@syncfusion/ej2-angular-documenteditor';
import { AppComponent } from './default.component';

/**
 * Module
 */
@NgModule({
    imports: [
        BrowserModule,
        DocumentEditorContainerModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

## Add DOCX Editor component

Modify the template in [src/app/app.component.ts] file to render the Document Editor component.
Add the Angular Document Editor by using <ejs-documenteditorcontainer> selector in template section of the **app.component.ts** file.

```typescript
import { Component, OnInit } from '@angular/core';
import { ToolbarService } from '@syncfusion/ej2-angular-documenteditor';

@Component({
    selector: 'app-container',
    // specifies the template string for the DocumentEditorContainer component
    template: `<ejs-documenteditorcontainer serviceUrl="https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/" [enableToolbar]=true> </ejs-documenteditorcontainer>`,
    providers: [ToolbarService]
})
export class AppComponent implements OnInit {

    ngOnInit(): void {
    }
}
```

> The web API ('https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/') is created specifically for our online demos. You should host web API on your side, refer the [web service documentation](https://help.syncfusion.com/document-processing/word/word-processor/angular/web-services/core?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm) for more information.

## Supported frameworks

The Angular DOCX Editor (Document Editor) component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/docx-editor-sdk/javascript-docx-editor?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/docx-editor-sdk/javascript-docx-editor?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/docx-editor-sdk/react-docx-editor?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/docx-editor-sdk/react-docx-editor?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/docx-editor-sdk/vue-docx-editor?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/docx-editor-sdk/vue-docx-editor?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/docx-editor-sdk/asp-net-core-docx-editor?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/docx-editor-sdk/asp-net-core-docx-editor?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/docx-editor-sdk/asp-net-mvc-docx-editor?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/docx-editor-sdk/asp-net-mvc-docx-editor?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Expense Tracker - [Source](https://github.com/syncfusion/ej2-showcase-angular-expensetracker?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/expensetracker/#/dashboard?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm)
* Loan Calculator - [Source](https://github.com/syncfusion/ej2-sample-ng-loancalculator?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/loancalculator/?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm)
* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-angular-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/angular/fitness-tracker-app/)

## Key features

* [Document Authoring](https://document.syncfusion.com/demos/docx-editor/angular/?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm#/tailwind3/document-editor/default) -  Allows to create a document with supported elements and formatting options.
  * Supported elements - Supports document elements like text, inline image, table, hyperlink, fields, bookmark, table of contents, footnote and endnote, section, header, and footer.
  * Styles - Supports character and paragraph styles.
  * Editing - Supports all the common editing and formatting operations.
  * History - Supports options to perform undo redo operations.
  * Find and replace - Provides support to find and replace text within the document.
  * [Track changes](https://document.syncfusion.com/demos/docx-editor/angular/?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm#/tailwind3/document-editor/track-changes) - Suppports tracking the content insertion and deletion.
  * [Commenting](https://document.syncfusion.com/demos/docx-editor/angular/?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm#/tailwind3/document-editor/comments) - Supports adding a comment, replying to an existing comment or mark as resolved and more.
  * [Form filling](https://document.syncfusion.com/demos/docx-editor/angular/?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm#/tailwind3/document-editor/form-fields) - Supports designing fillable forms in Word document and fill the forms.
  * [Restrict editng](https://document.syncfusion.com/demos/docx-editor/angular/?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm#/tailwind3/document-editor/document-protection) - Supports restricting edit permission for a region in Word document and control what type of changes can be made to the document .
* Export - Provides the options to export the documents in the client-side as `Syncfusion Document Text (*.sfdt)` and `Word document (*.docx)`. With server-side library, exporting as other formats can be achieved.
* Import - Provides the options to import the native `Syncfusion Document Text (*.sfdt)` format documents in the client-side. With server-side library, importing other formats can be achieved.
* Print - Provides the options to print the documents.
* Clipboard - Provides support to cut, copy, and paste rich text contents within the component. Also allows pasting simple text from other applications. Paste rich text from other applications using server-side library.
* User interface - Provides intuitive user friendly interface to perform various operations.
  * Context menu - Provides context menu.
  * Dialog - Provides dialog for inserting elements such as hyperlink, table and formatting such as font, paragraph, list, style, table.
  * Options pane - Provides options pane to perform find and replace operations.

## Resources

* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/docx-editor-sdk?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/docx-editor-sdk)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/angular-js2?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm)
* Live chat

## Other Popular Angular Components

Explore other popular Syncfusion<sup>®</sup> Angular components curated from UI components, standalone SDKs, and document solution suites.

<table>
    <tr>
        <td align="center">
            <a href="https://www.syncfusion.com/angular-components/angular-data-grid">Angular DataGrid</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/angular-components/angular-charts">Angular Charts</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/angular-components/angular-file-manager">Angular File Manager</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/gantt-sdk/angular-gantt-chart">Angular Gantt Chart</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/diagram-sdk/angular-diagram">Angular Diagram</a>
        </td>
    </tr>
    <tr>
        <td align="center">
            <a href="https://www.syncfusion.com/scheduler-sdk/angular-scheduler">Angular Scheduler</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/spreadsheet-editor-sdk/angular-spreadsheet-editor">Angular Spreadsheet Editor</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/pdf-viewer-sdk/angular-pdf-viewer">Angular PDF Viewer</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/rich-text-editor-sdk/angular-rich-text-editor">Angular Rich Text Editor</a>
        </td>
        <td align="center">
            <a href="https://www.syncfusion.com/angular-components/angular-maps-library">Angular Maps</a>
        </td>
    </tr>
</table>

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/documenteditor/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=angular-word-processor-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.