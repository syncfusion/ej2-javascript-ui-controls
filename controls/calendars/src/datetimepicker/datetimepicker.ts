// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path='../datepicker/datepicker-model.d.ts'/>
import { EventHandler, Internationalization, Property, NotifyPropertyChanges, Browser, RippleOptions } from '@syncfusion/ej2-base';
import { Animation, EmitType, Event, AnimationModel, cldrData, getDefaultDateObject, detach } from '@syncfusion/ej2-base';
import { createElement, remove, addClass, L10n, removeClass, closest, append, attributes } from '@syncfusion/ej2-base';
import { KeyboardEvents, KeyboardEventArgs, isNullOrUndefined, formatUnit, getValue, rippleEffect } from '@syncfusion/ej2-base';
import { ModuleDeclaration, extend, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { Input } from '@syncfusion/ej2-inputs';
import { BlurEventArgs, ClearedEventArgs, CalendarType, CalendarView, DayHeaderFormats } from '../calendar/calendar';
import { DatePicker, PopupObjectArgs } from '../datepicker/datepicker';
import { TimePickerBase } from '../timepicker/timepicker';
import { DateTimePickerModel } from './datetimepicker-model';
import {MaskPlaceholderModel} from '../common/maskplaceholder-model';

//class constant defination
const DATEWRAPPER: string = 'e-date-wrapper';
const DATEPICKERROOT: string = 'e-datepicker';
const DATETIMEWRAPPER: string = 'e-datetime-wrapper';
const DAY: number = new Date().getDate();
const MONTH: number = new Date().getMonth();
const YEAR: number = new Date().getFullYear();
const HOUR: number = new Date().getHours();
const MINUTE: number = new Date().getMinutes();
const SECOND: number = new Date().getSeconds();
const MILLISECOND: number = new Date().getMilliseconds();
const ROOT: string = 'e-datetimepicker';
const DATETIMEPOPUPWRAPPER: string = 'e-datetimepopup-wrapper';
const INPUTWRAPPER: string = 'e-input-group-icon';
const POPUP: string = 'e-popup';
const TIMEICON: string = 'e-time-icon';
const INPUTFOCUS: string = 'e-input-focus';
const POPUPDIMENSION: string = '250px';
const ICONANIMATION: string = 'e-icon-anim';
const DISABLED: string = 'e-disabled';
const ERROR: string = 'e-error';
const CONTENT: string = 'e-content';
const NAVIGATION: string = 'e-navigation';
const ACTIVE: string = 'e-active';
const HOVER: string = 'e-hover';
const ICONS: string = 'e-icons';
const HALFPOSITION: number = 2;
const LISTCLASS: string = 'e-list-item';
const ANIMATIONDURATION: number = 100;
const OVERFLOW: string = 'e-time-overflow';

/**
 * Represents the DateTimePicker component that allows user to select
 * or enter a date time value.
 * ```html
 * <input id="dateTimePicker"/>
 * ```
 * ```typescript
 * <script>
 *   let dateTimePickerObject:DateTimePicker = new DateTimePicker({ value: new Date() });
 *   dateTimePickerObject.appendTo("#dateTimePicker");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class DateTimePicker extends DatePicker {
    private timeIcon: HTMLElement;
    private cloneElement: HTMLElement;
    private dateTimeWrapper: HTMLElement;
    private rippleFn: Function;
    private listWrapper: HTMLElement;
    private liCollections: HTMLElement[];
    private timeCollections: number[];
    private listTag: HTMLElement;
    private selectedElement: HTMLElement;
    private containerStyle: ClientRect;
    private popupObject: Popup;
    protected timeModal: HTMLElement;
    protected modelWrapper: HTMLElement;
    private isNavigate: boolean;
    protected isPreventBlur: boolean;
    private timeValue: string;
    protected l10n: L10n;
    private keyboardHandler: KeyboardEvents;
    protected inputEvent: KeyboardEvents;
    private activeIndex: number;
    private valueWithMinutes: Date = null;
    private initValue: Date;
    protected tabIndex: string;
    private isValidState: boolean;
    protected timekeyConfigure: { [key: string]: string };
    protected preventArgs: PopupObjectArgs;
    private dateTimeOptions: DateTimePickerModel;
    protected scrollInvoked: boolean = false;
    protected maskedDateValue: string;
    protected moduleName: string = this.getModuleName();
    protected touchDTModule: Touch;
    protected touchDTStart: boolean;
    private formatRegex : RegExp = /dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yyy|yy|y|'[^']*'|'[^']*'/g;
    private dateFormatString : string = '';

    /**
     * Specifies the format of the time value that to be displayed in time popup list.
     *
     * @default null
     */
    @Property(null)
    public timeFormat: string;
    /**
     * Specifies the time interval between the two adjacent time values in the time popup list .
     *
     * @default 30
     */
    @Property(30)
    public step: number;
    /**
     * Specifies the scroll bar position if there is no value is selected in the timepicker popup list or
     * the given value is not present in the timepicker popup list.
     * {% codeBlock src='datetimepicker/scrollTo/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public scrollTo: Date;
    /**
     * specifies the z-index value of the popup element.
     *
     * @default 1000
     * @aspType int
     */
    @Property(1000)
    public zIndex: number;
    /**
     * Gets or sets the selected date of the Calendar.
     *
     * @default null
     * @isGenericType true
     */
    @Property(null)
    public value: Date;
    /**    
     * Customizes the key actions in DateTimePicker.
     * For example, when using German keyboard, the key actions can be customized using these shortcuts.
     *
     *
     * Input Navigation
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Key action<br/></td><td colSpan=1 rowSpan=1>
     * Key<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * altUpArrow<br/></td><td colSpan=1 rowSpan=1>
     * alt+uparrow<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * altDownArrow<br/></td><td colSpan=1 rowSpan=1>
     * alt+downarrow<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * escape<br/></td><td colSpan=1 rowSpan=1>
     * escape<br/></td></tr>
     * </table>
     *
     * Calendar Navigation (Use the following list of keys to navigate the currently focused Calendar after the popup has opened).
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
     * </table>
     *
     * TimePicker Navigation (Use the below list of shortcut keys to interact with the TimePicker after the TimePicker Popup has opened).
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Key action<br/></td><td colSpan=1 rowSpan=1>
     * Key<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * down<br/></td><td colSpan=1 rowSpan=1>
     * downarrow<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * up<br/></td><td colSpan=1 rowSpan=1>
     * uparrow<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * left<br/></td><td colSpan=1 rowSpan=1>
     * leftarrow<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * right<br/></td><td colSpan=1 rowSpan=1>
     * rightarrow<br/></td></tr>
     * </table>
     *
     * {% codeBlock src='datetimepicker/keyConfigs/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public keyConfigs: { [key: string]: string };
    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * {% codeBlock src='datetimepicker/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };
    /**
     * Enable or disable persisting component's state between page reloads. If enabled, following list of states will be persisted.
     * 1. value
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * > Support for `allowEdit` has been provided from
     * [`v16.2.46`](https://ej2.syncfusion.com/angular/documentation/release-notes/16.2.46/#datetimepicker).
     *
     * Specifies whether the input textbox is editable or not. Here the user can select the value from the
     * popup and cannot edit in the input textbox.
     *
     * @default true
     */
    @Property(true)
    public allowEdit: boolean;
    /**
     * Specifies the option to enable the multiple dates selection of the calendar.
     *
     * @default false
     * @private
     */
    @Property(false)
    public isMultiSelection: boolean;
    /**
     * Gets or sets multiple selected dates of the calendar.
     *
     * @default null
     * @private
     */
    @Property(null)
    public values: Date[];
    /**
     * Specifies whether to show or hide the clear icon in textbox.
     *
     * @default true
     */
    @Property(true)
    public showClearButton: boolean;
    /**
     * Specifies the placeholder text that to be is displayed in textbox.
     *
     * @default null
     */
    @Property(null)
    public placeholder: string;
    /**
     * Specifies the component to act as strict. So that, it allows to enter only a valid
     * date and time value within a specified range or else it
     * will resets to previous value. By default, strictMode is in false.
     * it allows invalid or out-of-range value with highlighted error class.
     *
     * @default false
     * > For more details refer to
     * [`Strict Mode`](../../datetimepicker/strict-mode/) documentation.
     */
    @Property(false)
    public strictMode: boolean;
    /**
     * Specifies the component popup display full screen in mobile devices.
     *
     * @default false
     */
    @Property(false)
    public fullScreenMode : boolean;
    /**
     * By default, the date value will be processed based on system time zone.
     * If you want to process the initial date value using server time zone
     * then specify the time zone value to `serverTimezoneOffset` property.
     *
     * @default null
     */
    @Property(null)
    public serverTimezoneOffset: number;
    /**
     * Gets or sets the minimum date that can be selected in the DateTimePicker.
     *
     * @default new Date(1900, 00, 01)
     */
    @Property(new Date(1900, 0, 1))
    public min: Date;
    /**
     * Gets or sets the maximum date that can be selected in the DateTimePicker.
     *
     * @default new Date(2099, 11, 31)
     */
    @Property(new Date(2099, 11, 31))
    public max: Date;
    /**
     * Gets or sets the Calendar's first day of the week. By default, the first day of the week will be based on the current culture.
     *
     * @default 0
     * @aspType int
     * > For more details about firstDayOfWeek refer to
     * [`First day of week`](../../calendar/how-to/first-day-of-week#change-the-first-day-of-the-week) documentation.
     */
    @Property(null)
    public firstDayOfWeek: number;
    /**
     * Gets or sets the Calendar's Type like gregorian or islamic.
     *
     * @default Gregorian
     */
    @Property('Gregorian')
    public calendarMode: CalendarType;
    /**
     * Specifies the initial view of the Calendar when it is opened.
     * With the help of this property, initial view can be changed to year or decade view.
     *
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
     * [`calendarView`](../../calendar/calendar-views#view-restriction)documentation.
     */
    @Property('Month')
    public start: CalendarView;
    /**
     * Sets the maximum level of view such as month, year, and decade in the Calendar.
     * Depth view should be smaller than the start view to restrict its view navigation.
     *
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
     *  [`calendarView`](../../calendar/calendar-views#view-restriction)documentation.
     */
    @Property('Month')
    public depth: CalendarView;
    /**
     * Determines whether the week number of the year is to be displayed in the calendar or not.
     *
     * @default false
     * > For more details about weekNumber refer to
     * [`Calendar with week number`](../../calendar/how-to/render-the-calendar-with-week-numbers)documentation.
     */
    @Property(false)
    public weekNumber: boolean;
    /**
     * Specifies whether the today button is to be displayed or not.
     *
     * @default true
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
     */
    @Property('Short')
    public dayHeaderFormat: DayHeaderFormats;
    /**
     * By default, the popup opens while clicking on the datetimepicker icon.
     * If you want to open the popup while focusing the datetime input then specify its value as true.
     *
     * @default false
     */
    @Property(false)
    public openOnFocus : boolean;
    /**
     * Specifies whether it is a masked datetimepicker or not.
     * By default the datetimepicker component render without masked input.
     * If you need masked datetimepicker input then specify it as true.
     *
     * @default false
     */
    @Property(false)
    public enableMask: boolean;

    /**
     * Specifies the mask placeholder to be displayed on masked datetimepicker.
     *
     * @default {day:'day' , month:'month', year: 'year', hour:'hour',minute:'minute',second:'second',dayOfTheWeek: 'day of the week'}
     */
    @Property({day: 'day' , month: 'month', year: 'year', hour: 'hour', minute: 'minute', second: 'second', dayOfTheWeek: 'day of the week'})
    public maskPlaceholder: MaskPlaceholderModel;

    /**
     * Triggers when popup is opened.
     *
     * @event open
     */
    @Event()
    public open: EmitType<Object>;
    /**
     * Triggers when popup is closed.
     *
     * @event close
     */
    @Event()
    public close: EmitType<Object>;
    /**
     * Triggers when datetimepicker value is cleared using clear button.
     *
     * @event cleared
     */
    @Event()
    public cleared: EmitType<ClearedEventArgs>;
    /**
     * Triggers when input loses the focus.
     *
     * @event blur
     */
    @Event()
    public blur: EmitType<Object>;
    /**
     * Triggers when input gets focus.
     *
     * @event focus
     */
    @Event()
    public focus: EmitType<Object>;
    /**
     * Triggers when DateTimePicker is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * Triggers when DateTimePicker is destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;
    /**
     * Constructor for creating the widget
     *
     * @param {DateTimePickerModel} options - Specifies the DateTimePicker model.
     * @param {string | HTMLInputElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: DateTimePickerModel, element?: string | HTMLInputElement) {
        super(options, element);
        this.dateTimeOptions = options;
    }

    private focusHandler(): void {
        if (!this.enabled) {
            return;
        }
        addClass([this.inputWrapper.container], INPUTFOCUS);
    }

    /**
     * Sets the focus to widget for interaction.
     *
     * @returns {void}
     */
    public focusIn(): void {
        super.focusIn();
    }
    /**
     * Remove the focus from widget, if the widget is in focus state.
     *
     * @returns {void}
     */
    public focusOut(): void {
        if (document.activeElement === this.inputElement) {
            this.inputElement.blur();
            removeClass([this.inputWrapper.container], [INPUTFOCUS]);
        }

    }

    protected blurHandler(e: MouseEvent): void {
        if (!this.enabled) {
            return;
        }
        // IE popup closing issue when click over the scrollbar
        if (this.isTimePopupOpen() && this.isPreventBlur) {
            this.inputElement.focus();
            return;
        }
        removeClass([this.inputWrapper.container], INPUTFOCUS);
        const blurArguments: BlurEventArgs = {
            model: this
        };
        if (this.isTimePopupOpen()) {
            this.hide(e);
        }
        this.trigger('blur', blurArguments);
    }

    /**
     * To destroy the widget.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.showClearButton) {
            this.clearButton = document.getElementsByClassName('e-clear-icon')[0] as HTMLElement;
        }
        this.hide(null);
        if (this.popupObject && this.popupObject.element.classList.contains(POPUP)) {
            this.popupObject.destroy();
            detach(this.dateTimeWrapper);
            this.dateTimeWrapper = undefined;
            this.liCollections = this.timeCollections = [];
            if (!isNullOrUndefined(this.rippleFn)) {
                this.rippleFn();
            }
        }
        const ariaAttribute: object = {
            'aria-live': 'assertive', 'aria-atomic': 'true', 'aria-invalid': 'false',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false',
            'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off'
        };
        if (this.inputElement) {
            Input.removeAttributes(<{ [key: string]: string }>ariaAttribute, this.inputElement);
        }
        if (this.isCalendar()) {
            if (this.popupWrapper) {
                detach(this.popupWrapper);
            }
            this.popupObject = this.popupWrapper = null;
            this.keyboardHandler.destroy();
        }
        this.unBindInputEvents();
        this.liCollections = null;
        this.rippleFn = null;
        this.selectedElement = null;
        this.listTag = null;
        this.timeIcon = null;
        this.popupObject = null;
        this.preventArgs = null;
        this.keyboardModule = null;
        Input.destroy({
            element: this.inputElement,
            floatLabelType: this.floatLabelType,
            properties: this.properties
        }, this.clearButton);
        super.destroy();
    }
    /**
     * To Initialize the control rendering.
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        this.timekeyConfigure = {
            enter: 'enter',
            escape: 'escape',
            end: 'end',
            tab: 'tab',
            home: 'home',
            down: 'downarrow',
            up: 'uparrow',
            left: 'leftarrow',
            right: 'rightarrow',
            open: 'alt+downarrow',
            close: 'alt+uparrow'
        };
        this.valueWithMinutes = null;
        this.previousDateTime = null;
        this.isPreventBlur = false;
        this.cloneElement = <HTMLElement>this.element.cloneNode(true);
        this.dateTimeFormat = this.cldrDateTimeFormat();
        this.initValue = this.value;
        if (typeof (this.min) === 'string')
        {
            this.min = this.checkDateValue(new Date((this as any).min));
        }
        if (typeof (this.max) === 'string')
        {
            this.max = this.checkDateValue(new Date((this as any).max));
        }
        if (!isNullOrUndefined(closest(this.element, 'fieldset') as HTMLFieldSetElement) && (closest(this.element, 'fieldset') as HTMLFieldSetElement).disabled) {
            this.enabled = false;
        }
        super.updateHtmlAttributeToElement();
        this.checkAttributes(false);
        const localeText: { placeholder: string } = { placeholder: this.placeholder };
        this.l10n = new L10n('datetimepicker', localeText, this.locale);
        this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        super.render();
        this.createInputElement();
        super.updateHtmlAttributeToWrapper();
        this.bindInputEvents();
        if (this.enableMask) {
            this.notify('createMask', {
                module: 'MaskedDateTime'
            });
        }
        this.setValue(true);
        if (this.enableMask && !this.value && this.maskedDateValue && (this.floatLabelType === 'Always' || !this.floatLabelType || !this.placeholder)){
            Input.setValue(this.maskedDateValue, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        this.setProperties({ scrollTo: this.checkDateValue(new Date(this.checkValue(this.scrollTo))) }, true);
        this.previousDateTime = this.value && new Date(+this.value);
        if (this.element.tagName === 'EJS-DATETIMEPICKER') {
            this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
            this.element.removeAttribute('tabindex');
            if (!this.enabled) {
                this.inputElement.tabIndex = -1;
            }
        }
        if (this.floatLabelType !== 'Never') {
            Input.calculateWidth(this.inputElement, this.inputWrapper.container);
        }
        if (!isNullOrUndefined(this.inputWrapper.buttons[0]) && !isNullOrUndefined(this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0]) && this.floatLabelType !== 'Never') {
            this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0].classList.add('e-date-time-icon');
        }
        this.renderComplete();
    }
    private setValue(isDynamic : boolean = false): void {
        this.initValue = this.validateMinMaxRange(this.value);
        if (!this.strictMode && this.isDateObject(this.initValue)) {
            const value: Date = this.validateMinMaxRange(this.initValue);
            Input.setValue(this.getFormattedValue(value), this.inputElement, this.floatLabelType, this.showClearButton);
            this.setProperties({ value: value }, true);
        } else {
            if (isNullOrUndefined(this.value)) {
                this.initValue = null;
                this.setProperties({ value: null }, true);
            }
        }
        this.valueWithMinutes = this.value;
        super.updateInput(isDynamic);
    }
    private validateMinMaxRange(value: Date): Date {
        let result: Date = value;
        if (this.isDateObject(value)) {
            result = this.validateValue(value);
        } else {
            if (+this.min > +this.max) {
                this.disablePopupButton(true);
            }
        }
        this.checkValidState(result);
        return result;
    }
    private checkValidState(value: Date): void {
        this.isValidState = true;
        if (!this.strictMode) {
            if ((+(value) > +(this.max)) || (+(value) < +(this.min))) {
                this.isValidState = false;
            }
        }
        this.checkErrorState();
    }

    private checkErrorState(): void {
        if (this.isValidState) {
            removeClass([this.inputWrapper.container], ERROR);
        } else {
            addClass([this.inputWrapper.container], ERROR);
        }
        attributes(this.inputElement, { 'aria-invalid': this.isValidState ? 'false' : 'true' });
    }
    private validateValue(value: Date): Date {
        let dateVal: Date = value;
        if (this.strictMode) {
            if (+this.min > +this.max) {
                this.disablePopupButton(true);
                dateVal = this.max;
            } else if (+value < +this.min) {
                dateVal = this.min;
            } else if (+value > +this.max) {
                dateVal = this.max;
            }
        } else {
            if (+this.min > +this.max) {
                this.disablePopupButton(true);
                dateVal = value;
            }
        }
        return dateVal;
    }
    private disablePopupButton(isDisable: boolean): void {
        if (isDisable) {
            addClass([this.inputWrapper.buttons[0], this.timeIcon], DISABLED);
            this.hide();
        } else {
            removeClass([this.inputWrapper.buttons[0], this.timeIcon], DISABLED);
        }
    }
    private getFormattedValue(value: Date): string {
        let dateOptions: object;
        if (!isNullOrUndefined(value)) {
            if (this.calendarMode === 'Gregorian') {
                dateOptions = { format: this.cldrDateTimeFormat(), type: 'dateTime', skeleton: 'yMd' };
            } else {
                dateOptions = { format: this.cldrDateTimeFormat(), type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }

            return this.globalize.formatDate(value, dateOptions);
        } else {
            return null;
        }
    }
    private isDateObject(value: Date): boolean {
        return (!isNullOrUndefined(value) && !isNaN(+value)) ? true : false;
    }
    private createInputElement(): void {
        removeClass([this.inputElement], DATEPICKERROOT);
        removeClass([this.inputWrapper.container], DATEWRAPPER);
        addClass([this.inputWrapper.container], DATETIMEWRAPPER);
        addClass([this.inputElement], ROOT);
        this.renderTimeIcon();
    }
    private renderTimeIcon(): void {
        this.timeIcon = Input.appendSpan(INPUTWRAPPER + ' ' + TIMEICON + ' ' + ICONS, this.inputWrapper.container);
    }
    private bindInputEvents(): void {
        EventHandler.add(this.timeIcon, 'mousedown', this.timeHandler, this);
        EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.dateHandler, this);
        EventHandler.add(this.inputElement, 'blur', this.blurHandler, this);
        EventHandler.add(this.inputElement, 'focus', this.focusHandler, this);
        this.defaultKeyConfigs = (extend(this.defaultKeyConfigs, this.keyConfigs) as { [key: string]: string });
        this.keyboardHandler = new KeyboardEvents(
            <HTMLElement>this.inputElement,
            {
                eventName: 'keydown',
                keyAction: this.inputKeyAction.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
    }
    private unBindInputEvents(): void {
        EventHandler.remove(this.timeIcon, 'mousedown touchstart', this.timeHandler);
        EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', this.dateHandler);
        if (this.inputElement) {
            EventHandler.remove(this.inputElement, 'blur', this.blurHandler);
            EventHandler.remove(this.inputElement, 'focus', this.focusHandler);
        }
        if (this.keyboardHandler) {
            this.keyboardHandler.destroy();
        }
    }
    private cldrTimeFormat(): string {
        let cldrTime: string;
        if (this.isNullOrEmpty(this.timeFormat)) {
            if (this.locale === 'en' || this.locale === 'en-US') {
                cldrTime = <string>(getValue('timeFormats.short', getDefaultDateObject()));
            } else {
                cldrTime = <string>(this.getCultureTimeObject(cldrData, '' + this.locale));
            }
        } else {
            cldrTime = this.timeFormat;
        }
        return cldrTime;
    }
    private cldrDateTimeFormat(): string {
        let cldrTime: string;
        const culture: Internationalization = new Internationalization(this.locale);
        const dateFormat: string = culture.getDatePattern({ skeleton: 'yMd' });
        if (this.isNullOrEmpty(this.formatString)) {
            cldrTime = dateFormat + ' ' + this.getCldrFormat('time');
        } else {
            cldrTime = this.formatString;
        }
        return cldrTime;
    }

    private getCldrFormat(type: string): string {
        let cldrDateTime: string;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrDateTime = <string>(getValue('timeFormats.short', getDefaultDateObject()));
        } else {
            cldrDateTime = <string>(this.getCultureTimeObject(cldrData, '' + this.locale));
        }
        return cldrDateTime;
    }
    private isNullOrEmpty(value: Date | string): boolean {
        if (isNullOrUndefined(value) || (typeof value === 'string' && value.trim() === '')) {
            return true;
        } else {
            return false;
        }
    }

    protected getCultureTimeObject(ld: Object, c: string): Object {
        if (this.calendarMode === 'Gregorian') {
            return getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.timeFormats.short', ld);
        } else {
            return getValue('main.' + '' + this.locale + '.dates.calendars.islamic.timeFormats.short', ld);
        }

    }
    private timeHandler(e?: MouseEvent): void {
        if (!this.enabled) {
            return;
        }
        this.isIconClicked = true;
        if (Browser.isDevice) {
            this.inputElement.setAttribute('readonly', '');
        }
        if (e.currentTarget === this.timeIcon) {
            e.preventDefault();
        }
        if (this.enabled && !this.readonly) {
            if (this.isDatePopupOpen()) {
                super.hide(e);
            }
            if (this.isTimePopupOpen()) {
                this.closePopup(e);
            } else {
                this.inputElement.focus();
                this.popupCreation('time', e);
                addClass([this.inputWrapper.container], [INPUTFOCUS]);
            }
        }
        this.isIconClicked = false;
    }

    private dateHandler(e?: MouseEvent): void {
        if (!this.enabled) {
            return;
        }
        if (e.currentTarget === this.inputWrapper.buttons[0]) {
            e.preventDefault();
        }
        if (this.enabled && !this.readonly) {
            if (this.isTimePopupOpen()) {
                this.closePopup(e);
            }
            if (!isNullOrUndefined(this.popupWrapper)) {
                this.popupCreation('date', e);
            }
        }
    }

    public show(type?: string, e?: MouseEvent | KeyboardEvent | KeyboardEventArgs): void {
        if ((this.enabled && this.readonly) || !this.enabled) {
            return;
        } else {
            if (type === 'time' && !this.dateTimeWrapper) {
                if (this.isDatePopupOpen()) {
                    this.hide(e);
                }
                this.popupCreation('time', e);
            } else if (!this.popupObj) {
                if (this.isTimePopupOpen()) {
                    this.hide(e);
                }
                super.show();
                this.popupCreation('date', e);
            }
        }
    }

    public toggle(e?: KeyboardEventArgs): void {
        if (this.isDatePopupOpen()) {
            super.hide(e);
            this.show('time', null);
        } else if (this.isTimePopupOpen()) {
            this.hide(e);
            super.show(null, e);
            this.popupCreation('date', null);
        } else {
            this.show(null, e);
        }
    }

    private listCreation(): void {
        let dateObject: Date;
        if (this.calendarMode === 'Gregorian') {
            this.cldrDateTimeFormat().replace(this.formatRegex, this.TimePopupFormat());
            if (this.dateFormatString === '') {
                this.dateFormatString = this.cldrDateTimeFormat();
            }
            dateObject = this.globalize.parseDate(this.inputElement.value, {
                format: this.dateFormatString, type: 'datetime'
            });
        } else {
            dateObject = this.globalize.parseDate(this.inputElement.value, {
                format: this.cldrDateTimeFormat(), type: 'datetime', calendar: 'islamic'
            });
        }
        const value: Date = isNullOrUndefined(this.value) ? this.inputElement.value !== '' ?
            dateObject : new Date() : this.value;
        this.valueWithMinutes = value;
        this.listWrapper = createElement('div', { className: CONTENT, attrs: { 'tabindex': '0' } });
        const min: Date = this.startTime(value);
        const max: Date = this.endTime(value);
        const listDetails: { collection: number[]; list: HTMLElement } =
            TimePickerBase.createListItems(this.createElement, min, max, this.globalize, this.cldrTimeFormat(), this.step);
        this.timeCollections = listDetails.collection;
        this.listTag = listDetails.list;
        attributes(this.listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options' });
        append([listDetails.list], this.listWrapper);
        this.wireTimeListEvents();
        const rippleModel: RippleOptions = { duration: 300, selector: '.' + LISTCLASS };
        this.rippleFn = rippleEffect(this.listWrapper, rippleModel);
        this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.listWrapper.querySelectorAll('.' + LISTCLASS);
    }

    private popupCreation(type: string, e?: KeyboardEvent | MouseEvent | Event): void {
        if (Browser.isDevice) {
            this.element.setAttribute('readonly', 'readonly');
        }
        if (type === 'date') {
            if (!this.readonly && this.popupWrapper) {
                addClass([this.popupWrapper], DATETIMEPOPUPWRAPPER);
                attributes(this.popupWrapper, { 'id': this.element.id + '_options' });
            }
        } else {
            if (!this.readonly) {
                this.dateTimeWrapper = createElement('div', {
                    className: ROOT + ' ' + POPUP,
                    attrs: { 'id': this.element.id + '_timepopup', 'style': 'visibility:hidden ; display:block' }
                });
                if (!isNullOrUndefined(this.cssClass)) {
                    this.dateTimeWrapper.className += ' ' + this.cssClass;
                }
                if (!isNullOrUndefined(this.step) && this.step > 0) {
                    this.listCreation();
                    append([this.listWrapper], this.dateTimeWrapper);
                }
                document.body.appendChild(this.dateTimeWrapper);
                this.addTimeSelection();
                this.renderPopup();
                this.setTimeScrollPosition();
                this.openPopup(e);
                if (!Browser.isDevice || (Browser.isDevice && !this.fullScreenMode)) {
                    this.popupObject.refreshPosition(this.inputElement);
                }
                if (Browser.isDevice) {
                    this.modelWrapper.style.zIndex = (this.popupObject.zIndex - 1).toString();
                    if (this.fullScreenMode) {
                        this.dateTimeWrapper.style.left = '0px';
                    }
                }

            }
        }
    }
    private openPopup(e: KeyboardEvent | MouseEvent | Event): void {
        this.preventArgs = {
            cancel: false,
            popup: this.popupObject,
            event: e || null
        };
        const eventArgs: PopupObjectArgs = this.preventArgs;
        this.trigger('open', eventArgs, (eventArgs: PopupObjectArgs) => {
            this.preventArgs = eventArgs;
            if (!this.preventArgs.cancel && !this.readonly) {
                const openAnimation: AnimationModel = {
                    name: 'FadeIn',
                    duration: ANIMATIONDURATION
                };
                if (this.zIndex === 1000) {
                    this.popupObject.show(new Animation(openAnimation), this.element);
                } else {
                    this.popupObject.show(new Animation(openAnimation), null);
                }
                addClass([this.inputWrapper.container], [ICONANIMATION]);
                attributes(this.inputElement, { 'aria-expanded': 'true' });
                attributes(this.inputElement, {  'aria-owns': this.inputElement.id + '_options'});
                attributes(this.inputElement, {  'aria-controls': this.inputElement.id});
                EventHandler.add(document, 'mousedown touchstart', this.documentClickHandler, this);
            }
        });
    }
    private documentClickHandler(event: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>event.target;
        if ((!isNullOrUndefined(this.popupObject) && (this.inputWrapper.container.contains(target) && event.type !== 'mousedown' ||
            (this.popupObject.element && this.popupObject.element.contains(target)))) && event.type !== 'touchstart') {
            event.preventDefault();
        }
        if (!(closest(target, '[id="' + (this.popupObject && this.popupObject.element.id + '"]'))) && target !== this.inputElement
            && target !== this.timeIcon && !isNullOrUndefined(this.inputWrapper) && target !== this.inputWrapper.container && !target.classList.contains('e-dlg-overlay')) {
            if (this.isTimePopupOpen()) {
                this.hide(event);
                this.focusOut();
            }
        } else if (target !== this.inputElement) {
            if (!Browser.isDevice) {
                this.isPreventBlur = ((document.activeElement === this.inputElement) && (Browser.isIE || Browser.info.name === 'edge')
                    && target === this.popupObject.element);
            }
        }
    }
    private isTimePopupOpen(): boolean {
        return (this.dateTimeWrapper && this.dateTimeWrapper.classList.contains('' + ROOT)) ? true : false;
    }
    private isDatePopupOpen(): boolean {
        return (this.popupWrapper && this.popupWrapper.classList.contains('' + DATETIMEPOPUPWRAPPER)) ? true : false;
    }
    private renderPopup(): void {
        this.containerStyle = this.inputWrapper.container.getBoundingClientRect();
        if (Browser.isDevice) {
            this.timeModal = createElement('div');
            this.timeModal.className = '' + ROOT + ' e-time-modal';
            document.body.className += ' ' + OVERFLOW;
            this.timeModal.style.display = 'block';
            document.body.appendChild(this.timeModal);
        }
        if(Browser.isDevice){
            this.modelWrapper = createElement('div', { className: 'e-datetime-mob-popup-wrap' });
            this.modelWrapper.appendChild(this.dateTimeWrapper);
            const dlgOverlay: HTMLElement = createElement('div', { className: 'e-dlg-overlay'});
            dlgOverlay.style.zIndex = (this.zIndex - 1).toString();
            this.modelWrapper.appendChild(dlgOverlay);
            document.body.appendChild(this.modelWrapper);
        }
        const offset: number = 4;
        this.popupObject = new Popup(this.dateTimeWrapper as HTMLElement, {
            width: this.setPopupWidth(),
            zIndex: this.zIndex,
            targetType: 'container',
            collision: Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            relateTo: Browser.isDevice ? document.body : this.inputWrapper.container,
            position: Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            enableRtl: this.enableRtl,
            offsetY: offset,
            open: () => {
                this.dateTimeWrapper.style.visibility = 'visible';
                addClass([this.timeIcon], ACTIVE);
                if (!Browser.isDevice) {
                    this.timekeyConfigure = (extend(this.timekeyConfigure, this.keyConfigs) as { [key: string]: string });
                    this.inputEvent = new KeyboardEvents(
                        this.inputWrapper.container, {
                            keyAction: this.timeKeyActionHandle.bind(this),
                            keyConfigs: this.timekeyConfigure,
                            eventName: 'keydown'
                        });
                }
            }, close: () => {
                removeClass([this.timeIcon], ACTIVE);
                this.unWireTimeListEvents();
                this.inputElement.removeAttribute('aria-activedescendant');
                remove(this.popupObject.element);
                this.popupObject.destroy();
                this.dateTimeWrapper.innerHTML = '';
                if(this.modelWrapper){
                    remove(this.modelWrapper); 
                }
                this.listWrapper = this.dateTimeWrapper = undefined;
                if (this.inputEvent) {
                    this.inputEvent.destroy();
                }
            }, targetExitViewport: () => {
                if (!Browser.isDevice) {
                    this.hide();
                }
            }
        });
        if (Browser.isDevice && this.fullScreenMode){
            this.popupObject.element.style.maxHeight = '100%';
            this.popupObject.element.style.width = '100%';
        } else {
            this.popupObject.element.style.maxHeight = POPUPDIMENSION;
        }

        if (Browser.isDevice && this.fullScreenMode) {
            const modelHeader: HTMLElement = this.createElement('div', { className: 'e-model-header' });
            const modelTitleSpan: HTMLElement = this.createElement('span', { className: 'e-model-title' });
            modelTitleSpan.textContent = 'Select time';
            const modelCloseIcon: HTMLElement = this.createElement('span', { className: 'e-popup-close' });
            EventHandler.add(modelCloseIcon, 'mousedown touchstart', this.dateTimeCloseHandler, this);
            modelHeader.appendChild(modelCloseIcon);
            modelHeader.appendChild(modelTitleSpan);
            this.dateTimeWrapper.insertBefore(modelHeader, this.dateTimeWrapper.firstElementChild);
        }
    }

    private dateTimeCloseHandler(e: MouseEvent| TouchEvent): void {
        this.hide();
    }

    private setDimension(width: number | string): string {
        if (typeof width === 'number') {
            width = formatUnit(width);
        } else if (typeof width === 'string') {
            // eslint-disable-next-line no-self-assign
            width = width;
        } else {
            width = '100%';
        }
        return width;
    }
    private setPopupWidth(): string {
        let width: string = this.setDimension(this.width);
        if (width.indexOf('%') > -1) {
            const inputWidth: number = this.containerStyle.width * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    }
    protected wireTimeListEvents(): void {
        EventHandler.add(this.listWrapper, 'click', this.onMouseClick, this);
        if (!Browser.isDevice) {
            EventHandler.add(this.listWrapper, 'mouseover', this.onMouseOver, this);
            EventHandler.add(this.listWrapper, 'mouseout', this.onMouseLeave, this);
        }
    }
    protected unWireTimeListEvents(): void {
        if (this.listWrapper) {
            EventHandler.remove(this.listWrapper, 'click', this.onMouseClick);
            EventHandler.remove(document, 'mousedown touchstart', this.documentClickHandler);
            if (!Browser.isDevice) {
                EventHandler.add(this.listWrapper, 'mouseover', this.onMouseOver, this);
                EventHandler.add(this.listWrapper, 'mouseout', this.onMouseLeave, this);
            }
        }
    }
    private onMouseOver(event: MouseEvent): void {
        const currentLi: HTMLElement = <HTMLElement>closest(<Element>event.target, '.' + LISTCLASS);
        this.setTimeHover(currentLi, HOVER);
    }
    private onMouseLeave(): void {
        this.removeTimeHover(HOVER);
    }
    private setTimeHover(li: HTMLElement, className: string): void {
        if (this.enabled && this.isValidLI(li) && !li.classList.contains(className)) {
            this.removeTimeHover(className);
            addClass([li], className);
        }
    }
    protected getPopupHeight(): number {
        const height: number = parseInt(<string>POPUPDIMENSION, 10);
        const popupHeight: number = this.dateTimeWrapper.getBoundingClientRect().height;
        if ( Browser.isDevice && this.fullScreenMode){
            return popupHeight;
        } else {
            return popupHeight > height ? height : popupHeight;
        }
    }
    protected changeEvent(e: Event): void {
        super.changeEvent(e);
        if ((this.value && this.value.valueOf()) !== (this.previousDateTime && +this.previousDateTime.valueOf())) {
            this.valueWithMinutes = this.value;
            this.setInputValue('date');
            this.previousDateTime = this.value && new Date(+this.value);
        }
    }
    private updateValue(e: KeyboardEvent | MouseEvent): void {
        this.setInputValue('time');
        if (+this.previousDateTime !== +this.value) {
            this.changedArgs = {
                value: this.value, event: e || null,
                isInteracted: !isNullOrUndefined(e),
                element: this.element
            };
            this.addTimeSelection();
            this.trigger('change', this.changedArgs);
            this.previousDateTime = this.previousDate = this.value;
        }
    }
    private setTimeScrollPosition(): void {
        const popupElement: HTMLElement = this.selectedElement;
        if (!isNullOrUndefined(popupElement)) {
            this.findScrollTop(popupElement);
        } else if (this.dateTimeWrapper && this.checkDateValue(this.scrollTo)) {
            this.setScrollTo();
        }
    }
    private findScrollTop(element: HTMLElement): void {
        const listHeight: number = this.getPopupHeight();
        const nextElement: Element = element.nextElementSibling;
        const height: number = nextElement ? (<HTMLElement>nextElement).offsetTop : element.offsetTop;
        const lineHeight: number = element.getBoundingClientRect().height;
        if ((height + element.offsetTop) > listHeight) {
            if (Browser.isDevice && this.fullScreenMode){
                const listContent: Element = this.dateTimeWrapper.querySelector('.e-content');
                listContent.scrollTop = nextElement ? (height - (listHeight / HALFPOSITION + lineHeight / HALFPOSITION)) : height;
            } else {
                this.dateTimeWrapper.scrollTop = nextElement ? (height - (listHeight / HALFPOSITION + lineHeight / HALFPOSITION)) : height;
            }
        } else {
            this.dateTimeWrapper.scrollTop = 0;
        }
    }
    private setScrollTo(): void {
        let element: HTMLElement;
        const items: HTMLElement[] = <NodeListOf<HTMLLIElement> & HTMLElement[]>this.dateTimeWrapper.querySelectorAll('.' + LISTCLASS);
        if (items.length >= 0) {
            this.scrollInvoked = true;
            const initialTime: number = this.timeCollections[0];
            const scrollTime: number = this.getDateObject(this.checkDateValue(this.scrollTo)).getTime();
            element = items[Math.round((scrollTime - initialTime) / (this.step * 60000))];
        } else {
            this.dateTimeWrapper.scrollTop = 0;
        }
        if (!isNullOrUndefined(element)) {
            this.findScrollTop(element);
        } else {
            this.dateTimeWrapper.scrollTop = 0;
        }
    }
    private setInputValue(type: string): void {
        if (type === 'date') {
            this.inputElement.value = this.previousElementValue = this.getFormattedValue(this.getFullDateTime());
            this.setProperties({ value: this.getFullDateTime() }, true);
        } else {
            const tempVal: string = this.getFormattedValue(new Date(this.timeCollections[this.activeIndex]));
            Input.setValue(tempVal, this.inputElement, this.floatLabelType, this.showClearButton);
            this.previousElementValue = this.inputElement.value;
            this.setProperties({ value: new Date(this.timeCollections[this.activeIndex]) }, true);
            if (this.enableMask)
            {
                this.createMask();
            }
        }
        this.updateIconState();
    }
    private getFullDateTime(): Date {
        let value: Date = null;
        if (this.isDateObject(this.valueWithMinutes)) {
            value = this.combineDateTime(this.valueWithMinutes);
        } else {
            value = this.previousDate;
        }
        return this.validateMinMaxRange(value);
    }
    private createMask(): void {
        this.notify('createMask', {
            module: 'MaskedDateTime'
        });
    }
    private combineDateTime(value: Date): Date {
        if (this.isDateObject(value)) {
            const day: number = this.previousDate.getDate();
            const month: number = this.previousDate.getMonth();
            const year: number = this.previousDate.getFullYear();
            const hour: number = value.getHours();
            const minutes: number = value.getMinutes();
            const seconds: number = value.getSeconds();
            return new Date(year, month, day, hour, minutes, seconds);
        } else {
            return this.previousDate;
        }
    }
    private onMouseClick(event: MouseEvent): void {
        const target: Element = <Element>event.target;
        const li: HTMLElement = this.selectedElement = <HTMLElement>closest(target, '.' + LISTCLASS);
        if (li && li.classList.contains(LISTCLASS)) {
            this.timeValue = li.getAttribute('data-value');
            this.hide(event);
        }
        this.setSelection(li, event);
    }
    private setSelection(li: HTMLElement, event: MouseEvent): void {
        if (this.isValidLI(li) && !li.classList.contains(ACTIVE)) {
            this.selectedElement = li;
            const index: number = Array.prototype.slice.call(this.liCollections).indexOf(li);
            this.activeIndex = index;
            this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
            addClass([this.selectedElement], ACTIVE);
            this.selectedElement.setAttribute('aria-selected', 'true');
            this.updateValue(event);
        }
    }
    private setTimeActiveClass(): void {
        const collections: HTMLElement = isNullOrUndefined(this.dateTimeWrapper) ? this.listWrapper : this.dateTimeWrapper;
        if (!isNullOrUndefined(collections)) {
            const items: HTMLElement[] = <NodeListOf<HTMLLIElement> & HTMLElement[]>collections.querySelectorAll('.' + LISTCLASS);
            if (items.length) {
                for (let i: number = 0; i < items.length; i++) {
                    if (this.timeCollections[i as number] === +(this.valueWithMinutes)) {
                        items[i as number].setAttribute('aria-selected', 'true');
                        this.selectedElement = items[i as number];
                        this.activeIndex = i;
                        this.setTimeActiveDescendant();
                        break;
                    }
                }
            }
        }
    }
    private setTimeActiveDescendant(): void {
        if (!isNullOrUndefined(this.selectedElement) && this.value) {
            attributes(this.inputElement, { 'aria-activedescendant': this.selectedElement.getAttribute('id') });
        } else {
            this.inputElement.removeAttribute('aria-activedescendant');
        }
    }
    protected addTimeSelection(): void {
        this.selectedElement = null;
        this.removeTimeSelection();
        this.setTimeActiveClass();
        if (!isNullOrUndefined(this.selectedElement)) {
            addClass([this.selectedElement], ACTIVE);
            this.selectedElement.setAttribute('aria-selected', 'true');
        }
    }
    protected removeTimeSelection(): void {
        this.removeTimeHover(HOVER);
        if (!isNullOrUndefined(this.dateTimeWrapper)) {
            const items: Element[] = <NodeListOf<Element> & Element[]>this.dateTimeWrapper.querySelectorAll('.' + ACTIVE);
            if (items.length) {
                removeClass(items, ACTIVE);
                items[0].removeAttribute('aria-selected');
            }
        }
    }
    protected removeTimeHover(className: string): void {
        const hoveredItem: Element[] = this.getTimeHoverItem(className);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, className);
        }
    }
    protected getTimeHoverItem(className: string): Element[] {
        const collections: HTMLElement = isNullOrUndefined(this.dateTimeWrapper) ? this.listWrapper : this.dateTimeWrapper;
        let hoveredItem: Element[];
        if (!isNullOrUndefined(collections)) {
            hoveredItem = <NodeListOf<HTMLLIElement> & Element[]>collections.querySelectorAll('.' + className);
        }
        return hoveredItem;
    }
    protected isValidLI(li: Element | HTMLElement): boolean {
        return (li && li.classList.contains(LISTCLASS) && !li.classList.contains(DISABLED));
    }
    private calculateStartEnd(value: Date, range: boolean, method: string): Date {
        const day: number = value.getDate();
        const month: number = value.getMonth();
        const year: number = value.getFullYear();
        const hours: number = value.getHours();
        const minutes: number = value.getMinutes();
        const seconds: number = value.getSeconds();
        const milliseconds: number = value.getMilliseconds();
        if (range) {
            if (method === 'starttime') {
                return new Date(year, month, day, 0, 0, 0);
            } else {
                return new Date(year, month, day, 23, 59, 59);
            }
        } else {
            return new Date(year, month, day, hours, minutes, seconds, milliseconds);
        }
    }
    private startTime(date: Date): Date {
        let tempStartValue: Date;
        let start: boolean;
        const tempMin: Date = this.min;
        const value: Date = date === null ? new Date() : date;
        if ((+value.getDate() === +tempMin.getDate() && +value.getMonth() === +tempMin.getMonth() &&
            +value.getFullYear() === +tempMin.getFullYear()) || ((+new Date(value.getFullYear(), value.getMonth(), value.getDate())) <=
                +new Date(tempMin.getFullYear(), tempMin.getMonth(), tempMin.getDate()))) {
            start = false;
            tempStartValue = this.min;
        } else if (+value < +this.max && +value > +this.min) {
            start = true;
            tempStartValue = value;
        } else if (+value >= +this.max) {
            start = true;
            tempStartValue = this.max;
        }
        return this.calculateStartEnd(tempStartValue, start, 'starttime');
    }

    private TimePopupFormat(): any {
        let format: string = '';
        let formatCount: number = 0;
        const proxy: DateTimePicker = null || this;

        /**
         * Formats the value specifier.
         *
         * @param {string} formattext - The format text.
         * @returns {string} The formatted value specifier.
         */
        function formatValueSpecifier(formattext: string): string {
            switch (formattext) {
            case 'd':
            case 'dd':
            case 'ddd':
            case 'dddd':
            case 'M':
            case 'MM':
            case 'MMM':
            case 'MMMM':
            case 'y':
            case 'yy':
            case 'yyy':
            case 'yyyy':
                if (format === '') {
                    format = format + formattext;
                }
                else {
                    format = format + '/' + formattext;
                }
                formatCount = formatCount + 1;
                break;
            }
            if (formatCount > 2) {
                proxy.dateFormatString = format;
            }
            return format;
        }
        return formatValueSpecifier;
    }

    private endTime(date: Date): Date {
        let tempEndValue: Date;
        let end: boolean;
        const tempMax: Date = this.max;
        const value: Date = date === null ? new Date() : date;
        if ((+value.getDate() === +tempMax.getDate() && +value.getMonth() === +tempMax.getMonth() &&
            +value.getFullYear() === +tempMax.getFullYear()) || (+new Date(value.getUTCFullYear(), value.getMonth(), value.getDate()) >=
                +new Date(tempMax.getFullYear(), tempMax.getMonth(), tempMax.getDate()))) {
            end = false;
            tempEndValue = this.max;
        } else if (+value < +this.max && +value > +this.min) {
            end = true;
            tempEndValue = value;
        } else if (+value <= +this.min) {
            end = true;
            tempEndValue = this.min;
        }
        return this.calculateStartEnd(tempEndValue, end, 'endtime');
    }
    public hide(e?: KeyboardEvent | MouseEvent | Event): void {
        if (this.popupObj || this.dateTimeWrapper) {
            this.preventArgs = {
                cancel: false,
                popup: this.popupObj || this.popupObject,
                event: e || null
            };
            const eventArgs: PopupObjectArgs = this.preventArgs;
            if (isNullOrUndefined(this.popupObj)) {
                this.trigger('close', eventArgs, (eventArgs: PopupObjectArgs) => {
                    this.dateTimeCloseEventCallback(e, eventArgs);
                });
            } else {
                this.dateTimeCloseEventCallback(e, eventArgs);
            }
        } else {
            if (Browser.isDevice && this.allowEdit && !this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
            this.setAllowEdit();
        }
    }
    private dateTimeCloseEventCallback(e?: KeyboardEvent | MouseEvent | Event, eventArgs?: PopupObjectArgs): void {
        this.preventArgs = eventArgs;
        if (!this.preventArgs.cancel) {
            if (this.isDatePopupOpen()) {
                super.hide(e);
            } else if (this.isTimePopupOpen()) {
                this.closePopup(e);
                removeClass([document.body], OVERFLOW);
                if (Browser.isDevice && this.timeModal) {
                    this.timeModal.style.display = 'none';
                    this.timeModal.outerHTML = '';
                    this.timeModal = null;
                }
                this.setTimeActiveDescendant();
            }
        }
        if (Browser.isDevice && this.allowEdit && !this.readonly) {
            this.inputElement.removeAttribute('readonly');
        }
        this.setAllowEdit();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private closePopup(e?: KeyboardEvent | MouseEvent | Event): void {
        if (this.isTimePopupOpen() && this.popupObject) {
            const animModel: AnimationModel = {
                name: 'FadeOut',
                duration: ANIMATIONDURATION,
                delay: 0
            };
            this.popupObject.hide(new Animation(animModel));
            this.inputWrapper.container.classList.remove(ICONANIMATION);
            attributes(this.inputElement, { 'aria-expanded': 'false' });
            this.inputElement.removeAttribute('aria-owns');
            this.inputElement.removeAttribute('aria-controls');
            EventHandler.remove(document, 'mousedown touchstart', this.documentClickHandler);
        }
    }
    protected preRender(): void {
        this.checkFormat();
        this.dateTimeFormat = this.cldrDateTimeFormat();
        super.preRender();
        removeClass([this.inputElementCopy], [ROOT]);
    }
    protected getProperty(date: DateTimePickerModel, val: string): void {
        if (val === 'min') {
            this.setProperties({ min: this.validateValue(date.min) }, true);
        } else {
            this.setProperties({ max: this.validateValue(date.max) }, true);
        }
    }

    protected checkAttributes(isDynamic: boolean): void {
        const attributes: string[] = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['style', 'name', 'step', 'disabled', 'readonly', 'value', 'min', 'max', 'placeholder', 'type'];
        let value: Date;
        for (const prop of attributes) {
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                case 'name':
                    this.inputElement.setAttribute('name', this.inputElement.getAttribute(prop));
                    break;
                case 'step':
                    this.step = parseInt(this.inputElement.getAttribute(prop), 10);
                    break;
                case 'readonly':
                    if (( isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['readonly'] === undefined)) || isDynamic) {
                        const readonly: boolean = this.inputElement.getAttribute(prop) === 'disabled' ||
                                this.inputElement.getAttribute(prop) === '' ||
                                this.inputElement.getAttribute(prop) === 'true' ? true : false;
                        this.setProperties({ readonly: readonly }, !isDynamic);
                    }
                    break;
                case 'placeholder':
                    if (( isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['placeholder'] === undefined)) || isDynamic) {
                        this.setProperties({ placeholder: this.inputElement.getAttribute(prop) }, !isDynamic);
                    }
                    break;
                case 'min':
                    if (( isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['min'] === undefined)) || isDynamic) {
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!this.isNullOrEmpty(value) && !isNaN(+value)) {
                            this.setProperties({ min: value }, !isDynamic);
                        }
                    }
                    break;
                case 'disabled':
                    if (( isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['enabled'] === undefined)) || isDynamic) {
                        const enabled: boolean = this.inputElement.getAttribute(prop) === 'disabled' ||
                                this.inputElement.getAttribute(prop) === 'true' ||
                                this.inputElement.getAttribute(prop) === '' ? false : true;
                        this.setProperties({ enabled: enabled }, !isDynamic);
                    }
                    break;
                case 'value':
                    if (( isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['value'] === undefined)) || isDynamic) {
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!this.isNullOrEmpty(value) && !isNaN(+value)) {
                            this.setProperties({ value: value }, !isDynamic);
                        }
                    }
                    break;
                case 'max':
                    if (( isNullOrUndefined(this.dateTimeOptions) || (this.dateTimeOptions['max'] === undefined)) || isDynamic) {
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!this.isNullOrEmpty(value) && !isNaN(+value)) {
                            this.setProperties({ max: value }, !isDynamic);
                        }
                    }
                    break;
                }
            }
        }
    }

    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.calendarMode === 'Islamic') {
            modules.push({ args: [this], member: 'islamic', name: 'Islamic' });
        }
        if (this.enableMask)
        {
            modules.push(this.maskedDateModule());
        }

        return modules;
    }

    private maskedDateModule(): ModuleDeclaration
    {
        const modules: ModuleDeclaration = {args: [this], member: 'MaskedDateTime'};
        return modules;
    }

    private getTimeActiveElement(): HTMLElement[] {
        if (!isNullOrUndefined(this.dateTimeWrapper)) {
            return <NodeListOf<HTMLElement> & HTMLElement[]>this.dateTimeWrapper.querySelectorAll('.' + ACTIVE);
        } else {
            return null;
        }
    }
    protected createDateObj(val: Date | string): Date {
        return val instanceof Date ? val : null;
    }
    private getDateObject(text: string | Date): Date {
        if (!this.isNullOrEmpty(text)) {
            const dateValue: Date = this.createDateObj(text);
            const value: Date = this.valueWithMinutes;
            const status: boolean = !isNullOrUndefined(value);
            if (this.checkDateValue(dateValue)) {
                const date: number = status ? value.getDate() : DAY;
                const month: number = status ? value.getMonth() : MONTH;
                const year: number = status ? value.getFullYear() : YEAR;
                const hour: number = status ? value.getHours() : HOUR;
                const minute: number = status ? value.getMinutes() : MINUTE;
                const second: number = status ? value.getSeconds() : SECOND;
                const millisecond: number = status ? value.getMilliseconds() : MILLISECOND;
                if (!this.scrollInvoked) {
                    return new Date(year, month, date, hour, minute, second, millisecond);
                } else {
                    this.scrollInvoked = false;
                    return new Date(
                        year, month, date, dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds(), dateValue.getMilliseconds()
                    );
                }
            }
        }
        return null;
    }
    protected findNextTimeElement(event: KeyboardEventArgs): void {
        const textVal: string = (this.inputElement).value;
        const value: Date = isNullOrUndefined(this.valueWithMinutes) ? this.createDateObj(textVal) :
            this.getDateObject(this.valueWithMinutes);
        let dateTimeVal: number = null;
        const listCount: number = this.liCollections.length;
        if (!isNullOrUndefined(this.activeIndex) || !isNullOrUndefined(this.checkDateValue(value))) {
            if (event.action === 'home') {
                dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[0])));
                this.activeIndex = 0;
            } else if (event.action === 'end') {
                dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[this.timeCollections.length - 1])));
                this.activeIndex = this.timeCollections.length - 1;
            } else {
                if (event.action === 'down') {
                    for (let i: number = 0; i < listCount; i++) {
                        if (+value < this.timeCollections[i as number]) {
                            dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[i as number])));
                            this.activeIndex = i;
                            break;
                        }
                    }
                } else {
                    for (let i: number = listCount - 1; i >= 0; i--) {
                        if (+value > this.timeCollections[i as number]) {
                            dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[i as number])));
                            this.activeIndex = i;
                            break;
                        }
                    }
                }
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            this.timeElementValue(isNullOrUndefined(dateTimeVal) ? null : new Date(dateTimeVal));
        }
    }

    protected setTimeValue(date: Date, value: Date): Date {
        let dateString: string;
        let time: Date;
        const val: string | Date = this.validateMinMaxRange(value);
        const newval: Date = this.createDateObj(val);
        if (this.getFormattedValue(newval) !== (!isNullOrUndefined(this.value) ? this.getFormattedValue(this.value) : null)) {
            this.valueWithMinutes = isNullOrUndefined(newval) ? null : newval;
            time = new Date(+this.valueWithMinutes);
        } else {
            if (this.strictMode) {
                //for strict mode case, when value not present within a range. Reset the nearest range value.
                date = newval;
            }
            this.valueWithMinutes = this.checkDateValue(date);
            time = new Date(+this.valueWithMinutes);
        }
        if (this.calendarMode === 'Gregorian') {
            dateString = this.globalize.formatDate(time, {
                format: !isNullOrUndefined(this.formatString) ? this.formatString : this.cldrDateTimeFormat(),
                type: 'dateTime', skeleton: 'yMd'
            });
        } else {
            dateString = this.globalize.formatDate(time, {
                format: !isNullOrUndefined(this.formatString) ? this.formatString : this.cldrDateTimeFormat(),
                type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
            });
        }

        if (!this.strictMode && isNullOrUndefined(time)) {
            Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
        } else {
            Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        return time;
    }
    protected timeElementValue(value: Date): Date {
        if (!isNullOrUndefined(this.checkDateValue(value)) && !this.isNullOrEmpty(value)) {
            const date: Date = value instanceof Date ? value : this.getDateObject(value);
            return this.setTimeValue(date, value);
        }
        return null;
    }
    protected timeKeyHandler(event: KeyboardEventArgs): void {
        if (isNullOrUndefined(this.step) || this.step <= 0) {
            return;
        }
        const listCount: number = this.timeCollections.length;
        if (isNullOrUndefined(this.getTimeActiveElement()) || this.getTimeActiveElement().length === 0) {
            if (this.liCollections.length > 0) {
                if (isNullOrUndefined(this.value) && isNullOrUndefined(this.activeIndex)) {
                    this.activeIndex = 0;
                    this.selectedElement = this.liCollections[0];
                    this.timeElementValue(new Date(this.timeCollections[0]));
                } else {
                    this.findNextTimeElement(event);
                }
            }
        } else {
            let nextItemValue: number;
            if ((event.keyCode >= 37) && (event.keyCode <= 40)) {
                let index: number = (event.keyCode === 40 || event.keyCode === 39) ? ++this.activeIndex : --this.activeIndex;
                this.activeIndex = index = this.activeIndex === (listCount) ? 0 : this.activeIndex;
                this.activeIndex = index = this.activeIndex < 0 ? (listCount - 1) : this.activeIndex;
                nextItemValue = isNullOrUndefined(this.timeCollections[index as number]) ?
                    this.timeCollections[0] : this.timeCollections[index as number];
            } else if (event.action === 'home') {
                this.activeIndex = 0;
                nextItemValue = this.timeCollections[0];
            } else if (event.action === 'end') {
                this.activeIndex = listCount - 1;
                nextItemValue = this.timeCollections[listCount - 1];
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            this.timeElementValue(new Date(nextItemValue));
        }
        this.isNavigate = true;
        this.setTimeHover(this.selectedElement, NAVIGATION);
        this.setTimeActiveDescendant();
        if (this.isTimePopupOpen() && this.selectedElement !== null && (!event || event.type !== 'click')) {
            this.setTimeScrollPosition();
        }
    }
    protected timeKeyActionHandle(event: KeyboardEventArgs): void {
        if (this.enabled) {
            if (event.action !== 'right' && event.action !== 'left' && event.action !== 'tab') {
                event.preventDefault();
            }
            switch (event.action) {
            case 'up':
            case 'down':
            case 'home':
            case 'end':
                this.timeKeyHandler(event);
                break;
            case 'enter':
                if (this.isNavigate) {
                    this.selectedElement = this.liCollections[this.activeIndex];
                    this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
                    this.setInputValue('time');
                    if (+ this.previousDateTime !== +this.value) {
                        this.changedArgs.value = this.value;
                        this.addTimeSelection();
                        this.previousDateTime = this.value;
                    }
                } else {
                    this.updateValue(event);
                }
                this.hide(event);
                addClass([this.inputWrapper.container], INPUTFOCUS);
                this.isNavigate = false;
                event.stopPropagation();
                break;
            case 'escape':
                this.hide(event);
                break;
            default:
                this.isNavigate = false;
                break;
            }
        }
    }
    protected inputKeyAction(event: KeyboardEventArgs): void {
        switch (event.action) {
        case 'altDownArrow':
            this.strictModeUpdate();
            this.updateInput();
            this.toggle(event);
            break;
        }
    }
    /**
     * Called internally if any of the property value changed.
     *
     * @param {DateTimePickerModel} newProp - Returns the dynamic property value of the component.
     * @param {DateTimePickerModel} oldProp - Returns the previous property value of the component.
     * @returns {void}
     * @deprecated
     */
    public onPropertyChanged(newProp: DateTimePickerModel, oldProp: DateTimePickerModel): void {
        for (const prop of Object.keys(newProp)) {
            const openPopup = ['blur', 'change', 'cleared', 'close', 'created', 'destroyed', 'focus', 'navigated', 'open', 'renderDayCell'];
            if (openPopup.indexOf(prop) > 0 && this.isReact) {
                this.isDynamicValueChanged = true;
            }
            switch (prop) {
            case 'value':
                this.isDynamicValueChanged = true;
                this.invalidValueString = null;
                this.checkInvalidValue(newProp.value);
                newProp.value = this.value;
                newProp.value = this.validateValue(newProp.value);
                if (this.enableMask){
                    Input.setValue(this.maskedDateValue, this.inputElement, this.floatLabelType, this.showClearButton);
                }
                else {
                    Input.setValue(this.getFormattedValue(newProp.value), this.inputElement, this.floatLabelType, this.showClearButton);
                }
                this.valueWithMinutes = newProp.value;
                this.setProperties({ value: newProp.value }, true);
                if (this.popupObj) {
                    this.popupUpdate();
                }
                this.previousDateTime = new Date(this.inputElement.value);
                this.updateInput();
                this.changeTrigger(null);
                this.preventChange = this.isAngular && this.preventChange ? !this.preventChange : this.preventChange;
                if (this.enableMask && this.value) {
                    this.notify('createMask', {
                        module: 'MaskedDateTime'
                    });
                }
                break;
            case 'min':
            case 'max':
                this.getProperty(newProp, prop);
                this.updateInput();
                break;
            case 'enableRtl':
                Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
                break;
            case 'cssClass':
                if (!isNullOrUndefined(oldProp.cssClass)) {
                    oldProp.cssClass = (oldProp.cssClass.replace(/\s+/g, ' ')).trim();
                }
                if (!isNullOrUndefined(newProp.cssClass)) {
                    newProp.cssClass = (newProp.cssClass.replace(/\s+/g, ' ')).trim();
                }
                Input.setCssClass(newProp.cssClass, [this.inputWrapper.container], oldProp.cssClass);
                if (this.dateTimeWrapper) {
                    Input.setCssClass(newProp.cssClass, [this.dateTimeWrapper], oldProp.cssClass);
                }
                break;
            case 'locale':
                this.globalize = new Internationalization(this.locale);
                this.l10n.setLocale(this.locale);
                if (this.dateTimeOptions && this.dateTimeOptions.placeholder == null) {
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    Input.setPlaceholder(this.l10n.getConstant('placeholder'), this.inputElement);
                }
                this.dateTimeFormat = this.cldrDateTimeFormat();
                super.updateInput();
                break;
            case 'htmlAttributes':
                this.updateHtmlAttributeToElement();
                this.updateHtmlAttributeToWrapper();
                this.checkAttributes(true);
                break;
            case 'format':
                this.setProperties({ format: newProp.format }, true);
                this.checkFormat();
                this.dateTimeFormat = this.formatString;
                this.setValue();
                if (this.enableMask) {
                    this.notify('createMask', {
                        module: 'MaskedDateTime'
                    });
                    if (!this.value)
                    {
                        Input.setValue(this.maskedDateValue, this.inputElement, this.floatLabelType, this.showClearButton);
                    }
                }
                break;
            case 'placeholder':
                Input.setPlaceholder(newProp.placeholder, this.inputElement);
                break;
            case 'enabled':
                Input.setEnabled(this.enabled, this.inputElement);
                if (this.enabled) {
                    this.inputElement.setAttribute('tabindex', this.tabIndex);
                } else {
                    this.inputElement.tabIndex = -1;
                }
                break;
            case 'strictMode':
                this.invalidValueString = null;
                this.updateInput();
                break;
            case 'width':
                this.setWidth(newProp.width);
                Input.calculateWidth(this.inputElement, this.inputWrapper.container);
                if (!isNullOrUndefined(this.inputWrapper.buttons[0]) && !isNullOrUndefined(this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0]) && this.floatLabelType !== 'Never') {
                    this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0].classList.add('e-date-time-icon');
                }
                break;
            case 'readonly':
                Input.setReadonly(this.readonly, this.inputElement);
                break;
            case 'floatLabelType':
                this.floatLabelType = newProp.floatLabelType;
                Input.removeFloating(this.inputWrapper);
                Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                if (!isNullOrUndefined(this.inputWrapper.buttons[0]) && !isNullOrUndefined(this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0]) && this.floatLabelType !== 'Never') {
                    this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0].classList.add('e-date-time-icon');
                }
                break;
            case 'scrollTo':
                if (this.checkDateValue(new Date(this.checkValue(newProp.scrollTo)))) {
                    if (this.dateTimeWrapper) {
                        this.setScrollTo();
                    }
                    this.setProperties({ scrollTo: this.checkDateValue(new Date(this.checkValue(newProp.scrollTo))) }, true);
                } else {
                    this.setProperties({ scrollTo: null }, true);
                }
                break;
            case 'enableMask':
                if (this.enableMask) {
                    this.notify('createMask', {
                        module: 'MaskedDateTime'
                    });
                    Input.setValue(this.maskedDateValue, this.inputElement, this.floatLabelType, this.showClearButton);
                }
                else
                {
                    if (this.inputElement.value === this.maskedDateValue)
                    {
                        this.maskedDateValue = '';
                        Input.setValue(this.maskedDateValue, this.inputElement, this.floatLabelType, this.showClearButton);
                    }
                }
                break;
            default:
                super.onPropertyChanged(newProp, oldProp);
                break;
            }
            if (!this.isDynamicValueChanged) {
                this.hide(null);
            }
            this.isDynamicValueChanged = false;
        }
    }
    /**
     * To get component name.
     *
     * @returns {string} Returns the component name.
     * @private
     */
    protected getModuleName(): string {
        return 'datetimepicker';
    }
    protected restoreValue(): void {
        this.previousDateTime = this.previousDate;
        this.currentDate = this.value ? this.value : new Date();
        this.valueWithMinutes = this.value;
        this.previousDate = this.value;
        this.previousElementValue = this.previousElementValue = (isNullOrUndefined(this.inputValueCopy)) ? '' :
            this.getFormattedValue(this.inputValueCopy);
    }
}
