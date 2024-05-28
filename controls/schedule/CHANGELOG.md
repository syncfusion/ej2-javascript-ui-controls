# Changelog

## [Unreleased]

## 25.2.6 (2024-05-28)

### Schedule

#### Bug fixes

- `#I586530` - The issue with `refreshTemplates` caused alignment issues in resource header has been resolved.

## 25.2.4 (2024-05-14)

### Schedule

#### Bug fixes

- `#I539772` - Appointment drag and drop issue in iPad is fixed.
- `#I522699` - The issue with touch scrolling through appointments, which was caused by interference from the drag and drop and resize feature, has been resolved in touch devices. Drag and resize operations are only enabled after a tap-hold action.
- `#I583762` - The issue with `refreshTemplates` caused alignment issues in date header has been resolved.

## 25.2.3 (2024-05-08)

### Schedule

#### Bug fixes

- `#I582520` - The issue with `scrollToResource` not working in the month view has been resolved.

## 25.1.42 (2024-04-30)

### Schedule

#### Bug fixes

- `#I583674` - An issue where the text for today button was not displayed in the toolbar has been fixed.

## 25.1.41 (2024-04-23)

### Schedule

#### Bug fixes

- `#I569000` - The issue with the Timeslots show difference than the time scale on the day light saving start and end day has been resolved.
- An issue with XSS vulnerability identified in the editor window has been fixed.

## 25.1.39 (2024-04-09)

### Schedule

#### Bug fixes

- `#I556008` - An issue with the reading and restoring the current resource in compact view has been fixed.
- `#I550494` - An issue with appointments overlapping while using `sortComparer` in the timeline views has been fixed.
- `#I549215` - The issue with the `refreshLayout` method causing UI disruptions when utilizing `allowVirtualscrolling` has been resolved.

## 25.1.37 (2024-03-26)

### Schedule

#### Bug fixes

- `#I566544` - An issue with `aria-labelledby` accessibility issue in the recurrence editor has been fixed.
- `#I549259` - An issue where the weekend dates are rendered in the Agenda view after setting up the `showWeekend` property to `false` has been fixed.

## 25.1.35 (2024-03-15)

### Schedule

#### New Features

- `#I511506` - Provided support to prevent the reloading of appointment data source when resource data source changes dynamically by providing an additional boolean parameter `isEventDataRefresh` in the `setResourceCollections` method. To prevent reloading of the appointments you have to send the `isEventDataRefresh` parameter value as `false`.

## 24.2.8 (2024-02-27)

### Schedule

#### Bug fixes

- `#I549187` - An issue with the virtual scroll with `rowAutoHeight` has been resolved.

## 24.2.4 (2024-02-06)

### Schedule

#### Bug fixes

- `#I540139` - The appointment disappearance issue while using the `rowAutoHeight` has been resolved.
- `#I524766` - An issue related to scaling has been fixed.

## 24.2.3 (2024-01-31)

### Schedule

#### Bug fixes

- `#I541680` - An issue related to more indicator in the timeline views has been fixed.

## 24.1.41 (2023-12-18)

### Schedule

#### New Features

- `#I227283`, `#I233208`, `#F170880` - Provided support to customize the scheduler toolbar items using the `toolbarItems` property.
- `#I347220` - Provided the support to control the number of events displayed in a cell in the Month view and Timeline views using the `maxEventsPerRow` property

#### Bug fixes

- `#I519049` - An issue related to events are overlapping when they are on same date in vertical year view has been resolved.
- `#F185646` - An issue with page crashes when schedule appointment drag-drops over the calendar has been fixed.
- `#F185139` - An issue related to events are positioned incorrectly when using `firstDayOfWeek` with different time slot intervals has been resolved.
- `#FB47966` - An issue with timezone setting not working for all day events has been fixed.

## 23.2.4 (2023-11-20)

### Schedule

#### Bug fixes

- `#I518285` - An issue related to incorrect start day name on the week header in year view has been resolved.

## 23.1.44 (2023-11-07)

### Schedule

#### Bug fixes

- `#I513168` - An issue related to misplaced events in the print document has been resolved.

## 23.1.40 (2023-10-10)

### Schedule

#### Bug fixes

- `#I184692` - An issue with the date navigation while clicking on the month date on mobile mode has been fixed.
- `#I504010` - The console error occurs when dragging events outside of the Scheduler area has been fixed.

## 23.1.39 (2023-10-04)

### Schedule

#### Bug fixes

- `#I503155` - Resolved an accessibility concern by including the necessary form labels in the Scheduler editor window.

## 23.1.38 (2023-09-26)

### Schedule

#### Bug fixes

- `#I501151` - An issue where the `eventDoubleClick` event is not triggering has been fixed.

## 23.1.36 (2023-09-15)

### Schedule

#### Features

- `#I393657` - Provided on-demand data loading support that allows users to retrieve events from remote services for the current view port alone and retrieve the remaining data on demand while scrolling, which improves the performance and usability of the Scheduler component.
- `#I397280`, `#I296716`, `#F184285`, `#FB37717` - Provided `virtualScrollStart` and `virtualScrollStop` event support to notify the resource virtual scrolling actions of Scheduler.
- `#I339243`, `#I365629`, `#F174284` - Provided support to customize the header and footer of editor window.

#### Bug fixes

- `#F184224` - An issue with start and end date query parameters passed incorrectly, when timezone is applied for scheduler has been fixed.
- `#I499207` - An issue with quick popup not opens on selected cell, when `allowMultiRowSelection` property disabled has been fixed.

## 22.2.12 (2023-09-05)

### Schedule

#### Bug fixes

- `#I492172` - An issue with recurrence exception not calculated based on scheduler timezone has been fixed.
- `#I490434` - An issue with current time indicator positioned wrongly when header rows is applied in timeline views has been fixed.
- `#I497178` - An issue with quick popup opens for unselected resource cells has been fixed.

## 22.2.11 (2023-08-29)

### Schedule

#### Bug fixes

- `#I488001` - An issue where the description field of an ICS file was not being parsed correctly upon import into the Schedule has been fixed.

## 22.2.5 (2023-07-27)

### Schedule

#### Bug fixes

- `#I480473` - An issue with "Role not inside the required context" accessibility issue in the Schedule component's recurrence editor has been fixed.
- `#I474091` - The issue of duplicate events being created after changing the recurrence of certain events has been fixed.
- `#I478902` - Performance issue in calculating scrollbar width has been fixed.

## 22.1.38 (2023-07-11)

### Schedule

#### Bug fixes

- `#F182714` - An issue with Escape key will prevent the cell selection when `allowInline` property enabled has been fixed.

## 22.1.34 (2023-06-21)

### Schedule

#### New Features

- `#I438319` - Provided an option to customize the recurrence end type which allows users to tailor the recurrence editor to their unique needs and preferences.

#### Bug fixes

- `F182696` - An issue with Keyboard scroll behaviour not working has been fixed.
- `I470178` - An issue with Edit occurrence appointment not rescheduled properly and shows occurrence alert has been fixed.
- `#I182714` -  Resolved the issue where pressing the `Escape` key while navigating the scheduler with the keyboard would return to the previously selected cell.

## 21.2.10 (2023-06-13)

### Schedule

#### Bug fixes

- `#I464944` - An issue with time indicator rendered in wrong position when `startHour` and `endHour` property applied has been fixed.

## 21.2.9 (2023-06-06)

### Schedule

#### Bug fixes

- `#I461489` - An issue with the dragging appointment is flickering on the topmost region has been fixed.
- `#I464535` - Fixed an issue where the visible date header name in the Schedule did not match the aria-label name, leading to discrepancies in the accessibility checker.
- `#I459642` - An issue with Appointment end date is wrong in `popupOpenEventArgs` has been fixed.

## 21.2.6 (2023-05-23)

### Schedule

#### Bug fixes

- `#I182303` - An issue with where the current date was not indicated in the agenda view with resource has been fixed.

### Schedule

#### Bug fixes

- `#I459507` - An issue with the following events option not being displayed while editing the edited occurrence of the recurrence series has been fixed.

## 21.2.5 (2023-05-16)

### Schedule

#### Bug fixes

- `#I459154` - An issue with Schedule performance while rendering large set all-day appointments in vertical views has been fixed.

## 21.2.4 (2023-05-09)

### Schedule

#### Bug fixes

- `#I457705` - An issue with appointment not dropped on target cell when start and end time is same has been fixed.
- `#I457928` - An issue with the appointment misalignment has been fixed.

## 21.1.41 (2023-04-18)

### Schedule

#### Bug fixes

