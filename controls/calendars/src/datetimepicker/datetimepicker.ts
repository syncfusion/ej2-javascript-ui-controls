///<reference path='../datepicker/datepicker-model.d.ts'/>
import { EventHandler, Internationalization, Property, NotifyPropertyChanges, Browser, RippleOptions } from '@syncfusion/ej2-base';
import { Animation, EmitType, Event, AnimationModel, cldrData, getDefaultDateObject, detach } from '@syncfusion/ej2-base';
import { createElement, remove, addClass, L10n, removeClass, closest, classList, append, attributes } from '@syncfusion/ej2-base';
import { KeyboardEvents, KeyboardEventArgs, isNullOrUndefined, formatUnit, getValue, rippleEffect } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { Input, BlurEventArgs } from '@syncfusion/ej2-inputs';
import { DatePicker, PopupObjectArgs } from '../datepicker/datepicker';
import { TimePickerBase } from '../timepicker/timepicker';
import { DateTimePickerModel } from './datetimepicker-model';
import { cssClass as ListBaseClasses } from '@syncfusion/ej2-lists';

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
const RTL: string = 'e-rtl';
const NAVIGATION: string = 'e-navigation';
const ACTIVE: string = 'e-active';
const HOVER: string = 'e-hover';
const ICONS: string = 'e-icons';
const HALFPOSITION: number = 2;
const LISTCLASS: string = ListBaseClasses.li;
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
    private isNavigate: boolean;
    protected isPreventBlur: boolean;
    private timeValue: string;
    protected l10n: L10n;
    private keyboardHandler: KeyboardEvents;
    protected inputEvent: KeyboardEvents;
    private activeIndex: number;
    private valueWithMinutes: Date = null;
    private previousDateTime: Date = null;
    private initValue: Date;
    private isValidState: boolean;
    protected timekeyConfigure: { [key: string]: string };
    protected preventArgs: PopupObjectArgs;

    /**
     * Specifies the format of the time value that to be displayed in time popup list.
     * @default null
     */
    @Property(null)
    public timeFormat: string;
    /**
     * Specifies the time interval between the two adjacent time values in the time popup list . 
     * @default 30
     */
    @Property(30)
    public step: number;
    /**
     * specifies the z-index value of the popup element.
     * @default 1000
     * @aspType int
     */
    @Property(1000)
    public zIndex: number;
    /** 
     * When set to true, enables RTL mode of the component that displays the content in the       right-to-left direction.
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
     * Specifies whether to show or hide the clear icon in textbox.
     * @default true
     */
    @Property(true)
    public showClearButton: boolean;
    /**
     * Specifies the placeholder text that to be is displayed in textbox.
     * @default null
     */
    @Property(null)
    public placeholder: string;
    /**
     * Specifies the component to act as strict. So that, it allows to enter only a valid
     * date and time value within a specified range or else it 
     * will resets to previous value. By default, strictMode is in false.
     * it allows invalid or out-of-range value with highlighted error class.
     * @default false
     * > For more details refer to 
     * [`Strict Mode`](./datetimepicker/strict-mode.html) documentation.
     */
    @Property(false)
    public strictMode: boolean;
    /** 
     * Triggers when popup is opened.
     * @event 
     */
    @Event()
    public open: EmitType<Object>;
    /** 
     * Triggers when popup is closed.
     * @event 
     */
    @Event()
    public close: EmitType<Object>;
    /** 
     * Triggers when input loses the focus.
     * @event 
     */
    @Event()
    public blur: EmitType<Object>;
    /** 
     * Triggers when input gets focus.
     * @event 
     */
    @Event()
    public focus: EmitType<Object>;
    /** 
     * Triggers when DateTimePicker is created.
     * @event 
     */
    @Event()
    public created: EmitType<Object>;
    /** 
     * Triggers when DateTimePicker is destroyed.
     * @event 
     */
    @Event()
    public destroyed: EmitType<Object>;
    /**
     * Constructor for creating the widget
     */
    constructor(options?: DateTimePickerModel, element?: string | HTMLInputElement) {
        super(options, element);
    }

    private focusHandler(): void {
        addClass([this.inputWrapper.container], INPUTFOCUS);
    }

    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    public focusIn(): void {
        super.focusIn();
    }
    /**
     * Remove the focus from widget, if the widget is in focus state. 
     * @returns void
     */
    public focusOut(): void {
        if (document.activeElement === this.inputElement) {
            this.inputElement.blur();
            removeClass([this.inputWrapper.container], [INPUTFOCUS]);
        }

    }

    protected blurHandler(e: MouseEvent): void {
        // IE popup closing issue when click over the scrollbar
        if (this.isTimePopupOpen() && this.isPreventBlur) {
            this.inputElement.focus();
            return;
        }
        removeClass([this.inputWrapper.container], INPUTFOCUS);
        let blurArguments: BlurEventArgs = {
            model: this
        };
        if (this.isTimePopupOpen()) {
            this.hide(e);
        }
        this.trigger('blur', blurArguments);
    }

    /**
     * To destroy the widget.    
     * @returns void
     */
    public destroy(): void {
        if (this.popupObject && this.popupObject.element.classList.contains(POPUP)) {
            this.dateTimeWrapper = undefined;
            this.liCollections = this.timeCollections = [];
            if (!isNullOrUndefined(this.rippleFn)) {
                this.rippleFn();
            }
        }
        let ariaAttribute: object = {
            'aria-live': 'assertive', 'aria-atomic': 'true', 'aria-invalid': 'false',
            'aria-haspopup': 'true', 'aria-activedescendant': 'null',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off'
        };
        if (this.inputElement) {
            Input.removeAttributes(<{ [key: string]: string }>ariaAttribute, this.inputElement);
            this.inputElement.removeAttribute('aria-placeholder');
        }
        if (this.isCalendar()) {
            if (this.popupWrapper) { detach(this.popupWrapper); }
            this.popupObject = this.popupWrapper = null;
            this.keyboardHandler.destroy();
        }
        this.unBindInputEvents();
        super.destroy();
    }
    /**
     * To Initialize the control rendering.
     * @return void
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
        this.checkAttributes();
        let localeText: { placeholder: string } = { placeholder: this.placeholder };
        this.l10n = new L10n('datetimepicker', localeText, this.locale);
        this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        super.render();
        this.createInputElement();
        this.bindInputEvents();
        this.setValue();
        this.previousDateTime = this.value && new Date(+this.value);
    }
    private setValue(): void {
        this.initValue = this.validateMinMaxRange(this.value);
        if (!this.strictMode && this.isDateObject(this.initValue)) {
            let value: Date = this.validateMinMaxRange(this.initValue);
            Input.setValue(this.getFormattedValue(value), this.inputElement, this.floatLabelType, this.showClearButton);
            this.setProperties({ value: value }, true);
        } else {
            if (isNullOrUndefined(this.value)) {
                this.initValue = null;
                this.setProperties({ value: null }, true);
            }
        }
        this.valueWithMinutes = this.value;
        super.updateInput();
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
        if (!isNullOrUndefined(value)) {
            let dateOptions: object = { format: this.cldrDateTimeFormat(), type: 'dateTime', skeleton: 'yMd' };
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
        this.keyboardHandler = new KeyboardEvents(
            <HTMLElement>this.inputElement,
            {
                eventName: 'keydown',
                keyAction: this.inputKeyAction.bind(this),
                keyConfigs: this.keyConfigs
            });
    }
    private unBindInputEvents(): void {
        EventHandler.remove(this.timeIcon, 'mousedown touchstart', this.timeHandler);
        EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', this.dateHandler);
        if (this.inputElement) {
            EventHandler.remove(this.inputElement, 'blur', this.blurHandler);
            EventHandler.remove(this.inputElement, 'focus', this.focusHandler);
        }
        if (this.keyboardHandler) { this.keyboardHandler.destroy(); }
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
        let culture: Internationalization = new Internationalization(this.locale);
        let dateFormat: string = culture.getDatePattern({ skeleton: 'yMd' });
        if (this.isNullOrEmpty(this.format)) {
            cldrTime = dateFormat + ' ' + this.getCldrFormat('time');
        } else {
            cldrTime = this.format;
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
        } else { return false; }
    }
    protected getCultureTimeObject(ld: Object, c: string): Object {
        return getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.timeFormats.short', ld);
    }
    private timeHandler(e?: MouseEvent): void {
        if (Browser.isDevice) {
            this.element.setAttribute('readonly', 'readonly');
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

    }

    private dateHandler(e?: MouseEvent): void {
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
        let value: Date = isNullOrUndefined(this.value) ? this.inputElement.value !== '' ?
            this.globalize.parseDate(this.inputElement.value, { format: this.cldrDateTimeFormat(), type: 'datetime' }) :
            new Date() : this.value;
        this.valueWithMinutes = value;
        this.listWrapper = createElement('div', { className: CONTENT, attrs: { 'tabindex': '0' } });
        let min: Date = this.startTime(value);
        let max: Date = this.endTime(value);
        let listDetails: { collection: number[], list: HTMLElement } =
            TimePickerBase.createListItems(this.createElement, min, max, this.globalize, this.cldrTimeFormat(), this.step);
        this.timeCollections = listDetails.collection;
        this.listTag = listDetails.list;
        attributes(this.listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options' });
        append([listDetails.list], this.listWrapper);
        this.wireTimeListEvents();
        let rippleModel: RippleOptions = { duration: 300, selector: '.' + LISTCLASS };
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
                attributes(this.popupWrapper, { 'id': this.element.id + '_datepopup' });
            }
        } else {
            if (!this.readonly) {
                this.dateTimeWrapper = createElement('div', {
                    className: ROOT + ' ' + POPUP,
                    attrs: { 'id': this.element.id + '_timepopup', 'style': 'visibility:hidden ; display:block' }
                });
                if (!isNullOrUndefined(this.cssClass)) { this.dateTimeWrapper.className += ' ' + this.cssClass; }
                if (!isNullOrUndefined(this.step) && this.step > 0) {
                    this.listCreation();
                    append([this.listWrapper], this.dateTimeWrapper);
                }
                document.body.appendChild(this.dateTimeWrapper);
                this.addTimeSelection();
                this.renderPopup();
                this.setTimeScrollPosition();
                this.openPopup(e);
                this.popupObject.refreshPosition(this.inputElement);
            }
        }
    }
    private openPopup(e: KeyboardEvent | MouseEvent | Event): void {
        this.preventArgs = {
            cancel: false,
            popup: this.popupObject,
            event: e || null
        };
        this.trigger('open', this.preventArgs);
        if (!this.preventArgs.cancel && !this.readonly) {
            let openAnimation: AnimationModel = {
                name: 'FadeIn',
                duration: ANIMATIONDURATION,
            };
            if (this.zIndex === 1000) {
                this.popupObject.show(new Animation(openAnimation), this.element);
            } else {
                this.popupObject.show(new Animation(openAnimation), null);
            }
            addClass([this.inputWrapper.container], [ICONANIMATION]);
            attributes(this.inputElement, { 'aria-expanded': 'true' });
            EventHandler.add(document, 'mousedown', this.documentClickHandler, this);
        }
    }
    private documentClickHandler(event: MouseEvent): void {
        event.preventDefault();
        let target: HTMLElement = <HTMLElement>event.target;
        if (!(closest(target, '#' + (this.popupObject && this.popupObject.element.id))) && target !== this.inputElement
            && target !== this.timeIcon && target !== this.inputWrapper.container) {
            if (this.isTimePopupOpen()) {
                this.hide(event);
            }
        } else if (target !== this.inputElement) {
            if (!Browser.isDevice) {
                this.isPreventBlur = (Browser.isIE || Browser.info.name === 'edge') && (document.activeElement === this.inputElement);
                event.preventDefault();
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
        let offset: number = 4;
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
                    this.inputEvent = new KeyboardEvents(
                        this.inputWrapper.container, {
                            keyAction: this.TimeKeyActionHandle.bind(this), keyConfigs: this.timekeyConfigure, eventName: 'keydown'
                        });
                }
            }, close: () => {
                removeClass([this.timeIcon], ACTIVE);
                this.unWireTimeListEvents();
                this.inputElement.setAttribute('aria-activedescendant', 'null');
                remove(this.popupObject.element);
                this.popupObject.destroy();
                this.dateTimeWrapper.innerHTML = '';
                this.listWrapper = this.dateTimeWrapper = undefined;
                if (this.inputEvent) { this.inputEvent.destroy(); }
            }
        });
        this.popupObject.element.style.maxHeight = POPUPDIMENSION;
    }
    private setDimension(width: number | string): string {
        if (typeof width === 'number') {
            width = formatUnit(width);
        } else if (typeof width === 'string') {
            width = width;
        } else {
            width = '100%';
        }
        return width;
    }
    private setPopupWidth(): string {
        let width: string = this.setDimension(this.width);
        if (width.indexOf('%') > -1) {
            let inputWidth: number = this.containerStyle.width * parseFloat(width) / 100;
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
        let currentLi: HTMLElement = <HTMLElement>closest(<Element>event.target, '.' + LISTCLASS);
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
        let height: number = parseInt(<string>POPUPDIMENSION, 10);
        let popupHeight: number = this.dateTimeWrapper.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    }
    protected changeEvent(e: Event): void {
        if (+ this.previousDateTime !== +this.value) {
            super.changeEvent(e);
            this.inputElement.focus();
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
            this.previousDateTime = this.value;
        }
    }
    private setTimeScrollPosition(): void {
        let popupHeight: number = this.getPopupHeight();
        let popupElement: HTMLElement;
        popupElement = this.selectedElement;
        if (!isNullOrUndefined(popupElement)) {
            let nextEle: Element = popupElement.nextElementSibling;
            let height: number = nextEle ? (<HTMLElement>nextEle).offsetTop : popupElement.offsetTop;
            let liHeight: number = popupElement.getBoundingClientRect().height;
            if ((height + popupElement.offsetTop) > popupHeight) {
                this.dateTimeWrapper.scrollTop = nextEle ? (height - (popupHeight / HALFPOSITION + liHeight / HALFPOSITION)) : height;
            } else {
                this.dateTimeWrapper.scrollTop = 0;
            }
        }
    }
    private setInputValue(type: string): void {
        if (type === 'date') {
            this.inputElement.value = this.previousElementValue = this.getFormattedValue(this.getFullDateTime());
            this.setProperties({ value: this.getFullDateTime() }, true);
        } else {
            let tempVal: string = this.getFormattedValue(new Date(this.timeCollections[this.activeIndex]));
            Input.setValue(tempVal, this.inputElement, this.floatLabelType, this.showClearButton);
            this.previousElementValue = this.inputElement.value;
            this.setProperties({ value: new Date(this.timeCollections[this.activeIndex]) }, true);
        }
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
    private combineDateTime(value: Date): Date {
        if (this.isDateObject(value)) {
            let day: number = this.previousDate.getDate();
            let month: number = this.previousDate.getMonth();
            let year: number = this.previousDate.getFullYear();
            let hour: number = value.getHours();
            let minutes: number = value.getMinutes();
            let seconds: number = value.getSeconds();
            return new Date(year, month, day, hour, minutes, seconds);
        } else {
            return this.previousDate;
        }
    }
    private onMouseClick(event: MouseEvent): void {
        let target: Element = <Element>event.target;
        let li: HTMLElement = this.selectedElement = <HTMLElement>closest(target, '.' + LISTCLASS);
        if (li && li.classList.contains(LISTCLASS)) {
            this.timeValue = li.getAttribute('data-value');
            this.hide(event);
        }
        this.setSelection(li, event);
    }
    private setSelection(li: HTMLElement, event: MouseEvent): void {
        if (this.isValidLI(li) && !li.classList.contains(ACTIVE)) {
            let value: string = li.getAttribute('data-value');
            this.selectedElement = li;
            let index: number = Array.prototype.slice.call(this.liCollections).indexOf(li);
            this.activeIndex = index;
            this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
            addClass([this.selectedElement], ACTIVE);
            this.selectedElement.setAttribute('aria-selected', 'true');
            this.updateValue(event);
        }
    }
    private setTimeActiveClass(): void {
        let collections: HTMLElement = isNullOrUndefined(this.dateTimeWrapper) ? this.listWrapper : this.dateTimeWrapper;
        if (!isNullOrUndefined(collections)) {
            let items: HTMLElement[] = <NodeListOf<HTMLLIElement> & HTMLElement[]>collections.querySelectorAll('.' + LISTCLASS);
            if (items.length) {
                for (let i: number = 0; i < items.length; i++) {
                    if (this.timeCollections[i] === +(this.valueWithMinutes)) {
                        items[i].setAttribute('aria-selected', 'true');
                        this.selectedElement = items[i];
                        this.activeIndex = i;
                        this.setTimeActiveDescendant();
                        break;
                    }
                }
            }
        }
    }
    private setTimeActiveDescendant(): void {
        if (!isNullOrUndefined(this.selectedElement)) {
            attributes(this.inputElement, { 'aria-activedescendant': this.selectedElement.getAttribute('id') });
        } else {
            attributes(this.inputElement, { 'aria-activedescendant': 'null' });
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
            let items: Element[] = <NodeListOf<Element> & Element[]>this.dateTimeWrapper.querySelectorAll('.' + ACTIVE);
            if (items.length) {
                removeClass(items, ACTIVE);
                items[0].removeAttribute('aria-selected');
            }
        }
    }
    protected removeTimeHover(className: string): void {
        let hoveredItem: Element[] = this.getTimeHoverItem(className);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, className);
        }
    }
    protected getTimeHoverItem(className: string): Element[] {
        let collections: HTMLElement = isNullOrUndefined(this.dateTimeWrapper) ? this.listWrapper : this.dateTimeWrapper;
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
        let day: number = value.getDate();
        let month: number = value.getMonth();
        let year: number = value.getFullYear();
        let hours: number = value.getHours();
        let minutes: number = value.getMinutes();
        let seconds: number = value.getSeconds();
        let milliseconds: number = value.getMilliseconds();
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
        let tempMin: Date = this.min;
        let value: Date;
        value = date === null ? new Date() : date;
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

    private endTime(date: Date): Date {
        let tempEndValue: Date;
        let end: boolean;
        let tempMax: Date = this.max;
        let value: Date;
        value = date === null ? new Date() : date;
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
            if (isNullOrUndefined(this.popupObj)) { this.trigger('close', this.preventArgs); }
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
        }
        if (Browser.isDevice) {
            this.element.removeAttribute('readonly');
        }
    }
    private closePopup(e?: KeyboardEvent | MouseEvent | Event): void {
        if (this.isTimePopupOpen() && this.popupObject) {
            let animModel: AnimationModel = {
                name: 'FadeOut',
                duration: ANIMATIONDURATION,
                delay: 0
            };
            this.popupObject.hide(new Animation(animModel));
            this.inputWrapper.container.classList.remove(ICONANIMATION);
            attributes(this.inputElement, { 'aria-expanded': 'false' });
            EventHandler.remove(document, 'mousedown touchstart', this.documentClickHandler);
        }
    }
    protected preRender(): void {
        super.preRender();
    };
    protected getProperty(date: DateTimePickerModel, val: string): void {
        if (val === 'min') {
            this.setProperties({ min: this.validateValue(date.min) }, true);
        } else {
            this.setProperties({ max: this.validateValue(date.max) }, true);
        }
    }

    protected checkAttributes(): void {
        let attributes: string[] = ['style', 'name', 'step', 'disabled', 'readonly', 'value', 'min', 'max', 'placeholder', 'type'];
        let value: Date;
        for (let prop of attributes) {
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'name':
                        this.inputElement.setAttribute('name', this.inputElement.getAttribute(prop));
                        break;
                    case 'step':
                        this.step = parseInt(this.inputElement.getAttribute(prop), 10);
                        break;
                    case 'readonly':
                        let readonly: boolean = !isNullOrUndefined(this.inputElement.getAttribute(prop));
                        this.setProperties({ readonly: readonly }, true);
                        break;
                    case 'placeholder':
                        this.placeholder = this.inputElement.getAttribute(prop);
                        break;
                    case 'min':
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!this.isNullOrEmpty(value) && !isNaN(+value)) {
                            this.setProperties({ min: value }, true);
                        }
                        break;
                    case 'disabled':
                        let enabled: boolean = isNullOrUndefined(this.inputElement.getAttribute(prop));
                        this.setProperties({ enabled: enabled }, true);
                        break;
                    case 'max':
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!this.isNullOrEmpty(value) && !isNaN(+value)) {
                            this.setProperties({ max: value }, true);
                        }
                        break;
                }
            }
        }
    }
    private getTimeActiveElement(): HTMLElement[] {
        if (!isNullOrUndefined(this.dateTimeWrapper)) {
            return <NodeListOf<HTMLElement> & HTMLElement[]>this.dateTimeWrapper.querySelectorAll('.' + ACTIVE);
        } else { return null; }
    }
    protected createDateObj(val: Date | string): Date {
        return val instanceof Date ? val : null;
    }
    private getDateObject(text: string | Date): Date {
        if (!this.isNullOrEmpty(text)) {
            let dateValue: Date = this.createDateObj(text);
            let value: Date = this.valueWithMinutes;
            let status: boolean = !isNullOrUndefined(value);
            if (this.checkDateValue(dateValue)) {
                let date: number = status ? value.getDate() : DAY;
                let month: number = status ? value.getMonth() : MONTH;
                let year: number = status ? value.getFullYear() : YEAR;
                let hour: number = status ? value.getHours() : HOUR;
                let minute: number = status ? value.getMinutes() : MINUTE;
                let second: number = status ? value.getSeconds() : SECOND;
                let millisecond: number = status ? value.getMilliseconds() : MILLISECOND;
                return new Date(year, month, date, hour, minute, second, millisecond);
            }
        }
        return null;
    }
    protected findNextTimeElement(event: KeyboardEventArgs): void {
        let textVal: string = (this.inputElement).value;
        let value: Date = isNullOrUndefined(this.valueWithMinutes) ? this.createDateObj(textVal) :
            this.getDateObject(this.valueWithMinutes);
        let dateTimeVal: number = null;
        let listCount: number = this.liCollections.length;
        if (!isNullOrUndefined(this.checkDateValue(value)) || !isNullOrUndefined(this.activeIndex)) {
            if (event.action === 'home') {
                dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[0])));
                this.activeIndex = 0;
            } else if (event.action === 'end') {
                dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[this.timeCollections.length - 1])));
                this.activeIndex = this.timeCollections.length - 1;
            } else {
                if (event.action === 'down') {
                    for (let i: number = 0; i < listCount; i++) {
                        if (+value < this.timeCollections[i]) {
                            dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[i])));
                            this.activeIndex = i;
                            break;
                        }
                    }
                } else {
                    for (let i: number = listCount - 1; i >= 0; i--) {
                        if (+value > this.timeCollections[i]) {
                            dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[i])));
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
        let time: Date;
        let val: string | Date = this.validateMinMaxRange(value);
        let newval: Date = this.createDateObj(val);
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
        let dateString: string = this.globalize.formatDate(time, {
            format: !isNullOrUndefined(this.format) ? this.format : this.cldrDateTimeFormat(), type: 'dateTime', skeleton: 'yMd'
        });
        if (!this.strictMode && isNullOrUndefined(time)) {
            Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
        } else {
            Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        return time;
    }
    protected timeElementValue(value: Date): Date {
        if (!isNullOrUndefined(this.checkDateValue(value)) && !this.isNullOrEmpty(value)) {
            let date: Date = value instanceof Date ? value : this.getDateObject(value);
            return this.setTimeValue(date, value);
        }
        return null;
    }
    protected timeKeyHandler(event: KeyboardEventArgs): void {
        if (isNullOrUndefined(this.step) || this.step <= 0) { return; }
        let listCount: number = this.timeCollections.length;
        if (isNullOrUndefined(this.getTimeActiveElement()) || this.getTimeActiveElement().length === 0) {
            if (this.liCollections.length > 0) {
                if (isNullOrUndefined(this.value) && isNullOrUndefined(this.activeIndex)) {
                    this.activeIndex = 0;
                    this.selectedElement = this.liCollections[0];
                    this.timeElementValue(new Date(this.timeCollections[0]));
                } else { this.findNextTimeElement(event); }
            }
        } else {
            let nextItemValue: number;
            if ((event.keyCode >= 37) && (event.keyCode <= 40)) {
                let index: number = (event.keyCode === 40 || event.keyCode === 39) ? ++this.activeIndex : --this.activeIndex;
                this.activeIndex = index = this.activeIndex === (listCount) ? 0 : this.activeIndex;
                this.activeIndex = index = this.activeIndex < 0 ? (listCount - 1) : this.activeIndex;
                nextItemValue = isNullOrUndefined(this.timeCollections[index]) ? this.timeCollections[0] : this.timeCollections[index];
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
        if (this.isTimePopupOpen() && this.selectedElement !== null && (!event || event.type !== 'click')) { this.setTimeScrollPosition(); }
    }
    protected TimeKeyActionHandle(event: KeyboardEventArgs): void {
        if (this.enabled) {
            if (event.action !== 'right' && event.action !== 'left' && event.action !== 'tab') { event.preventDefault(); }
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
    public onPropertyChanged(newProp: DateTimePickerModel, oldProp: DateTimePickerModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'value':
                    let options: object = { format: this.cldrDateTimeFormat(), type: 'dateTime', skeleton: 'yMd' };
                    if (typeof newProp.value === 'string') {
                        this.setProperties({ value: this.checkDateValue(new Date('' + newProp.value)) }, true);
                        newProp.value = this.checkDateValue(new Date('' + newProp.value));
                    }
                    newProp.value = this.validateValue(newProp.value);
                    Input.setValue(this.getFormattedValue(newProp.value), this.inputElement, this.floatLabelType, this.showClearButton);
                    this.valueWithMinutes = newProp.value;
                    this.setProperties({ value: newProp.value }, true);
                    this.previousDateTime = new Date(this.inputElement.value);
                    this.updateInput();
                    this.changeTrigger(null);
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
                    Input.setCssClass(newProp.cssClass, [this.inputWrapper.container]);
                    if (this.dateTimeWrapper) {
                        this.dateTimeWrapper.className += ' ' + newProp.cssClass;
                    }
                    break;
                case 'locale':
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    Input.setPlaceholder(this.l10n.getConstant('placeholder'), this.inputElement);
                    this.dateTimeFormat = this.cldrDateTimeFormat();
                    super.updateInput();
                    break;
                case 'format':
                    this.setProperties({ format: newProp.format }, true);
                    this.setValue();
                    break;
                case 'placeholder':
                    Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    this.inputElement.setAttribute('aria-placeholder', newProp.placeholder);
                    break;
                case 'enabled':
                    Input.setEnabled(this.enabled, this.inputElement);
                    this.bindEvents();
                    break;
                case 'strictMode':
                    this.updateInput();
                    break;
                case 'width':
                    this.setWidth(newProp.width);
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
                default:
                    super.onPropertyChanged(newProp, oldProp);
                    break;
            }
            this.hide(null);
        }
    }
    /**
     * To get component name.
     * @private
     */
    protected getModuleName(): string {
        return 'datetimepicker';
    }
}
