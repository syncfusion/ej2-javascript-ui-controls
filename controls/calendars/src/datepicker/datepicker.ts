/// <reference path='../calendar/calendar-model.d.ts'/>
import { EventHandler, Property, Internationalization, NotifyPropertyChanges, DateFormatOptions } from '@syncfusion/ej2-base';
import { KeyboardEvents, KeyboardEventArgs, Animation, EmitType, Event, extend, L10n, Browser, formatUnit } from '@syncfusion/ej2-base';
import { createElement, detach, addClass, removeClass, closest, classList, attributes } from '@syncfusion/ej2-base';
import { isNullOrUndefined, setValue, getUniqueID, ModuleDeclaration } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { Input, InputObject, IInput, FloatLabelType } from '@syncfusion/ej2-inputs';
import { ChangedEventArgs, CalendarView, Calendar, BlurEventArgs, FocusEventArgs } from '../calendar/calendar';
import { DatePickerModel } from './datepicker-model';


//class constant defination
const DATEWRAPPER: string = 'e-date-wrapper';
const ROOT: string = 'e-datepicker';
const LIBRARY: string = 'e-lib';
const CONTROL: string = 'e-control';
const POPUPWRAPPER: string = 'e-popup-wrapper';
const INPUTWRAPPER: string = 'e-input-group-icon';
const POPUP: string = 'e-popup';
const INPUTCONTAINER: string = 'e-input-group';
const INPUTFOCUS: string = 'e-input-focus';
const INPUTROOT: string = 'e-input';
const ERROR: string = 'e-error';
const RTL: string = 'e-rtl';
const LINK: string = 'e-day';
const ACTIVE: string = 'e-active';
const OVERFLOW: string = 'e-date-overflow';
const DATEICON: string = 'e-date-icon';
const ICONS: string = 'e-icons';
const OPENDURATION: number = 300;
const CLOSEDURATION: number = 200;
const OFFSETVALUE: number = 4;
const SELECTED: string = 'e-selected';
const NONEDIT: string = 'e-non-edit';
const containerAttr: string[] = ['title', 'class', 'style'];
export interface FormatObject {
    /**
     * Specifies the format in which the date format will process
     */
    skeleton?: string;
}

