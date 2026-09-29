import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['allowOverlap', 'allowVirtualScrolling', 'cellHeaderTemplate', 'cellTemplate', 'dateFormat', 'dateHeaderTemplate', 'dateRangeTemplate', 'dayHeaderTemplate', 'displayDate', 'displayName', 'enableLazyLoading', 'endHour', 'eventTemplate', 'firstDayOfWeek', 'firstMonthOfYear', 'group', 'headerIndentTemplate', 'headerRows', 'interval', 'isSelected', 'maxEventStack', 'maxEventsPerRow', 'monthHeaderTemplate', 'monthsCount', 'numberOfWeeks', 'option', 'orientation', 'overscanCount', 'readonly', 'resourceHeaderTemplate', 'showWeekNumber', 'showWeekend', 'startHour', 'timeFormat', 'timeScale', 'workDays'];
let outputs: string[] = [];
/**
 * `e-views` directive represent a view of the Angular Schedule. 
 * It must be contained in a Schedule component(`ejs-schedule`). 
 * ```html
 * <ejs-schedule>
 *   <e-views>
 *    <e-view option='day' dateFormat='dd MMM'></e-view>
 *    <e-view option='week'></e-view>
 *   </e-views>
 * </ejs-schedule>
 * ```
 */
@Directive({
    selector: 'e-views>e-view',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        dateHeaderTemplate: new ContentChild('dateHeaderTemplate'),
        dateRangeTemplate: new ContentChild('dateRangeTemplate'),
        dayHeaderTemplate: new ContentChild('dayHeaderTemplate'),
        cellHeaderTemplate: new ContentChild('cellHeaderTemplate'),
        cellTemplate: new ContentChild('cellTemplate'),
        eventTemplate: new ContentChild('eventTemplate'),
        monthHeaderTemplate: new ContentChild('monthHeaderTemplate'),
        resourceHeaderTemplate: new ContentChild('resourceHeaderTemplate'),
        headerIndentTemplate: new ContentChild('headerIndentTemplate'),
        timeScale_minorSlotTemplate: new ContentChild('timeScaleMinorSlotTemplate'),
        timeScale_majorSlotTemplate: new ContentChild('timeScaleMajorSlotTemplate'),
        group_headerTooltipTemplate: new ContentChild('groupHeaderTooltipTemplate')
    }
})
export class ViewDirective extends ComplexBase<ViewDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies whether overlapping appointments are allowed within the same time slot in the Scheduler.
     * @remarks When set to `false`, the Scheduler enforces restrictions to prevent creating or displaying overlapping appointments within the same time duration.
This setting includes the following limitations:

- **Initial Loading**: The alert for overlapping appointments will not display during the initial load. Overlapping events will be ignored in rendering, including occurrences.

- **Dynamic Add/Edit**: When adding or editing events dynamically, overlapping validation is performed. If an overlap is detected for a single event, an alert will be shown, and the event will not be saved.

For recurring events, an alert will be displayed, and the event will not be saved. To save recurring events while ignoring overlapping occurrences, trigger the `PopupOpen` event. The `Data` field will contain the parent recurrence data, and the `overlapEvents` field will contain the overlap events. Using these details, users can include exceptions in the recurrence events and save them with the `addEvent` method.

