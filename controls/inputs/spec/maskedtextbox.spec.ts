/**
 * MaskedTextBox spec document
 */

import { createElement, KeyboardEvents, EventHandler, extend  } from '@syncfusion/ej2-base';
import { MaskedTextBox, MaskChangeEventArgs, MaskFocusEventArgs} from '../src/maskedtextbox/maskedtextbox/maskedtextbox';
import { maskInput, setMaskValue, getVal, getMaskedVal, mobileRemoveFunction, maskInputDropHandler, maskInputBlurHandler } from '../src/maskedtextbox/base/mask-base';

function eventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = extend({}, tempEvent);
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

describe('MaskedTextBox Component', () => {
    describe('MaskedTextBox creation', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let eleParent: HTMLElement = createElement('div', { id: 'maskParent' });
            document.body.appendChild(eleParent);
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            eleParent.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox && maskBox.element.id !== 'maskDiv') {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Render and check MaskedTextBox without mask', () => {
            maskBox = new MaskedTextBox();
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.classList.contains('e-maskedtextbox') && input.classList.contains('e-control')).toEqual(true);
            let inputParent: HTMLElement = <HTMLElement>input.parentNode;
            expect(inputParent.classList.contains('e-input-group') || inputParent.classList.contains('e-float-input')).toEqual(true);
            expect(inputParent.classList.contains('e-widget') && inputParent.classList.contains('e-mask')).toEqual(true);
        });
        it('Check MaskedTextBox with other elements', () => {
            let divEle: HTMLElement = createElement('div', { id: 'maskDiv' });
            let eleParent: HTMLElement = <HTMLElement>document.getElementById('maskParent');
            eleParent.appendChild(divEle);
            maskBox = new MaskedTextBox();
            maskBox.appendTo('#maskDiv');
            expect(!divEle.parentElement.classList.contains('e-input-group')).toEqual(true);
        });
        it('Render and check MaskedTextBox with "EJS-MASKEDTEXTBOX" tag', () => {
            let customElement: HTMLElement = createElement('EJS-MASKEDTEXTBOX', { id: 'customTag' });
            document.body.appendChild(customElement);
            maskBox = new MaskedTextBox();
            maskBox.appendTo('#customTag');
            let customParent: HTMLElement = <HTMLElement>document.getElementById('customTag').parentNode;
            expect(customElement.classList.contains('e-control') && customElement.classList.contains('e-maskedtextbox')).toEqual(false);
            expect(customElement.classList.contains('e-mask-container')).toEqual(true);
            expect(customParent.classList.contains('e-widget') && customParent.classList.contains('e-mask')).toEqual(true);
        });
         it('Apply CssClass, rtl property during initialization', () => {
            maskBox = new MaskedTextBox({
                mask: "(999) 99-999",
                cssClass: "e-custom-css",
                enableRtl: true,
                enabled: true,
                locale: "en-US"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.parentElement.classList.contains('e-custom-css')).toEqual(true);
            expect(input.parentElement.classList.contains('e-rtl')).toEqual(true);
            expect(input.classList.contains('e-disabled')).toEqual(false);
            expect(input.hasAttribute('disabled') && input.hasAttribute('aria-disabled')).toEqual(false);
        });
        it('Apply enabled false during initialization', () => {
            maskBox = new MaskedTextBox({
                mask: "(999) 99-999",
                enabled: false,
                locale: "en-US"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.parentElement.classList.contains('e-disabled')).toEqual(true);
            expect(input.hasAttribute('disabled') && input.hasAttribute('aria-disabled')).toEqual(true);
        });
        afterAll(() => {
            maskBox.getPersistData();
        });
    });

     describe('Ensure element structure', () => {
        let maskBox: any;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('inner Element', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999"
            });
            maskBox.appendTo('#mask1');
            expect(maskBox.inputObj.container.classList.contains('e-input-group')).toEqual(true);
            expect(maskBox.inputObj.container.classList.contains('e-widget')).toEqual(true);
            expect(maskBox.inputObj.container.nodeName).toBe("SPAN");
            expect(maskBox.inputObj.container.children[0].nodeName).toBe("INPUT");
            expect(maskBox.inputObj.container.children[0].classList.contains('e-maskedtextbox')).toBe(true);
            expect(maskBox.element.getAttribute("name")).not.toBeNull();
        });
          });
    describe('Add mask in MaskedTextBox', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Add mask in MaskedTextBox', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.value.length === 11 && input.value[2].trim() === '' && input.value[6].trim() === '').toEqual(true);
            expect(input.value[0] === '_').toEqual(true);
        });
        it('MaskedTextBox - Mask and Value as null', () => {
            maskBox = new MaskedTextBox({
                mask: null,
                value: null
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.value === "").toEqual(true);
            expect(input.classList.contains('e-maskedtextbox') && input.classList.contains('e-control')).toEqual(true);
            let inputParent: HTMLElement = <HTMLElement>input.parentNode;
            expect(inputParent.classList.contains('e-widget') && inputParent.classList.contains('e-mask')).toEqual(true);
        });
        it('MaskedTextBox - Mask and Value as empty', () => {
            maskBox = new MaskedTextBox({
                mask: "",
                value: ""
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.value === "").toEqual(true);
            expect(input.classList.contains('e-maskedtextbox') && input.classList.contains('e-control')).toEqual(true);
            let inputParent: HTMLElement = <HTMLElement>input.parentNode;
            expect(inputParent.classList.contains('e-widget') && inputParent.classList.contains('e-mask')).toEqual(true);
        });
        it('MaskedTextBox with built-in masking elemets and empty value', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: ""
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.value === "__ ___ ____").toEqual(true);
            expect(input.classList.contains('e-maskedtextbox') && input.classList.contains('e-control')).toEqual(true);
            let inputParent: HTMLElement = <HTMLElement>input.parentNode;
            expect(inputParent.classList.contains('e-widget') && inputParent.classList.contains('e-mask')).toEqual(true);
        });
        it('MaskedTextBox with empty mask and value', () => {
            maskBox = new MaskedTextBox({
                mask: "",
                value: "994555664"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.value === "994555664").toEqual(true);
            expect(input.classList.contains('e-maskedtextbox') && input.classList.contains('e-control')).toEqual(true);
            let inputParent: HTMLElement = <HTMLElement>input.parentNode;
            expect(inputParent.classList.contains('e-widget') && inputParent.classList.contains('e-mask')).toEqual(true);
        });
        it('MaskedTextBox with mask as null and value', () => {
            maskBox = new MaskedTextBox({
                mask: null,
                value: "994555664"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.value === "994555664").toEqual(true);
            expect(input.classList.contains('e-maskedtextbox') && input.classList.contains('e-control')).toEqual(true);
            let inputParent: HTMLElement = <HTMLElement>input.parentNode;
            expect(inputParent.classList.contains('e-widget') && inputParent.classList.contains('e-mask')).toEqual(true);
        });
    });
    describe('Edit values in MaskedTextBox through property', () => {
        let maskBox: any;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Edit values in MaskedTextBox through property', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.value === '98 032 5679').toEqual(true);
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.keyCode = 50;
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value === '98 032 5679').toEqual(true);
        });
         it('Edit mask in MaskedTextBox through property', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.value === '98 032 5679').toEqual(true);
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.keyCode = 50;
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value === '98 032 5679').toEqual(true);
            maskBox.setProperties({ mask: "(999) 99 999" });
            expect(input.value === '(980) 32 567').toEqual(true);
        });
         it('Enable ShowClearButton through property', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.value === '98 032 5679').toEqual(true);
            expect(maskBox.inputObj.clearButton).toBeNull();
            document.getElementById('mask1').focus();
            expect(maskBox.inputObj.clearButton).toBeNull();
            maskBox.setProperties({ showClearButton: true });
            maskBox.dataBind();
            expect(maskBox.inputObj.clearButton.classList.contains('e-clear-icon-hide')).toBe(true);
            document.getElementById('mask1').focus();
            expect(maskBox.inputObj.clearButton.classList.contains('e-clear-icon')).toBe(true);
            maskBox.enabled = false;
            maskBox.dataBind();
            expect(input.hasAttribute('disabled') && input.hasAttribute('aria-disabled')).toEqual(true);
        });
        it('Edit values in MaskedTextBox through property(dynamic)', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999"
            });
            maskBox.appendTo('#mask1');
            maskBox.setProperties({ value: "980325679" })
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.value === '98 032 5679').toEqual(true);
        });
        it('Edit supported and unsupported values in MaskedTextBox through property(dynamic)', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999"
            });
            maskBox.appendTo('#mask1');
            maskBox.setProperties({ value: "98032567P" })
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.value === '98 032 567_').toEqual(true);
        });
    });
    describe('Edit values in MaskedTextBox through keyboard keys', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Edit values in the MaskedTextBox with masking element "9"', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 99999"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            for (let i: number = 0; i < 9; i++) {
                let event: any = eventObject('KeyboardEvent', 'keypress');
                event.key = (9 - i).toString();
                EventHandler.trigger(input, 'keypress', event);
            }
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "A";
            EventHandler.trigger(input, 'keypress', event);
            event.key = " ";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value === '98 765 4321 ').toEqual(true);
            expect(maskBox.getMaskedValue() === '98 765 4321 ').toEqual(true);
        });

        it('Edit values in MaskedTextBox with masking element "0"', () => {
            maskBox = new MaskedTextBox({
                mask: "00 000 0000"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = " ";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "a";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "@";
            EventHandler.trigger(input, 'keypress', event);
            for (let i: number = 0; i < 9; i++) {
                let event: any = eventObject('KeyboardEvent', 'keypress');
                event.key = (9 - i).toString();
                EventHandler.trigger(input, 'keypress', event);
            }
            expect(input.value === '98 765 4321').toEqual(true);
        });

        it('Edit values in MaskedTextBox with masking element "#" ', () => {
            maskBox = new MaskedTextBox({
                mask: "#####"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "S";
            EventHandler.trigger(input, 'keypress', event);
            for (let i: number = 0; i < 5; i++) {
                let event: any = eventObject('KeyboardEvent', 'keypress');
                if (i == 0) {
                    event.key = "+";
                } else if (i == 1) {
                    event.key = "-";
                } else if (i == 2) {
                    event.key = " ";
                } else {
                    event.key = (5 - i).toString();
                }
                EventHandler.trigger(input, 'keypress', event);
            }
            expect(input.value === '+- 21').toEqual(true);
        });

        it('Edit values in MaskedTextBox with masking element "L" ', () => {
            maskBox = new MaskedTextBox({
                mask: "LLLLLL"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = " ";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "1";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "M";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "a";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "S";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "k";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "e";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "D";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value === 'MaSkeD').toEqual(true);
        });

        it('Edit values in MaskedTextBox with masking element "?" ', () => {
            maskBox = new MaskedTextBox({
                mask: "???????"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "2";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "M";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "a";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "S";
            EventHandler.trigger(input, 'keypress', event);
            event.key = " ";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "k";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "e";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "D";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value === 'MaS keD').toEqual(true);
        });

        it('Edit values in MaskedTextBox with masking element "C" ', () => {
            maskBox = new MaskedTextBox({
                mask: "CCCCCC"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "@";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "#";
            EventHandler.trigger(input, 'keypress', event);
            event.key = " ";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "A";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "1";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "a";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value === '@# A1a').toEqual(true);
        });

        it('Edit values in MaskedTextBox with masking element "&" ', () => {
            maskBox = new MaskedTextBox({
                mask: "&&&&&&"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "@";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "#";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "$";
            EventHandler.trigger(input, 'keypress', event);
            event.key = " ";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "A";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "1";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "a";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value === '@#$A1a').toEqual(true);
        });

        it('Edit values in MaskedTextBox with masking element "A" ', () => {
            maskBox = new MaskedTextBox({
                mask: "AAAA"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "@";
            EventHandler.trigger(input, 'keypress', event);
            event.key = " ";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "A";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "1";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "a";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "S";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value === 'A1aS').toEqual(true);
        });

        it('Edit values in MaskedTextBox with masking element "a" ', () => {
            maskBox = new MaskedTextBox({
                mask: "aaaaa"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "@";
            EventHandler.trigger(input, 'keypress', event);
            event.key = " ";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "A";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "1";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "a";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "S";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value === ' A1aS').toEqual(true);
        });

        it('Edit values in MaskedTextBox', () => {
            maskBox = new MaskedTextBox({
                mask: "## #99 9999"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            for (let i: number = 0; i < 9; i++) {
                let event: any = eventObject('KeyboardEvent', 'keypress');
                if (i == 0) {
                    event.key = "+";
                } else if (i == 1) {
                    event.key = "-";
                } else if (i == 2) {
                    event.key = " ";
                } else {
                    event.key = (9 - i).toString();
                }
                EventHandler.trigger(input, 'keypress', event);
            }
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "A";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value === '+-  65 4321').toEqual(true);
        });
        it('Edit values in MaskedTextBox with "#" and "0"', () => {
            maskBox = new MaskedTextBox({
                mask: "###00000"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            for (let i: number = 0; i < 9; i++) {
                let event: any = eventObject('KeyboardEvent', 'keypress');
                if (i == 0) {
                    event.key = "+";
                } else if (i == 1) {
                    event.key = "-";
                } else if (i == 2) {
                    event.key = " ";
                } else {
                    event.key = (9 - i).toString();
                }
                EventHandler.trigger(input, 'keypress', event);
            }
            expect(input.value === '+- 65432').toEqual(true);
        });
          it('Edit values in MaskedTextBox', () => {
            maskBox = new MaskedTextBox({
                mask: "##>LL <LL"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
             let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "-";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "Z";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "+";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "9";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "A";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "b";
            EventHandler.trigger(input, 'keypress', event);
            event.key = " ";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "c";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "D";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value === '-+AB cd').toEqual(true);
        });
        it('Edit values in MaskedTextBox with masking element "&" and "L" ', () => {
            maskBox = new MaskedTextBox({
                mask: "&>LLL <LL"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "@";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "A";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "e";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "I";
            EventHandler.trigger(input, 'keypress', event);
            event.key = " ";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "o";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "U";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value === '@AEI ou').toEqual(true);
        });
         it('Edit values in MaskedTextBox with masking element "& , C" and "L" ', () => {
            maskBox = new MaskedTextBox({
                mask: "&>LLL?CC9"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "T";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "e";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "X";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "T";
            EventHandler.trigger(input, 'keypress', event);
            event.key = " ";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "B";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "O";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "X";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "1";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value === 'TEXT BO1').toEqual(true);
        });

        it('Edit values in MaskedTextBox -- Check error class', (done: Function) => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            let eventUp: any = eventObject('KeyboardEvent', 'keyup');
            input.focus();
            setTimeout(function() {
                expect(input.selectionStart == 0 && input.selectionEnd != 0).toEqual(true);
                let event: any = eventObject('KeyboardEvent', 'keypress');
                event.key = "P";
                EventHandler.trigger(input, 'keypress', event);
                let inputParent: HTMLElement = <HTMLElement>input.parentNode;
                expect(inputParent.classList.contains('e-error')).toEqual(true);
                eventUp.key = "P";
                EventHandler.trigger(input, 'keyup', eventUp);
                expect(!inputParent.classList.contains('e-error')).toEqual(true);
                event.key = "5";
                EventHandler.trigger(input, 'keypress', event);
                expect(!inputParent.classList.contains('e-error')).toEqual(true);
                eventUp.key = "5";
                EventHandler.trigger(input, 'keyup', eventUp);
                expect(!inputParent.classList.contains('e-error')).toEqual(true);
                done();
            },1);
        });
        it('Check MaskedTextBox without mask', () => {
            maskBox = new MaskedTextBox();
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.focus();
            input.blur();
            let eventDown: any = eventObject('KeyboardEvent', 'keydown');
            eventDown.key = "P";
            EventHandler.trigger(input, 'keydown', eventDown);
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "P";
            EventHandler.trigger(input, 'keypress', event);
            let eventUp: any = eventObject('KeyboardEvent', 'keyup');
            eventUp.key = "P";
            EventHandler.trigger(input, 'keyup', eventUp);
            let eventCut: any = eventObject('KeyboardEvent', 'cut');
            eventCut.key = 'x';
            eventCut.ctrlKey = true;
            EventHandler.trigger(input, 'cut', eventCut);
            let eventPaste: any = eventObject('KeyboardEvent', 'paste');
            eventPaste.key = 'v';
            eventPaste.ctrlKey = true;
            EventHandler.trigger(input, 'paste', eventPaste);
        });
    });
    describe('Edit values in MaskedTextBox through keyboard keys-Backspace', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Edit values in MaskedTextBox - clear all values(Backspace Key)', (done: Function) => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = 0;
            input.selectionEnd = 11;
            let event: any = eventObject('KeyboardEvent', 'keydown');
            event.key = 'Backspace';
            event.keyCode = 8;
            EventHandler.trigger(input, 'keydown', event);
            setTimeout(function() {
                expect(input.value === '__ ___ ____').toEqual(true);
                done();
            },1);
        });
        it('Edit values in MaskedTextBox - clear set of values(Backspace Key)', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = 7;
            input.selectionEnd = 11;
            let event: any = eventObject('KeyboardEvent', 'keydown');
            event.key = 'Backspace';
            event.keyCode = 8;
            EventHandler.trigger(input, 'keydown', event);
            expect(input.value === '98 032 ____').toEqual(true);
        });
        it('Edit values in MaskedTextBox - clear all values(Delete Key)', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = 0;
            input.selectionEnd = 11;
            let event: any = eventObject('KeyboardEvent', 'keydown');
            event.key = 'Delete';
            event.keyCode = 46;
            EventHandler.trigger(input, 'keydown', event);
            expect(input.value === '__ ___ ____').toEqual(true);
        });
        it('Edit values in MaskedTextBox - clear set of values(Delete Key)', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = 7;
            input.selectionEnd = 11;
            let event: any = eventObject('KeyboardEvent', 'keydown');
            event.key = 'Delete';
            event.keyCode = 46;
            EventHandler.trigger(input, 'keydown', event);
            expect(input.value === '98 032 ____').toEqual(true);
        });
        it('Edit values in MaskedTextBox - clear single value using delete key', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            let event: any = eventObject('KeyboardEvent', 'keydown');
            input.selectionStart = 4;
            input.selectionEnd = 4;
            event.key = 'Delete';
            event.keyCode = 46;
            EventHandler.trigger(input, 'keydown', event);
            expect(input.value === '98 0_2 5679').toEqual(true);
            input.selectionStart = 6;
            input.selectionEnd = 6;
            event.key = 'Delete';
            event.keyCode = 46;
            EventHandler.trigger(input, 'keydown', event);
            expect(input.value === '98 0_2 5679').toEqual(true);
            expect(input.selectionStart === 7 && input.selectionEnd === 7).toEqual(true);
        });
        it('Edit values in MaskedTextBox - clear single(last) value', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            let event: any = eventObject('KeyboardEvent', 'keydown');
            event.key = 'Backspace';
            event.keyCode = 8;
            EventHandler.trigger(input, 'keydown', event);
            expect(input.value === '98 032 567_').toEqual(true);
        });
        it('Edit values in MaskedTextBox - clear with custom characters', () => {
            maskBox = new MaskedTextBox({
                mask: "PI 99999",
                customCharacters: {
                    P: 'T,C,t,c',
                    I: 'N,H,n,h'
                }
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = 2;
            let event: any = eventObject('KeyboardEvent', 'keydown');
            event.key = 'Backspace';
            event.keyCode = 8;
            EventHandler.trigger(input, 'keydown', event);
            EventHandler.trigger(input, 'keydown', event);
            expect(input.value.length === 8 && input.value[2].trim() === '').toEqual(true);
            expect(input.selectionStart === 0).toEqual(true);
        });
    });
    describe('Edit values in MaskedTextBox-- Custom Characters', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Edit custom characters - check with mapped characters', () => {
            maskBox = new MaskedTextBox({
                mask: "PI 99999",
                customCharacters: {
                    P: 'T,C,t,c',
                    I: 'N,H,n,h'
                }
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.focus();
            input.selectionStart = input.selectionEnd = 0;
            let eventDown: any = eventObject('KeyboardEvent', 'keydown');
            eventDown.key = "T";
            EventHandler.trigger(input, 'keydown', eventDown);
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "T";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "N";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value.length === 8 && input.value[2].trim() === '').toEqual(true);
            expect(input.value[0] === 'T' && input.value[1] === 'N').toEqual(true);
        });
        it('Edit custom characters - check with mapped characters and backspace', () => {
            maskBox = new MaskedTextBox({
                mask: "PI 99999",
                customCharacters: {
                    P: 'T,C,t,c',
                    I: 'N,H,n,h'
                }
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "T";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "N";
            EventHandler.trigger(input, 'keypress', event);
            let eventDown: any = eventObject('KeyboardEvent', 'keydown');
            eventDown.key = 'Backspace';
            eventDown.keyCode = 8;
            EventHandler.trigger(input, 'keydown', eventDown);
            expect(input.value[1] === '_').toEqual(true);
        });
        it('Edit custom characters - check with other characters', () => {
            maskBox = new MaskedTextBox({
                mask: "PI 99999",
                customCharacters: {
                    P: 'T,C,t,c',
                    I: 'N,H,n,h'
                }
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "V";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value.length === 8 && input.value[2].trim() === '').toEqual(true);
            expect(input.value[0] === '_').toEqual(true);
            event.key = "C";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value[0] === 'C').toEqual(true);
        });
    });
    describe('Edit values in MaskedTextBox-- Upper and Lower Case', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Edit values in the MaskedTextBox with alphabets using masking element "L"', () => {
            maskBox = new MaskedTextBox({
                mask: "LL L"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.focus();
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "s";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "S";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "b";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value.length === 4 && input.value[2].trim() === '').toEqual(true);
            expect(input.value === 'sS b').toEqual(true);
        });
        it('Edit values in the MaskedTextBox with alphabets using masking element "?"', () => {
            maskBox = new MaskedTextBox({
                mask: "?? ??"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.focus();
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "s";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "S";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "b";
            EventHandler.trigger(input, 'keypress', event);
            event.key = " ";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value.length === 5 && input.value[2].trim() === '').toEqual(true);
            expect(input.value === 'sS b ').toEqual(true);
        });
        it('Edit values - check for upper case', () => {
            maskBox = new MaskedTextBox({
                mask: ">LLLLL LL"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.focus();
            input.selectionStart = input.selectionEnd = 0;
            for (let i: number = 0; i < 7; i++) {
                let event: any = eventObject('KeyboardEvent', 'keypress');
                event.key = "s";
                EventHandler.trigger(input, 'keypress', event);
            }
            expect(input.value.length === 8 && input.value[5].trim() === '').toEqual(true);
            expect(input.value === 'SSSSS SS').toEqual(true);
        });
        it('Edit values - check for lower case', () => {
            maskBox = new MaskedTextBox({
                mask: "<LLLLL LL"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            for (let i: number = 0; i < 7; i++) {
                let event: any = eventObject('KeyboardEvent', 'keypress');
                event.key = "S";
                EventHandler.trigger(input, 'keypress', event);
            }
            expect(input.value.length === 8 && input.value[5].trim() === '').toEqual(true);
            expect(input.value === 'sssss ss').toEqual(true);
        });
        it('Edit values - check for combination of cases', () => {
            maskBox = new MaskedTextBox({
                mask: "<LLLL>L LL"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            for (let i: number = 0; i < 7; i++) {
                let event: any = eventObject('KeyboardEvent', 'keypress');
                event.key = "S";
                EventHandler.trigger(input, 'keypress', event);
                let eventUp: any = eventObject('KeyboardEvent', 'keyup');
                eventUp.key = 'S';
                EventHandler.trigger(input, 'keyup', eventUp);
            }
            expect(input.value.length === 8 && input.value[5].trim() === '').toEqual(true);
            expect(input.value === 'ssssS SS').toEqual(true);
        });
    });
    describe('Edit values in MaskedTextBox-- Regular expression support', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Edit values using Regular expressions', () => {
            maskBox = new MaskedTextBox({
                mask: "[0-2][0-5] +[0-2]",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "1";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "6";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "4";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "2";
            EventHandler.trigger(input, 'keypress', event);
            let eventUp: any = eventObject('KeyboardEvent', 'keyup');
            eventUp.key = '2';
            EventHandler.trigger(input, 'keyup', eventUp);
            expect(input.value.length === 5).toEqual(true);
            expect(input.value === '14 +2').toEqual(true);
        });
        it('Edit values using Regular expressions with escape mask for square brackets-literals', () => {
            maskBox = new MaskedTextBox({
                mask: "[0-2][0-5] +[0-2]\\[n\\]",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "1";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "6";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "4";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "2";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value.length === 8).toEqual(true);
            expect(input.value === '14 +2[n]').toEqual(true);
        });
        it('Edit values using Regular expressions with escape mask for square brackets', () => {
            maskBox = new MaskedTextBox({
                mask: "[0-2][0-5] +[0-2]\\[[s]\\]",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            expect(input.value === '__ +_[_]').toEqual(true);
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "1";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "6";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "4";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "2";
            EventHandler.trigger(input, 'keypress', event);
            event.key = "s";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value.length === 8).toEqual(true);
            expect(input.value === '14 +2[s]').toEqual(true);
        });
    });
    describe('Edit values in MaskedTextBox-- Escape mask support', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Edit values with escape mask', () => {
            maskBox = new MaskedTextBox({
                mask: "\\>LLL>L",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            for (let i: number = 0; i < 4; i++) {
                let event: any = eventObject('KeyboardEvent', 'keypress');
                event.key = "s";
                EventHandler.trigger(input, 'keypress', event);
            }
            expect(input.value.length === 5).toEqual(true);
            expect(input.value === '>sssS').toEqual(true);
        });
    });
    describe('Edit values in MaskedTextBox-- Disable Upper and Lower Case', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Edit values -  Disable upper case', () => {
            maskBox = new MaskedTextBox({
                mask: ">LLLL|L LL"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.focus();
            input.selectionStart = input.selectionEnd = 0;
            for (let i: number = 0; i < 7; i++) {
                let event: any = eventObject('KeyboardEvent', 'keypress');
                event.key = "s";
                EventHandler.trigger(input, 'keypress', event);
            }
            expect(input.value.length === 8 && input.value[5].trim() === '').toEqual(true);
            expect(input.value === 'SSSSs ss').toEqual(true);
        });
        it('Edit values - Disable lower case', () => {
            maskBox = new MaskedTextBox({
                mask: "<LLLL|L LL"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            for (let i: number = 0; i < 7; i++) {
                let event: any = eventObject('KeyboardEvent', 'keypress');
                event.key = "S";
                EventHandler.trigger(input, 'keypress', event);
            }
            expect(input.value.length === 8 && input.value[5].trim() === '').toEqual(true);
            expect(input.value === 'ssssS SS').toEqual(true);
        });
    });
    describe('Edit values in text box using Utility mask method', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
            let ele2: HTMLElement = createElement('input', { id: 'mask2' });
            document.body.appendChild(ele2);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Default text box with Utility mask method', () => {
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            let input2: HTMLInputElement = <HTMLInputElement>document.getElementById('mask2');
            maskInput({
                element: input,
                mask: '(999) 99-999'
            });
            input.selectionStart = input.selectionEnd = 0;
            for (let i: number = 0; i < 8; i++) {
                let event: any = eventObject('KeyboardEvent', 'keypress');
                event.key = "5";
                EventHandler.trigger(input, 'keypress', event);
            }
            expect(input.value.length === 12).toEqual(true);
            expect(input.value === '(555) 55-555').toEqual(true);
            expect(getVal({
                element: input,
                mask: '(999) 99-999',
            }) === '55555555').toEqual(true);
            expect(getMaskedVal({
                element: input,
                mask: '(999) 99-999'
            }) === '(555) 55-555').toEqual(true);
        });
        it('Default text box with Utility mask method -- PromptCharacter', () => {
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            maskInput({
                element: input,
                mask: '(999) 99-999',
                promptChar: '~'
            });
            expect(input.value.length === 12).toEqual(true);
            expect(input.value === '(~~~) ~~-~~~').toEqual(true);
        });
        it('Default text box with Utility mask method -- PromptCharacter(multiple check)', () => {
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            maskInput({
                element: input,
                mask: '(999) 99-999',
                promptChar: '#+'
            });
            expect(input.value.length === 12).toEqual(true);
            expect(input.value === '(###) ##-###').toEqual(true);
        });
        it('Default text box with Utility mask method -- Set value', () => {
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            maskInput({
                element: input,
                mask: '(999) 99-999',
                value: '96789999'
            });
            expect(input.value.length === 12).toEqual(true);
            expect(input.value === '(967) 89-999').toEqual(true);
        });
        it('Default text box with Utility mask method', () => {
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            maskInput({
                element: input,
                mask: '(999) 99-999'
            });
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "P";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.classList.contains('e-error')).toEqual(true);
        });
    });
    describe('Floating label MaskedTextBox', () => {
        let maskBox: any;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Floating label MaskedTextBox', (done: Function) => {
            maskBox = new MaskedTextBox({
                mask: '9999 9999 9999 9999',
                placeholder: 'Enter card number',
                floatLabelType: "Auto"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.parentElement.classList.contains('e-float-input')).toEqual(true);
            expect(input.parentElement.getElementsByTagName('label')[0].innerText === 'Enter card number').toEqual(true);
            expect(input.value === '').toBe(true);
            input.focus();
            input.selectionStart = input.selectionEnd = 0;
            expect(input.value === '____ ____ ____ ____').toBe(true);
            input.blur();
            expect(input.value === '').toBe(true);
            input.focus();
            setTimeout(
                () => {
                    expect(input.selectionStart === 0 && input.selectionEnd != 0).toEqual(true);
                    done();
                },
                10);
        });
        it('Floating label MaskedTextBox', () => {
            maskBox = new MaskedTextBox({
                mask: '9999 9999 9999 9999',
                placeholder: 'Enter card number',
                floatLabelType: "Never",
                enabled: true,
                showClearButton:true
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.parentElement.classList.contains('e-input-group') && !input.parentElement.classList.contains('e-float-input')).toEqual(true);
            expect(input.placeholder === 'Enter card number').toEqual(true);
            expect(input.value === '').toBe(true);
            input.focus();
            input.selectionStart = input.selectionEnd = 0;
            expect(input.value === '____ ____ ____ ____').toBe(true);    
            expect(maskBox.inputObj.clearButton.classList.contains('e-clear-icon-hide')).toBe(true);
            document.getElementById('mask1').focus();
            expect(maskBox.inputObj.clearButton.classList.contains('e-clear-icon')).toBe(true);
            maskBox.value = "12345678901234";
            maskBox.dataBind();
            maskBox.promptChar = "*";
            maskBox.dataBind();
            input.focus();
            expect(input.value === '1234 5678 9012 34**').toBe(true);
            maskBox.enabled = false;
            maskBox.dataBind();
            expect(input.hasAttribute('disabled') && input.hasAttribute('aria-disabled')).toEqual(true);
        });
        it('Floating label MaskedTextBox', () => {
            maskBox = new MaskedTextBox({
                mask: '9999 9999 9999 9999',
                placeholder: 'Enter card number',
                floatLabelType: "Always"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.parentElement.classList.contains('e-float-input')).toEqual(true);
            expect(input.parentElement.getElementsByTagName('label')[0].innerText === 'Enter card number').toEqual(true);
            expect(input.parentElement.getElementsByTagName('label')[0].classList.contains('e-label-top')).toEqual(true);
            expect(input.value === '____ ____ ____ ____').toBe(true);
        });
        it('position at focus in and focus out', () => {
            maskBox = new MaskedTextBox({
                mask: '9999 9999 9999 9999',
                placeholder: 'Enter card number',
                floatLabelType: "Auto"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.parentElement.getElementsByTagName('label')[0].classList.contains('e-label-bottom')).toEqual(true);
            input.focus();
            input.selectionStart = input.selectionEnd = 0;
            input.parentElement.getElementsByTagName('label')[0].classList.add('e-label-top');
            input.blur();
            let eventArgs: any = { preventDefault: function () { } };
            input.value = '___ ____ ____ ____'
            maskInputBlurHandler.call(maskBox, eventArgs);
            expect(input.parentElement.getElementsByTagName('label')[0].classList.contains('e-label-bottom')).toEqual(true);
            setMaskValue.call(maskBox,'88899')
        });
    });

    describe('MaskedTextBox - Through Set model', () => {
        let maskBox: any;
        beforeEach((): void => {
            let ele: HTMLElement = createElement('input', { id: 'mask1' });     
            document.body.appendChild(ele);
            maskBox = new MaskedTextBox({});
            maskBox.appendTo('#mask1');
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Apply place holder', () => {
            maskBox = new MaskedTextBox({
                mask: "9999 9999 9999 9999",
                floatLabelType: "Never"
            });
            maskBox.appendTo('#mask1');
            maskBox.setProperties({ placeholder: "Enter card number" });
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.placeholder === 'Enter card number').toEqual(true);
            input.focus();
            input.selectionStart = input.selectionEnd = 0;
            expect(input.value === '____ ____ ____ ____').toBe(true);
            input.blur();
            expect(input.value === '').toBe(true);
            input.focus();
            input.selectionStart = 0;
            input.selectionEnd = 0;
            let event: any = eventObject('KeyboardEvent', 'keypress');
            event.key = "5";
            EventHandler.trigger(input, 'keypress', event);
            expect(input.value === '5___ ____ ____ ____').toBe(true);
            input.blur();
            expect(input.value === '5___ ____ ____ ____').toBe(true);
            maskBox.setProperties({ value: "9494 8484 7474 6464" });
        });
        it('Check focus in the MaskedTextBox', () => {
            maskBox = new MaskedTextBox({
                mask: '99 999 9999',
                value: '958657856',
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.focus();
        });
        it('Disable MaskedTextBox text box', () => {
            maskBox = new MaskedTextBox({
                mask: '99 999 9999',
                value: '958657856',
            });
            maskBox.appendTo('#mask1');
            maskBox.setProperties({ enabled: false });
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.hasAttribute('disabled') && input.hasAttribute('aria-disabled')).toEqual(true);
        });
        it('RTL MaskedTextBox', () => {
            maskBox = new MaskedTextBox({
                mask: "(999) 99-999",
            });
            maskBox.appendTo('#mask1');
            maskBox.setProperties({ enableRtl: true });
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.parentElement.classList.contains('e-rtl')).toEqual(true);
        });

        it('set width MaskedTextBox', () => {
            maskBox = new MaskedTextBox({
                mask: "(999) 99-999",
            });
            maskBox.appendTo('#mask1');
            maskBox.setProperties({ width: "200px", placeholder:"MaskedTextBox" });
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.style.width === '200px').toEqual(true);
            maskBox.value = "12345678";
            maskBox.enableRtl = true;
            maskBox.dataBind();
            expect(input.value === '(123) 45-678').toEqual(true);
            expect(input.parentElement.style.width === '200px').toEqual(true);
            maskBox.showClearButton = true;
            maskBox.dataBind();
            expect(maskBox.inputObj.clearButton.classList.contains('e-clear-icon-hide')).toBe(true);
            document.getElementById('mask1').focus();
            expect(maskBox.inputObj.clearButton.classList.contains('e-clear-icon')).toBe(true);
            maskBox.enabled = false;
            maskBox.dataBind();
            expect(input.hasAttribute('disabled') && input.hasAttribute('aria-disabled')).toEqual(true);
        });
        it('Apply CssClass property', () => {
            maskBox = new MaskedTextBox({
                mask: "(999) 99-999",
            });
            maskBox.appendTo('#mask1');
            maskBox.setProperties({ cssClass: 'e-custom-css' });
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.parentElement.classList.contains('e-custom-css')).toEqual(true);
            maskBox.setProperties({ enableRtl: true });
            expect(input.parentElement.classList.contains('e-custom-css')).toEqual(true);
            maskBox.setProperties({ cssClass: '' });
        });
        it('Apply mask property', () => {
            maskBox = new MaskedTextBox();
            maskBox.appendTo('#mask1');
            maskBox.setProperties({ mask: "999" });
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.value === '___').toEqual(true);
        });
        it('Change prompt character', () => {
            maskBox = new MaskedTextBox({
                mask: "999"
            });
            maskBox.appendTo('#mask1');
            maskBox.setProperties({ promptChar: "~" });
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.value === '~~~').toEqual(true);
            maskBox.setProperties({ promptChar: "@" });
            expect(input.value === '@@@').toEqual(true);
            maskBox.setProperties({ promptChar: "" });
            expect(input.value === '___').toEqual(true);
            maskBox.setProperties({ promptChar: "#+" });
            expect(input.value === '###').toEqual(true);
        });
        it('Change prompt character with value', () => {
            maskBox = new MaskedTextBox({
                mask: "999",
                value: "44",
                promptChar: "#+"
            });
            maskBox.appendTo('#mask1');
            maskBox.setProperties({ promptChar: "~" });
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.value === '44~').toEqual(true);
        });
        it('Apply custom character in MaskedTextBox', () => {
            maskBox = new MaskedTextBox({
                mask: "TN 99",
            });
            maskBox.appendTo('#mask1');
            maskBox.setProperties({
                customCharacters: {
                    T: 'T,K,A,t,k,a',
                    N: 'N,P,L,A,n,p,l,a'
                }
            });
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.focus();
            input.selectionStart = input.selectionEnd = 0;
            for (let i: number = 0; i < 2; i++) {
                let event: any = eventObject('KeyboardEvent', 'keypress');
                event.key = "a";
                event.ctrlKey = true;
                EventHandler.trigger(input, 'keypress', event);
                let eventUp: any = eventObject('KeyboardEvent', 'keyup');
                eventUp.key = 'a';
                EventHandler.trigger(input, 'keyup', eventUp);
            }
            expect(input.value === 'aa __').toEqual(true);
            let event: any = eventObject('KeyboardEvent', 'keydown');
            event.key = 'Backspace';
            event.keyCode = 8;
            EventHandler.trigger(input, 'keydown', event);
            maskBox.dataBind();
            EventHandler.trigger(input, 'keydown', event);
            maskBox.dataBind();
            expect(input.value === '__ __').toEqual(true);
            maskBox.showClearButton = true;
            maskBox.dataBind();
            expect(maskBox.inputObj.clearButton.classList.contains('e-clear-icon-hide')).toBe(true);
            document.getElementById('mask1').focus();
            expect(maskBox.inputObj.clearButton.classList.contains('e-clear-icon')).toBe(true);
        });
    });
    describe('Undo and Redo functionalities', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Undo functionality', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            let event: any = eventObject('KeyboardEvent', 'keydown');
            event.key = 'Backspace';
            event.keyCode = 8;
            EventHandler.trigger(input, 'keydown', event);
            let eventDown: any = eventObject('KeyboardEvent', 'keydown');
            eventDown.key = 'z';
            eventDown.keyCode = 90;
            eventDown.ctrlKey = true;
            EventHandler.trigger(input, 'keydown', eventDown);
            let eventUp: any = eventObject('KeyboardEvent', 'keyup');
            eventUp.key = 'z';
            eventUp.keyCode = 90;
            eventUp.ctrlKey = true;
            EventHandler.trigger(input, 'keyup', eventUp);
            expect(input.value === '98 032 5679').toEqual(true);
            eventUp.key = 'i';
            eventUp.keyCode = 73;
            eventUp.ctrlKey = true;
            EventHandler.trigger(input, 'keyup', eventUp);
            let eventPress: any = eventObject('KeyboardEvent', 'keypress');
            eventUp.key = 'qq';
            eventUp.keyCode = 17;
            eventUp.ctrlKey = true;
            EventHandler.trigger(input, 'keypress', eventUp);
            eventUp.key = 'z';
            eventUp.keyCode = 26;
            eventUp.ctrlKey = true;
            EventHandler.trigger(input, 'keypress', eventUp);
            eventUp.code = 'KeyZ';
            eventUp.ctrlKey = true;
            EventHandler.trigger(input, 'keypress', eventUp);
            eventUp.code = 'KeyY';
            eventUp.ctrlKey = true;
            EventHandler.trigger(input, 'keypress', eventUp);
            eventUp.code = 'KeyA';
            eventUp.ctrlKey = true;
            EventHandler.trigger(input, 'keypress', eventUp);
        });
        it('Redo functionality', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            let event: any = eventObject('KeyboardEvent', 'keydown');
            event.key = 'Backspace';
            event.keyCode = 8;
            EventHandler.trigger(input, 'keydown', event);
            event.key = 'y';
            event.keyCode = 89;
            event.ctrlKey = true;
            EventHandler.trigger(input, 'keydown', event);
            event.key = 'z';
            event.keyCode = 90;
            event.ctrlKey = true;
            EventHandler.trigger(input, 'keydown', event);
            let eventUp: any = eventObject('KeyboardEvent', 'keyup');
            eventUp.key = 'z';
            eventUp.keyCode = 90;
            eventUp.ctrlKey = true;
            EventHandler.trigger(input, 'keyup', eventUp);
            let eventDown: any = eventObject('KeyboardEvent', 'keydown');
            eventDown.key = 'y';
            eventDown.keyCode = 89;
            eventDown.ctrlKey = true;
            EventHandler.trigger(input, 'keydown', eventDown);
            eventUp.key = 'y';
            eventUp.keyCode = 89;
            EventHandler.trigger(input, 'keyup', eventUp);
            expect(input.value === '98 032 567_').toEqual(true);
            let eventPress: any = eventObject('KeyboardEvent', 'keypress');
            EventHandler.trigger(input, 'keypress', eventUp);
        });
    });
    describe('Cut and Paste functionalities', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Cut functionality', (done: Function) => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = 0;
            input.selectionEnd = input.value.length;
            let event: any = eventObject('KeyboardEvent', 'cut');
            event.key = 'x';
            event.ctrlKey = true;
            EventHandler.trigger(input, 'cut', event);
            setTimeout(
                () => {
                    expect(input.value === '__ ___ ____').toEqual(true);
                    done();
                },
                1500);
        });
        it('Paste functionality', (done: Function) => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            let event: any = eventObject('KeyboardEvent', 'paste');
            event.key = 'v';
            event.ctrlKey = true;
            setTimeout(
                () => {
                    input.value = '98 032 5679';
                },
                1);
            EventHandler.trigger(input, 'paste', event);
            setTimeout(
                () => {
                    expect(input.value === '98 032 5679').toEqual(true);
                    done();
                },
                1500);
            let eventArgs: any = { preventDefault: function () { } };
            maskInputDropHandler(eventArgs);
            setMaskValue();
        });
    });
    describe('MaskedTextBox -  Mobile Support', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Edit first value in MaskedTextBox', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.value = "8__ ___ ____";
            input.selectionStart = 1;
            let event: any = eventObject('KeyboardEvent', 'keyup');
            event.keyCode = 229;
            EventHandler.trigger(input, 'keyup', event);
            expect(input.value === '8_ ___ ____').toEqual(true);
        });
        it('Edit first value in MaskedTextBox - with literals', () => {
            maskBox = new MaskedTextBox({
                mask: "(99) 999 9999",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            let event: any = eventObject('KeyboardEvent', 'keyup');
            input.value = "p(__) ___ ____";
            input.selectionStart = 1;
            event.keyCode = 229;
            EventHandler.trigger(input, 'keyup', event);
            expect(input.value === '(__) ___ ____').toEqual(true);
            input.value = "8(__) ___ ____";
            input.selectionStart = 1;
            EventHandler.trigger(input, 'keyup', event);
            expect(input.value === '(8_) ___ ____').toEqual(true);
        });
        it('Edit multiple values in MaskedTextBox', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.value = "8__ ___ ____";
            input.selectionStart = 1;
            let event: any = eventObject('KeyboardEvent', 'keyup');
            event.keyCode = 229;
            EventHandler.trigger(input, 'keyup', event);
            expect(input.value === '8_ ___ ____').toEqual(true);
            input.value = "85_ ___ ____";
            input.selectionStart = 2;
            EventHandler.trigger(input, 'keyup', event);
            expect(input.value === '85 ___ ____').toEqual(true);
            input.value = "85_ ___ ____";
            input.selectionStart = 2;
            EventHandler.trigger(input, 'keyup', event);
        });
        it('Edit multiple values in MaskedTextBox with space', () => {
            maskBox = new MaskedTextBox({
                mask: "9 999 9999",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.value = "8_ ___ ____";
            input.selectionStart = 1;
            let event: any = eventObject('KeyboardEvent', 'keyup');
            event.keyCode = 229;
            EventHandler.trigger(input, 'keyup', event);
            expect(input.value === '8 ___ ____').toEqual(true);
            input.value = "8 58 ___ ____";
            input.selectionStart = 4;
            EventHandler.trigger(input, 'keyup', event);
            expect(input.value === '8 58_ ____').toEqual(true);
        });
        it('Edit MaskedTextBox with invalid value', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.value = "o__ ___ ____";
            input.selectionStart = 1;
            let event: any = eventObject('KeyboardEvent', 'keyup');
            event.keyCode = 229;
            EventHandler.trigger(input, 'keyup', event);
            expect(input.value === '__ ___ ____').toEqual(true);
        });
        it('Edit MaskedTextBox with invalid value at last index', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "856678897"
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.value = "85 667 8897p";
            input.selectionStart = 12;
            let event: any = eventObject('KeyboardEvent', 'keyup');
            event.keyCode = 229;
            EventHandler.trigger(input, 'keyup', event);
            expect(input.value === '85 667 8897').toEqual(true);
            input.value = "85 667 88973";
            input.selectionStart = 12;
            EventHandler.trigger(input, 'keyup', event);
        });
        it('Remove value in MaskedTextBox for Mobile devices- with value', (done: Function) => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.value = "8__ ___ ____";
            input.selectionStart = 1;
            let eventUp: any = eventObject('KeyboardEvent', 'keyup');
            eventUp.keyCode = 229;
            EventHandler.trigger(input, 'keyup', eventUp);
            let event: any = eventObject('KeyboardEvent', 'keydown');
            event.keyCode = 229;
            EventHandler.trigger(input, 'keydown', event);
            input.value = "_ ___ ____";
            input.selectionStart = 0;
            EventHandler.trigger(input, 'keydown', event);
            setTimeout(
                () => {
                    expect(input.value === '_ ___ ____').toEqual(true);
                    EventHandler.trigger(input, 'keyup', eventUp);
                    done();
                },
                1500);
        });
        it('Remove value in MaskedTextBox for Mobile devices- without value', (done: Function) => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            let event: any = eventObject('KeyboardEvent', 'keydown');
            event.keyCode = 229;
            input.value = "_ ___ ____";
            mobileRemoveFunction.call(maskBox);
            input.selectionStart = 0;
            EventHandler.trigger(input, 'keydown', event);
            setTimeout(
                () => {
                    expect(input.value === '__ ___ ____').toEqual(true);
                    done();
                },
                1500);
        });
        it('Edit value in MaskedTextBox for touch swipe', () => {
            maskBox = new MaskedTextBox({
                mask: "(LLL) LL",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            let event: any = eventObject('KeyboardEvent', 'keyup');
            input.value = 'Mas(___) __';
            input.selectionStart = 3;
            event.keyCode = 229;
            EventHandler.trigger(input, 'keyup', event);
            expect(input.value === '(Mas) __').toEqual(true);
        });
        it('Edit value in MaskedTextBox for touch swipe -- Unsupported values', () => {
            maskBox = new MaskedTextBox({
                mask: "(999) 99",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            let event: any = eventObject('KeyboardEvent', 'keyup');
            input.value = '5as(___) __';
            input.selectionStart = 3;
            event.keyCode = 229;
            EventHandler.trigger(input, 'keyup', event);
            expect(input.value === '(5__) __').toEqual(true);
        });
        it('Edit value in MaskedTextBox at first place on focus -- Mobile device', () => {
            maskBox = new MaskedTextBox({
                mask: "99999",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            let event: any = eventObject('KeyboardEvent', 'keyup');
            input.value = '5';
            input.selectionStart = 1;
            event.keyCode = 229;
            EventHandler.trigger(input, 'keyup', event);
            expect(input.value === '5____').toEqual(true);
        });
    });
    describe('MaskedTextBox -  Clear Icon Support', () => {
        let maskBox: MaskedTextBox;
        let mask:any;
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        beforeEach((): void => {
            let ele: HTMLElement = createElement('input', { id: 'mask1' });            
            document.body.appendChild(ele);
            mask = new MaskedTextBox({ showClearButton: true });
            mask.appendTo('#mask1');
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
         it('clear icon', () => {
            expect(mask.inputObj.clearButton.classList.contains('e-clear-icon-hide')).toBe(true);
            document.getElementById('mask1').focus();
            expect(mask.inputObj.clearButton.classList.contains('e-clear-icon')).toBe(true);
        });       
        it('clear button default state', () => {
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.value = '123456';
             expect(mask.inputObj.clearButton.classList.contains('e-clear-icon-hide')).toBe(true);
            document.getElementById('mask1').focus();
            expect(mask.inputObj.clearButton.classList.contains('e-clear-icon')).toBe(true);
        });
        it('click on clear button without focus', () => {
             let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
             input.value = '123456';
             expect(mask.getMaskedValue()).toBe('123456');
             document.getElementById('mask1').focus();
            (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
             expect(input.value === '').toEqual(true);
        });
        it('Floating label with Clear Icons', () => {
            mask = new MaskedTextBox({
                mask: '+(1)999 9999',
                placeholder: 'Enter card number',
                floatLabelType: "Auto",
            });
            mask.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.value = '+(1)999'
            expect(input.parentElement.classList.contains('e-float-input')).toEqual(true);
            expect(input.parentElement.getElementsByTagName('label')[0].innerText === 'Enter card number').toEqual(true);
            expect(input.parentElement.getElementsByTagName('label')[0].classList.contains('e-label-bottom')).toEqual(true);
            expect(input.value === '+(1)999').toBe(true);
        });
        it('position at focus in and focus out', () => {
            mask = new MaskedTextBox({
                mask: '+(1)999 9999',
                placeholder: 'Enter card number',
                floatLabelType: 'Always',
            });
            mask.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.parentElement.getElementsByTagName('label')[0].classList.contains('e-label-top')).toEqual(true);
            input.focus();
            input.selectionStart = input.selectionEnd = 0;
            input.parentElement.getElementsByTagName('label')[0].classList.add('e-label-top');
            input.blur();
            input.value = '___ ____ ____ ____'
            expect(input.parentElement.getElementsByTagName('label')[0].classList.contains('e-label-top')).toEqual(true);
           
        });

    });
    describe('MaskedTextBox -  Complete Mobile Support', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Edit first value in MaskedTextBox', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.value = "8_ ___ ____";
            input.selectionStart = 1;
            let event: any = eventObject('KeyboardEvent', 'input');
            event.keyCode = 229;
            EventHandler.trigger(input, 'input', event);
            expect(input.value === '8_ ___ ____').toEqual(true);
        });
        it('Edit first value in MaskedTextBox', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.value = "8__ ___ ____";
            input.selectionStart = 1;
            let event: any = eventObject('KeyboardEvent', 'input');
            event.keyCode = 229;
            EventHandler.trigger(input, 'input', event);
            expect(input.value === '8_ ___ ____').toEqual(true);
        });
        it('Empty value in MaskedTextBox', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.value = '';
            input.selectionStart = 1;
            let event: any = eventObject('KeyboardEvent', 'input');
            event.keyCode = 229;
            EventHandler.trigger(input, 'input', event);
            expect(input.value === '__ ___ ____').toEqual(true);
        });
        it('Mask with single value', () => {
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.value = '1';
            input.selectionStart = 1;
            let event: any = eventObject('KeyboardEvent', 'input');
            event.keyCode = 229;
            EventHandler.trigger(input, 'input', event);
            expect(input.value === '1_ ___ ____').toEqual(true);
        });
    });
    describe('Floating label MaskedTextBox', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Floating label MaskedTextBox : Auto', (done: Function) => {
            maskBox = new MaskedTextBox({
                mask: '9999 9999 9999 9999',
                placeholder: 'Enter card number'
            });
            maskBox.appendTo('#mask1');
            maskBox.floatLabelType = "Auto";
            maskBox.dataBind();
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.parentElement.classList.contains('e-float-input')).toEqual(true);
            expect(input.parentElement.getElementsByTagName('label')[0].innerText === 'Enter card number').toEqual(true);
            input.focus();
            input.selectionStart = input.selectionEnd = 0;
            expect(input.value === '____ ____ ____ ____').toBe(true);
            input.blur();
            expect(input.value === '').toBe(true);
            input.focus();
            setTimeout(
                () => {
                    expect(input.selectionStart === 0 && input.selectionEnd != 0).toEqual(true);
                    done();
                },
                10);
        });
        it('Floating label MaskedTextBox: Never', () => {
            maskBox = new MaskedTextBox({
                mask: '9999 9999 9999 9999',
                placeholder: 'Enter card number'
            });
            maskBox.appendTo('#mask1');
            maskBox.floatLabelType = "Never";
            maskBox.dataBind();
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.parentElement.classList.contains('e-input-group') && !input.parentElement.classList.contains('e-float-input')).toEqual(true);
            expect(input.placeholder === 'Enter card number').toEqual(true);
            expect(input.value === '').toBe(true);
            input.focus();
            input.selectionStart = input.selectionEnd = 0;
            expect(input.value === '____ ____ ____ ____').toBe(true);
            input.blur();
            expect(input.value === '').toBe(true);
        });
        it('Floating label MaskedTextBox: Always', () => {
            maskBox = new MaskedTextBox({
                mask: '9999 9999 9999 9999',
                placeholder: 'Enter card number',
                value: "1",
            });
            maskBox.appendTo('#mask1');
            maskBox.floatLabelType = "Always";
            maskBox.dataBind();
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.parentElement.classList.contains('e-float-input')).toEqual(true);
            expect(input.parentElement.getElementsByTagName('label')[0].innerText === 'Enter card number').toEqual(true);
            expect(input.parentElement.getElementsByTagName('label')[0].classList.contains('e-label-top')).toEqual(true);
            expect(input.value === '1___ ____ ____ ____').toBe(true);
        });
        it('Destroy method testing', () => {
            maskBox = new MaskedTextBox({
                mask: '9999 9999 9999 9999',
                placeholder: 'Enter card number'
            });
            maskBox.appendTo('#mask1');
            maskBox.destroy();
            expect(document.getElementById('mask1').className).toBe('');
            maskBox = undefined;
        });
    });
    describe('Name attribute', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Name attribute testing', () => {
            maskBox = new MaskedTextBox({
                mask: '9999 9999 9999 9999',
                placeholder: 'Enter card number'
            });
            maskBox.appendTo('#mask1');
            maskBox.floatLabelType = "Never";
            expect(maskBox.element.name).toBe("mask1");
        });
    });
    describe('Event testing', () => {
        let maskBox: any;
        let i: number = 0, j: number = 0;
        let selectEnd: number = 0 , selectStart: number = 0;
        let name: any, maskedvalue: any ,value: any;
        function clickFn(args:MaskChangeEventArgs): void {
            i++;
            value= args.value;
            maskedvalue= args.maskedValue;
        }
         function FocusFn(args: MaskFocusEventArgs): void {
            j++;
            selectStart = args.selectionStart;
            selectEnd = args.selectionEnd;
            name = args.name;
        }
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Change event testing', () => {
            maskBox = new MaskedTextBox({
                mask: '9999 9999 9999 9999',
                placeholder: 'Enter card number',
                value: "123",
                change: clickFn,
            });
            maskBox.appendTo('#mask1');
            expect(i).toEqual(0);
            maskBox.value = '098';
            maskBox.dataBind();
            expect(i).toEqual(1);
            expect(maskedvalue).toEqual("098_ ____ ____ ____");
            expect(value).toEqual("098");
        });
         it('FocusFn event testing', () => {
            maskBox = new MaskedTextBox({
                mask: '9999 9999 9999 9999',
                placeholder: 'Enter card number',
                value: "123",
                change: clickFn,
                focus: FocusFn
            });
            maskBox.appendTo('#mask1');
            expect(j).toEqual(0);
            document.getElementById('mask1').focus();
            expect(j).toEqual(1);
            expect(selectStart).toEqual(0);
            expect(selectEnd).toEqual(19);
            expect(name).toEqual("focus");
        });
    });
});