- `#I449384` - An issue with the numeric textbox inside the `editorTemplate` has been fixed.
- `#I454841`, `#I455215` - An issue with the appointment subject, quick info popup subject, and description values doesn't show in HTML format has been fixed.
- `#I451218` - An issue with the clone element was hidden while dragging when the `eventDragArea` property is enabled has been fixed.

## 21.1.39 (2023-04-11)

### Schedule

#### Bug fixes

- `#I425939` - Schedule virtual scrolling appointment rendering performance improved.
- `#F181250` - Schedule layout rendering performance improved with `timezone` property.
- `#I328355`, `#I449137` - Provided support to bind methods in `JS` way for the Schedule events in the `print` method `printOptions`.

## 21.1.38 (2023-04-04)

### Schedule

#### Bug fixes

- `#I448740` - An issue with the current date styles in month agenda view has been fixed.
- `#I445875` - An issue with the scheduler not rendering the all more indicators while resizing the browser window at specific resolutions has been fixed.

## 21.1.35 (2023-03-23)

### Schedule

#### New Features

- `#I324269`, `#I347160` - Provided support to display multi month event as single event in vertical orientation of timeline year view.
- `#I419677` - Provided the support to sanitize the appointment inputs, improving the security of the Scheduler component.
- `#I425713` - Provided in-built filter support to the Scheduler component, allowing users to easily filter events when requesting data from the server.
- `#FB40709` - Provided `generateEventOccurrences` public method to retrieve all the occurrences from the series.
- `#I423939` - Provided support to render the schedule timeline views without horizontal scrollbar.

#### Bug fixes

- `#I442920` - An issue with appointments misaligned in timeline year view with `ignoreWhiteSpace` property has been fixed.

## 20.4.53 (2023-03-07)

### Schedule

#### Bug fixes

- `#I441823, F180833` - An issue with a script error while customizing the recurrence editor repeat type option in the Schedule editor has been fixed.

## 20.4.52 (2023-02-28)

### Schedule

#### Bug fixes

- `#I440832` - An issue with drag clone event were hidden, when dragging multiple appointments with `startHour` and `endHour` has been fixed.
- `#I441311` - An issue with `getSelectedElements` public method return the selected cells in wrong order has been fixed.

## 20.4.51 (2023-02-21)

### Schedule

#### Bug fixes

- `#I438207` - An issue with `select` event not invoked on cell selection through keyboard navigation has been fixed.

## 20.4.49 (2023-02-07)

### Schedule

#### Bug fixes

- `#I430344` - An issue with the resource id values for added records and changed records were incorrect when the `allowMultiple` property for schedule resources was set to true has been fixed.

## 20.4.48 (2023-02-01)

### Schedule

#### Bug fixes

- `#I422532` - An issue with swiping animation is slow on date navigation in iPad device has been fixed.
- `#I426228` - An issue with drag and drop with timeline view header rows has been fixed.

## 20.4.44 (2023-01-18)

### Schedule

#### Bug fixes

- `#I414149` - An issue with editor window not open in iPad device has been fixed.
- `#I425181` - An issue with wrongly shown the occurrence alert while editing title of single occurrence of daily recurrence event has been fixed.
- `#I427296` - An issue with wrongly shown the occurrence alert while editing the date of single occurrence of weekly recurrence event has been fixed.

## 20.4.43 (2023-01-10)

### Schedule

#### Bug fixes

- `#I425940` - An issue with adding an aria-pressed attribute to the appointment has been fixed.
- `#I427181` - The issue with the schedule tooltip displaying start and end times in 12 hour format when the schedule is in 24 hour format has been fixed.

## 20.4.42 (2023-01-04)

### Schedule

#### Bug fixes

- `#I425268` - An issue with drag and drop flickering with `eventDragArea` in timeline views has been fixed.
- `#I424662` - An issue with appointment resizing in month view with scrollbar has been fixed.

## 20.4.38 (2022-12-21)

### Schedule

#### New Features

- `#I384604` - Provided custom workdays support when resources are grouped by date.
- `#I394207` - Provided `closeTooltip` method to close the appointment tooltip programmatically.
- `#I399939` - Provided `dateRangeTemplate` template to customize the header date range in scheduler.

## 20.3.58 (2022-11-22)

### Schedule

#### Bug fixes

- `#F178747` - An issue with Appointments positioning when navigate to the next date via swiping in mobile mode has been fixed.

## 20.3.57 (2022-11-15)

### Schedule

#### Bug fixes

- `#I415847` - An issue with Edit recurrence series to greater than its end date has been fixed.
- `#I415323` - An issue with timeline month view appointment flickers on initial resizing has been fixed.

## 20.3.56 (2022-11-08)

### Schedule

#### Bug fixes

- `#F178302` - An issue with being unable to inline edit when using `eventTemplate` has been fixed.
- `#F178112` - An issue with "Misalignment occurring on zoom-in zoom-out with the scheduler" has been fixed

## 20.3.52 (2022-10-26)

### Schedule

#### Bug fixes

- `#F177962` - An issue with displaying yearly recurrence event has been fixed.
- `#I407566` - An issue with Importing exported ICS file with the edited recurrence event causes issue while editing the recurrence event has been fixed.
- `#F411508` - The issue Error throws when resources with no child is selected in the Editor window has been fixed.
- `#I411253` - Scheduler performance issue in virtual scrolling has been fixed.
- `#I412237` - An issue with Delete action through keyboard not working on Schedule on the MAC OS has been fixed.
- `F178167` - An issue with navigation actions not working while performing swipe on the appointments in mobile mode has been fixed.

## 20.3.49 (2022-10-11)

### Schedule

#### Bug fixes

- `#I407566` - An issue with Importing exported ICS file with the edited recurrence event causes issue while editing the recurrence event has been fixed.

## 20.3.47 (2022-09-29)

### Schedule

#### New Features

- `#I329117` - Provided option to disable the date navigation via touch swipe.
- `#F171009`, `#FB3560`, `#FB30983`, `#FB31560`, `#FB36386` - Provided virtual scrolling support to Vertical Day, Week, and Month views.
- Provided cell template, day header template and month header template support for Year view.

#### Bug fixes

- `#I406122` - An issue with Recurrence appointment rendered after the end time on DST timezone has been fixed.

## 20.2.50 (2022-09-20)

### Schedule

#### Bug fixes

- `#I405416` - An issue with next date navigation arrow shown when the upcoming date is greater than `maxDate` has been fixed.

## 20.2.43 (2022-08-08)

### Schedule

#### Bug fixes

- `#I392060` - An issue with `scrollTo` method not working in timeline views has been fixed.

## 20.2.40 (2022-07-26)

### Schedule

#### Bug fixes

- `#I392060` - An issue with Appointments start and end time were changed on schedule property change has been fixed.

## 20.2.38 (2022-07-12)

### Schedule

#### Bug fixes

- `#F172936` - An issue with Form validator instance not available in `popupOpen` event of Scheduler has been fixed.
- `#F175741` - An issue with UID of the appointments varies every time while exporting appointments in ICS file has been fixed.
- `#I379499` - An issue with Recurrence appointments start and end times are not changed based on DST time zone has been fixed.

## 20.2.36 (2022-06-30)

### Schedule

#### New Features

- `#I357693`, `#I385560` - Provided a public method `openQuickInfoPopup` to open the quick popup programmatically.
- `#I307933` - Provided support to specify custom separator when exporting Scheduler events to CSV export.

#### Bug Fixes

- `#I385411` - An issue with Weekly recurrence appointments not shown in day view has been fixed.

## 20.1.61 (2022-06-21)

### Schedule

#### Bug Fixes

- `#I380532` - An issue with Multiple appointments dragged while performing drag action with a single appointment has been fixed.
- `#I380576` - An issue with drag appointment clone position with enabled `rowAutoHeight` has been fixed.
- `#I384326` - An issue with html tag as appointment subject in quick popup header has been fixed.
- `#I383234` - An issue with `scrollTo` method not working with date when enabled group `byDate` has been fixed.
- `#F174691` - An issue with header misalignment in month view on safari browser has been fixed.

## 20.1.57 (2022-05-24)

### Schedule

#### Bug Fixes

- `#I379346` - An issue with appointments rendered in start and end hour range in vertical views has been fixed.
- `#I379197` - An issue with normal appointment rendered in all day row in DST time zone has been fixed.

## 20.1.55 (2022-05-12)

### Schedule

#### Bug Fixes

- `#I374675` - The appointment border maintained after deselection on multiple appointment selections has been fixed.
- `#I373707` - An issue with appointments rendered in the min-max date range in vertical views has been fixed.

## 20.1.50 (2022-04-19)

### Schedule

#### Bug Fixes

