/**
 * TextArea spec document
 */
import { createElement, L10n, EmitType, extend, EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';
import {TextArea} from '../src/textarea/textarea';

describe('TextArea Component', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe('Basics', () => {
        let textareaObj: any;
        beforeAll((): void => {
            let element: HTMLTextAreaElement = createElement('textarea', {id: 'textarea'}) as HTMLTextAreaElement;
            element.value = 'syncfusion';
            document.body.appendChild(element);
            textareaObj = new TextArea();
            textareaObj.appendTo(document.getElementById('textarea'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('get module name', () => {
            expect(textareaObj.getModuleName()).toBe('textarea');
        });
        it('control class validation', () => {
            expect(textareaObj.element.classList.contains('e-control')).toBe(true);
            expect(textareaObj.element.classList.contains('e-textarea')).toBe(true);
        })
        it('default value validation', () => {
            expect(textareaObj.floatLabelType).toBe('Never');
            expect(textareaObj.placeholder).toBe(null);
            expect(textareaObj.enableRtl).toBe(false);
            expect(textareaObj.enabled).toBe(true);
        })
        it('element structure testing', () => {
            expect(textareaObj.element.parentElement.classList.contains('e-input-group')).toBe(true);
        });

    });
    describe('Initial rendering testing - ', () => {
        let textareaObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('textarea', {className: 'textarea'});
            element.setAttribute('disabled', 'true');
            element.setAttribute('readonly', 'true');
            element.setAttribute('placeholder', 'Enter a value');
            document.body.appendChild(element);
            textareaObj = new TextArea({ value: "Syncfusion"});
            textareaObj.appendTo('.textarea');
        })
        afterAll((): void => {
            textareaObj.destroy();
            document.body.innerHTML = '';
        });
        it ('value property ', () => {
            expect(textareaObj.value).toBe('Syncfusion');
            expect(textareaObj.element.value).toBe('Syncfusion');
        })
        it ('name attribute ', () => {
            expect(textareaObj.element.getAttribute('name')).toBe(textareaObj.element.getAttribute('id'));
        })
        it('attributes with initial rendering', () => {
            expect(textareaObj.element.classList.contains('e-disabled')).toBe(true);
            expect(textareaObj.enabled).toBe(false);
            expect(textareaObj.element.hasAttributes('readonly')).toBe(true);
            expect(textareaObj.readonly).toBe(true);
            expect(textareaObj.element.placeholder).toBe('Enter a value');
        });
    });
    describe('Method testing - ', () => {
        let textareaObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
            textareaObj = new TextArea();
            textareaObj.appendTo(document.getElementById('textarea'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('get module name', () => {
            expect(textareaObj.getModuleName()).toBe('textarea');
        });
        it('addAttribute with properties', () => {
            let attrs: Object = {disabled: true, readonly: true, placeholder: 'Enter a name', select: 'selected'};
            textareaObj.addAttributes(attrs);
            expect(textareaObj.element.classList.contains('e-disabled')).toBe(true);
            expect(textareaObj.enabled).toBe(false);
            expect(textareaObj.element.hasAttributes('readonly')).toBe(true);
            expect(textareaObj.readonly).toBe(true);
            expect(textareaObj.element.placeholder).toBe('Enter a name');
            expect(textareaObj.element.hasAttributes('select')).toBe(true);
            let clsAttrs: Object = {class: 'new-class'};
            textareaObj.addAttributes(clsAttrs);
            expect(textareaObj.element.classList.contains('new-class')).toBe(true);
        });
        it('getpersistData', () => {
            textareaObj.getPersistData();
            expect(textareaObj.element.value).toBe('');
        });
        it('removeAttributes with properties', () => {
            let attrs: Object = ['disabled', 'readonly', 'placeholder', 'select'];
            textareaObj.removeAttributes(attrs);
            expect(textareaObj.element.classList.contains('e-disabled')).toBe(false);
            expect(textareaObj.enabled).toBe(true);
            expect(textareaObj.element.hasAttribute('readonly')).toBe(false);
            expect(textareaObj.readonly).toBe(false);
            expect(textareaObj.placeholder).toBe(null);
            expect(textareaObj.element.hasAttribute('select')).toBe(false);
        });
        it('destroy method', () => {
            textareaObj.destroy();
            expect(textareaObj.element.classList.contains('e-control')).toBe(false);
            expect(textareaObj.element.classList.contains('e-textarea')).toBe(false);
        })
    });
    describe('Localization', () => {
        let textarea: any;
        beforeAll((): void => {
            L10n.load({
                'fr-BE': {
                    'textarea': {
                        'placeholder': 'Entrez la valeur',
                    }
                },
                'de-DE': {
                    'textarea': {
                        'placeholder': 'Wert eingeben',
                    },
                }
            });
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});            
            document.body.appendChild(element);
            textarea = new TextArea({locale: 'fr-BE'});
            textarea.appendTo(document.getElementById('textarea'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
            textarea.destroy();
        });
        it('Placeholder Text', () => {
            expect(textarea.placeholder).toBe('Entrez la valeur');
            textarea.locale = 'de-DE';
            textarea.dataBind();
            expect(textarea.placeholder).toBe('Wert eingeben');
        });
    });
    describe('Checking previous value - ', () => {
        let textareaObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Previous value at initial rendering', () => {
            textareaObj = new TextArea({value: "Syncfusion"});
            textareaObj.appendTo('#textarea');
            textareaObj.element.value = "Software";
            let keyEvent = document.createEvent('KeyboardEvents');
            textareaObj.inputHandler(keyEvent);
            expect(textareaObj.element.value).toBe('Software');
            expect(textareaObj.inputPreviousValue).toBe('Software');
        });
        it('Dynamically change previous value ', () => {
            textareaObj = new TextArea({value: "Syncfusion"});
            textareaObj.appendTo('#textarea');
            textareaObj.value = "Software";
            textareaObj.dataBind();
            let keyEvent = document.createEvent('KeyboardEvents');
            textareaObj.inputHandler(keyEvent);
            expect(textareaObj.element.value).toBe('Software');
            expect(textareaObj.inputPreviousValue).toBe('Software');
        });
    });
    describe('Destroyed textarea - ', () => {
        let textareaObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('destroy method', () => {
            textareaObj = new TextArea();
            textareaObj.appendTo('#textarea');
            textareaObj.destroy();
            expect(textareaObj.element.hasAttribute('aria-labelledby')).toBe(false);
        });
    });
    describe('Checking the width property - ', () => {
        let textareaObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Initial rendering with width as number', () => {
            textareaObj = new TextArea({value: "Syncfusion", width: 500, resizeMode: "None"});
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.style.width).toBe('500px');
        });
        it('Initial rendering with width as string ', () => {
            textareaObj = new TextArea({value: "Syncfusion", width: '200px', resizeMode: "None"});
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.style.width).toBe('200px');
        });
        it('Initial rendering with width as % ', () => {
            textareaObj = new TextArea({value: "Syncfusion", width: '20%', resizeMode: "None"});
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.style.width).toBe('20%');
        });
        it('Initial rendering with width as em ', () => {
            textareaObj = new TextArea({value: "Syncfusion", width: '20em', resizeMode: "None"});
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.style.width).toBe('20em');
        });
        it('Initial rendering with dynamic width', () => {
            textareaObj = new TextArea({value: "Syncfusion", resizeMode: "None"});
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.style.width).toBe('');
            textareaObj.width = 500;
            textareaObj.dataBind();
            expect(textareaObj.textareaWrapper.container.style.width).toBe('500px');
            textareaObj.width = '200px';
            textareaObj.dataBind();
            expect(textareaObj.textareaWrapper.container.style.width).toBe('200px');
            textareaObj.width = '20%';
            textareaObj.dataBind();
            expect(textareaObj.textareaWrapper.container.style.width).toBe('20%');
            
        });
        it('Initial rendering with dynamic width with resize mode as both', () => {
            textareaObj = new TextArea({value: "Syncfusion", resizeMode: "Both"});
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.style.width).toBe('');
            textareaObj.width = 500;
            textareaObj.dataBind();
            expect(textareaObj.element.style.width).toBe('500px');
            expect(textareaObj.textareaWrapper.container.style.width).toBe('');
            textareaObj.width = '200px';
            textareaObj.dataBind();
            expect(textareaObj.element.style.width).toBe('200px');
            expect(textareaObj.textareaWrapper.container.style.width).toBe('');
            textareaObj.width = '20%';
            textareaObj.dataBind();
            expect(textareaObj.element.style.width).toBe('20%');
            expect(textareaObj.textareaWrapper.container.style.width).toBe('');
            textareaObj.width = '500';
            textareaObj.dataBind();
            expect(textareaObj.textareaWrapper.container.style.width).toBe('');
        });
        it('Initial rendering with dynamic width with resize mode as vertical', () => {
            textareaObj = new TextArea({value: "Syncfusion", resizeMode: "Vertical"});
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.style.width).toBe('');
            textareaObj.width = 500;
            textareaObj.dataBind();
            expect(textareaObj.textareaWrapper.container.style.width).toBe('500px');
            textareaObj.width = '200px';
            textareaObj.dataBind();
            expect(textareaObj.textareaWrapper.container.style.width).toBe('200px');
            textareaObj.width = '20%';
            textareaObj.dataBind();
            expect(textareaObj.textareaWrapper.container.style.width).toBe('20%');
        });
    });
    describe('Structure testing with textarea element- ', () => {
        let textareaObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Structure testing', () => {
            textareaObj = new TextArea();
            textareaObj.appendTo('#textarea');
            let childElements = textareaObj.textareaWrapper.container.children;
            expect((textareaObj.textareaWrapper.container.classList.contains('e-input-group'))).toBe(true);
            expect((childElements[0].tagName === 'TEXTAREA')).toBe(true);
        });
        it('Structure testing for floatInput auto', () => {
            textareaObj = new TextArea({ floatLabelType: 'Auto' });
            textareaObj.appendTo('#textarea');
            let childElements = textareaObj.textareaWrapper.container.children;
            expect((childElements[0].tagName === 'TEXTAREA')).toBe(true);
            expect((childElements[1].tagName === 'SPAN') &&
             (childElements[1].classList.contains('e-float-line'))).toBe(true);
            expect((childElements[2].tagName === 'LABEL') &&
             (childElements[2].classList.contains('e-float-text'))).toBe(true);
        });
        it('Structure testing for floatInput always', () => {
            textareaObj = new TextArea({ floatLabelType: 'Always' });
            textareaObj.appendTo('#textarea');
            let childElements = textareaObj.textareaWrapper.container.children;
            expect((childElements[0].tagName === 'TEXTAREA')).toBe(true);
            expect((childElements[1].tagName === 'SPAN') &&
             (childElements[1].classList.contains('e-float-line'))).toBe(true);
            expect((childElements[2].tagName === 'LABEL') &&
             (childElements[2].classList.contains('e-float-text'))).toBe(true);
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
        });
        it('Add attribute row -',() =>{
            textareaObj = new TextArea();
            textareaObj.appendTo('#textarea');
            textareaObj.addAttributes({ rows: '5'});
            expect(textareaObj.element.hasAttribute('rows')).toBe(true);
            expect(textareaObj.element.getAttribute('rows')).toBe('5');
        });
        it('Check showClearButton api is set -', () => {
            textareaObj = new TextArea({ showClearButton: true});
            textareaObj.appendTo('#textarea');
            expect(!isNullOrUndefined(textareaObj.element.parentElement.querySelector('.e-clear-icon'))).toBe(true);
            textareaObj.showClearButton = true;
            textareaObj.dataBind();
            expect(!isNullOrUndefined(textareaObj.element.parentElement.querySelector('.e-clear-icon'))).toBe(true);
        });
        it('Check other attributes -',() =>{
            textareaObj = new TextArea();
            textareaObj.appendTo('#textarea');
            textareaObj.addAttributes({ maxlength: 5});
            expect(textareaObj.element.hasAttribute('maxlength')).toBe(true);
            expect(textareaObj.element.getAttribute('maxlength')).toBe('5');    
        });
    });
    describe('Testing textarea with value and floatLabelType properties combination- ', () => {
        let textareaObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Render textarea initially with floatLabelType auto', () => {
            textareaObj = new TextArea({ floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);
            expect(childElements[2].classList.contains('e-label-top')).toBe(false);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = 'Hello';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('');
            expect(textareaObj.value).toEqual('');
            expect(childElements[2].classList.contains('e-label-top')).toBe(false);
        });
        it('Render textarea initially with floatLabelType always', () => {
            textareaObj = new TextArea({ floatLabelType: 'Always' , placeholder: 'Enter your address'});
            textareaObj.appendTo('#textarea');
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);         
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = 'Hello';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('');
            expect(textareaObj.value).toEqual('');
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
        });
        it('Render textarea initially with floatLabelType never', () => {
            textareaObj = new TextArea({ floatLabelType: 'Never' });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(false);
        });

        it('Render textarea initially with value', () => {
            textareaObj = new TextArea({ value: 'Hello' });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
        });
        it('Render textarea initially with value and floatLabelType auto', () => {
            textareaObj = new TextArea({ value: 'Hello' , floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('');
            expect(textareaObj.value).toEqual('');
            expect(childElements[2].classList.contains('e-label-top')).toBe(false);
        });
        it('Render textarea initially with value and floatLabelType always', () => {
            textareaObj = new TextArea({ value: 'Hello' , floatLabelType: 'Always' , placeholder: 'Enter your address'});
            textareaObj.appendTo('#textarea');
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);  
            expect(textareaObj.element.value).toEqual('Hello');   
            expect(textareaObj.value).toEqual('Hello'); 
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('');
            expect(textareaObj.value).toEqual('');
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
        });
        it('Render textarea initially with value floatLabelType never', () => {
            textareaObj = new TextArea({ value: 'Hello' , floatLabelType: 'Never' });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(false);
        });   
    });
    describe('Dynamically enable floatlabeltype with initially rendered textarea element testing- ', () => {
        let textareaObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        }); 
        it('Dynamically enable floatLabelType auto with multiLine textarea', () => {
            textareaObj = new TextArea({ placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            textareaObj.floatLabelType = 'Auto';
            textareaObj.dataBind();
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);       
            expect(childElements[2].classList.contains('e-label-top')).toBe(false);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = 'Hello'
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual(''); 
            expect(textareaObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType always with textarea', () => {
            textareaObj = new TextArea({ placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            textareaObj.floatLabelType = 'Always';
            textareaObj.dataBind();
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = 'Hello'
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('');   
            expect(textareaObj.value).toEqual('');
            expect(childElements[2].classList.contains('e-label-top')).toBe(true); 
        });
        it('Dynamically enable floatLabelType never with textarea', () => {
            textareaObj = new TextArea();
            textareaObj.appendTo('#textarea');
            textareaObj.floatLabelType = 'Never';
            textareaObj.dataBind();
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(false);
        }); 

        it('Dynamically enable floatLabelType auto with value and textarea', () => {
            textareaObj = new TextArea({ value: 'Hello' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            textareaObj.floatLabelType = 'Auto';
            textareaObj.dataBind();
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);      
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello'); 
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual(''); 
            expect(textareaObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType always with value in textarea', () => {
            textareaObj = new TextArea({ value: 'Hello' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            textareaObj.floatLabelType = 'Always';
            textareaObj.dataBind();
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);       
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('');   
            expect(textareaObj.value).toEqual('');
            expect(childElements[2].classList.contains('e-label-top')).toBe(true); 
        });
        it('Dynamically enable floatLabelType never with value in textarea', () => {
            textareaObj = new TextArea({ value: 'Hello'});
            textareaObj.appendTo('#textarea');
            textareaObj.floatLabelType = 'Never';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(false);
        });
    });
    describe('Dynamically change floatlabeltypes with initially rendered floatlabeltype auto in textarea element- ', () => {
        let textareaObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });    
        it('Dynamically enable floatLabelType always with initially rendered floatlabeltype auto', () => {
            textareaObj = new TextArea({ floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].classList.contains('e-label-top')).toBe(false);
            textareaObj.floatLabelType = 'Always';
            textareaObj.dataBind();
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);       
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = 'Hello';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual(''); 
            expect(textareaObj.value).toEqual('');
            expect(childElements[2].classList.contains('e-label-top')).toBe(true); 
        });
        it('Dynamically enable floatLabelType never with initially rendered floatlabeltype auto', () => {
            textareaObj = new TextArea({ floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            textareaObj.floatLabelType = 'Never';
            textareaObj.dataBind();
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(false);
        });

        it('Dynamically enable floatLabelType always with value on initially rendered floatlabeltype auto textarea', () => {
            textareaObj = new TextArea({ value: 'Hello' , floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.floatLabelType = 'Always';
            textareaObj.dataBind();
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);  
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');     
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);    
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual(''); 
            expect(textareaObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(true); 
        });
        it('Dynamically enable floatLabelType never with value on initially rendered floatlabeltype auto textarea', () => {
            textareaObj = new TextArea({ value: 'Hello' , floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            textareaObj.floatLabelType = 'Never';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(false);
        });
    });
    describe('Dynamically change floatlabeltypes with initially rendered floatlabeltype always textarea element- ', () => {
        let textareaObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });   
        it('Dynamically enable floatLabelType auto with initially rendered floatlabeltype always', () => {
            textareaObj = new TextArea({ floatLabelType: 'Always' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.floatLabelType = 'Auto';
            textareaObj.dataBind();
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);       
            expect(childElements[2].classList.contains('e-label-top')).toBe(false);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = 'Hello';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual(''); 
            expect(textareaObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType never with initially rendered floatlabeltype always', () => {
            textareaObj = new TextArea({ floatLabelType: 'Always' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            textareaObj.floatLabelType = 'Never';
            textareaObj.dataBind();
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(false);
        });

        it('Dynamically enable floatLabelType auto with value on initially rendered floatlabeltype always textarea', () => {
            textareaObj = new TextArea({ value: 'Hello' , floatLabelType: 'Always' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.floatLabelType = 'Auto';
            textareaObj.dataBind();
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);  
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');     
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);    
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual(''); 
            expect(textareaObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType never with value on initially rendered floatlabeltype always textarea', () => {
            textareaObj = new TextArea({ value: 'Hello' , floatLabelType: 'Always' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            textareaObj.floatLabelType = 'Never';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(false);
        });
    });
    describe('Dynamically change floatlabeltypes with initially rendered floatlabeltype never textarea element- ', () => {
        let textareaObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });  
        it('Dynamically enable floatLabelType auto with initially rendered floatlabeltype never', () => {
            textareaObj = new TextArea({ floatLabelType: 'Never' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(false);
            textareaObj.floatLabelType = 'Auto';
            textareaObj.dataBind();
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);       
            expect(childElements[2].classList.contains('e-label-top')).toBe(false);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = 'Hello';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual(''); 
            expect(textareaObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType always with initially rendered floatlabeltype never', () => {
            textareaObj = new TextArea({ floatLabelType: 'Never' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(false);
            textareaObj.floatLabelType = 'Always';
            textareaObj.dataBind();
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);       
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = 'Hello';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual(''); 
            expect(textareaObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(true); 
        });

        it('Dynamically enable floatLabelType auto with value on initially rendered floatlabeltype never textarea', () => {
            textareaObj = new TextArea({ value: 'Hello' , floatLabelType: 'Never' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(false);
            textareaObj.floatLabelType = 'Auto';
            textareaObj.dataBind();
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);   
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');    
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual(''); 
            expect(textareaObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType always with value on initially rendered floatlabeltype never textarea', () => {
            textareaObj = new TextArea({ value: 'Hello' , floatLabelType: 'Never' , placeholder: 'Enter your address' });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(false);
            textareaObj.floatLabelType = 'Always';
            textareaObj.dataBind();
            let childElements = textareaObj.textareaWrapper.container.children;
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);   
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');    
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toEqual(''); 
            expect(textareaObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(true); 
        });
    });
    describe('Initially render other properties with textarea element- ', () => {
        let textareaObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        }); 
        it('Render textarea initially with enableRtl state', () => {
            textareaObj = new TextArea({ enableRtl: true });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-rtl')).toBe(true);
        });
        it('Render textarea initially with enableRtl false state', () => {
            textareaObj = new TextArea({ enableRtl: false });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-rtl')).toBe(false);
        });
        it('Render textarea initially with disabled state', () => {
            textareaObj = new TextArea({ enabled: false });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.hasAttribute('disabled')).toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-disabled')).toBe(true);
        });
        it('Render textarea initially with readonly state' , () => {
            textareaObj= new TextArea({ readonly: true });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.hasAttribute('readonly')).toBe(true);
        });
        it('Render textarea initially with readonly false state' , () => {
            textareaObj= new TextArea({ readonly: false });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.element.hasAttribute('readonly')).toBe(false);
        });
                
        it('Render textarea initially with value and enableRtl state', () => {
            textareaObj = new TextArea({ value: 'Hello' , enableRtl: true });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-rtl')).toBe(true);
        });
        it('Render textarea initially with value and enableRtl false state ', () => {
            textareaObj = new TextArea({ value: 'Hello', enableRtl: false });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-rtl')).toBe(false);
        });
        it('Render textarea initially with value and disbled state ', () => {
            textareaObj = new TextArea({ value: 'Hello' , enabled: false });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            expect(textareaObj.element.hasAttribute('disabled')).toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-disabled')).toBe(true);
        });
        it('Render textarea initially with value and readonly state ' , () => {
            textareaObj= new TextArea({ value: 'Hello' , readonly: true });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            expect(textareaObj.element.hasAttribute('readonly')).toBe(true);
        });
        it('Render textarea initially with value and readonly false state' , () => {
            textareaObj= new TextArea({ value: 'Hello' , readonly: false });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.value).toEqual('Hello');
            expect(textareaObj.value).toEqual('Hello');
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.element.hasAttribute('readonly')).toBe(false);
        });
    });
    describe('Dynamically enable other properties with textarea element - ', () => {
        let textareaObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        }); 
        it('Dynamically enableRtl with textarea', () => {
            textareaObj = new TextArea();
            textareaObj.appendTo('#textarea');
            textareaObj.enableRtl = true;
            textareaObj.dataBind();
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-rtl')).toBe(true);
        });
        it('Dynamically enableRtl false state with textarea', () => {
            textareaObj = new TextArea();
            textareaObj.appendTo('#textarea');
            textareaObj.enableRtl = false;
            textareaObj.dataBind();
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true); 
            expect(textareaObj.textareaWrapper.container.classList.contains('e-rtl')).toBe(false);
        });
        it('Dynamically set enabled false with textarea', () => {
            textareaObj = new TextArea();
            textareaObj.appendTo('#textarea');
            textareaObj.enabled = false;
            textareaObj.dataBind();
            expect(textareaObj.element.hasAttribute('disabled')).toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-disabled')).toBe(true);
        });
        it('Dynamically enable readonly with multiLine textarea', () => {
            textareaObj = new TextArea();
            textareaObj.appendTo('#textarea');  
            textareaObj.readonly = true;
            textareaObj.dataBind();
            expect(textareaObj.element.hasAttribute('readonly')).toBe(true);
        });
        it('Dynamically set readonly false state with multiLine textarea', () => {
            textareaObj = new TextArea();
            textareaObj.appendTo('#textarea');  
            textareaObj.readonly = false;
            textareaObj.dataBind();
            expect(textareaObj.element.hasAttribute('readonly')).toBe(false);
            expect(textareaObj.element.tagName === 'TEXTAREA').toBe(true);
        });
    });
    describe('Onproperty changes testing - ', () => {
        let textareaObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
            textareaObj = new TextArea({resizeMode: 'None'});
            textareaObj.appendTo(document.getElementById('textarea'));
        })
        afterAll((): void => {
            textareaObj.destroy();
            document.body.innerHTML = '';
        });
        it('floatLabelType api', () => {
            expect(textareaObj.element.parentElement.classList.contains('e-float-input')).toBe(false);
            textareaObj.floatLabelType = 'Auto';
            textareaObj.dataBind();
            expect(textareaObj.element.parentElement.classList.contains('e-float-input')).toBe(true);
        });
        it('enabled api', () => {
            expect(textareaObj.element.classList.contains('e-disabled')).toBe(false);
            textareaObj.enabled = false;
            textareaObj.dataBind();
            expect(textareaObj.element.classList.contains('e-disabled')).toBe(true);
        });
        it('enableRtl api', () => {
            expect(textareaObj.element.parentElement.classList.contains('e-rtl')).toBe(false);
            textareaObj.enableRtl = true;
            textareaObj.dataBind();
            expect(textareaObj.element.parentElement.classList.contains('e-rtl')).toBe(true);
        });
        it('value api', () => {
            expect(textareaObj.element.value).toBe('');
            textareaObj.value = 'TextArea';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toBe('TextArea');
        });
        it('readonly api', () => {
            expect(textareaObj.element.hasAttribute('readonly')).toBe(false);
            textareaObj.readonly = true;
            textareaObj.dataBind();
            expect(textareaObj.element.hasAttribute('readonly')).toBe(true);
        });
        it('cssClass api', () => {
            expect(textareaObj.element.parentElement.classList.contains('new-class')).toBe(false);
            textareaObj.cssClass = 'new-class new-class2';
            textareaObj.dataBind();
            expect(textareaObj.element.parentElement.classList.contains('new-class')).toBe(true);
            expect(textareaObj.element.parentElement.classList.contains('new-class2')).toBe(true);
        });
        it('placeholder api', () => {
            expect(textareaObj.placeholder).toBe(null);
            textareaObj.placeholder = 'Enter a name';
            textareaObj.value = '';
            textareaObj.dataBind();
            expect(textareaObj.placeholder).not.toBe(null);
            expect(textareaObj.element.value).toBe('');
        });
        it('showClearButton api', () => {
            expect(isNullOrUndefined(textareaObj.element.parentElement.querySelector('.e-clear-icon'))).toBe(true);
            textareaObj.showClearButton = true;
            textareaObj.dataBind();
            expect(isNullOrUndefined(textareaObj.element.parentElement.querySelector('.e-clear-icon'))).toBe(false);
        });
        it('enablePersistence api', () => {
            expect(textareaObj.enablePersistence).toBe(false);
            textareaObj.enablePersistence = true;
            textareaObj.dataBind();
            expect(textareaObj.enablePersistence).toBe(true);
        });
        it('width api', () => {
            expect(textareaObj.textareaWrapper.container.style.width).toBe('');
            textareaObj.width = 500;
            textareaObj.dataBind();
            expect(textareaObj.textareaWrapper.container.style.width).toBe('500px');
        });
        it('maxLength api', () => {
            expect(textareaObj.element.hasAttribute('maxlength')).toBe(false);
            textareaObj.maxLength = 10;
            textareaObj.dataBind();
            expect(textareaObj.element.hasAttribute('maxlength')).toBe(true);
            expect(textareaObj.element.getAttribute('maxlength')).toBe('10');
        });
        it('rows api', () => {
            expect(textareaObj.element.hasAttribute('rows')).toBe(false);
            textareaObj.rows = 5;
            textareaObj.dataBind();
            expect(textareaObj.element.hasAttribute('rows')).toBe(true);
            expect(textareaObj.element.getAttribute('rows')).toBe('5');
        });
        it('cols api', () => {
            expect(textareaObj.element.hasAttribute('cols')).toBe(false);
            textareaObj.cols = 30;
            textareaObj.dataBind();
            expect(textareaObj.element.hasAttribute('cols')).toBe(true);
            expect(textareaObj.element.getAttribute('cols')).toBe('30');
        });
    });
    describe('Events testing - ', () => {
        let textareaObj: any;
        let onfocus: EmitType<Object> = jasmine.createSpy('focus');
        let onBlur: EmitType<Object> = jasmine.createSpy('blur');
        let onInput: EmitType<Object> = jasmine.createSpy('blur');
        let onChange: EmitType<Object> = jasmine.createSpy('change');
        let originalTimeout: number;
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let element: HTMLElement = createElement('textarea', {id: 'TextArea'});
            document.body.appendChild(element);
            textareaObj = new TextArea({focus: onfocus, blur: onBlur, change: onChange, input: onInput, showClearButton: true});
            textareaObj.appendTo(document.getElementById('TextArea'));
        })
        afterAll((): void => {
            textareaObj.destroy();
            document.body.innerHTML = '';
        });
        it('focus event', () => {
            let mouseEvent = document.createEvent('MouseEvents');
            textareaObj.focusHandler(mouseEvent);
            expect(onfocus).toHaveBeenCalled();
        });
        it('blur event', () => {
            let mouseEvent = document.createEvent('MouseEvents');
            textareaObj.focusOutHandler(mouseEvent);
            expect(onBlur).toHaveBeenCalled();
        });
        it('focus event through public method', () => {
            textareaObj.focusIn();
            expect(onfocus).toHaveBeenCalled();
        });
        it('blur event through public method', () => {
            textareaObj.focusOut();
            expect(onBlur).toHaveBeenCalled();
        });
        it('blur event with change event', () => {
            let mouseEvent = document.createEvent('MouseEvents');
            textareaObj.previousValue = '';
            textareaObj.element.value = 'Books'
            textareaObj.focusOutHandler(mouseEvent);
            expect(onBlur).toHaveBeenCalled();
        });
        it('input event', () => {
            let keyEvent = document.createEvent('KeyboardEvents');
            textareaObj.inputHandler(keyEvent);
            expect(onInput).toHaveBeenCalled();
        });
        it('change event', () => {
            textareaObj.element.value = 'new value';
            let changeEvent = document.createEvent('Events');
            textareaObj.changeHandler(changeEvent);
            expect(onChange).toHaveBeenCalled();
        });
        it('reset value by click on clear button', () => {
            let mouseEvent = document.createEvent('MouseEvents');
            textareaObj.textareaWrapper.clearButton.classList.remove('e-clear-icon-hide');
            textareaObj.resetInputHandler(mouseEvent);
            expect(textareaObj.element.value).toBe('');
            textareaObj.textareaWrapper.clearButton.classList.add('e-clear-icon-hide');
            textareaObj.resetInputHandler(mouseEvent);
            expect(textareaObj.element.value).toBe('');
            expect(onInput).toHaveBeenCalled();
        });
    });
    describe('HTML attribute API testing', () => {
        let textareaObj: any;
        beforeEach((): void => {
            textareaObj = undefined;
            let ele: HTMLTextAreaElement = <HTMLTextAreaElement>createElement('textarea', { id: 'TextArea' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (textareaObj) {
                textareaObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('API testing', () => {
            textareaObj = new TextArea({placeholder:"Enter your mark", readonly: false, enabled: true, value: "70"});
            textareaObj.appendTo('#TextArea');
            expect(textareaObj.placeholder).toBe("Enter your mark");
            expect(textareaObj.element.hasAttribute('readonly')).toBe(false);
            expect(textareaObj.element.hasAttribute('disabled')).toBe(false);
            expect(textareaObj.element.getAttribute('value')).toBe('70');
        });
        it('HTML attributes API testing', () => {
            textareaObj = new TextArea({ htmlAttributes:{placeholder:"Number of states", readonly: "false", disabled: "false", value: "100"}});
            textareaObj.appendTo('#TextArea');
            expect(textareaObj.placeholder).toBe("Number of states");
            expect(textareaObj.element.hasAttribute('readonly')).toBe(false);
            expect(textareaObj.element.hasAttribute('disabled')).toBe(false);
            expect(textareaObj.element.getAttribute('value')).toBe('100');
        });
        it('API and HTML attributes API testing', () => {
            textareaObj = new TextArea({ htmlAttributes:{placeholder:"Number of states", readonly: "true", disabled: "", value: "100"}, placeholder: "Enter your mark", readonly: false, enabled: true, value: "70"});
            textareaObj.appendTo('#TextArea');
            expect(textareaObj.placeholder).toBe("Enter your mark");
            expect(textareaObj.element.hasAttribute('readonly')).toBe(false);
            expect(textareaObj.element.hasAttribute('enabled')).toBe(false);
            expect(textareaObj.element.getAttribute('value')).toBe('70');
        });
        it('Other attribute testing with htmlAttributes API', () => {
            textareaObj = new TextArea({ htmlAttributes:{name:"numeric", maxlength: "50", minlength: "10", class: "test", title:"sample"}});
            textareaObj.appendTo('#TextArea');
            textareaObj.updateHTMLAttributesToWrapper();
            expect(textareaObj.element.getAttribute('name')).toBe('numeric');
            expect(textareaObj.element.getAttribute('maxlength')).toBe('50');
            expect(textareaObj.element.getAttribute('minlength')).toBe('10');
            expect(textareaObj.textareaWrapper.container.getAttribute('title')).toBe('sample');
            expect(textareaObj.textareaWrapper.container.classList.contains('test')).toBe(true);
        });
        it('Dynamically change attributes with htmlAttributes API', () => {
            textareaObj = new TextArea({});
            textareaObj.appendTo('#TextArea');
            textareaObj.htmlAttributes = { class: "test", title: 'sample', disabled: 'disabled', readonly: 'readonly', placeholder: "Number of states"};
            textareaObj.dataBind();
            textareaObj.updateHTMLAttributesToElement();
            textareaObj.updateHTMLAttributesToWrapper();
            expect(textareaObj.element.hasAttribute('readonly')).toBe(true);
            expect(textareaObj.element.hasAttribute('disabled')).toBe(true);
            expect(textareaObj.textareaWrapper.container.getAttribute('title')).toBe('sample');
            expect(textareaObj.textareaWrapper.container.classList.contains('test')).toBe(true);
            expect(textareaObj.element.getAttribute('placeholder')).toBe('Number of states');
            textareaObj.htmlAttributes = null;
            textareaObj.dataBind();
            textareaObj.updateHTMLAttributesToElement();
            textareaObj.updateHTMLAttributesToWrapper();
            expect(textareaObj.htmlAttributes).toBe(null);
        });
    });
    describe('HTML attribute API dynamic testing', () => {
        let textareaObj: any;
        beforeEach((): void => {
            textareaObj = undefined;
            let ele: HTMLTextAreaElement = <HTMLTextAreaElement>createElement('textarea', { id: 'TextArea' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (textareaObj) {
                textareaObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Dynamically change attributes with htmlAttributes API', () => {
            textareaObj = new TextArea({ htmlAttributes:{placeholder:"Enter a name", readonly: "true", disabled: "true", value: "100", type: "text", maxlength: "50", minlength: "10", class: "test", title:"sample", style: 'background-color:yellow'}});
            textareaObj.appendTo('#TextArea');
            expect(textareaObj.element.getAttribute('placeholder')).toBe('Enter a name');
            expect(textareaObj.element.hasAttribute('readonly')).toBe(true);
            expect(textareaObj.element.hasAttribute('disabled')).toBe(true);
            expect(textareaObj.element.getAttribute('value')).toBe('100');
            expect(textareaObj.element.getAttribute('type')).toBe('text');
            expect(textareaObj.element.getAttribute('maxlength')).toBe('50');
            expect(textareaObj.element.getAttribute('minlength')).toBe('10');
            expect(textareaObj.textareaWrapper.container.getAttribute('title')).toBe('sample');
            expect(textareaObj.textareaWrapper.container.classList.contains('test')).toBe(true);
            expect(textareaObj.textareaWrapper.container.getAttribute('style')).toBe('background-color:yellow');
            textareaObj.htmlAttributes = { placeholder:"Enter a number", readonly: "false", value: "50", type: "number", maxlength: "60", minlength: "5", class: "multiple", title:"heading"};
            textareaObj.dataBind();
            expect(textareaObj.element.getAttribute('placeholder')).toBe('Enter a number');
            expect(textareaObj.element.hasAttribute('readonly')).toBe(false);
            expect(textareaObj.element.getAttribute('value')).toBe('50');
            expect(textareaObj.element.getAttribute('type')).toBe('number');
            expect(textareaObj.element.getAttribute('maxlength')).toBe('60');
            expect(textareaObj.element.getAttribute('minlength')).toBe('5');
            expect(textareaObj.textareaWrapper.container.getAttribute('title')).toBe('heading');
            expect(textareaObj.textareaWrapper.container.classList.contains('multiple')).toBe(true);
        });
        it('Placeholder testing in auto case', () => {
            textareaObj = new TextArea({ floatLabelType: "Auto", htmlAttributes:{placeholder:"Enter a name" }});
            textareaObj.appendTo('#TextArea');
            expect(textareaObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter a name');
            textareaObj.htmlAttributes = { placeholder:"choose a date"};
            textareaObj.dataBind();
            expect(textareaObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            textareaObj.floatLabelType = "Always";
            textareaObj.dataBind();
            expect(textareaObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            textareaObj.floatLabelType = "Never";
            textareaObj.dataBind();
            expect(textareaObj.element.getAttribute('placeholder')).toBe('choose a date');
        });
        it('Placeholder testing in always case', () => {
            textareaObj = new TextArea({ floatLabelType: "Always", htmlAttributes:{placeholder:"Enter a name" }});
            textareaObj.appendTo('#TextArea');
            expect(textareaObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter a name');
            textareaObj.htmlAttributes = { placeholder:"choose a date"};
            textareaObj.dataBind();
            expect(textareaObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            textareaObj.floatLabelType = "Always";
            textareaObj.dataBind();
            expect(textareaObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            textareaObj.floatLabelType = "Never";
            textareaObj.dataBind();
            expect(textareaObj.element.getAttribute('placeholder')).toBe('choose a date');
        });
        it('Placeholder testing in never case', () => {
            textareaObj = new TextArea({ floatLabelType: "Never", htmlAttributes:{placeholder:"Enter a name" }});
            textareaObj.appendTo('#TextArea');
            expect(textareaObj.element.getAttribute('placeholder')).toBe('Enter a name');
            textareaObj.htmlAttributes = { placeholder:"choose a date"};
            textareaObj.dataBind();
            expect(textareaObj.element.getAttribute('placeholder')).toBe('choose a date');
            textareaObj.floatLabelType = "Always";
            textareaObj.dataBind();
            expect(textareaObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            textareaObj.floatLabelType = "Never";
            textareaObj.dataBind();
            expect(textareaObj.element.getAttribute('placeholder')).toBe('choose a date');
        });
    });
    describe('HTML attribute API at inital rendering and dynamic rendering', () => {
        let textareaObj: any;
        beforeEach((): void => {
            textareaObj = undefined;
            let ele: HTMLTextAreaElement = <HTMLTextAreaElement>createElement('textarea', { id: 'TextArea' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (textareaObj) {
                textareaObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Html attributes at initial rendering', () => {
            textareaObj = new TextArea({ htmlAttributes:{placeholder:"Enter a name", class: "sample" } });
            textareaObj.appendTo('#TextArea');
            expect(textareaObj.element.getAttribute('placeholder')).toBe('Enter a name');
            expect(textareaObj.textareaWrapper.container.classList.contains('sample')).toBe(true);
        });
        it('Pass multiple attributes dynamically', () => {
            textareaObj = new TextArea({ value: 'Description'});
            textareaObj.appendTo('#TextArea');
            textareaObj.htmlAttributes = { class:"sample", readonly: "true", disabled: "true"};
            textareaObj.dataBind();
            expect(textareaObj.element.value).toBe('Description');
            expect(textareaObj.textareaWrapper.container.classList.contains('sample')).toBe(true);
            expect(textareaObj.element.hasAttribute('readonly')).toBe(true);
            expect(textareaObj.element.hasAttribute('disabled')).toBe(true);
        });
        it('Dynamically change attributes through htmlAttributes API', () => {
            textareaObj = new TextArea({ value: 'Description' });
            textareaObj.appendTo('#TextArea');
            textareaObj.element.value = 'Feedback';
            textareaObj.htmlAttributes = { class:"sample" };
            textareaObj.dataBind();
            expect(textareaObj.element.value).toBe('Feedback');
        });
        it('Dynamically change multiple attributes through htmlAttributes API', () => {
            textareaObj = new TextArea({ value: 'Description' });
            textareaObj.appendTo('#TextArea');
            textareaObj.element.value = 'Feedback';
            textareaObj.htmlAttributes = { class:"sample" , maxlength:"5", minlength:"1"};
            textareaObj.dataBind();
            expect(textareaObj.element.value).toBe('Feedback');
            expect(textareaObj.element.getAttribute('maxlength')).toBe('5');
            expect(textareaObj.element.getAttribute('minlength')).toBe('1');
        });
        it('Pass null value in htmlAttributes', () => {
            textareaObj = new TextArea({ value: 'Feedback' });
            textareaObj.appendTo('#TextArea');
            textareaObj.htmlAttributes = { null: "null"};
            textareaObj.dataBind();
            expect(textareaObj.element.value).toBe('Feedback');
        });
        it('Pass undefined in htmlAttributes', () => {
            textareaObj = new TextArea({ value: 'Feedback' });
            textareaObj.appendTo('#TextArea');
            textareaObj.htmlAttributes = { undefined: "undefined"};
            textareaObj.dataBind();
            expect(textareaObj.element.value).toBe('Feedback');
        });
        it('Pass empty value in htmlAttributes', () => {
            textareaObj = new TextArea({ value: 'Feedback' });
            textareaObj.appendTo('#TextArea');
            textareaObj.htmlAttributes = {};
            textareaObj.dataBind();
            expect(textareaObj.element.value).toBe('Feedback');
        });
    });
    describe('Reset form with initial value', () => {
        let textareaObj: any;
        let originalTimeout: number;
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let form: Element = createElement('form', {attrs: {id: 'form1'}});            
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            let resetButton: HTMLElement = createElement('button',{attrs: {type: 'reset', id: 'reset'}});
            form.appendChild(element);
            form.appendChild(resetButton);
            document.body.appendChild(form);
            textareaObj = new TextArea({showClearButton: true, value: 'Syncfusion', floatLabelType: 'Auto'});
            textareaObj.appendTo(document.getElementById('textarea'));
        })
        afterAll((): void => {
            textareaObj.destroy();
            document.body.innerHTML = '';
        });
        it('Check element value ', () => {
            expect(textareaObj.element.value).toBe('Syncfusion');
            textareaObj.value = 'Content changed';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toBe('Content changed');
            (document.querySelector('#reset') as HTMLButtonElement).click();
            expect(textareaObj.element.value).toBe('Syncfusion');
            expect(textareaObj.value).toBe('Syncfusion');
            expect(isNullOrUndefined(textareaObj.textareaWrapper.container.querySelector('.e-label-top'))).toBe(false);
            expect(isNullOrUndefined(textareaObj.textareaWrapper.container.querySelector('.e-label-bottom'))).toBe(true);
        });
    });
    describe('Reset form with empty value', () => {
        let textareaObj: any;
        let originalTimeout: number;
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let form: Element = createElement('form', {attrs: {id: 'form1'}});            
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            let resetButton: HTMLElement = createElement('button',{attrs: {type: 'reset', id: 'reset'}});
            form.appendChild(element);
            form.appendChild(resetButton);
            document.body.appendChild(form);
            textareaObj = new TextArea({showClearButton: true, placeholder:'enter value', floatLabelType: 'Never'});
            textareaObj.appendTo(document.getElementById('textarea'));
        })
        afterAll((): void => {
            textareaObj.destroy();
            document.body.innerHTML = '';
        });
        it('Check element value with Never FloatLabel type', () => {
            textareaObj.value = 'Content changed';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toBe('Content changed');
            (document.querySelector('#reset') as HTMLButtonElement).click();
            expect(textareaObj.element.value).toBe('');
            expect(isNullOrUndefined(textareaObj.value)).toBe(true);
            expect(isNullOrUndefined(textareaObj.textareaWrapper.container.querySelector('.e-label-bottom'))).toBe(true);
            expect(isNullOrUndefined(textareaObj.textareaWrapper.container.querySelector('.e-label-top'))).toBe(true);
        });
        it('Check element value with Auto FloatLabel type', () => {
            textareaObj.floatLabelType = "Auto";
            textareaObj.dataBind();
            textareaObj.value = 'Content changed';
            textareaObj.dataBind();
            expect(textareaObj.element.value).toBe('Content changed');
            (document.querySelector('#reset') as HTMLButtonElement).click();
            expect(textareaObj.element.value).toBe('');
            expect(isNullOrUndefined(textareaObj.value)).toBe(true);
            expect(isNullOrUndefined(textareaObj.textareaWrapper.container.querySelector('.e-label-bottom'))).toBe(false);
            expect(isNullOrUndefined(textareaObj.textareaWrapper.container.querySelector('.e-label-top'))).toBe(true);
        });
    });
    describe('Click on Clear button  - ', () => {
        let textareaObj: any;
        let onChange: EmitType<Object> = jasmine.createSpy('change');
        let originalTimeout: number;
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
            textareaObj = new TextArea({change: function onChange(args){
                expect(args.event != null).toBe(true);
            }, showClearButton: true});
            textareaObj.appendTo(document.getElementById('textarea'));
        })
        afterAll((): void => {
            textareaObj.destroy();
            document.body.innerHTML = '';
        });
        it('Change event testing', () => {
            let mouseEvent = document.createEvent('MouseEvents');
            textareaObj.textareaWrapper.clearButton.classList.add('e-clear-icon-hide');
            textareaObj.resetInputHandler(mouseEvent);
            expect(textareaObj.element.value).toBe('');
        });
    });
    describe('Dynamic CssClass testcase', function (){
        let textarea: any;
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('textarea', { id: 'textarea'});
            document.body.appendChild(inputElement);
        });
        afterEach(function() {
            if (textarea) {
                textarea.destroy();
                document.body.innerHTML = '';
            }
        });
        it('single css class',function() {
            textarea = new TextArea({
                cssClass: 'e-custom'
            });
            textarea.appendTo('#textarea');
            expect(textarea.textareaWrapper.container.classList.contains('e-custom')).toBe(true);
            textarea.cssClass = 'e-test';
            textarea.dataBind();
            expect(textarea.textareaWrapper.container.classList.contains('e-custom')).toBe(false);
            expect(textarea.textareaWrapper.container.classList.contains('e-test')).toBe(true);
        });
        it('more than one css class',function() {
            textarea = new TextArea({
                cssClass: 'e-custom e-secondary'
            });
            textarea.appendTo('#textarea');
            expect(textarea.textareaWrapper.container.classList.contains('e-custom')).toBe(true);
            expect(textarea.textareaWrapper.container.classList.contains('e-secondary')).toBe(true);
            textarea.cssClass = 'e-test e-ternary';
            textarea.dataBind();
            expect(textarea.textareaWrapper.container.classList.contains('e-custom')).toBe(false);
            expect(textarea.textareaWrapper.container.classList.contains('e-secondary')).toBe(false);
            expect(textarea.textareaWrapper.container.classList.contains('e-test')).toBe(true);
            expect(textarea.textareaWrapper.container.classList.contains('e-ternary')).toBe(true);
        });
    });
    describe('testing resizeMode in textarea', function (){
        let textareaObj: any;
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('textarea', { id: 'textarea'});
            document.body.appendChild(inputElement);
        });
        afterEach(function() {
            if (textareaObj) {
                textareaObj.destroy();
                document.body.innerHTML = '';
            }
        });
        it('resizeMode None in textarea',function() {
            textareaObj = new TextArea({
                resizeMode: 'None'
            });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.classList.contains('e-resize-none')).toBe(true);
        });
        it('resizeMode Both in textarea',function() {
            textareaObj = new TextArea({
                resizeMode: 'Both'
            });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.classList.contains('e-resize-xy')).toBe(true);
        });
        it('resizeMode Vertical in textarea',function() {
            textareaObj = new TextArea({
                resizeMode: 'Vertical'
            });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.classList.contains('e-resize-y')).toBe(true);
        });
        it('resizeMode Horizontal in textarea',function() {
            textareaObj = new TextArea({
                resizeMode: 'Horizontal'
            });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.classList.contains('e-resize-x')).toBe(true);
        });
        it('Dynamic resizeMode testing',function() {
            textareaObj = new TextArea({
                resizeMode: 'Both'
            });
            textareaObj.appendTo('#textarea');
            expect(textareaObj.element.classList.contains('e-resize-xy')).toBe(true);
            textareaObj.resizeMode = 'Vertical';
            textareaObj.dataBind();
            expect(textareaObj.element.classList.contains('e-resize-y')).toBe(true);
            textareaObj.resizeMode = 'Horizontal';
            textareaObj.dataBind();
            expect(textareaObj.element.classList.contains('e-resize-x')).toBe(true);
            textareaObj.resizeMode = 'None';
            textareaObj.dataBind();
            expect(textareaObj.element.classList.contains('e-resize-none')).toBe(true);
        });
    });
    describe('Testing outlined textarea', () => {
        let textareaObj: any;
        let onFocus: EmitType<Object> = jasmine.createSpy('focus');
        let onBlur: EmitType<Object> = jasmine.createSpy('blur');
        beforeAll((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
            textareaObj = new TextArea({cssClass:'e-outline', focus: onFocus, blur: onBlur});
            textareaObj.appendTo(document.getElementById('textarea'));
        })
        afterAll((): void => {
            textareaObj.destroy();
            document.body.innerHTML = '';
        });
        it('with focusIn method', () => {
            expect(textareaObj.textareaWrapper.container.classList.contains('e-outline')).toBe(true);
            textareaObj.focusIn();
            expect(onFocus).toHaveBeenCalled();
            expect(textareaObj.textareaWrapper.container.classList.contains('e-input-focus')).toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-outline')).toBe(true);
        });
        it('with focusOut method', () => {
            expect(textareaObj.textareaWrapper.container.classList.contains('e-outline')).toBe(true);
            textareaObj.focusOut();
            expect(onBlur).toHaveBeenCalled();
            expect(textareaObj.textareaWrapper.container.classList.contains('e-input-focus')).toBe(false);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-outline')).toBe(true);
        });
        it('with focusIn method - without e-input-group class', function () {
            textareaObj.textareaWrapper.container.classList.remove('e-input-group');
            expect(textareaObj.textareaWrapper.container.classList.contains('e-outline')).toBe(true);
            textareaObj.focusIn();
            expect(onFocus).toHaveBeenCalled();
            expect(textareaObj.textareaWrapper.container.classList.contains('e-input-focus')).toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-outline')).toBe(true);
        });
        it('with focusOut method - without e-input-group class', function () {
            textareaObj.textareaWrapper.container.classList.remove('e-input-group');
            expect(textareaObj.textareaWrapper.container.classList.contains('e-outline')).toBe(true);
            textareaObj.focusOut();
            expect(onBlur).toHaveBeenCalled();
            expect(textareaObj.textareaWrapper.container.classList.contains('e-input-focus')).toBe(false);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-outline')).toBe(true);
        });
    });
    describe('Testing filled textarea', () => {
        let textareaObj: any;
        let onFocus: EmitType<Object> = jasmine.createSpy('focus');
        let onBlur: EmitType<Object> = jasmine.createSpy('blur');
        let originalTimeout: number;
        beforeAll((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
            textareaObj = new TextArea({cssClass:'e-filled', focus: onFocus, blur: onBlur});
            textareaObj.appendTo(document.getElementById('textarea'));
        })
        afterAll((): void => {
            textareaObj.destroy();
            document.body.innerHTML = '';
        });
        it('with focusIn method', () => {
            expect(textareaObj.textareaWrapper.container.classList.contains('e-filled')).toBe(true);
            textareaObj.focusIn();
            expect(onFocus).toHaveBeenCalled();
            expect(textareaObj.textareaWrapper.container.classList.contains('e-input-focus')).toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-filled')).toBe(true);
        });
        it('with focusOut method', () => {
            expect(textareaObj.textareaWrapper.container.classList.contains('e-filled')).toBe(true);
            textareaObj.focusOut();
            expect(onBlur).toHaveBeenCalled();
            expect(textareaObj.textareaWrapper.container.classList.contains('e-input-focus')).toBe(false);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-filled')).toBe(true);
        });
        it('with focusIn method - without e-input-group class', function () {
            textareaObj.textareaWrapper.container.classList.remove('e-input-group');
            expect(textareaObj.textareaWrapper.container.classList.contains('e-filled')).toBe(true);
            textareaObj.focusIn();
            expect(onFocus).toHaveBeenCalled();
            expect(textareaObj.textareaWrapper.container.classList.contains('e-input-focus')).toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-filled')).toBe(true);
        });
        it('with focusOut method - without e-input-group class', function () {
            textareaObj.textareaWrapper.container.classList.remove('e-input-group');
            expect(textareaObj.textareaWrapper.container.classList.contains('e-filled')).toBe(true);
            textareaObj.focusOut();
            expect(onBlur).toHaveBeenCalled();
            expect(textareaObj.textareaWrapper.container.classList.contains('e-input-focus')).toBe(false);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-filled')).toBe(true);
        });
    });

    describe('Configuring rows and columns', () => {
        let textareaObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textarea'});
            document.body.appendChild(element);
            textareaObj = new TextArea({rows: 5, cols: 10});
            textareaObj.appendTo(document.getElementById('textarea'));
        })
        afterAll((): void => {
            textareaObj.destroy();
            document.body.innerHTML = '';
        });
        it('dynamically changing rows', () => {
            debugger;
            expect(textareaObj.element.getAttribute('rows')).toBe('5');
            textareaObj.rows = 10;
            textareaObj.dataBind();
            expect(textareaObj.element.getAttribute('rows')).toBe('10');
            textareaObj.rows = 5;
            textareaObj.dataBind();
            expect(textareaObj.element.getAttribute('rows')).toBe('5');
        });
        it('dynamically changing columns', () => {
            debugger;
            expect(textareaObj.element.getAttribute('cols')).toBe('10');
            textareaObj.cols = 20;
            textareaObj.dataBind();
            expect(textareaObj.element.getAttribute('cols')).toBe('20');
            textareaObj.cols = 10;
            textareaObj.dataBind();
            expect(textareaObj.element.getAttribute('cols')).toBe('10');
        });
    });
    describe('Null or undefined value testing', function (){
        let textareaObj: any;
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('input', { id: 'textarea'});
            document.body.appendChild(inputElement);
        });
        afterEach(function() {
            document.body.innerHTML = '';
        });
        it('cols',function() {
            textareaObj = new TextArea({ 
                cols: null
            },'#textarea');
            expect(textareaObj.cols).toBe(null);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                cols: undefined
            },'#textarea');
            expect(textareaObj.cols).toBe(null);
            textareaObj.destroy();
        });
        it('cssClass',function() {
            textareaObj = new TextArea({ 
                cssClass: null
            },'#textarea');
            expect(textareaObj.cssClass).toBe(null);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                cssClass: undefined
            },'#textarea');
            expect(textareaObj.cssClass).toBe('');
            textareaObj.destroy();
         });
         it('enablePersistence',function() {
            textareaObj = new TextArea({ 
                enablePersistence: null
            },'#textarea');
            expect(textareaObj.enablePersistence).toBe(null);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                enablePersistence: undefined
            },'#textarea');
            expect(textareaObj.enablePersistence).toBe(false);
            textareaObj.destroy();
         });
         it('enableRtl',function() {
            textareaObj = new TextArea({ 
                enableRtl: null
            },'#textarea');
            expect(textareaObj.enableRtl).toBe(false);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                enableRtl: undefined
            },'#textarea');
            expect(textareaObj.enableRtl).toBe(false);
            textareaObj.destroy();
         });
         it('enabled',function() {
            textareaObj = new TextArea({ 
                enabled: null
            },'#textarea');
            expect(textareaObj.enabled).toBe(null);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                enabled: undefined
            },'#textarea');
            expect(textareaObj.enabled).toBe(false);
            textareaObj.destroy();
         });
         it('floatLabelType',function() {
            textareaObj = new TextArea({ 
                floatLabelType: null
            },'#textarea');
            expect(textareaObj.floatLabelType).toBe(null);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                floatLabelType: undefined
            },'#textarea');
            expect(textareaObj.floatLabelType).toBe('Never');
            textareaObj.destroy();
         });
         it('htmlAttributes',function() {
            textareaObj = new TextArea({ 
                htmlAttributes: null
            },'#textarea');
            expect(textareaObj.htmlAttributes).toBe(null);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                htmlAttributes: undefined
            },'#textarea');
            expect(JSON.stringify(textareaObj.htmlAttributes)).toBe('{}');
            textareaObj.destroy();
         });
         it('maxLength',function() {
            textareaObj = new TextArea({ 
                maxLength: null
            },'#textarea');
            expect(textareaObj.maxLength).toBe(null);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                maxLength: undefined
            },'#textarea');
            expect(textareaObj.maxLength).toBe(null);
            textareaObj.destroy();
         });
         it('placeholder',function() {
            textareaObj = new TextArea({ 
                placeholder: null
            },'#textarea');
            expect(textareaObj.placeholder).toBe(null);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                placeholder: undefined
            },'#textarea');
            expect(textareaObj.placeholder).toBe(null);
            textareaObj.destroy();
         });
         it('readonly',function() {
            textareaObj = new TextArea({ 
                readonly: null
            },'#textarea');
            expect(textareaObj.readonly).toBe(null);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                readonly: undefined
            },'#textarea');
            expect(textareaObj.readonly).toBe(false);
            textareaObj.destroy();
         });
         it('resizeMode',function() {
            textareaObj = new TextArea({ 
                resizeMode: null
            },'#textarea');
            expect(textareaObj.resizeMode).toBe(null);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                resizeMode: undefined
            },'#textarea');
            expect(textareaObj.resizeMode).toBe('Both');
            textareaObj.destroy();
         });
         it('showClearButton',function() {
            textareaObj = new TextArea({ 
                showClearButton: null
            },'#textarea');
            expect(textareaObj.showClearButton).toBe(null);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                showClearButton: undefined
            },'#textarea');
            expect(textareaObj.showClearButton).toBe(false);
            textareaObj.destroy();
         });
         it('rows',function() {
            textareaObj = new TextArea({ 
                rows: null
            },'#textarea');
            expect(textareaObj.rows).toBe(null);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                rows: undefined
            },'#textarea');
            expect(textareaObj.rows).toBe(null);
            textareaObj.destroy();
         });
         it('value',function() {
            textareaObj = new TextArea({ 
                value: null
            },'#textarea');
            expect(textareaObj.value).toBe(null);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                value: undefined
            },'#textarea');
            expect(textareaObj.value).toBe(null);
            textareaObj.destroy();
         });
         it('width',function() {
            textareaObj = new TextArea({ 
                width: null
            },'#textarea');
            expect(textareaObj.width).toBe(null);
            textareaObj.destroy();
            textareaObj = new TextArea({ 
                width: undefined
            },'#textarea');
            expect(textareaObj.width).toBe(null);
            textareaObj.destroy();
         });
    });
    describe('TextArea adornments feature', function (){
        let textareaObj: any;
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('input', { id: 'textarea'});
            document.body.appendChild(inputElement);
        });
        afterEach(function() {
            document.body.innerHTML = '';
        });
        it('icons template with Horizontal flow and orientation',function() {
            textareaObj = new TextArea({ 
                placeholder: 'Enter the Value',
                prependTemplate: '<span class="e-icons e-user"></span>',
                appendTemplate: '<span class="e-icons e-search"></span>',
                floatLabelType: 'Auto'
            },'#textarea');
            expect(textareaObj.textareaWrapper.container.querySelector('.e-user')).not.toBe(null);
            expect(textareaObj.textareaWrapper.container.querySelector('.e-search')).not.toBe(null);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-adornment-flow-horizontal')).toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-adornment-orientation-horizontal')).toBe(true);
            textareaObj.destroy();
        });
        it('icons template with vertical flow and orientation',function() {
            textareaObj = new TextArea({ 
                placeholder: 'Enter the Value',
                prependTemplate: '<span class="e-icons e-user"></span>',
                appendTemplate: '<span class="e-icons e-search"></span>',
                adornmentFlow: 'Vertical',
                adornmentOrientation: 'Vertical',
                floatLabelType: 'Auto'
            },'#textarea');
            expect(textareaObj.textareaWrapper.container.querySelector('.e-user')).not.toBe(null);
            expect(textareaObj.textareaWrapper.container.querySelector('.e-search')).not.toBe(null);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-adornment-flow-vertical')).toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-adornment-orientation-vertical')).toBe(true);
            textareaObj.destroy();
        });
        it('icons template with vertical flow and horizontal orientation',function() {
            textareaObj = new TextArea({ 
                placeholder: 'Enter the Value',
                prependTemplate: '<span class="e-icons e-user"></span>',
                appendTemplate: '<span class="e-icons e-search"></span>',
                adornmentFlow: 'Vertical',
                floatLabelType: 'Auto'
            },'#textarea');
            expect(textareaObj.textareaWrapper.container.querySelector('.e-user')).not.toBe(null);
            expect(textareaObj.textareaWrapper.container.querySelector('.e-search')).not.toBe(null);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-adornment-flow-vertical')).toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-adornment-orientation-horizontal')).toBe(true);
            textareaObj.destroy();
        });
        it('icons template with horizontal flow and vertical orientation',function() {
            textareaObj = new TextArea({ 
                placeholder: 'Enter the Value',
                prependTemplate: '<span class="e-icons e-user"></span>',
                appendTemplate: '<span class="e-icons e-search"></span>',
                adornmentOrientation: 'Vertical',
                floatLabelType: 'Auto'
            },'#textarea');
            expect(textareaObj.textareaWrapper.container.querySelector('.e-user')).not.toBe(null);
            expect(textareaObj.textareaWrapper.container.querySelector('.e-search')).not.toBe(null);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-adornment-flow-horizontal')).toBe(true);
            expect(textareaObj.textareaWrapper.container.classList.contains('e-adornment-orientation-vertical')).toBe(true);
            textareaObj.destroy();
        });
        it('icons template with dynamically rendering',function() {
            textareaObj = new TextArea({ 
                placeholder: 'Enter the Value'
            },'#textarea');
            textareaObj.prependTemplate = '<span class="e-icons e-user"></span>';
            textareaObj.appendTemplate = '<span class="e-icons e-search"></span>';
            textareaObj.dataBind();
            expect(textareaObj.textareaWrapper.container.querySelector('.e-user')).not.toBe(null);
            expect(textareaObj.textareaWrapper.container.querySelector('.e-search')).not.toBe(null);
            textareaObj.destroy();
        });
        it('icons template with dynamically changing orientation',function() {
            textareaObj = new TextArea({ 
                placeholder: 'Enter the Value',
                prependTemplate: '<span class="e-icons e-user"></span>',
                appendTemplate: '<span class="e-icons e-search"></span>',
                floatLabelType: 'Auto'
            },'#textarea');
            textareaObj.adornmentFlow = 'Vertical'; 
            textareaObj.adornmentOrientation = 'Vertical';
            textareaObj.dataBind();
            expect(textareaObj.textareaWrapper.container.querySelector('.e-user')).not.toBe(null);
            expect(textareaObj.textareaWrapper.container.querySelector('.e-search')).not.toBe(null);
        });
        it('code coverage with function call',function() {
            textareaObj = new TextArea({ 
                placeholder: 'Enter the Value',
                width: '100px',
                value: 'Enter the value',
                prependTemplate: '<span class="e-icons e-user"></span>',
                appendTemplate: '<span class="e-icons e-search"></span>',
                floatLabelType: 'Auto'
            },'#textarea');
            textareaObj.onMouseMove();
            textareaObj.keydownHandler({keyCode: 9});
            textareaObj.handleAdornmentFloatLabel();
            textareaObj.dataBind();
        });
    });
});