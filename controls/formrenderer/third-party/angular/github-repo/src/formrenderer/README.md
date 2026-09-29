# Angular Form Renderer Component

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

## What's Included in the Angular Form Renderer Package

The Angular Form Renderer package is a schema-driven form rendering and validation engine. It consumes a JSON form schema and renders a fully functional, Syncfusion-based form that supports field mapping, conditional visibility/disabling, expression-based value computation, custom validation, and data submission.

<p align="center">
    <a href="https://ej2.syncfusion.com/angular/documentation/introduction?utm_source=npm&utm_medium=listing&utm_campaign=angular-form-renderer-npm">Getting Started</a> .
    <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-form-renderer-npm">Online demos</a> .
    <a href="https://www.syncfusion.com/angular-components?utm_source=npm&utm_medium=listing&utm_campaign=angular-form-renderer-npm">Learn more</a>
</p>

<p align="center">
<img alt="Angular Form Renderer Component" src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-form-renderer.png">
</p>

## Form Renderer (Angular)

The [Angular Form Renderer](https://www.syncfusion.com/angular-components?utm_source=npm&utm_medium=listing&utm_campaign=angular-form-renderer-npm) component renders a fully interactive, validation-enabled form from a JSON schema. It is built on top of the Syncfusion Essential JS 2 Angular suite (inputs, dropdowns, calendars, grids, navigation, popups, and rich text editor) and provides a 1:1 Angular counterpart of the vanilla EJ2 TypeScript implementation.

#### Key features

* **Schema-driven rendering** — Consumes a JSON `FormSchema` (or Unified Schema) describing the form's version, fields (`properties`), layout, and global settings, then renders the form automatically.
* **30+ field types** — Maps every supported `component.type` to the equivalent Syncfusion EJ2 Angular component (textbox, textarea, number, checkbox, checkbox group, radio, dropdown, multiselect, date, dateTime, time, date range, switch, button, split button, signature, rating, color picker, input mask, range slider, file upload, image editor, message, panel, table, tabs, data grid, lookup, static HTML, card, rich text editor).
* **Built-in validation** — Uses the native EJ2 `FormValidator` to enforce `required`, `minLength`, `maxLength`, `min`, `max`, `regex`, and custom expression rules. Auto-applies email/URL regexes for `textbox` with `textboxType` set.
* **Conditional logic** — `visibleWhen`, `hideWhen`, `readOnlyWhen`, `disabledWhen`, `requiredWhen`, `setValueWhen`, choice-based field filtering, and conditional data sources for data grids.
* **Expression engine** — Computed fields via `expressionValue` with topological evaluation order, cycle detection, and per-target-type coercion.
* **Layouts & composition** — Single/Two/Three/Four column layouts, panels, tables, tabs, cards, and per-column width control.
* **Events** — `created`, `onChange`, `onSubmit`, `onButtonClick`, and `onFailure` for full integration.
* **Localization & RTL** — `locale` and `enableRtl` are threaded into every rendered Syncfusion Angular control.

### Usage

```ts
import { Component } from '@angular/core';
import { FormRenderer } from '@syncfusion/ej2-angular-form-renderer';

const formSchema = {
  version: '0.1.0',
  properties: {
    name:    { type: 'textbox',     label: 'Name',    required: true },
    email:   { type: 'textbox',     label: 'Email',   textboxType: 'email' },
    role:    { type: 'dropdown',    label: 'Role',    options: ['Admin', 'User'] },
    accept:  { type: 'checkbox',    label: 'Accept Terms', required: true }
  },
  layout: [
    { row: 0, col: 0, field: 'name'   },
    { row: 1, col: 0, field: 'email'  },
    { row: 2, col: 0, field: 'role'   },
    { row: 3, col: 0, field: 'accept' }
  ]
};

@Component({
  selector: 'app-root',
  template: `<ej2-form-renderer [schema]="schema" (onSubmit)="onSubmit($event)"></ej2-form-renderer>`
})
export class AppComponent {
  public schema = formSchema;
  public onSubmit(args: any) { console.log(args.data, args.isValid); }
}
```

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com/">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/syncfusion/syncfusion-trusted-companies.webp" alt="Syncfusion logo">
  </a>
</p>

## Setup

To install the form renderer and its dependent packages, use the following command.

```sh
npm install @syncfusion/ej2-angular-form-renderer
```

The Angular Form Renderer pulls in its required EJ2 Angular peers automatically (inputs, calendars, dropdowns, buttons, split buttons, grids, navigation, popups, notifications, rich text editor, image editor).

## Supported frameworks

The Form Renderer is also available in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Job Application Form - [Source](https://github.com/syncfusion/ej2-showcase-angular-form-renderer), [Live Demo](https://ej2.syncfusion.com/showcase/angular/form-renderer/?utm_source=npm&utm_campaign=form-renderer)
* Survey Builder - [Source](https://github.com/syncfusion/ej2-showcase-angular-survey), [Live Demo](https://ej2.syncfusion.com/showcase/angular/survey/?utm_source=npm&utm_campaign=form-renderer)

## Resources

* [Documentation](https://ej2.syncfusion.com/angular/documentation/introduction)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/angular?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/angular)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## Support

Product support is available through following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/angular-js2?utm_source=npm&utm_campaign=angular-form-renderer-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_medium=listing&utm_source=github)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/form-renderer/CHANGELOG.md). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.
