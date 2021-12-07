/**
 * MaskedTextBox spec document
 */

import { createElement, KeyboardEvents, EmitType, EventHandler, extend, Browser, isBlazor, Event, isNullOrUndefined } from '@syncfusion/ej2-base';
import { MaskedTextBox, MaskChangeEventArgs, MaskFocusEventArgs, MaskBlurEventArgs} from '../src/maskedtextbox/maskedtextbox/maskedtextbox';
import { maskInput, setMaskValue, getVal, getMaskedVal, mobileRemoveFunction, maskInputDropHandler, maskInputBlurHandler } from '../src/maskedtextbox/base/mask-base';
import  {profile , inMB, getMemoryProfile} from './common.spec';

function eventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = extend({}, tempEvent);
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

let focusEvent: FocusEvent = document.createEvent('FocusEvent');

describe('MaskedTextBox Component', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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
            expect(inputParent.classList.contains('e-mask')).toEqual(true);
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
            expect(customParent.classList.contains('e-mask')).toEqual(true);
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
            expect(inputParent.classList.contains('e-mask')).toEqual(true);
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
            expect(inputParent.classList.contains('e-mask')).toEqual(true);
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
            expect(inputParent.classList.contains('e-mask')).toEqual(true);
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
            expect(inputParent.classList.contains('e-mask')).toEqual(true);
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
            expect(inputParent.classList.contains('e-mask')).toEqual(true);
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
    describe('Dynamically change enabled state as true', () => {
        let maskBox: any;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'mask' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Without mask option', () => {
            maskBox = new MaskedTextBox({ placeholder:"Enter card number", enabled: false, value: "98 765 43211" });
            maskBox.appendTo('#mask');
            expect(maskBox.element.hasAttribute('disabled')).toEqual(true);
            expect(maskBox.element.hasAttribute('aria-disabled')).toEqual(true);
            expect(maskBox.element.classList.contains('e-disabled')).toBe(true);
            expect(maskBox.inputObj.container.classList.contains('e-disabled')).toBe(true);
            maskBox.enabled = true;
            maskBox.dataBind();
            expect(maskBox.element.hasAttribute('disabled')).toEqual(false);
            expect(maskBox.element.hasAttribute('aria-disabled')).toEqual(false);
            expect(maskBox.element.classList.contains('e-disabled')).toBe(false);
            expect(maskBox.inputObj.container.classList.contains('e-disabled')).toBe(false);
        });
        it('With mask option', () => {
            maskBox = new MaskedTextBox({ placeholder:"Enter card number", enabled: false, mask: "99 999 99999", value: "98 765 43211" });
            maskBox.appendTo('#mask');
            expect(maskBox.element.hasAttribute('disabled')).toEqual(true);
            expect(maskBox.element.hasAttribute('aria-disabled')).toEqual(true);
            expect(maskBox.element.classList.contains('e-disabled')).toBe(true);
            expect(maskBox.inputObj.container.classList.contains('e-disabled')).toBe(true);
            maskBox.enabled = true;
            maskBox.dataBind();
            expect(maskBox.element.hasAttribute('disabled')).toEqual(false);
            expect(maskBox.element.hasAttribute('aria-disabled')).toEqual(false);
            expect(maskBox.element.classList.contains('e-disabled')).toBe(false);
            expect(maskBox.inputObj.container.classList.contains('e-disabled')).toBe(false);
        });
        it('Without value property', () => {
            maskBox = new MaskedTextBox({ placeholder:"Enter card number", enabled: false, mask: '(999) 99-999' });
            maskBox.appendTo('#mask');
            expect(maskBox.element.hasAttribute('disabled')).toEqual(true);
            expect(maskBox.element.hasAttribute('aria-disabled')).toEqual(true);
            expect(maskBox.element.classList.contains('e-disabled')).toBe(true);
            expect(maskBox.inputObj.container.classList.contains('e-disabled')).toBe(true);
            maskBox.enabled = true;
            maskBox.dataBind();
            expect(maskBox.element.hasAttribute('disabled')).toEqual(false);
            expect(maskBox.element.hasAttribute('aria-disabled')).toEqual(false);
            expect(maskBox.element.classList.contains('e-disabled')).toBe(false);
            expect(maskBox.inputObj.container.classList.contains('e-disabled')).toBe(false);
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
                expect(input.selectionStart == 0 && input.selectionEnd == 0).toEqual(true);
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
    describe('HTML attributes at inline element testing', () => {
        let maskBox: any;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'mask' });
            ele.setAttribute('placeholder','Enter a number');
            ele.setAttribute('disabled', '');
            ele.setAttribute('value', '50');
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Inline element testing', () => {
            maskBox = new MaskedTextBox();
            maskBox.appendTo('#mask');
            expect(maskBox.placeholder).toBe("Enter a number");
            expect(maskBox.element.hasAttribute('enabled')).toBe(false);
            expect(maskBox.element.getAttribute('value')).toBe('50');
        });
        it('Inline and API testing', () => {
            maskBox = new MaskedTextBox({placeholder:"Enter your mark", enabled: true, value: "70"});
            maskBox.appendTo('#mask');
            expect(maskBox.placeholder).toBe("Enter your mark");
            expect(maskBox.element.hasAttribute('disabled')).toBe(false);
            expect(maskBox.element.getAttribute('value')).toBe('70');
        });
        it('Inline and html attributes API testing', () => {
            maskBox = new MaskedTextBox({ htmlAttributes:{placeholder:"Number of states", disabled: "false", value: "100"}});
            maskBox.appendTo('#mask');
            expect(maskBox.placeholder).toBe("Number of states");
            expect(maskBox.element.hasAttribute('disabled')).toBe(false);
            expect(maskBox.element.getAttribute('value')).toBe('100');
        });
        it('Inline, API and html attributes API testing', () => {
            maskBox = new MaskedTextBox({ htmlAttributes:{placeholder:"Number of states", disabled: "", value: "100"}, placeholder: "Enter your mark", enabled: true, value: "70"});
            maskBox.appendTo('#mask');
            expect(maskBox.placeholder).toBe("Enter your mark");
            expect(maskBox.element.hasAttribute('enabled')).toBe(false);
            expect(maskBox.element.getAttribute('value')).toBe('70');
        });
    });
    
    describe('HTML attribute API testing', () => {
        let maskBox: any;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'mask' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Inline and API testing', () => {
            maskBox = new MaskedTextBox({placeholder:"Enter your mark", enabled: true, value: "70"});
            maskBox.appendTo('#mask');
            expect(maskBox.placeholder).toBe("Enter your mark");
            expect(maskBox.element.hasAttribute('disabled')).toBe(false);
            expect(maskBox.element.getAttribute('value')).toBe('70');
        });
        it('Inline and html attributes API testing', () => {
            maskBox = new MaskedTextBox({ htmlAttributes:{placeholder:"Number of states", disabled: "false", value: "100"}});
            maskBox.appendTo('#mask');
            expect(maskBox.placeholder).toBe("Number of states");
            expect(maskBox.element.hasAttribute('disabled')).toBe(false);
            expect(maskBox.element.getAttribute('value')).toBe('100');
        });
        it('Inline, API and html attributes API testing', () => {
            maskBox = new MaskedTextBox({ htmlAttributes:{placeholder:"Number of states", disabled: "", value: "100"}, placeholder: "Enter your mark", enabled: true, value: "70"});
            maskBox.appendTo('#mask');
            expect(maskBox.placeholder).toBe("Enter your mark");
            expect(maskBox.element.hasAttribute('enabled')).toBe(false);
            expect(maskBox.element.getAttribute('value')).toBe('70');
        });
        it('Other attribute testing with htmlAttributes API', () => {
            maskBox = new MaskedTextBox({ htmlAttributes:{class: "test", name:"numeric", title:"sample"}});
            maskBox.appendTo('#mask');
            maskBox.updateHTMLAttrToWrapper();
            expect(maskBox.element.getAttribute('name')).toBe('numeric');
            expect(maskBox.inputObj.container.getAttribute('title')).toBe('sample');
            expect(maskBox.inputObj.container.classList.contains('test')).toBe(true);
        });
        it('Dynamically change attributes with htmlAttributes API', () => {
            maskBox = new MaskedTextBox({});
            maskBox.appendTo('#mask');
            maskBox.htmlAttributes = { class: "test", title: 'sample', disabled: 'disabled', placeholder: "Number of states"};
            maskBox.dataBind();
            maskBox.updateHTMLAttrToWrapper();
            maskBox.updateHTMLAttrToElement();
            expect(maskBox.element.hasAttribute('disabled')).toBe(true);
            expect(maskBox.element.getAttribute('placeholder')).toBe('Number of states');
            expect(maskBox.inputObj.container.getAttribute('title')).toBe('sample');
            expect(maskBox.inputObj.container.classList.contains('test')).toBe(true);
        });
    });

    describe('HTML attribute API dynamic testing', () => {
        let maskBox: any;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'mask' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Dynamically change attributes with htmlAttributes API', () => {
            maskBox = new MaskedTextBox({ htmlAttributes:{placeholder:"Enter a name", readonly: "true", disabled: "true", value: "100", class: "test", title:"sample", style: 'background-color:yellow'}});
            maskBox.appendTo('#mask');
            expect(maskBox.element.getAttribute('placeholder')).toBe('Enter a name');
            expect(maskBox.element.hasAttribute('disabled')).toBe(true);
            expect(maskBox.element.getAttribute('value')).toBe('100');
            expect(maskBox.inputObj.container.getAttribute('title')).toBe('sample');
            expect(maskBox.inputObj.container.classList.contains('test')).toBe(true);
            expect(maskBox.inputObj.container.getAttribute('style')).toBe('background-color:yellow');
            maskBox.htmlAttributes = { placeholder:"Enter a number", readonly: "false", disabled: "false", value: "50", class: "multiple", title:"heading"};
            maskBox.dataBind();
            expect(maskBox.element.getAttribute('placeholder')).toBe('Enter a number');
            expect(maskBox.element.hasAttribute('disabled')).toBe(false);
            expect(maskBox.element.getAttribute('value')).toBe('50');
            expect(maskBox.inputObj.container.getAttribute('title')).toBe('heading');
            expect(maskBox.inputObj.container.classList.contains('multiple')).toBe(true);
        });
        it('Placeholder testing in auto case', () => {
            maskBox = new MaskedTextBox({ floatLabelType: "Auto", htmlAttributes:{placeholder:"Enter a name" }});
            maskBox.appendTo('#mask');
            expect(maskBox.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter a name');
            maskBox.htmlAttributes = { placeholder:"choose a date"};
            maskBox.dataBind();
            expect(maskBox.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            maskBox.floatLabelType = "Always";
            maskBox.dataBind();
            expect(maskBox.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            maskBox.floatLabelType = "Never";
            maskBox.dataBind();
            expect(maskBox.element.getAttribute('placeholder')).toBe('choose a date');
        });
        it('Placeholder testing in always case', () => {
            maskBox = new MaskedTextBox({ floatLabelType: "Always", htmlAttributes:{placeholder:"Enter a name" }});
            maskBox.appendTo('#mask');
            expect(maskBox.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter a name');
            maskBox.htmlAttributes = { placeholder:"choose a date"};
            maskBox.dataBind();
            expect(maskBox.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            maskBox.floatLabelType = "Always";
            maskBox.dataBind();
            expect(maskBox.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            maskBox.floatLabelType = "Never";
            maskBox.dataBind();
            expect(maskBox.element.getAttribute('placeholder')).toBe('choose a date');
        });
        it('Placeholder testing in never case', () => {
            maskBox = new MaskedTextBox({ floatLabelType: "Never", htmlAttributes:{placeholder:"Enter a name" }});
            maskBox.appendTo('#mask');
            expect(maskBox.element.getAttribute('placeholder')).toBe('Enter a name');
            maskBox.htmlAttributes = { placeholder:"choose a date"};
            maskBox.dataBind();
            expect(maskBox.element.getAttribute('placeholder')).toBe('choose a date');
            maskBox.floatLabelType = "Always";
            maskBox.dataBind();
            expect(maskBox.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            maskBox.floatLabelType = "Never";
            maskBox.dataBind();
            expect(maskBox.element.getAttribute('placeholder')).toBe('choose a date');
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
        it('Edit values with escape inbetween the mask ', () => {
            maskBox = new MaskedTextBox({
                mask: "L\\>LLL>L",
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            input.selectionStart = input.selectionEnd = 0;
            for (let i: number = 0; i < 5; i++) {
                let event: any = eventObject('KeyboardEvent', 'keypress');
                event.key = "s";
                EventHandler.trigger(input, 'keypress', event);
            }
            expect(input.value.length === 6).toEqual(true);
            expect(input.value === 's>sssS').toEqual(true);
        });
    });
    describe('Readonly API with initial rendering', () => {
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
        it('Check readonly with float type auto', () => {
            maskBox = new MaskedTextBox({
                mask: "+1(999) 9999-999",
                placeholder: "Enter phone number",
                floatLabelType: "Auto",
                readonly: true,
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.hasAttribute('readonly')).toEqual(true);
        });
        it('Check readonly with float type auto', () => {
            maskBox = new MaskedTextBox({
                mask: "+1(999) 9999-999",
                placeholder: "Enter phone number",
                floatLabelType: "Always",
                readonly: true,
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.hasAttribute('readonly')).toEqual(true);
        });
        it('Check readonly with float type auto', () => {
            maskBox = new MaskedTextBox({
                mask: "+1(999) 9999-999",
                placeholder: "Enter phone number",
                floatLabelType: "Never",
                readonly: true,
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.hasAttribute('readonly')).toEqual(true);
        });
        it('Check readonly with enabled case', () => {
            maskBox = new MaskedTextBox({
                mask: "+1(999) 9999-999",
                placeholder: "Enter phone number",
                floatLabelType: "Auto",
                readonly: true,
                enabled: false,
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.hasAttribute('readonly')).toEqual(true);
        });
        it('Check readonly attribute at htmlAttributes API', () => {
            maskBox = new MaskedTextBox({
                mask: "+1(999) 9999-999",
                placeholder: "Enter phone number",
                floatLabelType: "Auto",
                htmlAttributes: {"readonly":"true"},
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.hasAttribute('readonly')).toEqual(true);
        });
        it('Check readonly attribute with API and htmlAttributes API', () => {
            maskBox = new MaskedTextBox({
                mask: "+1(999) 9999-999",
                placeholder: "Enter phone number",
                floatLabelType: "Auto",
                readonly: false,
                htmlAttributes: {"readonly":"true"},
            });
            maskBox.appendTo('#mask1');
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.hasAttribute('readonly')).toEqual(false);
        });
    });

    describe('Readonly API at dynamic rendering', () => {
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
        it('Check readonly with float type auto', () => {
            maskBox = new MaskedTextBox({
                mask: "+1(999) 9999-999",
                placeholder: "Enter phone number",
                floatLabelType: "Auto",
            });
            maskBox.appendTo('#mask1');
            maskBox.readonly = true;
            maskBox.dataBind();
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.hasAttribute('readonly')).toEqual(true);
        });
        it('Check readonly attribute with htmlAttributes API', () => {
            maskBox = new MaskedTextBox({
                mask: "+1(999) 9999-999",
                placeholder: "Enter phone number",
                floatLabelType: "Auto",
                readonly: false,
                htmlAttributes: {"readonly":"true"},
            });
            maskBox.appendTo('#mask1');
            maskBox.htmlAttributes = {"readonly":"true"},
            maskBox.dataBind();
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
            expect(input.hasAttribute('readonly')).toEqual(true);
        });
    });
    describe('HTML attribute API at inital rendering and dynamic rendering', () => {
        let maskBox: any;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'mask' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Html attributes at initial rendering', () => {
            maskBox = new MaskedTextBox({ htmlAttributes:{placeholder:"Enter a number", class: "sample" } });
            maskBox.appendTo('#mask');
            expect(maskBox.element.getAttribute('placeholder')).toBe('Enter a number');
            expect(maskBox.inputObj.container.classList.contains('sample')).toBe(true);
        });
        it('Pass multiple attributes dynamically', () => {
            maskBox = new MaskedTextBox({ value: '96789999' });
            maskBox.appendTo('#mask');
            maskBox.htmlAttributes = { class:"sample", readonly: "true", disabled: "true"};
            maskBox.dataBind();
            expect(maskBox.element.value).toBe('96789999');
            expect(maskBox.inputObj.container.classList.contains('sample')).toBe(true);
            expect(maskBox.element.hasAttribute('readonly')).toBe(true);
            expect(maskBox.element.hasAttribute('disabled')).toBe(true);
        });
        it('Pass null value in htmlAttributes', () => {
            maskBox = new MaskedTextBox({ value: '96789999' });
            maskBox.appendTo('#mask');
            maskBox.htmlAttributes = { null: "null"};
            maskBox.dataBind();
            expect(maskBox.element.value).toBe('96789999');
        });
        it('Pass undefined in htmlAttributes', () => {
            maskBox = new MaskedTextBox({ value: '96789999' });
            maskBox.appendTo('#mask');
            maskBox.htmlAttributes = { undefined: "undefined"};
            maskBox.dataBind();
            expect(maskBox.element.value).toBe('96789999');
        });
        it('Dynamically change attributes through htmlAttributes API', () => {
            maskBox = new MaskedTextBox({ mask: '(999) 99-999', value: '96789999'  });
            maskBox.appendTo('#mask');
            maskBox.element.value = "96734599";
            maskBox.htmlAttributes = { class:"sample" };
            maskBox.dataBind();
            expect(maskBox.element.value).toBe('96734599');
        });
        it('Pass empty value in htmlAttributes', () => {
            maskBox = new MaskedTextBox({ mask: '(999) 99-999', value: '96789999'  });
            maskBox.appendTo('#mask');
            maskBox.element.value = "96789999";
            maskBox.htmlAttributes = {};
            maskBox.dataBind();
            expect(maskBox.element.value).toBe('96789999');
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
            focusEvent.initEvent('focus');
            input.dispatchEvent(focusEvent);
            input.selectionStart = input.selectionEnd = 0;
            expect(input.value === '____ ____ ____ ____').toBe(true);
            focusEvent.initEvent('blur');
            input.dispatchEvent(focusEvent);
            expect(input.value === '').toBe(true);
            focusEvent.initEvent('focus');
            input.dispatchEvent(focusEvent);
            setTimeout(
                () => {
                    expect(input.selectionStart === 0 && input.selectionEnd == 0).toEqual(true);
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

    describe('Event testing', () => {
        let maskObj: any;
        let onfocus: EmitType<Object> = jasmine.createSpy('focus');
        let onBlur: EmitType<Object> = jasmine.createSpy('blur');
        let originalTimeout: number;
        beforeEach((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let element: HTMLElement = createElement('input', {id: 'textbox'});
            document.body.appendChild(element);
            maskObj = new MaskedTextBox({ focus: onfocus, blur: onBlur });
            maskObj.appendTo(document.getElementById('textbox'));
        });
        afterEach(():void => {
            if (maskObj) {
                maskObj.destroy();
            }
            document.body.innerHTML = '';
        })
        it('focus event through public method', () => {
            maskObj.focusIn();
            expect(onfocus).toHaveBeenCalled();
        });
        it('blur event through public method', (done: Function) => {
            maskObj.focusOut();
            done();
            // setTimeout(
            //     () => {
            //         expect(onBlur).toHaveBeenCalled();
            //         done();
            //     },
            // 2500);
            
        });
    });

    describe('Cut functionalities', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
        });
        afterEach(():void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        })
        it('Cut functionality', (done: Function) => {
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
            2500);
        });
    });

    describe('Paste functionalities', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "980325679"
            });
            maskBox.appendTo('#mask1');
        });
        it('Paste functionality', (done: Function) => {
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
                    if (maskBox) {
                        maskBox.destroy();
                    }
                    document.body.innerHTML = '';
                    done();
                },
                2500);
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

    describe('MaskedTextBox -  Mobile Support-01', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
                value: "856678897"
            });
            maskBox.appendTo('#mask1');
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });

        it('Edit MaskedTextBox with invalid value at last index', (done: Function) => {
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
            setTimeout(
                () => {
                    expect(input.value === '85 667 8897').toEqual(true);
                    done();
                },
                2500);
        });
    });


    describe('MaskedTextBox -  Mobile Support-02', () => {
        let maskBox: MaskedTextBox;
        beforeEach((): void => {
            maskBox = undefined;
            let ele: HTMLElement = createElement('input', { id: 'mask1' });
            document.body.appendChild(ele);
            maskBox = new MaskedTextBox({
                mask: "99 999 9999",
            });
            maskBox.appendTo('#mask1');
        });
        afterEach((): void => {
            if (maskBox) {
                maskBox.destroy();
            }
            document.body.innerHTML = '';
        });

        it('Remove value in MaskedTextBox for Mobile devices- with value', (done: Function) => {
            
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
                2500);
        });
        it('Remove value in MaskedTextBox for Mobile devices- without value', (done: Function) => {
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
                2500);
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
            focusEvent.initEvent('focus', true, true);
            input.dispatchEvent(focusEvent);
            input.selectionStart = input.selectionEnd = 0;
            expect(input.value === '____ ____ ____ ____').toBe(true);
            focusEvent.initEvent('blur');
            input.dispatchEvent(focusEvent);
            expect(input.value === '').toBe(true);
            input.focus();
            setTimeout(
                () => {
                    expect(input.selectionStart === 0 && input.selectionEnd == 0).toEqual(true);
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
        let i: number = 0, j: number = 0, k: number = 0, containerValue = 0;
        let selectEnd: number = 0 , selectStart: number = 0;
        let name: any, maskedvalue: any ,value: any, container: any, event:any;
        let isInteracted: any, isInteraction: any;
        function clickFn(args:MaskChangeEventArgs): void {
            i++;
            value= args.value;
            maskedvalue= args.maskedValue;
            isInteracted=args.isInteracted;
            isInteraction = args.isInteraction;
        }
         function FocusFn(args: MaskFocusEventArgs): void {
            j++;
            selectStart = args.selectionStart;
            selectEnd = args.selectionEnd;
            name = args.name;
            value = args.value;
            event = args.event;
            container =args.container;
            if(args.container.classList.contains('e-input-focus') && (args.container.classList.contains("e-input-group"))) {
             containerValue =1;
            }
        }
        function BlurFn(args: MaskBlurEventArgs): void {
            k = 1;
            name = args.name;
            value = args.value;
            container =args.container;
            if(args.container.classList.contains('e-input-group')) {
                containerValue = 1;
            }   
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
            expect(isInteracted).toEqual(false);
            expect(isInteraction).toEqual(false);
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
            focusEvent.initEvent('focus');
            document.getElementById('mask1').dispatchEvent(focusEvent);
            expect(j).toEqual(1);
            expect(selectStart).toEqual(maskBox.value.length);
            expect(selectEnd).toEqual(maskBox.value.length);
            expect(name).toEqual("focus");
        });
        it('FocusFn event testing with argument value and event', () => {
            maskBox = new MaskedTextBox({
                mask: '9999 9999 9999 9999',
                placeholder: 'Enter card number',
                value: "123",
                change: clickFn,
                focus: FocusFn
            });
            maskBox.appendTo('#mask1');
            focusEvent.initEvent('focus');
            document.getElementById('mask1').dispatchEvent(focusEvent);
            expect(selectStart).toEqual(maskBox.value.length);
            expect(selectEnd).toEqual(maskBox.value.length);
            expect(name).toEqual("focus");
            expect(value).toEqual("123");
            expect(event).not.toBeNull();
            expect(container).not.toBeNull();     
            expect(containerValue).toEqual(1);
        });
        it('BlurFn event testing', () => {
            maskBox = new MaskedTextBox({
                mask: '9999 9999 9999 9999',
                placeholder: 'Enter card number',
                value: "123",
                focus:FocusFn,
                blur: BlurFn
            });
            maskBox.appendTo('#mask1');
            document.getElementById("mask1").focus();
            expect(name).toEqual("focus");
            document.getElementById('mask1').blur();
            expect(k).toEqual(1);
            expect(name).toEqual("blur");
        });
        it('BlurFn event testing with argument event and  value', () => {
            maskBox = new MaskedTextBox({
                mask: '9999 9999 9999 9999',
                placeholder: 'Enter card number',
                value: "123",
                focus:FocusFn,
                blur: BlurFn
            });
            maskBox.appendTo('#mask1');
            document.getElementById("mask1").focus();
            expect(name).toEqual("focus");
            document.getElementById('mask1').blur();
            expect(k).toEqual(1);
            expect(name).toEqual("blur");
            expect(value).toEqual("123");
            expect(event).not.toBeNull();
            expect(container).not.toBeNull();     
            expect(containerValue).toEqual(1);
        });
    });
    describe('MaskedTextBox in HTML5 forms testing:', () => {
        let mask: MaskedTextBox;
        let container: HTMLDivElement;
        let targetElement: HTMLElement;
        let formElement: HTMLFormElement;

        beforeEach(() => {
            container = createElement('div', {
                id: "container"
            }) as HTMLDivElement;

            formElement = createElement('form', {
                id: 'form'
            }) as HTMLFormElement;

            targetElement = createElement('input', {
                id: "mask"
            }) as HTMLElement;

            formElement.appendChild(targetElement);

            container.appendChild(formElement);

            document.body.appendChild(container);
        })

        afterEach(() => {
            mask.destroy();
            mask = null;
            document.getElementById('container').remove();
        })

        it('form reset method should make default MaskedTextBox to go back to it default value', () => {
            mask = new MaskedTextBox({
                value: '123',
                mask: '999'
            });
            mask.appendTo(targetElement);

            mask.value = '321';
            expect((targetElement as any).ej2_instances[0].value).toBe('321');
            formElement.reset();
            expect((targetElement as any).ej2_instances[0].value).toBe('123');
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
});
describe('this.value checking', () => {
    let maskBox: any;
    let i: number = 0, j: number = 0, k: number = 0, containerValue = 0;
    let selectEnd: number = 0 , selectStart: number = 0;
    let name: any, maskedvalue: any ,value: any, container: any, event:any;
    let isInteracted: any, isInteraction: any;
    function clickFn(args:MaskChangeEventArgs): void {
        i++;
        value= this.value;
        maskedvalue= args.maskedValue;
        isInteracted=args.isInteracted;
        isInteraction = args.isInteraction;
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
    it('this.value checking with mask', () => {
        maskBox = new MaskedTextBox({
            mask: '9999 9999 9999 9999',
            placeholder: 'Enter card number',
            value: "123",
            change: clickFn,
        });
        maskBox.appendTo('#mask1');
        maskBox.value = '098';
        maskBox.dataBind();
        expect(value).toEqual("098");
        
    });
    it('this.value checking without mask', () => {
        maskBox = new MaskedTextBox({
            placeholder: 'Enter card number',
            value: "123",
            change: clickFn,
        });
        maskBox.appendTo('#mask1');
        maskBox.value = '098';
        maskBox.dataBind();
        expect(value).toEqual("098");
        
    });
});
describe('Masked Textbox without mask', function () {
    let maskBox: any;
    beforeEach(function () {
        maskBox = undefined;
        let ele: HTMLElement = createElement('input', { id: 'mask1' });
        document.body.appendChild(ele);
    });
    afterEach(function () {
        if (maskBox) {
            maskBox.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Characters equivalence testing', function () {
        maskBox = new MaskedTextBox({});
        maskBox.appendTo('#mask1');
        let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
        input.selectionStart = input.selectionEnd = 0;
        input.value = '1'
        for (let i = 0; i < 100; i++) {
            input.value = input.value + i;
        }
        expect(input.value).toBe('10123456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899');
        expect(maskBox.getMaskedValue()).toBe('10123456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899');
    });
});
describe('Dynamic CssClass testcase', function (){
    let maskBox: any;
    beforeEach(function() {
        let inputElement: HTMLElement = createElement('input', { id: 'maskBox'});
        document.body.appendChild(inputElement);
    });
    afterEach(function() {
        if (maskBox) {
            maskBox.destroy();
            document.body.innerHTML = '';
        }
    });
    it('single css class',function() {
        maskBox = new MaskedTextBox({
            cssClass: 'e-custom'
        });
        maskBox.appendTo('#maskBox');
        expect(maskBox.inputObj.container.classList.contains('e-custom')).toBe(true);
        maskBox.cssClass = 'e-test';
        maskBox.dataBind();
        expect(maskBox.inputObj.container.classList.contains('e-custom')).toBe(false);
        expect(maskBox.inputObj.container.classList.contains('e-test')).toBe(true);
    });
    it('more than one css class',function() {
        maskBox = new MaskedTextBox({
            cssClass: 'e-custom e-secondary'
        });
        maskBox.appendTo('#maskBox');
        expect(maskBox.inputObj.container.classList.contains('e-custom')).toBe(true);
        expect(maskBox.inputObj.container.classList.contains('e-secondary')).toBe(true);
        maskBox.cssClass = 'e-test e-ternary';
        maskBox.dataBind();
        expect(maskBox.inputObj.container.classList.contains('e-custom')).toBe(false);
        expect(maskBox.inputObj.container.classList.contains('e-secondary')).toBe(false);
        expect(maskBox.inputObj.container.classList.contains('e-test')).toBe(true);
        expect(maskBox.inputObj.container.classList.contains('e-ternary')).toBe(true);
    });
});
describe('Width value with unit em', () => {
    let maskBox: any;
    beforeEach((): void => {
        let ele: HTMLElement = createElement('input', { id: 'mask1' });     
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        if (maskBox) {
            maskBox.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Set the width to unit em', () => {
        maskBox = new MaskedTextBox({ mask: "(999) 99-999", width: "30em" });
        maskBox.appendTo('#mask1');
        expect(document.getElementById('mask1').parentElement.style.width === '30em').toEqual(true);
        maskBox.width = "100px";
        maskBox.dataBind();
        expect(document.getElementById('mask1').parentElement.style.width === '100px').toEqual(true);
        maskBox.width = "50em";
        maskBox.dataBind();
        expect(document.getElementById('mask1').parentElement.style.width === '50em').toEqual(true);
        maskBox.width = "60%";
        maskBox.dataBind();
        expect(document.getElementById('mask1').parentElement.style.width === '60%').toEqual(true);
        maskBox.width = "30";
        maskBox.dataBind();
        expect(document.getElementById('mask1').parentElement.style.width === '30px').toEqual(true);
        maskBox.width = 50;
        maskBox.dataBind();
        expect(document.getElementById('mask1').parentElement.style.width === '50px').toEqual(true);
    });
    it('Set the width to unit px', () => {
        maskBox = new MaskedTextBox({ mask: "(999) 99-999", width: "100px" });
        maskBox.appendTo('#mask1');
        expect(document.getElementById('mask1').parentElement.style.width === '100px').toEqual(true);
        maskBox.width = "30em";
        maskBox.dataBind();
        expect(document.getElementById('mask1').parentElement.style.width === '30em').toEqual(true);
        maskBox.width = "50px";
        maskBox.dataBind();
        expect(document.getElementById('mask1').parentElement.style.width === '50px').toEqual(true);
    });
    it('Set the width to unit %', () => {
        maskBox = new MaskedTextBox({ mask: "(999) 99-999", width: "30%" });
        maskBox.appendTo('#mask1');
        expect(document.getElementById('mask1').parentElement.style.width === '30%').toEqual(true);
        maskBox.width = "30em";
        maskBox.dataBind();
        expect(document.getElementById('mask1').parentElement.style.width === '30em').toEqual(true);
    });
});
describe('EJ2-36604 - While giving the class name with empty space for HtmlAttributes, console error is produced.', function () {
    let maskBox: any;
    beforeEach(function () {
        let inputElement: HTMLElement = createElement('input', { id: 'maskbox' });
        document.body.appendChild(inputElement);
    });
    afterEach(function () {
        if (maskBox) {
            maskBox.destroy();
            document.body.innerHTML = '';
        }
    });
    it('Entering the class name without any empty space', function () {
        maskBox = new MaskedTextBox({
            htmlAttributes: { class: 'custom-class' }
        });
        maskBox.appendTo('#maskbox');
        expect(maskBox.inputObj.container.classList.contains('custom-class')).toBe(true);
    });
    it('Giving empty space before and after the class name', function () {
        maskBox = new MaskedTextBox({
            htmlAttributes: { class: ' custom-class ' }
        });
        maskBox.appendTo('#maskbox');
        expect(maskBox.inputObj.container.classList.contains('custom-class')).toBe(true);
    });
    it('Giving more than one empty space between two class names', function () {
        maskBox = new MaskedTextBox({
            htmlAttributes: { class: 'custom-class-one      custom-class-two'}
        });
        maskBox.appendTo('#maskbox');
        expect(maskBox.inputObj.container.classList.contains('custom-class-one')).toBe(true);
        expect(maskBox.inputObj.container.classList.contains('custom-class-two')).toBe(true);
    });
    it('Giving more than one empty space between two class names as well before and after the class name', function () {
        maskBox = new MaskedTextBox({
            htmlAttributes: {  class: ' custom-class-one       custom-class-two ' }
        });
        maskBox.appendTo('#maskbox');
        expect(maskBox.inputObj.container.classList.contains('custom-class-one')).toBe(true);
        expect(maskBox.inputObj.container.classList.contains('custom-class-two')).toBe(true);
    });
    it('Giving only empty space  without entering any class Name', function () {
        maskBox = new MaskedTextBox({
        });
        maskBox.appendTo('#maskbox');
        let beforeAddClass = maskBox.inputObj.container.classList.length;
        maskBox.htmlAttributes = { class: '  ' };
        maskBox.appendTo('#maskbox');
        let AfterAddClass = maskBox.inputObj.container.classList.length;
        expect(beforeAddClass == AfterAddClass).toBe(true);
    });
    it('Keep input as empty without entering any class Name', function () {
        maskBox = new MaskedTextBox({
        });
        maskBox.appendTo('#maskbox');
        let beforeAddClass = maskBox.inputObj.container.classList.length;
        maskBox.htmlAttributes = { class: '' };
        maskBox.appendTo('#maskbox');
        let AfterAddClass = maskBox.inputObj.container.classList.length;
        expect(beforeAddClass == AfterAddClass).toBe(true);
    });

    it('Entering the class name without any empty space', function () {
        maskBox = new MaskedTextBox({
            cssClass: 'custom-class' 
        });
        maskBox.appendTo('#maskbox');
        expect(maskBox.inputObj.container.classList.contains('custom-class')).toBe(true);
    });
    it('Giving empty space before and after the class name', function () {
        maskBox = new MaskedTextBox({
             cssClass: ' custom-class ' 
        });
        maskBox.appendTo('#maskbox');
        expect(maskBox.inputObj.container.classList.contains('custom-class')).toBe(true);
    });
    it('Giving more than one empty space between two class names', function () {
        maskBox = new MaskedTextBox({
             cssClass: 'custom-class-one      custom-class-two'
        });
        maskBox.appendTo('#maskbox');
        expect(maskBox.inputObj.container.classList.contains('custom-class-one')).toBe(true);
        expect(maskBox.inputObj.container.classList.contains('custom-class-two')).toBe(true);
    });
    it('Giving more than one empty space between two class names as well before and after the class name', function () {
        maskBox = new MaskedTextBox({
             cssClass: ' custom-class-one       custom-class-two ' 
        });
        maskBox.appendTo('#maskbox');
        expect(maskBox.inputObj.container.classList.contains('custom-class-one')).toBe(true);
        expect(maskBox.inputObj.container.classList.contains('custom-class-two')).toBe(true);
    });
    it('Giving only empty space  without entering any class Name', function () {
        maskBox = new MaskedTextBox({
        });
        maskBox.appendTo('#maskbox');
        let beforeAddClass = maskBox.inputObj.container.classList.length;
        maskBox.cssClass =  '  ' ;
        maskBox.appendTo('#maskbox');
        let AfterAddClass = maskBox.inputObj.container.classList.length;
        expect(beforeAddClass == AfterAddClass).toBe(true);
    });
    it('Keep input as empty without entering any class Name', function () {
        maskBox = new MaskedTextBox({
        });
        maskBox.appendTo('#maskbox');
        let beforeAddClass = maskBox.inputObj.container.classList.length;
        maskBox.cssClass =  '' ;
        maskBox.appendTo('#maskbox');
        let AfterAddClass = maskBox.inputObj.container.classList.length;
        expect(beforeAddClass == AfterAddClass).toBe(true);
    });
    it('Giving class name with underscore in the beginning', function () {
        maskBox = new MaskedTextBox({
            htmlAttributes : { class : '  _custom-class-one  '},
            cssClass : '   _custom-class-two  '
        });
        maskBox.appendTo('#maskbox');
        expect(maskBox.inputObj.container.classList.contains('_custom-class-one')).toBe(true);
        expect(maskBox.inputObj.container.classList.contains('_custom-class-two')).toBe(true);
    });
    it('Giving class name with empty space in both cases seperatly', function () {
        maskBox = new MaskedTextBox({
            htmlAttributes : { class : '  custom-class-one  '},
            cssClass : '   custom-class-two  '
        });
        maskBox.appendTo('#maskbox');
        expect(maskBox.inputObj.container.classList.contains('custom-class-one')).toBe(true);
        expect(maskBox.inputObj.container.classList.contains('custom-class-two')).toBe(true);
    });   
});
describe('Masked Textbox with bind value', function () {
    let maskBox: any;
    beforeEach(function () {
        let browser: string = "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko";
        Browser.userAgent = browser;
        maskBox = undefined;
        let ele: HTMLElement = createElement('input', { id: 'mask1' });
        document.body.appendChild(ele);
    });
    afterEach(function () {
        if (maskBox) {
            maskBox.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Bind value checking', function () {       
        maskBox = new MaskedTextBox({
            mask: "000000",
            value: "123456"
        });
        maskBox.appendTo('#mask1');
        let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
        expect(input.value).toBe('123456');
    });
});
describe('EJ2-44945- Delete key removes only first digit in the ejs-maskedtextbox', function () {
    let maskBox: any;
    beforeEach(function () {
        let browser: string = "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko";
        Browser.userAgent = browser;
        maskBox = undefined;
        let ele: HTMLElement = createElement('input', { id: 'mask1' });
        document.body.appendChild(ele);
    });
    afterEach(function () {
        if (maskBox) {
            maskBox.destroy();
        }
        document.body.innerHTML = '';
    });
    it('press delete key to remove value', function () {
        maskBox = new MaskedTextBox({
            mask: "000-0000-000",
            value: "1234567890"
        });
        maskBox.appendTo('#mask1');
        let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
        expect(input.value).toBe('123-4567-890');
        input.selectionStart = 2;
        input.selectionEnd = 2;
        let event: any = eventObject('KeyboardEvent', 'keydown');
        event.key = 'Delete';
        event.keyCode = 46;
        EventHandler.trigger(input, 'keydown', event);
        expect(input.value).toBe('12_-4567-890');
        expect(input.selectionStart).toBe(4);
        EventHandler.trigger(input, 'keydown', event);
        expect(input.value).toBe('12_-_567-890');
        expect(input.selectionStart).toBe(5);
    });
    it('select whole value and press delete key to remove all value from the input', function () {
        maskBox = new MaskedTextBox({
            mask: "+1(999)-9999-999",
            value: "1234567890"
        });
        maskBox.appendTo('#mask1');
        let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
        expect(input.value).toBe("+1(123)-4567-890");
        input.selectionStart = 0;
        input.selectionEnd = (input.value).length;
        let event: any = eventObject('KeyboardEvent', 'keydown');
        event.key = 'Delete';
        event.keyCode = 46;
        EventHandler.trigger(input, 'keydown', event);
        expect(input.value).toBe("+1(___)-____-___");
        expect(input.selectionEnd).toBe(0);
    });
    it('select multiple characters from the input with mouse drag action and press delete key to the selected character', function () {
        maskBox = new MaskedTextBox({
            mask: "+1(999)-9999-999",
            value: "1234567890"
        });
        maskBox.appendTo('#mask1');
        let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
        expect(input.value).toBe("+1(123)-4567-890");
        input.selectionStart = 4;
        input.selectionEnd = 9;
        let event: any = eventObject('KeyboardEvent', 'keydown');
        event.key = 'Delete';
        event.keyCode = 46;
        EventHandler.trigger(input, 'keydown', event);
        expect(input.value).toBe("+1(1__)-_567-890");
        expect(input.selectionEnd).toBe(9);
    });
});
describe('EJ2-41360- Masked Textbox focus behavior checking', function () {
    let maskBox: any;
    let isFocus: boolean = false;
    beforeEach(function () {
        maskBox = undefined;
        let ele: HTMLElement = createElement('input', { id: 'mask1' });
        document.body.appendChild(ele);
    });
    afterEach(function () {
        if (maskBox) {
            maskBox.destroy();
        }
        document.body.innerHTML = '';
    });
    it('clicking control to check focus behavior', function () {
        maskBox = new MaskedTextBox({
            mask: "000-0000-000",
            value: "1234567890",
            focus: (args) => {
                isFocus = true;
            }
        });
        maskBox.appendTo('#mask1');
        let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        input.dispatchEvent(clickEvent);
        clickEvent.initEvent('mouseup', true, true);
        input.dispatchEvent(clickEvent);
        maskBox.isClicked = true;
        focusEvent.initEvent('focus', true, true)
        input.dispatchEvent(focusEvent);
        expect(isFocus).toBe(true);
    });
    it('focus the control without value', function (done) {
        maskBox = new MaskedTextBox({
            mask: "000-0000-000",
            placeholder: "Enter a value",
            created: () => {
                isFocus = false;
            },
            focus: (args) => {
                isFocus = true;
            }
        });
        maskBox.appendTo('#mask1');
        let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        input.dispatchEvent(clickEvent);
        clickEvent.initEvent('mouseup', true, true);
        input.dispatchEvent(clickEvent);
        maskBox.isClicked = true;
        focusEvent.initEvent('focus', true, true)
        input.dispatchEvent(focusEvent);
        setTimeout(() => {
            expect(isFocus).toBe(true);
            done();    
        }, 100);
    });
});
describe('EJ2-48023', function () {
    let maskBox: any;
    let isBlurTriggerd: boolean = false;
    beforeEach(function () {
        let ele: HTMLElement = createElement('input', { id: 'mask1' });
        document.body.appendChild(ele);
    });
    afterEach(function () {
        if (maskBox) {
            maskBox.destroy();
        }
        document.body.innerHTML = '';
        isBlurTriggerd = false;
    });
    it('Testing blur event firing while rendering and focus out the control with placeholder', function () {
        maskBox = new MaskedTextBox({
            mask: "000-0000-000",
            placeholder : "Enter phone number",
            blur: (args : any) => {
                isBlurTriggerd = true;
                expect(!isNullOrUndefined(args.event)).toBe(true);
            }
        });
        maskBox.appendTo('#mask1');
        expect(isBlurTriggerd).toBe(false);
        let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
        focusEvent.initEvent('focus');
        input.dispatchEvent(focusEvent);
        focusEvent.initEvent('blur');
        input.dispatchEvent(focusEvent);
        expect(isBlurTriggerd).toBe(true);
        focusEvent.initEvent('focus');
        input.dispatchEvent(focusEvent);
        focusEvent.initEvent('blur');
        input.dispatchEvent(focusEvent);
        expect(isBlurTriggerd).toBe(true);
    });
    it('Testing blur event firing while rendering and focus out the control without placeholder', function () {
        maskBox = new MaskedTextBox({
            mask: "000-0000-000",
            blur: (args : any) => {
                isBlurTriggerd = true;
                expect(!isNullOrUndefined(args.event)).toBe(true);
            }
        });
        maskBox.appendTo('#mask1');
        expect(isBlurTriggerd).toBe(false);
        let input: HTMLInputElement = <HTMLInputElement>document.getElementById('mask1');
        focusEvent.initEvent('focus');
        input.dispatchEvent(focusEvent);
        focusEvent.initEvent('blur');
        input.dispatchEvent(focusEvent);
        expect(isBlurTriggerd).toBe(true);
        focusEvent.initEvent('focus');
        input.dispatchEvent(focusEvent);
        focusEvent.initEvent('blur');
        input.dispatchEvent(focusEvent);
        expect(isBlurTriggerd).toBe(true);
    });
});
