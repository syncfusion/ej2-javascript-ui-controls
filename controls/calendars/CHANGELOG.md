# Changelog

## [Unreleased]

## 16.4.54 (2019-02-19)

### DatePicker

#### Bug Fixes

- Issue with, “DatePicker not restoring the initial value on form reset” has been fixed.

### DateRangePicker

#### Bug Fixes

- Issue with, “DateRangePicker not restoring the initial value on form reset” has been fixed.

- Now year values are shown in the selected range of decade view.

### DateTimePicker

#### Bug Fixes

- Issue with, “DateTimePicker not restoring the initial value on form reset” has been fixed.

### TimePicker

#### Bug Fixes

- Issue with, “TimePicker not restoring the initial value on form reset” has been fixed.

## 16.4.53 (2019-02-13)

### DatePicker

#### Bug Fixes

- Fixed the form validation class `ng-dirty` issue in Angular forms.

### DateRangePicker

#### Bug Fixes

- Fixed the form validation class `ng-dirty` issue in Angular forms.

### DateTimePicker

#### Bug Fixes

- Fixed the form validation class `ng-dirty` issue in Angular forms.

### TimePicker

#### Bug Fixes

- Fixed the form validation class `ng-dirty` issue in Angular forms.

## 16.4.52 (2019-02-05)

### Calendar

#### Bug Fixes

- Tabindex support has been provided.

### DatePicker

#### New Features

- Now, date type skeleton support has been provided for the format property.

#### Bug Fixes

- Tabindex support has been provided.

### DateTimePicker

#### New Features

- Now, scrollTo support has been added for the TimePicker pop-up element of the DateTimePicker. This is used to set the scroll position to the given time value when no value is selected in the popup list.

#### Bug Fixes

- Tabindex support has been provided.

### DateRangePicker

#### Bug Fixes

- Tabindex support has been provided.

### TimePicker

#### Bug Fixes

- Tabindex support has been provided.

## 16.4.48 (2019-01-22)

### TimePicker

#### Breaking Changes

- TimePicker pop-up will position at the center of the viewport in mobile resolution.

## 16.4.47 (2019-01-16)

### TimePicker

#### Bug Fixes

- TimePicker will allow assigning string value when type system configuration is disabled.

## 16.4.46 (2019-01-08)

### TimePicker

#### New Features

- Pop-up positioning support has been provided.

## 16.4.45 (2019-01-02)

### DatePicker

#### Bug Fixes

- DatePicker will allow assigning string value when type system configuration is disabled.

## 16.4.44 (2018-12-24)

### DatePicker

#### Bug Fixes

- Fixed the `allowEdit` issue in mobile mode.

### DateRangePicker

#### Bug Fixes

- Fixed the localization issue in preset `custom range` element.

### TimePicker

#### Bug Fixes

- Fixed the component destroy issue when `showClearButton` in disabled state.

## 16.4.42 (2018-12-14)

### Calendar

#### New Features

- Added the Islamic calendar support.

### DatePicker

#### New Features

- Added the Islamic DatePicker support.

### DateTimePicker

#### New Features

- Added the Islamic DateTimePicker support.

## 16.4.40-beta (2018-12-10)

### DatePicker

#### Bug Fixes

- Selecting a value with the Enter key will not bubble up the event to its ancestor elements.

### TimePicker

#### Bug Fixes

- Selecting a value with the Enter key will not bubble up the event to its ancestor elements.

## 16.3.31 (2018-11-07)

### DatePicker

#### Bug Fixes

- Fixed the form reset issue in Internet Explorer.

### DateRangePicker

#### Bug Fixes

- Fixed the form reset issue in Internet Explorer.

## 16.3.29 (2018-10-31)

### DatePicker

#### Bug Fixes

- Added multiple class name support for the `cssClass` property.

### DateRangePicker

#### Bug Fixes

- Added multiple class name support for the `cssClass` property.

### TimePicker

#### Bug Fixes

- Added multiple class name support for the `cssClass` property.

## 16.3.27 (2018-10-23)

### DateRangePicker

#### Bug Fixes

- Fixed the form reset handler issue while destroying the component.

## 16.3.25 (2018-10-15)

### DateRangePicker

