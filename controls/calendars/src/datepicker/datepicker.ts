// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='../calendar/calendar-model.d.ts'/>
import { EventHandler, Property, Internationalization, NotifyPropertyChanges, DateFormatOptions } from '@syncfusion/ej2-base';
import { KeyboardEvents, KeyboardEventArgs, Animation, EmitType, Event, extend, L10n, Browser, formatUnit } from '@syncfusion/ej2-base';
import { detach, addClass, removeClass, closest, attributes } from '@syncfusion/ej2-base';
import { isNullOrUndefined, setValue, getUniqueID, ModuleDeclaration } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { Input, InputObject, IInput, FloatLabelType } from '@syncfusion/ej2-inputs';
import { ChangedEventArgs, CalendarView, Calendar, BlurEventArgs, FocusEventArgs, ClearedEventArgs } from '../calendar/calendar';
import { MaskPlaceholderModel } from '../common/maskplaceholder-model';
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
const ACTIVE: string = 'e-active';
const OVERFLOW: string = 'e-date-overflow';
const DATEICON: string = 'e-date-icon';
const CLEARICON: string = 'e-clear-icon';
const ICONS: string = 'e-icons';
const OPENDURATION: number = 300;
const OFFSETVALUE: number = 4;
const SELECTED: string = 'e-selected';
const FOCUSEDDATE: string = 'e-focused-date';
const NONEDIT: string = 'e-non-edit';
const containerAttr: string[] = ['title', 'class', 'style'];
export interface FormatObject {
    /**
     * Specifies the format in which the date format will process
     */
    skeleton?: string
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
    protected previousElementValue: string;
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
    protected maskedDateValue: string = '';
    private datepickerOptions: DatePickerModel;
    protected defaultKeyConfigs: { [key: string]: string };
    protected mobilePopupWrapper: HTMLElement;
    protected isAngular: boolean = false;
    protected preventChange: boolean = false;
    protected isIconClicked : boolean = false;
    protected isDynamicValueChanged: boolean = false;
    protected moduleName: string = this.getModuleName();
    protected isFocused: boolean = false;
    /**
     * Specifies the width of the DatePicker component.
     *
     * @default null
     */
    @Property(null)
    public width: number | string;
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
     * Specifies the root CSS class of the DatePicker that allows to
     * customize the appearance by overriding the styles.
     *
     * @default null
     */
    @Property(null)
    public cssClass: string;
    /**
     * Specifies the component to act as strict. So that, it allows to enter only a valid date  value within a specified range or else it
     * will resets to previous value. By default, strictMode is in false.
     * it allows invalid or out-of-range date value with highlighted error class.
     *
     * @default false
     * > For more details refer to
     * [`Strict Mode`](../../datepicker/strict-mode/) documentation.
     */
    @Property(false)
    public strictMode: boolean;
    /**
     * Specifies the format of the value that to be displayed in component. By default, the format is based on the culture. You can set
     * the format to "format:'dd/MM/yyyy hh:mm'" or "format:{skeleton:'medium'}" either in string or object.
     * > To know more about the date format standards, refer to the Internationalization Date Format
     * [`Internationalization`](../../common/internationalization/#custom-formats) section.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public format: string | FormatObject;
    /**
     * Specifies the component to be disabled or not.
     *
     * @default true
     */
    @Property(true)
    public enabled: boolean;
    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * {% codeBlock src='datepicker/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };
    /**
     * Gets or sets multiple selected dates of the calendar.
     *
     * @default null
     * @private
     */
    @Property(null)
    public values: Date[];
    /**
     * Specifies the option to enable the multiple dates selection of the calendar.
     *
     * @default false
     * @private
     */
    @Property(false)
    public isMultiSelection: boolean;
    /**
     * Specifies whether to show or hide the clear icon in textbox.
     *
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
     *
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
     * {% codeBlock src='datepicker/keyConfigs/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @deprecated
     */
    @Property(null)
    public keyConfigs: { [key: string]: string };
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
     * specifies the z-index value of the datePicker popup element.
     *
     * @default 1000
     * @aspType int
     */
    @Property(1000)
    public zIndex: number;
    /**
     * Specifies the component in readonly state. When the Component is readonly it does not allow user input.
     *
     * @default false
     */
    @Property(false)
    public readonly: boolean;
    /**
     * Specifies the placeholder text that displayed in textbox.
     *
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
     *
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     */
    @Property('Never')
    public floatLabelType: FloatLabelType | string;

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
     * By default, the popup opens while clicking on the datepicker icon.
     * If you want to open the popup while focusing the date input then specify its value as true.
     *
     * @default false
     */
    @Property(false)
    public openOnFocus : boolean;

    /**
     * Specifies whether it is a masked datepicker or not.
     * By default the datepicker component render without masked input.
     * If you need masked datepicker input then specify it as true.
     *
     * @default false
     */
    @Property(false)
    public enableMask: boolean;

    /**
     * Specifies the mask placeholder to be displayed on masked datepicker.
     *
     * @default {day:'day' , month:'month', year: 'year', hour:'hour',minute:'minute',second:'second',dayOfTheWeek: 'day of the week'}
     */
    @Property({day: 'day' , month: 'month', year: 'year', hour: 'hour', minute: 'minute', second: 'second', dayOfTheWeek: 'day of the week'})
    public maskPlaceholder: MaskPlaceholderModel;


    /**
     * Triggers when the popup is opened.
     *
     * @event open
     */
    @Event()
    public open: EmitType<PreventableEventArgs | PopupObjectArgs>;

    /**
     * Triggers when datepicker value is cleared using clear button.
     *
     * @event cleared
     */
    @Event()
    public cleared: EmitType<ClearedEventArgs>;

    /**
     * Triggers when the popup is closed.
     *
     * @event close
     */
    @Event()
    public close: EmitType<PreventableEventArgs | PopupObjectArgs>;
    /**
     * Triggers when the input loses the focus.
     *
     * @event blur
     */
    @Event()
    public blur: EmitType<BlurEventArgs>;
    /**
     *  Triggers when the input gets focus.
     *
     * @event focus
     */
    @Event()
    public focus: EmitType<FocusEventArgs>;
    /**
     * Triggers when the component is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * Triggers when the component is destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;
    /**
     * Constructor for creating the widget.
     *
     * @param {DatePickerModel} options - Specifies the DatePicker model.
     * @param {string | HTMLInputElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: DatePickerModel, element?: string | HTMLInputElement) {
        super(options, element);
        this.datepickerOptions = options;
    }
    /**
     * To Initialize the control rendering.
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        this.initialize();
        this.bindEvents();
        Input.calculateWidth(this.inputElement, this.inputWrapper.container);
        if (!isNullOrUndefined(this.inputWrapper.buttons[0]) && !isNullOrUndefined(this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0]) && this.floatLabelType !== 'Never') {
            this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0].classList.add('e-icon');
        }
        if (!isNullOrUndefined(closest(this.element, 'fieldset') as HTMLFieldSetElement) && (closest(this.element, 'fieldset') as HTMLFieldSetElement).disabled) {
            this.enabled = false;
        }
        this.renderComplete();
        this.setTimeZone(this.serverTimezoneOffset);
    }
    protected setTimeZone(offsetValue: number ): void {
        if (!isNullOrUndefined(this.serverTimezoneOffset) && this.value) {
            const clientTimeZoneDiff: number = new Date().getTimezoneOffset() / 60;
            const serverTimezoneDiff: number = offsetValue;
            let timeZoneDiff: number = serverTimezoneDiff + clientTimeZoneDiff;
            timeZoneDiff = this.isDayLightSaving() ? timeZoneDiff-- : timeZoneDiff;
            this.value = new Date((this.value).getTime() + (timeZoneDiff * 60 * 60 * 1000));
            this.updateInput();
        }
    }
    protected isDayLightSaving(): boolean {
        const firstOffset: number = new Date(this.value.getFullYear(), 0 , 1).getTimezoneOffset();
        const secondOffset: number = new Date(this.value.getFullYear(), 6 , 1).getTimezoneOffset();
        return (this.value.getTimezoneOffset() < Math.max(firstOffset, secondOffset));
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
        if (this.enableMask) {
            this.notify('createMask', {
                module: 'MaskedDateTime'
            });
        }
        this.createInput();
        this.updateHtmlAttributeToWrapper();
        this.setAllowEdit();
        this.updateInput(true);
        if (this.enableMask && !this.value && this.maskedDateValue && (this.floatLabelType === 'Always' || !this.floatLabelType || !this.placeholder)){
            this.updateInputValue(this.maskedDateValue);
        }
        this.previousElementValue = this.inputElement.value;
        this.previousDate = !isNullOrUndefined(this.value) ? new Date(+this.value) : null;
        this.inputElement.setAttribute('value', this.inputElement.value);

        this.inputValueCopy = this.value;
    }

    private createInput(): void {
        const ariaAttrs: object = {
            'aria-atomic': 'true', 'aria-expanded': 'false',
            'role': 'combobox', 'autocomplete': 'off', 'autocorrect': 'off',
            'autocapitalize': 'off', 'spellcheck': 'false', 'aria-invalid': 'false'
        };
        if (this.getModuleName() === 'datepicker') {
            const l10nLocale: object = { placeholder: this.placeholder };
            this.globalize = new Internationalization(this.locale);
            this.l10n = new L10n('datepicker', l10nLocale, this.locale);
            this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        }
        let updatedCssClassValues: string = this.cssClass;
        if (!isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            updatedCssClassValues = (this.cssClass.replace(/\s+/g, ' ')).trim();
        }
        const isBindClearAction: boolean = this.enableMask ? false : true;
        this.inputWrapper = Input.createInput(
            {
                element: this.inputElement,
                floatLabelType: this.floatLabelType,
                bindClearAction: isBindClearAction,
                properties: {
                    readonly: this.readonly,
                    placeholder: this.placeholder,
                    cssClass: updatedCssClassValues,
                    enabled: this.enabled,
                    enableRtl: this.enableRtl,
                    showClearButton: this.showClearButton
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
    protected updateInput(isDynamic: boolean = false): void {
        let formatOptions: DateFormatOptions;
        if (this.value && !this.isCalendar()) {
            this.disabledDates(isDynamic);
        }
        if (isNaN(+new Date(this.checkValue(this.value)))) {
            this.setProperties({ value: null }, true);
        }
        if (this.strictMode) {
            //calls the Calendar processDate protected method to update the date value according to the strictMode true behaviour.
            super.validateDate();
            this.minMaxUpdates();
            super.minMaxUpdate();
        }
        if (!isNullOrUndefined(this.value)) {
            const dateValue: Date = this.value;
            let dateString: string;
            const tempFormat: string = !isNullOrUndefined(this.formatString) ? this.formatString : this.dateTimeFormat;
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
                this.updateInputValue(dateString);
            } else {
                const value: boolean = (+dateValue >= +this.max || !+this.value) || (!+this.value || +dateValue <= +this.min);
                if (!this.strictMode && value) {
                    this.updateInputValue(dateString);
                }
            }
        }
        if (isNullOrUndefined(this.value) && this.strictMode) {
            if (!this.enableMask)
            {
                this.updateInputValue('');
            }
            else
            {
                this.updateInputValue(this.maskedDateValue);
                this.notify('createMask', {
                    module: 'MaskedDateTime'
                });
            }
        }
        if (!this.strictMode && isNullOrUndefined(this.value) && this.invalidValueString) {
            this.updateInputValue(this.invalidValueString);
        }
        this.changedArgs = { value: this.value };
        this.errorClass();
        this.updateIconState();
    }
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
            const culture: Internationalization = new Internationalization(this.locale);
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
                const culture: Internationalization = new Internationalization(this.locale);
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.dateTimeFormat, type: 'dateTime', skeleton: 'yMd' };
                    formatDateTime = { format: culture.getDatePattern({ skeleton: 'yMd' }), type: 'dateTime' };
                } else {
                    formatOptions = { format: this.dateTimeFormat, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    formatDateTime = { format: culture.getDatePattern({ skeleton: 'yMd' }), type: 'dateTime', calendar: 'islamic' };
                }
            } else {
                if (this.calendarMode === 'Gregorian') {
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd' };
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    formatOptions = { format: this.formatString, type: 'dateTime', skeleton: 'yMd', calendar: 'islamic' };
                }
            }
            let invalid: boolean = false;
            if (typeof valueString !== 'string') {
                valueString = null;
                invalid = true;
            } else {
                if (typeof valueString === 'string') {
                    valueString = valueString.trim();
                }
                valueDate = this.checkStringValue(valueString);
                if (!valueDate) {
                    let extISOString: RegExp = null;
                    let basicISOString: RegExp = null;
                    // eslint-disable-next-line
                    extISOString = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
                    // eslint-disable-next-line
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
                if (!this.strictMode) {
                    this.invalidValueString = valueString;
                }
                this.setProperties({ value: null }, true);
            } else {
                this.setProperties({ value: valueDate }, true);
            }
        }
    }
    private bindInputEvent(): void {
        if (!isNullOrUndefined(this.formatString) || this.enableMask) {
            if (this.enableMask || this.formatString.indexOf('y') === -1) {
                EventHandler.add(this.inputElement, 'input', this.inputHandler, this);
            } else {
                EventHandler.remove(this.inputElement, 'input', this.inputHandler);
            }
        }
    }
    protected bindEvents(): void {
        EventHandler.add(this.inputWrapper.buttons[0], 'mousedown touchstart', this.dateIconHandler, this);
        EventHandler.add(this.inputElement, 'mouseup', this.mouseUpHandler, this);
        EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
        EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
        if (this.enableMask){
            EventHandler.add(this.inputElement, 'keydown', this.keydownHandler, this);
        }
        this.bindInputEvent();
        // To prevent the twice triggering.
        EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
        }
        if (this.formElement) {
            EventHandler.add(this.formElement, 'reset', this.resetFormHandler, this);
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

    private keydownHandler(e: KeyboardEventArgs): void{
        switch (e.code)
        {
        case 'ArrowLeft':
        case 'ArrowRight' :
        case 'ArrowUp':
        case 'ArrowDown':
        case 'Home':
        case 'End':
        case 'Delete':
            if (this.enableMask && !this.popupObj && !this.readonly)
            {
                if (e.code !== 'Delete')
                {
                    e.preventDefault();
                }
                this.notify('keyDownHandler', {
                    module: 'MaskedDateTime' ,
                    e: e
                });
            }
            break;

        default:
            break;
        }
    }

    protected unBindEvents() : void {
        if (!isNullOrUndefined(this.inputWrapper))
        {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', this.dateIconHandler);
        }
        EventHandler.remove(this.inputElement, 'mouseup', this.mouseUpHandler);
        EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
        EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
        EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
        if (this.enableMask){
            EventHandler.remove(this.inputElement, 'keydown', this.keydownHandler);
        }
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler);
        }
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.resetFormHandler);
        }
    }
    protected resetFormHandler(): void {
        if (!this.enabled) {
            return;
        }
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
                this.updateInputValue(value);
                this.errorClass();
            }
        }
    }
    protected restoreValue(): void {
        this.currentDate = this.value ? this.value : new Date();
        this.previousDate = this.value;
        this.previousElementValue = (isNullOrUndefined(this.inputValueCopy)) ? '' :
            this.globalize.formatDate(this.inputValueCopy, {
                format: this.formatString, type: 'dateTime', skeleton: 'yMd'
            });
    }
    private inputChangeHandler(e: MouseEvent): void {
        if (!this.enabled) {
            return;
        }
        e.stopPropagation();
    }
    private bindClearEvent(): void {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
        }
    }
    protected resetHandler(e?: MouseEvent): void {
        if (!this.enabled) {
            return;
        }
        e.preventDefault();
        this.clear(e);
    }
    private mouseUpHandler(e? : MouseEvent): void{
        if (this.enableMask)
        {
            e.preventDefault();
            this.notify('setMaskSelection', {
                module: 'MaskedDateTime'
            });
        }
    }
    private clear(event: MouseEvent): void {
        this.setProperties({ value: null }, true);
        if (!this.enableMask)
        {
            this.updateInputValue('');
        }
        const clearedArgs: ClearedEventArgs = {
            event: event
        };
        this.trigger('cleared', clearedArgs);
        this.invalidValueString = '';
        this.updateInput();
        this.popupUpdate();
        this.changeEvent(event);
        if (this.enableMask)
        {
            this.notify('clearHandler', {
                module: 'MaskedDateTime'
            });
        }
        if (closest(this.element, 'form')) {
            const element: Element = this.element;
            const keyupEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
    }


    private preventEventBubbling(e?: MouseEvent): void {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any).interopAdaptor.invokeMethodAsync('OnDateIconClick');
    }

    private updateInputValue(value?: string): void {
        Input.setValue(value, this.inputElement, this.floatLabelType, this.showClearButton);
    }

    private dateIconHandler(e?: MouseEvent): void {
        if (!this.enabled) {
            return;
        }
        this.isIconClicked = true;
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
        this.isIconClicked = false;
    }
    protected updateHtmlAttributeToWrapper(): void {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (const key of Object.keys(this.htmlAttributes)) {
                if (!isNullOrUndefined(this.htmlAttributes[`${key}`])) {
                    if (containerAttr.indexOf(key) > -1) {
                        if (key === 'class') {
                            const updatedClassValues : string = (this.htmlAttributes[`${key}`].replace(/\s+/g, ' ')).trim();
                            if (updatedClassValues !== '') {
                                addClass([this.inputWrapper.container], updatedClassValues.split(' '));
                            }
                        } else if (key === 'style') {
                            let setStyle: string = this.inputWrapper.container.getAttribute(key);
                            if (!isNullOrUndefined(setStyle)) {
                                if (setStyle.charAt(setStyle.length - 1) === ';') {
                                    setStyle = setStyle + this.htmlAttributes[`${key}`];
                                } else {
                                    setStyle = setStyle + ';' + this.htmlAttributes[`${key}`];
                                }
                            } else {
                                setStyle = this.htmlAttributes[`${key}`];
                            }
                            this.inputWrapper.container.setAttribute(key, setStyle);
                        } else {
                            this.inputWrapper.container.setAttribute(key, this.htmlAttributes[`${key}`]);
                        }
                    }
                }
            }
        }
    }

    protected updateHtmlAttributeToElement(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (const key of Object.keys(this.htmlAttributes)) {
                if (containerAttr.indexOf(key) < 0 ) {
                    this.inputElement.setAttribute(key, this.htmlAttributes[`${key}`]);
                }
            }
        }
    }
    private updateCssClass(newCssClass : string, oldCssClass : string) : void {
        if (!isNullOrUndefined(oldCssClass)) {
            oldCssClass = (oldCssClass.replace(/\s+/g, ' ')).trim();
        }
        if (!isNullOrUndefined(newCssClass)) {
            newCssClass = (newCssClass.replace(/\s+/g, ' ')).trim();
        }
        Input.setCssClass(newCssClass, [this.inputWrapper.container], oldCssClass);
        if (this.popupWrapper) {
            Input.setCssClass(newCssClass, [this.popupWrapper], oldCssClass);
        }
    }
    private calendarKeyActionHandle(e: KeyboardEventArgs): void {
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
        this.isFocused = true;
        if (!this.enabled) {
            return;
        }
        if (this.enableMask && !this.inputElement.value && this.placeholder)
        {
            if (this.maskedDateValue && !this.value && (this.floatLabelType === 'Auto' || this.floatLabelType === 'Never' || this.placeholder))
            {
                this.updateInputValue(this.maskedDateValue);
                this.inputElement.selectionStart =  0;
                this.inputElement.selectionEnd = this.inputElement.value.length;
            }
        }
        const focusArguments: BlurEventArgs = {
            model: this
        };
        this.isDateIconClicked = false;
        this.trigger('focus', focusArguments);
        this.updateIconState();
        if (this.openOnFocus && !this.isIconClicked) {
            this.show();
        }
    }
    private inputHandler(): void {
        this.isPopupClicked = false;
        if (this.enableMask)
        {
            this.notify('inputHandler', {
                module: 'MaskedDateTime'
            });
        }
    }
    private inputBlurHandler(e: MouseEvent): void {
        if (!this.enabled) {
            return;
        }
        this.strictModeUpdate();
        if (this.inputElement.value === '' && isNullOrUndefined(this.value)) {
            this.invalidValueString = null;
            this.updateInputValue('');
        }
        this.updateInput();
        this.popupUpdate();
        this.changeTrigger(e);
        if (this.enableMask && this.maskedDateValue && this.placeholder && this.floatLabelType !== 'Always' )
        {
            if (this.inputElement.value === this.maskedDateValue && !this.value && (this.floatLabelType === 'Auto' || this.floatLabelType === 'Never' || this.placeholder))
            {
                this.updateInputValue('');
            }
        }
        this.errorClass();
        if (this.isCalendar() && document.activeElement === this.inputElement) {
            this.hide(e);
        }
        if (this.getModuleName() === 'datepicker') {
            const blurArguments: BlurEventArgs = {
                model: this
            };
            this.trigger('blur', blurArguments);
        }
        if (this.isCalendar()) {
            this.defaultKeyConfigs = (extend(this.defaultKeyConfigs, this.keyConfigs) as { [key: string]: string });
            this.calendarKeyboardModules = new KeyboardEvents(<HTMLElement>this.calendarElement.children[1].firstElementChild, {
                eventName: 'keydown',
                keyAction: this.calendarKeyActionHandle.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
        }
        this.isPopupClicked = false;
    }
    private documentHandler(e: MouseEvent): void {
        if ((!isNullOrUndefined(this.popupObj) && !isNullOrUndefined(this.inputWrapper) && (this.inputWrapper.container.contains(<HTMLElement>e.target) && e.type !== 'mousedown' ||
            (this.popupObj.element && this.popupObj.element.contains(<HTMLElement>e.target)))) && e.type !== 'touchstart') {
            e.preventDefault();
        }
        const target: HTMLElement = <HTMLElement>e.target;
        if (!(closest(target, '.e-datepicker.e-popup-wrapper')) && !isNullOrUndefined(this.inputWrapper)
            && !(closest(target, '.' + INPUTCONTAINER) === this.inputWrapper.container)
            && (!target.classList.contains('e-day'))) {
            this.hide(e);
            this.focusOut();
        } else if (closest(target, '.e-datepicker.e-popup-wrapper')) {
            // Fix for close the popup when select the previously selected value.
            if ( target.classList.contains('e-day')
            && !isNullOrUndefined((e.target as HTMLElement).parentElement)
            && (e.target as HTMLElement).parentElement.classList.contains('e-selected')
            && closest(target, '.e-content')
            && closest(target, '.e-content').classList.contains('e-' + this.depth.toLowerCase())) {
                this.hide(e);
            } else if (closest(target, '.e-footer-container')
                       && target.classList.contains('e-today')
                       && target.classList.contains('e-btn')
                       && (+new Date(+this.value) === +super.generateTodayVal(this.value))) {
                this.hide(e);
            }
        }
    }

    protected inputKeyActionHandle(e: KeyboardEventArgs): void {
        const clickedView: string = this.currentView();
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
        case 'shiftTab':
        {
            let start: number = this.inputElement.selectionStart;
            let end: number = this.inputElement.selectionEnd;
            if (this.enableMask && !this.popupObj && !this.readonly)
            {
                const length: number = this.inputElement.value.length;
                if ((start === 0 && end === length) || (end !== length && e.action === 'tab') || (start !== 0 && e.action === 'shiftTab'))
                {
                    e.preventDefault();
                }
                this.notify('keyDownHandler', {
                    module: 'MaskedDateTime' ,
                    e: e
                });
                start = this.inputElement.selectionStart;
                end = this.inputElement.selectionEnd;
            }
            this.strictModeUpdate();
            this.updateInput();
            this.popupUpdate();
            this.changeTrigger(e);
            this.errorClass();
            if (this.enableMask)
            {
                this.inputElement.selectionStart = start ;
                this.inputElement.selectionEnd = end;
            }
            this.hide(e);
            break;
        }
        default:
            this.defaultAction(e);
            // Fix for close the popup when select the previously selected value.
            if (e.action === 'select' && clickedView === this.depth) {
                this.hide(e);
            }
        }
    }
    protected defaultAction(e: KeyboardEventArgs): void {
        this.previousDate = ((!isNullOrUndefined(this.value) && new Date(+this.value)) || null);
        if (this.isCalendar()) {
            super.keyActionHandle(e);
            if (this.isCalendar()) {
                attributes(this.inputElement, {
                    'aria-activedescendant': '' + this.setActiveDescendant()
                });
            }
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
                    const targetdate: Date = new Date(this.checkValue(this.value));
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
            const len: number = format.split('M').length - 1;
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
        if (typeof this.inputElement.value === 'string') {
            this.inputElement.value = this.inputElement.value.trim();
        }
        if ((this.getModuleName() === 'datetimepicker')) {
            if (this.checkDateValue(this.globalize.parseDate(this.inputElement.value, dateOptions))) {
                date = this.globalize.parseDate(this.inputElement.value.toLocaleUpperCase(), dateOptions);
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
            date = (!isNullOrUndefined(date) && isNaN(+date)) ? null : date;
            if (!isNullOrUndefined(this.formatString) && this.inputElement.value !== '' && this.strictMode) {
                if ((this.isPopupClicked || (!this.isPopupClicked && this.inputElement.value === this.previousElementValue))
                    && this.formatString.indexOf('y') === -1) {
                    date.setFullYear(this.value.getFullYear());
                }
            }
        }
        // EJ2-35061 - To prevent change event from triggering twice when using strictmode and format property
        if ((this.getModuleName() === 'datepicker') && (this.value && !isNaN(+this.value)) && date) {
            date.setHours(this.value.getHours(), this.value.getMinutes(), this.value.getSeconds(), this.value.getMilliseconds());
        }
        if (this.strictMode && date) {
            this.updateInputValue(this.globalize.formatDate(date, dateOptions));
            if (this.inputElement.value !== this.previousElementValue) {
                this.setProperties({ value: date }, true);
            }
        } else if (!this.strictMode) {
            if (this.inputElement.value !== this.previousElementValue) {
                this.setProperties({ value: date }, true);
            }
        }
        if (this.strictMode && !date && this.inputElement.value === (this.enableMask ? this.maskedDateValue : '')) {
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
        if (!isNullOrUndefined(this.cssClass)) {
            this.popupWrapper.className += ' ' + this.cssClass;
        }
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
                                keyAction: this.calendarKeyActionHandle.bind(this),
                                keyConfigs: this.defaultKeyConfigs
                            });
                        this.calendarKeyboardModules = new KeyboardEvents(
                            <HTMLElement>this.inputWrapper.container.children[this.index],
                            {
                                eventName: 'keydown',
                                keyAction: this.calendarKeyActionHandle.bind(this),
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
                this.resetCalendar();
                detach(this.popupWrapper);
                this.popupObj = this.popupWrapper = null;
                this.preventArgs = null;
                this.calendarKeyboardModules = null;
                this.setAriaAttributes();
            }, targetExitViewport: () => {
                if (!Browser.isDevice) {
                    this.hide();
                }
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
        const modelHeader: HTMLElement = this.createElement('div', { className: 'e-model-header' });
        const yearHeading: HTMLElement = this.createElement('h1', { className: 'e-model-year' });
        const h2: HTMLElement = this.createElement('div');
        const daySpan: HTMLElement = this.createElement('span', { className: 'e-model-day' });
        const monthSpan: HTMLElement = this.createElement('span', { className: 'e-model-month' });
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
                if (this.isDynamicValueChanged && this.isCalendar()) {
                    this.popupUpdate();
                }
                this.changedArgs.value = this.value;
                this.changedArgs.event = event || null;
                this.changedArgs.element = this.element;
                this.changedArgs.isInteracted = !isNullOrUndefined(event);
                if (this.isAngular && this.preventChange) {
                    this.preventChange = false;
                } else {
                    this.trigger('change', this.changedArgs);
                }
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
        if (!this.isIconClicked) {
            this.selectCalendar(event);
        }
        if (((this.previousDate && this.previousDate.valueOf()) !== (this.value && this.value.valueOf()))) {
            this.changedArgs.event = event ? event : null;
            this.changedArgs.element = this.element;
            this.changedArgs.isInteracted = this.isInteracted;
            if (!this.isDynamicValueChanged) {
                this.trigger('change', this.changedArgs);
            }
            this.previousDate = this.value && new Date(+this.value);
            if (!this.isDynamicValueChanged) {
                this.hide(event);
            }
            this.previousElementValue = this.inputElement.value;
            this.errorClass();
        }
        else if (event) {
            this.hide(event);
        }
    }

    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this) {
            modules.push({ args: [this], member: 'islamic' });
        }
        if (this.enableMask)
        {
            modules.push({args: [this], member: 'MaskedDateTime'});
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
            if (this.enableMask) {
                this.notify('createMask', {
                    module: 'MaskedDateTime'
                });
            }
        }
        if (!isNullOrUndefined(date)) {
            this.updateInputValue(date);
            if (this.enableMask)
            {
                this.notify('setMaskSelection', {
                    module: 'MaskedDateTime'
                });
            }
        }
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
    /* eslint-disable valid-jsdoc, jsdoc/require-param */
    /**
     * Shows the Calendar.
     *
     * @returns {void}
     * @deprecated
     */
    public show(type?: null | string, e?: MouseEvent | KeyboardEvent | KeyboardEventArgs): void {
        if ((this.enabled && this.readonly) || !this.enabled || this.popupObj) {
            return;
        } else {
            let prevent: boolean = true;
            let outOfRange: Date;
            if (!isNullOrUndefined(this.value) && !(+this.value >= +new Date(this.checkValue(this.min))
             && +this.value <= +new Date(this.checkValue(this.max)))) {
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
            const eventArgs: PopupObjectArgs = this.preventArgs;
            this.trigger('open', eventArgs, (eventArgs: PopupObjectArgs) => {
                this.preventArgs = eventArgs;
                if (prevent && !this.preventArgs.cancel) {
                    addClass(this.inputWrapper.buttons, ACTIVE);
                    this.preventArgs.appendTo.appendChild(this.popupWrapper);
                    this.popupObj.refreshPosition(this.inputElement);
                    const openAnimation: object = {
                        name: 'FadeIn',
                        duration: Browser.isDevice ? 0 : OPENDURATION
                    };
                    if (this.zIndex === 1000) {
                        this.popupObj.show(new Animation(openAnimation), this.element);
                    } else {
                        this.popupObj.show(new Animation(openAnimation), null);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    super.setOverlayIndex(this.mobilePopupWrapper, this.popupObj.element, this.modal, Browser.isDevice as any);
                    this.setAriaAttributes();
                } else {
                    this.popupObj.destroy();
                    this.popupWrapper = this.popupObj = null;
                }
                if (!isNullOrUndefined(this.inputElement) && this.inputElement.value === '') {
                    if (!isNullOrUndefined(this.tableBodyElement) && this.tableBodyElement.querySelectorAll('td.e-selected').length > 0) {
                        addClass([this.tableBodyElement.querySelector('td.e-selected')], FOCUSEDDATE);
                        removeClass(this.tableBodyElement.querySelectorAll('td.e-selected'), SELECTED);
                    }
                }
                EventHandler.add(document, 'mousedown touchstart', this.documentHandler, this);
            });
        }
    }
    /**
     * Hide the Calendar.
     *
     * @returns {void}
     * @deprecated
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
            const eventArgs: PopupObjectArgs = this.preventArgs;
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
    /* eslint-enable valid-jsdoc, jsdoc/require-param */
    private closeEventCallback(prevent: boolean, eventArgs: PopupObjectArgs): void {
        this.preventArgs = eventArgs;
        if (this.isCalendar() && (prevent && !this.preventArgs.cancel)) {
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
    /* eslint-disable jsdoc/require-param */
    /**
     * Sets the focus to widget for interaction.
     *
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public focusIn(triggerEvent?: boolean): void {
        if (document.activeElement !== this.inputElement && this.enabled) {
            (<HTMLElement>this.inputElement).focus();
            addClass([this.inputWrapper.container], [INPUTFOCUS]);
        }
    }
    /* eslint-enable jsdoc/require-param */
    /**
     * Remove the focus from widget, if the widget is in focus state.
     *
     * @returns {void}
     */
    public focusOut(): void {
        if (document.activeElement === this.inputElement) {
            removeClass([this.inputWrapper.container], [INPUTFOCUS]);
            this.inputElement.blur();
        }
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Gets the current view of the DatePicker.
     *
     * @returns {string}
     * @deprecated
     */
    public currentView(): string {
        let currentView: string;
        if (this.calendarElement) {
            // calls the Calendar currentView public method
            currentView = super.currentView();
        }
        return currentView;
    }
    /* eslint-enable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Navigates to specified month or year or decade view of the DatePicker.
     *
     * @param  {string} view - Specifies the view of the calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns {void}
     * @deprecated
     */
    public navigateTo(view: CalendarView, date: Date): void {
        if (this.calendarElement) {
            // calls the Calendar navigateTo public method
            super.navigateTo(view, date);
        }
    }
    /**
     * To destroy the widget.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.unBindEvents();
        super.destroy();
        if (!isNullOrUndefined(this.keyboardModules))
        {
            this.keyboardModules.destroy();
        }
        if (this.popupObj && this.popupObj.element.classList.contains(POPUP)) {
            super.destroy();
        }
        const ariaAttrs: object = {
            'aria-atomic': 'true', 'aria-disabled': 'true',
            'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false'
        };
        if (this.inputElement) {
            Input.removeAttributes(<{ [key: string]: string }>ariaAttrs, this.inputElement);
            if (!isNullOrUndefined(this.inputElementCopy.getAttribute('tabindex'))) {
                this.inputElement.setAttribute('tabindex', this.tabIndex);
            } else {
                this.inputElement.removeAttribute('tabindex');
            }
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
            this.ensureInputAttribute();
        }
        if (this.isCalendar()) {
            if (this.popupWrapper) {
                detach(this.popupWrapper);
            }
            this.popupObj = this.popupWrapper = null;
            this.keyboardModule.destroy();
        }
        if (this.ngTag === null) {
            if (this.inputElement) {
                if (!isNullOrUndefined(this.inputWrapper))
                {
                    this.inputWrapper.container.insertAdjacentElement('afterend', this.inputElement);
                }
                removeClass([this.inputElement], [INPUTROOT]);
            }
            removeClass([this.element], [ROOT]);
            if (!isNullOrUndefined(this.inputWrapper))
            {
                detach(this.inputWrapper.container);
            }
        }
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.resetFormHandler);
        }
        this.inputWrapper = null;
        this.keyboardModules = null;
    }

    protected ensureInputAttribute(): void {
        const prop: string[] = [];
        for (let i: number = 0; i < this.inputElement.attributes.length; i++) {
            prop[i as number] = this.inputElement.attributes[i as  number].name;
        }
        for (let i: number = 0; i < prop.length; i++) {
            if (isNullOrUndefined(this.inputElementCopy.getAttribute(prop[i as number]))) {
                if (prop[i as number].toLowerCase() === 'value') {
                    this.inputElement.value = '';
                }
                this.inputElement.removeAttribute(prop[i as number]);
            } else {
                if (prop[i as number].toLowerCase() === 'value') {
                    this.inputElement.value = this.inputElementCopy.getAttribute(prop[i as number]);
                }
                this.inputElement.setAttribute(prop[i as number], this.inputElementCopy.getAttribute(prop[i as number]));
            }
        }
    }
    /**
     * Initialize the event handler
     *
     * @returns {void}
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
            if (this.ngTag !== null) {
                this.inputElement.id = this.element.getAttribute('id') + '_input';
            }
        } else {
            if (this.getModuleName() === 'datetimepicker') {
                this.element.id = getUniqueID('ej2-datetimepicker');
                if (this.ngTag !== null) {
                    attributes(this.inputElement, { 'id': this.element.id + '_input' });
                }
            } else {
                this.element.id = getUniqueID('ej2-datepicker');
                if (this.ngTag !== null) {
                    attributes(this.inputElement, { 'id': this.element.id + '_input' });
                }
            }
        }
        if (this.ngTag !== null) {
            this.validationAttribute(this.element, this.inputElement);
        }
        this.updateHtmlAttributeToElement();
        this.defaultKeyConfigs = this.getDefaultKeyConfig();
        this.checkHtmlAttributes(false);
        this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
        this.element.removeAttribute('tabindex');
        super.preRender();
    }
    protected getDefaultKeyConfig(): { [key: string]: string } {
        this.defaultKeyConfigs = {
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
            shiftTab: 'shift+tab',
            tab: 'tab'
        };
        return this.defaultKeyConfigs;
    }
    protected validationAttribute(target: HTMLElement, inputElement: Element): void {
        const nameAttribute: string = target.getAttribute('name') ? target.getAttribute('name') : target.getAttribute('id');
        inputElement.setAttribute('name', nameAttribute);
        target.removeAttribute('name');
        const attribute: string[] = ['required', 'aria-required', 'form'];
        for (let i: number = 0; i < attribute.length; i++) {
            if (isNullOrUndefined(target.getAttribute(attribute[i as number]))) {
                continue;
            }
            const attr: string = target.getAttribute(attribute[i as number]);
            inputElement.setAttribute(attribute[i as number], attr);
            target.removeAttribute(attribute[i as number]);
        }
    }
    protected checkFormat(): void {
        const culture: Internationalization = new Internationalization(this.locale);
        if (this.format) {
            if (typeof this.format === 'string') {
                this.formatString = this.format;
            } else if (this.format.skeleton !== '' && !isNullOrUndefined(this.format.skeleton)) {
                const skeletonString: string = this.format.skeleton;
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
        const attributes: string[] = dynamic ? isNullOrUndefined(this.htmlAttributes) ? [] :  Object.keys(this.htmlAttributes) :
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
        for (const prop of attributes) {
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                case 'disabled':
                    if (((isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['enabled'] === undefined)) || dynamic)) {
                        const enabled: boolean = this.inputElement.getAttribute(prop) === 'disabled' ||
                        this.inputElement.getAttribute(prop) === '' ||
                                this.inputElement.getAttribute(prop) === 'true' ? false : true;
                        this.setProperties({ enabled: enabled }, !dynamic);
                    }
                    break;
                case 'readonly':
                    if (((isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['readonly'] === undefined)) || dynamic)) {
                        const readonly: boolean = this.inputElement.getAttribute(prop) === 'readonly' ||
                        this.inputElement.getAttribute(prop) === '' || this.inputElement.getAttribute(prop) === 'true' ? true : false;
                        this.setProperties({ readonly: readonly }, !dynamic);
                    }
                    break;
                case 'placeholder':
                    if (((isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['placeholder'] === undefined)) || dynamic)) {
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
                    if (((isNullOrUndefined(this.datepickerOptions) || (this.datepickerOptions['value'] === undefined)) || dynamic)) {
                        const value: string = this.inputElement.getAttribute(prop);
                        this.setProperties(setValue(prop, this.globalize.parseDate(value, options), {}), !dynamic);
                    }
                    break;
                case 'min':
                    if ((+this.min === +new Date(1900, 0, 1)) || dynamic) {
                        const min: string = this.inputElement.getAttribute(prop);
                        this.setProperties(setValue(prop, this.globalize.parseDate(min), {}), !dynamic);
                    }
                    break;
                case 'max':
                    if ((+this.max === +new Date(2099, 11, 31)) || dynamic) {
                        const max: string = this.inputElement.getAttribute(prop);
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
     *
     * @returns {string} Returns the component name.
     * @private
     */
    protected getModuleName(): string {
        return 'datepicker';
    }
    private disabledDates(isDynamic: boolean = false): void {
        let formatOptions: DateFormatOptions;
        let globalize: string;
        const valueCopy: Date = this.checkDateValue(this.value) ? new Date(+this.value) : new Date(this.checkValue(this.value));
        const previousValCopy: Date = this.previousDate;
        //calls the Calendar render method to check the disabled dates through renderDayCell event and update the input value accordingly.
        this.minMaxUpdates();
        if (!isDynamic || (isDynamic && !isNullOrUndefined(this.renderDayCell))) {
            super.render(); }
        this.previousDate = previousValCopy;
        const date: number = valueCopy && +(valueCopy);
        const dateIdString: string = '*[id^="/id"]'.replace('/id', '' + date);
        if (!this.strictMode) {
            if (typeof this.value === 'string' || ((typeof this.value === 'object') && (+this.value) !== (+valueCopy))) {
                this.setProperties({ value: valueCopy }, true);
            }
        }
        if (!isNullOrUndefined(this.calendarElement) && !isNullOrUndefined(this.calendarElement.querySelectorAll(dateIdString)[0])) {
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
            this.updateInputValue(inputVal);
            if (this.enableMask)
            {
                this.updateInputValue(this.maskedDateValue);
                this.notify('createMask', {
                    module: 'MaskedDateTime'
                });
            }
        }
    }
    private setAriaAttributes(): void {
        if (this.isCalendar()) {
            Input.addAttributes({ 'aria-expanded': 'true' }, this.inputElement);
            attributes(this.inputElement, { 'aria-owns': this.inputElement.id + '_options'});
            if (this.value)
            {
                attributes(this.inputElement, { 'aria-activedescendant': '' + this.setActiveDescendant() });
            }
        } else {
            Input.addAttributes({ 'aria-expanded': 'false' }, this.inputElement);
            this.inputElement.removeAttribute('aria-owns');
            this.inputElement.removeAttribute( 'aria-activedescendant');
        }
    }
    protected errorClass(): void {
        const dateIdString: string = '*[id^="/id"]'.replace('/id', '' + (+this.value));
        const isDisabledDate: boolean = this.calendarElement &&
            this.calendarElement.querySelectorAll(dateIdString)[0] &&
            this.calendarElement.querySelectorAll(dateIdString)[0].classList.contains('e-disabled');
        if ((!isNullOrUndefined(this.value) && !isNullOrUndefined(this.min) &&
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         !isNullOrUndefined(this.max) && !(new Date(this.value as any).setMilliseconds(0) >= new Date(this.min as any).setMilliseconds(0)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            && new Date(this.value as any).setMilliseconds(0) <= new Date(this.max as any).setMilliseconds(0)))
            || (!this.strictMode && this.inputElement.value !== '' && this.inputElement.value !== this.maskedDateValue && isNullOrUndefined(this.value) || isDisabledDate)) {
            addClass([this.inputWrapper.container], ERROR);
            attributes(this.inputElement, { 'aria-invalid': 'true' });
        } else if (!isNullOrUndefined(this.inputWrapper)) {
            removeClass([this.inputWrapper.container], ERROR);
            attributes(this.inputElement, { 'aria-invalid': 'false' });
        }
    }
    /**
     * Called internally if any of the property value changed.
     *
     * @param {DatePickerModel} newProp - Returns the dynamic property value of the component.
     * @param {DatePickerModel} oldProp - Returns the previous property value of the component.
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: DatePickerModel, oldProp: DatePickerModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'value':
                this.isDynamicValueChanged = true;
                this.isInteracted = false;
                this.invalidValueString = null;
                this.checkInvalidValue(newProp.value);
                newProp.value = this.value;
                this.previousElementValue = this.inputElement.value;
                if (isNullOrUndefined(this.value)) {
                    if (this.enableMask) {
                        this.updateInputValue(this.maskedDateValue);
                    }
                    else {
                        this.updateInputValue('');
                    }
                    this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
                }
                this.updateInput(true);
                if (+this.previousDate !== +this.value) {
                    this.changeTrigger(null);
                }
                this.isInteracted = true;
                this.preventChange = this.isAngular && this.preventChange ? !this.preventChange : this.preventChange;
                if (this.enableMask) {
                    this.notify('createMask', {
                        module: 'MaskedDateTime'
                    });
                }
                break;
            case 'format':
                this.checkFormat();
                this.bindInputEvent();
                this.updateInput();
                if (this.enableMask) {
                    this.notify('createMask', {
                        module: 'MaskedDateTime'
                    });
                    if (!this.value)
                    {
                        this.updateInputValue(this.maskedDateValue);
                    }
                }
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
                if (this.enableMask) {
                    this.notify('createMask', {
                        module: 'MaskedDateTime'
                    });
                }
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
                this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                break;
            case 'showClearButton':
                Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                this.bindClearEvent();
                this.index = this.showClearButton ? 2 : 1;
                break;
            case 'strictMode':
                this.invalidValueString = null;
                this.updateInput();
                break;
            case 'width':
                this.setWidth(newProp.width);
                Input.calculateWidth(this.inputElement, this.inputWrapper.container);
                if (!isNullOrUndefined(this.inputWrapper.buttons[0]) && !isNullOrUndefined(this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0]) && this.floatLabelType !== 'Never') {
                    this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0].classList.add('e-icon');
                }
                break;
            case 'floatLabelType':
                this.floatLabelType = newProp.floatLabelType;
                Input.removeFloating(this.inputWrapper);
                Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                if (!isNullOrUndefined(this.inputWrapper.buttons[0]) && !isNullOrUndefined(this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0]) && this.floatLabelType !== 'Never') {
                    this.inputWrapper.container.getElementsByClassName('e-float-text-overflow')[0].classList.add('e-icon');
                }
                break;
            case 'enableMask':
                if (this.enableMask) {
                    this.notify('createMask', {
                        module: 'MaskedDateTime'
                    });
                    this.updateInputValue(this.maskedDateValue);
                    this.bindInputEvent();
                }
                else
                {
                    if (this.inputElement.value === this.maskedDateValue)
                    {
                        this.updateInputValue('');
                    }
                }
                break;
            default:
                if (this.calendarElement && this.isCalendar()) {
                    super.onPropertyChanged(newProp, oldProp);
                }
                break;
            }
            if (!this.isDynamicValueChanged) {
                this.hide(null);
            }
            this.isDynamicValueChanged = false;
        }
    }
}

export interface PopupObjectArgs {
    /** Prevents the default action */
    preventDefault?: Function
    /**
     * Defines the DatePicker popup element.
     *
     * @deprecated
     */
    popup?: Popup
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */

    cancel?: boolean
    /**
     * Specifies the original event arguments.
     */

    event?: MouseEvent | KeyboardEvent | Event
    /**
     * Specifies the node to which the popup element to be appended.
     */
    appendTo?: HTMLElement
}

export interface PreventableEventArgs {
    /** Prevents the default action */
    preventDefault?: Function

}
