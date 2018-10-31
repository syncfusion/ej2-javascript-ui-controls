
import { Component, EventHandler, Internationalization, } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, KeyboardEvents, L10n } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, KeyboardEventArgs, BaseEventArgs } from '@syncfusion/ej2-base';
import { cldrData, getDefaultDateObject, rippleEffect } from '@syncfusion/ej2-base';
import { createElement, removeClass, detach, closest, addClass, attributes } from '@syncfusion/ej2-base';
import { getValue, getUniqueID, extend, Browser } from '@syncfusion/ej2-base';
import { Property, Event, EmitType, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CalendarModel, CalendarBaseModel } from './calendar-model';


/**
 * Specifies the view of the calendar.
 */
export type CalendarView = 'Month' | 'Year' | 'Decade';

//class constant defination.
const OTHERMONTH: string = 'e-other-month';
const ROOT: string = 'e-calendar';
const DEVICE: string = 'e-device';
const HEADER: string = 'e-header';
const RTL: string = 'e-rtl';
const CONTENT: string = 'e-content';
const YEAR: string = 'e-year';
const MONTH: string = 'e-month';
const DECADE: string = 'e-decade';
const ICON: string = 'e-icons';
const PREVICON: string = 'e-prev';
const NEXTICON: string = 'e-next';
const PREVSPAN: string = 'e-date-icon-prev';
const NEXTSPAN: string = 'e-date-icon-next ';
const ICONCONTAINER: string = 'e-icon-container';
const DISABLED: string = 'e-disabled';
const OVERLAY: string = 'e-overlay';
const WEEKEND: string = 'e-weekend';
const WEEKNUMBER: string = 'e-week-number';
const SELECTED: string = 'e-selected';
const FOCUSEDDATE: string = 'e-focused-date';
const OTHERMONTHROW: string = 'e-month-hide';
const TODAY: string = 'e-today';
const TITLE: string = 'e-title';
const LINK: string = 'e-day';
const CELL: string = 'e-cell';
const WEEKHEADER: string = 'e-week-header';
const ZOOMIN: string = 'e-zoomin';
const FOOTER: string = 'e-footer-container';
const BTN: string = 'e-btn';
const FLAT: string = 'e-flat';
const CSS: string = 'e-css';
const PRIMARY: string = 'e-primary';
const dayMilliSeconds: number = 86400000;
const minutesMilliSeconds: number = 60000;

/**
 * 
 * @private
 */
@NotifyPropertyChanges
export class CalendarBase extends Component<HTMLElement> implements INotifyPropertyChanged {
    protected headerElement: HTMLElement;
    protected contentElement: HTMLElement;
    protected table: HTMLElement;
    protected tableHeadElement: HTMLElement;
    protected tableBodyElement: Element;
    protected nextIcon: HTMLElement;
    protected previousIcon: HTMLElement;
    protected headerTitleElement: HTMLElement;
    protected todayElement: HTMLElement;
    protected footer: HTMLElement;
    protected keyboardModule: KeyboardEvents;
    protected globalize: Internationalization;
    protected currentDate: Date;
    protected navigatedArgs: NavigatedEventArgs;
    protected renderDayCellArgs: RenderDayCellEventArgs;
    protected effect: string = '';
    protected previousDate: Date;
    protected previousValues: number;
    protected navigateHandler: Function;
    protected navigatePreviousHandler: Function;
    protected navigateNextHandler: Function;
    protected l10: L10n;
    protected todayDisabled: boolean;
    protected todayDate: Date;
    //this.element clone
    protected calendarElement: HTMLElement;
    protected keyConfigs: { [key: string]: string } = {
        controlUp: 'ctrl+38',
        controlDown: 'ctrl+40',
        moveDown: 'downarrow',
        moveUp: 'uparrow',
        moveLeft: 'leftarrow',
        moveRight: 'rightarrow',
        select: 'enter',
        home: 'home',
        end: 'end',
        pageUp: 'pageup',
        pageDown: 'pagedown',
        shiftPageUp: 'shift+pageup',
        shiftPageDown: 'shift+pagedown',
        controlHome: 'ctrl+home',
        controlEnd: 'ctrl+end',
        altUpArrow: 'alt+uparrow',
        spacebar: 'space',
        altRightArrow: 'alt+rightarrow',
        altLeftArrow: 'alt+leftarrow'
    };

    /**
     * Gets or sets the minimum date that can be selected in the Calendar.
     * @default new Date(1900, 00, 01)
     */
    @Property(new Date(1900, 0, 1))
    public min: Date;
    /**
     * Gets or sets the maximum date that can be selected in the Calendar.
     * @default new Date(2099, 11, 31)
     */
    @Property(new Date(2099, 11, 31))
    public max: Date;
    /**
     * Gets or sets the Calendar's first day of the week. By default, the first day of the week will be based on the current culture.
     * @default 0
     * @aspType int
     * > For more details about firstDayOfWeek refer to 
     * [`First day of week`](./how-to.html#change-the-first-day-of-the-week) documentation.
     */
    @Property(null)
    public firstDayOfWeek: number;
    /**
     * Specifies the initial view of the Calendar when it is opened.
     * With the help of this property, initial view can be changed to year or decade view.
     * @default Month
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
     * [`calendarView`](./calendar-views.html#view-restriction)documentation.
     */
    @Property('Month')
    public start: CalendarView;
    /**
     * Sets the maximum level of view such as month, year, and decade in the Calendar.
     * Depth view should be smaller than the start view to restrict its view navigation.
     * @default Month
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
     *  [`calendarView`](./calendar-views.html#view-restriction)documentation.
     */
    @Property('Month')
    public depth: CalendarView;
    /**
     * Determines whether the week number of the year is to be displayed in the calendar or not.
     * @default false
     * > For more details about weekNumber refer to 
     * [`Calendar with week number`](./how-to.html#render-the-calendar-with-week-numbers)documentation.
     */
    @Property(false)
    public weekNumber: boolean;
    /** 
     * Specifies whether the today button is to be displayed or not.
     * @default true
     */
    @Property(true)
    public showTodayButton: boolean;
    /** 
     * When set to true, enables RTL mode of the component that displays the content in the right-to-left direction.
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;
    /** 
     * Enable or disable persisting component's state between page reloads. If enabled, following list of states will be persisted.
     * 1. value
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;
    /** 
     * Triggers when Calendar is created.
     * @event 
     */
    @Event()
    public created: EmitType<Object>;
    /** 
     * Triggers when Calendar is destroyed.
     * @event 
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers when the Calendar is navigated to another level or within the same level of view.
     * @event
     */
    @Event()
    public navigated: EmitType<NavigatedEventArgs>;
    /**     
     * Triggers when each day cell of the Calendar is rendered.
     * @event
     */
    @Event()
    public renderDayCell: EmitType<RenderDayCellEventArgs>;
    /**
     * Initialized new instance of Calendar Class.
     * Constructor for creating the widget
     * @param  {CalendarModel} options?
     * @param  {string|HTMLElement} element?
     */
    constructor(options?: CalendarBaseModel, element?: string | HTMLElement) {
        super(options, element);
    }
    /**
     * To Initialize the control rendering.
     * @returns void
     * @private
     */
    protected render(): void {
        this.globalize = new Internationalization(this.locale);
        if (isNullOrUndefined(this.firstDayOfWeek) || this.firstDayOfWeek > 6 || this.firstDayOfWeek < 0) {
            this.setProperties({ firstDayOfWeek: this.globalize.getFirstDayOfWeek() }, true);
        }
        this.todayDisabled = false;
        this.todayDate = new Date(new Date().setHours(0, 0, 0, 0));
        if (this.getModuleName() === 'calendar') {
            this.element.classList.add(ROOT);
            if (this.enableRtl) {
                this.element.classList.add(RTL);
            }
            if (Browser.isDevice) {
                this.element.classList.add(DEVICE);
            }
            attributes(this.element, <{ [key: string]: string }>{
                'data-role': 'calendar'
            });
        } else {
            this.calendarElement = this.createElement('div');
            this.calendarElement.classList.add(ROOT);
            if (this.enableRtl) {
                this.calendarElement.classList.add(RTL);
            }
            if (Browser.isDevice) {
                this.calendarElement.classList.add(DEVICE);
            }
            attributes(this.calendarElement, <{ [key: string]: string }>{
                'role': 'calendar'
            });
        }
        this.createHeader();
        this.createContent();
        this.wireEvents();
    }

    protected validateDate(value?: Date): void {
        this.setProperties({ min: this.checkDateValue(new Date('' + this.min)) }, true);
        this.setProperties({ max: this.checkDateValue(new Date('' + this.max)) }, true);
        this.currentDate = this.currentDate ? this.currentDate : new Date(new Date().setHours(0, 0, 0, 0));
        if (!isNullOrUndefined(value) && this.min <= this.max && value >= this.min && value <= this.max) {
            this.currentDate = new Date('' + value);
        }
    }

    protected minMaxUpdate(value?: Date): void {
        if (!(+this.min <= +this.max)) {
            this.setProperties({ min: this.min }, true);
            addClass([this.element], OVERLAY);
        } else {
            removeClass([this.element], OVERLAY);
        }
        this.min = isNullOrUndefined(this.min) || !(+this.min) ? this.min = new Date(1900, 0, 1) : this.min;
        this.max = isNullOrUndefined(this.max) || !(+this.max) ? this.max = new Date(2099, 11, 31) : this.max;
        if (+this.min <= +this.max && value && +value <= +this.max && +value >= +this.min) {
            this.currentDate = new Date('' + value);
        } else {
            if (+this.min <= +this.max && !value && +this.currentDate > +this.max) {
                this.currentDate = new Date('' + this.max);
            } else {
                if (+this.currentDate < +this.min) {
                    this.currentDate = new Date('' + this.min);
                }
            }
        }
    }



