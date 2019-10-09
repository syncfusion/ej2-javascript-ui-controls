import { createCheckBox } from './../src/common/common';
import { CheckBox } from './../src/check-box/check-box';
import { createElement, EventHandler, attributes } from '@syncfusion/ej2-base';
import { profile , inMB, getMemoryProfile } from './common.spec';

/**
 * CheckBox Spec document
 */
function copyObject(source: any, destination: any): Object {
    for (let prop in source) {
        destination[prop] = source[prop];
    }
    return destination;
}

function setMouseCoordinates(eventarg: any, x: number, y: number, target: Element): Object {
    eventarg.pageX = x;
    eventarg.pageY = y;
    eventarg.clientX = x;
    eventarg.clientY = y;
    eventarg.target = target;
    return eventarg;
}

function getEventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

describe('CheckBox', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); // skips test (in Chai)
            return;
        }
    });

    let checkbox: any;
    let element: HTMLFormElement = createElement('input', { id: 'checkbox' }) as HTMLFormElement;
    element.setAttribute('type', 'checkbox');
    document.body.appendChild(element);

    describe('DOM', () => {
        let i: number = 0;
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
            checkbox.labelMouseHandler({ type: 'mousedown' });
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

        it('Checkbox with ARIA attribute', () => {
            checkbox = new CheckBox({}, '#checkbox');
            expect(element.parentElement.parentElement.getAttribute('role')).toEqual('checkbox');
            expect(element.parentElement.parentElement.getAttribute('aria-checked')).toEqual('false');
            checkbox.checked = true;
            checkbox.dataBind();
            expect(element.parentElement.parentElement.getAttribute('aria-checked')).toEqual('true');
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
    });

    describe('Property', () => {
        let i: number = 0;
        function changeFn(): void {
            i = 1;
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
            let wrapper: Element = checkbox.element.parentElement.parentElement;
            let label: Element =  wrapper.getElementsByTagName('label')[0];
            let cbox: any = getEventObject('MouseEvents', 'mouseup');
            cbox = setMouseCoordinates(checkbox, 5, 5, label);
            EventHandler.trigger(label as HTMLElement, 'mouseup', cbox);
            checkbox.clickHandler();
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
            let checkboxElem: Element = createCheckBox(createElement);
            expect(checkboxElem.classList.contains('e-checkbox-wrapper')).toBe(true);
            expect(checkboxElem.querySelector('.e-frame')).not.toBeNull();
        });

        it('with ripple effect', () => {
            let checkboxElem: Element = createCheckBox(createElement, true);
            expect(checkboxElem.querySelector('.e-ripple-container')).not.toBeNull();
        });

        it('with checked', () => {
            let checkboxElem: Element = createCheckBox(createElement, false, { checked: true, cssClass: 'e-small' });
            expect(checkboxElem.querySelector('.e-check')).not.toBeNull();
            expect(checkboxElem.classList.contains('e-small')).toBe(true);
        });

        it('with label and without rtl', () => {
            let checkboxElem: Element = createCheckBox(createElement, true, { label: 'checkbox' });
            expect(checkboxElem.querySelector('.e-label')).not.toBeNull();
            expect(checkboxElem.classList.contains('e-rtl')).toBe(false);
        });

        it('with label and rtl', () => {
            let checkboxElem: Element = createCheckBox(createElement, true, { label: 'checkbox', enableRtl: true });
            expect(checkboxElem.classList.contains('e-rtl')).toBe(true);
        });
    });

    describe('CheckBox in HTML5 forms', () => {
        let input: HTMLFormElement;
        let input1: HTMLFormElement;
        let formElement: HTMLFormElement;
        let cbox: CheckBox;
        let cbox1: CheckBox;

        beforeEach(() => {

            formElement = createElement('form', {
                id: 'form'
            }) as HTMLFormElement;

            input = createElement('input', { id: 'checkbox1' }) as HTMLFormElement;
            input.setAttribute('type', 'checkbox');

            input1 = createElement('input', { id: 'checkbox2' }) as HTMLFormElement;
            input1.setAttribute('type', 'checkbox');

            formElement.appendChild(input);
            formElement.appendChild(input1);

            document.body.appendChild(formElement);
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

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        // check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        // check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});