# ej2-vue-schedule

The [Vue Scheduler](https://www.syncfusion.com/vue-ui-components/vue-scheduler?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) component is an event calendar that facilitates almost all the basic Outlook and Google Calendar features, allowing the user to plan and manage appointments and time efficiently. It receives event data from a variety of data sources, such as an array of JSON objects, OData web services, RESTful or WCF services, and [`DataManager`](https://ej2.syncfusion.com/vue/documentation/data/) with built-in load on demand support to reduce the data transfer and load time. Also, it is availed with the multiple resources support that allots an unique individual space for more than one resources on the same calendar.

<p align="center">
    <a href="https://ej2.syncfusion.com/vue/documentation/schedule/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm">Getting started</a> .
    <a href="https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm#/bootstrap5/schedule/overview">Online demos</a> .
    <a href="https://www.syncfusion.com/vue-components/vue-scheduler?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm">Learn more</a>
</p>
<p align="center">
<img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/vue/vue-scheduler.png" alt="Vue Schedule Component"/>
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
> and follow the official instructions at https://ai.syncfusion.com,
> then report the detected platform, installed skill pack, MCP
> status, and any required licensing action.
> ```
> The setup detects your project’s platform and loads the appropriate Syncfusion skill pack. No Syncfusion account or MCP key is required to install or read Syncfusion agent skills.
>
> **Platform reference:** [https://ai.syncfusion.com/vue/llms.txt](https://ai.syncfusion.com/vue/llms.txt)

## Setup

### Create a Vue Application

You can use [`Vue CLI`](https://github.com/vuejs/vue-cli) to setup your Vue 2 applications.To install Vue CLI use the following commands.

```bash
npm install -g @vue/cli
vue create quickstart
cd quickstart
npm run serve
```
Initiating a new project prompts us to choose the type of project to be used for the current application. Select the option `Default ([Vue 2] babel, eslint)` from the menu.

### Adding Syncfusion Schedule package

All Syncfusion Vue packages are published in [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install Vue schedule package, use the following command.

```bash
npm install @syncfusion/ej2-vue-schedule --save
```

### Registering Schedule Component

You can register the Schedule component in your application by using the **Vue.use()**. Refer to the code example given below.

```typescript
import { SchedulePlugin } from '@syncfusion/ej2-vue-schedule';
Vue.use(SchedulePlugin);
```

> Registering **SchedulPlugin** in vue, will register the schedule component along with its required child directives globally.
### Adding CSS references for Schedule

Add CSS references needed for Schedule in **style** section of the **App.vue** file from **../node_modules/@syncfusion** package folder.

```html
<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-calendars/styles/material.css';
@import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
@import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';
@import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-schedule/styles/material.css';
</style>
```

### Module injection

In the **app.vue** file, use the following code to inject the required modules.


```typescript
provide: {
    schedule: [Day, Week, WorkWeek, Month, Agenda]
}

```

## Add Schedule Component

Add the Vue Schedule by using **ejs-schedule** selector in **template** section of the **App.vue** file.

```html
<template>
    <div id='app'>
        <ejs-schedule :selectedDate='selectedDate' :eventSettings='eventSettings'></ejs-schedule>
    </div>
</template>
<script>
    import Vue from "vue";
    import { SchedulePlugin, Day, Week, WorkWeek, Month, Agenda } from '@syncfusion/ej2-vue-schedule';
    Vue.use(SchedulePlugin);
    export default {
        data() {
            return {
                eventSettings: { dataSource: [{
                    Id: 1,
                    Subject: 'Meeting',
                    StartTime: new Date(2023, 1, 15, 10, 0),
                    EndTime: new Date(2023, 1, 15, 12, 30)
                    }] },
                selectedDate: new Date(2023, 1, 15)
            }
        },
        provide: {
            schedule: [Day, Week, WorkWeek, Month, Agenda]
        }
    };
</script>
<style>
@import '../../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-calendars/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-inputs/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-vue-schedule/styles/material.css';
</style>
```

## Supported Frameworks

Schedule component is also available in following list of frameworks.


| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Fare calendar - [Live Demo](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/resources.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm)

## Key Features

* [Multiple views](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/views.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - A wide variety of built-in views are available: `day, week, work week, month, timeline day, timeline week, timeline work week, timeline month, timeline year, year, agenda and month agenda`. Easily configure each individual view with different, view-specific options.
* [Data binding](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/remote-data.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - Seamless data binding with various client-side and remote data sources thus allowing the data to load on demand by default to reduce the data transfer and loading time.
* [Drag and drop](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/external-dragdrop.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - Appointments can be easily rescheduled to another time by dragging and dropping them onto the required time slots.
* Appointment resize - An appointment’s time can be easily extended by resizing its start or end handlers.
* [Multiple resources](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/resource-grouping.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - Supports planning and management of events for multiple resources and allows to group them under appropriate resources. Also, supports date-wise grouping, linked appointments and other group related customizations.
* [Virtual acrolling](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/virtual-scrolling.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - Supports to load a large number of resources and events instantly as the users scroll.
* [Recurrence appointment](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/recurrence-events.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - Allows the user to repeat a set of events on a daily, weekly, monthly, or yearly basis.
* [Template](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/events-template.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - The key elements like events, date header, work cells, time cells, event tooltip, resource header, date range text, and quick info popup comes with the default template support which allows the flexible end-user customization to embed any kind of text, images, or styles to it.
* [Timezone](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/timezone.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) -  Regardless of whatever time zone your system follows, Schedule supports setting your own required time zone value to it as well as to each event – thus allowing the events to display on its exact local time.
* [Timescale](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/time-scale.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - Allows to display customized time duration, with clear and accurate depiction of appointments across the appropriate time slots.
* [Customizable working days and hours](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/work-days.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - Users can set specific [work hour](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/work-hours.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) range which is visually differentiated with active colour. Also, the working days collection can be customized with specific days, so that the remaining days will be considered as [weekend](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/hide-weekend.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm).
* [Custom editor template](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/editor-template.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - Template option is availed for event editor, thus allowing the users to add their own custom editor design and also provides option to add additional fields onto the default event editor.
* [Adaptive rendering](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/month-agenda.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - Adapts with optimal user interfaces for mobile and desktop form-factors, thus helping the user’s application to scale elegantly across all the form-factors without any additional effort.
* [Export to Excel](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/excel-export.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - Provides the options to Export the events to Excel formats.
* [Export and Import ICS](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/calendar-export-import.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - Provides the options to Export and Import the events as ICS formats.
* [Keyboard interaction](https://ej2.syncfusion.com/vue/demos/#/bootstrap5/schedule/keyboard-interaction.html?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - All the common actions such as traversing through the appointments, multiple cell selection, add/edit/delete the appointments, navigate to other views, dates and much more can be performed through keyboard inputs.
* [Localization](https://ej2.syncfusion.com/vue/documentation/schedule/localization.html#localization?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - All the static text and date content can be localized to any desired language. Also, it can be displayed with appropriate time mode and date-format as per the localized language.
* [RTL](https://ej2.syncfusion.com/vue/documentation/schedule/localization.html#rtl?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) - Supports displaying the component to display in the direction from right to left.

## Resources

* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/vue?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/vue)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=vue&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-vue-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/components/schedule/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Vue UI components](https://www.syncfusion.com/vue-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.
See [LICENSE FILE](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=vue-scheduler-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.
