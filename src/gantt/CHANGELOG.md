# Changelog

## [Unreleased]

### Gantt

#### New Features

- `#304621, #322659` - Provided percentage support for height and width of Gantt element.

## 19.2.62 (2021-09-14)

### Gantt

#### Bug Fixes

- `#340421` - In smaller resolution the splitter appeared in wrong position issue has been fixed.
- `#341502` - Indicators disappear when datasource changed dynamically issue has been fixed.

## 19.2.60 (2021-09-07)

### Gantt

#### Bug Fixes

- `#340155` - Dialog closes when pressing insert key issue has been fixed.
- `#333851` - Dynamically changing the holidays issue has been fixed.

## 19.2.59 (2021-08-31)

### Gantt

#### Bug Fixes

- `#339434` - Issue in tooltip has been resolved.

## 19.2.57 (2021-08-24)

### Gantt

#### Bug Fixes

- `#339511` - Issue in maintaining resource selection has been resolved.
- `#338206` - Cleared warnings thrown in Firefox browser.

## 19.2.56 (2021-08-17)

### Gantt

#### Bug Fixes

- `#338587` - Issue in assigning empty data to datasource has been resolved.
- `#335677` - Issue in `expandAtLevel` and `collapseAtLevel` method with virtual scrolling has been resolved.

## 19.2.55 (2021-08-11)

### Gantt

#### Bug Fixes

- `#336211` - Issue with Virtual Scrolling in Firefox browse has been resolved.

## 19.2.47 (2021-07-13)

### Gantt

#### Bug Fixes

- `#331618` - Issue in updating `dataSource` property has been fixed.
- `#333672` - Issue in calculating duration across DST has been fixed.
- Issue in tooltip position has been fixed.

## 19.2.46 (2021-07-06)

### Gantt

#### Bug Fixes

- `#331671` - Right Labels are rendered properly in exported PDF document.
- `#332161` - Issue fixed when drag and drop performed after adding record through context menu.

## 19.2.44 (2021-06-30)

### Gantt

#### New Features

- `#290125` - Provided support to add multiple tasks in Gantt.

## 19.1.69 (2021-06-15)

### Gantt

#### Bug Fixes

- `#330806` - When using `updateTaskId` method with predecessor field is not mapped in the `taskFields` has been fixed.
- At certain zoom level, both halves of year are H1 has been resolved.

## 19.1.66 (2021-06-01)

### Gantt

#### Bug Fixes

- `#328182` - Mismatch between timeline and chart body content has been fixed.
- `#165629` - Notes updated properly in Gantt chart when new task is added.
- `#325331` - Immutable mode issue on data source refresh has been fixed.
- `F163073` - Issue on `RemoteSaveAdaptor` has been fixed.

## 19.1.64 (2021-05-19)

### Gantt

#### Bug Fixes

- `#325587` - Issue while deleting resource on split task has been fixed.
- Issue on dynamically changing the `allowTaskbarEditing` property has been fixed.
- `#165210` - Issue while filtering using Excel type has been fixed.
- `#327043` - Issue in rendering taskbar template has been fixed.

## 19.1.63 (2021-05-13)

### Gantt

#### New Features

- `#264444, #296315` - Provided support for managing date with different time zones.
- `#317529, #320843` - Provide support to cancel the merging of split tasks using client-side event.
- `#307881`, `#309475`, `#325067` - Improved performance while scrolling, when predecessors are mapped.

#### Bug Fixes

- `#326155` - Issue in splitting task using public method has been fixed.
- `#325948` - Issue in adding new task with empty string has been fixed.
- `#325585` - Issue while defining columns and dynamically changing the view type has been fixed.

## 19.1.59 (2021-05-04)

### Gantt

#### Bug Fixes

- `#325250` - Progress updated properly in manual scheduling.
- `#324644` - Issue on adding records, when Gantt view is changed has been fixed.
- `#325627` - Editing works fine after when holiday is set dynamically.

## 19.1.58 (2021-04-27)

### Gantt

#### Bug Fixes

