# Changelog

## [Unreleased]

## 24.2.5 (2024-02-13)

### GanttChart

#### Bug Fixes

- `#I544540` - Offset value not calculated properly issue has been fixed.
- `#I552745` - Pressing enter key in dialog refresh the Gantt issue has been fixed.
- `#I551289` - The zoom in action before horizontal scroll, after the zoom action triggers, alignment issues occur issue has been fixed.
- `#I532096` - Failing Karma Test cases in Angular issue has been fixed.

## 24.2.4 (2024-02-06)

### GanttChart

#### Bug Fixes

- `#I550406` - Task type property does not update properly by mapping work field issue has been fixed.
- `#I542029` - Unable to render full lengthy text in pdf export issue has been fixed.
- `#I549638` - The taskbar edit action is not working in RTL mode issue has been fixed.
- `#I544478` - Validation rules not working for numeric field issue has been fixed.

## 24.2.3 (2024-01-31)

### GanttChart

#### Bug Fixes

- `#I540355` - RTE create column not working in dialog box issue has been fixed.
- `#I543351` - The taskbar render validation not working properly issue has been fixed.

## 24.1.47 (2024-01-23)

### GanttChart

#### Bug Fixes

- `#I540518` - Can't able to drag and drop to the new resource issue has been fixed.
- `#I185970` - Dynamic template updating in columns does not render issue has been fixed.
- `#I538002` - Alignment Issue with PDF Export in React Gantt issue has been fixed.

## 24.1.46 (2024-01-17)

### GanttChart

#### Bug Fixes

- `#I533229` - Server call is triggered twice issue has been fixed.
- `#I531670` - When adding a record by method before saving, if the task ID is changed after taskbar hover exception thrown issue has been fixed.
- `#I538917` - Text is not rendered properly in header while using page size issue has been fixed.
- `#I185970` - Dynamic template updating in columns does not render issue has been fixed.

## 24.1.45 (2024-01-09)

### GanttChart

#### Bug Fixes

- `#I530808` - Progress width not rendered properly in split tasks issue has been fixed.
- `#F185683` - Resources are not updating properly in `actionBegin`event issue has been fixed.
- `#I532918` - Baseline width not rendered properly in PDF export issue has been fixed.
- `#F532918` - Issue with remote data while performing CRUD operation in various Gantt chart versions has been fixed.
- `#I521365` - Dates in tooltip not rendered correctly issue has been fixed.

## 24.1.44 (2024-01-03)

### GanttChart

#### Bug Fixes

`#I531670` - When adding record by method before saving, if the task ID is changed after taskbar hover exception thrown issue has been fixed.

## 24.1.43 (2023-12-27)

- `#I527509` - Action begin event arguments not working properly issue has been fixed.
- `#I517104` - Gantt component hangs whole page if timezone changed to UK(London) issue has been fixed.

## 23.2.5 (2023-11-23)

### GanttChart

#### Bug Fixes

- `#I520118` - Console error occurs other than self reference data issue has been fixed.
- `#I515425` - Issue with observable data binding in Gantt chart issue has been fixed.
- `#I520146` - Timeline render in advance the project start date while resizing taskbar issue has been fixed.
- `#I521906` - Milestone not working properly while drop at weekend issue has been fixed.
- `#I516954` - Dependency line not render after adding child record issue has been fixed.

## 23.2.4 (2023-11-20)

### GanttChart

#### Bug Fixes

- `#I517359` - Columns does not update while changing columns value by Gantt instance issue has been fixed.
- `#I514463` - PDF exported with blank pages and dislocated connected lines issue has been fixed.
- `#I514452` - Baseline does not render by changing date issue has been fixed.

## 23.1.44 (2023-11-07)

### GanttChart

- `#I513332` - Excel filter only takes one character at a time issue has been fixed.
- `#I517515` - Custom toolbar template not renders after toolbar click action in Gantt issue has been fixed.

#### Bug Fixes

## 23.1.43 (2023-10-31)

### GanttChart

#### Bug Fixes

- `#I493515` - Console error throw while Expand and collapse the parent taskbar issue has been fixed.
- `#I513655` - Filter menu close as soon as the mouse is up issue has been fixed.

## 23.1.42 (2023-10-24)

### GanttChart

#### Bug Fixes

- `#I508297` - Progress tooltip is misaligned after editing issue has been fixed.
- `#I509023` - Duration changes to zero while giving input as decimal in remote data issue has been fixed.
- `#I510092` - Taskbar not rendered in proper alignment in exported page issue has been fixed.
- `#I512556` - Background color issue with dependency connector line has been fixed.
- `#I502236` - Taskbar drag and drop issue in virtual scroll resource view issue been fixed.

## 23.1.41 (2023-10-17)

### GanttChart

#### Bug Fixes

- `#I494495` - Script error occurs when trying to edit after sorting in presence of validation message  issue has been fixed.
- `#I508721` - Baseline date does not render properly for milestone task issue has been fixed.
- `#I482456` - Critical path tasks not validated after drag and drop issue has been fixed.

## 23.1.39 (2023-10-04)

### GanttChart

#### Bug Fixes

- `#I502041` - Error throw while adding the record issue has been fixed.
- `#I493515` - Style is not applied to the second segment issue has been fixed.

## 23.1.38 (2023-09-26)

### GanttChart

#### Bug Fixes

- `#I479961` - Milestone baseline moves along with the milestone issue has been fixed.
- `#I501391` - Misalignment in tooltip when connecting predecessor.
- `#I495216` - Predecessor is not displayed when we give `GUID` issue has been fixed.
- `#I499587` - Update of custom column in general tab issue has been fixed.
- `#I184189` - Changing values in the action Begin event does not reflect while rendering issue has been fixed.
- `#F184629` - Milestone not rendered properly after editing issue has been fixed.
- `#I492520` - Critical path styling not getting cleared correctly issue has been fixed.
- `#I502650` - Taskbar dragging and progress resizing while moving the mouse outside chart issue has been fixed.
- `#I493515` - When we collapse with Virtualization, the styles doesn't apply properly issue has been fixed.
- `#I486977` - White space issue occur when we close the side pane issue has been fixed.

## 23.1.36 (2023-09-15)

### GanttChart

#### Features

