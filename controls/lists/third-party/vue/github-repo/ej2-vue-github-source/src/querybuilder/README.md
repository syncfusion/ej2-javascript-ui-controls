# Vue Query Builder Component (Vue Filter Component)

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

The [Vue Query Builder](https://www.syncfusion.com/vue-ui-components/vue-query-builder?utm_source=npm&utm_medium=listing&utm_campaign=vue-query-builder-npm) is a rich and responsive UI for filtering large amounts of data by creating or editing conditions that can be combined with data visualization controls like DataGrid and Charts to view the filtered data. It outputs structured JSON that can be easily parsed to create SQL queries. It allows you to create conditions and group them using AND/OR logic.

<p align="center">
    <a href="https://ej2.syncfusion.com/vue/documentation/query-builder/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=vue-query-builder-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-query-builder-npm#/bootstrap5/query-builder/default">Online demos</a> . 
    <a href="https://www.syncfusion.com/vue-components/vue-query-builder?utm_source=npm&utm_medium=listing&utm_campaign=vue-query-builder-npm">Learn more</a>
</p>

![Vue Query Builder Component](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/vue/vue-query-builder.png)

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Bootstrap logo">
  </a>
</p>

## Setup

### Create a Vue Application

You can use [`Vue CLI`](https://github.com/vuejs/vue-cli) to setup your Vue 2 application.To install Vue CLI use the following commands.

```bash
npm install -g @vue/cli
vue create quickstart
cd quickstart
npm run serve
```
Initiating a new project prompts us to choose the type of project to be used for the current application. Select the option `Default ([Vue 2] babel, eslint)` from the menu.

### Adding Syncfusion<sup>®</sup> Vue Query Builder package

All Syncfusion<sup>®</sup> Vue packages are published in [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install vue query builder package, use the following command.

```bash
npm install @syncfusion/ej2-vue-querybuilder --save
```

### Registering Vue Query Builder component

You can register the vue query builder component in your application by using the **Vue.use()**. Refer to the code example given below.

```typescript
import { QueryBuilderPlugin } from "@syncfusion/ej2-vue-querybuilder";
Vue.use(QueryBuilderPlugin);
```

> Registering **QueryBuilderPlugin** in vue, will register the query builder component along with its required child directives globally.

### Adding CSS references for Query Builder

Add CSS references needed for Query Builder in **style** section of the **App.vue** file from **../node_modules/@syncfusion** package folder.

```html
<style>
@import "../node_modules/@syncfusion/ej2-base/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-buttons/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-splitbuttons/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-dropdowns/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-inputs/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-lists/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-popups/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-calendars/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-vue-querybuilder/styles/bootstrap5.css";
</style>
```

## Add Syncfusion<sup>®</sup> Vue Query Builder component

Add the Syncfusion<sup>®</sup> Vue Query Builder by using **ejs-querybuilder** selector in **template** section of the **App.vue** file.

```html
<template>
    <div id="app">
        <ejs-querybuilder width="70%">
            <e-columns>
                <e-column field='EmployeeID' label='Employee ID' type='number' />
                <e-column field='FirstName' label='First Name' type='string' />
                <e-column field='TitleOfCourtesy' label='Title Of Courtesy' type='boolean' :values="values"/>
                <e-column field='Title' label='Title' type='string' />
                <e-column field='HireDate' label='Hire Date' type='date' format='dd/MM/yyyy' />
                <e-column field='Country' label='Country' type='string' />
                <e-column field='City' label='City' type='string' />
            </e-columns>
        </ejs-querybuilder>
    </div>
</template>
<script>
    import Vue from "vue";
    import { QueryBuilderPlugin } from "@syncfusion/ej2-vue-querybuilder";
    Vue.use(QueryBuilderPlugin);
    export default {
    data() {
        return {
        values: ['Mr.', 'Mrs.']
        };
    },
    }
</script>
```
> Refer the [Getting started with Vue3](https://ej2.syncfusion.com/vue/documentation/query-builder/getting-started-vue/) for using Syncfusion<sup>®</sup> Vue components in Vue 3 applications.


## Supported frameworks

Query Builder component is offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg" height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Key features

* [Data Sources](https://ej2.syncfusion.com/vue/documentation/query-builder/data-binding): The Query Builder can be bound to a variety of data sources, including arrays of JSON objects, complex data structures such as nested objects or arrays, and Data Manager. This allows users to filter data from a wide range of sources.
* [Template](https://ej2.syncfusion.com/vue/documentation/query-builder/templates): The Query Builder offers templates that allow users to create custom user experiences by customizing the user interface for individual values, the entire rule, and the group header. This allows users to tailor the Query Builder to their specific needs and preferences.
* [Importing and Exporting](https://ej2.syncfusion.com/vue/documentation/query-builder/import-export): The Query Builder allows users to export filters or conditions as SQL and structured JSON, and to import these filters into the Query Builder for regeneration. This makes it easy for users to save and share their filters with others.
* [Model Binding](https://ej2.syncfusion.com/vue/documentation/query-builder/model-binding): The Query Builder allows users to bind properties for the components used in the field, operator, and value user interfaces, allowing users to define the behavior and appearance of these components.
* [RTL support](https://ej2.syncfusion.com/vue/documentation/query-builder/how-to/rtl): The Query Builder supports RTL (right-to-left) mode, which aligns content from right to left. This is useful for languages that are written in a right-to-left script, such as Arabic.
* [Localization](https://ej2.syncfusion.com/vue/documentation/query-builder/global-local): The Query Builder provides inherent support for localization, allowing users to easily translate the user interface into different languages. This makes the Query Builder more accessible to users who speak languages other than English.
* Rich and responsive UI: The Query Builder provides a user-friendly interface for creating and editing conditions, making it easy for users to filter large amounts of data.
* AND/OR logic: The Query Builder allows users to group conditions using AND/OR logic, giving them greater control over the filtered data.
* Integration with data visualization controls: The Query Builder can be used in conjunction with data visualization controls like DataGrid and Charts to view the filtered data, providing a more comprehensive view of the data.
* Easy to use: The Query Builder is easy to use and can be easily integrated into any project, making it a convenient and powerful tool for filtering data.

## Resources

* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/vue?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/vue)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=vue&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums?utm_source=npm&utm_medium=listing&utm_campaign=vue-query-builder-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-vue-ui-components/issues/new?utm_source=npm&utm_medium=listing&utm_campaign=vue-query-builder-npm)
* [Request feature or report bug](https://www.syncfusion.com/feedback/vue?utm_source=npm&utm_medium=listing&utm_campaign=react-query-builder-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/components/querybuilder/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=vue-query-builder-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Vue UI components](https://www.syncfusion.com/vue-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.
See [LICENSE FILE](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=vue-query-builder-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential<sup>®</sup> Studio license and copyright applies to this distribution.
