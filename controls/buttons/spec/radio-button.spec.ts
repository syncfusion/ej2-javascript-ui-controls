import { RadioButton } from './../src/radio-button/radio-button';
import { createElement } from '@syncfusion/ej2-base';

/**
 * RadioButton Spec document
 */
describe('RadioButton', () => {
    let radio: any;
    let element: HTMLFormElement = createElement('input', { id: 'radio' }) as HTMLFormElement;
    element.setAttribute('type', 'radio');
    document.body.appendChild(element);
    describe('DOM', () => {
        let i: number = 0;
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

        it('RadioButton with cssClass', () => {
            radio = new RadioButton({ cssClass: 'class' }, '#radio');
            expect(element.nextElementSibling.classList.contains('class')).toEqual(true);
        });

        it('RadioButton with change event', () => {
            radio = new RadioButton({ change: changeFn }, '#radio');
            (element.nextElementSibling as HTMLElement).click();
            expect(i).toEqual(1);
        });
    });

    describe('Property', () => {
        let i: number = 0;
        function changeFn(): void {
            i = 1;
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
            expect(element.nextElementSibling.classList.contains('class')).toEqual(true);
            radio.cssClass = 'newClass';
            radio.dataBind();
            expect(element.nextElementSibling.classList.contains('newClass')).toEqual(true);
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
            radio.keyDownHandler();
            radio.focusHandler();
            expect(element.nextElementSibling.classList.contains('e-focus')).toEqual(true);
            radio.focusOutHandler();
            radio.mouseDownHandler();
            radio.focusHandler();
            expect(element.nextElementSibling.classList.contains('e-focus')).toEqual(false);
            radio.focusOutHandler();
        });

        it('Mouse Event', () => {
            radio = new RadioButton({}, '#radio');
            radio.mouseDownHandler();
            radio.focusHandler();
            expect(element.nextElementSibling.classList.contains('e-focus')).toEqual(false);
            radio.focusOutHandler();
            radio.mouseDownHandler();
            let event: any = {
                preventDefault: (): void => { /** NO Code */ },
                type: 'mousedown'
            };
            radio.labelRippleHandler(event);
            expect(element.parentElement.children[0].classList.contains('e-ripple-container')).toEqual(false);
        });

        it('Pre render method', () => {
            document.body.appendChild(createElement('EJS-RADIOBUTTON', { id: 'ngradiobutton', attrs: { label: 'radiobutton' } }));
            radio = new RadioButton({}, '#ngradiobutton');
            expect(radio.element.parentElement.tagName).toEqual('EJS-RADIOBUTTON');
            expect(radio.element.parentElement.children[0].tagName).toEqual('INPUT');
            expect(radio.element.parentElement.children[1].tagName).toEqual('LABEL');
            expect(radio.element.getAttribute('label')).toEqual(null);
            radio.element.click();
            radio.destroy();
            expect((document.getElementById('ngradiobutton')).tagName).toBe('EJS-RADIOBUTTON');
            radio = new RadioButton({}, document.body.appendChild(createElement('input')) as HTMLInputElement);
            expect(radio.element.id).toContain('e-radio');
            expect(radio.element.type).toEqual('radio');
        });
    });
});