- `#I373678` - An issue with the recurrence appointment time change in the DST time zone has been fixed.
- `#I372043` - An issue with the appointment rendering performance of the month view has been fixed.
- `#I373179` - The Schedule `exportToICalendar` method throws a script error on exporting events issue has been fixed.
- `#I373707` - An issue with the appointments in the min-max date range not rendered in the month view has been fixed.

## 20.1.48 (2022-04-12)

### Schedule

#### Bug Fixes

- `#F173985` - An issue with duplicate cells rendered when the time scale interval set as 1440 has been fixed.

## 20.1.47 (2022-04-04)

### Schedule

#### New Features

- `#I305258`, `#FB20522`, `#FB20233` - Provided virtual scrolling support for timeline year view with vertical orientation.

#### Bug Fixes

- `#I368002, #I369932` - A issue with cell height not updated property based on appointment rendering while row auto height enabled has been fixed.
- `#I368806` - An issue with an incorrect end date in the editor when using `openEditor` method has been fixed.
- `#I367110` - An issue with more indicator count value is wrong in month view has been fixed.
- `#I370378` - An issue with the wrong count of occurrences rendered when clear and set up until date value again has been fixed.
- `#F172905` - An issue with scroll position not maintained for timeline year and timeline month views has been fixed.

## 19.4.50 (2022-02-08)

### Schedule

#### Bug Fixes

- `#I362813` - An issue with appointment start and end time changes on each schedule layout resize action while using `timezone` property has been fixed.
- `#I363018` - An issue with event template content is empty after performing CRUD action with resource has been fixed.

## 19.4.47 (2022-01-25)

### Schedule

#### Bug Fixes

- `#I361305` - A performance issue while loading more events in the Timeline views has been fixed.
- `#I361135` - An issue with improper argument data received in the `eventRendered` event in each view has been fixed.
- `#I363266` - An issue with the more popup window has truncated at bottom of the schedule in month view has been fixed.

## 19.4.43 (2022-01-18)

### Schedule

#### Bug Fixes

- `#F171650` - An issue with localized text is not applied for the week numbers tooltip in year view has been fixed.

## 19.4.42 (2022-01-11)

### Schedule

#### Bug Fixes

- `#I360126` - Timeline views appointment misalignment issue while work cells width reduced has been fixed.

## 19.4.41 (2022-01-04)

### Schedule

#### Bug Fixes

- `#I357890` - An issue with work cells misalignment in the timeline month view has been fixed.
- `#FB31401` - An issue with today button navigating issue only in the `MonthAgenda` view issue has been fixed.
- `#FB30967` - An issue while drag and drop an event with `eventDragArea` has been fixed.

## 19.4.40 (2021-12-28)

### Schedule

#### Bug Fixes

- `#I353817` - An issue with all-day region scrolling issue only in the Mac device has been fixed.

## 19.4.38 (2021-12-17)

### Schedule

#### New Features

- `#I256450`, `#I256493`, `#I341525` - Provides support for flexible month view that starts from the beginning of the week the displayed date falls in. Also, users can set the number of weeks to be displayed in the Month view.
- `#FB9963`, `#I331086` - Provided an option to customize the header names when the Scheduler is exported to Excel.
- `#I276542`, `#F169844` - Provided support to set the minimum event duration for appointments to make the event subject easier to read.
- `#I335888`, `#F167194`, `#F167235`, `#F169012`, `#F169593`, `#F169647` - Provides accessibility support for timeline year views to select multiple cells for actions.

#### Bug Fixes

- `#I357194` - An issue while slower the performance of the schedule, while drag and drop the event with `eventTemplate` has been fixed.

## 19.3.55 (2021-11-23)

### Schedule

#### Bug Fixes

- `#I347217` - An issue while using `getRecurrenceDates` method in the weekly rule option has been fixed.

## 19.3.53 (2021-11-12)

### Schedule

#### New Features

- `#I224286`, `#I224730`, `#I316683`, `#I321325`, `#I331265`, `#I331820`, `#I338907`, `#I342102`, `#F169564`, `#F169824`, `#F169024` - Provided option to render the spanned events greater than 24 hours in either `AllDayRow` region or `TimeSlot` region.
- `#I339786` - Provided localization support for timezone collections which are displayed in the editor window.

## 19.3.48 (2021-11-02)

### Schedule

#### Bug Fixes

- `#F158202` - The `getCurrentViewEvents` method not returns current view events in Agenda view has been fixed.
- `#I343356` - An issue while using two dynamic validation error message for the scheduler field has been fixed.
- `#I345316` - An issue while saving an event dynamically using `saveEvent` method only with `timezone` property for the scheduler has been fixed.
- `#F169453` - An issue with the horizontal scroll position in the timeline month, while dragging or resizing an event has been fixed.
- `#I342117` - An issue with virtual scrolling down not happening issue in Agenda view mobile mode has been fixed.

## 19.3.46 (2021-10-19)

### Schedule

#### Bug Fixes

- `#I344571` - An alignment issue between the resource cells and work cells in timeline year has been fixed.
- `#FB29199` - Dragging an event from one month to another throws an exception in month view has been fixed.
- `#I344682` - An issue with virtual up-scrolling while enabling the `rowAutoHeight` property has been fixed.

## 19.3.44 (2021-10-05)

### Schedule

#### Bug Fixes

- `#FB29036` - An issue with the `renderCell` event arguments as `resourceGroupCells` has been fixed in the timeline year view with resources.
- `#I339839` - An issue with the scheduler resize action is not working properly in timeline month has been fixed.
- `#F168909` - The scheduler agenda view throws script error on multilevel resources grouping has been fixed.

## 19.3.43 (2021-09-30)

### Schedule

#### New Features

- `#I316891`, `#I328879`, `#I331265`, `#I335777`, `#I339302`, `#F165491` - Provided support to sort appointments by priority instead of time.
- `#I242605`, `#F160122`, `#F165334` - Provided public method for Scheduler to refresh the Scheduler layout without re-render.
- `#I314842`, `#I320731` - Provided public method for Scheduler to refresh the given templates.
- `#FB24252` - Provided template support for header indent cells.

#### Bug Fixes

- `#I333664` - An issue with the dragging between two Schedulers has been fixed.
- `#I340348` - An issue with opening the editor window in RTL mode has been fixed.
- `#I342117` - An issue with today button navigation in Agenda view and scrolling down not happening issue has been fixed.
- `#F168358` - An issue with the "delete icon is not disabled in mobile mode" has been fixed.
- `#I340332` - An issue with the events rendering performance in vertical views has been fixed.
- `#I342489` - An issue with identify the clicked button on `popupClose` event has been fixed by providing `event` option on `PopupCloseEventArgs`.

## 19.2.59 (2021-08-31)

### Schedule

#### New Features

- `#I242605`, `#F160122`, `#F165334` - Provided public method for Scheduler to refresh the Scheduler layout without re-render.
- `#I314842`, `#I320731` - Provided public method for Scheduler to refresh the given templates.

#### Bug Fixes

- `#I339839` - An issue with the scheduler resize action is not working properly in timeline views has been fixed.
- `#I338473` - An issue with the scheduler `showWeekend` property set to false appointments missing has been fixed.
- `#I340348` - An issue with opening the editor window in RTL mode has been fixed.
- `#I342117` - An issue with today button navigation in Agenda view has been fixed.
- `#I340332` - An issue with the scheduler performance in Vertical views has been fixed.

## 19.2.56 (2021-08-17)

### Schedule

#### Bug Fixes

- `#I334925` - An issue with the longer appointments in timeline year view UI has been resolved.

## 19.2.55 (2021-08-11)

### Schedule

#### Bug Fixes

- `#I337733` - An issue with the scheduler events overlapping when start and end times were the same has been resolved.

## 19.2.51 (2021-08-03)

### Schedule

#### Bug Fixes

- `#F167351` - An issue with the scheduler quick popup closes when using multi-select in the popup content has been fixed.

## 19.2.49 (2021-07-27)

### Schedule

#### Bug Fixes

- `#I331086` - An issue with the drag and drop the spanned events in vertical views has been fixed.
- `#I336108` - An issue with the scheduler import of recurring events has been fixed.

## 19.2.47 (2021-07-13)

### Schedule

#### Bug Fixes

- `#I333860, #I333664` - An issue with the external drag between two scheduler has been fixed.
- `#F166305` - An issue with dynamically changed `minDate` and `maxDate` property in react scheduler has been fixed.
- `#F166752` - An issue with drag and drop doesn't work when enabled the desktop mode in mobile devices has been fixed.
- `#I331086` - An issue with the drag and drop the spanned events in vertical views has been fixed.

## 19.2.46 (2021-07-06)

### Schedule

#### Bug Fixes

- `#I332366` - An issue with the toolbar popup is not open properly when multiple schedules are rendered on a single page has been fixed.