- `#324141` - Issue in tooltip rendering position has been fixed.
- `#320979` - Issue on changing data source and timeline settings on same time has been fixed.
- `F163357` - Duplicating issue when a task is dropped below an unassigned resource in the resource view has been fixed.
- `F164497` - Issue in editing end date of a task has been fixed.

## 19.1.57 (2021-04-20)

### Gantt

#### Bug Fixes

- `F164497` - Issue in editing end date of a task has been fixed.

## 19.1.56 (2021-04-13)

### Gantt

#### Bug Fixes

- `#320979` - Provided support to update data source dynamically with `collapseAllParentTasks` and `enableMultiTaskbar` enabled mode.

## 19.1.55 (2021-04-06)

### Gantt

#### Bug Fixes

- `#320882` - Issue on expand/collapse icon in `Resource view` has been fixed.

## 19.1.54 (2021-03-30)

### Gantt

#### New Features

- `#298361` - Provided Observable data binding support in Gantt.
- `#300136` - Provided support for tab like behaviour on cell navigation for cell edit mode.

## 18.4.49 (2021-03-23)

### Gantt

#### New Features

- `#317550` - Provided support to define `valueAccessor` as string.

#### Bug Fixes

- Console error when end date of segments is given as string has been fixed.

## 18.4.47 (2021-03-09)

### Gantt

#### Bug Fixes

- `316898` - Maintained additional fields in segments on zooming action.

## 18.4.44 (2021-02-23)

### Gantt

#### Bug Fixes

- `#315501` - Error on closing filter menu while focusing out has been resolved.

## 18.4.43 (2021-02-16)

### Gantt

#### Bug Fixes

- `#306101` - Rendered milestone at default end time on taskbar editing.
- `#313819` - Highlighted bottom tier weekend header cell.

### Gantt

#### Bug Fixes

- `#311841` - Duplicating records issue while indent action has been resolved.
- `F160722` - Error on rendering editing tooltip has been resolved.
- `F161444` - Error while hiding context menu items has been resolved.

## 18.4.41 (2021-02-02)

### Gantt

#### Bug Fixes

- `#298884` - Error on reorder rows method has been fixed.

#### New Features

- `#306342` - Included target element in `actionBegin`, `taskbarEditing`, `contextMenuOpen` events.

## 18.4.39 (2021-01-28)

### Gantt

#### New Features

- `#291192` - Provided Immutable Support to refresh specific rows while performing Gantt actions.

#### Bug Fixes

- `F161492` - Console error on converting milestone to task has been fixed.

## 18.4.35 (2021-01-19)

### Gantt

#### Bug Fixes

- `F161492` - Console error on drag and drop action has been fixed.
- `F161492` - Issue on indent action has been fixed.

## 18.4.33 (2021-01-05)

### Gantt

#### Bug Fixes

- `#298884` - Issue on reorder rows method in virtual scroll support has been fixed.

## 18.4.32 (2020-12-29)

### Gantt

#### Bug Fixes

- `F160722` - Issue on editing tooltip template has been fixed.
- `#306971` - HTML encoder issue with notes column has been fixed.
- `#306928` - Timeline width issue on zoom to fit action has been resolved.

## 18.4.31 (2020-12-22)

### Gantt

#### Bug Fixes

- `#306741` - Issue on closing filter menu while focusing out has been fixed.
- `#306556` - Issue on duration field of add dialog has been fixed.
- `#305822` - Issue on updating height on browser resizing has been fixed.
- `#307295` - Issue on updating data source dynamically has been fixed.
- `#305728` - Issue on loading large number of records in resource tab has been fixed.

## 18.4.30 (2020-12-17)

### Gantt

#### New Features

- `#298884` - Provided `Virtual Scroll` support for Gantt.

#### Bug Fixes

- `#306090` - Issue on pressing delete key when add/edit dialog is opened has been fixed.
- `#306342` - Included additional field in `taskData.segments`.
- `#305420` - Issue on triggering `rowSelected` event while opening context menu has been fixed.

## 18.3.52 (2020-12-01)

