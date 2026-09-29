# React FileManager Component

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

The [React FileManager](https://www.syncfusion.com/react-components/react-file-manager?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm) component is a graphical user interface that allows users to manage their file system in an intuitive and efficient manner. With this component, you can easily access, edit, upload, download, and organize files and folders. It also offers a convenient way to browse and select items from the file system.

<p align="center">
   <a href="https://ej2.syncfusion.com/react/documentation/file-manager/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm">Getting Started</a> .
   <a href="https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm#/bootstrap5/file-manager/overview">Online demos</a> .
   <a href="https://www.syncfusion.com/react-components/react-file-manager?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm">Learn more</a>
</p>

<p align="center">
<img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/react/react-filemanager.png">
</P>

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Bootstrap logo">
  </a>
</p>

## Setup

### Create a React application

You can use [`create-react-app`](https://github.com/facebookincubator/create-react-app) to setup applications. To create React app use the following command.

```bash
npx create-react-app my-app --template typescript
cd my-app
npm start
```

### Adding Syncfusion FileManager package

All Syncfusion react packages are published in the [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install the react FileManager package, use the following command.

```bash
npm install @syncfusion/ej2-react-filemanager --save
```

### Adding CSS references for FileManager

Add CSS references needed for a FileManager in **src/App.css** from the **../node_modules/@syncfusion** package folder.

```css
/* refer the styles from package folder */
@import '../node_modules/@syncfusion/ej2-base/styles/bootstrap5.css';
@import '../node_modules/@syncfusion/ej2-icons/styles/bootstrap5.css';
@import '../node_modules/@syncfusion/ej2-inputs/styles/bootstrap5.css';
@import '../node_modules/@syncfusion/ej2-popups/styles/bootstrap5.css';
@import '../node_modules/@syncfusion/ej2-buttons/styles/bootstrap5.css';
@import '../node_modules/@syncfusion/ej2-splitbuttons/styles/bootstrap5.css';
@import '../node_modules/@syncfusion/ej2-navigations/styles/bootstrap5.css';
@import '../node_modules/@syncfusion/ej2-layouts/styles/bootstrap5.css';
@import '../node_modules/@syncfusion/ej2-grids/styles/bootstrap5.css';
@import "../node_modules/@syncfusion/ej2-react-filemanager/styles/bootstrap5.css";
```

### Add React FileManager component

In the **src/App.tsx** file, use the following code snippet to render the Syncfusion React FileManager component and import **App.css** to apply styles to the FileManager:

```typescript
import { FileManagerComponent } from '@syncfusion/ej2-react-filemanager';
import * as React from 'react';
function App() {
    let hostUrl = "https://physical-service.syncfusion.com/";
    return (<div className="control-section">
    <FileManagerComponent id="file" ajaxSettings={{
        url: hostUrl + "api/FileManager/FileOperations"
    }}/>
</div>);
}
export default App;
```

## Supported frameworks

The React FileManager component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Loan Calculator - [Source](https://github.com/syncfusion/ej2-showcase-react-loan-calculator), [Live Demo](https://ej2.syncfusion.com/showcase/react/loancalculator/?utm_source=npm&utm_medium=listing&utm_campaign=react-filemanager-npm#/default)

## Key features
 
* [File and directory management](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm#/bootstrap5/file-manager/directory-upload): The component allows users to upload, download, rename, sort, cut, copy, and paste files and directories.
* [Multiple layout options](https://ej2.syncfusion.com/react/documentation/file-manager/user-interface/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm#view): The component supports both large icons view and details view layout, giving users the ability to choose the display option that works best for them.
* [Multiple file providers](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm#/bootstrap5/file-manager/azure-service): The component supports a range of file providers, including Amazon S3, MS Azure, NodeJS, Google file systems, and local physical file providers, giving users flexibility in how they store and access their files.
* [Search functionality](https://ej2.syncfusion.com/react/documentation/file-manager/file-operations/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm#search): The component includes a search feature that allows users to easily locate specific files within their file system.
* [Customizable interface](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm#/bootstrap5/file-manager/custom-thumbnail): The component's interface can be customized to fit the needs and preferences of users, allowing for a personalized experience.
* [Responsive design](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm#/bootstrap5/file-manager/overview): The component is designed to be responsive, ensuring that it works seamlessly across a range of devices and screen sizes.
* [Easy integration](https://ej2.syncfusion.com/react/documentation/file-manager/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm): The component is easy to integrate into existing projects, making it a convenient and straightforward solution for file management.
* [Context menu](https://ej2.syncfusion.com/react/documentation/file-manager/user-interface/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm#context-menu): The component includes a context menu that allows users to quickly and easily access file management options.
* [Toolbar](https://ej2.syncfusion.com/react/documentation/file-manager/user-interface/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm#toolbar): The component's toolbar provides a flexible way to manage file operations, making it easy for users to perform common tasks.
* [Access control](https://ej2.syncfusion.com/react/documentation/file-manager/access-control/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm): The component allows users to define a set of access rules for their folders and files, giving them control over who can access specific resources.
* [Multiple file selection](https://ej2.syncfusion.com/react/documentation/file-manager/multiple-selection/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm): The component supports the selection of multiple files, making it easy for users to perform bulk operations.
* [Localization](https://ej2.syncfusion.com/react/documentation/file-manager/localization/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm): The component supports localization, allowing it to be used in a variety of languages and regions.
* [Accessibility](https://ej2.syncfusion.com/react/documentation/file-manager/accessibility/?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm): The component is designed with accessibility in mind, ensuring that it is usable by users with disabilities.

## Resources

* [AI Coding Assistant](https://ej2.syncfusion.com/react/documentation/ai-coding-assistants/overview)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/react?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/react)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=react&type=all)

## Support

Product support is available through following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/react-js2?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-react-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/react?utm_source=npm&utm_medium=listing&utm_campaign=react-file-manager-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-react-ui-components/blob/master/components/filemanager/CHANGELOG.md?utm_source=npm&utm_campaign=filemanager). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [React UI components](https://www.syncfusion.com/react-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-react-ui-components/blob/master/license?utm_source=npm&utm_campaign=filemanager) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.