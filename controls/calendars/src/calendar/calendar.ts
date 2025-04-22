/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, EventHandler, Internationalization, ModuleDeclaration } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, KeyboardEvents, L10n, SwipeEventArgs } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, KeyboardEventArgs, BaseEventArgs } from '@syncfusion/ej2-base';
import { cldrData, getDefaultDateObject, rippleEffect } from '@syncfusion/ej2-base';
import { removeClass, detach, closest, addClass, attributes } from '@syncfusion/ej2-base';
import { getValue, getUniqueID, extend, Browser } from '@syncfusion/ej2-base';
import { Property, Event, EmitType, isNullOrUndefined, throwError } from '@syncfusion/ej2-base';
import { CalendarModel, CalendarBaseModel } from './calendar-model';
import { Islamic, IslamicDateArgs } from './index';


/**
 * Specifies the view of the calendar.
 */
export type CalendarView = 'Month' | 'Year' | 'Decade';

export type CalendarType = 'Islamic' | 'Gregorian';

export type DayHeaderFormats = 'Short' | 'Narrow' | 'Abbreviated' | 'Wide';


/**
 * Specifies the rule for defining the first week of the year.
 */
export type WeekRule = 'FirstDay' | 'FirstFullWeek' | 'FirstFourDayWeek';

//class constant defination.
const OTHERMONTH: string = 'e-other-month';
const OTHERDECADE: string = 'e-other-year';
const ROOT: string = 'e-calendar';
const DEVICE: string = 'e-device';
const HEADER: string = 'e-header';
const RTL: string = 'e-rtl';
const CONTENT: string = 'e-content';
const CONTENTTABLE: string = 'e-calendar-content-table';
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
const FOCUSEDCELL: string = 'e-focused-cell';
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
const DAYHEADERLONG: string = 'e-calendar-day-header-lg';
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
    private calendarEleCopy: HTMLElement;
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
    public islamicModule: Islamic;
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
    protected nextIconClicked: boolean;
    protected previousIconClicked: boolean;
    protected tabIndex: string;
    protected todayDate: Date;
    protected islamicPreviousHeader: string;
    protected calendarElement: HTMLElement;
    protected isPopupClicked: boolean = false;
    protected isDateSelected: boolean = true;
    private serverModuleName: string;
    protected timezone: string;
    protected defaultKeyConfigs: { [key: string]: string };
    protected previousDateTime: Date;
    protected isTodayClicked: boolean = false;
    protected todayButtonEvent: MouseEvent | KeyboardEvent;
    protected preventChange: boolean = false;
    protected previousDates: boolean = false;
    /**
     * Gets or sets the minimum date that can be selected in the Calendar.
     *
     * @default new Date(1900, 00, 01)
     * @deprecated
     */
    @Property(new Date(1900, 0, 1))
    public min: Date;
    /**
     * Specifies the component to be disabled or not.
     *
     * @default true
     */
    @Property(true)
    public enabled: boolean;
    /**
     * Specifies the root CSS class of the Calendar that allows to
     * customize the appearance by overriding the styles.
     *
     * @default null
     */
    @Property(null)
    public cssClass: string;
    /**
     * Gets or sets the maximum date that can be selected in the Calendar.
     *
     * @default new Date(2099, 11, 31)
     * @deprecated
     */
    @Property(new Date(2099, 11, 31))
    public max: Date;
    /**
     * Gets or sets the Calendar's first day of the week. By default, the first day of the week will be based on the current culture.
     *
     * @default 0
     * @aspType int
     * @deprecated
     * > For more details about firstDayOfWeek refer to
     * [`First day of week`](../../calendar/how-to/first-day-of-week#change-the-first-day-of-the-week) documentation.
     */
    @Property(null)
    public firstDayOfWeek: number;
    /**
     * Gets or sets the Calendar's Type like gregorian or islamic.
     *
     * @default Gregorian
     * @deprecated
     */
    @Property('Gregorian')
    public calendarMode: CalendarType;
    /**
     * Specifies the initial view of the Calendar when it is opened.
     * With the help of this property, initial view can be changed to year or decade view.
     *
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
    @Property('Month')
    public start: CalendarView;
    /**
     * Sets the maximum level of view such as month, year, and decade in the Calendar.
     * Depth view should be smaller than the start view to restrict its view navigation.
     *
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
    @Property('Month')
    public depth: CalendarView;
    /**
     * Determines whether the week number of the year is to be displayed in the calendar or not.
     *
     * @default false
     * @deprecated
     * > For more details about weekNumber refer to
     * [`Calendar with week number`](../../calendar/how-to/render-the-calendar-with-week-numbers)documentation.
     */
    @Property(false)
    public weekNumber: boolean;
    /**
     * Specifies the rule for defining the first week of the year.
     *
     * @default FirstDay
     */
    @Property('FirstDay')
    public weekRule: WeekRule;
    /**
     * Specifies whether the today button is to be displayed or not.
     *
     * @default true
     * @deprecated
     */
    @Property(true)
    public showTodayButton: boolean;
    /**
     * Specifies the format of the day that to be displayed in header. By default, the format is ‘short’.
     * Possible formats are:
     * * `Short` - Sets the short format of day name (like Su ) in day header.
     * * `Narrow` - Sets the single character of day name (like S ) in day header.
     * * `Abbreviated` - Sets the min format of day name (like Sun ) in day header.
     * * `Wide` - Sets the long format of day name (like Sunday ) in day header.
     *
     * @default Short
     * @deprecated
     */
    @Property('Short')
    public dayHeaderFormat: DayHeaderFormats;
    /**
     * Enable or disable persisting component's state between page reloads. If enabled, following list of states will be persisted.
     * 1. value
     *
     * @default false
     * @deprecated
     */
    @Property(false)
    public enablePersistence: boolean;
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
     *
     * @default null
     * @deprecated
     */
    @Property(null)
    public keyConfigs: { [key: string]: string };
    /**
     * By default, the date value will be processed based on system time zone.
     * If you want to process the initial date value using server time zone
     * then specify the time zone value to `serverTimezoneOffset` property.
     *
     * @default null
     * @deprecated
     */
    @Property(null)
    public serverTimezoneOffset: number;
    /**
     * Triggers when Calendar is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * Triggers when Calendar is destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers when the Calendar is navigated to another level or within the same level of view.
     *
     * @event navigated
     */
    @Event()
    public navigated: EmitType<NavigatedEventArgs>;
    /**
     * Triggers when each day cell of the Calendar is rendered.
     *
     * @event renderDayCell
     */
    @Event()
    public renderDayCell: EmitType<RenderDayCellEventArgs>;
    /**
     * Initialized new instance of Calendar Class.
     * Constructor for creating the widget
     *
     * @param {CalendarBaseModel} options - Specifies the CalendarBase model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: CalendarBaseModel, element?: string | HTMLElement) {
        super(options, element);
    }
    /**
     * To Initialize the control rendering.
     *
     * @returns {void}
     * @private
     */
    protected render(): void {
        this.rangeValidation(this.min, this.max);
        this.calendarEleCopy = <HTMLElement>this.element.cloneNode(true);
        if (this.calendarMode === 'Islamic') {
            if (+(this.min.setSeconds(0)) === +new Date(1900, 0, 1, 0, 0, 0)) {
                this.min = new Date(1944, 2, 18);
            }
            if (+this.max === +new Date(2099, 11, 31)) {
                this.max = new Date(2069, 10, 16);
            }
        }
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
            this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
            this.element.setAttribute('tabindex', this.tabIndex);
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
                'data-role': 'calendar'
            });
        }
        if (!isNullOrUndefined(closest(this.element, 'fieldset') as HTMLFieldSetElement) && (closest(this.element, 'fieldset') as HTMLFieldSetElement).disabled) {
            this.enabled = false;
        }
        this.createHeader();
        this.createContent();
        this.wireEvents();
    }

    protected rangeValidation(min: Date, max: Date): void {
        if (isNullOrUndefined(min)) {
            this.setProperties({ min: new Date(1900, 0, 1) }, true);
        }
        if (isNullOrUndefined(max)) {
            this.setProperties({ max: new Date(2099, 11, 31) }, true);
        }
    }

    protected getDefaultKeyConfig(): { [key: string]: string } {
        this.defaultKeyConfigs = {
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
        return this.defaultKeyConfigs;
    }

    protected validateDate(value?: Date): void {
        this.setProperties({ min: this.checkDateValue(new Date(this.checkValue(this.min))) }, true);
        this.setProperties({ max: this.checkDateValue(new Date(this.checkValue(this.max))) }, true);
        this.currentDate = this.currentDate ? this.currentDate : new Date(new Date().setHours(0, 0, 0, 0));
        if (!isNullOrUndefined(value) && this.min <= this.max && value >= this.min && value <= this.max) {
            this.currentDate = new Date(this.checkValue(value));
        }
    }

    protected setOverlayIndex(popupWrapper: HTMLElement, popupElement: HTMLElement, modal: HTMLElement, isDevice: boolean): void {
        if (isDevice && !isNullOrUndefined(popupElement) && !isNullOrUndefined(modal) && !isNullOrUndefined(popupWrapper)) {
            const index: number = parseInt(popupElement.style.zIndex, 10) ? parseInt(popupElement.style.zIndex, 10) : 1000;
            modal.style.zIndex = (index - 1).toString();
            popupWrapper.style.zIndex = index.toString();
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
            this.currentDate = new Date(this.checkValue(value));
        } else {
            if (+this.min <= +this.max && !value && +this.currentDate > +this.max) {
                this.currentDate = new Date(this.checkValue(this.max));
            } else {
                if (+this.currentDate < +this.min) {
                    this.currentDate = new Date(this.checkValue(this.min));
                }
            }
        }
    }



    protected createHeader(): void {
        const ariaPrevAttrs: Object = {
            'aria-disabled': 'false',
            'aria-label': 'previous month'
        };
        const ariaNextAttrs: Object = {
            'aria-disabled': 'false',
            'aria-label': 'next month'

        };
        const ariaTitleAttrs: Object = {
            'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'title'
        };
        const tabIndexAttr: Object = {'tabindex': '0'};
        this.headerElement = this.createElement('div', { className: HEADER });
        const iconContainer: HTMLElement = this.createElement('div', { className: ICONCONTAINER });
        this.previousIcon = this.createElement('button', { className: '' + PREVICON, attrs: { type: 'button' } });
        rippleEffect(this.previousIcon, {
            duration: 400,
            selector: '.e-prev',
            isCenterRipple: true
        });
        attributes(this.previousIcon, <{ [key: string]: string }>ariaPrevAttrs);
        attributes(this.previousIcon, <{ [key: string]: string }>tabIndexAttr);
        this.nextIcon = this.createElement('button', { className: '' + NEXTICON, attrs: { type: 'button' } });
        rippleEffect(this.nextIcon, {
            selector: '.e-next',
            duration: 400,
            isCenterRipple: true
        });
        if (this.getModuleName() === 'daterangepicker') {
            attributes(this.previousIcon, {tabIndex: '-1'});
            attributes(this.nextIcon, {tabIndex: '-1'});
        }
        attributes(this.nextIcon, <{ [key: string]: string }>ariaNextAttrs);
        attributes(this.nextIcon, <{ [key: string]: string }>tabIndexAttr);
        this.headerTitleElement = this.createElement('div', { className: '' + LINK + ' ' + TITLE });
        attributes(this.headerTitleElement, <{ [key: string]: string }>ariaTitleAttrs);
        attributes(this.headerTitleElement, <{ [key: string]: string }>tabIndexAttr);
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
        this.adjustLongHeaderSize();
    }
    protected createContent(): void {
        this.contentElement = this.createElement('div', { className: CONTENT });
        this.table = this.createElement('table', { attrs: { 'class': CONTENTTABLE, 'tabIndex': '0', 'role': 'grid', 'aria-activedescendant': '', 'aria-labelledby': this.element.id } });
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
        if (this.getModuleName() !== 'daterangepicker') {
            EventHandler.add(this.table, 'focus', this.addContentFocus, this);
            EventHandler.add(this.table, 'blur', this.removeContentFocus, this);
        }
    }
    private addContentFocus(args: any): void {
        const focusedDate: Element = this.tableBodyElement.querySelector('tr td.e-focused-date');
        const selectedDate: Element = this.tableBodyElement.querySelector('tr td.e-selected');
        if (!isNullOrUndefined(selectedDate)) {
            selectedDate.classList.add(FOCUSEDCELL);
        }
        else if (!isNullOrUndefined(focusedDate)) {
            focusedDate.classList.add(FOCUSEDCELL);
        }
    }
    private removeContentFocus(args: any): void {
        const focusedDate: Element = !isNullOrUndefined(this.tableBodyElement) ? this.tableBodyElement.querySelector('tr td.e-focused-date') : null;
        const selectedDate: Element = !isNullOrUndefined(this.tableBodyElement) ? this.tableBodyElement.querySelector('tr td.e-selected') : null;
        if (!isNullOrUndefined(selectedDate)) {
            selectedDate.classList.remove(FOCUSEDCELL);
        }
        else if (!isNullOrUndefined(focusedDate)) {
            focusedDate.classList.remove(FOCUSEDCELL);
        }
    }
    protected getCultureValues(): string[] {
        const culShortNames: string[] = [];
        let cldrObj: string[];
        const dayFormat: string = !isNullOrUndefined(this.dayHeaderFormat) ? 'days.stand-alone.' + this.dayHeaderFormat.toLowerCase() : null;
        if ((this.locale === 'en' || this.locale === 'en-US') && !isNullOrUndefined(dayFormat)) {
            cldrObj = <string[]>(getValue(dayFormat, getDefaultDateObject()));
        } else {
            cldrObj = <string[]>(this.getCultureObjects(cldrData, '' + this.locale));
        }
        if (!isNullOrUndefined(cldrObj)) {
            for (const obj of Object.keys(cldrObj)) {
                culShortNames.push(getValue(obj, cldrObj));
            }
        }
        return culShortNames;
    }
    protected toCapitalize(text: string): string {
        return !isNullOrUndefined(text) && text.length ? text[0].toUpperCase() + text.slice(1) : text;
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
        const daysCount: number = 6;
        let html: string = '';
        if (this.firstDayOfWeek > 6 || this.firstDayOfWeek < 0) {
            this.setProperties({ firstDayOfWeek: 0 }, true);
        }
        this.tableHeadElement = this.createElement('thead', { className: WEEKHEADER });
        if (this.weekNumber) {
            html += '<th class="e-week-number" aria-hidden="true"></th>';
            if (this.getModuleName() === 'calendar') {
                addClass([this.element], '' + WEEKNUMBER);
            } else {
                addClass([this.calendarElement], '' + WEEKNUMBER);
            }
        }
        const shortNames: string[] = this.getCultureValues().length > 0 &&
            this.getCultureValues() ? this.shiftArray(((this.getCultureValues().length > 0 &&
                this.getCultureValues())), this.firstDayOfWeek) : null;
        if (!isNullOrUndefined(shortNames)) {
            for (let days: number = 0; days <= daysCount; days++) {
                html += '<th  class="">' + this.toCapitalize(shortNames[days as number]) + '</th>';
            }
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
        this.todayElement.setAttribute('aria-label', this.l10.getConstant('today'));
        this.todayElement.setAttribute('tabindex', '0');
    }
    protected createContentFooter(): void {
        if (this.showTodayButton) {
            const minimum: Date = new Date(+this.min);
            const maximum: Date = new Date(+this.max);
            const l10nLocale: object = { today: 'Today' };
            this.globalize = new Internationalization(this.locale);
            this.l10 = new L10n(this.getModuleName(), l10nLocale, this.locale);
            this.todayElement = this.createElement('button', { attrs: { role: 'button' } });
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
    protected wireEvents(id?: string, ref?: object, keyConfig?: { [key: string]: string }, moduleName?: string): void {
        EventHandler.add(this.headerTitleElement, 'click', this.navigateTitle, this);
        this.defaultKeyConfigs = (extend(this.defaultKeyConfigs, this.keyConfigs) as { [key: string]: string });
        if (this.getModuleName() === 'calendar') {
            this.keyboardModule = new KeyboardEvents(
                <HTMLElement>this.element,
                {
                    eventName: 'keydown',
                    keyAction: this.keyActionHandle.bind(this),
                    keyConfigs: this.defaultKeyConfigs
                });
        } else {
            this.keyboardModule = new KeyboardEvents(
                <HTMLElement>this.calendarElement,
                {
                    eventName: 'keydown',
                    keyAction: this.keyActionHandle.bind(this),
                    keyConfigs: this.defaultKeyConfigs
                });
        }
    }
    protected dateWireEvents(id?: string, ref?: object, keyConfig?: { [key: string]: string }, moduleName?: string): void {
        this.defaultKeyConfigs = this.getDefaultKeyConfig();
        this.defaultKeyConfigs = (extend(this.defaultKeyConfigs, keyConfig) as { [key: string]: string });
        this.serverModuleName = moduleName;
    }
    protected todayButtonClick(e?: MouseEvent | KeyboardEvent, value?: Date, isCustomDate?: boolean): void {
        if (this.showTodayButton) {
            if (this.currentView() === this.depth) {
                this.effect = '';
            } else {
                this.effect = 'e-zoomin';
            }
            if (this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                this.navigateTo(this.depth, new Date(this.checkValue(value)), isCustomDate);
            } else {
                this.navigateTo('Month', new Date(this.checkValue(value)), isCustomDate);
            }
        }
    }
    protected resetCalendar(): void {
        this.calendarElement && detach(this.calendarElement);
        this.tableBodyElement && detach(this.tableBodyElement);
        this.table && detach(this.table);
        this.tableHeadElement && detach(this.tableHeadElement);
        this.nextIcon && detach(this.nextIcon);
        this.previousIcon && detach(this.previousIcon);
        this.footer && detach(this.footer);
        this.todayElement = null;
        this.renderDayCellArgs = null;
        this.calendarElement = this.tableBodyElement = this.footer = this.tableHeadElement =
         this.nextIcon = this.previousIcon = this.table = null;
    }
    protected keyActionHandle(e: KeyboardEventArgs, value?: Date, multiSelection?: boolean): void {
        if (this.calendarElement === null && e.action === 'escape') {
            return;
        }
        const focusedDate: Element = this.tableBodyElement.querySelector('tr td.e-focused-date');
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
        let view: number = this.getViewNumber(this.currentView());
        const depthValue: number = this.getViewNumber(this.depth);
        const levelRestrict: boolean = (view === depthValue && this.getViewNumber(this.start) >= depthValue);
        this.effect = '';
        switch (e.action) {
        case 'moveLeft':
            if (this.getModuleName() !== 'daterangepicker' && !isNullOrUndefined((e.target as any))) {
                this.keyboardNavigate(-1, view, e, this.max, this.min);
                e.preventDefault();
            }
            break;
        case 'moveRight':
            if (this.getModuleName() !== 'daterangepicker' && !isNullOrUndefined((e.target as any))) {
                this.keyboardNavigate(1, view, e, this.max, this.min);
                e.preventDefault();
            }
            break;
        case 'moveUp':
            if (this.getModuleName() !== 'daterangepicker' && !isNullOrUndefined((e.target as any))) {
                if (view === 0) {
                    this.keyboardNavigate(-7, view, e, this.max, this.min); // move the current date to the previous seven days.
                } else {
                    this.keyboardNavigate(-4, view, e, this.max, this.min); // move the current year to the previous four days.
                }
                e.preventDefault();
            }
            break;
        case 'moveDown':
            if (this.getModuleName() !== 'daterangepicker' && !isNullOrUndefined((e.target as any))) {
                if (view === 0) {
                    this.keyboardNavigate(7, view, e, this.max, this.min);
                } else {
                    this.keyboardNavigate(4, view, e, this.max, this.min);
                }
                e.preventDefault();
            }
            break;
        case 'select':
            if (e.target === this.headerTitleElement){
                this.navigateTitle(e);
            }
            else if (e.target === this.previousIcon && !(e.target as HTMLElement).className.includes(DISABLED)) {
                this.navigatePrevious(e);
            }
            else if (e.target === this.nextIcon && !(e.target as HTMLElement).className.includes(DISABLED)) {
                this.navigateNext(e);
            }
            else if (e.target === this.todayElement && !(e.target as HTMLElement).className.includes(DISABLED)) {
                this.todayButtonClick(e, value);
                if (this.getModuleName() === 'datepicker' || this.getModuleName() === 'datetimepicker') {
                    if ((this as any).isAngular) {
                        (this as any).inputElement.focus();
                    } else {
                        (this as any).element.focus();
                    }
                }
            } else {
                const element: Element = !isNullOrUndefined(focusedDate) ? focusedDate : selectedDate;
                if (!isNullOrUndefined(element) && !element.classList.contains(DISABLED)) {
                    if (levelRestrict) {
                        // eslint-disable-next-line radix
                        const d: Date = new Date(parseInt('' + (element).id, 0));
                        this.selectDate(e, d, (element));
                        if (this.getModuleName() === 'datepicker' || this.getModuleName() === 'datetimepicker') {
                            if ((this as any).isAngular) {
                                (this as any).inputElement.focus();
                            } else {
                                (this as any).element.focus();
                            }
                        }
                    } else {
                        if ( !(e.target as HTMLElement).className.includes(DISABLED)){
                            this.contentClick(null, --view, (element), value);
                        }
                    }
                }
            }
            break;
        case 'controlUp':
            this.title();
            e.preventDefault();
            break;
        case 'controlDown':
            if (!isNullOrUndefined(focusedDate) && !levelRestrict || !isNullOrUndefined(selectedDate) && !levelRestrict) {
                this.contentClick(null, --view, (focusedDate || selectedDate), value);
            }
            e.preventDefault();
            break;
        case 'home':
            this.currentDate = this.firstDay(this.currentDate);
            detach(this.tableBodyElement);
            if (view === 0) {
                this.renderMonths(e);
            } else if (view === 1) {
                this.renderYears(e);
            } else {
                this.renderDecades(e);
            }
            e.preventDefault();
            break;
        case 'end':
            this.currentDate = this.lastDay(this.currentDate, view);
            detach(this.tableBodyElement);
            if (view === 0) {
                this.renderMonths(e);
            } else if (view === 1) {
                this.renderYears(e);
            } else {
                this.renderDecades(e);
            }
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
        case 'tab':
            if ((this.getModuleName() === 'datepicker' || this.getModuleName() === 'datetimepicker') && e.target === this.todayElement) {
                e.preventDefault();
                if ((this as any).isAngular) {
                    (this as any).inputElement.focus();
                } else {
                    (this as any).element.focus();
                }
                (this as any).hide();
            }
            break;
        case 'shiftTab':
            if ((this.getModuleName() === 'datepicker' || this.getModuleName() === 'datetimepicker') && e.target === this.headerTitleElement) {
                e.preventDefault();
                if ((this as any).isAngular) {
                    (this as any).inputElement.focus();
                } else {
                    (this as any).element.focus();
                }
                (this as any).hide();
            }
            break;
        case 'escape':
            if ((this.getModuleName() === 'datepicker' || this.getModuleName() === 'datetimepicker') && (e.target === this.headerTitleElement || e.target === this.previousIcon || e.target === this.nextIcon || e.target === this.todayElement)) {
                (this as any).hide();
            }
            break;
        }
    }

    protected keyboardNavigate(number: number, currentView: number, e: KeyboardEvent, max: Date, min: Date): void {
        const date: Date = new Date(this.checkValue(this.currentDate));
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
            if (this.calendarMode === 'Gregorian') {
                if (this.isMonthYearRange(this.currentDate)) {
                    detach(this.tableBodyElement);
                    this.renderYears(e);
                } else {
                    this.currentDate = date;
                }
            } else {
                if (this.isMonthYearRange(this.currentDate)) {
                    detach(this.tableBodyElement);
                    this.renderYears(e);
                } else {
                    this.currentDate = date;
                }
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
     *
     * @param {Date} value - Specifies value of date.
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected preRender(value?: Date): void {
        this.navigatePreviousHandler = this.navigatePrevious.bind(this);
        this.navigateNextHandler = this.navigateNext.bind(this);
        this.defaultKeyConfigs = this.getDefaultKeyConfig();
        this.navigateHandler = (e: MouseEvent): void => {
            this.triggerNavigate(e);
        };
    }
    protected minMaxDate(localDate: Date): Date {
        const currentDate: Date = new Date(new Date(+localDate).setHours(0, 0, 0, 0));
        const minDate: Date = new Date(new Date(+this.min).setHours(0, 0, 0, 0));
        const maxDate: Date = new Date(new Date(+this.max).setHours(0, 0, 0, 0));
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
    protected renderMonths(e?: Event, value?: Date, isCustomDate?: boolean): void {
        const numCells: number = this.weekNumber ? 8 : 7;
        let tdEles: HTMLElement[];
        if (this.calendarMode === 'Gregorian') {
            tdEles = this.renderDays(this.currentDate, value, null, null, isCustomDate, e);
        } else {
            tdEles = !isNullOrUndefined(this.islamicModule) ? this.islamicModule.islamicRenderDays(this.currentDate, value) : null;
        }
        this.createContentHeader();
        if (this.calendarMode === 'Gregorian') {
            this.renderTemplate(tdEles, numCells, MONTH, e, value);
        } else if (!isNullOrUndefined(this.islamicModule)) {
            this.islamicModule.islamicRenderTemplate(tdEles, numCells, MONTH, e, value);
        }
    }
    protected renderDays(currentDate: Date, value?: Date, multiSelection?: boolean, values?:
    Date[], isTodayDate?: boolean, e?: Event): HTMLElement[] {
        const tdEles: HTMLElement[] = [];
        const cellsCount: number = 42;
        const todayDate: Date = isTodayDate ? new Date(+currentDate) : this.getDate(new Date(), this.timezone);
        let localDate: Date = new Date(this.checkValue(currentDate));
        let minMaxDate: Date;
        const currentMonth: number = localDate.getMonth();
        this.titleUpdate(currentDate, 'days');
        const d: Date = localDate;
        localDate = new Date(d.getFullYear(), d.getMonth(), 0, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
        while (localDate.getDay() !== this.firstDayOfWeek) {
            this.setStartDate(localDate, -1 * dayMilliSeconds);
        }
        for (let day: number = 0; day < cellsCount; ++day) {
            const weekEle: HTMLElement = this.createElement('td', { className: CELL });
            const weekAnchor: HTMLElement = this.createElement('span');
            if (day % 7 === 0 && this.weekNumber) {
                // 6 days are added to get Last day of the week and 3 days are added to get middle day of the week.
                const numberOfDays : number = this.weekRule === 'FirstDay' ? 6 : (this.weekRule === 'FirstFourDayWeek' ? 3 : 0);
                const finalDate : Date = new Date(localDate.getFullYear(), localDate.getMonth(), (localDate.getDate() + numberOfDays));
                weekAnchor.textContent = '' + this.getWeek(finalDate);
                weekEle.appendChild(weekAnchor);
                addClass([weekEle], '' + WEEKNUMBER);
                tdEles.push(weekEle);
            }
            minMaxDate = new Date(+localDate);
            localDate = this.minMaxDate(localDate);
            const dateFormatOptions: object = { type: 'dateTime', skeleton: 'full' };
            const date: Date = this.globalize.parseDate(this.globalize.formatDate(localDate, dateFormatOptions), dateFormatOptions);
            const tdEle: HTMLElement = this.dayCell(localDate);
            const title: string = this.globalize.formatDate(localDate, { type: 'date', skeleton: 'full' });
            const dayLink: HTMLElement = this.createElement('span');
            dayLink.textContent = this.globalize.formatDate(localDate, { format: 'd', type: 'date', skeleton: 'yMd'});
            const disabled: boolean = (this.min > localDate) || (this.max < localDate);
            if (disabled) {
                addClass([tdEle], DISABLED);
                addClass([tdEle], OVERLAY);
            } else {
                dayLink.setAttribute('title', '' + title);
            }
            if (currentMonth !== localDate.getMonth()) {
                addClass([tdEle], OTHERMONTH);
                dayLink.setAttribute('aria-disabled', 'true');
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
            const argument: RenderDayCellEventArgs = this.renderDayCellArgs;
            this.renderDayCellEvent(argument);
            if (argument.isDisabled) {
                const selectDate: Date = new Date(this.checkValue(value));
                const argsDate: Date = new Date(this.checkValue(argument.date));
                if (multiSelection) {
                    if (!isNullOrUndefined(values) && values.length > 0) {
                        for (let index: number = 0; index < values.length; index++) {
                            const localDateString: number =
                                +new Date(this.globalize.formatDate(argument.date, { type: 'date', skeleton: 'yMd' }));
                            const tempDateString: number =
                                +new Date(this.globalize.formatDate(values[index as number], { type: 'date', skeleton: 'yMd' }));
                            if (localDateString === tempDateString) {
                                values.splice(index, 1);
                                index = -1;
                            }
                        }
                    }
                } else if (selectDate && +selectDate === +argsDate) {
                    this.setProperties({ value: null }, true);
                }
            }
            if (this.renderDayCellArgs.isDisabled && !tdEle.classList.contains(SELECTED)) {
                addClass([tdEle], DISABLED);
                addClass([tdEle], OVERLAY);
                dayLink.setAttribute('aria-disabled', 'true');
                if (+this.renderDayCellArgs.date === +this.todayDate) {
                    this.todayDisabled = true;
                }
            }
            const otherMnthBool: boolean = tdEle.classList.contains(OTHERMONTH);
            const disabledCls: boolean = tdEle.classList.contains(DISABLED);
            if (!disabledCls) {
                EventHandler.add(tdEle, 'click', this.clickHandler, this);
            }
            // to set the value as null while setting the disabled date onProperty change.
            // if (args.isDisabled && +this.value === +args.date) {
            //     this.setProperties({ value: null }, true);
            // }
            let currentTarget: any;
            if ( !isNullOrUndefined(e) && e.type === 'click') {
                currentTarget = e.currentTarget; }
            if (multiSelection && !isNullOrUndefined(values) && !disabledCls) {
                for (let tempValue: number = 0; tempValue < values.length; tempValue++) {
                    const type: string = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
                    const formatOptions: object = { format: null, type: 'date', skeleton: 'short', calendar: type };
                    const localDateString: string = this.globalize.formatDate(localDate, formatOptions);
                    const tempDateString: string = this.globalize.formatDate(values[tempValue as number], formatOptions);
                    if ((localDateString === tempDateString && this.getDateVal(localDate, values[tempValue as number]))
                        || (this.getDateVal(localDate, value))) {
                        addClass([tdEle], SELECTED);
                    } if (!isNullOrUndefined(currentTarget) && currentTarget.innerText === tdEle.innerText &&
                     this.previousDates && tdEle.classList.contains(SELECTED) && currentTarget.classList.contains(SELECTED)) {
                        removeClass([tdEle], SELECTED);
                        this.previousDates = false;
                        const copyValues: Date[] = this.copyValues(values);
                        for (let i: number = 0; i < copyValues.length; i++) {
                            const type: string = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
                            const formatOptions: object = { format: null, type: 'date', skeleton: 'short', calendar: type };
                            const localDateString: string = this.globalize.formatDate(date, formatOptions);
                            const tempDateString: string = this.globalize.formatDate(copyValues[i as number], formatOptions);
                            if (localDateString === tempDateString) {
                                const index: number = copyValues.indexOf(copyValues[i as number]);
                                copyValues.splice(index, 1);
                                values.splice(index, 1);
                            }
                        }
                        this.setProperties({ values: copyValues }, true);
                    } else {
                        this.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
                    }
                }
                if (values.length <= 0) {
                    this.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
                }
            } else if (!disabledCls && this.getDateVal(localDate, value)) {
                addClass([tdEle], SELECTED);
            }
            this.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
            if (!isNullOrUndefined(date) && date.getFullYear() === todayDate.getFullYear() && date.getMonth() === todayDate.getMonth()
                && date.getDate() === todayDate.getDate()) {
                addClass([tdEle], TODAY);
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
            // eslint-disable-next-line radix
            if (currentDate >= this.max && parseInt(tableElement.id, 0) === +this.max && !otherMonth && !disabled) {
                addClass([tableElement], FOCUSEDDATE);
            }
            // eslint-disable-next-line radix
            if (currentDate <= this.min && parseInt(tableElement.id, 0) === +this.min && !otherMonth && !disabled) {
                addClass([tableElement], FOCUSEDDATE);
            }
        }
    }
    protected renderYears(e?: Event, value?: Date): void {
        this.removeTableHeadElement();
        const numCells: number = 4;
        const tdEles: HTMLElement[] = [];
        const valueUtil: boolean = isNullOrUndefined(value);
        const curDate: Date = new Date(this.checkValue(this.currentDate));
        const mon: number = curDate.getMonth();
        const yr: number = curDate.getFullYear();
        const localDate: Date = curDate;
        const curYrs: number = localDate.getFullYear();
        const minYr: number = new Date(this.checkValue(this.min)).getFullYear();
        const minMonth: number = new Date(this.checkValue(this.min)).getMonth();
        const maxYr: number = new Date(this.checkValue(this.max)).getFullYear();
        const maxMonth: number = new Date(this.checkValue(this.max)).getMonth();
        localDate.setMonth(0);
        this.titleUpdate(this.currentDate, 'months');
        localDate.setDate(1);
        for (let month: number = 0; month < 12; ++month) {
            const tdEle: HTMLElement = this.dayCell(localDate);
            const dayLink: HTMLElement = this.createElement('span');
            const localMonth: boolean = (value && (value).getMonth() === localDate.getMonth());
            const select: boolean = (value && (value).getFullYear() === yr && localMonth);
            const title: string = this.globalize.formatDate(localDate, { type: 'date', format: 'MMM y' });
            dayLink.textContent = this.toCapitalize(this.globalize.formatDate(localDate, {
                format: null, type: 'dateTime', skeleton: 'MMM'
            }));
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
                dayLink.setAttribute('title', '' + title);
            }
            tdEle.appendChild(dayLink);
            tdEles.push(tdEle);
        }
        this.renderTemplate(tdEles, numCells, YEAR, e, value);
    }
    protected renderDecades(e?: Event, value?: Date): void {
        this.removeTableHeadElement();
        const numCells: number = 4;
        const yearCell: number = 12;
        const tdEles: HTMLElement[] = [];
        const localDate: Date = new Date(this.checkValue(this.currentDate));
        localDate.setMonth(0);
        localDate.setDate(1);
        const localYr: number = localDate.getFullYear();
        const startYr: Date = new Date(localDate.setFullYear((localYr - localYr % 10)));
        const endYr: Date = new Date(localDate.setFullYear((localYr - localYr % 10 + (10 - 1))));
        const startFullYr: number = startYr.getFullYear();
        const endFullYr: number = endYr.getFullYear();
        const startHdrYr: string = this.globalize.formatDate(startYr, {
            format: null, type: 'dateTime', skeleton: 'y'
        });
        const endHdrYr: string = this.globalize.formatDate(endYr, { format: null, type: 'dateTime', skeleton: 'y' });
        this.headerTitleElement.textContent = startHdrYr + ' - ' + (endHdrYr);
        const start: Date = new Date(localYr - (localYr % 10) - 1, 0, 1);
        const startYear: number = start.getFullYear();
        for (let rowIterator: number = 0; rowIterator < yearCell; ++rowIterator) {
            const year: number = startYear + rowIterator;
            localDate.setFullYear(year);
            const tdEle: HTMLElement = this.dayCell(localDate);
            const dayLink: HTMLElement = this.createElement('span');
            dayLink.textContent = this.globalize.formatDate(localDate, {
                format: null, type: 'dateTime', skeleton: 'y'
            });
            if ((year < startFullYr) || (year > endFullYr)) {
                addClass([tdEle], OTHERDECADE);
                dayLink.setAttribute('aria-disabled', 'true');
                if (!isNullOrUndefined(value) && localDate.getFullYear() === (value).getFullYear()) {
                    addClass([tdEle], SELECTED);
                }
                if (year < new Date(this.checkValue(this.min)).getFullYear() ||
                    year > new Date(this.checkValue(this.max)).getFullYear()) {
                    addClass([tdEle], DISABLED);
                }
            } else if (year < new Date(this.checkValue(this.min)).getFullYear() ||
                year > new Date(this.checkValue(this.max)).getFullYear()) {
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
                dayLink.setAttribute('title', '' + dayLink.textContent);
            }
            tdEle.appendChild(dayLink);
            tdEles.push(tdEle);
        }
        this.renderTemplate(tdEles, numCells, 'e-decade', e, value);
    }
    protected dayCell(localDate: Date): HTMLElement {
        const type: string = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
        const dateFormatOptions: object = { skeleton: 'full', type: 'dateTime', calendar: type };
        const date: Date = this.globalize.parseDate(this.globalize.formatDate(localDate, dateFormatOptions), dateFormatOptions);
        let value: number ;
        if (!isNullOrUndefined(date)){
            value = date.valueOf();
        }
        const attrs: Object = {
            className: CELL, attrs: { 'id': '' + getUniqueID('' + value), 'aria-selected': 'false'}
        };
        return this.createElement('td', attrs);
    }
    protected firstDay(date: Date): Date {
        const collection: Element[] = this.currentView() !== 'Decade' ? <NodeListOf<HTMLTableDataCellElement> & Element[]>
            this.tableBodyElement.querySelectorAll('td:not(.' + OTHERMONTH + '):not(.' + WEEKNUMBER + ')') :
            <NodeListOf<HTMLTableDataCellElement> & Element[]>
            this.tableBodyElement.querySelectorAll('td' + ':not(.' + OTHERDECADE + '');
        if (collection.length) {
            for (let i: number = 0; i < collection.length; i++) {
                if (!collection[i as number].classList.contains(DISABLED)) {
                    // eslint-disable-next-line radix
                    date = new Date(parseInt(collection[i as number].id, 0));
                    break;
                }
            }
        }
        return date;
    }
    protected lastDay(date: Date, view: number): Date {
        const lastDate: Date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        if (view !== 2) {
            const timeOffset: number = Math.abs(lastDate.getTimezoneOffset() - this.firstDay(date).getTimezoneOffset());
            if (timeOffset) {
                lastDate.setHours(this.firstDay(date).getHours() + (timeOffset / 60));
            }
            return this.findLastDay(lastDate);
        } else {
            return this.findLastDay(this.firstDay(lastDate));
        }
    }
    protected checkDateValue(value: Date): Date {
        return (!isNullOrUndefined(value) && value instanceof Date && !isNaN(+value)) ? value : null;
    }
    protected findLastDay(date: Date): Date {
        const collection: Element[] = this.currentView() === 'Decade' ? <NodeListOf<HTMLTableDataCellElement> & Element[]>
            this.tableBodyElement.querySelectorAll('td' + ':not(.' + OTHERDECADE + '') :
            <NodeListOf<HTMLTableDataCellElement> & Element[]>
            this.tableBodyElement.querySelectorAll('td:not(.' + OTHERMONTH + '):not(.' + WEEKNUMBER + ')');
        if (collection.length) {
            for (let i: number = collection.length - 1; i >= 0; i--) {
                if (!collection[i as number].classList.contains(DISABLED)) {
                    // eslint-disable-next-line radix
                    date = new Date(parseInt(collection[i as number].id, 0));
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected renderTemplate(elements: HTMLElement[], count: number, classNm: string, e?: Event, value?: Date): void {
        const view: number = this.getViewNumber(this.currentView());
        let trEle: HTMLElement;
        this.tableBodyElement = this.createElement('tbody');
        this.table.appendChild(this.tableBodyElement);
        removeClass([this.contentElement, this.headerElement], [MONTH, DECADE, YEAR]);
        addClass([this.contentElement, this.headerElement], [classNm]);
        const weekNumCell: number = 41;
        const numberCell: number = 35;
        const otherMonthCell: number = 6;
        let row: number = count;
        let rowIterator: number = 0;
        for (let dayCell: number = 0; dayCell < elements.length / count; ++dayCell) {
            trEle = this.createElement('tr');
            for (rowIterator = 0 + rowIterator; rowIterator < row; rowIterator++) {
                if (!elements[rowIterator as number].classList.contains('e-week-number') && !isNullOrUndefined(elements[rowIterator as number].children[0])) {
                    addClass([elements[rowIterator as number].children[0]], [LINK]);
                    rippleEffect(<HTMLElement>elements[rowIterator as number].children[0], {
                        duration: 600,
                        isCenterRipple: true
                    });
                }
                trEle.appendChild(elements[rowIterator as number]);
                if (this.weekNumber && rowIterator === otherMonthCell + 1 && elements[otherMonthCell + 1].classList.contains(OTHERMONTH)) {
                    addClass([trEle], OTHERMONTHROW);
                }
                if (!this.weekNumber && rowIterator === otherMonthCell && elements[otherMonthCell as number].
                    classList.contains(OTHERMONTH)) {
                    addClass([trEle], OTHERMONTHROW);
                }
                if (this.weekNumber) {
                    if (rowIterator === weekNumCell && elements[weekNumCell as number].classList.contains(OTHERMONTH)) {
                        addClass([trEle], OTHERMONTHROW);
                    }
                } else {
                    if (rowIterator === numberCell && elements[numberCell as number].classList.contains(OTHERMONTH)) {
                        addClass([trEle], OTHERMONTHROW);
                    }
                }
            }
            row = row + count;
            rowIterator = rowIterator + 0;
            this.tableBodyElement.appendChild(trEle);
        }
        this.table.querySelector('tbody').className = this.effect;
        if (this.calendarMode === 'Gregorian') {
            this.iconHandler();
        } else {
            this.islamicModule.islamicIconHandler();
        }

        if (view !== this.getViewNumber(this.currentView()) || (view === 0 && view !== this.getViewNumber(this.currentView()))) {
            this.navigateHandler(e);
        }
        this.setAriaActiveDescendant();
    }
    protected clickHandler(e: MouseEvent, value: Date): void {
        this.clickEventEmitter(e);
        const eve: Element = <HTMLElement>e.currentTarget;
        const view: number = this.getViewNumber(this.currentView());
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected contentClick(e?: MouseEvent, view?: number, element?: Element, value?: Date): void {
        const currentView: number = this.getViewNumber(this.currentView());
        const d: Date = this.getIdValue(e, element);
        switch (view) {
        case 0:
            if (currentView === this.getViewNumber(this.depth) && this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                detach(this.tableBodyElement);
                this.currentDate = d;
                this.effect = ZOOMIN;
                this.renderMonths(e);
            } else {

                if (this.calendarMode === 'Gregorian') {
                    this.currentDate.setMonth(d.getMonth());
                    if (d.getMonth() > 0 && this.currentDate.getMonth() !== d.getMonth()) {
                        this.currentDate.setDate(0);
                    }
                    this.currentDate.setFullYear(d.getFullYear());
                } else {
                    this.currentDate = d;
                }

                this.effect = ZOOMIN;
                detach(this.tableBodyElement);
                this.renderMonths(e);
            }
            break;
        case 1:
            if (currentView === this.getViewNumber(this.depth) && this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                this.selectDate(e, d, null);
            } else {
                if (this.calendarMode === 'Gregorian') {
                    this.currentDate.setFullYear(d.getFullYear());
                } else {
                    this.islamicPreviousHeader = this.headerElement.textContent;
                    const islamicDate: IslamicDateArgs = this.islamicModule.getIslamicDate(d);
                    this.currentDate = this.islamicModule.toGregorian(islamicDate.year, islamicDate.month, 1);
                }
                this.effect = ZOOMIN;
                detach(this.tableBodyElement);
                this.renderYears(e);
            }
        }
    }
    protected switchView(view: number, e?: Event, multiSelection?: boolean, isCustomDate?: boolean): void {
        switch (view) {
        case 0:
            detach(this.tableBodyElement);
            this.renderMonths(e, null, isCustomDate);
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
     *
     * @returns {string} Returns the component name.
     * @private
     */
    protected getModuleName(): string {
        return 'calendar';
    }
    /**
     *
     * @returns {void}
     * @deprecated
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.calendarMode === 'Islamic') {
            modules.push({ args: [this], member: 'islamic', name: 'Islamic' });
        }

        return modules;
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Gets the properties to be maintained upon browser refresh.
     *
     * @returns {string}
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['value'];
        return this.addOnPersist(keyEntity);
    }
    /* eslint-enable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Called internally if any of the property value changed.
     *
     * @param {CalendarBaseModel} newProp - Returns the dynamic property value of the component.
     * @param {CalendarBaseModel} oldProp - Returns the previous property value of the component.
     * @param {boolean} multiSelection - - Specifies whether multiple date selection is enabled or not.
     * @param {Date[]} values - Specifies the dates.
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: CalendarBaseModel, oldProp: CalendarBaseModel, multiSelection?: boolean, values?: Date[]): void {
        this.effect = '';
        for (const prop of Object.keys(newProp)) {
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
            case 'dayHeaderFormat':
                this.getCultureValues();
                if (this.getModuleName() !== 'datepicker') {
                    this.createContentHeader();
                } else if (this.calendarElement) {
                    this.createContentHeader();
                }
                this.adjustLongHeaderSize();
                break;
            case 'min':
            case 'max':
                this.rangeValidation(this.min, this.max);
                if (prop === 'min') {
                    this.setProperties({ min: this.checkDateValue(new Date(this.checkValue(newProp.min))) }, true);
                } else {
                    this.setProperties({ max: this.checkDateValue(new Date(this.checkValue(newProp.max))) }, true);
                }
                this.setProperties({ start: this.currentView() }, true);
                if (this.tableBodyElement) {
                    detach(this.tableBodyElement);
                }
                this.minMaxUpdate();
                if (multiSelection) {
                    this.validateValues(multiSelection, values);
                }
                if (this.getModuleName() !== 'datepicker') {
                    this.createContentBody();
                } else if (this.calendarElement) {
                    this.createContentBody();
                }
                if ((this.todayDate < this.min || this.max < this.todayDate) && (this.footer) && (this.todayElement)) {
                    detach(this.todayElement);
                    detach(this.footer);
                    this.todayElement = this.footer = null;
                    this.createContentFooter();
                } else {
                    if ((this.footer) && (this.todayElement) && this.todayElement.classList.contains('e-disabled')) {
                        removeClass([this.todayElement], DISABLED);
                        detach(this.todayElement);
                        detach(this.footer);
                        this.todayElement = this.footer = null;
                        this.createContentFooter();
                    }
                }
                break;
            case 'start':
            case 'depth':
            case 'weekNumber':
            case 'firstDayOfWeek':
            case 'weekRule':
                this.checkView();
                if (this.getModuleName() !== 'datepicker') {
                    this.createContentHeader();
                    this.createContentBody();
                } else if (this.calendarElement) {
                    this.createContentHeader();
                    this.createContentBody();
                }
                break;

            case 'locale':
                this.globalize = new Internationalization(this.locale);
                if (this.getModuleName() !== 'datepicker') {
                    this.createContentHeader();
                    this.createContentBody();
                } else if (this.calendarElement) {
                    this.createContentHeader();
                    this.createContentBody();
                }
                if (this.getModuleName() === 'calendar') {
                    const l10nLocale: object = { today: 'Today' };
                    this.l10 = new L10n(this.getModuleName(), l10nLocale, this.locale);
                }
                this.l10.setLocale(this.locale);
                if (this.showTodayButton) {
                    this.updateFooter();
                }
                break;
            case 'showTodayButton':
                if (newProp.showTodayButton) {
                    this.createContentFooter();
                } else {
                    if (!isNullOrUndefined(this.todayElement) && !isNullOrUndefined(this.footer)) {
                        detach(this.todayElement);
                        detach(this.footer);
                        this.todayElement = this.footer = undefined;
                    }
                }
                this.setProperties({ showTodayButton: newProp.showTodayButton }, true);
                break;
            }
        }
    }
    /**
     * values property updated with considered disabled dates of the calendar.
     *
     * @param {boolean} multiSelection - Specifies whether multiple date selection is enabled.
     * @param {Date[]} values - Specifies the dates to validate.
     * @returns {void}
     */
    protected validateValues(multiSelection?: boolean, values?: Date[]): void {
        if (multiSelection && !isNullOrUndefined(values) && values.length > 0) {
            const copyValues: Date[] = this.copyValues(values);
            for (let skipIndex: number = 0; skipIndex < copyValues.length; skipIndex++) {
                const tempValue: Date = copyValues[skipIndex as number];
                const type: string = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
                let tempValueFormat: object;
                let tempValueString: string;
                let tempValueDate: object;
                if (this.calendarMode === 'Gregorian') {
                    tempValueFormat = { type: 'date', skeleton: 'yMd' };
                    tempValueString = this.globalize.formatDate(tempValue, tempValueFormat);
                    tempValueDate = this.globalize.parseDate(tempValueString, tempValueFormat);
                } else {
                    tempValueFormat = { type: 'date', skeleton: 'yMd', calendar: 'islamic' };
                    tempValueString = this.globalize.formatDate(tempValue, tempValueFormat);
                    tempValueDate = this.globalize.parseDate(tempValueString, tempValueFormat);
                }
                const minFormatOption: object = { type: 'date', skeleton: 'yMd', calendar: type };
                const minStringValue: string = this.globalize.formatDate(this.min, minFormatOption);
                const minString: string = minStringValue;
                const maxFormatOption: object = { type: 'date', skeleton: 'yMd', calendar: type };
                const maxStringValue: string = this.globalize.formatDate(this.max, maxFormatOption);
                const maxString: string = maxStringValue;
                const minDate: object = this.globalize.parseDate(minString, minFormatOption);
                const maxDate: object = this.globalize.parseDate(maxString, maxFormatOption);

                if (+tempValueDate < +minDate || +tempValueDate > +maxDate) {
                    copyValues.splice(skipIndex, 1);
                    skipIndex = -1;
                }
            }
            this.setProperties({ values: copyValues }, true);
        }
    }
    protected setValueUpdate(): void {
        if (!isNullOrUndefined(this.tableBodyElement)) {
            detach(this.tableBodyElement);
            this.setProperties({ start: this.currentView() }, true);
            this.createContentBody();
        }
    }
    protected copyValues(values: Date[]): Date[] {
        const copyValues: Date[] = [];
        if (!isNullOrUndefined(values) && values.length > 0) {
            for (let index: number = 0; index < values.length; index++) {
                copyValues.push(new Date(+values[index as number]));
            }
        }
        return copyValues;
    }
    protected titleUpdate(date: Date, view: string): void {
        const globalize: Internationalization = new Internationalization(this.locale);
        let dayFormatOptions: string;
        let monthFormatOptions: string;
        const type: string = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
        if (this.calendarMode === 'Gregorian') {
            dayFormatOptions = globalize.formatDate(date, { type: 'dateTime', skeleton: 'yMMMM', calendar: type });
            monthFormatOptions = globalize.formatDate(date, {
                format: null,  type: 'dateTime', skeleton: 'y', calendar: type
            });
        } else {

            dayFormatOptions = globalize.formatDate(date, { type: 'dateTime', format: 'MMMM y', calendar: type });
            monthFormatOptions = globalize.formatDate(date, { type: 'dateTime', format: 'y', calendar: type });
        }
        switch (view) {
        case 'days':
            this.headerTitleElement.textContent = this.toCapitalize(dayFormatOptions);
            break;
        case 'months':
            this.headerTitleElement.textContent = monthFormatOptions;
        }
    }
    protected setActiveDescendant(): string {
        let id: string;
        const focusedEle: Element = this.tableBodyElement.querySelector('tr td.e-focused-date');
        const selectedEle: Element = this.tableBodyElement.querySelector('tr td.e-selected');
        const type: string = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
        let title: string;
        const view: string = this.currentView();
        if (view === 'Month') {
            title = this.globalize.formatDate(this.currentDate, { type: 'date', skeleton: 'full', calendar: type });
        } else if (view === 'Year') {
            if (type !== 'islamic') {
                title = this.globalize.formatDate(this.currentDate, { type: 'date', skeleton: 'yMMMM', calendar: type });
            } else {
                title = this.globalize.formatDate(this.currentDate, { type: 'date', skeleton: 'GyMMM', calendar: type });
            }
        } else {
            title = this.globalize.formatDate(this.currentDate, {
                format: null, type: 'date', skeleton: 'y', calendar: type
            });
        }
        if (selectedEle || focusedEle) {
            if (!isNullOrUndefined(selectedEle)) {
                selectedEle.setAttribute('aria-selected', 'true');
            }
            (focusedEle || selectedEle).setAttribute('aria-label', title);
            id = (focusedEle || selectedEle).getAttribute('id');

        }
        return id;
    }
    protected iconHandler(): void {
        new Date(this.checkValue(this.currentDate)).setDate(1);
        switch (this.currentView()) {
        case 'Month':
            this.previousIconHandler(this.compareMonth(new Date(this.checkValue(this.currentDate)), this.min) < 1);
            this.nextIconHandler(this.compareMonth(new Date(this.checkValue(this.currentDate)), this.max) > -1);
            break;
        case 'Year':
            this.previousIconHandler(this.compareYear(new Date(this.checkValue(this.currentDate)), this.min) < 1);
            this.nextIconHandler(this.compareYear(new Date(this.checkValue(this.currentDate)), this.max) > -1);
            break;
        case 'Decade':
            this.previousIconHandler(this.compareDecade(new Date(this.checkValue(this.currentDate)), this.min) < 1);
            this.nextIconHandler(this.compareDecade(new Date(this.checkValue(this.currentDate)), this.max) > -1);
        }
    }
    /**
     * Destroys the widget.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.getModuleName() === 'calendar' && this.element) {
            removeClass([this.element], [ROOT]);
        } else {
            if (this.calendarElement && this.element) {
                removeClass([this.element], [ROOT]);
            }
        }
        if (this.getModuleName() === 'calendar' && this.element) {
            if (!isNullOrUndefined(this.headerTitleElement)) {
                EventHandler.remove(this.headerTitleElement, 'click', this.navigateTitle);
            }
            if (this.todayElement) {
                EventHandler.remove(this.todayElement, 'click', this.todayButtonClick);
            }
            this.previousIconHandler(true);
            this.nextIconHandler(true);
            this.keyboardModule.destroy();
            this.element.removeAttribute('data-role');
            if (!isNullOrUndefined(this.calendarEleCopy.getAttribute('tabindex'))) {
                this.element.setAttribute('tabindex', this.tabIndex);
            } else {
                this.element.removeAttribute('tabindex');
            }
        }
        if (this.element) {
            this.element.innerHTML = '';
        }
        this.todayElement = null;
        this.tableBodyElement = null;
        this.todayButtonEvent = null;
        this.renderDayCellArgs = null;
        this.headerElement = null;
        this.nextIcon = null;
        this.table = null;
        this.tableHeadElement = null;
        this.previousIcon = null;
        this.headerTitleElement = null;
        this.footer = null;
        this.contentElement = null;
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
    }
    protected previous(): void {
        this.effect = '';
        const currentView: number = this.getViewNumber(this.currentView());
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
    protected navigatePrevious(e: MouseEvent | KeyboardEvent | SwipeEventArgs): void {
        !Browser.isDevice && (e as MouseEvent | KeyboardEvent).preventDefault();
        if (this.calendarMode === 'Gregorian') {
            this.previous();
        } else {
            this.islamicModule.islamicPrevious();
        }

        this.triggerNavigate(e);
    }
    protected next(): void {
        this.effect = '';
        const currentView: number = this.getViewNumber(this.currentView());
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
    protected navigateNext(eve: MouseEvent | KeyboardEvent | SwipeEventArgs): void {
        !Browser.isDevice && (eve as MouseEvent | KeyboardEvent).preventDefault();
        if (this.calendarMode === 'Gregorian') {
            this.next();
        } else {
            this.islamicModule.islamicNext();
        }
        this.triggerNavigate(eve);
    }
    /**
     * This method is used to navigate to the month/year/decade view of the Calendar.
     *
     * @param {string} view - Specifies the view of the Calendar.
     * @param {Date} date - Specifies the focused date in a view.
     * @param {boolean} isCustomDate - Specifies whether the calendar is rendered with custom today date or not.
     * @returns {void}
     */
    public navigateTo(view: CalendarView, date: Date, isCustomDate?: boolean): void {
        if (+date >= +this.min && +date <= +this.max) {
            this.currentDate = date;
        }
        if (+date <= +this.min) {
            this.currentDate = new Date(this.checkValue(this.min));
        }
        if (+date >= +this.max) {
            this.currentDate = new Date(this.checkValue(this.max));
        }
        if ((this.getViewNumber(this.depth) >= this.getViewNumber(view))) {
            if ((this.getViewNumber(this.depth) <= this.getViewNumber(this.start))
                || this.getViewNumber(this.depth) === this.getViewNumber(view)) {
                view = this.depth;
            }
        }
        this.switchView(this.getViewNumber(view), null, null, isCustomDate);
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Gets the current view of the Calendar.
     *
     * @returns {string}
     */
    public currentView(): string {
        if (!isNullOrUndefined(this.contentElement) && this.contentElement.classList.contains(YEAR)) {
            return 'Year';
        } else if (!isNullOrUndefined(this.contentElement) && this.contentElement.classList.contains(DECADE)) {
            return 'Decade';
        } else {
            return 'Month';
        }
    }
    /* eslint-enable valid-jsdoc, jsdoc/require-returns-description */
    protected getDateVal(date: Date, value: Date): boolean {
        return (!isNullOrUndefined(value) && date.getDate() === (value).getDate()
            && date.getMonth() === (value).getMonth() && date.getFullYear() === (value).getFullYear());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected getCultureObjects(ld: Object, c: string): Object {
        const gregorianFormat: string = !isNullOrUndefined(this.dayHeaderFormat) ? '.dates.calendars.gregorian.days.format.' + this.dayHeaderFormat.toLowerCase() : null;
        const islamicFormat: string = !isNullOrUndefined(this.dayHeaderFormat) ? '.dates.calendars.islamic.days.format.' + this.dayHeaderFormat.toLowerCase() : null;
        const mainVal: string = 'main.';
        if (this.calendarMode === 'Gregorian') {
            return getValue(mainVal + '' + this.locale + gregorianFormat, ld);
        } else {
            return getValue('main.' + '' + this.locale + islamicFormat, ld);
        }
    }
    protected getWeek(d: Date): number {
        const currentDate: number = new Date(this.checkValue(d)).valueOf();
        const date: number = new Date(d.getFullYear(), 0, 1).valueOf();
        return Math.ceil((((currentDate - date) + dayMilliSeconds) / dayMilliSeconds) / 7);
    }
    protected setStartDate(date: Date, time: number): void {
        const tzOffset: number = date.getTimezoneOffset();
        const d: Date = new Date(date.getTime() + time);
        const tzOffsetDiff: number = d.getTimezoneOffset() - tzOffset;
        date.setTime(d.getTime() + tzOffsetDiff * minutesMilliSeconds);
    }
    protected addMonths(date: Date, i: number): void {
        if (this.calendarMode === 'Gregorian') {
            const day: number = date.getDate();
            date.setDate(1);
            date.setMonth(date.getMonth() + i);
            date.setDate(Math.min(day, this.getMaxDays(date)));
        } else {
            const islamicDate: IslamicDateArgs = this.islamicModule.getIslamicDate(date);
            this.currentDate = this.islamicModule.toGregorian(islamicDate.year, (islamicDate.month) + i, 1);
        }
    }
    protected addYears(date: Date, i: number): void {
        if (this.calendarMode === 'Gregorian') {
            const day: number = date.getDate();
            date.setDate(1);
            date.setFullYear(date.getFullYear() + i);
            date.setDate(Math.min(day, this.getMaxDays(date)));
        } else {
            const islamicDate: IslamicDateArgs = this.islamicModule.getIslamicDate(date);
            this.currentDate = this.islamicModule.toGregorian(islamicDate.year + i, (islamicDate.month), 1);
        }
    }
    protected getIdValue(e: MouseEvent | TouchEvent | KeyboardEvent, element: Element): Date {
        let eve: Element;
        if (e) {
            eve = <Element>e.currentTarget;
        } else {
            eve = element;
        }
        const type: string = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
        const dateFormatOptions: object = { type: 'dateTime', skeleton: 'full', calendar: type };
        // eslint-disable-next-line radix
        const dateString: string = this.globalize.formatDate(new Date(parseInt('' + eve.getAttribute('id'), 0)), dateFormatOptions);
        const date: Date = this.globalize.parseDate(dateString, dateFormatOptions);
        const value: number = date.valueOf() - date.valueOf() % 1000;
        return new Date(value);
        //return this.globalize.parseDate(dateString, dateFormatOptions);
    }
    protected adjustLongHeaderSize(): void {
        removeClass([this.element], DAYHEADERLONG);
        if (this.dayHeaderFormat === 'Wide') {
            addClass([this.getModuleName() === 'calendar' ? this.element : this.calendarElement], DAYHEADERLONG);
        }
    }
    protected selectDate(e: MouseEvent | KeyboardEventArgs, date: Date, node: Element, multiSelection?: boolean, values?: Date[]): void {
        const element: Element = node || <Element>e.currentTarget;
        this.isDateSelected = false;
        if (this.currentView() === 'Decade') {
            this.setDateDecade(this.currentDate, date.getFullYear());
        } else if (this.currentView() === 'Year') {
            this.setDateYear(this.currentDate, date);
        } else {
            if (multiSelection && !this.checkPresentDate(date, values)) {
                const copyValues: Date[] = this.copyValues(values);
                if (!isNullOrUndefined(values) && copyValues.length > 0) {
                    copyValues.push(new Date(this.checkValue(date)));
                    this.setProperties({ values: copyValues }, true);
                    this.setProperties({ value: values[values.length - 1] }, true);
                } else {
                    this.setProperties({ values: [new Date(this.checkValue(date))] }, true);
                }
            } else {
                this.setProperties({ value: new Date(this.checkValue(date)) }, true);
            }
            this.currentDate = new Date(this.checkValue(date));
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
        if (!multiSelection && !isNullOrUndefined(tableBodyElement.querySelector('.' + FOCUSEDCELL))) {
            removeClass([tableBodyElement.querySelector('.' + FOCUSEDCELL)], FOCUSEDCELL);
        }
        if (multiSelection) {
            const copyValues: Date[] = this.copyValues(values);
            const collection: Element[] = Array.prototype.slice.call(this.tableBodyElement.querySelectorAll('td'));
            for (let index: number = 0; index < collection.length; index++) {
                const tempElement: Element = tableBodyElement.querySelectorAll('td' + '.' + FOCUSEDDATE)[0];
                const selectedElement: Element = tableBodyElement.querySelectorAll('td' + '.' + SELECTED)[0];
                if (collection[index as number] === tempElement) {
                    removeClass([collection[index as number]], FOCUSEDDATE);
                }
                if (collection[index as number] === selectedElement &&
                    !this.checkPresentDate(new Date(parseInt(selectedElement.getAttribute('id').split('_')[0], 10)), values)) {
                    removeClass([collection[index as number]], SELECTED);
                }
            }
            if (element.classList.contains(SELECTED)) {
                removeClass([element], SELECTED);
                for (let i: number = 0; i < copyValues.length; i++) {
                    const type: string = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
                    const formatOptions: object = { format: null, type: 'date', skeleton: 'short', calendar: type };
                    const localDateString: string = this.globalize.formatDate(date, formatOptions);
                    const tempDateString: string = this.globalize.formatDate(copyValues[i as number], formatOptions);
                    if (localDateString === tempDateString) {
                        const index: number = copyValues.indexOf(copyValues[i as number]);
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
        this.isDateSelected = true;
    }
    protected checkPresentDate(dates: Date, values: Date[]): boolean {
        let previousValue: boolean = false;
        if (!isNullOrUndefined(values)) {
            for (let checkPrevious: number = 0; checkPrevious < values.length; checkPrevious++) {
                const type: string = (this.calendarMode === 'Gregorian') ? 'gregorian' : 'islamic';
                const localDateString: string = this.globalize.formatDate(dates, {
                    format: null, type: 'date', skeleton: 'short', calendar: type
                });
                const tempDateString: string = this.globalize.formatDate(values[checkPrevious as number], {
                    format: null, type: 'date', skeleton: 'short', calendar: type
                });
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
            if (!isNullOrUndefined(this.previousIcon)) {
                EventHandler.remove(this.previousIcon, 'click', this.navigatePreviousHandler);

                addClass([this.previousIcon], '' + DISABLED);
                addClass([this.previousIcon], '' + OVERLAY);
                this.previousIcon.setAttribute('aria-disabled', 'true');
            }
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
    protected navigatedEvent(eve: MouseEvent | KeyboardEvent| SwipeEventArgs): void {
        extend(this.navigatedArgs, { name: 'navigated', event: eve });
        this.trigger('navigated', this.navigatedArgs);
    }
    protected triggerNavigate(event: MouseEvent | KeyboardEvent | SwipeEventArgs): void {
        this.navigatedArgs = { view: this.currentView(), date: this.currentDate };
        this.navigatedEvent(event);
    }

    protected nextIconHandler(disabled: boolean): void {
        if (disabled) {
            if (!isNullOrUndefined(this.previousIcon)) {
                EventHandler.remove(this.nextIcon, 'click', this.navigateNextHandler);
                addClass([this.nextIcon], DISABLED);
                addClass([this.nextIcon], OVERLAY);
                this.nextIcon.setAttribute('aria-disabled', 'true');
            }
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
        if (this.calendarMode === 'Gregorian') {
            return date.getMonth() >= this.min.getMonth()
                && date.getFullYear() >= this.min.getFullYear()
                && date.getMonth() <= this.max.getMonth()
                && date.getFullYear() <= this.max.getFullYear();

        } else {
            const islamicDate: IslamicObject = this.islamicModule.getIslamicDate(date);
            return islamicDate.month >= (<IslamicObject>(this.islamicModule.getIslamicDate(new Date(1944, 1, 18)))).month
                && islamicDate.year >= (<IslamicObject>(this.islamicModule.getIslamicDate(new Date(1944, 1, 18)))).year
                && islamicDate.month <= (<IslamicObject>(this.islamicModule.getIslamicDate(new Date(2069, 1, 16)))).month
                && islamicDate.year <= (<IslamicObject>(this.islamicModule.getIslamicDate(new Date(2069, 1, 16)))).year;
        }
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
        const value: Date = new Date(+date);
        if (!isNullOrUndefined(this.tableBodyElement) && !isNullOrUndefined(e)) {
            while (this.findNextTD(new Date(+date), column, max, min)) {
                column += i;
            }
            const rangeValue: Date = new Date(value.setDate(value.getDate() + column));
            column = (+rangeValue > +max || +rangeValue < +min) ? column === i ? i - i : i : column;
        }
        date.setDate(date.getDate() + column);
    }
    protected findNextTD(date: Date, column: number, max: Date, min: Date): boolean {
        const value: Date = new Date(date.setDate(date.getDate() + column));
        let collection: Element[] = [];
        let isDisabled: boolean = false;
        if ((!isNullOrUndefined(value) && value.getMonth()) === (!isNullOrUndefined(this.currentDate) && this.currentDate.getMonth())) {
            let tdEles: Element[];
            if (this.calendarMode === 'Gregorian') {
                tdEles = this.renderDays(value);
            } else {
                tdEles = this.islamicModule.islamicRenderDays(this.currentDate, value);
            }

            collection = tdEles.filter((element: Element) => {
                return element.classList.contains(DISABLED);
            });
        } else {
            collection = <NodeListOf<HTMLTableDataCellElement> & Element[]>this.tableBodyElement.querySelectorAll('td.' + DISABLED);
        }
        if (+value <= (+(max)) && +value >= (+(min))) {
            if (collection.length) {
                for (let i: number = 0; i < collection.length; i++) {
                    // eslint-disable-next-line radix
                    isDisabled = (+value === +new Date(parseInt(collection[i as number].id, 0))) ? true : false;
                    if (isDisabled) {
                        break;
                    }
                }
            }
        }
        return isDisabled;
    }
    protected getMaxDays(d: Date): number {
        let date: number;
        const tmpDate: Date = new Date(this.checkValue(d));
        date = 28;
        const month: number = tmpDate.getMonth();
        while (tmpDate.getMonth() === month) {
            ++date;
            tmpDate.setDate(date);
        }
        return date - 1;
    }
    protected setDateDecade(date: Date, year: number): void {
        date.setFullYear(year);
        this.setProperties({ value: new Date(this.checkValue(date)) }, true);
    }
    protected setDateYear(date: Date, value: Date): void {
        date.setFullYear(value.getFullYear(), value.getMonth(), date.getDate());
        if (value.getMonth() !== date.getMonth()) {
            date.setDate(0);
            this.currentDate = new Date(this.checkValue(value));
        }
        this.setProperties({ value: new Date(this.checkValue(date)) }, true);
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
    protected checkValue(inValue: string | Date | number): string {
        if (inValue instanceof Date) {
            return (inValue.toUTCString());
        } else {
            return ('' + inValue);
        }
    }
    protected checkView(): void {
        if (this.start !== 'Decade' && this.start !== 'Year') {
            this.setProperties({ start: 'Month' }, true);
        }
        if (this.depth !== 'Decade' && this.depth !== 'Year') {
            this.setProperties({ depth: 'Month' }, true);
        }
        if (this.getViewNumber(this.depth) > this.getViewNumber(this.start)) {
            this.setProperties({ depth: 'Month' }, true);
        }
    }
    protected getDate(date: Date, timezone: string): Date {
        if (timezone) {
            date = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
        }
        return date;
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
     *
     * @default null
     * @isGenericType true
     * @deprecated
     */
    @Property(null)
    public value: Date;

    /**
     * Gets or sets multiple selected dates of the calendar.
     * {% codeBlock src='calendar/values/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public values: Date[];

    /**
     * Specifies the option to enable the multiple dates selection of the calendar.
     *
     * @default false
     */
    @Property(false)
    public isMultiSelection: boolean;

    /**
     * Triggers when the Calendar value is changed.
     *
     * @event change
     */
    @Event()
    public change: EmitType<ChangedEventArgs>;
    /**
     * Initialized new instance of Calendar Class.
     * Constructor for creating the widget
     *
     * @param {CalendarModel} options - Specifies the Calendar model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: CalendarModel, element?: string | HTMLElement) {
        super(options, element);
    }
    /**
     * To Initialize the control rendering.
     *
     * @returns {void}
     * @private
     */
    protected render(): void {
        if (this.calendarMode === 'Islamic' && this.islamicModule === undefined) {
            throwError('Requires the injectable Islamic modules to render Calendar in Islamic mode');
        }
        if (this.isMultiSelection && typeof this.values === 'object' && !isNullOrUndefined(this.values) && this.values.length > 0) {
            const tempValues: number[] = [];
            const copyValues: Date[] = [];
            for (let limit: number = 0; limit < this.values.length; limit++) {
                if (tempValues.indexOf(+this.values[limit as number]) === -1) {
                    tempValues.push(+this.values[limit as number]);
                    copyValues.push(this.values[limit as number]);
                }
            }
            this.setProperties({ values: copyValues }, true);
            for (let index: number = 0; index < this.values.length; index++) {
                if (!this.checkDateValue(this.values[index as number])) {
                    if (typeof (this.values[index as number]) === 'string' && this.checkDateValue(new Date(this.checkValue(this.values[index as number])))) {
                        const copyDate: Date = new Date(this.checkValue(this.values[index as number]));
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
        if (this.getModuleName() === 'calendar') {
            this.setEnable(this.enabled);
            this.setClass(this.cssClass);
        }
        super.render();
        if (this.getModuleName() === 'calendar') {
            const form: Element = closest(this.element, 'form');
            if (form) {
                EventHandler.add(form, 'reset', this.formResetHandler.bind(this));
            }
            this.setTimeZone(this.serverTimezoneOffset);
        }
        this.renderComplete();
    }
    protected setEnable(enable: boolean): void {
        if (!enable) {
            addClass([this.element], DISABLED);
        } else {
            removeClass([this.element], DISABLED);
        }
    }
    protected setClass(newCssClass: string, oldCssClass?: string): void {
        if (!isNullOrUndefined(oldCssClass)) {
            oldCssClass = (oldCssClass.replace(/\s+/g, ' ')).trim();
        }
        if (!isNullOrUndefined(newCssClass)) {
            newCssClass = (newCssClass.replace(/\s+/g, ' ')).trim();
        }
        if (!isNullOrUndefined(oldCssClass) && oldCssClass !== '') {
            removeClass([this.element], oldCssClass.split(' '));
        }
        if (!isNullOrUndefined(newCssClass)) {
            addClass([this.element], newCssClass.split(' '));
        }
    }
    protected isDayLightSaving(): boolean {
        const secondOffset: number = new Date(this.value.getFullYear(), 6 , 1).getTimezoneOffset();
        const firstOffset: number = new Date(this.value.getFullYear(), 0 , 1).getTimezoneOffset();
        return (this.value.getTimezoneOffset() < Math.max(firstOffset, secondOffset));
    }
    protected setTimeZone(offsetValue: number ): void {
        if (!isNullOrUndefined(this.serverTimezoneOffset) && this.value) {
            const serverTimezoneDiff: number = offsetValue;
            const clientTimeZoneDiff: number = new Date().getTimezoneOffset() / 60;
            let timeZoneDiff: number = serverTimezoneDiff + clientTimeZoneDiff;
            timeZoneDiff = this.isDayLightSaving() ? timeZoneDiff-- : timeZoneDiff;
            this.value = new Date(this.value.getTime() + (timeZoneDiff * 60 * 60 * 1000));
        }
    }
    protected formResetHandler(): void {
        this.setProperties({ value: null }, true);
    }
    protected validateDate(): void {
        if (typeof this.value === 'string') {
            this.setProperties({ value: this.checkDateValue(new Date(this.checkValue(this.value))) }, true); // persist the value property.
        }
        super.validateDate(this.value);
        if (!isNullOrUndefined(this.value) && this.min <= this.max && this.value >= this.min && this.value <= this.max) {
            this.currentDate = new Date(this.checkValue(this.value));
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

    protected generateTodayVal(value: Date) : Date {
        let tempValue: Date = new Date();
        if (!isNullOrUndefined(this.timezone)) {
            tempValue = super.getDate(tempValue, this.timezone);
        }
        if (value && isNullOrUndefined(this.timezone)) {
            tempValue.setHours(value.getHours());
            tempValue.setMinutes(value.getMinutes());
            tempValue.setSeconds(value.getSeconds());
            tempValue.setMilliseconds(value.getMilliseconds());
        } else {
            tempValue = new Date(tempValue.getFullYear(), tempValue.getMonth(), tempValue.getDate(), 0, 0, 0, 0);
        }
        return tempValue;
    }

    protected todayButtonClick(e?: MouseEvent | KeyboardEvent): void {
        if (this.showTodayButton) {
            const tempValue: Date = this.generateTodayVal(this.value);
            this.setProperties({ value: tempValue }, true);
            this.isTodayClicked = true;
            this.todayButtonEvent = e;
            if (this.isMultiSelection) {
                const copyValues: Date[] = this.copyValues(this.values);
                if (!super.checkPresentDate(tempValue, this.values)) {
                    copyValues.push(tempValue);
                    this.setProperties({ values: copyValues });
                }
            }
            super.todayButtonClick(e, new Date(+this.value));
        }
    }
    protected keyActionHandle(e: KeyboardEventArgs): void {
        super.keyActionHandle(e, this.value, this.isMultiSelection);
    }
    /**
     * Initialize the event handler
     *
     * @returns {void}
     * @private
     */
    protected preRender(): void {
        this.changeHandler = (e: MouseEvent): void => {
            this.triggerChange(e);
        };
        this.checkView();
        super.preRender(this.value);
    }
    /**
     * @returns {void}
     * @deprecated
     */
    public createContent(): void {
        this.previousDate = this.value;
        this.previousDateTime = this.value;
        super.createContent();
    }
    protected minMaxDate(localDate: Date): Date {
        return super.minMaxDate(localDate);
    }
    protected renderMonths(e?: Event, value?: Date, isCustomDate?: boolean): void {
        super.renderMonths(e, this.value, isCustomDate);
    }
    protected renderDays(currentDate: Date, value?: Date, isMultiSelect?: boolean, values?:
    Date[], isCustomDate?: boolean, e?: Event): HTMLElement[] {
        const tempDays: HTMLElement[] = super.renderDays(currentDate, this.value, this.isMultiSelection, this.values, isCustomDate, e);
        if (this.isMultiSelection) {
            super.validateValues(this.isMultiSelection, this.values);
        }
        return tempDays;
    }
    protected renderYears(e?: Event): void {
        if (this.calendarMode === 'Gregorian') {
            super.renderYears(e, this.value);
        } else {
            this.islamicModule.islamicRenderYears(e, this.value);
        }

    }
    protected renderDecades(e?: Event): void {
        if (this.calendarMode === 'Gregorian') {
            super.renderDecades(e, this.value);
        } else {
            this.islamicModule.islamicRenderDecade(e, this.value);
        }
    }
    protected renderTemplate(elements: HTMLElement[], count: number, classNm: string, e?: Event): void {
        if (this.calendarMode === 'Gregorian') {
            super.renderTemplate(elements, count, classNm, e, this.value);
        } else {
            this.islamicModule.islamicRenderTemplate(elements, count, classNm, e, this.value);
        }
        this.changedArgs = { value: this.value, values: this.values };
        e && e.type === 'click' && (e.currentTarget as HTMLElement).classList.contains(OTHERMONTH) ? this.changeHandler(e) : this.changeHandler();
    }
    protected clickHandler(e: MouseEvent): void {
        const eve: Element = <HTMLElement>e.currentTarget;
        this.isPopupClicked = true;
        if (eve.classList.contains(OTHERMONTH)) {
            if (this.isMultiSelection) {
                const copyValues: Date[] = this.copyValues(this.values);
                if (copyValues.toString().indexOf(this.getIdValue(e, null).toString()) === -1) {
                    copyValues.push(this.getIdValue(e, null));
                    this.setProperties({ values: copyValues }, true);
                    this.setProperties({ value: this.values[this.values.length - 1] }, true);
                }
                else {
                    this.previousDates = true;
                }
            } else {
                this.setProperties({ value: this.getIdValue(e, null) }, true);
            }
        }
        const storeView: string = this.currentView();
        super.clickHandler(e, this.value);
        if (this.isMultiSelection && this.currentDate !== this.value &&
            !isNullOrUndefined(this.tableBodyElement.querySelectorAll('.' + FOCUSEDDATE)[0]) && storeView === 'Year') {
            this.tableBodyElement.querySelectorAll('.' + FOCUSEDDATE)[0].classList.remove(FOCUSEDDATE);
        }
    }

    protected switchView(view: number, e?: Event, isMultiSelection?: boolean, isCustomDate?: boolean): void {
        super.switchView(view, e, this.isMultiSelection, isCustomDate);
    }
    /**
     * To get component name
     *
     * @returns {string} Return the component name.
     * @private
     */
    protected getModuleName(): string {
        super.getModuleName();
        return 'calendar';
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Gets the properties to be maintained upon browser refresh.
     *
     * @returns {string}
     */
    public getPersistData(): string {
        super.getPersistData();
        const keyEntity: string[] = ['value', 'values'];
        return this.addOnPersist(keyEntity);
    }
    /* eslint-enable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Called internally if any of the property value changed.
     *
     * @param {CalendarModel} newProp - Returns the dynamic property value of the component.
     * @param {CalendarModel} oldProp - Returns the previous property value of the component.
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: CalendarModel, oldProp: CalendarModel): void {
        this.effect = '';
        this.rangeValidation(this.min, this.max);
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'value':
                if (this.isDateSelected) {
                    if (typeof newProp.value === 'string') {
                        this.setProperties({ value: new Date(this.checkValue(newProp.value)) }, true);
                    } else {
                        newProp.value = new Date(this.checkValue(newProp.value));
                    }
                    if (isNaN(+this.value)) {
                        this.setProperties({ value: oldProp.value }, true);
                    }
                    this.update();
                }
                break;
            case 'values':
                if (this.isDateSelected) {
                    if (typeof newProp.values === 'string' || typeof newProp.values === 'number') {
                        this.setProperties({ values: null }, true);
                    } else {
                        const copyValues: Date[] = this.copyValues(this.values);
                        for (let index: number = 0; index < copyValues.length; index++) {
                            const tempDate: Date = copyValues[index as number];
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
                }
                break;
            case 'isMultiSelection':
                if (this.isDateSelected) {
                    this.setProperties({ isMultiSelection: newProp.isMultiSelection }, true);
                    this.update();
                }
                break;
            case 'enabled':
                this.setEnable(this.enabled);
                break;
            case 'cssClass':
                if (this.getModuleName() === 'calendar') {
                    this.setClass(newProp.cssClass, oldProp.cssClass);
                }
                break;
            default:
                super.onPropertyChanged(newProp, oldProp, this.isMultiSelection, this.values);
            }
        }
        this.preventChange = this.isAngular && this.preventChange ? !this.preventChange : this.preventChange;
    }

    /**
     * Destroys the widget.
     *
     * @returns {void}
     */
    public destroy(): void {
        super.destroy();
        if (this.getModuleName() === 'calendar') {
            this.changedArgs = null;
            const form: Element = closest(this.element, 'form');
            if (form) {
                EventHandler.remove(form, 'reset', this.formResetHandler.bind(this));
            }
        }
    }
    /**
     * This method is used to navigate to the month/year/decade view of the Calendar.
     *
     * @param {string} view - Specifies the view of the Calendar.
     * @param {Date} date - Specifies the focused date in a view.
     * @param {boolean} isCustomDate - Specifies whether the calendar is rendered with custom today date or not.
     * @returns {void}
     * @deprecated
     */
    public navigateTo(view: CalendarView, date: Date, isCustomDate?: boolean): void {
        this.minMaxUpdate();
        super.navigateTo(view, date, isCustomDate);
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Gets the current view of the Calendar.
     *
     * @returns {string}
     * @deprecated
     */
    public currentView(): string {
        return super.currentView();
    }
    /* eslint-enable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * This method is used to add the single or multiple dates to the values property of the Calendar.
     *
     * @param {Date | Date[]} dates - Specifies the date or dates to be added to the values property of the Calendar.
     * @returns {void}
     * @deprecated
     */
    public addDate(dates: Date | Date[]): void {
        if (typeof dates !== 'string' && typeof dates !== 'number') {
            let copyValues: Date[] = this.copyValues(this.values);
            if (typeof dates === 'object' && (<Date[]>(dates)).length > 0) {
                const tempDates: Date[] = <Date[]>dates;
                for (let i: number = 0; i < tempDates.length; i++) {
                    if (this.checkDateValue(tempDates[i as number]) && !super.checkPresentDate(tempDates[i as number], copyValues)) {
                        if (!isNullOrUndefined(copyValues) && copyValues.length > 0) {
                            copyValues.push(tempDates[i as number]);
                        } else {
                            copyValues = [new Date(+tempDates[i as number])];
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
     *
     * @param {Date | Date[]} dates - Specifies the date or dates which need to be removed from the values property of the Calendar.
     * @returns {void}
     * @deprecated
     */
    public removeDate(dates: Date | Date[]): void {
        if (typeof dates !== 'string' && typeof dates !== 'number' && !isNullOrUndefined(this.values) && this.values.length > 0) {
            const copyValues: Date[] = this.copyValues(this.values);
            if (typeof dates === 'object' && ((<Date[]>(dates)).length > 0)) {
                const tempDates: Date[] = <Date[]>dates;
                for (let index: number = 0; index < tempDates.length; index++) {
                    for (let i: number = 0; i < copyValues.length; i++) {
                        if (+copyValues[i as number] === +tempDates[index as number]) {
                            copyValues.splice(i, 1);
                        }
                    }
                }
            } else {
                for (let i: number = 0; i < copyValues.length; i++) {
                    if (+copyValues[i as number] === +dates) {
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

    /**
     * To set custom today date in calendar
     *
     * @param {Date} date - Specifies date value to be set.
     * @private
     * @returns {void}
     */
    public setTodayDate(date: Date): void {
        const todayDate: Date = new Date(+date);
        this.setProperties({ value: todayDate }, true);
        super.todayButtonClick(null, todayDate, true);
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected changeEvent(e: Event): void {
        if ((this.value && this.value.valueOf()) !== (this.previousDate && +this.previousDate.valueOf())
        || this.isMultiSelection) {
            if (this.isAngular && this.preventChange) {
                this.preventChange = false;
            } else {
                this.trigger('change', this.changedArgs);
            }
            this.previousDate = new Date(+this.value);
        }
    }

    protected triggerChange(e: MouseEvent | KeyboardEvent): void {
        if (!isNullOrUndefined(this.todayButtonEvent) && this.isTodayClicked) {
            e = this.todayButtonEvent;
            this.isTodayClicked = false;
        }
        this.changedArgs.event = e || null;
        this.changedArgs.isInteracted = !isNullOrUndefined(e);
        if (!isNullOrUndefined(this.value)) {
            this.setProperties({ value: this.value }, true);
        }
        // eslint-disable-next-line
        if (!this.isMultiSelection && +this.value !== Number.NaN && (!isNullOrUndefined(this.value) &&
         !isNullOrUndefined(this.previousDate) || this.previousDate === null
            && !isNaN(+this.value))) {
            this.changeEvent(e);
        } else if (!isNullOrUndefined(this.values) && this.previousValues !== this.values.length) {
            this.changeEvent(e);
            this.previousValues = this.values.length;
        }

    }

}

export interface NavigatedEventArgs extends BaseEventArgs {
    /** Defines the current view of the Calendar. */
    view?: string
    /** Defines the focused date in a view. */
    date?: Date
    /**
     * Specifies the original event arguments.
     */
    event?: KeyboardEvent | MouseEvent | Event

}

export interface RenderDayCellEventArgs extends BaseEventArgs {
    /** Specifies whether to disable the current date or not. */
    isDisabled?: boolean
    /** Specifies the day cell element. */
    element?: HTMLElement
    /** Defines the current date of the Calendar. */
    date?: Date
    /** Defines whether the current date is out of range (less than min or greater than max) or not. */
    isOutOfRange?: boolean
}
export interface ChangedEventArgs extends BaseEventArgs {
    /** Defines the selected date of the Calendar.
     *
     * @isGenericType true
     */
    value?: Date

    /** Defines the multiple selected date of the Calendar. */
    values?: Date[]

    /**
     * Specifies the original event arguments.
     */
    event?: KeyboardEvent | MouseEvent | Event

    /** Defines the element. */
    element?: HTMLElement | HTMLInputElement

    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted?: boolean
}

export interface IslamicObject {
    year: number
    date: number
    month: number
}

/**
 * Defines the argument for the focus event.
 */
export interface FocusEventArgs {
    model?: Object
}

/**
 * Defines the argument for the blur event.
 */
export interface BlurEventArgs {
    model?: Object
}

export interface ClearedEventArgs {
    /**
     * Specifies the original event arguments.
     */
    event?: MouseEvent | Event

}
