# Angular Query Builder Component (Angular Filter Component)

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

The [Angular Query Builder](https://www.syncfusion.com/angular-ui-components/angular-query-builder?utm_source=npm&utm_medium=listing&utm_campaign=angular-query-builder-npm) component is a rich and responsive UI for filtering large amounts of data by creating or editing conditions that can be combined with data visualization controls like DataGrid and Charts to view the filtered data. It outputs structured JSON that can be easily parsed to create SQL queries. It allows you to create conditions and group them using AND/OR logic.

<p align="center">
    <a href="https://ej2.syncfusion.com/angular/documentation/query-builder/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-query-builder-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-query-builder-npm#/bootstrap5/query-builder/default">Online demos</a> . 
    <a href="https://www.syncfusion.com/angular-components/angular-query-builder?utm_source=npm&utm_medium=listing&utm_campaign=angular-query-builder-npm">Learn more</a>

![Angular Query Builder Component](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-query-builder.png)

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Bootstrap logo">
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

### Adding Syncfusion<sup>®</sup> Angular Query Builder package

All Syncfusion<sup>®</sup> Angular packages are available in [npmjs.com](https://www.npmjs.com/~syncfusionorg). To install the angular query builder package, use the following command.

```bash
ng add @syncfusion/ej2-angular-querybuilder
```

The above command does the below configuration to your Angular app.
 
 * Adds `@syncfusion/ej2-angular-querybuilder` package and its peer dependencies to your `package.json` file.
 * Imports the `QueryBuilderModule` in your application module `app.module.ts`.
 * Registers the Syncfusion<sup>®</sup> UI default theme (material) in the `angular.json` file.

This makes it easy to add the Syncfusion<sup>®</sup> Angular Query Builder module to your project and start using it in your application.

### Add Syncfusion<sup>®</sup> Angular Query Builder component

In **src/app/app.component.ts**, use `<ejs-querybuilder>` selector in the `template` attribute of the `@Component` directive to render the Syncfusion<sup>®</sup> Angular Query Builder component.

```typescript
import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-root',
    template: `<ejs-querybuilder width="70%" [rule]="importRules">
        <e-columns>
          <e-column field="EmployeeID" label="Employee ID" type="number"></e-column>
          <e-column field="FirstName" label="First Name" type="string"></e-column>
          <e-column field="TitleOfCourtesy" label="Title Of Courtesy" type="boolean" [values]="values"></e-column>
          <e-column field="Title" label="Title" type="string"></e-column>
          <e-column field="HireDate" label="Hire Date" type="date" format="dd/MM/yyyy"></e-column>
          <e-column field="Country" label="Country" type="string"></e-column>
          <e-column field="City" label="City" type="string"></e-column>
        </e-columns>
    </ejs-querybuilder>`
})
export class AppComponent implements OnInit {
    public importRules: RuleModel;
    public values: string[] = ['Mr.', 'Mrs.'];

    ngOnInit(): void {
        this.importRules = {
            'condition': 'and',
            'rules': [{
                'label': 'EmployeeID',
                'field': 'EmployeeID',
                'type': 'number',
                'operator': 'equal',
                'value': 1
            },
            {
                'label': 'Title',
                'field': 'Title',
                'type': 'string',
                'operator': 'equal',
                'value': 'Sales Manager'
            }]
        };
    }
}
```

## Supported frameworks

Query Builder component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Key features

* [Data Sources](https://ej2.syncfusion.com/angular/documentation/query-builder/data-binding): The Query Builder can be bound to a variety of data sources, including arrays of JSON objects, complex data structures such as nested objects or arrays, and Data Manager. This allows users to filter data from a wide range of sources.
* [Template](https://ej2.syncfusion.com/angular/documentation/query-builder/template): The Query Builder offers templates that allow users to create custom user experiences by customizing the user interface for individual values, the entire rule, and the group header. This allows users to tailor the Query Builder to their specific needs and preferences.
* [Importing and Exporting](https://ej2.syncfusion.com/angular/documentation/query-builder/import-export): The Query Builder allows users to export filters or conditions as SQL and structured JSON, and to import these filters into the Query Builder for regeneration. This makes it easy for users to save and share their filters with others.
* [Model Binding](https://ej2.syncfusion.com/angular/documentation/query-builder/model-binding): The Query Builder allows users to bind properties for the components used in the field, operator, and value user interfaces, allowing users to define the behavior and appearance of these components.
* [RTL support](https://ej2.syncfusion.com/angular/documentation/query-builder/how-to/rtl): The Query Builder supports RTL (right-to-left) mode, which aligns content from right to left. This is useful for languages that are written in a right-to-left script, such as Arabic.
* [Localization](https://ej2.syncfusion.com/angular/documentation/query-builder/global-local): The Query Builder provides inherent support for localization, allowing users to easily translate the user interface into different languages. This makes the Query Builder more accessible to users who speak languages other than English.
* Rich and responsive UI: The Query Builder provides a user-friendly interface for creating and editing conditions, making it easy for users to filter large amounts of data.
* AND/OR logic: The Query Builder allows users to group conditions using AND/OR logic, giving them greater control over the filtered data.
* Integration with data visualization controls: The Query Builder can be used in conjunction with data visualization controls like DataGrid and Charts to view the filtered data, providing a more comprehensive view of the data.
* Easy to use: The Query Builder is easy to use and can be easily integrated into any project, making it a convenient and powerful tool for filtering data.

## Resources

* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/angular?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/angular)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/angular-js2?utm_source=npm&utm_medium=listing&utm_campaign=angular-query-builder-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_source=npm&utm_medium=listing&utm_campaign=angular-query-builder-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/querybuilder/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=angular-query-builder-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=angular-query-builder-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential<sup>®</sup> Studio license and copyright applies to this distribution.
