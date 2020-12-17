import { BlazorDotnetObject } from '@syncfusion/ej2-base';
import { removeClass, closest, detach, extend, Browser, EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';

const ROOT: string = 'e-inplaceeditor';
const OPEN: string = 'e-editable-open';
const DISABLE: string = 'e-disable';
const RTL: string = 'e-rtl';
const EDITABLE_VALUE_ELEMENT: string = 'e-editable-value-element';
const CLEAR_ICON: string = 'e-clear-icon';
const EDITABLE_COMPONENT: string = 'e-editable-component';
const CLS_POPUP: string = 'e-popup';

const CREATED: string = 'Created';
const CANCEL_ACTION: string = 'CancelAction';
const SAVE_ACTION: string = 'SaveAction';
const RENDER_EDITOR: string = 'RenderEditor';
const INLINE: string = 'Inline';

const KEYDOWN: string = 'keydown';
const SCROLL: string = 'scroll';
const RESIZE: string = 'resize';
const MOUSEDOWN: string = 'mousedown';

const POPUP: string = 'Popup';
const SUBMIT: string = 'Submit';
const CANCEL: string = 'Cancel';
const BUTTON: string = 'BUTTON';
const IGNORE: string = 'Ignore';
const MOUSE_DOWN: string = 'mousedown';
const TAB_KEY: string = 'Tab';
const ENTER_KEY: string = 'Enter';


class SfInPlaceEditor {

    /* Common variables */
    private element: BlazorInPlaceEditorElement;
    private dotNetRef: BlazorDotnetObject;
    private actionOnBlur: string;
    private isClearTarget: boolean;
    private mode: string;
    private type: string;
    private componentParent: HTMLElement;
    private popupElement: string;
    private popupConent: HTMLElement;
    private enablePersistence: boolean;
    private id: string;
    private value: string;
    private submitOnEnter: boolean = true;
    private clearComponents: string[] = ['AutoComplete', 'Mask', 'Text'];

    constructor(element: BlazorInPlaceEditorElement, options: { [key: string]: Object }, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.updateContext(options);
        this.element.blazor__instance = this;
    }

    public updateContext(inPlaceObj: { [key: string]: Object }): void {
        extend(this, this, inPlaceObj);
    }

    public initialize(): void {
        this.wireEvents();
        this.id = this.element.id;
        this.dotNetRef.invokeMethodAsync(CREATED, null);
    }
    private wireEvents(): void {
        EventHandler.add(this.element, KEYDOWN, this.valueKeyDownHandler, this);
        EventHandler.add(document, SCROLL, this.scrollResizeHandler, this);
        window.addEventListener(RESIZE, this.scrollResizeHandler.bind(this));
        if (Array.prototype.indexOf.call(this.clearComponents, this.type) > -1) {
            EventHandler.add(this.element, MOUSEDOWN, this.mouseDownHandler, this);
        }
    }
    private scrollResizeHandler(): void {
        if (this.mode === POPUP
            && !(Browser.isDevice)) {
            this.dotNetRef.invokeMethodAsync(CANCEL_ACTION, null);
        }
    }
    private valueKeyDownHandler(e: KeyboardEvent): void {
        if (e.code === TAB_KEY && e.shiftKey === true && (e.target as HTMLElement).tagName !== BUTTON) {
            if (this.actionOnBlur === SUBMIT) {
                this.dotNetRef.invokeMethodAsync(SAVE_ACTION, null);
            } else if (this.actionOnBlur === CANCEL) {
                this.dotNetRef.invokeMethodAsync(CANCEL_ACTION, null);
            }
        }
        if (e.code === ENTER_KEY && (e.target as Element).classList.contains(ROOT) &&
            !this.element.querySelector(EDITABLE_VALUE_ELEMENT).classList.contains(OPEN) && !this.element.classList.contains(DISABLE)) {
            e.preventDefault();
            this.dotNetRef.invokeMethodAsync(RENDER_EDITOR, null);
        }
    }
    private mouseDownHandler(e: Event): void {
        if ((<Element>e.target).classList.contains(CLEAR_ICON)) {
            this.isClearTarget = true;
        }
    }

    public openEditor(options: { [key: string]: Object }): void {
        this.updateContext(options);
        if (this.mode === 'Popup') {
            this.popupConent = document.querySelector('#' + this.popupElement + '_content');
        }
        if (this.actionOnBlur !== IGNORE) {
            EventHandler.add(document, MOUSE_DOWN, this.docClickHandler, this);
        }
        if (this.submitOnEnter) {
            let editorEle: HTMLElement = this.mode === 'Popup' ? this.popupConent : this.element;
            EventHandler.add(editorEle, 'keydown', this.enterKeyDownHandler, this);
        }
    }

    private enterKeyDownHandler(e: KeyboardEvent): void {
        if (!closest(e.target as Element, '.' + EDITABLE_COMPONENT + ' .e-richtexteditor')) {
            if ((e.keyCode === 13 && e.which === 13) && closest(e.target as Element, '.' + EDITABLE_COMPONENT)) {
                this.dotNetRef.invokeMethodAsync(SAVE_ACTION, null);
            } else if (e.keyCode === 27 && e.which === 27) {
                this.dotNetRef.invokeMethodAsync(CANCEL_ACTION, null);
            }
        }
    }

    public removeEditor(options: { [key: string]: Object }) : void {
        this.updateContext(options);
        if (this.enablePersistence) {
            window.localStorage.setItem(this.id, this.value);
        }
        this.unWireEvents();
        EventHandler.remove(document, MOUSE_DOWN, this.docClickHandler);
    }

    public Destroy(options: { [key: string]: Object }) : void {
        this.updateContext(options);
        if (this.enablePersistence) {
            window.localStorage.setItem(this.id, this.value);
        }
        if (this.mode === POPUP) {
            this.destroyPopup();
        }
        let classList: string[] = [DISABLE, RTL];
        classList.forEach((val: string): void => {
            removeClass([this.element], [val]);
        });
        while (this.element.firstElementChild) {
            this.element.removeChild(this.element.firstElementChild);
        }
    }

    private destroyPopup(): void {
        let popEle: HTMLElement = document.querySelector('#' + this.popupElement);
        if (popEle) {
            while (popEle.attributes.length > 0) {
                popEle.removeAttribute(popEle.attributes[0].name);
            }
            let splitNodes: HTMLCollection = popEle.children;
            for (let i: number = splitNodes.length - 1; i >= 0; i--) {
                detach(splitNodes[i]);
            }
        }
    }

    private unWireEvents(): void {
        EventHandler.remove(document, SCROLL, this.scrollResizeHandler);
        window.removeEventListener(RESIZE, this.scrollResizeHandler.bind(this));
        EventHandler.remove(this.element, KEYDOWN, this.valueKeyDownHandler);
        if (Array.prototype.indexOf.call(this.clearComponents, this.type) > -1) {
            EventHandler.remove(this.element, MOUSEDOWN, this.mouseDownHandler);
        }
    }
    public validate(): boolean {
        return this.element.querySelector('.validation-message') ? true : false;
    }

    private docClickHandler(e: MouseEvent): void {
        if (this.isClearTarget || closest((e.target as HTMLElement), '.' + CLS_POPUP)) {
            this.isClearTarget = false;
            return;
        }
        let ele: HTMLElement = this.mode === INLINE ? this.element.querySelector('.' + EDITABLE_COMPONENT) : this.element;
        let btnEle: HTMLElement = this.mode === INLINE ? this.element.querySelector('.e-editable-action-buttons') : this.componentParent;
        if (ele.contains(e.target as HTMLElement) || ( btnEle && btnEle.contains(e.target as HTMLElement) ||
         ( this.popupConent && this.popupConent.contains(e.target as HTMLElement)))) {
            return;
        } else {
            if (this.actionOnBlur === SUBMIT  && !this.element.querySelector('.validation-message')) {
                this.dotNetRef.invokeMethodAsync(SAVE_ACTION, null);
            } else if (this.actionOnBlur === CANCEL) {
                this.dotNetRef.invokeMethodAsync(CANCEL_ACTION, null);
            }
        }
    }
}
// tslint:disable-next-line
let InPlaceEditor: object = {
    initialize(element: BlazorInPlaceEditorElement, options: { [key: string]: Object }, dotnetRef: BlazorDotnetObject): void {
        if (!isNullOrUndefined(element)) {
            new SfInPlaceEditor(element, options, dotnetRef);
            element.blazor__instance.initialize();
        }
    },
    openEditor(element: BlazorInPlaceEditorElement, options: { [key: string]: Object }): void {
        if (!isNullOrUndefined(element)) {
            element.blazor__instance.openEditor(options);
        }
    },
    closeEditor(element: BlazorInPlaceEditorElement, options: { [key: string]: Object }): void {
        if (!isNullOrUndefined(element)) {
            element.blazor__instance.removeEditor(options);
        }
    },
    destroy(element: BlazorInPlaceEditorElement, options: { [key: string]: Object }): void {
        if (!isNullOrUndefined(element)) {
            element.blazor__instance.Destroy(options);
        }
    },
    propertyChanged(element: BlazorInPlaceEditorElement, options: { [key: string]: Object }): void {
        if (!isNullOrUndefined(element)) {
            element.blazor__instance.updateContext(options);
        }
    },
    validate(element: BlazorInPlaceEditorElement): boolean {
        return element && element.blazor__instance.validate();
    }
};

interface BlazorInPlaceEditorElement extends HTMLElement {
    blazor__instance: SfInPlaceEditor;
}

export default InPlaceEditor;