### Gantt

#### Bug Fixes

- `F159625` - Console error on indent action after adding record has been fixed.

## 18.3.51 (2020-11-24)

### Gantt

#### Bug Fixes

- `301606` - Issue in template column when use it as `treeColumnIndex` has been fixed.

## 18.3.50 (2020-11-17)

### Gantt

#### Bug Fixes

- `293889` - Console error in split task when allowTaskbarEditing is disable has been fixed.
- `300744` - Console error on clicking add/edit toolbar has been fixed.
- `301653` - Issue on split task when date is given as string has been fixed.

## 18.3.48 (2020-11-11)

### Gantt

#### Bug Fixes

- `299695` - Issue in left label template has been fixed.
- `F159354` - Issue in locale text of predecessor tooltip has been fixed.
- `300962` - Included timeline property in actionComplete event after zooming action.
- `300804` - Issue in displaying resources when data source is empty has been fixed.

## 18.3.47 (2020-11-05)

### Gantt

#### New Features

- `#292246` - Provided support to split the taskbar into multiple segments through context menu and dialog edit.
- `#282972, #293345` - Provided support to render predecessor and rows properly in different zooming levels and display scaling size.

#### Bug Fixes

- `#295381` - Issue on exporting Gantt with partial data has been fixed.
- `#299370` - Issue on restricting dragging action when read only property set to true.
- `F159153` - Issue in localized text of dependency tab default value has been fixed.
- `F158903` - Issue while sorting after add task action has been fixed.

## 18.3.42 (2020-10-20)

### Gantt

#### Bug Fixes

- `#296920` - Issue on rendering Gantt with resources has been fixed.
- `F158128` - Issue on updating DB on `indent` and `outdent` action has been fixed.
- `#291962` - Dates are not filtered with given date format issue has been fixed.
- `#295998` - Events are not triggered properly while perform zoom to fit actions has been fixed.

## 18.3.35 (2020-10-01)

### Gantt

#### Bug Fixes

- `#293528` - Issue when work value is given as decimal values has been fixed.

## 18.2.59 (2020-09-21)

### Gantt

#### New Features

- `#292825` - Provided support to improvement of trigger actions on key press.

#### Bug Fixes

- `#293539` - Issue while dynamically updating `allowRowDragAndDrop` gets fixed.
- `#292470` - Issue on edit template in dialog has been fixed.
- `#293749` - Edit `params` not worked properly for progress column has been fixed.

## 18.2.57 (2020-09-08)

### Gantt

#### Bug Fixes

- `#290457` - Issue on customizing the background colour of taskbar in Resource view has been fixed.
- `F157498` - Console error on indenting record after sorting has been fixed.

## 18.2.56 (2020-09-01)

### Gantt

#### Bug Fixes

- `#291158` - Console error on destroy Gantt when allowKeyboard is false has been fixed.
- `#279528` - Dialog dependency drop-down list has existing dependency data has been fixed.

## 18.2.55 (2020-08-25)

### Gantt

#### Bug Fixes

- `#288438` - Tooltip rendering issue has been fixed.
- The issue of the bottom tire format in Chinese culture has been fixed.

## 18.2.48 (2020-08-04)

### Gantt

#### New Features

- `#287282` - Provided support to change viewType of Gantt dynamically.

#### Bug Fixes

- `#285626` - Console error while rendering multiple Gantt has been fixed.
- `#285749` - Issue on parent progress calculation while delete child record has been fixed.

## 18.2.47 (2020-07-28)

### Gantt

#### Bug Fixes

- `#284995` - Issue in predecessor lines of exported pdf document has been fixed.
- `#284995` - Content overflow issue in exported pdf document has been fixed.
- `#284052` - Editing issue in Gantt Chart when using DB has been fixed.

#### New Features

- `#280004` - Given support to render edit template fields in Gantt edit dialog.

## 18.2.46 (2020-07-21)

### Gantt

#### Bug Fixes

- `#276968` - Column misalignment issue after editing has been fixed.
- `F155689` - Issue on expanding records while mapping expand status of record has been fixed.