- `#I275966` - Provided lazy loading support in Gantt chart. Please find the demo link [here](https://ej2.syncfusion.com/demos/#/bootstrap5/gantt/load-on-demand.html).
- `#I396039` - Provided baseline support for PDF export in Gantt Chart.
- Provided support to export the Gantt component where each rows are auto-fit to the PDF document page width. Please find the demo link [here](https://ej2.syncfusion.com/demos/#/bootstrap5/gantt/exporting.html).
- Provided touch interaction support for taskbar resizing, dragging, predecessor connectivity in Gantt chart.

#### Bug Fixes

- `#I492654` - When empty data source pdf export exception thrown issue has been fixed.
- `#I479578` - Milestone parent is not appearing issue has been fixed.

## 22.2.12 (2023-09-05)

### GanttChart

#### Bug Fixes

- `#I488557` - The project dates are not modified after changing the timeline.
- `#I472635` - When pressing the insert key `newRowPosition` bottom row is not highlighted.
- `#I489655` - Milestone is not converting back to taskbar when we have milestone property has been fixed.
- `#I492520` - Critical path styling not getting cleared correctly issue has been fixed.
- `#I492654` - When empty data source pdf export exception thrown issue has been fixed.
- `#I485527` - Filter menu opening issue in column menu has been fixed.
- `#I494859` - Gantt shrinks when we update the datasource issue has been fixed.

## 22.2.11 (2023-08-29)

### GanttChart

#### Bug Fixes

- `#I485527` - Filter menu opening issue in column menu has been fixed.
- `#I491313` - Multiple records were selected after using the context menu, adding the milestone position wrong issue has been fixed.
- `#F183168` - Gantt Chart not refreshing after adding new item is fixed.
- `#I491178` - Data modified in the server is not reflected in the rendered Gantt Chart is fixed.

## 22.2.10 (2023-08-22)

### GanttChart

#### Bug Fixes

- `#I486977` - Zoom To Fit issue when we resize browser window has been fixed.
- `#I484086` - Other instance of the taskbar not moved in the resource view issue has been fixed.
- `#I482456` - Critical path is incorrect in the Gantt Chart issue has been fixed.

## 22.2.9 (2023-08-15)

### GanttChart

#### Bug Fixes

- `#I485657` - Misalignment happened in timeline while exporting `PDF` in Gantt has been fixed.
- `#I485398` - console error occurs while using segment data issue has been fixed.
- `#I487527` - Data manager URL is called twice.
- `#I484079`- Vertical scroll and taskbar is not fully visible in yearly mode issue has been fixed.
- `#I461564`- No action is performed when we try to add task when the cell is in edited state issue has been fixed.
- `#I486234` - Label gets hidden in Gantt Chart when task mode is manual issue has been fixed.

## 22.2.8 (2023-08-08)

### GanttChart

#### Bug Fixes

- `#I485907` - When multiple records are selected after using the context menu to delete, it is not working issue has been fixed.
- `#I483579` - Splitter resize issue when we resize browser window issue has been fixed.
- `#I483399` - Style not applied for the collapsed row when the virtual scroll is enabled issue has been fixed.
- `#I473286` - Unable to drag taskbar and tooltip is misaligned issue has been fixed.

## 22.2.7 (2023-08-02)

### GanttChart

#### Bug Fixes

- `#I479591` - Critical path is not working properly when the baseline is changed dynamically issue has been fixed.
- `#F182867` - Edit parameters not working in date columns issue has been fixed.
- `#I479578` - Milestone get disappeared when we indent the record issue has been fixed.
- `#I481480` - Last segments resizing issue has been fixed.
- `#I481603` - Zoom To Fit while Search/Filtered then Clearing Search doesn't update Horizontal Scroll issue has been fixed.
- `#IF183168` - Record was not added in Gantt using `oDataV4Adaptor` issue has been fixed.
- `#I479607` - Search including extra results issue has been fixed.
- `#I481058` - Console error when we use RTL and taskbar template issue has been fixed.
- `#I482456` - Critical path not working properly issue has been fixed.
- `#I485219` - Selection is not working when we use react hook.
- `#I486928` - Incorrect time is displayed in the column.

## 22.2.5 (2023-07-27)

### GanttChart

#### Bug Fixes

-`#I472635`-Using insert key highlights top row has been fixed.
- `#I480002` - Can’t open task information in the context menu issue has been fixed.
- `#I479988` - Ghosting bars left on screen after cancelling task bar drag.
- `#I479961` - Milestone baseline moves along with the milestone issue has been fixed.
- `#I481999` - Page refresh when using validation rules for column issue has been fixed.

## 22.1.39 (2023-07-18)

### GanttChart

#### Bug Fixes

- `#I45187` - Border is changed to outline in CSS issue has been fixed.

## 22.1.38 (2023-07-11)

### GanttChart

#### Bug Fixes

- `#I474676` - Fit to project display wrong timeline issue has been fixed.
- `#I472975` - Manual task predecessor not properly fetching updated offset issue has been fixed.
- `#I471838` - White space occur when we change page size in `dataBound` event issue has been fixed.
- `#I475099` - Context menu is not opening when the dataSource is empty.
- `#I477253` - Inserting a task prevents scrolling to top of list.
- `#I461924` - Issue with collapse all Toolbar Option issue has been fixed.
- `#I475987` -Edit template is not working when the virtualization is enabled.

## 22.1.37 (2023-07-04)

### GanttChart

#### Bug Fixes

- `#I471925` - Cannot see a Dragged Task after Zoom In issue has been fixed.
- `#I473517` - Incorrect taskbar render when unit is given in hour issue has been fixed.
- `#I473451` - Segment taskbar is not rendered correctly  issue has been fixed.
- `#I471730` - Taskbar not rendered properly based on duration issue has been fixed.

## 22.1.36 (2023-06-28)

### GanttChart

#### Bug Fixes

- `#I473901` - Baseline converted to milestone when task gets converted into milestone issue has been fixed.
- `#I471926` - Console error occurs in critical path when data source is empty issue has been fixed.
- `#I469289` - Fit to project is not working properly issue has been fixed.
- `#I473341` - Tooltip template not working properly issue has been fixed.
- `#I467372` - no drop icon is displayed while dropping in Gantt chart.
- `#F182867` - Edit template for start date column not works issue has been fixed.
- `#I470521` - Toolbar template is not working properly in react issue has been fixed.
- `#I44322` - Row Selection behaviour occurs differently in grid and Gantt.

## 22.1.34 (2023-06-21)

### GanttChart

#### Features

-`#I43435` - Improved the user interface of taskbar resizing and moving actions in the Gantt Chart. Now, when users perform taskbar resizing or moving, a virtual element is displayed instead of updating the original taskbar element. This virtual element remains visible until the action is completed, providing users with a clear representation of the changes they are making. Please find the demo link [here](https://ej2.syncfusion.com/demos/#/bootstrap5/gantt/editing.html).

#### Breaking changes

- Connector lines have been changed from elements to SVG elements for UI improvement. This change has been made to enhance the user interface and provide a more visually appealing and flexible way of displaying connector lines.

## 21.2.10 (2023-06-13)

### GanttChart

#### Bug Fixes

- `#I459187` - Newly added record missed at the bottom in virtual scroll issue has been fixed.
- `#I469401` - Resource names gets duplicated in right label issue has been fixed.
- `#I464184` - Progress width not updated properly in split tasks issue has been fixed.
- `#F182318` - Progress width not updated properly in manual tasks after zooming action issue has been fixed.

## 21.2.9 (2023-06-06)

### GanttChart

#### Bug Fixes

- `#I467744` - Provided support for virtual scroll in resource view multitask bar.
- `#I464831` - Incorrect render of segments when we give end date while declaring segment in data source issue has been fixed.
- `#I461924` - Bug Script Error throws while using Virtualization with Collapse All action.
- `#I469496` - Start date not updated properly for predecessor connected record issue has been fixed.
- `#I465752` - Timeline start date gets changed when we perform right resizing or progress resizing issue has been fixed.
- `#I463593` - True type font style is not updated in the footer.
- `#I463666` - Bug Milestones not rendering correctly in hierarchy issue has been fixed.
- `#I463231` - Selection is not maintained when we scroll issue has been fixed.
- `#I462836` - Taskbar not rendered properly when the dependency is connected to the bottom task issue has been fixed.
- `#I464999` - Expand or Collapse All causes improper view in virtual scrolling issue has been fixed.
- `#I462469` - Virtual scrolling breaks in deleting the last record issue has been fixed.
- `#I464528` - Outdent action does not work properly issue has been fixed.
- `#I464592` - Progress values are incorrect in parent task after performing drag drop issue has been fixed.

## 21.2.8 (2023-05-30)

### GanttChart

#### Bug Fixes

- `#I461738` - Updating custom column change the end date issue has been fixed
- `#I461564` - Editing cell followed by context menu does not work issue has been fixed
- `#I461800` - Console error while exporting pdf error has been fixed.
- `#I464045` - Parent dependency renders though we set `allowParentDependency` as false issue has been fixed.
- `#I462271` - Taskbar not rendered when we use taskbar template issue has been fixed.
- `#I460869`- Issue in Resource view wont display resource name has been fixed
- `#I461105` - Baseline dates rendered incorrectly in without `dayWorkingTime` issue has been fixed.
-`#I460869`- Issue in Resource view wont display resource name has been fixed.

## 21.2.6 (2023-05-23)

### GanttChart

#### Bug Fixes

- `#I461435` - Adding and deleting record rapidly while displaying tooltip cause error has been fixed.
- `#I461087` - Offset value getting modified incorrectly issue has been fixed.
- `#I461778` - Misalignment in rows on Tree Grid and Gantt in virtual scroll issue has been fixed

## 21.2.5 (2023-05-16)

### GanttChart

#### Bug Fixes

- `#I461778` - Misalignment in rows on Tree Grid and Gantt in virtual scroll issue has been fixed
- `#I181309` - splitter position not updating after resize issue has been fixed.
- `#I449506` - Moving child row referencing another parent row will not move all of the descendants of that another parent row issue has been fixed.
- `#I457803` - Offset value is not correctly updated while connecting predecessor issue has been fixed.
- `#I449944` - Zoom out button in toolbar not enabled once after zoom in operation issue has been fixed.
- `#I434098` - Issue while rendering resource view without child mapping has been fixed.

## 21.2.4 (2023-05-09)

### GanttChart

#### Bug Fixes

- `#I457032` - Task label not rendered properly when we render as template issue has been fixed.
- `#I457212` - Timeline renders different in `Firefox` and `Chrome` issue has been fixed.
- `#I456146` - Console error occur while changing task field after removing toolbar issue has been fixed.
- `#F181579` - Style not reflected on the notes column when we perform dialog edit issue has been fixed.
- `#I456453` - `CSS class` is not updated while changing it through `updateRecordbyId` method issue has been fixed.

## 21.2.3 (2023-05-03)

### GanttChart

#### Bug Fixes

- `#I441205` - Two spinner appears while performing action issue has been fixed.
- `#I451257` - No proper template for manual milestone parent.
- `#I443041` - Gantt react performance rendering issue during initial load has been fixed.

## 21.1.41 (2023-04-18)

### GanttChart

#### Bug Fixes

- `#I453787` - Duration not calculated properly in hour duration unit issue has been fixed.
- `#I453745` - Modified records in `actionBegin` event has invalid records issue has been fixed.
- `#I449552` - Child record rendered in incorrect dates during initial load issue has been fixed.
-`#I452233`- Parent Taskbar template not working properly in latest version.
-`#I449864`- Holiday label is not visible when we don't set height.
-`#I449674`- Cannot split task when the taskbar is rendered to one day.
- `#I449757` - Taskbar width rendered incorrectly issue has been fixed.

## 21.1.38 (2023-04-04)

### GanttChart

#### Bug Fixes

- `#I451243` - Unable to set zooming levels through `zoomingLevels` property issue has been fixed.
- `#I447704` - Timeline tier is not changing dynamically issue has been fixed.
- `I447465` - Incorrect progress value on parent task when child tasks have fractional duration issue has been fixed.
-`I447475`- End key is not working properly issue has been fixed.
-`#I447772` - Application freezing while changing holidays/weekend issue has been fixed.

## 21.1.37 (2023-03-29)

### GanttChart

#### Bug Fixes

- `#I432146` - Script error occurs while changing data source and resource simultaneously issue has been fixed.
-`I441276`- Outdent task is not in correct index of modified records in `actionComplete` event issue has been fixed.
-`I435254`, `I444942`- Taskbar not rendered in Pdf exported file when `timelineUnitSize` is initialized issue has been fixed.

## 21.1.35 (2023-03-23)

### GanttChart

#### Features

- `#I419169` - Provided Taskbar drag and drop support for resource view in Gantt Chart. Please find the demo link [here](https://ej2.syncfusion.com/demos/#/bootstrap5/gantt/resource-multi-taskbar.html).
- `#I417330` - Provided support to disable parent predecessor by using `allowParentDependency` property. Please find the `API` link [here](https://ej2.syncfusion.com/documentation/api/gantt/#allowparentdependency).
- `#I413261` - Restricted offset value update based on enabling or disabling the `API`. Please find the
`API` link [here](https://ej2.syncfusion.com/documentation/api/gantt/#updateoffsetontaskbaredit).
- `#I420482` - Provided option to disable date validation at initial load based on enabling or disabling the `API`
By disabling this `API` we can improve load time performance by two time. Please find the
`API` link [here](https://ej2.syncfusion.com/documentation/api/gantt/#autocalculatedatescheduling).

## 20.4.54 (2023-03-14)

### GanttChart

#### Bug Fixes

-`I442012`- Pdf export padding property for column header is not working properly issue has been fixed.
-`F180721`-  Script error occurs when critical path is enabled in virtualization mode issue has been fixed.
-`F180854`- Successor task not updated when editing predecessor task issue has been fixed.
-`I436189`- Two different payloads passed to put and post for a single add action issue has been fixed.
-`I440310`- Script error throws when parent ID mapped issue has been fixed.
-`I441047`- An exception is thrown when attempting to update `task fields` and `data source`.

## 20.4.53 (2023-03-07)

### GanttChart

#### Bug Fixes

-`I413261`- Validate predecessor link on editing issue has been fixed.
-`I441394`- Gantt Column name doesn't change respect to changing of culture at runtime issue has been fixed.
-`I437053`- Task label not updated correctly When dynamically updating data source issue has been fixed.

## 20.4.52 (2023-02-28)

### GanttChart

#### Bug Fixes

-`I435386`- Column template not working in `Vue` platform issue has been fixed.
-`I426170`- Incorrect Start Date Update for Unscheduled Task When Editing Parent Start Date.
-`I432910`- zoom in not disabled issue has been fixed.
-`I431348`- Updating Day Working Time Property Dynamically in UTC Timezone Results in Invalid Dates.
-`I394676`- Incorrect Date in milestone while on load and editing issue has been fixed.
-`#I436476`- Gantt Task doesn't get updated after Batch Update issue is fixed.

## 20.4.51 (2023-02-21)

### GanttChart

#### Bug Fixes

-`I432910`- Export Issue with Predecessor Connectivity for Filtered Data.
-`#I434098`- Script error occurs when updating resources dynamically without child mapping.

## 20.4.50 (2023-02-14)

### GanttChart

#### Bug Fixes

- `#I431629`- A script error is thrown while performing tab navigation on the last row.

## 20.4.49 (2023-02-07)

### GanttChart

#### Bug Fixes

- `#I429875` - Console error while using self-referential data issue has been fixed.
- `#I428914` - Duration value is not maintained when using `valueAccessor` issue has been fixed.
- `#I426170` - Action complete is not triggered properly for Zoom In and Zoom to fit in Gantt chart.

## 20.4.48 (2023-02-01)

### GanttChart

#### Bug Fixes

- `#I427837` - Baseline renders with incorrect date in difference timezone issue has been fixed.
- `#I430365` - Child tasks not updated after updating parent task predecessor has been fixed.
- `#I428064` - Incorrect unit in timeline issue has been fixed.

## 20.4.43 (2023-01-10)

### GanttChart

#### Bug Fixes

- `#I426170` - Incorrect request type in zooming action has been fixed.
- `#FB39646` - Incorrect index value during row drag and drop has been fixed.

## 20.4.42 (2023-01-04)

### GanttChart

#### Bug Fixes

- `#I421870`- Record does not update properly when its modified in `actionBegin` event issue has been fixed.
- `#I420414` - Row height issue in task mode has been fixed.

## 20.4.40 (2022-12-28)

### GanttChart

#### Bug Fixes

- `#I420702` - Persistence settings prevent changing the timeline settings issue has been fixed.
- `#I422731` - Issue when predecessor is given for unscheduled parent issue has been fixed.
- `#I423435` - Customize baseline colour in `queryTaskbarInfo` event in segmented tasks issue has been fixed.
- `#I420280` - The `actionBegin` event receives more records as modified data when task is edited issue has been fixed.
- `#I422943` - Taskbar appearing on next date issue has been fixed.
- `#I422476` - Progress value issue in parent task has been fixed.
- `#I425389`- Baseline not properly rendered after moving Milestone.

## 20.4.38 (2022-12-21)

### GanttChart

#### Features

- `#I237939`,`#I255626`,`#I398597` - Provided `RTL` support in Gantt chart. Please find the documentation link [here](https://ej2.syncfusion.com/documentation/gantt/global-local/#right-to-left-rtl).
- Provided `Shimmer` support in Gantt chart. Please find the demo link [here](https://ej2.syncfusion.com/demos/#/bootstrap5/gantt/loading-animation).

#### Bug Fixes

- `#I417035` - Expand Collapse not working properly after cell editing issue has been fixed.
- `#I421663` - The baseline end date has not been properly validated issue has been fixed.

## 20.3.60 (2022-12-06)

### GanttChart

#### Bug Fixes

- `#I420414` - Unable to disable edit dialog fields in general tab issue has been fixed.
- `#I420280` - The `actionBegin` event receives more records as modified data when a task is resized issue has been fixed.
- `#I420126` - Error thrown when deleting a Unassigned task in the Resource View issue has been fixed.
- `#I415400` - Cell Edit does not save when clicking on the chart side issue has been fixed.
- `#I419273` - End Key not working as expected when selection type set to Both.

## 20.3.59 (2022-11-29)

### GanttChart

#### Bug Fixes

- `#I413261` - Dependency values for the parent task are not properly updated issue has been fixed.
- `#I419062` - Edit type issue when datasource is undefined issue has been fixed.
- `#I417042` - A console error is thrown when updating the parent task's start date.
- `#I419262` - The dependency line is rendered even after cancel.

## 20.3.58 (2022-11-22)

### GanttChart

#### Bug Fixes

- `#I416610` - Able to scroll vertically when virtual scrolling enabled without scrollable records issue has been fixed.
- `#I417049` - Adding duration to an unscheduled task affects the project start date.

## 20.3.57 (2022-11-15)

### GanttChart

#### Bug Fixes

- `#I413261` - Dependency values for the parent task are not properly updated issue has been fixed.
- `#I410200` - Timeline headers disappears when timeline changes dynamically.
- `#I413560` - Datasource Property not updated properly after row indent and outdent issue has been fixed.
- `#I65261`  - Filtering functionality issues in duration column.
- `#I65321`  - Task duration is not calculated properly in dialog edit.

## 20.3.56 (2022-11-08)

### GanttChart

#### Bug Fixes

- `#I414182` - Datasource Property not updated properly after row drag and drop issue has been fixed.
- `#I413625` - Current view data not updated properly when dynamically change the view type issue has been fixed.
- `#I414481` - Dynamically updating the `renderBaseline` property in immutable mode issue has been fixed.

## 20.3.52 (2022-10-26)

### GanttChart

#### Bug Fixes

- `#I413261` - Dependency values for the parent task are not properly updated issue has been fixed.
- `#I412821` - Row drag and drop is not working properly when Virtualization is enabled.

## 20.3.50 (2022-10-18)

### GanttChart

#### Bug Fixes

- `#I409097` - Deleting record when search text is selected issue has been fixed.
- `#I404228` - Saving record even when in edited state issue has been fixed.
- `#I413093` -  Pdf export is not working in latest version issue has been fixed.

## 20.3.49 (2022-10-11)

### GanttChart

#### Bug Fixes

- `#I395003` - Gantt records disappear when scrolling up and down quickly issue has been fixed.
- `#I407437` - Add new record in resource view without child mapping issue has been fixed.
- `#I407832` - Console error when all the element is disabled in context menu.
- `#I407716` - Data source update on load time issue has been fixed.
- `#I400913`, `#I405837` - Pdf export is not working when the data has Hebrew and Vietnamese characters.

## 20.3.48 (2022-10-05)

### GanttChart

#### Bug Fixes

- `#I408288` - Timeline rendering is incomplete when data is rebinded issue has been fixed.
- `#I404228` - Issue in saving data in segment has been fixed.
- `#I406597` - Duplicate record in the data source issue has been fixed.
- `#I405108` - Unable to customize event marker tooltip issue has been fixed.
- `#F176879` - Unable to customize the dependency name issue has been fixed.
- `#I409288` - Exception when the expand change dynamically has been fixed.

## 20.3.47 (2022-09-29)

### GanttChart

#### Features

- `#F145182`, `#I260943`, `#I269630`, `#I273259`, `#I320454`, `#I326471`, `#I336212`, `#I340854`, `#I341129`, `#F171031`, `#I364331` - Provided Predecessor support for parent task in Gantt Chart. Please find the demo link [here](https://ej2.syncfusion.com/demos/#/bootstrap5/gantt/editing).
- `#I315577` - Provided Row Drag and Drop support in Virtual Scrolling feature for Gantt Chart.
- `#F165210` - Provided excel filter support in Gantt Chart. Please find the demo link [here](https://ej2.syncfusion.com/demos/#/bootstrap5/gantt/filtering).
- `#I246769`, `#I316949`, `#I334501`, `#F159768`, `#F167576` - Provided support to define task id as string type for Gantt Chart. Please find the `API` link [here](https://ej2.syncfusion.com/documentation/api/gantt/taskFields/#id).
- `#FB36072` - Provided support for Critical Path with Multi Taskbar enabled.

#### Bug Fixes

- `#F177237` - The `currentViewData` with dependencies were not exported correctly in `PDFExport` issue has been fixed.
- `#I402913` - Checkbox selection must be completed with a single click issue has been fixed.
- `#I404007` - Filter Menu not closed when focus is removed issue has been fixed.
- `#I403823` - Custom Column values not updated when editing in tab issue has been fixed.
- `#I403221` - Issue in deleting parent record in resource view has been fixed.

## 20.2.49 (2022-09-13)

### GanttChart

#### Bug Fixes

- `#I403222` - Console error occurs in resource view with enabled persistence issue has been fixed.

## 20.2.46 (2022-08-30)

### GanttChart

#### Bug Fixes

- `#F176984` - Timeline is extended when the splitter position is moved issue has been fixed.
- `#I398394` - Row drag and drop not working properly on resource view sample issue has been fixed.
- `#I396036` - Baselines become milestones when start date and end date are mapped.

## 20.2.45 (2022-08-23)

### GanttChart

#### Bug Fixes

- `#I389542` - Filter records with hierarchy mode as both shows no record to display issue has been fixed.

## 20.2.44 (2022-08-16)

### GanttChart

#### Bug Fixes

- `#I394194` - Timeline changes when toggling critical path issue has been fixed.
- `#I388575` - Gantt chart disappears when searching is performed with tasks in collapsed state with virtualization issue has been fixed.
- `#I394195` - Week start day not working properly after perform Zooming actions issue has been fixed.
- `#I393709` - Baseline milestone not rendered in proper position .
- `#I394223` - Gantt Chart does not update data source when adding new record.

## 20.2.43 (2022-08-08)

### GanttChart

#### Bug Fixes

- `#I393339` - Empty record is displayed after searching a text when using the refresh method issue has been fixed.
- `#I392655` - Issue in deleting multiple tasks, when one task is collapsed issue has been fixed.
- `#I394407` - Script error occurs when we edit the baseline date issue has been fixed.
- `#I376455` - Unable to focus on chart element when editing is not enabled has been fixed.
- `#I393670`, `#I393633` - End date calculated wrongly for adding new task after zoom to fit is performed issue has been fixed.
- `#I391704`-Need to disable HTML encoding in tooltip has been fixed.
- `#F149986` - Unable to use drop down edit in progress column has been fixed.

## 20.2.39 (2022-07-19)

### GanttChart

#### Bug Fixes

- `#I389834` - Records position not updated properly in datasource when we drag and drop the records issue has been fixed.

## 20.2.38 (2022-07-12)

### GanttChart

#### Bug Fixes

- `#I380929` - Baseline end date issue for milestone with same baseline start and end date has been fixed.
- `#I385298` - Bottom Tier not partitioned properly when zoom to fit issue has been fixed.
- `#I388575` - Virtual scroll issue when collapsed and searched has been fixed

## 20.2.36 (2022-06-30)

### GanttChart

#### Features

- `#I233407`, `#I258725`, `#I280586`, `#I291191`, `#I304599`, `#F160011`, `#I310340`, `#F163773`, `#I323187`, `#I323187`, `#I346348` - Provided Critical Path support for Gantt Chart. Please find the demo link [here](https://ej2.syncfusion.com/demos/#/bootstrap5/gantt/critical-path).
- Provided State Persistence support for Gantt Chart. Please find the documentation link [here](https://ej2.syncfusion.com/javascript/documentation/gantt/state-persistence).

#### Bug Fixes

- `#I379308, #I380615` - Baseline end date issue for milestone with same baseline start and end date has been fixed.
- `#I383128` - DataSource gets updated wrongly when we update the data with invalid `parentID` issue has been fixed.
- `#I378077` - Newly added records not gets refreshed when running the sample using `nodejs` issue has been resolved.
- `#I382484` - Gantt records gets repeated when we perform scrolling in virtual data issue has been fixed.
- `#I376455` - Tab key navigation not working properly when moving to new records has been fixed.

## 20.1.60 (2022-06-14)

### GanttChart

#### Bug Fixes

- `#367483` - Indent Outdent toolbar options appearing when edit settings is not defined issue has been been fixed.
- `#384296` - Unable to draw dependency when progress mapping is disabled issue has been been fixed.
- `#381374` - Editing milestone duration varies the start date issue has been been fixed.

## 20.1.59 (2022-06-07)

### GanttChart

#### Bug Fixes

- `#379229` - Pdf export is not working when using custom date format issue has been fixed.
- `#381109` - Issue when Zoom To Fit with unscheduled tasks has been fixed.
- `#382884` - work value calculation issue for parent task has been fixed.

## 20.1.58 (2022-05-31)

### GanttChart

#### Bug Fixes

- `#380136` - End date is not updated when we update the resource unit via `updateRecordByID` method.
- `#378491` - Data is not displayed when we frequently move between different tabs has been fixed.
- `#379660` - Script error thrown when switching between tabs has been fixed.

## 20.1.56 (2022-05-17)

### GanttChart

#### Bug Fixes

- `#F174816` - Landscape page orientation is not working when exporting Pdf has been fixed.
- `#377857` - Task not assigned to resources when dynamically changes from project view into resource view has been fixed.

## 20.1.55 (2022-05-12)

### GanttChart

#### Bug Fixes

- `#376228` - Duration is not updated while updating resource units using `updateRecordByID` method issue has been fixed.
- `#370224` - Filtering issue when rendering Gantt inside the modal has been fixed.
- `#376455` - Tab key navigation not working properly when moving from grid to timeline issue has been fixed.

## 20.1.52 (2022-05-04)

### GanttChart

#### Bug Fixes

- `#372661` - Data not properly updated in the Gantt Chart when switching between list view issue has been fixed.

## 20.1.51 (2022-04-26)

### GanttChart

#### Bug Fixes

- `#373529` - Task label is not properly displayed in pdf export issue has been fixed.
- `#373829` - Top tier and bottom tier partitioning issue in quarterly mode has been fixed.
- `#374212, #372614` - Timeline is not rendered properly when using hour format in `DST` issue has been fixed.
- `#367794` - Cell editing issue in internet explorer has been fixed.

## 20.1.50 (2022-04-19)

### GanttChart

#### Bug Fixes

- `#372623` - New record keeps an editable state in dependency tab even after switching the tabs has been fixed.
- `#373803` - Scrollbar not available in notes tab issue has been fixed.
- `#372344` - Issue in `taskLabelTemplate` using `ngTemplate` has been fixed.
- `#372131` - Issue in `taskbarTemplate` with `enableMultiTaskbar` enabled has been fixed.

## 20.1.48 (2022-04-12)

### GanttChart

#### Bug Fixes

- `#371080` - Issue in `actionBegin` event for cancelling the row drag and drop action using request type `beforeDrop` has been fixed.
- `#374064` - Gantt height not gets responsive when collapsing all tasks in `auto` mode.
- `#372623` - Filter popup gets closed automatically When clicking between the filter fields has been fixed.

## 20.1.47 (2022-04-04)

### GanttChart

#### Bug Fixes

- `#300959` - Provided support to fill empty space with extended timeline in zoom out action.
- `#371372` - Unable to change end Date of manual parent task issue has been fixed.
- `#363003` - Child mapping order not maintained in data source property issue has been fixed.

## 19.4.56 (2022-03-15)

### GanttChart

#### Bug Fixes

- `#369264` - Event marker labels not visible when there is single record has been fixed
- `#362146` - Row customization using `rowDataBound` event in `enableImmutableMode` issue has been fixed
- `#363336` - Child records not updated properly in specific index issue has been fixed.
- `#368609` - Indent and outdent toolbar item not showing when checkbox selection is enabled has been fixed.
- `#363752` - Issue in assigning custom zooming levels in `load` event has been fixed.
- `#368549` - Gantt chart indentation issue while adding a child task has been fixed.
- `#359455` - Issue in giving height as view port for parent container has been fixed.

## 19.4.55 (2022-03-08)

### GanttChart

#### Bug Fixes

- `#366304` - Gantt line mismatches when we set system display as 100% and browser zoom settings as 90% has been fixed.
- `#365994` - Right and left label template not working in `vue` has been fixed.

## 19.4.54 (2022-03-01)

### GanttChart

#### Bug Fixes

- `#366296` - When moving from once cell to another cell using tab key navigation issue has been fixed.
- `#363358`,`F172781` - Drag and drop not working properly after row gets collapsed issue has been fixed.

## 19.4.53 (2022-02-22)

### GanttChart

#### Bug Fixes

- `#365463` - Gantt timeline view gets changed when resize the task to left side has been fixed.

## 19.4.52 (2022-02-15)

### GanttChart

#### Bug Fixes

- `#360085` - Issue in deleting a task after performing expand collapse action for multiple times has been fixed.
- `#364950` - The `taskLabel` property does not show the task name properly when giving name with space has been fixed.

## 19.4.50 (2022-02-08)

### GanttChart

#### Bug Fixes

- `#362011` - Date alignment issue with Gantt Zoom to fit top tier and bottom tier has been fixed.
- `#364643` - Extra fields are added in `dataSource` property for bottom position issue has been fixed.
- `#363210` - Issue in performing edit dialog when we map only segments tab in `editDialogFields` has been fixed.
- `#364723` - Issue in updating `dataSource` property using insert key has been fixed.
- `#364643` - New record added in the top of datasource when row position is set as Bottom has been fixed.

## 19.4.47 (2022-01-25)

### GanttChart

#### Bug Fixes

- `#356978` - Issue in disable the initial move of taskbar drag has been fixed.
- `#357647` - Issue in enabling scroll top during load time has been fixed.
- `#360893` - Issue in data source not updating when dragging and dropping child record has been fixed.
- `#359455` - Issue in rendering Gantt when parent container height is set in percentage has been fixed.
- `#361492` - Dragged row does not disappear when the row dropped outside the Gantt issue has been fixed.
- `#360381` - Issue in clicking on date picker while filtering has been fixed.
- `#362566` - Child records do not indent properly when immutable mode is enabled issue has been fixed

## 19.4.43 (2022-01-18)

### GanttChart

#### Bug Fixes

- `#359455` - Issue in rendering Gantt when parent container height is set in percentage has been fixed.
- `#360424` - Issue in performing drag and drop when resource is set to null has been fixed.
- `#360085` - Issue in adding new record after performing expand collapse action for multiple times has been fixed.
- `#360081` - Console error thrown when we assign resources to parent tasks has been fixed.

## 19.4.42 (2022-01-11)

### GanttChart

#### Bug Fixes

- `#354721` - Issue in rendering milestone based on the milestone mapping in datasource has been fixed.
- `#358683` - Toolbar gets hide after `expandAll` and `collapseAll` is performed issue has been fixed.

## 19.4.41 (2022-01-04)

### GanttChart

#### Bug Fixes

- `#359120` - Issue with Gantt Context menu operation after release the connector line outside the Gantt.
- `#359104, #359163` - Issue while Gantt loaded with taskbar Template and `queryTaskbarInfo` for segmented Tasks has been fixed.
- `#F170631` - Issue in search settings for all hierarchy mode in Gantt has been fixed.

### GanttChart

#### Bug Fixes

- `#355824, #360027` - Gantt Chart display issue with misalign in dates on which DST change happens has been fixed.
- `#F171256` - Issue in Localization for the word New Task has been fixed.

## 19.4.40 (2021-12-28)

### GanttChart

#### Bug Fixes

- `#357340` - Issue with Gantt `selectedRowIndex` property when deleted the selected item in last row.

## 19.4.38 (2021-12-17)

### GanttChart

#### Bug Fixes

- `#346141` - Issue with Gantt manipulates and change task data date values from original data has been fixed.
- `#F170644` - Issue in manual start date while mapping multiple parent levels has been fixed.
- `#F170274` - DateTimePicker is not rendering in dialog segment tab start date and end date columns has been fixed.

#### Breaking Changes

- Original user datasource is maintained in `taskData` and `dataSource` properties in Gantt during load time. It will update only after CRUD operation.

## 19.3.56 (2021-12-02)

### GanttChart

#### Bug Fixes

- `#347613` - Connector line issue after updating the datasource dynamically has been fixed.
- `#346909` - Issue in disable custom context menu has been fixed.

## 19.3.55 (2021-11-23)

### GanttChart

#### Bug Fixes

- `#347753` - Issue in `defaultedit` edit type has been fixed.

## 19.3.53 (2021-11-12)

### GanttChart

#### Bug Fixes

- `#342557` - In fixed work type duration update issue has been fixed.

## 19.3.48 (2021-11-02)

### GanttChart

#### Bug Fixes

- `#343417` - Issue in updating row index after row drag and drop has been fixed.
- `#346516` - Issue in context menu after cell editing has been fixed.
- `#346736` - Issue in rendering connector points when progress field is not mapped has been fixed.

## 19.3.47 (2021-10-26)

### GanttChart

#### Bug Fixes

- `#343991` - Additional parameters are not passed to `BatchUpdate` method when deleting the row issue has been fixed.
- `#344100` - Issue in cancelling the drawing of predecessor line in `actionBegin` event has been fixed.
- `#345841` - Issue on taskbar editing when timezone property set as `UTC` has been fixed.
- `#341691` - Bring back browser default context menu in dialog editing has been fixed.

#### Breaking Changes

- Add and Edit dialog is now rendered as direct child to *body* element.

## 19.3.46 (2021-10-19)

### GanttChart

#### Bug Fixes

- `#343417` - Issue in CRUD operations when using datamanager data has been fixed.
- `#340739` - Vertical grid line issue while changing height dynamically has been fixed.
- `#F168970` - Issue in updating Segments data issue has been fixed.

## 19.3.45 (2021-10-12)

### GanttChart

#### Bug Fixes

- `#342557` - In fixed work type duration update issue has been fixed.
- `#340406` - Misalignment while using line height property issue has been fixed.
- `#310346` - Pdf export issue while changing date format has been fixed.

## 19.3.44 (2021-10-05)

### GanttChart

#### New Features

- `#304621, #322659` - Provided percentage support for height and width of Gantt element.

## 19.2.62 (2021-09-14)

### GanttChart

#### Bug Fixes

- `#340421` - In smaller resolution the splitter appeared in wrong position issue has been fixed.
- `#341502` - Indicators disappear when datasource changed dynamically issue has been fixed.

## 19.2.60 (2021-09-07)

### GanttChart

#### Bug Fixes

- `#340155` - Dialog closes when pressing insert key issue has been fixed.
- `#333851` - Dynamically changing the holidays issue has been fixed.

## 19.2.59 (2021-08-31)

### GanttChart

#### Bug Fixes

- `#339434` - Issue in tooltip has been resolved.

## 19.2.57 (2021-08-24)

### GanttChart

#### Bug Fixes

- `#339511` - Issue in maintaining resource selection has been resolved.
- `#338206` - Cleared warnings thrown in Firefox browser.

## 19.2.56 (2021-08-17)

### GanttChart

#### Bug Fixes

- `#338587` - Issue in assigning empty data to datasource has been resolved.
- `#335677` - Issue in `expandAtLevel` and `collapseAtLevel` method with virtual scrolling has been resolved.

## 19.2.55 (2021-08-11)

### GanttChart

#### Bug Fixes

- `#336211` - Issue with Virtual Scrolling in Firefox browse has been resolved.

## 19.2.47 (2021-07-13)

### GanttChart

#### Bug Fixes

- `#331618` - Issue in updating `dataSource` property has been fixed.
- `#333672` - Issue in calculating duration across DST has been fixed.
- Issue in tooltip position has been fixed.

## 19.2.46 (2021-07-06)

### GanttChart

#### Bug Fixes

- `#331671` - Right Labels are rendered properly in exported PDF document.
- `#332161` - Issue fixed when drag and drop performed after adding record through context menu.

## 19.2.44 (2021-06-30)

### GanttChart

#### New Features

- `#290125` - Provided support to add multiple tasks in Gantt.

## 19.1.69 (2021-06-15)

### GanttChart

#### Bug Fixes

- `#330806` - When using `updateTaskId` method with predecessor field is not mapped in the `taskFields` has been fixed.
- At certain zoom level, both halves of year are H1 has been resolved.

## 19.1.66 (2021-06-01)

### GanttChart

#### Bug Fixes

- `#328182` - Mismatch between timeline and chart body content has been fixed.
- `#165629` - Notes updated properly in Gantt chart when new task is added.
- `#325331` - Immutable mode issue on data source refresh has been fixed.
- `F163073` - Issue on `RemoteSaveAdaptor` has been fixed.

## 19.1.64 (2021-05-19)

### GanttChart

#### Bug Fixes

- `#325587` - Issue while deleting resource on split task has been fixed.
- Issue on dynamically changing the `allowTaskbarEditing` property has been fixed.
- `#165210` - Issue while filtering using Excel type has been fixed.
- `#327043` - Issue in rendering taskbar template has been fixed.

## 19.1.63 (2021-05-13)

### GanttChart

#### New Features

- `#264444, #296315` - Provided support for managing date with different time zones.
- `#317529, #320843` - Provide support to cancel the merging of split tasks using client-side event.
- `#307881`, `#309475`, `#325067` - Improved performance while scrolling, when predecessors are mapped.

#### Bug Fixes

- `#326155` - Issue in splitting task using public method has been fixed.
- `#325948` - Issue in adding new task with empty string has been fixed.
- `#325585` - Issue while defining columns and dynamically changing the view type has been fixed.

## 19.1.59 (2021-05-04)

### GanttChart

#### Bug Fixes

- `#325250` - Progress updated properly in manual scheduling.
- `#324644` - Issue on adding records, when Gantt view is changed has been fixed.
- `#325627` - Editing works fine after when holiday is set dynamically.

## 19.1.58 (2021-04-27)

### GanttChart

#### Bug Fixes

- `#324141` - Issue in tooltip rendering position has been fixed.
- `#320979` - Issue on changing data source and timeline settings on same time has been fixed.
- `F163357` - Duplicating issue when a task is dropped below an unassigned resource in the resource view has been fixed.
- `F164497` - Issue in editing end date of a task has been fixed.

## 19.1.57 (2021-04-20)

### GanttChart

#### Bug Fixes

- `F164497` - Issue in editing end date of a task has been fixed.

## 19.1.56 (2021-04-13)

### GanttChart

#### Bug Fixes

- `#320979` - Provided support to update data source dynamically with `collapseAllParentTasks` and `enableMultiTaskbar` enabled mode.

## 19.1.55 (2021-04-06)

### GanttChart

#### Bug Fixes

- `#320882` - Issue on expand/collapse icon in `Resource view` has been fixed.

## 19.1.54 (2021-03-30)

### GanttChart

#### New Features

- `#298361` - Provided Observable data binding support in Gantt.
- `#300136` - Provided support for tab like behaviour on cell navigation for cell edit mode.

## 18.4.49 (2021-03-23)

### GanttChart

#### New Features

- `#317550` - Provided support to define `valueAccessor` as string.

#### Bug Fixes

- Console error when end date of segments is given as string has been fixed.

## 18.4.47 (2021-03-09)

### GanttChart

#### Bug Fixes

- `316898` - Maintained additional fields in segments on zooming action.

## 18.4.44 (2021-02-23)

### GanttChart

#### Bug Fixes

- `#315501` - Error on closing filter menu while focusing out has been resolved.

## 18.4.43 (2021-02-16)

### GanttChart

#### Bug Fixes

- `#306101` - Rendered milestone at default end time on taskbar editing.
- `#313819` - Highlighted bottom tier weekend header cell.

### GanttChart

#### Bug Fixes

- `#311841` - Duplicating records issue while indent action has been resolved.
- `F160722` - Error on rendering editing tooltip has been resolved.
- `F161444` - Error while hiding context menu items has been resolved.

## 18.4.41 (2021-02-02)

### GanttChart

#### Bug Fixes

- `#298884` - Error on reorder rows method has been fixed.

#### New Features

- `#306342` - Included target element in `actionBegin`, `taskbarEditing`, `contextMenuOpen` events.

## 18.4.39 (2021-01-28)

### GanttChart

#### New Features

- `#291192` - Provided Immutable Support to refresh specific rows while performing Gantt actions.

#### Bug Fixes

- `F161492` - Console error on converting milestone to task has been fixed.

## 18.4.35 (2021-01-19)

### GanttChart

#### Bug Fixes

- `F161492` - Console error on drag and drop action has been fixed.
- `F161492` - Issue on indent action has been fixed.

## 18.4.33 (2021-01-05)

### GanttChart

#### Bug Fixes

- `#298884` - Issue on reorder rows method in virtual scroll support has been fixed.

## 18.4.32 (2020-12-29)

### GanttChart

#### Bug Fixes

- `F160722` - Issue on editing tooltip template has been fixed.
- `#306971` - HTML encoder issue with notes column has been fixed.
- `#306928` - Timeline width issue on zoom to fit action has been resolved.

## 18.4.31 (2020-12-22)

### GanttChart

#### Bug Fixes

- `#306741` - Issue on closing filter menu while focusing out has been fixed.
- `#306556` - Issue on duration field of add dialog has been fixed.
- `#305822` - Issue on updating height on browser resizing has been fixed.
- `#307295` - Issue on updating data source dynamically has been fixed.
- `#305728` - Issue on loading large number of records in resource tab has been fixed.

## 18.4.30 (2020-12-17)

### GanttChart

#### New Features

- `#298884` - Provided `Virtual Scroll` support for Gantt.

#### Bug Fixes

- `#306090` - Issue on pressing delete key when add/edit dialog is opened has been fixed.
- `#306342` - Included additional field in `taskData.segments`.
- `#305420` - Issue on triggering `rowSelected` event while opening context menu has been fixed.

## 18.3.52 (2020-12-01)

### GanttChart

#### Bug Fixes

- `F159625` - Console error on indent action after adding record has been fixed.

## 18.3.51 (2020-11-24)

### GanttChart

#### Bug Fixes

- `301606` - Issue in template column when use it as `treeColumnIndex` has been fixed.

## 18.3.50 (2020-11-17)

### GanttChart

#### Bug Fixes

- `293889` - Console error in split task when allowTaskbarEditing is disable has been fixed.
- `300744` - Console error on clicking add/edit toolbar has been fixed.
- `301653` - Issue on split task when date is given as string has been fixed.

## 18.3.48 (2020-11-11)

### GanttChart

#### Bug Fixes

- `299695` - Issue in left label template has been fixed.
- `F159354` - Issue in locale text of predecessor tooltip has been fixed.
- `300962` - Included timeline property in actionComplete event after zooming action.
- `300804` - Issue in displaying resources when data source is empty has been fixed.

## 18.3.47 (2020-11-05)

### GanttChart

#### New Features

- `#292246` - Provided support to split the taskbar into multiple segments through context menu and dialog edit.
- `#282972, #293345` - Provided support to render predecessor and rows properly in different zooming levels and display scaling size.

#### Bug Fixes

- `#295381` - Issue on exporting Gantt with partial data has been fixed.
- `#299370` - Issue on restricting dragging action when read only property set to true.
- `F159153` - Issue in localized text of dependency tab default value has been fixed.
- `F158903` - Issue while sorting after add task action has been fixed.

## 18.3.42 (2020-10-20)

### GanttChart

#### Bug Fixes

- `#296920` - Issue on rendering Gantt with resources has been fixed.
- `F158128` - Issue on updating DB on `indent` and `outdent` action has been fixed.
- `#291962` - Dates are not filtered with given date format issue has been fixed.
- `#295998` - Events are not triggered properly while perform zoom to fit actions has been fixed.

## 18.3.35 (2020-10-01)

### GanttChart

#### Bug Fixes

- `#293528` - Issue when work value is given as decimal values has been fixed.

## 18.2.59 (2020-09-21)

### GanttChart

#### New Features

- `#292825` - Provided support to improvement of trigger actions on key press.

#### Bug Fixes

- `#293539` - Issue while dynamically updating `allowRowDragAndDrop` gets fixed.
- `#292470` - Issue on edit template in dialog has been fixed.
- `#293749` - Edit `params` not worked properly for progress column has been fixed.

## 18.2.57 (2020-09-08)

### GanttChart

#### Bug Fixes

- `#290457` - Issue on customizing the background colour of taskbar in Resource view has been fixed.
- `F157498` - Console error on indenting record after sorting has been fixed.

## 18.2.56 (2020-09-01)

### GanttChart

#### Bug Fixes

- `#291158` - Console error on destroy Gantt when allowKeyboard is false has been fixed.
- `#279528` - Dialog dependency drop-down list has existing dependency data has been fixed.

## 18.2.55 (2020-08-25)

### GanttChart

#### Bug Fixes

- `#288438` - Tooltip rendering issue has been fixed.
- The issue of the bottom tire format in Chinese culture has been fixed.

## 18.2.48 (2020-08-04)

### GanttChart

#### New Features

- `#287282` - Provided support to change viewType of Gantt dynamically.

#### Bug Fixes

- `#285626` - Console error while rendering multiple Gantt has been fixed.
- `#285749` - Issue on parent progress calculation while delete child record has been fixed.

## 18.2.47 (2020-07-28)

### GanttChart

#### Bug Fixes

- `#284995` - Issue in predecessor lines of exported pdf document has been fixed.
- `#284995` - Content overflow issue in exported pdf document has been fixed.
- `#284052` - Editing issue in Gantt Chart when using DB has been fixed.

#### New Features

- `#280004` - Given support to render edit template fields in Gantt edit dialog.

## 18.2.46 (2020-07-21)

### GanttChart

#### Bug Fixes

- `#276968` - Column misalignment issue after editing has been fixed.
- `F155689` - Issue on expanding records while mapping expand status of record has been fixed.

## 18.2.45 (2020-07-14)

### GanttChart

#### Bug Fixes

- `#278235` - Parent Id is not updated properly on row drag and drop action issue gets resolved.
- `F155766` - PDF export document Gantt timeline issue after zooming has been resolved.
- `#279872` - Issue while updating add and edit dialog fields in action begin events are resolved.
- `#275651` - Issue while dynamically updating `worWeek` gets fixed.
- `#277029` - Updating custom column in action begin event issue gets resolved.

## 18.2.44 (2020-07-07)

### GanttChart

#### New Features

- `#245866, #279740, #248032` - Provided support to `render multiple resource tasks` in a row on collapsed state in resource view Gantt.
- `#252413` - Provided support to display the `over allocation` indicators for a resources in resource view Gantt.
- `#262121` - Provided support for `dependency` between two tasks in resource view Gantt.
- `#269776` - Provided support for rendering Gantt as `read only`.

## 18.1.59 (2020-06-23)

### GanttChart

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

### GanttChart

#### New Features

- `#278724` - Provided support for hiding ID column in dependency tab.

## 18.1.55 (2020-06-02)

### GanttChart

#### Bug Fixes

- `#278176` - Zoom in or zoom out toolbar button disabled after zoom to fit action was fixed.
- `#278238` - Action begin event not triggered on finish to finish predecessor was fixed.

#### New Features

- `#269776` - Provided support for `expandAtLevel` method and changed `expandByIndex` method parameter as array type.

## 18.1.54 (2020-05-26)

### GanttChart

#### Bug Fixes

- `#277029` - Update value not display on edit action issue has been fixed.
- `#276942` - Issue while passing additional parameter to the server side on CRUD operation has been fixed.

## 18.1.53 (2020-05-19)

### GanttChart

#### Bug Fixes

- `#39566` - Issue when remove event markers dynamically has been resolved.
- `F154261`,`#276047` - Issue while adding new record with empty data on load time gets resolved.
- `#274206` - Issue in updating resource column gets resolved.

#### New Features

- `#273107` - Provided support to render task type on load time.

#### Breaking Changes

- Now the resource value in the `taskData` is always array of objects type and it is irrespective of resource value type in data source.

## 18.1.52 (2020-05-13)

### GanttChart

#### Bug Fixes

- `#268349` - Issue on maintaining duration data type gets resolved.
- Column filter menu displayed in wrong place has been fixed.

#### New Features

- Provided drag and drop support for resource view Gantt.
- `#271392` - Provided support to update task id dynamically.
- `#269776` - Provided support to indent a selected record.

## 18.1.48 (2020-05-05)

### GanttChart

#### Bug Fixes

- `#273422` - Date mismatch for parent and child record gets resolved.

## 18.1.46 (2020-04-28)

### GanttChart

#### Bug Fixes

- `#273440` - Issue on updating end date value using cell edit gets resolved.
- `#273426` - Issue on validating parent start date on taskbar edit action gets resolved.
- `#274066` - Console error on dragging parent milestone task gets resolved.

## 18.1.45 (2020-04-21)

### GanttChart

#### Bug Fixes

- `#268281` - Issue on adding dependency using dialog gets resolved.

## 18.1.44 (2020-04-14)

### GanttChart

#### Bug Fixes

- `#270801` - Issue on end date calculations gets resolved.
- `#270563` - Console error throws while taskbar resizing with use of taskbar template has been fixed.
- Issue in mapping custom class of task from data source has been fixed.

## 18.1.43 (2020-04-07)

### GanttChart

#### New Features

- `#269693, #269694` - Provided accessibility support for column header and filter.

#### Bug Fixes

- `#270384` - Prevented event markers, indicators, holidays, baseline consideration for timeline while doing zoom to fit action.

## 18.1.42 (2020-04-01)

### GanttChart

#### Bug Fixes

- `#264099` - Console error on tab key press has been fixed.
- `#269692`,`#269690` - Issue on focussing to the next element has been fixed.
- `#269772` - Prevented taskbar editing tooltip while tooltip is disabled.

## 18.1.36-beta (2020-03-19)

### GanttChart

#### New Features

- `#238591`,`#247663`,`#253913`,`#263052`,`F147148`,`F147548`,`F149280` - Provided support for PDF export which exports Gantt data to PDF format.
- `#258677`,`#264570`,`F149280` - Provided support for manual task scheduling which is used to scheduling the task manually without any dependency.
- `F146634` - Provided support for Resource Unit, which indicate the efficiency of resource by each task and Work mapping support which is used to allocate the total number of works to a task.
- `#245866`,`#252413`,`#262485`,`F147349` - Provided support for the Resource view which is used to visualize the list of tasks assigned to each resource in hierarchical order.

#### Bug Fixes

- `#263236` - Issue on multi-level dragged parent dropped into last index has been fixed.
- `#264099` - Issue in tab key action in edited state is fixed.

## 17.4.46 (2020-01-30)

### GanttChart

#### New Features

- `F148795` - Provided custom editor support in dialog edit.
- `F149069` - Provided support to render parent as milestone.
- `#257320` - Provided support for 'zoom to fit' based on visible tasks alone.

#### Bug Fixes

- `F150408` - Baseline tooltip not rendered for milestone tasks has been fixed.
- `#260944` - Issue in preventing taskbar editing has been fixed.

## 17.4.44 (2021-01-21)

### GanttChart

#### Bug Fixes

- `#260331` - Typescript declaration issue fixed.

## 17.4.41 (2020-01-07)

### GanttChart

#### New Features

- `#253076` - Provided support to focus Gantt on tab key press.

## 17.4.40 (2019-12-24)

### GanttChart

#### Bug Fixes

- `F149551` - Handled empty value while editing the numeric edit type field.

## 17.4.39 (2019-12-17)

### GanttChart

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

### GanttChart

#### Bug Fixes

- `#253076` - Accessibility issues in Gantt has been fixed.

## 17.3.29 (2019-11-26)

### GanttChart

#### Bug Fixes

- `F149069` - Parent taskbar alignment issue while rendering with single milestone child record has been fixed.
- `F149070` - Key navigation disable issue on Tree Grid section has been fixed.
- `#255266` - ParentID field not available in taskData field has been fixed.

## 17.3.28 (2019-11-19)

### GanttChart

#### Bug Fixes

- `#253912` - Parent taskbar disappearance issue while deleting all its child records has been fixed.

## 17.3.19 (2019-10-22)

### GanttChart

#### Bug Fixes

- `249581` - Browser hangs issue while change schedule mode to year has been fixed.
- `252195` - Issue on forEach method iteration in IE11 has been fixed.

## 17.3.14 (2019-10-03)

### GanttChart

#### Bug Fixes

- `F147755` - Chart part disappearing issue when splitter position value greater than control width has been fixed.

## 17.3.9-beta (2019-09-20)

### GanttChart

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

### GanttChart

#### Bug Fixes

- `F145733` -  Alignment issue with header and rows on splitter resizing has been fixed.
- `F146641` - Issue with indicators tooltip support has been fixed.

## 17.2.41 (2019-08-14)

### GanttChart

#### Bug Fixes

- `#243770` - Issue in date picker with custom format has been fixed.
- `#243238` - Included current edited data in `actionComplete` event arguments.

## 17.2.40 (2019-08-06)

### GanttChart

#### Bug Fixes

- #F145936 -  Custom column values not updated in data source on Editing has been fixed.
- Lexical declaration issues in es2015 has been fixed.

## 17.2.36 (2019-07-24)

### GanttChart

#### Bug Fixes

- #241781 - Gantt task-data property missing in template data issue has been fixed.

## 17.2.28-beta (2019-06-27)

### GanttChart

#### Bug Fixes

- #238228 - Issue while rendering tooltip with smaller duration has been fixed.

#### New Features

- Now Gantt supports context menu to perform various action.
- Provided support to perform timeline zoom in, zoom out and zoom to fit actions in Gantt.
- Provided key interaction support in Gantt.

## 17.1.49 (2019-05-29)

### GanttChart

#### Bug Fixes

- #F144145 - Task Id duplication issue while adding new record has been fixed.

## 17.1.47 (2019-05-14)

### GanttChart

#### Bug Fixes

- #233041 - Alignment issue with timeline and vertical lines has been fixed.

#### New Features

- #F143360 - Provided support to refresh the `dataSource` dynamically.

## 17.1.43 (2019-04-30)

### GanttChart

#### Bug Fixes

- Bug fixes included.

## 17.1.40 (2019-04-09)

### GanttChart

#### Bug Fixes

- Internal bug fixes included.

## 17.1.32-beta (2019-03-13)

### GanttChart

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
