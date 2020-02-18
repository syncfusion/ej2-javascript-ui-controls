import { Component, EventHandler, Internationalization, ModuleDeclaration, isBlazor } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, KeyboardEvents, L10n } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, KeyboardEventArgs, BaseEventArgs } from '@syncfusion/ej2-base';import { cldrData, getDefaultDateObject, rippleEffect } from '@syncfusion/ej2-base';import { createElement, removeClass, detach, closest, addClass, attributes } from '@syncfusion/ej2-base';import { getValue, getUniqueID, extend, Browser } from '@syncfusion/ej2-base';import { Property, Event, EmitType, isNullOrUndefined, throwError } from '@syncfusion/ej2-base';import { Islamic, IslamicDateArgs } from './index';
import {CalendarType,CalendarView,DayHeaderFormats,NavigatedEventArgs,RenderDayCellEventArgs,ChangedEventArgs} from "./calendar";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class CalendarBase
 * @private
 */
export interface CalendarBaseModel extends ComponentModel{

    /**
     * Gets or sets the minimum date that can be selected in the Calendar.
     * @default new Date(1900, 00, 01)
     * @blazorDefaultValue new DateTime(1900, 01, 01)
     * @deprecated
     */
    min?: Date;

    /**
     * Gets or sets the maximum date that can be selected in the Calendar.
     * @default new Date(2099, 11, 31)
     * @blazorDefaultValue new DateTime(2099, 12, 31)
     * @deprecated
     */
    max?: Date;

    /**
     * Gets or sets the Calendar's first day of the week. By default, the first day of the week will be based on the current culture.
     * @default 0
     * @aspType int
     * @blazorType int
     * @deprecated
     * > For more details about firstDayOfWeek refer to 
     * [`First day of week`](../../calendar/how-to/first-day-of-week#change-the-first-day-of-the-week) documentation.
     */
    firstDayOfWeek?: number;

    /**
     * Gets or sets the Calendar's Type like gregorian or islamic.
     * @default Gregorian
     * @deprecated
     */
    calendarMode?: CalendarType;

    /**
     * Specifies the initial view of the Calendar when it is opened.
     * With the help of this property, initial view can be changed to year or decade view.
     * @default Month
     * @deprecated
     *  
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * View<br/></td><td colSpan=1 rowSpan=1>
     * Description<br/></td></tr> 
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Month<br/></td><td colSpan=1 rowSpan=1>
     * Calendar view shows the days of the month.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Year<br/></td><td colSpan=1 rowSpan=1>
     * Calendar view shows the months of the year.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Decade<br/></td><td colSpan=1 rowSpan=1>
     * Calendar view shows the years of the decade.<br/></td></tr>
     * </table>
     *
     * > For more details about start refer to 
     * [`calendarView`](../../calendar/calendar-views#view-restriction)documentation.
     */
    start?: CalendarView;

    /**
     * Sets the maximum level of view such as month, year, and decade in the Calendar.
     * Depth view should be smaller than the start view to restrict its view navigation.
     * @default Month
     * @deprecated
     * 
     * <table> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * view<br/></td><td colSpan=1 rowSpan=1> 
     * Description<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * Month<br/></td><td colSpan=1 rowSpan=1> 
     * Calendar view shows up to the days of the month.<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * Year<br/></td><td colSpan=1 rowSpan=1> 
     * Calendar view shows up to the months of the year.<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * Decade<br/></td><td colSpan=1 rowSpan=1> 
     * Calendar view shows up to the years of the decade.<br/></td></tr> 
     * </table> 
     * 
     * > For more details about depth refer to 
     *  [`calendarView`](../../calendar/calendar-views#view-restriction)documentation.
     */
    depth?: CalendarView;

    /**
     * Determines whether the week number of the year is to be displayed in the calendar or not.
     * @default false
     * @deprecated
     * > For more details about weekNumber refer to 
     * [`Calendar with week number`](../../calendar/how-to/render-the-calendar-with-week-numbers)documentation.
     */
    weekNumber?: boolean;

    /**
     * Specifies whether the today button is to be displayed or not.
     * @default true
     * @deprecated
     */
    showTodayButton?: boolean;

    /**
     * Specifies the format of the day that to be displayed in header. By default, the format is ‘short’.
     * Possible formats are:
     * * `Short` - Sets the short format of day name (like Su ) in day header.
     * * `Narrow` - Sets the single character of day name (like S ) in day header.
     * * `Abbreviated` - Sets the min format of day name (like Sun ) in day header.
     * * `Wide` - Sets the long format of day name (like Sunday ) in day header.
     * @default Short
     * @deprecated
     */
    dayHeaderFormat?: DayHeaderFormats;