## 18.2.45 (2020-07-14)

### Gantt

#### Bug Fixes

- `#278235` - Parent Id is not updated properly on row drag and drop action issue gets resolved.
- `F155766` - PDF export document Gantt timeline issue after zooming has been resolved.
- `#279872` - Issue while updating add and edit dialog fields in action begin events are resolved.
- `#275651` - Issue while dynamically updating `worWeek` gets fixed.
- `#277029` - Updating custom column in action begin event issue gets resolved.

## 18.2.44 (2020-07-07)

### Gantt

#### New Features

- `#245866, #279740, #248032` - Provided support to `render multiple resource tasks` in a row on collapsed state in resource view Gantt.
- `#252413` - Provided support to display the `over allocation` indicators for a resources in resource view Gantt.
- `#262121` - Provided support for `dependency` between two tasks in resource view Gantt.
- `#269776` - Provided support for rendering Gantt as `read only`.

## 18.1.59 (2020-06-23)

### Gantt

#### Bug Fixes

- `#281103`- Taskbar not rendered properly while cancel the new child record by context menu action has been fixed.
- `#281247`- Parent id is not updated on add a child record by context menu has been fixed.
- `#279689` - Issue in displaying values with boolean edit type was fixed.
- `#281102`, `#281154` - Events not triggered with correct request type in indent action has been fixed.
- `#281251` - Not continued to tab onto the next non-Gantt Chart element issue has been fixed.
- `#280070`- Issue on pdf export date format mismatch in Gantt has been fixed.
- `#279234` - Console error while selecting the record issue gets resolved.
- `#279689`- Issue in updating start date with date time picker when custom columns are rendered has been fixed.
- `#280802` - Issue on maintaining parent Id value while adding records with empty data source gets fixed.

## 18.1.57 (2020-06-16)

### Gantt

#### New Features

- `#278724` - Provided support for hiding ID column in dependency tab.

## 18.1.55 (2020-06-02)

### Gantt

#### Bug Fixes

- `#278176` - Zoom in or zoom out toolbar button disabled after zoom to fit action was fixed.
- `#278238` - Action begin event not triggered on finish to finish predecessor was fixed.

#### New Features

- `#269776` - Provided support for `expandAtLevel` method and changed `expandByIndex` method parameter as array type.

## 18.1.54 (2020-05-26)

### Gantt

#### Bug Fixes

- `#277029` - Update value not display on edit action issue has been fixed.
- `#276942` - Issue while passing additional parameter to the server side on CRUD operation has been fixed.

## 18.1.53 (2020-05-19)

### Gantt

#### Bug Fixes

- `#39566` - Issue when remove event markers dynamically has been resolved.
- `F154261`,`#276047` - Issue while adding new record with empty data on load time gets resolved.
- `#274206` - Issue in updating resource column gets resolved.

#### New Features

- `#273107` - Provided support to render task type on load time.

#### Breaking Changes

- Now the resource value in the `taskData` is always array of objects type and it is irrespective of resource value type in data source.

## 18.1.52 (2020-05-13)

### Gantt

#### Bug Fixes

- `#268349` - Issue on maintaining duration data type gets resolved.
- Column filter menu displayed in wrong place has been fixed.

#### New Features

- Provided drag and drop support for resource view Gantt.
- `#271392` - Provided support to update task id dynamically.
- `#269776` - Provided support to indent a selected record.

## 18.1.48 (2020-05-05)

### Gantt

#### Bug Fixes

- `#273422` - Date mismatch for parent and child record gets resolved.

## 18.1.46 (2020-04-28)

### Gantt

#### Bug Fixes

- `#273440` - Issue on updating end date value using cell edit gets resolved.
- `#273426` - Issue on validating parent start date on taskbar edit action gets resolved.
- `#274066` - Console error on dragging parent milestone task gets resolved.

## 18.1.45 (2020-04-21)

### Gantt

#### Bug Fixes

- `#268281` - Issue on adding dependency using dialog gets resolved.

## 18.1.44 (2020-04-14)

