# ej2-calendars

The calendar package contains date and time components such as calendar, date picker, date range picker, date time picker, and time picker. These components come with options to disable dates, restrict selection, and show custom events. It also has documentation and support available under commercial and community licenses. Please visit [www.syncfusion.com](https://www.syncfusion.com/) to get started.

<p align="center" style="width:400px; margin:0 auto;">
  <img src="https://ej2.syncfusion.com/products/images/calendar/readme.gif" alt="Calendar components">
</p>

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component is subject to the terms and conditions of Syncfusion's EULA (https://www.syncfusion.com/eula/es/). To acquire a license, you can purchase one at https://www.syncfusion.com/sales/products or start a free 30-day trial here  (https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community license (https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

## Setup

To install `Calendar` and its dependent packages, use the following command.

```sh
npm install @syncfusion/ej2-calendars
```

## Components

List of components available in the package:

* [Calendar](#calendar)
* [DatePicker](#datepicker)
* [TimePicker](#timepicker)
* [DateTimePicker](#datetimepicker)
* [DateRangePicker](#daterangepicker)

### Calendar

The `calendar` is a graphical user interface component that displays a Gregorian Calendar and allows selection of a date.

#### Key features

* [Date range](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=calendar#/material/calendar/date-range.html) - Restricts the range of dates that can be selected by using the `min` and `max` properties.
* [Customization](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=calendar#/material/calendar/special-dates.html) - Allows complete control over the appearance of the calendar component.
* [Month or year selection](https://ej2.syncfusion.com/documentation/calendar/calendar-views?lang=typescript#calendar-views) - Provides a flexible option to select only a month or year as the date value.
* [First day of week](https://ej2.syncfusion.com/documentation/calendar/how-to.html?lang=typescript#change-the-first-day-of-the-week) - Changes the first day of all weeks in every month.
* [Week number](https://ej2.syncfusion.com/documentation/calendar/how-to/render-the-calendar-with-week-numbers?lang=typescript#render-the-calendar-with-week-numbers) - Displays the week number of the selected date in the calendar by enabling the week number option.
* [Disabled dates](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=calendar#/material/calendar/disabled.html) - Disables any date to prevent the user from selecting that date.
* [Start and depth view](https://ej2.syncfusion.com/documentation/calendar/calendar-views?lang=typescript#view-restriction) - Calendar has `month`, `year`, and `decade` views that provide flexibility to select dates.
* [Highlight weekends](https://ej2.syncfusion.com/documentation/calendar/customization?lang=typescript#highlight-weekends) - The calendar supports to highlighting every weekend in a month.
* [Globalization](https://ej2.syncfusion.com/documentation/calendar/globalization?lang=typescript#calendar) - Supports globalization (internationalization and localization) to translate the names of months, days, and the today button text to any supported language.

#### Resources

* [Getting started](https://ej2.syncfusion.com/documentation/calendar/getting-started?utm_source=npm&utm_campaign=calendar#getting-started)
* [API reference](https://ej2.syncfusion.com/documentation/api/calendar?utm_source=npm&utm_campaign=calendar/)
* [View online demos](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=calendar#/material/calendar/default)
* [Product page](https://www.syncfusion.com/products/javascript-ui-controls/calendar)

### DatePicker

The `date picker` is a graphical user interface component that allows selection or entry of a date value.

#### Key features

The date picker is inherited from the calendar component. So, all the key features of calendar can be accessed in the date picker component. Additionally, it has some specific features such as `date format` and `strict mode`.

* [Date format](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=datepicker#/material/datepicker/date-format.html) - The date picker control’s input value can be custom formatted apart from the default culture’s specific date format.
* [Strict mode](https://ej2.syncfusion.com/documentation/datepicker/strict-mode?utm_source=npm&utm_campaign=datepicker) - The strictMode is an act that allows entry only of valid dates within the specified min or max range in a text box.

#### Resources

* [Getting started](https://ej2.syncfusion.com/documentation/datepicker/getting-started?utm_source=npm&utm_campaign=datepicker#getting-started)
* [API reference](https://ej2.syncfusion.com/documentation/api/datepicker?utm_source=npm&utm_campaign=datepicker/)
* [View online demos](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=datepicker#/material/datepicker/default)
* [Product page](https://www.syncfusion.com/products/javascript-ui-controls/datepicker)

### TimePicker

`Time picker` is a simple and intuitive interface component that allows selection of a time value from the popup list or setting a desired time value.

#### Key features

* [Time range](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=timepicker#/material/timepicker/time-range.html) - Restricts the entry or selection of time values within a specific range of time by using `min` and `max` properties.
* [Time format](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=timepicker#/material/timepicker/time-format.html) - Apart from the default culture specific time format, the time picker control’s input value can also be custom formatted.
* [Strict mode](https://ej2.syncfusion.com/documentation/timepicker/strict-mode?lang=typescript#timepicker) - The strictMode is an act that allows entry of only valid time values within the specified min and max range in a text box.
* [Disabled time](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=timepicker#/material/timepicker/list-formatting.html) - Any number of time values can be disabled in the popup list items to prevent selection of those times.
* [Time intervals](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=timepicker#/material/timepicker/list-formatting.html) - Allows populating the time list with intervals between the times in the popup list to enable selection of proper time value.
* [Customization](https://ej2.syncfusion.com/documentation/timepicker/how-to/css-customization?lang=typescript#css-customization) - The appearance of the time picker can be customized completely.
* [Time list with duration](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=timepicker#/material/timepicker/list-formatting.html) - Supports customization of the control’s popup list items with time duration.
* [Globalization](https://ej2.syncfusion.com/documentation/timepicker/globalization?lang=typescript#timepicker) - Supports globalization (internationalization and localization) to update time popup list values to match any specified culture.

#### Resources

* [Getting started](https://ej2.syncfusion.com/documentation/timepicker/getting-started?utm_source=npm&utm_campaign=timepicker#getting-started)
* [API reference](https://ej2.syncfusion.com/documentation/api/timepicker?utm_source=npm&utm_campaign=timepicker)
* [View online demos](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=timepicker#/material/timepicker/default)
* [Product page](https://www.syncfusion.com/products/javascript-ui-controls/timepicker)

### DateTimePicker

The `date time picker` is a graphical user interface component that allows an end user to enter or select a date and time values from a pop-up calendar and time list pop-up.

#### Key features

The date time picker is inherited from the date picker and time picker component. So, all the key features of the date picker and time picker component can be accessed in the date time picker component. Additionally, it has some specific features such as `Date time range` and `Date time format`, which are described below.

* [Date time range](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=datetimepicker#/material/datetimepicker/date-time-range.html) - Restricts the entry or selection of values within a specific range of dates and times by using `min` and `max` properties.
* [Date time format](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=datetimepicker#/material/datetimepicker/date-time-format.html) - The control’s input value can be custom formatted apart from the default culture’s specific date time format.

#### Resources

* [Getting started](https://ej2.syncfusion.com/documentation/datetimepicker/getting-started?utm_source=npm&utm_campaign=datetimepicker#getting-started)
* [API reference](https://ej2.syncfusion.com/documentation/api/datetimepicker?utm_source=npm&utm_campaign=datetimepicker)
* [View online demos](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=datetimepicker#/material/datetimepicker/default)
* [Product page](https://www.syncfusion.com/products/javascript-ui-controls/datetimepicker)

### DateRangePicker

The `date range picker` is a graphical user interface control that allows an end user to select start and end date values as a range from a calendar pop-up or by entering the value directly in the input element.

#### Key features

* [Preset ranges](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=daterangepicker#/material/daterangepicker/presets.html) - Defines the preset ranges to select the frequently used date range by the end users.
* [Range restriction](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=daterangepicker#/material/daterangepicker/date-range.html) - This control restricts the entry or selection of values within a specific range of date by defining the min and max properties.
* [Limit the selection range](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=daterangepicker#/material/daterangepicker/day-span.html) - Directs the end user to select only the date range with specific minimum and maximum number of days’ count by setting the minDays and maxDays options.
* [First day of week](https://ej2.syncfusion.com/documentation/daterangepicker/customization?lang=typescript#first-day-of-week) - Changes the first day of weeks in every month.
* [Strict mode](https://ej2.syncfusion.com/documentation/daterangepicker/range-restriction?lang=typescript#strict-mode) - The strictMode is an act that allows entry only of a valid date within the specified min and max range in a textbox.
* [Customization](https://ej2.syncfusion.com/documentation/daterangepicker/customization?lang=typescript#customization) - The appearance of the component can be customized completely.
* [Format](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=daterangepicker#/material/daterangepicker/date-format.html) - The control’s input value can be custom formatted apart from the default culture’s specific date range format.
* [Globalization](https://ej2.syncfusion.com/documentation/daterangepicker/globalization?lang=typescript#globalization) - Supports globalization (internationalization and localization) to translate the names of months, days, and button text to any supported language.

#### Resources

* [Getting started](https://ej2.syncfusion.com/documentation/daterangepicker/getting-started?utm_source=npm&utm_campaign=daterangepicker#getting-started)
* [API reference](https://ej2.syncfusion.com/documentation/api/daterangepicker?utm_source=npm&utm_campaign=daterangepicker)
* [View online demos](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=daterangepicker#/material/daterangepicker/default)
* [Product page](https://www.syncfusion.com/products/javascript-ui-controls/daterangepicker)

## Supported Frameworks

Date time components are also offered in the following list of frameworks.

* [Angular](https://github.com/syncfusion/ej2-angular-ui-components/tree/master/components/calendars?utm_source=npm&utm_campaign=calendars)
* [React](https://github.com/syncfusion/ej2-react-ui-components/tree/master/components/calendars?utm_source=npm&utm_campaign=calendars)
* [VueJS](https://github.com/syncfusion/ej2-vue-ui-components/tree/master/components/calendars?utm_source=npm&utm_campaign=calendars)
* [ASP.NET Core](https://www.syncfusion.com/products/aspnet-core-ui-controls/calendar)
* [ASP.NET MVC](https://www.syncfusion.com/products/aspnet-mvc-ui-controls/calendar)
* [JavaScript (ES5)](https://www.syncfusion.com/products/javascript-ui-controls/calendar)

## Showcase samples

1. Expanse tracker ([Source](https://github.com/syncfusion/ej2-sample-ts-expensetracker), [Live Demo](https://ej2.syncfusion.com/showcase/typescript/expensetracker/#/dashboard?utm_source=npm&utm_campaign=daterangepicker)) - Date range picker component is used in this showcase sample to depict total expenses.

2. Loan calculator ([Source](https://github.com/syncfusion/ej2-sample-ts-loancalculator), [Live Demo](https://ej2.syncfusion.com/showcase/typescript/loancalculator/?utm_source=npm&utm_campaign=datepicker)) - Date picker component in this showcase sample displays the balance from monthly payment.

## Support

Product support is available through the following mediums.

* Creating incident in Syncfusion [Direct-trac](https://www.syncfusion.com/support/directtrac/incidents?utm_source=npm&utm_campaign=calendar) support system or [Community forum](https://www.syncfusion.com/forums/essential-js2?utm_source=npm&utm_campaign=calendar).
* New [GitHub issue](https://github.com/syncfusion/ej2-javascript-ui-controls/issues/new).
* Ask your queries in Stack Overflow with tag `syncfusion`, `ej2`, and so on.

## License

Check the license details [here](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/license).

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/controls/calendars/CHANGELOG.md).

© Copyright 2019 Syncfusion, Inc. All Rights Reserved. The Syncfusion Essential Studio license and copyright applies to this distribution.