    /**
     * Enable or disable persisting component's state between page reloads. If enabled, following list of states will be persisted.
     * 1. value
     * @default false
     * @deprecated
     */
    enablePersistence?: boolean;

    /**
     * Customizes the key actions in Calendar.
     * For example, when using German keyboard, the key actions can be customized using these shortcuts.
     * 
     * <table> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * Key action<br/></td><td colSpan=1 rowSpan=1> 
     * Key<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * controlUp<br/></td><td colSpan=1 rowSpan=1> 
     * ctrl+38<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * controlDown<br/></td><td colSpan=1 rowSpan=1> 
     * ctrl+40<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * select<br/></td><td colSpan=1 rowSpan=1> 
     * enter<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * home<br/></td><td colSpan=1 rowSpan=1> 
     * home<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * end<br/></td><td colSpan=1 rowSpan=1> 
     * end<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * pageUp<br/></td><td colSpan=1 rowSpan=1> 
     * pageup<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * pageDown<br/></td><td colSpan=1 rowSpan=1> 
     * pagedown<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * shiftPageUp<br/></td><td colSpan=1 rowSpan=1> 
     * shift+pageup<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * shiftPageDown<br/></td><td colSpan=1 rowSpan=1> 
     * shift+pagedown<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * controlHome<br/></td><td colSpan=1 rowSpan=1> 
     * ctrl+home<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * controlEnd<br/></td><td colSpan=1 rowSpan=1> 
     * ctrl+end<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * altUpArrow<br/></td><td colSpan=1 rowSpan=1> 
     * alt+uparrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * spacebar<br/></td><td colSpan=1 rowSpan=1> 
     * space<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * altRightArrow<br/></td><td colSpan=1 rowSpan=1> 
     * alt+rightarrow<br/></td></tr>  
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * altLeftArrow<br/></td><td colSpan=1 rowSpan=1> 
     * alt+leftarrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * moveDown<br/></td><td colSpan=1 rowSpan=1> 
     * downarrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * moveUp<br/></td><td colSpan=1 rowSpan=1> 
     * uparrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * moveLeft<br/></td><td colSpan=1 rowSpan=1> 
     * leftarrow<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * moveRight<br/></td><td colSpan=1 rowSpan=1> 
     * rightarrow<br/></td></tr> 
     * </table>
     * 
     * {% codeBlock src='calendar/keyConfigs/index.md' %}{% endcodeBlock %}
     * @default null
     * @blazorType object
     * @deprecated
     */
    keyConfigs?: { [key: string]: string };

    /**
     * By default, the date value will be processed based on system time zone.
     * If you want to process the initial date value using server time zone 
     * then specify the time zone value to `serverTimezoneOffset` property.
     * @deprecated
     */
    serverTimezoneOffset?: number;

    /**
     * Triggers when Calendar is created.
     * @event
     * @blazorProperty 'Created'
     */
    created?: EmitType<Object>;

    /**
     * Triggers when Calendar is destroyed.
     * @event
     * @blazorProperty 'Destroyed'
     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers when the Calendar is navigated to another level or within the same level of view.
     * @event
     * @blazorProperty 'Navigated'
     */
    navigated?: EmitType<NavigatedEventArgs>;

    /**
     * Triggers when each day cell of the Calendar is rendered.
     * @event
     * @blazorProperty 'OnRenderDayCell'
     */
    renderDayCell?: EmitType<RenderDayCellEventArgs>;

}

/**
 * Interface for a class Calendar
 */
export interface CalendarModel extends CalendarBaseModel{

    /**
     * Gets or sets the selected date of the Calendar.
     * @default null
     * @isGenericType true
     * @deprecated
     */
    value?: Date;

    /**
     * Gets or sets multiple selected dates of the calendar.
     * {% codeBlock src='calendar/values/index.md' %}{% endcodeBlock %}
     * @default null
     */
    values?: Date[];

    /**
     * Specifies the option to enable the multiple dates selection of the calendar.
     * @default false
     */
    isMultiSelection?: boolean;

    /**
     * Triggers when the Calendar value is changed.
     * @event
     * @blazorProperty 'ValueChange'
     */
    change?: EmitType<ChangedEventArgs>;

}