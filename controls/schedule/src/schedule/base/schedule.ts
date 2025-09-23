/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ModuleDeclaration, Property, Event, Animation, Collection, append } from '@syncfusion/ej2-base';
import { EventHandler, EmitType, Browser, Internationalization, getDefaultDateObject, cldrData, L10n } from '@syncfusion/ej2-base';
import { getValue, compile, extend, isNullOrUndefined, NotifyPropertyChanges, INotifyPropertyChanged, Complex } from '@syncfusion/ej2-base';
import { getElement, removeClass, addClass, classList, remove, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { ScheduleModel } from './schedule-model';
import { HeaderRenderer } from '../renderer/header-renderer';
import { Scroll } from '../actions/scroll';
import { ScheduleTouch } from '../actions/touch';
import { KeyboardInteraction } from '../actions/keyboard';
import { Data } from '../actions/data';
import { View, CurrentAction, ReturnType, WeekRule, NavigationDirection } from '../base/type';
import { EventBase } from '../event-renderer/event-base';
import { InlineEdit } from '../event-renderer/inline-edit';
import { QuickPopups } from '../popups/quick-popups';
import { EventTooltip } from '../popups/event-tooltip';
import { EventWindow } from '../popups/event-window';
import { Render } from '../renderer/renderer';
import { Day } from '../renderer/day';
import { Week } from '../renderer/week';
import { WorkWeek } from '../renderer/work-week';
import { Month } from '../renderer/month';
import { Year } from '../renderer/year';
import { Agenda } from '../renderer/agenda';
import { MonthAgenda } from '../renderer/month-agenda';
import { TimelineViews } from '../renderer/timeline-view';
import { TimelineMonth } from '../renderer/timeline-month';
import { TimelineYear } from '../renderer/timeline-year';
import { WorkHours } from '../models/work-hours';
import { TimeScale } from '../models/time-scale';
import { QuickInfoTemplates } from '../models/quick-info-templates';
import { HeaderRows } from '../models/header-rows';
import { Crud } from '../actions/crud';
import { Resize } from '../actions/resize';
import { DragAndDrop } from '../actions/drag';
import { VirtualScroll } from '../actions/virtual-scroll';
import { WorkCellInteraction } from '../actions/work-cells';
import { WorkHoursModel, ViewsModel, EventSettingsModel, GroupModel, ResourcesModel, TimeScaleModel, ToolbarItemModel } from '../models/models';
import { QuickInfoTemplatesModel, HeaderRowsModel } from '../models/models';
import { EventSettings } from '../models/event-settings';
import { Group } from '../models/group';
import { Resources } from '../models/resources';
import { ICalendarExport } from '../exports/calendar-export';
import { ICalendarImport } from '../exports/calendar-import';
import { ExcelExport } from '../exports/excel-export';
import { Print } from '../exports/print';
import { IRenderer, ActionEventArgs, NavigatingEventArgs, CellClickEventArgs, RenderCellEventArgs, ScrollCss, TimezoneFields, ExcelExportEventArgs, BeforePasteEventArgs, TooltipOpenEventArgs } from '../base/interface';
import { EventClickArgs, EventRenderedArgs, PopupOpenEventArgs, UIStateArgs, DragEventArgs, ResizeEventArgs } from '../base/interface';
import { EventFieldsMapping, TdData, ResourceDetails, ResizeEdges, StateArgs, ExportOptions, SelectEventArgs } from '../base/interface';
import { ViewsData, PopupCloseEventArgs, HoverEventArgs, MoreEventsClickArgs, ScrollEventArgs, CallbackFunction, BeforePrintEventArgs } from '../base/interface';
import { CalendarUtil, Gregorian, Islamic, CalendarType } from '../../common/calendar-util';
import { ResourceBase } from '../base/resource';
import { Timezone, timezoneData } from '../timezone/timezone';
import { RecurrenceEditor } from '../../recurrence-editor/recurrence-editor';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
import { ToolbarItem } from '../models/toolbar';

/**
 * Represents the Schedule component that displays a list of events scheduled against specific date and timings,
 * thus helping us to plan and manage it properly.
 * ```html
 * <div id="schedule"></div>
 * ```
 * ```typescript
 * <script>
 *   var scheduleObj = new Schedule();
 *   scheduleObj.appendTo("#schedule");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Schedule extends Component<HTMLElement> implements INotifyPropertyChanged {
    // internal variables
    public globalize: Internationalization;
    public localeObj: L10n;
    public isAdaptive: boolean;
    public dataModule: Data;
    public eventTooltip: EventTooltip;
    public eventWindow: EventWindow;
    public renderModule: Render;
    public headerModule: HeaderRenderer;
    public scrollModule: Scroll;
    public inlineModule: InlineEdit;
    public virtualScrollModule: VirtualScroll;
    public iCalendarExportModule: ICalendarExport;
    public iCalendarImportModule: ICalendarImport;
    public crudModule: Crud;
    public scheduleTouchModule: ScheduleTouch;
    public keyboardInteractionModule: KeyboardInteraction;
    public activeView: IRenderer;
    public activeCellsData: CellClickEventArgs;
    public activeEventData: EventClickArgs;
    public eventBase: EventBase;
    public workCellAction: WorkCellInteraction;
    public tzModule: Timezone;
    public resourceBase: ResourceBase;
    public currentTimezoneDate: Date;
    private cellHeaderTemplateFn: CallbackFunction;
    private cellTemplateFn: CallbackFunction;
    private dateHeaderTemplateFn: CallbackFunction;
    private dateRangeTemplateFn: CallbackFunction;
    private dayHeaderTemplateFn: CallbackFunction;
    private monthHeaderTemplateFn: CallbackFunction;
    private majorSlotTemplateFn: CallbackFunction;
    private minorSlotTemplateFn: CallbackFunction;
    private appointmentTemplateFn: CallbackFunction;
    private eventTooltipTemplateFn: CallbackFunction;
    private headerTooltipTemplateFn: CallbackFunction;
    private editorTemplateFn: CallbackFunction;
    private editorHeaderTemplateFn: CallbackFunction;
    private editorFooterTemplateFn: CallbackFunction;
    private quickInfoTemplatesHeaderFn: CallbackFunction;
    private quickInfoTemplatesContentFn: CallbackFunction;
    private quickInfoTemplatesFooterFn: CallbackFunction;
    private resourceHeaderTemplateFn: CallbackFunction;
    private headerIndentTemplateFn: CallbackFunction;
    private defaultLocale: Record<string, any>;
    public dayModule: Day;
    public weekModule: Week;
    public workWeekModule: WorkWeek;
    public monthAgendaModule: MonthAgenda;
    public monthModule: Month;
    public yearModule: Year;
    public agendaModule: Agenda;
    public timelineViewsModule: TimelineViews;
    public timelineMonthModule: TimelineMonth;
    public timelineYearModule: TimelineYear;
    public resizeModule: Resize;
    public dragAndDropModule: DragAndDrop;
    public excelExportModule: ExcelExport;
    public printModule: Print;
    public viewOptions: { [key: string]: ViewsData[] };
    public viewCollections: ViewsData[];
    public viewIndex: number;
    public activeViewOptions: ViewsData;
    public eventFields: EventFieldsMapping;
    public editorTitles: EventFieldsMapping;
    public eventsData: Record<string, any>[];
    public eventsProcessed: Record<string, any>[];
    public overlapAppointments: Record<string, any>[];
    public blockData: Record<string, any>[];
    public blockProcessed: Record<string, any>[];
    public resourceCollection: ResourcesModel[];
    public currentAction: CurrentAction;
    public quickPopup: QuickPopups;
    public selectedElements: Element[];
    public uiStateValues: UIStateArgs;
    public internalTimeFormat: string;
    public calendarUtil: CalendarUtil;
    public scrollTop: number;
    public scrollLeft: number;
    public isPrinting: boolean;
    public registeredTemplate: Object;
    public adaptiveGroupIndex: number = 0;
    public activeEventTemplates: string[];

    // Schedule Options
    /**
     * Sets the `width` of the Schedule component, accepting both string and number values.
     *
     * {% codeBlock src='schedule/width/index.md' %}{% endcodeBlock %}
     *
     * The string value can be either pixel or percentage format.
     * When set to `auto`, the Schedule width gets auto-adjusted and display its content related to the viewable screen size.
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;

    /**
     * Sets the `height` of the Schedule component, accepting both string and number values.
     *
     * {% codeBlock src='schedule/height/index.md' %}{% endcodeBlock %}
     *
     * The string type includes either pixel or percentage values.
     * When `height` is set with specific pixel value, then the Schedule will be rendered to that specified space.
     * In case, if `auto` value is set, then the height of the Schedule gets auto-adjusted within the given container.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;

    /**
     * When set to `false`, hides the header bar of the Schedule from UI. By default,
     * the header bar holds the date and view navigation options, to which the user can add their own custom items onto it.
     *
     * @default true
     */
    @Property(true)
    public showHeaderBar: boolean;

    /**
     * When set to `false`, hides the current time indicator from the Schedule. Otherwise,
     * it visually depicts the live current system time appropriately on the user interface.
     *
     * @default true
     */
    @Property(true)
    public showTimeIndicator: boolean;

    /**
     * Defines whether to enable date navigations via swipe in touch devices or not.
     *
     * @default true
     */
    @Property(true)
    public allowSwiping: boolean;

    /**
     * Specifies whether overlapping appointments are allowed within the same time slot in the Scheduler.
     *
     * @remarks
     * When set to `false`, the Scheduler enforces restrictions to prevent creating or displaying overlapping appointments within the same time duration.
     * This setting includes the following limitations:
     *
     * - **Initial Loading**: The alert for overlapping appointments will not display during the initial load. Overlapping events will be ignored in rendering, including occurrences.
     *
     * - **Dynamic Add/Edit**: When adding or editing events dynamically, overlapping validation is performed. If an overlap is detected for a single event, an alert will be shown, and the event will not be saved.
     *
     * For recurring events, an alert will be displayed, and the event will not be saved. To save recurring events while ignoring overlapping occurrences, trigger the `PopupOpen` event. The `Data` field will contain the parent recurrence data, and the `overlapEvents` field will contain the overlap events. Using these details, users can include exceptions in the recurrence events and save them with the `addEvent` method.
     *
     * - **Out-of-Date-Range Events**: The `allowOverlap` setting only prevents overlaps for events within the current view date range. To validate overlap events outside the current date range, use the `actionBegin` event to send a request to the server for validation and return a promise-based response. Assign this promise response to the `promise` field in `ActionEventArgs` to handle asynchronous server validation.
     *
     * @default true
     */
    @Property(true)
    public allowOverlap: boolean;

    /**
     * Specifies the number of additional rows or columns to render outside the visible area during virtual scrolling.
     * This property helps in achieving smoother scrolling by pre-loading data just outside the visible region.
     *
     * @remarks
     * The default value is 3. Increasing this value can result in smoother scrolling but may impact performance
     * with larger datasets. Decreasing it can improve performance but may cause more frequent data fetches during scrolling.
     * This property only takes effect when `allowVirtualScrolling` is enabled for the current view.
     *
     * @default 3
     */
    @Property(3)
    public overscanCount: number;

    /**
     * To render the custom toolbar items, the `toolbarItems` property can be used. It contains built-in and custom toolbar items.
     * To avail the built-in toolbar items, the below string values are assigned to the `name` property of the `ToolbarItemModel`.
     * * `Previous`: Schedule component navigates to the previous date from the current date.
     * * `Next`: Schedule component navigates to the next date from the current date.
     * * `Today`: Schedule component navigates to the current date from any date.
     * * `Views`: Schedule component render the defined view options in the toolbar. If view option is not defined, then it will render default view options in the Schedule.
     * * `DateRangeText`: Schedule component displays the current date text range.
     * * `NewEvent`: Schedule component render the icon to add a new event.
     *
     * @default []
     */
    @Collection<ToolbarItemModel>([], ToolbarItem)
    public toolbarItems: ToolbarItemModel[]

    /**
     * To set the active view on scheduler, the `currentView` property can be used and it usually accepts either of the following available
     *  view options. The view option specified in this property will be initially loaded on the schedule.
     * * `Day`: Denotes Day view of the scheduler.
     * * `Week`: Denotes Week view of the scheduler.
     * * `WorkWeek`: Denotes Work Week view of the scheduler.
     * * `Month`: Denotes Month view of the scheduler.
     * * `Year`: Denotes Year view of the scheduler.
     * * `Agenda`: Denotes Agenda view of the scheduler.
     * * `MonthAgenda`: Denotes Month Agenda view of the scheduler.
     * * `TimelineDay`: Denotes Timeline Day view of the scheduler.
     * * `TimelineWeek`: Denotes Timeline Week view of the scheduler.
     * * `TimelineWorkWeek`: Denotes Timeline Work Week view of the scheduler.
     * * `TimelineMonth`: Denotes Timeline Month view of the scheduler.
     * * `TimelineYear`: Denotes Timeline Year view of the scheduler.
     *
     * {% codeBlock src='schedule/currentView/index.md' %}{% endcodeBlock %}
     *
     * @default 'Week'
     */
    @Property('Week')
    public currentView: View;

    /**
     * This property holds the views collection and its configurations. It accepts either the array of view names or the array of view
     * objects that holds different configurations for each views. By default,
     * Schedule displays all the views namely `Day`, `Week`, `Work Week`, `Month` and `Agenda`.
     *
     * Example for array of views:
     * {% codeBlock src="schedule/views/index.md" %}{% endcodeBlock %}
     *
     * Example for array of view objects:
     * {% codeBlock src='schedule/viewOption/index.md' %}{% endcodeBlock %}
     *
     * @default '["Day", "Week", "WorkWeek", "Month", "Agenda"]'
     */
    @Property(['Day', 'Week', 'WorkWeek', 'Month', 'Agenda'])
    public views: View[] | ViewsModel[];

    /**
     * To mark the active (current) date on the Schedule, `selectedDate` property can be defined.
     * Usually, it defaults to the current System date.
     *
     * {% codeBlock src='schedule/selectedDate/index.md' %}{% endcodeBlock %}
     *
     * @default 'new Date()'
     * @aspDefaultValue DateTime.Now
     */
    @Property(new Date())
    public selectedDate: Date;

    /**
     * To define the minimum date on the Schedule, `minDate` property can be defined.
     * Usually, it defaults to the new Date(1900, 0, 1).
     *
     * {% codeBlock src='schedule/minDate/index.md' %}{% endcodeBlock %}
     *
     * @default new Date(1900, 0, 1)
     * @aspDefaultValue new DateTime(1900, 1, 1)
     */
    @Property(new Date(1900, 0, 1))
    public minDate: Date;

    /**
     * To define the maximum date on the Schedule, `maxDate` property can be defined.
     * Usually, it defaults to the new Date(2099, 11, 31).
     *
     * {% codeBlock src='schedule/maxDate/index.md' %}{% endcodeBlock %}
     *
     * @default new Date(2099, 11, 31)
     * @aspDefaultValue new DateTime(2099, 12, 31)
     */
    @Property(new Date(2099, 11, 31))
    public maxDate: Date;

    /**
     * By default, Schedule follows the date-format as per the default culture assigned to it.
     * It is also possible to manually set specific date format by using the `dateFormat` property.
     *
     * {% codeBlock src='schedule/dateFormat/index.md' %}{% endcodeBlock %}
     *
     * The format of the date range label in the header bar depends on the `dateFormat` value or else based on the
     * locale assigned to the Schedule.
     *
     * @default null
     */
    @Property()
    public dateFormat: string;

    /**
     * It allows the Scheduler to display in other calendar modes.
     * By default, Scheduler is displayed in `Gregorian` calendar mode.
     *
     * {% codeBlock src='schedule/calendarMode/index.md' %}{% endcodeBlock %}
     *
     * To change the mode, you can set either `Gregorian` or `Islamic` as a value to this `calendarMode` property.
     *
     * @default 'Gregorian'
     */
    @Property('Gregorian')
    public calendarMode: CalendarType;

    /**
     * When set to `false`, it hides the weekend days of a week from the Schedule. The days which are not defined in the working days
     * collection are usually treated as weekend days.
     *
     * Note: By default, this option is not applicable on `Work Week` view.
     * For example, if the working days are defined as [1, 2, 3, 4], then the remaining days of that week will be considered as
     *  the weekend days and will be hidden on all the views.
     *
     * @default true
     */
    @Property(true)
    public showWeekend: boolean;

    /**
     * This option allows the user to set the first day of a week on Schedule. It should be based on the locale set to it and each culture
     * defines its own first day of week values. If needed, the user can set it manually on his own by defining the value through
     * this property. It usually accepts the integer values, whereby 0 is always denoted as Sunday, 1 as Monday and so on.
     *
     * {% codeBlock src='schedule/firstDayOfWeek/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     */
    @Property(0)
    public firstDayOfWeek: number;

    /**
     * It allows the Scheduler to display week numbers based on following available week options. The week
     *  option specified in this property will be initially loaded on the schedule.
     * * `FirstDay`: Denotes that the first week of the year starts on the first day of the year and ends before the following designated first day of the week.
     * * `FirstFourDayWeek`:Denotes that the first week of the year is the first week with four or more days before the designated first day of the week.
     * * `FirstFullWeek`:  Denotes that the first week of the year begins on the first occurrence of the designated first day of the week on or after the first day of the year.
     *
     * {% codeBlock src='schedule/weekRule/index.md' %}{% endcodeBlock %}
     *
     * @default 'FirstDay'
     */
    @Property('FirstDay')
    public weekRule: WeekRule;

    /**
     * It is used to set the working days on Schedule. The only days that are defined in this collection will be rendered on the `workWeek`
     * view whereas on other views, it will display all the usual days and simply highlights the working days with different shade.
     *
     * {% codeBlock src='schedule/workDays/index.md' %}{% endcodeBlock %}
     *
     * @default '[1, 2, 3, 4, 5]'
     * @aspType int[]
     */
    @Property([1, 2, 3, 4, 5])
    public workDays: number[];

    /**
     * This option allows the user to set the number of months count to be displayed on the Schedule.
     *
     * {% codeBlock src='schedule/monthsCount/index.md' %}{% endcodeBlock %}
     *
     * @default 12
     * @aspType int
     */
    @Property(12)
    public monthsCount: number;

    /**
     * It is used to specify the starting hour, from which the Schedule starts to display. It accepts the time string in a short skeleton
     * format and also, hides the time beyond the specified start time.
     *
     * {% codeBlock src='schedule/startHour/index.md' %}{% endcodeBlock %}
     *
     * @default '00:00'
     */
    @Property('00:00')
    public startHour: string;

    /**
     * It is used to specify the end hour, at which the Schedule ends. It too accepts the time string in a short skeleton format.
     *
     * {% codeBlock src='schedule/endHour/index.md' %}{% endcodeBlock %}
     *
     * @default '24:00'
     */
    @Property('24:00')
    public endHour: string;

    /**
     * By default, Schedule follows the time-format as per the default culture assigned to it.
     * It is also possible to manually set specific time format by using the `timeFormat` property.
     *
     * {% codeBlock src='schedule/timeFormat/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public timeFormat: string;

    /**
     * Specifies whether to enable the rendering of untrusted HTML values in the Schedule component.
     * When this property is enabled, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;

    /**
     * When set to `true`, If valid, the scroll on the all day row is activated when the all day row
     * height reaches the max height when the all day row is expanded.
     *
     * @default false
     */
    @Property(false)
    public enableAllDayScroll: boolean;

    /**
     * When set to `true`, the header view navigations are listed under the popup and if we enable resource grouping, the compact view will be enabled.
     *
     * @default false
     */
    @Property(false)
    public enableAdaptiveUI: boolean;

    /**
     * When set to `true`, allows the resizing of appointments. It allows the rescheduling of appointments either by changing the
     * start or end time by dragging the event resize handlers.
     *
     * @default true
     */
    @Property(true)
    public allowResizing: boolean;

    /**
     * The working hours should be highlighted on Schedule with different color shade and an additional option must be provided to
     * highlight it or not. This functionality is handled through `workHours` property and the start work hour should be 9 AM by default
     * and end work hour should point to 6 PM. The start and end working hours needs to be provided as Time value of short skeleton type.
     *
     * {% codeBlock src='schedule/workHours/index.md' %}{% endcodeBlock %}
     *
     * @default { highlight: true, start: '09:00', end: '18:00' }
     */
    @Complex<WorkHoursModel>({}, WorkHours)
    public workHours: WorkHoursModel;

    /**
     * Allows to set different time duration on Schedule along with the customized grid count. It also has template option to
     *  customize the time slots with required time values in its own format.
     *
     * {% codeBlock src='schedule/timeScale/index.md' %}{% endcodeBlock %}
     *
     * @default { enable: true, interval: 60, slotCount: 2, majorSlotTemplate: null, minorSlotTemplate: null }
     */
    @Complex<TimeScaleModel>({}, TimeScale)
    public timeScale: TimeScaleModel;

    /**
     * When set to `true`, allows the keyboard interaction to take place on Schedule.
     *
     * @default true
     */
    @Property(true)
    public allowKeyboardInteraction: boolean;

    /**
     * When set to `true`, allows the appointments to move over the time slots. When an appointment is dragged, both its start
     * and end time tends to change simultaneously allowing it to reschedule the appointment on some other time.
     *
     * @default true
     */
    @Property(true)
    public allowDragAndDrop: boolean;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto
     * the date header cells. The field that can be accessed via this template is `date`.
     *
     * {% codeBlock src='schedule/dateHeaderTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public dateHeaderTemplate: string | Function;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto the header date range.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public dateRangeTemplate: string | Function;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto
     * the month date cells. This template is only applicable for month view day cells.
     *
     * {% codeBlock src='schedule/cellHeaderTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public cellHeaderTemplate: string | Function;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto
     * the day header cells. This template is only applicable for year view header cells.
     *
     * {% codeBlock src='schedule/dayHeaderTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public dayHeaderTemplate: string | Function;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto
     * the month header cells. This template is only applicable for year view header cells.
     *
     * {% codeBlock src='schedule/monthHeaderTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public monthHeaderTemplate: string | Function;

    /**
     * The template option which is used to render the customized work cells on the Schedule. Here, the template accepts either
     *  the string or HTMLElement as template design and then the parsed design is displayed onto the work cells.
     *  The fields accessible via template are as follows.
     * * `date`: Returns the date of the cell.
     * * `groupIndex`: Returns the group index of the cell.
     * * `type`: Returns the type of the work cell.
     *
     * Refer to the below code snippet.
     *
     * {% codeBlock src='schedule/cellTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public cellTemplate: string | Function;

    /**
     * When set to `true`, makes the Schedule to render in a read only mode. No CRUD actions will be allowed at this time.
     *
     * @default false
     */
    @Property(false)
    public readonly: boolean;

    /**
     * When set to `true`, displays a quick popup with cell or event details on single clicking over the cells or on events.
     * By default, it is set to `true`.
     *
     * @default true
     */
    @Property(true)
    public showQuickInfo: boolean;

    /**
     * This property helps user to add/edit the event in inline. By default, it is set to `false`.
     *
     * @default false
     */
    @Property(false)
    public allowInline: boolean;

    /**
     * This property helps user to allow/prevent the selection of multiple cells. By default, it is set to `true`.
     *
     * @default true
     */
    @Property(true)
    public allowMultiCellSelection: boolean;

    /**
     * This property helps user to allow/prevent the selection of multiple days(rows). By default, it is set to `true`.
     *
     * @default true
     */
    @Property(true)
    public allowMultiRowSelection: boolean;

    /**
     * This property helps to show quick popup after multiple cell selection. By default, it is set to `false`.
     *
     * @default false
     */
    @Property(false)
    public quickInfoOnSelectionEnd: boolean;

    /**
     * When set to `true`, displays the week number of the current view date range. By default, it is set to `false`.
     *
     * @default false
     */
    @Property(false)
    public showWeekNumber: boolean;

    /**
     * when set to `true`, allows the height of the work-cells to adjust automatically
     * based on the number of appointments present in those time ranges.
     *
     * @default false
     */
    @Property(false)
    public rowAutoHeight: boolean;

    /**
     * This property helps to drag the multiple selected events. By default, it is set to `false`.
     *
     * @default false
     */
    @Property(false)
    public allowMultiDrag: boolean;

    /**
     * This property helps render the year view customized months. By default, it is set to `0`.
     *
     * {% codeBlock src='schedule/firstMonthOfYear/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     */
    @Property(0)
    public firstMonthOfYear: number;

    /**
     * The template option to render the customized editor window. The form elements defined within this template should be accompanied
     *  with `e-field` class, so as to fetch and process it from internally.
     *
     * {% codeBlock src='schedule/editorTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public editorTemplate: string | Function;

    /**
     * The template option to render the customized header of the editor window.
     *
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public editorHeaderTemplate: string | Function;

    /**
     * The template option to render the customized footer of the editor window.
     *
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public editorFooterTemplate: string | Function;

    /**
     * The template option to customize the quick window. The three sections of the quick popup whereas the header, content,
     * and footer can be easily customized with individual template option.
     *
     * {% codeBlock src='schedule/quickInfoTemplates/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Complex<QuickInfoTemplatesModel>({}, QuickInfoTemplates)
    public quickInfoTemplates: QuickInfoTemplatesModel;

    /**
     * Sets the number of days to be displayed by default in Agenda View and in case of virtual scrolling,
     * the number of days will be fetched on each scroll-end based on this count.
     *
     * {% codeBlock src='schedule/agendaDaysCount/index.md' %}{% endcodeBlock %}
     *
     * @default 7
     */
    @Property(7)
    public agendaDaysCount: number;

    /**
     * The days which does not has even a single event to display will be hidden from the UI of Agenda View by default.
     * When this property is set to `false`, the empty dates will also be displayed on the Schedule.
     *
     * @default true
     */
    @Property(true)
    public hideEmptyAgendaDays: boolean;

    /**
     * The recurrence validation will be done by default. When this property is set to `false`, the recurrence validation will be skipped.
     *
     * @default true
     */
    @Property(true)
    public enableRecurrenceValidation: boolean;

    /**
     * Schedule will be assigned with specific timezone, so as to display the events in it accordingly. By default,
     * Schedule dates are processed with System timezone, as no timezone will be assigned specifically to the Schedule at the initial time.
     * Whenever the Schedule is bound to remote data services, it is always recommended to set specific timezone to Schedule to make the
     * events on it to display on the same time irrespective of the system timezone. It usually accepts
     * the valid [IANA](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) timezone names.
     *
     * {% codeBlock src='schedule/timezone/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property()
    public timezone: string;

    /**
     * Complete set of settings related to Schedule events to bind it to local or remote dataSource, map applicable database fields and
     * other validation to be carried out on the available fields.
     *
     * {% codeBlock src='schedule/eventSettings/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Complex<EventSettingsModel>({}, EventSettings)
    public eventSettings: EventSettingsModel;

    /**
     * Allows to define the collection of timezone items in the Schedule. Only the items bound to this property get listed out in the timezone dropdown of the appointment window.
     *
     * {% codeBlock src='schedule/timezoneDatasource/index.md' %}{% endcodeBlock %}
     *
     * @default timezoneData
     */
    @Property(timezoneData)
    public timezoneDataSource: TimezoneFields[];

    /**
     * Template option to customize the resource header bar. Here, the template accepts either
     *  the string or HTMLElement as template design and then the parsed design is displayed onto the resource header cells.
     * The following can be accessible via template.
     * * `resource` - All the resource fields.
     * * `resourceData` - Object collection of current resource.
     *
     * Refer to the below code snippet.
     *
     * {% codeBlock src='schedule/resourceHeaderTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public resourceHeaderTemplate: string | Function;

    /**
     * Template option to customize the header indent bar. Here, the template accepts either
     *  the string or HTMLElement as template design and then the parsed design is displayed onto the header indent cell.
     *
     * Refer to the below code snippet.
     *
     * {% codeBlock src='schedule/headerIndentTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public headerIndentTemplate: string | Function;

    /**
     * Allows defining the group related settings of multiple resources. When this property is non-empty, it means
     * that the resources will be grouped on the schedule layout based on the provided resource names.
     *
     * {% codeBlock src='schedule/group/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Complex<GroupModel>({}, Group)
    public group: GroupModel;

    /**
     * Allows defining the collection of resources to be displayed on the Schedule. The resource collection needs to be defined
     * with unique resource names to identify it along with the respective dataSource and field mapping options.
     *
     * {% codeBlock src='schedule/resources/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Collection<ResourcesModel>([], Resources)
    public resources: ResourcesModel[];

    /**
     * Allows defining the collection of custom header rows to display the year, month, week, date and hour label as an individual row
     * on the timeline view of the scheduler.
     *
     * {% codeBlock src='schedule/headerRows/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Collection<HeaderRowsModel>([], HeaderRows)
    public headerRows: HeaderRowsModel[];

    /**
     * It is used to customize the Schedule which accepts custom CSS class names that defines specific user-defined styles and themes
     * to be applied on the Schedule element.
     *
     * {% codeBlock src='schedule/cssClass/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property()
    public cssClass: string;

    /**
     * Enables clipboard functionality for appointments, allowing them to be copied using keyboard shortcuts and pasted onto the Scheduler.
     * When set to `true`, users can use keyboard shortcuts to cut, copy appointments and paste them into different time slots or calendars.
     *
     * @default false
     * @remarks The `allowKeyboardInteraction` property should be enabled to use the keyboard shortcuts.
     */
    @Property(false)
    public allowClipboard : boolean;

    /**
     * It enables the external drag and drop support for appointments on scheduler, to be able to move them out of the scheduler layout.
     * When the drag area is explicitly set with specific DOM element name, the appointments can be dragged anywhere within the specified drag area location.
     *
     * {% codeBlock src='schedule/eventDragArea/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property()
    public eventDragArea: string;

    /**
     * Triggers after the scheduler component is created.
     *
     * @event 'created'
     */
    @Event()
    public created: EmitType<Record<string, any>>;

    /**
     * Triggers when the scheduler component is destroyed.
     *
     * @event 'destroyed'
     */
    @Event()
    public destroyed: EmitType<Record<string, any>>;

    /**
     * Triggers when the scheduler cells are single clicked or on single tap on the same cells in mobile devices.
     *
     * @event 'cellClick'
     */
    @Event()
    public cellClick: EmitType<CellClickEventArgs>;

    /**
     * Triggers when the scheduler cells are double clicked.
     *
     * @event 'cellDoubleClick'
     */
    @Event()
    public cellDoubleClick: EmitType<CellClickEventArgs>;

    /**
     * Triggers when the more events indicator are clicked.
     *
     * @event 'moreEventsClick'
     */
    @Event()
    public moreEventsClick: EmitType<MoreEventsClickArgs>;

    /**
     * Triggers when the scheduler elements are hovered.
     *
     * @event 'hover'
     */
    @Event()
    public hover: EmitType<HoverEventArgs>;

    /**
     * Triggers when multiple cells or events are selected on the Scheduler.
     *
     * @event 'select'
     */
    @Event()
    public select: EmitType<SelectEventArgs>;

    /**
     * Triggers on beginning of every scheduler action.
     *
     * @event 'actionBegin'
     */
    @Event()
    public actionBegin: EmitType<ActionEventArgs>;

    /**
     * Triggers on successful completion of the scheduler actions.
     *
     * @event 'actionComplete'
     */
    @Event()
    public actionComplete: EmitType<ActionEventArgs>;

    /**
     * Triggers when a scheduler action gets failed or interrupted and an error information will be returned.
     *
     * @event 'actionFailure'
     */
    @Event()
    public actionFailure: EmitType<ActionEventArgs>;

    /**
     * Triggers before the date or view navigation takes place on scheduler.
     *
     * @event 'navigating'
     */
    @Event()
    public navigating: EmitType<NavigatingEventArgs>;

    /**
     * Triggers before each element of the schedule rendering on the page.
     *
     * @event 'renderCell'
     */
    @Event()
    public renderCell: EmitType<RenderCellEventArgs>;

    /**
     * Triggers when the events are single clicked or on single tapping the events on the mobile devices.
     *
     * @event 'eventClick'
     */
    @Event()
    public eventClick: EmitType<EventClickArgs>;

    /**
     * Triggers when the events are double clicked or on double tapping the events on the desktop devices.
     *
     * @event 'eventDoubleClick'
     */
    @Event()
    public eventDoubleClick: EmitType<EventClickArgs>;

    /**
     * Triggers before each of the event getting rendered on the scheduler user interface.
     *
     * @event 'eventRendered'
     */
    @Event()
    public eventRendered: EmitType<EventRenderedArgs>;

    /**
     * Triggers before the data binds to the scheduler.
     *
     * @event 'dataBinding'
     */
    @Event()
    public dataBinding: EmitType<ReturnType>;

    /**
     * Triggers before any of the scheduler popups opens on the page.
     *
     * @event 'popupOpen'
     */
    @Event()
    public popupOpen: EmitType<PopupOpenEventArgs>;

    /**
     * Triggers before any of the scheduler popups close on the page.
     *
     * @event 'popupClose'
     */
    @Event()
    public popupClose: EmitType<PopupCloseEventArgs>;

    /**
     * Triggers when an appointment is started to drag.
     *
     * @event 'dragStart'
     */
    @Event()
    public dragStart: EmitType<DragEventArgs>;

    /**
     * Triggers when an appointment is being in a dragged state.
     *
     * @event 'drag'
     */
    @Event()
    public drag: EmitType<DragEventArgs>;

    /**
     * Triggers when the dragging of appointment is stopped.
     *
     * @event 'dragStop'
     */
    @Event()
    public dragStop: EmitType<DragEventArgs>;

    /**
     * Triggers when an appointment is started to resize.
     *
     * @event 'resizeStart'
     */
    @Event()
    public resizeStart: EmitType<ResizeEventArgs>;

    /**
     * Triggers when an appointment is being in a resizing action.
     *
     * @event 'resizing'
     */
    @Event()
    public resizing: EmitType<ResizeEventArgs>;

    /**
     * Triggers when the resizing of appointment is stopped.
     *
     * @event 'resizeStop'
     */
    @Event()
    public resizeStop: EmitType<ResizeEventArgs>;

    /**
     * Triggers when the scroll action is started.
     * This event triggers only when `allowVirtualScrolling` or `enableLazyLoading` properties are enabled along with resource grouping.
     *
     * @event 'virtualScrollStart'
     */
    @Event()
    public virtualScrollStart: EmitType<ScrollEventArgs>;

    /**
     * Triggers when the scroll action is stopped.
     * This event triggers only when `allowVirtualScrolling` or `enableLazyLoading` properties are enabled along with resource grouping.
     *
     * @event 'virtualScrollStop'
     */
    @Event()
    public virtualScrollStop: EmitType<ScrollEventArgs>;

    /**
     * Triggers once the event data is bound to the scheduler.
     *
     * @event 'dataBound'
     */
    @Event()
    public dataBound: EmitType<ReturnType>;

    /**
     * Triggers once when pasting an event on the scheduler.
     *
     * @event 'beforePaste'
     */
    @Event()
    public beforePaste : EmitType<BeforePasteEventArgs>;

    /**
     * Triggers when the print event is called.
     *
     * @event 'beforePrint'
     */
    @Event()
    public beforePrint: EmitType<BeforePrintEventArgs>;

    /**
     * Triggers before the Excel export process begins.
     *
     * @event 'excelExport'
     */
    @Event()
    public excelExport: EmitType<ExcelExportEventArgs>;

    /**
     * Triggers before the tooltip is rendered.
     *
     * @event 'tooltipOpen'
     */
    @Event()
    public tooltipOpen: EmitType<TooltipOpenEventArgs>;


    /**
     * Constructor for creating the Schedule widget
     *
     * @param {ScheduleModel} options Accepts the schedule model properties to initiate the rendering
     * @param {string | HTMLElement} element Accepts the DOM element reference
     */
    constructor(options?: ScheduleModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Core method that initializes the control rendering.
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        const addClasses: string[] = [];
        const removeClasses: string[] = [];
        addClasses.push(cls.ROOT);
        if (this.enableRtl) {
            addClasses.push(cls.RTL);
        } else {
            removeClasses.push(cls.RTL);
        }
        if (this.isAdaptive) {
            addClasses.push(cls.DEVICE_CLASS);
        } else {
            removeClasses.push(cls.DEVICE_CLASS);
        }
        if (this.enableAdaptiveUI) {
            addClasses.push(cls.ADAPTIVE_CLASS);
        } else {
            removeClasses.push(cls.ADAPTIVE_CLASS);
        }
        if (this.allowMultiDrag) {
            addClasses.push(cls.MULTI_DRAG);
        } else {
            removeClasses.push(cls.MULTI_DRAG);
        }
        if (this.cssClass) {
            const cssClass: string[] = this.cssClass.split(' ');
            for (const cls of cssClass) {
                addClasses.push(cls);
            }
        }
        classList(this.element, addClasses, removeClasses);
        this.validateDate();
        createSpinner({ target: this.element });
        this.scrollModule = new Scroll(this);
        this.scrollModule.setWidth();
        this.scrollModule.setHeight();
        this.renderModule = new Render(this);
        this.eventBase = new EventBase(this);
        this.workCellAction = new WorkCellInteraction(this);
        if (this.allowKeyboardInteraction) {
            this.keyboardInteractionModule = new KeyboardInteraction(this);
        }
        this.inlineModule = new InlineEdit(this);
        this.initializeDataModule();
        this.renderTableContainer();
        this.activeViewOptions = this.getActiveViewOptions();
        this.initializeResources();
        this.wireEvents();
    }

    private renderTableContainer(): void {
        if (!this.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS)) {
            this.element.appendChild(this.createElement('div', { className: cls.TABLE_CONTAINER_CLASS }));
        }
    }

    public getEventTemplateName(resIndex: number): string {
        const templateName: string = 'eventTemplate_' + resIndex;
        if (this.activeEventTemplates.indexOf(templateName) < 0) {
            this.activeEventTemplates.push(templateName);
        }
        return templateName;
    }

    /**
     * Method to get element width
     *
     * @param {HTMLElement} element Accepts the DOM element
     * @returns {number} Returns the width of the given element
     * @private
     */
    public getElementWidth(element: HTMLElement): number {
        return util.getElementWidth(element, this.uiStateValues.isTransformed);
    }

    /**
     * Method to get element height
     *
     * @param {HTMLElement} element Accepts the DOM element
     * @returns {number} Returns the Height of the given element
     * @private
     */
    public getElementHeight(element: HTMLElement): number {
        return util.getElementHeight(element, this.uiStateValues.isTransformed);
    }

    /**
     * Method to get height from element
     *
     * @param {Element} element Accepts the DOM element
     * @param {string} elementClass Accepts the element class
     * @returns {number} Returns the height of the element
     * @private
     */
    public getElementHeightFromClass(element: Element, elementClass: string): number {
        return util.getElementHeightFromClass(element, elementClass, this.uiStateValues.isTransformed);
    }

    /**
     * Method to render react templates
     *
     * @param {Function} callback - Specifies the callBack method
     * @returns {void}
     * @private
     */
    public renderTemplates(callback?: Function): void {
        if ((this as any).isReact) {
            this.renderReactTemplates(callback);
        } else if (callback) {
            callback();
        }
    }

    /**
     * Method to reset react templates
     *
     * @param {string[]} templates Accepts the template ID
     * @returns {void}
     * @private
     */
    public resetTemplates(templates?: string[]): void {
        if ((this as any).isAngular || (this as any).isReact) {
            this.clearTemplate(templates);
        }
    }

    /**
     * This method renders untrusted strings and scripts securely by sanitizing them first.
     *
     * @param {string} value - A string value representing the HTML string value to be sanitized.
     * @param {HTMLElement} element - An HTML element to which the sanitized or unsanitized HTML string will be assigned.
     * @returns {void}
     * @private
     */
    public sanitize(value: string, element: HTMLElement): void {
        if (this.enableHtmlSanitizer) {
            element.innerText = SanitizeHtmlHelper.sanitize(value);
        } else {
            element.innerHTML = value;
        }
    }

    private initializeResources(isSetModel: boolean = false): void {
        if (this.resources.length > 0) {
            this.resourceBase = new ResourceBase(this);
            this.resourceBase.bindResourcesData(isSetModel);
        } else {
            this.resourceBase = null;
            this.resourceCollection = [];
            this.renderElements(isSetModel);
        }
    }

    private destroyEditorWindow(): void {
        if (this.eventWindow) {
            this.eventWindow.destroy();
            this.eventWindow = null;
        }
        this.eventWindow = new EventWindow(this);
    }

    /**
     * Method to render the layout elements
     *
     * @param {boolean} isLayoutOnly Accepts the boolean value to render layout or not
     * @returns {void}
     * @private
     */
    public renderElements(isLayoutOnly: boolean): void {
        if (isLayoutOnly) {
            this.initializeView(this.currentView);
            this.eventWindow.refresh();
            return;
        }
        this.destroyHeaderModule();
        if (this.showHeaderBar) {
            this.headerModule = new HeaderRenderer(this);
        }
        this.renderTableContainer();
        this.uiStateValues.isTransformed = Math.round(this.element.getBoundingClientRect().width) !== this.element.offsetWidth;
        if (Browser.isDevice || Browser.isTouch) {
            this.scheduleTouchModule = new ScheduleTouch(this);
        }
        this.initializeView(this.currentView);
        this.destroyPopups();
        if (!this.isPrinting) {
            this.initializePopups();
        }
    }

    private validateDate(selectedDate: Date = this.selectedDate): void {
        // persist the selected date value
        let date: Date = selectedDate instanceof Date ? new Date(selectedDate.getTime()) : new Date(selectedDate);
        const minDate: Date = isNullOrUndefined(this.minDate) ? new Date(1900, 0, 1) :
            this.minDate instanceof Date ? new Date(this.minDate.getTime()) : new Date(this.minDate);
        const maxDate: Date = isNullOrUndefined(this.maxDate) ? new Date(2099, 11, 31) :
            this.maxDate instanceof Date ? new Date(this.maxDate.getTime()) : new Date(this.maxDate);
        if (minDate <= maxDate) {
            if (date < minDate) {
                date = minDate;
            }
            if (date > maxDate) {
                date = maxDate;
            }
            this.setProperties({ selectedDate: new Date('' + date), minDate: new Date('' + minDate), maxDate: new Date('' + maxDate) }, true);
            if (this.eventWindow) {
                this.eventWindow.updateMinMaxDateToEditor();
            }
        } else {
            throw Error('minDate should be equal or less than maxDate');
        }
    }

    private getViewIndex(viewName: View): number {
        for (let item: number = 0; item < this.viewCollections.length; item++) {
            const checkIndex: View = this.viewCollections[parseInt(item.toString(), 10)].option;
            if (checkIndex === viewName) {
                return item;
            }
        }
        return -1;
    }

    private setViewOptions(isModuleLoad: boolean = false): void {
        if (isNullOrUndefined(this.views) || this.views.length === 0) {
            return;
        }
        this.viewOptions = {};
        this.viewCollections = [];
        let viewName: string;
        let selectedView: string;
        const prevIndex: number = this.viewIndex;
        let count: number = 0;
        this.viewIndex = -1;
        for (const view of this.views) {
            const isOptions: boolean = (typeof view === 'string') ? false : true;
            if (typeof view === 'string') {
                viewName = view;
                if (this.currentView === viewName) {
                    selectedView = viewName;
                    this.viewIndex = count;
                }
            } else {
                viewName = view.option;
                if (view.isSelected) {
                    selectedView = viewName;
                    this.viewIndex = count;
                }
            }
            const obj: ViewsData = extend({ option: viewName }, isOptions ? view : {});
            const fieldViewName: string = viewName.charAt(0).toLowerCase() + viewName.slice(1);
            obj.cellHeaderTemplateName = obj.cellHeaderTemplate ? obj.option : '';
            obj.dateHeaderTemplateName = obj.dateHeaderTemplate ? obj.option : '';
            obj.dateRangeTemplateName = obj.dateRangeTemplate ? obj.option : '';
            obj.cellTemplateName = obj.cellTemplate ? obj.option : '';
            obj.dayHeaderTemplateName = obj.dayHeaderTemplate ? obj.option : '';
            obj.monthHeaderTemplateName = obj.monthHeaderTemplate ? obj.option : '';
            obj.resourceHeaderTemplateName = obj.resourceHeaderTemplate ? obj.option : '';
            obj.headerIndentTemplateName = obj.headerIndentTemplate ? obj.option : '';
            obj.eventTemplateName = obj.eventTemplate ? obj.option : '';
            if (!isNullOrUndefined(obj.firstDayOfWeek) && obj.firstDayOfWeek === 0) {
                delete obj.firstDayOfWeek;
            }
            if (!isNullOrUndefined(obj.interval) && obj.interval === 1) {
                delete obj.interval;
            }
            this.viewCollections.push(obj);
            if (isNullOrUndefined(this.viewOptions[`${fieldViewName}`])) {
                this.viewOptions[`${fieldViewName}`] = [obj];
            } else {
                this.viewOptions[`${fieldViewName}`].push(obj);
            }
            count++;
        }
        if (!isModuleLoad && selectedView) {
            this.setProperties({ currentView: selectedView }, true);
        }
        if (this.viewIndex === -1) {
            const currentIndex: number = this.getViewIndex(this.currentView);
            this.viewIndex = ((typeof this.views[0] !== 'string') && (!isNullOrUndefined(prevIndex) && prevIndex !== -1)) ? prevIndex :
                (currentIndex === -1) ? 0 : currentIndex;
        }
    }

    private getActiveViewOptions(): ViewsData {
        const timeScale: TimeScaleModel = {
            enable: this.timeScale.enable,
            interval: this.timeScale.interval,
            slotCount: this.timeScale.slotCount,
            majorSlotTemplate: this.timeScale.majorSlotTemplate,
            minorSlotTemplate: this.timeScale.minorSlotTemplate
        };
        const isYearView: boolean = this.viewCollections[this.viewIndex].option.indexOf('Year') > -1;
        const group: GroupModel = {
            byDate: isYearView ? false : this.group.byDate,
            byGroupID: this.group.byGroupID,
            allowGroupEdit: this.group.allowGroupEdit,
            resources: isNullOrUndefined(this.group.resources) ? [] : this.group.resources,
            headerTooltipTemplate: this.group.headerTooltipTemplate,
            enableCompactView: this.group.enableCompactView,
            hideNonWorkingDays: ['Day', 'Week', 'WorkWeek', 'Month'].indexOf(this.currentView)  > -1 ? this.group.hideNonWorkingDays : false
        };
        const workDays: number[] = this.viewCollections[this.viewIndex].workDays ? [] : this.workDays;
        const scheduleOptions: ViewsModel = {
            dateFormat: this.dateFormat,
            endHour: this.endHour,
            isSelected: false,
            option: null,
            readonly: this.readonly,
            startHour: this.startHour,
            allowVirtualScrolling: false,
            allowOverlap: this.allowOverlap,
            overscanCount: this.overscanCount,
            cellHeaderTemplate: this.cellHeaderTemplate,
            dayHeaderTemplate: this.dayHeaderTemplate,
            monthHeaderTemplate: this.monthHeaderTemplate,
            cellTemplate: this.cellTemplate,
            eventTemplate: this.eventSettings.template,
            dateHeaderTemplate: this.dateHeaderTemplate,
            dateRangeTemplate: this.dateRangeTemplate,
            resourceHeaderTemplate: this.resourceHeaderTemplate,
            headerIndentTemplate: this.headerIndentTemplate,
            firstMonthOfYear: this.firstMonthOfYear,
            firstDayOfWeek: this.firstDayOfWeek,
            workDays: workDays,
            monthsCount: this.monthsCount,
            showWeekend: this.showWeekend,
            showWeekNumber: this.showWeekNumber,
            displayName: null,
            interval: 1,
            timeScale: timeScale,
            timeFormat: this.internalTimeFormat,
            group: group,
            headerRows: this.headerRows,
            orientation: 'Horizontal',
            numberOfWeeks: 0,
            displayDate: null,
            enableLazyLoading: false
        };
        const viewOptions: ViewsData = this.viewCollections[this.viewIndex];
        const viewsData: ViewsData = extend(scheduleOptions, viewOptions, undefined, true);
        if (this.firstDayOfWeek !== 0 && viewOptions.firstDayOfWeek && this.firstDayOfWeek !== viewOptions.firstDayOfWeek) {
            viewsData.firstDayOfWeek = this.firstDayOfWeek;
        }
        if (viewsData.displayDate) {
            viewsData.displayDate = viewsData.displayDate instanceof Date ? new Date(viewsData.displayDate.getTime()) :
                new Date(viewsData.displayDate);
        }
        if (viewsData.enableLazyLoading && !isNullOrUndefined(viewsData.group.resources) && viewsData.group.resources.length > 0 &&
        (['Agenda', 'MonthAgenda', 'Year', 'TimelineYear'].indexOf(viewsData.option) === -1 ||
        (viewsData.option === 'TimelineYear' && viewsData.orientation === 'Vertical'))) {
            viewsData.allowVirtualScrolling = true;
        }
        return viewsData;
    }

    private initializeDataModule(): void {
        this.eventFields = {
            id: this.eventSettings.fields.id,
            isBlock: this.eventSettings.fields.isBlock,
            subject: this.eventSettings.fields.subject.name,
            startTime: this.eventSettings.fields.startTime.name,
            endTime: this.eventSettings.fields.endTime.name,
            startTimezone: this.eventSettings.fields.startTimezone.name,
            endTimezone: this.eventSettings.fields.endTimezone.name,
            location: this.eventSettings.fields.location.name,
            description: this.eventSettings.fields.description.name,
            isAllDay: this.eventSettings.fields.isAllDay.name,
            recurrenceID: this.eventSettings.fields.recurrenceID.name,
            recurrenceRule: this.eventSettings.fields.recurrenceRule.name,
            recurrenceException: this.eventSettings.fields.recurrenceException.name,
            isReadonly: this.eventSettings.fields.isReadonly,
            followingID: this.eventSettings.fields.followingID
        };
        this.setEditorTitles();
        this.dataModule = new Data(this, this.eventSettings.dataSource, this.eventSettings.query);
        this.crudModule = new Crud(this);
    }

    private setEditorTitles(): void {
        this.editorTitles = {
            subject: this.eventSettings.fields.subject.title || this.localeObj.getConstant('title'),
            startTime: this.eventSettings.fields.startTime.title || this.localeObj.getConstant('start'),
            endTime: this.eventSettings.fields.endTime.title || this.localeObj.getConstant('end'),
            isAllDay: this.eventSettings.fields.isAllDay.title || this.localeObj.getConstant('allDay'),
            startTimezone: this.eventSettings.fields.startTimezone.title || this.localeObj.getConstant('startTimezone'),
            endTimezone: this.eventSettings.fields.endTimezone.title || this.localeObj.getConstant('endTimezone'),
            location: this.eventSettings.fields.location.title || this.localeObj.getConstant('location'),
            description: this.eventSettings.fields.description.title || this.localeObj.getConstant('description'),
            recurrenceRule: this.eventSettings.fields.recurrenceRule.title || this.localeObj.getConstant('repeat')
        };
    }

    private initializeView(viewName: View): void {
        this.showSpinner();
        this.activeViewOptions = this.getActiveViewOptions();
        if (this.resourceBase) {
            this.resourceBase.setResourceCollection();
        }
        this.initializeTemplates();
        this.renderModule.render(viewName);
    }

    private initializeTemplates(): void {
        this.cellHeaderTemplateFn = this.templateParser(this.activeViewOptions.cellHeaderTemplate);
        this.dayHeaderTemplateFn = this.templateParser(this.activeViewOptions.dayHeaderTemplate);
        this.monthHeaderTemplateFn = this.templateParser(this.activeViewOptions.monthHeaderTemplate);
        this.cellTemplateFn = this.templateParser(this.activeViewOptions.cellTemplate);
        this.dateHeaderTemplateFn = this.templateParser(this.activeViewOptions.dateHeaderTemplate);
        this.dateRangeTemplateFn = this.templateParser(this.activeViewOptions.dateRangeTemplate);
        this.majorSlotTemplateFn = this.templateParser(this.activeViewOptions.timeScale.majorSlotTemplate);
        this.minorSlotTemplateFn = this.templateParser(this.activeViewOptions.timeScale.minorSlotTemplate);
        this.appointmentTemplateFn = this.templateParser(this.activeViewOptions.eventTemplate);
        this.resourceHeaderTemplateFn = this.templateParser(this.activeViewOptions.resourceHeaderTemplate);
        this.headerIndentTemplateFn = this.templateParser(this.activeViewOptions.headerIndentTemplate);
        this.headerTooltipTemplateFn = this.templateParser(this.activeViewOptions.group.headerTooltipTemplate);
        this.eventTooltipTemplateFn = this.templateParser(this.eventSettings.tooltipTemplate);
        this.editorTemplateFn = this.templateParser(this.editorTemplate);
        this.editorHeaderTemplateFn = this.templateParser(this.editorHeaderTemplate);
        this.editorFooterTemplateFn = this.templateParser(this.editorFooterTemplate);
        this.quickInfoTemplatesHeaderFn = this.templateParser(this.quickInfoTemplates.header);
        this.quickInfoTemplatesContentFn = this.templateParser(this.quickInfoTemplates.content);
        this.quickInfoTemplatesFooterFn = this.templateParser(this.quickInfoTemplates.footer);
    }

    private initializePopups(): void {
        this.eventWindow = new EventWindow(this);
        this.quickPopup = new QuickPopups(this);
    }

    /**
     * Method to get day names
     *
     * @param {string} type Accepts the day name
     * @returns {string[]} Returns the collection of day names
     * @private
     */
    public getDayNames(type: string): string[] {
        const culShortNames: string[] = [];
        let cldrObj: string[];
        let nameSpace: string = '';
        if (isNullOrUndefined(this.locale) || this.locale === 'en' || this.locale === 'en-US') {
            nameSpace = 'days.stand-alone.';
            cldrObj = <string[]>(getValue(nameSpace + type, getDefaultDateObject(this.getCalendarMode())));
        } else {
            nameSpace = 'main.' + '' + this.locale + '.dates.calendars.' + this.getCalendarMode() + '.days.format.' + type;
            cldrObj = <string[]>(getValue(nameSpace, cldrData));
        }
        for (const obj of Object.keys(cldrObj)) {
            culShortNames.push(getValue(obj, cldrObj));
        }
        return culShortNames;
    }

    private setCldrTimeFormat(): void {
        if (!isNullOrUndefined(this.timeFormat)) {
            this.internalTimeFormat = this.timeFormat;
            return;
        }
        if (isNullOrUndefined(this.locale) || this.locale === 'en' || this.locale === 'en-US') {
            this.internalTimeFormat = <string>(getValue('timeFormats.short', getDefaultDateObject(this.getCalendarMode())));
        } else {
            this.internalTimeFormat = <string>
                (getValue('main.' + '' + this.locale + '.dates.calendars.' + this.getCalendarMode() + '.timeFormats.short', cldrData));
        }
    }

    /**
     * Method to get calendar mode
     *
     * @returns {string} Returns the calendar mode
     * @private
     */
    public getCalendarMode(): string {
        return !isNullOrUndefined(this.calendarMode) ? this.calendarMode.toLowerCase() : 'gregorian';
    }

    /**
     * Method to get time in string
     *
     * @param {Date} date Accepts the date object
     * @returns {string} Returns the time in string
     * @private
     */
    public getTimeString(date: Date): string {
        const time: string = this.globalize.formatDate(date, {
            format: this.activeViewOptions.timeFormat,
            type: 'time', calendar: this.getCalendarMode()
        });
        return time.toLocaleUpperCase();
    }

    /**
     * Method to get  date object
     *
     * @param {Date} date Accepts the date object
     * @returns {Date} Returns the date object
     * @private
     */
    public getDateTime(date: Date): Date {
        return date instanceof Date ? new Date(date.getTime()) : new Date(date);
    }

    private setCalendarMode(): void {
        if (this.calendarMode === 'Islamic') {
            this.calendarUtil = new Islamic();
        } else {
            this.calendarUtil = new Gregorian();
        }
    }

    /**
     * Method to change the current view
     *
     * @param {View} view Accepts the view name
     * @param {Event} event Accepts the event object
     * @param {boolean} muteOnChange Accepts the value to enable or disable mute on change
     * @param {number} index Accepts the index value
     * @returns {void}
     * @private
     */
    public changeView(view: View, event?: Event, muteOnChange?: boolean, index?: number): void {
        if (isNullOrUndefined(index)) {
            index = this.getViewIndex(view);
        }
        if (!muteOnChange && index === this.viewIndex && this.currentView === view || index < 0) {
            return;
        }
        const previousView: View = this.activeViewOptions ? this.activeViewOptions.option : this.currentView;
        let args: ActionEventArgs = { requestType: 'viewNavigate', cancel: false, event: event };
        this.trigger(events.actionBegin, args, (actionArgs: ActionEventArgs) => {
            if (!actionArgs.cancel) {
                const navArgs: NavigatingEventArgs = {
                    action: 'view', cancel: false, currentDate: this.selectedDate, previousView: previousView, currentView: view, viewIndex: index
                };
                this.trigger(events.navigating, navArgs, (navigationArgs: NavigatingEventArgs) => {
                    if (!navigationArgs.cancel) {
                        const isVertical: boolean = ['Day', 'Week', 'WorkWeek'].indexOf(view) > -1 && ['Day', 'Week', 'WorkWeek'].indexOf(previousView) < 0;
                        this.uiStateValues.isInitial = isVertical || view.indexOf('Timeline') > -1 || view.indexOf('Year') > -1;
                        this.uiStateValues.top = view.indexOf('Timeline') > -1 && previousView.indexOf('Timeline') < 0 ? 0 : this.uiStateValues.top;
                        this.viewIndex = navigationArgs.viewIndex;
                        this.setProperties({ currentView: view }, true);
                        if (this.headerModule) {
                            this.headerModule.updateActiveView();
                            this.headerModule.setCalendarDate(this.selectedDate);
                            this.headerModule.setCalendarView();
                        }
                        this.initializeView(this.currentView);
                        this.animateLayout();
                        args = { requestType: 'viewNavigate', cancel: false, event: event };
                        this.trigger(events.actionComplete, args);
                    } else {
                        this.currentView = previousView;
                    }
                });
            } else {
                this.currentView = previousView;
            }
        });
    }

    /**
     * Method to change the view date
     *
     * @param {Date} selectedDate Accepts the selected date
     * @param {Event} event Accepts the event object
     * @returns {void}
     * @private
     */
    public changeDate(selectedDate: Date, event?: Event): void {
        let args: ActionEventArgs = { requestType: 'dateNavigate', cancel: false, event: event };
        this.trigger(events.actionBegin, args, (actionArgs: ActionEventArgs) => {
            if (!actionArgs.cancel) {
                const navArgs: NavigatingEventArgs = {
                    action: 'date', cancel: false, previousDate: this.selectedDate, currentDate: selectedDate
                };
                this.trigger(events.navigating, navArgs, (navigationArgs: NavigatingEventArgs) => {
                    if (!navigationArgs.cancel) {
                        this.uiStateValues.isInitial = this.activeView.isTimelineView() && this.currentView !== 'TimelineYear';
                        this.validateDate(navigationArgs.currentDate);
                        if (this.headerModule) {
                            this.headerModule.setCalendarDate(navigationArgs.currentDate);
                        }
                        if (this.currentView === 'MonthAgenda' && this.monthAgendaModule) {
                            this.monthAgendaModule.monthAgendaDate = new Date('' + this.selectedDate);
                        }
                        this.initializeView(this.currentView);
                        this.animateLayout();
                        args = { requestType: 'dateNavigate', cancel: false, event: event };
                        this.trigger(events.actionComplete, args);
                    }
                });
            }
        });
    }

    /**
     * Method to validate min and max date
     *
     * @param {Date} date Accepts the date object
     * @returns {boolean} Returns the boolean result to validate the min and max date
     * @private
     */
    public isMinMaxDate(date: Date = this.selectedDate): boolean {
        const maxDate: Date = isNullOrUndefined(this.maxDate) ? new Date(2099, 11, 31) : this.maxDate;
        const minDate: Date = isNullOrUndefined(this.minDate) ? new Date(1900, 0, 1) : this.minDate;
        return ((date.getTime() >= minDate.getTime()) && (date.getTime() <= maxDate.getTime()));
    }

    /**
     * Method to validate the selected date
     *
     * @param {Date} date Accepts the date object
     * @returns {boolean} Returns the boolean value for given date is selected date or not
     * @private
     */
    public isSelectedDate(date: Date): boolean {
        return date.setHours(0, 0, 0, 0) === new Date('' + this.selectedDate).setHours(0, 0, 0, 0);
    }

    /**
     * Method to get the current time
     *
     * @param {Date} date Accepts the date object
     * @returns {Date} Returns the date object after performing the timezone conversion
     * @private
     */
    public getCurrentTime(date: Date = new Date()): Date {
        if (this.timezone) {
            return this.tzModule.convert(date, this.tzModule.getLocalTimezoneName(), this.timezone);
        }
        return date;
    }

    /** Method to get navigate view
     *
     * @returns {View} Return the navigate view name
     * @private
     */
    public getNavigateView(): View {
        if (this.activeView.isTimelineView()) {
            return this.currentView === 'TimelineMonth' || this.currentView === 'TimelineYear' ? 'TimelineDay' : 'Agenda';
        }
        return 'Day';
    }

    private animateLayout(): void {
        if (!this.activeView.element) {
            return;
        }
        new Animation({ duration: 600, name: 'FadeIn', timingFunction: 'easeIn' }).animate(this.activeView.element);
    }

    /**
     * To provide the array of modules needed for control rendering
     *
     * @returns {ModuleDeclaration[]} Returns the declared modules
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        this.setViewOptions(true);
        for (let view of Object.keys(this.viewOptions)) {
            view = (view === 'timelineDay' || view === 'timelineWeek' || view === 'timelineWorkWeek') ? 'timelineViews' : view;
            modules.push({ member: view, args: [this] });
        }
        if (this.allowDragAndDrop) {
            modules.push({ member: 'dragAndDrop', args: [this] });
        }
        if (this.allowResizing) {
            modules.push({ member: 'resize', args: [this] });
        }
        modules.push({ member: 'excelExport', args: [this] });
        modules.push({ member: 'iCalendarExport', args: [this] });
        modules.push({ member: 'iCalendarImport', args: [this] });
        modules.push({ member: 'print', args: [this] });
        return modules;
    }

    /**
     * Initializes the values of private members.
     *
     * @returns {void}
     * @private
     */
    protected preRender(): void {
        this.isAdaptive = Browser.isDevice as boolean || util.isIPadDevice();
        this.globalize = new Internationalization(this.locale);
        this.tzModule = new Timezone();
        if (this && isNullOrUndefined(this.uiStateValues) || !(this.enablePersistence)) {
            this.uiStateValues = {
                expand: false, isInitial: true, left: 0, top: 0, isGroupAdaptive: false,
                isIgnoreOccurrence: false, groupIndex: this.adaptiveGroupIndex, action: false,
                isBlock: false, isCustomMonth: true, isPreventTimezone: false, isTransformed: false
            };
        }
        this.currentTimezoneDate = this.getCurrentTime();
        this.activeCellsData = {
            startTime: new Date(this.currentTimezoneDate),
            endTime: new Date(this.currentTimezoneDate),
            isAllDay: false
        };
        this.activeEventData = { event: undefined, element: undefined };
        this.getDefaultLocale();
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        this.setCldrTimeFormat();
        this.setCalendarMode();
        this.eventsData = [];
        this.eventsProcessed = [];
        this.blockData = [];
        this.blockProcessed = [];
        this.resourceCollection = [];
        this.currentAction = null;
        this.selectedElements = [];
        this.activeEventTemplates = [];
        this.setViewOptions();
    }

    private getDefaultLocale(): void {
        this.defaultLocale = {
            day: 'Day',
            week: 'Week',
            workWeek: 'Work Week',
            month: 'Month',
            year: 'Year',
            agenda: 'Agenda',
            weekAgenda: 'Week Agenda',
            workWeekAgenda: 'Work Week Agenda',
            monthAgenda: 'Month Agenda',
            today: 'Today',
            noEvents: 'No events',
            emptyContainer: 'There are no events scheduled on this day.',
            allDay: 'All day',
            start: 'Start',
            end: 'End',
            more: 'more',
            close: 'Close',
            cancel: 'Cancel',
            noTitle: '(No Title)',
            delete: 'Delete',
            deleteEvent: 'Delete Event',
            deleteMultipleEvent: 'Delete Multiple Events',
            selectedItems: 'Items selected',
            deleteSeries: 'Entire Series',
            edit: 'Edit',
            editSeries: 'Entire Series',
            editEvent: 'Edit Event',
            createEvent: 'Create',
            subject: 'Subject',
            addTitle: 'Add title',
            moreDetails: 'More Details',
            moreEvents: 'More Events',
            save: 'Save',
            editContent: 'How would you like to change the appointment in the series?',
            deleteContent: 'Are you sure you want to delete this event?',
            deleteMultipleContent: 'Are you sure you want to delete the selected events?',
            newEvent: 'New Event',
            title: 'Title',
            location: 'Location',
            description: 'Description',
            timezone: 'Timezone',
            startTimezone: 'Start Timezone',
            endTimezone: 'End Timezone',
            repeat: 'Repeat',
            saveButton: 'Save',
            cancelButton: 'Cancel',
            deleteButton: 'Delete',
            recurrence: 'Recurrence',
            wrongPattern: 'The recurrence pattern is not valid.',
            seriesChangeAlert: 'Do you want to cancel the changes made to specific ' +
                'instances of this series and match it to the whole series again?',
            createError: 'The duration of the event must be shorter than how frequently it occurs. ' +
                'Shorten the duration, or change the recurrence pattern in the recurrence event editor.',
            sameDayAlert: 'Two occurrences of the same event cannot occur on the same day.',
            occurenceAlert: 'Cannot reschedule an occurrence of the recurring appointment if it skips over ' +
                'a later occurrence of the same appointment.',
            editRecurrence: 'Edit Recurrence',
            recurringEvent: 'Recurring Event',
            repeats: 'Repeats',
            alert: 'Alert',
            startEndError: 'The selected end date occurs before the start date.',
            invalidDateError: 'The entered date value is invalid.',
            blockAlert: 'Events cannot be scheduled within the blocked time range.',
            overlapAlert: 'Events cannot be scheduled during the chosen time as it overlaps with another event.',
            ok: 'Ok',
            yes: 'Yes',
            no: 'No',
            of: 'of',
            occurrence: 'Occurrence',
            series: 'Series',
            previous: 'Previous',
            next: 'Next',
            timelineDay: 'Timeline Day',
            timelineWeek: 'Timeline Week',
            timelineWorkWeek: 'Timeline Work Week',
            timelineMonth: 'Timeline Month',
            timelineYear: 'Timeline Year',
            editFollowingEvent: 'Following Events',
            deleteTitle: 'Delete Event',
            editTitle: 'Edit Event',
            beginFrom: 'Begin From',
            endAt: 'Ends At',
            expandAllDaySection: 'Expand-all-day-section',
            collapseAllDaySection: 'Collapse-all-day-section',
            searchTimezone: 'Search Timezone',
            noRecords: 'No records found'
        };
    }

    private wireEvents(): void {
        EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', this.onScheduleResize, this);
        EventHandler.add(<HTMLElement & Window><unknown>window, 'orientationchange', this.onScheduleResize, this);
        EventHandler.add(document, Browser.touchStartEvent, this.onDocumentClick, this);
        if (this.allowClipboard) {
            EventHandler.add(document, 'paste', this.onDocumentPaste, this);
        }
    }

    /**
     * Method to remove selected class
     *
     * @returns {void}
     * @private
     */
    public removeSelectedClass(): void {
        const selectedCells: Element[] = this.getSelectedCells();
        for (const cell of selectedCells) {
            cell.removeAttribute('tabindex');
        }
        removeClass(selectedCells, cls.SELECTED_CELL_CLASS);
        if (this.keyboardInteractionModule && this.keyboardInteractionModule.selectedCells.length > 0) {
            this.keyboardInteractionModule.selectedCells = [];
        }
    }

    /**
     * Method to add selected class
     *
     * @param {HTMLTableCellElement[]} cells Accepts the collection of elements
     * @param {HTMLTableCellElement} focusCell Accepts the focus element
     * @param {boolean} isPreventScroll Accepts the boolean value to prevent scroll
     * @returns {void}
     * @private
     */
    public addSelectedClass(cells: HTMLTableCellElement[], focusCell: HTMLTableCellElement, isPreventScroll?: boolean): void {
        addClass(cells, cls.SELECTED_CELL_CLASS);
        if (focusCell) {
            focusCell.setAttribute('tabindex', '0');
            focusCell.focus({ preventScroll: isPreventScroll || false });
        }
    }

    /**
     * Method to select cell
     *
     * @param {HTMLElement | HTMLTableCellElement} element Accepts the select element
     * @returns {void}
     * @private
     */
    public selectCell(element: HTMLElement & HTMLTableCellElement): void {
        this.removeSelectedClass();
        this.addSelectedClass([element], element);
    }

    /**
     * Method to get all day row element
     *
     * @returns {Element} Returns the all day row element
     * @private
     */
    public getAllDayRow(): Element {
        return this.element.querySelector('.' + cls.ALLDAY_ROW_CLASS);
    }

    /**
     * Method to get content table element
     *
     * @returns {HTMLElement} Returns the content table element
     * @private
     */
    public getContentTable(): HTMLElement {
        return this.activeView.element.querySelector('.' + cls.CONTENT_TABLE_CLASS + ' tbody') as HTMLElement;
    }

    /**
     * Method to get all content table rows
     *
     * @returns {HTMLElement[]} Returns the content table rows
     * @private
     */
    public getTableRows(): HTMLElement[] {
        return [].slice.call(this.element.querySelectorAll('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr:not(.' + cls.HIDDEN_CLASS + ')'));
    }

    /**
     * Method to get work cell elements
     *
     * @returns {Element[]} Returns the all work cell elements
     * @private
     */
    public getWorkCellElements(): Element[] {
        return [].slice.call(this.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
    }

    /**
     * Method to get the index from date collection
     *
     * @param {Date[]} collection Accepts the collections of date
     * @param {Date} date Accepts the date object
     * @returns {number} Returns the index compared date with date collections
     * @private
     */
    public getIndexOfDate(collection: Date[], date: Date): number {
        return collection.map(Number).indexOf(+date);
    }

    /**
     * Method to find all day cell
     *
     * @param {Element} td Accepts the DOM Element
     * @returns {boolean} Returns the boolean value
     * @private
     */
    public isAllDayCell(td: Element): boolean {
        if (['Month', 'TimelineMonth', 'TimelineYear', 'MonthAgenda'].indexOf(this.currentView) > -1 ||
            td.classList.contains(cls.ALLDAY_CELLS_CLASS) ||
            td.classList.contains(cls.HEADER_CELLS_CLASS) || !this.activeViewOptions.timeScale.enable) {
            return true;
        }
        if (this.activeView.isTimelineView() && this.activeViewOptions.headerRows.length > 0 &&
            this.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour') {
            return true;
        }
        return false;
    }

    /**
     * Method to get date from element
     *
     * @param {Element} td Accepts the DOM element
     * @returns {Date} Returns the date object
     * @private
     */
    public getDateFromElement(td: Element): Date {
        let dateString: string;
        if (!isNullOrUndefined(td)) {
            dateString = td.getAttribute('data-date');
        }
        if (!isNullOrUndefined(dateString)) {
            const dateInMS: number = parseInt(dateString, 10);
            const date: Date = new Date(dateInMS);
            return date;
        }
        return undefined;
    }

    /**
     * Method to get target element from given selector
     *
     * @param {string} selector Accepts the element selector
     * @param {number} left Accepts the pageX value
     * @param {number} top Accepts the pageY value
     * @returns {Element[]} Returns the collection of elements based on the given selector
     * @private
     */
    public getTargetElement(selector: string, left: number, top: number): Element[] {
        const element: Element = document.elementFromPoint(left, top);
        let targetElement: Element;
        if (element) {
            targetElement = element.closest(selector);
        }
        return (targetElement) ? [targetElement] : null;
    }

    /**
     * Method to process cell header template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getCellHeaderTemplate(): CallbackFunction {
        return this.cellHeaderTemplateFn;
    }

    /**
     * Method to process cell header template in year view.
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getDayHeaderTemplate(): CallbackFunction {
        return this.dayHeaderTemplateFn;
    }

    /**
     * Method to process cell header template in year view.
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getMonthHeaderTemplate(): CallbackFunction {
        return this.monthHeaderTemplateFn;
    }

    /**
     * Method to process cell template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getCellTemplate(): CallbackFunction {
        return this.cellTemplateFn;
    }

    /**
     * Method to process date header template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getDateHeaderTemplate(): CallbackFunction {
        return this.dateHeaderTemplateFn;
    }

    /**
     * Method to process date range template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getDateRangeTemplate(): CallbackFunction {
        return this.dateRangeTemplateFn;
    }

    /**
     * Method to process major slot template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getMajorSlotTemplate(): CallbackFunction {
        return this.majorSlotTemplateFn;
    }

    /**
     * Method to process minor slot template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getMinorSlotTemplate(): CallbackFunction {
        return this.minorSlotTemplateFn;
    }

    /**
     * Method to process appointment template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getAppointmentTemplate(): CallbackFunction {
        return this.appointmentTemplateFn;
    }

    /**
     * Method to process appointment tooltip template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getEventTooltipTemplate(): CallbackFunction {
        return this.eventTooltipTemplateFn;
    }

    /**
     * Method to process header tooltip template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getHeaderTooltipTemplate(): CallbackFunction {
        return this.headerTooltipTemplateFn;
    }

    /**
     * Method to process editor template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getEditorTemplate(): CallbackFunction {
        return this.editorTemplateFn;
    }

    /**
     * Method to process editor header template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getEditorHeaderTemplate(): CallbackFunction {
        return this.editorHeaderTemplateFn;
    }

    /**
     * Method to process editor footer template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getEditorFooterTemplate(): CallbackFunction {
        return this.editorFooterTemplateFn;
    }

    /**
     * Method to process quick info header template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getQuickInfoTemplatesHeader(): CallbackFunction {
        return this.quickInfoTemplatesHeaderFn;
    }

    /**
     * Method to process quick info content template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getQuickInfoTemplatesContent(): CallbackFunction {
        return this.quickInfoTemplatesContentFn;
    }

    /**
     * Method to process quick info footer template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getQuickInfoTemplatesFooter(): CallbackFunction {
        return this.quickInfoTemplatesFooterFn;
    }

    /**
     * Method to process resource header template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getResourceHeaderTemplate(): CallbackFunction {
        return this.resourceHeaderTemplateFn;
    }

    /**
     * Method to process indent template
     *
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public getHeaderIndentTemplate(): CallbackFunction {
        return this.headerIndentTemplateFn;
    }

    /**
     * Method to get dynamic CSS properties
     *
     * @returns {ScrollCss} Returns the CSS properties dynamically
     * @private
     */
    public getCssProperties(): ScrollCss {
        const cssProps: ScrollCss = {
            border: this.enableRtl ? 'borderLeftWidth' : 'borderRightWidth',
            padding: this.enableRtl ? 'paddingLeft' : 'paddingRight',
            rtlBorder: this.enableRtl ? 'borderRightWidth' : 'borderLeftWidth',
            rtlPadding: this.enableRtl ? 'paddingRight' : 'paddingLeft'
        };
        return cssProps;
    }

    /**
     * Method to remove new event element in adaptive mode
     *
     * @returns {void}
     * @private
     */
    public removeNewEventElement(): void {
        const eventClone: HTMLElement = this.element.querySelector('.' + cls.NEW_EVENT_CLASS);
        if (!isNullOrUndefined(eventClone)) {
            remove(eventClone);
        }
    }

    /**
     * Method to get start end time from string
     *
     * @param {string} startEndTime Accepts the start end time string value
     * @returns {Date} Returns the date object
     * @private
     */
    public getStartEndTime(startEndTime: string): Date {
        if (!isNullOrUndefined(startEndTime) && startEndTime !== '') {
            const startEndDate: Date = util.resetTime(new Date(this.currentTimezoneDate) || this.getCurrentTime());
            const timeString: string[] = startEndTime.split(':');
            if (timeString.length === 2) {
                startEndDate.setHours(parseInt(timeString[0], 10), parseInt(timeString[1], 10), 0);
            }
            return startEndDate;
        }
        return null;
    }

    private onDocumentClick(args: Event): void {
        this.notify(events.documentClick, { event: args });
    }

    private onDocumentPaste(args: Event): void {
        this.notify(events.documentPaste, { event: args });
    }

    private onScheduleResize(): void {
        if (isNullOrUndefined(this.activeView) || ((this.isAdaptive || util.isMobile()) && document.activeElement
            && (document.activeElement.classList.contains(cls.SUBJECT_CLASS) ||
                document.activeElement.classList.contains(cls.INLINE_SUBJECT_CLASS))) || this.uiStateValues.isTapHold) {
            return;
        }
        if (this.virtualScrollModule && this.activeView.isTimelineView()) {
            this.virtualScrollModule.refreshLayout();
        }
        if (this.activeViewOptions.timeScale.enable && this.activeView) {
            this.activeView.highlightCurrentTime();
        }
        if (this.quickPopup) {
            this.quickPopup.onClosePopup();
        }
        util.resetScrollbarWidth();
        if (this.currentView === 'Month' || ((this.currentView !== 'Agenda' && this.currentView !== 'MonthAgenda')
            && !this.activeViewOptions.timeScale.enable) || this.activeView.isTimelineView()) {
            this.activeView.resetColWidth();
            this.notify(events.scrollUiUpdate, { cssProperties: this.getCssProperties(), isPreventScrollUpdate: true });
            let isRemoteRefresh: boolean = false;
            if (this.activeViewOptions.enableLazyLoading && this.virtualScrollModule && this.virtualScrollModule.isRemoteRefresh) {
                isRemoteRefresh = this.virtualScrollModule.isRemoteRefresh;
                this.virtualScrollModule.isRemoteRefresh = false;
            }
            this.refreshEvents(isRemoteRefresh);
            if (this.virtualScrollModule && !this.virtualScrollModule.enableTransition) {
                const resWrap: HTMLElement = this.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
                const conWrap: HTMLElement = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
                this.virtualScrollModule.enableTransition = true;
                addClass([conWrap, resWrap], 'e-transition');
            }
        } else {
            this.notify(events.contentReady, {});
        }
    }

    /**
     * Method to process the templates
     *
     * @param {string | Function} template Accepts the template in string
     * @returns {CallbackFunction} Returns the callback function
     * @private
     */
    public templateParser(template: string | Function): CallbackFunction {
        if (template) {
            try {
                if (typeof template === 'function') {
                    return compile(template);
                } else {
                    if (document.querySelectorAll(template).length) {
                        return compile(document.querySelector(template).innerHTML.trim());
                    } else {
                        return compile(template);
                    }
                }
            } catch (error) {
                return compile(template);
            }
        }
        return undefined;
    }

    /**
     * Retrieves the selected cells.
     *
     * @returns {Element[]} The elements of currently selected cells will be returned.
     * @private
     */
    public getSelectedCells(): Element[] {
        return [].slice.call(this.element.querySelectorAll('.' + cls.SELECTED_CELL_CLASS));
    }

    /**
     * Method to generate the announcement string
     *
     * @param {Object} event Accepts the event object
     * @param {string} subject Accepts the subject text
     * @returns {string} Returns the announcement string
     * @private
     */
    public getAnnouncementString(event: Record<string, any>, subject?: string): string {
        let resourceName: string;
        if (this.quickPopup && this.activeViewOptions.group.resources.length > 0) {
            const constantText: string = '"s event - ';
            resourceName = this.quickPopup.getResourceText({ event: event } as EventClickArgs, 'event') + constantText;
        }
        const recordSubject: string = (subject || (event[this.eventFields.subject] || this.eventSettings.fields.subject.default)) as string;
        const recordLocation: string = (event[this.eventFields.location] || this.eventSettings.fields.location.default) as string;
        const skeleton: string = 'full';
        const startDateText: string = this.globalize.formatDate(event[this.eventFields.startTime] as Date, {
            type: 'dateTime', skeleton: skeleton, calendar: this.getCalendarMode()
        });
        const endDateText: string = this.globalize.formatDate(event[this.eventFields.endTime] as Date, {
            type: 'dateTime', skeleton: skeleton, calendar: this.getCalendarMode()
        });
        let announcementString: string = recordSubject + ' ' + this.localeObj.getConstant('beginFrom') + ' '
            + startDateText + ' ' + this.localeObj.getConstant('endAt') + ' ' + endDateText;
        if (resourceName) {
            announcementString = resourceName + ' ' + announcementString;
        }
        if (recordLocation && recordLocation !== '') {
            announcementString = announcementString + ' ' + this.localeObj.getConstant('location') + ' ' + recordLocation;
        }
        if (event[this.eventFields.recurrenceRule] && event[this.eventFields.recurrenceRule] !== ''
            && event[this.eventFields.id] === event[this.eventFields.recurrenceID]) {
            announcementString = announcementString + ' ' + this.localeObj.getConstant('recurringEvent');
        }
        return announcementString;
    }

    /**
     * Method to process the element boundary validation
     *
     * @param {number} pageY Accepts the pageY value
     * @param {number} pageX Accepts the pageX value
     * @returns {ResizeEdges} Returns the boundary validation object
     * @private
     */
    public boundaryValidation(pageY: number, pageX: number): ResizeEdges {
        const autoScrollDistance: number = 30;
        const scrollEdges: ResizeEdges = { left: false, right: false, top: false, bottom: false };
        const viewBoundaries: ClientRect = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS).getBoundingClientRect();
        if ((pageY < viewBoundaries.top + autoScrollDistance + window.pageYOffset) &&
            (pageY > viewBoundaries.top + window.pageYOffset)) {
            scrollEdges.top = true;
        }
        if ((pageY > (viewBoundaries.bottom - autoScrollDistance) + window.pageYOffset) &&
            (pageY < viewBoundaries.bottom + window.pageYOffset)) {
            scrollEdges.bottom = true;
        }
        if ((pageX < viewBoundaries.left + autoScrollDistance + window.pageXOffset) &&
            (pageX > viewBoundaries.left + window.pageXOffset)) {
            scrollEdges.left = true;
        }
        if ((pageX > (viewBoundaries.right - autoScrollDistance) + window.pageXOffset) &&
            (pageX < viewBoundaries.right + window.pageXOffset)) {
            scrollEdges.right = true;
        }
        return scrollEdges;
    }

    /**
     * Method to get the week number.
     *
     * @param {Date[]} dates Accepts the date collections
     * @returns {number} Returns the week number
     * @private
     */
    public getWeekNumberContent(dates: Date[]): string {
        let weekNumber: string;
        if (this.weekRule === 'FirstDay') {
            const weekNumberDate: Date = util.getWeekLastDate(dates.slice(-1)[0], this.firstDayOfWeek);
            weekNumber = this.globalize.formatNumber(util.getWeekNumber(weekNumberDate));
        } else if (this.weekRule === 'FirstFourDayWeek') {
            const weekFirstDate: Date = util.getWeekFirstDate(dates.slice(-1)[0], this.firstDayOfWeek);
            const weekLastDate: Date = util.getWeekLastDate(dates.slice(-1)[0], this.firstDayOfWeek);
            const weekMidDate: Date = util.getWeekMiddleDate(weekFirstDate, weekLastDate);
            weekNumber = this.globalize.formatNumber(util.getWeekNumber(weekMidDate));
        } else if (this.weekRule === 'FirstFullWeek') {
            const weekFirstDate: Date = util.getWeekFirstDate(dates.slice(-1)[0], this.firstDayOfWeek);
            weekNumber = this.globalize.formatNumber(util.getWeekNumber(weekFirstDate));
        }
        return weekNumber;
    }

    /**
     * Method to render the header indent template.
     *
     * @param {TdData} data Accepts the td data
     * @param {Element} td Accepts the td element
     * @returns {void}
     * @private
     */
    public renderHeaderIndentTemplate(data: TdData, td: Element): void {
        if (this.activeViewOptions.headerIndentTemplate) {
            const scheduleId: string = this.element.id + '_';
            const viewName: string = this.activeViewOptions.headerIndentTemplateName;
            const templateId: string = scheduleId + viewName + 'headerIndentTemplate';
            const indentTemplate: HTMLElement[] = [].slice.call(
                this.getHeaderIndentTemplate()(data, this, 'headerIndentTemplate', templateId, false, undefined, undefined, this.root));
            append(indentTemplate, td);
        }
    }

    /**
     * Method to check for refreshing the targeted resource row events.
     *
     * @returns {boolean} Returns the boolean value
     * @private
     */
    public isSpecificResourceEvents(): boolean {
        return this.activeViewOptions.group.resources.length > 0 && !this.activeViewOptions.group.allowGroupEdit &&
            !this.rowAutoHeight && !this.virtualScrollModule && this.activeViewOptions.group.byGroupID;
    }

    private unWireEvents(): void {
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', this.onScheduleResize);
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'orientationchange', this.onScheduleResize);
        EventHandler.remove(document, Browser.touchStartEvent, this.onDocumentClick);
        EventHandler.remove(document, 'paste', this.onDocumentPaste);
    }

    /**
     * Core method to return the component name.
     *
     * @returns {string} Returns the module name
     * @private
     */
    public getModuleName(): string {
        return 'schedule';
    }

    /**
     * Returns the properties to be maintained in the persisted state.
     *
     * @returns {string} Returns the persistance data
     * @private
     */
    protected getPersistData(): string {
        return this.addOnPersist(['currentView', 'selectedDate', 'scrollTop', 'scrollLeft', 'adaptiveGroupIndex']);
    }

    /**
     * Called internally, if any of the property value changed.
     *
     * @returns {void}
     * @private
     */

    public onPropertyChanged(newProp: ScheduleModel, oldProp: ScheduleModel): void {
        if ((this as any).isReact && isNullOrUndefined(this.activeView)) {
            return;
        }
        const state: StateArgs = {
            isRefresh: false, isResource: false, isDate: false, isView: false, isLayout: false, isDataManager: false
        };
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'views':
                this.setViewOptions();
                if (this.headerModule) {
                    this.headerModule.updateItems();
                }
                state.isView = true;
                break;
            case 'currentView':
                state.isView = true;
                break;
            case 'minDate':
            case 'maxDate':
            case 'selectedDate':
                state.isDate = true;
                break;
            case 'dateFormat':
                this.activeViewOptions = this.getActiveViewOptions();
                if (this.headerModule) {
                    this.headerModule.updateDateRange();
                }
                break;
            case 'showHeaderBar':
            case 'toolbarItems':
                this.destroyHeaderModule();
                if (newProp.showHeaderBar) {
                    this.headerModule = new HeaderRenderer(this);
                    this.headerModule.updateDateRange();
                }
                this.notify(events.scrollUiUpdate, { cssProperties: this.getCssProperties() });
                if (this.activeView.isTimelineView()) {
                    this.refreshEvents(false);
                }
                break;
            case 'workDays':
                if (JSON.stringify(oldProp.workDays) !== JSON.stringify(newProp.workDays)) {
                    state.isLayout = true;
                }
                break;
            case 'showWeekend':
            case 'startHour':
            case 'endHour':
            case 'workHours':
            case 'readonly':
            case 'headerRows':
            case 'showWeekNumber':
            case 'rowAutoHeight':
                state.isLayout = true;
                break;
            case 'locale':
            case 'calendarMode':
                this.globalize = new Internationalization(this.locale);
                this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
                this.setCldrTimeFormat();
                this.setCalendarMode();
                state.isRefresh = true;
                break;
            case 'firstDayOfWeek':
                this.activeViewOptions.firstDayOfWeek = newProp.firstDayOfWeek;
                if (this.eventWindow) { this.eventWindow.refreshRecurrenceEditor(); }
                state.isLayout = true;
                break;
            case 'showTimeIndicator':
                if (this.activeViewOptions.timeScale.enable && this.activeView) {
                    this.activeView.highlightCurrentTime();
                }
                break;
            case 'cellHeaderTemplate':
                this.activeViewOptions.cellHeaderTemplate = newProp.cellHeaderTemplate;
                this.cellHeaderTemplateFn = this.templateParser(this.activeViewOptions.cellHeaderTemplate);
                state.isLayout = true;
                break;
            case 'cellTemplate':
                this.activeViewOptions.cellTemplate = newProp.cellTemplate;
                this.cellTemplateFn = this.templateParser(this.activeViewOptions.cellTemplate);
                state.isLayout = true;
                break;
            case 'dateHeaderTemplate':
                this.activeViewOptions.dateHeaderTemplate = newProp.dateHeaderTemplate;
                this.dateHeaderTemplateFn = this.templateParser(this.activeViewOptions.dateHeaderTemplate);
                state.isLayout = true;
                break;
            case 'dateRangeTemplate':
                this.activeViewOptions.dateRangeTemplate = newProp.dateRangeTemplate;
                this.dateRangeTemplateFn = this.templateParser(this.activeViewOptions.dateRangeTemplate);
                if (this.headerModule) {
                    this.headerModule.updateDateRange();
                }
                break;
            case 'dayHeaderTemplate':
                this.activeViewOptions.dayHeaderTemplate = newProp.dayHeaderTemplate;
                this.dayHeaderTemplateFn = this.templateParser(this.activeViewOptions.dayHeaderTemplate);
                state.isLayout = true;
                break;
            case 'monthHeaderTemplate':
                this.activeViewOptions.monthHeaderTemplate = newProp.monthHeaderTemplate;
                this.monthHeaderTemplateFn = this.templateParser(this.activeViewOptions.monthHeaderTemplate);
                state.isLayout = true;
                break;
            case 'resourceHeaderTemplate':
                this.activeViewOptions.resourceHeaderTemplate = newProp.resourceHeaderTemplate;
                this.resourceHeaderTemplateFn = this.templateParser(this.activeViewOptions.resourceHeaderTemplate);
                state.isLayout = true;
                break;
            case 'timezone':
                this.eventBase.timezonePropertyChange(oldProp.timezone);
                if (this.headerModule) {
                    this.headerModule.setCalendarTimezone();
                }
                break;
            case 'enableRtl':
                this.setRtlClass();
                state.isRefresh = true;
                break;
            default:
                this.extendedPropertyChange(prop, newProp, oldProp, state);
                break;
            }
        }
        this.propertyChangeAction(state);
    }

    private propertyChangeAction(state: StateArgs): void {
        if (state.isRefresh) {
            this.refresh();
        } else if (state.isResource) {
            this.initializeResources(true);
        } else if (state.isView) {
            this.changeView(this.currentView, null, true);
        } else if (state.isDate) {
            if (isNullOrUndefined(this.selectedDate)) {
                this.setProperties({ selectedDate: this.getCurrentTime() }, true);
            }
            this.changeDate(this.selectedDate);
        } else if (state.isLayout) {
            this.activeCellsData = null;
            this.initializeView(this.currentView);
        } else if (state.isDataManager && this.crudModule) {
            if (this.dragAndDropModule) {
                this.dragAndDropModule.actionObj.action = '';
                removeClass([this.element], cls.EVENT_ACTION_CLASS);
            }
            this.crudModule.refreshDataManager();
        }
    }

    private allDayRowScrollUpdate(): void {
        const dateHeader: HTMLElement = (this.element.querySelector('.' + cls.DATE_HEADER_WRAP_CLASS) as HTMLElement);
        const allDayRow: HTMLElement = (this.element.querySelector('.' + cls.ALLDAY_ROW_CLASS) as HTMLElement);
        if (this.height === 'auto' || !this.enableAllDayScroll) {
            addClass([dateHeader], cls.ALLDAY_APPOINTMENT_AUTO);
            if (dateHeader.classList.contains(cls.ALLDAY_APPOINTMENT_SCROLL)) {
                removeClass([dateHeader], cls.ALLDAY_APPOINTMENT_SCROLL);
            }
            if (this.uiStateValues.expand) {
                const allDayCells: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.ALLDAY_CELLS_CLASS));
                allDayCells[0].style.height = (allDayRow.style.height) ? allDayRow.style.height : allDayCells[1].style.height;
            }
        } else {
            if (dateHeader.classList.contains(cls.ALLDAY_APPOINTMENT_AUTO)) {
                removeClass([dateHeader], cls.ALLDAY_APPOINTMENT_AUTO);
            }
            this.eventBase.allDayExpandScroll(dateHeader);
        }
        if (!this.uiStateValues.expand) {
            allDayRow.style.height = '';
        }
    }

    private extendedPropertyChange(prop: string, newProp: ScheduleModel, oldProp: ScheduleModel, state: StateArgs): void {
        switch (prop) {
        case 'width':
        case 'height':
        case 'enableAllDayScroll':
            if (['Day', 'Week', 'WorkWeek'].indexOf(this.currentView) > -1) {
                this.allDayRowScrollUpdate();
            }
            this.notify(events.uiUpdate, { module: 'scroll', properties: { width: newProp.width, height: newProp.height } });
            break;
        case 'cssClass':
            if (oldProp.cssClass) { removeClass([this.element], oldProp.cssClass.split(' ')); }
            if (newProp.cssClass) { addClass([this.element], newProp.cssClass.split(' ')); }
            break;
        case 'hideEmptyAgendaDays':
        case 'agendaDaysCount':
            this.activeViewOptions = this.getActiveViewOptions();
            state.isView = true;
            break;
        case 'eventSettings':
            this.onEventSettingsPropertyChanged(newProp.eventSettings, oldProp.eventSettings, state);
            break;
        case 'allowKeyboardInteraction':
        case 'allowClipboard':
            if (this.keyboardInteractionModule) {
                this.keyboardInteractionModule.destroy();
                this.keyboardInteractionModule = null;
            }
            if (newProp.allowKeyboardInteraction || newProp.allowClipboard) {
                this.keyboardInteractionModule = new KeyboardInteraction(this);
            }
            if (prop === 'allowClipboard') {
                if (newProp.allowClipboard) {
                    EventHandler.add(document, 'paste', this.onDocumentPaste, this);
                }
                else {
                    EventHandler.remove(document, 'paste', this.onDocumentPaste);
                }
            }
            break;
        case 'timezoneDataSource':
            if (this.eventWindow) {
                this.eventWindow.refresh();
            }
            break;
        case 'editorTemplate':
            if (!isNullOrUndefined(this.editorTemplate)) {
                this.editorTemplateFn = this.templateParser(this.editorTemplate);
            }
            if (this.eventWindow) { this.eventWindow.setDialogContent(); }
            break;
        case 'editorHeaderTemplate':
            if (!isNullOrUndefined(this.editorHeaderTemplate)) {
                this.editorHeaderTemplateFn = this.templateParser(this.editorHeaderTemplate);
            }
            if (this.eventWindow) { this.eventWindow.setDialogHeader(); }
            break;
        case 'editorFooterTemplate':
            if (!isNullOrUndefined(this.editorFooterTemplate)) {
                this.editorFooterTemplateFn = this.templateParser(this.editorFooterTemplate);
            }
            if (this.eventWindow) { this.eventWindow.setDialogFooter(); }
            break;
        case 'quickInfoTemplates':
            if (this.quickInfoTemplates.header) {
                this.quickInfoTemplatesHeaderFn = this.templateParser(this.quickInfoTemplates.header);
            }
            if (this.quickInfoTemplates.content) {
                this.quickInfoTemplatesContentFn = this.templateParser(this.quickInfoTemplates.content);
            }
            if (this.quickInfoTemplates.footer) {
                this.quickInfoTemplatesFooterFn = this.templateParser(this.quickInfoTemplates.footer);
            }
            break;
        case 'group':
            this.onGroupSettingsPropertyChanged(newProp.group, oldProp.group, state);
            break;
        case 'resources':
            state.isResource = true;
            break;
        case 'timeScale':
            this.activeViewOptions.timeScale.interval = newProp.timeScale.interval || this.activeViewOptions.timeScale.interval;
            this.activeViewOptions.timeScale.slotCount = newProp.timeScale.slotCount || this.activeViewOptions.timeScale.slotCount;
            if (this.eventWindow) { this.eventWindow.refreshDateTimePicker(); }
            state.isLayout = true;
            break;
        case 'allowDragAndDrop':
        case 'allowResizing':
        case 'eventDragArea':
        case 'allowOverlap':
            this.refreshEvents(false);
            break;
        case 'weekRule':
            state.isLayout = true;
            break;
        case 'firstMonthOfYear':
            this.activeViewOptions.firstMonthOfYear = newProp.firstMonthOfYear;
            this.viewIndex = this.activeView.viewIndex;
            state.isLayout = true;
            break;
        case 'monthsCount':
            this.activeViewOptions.monthsCount = newProp.monthsCount;
            this.viewIndex = this.activeView.viewIndex;
            state.isLayout = true;
            break;
        case 'timeFormat':
            this.internalTimeFormat = newProp.timeFormat || this.activeViewOptions.timeFormat;
            if (this.eventWindow) { this.eventWindow.refreshDateTimePicker(); }
            state.isLayout = true;
            break;
        case 'enableAdaptiveUI':
            if (this.showHeaderBar && this.headerModule) {
                this.destroyHeaderModule();
                this.headerModule = new HeaderRenderer(this);
                this.headerModule.updateDateRange();
            }
            state.isLayout = true;
            break;
        case 'headerIndentTemplate':
            this.activeViewOptions.headerIndentTemplate = newProp.headerIndentTemplate;
            this.headerIndentTemplateFn = this.templateParser(this.activeViewOptions.headerIndentTemplate);
            state.isLayout = true;
            break;
        }
    }

    private setRtlClass(): void {
        if (this.enableRtl) {
            addClass([this.element], 'e-rtl');
        } else {
            removeClass([this.element], 'e-rtl');
        }
    }

    private onGroupSettingsPropertyChanged(newProp: GroupModel, oldProp: GroupModel, state: StateArgs): void {
        for (const prop of Object.keys(newProp)) {
            if (prop === 'headerTooltipTemplate') {
                this.headerTooltipTemplateFn = this.templateParser(newProp.headerTooltipTemplate);
            } else {
                state.isLayout = true;
                if (this.eventWindow) { this.eventWindow.refresh(); }
            }
        }
    }

    private onEventSettingsPropertyChanged(newProp: EventSettingsModel, oldProp: EventSettingsModel, state: StateArgs): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'dataSource':
            case 'query':
            case 'fields':
            case 'includeFiltersInQuery':
                this.initializeDataModule();
                state.isDataManager = true;
                break;
            case 'template':
                this.activeViewOptions.eventTemplate = newProp.template;
                this.appointmentTemplateFn = this.templateParser(this.activeViewOptions.eventTemplate);
                state.isDataManager = true;
                break;
            case 'enableTooltip':
                if (this.eventTooltip) {
                    this.eventTooltip.destroy();
                    this.eventTooltip = null;
                }
                if (newProp.enableTooltip) {
                    this.eventTooltip = new EventTooltip(this);
                }
                break;
            case 'tooltipTemplate':
                this.eventTooltipTemplateFn = this.templateParser(this.eventSettings.tooltipTemplate);
                break;
            case 'resourceColorField':
                if (this.resourceBase) {
                    this.resourceBase.setResourceCollection();
                }
                state.isDataManager = true;
                break;
            case 'editFollowingEvents':
                if (this.quickPopup) { this.quickPopup.refreshQuickDialog(); }
                break;
            case 'allowAdding':
            case 'allowEditing':
            case 'allowDeleting':
                if (this.showHeaderBar && this.headerModule) {
                    this.headerModule.updateAddIcon();
                }
                if (this.eventWindow) { this.eventWindow.refresh(); }
                break;
            case 'spannedEventPlacement':
            case 'minimumEventDuration':
            case 'enableMaxHeight':
            case 'enableIndicator':
                this.refreshEvents(false);
                break;
            case 'ignoreWhitespace':
                state.isLayout = true;
                break;
            }
        }
    }

    private destroyHeaderModule(): void {
        if (this.headerModule) {
            this.headerModule.destroy();
            this.headerModule = null;
        }
    }

    private destroyPopups(): void {
        if (this.quickPopup) {
            this.quickPopup.destroy();
            this.quickPopup = null;
        }
        if (this.eventWindow) {
            this.eventWindow.destroy();
            this.eventWindow = null;
        }
    }

    /**
     * Allows to show the spinner on schedule at the required scenarios.
     *
     * @function showSpinner
     * @returns {void}
     */
    public showSpinner(): void {
        showSpinner(this.element);
    }

    /**
     * When the spinner is shown manually using `showSpinner` method, it can be hidden using this `hideSpinner` method.
     *
     * @function hideSpinner
     * @returns {void}
     */
    public hideSpinner(): void {
        hideSpinner(this.element);
    }

    /**
     * Sets different working hours on the required working days by accepting the required start and end time as well as the date collection
     *  as its parameters.
     *
     * @function setWorkHours
     * @param {Date} dates Collection of dates on which the given start and end hour range needs to be applied.
     * @param {string} start Defines the work start hour.
     * @param {string} end Defines the work end hour.
     * @param {number} groupIndex Defines the resource index from last level.
     * @returns {void}
     */
    public setWorkHours(dates: Date[], start: string, end: string, groupIndex?: number): void {
        let cells: HTMLTableCellElement[] = [];
        cells = this.getWorkHourCells(dates, start, end, groupIndex);
        addClass(cells, cls.WORK_HOURS_CLASS);
    }

    /**
     * Removes or resets different working hours on the required working days by accepting the required start and end time as well as the
     * date collection as its parameters.
     * if no parameters has been passed to this function, it will remove all the work hours.
     *
     * @param {Date} dates Collection of dates on which the given start and end hour range need to be applied.
     * @param {string} start Defines the work start hour.
     * @param {string} end Defines the work end hour.
     * @param {number} groupIndex Defines the resource index from last level.
     * @returns {void}
     */
    public resetWorkHours(dates: Date[] = this.activeView.renderDates, start?: string, end?: string, groupIndex?: number): void {
        if (dates && start && end) {
            const cells: HTMLTableCellElement[] = this.getWorkHourCells(dates, start, end, groupIndex);
            removeClass(cells, cls.WORK_HOURS_CLASS);
        } else {
            const workHourCells: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.WORK_HOURS_CLASS));
            removeClass(workHourCells, cls.WORK_HOURS_CLASS);
        }
    }

    private getWorkHourCells(dates: Date[], start: string, end: string, groupIndex?: number): HTMLTableCellElement[] {
        if (['Agenda', 'MonthAgenda', 'Month', 'TimelineMonth'].indexOf(this.currentView) > -1) {
            return [];
        }
        let startHour: Date = this.getStartEndTime(start);
        let endHour: Date = this.getStartEndTime(end);
        const tableEle: HTMLTableElement = this.getContentTable() as HTMLTableElement;
        if (isNullOrUndefined(startHour) || isNullOrUndefined(endHour) || !tableEle) {
            return [];
        }
        startHour.setMilliseconds(0);
        endHour.setMilliseconds(0);
        const viewStartHour: Date = this.activeView.getStartHour();
        if (startHour < viewStartHour) {
            startHour = viewStartHour;
        }
        const viewEndHour: Date = this.activeView.getEndHour();
        if (endHour > viewEndHour) {
            endHour = viewEndHour;
        }
        const msMajorInterval: number = this.activeViewOptions.timeScale.interval * util.MS_PER_MINUTE;
        const msInterval: number = msMajorInterval / this.activeViewOptions.timeScale.slotCount;
        const offsetDiff: number = ((viewStartHour.getTimezoneOffset() - startHour.getTimezoneOffset()) * util.MS_PER_MINUTE);
        const endOffsetDiff: number = Math.abs((viewStartHour.getTimezoneOffset() - endHour.getTimezoneOffset()) * util.MS_PER_MINUTE);
        let startIndex: number = Math.round((startHour.getTime() - viewStartHour.getTime() + offsetDiff) / msInterval);
        let endIndex: number = Math.ceil((endHour.getTime() - viewStartHour.getTime() - endOffsetDiff) / msInterval);
        const tempStartIndex: number = startIndex;
        const tempEndIndex: number = endIndex;
        const cells: HTMLTableCellElement[] = [];
        for (let date of dates) {
            date = this.getDateTime(date);
            util.resetTime(date);
            let renderDates: Date[] = this.activeView.renderDates;
            if (!isNullOrUndefined(groupIndex) && this.resourceBase && !this.activeView.isTimelineView()) {
                renderDates = this.resourceBase.lastResourceLevel[parseInt(groupIndex.toString(), 10)].renderDates;
            }
            const colIndex: number = this.getIndexOfDate(renderDates, date);
            if (colIndex >= 0) {
                if (this.activeView.isTimelineView()) {
                    const slotsPerDay: number = Math.round((viewEndHour.getTime() - viewStartHour.getTime()) / msInterval);
                    startIndex = tempStartIndex + (colIndex * slotsPerDay);
                    endIndex = tempEndIndex + (colIndex * slotsPerDay);
                }
                for (let i: number = startIndex; i < endIndex; i++) {
                    if (this.activeView.isTimelineView()) {
                        const rowIndex: number = (!isNullOrUndefined(groupIndex)) ? groupIndex : 0;
                        cells.push(tableEle.rows[parseInt(rowIndex.toString(), 10)].cells[parseInt(i.toString(), 10)]);
                    } else {
                        if (!isNullOrUndefined(groupIndex)) {
                            const selector: string = '.' + cls.WORK_CELLS_CLASS + '[data-group-index="' + groupIndex + '"]';
                            const tds: HTMLTableCellElement[] =
                              [].slice.call(tableEle.rows[parseInt(i.toString(), 10)].querySelectorAll(selector));
                            cells.push(tds[parseInt(colIndex.toString(), 10)]);
                        } else {
                            cells.push(tableEle.rows[parseInt(i.toString(), 10)].cells[parseInt(colIndex.toString(), 10)]);
                        }
                    }
                }
            }
        }
        return cells;
    }

    /**
     * Retrieves the start and end time information of the specific cell element.
     *
     * @function getCellDetails
     * @param {Element | Element[]} tdCol Accepts the single or collection of elements.
     * @returns {CellClickEventArgs} Object An object holding the startTime, endTime and all-day information along with the target HTML element will be returned.
     */
    public getCellDetails(tdCol: Element | Element[]): CellClickEventArgs {
        const td: Element[] = (tdCol instanceof Array) ? tdCol : [tdCol];
        const firstTd: Element = getElement(td[0]);
        const lastTd: Element = getElement(td.slice(-1)[0]);
        const startTime: Date = this.getDateFromElement(firstTd);
        let endTime: Date = this.getDateFromElement(lastTd);
        if (isNullOrUndefined(startTime) || isNullOrUndefined(endTime)) {
            return undefined;
        }
        const endDateFromColSpan: boolean = this.activeView.isTimelineView() && !isNullOrUndefined(lastTd.getAttribute('colSpan')) &&
            this.headerRows.length > 0;
        const duration: number = endDateFromColSpan ? parseInt(lastTd.getAttribute('colSpan'), 10) : 1;
        if (!this.activeViewOptions.timeScale.enable || endDateFromColSpan || lastTd.classList.contains(cls.ALLDAY_CELLS_CLASS) ||
            lastTd.classList.contains(cls.HEADER_CELLS_CLASS)) {
            endTime = util.addDays(new Date(endTime.getTime()), duration);
        } else {
            endTime = this.activeView.getEndDateFromStartDate(endTime);
        }
        const data: CellClickEventArgs = {
            startTime: startTime,
            endTime: endTime,
            isAllDay: this.isAllDayCell(firstTd),
            element: tdCol as HTMLElement | HTMLElement[]
        };
        const groupIndex: string = firstTd.getAttribute('data-group-index');
        if (!isNullOrUndefined(groupIndex)) {
            data.groupIndex = parseInt(groupIndex, 10);
        }
        return data;
    }

    /**
     * Retrieves the selected cell elements.
     *
     * @function getSelectedElements
     * @returns {Element[]} The elements of currently selected cells will be returned.
     */
    public getSelectedElements(): Element[] {
        if (this.keyboardInteractionModule && this.keyboardInteractionModule.selectedCells.length > 0) {
            return this.keyboardInteractionModule.selectedCells;
        }
        return this.getSelectedCells();
    }

    /**
     * To get the resource collection
     *
     * @function getResourceCollections
     * @returns {ResourcesModel[]} Returns the resource collections
     */
    public getResourceCollections(): ResourcesModel[] {
        return this.resourceCollection;
    }

    /**
     * To set the resource collection
     *
     * @function setResourceCollections
     * @param {ResourcesModel[]} resourceCol Accepts the resource collections in ResourcesModel type
     * @param {boolean} isEventDataRefresh Accepts the boolean to refresh the appointment data source from remote or local
     * @returns {void}
     */
    public setResourceCollections(resourceCol: ResourcesModel[], isEventDataRefresh: boolean = true): void {
        if (!isEventDataRefresh && this.uiStateValues) {
            this.uiStateValues.isPreventEventRefresh = true;
        }
        this.setProperties({ resources: resourceCol }, false);
    }

    /**
     * Current View could be change based on the provided parameters.
     *
     * @function changeCurrentView
     * @param {View} viewName Accept the view in the viewCollections.
     * @param {number} viewIndex Accept the viewIndex in the viewCollections.
     * @returns {void}
     */
    public changeCurrentView(viewName: View, viewIndex?: number): void {
        let index: number = this.getViewIndex(viewName);
        const view: string = viewName.charAt(0).toLowerCase() + viewName.slice(1);
        const viewOptions: ViewsData[] = this.viewOptions[`${view}`];
        if (viewOptions) {
            index = this.viewCollections.indexOf(viewOptions[viewIndex || 0]);
        }
        if (index === -1 || index === this.viewIndex) {
            return;
        }
        this.changeView(viewName, null, null, index);
    }

    /**
     * Return the current view Index.
     *
     * @function getCurrentViewIndex
     * @returns {number} Returns the view index
     */
    public getCurrentViewIndex(): number {
        return this.viewIndex;
    }

    /**
     * Retrieves the resource details based on the provided resource index.
     *
     * @param {number} index index of the resources at the last level.
     * @returns {ResourceDetails} Object An object holding the details of resource and resourceData.
     */
    public getResourcesByIndex(index: number): ResourceDetails {
        if (this.resourceBase && this.resourceBase.lastResourceLevel) {
            if (index < 0 || index >= this.resourceBase.lastResourceLevel.length) {
                return undefined;
            }
            const data: TdData = this.resourceBase.lastResourceLevel[parseInt(index.toString(), 10)];
            const groupData: Record<string, any> = {};
            this.resourceBase.setResourceValues(groupData, index);
            return { resource: data.resource, resourceData: data.resourceData, groupData: groupData };
        }
        return undefined;
    }

    /**
     * This method allows to expand the resource that available on the scheduler.
     *
     * @function expandResource
     * @param {string | number} resourceId Accepts the resource id in either string or number type
     * @param {string} name Accepts the name of the resource collection
     * @returns {void}
     */
    public expandResource(resourceId: string | number, name: string): void {
        if (this.activeView.isTimelineView() && this.resourceBase && this.resourceCollection.length > 1) {
            this.resourceBase.resourceExpand(resourceId, name, false);
        }
    }

    /**
     * This method allows to collapse the resource that available on the scheduler.
     *
     * @function collapseResource
     * @param {string | number} resourceId Accepts the resource id in either string or number type
     * @param {string} name Accepts the name of the resource collection
     * @returns {void}
     */
    public collapseResource(resourceId: string | number, name: string): void {
        if (this.activeView.isTimelineView() && this.resourceBase && this.resourceCollection.length > 1) {
            this.resourceBase.resourceExpand(resourceId, name, true);
        }
    }

    /**
     * Scrolls the Schedule content area to the specified time.
     *
     * @function scrollTo
     * @param {string} hour Accepts the time value in the skeleton format of 'Hm'.
     * @param {Date} scrollDate Accepts the date object value.
     * @returns {void}
     */
    public scrollTo(hour: string, scrollDate?: Date): void {
        if (this.currentView.indexOf('Agenda') < 0 && isNullOrUndefined(this.element.querySelector('.e-work-cells'))) {
            return;
        }
        if (this.activeView.scrollToDate && isNullOrUndefined(hour) && scrollDate) {
            this.activeView.scrollToDate(scrollDate);
        } else if (this.activeView.scrollToHour) {
            this.activeView.scrollToHour(hour, scrollDate);
        }
    }

    /**
     * This method allows scroll to the position of the any resources that available on the scheduler.
     * This method is applicable for without Agenda and Month agenda views of the schedule.
     *
     * @function scrollToResource
     * @param {string | number} resourceId Accepts the resource id in either string or number type
     * @param {string} groupName Accepts the name of the resource collection
     * @returns {void}
     */
    public scrollToResource(resourceId: string | number, groupName?: string): void {
        if (this.resourceBase && this.resourceBase.lastResourceLevel) {
            this.resourceBase.resourceScroll(resourceId, groupName);
        }
    }

    /**
     * Exports the Scheduler events to a calendar (.ics) file. By default, the calendar is exported with a file name `Calendar.ics`.
     * To change this file name on export, pass the custom string value as `fileName` to get the file downloaded with this provided name.
     *
     * @function exportToICalendar
     * @param {string} fileName Accepts the string value.
     * @param {Object[]} customData Accepts the collection of objects.
     * @returns {void}
     */
    public exportToICalendar(fileName?: string, customData?: Record<string, any>[]): void {
        if (this.iCalendarExportModule) {
            this.iCalendarExportModule.initializeCalendarExport(fileName, customData);
        } else {
            console.warn('[WARNING] :: Module "ICalendarExport" is not available in Schedule component!' +
                ' You either misspelled the module name or forgot to load it.');
            throw Error('Inject ICalendarExport module');
        }
    }

    /**
     * Imports the events from an .ics file downloaded from any of the calendars like Google or Outlook into the Scheduler.
     * This method accepts the blob object or string format of an .ics file to be imported as a mandatory argument.
     *
     * @function importICalendar
     * @param {Blob | string} fileContent Accepts the file object or string format of an .ics file.
     * @returns {void}
     */
    public importICalendar(fileContent: Blob | string): void {
        if (this.iCalendarImportModule) {
            this.iCalendarImportModule.initializeCalendarImport(fileContent);
        } else {
            console.warn('[WARNING] :: Module "ICalendarImport" is not available in Schedule component!' +
                ' You either misspelled the module name or forgot to load it.');
            throw Error('Inject ICalendarImport module');
        }
    }

    /**
     * Adds the newly created event into the Schedule dataSource.
     *
     * @function addEvent
     * @param {Object | Object[]} data Single or collection of event objects to be added into Schedule.
     * @returns {void}
     */
    public addEvent(data: Record<string, any> | Record<string, any>[]): void {
        this.crudModule.addEvent(data);
    }

    /**
     * Generates the occurrences of a single recurrence event based on the provided event.
     *
     * @function generateEventOccurrences
     * @param {Object} event Accepts the parent recurrence event from which the occurrences are generated.
     * @param {Date} startDate Accepts the start date for the event occurrences. If not provided, the event's start date will be used.
     * @returns {Object[]} Returns the collection of occurrence event objects.
     */
    public generateEventOccurrences(event: Record<string, any>, startDate?: Date): Record<string, any>[] {
        return (this.eventBase) ? this.eventBase.generateOccurrence(event, startDate) : [];
    }

    /**
     * Allows the Scheduler events data to be exported as an Excel file either in .xlsx or .csv file formats.
     * By default, the whole event collection bound to the Scheduler gets exported as an Excel file.
     * To export only the specific events of Scheduler, you need to pass the custom data collection as
     * a parameter to this `exportToExcel` method. This method accepts the export options as arguments such as fileName,
     * exportType, fields, customData, and includeOccurrences. The `fileName` denotes the name to be given for the exported
     * file and the `exportType` allows you to set the format of an Excel file to be exported either as .xlsx or .csv.
     * The custom or specific field collection of event dataSource to be exported can be provided through `fields` option
     * and the custom data collection can be exported by passing them through the `customData` option. There also exists
     * option to export each individual instances of the recurring events to an Excel file, by setting true or false to the
     * `includeOccurrences` option, denoting either to include or exclude the occurrences as separate instances on an exported Excel file.
     *
     * @function exportToExcel
     * @param {ExportOptions} excelExportOptions The export options to be set before start with exporting the Scheduler events to an Excel file.
     * @returns {void}
     */
    public exportToExcel(excelExportOptions?: ExportOptions): void {
        if (this.excelExportModule) {
            this.excelExportModule.initializeExcelExport(excelExportOptions);
        } else {
            console.warn('[WARNING] :: Module "ExcelExport" is not available in Schedule component!' +
                ' You either misspelled the module name or forgot to load it.');
            throw Error('Inject ExcelExport module');
        }
    }

    /**
     * Method allows to print the scheduler.
     *
     * @function print
     * @param {ScheduleModel} printOptions The export options to be set before start with exporting
     * the Scheduler events to the print window.
     * @returns {void}
     */
    public print(printOptions?: ScheduleModel): void {
        if (this.printModule) {
            this.printModule.print(printOptions);
        } else {
            console.warn('[WARNING] :: Module "Print" is not available in Schedule component!' +
                ' You either misspelled the module name or forgot to load it.');
            throw Error('Inject Print module');
        }
    }

    /**
     * Updates the changes made in the event object by passing it as an parameter into the dataSource.
     *
     * @function saveEvent
     * @param {Object | Object[]} data Single or collection of event objects to be saved into Schedule.
     * @param {CurrentAction} currentAction Denotes the action that takes place either for editing occurrence or series.
     *  The valid current action names are `EditOccurrence` or `EditSeries`.
     * @returns {void}
     */
    public saveEvent(data: Record<string, any> | Record<string, any>[], currentAction?: CurrentAction): void {
        this.crudModule.saveEvent(data, currentAction);
    }

    /**
     * Deletes the events based on the provided ID or event collection in the argument list.
     *
     * @function deleteEvent
     * @param {string | number | Object | Object[]} id Accepts the ID as string or number type or single or collection of the event object which needs to be removed from the Schedule.
     * @param {CurrentAction} currentAction Denotes the delete action that takes place either on occurrence or series events.
     *  The valid current action names are `Delete`, `DeleteOccurrence` or `DeleteSeries`.
     * @returns {void}
     */
    public deleteEvent(id: string | number | Record<string, any> | Record<string, any>[], currentAction?: CurrentAction): void {
        this.crudModule.deleteEvent(id, currentAction);
    }

    /**
     * Retrieves the entire collection of events bound to the Schedule.
     *
     * @function getEvents
     * @param {Date} startDate Accepts the start date.
     * @param {Date} endDate Accepts te end date.
     * @param {boolean} includeOccurrences Accepts the boolean value to process the occurrence from recurrence series.
     * @returns {Object[]} Returns the collection of event objects from the Schedule.
     */
    public getEvents(startDate?: Date, endDate?: Date, includeOccurrences?: boolean): Record<string, any>[] {
        let eventCollections: Record<string, any>[] = [];
        if (includeOccurrences) {
            eventCollections = this.eventBase.getProcessedEvents();
        } else {
            eventCollections = this.eventsData;
        }
        if (startDate) {
            startDate = this.getDateTime(startDate);
        }
        if (endDate) {
            endDate = this.getDateTime(endDate);
        }
        eventCollections = this.eventBase.filterEventsByRange(eventCollections, startDate, endDate);
        return eventCollections;
    }

    /**
     * Retrieves the entire collection of block events bound to the Schedule.
     *
     * @function getBlockEvents
     * @param {Date} startDate Accepts the start date.
     * @param {Date} endDate Accepts te end date.
     * @param {boolean} includeOccurrences Accepts the boolean value to process the occurrence from recurrence series.
     * @returns {Object[]} Returns the collection of block event objects from the Schedule.
     */
    public getBlockEvents(startDate?: Date, endDate?: Date, includeOccurrences?: boolean): Record<string, any>[] {
        let eventCollections: Record<string, any>[] = [];
        if (includeOccurrences) {
            eventCollections = this.eventBase.getProcessedEvents(this.blockData);
        } else {
            eventCollections = this.blockData;
        }
        if (startDate) {
            startDate = this.getDateTime(startDate);
        }
        if (endDate) {
            endDate = this.getDateTime(endDate);
        }
        eventCollections = this.eventBase.filterEventsByRange(eventCollections, startDate, endDate);
        return eventCollections;
    }

    /**
     * Retrieves the occurrences of a single recurrence event based on the provided parent ID.
     *
     * @function getOccurrencesByID
     * @param {number} eventID ID of the parent recurrence data from which the occurrences are fetched.
     * @returns {Object[]} Returns the collection of occurrence event objects.
     */
    public getOccurrencesByID(eventID: number | string): Record<string, any>[] {
        return this.eventBase.getOccurrencesByID(eventID);
    }

    /**
     * Retrieves all the occurrences that lies between the specific start and end time range.
     *
     * @function getOccurrencesByRange
     * @param {Date} startTime Denotes the start time range.
     * @param {Date} endTime Denotes the end time range.
     * @returns {Object[]} Returns the collection of occurrence event objects that lies between the provided start and end time.
     */
    public getOccurrencesByRange(startTime: Date, endTime: Date): Record<string, any>[] {
        startTime = this.getDateTime(startTime);
        endTime = this.getDateTime(endTime);
        return this.eventBase.getOccurrencesByRange(startTime, endTime);
    }

    /**
     * Retrieves the dates that lies on active view of Schedule.
     *
     * @function getCurrentViewDates
     * @returns {Date[]} Returns the collection of dates.
     */
    public getCurrentViewDates(): Date[] {
        return this.activeView ? this.activeView.renderDates : [];
    }

    /**
     * Set the recurrence editor instance from custom editor template.
     *
     * @function setRecurrenceEditor
     * @param {RecurrenceEditor} recurrenceEditor instance has passed to fetch the instance in event window.
     * @returns {void}
     */
    public setRecurrenceEditor(recurrenceEditor: RecurrenceEditor): void {
        this.eventWindow.setRecurrenceEditor(recurrenceEditor);
    }

    /**
     * Get the maximum id of an event.
     *
     * @function getEventMaxID
     * @returns {number | string} Returns the maximum ID from scheduler data collections.
     */
    public getEventMaxID(): number | string {
        return this.eventBase.getEventMaxID();
    }

    /**
     * Get deleted occurrences from given recurrence series.
     *
     * @function getDeletedOccurrences
     * @param {string | number | Object} recurrenceData Accepts the parent ID of the event object or parent event object
     * @returns {Object[]} Returns the collection of deleted occurrence events.
     */
    public getDeletedOccurrences(recurrenceData: string | number | Record<string, any>): Record<string, any>[] {
        return this.eventBase.getDeletedOccurrences(recurrenceData);
    }

    /**
     * Retrieves the events that lies on the current date range of the active view of Schedule.
     *
     * @function getCurrentViewEvents
     * @returns {Object[]} Returns the collection of events.
     */
    public getCurrentViewEvents(): Record<string, any>[] {
        return this.eventsProcessed;
    }

    /**
     * Refreshes the event dataSource. This method may be useful when the events alone in the schedule needs to be re-rendered.
     *
     * @function refreshEvents
     * @param {boolean} isRemoteRefresh Accepts the boolean to refresh data from remote or local
     * @returns {void}
     */
    public refreshEvents(isRemoteRefresh: boolean = true): void {
        if (isRemoteRefresh) {
            if (this.dragAndDropModule) {
                this.dragAndDropModule.actionObj.action = '';
                removeClass([this.element], cls.EVENT_ACTION_CLASS);
            }
            this.crudModule.refreshDataManager();
        } else {
            if (this.uiStateValues) {
                this.uiStateValues.isPreventTimezone = true;
            }
            if (this.crudModule) {
                this.crudModule.refreshProcessedData();
            }
            if (this.uiStateValues) {
                this.uiStateValues.isPreventTimezone = false;
            }
        }
    }

    /**
     * Method to refresh the given Schedule templates
     *
     * @param {string} templateName Accepts the template name
     * @returns {void}
     */
    public refreshTemplates(templateName?: string): void {
        if (templateName) {
            this.resetTemplates([templateName]);
        } else {
            this.resetTemplates();
        }
        switch (templateName) {
        case 'eventTemplate':
            this.appointmentTemplateFn = this.templateParser(this.activeViewOptions.eventTemplate);
            this.refreshEvents(false);
            break;
        case 'dateHeaderTemplate':
            this.dateHeaderTemplateFn = this.templateParser(this.activeViewOptions.dateHeaderTemplate);
            this.activeView.refreshHeader();
            break;
        case 'dateRangeTemplate':
            this.dateRangeTemplateFn = this.templateParser(this.activeViewOptions.dateRangeTemplate);
            if (this.headerModule) {
                this.headerModule.refresh();
            }
            break;
        case 'resourceHeaderTemplate':
            this.resourceHeaderTemplateFn = this.templateParser(this.activeViewOptions.resourceHeaderTemplate);
            if (this.activeView.isTimelineView()) {
                this.activeView.refreshResourceHeader();
            } else {
                this.activeView.refreshHeader();
            }
            break;
        case 'quickInfoTemplates':
            if (this.quickPopup) {
                this.quickPopup.destroy();
                this.quickPopup = null;
            }
            this.quickPopup = new QuickPopups(this);
            this.quickInfoTemplatesHeaderFn = this.templateParser(this.quickInfoTemplates.header);
            this.quickInfoTemplatesContentFn = this.templateParser(this.quickInfoTemplates.content);
            this.quickInfoTemplatesFooterFn = this.templateParser(this.quickInfoTemplates.footer);
            break;
        case 'editorTemplate':
            this.destroyEditorWindow();
            this.editorTemplateFn = this.templateParser(this.editorTemplate);
            break;
        case 'editorHeaderTemplate':
            this.destroyEditorWindow();
            this.editorHeaderTemplateFn = this.templateParser(this.editorHeaderTemplate);
            break;
        case 'editorFooterTemplate':
            this.destroyEditorWindow();
            this.editorFooterTemplateFn = this.templateParser(this.editorFooterTemplate);
            break;
        case 'tooltipTemplate':
        case 'headerTooltipTemplate':
            if (this.eventTooltip) {
                this.eventTooltip.destroy();
                this.eventTooltip = null;
            }
            this.eventTooltip = new EventTooltip(this);
            this.eventTooltipTemplateFn = this.templateParser(this.eventSettings.tooltipTemplate);
            this.headerTooltipTemplateFn = this.templateParser(this.activeViewOptions.group.headerTooltipTemplate);
            break;
        default:
            this.initializeView(this.currentView);
            break;
        }
    }

    /**
     * Refreshes the Schedule layout without re-render.
     *
     * @function refreshLayout
     * @returns {void}
     */
    public refreshLayout(): void {
        this.onScheduleResize();
        if (this.headerModule) {
            this.headerModule.refresh();
        }
        if (this.eventWindow) {
            this.eventWindow.refresh();
        }
    }

    /**
     * To retrieve the appointment object from element.
     *
     * @function getEventDetails
     * @param {Element} element Denotes the event UI element on the Schedule.
     * @returns {Object} Returns the event details.
     */
    public getEventDetails(element: Element): Record<string, any> {
        element = getElement(element);
        const guid: string = element.getAttribute('data-guid');
        if (guid) {
            return this.eventBase.getEventByGuid(guid);
        }
        return {};
    }

    /**
     * To check whether the given time range slots are available for event creation or already occupied by other events.
     * This method currently focuses on validating appointments within the current view date range.
     * However, it does not extend this availability check to recurrence occurrences outside of the current date range.
     *
     * @function isSlotAvailable
     * @param {Date | Object} startTime Denotes the start time of the slot.
     * @param {Date} endTime Denotes the end time of the slot.
     * @param {number} groupIndex Defines the resource index from last level.
     * @returns {boolean} Returns true, if the slot that lies in the provided time range does not contain any other events.
     */
    public isSlotAvailable(startTime: Date | Record<string, any>, endTime?: Date, groupIndex?: number): boolean {
        let eventStart: Date;
        let eventEnd: Date;
        let eventObj: Record<string, any> = this.activeEventData.event as Record<string, any>;
        if (startTime instanceof Date || typeof (startTime) === 'string') {
            eventStart = startTime as Date;
            eventEnd = endTime;
        } else {
            eventObj = startTime as Record<string, any>;
            eventStart = (<Record<string, any>>startTime)[this.eventFields.startTime] as Date;
            eventEnd = (<Record<string, any>>startTime)[this.eventFields.endTime] as Date;
            if (this.resourceBase) {
                groupIndex = this.eventBase.getGroupIndexFromEvent(startTime as Record<string, any>);
            }
        }
        if (isNullOrUndefined(eventStart) || isNullOrUndefined(eventEnd)) {
            return true;
        }
        eventStart = this.getDateTime(eventStart);
        eventEnd = this.getDateTime(eventEnd);
        let eventCollection: Record<string, any>[] = this.eventBase.filterEvents(eventStart, eventEnd);
        if (!isNullOrUndefined(groupIndex) && this.resourceBase && this.resourceBase.lastResourceLevel.length > 0) {
            eventCollection =
                this.eventBase.filterEventsByResource(this.resourceBase.lastResourceLevel[parseInt(groupIndex.toString(), 10)],
                                                      eventCollection);
        }
        if (eventObj) {
            if (eventObj.Guid) {
                eventCollection = eventCollection.filter((event: Record<string, any>) => event.Guid !== eventObj.Guid);
            } else {
                eventCollection = eventCollection.filter((event: Record<string, any>) =>
                    event[this.eventFields.id] !== eventObj[this.eventFields.id]);
            }
        }
        return (eventCollection.length > 0) ? false : true;
    }

    /**
     * Method to copy events from an HTMLElement or an array of HTMLElements.
     *
     * @param { HTMLElement[] } elements Accepts an array of HTMLElement
     * @returns {void} This method does not return a value.
     */
    public copy(elements: HTMLElement[]): void {
        this.processCutCopyActions(elements, false);
    }

    /**
     * Method to cut events from an HTMLElement or an array of HTMLElements.
     *
     * @param { HTMLElement[] } elements Accepts an array of HTMLElement
     * @returns {void} This method does not return a value.
     */
    public cut(elements: HTMLElement[]): void {
        this.processCutCopyActions(elements, true);
    }

    /**
     * Method to create a paste event with clipboard data
     *
     * @param { HTMLElement } targetElement Accepts HTMLElement
     * @returns {void}
     */
    public paste(targetElement: HTMLElement): void {
        if (!this.allowClipboard || !this.allowKeyboardInteraction || !targetElement) {
            return;
        }
        if (!targetElement.classList.contains('e-work-cells') && !targetElement.classList.contains('e-all-day-cells')) {
            return;
        }
        if (!this.activeCellsData) {
            const cellData: CellClickEventArgs = this.getCellDetails([targetElement]);
            if (cellData) {
                this.activeCellsData = cellData;
            }
        }
        const clipboardData: DataTransfer = new DataTransfer();
        if (!isNullOrUndefined((navigator as any).clipboard)) {
            (navigator as any).clipboard.readText()
                .then((text: string) => {
                    clipboardData.setData('text/plain', text);
                    const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', {
                        bubbles: true,
                        cancelable: true
                    });
                    Object.defineProperty(pasteEvent, 'clipboardData', {
                        value: clipboardData
                    });
                    this.keyboardInteractionModule.pasteHandler(pasteEvent, targetElement);
                })
                .catch((err: Error) => {
                    throw err;
                });
        }
    }

    private processCutCopyActions(elements: HTMLElement[], isCut: boolean): void {
        if (!elements || !this.allowClipboard || !this.allowKeyboardInteraction) {
            return;
        }
        const elementArray: HTMLElement[] = elements;
        const eventDetailsArray: Record<string, any>[] = [];
        elementArray.forEach((element: HTMLElement) => {
            if (element.classList.contains(cls.APPOINTMENT_CLASS)) {
                const eventDetail: Record<string, any> = this.getEventDetails(element);
                if (eventDetail) {
                    eventDetailsArray.push(eventDetail);
                }
            }
        });
        if (eventDetailsArray.length > 0) {
            this.keyboardInteractionModule.processClipboardAction(isCut, eventDetailsArray);
        }
    }

    /**
     * To manually open the event editor on specific time or on certain events.
     *
     * @function openEditor
     * @param {Object} data It can be either cell data or event data.
     * @param {CurrentAction} action Defines the action for which the editor needs to be opened such as either for new event creation or
     *  for editing of existing events. The applicable action names that can be used here are `Add`, `Save`, `EditOccurrence`
     *  and `EditSeries`.
     * @param {boolean} isEventData It allows to decide whether the editor needs to be opened with the clicked cell details or with the
     *  passed event details.
     * @param {number} repeatType It opens the editor with the recurrence options based on the provided repeat type.
     * @returns {void}
     */
    public openEditor(data: Record<string, any>, action: CurrentAction, isEventData?: boolean, repeatType?: number): void {
        if (action === 'Add' && !isEventData) {
            data.startTime = this.getDateTime(<Date>data.startTime);
            data.endTime = this.getDateTime(<Date>data.endTime);
            if (!isNullOrUndefined(data.element)) {
                data.element = getElement(data.element as HTMLElement);
            }
        } else {
            data[this.eventFields.startTime] = this.getDateTime(<Date>data[this.eventFields.startTime]);
            data[this.eventFields.endTime] = this.getDateTime(<Date>data[this.eventFields.endTime]);
        }
        this.currentAction = action;
        if (action !== 'Add') {
            this.activeEventData.event = data as Record<string, any>;
        }
        this.eventWindow.openEditor(data, action, isEventData, repeatType);
    }

    /**
     * To manually close the event editor window
     *
     * @function closeEditor
     * @returns {void}
     */
    public closeEditor(): void {
        if (this.eventWindow) {
            this.eventWindow.dialogClose();
        }
    }

    /**
     * To manually open the quick info popup based on cell or event details.
     *
     * @param {object} data Defines the cell or event data. If the data contains valid ID, it will open event quick info popup,
     * otherwise cell quick info popup displayed.
     * @returns {void}
     */
    public openQuickInfoPopup(data: Record<string, any>): void {
        if (this.currentView === 'Year' || isNullOrUndefined(data)) {
            return;
        }
        if (isNullOrUndefined(data[this.eventFields.id])) {
            if (this.currentView === 'Agenda' || this.currentView === 'MonthAgenda' || isNullOrUndefined(this.activeView)) {
                return;
            }
            const cellData: CellClickEventArgs = {
                startTime: this.activeCellsData.startTime = this.getDateTime(<Date>data[this.eventFields.startTime]),
                endTime: this.activeCellsData.endTime = this.getDateTime(<Date>data[this.eventFields.endTime]),
                isAllDay: this.activeCellsData.isAllDay =
                    !isNullOrUndefined(data[this.eventFields.isAllDay]) ? data[this.eventFields.isAllDay] : false
            };
            const startTime: Date = this.activeView.getAdjustedDate(new Date(cellData.startTime));
            if (startTime) {
                let query: string = '.' + cls.WORK_CELLS_CLASS + '[data-date="' + startTime.getTime() + '"]';
                if (this.activeViewOptions.group.resources.length > 0 && !this.uiStateValues.isGroupAdaptive
                    && this.resourceBase && this.eventBase) {
                    cellData.groupIndex = this.eventBase.getGroupIndexFromEvent(data as Record<string, any>);
                    query = '.' + cls.WORK_CELLS_CLASS + '[data-date="' + startTime.getTime() + '"][data-group-index="' + cellData.groupIndex + '"]';
                }
                const workCell: HTMLElement = this.element.querySelector(query);
                if (workCell) {
                    workCell.focus();
                    cellData.element = workCell;
                    this.notify(events.cellClick, cellData);
                }
            }
        }
        else {
            const app: Record<string, any>[] = this.getCurrentViewEvents().filter((item: Record<string, any>) =>
                data[this.eventFields.id] === item[this.eventFields.id]);
            if (app.length <= 0) {
                return;
            }
            let selectEvent: Record<string, any> = app[0];
            if (data[this.eventFields.recurrenceRule]) {
                const occurence: Record<string, any> = app.filter((x: Record<string, any>) =>
                    x[this.eventFields.startTime].getTime() === data[this.eventFields.startTime].getTime());
                if (occurence.length > 0) {
                    selectEvent = occurence[0];
                }
            }
            const element: HTMLElement = this.element.querySelector('div[data-guid="' + selectEvent.Guid + '"]');
            if (element) {
                this.eventBase.removeSelectedAppointmentClass();
                this.eventBase.addSelectedAppointments([element], false);
                this.activeEventData = { event: selectEvent, element: element } as EventClickArgs;
                if (this.currentView === 'Agenda' || this.currentView === 'MonthAgenda') {
                    addClass([this.activeEventData.element as Element], cls.AGENDA_SELECTED_CELL);
                }
                this.notify(events.eventClick, this.activeEventData);
            }
        }
    }

    /**
     * To manually close the quick info popup
     *
     * @function closeQuickInfoPopup
     * @returns {void}
     */
    public closeQuickInfoPopup(): void {
        if (this.quickPopup) {
            this.quickPopup.quickPopupHide(true);
        }
    }

    /**
     * To manually open the overlap validation Alert.
     *
     * @param {PopupOpenEventArgs} args The arguments for opening the popup.
     * @param {string} args.type Defines the type of overlap alert (e.g., 'OverlapAlert').
     * @param {Record<string, any>} args.data The data associated with the popup.
     * @param {Record<string, any>[]} args.overlapEvents The overlap events.
     * @returns {void}
     */
    public openOverlapAlert(args: PopupOpenEventArgs): void {
        if (this.quickPopup) {
            const eventProp: PopupOpenEventArgs = {
                type: 'OverlapAlert',
                cancel: false,
                element: this.quickPopup.quickDialog.element,
                data: args.data,
                overlapEvents: args.overlapEvents
            };
            this.trigger(events.popupOpen, eventProp, (popupArgs: PopupOpenEventArgs) => {
                if (!popupArgs.cancel) {
                    this.quickPopup.openValidationError('overlapAlert', args.data);
                }
            });
        }
    }

    /**
     * To manually close the overlap validation Alert.
     *
     * @function closeOverlapValidationAlert
     * @returns {void}
     */
    public closeOverlapAlert(): void {
        if (this.quickPopup) {
            const args: PopupCloseEventArgs = {
                type: 'OverlapAlert',
                cancel: false,
                data: this.activeEventData.event,
                element: this.quickPopup.quickDialog.element
            };
            this.trigger(events.popupClose, args, (popupArgs: PopupCloseEventArgs) => {
                if (!popupArgs.cancel) {
                    this.quickPopup.quickDialog.hide();
                }
            });
        }
    }

    /**
     * Closes the tooltip.
     * For example, when the context menu is opened for an event,
     * the tooltip can be closed by calling this method.
     *
     * @function closeTooltip
     * @returns {void}
     */
    public closeTooltip(): void {
        if (this.eventTooltip) {
            this.eventTooltip.close();
        }
    }

    /**
     * Retrieves a formatted string representing the date range of the given date collection.
     *
     * @param {Date[]} dates - An array of Date objects representing the date range.
     * @returns {string} A formatted string describing the date range.
     *   If the dates is empty, returns an empty string.
     *   Otherwise, delegates to the active view to generate the appropriate date range text.
     *
     * @example
     * // Assuming dates contains dates from May 1, 2023 to May 7, 2023
     * const rangeText = schedule.getDateRangeText(schedule.getViewDates());
     * // rangeText might be "May 1 - 7, 2023" (actual format depends on the active view)
     *
     * @remarks
     * The actual format of the returned string depends on the implementation
     * of the getDateRangeText method in the active view.
     */
    public getDateRangeText(dates: Date[]): string {
        if ((isNullOrUndefined(dates) && dates.length === 0) || !this.activeView) {
            return '';
        }
        return this.activeView.getDateRangeText(dates[0], dates);
    }

    /**
     * Retrieves an array of dates based on the specified date collection direction.
     *
     * @param {NavigationDirection} type - The direction for date collection. Options are:
     *   - 'Previous': Returns the previous date range collection from the current rendered date.
     *   - 'Next': Returns the next date range collection from the current rendered date.
     *   - 'Current': Returns the current rendered date collection.
     *
     * @returns {Date[]} An array of Date objects representing the view dates.
     */
    public getViewDates(type: NavigationDirection = 'Current'): Date[] {
        if (!this.activeView) {
            return [];
        }
        switch (type) {
        case 'Previous':
        case 'Next':
            return this.activeView.getRenderDates(undefined, this.activeView.getNextPreviousDate(type));
        case 'Current':
            return this.getCurrentViewDates();
        }
    }

    /**
     * Select the resource based on group index in mobile mode.
     *
     * @param {number} groupIndex Defines the resource index based on last level.
     * @returns {void}
     */
    public selectResourceByIndex(groupIndex: number): void {
        if (this.resourceBase && this.uiStateValues.isGroupAdaptive) {
            this.resourceBase.selectResourceByIndex(groupIndex);
        }
    }

    /**
     * Select the resources to the based on id.
     *
     * @param {string | number} id id of the resource defined in resources collection.
     * @param {string} name Name of the resource defined in resources collection.
     * @returns {number} Returns the group index
     */
    public getIndexFromResourceId(id: string | number, name?: string): number {
        if (this.resourceBase) {
            return this.resourceBase.getIndexFromResourceId(id, name);
        }
        return null;
    }

    /**
     * Adds the resources to the specified index.
     *
     * @param {Object | Object[]} resources Accepts the resource data in single or collection of data.
     * @param {string} name Name of the resource defined in resources collection.
     * @param {number} index Index or position where the resource should be added.
     * @returns {void}
     */
    public addResource(resources: Record<string, any> | Record<string, any>[], name: string, index: number): void {
        this.resourceBase.addResource(resources, name, index);
    }

    /**
     * Removes the specified resource.
     *
     * @param {string | string[] | number | number[]} resourceId Specifies the resource id to be removed.
     * @param {string} name Specifies the resource name from which the id should be referred.
     * @returns {void}
     */
    public removeResource(resourceId: string | string[] | number | number[], name: string): void {
        this.resourceBase.removeResource(resourceId, name);
    }

    /**
     * Destroys the Schedule component.
     *
     * @function destroy
     * @returns {void}
     */
    public destroy(): void {
        if (this.eventTooltip) {
            this.eventTooltip.destroy();
            this.eventTooltip = null;
        }
        this.destroyPopups();
        this.hideSpinner();
        this.unWireEvents();
        this.destroyHeaderModule();
        if (this.eventBase) {
            this.eventBase.destroy();
            this.eventBase = null;
        }
        if (this.workCellAction) {
            this.workCellAction.destroy();
            this.workCellAction = null;
        }
        if (this.inlineModule) {
            this.inlineModule.destroy();
            this.inlineModule = null;
        }
        if (this.keyboardInteractionModule) {
            this.keyboardInteractionModule.destroy();
            this.keyboardInteractionModule = null;
        }
        if (this.scrollModule) {
            this.scrollModule.destroy();
            this.scrollModule = null;
        }
        if (this.printModule) {
            this.printModule.destroy();
        }
        if (this.activeView) {
            this.resetTemplates();
            this.activeView.removeEventListener();
            this.activeView.destroy();
            this.activeView = null;
        }
        if (this.scheduleTouchModule) {
            this.scheduleTouchModule.destroy();
            this.scheduleTouchModule = null;
        }
        if (this.crudModule) {
            this.crudModule.destroy();
            this.crudModule = null;
        }
        if (this.dataModule) {
            this.dataModule.destroy();
            this.dataModule = null;
        }
        super.destroy();
        const modules: string[] = [
            'dayModule', 'weekModule', 'workWeekModule', 'monthModule', 'monthAgendaModule', 'yearModule', 'agendaModule',
            'timelineViewsModule', 'timelineMonthModule', 'timelineYearModule', 'resizeModule', 'dragAndDropModule',
            'excelExportModule', 'printModule', 'iCalendarExportModule', 'iCalendarImportModule', 'tzModule', 'eventsData',
            'eventsProcessed', 'blockData', 'blockProcessed', 'uiStateValues', 'viewCollections', 'viewOptions', 'defaultLocale',
            'localeObj', 'selectedElements', 'resourceCollection', 'editorTitles', 'eventFields', 'activeViewOptions',
            'activeEventData', 'activeCellsData', 'renderModule'
        ];
        for (const module of modules) {
            (this as any)[`${module}`] = null;
        }
        util.removeChildren(this.element);
        let removeClasses: string[] = [cls.ROOT, cls.RTL, cls.DEVICE_CLASS, cls.MULTI_DRAG];
        if (this.cssClass) {
            removeClasses = removeClasses.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], removeClasses);
    }

}