## 19.2.44 (2021-06-30)

### Schedule

#### New Features

- Provided option to set the custom months count in year views.

#### Bug Fixes

- `#FB25227` - An issue with the scheduler resize action is not working in timeline views has been fixed.
- `#I331501` - An issue with the scheduler height is not responsive related to the parent container has been fixed.

## 19.1.69 (2021-06-15)

### Schedule

#### Bug Fixes

- `#I331194` - An issue with localization for form-validator is not working has been fixed.
- `#I331513` - An issue with add icon shows on mobile when disabled the `allowAdding` property has been fixed.

## 19.1.67 (2021-06-08)

### Schedule

#### Bug Fixes

- `#I327333` - An issue with the scheduler current time indicator position not maintained has been fixed.
- `#I329599` - An issue with the scheduler `eventRendered` event in agenda view has been fixed.
- `#F165707` - An issue with the external drag between two scheduler has been fixed.
- `#I330676` - An issue with the scheduler more popup is not updated when deleting the event in year view has been fixed.
- `#I330946` - An issue with the scheduler keyboard interaction when the `readonly` property is enabled has been fixed.

## 19.1.66 (2021-06-01)

### Schedule

#### Bug Fixes

- `#F165550` - An issue with script error throws while dragging the scheduler events in IE11 has been fixed.

## 19.1.65 (2021-05-25)

### Schedule

#### New Features

- Provided public method to select the resources programmatically based on group index in mobile mode.

#### Bug Fixes

- `#I317799` - An issue with memory leak while performing navigation action has been fixed.
- `#F165261` - An issue with scheduler dates are not translated based on locale has been fixed.
- `#FB25480` - An issue with the scheduler mobile mode when the `readonly` property is enabled has been fixed.

## 19.1.63 (2021-05-13)

### Schedule

#### New Features

- Provided scrolling support for all day row when loading huge events.
- Provided the print option support to print the schedule in a customized way.
- Provided option to set the different first month in year view.
- Provided template support for date header in year views.

#### Bug Fixes

- `#I325602`: An issue with resizing the appointment to last cell is not working has been fixed.
- `#I315877` - An issue with the scheduler fast dragging in timeline views has been resolved.

## 19.1.59 (2021-05-04)

### Schedule

#### Bug Fixes

- `#FB23548` - An issue with Keyboard Interaction with Virtual Scrolling has been fixed.
- `#I323778` - An issue with Scheduler Accessibility has been fixed.

## 19.1.58 (2021-04-27)

### Schedule

#### Bug Fixes

- `#I324040` - An issue with the scheduler multiple appointment selection in IOS device has been resolved.
- `#I324529, #I323448` - An issue with deleting the entire recurrence events with resources has been resolved.
- `#FB23906, #FB23902` - An issue with "Scheduler causing focus loss for text inputs in Android device" has been fixed.
- `#FB23931` - An issue with "Scheduler stealing focus on window resize" has been fixed.
- `#I313715` - An issue with script error throws while resizing the scheduler events has been fixed.
- `#FB24226` - An issue with the scheduler alert message when drag the event in series has been fixed.

## 19.1.57 (2021-04-20)

### Schedule

#### Bug Fixes

- `#I312919` - An issue with the scheduler performance with resources has been resolved.

## 19.1.56 (2021-04-13)

### Schedule

#### Bug Fixes

- `#FB23907` - An issue with the "Scheduler throws the console errors in Android device" has been fixed.
- `#F161048` - An issue with Scheduler quick popup rendered twice when the `quickInfoOnSelectionEnd` property is enabled has been fixed.
- `#I320954` - An issue with the scheduler rendered twice with a different timezone has been fixed.
- `#I319812` - An issue with the appointment is not created properly in Timeline Year view has been fixed.
- `#I320915` - An issue with Scheduler events height is not rendered properly in the DST timezone has been fixed.
- `#FB23548` - An issue with Keyboard Interaction with Virtual Scrolling has been fixed.
- `F159057` - An issue with the appointment was not shown correctly in the UI in `TimelineMonth` view has been fixed.

## 19.1.55 (2021-04-06)

### Schedule

#### Bug Fixes

- `#F17228` - An issue with scheduler input field focus not working in iPad device with external keyboard has been fixed.
- `#I317983` - An issue with the height of the `TimelineMonth` view is not properly applied when the `rowAutoHeight` property is enabled with scheduler height `auto` has been fixed.
- `#I321711` - Duplicate events rendered in year view of schedule issue has been fixed.
- `#I320945` - An issue with scheduler multiple cell selection by holding shift and mouse click throws script error has been fixed.

## 19.1.54 (2021-03-30)

### Schedule

#### New Features

- **Multiple events drag and drop** - This feature allows to select multiple events and reschedule them quickly by drag-and-drop. Multiple selections can be done by pressing the CTRL key with a click.
- **Time Format** - This feature allows users to set `24-hour` or `12-hour` time formats in the scheduler. By default, the time format applies from the schedule's current culture configuration.

### Recurrence Editor

#### Breaking Changes

- The following properties type was changed.

| Property | Previous Type | Current Type                   |
|----------|---------------|--------------------------------|
| `selectedType` | `anonymous`      | `int` |
| value | `anonymous`      | `string` |

## 18.4.49 (2021-03-23)

### Schedule

#### Bug Fixes

- `#F22773` - An issue with editor freezes when saving a task to repeat yearly on the last day of a month has been fixed.
- `#F163215` - An issue with one day block event renders for two days has been fixed.
- `#I316945` - An issue with recurrence events are not deleted properly in overview sample has been fixed.
- `#I317560` - An issue with Schedule events getting overlapped issue has been fixed.
- `#I313557` - An issue with scheduler resource header when enabled `rowAutoHeight` and `height` properties has been fixed.
- `#317799` - An issue with memory leak in Scheduler has been fixed.
- `#313715,320461` - An issue with script error throws while fast dragging of scheduler events has been fixed.

## 18.4.48 (2021-03-16)

### Schedule

#### Bug Fixes

- `#I313966` - An issue with scheduler toolbar popup items are hidden in iPhone has been fixed.
- `#I313459` - An issue with scheduler content width is not properly adjusted while loading large number of resources in IOS device has been fixed.
- `#I315617` -  An issue with scheduler `refreshDataManager` method invokes before active view has been fixed.

## 18.4.47 (2021-03-09)

### Schedule

#### Bug Fixes

- `#I303694` - An issue with scheduler toolbar items are not rendered as mobile view in iPad has been fixed.

## 18.4.46 (2021-03-02)

### Schedule

#### Bug Fixes

- `#I306554` - Events are overlapping each other if multiple appointments having duration less than a day in same cell in year view issue has been fixed.
- `#I292642` - An issue with today date is not selected properly in header calendar with different timezone has been fixed.
- `#I315273` - An issue with clone element position place is mismatched while perform resize action with different resize interval has been fixed.
- `#I316544` - An issue with locale word are not displayed in all day row expand and collapse section has been fixed.
- `#I315617, #I315568` - An issue with script error throws while refresh the scheduler before loads the active view has been fixed.
- `#I315462` - An issue with appointments are not rendered when removing the resource dynamically has been fixed.
- `#F162676` - An issue with resource and content area gets misaligned when `rowAutoHeight` is enabled in virtual scrolling has been fixed.

## 18.4.44 (2021-02-23)

### Schedule

#### Bug Fixes

- `#I314589` - An issue with week number not shown properly in timeline views has been fixed.

## 18.4.42 (2021-02-09)

### Schedule

#### Bug Fixes

- `#I312058` - An issue with Appointments not rendered in vertical timeline year view issue has been fixed.
- `#I310882` - An issue with daily recurring event not able to create for 24 hours has been fixed.

## 18.4.41 (2021-02-02)

### Schedule

#### New Features

- `#304701`, `#305038` - Provided the persistence support for scroll bar position.

#### Bug Fixes

- `#I309044` - An issue with year view months rendered incorrectly issue has been fixed.
- `#I312201` - An issue with Scheduler throws script error from Current time indicator has been fixed.

## 18.4.35 (2021-01-19)

### Schedule

#### Bug Fixes

- `#I306474` - An issue when `rowAutoHeight` is enabled the events are overlapping to each other in month view issue has been fixed.
- `#I309996` - An issue with `resouceHeaderTemplate` is not rendering, while navigating the date via swipe actions has been fixed.
- `F161271` - An issue with script errors throws when editing the block appointments manually using open editor has been fixed.
- `#I292642` - An issue when timezone is set the calendar today date is not updated properly issue has been fixed.

## 18.4.34 (2021-01-12)

### Schedule

#### Bug Fixes

