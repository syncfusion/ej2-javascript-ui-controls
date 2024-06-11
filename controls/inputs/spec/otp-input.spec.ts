import { Browser, createElement, EventHandler, isNullOrUndefined, remove } from "@syncfusion/ej2-base";
import { OtpInput } from "../src/otp-input/index";
import { getMemoryProfile, inMB, profile } from "./common.spec";

describe('OtpInput', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });

    describe('DOM', () => {
        let otpInput: OtpInput;
        let otpInputElement: HTMLElement;

        beforeEach(() => {
            otpInputElement = createElement('div', { id: 'otp-input' });
            document.body.appendChild(otpInputElement);
        });

        afterEach(() => {
            if (otpInput) {
                otpInput.destroy();
                otpInput = undefined;
            }
            remove(otpInputElement);
        });

        it('Default otpInput testing', () => {
            otpInput = new OtpInput();
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-otpinput') != null).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe('');
            }
        });

        it('Get component name testing', () => {
            otpInput = new OtpInput();
            otpInput.appendTo('#otp-input');
            expect(otpInput.getModuleName()).toEqual('otpinput');
        });

        it('otpInput testing with Persistence', () => {
            otpInput = new OtpInput({
                enablePersistence: true
            });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('.e-otpinput') != null).toEqual(true);
        });

        it('Generic div Element ID generation', () => {
            otpInput = new OtpInput();
            let otpInputElement1 = createElement('div', {});
            document.body.appendChild(otpInputElement1);
            otpInput.appendTo(otpInputElement1);
            expect(otpInputElement1.getAttribute('id') != otpInputElement.getAttribute('id')).toEqual(true);
            expect(isNullOrUndefined(otpInputElement1.id)).toBe(false);
            otpInput.destroy();
            otpInput = undefined;
            remove(otpInputElement1);
        });

    });

    describe('DOM Properties', () => {
        let otpInput: OtpInput;
        let otpInputElement: HTMLElement;

        beforeEach(() => {
            otpInputElement = createElement('div', { id: 'otp-input' });
            document.body.appendChild(otpInputElement);
        });

        afterEach(() => {
            if (otpInput) {
                otpInput.destroy();
                otpInput = undefined;
            }
            remove(otpInputElement);
        });

        it('Length', () => {
            otpInput = new OtpInput({ length: 5 });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(5);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe('');
            }
        });

        it('RTL', () => {
            otpInput = new OtpInput({ enableRtl: true });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-rtl')).toEqual(true);
            otpInput.enableRtl = false;
            otpInput.dataBind();
            expect(otpInputElement.classList.contains('e-rtl')).toEqual(false);
            otpInput.enableRtl = true;
            otpInput.dataBind();
            expect(otpInputElement.classList.contains('e-rtl')).toEqual(true);
        });
        
        it('Value characters equal to length', () => {
            const otpValue = "1234";
            otpInput = new OtpInput({ value: otpValue });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe(otpValue.charAt(i));
            }
        });

        it('Value with fewer characters than length', () => {
            const otpValue = "123";
            otpInput = new OtpInput({ value: otpValue });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe(otpValue.charAt(i) ? otpValue.charAt(i) : '');
            }
        });

        it('Type property default', () => {
            otpInput = new OtpInput();
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const hiddenInputEle: HTMLInputElement = otpInputElement.querySelector('#otpInput_hidden');
            expect(hiddenInputEle.value).toBe('');
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.type).toBe('number');
            }
        });

        it('Type as Number and Value as Text', () => {
            const otpValue = "1234";
            otpInput = new OtpInput({ value: otpValue, type: 'number' });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const hiddenInputEle: HTMLInputElement = otpInputElement.querySelector('#otpInput_hidden');
            expect(hiddenInputEle.value).toBe('1234');
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe(otpValue.charAt(i));
                expect(inputElement.type).toBe('number');
            }
        });

        it('Type as Number and Value as Number', () => {
            const otpValue = 1234;
            otpInput = new OtpInput({ value: otpValue, type: 'number' });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const hiddenInputEle: HTMLInputElement = otpInputElement.querySelector('#otpInput_hidden');
            expect(hiddenInputEle.value).toBe('1234');
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe(otpValue.toString().charAt(i));
                expect(inputElement.type).toBe('number');
            }
        });

        it('Type as Number and Value as Non-Number and Number', () => {
            const otpValue = 'abc4';
            otpInput = new OtpInput({ value: otpValue, type: 'number' });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const hiddenInputEle: HTMLInputElement = otpInputElement.querySelector('#otpInput_hidden');
            expect(hiddenInputEle.value).toBe('4');
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            expect((inputElementArray[0] as HTMLInputElement).value).toBe('');
            expect((inputElementArray[1] as HTMLInputElement).value).toBe('');
            expect((inputElementArray[2] as HTMLInputElement).value).toBe('');
            expect((inputElementArray[3] as HTMLInputElement).value).toBe('4');
        });

        it('Type as Text', () => {
            const otpValue = "abcd";
            otpInput = new OtpInput({ value: otpValue, type: 'text' });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const hiddenInputEle: HTMLInputElement = otpInputElement.querySelector('#otpInput_hidden');
            expect(hiddenInputEle.value).toBe('abcd');
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe(otpValue.charAt(i));
                expect(inputElement.type).toBe('text');
            }
        });

        it('Type as Text as Text and Numbers', () => {
            const otpValue = "ab12";
            otpInput = new OtpInput({ value: otpValue, type: 'text' });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const hiddenInputEle: HTMLInputElement = otpInputElement.querySelector('#otpInput_hidden');
            expect(hiddenInputEle.value).toBe('ab12');
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe(otpValue.charAt(i));
                expect(inputElement.type).toBe('text');
            }
        });

        it('Type as Password', () => {
            const otpValue = "abcd";
            otpInput = new OtpInput({ value: otpValue, type: 'password' });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const hiddenInputEle: HTMLInputElement = otpInputElement.querySelector('#otpInput_hidden');
            expect(hiddenInputEle.value).toBe('abcd');
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe(otpValue.charAt(i));
                expect(inputElement.type).toBe('password');
            }
        });

        it('Without Separator', () => {
            otpInput = new OtpInput();
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            expect(otpInputElement.querySelector('.e-otp-separator')).toBeNull();
        });

        it('Separator with default length property', () => {
            const separatortext = '/';
            otpInput = new OtpInput({ separator: separatortext });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            expect(otpInputElement.querySelectorAll('.e-otp-separator').length).toBe(3);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            const separatorElementArray: any = otpInputElement.querySelectorAll('.e-otp-separator');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe('');
            }
            for (let i = 0; i < inputElementArray.length - 1; i++) {
                const separatorElement: HTMLSpanElement = separatorElementArray[i] as HTMLSpanElement;
                expect(separatorElement.textContent).toBe(separatortext);
            }
        });

        it('Separator with length property', () => {
            const separatortext = '/';
            otpInput = new OtpInput({ length: 5 , separator: separatortext });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(5);
            expect(otpInputElement.querySelectorAll('.e-otp-separator').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            const separatorElementArray: any = otpInputElement.querySelectorAll('.e-otp-separator');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe('');
            }
            for (let i = 0; i < inputElementArray.length - 1; i++) {
                const separatorElement: HTMLSpanElement = separatorElementArray[i] as HTMLSpanElement;
                expect(separatorElement.textContent).toBe(separatortext);
            }
        });

        it('Placeholder with single text', () => {
            const placeHolder = "*";
            otpInput = new OtpInput({ placeholder: placeHolder });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.placeholder).toBe(placeHolder);
            }
        });

        it('Placeholder with multiple text', () => {
            const placeHolder = "abcd";
            otpInput = new OtpInput({ placeholder: placeHolder });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.placeholder).toBe(placeHolder.charAt(i) ? placeHolder.charAt(i) : '');
            }
        });

        it('Disabled otpInput', () => {
            otpInput = new OtpInput({ disabled: true });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.disabled).toBe(true);
            }
        });

        it('Dynamically updating separator in otpInput testing', () => {
            let separatortext = '/';
            otpInput = new OtpInput({ separator: separatortext });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            expect(otpInputElement.querySelectorAll('.e-otp-separator').length).toBe(3);
            let separatorElementArray: any = otpInputElement.querySelectorAll('.e-otp-separator');
            for (let i = 0; i < separatorElementArray.length; i++) {
                const separatorElement: HTMLSpanElement = separatorElementArray[i] as HTMLSpanElement;
                expect(separatorElement.textContent).toBe(separatortext);
            }
            separatortext = '*';
            otpInput.separator = separatortext;
            otpInput.dataBind();
            expect(otpInputElement.querySelectorAll('.e-otp-separator').length).toBe(3);
            for (let i = 0; i < separatorElementArray.length; i++) {
                const separatorElement: HTMLSpanElement = separatorElementArray[i] as HTMLSpanElement;
                expect(separatorElement.textContent).toBe(separatortext);
            }
            separatortext = '';
            otpInput.separator = separatortext;
            otpInput.dataBind();
            expect(otpInputElement.querySelector('.e-otp-separator')).toBeNull();
            separatortext = '/';
            otpInput.separator = separatortext;
            otpInput.dataBind();
            expect(otpInputElement.querySelectorAll('.e-otp-separator').length).toBe(3);
            let newSeparatorElementArray: any = otpInputElement.querySelectorAll('.e-otp-separator');
            for (let i = 0; i < newSeparatorElementArray.length; i++) {
                const separatorElement: HTMLSpanElement = newSeparatorElementArray[i] as HTMLSpanElement;
                expect(separatorElement.textContent).toBe(separatortext);
            }
        });

        it('Dynamically updating Type property', () => {
            otpInput = new OtpInput();
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.type).toBe('number');
            }
            otpInput.type = 'text';
            otpInput.dataBind();
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.type).toBe('text');
            }
            otpInput.type = 'password';
            otpInput.dataBind();
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.type).toBe('password');
            }
        });

        it('Dynamically updating Value', () => {
            let otpValue = "1234";
            otpInput = new OtpInput({ value: otpValue });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe(otpValue.charAt(i));
            }
            otpValue = '1345';
            otpInput.value = otpValue;
            otpInput.dataBind();
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe(otpValue.charAt(i));
            }
        });

        it('Dynamically updating Placeholder', () => {
            let placeholderValue = "*";
            otpInput = new OtpInput({ placeholder: placeholderValue });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.placeholder).toBe(placeholderValue);
            }
            placeholderValue = '0';
            otpInput.placeholder = placeholderValue;
            otpInput.dataBind();
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.placeholder).toBe(placeholderValue);
            }
        });

        it('Dynamically updating disabled state', () => {
            otpInput = new OtpInput({ disabled: true });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.disabled).toBe(true);
            }
            otpInput.disabled = false;
            otpInput.dataBind();
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.disabled).toBe(false);
            }
            otpInput.disabled = true;
            otpInput.dataBind();
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.disabled).toBe(true);
            }
        });

        it('Dynamically updating cssClass', () => {
            let customClass = 'e-error';
            otpInput = new OtpInput({ cssClass: customClass });
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-error')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            customClass = 'e-warning';
            otpInput.cssClass = customClass;
            otpInput.dataBind();
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-error')).toEqual(false);
            expect(otpInputElement.classList.contains('e-warning')).toEqual(true);
        });

        it('Dynamically adding arialabel', () => {
            otpInput = new OtpInput();
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.getAttribute('aria-label')).toBe(`Enter Otp Character ${i+1}`);
            }
            let customAriaLabel = ['otp-input 1', 'otp-input 2', 'otp-input 3'];
            otpInput.ariaLabels = customAriaLabel;
            otpInput.dataBind();
            for (let i = 0; i < inputElementArray.length - 1; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.getAttribute('aria-label')).toBe(customAriaLabel[i]);
            }
            expect(inputElementArray[3].getAttribute('aria-label')).toBe('Enter Otp Character 4');
        });

        it('Dynamically updating stylingMode', () => {
            otpInput = new OtpInput();
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline')).toEqual(true);
            expect(otpInputElement.classList.contains('e-underlined')).toEqual(false);
            expect(otpInputElement.classList.contains('e-filled')).toEqual(false);
            let stylingMode = 'underlined';
            otpInput.stylingMode = stylingMode;
            otpInput.dataBind();
            expect(otpInputElement.classList.contains('e-outline')).toEqual(false);
            expect(otpInputElement.classList.contains('e-underlined')).toEqual(true);
            expect(otpInputElement.classList.contains('e-filled')).toEqual(false);
            stylingMode = 'filled';
            otpInput.stylingMode = stylingMode;
            otpInput.dataBind();
            expect(otpInputElement.classList.contains('e-outline')).toEqual(false);
            expect(otpInputElement.classList.contains('e-underlined')).toEqual(false);
            expect(otpInputElement.classList.contains('e-filled')).toEqual(true);
        });

        it('Dynamically updating length', () => {
            otpInput = new OtpInput();
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            otpInput.length = 5;
            otpInput.dataBind();
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(5);
            otpInput.length = 1;
            otpInput.dataBind();
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(1);
        });

        it('HTMLAttributess', () => {
            otpInput = new OtpInput({htmlAttributes: {'class': 'customClass', 'name': 'otp-input'}});
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.classList.contains('customClass')).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            const hiddenInputEle: HTMLInputElement = otpInputElement.querySelector('#otpInput_hidden');
            expect(hiddenInputEle.getAttribute('name')).toBe('otp-input');
        });

        it('FocusIn and FocusOut method', () => {
            otpInput = new OtpInput({value: '1234'});
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            expect(otpInputElement.querySelectorAll('.e-otp-input-focus').length).toBe(0);
            otpInput.focusIn();
            expect(otpInputElement.querySelectorAll('.e-otp-input-focus').length).toBe(1);
            expect(inputElementArray[3].classList.contains('e-otp-input-focus')).toEqual(true);
            otpInput.focusOut();
            expect(otpInputElement.querySelectorAll('.e-otp-input-focus').length).toBe(0);
        });

        it('select value', () => {
            otpInput = new OtpInput({value: '1234'});
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            inputElementArray[0].dispatchEvent((new MouseEvent('focus')));
            inputElementArray[0].dispatchEvent((new MouseEvent('click')));
            expect(otpInputElement.querySelectorAll('.e-otp-input-focus').length).toBe(1);
            expect(inputElementArray[0].classList.contains('e-otp-input-focus')).toEqual(true);
        });

        it('paste values', () => {
            otpInput = new OtpInput({value: '1234'});
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            let clipboardValues = '2345';
            let clipboardData = new DataTransfer();
            clipboardData.setData('text', '2345');
            inputElementArray[0].dispatchEvent((new ClipboardEvent('paste', { clipboardData } as any)));
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe(clipboardValues.charAt(i));
            }
        });

    });

    describe('Keyboard Events', () => {
        let otpInput: OtpInput;
        let otpInputElement: HTMLElement;
        let keyboardEventArgs: any;

        beforeEach(() => {
            otpInputElement = createElement('div', { id: 'otp-input' });
            document.body.appendChild(otpInputElement);
            keyboardEventArgs = {
                preventDefault: (): void => { },
                key: null,
                target: null,
                stopImmediatePropagation: (): void => { }
            };
        });

        afterEach(() => {
            if (otpInput) {
                otpInput.destroy();
                otpInput = undefined;
            }
            remove(otpInputElement);
        });

        it('Arrow Key comibinations otpInput', () => {
            let otpValue = '1234';
            otpInput = new OtpInput({value: otpValue});
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            expect(otpInputElement.querySelectorAll('.e-otp-input-focus').length).toBe(0);
            keyboardEventArgs.target = otpInputElement;
            keyboardEventArgs.key = 'ArrowRight';
            (otpInput as any).handleKeyAction(0 ,keyboardEventArgs);
            expect(otpInputElement.querySelectorAll('.e-otp-input-focus').length).toBe(1);
            expect(inputElementArray[1].classList.contains('e-otp-input-focus')).toEqual(true);
            keyboardEventArgs.key = 'ArrowLeft';
            (otpInput as any).handleKeyAction(1 ,keyboardEventArgs);
            expect(otpInputElement.querySelectorAll('.e-otp-input-focus').length).toBe(1);
            expect(inputElementArray[0].classList.contains('e-otp-input-focus')).toEqual(true);
            keyboardEventArgs.key = 'ArrowUp';
            (otpInput as any).handleKeyAction(0 ,keyboardEventArgs);
            expect(inputElementArray[0].value).toBe(otpValue.charAt(0));
            keyboardEventArgs.key = 'ArrowDown';
            (otpInput as any).handleKeyAction(0 ,keyboardEventArgs);
            expect(inputElementArray[0].value).toBe(otpValue.charAt(0));
        });

        it('Backspace action', () => {
            let otpValue = '123';
            otpInput = new OtpInput({value: otpValue});
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            keyboardEventArgs.target = otpInputElement;
            keyboardEventArgs.key = 'Backspace';
            (otpInput as any).handleKeyAction(3 ,keyboardEventArgs);
            expect(inputElementArray[3].value).toBe('');
        });
        it('Delete action', () => {
            let otpValue = '1234';
            otpInput = new OtpInput({value: otpValue});
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            keyboardEventArgs.target = otpInputElement;
            keyboardEventArgs.key = 'Delete';
            (otpInput as any).handleKeyAction(0 ,keyboardEventArgs);
            expect(inputElementArray[0].value).toBe('');
            expect(inputElementArray[1].value).toBe('2');
            keyboardEventArgs.key = 'Delete';
            (otpInput as any).handleKeyAction(0 ,keyboardEventArgs);
            expect(inputElementArray[0].value).toBe('');
            expect(inputElementArray[1].value).toBe('');
        });
        it('Restrict non-numeric character in number type', () => {
            let otpValue = '1234';
            otpInput = new OtpInput({value: otpValue});
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            keyboardEventArgs.target = otpInputElement;
            keyboardEventArgs.key = 'e';
            (otpInput as any).handleKeyAction(0 ,keyboardEventArgs);
            expect(inputElementArray[0].value).toBe('1');
        });
        it('Change value', () => {
            let otpValue = '1234';
            otpInput = new OtpInput({value: otpValue});
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            keyboardEventArgs.target = inputElementArray[0];
            inputElementArray[0].value = '5';
            (otpInput as any).handleInputChange(0 ,keyboardEventArgs);
            expect(inputElementArray[0].value).toBe('5');
        });

        it('Pressing tab key in last OtpInput with changed value', () => {
            let otpValue = '1234';
            otpInput = new OtpInput({value: otpValue});
            otpInput.appendTo('#otp-input');
            expect(otpInputElement.classList.contains('e-otpinput')).toEqual(true);
            expect(otpInputElement.classList.contains('e-outline') != null).toEqual(true);
            expect(otpInputElement.querySelector('#otpInput_hidden') != null).toEqual(true);
            expect(otpInputElement.querySelectorAll('.e-otp-input-field').length).toBe(4);
            const inputElementArray: any = otpInputElement.querySelectorAll('.e-otp-input-field');
            keyboardEventArgs.target = inputElementArray[0];
            inputElementArray[0].value = '5';
            (otpInput as any).handleInputChange(0 ,keyboardEventArgs);
            expect(inputElementArray[0].value).toBe('5');
            keyboardEventArgs.key = 'Tab';
            let newValue = '5234';
            (otpInput as any).handleKeyAction(3 ,keyboardEventArgs);
            for (let i = 0; i < inputElementArray.length; i++) {
                const inputElement: HTMLInputElement = inputElementArray[i] as HTMLInputElement;
                expect(inputElement.value).toBe(newValue.charAt(i));
            }
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
});