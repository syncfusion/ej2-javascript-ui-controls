# React Query Builder Component (React Filter Component)

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

The [React Query Builder](https://www.syncfusion.com/react-ui-components/react-query-builder?utm_source=npm&utm_medium=listing&utm_campaign=react-query-builder-npm) component is a rich and responsive UI for filtering large amounts of data by creating or editing conditions that can be combined with data visualization controls like DataGrid and Charts to view the filtered data. It outputs structured JSON that can be easily parsed to create SQL queries. It allows you to create conditions and group them using AND/OR logic.

<p align="center">
    <a href="https://ej2.syncfusion.com/react/documentation/query-builder/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=react-query-builder-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-query-builder-npm#/bootstrap5/query-builder/default">Online demos</a> . 
    <a href="https://www.syncfusion.com/react-components/react-query-builder?utm_source=npm&utm_medium=listing&utm_campaign=react-query-builder-npm">Learn more</a>
</p>

![React Query Builder Component](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/react/react-query-builder.png)

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

### Adding Syncfusion<sup>®</sup> React Query Builder package

All Syncfusion<sup>®</sup> react packages are published in the [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install the react query builder package, use the following command.

```bash
npm install @syncfusion/ej2-react-querybuilder --save
```

### Adding CSS references for Query Builder

Add CSS references needed for a react query builder in **src/App.css** from the **../node_modules/@syncfusion** package folder.

```css
@import "../node_modules/@syncfusion/ej2-base/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-buttons/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-splitbuttons/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-dropdowns/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-inputs/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-lists/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-popups/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-calendars/styles/bootstrap5.css";
@import "../node_modules/@syncfusion/ej2-querybuilder/styles/bootstrap5.css";
```

### Add Syncfusion<sup>®</sup> React Query Builder component

In the **src/App.tsx** file, use the following code snippet to render the Syncfusion<sup>®</sup> React Query Builder component and import **App.css** to apply styles to the query builder component:

```typescript
import { QueryBuilderComponent } from '@syncfusion/ej2-react-querybuilder';
import * as React from 'react';
import './App.css';
function App() {
    let columnData = [
    { field: 'EmployeeID', label: 'EmployeeID', type: 'number'},
    { field: 'FirstName', label: 'FirstName', type: 'string' },
    { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'] },
    { field: 'Title', label: 'Title', type: 'string' },
    { field: 'HireDate', label: 'HireDate', type: 'date', format: 'dd/MM/yyyy' },
    { field: 'Country', label: 'Country', type: 'string' },
    { field: 'City', label: 'City', type: 'string' }
];

return (<div className="control-section">
            <QueryBuilderComponent width='100%' columns={columnData} ></QueryBuilderComponent>
        </div>);
};
export default App;
```

## Supported frameworks

Query Builder component is offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Key features

* [Data Sources](https://ej2.syncfusion.com/react/documentation/query-builder/data-binding): The Query Builder can be bound to a variety of data sources, including arrays of JSON objects, complex data structures such as nested objects or arrays, and Data Manager. This allows users to filter data from a wide range of sources.
* [Template](https://ej2.syncfusion.com/react/documentation/query-builder/templates): The Query Builder offers templates that allow users to create custom user experiences by customizing the user interface for individual values, the entire rule, and the group header. This allows users to tailor the Query Builder to their specific needs and preferences.
* [Importing and Exporting](https://ej2.syncfusion.com/react/documentation/query-builder/import-export): The Query Builder allows users to export filters or conditions as SQL and structured JSON, and to import these filters into the Query Builder for regeneration. This makes it easy for users to save and share their filters with others.
* [Model Binding](https://ej2.syncfusion.com/react/documentation/query-builder/model-binding):  The Query Builder allows users to bind properties for the components used in the field, operator, and value user interfaces, allowing users to define the behavior and appearance of these components.
* [RTL support](https://ej2.syncfusion.com/react/documentation/query-builder/how-to/rtl): The Query Builder supports RTL (right-to-left) mode, which aligns content from right to left. This is useful for languages that are written in a right-to-left script, such as Arabic.
* [Localization](https://ej2.syncfusion.com/react/documentation/query-builder/global-local): The Query Builder provides inherent support for localization, allowing users to easily translate the user interface into different languages. This makes the Query Builder more accessible to users who speak languages other than English.
* Rich and responsive UI: The Query Builder provides a user-friendly interface for creating and editing conditions, making it easy for users to filter large amounts of data.
* AND/OR logic: The Query Builder allows users to group conditions using AND/OR logic, giving them greater control over the filtered data.
* Integration with data visualization controls: The Query Builder can be used in conjunction with data visualization controls like DataGrid and Charts to view the filtered data, providing a more comprehensive view of the data.
* Easy to use: The Query Builder is easy to use and can be easily integrated into any project, making it a convenient and powerful tool for filtering data.

## Resources

* [AI Coding Assistant](https://ej2.syncfusion.com/react/documentation/ai-coding-assistants/overview)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/react?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/react)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=react&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/react-js2?utm_source=npm&utm_medium=listing&utm_campaign=react-query-builder-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-react-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/react?utm_source=npm&utm_medium=listing&utm_campaign=react-query-builder-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-react-ui-components/blob/master/components/querybuilder/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=react-query-builder-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [React UI components](https://www.syncfusion.com/react-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-react-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=react-query-builder-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential<sup>®</sup> Studio license and copyright applies to this distribution.
