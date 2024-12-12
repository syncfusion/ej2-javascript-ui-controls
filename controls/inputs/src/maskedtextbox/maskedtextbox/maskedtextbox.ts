import { Component, Event, Property, EmitType, NotifyPropertyChanges, INotifyPropertyChanged, BaseEventArgs } from '@syncfusion/ej2-base';
import { isNullOrUndefined, formatUnit, getValue, setValue, addClass, detach } from '@syncfusion/ej2-base';
import { removeClass , Browser, closest} from '@syncfusion/ej2-base';
import { Input, InputObject, FloatLabelType } from '../../input/input';
import { regularExpressions, createMask, applyMask, wireEvents, unwireEvents, unstrippedValue, strippedValue } from '../base/index';
import { setMaskValue, MaskUndo, setElementValue, bindClearEvent } from '../base/index';
import { MaskedTextBoxModel } from './maskedtextbox-model';

const ROOT: string = 'e-control-wrapper e-mask';
const INPUT: string = 'e-input';
const COMPONENT: string = 'e-maskedtextbox';
const CONTROL: string = 'e-control';
const MASKINPUT_FOCUS: string = 'e-input-focus';
const wrapperAttr: string[] = ['title', 'style', 'class'];

/**
 * The MaskedTextBox allows the user to enter the valid input only based on the provided mask.
 * ```html
 * <input id="mask" type="text" />
 * ```
 * ```typescript
 * <script>
 * var maskObj = new MaskedTextBox({ mask: "(999) 9999-999" });
 * maskObj.appendTo('#mask');
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class MaskedTextBox extends Component<HTMLInputElement> implements INotifyPropertyChanged {

    /* Internal variables */
    private cloneElement: HTMLElement;
    private promptMask: string;
    private hiddenMask: string;
    private escapeMaskValue: string;
    private regExpCollec: { [key: string]: string };
    private customRegExpCollec: string[];
    private maskedRegExp: string[];
    private inputObj: InputObject;
    private undoCollec: MaskUndo[];
    private redoCollec: MaskUndo[];
    private changeEventArgs: MaskChangeEventArgs;
    private focusEventArgs: MaskFocusEventArgs;
    private blurEventArgs: MaskBlurEventArgs;
    private maskKeyPress: boolean;
    private angularTagName: string;
    private prevValue: string;
    private isFocus: boolean;
    private isInitial: boolean;
    private isIosInvalid: boolean;
    private preEleVal: string;
    private formElement: HTMLElement;
    private initInputValue: string = '';
    private maskOptions: MaskedTextBoxModel;
    private preventChange: boolean = false;
    private isClicked: boolean = false;
    private clearButton: HTMLElement;

    /**
     * Gets or sets the CSS classes to root element of the MaskedTextBox which helps to customize the
     * complete UI styles for the MaskedTextBox component.
     *
     * @default null
     */
    @Property(null)
    public cssClass: string;

    /**
     * Sets the width of the MaskedTextBox.
     *
     * @default null
     */
    @Property(null)
    public width: number | string;

    /**
     * Gets or sets the string shown as a hint/placeholder when the MaskedTextBox is empty.
     * It acts as a label and floats above the MaskedTextBox based on the
     * <b><a href="#floatlabeltype" target="_blank">floatLabelType.</a></b>
     *
     * @default null
     */
    @Property(null)
    public placeholder: string;

    /**
     * The <b><a href="#placeholder" target="_blank">placeholder</a></b> acts as a label
     * and floats above the MaskedTextBox based on the below values.
     * Possible values are:
     * * Never - The floating label will not be enable when the placeholder is available.
     * * Always - The floating label always floats above the MaskedTextBox.
     * * Auto - The floating label floats above the MaskedTextBox after focusing it or when enters the value in it.
     *
     * @default Never
     */
    @Property('Never')
    public floatLabelType: FloatLabelType;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * {% codeBlock src='maskedtextbox/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };

    /**
     * Sets a value that enables or disables the MaskedTextBox component.
     *
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Specifies the boolean value whether the Masked TextBox allows the user to change the text.
     *
     * @default false
     */
    @Property(false)
    public readonly: boolean;

    /**
     * Specifies whether to show or hide the clear icon.
     *
     * @default false
     */
    @Property(false)
    public showClearButton: boolean;

    /**
     * Sets a value that enables or disables the persisting state of the MaskedTextBox after reloading the page.
     * If enabled, the 'value' state will be persisted.
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Sets a value that masks the MaskedTextBox to allow/validate the user input.
     * * Mask allows [`standard mask elements`](../../maskedtextbox/mask-configuration/#standard-mask-elements)
     * </b>, <b>[`custom characters`](../../maskedtextbox/mask-configuration/#custom-characters)</b> and
     * <b>[`regular expression`](../../maskedtextbox/mask-configuration/#regular-expression)</b> as mask
     * elements.
     * For more information on mask, refer to
     * [mask](../../maskedtextbox/mask-configuration/#standard-mask-elements).
     * * If the mask value is empty, the MaskedTextBox will behave as an input element with text type.
     *
     * {% codeBlock src='maskedtextbox/mask/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public mask: string;

    /**
     * Gets or sets a value that will be shown as a prompting symbol for the masked value.
     * The symbol used to show input positions in the MaskedTextBox.
     * For more information on prompt-character, refer to
     * [prompt-character](../../maskedtextbox/mask-configuration/#prompt-character).
     *
     * @default '_'
     */
    @Property('_')
    public promptChar: string;

    /**
     * Gets or sets the value of the MaskedTextBox. It is a raw value of the MaskedTextBox excluding literals
     * and prompt characters. By using `getMaskedValue` property, you can get the value of MaskedTextBox with the masked format.
     * {% codeBlock src='maskedtextbox/value/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public value: string;

    /**
     * Sets the collection of values to be mapped for non-mask elements(literals)
     * which have been set in the mask of MaskedTextBox.
     * In the below example, non-mask elements "P" accepts values
     * "P" , "A" , "p" , "a" and "M" accepts values "M", "m" mentioned in the custom characters collection.
     * > For more information on customCharacters, refer to
     * [customCharacters](../../maskedtextbox/mask-configuration/#custom-characters).
     * {% codeBlock src='maskedtextbox/customCharacters/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public customCharacters: { [x: string]: Object };

    /**
     * Triggers when the MaskedTextBox component is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the MaskedTextBox component is destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers when the value of the MaskedTextBox changes.
     *
     * @event change
     */
    @Event()
    public change: EmitType <MaskChangeEventArgs>;
    /**
     * Triggers when the MaskedTextBox got focus in.
     *
     * @event focus
     */
    @Event()
    public focus: EmitType<MaskFocusEventArgs>;
    /**
     * Triggers when the MaskedTextBox got focus out.
     *
     * @event blur
     */
    @Event()
    public blur: EmitType<MaskBlurEventArgs>;

    /**
     *
     * @param {MaskedTextBoxModel} options - Specifies the MaskedTextBox model.
     * @param {string | HTMLElement | HTMLInputElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: MaskedTextBoxModel, element?: string | HTMLElement | HTMLInputElement) {
        super(options, <HTMLInputElement | string>element);
        this.maskOptions = options;
    }

    /**
     * Gets the component name.
     *
     * @returns {string} Returns the component name.
     * @private
     */
    protected getModuleName(): string {
        return 'maskedtextbox';
    }

    /**
     * Initializes the event handler
     *
     * @returns {void}
     * @private
     */
    protected preRender(): void {
        this.promptMask = '';
        this.hiddenMask = '';
        this.escapeMaskValue = '';
        this.regExpCollec = regularExpressions;
        this.customRegExpCollec = [];
        this.maskedRegExp = [];
        this.undoCollec = [];
        this.redoCollec = [];
        this.changeEventArgs = {};
        this.focusEventArgs = {};
        this.blurEventArgs = {};
        this.maskKeyPress = false;
        this.isFocus = false;
        this.isInitial = false;
        this.isIosInvalid = false;
        const ejInstance: Object = getValue('ej2_instances', this.element);
        this.cloneElement = <HTMLElement>this.element.cloneNode(true);
        removeClass([this.cloneElement], [CONTROL, COMPONENT, 'e-lib']);
        this.angularTagName = null;
        this.formElement = <HTMLFormElement>closest(this.element, 'form');
        if (this.element.tagName === 'EJS-MASKEDTEXTBOX') {
            this.angularTagName = this.element.tagName;
            const input: HTMLElement = this.createElement('input');
            for (let i: number = 0; i < this.element.attributes.length; i++) {
                input.setAttribute(this.element.attributes[i as number].nodeName, this.element.attributes[i as number].nodeValue);
                input.innerHTML = this.element.innerHTML;
            }
            if (this.element.hasAttribute('id')) {
                this.element.removeAttribute('id');
            }
            if (this.element.hasAttribute('name')) {
                this.element.removeAttribute('name');
            }
            this.element.classList.remove('e-control', 'e-maskedtextbox');
            this.element.classList.add('e-mask-container');
            this.element.appendChild(input);
            this.element = <HTMLInputElement>input;
            setValue('ej2_instances', ejInstance, this.element);
        }
        this.updateHTMLAttrToElement();
        this.checkHtmlAttributes(false);
        if (this.formElement) {
            this.initInputValue = this.value;
        }
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Gets the properties to be maintained in the persisted state.
     *
     * @returns {string}
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['value'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Initializes the component rendering.
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        if (this.element.tagName.toLowerCase() === 'input') {
            if (this.floatLabelType === 'Never') {
                addClass([this.element], INPUT);
            }
            this.createWrapper();
            this.updateHTMLAttrToWrapper();
            if (this.element.name === '') {
                this.element.setAttribute('name', this.element.id);
            }
            this.isInitial = true;
            this.resetMaskedTextBox();
            this.isInitial = false;
            this.setMaskPlaceholder(true, false);
            this.setWidth(this.width);
            this.preEleVal = this.element.value;
            if (!Browser.isDevice && (Browser.info.version === '11.0' || Browser.info.name === 'edge')) {
                this.element.blur();
            }
            if (Browser.isDevice && Browser.isIos) {
                this.element.blur();
            }
            if (this.element.getAttribute('value') || this.value) {
                this.element.setAttribute('value', this.element.value);
            }
            if (!isNullOrUndefined(closest(this.element, 'fieldset') as HTMLFieldSetElement) && (closest(this.element, 'fieldset') as HTMLFieldSetElement).disabled) {
                this.enabled = false;
            }
            if (!this.element.hasAttribute('aria-labelledby') && !this.element.hasAttribute('placeholder') && !this.element.hasAttribute('aria-label')) {
                this.element.setAttribute('aria-label', 'maskedtextbox');
            }
            this.renderComplete();
        }
    }
    private updateHTMLAttrToElement(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (const key of Object.keys(this.htmlAttributes)) {
                if (wrapperAttr.indexOf(key) < 0 ) {
                    this.element.setAttribute(key, this.htmlAttributes[`${key}`]);
                }
            }
        }
    }
    private updateCssClass(newClass : string, oldClass : string) : void {
        Input.setCssClass(this.getValidClassList(newClass), [this.inputObj.container], this.getValidClassList(oldClass));
    }
    private getValidClassList(maskClassName: string): string {
        let result: string = maskClassName;
        if (!isNullOrUndefined(maskClassName) && maskClassName !== '') {
            result = (maskClassName.replace(/\s+/g, ' ')).trim();
        }
        return result;
    }
    private updateHTMLAttrToWrapper(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (const key of Object.keys(this.htmlAttributes)) {
                if (wrapperAttr.indexOf(key) > -1 ) {
                    if (key === 'class') {
                        const updatedClassValues : string = (this.htmlAttributes[`${key}`].replace(/\s+/g, ' ')).trim();
                        if (updatedClassValues !== '') {
                            addClass([this.inputObj.container], updatedClassValues.split(' '));
                        }
                    } else if (key === 'style') {
                        let maskStyle: string = this.inputObj.container.getAttribute(key);
                        maskStyle = !isNullOrUndefined(maskStyle) ? (maskStyle + this.htmlAttributes[`${key}`]) :
                            this.htmlAttributes[`${key}`];
                        this.inputObj.container.setAttribute(key, maskStyle);
                    } else {
                        this.inputObj.container.setAttribute(key, this.htmlAttributes[`${key}`]);
                    }
                }
            }
        }
    }

    private resetMaskedTextBox(): void {
        this.promptMask = '';
        this.hiddenMask = '';
        this.escapeMaskValue = '';
        this.customRegExpCollec = [];
        this.undoCollec = [];
        this.redoCollec = [];
        if (this.promptChar && this.promptChar.length > 1) {
            this.promptChar = this.promptChar[0];
        }
        createMask.call(this);
        applyMask.call(this);
        if (this.mask === null || this.mask === '' && this.value !== undefined ) {
            setElementValue.call(this, this.value);
        }
        const val: string = strippedValue.call(this, this.element);
        this.prevValue = val;
        this.value = val;
        if (!this.isInitial) {
            unwireEvents.call(this);
        }
        wireEvents.call(this);
    }

    private setMaskPlaceholder(setVal: boolean, dynamicPlaceholder: boolean): void {
        if (dynamicPlaceholder || this.placeholder) {
            Input.setPlaceholder(this.placeholder, this.element);
            if ((this.element.value === this.promptMask && setVal && this.floatLabelType !== 'Always') ||
                this.element.value === this.promptMask && this.floatLabelType === 'Never') {
                setElementValue.call(this, '');
            }
        }
    }

    private setWidth(width: string | number): void {
        if (!isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.inputObj.container.style.width = formatUnit(width);
                this.element.style.width = formatUnit(width);
            } else if (typeof width === 'string') {
                const elementWidth: string = (width.match(/px|%|em/)) ? <string>(width) : <string>(formatUnit(width));
                this.inputObj.container.style.width = elementWidth;
                this.element.style.width = elementWidth;
            }
        }
    }
    private checkHtmlAttributes(isDynamic: boolean): void {
        const attributes: string[] = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes)
            : ['placeholder', 'disabled', 'value', 'readonly'];
        for (const key of attributes) {
            if (!isNullOrUndefined(this.element.getAttribute(key))) {
                switch (key) {
                case 'placeholder':
                    if (( isNullOrUndefined(this.maskOptions) || (this.maskOptions['placeholder'] === undefined)) || isDynamic) {
                        this.setProperties({placeholder: this.element.placeholder}, !isDynamic);
                    }
                    break;
                case 'disabled':
                    if (( isNullOrUndefined(this.maskOptions) || (this.maskOptions['enabled'] === undefined)) || isDynamic) {
                        const isEnabled: boolean = this.element.getAttribute(key) === 'disabled' || this.element.getAttribute(key) === '' ||
                                this.element.getAttribute(key) === 'true' ? false : true;
                        this.setProperties({ enabled: isEnabled }, !isDynamic);
                    }
                    break;
                case 'value':
                    if (( isNullOrUndefined(this.maskOptions) || (this.maskOptions['value'] === undefined)) || isDynamic) {
                        this.setProperties({value: this.element.value}, !isDynamic);
                    }
                    break;
                case 'readonly':
                    if (( isNullOrUndefined(this.maskOptions) || (this.maskOptions['readonly'] === undefined)) || isDynamic) {
                        const isReadonly: boolean = this.element.getAttribute(key) === 'readonly' || this.element.getAttribute(key) === ''
                                || this.element.getAttribute(key) === 'true' ? true : false;
                        this.setProperties({readonly: isReadonly}, !isDynamic);
                    }
                    break;
                }
            }
        }
    }

    private createWrapper(): void {
        let updatedCssClassValues: string = this.cssClass;
        if (!isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            updatedCssClassValues = this.getValidClassList(this.cssClass);
        }
        this.inputObj = Input.createInput(
            {
                element: this.element,
                floatLabelType: this.floatLabelType,
                properties: {
                    enableRtl: this.enableRtl,
                    cssClass: updatedCssClassValues,
                    enabled: this.enabled,
                    readonly: this.readonly,
                    placeholder: this.placeholder,
                    showClearButton: this.showClearButton
                }
            },
            this.createElement);
        this.inputObj.container.setAttribute('class', ROOT + ' ' + this.inputObj.container.getAttribute('class'));
    }

    /**
     * Calls internally if any of the property value is changed.
     *
     * @param {MaskedTextBoxModel} newProp - Returns the dynamic property value of the component.
     * @param {MaskedTextBoxModel} oldProp - Returns the previous property value of the component.
     * @returns {void}
     * @hidden
     */
    public onPropertyChanged(newProp: MaskedTextBoxModel, oldProp: MaskedTextBoxModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'value':
                setMaskValue.call(this, this.value);
                if (this.placeholder && !this.isFocus) {
                    this.setMaskPlaceholder(false, false);
                }
                if (this.value === '' && oldProp.value != null) {
                    this.element.selectionStart = 0;
                    this.element.selectionEnd = 0;
                }
                break;
            case 'placeholder':
                this.setMaskPlaceholder(true, true);
                break;
            case 'width':
                this.setWidth(newProp.width);
                Input.calculateWidth(this.element, this.inputObj.container);
                break;
            case 'cssClass':
                this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                break;
            case 'enabled':
                Input.setEnabled(newProp.enabled, this.element, this.floatLabelType, this.inputObj.container);
                break;
            case 'readonly':
                Input.setReadonly(newProp.readonly, this.element);
                break;
            case 'enableRtl':
                Input.setEnableRtl(newProp.enableRtl, [this.inputObj.container]);
                break;
            case 'customCharacters':
                this.customCharacters = newProp.customCharacters;
                this.resetMaskedTextBox();
                break;
            case 'showClearButton':
                Input.setClearButton(newProp.showClearButton, this.element, this.inputObj, undefined, this.createElement);
                bindClearEvent.call(this);
                break;
            case 'floatLabelType':
                this.floatLabelType = newProp.floatLabelType;
                Input.removeFloating(this.inputObj);
                Input.addFloating(this.element, this.floatLabelType, this.placeholder, this.createElement);
                break;
            case 'htmlAttributes':
                this.updateHTMLAttrToElement();
                this.updateHTMLAttrToWrapper();
                this.checkHtmlAttributes(true);
                break;
            case 'mask': {
                const strippedValue: string = this.value;
                this.mask = newProp.mask;
                this.maskedRegExp = [];
                this.updateValue(strippedValue);
            }
                break;
            case 'promptChar': {
                if (newProp.promptChar.length > 1) {
                    newProp.promptChar = newProp.promptChar[0];
                }
                if (newProp.promptChar) {
                    this.promptChar = newProp.promptChar;
                } else {
                    this.promptChar = '_';
                }
                /* eslint-disable-next-line security/detect-non-literal-regexp */
                let value: string = this.element.value.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                if (this.promptMask === this.element.value) {
                /* eslint-disable-next-line security/detect-non-literal-regexp */
                    value = this.promptMask.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                }
                /* eslint-disable-next-line security/detect-non-literal-regexp */
                this.promptMask = this.promptMask.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                this.undoCollec = this.redoCollec = [];
                setElementValue.call(this, value);
                break;
            }
            }
        }
        this.preventChange = this.isAngular && this.preventChange ? !this.preventChange : this.preventChange;
    }

    private updateValue(strippedVal: string): void {
        this.resetMaskedTextBox();
        setMaskValue.call(this, strippedVal);
    }

    /**
     * Gets the value of the MaskedTextBox with the masked format.
     * By using `value` property, you can get the raw value of maskedtextbox without literals and prompt characters.
     *
     * @returns {string} Returns the value with the masked format.
     */
    public getMaskedValue(): string {
        return unstrippedValue.call(this, this.element);
    }

    /**
     * Sets the focus to widget for interaction.
     *
     * @returns {void}
     */
    public focusIn(): void {
        if (document.activeElement !== this.element && this.enabled) {
            this.isFocus = true;
            this.element.focus();
            addClass([this.inputObj.container], [MASKINPUT_FOCUS]);
        }
    }

    /**
     * Remove the focus from widget, if the widget is in focus state.
     *
     * @returns {void}
     */
    public focusOut(): void {
        if (document.activeElement === this.element && this.enabled) {
            this.isFocus = false;
            this.element.blur();
            removeClass([this.inputObj.container], [MASKINPUT_FOCUS]);
        }
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     *
     * @method destroy
     * @returns {void}
     */
    public destroy(): void {
        unwireEvents.call(this);
        if (this.showClearButton) {
            this.clearButton = document.getElementsByClassName('e-clear-icon')[0] as HTMLElement;
        }
        const attrArray: string[] = ['aria-labelledby', 'role', 'autocomplete', 'aria-readonly',
            'aria-disabled', 'autocapitalize', 'spellcheck', 'aria-autocomplete', 'aria-live', 'aria-invalid'];
        for (let i: number = 0; i < attrArray.length; i++) {
            this.element.removeAttribute(attrArray[i as number]);
        }
        this.element.classList.remove('e-input');
        if (this.inputObj)
        {
            this.inputObj.container.insertAdjacentElement('afterend', this.element);
            detach(this.inputObj.container);
        }
        this.blurEventArgs = null;
        Input.destroy({
            element: this.element,
            floatLabelType: this.floatLabelType,
            properties: this.properties
        }, this.clearButton);
        this.changeEventArgs = null;
        this.inputObj = null;
        super.destroy();
    }
}

