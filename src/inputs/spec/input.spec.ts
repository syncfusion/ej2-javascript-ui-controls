/**
 * Floating Input through Utility
 */
import { createElement, attributes , isNullOrUndefined} from '@syncfusion/ej2-base';
import { Input, InputObject } from '../src/input/input';

describe('Input', () => {
    describe('createInput', () => {
        describe('create wrapper', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                    element: element
                });
            });
            it('class name of container element', () => {
                expect(inputObj.container.classList.contains('e-input-group')).toBe(true);
            });
            it('class name of input element', () => {
                expect(element.classList.contains('e-input')).toBe(true);
            });
            it('Dom size', () => {
                expect((inputObj.container.querySelectorAll('*').length === 1)).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('multiple buttons', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                    element: element,
                    buttons: ['e-icon-close', 'e-icon-search']
                });
            });
            it('class name of first button', () => {
                expect(inputObj.buttons[0].classList.contains('e-icon-close')).toBe(true);
            });
            it('class name of second button', () => {
                expect(inputObj.buttons[1].classList.contains('e-icon-search')).toBe(true);
            });
            it('Dom size', () => {
                expect((inputObj.container.querySelectorAll('*').length === 3)).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('readonly', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                    element: element,
                    properties: {
                        readonly: true,
                        placeholder: 'Search here',
                        cssClass: 'custom-class',
                        enabled: false,
                        enableRtl: true,
                    }
                });
            });
            it('readonly attribute in input element', () => {
                expect(element.hasAttribute('readonly')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('placeholder', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                    element: element,
                    properties: {
                        placeholder: 'Search here',
                    }
                });
            });
            it('placeholder attribute value in input element', () => {
                expect((element.getAttribute('placeholder') === 'Search here')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('cssClass', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                    element: element,
                    properties: {
                        cssClass: 'e-custom-class e-custom-class1',
                    }
                });
            });
            it('class name in container element', () => {
                expect(inputObj.container.classList.contains('e-custom-class')).toBe(true);
                expect(inputObj.container.classList.contains('e-custom-class1')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('enabled', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                    element: element,
                    properties: {
                        enabled: false,
                    }
                });
            });
            it('disabled and aria-disabled attribute in input element', () => {
                expect(element.hasAttribute('disabled') && element.hasAttribute('aria-disabled')).toBe(true);
            });
            it('e-disabled class in element', () => {
                expect(element.classList.contains('e-disabled')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('enableRtl', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                    element: element,
                    properties: {
                        enableRtl: true,
                    }
                });
            });
            it('e-rtl class in container element', () => {
                expect(inputObj.container.classList.contains('e-rtl')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
    });
    describe('appendButton', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
            });
        });
        it('class name of added button', () => {
            let button: HTMLElement = Input.appendSpan('e-icon-spin', inputObj.container);
            expect(button.classList.contains('e-icon-spin')).toBe(true);
        });
        it('Dom size', () => {
            expect((inputObj.container.querySelectorAll('*').length === 2)).toBe(true);
        });
        afterAll(() => {
            element.remove();
        });
    });
    describe('Check Focus in and out', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
            });
        });
        it('Check Focus in and out', () => {
            element.focus();
            expect((inputObj.container.classList.contains('e-input-focus'))).toBe(true);
            element.blur();
            expect((inputObj.container.classList.contains('e-input-focus'))).toBe(false);
        });
        afterAll(() => {
            element.remove();
        });
    });
    describe('Check Focus in and out for float input', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
                floatLabelType: "Auto",
                properties: {
                 placeholder: 'Read float group',
                 readonly: true,
                },
            });
        });
        it('Check Focus in and out for float input', () => {
            element.focus();
            expect((inputObj.container.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top'))).toBe(true);
            element.blur();
            expect((inputObj.container.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top'))).toBe(false);
        });
        afterAll(() => {
            element.remove();
        });
    });
    describe('Check input button selected state with mouse up and down', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
                buttons: ['e-input-group-icon']
            });
        });
        it('Check mouse down event', () => {
            let spanEle: HTMLElement = inputObj.buttons[0];
            let mouseEvents: Event = document.createEvent('MouseEvents');
            mouseEvents.initEvent('mousedown', true, true);
            spanEle.dispatchEvent(mouseEvents);
            spanEle.addEventListener('mousedown', function (): void {
                expect((this.classList.contains('e-input-btn-ripple'))).toBe(true);
            });
        });
        it('Check mouse up event', (done: Function) => {
            let spanEle: HTMLElement = inputObj.buttons[0];
            let mouseEvents: Event = document.createEvent('MouseEvents');
            mouseEvents.initEvent('mouseup', true, true);
            spanEle.dispatchEvent(mouseEvents);
            setTimeout(
                () => {
                    spanEle.addEventListener('mouseup', function (): void {
                        expect((this.classList.contains('e-input-btn-ripple'))).toBe(false);
                    });
                    done();
                },
                1500);
        });
        afterAll(() => {
            element.remove();
        });
    });
    describe('Render Input box with Custom tag', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
                customTag: 'ej2-custominput'
            });
        });
        it('Check custom tag name', () => {
            expect((inputObj.container.tagName === 'EJ2-CUSTOMINPUT')).toBe(true);
        });
        afterAll(() => {
            element.remove();
        });
    });
    describe('Render Floating Input box with Custom tag', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
                floatLabelType: "Auto",
                customTag: 'ej2-custominput'
            });
        });
        it('Check custom tag name', () => {
            expect((inputObj.container.tagName === 'EJ2-CUSTOMINPUT')).toBe(true);
        });
        afterAll(() => {
            element.remove();
        });
    });
    describe('Dynamic update the properties', () => {
        describe('setPlaceholder', () => {
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                Input.setPlaceholder('Search here', element);
            });
            it('placeholder text', () => {
                expect(!isNullOrUndefined(element.getAttribute('placeholder'))).toBe(true);
            });
            it('remove placeholder while pass empty string', () => {
                Input.setPlaceholder('', element);
                expect(isNullOrUndefined(element.getAttribute('placeholder'))).toBe(true);
            });
            it('remove placeholder while pass null value', () => {
                Input.setPlaceholder('Search here', element);
                Input.setPlaceholder(null, element);
                expect(isNullOrUndefined(element.getAttribute('placeholder'))).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('setCssClass', () => {
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                Input.setCssClass('e-custom-class', [element]);
            });
            it('class name of element', () => {
                expect(element.classList.contains('e-custom-class')).toBe(true);
            });
            it('remove the old cssClass name from element', () => {
                Input.setCssClass('e-change-class', [element], 'e-custom-class');
                expect(element.classList.contains('e-custom-class')).toBe(false);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('setReadonly', () => {
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                Input.setReadonly(true, element);
            });
            it('add readonly attribute in input element', () => {
                expect(element.hasAttribute('readonly')).toBe(true);
            });
            it('remove readonly attribute in input element', () => {
                Input.setReadonly(false, element);
                expect(element.hasAttribute('readonly')).toBe(false);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('setEnableRtl', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                    element: element
                });
                Input.setEnableRtl(true, [inputObj.container]);
            });
            it('add e-rtl class in container element', () => {
                expect(inputObj.container.classList.contains('e-rtl')).toBe(true);
            });
            it('remove e-rtl class in container element', () => {
                Input.setEnableRtl(false, [inputObj.container]);
                expect(inputObj.container.classList.contains('e-rtl')).toBe(false);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('setEnabled', () => {
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                Input.setEnabled(false, element);
            });
            it('disabled and aria-disabled attribute in input element', () => {
                expect(element.hasAttribute('disabled') && element.hasAttribute('aria-disabled')).toBe(true);
            });
            it('add e-disabled class in element', () => {
                expect(element.classList.contains('e-disabled')).toBe(true);
            });
            it('remove the disabled and aria-disabled attribute in input element', () => {
                Input.setEnabled(true, element);
                expect(element.hasAttribute('disabled') && element.hasAttribute('aria-disabled')).toBe(false);
            });
            it('remove e-disabled class in element', () => {
                expect(element.classList.contains('e-disabled')).toBe(false);
            });
            afterAll(() => {
                element.remove();
            });
        });

        describe('SetValue method with floating input', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                    element: element,
                    floatLabelType: "Auto",
                    properties: {
                      placeholder: 'Float Input',
                      showClearButton: false
                    }
                });
            });
            it('set value dynamically to the input', () => {
                expect((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-label-top')).toBe(false);
                Input.setValue("Hello",element,"Auto",false);
                expect(element.value).toEqual("Hello");
                expect((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-label-top')).toBe(true);
                Input.setValue("",element,"Auto",false);
                expect((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-label-top')).toBe(false);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('SetValue method with Always floating input', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                    element: element,
                    floatLabelType: "Always",
                    properties: {
                      placeholder: 'Float Input',
                      showClearButton: false
                    }
                });
            });

            it('set value dynamically to the float always type input', () => {
                expect((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-label-top')).toBe(true);
                Input.setValue("Hello",element,"Always",false);
                expect(element.value).toEqual("Hello");
                expect((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-label-top')).toBe(true);
                Input.setValue("",element,"Always",false);
                expect((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-label-top')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('SetValue method with clear input', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                    element: element,
                    floatLabelType: "Auto",
                    properties: {
                      placeholder: 'Float Input',
                      showClearButton: true
                    }
                });
            });
            it('set value dynamically to the input', () => {
                expect((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-label-top')).toBe(false);
                Input.setValue("Hello",element,"Auto",true);
                expect(element.value).toEqual("Hello");
                expect((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-label-top')).toBe(true);
                Input.setValue("",element,"Auto",true);
                expect((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-label-top')).toBe(false);
                inputObj.container.classList.add('e-input-focus');
                Input.setValue("Hello",element,"Auto",true);
                expect(document.getElementById('inputpopup').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(false);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('SetValue method with Always float with clear input', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                    element: element,
                    floatLabelType: "Always",
                    properties: {
                      placeholder: 'Float Input',
                      showClearButton: true
                    }
                });
            });

            it('set value dynamically to the float always type input', () => {
                expect((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-label-top')).toBe(true);
                Input.setValue("Hello",element,"Always",true);
                expect(element.value).toEqual("Hello");
                expect((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-label-top')).toBe(true);
                Input.setValue("",element,"Always",true);
                expect((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-label-top')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });

        describe('removeAttributes', () => {
            let disabledAttrs: { [key: string]: string } = { 'disabled': 'disabled' };
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                attributes(element, disabledAttrs);
            });
            it('remove the disabled attribute in input element', () => {
                Input.removeAttributes({ 'disabled': 'disabled', 'aria-disabled': 'true' }, element);
                expect(element.hasAttribute('disabled')).toBe(false);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('Remove and Add Floating feature with custom tag', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 customTag: "ej2-custom-tag",
                 properties: {
                  placeholder: 'Search Float',
                }
          });
            });
            it('add Floating', () => {
                let container: HTMLElement = inputObj.container;
                Input.addFloating(element, 'Auto', 'Search Float');
                expect(container.childElementCount).toBe(3);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('Remove and Add Floating feature', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Search Float',
                }
          });
            });
            it('Remove and add Floating', () => {
                let container: HTMLElement = inputObj.container;
                expect(container.childElementCount).toBe(3);
                Input.removeFloating(inputObj);
                expect(container.childElementCount).toBe(1);
                Input.addFloating(element, 'Auto', 'Search Float');
                expect(container.childElementCount).toBe(3);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('Remove floating without float sets', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
          });
            });
            it('Remove and add Floating', () => {
                let container: HTMLElement = inputObj.container;
                expect(container.childElementCount).toBe(1);
                Input.removeFloating(inputObj);
                expect(container.childElementCount).toBe(1);
                Input.addFloating(element, 'Auto', 'Search Float');
                expect(container.childElementCount).toBe(3);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('Remove floating with group-iocns', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Search Float',
                }
          });
            Input.appendSpan('e-input-group-icon e-input-down', inputObj.container);
            });
            it('Remove and add Floating', () => {
                let container: HTMLElement = inputObj.container;
                expect(container.childElementCount).toBe(4);
                Input.removeFloating(inputObj);
                expect(container.childElementCount).toBe(2);
                Input.addFloating(element, 'Auto', 'Search Float');
                expect(container.childElementCount).toBe(4);
                expect(container.lastElementChild.classList.contains('e-input-down')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('Remove and Add Floating feature with Clear Iocn', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Search Float',
                  showClearButton: true
                }
          });
            });
            it('Remove and add Floating', () => {
                let container: HTMLElement = inputObj.container;
                expect(container.childElementCount).toBe(4);
                Input.removeFloating(inputObj);
                expect(container.childElementCount).toBe(2);
                Input.addFloating(element, 'Auto', 'Search Float');
                expect(container.childElementCount).toBe(4);
            });
            afterAll(() => {
                element.remove();
            });
        });
    });
});

describe('FloatInput', () => {
    describe('createFloatInput', () => {
        describe('create wrapper', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Search Float',
                }
          });
            });
            it('class name of container element', () => {
                expect(inputObj.container.classList.contains('e-float-input')).toBe(true);
            });
            it('class and tag names of child nodes', () => {
                expect((inputObj.container.childNodes[0].nodeName === 'INPUT')).toBe(true);
                expect((inputObj.container.childNodes[1].nodeName === 'SPAN') &&
                 ((<HTMLElement>inputObj.container.childNodes[1]).classList.contains('e-float-line'))).toBe(true);
                expect((inputObj.container.childNodes[2].nodeName === 'LABEL') &&
                 ((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-float-text'))).toBe(true);
            });
            it('Dom size - Child nodes length', () => {
                expect((inputObj.container.childNodes.length === 3)).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('readonly', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  readonly: true,
                  placeholder: 'Search Float',
                }
              });
            });
            it('readonly attribute in input element', () => {
                expect(element.hasAttribute('readonly')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('placeholder through property', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text',
            placeholder: 'Through Input element' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Through property',
                }
              });
            });
            it('placeholder label for floating input through property', () => {
                expect(((<HTMLElement>inputObj.container.childNodes[2]).textContent === 'Through property')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('placeholder through input element', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text',
            placeholder: 'Through Input element' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
              });
            });
            it('placeholder label for floating input through input element', () => {
                expect(((<HTMLElement>inputObj.container.childNodes[2]).textContent === 'Through Input element')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('cssClass', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text'} });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  cssClass: 'e-custom-class',
                  placeholder: 'Through Input element',
                }
              });
            });
            it('class name in container element', () => {
                expect(inputObj.container.classList.contains('e-custom-class')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('enabled', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text'} });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Input element',
                  enabled: false
                }
              });
            });
            it('disabled and aria-disabled attribute in input element', () => {
                expect(element.hasAttribute('disabled') && element.hasAttribute('aria-disabled')).toBe(true);
            });
            it('e-disabled class in element', () => {
                expect(element.classList.contains('e-disabled')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('enableRtl', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text'} });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Input element',
                  enableRtl: true
                }
              });
            });
            it('e-rtl class in container element', () => {
                expect(inputObj.container.classList.contains('e-rtl')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
    });
    describe('floatLabelType value as Always', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text' } });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Always",
                 properties: {
                  placeholder: 'Search Float',
                }
          });
            });
            it('class name of container element', () => {
                expect(inputObj.container.classList.contains('e-float-input')).toBe(true);
            });
            it('class and tag names of child nodes', () => {
                expect((inputObj.container.childNodes[0].nodeName === 'INPUT')).toBe(true);
                expect((inputObj.container.childNodes[1].nodeName === 'SPAN') &&
                 ((<HTMLElement>inputObj.container.childNodes[1]).classList.contains('e-float-line'))).toBe(true);
                expect((inputObj.container.childNodes[2].nodeName === 'LABEL') &&
                 ((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-float-text'))).toBe(true);
                expect((<HTMLElement>inputObj.container.childNodes[2]).classList.contains('e-label-top')).toBe(true);
            });
            it('Dom size - Child nodes length', () => {
                expect((inputObj.container.childNodes.length === 3)).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
    describe('appendButton', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text'} });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
              element: element,
              floatLabelType: "Auto",
              properties: {
                placeholder: 'Input element',
                }
            });
          });
        it('class name of added button', () => {
           let button: HTMLElement;
           button = Input.appendSpan('e-icon-spin', inputObj.container);
           expect(button.classList.contains('e-icon-spin')).toBe(true);
        });
        it('Dom size and check group class name', () => {
            expect((inputObj.container.querySelectorAll('*').length === 4)).toBe(true);
            expect((inputObj.container.classList.contains('e-input-group'))).toBe(true);
        });
        afterAll(() => {
            element.remove();
        });
    });
    describe('Dynamic update the properties', () => {
        describe('setPlaceholder', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text'} });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
              });
                Input.setPlaceholder('Float placeholder', element);
            });
            it('placeholder text', () => {
                expect(((<HTMLElement>inputObj.container.childNodes[2]).textContent === 'Float placeholder')).toBe(true);
            });
            it('remove placeholder while pass empty string', () => {
                Input.setPlaceholder('', element);
                expect(isNullOrUndefined(element.getAttribute('placeholder'))).toBe(true);
            });
            it('remove placeholder while pass null value', () => {
                Input.setPlaceholder('Search here', element);
                Input.setPlaceholder(null, element);
                expect(isNullOrUndefined(element.getAttribute('placeholder'))).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('setCssClass', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text'} });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
              });
                Input.setCssClass('e-custom-class', [element]);
                Input.setCssClass('e-customparent-class', [inputObj.container]);
            });
            it('class name of element', () => {
                expect(element.classList.contains('e-custom-class')).toBe(true);
                expect(inputObj.container.classList.contains('e-customparent-class')).toBe(true);
            });
            it('remove the old cssClass name from element', () => {
                Input.setCssClass('e-customparent-newclass', [inputObj.container], 'e-customparent-class');
                expect(element.classList.contains('e-customparent-class')).toBe(false);
                expect(element.classList.contains('e-customparent-newclass')).toBe(false);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('setReadonly', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text'} });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
              });
                Input.setReadonly(true, element);
            });
            it('add readonly attribute in input element', () => {
                expect(element.hasAttribute('readonly')).toBe(true);
            });
            it('remove readonly attribute in input element', () => {
                Input.setReadonly(false, element);
                expect(element.hasAttribute('readonly')).toBe(false);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('setEnableRtl', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text'} });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
              });
                Input.setEnableRtl(true, [inputObj.container]);
            });
            it('add e-rtl class in container element', () => {
                expect(inputObj.container.classList.contains('e-rtl')).toBe(true);
            });
            it('remove e-rtl class in container element', () => {
                Input.setEnableRtl(false, [inputObj.container]);
                expect(inputObj.container.classList.contains('e-rtl')).toBe(false);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('setEnabled', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text'} });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
              });
                Input.setEnabled(false, element);
            });
            it('disabled and aria-disabled attribute in input element', () => {
                expect(element.hasAttribute('disabled') && element.hasAttribute('aria-disabled')).toBe(true);
            });
            it('add e-disabled class in element', () => {
                expect(element.classList.contains('e-disabled')).toBe(true);
            });
            it('remove the disabled and aria-disabled attribute in input element', () => {
                Input.setEnabled(true, element);
                expect(element.hasAttribute('disabled') && element.hasAttribute('aria-disabled')).toBe(false);
            });
            it('remove e-disabled class in element', () => {
                expect(element.classList.contains('e-disabled')).toBe(false);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('removeAttributes', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            let disabledAttrs: { [key: string]: string } = { 'disabled': 'disabled' };
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text'} });
            beforeAll(() => {
                document.body.appendChild(element);
                attributes(element, disabledAttrs);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
              });
            });
            it('remove the disabled attribute in input element', () => {
                Input.removeAttributes({ 'disabled': 'disabled', 'aria-disabled': 'true' }, element);
                expect(element.hasAttribute('disabled')).toBe(false);
                expect(element.classList.contains('e-disabled')).toBe(false);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('removeAttributes through property', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text'} });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  enabled: false
                }
              });
            });
            it('remove the disabled attribute in input element', () => {
                Input.removeAttributes({ 'disabled': 'disabled', 'aria-disabled': 'true' }, element);
                expect((element.hasAttribute('disabled') && element.hasAttribute('aria-disabled'))).toBe(false);
                expect(element.classList.contains('e-disabled')).toBe(false);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('removeAttributes - placeholder', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text'} });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Remove placeholder'
                }
              });
            });
            it('remove the placeholder/label', () => {
                Input.removeAttributes({ 'placeholder': 'Remove placeholder' }, element);
                expect(((<HTMLElement>inputObj.container.childNodes[2]).textContent === '')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('addAttributes - ID', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { attrs: {  value: 'Floating text'} });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Attribute id'
                }
              });
            });
            it('Add Placeholder', () => {
                Input.addAttributes({ 'id': 'inputpopup' }, element);
                expect((element.id === 'inputpopup')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
        describe('addAttributes - Placeholder', () => {
            let inputObj: InputObject;
            let element: HTMLInputElement;
            element = <HTMLInputElement>createElement('input', { id: 'inputpopup',  attrs: {  value: 'Floating text'} });
            beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto"
              });
            });
            it('Add Placeholder', () => {
                Input.addAttributes({ 'placeholder': 'Attribute Placeholder' }, element);
                expect(((<HTMLElement>inputObj.container.childNodes[2]).textContent === 'Attribute Placeholder')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
    });
});
describe('Input Groups - Enable/Disable', () => {
 describe('Disable', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
                properties: {
                 enabled: false,
               }
            });
            Input.appendSpan('e-input-group-icon', inputObj.container);
        });
        it('Check disabled classes and attributes in input element and container', () => {
            expect(element.hasAttribute('disabled') && element.classList.contains('e-disabled')).toBe(true);
            expect(inputObj.container.classList.contains('e-disabled')).toBe(true);
        });
        afterAll(() => {
            element.remove();
        });
    });
 describe('Enable', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
                properties: {
                 enabled: false,
               }
            });
            Input.appendSpan('e-input-group-icon', inputObj.container);
            Input.setEnabled(true, element);
        });
        it('Check disabled classes and attributes in input element and container', () => {
            expect(!element.hasAttribute('disabled') && !element.classList.contains('e-disabled')).toBe(true);
            expect(!inputObj.container.classList.contains('e-disabled')).toBe(true);
        });
        afterAll(() => {
            element.remove();
        });
    });
 describe('Disable through add attributes', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
            });
            Input.appendSpan('e-input-group-icon', inputObj.container);
            Input.addAttributes({ 'disabled': 'disabled' }, element);
        });
        it('Check disabled classes and attributes in input element and container', () => {
            expect(element.hasAttribute('disabled') && element.classList.contains('e-disabled')).toBe(true);
            expect(inputObj.container.classList.contains('e-disabled')).toBe(true);
        });
        afterAll(() => {
            element.remove();
        });
    });
 describe('Enable through add/remove attributes', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
            });
            Input.appendSpan('e-input-group-icon', inputObj.container);
            Input.addAttributes({ 'disabled': 'disabled' }, element);
            Input.removeAttributes({ 'disabled': 'disabled' }, element);
        });
        it('Check disabled classes and attributes in input element and container', () => {
            expect(!element.hasAttribute('disabled') && !element.classList.contains('e-disabled')).toBe(true);
            expect(!inputObj.container.classList.contains('e-disabled')).toBe(true);
        });
        afterAll(() => {
            element.remove();
        });
    });
 describe('Render Floating Input box with Custom tag', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        element = <HTMLInputElement>createElement('input', { id: 'inputpopup',  attrs: {  value: 'Floating text'} });
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 customTag: 'ej2-custom-floatinput',
                 properties: {
                  placeholder: 'Custom Tag Float'
                 }
              });
            });
        it('Check custom tag name', () => {
            expect((inputObj.container.tagName === 'EJ2-CUSTOM-FLOATINPUT')).toBe(true);
        });
        afterAll(() => {
            element.remove();
        });
    });
    
 describe('Floating Input - aria labelledby_1', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        element = <HTMLInputElement>createElement('input', { id: 'inputpopup',  attrs: {  value: 'Floating text'} });
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Custom Tag Float'
                 }
              });
            });
        it('Check aria labelledby', () => {
            expect(((<HTMLElement>inputObj.container).children[2].id === 'label_inputpopup') && ( element.getAttribute('aria-labelledby') === 'label_inputpopup')).toBe(true);
        });
        afterAll(() => {
            element.remove();
        });
    });

    describe('Render the empty textbox with clear icon support', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        element = <HTMLInputElement>createElement('input', { id: 'inputclear',  attrs: { value: ''} });
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 properties: {
                  placeholder: 'Clear button',
                  showClearButton: true
                 }
              });
            });
        it('Ensure whether clear icon element rendered', () => {
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
        });
        afterAll(() => {
            element.remove();
        });
    });

    describe('Render the textbox value as 12345 with clear icon support', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        element = <HTMLInputElement>createElement('input', { id: 'inputclear',  attrs: { value: '12345'} });
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 properties: {
                  placeholder: 'Clear button',
                  showClearButton: true
                 }
              });
            });
        it('Ensure whether clear icon element rendered and shown intial with value', () => {
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
        });
        it('Click on the clear icon', () => {
            let btn = document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon");
            clickEvent.initEvent ("click", true, true);
            btn.dispatchEvent (clickEvent);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
            expect((<HTMLInputElement>document.getElementById('inputclear')).value === '12345');
        });
        afterAll(() => {
            element.remove();
        });
    });

     describe('Trying to clear the disabled input value using clear icon ', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        element = <HTMLInputElement>createElement('input', { id: 'inputclear',  attrs: { value: '12345'} });
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 properties: {
                  placeholder: 'Clear button',
                  showClearButton: true,
                  enabled: false
                 }
              });
            });
        it('Ensure whether clear icon element rendered and shown intial with value', () => {
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
        });
        it('Click on the clear icon', () => {
            let btn = document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon");
            clickEvent.initEvent ("click", true, true);
            btn.dispatchEvent (clickEvent);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
            expect((<HTMLInputElement>document.getElementById('inputclear')).value === '12345');
        });
        afterAll(() => {
            element.remove();
        });
    });

    describe('Trying to clear the readonly input value using clear icon ', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        element = <HTMLInputElement>createElement('input', { id: 'inputclear',  attrs: { value: '12345'} });
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 properties: {
                  placeholder: 'Clear button',
                  showClearButton: true,
                  readonly: true
                 }
              });
            });
        it('Ensure whether clear icon element rendered and shown intial with value', () => {
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
        });
        it('Click on the clear icon', () => {
            let btn = document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon");
            clickEvent.initEvent ("click", true, true);
            btn.dispatchEvent (clickEvent);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
            expect((<HTMLInputElement>document.getElementById('inputclear')).value === '12345');
        });
        afterAll(() => {
            element.remove();
        });
    });

   describe('Render the textbox value as empty space with clear icon support', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        element = <HTMLInputElement>createElement('input', { id: 'inputclear',  attrs: { value: '   ' }});
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 properties: {
                  placeholder: 'Clear button',
                  showClearButton: true
                 }
              });
            });
        it('Ensure whether clear icon element rendered and shown intial with value', () => {
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
        });
        it('Click on the clear icon', () => {
            let btn = document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon");
            clickEvent.initEvent ("click", true, true);
            btn.dispatchEvent (clickEvent);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
            expect((<HTMLInputElement>document.getElementById('inputclear')).value === '');
        });
        afterAll(() => {
            element.remove();
        });
    });

    // Floating input 

    describe('Render the empty textbox with clear icon support', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        element = <HTMLInputElement>createElement('input', { id: 'inputclear',  attrs: { value: ''} });
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Clear button',
                  showClearButton: true
                 }
              });
            });
        it('Ensure whether clear icon element rendered', () => {
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
        });
        afterAll(() => {
            element.remove();
        });
    });

    describe('Remove the clear icon dynamically in Normal Input', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        element = <HTMLInputElement>createElement('input', { id: 'inputclear',  attrs: { value: '12345'} });
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 properties: {
                  placeholder: 'Clear button',
                  showClearButton: true
                 }
              });
            });
        it('Ensure whether clear icon element rendered and shown intial with value', () => {
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
        });
        it('Ensure the clear icon', () => {
           Input.setClearButton(false, element, inputObj);
           expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") === undefined);
        });
        afterAll(() => {
            element.remove();
        });
    });

    describe('Remove the clear icon dynamically in Floating Input', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        element = <HTMLInputElement>createElement('input', { id: 'inputclear',  attrs: { value: '12345'} });
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: 'Auto',
                 properties: {
                  placeholder: 'Clear button',
                  showClearButton: true
                 }
              });
            });
        it('Ensure whether clear icon element rendered and shown intial with value', () => {
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
        });
        it('Ensure the clear icon', () => {
           Input.setClearButton(false, element, inputObj);
           expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") === undefined);
        });
        afterAll(() => {
            element.remove();
        });
    });

    describe('Add the clear icon dynamically in Floating Input', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        element = <HTMLInputElement>createElement('input', { id: 'inputclear',  attrs: { value: '12345'} });
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: 'Auto',
                 properties: {
                  placeholder: 'Clear button',
                  showClearButton: false
                 }
              });
            });
        it('Ensure whether clear icon element rendered and shown intial with value', () => {
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") === undefined);
        });
        it('Ensure the clear icon', () => {
           Input.setClearButton(true , element, inputObj);
           expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
        });
        afterAll(() => {
            element.remove();
        });
    });

    describe('Render the textbox value as 12345 with clear icon support', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        element = <HTMLInputElement>createElement('input', { id: 'inputclear',  attrs: { value: '12345'} });
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Clear button',
                  showClearButton: true
                 }
              });
            });
        it('Ensure whether clear icon element rendered and shown intial with value', () => {
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
        });
        it('Click on the clear icon', () => {
            let btn = document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon");
            clickEvent.initEvent ("click", true, true);
            btn.dispatchEvent (clickEvent);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
            expect((<HTMLInputElement>document.getElementById('inputclear')).value === '');
        });
        afterAll(() => {
            element.remove();
        });
    });

     describe('Trying to clear the disabled input value using clear icon ', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        element = <HTMLInputElement>createElement('input', { id: 'inputclear',  attrs: { value: '12345'} });
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Clear button',
                  showClearButton: true,
                  enabled: false
                 }
              });
            });
        it('Ensure whether clear icon element rendered and shown intial with value', () => {
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
        });
        it('Click on the clear icon', () => {
            let btn = document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon");
            clickEvent.initEvent ("click", true, true);
            btn.dispatchEvent (clickEvent);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
            expect((<HTMLInputElement>document.getElementById('inputclear')).value === '12345');
        });
        afterAll(() => {
            element.remove();
        });
    });

    describe('Trying to clear the readonly input value using clear icon ', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        element = <HTMLInputElement>createElement('input', { id: 'inputclear',  attrs: { value: '12345'} });
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Clear button',
                  showClearButton: true,
                  readonly: true
                 }
              });
            });
        it('Ensure whether clear icon element rendered and shown intial with value', () => {
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
        });
        it('Click on the clear icon', () => {
            let btn = document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon");
            clickEvent.initEvent ("click", true, true);
            btn.dispatchEvent (clickEvent);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
            expect((<HTMLInputElement>document.getElementById('inputclear')).value === '12345');
        });
        afterAll(() => {
            element.remove();
        });
    });

   describe('Render the textbox value as empty space with clear icon support', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement;
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        let inputEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
        element = <HTMLInputElement>createElement('input', { id: 'inputclear',  attrs: { value: '   ' }});
        beforeAll(() => {
                document.body.appendChild(element);
                inputObj = Input.createInput({
                 element: element,
                 floatLabelType: "Auto",
                 properties: {
                  placeholder: 'Clear button',
                  showClearButton: true
                 }
              });
            });
        it('Ensure whether clear icon element rendered and shown intial with value', () => {
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
        });
        it('Click on the clear icon', () => {
            let btn = document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon");
            clickEvent.initEvent ("click", true, true);
            btn.dispatchEvent (clickEvent);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon") !== undefined);
            expect(document.getElementById('inputclear').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
            expect((<HTMLInputElement>document.getElementById('inputclear')).value === '');
        });

         it('Input event for code coverage', () => {
            let input = <HTMLInputElement> document.getElementById('inputclear');
            input.value = '22344';
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("input", false, true);
            document.getElementById('inputclear').dispatchEvent(evt);
            expect((<HTMLInputElement>document.getElementById('inputclear')).value === '22344');
        });

        afterAll(() => {
            element.remove();
        });
    });
    describe('Render Floating label input with Custom tag', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
                floatLabelType: "Always",
                customTag: 'ej2-custominput'
            });
        });
        it('Check custom tag name', () => {
            expect((inputObj.container.classList.contains('e-float-custom-tag'))).toBe(true);
        });
        afterAll(() => {
            element.remove();
        });
    });
    describe('Render Floating label type as always ', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputclear2', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
                floatLabelType: "Always"
            });
        });
        it('Ensure whether the float above of the input', () => {
          expect((inputObj.container.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top'))).toBe(true);
        });
        afterAll(() => {
            element.remove();
        });
    });
    describe('Show clear icon after updating the input value dynamically', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputclear1', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
                properties: {
                  showClearButton: true
                }
            });
        });
        it('Ensure whether enabeled the clear icon after updating the input value dynamically', () => {
            element.focus();
            expect((inputObj.container.classList.contains('e-input-focus'))).toBe(true);
            element.value = "Content";
            expect(document.getElementById('inputclear1').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
        });
        afterAll(() => {
            element.remove();
        });
    });
    describe('Show clear icon after updating the float input value dynamically', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputclear2', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
                floatLabelType: "Auto",
                properties: {
                  showClearButton: true
                }
            });
        });
        it('Ensure whether enabeled the clear icon after updating the float input value dynamically', () => {
            element.focus();
            expect((inputObj.container.classList.contains('e-input-focus'))).toBe(true);
            element.value = "Content";
            expect(document.getElementById('inputclear2').parentElement.querySelector(".e-clear-icon").classList.contains('e-clear-icon-hide')).toEqual(true);
        });
        afterAll(() => {
            element.remove();
        });
    });

    describe('Check whether ripple effect enabled / disaabled through public method', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
                buttons: ['e-input-group-icon']
            });
        });
        
        it('Check mouse down event', () => {
            Input.appendSpan('e-input-group-icon e-input-down', inputObj.container);
            Input.appendSpan('e-input-group-icon e-input-down', inputObj.container);
            Input.setRipple(false, [inputObj]);
            let spanEle: HTMLElement = inputObj.buttons[0];
            let mouseEvents: Event = document.createEvent('MouseEvents');
            mouseEvents.initEvent('mousedown', true, true);
            spanEle.dispatchEvent(mouseEvents);
            spanEle.addEventListener('mousedown', function (): void {
                expect((this.classList.contains('e-input-btn-ripple'))).toBe(false);
            });
        });

        it('Check mouse down event', () => {
            Input.appendSpan('e-input-group-icon e-input-down', inputObj.container);
            Input.appendSpan('e-input-group-icon e-input-down', inputObj.container);
            Input.setRipple(true, [inputObj]);
            let spanEle: HTMLElement = inputObj.buttons[0];
            let mouseEvents: Event = document.createEvent('MouseEvents');
            mouseEvents.initEvent('mousedown', true, true);
            spanEle.dispatchEvent(mouseEvents);
            spanEle.addEventListener('mousedown', function (): void {
                expect((this.classList.contains('e-input-btn-ripple'))).toBe(true);
            });
        });
        it('Check mouse up event', (done: Function) => {
            let spanEle: HTMLElement = inputObj.buttons[0];
            let mouseEvents: Event = document.createEvent('MouseEvents');
            mouseEvents.initEvent('mouseup', true, true);
            spanEle.dispatchEvent(mouseEvents);
            setTimeout(
                () => {
                    spanEle.addEventListener('mouseup', function (): void {
                        expect((this.classList.contains('e-input-btn-ripple'))).toBe(false);
                    });
                    done();
                },
                1500);
        });
        afterAll(() => {
            element.remove();
        });
    });

     describe('Readonly state with floating input', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputclear2', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
                floatLabelType: "Auto",
                properties: {
                  showClearButton: true
                }
            });
        });
        it('Float the label above of the input when value is present inside the textbox', () => {
            element.value = "Content";
            Input.setReadonly(true, element, "Auto");
            expect((inputObj.container.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top'))).toBe(true);
        });
        it('Should not float the label above of the input when textbox has no value', () => {
            element.value = "";
            Input.setReadonly(false, element, "Auto");
            expect((inputObj.container.getElementsByClassName('e-float-text')[0].classList.contains('e-label-bottom'))).toBe(true);
        });
        afterAll(() => {
            element.remove();
        });
    });

    describe('Disabled state with floating input', () => {
        let inputObj: InputObject;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'inputclear2', attrs: { type: 'text' } });
        beforeAll(() => {
            document.body.appendChild(element);
            inputObj = Input.createInput({
                element: element,
                floatLabelType: "Auto",
                properties: {
                  showClearButton: true
                }
            });
        });
        it('Enable the input when value is present inside the textbox', () => {
            element.value = "Content";
            Input.setEnabled(true, element, "Auto");
            expect((inputObj.container.classList.contains('e-disabled'))).toBe(false);
        });
        it('Disable input when textbox has no value', () => {
            element.value = "";
            Input.setEnabled(false, element, "Auto");
            expect((inputObj.container.classList.contains('e-disabled'))).toBe(true);
        });
        afterAll(() => {
            element.remove();
        });
    });
});