#### Bug Fixes

- Fixed the `strictMode` issue.

## 16.3.17 (2018-09-12)

### Calendar

#### New Features

- Multiple date selection support has been included.

### DateTimePicker

#### Bug Fixes

- Now, the pop-up element can be append to the target element by using the `AppendTo` argument in open event.

### DateRangePicker

#### Bug Fixes

- Now, the pop-up element can be append to the target element by using the `AppendTo` argument in open event.

### TimePicker

#### Bug Fixes

- Now, the pop-up element can be append to the target element by using the `AppendTo` argument in open event.

## 16.2.52 (2018-09-04)

### DateTimePicker

#### Bug Fixes

- DateTimePicker value will now accept the date values (without time) while entering value in the input element.

## 16.2.50 (2018-08-28)

### DatePicker

#### Bug Fixes

- Added `AppendTo` argument in the open event to  specifies which node to be appended on the pop-up element.

- Fixed the validation issue in mobile devices.

### DateRangePicker

#### Bug Fixes

- The Value can be obtained in the code-behind, while posting the selected value from the DateRangePicker control.

- Now, the entire properties of pop-up element of DateRangePicker can be customized in the `open` event.

## 16.2.47 (2018-08-07)

### DateRangePicker

#### Bug Fixes

- Now the `firstDayOfWeek` property will be updated based on the culture specific. Also, to get the firstday related information, then it is mandatory to load the `weekData.json` file from the `CLDR` data.

- Angular form rest for the invalid value in the textbox issue has been fixed.

### DatePicker

#### Bug Fixes

- Now the `firstDayOfWeek` property will be updated based on the culture specific. Also, to get the firstday related information, then it is mandatory to load the `weekData.json` file from the `CLDR` data.

### DateTimePicker

#### Bug Fixes

- Now the `firstDayOfWeek` property will be updated based on the culture specific. Also, to get the firstday related information, then it is mandatory to load the `weekData.json` file from the `CLDR` data.

### Calendar

#### Bug Fixes

- Now the `firstDayOfWeek` property will be updated based on the culture specific. Also, to get the firstday related information, then it is mandatory to load the `weekData.json` file from the `CLDR` data.

## 16.2.46 (2018-07-30)

### DatePicker

#### New Features

- Support for `allowEdit` property has been provided for DatePicker component that allows to edit the value in the input element.

#### Bug Fixes

- Float label state are not restored after resetting the form issue has been fixed.

### DateRangePicker

#### New Features

- Support for `allowEdit` property has been provided for DateRangePicker component that allows to edit the value in the input element.

### DateTimePicker

#### New Features

- Support for `allowEdit` property has been provided for DateTimePicker component that allows to edit the value in the input element.

#### Bug Fixes

- Float label state are not restored after resetting the form issue has been fixed.

### TimePicker

#### New Features

- Support for `allowEdit` property has been provided for TimePicker component that allows to edit the value in the input element.

#### Bug Fixes

- Float label state are not restored after resetting the form issue has been fixed.

## 16.2.45 (2018-07-17)

### DateRangePicker

#### New Features

- Added the custom object support for the value property with the start and end keys.

## 16.2.44 (2018-07-10)

### DateRangePicker

#### Bug Fixes

- Float label state are not restored after resetting the form issue has been fixed.

## 16.2.43 (2018-07-03)

### DateRangePicker

#### Bug Fixes

- Invalid value are not cleared in the textbox after resetting the form issue has been fixed.

## 16.2.41 (2018-06-25)

### Calendars

#### Breaking Changes

- Newly added `ColorPicker` component in input package requires `SplitButton` dependency, So now it's mandatory to include the `ej2-splitbuttons.umd.min.js` in system.js configuration if your using system.js module loader.
Update the `system.js` configuration while going with this version and above.

- Today button will act as a primary button in high contrast, bootstrap and fabric themes.

#### New Features

- Event arguments for all Calendar components has been streamlined.

### DateRangePicker

#### Breaking Changes

- `Value` parameter obtained in change event argument has been changed from `string type to array of date object` and the `string` value from the input element can be obtained from the `text` parameter of the argument.

### TimePicker

#### Breaking Changes