- **Out-of-Date-Range Events**: The `allowOverlap` setting only prevents overlaps for events within the current view date range. To validate overlap events outside the current date range, use the `actionBegin` event to send a request to the server for validation and return a promise-based response. Assign this promise response to the `promise` field in `ActionEventArgs` to handle asynchronous server validation.

     * @default true
     */
    public declare allowOverlap: any;
    /** 
     * It is used to allow or disallow the virtual scrolling functionality.
     * @default false
     */
    public declare allowVirtualScrolling: any;
    /** 
     * By default, Schedule follows the date-format as per the default culture assigned to it. It is also possible to manually set 
     *  specific date format by using the `dateFormat` property. The format of the date range label in the header bar depends on 
     *  the `dateFormat` value or else based on the locale assigned to the Schedule. 
     *  It gets applied only to the view objects on which it is defined.
     * @default null
     */
    public declare dateFormat: any;
    /** 
     * Specifies the starting week date at an initial rendering of month view. This property is only applicable for month view. 
     *  If this property value is not set, then the month view will be rendered from the first week of the month. 
     * {% codeBlock src='schedule/displayDate/index.md' %}{% endcodeBlock %}
     * @default null
     */
    public declare displayDate: any;
    /** 
     * When the same view is customized with different intervals, this property allows the user to set different display name 
     *  for those views.
     * @default null
     */
    public declare displayName: any;
    /** 
     * Enables the lazy loading of events for scrolling actions only when the resources grouping property is enabled. 
     * Lazy loading allows the scheduler to fetch the appointments dynamically during scroll actions for the currently rendered resource collection. 
     * New event data is fetched on-demand as the user scrolls through the schedule content.
     * @default false
     */
    public declare enableLazyLoading: any;
    /** 
     * It is used to specify the end hour, at which the Schedule ends. It too accepts the time string in a short skeleton format.
     * @default '24:00'
     */
    public declare endHour: any;
    /** 
     * This option allows the user to set the first day of a week on Schedule. It should be based on the locale set to it and each culture 
     *  defines its own first day of week values. If needed, the user can set it manually on his own by defining the value through 
     *  this property. It usually accepts the integer values, whereby 0 is always denoted as Sunday, 1 as Monday and so on.
     * @default 0
     */
    public declare firstDayOfWeek: any;
    /** 
     * This property helps render the year view customized months. 
     * By default, it is set to `0`.
     * @default 0
     */
    public declare firstMonthOfYear: any;
    /** 
     * Allows to set different resource grouping options on all available schedule view modes.
     * @default { byDate: false, byGroupID: true, allowGroupEdit: false, resources:[], hideNonWorkingDays: false }
     */
    public declare group: any;
    /** 
     * Allows defining the collection of custom header rows to display the year, month, week, date and hour label as an individual row 
     *  on the timeline view of the scheduler.
     * @default []
     */
    public declare headerRows: any;
    /** 
     * It accepts the number value denoting to include the number of days, weeks, workweeks or months on the defined view type.
     * @default 1
     */
    public declare interval: any;
    /** 
     * To denote whether the view name given on the `option` is active or not. 
     * It acts similar to the [`currentView`](../../schedule/#current-view/) 
     * property and defines the active view of Schedule.
     * @default false
     */
    public declare isSelected: any;
    /** 
     * Specifies the maximum number of events to be displayed per cell in vertical views. 
     * This property is applicable only to Day, Week and WorkWeek views when the TimeScale option is enabled.
     * @remarks - When set to 0 (default), all events are displayed without any limit, maintaining backward compatibility.
- When set to a positive integer (e.g., 1, 2), only that many events will be visible, and remaining events are hidden.

     * @default 0
     * @asptype int
     */
    public declare maxEventStack: any;
    /** 
     * Specifies the maximum number of events to be displayed in a single row. 
     * This property is applicable when the 'rowAutoHeight' property is disabled. 
     * This property is only applicable for the month view, timeline views, and timeline year view.
     * @default null
     */
    public declare maxEventsPerRow: any;
    /** 
     * This option allows the user to set the number of months count to be displayed on the Schedule. 
     * {% codeBlock src='schedule/monthsCount/index.md' %}{% endcodeBlock %}
     * @default 12
     * @asptype int
     */
    public declare monthsCount: any;
    /** 
     * This property customizes the number of weeks that are shown in month view. By default, it shows all weeks in the current month. 
     *  Use displayDate property to customize the starting week of month. 
     * {% codeBlock src='schedule/numberOfWeeks/index.md' %}{% endcodeBlock %}
     * @default 0
     * @asptype int
     */
    public declare numberOfWeeks: any;
    /** 
     * It accepts the schedule view name, based on which we can define with its related properties in a single object. 
     * The applicable view names are, 
     * * Day - Denotes Day view of the scheduler. 
     * * Week - Denotes Week view of the scheduler. 
     * * WorkWeek - Denotes Work Week view of the scheduler. 
     * * Month - Denotes Month view of the scheduler. 
     * * Year - Denotes Year view of the scheduler. 
     * * Agenda - Denotes Agenda view of the scheduler. 
     * * MonthAgenda - Denotes Month Agenda view of the scheduler. 
     * * TimelineDay - Denotes Timeline Day view of the scheduler. 
     * * TimelineWeek - Denotes Timeline Week view of the scheduler. 
     * * TimelineWorkWeek - Denotes Timeline Work Week view of the scheduler. 
     * * TimelineMonth - Denotes Timeline Month view of the scheduler. 
     * * TimelineYear - Denotes Timeline Year view of the scheduler.
     * @default null
     */
    public declare option: any;
    /** 
     * It is used to specify the year view rendering orientation on the schedule. 
     * The applicable orientation values are, 
     * * Horizontal - Denotes the horizontal orientation of Timeline Year view. 
     * * Vertical - Denotes the vertical orientation of Timeline Year view.
     * @default 'Horizontal'
     */
    public declare orientation: any;
    /** 
     * Specifies the number of additional rows or columns to render outside the visible area during virtual scrolling. 
     * This property helps in achieving smoother scrolling by pre-loading data just outside the visible region.
     * @remarks The default value is 3. Increasing this value can result in smoother scrolling but may impact performance
with larger datasets. Decreasing it can improve performance but may cause more frequent data fetches during scrolling.
This property only takes effect when `allowVirtualScrolling` is enabled for the current view.

     * @default 3
     */
    public declare overscanCount: any;
    /** 
     * When set to `true`, displays a quick popup with cell or event details on single clicking over the cells or on events. 
     *  By default, it is set to `true`. It gets applied only to the view objects on which it is defined.
     * @default false
     */
    public declare readonly: any;
    /** 
     * When set to `true`, displays the week number of the current view date range.
     * @default false
     */
    public declare showWeekNumber: any;
    /** 
     * When set to `false`, it hides the weekend days of a week from the Schedule. 
     * The days which are not defined in the working days collection are usually treated as weekend days. 
     * Note: By default, this option is not applicable on `Work Week` view. 
     * For example, if the working days are defined as [1, 2, 3, 4], then the remaining days of that week will be considered as the 
     *  weekend days and will be hidden on all the views.
     * @default true
     */
    public declare showWeekend: any;
    /** 
     * It is used to specify the starting hour, from which the Schedule starts to display. 
     *  It accepts the time string in a short skeleton format and also, hides the time beyond the specified start time.
     * @default '00:00'
     */
    public declare startHour: any;
    /** 
     * By default, Schedule follows the time-format as per the default culture assigned to it. 
     * It is also possible to manually set specific time format by using the `timeFormat` property. 
     * {% codeBlock src='schedule/timeFormat/index.md' %}{% endcodeBlock %}
     * @default null
     */
    public declare timeFormat: any;
    /** 
     * Allows to set different timescale configuration on each applicable view modes such as day, week and work week.
     * @default { enable: true, interval: 60, slotCount: 2, majorSlotTemplate: null, minorSlotTemplate: null }
     */
    public declare timeScale: any;
    /** 
     * It is used to set the working days on schedule. The only days that are defined in this collection will be rendered on the 
     *  `workWeek` view whereas on other views, it will display all the usual days and simply highlights the working days with different 
     *  shade.
     * @default '[1, 2, 3, 4, 5]'
     * @asptype int[]
     */
    public declare workDays: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(ViewDirective.prototype, 'dateHeaderTemplate');
Template()(ViewDirective.prototype, 'dateRangeTemplate');
Template()(ViewDirective.prototype, 'dayHeaderTemplate');
Template()(ViewDirective.prototype, 'cellHeaderTemplate');
Template()(ViewDirective.prototype, 'cellTemplate');
Template()(ViewDirective.prototype, 'eventTemplate');
Template()(ViewDirective.prototype, 'monthHeaderTemplate');
Template()(ViewDirective.prototype, 'resourceHeaderTemplate');
Template()(ViewDirective.prototype, 'headerIndentTemplate');
Template()(ViewDirective.prototype, 'timeScale_minorSlotTemplate');
Template()(ViewDirective.prototype, 'timeScale_majorSlotTemplate');
Template()(ViewDirective.prototype, 'group_headerTooltipTemplate');

/**
 * View Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-schedule>e-views',
    standalone: true,
    queries: {
        children: new ContentChildren(ViewDirective)
    },
})
export class ViewsDirective extends ArrayBase<ViewsDirective> {
    constructor() {
        super('views');
    }
}