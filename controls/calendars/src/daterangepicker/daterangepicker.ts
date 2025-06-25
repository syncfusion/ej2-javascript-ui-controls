// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='../calendar/calendar-model.d.ts'/>
import { Property, EventHandler, Internationalization, NotifyPropertyChanges, detach, getUniqueID } from '@syncfusion/ej2-base';
import { KeyboardEvents, BaseEventArgs, KeyboardEventArgs, Event, EmitType, Browser, L10n, ChildProperty } from '@syncfusion/ej2-base';
import { addClass, createElement, remove, closest, select, prepend, removeClass, attributes, Collection } from '@syncfusion/ej2-base';
import { isNullOrUndefined, isUndefined, formatUnit, setValue, rippleEffect, merge, extend, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';
import { CalendarView, CalendarBase, NavigatedEventArgs, RenderDayCellEventArgs, CalendarType } from '../calendar/calendar';
import { Popup } from '@syncfusion/ej2-popups';
import { Button } from '@syncfusion/ej2-buttons';
import { BlurEventArgs, FocusEventArgs, ClearedEventArgs } from '../calendar/calendar';
import { Input, InputObject, FloatLabelType } from '@syncfusion/ej2-inputs';
import { ListBase} from '@syncfusion/ej2-lists';
import { PresetsModel, DateRangePickerModel } from './daterangepicker-model';

const DATERANGEWRAPPER: string = 'e-date-range-wrapper';
const INPUTCONTAINER: string = 'e-input-group';
const DATERANGEICON: string = 'e-input-group-icon e-range-icon e-icons';
const POPUP: string = 'e-popup';
const LEFTCALENDER: string = 'e-left-calendar';
const RIGHTCALENDER: string = 'e-right-calendar';
const LEFTCONTAINER: string = 'e-left-container';
const RIGHTCONTAINER: string = 'e-right-container';
const ROOT: string = 'e-daterangepicker';
const LIBRARY: string = 'e-lib';
const CONTROL: string = 'e-control';
const ERROR: string = 'e-error';
const ACTIVE: string = 'e-active';
const STARTENDCONTAINER: string = 'e-start-end';
const STARTDATE: string = 'e-start-date';
const ENDDATE: string = 'e-end-date';
const STARTBUTTON: string = 'e-start-btn';
const INPUTFOCUS: string = 'e-input-focus';
const ENDBUTTON: string = 'e-end-btn';
const RANGEHOVER: string = 'e-range-hover';
const OTHERMONTH: string = 'e-other-month';
const STARTLABEL: string = 'e-start-label';
const ENDLABEL: string = 'e-end-label';
const DISABLED: string = 'e-disabled';
const SELECTED: string = 'e-selected';
const CALENDAR: string = 'e-calendar';
const NEXTICON: string = 'e-next';
const PREVICON: string = 'e-prev';
const HEADER: string = 'e-header';
const TITLE: string = 'e-title';
const ICONCONTAINER: string = 'e-icon-container';
const RANGECONTAINER: string = 'e-date-range-container';
const RANGEHEADER: string = 'e-range-header';
const PRESETS: string = 'e-presets';
const FOOTER: string = 'e-footer';
const RANGEBORDER: string = 'e-range-border';
const TODAY: string = 'e-today';
const FOCUSDATE: string = 'e-focused-date';
const CONTENT: string = 'e-content';
const DAYSPAN: string = 'e-day-span';
const WEEKNUMBER: string = 'e-week-number';
const DATEDISABLED: string = 'e-date-disabled';
const ICONDISABLED: string = 'e-icon-disabled';
const CALENDARCONTAINER: string = 'e-calendar-container';
const SEPARATOR: string = 'e-separator';
const APPLY: string = 'e-apply';
const CANCEL: string = 'e-cancel';
const DEVICE: string = 'e-device';
const OVERLAY: string = 'e-overlay';
const CHANGEICON: string = 'e-change-icon e-icons';
const LISTCLASS: string = 'e-list-item';
const RTL: string = 'e-rtl';
const HOVER: string = 'e-hover';
const OVERFLOW: string = 'e-range-overflow';
const OFFSETVALUE: number = 4;
const PRIMARY: string = 'e-primary';
const FLAT: string = 'e-flat';
const CSS: string = 'e-css';
const ZOOMIN: string = 'e-zoomin';
const NONEDITABLE: string = 'e-non-edit';
const DAYHEADERLONG: string = 'e-daterange-day-header-lg';
const HIDDENELEMENT: string = 'e-daterange-hidden';
const wrapperAttr: string[] = ['title', 'class', 'style'];

export class Presets extends ChildProperty<Presets> {
    /**
     * Defines the label string of the preset range.
     */
    @Property()
    public label: string;
    /**
     * Defines the start date of the preset range.
     */
    @Property()
    public start: Date;
    /**
     * Defines the end date of the preset range
     */
    @Property()
    public end: Date;
}

export interface DateRange {
    /** Defines the start date */
    start?: Date
    /** Defines the end date */
    end?: Date
}
export interface RangeEventArgs extends BaseEventArgs {
    /**
     * Defines the value
     */
    value?: Date[] | DateRange
    /** Defines the value string in the input element */
    text?: string
    /** Defines the start date  */
    startDate?: Date
    /** Defines the end date  */
    endDate?: Date
    /** Defines the day span between the range */
    daySpan?: number
    /** Specifies the element. */
    element?: HTMLElement | HTMLInputElement
    /**
     * Specifies the original event arguments.
     */
    event?: MouseEvent | KeyboardEvent | TouchEvent | Event
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted?: boolean
}

export interface RangePopupEventArgs {

    /** Defines the range string in the input element */
    date: string
    /** Defines the DateRangePicker model */
    model: DateRangePickerModel

    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel?: boolean

    /**
     * Defines the DateRangePicker popup object.
     *
     * @deprecated
     */
    popup?: Popup

    /**
     * Specifies the original event arguments.
     */

    event?: MouseEvent | KeyboardEvent | Event
    /**
     * Specifies the node to which the popup element to be appended.
     */
    appendTo?: HTMLElement
}

export interface RangeFormatObject {
    /**
     * Specifies the format in which the date format will process
     */
    skeleton?: string
}

/**
 * Represents the DateRangePicker component that allows user to select the date range from the calendar
 * or entering the range through the input element.
 * ```html
 * <input id="daterangepicker"/>
 * ```
 * ```typescript
 * <script>
 *   var dateRangePickerObj = new DateRangePicker({ startDate: new Date("05/07/2017"), endDate: new Date("10/07/2017") });
 *   dateRangePickerObj.appendTo("#daterangepicker");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class DateRangePicker extends CalendarBase {
    private popupObj: Popup;
    private inputWrapper: InputObject;
    private popupWrapper: HTMLElement;
    private rightCalendar: HTMLElement;
    private leftCalendar: HTMLElement;
    private deviceCalendar: HTMLElement;
    private leftCalCurrentDate: Date;
    private initStartDate: Date;
    private initEndDate: Date;
    private startValue: Date;
    private endValue: Date;
    private modelValue: Date[] | DateRange;
    private rightCalCurrentDate: Date;
    private leftCalPrevIcon: HTMLElement;
    private leftCalNextIcon: HTMLElement;
    private leftTitle: HTMLElement;
    private rightTitle: HTMLElement;
    private rightCalPrevIcon: HTMLElement;
    private rightCalNextIcon: HTMLElement;
    private inputKeyboardModule: KeyboardEvents;
    protected leftKeyboardModule: KeyboardEvents;
    protected rightKeyboardModule: KeyboardEvents;
    private previousStartValue: Date;
    private previousEndValue: Date;
    private applyButton: Button;
    private cancelButton: Button;
    private startButton: Button;
    private endButton: Button;
    private cloneElement: HTMLElement;
    private l10n: L10n;
    private isCustomRange: boolean = false;
    private isCustomWindow: boolean = false;
    private presetsItem: { [key: string]: Object }[] = [];
    private liCollections: HTMLElement[] = [];
    private activeIndex: number;
    private presetElement: HTMLElement;
    private previousEleValue: string = '';
    private targetElement: HTMLElement;
    private disabledDayCnt: number;
    private angularTag: string;
    private inputElement: HTMLInputElement;
    private modal: HTMLElement;
    private firstHiddenChild: HTMLInputElement;
    private secondHiddenChild: HTMLInputElement;
    private isKeyPopup: boolean = false;
    private dateDisabled: boolean = false;
    private navNextFunction: Function;
    private navPrevFunction: Function;
    private deviceNavNextFunction: Function;
    private deviceNavPrevFunction: Function;
    private isRangeIconClicked: boolean = false;
    private isMaxDaysClicked: boolean = false;
    private popupKeyboardModule: KeyboardEvents;
    private presetKeyboardModule: KeyboardEvents;
    private btnKeyboardModule: KeyboardEvents;
    private virtualRenderCellArgs: RenderDayCellEventArgs;
    private disabledDays: Date[] = [];
    private isMobile: boolean;
    private keyInputConfigs: { [key: string]: string };
    private defaultConstant: Object;
    private preventBlur: boolean = false;
    private preventFocus: boolean = false;
    private valueType: Date[] | DateRange;
    private closeEventArgs: RangePopupEventArgs;
    private openEventArgs: RangePopupEventArgs;
    private controlDown: KeyboardEventArgs;
    private startCopy: Date;
    private endCopy: Date;
    private formElement: Element;
    private formatString: string;
    private inputFormatsString: string[];
    protected tabIndex: string;
    private invalidValueString: string = null;
    private dateRangeOptions: DateRangePickerModel;
    private mobileRangePopupWrap: HTMLElement;
    protected preventChange: boolean = false;
    protected touchRangeModule: Touch;
    protected touchRangeStart: boolean;
    protected iconRangeRight: string;
    protected clearButton: HTMLElement;

    /**
     * Gets or sets the start and end date of the Calendar.
     * {% codeBlock src='daterangepicker/value/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public value: Date[] | DateRange;


    /**
     * Enable or disable the persisting component's state between the page reloads. If enabled, following list of states will be persisted.
     * 1. startDate
     * 2. endDate
     * 3. value
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Gets or sets the minimum date that can be selected in the calendar-popup.
     *
     * @default new Date(1900, 00, 01)
     */
    @Property(new Date(1900, 0, 1))
    public min: Date;
    /**
     * Gets or sets the maximum date that can be selected in the calendar-popup.
     *
     * @default new Date(2099, 11, 31)
     */
    @Property(new Date(2099, 11, 31))
    public max: Date;
    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     *
     * @default 'en-US'
     */
    @Property(null)
    public locale: string;
    /**
     * Gets or sets the Calendar's first day of the week. By default, the first day of the week will be based on the current culture.
     * > For more details about firstDayOfWeek refer to
     * [`First day of week`](../../daterangepicker/customization#first-day-of-week) documentation.
     *
     * @default null
     */
    @Property(null)
    public firstDayOfWeek: number;
    /**
     * Determines whether the week number of the Calendar is to be displayed or not.
     * The week number is displayed in every week row.
     * > For more details about weekNumber refer to
     * [`Calendar with week number`](../../calendar/how-to/render-the-calendar-with-week-numbers)documentation.
     *
     * @default false
     */
    @Property(false)
    public weekNumber: boolean;
    /**
     * Gets or sets the Calendar's Type like gregorian or islamic.
     *
     * @default Gregorian
     * @private
     */
    @Property('Gregorian')
    public calendarMode: CalendarType;
    /**
     * By default, the popup opens while clicking on the daterangepicker icon.
     * If you want to open the popup while focusing the daterange input then specify its value as true.
     *
     * @default false
     */
    @Property(false)
    public openOnFocus : boolean;
    /**
     * Specifies the component popup display full screen in mobile devices.
     *
     * @default false
     */
    @Property(false)
    public fullScreenMode : boolean;
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
     * Triggers when the Calendar value is changed.
     *
     * @event change
     */
    @Event()
    public change: EmitType<RangeEventArgs>;

    /**
     * Triggers when daterangepicker value is cleared using clear button.
     *
     * @event cleared
     */
    @Event()
    public cleared: EmitType<ClearedEventArgs>;
    /**
     * Triggers when the Calendar is navigated to another view or within the same level of view.
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
     * Gets or sets the start date of the date range selection.
     *
     * @default null
     */
    @Property(null)
    public startDate: Date;
    /**
     * Gets or sets the end date of the date range selection.
     *
     * @default null
     */
    @Property(null)
    public endDate: Date;
    /**
     * Set the predefined ranges which let the user pick required range easily in a component.
     * > For more details refer to
     * [`Preset Ranges`](../../daterangepicker/customization#preset-ranges) documentation.
     * {% codeBlock src='daterangepicker/presets/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Collection<PresetsModel>([{}], Presets)
    public presets: PresetsModel[];
    /**
     * Specifies the width of the DateRangePicker component.
     *
     * @default ''
     */
    @Property('')
    public width: number | string;
    /**
     * specifies the z-index value of the dateRangePicker popup element.
     *
     * @default 1000
     * @aspType int
     */
    @Property(1000)
    public zIndex: number;

    /**
     * Specifies whether to show or hide the clear icon
     *
     * @default true
     */
    @Property(true)
    public showClearButton: boolean;
    /**
     * Specifies whether the today button is to be displayed or not.
     *
     * @default true
     * @hidden
     */
    @Property(true)
    public showTodayButton: boolean;
    /**
     * Specifies the initial view of the Calendar when it is opened.
     * With the help of this property, initial view can be changed to year or decade view.
     *
     * @default Month
     */
    @Property('Month')
    public start: CalendarView;
    /**
     * Sets the maximum level of view (month, year, decade) in the Calendar.
     * Depth view should be smaller than the start view to restrict its view navigation.
     *
     * @default Month
     */
    @Property('Month')
    public depth: CalendarView;


    /**
     *  Sets the root CSS class to the DateRangePicker which allows you to customize the appearance.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Sets or gets the string that used between the start and end date string.
     *
     * @default '-'
     */
    @Property('-')
    public separator: string;
    /**
     *  Specifies the minimum span of days that can be allowed in date range selection.
     * > For more details refer to
     * [`Range Span`](../../daterangepicker/range-restriction/#range-span) documentation.
     *
     * @default null
     * @aspType int
     */
    @Property(null)
    public minDays: number;
    /**
     *  Specifies the maximum span of days that can be allowed in a date range selection.
     * > For more details refer to
     * [`Range Span`](../../daterangepicker/range-restriction/#range-span) documentation.
     *
     * @default null
     * @aspType int
     */
    @Property(null)
    public maxDays: number;
    /**
     * Specifies the component to act as strict which allows entering only a valid date range in a DateRangePicker.
     * > For more details refer to
     * [`Strict Mode`](../../daterangepicker/range-restriction#strict-mode)documentation.
     *
     * @default false
     */
    @Property(false)
    public strictMode: boolean;
    /**    
     * Customizes the key actions in DateRangePicker.
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
     * enter<br/></td><td colSpan=1 rowSpan=1>
     * enter<br/></td></tr>
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
     * {% codeBlock src='daterangepicker/keyConfigs/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public keyConfigs: { [key: string]: string };
    /**
     * Sets or gets the required date format to the start and end date string.
     * > For more details refer to
     * [`Format`](https://ej2.syncfusion.com/demos/#/material/daterangepicker/format.html)sample.
     *
     * @aspType string
     * {% codeBlock src='daterangepicker/format/index.md' %}{% endcodeBlock %}
     * @default null
     */
    @Property(null)
    public format: string | RangeFormatObject;
    /**
     * Specifies an array of acceptable date input formats for parsing user input.
     *
     * @default null
     * @aspType string[]
     */
    @Property(null)
    public inputFormats: string[] | RangeFormatObject[];
    /**
     * Specifies the component to be disabled which prevents the DateRangePicker from user interactions.
     *
     * @default true
     */
    @Property(true)
    public enabled: boolean;
    /**
     * Denies the editing the ranges in the DateRangePicker component.
     *
     * @default false
     */
    @Property(false)
    public readonly: boolean;
    /**
     * > Support for `allowEdit` has been provided from
     * [`v16.2.46`](https://ej2.syncfusion.com/angular/documentation/release-notes/16.2.46/#daterangepicker).
     *
     * Specifies whether the input textbox is editable or not. Here the user can select the value from the
     * popup and cannot edit in the input textbox.
     *
     * @default true
     */
    @Property(true)
    public allowEdit: boolean;

    /**
     * Specifies the placeholder text to be floated.
     * Possible values are:
     * Never: The label will never float in the input when the placeholder is available.
     * Always: The floating label will always float above the input.
     * Auto: The floating label will float above the input after focusing or entering a value in the input.
     *
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     */
    @Property('Never')
    public floatLabelType: FloatLabelType | string;
    /**
     * Specifies the placeholder text that need to be displayed in the DateRangePicker component.
     *
     * @default null
     */
    @Property(null)
    public placeholder: string;
    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * {% codeBlock src='daterangepicker/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };
    /**
     * Triggers when the DateRangePicker is opened.
     *
     * @event open
     */
    @Event()
    public open: EmitType<Object>;

    /**
     * Triggers when the DateRangePicker is closed.
     *
     * @event close
     */
    @Event()
    public close: EmitType<Object>;
    /**
     * Triggers on selecting the start and end date.
     *
     * @event select
     */
    @Event()
    public select: EmitType<Object>;
    /**
     *  Triggers when the control gets focus.
     *
     * @event focus
     */
    @Event()
    public focus: EmitType<FocusEventArgs>;
    /**
     * Triggers when the control loses the focus.
     *
     * @event blur
     */
    @Event()
    public blur: EmitType<BlurEventArgs>;
    /**
     * Constructor for creating the widget
     *
     * @param {DateRangePickerModel} options - Specifies the DateRangePicker model.
     * @param {string | HTMLInputElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: DateRangePickerModel, element?: string | HTMLInputElement) {
        super(options, element);
        this.dateRangeOptions = options;
    }
    /**
     * To Initialize the control rendering.
     *
     * @returns {void}
     * @private
     */
    protected render(): void {
        this.initialize();
        this.setProperties({ startDate: this.startValue }, true);
        this.setProperties({ endDate: this.endValue }, true);
        this.setModelValue();
        this.setDataAttribute(false);
        if (this.element.hasAttribute('data-val')) {
            this.element.setAttribute('data-val', 'false');
        }
        if (this.floatLabelType !== 'Never') {
            Input.calculateWidth(this.inputElement, this.inputWrapper.container);
        }
        if (!isNullOrUndefined(this.inputWrapper.buttons[0]) && !isNullOrUndefined(this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0]) && this.floatLabelType !== 'Never') {
            this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0].classList.add('e-icon');
        }
        if (!isNullOrUndefined(closest(this.element, 'fieldset') as HTMLFieldSetElement) && (closest(this.element, 'fieldset') as HTMLFieldSetElement).disabled) {
            this.enabled = false;
        }
        this.renderComplete();
    }
    /**
     * Initialize the event handler
     *
     * @returns {void}
     * @private
     */
    protected preRender(): void {
        this.keyInputConfigs = {
            altDownArrow: 'alt+downarrow',
            escape: 'escape',
            enter: 'enter',
            tab: 'tab',
            altRightArrow: 'alt+rightarrow',
            altLeftArrow: 'alt+leftarrow',
            moveUp: 'uparrow',
            moveDown: 'downarrow',
            spacebar: 'space'
        };
        this.defaultConstant = {
            placeholder: this.placeholder,
            startLabel: 'Start Date',
            endLabel: 'End Date',
            customRange: 'Custom Range',
            applyText: 'Apply',
            cancelText: 'Cancel',
            selectedDays: 'Selected Days',
            days: 'days'
        };
        /**
         * Mobile View
         */
        this.isMobile = (Browser.isDevice) ? true : window.matchMedia('(max-width:550px)').matches;
        this.inputElement = <HTMLInputElement>this.element;
        this.angularTag = null;
        if (this.element.tagName === 'EJS-DATERANGEPICKER') {
            this.angularTag = this.element.tagName;
            this.inputElement = <HTMLInputElement>this.createElement('input');
            this.element.appendChild(this.inputElement);
        }
        this.cloneElement = <HTMLElement>this.element.cloneNode(true);
        removeClass([this.cloneElement], [ROOT, CONTROL, LIBRARY]);
        this.updateHtmlAttributeToElement();
        if (this.element.getAttribute('id')) {
            if (this.angularTag !== null) {
                this.inputElement.id = this.element.getAttribute('id') + '_input';
            }
        } else {
            this.element.id = getUniqueID('ej2-datetimepicker');
            if (this.angularTag !== null) {
                attributes(this.inputElement, { 'id': this.element.id + '_input' });
            }
        }
        this.checkInvalidRange(this.value);
        if (!this.invalidValueString && (typeof (this.value) === 'string')) {
            const rangeArray: string[] = (<string>this.value).split(' ' + this.separator + ' ');
            this.value = [new Date(rangeArray[0]), new Date(rangeArray[1])];
        }
        this.initProperty();
        if (this.inputFormats) {
            this.checkInputFormats();
        }
        this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
        this.element.removeAttribute('tabindex');
        super.preRender();
        this.navNextFunction = this.navNextMonth.bind(this);
        this.navPrevFunction = this.navPrevMonth.bind(this);
        this.deviceNavNextFunction = this.deviceNavNext.bind(this);
        this.deviceNavPrevFunction = this.deviceNavPrevious.bind(this);
        this.initStartDate = this.checkDateValue(this.startValue);
        this.initEndDate = this.checkDateValue(this.endValue);
        this.formElement = closest(this.element, 'form');
    }

    private updateValue(): void {
        if (this.value && (<Date[]>this.value).length > 0) {
            if ((<Date[]>this.value)[0] instanceof Date && !isNaN(+(<Date[]>this.value)[0])) {
                this.setProperties({ startDate: (<Date[]>this.value)[0] }, true);
                this.startValue = (<Date[]>this.value)[0];
            } else if (typeof (<Date[]>this.value)[0] === 'string') {
                if (+(<Date[]>this.value)[0] === 0 || isNaN(+(new Date(this.checkValue((<Date[]>this.value)[0]))))) {
                    this.startValue = null;
                    this.setValue();
                } else {
                    this.setProperties({ startDate: new Date(this.checkValue((<Date[]>this.value)[0])) }, true);
                    this.startValue = new Date(this.checkValue((<Date[]>this.value)[0]));
                }
            } else {
                this.startValue = null;
                this.setValue();
            }
            if ((<Date[]>this.value)[1] instanceof Date && !isNaN(+(<Date[]>this.value)[1])) {
                this.setProperties({ endDate: (<Date[]>this.value)[1] }, true);
                this.endValue = (<Date[]>this.value)[1];
            } else if (typeof (<Date[]>this.value)[1] === 'string') {
                if (+(<Date[]>this.value)[0] === 0 || isNaN(+(new Date(this.checkValue((<Date[]>this.value)[0]))))) {
                    this.setProperties({ endDate: null }, true);
                    this.endValue = null;
                    this.setValue();
                } else {
                    this.setProperties({ endDate: new Date(this.checkValue((<Date[]>this.value)[1])) }, true);
                    this.endValue = new Date(this.checkValue((<Date[]>this.value)[1]));
                    this.setValue();
                }
            } else {
                this.setProperties({ endDate: null }, true);
                this.endValue = null;
                this.setValue();
            }
        } else if (this.value && (<DateRange>this.value).start) {
            if ((<DateRange>this.value).start instanceof Date && !isNaN(+(<DateRange>this.value).start)) {
                this.setProperties({ startDate: (<DateRange>this.value).start }, true);
                this.startValue = (<DateRange>this.value).start;
            } else if (typeof (<DateRange>this.value).start === 'string') {
                this.setProperties({ startDate: new Date(this.checkValue((<DateRange>this.value).start)) }, true);
                this.startValue = new Date(this.checkValue((<DateRange>this.value).start));
            } else {
                this.startValue = null;
                this.setValue();
            }
            if ((<DateRange>this.value).end instanceof Date && !isNaN(+(<DateRange>this.value).end)) {
                this.setProperties({ endDate: (<DateRange>this.value).end }, true);
                this.endValue = (<DateRange>this.value).end;
            } else if (typeof (<DateRange>this.value).end === 'string') {
                this.setProperties({ endDate: new Date(this.checkValue((<DateRange>this.value).end)) }, true);
                this.endValue = new Date(this.checkValue((<DateRange>this.value).end));
                this.setValue();
            } else {
                this.setProperties({ endDate: null }, true);
                this.endValue = null;
                this.setValue();
            }
        } else if (isNullOrUndefined(this.value)) {
            this.endValue = this.checkDateValue(new Date(this.checkValue(this.endDate)));
            this.startValue = this.checkDateValue(new Date(this.checkValue(this.startDate)));
            this.setValue();
        }
    }
    private initProperty(): void {
        this.globalize = new Internationalization(this.locale);
        this.checkFormat();
        this.checkView();
        if (isNullOrUndefined(this.firstDayOfWeek) || this.firstDayOfWeek > 6 || this.firstDayOfWeek < 0) {
            this.setProperties({ firstDayOfWeek: this.globalize.getFirstDayOfWeek() }, true);
        }
        this.updateValue();
    }
    protected checkFormat(): void {
        if (this.format) {
            if (typeof this.format === 'string') {
                this.formatString = this.format;
            } else if (this.format.skeleton !== '' && !isNullOrUndefined(this.format.skeleton)) {
                const skeletonString: string = this.format.skeleton;
                this.formatString = this.globalize.getDatePattern({ skeleton: skeletonString, type: 'date' });
            } else {
                this.formatString = null;
            }
        } else {
            this.formatString = null;
        }
    }
    protected checkInputFormats(): void {
        this.inputFormatsString = [];
        if (this.inputFormats) {
            for (const format of this.inputFormats) {
                let formatString: string = '';
                if (typeof format === 'string') {
                    formatString = format;
                } else if (format.skeleton !== '' && !isNullOrUndefined(format.skeleton)) {
                    const skeletonString: string = format.skeleton;
                    formatString = this.globalize.getDatePattern({ skeleton: skeletonString, type: 'date' });
                }
                if (formatString) {
                    this.inputFormatsString.push(formatString);
                }
            }
            if (this.inputFormatsString.length === 0) {
                this.inputFormatsString = null;
            }
        } else {
            this.inputFormatsString = null;
        }
    }
    private initialize(): void {
        if (this.angularTag !== null) {
            this.validationAttribute(this.element, this.inputElement);
        }
        this.checkHtmlAttributes(false);
        merge(this.defaultKeyConfigs, { shiftTab: 'shift+tab' , tab: 'tab' });
        const start: Date = this.checkDateValue(new Date(this.checkValue(this.startValue)));
        this.setProperties({ startDate: start }, true); // persist the value propeerty.
        this.setProperties({ endValue: this.checkDateValue(new Date(this.checkValue(this.endValue))) }, true);
        this.setValue();
        this.setProperties({ min: this.checkDateValue(new Date(this.checkValue(this.min))) }, true);
        this.setProperties({ max: this.checkDateValue(new Date(this.checkValue(this.max))) }, true);
        this.l10n = new L10n('daterangepicker', this.defaultConstant, this.locale);
        this.l10n.setLocale(this.locale);
        this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        this.processPresets();
        this.createInput();
        this.updateHtmlAttributeToWrapper();
        this.setRangeAllowEdit();
        this.bindEvents();
    }

    private setDataAttribute(isDynamic: boolean) : void {
        let attributes: { [key: string]: string } = {};
        if (!isDynamic) {
            for (let i: number = 0; i < this.element.attributes.length; i++) {
                attributes[this.element.attributes[i as number].name] =
                this.element.getAttribute(this.element.attributes[i as number].name);
            }
        } else {
            attributes = this.htmlAttributes;
        }
        for (const pro of Object.keys(attributes)) {
            if (pro.indexOf('data') === 0 ) {
                this.firstHiddenChild.setAttribute(pro, attributes[`${pro}`]);
                this.secondHiddenChild.setAttribute(pro, attributes[`${pro}`]);
            }
        }
    }
    private setRangeAllowEdit(): void {
        if (this.allowEdit) {
            if (!this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
        } else {
            attributes(this.inputElement, { 'readonly': '' });
        }
        this.updateClearIconState();
    }
    private updateClearIconState(): void {
        if (!this.allowEdit && this.inputWrapper && !this.readonly) {
            if (this.inputElement.value === '') {
                removeClass([this.inputWrapper.container], [NONEDITABLE]);
            } else {
                addClass([this.inputWrapper.container], [NONEDITABLE]);
            }
        } else if (this.inputWrapper) {
            removeClass([this.inputWrapper.container], [NONEDITABLE]);
        }
    }
    protected validationAttribute(element: HTMLElement, input: Element): void {
        const name: string = element.getAttribute('name') ? element.getAttribute('name') : element.getAttribute('id');
        input.setAttribute('name', name);
        element.removeAttribute('name');
        const attributes: string[] = ['required', 'aria-required', 'form'];
        for (let i: number = 0; i < attributes.length; i++) {
            if (isNullOrUndefined(element.getAttribute(attributes[i as number]))) {
                continue;
            }
            const attr: string = element.getAttribute(attributes[i as number]);
            input.setAttribute(attributes[i as number], attr);
            element.removeAttribute(attributes[i as number]);
        }
    }
    private updateHtmlAttributeToWrapper(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (const key of Object.keys(this.htmlAttributes)) {
                if (wrapperAttr.indexOf(key) > -1 ) {
                    if (key === 'class') {
                        const updatedClassValue: string = (this.htmlAttributes[`${key}`].replace(/\s+/g, ' ')).trim();
                        if (updatedClassValue !== '') {
                            addClass([this.inputWrapper.container], updatedClassValue.split(' '));
                        }
                    } else if (key === 'style') {
                        let dateRangeStyle: string = this.inputWrapper.container.getAttribute(key);
                        dateRangeStyle = !isNullOrUndefined(dateRangeStyle) ? (dateRangeStyle + this.htmlAttributes[`${key}`]) :
                            this.htmlAttributes[`${key}`];
                        this.inputWrapper.container.setAttribute(key, dateRangeStyle);
                    } else {
                        this.inputWrapper.container.setAttribute(key, this.htmlAttributes[`${key}`]);
                    }
                }
            }
        }
    }

    private updateHtmlAttributeToElement(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (const key of Object.keys(this.htmlAttributes)) {
                if (wrapperAttr.indexOf(key) < 0 ) {
                    this.inputElement.setAttribute(key, this.htmlAttributes[`${key}`]);
                }
            }
        }
    }
    private updateCssClass(cssNewClass : string, cssOldClass : string) : void {
        if (!isNullOrUndefined(cssOldClass)) {
            cssOldClass = (cssOldClass.replace(/\s+/g, ' ')).trim();
        }
        if (!isNullOrUndefined(cssNewClass)) {
            cssNewClass = (cssNewClass.replace(/\s+/g, ' ')).trim();
        }
        Input.setCssClass(cssNewClass, [this.inputWrapper.container], cssOldClass);
        if (this.popupWrapper) {
            Input.setCssClass(cssNewClass, [this.popupWrapper], cssOldClass);
        }
    }
    private processPresets(): void {
        this.presetsItem = [];
        let i: number = 0;
        if (!isNullOrUndefined(this.presets[0]) && !isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
            for (const range of this.presets) {
                const id: string = range.label.replace(/\s+/g, '') + '_' + (++i);
                if (typeof range.end === 'string') {
                    this.presetsItem.push({
                        id: id, text: range.label, end: new Date(this.checkValue(range.end)), start: new Date(this.checkValue(range.start))
                    });
                } else {
                    this.presetsItem.push({ id: id, text: range.label, start: range.start, end: range.end });
                }
            }
            const startDate: Date = isNullOrUndefined(this.startValue) ? null : new Date(+this.startValue);
            const endDate: Date = isNullOrUndefined(this.endValue) ? null : new Date(+this.endValue);
            this.presetsItem.push({ id: 'custom_range', text: this.l10n.getConstant('customRange'), start: startDate, end: endDate });
            if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
                this.isCustomRange = true;
                this.activeIndex = this.presetsItem.length - 1;
            }
        }
    }
    protected bindEvents(): void {
        EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.rangeIconHandler, this);
        EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
        EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
        EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.resetHandler, this);
        }
        if (!this.isMobile) {
            this.keyInputConfigs = (extend(this.keyInputConfigs, this.keyConfigs) as { [key: string]: string });
            this.inputKeyboardModule = new KeyboardEvents(
                this.inputElement, {
                    eventName: 'keydown',
                    keyAction: this.inputHandler.bind(this),
                    keyConfigs: this.keyInputConfigs
                });
        }
        if (this.formElement) {
            EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
        }
        if (this.enabled) {
            this.inputElement.setAttribute('tabindex', this.tabIndex);
        } else {
            this.inputElement.tabIndex = -1;
        }
    }

    private unBindEvents() : void {
        EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.rangeIconHandler);
        EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
        EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
        EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler);
        }
        if (!this.isMobile) {
            if (!isNullOrUndefined(this.inputKeyboardModule)) {
                this.inputKeyboardModule.destroy();
            }
        }
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
        this.inputElement.tabIndex = -1;
    }

    private updateHiddenInput(): void {
        if (this.firstHiddenChild && this.secondHiddenChild) {
            const format: Object = { format: this.formatString, type: 'datetime', skeleton: 'yMd' };
            if (typeof this.startDate === 'string') {
                this.startDate = this.globalize.parseDate(this.getAmPmValue(this.startDate), format);
            }
            if (typeof this.endDate === 'string') {
                this.endDate = this.globalize.parseDate(this.getAmPmValue(this.endDate), format);
            }
            this.firstHiddenChild.value = (this.startDate && this.globalize.formatDate(this.startDate, format))
                || (this.inputElement.value);
            this.secondHiddenChild.value = (this.endDate && this.globalize.formatDate(this.endDate, format)) ||
                (this.inputElement.value);
            this.dispatchEvent(this.firstHiddenChild, 'focusout');
            this.dispatchEvent(this.firstHiddenChild, 'change');
        }

    }

    private inputChangeHandler(e: MouseEvent): void {
        if (!this.enabled) {
            return;
        }
        e.stopPropagation();
        this.updateHiddenInput();
    }
    private bindClearEvent(): void {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.resetHandler, this);
        }
    }
    protected resetHandler(e: MouseEvent): void {
        if (!this.enabled) {
            return;
        }
        this.valueType = this.value;
        e.preventDefault();
        this.clear();
        const clearedArgs: ClearedEventArgs = {
            event: e
        };
        this.setProperties({ endDate: this.checkDateValue(this.endValue) }, true);
        this.setProperties({ startDate: this.checkDateValue(this.startValue) }, true);
        this.trigger('cleared', clearedArgs);
        this.changeTrigger(e);
        this.clearRange();
        this.hide(e);
        if (closest(this.element, 'form')) {
            const element: Element = this.firstHiddenChild;
            const keyupEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
    }

    private restoreValue(): void {
        this.previousEleValue = this.inputElement.value;
        this.previousStartValue = this.startValue;
        this.previousEndValue = this.endValue;
        this.valueType = null;
        this.initStartDate = this.checkDateValue(this.startValue);
        this.initEndDate = this.checkDateValue(this.endValue);
        this.setValue();
        this.setModelValue();
    }
    protected formResetHandler(e: MouseEvent): void {
        if (!this.enabled) {
            return;
        }
        if (this.formElement && (e.target === this.formElement) && !this.inputElement.disabled) {
            let val: string = this.inputElement.getAttribute('value');
            if (!isNullOrUndefined(this.startCopy)) {
                if (!isNullOrUndefined(this.value) && !isNullOrUndefined((<DateRange>this.value).start)) {
                    this.setProperties({ value: { start: this.startCopy, end: this.endCopy } }, true);
                    this.startValue = (<DateRange>this.value).start;
                    this.endValue = (<DateRange>this.value).end;
                } else {
                    this.setProperties({ value: [this.startCopy, this.endCopy] }, true);
                    this.startValue = (<Date[]>this.value)[0];
                    this.endValue = (<Date[]>this.value)[1];
                }
                this.setProperties({ startDate: this.startValue, endDate: this.endValue }, true);
            } else {
                this.setProperties({ value: null, startDate: null, endDate: null }, true);
                this.startValue = this.endValue = null;
            }

            if (this.element.tagName === 'EJS-DATERANGEPICKER') {
                this.setProperties({ value: null, startDate: null, endDate: null }, true);
                val = '';
                this.startValue = this.endValue = null;
                this.inputElement.setAttribute('value', '');
            }
            this.restoreValue();
            if (this.inputElement) {
                Input.setValue(val, this.inputElement, this.floatLabelType, this.showClearButton);
                this.errorClass();
            }
        }
    }
    private clear(): void {
        if (this.startValue !== null) {
            this.startValue = null;
        }
        if (this.endValue !== null) {
            this.endValue = null;
        }
        if (this.value && (<DateRange>this.value).start) {
            this.setProperties({ value: { start: null, end: null } }, true);
        }
        if (this.value !== null && (<Date[]>this.value).length > 0) {
            this.setProperties({ value: null }, true);
        }
        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        if (!(isNullOrUndefined(this.applyButton))) {
            this.applyButton.disabled = this.applyButton.element.disabled = true;
        }
        this.removeSelection();
    }

    private rangeIconHandler(e: MouseEvent): void {
        if (!this.enabled) {
            return;
        }
        if (this.isMobile) {
            this.inputElement.setAttribute('readonly', '');
        }
        e.preventDefault();
        this.targetElement = null;
        if (this.isPopupOpen() && document.body.contains(this.popupObj.element)) {
            this.applyFunction(e);
        } else {
            this.isRangeIconClicked = true;
            (<HTMLElement>this.inputWrapper.container.children[0]).focus();
            this.show(null, e);
            if (!this.isMobile) {
                if (!isNullOrUndefined(this.leftCalendar)) {
                    this.isRangeIconClicked = false;
                    this.calendarFocus();
                    this.isRangeIconClicked = true;
                }
            }
            addClass([this.inputWrapper.container], [INPUTFOCUS]);
        }
    }
    private checkHtmlAttributes(isDynamic: boolean): void {
        this.globalize = new Internationalization(this.locale);
        const attributes: string[] = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['startDate', 'endDate', 'minDays', 'maxDays', 'min', 'max', 'disabled', 'readonly', 'style', 'name', 'placeholder',
                'type', 'value'];
        const format: Object = { format: this.formatString, type: 'date', skeleton: 'yMd' };
        for (const prop of attributes) {
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                case 'disabled':
                    if (( isNullOrUndefined(this.dateRangeOptions) || (this.dateRangeOptions['enabled'] === undefined)) || isDynamic) {
                        const disabled: boolean = this.inputElement.getAttribute(prop) === 'disabled' ||
                            this.inputElement.getAttribute(prop) === '' || this.inputElement.getAttribute(prop) === 'true' ? true : false;
                        this.setProperties({ enabled: !disabled }, !isDynamic);
                    }
                    break;
                case 'readonly':
                    if (( isNullOrUndefined(this.dateRangeOptions) || (this.dateRangeOptions['readonly'] === undefined)) || isDynamic) {
                        const readonly: boolean = this.inputElement.getAttribute(prop) === 'readonly' ||
                        this.inputElement.getAttribute(prop) === 'true' || this.inputElement.getAttribute(prop) === '' ? true : false;
                        this.setProperties({ readonly: readonly }, !isDynamic);
                    }
                    break;
                case 'placeholder':
                    if (( isNullOrUndefined(this.dateRangeOptions) || (this.dateRangeOptions['placeholder'] === undefined)) || isDynamic) {
                        this.setProperties({ placeholder: this.inputElement.getAttribute(prop) }, !isDynamic);
                    }
                    break;
                case 'value':
                    if (( isNullOrUndefined(this.dateRangeOptions) || (this.dateRangeOptions['value'] === undefined)) || isDynamic) {
                        const value: string = this.inputElement.getAttribute(prop);
                        this.setProperties(setValue(prop, value, {}), !isDynamic);
                    }
                    break;
                case 'style':
                    this.inputElement.setAttribute('style', '' + this.inputElement.getAttribute(prop));
                    break;
                case 'min':
                    if ((isNullOrUndefined(this.min) || +this.min === +new Date(1900, 0, 1))  || isDynamic) {
                        const dateValue: Date = this.globalize.parseDate(this.getAmPmValue(this.inputElement.getAttribute(prop)), format);
                        this.setProperties(setValue(prop, dateValue, {}), !isDynamic);
                    }
                    break;
                case 'name':
                    this.inputElement.setAttribute('name', '' + this.inputElement.getAttribute(prop));
                    break;
                case 'max':
                    if ((isNullOrUndefined(this.max) || +this.max === +new Date(2099, 11, 31))  || isDynamic) {
                        const dateValue: Date = this.globalize.parseDate(this.getAmPmValue(this.inputElement.getAttribute(prop)), format);
                        this.setProperties(setValue(prop, dateValue, {}), !isDynamic);
                    }
                    break;
                case 'startDate':
                    if (isNullOrUndefined(this.startDate)) {
                        const dateValue: Date = this.globalize.parseDate(this.getAmPmValue(this.inputElement.getAttribute(prop)), format);
                        this.startValue = dateValue;
                        this.setValue();
                    }
                    break;
                case 'endDate':
                    if (isNullOrUndefined(this.endDate)) {
                        const dateValue: Date = this.globalize.parseDate(this.getAmPmValue(this.inputElement.getAttribute(prop)), format);
                        this.endValue = dateValue;
                        this.setValue();
                    }
                    break;
                case 'minDays':
                    if (isNullOrUndefined(this.minDays)) {
                        this.setProperties(setValue(prop, parseInt(this.inputElement.getAttribute(prop), 10), {}), true);
                    }
                    break;
                case 'maxDays':
                    if (isNullOrUndefined(this.maxDays)) {
                        this.setProperties(setValue(prop, parseInt(this.inputElement.getAttribute(prop), 10), {}), true);
                    }
                    break;
                case 'type':
                    if (this.inputElement.getAttribute(prop) !== 'text') {
                        this.inputElement.setAttribute('type', 'text');
                    }
                    break;
                }
            }
        }
    }

    private createPopup(): void {
        for (let i: number = 0; i < this.presetsItem.length; i++) {
            if ((i !== (this.presetsItem.length - 1)) && this.presetsItem[i as number].id === 'custom_range') {
                this.presetsItem.splice(i, 1);
            }
        }
        this.activeIndex = this.presetsItem.length - 1;
        this.isCustomRange = true;
        for (let i: number = 0; i <= this.presetsItem.length - 2; i++) {
            const startDate: Date = this.presetsItem[i as number].start as Date;
            const endDate: Date = this.presetsItem[i as number].end as Date;
            if (this.startValue && this.endValue) {
                if (startDate.getDate() === this.startValue.getDate() && startDate.getMonth() === this.startValue.getMonth() &&
                    startDate.getFullYear() === this.startValue.getFullYear() && endDate.getDate() === this.endValue.getDate() &&
                    endDate.getMonth() === this.endValue.getMonth() && endDate.getFullYear() === this.endValue.getFullYear()) {
                    this.activeIndex = i;
                    this.isCustomRange = false;
                }
            }
        }
        this.popupWrapper = createElement('div', { id: this.element.id + '_popup', className: ROOT + ' ' + POPUP });
        this.popupWrapper.setAttribute( 'aria-label', this.element.id );
        this.popupWrapper.setAttribute( 'role', 'dialog' );
        this.adjustLongHeaderWidth();
        const isPreset: boolean = (!this.isCustomRange || this.isMobile);
        if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && isPreset) {
            this.isCustomWindow = false;
            this.createPresets();
            this.listRippleEffect();
            this.renderPopup();
        } else {
            this.isCustomWindow = true;
            this.renderControl();
        }
    }
    private renderControl(): void {
        this.createControl();
        this.bindCalendarEvents();
        this.updateRange((this.isMobile ? [this.calendarElement] : [this.leftCalendar, this.rightCalendar]));
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue) &&
         !isNullOrUndefined(this.renderDayCellArgs) && this.renderDayCellArgs.isDisabled) {
            this.disabledDateRender();
        }
        this.updateHeader();
    }
    private clearCalendarEvents(): void {
        if (this.leftCalPrevIcon && this.leftCalNextIcon && this.rightCalPrevIcon && this.rightCalNextIcon) {
            EventHandler.clearEvents(this.leftCalPrevIcon);
            EventHandler.clearEvents(this.leftCalNextIcon);
            EventHandler.clearEvents(this.rightCalPrevIcon);
            EventHandler.clearEvents(this.rightCalNextIcon);
        }
    }
    private updateNavIcons(): void {
        super.iconHandler();
    }
    private calendarIconEvent(): void {
        this.clearCalendarEvents();
        if (this.leftCalPrevIcon && !this.leftCalPrevIcon.classList.contains(DISABLED)) {
            EventHandler.add(this.leftCalPrevIcon, 'mousedown', this.navPrevFunction);
        }
        if (this.leftCalNextIcon && !this.leftCalNextIcon.classList.contains(DISABLED)) {
            EventHandler.add(this.leftCalNextIcon, 'mousedown', this.navNextFunction);
        }
        if (this.rightCalPrevIcon && !this.rightCalPrevIcon.classList.contains(DISABLED)) {
            EventHandler.add(this.rightCalPrevIcon, 'mousedown', this.navPrevFunction);
        }
        if (this.rightCalNextIcon && !this.rightCalNextIcon.classList.contains(DISABLED)) {
            EventHandler.add(this.rightCalNextIcon, 'mousedown', this.navNextFunction);
        }
    }
    private bindCalendarEvents(): void {
        if (!this.isMobile) {
            this.updateNavIcons();
            this.calendarIconEvent();
            this.calendarIconRipple();
            this.headerTitleElement = <HTMLElement>this.popupObj.element.querySelector('.' + RIGHTCALENDER + ' .' + HEADER + ' .' + TITLE);
            this.headerTitleElement = <HTMLElement>this.popupObj.element.querySelector('.' + LEFTCALENDER + ' .' + HEADER + ' .' + TITLE);
            this.defaultKeyConfigs = (extend(this.defaultKeyConfigs, this.keyConfigs) as { [key: string]: string });
            this.leftKeyboardModule = new KeyboardEvents(
                <HTMLElement>this.leftCalendar,
                {
                    eventName: 'keydown',
                    keyAction: this.keyInputHandler.bind(this),
                    keyConfigs: this.defaultKeyConfigs
                });
            this.rightKeyboardModule = new KeyboardEvents(
                <HTMLElement>this.rightCalendar,
                {
                    eventName: 'keydown',
                    keyAction: this.keyInputHandler.bind(this),
                    keyConfigs: this.defaultKeyConfigs
                });
        } else {
            this.deviceCalendarEvent();
            EventHandler.add(this.startButton.element, 'click', this.deviceHeaderClick, this);
            EventHandler.add(this.endButton.element, 'click', this.deviceHeaderClick, this);
        }
        if (this.start === this.depth) {
            this.bindCalendarCellEvents();
        }
        this.removeFocusedDate();
    }
    private calendarIconRipple(): void {
        rippleEffect(this.leftCalPrevIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        rippleEffect(this.leftCalNextIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
        rippleEffect(this.rightCalPrevIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        rippleEffect(this.rightCalNextIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
    }
    private deviceCalendarEvent(): void {
        EventHandler.clearEvents(this.nextIcon);
        EventHandler.clearEvents(this.previousIcon);
        rippleEffect(this.nextIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        rippleEffect(this.previousIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
        if (this.nextIcon && !this.nextIcon.classList.contains(DISABLED)) {
            EventHandler.add(this.nextIcon, 'mousedown', this.deviceNavNextFunction);
        }
        if (this.previousIcon && !this.previousIcon.classList.contains(DISABLED)) {
            EventHandler.add(this.previousIcon, 'mousedown', this.deviceNavPrevFunction);
        }
    }
    private deviceNavNext(e: MouseEvent): void {
        const calendar: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + CALENDAR);
        this.updateDeviceCalendar(calendar);
        this.navigateNext(e);
        this.deviceNavigation();
    }
    private deviceNavPrevious(e: MouseEvent): void {
        const calendar: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + CALENDAR);
        this.updateDeviceCalendar(calendar);
        this.navigatePrevious(e);
        this.deviceNavigation();
    }
    private updateDeviceCalendar(calendar: HTMLElement): void {
        if (calendar) {
            this.previousIcon = <HTMLElement>calendar.querySelector('.' + PREVICON);
            this.nextIcon = <HTMLElement>calendar.querySelector('.' + NEXTICON);
            this.calendarElement = calendar;
            this.deviceCalendar = calendar;
            this.contentElement = <HTMLElement>calendar.querySelector('.' + CONTENT);
            this.tableBodyElement = select('.' + CONTENT + ' tbody', calendar);
            this.table = <HTMLElement>calendar.querySelector('.' + CONTENT).getElementsByTagName('table')[0];
            this.headerTitleElement = <HTMLElement>calendar.querySelector('.' + HEADER + ' .' + TITLE);
            this.headerElement = <HTMLElement>calendar.querySelector('.' + HEADER);
        }
    }
    private deviceHeaderClick(event: MouseEvent): void {
        const element: Element = <Element>event.currentTarget;
        if (element.classList.contains(STARTBUTTON) && !isNullOrUndefined(this.startValue)) {
            this.endButton.element.classList.remove(ACTIVE);
            this.startButton.element.classList.add(ACTIVE);
            const calendar: HTMLElement = <HTMLElement>this.popupObj.element.querySelector('.' + CALENDAR);
            this.updateDeviceCalendar(calendar);
            if (isNullOrUndefined(this.calendarElement.querySelector('.' + STARTDATE + ':not(.e-other-month)'))) {
                this.currentDate = new Date(+this.startValue);
                remove(this.tableBodyElement);
                this.createContentBody();
                this.deviceNavigation();
            }
            this.removeClassDisabled();
        } else if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
            this.startButton.element.classList.remove(ACTIVE);
            this.endButton.element.classList.add(ACTIVE);
            const calendar: HTMLElement = <HTMLElement>this.popupObj.element.querySelector('.' + CALENDAR);
            this.updateDeviceCalendar(calendar);
            if (isNullOrUndefined(this.calendarElement.querySelector('.' + ENDDATE + ':not(.e-other-month)'))) {
                this.currentDate = new Date(+this.endValue);
                remove(this.tableBodyElement);
                this.createContentBody();
                this.deviceNavigation();
            }
            this.updateMinMaxDays(<HTMLElement>this.popupObj.element.querySelector('.' + CALENDAR));
            this.selectableDates();
        }
    }
    private inputFocusHandler(): void {
        if (!this.enabled) {
            return;
        }
        this.preventBlur = false;
        const focusArguments: FocusEventArgs = {
            model: this
        };
        if (!this.preventFocus) {
            this.trigger('focus', focusArguments);
        }
        this.updateClearIconState();
        if (this.openOnFocus && !this.preventFocus) {
            this.preventFocus = true;
            this.show();
        } else {
            this.preventFocus = true;
        }
    }

    private inputBlurHandler(e: MouseEvent | KeyboardEvent): void {
        if (!this.enabled) {
            return;
        }
        if (!this.preventBlur) {
            const value: string = (<HTMLInputElement>this.inputElement).value;
            if (!isNullOrUndefined(this.presetsItem)) {
                if (this.presetsItem.length > 0 && this.previousEleValue !== this.inputElement.value) {
                    this.activeIndex = this.presetsItem.length - 1;
                    this.isCustomRange = true;
                }
            }
            if (!isNullOrUndefined(value) && value.trim() !== '') {
                const range: string[] = value.split(' ' + this.separator + ' ');
                if (range.length > 1) {
                    this.invalidValueString = null;
                    const dateOptions: object = { format: this.formatString, type: 'date', skeleton: 'yMd' };
                    let startDate: Date = this.globalize.parseDate(this.getAmPmValue(range[0]).trim(), dateOptions);
                    let endDate: Date = this.globalize.parseDate(this.getAmPmValue(range[1]).trim(), dateOptions);
                    if (this.start !== 'Decade' && this.start === 'Year' && this.depth !== 'Month'){
                        if (this.inputElement.defaultValue !== value){
                            endDate = this.getStartEndDate(endDate, true);
                        }
                        if (endDate >= this.max) { endDate = this.max; }
                    }
                    if (((isNullOrUndefined(startDate) || (typeof (startDate) === 'object' && isNaN(startDate.getTime()))
                        || isNullOrUndefined(endDate)) || (typeof (endDate) === 'object' && isNaN(endDate.getTime())))
                        && !isNullOrUndefined(this.inputFormatsString)) {
                        for (const format of this.inputFormatsString) {
                            const inputFormatOptions: object = { format: format, type: 'date', skeleton: 'yMd' };
                            if (isNullOrUndefined(startDate) || (typeof (startDate) === 'object' && isNaN(startDate.getTime()))) {
                                startDate = this.globalize.parseDate(this.getAmPmValue(range[0]).trim(), inputFormatOptions);
                            }
                            if (isNullOrUndefined(endDate) || (typeof (endDate) === 'object' && isNaN(endDate.getTime()))) {
                                endDate = this.globalize.parseDate(this.getAmPmValue(range[1]).trim(), inputFormatOptions);
                            }
                            if (!isNullOrUndefined(startDate) && startDate instanceof Date && !isNaN(startDate.getTime())
                                && !isNullOrUndefined(endDate) && endDate instanceof Date && !isNaN(endDate.getTime())) {
                                break;
                            }
                        }
                    }
                    if (!isNullOrUndefined(startDate) && !isNaN(+startDate) && !isNullOrUndefined(endDate) && !isNaN(+endDate)) {
                        const prevStartVal: Date = this.startValue;
                        this.startValue = startDate;
                        const prevEndVal: Date = this.endValue;
                        this.endValue = endDate;
                        this.setValue();
                        this.refreshControl();
                        if (value !== this.previousEleValue) {
                            this.changeTrigger(e);
                        }
                        if (!this.preventBlur && document.activeElement !== this.inputElement) {
                            this.preventFocus = false;
                            const blurArguments: BlurEventArgs = {
                                model: this
                            };
                            this.trigger('blur', blurArguments);
                        }
                        this.updateHiddenInput();
                        // For Mobile mode, when a value is present and choose another range and click on console
                        // when popup is open, two startvalues and end values are updated in the popup.
                        if (this.isMobile && this.isPopupOpen()) {
                            this.startValue = prevStartVal;
                            this.endValue = prevEndVal;
                        }
                        return;
                    } else {
                        if (!this.strictMode) {
                            this.startValue = null;
                            this.endValue = null;
                            this.setValue();
                        }
                    }
                } else {
                    if (!this.strictMode) {
                        this.startValue = null;
                        this.endValue = null;
                        this.setValue();
                    }
                }
            }
            if (!this.strictMode) {
                if (isNullOrUndefined(this.popupObj)) {
                    this.currentDate = null;
                }
                this.previousStartValue = this.previousEndValue = null;
                this.startValue = null;
                this.endValue = null;
                this.setValue();
            } else {
                if (!isNullOrUndefined(value) && value.trim() === '') {
                    this.startValue = null;
                    this.endValue = null;
                }
                Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
                this.updateInput();
            }
            this.errorClass();
            this.changeTrigger(e);
            if (!this.preventBlur && document.activeElement !== this.inputElement) {
                this.preventFocus = false;
                const blurArguments: BlurEventArgs = {
                    model: this
                };
                this.trigger('blur', blurArguments);
            }
        }
        this.updateHiddenInput();
    }

    private getStartEndDate(date: Date, isEnd: boolean): Date {
        if ((this.currentView() === 'Year' && !isNullOrUndefined(date)) || this.depth === 'Year') {
            return new Date(date.getFullYear(), date.getMonth() + (isEnd ? 1 : 0), isEnd ? 0 : 1);
        } else if (this.currentView() === 'Decade' && !isNullOrUndefined(date)) {
            return new Date(date.getFullYear(), isEnd ? 11 : 0, isEnd ? 31 : 1);
        } else {
            return null;
        }
    }
    private clearRange(): void {
        this.previousStartValue = this.previousEndValue = null;
        this.currentDate = null;
    }
    private errorClass(): void {
        const inputStr: string =  !isNullOrUndefined(this.inputElement.value) ? this.inputElement.value.trim() : null;
        if (((isNullOrUndefined(this.endValue) && isNullOrUndefined(this.startValue) && inputStr !== '') ||
            ((!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
                || ((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)
                || (!isNullOrUndefined(this.endValue) && +this.endValue > +this.max))
            || ((this.startValue && this.isDateDisabled(this.startValue))
                || (this.endValue && this.isDateDisabled(this.endValue)))) && inputStr !== '') {
            addClass([this.inputWrapper.container], ERROR);
            attributes(this.inputElement, { 'aria-invalid': 'true' });
        } else {
            if (this.inputWrapper) {
                removeClass([this.inputWrapper.container], ERROR);
                attributes(this.inputElement, { 'aria-invalid': 'false' });
            }
        }
    }
    private keyCalendarUpdate(isLeftCalendar: boolean, ele: HTMLElement, isRemoveFocus: boolean = true): HTMLElement {
        if (isRemoveFocus) {
            this.removeFocusedDate();
        }
        if (isLeftCalendar) {
            this.leftCalCurrentDate = new Date(+this.currentDate);
            ele = this.leftCalendar;
        } else {
            this.rightCalCurrentDate = new Date(+this.currentDate);
            ele = this.rightCalendar;
        }
        this.updateCalendarElement(ele);
        this.table.focus();
        return ele;
    }
    private navInCalendar(e: KeyboardEventArgs, isLeftCalendar: boolean, leftLimit: Date, rightLimit: Date, ele: HTMLElement): void {
        let view: number = this.getViewNumber(this.currentView());
        let date: Date;
        const min: Date = this.min;
        let max: Date;
        if (!isNullOrUndefined(this.maxDays) && this.isMaxDaysClicked && !isNullOrUndefined(this.startValue)) {
            max = new Date(new Date(+this.startValue).setDate(this.startValue.getDate() + (this.maxDays - 1)));
        } else {
            max = this.max;
        }
        switch (e.action) {
        case 'moveRight':
            date = new Date(+this.currentDate);
            this.addDay(date, 1, e, max, min);
            if (isLeftCalendar && +date === +rightLimit) {
                ele = this.keyCalendarUpdate(false, ele);
            }
            this.keyboardNavigate(1, view, e, max, min);
            this.keyNavigation(ele, e);
            break;
        case 'moveLeft':
            date = new Date(+this.currentDate);
            this.addDay(date, -1, e, max, min);
            if (!isLeftCalendar) {
                if (+date === +leftLimit) {
                    ele = this.keyCalendarUpdate(true, ele);
                }
            }
            this.keyboardNavigate(-1, view, e, max, min);
            this.keyNavigation(ele, e);
            break;
        case 'moveUp':
            if (view === 0) {
                date = new Date(+this.currentDate);
                this.addDay(date, -7, e, max, min);
                if (+date <= +leftLimit && !isLeftCalendar) {
                    ele = this.keyCalendarUpdate(true, ele);
                }
                this.keyboardNavigate(-7, view, e, max, min);
            } else {
                this.keyboardNavigate(-4, view, e, this.max, this.min); // move the current year to the previous four days.
            }
            this.keyNavigation(ele, e);
            break;
        case 'moveDown':
            if (view === 0) {
                date = new Date(+this.currentDate);
                this.addDay(date, 7, e, max, min);
                if (isLeftCalendar && +date >= +rightLimit) {
                    ele = this.keyCalendarUpdate(false, ele);
                }
                this.keyboardNavigate(7, view, e, max, min);
            } else {
                this.keyboardNavigate(4, view, e, this.max, this.min);
            }
            this.keyNavigation(ele, e);
            break;
        case 'home':
            this.currentDate = this.firstDay(this.currentDate);
            remove(this.tableBodyElement);
            if (view === 0) {
                this.renderMonths(e);
            } else if (view === 1) {
                this.renderYears(e);
            } else {
                this.renderDecades(e);
            }
            this.keyNavigation(ele, e);
            break;
        case 'end':
            this.currentDate = this.lastDay(this.currentDate, view);
            remove(this.tableBodyElement);
            if (view === 0) {
                this.renderMonths(e);
            } else if (view === 1) {
                this.renderYears(e);
            } else {
                this.renderDecades(e);
            }
            this.keyNavigation(ele, e);
            break;
        case 'tab':
            if (this.tabKeyValidation(ele, LEFTCALENDER)) {
                ele = this.keyCalendarUpdate(false, ele, false);
                this.currentDate = this.firstCellToFocus(this.rightCalendar);
                view = this.getViewNumber(this.currentView());
                this.keyboardNavigate(0, view, e, max, min);
                this.keyNavigation(ele, e);
            }
            break;
        case 'shiftTab':
            if (this.tabKeyValidation(ele, RIGHTCALENDER)) {
                ele = this.keyCalendarUpdate(true, ele, false);
                this.currentDate = this.firstCellToFocus(this.leftCalendar);
                this.keyboardNavigate(0, view, e, max, min);
                this.keyNavigation(ele, e);
            }
            break;
        }
    }
    private firstCellToFocus(calendar: HTMLElement): Date {
        const focusAbleEle: HTMLElement = this.getViewNumber(this.currentView()) === 2 ? calendar.children[1].firstElementChild.querySelector('td.e-cell:not(.e-week-number):not(.e-disabled):not(.e-other-year)') : calendar.children[1].firstElementChild.querySelector('td.e-cell:not(.e-week-number):not(.e-disabled):not(.e-other-month)');
        const focusEleID: string = focusAbleEle && focusAbleEle.id ? focusAbleEle.id.split('_')[0] : null;
        const currentFirstDay: Date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const focusDate: Date = focusEleID ? new Date(+focusEleID) : currentFirstDay;
        return focusDate;
    }
    private keyInputHandler(e: KeyboardEventArgs, value?: Date): void {
        let date: Date;
        let view: number = this.getViewNumber(this.currentView());
        const rightDateLimit: Date = new Date(this.rightCalCurrentDate.getFullYear(), this.rightCalCurrentDate.getMonth(), 1);
        const leftDateLimit: Date = new Date(this.leftCalCurrentDate.getFullYear(), this.leftCalCurrentDate.getMonth() + 1, 0);
        let ele: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + RIGHTCALENDER);
        ele = isNullOrUndefined(ele) ? this.leftCalendar : ele;
        const isLeftCalendar: boolean = ele.classList.contains(LEFTCALENDER);
        this.updateCalendarElement(ele);
        const selectedDate: Element = this.tableBodyElement.querySelector('tr td.e-selected');
        const focusedDate: Element = ele.querySelector('tr td.' + FOCUSDATE);
        const startDate: Element = ele.querySelector('tr td.' + STARTDATE);
        const endDate: Element = ele.querySelector('tr td.' + ENDDATE);
        const depthValue: number = this.getViewNumber(this.depth);
        const levelRestrict: boolean = (view === depthValue && this.getViewNumber(this.start) >= depthValue);
        const leftCalendar: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + LEFTCALENDER);
        const rightCalendar: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + RIGHTCALENDER);
        const presetElement: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + PRESETS);
        if (!isNullOrUndefined(focusedDate)) {
            // eslint-disable-next-line no-self-assign
            this.currentDate = this.currentDate;
        } else if (!isNullOrUndefined(endDate) && !this.dateDisabled) {
            this.currentDate = new Date(+this.endValue);
        } else if (!isNullOrUndefined(startDate) && !this.dateDisabled) {
            this.currentDate = new Date(+this.startValue);
        } else if (!this.dateDisabled) {
            this.currentDate.setDate(1);
        }
        this.effect = '';
        switch (e.action) {
        case 'altUpArrow':
            if (this.isPopupOpen()) {
                this.hide(e);
                this.preventFocus = true;
                this.inputElement.focus();
                addClass([this.inputWrapper.container], [INPUTFOCUS]);
            }
            break;
        case 'select':
            if (levelRestrict) {
                const element: Element = !isNullOrUndefined(focusedDate) ? focusedDate : startDate;
                if (!isNullOrUndefined(element) && !element.classList.contains(DISABLED)) {
                    this.selectRange(null, (element));
                }
            } else {
                if (!isNullOrUndefined(selectedDate) && !levelRestrict || !isNullOrUndefined(focusedDate)) {
                    if (!isNullOrUndefined(this.value)) {
                        if (this.calendarElement.classList.contains(LEFTCALENDER)) {
                            value = this.startDate;
                        } else {
                            value = this.endDate;
                        }
                    }
                    this.controlDown = e;
                    this.contentClick(null, --view, (focusedDate || selectedDate), value);
                }
            }
            e.preventDefault();
            break;
        case 'controlHome': {
            const yearDate: Date = new Date(this.currentDate.getFullYear(), 0, 1);
            if (!isLeftCalendar && +yearDate < +leftDateLimit) {
                ele = this.keyCalendarUpdate(true, ele);
            }
            super.navigateTo.call(this, 'Month', new Date(this.currentDate.getFullYear(), 0, 1));
            this.keyNavigation(ele, e);
        }
            break;
        case 'altRightArrow':
            if (!isNullOrUndefined(leftCalendar)) {
                (<HTMLElement>this.rightCalendar.children[1].firstElementChild).focus();
            } else if (!isNullOrUndefined(rightCalendar)) {
                if (!isNullOrUndefined(this.presetElement)) {
                    this.presetElement.focus();
                    this.removeFocusedDate();
                } else {
                    this.cancelButton.element.focus();
                }
            } else {
                if (!isNullOrUndefined(presetElement)) {
                    this.cancelButton.element.focus();
                }
            }
            e.preventDefault();
            break;
        case 'altLeftArrow':
            if (!isNullOrUndefined(leftCalendar)) {
                if (this.applyButton.element.disabled !== true) {
                    this.applyButton.element.focus();
                } else {
                    this.cancelButton.element.focus();
                }
            } else {
                if (!isNullOrUndefined(rightCalendar)) {
                    (<HTMLElement>this.leftCalendar.children[1].firstElementChild).focus();
                }
            }
            e.preventDefault();
            break;
        case 'controlUp':
            if (this.calendarElement.classList.contains(LEFTCALENDER)) {
                this.calendarNavigation(e, this.calendarElement);
            } else {
                this.calendarNavigation(e, this.calendarElement);
            }
            e.preventDefault();
            break;
        case 'controlDown':
            if ((!isNullOrUndefined(selectedDate) || !isNullOrUndefined(focusedDate)) && !levelRestrict) {
                if (!isNullOrUndefined(this.value)) {
                    if (this.calendarElement.classList.contains(LEFTCALENDER)) {
                        value = this.startDate;
                    } else {
                        value = this.endDate;
                    }
                }
                this.controlDown = e;
                this.contentClick(null, --view, (selectedDate || focusedDate), value);
            }
            e.preventDefault();
            break;
        case 'controlEnd': {
            const yearDate : Date = new Date(this.currentDate.getFullYear(), 11, 31);
            if (isLeftCalendar && +yearDate > +rightDateLimit) {
                ele = this.keyCalendarUpdate(false, ele);
            }
            super.navigateTo.call(this, 'Month', new Date(this.currentDate.getFullYear(), 11, 31));
            this.keyNavigation(ele, e);
        }
            break;
        case 'pageUp':
            date = new Date(+this.currentDate);
            this.addMonths(date, -1);
            if (!isLeftCalendar && +date <= +leftDateLimit) {
                ele = this.keyCalendarUpdate(true, ele);
            }
            this.addMonths(this.currentDate, -1);
            super.navigateTo.call(this, 'Month', this.currentDate);
            this.keyNavigation(ele, e);
            break;
        case 'pageDown':
            date = new Date(+this.currentDate);
            this.addMonths(date, 1);
            if (isLeftCalendar && +date >= +rightDateLimit) {
                ele = this.keyCalendarUpdate(false, ele);
            }
            this.addMonths(this.currentDate, 1);
            super.navigateTo.call(this, 'Month', this.currentDate);
            this.keyNavigation(ele, e);
            break;
        case 'shiftPageUp':
            date = new Date(+this.currentDate);
            this.addYears(date, -1);
            if (!isLeftCalendar && +date <= +leftDateLimit) {
                ele = this.keyCalendarUpdate(true, ele);
            }
            this.addYears(this.currentDate, -1);
            super.navigateTo.call(this, 'Month', this.currentDate);
            this.keyNavigation(ele, e);
            break;
        case 'shiftPageDown':
            date = new Date(+this.currentDate);
            this.addYears(date, 1);
            if (isLeftCalendar && +date >= +rightDateLimit) {
                ele = this.keyCalendarUpdate(false, ele);
            }
            this.addYears(this.currentDate, 1);
            super.navigateTo.call(this, 'Month', this.currentDate);
            this.keyNavigation(ele, e);
            break;
        case 'shiftTab':
            if (!isNullOrUndefined(this.presetElement)) {
                this.presetElement.setAttribute('tabindex', '0');
                this.presetElement.focus();
                this.removeFocusedDate();
            }
            if (isLeftCalendar) {
                e.preventDefault();
            }
            if (this.tabKeyValidation(ele, RIGHTCALENDER)) {
                this.currentDate = new Date(+this.leftCalCurrentDate);
                this.navInCalendar(e, isLeftCalendar, leftDateLimit, rightDateLimit, ele);
            }
            break;
        case 'spacebar':
            if (this.applyButton && !this.applyButton.disabled) {
                this.applyFunction(e);
            }
            break;
        case 'tab':
            if (this.tabKeyValidation(ele, LEFTCALENDER)) {
                this.currentDate = new Date(+this.rightCalCurrentDate);
                this.navInCalendar(e, isLeftCalendar, leftDateLimit, rightDateLimit, ele);
            }
            break;
        default:
            this.navInCalendar(e, isLeftCalendar, leftDateLimit, rightDateLimit, ele);
            this.checkMinMaxDays();
        }
        this.presetHeight();
    }
    private tabKeyValidation(ele: HTMLElement, calendarPos: string): boolean {
        const isLeftCalendar: boolean = ele.classList.contains(calendarPos);
        const rightHeader: HTMLElement = this.rightCalendar.querySelector('.e-header');
        const leftHeader: HTMLElement = this.leftCalendar.querySelector('.e-header');
        const isRightMonth: boolean = rightHeader ? rightHeader.classList.contains('e-month') : false;
        const isLeftMonth: boolean = leftHeader ? leftHeader.classList.contains('e-month') : false;
        const isRightYear: boolean = rightHeader ? rightHeader.classList.contains('e-year') : false;
        const isLeftYear: boolean = leftHeader ? leftHeader.classList.contains('e-year') : false;
        const isRightDecade: boolean = rightHeader ? rightHeader.classList.contains('e-decade') : false;
        const isLeftDecade: boolean = leftHeader ? leftHeader.classList.contains('e-decade') : false;
        return isLeftCalendar && (isLeftMonth || isLeftYear || isLeftDecade) &&
         (isRightMonth || isRightYear || isRightDecade) && !this.isMobile;
    }
    private keyNavigation(calendar: HTMLElement, e: KeyboardEventArgs): void {
        this.bindCalendarCellEvents(calendar);
        if (calendar.classList.contains(LEFTCALENDER)) {
            this.leftCalCurrentDate = new Date(+this.currentDate);
        } else {
            this.rightCalCurrentDate = new Date(+this.currentDate);
        }
        this.updateNavIcons();
        this.calendarIconEvent();
        this.updateRange([calendar]);
        this.dateDisabled = this.isDateDisabled(this.currentDate);
        e.preventDefault();
    }
    private inputHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
        case 'altDownArrow':
            if (!this.isPopupOpen()) {
                if (this.inputElement.value === '') {
                    this.clear();
                    this.changeTrigger(e);
                    this.clearRange();
                }
                this.show(null, e);
                this.isRangeIconClicked = false;
                if (!this.isMobile) {
                    if (!isNullOrUndefined(this.leftCalendar)) {
                        this.calendarFocus();
                    }
                }
                this.isKeyPopup = true;
            }
            break;
        case 'escape':
            if (this.isPopupOpen()) {
                this.hide(e);
            }
            break;
        case 'enter':
            if (document.activeElement === this.inputElement) {
                this.inputBlurHandler(e);
                this.hide(e);
            }
            break;
        case 'tab':
            if (document.activeElement === this.inputElement && this.isPopupOpen()) {
                this.hide(e);
                e.preventDefault();
            }
            break;
        }
    }
    private bindCalendarCellEvents(calendar?: HTMLElement): void {
        let tdCells: HTMLElement[];
        if (calendar) {
            tdCells = <HTMLElement[] & NodeListOf<Element>>calendar.querySelectorAll('.' + CALENDAR + ' td');
        } else {
            tdCells = <HTMLElement[] & NodeListOf<Element>>this.popupObj.element.querySelectorAll('.' + CALENDAR + ' td');
        }
        for (const cell of tdCells) {
            EventHandler.clearEvents(cell);
            const disabledCell: boolean = cell.classList.contains(DISABLED) || cell.classList.contains(DATEDISABLED);
            if (!disabledCell && !cell.classList.contains(WEEKNUMBER)) {
                if (!this.isMobile) {
                    EventHandler.add(cell, 'mouseover', this.hoverSelection, this);
                }
                EventHandler.add(cell, 'mousedown', this.selectRange, this);
            }
        }
    }
    private removeFocusedDate(): void {
        const isDate: boolean = !isNullOrUndefined(this.startValue) || !isNullOrUndefined(this.endValue);
        const focusedDate: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>
        this.popupObj.element.querySelectorAll('.' + CALENDAR + ' .' + FOCUSDATE);
        for (const ele of focusedDate) {
            const today: Date = new Date();
            const eleDate: Date = this.getIdValue(null, ele);
            if ((this.depth === 'Month' && this.currentView() === 'Month' &&
                (!ele.classList.contains(TODAY) || (ele.classList.contains(TODAY) && isDate)))
                || (this.depth === 'Year' && this.currentView() === 'Year' &&
                    ((!this.isSameMonth(today, eleDate) && !this.isSameYear(today, eleDate)) || isDate))
                || (this.depth === 'Decade' && this.currentView() === 'Decade' &&
                    (!this.isSameYear(today, eleDate) || isDate))) {
                ele.classList.remove(FOCUSDATE);
                if (!ele.classList.contains(STARTDATE) && !ele.classList.contains(ENDDATE)) {
                    ele.removeAttribute('aria-label');
                }
            }
        }
    }
    private hoverSelection(event: MouseEvent | KeyboardEventArgs | TouchEvent, element: Element): void {
        const currentElement: HTMLElement = <HTMLElement>element || <HTMLElement>event.currentTarget;
        const currentDate: Date = this.getIdValue(null, currentElement);
        if (!isNullOrUndefined(this.startValue) && +this.startValue >= +this.min && +this.startValue <= +this.max) {
            if ((!this.isDateDisabled(this.endValue) && !this.isDateDisabled(this.startValue)
                && isNullOrUndefined(this.endValue) && isNullOrUndefined(this.startValue))
                || (!isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue))) {
                const tdCells: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>
                this.popupObj.element.querySelectorAll('.' + CALENDAR + ' td');
                for (const ele of tdCells) {
                    const isDisabledCell: boolean = (!ele.classList.contains(DISABLED) || ele.classList.contains(DATEDISABLED));
                    if (!ele.classList.contains(WEEKNUMBER) && isDisabledCell) {
                        const eleDate: Date = this.getIdValue(null, ele);
                        const startDateValue: Date = this.currentView() === 'Month' ? new Date(+this.startValue) : this.getStartEndDate(new Date(+this.startValue), false);
                        const eleDateValue: Date = new Date(+eleDate);
                        if (eleDateValue.setHours(0, 0, 0, 0) >= startDateValue.setHours(0, 0, 0, 0) && +eleDate <= +currentDate) {
                            addClass([ele], RANGEHOVER);
                        } else {
                            removeClass([ele], [RANGEHOVER]);
                        }
                    }
                }
            }
        }
    }
    private isSameStartEnd(startVal: Date, endVal: Date): boolean {
        let isSame: boolean = false;
        if (this.depth === 'Month') {
            if ((startVal).setHours(0, 0, 0, 0) === (endVal).setHours(0, 0, 0, 0)) {
                isSame = true;
            }
        } else if (this.depth === 'Year') {
            if ((startVal.getFullYear() === endVal.getFullYear()) &&
                (startVal.getMonth() === endVal.getMonth())) {
                isSame = true;
            }
        } else if (this.depth === 'Decade') {
            if (startVal.getFullYear() === endVal.getFullYear()) {
                isSame = true;
            }
        }
        return isSame;
    }
    private updateRange(elementCollection: HTMLElement[]): void {
        if (!isNullOrUndefined(this.startValue)) {
            for (const calendar of elementCollection) {
                const tdCells: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>calendar.querySelectorAll('.' + CALENDAR + ' td');
                for (const ele of tdCells) {
                    if (!ele.classList.contains(WEEKNUMBER) && !ele.classList.contains(DISABLED)) {
                        const eleDate: Date = this.getIdValue(null, ele);
                        const eleDateValue: Date = this.getIdValue(null, ele);
                        if (!isNullOrUndefined(this.endValue)) {
                            const eleStartDateValue: Date = this.currentView() === 'Month' ? new Date(+this.startValue) : this.getStartEndDate(new Date(+this.startValue), false);
                            const eleEndDateValue: Date = this.currentView() === 'Month' ? new Date(+this.endValue) : this.getStartEndDate(new Date(+this.endValue), true);
                            if (this.currentView() === this.depth &&
                                +eleDateValue.setHours(0, 0, 0, 0) >= +eleStartDateValue.setHours(0, 0, 0, 0)
                                && +eleDateValue.setHours(0, 0, 0, 0) <= +eleEndDateValue.setHours(0, 0, 0, 0) &&
                                !this.isSameStartEnd(new Date(+this.startValue), new Date(+this.endValue)) &&
                                +new Date(+this.startValue).setHours(0, 0, 0, 0) >= +this.min
                                && +new Date(+this.endValue).setHours(0, 0, 0, 0) <= +this.max
                                && !(this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue))) {
                                addClass([ele], RANGEHOVER);
                            }
                        } else {
                            removeClass([ele], [RANGEHOVER]);
                        }
                        if (ele.classList.contains(SELECTED) && ele.classList.contains(ENDDATE) &&
                        (+eleDateValue !== +this.endValue)) {
                            removeClass([ele], [SELECTED]);
                            removeClass([ele], [ENDDATE]);
                        }
                        if (ele.classList.contains(RANGEHOVER) && (+eleDateValue > +this.endValue)) {
                            removeClass([ele], [RANGEHOVER]);
                        }
                        if (!ele.classList.contains(OTHERMONTH)) {
                            const startDateValue: Date = this.currentView() === 'Month' ? new Date(+this.startValue) : this.getStartEndDate(new Date(+this.startValue), false);
                            let eleDateValue: Date = new Date(+eleDate);
                            if (this.currentView() === this.depth &&
                                +eleDateValue.setHours(0, 0, 0, 0) === +startDateValue.setHours(0, 0, 0, 0)
                                && +eleDateValue.setHours(0, 0, 0, 0) >= +startDateValue.setHours(0, 0, 0, 0) &&
                                +this.startValue >= +this.min
                                && !this.inputWrapper.container.classList.contains('e-error')
                                && !(this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue))) {
                                addClass([ele], [STARTDATE, SELECTED]);
                                this.addSelectedAttributes(ele, this.startValue, true);
                            }
                            const endDateValue: Date = this.currentView() === 'Month' ? new Date(+this.endValue) : this.getStartEndDate(new Date(+this.endValue), true);
                            if (this.currentView() === 'Year') {
                                eleDateValue = new Date(eleDateValue.getFullYear(), eleDateValue.getMonth() + 1, 0);
                            } else if (this.currentView() === 'Decade') {
                                eleDateValue = new Date(eleDateValue.getFullYear(), 11, 31);
                            }
                            if (this.currentView() === this.depth &&
                                !isNullOrUndefined(this.endValue) &&
                                +eleDateValue.setHours(0, 0, 0, 0) === +endDateValue.setHours(0, 0, 0, 0)
                                && +eleDateValue.setHours(0, 0, 0, 0) <= +endDateValue.setHours(0, 0, 0, 0) &&
                                +this.startValue >= +this.min
                                && !this.inputWrapper.container.classList.contains('e-error')
                                && !(this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue))) {
                                addClass([ele], [ENDDATE, SELECTED]);
                                this.addSelectedAttributes(ele, this.startValue, false);
                            }
                            if (+eleDate === +this.startValue && !isNullOrUndefined(this.endValue) && +eleDate === +this.endValue) {
                                this.addSelectedAttributes(ele, this.endValue, false, true);
                            }
                        }
                    }
                }
            }
        }
    }
    private checkMinMaxDays(): void {
        if ((!isNullOrUndefined(this.minDays) && this.minDays > 0) || (!isNullOrUndefined(this.maxDays) && this.maxDays > 0)) {
            if (!this.isMobile) {
                this.updateMinMaxDays(<HTMLElement>this.popupObj.element.querySelector('.' + LEFTCALENDER));
                this.updateMinMaxDays(<HTMLElement>this.popupObj.element.querySelector('.' + RIGHTCALENDER));
            } else {
                this.updateMinMaxDays(<HTMLElement>this.popupObj.element.querySelector('.' + CALENDAR));
            }
        }
    }
    private rangeArgs(e: MouseEvent | KeyboardEvent | TouchEvent | KeyboardEventArgs): RangeEventArgs {
        let inputValue: string;
        let range: number;
        const startDate: string = !isNullOrUndefined(this.startValue) ?
            this.globalize.formatDate(this.startValue, {
                format: this.formatString, type: 'date', skeleton: 'yMd'
            }) : null;
        const endDate: string = !isNullOrUndefined(this.endValue) ?
            this.globalize.formatDate(this.endValue, {
                format: this.formatString, type: 'date', skeleton: 'yMd'
            }) : null;
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            inputValue = startDate + ' ' + this.separator + ' ' + endDate;
            range = (Math.round(Math.abs((this.removeTimeValueFromDate(this.startValue).getTime() -
            this.removeTimeValueFromDate(this.endValue).getTime()) / (1000 * 60 * 60 * 24))) + 1);
        } else {
            inputValue = '';
            range = 0;
        }
        const args: RangeEventArgs = {
            value: this.value,
            startDate: this.startValue,
            endDate: this.endValue,
            daySpan: range,
            event: e || null,
            element: this.element,
            isInteracted: !isNullOrUndefined(e),
            text: inputValue

        };
        return args;
    }
    private otherMonthSelect(ele: Element, isStartDate: boolean, sameDate?: boolean): void {
        const value: number = +this.getIdValue(null, ele);
        const dateIdString: string = '*[id^="/id"]:not(.e-other-month)'.replace('/id', '' + value);
        const tdCell: Element = this.popupObj && this.popupObj.element.querySelector(dateIdString);
        if (!isNullOrUndefined(tdCell)) {
            if (isStartDate) {
                addClass([tdCell], [STARTDATE, SELECTED]);
                this.addSelectedAttributes(tdCell, this.startValue, true);
            } else {
                addClass([tdCell], [ENDDATE, SELECTED]);
                this.addSelectedAttributes(tdCell, this.endValue, true);
            }
            if (sameDate) {
                this.addSelectedAttributes(ele, this.endValue, false, true);
            }

        }
    }
    private selectRange(event: MouseEvent | KeyboardEventArgs | TouchEvent, element: Element): void {
        let leftCalendar: HTMLElement;
        let rightCalendar: HTMLElement;
        if (event) {
            event.preventDefault();
        }
        let isValue: boolean;
        let startDateValue : Date;
        let endDateValue : Date;
        const value: string = (<HTMLInputElement>this.inputElement).value;
        if (!isNullOrUndefined(value) && value.trim() !== '') {
            const range: string[] = value.split(' ' + this.separator + ' ');
            if (range.length > 1 && ((this.currentView() === 'Year' && this.depth === 'Year')
                || (this.currentView() === 'Decade' && this.depth === 'Decade'))) {
                const dateOptions: object = { format: this.formatString, type: 'date', skeleton: 'yMd' };
                startDateValue = this.globalize.parseDate(this.getAmPmValue(range[0]).trim(), dateOptions);
                endDateValue = this.globalize.parseDate(this.getAmPmValue(range[1]).trim(), dateOptions);
                isValue = true;
            }
        }
        let date: Date = isNullOrUndefined(event) ? this.getIdValue(null, element)
            : this.getIdValue(event, null);
        if (!isNullOrUndefined(this.startValue)) {
            if (this.currentView() === 'Year' && this.depth === 'Year') {
                date = new Date(date.getFullYear(), date.getMonth(), this.startValue.getDate());
            } else if (this.currentView() === 'Decade' && this.depth === 'Decade') {
                date = new Date(date.getFullYear(), this.startValue.getMonth(), this.startValue.getDate());
            }
        }
        const y: number = date.getFullYear();
        const m: number = date.getMonth();
        const firstDay: Date = isValue && this.start !== 'Year' ? new Date(y, m, startDateValue.getDate(), startDateValue.getHours(), startDateValue.getMinutes(),
                                                                           startDateValue.getSeconds()) : new Date(y, m, 1);
        const lastDay: Date = isValue && this.start !== 'Year' ? new Date(y, m, endDateValue.getDate(), endDateValue.getHours(), endDateValue.getMinutes(),
                                                                          endDateValue.getSeconds()) : new Date(y, m + 1, 0);
        const firstMonth: Date = isValue && this.start !== 'Year' ? new Date(y, startDateValue.getMonth(), startDateValue.getDate(), startDateValue.getHours(), startDateValue.getMinutes(),
                                                                             startDateValue.getSeconds()) : new Date(y, 0, 1);
        const lastMonth: Date = isValue && this.start !== 'Year' ? new Date(y, endDateValue.getMonth(), endDateValue.getDate(), endDateValue.getHours(), endDateValue.getMinutes(),
                                                                            endDateValue.getSeconds()) : new Date(y, 11, 31);
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            if (!this.isMobile || this.isMobile && !this.endButton.element.classList.contains(ACTIVE)) {
                this.removeSelection();
            }
        } else if (this.isMobile && this.startButton.element.classList.contains(ACTIVE)) {
            this.removeSelection();
        }
        const ele: Element = element || <Element>event.currentTarget;
        if (isNullOrUndefined(this.startValue)) {
            if (!isNullOrUndefined(this.previousStartValue)) {
                date.setHours(this.previousStartValue.getHours());
                date.setMinutes(this.previousStartValue.getMinutes());
                date.setSeconds(this.previousStartValue.getSeconds());
            }
            this.startValue = (this.depth === 'Month') ? new Date(this.checkValue(date)) :
                (this.depth === 'Year') ? firstDay : firstMonth;
            this.endValue = null;
            this.setValue();
            addClass([ele], STARTDATE);
            this.addSelectedAttributes(ele, this.startValue, true);
            if (ele.classList.contains(OTHERMONTH)) {
                this.otherMonthSelect(ele, true);
            }
            this.checkMinMaxDays();
            this.applyButton.disabled = true;
            this.applyButton.element.disabled = true;
            if (this.isMobile) {
                this.endButton.element.classList.add(ACTIVE);
                this.startButton.element.classList.remove(ACTIVE);
                this.endButton.element.removeAttribute('disabled');
                this.selectableDates();
            }
            this.trigger('select', this.rangeArgs(event));
        } else {
            if (+ date === +this.startValue || +date > +this.startValue) {
                if (+date === +this.startValue && !isNullOrUndefined(this.minDays) && this.minDays > 1) {
                    return;
                }
                this.endValue = null;
                this.setValue();
                if (this.isMobile || element) {
                    this.hoverSelection(event, element);
                }
                if (!isNullOrUndefined(this.previousEndValue)) {
                    date.setHours(this.previousEndValue.getHours());
                    date.setMinutes(this.previousEndValue.getMinutes());
                    date.setSeconds(this.previousEndValue.getSeconds());
                }
                this.endValue = (this.depth === 'Month') ? new Date(this.checkValue(date)) :
                    (this.depth === 'Year') ? lastDay : lastMonth;
                this.setValue();
                let endEle: Element[] = <Element[] & NodeListOf<Element>>this.popupObj.element.querySelectorAll('.' + ENDDATE);
                if (this.isMobile) {
                    this.startButton.element.classList.remove(ACTIVE);
                    this.endButton.element.classList.add(ACTIVE);
                    for (const ele of endEle) {
                        ele.removeAttribute('aria-label');
                        if (!ele.classList.contains(STARTDATE)) {
                            ele.setAttribute('aria-selected', 'false');
                            removeClass([ele], [ENDDATE, SELECTED]);
                        } else {
                            this.addSelectedAttributes(ele, this.startValue, true);
                            removeClass([ele], [ENDDATE]);
                        }
                    }
                }
                addClass([ele], ENDDATE);
                if (+this.endValue === +this.startValue) {
                    this.addSelectedAttributes(ele, this.endValue, false, true);
                } else {
                    this.addSelectedAttributes(ele, this.endValue, false);
                }
                if (ele.classList.contains(OTHERMONTH)) {
                    if (+this.endValue === +this.startValue) {
                        this.otherMonthSelect(ele, false, true);
                    } else {
                        this.otherMonthSelect(ele, false);
                    }
                }
                endEle = <Element[] & NodeListOf<Element>>this.popupObj.element.querySelectorAll('.' + ENDDATE);
                for (const ele of endEle) {
                    if (ele.classList.contains(STARTDATE)) {
                        removeClass([ele], [RANGEHOVER]);
                    }
                }
                this.applyButton.disabled = false;
                this.applyButton.element.disabled = false;
                if (!this.isMobile) {
                    this.removeClassDisabled();
                }
                if (!isNullOrUndefined(this.renderDayCellArgs) && this.renderDayCellArgs.isDisabled){
                    this.disabledDateRender();
                }
                this.trigger('select', this.rangeArgs(event));
            } else if (+date < +this.startValue) {
                this.removeClassDisabled();
                this.startValue = (this.depth === 'Month') ? new Date(this.checkValue(date)) :
                    (this.depth === 'Year') ? firstDay : firstMonth;
                this.setValue();
                this.removeSelectedAttributes();
                removeClass(this.popupObj.element.querySelectorAll('.' + STARTDATE), [STARTDATE, SELECTED]);
                addClass([ele], STARTDATE);
                this.addSelectedAttributes(ele, this.startValue, true);
                if (ele.classList.contains(OTHERMONTH)) {
                    this.otherMonthSelect(ele, true);
                }
                this.checkMinMaxDays();
            }
        }
        const isCustomMin: boolean = this.min.getTime() !== new Date(1900, 0, 1).getTime();
        const isCustomMax: boolean = this.max.getTime() !== new Date(2099, 11, 31).getTime();
        if (this.currentView() === 'Year' && this.depth === 'Year') {
            const startMonth: Date = new Date(this.min.getFullYear(), this.min.getMonth(), 1);
            if (!isNullOrUndefined(this.startValue) && isCustomMin && +this.startValue <= +startMonth) {
                this.startValue = this.min;
            }
            const endMonth: Date = new Date(this.max.getFullYear(), this.max.getMonth() + 1, 0);
            if (!isNullOrUndefined(this.endValue) && isCustomMax && +this.endValue >= +endMonth) {
                this.endValue = this.max;
            }
        } else if (this.currentView() === 'Decade' && this.depth === 'Decade') {
            if (!isNullOrUndefined(this.startValue) && isCustomMin && this.startValue.getFullYear() <= this.min.getFullYear()) {
                this.startValue = this.min;
            } else if (isCustomMin && this.startValue.getFullYear() > this.min.getFullYear()) {
                this.startValue = new Date(this.startValue.getFullYear(), 0, 1);
            }
            if (!isNullOrUndefined(this.endValue) && isCustomMax && this.endValue.getFullYear() >= this.max.getFullYear()) {
                this.endValue = this.max;
            }
        }
        if (event) {
            leftCalendar = <HTMLElement>closest(<HTMLElement>event.target, '.' + LEFTCALENDER);
        }
        if (!isNullOrUndefined(leftCalendar)) {
            (<HTMLElement>this.leftCalendar.children[1].firstElementChild).focus();
        } else {
            if (event) {
                rightCalendar = event && <HTMLElement>closest(<HTMLElement>event.target, '.' + RIGHTCALENDER);
            }
            if (!isNullOrUndefined(rightCalendar)) {
                (<HTMLElement>this.rightCalendar.children[1].firstElementChild).focus();
            }
        }
        addClass([ele], SELECTED);
        this.calendarIconEvent();
        this.updateHeader();
        this.removeFocusedDate();
    }
    private selectableDates(): void {
        if (!isNullOrUndefined(this.startValue)) {
            const tdCells: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>this.calendarElement.querySelectorAll('.' + CALENDAR + ' td');
            let isStartDate: boolean = false;
            if (this.currentView() === this.depth) {
                for (const ele of tdCells) {
                    if (!ele.classList.contains(STARTDATE) && !ele.classList.contains(WEEKNUMBER)) {
                        if (!ele.classList.contains(DISABLED)) {
                            const eleDate: Date = this.getIdValue(null, ele);
                            if (+eleDate < +this.startValue) {
                                addClass([ele], [DATEDISABLED, DISABLED, OVERLAY]);
                                EventHandler.clearEvents(ele);
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (ele.classList.contains(STARTDATE) && !ele.classList.contains(OTHERMONTH)) {
                        isStartDate = true;
                        break;
                    }
                }
                if (isStartDate) {
                    if (!this.previousIcon.classList.contains(DISABLED)) {
                        addClass([this.previousIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                    }
                }
            } else {
                for (const ele of tdCells) {
                    const startMonth: number = this.startValue.getMonth();
                    const startYear: number = this.startValue.getFullYear();
                    const element: Date = this.getIdValue(null, ele);
                    if (!this.startButton.element.classList.contains(ACTIVE) && ((this.currentView() === 'Year' &&
                        (element.getMonth() < startMonth) && (element.getFullYear() <= startYear))
                        || (this.currentView() === 'Decade' && (element.getMonth() <= startMonth) &&
                            (element.getFullYear() < startYear)))) {
                        addClass([ele], [DISABLED]);
                    } else {
                        break;
                    }
                }
                if (tdCells[0].classList.contains(DISABLED)) {
                    this.previousIconHandler(true);
                } else if (tdCells[tdCells.length - 1].classList.contains(DISABLED)) {
                    this.nextIconHandler(true);
                }
            }
        }
    }
    private updateMinMaxDays(calendar: HTMLElement): void {
        if ((!isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue)) ||
            (this.isMobile && this.endButton && this.endButton.element.classList.contains(ACTIVE))) {
            if ((!isNullOrUndefined(this.minDays) && this.minDays > 0) || (!isNullOrUndefined(this.maxDays) && this.maxDays > 0)) {
                const startValueSelected : Date = this.removeTimeValueFromDate(this.startValue);
                let minDate: Date = new Date(new Date(+startValueSelected).setDate(startValueSelected.getDate() + (this.minDays - 1)));
                let maxDate: Date = new Date(new Date(+startValueSelected).setDate(startValueSelected.getDate() + (this.maxDays - 1)));
                minDate = (!isNullOrUndefined(this.minDays) && this.minDays > 0) ? minDate : null;
                maxDate = (!isNullOrUndefined(this.maxDays) && this.maxDays > 0) ? maxDate : null;
                if (this.currentView() === 'Year') {
                    minDate = isNullOrUndefined(minDate) ? null : new Date(minDate.getFullYear(), minDate.getMonth(), 0);
                    maxDate = isNullOrUndefined(maxDate) ? null : new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
                } else if (this.currentView() === 'Decade') {
                    minDate = isNullOrUndefined(minDate) ? null : new Date(minDate.getFullYear() - 1, 11, 1);
                    maxDate = isNullOrUndefined(maxDate) ? null : new Date(maxDate.getFullYear(), 0, 1);
                }
                const tdCells: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>calendar.querySelectorAll('.' + CALENDAR + ' td');
                let maxEle: Element;
                for (const ele of tdCells) {
                    if (!ele.classList.contains(STARTDATE) && !ele.classList.contains(WEEKNUMBER)) {
                        let eleDate: Date = this.getIdValue(null, ele);
                        eleDate = this.removeTimeValueFromDate(eleDate);
                        if (!isNullOrUndefined(minDate) && +eleDate === +minDate && ele.classList.contains(DISABLED)) {
                            minDate.setDate(minDate.getDate() + 1);
                        }
                        if (!ele.classList.contains(DISABLED)) {
                            if (+eleDate <= +startValueSelected) {
                                continue;
                            }
                            if (!isNullOrUndefined(minDate) && +eleDate < +minDate) {
                                addClass([ele], [DATEDISABLED, DISABLED, OVERLAY]);
                                EventHandler.clearEvents(ele);
                            }
                            if (!isNullOrUndefined(maxDate) && +eleDate > +maxDate) {
                                addClass([ele], [DATEDISABLED, DISABLED, OVERLAY]);
                                this.isMaxDaysClicked = true;
                                EventHandler.clearEvents(ele);
                                if (isNullOrUndefined(maxEle) && !ele.classList.contains(OTHERMONTH)) {
                                    maxEle = ele;
                                }
                            }
                        }
                    }
                }
                if (!isNullOrUndefined(maxEle)) {
                    if (this.isMobile) {
                        if (!this.nextIcon.classList.contains(DISABLED)) {
                            addClass([this.nextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                        }
                    } else {
                        let calendar: HTMLElement = <HTMLElement>closest(maxEle, '.' + RIGHTCALENDER);
                        calendar = isNullOrUndefined(calendar) ? this.leftCalendar : calendar;
                        const isLeftCalendar: boolean = calendar.classList.contains(LEFTCALENDER);
                        if (!isLeftCalendar) {
                            if (!this.rightCalNextIcon.classList.contains(DISABLED)) {
                                addClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                            }
                        } else {
                            if (!this.rightCalNextIcon.classList.contains(DISABLED)) {
                                addClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                            }
                            if (!this.leftCalNextIcon.classList.contains(DISABLED)) {
                                addClass([this.leftCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                            }
                            if (!this.rightCalPrevIcon.classList.contains(DISABLED)) {
                                addClass([this.rightCalPrevIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                            }
                        }
                    }
                }
            }
        } else {
            this.isMaxDaysClicked = false;
        }
    }

    private removeTimeValueFromDate(value : Date): Date {
        const dateValue : Date = new Date(value.getFullYear(), value.getMonth() , value.getDate());
        return dateValue;
    }

    private removeClassDisabled(): void {
        const tdCells: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>
        this.popupObj.element.querySelectorAll('.' + CALENDAR + ' td' + '.' + DATEDISABLED);
        for (const ele of tdCells) {
            if (ele.classList.contains(DATEDISABLED)) {
                removeClass([ele], [DATEDISABLED, DISABLED, OVERLAY]);
                EventHandler.add(ele, 'click', this.selectRange, this);
                if (!this.isMobile) {
                    EventHandler.add(ele, 'mouseover', this.hoverSelection, this);
                }
            }
        }
        if (this.isMobile) {
            if (this.nextIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.nextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
            if (this.previousIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.previousIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
        } else {
            if (this.rightCalNextIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
            if (this.rightCalPrevIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.rightCalPrevIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
            if (this.leftCalNextIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.leftCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
        }
    }
    private updateHeader(): void {
        const format: Object = { type: 'date', skeleton: 'yMMMd' };
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            let range: number = (Math.round(Math.abs((this.removeTimeValueFromDate(this.startValue).getTime() -
            this.removeTimeValueFromDate(this.endValue).getTime()) / (1000 * 60 * 60 * 24))) + 1);
            if (!isNullOrUndefined(this.disabledDayCnt)) {
                range = range - this.disabledDayCnt;
                this.disabledDayCnt = null;
            }
            this.popupObj.element.querySelector('.' + DAYSPAN).textContent = range.toString() + ' ' + this.l10n.getConstant('days');
        } else {
            this.popupObj.element.querySelector('.' + DAYSPAN).textContent = this.l10n.getConstant('selectedDays');
        }
        if (!this.isMobile) {
            if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
                this.popupObj.element.querySelector('.' + ENDLABEL).textContent = this.globalize.formatDate(this.endValue, format);
            } else {
                this.popupObj.element.querySelector('.' + ENDLABEL).textContent = this.l10n.getConstant('endLabel');
            }
            if (!isNullOrUndefined(this.startValue)) {
                this.popupObj.element.querySelector('.' + STARTLABEL).textContent = this.globalize.formatDate(this.startValue, format);
            } else {
                this.popupObj.element.querySelector('.' + STARTLABEL).textContent = this.l10n.getConstant('startLabel');
            }
        } else {
            if (!isNullOrUndefined(this.startValue)) {
                this.startButton.element.textContent = this.globalize.formatDate(this.startValue, format);
            } else {
                this.startButton.element.textContent = this.l10n.getConstant('startLabel');
            }
            if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
                this.endButton.element.textContent = this.globalize.formatDate(this.endValue, format);
            } else {
                this.endButton.element.textContent = this.l10n.getConstant('endLabel');
            }
        }
        if ((this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue)) ||
            ((!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
                || (!isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
                || ((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue))
                    && +this.startValue > +this.endValue)
            )) {

            if (!this.isMobile) {
                this.popupObj.element.querySelector('.' + DAYSPAN).textContent = this.l10n.getConstant('selectedDays');
                this.popupObj.element.querySelector('.' + STARTLABEL).textContent = this.l10n.getConstant('startLabel');
                this.popupObj.element.querySelector('.' + ENDLABEL).textContent = this.l10n.getConstant('endLabel');
            } else {
                this.startButton.element.textContent = this.l10n.getConstant('startLabel');
                this.endButton.element.textContent = this.l10n.getConstant('endLabel');
                this.popupObj.element.querySelector('.' + DAYSPAN).textContent = this.l10n.getConstant('selectedDays');
            }

        }
        if (this.popupObj.element.querySelector('#custom_range')) {
            this.popupObj.element.querySelector('#custom_range').textContent =
                this.l10n.getConstant('customRange') !== '' ? this.l10n.getConstant('customRange') : 'Custom Range';
        }
    }
    private removeSelection(): void {
        this.startValue = null;
        this.endValue = null;
        this.setValue();
        this.removeSelectedAttributes();
        if (this.popupObj) {
            if (this.popupObj.element.querySelectorAll('.' + SELECTED).length > 0) {
                removeClass(this.popupObj.element.querySelectorAll('.' + SELECTED), [STARTDATE, ENDDATE, SELECTED]);
            }
            if (this.popupObj.element.querySelectorAll('.' + FOCUSDATE).length > 0) {
                removeClass(this.popupObj.element.querySelectorAll('.' + FOCUSDATE), FOCUSDATE);
            }
            if (this.popupObj.element.querySelectorAll('.' + RANGEHOVER).length > 0) {
                removeClass(this.popupObj.element.querySelectorAll('.' + RANGEHOVER), [RANGEHOVER]);
            }
        }

    }
    private addSelectedAttributes(ele: Element, date: Date, isStartDate: boolean, sameDate?: boolean): void {
        if (ele) {
            const title: string = this.globalize.formatDate(date, { type: 'date', skeleton: 'full' });
            if (!isNullOrUndefined(sameDate) && sameDate) {
                ele.setAttribute('aria-label', 'The current start and end date is ' + '' + title);
            } else {
                ele.setAttribute('aria-label', 'The current ' + (isStartDate ? 'start' : 'end') + ' date is ' + '' + title);
            }
            ele.setAttribute('aria-selected', 'true');
        }
    }
    private removeSelectedAttributes(): void {
        if (this.popupObj) {
            const start: Element[] = <Element[] & NodeListOf<Element>>this.popupObj.element.querySelectorAll('.' + STARTDATE);
            for (const ele of start) {
                ele.setAttribute('aria-selected', 'false');
                ele.removeAttribute('aria-label');
            }
            const end: Element[] = <Element[] & NodeListOf<Element>>this.popupObj.element.querySelectorAll('.' + ENDDATE);
            for (const ele of end) {
                ele.setAttribute('aria-selected', 'false');
                ele.removeAttribute('aria-label');
            }
        }
    }
    private updateCalendarElement(calendar: HTMLElement): void {
        if (calendar.classList.contains(LEFTCALENDER)) {
            this.calendarElement = this.leftCalendar;
            this.currentDate = this.leftCalCurrentDate;
            this.previousIcon = this.leftCalPrevIcon;
            this.nextIcon = this.leftCalNextIcon;
        } else {
            this.calendarElement = this.rightCalendar;
            this.currentDate = this.rightCalCurrentDate;
            this.previousIcon = this.rightCalPrevIcon;
            this.nextIcon = this.rightCalNextIcon;
        }
        this.contentElement = <HTMLElement>calendar.querySelector('.' + CONTENT);
        this.tableBodyElement = select('.' + CONTENT + ' tbody', calendar);
        this.table = <HTMLElement>calendar.querySelector('.' + CONTENT).getElementsByTagName('table')[0];
        this.headerTitleElement = <HTMLElement>calendar.querySelector('.' + HEADER + ' .' + TITLE);
        this.headerElement = <HTMLElement>calendar.querySelector('.' + HEADER);
    }
    private navPrevMonth(e: MouseEvent): void {
        e.preventDefault();
        let ele: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + LEFTCALENDER);
        ele = isNullOrUndefined(ele) ? <HTMLElement>closest(<HTMLElement>e.target, '.' + RIGHTCALENDER) : ele;
        this.updateCalendarElement(ele);
        this.navigatePrevious(e);
        if (!isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue)) {
            this.updateMinMaxDays(ele);
        }
        this.updateControl(ele);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private deviceNavigation(ele?: Element): void {
        this.deviceCalendarEvent();
        this.updateRange([<HTMLElement>this.popupObj.element.querySelector('.' + CALENDAR)]);
        if (this.endButton.element.classList.contains(ACTIVE)) {
            this.updateMinMaxDays(<HTMLElement>this.popupObj.element.querySelector('.' + CALENDAR));
        }
        if (this.endButton.element.classList.contains(ACTIVE)) {
            this.selectableDates();
        }
        if (this.currentView() === this.depth) {
            this.bindCalendarCellEvents();
        }
        this.removeFocusedDate();
    }
    private updateControl(calendar: HTMLElement, customDate: Date = null): void {
        if (calendar.classList.contains(RIGHTCALENDER)) {
            this.rightCalCurrentDate = new Date(+(customDate ? customDate : this.currentDate));
        } else {
            this.leftCalCurrentDate = new Date(+this.currentDate);
        }
        this.calendarIconEvent();
        if ((((this.depth === 'Month')
            && this.leftCalendar.querySelector('.e-content').classList.contains('e-month')
            && this.rightCalendar.querySelector('.e-content').classList.contains('e-month'))
            || ((this.depth === 'Year')
                && this.leftCalendar.querySelector('.e-content').classList.contains('e-year')
                && this.rightCalendar.querySelector('.e-content').classList.contains('e-year'))
            || ((this.depth === 'Decade')
                && this.leftCalendar.querySelector('.e-content').classList.contains('e-decade')
                && this.rightCalendar.querySelector('.e-content').classList.contains('e-decade')))
            || this.isMobile) {
            this.bindCalendarCellEvents();
        }

        this.removeFocusedDate();
        this.updateRange([calendar]);
    }
    private navNextMonth(event: MouseEvent): void {
        event.preventDefault();
        let ele: HTMLElement = <HTMLElement>closest(<HTMLElement>event.target, '.' + LEFTCALENDER);
        ele = isNullOrUndefined(ele) ? <HTMLElement>closest(<HTMLElement>event.target, '.' + RIGHTCALENDER) : ele;
        this.updateCalendarElement(ele);
        this.navigateNext(event);
        if (!isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue)) {
            this.updateMinMaxDays(ele);
        }
        this.updateControl(ele);
    }
    private isPopupOpen(): boolean {
        if (!isNullOrUndefined(this.popupObj) && this.popupObj.element.classList.contains(POPUP)) {
            return true;
        }
        return false;
    }
    protected createRangeHeader(): HTMLElement {
        const labelContainer: HTMLElement = this.createElement('div', { className: STARTENDCONTAINER });
        if (!this.isMobile) {
            const startLabel: HTMLElement = this.createElement('a', { className: STARTLABEL });
            const endLabel: HTMLElement = this.createElement('a', { className: ENDLABEL });
            const changeIcon: HTMLElement = this.createElement('span', { className: CHANGEICON });
            attributes(startLabel, { 'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'Start Date', 'role': 'button' });
            attributes(endLabel, { 'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'End Date', 'role': 'button' });
            labelContainer.appendChild(startLabel);
            labelContainer.appendChild(changeIcon);
            labelContainer.appendChild(endLabel);
            startLabel.textContent = this.l10n.getConstant('startLabel');
            endLabel.textContent = this.l10n.getConstant('endLabel');
        } else {
            const endBtn: HTMLElement = this.createElement('button', { className: ENDBUTTON });
            const startBtn: HTMLElement = this.createElement('button', { className: STARTBUTTON });
            this.startButton = new Button({ content: this.l10n.getConstant('startLabel') }, <HTMLButtonElement>startBtn);
            this.endButton = new Button({ content: this.l10n.getConstant('endLabel') }, <HTMLButtonElement>endBtn);
            labelContainer.appendChild(startBtn);
            labelContainer.appendChild(endBtn);
        }
        return labelContainer;
    }

    private disableInput(): void {
        if (this.strictMode) {
            if (!isNullOrUndefined(this.previousStartValue) && !isNullOrUndefined(this.previousEndValue)) {
                this.startValue = this.previousStartValue;
                this.endValue = this.previousEndValue;
                this.setValue();
                this.updateInput();
            }
        } else {
            this.updateInput();
            this.clearRange();
            this.setProperties({ startDate: null }, true);
            this.setProperties({ endDate: null }, true);
            this.startValue = null;
            this.endValue = null;
            this.setValue();
            this.errorClass();
        }
        this.setProperties({ enabled: false }, true);
        Input.setEnabled(this.enabled, this.inputElement);
        this.bindEvents();
    }
    private validateMinMax(): void {
        this.min = isNullOrUndefined(this.min) || !(+this.min) ? this.min = new Date(1900, 0, 1) : this.min;
        this.max = isNullOrUndefined(this.max) || !(+this.max) ? this.max = new Date(2099, 11, 31) : this.max;
        if (!(this.min <= this.max)) {
            this.disableInput();
            return;
        }
        if (!isNullOrUndefined(this.minDays) && !isNullOrUndefined(this.maxDays)) {
            if (this.maxDays > 0 && this.minDays > 0 && (this.minDays > this.maxDays)) {
                this.maxDays = null;
            }
        }
        if (!isNullOrUndefined(this.minDays) && this.minDays < 0) {
            this.minDays = null;
        }
        if (!isNullOrUndefined(this.maxDays) && this.maxDays < 0) {
            this.maxDays = null;
        }
    }

    private validateRangeStrict(): void {
        if (!isNullOrUndefined(this.startValue)) {
            if (+this.startValue <= +this.min) {
                this.startValue = this.min;
                this.setValue();
            } else if (+this.startValue >= +this.min && +this.startValue >= +this.max) {
                this.startValue = this.max;
            }
        }
        if (!isNullOrUndefined(this.endValue)) {
            if (+this.endValue > +this.max) {
                this.endValue = this.max;
                this.setValue();
            } else if (+this.endValue < +this.min) {
                this.endValue = this.min;
                this.setValue();
            }
        }
        this.validateMinMaxDays();
    }
    private validateRange(): void {
        this.validateMinMaxDays();
    }
    private validateMinMaxDays(): void {
        if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
            const range: number = (Math.round(Math.abs((this.removeTimeValueFromDate(this.startValue).getTime() -
            this.removeTimeValueFromDate(this.endValue).getTime()) / (1000 * 60 * 60 * 24))) + 1);
            if ((!isNullOrUndefined(this.minDays) && this.minDays > 0) && !(range >= this.minDays)) {
                if (this.strictMode) {
                    const date: Date = new Date(+this.startValue);
                    date.setDate(date.getDate() + (this.minDays - 1));
                    if (+date > +this.max) {
                        this.endValue = this.max;
                        this.setValue();
                    } else {
                        this.endValue = date;
                        this.setValue();
                    }
                } else {
                    this.startValue = null;
                    this.endValue = null;
                    this.setValue();
                }
            }
            if ((!isNullOrUndefined(this.maxDays) && this.maxDays > 0) && !(range <= this.maxDays)) {
                if (this.strictMode) {
                    this.endValue = new Date(+this.startValue);
                    this.endValue.setDate(this.endValue.getDate() + (this.maxDays - 1));
                    this.setValue();
                } else {
                    this.startValue = null;
                    this.endValue = null;
                    this.setValue();
                }
            }
        }
    }
    private renderCalendar(): void {
        this.calendarElement = this.createElement('div');
        this.calendarElement.classList.add(CALENDAR);
        if (this.enableRtl) {
            this.calendarElement.classList.add(RTL);
        }
        attributes(this.calendarElement, <{ [key: string]: string }>{ 'data-role': 'calendar' });
        super.createHeader();
        super.createContent();
    }
    private isSameMonth(start: Date, end: Date): boolean {
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return true;
        }
        return false;
    }
    private isSameYear(start: Date, end: Date): boolean {
        if (start.getFullYear() === end.getFullYear()) {
            return true;
        }
        return false;
    }
    private isSameDecade(start: Date, end: Date): boolean {
        const startYear: number = start.getFullYear();
        const endYear: number = end.getFullYear();
        if ((startYear - (startYear % 10)) === (endYear - (endYear % 10))) {
            return true;
        }
        return false;
    }

    private startMonthCurrentDate(): void {
        if (this.isSameMonth(this.min, this.max) || +this.currentDate > +this.max || this.isSameMonth(this.currentDate, this.max)) {
            this.currentDate = new Date(+this.max);
            this.currentDate.setDate(1);
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        } else if (this.currentDate < this.min) {
            this.currentDate = new Date(this.checkValue(this.min));
        }
    }
    private selectNextMonth(): void {
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue) && !this.isSameMonth(this.endValue, this.currentDate)
            && !this.isDateDisabled(this.endValue) && !this.isDateDisabled(this.startValue)) {
            this.currentDate = new Date(+this.endValue);
        } else {
            this.currentDate.setDate(1);
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            return;
        }
        if ((!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
            || (!isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
            || ((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)
        ) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.currentDate.setDate(1);
            const month: number = this.currentDate.getMonth() + 1;
            this.currentDate.setMonth(month);
        }
    }
    private selectNextYear(): void {
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue) && !this.isSameYear(this.endValue, this.currentDate)
            && !this.isDateDisabled(this.endValue) && !this.isDateDisabled(this.startValue)) {
            this.currentDate = new Date(+this.endValue);
        } else {
            this.currentDate.setMonth(0);
            const yr: number = this.currentDate.getFullYear() + 1;
            this.currentDate.setFullYear(yr);
            return;
        }
        if ((!isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
            || ((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)
            || (!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
        ) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.currentDate.setMonth(0);
            this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        }
    }
    private selectNextDecade(): void {
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue) && !this.isSameDecade(this.endValue, this.currentDate)
            && !this.isDateDisabled(this.endValue) && !this.isDateDisabled(this.startValue)) {
            this.currentDate = new Date(+this.endValue);
        } else {
            const decyr: number = this.currentDate.getFullYear() + 10;
            this.currentDate.setFullYear(decyr);
            return;
        }
        if (((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)
            || (!isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
            || (!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
        ) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.currentDate.setFullYear(this.currentDate.getFullYear() + 10);
        }
    }
    private selectStartMonth(): void {
        if (!isNullOrUndefined(this.startValue)) {
            if (!isNullOrUndefined(this.max) && this.isSameMonth(this.startValue, this.max)) {
                this.currentDate = new Date(+this.max);
                this.currentDate.setDate(1);
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            } else if (!(this.startValue >= this.min && this.startValue <= this.max)
                || this.isDateDisabled(this.startValue)) {
                this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            } else {
                this.currentDate = new Date(+this.startValue);
            }
        } else {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.startMonthCurrentDate();
        }
        if ((!isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
            || (!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
            || ((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)
        ) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
        }
        this.startMonthCurrentDate();
    }
    private createCalendar(): HTMLElement {
        const calendarContainer: HTMLElement = this.createElement('div', { className: CALENDARCONTAINER });
        if (!this.isMobile) {
            this.selectStartMonth();
            this.renderCalendar();
            this.leftCalCurrentDate = new Date(+this.currentDate);
            this.calendarElement.classList.add(LEFTCALENDER);
            this.leftCalPrevIcon = <HTMLElement>this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + PREVICON);
            this.leftCalNextIcon = <HTMLElement>this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + NEXTICON);
            this.leftTitle = <HTMLElement>this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + TITLE);
            remove(this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + ICONCONTAINER));
            this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER).appendChild(this.leftCalNextIcon);
            this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER).appendChild(this.leftCalPrevIcon);
            prepend([this.leftCalPrevIcon], this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER));
            this.leftCalendar = this.calendarElement;
            const leftContainer: HTMLElement = this.createElement('div', { className: LEFTCONTAINER });
            const rightContainer: HTMLElement = this.createElement('div', { className: RIGHTCONTAINER });
            leftContainer.appendChild(this.leftCalendar);
            calendarContainer.appendChild(leftContainer);
            if (!this.isMobile) {
                EventHandler.add(this.leftTitle, 'click', this.leftNavTitle, this);
            }
            if (this.start === 'Month') {
                this.selectNextMonth();
            }
            if (this.start === 'Year') {
                this.selectNextYear();
            }
            if (this.start === 'Decade') {
                this.selectNextDecade();
            }
            this.renderCalendar();
            this.rightCalCurrentDate = new Date(+this.currentDate);
            addClass([this.calendarElement], RIGHTCALENDER);
            this.rightCalendar = this.calendarElement;
            removeClass([this.leftCalendar && this.leftCalendar.querySelector('.e-content tbody')], 'e-zoomin');
            removeClass([this.rightCalendar && this.rightCalendar.querySelector('.e-content tbody')], 'e-zoomin');
            this.rightCalPrevIcon = <HTMLElement>this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + PREVICON);
            this.rightCalNextIcon = <HTMLElement>this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + NEXTICON);
            this.rightTitle = <HTMLElement>this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + TITLE);
            remove(this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + ICONCONTAINER));
            this.calendarElement.querySelector('table').setAttribute('tabindex', '0');
            this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER).appendChild(this.rightCalNextIcon);
            this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER).appendChild(this.rightCalPrevIcon);
            prepend([this.rightCalPrevIcon], this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER));
            rightContainer.appendChild(this.rightCalendar);
            calendarContainer.appendChild(rightContainer);
            if (!this.isMobile) {
                EventHandler.add(this.rightTitle, 'click', this.rightNavTitle, this);
            }
        } else {
            if (!isNullOrUndefined(this.startValue)) {
                this.currentDate = new Date(+this.startValue);
            }
            super.validateDate();
            super.minMaxUpdate();
            super.render();
            const prevIcon: HTMLElement = <HTMLElement>this.calendarElement.querySelector('.' + CALENDAR + ' .' + PREVICON);
            const nextIcon: HTMLElement = <HTMLElement>this.calendarElement.querySelector('.' + CALENDAR + ' .' + NEXTICON);
            remove(this.calendarElement.querySelector('.' + CALENDAR + ' .' + ICONCONTAINER));
            this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER).appendChild(nextIcon);
            this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER).appendChild(prevIcon);
            prepend([prevIcon], this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER));
            this.deviceCalendar = this.calendarElement;
            calendarContainer.appendChild(this.calendarElement);
            this.headerTitleElement = <HTMLElement>this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER + ' .' + TITLE);
        }
        return calendarContainer;
    }
    private leftNavTitle(e: MouseEvent): void {
        if (this.isPopupOpen()) {
            this.calendarElement = this.leftCalendar;
            this.calendarNavigation(e, this.calendarElement);
        }
    }
    private calendarNavigation(e: MouseEvent | KeyboardEvent, element: HTMLElement): void {
        this.table = <HTMLElement>element.querySelector('table');
        this.headerTitleElement = <HTMLElement>element.querySelector('.e-title');
        this.tableBodyElement = <HTMLElement>element.querySelector('tbody');
        this.tableHeadElement = <HTMLElement>element.querySelector('thead');
        this.contentElement = <HTMLElement>element.querySelector('.e-content');
        this.updateCalendarElement(element);
        super.navigateTitle(e);
        this.updateNavIcons();
    }
    private rightNavTitle(e: MouseEvent): void {
        if (this.isPopupOpen()) {
            this.calendarElement = this.rightCalendar;
            this.calendarNavigation(e, this.calendarElement);
        }
    }
    protected clickEventEmitter(e: MouseEvent): void {
        if (!this.isMobile) {
            if (closest(<HTMLElement>e.target, '.e-calendar.e-left-calendar')) {
                this.calendarElement = this.leftCalendar;
                this.updateCalendarElement(this.leftCalendar);
            } else {
                this.calendarElement = this.rightCalendar;
                this.updateCalendarElement(this.rightCalendar);
            }

        }
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Gets the current view of the Calendar.
     *
     * @returns {string}
     * @private
     * @hidden
     */
    public currentView(): string {
        return super.currentView();
    }
    /* eslint-enable valid-jsdoc, jsdoc/require-returns-description */
    protected getCalendarView(view: string): CalendarView {
        if (view === 'Year') {
            return 'Year';
        } else if (view === 'Decade') {
            return 'Decade';
        } else {
            return 'Month';
        }
    }
    protected navigatedEvent(e: MouseEvent): void {
        this.trigger('navigated', this.navigatedArgs);
        if (!isNullOrUndefined(this.popupObj)) {
            let element: HTMLElement;
            const view: CalendarView = this.getCalendarView(this.currentView());
            if (this.isMobile) {
                if (view === this.depth) {
                    this.bindCalendarCellEvents();
                    this.deviceNavigation();
                    this.removeFocusedDate();
                    this.checkMinMaxDays();
                } else {
                    this.selectableDates();
                }
            } else {
                if (!this.isMobile && view === this.depth) {
                    element = this.calendarElement.classList.contains('e-left-calendar') ? this.leftCalendar : this.rightCalendar;
                    if (element === this.leftCalendar && ((e && !(<HTMLElement>e.currentTarget).children[0].classList.contains('e-icons'))
                        || (!isNullOrUndefined(this.controlDown)))) {
                        this.leftCalCurrentDate = new Date(+this.currentDate);
                        this.effect = '';
                        this.currentDate = this.leftCalCurrentDate;
                        this.updateCalendarElement(this.leftCalendar);
                        this.updateControl(this.leftCalendar);
                        this.updateCalendarElement(this.rightCalendar);
                        super.navigateTo.call(this, view, this.rightCalCurrentDate);
                        const customDate: Date = this.rightCalCurrentDate ? this.rightCalCurrentDate : this.currentDate;
                        this.updateControl(this.rightCalendar, customDate);
                        this.updateNavIcons();
                        this.calendarIconEvent();
                        this.calendarIconRipple();
                        this.controlDown = null;
                    } else if (e && !(<HTMLElement>e.currentTarget).children[0].classList.contains('e-icons')
                        || (!isNullOrUndefined(this.controlDown))) {
                        this.rightCalCurrentDate = new Date(+this.currentDate);
                        this.effect = '';
                        this.currentDate = this.rightCalCurrentDate;
                        this.updateCalendarElement(this.rightCalendar);
                        this.updateControl(this.rightCalendar);
                        this.updateCalendarElement(this.leftCalendar);
                        if (this.startValue && isNullOrUndefined(this.endValue)) {
                            if (view === 'Month' && this.startValue.getMonth() < this.rightCalCurrentDate.getMonth() &&
                                this.startValue.getFullYear() <= this.rightCalCurrentDate.getFullYear()) {
                                super.navigateTo.call(this, view, new Date(+this.startValue));
                            } else if (view === 'Year' && this.startValue.getFullYear() < this.rightCalCurrentDate.getFullYear()) {
                                super.navigateTo.call(this, view, new Date(+this.startValue));
                            } else {
                                super.navigateTo.call(this, view, this.leftCalCurrentDate);
                            }
                        } else {
                            super.navigateTo.call(this, view, this.leftCalCurrentDate);
                        }
                        this.updateControl(this.leftCalendar);
                        this.updateNavIcons();
                        this.calendarIconEvent();
                        this.calendarIconRipple();
                        this.controlDown = null;
                    }
                    this.checkMinMaxDays();
                } else {
                    this.updateNavIcons();
                    this.calendarIconEvent();
                }
            }
        }
    }
    private createControl(): void {
        const controlContainer: HTMLElement = this.createElement('div', { className: RANGECONTAINER });
        const headerContainer: HTMLElement = this.createElement('div', { className: RANGEHEADER });
        if (this.isMobile && this.fullScreenMode) {
            const modelHeaderIconWrapper: any = this.createElement('div', { className: 'e-model-header-wrapper' });
            const modelCloseIcon: any = this.createElement('span', { className: 'e-popup-close' });
            EventHandler.add(modelCloseIcon, 'mousedown touchstart', this.modelRangeCloseHandler, this);
            const modelApplyButton: any = this.createElement('span', { className: 'e-apply' });
            EventHandler.add(modelApplyButton, 'mousedown touchstart', this.applyFunction, this);
            modelHeaderIconWrapper.appendChild(modelCloseIcon);
            modelHeaderIconWrapper.appendChild(modelApplyButton);
            headerContainer.appendChild(modelHeaderIconWrapper);
        }
        const labelContainer: HTMLElement = this.createRangeHeader();
        headerContainer.appendChild(labelContainer);
        const daySpan: HTMLElement = this.createElement('div', { className: DAYSPAN });
        daySpan.textContent = this.l10n.getConstant('selectedDays');
        headerContainer.appendChild(daySpan);
        const separator: HTMLElement = this.createElement('div', { className: SEPARATOR });
        const calendarContainer: HTMLElement = this.createCalendar();
        controlContainer.appendChild(headerContainer);
        controlContainer.appendChild(separator);
        controlContainer.appendChild(calendarContainer);
        const footerSection: HTMLElement = this.createElement('div', { className: FOOTER });
        const cancelBtn: HTMLButtonElement = <HTMLButtonElement>this.createElement('button', { className: CANCEL + ' ' + FLAT + ' ' + CSS });
        const applyBtn: HTMLButtonElement = <HTMLButtonElement>this.createElement('button');
        addClass([applyBtn], [APPLY, FLAT, PRIMARY, CSS]);
        footerSection.appendChild(applyBtn);
        footerSection.appendChild(cancelBtn);
        const enable: boolean = !isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue);
        this.cancelButton = new Button({ content: this.l10n.getConstant('cancelText') }, cancelBtn);
        this.applyButton = new Button({ content: this.l10n.getConstant('applyText'), disabled: !enable }, applyBtn);
        EventHandler.add(applyBtn, 'click', this.applyFunction, this);
        EventHandler.add(cancelBtn, 'click', this.cancelFunction, this);
        this.popupWrapper.appendChild(controlContainer);
        if (!this.isMobile) {
            if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
                this.createPresets();
                this.listRippleEffect();
                addClass([controlContainer], RANGEBORDER);
                addClass([this.popupWrapper], 'e-preset-wrapper');
                const presets: HTMLElement = <HTMLElement>this.popupWrapper.querySelector('.' + PRESETS);
                presets.style.height = this.popupWrapper.querySelector('.' + RANGECONTAINER).getBoundingClientRect().height + 'px';
            }
        }
        this.popupWrapper.appendChild(footerSection);
        if (this.isMobile) {
            this.deviceHeaderUpdate();
        }
        this.renderPopup();
    }

    private modelRangeCloseHandler(e: MouseEvent| TouchEvent): void {
        this.hide();
    }

    private cancelFunction(eve?: MouseEvent): void {
        if (document.activeElement !== this.inputElement) {
            this.preventFocus = true;
            this.inputElement.focus();
            addClass([this.inputWrapper.container], [INPUTFOCUS]);
        }
        eve.preventDefault();
        if (this.isKeyPopup) {
            this.inputElement.focus();
            this.isKeyPopup = false;
        }
        this.startValue = null;
        this.endValue = null;
        this.removeSelection();
        this.hide(eve);
    }
    private deviceHeaderUpdate(): void {
        if (isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue)) {
            this.endButton.element.setAttribute('disabled', '');
            this.startButton.element.classList.add(ACTIVE);
        } else if (!isNullOrUndefined(this.startValue)) {
            this.startButton.element.classList.add(ACTIVE);
        }
    }
    private applyFunction(eve?: MouseEvent | KeyboardEventArgs): void {
        let isValueChanged: boolean = false;
        if (eve.type !== 'touchstart') {
            eve.preventDefault();
        }
        if (this.closeEventArgs && this.closeEventArgs.cancel) {
            this.startValue = this.popupWrapper.querySelector('.e-start-date') &&
                this.getIdValue(null, this.popupWrapper.querySelector('.e-start-date'));
            this.endValue = this.popupWrapper.querySelector('.e-end-date') &&
                this.getIdValue(null, this.popupWrapper.querySelector('.e-end-date'));
            this.setValue();
        }
        if (document.activeElement !== this.inputElement) {
            this.preventFocus = true;
            this.inputElement.focus();
            addClass([this.inputWrapper.container], [INPUTFOCUS]);
        }
        if (eve.type !== 'touchstart' &&
            this.closeEventArgs && !this.closeEventArgs.cancel) {
            eve.preventDefault();
        }
        if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
            if (!(this.previousStartValue && this.previousEndValue &&
                this.startValue.getDate() === this.previousStartValue.getDate() &&
                this.startValue.getMonth() === this.previousStartValue.getMonth() &&
                this.startValue.getFullYear() === this.previousStartValue.getFullYear()
                && this.endValue.getDate() === this.previousEndValue.getDate() &&
                this.endValue.getMonth() === this.previousEndValue.getMonth()
                && this.endValue.getFullYear() === this.previousEndValue.getFullYear())) {
                Input.setValue(this.rangeArgs(eve).text, this.inputElement, this.floatLabelType, this.showClearButton);
            }
            this.previousStartValue = new Date(+this.startValue);
            this.previousEndValue = new Date(+this.endValue);
            this.previousEleValue = this.inputElement.value;
            if (+this.initStartDate !== +this.startValue || +this.initEndDate !== +this.endValue) {
                isValueChanged = true;
            }
            this.changeTrigger(eve);
            this.hide(eve ? eve : null);
            this.errorClass();
            isValueChanged = true;
        } else {
            this.hide(eve ? eve : null);
        }
        if (!(closest(eve.target as HTMLElement, '.' + INPUTCONTAINER))
        && (!isValueChanged)) {
            this.focusOut();
        }
        if (!this.isMobile) {
            this.isKeyPopup = false;
            if (this.isRangeIconClicked) {
                (<HTMLElement>this.inputWrapper.container.children[1]).focus();
                this.keyInputConfigs = (extend(this.keyInputConfigs, this.keyConfigs) as { [key: string]: string });
                this.popupKeyboardModule = new KeyboardEvents(
                    <HTMLElement>this.inputWrapper.container.children[1],
                    {
                        eventName: 'keydown',
                        keyConfigs: this.keyInputConfigs,
                        keyAction: this.popupKeyActionHandle.bind(this)
                    });
            }
        }
    }
    private onMouseClick(event: MouseEvent | KeyboardEventArgs, item?: Element): void {
        if (event.type === 'touchstart') {
            return;
        }
        const target: Element = item || <Element>event.target;
        const li: HTMLElement = <HTMLElement>closest(target, '.' + LISTCLASS);
        const isClick: boolean = li && li.classList.contains(ACTIVE);
        if (li && li.classList.contains(LISTCLASS)) {
            this.setListSelection(li, event);
        }
        this.preventFocus = true;
        this.inputElement.focus();
        if (!this.isMobile) {
            this.preventFocus = true;
            if (li && li.classList.contains(LISTCLASS) && li.getAttribute('id') === 'custom_range') {
                (<HTMLElement>this.leftCalendar.children[1].firstElementChild).focus();
            } else {
                if (!isClick && event.type === 'keydown') {
                    this.inputElement.focus();
                }
            }
        }
    }
    private onMouseOver(event: MouseEvent): void {
        const li: HTMLElement = <HTMLElement>closest(<Element>event.target, '.' + LISTCLASS);
        if (li && li.classList.contains(LISTCLASS) && !li.classList.contains(HOVER)) {
            addClass([li], HOVER);
        }
    }
    private onMouseLeave(event: MouseEvent): void {
        const item: HTMLElement = <HTMLElement>closest(<Element>event.target, '.' + HOVER);
        if (!isNullOrUndefined(item)) {
            removeClass([item], HOVER);
        }
    }
    private setListSelection(li: HTMLElement, event: MouseEvent | KeyboardEventArgs): void {
        if (li && (!li.classList.contains(ACTIVE) || (this.isMobile && li.classList.contains(ACTIVE)))) {
            if (this.isMobile && li.classList.contains(ACTIVE)) {
                this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(li);
                const values: { [key: string]: Object } = this.presetsItem[this.activeIndex];
                if (values.id === 'custom_range') {
                    this.renderCustomPopup();
                    return;
                }
                return;
            }
            this.removeListSelection();
            this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(li);
            addClass([li], ACTIVE);
            li.setAttribute('aria-selected', 'true');
            const values: { [key: string]: Object } = this.presetsItem[this.activeIndex];
            if (values.id === 'custom_range') {
                this.renderCustomPopup();
            } else {
                this.applyPresetRange(values, event);
            }
        }
    }
    private removeListSelection(): void {
        const item: HTMLElement = <HTMLElement>this.presetElement.querySelector('.' + ACTIVE);
        if (!isNullOrUndefined(item)) {
            removeClass([item], ACTIVE);
            item.removeAttribute('aria-selected');
        }
    }
    private setValue(): void {
        this.modelValue = [this.startValue, this.endValue];
    }
    private applyPresetRange(values: { [key: string]: Object }, e: MouseEvent | KeyboardEventArgs): void {
        this.hide(null);
        this.presetsItem[this.presetsItem.length - 1].start = null;
        this.presetsItem[this.presetsItem.length - 1].end = null;
        this.startValue = <Date>values.start;
        this.endValue = <Date>values.end;
        this.setValue();
        this.refreshControl();
        this.trigger('select', this.rangeArgs(e));
        this.changeTrigger(e);
        this.previousEleValue = this.inputElement.value;
        this.isCustomRange = false;
        this.leftCalendar = this.rightCalendar = null;
        if (this.isKeyPopup) {
            this.isRangeIconClicked = false;
            this.inputElement.focus();
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private showPopup(element?: HTMLElement, event?: MouseEvent | KeyboardEventArgs | Event): void {
        this.presetHeight();
        if (this.zIndex === 1000) {
            this.popupObj.show(null, this.element);
        } else {
            this.popupObj.show(null, null);
        }
        if (this.isMobile) {
            this.popupObj.refreshPosition();
        }

    }
    private renderCustomPopup(): void {
        this.isCustomWindow = true;
        this.popupObj.hide();
        this.popupWrapper = this.createElement('div', { id: this.element.id + '_popup', className: ROOT + ' ' + POPUP });
        this.renderControl();
        this.openEventArgs = {
            popup: this.popupObj || null,
            cancel: false,
            date: this.inputElement.value,
            model: this,
            event: event ? event : null,
            appendTo: this.isMobile || Browser.isDevice ? this.mobileRangePopupWrap : document.body
        };
        const eventArgs: RangePopupEventArgs = this.openEventArgs;
        this.trigger('open', eventArgs, (eventArgs: RangePopupEventArgs) => {
            this.openEventArgs = eventArgs;
            if (this.openEventArgs.cancel) {
                return;
            }
        });
        this.openEventArgs.appendTo.appendChild(this.popupWrapper);
        this.showPopup();
        this.isCustomRange = true;
        if (!this.isMobile) {
            this.calendarFocus();
        }
    }
    private listRippleEffect(): void {
        for (const li of this.liCollections) {
            rippleEffect(li);
        }
    }
    private createPresets(): void {
        if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
            this.presetElement = this.createElement('div', { className: PRESETS, attrs: { 'tabindex': '0' } });
            const listTag: HTMLElement = ListBase.createList(this.createElement, this.presetsItem, null, true);
            attributes(listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options', 'tabindex': '0', 'aria-label': 'daterangepicker-preset' });
            this.presetElement.appendChild(listTag);
            this.popupWrapper.appendChild(this.presetElement);
            const customElement: HTMLElement = this.presetElement.querySelector('#custom_range');
            if (!isNullOrUndefined(customElement)) {
                customElement.textContent = this.l10n.getConstant('customRange') !== '' ? this.l10n.getConstant('customRange')
                    : 'Custom Range';
            }
            this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.presetElement.querySelectorAll('.' + LISTCLASS);
            this.wireListEvents();
            if (this.isMobile) {
                if (this.fullScreenMode) {
                    const modelWrapper: HTMLElement = createElement('div', { className: 'e-range-mob-popup-wrap' });
                    const modelHeader: HTMLElement = this.createElement('div', { className: 'e-model-header' });
                    const modelTitleSpan: any = this.createElement('span', { className: 'e-model-title' });
                    modelTitleSpan.textContent = 'Select Preset';
                    const modelCloseIcon: any = this.createElement('span', { className: 'e-popup-close' });
                    EventHandler.add(modelCloseIcon, 'mousedown touchstart', this.modelRangeCloseHandler, this);
                    const presetContent: HTMLElement = this.presetElement;
                    modelHeader.appendChild(modelCloseIcon);
                    modelHeader.appendChild(modelTitleSpan);
                    modelWrapper.appendChild(modelHeader);
                    modelWrapper.appendChild(presetContent);
                    this.popupWrapper.insertBefore(modelWrapper, this.popupWrapper.firstElementChild);
                    this.presetElement.style.width = '100%';
                } else {
                    this.presetElement.style.width = this.inputWrapper.container.getBoundingClientRect().width + 'px';
                }
            }
            if (!isNullOrUndefined(this.activeIndex) && this.activeIndex > -1) {
                addClass([this.liCollections[this.activeIndex]], ACTIVE);
            }
        }
    }
    private wireListEvents(): void {
        EventHandler.add(this.presetElement, 'click', this.onMouseClick, this);
        if (!this.isMobile) {
            EventHandler.add(this.presetElement, 'mouseover', this.onMouseOver, this);
            EventHandler.add(this.presetElement, 'mouseout', this.onMouseLeave, this);
        }
    }
    private unWireListEvents(): void {
        if (!isNullOrUndefined(this.presetElement)) {
            EventHandler.remove(this.presetElement, 'click touchstart', this.onMouseClick);
            if (!this.isMobile) {
                EventHandler.remove(this.presetElement, 'mouseover', this.onMouseOver);
                EventHandler.remove(this.presetElement, 'mouseout', this.onMouseLeave);
            }
        }
    }
    private renderPopup(): void {
        this.popupWrapper.classList.add('e-control');
        const popupWidth: number = this.popupWrapper.getBoundingClientRect().width;
        if (!isNullOrUndefined(this.cssClass) && this.cssClass.trim() !== '') {
            this.popupWrapper.className += ' ' + this.cssClass;
        }
        if (this.isMobile && this.isCustomWindow) {
            this.modal = this.createElement('div');
            document.body.appendChild(this.modal);
        }
        this.popupObj = new Popup(this.popupWrapper as HTMLElement, {
            relateTo: this.isMobile && this.isCustomWindow ? document.body :
                (!isNullOrUndefined(this.targetElement) ? this.targetElement : this.inputWrapper.container),
            position: (this.isMobile ?
                (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && !this.isCustomWindow ?
                    { X: 'left', Y: 'bottom' } : { X: 'center', Y: 'center' }) :
                this.enableRtl ? { X: 'left', Y: 'bottom' } : { X: 'right', Y: 'bottom' }),
            offsetX: this.isMobile || this.enableRtl ? 0 : -popupWidth,
            offsetY: OFFSETVALUE,
            collision: this.isMobile ?
                (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && !this.isCustomWindow ?
                    { X: 'fit' } : { X: 'fit', Y: 'fit' }) : { X: 'fit', Y: 'flip' },
            targetType: this.isMobile && this.isCustomWindow ? 'container' : 'relative',
            enableRtl: this.enableRtl,
            zIndex: this.zIndex,
            open: () => {
                if (this.isMobile && this.fullScreenMode) {
                    this.iconRangeRight = this.calendarElement && window.getComputedStyle(this.calendarElement.querySelector('.e-header.e-month .e-prev')).cssFloat;
                    if (this.iconRangeRight) {
                        this.touchRangeModule = new Touch(<HTMLElement>this.calendarElement.querySelector('.e-content.e-month'), {
                            swipe: this.dateRangeSwipeHandler.bind(this)
                        });
                        EventHandler.add(<HTMLElement>this.calendarElement.querySelector('.e-content.e-month'), 'touchstart', this.touchStartRangeHandler, this);
                    }
                }
                attributes(this.inputElement, { 'aria-expanded': 'true', 'aria-owns': this.element.id, 'aria-controls': this.inputElement.id });
                if (this.value){
                    attributes(this.inputElement, { 'aria-activedescendant': this.inputElement.id});
                }
                else{
                    this.inputElement.removeAttribute('aria-activedescendant');
                }
                addClass([this.inputWrapper.buttons[0]], ACTIVE);
                if (!this.isMobile) {
                    if (this.cancelButton) {
                        this.btnKeyboardModule = new KeyboardEvents(
                            <HTMLElement>this.cancelButton.element,
                            {
                                eventName: 'keydown',
                                keyAction: this.popupKeyActionHandle.bind(this),
                                keyConfigs: { tab: 'tab', altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                            });
                        this.btnKeyboardModule = new KeyboardEvents(
                            <HTMLElement>this.applyButton.element,
                            {
                                eventName: 'keydown',
                                keyAction: this.popupKeyActionHandle.bind(this),
                                keyConfigs: { altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                            });
                    }
                    if (!isNullOrUndefined(this.leftCalendar)) {
                        if (!this.isRangeIconClicked) {
                            this.calendarFocus();
                        }
                    }
                    if (!isNullOrUndefined(this.presetElement)) {
                        this.keyInputConfigs = (extend(this.keyInputConfigs, this.keyConfigs) as { [key: string]: string });
                        this.presetKeyboardModule = new KeyboardEvents(
                            <HTMLElement>this.presetElement,
                            {
                                eventName: 'keydown',
                                keyAction: this.presetKeyActionHandler.bind(this),
                                keyConfigs: this.keyInputConfigs
                            });
                        this.presetKeyboardModule = new KeyboardEvents(
                            <HTMLElement>this.presetElement,
                            {
                                eventName: 'keydown',
                                keyAction: this.popupKeyActionHandle.bind(this),
                                keyConfigs: { altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                            });
                        if (isNullOrUndefined(this.leftCalendar)) {
                            this.preventBlur = true;
                            this.presetElement.focus();
                        } else {
                            this.presetElement.setAttribute('tabindex', '-1');
                        }
                    }
                    this.popupKeyBoardHandler();
                }
                if (this.isMobile && !Browser.isDevice) {
                    EventHandler.add(document, 'keydown', this.popupCloseHandler, this);
                }
            },
            close: () => {
                attributes(this.inputElement, { 'aria-expanded': 'false' });
                this.inputElement.removeAttribute('aria-owns');
                this.inputElement.removeAttribute('aria-controls');
                this.inputElement.removeAttribute('aria-activedescendant');
                removeClass([this.inputWrapper.buttons[0]], ACTIVE);
                if (this.isRangeIconClicked) {
                    (this.inputWrapper.container.children[1] as HTMLElement).focus();
                }
                if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
                    this.unWireListEvents();
                }
                if (this.applyButton) {
                    this.applyButton.destroy();
                }
                if (this.cancelButton) {
                    this.cancelButton.destroy();
                }
                if (this.isMobile && this.endButton) {
                    this.endButton.destroy();
                }
                if (this.isMobile && this.startButton) {
                    this.startButton.destroy();
                }
                if (!isNullOrUndefined(this.popupObj)) {
                    if (!isNullOrUndefined(this.popupObj.element.parentElement)) {
                        detach(this.popupObj.element);
                    }
                    this.popupObj.destroy();
                    this.popupObj = null;
                }
                if (this.isMobile && !Browser.isDevice) {
                    EventHandler.remove(document, 'keydown', this.popupCloseHandler);
                }
            }, targetExitViewport: () => {
                const popupEle: HTMLElement = this.popupObj && this.popupObj.element;
                if (!Browser.isDevice && popupEle &&  popupEle.getBoundingClientRect().height < window.innerHeight) {
                    this.hide();
                }
            }
        });

        if (this.isMobile) {
            this.popupObj.element.classList.add(DEVICE);
        }
        if (this.isMobile && this.isCustomWindow) {
            addClass([this.modal], [DEVICE, ROOT, 'e-range-modal']);
            document.body.className += ' ' + OVERFLOW;
            this.modal.style.display = 'block';
        }
        EventHandler.add(document, 'mousedown touchstart', this.documentHandler, this);
    }

    private dateRangeSwipeHandler(e: SwipeEventArgs): void {
        let direction: number = 0;
        if (this.iconRangeRight === 'left') {
            switch (e.swipeDirection) {
            case 'Left':
                direction = 1;
                break;
            case 'Right':
                direction = -1;
                break;
            default:
                break;
            }
        } else {
            switch (e.swipeDirection) {
            case 'Up':
                direction = 1;
                break;
            case 'Down':
                direction = -1;
                break;
            default:
                break;
            }
        }
        if (this.touchRangeStart) {
            if (direction === 1) {
                this.navigateNext(e);
            } else if (direction === -1) {
                this.navigatePrevious(e);
            }
            this.touchRangeStart = false;
        }
    }

    private touchStartRangeHandler(e: MouseEvent): void {
        this.touchRangeStart = true;
    }

    protected popupCloseHandler(e: KeyboardEventArgs): void {
        switch (e.keyCode) {
        case 27:
            this.hide(e);
            break;
        }
    }

    private calendarFocus(): void {
        const startDate: Element = this.popupObj && this.popupObj.element.querySelector('.' + STARTDATE);
        if (startDate) {
            let ele: HTMLElement = <HTMLElement>closest(startDate, '.' + RIGHTCALENDER);
            ele = isNullOrUndefined(ele) ? this.leftCalendar : ele;
            if (this.isRangeIconClicked) {
                (<HTMLElement>this.inputWrapper.container).focus();
            } else {
                this.preventBlur = true;
                (<HTMLElement>ele.children[1].firstElementChild).focus();
            }
            addClass([startDate], FOCUSDATE);
        } else {
            if (this.isRangeIconClicked) {
                (<HTMLElement>this.inputWrapper.container).focus();
            } else {
                this.preventBlur = true;
                (<HTMLElement>this.leftCalendar.children[1].firstElementChild).focus();
            }

        }
    }
    private presetHeight(): void {
        const presets: HTMLElement = this.popupObj && <HTMLElement>this.popupObj.element.querySelector('.' + PRESETS);
        const rangeContainer: HTMLElement = this.popupObj && <HTMLElement>this.popupObj.element.querySelector('.' + RANGECONTAINER);
        if (!isNullOrUndefined(presets) && !isNullOrUndefined(rangeContainer)) {
            presets.style.height = rangeContainer.getBoundingClientRect().height + 'px';
        }
    }
    private presetKeyActionHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
        case 'moveDown':
            this.listMoveDown(e);
            this.setScrollPosition();
            e.preventDefault();
            break;
        case 'moveUp':
            this.listMoveUp(e);
            this.setScrollPosition();
            e.preventDefault();
            break;
        case 'enter': {
            const hvrItem: HTMLElement = this.getHoverLI();
            const actItem: HTMLElement = this.getActiveLI();
            if (!isNullOrUndefined(this.leftCalendar) && !isNullOrUndefined(actItem)) {
                if (isNullOrUndefined(hvrItem) || (!isNullOrUndefined(actItem) && actItem === hvrItem)) {
                    this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(actItem);
                    const values: { [key: string]: Object } = this.presetsItem[this.activeIndex];
                    if (values.id === 'custom_range') {
                        this.calendarFocus();
                        actItem.classList.remove(HOVER);
                        e.preventDefault();
                        return;
                    }
                }
            }
            if (!isNullOrUndefined(hvrItem) || !isNullOrUndefined(actItem)) {
                this.onMouseClick(e, hvrItem || actItem);
            }
            e.preventDefault();
        }
            break;
        case 'tab':
            if (this.leftCalendar) {
                const item: HTMLElement = this.getHoverLI();
                if (!isNullOrUndefined(item)) {
                    item.classList.remove(HOVER);
                }
            } else {
                this.hide(e);
                e.preventDefault();
            }
            break;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private listMoveDown(e: KeyboardEventArgs): void {
        const hvrItem: HTMLElement = this.getHoverLI();
        const actItem: HTMLElement = this.getActiveLI();
        if (!isNullOrUndefined(hvrItem)) {
            const li: HTMLElement = <HTMLElement>hvrItem.nextElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                removeClass([hvrItem], HOVER);
                addClass([li], HOVER);
            }
        } else if (!isNullOrUndefined(actItem)) {
            const li: HTMLElement = <HTMLElement>actItem.nextElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                addClass([li], HOVER);
            }
        } else {
            addClass([this.liCollections[0]], HOVER);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private listMoveUp(e: KeyboardEventArgs): void {
        const hvrItem: HTMLElement = this.getHoverLI();
        const actItem: HTMLElement = this.getActiveLI();
        if (!isNullOrUndefined(hvrItem)) {
            const li: HTMLElement = <HTMLElement>hvrItem.previousElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                removeClass([hvrItem], HOVER);
                addClass([li], HOVER);
            }
        } else if (!isNullOrUndefined(actItem)) {
            const li: HTMLElement = <HTMLElement>actItem.previousElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                addClass([li], HOVER);
            }
        }
    }
    private getHoverLI(): HTMLElement {
        const item: HTMLElement = <HTMLElement>this.presetElement.querySelector('.' + HOVER);
        return item;
    }
    private getActiveLI(): HTMLElement {
        const item: HTMLElement = <HTMLElement>this.presetElement.querySelector('.' + ACTIVE);
        return item;
    }
    private popupKeyBoardHandler(): void {
        this.popupKeyboardModule = new KeyboardEvents(
            <HTMLElement>this.popupWrapper,
            {
                eventName: 'keydown',
                keyAction: this.popupKeyActionHandle.bind(this),
                keyConfigs: { escape: 'escape' }
            });
        this.keyInputConfigs = (extend(this.keyInputConfigs, this.keyConfigs) as { [key: string]: string });
        this.popupKeyboardModule = new KeyboardEvents(
            <HTMLElement>this.inputWrapper.container.children[1],
            {
                eventName: 'keydown',
                keyAction: this.popupKeyActionHandle.bind(this),
                keyConfigs: this.keyInputConfigs
            });
    }
    private setScrollPosition(): void {
        const listHeight: number = this.presetElement.getBoundingClientRect().height;
        const hover: HTMLElement = <HTMLElement>this.presetElement.querySelector('.' + HOVER);
        const active: HTMLElement = <HTMLElement>this.presetElement.querySelector('.' + ACTIVE);
        const element: HTMLElement = !isNullOrUndefined(hover) ? hover : active;
        if (!isNullOrUndefined(element)) {
            const nextEle: Element = element.nextElementSibling;
            const height: number = nextEle ? (<HTMLElement>nextEle).offsetTop : element.offsetTop;
            const liHeight: number = element.getBoundingClientRect().height;
            if ((height + element.offsetTop) > listHeight) {
                this.presetElement.scrollTop = nextEle ? (height - (listHeight / 2 + liHeight / 2)) : height;
            } else {
                this.presetElement.scrollTop = 0;
            }
        }
    }
    private popupKeyActionHandle(e: KeyboardEventArgs): void {
        const presetElement: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + PRESETS);
        switch (e.action) {
        case 'escape':
            if (this.isPopupOpen()) {
                if (this.isKeyPopup) {
                    this.inputElement.focus();
                    this.isKeyPopup = false;
                }
                this.hide(e);
            } else {
                (this.inputWrapper.container.children[1] as HTMLElement).blur();
            }
            break;
        case 'enter':
            if (!this.isPopupOpen()) {
                this.show(null, e);
            } else {
                (this.inputWrapper.container.children[1] as HTMLElement).focus();
            }
            break;
        case 'tab':
            this.hide(e);
            break;
        case 'altRightArrow':
            if (!isNullOrUndefined(presetElement)) {
                this.cancelButton.element.focus();
            } else {
                if (document.activeElement === this.cancelButton.element && this.applyButton.element.disabled !== true) {
                    this.applyButton.element.focus();
                } else {
                    (<HTMLElement>this.leftCalendar.children[1].firstElementChild).focus();
                }
            }
            e.preventDefault();
            break;
        case 'altLeftArrow':
            if (!isNullOrUndefined(presetElement)) {
                (<HTMLElement>this.rightCalendar.children[1].firstElementChild).focus();
            } else {
                if (document.activeElement === this.applyButton.element && this.applyButton.element.disabled !== true) {
                    this.cancelButton.element.focus();
                } else {
                    if (!isNullOrUndefined(this.presetElement) && (document.activeElement === this.cancelButton.element)) {
                        this.presetElement.focus();
                    } else {
                        (<HTMLElement>this.rightCalendar.children[1].firstElementChild).focus();
                    }
                }
            }
            e.preventDefault();
            break;
        }
    }
    private documentHandler(e: MouseEvent): void {
        if (isNullOrUndefined(this.popupObj)) {
            return;
        }
        const target: HTMLElement = <HTMLElement>e.target;
        if (!this.inputWrapper.container.contains(target as Node) ||
            (!isNullOrUndefined(this.popupObj) && !closest(target, '[id="' + this.popupWrapper.id + '"]') && e.type !== 'mousedown')) {
            if (e.type !== 'touchstart' && ((e.type === 'mousedown') ||
                this.closeEventArgs && !this.closeEventArgs.cancel)) {
                e.preventDefault();
            }
        }
        if ((isNullOrUndefined(this.targetElement) ||
            (!isNullOrUndefined(this.targetElement) && !(target === this.targetElement))) &&
            !(closest(target, '[id="' + this.popupWrapper.id + '"]'))
            && !(closest(target, '.' + INPUTCONTAINER) === this.inputWrapper.container)
            && !(closest(target, '.e-daterangepicker.e-popup') && (!target.classList.contains('e-day'))) && (!target.classList.contains('e-dlg-overlay'))) {
            this.preventBlur = false;
            if (this.isPopupOpen() && document.body.contains(this.popupObj.element)) {
                this.applyFunction(e);
                if (!this.isMobile) {
                    this.isRangeIconClicked = false;
                }
            }
        }
    }
    private createInput(): void {
        if (this.fullScreenMode && this.isMobile){
            this.cssClass += ' ' + 'e-popup-expand';
        }
        let updatedCssClassValue: string = this.cssClass;
        if (!isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            updatedCssClassValue = (this.cssClass.replace(/\s+/g, ' ')).trim();
        }
        this.inputWrapper = Input.createInput(
            {
                floatLabelType: this.floatLabelType,
                element: this.inputElement,
                properties: {
                    readonly: this.readonly,
                    placeholder: this.placeholder,
                    cssClass: updatedCssClassValue,
                    enabled: this.enabled,
                    enableRtl: this.enableRtl,
                    showClearButton: this.showClearButton
                },
                buttons: [DATERANGEICON]
            },
            this.createElement
        );
        attributes(this.inputElement, {
            'tabindex': '0', 'aria-expanded': 'false', 'role': 'combobox',
            'autocomplete': 'off', 'aria-disabled': !this.enabled ? 'true' : 'false',
            'autocapitalize': 'off', 'spellcheck': 'false'
        });
        if (Browser.isIos) {
            attributes(this.inputElement, { 'autocorrect': 'off' });
        }
        Input.addAttributes({ 'aria-label': 'select', 'role': 'button' }, this.inputWrapper.buttons[0]);
        // if (!isNullOrUndefined(this.placeholder) && this.placeholder.trim() !== '') {
        //     Input.addAttributes({ 'aria-placeholder': this.placeholder }, this.inputElement);
        // }
        this.setEleWidth(this.width);
        addClass([this.inputWrapper.container], DATERANGEWRAPPER);
        if (isNullOrUndefined(this.inputElement.getAttribute('name'))) {
            attributes(this.inputElement, { 'name': this.element.id });
        }
        if (this.inputElement.type === 'hidden') {
            this.inputWrapper.container.style.display = 'none';
        }
        this.refreshControl();
        this.previousEleValue = this.inputElement.value;
        this.inputElement.setAttribute('value', this.inputElement.value);
        this.startCopy = this.startDate;
        this.endCopy = this.endDate;
    }

    private setEleWidth(width: number | string): void {
        if (typeof width === 'string') {
            this.inputWrapper.container.style.width = <string>(this.width);
        } else if (typeof width === 'number') {
            this.inputWrapper.container.style.width = formatUnit(this.width);
        } else {
            this.inputWrapper.container.style.width = '100%';
        }
    }

    private adjustLongHeaderWidth(): void {
        if (this.dayHeaderFormat === 'Wide') {
            addClass([this.popupWrapper], DAYHEADERLONG);
        }
    }

    private refreshControl(): void {
        this.validateMinMax();

        if (this.strictMode) {
            this.validateRangeStrict();
        }
        const isDisabled: boolean = this.disabledDates();
        if (this.strictMode && (isDisabled)) {
            this.startValue = this.previousStartValue;
            this.setProperties({ startDate: this.startValue }, true);
            this.endValue = this.previousEndValue;
            this.setProperties({ endDate: this.endValue }, true);
            this.setValue();
        }
        this.updateInput();
        if (!this.strictMode) {
            this.validateRange();
        }
        if (!this.strictMode && (isDisabled)) {
            this.clearRange();

        }
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue) &&
         !isDisabled && !isNullOrUndefined(this.renderDayCellArgs) && this.renderDayCellArgs.isDisabled) {
            this.disabledDateRender();
        }
        this.errorClass();
        this.previousStartValue = isNullOrUndefined(this.startValue) || isNaN(+this.startValue) ? null : new Date(+this.startValue);
        this.previousEndValue = isNullOrUndefined(this.endValue) || isNaN(+this.endValue) ? null : new Date(+this.endValue);
    }
    private updateInput(): void {
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            const formatOption: object = { format: this.formatString, type: 'date', skeleton: 'yMd' };
            const startDate: string = this.globalize.formatDate(this.startValue, formatOption);
            const endDate: string = this.globalize.formatDate(this.endValue, formatOption);
            Input.setValue(startDate + ' ' + this.separator + ' ' + endDate, this.inputElement, this.floatLabelType, this.showClearButton);
            this.previousStartValue = new Date(+this.startValue);
            this.previousEndValue = new Date(+this.endValue);
        }
        if (!this.strictMode && isNullOrUndefined(this.value) && this.invalidValueString) {
            Input.setValue(this.invalidValueString, this.inputElement, this.floatLabelType, this.showClearButton);
        }
    }

    protected checkInvalidRange(value: string | DateRange | Date[]): void {
        if (!isNullOrUndefined(value)) {
            let invalid: boolean = false;
            let startinvalue: string | Date;
            let endinvalue: string | Date;
            let startString: string = null;
            let endString: string = null;
            let valueString: string = null;
            let startObject: boolean = false;
            let endObject: boolean = false;
            let invalidobject: boolean = false;
            if (typeof (value) === 'string') {
                const range: string[] = (<string>value).split(' ' + this.separator + ' ');
                if (range.length === 2) {
                    startString = range[0];
                    endString = range[1];
                } else {
                    invalid = true;
                    valueString = value;
                }
            } else {
                if ((<Date[]>value).length > 0) {
                    startinvalue = (<Date[]>value)[0];
                    endinvalue = (<Date[]>value)[1];
                } else {
                    startinvalue = (<DateRange>value).start;
                    endinvalue = (<DateRange>value).end;
                }
                if (!(startinvalue instanceof Date) && typeof (startinvalue) !== 'object') {
                    startString = this.getstringvalue(startinvalue);
                } else if (startinvalue instanceof Date) {
                    startObject = true;
                } else if (!isNullOrUndefined(startinvalue)) {
                    invalidobject = true;
                }
                if (!(endinvalue instanceof Date) && typeof (endinvalue) !== 'object') {
                    endString = this.getstringvalue(endinvalue);
                } else if (endinvalue instanceof Date) {
                    endObject = true;
                } else if (!isNullOrUndefined(endinvalue)) {
                    invalidobject = true;
                }
            }
            if ((isNullOrUndefined(startString) && !startObject && !isNullOrUndefined(endString)) ||
                (!isNullOrUndefined(startString) && !endObject && isNullOrUndefined(endString))) {
                invalid = true;
            }
            if (invalidobject) {
                startString = endString = valueString = null;
                invalid = true;
            }
            if (startString) {
                invalid = invalid || this.checkInvalidValue(startString);
            }
            if (endString) {
                invalid = invalid || this.checkInvalidValue(endString);
            }
            if (invalid) {
                if (startObject && !invalidobject) {
                    startString = (<Date>startinvalue).toLocaleDateString();
                }
                if (endObject && !invalidobject) {
                    endString = (<Date>endinvalue).toLocaleDateString();
                }
                if (!isNullOrUndefined(startString) && !isNullOrUndefined(endString)) {
                    valueString = startString + ' ' + this.separator + ' ' + endString;
                } else if (!isNullOrUndefined(startString)) {
                    valueString = startString;
                } else if (!isNullOrUndefined(endString)) {
                    valueString = endString;
                }
                this.invalidValueString = valueString;
                this.setProperties({ value: null }, true);
                this.setProperties({ startValue: null }, true);
                this.setProperties({ endValue: null }, true);
                this.startDate = null;
                this.endDate = null;
            }
        }
    }
    private getstringvalue(value: number | string): string {
        let stringValue: string = null;
        if (!isNullOrUndefined(value) && (typeof value === 'number')) {
            stringValue = (value).toString();
        } else if (!isNullOrUndefined(value) && (typeof value === 'string')) {
            stringValue = '' + value;
        }
        return stringValue;
    }
    private checkInvalidValue(value: string): boolean {
        const valueString: string = value;
        let invalid: boolean = false;
        let formatOpt: object = null;
        formatOpt = { format: this.formatString, type: 'date', skeleton: 'yMd' };
        if (typeof valueString !== 'string') {
            invalid = true;
        } else {
            const globalize: Internationalization = new Internationalization(this.locale);
            if (!this.checkDateValue(globalize.parseDate(valueString, formatOpt))) {
                let extISOStr: RegExp = null;
                let basISOString: RegExp = null;
                // eslint-disable-next-line
                extISOStr = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
                // eslint-disable-next-line
                basISOString = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
                if ((!extISOStr.test(valueString) && !basISOString.test(valueString))
                    || (/^[a-zA-Z0-9- ]*$/).test(valueString) || isNaN(+new Date(this.checkValue(valueString)))) {
                    invalid = true;
                }
            }
        }
        return invalid;
    }
    private isDateDisabled(date: Date): boolean {
        if (isNullOrUndefined(date)) {
            return false;
        }
        const value: Date = new Date(+date);
        if (+value < +this.min || +value > +this.max) {
            return true;
        }
        this.virtualRenderCellArgs = {
            date: value,
            isDisabled: false
        };
        const args: RenderDayCellEventArgs = this.virtualRenderCellArgs;
        this.virtualRenderCellEvent(args);
        if (args.isDisabled) {
            return true;
        }
        return false;
    }
    private disabledDateRender(): void {
        this.disabledDays = [];
        this.disabledDayCnt = null;
        const localDate: Date = new Date(+this.startValue);
        let count: number = 0;
        while (+ localDate <= +this.endValue && +this.endValue <= +this.max ) {
            this.virtualRenderCellArgs = {
                date: localDate,
                isDisabled: false
            };
            const args: RenderDayCellEventArgs = this.virtualRenderCellArgs;
            this.virtualRenderCellEvent(args);
            if (args.isDisabled) {
                this.disabledDays.push(new Date(+args.date));
                if (+localDate > +this.startValue && +localDate < +this.endValue) {
                    count++;
                }
            }
            this.addDay(localDate, 1, null, this.max, this.min);
        }
        this.disabledDayCnt = count;
    }
    private virtualRenderCellEvent(args: RenderDayCellEventArgs): void {
        extend(this.virtualRenderCellArgs, { name: 'renderDayCell' });
        this.trigger('renderDayCell', args);
    }
    private disabledDates(): boolean {
        let isStartDisabled: boolean = false;
        let isEndDisabled: boolean = false;
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            isStartDisabled = this.isDateDisabled(this.startValue);
            isEndDisabled = this.isDateDisabled(this.endValue);
            if (!this.isPopupOpen()) {
                this.currentDate = null;
            }
            this.setValue();
        }
        return (isStartDisabled || isEndDisabled);
    }
    private setModelValue(): void {
        if (!this.value && this.startDate === null && this.endDate === null) {
            this.setProperties({ value: null }, true);
        } else if (this.value === null || (<DateRange>this.value).start === null) {
            if (this.value === null) {
                this.setProperties({ value: [this.startDate, this.endDate] }, true);
            } else if ((<DateRange>this.value).start === null) {
                this.setProperties({ value: { start: this.startDate, end: this.endDate } }, true);
            }
        } else {
            if ((this.value && (<Date[]>this.value).length > 0) ||
                this.valueType && (<Date[]>this.valueType).length > 0) {
                if (+this.startDate !== +(<Date[]>this.value)[0] || +this.endDate !== +(<Date[]>this.value)[1]) {
                    this.setProperties({ value: [this.startDate, this.endDate] }, true);
                }
                if (this.value && (<Date[]>this.value)[0] == null && (<Date[]>this.value)[1] == null) {
                    this.setProperties({ value: null }, true);
                }
            } else {
                if ((this.value && (<DateRange>this.value).start)) {
                    this.setProperties({ value: { start: this.startDate, end: this.endDate } }, true);
                }
            }
        }
        this.createHiddenInput();
    }

    /**
     * To dispatch the event manually
     *
     * @param {HTMLElement} element - Specifies the element to dispatch the event.
     * @param {string} type - Specifies the name of the event.
     * @returns {void}
     */
    protected dispatchEvent(element: HTMLElement, type: string): void {
        const evt: Event = document.createEvent('HTMLEvents');
        evt.initEvent(type, false, true);
        element.dispatchEvent(evt);
        this.firstHiddenChild.dispatchEvent(evt);
    }

    private changeTrigger(e?: MouseEvent | KeyboardEvent | KeyboardEventArgs): void {
        if (+ this.initStartDate !== +this.startValue || +this.initEndDate !== +this.endValue) {
            this.setProperties({ endDate: this.checkDateValue(this.endValue) }, true);
            this.setProperties({ startDate: this.checkDateValue(this.startValue) }, true);
            this.setModelValue();
            if (this.isAngular && this.preventChange) {
                this.preventChange = false;
            } else {
                this.trigger('change', this.rangeArgs(e));
            }
        }
        this.previousEleValue = this.inputElement.value;
        this.initStartDate = this.checkDateValue(this.startValue);
        this.initEndDate = this.checkDateValue(this.endValue);
    }
    /**
     * This method is used to navigate to the month/year/decade view of the Calendar.
     *
     * @param  {string} view - Specifies the view of the Calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns {void}
     * @hidden
     */
    public navigateTo(view: CalendarView, date: Date): void {
        if (this.isPopupOpen()) {
            if (view.toLowerCase() === 'month') {
                view = 'Month';
            } else if (view.toLowerCase() === 'year') {
                view = 'Year';
            } else if (view.toLowerCase() === 'decade') {
                view = 'Decade';
            } else {
                return;
            }
            if (this.getViewNumber(view) < this.getViewNumber(this.depth)) {
                view = this.depth;
            }
            if (this.isMobile) {
                super.navigateTo.call(this, view, date);
            } else {
                if (date < this.min) {
                    date = new Date(+this.min);
                } else if (date >= this.max) {
                    date = new Date(+this.max);
                }
                if (view === 'Month' && this.isSameMonth(date, this.max)) {
                    date = new Date(this.max.getFullYear(), this.max.getMonth() - 1, this.min.getDate());
                } else if (view === 'Year' && this.isSameYear(date, this.max)) {
                    date = new Date((this.max.getFullYear() - 1), this.max.getMonth(), this.max.getDate());
                } else if (view === 'Decade' && this.isSameDecade(date, this.max)) {
                    date = new Date((this.max.getFullYear() - 10), this.max.getMonth(), this.max.getDate());
                }
                this.leftCalCurrentDate = date;
                this.navigate(this.leftCalendar, this.leftCalCurrentDate, view);
                if (view === 'Month') {
                    date = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + 1));
                } else if (view === 'Year') {
                    date = new Date(this.currentDate.setFullYear(this.currentDate.getFullYear() + 1));
                } else {
                    date = new Date(this.currentDate.setFullYear(this.currentDate.getFullYear() + 10));
                }
                this.rightCalCurrentDate = date;
                this.navigate(this.rightCalendar, this.rightCalCurrentDate, view);
                this.leftKeyboardModule = this.rightKeyboardModule = null;
                this.updateNavIcons();
            }
            if (this.currentView() === this.depth) {
                this.bindCalendarCellEvents();
            }
            this.removeFocusedDate();
            this.updateRange((this.isMobile ? [this.calendarElement] : [this.leftCalendar, this.rightCalendar]));
        }
    }

    private navigate(calendar: HTMLElement, date: Date, view: CalendarView): void {
        this.calendarElement = calendar;
        this.table = calendar.querySelector('table');
        this.tableBodyElement = calendar.querySelector('tbody');
        this.headerTitleElement = calendar.querySelector('.e-title');
        this.tableHeadElement = <HTMLElement>calendar.querySelector('thead');
        this.contentElement = calendar.querySelector('.e-content');
        this.previousIcon = calendar.querySelector('.e-prev');
        this.nextIcon = calendar.querySelector('.e-next');
        this.effect = ZOOMIN;
        super.navigateTo.call(this, view, date);
    }

    /**
     * Sets the focus to widget for interaction.
     *
     * @returns {void}
     */
    public focusIn(): void {
        if (document.activeElement !== this.inputElement && this.enabled) {
            addClass([this.inputWrapper.container], [INPUTFOCUS]);
            (<HTMLElement>this.inputElement).focus();
        }
    }
    /**
     * Remove the focus from widget, if the widget is in focus state.
     *
     * @returns {void}
     */
    public focusOut(): void {
        const isBlur: boolean = this.preventBlur;
        if (document.activeElement === this.inputElement) {
            removeClass([this.inputWrapper.container], [INPUTFOCUS]);
            this.preventBlur = false;
            this.inputElement.blur();
            this.preventBlur = isBlur;
        }
    }
    /**
     * To destroy the widget.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.unBindEvents();
        if (this.showClearButton) {
            this.clearButton = document.getElementsByClassName('e-clear-icon')[0] as HTMLElement;
        }
        this.hide(null);
        const ariaAttrs: object = {
            'tabindex': '0', 'aria-expanded': 'false', 'role': 'combobox',
            'autocomplete': 'off', 'aria-disabled': !this.enabled ? 'true' : 'false',
            'autocorrect': 'off', 'autocapitalize': 'off', 'aria-invalid': 'false', 'spellcheck': 'false'
        };
        if (this.inputElement) {
            removeClass([this.inputElement], [ROOT]);
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            Input.removeAttributes(<{ [key: string]: string }>ariaAttrs, this.inputElement);
            if (!isNullOrUndefined(this.cloneElement.getAttribute('tabindex'))) {
                this.inputElement.setAttribute('tabindex', this.tabIndex);
            } else {
                this.inputElement.removeAttribute('tabindex');
            }
            this.ensureInputAttribute();
            this.inputElement.classList.remove('e-input');
            if (!isNullOrUndefined(this.inputWrapper)) {
                EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.rangeIconHandler);
                if (this.angularTag === null) {
                    this.inputWrapper.container.parentElement.appendChild(this.inputElement);
                }
                detach(this.inputWrapper.container);
            }
        }
        if (!isNullOrUndefined(this.inputKeyboardModule) && !this.isMobile) {
            this.inputKeyboardModule.destroy();
        }
        if (this.popupObj) {
            if (!this.isMobile) {
                this.clearCalendarEvents();
            }
        }
        Input.destroy({
            element: this.inputElement,
            floatLabelType: this.floatLabelType,
            properties: this.properties
        }, this.clearButton);
        super.destroy();
        this.inputWrapper = this.popupWrapper = this.popupObj = this.cloneElement = this.presetElement = null;
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
        if ((!isNullOrUndefined(this.firstHiddenChild))
            && (!isNullOrUndefined(this.secondHiddenChild))) {
            detach(this.firstHiddenChild);
            detach(this.secondHiddenChild);
            this.firstHiddenChild = this.secondHiddenChild = null;
            this.inputElement.setAttribute('name', this.element.getAttribute('data-name'));
            this.inputElement.removeAttribute('data-name');
        }
        this.closeEventArgs = null;
        this.leftCalendar = null;
        this.rightTitle = null;
        this.leftTitle = null;
        this.openEventArgs = null;
        this.leftCalNextIcon = null;
        this.rightCalendar = null;
        this.closeEventArgs = null;
        this.rightCalPrevIcon = null;
        this.leftCalPrevIcon = null;
        this.popupKeyboardModule = null;
        this.cancelButton = null;
        this.applyButton = null;
        this.calendarElement = null;
        this.leftKeyboardModule = null;
        this.rightCalNextIcon = null;
        this.leftCalNextIcon = null;
        this.btnKeyboardModule = null;
        this.rightKeyboardModule = null;
        this.leftKeyboardModule = null;
        this.presetKeyboardModule = null;
        this.liCollections = null;
        this.popupObj = null;
        this.popupWrapper = null;
    }
    protected ensureInputAttribute(): void {
        const attr: string[] = [];
        for (let i: number = 0; i < this.inputElement.attributes.length; i++) {
            attr[i as number] = this.inputElement.attributes[i as number].name;
        }
        for (let i: number = 0; i < attr.length; i++) {
            if (isNullOrUndefined(this.cloneElement.getAttribute(attr[i as number]))) {
                if (attr[i as number].toLowerCase() === 'value') {
                    this.inputElement.value = '';
                }
                this.inputElement.removeAttribute(attr[i as number]);
            } else {
                if (attr[i as number].toLowerCase() === 'value') {
                    this.inputElement.value = this.cloneElement.getAttribute(attr[i as number]);
                }
                this.inputElement.setAttribute(attr[i as number], this.cloneElement.getAttribute(attr[i as number]));
            }
        }
    }
    /**
     * To get component name
     *
     * @returns {string} Returns the component name.
     * @private
     */
    protected getModuleName(): string {
        return 'daterangepicker';
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Return the properties that are maintained upon browser refresh.
     *
     * @returns {string}
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['startDate', 'endDate', 'value'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Return the selected range and day span in the DateRangePicker.
     *
     * @returns {Object}
     */
    public getSelectedRange(): Object {
        let range: number;
        if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
            range = (Math.round(Math.abs((this.removeTimeValueFromDate(this.startValue).getTime() -
            this.removeTimeValueFromDate(this.endValue).getTime()) / (1000 * 60 * 60 * 24))) + 1);
            if (!isNullOrUndefined(this.renderDayCellArgs) && this.renderDayCellArgs.isDisabled) {
                this.disabledDateRender();
            }
            if (!isNullOrUndefined(this.disabledDayCnt)) {
                range = range - this.disabledDayCnt;
                this.disabledDayCnt = null;
            }
        } else {
            range = 0;
        }
        return { startDate: this.startValue, endDate: this.endValue, daySpan: range };
    }
    /* eslint-enable valid-jsdoc, jsdoc/require-returns-description */
    /* eslint-disable valid-jsdoc, jsdoc/require-param */
    /**
     * To open the Popup container in the DateRangePicker component.
     *
     * @param {HTMLElement} element - Specifies element.
     * @returns {void}
     */
    public show(element?: HTMLElement, event?: MouseEvent | KeyboardEventArgs | Event): void {
        if (this.isMobile && this.popupObj) {
            this.popupObj.refreshPosition();
        }
        if ((this.enabled && this.readonly) || !this.enabled || this.popupObj) {
            return;
        } else {
            if (!this.isPopupOpen()) {
                if (element) {
                    this.targetElement = element;
                }
                this.createPopup();
                if (this.isMobile || Browser.isDevice) {
                    this.mobileRangePopupWrap = this.createElement('div', { className: 'e-daterangepick-mob-popup-wrap'});
                    document.body.appendChild(this.mobileRangePopupWrap);
                }
                this.openEventArgs = {
                    popup: this.popupObj || null,
                    cancel: false,
                    date: this.inputElement.value,
                    model: this,
                    event: event ? event : null,
                    appendTo: this.isMobile || Browser.isDevice ? this.mobileRangePopupWrap : document.body
                };
                const eventArgs: RangePopupEventArgs = this.openEventArgs;
                this.trigger('open', eventArgs, (eventArgs: RangePopupEventArgs) => {
                    this.openEventArgs = eventArgs;
                    if (!this.openEventArgs.cancel) {
                        this.openEventArgs.appendTo.appendChild(this.popupWrapper);
                        this.showPopup(element, event);
                        const isPreset: boolean = (!this.isCustomRange || (this.isMobile && this.isCustomRange));
                        if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && isPreset) {
                            this.setScrollPosition();
                        }
                        this.checkMinMaxDays();
                        if ((this.isMobile) && (!isNullOrUndefined(this.startDate)) && (isNullOrUndefined(this.endDate))) {
                            this.endButton.element.classList.add(ACTIVE);
                            this.startButton.element.classList.remove(ACTIVE);
                            this.endButton.element.removeAttribute('disabled');
                            this.selectableDates();
                        }
                        super.setOverlayIndex(
                            this.mobileRangePopupWrap,
                            this.popupObj.element,
                            this.modal,
                            this.isMobile || Browser.isDevice);
                        if (Browser.isDevice) {
                            const dlgOverlay: HTMLElement = this.createElement('div', { className: 'e-dlg-overlay' });
                            dlgOverlay.style.zIndex = (this.zIndex - 1).toString();
                            this.mobileRangePopupWrap.appendChild(dlgOverlay);
                        }
                    }
                });
            }
        }
    }

    /**
     * To close the Popup container in the DateRangePicker component.
     *
     * @returns {void}
     */
    public hide(event?: KeyboardEventArgs | MouseEvent | Event): void {
        if (this.popupObj) {
            if (isNullOrUndefined(this.previousEndValue) && isNullOrUndefined(this.previousStartValue)) {
                this.clearRange();
            } else {
                if (!isNullOrUndefined(this.previousStartValue)) {
                    this.startValue = new Date(this.checkValue(this.previousStartValue));
                    this.setValue();
                    this.currentDate = new Date(this.checkValue(this.startValue));
                } else {
                    this.startValue = null;
                    this.setValue();
                }
                if (!isNullOrUndefined(this.previousEndValue)) {
                    this.endValue = new Date(this.checkValue(this.previousEndValue));
                    this.setValue();
                } else {
                    this.endValue = null;
                    this.setValue();
                }
            }
            if (this.isPopupOpen()) {
                this.closeEventArgs = {
                    cancel: false,
                    popup: this.popupObj,
                    date: this.inputElement.value,
                    model: this,
                    event: event ? event : null
                };
                const eventArgs: RangePopupEventArgs = this.closeEventArgs;
                this.trigger('close', eventArgs, (eventArgs: RangePopupEventArgs) => {
                    this.closeEventArgs = eventArgs;
                    if (!this.closeEventArgs.cancel) {
                        if (this.isMobile) {
                            if (!isNullOrUndefined(this.startButton) && !isNullOrUndefined(this.endButton)) {
                                EventHandler.remove(this.startButton.element, 'click touchstart', this.deviceHeaderClick);
                                EventHandler.remove(this.endButton.element, 'click touchstart', this.deviceHeaderClick);
                            }
                        }
                        if (this.popupObj) {
                            this.popupObj.hide();
                            if (this.preventBlur) {
                                this.inputElement.focus();
                                addClass([this.inputWrapper.container], [INPUTFOCUS]);
                            }
                        }
                        if (!this.isMobile) {
                            if (!isNullOrUndefined(this.leftKeyboardModule) && !isNullOrUndefined(this.rightKeyboardModule)) {
                                this.leftKeyboardModule.destroy();
                                this.rightKeyboardModule.destroy();
                            }
                            if (!isNullOrUndefined(this.presetElement)) {
                                this.presetKeyboardModule.destroy();
                            }
                            if (!isNullOrUndefined(this.cancelButton)) {
                                this.btnKeyboardModule.destroy();
                            }
                        }
                        this.targetElement = null;
                        removeClass([document.body], OVERFLOW);
                        EventHandler.remove(document, 'mousedown touchstart', this.documentHandler);
                        if (this.isMobile && this.modal) {
                            this.modal.style.display = 'none';
                            this.modal.outerHTML = '';
                            this.modal = null;
                        }
                        if (this.isMobile || Browser.isDevice) {
                            if (!isNullOrUndefined(this.mobileRangePopupWrap)) {
                                this.mobileRangePopupWrap.remove();
                                this.mobileRangePopupWrap = null;
                            }
                        }
                        this.isKeyPopup = this.dateDisabled = false;
                    } else {
                        removeClass([this.inputWrapper.buttons[0]], ACTIVE);
                    }
                    this.updateClearIconState();
                    this.updateHiddenInput();
                    if (this.isMobile && this.allowEdit && !this.readonly) {
                        this.inputElement.removeAttribute('readonly');
                    }
                });
            }
        } else {
            this.updateClearIconState();
            this.updateHiddenInput();
            if (this.isMobile && this.allowEdit && !this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
        }
    }
    /* eslint-enable valid-jsdoc, jsdoc/require-param */
    private setLocale(): void {
        this.globalize = new Internationalization(this.locale);
        this.l10n.setLocale(this.locale);
        if (this.dateRangeOptions && this.dateRangeOptions.placeholder == null) {
            this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
            Input.setPlaceholder(this.placeholder, this.inputElement);
        }
        this.updateInput();
        this.updateHiddenInput();
        this.changeTrigger();
    }
    private refreshChange(): void {
        this.checkView();
        this.refreshControl();
        this.changeTrigger();
    }
    private setDate(): void {
        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        this.refreshChange();
    }
    private enableInput(): void {
        if (+ this.min <= +this.max) {
            this.setProperties({ enabled: true }, true);
            Input.setEnabled(this.enabled, this.inputElement);
            if (this.element.hasAttribute('disabled')) {
                this.bindEvents();
            }
        }
    }
    private clearModelvalue(newProp: DateRangePickerModel, oldProp: DateRangePickerModel): void {
        this.setProperties({ startDate: null }, true);
        this.setProperties({ endDate: null }, true);
        if (oldProp.value && (<Date[]>oldProp.value).length > 0) {
            this.setProperties({ value: null }, true);
        } else if (oldProp.value && (<DateRange>oldProp.value).start) {
            this.setProperties({ value: { start: null, end: null } }, true);
        } else if (oldProp.value && !(<DateRange>oldProp.value).start) {
            this.setProperties({ value: { start: null, end: null } }, true);
        }
        this.updateValue();
        this.setDate();
    }
    private createHiddenInput(): void {
        if (isNullOrUndefined(this.firstHiddenChild) && isNullOrUndefined(this.secondHiddenChild)) {
            this.firstHiddenChild = <HTMLInputElement>this.createElement('input');
            this.secondHiddenChild = <HTMLInputElement>this.createElement('input');
        }
        if (!isNullOrUndefined(this.inputElement.getAttribute('name'))) {
            this.inputElement.setAttribute('data-name', this.inputElement.getAttribute('name'));
            this.inputElement.removeAttribute('name');
        }
        attributes(this.firstHiddenChild, {
            'type': 'text', 'name': this.inputElement.getAttribute('data-name'), 'class' : HIDDENELEMENT
        });
        attributes(this.secondHiddenChild, {
            'type': 'text', 'name': this.inputElement.getAttribute('data-name'), 'class' : HIDDENELEMENT
        });
        const format: Object = { format: this.formatString, type: 'datetime', skeleton: 'yMd' };
        this.firstHiddenChild.value = this.startDate && this.globalize.formatDate(this.startDate, format);
        this.secondHiddenChild.value = this.endDate && this.globalize.formatDate(this.endDate, format);
        this.inputElement.parentElement.appendChild(this.firstHiddenChild);
        this.inputElement.parentElement.appendChild(this.secondHiddenChild);
    }
    private setMinMaxDays (): void {
        if (this.isPopupOpen()) {
            this.removeClassDisabled();
            this.checkMinMaxDays();
            if (this.isMobile) {
                this.selectableDates();
            }
            if (!this.strictMode && (isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue))) {
                this.removeSelection();
            } else {
                this.updateRange((this.isMobile ? [this.calendarElement] : [this.leftCalendar, this.rightCalendar]));
            }
            this.updateHeader();
        }
    }
    private getAmPmValue(date: string | null | undefined): string {
        try {
            if (typeof date === 'string' && date.trim() !== '') {
                // Replace am/pm variants with uppercase AM/PM
                return date.replace(/(am|pm|Am|aM|pM|Pm)/g, (match: string) => match.toLocaleUpperCase());
            }
            // If date is null, undefined, or an empty string, return a default value or empty string
            return '';
        } catch (error) {
            console.error('Error occurred while processing date:', error);
            return ''; // Return a default value in case of an error
        }
    }
    private getStartEndValue(date : Date, isEnd : boolean): Date {
        if (this.depth === 'Month') {
            return this.checkDateValue(new Date(this.checkValue(date)));
        } else if (this.depth === 'Year') {
            return new Date(date.getFullYear(), date.getMonth() + (isEnd ? 1 : 0), isEnd ? 0 : 1);
        } else {
            return new Date(date.getFullYear(), isEnd ? 11 : 0, isEnd ? 31 : 1);
        }
    }
    /**
     * Called internally if any of the property value changed.
     *
     * @param {DateRangePickerModel} newProp - Returns the dynamic property value of the component.
     * @param {DateRangePickerModel} oldProp - Returns the previous property value of the component.
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: DateRangePickerModel, oldProp: DateRangePickerModel): void {
        const format: Object = { format: this.formatString, type: 'date', skeleton: 'yMd' };
        let isDynamicValueChange: boolean = false;
        for (const prop of Object.keys(newProp)) {
            const openPopup: string[] = ['blur', 'change', 'cleared', 'close', 'created', 'destroyed', 'focus', 'navigated', 'open', 'renderDayCell', 'select'];
            if (openPopup.indexOf(prop) > 0 && this.isReact) {
                isDynamicValueChange = true;
            }
            switch (prop) {
            case 'width':
                this.setEleWidth(this.width);
                Input.calculateWidth(this.inputElement, this.inputWrapper.container);
                if (!isNullOrUndefined(this.inputWrapper.buttons[0]) && !isNullOrUndefined(this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0]) && this.floatLabelType !== 'Never') {
                    this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0].classList.add('e-icon');
                }
                break;
            case 'separator':
                this.previousEleValue = this.inputElement.value;
                this.setProperties({ separator: newProp.separator }, true);
                this.updateInput();
                this.changeTrigger();
                break;
            case 'placeholder':
                Input.setPlaceholder(newProp.placeholder, this.inputElement);
                this.setProperties({ placeholder: newProp.placeholder }, true);
                break;
            case 'readonly':
                Input.setReadonly(this.readonly, this.inputElement);
                this.setRangeAllowEdit();
                break;
            case 'cssClass':
                this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                break;
            case 'enabled':
                this.setProperties({ enabled: newProp.enabled }, true);
                Input.setEnabled(this.enabled, this.inputElement);
                if (this.enabled) {
                    this.inputElement.setAttribute('tabindex', this.tabIndex);
                } else {
                    this.inputElement.tabIndex = -1;
                }
                break;
            case 'allowEdit':
                this.setRangeAllowEdit();
                break;
            case 'enableRtl':
                this.setProperties({ enableRtl: newProp.enableRtl }, true);
                Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
                break;
            case 'zIndex':
                this.setProperties({ zIndex: newProp.zIndex }, true);
                break;
            case 'format':
                this.setProperties({ format: newProp.format }, true);
                this.checkFormat();
                this.updateInput();
                this.changeTrigger();
                break;
            case 'inputFormats':
                this.checkInputFormats();
                break;
            case 'locale':
                this.globalize = new Internationalization(this.locale);
                this.l10n.setLocale(this.locale);
                if (this.dateRangeOptions && this.dateRangeOptions.placeholder == null) {
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    Input.setPlaceholder(this.placeholder, this.inputElement);
                }
                this.setLocale();
                break;
            case 'htmlAttributes':
                this.updateHtmlAttributeToElement();
                this.updateHtmlAttributeToWrapper();
                this.setDataAttribute(true);
                this.checkHtmlAttributes(true);
                break;
            case 'showClearButton':
                Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                this.bindClearEvent();
                break;
            case 'startDate':
                if (typeof newProp.startDate === 'string') {
                    newProp.startDate = this.globalize.parseDate(this.getAmPmValue(<string>newProp.startDate), format);
                }
                if (+this.initStartDate !== +newProp.startDate) {
                    this.startValue = this.getStartEndValue(newProp.startDate, false);
                    this.setDate();
                    this.setValue();
                }
                break;
            case 'endDate':
                if (typeof newProp.endDate === 'string') {
                    newProp.endDate = this.globalize.parseDate(this.getAmPmValue(<string>newProp.endDate), format);
                }
                if (+this.initEndDate !== +newProp.endDate) {
                    this.endValue = this.getStartEndValue(newProp.endDate, true);
                    this.setDate();
                    this.setValue();
                }
                break;
            case 'value':
                isDynamicValueChange = true;
                this.invalidValueString = null;
                this.checkInvalidRange(newProp.value);
                if (typeof (newProp.value) === 'string') {
                    if (!this.invalidValueString) {
                        const rangeArray: string[] = (<string>newProp.value).split(' ' + this.separator + ' ');
                        this.value = [new Date(rangeArray[0]), new Date(rangeArray[1])];
                        this.updateValue();
                        this.setDate();
                    } else {
                        this.clearModelvalue(newProp, oldProp);
                    }
                } else {
                    if ((!isNullOrUndefined(newProp.value) && (<Date[]>newProp.value).length > 0)
                        || !isNullOrUndefined(newProp.value) && (<DateRange>newProp.value).start) {
                        this.valueType = newProp.value;
                        if ((<Date[]>newProp.value)[0] === null || ((<DateRange>newProp.value).start === null)) {
                            if ((<Date[]>newProp.value).length === 1 || ((<DateRange>newProp.value).start)) {
                                this.clearModelvalue(newProp, oldProp);
                            } else if ((<Date[]>newProp.value)[1] === null ||
                                ((<DateRange>newProp.value).start === null)) {
                                this.clearModelvalue(newProp, oldProp);
                            }
                        } else if ((+this.initStartDate !== +(<Date[]>newProp.value)[0]
                            || +this.initEndDate !== +(<Date[]>newProp.value)[1]) ||
                            (+this.initStartDate !== +((<DateRange>newProp.value).start
                                || +this.initEndDate !== +(<DateRange>newProp.value).start))) {
                            if ((<Date[]>newProp.value).length === 1) {
                                this.modelValue = <Date[]>newProp.value;
                            } else if ((<DateRange>newProp.value).start) {
                                this.modelValue = <DateRange>newProp.value;
                            }
                            this.updateValue();
                            this.setDate();
                        }
                    } else {
                        if (isNullOrUndefined(this.value)
                            || (<DateRange>newProp.value).start == null) {
                            this.valueType = newProp.value;
                            this.startValue = null;
                            this.endValue = null;
                            this.clearModelvalue(newProp, oldProp);
                        }
                    }
                }
                if (this.isPopupOpen()) {
                    if (isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue)) {
                        this.removeSelection();
                        if (this.isMobile) {
                            this.deviceHeaderUpdate();
                        }
                        return;
                    }
                    if (this.isMobile) {
                        this.navigate(this.deviceCalendar, this.startValue, this.currentView() as CalendarView);
                        this.deviceHeaderUpdate();
                    } else {
                        this.navigate(this.leftCalendar, this.startValue, this.currentView() as CalendarView);
                        this.updateControl(this.leftCalendar);
                        this.navigate(this.rightCalendar, this.endValue, this.currentView() as CalendarView);
                        this.updateControl(this.rightCalendar);
                    }
                    this.updateRange((this.isMobile ? [this.calendarElement] : [this.leftCalendar, this.rightCalendar]));
                    this.updateHeader();
                    this.applyButton.disabled = this.applyButton.element.disabled = false;
                }
                this.preventChange = this.isAngular && this.preventChange ? !this.preventChange : this.preventChange;
                break;
            case 'minDays':
                isDynamicValueChange = true;
                this.setProperties({ minDays: newProp.minDays }, true);
                this.refreshChange();
                this.setMinMaxDays();
                break;
            case 'maxDays':
                isDynamicValueChange = true;
                this.setProperties({ maxDays: newProp.maxDays }, true);
                this.refreshChange();
                this.setMinMaxDays();
                break;
            case 'min':
                this.setProperties({ min: this.checkDateValue(new Date(this.checkValue(newProp.min))) }, true);
                this.previousEleValue = this.inputElement.value;
                this.enableInput();
                this.refreshChange();
                break;
            case 'max':
                this.setProperties({ max: this.checkDateValue(new Date(this.checkValue(newProp.max))) }, true);
                this.enableInput();
                this.refreshChange();
                break;
            case 'strictMode':
                this.invalidValueString = null;
                this.setProperties({ strictMode: newProp.strictMode }, true);
                this.refreshChange();
                break;
            case 'presets':
                this.setProperties({ presets: newProp.presets }, true);
                this.processPresets();
                break;
            case 'floatLabelType':
                this.floatLabelType = newProp.floatLabelType;
                Input.removeFloating(this.inputWrapper);
                Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                if (!isNullOrUndefined(this.inputWrapper.buttons[0]) && !isNullOrUndefined(this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0]) && this.floatLabelType !== 'Never') {
                    this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0].classList.add('e-icon');
                }
                break;
            case 'start':
                this.setProperties({ start: newProp.start }, true);
                this.refreshChange();
                break;
            case 'depth':
                this.setProperties({ depth: newProp.depth }, true);
                this.refreshChange();
                break;
            }
            if (!isDynamicValueChange) {
                this.hide(null);
            }
        }
    }
}