### Gantt

#### Bug Fixes

- `#270801` - Issue on end date calculations gets resolved.
- `#270563` - Console error throws while taskbar resizing with use of taskbar template has been fixed.
- Issue in mapping custom class of task from data source has been fixed.

## 18.1.43 (2020-04-07)

### Gantt

#### New Features

- `#269693, #269694` - Provided accessibility support for column header and filter.

#### Bug Fixes

- `#270384` - Prevented event markers, indicators, holidays, baseline consideration for timeline while doing zoom to fit action.

## 18.1.42 (2020-04-01)

### Gantt

#### Bug Fixes

- `#264099` - Console error on tab key press has been fixed.
- `#269692`,`#269690` - Issue on focussing to the next element has been fixed.
- `#269772` - Prevented taskbar editing tooltip while tooltip is disabled.

## 18.1.36-beta (2020-03-19)

### Gantt

#### New Features

- `#238591`,`#247663`,`#253913`,`#263052`,`F147148`,`F147548`,`F149280` - Provided support for PDF export which exports Gantt data to PDF format.
- `#258677`,`#264570`,`F149280` - Provided support for manual task scheduling which is used to scheduling the task manually without any dependency.
- `F146634` - Provided support for Resource Unit, which indicate the efficiency of resource by each task and Work mapping support which is used to allocate the total number of works to a task.
- `#245866`,`#252413`,`#262485`,`F147349` - Provided support for the Resource view which is used to visualize the list of tasks assigned to each resource in hierarchical order.

#### Bug Fixes

- `#263236` - Issue on multi-level dragged parent dropped into last index has been fixed.
- `#264099` - Issue in tab key action in edited state is fixed.

## 17.4.46 (2020-01-30)

### Gantt

#### New Features

- `F148795` - Provided custom editor support in dialog edit.
- `F149069` - Provided support to render parent as milestone.
- `#257320` - Provided support for 'zoom to fit' based on visible tasks alone.

#### Bug Fixes

- `F150408` - Baseline tooltip not rendered for milestone tasks has been fixed.
- `#260944` - Issue in preventing taskbar editing has been fixed.

## 17.4.44 (2021-01-21)

### Gantt

#### Bug Fixes

- `#260331` - Typescript declaration issue fixed.

## 17.4.41 (2020-01-07)

### Gantt

#### New Features

- `#253076` - Provided support to focus Gantt on tab key press.

## 17.4.40 (2019-12-24)

### Gantt

#### Bug Fixes

- `F149551` - Handled empty value while editing the numeric edit type field.

## 17.4.39 (2019-12-17)

### Gantt

#### Bug Fixes

- `F147793` - Context menu not closing issue while scrolling on the Gantt element has been fixed.

#### Breaking Changes

- Now `dateFormat`  default value has been changed to null and the value will be updated by given culture. It is also possible to override `dateFormat` property by custom value.

#### New Features

- `#253909` - Provided support for converting a task to milestone by method.
- `F148875` - Provided support for disabling column editing on dialog popup.
- `F146587` - Provided support for taskbarClick event in Gantt.
- `F146585` - Provided support for mouseHover event in Gantt.

## 17.3.30 (2019-12-03)

### Gantt

#### Bug Fixes

- `#253076` - Accessibility issues in Gantt has been fixed.

## 17.3.29 (2019-11-26)

### Gantt

#### Bug Fixes

- `F149069` - Parent taskbar alignment issue while rendering with single milestone child record has been fixed.
- `F149070` - Key navigation disable issue on Tree Grid section has been fixed.
- `#255266` - ParentID field not available in taskData field has been fixed.

## 17.3.28 (2019-11-19)

### Gantt

#### Bug Fixes

- `#253912` - Parent taskbar disappearance issue while deleting all its child records has been fixed.

## 17.3.19 (2019-10-22)

### Gantt

#### Bug Fixes

- `249581` - Browser hangs issue while change schedule mode to year has been fixed.
- `252195` - Issue on forEach method iteration in IE11 has been fixed.

## 17.3.14 (2019-10-03)