    protected createHeader(): void {
        let ariaPrevAttrs: Object = {
            'aria-disabled': 'false',
            'aria-label': 'previous month'
        };
        let ariaNextAttrs: Object = {
            'aria-disabled': 'false',
            'aria-label': 'next month'

        };
        let ariaTitleAttrs: Object = {
            'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'title'
        };
        this.headerElement = this.createElement('div', { className: HEADER });
        let iconContainer: HTMLElement = this.createElement('div', { className: ICONCONTAINER });
        this.previousIcon = this.createElement('button', { className: '' + PREVICON, attrs: { type: 'button' } });
        rippleEffect(this.previousIcon, {
            duration: 400,
            selector: '.e-prev',
            isCenterRipple: true
        });
        attributes(this.previousIcon, <{ [key: string]: string }>ariaPrevAttrs);
        this.nextIcon = this.createElement('button', { className: '' + NEXTICON, attrs: { type: 'button' } });
        rippleEffect(this.nextIcon, {
            selector: '.e-next',
            duration: 400,
            isCenterRipple: true
        });
        attributes(this.nextIcon, <{ [key: string]: string }>ariaNextAttrs);
        this.headerTitleElement = this.createElement('div', { className: '' + LINK + ' ' + TITLE });
        attributes(this.headerTitleElement, <{ [key: string]: string }>ariaTitleAttrs);
        this.headerElement.appendChild(this.headerTitleElement);
        this.previousIcon.appendChild(this.createElement('span', { className: '' + PREVSPAN + ' ' + ICON }));
        this.nextIcon.appendChild(this.createElement('span', { className: '' + NEXTSPAN + ' ' + ICON }));
        iconContainer.appendChild(this.previousIcon);
        iconContainer.appendChild(this.nextIcon);
        this.headerElement.appendChild(iconContainer);
        if (this.getModuleName() === 'calendar') {
            this.element.appendChild(this.headerElement);
        } else {
            this.calendarElement.appendChild(this.headerElement);
        }
    }
    protected createContent(): void {
        this.contentElement = this.createElement('div', { className: CONTENT });
        this.table = this.createElement('table', { attrs: { tabIndex: '0', 'role': 'grid', 'aria-activedescendant': '' } });
        if (this.getModuleName() === 'calendar') {
            this.element.appendChild(this.contentElement);
        } else {
            this.calendarElement.appendChild(this.contentElement);
        }

        this.contentElement.appendChild(this.table);
        this.createContentHeader();
        this.createContentBody();
        if (this.showTodayButton) {
            this.createContentFooter();
        }
    }
    protected getCultureValues(): string[] {
        let culShortNames: string[] = [];
        let cldrObj: string[];
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrObj = <string[]>(getValue('days.stand-alone.short', getDefaultDateObject()));
        } else {
            cldrObj = <string[]>(this.getCultureObjects(cldrData, '' + this.locale));
        }
        for (let obj of Object.keys(cldrObj)) {
            culShortNames.push(getValue(obj, cldrObj));
        }
        return culShortNames;
    }
    protected createContentHeader(): void {
        if (this.getModuleName() === 'calendar') {
            if (!isNullOrUndefined(this.element.querySelectorAll('.e-content .e-week-header')[0])) {
                detach(this.element.querySelectorAll('.e-content .e-week-header')[0]);
            }
        } else {
            if (!isNullOrUndefined(this.calendarElement.querySelectorAll('.e-content .e-week-header')[0])) {
                detach(this.calendarElement.querySelectorAll('.e-content .e-week-header')[0]);
            }
        }
        let daysCount: number = 6;
        let html: string = '';
        let shortNames: string[];
        if (this.firstDayOfWeek > 6 || this.firstDayOfWeek < 0) {
            this.setProperties({ firstDayOfWeek: 0 }, true);
        }
        this.tableHeadElement = this.createElement('thead', { className: WEEKHEADER });
        if (this.weekNumber) {
            html += '<th class="e-week-number"></th>';
            if (this.getModuleName() === 'calendar') {
                addClass([this.element], '' + WEEKNUMBER);
            } else {
                addClass([this.calendarElement], '' + WEEKNUMBER);
            }
        }
        shortNames = this.shiftArray(((this.getCultureValues().length > 0 && this.getCultureValues())), this.firstDayOfWeek);
        for (let days: number = 0; days <= daysCount; days++) {
            html += '<th  class="">' + shortNames[days] + '</th>';
        }
        html = '<tr>' + html + '</tr>';
        this.tableHeadElement.innerHTML = html;
        this.table.appendChild(this.tableHeadElement);
    }
    protected createContentBody(): void {
        if (this.getModuleName() === 'calendar') {
            if (!isNullOrUndefined(this.element.querySelectorAll('.e-content tbody')[0])) {
                detach(this.element.querySelectorAll('.e-content tbody')[0]);
            }
        } else {
            if (!isNullOrUndefined(this.calendarElement.querySelectorAll('.e-content tbody')[0])) {
                detach(this.calendarElement.querySelectorAll('.e-content tbody')[0]);
            }
        }
        switch (this.start) {
            case 'Year':
                this.renderYears();
                break;
            case 'Decade':
                this.renderDecades();
                break;
            default:
                this.renderMonths();
        }
    }
    protected updateFooter(): void {
        this.todayElement.textContent = this.l10.getConstant('today');
    }
    protected createContentFooter(): void {
        if (this.showTodayButton) {
            let minimum: Date = new Date(+this.min);
            let maximum: Date = new Date(+this.max);
            let l10nLocale: object = { today: 'Today' };
            this.globalize = new Internationalization(this.locale);
            this.l10 = new L10n(this.getModuleName(), l10nLocale, this.locale);
            this.todayElement = this.createElement('button');
            rippleEffect(this.todayElement);
            this.updateFooter();
            addClass([this.todayElement], [BTN, TODAY, FLAT, PRIMARY, CSS]);
            if ((!(+new Date(minimum.setHours(0, 0, 0, 0)) <= +this.todayDate &&
                +this.todayDate <= +new Date(maximum.setHours(0, 0, 0, 0)))) || (this.todayDisabled)) {
                addClass([this.todayElement], DISABLED);
            }
            this.footer = this.createElement('div', { className: FOOTER });
            this.footer.appendChild(this.todayElement);
            if (this.getModuleName() === 'calendar') {
                this.element.appendChild(this.footer);
            }
            if (this.getModuleName() === 'datepicker') {
                this.calendarElement.appendChild(this.footer);
            }
            if (this.getModuleName() === 'datetimepicker') {
                this.calendarElement.appendChild(this.footer);
            }
            if (!this.todayElement.classList.contains(DISABLED)) {
                EventHandler.add(this.todayElement, 'click', this.todayButtonClick, this);
            }
        }
    }
    protected wireEvents(): void {
        EventHandler.add(this.headerTitleElement, 'click', this.navigateTitle, this);
        if (this.getModuleName() === 'calendar') {
            this.keyboardModule = new KeyboardEvents(
                <HTMLElement>this.element,
                {
                    eventName: 'keydown',
                    keyAction: this.keyActionHandle.bind(this),
                    keyConfigs: this.keyConfigs
                });
        } else {
            this.keyboardModule = new KeyboardEvents(
                <HTMLElement>this.calendarElement,
                {
                    eventName: 'keydown',
                    keyAction: this.keyActionHandle.bind(this),
                    keyConfigs: this.keyConfigs
                });
        }
    }
    protected todayButtonClick(value?: Date): void {
        if (this.showTodayButton) {
            if (this.currentView() === this.depth) {
                this.effect = '';
            } else {
                this.effect = 'e-zoomin';
            }
            if (this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                this.navigateTo(this.depth, new Date('' + value));
            } else {
                this.navigateTo('Month', new Date('' + value));
            }
        }
    }
    // tslint:disable-next-line:max-func-body-length
    protected keyActionHandle(e: KeyboardEventArgs, value?: Date, multiSelection?: boolean): void {
        let view: number = this.getViewNumber(this.currentView());
        let focusedDate: Element = this.tableBodyElement.querySelector('tr td.e-focused-date');
        let selectedDate: Element;
        if (multiSelection) {
            if (!isNullOrUndefined(focusedDate) && +value === parseInt(focusedDate.getAttribute('id').split('_')[0], 10)) {
                selectedDate = focusedDate;
            } else {
                selectedDate = this.tableBodyElement.querySelector('tr td.e-selected');
            }
        } else {
            selectedDate = this.tableBodyElement.querySelector('tr td.e-selected');
        }
        let depthValue: number = this.getViewNumber(this.depth);
        let levelRestrict: boolean = (view === depthValue && this.getViewNumber(this.start) >= depthValue);
        this.effect = '';
        switch (e.action) {
            case 'moveLeft':
                this.KeyboardNavigate(-1, view, e, this.max, this.min);
                e.preventDefault();
                break;
            case 'moveRight':
                this.KeyboardNavigate(1, view, e, this.max, this.min);
                e.preventDefault();
                break;
            case 'moveUp':
                if (view === 0) {
                    this.KeyboardNavigate(-7, view, e, this.max, this.min); // move the current date to the previous seven days.
                } else {
                    this.KeyboardNavigate(-4, view, e, this.max, this.min); // move the current year to the previous four days.
                }
                e.preventDefault();
                break;
            case 'moveDown':
                if (view === 0) {
                    this.KeyboardNavigate(7, view, e, this.max, this.min);
                } else {
                    this.KeyboardNavigate(4, view, e, this.max, this.min);
                }
                e.preventDefault();
                break;
            case 'select':
                if (e.target === this.todayElement) {
                    this.todayButtonClick(value);
                } else {
                    let element: Element = !isNullOrUndefined(focusedDate) ? focusedDate : selectedDate;
                    if (!isNullOrUndefined(element) && !element.classList.contains(DISABLED)) {
                        if (levelRestrict) {
                            let d: Date = new Date(parseInt('' + (element).id, 0));
                            this.selectDate(e, d, (element));
                        } else {
                            this.contentClick(null, --view, (element), value);
                        }
                    }
                }
                break;
            case 'controlUp':
                this.title();
                e.preventDefault();
                break;
            case 'controlDown':
                if (!isNullOrUndefined(focusedDate) || !isNullOrUndefined(selectedDate) && !levelRestrict) {
                    this.contentClick(null, --view, (focusedDate || selectedDate), value);
                }
                e.preventDefault();
                break;
            case 'home':
                this.currentDate = this.firstDay(this.currentDate);
                detach(this.tableBodyElement);
                (view === 0) ? this.renderMonths(e) : ((view === 1) ? this.renderYears(e) : this.renderDecades(e));
                e.preventDefault();
                break;
            case 'end':
                this.currentDate = this.lastDay(this.currentDate, view);
                detach(this.tableBodyElement);
                (view === 0) ? this.renderMonths(e) : ((view === 1) ? this.renderYears(e) : this.renderDecades(e));
                e.preventDefault();
                break;
            case 'pageUp':
                this.addMonths(this.currentDate, -1);
                this.navigateTo('Month', this.currentDate);
                e.preventDefault();
                break;
            case 'pageDown':
                this.addMonths(this.currentDate, 1);
                this.navigateTo('Month', this.currentDate);
                e.preventDefault();
                break;
            case 'shiftPageUp':
                this.addYears(this.currentDate, -1);
                this.navigateTo('Month', this.currentDate);
                e.preventDefault();
                break;
            case 'shiftPageDown':
                this.addYears(this.currentDate, 1);
                this.navigateTo('Month', this.currentDate);
                e.preventDefault();
                break;
            case 'controlHome':
                this.navigateTo('Month', new Date(this.currentDate.getFullYear(), 0, 1));
                e.preventDefault();
                break;
            case 'controlEnd':
                this.navigateTo('Month', new Date(this.currentDate.getFullYear(), 11, 31));
                e.preventDefault();
                break;
        }
        if (this.getModuleName() === 'calendar') { this.table.focus(); }
    }

    protected KeyboardNavigate(number: number, currentView: number, e: KeyboardEvent, max: Date, min: Date): void {
        let date: Date = new Date('' + this.currentDate);
        switch (currentView) {
            case 2:
                this.addYears(this.currentDate, number);
                if (this.isMonthYearRange(this.currentDate)) {
                    detach(this.tableBodyElement);
                    this.renderDecades(e);
                } else {
                    this.currentDate = date;
                }
                break;
            case 1:
                this.addMonths(this.currentDate, number);
                if (this.isMonthYearRange(this.currentDate)) {
                    detach(this.tableBodyElement);
                    this.renderYears(e);
                } else {
                    this.currentDate = date;
                }
                break;
            case 0:
                this.addDay(this.currentDate, number, e, max, min);
                if (this.isMinMaxRange(this.currentDate)) {
                    detach(this.tableBodyElement);
                    this.renderMonths(e);
                } else {
                    this.currentDate = date;
                }
                break;
        }
    }

    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(value?: Date): void {
        this.navigatePreviousHandler = this.navigatePrevious.bind(this);
        this.navigateNextHandler = this.navigateNext.bind(this);
        this.navigateHandler = (e: MouseEvent): void => {
            this.triggerNavigate(e);
        };
    };
    protected minMaxDate(localDate: Date): Date {
        let currentDate: Date = new Date(new Date(+localDate).setHours(0, 0, 0, 0));
        let minDate: Date = new Date(new Date(+this.min).setHours(0, 0, 0, 0));
        let maxDate: Date = new Date(new Date(+this.max).setHours(0, 0, 0, 0));
        if (+currentDate === +minDate || +currentDate === +maxDate) {
            if (+localDate < +this.min) {
                localDate = new Date(+this.min);
            }
            if (+localDate > +this.max) {
                localDate = new Date(+this.max);
            }
        }
        return localDate;
    }
    protected renderMonths(e?: Event, value?: Date): void {
        let numCells: number = this.weekNumber ? 8 : 7;
        let tdEles: HTMLElement[] = this.renderDays(this.currentDate, e, value);
        this.createContentHeader();
        this.renderTemplate(tdEles, numCells, MONTH, e, value);
    }
    // tslint:disable-next-line:max-func-body-length
    protected renderDays(currentDate: Date, e?: Event, value?: Date, multiSelection?: boolean, values?: Date[]): HTMLElement[] {
        let tdEles: HTMLElement[] = [];
        let cellsCount: number = 42;
        let localDate: Date = new Date('' + currentDate);
        let minMaxDate: Date;
        let numCells: number = this.weekNumber ? 8 : 7;
        // 8 and 7 denotes the number of columns to be specified.
        let currentMonth: number = localDate.getMonth();
        this.titleUpdate(currentDate, 'days');
        let d: Date = localDate;
        localDate = new Date(d.getFullYear(), d.getMonth(), 0, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
        while (localDate.getDay() !== this.firstDayOfWeek) {
            this.setStartDate(localDate, -1 * dayMilliSeconds);
        }
        for (let day: number = 0; day < cellsCount; ++day) {
            let weekEle: HTMLElement = this.createElement('td', { className: CELL });
            let weekAnchor: HTMLElement = this.createElement('span');
            if (day % 7 === 0 && this.weekNumber) {
                weekAnchor.textContent = '' + this.getWeek(localDate);
                weekEle.appendChild(weekAnchor);
                addClass([weekEle], '' + WEEKNUMBER);
                tdEles.push(weekEle);
            }
            minMaxDate = new Date(+localDate);
            localDate = this.minMaxDate(localDate);
            let dateFormatOptions: object = { type: 'dateTime', skeleton: 'full' };
            let date: Date = this.globalize.parseDate(this.globalize.formatDate(localDate, dateFormatOptions), dateFormatOptions);
            let tdEle: HTMLElement = this.dayCell(localDate);
            let title: string = this.globalize.formatDate(localDate, { type: 'date', skeleton: 'full' });
            let dayLink: HTMLElement = this.createElement('span');
            dayLink.textContent = this.globalize.formatDate(localDate, { type: 'date', skeleton: 'd' });
            let disabled: boolean = (this.min > localDate) || (this.max < localDate);
            if (disabled) {
                addClass([tdEle], DISABLED);
                addClass([tdEle], OVERLAY);
            } else {
                dayLink.setAttribute('title', '' + title);
            }
            if (currentMonth !== localDate.getMonth()) {
                addClass([tdEle], OTHERMONTH);
            }
            if (localDate.getDay() === 0 || localDate.getDay() === 6) {
                addClass([tdEle], WEEKEND);
            }
            tdEle.appendChild(dayLink);
            this.renderDayCellArgs = {
                date: localDate,
                isDisabled: false,
                element: tdEle,
                isOutOfRange: disabled
            };
            let argument: RenderDayCellEventArgs = this.renderDayCellArgs;
            this.renderDayCellEvent(argument);
            if (argument.isDisabled) {
                if (multiSelection) {
                    if (!isNullOrUndefined(values) && values.length > 0) {
                        for (let index: number = 0; index < values.length; index++) {
                            let localDateString: number =
                                +new Date(this.globalize.formatDate(argument.date, { type: 'date', skeleton: 'yMd' }));
                            let tempDateString: number =
                                +new Date(this.globalize.formatDate(values[index], { type: 'date', skeleton: 'yMd' }));
                            if (localDateString === tempDateString) {
                                values.splice(index, 1);
                                index = -1;
                            }
                        }
                    }

                } else if (value && +value === +argument.date) {
                    this.setProperties({ value: null }, true);
                }
            }
            if (this.renderDayCellArgs.isDisabled && !tdEle.classList.contains(SELECTED)) {
                addClass([tdEle], DISABLED);
                addClass([tdEle], OVERLAY);
                if (+this.renderDayCellArgs.date === +this.todayDate) {
                    this.todayDisabled = true;
                }
            }
            let otherMnthBool: boolean = tdEle.classList.contains(OTHERMONTH);
            let disabledCls: boolean = tdEle.classList.contains(DISABLED);
            if (!disabledCls) {
                EventHandler.add(tdEle, 'click', this.clickHandler, this);
            }
            // to set the value as null while setting the disabled date onProperty change.
            // if (args.isDisabled && +this.value === +args.date) {
            //     this.setProperties({ value: null }, true);
            // }
            if (multiSelection && !isNullOrUndefined(values) && !otherMnthBool && !disabledCls) {
                for (let tempValue: number = 0; tempValue < values.length; tempValue++) {
                    let localDateString: string = this.globalize.formatDate(localDate, { type: 'date', skeleton: 'short' });
                    let tempDateString: string = this.globalize.formatDate(values[tempValue], { type: 'date', skeleton: 'short' });
                    if (localDateString === tempDateString && this.getDateVal(localDate, values[tempValue])) {
                        addClass([tdEle], SELECTED);
                    } else {
                        this.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
                    }
                }
                if (values.length <= 0) {
                    this.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
                }
            } else if (!otherMnthBool && !disabledCls && this.getDateVal(localDate, value)) {
                addClass([tdEle], SELECTED);
            } else {
                this.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
            }
            if (date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate()) {
                if (date.getFullYear() === new Date().getFullYear()) {
                    addClass([tdEle], TODAY);
                }
            }
            tdEles.push(this.renderDayCellArgs.element);
            localDate = new Date(+minMaxDate);
            this.addDay(localDate, 1, null, this.max, this.min);
        }
        return tdEles;
    }
    protected updateFocus(otherMonth: boolean, disabled: boolean, localDate: Date, tableElement: HTMLElement, currentDate: Date): void {
        if (currentDate.getDate() === localDate.getDate() && !otherMonth && !disabled) {
            addClass([tableElement], FOCUSEDDATE);
        } else {
            if (currentDate >= this.max && parseInt(tableElement.id, 0) === +this.max && !otherMonth && !disabled) {
                addClass([tableElement], FOCUSEDDATE);
            }
            if (currentDate <= this.min && parseInt(tableElement.id, 0) === +this.min && !otherMonth && !disabled) {
                addClass([tableElement], FOCUSEDDATE);
            }
        }
    }
    protected renderYears(e?: Event, value?: Date): void {
        this.removeTableHeadElement();
        let numCells: number = 4;
        let days: number[];
        let tdEles: HTMLElement[] = [];
        let valueUtil: boolean = isNullOrUndefined(value);
        let curDate: Date = new Date('' + this.currentDate);
        let mon: number = curDate.getMonth();
        let yr: number = curDate.getFullYear();
        let localDate: Date = curDate;
        let curYrs: number = localDate.getFullYear();
        let minYr: number = new Date('' + this.min).getFullYear();
        let minMonth: number = new Date('' + this.min).getMonth();
        let maxYr: number = new Date('' + this.max).getFullYear();
        let maxMonth: number = new Date('' + this.max).getMonth();
        localDate.setMonth(0);
        this.titleUpdate(this.currentDate, 'months');
        let disabled: boolean = (this.min > localDate) || (this.max < localDate);
        localDate.setDate(1);
        for (let month: number = 0; month < 12; ++month) {
            let tdEle: HTMLElement = this.dayCell(localDate);
            let dayLink: HTMLElement = this.createElement('span');
            let localMonth: boolean = (value && (value).getMonth() === localDate.getMonth());
            let select: boolean = (value && (value).getFullYear() === yr && localMonth);
            dayLink.textContent = this.globalize.formatDate(localDate, { type: 'dateTime', skeleton: 'MMM' });
            if ((this.min && (curYrs < minYr || (month < minMonth && curYrs === minYr))) || (
                this.max && (curYrs > maxYr || (month > maxMonth && curYrs >= maxYr)))) {
                addClass([tdEle], DISABLED);
            } else if (!valueUtil && select) {
                addClass([tdEle], SELECTED);
            } else {
                if (localDate.getMonth() === mon && this.currentDate.getMonth() === mon) {
                    addClass([tdEle], FOCUSEDDATE);
                }
            }
            localDate.setDate(1);
            localDate.setMonth(localDate.getMonth() + 1);
            if (!tdEle.classList.contains(DISABLED)) {
                EventHandler.add(tdEle, 'click', this.clickHandler, this);
            }
            tdEle.appendChild(dayLink);
            tdEles.push(tdEle);
        }
        this.renderTemplate(tdEles, numCells, YEAR, e, value);
    }
    protected renderDecades(e?: Event, value?: Date): void {
        this.removeTableHeadElement();
        let numCells: number = 4;
        let yearCell: number = 12;
        let tdEles: HTMLElement[] = [];
        let localDate: Date = new Date('' + this.currentDate);
        localDate.setMonth(0);
        localDate.setDate(1);
        let localYr: number = localDate.getFullYear();
        let startYr: Date = new Date('' + (localYr - localYr % 10));
        let endYr: Date = new Date('' + (localYr - localYr % 10 + (10 - 1)));
        let startHdrYr: string = this.globalize.formatDate(startYr, { type: 'dateTime', skeleton: 'y' });
        let endHdrYr: string = this.globalize.formatDate(endYr, { type: 'dateTime', skeleton: 'y' });
        this.headerTitleElement.textContent = startHdrYr + ' - ' + (endHdrYr);
        let start: Date = new Date(localYr - (localYr % 10) - 1, 0, 1);
        let startYear: number = start.getFullYear();
        for (let rowIterator: number = 0; rowIterator < yearCell; ++rowIterator) {
            let year: number = startYear + rowIterator;
            localDate.setFullYear(year);
            let tdEle: HTMLElement = this.dayCell(localDate);
            attributes(tdEle, { 'role': 'gridcell' });
            let dayLink: HTMLElement = this.createElement('span');
            dayLink.textContent = this.globalize.formatDate(localDate, { type: 'dateTime', skeleton: 'y' });
            if (year < new Date('' + this.min).getFullYear() || year > new Date('' + this.max).getFullYear()) {
                addClass([tdEle], DISABLED);
            } else if (!isNullOrUndefined(value) && localDate.getFullYear() === (value).getFullYear()) {
                addClass([tdEle], SELECTED);
            } else {
                if (localDate.getFullYear() === this.currentDate.getFullYear() && !tdEle.classList.contains(DISABLED)) {
                    addClass([tdEle], FOCUSEDDATE);
                }
            }
            if (!tdEle.classList.contains(DISABLED)) {
                EventHandler.add(tdEle, 'click', this.clickHandler, this);
            }
            tdEle.appendChild(dayLink);
            tdEles.push(tdEle);
        }
        this.renderTemplate(tdEles, numCells, 'e-decade', e, value);
    }
    protected dayCell(localDate: Date): HTMLElement {
        let dateFormatOptions: object = { skeleton: 'full', type: 'dateTime' };
        let date: Date = this.globalize.parseDate(this.globalize.formatDate(localDate, dateFormatOptions), dateFormatOptions);
        let value: number = date.valueOf();
        let attrs: Object = {
            className: CELL, attrs: { 'id': '' + getUniqueID('' + value), 'aria-selected': 'false', 'role': 'gridcell' }
        };
        return this.createElement('td', attrs);
    }
    protected firstDay(date: Date): Date {
        let collection: Element[] = <NodeListOf<HTMLTableDataCellElement> & Element[]>
            this.tableBodyElement.querySelectorAll('td' + ':not(.' + OTHERMONTH + '');
        if (collection.length) {
            for (let i: number = 0; i < collection.length; i++) {
                if (!collection[i].classList.contains(DISABLED)) {
                    date = new Date(parseInt(collection[i].id, 0));
                    break;
                }
            }
        }
        return date;
    }
    protected lastDay(date: Date, view: number): Date {
        let lastDate: Date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        if (view !== 2) {
            let timeOffset: number = Math.abs(lastDate.getTimezoneOffset() - this.firstDay(date).getTimezoneOffset());
            if (timeOffset) {
                lastDate.setHours(this.firstDay(date).getHours() + (timeOffset / 60));
            }
            return this.findLastDay(lastDate);
        } else {
            return this.findLastDay(this.firstDay(lastDate));
        }
    };
    protected checkDateValue(value: Date): Date {
        return (!isNullOrUndefined(value) && value instanceof Date && !isNaN(+value)) ? value : null;
    }
    protected findLastDay(date: Date): Date {
        let collection: Element[] = <NodeListOf<HTMLTableDataCellElement> & Element[]>
            this.tableBodyElement.querySelectorAll('td' + ':not(.' + OTHERMONTH + '');
        if (collection.length) {
            for (let i: number = collection.length - 1; i >= 0; i--) {
                if (!collection[i].classList.contains(DISABLED)) {
                    date = new Date(parseInt(collection[i].id, 0));
                    break;
                }
            }
        }
        return date;
    }
    protected removeTableHeadElement(): void {
        if (this.getModuleName() === 'calendar') {
            if (!isNullOrUndefined(this.element.querySelectorAll('.e-content table thead')[0])) {
                detach(this.tableHeadElement);
            }
        } else {
            if (!isNullOrUndefined(this.calendarElement.querySelectorAll('.e-content table thead')[0])) {
                detach(this.tableHeadElement);
            }
        }

    }
    protected renderTemplate(elements: HTMLElement[], count: number, classNm: string, e?: Event, value?: Date): void {
        let view: number = this.getViewNumber(this.currentView());
        let trEle: HTMLElement;
        this.tableBodyElement = this.createElement('tbody');
        this.table.appendChild(this.tableBodyElement);
        removeClass([this.contentElement, this.headerElement], [MONTH, DECADE, YEAR]);
        addClass([this.contentElement, this.headerElement], [classNm]);
        let weekNumCell: number = 41;
        let numberCell: number = 35;
        let otherMonthCell: number = 6;
        let row: number = count;
        let rowIterator: number = 0;
        for (let dayCell: number = 0; dayCell < elements.length / count; ++dayCell) {
            trEle = this.createElement('tr', { attrs: { 'role': 'row' } });
            for (rowIterator = 0 + rowIterator; rowIterator < row; rowIterator++) {
                if (!elements[rowIterator].classList.contains('e-week-number') && !isNullOrUndefined(elements[rowIterator].children[0])) {
                    addClass([elements[rowIterator].children[0]], [LINK]);
                    rippleEffect(<HTMLElement>elements[rowIterator].children[0], {
                        duration: 600,
                        isCenterRipple: true
                    });
                }
                trEle.appendChild(elements[rowIterator]);
                if (this.weekNumber && rowIterator === otherMonthCell + 1 && elements[otherMonthCell + 1].classList.contains(OTHERMONTH)) {
                    addClass([trEle], OTHERMONTHROW);
                }
                if (!this.weekNumber && rowIterator === otherMonthCell && elements[otherMonthCell].classList.contains(OTHERMONTH)) {
                    addClass([trEle], OTHERMONTHROW);
                }
                if (this.weekNumber) {
                    if (rowIterator === weekNumCell && elements[weekNumCell].classList.contains(OTHERMONTH)) {
                        addClass([trEle], OTHERMONTHROW);
                    }
                } else {
                    if (rowIterator === numberCell && elements[numberCell].classList.contains(OTHERMONTH)) {
                        addClass([trEle], OTHERMONTHROW);
                    }
                }
            }
            row = row + count;
            rowIterator = rowIterator + 0;
            this.tableBodyElement.appendChild(trEle);
        }
        this.table.querySelector('tbody').className = this.effect;
        this.iconHandler();

        if (view !== this.getViewNumber(this.currentView()) || (view === 0 && view !== this.getViewNumber(this.currentView()))) {
            this.navigateHandler(e);
        }
        this.setAriaActiveDescendant();
    }
    protected clickHandler(e: MouseEvent, value: Date): void {
        this.clickEventEmitter(e);
        let eve: Element = <HTMLElement>e.currentTarget;
        let view: number = this.getViewNumber(this.currentView());
        if (eve.classList.contains(OTHERMONTH)) {
            this.contentClick(e, 0, null, value);
        } else if (view === this.getViewNumber(this.depth) && this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
            this.contentClick(e, 1, null, value);
        } else if (2 === view) {
            this.contentClick(e, 1, null, value);
        } else if (!eve.classList.contains(OTHERMONTH) && view === 0) {
            this.selectDate(e, this.getIdValue(e, null), null);
        } else {
            this.contentClick(e, 0, eve, value);
        }
        if (this.getModuleName() === 'calendar') {
            this.table.focus();
        }

    }
    // Content click event handler required for extended components
    protected clickEventEmitter(e: MouseEvent): void {
        e.preventDefault();
    }
    protected contentClick(e?: MouseEvent, view?: number, element?: Element, value?: Date): void {
        let currentView: number = this.getViewNumber(this.currentView());
        let d: Date = this.getIdValue(e, element);
        switch (view) {
            case 0:
                if (currentView === this.getViewNumber(this.depth) && this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                    detach(this.tableBodyElement);
                    this.currentDate = d;
                    this.effect = ZOOMIN;
                    this.renderMonths(e);
                } else {
                    this.currentDate.setMonth(d.getMonth());
                    if (d.getMonth() > 0 && this.currentDate.getMonth() !== d.getMonth()) {
                        this.currentDate.setDate(0);
                    }
                    this.currentDate.setFullYear(d.getFullYear());
                    this.effect = ZOOMIN;
                    detach(this.tableBodyElement);
                    this.renderMonths(e);
                }
                break;
            case 1:
                if (currentView === this.getViewNumber(this.depth) && this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                    this.selectDate(e, d, null);
                } else {
                    this.currentDate.setFullYear(d.getFullYear());
                    this.effect = ZOOMIN;
                    detach(this.tableBodyElement);
                    this.renderYears(e);
                }
        }
    }
    protected switchView(view: number, e?: Event, multiSelection?: boolean): void {
        switch (view) {
            case 0:
                detach(this.tableBodyElement);
                this.renderMonths(e);
                if (multiSelection && !isNullOrUndefined(this.tableBodyElement.querySelectorAll('.' + FOCUSEDDATE)[0])) {
                    this.tableBodyElement.querySelectorAll('.' + FOCUSEDDATE)[0].classList.remove(FOCUSEDDATE);
                }
                break;
            case 1:
                detach(this.tableBodyElement);
                this.renderYears(e);
                break;
            case 2:
                detach(this.tableBodyElement);
                this.renderDecades(e);
        }
    }
    /**
     * To get component name  
     * @private
     */
    protected getModuleName(): string {
        return 'calendar';
    }
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['value'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    public onPropertyChanged(newProp: CalendarBaseModel, oldProp: CalendarBaseModel, multiSelection?: boolean, values?: Date[]): void {
        this.effect = '';
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        if (this.getModuleName() === 'calendar') {
                            this.element.classList.add('e-rtl');
                        } else {
                            this.calendarElement.classList.add('e-rtl');
                        }
                    } else {
                        if (this.getModuleName() === 'calendar') {
                            this.element.classList.remove('e-rtl');
                        } else {
                            this.calendarElement.classList.remove('e-rtl');
                        }
                    }
                    break;
                case 'min':
                case 'max':
                    prop === 'min' ? this.setProperties({ min: this.checkDateValue(new Date('' + newProp.min)) }, true) :
                        this.setProperties({ max: this.checkDateValue(new Date('' + newProp.max)) }, true);
                    this.setProperties({ start: this.currentView() }, true);
                    detach(this.tableBodyElement);
                    this.minMaxUpdate();
                    if (multiSelection) {
                        this.validateValues(multiSelection, values);
                    }
                    this.createContentBody();
                    if ((this.todayDate < this.min || this.max < this.todayDate) && (this.footer) && (this.todayElement)) {
                        detach(this.todayElement);
                        detach(this.footer);
                        this.todayElement = this.footer = null;
                        this.createContentFooter();
                    } else {
                        if (this.todayElement.classList.contains('e-disabled') && (this.footer) && (this.todayElement)) {
                            removeClass([this.todayElement], DISABLED);
                            detach(this.todayElement);
                            detach(this.footer);
                            this.todayElement = this.footer = null;
                            this.createContentFooter();
                        }
                    }
                    break;
                case 'start':
                case 'weekNumber':
                case 'firstDayOfWeek':
                    this.createContentHeader();
                    this.createContentBody();
                    break;

                case 'locale':
                    this.globalize = new Internationalization(this.locale);
                    this.createContentHeader();
                    this.createContentBody();
                    this.l10.setLocale(this.locale);
                    this.updateFooter();
                    break;
                case 'showTodayButton':
                    if (newProp.showTodayButton) {
                        this.createContentFooter();
                    } else {
                        detach(this.todayElement);
                        detach(this.footer);
                        this.todayElement = this.footer = undefined;
                    }
                    this.setProperties({ showTodayButton: newProp.showTodayButton }, true);
                    break;
            }
        }
    }
    /**
     * values property updated with considered disabled dates of the calendar.
     */
    protected validateValues(multiSelection?: boolean, values?: Date[]): void {
        if (multiSelection && !isNullOrUndefined(values) && values.length > 0) {
            let copyValues: Date[] = this.copyValues(values);
            for (let skipIndex: number = 0; skipIndex < copyValues.length; skipIndex++) {
                let tempValue: Date = copyValues[skipIndex];
                let tempValueString: string = this.globalize.formatDate(tempValue, { type: 'date', skeleton: 'yMd' });
                let minString: string = this.globalize.formatDate(this.min, { type: 'date', skeleton: 'yMd' });
                let maxString: string = this.globalize.formatDate(this.max, { type: 'date', skeleton: 'yMd' });
                if (+new Date(tempValueString) < +new Date(minString) || +new Date(tempValueString) > +new Date(maxString)) {
                    copyValues.splice(skipIndex, 1);
                    skipIndex = -1;
                }
            }
            this.setProperties({ values: copyValues }, true);
        }
    }
    protected setValueUpdate(): void {
        detach(this.tableBodyElement);
        this.setProperties({ start: this.currentView() }, true);
        this.createContentBody();
    }
    protected copyValues(values: Date[]): Date[] {
        let copyValues: Date[] = [];
        if (!isNullOrUndefined(values) && values.length > 0) {
            for (let index: number = 0; index < values.length; index++) {
                copyValues.push(new Date(+values[index]));
            }
        }
        return copyValues;
    }
    protected titleUpdate(date: Date, view: string): void {
        let globalize: Internationalization = new Internationalization(this.locale);
        switch (view) {
            case 'days':
                this.headerTitleElement.textContent = globalize.formatDate(date, { type: 'dateTime', skeleton: 'yMMMM' });
                break;
            case 'months':
                this.headerTitleElement.textContent = globalize.formatDate(date, { type: 'dateTime', skeleton: 'y' });
        }
    }
    protected setActiveDescendant(): string {
        let id: string;
        let focusedEle: Element = this.tableBodyElement.querySelector('tr td.e-focused-date');
        let selectedEle: Element = this.tableBodyElement.querySelector('tr td.e-selected');
        let title: string = this.globalize.formatDate(this.currentDate, { type: 'date', skeleton: 'full' });
        if (selectedEle || focusedEle) {
            (focusedEle || selectedEle).setAttribute('aria-selected', 'true');
            (focusedEle || selectedEle).setAttribute('aria-label', 'The current focused date is ' + '' + title);
            id = (focusedEle || selectedEle).getAttribute('id');

        }
        return id;
    }
    protected iconHandler(): void {
        new Date('' + this.currentDate).setDate(1);
        switch (this.currentView()) {
            case 'Month':
                this.previousIconHandler(this.compareMonth(new Date('' + this.currentDate), this.min) < 1);
                this.nextIconHandler(this.compareMonth(new Date('' + this.currentDate), this.max) > -1);
                break;
            case 'Year':
                this.previousIconHandler(this.compareYear(new Date('' + this.currentDate), this.min) < 1);
                this.nextIconHandler(this.compareYear(new Date('' + this.currentDate), this.max) > -1);
                break;
            case 'Decade':
                this.previousIconHandler(this.compareDecade(new Date('' + this.currentDate), this.min) < 1);
                this.nextIconHandler(this.compareDecade(new Date('' + this.currentDate), this.max) > -1);
        }
    }
    /**
     * Destroys the widget.
     * @returns void
     */
    public destroy(): void {
        if (this.getModuleName() === 'calendar') {
            removeClass([this.element], [ROOT]);
        } else {
            if (this.calendarElement) {
                removeClass([this.element], [ROOT]);
            }
        }
        if (this.getModuleName() === 'calendar') {
            EventHandler.remove(this.headerTitleElement, 'click', this.navigateTitle);
            if (this.todayElement) {
                EventHandler.remove(this.todayElement, 'click', this.todayButtonClick);
            }
            this.previousIconHandler(true);
            this.nextIconHandler(true);
            this.keyboardModule.destroy();
            this.element.removeAttribute('data-role');
        }
        this.element.innerHTML = '';
        super.destroy();
    }
    protected title(e?: Event): void {
        let currentView: number = this.getViewNumber(this.currentView());
        this.effect = ZOOMIN;
        this.switchView(++currentView, e);
    }
    protected getViewNumber(stringVal: string): number {
        if (stringVal === 'Month') {
            return 0;
        } else if (stringVal === 'Year') {
            return 1;
        } else {
            return 2;
        }
    }
    protected navigateTitle(e?: Event): void {
        e.preventDefault();
        this.title(e);
        if (this.getModuleName() === 'calendar') {
            this.table.focus();
        }
    }
    protected previous(): void {
        this.effect = '';
        let currentView: number = this.getViewNumber(this.currentView());
        switch (this.currentView()) {
            case 'Month':
                this.addMonths(this.currentDate, -1);
                this.switchView(currentView);
                break;
            case 'Year':
                this.addYears(this.currentDate, -1);
                this.switchView(currentView);
                break;
            case 'Decade':
                this.addYears(this.currentDate, -10);
                this.switchView(currentView);
                break;
        }
    }
    protected navigatePrevious(e: MouseEvent | KeyboardEvent): void {
        e.preventDefault();
        this.previous();
        this.triggerNavigate(e);
        if (this.getModuleName() === 'calendar') {
            this.table.focus();
        }
    }
    protected next(): void {
        this.effect = '';
        let currentView: number = this.getViewNumber(this.currentView());
        switch (this.currentView()) {
            case 'Month':
                this.addMonths(this.currentDate, 1);
                this.switchView(currentView);
                break;
            case 'Year':
                this.addYears(this.currentDate, 1);
                this.switchView(currentView);
                break;
            case 'Decade':
                this.addYears(this.currentDate, 10);
                this.switchView(currentView);
                break;
        }
    }
    protected navigateNext(eve: MouseEvent | KeyboardEvent): void {
        eve.preventDefault();
        this.next();
        this.triggerNavigate(eve);
        if (this.getModuleName() === 'calendar') {
            this.table.focus();
        }
    }
    /**
     * This method is used to navigate to the month/year/decade view of the Calendar.
     * @param  {string} view - Specifies the view of the Calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     */
    public navigateTo(view: CalendarView, date: Date): void {
        if (+date >= +this.min && +date <= +this.max) {
            this.currentDate = date;
        }
        if (+date <= +this.min) {
            this.currentDate = new Date('' + this.min);
        }
        if (+date >= +this.max) {
            this.currentDate = new Date('' + this.max);
        }
        if (this.getModuleName() === 'daterangepicker') {
            this.currentDate = date;
        }
        if ((this.getViewNumber(this.depth) >= this.getViewNumber(view))) {
            if ((this.getViewNumber(this.depth) <= this.getViewNumber(this.start))
                || this.getViewNumber(this.depth) === this.getViewNumber(view)) {
                view = this.depth;
            }
        }
        this.switchView(this.getViewNumber(view));
    }
    /** 
     * Gets the current view of the Calendar.
     * @returns string 
     */
    public currentView(): string {
        if (this.contentElement.classList.contains(YEAR)) {
            return 'Year';
        } else if (this.contentElement.classList.contains(DECADE)) {
            return 'Decade';
        } else {
            return 'Month';
        }
    }
    protected getDateVal(date: Date, value: Date): boolean {
        return (!isNullOrUndefined(value) && date.getDate() === (value).getDate()
            && date.getMonth() === (value).getMonth() && date.getFullYear() === (value).getFullYear());
    }
    protected getCultureObjects(ld: Object, c: string): Object {
        return getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.days.format.short', ld);
    };
    protected getWeek(d: Date): number {
        let currentDate: number = new Date('' + d).valueOf();
        let date: number = new Date(d.getFullYear(), 0, 1).valueOf();
        let a: number = (currentDate - date);
        return Math.ceil((((a) / dayMilliSeconds) + new Date(date).getDay() + 1) / 7);
    }
    protected setStartDate(date: Date, time: number): void {
        let tzOffset: number = date.getTimezoneOffset();
        let d: Date = new Date(date.getTime() + time);
        let tzOffsetDiff: number = d.getTimezoneOffset() - tzOffset;
        date.setTime(d.getTime() + tzOffsetDiff * minutesMilliSeconds);
    }
    protected addMonths(date: Date, i: number): void {
        let day: number = date.getDate();
        date.setDate(1);
        date.setMonth(date.getMonth() + i);
        date.setDate(Math.min(day, this.getMaxDays(date)));
    }
    protected addYears(date: Date, i: number): void {
        let day: number = date.getDate();
        date.setDate(1);
        date.setFullYear(date.getFullYear() + i);
        date.setDate(Math.min(day, this.getMaxDays(date)));
    }
    protected getIdValue(e: MouseEvent | TouchEvent | KeyboardEvent, element: Element): Date {
        let eve: Element;
        if (e) {
            eve = <Element>e.currentTarget;
        } else {
            eve = element;
        }
        let dateFormatOptions: object = { type: 'dateTime', skeleton: 'full' };
        let dateString: string = this.globalize.formatDate(new Date(parseInt('' + eve.getAttribute('id'), 0)), dateFormatOptions);
        let date: Date = this.globalize.parseDate(dateString, dateFormatOptions);
        let value: number = date.valueOf() - date.valueOf() % 1000;
        return new Date(value);
        //return this.globalize.parseDate(dateString, dateFormatOptions);
    }
    protected selectDate(e: MouseEvent | KeyboardEventArgs, date: Date, node: Element, multiSelection?: boolean, values?: Date[]): void {
        let element: Element = node || <Element>e.currentTarget;
        if (this.currentView() === 'Decade') {
            this.setDateDecade(this.currentDate, date.getFullYear());
        } else if (this.currentView() === 'Year') {
            this.setDateYear(this.currentDate, date);
        } else {
            if (multiSelection && !this.checkPresentDate(date, values)) {
                let copyValues: Date[] = this.copyValues(values);
                if (!isNullOrUndefined(values) && copyValues.length > 0) {
                    copyValues.push(new Date('' + date));
                    this.setProperties({ values: copyValues }, true);
                    this.setProperties({ value: values[values.length - 1] }, true);
                } else {
                    this.setProperties({ values: [new Date('' + date)] }, true);
                }
            } else {
                this.setProperties({ value: new Date('' + date) }, true);
            }
            this.currentDate = new Date('' + date);
        }
        let tableBodyElement: Element = closest(element, '.' + ROOT);
        if (isNullOrUndefined(tableBodyElement)) {
            tableBodyElement = this.tableBodyElement;
        }
        if (!multiSelection && !isNullOrUndefined(tableBodyElement.querySelector('.' + SELECTED))) {
            removeClass([tableBodyElement.querySelector('.' + SELECTED)], SELECTED);
        }
        if (!multiSelection && !isNullOrUndefined(tableBodyElement.querySelector('.' + FOCUSEDDATE))) {
            removeClass([tableBodyElement.querySelector('.' + FOCUSEDDATE)], FOCUSEDDATE);
        }
        if (multiSelection) {
            let copyValues: Date[] = this.copyValues(values);
            let collection: Element[] = Array.prototype.slice.call(this.tableBodyElement.querySelectorAll('td'));
            for (let index: number = 0; index < collection.length; index++) {
                let tempElement: Element = tableBodyElement.querySelectorAll('td' + '.' + FOCUSEDDATE)[0];
                let selectedElement: Element = tableBodyElement.querySelectorAll('td' + '.' + SELECTED)[0];
                if (collection[index] === tempElement) {
                    removeClass([collection[index]], FOCUSEDDATE);
                }
                if (collection[index] === selectedElement &&
                    !this.checkPresentDate(new Date(parseInt(selectedElement.getAttribute('id').split('_')[0], 10)), values)) {
                    removeClass([collection[index]], SELECTED);
                }
            }
            if (element.classList.contains(SELECTED)) {
                removeClass([element], SELECTED);
                for (let i: number = 0; i < copyValues.length; i++) {
                    let localDateString: string = this.globalize.formatDate(date, { type: 'date', skeleton: 'short' });
                    let tempDateString: string = this.globalize.formatDate(copyValues[i], { type: 'date', skeleton: 'short' });
                    if (localDateString === tempDateString) {
                        let index: number = copyValues.indexOf(copyValues[i]);
                        copyValues.splice(index, 1);
                        addClass([element], FOCUSEDDATE);
                    }
                }
                this.setProperties({ values: copyValues }, true);
            } else {
                addClass([element], SELECTED);
            }
        } else {
            addClass([element], SELECTED);
        }
    }

    protected checkPresentDate(dates: Date, values: Date[]): boolean {
        let previousValue: boolean = false;
        if (!isNullOrUndefined(values)) {
            for (let checkPrevious: number = 0; checkPrevious < values.length; checkPrevious++) {
                let localDateString: string = this.globalize.formatDate(dates, { type: 'date', skeleton: 'short' });
                let tempDateString: string = this.globalize.formatDate(values[checkPrevious], { type: 'date', skeleton: 'short' });
                if (localDateString === tempDateString) {
                    previousValue = true;
                }
            }
        }
        return previousValue;
    }

    protected setAriaActiveDescendant(): void {
        attributes(this.table, {
            'aria-activedescendant': '' + this.setActiveDescendant()
        });
    }
    protected previousIconHandler(disabled: boolean): void {
        if (disabled) {
            EventHandler.remove(this.previousIcon, 'click', this.navigatePreviousHandler);
            addClass([this.previousIcon], '' + DISABLED);
            addClass([this.previousIcon], '' + OVERLAY);
            this.previousIcon.setAttribute('aria-disabled', 'true');
        } else {
            EventHandler.add(this.previousIcon, 'click', this.navigatePreviousHandler);
            removeClass([this.previousIcon], '' + DISABLED);
            removeClass([this.previousIcon], '' + OVERLAY);
            this.previousIcon.setAttribute('aria-disabled', 'false');
        }
    }
    protected renderDayCellEvent(args: RenderDayCellEventArgs): void {
        extend(this.renderDayCellArgs, { name: 'renderDayCell' });
        this.trigger('renderDayCell', args);
    }
    protected navigatedEvent(eve: MouseEvent | KeyboardEvent): void {
        extend(this.navigatedArgs, { name: 'navigated', event: eve });
        this.trigger('navigated', this.navigatedArgs);
    }
    protected triggerNavigate(event: MouseEvent | KeyboardEvent): void {
        this.navigatedArgs = { view: this.currentView(), date: this.currentDate };
        this.navigatedEvent(event);
    }

    protected nextIconHandler(disabled: boolean): void {
        if (disabled) {
            EventHandler.remove(this.nextIcon, 'click', this.navigateNextHandler);
            addClass([this.nextIcon], DISABLED);
            addClass([this.nextIcon], OVERLAY);
            this.nextIcon.setAttribute('aria-disabled', 'true');
        } else {
            EventHandler.add(this.nextIcon, 'click', this.navigateNextHandler);
            removeClass([this.nextIcon], DISABLED);
            removeClass([this.nextIcon], OVERLAY);
            this.nextIcon.setAttribute('aria-disabled', 'false');
        }
    }
    protected compare(startDate: Date, endDate: Date, modifier: number): number {
        let start: number = endDate.getFullYear();
        let end: number;
        let result: number;
        end = start;
        result = 0;
        if (modifier) {
            start = start - start % modifier;
            end = start - start % modifier + modifier - 1;
        }
        if (startDate.getFullYear() > end) {
            result = 1;
        } else if (startDate.getFullYear() < start) {
            result = -1;
        }
        return result;
    }
    protected isMinMaxRange(date: Date): boolean {
        return +date >= +this.min && +date <= +this.max;
    }

    protected isMonthYearRange(date: Date): boolean {
        return date.getMonth() >= this.min.getMonth()
            && date.getFullYear() >= this.min.getFullYear()
            && date.getMonth() <= this.max.getMonth()
            && date.getFullYear() <= this.max.getFullYear();
    }

    protected compareYear(start: Date, end: Date): number {
        return this.compare(start, end, 0);
    }
    protected compareDecade(start: Date, end: Date): number {
        return this.compare(start, end, 10);
    }
    protected shiftArray(array: string[], i: number): string[] {
        return array.slice(i).concat(array.slice(0, i));
    }
    protected addDay(date: Date, i: number, e: KeyboardEvent, max: Date, min: Date): void {
        let column: number = i;
        let value: Date = new Date(+date);
        if (!isNullOrUndefined(this.tableBodyElement) && !isNullOrUndefined(e)) {
            while (this.findNextTD(new Date(+date), column, max, min)) {
                column += i;
            }
            let rangeValue: Date = new Date(value.setDate(value.getDate() + column));
            column = (+rangeValue > +max || +rangeValue < +min) ? column === i ? i - i : i : column;
        }
        date.setDate(date.getDate() + column);
    }
    protected findNextTD(date: Date, column: number, max: Date, min: Date): boolean {
        let value: Date = new Date(date.setDate(date.getDate() + column));
        let collection: Element[] = [];
        let isDisabled: boolean = false;
        if ((!isNullOrUndefined(value) && value.getMonth()) === (!isNullOrUndefined(this.currentDate) && this.currentDate.getMonth())) {
            let tdEles: Element[] = this.renderDays(value, null);
            collection = tdEles.filter((element: Element) => {
                return element.classList.contains(DISABLED);
            });
        } else {
            collection = <NodeListOf<HTMLTableDataCellElement> & Element[]>this.tableBodyElement.querySelectorAll('td.' + DISABLED);
        }
        if (+value <= (+(max)) && +value >= (+(min))) {
            if (collection.length) {
                for (let i: number = 0; i < collection.length; i++) {
                    isDisabled = (+value === +new Date(parseInt(collection[i].id, 0))) ? true : false;
                    if (isDisabled) { break; }
                }
            }
        }
        return isDisabled;
    }
    protected getMaxDays(d: Date): number {
        let date: number;
        let month: number;
        let tmpDate: Date = new Date('' + d);
        date = 28;
        month = tmpDate.getMonth();
        while (tmpDate.getMonth() === month) {
            ++date;
            tmpDate.setDate(date);
        }
        return date - 1;
    }
    protected setDateDecade(date: Date, year: number): void {
        date.setFullYear(year);
        this.setProperties({ value: new Date('' + date) }, true);
    };
    protected setDateYear(date: Date, value: Date): void {
        date.setFullYear(value.getFullYear(), value.getMonth(), date.getDate());
        if (value.getMonth() !== date.getMonth()) {
            date.setDate(0);
        }
        this.setProperties({ value: new Date('' + date) }, true);
        this.currentDate = new Date('' + value);
    }
    protected compareMonth(start: Date, end: Date): number {
        let result: number;
        if (start.getFullYear() > end.getFullYear()) {
            result = 1;
        } else if (start.getFullYear() < end.getFullYear()) {
            result = -1;
        } else {
            result = start.getMonth() === end.getMonth() ? 0 : start.getMonth() > end.getMonth() ? 1 : -1;
        }
        return result;
    }
}

