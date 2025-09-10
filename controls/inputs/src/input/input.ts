/* eslint-disable valid-jsdoc, jsdoc/require-jsdoc, jsdoc/require-returns, jsdoc/require-param */
import { createElement, attributes, addClass, removeClass, detach, classList } from '@syncfusion/ej2-base';
import { closest, formatUnit, isNullOrUndefined, remove } from '@syncfusion/ej2-base';
const CLASSNAMES: ClassNames = {
    RTL: 'e-rtl',
    DISABLE: 'e-disabled',
    INPUT: 'e-input',
    TEXTAREA: 'e-multi-line-input',
    INPUTGROUP: 'e-input-group',
    FLOATINPUT: 'e-float-input',
    FLOATLINE: 'e-float-line',
    FLOATTEXT: 'e-float-text',
    FLOATTEXTCONTENT: 'e-float-text-content',
    CLEARICON: 'e-clear-icon',
    CLEARICONHIDE: 'e-clear-icon-hide',
    LABELTOP: 'e-label-top',
    LABELBOTTOM: 'e-label-bottom',
    NOFLOATLABEL: 'e-no-float-label',
    INPUTCUSTOMTAG: 'e-input-custom-tag',
    FLOATCUSTOMTAG: 'e-float-custom-tag'
};

/* eslint-disable no-inner-declarations */

/**
 * Defines floating label type of the input and decides how the label should float on the input.
 */
export type FloatLabelType = 'Never' | 'Always' | 'Auto';

/**
 * Defines the constant attributes for the input element container.
 */
export const containerAttributes: string[] = ['title', 'style', 'class'];

/**
 * Defines the constant focus class for the input element.
 */
export const TEXTBOX_FOCUS: string = 'e-input-focus';

