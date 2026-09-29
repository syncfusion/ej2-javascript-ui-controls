# Angular FileManager Component

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

The [Angular FileManager](https://www.syncfusion.com/angular-components/angular-file-manager?utm_source=npm&utm_medium=listing&utm_campaign=angular-filemanager-npm) component is a graphical user interface that allows users to manage their file system in an intuitive and efficient manner. With this component, you can easily access, edit, upload, download, and organize files and folders. It also offers a convenient way to browse and select items from the file system.

<p align="center">
   <a href="https://ej2.syncfusion.com/angular/documentation/file-manager/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-filemanager-npm">Getting Started</a> .
   <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-filemanager-npm#/material/file-manager/overview">Online demos</a> .
   <a href="https://www.syncfusion.com/angular-components/angular-file-manager?utm_source=npm&utm_medium=listing&utm_campaign=angular-filemanager-npm">Learn more</a>
</p>

<p align="center">
<img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-filemanager.png">
</P>

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com/">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Bootstrap logo">
  </a>
</p>

## Setup

You can use [Angular CLI](https://github.com/angular/angular-cli) to setup your Angular applications. To install Angular CLI use the following command.

```bash
npm install -g @angular/cli
```

Create a new Angular application using below Angular CLI command.

```bash
ng new my-app
cd my-app
```

### Adding Syncfusion FileManager package

All Syncfusion Angular packages are published in [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install Angular FileManager package, use the following command.

```bash
ng add @syncfusion/ej2-angular-filemanager
```

The above command does the below configuration to your Angular app.

* Adds `@syncfusion/ej2-angular-filemanager` package and its peer dependencies to your `package.json` file.
* Import the `FileManagerModule` in your application module `app.module.ts`.
* Register the Syncfusion UI Default theme in the `angular.json` file.

This makes it easy to add the Syncfusion Angular FileManager module to your project and start using it in your application.

### Add Angular FileManager component

In src/app/app.component.ts, use `<ejs-filemanager>` selector in `template` attribute of  `@Component` directive to render the Syncfusion Angular FileManager component.

Add the FileManager component snippet in **app.component.html** as follows.

```html
<ejs-filemanager id='default-filemanager' [ajaxSettings]='ajaxSettings'>
</ejs-filemanager>
```

Refer the FileManager component snippet in **app.component.ts** as follows.

```typescript
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  styleUrls: ['app/app.component.css'],
  templateUrl: 'app/app.component.html'
})
export class AppComponent {
  public hostUrl: string = 'https://physical-service.syncfusion.com/';
  public ajaxSettings: object = {
url: this.hostUrl + 'api/FileManager/FileOperations'
  };
}
```

## Supported frameworks

The FileManager component is also offered in following list of frameworks,

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Expense Tracker - [Source](https://github.com/syncfusion/ej2-showcase-angular-expensetracker?utm_source=npm&utm_medium=listing&utm_campaign=angular-filemanager-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/expensetracker/#/dashboard?utm_source=npm&utm_medium=listing&utm_campaign=angular-filemanager-npm)
* Loan Calculator - [Source](https://github.com/syncfusion/ej2-sample-ng-loancalculator?utm_source=npm&utm_medium=listing&utm_campaign=angular-filemanager-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/loancalculator/?utm_source=npm&utm_medium=listing&utm_campaign=angular-filemanager-npm)

## Key features
 
* [File and directory management](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-file-manager-npm#/bootstrap5/file-manager/directory-upload): The component allows users to upload, download, rename, sort, cut, copy, and paste files and directories.
* [Multiple layout options](https://ej2.syncfusion.com/angular/documentation/file-manager/user-interface/?utm_source=npm&utm_medium=listing&utm_campaign=angular-file-manager-npm#view): The component supports both large icons view and details view layout, giving users the ability to choose the display option that works best for them.
* [Multiple file providers](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-file-manager-npm#/bootstrap5/file-manager/azure-service): The component supports a range of file providers, including Amazon S3, MS Azure, NodeJS, Google file systems, and local physical file providers, giving users flexibility in how they store and access their files.
* [Search functionality](https://ej2.syncfusion.com/angular/documentation/file-manager/file-operations/?utm_source=npm&utm_medium=listing&utm_campaign=angular-file-manager-npm#search): The component includes a search feature that allows users to easily locate specific files within their file system.
* [Customizable interface](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-file-manager-npm#/bootstrap5/file-manager/custom): The component's interface can be customized to fit the needs and preferences of users, allowing for a personalized experience.
* [Responsive design](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-file-manager-npm#/bootstrap5/file-manager/overview): The component is designed to be responsive, ensuring that it works seamlessly across a range of devices and screen sizes.
* [Easy integration](https://ej2.syncfusion.com/angular/documentation/file-manager/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-file-manager-npm): The component is easy to integrate into existing projects, making it a convenient and straightforward solution for file management.
* [Context menu](https://ej2.syncfusion.com/angular/documentation/file-manager/user-interface/?utm_source=npm&utm_medium=listing&utm_campaign=angular-file-manager-npm#context-menu): The component includes a context menu that allows users to quickly and easily access file management options.
* [Toolbar](https://ej2.syncfusion.com/angular/documentation/file-manager/user-interface/?utm_source=npm&utm_medium=listing&utm_campaign=angular-file-manager-npm#toolbar): The component's toolbar provides a flexible way to manage file operations, making it easy for users to perform common tasks.
* [Access control](https://ej2.syncfusion.com/angular/documentation/file-manager/access-control/?utm_source=npm&utm_medium=listing&utm_campaign=angular-file-manager-npm): The component allows users to define a set of access rules for their folders and files, giving them control over who can access specific resources.
* [Multiple file selection](https://ej2.syncfusion.com/angular/documentation/file-manager/multiple-selection/?utm_source=npm&utm_medium=listing&utm_campaign=angular-file-manager-npm): The component supports the selection of multiple files, making it easy for users to perform bulk operations.
* [Localization](https://ej2.syncfusion.com/angular/documentation/file-manager/localization/?utm_source=npm&utm_medium=listing&utm_campaign=angular-file-manager-npm): The component supports localization, allowing it to be used in a variety of languages and regions.
* [Accessibility](https://ej2.syncfusion.com/angular/documentation/file-manager/accessibility/?utm_source=npm&utm_medium=listing&utm_campaign=angular-file-manager-npm): The component is designed with accessibility in mind, ensuring that it is usable by users with disabilities.

## Resources

* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/angular?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/angular)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## Support

Product support is available through following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/angular-js2?utm_source=npm&utm_medium=listing&utm_campaign=angular-filemanager-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_source=npm&utm_medium=listing&utm_campaign=angular-filemanager-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/filemanager/CHANGELOG.md?utm_source=npm&utm_campaign=filemanager). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_campaign=filemanager) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.