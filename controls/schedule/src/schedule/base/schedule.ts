import { Component, ModuleDeclaration, Property, Event, Animation, Collection } from '@syncfusion/ej2-base';
import { EventHandler, EmitType, Browser, Internationalization, getDefaultDateObject, cldrData, L10n } from '@syncfusion/ej2-base';
import { getValue, compile, extend, isNullOrUndefined, NotifyPropertyChanges, INotifyPropertyChanged, Complex } from '@syncfusion/ej2-base';
import { removeClass, addClass, classList } from '@syncfusion/ej2-base';
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
import { WorkHoursModel, ViewsModel, EventSettingsModel, GroupModel, ResourcesModel, TimeScaleModel } from '../models/models';
import { QuickInfoTemplatesModel, HeaderRowsModel } from '../models/models';
import { EventSettings } from '../models/event-settings';
import { Group } from '../models/group';
import { Resources } from '../models/resources';
import { IRenderer, ActionEventArgs, NavigatingEventArgs, CellClickEventArgs, RenderCellEventArgs, ScrollCss } from '../base/interface';
import { EventClickArgs, EventRenderedArgs, PopupOpenEventArgs, UIStateArgs, DragEventArgs, ResizeEventArgs } from '../base/interface';
import { EventFieldsMapping, TdData, ResourceDetails } from '../base/interface';
import { ResourceBase } from '../base/resource';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

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
    public viewOptions: { [key: string]: ViewsModel[] };
    public viewCollections: ViewsModel[];
    public viewIndex: number;
    public activeViewOptions: ViewsModel;
    public eventFields: EventFieldsMapping;
    public editorTitles: EventFieldsMapping;
    public eventsData: Object[];
    public eventsProcessed: Object[];
    public currentAction: CurrentAction;
    public quickPopup: QuickPopups;
    public selectedElements: Element[];
    public uiStateValues: UIStateArgs;
    public timeFormat: string;

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
        if (this.showHeaderBar) {
            this.headerModule = new HeaderRenderer(this);
        }
        this.element.appendChild(this.createElement('div', { className: cls.TABLE_CONTAINER_CLASS }));
        if (Browser.isDevice || Browser.isTouch) {
            this.scheduleTouchModule = new ScheduleTouch(this);
        }
        this.initializeView(this.currentView);
        this.initializePopups();
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
            allowVirtualScrolling: true,
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
            recurrenceException: this.eventSettings.fields.recurrenceException.name
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
            cldrObj = <string[]>(getValue('days.stand-alone.' + type, getDefaultDateObject()));
        } else {
            cldrObj = <string[]>(getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.days.format.' + type, cldrData));
        }
        for (let obj of Object.keys(cldrObj)) {
            culShortNames.push(getValue(obj, cldrObj));
        }
        return culShortNames;
    }
    private setCldrTimeFormat(): void {
        if (this.locale === 'en' || this.locale === 'en-US') {
            this.timeFormat = <string>(getValue('timeFormats.short', getDefaultDateObject()));
        } else {
            this.timeFormat = <string>(getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.timeFormats.short', cldrData));
        }
    }
    public getTimeString(date: Date): string {
        return this.globalize.formatDate(date, { format: this.timeFormat, type: 'time' });
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
        return modules;
    }
    /**
     * Initializes the values of private members.
     * @private
     */
    protected preRender(): void {
        this.isAdaptive = Browser.isDevice;
        this.globalize = new Internationalization(this.locale);
        this.uiStateValues = { expand: false, isInitial: true, left: 0, top: 0, isGroupAdaptive: false, groupIndex: 0, action: false };
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
            seriesChangeAlert: 'The changes made to specific instances of this series will be cancelled ' +
                'and those events will match the series again.',
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
            ok: 'Ok',
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
        this.eventsData = [];
        this.eventsProcessed = [];
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
        focusCell.setAttribute('tabindex', '0');
        focusCell.focus();
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
    private onDocumentClick(args: Event): void {
        this.notify(events.documentClick, { event: args });
    }
    private onScheduleResize(): void {
        if (this.quickPopup) {
            this.quickPopup.onClosePopup();
        }
        if (this.currentView === 'Month' || !this.activeViewOptions.timeScale.enable || this.activeView.isTimelineView()) {
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
        let requireRefresh: boolean = false;
        let requireScheduleRefresh: boolean = false;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width':
                case 'height':
                    this.notify(events.uiUpdate, { module: 'scroll', properties: { width: newProp.width, height: newProp.height } });
                    break;
                case 'views':
                    this.setViewOptions();
                    if (this.headerModule) {
                        this.headerModule.updateItems();
                    }
                    this.changeView(this.currentView, null, true);
                    break;
                case 'currentView':
                    this.changeView(newProp.currentView, null, true);
                    break;
                case 'selectedDate':
                    this.changeDate(newProp.selectedDate);
                    break;
                case 'dateFormat':
                    this.activeViewOptions = this.getActiveViewOptions();
                    if (this.headerModule) {
                        this.headerModule.updateDateRange(this.activeView.getDateRangeText());
                    }
                    break;
                case 'showHeaderBar':
                    if (this.headerModule) {
                        this.headerModule.destroy();
                        this.headerModule = null;
                    }
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
                    requireRefresh = true;
                    break;
                case 'eventDragArea':
                    this.notify(events.dataReady, {});
                    break;
                case 'locale':
                    this.setCldrTimeFormat();
                    requireScheduleRefresh = true;
                    break;
                case 'firstDayOfWeek':
                    if (this.headerModule) {
                        this.headerModule.setDayOfWeek(newProp.firstDayOfWeek);
                    }
                    requireRefresh = true;
                    break;
                case 'showTimeIndicator':
                    if (this.activeViewOptions.timeScale.enable) {
                        this.activeView.highlightCurrentTime();
                    }
                    break;
                case 'cellTemplate':
                    this.activeViewOptions.cellTemplate = newProp.cellTemplate;
                    this.cellTemplateFn = this.templateParser(this.activeViewOptions.cellTemplate);
                    requireRefresh = true;
                    break;
                case 'dateHeaderTemplate':
                    this.activeViewOptions.dateHeaderTemplate = newProp.dateHeaderTemplate;
                    this.dateHeaderTemplateFn = this.templateParser(this.activeViewOptions.dateHeaderTemplate);
                    requireRefresh = true;
                    break;
                case 'timezone':
                    this.eventBase.timezonePropertyChange(oldProp.timezone);
                    break;
                case 'enableRtl':
                    requireScheduleRefresh = true;
                    break;
                default:
                    this.extendedPropertyChange(prop, newProp, oldProp);
                    break;
            }
        }
        if (requireScheduleRefresh) {
            this.refresh();
        } else if (requireRefresh) {
            this.initializeView(this.currentView);
        }
    }

    private extendedPropertyChange(prop: string, newProp: ScheduleModel, oldProp: ScheduleModel): void {
        switch (prop) {
            case 'cssClass':
                if (oldProp.cssClass) { removeClass([this.element], oldProp.cssClass); }
                if (newProp.cssClass) { addClass([this.element], newProp.cssClass); }
                break;
            case 'hideEmptyAgendaDays':
            case 'agendaDaysCount':
                this.activeViewOptions = this.getActiveViewOptions();
                this.changeView(this.currentView, null, true);
                break;
            case 'eventSettings':
                this.onEventSettingsPropertyChanged(newProp.eventSettings, oldProp.eventSettings);
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
                this.eventWindow.setDialogContent();
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
                this.onGroupSettingsPropertyChanged(newProp.group, oldProp.group);
                break;
            case 'resources':
                this.initializeResources(true);
                break;
            case 'timeScale':
                this.activeViewOptions.timeScale.interval = newProp.timeScale.interval || this.activeViewOptions.timeScale.interval;
                this.activeViewOptions.timeScale.slotCount = newProp.timeScale.slotCount || this.activeViewOptions.timeScale.slotCount;
                this.eventWindow.refreshDateTimePicker();
                this.initializeView(this.currentView);
                break;
            case 'allowDragAndDrop':
            case 'allowResizing':
                this.notify(events.dataReady, {
                    processedData: this.eventBase.processData(this.eventsData as { [key: string]: Object }[])
                });
                break;
        }
    }

    private onGroupSettingsPropertyChanged(newProp: GroupModel, oldProp: GroupModel): void {
        for (let prop of Object.keys(newProp)) {
            if (prop === 'headerTooltipTemplate') {
                this.headerTooltipTemplateFn = this.templateParser(newProp[prop]);
            } else {
                this.initializeView(this.currentView);
                this.eventWindow.refresh();
            }
        }
    }

    private onEventSettingsPropertyChanged(newProp: EventSettingsModel, oldProp: EventSettingsModel): void {
        let requireRefresh: boolean = false;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'dataSource':
                case 'query':
                case 'fields':
                    this.initializeDataModule();
                    requireRefresh = true;
                    break;
                case 'template':
                    this.activeViewOptions.eventTemplate = newProp.template;
                    this.appointmentTemplateFn = this.templateParser(this.activeViewOptions.eventTemplate);
                    requireRefresh = true;
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
                    requireRefresh = true;
                    break;
            }
        }
        if (requireRefresh) {
            this.renderModule.refreshDataManager();
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
        let startHour: Date = this.globalize.parseDate(start, { skeleton: 'Hm' });
        let endHour: Date = this.globalize.parseDate(end, { skeleton: 'Hm' });
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
    public getCellDetails(td: Element): CellClickEventArgs {
        let startTime: Date = this.getDateFromElement(td);
        if (isNullOrUndefined(startTime)) {
            return undefined;
        }
        let endTime: Date;
        let duration: number = 1;
        let endDateFromColSpan: boolean = this.activeView.isTimelineView() && !isNullOrUndefined(td.getAttribute('colSpan'));
        if (endDateFromColSpan) {
            duration = parseInt(td.getAttribute('colSpan'), 10);
        }
        if (!this.activeViewOptions.timeScale.enable || td.classList.contains(cls.ALLDAY_CELLS_CLASS) ||
            td.classList.contains(cls.HEADER_CELLS_CLASS) || endDateFromColSpan) {
            endTime = util.addDays(new Date(startTime.getTime()), duration);
        } else {
            endTime = this.activeView.getEndDateFromStartDate(startTime);
        }
        let data: CellClickEventArgs = {
            startTime: startTime,
            endTime: endTime,
            isAllDay: this.isAllDayCell(td),
            element: td as HTMLElement
        };
        let groupIndex: string = td.getAttribute('data-group-index');
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
            return { resource: data.resource, resourceData: data.resourceData };
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
     * Adds the newly created event into the Schedule dataSource.
     * @method addEvent
     * @param {Object | Object[]} data Single or collection of event objects to be added into Schedule.
     * @returns {void}
     */
    public addEvent(data: Object | Object[]): void {
        this.crudModule.addEvent(data);
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
    public getEvents(): Object[] {
        return this.eventsData;
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
        return this.activeView.renderDates;
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
     * @param {Date} startTime Denotes the start time of the slot.
     * @param {Date} endTime Denotes the end time of the slot.
     * @param {number} groupIndex Defines the resource index from last level.
     * @returns {boolean} Returns true, if the slot that lies in the provided time range does not contain any other events.
     */
    public isSlotAvailable(startTime: Date, endTime: Date, groupIndex?: number): boolean {
        let eventCollection: Object[] = this.eventBase.filterEvents(startTime, endTime);
        if (this.currentAction !== 'Add' && this.activeEventData.event) {
            eventCollection = eventCollection.filter((event: { [key: string]: Object }) => event.Guid !==
                (<{ [key: string]: Object }>this.activeEventData.event).Guid);
        }
        if (!isNullOrUndefined(groupIndex) && this.resourceBase && this.resourceBase.lastResourceLevel.length > 0) {
            eventCollection = this.eventBase.filterEventsByResource(this.resourceBase.lastResourceLevel[groupIndex], eventCollection);
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
     * @returns {void}
     */
    public openEditor(data: Object, action: CurrentAction, isEventData?: boolean): void {
        this.eventWindow.openEditor(data, action, isEventData);
    }

    /**
     * This method has been added to adjust the size of the outer event wrapper class that holds the collection of events,
     *  while trying to set manual height and width to the Schedule cells.
     * @method adjustEventWrapper
     * @returns {void}
     */
    public adjustEventWrapper(): void {
        this.activeView.adjustEventWrapper();
    }

    /**
     * Adds the resources to the specified index.
     * @param resources
     * @param {string} name Name of the resource defined in resources collection.
     * @param {number} index Index or position where the resource should be added.
     */
    public addResource(resources: Object, name: string, index: number): void {
        this.resourceBase.addResource(resources, name, index);
    }

    /**
     * Removes the specified resource.
     * @param resourceId Specifies the resource id to be removed.
     * @param name Specifies the resource name from which the id should be referred.
     */
    public removeResource(resourceId: string | number, name: string): void {
        this.resourceBase.removeResource(resourceId, name);
    }

    /**
     * Destroys the Schedule component.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        if (this.quickPopup) {
            this.quickPopup.destroy();
            this.quickPopup = null;
        }
        if (this.eventTooltip) {
            this.eventTooltip.destroy();
            this.eventTooltip = null;
        }
        if (this.eventWindow) {
            this.eventWindow.destroy();
            this.eventWindow = null;
        }
        this.unwireEvents();
        if (this.headerModule) {
            this.headerModule.destroy();
            this.headerModule = null;
        }
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