/**
 * Represents the Calendar component that allows the user to select a date.
 * ```html
 * <div id="calendar"/>
 * ```
 * ```typescript
 * <script>
 *   var calendarObj = new Calendar({ value: new Date() });
 *   calendarObj.appendTo("#calendar");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class Calendar extends CalendarBase {
    protected changedArgs: ChangedEventArgs;
    protected changeHandler: Function;

    /**
     * Gets or sets the selected date of the Calendar.
     * @default null
     */
    @Property(null)
    public value: Date;

    /**
     * Gets or sets multiple selected dates of the calendar.
     * @default null
     */
    @Property(null)
    public values: Date[];

    /**
     * Specifies the option to enable the multiple dates selection of the calendar.
     * @default false
     */
    @Property(false)
    public isMultiSelection: boolean;

    /**
     * Triggers when the Calendar value is changed.
     * @event  
     */
    @Event()
    public change: EmitType<ChangedEventArgs>;
    /**
     * Initialized new instance of Calendar Class.
     * Constructor for creating the widget
     * @param  {CalendarModel} options?
     * @param  {string|HTMLElement} element?
     */
    constructor(options?: CalendarModel, element?: string | HTMLElement) {
        super(options, element);
    }
    /**
     * To Initialize the control rendering.
     * @returns void
     * @private
     */
    protected render(): void {
        if (this.isMultiSelection && typeof this.values === 'object' && !isNullOrUndefined(this.values) && this.values.length > 0) {
            let tempValues: number[] = [];
            let copyValues: Date[] = [];
            for (let limit: number = 0; limit < this.values.length; limit++) {
                if (tempValues.indexOf(+this.values[limit]) === -1) {
                    tempValues.push(+this.values[limit]);
                    copyValues.push(this.values[limit]);
                }
            }
            this.setProperties({ values: copyValues }, true);
            for (let index: number = 0; index < this.values.length; index++) {
                if (!this.checkDateValue(this.values[index])) {
                    if (typeof (this.values[index]) === 'string' && this.checkDateValue(new Date('' + this.values[index]))) {
                        let copyDate: Date = new Date('' + this.values[index]);
                        this.values.splice(index, 1);
                        this.values.splice(index, 0, copyDate);
                    } else {
                        this.values.splice(index, 1);
                    }
                }
            }
            this.setProperties({ value: this.values[this.values.length - 1] }, true);
            this.previousValues = this.values.length;
        }
        this.validateDate();
        this.minMaxUpdate();
        super.render();
        if (this.getModuleName() === 'calendar') {
            let form: Element = closest(this.element, 'form');
            if (form) {
                EventHandler.add(form, 'reset', this.formResetHandler.bind(this));
            }
        }
    }
    protected formResetHandler(): void {
        this.value = null;
    }
    protected validateDate(): void {
        if (typeof this.value === 'string') {
            this.setProperties({ value: this.checkDateValue(new Date('' + this.value)) }, true); // persist the value property.
        }
        super.validateDate(this.value);
        if (!isNullOrUndefined(this.value) && this.min <= this.max && this.value >= this.min && this.value <= this.max) {
            this.currentDate = new Date('' + this.value);
        }
        if (isNaN(+this.value)) {
            this.setProperties({ value: null }, true);
        }
    }
    protected minMaxUpdate(): void {
        if (this.getModuleName() === 'calendar') {
            if (!isNullOrUndefined(this.value) && this.value <= this.min && this.min <= this.max) {
                this.setProperties({ value: this.min }, true);
                this.changedArgs = { value: this.value };
            } else {
                if (!isNullOrUndefined(this.value) && this.value >= this.max && this.min <= this.max) {
                    this.setProperties({ value: this.max }, true);
                    this.changedArgs = { value: this.value };
                }
            }
        }
        if (this.getModuleName() !== 'calendar' && !isNullOrUndefined(this.value)) {
            if (!isNullOrUndefined(this.value) && this.value < this.min && this.min <= this.max) {
                super.minMaxUpdate(this.min);
            } else {
                if (!isNullOrUndefined(this.value) && this.value > this.max && this.min <= this.max) {
                    super.minMaxUpdate(this.max);
                }
            }
        } else {
            super.minMaxUpdate(this.value);
        }
    }

    protected todayButtonClick(): void {
        if (this.showTodayButton) {
            let tempValue: Date = new Date();
            if (this.value) {
                tempValue.setHours(this.value.getHours());
                tempValue.setMinutes(this.value.getMinutes());
                tempValue.setSeconds(this.value.getSeconds());
                tempValue.setMilliseconds(this.value.getMilliseconds());
            } else {
                tempValue = new Date(tempValue.getFullYear(), tempValue.getMonth(), tempValue.getDate(), 0, 0, 0, 0);
            }
            this.setProperties({ value: tempValue }, true);
            if (this.isMultiSelection) {
                let copyValues: Date[] = this.copyValues(this.values);
                if (!super.checkPresentDate(tempValue, this.values)) {
                    copyValues.push(tempValue);
                    this.setProperties({ values: copyValues });
                }
            }
            super.todayButtonClick(new Date(+this.value));
        }
    }
    protected keyActionHandle(e: KeyboardEventArgs): void {
        super.keyActionHandle(e, this.value, this.isMultiSelection);
    }
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void {
        this.changeHandler = (e: MouseEvent): void => {
            this.triggerChange(e);
        };
        super.preRender(this.value);
    };

    public createContent(): void {
        this.previousDate = this.value;
        super.createContent();
    }
    protected minMaxDate(localDate: Date): Date {
        return super.minMaxDate(localDate);
    }
    protected renderMonths(e?: Event): void {
        super.renderMonths(e, this.value);
    }
    protected renderDays(currentDate: Date, e?: Event): HTMLElement[] {
        let tempDays: HTMLElement[] = super.renderDays(currentDate, e, this.value, this.isMultiSelection, this.values);
        if (this.isMultiSelection) {
            super.validateValues(this.isMultiSelection, this.values);
        }
        return tempDays;
    }
    protected renderYears(e?: Event): void {
        super.renderYears(e, this.value);
    }
    protected renderDecades(e?: Event): void {
        super.renderDecades(e, this.value);
    }
    protected renderTemplate(elements: HTMLElement[], count: number, classNm: string, e?: Event): void {
        super.renderTemplate(elements, count, classNm, e, this.value);
        this.changedArgs = { value: this.value, values: this.values };
        this.changeHandler();
    }
    protected clickHandler(e: MouseEvent): void {
        let eve: Element = <HTMLElement>e.currentTarget;
        if (eve.classList.contains(OTHERMONTH)) {
            if (this.isMultiSelection) {
                let copyValues: Date[] = this.copyValues(this.values);
                copyValues.push(this.getIdValue(e, null));
                this.setProperties({ values: copyValues }, true);
                this.setProperties({ value: this.values[this.values.length - 1] }, true);
            } else {
                this.setProperties({ value: this.getIdValue(e, null) }, true);
            }
        }
        let storeView: string = this.currentView();
        super.clickHandler(e, this.value);
        if (this.isMultiSelection && this.currentDate !== this.value &&
            !isNullOrUndefined(this.tableBodyElement.querySelectorAll('.' + FOCUSEDDATE)[0]) && storeView === 'Year') {
            this.tableBodyElement.querySelectorAll('.' + FOCUSEDDATE)[0].classList.remove(FOCUSEDDATE);
        }
    }

    protected switchView(view: number, e?: Event): void {
        super.switchView(view, e, this.isMultiSelection);
    }
    /**
     * To get component name  
     * @private
     */
    protected getModuleName(): string {
        super.getModuleName();
        return 'calendar';
    }
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     */
    public getPersistData(): string {
        super.getPersistData();
        let keyEntity: string[] = ['value', 'values'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    public onPropertyChanged(newProp: CalendarModel, oldProp: CalendarModel): void {
        this.effect = '';
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'value':
                    if (typeof newProp.value === 'string') {
                        this.setProperties({ value: new Date('' + newProp.value) }, true);
                    } else {
                        newProp.value = new Date('' + newProp.value);
                    }
                    if (isNaN(+this.value)) {
                        this.setProperties({ value: oldProp.value }, true);
                    }
                    this.update();
                    break;
                case 'values':
                    if (typeof newProp.values === 'string' || typeof newProp.values === 'number') {
                        this.setProperties({ values: null }, true);
                    } else {
                        let copyValues: Date[] = this.copyValues(this.values);
                        for (let index: number = 0; index < copyValues.length; index++) {
                            let tempDate: Date = copyValues[index];
                            if (this.checkDateValue(tempDate) && !super.checkPresentDate(tempDate, copyValues)) {
                                copyValues.push(tempDate);
                            }
                        }
                        this.setProperties({ values: copyValues }, true);
                        if (this.values.length > 0) {
                            this.setProperties({ value: newProp.values[newProp.values.length - 1] }, true);
                        }
                    }
                    this.validateValues(this.isMultiSelection, this.values);
                    this.update();
                    break;
                case 'isMultiSelection':
                    this.setProperties({ isMultiSelection: newProp.isMultiSelection }, true);
                    this.update();
                    break;
                default:
                    super.onPropertyChanged(newProp, oldProp, this.isMultiSelection, this.values);
            }
        }
    }

    /**
     * Destroys the widget.
     * @returns void
     */
    public destroy(): void {
        super.destroy();
        if (this.getModuleName() === 'calendar') {
            let form: Element = closest(this.element, 'form');
            if (form) {
                EventHandler.remove(form, 'reset', this.formResetHandler.bind(this));
            }
        }
    }
    /**
     * This method is used to navigate to the month/year/decade view of the Calendar.
     * @param  {string} view - Specifies the view of the Calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     */
    public navigateTo(view: CalendarView, date: Date): void {
        this.minMaxUpdate();
        super.navigateTo(view, date);
    }
    /** 
     * Gets the current view of the Calendar.
     * @returns string 
     */
    public currentView(): string {
        return super.currentView();
    }
    /**
     * This method is used to add the single or multiple dates to the values property of the Calendar.
     * @param  {Date || Date[]} dates - Specifies the date or dates to be added to the values property of the Calendar.
     * @returns void
     */
    public addDate(dates: Date | Date[]): void {
        if (typeof dates !== 'string' && typeof dates !== 'number') {
            let copyValues: Date[] = this.copyValues(this.values);
            if (typeof dates === 'object' && (<Date[]>(dates)).length > 0) {
                let tempDates: Date[] = <Date[]>dates;
                for (let i: number = 0; i < tempDates.length; i++) {
                    if (this.checkDateValue(tempDates[i]) && !super.checkPresentDate(tempDates[i], copyValues)) {
                        if (!isNullOrUndefined(copyValues) && copyValues.length > 0) {
                            copyValues.push(tempDates[i]);
                        } else {
                            copyValues = [new Date(+tempDates[i])];
                        }
                    }
                }
            } else {
                if (this.checkDateValue(<Date>dates) && !super.checkPresentDate(<Date>dates, copyValues)) {
                    if (!isNullOrUndefined(copyValues) && copyValues.length > 0) {
                        copyValues.push(<Date>(dates));
                    } else {
                        copyValues = [new Date(+dates)];
                    }
                }
            }
            this.setProperties({ values: copyValues }, true);
            if (this.isMultiSelection) {
                this.setProperties({ value: this.values[this.values.length - 1] }, true);
            }
            this.validateValues(this.isMultiSelection, copyValues);
            this.update();
            this.changedArgs = { value: this.value, values: this.values };
            this.changeHandler();
        }
    }
    /**
     * This method is used to remove the single or multiple dates from the values property of the Calendar.
     * @param  {Date || Date[]} dates - Specifies the date or dates which need to be removed from the values property of the Calendar.
     * @returns void
     */
    public removeDate(dates: Date | Date[]): void {
        if (typeof dates !== 'string' && typeof dates !== 'number' && !isNullOrUndefined(this.values) && this.values.length > 0) {
            let copyValues: Date[] = this.copyValues(this.values);
            if (typeof dates === 'object' && ((<Date[]>(dates)).length > 0)) {
                let tempDates: Date[] = <Date[]>dates;
                for (let index: number = 0; index < tempDates.length; index++) {
                    for (let i: number = 0; i < copyValues.length; i++) {
                        if (+copyValues[i] === +tempDates[index]) {
                            copyValues.splice(i, 1);
                        }
                    }
                }
            } else {
                for (let i: number = 0; i < copyValues.length; i++) {
                    if (+copyValues[i] === +dates) {
                        copyValues.splice(i, 1);
                    }
                }
            }
            this.setProperties({ values: copyValues }, false);
            this.update();
            if (this.isMultiSelection) {
                this.setProperties({ value: this.values[this.values.length - 1] }, true);
            }
            this.changedArgs = { value: this.value, values: this.values };
            this.changeHandler();
        }
    }

    protected update(): void {
        this.validateDate();
        this.minMaxUpdate();
        super.setValueUpdate();
    }
    protected selectDate(e: MouseEvent | KeyboardEventArgs, date: Date, element: Element): void {
        super.selectDate(e, date, element, this.isMultiSelection, this.values);
        if (this.isMultiSelection && !isNullOrUndefined(this.values) && this.values.length > 0) {
            this.setProperties({ value: this.values[this.values.length - 1] }, true);
        }
        this.changedArgs = { value: this.value, values: this.values };
        this.changeHandler(e);
    }


    protected changeEvent(e: Event): void {
        this.trigger('change', this.changedArgs);
        this.previousDate = new Date(+this.value);
    }

    protected triggerChange(e: MouseEvent | KeyboardEvent): void {
        this.changedArgs.event = e || null;
        this.changedArgs.isInteracted = !isNullOrUndefined(e);
        if (!isNullOrUndefined(this.value)) {
            this.setProperties({ value: this.value }, true);
        }
        if (!this.isMultiSelection && +this.value !== Number.NaN && +this.value !== +this.previousDate) {
            this.changeEvent(e);
        } else if (!isNullOrUndefined(this.values) && this.previousValues !== this.values.length) {
            this.changeEvent(e);
            this.previousValues = this.values.length;
        }

    }

}

export interface NavigatedEventArgs extends BaseEventArgs {
    /** Defines the current view of the Calendar. */
    view?: string;
    /** Defines the focused date in a view. */
    date?: Date;
    /**
     * Specifies the original event arguments.
     */
    event?: KeyboardEvent | MouseEvent | Event;

}

export interface RenderDayCellEventArgs extends BaseEventArgs {
    /** Specifies whether to disable the current date or not. */
    isDisabled?: boolean;
    /** Specifies the day cell element. */
    element?: HTMLElement;
    /** Defines the current date of the Calendar. */
    date?: Date;
    /** Defines whether the current date is out of range (less than min or greater than max) or not. */
    isOutOfRange?: boolean;
}
export interface ChangedEventArgs extends BaseEventArgs {
    /** Defines the selected date of the Calendar. */
    value?: Date;

    /** Defines the multiple selected date of the Calendar. */
    values?: Date[];

    /**
     * Specifies the original event arguments.
     */
    event?: KeyboardEvent | MouseEvent | Event;

    /** Defines the element. */
    element?: HTMLElement | HTMLInputElement;

    /** 
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted?: boolean;
}

