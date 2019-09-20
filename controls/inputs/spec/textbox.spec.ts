/**
 * TextBox spec document
 */
import { createElement, L10n, EmitType, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TextBox, ChangedEventArgs } from '../src/textbox/textbox';
import  {profile , inMB, getMemoryProfile} from './common.spec';

describe('TextBox ', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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
    describe('Duplicate ID and name attribute testing in angular platform - ', () => {
        let inputObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('EJS-TEXTBOX', {id: 'textbox'});
            element.setAttribute('name', 'sample');
            document.body.appendChild(element);
        })
        afterAll((): void => {
            inputObj.destroy();
            document.body.innerHTML = '';
        });
        it ('Check ID and name attribute- ', () => {
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.parentElement.getAttribute('id')).toBe('textbox');
            expect(inputObj.element.getAttribute('id')).not.toBe('textbox');
            expect(inputObj.textboxWrapper.container.parentElement.hasAttribute('name')).toBe(false);
            expect(inputObj.element.getAttribute('name')).toBe('sample');
        });
    });
    describe('Checking previous value - ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Previous value at initial rendering', () => {
            inputObj = new TextBox({value: "Syncfusion"});
            inputObj.appendTo('#textbox');
            inputObj.element.value = "Software";
            let keyEvent = document.createEvent('KeyboardEvents');
            inputObj.inputHandler(keyEvent);
            expect(inputObj.element.value).toBe('Software');
            expect(inputObj.inputPreviousValue).toBe('Software');
        });
        it('Dynamically change previous value ', () => {
            inputObj = new TextBox({value: "Syncfusion"});
            inputObj.appendTo('#textbox');
            inputObj.value = "Software";
            inputObj.dataBind();
            let keyEvent = document.createEvent('KeyboardEvents');
            inputObj.inputHandler(keyEvent);
            expect(inputObj.element.value).toBe('Software');
            expect(inputObj.inputPreviousValue).toBe('Software');
        });
    });
    describe('Role attribute testing- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Attribute testing for textbox', () => {
            inputObj = new TextBox({showClearButton: true});
            inputObj.appendTo('#textbox');
            expect(inputObj.element.getAttribute('role')).toBe('textbox');
            expect(inputObj.textboxWrapper.clearButton.getAttribute('role')).toBe('button');
        });
        it('Attribute testing for multiline', () => {
            inputObj = new TextBox({multiline: true});
            inputObj.appendTo('#textbox');
            expect(inputObj.element.hasAttribute('role')).toBe(false);
            expect(inputObj.textarea.getAttribute('role')).toBe('textbox');
        });
    });
    describe('Destroyed multiline textbox - ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('destroy method', () => {
            inputObj = new TextBox({multiline: true});
            inputObj.appendTo('#textbox');
            inputObj.destroy();
            expect(inputObj.element.hasAttribute('type')).toBe(false);
        });
    });
    describe('MultiLine structure testing with textarea element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Structure testing for input type', () => {
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect((inputObj.textboxWrapper.container.classList.contains('e-input-group'))).toBe(true);
            expect((childElements[0].tagName === 'TEXTAREA')).toBe(true);
        });
        it('Structure testing for floatInput auto', () => {
            inputObj = new TextBox({ floatLabelType: 'Auto' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect((childElements[0].tagName === 'TEXTAREA')).toBe(true);
            expect((childElements[1].tagName === 'SPAN') &&
             (childElements[1].classList.contains('e-float-line'))).toBe(true);
            expect((childElements[2].tagName === 'LABEL') &&
             (childElements[2].classList.contains('e-float-text'))).toBe(true);
        });
        it('Structure testing for floatInput always', () => {
            inputObj = new TextBox({ floatLabelType: 'Always' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect((childElements[0].tagName === 'TEXTAREA')).toBe(true);
            expect((childElements[1].tagName === 'SPAN') &&
             (childElements[1].classList.contains('e-float-line'))).toBe(true);
            expect((childElements[2].tagName === 'LABEL') &&
             (childElements[2].classList.contains('e-float-text'))).toBe(true);
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
        });
        it('Check the attributes with initially enabled multiline -',() =>{
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            expect(inputObj.element.hasAttribute('id')).toBe(true);
            expect(inputObj.element.hasAttribute('class')).toBe(true);
            expect(inputObj.element.hasAttribute('name')).toBe(true);
            expect(inputObj.element.hasAttribute('type')).toBe(false);
        });
        it('Check the type attribute dynamically -',() =>{
            inputObj = new TextBox({ type: 'number' });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.hasAttribute('type')).toBe(false);
            inputObj.type = "file";
            inputObj.dataBind();
            expect(inputObj.element.hasAttribute('type')).toBe(false);
        });
        it('Add attribute row -',() =>{
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            inputObj.addAttributes({ rows: '5'});
            expect(inputObj.element.hasAttribute('rows')).toBe(true);
            expect(inputObj.element.getAttribute('rows')).toBe('5');
        });
        it('Check appendsapn method not to set -',() =>{
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-input-group-icon')).toBe(false);
        });
        it('showClearButton api not to set -', () => {
            inputObj = new TextBox({ showClearButton: true});
            inputObj.appendTo('#textbox');
            expect(isNullOrUndefined(inputObj.element.parentElement.querySelector('.e-clear-icon'))).toBe(true);
            inputObj.showClearButton = true;
            inputObj.dataBind();
            expect(isNullOrUndefined(inputObj.element.parentElement.querySelector('.e-clear-icon'))).toBe(true);
        });
        it('Check other attributes -',() =>{
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            inputObj.addAttributes({ maxlength: 5});
            expect(inputObj.element.hasAttribute('maxlength')).toBe(true);
            expect(inputObj.element.getAttribute('maxlength')).toBe('5');    
        });
        
    });
    describe('Initially render multiline testing with textarea element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Render multiLine textbox initially', () => {
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
        });
        it('Render multiLine textbox initially with floatLabelType auto', () => {
            inputObj = new TextBox({ floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);
            expect(childElements[2].classList.contains('e-label-top')).toBe(false);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('');
            expect(inputObj.value).toEqual('');
            expect(childElements[2].classList.contains('e-label-top')).toBe(false);
        });
        it('Render multiLine textbox initially with floatLabelType always', () => {
            inputObj = new TextBox({ floatLabelType: 'Always' , placeholder: 'Enter your address'});
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);         
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('');
            expect(inputObj.value).toEqual('');
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
        });
        it('Render multiLine textbox initially with floatLabelType never', () => {
            inputObj = new TextBox({ floatLabelType: 'Never' });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        });

        it('Render multiLine textbox initially with value', () => {
            inputObj = new TextBox({ value: 'Hello' });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
        });
        it('Render multiLine textbox initially with value and floatLabelType auto', () => {
            inputObj = new TextBox({ value: 'Hello' , floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('');
            expect(inputObj.value).toEqual('');
            expect(childElements[2].classList.contains('e-label-top')).toBe(false);
        });
        it('Render multiLine textbox initially with value and floatLabelType always', () => {
            inputObj = new TextBox({ value: 'Hello' , floatLabelType: 'Always' , placeholder: 'Enter your address'});
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);  
            expect(inputObj.element.value).toEqual('Hello');   
            expect(inputObj.value).toEqual('Hello'); 
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('');
            expect(inputObj.value).toEqual('');
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
        });
        it('Render multiLine textbox initially with value floatLabelType never', () => {
            inputObj = new TextBox({ value: 'Hello' , floatLabelType: 'Never' });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        });   
    });
    describe('Dynamically enable floatlabeltype with initially rendered multiline testing and textarea element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        }); 
        it('Dynamically enable floatLabelType auto with multiLine textbox', () => {
            inputObj = new TextBox({ placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            inputObj.floatLabelType = 'Auto';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);       
            expect(childElements[2].classList.contains('e-label-top')).toBe(false);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello'
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType always with multiLine textbox', () => {
            inputObj = new TextBox({ placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            inputObj.floatLabelType = 'Always';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello'
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('');   
            expect(inputObj.value).toEqual('');
            expect(childElements[2].classList.contains('e-label-top')).toBe(true); 
        });
        it('Dynamically enable floatLabelType never with multiLine textbox', () => {
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            inputObj.floatLabelType = 'Never';
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        }); 

        it('Dynamically enable floatLabelType auto with value and multiLine textbox', () => {
            inputObj = new TextBox({ value: 'Hello' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            inputObj.floatLabelType = 'Auto';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);      
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello'); 
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType always with value and multiLine textbox', () => {
            inputObj = new TextBox({ value: 'Hello' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            inputObj.floatLabelType = 'Always';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);       
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('');   
            expect(inputObj.value).toEqual('');
            expect(childElements[2].classList.contains('e-label-top')).toBe(true); 
        });
        it('Dynamically enable floatLabelType never with value and multiLine textbox', () => {
            inputObj = new TextBox({ value: 'Hello'});
            inputObj.appendTo('#textbox');
            inputObj.floatLabelType = 'Never';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        });
    });
    describe('Dynamically change floatlabeltypes with initially rendered floatlabeltype auto and textarea element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });    
        it('Dynamically enable floatLabelType always with initially rendered floatlabeltype auto', () => {
            inputObj = new TextBox({ floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].classList.contains('e-label-top')).toBe(false);
            inputObj.floatLabelType = 'Always';
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);       
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual(''); 
            expect(inputObj.value).toEqual('');
            expect(childElements[2].classList.contains('e-label-top')).toBe(true); 
        });
        it('Dynamically enable floatLabelType never with initially rendered floatlabeltype auto', () => {
            inputObj = new TextBox({ floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            inputObj.floatLabelType = 'Never';
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        });

        it('Dynamically enable floatLabelType always with value and initially rendered floatlabeltype auto', () => {
            inputObj = new TextBox({ value: 'Hello' , floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.floatLabelType = 'Always';
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);  
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');     
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);    
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(true); 
        });
        it('Dynamically enable floatLabelType never with value and initially rendered floatlabeltype auto', () => {
            inputObj = new TextBox({ value: 'Hello' , floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            inputObj.floatLabelType = 'Never';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        });
    });
    describe('Dynamically change floatlabeltypes with initially rendered floatlabeltype always and textarea element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });   
        it('Dynamically enable floatLabelType auto with initially rendered floatlabeltype always', () => {
            inputObj = new TextBox({ floatLabelType: 'Always' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.floatLabelType = 'Auto';
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);       
            expect(childElements[2].classList.contains('e-label-top')).toBe(false);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType never with initially rendered floatlabeltype always', () => {
            inputObj = new TextBox({ floatLabelType: 'Always' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            inputObj.floatLabelType = 'Never';
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        });

        it('Dynamically enable floatLabelType auto with value and initially rendered floatlabeltype always', () => {
            inputObj = new TextBox({ value: 'Hello' , floatLabelType: 'Always' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.floatLabelType = 'Auto';
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);  
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');     
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);    
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType never with value and initially rendered floatlabeltype always', () => {
            inputObj = new TextBox({ value: 'Hello' , floatLabelType: 'Always' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            inputObj.floatLabelType = 'Never';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        });
    });
    describe('Dynamically change floatlabeltypes with initially rendered floatlabeltype never and textarea element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });  
        it('Dynamically enable floatLabelType auto with initially rendered floatlabeltype never', () => {
            inputObj = new TextBox({ floatLabelType: 'Never' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
            inputObj.floatLabelType = 'Auto';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);       
            expect(childElements[2].classList.contains('e-label-top')).toBe(false);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType always with initially rendered floatlabeltype never', () => {
            inputObj = new TextBox({ floatLabelType: 'Never' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
            inputObj.floatLabelType = 'Always';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);       
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(true); 
        });

        it('Dynamically enable floatLabelType auto with value and initially rendered floatlabeltype never', () => {
            inputObj = new TextBox({ value: 'Hello' , floatLabelType: 'Never' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
            inputObj.floatLabelType = 'Auto';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);   
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');    
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType always with value and initially rendered floatlabeltype never', () => {
            inputObj = new TextBox({ value: 'Hello' , floatLabelType: 'Never' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
            inputObj.floatLabelType = 'Always';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[2].textContent === 'Enter your address').toBe(true);   
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');    
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.focus();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.element.blur();
            expect(childElements[2].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.element.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(childElements[2].classList.contains('e-label-top')).toBe(true); 
        });
    });

    describe('Initially render other properties with textarea element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        }); 
        it('Render multiLine textbox initially with enableRtl state', () => {
            inputObj = new TextBox({ enableRtl: true });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-rtl')).toBe(true);
        });
        it('Render multiLine textbox initially with enableRtl false state', () => {
            inputObj = new TextBox({ enableRtl: false });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-rtl')).toBe(false);
        });
        it('Render multiLine textbox initially with enabled state', () => {
            inputObj = new TextBox({ enabled: false });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.hasAttribute('disabled')).toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-disabled')).toBe(true);
        });
        it('Render multiLine textbox initially with readonly state' , () => {
            inputObj= new TextBox({ readonly: true });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.hasAttribute('readonly')).toBe(true);
        });
        it('Render multiLine textbox initially with readonly false state' , () => {
            inputObj= new TextBox({ readonly: false });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.element.hasAttribute('readonly')).toBe(false);
        });
                
        it('Render multiLine textbox initially with value and enableRtl state', () => {
            inputObj = new TextBox({ value: 'Hello' , enableRtl: true });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-rtl')).toBe(true);
        });
        it('Render multiLine textbox initially with value and enableRtl false state ', () => {
            inputObj = new TextBox({ value: 'Hello', enableRtl: false });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-rtl')).toBe(false);
        });
        it('Render multiLine textbox initially with value and enabled state ', () => {
            inputObj = new TextBox({ value: 'Hello' , enabled: false });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.hasAttribute('disabled')).toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-disabled')).toBe(true);
        });
        it('Render multiLine textbox initially with value and readonly state ' , () => {
            inputObj= new TextBox({ value: 'Hello' , readonly: true });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.hasAttribute('readonly')).toBe(true);
        });
        it('Render multiLine textbox initially with value and readonly false state' , () => {
            inputObj= new TextBox({ value: 'Hello' , readonly: false });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.element.hasAttribute('readonly')).toBe(false);
        });
    });       
    
    describe('Dynamically enable other properties with textarea element - ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('textarea', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        }); 
        it('Dynamically enableRtl with multiLine textbox', () => {
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            inputObj.enableRtl = true;
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-rtl')).toBe(true);
        });
        it('Dynamically enableRtl false state with multiLine textbox', () => {
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            inputObj.enableRtl = false;
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true); 
            expect(inputObj.textboxWrapper.container.classList.contains('e-rtl')).toBe(false);
        });
        it('Dynamically enabled with multiLine textbox', () => {
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            inputObj.enabled = false;
            inputObj.dataBind();
            expect(inputObj.element.hasAttribute('disabled')).toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-disabled')).toBe(true);
        });
        it('Dynamically enable readonly with multiLine textbox', () => {
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');  
            inputObj.readonly = true;
            inputObj.dataBind();
            expect(inputObj.element.hasAttribute('readonly')).toBe(true);
        });
        it('Dynamically enable readonly false state with multiLine textbox', () => {
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');  
            inputObj.readonly = false;
            inputObj.dataBind();
            expect(inputObj.element.hasAttribute('readonly')).toBe(false);
            expect(inputObj.element.tagName === 'TEXTAREA').toBe(true);
        });
    });
    
    describe('MultiLine structure testing with input element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Structure testing for input type', () => {
            inputObj = new TextBox({ multiline: true});
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect((inputObj.textboxWrapper.container.classList.contains('e-input-group'))).toBe(true);
            expect((childElements[1].tagName === 'TEXTAREA')).toBe(true);
        });
        it('Structure testing for floatInput auto', () => {
            inputObj = new TextBox({ multiline: true, floatLabelType: 'Auto' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect((childElements[0].tagName === 'INPUT')).toBe(true);
            expect((childElements[1].tagName === 'TEXTAREA')).toBe(true);
            expect((childElements[2].tagName === 'SPAN') &&
             (childElements[2].classList.contains('e-float-line'))).toBe(true);
            expect((childElements[3].tagName === 'LABEL') &&
             (childElements[3].classList.contains('e-float-text'))).toBe(true);
        });
        it('Structure testing for floatInput always', () => {
            inputObj = new TextBox({ multiline: true, floatLabelType: 'Always' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect((childElements[0].tagName === 'INPUT')).toBe(true);
            expect((childElements[1].tagName === 'TEXTAREA')).toBe(true);
            expect((childElements[2].tagName === 'SPAN') &&
             (childElements[2].classList.contains('e-float-line'))).toBe(true);
            expect((childElements[3].tagName === 'LABEL') &&
             (childElements[3].classList.contains('e-float-text'))).toBe(true);
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
        });
        it('Check the type attribute dynamically -',() =>{
            inputObj = new TextBox({ multiline: true, type: 'number' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textarea.hasAttribute('type')).toBe(false);
            inputObj.type = "file";
            inputObj.dataBind();
            expect(inputObj.textarea.hasAttribute('type')).toBe(false);
        });
        it('Add attribute row -',() =>{
            inputObj = new TextBox({ multiline: true });
            inputObj.appendTo('#textbox');
            inputObj.addAttributes({ rows: '5'});
            expect(inputObj.textarea.hasAttribute('rows')).toBe(true);
            expect(inputObj.textarea.getAttribute('rows')).toBe('5');
        });
        it('Check appendsapn method not to set -',() =>{
            inputObj = new TextBox({ multiline: true});
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-input-group-icon')).toBe(false);
        });
        it('showClearButton api not to set -', () => {
            inputObj = new TextBox({ multiline: true, showClearButton: true});
            inputObj.appendTo('#textbox');
            expect(isNullOrUndefined(inputObj.textarea.parentElement.querySelector('.e-clear-icon'))).toBe(true);
            inputObj.showClearButton = true;
            inputObj.dataBind();
            expect(isNullOrUndefined(inputObj.textarea.parentElement.querySelector('.e-clear-icon'))).toBe(true);
        });
        it('Check the attributes with initially enabled multiline -',() =>{
            inputObj = new TextBox({ multiline: true });
            inputObj.appendTo('#textbox');
            expect(inputObj.textarea.hasAttribute('name')).toBe(true);
            expect(inputObj.textarea.hasAttribute('type')).toBe(false);
        });
    });

    describe('Initially render multiline testing with input element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Render multiLine textbox initially', () => {
            inputObj = new TextBox({ multiline: true});
            inputObj.appendTo('#textbox');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
        });
        it('Render multiLine textbox initially with floatLabelType auto', () => {
            inputObj = new TextBox({ multiline: true, floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);
            expect(childElements[3].classList.contains('e-label-top')).toBe(false);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('');
            expect(inputObj.value).toEqual('');
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(false);
        });
        it('Render multiLine textbox initially with floatLabelType always', () => {
            inputObj = new TextBox({ multiline: true, floatLabelType: 'Always' , placeholder: 'Enter your address'});
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);         
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('');
            expect(inputObj.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
        });
        it('Render multiLine textbox initially with floatLabelType never', () => {
            inputObj = new TextBox({ multiline: true, floatLabelType: 'Never' });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        });

        it('Render multiLine textbox initially with value', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
        });
        it('Render multiLine textbox initially with value and floatLabelType auto', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello' , floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('');
            expect(inputObj.value).toEqual('');
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(false);
        });
        it('Render multiLine textbox initially with value and floatLabelType always', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello' , floatLabelType: 'Always' , placeholder: 'Enter your address'});
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);  
            expect(inputObj.textarea.value).toEqual('Hello');   
            expect(inputObj.value).toEqual('Hello'); 
            expect(inputObj.element.value).toEqual('Hello');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('');
            expect(inputObj.value).toEqual('');
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
        });
        it('Render multiLine textbox initially with value floatLabelType never', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello' , floatLabelType: 'Never' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        });   
    });

    describe('Dynamically enable floatlabeltype with initially rendered multiline testing and input element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        }); 
        it('Dynamically enable floatLabelType auto with multiLine textbox', () => {
            inputObj = new TextBox({ multiline: true, placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            inputObj.floatLabelType = 'Auto';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);       
            expect(childElements[3].classList.contains('e-label-top')).toBe(false);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello'
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType always with multiLine textbox', () => {
            inputObj = new TextBox({ multiline: true, placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            inputObj.floatLabelType = 'Always';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello'
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('');   
            expect(inputObj.value).toEqual('');
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true); 
        });
        it('Dynamically enable floatLabelType never with multiLine textbox', () => {
            inputObj = new TextBox({ multiline: true });
            inputObj.appendTo('#textbox');
            inputObj.floatLabelType = 'Never';
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        }); 

        it('Dynamically enable floatLabelType auto with value and multiLine textbox', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            inputObj.floatLabelType = 'Auto';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);      
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello'); 
            expect(inputObj.element.value).toEqual('Hello');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType always with value and multiLine textbox', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            inputObj.floatLabelType = 'Always';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);       
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('');   
            expect(inputObj.value).toEqual('');
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true); 
        });
        it('Dynamically enable floatLabelType never with value and multiLine textbox', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello'});
            inputObj.appendTo('#textbox');
            inputObj.floatLabelType = 'Never';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        });
    });

    describe('Dynamically change floatlabeltypes with initially rendered floatlabeltype auto with input element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });    
        it('Dynamically enable floatLabelType always with initially rendered floatlabeltype auto', () => {
            inputObj = new TextBox({ multiline: true, floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].classList.contains('e-label-top')).toBe(false);
            inputObj.floatLabelType = 'Always';
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);       
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.element.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual(''); 
            expect(inputObj.value).toEqual('');
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true); 
        });
        it('Dynamically enable floatLabelType never with initially rendered floatlabeltype auto', () => {
            inputObj = new TextBox({ multiline: true, floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            inputObj.floatLabelType = 'Never';
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        });

        it('Dynamically enable floatLabelType always with value and initially rendered floatlabeltype auto', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello' , floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.floatLabelType = 'Always';
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);  
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');     
            expect(inputObj.element.value).toEqual('Hello');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);    
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true); 
        });
        it('Dynamically enable floatLabelType never with value and initially rendered floatlabeltype auto', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello' , floatLabelType: 'Auto' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            inputObj.floatLabelType = 'Never';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        });
    });
    describe('Dynamically change floatlabeltypes with initially rendered floatlabeltype always with input element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });   
        it('Dynamically enable floatLabelType auto with initially rendered floatlabeltype always', () => {
            inputObj = new TextBox({ multiline: true, floatLabelType: 'Always' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.floatLabelType = 'Auto';
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);       
            expect(childElements[3].classList.contains('e-label-top')).toBe(false);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType never with initially rendered floatlabeltype always', () => {
            inputObj = new TextBox({ multiline: true, floatLabelType: 'Always' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            inputObj.floatLabelType = 'Never';
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        });

        it('Dynamically enable floatLabelType auto with value and initially rendered floatlabeltype always', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello' , floatLabelType: 'Always' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.floatLabelType = 'Auto';
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);  
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');     
            expect(inputObj.element.value).toEqual('Hello');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);    
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType never with value and initially rendered floatlabeltype always', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello' , floatLabelType: 'Always' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            inputObj.floatLabelType = 'Never';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
        });
    });
    describe('Dynamically change floatlabeltypes with initially rendered floatlabeltype never and input element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });  
        it('Dynamically enable floatLabelType auto with initially rendered floatlabeltype never', () => {
            inputObj = new TextBox({ multiline: true, floatLabelType: 'Never' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
            inputObj.floatLabelType = 'Auto';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);       
            expect(childElements[3].classList.contains('e-label-top')).toBe(false);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType always with initially rendered floatlabeltype never', () => {
            inputObj = new TextBox({ multiline: true, floatLabelType: 'Never' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
            inputObj.floatLabelType = 'Always';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);       
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = 'Hello';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true); 
        });

        it('Dynamically enable floatLabelType auto with value and initially rendered floatlabeltype never', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello' , floatLabelType: 'Never' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
            inputObj.floatLabelType = 'Auto';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);   
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');    
            expect(inputObj.element.value).toEqual('Hello');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(false); 
        });
        it('Dynamically enable floatLabelType always with value and initially rendered floatlabeltype never', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello' , floatLabelType: 'Never' , placeholder: 'Enter your address' });
            inputObj.appendTo('#textbox');
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(false);
            inputObj.floatLabelType = 'Always';
            inputObj.dataBind();
            let childElements = inputObj.textboxWrapper.container.children;
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(childElements[3].textContent === 'Enter your address').toBe(true);   
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');    
            expect(inputObj.element.value).toEqual('Hello');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.focus();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.textarea.blur();
            expect(childElements[3].classList.contains('e-label-top')).toBe(true);
            inputObj.value = '';
            inputObj.dataBind();
            expect(inputObj.textarea.value).toEqual(''); 
            expect(inputObj.value).toEqual('');  
            expect(inputObj.element.value).toEqual('');
            expect(childElements[3].classList.contains('e-label-top')).toBe(true); 
        });
    });

    describe('Initially render other properties with input element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        }); 
        it('Render multiLine textbox initially with enableRtl state', () => {
            inputObj = new TextBox({ multiline: true, enableRtl: true });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-rtl')).toBe(true);
        });
        it('Render multiLine textbox initially with enableRtl false state', () => {
            inputObj = new TextBox({ multiline: true, enableRtl: false });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-rtl')).toBe(false);
        });
        it('Render multiLine textbox initially with enabled state', () => {
            inputObj = new TextBox({ multiline: true, enabled: false });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textarea.hasAttribute('disabled')).toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-disabled')).toBe(true);
        });
        it('Render multiLine textbox initially with readonly state' , () => {
            inputObj= new TextBox({ multiline: true, readonly: true });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textarea.hasAttribute('readonly')).toBe(true);
        });
        it('Render multiLine textbox initially with readonly false state' , () => {
            inputObj= new TextBox({ multiline: true, readonly: false });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textarea.hasAttribute('readonly')).toBe(false);
        });
                
        it('Render multiLine textbox initially with value and enableRtl state', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello' , enableRtl: true });
            inputObj.appendTo('#textbox');
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-rtl')).toBe(true);
        });
        it('Render multiLine textbox initially with value and enableRtl false state ', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello', enableRtl: false });
            inputObj.appendTo('#textbox');
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-rtl')).toBe(false);
        });
        it('Render multiLine textbox initially with value and enabled state ', () => {
            inputObj = new TextBox({ multiline: true, value: 'Hello' , enabled: false });
            inputObj.appendTo('#textbox');
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textarea.hasAttribute('disabled')).toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-disabled')).toBe(true);
        });
        it('Render multiLine textbox initially with value and readonly state ' , () => {
            inputObj= new TextBox({ multiline: true, value: 'Hello' , readonly: true });
            inputObj.appendTo('#textbox');
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textarea.hasAttribute('readonly')).toBe(true);
        });
        it('Render multiLine textbox initially with value and readonly false state' , () => {
            inputObj= new TextBox({ multiline: true, value: 'Hello' , readonly: false });
            inputObj.appendTo('#textbox');
            expect(inputObj.textarea.value).toEqual('Hello');
            expect(inputObj.value).toEqual('Hello');
            expect(inputObj.element.value).toEqual('Hello');
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textarea.hasAttribute('readonly')).toBe(false);
        });
    });       
    
    describe('Dynamically enable other properties with input element- ', () => {
        let inputObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        }); 
        it('Dynamically enableRtl with multiLine textbox', () => {
            inputObj = new TextBox({ multiline: true });
            inputObj.appendTo('#textbox');
            inputObj.enableRtl = true;
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-rtl')).toBe(true);
        });
        it('Dynamically enableRtl false state with multiLine textbox', () => {
            inputObj = new TextBox({ multiline: true });
            inputObj.appendTo('#textbox');
            inputObj.enableRtl = false;
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true); 
            expect(inputObj.textboxWrapper.container.classList.contains('e-rtl')).toBe(false);
        });
        it('Dynamically enabled with multiLine textbox', () => {
            inputObj = new TextBox({ multiline: true });
            inputObj.appendTo('#textbox');
            inputObj.enabled = false;
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textarea.hasAttribute('disabled')).toBe(true);
            expect(inputObj.textboxWrapper.container.classList.contains('e-disabled')).toBe(true);
        });
        it('Dynamically enable readonly with multiLine textbox', () => {
            inputObj = new TextBox({ multiline: true });
            inputObj.appendTo('#textbox');  
            inputObj.readonly = true;
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textarea.hasAttribute('readonly')).toBe(true);
        });
        it('Dynamically enable readonly false state with multiLine textbox', () => {
            inputObj = new TextBox({ multiline: true });
            inputObj.appendTo('#textbox');  
            inputObj.readonly = false;
            inputObj.dataBind();
            expect(inputObj.element.tagName === 'INPUT').toBe(true);
            expect(inputObj.element.getAttribute('type')).toBe('hidden');
            expect(inputObj.textarea.tagName === 'TEXTAREA').toBe(true);
            expect(inputObj.textarea.hasAttribute('readonly')).toBe(false);
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
        it('focus event through public method', () => {
            inputObj.focusIn();
            expect(onfocus).toHaveBeenCalled();
        });
        it('blur event through public method', () => {
            inputObj.focusOut();
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
            expect(onInput).toHaveBeenCalled();
        });
    });

    describe('HTML attributes at inline element testing', () => {
        let inputObj: any;
        beforeEach((): void => {
            inputObj = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'textbox' });
            ele.setAttribute('placeholder','Enter a number');
            ele.setAttribute('readonly', '');
            ele.setAttribute('disabled', '');
            ele.setAttribute('value', '50');
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (inputObj) {
                inputObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Inline element testing', () => {
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            expect(inputObj.placeholder).toBe("Enter a number");
            expect(inputObj.element.hasAttribute('readonly')).toBe(true);
            expect(inputObj.element.hasAttribute('enabled')).toBe(false);
            expect(inputObj.element.getAttribute('value')).toBe('50');
        });
        it('Inline and API testing', () => {
            inputObj = new TextBox({placeholder:"Enter your mark", readonly: false, enabled: true, value: "70"});
            inputObj.appendTo('#textbox');
            expect(inputObj.placeholder).toBe("Enter your mark");
            expect(inputObj.element.hasAttribute('readonly')).toBe(false);
            expect(inputObj.element.hasAttribute('disabled')).toBe(false);
            expect(inputObj.element.getAttribute('value')).toBe('70');
        });
        it('Inline and html attributes API testing', () => {
            inputObj = new TextBox({ htmlAttributes:{placeholder:"Number of states", readonly: "false", disabled: "false", value: "100"}});
            inputObj.appendTo('#textbox');
            expect(inputObj.placeholder).toBe("Number of states");
            expect(inputObj.element.hasAttribute('readonly')).toBe(false);
            expect(inputObj.element.hasAttribute('disabled')).toBe(false);
            expect(inputObj.element.getAttribute('value')).toBe('100');
        });
        it('Inline, API and html attributes API testing', () => {
            inputObj = new TextBox({ htmlAttributes:{placeholder:"Number of states", readonly: "true", disabled: "", value: "100", type:"text"}, placeholder: "Enter your mark", readonly: false, enabled: true, value: "70", type:"number"});
            inputObj.appendTo('#textbox');
            expect(inputObj.placeholder).toBe("Enter your mark");
            expect(inputObj.element.hasAttribute('readonly')).toBe(false);
            expect(inputObj.element.hasAttribute('enabled')).toBe(false);
            expect(inputObj.element.getAttribute('value')).toBe('70');
        });
    });
    
    describe('HTML attribute API testing', () => {
        let inputObj: any;
        beforeEach((): void => {
            inputObj = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (inputObj) {
                inputObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('API testing', () => {
            inputObj = new TextBox({placeholder:"Enter your mark", readonly: false, enabled: true, value: "70"});
            inputObj.appendTo('#textbox');
            expect(inputObj.placeholder).toBe("Enter your mark");
            expect(inputObj.element.hasAttribute('readonly')).toBe(false);
            expect(inputObj.element.hasAttribute('disabled')).toBe(false);
            expect(inputObj.element.getAttribute('value')).toBe('70');
        });
        it('HTML attributes API testing', () => {
            inputObj = new TextBox({ htmlAttributes:{placeholder:"Number of states", readonly: "false", disabled: "false", value: "100"}});
            inputObj.appendTo('#textbox');
            expect(inputObj.placeholder).toBe("Number of states");
            expect(inputObj.element.hasAttribute('readonly')).toBe(false);
            expect(inputObj.element.hasAttribute('disabled')).toBe(false);
            expect(inputObj.element.getAttribute('value')).toBe('100');
        });
        it('API and HTML attributes API testing', () => {
            inputObj = new TextBox({ htmlAttributes:{placeholder:"Number of states", readonly: "true", disabled: "", value: "100", type:"text"}, placeholder: "Enter your mark", readonly: false, enabled: true, value: "70", type:"number"});
            inputObj.appendTo('#textbox');
            expect(inputObj.placeholder).toBe("Enter your mark");
            expect(inputObj.element.hasAttribute('readonly')).toBe(false);
            expect(inputObj.element.hasAttribute('enabled')).toBe(false);
            expect(inputObj.element.getAttribute('value')).toBe('70');
        });
        it('Other attribute testing with htmlAttributes API', () => {
            inputObj = new TextBox({ htmlAttributes:{name:"numeric", maxlength: "50", minlength: "10", class: "test", title:"sample"}});
            inputObj.appendTo('#textbox');
            inputObj.updateHTMLAttrToWrapper();
            expect(inputObj.element.getAttribute('name')).toBe('numeric');
            expect(inputObj.element.getAttribute('maxlength')).toBe('50');
            expect(inputObj.element.getAttribute('minlength')).toBe('10');
            expect(inputObj.textboxWrapper.container.getAttribute('title')).toBe('sample');
            expect(inputObj.textboxWrapper.container.classList.contains('test')).toBe(true);
        });
        it('Dynamically change attributes with htmlAttributes API', () => {
            inputObj = new TextBox({});
            inputObj.appendTo('#textbox');
            inputObj.htmlAttributes = { class: "test", title: 'sample', disabled: 'disabled', readonly: 'readonly', placeholder: "Number of states"};
            inputObj.dataBind();
            inputObj.updateHTMLAttrToElement();
            inputObj.updateHTMLAttrToWrapper();
            expect(inputObj.element.hasAttribute('readonly')).toBe(true);
            expect(inputObj.element.hasAttribute('disabled')).toBe(true);
            expect(inputObj.textboxWrapper.container.getAttribute('title')).toBe('sample');
            expect(inputObj.textboxWrapper.container.classList.contains('test')).toBe(true);
            expect(inputObj.element.getAttribute('placeholder')).toBe('Number of states');
        });
    });
    describe('HTML attribute API dynamic testing', () => {
        let inputObj: any;
        beforeEach((): void => {
            inputObj = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (inputObj) {
                inputObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Dynamically change attributes with htmlAttributes API', () => {
            inputObj = new TextBox({ htmlAttributes:{placeholder:"Enter a name", readonly: "true", disabled: "true", value: "100", type: "text", maxlength: "50", minlength: "10", class: "test", title:"sample", style: 'background-color:yellow'}});
            inputObj.appendTo('#textbox');
            expect(inputObj.element.getAttribute('placeholder')).toBe('Enter a name');
            expect(inputObj.element.hasAttribute('readonly')).toBe(true);
            expect(inputObj.element.hasAttribute('disabled')).toBe(true);
            expect(inputObj.element.getAttribute('value')).toBe('100');
            expect(inputObj.element.getAttribute('type')).toBe('text');
            expect(inputObj.element.getAttribute('maxlength')).toBe('50');
            expect(inputObj.element.getAttribute('minlength')).toBe('10');
            expect(inputObj.textboxWrapper.container.getAttribute('title')).toBe('sample');
            expect(inputObj.textboxWrapper.container.classList.contains('test')).toBe(true);
            expect(inputObj.textboxWrapper.container.getAttribute('style')).toBe('background-color:yellow');
            inputObj.htmlAttributes = { placeholder:"Enter a number", readonly: "false", value: "50", type: "number", maxlength: "60", minlength: "5", class: "multiple", title:"heading"};
            inputObj.dataBind();
            expect(inputObj.element.getAttribute('placeholder')).toBe('Enter a number');
            expect(inputObj.element.hasAttribute('readonly')).toBe(false);
            expect(inputObj.element.getAttribute('value')).toBe('50');
            expect(inputObj.element.getAttribute('type')).toBe('number');
            expect(inputObj.element.getAttribute('maxlength')).toBe('60');
            expect(inputObj.element.getAttribute('minlength')).toBe('5');
            expect(inputObj.textboxWrapper.container.getAttribute('title')).toBe('heading');
            expect(inputObj.textboxWrapper.container.classList.contains('multiple')).toBe(true);
        });
        it('Placeholder testing in auto case', () => {
            inputObj = new TextBox({ floatLabelType: "Auto", htmlAttributes:{placeholder:"Enter a name" }});
            inputObj.appendTo('#textbox');
            expect(inputObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter a name');
            inputObj.htmlAttributes = { placeholder:"choose a date"};
            inputObj.dataBind();
            expect(inputObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            inputObj.floatLabelType = "Always";
            inputObj.dataBind();
            expect(inputObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            inputObj.floatLabelType = "Never";
            inputObj.dataBind();
            expect(inputObj.element.getAttribute('placeholder')).toBe('choose a date');
        });
        it('Placeholder testing in always case', () => {
            inputObj = new TextBox({ floatLabelType: "Always", htmlAttributes:{placeholder:"Enter a name" }});
            inputObj.appendTo('#textbox');
            expect(inputObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter a name');
            inputObj.htmlAttributes = { placeholder:"choose a date"};
            inputObj.dataBind();
            expect(inputObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            inputObj.floatLabelType = "Always";
            inputObj.dataBind();
            expect(inputObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            inputObj.floatLabelType = "Never";
            inputObj.dataBind();
            expect(inputObj.element.getAttribute('placeholder')).toBe('choose a date');
        });
        it('Placeholder testing in never case', () => {
            inputObj = new TextBox({ floatLabelType: "Never", htmlAttributes:{placeholder:"Enter a name" }});
            inputObj.appendTo('#textbox');
            expect(inputObj.element.getAttribute('placeholder')).toBe('Enter a name');
            inputObj.htmlAttributes = { placeholder:"choose a date"};
            inputObj.dataBind();
            expect(inputObj.element.getAttribute('placeholder')).toBe('choose a date');
            inputObj.floatLabelType = "Always";
            inputObj.dataBind();
            expect(inputObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            inputObj.floatLabelType = "Never";
            inputObj.dataBind();
            expect(inputObj.element.getAttribute('placeholder')).toBe('choose a date');
        });
    });
    describe('HTML attribute API at inital rendering and dynamic rendering', () => {
        let inputObj: any;
        beforeEach((): void => {
            inputObj = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (inputObj) {
                inputObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Html attributes at initial rendering', () => {
            inputObj = new TextBox({ htmlAttributes:{placeholder:"Enter a name", class: "sample" } });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.getAttribute('placeholder')).toBe('Enter a name');
            expect(inputObj.textboxWrapper.container.classList.contains('sample')).toBe(true);
        });
        it('Pass multiple attributes dynamically', () => {
            inputObj = new TextBox({ value: 'Description'});
            inputObj.appendTo('#textbox');
            inputObj.htmlAttributes = { class:"sample", readonly: "true", disabled: "true"};
            inputObj.dataBind();
            expect(inputObj.element.value).toBe('Description');
            expect(inputObj.textboxWrapper.container.classList.contains('sample')).toBe(true);
            expect(inputObj.element.hasAttribute('readonly')).toBe(true);
            expect(inputObj.element.hasAttribute('disabled')).toBe(true);
        });
        it('Dynamically change attributes through htmlAttributes API', () => {
            inputObj = new TextBox({ value: 'Description' });
            inputObj.appendTo('#textbox');
            inputObj.element.value = 'Feedback';
            inputObj.htmlAttributes = { class:"sample" };
            inputObj.dataBind();
            expect(inputObj.element.value).toBe('Feedback');
        });
        it('Dynamically change multiple attributes through htmlAttributes API', () => {
            inputObj = new TextBox({ value: 'Description' });
            inputObj.appendTo('#textbox');
            inputObj.element.value = 'Feedback';
            inputObj.htmlAttributes = { class:"sample" , maxlength:"5", minlength:"1"};
            inputObj.dataBind();
            expect(inputObj.element.value).toBe('Feedback');
            expect(inputObj.element.getAttribute('maxlength')).toBe('5');
            expect(inputObj.element.getAttribute('minlength')).toBe('1');
        });
        it('Pass null value in htmlAttributes', () => {
            inputObj = new TextBox({ value: 'Feedback' });
            inputObj.appendTo('#textbox');
            inputObj.htmlAttributes = { null: "null"};
            inputObj.dataBind();
            expect(inputObj.element.value).toBe('Feedback');
        });
        it('Pass undefined in htmlAttributes', () => {
            inputObj = new TextBox({ value: 'Feedback' });
            inputObj.appendTo('#textbox');
            inputObj.htmlAttributes = { undefined: "undefined"};
            inputObj.dataBind();
            expect(inputObj.element.value).toBe('Feedback');
        });
        it('Pass empty value in htmlAttributes', () => {
            inputObj = new TextBox({ value: 'Feedback' });
            inputObj.appendTo('#textbox');
            inputObj.htmlAttributes = {};
            inputObj.dataBind();
            expect(inputObj.element.value).toBe('Feedback');
        });
    });
    describe('isInteracted event testing', () => {
        let inputObj: any;
        let originalTimeout: number;
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
            inputObj = new TextBox({change: onChange, showClearButton: true});
            inputObj.appendTo(document.getElementById('textbox'));
            function onChange(args: ChangedEventArgs) {
                expect(args.isInteracted).toEqual(false);
            }
        })
        afterAll((): void => {
            inputObj.destroy();
            document.body.innerHTML = '';
        });
    });

    describe('Reset form with initial value', () => {
        let inputObj: any;
        let originalTimeout: number;
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let form: Element = createElement('form', {attrs: {id: 'form1'}});            
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            let resetButton: HTMLElement = createElement('button',{attrs: {type: 'reset', id: 'reset'}});
            form.appendChild(element);
            form.appendChild(resetButton);
            document.body.appendChild(form);
            inputObj = new TextBox({showClearButton: true, value: 'Syncfusion', floatLabelType: 'Auto'});
            inputObj.appendTo(document.getElementById('textbox'));
        })
        afterAll((): void => {
            inputObj.destroy();
            document.body.innerHTML = '';
        });
        it('Check element value ', () => {
            expect(inputObj.element.value).toBe('Syncfusion');
            inputObj.value = 'Content changed';
            inputObj.dataBind();
            expect(inputObj.element.value).toBe('Content changed');
            (document.querySelector('#reset') as HTMLButtonElement).click();
            expect(inputObj.element.value).toBe('Syncfusion');
            expect(inputObj.value).toBe('Syncfusion');
            expect(isNullOrUndefined(inputObj.textboxWrapper.container.querySelector('.e-label-top'))).toBe(false);
            expect(isNullOrUndefined(inputObj.textboxWrapper.container.querySelector('.e-label-bottom'))).toBe(true);
        });
    });

    describe('Checking the previousValue', () => {
        let inputObj: any;
        let originalTimeout: number;
        let onChange: EmitType<Object>;
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
            onChange = jasmine.createSpy('change');
            inputObj = new TextBox({showClearButton: true, value: 'Syncfusion', change: onChange, floatLabelType: 'Auto'});
            inputObj.appendTo(document.getElementById('textbox'));
        })
        afterAll((): void => {
            inputObj.destroy();
            document.body.innerHTML = '';
        });
        it('in source local variable', (done) => {
            expect(inputObj.previousValue).toBe('Syncfusion');
            expect(inputObj.value).toBe('Syncfusion');
            inputObj.value = 'Content changed';
            inputObj.dataBind();
            expect(inputObj.element.value).toBe('Content changed');
            expect(onChange).toHaveBeenCalled();
            expect(inputObj.previousValue).toBe('Content changed');
            done();
        });
    });

    describe('Reset form with empty value', () => {
        let inputObj: any;
        let originalTimeout: number;
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let form: Element = createElement('form', {attrs: {id: 'form1'}});            
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            let resetButton: HTMLElement = createElement('button',{attrs: {type: 'reset', id: 'reset'}});
            form.appendChild(element);
            form.appendChild(resetButton);
            document.body.appendChild(form);
            inputObj = new TextBox({showClearButton: true, placeholder:'enter value', floatLabelType: 'Never'});
            inputObj.appendTo(document.getElementById('textbox'));
        })
        afterAll((): void => {
            inputObj.destroy();
            document.body.innerHTML = '';
        });
        it('Check element value with Never FloatLabel type', () => {
            inputObj.value = 'Content changed';
            inputObj.dataBind();
            expect(inputObj.element.value).toBe('Content changed');
            (document.querySelector('#reset') as HTMLButtonElement).click();
            expect(inputObj.element.value).toBe('');
            expect(isNullOrUndefined(inputObj.value)).toBe(true);
            expect(isNullOrUndefined(inputObj.textboxWrapper.container.querySelector('.e-label-bottom'))).toBe(true);
            expect(isNullOrUndefined(inputObj.textboxWrapper.container.querySelector('.e-label-top'))).toBe(true);
        });
        it('Check element value with Auto FloatLabel type', () => {
            inputObj.floatLabelType = "Auto";
            inputObj.dataBind();
            inputObj.value = 'Content changed';
            inputObj.dataBind();
            expect(inputObj.element.value).toBe('Content changed');
            (document.querySelector('#reset') as HTMLButtonElement).click();
            expect(inputObj.element.value).toBe('');
            expect(isNullOrUndefined(inputObj.value)).toBe(true);
            expect(isNullOrUndefined(inputObj.textboxWrapper.container.querySelector('.e-label-bottom'))).toBe(false);
            expect(isNullOrUndefined(inputObj.textboxWrapper.container.querySelector('.e-label-top'))).toBe(true);
        });
    });
    it('memory leak testing', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(inMB(profile.samples[profile.samples.length - 1]) + 0.25);
    }); 
    describe('Click on Clear button  - ', () => {
        let inputObj: any;
        let onChange: EmitType<Object> = jasmine.createSpy('change');
        let originalTimeout: number;
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
            inputObj = new TextBox({change: function onChange(args){
                expect(args.event != null).toBe(true);
            }, showClearButton: true});
            inputObj.appendTo(document.getElementById('textbox'));
        })
        afterAll((): void => {
            inputObj.destroy();
            document.body.innerHTML = '';
        });
        it('Change event testing', () => {
            let mouseEvent = document.createEvent('MouseEvents');
            inputObj.textboxWrapper.clearButton.classList.add('e-clear-icon-hide');
            inputObj.resetInputHandler(mouseEvent);
            expect(inputObj.element.value).toBe('');
        });
    });
    describe('Dynamic CssClass testcase', function (){
        let textbox: any;
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('input', { id: 'textbox'});
            document.body.appendChild(inputElement);
        });
        afterEach(function() {
            if (textbox) {
                textbox.destroy();
                document.body.innerHTML = '';
            }
        });
        it('single css class',function() {
            textbox = new TextBox({
                cssClass: 'e-custom'
            });
            textbox.appendTo('#textbox');
            expect(textbox.textboxWrapper.container.classList.contains('e-custom')).toBe(true);
            textbox.cssClass = 'e-test';
            textbox.dataBind();
            expect(textbox.textboxWrapper.container.classList.contains('e-custom')).toBe(false);
            expect(textbox.textboxWrapper.container.classList.contains('e-test')).toBe(true);
        });
        it('more than one css class',function() {
            textbox = new TextBox({
                cssClass: 'e-custom e-secondary'
            });
            textbox.appendTo('#textbox');
            expect(textbox.textboxWrapper.container.classList.contains('e-custom')).toBe(true);
            expect(textbox.textboxWrapper.container.classList.contains('e-secondary')).toBe(true);
            textbox.cssClass = 'e-test e-ternary';
            textbox.dataBind();
            expect(textbox.textboxWrapper.container.classList.contains('e-custom')).toBe(false);
            expect(textbox.textboxWrapper.container.classList.contains('e-secondary')).toBe(false);
            expect(textbox.textboxWrapper.container.classList.contains('e-test')).toBe(true);
            expect(textbox.textboxWrapper.container.classList.contains('e-ternary')).toBe(true);
        });
    });
    describe('EJ2-26470', function (){
        let textbox: any;
        let changeCount: number = 0;
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('input', { id: 'textbox'});
            document.body.appendChild(inputElement);
        });
        afterEach(function() {
            if (textbox) {
                textbox.destroy();
                document.body.innerHTML = '';
            }
        });
        it('Change event in Vue platform',function() {
            textbox = new TextBox({
                value: "Syncfusion",
                change: function (e:ChangedEventArgs) {changeCount++;}
            });
            textbox.appendTo('#textbox');
            textbox.isVue = true;
            let keyEvent = document.createEvent('KeyboardEvent');
            textbox.value = 'Software';
            textbox.dataBind()
            textbox.inputHandler(keyEvent);
            expect(changeCount).toBe(1);
        });
    });

    describe('autocomplete API testing', () => {
        let inputObj: any;
        beforeEach((): void => {
            inputObj = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (inputObj) {
                inputObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Ensure the default autocomplete API testing', () => {
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('');
            expect(inputObj.element.getAttribute('autocomplete')).toBe(null);
        });

        it('Ensure the autocomplete API with on value testing', () => {
            inputObj = new TextBox({ autocomplete: 'on' });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('');
            expect(inputObj.element.getAttribute('autocomplete')).toBe(null);
        });

        it('Ensure the autocomplete API with off value testing', () => {
            inputObj = new TextBox({ autocomplete: 'off' });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('off');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('off');
        });

        it('Ensure the autocomplete API with on value testing', () => {
            inputObj = new TextBox({ htmlAttributes: { autocomplete: 'on' } });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('on');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('on');
        });

        it('Ensure the autocomplete API with off value testing', () => {
            inputObj = new TextBox({ htmlAttributes: { autocomplete: 'off' } });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('off');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('off');
        });

        it('Ensure the autocomplete API dynamic value testing', () => {
            inputObj = new TextBox({ autocomplete: 'off' });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('off');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('off');
            inputObj.autocomplete = "on";
            inputObj.dataBind();
            expect(inputObj.element.autocomplete).toBe('');
            expect(inputObj.element.getAttribute('autocomplete')).toBe(null);
        });

        it('Ensure the autocomplete API dynamic value testing', () => {
            inputObj = new TextBox({ autocomplete: 'on' });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('');
            expect(inputObj.element.getAttribute('autocomplete')).toBe(null);
            inputObj.autocomplete = "off";
            inputObj.dataBind();
            expect(inputObj.element.autocomplete).toBe('off');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('off');
        });

        it('Ensure the autocomplete API with html attribute testing', () => {
            inputObj = new TextBox({ autocomplete: 'on', htmlAttributes: { autocomplete: 'off' } });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('');
            expect(inputObj.element.getAttribute('autocomplete')).toBe(null);
        });

        it('Ensure the autocomplete API with html attribute testing', () => {
            inputObj = new TextBox({ autocomplete: 'off' , htmlAttributes: { autocomplete: 'on' }});
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('off');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('off');
        });
    });

    describe('autocomplete API testing with element attribute', () => {
        let inputObj: any;
        let ele: HTMLInputElement;
        beforeEach((): void => {
            inputObj = undefined;
            ele = undefined;
        });
        afterEach((): void => {
            if (inputObj) {
                inputObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Ensure the autocomplete attribute with API testing', () => {
            ele = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
            ele.setAttribute('autocomplete', "on");
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('on');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('on');
        });

        it('Ensure the autocomplete attribute with API testing', () => {
            ele = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
            ele.setAttribute('autocomplete', "off");
            inputObj = new TextBox();
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('off');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('off');
        });

        it('Ensure the autocomplete attribute with API testing', () => {
            ele = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
            ele.setAttribute('autocomplete', "on");
            inputObj = new TextBox({ showClearButton: true });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('on');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('on');
        });

        it('Ensure the autocomplete attribute with API testing', () => {
            ele = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
            ele.setAttribute('autocomplete', "off");
            inputObj = new TextBox({ showClearButton: true });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('off');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('off');
        });

        it('Ensure the autocomplete API with on value testing', () => {
            ele = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
            ele.setAttribute('autocomplete', "off");
            inputObj = new TextBox({ autocomplete: 'on' });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('');
            expect(inputObj.element.getAttribute('autocomplete')).toBe(null);
        });

        it('Ensure the autocomplete API with on value testing', () => {
            ele = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
            ele.setAttribute('autocomplete', "on");
            inputObj = new TextBox({ autocomplete: 'on' });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('');
            expect(inputObj.element.getAttribute('autocomplete')).toBe(null);
        });

        it('Ensure the autocomplete API with off value testing', () => {
            ele = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
            ele.setAttribute('autocomplete', "on");
            inputObj = new TextBox({ autocomplete: 'off' });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('off');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('off');
        });

        it('Ensure the autocomplete API with off value testing', () => {
            ele = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
            ele.setAttribute('autocomplete', "off");
            inputObj = new TextBox({ autocomplete: 'off' });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('off');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('off');
        });

        it('Ensure the autocomplete API with on value testing', () => {
            ele = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
            ele.setAttribute('autocomplete', "off");
            inputObj = new TextBox({ htmlAttributes: { autocomplete: 'on' } });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('on');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('on');
        });

        it('Ensure the autocomplete API with on value testing', () => {
            ele = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
            ele.setAttribute('autocomplete', "on");
            inputObj = new TextBox({ htmlAttributes: { autocomplete: 'on' } });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('on');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('on');
        });

        it('Ensure the autocomplete API with off value testing', () => {
            ele = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
            ele.setAttribute('autocomplete', "on");
            inputObj = new TextBox({ htmlAttributes: { autocomplete: 'off' } });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('off');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('off');
        });

        it('Ensure the autocomplete API with off value testing', () => {
            ele = <HTMLInputElement>createElement('input', { id: 'textbox' });
            document.body.appendChild(ele);
            ele.setAttribute('autocomplete', "off");
            inputObj = new TextBox({ htmlAttributes: { autocomplete: 'off' } });
            inputObj.appendTo('#textbox');
            expect(inputObj.element.autocomplete).toBe('off');
            expect(inputObj.element.getAttribute('autocomplete')).toBe('off');
        });
    });
})
