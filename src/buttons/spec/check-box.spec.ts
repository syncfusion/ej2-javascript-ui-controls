/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEventArgs, createCheckBox } from './../src/common/common';
import { CheckBox } from './../src/check-box/check-box';
import { createElement, EventHandler, attributes, enableRipple } from '@syncfusion/ej2-base';
import { profile , inMB, getMemoryProfile } from './common.spec';

/**
 * CheckBox Spec document
 */
function copyObject(source: any, destination: any): any {
    for (const prop in source) {
        destination[prop] = source[prop];
    }
    return destination;
}

function setMouseCoordinates(eventarg: any, x: number, y: number, target: Element): any {
    eventarg.pageX = x;
    eventarg.pageY = y;
    eventarg.clientX = x;
    eventarg.clientY = y;
    eventarg.target = target;
    return eventarg;
}

function getEventObject(eventType: string, eventName: string): any {
    const tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    const returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

describe('CheckBox', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    let checkbox: any;
    const element: HTMLFormElement = createElement('input', { id: 'checkbox' }) as HTMLFormElement;
    element.setAttribute('type', 'checkbox');
    document.body.appendChild(element);

    describe('DOM', () => {
        let i = 0;
        function changeFn(): void {
            i = 1;
        }
        afterEach(() => {
            checkbox.destroy();
        });

        it('Normal CheckBox Testing', () => {
            checkbox = new CheckBox({}, '#checkbox');
            expect(element.classList.contains('e-checkbox')).toEqual(true);
            expect(element.parentElement.tagName).toEqual('LABEL');
            expect(element.parentElement.parentElement.classList.contains('e-checkbox-wrapper')).toEqual(true);
            expect(element.nextElementSibling.classList.contains('e-frame')).toEqual(true);
        });

        it('CheckBox with Label', () => {
            checkbox = new CheckBox({ label: 'checkbox' }, '#checkbox');
            expect(element.parentElement.children[2].classList.contains('e-label')).toEqual(true);
            expect(element.parentElement.children[2].textContent).toEqual('checkbox');
            checkbox.labelMouseDownHandler({ type: 'mousedown' });
            checkbox.labelMouseUpHandler({ type: 'mouseup' });
        });

        it('CheckBox with checked state', () => {
            checkbox = new CheckBox({ checked: true }, '#checkbox');
            expect(element.parentElement.children[1].classList.contains('e-check')).toEqual(true);
            checkbox.element.click();
            expect(element.parentElement.children[1].classList.contains('e-check')).toEqual(false);
        });

        it('CheckBox with disabled state', () => {
            checkbox = new CheckBox({ disabled: true }, '#checkbox');
            expect(element.disabled).toEqual(true);
            expect(element.parentElement.parentElement.classList.contains('e-checkbox-disabled')).toEqual(true);
        });

        it('CheckBox with RTL', () => {
            checkbox = new CheckBox({ enableRtl: true }, '#checkbox');
            expect(element.parentElement.parentElement.classList.contains('e-rtl')).toEqual(true);
        });

        it('CheckBox with labelPosition', () => {
            checkbox = new CheckBox({ label: 'CheckBox', labelPosition: 'Before' }, '#checkbox');
            expect(element.parentElement.children[1].nodeName).toEqual('SPAN');
        });

        it('CheckBox with indeterminate state', () => {
            checkbox = new CheckBox({ indeterminate: true }, '#checkbox');
            expect(element.parentElement.children[1].classList.contains('e-stop')).toEqual(true);
            element.parentElement.click();
            expect(element.parentElement.children[1].classList.contains('e-stop')).toEqual(false);
            checkbox.checked = true;
            checkbox.dataBind();
            checkbox.indeterminate = true;
            checkbox.dataBind();
            element.parentElement.click();
            expect(element.parentElement.children[1].classList.contains('e-check')).toEqual(true);
        });

        it('CheckBox with name property', () => {
            checkbox = new CheckBox({ name: 'gender' }, '#checkbox');
            expect(element.getAttribute('name')).toEqual('gender');
        });

        it('CheckBox with value property', () => {
            checkbox = new CheckBox({ value: 'male' }, '#checkbox');
            expect(element.getAttribute('value')).toEqual('male');
        });

        it('CheckBox with cssClass', () => {
            checkbox = new CheckBox({ cssClass: 'class' }, '#checkbox');
            expect(element.parentElement.parentElement.classList.contains('class')).toEqual(true);
            checkbox.cssClass = "syncfusion ";
            checkbox.dataBind();
            expect(element.parentElement.parentElement.classList.contains('syncfusion')).toEqual(true);
        });

        it('CheckBox with change event', () => {
            checkbox = new CheckBox({ change: changeFn }, '#checkbox');
            element.parentElement.click();
            expect(i).toEqual(1);
        });

        it('CheckBox with persistence', () => {
            checkbox = new CheckBox({ enablePersistence: true }, '#checkbox');
            checkbox.checked = true;
            checkbox.dataBind();
            checkbox.refresh();
            expect(element.parentElement.children[1].classList.contains('e-check')).toEqual(true);
            checkbox.indeterminate = true;
            checkbox.dataBind();
            checkbox.refresh();
            expect(element.parentElement.children[1].classList.contains('e-stop')).toEqual(true);
        });

        it('Hidden input', () => {
            attributes(element, { 'ejs-for': 'true', 'name': 'check' });
            checkbox = new CheckBox({}, '#checkbox');
            expect(element.parentElement.children[1].tagName).toEqual('INPUT');
            expect(element.parentElement.children[1].getAttribute('name')).toEqual('check');
            expect(element.parentElement.children[1].getAttribute('type')).toEqual('hidden');
            expect(element.parentElement.children[1].getAttribute('value')).toEqual('false');
            element.removeAttribute('ejs-for');
        });

        it('Enable Html Sanitizer testing', () => {
            checkbox = new CheckBox({ label: '<style>body{background:rgb(0, 0, 255)}</style>' }, '#checkbox');
            const htmlele: Element = document.body;
            expect(window.getComputedStyle(htmlele).backgroundColor).not.toBe('rgb(0, 0, 255)');
        });

        it('Enable Html Sanitizer disabled testing', () => {
            checkbox = new CheckBox({ label: 'Banking<style>body{background:rgb(0, 0, 255)}</style>', enableHtmlSanitizer: false }, '#checkbox');
            const htmlele: Element = document.body;
            expect(window.getComputedStyle(htmlele).backgroundColor).toBe('rgb(0, 0, 255)');
        });

        it('Checking the tab index attribute support in checkbox', () => {
            checkbox = new CheckBox({ label: 'checkbox' }, '#checkbox');
            expect(checkbox.element.getAttribute('tabindex')).toEqual('0');
        });
    });

    describe('Property', () => {
        function changeFn(): void {
           console.log("changed");
        }
        afterEach(() => {
            checkbox.destroy();
        });

        it('CheckBox with Label', () => {
            checkbox = new CheckBox({ label: 'checkbox' }, '#checkbox');
            expect(checkbox.label).toEqual('checkbox');
        });

        it('CheckBox with checked state', () => {
            checkbox = new CheckBox({ checked: true }, '#checkbox');
            expect(checkbox.checked).toEqual(true);
        });

        it('CheckBox with disabled state', () => {
            checkbox = new CheckBox({ disabled: true }, '#checkbox');
            expect(checkbox.disabled).toEqual(true);
        });

        it('CheckBox with RTL', () => {
            checkbox = new CheckBox({ enableRtl: true }, '#checkbox');
            expect(checkbox.enableRtl).toEqual(true);
        });

        it('CheckBox with label position', () => {
            checkbox = new CheckBox({ labelPosition: 'Before' }, '#checkbox');
            expect(checkbox.labelPosition).toEqual('Before');
        });

        it('CheckBox with indeterminate state', () => {
            checkbox = new CheckBox({ indeterminate: true }, '#checkbox');
            expect(checkbox.indeterminate).toEqual(true);
        });

        it('CheckBox with name', () => {
            checkbox = new CheckBox({ name: 'gender' }, '#checkbox');
            expect(checkbox.name).toEqual('gender');
        });

        it('CheckBox with value', () => {
            checkbox = new CheckBox({ value: 'male' }, '#checkbox');
            expect(checkbox.value).toEqual('male');
        });

        it('CheckBox with cssClass', () => {
            checkbox = new CheckBox({ cssClass: 'class' }, '#checkbox');
            expect(checkbox.cssClass).toEqual('class');
        });

        it('CheckBox with change event', () => {
            checkbox = new CheckBox({ change: changeFn }, '#checkbox');
            expect(checkbox.change).toEqual(changeFn);
        });

        it('CheckBox with persistence', () => {
            checkbox = new CheckBox({ enablePersistence: true }, '#checkbox');
            expect(checkbox.enablePersistence).toEqual(true);
        });
    });

    describe('Notify property changes of', () => {
        afterEach(() => {
            checkbox.destroy();
        });

        it('CheckBox with Label', () => {
            checkbox = new CheckBox({ label: 'checkbox' }, '#checkbox');
            checkbox.label = 'checkbox1';
            checkbox.dataBind();
            expect(checkbox.label).toEqual('checkbox1');
            expect(element.parentElement.children[2].textContent).toEqual('checkbox1');
        });

        it('CheckBox with Label with html', () => {
            checkbox = new CheckBox({ label: '<div>CheckBox:false</div>', enableHtmlSanitizer: false }, '#checkbox');
            expect(element.parentElement.children[2].textContent).toEqual('CheckBox:false');
            checkbox.label = '<div>CheckBox:true</div>';
            checkbox.dataBind();
            expect(element.parentElement.children[2].textContent).toEqual('CheckBox:true');
        });

        it('CheckBox with checked state', () => {
            checkbox = new CheckBox({}, '#checkbox');
            checkbox.checked = true;
            checkbox.dataBind();
            expect(checkbox.checked).toEqual(true);
            expect(element.parentElement.children[1].classList.contains('e-check')).toEqual(true);
            checkbox.checked = false;
            checkbox.dataBind();
            expect(checkbox.checked).toEqual(false);
            expect(element.parentElement.children[1].classList.contains('e-check')).toEqual(false);
        });

        it('CheckBox with disabled state', () => {
            checkbox = new CheckBox({}, '#checkbox');
            checkbox.disabled = true;
            checkbox.dataBind();
            expect(checkbox.disabled).toEqual(true);
            expect(element.disabled).toEqual(true);
            expect(element.parentElement.parentElement.classList.contains('e-checkbox-disabled')).toEqual(true);
            checkbox.disabled = false;
            checkbox.dataBind();
            expect(checkbox.disabled).toEqual(false);
            expect(element.disabled).toEqual(false);
            expect(element.parentElement.parentElement.classList.contains('e-checkbox-disabled')).toEqual(false);
        });

        it('CheckBox with RTL', () => {
            checkbox = new CheckBox({}, '#checkbox');
            checkbox.enableRtl = true;
            checkbox.dataBind();
            expect(checkbox.enableRtl).toEqual(true);
            expect(element.parentElement.parentElement.classList.contains('e-rtl')).toEqual(true);
            checkbox.enableRtl = false;
            checkbox.dataBind();
            expect(checkbox.enableRtl).toEqual(false);
            expect(element.parentElement.parentElement.classList.contains('e-rtl')).toEqual(false);
        });

        it('CheckBox with labelPosition', () => {
            checkbox = new CheckBox({ label: 'CheckBox' }, '#checkbox');
            checkbox.labelPosition = 'Before';
            checkbox.dataBind();
            expect(element.parentElement.children[1].nodeName).toEqual('SPAN');
            checkbox.labelPosition = 'After';
            checkbox.dataBind();
            expect(element.parentElement.children[2].nodeName).toEqual('SPAN');
        });

        it('CheckBox with indeterminate state', () => {
            checkbox = new CheckBox({ checked: true, indeterminate: true }, '#checkbox');
            checkbox.indeterminate = false;
            checkbox.dataBind();
            expect(element.parentElement.children[1].classList.contains('e-stop')).toEqual(false);
            expect(element.parentElement.children[1].classList.contains('e-check')).toEqual(true);
            checkbox.indeterminate = true;
            checkbox.dataBind();
            expect(element.parentElement.children[1].classList.contains('e-stop')).toEqual(true);
            expect(element.parentElement.children[1].classList.contains('e-check')).toEqual(false);
            checkbox.checked = false;
            checkbox.indeterminate = false;
            checkbox.dataBind();
            expect(element.parentElement.children[1].classList.contains('e-stop')).toEqual(false);
            expect(element.parentElement.children[1].classList.contains('e-check')).toEqual(false);
        });

        it('CheckBox with name', () => {
            checkbox = new CheckBox({}, '#checkbox');
            checkbox.name = 'gender';
            checkbox.dataBind();
            expect(element.getAttribute('name')).toEqual('gender');
        });

        it('CheckBox with value', () => {
            checkbox = new CheckBox({}, '#checkbox');
            checkbox.value = 'male';
            checkbox.dataBind();
            expect(element.getAttribute('value')).toEqual('male');
        });

        it('CheckBox with cssClass', () => {
            checkbox = new CheckBox({}, '#checkbox');
            checkbox.cssClass = 'class';
            checkbox.dataBind();
            expect(element.parentElement.parentElement.classList.contains('class')).toEqual(true);
            checkbox.cssClass = 'newClass';
            checkbox.dataBind();
            expect(element.parentElement.parentElement.classList.contains('newClass')).toEqual(true);
        });
    });

    describe('Methods', () => {
        it('Destroy method', () => {
            checkbox = new CheckBox({ checked: true, indeterminate: true, name: 'Check', value: '1', disabled: true }, '#checkbox');
            checkbox.destroy();
            expect(element.parentElement.parentElement.classList.contains('e-checkbox-wrapper')).toEqual(false);
            expect(element.checked).toEqual(false);
            expect(element.indeterminate).toEqual(false);
            expect(element.getAttribute('name')).toEqual(null);
            expect(element.getAttribute('value')).toEqual(null);
            expect(element.disabled).toEqual(false);
        });

        it('Keyboard Event', () => {
            checkbox = new CheckBox({}, '#checkbox');
            element.parentElement.parentElement.focus();
            checkbox.focusHandler();
            checkbox.keyUpHandler();
            expect(element.parentElement.parentElement.classList.contains('e-focus')).toEqual(true);
            checkbox.focusHandler();
            const wrapper: Element = checkbox.element.parentElement.parentElement;
            const label: Element =  wrapper.getElementsByTagName('label')[0];
            let cbox: any = getEventObject('MouseEvents', 'mouseup');
            cbox = setMouseCoordinates(checkbox, 5, 5, label);
            EventHandler.trigger(label as HTMLElement, 'mouseup', cbox);
            checkbox.element.click();
            expect(element.parentElement.parentElement.classList.contains('e-focus')).toEqual(false);
        });

        it('Pre render method', () => {
            document.body.appendChild(createElement('EJS-CHECKBOX', { id: 'ngcheckbox', attrs: { label: 'Checkbox' } }));
            checkbox = new CheckBox({}, '#ngcheckbox');
            expect(checkbox.element.parentElement.parentElement.tagName).toEqual('EJS-CHECKBOX');
            expect(checkbox.element.parentElement.children[0].tagName).toEqual('INPUT');
            expect(checkbox.element.parentElement.children[1].classList.contains('e-frame')).toEqual(true);
            expect(checkbox.element.getAttribute('label')).toEqual(null);
            checkbox.element.click();
            checkbox.destroy();
            expect((document.getElementById('ngcheckbox')).tagName).toBe('EJS-CHECKBOX');
            checkbox = new CheckBox({}, document.body.appendChild(createElement('input')) as HTMLInputElement);
            expect(checkbox.element.id).toContain('e-checkbox');
            expect(checkbox.element.type).toEqual('checkbox');
        });
        it('Native methods - Click and Focus ', () => {
            document.body.appendChild(createElement('EJS-CHECKBOX', { id: 'ngcheckbox', attrs: { label: 'Checkbox' } }));
            checkbox = new CheckBox({}, '#ngcheckbox');
            checkbox.click();
            checkbox.focusIn();
        });
    });

    describe('creation by util function', () => {
        it('', () => {
            const checkboxElem: Element = createCheckBox(createElement);
            expect(checkboxElem.classList.contains('e-checkbox-wrapper')).toBe(true);
            expect(checkboxElem.querySelector('.e-frame')).not.toBeNull();
        });

        it('with ripple effect', () => {
            const checkboxElem: Element = createCheckBox(createElement, true);
            expect(checkboxElem.querySelector('.e-ripple-container')).not.toBeNull();
        });

        it('with checked', () => {
            const checkboxElem: Element = createCheckBox(createElement, false, { checked: true, cssClass: 'e-small' });
            expect(checkboxElem.querySelector('.e-check')).not.toBeNull();
            expect(checkboxElem.classList.contains('e-small')).toBe(true);
        });

        it('with label and without rtl', () => {
            const checkboxElem: Element = createCheckBox(createElement, true, { label: 'checkbox' });
            expect(checkboxElem.querySelector('.e-label')).not.toBeNull();
            expect(checkboxElem.classList.contains('e-rtl')).toBe(false);
        });

        it('with label and rtl', () => {
            const checkboxElem: Element = createCheckBox(createElement, true, { label: 'checkbox', enableRtl: true });
            expect(checkboxElem.classList.contains('e-rtl')).toBe(true);
        });
    });

    describe('CheckBox in HTML5 forms', () => {
        let input: HTMLFormElement;
        let input1: HTMLFormElement;
        let input2: HTMLFormElement;
        let formElement: HTMLFormElement;
        let cbox: CheckBox;
        let cbox1: CheckBox;
        let cbox3: CheckBox;

        beforeEach(() => {

            formElement = createElement('form', {
                id: 'form'
            }) as HTMLFormElement;

            input = createElement('input', { id: 'checkbox1' }) as HTMLFormElement;
            input.setAttribute('type', 'checkbox');

            input1 = createElement('input', { id: 'checkbox2' }) as HTMLFormElement;
            input1.setAttribute('type', 'checkbox');

            input2 = createElement('input', { id: 'checkbox3' }) as HTMLFormElement;

            formElement.appendChild(input);
            formElement.appendChild(input1);
            formElement.appendChild(input2);

            document.body.appendChild(formElement);

            let buttonElement = document.createElement('button');
            buttonElement.setAttribute('id', 'checkButton');
            document.body.appendChild(buttonElement);
            buttonElement.addEventListener('click', () => {
                checkbox.checked = true; // Set the checkbox to checked
                checkbox.dataBind();
            });

            let button = document.createElement('button');
            button.setAttribute('id', 'cbox3');
            document.body.appendChild(button);
            button.addEventListener('click', () => {
                cbox3.checked = !cbox3.checked;
                cbox3.dataBind();
            });
        })

        afterEach(() => {
            cbox.destroy();
            cbox1.destroy();
            formElement.remove();
        })

        it('form reset should make checkbox to its initial value', () => {
            cbox = new CheckBox({
                checked: true
            }, '#checkbox1');
            cbox1 = new CheckBox({
                checked: false
            }, '#checkbox2');
            cbox.checked = false;
            expect(cbox.checked).toBeFalsy();
            expect(cbox1.checked).toBeFalsy();
            formElement.reset();
            expect(cbox.checked).toBeTruthy();
            expect(cbox1.checked).toBeFalsy();
        });

        it('form reset should make checkbox to its default value', () => {
            cbox = new CheckBox({}, '#checkbox1');
            cbox1 = new CheckBox({}, '#checkbox2');
            cbox.checked = true;
            cbox1.checked = true;
            expect(cbox.checked).toBeTruthy();
            expect(cbox1.checked).toBeTruthy();
            formElement.reset();
            expect(cbox.checked).toBeFalsy();
            expect(cbox1.checked).toBeFalsy();
        });

        it('form reset with initial value and default value', () => {
            cbox = new CheckBox({}, '#checkbox1');
            cbox1 = new CheckBox({ checked: false }, '#checkbox2');
            cbox.checked = true;
            cbox1.checked = false;
            expect(cbox.checked).toBeTruthy();
            expect(cbox1.checked).toBeFalsy();
            formElement.reset();
            expect(cbox.checked).toBeFalsy();
            expect(cbox1.checked).toBeFalsy();
        });

        it('908821-Checkbox component bug using required attribute', () => {
            checkbox = new CheckBox({
                checked: false,
                created: created,
            }, '#checkbox3');
            checkbox.isVue = true;
            function created() {
                if (checkbox.element) {
                    checkbox.element.setAttribute('required', ''); // Set the required attribute
                }
            }
            const button = document.querySelector('#checkButton') as HTMLButtonElement;
            button.click();
            expect(checkbox.element.checked).toBe(true);
            checkbox.checked = false;
            checkbox.dataBind();
            expect(checkbox.element.checked).toBe(false);
            checkbox.isVue = false;
        });

        it('95768-Checkbox not getting checked while using usestate', () => {
            let isChecked = false;
            cbox3 = new CheckBox({
                checked: isChecked,
                change: (e: ChangeEventArgs) => {
                    isChecked = e.checked;
                    checkbox.dataBind();
                }
            }, '#checkbox3');
            let button = document.querySelector('#cbox3') as HTMLButtonElement;
            button.click();
            expect(cbox3.checked).toBeTruthy();
            expect(cbox3.element.checked).toBe(true);
            button = document.querySelector('#cbox3') as HTMLButtonElement;
            button.click();
            expect(cbox3.checked).toBeFalsy();
            expect(cbox3.element.checked).toBe(false);
        });

    });

    describe('Notify Html Attributes property changes of', () => {
        afterEach(() => {
            checkbox.destroy();
        });

        it('CheckBox with Style', () => {
            checkbox = new CheckBox({ label: 'checkbox', htmlAttributes: { style: 'background-color:red' } }, '#checkbox');
            expect(element.parentElement.children[1].getAttribute("style").indexOf("background-color:red")).toEqual(0);
            checkbox.htmlAttributes = {style: "background-color:#d3d3d3" }
            checkbox.dataBind();
            expect(element.parentElement.children[1].getAttribute("style").indexOf("background-color:#d3d3d3")).toEqual(0);
        });

        it('CheckBox with Class', () => {
            checkbox = new CheckBox({htmlAttributes: { class: 'e-checkbox-syncfusion' }}, '#checkbox');
            expect(element.parentElement.parentElement.classList.contains('e-checkbox-syncfusion')).toEqual(true);
            checkbox.htmlAttributes = {class: "e-new-checkbox" }
            checkbox.dataBind();
            expect(element.parentElement.parentElement.classList.contains('e-new-checkbox')).toEqual(true);
        });

        it('CheckBox with Title', () => {
            checkbox = new CheckBox({htmlAttributes: { title: 'ejcheckbox' }}, '#checkbox');
            expect(element.parentElement.parentElement.getAttribute("title").indexOf("ejcheckbox")).toEqual(0);
            checkbox.htmlAttributes = {title: "e-new-checkbox" }
            checkbox.dataBind();
            expect(element.parentElement.parentElement.getAttribute("title").indexOf("e-new-checkbox")).toEqual(0);
        });

        it('CheckBox with disabled state', () => {
            checkbox = new CheckBox({htmlAttributes: { disabled: "true" }}, '#checkbox');
            expect(element.parentElement.children[0].getAttribute("disabled").indexOf("true")).toEqual(0);
            checkbox.htmlAttributes = {readonly: "true" }
            checkbox.dataBind();
            expect(element.parentElement.children[0].getAttribute("readonly").indexOf("true")).toEqual(0);
        });

       
    });

    describe('CR issues', () => {
        afterEach(() => {
            checkbox.destroy();
        });

        it('EJ2-70192 - Intermediate state not working properly while Property change of checkbox', () => {
            checkbox = new CheckBox({ checked: true }, '#checkbox');
            checkbox.indeterminate = true;
            checkbox.dataBind();
            expect(element.parentElement.children[1].classList.contains('e-stop')).toEqual(true);
            expect(element.parentElement.children[1].classList.contains('e-check')).toEqual(false);
            checkbox.checked = false;
            checkbox.indeterminate = false;
            checkbox.dataBind();
            expect(element.parentElement.children[1].classList.contains('e-stop')).toEqual(false);
            expect(element.parentElement.children[1].classList.contains('e-check')).toEqual(false);
        });

        it('HtmlAttributes property not working properly in CheckBox', () => {
            checkbox = new CheckBox({htmlAttributes: { 'data-containerid': 'error-agreement', 'test': 'test' }}, '#checkbox');
            expect(element.parentElement.parentElement.getAttribute("data-containerid").indexOf("error-agreement")).toEqual(0);
            expect(element.parentElement.parentElement.getAttribute("test").indexOf("test")).toEqual(0);
        });
       
        it('EJ2-909049 - Need to set the aria-label attribute for the checkbox input element and not to the wrapper element.', function () {
            checkbox = new CheckBox({ htmlAttributes: { 'aria-label': 'checkbox aria label' } }, '#checkbox');
            expect(checkbox.element.ariaLabel).toContain('checkbox aria label');
        });

    });

    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        // check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        // check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

    describe('Null or undefined value testing', () => {
        afterEach(() => {
            checkbox.destroy();
        });

        it('CheckBox with Label', () => {
            checkbox = new CheckBox({ label: null }, '#checkbox');
            expect(checkbox.label).toEqual(null);
            checkbox = new CheckBox({ label: undefined }, '#checkbox');
            expect(checkbox.label).toEqual('');
        });

        it('CheckBox with checked state', () => {
            checkbox = new CheckBox({ checked: null }, '#checkbox');
            expect(checkbox.checked).toEqual(null);
            checkbox = new CheckBox({ checked: undefined }, '#checkbox');
            expect(checkbox.checked).toEqual(false);
        });

        it('CheckBox with disabled state', () => {
            checkbox = new CheckBox({ disabled: null }, '#checkbox');
            expect(checkbox.disabled).toEqual(null);
            checkbox = new CheckBox({ disabled: undefined }, '#checkbox');
            expect(checkbox.disabled).toEqual(false);
        });

        it('CheckBox with RTL', () => {
            checkbox = new CheckBox({ enableRtl: null }, '#checkbox');
            expect(checkbox.enableRtl).toEqual(false);
            checkbox = new CheckBox({ enableRtl: undefined }, '#checkbox');
            expect(checkbox.enableRtl).toEqual(false);
        });

        it('CheckBox with label position', () => {
            checkbox = new CheckBox({ labelPosition: null }, '#checkbox');
            expect(checkbox.labelPosition).toEqual(null);
            checkbox = new CheckBox({ labelPosition: undefined }, '#checkbox');
            expect(checkbox.labelPosition).toEqual('After');
        });

        it('CheckBox with indeterminate state', () => {
            checkbox = new CheckBox({ indeterminate: null }, '#checkbox');
            expect(checkbox.indeterminate).toEqual(null);
            checkbox = new CheckBox({ indeterminate: undefined }, '#checkbox');
            expect(checkbox.indeterminate).toEqual(false);
        });

        it('CheckBox with name', () => {
            checkbox = new CheckBox({ name: null }, '#checkbox');
            expect(checkbox.name).toEqual(null);
            checkbox = new CheckBox({ name: undefined }, '#checkbox');
            expect(checkbox.name).toEqual('');
        });

        it('CheckBox with value', () => {
            checkbox = new CheckBox({ value: null }, '#checkbox');
            expect(checkbox.value).toEqual(null);
            checkbox = new CheckBox({ value: undefined }, '#checkbox');
            expect(checkbox.value).toEqual('');
        });

        it('CheckBox with cssClass', () => {
            checkbox = new CheckBox({ cssClass: null }, '#checkbox');
            expect(checkbox.cssClass).toEqual(null);
            checkbox = new CheckBox({ cssClass: undefined }, '#checkbox');
            expect(checkbox.cssClass).toEqual('');
        });

        it('CheckBox with locale', () => {
            checkbox = new CheckBox({ locale: null }, '#checkbox');
            expect(checkbox.locale).toEqual('en-US');
            checkbox = new CheckBox({ locale: undefined }, '#checkbox');
            expect(checkbox.locale).toEqual('en-US');
        });

        it('CheckBox with persistence', () => {
            checkbox = new CheckBox({ enablePersistence: null }, '#checkbox');
            expect(checkbox.enablePersistence).toEqual(null);
            checkbox = new CheckBox({ enablePersistence: undefined }, '#checkbox');
            expect(checkbox.enablePersistence).toEqual(false);
        });

        it('CheckBox with Enable Html Sanitizer', () => {
            checkbox = new CheckBox({ enableHtmlSanitizer: null }, '#checkbox');
            expect(checkbox.enableHtmlSanitizer).toEqual(null);
            checkbox = new CheckBox({ enablePersistence: undefined }, '#checkbox');
            expect(checkbox.enableHtmlSanitizer).toEqual(true);
        });

        it('CheckBox with indeterminate', () => {
            checkbox = new CheckBox({ indeterminate: null }, '#checkbox');
            expect(checkbox.indeterminate).toEqual(null);
            checkbox = new CheckBox({ indeterminate: undefined }, '#checkbox');
            expect(checkbox.indeterminate).toEqual(false);
        });
    });

    describe('Coverage Improvement', function () {
        it('Mouse Event', () => {
            enableRipple(true);
            const event: any = {
                preventDefault: (): void => { /** NO Code */ },
                type: 'mousedown'
            };
            checkbox = new CheckBox({ label: 'checkbox' }, '#checkbox');
            checkbox.labelMouseLeaveHandler(event);
            checkbox.labelMouseUpHandler(event);
            enableRipple(false);
        })

        it('CheckBox with checked state', () => {
            enableRipple(true);
            checkbox = new CheckBox({ checked: true }, '#checkbox');
            expect(checkbox.checked).toEqual(true);
            checkbox.element.click();
            expect(checkbox.checked).toEqual(false);
            enableRipple(false);
        });

        it('CheckBox indeterminate with ripple state', () => {
            enableRipple(true);
            checkbox = new CheckBox({ indeterminate: true }, '#checkbox');
            enableRipple(false);
        });

        it('CheckBox indeterminate with ripple state', () => {
            enableRipple(true);
            checkbox = new CheckBox({ indeterminate: true, labelPosition: 'Before' }, '#checkbox');
            enableRipple(false);
        });

        it('CheckBox with indeterminate state', () => {
            checkbox = new CheckBox({ indeterminate: true }, '#checkbox');
            expect(element.parentElement.children[1].classList.contains('e-stop')).toEqual(true);
            element.parentElement.click();
            expect(element.parentElement.children[1].classList.contains('e-stop')).toEqual(false);
            checkbox.checked = true;
            checkbox.dataBind();
            checkbox.indeterminate = true;
            checkbox.dataBind();
            checkbox.isVue = true;
            element.parentElement.click();
            expect(element.parentElement.children[1].classList.contains('e-check')).toEqual(true);
            checkbox = new CheckBox({ indeterminate: true });
            (checkbox as any).isVue = true;
            checkbox.appendTo('#checkbox')
            element.parentElement.click();
            element.parentElement.click();
        });

        it('CheckBox with object value', () => {
            checkbox = new CheckBox({ value: 'volleyball' }, '#checkbox');
            (checkbox as any).isVue = true;
            (checkbox.value as Object) = {'games': 'volleyball'};
            checkbox.appendTo('#checkbox');
        });

        it('Vue CheckBox with indeterminate', function () {
            checkbox = new CheckBox({ indeterminate: null });
            checkbox.isVue = true;
            checkbox.value = true;
            checkbox.getWrapper();
            checkbox.getLabel();
            checkbox.appendTo('#checkbox');
        });
        it('Vue CheckBox with updateVueArrayModel function', function () {
            checkbox = new CheckBox({ indeterminate: null });
            checkbox.isVue = true;
            checkbox.value = ['games', 'volleyball'];
            checkbox.appendTo('#checkbox');
            checkbox.element.value = 'volleyball';
            checkbox.updateVueArrayModel();
        });
    });
});
