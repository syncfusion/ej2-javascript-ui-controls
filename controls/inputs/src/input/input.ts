import { createElement, attributes, addClass, removeClass, detach, classList } from '@syncfusion/ej2-base';
import { closest, formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
const CLASSNAMES: ClassNames = {
    RTL: 'e-rtl',
    DISABLE: 'e-disabled',
    INPUT: 'e-input',
    TEXTAREA: 'e-multi-line-input',
    INPUTGROUP: 'e-input-group',
    FLOATINPUT: 'e-float-input',
    FLOATLINE: 'e-float-line',
    FLOATTEXT: 'e-float-text',
    CLEARICON: 'e-clear-icon',
    CLEARICONHIDE: 'e-clear-icon-hide',
    LABELTOP: 'e-label-top',
    LABELBOTTOM: 'e-label-bottom',
    NOFLOATLABEL: 'e-no-float-label',
    INPUTCUSTOMTAG: 'e-input-custom-tag',
    FLOATCUSTOMTAG: 'e-float-custom-tag'
};

/**
 * Defines floating label type of the input and decides how the label should float on the input.
 */
export type FloatLabelType = 'Never' | 'Always' | 'Auto';

/**
 * Base for Input creation through util methods.
 */
export namespace Input {
    let privateInputObj: InputObject = {
        container: null,
        buttons: [],
        clearButton: null
    };
    let floatType: string;

   /**
    * Create a wrapper to input element with multiple span elements and set the basic properties to input based components.
    * ```
    * E.g : Input.createInput({ element: element, floatLabelType : "Auto", properties: { placeholder: 'Search' } });
    * ```
    * @param args
    */
    export function createInput(args: InputArgs, internalCreateElement ?: createElementParams): InputObject {
        let makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        let inputObject: InputObject = { container: null, buttons: [], clearButton: null };
        floatType = args.floatLabelType;
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
            args.properties.showClearButton && args.element.tagName !== 'TEXTAREA') {
            setClearButton(args.properties.showClearButton, args.element, inputObject, true, makeElement);
            inputObject.clearButton.setAttribute('role', 'button');
            if (inputObject.container.classList.contains(CLASSNAMES.FLOATINPUT)) {
                addClass([inputObject.container], CLASSNAMES.INPUTGROUP);
            }
        }
        if (!isNullOrUndefined(args.buttons) && args.element.tagName !== 'TEXTAREA') {
            for (let i: number = 0; i < args.buttons.length; i++) {
                inputObject.buttons.push(appendSpan(args.buttons[i], inputObject.container, makeElement));
            }
        }
        if (!isNullOrUndefined(args.element) && args.element.tagName === 'TEXTAREA') {
            addClass([inputObject.container], CLASSNAMES.TEXTAREA);
        }
        inputObject = setPropertyValue(args, inputObject);
        privateInputObj = inputObject;
        return inputObject;
    }

    export function bindInitialEvent(args: InputArgs): void {
        checkInputValue(args.floatLabelType, args.element as HTMLInputElement);
        args.element.addEventListener('focus', function() : void {
          let parent: HTMLElement = getParentNode(this);
          if (parent.classList.contains('e-input-group') || parent.classList.contains('e-outline')
             || parent.classList.contains('e-filled')) {
           parent.classList.add('e-input-focus');
          }
        });
        args.element.addEventListener('blur', function() : void {
          let parent: HTMLElement = getParentNode(this);
          if (parent.classList.contains('e-input-group') || parent.classList.contains('e-outline')
             || parent.classList.contains('e-filled')) {
           parent.classList.remove('e-input-focus');
          }
        });
        args.element.addEventListener('input', () : void => {
            checkInputValue(floatType, args.element as HTMLInputElement);
        });
    }
    function checkInputValue(floatLabelType: string, inputElement: HTMLInputElement): void {
        let inputValue: string = inputElement.value;
        if (inputValue !== '' && !isNullOrUndefined(inputValue)) {
            inputElement.parentElement.classList.add('e-valid-input');
        } else if (floatLabelType !== 'Always' && inputElement.parentElement) {
            inputElement.parentElement.classList.remove('e-valid-input');
        }
    }

    function _focusFn (): void {
      let label: HTMLElement = <HTMLElement> getParentNode(this).getElementsByClassName('e-float-text')[0];
      if (!isNullOrUndefined(label)) {
        addClass ([label], CLASSNAMES.LABELTOP);
        if (label.classList.contains(CLASSNAMES.LABELBOTTOM)) { removeClass([label], CLASSNAMES.LABELBOTTOM); }
      }
    }

    function _blurFn (): void {
      let parent: HTMLElement = getParentNode(this);
      if ((parent.getElementsByTagName('textarea')[0]) ? parent.getElementsByTagName('textarea')[0].value === '' :
        parent.getElementsByTagName('input')[0].value === '') {
        let label: HTMLElement = <HTMLElement> parent.getElementsByClassName('e-float-text')[0];
        if (!isNullOrUndefined(label)) {
            if (label.classList.contains(CLASSNAMES.LABELTOP)) { removeClass([label], CLASSNAMES.LABELTOP); }
            addClass([label], CLASSNAMES.LABELBOTTOM); }
        }
    }

    export function wireFloatingEvents(element: HTMLInputElement | HTMLTextAreaElement): void {
      element.addEventListener('focus', _focusFn);
      element.addEventListener('blur', _blurFn);
    }
    function unwireFloatingEvents(element: HTMLElement): void {
      element.removeEventListener('focus', _focusFn);
      element.removeEventListener('blur', _blurFn);
    }
    function createFloatingInput(args: InputArgs, inputObject: InputObject, internalCreateElement ?: createElementParams): void {
        let makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        let inputElement: HTMLElement;
        let floatLinelement: HTMLElement;
        let floatLabelElement: HTMLElement;
        if (args.floatLabelType === 'Auto') {
            wireFloatingEvents(args.element);
        }
        if (isNullOrUndefined(inputObject.container)) {
            inputObject.container = createInputContainer(args, CLASSNAMES.FLOATINPUT, CLASSNAMES.FLOATCUSTOMTAG, 'div', makeElement);
            args.element.parentNode.insertBefore(inputObject.container, args.element);
        } else {
            if (!isNullOrUndefined(args.customTag)) {
              inputObject.container.classList.add(CLASSNAMES.FLOATCUSTOMTAG); }
            inputObject.container.classList.add(CLASSNAMES.FLOATINPUT);
        }
        floatLinelement = makeElement('span', { className: CLASSNAMES.FLOATLINE });
        floatLabelElement = makeElement('label', { className: CLASSNAMES.FLOATTEXT });
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
            let inputWrap: HTMLElement = inputObject.container.querySelector('.e-input-in-wrap') as HTMLElement;
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
            args.element.addEventListener('input', (event: KeyboardEvent) => {
                updateLabelState(args.element.value, floatLabelElement);
            });
            args.element.addEventListener('blur', (event: FocusEvent) => {
                updateLabelState(args.element.value, floatLabelElement);
            });
        }
        if (!isNullOrUndefined(args.element.getAttribute('id'))) {
            floatLabelElement.setAttribute('for', args.element.getAttribute('id'));
        }
    }

    function checkFloatLabelType(type: string , container: HTMLElement): void {
        if (type === 'Always' && container.classList.contains('e-outline')) {
            container.classList.add('e-valid-input');
        }
    }

    function setPropertyValue(args: InputArgs, inputObject: InputObject): InputObject {
      if (!isNullOrUndefined(args.properties)) {
        for (let prop of Object.keys(args.properties)) {
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

    function updateIconState(value: string | number, button: HTMLElement): void {
        if (value) {
            removeClass([button], CLASSNAMES.CLEARICONHIDE);
        } else {
            addClass([button], CLASSNAMES.CLEARICONHIDE);
        }
    }

    function updateLabelState(value: string | number, label: HTMLElement): void {
      if (value) {
        addClass([label], CLASSNAMES.LABELTOP);
        if (label.classList.contains(CLASSNAMES.LABELBOTTOM)) { removeClass([label], CLASSNAMES.LABELBOTTOM); }
      } else {
        if (label.classList.contains(CLASSNAMES.LABELTOP)) { removeClass([label], CLASSNAMES.LABELTOP); }
        addClass([label], CLASSNAMES.LABELBOTTOM);
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
        let makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        let button: HTMLElement = <HTMLElement>makeElement('span', { className: CLASSNAMES.CLEARICON });
        let container: HTMLElement = inputObject.container;
        if (!isNullOrUndefined(initial)) {
            container.appendChild(button);
        } else {
            let baseElement: HTMLElement = inputObject.container.classList.contains(CLASSNAMES.FLOATINPUT) ?
            inputObject.container.querySelector('.' + CLASSNAMES.FLOATTEXT) as HTMLElement : element;
            baseElement.insertAdjacentElement('afterend', button);
        }
        if (!isNullOrUndefined(container) &&
        container.classList.contains(CLASSNAMES.FLOATINPUT)) {
            addClass([container], CLASSNAMES.INPUTGROUP);
        }
        addClass([button], CLASSNAMES.CLEARICONHIDE);
        wireClearBtnEvents(element, button, container);
        button.setAttribute('aria-label', 'close');
        return button;
    }

    export function wireClearBtnEvents(element: HTMLInputElement | HTMLTextAreaElement, button: HTMLElement, container: HTMLElement): void {
      button.addEventListener('click', (event: MouseEvent) => {
        if (!(element.classList.contains(CLASSNAMES.DISABLE) || element.readOnly)) {
          event.preventDefault();
          if (element !== document.activeElement) { element.focus(); }
          element.value = '';
          addClass([button], CLASSNAMES.CLEARICONHIDE);
        }
      });
      element.addEventListener('input', (event: KeyboardEvent ) => {
        updateIconState(element.value, button);
      });
      element.addEventListener('focus', (event: FocusEvent) => {
        updateIconState(element.value, button);
      });
      element.addEventListener('blur', (event: FocusEvent) => {
        setTimeout (() => { addClass([button], CLASSNAMES.CLEARICONHIDE); }, 200);
      });
    }

    function validateLabel(element: HTMLInputElement | HTMLTextAreaElement, floatLabelType: string) : void {
        let parent: HTMLElement = getParentNode(element);
        if (parent.classList.contains(CLASSNAMES.FLOATINPUT) && floatLabelType === 'Auto') {
            let label: HTMLElement = <HTMLElement> getParentNode(element).getElementsByClassName('e-float-text')[0];
            updateLabelState(element.value, label);
        }
    }

   /**
    * To create input box contianer.
    */
    function createInputContainer(args: InputArgs, className: string, tagClass: string, tag: string,
                                  internalCreateElement ?: createElementParams): HTMLElement {
        let makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
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
        let result: string = '';
        if (!isNullOrUndefined(placeholder) && placeholder !== '') {
            let spanEle: HTMLElement = document.createElement('span');
            spanEle.innerHTML = '<input  placeholder="' + placeholder + '"/>';
            let hiddenInput: HTMLInputElement = (spanEle.children[0]) as HTMLInputElement;
            result = hiddenInput.placeholder;
        }
        return result;
    }

   /**
    * Sets the value to the input element.
    * ```
    * E.g : Input.setValue('content', element, "Auto", true );
    * ```
    * @param value - Specify the value of the input element.
    * @param element - The element on which the specified value is updated.
    * @param floatLabelType - Specify the float label type of the input element.
    * @param clearButton - Boolean value to specify whether the clear icon is enabled / disabled on the input.
    */
    export function setValue(value: string, element: HTMLInputElement | HTMLTextAreaElement,
                             floatLabelType ?: string, clearButton?: boolean): void {
        element.value = value;
        if ((!isNullOrUndefined(floatLabelType)) && floatLabelType === 'Auto') {
            validateLabel(element, floatLabelType);
        }
        if (!isNullOrUndefined(clearButton) && clearButton ) {
            let parentElement: HTMLElement = <HTMLElement> getParentNode(element);
            if (!isNullOrUndefined(parentElement)) {
                let button: HTMLElement = <HTMLElement> parentElement.getElementsByClassName(CLASSNAMES.CLEARICON)[0];
                if (element.value && parentElement.classList.contains('e-input-focus')) {
                    removeClass([button], CLASSNAMES.CLEARICONHIDE);
                } else {
                    addClass([button], CLASSNAMES.CLEARICONHIDE);
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
    * @param cssClass - Css class names which are needed to add.
    * @param elements - The elements which are needed to add / remove classes.
    * @param oldClass - Css class names which are needed to remove. If old classes are need to remove, can give this optional parameter.
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
    * Set the width to the wrapper of input element.
    * ```
    * E.g : Input.setWidth('200px', container);
    * ```
    * @param width - Width value which is need to add.
    * @param container - The element on which the width is need to add.
    */
    export function setWidth(width: number | string, container: HTMLElement): void {
        if (typeof width === 'number') {
            container.style.width = formatUnit(width);
        } else if (typeof width === 'string') {
            container.style.width = (width.match(/px|%|em/)) ? <string>(width) : <string>(formatUnit(width));
        }
    }

   /**
    * Set the placeholder attribute to the input element.
    * ```
    * E.g : Input.setPlaceholder('Search here', element);
    * ```
    * @param placeholder - Placeholder value which is need to add.
    * @param element - The element on which the placeholder is need to add.
    */
    export function setPlaceholder(placeholder: string, element: HTMLInputElement | HTMLTextAreaElement): void {
        let parentElement: HTMLElement;
        placeholder = encodePlaceHolder(placeholder);
        parentElement = getParentNode(element);
        if (parentElement.classList.contains(CLASSNAMES.FLOATINPUT)) {
         if (!isNullOrUndefined(placeholder) && placeholder !== '') {
           parentElement.getElementsByClassName(CLASSNAMES.FLOATTEXT)[0].textContent = placeholder;
           parentElement.classList.remove(CLASSNAMES.NOFLOATLABEL);
           element.removeAttribute('placeholder');
         } else {
           parentElement.classList.add(CLASSNAMES.NOFLOATLABEL);
           parentElement.getElementsByClassName(CLASSNAMES.FLOATTEXT)[0].textContent = '';
         }
        } else {
         if (!isNullOrUndefined(placeholder) && placeholder !== '') {
            attributes(element, { 'placeholder': placeholder, 'aria-placeholder':  placeholder});
         } else {
            element.removeAttribute('placeholder');
            element.removeAttribute('aria-placeholder');
         }
        }
    }
   /**
    * Set the read only attribute to the input element
    * ```
    * E.g : Input.setReadonly(true, element);
    * ```
    * @param isReadonly
    * - Boolean value to specify whether to set read only. Setting "True" value enables read only.
    * @param element
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
    * @param isRtl
    * - Boolean value to specify whether to set RTL. Setting "True" value enables the RTL mode.
    * @param elements
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
    * @param isEnable
    * - Boolean value to specify whether to enable or disable.
    * @param element
    * - Element to be enabled or disabled.
    */
    export function setEnabled(isEnable: boolean, element: HTMLInputElement | HTMLTextAreaElement, floatLabelType ?: string ,
                               inputContainer?: HTMLElement ): void {
        let disabledAttrs: { [key: string]: string } = { 'disabled': 'disabled', 'aria-disabled': 'true' };
        let considerWrapper: boolean = isNullOrUndefined(inputContainer) ? false : true;
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
        let makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        if (isClear) {
            inputObject.clearButton = createClearButton (element, inputObject, initial, makeElement);
        } else {
            inputObject.clearButton.remove();
            inputObject.clearButton = null;
        }
    }
   /**
    * Removing the multiple attributes from the given element such as "disabled","id" , etc.
    * ```
    * E.g : Input.removeAttributes({ 'disabled': 'disabled', 'aria-disabled': 'true' }, element);
    * ```
    * @param attrs
    *  - Array of attributes which are need to removed from the element.
    * @param element
    *  - Element on which the attributes are needed to be removed.
    */
    export function removeAttributes(attrs: { [key: string]: string }, element: HTMLInputElement | HTMLElement): void {
        for (let key of Object.keys(attrs)) {
            let parentElement: HTMLElement;
            parentElement = getParentNode(element);
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
     * @param attrs
     * - Array of attributes which is added to element.
     * @param element
     * - Element on which the attributes are needed to be added.
     */
    export function addAttributes(attrs: { [key: string]: string }, element: HTMLInputElement | HTMLElement): void {
      for (let key of Object.keys(attrs)) {
            let parentElement: HTMLElement;
            parentElement = getParentNode(element);
            if (key === 'disabled') {
                element.classList.add(CLASSNAMES.DISABLE);
            }
            if (key === 'disabled' && parentElement.classList.contains(CLASSNAMES.INPUTGROUP)) {
                parentElement.classList.add(CLASSNAMES.DISABLE);
            }
            if (key === 'placeholder' && parentElement.classList.contains(CLASSNAMES.FLOATINPUT)) {
             parentElement.getElementsByClassName(CLASSNAMES.FLOATTEXT)[0].textContent = attrs[key];
            } else {
                element.setAttribute(key, attrs[key]);
            }
      }
    }
    export function removeFloating(input: InputObject): void {
      let container: HTMLElement = input.container;
      if (!isNullOrUndefined(container) && container.classList.contains(CLASSNAMES.FLOATINPUT)) {
        let inputEle: HTMLElement = container.querySelector('textarea') ? <HTMLElement>container.querySelector('textarea') :
        <HTMLElement>container.querySelector('input');
        let placeholder: string = container.querySelector('.' + CLASSNAMES.FLOATTEXT).textContent;
        let clearButton: boolean = container.querySelector('.e-clear-icon') !== null;
        detach(container.querySelector('.' + CLASSNAMES.FLOATLINE));
        detach(container.querySelector('.' + CLASSNAMES.FLOATTEXT));
        classList(container, [CLASSNAMES.INPUTGROUP], [CLASSNAMES.FLOATINPUT]);
        unwireFloatingEvents(inputEle);
        attributes(inputEle, { 'placeholder': placeholder });
        inputEle.classList.add(CLASSNAMES.INPUT);
        if (!clearButton && inputEle.tagName === 'INPUT') { inputEle.removeAttribute('required'); }
      }
    }
    export function addFloating(input: HTMLInputElement | HTMLTextAreaElement, type: FloatLabelType | string, placeholder: string,
                                internalCreateElement ?: createElementParams): void {
      let makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
      let container: HTMLElement = <HTMLElement>closest(input, '.' + CLASSNAMES.INPUTGROUP);
      floatType = type;
      if (type !== 'Never') {
      let customTag: string = container.tagName;
      customTag = customTag !== 'DIV' && customTag !== 'SPAN' ? customTag : null;
      let args: InputArgs = {element: input, floatLabelType: type , customTag: customTag, properties : {placeholder : placeholder } };
      let iconEle: HTMLElement = <HTMLElement>container.querySelector('.e-clear-icon');
      let inputObj: InputObject = { container: container};
      input.classList.remove(CLASSNAMES.INPUT);
      createFloatingInput(args, inputObj, makeElement);
      let isPrependIcon: boolean = container.classList.contains('e-float-icon-left');
      if (isNullOrUndefined(iconEle)) {
        if (isPrependIcon) {
          let inputWrap: HTMLElement = container.querySelector('.e-input-in-wrap')as HTMLElement;
          iconEle = inputWrap.querySelector('.e-input-group-icon') as HTMLElement;
        } else {
          iconEle = container.querySelector('.e-input-group-icon') as HTMLElement;
        }
      }
      if (isNullOrUndefined(iconEle)) {
          if (isPrependIcon) {
            iconEle = container.querySelector('.e-input-group-icon') as HTMLElement;
          }
          if (isNullOrUndefined(iconEle)) {
            container.classList.remove(CLASSNAMES.INPUTGROUP);
          }
        } else {
          let floatLine: HTMLElement = <HTMLElement>container.querySelector('.' + CLASSNAMES.FLOATLINE);
          let floatText: HTMLElement = <HTMLElement>container.querySelector('.' + CLASSNAMES.FLOATTEXT);
          let wrapper: HTMLElement = isPrependIcon ? container.querySelector('.e-input-in-wrap') as HTMLElement : container;
          wrapper.insertBefore(input, iconEle);
          wrapper.insertBefore(floatLine, iconEle);
          wrapper.insertBefore(floatText, iconEle);
        }
      }
      checkFloatLabelType(type, input.parentElement);
    }

   /**
    * Enable or Disable the ripple effect on the icons inside the Input. Ripple effect is only applicable for material theme.
    * ```
    * E.g : Input.setRipple(true, [inputObjects]);
    * ```
    * @param isRipple
    * - Boolean value to specify whether to enable the ripple effect.
    * @param inputObject
    * - Specify the collection of input objects.
    */
    export function setRipple (isRipple: boolean, inputObj: InputObject[]): void {
        for (let i: number = 0 ; i < inputObj.length ; i++ ) {
            _internalRipple(isRipple, inputObj[i].container);
        }
    }

    function _internalRipple(isRipple: boolean, container: HTMLElement, button?: HTMLElement): void {
        let argsButton: HTMLElement[] = [];
        argsButton.push(button);
        let buttons : Element[] =  isNullOrUndefined(button) ?
        <NodeListOf<Element> & Element[]>container.querySelectorAll('.e-input-group-icon') : argsButton;
        if ( isRipple && buttons.length > 0) {
          for ( let index: number = 0 ; index < buttons.length; index++ ) {
            buttons[index].addEventListener('mousedown', _onMouseDownRipple , false);
            buttons[index].addEventListener('mouseup', _onMouseUpRipple , false);
          }
        } else if (buttons.length > 0) {
            for ( let index: number = 0 ; index < buttons.length; index++ ) {
                buttons[index].removeEventListener('mousedown', _onMouseDownRipple, this);
                buttons[index].removeEventListener('mouseup', _onMouseUpRipple, this);
            }
        }
    }

    function _onMouseRipple (container?: HTMLElement, button?: Element): void {
        if (!container.classList.contains('e-disabled') && !container.querySelector('input').readOnly ) {
            button.classList.add('e-input-btn-ripple');
        }
    }

    function _onMouseDownRipple(): void {
        let ele: HTMLElement = this;
        let parentEle: HTMLElement = this.parentElement;
        while (!parentEle.classList.contains('e-input-group')) {
            parentEle = parentEle.parentElement;
        }
        _onMouseRipple(parentEle , ele);
    }

    function _onMouseUpRipple (): void {
        let ele: HTMLElement = this;
        setTimeout(
         () => { ele.classList.remove('e-input-btn-ripple'); },
         500);
    }
    function createIconEle(iconClass: string, makeElement: createElementParams): HTMLElement {
        let button: HTMLElement = <HTMLElement>makeElement('span', { className: iconClass });
        button.classList.add('e-input-group-icon');
        return button;
    }

   /**
    * Creates a new span element with the given icons added and append it in container element.
    * ```
    * E.g : Input.addIcon('append', 'e-icon-spin', inputObj.container, inputElement);
    * ```
    * @param position - Specify the icon placement on the input.Possible values are append and prepend.
    * @param iconClass - Icon classes which are need to add to the span element which is going to created.
    * Span element acts as icon or button element for input.
    * @param container - The container on which created span element is going to append.
    * @param inputElement - The inputElement on which created span element is going to prepend.
    */
   // tslint:disable
    export function addIcon(position: string, icons: string | string[], container: HTMLElement,
        input: HTMLElement, internalCreate?: createElementParams): void {
  // tslint:enable
        let result: string[] = typeof(icons) === 'string' ? icons.split(',')
        : icons;
        if (position.toLowerCase() === 'append') {
            for (let icon of result) {
                appendSpan(icon, container, internalCreate);
            }
        } else {
            for (let icon of result) {
                prependSpan(icon, container, input, internalCreate);
            }
        }
    }

   /**
    * Creates a new span element with the given icons added and prepend it in input element.
    * ```
    * E.g : Input.prependSpan('e-icon-spin', inputObj.container, inputElement);
    * ```
    * @param iconClass - Icon classes which are need to add to the span element which is going to created.
    * Span element acts as icon or button element for input.
    * @param container - The container on which created span element is going to append.
    * @param inputElement - The inputElement on which created span element is going to prepend.
    */
   // tslint:disable
    export function prependSpan(iconClass: string, container: HTMLElement,
        inputElement: HTMLElement, internalCreateElement?: createElementParams): HTMLElement {
  // tslint:enable
        let makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        let button: HTMLElement = createIconEle(iconClass, makeElement);
        container.classList.add('e-float-icon-left');
        let innerWrapper: HTMLElement = container.querySelector('.e-input-in-wrap');
        if (isNullOrUndefined(innerWrapper)) {
            innerWrapper = <HTMLElement>makeElement('span', { className: 'e-input-in-wrap' });
            inputElement.parentNode.insertBefore(innerWrapper, inputElement);
            let result: NodeListOf<Element> = container.querySelectorAll(inputElement.tagName + ' ~ *');
            innerWrapper.appendChild(inputElement);
            for (let i: number = 0; i < result.length; i++) {
                innerWrapper.appendChild(result[i]);
            }
        }
        innerWrapper.parentNode.insertBefore(button, innerWrapper);
        if (!container.classList.contains(CLASSNAMES.INPUTGROUP)) {
            container.classList.add(CLASSNAMES.INPUTGROUP);
        }
        _internalRipple(true, container, button);
        return button;
    }

   /**
    * Creates a new span element with the given icons added and append it in container element.
    * ```
    * E.g : Input.appendSpan('e-icon-spin', inputObj.container);
    * ```
    * @param iconClass - Icon classes which are need to add to the span element which is going to created.
    * Span element acts as icon or button element for input.
    * @param container - The container on which created span element is going to append.
    */
    export function appendSpan(iconClass: string, container: HTMLElement, internalCreateElement ?: createElementParams): HTMLElement {
        let makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        let button: HTMLElement = createIconEle(iconClass, makeElement);
        if (!container.classList.contains(CLASSNAMES.INPUTGROUP)) {
          container.classList.add(CLASSNAMES.INPUTGROUP);
        }
        let wrap: HTMLElement = (container.classList.contains('e-float-icon-left')) ? container.querySelector('.e-input-in-wrap') :
        container;
        wrap.appendChild(button);
        _internalRipple(true, container, button);
        return button;
    }
}
interface ClassNames {
    RTL: string;
    DISABLE: string;
    INPUT: string;
    TEXTAREA: string;
    INPUTGROUP: string;
    FLOATINPUT: string;
    FLOATLINE: string;
    FLOATTEXT: string;
    CLEARICON: string;
    CLEARICONHIDE: string;
    LABELTOP: string;
    LABELBOTTOM: string;
    NOFLOATLABEL: string;
    INPUTCUSTOMTAG: string;
    FLOATCUSTOMTAG: string;
}
export interface InputObject {
    container?: HTMLElement;
    buttons?: HTMLElement[];
    clearButton?: HTMLElement;
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
    element: HTMLInputElement | HTMLTextAreaElement;
   /**
    * ```
    * E.g : Input.createInput({ element: element, buttons: ['e-icon-up', 'e-icon-down'] });
    * ```
    * Specifies the icon classes for span element which will be append to the container.
    */
    buttons?: string[];
   /**
    * ```
    * E.g : Input.createInput({ element: element, customTag: 'ej2-custom-input' });
    * ```
    * Specifies the custom tag which is acts as container to the input.
    */
    customTag?: string;
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
    floatLabelType ?: FloatLabelType | string;
   /**
    * ```
    * E.g : Input.createInput({ element: element, properties: { readonly: true, placeholder: 'Search here' } });
    * ```
    * To specifies the properties such as readonly,enable rtl,etc.
    */
    properties?: {
        readonly?: boolean;
        placeholder?: string;
        cssClass?: string;
        enableRtl?: boolean;
        enabled?: boolean;
        showClearButton?: boolean;
    };
}
/**
 * Default required properties for input components.
 */
export interface IInput {
    /**
     *  Sets the placeholder value to input.
     */
    placeholder: string;
    /**
     *  Sets the css class value to input.
     */
    cssClass: string;
    /**
     *  Sets the enabled value to input.
     */
    enabled?: boolean;
    /**
     *  Sets the readonly value to input.
     */
    readonly: boolean;
    /**
     *  Sets the enable rtl value to input.
     */
    enableRtl: boolean;
    /**
     *  Specifies whether to display the Clear button in the input.
     */
    showClearButton?: boolean;
    /**
     * Specifies how the floating label works.
     * Possible values are:
     * * Never - Never float the label in the input when the placeholder is available.
     * * Always - The floating label will always float above the input.
     * * Auto - The floating label will float above the input after focusing or entering a value in the input.
     */
    floatLabelType?: FloatLabelType | string;
    /**
     *  Sets the change event mapping function to input.
     */
    change: Function;
}

export type createElementParams = (
    tag: string,
    prop?: { id?: string, className?: string, innerHTML?: string, styles?: string, attrs?: { [key: string]: string } }
) => HTMLElement;

/**
 * Defines the argument for the focus event.
 */
export interface FocusEventArgs {
    model?: Object;

}

/**
 * Defines the argument for the blur event.
 */
export interface BlurEventArgs {
    model?: Object;

}