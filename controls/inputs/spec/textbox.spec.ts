/**
 * TextBox spec document
 */
import { createElement, L10n, EmitType, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TextBox } from '../src/textbox/textbox';

describe('TextBox ', () => {
    describe('Basics', () => {
        let inputObj: any;
        beforeAll((): void => {
            let element: HTMLInputElement = createElement('input', {id: 'textbox'}) as HTMLInputElement;
            element.value = 'syncfusion';
            document.body.appendChild(element);
            inputObj = new TextBox();
            inputObj.appendTo(document.getElementById('textbox'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('get value from HTML tag element', () => {
            expect(inputObj.value).toBe(inputObj.element.value);
        });
        it('get module name', () => {
            expect(inputObj.getModuleName()).toBe('textbox');
        });
        it('control class validation', () => {
            expect(inputObj.element.classList.contains('e-control')).toBe(true);
            expect(inputObj.element.classList.contains('e-textbox')).toBe(true);
        })
        it('default value validation', () => {
            expect(inputObj.floatLabelType).toBe('Never');
            expect(inputObj.placeholder).toBe(null);
            expect(inputObj.enableRtl).toBe(false);
            expect(inputObj.enabled).toBe(true);
        })
        it('element structure testing', () => {
            expect(inputObj.element.parentElement.classList.contains('e-input-group')).toBe(true);
        });

    });
    describe('Initial rendering testing - ', () => {
        let inputObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {className: 'textbox'});
            element.setAttribute('disabled', 'true');
            element.setAttribute('readonly', 'true');
            element.setAttribute('placeholder', 'Enter a value');
            document.body.appendChild(element);
            inputObj = new TextBox({ value: "Syncfusion"});
            inputObj.appendTo('.textbox');
        })
        afterAll((): void => {
            inputObj.destroy();
            document.body.innerHTML = '';
        });
        it ('value property ', () => {
            expect(inputObj.value).toBe('Syncfusion');
            expect(inputObj.element.value).toBe('Syncfusion');
        })
        it ('name attribute ', () => {
            expect(inputObj.element.getAttribute('name')).toBe(inputObj.element.getAttribute('id'));
        })
        it('attributes with initial rendering', () => {
            expect(inputObj.element.classList.contains('e-disabled')).toBe(true);
            expect(inputObj.enabled).toBe(false);
            expect(inputObj.element.hasAttributes('readonly')).toBe(true);
            expect(inputObj.readonly).toBe(true);
            expect(inputObj.element.placeholder).toBe('Enter a value');
        });
    });
    describe('Method testing - ', () => {
        let inputObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
            inputObj = new TextBox();
            inputObj.appendTo(document.getElementById('textbox'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('get module name', () => {
            expect(inputObj.getModuleName()).toBe('textbox');
        });
        it('addAttribute with properties', () => {
            let attrs: Object = {disabled: true, readonly: true, placeholder: 'Enter a name', select: 'selected'};
            inputObj.addAttributes(attrs);
            expect(inputObj.element.classList.contains('e-disabled')).toBe(true);
            expect(inputObj.enabled).toBe(false);
            expect(inputObj.element.hasAttributes('readonly')).toBe(true);
            expect(inputObj.readonly).toBe(true);
            expect(inputObj.element.placeholder).toBe('Enter a name');
            expect(inputObj.element.hasAttributes('select')).toBe(true);
            let clsAttrs: Object = {class: 'new-class'};
            inputObj.addAttributes(clsAttrs);
            expect(inputObj.element.classList.contains('new-class')).toBe(true);
        });
        it('getpersistData', () => {
            inputObj.getPersistData();
            expect(inputObj.element.value).toBe('');
        });
        it('removeAttributes with properties', () => {
            let attrs: Object = ['disabled', 'readonly', 'placeholder', 'select'];
            inputObj.removeAttributes(attrs);
            expect(inputObj.element.classList.contains('e-disabled')).toBe(false);
            expect(inputObj.enabled).toBe(true);
            expect(inputObj.element.hasAttribute('readonly')).toBe(false);
            expect(inputObj.readonly).toBe(false);
            expect(inputObj.placeholder).toBe(null);
            expect(inputObj.element.hasAttribute('select')).toBe(false);
        });
        it('destroy method', () => {
            inputObj.destroy();
            expect(inputObj.element.classList.contains('e-control')).toBe(false);
            expect(inputObj.element.classList.contains('e-textbox')).toBe(false);
        })
    });
    describe('Localization', () => {
        let textbox: any;
        beforeAll((): void => {
            L10n.load({
                'fr-BE': {
                   'textbox' : {
                    'placeholder' : 'Feuilleter',
                     }
                 }
            });
            let element: HTMLElement = createElement('input', {id: 'input'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            textbox = new TextBox();
            textbox.appendTo(document.getElementById('input'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
            textbox.destroy();
        });
        it('Placeholder Text', () => {
            textbox.locale = 'fr-BE';
            textbox.dataBind();
            expect(textbox.placeholder).toBe('Feuilleter');
        });
    });
    describe('Onproperty changes testing - ', () => {
        let inputObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
            inputObj = new TextBox();
            inputObj.appendTo(document.getElementById('textbox'));
        })
        afterAll((): void => {
            inputObj.destroy();
            document.body.innerHTML = '';
        });
        it('floatLabelType api', () => {
            expect(inputObj.element.parentElement.classList.contains('e-float-input')).toBe(false);
            inputObj.floatLabelType = 'Auto';
            inputObj.dataBind();
            expect(inputObj.element.parentElement.classList.contains('e-float-input')).toBe(true);
        });
        it('enabled api', () => {
            expect(inputObj.element.classList.contains('e-disabled')).toBe(false);
            inputObj.enabled = false;
            inputObj.dataBind();
            expect(inputObj.element.classList.contains('e-disabled')).toBe(true);
        });
        it('enableRtl api', () => {
            expect(inputObj.element.parentElement.classList.contains('e-rtl')).toBe(false);
            inputObj.enableRtl = true;
            inputObj.dataBind();
            expect(inputObj.element.parentElement.classList.contains('e-rtl')).toBe(true);
        });
        it('value api', () => {
            expect(inputObj.element.value).toBe('');
            inputObj.value = 'TextBox';
            inputObj.dataBind();
            expect(inputObj.element.value).toBe('TextBox');
        });
        it('type api', () => {
            expect(inputObj.element.type).toBe('text');
            inputObj.type = 'number';
            inputObj.dataBind();
            expect(inputObj.element.type).toBe('number');
        });
        it('readonly api', () => {
            expect(inputObj.element.hasAttribute('readonly')).toBe(false);
            inputObj.readonly = true;
            inputObj.dataBind();
            expect(inputObj.element.hasAttribute('readonly')).toBe(true);
        });
        it('cssClass api', () => {
            expect(inputObj.element.parentElement.classList.contains('new-class')).toBe(false);
            inputObj.cssClass = 'new-class new-class2';
            inputObj.dataBind();
            expect(inputObj.element.parentElement.classList.contains('new-class')).toBe(true);
            expect(inputObj.element.parentElement.classList.contains('new-class2')).toBe(true);
        });
        it('placeholder api', () => {
            expect(inputObj.placeholder).toBe(null);
            inputObj.placeholder = 'Enter a name';
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.placeholder).not.toBe(null);
            expect(inputObj.element.value).toBe('');
        });
        it('showClearButton api', () => {
            expect(isNullOrUndefined(inputObj.element.parentElement.querySelector('.e-clear-icon'))).toBe(true);
            inputObj.showClearButton = true;
            inputObj.dataBind();
            expect(isNullOrUndefined(inputObj.element.parentElement.querySelector('.e-clear-icon'))).toBe(false);
        });
    });
    describe('Events testing - ', () => {
        let inputObj: any;
        let onfocus: EmitType<Object> = jasmine.createSpy('focus');
        let onBlur: EmitType<Object> = jasmine.createSpy('blur');
        let onInput: EmitType<Object> = jasmine.createSpy('blur');
        let onChange: EmitType<Object> = jasmine.createSpy('change');
        let originalTimeout: number;
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
            inputObj = new TextBox({focus: onfocus, blur: onBlur, change: onChange, input: onInput, showClearButton: true});
            inputObj.appendTo(document.getElementById('textbox'));
        })
        afterAll((): void => {
            inputObj.destroy();
            document.body.innerHTML = '';
        });
        it('focus event', () => {
            let mouseEvent = document.createEvent('MouseEvents');
            inputObj.focusHandler(mouseEvent);
            expect(onfocus).toHaveBeenCalled();
        });
        it('blur event', () => {
            let mouseEvent = document.createEvent('MouseEvents');
            inputObj.focusOutHandler(mouseEvent);
            expect(onBlur).toHaveBeenCalled();
        });
        it('blur event with change event', () => {
            let mouseEvent = document.createEvent('MouseEvents');
            inputObj.previousValue = '';
            inputObj.element.value = 'Books'
            inputObj.focusOutHandler(mouseEvent);
            expect(onBlur).toHaveBeenCalled();
        });
        it('input event', () => {
            let keyEvent = document.createEvent('KeyboardEvents');
            inputObj.inputHandler(keyEvent);
            expect(onInput).toHaveBeenCalled();
        });
        it('change event', () => {
            inputObj.element.value = 'new value';
            let changeEvent = document.createEvent('Events');
            inputObj.changeHandler(changeEvent);
            expect(onChange).toHaveBeenCalled();
        });
        it('reset value by click on clear button', () => {
            let mouseEvent = document.createEvent('MouseEvents');
            inputObj.textboxWrapper.clearButton.classList.remove('e-clear-icon-hide');
            inputObj.resetInputHandler(mouseEvent);
            expect(inputObj.element.value).toBe('');
            inputObj.textboxWrapper.clearButton.classList.add('e-clear-icon-hide');
            inputObj.resetInputHandler(mouseEvent);
            expect(inputObj.element.value).toBe('');
        });
    });
})