- `I309759, I309773` - An issue with the `getCurrentViewDates` returned incorrect dates in Agenda view has been fixed.

## 18.4.33 (2021-01-05)

### Schedule

#### New Features

- `#I305332, #I309559` - Provided different options to set the week numbers like Microsoft Outlook Calendar.

#### Bug Fixes

- `#I307462` - An issue when editing date time and End as until the last event not rendered has been fixed.
- `#F159141` - An issue when enable persistence is true selected resource not rendered issue has been fixed.
- `#I304107` - An issue when request to return current view or view model issue has been resolved.
- `#I306554, #I307686` - An issue when rendering the appointments in timeline year view has been fixed.
- `#F20602` - An issue with the position of the more event popup window is calculating wrongly when we setting the timescale interval has been fixed.
- An issue with appointments overlapping in year view has been fixed.
- `#I306366` - An issue with resource text is not visible in mobile mode issue has been fixed.

## 18.4.32 (2020-12-29)

### Schedule

#### New Features

- Provided public methods for the Scheduler to get and set the resource collections.

## 18.4.31 (2020-12-22)

### Schedule

#### Bug Fixes

- `#301175` - An issue with the appointment top value in timeline views for the appointment rendered in the last resource has been fixed.

## 18.4.30 (2020-12-17)

### Schedule

#### New Features

- Provided the event Drag and Drop and Resize support for Timeline Year view.

#### Bug Fixes

- `#159985` - An issue with `scrollToResource` public method not working properly has been fixed.
- `#159896`- An issue with the appointments are misaligned when `rowAutoHeight` is true has been fixed.
- `#18946` - An issue with displaying date twice for DST time-zones when switching between summer and winter time, has been fixed.
- `#300527` - An issue with loose shadow event once new week opens issue has been fixed.
- `#292074` - An issue with Schedule event dragging is not working fine when set up the `eventDragArea` property has been fixed.
- `#303564` - An issue with Editor window throws script error has been fixed.
- `#304988` - An issue with Scheduler throws script error when navigate form the scheduler to other component has been fixed.

## 18.3.53 (2020-12-08)

### Schedule

#### Bug Fixes

- `#286035` - An issue with theme mapping has been fixed.
- `#299009, #305259` - An issue with the `resourceHeaderTemplate` shows empty content when changing the properties of schedule if tooltip enabled has been fixed.
- `#159749` - An issue with Scheduler is not refreshed properly while navigating has been fixed.
- `#305387` - An issue with events not displayed on proper time has been fixed.
- `#301811` - An issue with render RTE component as a additional field in the editor template has been fixed.

## 18.3.51 (2020-11-24)

### Schedule

#### Bug Fixes

- `#292642` - An issue with the event rendering with `StartTimezone` and `EndTimezone` fields at the time of initial loading alone has been fixed.
- `#292642` - An issue with date navigation from calendar with different timezone has been fixed.
- `#F16947` - An issue with events on same day and time overlap in readable way has been fixed.
- `#F159110` - An issues with Scheduler timeline year view has been fixed.
- `#F159666` - An issue with wrong element in `renderCell` event has been fixed.
- `#F159432` - An issue with customizing the dragging interval time of the events has been fixed.
- `#301811` - An issue with render RTE component as a additional field in the editor template has been fixed.

## 18.3.50 (2020-11-17)

### Schedule

#### Bug Fixes

- `#299272` - An issue with the all day spanned events are not properly rendered in the timeline year view has been fixed.
- `#299896` - An issue with events get overlapped, when we render the two events at the same time has been fixed.
- `#299009` - An issue with `resourceHeaderTemplate` when enable the schedule tooltip has been fixed.

## 18.3.48 (2020-11-11)

### Schedule

#### Bug Fixes

- `#299517` - An issue with the `displayName` property not working in the Agenda view and the `MonthAgenda` view has been fixed.

## 18.3.44 (2020-10-27)

### Schedule

#### Bug Fixes

- `#F158249` - Now `scrollTo()` support has been added in timeline year view.
- `#292093` - An issue with setting the resize interval for event in `resizeStart` not resizing the event to its minimum interval value has been fixed.
- `#299079` - An issue with Custom editor window throws script error has been fixed.

## 18.3.42 (2020-10-20)

### Schedule

#### Bug Fixes

- `#293358` - An issue with the Scheduler events are not rendered in month view and the same events rendered in other views has been fixed.
- `#286376` - An issue with refreshing the layout when setting `dataSource` dynamically using `setmodel` in Year view has been fixed.
- `#286376` - An issue with view navigation when setting `dataSource` dynamically using `setmodel` in year view has been fixed.
- `#294568` - An issue with all day spanned event is not rendered properly in the `TimelineYear` view has been fixed.
- `#296098` - An issue with event click action on less duration events not deselecting the previously selected event has been fixed.
- `#286199` - An issue with when destroying the child component used in the editor template the child component is destroyed multiple time has been fixed.
- `#297720` - An issue with creating an event for the resource parent work cells using `addEvent` method has been fixed.

## 18.3.40 (2020-10-13)

### Schedule

#### Bug Fixes

- `#290061` - An issue with the drop action not working properly in the first row of the Scheduler has been fixed.
- `#289933` - An issue with the flickering clone drag element when dragging action is performed at the top most cells of the Scheduler has been fixed.
- `#285797` - An issue with dragging an appointment beyond the schedule end time causes appointment to jump has been fixed.
- `#290061` - An issue with the drop action not working properly in the first row of the Scheduler has been fixed.
- `#289933` - An issue with the flickering clone drag element when dragging action is performed at the top most cells of the Scheduler has been fixed.
- `#292609` - An issue with dynamically changed `minDate` and `maxDate` property are not applying to editor start and end date pickers has been fixed.
- `#296040` - An issue with event template is not applied in react scheduler has been fixed.

## 18.3.35 (2020-10-01)

### Schedule

#### Bug Fixes

- `#292642` - An issue with date navigation from calendar today button with different timezone has been fixed.
- `#292609` - An issue with applying `minDate` and `maxDate` when until date of recurrence editor is configured has been fixed.
- `#157158` - An issue with events not displaying when set `minDate` and `maxDate` as string type has been fixed.
- `#292093` - An issue with events that are not properly rendered when the drag target moves outside the work cell has been fixed.
- `#157442` - An issue with improper alignment of header cells while remove resource dynamically has been fixed.
- `#287725` - An issue with clone element height is not calculated properly when disable the timescale in week view has been fixed.
- `#292250` - An issue with timeline views resource tree tab accessibility navigation has been fixed.

## 18.2.59 (2020-09-21)

### Schedule

#### Bug Fixes

- `#292250` - An issue with accessibility related navigations from one resource to another resource events issue has been fixed.

## 18.2.57 (2020-09-08)

### Schedule

#### Bug Fixes

- `#156859` - An issue with the resource name is displayed wrongly in quick popup has been fixed.
- `#157022` - An issue with character encoding in german umlaut culture while import iCalendar has been fixed.
- `#289020` - An issue with script error throws while creating new events in the iPhone has been fixed.

## 18.2.55 (2020-08-25)

### Schedule

#### Bug Fixes

- `#286271` - An issue with the block events are not rendered When we changing the scheduler `timezone` dynamically has been fixed.
- `#154907, #154998` - An issue with `Agenda` view while `allowVirtualscrolling` and `hideEmptyAgendaDays` set to be true has been fixed.
- `#289191` - An issue with agenda view freezes when we render a spanned event with a millisecond end time value is fixed.
- `#156849` - An issue with Scheduler throws script error when perform event drag action above the cells with `cellTemplate` has been fixed.
- `#286376` - An issue with horizontal year view events has been fixed.

## 18.2.54 (2020-08-18)

### Schedule

#### Bug Fixes

- `#285796` - An issue with dragging the events to the first row in vertical view not working properly when page scrolling is enabled has been fixed.
- `#285797` - An issue with drag and drop not working properly in the vertical view in the last cell of the day when using the timescale property has been fixed.
- `#287725` - An issue with drag and drop doesn't work properly when we disable `timeScale` property has been fixed.

## 18.2.47 (2020-07-28)

### Schedule

#### Bug Fixes

- `#282556` - An issue with resizing the events has been fixed.
- `#284373` - An issue with adding multiple CSS classes to `cssClass` property has been fixed.

## 18.2.46 (2020-07-21)

### Schedule

#### Bug Fixes