- In change event, the parameter `e` has been changed to `event`.

## 16.1.49 (2018-06-20)

### DateTimePicker

- TimePicker popup is not closing while clicking outside of the window issue has been fixed.

## 16.1.48 (2018-06-13)

### DateRangePicker

#### Bug Fixes

- Selection is not maintained in the month with start date in the left calendar, while performing drill down in the right calendar has been fixed.

## 16.1.45 (2018-05-23)

### DateRangePicker

#### New Features

- `DrillDown` support has been provided for DateRangePicker component that allows to quick navigate back and forth from month and year views to select a range easier.

- `Value` property support has been provided for DateRangePicker component to set a date range.

## 16.1.42 (2018-05-15)

### DateTimePicker

#### Bug Fixes

- `ngOnDestroy` related issues with destroying DateTimePicker component has been fixed.

## 16.1.38 (2018-05-02)

### Common

#### Bug Fixes

- Now, Date parser will return the `null` value while parsing invalid date string.

## 16.1.35 (2018-04-17)

### DateRangePicker

#### Bug Fixes

- `focusIn` and `focusOut` methods has been included.

- `focus` and `blur` events has been included.

## 16.1.34 (2018-04-10)

### Common

#### Bug Fixes

- Issue with Calendar date generation in `UTC+00:00` time zone has been fixed.

## 16.1.33 (2018-04-03)

### Common

#### Bug Fixes

- Rendering issue on going with `UTC+00:00` time zone has been fixed.

## 16.1.32 (2018-03-29)

### DateRangePicker

#### Bug Fixes

- DateRangePicker popup will not open while enabling the `readOnly` property.

### DateTimePicker

#### Bug Fixes

- Focus and blur events triggers multiple times in DateTimePicker control has been fixed.

- DateTimePicker throws script error while clicking today button in IE browser has been fixed.

#### Breaking Changes

- The out of range value will be the value of the component and highlighted with error class.

### Calendar

#### Bug Fixes

- Calendar throws script error while clicking today button in IE browser has been fixed.

### DatePicker

#### Bug Fixes

- DatePicker throws script error while clicking today button in IE browser has been fixed.

### TimePicker

#### Breaking Changes

- The out of range value will be the value of the component and highlighted with error class.

## 16.1.29 (2018-03-13)

### Common

#### Bug Fixes

- `Width` property with string type value issue has been fixed.

## 16.1.28 (2018-03-09)

### DatePicker

#### Breaking Changes

- DatePicker maintains null value, while entering the out of range(min/max) issue has been fixed.

## 16.1.24 (2018-02-22)

### Common

#### Breaking Changes

- Changed the Angular component selector, component name prefix with `ejs` e.g: `ejs-calendar`.

- Event arguments and it's parameter values are same.

- Popup open in read-only mode issue has been fixed.

#### New Features

- High contrast theme support.

### DateRangePicker

#### New Features

- DateRangePicker rendered based on the screen resolution.

- `DateTime` support has been provided for DateRangePicker.

- Input type `date` has been handled in DateRangePicker.

### DatePicker

#### Breaking Changes

- Pascal casing change to `start` and `depth` property values (`Month`, `Year`, `Decade`).

- Focus the input when select the value from the DatePicker popup.

#### New Features

- `Today` button support has been provided for DatePicker.

- Input type `date` has been handled in DatePicker.

### TimePicker

#### Breaking Changes

- Pascal casing change to `start` and `depth` property values (`Month`, `Year`, `Decade`).

#### New Features

- Added `itemRender` support for the TimePicker which allows to customize each time values in a popup list.

- Input type `time` has been handled in TimePicker.

- Added `scrollTo` support for the TimePicker which is used to set the scroll position to the given time value when no value is selected in the popup list or the given value is not present in the popup list.

### Calendar

#### Breaking Changes

- Pascal casing change to `start` and `depth` property values (`Month`, `Year`, `Decade`).

#### New Features

- `Today` button support has been provided for Calendar.

### DateTimePicker

DateTimePicker component for selecting or entering a date and time with options for disabling dates, restricting selection and showing custom events.

- **Range Restriction** – Allows to select a date and time within a specified range.

- **Format** – Formatting the value displayed in a textbox.

