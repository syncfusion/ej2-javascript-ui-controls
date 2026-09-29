# Vue FileManager Component

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
> **Platform reference:** [https://ai.syncfusion.com/vue/llms.txt](https://ai.syncfusion.com/vue/llms.txt)

The [Vue FileManager](https://www.syncfusion.com/vue-components/vue-file-manager?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm) component is a graphical user interface that allows users to manage their file system in an intuitive and efficient manner. With this component, you can easily access, edit, upload, download, and organize files and folders. It also offers a convenient way to browse and select items from the file system.

<p align="center">
  <a href="https://ej2.syncfusion.com/vue/documentation/file-manager/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm">Getting Started</a>.
  <a href="https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm#/bootstrap5/file-manager/overview.html">Online demos</a>.
     <a href="https://www.syncfusion.com/vue-components/vue-file-manager?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm">Learn more</a>
</p>

<p align="center">
<img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/vue/vue-filemanager.png">
</P>

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Bootstrap logo">
  </a>
</p>

## Setup

### Create an Vue Application

You can use [`Vue CLI`](https://github.com/vuejs/vue-cli) to setup your Vue 2 applications.To install Vue CLI use the following commands.

```bash
npm install -g @vue/cli
vue create quickstart
cd quickstart
npm run serve
```
Initiating a new project prompts us to choose the type of project to be used for the current application. Select the option `Default ([Vue 2] babel, eslint)` from the menu.

### Adding Syncfusion FileManager package

All Syncfusion Vue packages are published in [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install Vue FileManager package, use the following command.

```bash
npm install @syncfusion/ej2-vue-filemanager --save
```

### Registering Vue FileManager component

You can register the FileManager component in your application by using the **Vue.use()**. Refer to the code example given below.

```typescript
import { FileManagerPlugin } from "@syncfusion/ej2-vue-filemanager";

Vue.use(FileManagerPlugin);
```
> Registering **FileManagerPlugin** in vue, will register the FileManager component along with its required child directives globally.

### Adding CSS references for FileManager

Add CSS references needed for FileManager in **style** section of the **App.vue** file from **../node_modules/@syncfusion** package folder.

```css
<style>
@import "../node_modules/@syncfusion/ej2-base/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-icons/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-inputs/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-popups/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-buttons/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-splitbuttons/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-navigations/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-layouts/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-grids/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-vue-filemanager/styles/bootstrap5.css";
</style>
```

### Add Vue FileManager component

Add the Vue FileManager by using **ejs-filemanager** selector in **template** section of the **App.vue** file.

```html
<template>
<div id="app">
    <ejs-filemanager id="file-manager" :ajaxSettings="ajaxSettings">
    </ejs-filemanager>
</div>
</template>
<script>
import Vue from "vue";
import { FileManagerPlugin } from "@syncfusion/ej2-vue-filemanager";

Vue.use(FileManagerPlugin);
export default {
data () {
    return {
       ajaxSettings:
        {
            url: "https://physical-service.syncfusion.com/api/FileManager/FileOperations"
        }
    };
}
}
</script>
```
> Refer the [Getting Started with Vue3](https://ej2.syncfusion.com/vue/documentation/file-manager/getting-started-vue-3/) for using Syncfusion Vue FileManager components in Vue 3 applications.


## Supported frameworks

The FileManager component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg" height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |


## Key features
 
* [File and directory management](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm#/bootstrap5/file-manager/directory-upload.html): The component allows users to upload, download, rename, sort, cut, copy, and paste files and directories.
* [Multiple layout options](https://ej2.syncfusion.com/vue/documentation/file-manager/user-interface/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm#view): The component supports both large icons view and details view layout, giving users the ability to choose the display option that works best for them.
* [Multiple file providers](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm#/bootstrap5/file-manager/azure-service.html): The component supports a range of file providers, including Amazon S3, MS Azure, NodeJS, Google file systems, and local physical file providers, giving users flexibility in how they store and access their files.
* [Search functionality](https://ej2.syncfusion.com/vue/documentation/file-manager/file-operations/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm#search): The component includes a search feature that allows users to easily locate specific files within their file system.
* [Customizable interface](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm#/bootstrap5/file-manager/custom-thumbnail.html): The component's interface can be customized to fit the needs and preferences of users, allowing for a personalized experience.
* [Responsive design](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm#/bootstrap5/file-manager/overview.html): The component is designed to be responsive, ensuring that it works seamlessly across a range of devices and screen sizes.
* [Easy integration](https://ej2.syncfusion.com/vue/documentation/file-manager/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm): The component is easy to integrate into existing projects, making it a convenient and straightforward solution for file management.
* [Context menu](https://ej2.syncfusion.com/vue/documentation/file-manager/user-interface/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm#context-menu): The component includes a context menu that allows users to quickly and easily access file management options.
* [Toolbar](https://ej2.syncfusion.com/vue/documentation/file-manager/user-interface/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm#toolbar): The component's toolbar provides a flexible way to manage file operations, making it easy for users to perform common tasks.
* [Access control](https://ej2.syncfusion.com/vue/documentation/file-manager/access-control/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm): The component allows users to define a set of access rules for their folders and files, giving them control over who can access specific resources.
* [Multiple file selection](https://ej2.syncfusion.com/vue/documentation/file-manager/multiple-selection/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm): The component supports the selection of multiple files, making it easy for users to perform bulk operations.
* [Localization](https://ej2.syncfusion.com/vue/documentation/file-manager/localization/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm): The component supports localization, allowing it to be used in a variety of languages and regions.
* [Accessibility](https://ej2.syncfusion.com/vue/documentation/file-manager/accessibility/?utm_source=npm&utm_medium=listing&utm_campaign=vue-file-manager-npm): The component is designed with accessibility in mind, ensuring that it is usable by users with disabilities.

## Resources

* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/vue?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/vue)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=vue&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-filemanager-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-vue-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-filemanager-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/components/filemanager/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=vue-filemanager-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Vue UI components](https://www.syncfusion.com/vue-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.
See [LICENSE FILE](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=vue-filemanager-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.