- `#154622` - An issue with date format is not showing correctly in Mac browsers has been fixed.
- `#283631` - An issue with resizing not working properly with Timeline views when the resize interval is 5 has been fixed.
- `#284869` - An issue with events are disappeared after resizing the browser window has been fixed.
- `#280860` - An issue with the clone element while drag and drop on first resource has been fixed.
- `#232618, #236674, #246713, #246657, #271311` - An issue with Scheduler content is take some time delay to update when enabling resource virtual scrolling has been fixed.
- `#281573` - An issue with events not rendered in the `WorkWeek` view when applied `firstDayofweek` property has been fixed.
- `#283295` - An issue with script error thrown while clicking on the cell in multi level resource grouping scheduler has been fixed.
- `#282818` - An issue with the single resource can perform in multiple group with same resource id has been fixed.

## 18.2.44 (2020-07-07)

### Schedule

#### New Features

- **Inline Editing** - The feature enables user to Edit an appointment’s title or create an appointment easily through a single click on the cells or on the existing appointment’s subject.
- **Year View** - Utilize a horizontal year view in Schedule that exposes the annual view of the calendar. This will help users who navigate between years and months frequently.
- **Enhancement of Timeline Year View** - The existing timeline year view now has added support to configure multiple resources, enable row auto-height, and drag and drop appointments.

#### Bug Fixes

- `#280595` - An issue with event subject default field mapping is not consider in UI has been fixed.

## 18.1.56 (2020-06-09)

### Schedule

#### Bug Fixes

- `#278019` - An issue with drag and drop of vertical view events doesn't work properly when we disable `timeScale` property has been fixed.

## 18.1.55 (2020-06-02)

### Schedule

#### Bug Fixes

- `#271944` - An issue with header calendar doesn't close when using two scheduler in same document has been fixed.
- `#154305, #153364` - An issue with keypad closes instantly when opening the editor window on Android devices has been resolved.

## 18.1.54 (2020-05-26)

### Schedule

#### Bug Fixes

- `#151241` - An issue with `popupOpenEventArgs` API documentation has missing possible type value has been fixed.

## 18.1.52 (2020-05-13)

### Schedule

#### New Features

- Now resource grouping support has been added in timeline year view.

#### Bug Fixes

- `#272563` - An issue with drag and drop of all day events doesn't work properly when we disable `timeScale` property has been fixed.
- `#271586` - An issue with event is not created in Sunday and Saturday of the `WorkWeek` view has been fixed.
- `#153364` - An issue with appointment alignment while rotation has been fixed.
- `#273474` - An issue with `editFollowingEvent` has been fixed.

## 18.1.48 (2020-05-05)

### Schedule

#### Bug Fixes

- `#F11316` - An issue with `ToolbarActionArgs` is deprecated but without it, Print Exporting won't work has been fixed.
- `#273612` - An issue with blocked events in mobile mode has been fixed.

## 18.1.46 (2020-04-28)

### Schedule

#### Bug Fixes

- `#F11648` - An issue with previous value maintaining in select event has been fixed.
- `#F12531` - An issue with `allowMultiRowSelection` is not working properly in timeline views has been fixed.
- `#268604` - An issue with improper time slots rendering when daylight saving time occurring date has been fixed.
- `#271829` - An issue with selected class is not applied properly in `MonthAgenda` view has been fixed.
- `#273646` - An issue with `aria-readonly` attribute has been fixed.
- `#266725` - An issue with `scrollToResource` method when we enabled the `virtualScrolling` property has been fixed.
- `#271264` - An issue with `scrollToResource` method when we enabled the `rowAutoHeight` property has been fixed.

## 18.1.45 (2020-04-21)

### Schedule

#### Bug Fixes

- `#273039` - An issue with a resource field value doesn't get right if we have the same field mapping for all resource levels when `allowMultiple` is true has been fixed.
- `#F152942` - An issue with `getGroupIndexFromEvent` is not returning the correct result once the resource has enabled the `allowMultiple` property has been fixed.

## 18.1.44 (2020-04-14)

### Schedule

#### Bug Fixes

- `#151925` - An issue with locale words are not translated properly has been fixed.

## 18.1.43 (2020-04-07)

### Schedule

#### Bug Fixes

- `#269022` - In timeline views, an issue with appointments is positioned in the wrong place when browser zooming is set at 75% and 67% has been fixed.

## 18.1.42 (2020-04-01)

### Schedule

#### Bug Fixes

- `#269264` - An issue with last occurrence of the recurrence event is not rendered on month view has been fixed.

## 18.1.36-beta (2020-03-19)

### Schedule

#### Bug Fixes

- `#151738` - An issue with swipe action in mobile mode while applying `setWorkHours()` method has been fixed.
- `#151972` - An issue with particular recurrence event while changing time zone as `Eastern time` has been fixed.

## 17.4.55 (2020-03-10)

### Schedule

#### Bug Fixes

- `#266530` - An issue with the property `editFollowingEvents` with count repeat type has been fixed.
- `#266933` - An issue with the property `editFollowingEvents` does not work properly when block events presents has been fixed.
- `#266725` - An issue with the method `scrollToResource()` which does not work properly when the virtual scroll property is enabled has been fixed.
- `#151209` - An issue with swipe action in mobile mode when `minDate/maxDate` applied has been fixed.
- `#263624` - An issue with the scheduler rendered with the block events shows the misplaced header cells on the Timeline month view has been fixed.

## 17.4.51 (2020-02-25)

### Schedule

#### Bug Fixes

- `#151346` - An issue with unexpected delete alert behaviour for longer duration events has been fixed.
- `#151346` - An issue with multi select events of adaptive Scheduler mode has been fixed.
- `#151209` - An issue with misplaced dragging events in different time intervals has been fixed.
- `#149561` - An issue with scheduler throwing script error while dragging the event with the option `groupByDate` in day view has been fixed.
- `#263624` - An issue with the scheduler rendered with the block events shows the misplaced header cells on the Timeline month view has been fixed.
- `#151455` - An issue in long spanned events in year view has been fixed.
- `#263715` - An issue with dragging not working properly when page scrolling is enabled has been fixed.

## 17.4.50 (2020-02-18)

### Schedule

#### Bug Fixes

- `#148560` - An issue with misplaced dragging events in different drag intervals has been fixed.
- `#262962` - An issue with page becoming crash for invalid recurrence rule has been fixed.
- `#151346` - An issue with incorrect aria-label for alert windows has been fixed.

## 17.4.46 (2020-01-30)

### Schedule

#### New Features

- Provided public method to scroll to the position of the any resources that available on the scheduler.
- Provided public method to change the current view based on index.
- Added option to render single event per cell using `enableMaxHeight` property.

#### Bug Fixes

- `#F145578` - An issue with `scrollTo()` method not working properly in Timeline Week View has been fixed.

## 17.4.43 (2020-01-14)

### Schedule

#### Bug Fixes

- `#149393` - An issue with event rendering in Timeline mode with `timescale` property has been fixed.
- `#150335` - An issue with draggable clone element position on scroll has been fixed.
- `#256071` - An issue with `datepicker popup` not closing properly has been fixed.
- `#258565` - An issue with drag-and-drop flickering has been fixed.

## 17.4.41 (2020-01-07)

### Schedule

#### Bug Fixes

- `#150069` - An issue with recurrence count limitation has been fixed.
- `#148560` - An issue with drag interval has been fixed.
- `#258735` - An issue with event rendering in Timeline mode with `startHour` property  has been fixed.
- `#149868` - An issue with event resizing in Vertical mode with `startHour` property has been fixed.
- `#257355` - An issue with displaying the clicked date's event details in Month Agenda view with read only mode has been fixed.
- `#258455` - An issue with Accessibility has been fixed.

## 17.4.39 (2019-12-17)

### Schedule

#### Bug Fixes

- `#254033` - An issue with rendering Scheduler with empty resource collection has been fixed.
- `#252616` - An issue with page becoming idle for invalid recurrence rule has been fixed.
- `#149561` - An issue with drag and drop behaviour with resource date wise grouping option has been fixed.
- `#255919` - An issue with current month not displaying in calendar after swiping in mobile mode has been fixed.
- An issue with event position while zooming the page has been fixed.
- An issue with displaying wrong week number for DST time-zones has been fixed.

## 17.3.28 (2019-11-19)

### Schedule

#### Bug Fixes

- `#148606, #148770, #253868, #253137 , #253534` - An issue with displaying wrong timeslot and time for DST time-zones has been fixed.
- `#148560` - An issue with custom drag interval has been fixed.

## 17.3.27 (2019-11-12)

### Schedule

#### Bug Fixes

- `#253534` - An issue with displaying fractional value in Agenda view for DST time-zones has been fixed.
- `#253652` - An issue with triggering the `popupClose` event on clicking outside the Scheduler has been fixed.
- An issue with event height whose duration is less than 30 minutes has been fixed.
- `#253519` - An issue with events overlapping whose start and end time are same has been fixed.