/**
 * Represents the DatePicker component that allows user to select
 * or enter a date value.
 * ```html
 * <input id='datepicker'/>
 * ```
 * ```typescript
 * <script>
 *   let datePickerObject:DatePicker = new DatePicker({ value: new Date() });
 *   datePickerObject.appendTo('#datepicker');
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class DatePicker extends Calendar implements IInput {
    protected popupObj: Popup;
    protected inputWrapper: InputObject;
    private modal: HTMLElement;
    protected inputElement: HTMLInputElement;
    protected popupWrapper: HTMLElement;
    protected changedArgs: ChangedEventArgs;
    protected previousDate: Date;
    private keyboardModules: KeyboardEvents;
    private calendarKeyboardModules: KeyboardEvents;
    protected previousElementValue: string = '';
    protected ngTag: string;
    protected dateTimeFormat: string;
    protected inputElementCopy: HTMLElement;
    protected inputValueCopy: Date;
    protected l10n: L10n;
    protected preventArgs: PopupObjectArgs;
    private isDateIconClicked: boolean = false;
    protected isAltKeyPressed: boolean = false;
    private isInteracted: boolean = true;
    private index: number;
    private formElement: HTMLElement;
    protected invalidValueString: string = null;
    private checkPreviousValue: Date = null;
    protected formatString: string;
    protected tabIndex: string;
    private datepickerOptions: DatePickerModel;
    protected defaultKeyConfigs: { [key: string]: string } = {
        altUpArrow: 'alt+uparrow',
        altDownArrow: 'alt+downarrow',
        escape: 'escape',
        enter: 'enter',
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
        tab: 'tab'
    };
    protected mobilePopupWrapper: HTMLElement;
    /**
     * Specifies the width of the DatePicker component.
     * @default null
     */
    @Property(null)
    public width: number | string;
    /**
     * Specifies the root CSS class of the DatePicker that allows to
     * customize the appearance by overriding the styles.
     * @default null
     */
    @Property(null)
    public cssClass: string;
    /**
     * Specifies the component to act as strict. So that, it allows to enter only a valid date  value within a specified range or else it 
     * will resets to previous value. By default, strictMode is in false.
     * it allows invalid or out-of-range date value with highlighted error class.
     * @default false
     * > For more details refer to 
     * [`Strict Mode`](../../datepicker/strict-mode/) documentation.
     */
    @Property(false)
    public strictMode: boolean;
    /**
     * Specifies the format of the value that to be displayed in component. By default, the format is based on the culture.
     * @default null
     * @aspType string
     * @blazorType string
     */
    @Property(null)
    public format: string | FormatObject;
    /**
     * Specifies the component to be disabled or not.
     * @default true
     */
    @Property(true)
    public enabled: boolean;
    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };
    /**
     * Gets or sets multiple selected dates of the calendar.
     * @default null
     * @private
     */
    @Property(null)
    public values: Date[];
    /**
     * Specifies the option to enable the multiple dates selection of the calendar.
     * @default false
     * @private
     */
    @Property(false)
    public isMultiSelection: boolean;
    /**
     * Specifies whether to show or hide the clear icon in textbox.
     * @default true
     */
    @Property(true)
    public showClearButton: boolean;
    /**
     * > Support for `allowEdit` has been provided from 
     * [`v16.2.46`](https://ej2.syncfusion.com/angular/documentation/release-notes/16.2.46/#datepicker).
     * 
     * Specifies whether the input textbox is editable or not. Here the user can select the value from the 
     * popup and cannot edit in the input textbox.
     * @default true
     */
    @Property(true)
    public allowEdit: boolean;
    /**     
     * Customizes the key actions in DatePicker.
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
     * Calendar Navigation
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
     * shiftPageUp<br/></td><td colSpan=1 rowSpan=1> 
     * shift+pageup<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * shiftPageDown<br/></td><td colSpan=1 rowSpan=1> 
     * shift+pagedown<br/></td></tr> 
     * <tr> 
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
     * @default null
     * @blazorType object 
     */
    @Property(null)
    public keyConfigs: { [key: string]: string };
    /** 
     * Enable or disable persisting component's state between page reloads. If enabled, following list of states will be persisted.
     * 1. value
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * specifies the z-index value of the datePicker popup element.
     * @default 1000
     * @aspType int
     * @blazorType int
     */
    @Property(1000)
    public zIndex: number;
    /**
     * Specifies the component in readonly state. When the Component is readonly it does not allow user input.
     * @default false
     */
    @Property(false)
    public readonly: boolean;
    /**
     * Specifies the placeholder text that displayed in textbox.
     * @default null
     */
    @Property(null)
    public placeholder: string;
    /**
     * Specifies the placeholder text to be floated.
     * Possible values are:
     * Never: The label will never float in the input when the placeholder is available.
     * Always: The floating label will always float above the input.
     * Auto: The floating label will float above the input after focusing or entering a value in the input.
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @blazorType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     */
    @Property('Never')
    public floatLabelType: FloatLabelType | string;

    /** 
     * Triggers when the popup is opened.
     * @event
     * @blazorProperty 'OnOpen'
     * @blazorType PopupObjectArgs
     */
    @Event()
    public open: EmitType<PreventableEventArgs | PopupObjectArgs>;
    /** 
     * Triggers when the popup is closed.
     * @event
     * @blazorProperty 'OnClose'
     * @blazorType PopupObjectArgs
     */
    @Event()
    public close: EmitType<PreventableEventArgs | PopupObjectArgs>;
    /** 
     * Triggers when the input loses the focus.
     * @event
     */
    @Event()
    public blur: EmitType<BlurEventArgs>;
    /** 
     *  Triggers when the input gets focus.
     * @event
     */
    @Event()
    public focus: EmitType<FocusEventArgs>;
    /** 
     * Triggers when the component is created.
     * @event 
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Object>;
    /** 
     * Triggers when the component is destroyed.
     * @event
     * @blazorProperty 'Destroyed'
     */
    @Event()
    public destroyed: EmitType<Object>;
    /**
     * Constructor for creating the widget.
     */
    constructor(options?: DatePickerModel, element?: string | HTMLInputElement) {
        super(options, element);
        this.datepickerOptions = options;
    }
    /**
     * To Initialize the control rendering.
     * @return void
     * @private
     */
    public render(): void {
        this.initialize();
        this.bindEvents();
        this.renderComplete();
    }

    protected setAllowEdit(): void {
        if (this.allowEdit) {
            if (!this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
        } else {
            attributes(this.inputElement, { 'readonly': '' });
        }
        this.updateIconState();
    }
    protected updateIconState(): void {
        if (!this.allowEdit && this.inputWrapper && !this.readonly) {
            if (this.inputElement.value === '') {
                removeClass([this.inputWrapper.container], [NONEDIT]);
            } else {
                addClass([this.inputWrapper.container], [NONEDIT]);
            }
        } else if (this.inputWrapper) {
            removeClass([this.inputWrapper.container], [NONEDIT]);
        }
    }
    private initialize(): void {
        this.checkInvalidValue(this.value);
        this.createInput();
        this.updateHtmlAttributeToWrapper();
        this.setAllowEdit();
        this.updateInput();
        this.previousElementValue = this.inputElement.value;
        this.previousDate = new Date(+this.value);
        this.inputElement.setAttribute('value', this.inputElement.value);
        this.inputValueCopy = this.value;
    }

    private createInput(): void {
        let ariaAttrs: object = {
            'aria-live': 'assertive', 'aria-atomic': 'true',
            'aria-haspopup': 'true', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false', 'aria-invalid': 'false'
        };
        if (this.getModuleName() === 'datepicker') {
            let l10nLocale: object = { placeholder: null };
            this.globalize = new Internationalization(this.locale);
            this.l10n = new L10n('datepicker', l10nLocale, this.locale);
            this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        }
        this.inputWrapper = Input.createInput(
            {
                element: this.inputElement,
                floatLabelType: this.floatLabelType,
                properties: {
                    readonly: this.readonly,
                    placeholder: this.placeholder,
                    cssClass: this.cssClass,
                    enabled: this.enabled,
                    enableRtl: this.enableRtl,
                    showClearButton: this.showClearButton,
                },
                buttons: [INPUTWRAPPER + ' ' + DATEICON + ' ' + ICONS]
            },
            this.createElement
        );
        this.setWidth(this.width);
        if (this.inputElement.name !== '') {
            this.inputElement.setAttribute('name', '' + this.inputElement.getAttribute('name'));
        } else {
            this.inputElement.setAttribute('name', '' + this.element.id);
        }
        attributes(this.inputElement, <{ [key: string]: string }>ariaAttrs);
        if (!this.enabled) {
            this.inputElement.setAttribute('aria-disabled', 'true');
            this.inputElement.tabIndex = -1;
        } else {
            this.inputElement.setAttribute('aria-disabled', 'false');
            this.inputElement.setAttribute('tabindex', this.tabIndex);
        }
        Input.addAttributes({ 'aria-label': 'select' }, this.inputWrapper.buttons[0]);
        addClass([this.inputWrapper.container], DATEWRAPPER);
    }
    protected updateInput(): void {
        let formatOptions: DateFormatOptions;
        if (this.value && !this.isCalendar()) {
            this.disabledDates();
        }
        if (!+new Date(this.checkValue(this.value))) {
            this.setProperties({ value: null }, true);
        }
        if (this.strictMode) {
            //calls the Calendar processDate protected method to update the date value according to the strictMode true behaviour.
            super.validateDate();
            this.minMaxUpdates();
            super.minMaxUpdate();
        }
        if (!isNullOrUndefined(this.value)) {
            let dateValue: Date = this.value;
            let dateString: string;
            let tempFormat: string = !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat;
            if (this.getModuleName() === 'datetimepicker') {
                if (this.calendarMode === 'Gregorian') {
                    dateString = this.globalize.formatDate(this.value, {
                        format: tempFormat, type: 'dateTime', skeleton: 'yMd'
                    });
                } else {
                    dateString = this.globalize.formatDate(this.value, {
                        format: tempFormat, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                    });
                }
            } else {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
                } else {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                dateString = this.globalize.formatDate(this.value, formatOptions);
            }
            if ((+dateValue <= +this.max) && (+dateValue >= +this.min)) {
                Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
            } else {
                let value: boolean = (+dateValue >= +this.max || !+this.value) || (!+this.value || +dateValue <= +this.min);
                if (!this.strictMode && value) {
                    Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
                }
            }
        }
        if (isNullOrUndefined(this.value) && this.strictMode) {
            Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        }
        if (!this.strictMode && isNullOrUndefined(this.value) && this.invalidValueString) {
            Input.setValue(this.invalidValueString, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        this.changedArgs = { value: this.value };
        this.errorClass();
        this.updateIconState();
    };
    protected minMaxUpdates(): void {
        if (!isNullOrUndefined(this.value) && this.value < this.min && this.min <= this.max && this.strictMode) {
            this.setProperties({ value: this.min }, true);
            this.changedArgs = { value: this.value };
        } else {
            if (!isNullOrUndefined(this.value) && this.value > this.max && this.min <= this.max && this.strictMode) {
                this.setProperties({ value: this.max }, true);
                this.changedArgs = { value: this.value };
            }
        }
    }
    private checkStringValue(val: string): Date {
        let returnDate: Date = null;
        let formatOptions: object = null;
        let formatDateTime: object = null;
        if (this.getModuleName() === 'datetimepicker') {
            let culture: Internationalization = new Internationalization(this.locale);
            if (this.calendarMode === 'Gregorian') {
                formatOptions = { format: this.dateTimeFormat, type: 'dateTime', skeleton: 'yMd' };
                formatDateTime = { format: culture.getDatePattern({ skeleton: 'yMd' }), type: 'dateTime' };
            } else {
                formatOptions = { format: this.dateTimeFormat, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                formatDateTime = { format: culture.getDatePattern({ skeleton: 'yMd' }), type: 'dateTime', calendar: 'islamic' };
            }
        } else {
            if (this.calendarMode === 'Gregorian') {
                formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
            } else {
                formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }
        }
        returnDate = this.checkDateValue(this.globalize.parseDate(val, formatOptions));
        if (isNullOrUndefined(returnDate) && (this.getModuleName() === 'datetimepicker')) {
            returnDate = this.checkDateValue(this.globalize.parseDate(val, formatDateTime));
        }
        return returnDate;
    }
    protected checkInvalidValue(value: Date): void {
        if (!(value instanceof Date) && !isNullOrUndefined(value)) {
            let valueDate: Date = null;
            let valueString: string = <string>value;
            if (typeof value === 'number') {
                valueString = (value as string).toString();
            }
            let formatOptions: object = null;
            let formatDateTime: object = null;
            if (this.getModuleName() === 'datetimepicker') {
                let culture: Internationalization = new Internationalization(this.locale);
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.dateTimeFormat, type: 'dateTime', skeleton: 'yMd' };
                    formatDateTime = { format: culture.getDatePattern({ skeleton: 'yMd' }), type: 'dateTime' };
                } else {
                    formatOptions = { format: this.dateTimeFormat, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                    formatDateTime = { format: culture.getDatePattern({ skeleton: 'yMd' }), type: 'dateTime', calendar: 'islamic' };
                }
            } else {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
                } else {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
            }
            let invalid: boolean = false;
            if (typeof valueString !== 'string') {
                valueString = null;
                invalid = true;
            } else {
                if (typeof valueString === 'string') { valueString = valueString.trim(); }
                valueDate = this.checkStringValue(valueString);
                if (!valueDate) {
                    let extISOString: RegExp = null;
                    let basicISOString: RegExp = null;
                    // tslint:disable-next-line
                    extISOString = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
                    // tslint:disable-next-line
                    basicISOString = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
                    if ((!extISOString.test(valueString) && !basicISOString.test(valueString))
                        || (/^[a-zA-Z0-9- ]*$/).test(valueString) || isNaN(+new Date(this.checkValue(valueString)))) {
                        invalid = true;
                    } else {
                        valueDate = new Date(valueString);
                    }
                }
            }
            if (invalid) {
                if (!this.strictMode) { this.invalidValueString = valueString; }
                this.setProperties({ value: null }, true);
            } else {
                this.setProperties({ value: valueDate }, true);
            }
        }
    };
    private bindInputEvent(): void {
        if (!isNullOrUndefined(this.formatString)) {
            if (this.formatString.indexOf('y') === -1) {
                EventHandler.add(this.inputElement, 'input', this.inputHandler, this);
            } else {
                EventHandler.remove(this.inputElement, 'input', this.inputHandler);
            }
        }
    }
    protected bindEvents(): void {
        if (this.enabled) {
            EventHandler.add(this.inputWrapper.buttons[0], 'mousedown touchstart', this.dateIconHandler, this);
            EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
            EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
            this.bindInputEvent();
            // To prevent the twice triggering.
            EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
            if (this.showClearButton && this.inputWrapper.clearButton) {
                EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
            }
            if (this.formElement) {
                EventHandler.add(this.formElement, 'reset', this.resetFormHandler, this);
            }
        } else {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', this.dateIconHandler);
            EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
            if (this.showClearButton && this.inputWrapper.clearButton) {
                EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler);
            }
            if (this.formElement) {
                EventHandler.remove(this.formElement, 'reset', this.resetFormHandler);
            }
        }
        this.defaultKeyConfigs = (extend(this.defaultKeyConfigs, this.keyConfigs) as { [key: string]: string });
        this.keyboardModules = new KeyboardEvents(
            <HTMLElement>this.inputElement,
            {
                eventName: 'keydown',
                keyAction: this.inputKeyActionHandle.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
    }
    protected resetFormHandler(): void {
        if (!this.inputElement.disabled) {
            let value: string = this.inputElement.getAttribute('value');
            if (this.element.tagName === 'EJS-DATEPICKER' || this.element.tagName === 'EJS-DATETIMEPICKER') {
                value = '';
                this.inputValueCopy = null;
                this.inputElement.setAttribute('value', '');
            }
            this.setProperties({ value: this.inputValueCopy }, true);
            this.restoreValue();
            if (this.inputElement) {
                Input.setValue(value, this.inputElement, this.floatLabelType, this.showClearButton);
                this.errorClass();
            }
        }
    }
    protected restoreValue(): void {
        this.currentDate = this.value ? this.value : new Date();
        this.previousDate = this.value;
        this.previousElementValue = (isNullOrUndefined(this.inputValueCopy)) ? '' :
            this.globalize.formatDate(this.inputValueCopy, { format: this.formatString, type: 'dateTime', skeleton: 'yMd' });
    }
    private inputChangeHandler(e: MouseEvent): void {
        e.stopPropagation();
    }
    private bindClearEvent(): void {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
        }
    }
    protected resetHandler(e?: MouseEvent): void {
        e.preventDefault();
        this.clear(e);
    }
    private clear(event: MouseEvent): void {
        this.setProperties({ value: null }, true);
        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        this.invalidValueString = '';
        this.updateInput();
        this.popupUpdate();
        this.changeEvent(event);
    }

    private dateIconHandler(e?: MouseEvent): void {
        if (Browser.isDevice) {
            this.inputElement.setAttribute('readonly', '');
            this.inputElement.blur();
        }
        e.preventDefault();
        if (!this.readonly) {
            if (this.isCalendar()) {
                this.hide(e);
            } else {
                this.isDateIconClicked = true;
                this.show(null, e);
                if (this.getModuleName() === 'datetimepicker') {
                    (this.inputElement as HTMLElement).focus();
                }
                (<HTMLElement>this.inputElement).focus();
                addClass([this.inputWrapper.container], [INPUTFOCUS]);
                addClass(this.inputWrapper.buttons, ACTIVE);
            }
        }
    }
    protected updateHtmlAttributeToWrapper(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (let key of Object.keys(this.htmlAttributes)) {
                if (containerAttr.indexOf(key) > -1 ) {
                    if (key === 'class') {
                        addClass([this.inputWrapper.container], this.htmlAttributes[key].split(' '));
                    } else if (key === 'style') {
                        let setStyle: string = this.inputWrapper.container.getAttribute(key);
                        setStyle = !isNullOrUndefined(setStyle) ? (setStyle + this.htmlAttributes[key]) :
                        this.htmlAttributes[key];
                        this.inputWrapper.container.setAttribute(key, setStyle);
                    } else {
                        this.inputWrapper.container.setAttribute(key, this.htmlAttributes[key]);
                    }
                }
            }
        }
    }

    protected updateHtmlAttributeToElement(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (let key of Object.keys(this.htmlAttributes)) {
                if (containerAttr.indexOf(key) < 0 ) {
                    this.inputElement.setAttribute(key, this.htmlAttributes[key]);
                }
            }
        }
    }
    private CalendarKeyActionHandle(e: KeyboardEventArgs): void {
        switch (e.action) {
            case 'escape':
                if (this.isCalendar()) {
                    this.hide(e);
                } else {
                    (this.inputWrapper.container.children[this.index] as HTMLElement).blur();
                }
                break;
            case 'enter':
                if (!this.isCalendar()) {
                    this.show(null, e);
                } else {
                    if (+this.value !== +this.currentDate && !this.isCalendar()) {
                        (this.inputWrapper.container.children[this.index] as HTMLElement).focus();
                    }
                }
                if (this.getModuleName() === 'datetimepicker') {
                    this.inputElement.focus();
                }
                break;
            case 'tab':
                this.hide(e);
        }
    }
    private inputFocusHandler(): void {
        let focusArguments: BlurEventArgs = {
            model: this
        };
        this.isDateIconClicked = false;
        this.trigger('focus', focusArguments);
        this.updateIconState();
    }
    private inputHandler(e: MouseEvent): void {
        this.isPopupClicked = false;
    }
    private inputBlurHandler(e: MouseEvent): void {
        this.strictModeUpdate();
        if (this.inputElement.value === '' && isNullOrUndefined(this.value)) {
            this.invalidValueString = null;
            Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        }
        this.updateInput();
        this.popupUpdate();
        this.changeTrigger(e);
        this.errorClass();
        if (this.isCalendar() && document.activeElement === this.inputElement) {
            this.hide(e);
        }
        if (this.getModuleName() === 'datepicker') {
            let blurArguments: BlurEventArgs = {
                model: this
            };
            this.trigger('blur', blurArguments);
        }
        if (this.isCalendar()) {
            this.defaultKeyConfigs = (extend(this.defaultKeyConfigs, this.keyConfigs) as { [key: string]: string });
            this.calendarKeyboardModules = new KeyboardEvents(<HTMLElement>this.calendarElement.children[1].firstElementChild, {
                eventName: 'keydown',
                keyAction: this.CalendarKeyActionHandle.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
        }
        this.isPopupClicked = false;
    }
    private documentHandler(e: MouseEvent): void {
        if (e.type !== 'touchstart') {
            e.preventDefault();
        }
        let target: HTMLElement = <HTMLElement>e.target;
        if (!(closest(target, '.e-datepicker.e-popup-wrapper'))
            && !(closest(target, '.' + INPUTCONTAINER) === this.inputWrapper.container)
            && (!target.classList.contains('e-day'))) {
            this.hide(e);
            this.focusOut();
        }
    }
    protected inputKeyActionHandle(e: KeyboardEventArgs): void {
        switch (e.action) {
            case 'altUpArrow':
                this.isAltKeyPressed = false;
                this.hide(e);
                this.inputElement.focus();
                break;
            case 'altDownArrow':
                this.isAltKeyPressed = true;
                this.strictModeUpdate();
                this.updateInput();
                this.changeTrigger(e);
                if (this.getModuleName() === 'datepicker') {
                    this.show(null, e);
                }
                break;
            case 'escape':
                this.hide(e);
                break;
            case 'enter':
                this.strictModeUpdate();
                this.updateInput();
                this.popupUpdate();
                this.changeTrigger(e);
                this.errorClass();
                if (!this.isCalendar() && document.activeElement === this.inputElement) {
                    this.hide(e);
                }
                if (this.isCalendar()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                break;
            case 'tab':
                this.strictModeUpdate();
                this.updateInput();
                this.popupUpdate();
                this.changeTrigger(e);
                this.errorClass();
                this.hide(e);
                break;
            default:
                this.defaultAction(e);
        }
    }
    protected defaultAction(e: KeyboardEventArgs): void {
        this.previousDate = ((!isNullOrUndefined(this.value) && new Date(+this.value)) || null);
        if (this.isCalendar()) {
            super.keyActionHandle(e);
            attributes(this.inputElement, {
                'aria-activedescendant': '' + this.setActiveDescendant()
            });
        }
    }
    protected popupUpdate(): void {
        if ((isNullOrUndefined(this.value)) && (!isNullOrUndefined(this.previousDate)) ||
            (+this.value !== +this.previousDate)) {
            if (this.popupObj) {
                if (this.popupObj.element.querySelectorAll('.' + SELECTED).length > 0) {
                    removeClass(this.popupObj.element.querySelectorAll('.' + SELECTED), [SELECTED]);
                }
            }
            if (!isNullOrUndefined(this.value)) {
                if ((+this.value >= +this.min) && (+this.value <= +this.max)) {
                    let targetdate: Date = new Date(this.checkValue(this.value));
                    super.navigateTo('Month', targetdate);
                }
            }
        }
    }
    protected strictModeUpdate(): void {
        let format: string;
        let formatOptions: DateFormatOptions;
        if (this.getModuleName() === 'datetimepicker') {
            format = !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat;
        } else {
            format = isNullOrUndefined(this.formatString) ? this.formatString : this.formatString.replace('dd', 'd');
        }
        if (!isNullOrUndefined(format)) {
            let len: number = format.split('M').length - 1;
            if (len < 3) {
                format = format.replace('MM', 'M');
            }
        }
        let dateOptions: object;
        if (this.getModuleName() === 'datetimepicker') {
            if (this.calendarMode === 'Gregorian') {
                dateOptions = {
                    format: !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd'
                };
            } else {
                dateOptions = {
                    format: !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                };
            }

        } else {
            if (this.calendarMode === 'Gregorian') {
                formatOptions = { format: format, type: 'dateTime', skeleton: 'yMd' };
            } else {
                formatOptions = { format: format, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }
            dateOptions = formatOptions;
        }
        let date: Date;
        if (typeof this.inputElement.value === 'string') { this.inputElement.value = this.inputElement.value.trim(); }
        if ((this.getModuleName() === 'datetimepicker')) {
            if (this.checkDateValue(this.globalize.parseDate(this.inputElement.value, dateOptions))) {
                date = this.globalize.parseDate(this.inputElement.value, dateOptions);
            } else {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { type: 'dateTime', skeleton: 'yMd' };
                } else {
                    formatOptions = { type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                date = this.globalize.parseDate(this.inputElement.value, formatOptions);
            }
        } else {
            date = this.globalize.parseDate(this.inputElement.value, dateOptions);
            if (!isNullOrUndefined(this.formatString) && this.inputElement.value !== '' && this.strictMode) {
                if ((this.isPopupClicked || (!this.isPopupClicked && this.inputElement.value === this.previousElementValue))
                    && this.formatString.indexOf('y') === -1) {
                    date.setFullYear(this.value.getFullYear());
                }
            }
        }
        if (this.strictMode && date) {
            Input.setValue(this.globalize.formatDate(date, dateOptions), this.inputElement, this.floatLabelType, this.showClearButton);
            if (this.inputElement.value !== this.previousElementValue) {
                this.setProperties({ value: date }, true);
            }
        } else if (!this.strictMode) {
            if (this.inputElement.value !== this.previousElementValue) {
                this.setProperties({ value: date }, true);
            }
        }
        if (this.strictMode && !date && this.inputElement.value === '') {
            this.setProperties({ value: null }, true);
        }
        if (isNaN(+this.value)) {
            this.setProperties({ value: null }, true);
        }
        if (isNullOrUndefined(this.value)) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
        }
    }
    private createCalendar(): void {
        this.popupWrapper = this.createElement('div', { className: '' + ROOT + ' ' + POPUPWRAPPER });
        if (!isNullOrUndefined(this.cssClass)) { this.popupWrapper.className += ' ' + this.cssClass; }
        if (Browser.isDevice) {
            this.modelHeader();
            this.modal = this.createElement('div');
            this.modal.className = '' + ROOT + ' e-date-modal';
            document.body.className += ' ' + OVERFLOW;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
        //this.calendarElement represent the Calendar object from the Calendar class.
        this.calendarElement.querySelector('table tbody').className = '';
        this.popupObj = new Popup(this.popupWrapper as HTMLElement, {
            content: this.calendarElement,
            relateTo: Browser.isDevice ? document.body : this.inputWrapper.container,
            position: Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            offsetY: OFFSETVALUE,
            targetType: 'container',
            enableRtl: this.enableRtl,
            zIndex: this.zIndex,
            collision: Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            open: () => {
                if (this.getModuleName() !== 'datetimepicker') {
                    if (document.activeElement !== this.inputElement) {
                        this.defaultKeyConfigs = (extend(this.defaultKeyConfigs, this.keyConfigs) as { [key: string]: string });
                        (<HTMLElement>this.calendarElement.children[1].firstElementChild).focus();
                        this.calendarKeyboardModules = new KeyboardEvents(
                            <HTMLElement>this.calendarElement.children[1].firstElementChild,
                            {
                                eventName: 'keydown',
                                keyAction: this.CalendarKeyActionHandle.bind(this),
                                keyConfigs: this.defaultKeyConfigs
                            });
                        this.calendarKeyboardModules = new KeyboardEvents(
                            <HTMLElement>this.inputWrapper.container.children[this.index],
                            {
                                eventName: 'keydown',
                                keyAction: this.CalendarKeyActionHandle.bind(this),
                                keyConfigs: this.defaultKeyConfigs
                            });
                    }
                }
            }, close: () => {
                if (this.isDateIconClicked) {
                    (this.inputWrapper.container.children[this.index] as HTMLElement).focus();
                }
                if (this.value) {
                    this.disabledDates();
                }
                if (this.popupObj) {
                    this.popupObj.destroy();
                }
                detach(this.popupWrapper);
                this.popupObj = this.popupWrapper = null;
                this.setAriaAttributes();
            }
        });
        this.popupObj.element.className += ' ' + this.cssClass;
        this.setAriaAttributes();
    }

    private setAriaDisabled(): void {
        if (!this.enabled) {
            this.inputElement.setAttribute('aria-disabled', 'true');
            this.inputElement.tabIndex = -1;
        } else {
            this.inputElement.setAttribute('aria-disabled', 'false');
            this.inputElement.setAttribute('tabindex', this.tabIndex);
        }
    }
    private modelHeader(): void {
        let dateOptions: DateFormatOptions;
        let modelHeader: HTMLElement = this.createElement('div', { className: 'e-model-header' });
        let yearHeading: HTMLElement = this.createElement('h1', { className: 'e-model-year' });
        let h2: HTMLElement = this.createElement('div');
        let daySpan: HTMLElement = this.createElement('span', { className: 'e-model-day' });
        let monthSpan: HTMLElement = this.createElement('span', { className: 'e-model-month' });
        if (this.calendarMode === 'Gregorian') {
            dateOptions = { format: 'y', skeleton: 'dateTime' };
        } else {
            dateOptions = { format: 'y', skeleton: 'dateTime', calendar: 'islamic' };
        }
        yearHeading.textContent = '' + this.globalize.formatDate(this.value || new Date(), dateOptions);
        if (this.calendarMode === 'Gregorian') {
            dateOptions = { format: 'E', skeleton: 'dateTime' };
        } else {
            dateOptions = { format: 'E', skeleton: 'dateTime', calendar: 'islamic' };
        }
        daySpan.textContent = '' + this.globalize.formatDate(this.value || new Date(), dateOptions) + ', ';
        if (this.calendarMode === 'Gregorian') {
            dateOptions = { format: 'MMM d', skeleton: 'dateTime' };
        } else {
            dateOptions = { format: 'MMM d', skeleton: 'dateTime', calendar: 'islamic' };
        }
        monthSpan.textContent = '' + this.globalize.formatDate(this.value || new Date(), dateOptions);
        modelHeader.appendChild(yearHeading);
        h2.appendChild(daySpan);
        h2.appendChild(monthSpan);
        modelHeader.appendChild(h2);
        this.calendarElement.insertBefore(modelHeader, this.calendarElement.firstElementChild);
    }

    protected changeTrigger(event?: MouseEvent | KeyboardEvent): void {
        if (this.inputElement.value !== this.previousElementValue) {
            if (((this.previousDate && this.previousDate.valueOf()) !== (this.value && this.value.valueOf()))) {
                this.changedArgs.value = this.value;
                this.changedArgs.event = event || null;
                this.changedArgs.element = this.element;
                this.changedArgs.isInteracted = !isNullOrUndefined(event);
                this.trigger('change', this.changedArgs);
                this.previousElementValue = this.inputElement.value;
                this.previousDate = !isNaN(+new Date(this.checkValue(this.value))) ? new Date(this.checkValue(this.value)) : null;
                this.isInteracted = true;
            }
        }
    }

    protected navigatedEvent(): void {
        this.trigger('navigated', this.navigatedArgs);
    }
    protected changeEvent(event?: MouseEvent | KeyboardEvent | Event): void {
        if (((this.previousDate && this.previousDate.valueOf()) !== (this.value && this.value.valueOf()))) {
            this.selectCalendar(event);
            this.changedArgs.event = event ? event : null;
            this.changedArgs.element = this.element;
            this.changedArgs.isInteracted = this.isInteracted;
            this.trigger('change', this.changedArgs);
            this.previousDate = this.value && new Date(+this.value);
            this.hide(event);
            this.previousElementValue = this.inputElement.value;
            this.errorClass();
        }
    }

    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this) {
            modules.push({ args: [this], member: 'islamic' });
        }

        return modules;
    }

    protected selectCalendar(e?: MouseEvent | KeyboardEvent | Event): void {
        let date: string;
        let tempFormat: string;
        let formatOptions: DateFormatOptions;
        if (this.getModuleName() === 'datetimepicker') {
            tempFormat = !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat;
        } else {
            tempFormat = this.formatString;
        }
        if (this.value) {
            if (this.getModuleName() === 'datetimepicker') {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: tempFormat, type: 'dateTime', skeleton: 'yMd' };
                } else {
                    formatOptions = { format: tempFormat, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                date = this.globalize.formatDate(this.changedArgs.value, formatOptions);
            } else {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
                } else {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
                date = this.globalize.formatDate(this.changedArgs.value, formatOptions);
            }
        }
        if (!isNullOrUndefined(date)) { Input.setValue(date, this.inputElement, this.floatLabelType, this.showClearButton); }
    }
    protected isCalendar(): boolean {
        if (this.popupWrapper && this.popupWrapper.classList.contains('' + POPUPWRAPPER)) {
            return true;
        }
        return false;
    }
    protected setWidth(width: number | string): void {
        if (typeof width === 'number') {
            this.inputWrapper.container.style.width = formatUnit(this.width);
        } else if (typeof width === 'string') {
            this.inputWrapper.container.style.width = (width.match(/px|%|em/)) ? <string>(this.width) : <string>(formatUnit(this.width));
        } else {
            this.inputWrapper.container.style.width = '100%';
        }
    }
    /** 
     * Shows the Calendar.
     * @returns void
     */
    public show(type?: null | string, e?: MouseEvent | KeyboardEvent | KeyboardEventArgs): void {
        if ((this.enabled && this.readonly) || !this.enabled || this.popupObj) {
            return;
        } else {
            let prevent: boolean = true;
            let outOfRange: Date;
            if (!isNullOrUndefined(this.value) && !(+this.value >= +this.min && +this.value <= +this.max)) {
                outOfRange = new Date(this.checkValue(this.value));
                this.setProperties({ 'value': null }, true);
            } else {
                outOfRange = this.value || null;
            }
            if (!this.isCalendar()) {
                super.render();
                this.setProperties({ 'value': outOfRange || null }, true);
                this.previousDate = outOfRange;
                this.createCalendar();
            }
            if (Browser.isDevice) {
                this.mobilePopupWrapper = this.createElement('div', { className: 'e-datepick-mob-popup-wrap'});
                document.body.appendChild(this.mobilePopupWrapper);
            }
            this.preventArgs = {
                preventDefault: (): void => {
                    prevent = false;
                },
                popup: this.popupObj,
                event: e || null,
                cancel: false,
                appendTo: Browser.isDevice ? this.mobilePopupWrapper : document.body
            };
            let eventArgs: PopupObjectArgs = this.preventArgs;
            this.trigger('open', eventArgs, (eventArgs: PopupObjectArgs) => {
                this.preventArgs = eventArgs;
                if (prevent && !this.preventArgs.cancel) {
                    addClass(this.inputWrapper.buttons, ACTIVE);
                    this.preventArgs.appendTo.appendChild(this.popupWrapper);
                    this.popupObj.refreshPosition(this.inputElement);
                    let openAnimation: object = {
                        name: 'FadeIn',
                        duration: Browser.isDevice ? 0 : OPENDURATION,
                    };
                    if (this.zIndex === 1000) {
                        this.popupObj.show(new Animation(openAnimation), this.element);
                    } else {
                        this.popupObj.show(new Animation(openAnimation), null);
                    }
                    super.setOverlayIndex(this.mobilePopupWrapper, this.popupObj.element, this.modal, Browser.isDevice);
                    this.setAriaAttributes();
                } else {
                    this.popupObj.destroy();
                    this.popupWrapper = this.popupObj = null;
                }
                EventHandler.add(document, 'mousedown touchstart', this.documentHandler, this);
            });
        }
    }
    /** 
     * Hide the Calendar.
     * @returns void 
     */
    public hide(event?: MouseEvent | KeyboardEvent | Event): void {
        if (!isNullOrUndefined(this.popupWrapper)) {
            let prevent: boolean = true;
            this.preventArgs = {
                preventDefault: (): void => {
                    prevent = false;
                },
                popup: this.popupObj,
                event: event || null,
                cancel: false
            };
            removeClass(this.inputWrapper.buttons, ACTIVE);
            removeClass([document.body], OVERFLOW);
            let eventArgs: PopupObjectArgs = this.preventArgs;
            if (this.isCalendar()) {
                this.trigger('close', eventArgs, (eventArgs: PopupObjectArgs) => {
                    this.closeEventCallback(prevent, eventArgs);
                });
            } else {
                this.closeEventCallback(prevent, eventArgs);
            }
        } else {
            if (Browser.isDevice && this.allowEdit && !this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
            this.setAllowEdit();
        }
    }
    private closeEventCallback(prevent: boolean, eventArgs: PopupObjectArgs): void {
        this.preventArgs = eventArgs;
        if (this.isCalendar() && (prevent && !this.preventArgs.cancel)) {
            let closeAnimation: object = {
                name: 'FadeOut',
                duration: CLOSEDURATION,
            };
            this.popupObj.hide();
            this.isAltKeyPressed = false;
            this.keyboardModule.destroy();
            removeClass(this.inputWrapper.buttons, ACTIVE);
        }
        this.setAriaAttributes();
        if (Browser.isDevice && this.modal) {
            this.modal.style.display = 'none';
            this.modal.outerHTML = '';
            this.modal = null;
        }
        if (Browser.isDevice) {
            if (!isNullOrUndefined(this.mobilePopupWrapper)) {
                this.mobilePopupWrapper.remove();
                this.mobilePopupWrapper = null;
            }
        }
        EventHandler.remove(document, 'mousedown touchstart', this.documentHandler);
        if (Browser.isDevice && this.allowEdit && !this.readonly) {
            this.inputElement.removeAttribute('readonly');
        }
        this.setAllowEdit();
    }
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    public focusIn(triggerEvent?: boolean): void {
        if (document.activeElement !== this.inputElement && this.enabled) {
            (<HTMLElement>this.inputElement).focus();
            addClass([this.inputWrapper.container], [INPUTFOCUS]);
            let focusArguments: BlurEventArgs = {
                model: this
            };
        }
    }
    /**
     * Remove the focus from widget, if the widget is in focus state. 
     * @returns void
     */
    public focusOut(): void {
        if (document.activeElement === this.inputElement) {
            removeClass([this.inputWrapper.container], [INPUTFOCUS]);
            this.inputElement.blur();
        }
    }
    /** 
     * Gets the current view of the DatePicker.
     * @returns string 
     */
    public currentView(): string {
        let currentView: string;
        if (this.calendarElement) {
            // calls the Calendar currentView public method
            currentView = super.currentView();
        }
        return currentView;
    }
    /**
     * Navigates to specified month or year or decade view of the DatePicker.
     * @param  {string} view - Specifies the view of the calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     */
    public navigateTo(view: CalendarView, date: Date): void {
        if (this.calendarElement) {
            // calls the Calendar navigateTo public method
            super.navigateTo(view, date);
        }
    }
    /**
     * To destroy the widget.    
     * @returns void
     */
    public destroy(): void {
        super.destroy();
        this.keyboardModules.destroy();
        if (this.popupObj && this.popupObj.element.classList.contains(POPUP)) {
            super.destroy();
        }
        let ariaAttrs: object = {
            'aria-live': 'assertive', 'aria-atomic': 'true', 'aria-disabled': 'true',
            'aria-haspopup': 'true', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false'
        };
        if (this.inputElement) {
            Input.removeAttributes(<{ [key: string]: string }>ariaAttrs, this.inputElement);
            (!isNullOrUndefined(this.inputElementCopy.getAttribute('tabindex'))) ?
                this.inputElement.setAttribute('tabindex', this.tabIndex) : this.inputElement.removeAttribute('tabindex');
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
            this.ensureInputAttribute();
        }
        if (this.isCalendar()) {
            if (this.popupWrapper) { detach(this.popupWrapper); }
            this.popupObj = this.popupWrapper = null;
            this.keyboardModule.destroy();
        }
        if (this.ngTag === null) {
            if (this.inputElement) {
                this.inputWrapper.container.insertAdjacentElement('afterend', this.inputElement);
                removeClass([this.inputElement], [INPUTROOT]);
            }
            removeClass([this.element], [ROOT]);
            detach(this.inputWrapper.container);
        }
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.resetFormHandler);
        }
    }

    protected ensureInputAttribute(): void {
        let prop: string[] = [];
        for (let i: number = 0; i < this.inputElement.attributes.length; i++) {
            prop[i] = this.inputElement.attributes[i].name;
        }
        for (let i: number = 0; i < prop.length; i++) {
            if (isNullOrUndefined(this.inputElementCopy.getAttribute(prop[i]))) {
                if (prop[i].toLowerCase() === 'value') {
                    this.inputElement.value = '';
                }
                this.inputElement.removeAttribute(prop[i]);
            } else {
                if (prop[i].toLowerCase() === 'value') {
                    this.inputElement.value = this.inputElementCopy.getAttribute(prop[i]);
                }
                this.inputElement.setAttribute(prop[i], this.inputElementCopy.getAttribute(prop[i]));
            }
        }
    }
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void {
        this.inputElementCopy = <HTMLElement>this.element.cloneNode(true);
        removeClass([this.inputElementCopy], [ROOT, CONTROL, LIBRARY]);
        this.inputElement = <HTMLInputElement>this.element;
        this.formElement = <HTMLFormElement>closest(this.inputElement, 'form');
        this.index = this.showClearButton ? 2 : 1;
        this.ngTag = null;
        if (this.element.tagName === 'EJS-DATEPICKER' || this.element.tagName === 'EJS-DATETIMEPICKER') {
            this.ngTag = this.element.tagName;
            this.inputElement = <HTMLInputElement>this.createElement('input');
            this.element.appendChild(this.inputElement);
        }
        if (this.element.getAttribute('id')) {
            if (this.ngTag !== null) { this.inputElement.id = this.element.getAttribute('id') + '_input'; }
        } else {
            if (this.getModuleName() === 'datetimepicker') {
                this.element.id = getUniqueID('ej2-datetimepicker');
                if (this.ngTag !== null) { attributes(this.inputElement, { 'id': this.element.id + '_input' }); }
            } else {
                this.element.id = getUniqueID('ej2-datepicker');
                if (this.ngTag !== null) { attributes(this.inputElement, { 'id': this.element.id + '_input' }); }
            }
        }
        if (this.ngTag !== null) { this.validationAttribute(this.element, this.inputElement); }
        this.updateHtmlAttributeToElement();
        this.checkHtmlAttributes(false);
        this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
        this.element.removeAttribute('tabindex');
        super.preRender();
    };
    protected validationAttribute(target: HTMLElement, inputElement: Element): void {
        let nameAttribute: string = target.getAttribute('name') ? target.getAttribute('name') : target.getAttribute('id');
        inputElement.setAttribute('name', nameAttribute);
        target.removeAttribute('name');
        let attribute: string[] = ['required', 'aria-required', 'form'];
        for (let i: number = 0; i < attribute.length; i++) {
            if (isNullOrUndefined(target.getAttribute(attribute[i]))) { continue; }
            let attr: string = target.getAttribute(attribute[i]);
            inputElement.setAttribute(attribute[i], attr);
            target.removeAttribute(attribute[i]);
        }
    }
    protected checkFormat(): void {
        let culture: Internationalization = new Internationalization(this.locale);
        if (this.format) {
            if (typeof this.format === 'string') {
                this.formatString = this.format;
            } else if (this.format.skeleton !== '' && !isNullOrUndefined(this.format.skeleton)) {
                let skeletonString: string = this.format.skeleton;
                if (this.getModuleName() === 'datetimepicker') {
                    this.formatString = culture.getDatePattern({ skeleton: skeletonString, type: 'dateTime' });
                } else {
                    this.formatString = culture.getDatePattern({ skeleton: skeletonString, type: 'date' });
                }
            } else {
                if (this.getModuleName() === 'datetimepicker') {
                    this.formatString = this.dateTimeFormat;
                } else {
                    this.formatString = null;
                }
            }
        } else {
            this.formatString = null;
        }
    }
    private checkHtmlAttributes(dynamic: boolean): void {
        this.globalize = new Internationalization(this.locale);
        this.checkFormat();
        this.checkView();
        let attributes: string[] = dynamic ? isNullOrUndefined(this.htmlAttributes) ? [] :  Object.keys(this.htmlAttributes) :
            ['value', 'min', 'max', 'disabled', 'readonly', 'style', 'name', 'placeholder', 'type'];
        let options: object;
        if (this.getModuleName() === 'datetimepicker') {
            if (this.calendarMode === 'Gregorian') {
                options = {
                    format: !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd'
                };
            } else {
                options = {
                    format: !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                };
            }

        } else {
            if (this.calendarMode === 'Gregorian') {
                options = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
            } else {
                options = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }
        }
        for (let prop of attributes) {
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                         // tslint:disable-next-line
                         if (( isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['enabled'] === undefined)) || dynamic) {
                            let enabled: boolean = this.inputElement.getAttribute(prop) === 'disabled' || this.inputElement.getAttribute(prop) === '' ||
                                this.inputElement.getAttribute(prop) === 'true' ? false : true;
                            this.setProperties({ enabled: enabled }, !dynamic);
                        }
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if (( isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['readonly'] === undefined)) || dynamic) {
                            let readonly: boolean = this.inputElement.getAttribute(prop) === 'readonly' || this.inputElement.getAttribute(prop) === '' ||
                                this.inputElement.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, !dynamic);
                        }
                        break;
                    case 'placeholder':
                        // tslint:disable-next-line
                        if (( isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['placeholder'] === undefined)) || dynamic) {
                            let placeholder: string = this.inputElement.getAttribute(prop);
                            this.setProperties({ placeholder: this.inputElement.getAttribute(prop) }, !dynamic);
                        }
                        break;
                    case 'style':
                        this.inputElement.setAttribute('style', '' + this.inputElement.getAttribute(prop));
                        break;
                    case 'name':
                        this.inputElement.setAttribute('name', '' + this.inputElement.getAttribute(prop));
                        break;
                    case 'value':
                        // tslint:disable-next-line
                        if (( isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['value'] === undefined)) || dynamic) {
                            let value: string = this.inputElement.getAttribute(prop);
                            this.setProperties(setValue(prop, this.globalize.parseDate(value, options), {}), !dynamic);
                        }
                        break;
                    case 'min':
                        if ((+this.min === +new Date(1900, 0, 1)) || dynamic) {
                            let min: string = this.inputElement.getAttribute(prop);
                            this.setProperties(setValue(prop, this.globalize.parseDate(min), {}), !dynamic);
                        }
                        break;
                    case 'max':
                        if ((+this.max === +new Date(2099, 11, 31)) || dynamic) {
                            let max: string = this.inputElement.getAttribute(prop);
                            this.setProperties(setValue(prop, this.globalize.parseDate(max), {}), !dynamic);
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
    /**
     * To get component name.
     * @private
     */
    protected getModuleName(): string {
        return 'datepicker';
    }
    private disabledDates(): void {
        let valueCopy: Date;
        let formatOptions: DateFormatOptions;
        let globalize: string;
        valueCopy = this.checkDateValue(this.value) ? new Date(+this.value) : new Date(this.checkValue(this.value));
        let previousValCopy: Date = this.previousDate;
        //calls the Calendar render method to check the disabled dates through renderDayCell event and update the input value accordingly.
        this.minMaxUpdates();
        super.render();
        this.previousDate = previousValCopy;
        let date: number = valueCopy && +(valueCopy);
        let dateIdString: string = '*[id^="/id"]'.replace('/id', '' + date);
        if (!this.strictMode) {
            if (typeof this.value === 'string' || ((typeof this.value === 'object') && (+this.value) !== (+valueCopy))) {
                this.setProperties({ value: valueCopy }, true);
            }
        }
        if (!isNullOrUndefined(this.calendarElement.querySelectorAll(dateIdString)[0])) {
            if (this.calendarElement.querySelectorAll(dateIdString)[0].classList.contains('e-disabled')) {
                if (!this.strictMode) {
                    this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
                }
            }
        }
        let inputVal: string;
        if (this.getModuleName() === 'datetimepicker') {
            if (this.calendarMode === 'Gregorian') {
                globalize = this.globalize.formatDate(valueCopy, {
                    format: !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd'
                });
            } else {
                globalize = this.globalize.formatDate(valueCopy, {
                    format: !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat,
                    type: 'dateTime', skeleton: 'yMd', calendar: 'islamic'
                });
            }
            inputVal = globalize;
        } else {
            if (this.calendarMode === 'Gregorian') {
                formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
            } else {
                formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
            }
            inputVal = this.globalize.formatDate(valueCopy, formatOptions);
        }
        if (!this.popupObj) {
            Input.setValue(inputVal, this.inputElement, this.floatLabelType, this.showClearButton);
        }
    }
    private setAriaAttributes(): void {
        if (this.isCalendar()) {
            Input.addAttributes({ 'aria-expanded': 'true' }, this.inputElement);
            attributes(this.inputElement, {
                'aria-activedescendant': '' + this.setActiveDescendant()
            });
        } else {
            Input.addAttributes({ 'aria-expanded': 'false' }, this.inputElement);
            attributes(this.inputElement, {
                'aria-activedescendant': 'null'
            });
        }
    }
    protected errorClass(): void {
        let dateIdString: string = '*[id^="/id"]'.replace('/id', '' + (+this.value));
        let isDisabledDate: boolean = this.calendarElement &&
            this.calendarElement.querySelectorAll(dateIdString)[0] &&
            this.calendarElement.querySelectorAll(dateIdString)[0].classList.contains('e-disabled');
        if ((!isNullOrUndefined(this.value) && !(+new Date(+this.value).setMilliseconds(0) >= +this.min
            && +new Date(+this.value).setMilliseconds(0) <= +this.max))
            || (!this.strictMode && this.inputElement.value !== '' && isNullOrUndefined(this.value) || isDisabledDate)) {
            addClass([this.inputWrapper.container], ERROR);
            attributes(this.inputElement, { 'aria-invalid': 'true' });
        } else {
            removeClass([this.inputWrapper.container], ERROR);
            attributes(this.inputElement, { 'aria-invalid': 'false' });
        }
    }
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    public onPropertyChanged(newProp: DatePickerModel, oldProp: DatePickerModel): void {
        let options: DateFormatOptions;
        if (this.calendarMode === 'Gregorian') {
            options = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
        } else {
            options = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
        }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'value':
                    this.isInteracted = false;
                    this.invalidValueString = null;
                    this.checkInvalidValue(newProp.value);
                    newProp.value = this.value;
                    this.previousElementValue = this.inputElement.value;
                    if (isNullOrUndefined(this.value)) {
                        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
                        this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
                    }
                    this.updateInput();
                    if (+this.previousDate !== +this.value) {
                        this.changeTrigger(null);
                    }
                    break;
                case 'format':
                    this.checkFormat();
                    this.bindInputEvent();
                    this.updateInput();
                    break;
                case 'allowEdit':
                    this.setAllowEdit();
                    break;
                case 'placeholder':
                    Input.setPlaceholder(this.placeholder, this.inputElement);
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement);
                    break;
                case 'enabled':
                    Input.setEnabled(this.enabled, this.inputElement);
                    this.setAriaDisabled();
                    this.bindEvents();
                    break;
                case 'htmlAttributes':
                    this.updateHtmlAttributeToElement();
                    this.updateHtmlAttributeToWrapper();
                    this.checkHtmlAttributes(true);
                    break;
                case 'locale':
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    Input.setPlaceholder(this.placeholder, this.inputElement);
                    this.updateInput();
                    break;
                case 'enableRtl':
                    Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
                    break;
                case 'start':
                case 'depth':
                    this.checkView();
                    if (this.calendarElement) {
                        super.onPropertyChanged(newProp, oldProp);
                    }
                    break;
                case 'zIndex':
                    this.setProperties({ zIndex: newProp.zIndex }, true);
                    break;
                case 'cssClass':
                    Input.setCssClass(newProp.cssClass, [this.inputWrapper.container], oldProp.cssClass);
                    if (this.popupWrapper) {
                        Input.setCssClass(newProp.cssClass, [this.popupWrapper], oldProp.cssClass);
                    }
                    break;
                case 'showClearButton':
                    Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                    this.bindClearEvent();
                    break;
                case 'strictMode':
                    this.invalidValueString = null;
                    this.updateInput();
                    break;
                case 'width':
                    this.setWidth(newProp.width);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
                default:
                    if (this.calendarElement) {
                        super.onPropertyChanged(newProp, oldProp);
                    }
                    break;
            }
            this.hide(null);
        }
    }
}


export interface PopupObjectArgs {
    /** Prevents the default action */
    preventDefault?: Function;
    /** 
     * Defines the DatePicker popup element. 
     * @deprecated
     */
    popup?: Popup;
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */

    cancel?: boolean;
    /**
     * Specifies the original event arguments.
     */

    event?: MouseEvent | KeyboardEvent | Event;
    /**
     * Specifies the node to which the popup element to be appended.
     */
    appendTo?: HTMLElement;
}

export interface PreventableEventArgs {
    /** Prevents the default action */
    preventDefault?: Function;

}