export interface MaskChangeEventArgs extends BaseEventArgs {
    /** Returns the value of the MaskedTextBox with the masked format. */
    maskedValue?: string
    /** Returns the raw value of MaskedTextBox by removing the prompt characters and literals(non-mask elements)
     * which have been set in the mask of MaskedTextBox.
     */
    value?: string
    /** Returns true when the value of MaskedTextBox is changed by user interaction. Otherwise, it returns false.
     *
     * @private
     */
    isInteraction?: boolean
    /** Returns true when the value of MaskedTextBox is changed by user interaction. Otherwise, it returns false */
    isInteracted?: boolean
    /** Returns the original event arguments. */
    event?: Event
}

export interface MaskFocusEventArgs extends BaseEventArgs {
    /** Returns selectionStart value as zero by default */
    selectionStart?: number
    /** Returns selectionEnd value depends on mask length */
    selectionEnd?: number
    /** Returns the original event arguments. */
    event?: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent
    /** Returns the value of MaskedTextBox. */
    value?: string
    /** Returns the maskedValue of MaskedTextBox. */
    maskedValue?: string
    /** Returns the MaskedTextBox container element */
    container?: HTMLElement
}
export interface MaskBlurEventArgs extends BaseEventArgs {
    /** Returns the original event arguments. */
    event?: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent
    /** Returns the value of MaskedTextBox. */
    value?: string
    /** Returns the maskedValue of MaskedTextBox. */
    maskedValue?: string
    /** Returns the MaskedTextBox container element */
    container?: HTMLElement
}
