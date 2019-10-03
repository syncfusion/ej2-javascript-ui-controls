import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { View, Orientation } from '../base/type';import { TimeScale } from '../models/time-scale';import { TimeScaleModel, GroupModel, HeaderRowsModel } from '../models/models';import { Group } from '../models/group';import { HeaderRows } from './header-rows';

/**
 * Interface for a class Views
 */
export interface ViewsModel {

    /**
     * It accepts the schedule view name, based on which we can define with its related properties in a single object.
     *  The applicable view names are,
     * * Day
     * * Week
     * * WorkWeek
     * * Month
     * * Agenda
     * * MonthAgenda
     * * TimelineDay
     * * TimelineWeek
     * * TimelineWorkWeek
     * * TimelineMonth
     * * TimelineYear

     */
    option?: View;

    /**
     * To denote whether the view name given on the `option` is active or not. 
     * It acts similar to the `currentView` property and defines the active view of Schedule.

     */
    isSelected?: boolean;

    /**
     * By default, Schedule follows the date-format as per the default culture assigned to it. It is also possible to manually set
     *  specific date format by using the `dateFormat` property. The format of the date range label in the header bar depends on
     *  the `dateFormat` value or else based on the locale assigned to the Schedule.
     *  It gets applied only to the view objects on which it is defined.

     */
    dateFormat?: string;

    /**
     * When set to `true`, displays a quick popup with cell or event details on single clicking over the cells or on events.
     *  By default, it is set to `true`. It gets applied only to the view objects on which it is defined.

     */
    readonly?: boolean;

    /**
     * It is used to specify the starting hour, from which the Schedule starts to display.
     *  It accepts the time string in a short skeleton format and also, hides the time beyond the specified start time.

     */
    startHour?: string;

    /**
     * It is used to specify the end hour, at which the Schedule ends. It too accepts the time string in a short skeleton format.

     */
    endHour?: string;

    /**
     * It is used to allow or disallow the virtual scrolling functionality on Agenda View. This is applicable only on Agenda view.

     */
    allowVirtualScrolling?: boolean;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto the
     *  month date cells.
     *  This template is only applicable for month view day cells.

     */
    cellHeaderTemplate?: string;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto the
     *  date header cells. The field that can be accessed via this template is `date`.
     *  It gets applied only to the view objects on which it is defined.

     */
    dateHeaderTemplate?: string;

    /**
     * The template option which is used to render the customized work cells on the Schedule. Here, the
     *  template accepts either the string or HTMLElement as template design and then the parsed design is displayed onto the work cells.
     *  The field accessible via template is `date`. It gets applied only to the view objects on which it is defined.

     */
    cellTemplate?: string;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto
     *  the event background. All the event fields mapped to Schedule from dataSource can be accessed within this template code.
     *  It is similar to that of the `template` option available within the `eventSettings` property,
     *  whereas it will get applied only on the events of the view to which it is currently being defined.

     */
    eventTemplate?: string;

    /**
     * When set to `false`, it hides the weekend days of a week from the Schedule. 
     * The days which are not defined in the working days collection are usually treated as weekend days.
     * Note: By default, this option is not applicable on `Work Week` view.
     * For example, if the working days are defined as [1, 2, 3, 4], then the remaining days of that week will be considered as the
     *  weekend days and will be hidden on all the views.

     */
    showWeekend?: boolean;

    /**
     * When set to `true`, displays the week number of the current view date range. 

     */
    showWeekNumber?: boolean;

    /**
     * When the same view is customized with different intervals, this property allows the user to set different display name
     *  for those views.

     */
    displayName?: string;

    /**
     * It accepts the number value denoting to include the number of days, weeks, workweeks or months on the defined view type.

     */
    interval?: number;

    /**
     * This option allows the user to set the first day of a week on Schedule. It should be based on the locale set to it and each culture
     *  defines its own first day of week values. If needed, the user can set it manually on his own by defining the value through
     *  this property. It usually accepts the integer values, whereby 0 is always denoted as Sunday, 1 as Monday and so on.

     */
    firstDayOfWeek?: number;

    /**
     * It is used to set the working days on schedule. The only days that are defined in this collection will be rendered on the
     *  `workWeek` view whereas on other views, it will display all the usual days and simply highlights the working days with different
     *  shade.



     */
    workDays?: number[];

    /**
     * The template option which is used to render the customized header cells on the schedule. Here, the
     *  template accepts either the string or HTMLElement as template design and then the parsed design is displayed onto the header cells.
     *  All the resource fields mapped within resources can be accessed within this template code.
     *  It gets applied only to the view objects on which it is defined.

     */
    resourceHeaderTemplate?: string;

    /**
     * It is used to specify the year view rendering orientation on the schedule.

     */
    orientation?: Orientation;

    /**
     * Allows to set different timescale configuration on each applicable view modes such as day, week and work week.

     */
    timeScale?: TimeScaleModel;

    /**
     * Allows to set different resource grouping options on all available schedule view modes.

     */
    group?: GroupModel;

    /**
     * Allows defining the collection of custom header rows to display the year, month, week, date and hour label as an individual row
     *  on the timeline view of the scheduler.

     */
    headerRows?: HeaderRowsModel[];

}