## 17.3.19 (2019-10-22)

### Schedule

#### Bug Fixes

- `#251995` - An issue with request type parameter of action complete event while performing CRUD actions has been fixed.

## 17.3.17 (2019-10-15)

### Schedule

#### Bug Fixes

- An issue with displaying week number with different `firstDayOfWeek` has been fixed.
- `#244512` - An issue with recurrence option in editor template has been fixed.
- `#148187` - An issue with default flag missing in variable `$schedule-tbar-border-hover-color` from `bootstrap4` theme has been fixed.

## 17.3.16 (2019-10-09)

### Schedule

#### Bug Fixes

- `#147850`, `#249678` - An issue with event click action is not working in the latest version of iOS has been fixed.
- `#246126` - An issue with toolbar is not working properly in all overflow modes in Scheduler has been fixed.
- An issue with recurrence date is not generated properly in month option has been fixed.

## 17.3.14 (2019-10-03)

### Schedule

#### Bug Fixes

- `#240169` - An issue with drag and drop the appointments which are taller than the Scheduler has been fixed.
- `#249012` - An issue with editing the recurrence events in the block dates has been fixed.
- `#246295` - An issue with `QuickInfo` window is not open on cell click action has been fixed.
- `#245942`, `#241514` - An issue with scrolling is not working in properly in different mobile mode has been fixed.
- `#246563` - An issue with event is not rendered properly in agenda view has been fixed.
- `#244271` - An issue with editor window is not closed when edit the event has been fixed.
- `#246788` - An issue with cell selection event does not provide the proper cell details has been fixed.
- `#246565` - An issue with scroller position is not positioned at current date in timeline month view has been fixed.

## 17.3.9-beta (2019-09-20)

### Schedule

#### Bug Fixes

- `#147443` - An issue with editor window headers are misaligned in mobile mode has been fixed.
- `#147383` - An issue with drag and drop action is not working properly when `enableCompactView` disabled in mobile mode has been fixed.
- `#246161` - An issue with multiple cell selections are not maintained when mouse right button click action has been fixed.
- `#245932` - An issue with `showWeekend` field showing week ends either it is set as false has been fixed.

## 17.2.49 (2019-09-04)

### Schedule

#### Bug Fixes

- `#244555` - An issue with recurrence editor change event is not populate the updated rule value has been fixed.

## 17.2.47 (2019-08-27)

### Schedule

#### Bug Fixes

- `#245942` - An issue with `quick popup` open on tab hold action in mobile mode has been fixed.
- `#242531` - An issue with events not updated properly while changing Scheduler time zone dynamically has been fixed.
- `#244512` - An issue with recurrence editor value not mapping in custom editor window has been fixed.

## 17.2.41 (2019-08-14)

### Schedule

#### Bug Fixes

- `#241514` - An issue with clone element not removing in DOM while invoke `refreshEvents` public method.

## 17.2.40 (2019-08-06)

### Schedule

#### Bug Fixes

- `#242906` - An issue with action begin event is not triggered in event add action within editor template has been fixed.
- `#242299` - An issue with events misaligned in different browser zooming has been fixed.
- `#243422` - An issue with recurrence validation is showing unwanted alert has been fixed.
- `#240463` - An issue with end time value of editor window in month view has been fixed.
- `#146092` - An issue with displaying week number with different `firstDayOfWeek` has been fixed.

## 17.2.39 (2019-07-30)

### Schedule

#### Bug Fixes

- `#242057` - An issue with applying different work hours for each individual resource when the `byDate` option is enabled within `group` property has been fixed.
- `#240752` - An issue with recurrence option while using `editorTemplate` has been fixed.
- `#242634` - An issue with calendar format in timeline month view has been fixed.
- Getting wrong start and end time for the longer appointments in timeline views issue has been fixed.
- An issue with recurring events while defining recurrence rule on it that includes both BYMONTH, BYMONTHDAY and BYDAY properties together has been fixed.

## 17.2.35 (2019-07-17)

### Schedule

#### Bug Fixes

- `#240271` - An issue with misalignment of +more indicator when the custom elements and appointments are rendered in same cell has been fixed.

## 17.2.34 (2019-07-11)

### Schedule

#### Bug Fixes

- Start and end time of events in month and timeline views now been correctly acquired in `eventRendered` event and event template.
- `#240585` - Start time, end time and group index of clone element now been tracked in the events `drag` and `resizing`.
- `#240271` - An issue with misalignment of +more indicator when the custom elements and appointments are rendered in same cell has been fixed.

## 17.2.28-beta (2019-06-27)

### Schedule

#### New Features

- Improved the drag and resize action for longer duration appointments.
- Support to print the Scheduler layout.
- Provided an option to edit the following recurrence events.
- Provided time zone support to current time indicator.
- Provided public method to reset/remove the highlighted work cells.

#### Bug Fixes

- Localization is not set properly to `datetimepicker` in editor window issue has been fixed.
- `openEditor` method is not set the given start and end time in month view issue has been fixed.
- `#145352` - An issue with displaying expand icon of parent resource which has no child has been fixed.

## 17.1.51 (2019-06-11)

### Schedule

#### Bug Fixes

- `#234343` - An issue with adding resources dynamically when it has empty collection in initially has been fixed.
- `#235165` - An issue with `rowAutoHeight` property enabled the horizontal scroll wrongly in month view has been fixed.

## 17.1.50 (2019-06-04)

### Schedule

#### Bug Fixes

- `#234667` - An issue with Scheduler is not properly navigating to selected date in timeline views has been fixed.
- `#234974` - An issue with Deleting ready only events is fixed.
- `#143894` - An issue with selecting work cells for multiple rows is fixed.
- `#234587` - An issue with rendering events with huge number of events in same times in week view is fixed.

## 17.1.48 (2019-05-21)

### Schedule

#### Bug Fixes

- `#143979` - Events not rendered properly with `allowGroupEdit` when the resource id is two digit issue has been fixed.
- `#234916` - Delete key not working properly in IE11 issue has been fixed.

## 17.1.44 (2019-05-07)

### Schedule

#### Bug Fixes

- `#233286` - An issue with event not rendered properly in start and end time date format as string in agenda view is fixed.
- `#234231` - An issue with setting the different work hours in timeline week is fixed.
- `#143531` - An issue with event not loaded properly in agenda virtual scrolling is fixed.

## 17.1.43 (2019-04-30)

### Schedule

#### Bug Fixes

- `#233410` - An issue with date is not retrieved in view navigation in timeline month view is fixed.

## 17.1.42 (2019-04-23)

### Schedule

#### Bug Fixes

- `#143894` - An issue with select event arguments element value returns wrongly has been fixed.
- `#230544` - An issue with `editorTemplate` is not accessing the cell or event details has been fixed.
- `#229980`, `#229989` - An issue with appointment position misplaced in timeline views has been fixed.

## 17.1.41 (2019-04-16)

### Schedule

#### Bug Fixes

- `#143412` - An issue with event editing using public `saveEvent` method and checking slot availability using `isSlotAvailable` method is fixed.
- `#143720` - An issue with passing multiple resource for adding dynamically using `addResource` public method is fixed.
- `#232246` - An issue with event resizing is not properly update when `startHour` and `endHour` using in timeline views is fixed.
- `#231332` - An issue with block alert validation in recurrence event and data is not received in `popupOpen` event is fixed.

## 17.1.38 (2019-03-29)

### Schedule

#### Bug Fixes

- An issue while resizing all-day events in Scheduler, with disabled timescale mode is fixed.
- An event to trigger on selection of multiple cells or events has been added.

## 17.1.32-beta (2019-03-13)

### Schedule

#### New Features

- Provided support to auto-adjust the height of work cells based on the number of appointments present in the same time ranges.
- Support for exporting the Scheduler events to an Excel file format is provided.
- Support has been provided to export the Scheduler events to a calendar (`.ics`) file, as well as to import events from an `.ics` file into our Scheduler.

## 16.4.55 (2019-02-27)

### Schedule

#### Bug Fixes

- An issue with unable to scroll down the browser scroller, when the Scheduler is loaded with Month Agenda as current view has been fixed.

## 16.4.54 (2019-02-19)

### Schedule

#### Bug Fixes

- An issue with events not displaying correctly based on Agenda view's current date range has been fixed.
- An issue with recurring events while defining recurrence rule on it that includes both BYMONTH and BYDAY properties together has been fixed.
- An issue with incorrect casing of `popupOpen` event's parameters that triggers on cell click action has been fixed.
- An issue with 24 hours format not displaying in time cells of adaptive Scheduler mode has been fixed.

## 16.4.53 (2019-02-13)

### Schedule

#### Bug Fixes

