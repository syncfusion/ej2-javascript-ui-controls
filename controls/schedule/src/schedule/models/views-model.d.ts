import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { View, Orientation } from '../base/type';import { TimeScale } from '../models/time-scale';import { TimeScaleModel, GroupModel, HeaderRowsModel } from '../models/models';import { Group } from '../models/group';import { HeaderRows } from './header-rows';

/**
 * Interface for a class Views
 */
export interface ViewsModel {

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
     *
     * @default null
     */
    option?: View;

    /**
     * To denote whether the view name given on the `option` is active or not.
     * It acts similar to the [`currentView`](../../schedule/#current-view/)
     * property and defines the active view of Schedule.
     *
     * @default false
     */
    isSelected?: boolean;

    /**
     * By default, Schedule follows the date-format as per the default culture assigned to it. It is also possible to manually set
     *  specific date format by using the `dateFormat` property. The format of the date range label in the header bar depends on
     *  the `dateFormat` value or else based on the locale assigned to the Schedule.
     *  It gets applied only to the view objects on which it is defined.
     *
     * @default null
     */
    dateFormat?: string;

    /**
     * When set to `true`, displays a quick popup with cell or event details on single clicking over the cells or on events.
     *  By default, it is set to `true`. It gets applied only to the view objects on which it is defined.
     *
     * @default false
     */
    readonly?: boolean;

    /**
     * It is used to specify the starting hour, from which the Schedule starts to display.
     *  It accepts the time string in a short skeleton format and also, hides the time beyond the specified start time.
     *
     * @default '00:00'
     */
    startHour?: string;

    /**
     * It is used to specify the end hour, at which the Schedule ends. It too accepts the time string in a short skeleton format.
     *
     * @default '24:00'
     */
    endHour?: string;

    /**
     * It is used to allow or disallow the virtual scrolling functionality.
     *
     * @default false
     */
    allowVirtualScrolling?: boolean;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto the
     *  month date cells.
     *  This template is only applicable for month view day cells.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    cellHeaderTemplate?: string | Function;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto the
     *  date header cells. The field that can be accessed via this template is `date`.
     *  It gets applied only to the view objects on which it is defined.
     *
     * @default null
     * @aspType string
     */
    dateHeaderTemplate?: string | Function;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto the header date range.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    dateRangeTemplate?: string | Function;

    /**
     * The template option which is used to render the customized work cells on the Schedule. Here, the
     *  template accepts either the string or HTMLElement as template design and then the parsed design is displayed onto the work cells.
     *  The field accessible via template is `date`. It gets applied only to the view objects on which it is defined.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    cellTemplate?: string | Function;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto the
     *  Year view day cell header.
     *  This template is only applicable for year view header cells.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    dayHeaderTemplate?: string | Function;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto the
     *  Year view day cell header.
     *  This template is only applicable for year view header cells.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    monthHeaderTemplate?: string | Function;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto
     *  the event background. All the event fields mapped to Schedule from dataSource can be accessed within this template code.
     *  It is similar to that of the `template` option available within the `eventSettings` property,
     *  whereas it will get applied only on the events of the view to which it is currently being defined.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    eventTemplate?: string | Function;

    /**
     * When set to `false`, it hides the weekend days of a week from the Schedule.
     * The days which are not defined in the working days collection are usually treated as weekend days.
     * Note: By default, this option is not applicable on `Work Week` view.
     * For example, if the working days are defined as [1, 2, 3, 4], then the remaining days of that week will be considered as the
     *  weekend days and will be hidden on all the views.
     *
     * @default true
     */
    showWeekend?: boolean;

    /**
     * When set to `true`, displays the week number of the current view date range.
     *
     * @default false
     */
    showWeekNumber?: boolean;

    /**
     * When the same view is customized with different intervals, this property allows the user to set different display name
     *  for those views.
     *
     * @default null
     */
    displayName?: string;

    /**
     * It accepts the number value denoting to include the number of days, weeks, workweeks or months on the defined view type.
     *
     * @default 1
     */
    interval?: number;