- **Customization** – Allows to customize each day and time cell of the Calendar and time popup list.

- **Strict Mode** -  Allows to enter the only valid date and time in a textbox.

- **Accessibility** - Provided with built-in accessibility support which helps to access all the DateTimePicker component features through the keyboard, screen readers, or other assistive technology devices.

## 15.4.26-preview (2018-01-23)

### DateRangePicker

#### Bug Fixes

- Select event will be triggered when selecting the start and end date.

## 15.4.25-preview (2018-01-09)

### DatePicker

#### Bug Fixes

- Width and form validation related issues has been fixed.

## 15.4.23-preview (2017-12-27)

### Common

#### New Features

- Added typing file for ES5 global scripts (`dist/global/index.d.ts`).

#### Breaking Changes

- Modified the module bundle file name for ES6 bundling.

### DatePicker, DateRangePicker and TimePicker

#### Bug Fixes

- Popup repositions will not work while scrolling on the fixed element, this has been fixed.

## 15.4.21-preview (2017-12-08)

### DatePicker

#### Bug Fixes

- Popup position issue in mobile layout has been fixed.

## 15.4.20-preview (2017-12-01)

### Common

#### New Features

- Upgraded TypeScript version to 2.6.2

### Calendar

#### Bug Fixes

- issue on rendering the current month in European Time zone has been fixed.

### DatePicker

#### Bug Fixes

- issue on rendering the current month in European Time zone has been fixed.
- **showClearButton** - Allows to clear the textbox and model values.
- **zIndex** - allows to set the z-index value to the popup element.

### DateRangePicker

#### Bug Fixes

- **showClearButton** - Allows to clear the textbox and model values.
- **zIndex** - allows to set the z-index value to the popup element.

### TimePicker

#### Bug Fixes

- **showClearButton** - Allows to clear the textbox and model values.
- **zIndex** - allows to set the z-index value to the popup element.

## 15.4.17-preview (2017-11-13)

### Calendar

Calendar interface for selecting dates with options for disabling dates, restricting selection and showing custom events.

- **Range Restriction** - Allows to select a date within a specified date range.

- **Start and Depth View** - Allows to change the initial view and navigation depth of the Calendar.

- **Customization** - Allows to customize the each day cell of the calendar.

- **Accessibility** - Provided with built-in accessibility support which helps to access all the Calendar component features through the keyboard, screen readers, or other assistive technology devices.

### DatePicker

DatePicker component for selecting or entering a date with options for disabling dates,
restricting selection and showing custom events.

- **Range Restriction** - Allows to select a date within a specified date range.

- **Format** - Formatting the value displayed in a textbox.

- **Start and Depth View** - Allows to change the initial view and navigation depth of the Calendar.

- **Customization** - Allows to customize the each day cell of the calendar.

- **StrictMode** - Allows to entering the only valid date in a textbox.

- **Accessibility** - Provided with built-in accessibility support which helps to access all the DatePicker component features through the keyboard, screen readers, or other assistive technology devices.

### DateRangePicker

DateRangePicker component that allows user to select the date range from the calendar
or entering the range through the input element.

- **Presets** - Allows to define the customized predefined set of ranges.

- **Day Span** - Select the data span between the ranges to avoid excess or less date selection.

- **Range Restriction** - Control the date range selection within a specified range.

- **Format** - Formatting the value displayed in a textbox.

- **Customization** - Allows to customize the each day cell of the calendar.

- **StrictMode** - Allows to entering the only valid date in a textbox.

- **Accessibility** - Provided with built-in accessibility support which helps to access all the DateRangePicker component features through the keyboard, screen readers, or other assistive technology devices.

### TimePicker

TimePicker component is the pre-filled dropdown list with the time values 12/24 hours format, that allows to select a time from the list.

- **Range Restriction** - Allows to select a time within a specified time range.

- **Format** - Formatting the value displayed in a textbox.

- **Step** - Provides the option to increment/decrement time value in a popup list.

- **StrictMode** - Allows to entering the only valid time in a textbox.

- **Accessibility** - Provided with built-in accessibility support which helps to access all the TimePicker component features through the keyboard, screen readers, or other assistive technology devices.
