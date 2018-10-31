import { EventHandler, Property, Internationalization, NotifyPropertyChanges } from '@syncfusion/ej2-base';
import { KeyboardEvents, KeyboardEventArgs, Animation, AnimationModel, Browser, BaseEventArgs } from '@syncfusion/ej2-base';
import { EmitType, cldrData, L10n, Component, getDefaultDateObject, rippleEffect, RippleOptions, Event } from '@syncfusion/ej2-base';
import { createElement, remove, addClass, removeClass, closest, append, attributes, setStyleAttribute } from '@syncfusion/ej2-base';
import { isNullOrUndefined, formatUnit, getValue, setValue, getUniqueID } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { Input, InputObject, IInput, FloatLabelType, FocusEventArgs, BlurEventArgs } from '@syncfusion/ej2-inputs';
import { ListBase, cssClass as ListBaseClasses, ListBaseOptions, createElementParams } from '@syncfusion/ej2-lists';
import { TimePickerModel } from './timepicker-model';

const WRAPPERCLASS: string = 'e-time-wrapper';
const POPUP: string = 'e-popup';
const ERROR: string = 'e-error';
const POPUPDIMENSION: string = '240px';
const DAY: number = new Date().getDate();
const MONTH: number = new Date().getMonth();
const YEAR: number = new Date().getFullYear();
const ROOT: string = 'e-timepicker';
const RTL: string = 'e-rtl';
const CONTENT: string = 'e-content';
const SELECTED: string = 'e-active';
const HOVER: string = 'e-hover';
const NAVIGATION: string = 'e-navigation';
const DISABLED: string = 'e-disabled';
const ICONANIMATION: string = 'e-icon-anim';
const FOCUS: string = 'e-input-focus';
const DEVICE: string = 'e-device';
const LISTCLASS: string = ListBaseClasses.li;
const HALFPOSITION: number = 2;
const ANIMATIONDURATION: number = 50;


export interface ChangeEventArgs {
    /** Defines the boolean that returns true when the value is changed by user interaction, otherwise returns false. */
    isInteracted?: boolean;
    /** Defines the selected time value of the TimePicker. */
    value?: Date;
    /** Defines the selected time value as string. */
    text?: string;
    /** Defines the original event arguments. */
    event?: KeyboardEventArgs | FocusEvent | MouseEvent | Event;
    /** Defines the element */
    element: HTMLInputElement | HTMLElement;
}

/**
 * Interface for before list item render .
 */
export interface ItemEventArgs extends BaseEventArgs {
    /** Defines the created LI element. */
    element: HTMLElement;
    /** Defines the displayed text value in a popup list. */
    text: string;
    /** Defines the Date object of displayed text in a popup list. */
    value: Date;
    /** Specifies whether to disable the current time value or not. */
    isDisabled: Boolean;
}

export interface CursorPositionDetails {
    /** Defines the text selection starting position. */
    start: number;
    /** Defines the text selection end position. */
    end: number;
}

export interface MeridianText {
    /** Defines the culture specific meridian text for AM. */
    am: string;
    /** Defines the culture specific meridian text for PM. */
    pm: string;
}

export interface PopupEventArgs {
    /** Specifies the name of the event  */
    name?: string;
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */

    cancel?: boolean;

    /** Defines the TimePicker popup object. */
    popup?: Popup;

    /**
     * Specifies the original event arguments.
     */

    event?: MouseEvent | KeyboardEvent | FocusEvent | Event;
}

export namespace TimePickerBase {
    // tslint:disable-next-line
    export function createListItems(createdEl:createElementParams, min: Date, max: Date, globalize: Internationalization, timeFormat: string, step: number):
    { collection: number[], list: HTMLElement } {
        let start: number;
        let end: number;
        let interval: number = step * 60000;
        let listItems: string[] = [];
        let timeCollections: number[] = [];
        start = +(min.setMilliseconds(0));
        end = +(max.setMilliseconds(0));
        while (end >= start) {
            timeCollections.push(start);
            listItems.push(globalize.formatDate(new Date(start), { format: timeFormat, type: 'time' }));
            start += interval;
        }
        let listTag: HTMLElement = ListBase.createList(createdEl, listItems, null, true);
        return { collection: timeCollections, list: listTag };
    }
}