    /**
     * This option allows the user to set the first day of a week on Schedule. It should be based on the locale set to it and each culture
     *  defines its own first day of week values. If needed, the user can set it manually on his own by defining the value through
     *  this property. It usually accepts the integer values, whereby 0 is always denoted as Sunday, 1 as Monday and so on.
     *
     * @default 0
     */
    firstDayOfWeek?: number;

    /**
     * This property helps render the year view customized months.
     * By default, it is set to `0`.
     *
     * @default 0
     */
    firstMonthOfYear?: number;

    /**
     * This option allows the user to set the number of months count to be displayed on the Schedule.
     * {% codeBlock src='schedule/monthsCount/index.md' %}{% endcodeBlock %}
     *
     * @default 12
     * @aspType int
     */
    monthsCount?: number;

    /**
     * It is used to set the working days on schedule. The only days that are defined in this collection will be rendered on the
     *  `workWeek` view whereas on other views, it will display all the usual days and simply highlights the working days with different
     *  shade.
     *
     * @default '[1, 2, 3, 4, 5]'
     * @aspType int[]
     */
    workDays?: number[];

    /**
     * The template option which is used to render the customized header cells on the schedule. Here, the
     *  template accepts either the string or HTMLElement as template design and then the parsed design is displayed onto the header cells.
     *  All the resource fields mapped within resources can be accessed within this template code.
     *  It gets applied only to the view objects on which it is defined.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    resourceHeaderTemplate?: string | Function;

    /**
     * The template option which is used to render the customized header indent cell on the schedule. Here, the
     *  template accepts either the string or HTMLElement as template design and then the parsed design is displayed onto the header indent cell.
     *  It gets applied only to the view objects on which it is defined.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    headerIndentTemplate?: string | Function;

    /**
     * By default, Schedule follows the time-format as per the default culture assigned to it.
     * It is also possible to manually set specific time format by using the `timeFormat` property.
     * {% codeBlock src='schedule/timeFormat/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    timeFormat?: string;

    /**
     * It is used to specify the year view rendering orientation on the schedule.
     * The applicable orientation values are,
     * * Horizontal - Denotes the horizontal orientation of Timeline Year view.
     * * Vertical - Denotes the vertical orientation of Timeline Year view.
     *
     * @default 'Horizontal'
     */
    orientation?: Orientation;

    /**
     * Allows to set different timescale configuration on each applicable view modes such as day, week and work week.
     *
     * @default { enable: true, interval: 60, slotCount: 2, majorSlotTemplate: null, minorSlotTemplate: null }
     */
    timeScale?: TimeScaleModel;

    /**
     * Allows to set different resource grouping options on all available schedule view modes.
     *
     * @default { byDate: false, byGroupID: true, allowGroupEdit: false, resources:[], hideNonWorkingDays: false }
     */
    group?: GroupModel;

    /**
     * Allows defining the collection of custom header rows to display the year, month, week, date and hour label as an individual row
     *  on the timeline view of the scheduler.
     *
     * @default []
     */
    headerRows?: HeaderRowsModel[];

    /**
     * This property customizes the number of weeks that are shown in month view. By default, it shows all weeks in the current month.
     *  Use displayDate property to customize the starting week of month.
     * {% codeBlock src='schedule/numberOfWeeks/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     * @aspType int
     */
    numberOfWeeks?: number;

    /**
     * Specifies the starting week date at an initial rendering of month view. This property is only applicable for month view.
     *  If this property value is not set, then the month view will be rendered from the first week of the month.
     * {% codeBlock src='schedule/displayDate/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    displayDate?: Date;

    /**
     * Enables the lazy loading of events for scrolling actions only when the resources grouping property is enabled.
     * Lazy loading allows the scheduler to fetch the appointments dynamically during scroll actions for the currently rendered resource collection.
     * New event data is fetched on-demand as the user scrolls through the schedule content.
     *
     * @default false
     */
    enableLazyLoading?: boolean;

}