import { Component, ModuleDeclaration, Property, Event, Animation, Collection } from '@syncfusion/ej2-base';
import { EventHandler, EmitType, Browser, Internationalization, getDefaultDateObject, cldrData, L10n } from '@syncfusion/ej2-base';
import { getValue, compile, extend, isNullOrUndefined, NotifyPropertyChanges, INotifyPropertyChanged, Complex } from '@syncfusion/ej2-base';
import { removeClass, addClass, classList, remove } from '@syncfusion/ej2-base';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { ScheduleModel } from './schedule-model';
import { HeaderRenderer } from '../renderer/header-renderer';
import { Scroll } from '../actions/scroll';
import { ScheduleTouch } from '../actions/touch';
import { KeyboardInteraction } from '../actions/keyboard';
import { Data } from '../actions/data';
import { View, CurrentAction, ReturnType } from '../base/type';
import { EventBase } from '../event-renderer/event-base';
import { QuickPopups } from '../popups/quick-popups';
import { EventTooltip } from '../popups/event-tooltip';
import { EventWindow } from '../popups/event-window';
import { Render } from '../renderer/renderer';
import { Day } from '../renderer/day';
import { Week } from '../renderer/week';
import { WorkWeek } from '../renderer/work-week';
import { Month } from '../renderer/month';
import { Agenda } from '../renderer/agenda';
import { MonthAgenda } from '../renderer/month-agenda';
import { TimelineViews } from '../renderer/timeline-view';
import { TimelineMonth } from '../renderer/timeline-month';
import { WorkHours } from '../models/work-hours';
import { TimeScale } from '../models/time-scale';
import { QuickInfoTemplates } from '../models/quick-info-templates';
import { HeaderRows } from '../models/header-rows';
import { Crud } from '../actions/crud';
import { Resize } from '../actions/resize';
import { DragAndDrop } from '../actions/drag';
import { VirtualScroll } from '../actions/virtual-scroll';
import { WorkHoursModel, ViewsModel, EventSettingsModel, GroupModel, ResourcesModel, TimeScaleModel } from '../models/models';
import { QuickInfoTemplatesModel, HeaderRowsModel } from '../models/models';
import { EventSettings } from '../models/event-settings';
import { Group } from '../models/group';
import { Resources } from '../models/resources';
import { ICalendarExport } from '../exports/calendar-export';
import { ICalendarImport } from '../exports/calendar-import';
import { IRenderer, ActionEventArgs, NavigatingEventArgs, CellClickEventArgs, RenderCellEventArgs, ScrollCss } from '../base/interface';
import { EventClickArgs, EventRenderedArgs, PopupOpenEventArgs, UIStateArgs, DragEventArgs, ResizeEventArgs } from '../base/interface';
import { EventFieldsMapping, TdData, ResourceDetails, ResizeEdges, StateArgs, ExportOptions, SelectEventArgs } from '../base/interface';
import { ResourceBase } from '../base/resource';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
import { CalendarUtil, Gregorian, Islamic, CalendarType } from '../../common/calendar-util';
import { ExcelExport } from '../exports/excel-export';

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
    public isAdaptive: Boolean;
    public dataModule: Data;
    public eventTooltip: EventTooltip;
    public eventWindow: EventWindow;
    public renderModule: Render;
    public headerModule: HeaderRenderer;
    public scrollModule: Scroll;
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
    public resourceBase: ResourceBase;
    private cellTemplateFn: Function;
    private dateHeaderTemplateFn: Function;
    private majorSlotTemplateFn: Function;
    private minorSlotTemplateFn: Function;
    private appointmentTemplateFn: Function;
    private eventTooltipTemplateFn: Function;
    private headerTooltipTemplateFn: Function;
    private editorTemplateFn: Function;
    private quickInfoTemplatesHeaderFn: Function;
    private quickInfoTemplatesContentFn: Function;
    private quickInfoTemplatesFooterFn: Function;
    private resourceHeaderTemplateFn: Function;
    private defaultLocale: Object;
    public dayModule: Day;
    public weekModule: Week;
    public workWeekModule: WorkWeek;
    public monthAgendaModule: MonthAgenda;
    public monthModule: Month;
    public agendaModule: Agenda;
    public timelineViewsModule: TimelineViews;
    public timelineMonthModule: TimelineMonth;
    public resizeModule: Resize;
    public dragAndDropModule: DragAndDrop;
    public excelExportModule: ExcelExport;
    public viewOptions: { [key: string]: ViewsModel[] };
    public viewCollections: ViewsModel[];
    public viewIndex: number;
    public activeViewOptions: ViewsModel;
    public eventFields: EventFieldsMapping;
    public editorTitles: EventFieldsMapping;
    public eventsData: Object[];
    public eventsProcessed: Object[];
    public blockData: Object[];
    public blockProcessed: Object[];
    public resourceCollection: ResourcesModel[];
    public currentAction: CurrentAction;
    public quickPopup: QuickPopups;
    public selectedElements: Element[];
    public uiStateValues: UIStateArgs;
    public timeFormat: string;
    public calendarUtil: CalendarUtil;

    // Schedule Options
    /**
     * Sets the `width` of the Schedule component, accepting both string and number values.
     * The string value can be either pixel or percentage format.
     * When set to `auto`, the Schedule width gets auto-adjusted and display its content related to the viewable screen size.
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;
    /**
     * Sets the `height` of the Schedule component, accepting both string and number values.
     * The string type includes either pixel or percentage values.
     * When `height` is set with specific pixel value, then the Schedule will be rendered to that specified space.
     * In case, if `auto` value is set, then the height of the Schedule gets auto-adjusted within the given container.
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;
    /**
     * When set to `false`, hides the header bar of the Schedule from UI. By default,
     *  the header bar holds the date and view navigation options, to which the user can add their own custom items onto it.
     * @default true
     */
    @Property(true)
    public showHeaderBar: boolean;
    /**
     * When set to `false`, hides the current time indicator from the Schedule. Otherwise,
     *  it visually depicts the live current system time appropriately on the user interface.
     * @default true
     */
    @Property(true)
    public showTimeIndicator: boolean;
    /**
     * To set the active view on scheduler, the `currentView` property can be used and it usually accepts either of the following available
     *  view options. The view option specified in this property will be initially loaded on the schedule.
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
     * @default 'Week'
     */
    @Property('Week')
    public currentView: View;
    /**
     * This property holds the views collection and its configurations. It accepts either the array of view names or the array of view
     *  objects that holds different configurations for each views. By default,
     *  Schedule displays all the views namely `Day`, `Week`, `Work Week`, `Month` and `Agenda`.
     * Example for array of views:
     * {% codeBlock src="schedule/view-api/index.ts" %}{% endcodeBlock %}
     * Example for array of view objects:
     * {% codeBlock src="schedule/view-api/array.ts" %}{% endcodeBlock %}
     * @default '['Day', 'Week', 'WorkWeek', 'Month', 'Agenda']'
     */
    @Property(['Day', 'Week', 'WorkWeek', 'Month', 'Agenda'])
    public views: View[] | ViewsModel[];
    /**
     * To mark the active (current) date on the Schedule, `selectedDate` property can be defined.
     *  Usually, it defaults to the current System date.
     * @default 'new Date()'
     */
    @Property(new Date())
    public selectedDate: Date;
    /**
     * By default, Schedule follows the date-format as per the default culture assigned to it.
     *  It is also possible to manually set specific date format by using the `dateFormat` property. 
     * The format of the date range label in the header bar depends on the `dateFormat` value or else based on the 
     * locale assigned to the Schedule. 
     * @default null
     */
    @Property()
    public dateFormat: string;
    /**
     *  It allows the Scheduler to display in other calendar modes. 
     * By default, Scheduler is displayed in `Gregorian` calendar mode. 
     * To change the mode, you can set either `Gregorian` or `Islamic` as a value to this `calendarMode` property. 
     * @default 'Gregorian'
     */
    @Property('Gregorian')
    public calendarMode: CalendarType;
    /**
     * When set to `false`, it hides the weekend days of a week from the Schedule. The days which are not defined in the working days
     *  collection are usually treated as weekend days.
     * Note: By default, this option is not applicable on `Work Week` view.
     * For example, if the working days are defined as [1, 2, 3, 4], then the remaining days of that week will be considered as
     *  the weekend days and will be hidden on all the views.
     * @default true
     */
    @Property(true)
    public showWeekend: boolean;
    /**
     * This option allows the user to set the first day of a week on Schedule. It should be based on the locale set to it and each culture
     *  defines its own first day of week values. If needed, the user can set it manually on his own by defining the value through
     *  this property. It usually accepts the integer values, whereby 0 is always denoted as Sunday, 1 as Monday and so on.
     * @default 0
     */
    @Property(0)
    public firstDayOfWeek: number;
    /**
     * It is used to set the working days on Schedule. The only days that are defined in this collection will be rendered on the `workWeek`
     *  view whereas on other views, it will display all the usual days and simply highlights the working days with different shade.
     * @default '[1, 2, 3, 4, 5]'
     * @aspType int[]
     */
    @Property([1, 2, 3, 4, 5])
    public workDays: number[];
    /**
     * It is used to specify the starting hour, from which the Schedule starts to display. It accepts the time string in a short skeleton
     *  format and also, hides the time beyond the specified start time.
     * @default '00:00'
     */
    @Property('00:00')
    public startHour: string;
    /**
     * It is used to specify the end hour, at which the Schedule ends. It too accepts the time string in a short skeleton format.
     * @default '24:00'
     */
    @Property('24:00')
    public endHour: string;
    /**
     * When set to `true`, allows the resizing of appointments. It allows the rescheduling of appointments either by changing the
     *  start or end time by dragging the event resize handlers.
     * @default true
     */
    @Property(true)
    public allowResizing: boolean;
    /**
     * The working hours should be highlighted on Schedule with different color shade and an additional option must be provided to
     *  highlight it or not. This functionality is handled through `workHours` property and the start work hour should be 9 AM by default
     *  and end work hour should point to 6 PM. The start and end working hours needs to be provided as Time value of short skeleton type.
     * @default { highlight: true, start: '09:00', end: '18:00' }
     */
    @Complex<WorkHoursModel>({}, WorkHours)
    public workHours: WorkHoursModel;
    /**
     * Allows to set different time duration on Schedule along with the customized grid count. It also has template option to
     *  customize the time slots with required time values in its own format.
     * {% codeBlock src="schedule/timescale-api/index.ts" %}{% endcodeBlock %}
     * @default { enable: true, interval: 60, slotCount: 2, majorSlotTemplate: null, minorSlotTemplate: null }
     */
    @Complex<TimeScaleModel>({}, TimeScale)
    public timeScale: TimeScaleModel;
    /**
     * When set to `true`, allows the keyboard interaction to take place on Schedule.
     * @default true
     */
    @Property(true)
    public allowKeyboardInteraction: boolean;
    /**
     * When set to `true`, allows the appointments to move over the time slots. When an appointment is dragged, both its start
     *  and end time tends to change simultaneously allowing it to reschedule the appointment on some other time.
     * @default true
     */
    @Property(true)
    public allowDragAndDrop: boolean;
    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto
     *  the date header cells. The field that can be accessed via this template is `date`.
     * {% codeBlock src="schedule/date-header-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    @Property()
    public dateHeaderTemplate: string;
    /**
     * The template option which is used to render the customized work cells on the Schedule. Here, the template accepts either
     *  the string or HTMLElement as template design and then the parsed design is displayed onto the work cells.
     *  The fields accessible via template are as follows.
     *  * date
     *  * groupIndex
     *  * type
     * {% codeBlock src="schedule/cell-template-api/index.html" %}{% endcodeBlock %}
     * {% codeBlock src="schedule/cell-template-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    @Property()
    public cellTemplate: string;
    /**
     * When set to `true`, makes the Schedule to render in a read only mode. No CRUD actions will be allowed at this time.
     * @default false
     */
    @Property(false)
    public readonly: boolean;
    /**
     * When set to `true`, displays a quick popup with cell or event details on single clicking over the cells or on events.
     *  By default, it is set to `true`.
     * @default true
     */
    @Property(true)
    public showQuickInfo: boolean;
    /**
     * When set to `true`, displays the week number of the current view date range.
     *  By default, it is set to `false`.
     * @default false
     */
    @Property(false)
    public showWeekNumber: boolean;
    /**
     * when set to `true`, allows the height of the work-cells to adjust automatically 
     * based on the number of appointments present in those time ranges. 
     * @default false
     */
    @Property(false)
    public rowAutoHeight: boolean;
    /**
     * The template option to render the customized editor window. The form elements defined within this template should be accompanied
     *  with `e-field` class, so as to fetch and process it from internally.
     * {% codeBlock src="schedule/editor-api/index.html" %}{% endcodeBlock %}
     * {% codeBlock src="schedule/editor-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    @Property()
    public editorTemplate: string;
    /**
     * The template option to customize the quick window. The three sections of the quick popup whereas the header, content,
     *  and footer can be easily customized with individual template option.
     * {% codeBlock src="schedule/quick-info-template-api/index.html" %}{% endcodeBlock %}
     * {% codeBlock src="schedule/quick-info-template-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    @Complex<QuickInfoTemplatesModel>({}, QuickInfoTemplates)
    public quickInfoTemplates: QuickInfoTemplatesModel;
    /**
     * Sets the number of days to be displayed by default in Agenda View and in case of virtual scrolling,
     *  the number of days will be fetched on each scroll-end based on this count.
     * @default 7
     */
    @Property(7)
    public agendaDaysCount: number;
    /**
     * The days which does not has even a single event to display will be hidden from the UI of Agenda View by default.
     *  When this property is set to `false`, the empty dates will also be displayed on the Schedule.
     * @default true
     */
    @Property(true)
    public hideEmptyAgendaDays: boolean;
    /**
     * Schedule will be assigned with specific timezone, so as to display the events in it accordingly. By default,
     *  Schedule dates are processed with System timezone, as no timezone will be assigned specifically to the Schedule at the initial time.
     *  Whenever the Schedule is bound to remote data services, it is always recommended to set specific timezone to Schedule to make the
     *  events on it to display on the same time irrespective of the system timezone. It usually accepts
     *  the valid [IANA](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) timezone names.
     * @default null
     */
    @Property()
    public timezone: string;
    /**
     * Complete set of settings related to Schedule events to bind it to local or remote dataSource, map applicable database fields and
     *  other validation to be carried out on the available fields.
     * @default null
     */
    @Complex<EventSettingsModel>({}, EventSettings)
    public eventSettings: EventSettingsModel;
    /**
     * Template option to customize the resource header bar. Here, the template accepts either
     *  the string or HTMLElement as template design and then the parsed design is displayed onto the resource header cells.
     * The following can be accessible via template.
     * * resource - All the resource fields.
     * * resourceData - object collection of current resource.
     * {% codeBlock src="schedule/resource-header-api/index.html" %}{% endcodeBlock %}
     * {% codeBlock src="schedule/resource-header-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    @Property()
    public resourceHeaderTemplate: string;
    /**
     * Allows defining the group related settings of multiple resources. When this property is non-empty, it means
     *  that the resources will be grouped on the schedule layout based on the provided resource names.
     * {% codeBlock src="schedule/group-api/index.ts" %}{% endcodeBlock %}
     * @default {}
     */
    @Complex<GroupModel>({}, Group)
    public group: GroupModel;
    /**
     * Allows defining the collection of resources to be displayed on the Schedule. The resource collection needs to be defined
     *  with unique resource names to identify it along with the respective dataSource and field mapping options.
     * {% codeBlock src="schedule/resources-api/index.ts" %}{% endcodeBlock %}
     * @default []
     */
    @Collection<ResourcesModel>([], Resources)
    public resources: ResourcesModel[];
    /**
     * Allows defining the collection of custom header rows to display the year, month, week, date and hour label as an individual row
     *  on the timeline view of the scheduler.
     * {% codeBlock src="schedule/header-rows-api/index.ts" %}{% endcodeBlock %}
     * @default []
     */
    @Collection<HeaderRowsModel>([], HeaderRows)
    public headerRows: HeaderRowsModel[];
    /**
     * It is used to customize the Schedule which accepts custom CSS class names that defines specific user-defined styles and themes
     *  to be applied on the Schedule element.
     * @default null
     */
    @Property()
    public cssClass: string;
    /**
     * When set to `true`, enables the RTL mode on the Schedule, so that the Schedule and its content displays in the direction
     *  from right to left.
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;
    /**
     * It enables the external drag and drop support for appointments on scheduler, to be able to move them out of the scheduler layout.
     *  When the drag area is explicitly set with specific DOM element name,
     *  the appointments can be dragged anywhere within the specified drag area location.
     * @default null
     */
    @Property()
    public eventDragArea: string;
    /**
     * Triggers after the scheduler component is created.
     * @event
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * Triggers when the scheduler component is destroyed.
     * @event
     */
    @Event()
    public destroyed: EmitType<Object>;
    /**
     * Triggers when the scheduler cells are single clicked or on single tap on the same cells in mobile devices.
     * @event
     */
    @Event()
    public cellClick: EmitType<CellClickEventArgs>;
    /**
     * Triggers when the scheduler cells are double clicked.
     * @event
     */
    @Event()
    public cellDoubleClick: EmitType<CellClickEventArgs>;
    /**
     * Triggers when multiple cells or events are selected on the Scheduler.
     * @event
     */
    @Event()
    public select: EmitType<SelectEventArgs>;
    /**
     * Triggers on beginning of every scheduler action.
     * @event
     */
    @Event()
    public actionBegin: EmitType<ActionEventArgs>;
    /**
     * Triggers on successful completion of the scheduler actions.
     * @event
     */
    @Event()
    public actionComplete: EmitType<ActionEventArgs>;
    /**
     * Triggers when a scheduler action gets failed or interrupted and an error information will be returned.
     * @event
     */
    @Event()
    public actionFailure: EmitType<ActionEventArgs>;
    /**
     * Triggers before the date or view navigation takes place on scheduler.
     * @event
     */
    @Event()
    public navigating: EmitType<NavigatingEventArgs>;
    /**
     * Triggers before each element of the schedule rendering on the page.
     * @event
     */
    @Event()
    public renderCell: EmitType<RenderCellEventArgs>;
    /**
     * Triggers when the events are single clicked or on single tapping the events on the mobile devices.
     * @event
     */
    @Event()
    public eventClick: EmitType<EventClickArgs>;
    /**
     * Triggers before each of the event getting rendered on the scheduler user interface.
     * @event
     */
    @Event()
    public eventRendered: EmitType<EventRenderedArgs>;
    /**
     * Triggers before the data binds to the scheduler.
     * @event
     */
    @Event()
    public dataBinding: EmitType<ReturnType>;
    /**
     * Triggers before any of the scheduler popups opens on the page.
     * @event
     */
    @Event()
    public popupOpen: EmitType<PopupOpenEventArgs>;
    /**
     * Triggers when an appointment is started to drag.
     * @event
     */
    @Event()
    public dragStart: EmitType<DragEventArgs>;
    /**
     * Triggers when an appointment is being in a dragged state.
     * @event
     */
    @Event()
    public drag: EmitType<DragEventArgs>;
    /**
     * Triggers when the dragging of appointment is stopped.
     * @event
     */
    @Event()
    public dragStop: EmitType<DragEventArgs>;
    /**
     * Triggers when an appointment is started to resize.
     * @event
     */
    @Event()
    public resizeStart: EmitType<ResizeEventArgs>;
    /**
     * Triggers when an appointment is being in a resizing action.
     * @event
     */
    @Event()
    public resizing: EmitType<ResizeEventArgs>;
    /**
     * Triggers when the resizing of appointment is stopped.
     * @event
     */
    @Event()
    public resizeStop: EmitType<ResizeEventArgs>;
    /**
     * Triggers once the event data is bound to the scheduler.
     * @event
     */
    @Event()
    public dataBound: EmitType<ReturnType>;

    /**
     * Constructor for creating the Schedule widget
     * @hidden
     */
    constructor(options?: ScheduleModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Core method that initializes the control rendering.
     * @private
     */
    public render(): void {
        let addClasses: string[] = [];
        let removeClasses: string[] = [];
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
        if (this.cssClass) {
            addClasses.push(this.cssClass);
        }
        classList(this.element, addClasses, removeClasses);
        this.validateDate();
        this.eventTooltipTemplateFn = this.templateParser(this.eventSettings.tooltipTemplate);
        this.editorTemplateFn = this.templateParser(this.editorTemplate);
        this.quickInfoTemplatesHeaderFn = this.templateParser(this.quickInfoTemplates.header);
        this.quickInfoTemplatesContentFn = this.templateParser(this.quickInfoTemplates.content);
        this.quickInfoTemplatesFooterFn = this.templateParser(this.quickInfoTemplates.footer);
        createSpinner({ target: this.element });
        this.scrollModule = new Scroll(this);
        this.scrollModule.setWidth();
        this.scrollModule.setHeight();
        this.renderModule = new Render(this);
        this.eventBase = new EventBase(this);
        this.initializeDataModule();
        this.element.appendChild(this.createElement('div', { className: cls.TABLE_CONTAINER_CLASS }));
        this.activeViewOptions = this.getActiveViewOptions();
        this.initializeResources();
    }
    private initializeResources(isSetModel: boolean = false): void {
        if (this.resources.length > 0) {
            this.resourceBase = new ResourceBase(this);
            this.resourceBase.bindResourcesData(isSetModel);
        } else {
            this.resourceBase = null;
            this.renderElements(isSetModel);
            if (isSetModel) {
                this.eventWindow.refresh();
            }
        }
    }
    public renderElements(isLayoutOnly: boolean): void {
        if (isLayoutOnly) {
            this.initializeView(this.currentView);
            return;
        }
        this.destroyHeaderModule();
        if (this.showHeaderBar) {
            this.headerModule = new HeaderRenderer(this);
        }
        if (!this.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS)) {
            this.element.appendChild(this.createElement('div', { className: cls.TABLE_CONTAINER_CLASS }));
        }
        if (Browser.isDevice || Browser.isTouch) {
            this.scheduleTouchModule = new ScheduleTouch(this);
        }
        this.initializeView(this.currentView);
        this.destroyPopups();
        this.initializePopups();
        this.unwireEvents();
        this.wireEvents();
    }
    private validateDate(): void {
        // persist the selected date value
        this.setProperties({ selectedDate: new Date('' + this.selectedDate) }, true);
    }
    private getViewIndex(viewName: View): number {
        for (let item: number = 0; item < this.viewCollections.length; item++) {
            let checkIndex: View = this.viewCollections[item].option;
            if (checkIndex === viewName) {
                return item;
            }
        }
        return -1;
    }
    private setViewOptions(isModuleLoad: boolean = false): void {
        this.viewOptions = {};
        this.viewCollections = [];
        let viewName: string;
        let selectedView: string;
        let count: number = 0;
        this.viewIndex = -1;
        for (let view of this.views) {
            let isOptions: boolean = (typeof view === 'string') ? false : true;
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
            let obj: ViewsModel = extend({ option: viewName }, isOptions ? view : {});
            let fieldViewName: string = viewName.charAt(0).toLowerCase() + viewName.slice(1);
            this.viewCollections.push(obj);
            if (isNullOrUndefined(this.viewOptions[fieldViewName])) {
                this.viewOptions[fieldViewName] = [obj];
            } else {
                this.viewOptions[fieldViewName].push(obj);
            }
            count++;
        }
        if (!isModuleLoad && selectedView) {
            this.setProperties({ currentView: selectedView }, true);
        }
        if (this.viewIndex === -1) {
            let currentIndex: number = this.getViewIndex(this.currentView);
            this.viewIndex = (currentIndex === -1) ? 0 : currentIndex;
        }
    }
    private getActiveViewOptions(): ViewsModel {
        let timeScale: TimeScaleModel = {
            enable: this.timeScale.enable,
            interval: this.timeScale.interval,
            slotCount: this.timeScale.slotCount,
            majorSlotTemplate: this.timeScale.majorSlotTemplate,
            minorSlotTemplate: this.timeScale.minorSlotTemplate
        };
        let group: GroupModel = {
            byDate: this.group.byDate,
            byGroupID: this.group.byGroupID,
            allowGroupEdit: this.group.allowGroupEdit,
            resources: this.group.resources,
            headerTooltipTemplate: this.group.headerTooltipTemplate,
            enableCompactView: this.group.enableCompactView
        };
        let workDays: number[] = this.viewCollections[this.viewIndex].workDays ? [] : this.workDays;
        let scheduleOptions: ViewsModel = {
            dateFormat: this.dateFormat,
            endHour: this.endHour,
            isSelected: false,
            option: null,
            readonly: this.readonly,
            startHour: this.startHour,
            allowVirtualScrolling: false,
            cellTemplate: this.cellTemplate,
            eventTemplate: this.eventSettings.template,
            dateHeaderTemplate: this.dateHeaderTemplate,
            resourceHeaderTemplate: this.resourceHeaderTemplate,
            workDays: workDays,
            showWeekend: this.showWeekend,
            showWeekNumber: this.showWeekNumber,
            displayName: null,
            interval: 1,
            timeScale: timeScale,
            group: group,
            headerRows: this.headerRows
        };
        return extend(scheduleOptions, this.viewCollections[this.viewIndex], undefined, true);
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
            isReadonly: this.eventSettings.fields.isReadonly
        };
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
        this.dataModule = new Data(this.eventSettings.dataSource, this.eventSettings.query);
        this.crudModule = new Crud(this);
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
        this.cellTemplateFn = this.templateParser(this.activeViewOptions.cellTemplate);
        this.dateHeaderTemplateFn = this.templateParser(this.activeViewOptions.dateHeaderTemplate);
        this.majorSlotTemplateFn = this.templateParser(this.activeViewOptions.timeScale.majorSlotTemplate);
        this.minorSlotTemplateFn = this.templateParser(this.activeViewOptions.timeScale.minorSlotTemplate);
        this.appointmentTemplateFn = this.templateParser(this.activeViewOptions.eventTemplate);
        this.resourceHeaderTemplateFn = this.templateParser(this.activeViewOptions.resourceHeaderTemplate);
        this.headerTooltipTemplateFn = this.templateParser(this.activeViewOptions.group.headerTooltipTemplate);
    }
    private initializePopups(): void {
        this.eventWindow = new EventWindow(this);
        this.quickPopup = new QuickPopups(this);
    }
    public getDayNames(type: string): string[] {
        let culShortNames: string[] = [];
        let cldrObj: string[];
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrObj = <string[]>(getValue('days.stand-alone.' + type, getDefaultDateObject(this.getCalendarMode())));
        } else {
            cldrObj = <string[]>(
                getValue('main.' + '' + this.locale + '.dates.calendars.' + this.getCalendarMode() + '.days.format.' + type, cldrData));
        }
        for (let obj of Object.keys(cldrObj)) {
            culShortNames.push(getValue(obj, cldrObj));
        }
        return culShortNames;
    }
    private setCldrTimeFormat(): void {
        if (this.locale === 'en' || this.locale === 'en-US') {
            this.timeFormat = <string>(getValue('timeFormats.short', getDefaultDateObject(this.getCalendarMode())));
        } else {
            this.timeFormat = <string>
                (getValue('main.' + '' + this.locale + '.dates.calendars.' + this.getCalendarMode() + '.timeFormats.short', cldrData));
        }
    }
    public getCalendarMode(): string {
        return this.calendarMode.toLowerCase();
    }
    public getTimeString(date: Date): string {
        return this.globalize.formatDate(date, { format: this.timeFormat, type: 'time', calendar: this.getCalendarMode() });
    }
    private setCalendarMode(): void {
        if (this.calendarMode === 'Islamic') {
            this.calendarUtil = new Islamic();
        } else {
            this.calendarUtil = new Gregorian();
        }
    }
    public changeView(view: View, event?: Event, muteOnChange?: boolean, index?: number): void {
        if (isNullOrUndefined(index)) {
            index = this.getViewIndex(view);
        }
        if (!muteOnChange && index === this.viewIndex || index < 0) {
            return;
        }
        this.viewIndex = index;
        let args: ActionEventArgs = { requestType: 'viewNavigate', cancel: false, event: event };
        this.trigger(events.actionBegin, args);
        if (args.cancel) {
            return;
        }
        let navArgs: NavigatingEventArgs = { action: 'view', cancel: false, previousView: this.currentView, currentView: view };
        this.trigger(events.navigating, navArgs);
        if (navArgs.cancel) {
            return;
        }
        this.setProperties({ currentView: view }, true);
        if (this.headerModule) {
            this.headerModule.updateActiveView();
            this.headerModule.setCalendarView();
        }
        this.initializeView(this.currentView);
        this.animateLayout();
        args = { requestType: 'viewNavigate', cancel: false, event: event };
        this.trigger(events.actionComplete, args);
    }
    public changeDate(selectedDate: Date, event?: Event): void {
        let args: ActionEventArgs = { requestType: 'dateNavigate', cancel: false, event: event };
        this.trigger(events.actionBegin, args);
        if (args.cancel) {
            return;
        }
        let navArgs: NavigatingEventArgs = { action: 'date', cancel: false, previousDate: this.selectedDate, currentDate: selectedDate };
        this.trigger(events.navigating, navArgs);
        if (navArgs.cancel) {
            return;
        }
        this.setProperties({ selectedDate: selectedDate }, true);
        if (this.headerModule) {
            this.headerModule.setCalendarDate(selectedDate);
        }
        this.initializeView(this.currentView);
        this.animateLayout();
        args = { requestType: 'dateNavigate', cancel: false, event: event };
        this.trigger(events.actionComplete, args);
    }
    public isSelectedDate(date: Date): boolean {
        return date.setHours(0, 0, 0, 0) === new Date('' + this.selectedDate).setHours(0, 0, 0, 0);
    }
    public getNavigateView(): View {
        if (this.activeView.isTimelineView()) {
            return this.currentView === 'TimelineMonth' ? 'TimelineDay' : 'Agenda';
        }
        return 'Day';
    }
    private animateLayout(): void {
        new Animation({ duration: 600, name: 'FadeIn', timingFunction: 'easeIn' }).animate(this.activeView.element);
    }
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        this.setViewOptions(true);
        for (let view of Object.keys(this.viewOptions)) {
            view = (view === 'timelineDay' || view === 'timelineWeek' || view === 'timelineWorkWeek') ? 'timelineViews' : view;
            modules.push({
                member: view,
                args: [this]
            });
        }
        if (this.allowDragAndDrop) {
            modules.push({
                member: 'dragAndDrop',
                args: [this]
            });
        }
        if (this.allowResizing) {
            modules.push({
                member: 'resize',
                args: [this]
            });
        }
        modules.push({
            member: 'excelExport',
            args: [this]
        });
        modules.push({
            member: 'iCalendarExport',
            args: [this]
        });
        modules.push({
            member: 'iCalendarImport',
            args: [this]
        });
        return modules;
    }
    /**
     * Initializes the values of private members.
     * @private
     */
    protected preRender(): void {
        this.isAdaptive = Browser.isDevice;
        this.globalize = new Internationalization(this.locale);
        this.uiStateValues = {
            expand: false, isInitial: true, left: 0, top: 0, isGroupAdaptive: false,
            isIgnoreOccurrence: false, groupIndex: 0, action: false, isBlock: false
        };
        this.activeCellsData = { startTime: new Date(), endTime: new Date(), isAllDay: false };
        this.activeEventData = { event: undefined, element: undefined };
        this.defaultLocale = {
            day: 'Day',
            week: 'Week',
            workWeek: 'Work Week',
            month: 'Month',
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
            deleteSeries: 'Delete Series',
            edit: 'Edit',
            editSeries: 'Edit Series',
            editEvent: 'Edit Event',
            createEvent: 'Create',
            subject: 'Subject',
            addTitle: 'Add title',
            moreDetails: 'More Details',
            save: 'Save',
            editContent: 'Do you want to edit only this event or entire series?',
            deleteRecurrenceContent: 'Do you want to delete only this event or entire series?',
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
            recurrenceDateValidation: 'Some months have fewer than the selected date. For these months, ' +
                'the occurrence will fall on the last date of the month.',
            sameDayAlert: 'Two occurrences of the same event cannot occur on the same day.',
            editRecurrence: 'Edit Recurrence',
            repeats: 'Repeats',
            alert: 'Alert',
            startEndError: 'The selected end date occurs before the start date.',
            invalidDateError: 'The entered date value is invalid.',
            blockAlert: 'Events cannot be scheduled within the blocked time range.',
            ok: 'Ok',
            yes: 'Yes',
            no: 'No',
            occurrence: 'Occurrence',
            series: 'Series',
            previous: 'Previous',
            next: 'Next',
            timelineDay: 'Timeline Day',
            timelineWeek: 'Timeline Week',
            timelineWorkWeek: 'Timeline Work Week',
            timelineMonth: 'Timeline Month'
        };
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
        this.setViewOptions();
    }
    /**
     * Binding events to the Schedule element.
     * @hidden
     */
    private wireEvents(): void {
        let resize: string = 'onorientationchange' in window ? 'orientationchange' : 'resize';
        EventHandler.add(<HTMLElement & Window>window, resize, this.onScheduleResize, this);
        EventHandler.add(document, Browser.touchStartEvent, this.onDocumentClick, this);
        if (this.allowKeyboardInteraction) {
            this.keyboardInteractionModule = new KeyboardInteraction(this);
        }
    }
    public removeSelectedClass(): void {
        let selectedCells: Element[] = this.getSelectedElements();
        for (let cell of selectedCells) {
            cell.setAttribute('aria-selected', 'false');
            cell.removeAttribute('tabindex');
        }
        removeClass(selectedCells, cls.SELECTED_CELL_CLASS);
    }
    public addSelectedClass(cells: HTMLTableCellElement[], focusCell: HTMLTableCellElement): void {
        for (let cell of cells) {
            cell.setAttribute('aria-selected', 'true');
        }
        addClass(cells, cls.SELECTED_CELL_CLASS);
        if (focusCell) {
            focusCell.setAttribute('tabindex', '0');
            focusCell.focus();
        }
    }
    public selectCell(element: HTMLElement & HTMLTableCellElement): void {
        this.removeSelectedClass();
        this.addSelectedClass([element], element);
    }
    public getSelectedElements(): Element[] {
        return [].slice.call(this.element.querySelectorAll('.' + cls.SELECTED_CELL_CLASS));
    }
    public getAllDayRow(): Element {
        return this.element.querySelector('.' + cls.ALLDAY_ROW_CLASS);
    }
    public getContentTable(): HTMLElement {
        return this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS + ' tbody') as HTMLElement;
    }
    public getTableRows(): HTMLElement[] {
        return [].slice.call(this.element.querySelectorAll('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr:not(.' + cls.HIDDEN_CLASS + ')'));
    }
    public getWorkCellElements(): Element[] {
        return [].slice.call(this.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
    }
    public getIndexOfDate(collection: Date[], date: Date): number {
        return collection.map(Number).indexOf(+date);
    }
    public isAllDayCell(td: Element): boolean {
        if (this.currentView === 'Month' || this.currentView === 'TimelineMonth' || td.classList.contains(cls.ALLDAY_CELLS_CLASS)
            || td.classList.contains(cls.HEADER_CELLS_CLASS) || !this.activeViewOptions.timeScale.enable) {
            return true;
        }
        if (this.activeViewOptions.headerRows.length > 0 && this.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour') {
            return true;
        }
        return false;
    }
    public getDateFromElement(td: Element): Date {
        if (!isNullOrUndefined(td.getAttribute('data-date'))) {
            let dateInMS: number = parseInt(td.getAttribute('data-date'), 10);
            return new Date(dateInMS);
        }
        return undefined;
    }
    public getCellTemplate(): Function {
        return this.cellTemplateFn;
    }
    public getDateHeaderTemplate(): Function {
        return this.dateHeaderTemplateFn;
    }
    public getMajorSlotTemplate(): Function {
        return this.majorSlotTemplateFn;
    }
    public getMinorSlotTemplate(): Function {
        return this.minorSlotTemplateFn;
    }
    public getAppointmentTemplate(): Function {
        return this.appointmentTemplateFn;
    }
    public getEventTooltipTemplate(): Function {
        return this.eventTooltipTemplateFn;
    }
    public getHeaderTooltipTemplate(): Function {
        return this.headerTooltipTemplateFn;
    }
    public getEditorTemplate(): Function {
        return this.editorTemplateFn;
    }
    public getQuickInfoTemplatesHeader(): Function {
        return this.quickInfoTemplatesHeaderFn;
    }
    public getQuickInfoTemplatesContent(): Function {
        return this.quickInfoTemplatesContentFn;
    }
    public getQuickInfoTemplatesFooter(): Function {
        return this.quickInfoTemplatesFooterFn;
    }
    public getResourceHeaderTemplate(): Function {
        return this.resourceHeaderTemplateFn;
    }
    public getCssProperties(): ScrollCss {
        let cssProps: ScrollCss = {
            border: this.enableRtl ? 'borderLeftWidth' : 'borderRightWidth',
            padding: this.enableRtl ? 'paddingLeft' : 'paddingRight'
        };
        return cssProps;
    }
    public removeNewEventElement(): void {
        let eventClone: HTMLElement = this.element.querySelector('.' + cls.NEW_EVENT_CLASS);
        if (!isNullOrUndefined(eventClone)) {
            remove(eventClone);
        }
    }
    private onDocumentClick(args: Event): void {
        this.notify(events.documentClick, { event: args });
    }
    private onScheduleResize(): void {
        if (this.quickPopup) {
            this.quickPopup.onClosePopup();
        }
        if (this.currentView === 'Month' || !this.activeViewOptions.timeScale.enable || this.activeView.isTimelineView()) {
            this.activeView.resetColWidth();
            this.notify(events.scrollUiUpdate, { cssProperties: this.getCssProperties(), isPreventScrollUpdate: true });
            this.notify(events.dataReady, {});
        }
    }
    public templateParser(template: string): Function {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            } catch (error) {
                return compile(template);
            }
        }
        return undefined;
    }

    public boundaryValidation(pageY: number, pageX: number): ResizeEdges {
        let autoScrollDistance: number = 30;
        let scrollEdges: ResizeEdges = { left: false, right: false, top: false, bottom: false };
        let viewBoundaries: ClientRect = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS).getBoundingClientRect();
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
     * Unbinding events from the element on widget destroy.
     * @hidden
     */
    private unwireEvents(): void {
        let resize: string = 'onorientationchange' in window ? 'orientationchange' : 'resize';
        EventHandler.remove(<HTMLElement & Window>window, resize, this.onScheduleResize);
        EventHandler.remove(document, Browser.touchStartEvent, this.onDocumentClick);
        if (this.keyboardInteractionModule) {
            this.keyboardInteractionModule.destroy();
        }
    }
    /**
     * Core method to return the component name.
     * @private
     */
    public getModuleName(): string {
        return 'schedule';
    }
    /**
     * Returns the properties to be maintained in the persisted state.
     * @private
     */
    protected getPersistData(): string {
        return this.addOnPersist(['currentView', 'selectedDate']);
    }
    /**
     * Called internally, if any of the property value changed.
     * @private
     */

    public onPropertyChanged(newProp: ScheduleModel, oldProp: ScheduleModel): void {
        let state: StateArgs = { isRefresh: false, isResource: false, isDate: false, isView: false, isLayout: false, isDataManager: false };
        for (let prop of Object.keys(newProp)) {
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
                case 'selectedDate':
                    state.isDate = true;
                    break;
                case 'dateFormat':
                    this.activeViewOptions = this.getActiveViewOptions();
                    if (this.headerModule) {
                        this.headerModule.updateDateRange(this.activeView.getDateRangeText());
                    }
                    break;
                case 'showHeaderBar':
                    this.destroyHeaderModule();
                    if (newProp.showHeaderBar) {
                        this.headerModule = new HeaderRenderer(this);
                        this.headerModule.updateDateRange(this.activeView.getDateRangeText());
                    }
                    this.notify(events.scrollUiUpdate, { cssProperties: this.getCssProperties() });
                    if (this.activeView.isTimelineView()) {
                        this.notify(events.dataReady, {});
                    }
                    break;
                case 'showWeekend':
                case 'workDays':
                case 'startHour':
                case 'endHour':
                case 'workHours':
                case 'readonly':
                case 'headerRows':
                case 'showWeekNumber':
                    state.isLayout = true;
                    break;
                case 'locale':
                case 'calendarMode':
                    this.setCldrTimeFormat();
                    this.setCalendarMode();
                    state.isRefresh = true;
                    break;
                case 'firstDayOfWeek':
                    if (this.headerModule) {
                        this.headerModule.setDayOfWeek(newProp.firstDayOfWeek);
                    }
                    if (this.eventWindow) { this.eventWindow.refreshRecurrenceEditor(); }
                    state.isLayout = true;
                    break;
                case 'showTimeIndicator':
                    if (this.activeViewOptions.timeScale.enable && this.activeView) {
                        this.activeView.highlightCurrentTime();
                    }
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
                case 'resourceHeaderTemplate':
                    this.activeViewOptions.resourceHeaderTemplate = newProp.resourceHeaderTemplate;
                    this.resourceHeaderTemplateFn = this.templateParser(this.activeViewOptions.resourceHeaderTemplate);
                    state.isLayout = true;
                    break;
                case 'timezone':
                    this.eventBase.timezonePropertyChange(oldProp.timezone);
                    break;
                case 'enableRtl':
                    state.isRefresh = true;
                    break;
                case 'rowAutoHeight':
                    state.isLayout = true;
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
            this.changeDate(this.selectedDate);
        } else if (state.isLayout) {
            this.initializeView(this.currentView);
        } else if (state.isDataManager && this.renderModule) {
            this.renderModule.refreshDataManager();
        }
    }

    private extendedPropertyChange(prop: string, newProp: ScheduleModel, oldProp: ScheduleModel, state: StateArgs): void {
        switch (prop) {
            case 'width':
            case 'height':
                this.notify(events.uiUpdate, { module: 'scroll', properties: { width: newProp.width, height: newProp.height } });
                break;
            case 'cssClass':
                if (oldProp.cssClass) { removeClass([this.element], oldProp.cssClass); }
                if (newProp.cssClass) { addClass([this.element], newProp.cssClass); }
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
                if (this.keyboardInteractionModule) {
                    this.keyboardInteractionModule.destroy();
                    this.keyboardInteractionModule = null;
                }
                if (newProp.allowKeyboardInteraction) {
                    this.keyboardInteractionModule = new KeyboardInteraction(this);
                }
                break;
            case 'editorTemplate':
                if (!isNullOrUndefined(this.editorTemplate)) {
                    this.editorTemplateFn = this.templateParser(this.editorTemplate);
                }
                if (this.eventWindow) { this.eventWindow.setDialogContent(); }
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
                this.notify(events.dataReady, {
                    processedData: this.eventBase.processData(this.eventsData as { [key: string]: Object }[])
                });
                break;
            case 'eventDragArea':
                this.notify(events.dataReady, {});
                break;
        }
    }

    private onGroupSettingsPropertyChanged(newProp: GroupModel, oldProp: GroupModel, state: StateArgs): void {
        for (let prop of Object.keys(newProp)) {
            if (prop === 'headerTooltipTemplate') {
                this.headerTooltipTemplateFn = this.templateParser(newProp[prop]);
            } else {
                state.isLayout = true;
                if (this.eventWindow) { this.eventWindow.refresh(); }
            }
        }
    }

    private onEventSettingsPropertyChanged(newProp: EventSettingsModel, oldProp: EventSettingsModel, state: StateArgs): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'dataSource':
                case 'query':
                case 'fields':
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
     */
    public showSpinner(): void {
        showSpinner(this.element);
    }

    /**
     * When the spinner is shown manually using `showSpinner` method, it can be hidden using this `hideSpinner` method.
     */
    public hideSpinner(): void {
        hideSpinner(this.element);
    }

    /**
     * Sets different working hours on the required working days by accepting the required start and end time as well as the date collection
     *  as its parameters.
     * @method setWorkHours
     * @param {date} dates Collection of dates on which the given start and end hour range needs to be applied.
     * @param {string} start Defines the work start hour.
     * @param {string} end Defines the work end hour.
     * @param {number} groupIndex Defines the resource index from last level.
     * @returns {void}
     */
    public setWorkHours(dates: Date[], start: string, end: string, groupIndex?: number): void {
        let startHour: Date = this.globalize.parseDate(start, { skeleton: 'Hm', calendar: this.getCalendarMode() });
        let endHour: Date = this.globalize.parseDate(end, { skeleton: 'Hm', calendar: this.getCalendarMode() });
        let tableEle: HTMLTableElement = this.getContentTable() as HTMLTableElement;
        if (isNullOrUndefined(startHour) || isNullOrUndefined(endHour) || !tableEle) {
            return;
        }
        startHour.setMilliseconds(0);
        endHour.setMilliseconds(0);
        let viewStartHour: Date = this.activeView.getStartHour();
        if (startHour < viewStartHour) {
            startHour = viewStartHour;
        }
        if (endHour > this.activeView.getEndHour()) {
            endHour = this.activeView.getEndHour();
        }
        let msMajorInterval: number = this.activeViewOptions.timeScale.interval * util.MS_PER_MINUTE;
        let msInterval: number = msMajorInterval / this.activeViewOptions.timeScale.slotCount;
        let startIndex: number = Math.round((util.getDateInMs(startHour) - util.getDateInMs(viewStartHour)) / msInterval);
        let endIndex: number = Math.ceil((util.getDateInMs(endHour) - util.getDateInMs(viewStartHour)) / msInterval);
        let cells: HTMLTableCellElement[] = [];
        for (let date of dates) {
            util.resetTime(date);
            let renderDates: Date[] = this.activeView.renderDates;
            if (!isNullOrUndefined(groupIndex) && this.resourceBase && !this.activeView.isTimelineView()) {
                renderDates = this.resourceBase.lastResourceLevel[groupIndex].renderDates;
            }
            let colIndex: number = this.getIndexOfDate(renderDates, date);
            if (colIndex >= 0) {
                for (let i: number = startIndex; i < endIndex; i++) {
                    if (this.activeView.isTimelineView()) {
                        let rowIndex: number = (!isNullOrUndefined(groupIndex)) ? groupIndex : 0;
                        cells.push(tableEle.rows[rowIndex].cells[i]);
                    } else {
                        if (!isNullOrUndefined(groupIndex)) {
                            let tds: HTMLTableCellElement[] = [].slice.call(tableEle.rows[i].querySelectorAll
                                ('.' + cls.WORK_CELLS_CLASS + '[data-group-index="' + groupIndex + '"]'));
                            cells.push(tds[colIndex]);
                        } else {
                            cells.push(tableEle.rows[i].cells[colIndex]);
                        }
                    }
                }
            }
        }
        addClass(cells, cls.WORK_HOURS_CLASS);
    }

    /**
     * Retrieves the start and end time information of the specific cell element.
     * @method getCellDetails
     * @param  {Element} td The cell element whose start and end time details are to be retrieved.
     * @returns {CellClickEventArgs} Object An object holding the startTime, endTime and all-day information along with the target HTML
     *  element will be returned. 
     */
    public getCellDetails(tdCol: Element | Element[]): CellClickEventArgs {
        let td: Element[] = (tdCol instanceof Array) ? tdCol : [tdCol];
        let firstTd: Element = td[0];
        let lastTd: Element = td.slice(-1)[0];
        let startTime: Date = this.getDateFromElement(firstTd);
        let endTime: Date = this.getDateFromElement(lastTd);
        if (isNullOrUndefined(startTime) || isNullOrUndefined(endTime)) {
            return undefined;
        }
        let endDateFromColSpan: boolean = this.activeView.isTimelineView() && !isNullOrUndefined(lastTd.getAttribute('colSpan')) &&
            this.headerRows.length > 0;
        let duration: number = endDateFromColSpan ? parseInt(lastTd.getAttribute('colSpan'), 10) : 1;
        if (!this.activeViewOptions.timeScale.enable || endDateFromColSpan || lastTd.classList.contains(cls.ALLDAY_CELLS_CLASS) ||
            lastTd.classList.contains(cls.HEADER_CELLS_CLASS)) {
            endTime = util.addDays(new Date(startTime.getTime()), duration);
        } else {
            endTime = this.activeView.getEndDateFromStartDate(endTime);
        }
        let data: CellClickEventArgs = {
            startTime: startTime,
            endTime: endTime,
            isAllDay: this.isAllDayCell(firstTd),
            element: tdCol as HTMLElement | HTMLElement[]
        };
        let groupIndex: string = firstTd.getAttribute('data-group-index');
        if (!isNullOrUndefined(groupIndex)) {
            data.groupIndex = parseInt(groupIndex, 10);
        }
        return data;
    }

    /**
     * Retrieves the resource details based on the provided resource index.
     * @param {number} index index of the resources at the last level.
     * @returns {ResourceDetails} Object An object holding the details of resource and resourceData.
     */
    public getResourcesByIndex(index: number): ResourceDetails {
        if (this.resourceBase && this.resourceBase.lastResourceLevel) {
            if (index < 0 || index >= this.resourceBase.lastResourceLevel.length) {
                return undefined;
            }
            let data: TdData = this.resourceBase.lastResourceLevel[index];
            let groupData: { [key: string]: Object } = {};
            this.resourceBase.setResourceValues(groupData, false, index);
            return { resource: data.resource, resourceData: data.resourceData, groupData: groupData };
        }
        return undefined;
    }

    /**
     * Scrolls the Schedule content area to the specified time.
     * @method scrollTo
     * @param {string} hour Accepts the time value in the skeleton format of 'Hm'.
     * @returns {void}
     */
    public scrollTo(hour: string): void {
        if (this.activeView.scrollToHour) {
            this.activeView.scrollToHour(hour);
        }
    }

    /**
     * Exports the Scheduler events to a calendar (.ics) file. By default, the calendar is exported with a file name `Calendar.ics`. 
     * To change this file name on export, pass the custom string value as `fileName` to get the file downloaded with this provided name. 
     * @method exportToICalendar
     * @param {string} fileName Accepts the string value.
     * @returns {void}
     */
    public exportToICalendar(fileName?: string): void {
        if (this.iCalendarExportModule) {
            this.iCalendarExportModule.initializeCalendarExport(fileName);
        } else {
            throw Error('Inject ICalendarExport module');
        }
    }

    /**
     * Imports the events from an .ics file downloaded from any of the calendars like Google or Outlook into the Scheduler. 
     * This method accepts the blob object of an .ics file to be imported as a mandatory argument.
     * @method importICalendar
     * @param {Blob} fileContent Accepts the file object.
     * @returns {void}
     */
    public importICalendar(fileContent: Blob): void {
        if (this.iCalendarImportModule) {
            this.iCalendarImportModule.initializeCalendarImport(fileContent);
        } else {
            throw Error('Inject ICalendarImport module');
        }
    }

    /**
     * Adds the newly created event into the Schedule dataSource.
     * @method addEvent
     * @param {Object | Object[]} data Single or collection of event objects to be added into Schedule.
     * @returns {void}
     */
    public addEvent(data: Object | Object[]): void {
        this.crudModule.addEvent(data);
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
     * @method exportToExcel
     * @param  {ExportOptions} excelExportOptions The export options to be set before start with 
     * exporting the Scheduler events to an Excel file.
     * @return {void} 
     */
    public exportToExcel(excelExportOptions?: ExportOptions): void {
        if (this.excelExportModule) {
            this.excelExportModule.initializeExcelExport(excelExportOptions || {});
        } else {
            throw Error('Inject ExcelExport module');
        }
    }

    /**
     * Updates the changes made in the event object by passing it as an parameter into the dataSource.
     * @method saveEvent
     * @param {[key: string]: Object} data Single or collection of event objects to be saved into Schedule.
     * @param {CurrentAction} currentAction Denotes the action that takes place either for editing occurrence or series.
     *  The valid current action names are `EditOccurrence` or `EditSeries`.
     * @returns {void}
     */
    public saveEvent(data: { [key: string]: Object } | { [key: string]: Object }[], currentAction?: CurrentAction): void {
        this.crudModule.saveEvent(data, currentAction);
    }

    /**
     * Deletes the events based on the provided ID or event collection in the argument list.
     * @method deleteEvent
     * @param {{[key: string]: Object}} id Single event objects to be removed from the Schedule.
     * @param {{[key: string]: Object }[]} id Collection of event objects to be removed from the Schedule.
     * @param {string | number} id Accepts the ID of the event object which needs to be removed from the Schedule.
     * @param {CurrentAction} currentAction Denotes the delete action that takes place either on occurrence or series events.
     *  The valid current action names are `Delete`, `DeleteOccurrence` or `DeleteSeries`.
     * @returns {void}
     */
    public deleteEvent(id: string | number | { [key: string]: Object } | { [key: string]: Object }[], currentAction?: CurrentAction): void {
        this.crudModule.deleteEvent(id, currentAction);
    }

    /**
     * Retrieves the entire collection of events bound to the Schedule.
     * @method getEvents
     * @returns {Object[]} Returns the collection of event objects from the Schedule.
     */
    public getEvents(startDate?: Date, endDate?: Date, includeOccurrences?: boolean): Object[] {
        let eventCollections: Object[] = [];
        if (includeOccurrences) {
            eventCollections = this.eventBase.getProcessedEvents();
        } else {
            eventCollections = this.eventsData;
        }
        eventCollections = this.eventBase.filterEventsByRange(eventCollections, startDate, endDate);
        return eventCollections;
    }

    /**
     * Retrieves the occurrences of a single recurrence event based on the provided parent ID.
     * @method getOccurrencesByID
     * @param {number} eventID ID of the parent recurrence data from which the occurrences are fetched.
     * @returns {Object[]} Returns the collection of occurrence event objects.
     */
    public getOccurrencesByID(eventID: number | string): Object[] {
        return this.eventBase.getOccurrencesByID(eventID);
    }

    /**
     * Retrieves all the occurrences that lies between the specific start and end time range.
     * @method getOccurrencesByRange
     * @param {Date} startTime Denotes the start time range.
     * @param {Date} endTime Denotes the end time range.
     * @returns {Object[]} Returns the collection of occurrence event objects that lies between the provided start and end time.
     */
    public getOccurrencesByRange(startTime: Date, endTime: Date): Object[] {
        return this.eventBase.getOccurrencesByRange(startTime, endTime);
    }

    /**
     * Retrieves the dates that lies on active view of Schedule.
     * @method getCurrentViewDates
     * @returns {Date[]} Returns the collection of dates.
     */
    public getCurrentViewDates(): Object[] {
        return this.activeView ? this.activeView.renderDates : [];
    }

    /**
     * Retrieves the events that lies on the current date range of the active view of Schedule.
     * @method getCurrentViewEvents
     * @returns {Object[]} Returns the collection of events.
     */
    public getCurrentViewEvents(): Object[] {
        return this.eventsProcessed;
    }

    /**
     * Refreshes the event dataSource. This method may be useful when the events alone in the schedule needs to be re-rendered.
     * @method refreshEvents
     * @returns {void}
     */
    public refreshEvents(): void {
        this.renderModule.refreshDataManager();
    }

    /**
     * To retrieve the appointment object from element.
     * @method getEventDetails
     * @param {Element} element Denotes the event UI element on the Schedule.
     * @returns {Object} Returns the event details.
     */
    public getEventDetails(element: Element): Object {
        let guid: string = element.getAttribute('data-guid');
        if (guid) {
            return this.eventBase.getEventByGuid(guid);
        }
        return {};
    }

    /**
     * To check whether the given time range slots are available for event creation or already occupied by other events.
     * @method isSlotAvailable
     * @param {Date | Object} startTime Denotes the start time of the slot.
     * @param {Date} endTime Denotes the end time of the slot.
     * @param {number} groupIndex Defines the resource index from last level.
     * @returns {boolean} Returns true, if the slot that lies in the provided time range does not contain any other events.
     */
    public isSlotAvailable(startTime: Date | Object, endTime?: Date, groupIndex?: number): boolean {
        let eventStart: Date;
        let eventEnd: Date;
        let eventObj: { [key: string]: Object } = this.activeEventData.event as { [key: string]: Object };
        if (startTime instanceof Date) {
            eventStart = startTime;
            eventEnd = endTime;
        } else {
            eventObj = startTime as { [key: string]: Object };
            eventStart = (<{ [key: string]: Object }>startTime)[this.eventFields.startTime] as Date;
            eventEnd = (<{ [key: string]: Object }>startTime)[this.eventFields.endTime] as Date;
            if (this.resourceBase) {
                groupIndex = this.eventBase.getGroupIndexFromEvent(startTime as { [key: string]: Object });
            }
        }
        if (isNullOrUndefined(eventStart) || isNullOrUndefined(eventEnd)) {
            return true;
        }
        let eventCollection: Object[] = this.eventBase.filterEvents(eventStart, eventEnd);
        if (!isNullOrUndefined(groupIndex) && this.resourceBase && this.resourceBase.lastResourceLevel.length > 0) {
            eventCollection = this.eventBase.filterEventsByResource(this.resourceBase.lastResourceLevel[groupIndex], eventCollection);
        }
        if (eventObj) {
            if (eventObj.Guid) {
                eventCollection = eventCollection.filter((event: { [key: string]: Object }) => event.Guid !== eventObj.Guid);
            } else {
                eventCollection = eventCollection.filter((event: { [key: string]: Object }) =>
                    event[this.eventFields.id] !== eventObj[this.eventFields.id]);
            }
        }
        return (eventCollection.length > 0) ? false : true;
    }

    /**
     * To manually open the event editor on specific time or on certain events.
     * @method openEditor
     * @param {Object} data It can be either cell data or event data.
     * @param {CurrentAction} action Defines the action for which the editor needs to be opened such as either for new event creation or
     *  for editing of existing events. The applicable action names that can be used here are `Add`, `Save`, `EditOccurrence`
     *  and `EditSeries`.
     * @param {boolean} isEventData It allows to decide whether the editor needs to be opened with the clicked cell details or with the
     *  passed event details.
     * @param {number} repeatType It opens the editor with the recurrence options based on the provided repeat type.
     * @returns {void}
     */
    public openEditor(data: Object, action: CurrentAction, isEventData?: boolean, repeatType?: number): void {
        this.currentAction = action;
        if (action !== 'Add') {
            this.activeEventData.event = data as { [key: string]: Object };
        }
        this.eventWindow.openEditor(data, action, isEventData, repeatType);
    }

    /**
     * Adds the resources to the specified index.
     * @param resources
     * @param {string} name Name of the resource defined in resources collection.
     * @param {number} index Index or position where the resource should be added.
     */
    public addResource(resources: Object | Object[], name: string, index: number): void {
        this.resourceBase.addResource(resources, name, index);
    }

    /**
     * Removes the specified resource.
     * @param resourceId Specifies the resource id to be removed.
     * @param name Specifies the resource name from which the id should be referred.
     */
    public removeResource(resourceId: string | string[] | number | number[], name: string): void {
        this.resourceBase.removeResource(resourceId, name);
    }

    /**
     * Destroys the Schedule component.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        if (this.eventTooltip) {
            this.eventTooltip.destroy();
            this.eventTooltip = null;
        }
        this.destroyPopups();
        this.unwireEvents();
        this.destroyHeaderModule();
        if (this.scrollModule) {
            this.scrollModule.destroy();
            this.scrollModule = null;
        }
        if (this.activeView) {
            this.activeView.removeEventListener();
            this.activeView.destroy();
            this.activeView = null;
        }
        if (this.scheduleTouchModule) {
            this.scheduleTouchModule.destroy();
            this.scheduleTouchModule = null;
        }
        super.destroy();
        this.element.innerHTML = '';
        let removeClasses: string[] = [cls.ROOT];
        if (this.cssClass) {
            removeClasses = removeClasses.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], removeClasses);
    }
}