/**
 * Base for Input creation through util methods.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Input {
    let privateInputObj: InputObject = {
        container: null,
        buttons: [],
        clearButton: null
    };
    let floatType: string;
    let isBindClearAction: boolean = true;
    /**
     * Create a wrapper to input element with multiple span elements and set the basic properties to input based components.
     * ```
     * E.g : Input.createInput({ element: element, floatLabelType : "Auto", properties: { placeholder: 'Search' } });
     * ```
     *
     */
    export function createInput(args: InputArgs, internalCreateElement ?: createElementParams): InputObject {
        (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers = {};
        const makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        let inputObject: InputObject = { container: null, buttons: [], clearButton: null };
        floatType = args.floatLabelType;
        isBindClearAction = args.bindClearAction;
        if (isNullOrUndefined(args.floatLabelType ) || args.floatLabelType === 'Never' ) {
            inputObject.container = createInputContainer(args, CLASSNAMES.INPUTGROUP, CLASSNAMES.INPUTCUSTOMTAG, 'span', makeElement);
            args.element.parentNode.insertBefore(inputObject.container, args.element);
            addClass([args.element], CLASSNAMES.INPUT);
            inputObject.container.appendChild(args.element);
        } else {
            createFloatingInput(args, inputObject, makeElement);
        }
        bindInitialEvent(args);
        if (!isNullOrUndefined(args.properties) && !isNullOrUndefined(args.properties.showClearButton) &&
            args.properties.showClearButton) {
            setClearButton(args.properties.showClearButton, args.element, inputObject, true, makeElement);
            inputObject.clearButton.setAttribute('role', 'button');
            if (inputObject.container.classList.contains(CLASSNAMES.FLOATINPUT)) {
                addClass([inputObject.container], CLASSNAMES.INPUTGROUP);
            }
        }
        if (!isNullOrUndefined(args.buttons)) {
            for (let i: number = 0; i < args.buttons.length; i++) {
                inputObject.buttons.push(appendSpan(args.buttons[i as number], inputObject.container, makeElement));
            }
        }
        if (!isNullOrUndefined(args.element) && args.element.tagName === 'TEXTAREA') {
            addClass([inputObject.container], CLASSNAMES.TEXTAREA);
        }
        validateInputType(inputObject.container, args.element);
        inputObject = setPropertyValue(args, inputObject);
        createSpanElement(inputObject.container, makeElement);
        privateInputObj = inputObject;
        return inputObject;
    }

    function bindFocusEventHandler(args: InputArgs): void {
        const parent: HTMLElement = getParentNode(args.element);
        if (parent.classList.contains('e-input-group') || parent.classList.contains('e-outline') || parent.classList.contains('e-filled')) {
            parent.classList.add('e-input-focus');
        }
        if (args.floatLabelType !== 'Never') {
            setTimeout(() => {
                Input.calculateWidth(args.element, parent);
            }, 80);
        }
    }

    function bindBlurEventHandler (args: InputArgs): void {
        const parent: HTMLElement = getParentNode(args.element);
        if (parent.classList.contains('e-input-group') || parent.classList.contains('e-outline') || parent.classList.contains('e-filled')) {
            parent.classList.remove('e-input-focus');
        }
        if (args.floatLabelType !== 'Never') {
            setTimeout(() => {
                Input.calculateWidth(args.element, parent);
            }, 80);
        }
    }

    function bindInputEventHandler (args: InputArgs): void {
        checkInputValue(args.floatLabelType, args.element as HTMLInputElement);
    }

    export function bindInitialEvent(args: InputArgs): void {
        checkInputValue(args.floatLabelType, args.element as HTMLInputElement);
        const focusHandler: () => void = () => bindFocusEventHandler(args);
        const blurHandler: () => void = () => bindBlurEventHandler(args);
        const inputHandler: () => void = () => bindInputEventHandler(args);

        args.element.addEventListener('focus', focusHandler);
        args.element.addEventListener('blur', blurHandler);
        args.element.addEventListener('input', inputHandler);

        (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['inputFocusHandler'] = { focusHandler };
        (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['inputBlurHandler'] = { blurHandler };
        (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['inputHandler'] = { inputHandler };
    }

    function unbindInitialEvent(args: InputArgs): void {
        if (!isNullOrUndefined(args.element)) {
            if (!isNullOrUndefined((args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers)) {
                if (!isNullOrUndefined((args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['inputFocusHandler'])
                    && !isNullOrUndefined((args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['inputBlurHandler'])
                    && !isNullOrUndefined((args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['inputHandler'])) {
                    const focusHandler: any = (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['inputFocusHandler'].focusHandler;
                    const blurHandler: any = (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['inputBlurHandler'].blurHandler;
                    const inputHandler: any = (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['inputHandler'].inputHandler;
                    args.element.removeEventListener('focus', focusHandler);
                    args.element.removeEventListener('blur', blurHandler);
                    args.element.removeEventListener('input', inputHandler);

                    // Clean up stored bound functions
                    delete (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['inputFocusHandler'];
                    delete (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['inputBlurHandler'];
                    delete (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['inputHandler'];
                }
            }
        }
    }
    function checkInputValue(floatLabelType: string, inputElement: HTMLInputElement): void {
        const inputValue: string = inputElement.value;
        const inputParent: HTMLElement = inputElement.parentElement;
        const grandParent: HTMLElement = inputParent && inputParent.parentElement;
        if (inputValue !== '' && !isNullOrUndefined(inputValue)) {
            if (inputParent && inputParent.classList.contains('e-input-group')) {
                inputParent.classList.add('e-valid-input');
            }
            else if (grandParent && grandParent.classList.contains('e-input-group')) {
                grandParent.classList.add('e-valid-input');
            }
        } else if (floatLabelType !== 'Always') {
            if (inputParent && inputParent.classList.contains('e-input-group')) {
                inputParent.classList.remove('e-valid-input');
            }
            else if (grandParent && grandParent.classList.contains('e-input-group')) {
                grandParent.classList.remove('e-valid-input');
            }
        }
    }

    function _focusFn (): void {
        const label: HTMLElement = <HTMLElement> getParentNode(this).getElementsByClassName('e-float-text')[0];
        if (!isNullOrUndefined(label)) {
            addClass ([label], CLASSNAMES.LABELTOP);
            if (label.classList.contains(CLASSNAMES.LABELBOTTOM)) {
                removeClass([label], CLASSNAMES.LABELBOTTOM);
            }
        }
    }

    function _blurFn (): void {
        const parent: HTMLElement = getParentNode(this);
        if ((parent.getElementsByTagName('textarea')[0]) ? parent.getElementsByTagName('textarea')[0].value === '' :
            parent.getElementsByTagName('input')[0].value === '') {
            const label: HTMLElement = <HTMLElement> parent.getElementsByClassName('e-float-text')[0];
            if (!isNullOrUndefined(label)) {
                if (label.classList.contains(CLASSNAMES.LABELTOP)) {
                    removeClass([label], CLASSNAMES.LABELTOP);
                }
                addClass([label], CLASSNAMES.LABELBOTTOM);
            }
        }
    }

    export function wireFloatingEvents(element: HTMLInputElement | HTMLTextAreaElement): void {
        element.addEventListener('focus', _focusFn);
        element.addEventListener('blur', _blurFn);
    }
    function unwireFloatingEvents(element: HTMLElement): void {
        if (!isNullOrUndefined(element)) {
            element.removeEventListener('focus', _focusFn);
            element.removeEventListener('blur', _blurFn);
        }
    }
    function inputEventHandler (args: InputArgs): void {
        validateLabel(args.element, args.floatLabelType);
    }
    function blurEventHandler (args: InputArgs): void {
        validateLabel(args.element, args.floatLabelType);
    }
    function createFloatingInput(args: InputArgs, inputObject: InputObject, internalCreateElement ?: createElementParams): void {
        const makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        if (args.floatLabelType === 'Auto') {
            wireFloatingEvents(args.element);
        }
        if (isNullOrUndefined(inputObject.container)) {
            inputObject.container = createInputContainer(args, CLASSNAMES.FLOATINPUT, CLASSNAMES.FLOATCUSTOMTAG, 'div', makeElement);
            inputObject.container.classList.add(CLASSNAMES.INPUTGROUP);
            if (args.element.parentNode) {
                args.element.parentNode.insertBefore(inputObject.container, args.element);
            }
        } else {
            if (!isNullOrUndefined(args.customTag)) {
                inputObject.container.classList.add(CLASSNAMES.FLOATCUSTOMTAG);
            }
            inputObject.container.classList.add(CLASSNAMES.FLOATINPUT);
        }
        const floatLinelement: HTMLElement = makeElement('span', { className: CLASSNAMES.FLOATLINE });
        const floatLabelElement: HTMLElement = makeElement('label', { className: CLASSNAMES.FLOATTEXT });
        if (!isNullOrUndefined(args.element.id) && args.element.id !== '') {
            floatLabelElement.id = 'label_' + args.element.id.replace(/ /g, '_');
            attributes(args.element, { 'aria-labelledby': floatLabelElement.id });
        }
        if (!isNullOrUndefined(args.element.placeholder) && args.element.placeholder !== '') {
            floatLabelElement.innerText = encodePlaceHolder(args.element.placeholder);
            args.element.removeAttribute('placeholder');
        }
        if (!isNullOrUndefined(args.properties) && !isNullOrUndefined(args.properties.placeholder) &&
            args.properties.placeholder !== '') {
            floatLabelElement.innerText = encodePlaceHolder(args.properties.placeholder);
        }
        if (!floatLabelElement.innerText) {
            inputObject.container.classList.add(CLASSNAMES.NOFLOATLABEL);
        }
        if (inputObject.container.classList.contains('e-float-icon-left')) {
            const inputWrap: HTMLElement = inputObject.container.querySelector('.e-input-in-wrap') as HTMLElement;
            inputWrap.appendChild(args.element);
            inputWrap.appendChild(floatLinelement);
            inputWrap.appendChild(floatLabelElement);
        } else {
            inputObject.container.appendChild(args.element);
            inputObject.container.appendChild(floatLinelement);
            inputObject.container.appendChild(floatLabelElement);
        }
        updateLabelState(args.element.value, floatLabelElement);
        if (args.floatLabelType === 'Always') {
            if (floatLabelElement.classList.contains(CLASSNAMES.LABELBOTTOM)) {
                removeClass([floatLabelElement], CLASSNAMES.LABELBOTTOM);
            }
            addClass([floatLabelElement], CLASSNAMES.LABELTOP);
        }
        if (args.floatLabelType === 'Auto') {
            const inputFloatHandler: () => void = () => inputEventHandler(args);
            const blurFloatHandler: () => void = () => blurEventHandler(args);

            // Add event listeners using the defined functions
            args.element.addEventListener('input', inputFloatHandler);
            args.element.addEventListener('blur', blurFloatHandler);

            // Store the event handler functions to remove them later
            (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['floatInputHandler'] = { inputFloatHandler };
            (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['floatBlurHandler'] = { blurFloatHandler };
        } else {
            unWireFloatLabelEvents(args);
        }
        if (!isNullOrUndefined(args.element.getAttribute('id'))) {
            floatLabelElement.setAttribute('for', args.element.getAttribute('id'));
        }
    }
    function unWireFloatLabelEvents(args: InputArgs): void {
        if (!isNullOrUndefined(args.element) &&
            !isNullOrUndefined((args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers)
            && !isNullOrUndefined((args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['floatInputHandler'])
            && !isNullOrUndefined((args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['floatBlurHandler'])) {
            const inputFloatHandler: any =
                (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['floatInputHandler'].inputFloatHandler;
            const blurFloatHandler: any =
                (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['floatBlurHandler'].blurFloatHandler;

            // Remove the event listeners using the defined functions
            args.element.removeEventListener('input', inputFloatHandler);
            args.element.removeEventListener('blur', blurFloatHandler);

            // Clean up stored event handler functions
            delete (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['floatInputHandler'];
            delete (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['floatBlurHandler'];
        }
    }

    function checkFloatLabelType(type: string , container: HTMLElement): void {
        if (type === 'Always' && container.classList.contains('e-outline')) {
            container.classList.add('e-valid-input');
        }
    }

    function setPropertyValue(args: InputArgs, inputObject: InputObject): InputObject {
        if (!isNullOrUndefined(args.properties)) {
            for (const prop of Object.keys(args.properties)) {
                switch (prop) {
                case 'cssClass':
                    setCssClass(args.properties.cssClass, [inputObject.container]);
                    checkFloatLabelType(args.floatLabelType, inputObject.container);
                    break;
                case 'enabled':
                    setEnabled(args.properties.enabled, args.element, args.floatLabelType, inputObject.container);
                    break;
                case 'enableRtl':
                    setEnableRtl(args.properties.enableRtl, [inputObject.container]);
                    break;
                case 'placeholder':
                    setPlaceholder(args.properties.placeholder, args.element);
                    break;
                case 'readonly':
                    setReadonly(args.properties.readonly, args.element);
                    break;
                }
            }
        }
        return inputObject;
    }

    function updateIconState(value: string | number, button: HTMLElement, readonly?: boolean): void {
        if (!isNullOrUndefined(button)){
            if (value && !readonly) {
                removeClass([button], CLASSNAMES.CLEARICONHIDE);
            }
            else{
                addClass([button], CLASSNAMES.CLEARICONHIDE);
            }
        }

    }

    function updateLabelState(value: string | number, label: HTMLElement, element: HTMLElement = null): void {
        if (value) {
            addClass([label], CLASSNAMES.LABELTOP);
            if (label.classList.contains(CLASSNAMES.LABELBOTTOM)) {
                removeClass([label], CLASSNAMES.LABELBOTTOM);
            }
        } else {
            const isNotFocused : boolean =  element != null ? element !== document.activeElement : true;
            if (isNotFocused) {
                if (label.classList.contains(CLASSNAMES.LABELTOP)) {
                    removeClass([label], CLASSNAMES.LABELTOP);
                }
                addClass([label], CLASSNAMES.LABELBOTTOM);
            }
        }
    }

    function getParentNode(element: HTMLInputElement | HTMLElement): HTMLElement {
        let parentNode: HTMLElement = isNullOrUndefined(<HTMLElement>element.parentNode) ? <HTMLElement>element
            : <HTMLElement>element.parentNode;
        if (parentNode && parentNode.classList.contains('e-input-in-wrap')) {
            parentNode = <HTMLElement>parentNode.parentNode;
        }
        return parentNode;
    }

    /**
     * To create clear button.
     */
    function createClearButton(element: HTMLInputElement | HTMLTextAreaElement, inputObject?: InputObject ,
                               initial ?: boolean, internalCreateElement ?: createElementParams ): HTMLElement {
        const makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        const button: HTMLElement = <HTMLElement>makeElement('span', { className: CLASSNAMES.CLEARICON });
        const container: HTMLElement = inputObject.container;
        if (!isNullOrUndefined(initial)) {
            container.appendChild(button);
        } else {
            const baseElement: HTMLElement = inputObject.container.classList.contains(CLASSNAMES.FLOATINPUT) ?
                inputObject.container.querySelector('.' + CLASSNAMES.FLOATTEXT) as HTMLElement : element;
            baseElement.insertAdjacentElement('afterend', button);
        }
        addClass([button], CLASSNAMES.CLEARICONHIDE);
        wireClearBtnEvents(element, button, container);
        button.setAttribute('aria-label', 'close');
        return button;
    }
    function clickHandler (event: MouseEvent, element: HTMLInputElement | HTMLTextAreaElement, button: HTMLElement): any {
        if (!(element.classList.contains(CLASSNAMES.DISABLE) || element.readOnly)) {
            event.preventDefault();
            if (element !== document.activeElement) {
                element.focus();
            }
            element.value = '';
            addClass([button], CLASSNAMES.CLEARICONHIDE);
        }
    }

    function inputHandler (element: HTMLInputElement | HTMLTextAreaElement, button: HTMLElement): any {
        updateIconState(element.value, button);
    }

    function focusHandler (element: HTMLInputElement | HTMLTextAreaElement, button: HTMLElement): any {
        updateIconState(element.value, button, element.readOnly);
    }

    function blurHandler (element: HTMLInputElement | HTMLTextAreaElement, button: HTMLElement): any {
        setTimeout (() => {
            if (!isNullOrUndefined(button)){
                addClass([button], CLASSNAMES.CLEARICONHIDE);
                button = !isNullOrUndefined(element) && element.classList.contains('e-combobox') ? null : button ;
            }
        }, 200);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export function wireClearBtnEvents(element: HTMLInputElement | HTMLTextAreaElement, button: HTMLElement, container: HTMLElement): void {
        if (isBindClearAction === undefined || isBindClearAction) {
            const clickHandlerEvent: (e: MouseEvent) => void = (e: MouseEvent): void => clickHandler(e, element, button);
            button.addEventListener('click', clickHandlerEvent);
            (element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearClickHandler'] = { clickHandlerEvent };
        }

        const inputHandlerEvent: () => void = (): void => inputHandler(element, button);
        const focusHandlerEvent: () => void = (): void => focusHandler(element, button);
        const blurHandlerEvent: () => void = (): void => blurHandler(element, button);

        element.addEventListener('input', inputHandlerEvent);
        element.addEventListener('focus', focusHandlerEvent);
        element.addEventListener('blur', blurHandlerEvent);

        // Store the bound functions to remove them later
        (element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearInputHandler'] = { inputHandlerEvent };
        (element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearFocusHandler'] = { focusHandlerEvent };
        (element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearBlurHandler'] = { blurHandlerEvent };
    }
    function unWireClearBtnEvents(element: HTMLInputElement | HTMLTextAreaElement, button: HTMLElement): void {
        if (!isNullOrUndefined(element) &&
            !isNullOrUndefined((element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers)) {
            if (!isNullOrUndefined((element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearClickHandler'])) {
                const clickHandlerEvent: any = (element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearClickHandler'].clickHandlerEvent;
                if (isBindClearAction === undefined || isBindClearAction) {
                    if (!isNullOrUndefined(button)) {
                        button.removeEventListener('click', clickHandlerEvent);
                    }
                }
                delete (element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearClickHandler'];
            }
            if (!isNullOrUndefined((element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearInputHandler'])
                && !isNullOrUndefined((element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearFocusHandler'])
                && !isNullOrUndefined((element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearBlurHandler'])) {
                const inputHandlerEvent: any = (element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearInputHandler'].inputHandlerEvent;
                const focusHandlerEvent: any = (element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearFocusHandler'].focusHandlerEvent;
                const blurHandlerEvent: any = (element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearBlurHandler'].blurHandlerEvent;


                element.removeEventListener('input', inputHandlerEvent);
                element.removeEventListener('focus', focusHandlerEvent);
                element.removeEventListener('blur', blurHandlerEvent);

                // Clean up stored Event functions

                delete (element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearInputHandler'];
                delete (element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearFocusHandler'];
                delete (element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers['clearBlurHandler'];
            }
        }
    }
    export function destroy(args: InputArgs, button: HTMLElement = null): void {
        unbindInitialEvent(args);
        if (args.floatLabelType === 'Auto'){
            unWireFloatLabelEvents(args);
        }
        if (args.properties.showClearButton) {
            unWireClearBtnEvents(args.element, button);
        }
        if (!isNullOrUndefined(args.buttons)) {
            _internalRipple(false, null, args.buttons as any);
        }
        unwireFloatingEvents(args.element);
        if (!isNullOrUndefined(args.element)) {
            delete (args.element as HTMLInputElement & { __eventHandlers?: any }).__eventHandlers;
            if (args.element.classList.contains(CLASSNAMES.INPUT)) {
                args.element.classList.remove(CLASSNAMES.INPUT);
            }
        }
        privateInputObj = null;
    }
    function validateLabel(element: HTMLInputElement | HTMLTextAreaElement, floatLabelType: string) : void {
        const parent: HTMLElement = getParentNode(element);
        if (parent.classList.contains(CLASSNAMES.FLOATINPUT) && floatLabelType === 'Auto') {
            const label: HTMLElement = <HTMLElement> getParentNode(element).getElementsByClassName('e-float-text')[0];
            updateLabelState(element.value, label, element);
        }
    }

    /**
     * To create input box contianer.
     */
    function createInputContainer(args: InputArgs, className: string, tagClass: string, tag: string,
                                  internalCreateElement ?: createElementParams): HTMLElement {
        const makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        let container: HTMLElement;
        if (!isNullOrUndefined(args.customTag)) {
            container = makeElement(args.customTag , {  className: className} );
            container.classList.add(tagClass);
        } else {
            container = makeElement(tag, { className: className });
        }
        container.classList.add('e-control-wrapper');
        return container;
    }

    function encodePlaceHolder(placeholder: string): string {
        if (placeholder == null || placeholder === '') {
            return '';
        }
        const decoded: string = decodeHtmlEntities(placeholder);
        return decoded;
    }

    function decodeHtmlEntities(str: string): string {
        const entityMap: { [key: string]: string } = {
            '&amp;': '&',
            // eslint-disable-next-line quotes
            '&quot;': '"', // tslint:disable-line:quotemark
            // eslint-disable-next-line quotes
            '&#39;': "'", // tslint:disable-line:quotemark
            '&lt;': '<',
            '&gt;': '>',
            '&eacute;': 'é'// tslint:disable-line:comma-dangle
        };
        // tslint:disable-next-line:typedef
        // tslint-disable-next-line security/detect-object-injection
        return str.replace(/&[a-zA-Z#0-9]+;/g, (entity: string) => entityMap[entity as string] || entity);
    }

    /**
     * Sets the value to the input element.
     * ```
     * E.g : Input.setValue('content', element, "Auto", true );
     * ```
     *
     * @param {string} value - Specify the value of the input element.
     * @param {HTMLInputElement | HTMLTextAreaElement} element - The element on which the specified value is updated.
     * @param {string} floatLabelType - Specify the float label type of the input element.
     * @param {boolean} clearButton - Boolean value to specify whether the clear icon is enabled / disabled on the input.
     */
    export function setValue(value: string, element: HTMLInputElement | HTMLTextAreaElement,
                             floatLabelType ?: string, clearButton?: boolean): void {
        element.value = value;
        if (floatLabelType !== 'Never') {
            calculateWidth(element, element.parentElement);
        }
        if ((!isNullOrUndefined(floatLabelType)) && floatLabelType === 'Auto') {
            validateLabel(element, floatLabelType);
        }
        if (!isNullOrUndefined(clearButton) && clearButton ) {
            const parentElement: HTMLElement = <HTMLElement> getParentNode(element);
            if (!isNullOrUndefined(parentElement)) {
                const button: HTMLElement = <HTMLElement> parentElement.getElementsByClassName(CLASSNAMES.CLEARICON)[0];
                if (!isNullOrUndefined(button)) {
                    if (element.value && !isNullOrUndefined(parentElement) && parentElement.classList.contains('e-input-focus')) {
                        removeClass([button], CLASSNAMES.CLEARICONHIDE);
                    } else {
                        addClass([button], CLASSNAMES.CLEARICONHIDE);
                    }
                }
            }
        }
        checkInputValue(floatLabelType, element as HTMLInputElement);
    }

    /**
     * Sets the single or multiple cssClass to wrapper of input element.
     * ```
     * E.g : Input.setCssClass('e-custom-class', [element]);
     * ```
     *
     * @param {string} cssClass - Css class names which are needed to add.
     * @param {Element[] | NodeList} elements - The elements which are needed to add / remove classes.
     * @param {string} oldClass
     * - Css class names which are needed to remove. If old classes are need to remove, can give this optional parameter.
     */
    export function setCssClass(cssClass: string, elements: Element[] | NodeList, oldClass?: string): void {
        if (!isNullOrUndefined(oldClass) && oldClass !== '') {
            removeClass(elements, oldClass.split(' '));
        }
        if (!isNullOrUndefined(cssClass) && cssClass !== '') {
            addClass(elements, cssClass.split(' '));
        }
    }
    /**
     * Set the width to the placeholder when it overflows on the button such as spinbutton, clearbutton, icon etc
     * ```
     * E.g : Input.calculateWidth(element, container);
     * ```
     *
     * @param {any} element - Input element which is need to add.
     * @param {HTMLElement} container - The parent element which is need to get the label span to calculate width
     */
    export function calculateWidth(element: any, container: HTMLElement, moduleName?: string): void {
        if (moduleName !== 'multiselect' && !_isElementVisible(element)) {
            return;
        }
        const elementWidth : number | Element = moduleName === 'multiselect' ? element : element.clientWidth - parseInt(getComputedStyle(element, null).getPropertyValue('padding-left'), 10);
        if ( !isNullOrUndefined(container) && !isNullOrUndefined(container.getElementsByClassName('e-float-text-content')[0])) {
            if (container.getElementsByClassName('e-float-text-content')[0].classList.contains('e-float-text-overflow')) {
                container.getElementsByClassName('e-float-text-content')[0].classList.remove('e-float-text-overflow');
            }
            if (elementWidth as number < container.getElementsByClassName('e-float-text-content')[0].clientWidth || elementWidth === container.getElementsByClassName('e-float-text-content')[0].clientWidth) {
                container.getElementsByClassName('e-float-text-content')[0].classList.add('e-float-text-overflow');
            }
        }
    }

    /**
     * Set the width to the wrapper of input element.
     * ```
     * E.g : Input.setWidth('200px', container);
     * ```
     *
     * @param {number | string} width - Width value which is need to add.
     * @param {HTMLElement} container - The element on which the width is need to add.
     */
    export function setWidth(width: number | string, container: HTMLElement): void {
        if (typeof width === 'number') {
            container.style.width = formatUnit(width);
        } else if (typeof width === 'string') {
            container.style.width = (width.match(/px|%|em/)) ? <string>(width) : <string>(formatUnit(width));
        }
        calculateWidth(container.firstChild as HTMLElement, container);
    }

    /**
     * Set the placeholder attribute to the input element.
     * ```
     * E.g : Input.setPlaceholder('Search here', element);
     * ```
     *
     * @param {string} placeholder - Placeholder value which is need to add.
     * @param {HTMLInputElement | HTMLTextAreaElement} element - The element on which the placeholder is need to add.
     */
    export function setPlaceholder(placeholder: string, element: HTMLInputElement | HTMLTextAreaElement): void {
        placeholder = encodePlaceHolder(placeholder);
        const parentElement: HTMLElement = getParentNode(element);
        if (parentElement.classList.contains(CLASSNAMES.FLOATINPUT)) {
            if (!isNullOrUndefined(placeholder) && placeholder !== '') {
                const floatTextContent: Element = parentElement.getElementsByClassName('e-float-text-content')[0];
                if (floatTextContent && floatTextContent.children[0]) {
                    floatTextContent.children[0].textContent = placeholder;
                } else {
                    const floatText: Element = parentElement.getElementsByClassName(CLASSNAMES.FLOATTEXT)[0];
                    if (!isNullOrUndefined(floatText)) {
                        floatText.textContent = placeholder;
                    }
                }
                parentElement.classList.remove(CLASSNAMES.NOFLOATLABEL);
                element.removeAttribute('placeholder');
            } else {
                parentElement.classList.add(CLASSNAMES.NOFLOATLABEL);
                const floatTextContent: Element = parentElement.getElementsByClassName('e-float-text-content')[0];
                if (floatTextContent && floatTextContent.children[0]) {
                    floatTextContent.children[0].textContent = '';
                } else {
                    const floatText: Element = parentElement.getElementsByClassName(CLASSNAMES.FLOATTEXT)[0];
                    if (!isNullOrUndefined(floatText)) {
                        floatText.textContent = '';
                    }
                }
            }
        } else {
            if (!isNullOrUndefined(placeholder) && placeholder !== '') {
                attributes(element, { 'placeholder': placeholder});
            } else {
                element.removeAttribute('placeholder');
            }
        }
    }
    /**
     * Set the read only attribute to the input element
     * ```
     * E.g : Input.setReadonly(true, element);
     * ```
     *
     * @param {boolean} isReadonly
     * - Boolean value to specify whether to set read only. Setting "True" value enables read only.
     * @param {HTMLInputElement | HTMLTextAreaElement} element
     * - The element which is need to enable read only.
     */
    export function setReadonly(isReadonly: boolean, element: HTMLInputElement | HTMLTextAreaElement, floatLabelType ?: string): void {
        if (isReadonly) {
            attributes(element, { readonly: '' });
        } else {
            element.removeAttribute('readonly');
        }
        if (!isNullOrUndefined(floatLabelType)) {
            validateLabel(element, floatLabelType);
        }
    }
    /**
     * Displays the element direction from right to left when its enabled.
     * ```
     * E.g : Input.setEnableRtl(true, [inputObj.container]);
     * ```
     *
     * @param {boolean} isRtl
     * - Boolean value to specify whether to set RTL. Setting "True" value enables the RTL mode.
     * @param {Element[] | NodeList} elements
     * - The elements that are needed to enable/disable RTL.
     */
    export function setEnableRtl(isRtl: boolean, elements: Element[] | NodeList): void {
        if (isRtl) {
            addClass(elements, CLASSNAMES.RTL);
        } else {
            removeClass(elements, CLASSNAMES.RTL);
        }
    }
    /**
     * Enables or disables the given input element.
     * ```
     * E.g : Input.setEnabled(false, element);
     * ```
     *
     * @param {boolean} isEnable
     * - Boolean value to specify whether to enable or disable.
     * @param {HTMLInputElement | HTMLTextAreaElement} element
     * - Element to be enabled or disabled.
     */
    export function setEnabled(isEnable: boolean, element: HTMLInputElement | HTMLTextAreaElement, floatLabelType ?: string ,
                               inputContainer?: HTMLElement ): void {
        const disabledAttrs: { [key: string]: string } = { 'disabled': '', 'aria-disabled': 'true' };
        const considerWrapper: boolean = isNullOrUndefined(inputContainer) ? false : true;
        if (isEnable) {
            element.classList.remove(CLASSNAMES.DISABLE);
            removeAttributes(disabledAttrs, element);
            if (considerWrapper) {
                removeClass( [inputContainer], CLASSNAMES.DISABLE);
            }
        } else {
            element.classList.add(CLASSNAMES.DISABLE);
            addAttributes(disabledAttrs, element);
            if (considerWrapper) {
                addClass( [inputContainer], CLASSNAMES.DISABLE);
            }
        }
        if (!isNullOrUndefined(floatLabelType)) {
            validateLabel(element, floatLabelType);
        }
    }

    export function setClearButton (isClear: boolean, element: HTMLInputElement | HTMLTextAreaElement,
                                    inputObject: InputObject, initial ?: boolean, internalCreateElement ?: createElementParams ): void {
        const makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        if (isClear) {
            inputObject.clearButton = createClearButton (element, inputObject, initial, makeElement);
        } else {
            remove(inputObject.clearButton);
            inputObject.clearButton = null;
        }
    }
    /**
     * Removing the multiple attributes from the given element such as "disabled","id" , etc.
     * ```
     * E.g : Input.removeAttributes({ 'disabled': 'disabled', 'aria-disabled': 'true' }, element);
     * ```
     *
     * @param {string} attrs
     * - Array of attributes which are need to removed from the element.
     * @param {HTMLInputElement | HTMLElement} element
     * - Element on which the attributes are needed to be removed.
     */
    export function removeAttributes(attrs: { [key: string]: string }, element: HTMLInputElement | HTMLElement): void {
        for (const key of Object.keys(attrs)) {
            const parentElement: HTMLElement = getParentNode(element);
            if (key === 'disabled') {
                element.classList.remove(CLASSNAMES.DISABLE);
            }
            if (key === 'disabled' && parentElement.classList.contains(CLASSNAMES.INPUTGROUP)) {
                parentElement.classList.remove(CLASSNAMES.DISABLE);
            }
            if (key === 'placeholder' && parentElement.classList.contains(CLASSNAMES.FLOATINPUT)) {
                parentElement.getElementsByClassName(CLASSNAMES.FLOATTEXT)[0].textContent = '';
            } else {
                element.removeAttribute(key);
            }
        }
    }
    /**
     * Adding the multiple attributes to the given element such as "disabled","id" , etc.
     * ```
     * E.g : Input.addAttributes({ 'id': 'inputpopup' }, element);
     * ```
     *
     * @param {string} attrs
     * - Array of attributes which is added to element.
     * @param {HTMLInputElement | HTMLElement} element
     * - Element on which the attributes are needed to be added.
     */
    export function addAttributes(attrs: { [key: string]: string }, element: HTMLInputElement | HTMLElement): void {
        for (const key of Object.keys(attrs)) {
            const parentElement: HTMLElement = getParentNode(element);
            if (key === 'disabled') {
                element.classList.add(CLASSNAMES.DISABLE);
            }
            if (key === 'disabled' && parentElement.classList.contains(CLASSNAMES.INPUTGROUP)) {
                parentElement.classList.add(CLASSNAMES.DISABLE);
            }
            if (key === 'placeholder' && parentElement.classList.contains(CLASSNAMES.FLOATINPUT)) {
                parentElement.getElementsByClassName(CLASSNAMES.FLOATTEXT)[0].textContent = attrs[`${key}`];
            } else {
                element.setAttribute(key, attrs[`${key}`]);
            }
        }
    }
    export function removeFloating(input: InputObject): void {
        const container: HTMLElement = input.container;
        if (!isNullOrUndefined(container) && container.classList.contains(CLASSNAMES.FLOATINPUT)) {
            const inputEle: HTMLElement = container.querySelector('textarea') ? <HTMLElement>container.querySelector('textarea') :
        <HTMLElement>container.querySelector('input');
            const placeholder: string = container.querySelector('.' + CLASSNAMES.FLOATTEXT).textContent;
            const clearButton: boolean = container.querySelector('.e-clear-icon') !== null;
            detach(container.querySelector('.' + CLASSNAMES.FLOATLINE));
            detach(container.querySelector('.' + CLASSNAMES.FLOATTEXT));
            classList(container, [CLASSNAMES.INPUTGROUP], [CLASSNAMES.FLOATINPUT]);
            unwireFloatingEvents(inputEle);
            attributes(inputEle, { 'placeholder': placeholder });
            inputEle.classList.add(CLASSNAMES.INPUT);
            if (!clearButton && inputEle.tagName === 'INPUT') {
                inputEle.removeAttribute('required');
            }
        }
    }
    export function addFloating(input: HTMLInputElement | HTMLTextAreaElement, type: FloatLabelType | string, placeholder: string,
                                internalCreateElement ?: createElementParams): void {
        const makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        const container: HTMLElement = <HTMLElement>closest(input, '.' + CLASSNAMES.INPUTGROUP);
        floatType = type;
        let customTag: string = container.tagName;
        customTag = customTag !== 'DIV' && customTag !== 'SPAN' ? customTag : null;
        const args: InputArgs = {element: input, floatLabelType: type ,
            customTag: customTag, properties : {placeholder : placeholder } };
        if (type !== 'Never') {
            let iconEle: HTMLElement = <HTMLElement>container.querySelector('.e-clear-icon');
            const inputObj: InputObject = { container: container};
            input.classList.remove(CLASSNAMES.INPUT);
            createFloatingInput(args, inputObj, makeElement);
            createSpanElement(inputObj.container, makeElement);
            calculateWidth(args.element, inputObj.container);
            const isPrependIcon: boolean = container.classList.contains('e-float-icon-left');
            if (isNullOrUndefined(iconEle)) {
                if (isPrependIcon) {
                    const inputWrap: HTMLElement = container.querySelector('.e-input-in-wrap')as HTMLElement;
                    iconEle = inputWrap.querySelector('.e-input-group-icon') as HTMLElement;
                } else {
                    iconEle = container.querySelector('.e-input-group-icon') as HTMLElement;
                }
            }
            if (isNullOrUndefined(iconEle)) {
                if (isPrependIcon) {
                    iconEle = container.querySelector('.e-input-group-icon') as HTMLElement;
                }
            } else {
                const floatLine: HTMLElement = <HTMLElement>container.querySelector('.' + CLASSNAMES.FLOATLINE);
                const floatText: HTMLElement = <HTMLElement>container.querySelector('.' + CLASSNAMES.FLOATTEXT);
                const wrapper: HTMLElement = isPrependIcon ? container.querySelector('.e-input-in-wrap') as HTMLElement : container;
                wrapper.insertBefore(input, iconEle);
                wrapper.insertBefore(floatLine, iconEle);
                wrapper.insertBefore(floatText, iconEle);
            }
        } else {
            unWireFloatLabelEvents(args);
        }
        checkFloatLabelType(type, input.parentElement);
    }
    /**
     * Create the span inside the label and add the label text into the span textcontent
     * ```
     * E.g : Input.createSpanElement(inputObject, makeElement);
     * ```
     *
     * @param {Element} inputObject
     * - Element which is need to get the label
     * @param {createElementParams} makeElement
     * - Element which is need to create the span
     */
    export function createSpanElement(inputObject: Element, makeElement: createElementParams): void {
        if (inputObject.classList.contains('e-outline') && inputObject.getElementsByClassName('e-float-text')[0]) {
            const labelSpanElement: HTMLElement = makeElement('span', { className: CLASSNAMES.FLOATTEXTCONTENT });
            labelSpanElement.innerHTML = inputObject.getElementsByClassName('e-float-text')[0].innerHTML;
            inputObject.getElementsByClassName('e-float-text')[0].innerHTML = '';
            inputObject.getElementsByClassName('e-float-text')[0].appendChild(labelSpanElement);
        }
    }

    /**
     * Enable or Disable the ripple effect on the icons inside the Input. Ripple effect is only applicable for material theme.
     * ```
     * E.g : Input.setRipple(true, [inputObjects]);
     * ```
     *
     * @param {boolean} isRipple
     * - Boolean value to specify whether to enable the ripple effect.
     * @param {InputObject[]} inputObj
     * - Specify the collection of input objects.
     */
    export function setRipple (isRipple: boolean, inputObj: InputObject[]): void {
        for (let i: number = 0 ; i < inputObj.length ; i++ ) {
            _internalRipple(isRipple, inputObj[parseInt(i.toString(), 10)].container);
        }
    }

    function _internalRipple(isRipple: boolean, container: HTMLElement, button?: HTMLElement): void {
        const argsButton: HTMLElement[] = [];
        argsButton.push(button);
        const buttons : Element[] =  isNullOrUndefined(button) ?
        <NodeListOf<Element> & Element[]>container.querySelectorAll('.e-input-group-icon') : argsButton;
        if ( isRipple && buttons.length > 0) {
            for ( let index: number = 0 ; index < buttons.length; index++ ) {
                buttons[parseInt(index.toString(), 10)].addEventListener('mousedown', _onMouseDownRipple , false);
                buttons[parseInt(index.toString(), 10)].addEventListener('mouseup', _onMouseUpRipple , false);
            }
        } else if (buttons.length > 0) {
            for ( let index: number = 0 ; index < buttons.length; index++ ) {
                buttons[parseInt(index.toString(), 10)].removeEventListener('mousedown', _onMouseDownRipple, this);
                buttons[parseInt(index.toString(), 10)].removeEventListener('mouseup', _onMouseUpRipple, this);
            }
        }
    }

    function _onMouseRipple (container?: HTMLElement, button?: Element): void {
        if (!container.classList.contains('e-disabled') && !container.querySelector('input').readOnly ) {
            button.classList.add('e-input-btn-ripple');
        }
    }

    function _isElementVisible(element: any): boolean {
        if (!element) {
            return false;
        }
        // Check if the element or any of its parents are hidden using display: none
        let currentElement: any = element;
        while (currentElement && currentElement !== document.body) {
            const style: CSSStyleDeclaration  = window.getComputedStyle(currentElement);
            if (style.display === 'none') {
                return false;
            }
            currentElement = currentElement.parentElement;
        }
        // If none of the elements have display: none, the element is considered visible
        return true;
    }

    function _onMouseDownRipple(): void {
        const ele: HTMLElement = null || this;
        let parentEle: HTMLElement = this.parentElement;
        while (!parentEle.classList.contains('e-input-group')) {
            parentEle = parentEle.parentElement;
        }
        _onMouseRipple(parentEle , ele);
    }

    function _onMouseUpRipple (): void {
        const ele: HTMLElement = null || this;
        setTimeout(
            () => {
                ele.classList.remove('e-input-btn-ripple');
            },
            500);
    }
    function createIconEle(iconClass: string, makeElement: createElementParams): HTMLElement {
        const button: HTMLElement = <HTMLElement>makeElement('span', { className: iconClass });
        button.classList.add('e-input-group-icon');
        return button;
    }

    /**
     * Creates a new span element with the given icons added and append it in container element.
     * ```
     * E.g : Input.addIcon('append', 'e-icon-spin', inputObj.container, inputElement);
     * ```
     *
     * @param {string} position - Specify the icon placement on the input.Possible values are append and prepend.
     * @param {string | string[]} icons - Icon classes which are need to add to the span element which is going to created.
     * Span element acts as icon or button element for input.
     * @param {HTMLElement} container - The container on which created span element is going to append.
     * @param {HTMLElement} input - The inputElement on which created span element is going to prepend.
     */
    export function addIcon(position: string, icons: string | string[], container: HTMLElement,
                            input: HTMLElement, internalCreate?: createElementParams): void {
        const result: string[] = typeof(icons) === 'string' ? icons.split(',')
            : icons;
        if (position.toLowerCase() === 'append') {
            for (const icon of result) {
                appendSpan(icon, container, internalCreate);
            }
        } else {
            for (const icon of result) {
                prependSpan(icon, container, input, internalCreate);
            }
        }
        if (container.getElementsByClassName('e-input-group-icon')[0] && container.getElementsByClassName('e-float-text-overflow')[0]) {
            container.getElementsByClassName('e-float-text-overflow')[0].classList.add('e-icon');
        }
    }

    /**
     * Creates a new span element with the given icons added and prepend it in input element.
     * ```
     * E.g : Input.prependSpan('e-icon-spin', inputObj.container, inputElement);
     * ```
     *
     * @param {string} iconClass - Icon classes which are need to add to the span element which is going to created.
     * Span element acts as icon or button element for input.
     * @param {HTMLElement} container - The container on which created span element is going to append.
     * @param {HTMLElement} inputElement - The inputElement on which created span element is going to prepend.
     */
    export function prependSpan(iconClass: string, container: HTMLElement,
                                inputElement: HTMLElement, internalCreateElement?: createElementParams): HTMLElement {
        const makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        const button: HTMLElement = createIconEle(iconClass, makeElement);
        container.classList.add('e-float-icon-left');
        let innerWrapper: HTMLElement = container.querySelector('.e-input-in-wrap');
        if (isNullOrUndefined(innerWrapper)) {
            innerWrapper = <HTMLElement>makeElement('span', { className: 'e-input-in-wrap' });
            inputElement.parentNode.insertBefore(innerWrapper, inputElement);
            const result: NodeListOf<Element> = container.querySelectorAll(inputElement.tagName + ' ~ *');
            innerWrapper.appendChild(inputElement);
            for (let i: number = 0; i < result.length; i++) {
                const element: Element = result[parseInt(i.toString(), 10)];
                const parentElement: HTMLElement = innerWrapper.parentElement;
                if (!(element.classList.contains('e-float-line')) || (!(parentElement && parentElement.classList.contains('e-filled')) && parentElement)) {
                    innerWrapper.appendChild(element);
                }
            }
        }
        innerWrapper.parentNode.insertBefore(button, innerWrapper);
        _internalRipple(true, container, button);
        return button;
    }

    /**
     * Creates a new span element with the given icons added and append it in container element.
     * ```
     * E.g : Input.appendSpan('e-icon-spin', inputObj.container);
     * ```
     *
     * @param {string} iconClass - Icon classes which are need to add to the span element which is going to created.
     * Span element acts as icon or button element for input.
     * @param {HTMLElement} container - The container on which created span element is going to append.
     */
    export function appendSpan(iconClass: string, container: HTMLElement, internalCreateElement ?: createElementParams): HTMLElement {
        const makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        const button: HTMLElement = createIconEle(iconClass, makeElement);
        const wrap: HTMLElement = (container.classList.contains('e-float-icon-left')) ? container.querySelector('.e-input-in-wrap') :
            container;
        wrap.appendChild(button);
        _internalRipple(true, container, button);
        return button;
    }

    export function validateInputType (containerElement : HTMLElement, input : HTMLInputElement | HTMLTextAreaElement) : void {
        if (input.type === 'hidden') {
            containerElement.classList.add('e-hidden');
        } else if (containerElement.classList.contains('e-hidden')) {
            containerElement.classList.remove('e-hidden');
        }
    }

    export function updateHTMLAttributesToElement
    (htmlAttributes : {[key: string]: string}, element: HTMLInputElement | HTMLTextAreaElement): void {
        if ( !isNullOrUndefined(htmlAttributes)) {
            for (const key of Object.keys(htmlAttributes)) {
                if (containerAttributes.indexOf(key) < 0 ) {
                    element.setAttribute(key, htmlAttributes[`${key}`]);
                }
            }
        }
    }

    export function updateCssClass (newClass : string, oldClass : string, container: HTMLElement): void
    {
        setCssClass(getInputValidClassList(newClass), [container], getInputValidClassList(oldClass));
    }

    export function getInputValidClassList(inputClassName: string): string {
        let result: string = inputClassName;
        if (!isNullOrUndefined(inputClassName) && inputClassName !== '') {
            result = (inputClassName.replace(/\s+/g, ' ')).trim();
        }
        return result;
    }

    export function updateHTMLAttributesToWrapper(htmlAttributes : {[key: string]: string}, container: HTMLElement): void {
        if (!isNullOrUndefined(htmlAttributes)) {
            for (const key of Object.keys(htmlAttributes)) {
                if (containerAttributes.indexOf(key) > -1) {
                    if (key === 'class') {
                        const updatedClassValues: string = this.getInputValidClassList(htmlAttributes[`${key}`]);
                        if (updatedClassValues !== '') {
                            addClass([container], updatedClassValues.split(' '));
                        }
                    } else if (key === 'style') {
                        let setStyle: string = container.getAttribute(key);
                        setStyle = !isNullOrUndefined(setStyle) ? (setStyle + htmlAttributes[`${key}`]) :
                            htmlAttributes[`${key}`];
                        container.setAttribute(key, setStyle);
                    } else {
                        container.setAttribute(key, htmlAttributes[`${key}`]);
                    }
                }
            }
        }
    }

    export function isBlank(inputString: string): boolean {
        return (!inputString || /^\s*$/.test(inputString));
    }
}
/* eslint-enable no-inner-declarations */

interface ClassNames {
    RTL: string
    DISABLE: string
    INPUT: string
    TEXTAREA: string
    INPUTGROUP: string
    FLOATINPUT: string
    FLOATLINE: string
    FLOATTEXT: string
    FLOATTEXTCONTENT: string
    CLEARICON: string
    CLEARICONHIDE: string
    LABELTOP: string
    LABELBOTTOM: string
    NOFLOATLABEL: string
    INPUTCUSTOMTAG: string
    FLOATCUSTOMTAG: string
}
export interface InputObject {
    container?: HTMLElement
    buttons?: HTMLElement[]
    clearButton?: HTMLElement
}
/**
 * Arguments to create input element for input text boxes utility.These properties are optional.
 */
export interface InputArgs {
    /**
     * Element which is needed to add to the container.
     * ```
     * E.g : Input.createInput({ element: element });
     * ```
     */
    element: HTMLInputElement | HTMLTextAreaElement
    /**
     * ```
     * E.g : Input.createInput({ element: element, buttons: ['e-icon-up', 'e-icon-down'] });
     * ```
     * Specifies the icon classes for span element which will be append to the container.
     */
    buttons?: string[]
    /**
     * ```
     * E.g : Input.createInput({ element: element, customTag: 'ej2-custom-input' });
     * ```
     * Specifies the custom tag which is acts as container to the input.
     */
    customTag?: string
    /**
     * ```
     * E.g : Input.createInput({ element: element, floatLabelType : "Always" });
     * ```
     * Specifies how the floating label works.
     * Possible values are:
     * * Never - Never float the label in the input when the placeholder is available.
     * * Always - The floating label will always float above the input.
     * * Auto - The floating label will float above the input after focusing or entering a value in the input.
     */
    floatLabelType ?: FloatLabelType | string
    /**
     * ```
     * E.g : Input.createInput({ element: element, customTag: 'ej2-custom-input' ,bindClearAction: false });
     * ```
     * Specifies whether to bind the clear button action in input base or not.
     */
    bindClearAction?: boolean
    /**
     * ```
     * E.g : Input.createInput({ element: element, properties: { readonly: true, placeholder: 'Search here' } });
     * ```
     * To specifies the properties such as readonly,enable rtl,etc.
     */
    properties?: {
        readonly?: boolean
        placeholder?: string
        cssClass?: string
        enableRtl?: boolean
        enabled?: boolean
        showClearButton?: boolean
    }
}
/**
 * Default required properties for input components.
 */
export interface IInput {
    /**
     * Sets the placeholder value to input.
     */
    placeholder: string
    /**
     * Sets the css class value to input.
     */
    cssClass: string
    /**
     * Sets the enabled value to input.
     */
    enabled?: boolean
    /**
     * Sets the readonly value to input.
     */
    readonly: boolean
    /**
     * Sets the enable rtl value to input.
     */
    enableRtl: boolean
    /**
     * Specifies whether to display the Clear button in the input.
     */
    showClearButton?: boolean
    /**
     * Specifies how the floating label works.
     * Possible values are:
     * * Never - Never float the label in the input when the placeholder is available.
     * * Always - The floating label will always float above the input.
     * * Auto - The floating label will float above the input after focusing or entering a value in the input.
     */
    floatLabelType?: FloatLabelType | string
    /**
     * Sets the change event mapping function to input.
     */
    change: Function
}

export type createElementParams = (
    tag: string,
    prop?: { id?: string; className?: string; innerHTML?: string; styles?: string; attrs?: { [key: string]: string } }
) => HTMLElement;

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
/* eslint-enable valid-jsdoc, jsdoc/require-jsdoc, jsdoc/require-returns, jsdoc/require-param */