### Gantt

#### Bug Fixes

- `F147755` - Chart part disappearing issue when splitter position value greater than control width has been fixed.

## 17.3.9-beta (2019-09-20)

### Gantt

#### Bug Fixes

- `#245866` - Alignment issue with `height` property value as `auto` has been fixed.
- `F145725` - Issue with cell editing on newly added record has been fixed.
- `#246761` - Issue while providing date field value with empty string value and invalid date values has been fixed.
- `#247124` - Issue while loading Gantt SB samples in Mobile devices has been fixed.
- `F147329` - Issue in progress calculation with unscheduled tasks has been fixed.
- `F147380` - Issue with prevent edit dialog has been fixed.

#### New Features

- `#233407` - Provided support to perform Excel and CSV exporting in Gantt.

## 17.2.46 (2019-08-22)

### Gantt

#### Bug Fixes

- `F145733` -  Alignment issue with header and rows on splitter resizing has been fixed.
- `F146641` - Issue with indicators tooltip support has been fixed.

## 17.2.41 (2019-08-14)

### Gantt

#### Bug Fixes

- `#243770` - Issue in date picker with custom format has been fixed.
- `#243238` - Included current edited data in `actionComplete` event arguments.

## 17.2.40 (2019-08-06)

### Gantt

#### Bug Fixes

- #F145936 -  Custom column values not updated in data source on Editing has been fixed.
- Lexical declaration issues in es2015 has been fixed.

## 17.2.36 (2019-07-24)

### Gantt

#### Bug Fixes

- #241781 - Gantt task-data property missing in template data issue has been fixed.

## 17.2.28-beta (2019-06-27)

### Gantt

#### Bug Fixes

- #238228 - Issue while rendering tooltip with smaller duration has been fixed.

#### New Features

- Now Gantt supports context menu to perform various action.
- Provided support to perform timeline zoom in, zoom out and zoom to fit actions in Gantt.
- Provided key interaction support in Gantt.

## 17.1.49 (2019-05-29)

### Gantt

#### Bug Fixes

- #F144145 - Task Id duplication issue while adding new record has been fixed.

## 17.1.47 (2019-05-14)

### Gantt

#### Bug Fixes

- #233041 - Alignment issue with timeline and vertical lines has been fixed.

#### New Features

- #F143360 - Provided support to refresh the `dataSource` dynamically.

## 17.1.43 (2019-04-30)

### Gantt

#### Bug Fixes

- Bug fixes included.

## 17.1.40 (2019-04-09)

### Gantt

#### Bug Fixes

- Internal bug fixes included.

## 17.1.32-beta (2019-03-13)

### Gantt

- **Data sources** – Bind hierarchical or self-referential data to Gantt chart with an array of JavaScript objects or DataManager.
- **Timeline** – Display timescale from minutes to decades easily, and also display custom texts in the timeline units. Timeline can be displayed in either one-tier or two-tier layout.
- **Customizable Taskbars** – Display various tasks in a project using child taskbar, summary taskbar and milestone UI, that can also be customized with templates.
- **Unscheduled tasks** – Support for displaying tasks with undefined start date, end date or duration in a project.
- **Baselines** – Display the deviations between planned dates and actual dates of a task in a project using baselines.
- **CRUD actions** – Provides the options to dynamically insert, delete and update tasks using columns, dialog and taskbar editing options.
- **Task dependency** – Define or update the dependencies between the tasks in a project with four types of task dependencies Finish – Start, Start – Finish, Finish – Finish, Start – Start.
- **Markers and indicators** - Support for displaying indicators and flags along with taskbars and task labels. Also map important events in a project using event marker.
- **Filtering** – Offers filtering the Gantt content using column menu filtering along with toolbar search box.
- **Customizable columns** – Customize the columns and add custom columns to Gantt chart at initialization through column property.
- **Enriched UI** – Support for Material, bootstrap, fabric and high contrast themes along with other UI options like holidays support, vertical and horizontal grid lines support and so on.
- **Localization** - Provides inherent support to localize the UI.
