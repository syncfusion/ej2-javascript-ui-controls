import { Component, Event, Property, EmitType, NotifyPropertyChanges, INotifyPropertyChanged, BaseEventArgs } from '@syncfusion/ej2-base';
import { isNullOrUndefined, formatUnit, getValue, setValue, attributes, addClass, detach, createElement } from '@syncfusion/ej2-base';
import { removeClass , Browser} from '@syncfusion/ej2-base';
import { Input, InputObject, FloatLabelType } from '../../input/input';
import { regularExpressions, createMask, applyMask, wireEvents, unwireEvents, unstrippedValue, strippedValue } from '../base/index';
import { setMaskValue, MaskUndo, setElementValue, bindClearEvent } from '../base/index';
import { MaskedTextBoxModel } from './maskedtextbox-model';
import { maskInputBlurHandler } from '../base/mask-base';

const ROOT: string = 'e-widget e-control-wrapper e-mask';
const INPUT: string = 'e-input';
const COMPONENT: string = 'e-maskedtextbox';
const CONTROL: string = 'e-control';

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
    private inputObj: InputObject;
    private undoCollec: MaskUndo[];
    private redoCollec: MaskUndo[];
    private changeEventArgs: MaskChangeEventArgs;
    private focusEventArgs: MaskFocusEventArgs;
    private maskKeyPress: boolean;
    private angularTagName: string;
    private prevValue: string;
    private isFocus: boolean;
    private isInitial: boolean;
    private isIosInvalid: boolean;
    private preEleVal: string;

    /**
     * Gets or sets the CSS classes to root element of the MaskedTextBox which helps to customize the
     * complete UI styles for the MaskedTextBox component.
     * @default null
     */
    @Property(null)
    public cssClass: string;

    /**
     * Sets the width of the MaskedTextBox.
     * @default null
     */
    @Property(null)
    public width: number | string;

    /**
     * Gets or sets the string shown as a hint/placeholder when the MaskedTextBox is empty.
     * It acts as a label and floats above the MaskedTextBox based on the
     * <b><a href="#floatlabeltype-string" target="_blank">floatLabelType.</a></b>
     * @default null
     */
    @Property(null)
    public placeholder: string;

    /**
     * The <b><a href="#placeholder-string" target="_blank">placeholder</a></b> acts as a label
     * and floats above the MaskedTextBox based on the below values.
     * Possible values are:
     * * Never - The floating label will not be enable when the placeholder is available.
     * * Always - The floating label always floats above the MaskedTextBox.
     * * Auto - The floating label floats above the MaskedTextBox after focusing it or when enters the value in it.
     * @default Never
     */
    @Property('Never')
    public floatLabelType: FloatLabelType;

    /**
     * Sets a value that enables or disables the MaskedTextBox component.
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Specifies whether to show or hide the clear icon.
     * @default false
     */
    @Property(false)
    public showClearButton: boolean;

    /**
     * Sets a value that enables or disables the persisting state of the MaskedTextBox after reloading the page.
     * If enabled, the 'value' state will be persisted.
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Sets a value that enables or disables the RTL mode on the MaskedTextBox. If it is true, 
     * MaskedTextBox will display the content in the right to left direction.
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;

    /**
     * Sets a value that masks the MaskedTextBox to allow/validate the user input.
     * * Mask allows <b><a href="../maskedtextbox/mask-configuration.html#standard-mask-elements" target="_blank">standard mask elements
     * </a></b>, <b><a href="../maskedtextbox/mask-configuration.html#custom-characters" target="_blank">custom characters</a></b> and
     * <b><a href="../maskedtextbox/mask-configuration.html#regular-expression" target="_blank">regular expression</a></b> as mask elements.
     * For more information on mask, refer to
     * [mask](./mask-configuration.html#standard-mask-elements).
     * * If the mask value is empty, the MaskedTextBox will behave as an input element with text type.
     * @default null
     */
    @Property(null)
    public mask: string;

    /**
     * Gets or sets a value that will be shown as a prompting symbol for the masked value.
     * The symbol used to show input positions in the MaskedTextBox.
     * For more information on prompt-character, refer to
     * [prompt-character](./mask-configuration.html#prompt-character).
     * @default _
     */
    @Property('_')
    public promptChar: string;

    /**
     * Gets or sets the value of the MaskedTextBox. It is a raw value of the MaskedTextBox excluding literals
     * and prompt characters. By using `getMaskedValue` property, you can get the value of MaskedTextBox with the masked format.
     * ```html
     * <input id="mask" type="text" />
     * ```
     * ```typescript
     * <script>
     * var maskObj = new MaskedTextBox({ mask: "(999) 9999-999", value: "8674321756" });
     * maskObj.appendTo('#mask');
     * </script>
     * ```
     * @default null
     */
    @Property(null)
    public value: string;

    /**
     * Sets the collection of values to be mapped for non-mask elements(literals)
     * which have been set in the mask of MaskedTextBox.
     * * In the below example, non-mask elements "P" accepts values
     * "P" , "A" , "p" , "a" and "M" accepts values "M", "m" mentioned in the custom characters collection.
     * ```html
     * <input id="mask" type="text" />
     * ```
     * ```typescript
     * <script>
     * var customChar = { P: 'P,A,p,a', M: 'M,m'};
     * var maskObj = new MaskedTextBox({ mask: "99 : 99 PM", customCharacters: customChar });
     * maskObj.appendTo('#mask');
     * </script>
     * ```
     * For more information on customCharacters, refer to
     * [customCharacters](./mask-configuration.html#custom-characters).
     * @default null
     */
    @Property(null)
    public customCharacters: { [x: string]: Object };

    /**
     * Triggers when the MaskedTextBox component is created.
     * @event
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the MaskedTextBox component is destroyed.
     * @event
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers when the value of the MaskedTextBox changes.
     * @event
     */
    @Event()
    public change: EmitType <MaskChangeEventArgs>;
    /**
     * Triggers when the MaskedTextBox while got focus in.
     * @event
     */
    @Event()
    public focus: EmitType<MaskFocusEventArgs>;

    constructor(options?: MaskedTextBoxModel, element?: string | HTMLElement | HTMLInputElement) {
        super(options, <HTMLInputElement | string>element);
    }

    /**
     * Gets the component name
     * @private
     */
    protected getModuleName(): string {
        return 'maskedtextbox';
    }

    /**
     * Initializes the event handler
     * @private
     */
    protected preRender(): void {
        this.promptMask = '';
        this.hiddenMask = '';
        this.escapeMaskValue = '';
        this.regExpCollec = regularExpressions;
        this.customRegExpCollec = [];
        this.undoCollec = [];
        this.redoCollec = [];
        this.changeEventArgs = {};
        this.focusEventArgs = {};
        this.maskKeyPress = false;
        this.isFocus = false;
        this.isInitial = false;
        this.isIosInvalid = false;
        let ejInstance: Object = getValue('ej2_instances', this.element);
        this.cloneElement = <HTMLElement>this.element.cloneNode(true);
        removeClass([this.cloneElement], [CONTROL, COMPONENT]);
        this.angularTagName = null;
        if (this.element.tagName === 'EJS-MASKEDTEXTBOX') {
            this.angularTagName = this.element.tagName;
            let input: HTMLElement = this.createElement('input');
            for (let i: number = 0; i < this.element.attributes.length; i++) {
                input.setAttribute(this.element.attributes[i].nodeName, this.element.attributes[i].nodeValue);
                input.innerHTML = this.element.innerHTML;
            }
            if (this.element.hasAttribute('id')) {
                this.element.removeAttribute('id');
            }
            this.element.classList.remove('e-control', 'e-maskedtextbox');
            this.element.classList.add('e-mask-container');
            this.element.appendChild(input);
            this.element = <HTMLInputElement>input;
            setValue('ej2_instances', ejInstance, this.element);
        }
    }

    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['value'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Initializes the component rendering.
     * @private
     */
    public render(): void {
        if (this.element.tagName.toLowerCase() === 'input') {
            if (this.floatLabelType === 'Never') {
                addClass([this.element], INPUT);
            }
            this.createWrapper();
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
        }
    }

    private resetMaskedTextBox(): void {
        this.promptMask = '';
        this.hiddenMask = '';
        this.escapeMaskValue = '';
        this.customRegExpCollec = [];
        this.undoCollec = [];
        this.redoCollec = [];
        if (this.promptChar.length > 1) {
            this.promptChar = this.promptChar[0];
        }
        createMask.call(this);
        applyMask.call(this);
        if (this.mask === null || this.mask === '' && this.value !== undefined ) {
            setElementValue.call(this, this.value);
        }
        let val: string = strippedValue.call(this, this.element);
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
            if (this.element.value === this.promptMask && setVal && this.floatLabelType !== 'Always') {
                setElementValue.call(this, '');
            }
            if (this.floatLabelType === 'Never') { maskInputBlurHandler.call(this); }
        }
    }

    private setCssClass(cssClass: string, element: Element[] | NodeList): void {
        if (cssClass) {
            addClass(element, cssClass);
        }
    }

    private setWidth(width: string | number): void {
        if (!isNullOrUndefined(width)) {
            this.element.style.width = formatUnit(width);
            this.inputObj.container.style.width = formatUnit(width);
        }
    }

    private createWrapper(): void {
        this.inputObj = Input.createInput(
            {
                element: this.element,
                floatLabelType: this.floatLabelType,
                properties: {
                    enableRtl: this.enableRtl,
                    cssClass: this.cssClass,
                    enabled: this.enabled,
                    placeholder: this.placeholder,
                    showClearButton: this.showClearButton
                }
            },
            this.createElement);
        this.inputObj.container.setAttribute('class', ROOT + ' ' + this.inputObj.container.getAttribute('class'));
    }

    /**
     * Calls internally if any of the property value is changed.
     * @hidden
     */
    public onPropertyChanged(newProp: MaskedTextBoxModel, oldProp: MaskedTextBoxModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'value':
                    setMaskValue.call(this, this.value);
                    if (this.placeholder) {
                        this.setMaskPlaceholder(false, false);
                    }
                    break;
                case 'placeholder':
                    this.setMaskPlaceholder(true, true);
                    break;
                case 'width':
                    this.setWidth(newProp.width);
                    break;
                case 'cssClass':
                    this.setCssClass(newProp.cssClass, [this.inputObj.container]);
                    break;
                case 'enabled':
                    Input.setEnabled(newProp.enabled, this.element);
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
                case 'mask':
                    let strippedValue: string = this.value;
                    this.mask = newProp.mask;
                    this.updateValue(strippedValue);
                    break;
                case 'promptChar':
                    if (newProp.promptChar.length > 1) {
                        newProp.promptChar = newProp.promptChar[0];
                    }
                    if (newProp.promptChar) {
                        this.promptChar = newProp.promptChar;
                    } else {
                        this.promptChar = '_';
                    }
                    let value: string = this.element.value.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                    if (this.promptMask === this.element.value) {
                        value = this.promptMask.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                    }
                    this.promptMask = this.promptMask.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                    this.undoCollec = this.redoCollec = [];
                    setElementValue.call(this, value);
                    break;
            }
        }
    }

    private updateValue(strippedVal: string): void {
        this.resetMaskedTextBox();
        setMaskValue.call(this, strippedVal);
    }

    /**
     * Gets the value of the MaskedTextBox with the masked format.
     * By using `value` property, you can get the raw value of maskedtextbox without literals and prompt characters.
     * @return {string}
     */
    public getMaskedValue(): string {
        return unstrippedValue.call(this, this.element);
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        unwireEvents.call(this);
        this.inputObj.container.parentElement.appendChild(this.cloneElement);
        detach(this.inputObj.container);
        super.destroy();
    }
}

export interface MaskChangeEventArgs extends BaseEventArgs {
    /** Returns the value of the MaskedTextBox with the masked format. */
    maskedValue?: string;
    /** Returns the raw value of MaskedTextBox by removing the prompt characters and literals(non-mask elements)
     * which have been set in the mask of MaskedTextBox.
     */
    value?: string;
    /** Returns true when the value of MaskedTextBox is changed by user interaction. Otherwise, it returns false */
    isInteraction?: boolean;
    /** Returns the original event arguments. */
    event?: Event;
}

export interface MaskFocusEventArgs extends BaseEventArgs {
    /** Returns selectionStart value as zero by default */
    selectionStart?: number;
    /** Returns selectionEnd value depends on mask length */
    selectionEnd?: number;
}

