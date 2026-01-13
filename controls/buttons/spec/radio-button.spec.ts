/* eslint-disable @typescript-eslint/no-explicit-any */
import { RadioButton } from './../src/radio-button/radio-button';
import { createElement } from '@syncfusion/ej2-base';
import { profile , inMB, getMemoryProfile } from './common.spec';
import { enableRipple } from '@syncfusion/ej2-base';

/**
 * RadioButton Spec document
 */
describe('RadioButton', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    let radio: any;
    const element: HTMLFormElement = createElement('input', { id: 'radio' }) as HTMLFormElement;
    element.setAttribute('type', 'radio');
    document.body.appendChild(element);
    describe('DOM', () => {
        let i = 0;
        function changeFn(): void {
            i = 1;
        }
        afterEach(() => {
            radio.destroy();
        });

        it('RadioButton Testing With State', () => {
            radio = new RadioButton({}, '#radio');
            expect(element.classList.contains('e-radio')).toEqual(true);
            expect(element.nextElementSibling.tagName).toEqual('LABEL');
            expect(element.parentElement.classList.contains('e-radio-wrapper')).toEqual(true);

        });

        it('RadioButton with Label', () => {
            radio = new RadioButton({ label: 'radiobutton' }, '#radio');
            expect(element.nextElementSibling.children[0].classList.contains('e-label')).toEqual(true);
            expect(element.nextElementSibling.children[0].textContent).toEqual('radiobutton');
        });

        it('RadioButton with disabled state', () => {
            radio = new RadioButton({ disabled: true }, '#radio');
            expect(element.disabled).toEqual(true);
        });

        it('RadioButton with RTL', () => {
            radio = new RadioButton({ enableRtl: true }, '#radio');
            expect(element.nextElementSibling.classList.contains('e-rtl')).toEqual(true);
        });

        it('RadioButton with labelPosition', () => {
            radio = new RadioButton({ label: 'RadioButton', labelPosition: 'Before' }, '#radio');
            expect(element.parentElement.children[1].nodeName).toEqual('LABEL');
        });

        it('RadioButton with name property', () => {
            radio = new RadioButton({ name: 'gender' }, '#radio');
            expect(element.getAttribute('name')).toEqual('gender');
        });

        it('RadioButton with value property', () => {
            radio = new RadioButton({ value: 'male' }, '#radio');
            expect(element.getAttribute('value')).toEqual('male');
        });

        it('RadioButton with htmlAttributes', () => {
            radio = new RadioButton({}, '#radio');
            radio.appendTo('#radio');
            radio.htmlAttributes = {'class':'Choose Option'};
            radio.dataBind();
            radio.htmlAttributes = { 'data-containerid': 'error-agreement', 'test': 'test' };
            radio.dataBind();
            radio.htmlAttributes = { 'name': 'radio-btn' };
            radio.dataBind();
        });

        it('RadioButton with cssClass', () => {
            radio = new RadioButton({ cssClass: 'class' }, '#radio');
            expect(element.parentElement.classList.contains('class')).toEqual(true);
        });

        it('RadioButton with change event', () => {
            radio = new RadioButton({ change: changeFn }, '#radio');
            (element.nextElementSibling as HTMLElement).click();
            expect(i).toEqual(1);
        });

        it('Vue RadioButton with change event', () => {
            radio = new RadioButton({ change: changeFn }, '#radio');
            radio.isVue = true;
            radio.value = true;
            (element.nextElementSibling as HTMLElement).click();
            expect(i).toEqual(1);
            radio = new RadioButton({ });
            radio.isVue = true;
            radio.value = true;
            radio.appendTo('#radio');
        });
    });

    describe('Property', () => {
        function changeFn(): void {
            console.log("changed");
        }
        afterEach(() => {
            radio.destroy();
        });

        it('RadioButton with Label', () => {
            radio = new RadioButton({ label: 'radiobutton' }, '#radio');
            expect(radio.label).toEqual('radiobutton');
        });

        it('RadioButton with checked state', () => {
            radio = new RadioButton({ checked: true }, '#radio');
            expect(radio.checked).toEqual(true);
        });

        it('RadioButton with disabled state', () => {
            radio = new RadioButton({ disabled: true }, '#radio');
            expect(radio.disabled).toEqual(true);
        });

        it('RadioButton with RTL', () => {
            radio = new RadioButton({ enableRtl: true }, '#radio');
            expect(radio.enableRtl).toEqual(true);
        });

        it('RadioButton with label position', () => {
            radio = new RadioButton({ labelPosition: 'Before' }, '#radio');
            expect(radio.labelPosition).toEqual('Before');
        });

        it('RadioButton with name', () => {
            radio = new RadioButton({ name: 'gender' }, '#radio');
            expect(radio.name).toEqual('gender');
        });

        it('RadioButton with value', () => {
            radio = new RadioButton({ value: 'male' }, '#radio');
            expect(radio.value).toEqual('male');
        });

        it('RadioButton with cssClass', () => {
            radio = new RadioButton({ cssClass: 'class' }, '#radio');
            expect(radio.cssClass).toEqual('class');
        });

        it('RadioButton with change event', () => {
            radio = new RadioButton({ change: changeFn }, '#radio');
            expect(radio.change).toEqual(changeFn);
        });

        it('RadioButton with persistence', () => {
            radio = new RadioButton({ enablePersistence: true }, '#radio');
            expect(radio.enablePersistence).toEqual(true);
        });

        it('Enable Html Sanitizer testing', () => {
            radio = new RadioButton({ label: '<style>body{background:rgb(0, 0, 255)}</style>' }, '#radio');
            const htmlele: Element = document.body;
            expect(window.getComputedStyle(htmlele).backgroundColor).not.toBe('rgb(0, 0, 255)');
        });

        it('Enable Html Sanitizer disabled testing', () => {
            radio = new RadioButton({ label: '<style>body{background:rgb(0, 0, 255)}</style>', enableHtmlSanitizer: false }, '#radio');
            const htmlele: Element = document.body;
            expect(window.getComputedStyle(htmlele).backgroundColor).toBe('rgb(0, 0, 255)');
        });
        it('Enable Html Attributes testing', () => {
            radio = new RadioButton({ htmlAttributes: {'title':'Choose Option'}, label: '<style>body{background:rgb(0, 0, 255)}</style>' }, '#radio');
            const htmlele: Element = document.body;
            expect(window.getComputedStyle(htmlele).backgroundColor).not.toBe('rgb(0, 0, 255)');
        });
    });

    describe('Notify property changes of', () => {
        afterEach(() => {
            radio.destroy();
        });

        it('RadioButton with Label', () => {
            radio = new RadioButton({ label: 'radiobutton' }, '#radio');
            radio.label = 'radio';
            radio.dataBind();
            expect(radio.label).toEqual('radio');
            expect(element.nextElementSibling.textContent).toEqual('radio');
        });

        it('RadioButton with checked state', () => {
            radio = new RadioButton({}, '#radio');
            radio.checked = true;
            radio.dataBind();
            expect(radio.checked).toEqual(true);
            radio.checked = false;
            radio.dataBind();
            expect(radio.checked).toEqual(false);
        });

        it('RadioButton with disabled state', () => {
            radio = new RadioButton({}, '#radio');
            radio.disabled = true;
            radio.dataBind();
            expect(radio.disabled).toEqual(true);
            expect(element.disabled).toEqual(true);
            radio.disabled = false;
            radio.dataBind();
            expect(radio.disabled).toEqual(false);
            expect(element.disabled).toEqual(false);
        });

        it('RadioButton with RTL', () => {
            radio = new RadioButton({}, '#radio');
            radio.enableRtl = true;
            radio.dataBind();
            expect(radio.enableRtl).toEqual(true);
            expect(element.nextElementSibling.classList.contains('e-rtl')).toEqual(true);
            radio.enableRtl = false;
            radio.dataBind();
            expect(radio.enableRtl).toEqual(false);
            expect(element.nextElementSibling.classList.contains('e-rtl')).toEqual(false);
        });

        it('RadioButton with labelPosition', () => {
            radio = new RadioButton({ label: 'RadioButton' }, '#radio');
            radio.labelPosition = 'Before';
            radio.dataBind();
            expect(element.parentElement.children[1].classList.contains('e-right')).toEqual(true);
            radio.labelPosition = 'After';
            radio.dataBind();
            expect(element.parentElement.children[1].classList.contains('e-right')).toEqual(false);
        });

        it('RadioButton with name', () => {
            radio = new RadioButton({}, '#radio');
            radio.name = 'gender';
            radio.dataBind();
            expect(element.getAttribute('name')).toEqual('gender');
        });

        it('RadioButton with value', () => {
            radio = new RadioButton({}, '#radio');
            radio.value = 'male';
            radio.dataBind();
            expect(element.getAttribute('value')).toEqual('male');
        });

        it('RadioButton with cssClass', () => {
            radio = new RadioButton({}, '#radio');
            radio.cssClass = 'class';
            radio.dataBind();
            expect(element.parentElement.classList.contains('class')).toEqual(true);
            radio.cssClass = 'newClass';
            radio.dataBind();
            expect(element.parentElement.classList.contains('newClass')).toEqual(true);
        });
    });


    describe('Methods', () => {
        it('Destroy method', () => {
            radio = new RadioButton({}, '#radio');
            radio.destroy();
            expect(element.checked).toEqual(false);
            expect(element.getAttribute('name')).toEqual(null);
            expect(element.getAttribute('value')).toEqual(null);
            expect(element.disabled).toEqual(false);
        });

        it('Keyboard Event', () => {
            radio = new RadioButton({}, '#radio');
            radio.focusHandler();
            radio.keyUpHandler();
            expect(element.nextElementSibling.classList.contains('e-focus')).toEqual(true);
            radio.focusOutHandler();
            radio.focusHandler();
            expect(element.nextElementSibling.classList.contains('e-focus')).toEqual(false);
            radio.focusOutHandler();
        });

        it('Mouse Event', () => {
            radio = new RadioButton({}, '#radio');
            radio.focusHandler();
            expect(element.nextElementSibling.classList.contains('e-focus')).toEqual(false);
            radio.focusOutHandler();
            radio.focusHandler();
            const event: any = {
                preventDefault: (): void => { /** NO Code */ },
                type: 'mousedown'
            };
            radio.labelMouseDownHandler(event);
            expect(element.parentElement.children[0].classList.contains('e-ripple-container')).toEqual(false);
        });

        it('Pre render method', () => {
            document.body.appendChild(createElement('EJS-RADIOBUTTON', { id: 'ngradiobutton', attrs: { label: 'radiobutton' } }));
            radio = new RadioButton({}, '#ngradiobutton');
            expect(radio.element.parentElement.tagName).toEqual('EJS-RADIOBUTTON');
            expect(radio.element.parentElement.children[0].tagName).toEqual('INPUT');
            expect(radio.element.parentElement.children[1].tagName).toEqual('LABEL');
            expect(radio.element.getAttribute('label')).toEqual(null);
            radio.isAngular = true;
            radio.element.click();
            radio.destroy();
            expect((document.getElementById('ngradiobutton')).tagName).toBe('EJS-RADIOBUTTON');
            radio = new RadioButton({}, document.body.appendChild(createElement('input')) as HTMLInputElement);
            expect(radio.element.id).toContain('e-radio');
            expect(radio.element.type).toEqual('radio');
        });
        it('getSelectedValue method', () => {
            document.body.appendChild(createElement('input', { id: 'group1', attrs: { 'type': 'radio' } }));
            document.body.appendChild(createElement('input', { id: 'group2', attrs: { 'type': 'radio' } }));
            radio = new RadioButton({ name: 'group', value: '1' }, '#group1');
            const radio2: RadioButton = new RadioButton({ name: 'group', value: '2' }, '#group2');
            expect(radio.getSelectedValue()).toEqual('');
            radio.element.click();
            expect(radio2.getSelectedValue()).toEqual('1');
            radio2.element.click();
            expect(radio.getSelectedValue()).toEqual('2');
            radio2.destroy();
        });
        it('Native methods - Click and Focus ', () => {
            document.body.appendChild(createElement('input', { id: 'group1', attrs: { 'type': 'radio' } }));
            document.body.appendChild(createElement('input', { id: 'group2', attrs: { 'type': 'radio' } }));
            radio = new RadioButton({ name: 'group', value: '1' }, '#group1');
            radio.click();
            radio.focusIn();
        });
        it('Refresh methods ', () => {
            document.body.appendChild(createElement('input', { id: 'group1', attrs: { 'type': 'radio' } }));
            document.body.appendChild(createElement('input', { id: 'group2', attrs: { 'type': 'radio' } }));
            radio = new RadioButton({ name: 'group', value: '1' }, '#group1');
            const radio2: RadioButton = new RadioButton({ name: 'group', value: '2' }, '#group2');
            radio.refresh();
            radio2.refresh();
        });

        it('HtmlAttributes property not working properly in RadioButton', () => {
            radio = new RadioButton({htmlAttributes: { 'data-containerid': 'error-agreement', 'test': 'test' }}, '#radio');
            expect(radio.element.parentElement.getAttribute('data-containerid').indexOf('error-agreement')).toEqual(0);
            expect(radio.element.parentElement.getAttribute('test').indexOf('test')).toEqual(0);
        });
        it('HtmlAttributes id should apply to input and sync label for, while other attributes apply to wrapper', () => {
            // Arrange: create a fresh input for this test
            const inputEl: HTMLInputElement = createElement('input', { id: 'rb-htmlattr' }) as HTMLInputElement;
            inputEl.setAttribute('type', 'radio');
            document.body.appendChild(inputEl);
            radio = new RadioButton({
                htmlAttributes: {
                id: 'custom-radio-id',
                title: 'Custom Title',
                'data-extra': 'extra'
            }
        }, '#rb-htmlattr');
            const wrapper: Element = radio.element.parentElement as Element;
            const label: Element = radio.element.nextElementSibling as Element;

            expect(radio.element.id).toBe('custom-radio-id');
            expect(label.getAttribute('for')).toBe('custom-radio-id');
    
            expect(wrapper.getAttribute('title')).toBe('Custom Title');
            expect(wrapper.getAttribute('data-extra')).toBe('extra');
    
            // Ensure wrapper does not receive the id attribute
            expect(wrapper.getAttribute('id')).toBeNull();
    
            // Update htmlAttributes and ensure synchronization continues to work
            radio.htmlAttributes = {
                id: 'custom-radio-id-2',
                title: 'Updated Title',
                'data-extra': 'updated-extra'
            };
            radio.dataBind();
    
            // Re-acquire label in case of any DOM changes
            const updatedLabel: Element = radio.element.nextElementSibling as Element;
    
            expect(radio.element.id).toBe('custom-radio-id-2');
            expect(updatedLabel.getAttribute('for')).toBe('custom-radio-id-2');
            expect(wrapper.getAttribute('title')).toBe('Updated Title');
            expect(wrapper.getAttribute('data-extra')).toBe('updated-extra');
    
            // Cleanup
            radio.destroy();
            inputEl.remove();
        });

    });

    describe('RadioButton in HTML5 forms', () => {
        let input: HTMLFormElement;
        let input1: HTMLFormElement;
        let formElement: HTMLFormElement;
        let radio: RadioButton;
        let radio1: RadioButton;

        beforeEach(() => {

            formElement = createElement('form', {
                id: 'form'
            }) as HTMLFormElement;

            input = createElement('input', { id: 'radio1' }) as HTMLFormElement;
            input.setAttribute('type', 'radio');

            input1 = createElement('input', { id: 'radio2' }) as HTMLFormElement;
            input1.setAttribute('type', 'radio');

            formElement.appendChild(input);
            formElement.appendChild(input1);

            document.body.appendChild(formElement);
        })

        afterEach(() => {
            radio.destroy();
            radio1.destroy();
            formElement.remove();
        })

        it('form reset should make radiobutton to its initial value', () => {
            radio = new RadioButton({
                name: 'radiogroup',
                checked: true
            }, '#radio1');
            radio1 = new RadioButton({
                name: 'radiogroup',
            }, '#radio2');
            radio1.checked = true;
            radio1.dataBind();
            expect(radio1.checked).toBeTruthy();
            expect(radio.checked).toBeFalsy();
            formElement.reset();
            expect(radio.checked).toBeTruthy();
            expect(radio1.checked).toBeFalsy();
        });

        it('form reset should make radiobutton to its default value', () => {
            radio = new RadioButton({ name: 'radiogroup' }, '#radio1');
            radio1 = new RadioButton({ name: 'radiogroup' }, '#radio2');
            radio.checked = true;
            expect(radio.checked).toBeTruthy();
            expect(radio1.checked).toBeFalsy();
            formElement.reset();
            expect(radio.checked).toBeFalsy();
            expect(radio.checked).toBeFalsy();
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
            radio.destroy();
        });

        it('RadioButton with Label', () => {
            radio = new RadioButton({ label: null }, '#radio');
            expect(radio.label).toEqual(null);
            radio = new RadioButton({ label: undefined }, '#radio');
            expect(radio.label).toEqual('');
        });

        it('RadioButton with checked state', () => {
            radio = new RadioButton({ checked: null }, '#radio');
            expect(radio.checked).toEqual(null);
            radio = new RadioButton({ checked: undefined }, '#radio');
            expect(radio.checked).toEqual(false);
        });

        it('RadioButton with disabled state', () => {
            radio = new RadioButton({ disabled: null }, '#radio');
            expect(radio.disabled).toEqual(null);
            radio = new RadioButton({ checked: undefined }, '#radio');
            expect(radio.checked).toEqual(false);
        });

        it('RadioButton with RTL', () => {
            radio = new RadioButton({ enableRtl: null }, '#radio');
            expect(radio.enableRtl).toEqual(false);
            radio = new RadioButton({ enableRtl: undefined }, '#radio');
            expect(radio.enableRtl).toEqual(false);
        });

        it('RadioButton with label position', () => {
            radio = new RadioButton({ labelPosition: null }, '#radio');
            expect(radio.labelPosition).toEqual(null);
            radio = new RadioButton({ labelPosition: undefined }, '#radio');
            expect(radio.labelPosition).toEqual('After');
        });

        it('RadioButton with name', () => {
            radio = new RadioButton({ name: null }, '#radio');
            expect(radio.name).toEqual(null);
            radio = new RadioButton({ name: undefined }, '#radio');
            expect(radio.name).toEqual('');
        });

        it('RadioButton with value', () => {
            radio = new RadioButton({ value: null }, '#radio');
            expect(radio.value).toEqual(null);
            radio = new RadioButton({ value: undefined }, '#radio');
            expect(radio.value).toEqual('');
        });

        it('RadioButton with cssClass', () => {
            radio = new RadioButton({ cssClass: null }, '#radio');
            expect(radio.cssClass).toEqual(null);
            radio = new RadioButton({ cssClass: undefined }, '#radio');
            expect(radio.cssClass).toEqual('');
        });

        it('RadioButton with persistence', () => {
            radio = new RadioButton({ enablePersistence: null }, '#radio');
            expect(radio.enablePersistence).toEqual(null);
            radio = new RadioButton({ enablePersistence: undefined }, '#radio');
            expect(radio.enablePersistence).toEqual(false);
        });

        it('RadioButton with Html Sanitizer', () => {
            radio = new RadioButton({ enableHtmlSanitizer: null }, '#radio');
            expect(radio.enableHtmlSanitizer).toEqual(null);
            radio = new RadioButton({ enableHtmlSanitizer: undefined }, '#radio');
            expect(radio.enableHtmlSanitizer).toEqual(true);
        });

        it('RadioButton with Html Attributes', () => {
            radio = new RadioButton({ htmlAttributes: null }, '#radio');
            expect(radio.htmlAttributes).toEqual(null);
            radio = new RadioButton({ htmlAttributes: undefined }, '#radio');
            expect(radio.htmlAttributes).toEqual({});
        });

        it('RadioButton with Locale', () => {
            radio = new RadioButton({ locale: null }, '#radio');
            expect(radio.locale).toEqual('en-US');
            radio = new RadioButton({ locale: undefined }, '#radio');
            expect(radio.locale).toEqual('en-US');
        });
    });

    describe('Coverage Improvement', function () {
        it('Mouse Handler', () => {
            enableRipple(true);
            radio = new RadioButton({}, '#radio');
            radio.focusHandler();
            expect(element.nextElementSibling.classList.contains('e-focus')).toEqual(false);
            radio.focusOutHandler();
            radio.focusHandler();
            const event: any = {
                preventDefault: (): void => { /** NO Code */ },
                type: 'mousedown'
            };
            radio.labelMouseDownHandler(event);
            radio.labelMouseLeaveHandler(event);
            radio.labelMouseUpHandler(event);
            expect(element.parentElement.children[0].classList.contains('e-ripple-container')).toEqual(false);
            enableRipple(false);
        });
    });
});
