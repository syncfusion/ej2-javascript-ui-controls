# Changelog

## [Unreleased]

## 16.4.54 (2019-02-19)

### Schedule

#### Bug Fixes

- An issue with events not displaying correctly based on Agenda view's current date range has been fixed.
- An issue with recurring events while defining recurrence rule on it that includes both BYMONTH and BYDAY properties together has been fixed.
- An issue with incorrect casing of `popupOpen` event's parameters that triggers on cell click action has been fixed.
- An issue with 24 hours format not displaying in time cells of adaptive Scheduler mode has been fixed.
- An issue with unable to scroll down the browser scroller, when the Scheduler is loaded with Month Agenda as current view has been fixed.

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