/**
 * TimePicker is an intuitive interface component which provides an options to select a time value
 * from popup list or to set a desired time value.
 * ```
 * <input id='timepicker' type='text'/>
 * <script>
 *   var timePickerObj = new TimePicker({ value: new Date() });
 *   timePickerObj.appendTo('#timepicker');
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class TimePicker extends Component<HTMLElement> implements IInput {
    private inputWrapper: InputObject;
    private popupWrapper: HTMLElement;
    private cloneElement: HTMLElement;
    private listWrapper: HTMLElement;
    private listTag: HTMLElement;
    private selectedElement: HTMLElement;
    private liCollections: HTMLElement[] = [];
    protected inputElement: HTMLInputElement;
    private popupObj: Popup;
    protected inputEvent: KeyboardEvents;
    protected globalize: Internationalization;
    private defaultCulture: Internationalization;
    private containerStyle: ClientRect;
    private rippleFn: Function;
    private l10n: L10n;
    private cursorDetails: CursorPositionDetails;
    private activeIndex: number;
    private timeCollections: number[] = [];
    private isNavigate: boolean;
    private disableItemCollection: string[] = [];
    protected isPreventBlur: boolean;
    private isTextSelected: boolean;
    private prevValue: string;
    private inputStyle: string;
    private angularTag: string;
    private valueWithMinutes: Date;
    private prevDate: Date;
    private initValue: Date;
    private initMin: Date;
    private initMax: Date;
    protected keyConfigure: { [key: string]: string };
    /**
     * Gets or sets the width of the TimePicker component. The width of the popup is based on the width of the component.
     * @default null
     */
    @Property(null)
    public width: string | number;
    /**
     * Specifies the root CSS class of the TimePicker that allows to
     * customize the appearance by overriding the styles.
     * @default null
     */
    @Property(null)
    public cssClass: string;
    /**
     * Specifies the component to act as strict so that, it allows to enter only a valid time value within a specified range or else 
     * resets to previous value. By default, strictMode is in false.
     * > For more details refer to 
     * [`Strict Mode`] (https://ej2.syncfusion.com/documentation/timepicker/strict-mode.html?lang=typescript) documentation.
     * @default false
     */
    @Property(false)
    public strictMode: boolean;
    /**
     * Specifies the format of value that is to be displayed in component. By default, the format is
     * based on the culture. 
     * > For more details refer to 
     * [`Format`](./getting-started.html#setting-the-time-format) documentation.
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * Specifies whether the component to be disabled or not.
     * @default true
     */
    @Property(true)
    public enabled: boolean;
    /**
     * Specifies the component in readonly state. 
     * @default false
     */
    @Property(false)
    public readonly: boolean;
    /**
     * Specifies the placeholder text to be floated.
     * Possible values are:
     * Never: The label will never float in the input when the placeholder is available.
     * Always: The floating label will always float above the input.
     * Auto: The floating label will float above the input after focusing or entering a value in the input.
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     */
    @Property('Never')
    public floatLabelType: FloatLabelType | string;
    /**
     * Specifies the placeholder text that is displayed in textbox.
     * @default null
     */
    @Property(null)
    public placeholder: string;
    /**
     * specifies the z-index value of the timePicker popup element.
     * @default 1000
     * @aspType int
     */
    @Property(1000)
    public zIndex: number;
    /** 
     * Enable or disable the persisting component's state between the page reloads. If enabled, following list of states will be persisted.
     * 1. Value
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Specifies whether to show or hide the clear icon.
     * @default true
     */
    @Property(true)
    public showClearButton: boolean;
    /**
     * Specifies the time interval between the two adjacent time values in the popup list. 
     * > For more details refer to 
     * [`Format`](./getting-started.html#setting-the-time-format)documentation.
     * @default 30
     * 
     */
    @Property(30)
    public step: number;
    /**
     * Specifies the scroll bar position if there is no value is selected in the popup list or
     *  the given value is not present in the popup list.
     * > For more details refer to 
     * [`Time Duration`](https://ej2.syncfusion.com/demos/#/material/timepicker/list-formatting.html) sample. 
     * @default null
     */
    @Property(null)
    public scrollTo: Date;
    /**
     * Gets or sets the value of the component. The value is parsed based on the culture specific time format.
     * @default null
     */
    @Property(null)
    public value: Date;
    /**
     * Gets or sets the minimum time value that can be allowed to select in TimePicker.
     * > For more details refer to 
     * [`Time Range`](https://ej2.syncfusion.com/documentation/timepicker/time-range.html?lang=typescript) documentation.
     * @default 00:00
     */
    @Property(null)
    public min: Date;
    /**
     * Gets or sets the maximum time value that can be allowed to select in TimePicker.
     * > For more details refer to 
     * [`Time Range`](https://ej2.syncfusion.com/documentation/timepicker/time-range.html?lang=typescript) documentation.
     * @default 00:00
     */
    @Property(null)
    public max: Date;
    /**
     * Specifies whether the input textbox is editable or not. Here the user can select the value from the 
     * popup and cannot edit in the input textbox.
     * @default true
     */
    @Property(true)
    public allowEdit: boolean;
    /**
     * Specifies the TimePicker in RTL mode that displays the content in the right-to-left direction.
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;
    /**
     * Triggers when the value is changed.
     * @event  
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;

    /**
     * Triggers when the component is created.
     * @event
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     * @event
     */
    @Event()
    public destroyed: EmitType<Object>;
    /**
     * Triggers when the popup is opened.
     * @event
     */
    @Event()
    public open: EmitType<PopupEventArgs>;
    /**
     * Triggers while rendering the each popup list item.
     * @event
     */
    @Event()
    public itemRender: EmitType<ItemEventArgs>;
    /**
     * Triggers when the popup is closed.
     * @event
     */
    @Event()
    public close: EmitType<PopupEventArgs>;
    /**
     * Triggers when the control loses the focus.
     * @event
     */
    @Event()
    public blur: EmitType<BlurEventArgs>;
    /**
     * Triggers when the control gets focused.
     * @event
     */
    @Event()
    public focus: EmitType<FocusEventArgs>;


    /**
     * Constructor for creating the widget
     */
    constructor(options?: TimePickerModel, element?: string | HTMLInputElement) {
        super(options, element);
    }
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void {
        this.keyConfigure = {
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
        this.cloneElement = <HTMLElement>this.element.cloneNode(true);
        this.inputElement = <HTMLInputElement>this.element;
        this.angularTag = null;
        if (this.element.tagName === 'EJS-TIMEPICKER') {
            this.angularTag = this.element.tagName;
            this.inputElement = <HTMLInputElement>this.createElement('input');
            this.element.appendChild(this.inputElement);
        }
    }
    // element creation
    protected render(): void {
        this.initialize();
        this.createInputElement();
        this.setTimeAllowEdit();
        this.setEnable();
        this.validateInterval();
        this.bindEvents();
        this.validateDisable();
        this.setValue(this.getFormattedValue(this.value));
    }
    private setTimeAllowEdit(): void {
        if (this.allowEdit) {
            if (!this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
        } else {
            attributes(this.inputElement, { 'readonly': '' });
        }
    }
    private validateDisable(): void {
        this.setMinMax(this.initMin, this.initMax);
        this.popupCreation();
        this.popupObj.hide();
        if ((!isNaN(+this.value) && this.value !== null)) {
            if (!this.valueIsDisable(this.value)) {
                //disable value given in value property so reset the date based on current date
                if (this.strictMode) { this.resetState(); }
                this.initValue = null;
                this.initMax = this.getDateObject(this.initMax);
                this.initMin = this.getDateObject(this.initMin);
                this.timeCollections = this.liCollections = [];
                this.setMinMax(this.initMin, this.initMax);
            }
        }
    }

    protected validationAttribute(target: HTMLElement, input: Element): void {
        let name: string = target.getAttribute('name') ? target.getAttribute('name') : target.getAttribute('id');
        input.setAttribute('name', name);
        target.removeAttribute('name');
        let attributes: string[] = ['required', 'aria-required', 'form'];
        for (let i: number = 0; i < attributes.length; i++) {
            if (isNullOrUndefined(target.getAttribute(attributes[i]))) { continue; }
            let attr: string = target.getAttribute(attributes[i]);
            input.setAttribute(attributes[i], attr);
            target.removeAttribute(attributes[i]);
        }
    }

    private initialize(): void {
        this.globalize = new Internationalization(this.locale);
        this.defaultCulture = new Internationalization('en');
        // persist the value property.
        this.setProperties({ value: this.checkDateValue(new Date('' + this.value)) }, true);
        this.setProperties({ min: this.checkDateValue(new Date('' + this.min)) }, true);
        this.setProperties({ max: this.checkDateValue(new Date('' + this.max)) }, true);
        if (this.angularTag !== null) { this.validationAttribute(this.element, this.inputElement); }
        this.checkAttributes(); //check the input element attributes
        let localeText: { placeholder: string } = { placeholder: this.placeholder };
        this.l10n = new L10n('timepicker', localeText, this.locale);
        this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        this.initValue = this.checkDateValue(this.value);
        this.initMin = this.checkDateValue(this.min);
        this.initMax = this.checkDateValue(this.max);
        this.isNavigate = this.isPreventBlur = this.isTextSelected = false;
        this.activeIndex = this.valueWithMinutes = this.prevDate = null;
        if (!isNullOrUndefined(this.element.getAttribute('id'))) {
            if (this.angularTag !== null) { this.inputElement.id = this.element.getAttribute('id') + '_input'; }
        } else {
            //for angular case
            this.element.id = getUniqueID('ej2_timepicker');
            if (this.angularTag !== null) { attributes(this.inputElement, { 'id': this.element.id + '_input' }); }
        }
        if (isNullOrUndefined(this.inputElement.getAttribute('name'))) {
            attributes(this.inputElement, { 'name': this.element.id });
        }
    }
    private checkDateValue(value: Date): Date {
        return (!isNullOrUndefined(value) && value instanceof Date && !isNaN(+value)) ? value : null;
    }
    private createInputElement(): void {
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
                buttons: [' e-input-group-icon e-time-icon e-icons']
            },
            this.createElement
        );
        this.inputWrapper.container.style.width = this.setWidth(this.width);
        attributes(this.inputElement, {
            'aria-haspopup': 'true', 'aria-autocomplete': 'list', 'tabindex': '0', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false', 'aria-disabled': 'false', 'aria-invalid': 'false'
        });
        if (!this.isNullOrEmpty(this.inputStyle)) {
            Input.addAttributes({ 'style': this.inputStyle }, this.inputElement);
        }
        addClass([this.inputWrapper.container], WRAPPERCLASS);
    }
    // destroy function
    public destroy(): void {
        this.hide();
        this.unBindEvents();
        let ariaAttribute: object = {
            'aria-haspopup': 'true', 'aria-autocomplete': 'list', 'tabindex': '0', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false', 'aria-disabled': 'true', 'aria-invalid': 'false'
        };
        if (this.inputElement) {
            Input.removeAttributes(<{ [key: string]: string }>ariaAttribute, this.inputElement);
            if (this.angularTag === null) {
                this.inputWrapper.container.parentElement.appendChild(this.inputElement);
            }
            this.ensureInputAttribute();
            this.enableElement([this.inputElement]);
            this.inputElement.classList.remove('e-input');
            if (isNullOrUndefined(this.cloneElement.getAttribute('disabled'))) {
                Input.setEnabled(true, this.inputElement, this.floatLabelType);
            }
        }
        if (this.inputWrapper.container) { remove(this.inputWrapper.container); }
        this.inputWrapper = this.popupWrapper = this.cloneElement = undefined;
        this.liCollections = this.timeCollections = this.disableItemCollection = [];
        if (!isNullOrUndefined(this.rippleFn)) {
            this.rippleFn();
        }
        super.destroy();
        let form: Element = closest(this.element, 'form');
        if (form) {
            EventHandler.remove(form, 'reset', this.formResetHandler.bind(this));
        }

    }
    protected ensureInputAttribute(): void {
        for (let i: number = 0; i < this.inputElement.attributes.length; i++) {
            let prop: string = this.inputElement.attributes[i].name;
            if (isNullOrUndefined(this.cloneElement.getAttribute(prop))) {
                if (prop.toLowerCase() === 'value' || isNullOrUndefined(this.cloneElement.getAttribute('value'))) {
                    this.inputElement.value = '';
                }
                this.inputElement.removeAttribute(prop);
            }
        }
    }
    //popup creation
    private popupCreation(): void {
        this.popupWrapper = this.createElement('div', {
            className: ROOT + ' ' + POPUP,
            attrs: { 'id': this.element.id + '_popup', 'style': 'visibility:hidden' }
        });
        if (!isNullOrUndefined(this.cssClass)) { this.popupWrapper.className += ' ' + this.cssClass; }
        if (!isNullOrUndefined(this.step) && this.step > 0) {
            this.generateList();
            append([this.listWrapper], this.popupWrapper);
        }
        document.body.appendChild(this.popupWrapper);
        this.addSelection();
        this.renderPopup();
        this.setScrollPosition();
    }
    protected getPopupHeight(): number {
        let height: number = parseInt(<string>POPUPDIMENSION, 10);
        let popupHeight: number = this.popupWrapper.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    }
    private generateList(): void {
        this.createListItems();
        this.wireListEvents();
        let rippleModel: RippleOptions = { duration: 300, selector: '.' + LISTCLASS };
        this.rippleFn = rippleEffect(this.listWrapper, rippleModel);
        this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.listWrapper.querySelectorAll('.' + LISTCLASS);
    }
    private popupCalculation(): number {
        let left: number = 0;
        if (Browser.isDevice) {
            let firstItem: HTMLElement = this.isEmptyList() ? this.listTag : this.liCollections[0];
            left = -(parseInt(getComputedStyle(firstItem).textIndent, 10) -
                (this.enableRtl ? parseInt(getComputedStyle(this.inputElement).paddingRight, 10) :
                    parseInt(getComputedStyle(this.inputElement).paddingLeft, 10)));
        }
        return left;
    }
    private isEmptyList(): boolean {
        return !isNullOrUndefined(this.liCollections) && this.liCollections.length === 0 ||
            isNullOrUndefined(this.liCollections);

    }
    private renderPopup(): void {
        this.containerStyle = this.inputWrapper.container.getBoundingClientRect();
        let offset: number = Browser.isDevice ? this.setPopupPosition() : 2;
        this.popupObj = new Popup(this.popupWrapper as HTMLElement, {
            width: this.setPopupWidth(this.width),
            zIndex: this.zIndex,
            targetType: 'relative',
            collision: { X: 'flip', Y: 'flip' },
            relateTo: this.inputWrapper.container,
            position: { X: 'left', Y: 'bottom' },
            enableRtl: this.enableRtl,
            offsetY: offset,
            offsetX: this.popupCalculation(),
            open: () => {
                this.popupWrapper.style.visibility = 'visible';
                addClass([this.inputWrapper.buttons[0]], SELECTED);
            }, close: () => {
                removeClass([this.inputWrapper.buttons[0]], SELECTED);
                this.unWireListEvents();
                this.inputElement.setAttribute('aria-activedescendant', 'null');
                remove(this.popupObj.element);
                this.popupObj.destroy();
                this.popupWrapper.innerHTML = '';
                this.listWrapper = this.popupWrapper = this.listTag = undefined;
            }
        });
        if (!Browser.isDevice) {
            this.popupObj.collision = { X: 'none', Y: 'flip' };
        }
        this.popupObj.element.style.maxHeight = POPUPDIMENSION;
    }

    //util function
    private getFormattedValue(value: Date): string {
        if (isNullOrUndefined(this.checkDateValue(value))) {
            return null;
        } else {
            return this.globalize.formatDate(value, { skeleton: 'medium', type: 'time' });
        }
    }
    private getDateObject(text: string | Date): Date {
        if (!this.isNullOrEmpty(text)) {
            let dateValue: Date = this.createDateObj(text);
            let value: boolean = !this.isNullOrEmpty(this.initValue);
            if (this.checkDateValue(dateValue)) {
                let date: number = value ? this.initValue.getDate() : DAY;
                let month: number = value ? this.initValue.getMonth() : MONTH;
                let year: number = value ? this.initValue.getFullYear() : YEAR;
                return new Date(year, month, date, dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds());
            }
        }
        return null;
    }

    private removeErrorClass(): void {
        removeClass([this.inputWrapper.container], ERROR);
        attributes(this.inputElement, { 'aria-invalid': 'false' });
    }
    private checkErrorState(val: Date | string): void {
        let value: Date = this.getDateObject(val);
        if (this.validateState(value)) {
            this.removeErrorClass();
        } else {
            addClass([this.inputWrapper.container], ERROR);
            attributes(this.inputElement, { 'aria-invalid': 'true' });
        }
    }
    private validateInterval(): void {
        if (!isNullOrUndefined(this.step) && this.step > 0) {
            this.enableElement([this.inputWrapper.buttons[0]]);
        } else {
            this.disableTimeIcon();
        }
    }
    private disableTimeIcon(): void {
        this.disableElement([this.inputWrapper.buttons[0]]);
        this.hide();
    }
    private disableElement(element: HTMLElement[]): void {
        addClass(element, DISABLED);
    }
    private enableElement(element: HTMLElement[]): void {
        removeClass(element, DISABLED);
    }
    private selectInputText(): void {
        this.inputElement.setSelectionRange(0, (this.inputElement).value.length);
    }
    private getMeridianText(): MeridianText {
        let meridian: MeridianText;
        if (this.locale === 'en' || this.locale === 'en-US') {
            meridian = getValue('dayPeriods.format.wide', getDefaultDateObject());
        } else {
            meridian = getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.dayPeriods.format.abbreviated', cldrData);
        }
        return meridian;
    }
    private getCursorSelection(): CursorPositionDetails {
        let input: HTMLInputElement = (this.inputElement);
        let start: number = 0;
        let end: number = 0;
        if (!isNaN(input.selectionStart)) {
            start = input.selectionStart;
            end = input.selectionEnd;
        }
        return { start: Math.abs(start), end: Math.abs(end) };
    }
    private getActiveElement(): HTMLElement[] {
        if (!isNullOrUndefined(this.popupWrapper)) {
            return <NodeListOf<HTMLElement> & HTMLElement[]>this.popupWrapper.querySelectorAll('.' + SELECTED);
        } else { return null; }
    }
    private isNullOrEmpty(value: Date | string): boolean {
        if (isNullOrUndefined(value) || (typeof value === 'string' && value.trim() === '')) {
            return true;
        } else { return false; }
    }
    private setWidth(width: number | string): string {
        if (typeof width === 'number') {
            width = formatUnit(width);
        } else if (typeof width === 'string') {
            width = (width.match(/px|%|em/)) ? width : formatUnit(width);
        } else {
            width = '100%';
        }
        return width;
    }
    private setPopupWidth(width: string | number): string {
        width = this.setWidth(width);
        if (width.indexOf('%') > -1) {
            let inputWidth: number = this.containerStyle.width * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        if (Browser.isDevice) {
            let firstItem: HTMLElement = this.isEmptyList() ? this.listTag : this.liCollections[0];
            width = (parseInt(width, 10) + (parseInt(getComputedStyle(firstItem).textIndent, 10) -
                parseInt(getComputedStyle(this.inputElement).textIndent, 10) +
                parseInt(getComputedStyle(this.inputElement.parentElement).borderLeftWidth, 10)) * 2) + 'px';
        }
        return width;
    }
    private setScrollPosition(): void {
        let listHeight: number = this.getPopupHeight();
        let element: HTMLElement;
        element = this.selectedElement;
        if (!isNullOrUndefined(element)) {
            this.findScrollTop(element);
        } else if (this.popupWrapper && this.checkDateValue(this.scrollTo)) {
            this.setScrollTo();
        }
    }
    private findScrollTop(element: HTMLElement): void {
        let listHeight: number = this.getPopupHeight();
        let nextEle: Element = element.nextElementSibling;
        let height: number = nextEle ? (<HTMLElement>nextEle).offsetTop : element.offsetTop;
        let liHeight: number = element.getBoundingClientRect().height;
        if ((height + element.offsetTop) > listHeight) {
            this.popupWrapper.scrollTop = nextEle ? (height - (listHeight / HALFPOSITION + liHeight / HALFPOSITION)) : height;
        } else {
            this.popupWrapper.scrollTop = 0;
        }
    }
    private setScrollTo(): void {
        let element: HTMLElement;
        if (!isNullOrUndefined(this.popupWrapper)) {
            let items: HTMLElement[] = <NodeListOf<HTMLLIElement> & HTMLElement[]>this.popupWrapper.querySelectorAll('.' + LISTCLASS);
            if (items.length) {
                let initialTime: number = this.timeCollections[0];
                let scrollTime: number = this.getDateObject(this.checkDateValue(this.scrollTo)).getTime();
                element = items[Math.round((scrollTime - initialTime) / (this.step * 60000))];
            }
        } else {
            this.popupWrapper.scrollTop = 0;
        }
        if (!isNullOrUndefined(element)) {
            this.findScrollTop(element);
        } else {
            this.popupWrapper.scrollTop = 0;
        }
    }
    private getText(): string {
        return (isNullOrUndefined(this.checkDateValue(this.value))) ? '' : this.getValue(this.value);
    }
    private getValue(value: Date): string {
        return (isNullOrUndefined(this.checkDateValue(value))) ? null : this.globalize.formatDate(value, {
            format: this.cldrTimeFormat(), type: 'time'
        });
    }
    private cldrDateFormat(): string {
        let cldrDate: string;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrDate = <string>(getValue('dateFormats.short', getDefaultDateObject()));
        } else {
            cldrDate = <string>(this.getCultureDateObject(cldrData, '' + this.locale));
        }
        return cldrDate;
    }
    private cldrTimeFormat(): string {
        let cldrTime: string;
        if (this.isNullOrEmpty(this.format)) {
            if (this.locale === 'en' || this.locale === 'en-US') {
                cldrTime = <string>(getValue('timeFormats.short', getDefaultDateObject()));
            } else {
                cldrTime = <string>(this.getCultureTimeObject(cldrData, '' + this.locale));
            }
        } else {
            cldrTime = this.format;
        }
        return cldrTime;
    }
    private dateToNumeric(): string {
        let cldrTime: string;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrTime = <string>(getValue('timeFormats.medium', getDefaultDateObject()));
        } else {
            cldrTime = <string>(getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.timeFormats.medium', cldrData));
        }
        return cldrTime;
    }
    private getExactDateTime(value: Date): string {
        if (isNullOrUndefined(this.checkDateValue(value))) {
            return null;
        } else {
            return this.globalize.formatDate(value, { format: this.dateToNumeric(), type: 'time' });
        }
    }
    private setValue(value: Date | string): void {
        let time: string = this.checkValue(value);
        if (!this.strictMode && !this.validateState(time)) {
            if (this.checkDateValue(this.valueWithMinutes) === null) {
                this.initValue = this.valueWithMinutes = null;
            }
            this.validateMinMax(this.value, this.min, this.max);
        } else {
            if (this.isNullOrEmpty(time)) {
                this.initValue = null;
                this.validateMinMax(this.value, this.min, this.max);
            } else {
                this.initValue = this.compareFormatChange(time);
            }
        }
        this.updateInput(true, this.initValue);
    }
    private compareFormatChange(value: string): Date {
        if (isNullOrUndefined(value)) { return null; }
        return (value !== this.getText()) ? this.getDateObject(value) : this.getDateObject(this.value);
    }
    private updatePlaceHolder(): void {
        Input.setPlaceholder(this.l10n.getConstant('placeholder'), this.inputElement);
    }

    //event related functions
    private popupHandler(e: MouseEvent): void {
        if (Browser.isDevice) {
            this.element.setAttribute('readonly', 'readonly');
        }
        e.preventDefault();
        if (this.isPopupOpen()) {
            this.closePopup(0, e);
        } else {
            this.show(e);
        }
    }
    private mouseDownHandler(): void {
        if (!this.readonly) {
            let curPos: CursorPositionDetails = this.getCursorSelection();
            this.inputElement.setSelectionRange(0, 0);
            EventHandler.add(this.inputElement, 'mouseup', this.mouseUpHandler, this);
        }
    }
    private mouseUpHandler(event: MouseEvent): void {
        if (!this.readonly) {
            event.preventDefault();
            EventHandler.remove(this.inputElement, 'mouseup', this.mouseUpHandler);
            let curPos: CursorPositionDetails = this.getCursorSelection();
            if (!(curPos.start === 0 && curPos.end === this.inputElement.value.length)) {
                if (this.inputElement.value.length > 0) {
                    this.cursorDetails = this.focusSelection();
                }
                this.inputElement.setSelectionRange(this.cursorDetails.start, this.cursorDetails.end);
            }
        }
    }
    private focusSelection(): CursorPositionDetails {
        let regex: RegExp = new RegExp('^[a-zA-Z0-9]+$');
        let split: string[] = this.inputElement.value.split('');
        split.push(' ');
        let curPos: CursorPositionDetails = this.getCursorSelection();
        let start: number = 0;
        let end: number = 0;
        let isSeparator: boolean = false;
        if (!this.isTextSelected) {
            for (let i: number = 0; i < split.length; i++) {
                if (!regex.test(split[i])) {
                    end = i;
                    isSeparator = true;
                }
                if (isSeparator) {
                    if (curPos.start >= start && curPos.end <= end) {
                        end = end;
                        this.isTextSelected = true;
                        break;
                    } else {
                        start = i + 1;
                        isSeparator = false;
                    }
                }
            }
        } else {
            start = curPos.start;
            end = curPos.end;
            this.isTextSelected = false;
        }
        return { start: start, end: end };
    }
    private inputHandler(event: KeyboardEventArgs): void {
        if (!this.readonly && this.enabled) {
            if (event.action !== 'right' && event.action !== 'left' && event.action !== 'tab') { event.preventDefault(); }
            switch (event.action) {
                case 'home':
                case 'end':
                case 'up':
                case 'down':
                    this.keyHandler(event);
                    break;
                case 'enter':
                    if (this.isNavigate) {
                        this.selectedElement = this.liCollections[this.activeIndex];
                        this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
                        this.updateValue(this.valueWithMinutes, event);
                    } else {
                        this.updateValue(this.inputElement.value, event);
                    }
                    this.hide();
                    addClass([this.inputWrapper.container], FOCUS);
                    this.isNavigate = false;
                    break;
                case 'open':
                    this.show(event);
                    break;
                case 'escape':
                    Input.setValue(this.objToString(this.value), this.inputElement, this.floatLabelType, this.showClearButton);
                    this.previousState(this.value);
                    this.hide();
                    break;
                case 'close':
                    this.hide();
                    break;
                default:
                    this.isNavigate = false;
                    break;
            }
        }
    }
    private onMouseClick(event: MouseEvent): void {
        let target: Element = <Element>event.target;
        let li: HTMLElement = this.selectedElement = <HTMLElement>closest(target, '.' + LISTCLASS);
        this.setSelection(li, event);
        if (li && li.classList.contains(LISTCLASS)) {
            this.hide();
            addClass([this.inputWrapper.container], FOCUS);
        }
    }
    private closePopup(delay?: number, e?: MouseEvent | KeyboardEvent | Event): void {
        if (this.isPopupOpen() && this.popupWrapper) {
            let args: PopupEventArgs = {
                popup: this.popupObj,
                event: e || null,
                cancel: false,
                name: 'open'
            };

            this.trigger('close', args);
            if (!args.cancel) {
                let animModel: AnimationModel = {
                    name: 'FadeOut',
                    duration: ANIMATIONDURATION,
                    delay: delay ? delay : 0
                };
                this.popupObj.hide(new Animation(animModel));
                removeClass([this.inputWrapper.container], [ICONANIMATION]);
                attributes(this.inputElement, { 'aria-expanded': 'false' });
                EventHandler.remove(document, 'mousedown touchstart', this.documentClickHandler);
            }
        }
        if (Browser.isDevice) {
            this.element.removeAttribute('readonly');
        }
    }
    private checkValueChange(event: KeyboardEventArgs | FocusEvent | MouseEvent, isNavigation: boolean): void {
        if (!this.strictMode && !this.validateState(this.valueWithMinutes)) {
            if (this.checkDateValue(this.valueWithMinutes) === null) {
                this.initValue = this.valueWithMinutes = null;
            }
            this.setProperties({ value: this.compareFormatChange(this.inputElement.value) }, true);
            this.initValue = this.valueWithMinutes = this.compareFormatChange(this.inputElement.value);
            this.prevValue = this.inputElement.value;
            if (+this.prevDate !== +this.value) {
                this.changeEvent(event);
            }
        } else {
            if (!isNavigation) {
                if ((this.prevValue !== this.inputElement.value) || isNullOrUndefined(this.checkDateValue(this.value))) {
                    this.valueProcess(event, this.compareFormatChange(this.inputElement.value));
                }
            } else {
                let value: Date = this.getDateObject(new Date(this.timeCollections[this.activeIndex]));
                if (+this.prevDate !== +value) {
                    this.valueProcess(event, value);
                }
            }
        }
    }
    private onMouseOver(event: MouseEvent): void {
        let currentLi: HTMLElement = <HTMLElement>closest(<Element>event.target, '.' + LISTCLASS);
        this.setHover(currentLi, HOVER);
    }
    private setHover(li: HTMLElement, className: string): void {
        if (this.enabled && this.isValidLI(li) && !li.classList.contains(className)) {
            this.removeHover(className);
            addClass([li], className);
            if (className === NAVIGATION) {
                li.setAttribute('aria-selected', 'true');
            }
        }
    }
    private setSelection(li: HTMLElement, event: MouseEvent): void {
        if (this.isValidLI(li) && !li.classList.contains(SELECTED)) {
            this.checkValue(li.getAttribute('data-value'));
            this.selectedElement = li;
            this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(li);
            this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
            addClass([this.selectedElement], SELECTED);
            this.selectedElement.setAttribute('aria-selected', 'true');
            this.checkValueChange(event, true);
        }
    }
    private onMouseLeave(): void {
        this.removeHover(HOVER);
    }
    private scrollHandler(): void {
        if (this.getModuleName() === 'timepicker' && Browser.isDevice) {
            return;
        } else {
            this.hide();
        }
    }
    private setMinMax(minVal: Date, maxVal: Date): void {
        if (isNullOrUndefined(this.checkDateValue(minVal))) {
            this.initMin = this.getDateObject('12:00:00 AM');
        }
        if (isNullOrUndefined(this.checkDateValue(maxVal))) {
            this.initMax = this.getDateObject('11:59:59 PM');
        }
    }
    //protected function
    protected validateMinMax(dateVal: Date | string, minVal: Date, maxVal: Date): Date | string {
        let value: Date = dateVal instanceof Date ? dateVal : this.getDateObject(dateVal);
        if (!isNullOrUndefined(this.checkDateValue(value))) {
            dateVal = this.strictOperation(this.initMin, this.initMax, dateVal, value);
        } else if (+(this.createDateObj(this.getFormattedValue(this.initMin))) >
            +(this.createDateObj(this.getFormattedValue(this.initMax)))) {
            this.disableTimeIcon();
        }
        if (this.strictMode) {
            dateVal = this.valueIsDisable(dateVal) ? dateVal : null;
        }
        this.checkErrorState(dateVal);
        return dateVal;
    }
    private valueIsDisable(value: string | Date): boolean {
        if (this.disableItemCollection.length > 0) {
            if (this.disableItemCollection.length === this.timeCollections.length) {
                return false;
            }
            let time: string = value instanceof Date ? this.objToString(value) : value;
            for (let index: number = 0; index < this.disableItemCollection.length; index++) {
                if (time === this.disableItemCollection[index]) {
                    return false;
                }
            }
        }
        return true;
    }
    protected validateState(val: string | Date): boolean {
        if (!this.strictMode) {
            if (this.valueIsDisable(val)) {
                let value: Date = typeof val === 'string' ? this.setCurrentDate(this.getDateObject(val)) :
                    this.setCurrentDate(this.getDateObject(val));
                let maxValue: Date = this.setCurrentDate(this.getDateObject(this.initMax));
                let minValue: Date = this.setCurrentDate(this.getDateObject(this.initMin));
                if (!isNullOrUndefined(this.checkDateValue(value))) {
                    if ((+(value) > +(maxValue)) || (+(value) < +(minValue))) {
                        return false;
                    }
                } else {
                    if ((+(maxValue) < +(minValue)) || this.inputElement.value !== '') {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
        return true;
    }
    protected strictOperation(minimum: Date, maximum: Date, dateVal: Date | string, val: Date): Date | string {
        let maxValue: Date = this.createDateObj(this.getFormattedValue(maximum));
        let minValue: Date = this.createDateObj(this.getFormattedValue(minimum));
        let value: Date = this.createDateObj(this.getFormattedValue(val));
        if (this.strictMode) {
            if (+minValue > +maxValue) {
                this.disableTimeIcon();
                this.initValue = this.getDateObject(maxValue);
                Input.setValue(this.getValue(this.initValue), this.inputElement, this.floatLabelType, this.showClearButton);
                return this.inputElement.value;
            } else if (+minValue >= +value) {
                return this.getDateObject(minValue);
            } else if (+value >= +maxValue || +minValue === +maxValue) {
                return this.getDateObject(maxValue);
            }
        } else {
            if (+minValue > +maxValue) {
                this.disableTimeIcon();
                if (!isNaN(+this.createDateObj(dateVal))) {
                    return dateVal;
                }
            }
        }
        return dateVal;
    }
    protected bindEvents(): void {
        EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.popupHandler, this);
        EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
        EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
        EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
        if (this.showClearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.clearHandler, this);
        }
        let form: Element = closest(this.element, 'form');
        if (form) {
            EventHandler.add(form, 'reset', this.formResetHandler.bind(this));
        }
        if (!Browser.isDevice) {
            this.inputEvent = new KeyboardEvents(
                this.inputWrapper.container, {
                    keyAction: this.inputHandler.bind(this), keyConfigs: this.keyConfigure, eventName: 'keydown'
                });
            if (this.showClearButton) {
                EventHandler.add(this.inputElement, 'mousedown', this.mouseDownHandler, this);
            }
        }
    }
    protected formResetHandler(): void {
        if (!this.inputElement.getAttribute('value')) {
            this.value = null;
            if (this.inputElement) {
                Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
                this.removeErrorClass();
            }
        } else {
            this.value = this.checkDateValue(new Date('' + this.element.getAttribute('value')));
        }
    }
    private inputChangeHandler(e: MouseEvent): void {
        e.stopPropagation();
    }
    protected unBindEvents(): void {
        EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', this.popupHandler);
        EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
        EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
        EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
        if (this.inputEvent) { this.inputEvent.destroy(); }
        EventHandler.remove(this.inputElement, 'mousedown touchstart', this.mouseDownHandler);
        EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.clearHandler);
        let form: Element = closest(this.element, 'form');
        if (form) {
            EventHandler.remove(form, 'reset', this.formResetHandler.bind(this));
        }

    }
    private bindClearEvent(): void {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.clearHandler, this);
        }
    }
    protected clearHandler(e: MouseEvent): void {
        e.preventDefault();
        this.clear(e);
        if (this.popupWrapper) {
            this.popupWrapper.scrollTop = 0;
        }
    }
    private clear(event: MouseEvent): void {
        this.setProperties({ value: null }, true);
        this.initValue = null;
        this.resetState();
        this.changeEvent(event);
    }
    protected setZIndex(): void {
        if (this.popupObj) {
            this.popupObj.zIndex = this.zIndex;
            this.popupObj.dataBind();
        }
    }
    protected checkAttributes(): void {
        let attributes: string[] = ['step', 'disabled', 'readonly', 'style', 'name', 'value', 'min', 'max', 'placeholder'];
        let value: Date;
        for (let prop of attributes) {
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        let enabled: boolean = isNullOrUndefined(this.inputElement.getAttribute(prop));
                        this.setProperties({ enabled: enabled }, true);
                        break;
                    case 'readonly':
                        let readonly: boolean = !isNullOrUndefined(this.inputElement.getAttribute(prop));
                        this.setProperties({ readonly: readonly }, true);
                        break;
                    case 'style':
                        this.inputStyle = this.inputElement.getAttribute(prop);
                        break;
                    case 'name':
                        this.inputElement.setAttribute('name', this.inputElement.getAttribute(prop));
                        break;
                    case 'step':
                        this.step = parseInt(this.inputElement.getAttribute(prop), 10);
                        break;
                    case 'placeholder':
                        this.placeholder = this.inputElement.getAttribute(prop);
                        break;
                    case 'min':
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!isNullOrUndefined(this.checkDateValue(value))) {
                            this.setProperties({ min: value }, true);
                        }
                        break;
                    case 'max':
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!isNullOrUndefined(this.checkDateValue(value))) {
                            this.setProperties({ max: value }, true);
                        }
                        break;
                    case 'value':
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!isNullOrUndefined(this.checkDateValue(value))) {
                            this.initValue = value;
                            this.updateInput(false, this.initValue);
                        }
                        break;
                }
            }
        }
    }
    protected setCurrentDate(value: Date): Date {
        if (isNullOrUndefined(this.checkDateValue(value))) { return null; }
        return new Date(YEAR, MONTH, DAY, value.getHours(), value.getMinutes(), value.getSeconds());
    }

    protected getTextFormat(): number {
        let time: number = 0;
        if (this.cldrTimeFormat().split(' ')[0] === 'a' || this.cldrTimeFormat().indexOf('a') === 0) {
            time = 1;
        } else if (this.cldrTimeFormat().indexOf('a') < 0) {
            let strArray: string[] = this.cldrTimeFormat().split(' ');
            for (let i: number = 0; i < strArray.length; i++) {
                if (strArray[i].toLowerCase().indexOf('h') >= 0) {
                    time = i;
                    break;
                }
            }
        }
        return time;
    }
    protected updateValue(value: string | Date, event: KeyboardEventArgs | FocusEvent | MouseEvent): void {
        let val: string;
        if (this.isNullOrEmpty(value)) {
            this.resetState();
        } else {
            val = this.checkValue(value);
            if (this.strictMode) {
                // this case set previous value to the text box when set invalid date
                let inputVal: string = (val === null && (<string>value).trim().length > 0) ?
                    this.previousState(this.prevDate) : this.inputElement.value;
                Input.setValue(inputVal, this.inputElement, this.floatLabelType, this.showClearButton);
            }
        }
        this.checkValueChange(event, typeof value === 'string' ? false : true);
    }
    protected previousState(date: Date): string {
        let value: Date = this.getDateObject(date);
        for (let i: number = 0; i < this.timeCollections.length; i++) {
            if (+value === this.timeCollections[i]) {
                this.activeIndex = i;
                this.selectedElement = this.liCollections[i];
                this.valueWithMinutes = new Date(this.timeCollections[i]);
                break;
            }
        }
        return this.prevValue;
    }
    protected resetState(): void {
        this.removeSelection();
        Input.setValue('', this.inputElement, this.floatLabelType, false);
        this.valueWithMinutes = this.activeIndex = null;
        if (!this.strictMode) {
            this.checkErrorState(null);
        }
    }
    protected objToString(val: Date): string {
        if (isNullOrUndefined(this.checkDateValue(val))) {
            return null;
        } else {
            return this.globalize.formatDate(val, { format: this.cldrTimeFormat(), type: 'time' });
        }
    }
    protected checkValue(value: string | Date): string {
        if (!this.isNullOrEmpty(value)) {
            let date: Date = value instanceof Date ? value : this.getDateObject(value);
            return this.validateValue(date, value);
        }
        this.resetState();
        return this.valueWithMinutes = null;
    }

    protected validateValue(date: Date, value: string | Date): string {
        let time: string;
        let val: string | Date = this.validateMinMax(value, this.min, this.max);
        let newval: Date = this.createDateObj(val);
        if (this.getFormattedValue(newval) !== this.getFormattedValue(this.value)) {
            this.valueWithMinutes = isNullOrUndefined(newval) ? null : newval;
            time = this.objToString(this.valueWithMinutes);
        } else {
            if (this.strictMode) {
                //for strict mode case, when value not present within a range. Reset the nearest range value.
                date = newval;
            }
            this.valueWithMinutes = this.checkDateValue(date);
            time = this.objToString(this.valueWithMinutes);
        }
        if (!this.strictMode && isNullOrUndefined(time)) {
            let value: string = (<string>val).trim().length > 0 ? (<string>val) : '';
            Input.setValue(value, this.inputElement, this.floatLabelType, this.showClearButton);
        } else {
            Input.setValue(time, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        return time;
    }
    protected findNextElement(event: KeyboardEventArgs): void {
        let textVal: string = (this.inputElement).value;
        let value: Date = isNullOrUndefined(this.valueWithMinutes) ? this.createDateObj(textVal) :
            this.getDateObject(this.valueWithMinutes);
        let timeVal: number = null;
        let count: number = this.liCollections.length;
        if (!isNullOrUndefined(this.checkDateValue(value)) || !isNullOrUndefined(this.activeIndex)) {
            if (event.action === 'home') {
                let index: number = this.validLiElement(0);
                timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                this.activeIndex = index;
            } else if (event.action === 'end') {
                let index: number = this.validLiElement(this.timeCollections.length - 1, true);
                timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                this.activeIndex = index;
            } else {
                if (event.action === 'down') {
                    for (let i: number = 0; i < count; i++) {
                        if (+value < this.timeCollections[i]) {
                            let index: number = this.validLiElement(i);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        } else if (i === count - 1) {
                            let index: number = this.validLiElement(0);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        }
                    }
                } else {
                    for (let i: number = count - 1; i >= 0; i--) {
                        if (+value > this.timeCollections[i]) {
                            let index: number = this.validLiElement(i, true);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        } else if (i === 0) {
                            let index: number = this.validLiElement(count - 1);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        }
                    }
                }
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            this.elementValue(isNullOrUndefined(timeVal) ? null : new Date(timeVal));
        } else {
            let index: number = this.validLiElement(0, event.action === 'down' ? false : true);
            this.activeIndex = index;
            this.selectedElement = this.liCollections[index];
            this.elementValue(new Date(this.timeCollections[index]));
        }
    }
    protected elementValue(value: Date): void {
        if (!isNullOrUndefined(this.checkDateValue(value))) {
            this.checkValue(value);
        }
    }
    private validLiElement(index: number, backward?: boolean): number {
        let elementIndex: number = null;
        let items: HTMLElement[] = isNullOrUndefined(this.popupWrapper) ? this.liCollections :
            <NodeListOf<HTMLLIElement> & HTMLElement[]>this.popupWrapper.querySelectorAll('.' + LISTCLASS);
        let isCheck: boolean = true;
        if (items.length) {
            if (backward) {
                for (let i: number = index; i >= 0; i--) {
                    if (!items[i].classList.contains(DISABLED)) {
                        elementIndex = i;
                        break;
                    } else if (i === 0) {
                        if (isCheck) {
                            index = i = items.length;
                            isCheck = false;
                        }
                    }
                }
            } else {
                for (let i: number = index; i <= items.length - 1; i++) {
                    if (!items[i].classList.contains(DISABLED)) {
                        elementIndex = i;
                        break;
                    } else if (i === items.length - 1) {
                        if (isCheck) {
                            index = i = -1;
                            isCheck = false;
                        }
                    }
                }
            }

        }
        return elementIndex;
    }
    protected keyHandler(event: KeyboardEventArgs): void {
        if (isNullOrUndefined(this.step) || this.step <= 0 || this.inputWrapper.buttons[0].classList.contains(DISABLED)) { return; }
        let count: number = this.timeCollections.length;
        if (isNullOrUndefined(this.getActiveElement()) || this.getActiveElement().length === 0) {
            if (this.liCollections.length > 0) {
                if (isNullOrUndefined(this.value) && isNullOrUndefined(this.activeIndex)) {
                    let index: number = this.validLiElement(0, event.action === 'down' ? false : true);
                    this.activeIndex = index;
                    this.selectedElement = this.liCollections[index];
                    this.elementValue(new Date(this.timeCollections[index]));
                } else { this.findNextElement(event); }
            } else { this.findNextElement(event); }
        } else {
            let nextItem: number;
            if ((event.keyCode >= 37) && (event.keyCode <= 40)) {
                let index: number = (event.keyCode === 40 || event.keyCode === 39) ? ++this.activeIndex : --this.activeIndex;
                this.activeIndex = index = this.activeIndex === (count) ? 0 : this.activeIndex;
                this.activeIndex = index = this.activeIndex < 0 ? (count - 1) : this.activeIndex;
                this.activeIndex = index = this.validLiElement(this.activeIndex, (event.keyCode === 40 || event.keyCode === 39) ?
                    false : true);
                nextItem = isNullOrUndefined(this.timeCollections[index]) ? this.timeCollections[0] : this.timeCollections[index];
            } else if (event.action === 'home') {
                let index: number = this.validLiElement(0);
                this.activeIndex = index;
                nextItem = this.timeCollections[index];
            } else if (event.action === 'end') {
                let index: number = this.validLiElement(count - 1, true);
                this.activeIndex = index;
                nextItem = this.timeCollections[index];
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            this.elementValue(new Date(nextItem));
        }
        this.isNavigate = true;
        this.setHover(this.selectedElement, NAVIGATION);
        this.setActiveDescendant();
        this.selectInputText();
        if (this.isPopupOpen() && this.selectedElement !== null && (!event || event.type !== 'click')) { this.setScrollPosition(); }
    }
    protected setPopupPosition(): number {
        let offsetValue: number;
        let padding: number = 1;
        let popupHeight: number = this.getPopupHeight();
        let element: HTMLElement[] = this.getActiveElement();
        let liHeight: number = this.liCollections[0].getBoundingClientRect().height;
        let listHeight: number = popupHeight / HALFPOSITION;
        let height: number = element.length === 0 ? this.liCollections[0].offsetTop : element[0].offsetTop;
        let lastItemOffsetValue: number = this.liCollections[this.liCollections.length - 1].offsetTop;
        let ulPadding: number = (parseInt(getComputedStyle(this.listTag).paddingTop, 10));
        if (lastItemOffsetValue - listHeight < height) {
            let count: number = popupHeight / liHeight;
            offsetValue = (count - (this.liCollections.length - this.activeIndex)) * liHeight - ulPadding - HALFPOSITION;
        } else if ((height + liHeight) > listHeight) {
            offsetValue = listHeight - liHeight / HALFPOSITION;
        } else {
            offsetValue = height;
        }
        offsetValue = offsetValue + HALFPOSITION + ((liHeight - this.containerStyle.height) / HALFPOSITION);
        return -offsetValue;
    }
    protected getCultureTimeObject(ld: Object, c: string): Object {
        return getValue('main.' + c + '.dates.calendars.gregorian.timeFormats.short', ld);
    }
    protected getCultureDateObject(ld: Object, c: string): Object {
        return getValue('main.' + c + '.dates.calendars.gregorian.dateFormats.short', ld);
    }
    protected wireListEvents(): void {
        EventHandler.add(this.listWrapper, 'click', this.onMouseClick, this);
        if (!Browser.isDevice) {
            EventHandler.add(this.listWrapper, 'mouseover', this.onMouseOver, this);
            EventHandler.add(this.listWrapper, 'mouseout', this.onMouseLeave, this);
        }
    }
    protected unWireListEvents(): void {
        if (this.listWrapper) {
            EventHandler.remove(this.listWrapper, 'click', this.onMouseClick);
            if (!Browser.isDevice) {
                EventHandler.remove(this.listWrapper, 'mouseover', this.onMouseOver);
                EventHandler.remove(this.listWrapper, 'mouseout', this.onMouseLeave);
            }
        }
    }
    protected valueProcess(event: KeyboardEventArgs | FocusEvent | MouseEvent, value: Date): void {
        let result: Date = (isNullOrUndefined(this.checkDateValue(value))) ? null : value;
        if (+ this.prevDate !== +result) {
            this.initValue = result;
            this.changeEvent(event);
        }
    }
    protected changeEvent(e: KeyboardEventArgs | FocusEvent | MouseEvent): void {
        this.addSelection();
        this.updateInput(true, this.initValue);
        let eventArgs: ChangeEventArgs = {
            event: (e || null),
            value: this.value,
            text: (this.inputElement).value,
            isInteracted: !isNullOrUndefined(e),
            element: this.element
        };
        eventArgs.value = this.valueWithMinutes || this.getDateObject(this.inputElement.value);
        this.prevDate = this.valueWithMinutes || this.getDateObject(this.inputElement.value);
        this.trigger('change', eventArgs);
    }
    protected updateInput(isUpdate: boolean, date: Date): void {
        if (isUpdate) {
            this.prevValue = this.getValue(date);
        }
        this.prevDate = this.valueWithMinutes = date;
        this.setProperties({ value: date }, true);
    }
    protected setActiveDescendant(): void {
        if (!isNullOrUndefined(this.selectedElement)) {
            attributes(this.inputElement, { 'aria-activedescendant': this.selectedElement.getAttribute('id') });
        } else {
            attributes(this.inputElement, { 'aria-activedescendant': 'null' });
        }
    }
    protected removeSelection(): void {
        this.removeHover(HOVER);
        if (!isNullOrUndefined(this.popupWrapper)) {
            let items: Element[] = <NodeListOf<Element> & Element[]>this.popupWrapper.querySelectorAll('.' + SELECTED);
            if (items.length) {
                removeClass(items, SELECTED);
                items[0].removeAttribute('aria-selected');
            }
        }
    }
    protected removeHover(className: string): void {
        let hoveredItem: Element[] = this.getHoverItem(className);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, className);
            if (className === NAVIGATION) {
                hoveredItem[0].removeAttribute('aria-selected');
            }
        }
    }
    protected getHoverItem(className: string): Element[] {
        let hoveredItem: Element[];
        if (!isNullOrUndefined(this.popupWrapper)) {
            hoveredItem = <NodeListOf<HTMLLIElement> & Element[]>this.popupWrapper.querySelectorAll('.' + className);
        }
        return hoveredItem;
    }
    private setActiveClass(): void {
        if (!isNullOrUndefined(this.popupWrapper)) {
            let items: HTMLElement[] = <NodeListOf<HTMLLIElement> & HTMLElement[]>this.popupWrapper.querySelectorAll('.' + LISTCLASS);
            if (items.length) {
                for (let i: number = 0; i < items.length; i++) {
                    if (this.timeCollections[i] === +this.getDateObject(this.valueWithMinutes)) {
                        items[i].setAttribute('aria-selected', 'true');
                        this.selectedElement = items[i];
                        this.activeIndex = i;
                        break;
                    }
                }
            }
        }
    }
    protected addSelection(): void {
        this.selectedElement = null;
        this.removeSelection();
        this.setActiveClass();
        if (!isNullOrUndefined(this.selectedElement)) {
            addClass([this.selectedElement], SELECTED);
            this.selectedElement.setAttribute('aria-selected', 'true');
        }
    }
    protected isValidLI(li: Element | HTMLElement): boolean {
        return (li && li.classList.contains(LISTCLASS) && !li.classList.contains(DISABLED));
    }
    protected createDateObj(val: Date | string): Date {
        let today: string = this.globalize.formatDate(new Date(), { skeleton: 'short', type: 'date' });
        let value: Date = null;
        if (typeof val === 'string') {
            if (val.toUpperCase().indexOf('AM') > -1 || val.toUpperCase().indexOf('PM') > -1) {
                today = this.defaultCulture.formatDate(new Date(), { skeleton: 'short', type: 'date' });
                value = isNaN(+new Date(today + ' ' + val)) ? null : new Date(new Date(today + ' ' + val).setMilliseconds(0));
                if (isNullOrUndefined(value)) {
                    value = this.TimeParse(today, val);
                }
            } else {
                value = this.TimeParse(today, val);
            }
        } else if (val instanceof Date) {
            value = val;
        }
        return value;
    }
    protected TimeParse(today: string, val: Date | string): Date {
        let value: Date;
        value = this.globalize.parseDate(today + ' ' + val, {
            format: this.cldrDateFormat() + ' ' + this.cldrTimeFormat(), type: 'datetime'
        });
        value = isNullOrUndefined(value) ? this.globalize.parseDate(today + ' ' + val, {
            format: this.cldrDateFormat() + ' ' + this.dateToNumeric(), type: 'datetime'
        }) : value;
        value = isNullOrUndefined(value) ? value : new Date(value.setMilliseconds(0));
        return value;
    }
    protected createListItems(): void {
        this.listWrapper = this.createElement('div', { className: CONTENT, attrs: { 'tabindex': '0' } });
        let start: number;
        let end: number;
        let interval: number = this.step * 60000;
        let listItems: string[] = [];
        this.timeCollections = [];
        this.disableItemCollection = [];
        start = +(this.getDateObject(this.initMin).setMilliseconds(0));
        end = +(this.getDateObject(this.initMax).setMilliseconds(0));
        while (end >= start) {
            this.timeCollections.push(start);
            listItems.push(this.globalize.formatDate(new Date(start), { format: this.cldrTimeFormat(), type: 'time' }));
            start += interval;
        }
        let listBaseOptions: ListBaseOptions = {
            itemCreated: (args: { item: Element, text: string }): void => {
                let eventArgs: ItemEventArgs = {
                    element: args.item as HTMLElement,
                    text: args.text, value: this.getDateObject(args.text), isDisabled: false
                };
                this.trigger('itemRender', eventArgs);
                if (eventArgs.isDisabled) {
                    eventArgs.element.classList.add(DISABLED);
                }
                if (eventArgs.element.classList.contains(DISABLED)) {
                    this.disableItemCollection.push(eventArgs.element.getAttribute('data-value'));
                }
            }
        };
        this.listTag = ListBase.createList(this.createElement, listItems, listBaseOptions, true);
        attributes(this.listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options' });
        append([this.listTag], this.listWrapper);
    }
    private documentClickHandler(event: MouseEvent): void {
        event.preventDefault();
        let target: HTMLElement = <HTMLElement>event.target;
        if (!(closest(target, '#' + this.popupObj.element.id)) && target !== this.inputElement
            && target !== (this.inputWrapper && this.inputWrapper.buttons[0]) &&
            target !== (this.inputWrapper && this.inputWrapper.clearButton) &&
            target !== (this.inputWrapper && this.inputWrapper.container)) {
            if (this.isPopupOpen()) {
                this.hide();
            }
        } else if (target !== this.inputElement) {
            if (!Browser.isDevice) {
                this.isPreventBlur = (Browser.isIE || Browser.info.name === 'edge') && (document.activeElement === this.inputElement);
                event.preventDefault();
            }
        }
    }
    protected setEnableRtl(): void {
        Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
        if (this.popupObj) {
            this.popupObj.enableRtl = this.enableRtl;
            this.popupObj.dataBind();
        }
    }

    protected setEnable(): void {
        Input.setEnabled(this.enabled, this.inputElement, this.floatLabelType);
        if (this.enabled) {
            removeClass([this.inputWrapper.container], DISABLED);
            attributes(this.inputElement, { 'aria-disabled': 'false' });
        } else {
            this.hide();
            addClass([this.inputWrapper.container], DISABLED);
            attributes(this.inputElement, { 'aria-disabled': 'true' });
        }
    }

    protected getProperty(date: TimePickerModel, val: string): void {
        if (val === 'min') {
            this.initMin = this.checkDateValue(new Date('' + date.min));
            this.setProperties({ min: this.initMin }, true);
        } else {
            this.initMax = this.checkDateValue(new Date('' + date.max));
            this.setProperties({ max: this.initMax }, true);
        }
        if (this.inputElement.value === '') {
            this.validateMinMax(this.value, this.min, this.max);
        } else {
            this.checkValue((<HTMLInputElement>this.inputElement).value);
        }
        this.checkValueChange(null, false);
    }
    protected inputBlurHandler(e: MouseEvent): void {
        // IE popup closing issue when click over the scrollbar
        if (this.isPreventBlur && this.isPopupOpen()) {
            this.inputElement.focus();
            return;
        }
        this.closePopup(0, e);
        removeClass([this.inputWrapper.container], [FOCUS]);
        let blurArguments: BlurEventArgs = {
            model: this
        };
        this.trigger('blur', blurArguments);
        if (this.getText() !== this.inputElement.value) {
            this.updateValue((this.inputElement).value, e);
        } else if (this.inputElement.value.trim().length === 0) {
            this.resetState();
        }
        this.cursorDetails = null;
        this.isNavigate = false;
    }
    /**
     * Focuses out the TimePicker textbox element.
     * @returns void
     */
    public focusOut(): void {
        if (document.activeElement === this.inputElement) {
            this.inputElement.blur();
            let blurArguments: BlurEventArgs = {
                model: this
            };
            this.trigger('blur', blurArguments);
        }
    }
    private isPopupOpen(): boolean {
        if (this.popupWrapper && this.popupWrapper.classList.contains('' + ROOT)) {
            return true;
        }
        return false;
    }
    private inputFocusHandler(): void {
        let focusArguments: FocusEventArgs = {
            model: this
        };
        if (!this.readonly && !Browser.isDevice) { this.selectInputText(); }
        this.trigger('focus', focusArguments);
    }
    /**
     * Focused the TimePicker textbox element.
     * @returns void
     */
    public focusIn(): void {
        if (document.activeElement !== this.inputElement && this.enabled) {
            this.inputElement.focus();
            let focusArguments: FocusEventArgs = {
                model: this
            };
            this.trigger('focus', focusArguments);
        }
    }
    /**
     * Hides the TimePicker popup.
     * @returns void
     */
    public hide(): void {
        this.closePopup(100, null);
    }

    /**
     * Opens the popup to show the list items.
     * @returns void
     */
    public show(event?: KeyboardEvent | MouseEvent | Event): void {
        if ((this.enabled && this.readonly) || !this.enabled || this.popupWrapper) {
            return;
        } else {
            let args: PopupEventArgs = {
                popup: this.popupObj || null,
                cancel: false,
                event: event || null,
                name: 'open'
            };
            this.trigger('open', args);
            if (!args.cancel && !this.isPopupOpen() && !this.inputWrapper.buttons[0].classList.contains(DISABLED)) {
                this.inputElement.focus();
                this.popupCreation();
                if (!args.cancel) {
                    let openAnimation: AnimationModel = {
                        name: 'FadeIn',
                        duration: ANIMATIONDURATION,
                    };
                    this.popupObj.refreshPosition(this.inputElement);
                    if (this.zIndex === 1000) {
                        this.popupObj.show(new Animation(openAnimation), this.element);
                    } else {
                        this.popupObj.show(new Animation(openAnimation), null);
                    }
                    this.setActiveDescendant();
                    attributes(this.inputElement, { 'aria-expanded': 'true' });
                    addClass([this.inputWrapper.container], FOCUS);
                }
                EventHandler.add(document, 'mousedown', this.documentClickHandler, this);
            }
        }
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
     * To get component name  
     * @private
     */
    protected getModuleName(): string {
        return 'timepicker';
    }
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    public onPropertyChanged(newProp: TimePickerModel, oldProp: TimePickerModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'placeholder':
                    Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    this.inputElement.setAttribute('aria-placeholder', newProp.placeholder);
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement, this.floatLabelType);
                    if (this.readonly) { this.hide(); }
                    break;
                case 'cssClass':
                    this.inputWrapper.container.className += ' ' + newProp.cssClass;
                    if (this.popupWrapper) {
                        this.popupWrapper.className += ' ' + newProp.cssClass;
                    }
                    this.setProperties({ cssClass: newProp.cssClass }, true);
                    break;
                case 'enabled':
                    this.setProperties({ enabled: newProp.enabled }, true);
                    this.setEnable();
                    break;
                case 'allowEdit':
                    this.setTimeAllowEdit();
                    break;
                case 'enableRtl':
                    this.setProperties({ enableRtl: newProp.enableRtl }, true);
                    this.setEnableRtl();
                    break;
                case 'zIndex':
                    this.setProperties({ zIndex: newProp.zIndex }, true);
                    this.setZIndex();
                    break;
                case 'min':
                case 'max':
                    this.getProperty(newProp, prop);
                    break;
                case 'showClearButton':
                    Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                    this.bindClearEvent();
                    break;
                case 'locale':
                    this.setProperties({ locale: newProp.locale }, true);
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.updatePlaceHolder();
                    this.setValue(this.value);
                    break;
                case 'width':
                    setStyleAttribute(this.inputWrapper.container, { 'width': this.setWidth(newProp.width) });
                    this.containerStyle = this.inputWrapper.container.getBoundingClientRect();
                    break;
                case 'format':
                    this.setProperties({ format: newProp.format }, true);
                    this.setValue(this.value);
                    break;
                case 'value':
                    if (typeof newProp.value === 'string') {
                        this.setProperties({ value: this.checkDateValue(new Date(newProp.value)) }, true);
                        newProp.value = this.value;
                    } else {
                        newProp.value = this.checkDateValue(new Date('' + newProp.value));
                    }
                    this.initValue = newProp.value;
                    newProp.value = this.compareFormatChange(this.checkValue(newProp.value));
                    this.checkValueChange(null, false);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
                case 'strictMode':
                    if (newProp.strictMode) {
                        this.checkErrorState(null);
                    }
                    this.setProperties({ strictMode: newProp.strictMode }, true);
                    this.checkValue((this.inputElement).value);
                    this.checkValueChange(null, false);
                    break;
                case 'scrollTo':
                    if (this.checkDateValue(new Date('' + newProp.scrollTo))) {
                        if (this.popupWrapper) { this.setScrollTo(); }
                        this.setProperties({ scrollTo: newProp.scrollTo }, true);
                    } else {
                        this.setProperties({ scrollTo: null }, true);
                    }
                    break;
            }
        }
    }
}