- An issue that occurs on enabling the time interval for resizing in timeline day view has been fixed.

## 16.4.52 (2019-02-05)

### Schedule

#### New Features

- Improvements done to support creation of recurring events based on the recurrence rule properties, that lies under the criteria of limited combination.
- The recurring appointments of Scheduler can be now created and processed successfully based on the Islamic calendar dates.

## 16.4.47 (2019-01-16)

### Schedule

#### Bug Fixes

- An issue with event display order getting changed within the more event container of timeline views has been fixed.
- An issue with the display of time range text in `quick popup`, when both the start and end time of a spanned event has the same exact hours and minutes but with different dates has been fixed.

## 16.4.45 (2019-01-02)

### Schedule

#### Bug Fixes

- An issue with the display of `+n more popup` on Scheduler, while setting appointment time in seconds has been fixed.

## 16.4.44 (2018-12-24)

### Schedule

#### Bug Fixes

- An issue with `quick popup` opening on blocked time ranges has been fixed.

## 16.4.42 (2018-12-14)

### Schedule

#### New Features

- Provided support to display Scheduler in Islamic calendar mode.

## 16.4.40-beta (2018-12-10)

### Schedule

#### New Features

- A specific time range can be blocked on Scheduler now, to prevent the creation of appointments in that time slot.
- Specific events can be made read-only, restricting any CRUD actions.
- Load resources and appointments of timeline views virtually on every scroll action.

#### Bug Fixes

- An issue that occurs with BYDAY rule option, while defining day names in different order has been fixed.
- An issue with `eventClick` client-side event not triggering, while selecting multiple appointments by pressing `ctrl` key and mouse click combination has been fixed.
- An issue with wrong display of + more count indicator in all-day row has been fixed.

#### Breaking Changes

- The default value of `allowVirtualScrolling` has been changed to `false`.

## 16.3.32 (2018-11-13)

### Schedule

#### Bug Fixes

- An issue with date and time displaying wrongly on `quick popup` in the presence of Daylight Saving Time has been fixed.

## 16.3.31 (2018-11-07)

### Schedule

#### Breaking Changes

- Misalignment issue with edit and delete icons on edit `event popup` has been fixed.

## 16.3.29 (2018-10-31)

### Schedule

#### New Features

- Support to drag and drop an item from external source into scheduler and vice versa has been provided.
- In mobile devices, drag and drop support has been enabled by tap holding and moving the appointments over the time slots.
- Auto navigation option from current scheduler view to previous or next date range has been provided, while dragging an appointment to the left or right extremities of the view port.
- Scrolling action has been improved to enable smooth scrolling, while dragging an appointment to any of the view port extremities.

## 16.3.24 (2018-10-09)

### Schedule

#### Bug Fixes

- Misalignment issue with header cells of timeline views in Safari browser has been fixed.
- An issue with appointment resizing, when the scheduler is placed at bottom in a container that has scroll-able height has been fixed.

## 16.3.23 (2018-10-03)

### Schedule

#### Bug Fixes

- An issue with scheduler throwing script error while rendering it as hidden element has been fixed.

## 16.3.17 (2018-09-12)

### Schedule

#### New Features

- **Timeline view** - Displays the day, week, work week and month view layouts in timeline mode by illustrating both the date and time intervals in horizontal orientation. Also, it organizes the resource display in a hierarchical tree structure based on the grouping levels.
- **Header rows** - Provided support to add custom header rows on timeline views, to depict an additional row for displaying the corresponding year, month, week number and dates.
- **Drag and Drop** - Appointments can be easily rescheduled to some other time, by dragging and dropping it onto the required time slots.
- **Resize** - Appointment’s time can be easily extended either by resizing its start or end handlers.
- **Week Number** - Support added to display the week number of the current date, beside the date header section.
- Provided template support for customizing `quick popup`, that opens while clicking on the cells or appointments.
- The data type of the appointment ID field is made compatible to accept both string and number type values.

#### Bug Fixes

- An issue with customization done on `quick popup` getting lost, while clicking on the same target twice has been fixed.

## 16.2.47 (2018-08-07)

### Schedule

#### Bug Fixes

- An issue with `isSlotAvailable` method not returning proper event collection, while providing event’s start and end time data as its parameter has been fixed.

## 16.2.46 (2018-07-30)

### Schedule

#### Bug Fixes

- An issue with creation of weekly recurrence appointment, without providing `repeat every` field value has been fixed.
- An issue that occurred due to the improper destroy action on sub-components of scheduler has been fixed.

## 16.2.44 (2018-07-10)

### Schedule

#### Bug Fixes

- An issue with delete icon not displaying in a disabled state on `quick popup`, when scheduler is set to `readonly` has been fixed.

## 16.2.43 (2018-07-03)

### Schedule

#### Bug Fixes

- An issue with recurrence validation while using editor template has been fixed.
- An issue with recurring events on day view, created with UNTIL and WEEKLY rule combination has been fixed.
- An alignment issue with recurrence editor in bootstrap theme has been fixed.
- An issue with highlighting current day in month view, when `firstDayOfWeek` is set with the value other than `Sunday` has been fixed.
- An issue while customizing `quick popup` with normal HTML buttons has been fixed.

## 16.2.41 (2018-06-25)

### Schedule

#### New Features

- Distinct time interval option with customizable major and minor slots has been introduced to view the appointments clearly and accurately.
- An enhancement has been made to extend the default view range with customized intervals, to display 'n' number of days, weeks and months.
- Validation support on recurrence appointment(s) has been added.
- Multiple resources support has been added with the following options.
- **Group By Child** - To group the same child resource(s) under different parent resource(s).
- **Group By Date** -  To group the resource(s) on day basis.
- **Group Editing** - To edit all resource events simultaneously.
- **Custom Work Days** - To display the custom work days for each resource.
- Provided public methods to add or remove the resources dynamically.

#### Bug Fixes

- An issue with time format not displaying according to the given culture issue has been fixed.
- A script error occurring while enabling or disabling the time indicator option in Agenda view issue has been fixed.
- An issue with event not displayed in day and week views, when set with same start and end time has been fixed.
- An issue with displaying yearly recurrence event has been fixed.

##### Breaking Changes

- Type of `id` property within the `eventSettings.field` has been changed from `object` type to `string`.
- Appearance enhancement has been done on `quick popup` that opens, when single clicked on cells and events. Also, the same `popup` opens on single tap of events on mobile mode.

## 16.1.37 (2018-04-24)

### Schedule

#### Bug Fixes

- An issue with recurrence events created with UNTIL rule, which doesn't rendered on day view is fixed.
- An issue with buttons of quick window not getting disabled, while setting `readonly` property has been fixed.

## 16.1.28 (2018-03-09)

### Schedule

#### Bug Fixes

- Problem with all-day appointments that are created for spanned timeline in work week view is fixed.
- Traversing order of appointments while pressing `Tab` key and `Shift+Tab` combination keys is corrected.

## 16.1.24 (2018-02-22)

### Schedule

Schedule is an event calendar which facilitates user with the common Outlook-calendar features, thus allowing the users to plan and manage their appointments and its time in an efficient way.

- **Views** - Schedule is now availed with 6 different view modes – day, week, work week, month, agenda and month agenda. It is possible to configure view-based settings on each view mode. The `Week` view is set as active view by default.
- **Data binding** - Seamless data binding with various client-side and remote data sources thus allowing the data to load on demand by default to reduce the data transfer and loading time.
- **Recurrence** - Allows the user to repeat a set of events on a daily, weekly, monthly, or yearly basis.
- **Template** - The key elements like events, date header, work cells and event tooltip comes with the default template support which allows the flexible end-user customization to embed any kind of text, images, or styles to it.
- **Time zone** -  Regardless of whatever time zone your system follows, Schedule supports setting your own required time zone value to it as well as to each event – thus allowing the events to display on its exact local time.
- **Customizable working days and hours** - Users can set specific work hour range which is visually differentiated with active colour. Also, the working days collection can be customized with specific days, so that the remaining days will be considered as weekend.
- **Custom editor template** - Template option is availed for event editor, thus allowing the users to add their own custom editor design and also provides option to add additional fields onto the default event editor.
- **Adaptive rendering** - Adapts with optimal user interfaces for mobile and desktop form-factors, thus helping the user’s application to scale elegantly across all the form-factors without any additional effort.
- **Keyboard interaction** - All the common actions such as traversing through the appointments, multiple cell selection, add/edit/delete the appointments, navigate to other views, dates and much more can be performed through keyboard inputs.
- **Localization** - All the static text and date content can be localized to any desired language. Also, it can be displayed with appropriate time mode and date-format as per the localized language.
- **RTL** - Supports displaying the component to display in the direction from right to left.
