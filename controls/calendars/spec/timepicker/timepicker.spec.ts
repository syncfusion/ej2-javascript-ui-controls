import { TimePicker, ItemEventArgs, PopupEventArgs, TimePickerBase } from '../../src/timepicker/timepicker';
import { Ajax } from '@syncfusion/ej2-base';
import { Component, EventHandler, Property, Event, CreateBuilder, Internationalization, setCulture } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, KeyboardEvents, KeyboardEventArgs, L10n, Browser } from '@syncfusion/ej2-base';
import { cldrData, loadCldr, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';
import { createElement, removeClass, remove, addClass, setStyleAttribute, detach } from '@syncfusion/ej2-base';
import { isNullOrUndefined, merge, getEnumValue, getValue, getUniqueID } from '@syncfusion/ej2-base';
import '../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../common/common.spec';
/**
 * @param  {} 'TimePicker'
 * @param  {} function(
 */
function loadCultureFiles(name: string, base?: boolean): void {
    let files: string[] = !base ?
        ['ca-gregorian.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json'] : ['numberingSystems.json'];
    for (let prop of files) {
        let val: Object;
        let ajax: Ajax;
        if (base) {
            ajax = new Ajax('base/spec/cldr/supplemental/' + prop, 'GET', false);
        } else {
            ajax = new Ajax('base/spec/cldr/main/' + name + '/' + prop, 'GET', false);
        }
        ajax.onSuccess = (value: JSON) => {
            val = value;
        };
        ajax.send();
        loadCldr(JSON.parse(<string>val));
    }
}

function onRender(args: ItemEventArgs): void {
    if (args.text == "12:00 AM") {
        args.element.classList.add('e-disabled');
    }
    if (args.text == "1:30 AM") {
        args.isDisabled = true;
    }
}
function pixel(args: PopupEventArgs): void {
    args.popup.position = { X: '100px', Y: '100px' };
}
function pixelString(args: PopupEventArgs): void {
    args.popup.position = { X: '100', Y: '100' };
}
function pixelNumber(args: PopupEventArgs): void {
    args.popup.position = { X: 100, Y: 100 };
}
function leftTop(args: PopupEventArgs): void {
    args.popup.position = { X: 'left', Y: 'top' };
}
function rightTop(args: PopupEventArgs): void {
    args.popup.position = { X: 'right', Y: 'top' };
}
function centerCenter(args: PopupEventArgs): void {
    args.popup.position = { X: 'center', Y: 'center' };
}
function leftBottom(args: PopupEventArgs): void {
    args.popup.position = { X: 'left', Y: 'bottom' };
}
function rightBottom(args: PopupEventArgs): void {
    args.popup.position = { X: 'right', Y: 'bottom' };
}
let clickEvent: MouseEvent = document.createEvent('MouseEvents');
clickEvent.initEvent('mousedown', true, true);
let e: any = { preventDefault: function () { }, target: null };
L10n.load({
    'en': {
        'timepicker': { placeholder: 'Enter the value' }
    },
    'de': {
        'timepicker': { placeholder: 'Geben Sie den Wert ein' }
    },
    'zh': {
        'timepicker': { placeholder: '輸入值' }
    },
    'vi': {
        'timepicker': { placeholder: 'Chọn thời gian' }
    },
    'ar': {
        'timepicker': { placeholder: 'حدد الوقت' }
    },
    'ar-QA': {
        'timepicker': { placeholder: 'حدد الوقت' }
    },
    'ja': {
        'timepicker': { placeholder: 'Pilih Waktu' }
    }
});
describe('TimePicker', () => {
    let timepicker: TimePicker;
    let timeObj: any;
    let timeObj1: any;
    let timeObj2: any;
    let timeObj3: any;
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('DOM Wrapper Testing without default value', () => {
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(ele);
            timeObj = new TimePicker({ floatLabelType: 'Never', strictMode: true });
            timeObj.appendTo('#timepicker');
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('element class e-timpicker testing', () => {
            expect(timeObj.element.classList.contains('e-timepicker')).toBe(true);
        });
        it('element class e-control testing', () => {
            expect(timeObj.element.classList.contains('e-control')).toBe(true);
        });
        it('element aria-autocomplete testing', () => {
            expect(timeObj.element.getAttribute('aria-autocomplete')).toBe('list');
        });
        it('element aria-owns testing', (done) => {
            expect(timeObj.element.getAttribute('aria-owns')).toBe(timeObj.element.id + '_options');
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            setTimeout(function () {
                expect(timeObj.popupWrapper.getAttribute('id')).toBe(timeObj.element.id + '_popup');
                expect(timeObj.listTag.getAttribute('id')).toBe(timeObj.element.id + '_options');
                done();
            }, 450);
        });
        it('name attribute testing', () => {
            expect(timeObj.element.getAttribute('name')).toBe('timepicker');
        });
        it('wrapper class testing', () => {
            expect(timeObj.inputWrapper.container.classList.contains('e-time-wrapper')).toBe(true);
        });
        it('icon class e-time-icon testing', () => {
            expect(timeObj.inputWrapper.buttons[0].classList.contains('e-time-icon')).toBe(true);
        });
        it('popup button class e-input-group-icon testing', () => {
            expect(timeObj.inputWrapper.buttons[0].classList.contains('e-input-group-icon')).toBe(true);
        });
        it('popup button DOM testing', () => {
            expect(timeObj.inputWrapper.buttons[0].tagName == "SPAN").toBe(true);
        });
        it('wrapper DOM testing', () => {
            expect(timeObj.inputWrapper.container.tagName == "SPAN").toBe(true);
        });
        it('wrapper ARIA disabled attribute testing', () => {
            expect(timeObj.element.getAttribute('aria-disabled')).toEqual('false');
        });
        it('required attribute testing', () => {
            expect(timeObj.element.getAttribute('required')).toEqual(null);
        });
        it('wrapper ARIA-HASPOPUP attribute testing', () => {
            expect(timeObj.element.getAttribute('aria-haspopup')).toEqual('true');
        });
        it('wrapper ARIA expanded attribute testing', () => {
            expect(timeObj.element.getAttribute('aria-expanded')).toEqual('false');
        });
        it('wrapper ARIA expanded attribute popup testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.element.getAttribute('aria-expanded')).toBe('true');
        });
        it('element ARIA placeholder testing', () => {
            expect(timeObj.element.getAttribute('aria-placeholder')).toEqual(null);
        });
        it('element placeholder testing', () => {
            expect(timeObj.element.getAttribute('placeholder')).toEqual(null);
        });
        it('popup element class popup testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.popupWrapper.classList.contains('e-popup')).toBe(true);
        });
        it('popup element class control testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.popupWrapper.classList.contains('e-control')).toBe(true);
        });
        it('popup element class e-timepicker testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.popupWrapper.classList.contains('e-timepicker')).toBe(true);
        });
        it('previous value reset testing', () => {
            timeObj.value = new Date('8/8/2017 10:30');
            timeObj.dataBind();
            timeObj.focusIn();
            timeObj.inputElement.value = '10:30 AMert';
            timeObj.inputBlurHandler();
            expect(timeObj.inputElement.value).toBe('10:30 AM');
            expect(timeObj.getValue(timeObj.value)).toBe('10:30 AM');
        });
        it('popup element id testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.popupWrapper.getAttribute('id')).toBe(timeObj.inputElement.getAttribute('id') + '_popup');
        });
        it('popup element class e-content testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.listWrapper.classList.contains('e-content')).toBe(true);
        });
        it('popup element width testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.inputWrapper.container.style.width).toEqual('100%');
            expect(parseInt(timeObj.popupWrapper.style.width)).toEqual(parseInt(timeObj.inputWrapper.container.getBoundingClientRect().width));

        });
        it('popup SPAN element testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.listWrapper.tagName == "DIV").toBe(true);
        });
        it('popup SPAN element class e-content testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.listWrapper.classList.contains('e-content')).toBe(true);
        });
        it('popup SPAN element attribute tabindex testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.listWrapper.getAttribute('tabindex')).toBe('0');
        });
        it('popup UL element class e-list-parent testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.listTag.classList.contains('e-list-parent')).toBe(true);
        });
        it('popup UL element class ul testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.listTag.classList.contains('e-ul')).toBe(true);
        });
        it('popup UL element ARIA role testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.listTag.getAttribute('role')).toEqual('listbox');
        });
        it('popup li element ARIA role testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect((<HTMLElement>timeObj.listWrapper.querySelector('li')).getAttribute('role')).toEqual('option');
        });
        it('popup li element class testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect((<HTMLElement>timeObj.listWrapper.querySelector('li')).classList.contains('e-list-item')).toBe(true);
        });
        it('wrapper focus on popup open time testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
        });
        it('popup opened state display style attribute', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.popupWrapper.style.display).toEqual('');
        });
        it('open popup by clicking the button element', (done) => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            setTimeout(function () {
                expect(timeObj.isPopupOpen()).toBe(true);
                done();
            }, 450);
        });
        it('popup element selection testing', () => {
            let element: HTMLElement;
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            element = <HTMLElement>timeObj.popupWrapper.querySelectorAll('.e-list-item')[0];
            (element).click();
            expect(element.classList.contains('e-active')).toBe(true);
        });
        it('popup height testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.popupWrapper.style.maxHeight).toEqual('240px');
        });
        it('popup open and close testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            if (timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
        });
        it('getPersistData method ', () => {
            let stringItems: any = timeObj.getPersistData();
            expect(stringItems.search('value')).toBe(2);
        });
    });
    describe('DOM Wrapper Testing with default value ', () => {
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepicker1' });
            document.body.appendChild(ele);
            timeObj = new TimePicker({ value: new Date("12/12/2016 10:00 AM"), cssClass: 'e-custom', strictMode: true });
            timeObj.appendTo('#timepicker1');
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('value testing in input box', () => {
            expect(timeObj.getText()).toEqual(timeObj.element.value);
            TimePickerBase.createListItems(timeObj.createElement, new Date('12/12/2016 10:00 AM'), new Date('12/12/2016 10:00 PM'), timeObj.globalize, timeObj.cldrTimeFormat(), timeObj.step);
        });
        it('cssClass testing', (done) => {
            expect(timeObj.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            setTimeout(function () {
                expect(timeObj.popupWrapper.classList.contains('e-custom')).toBe(true);
                done();
            }, 450);
        });
        it('wrapper ARIA-ACTIVEDESCENDANT testing', (done) => {
            expect(timeObj.element.getAttribute('aria-activedescendant')).toEqual('null');
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            setTimeout(function () {
                expect(timeObj.isPopupOpen()).toBe(true);
                timeObj.setActiveClass();
                let element: HTMLElement = timeObj.selectedElement;
                expect(timeObj.element.getAttribute('aria-activedescendant')).toBe(element.getAttribute('id'));
                done();
            }, 450);
        });
        it('popup active class element value equal to model value testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.popupWrapper.querySelectorAll('.e-active')[0].getAttribute('data-value')).toEqual(timeObj.element.value);
        });
        it('popup active element ARIA-SELECTED testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.popupWrapper.querySelectorAll('.e-active')[0].getAttribute('aria-selected')).toEqual('true');
        });
        it('step value 30 testing ', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.popupWrapper.querySelectorAll('.e-list-item')[1].getAttribute('data-value')).toEqual("12:30 AM");
        });
        it('readonly testing', () => {
            expect(timeObj.element.getAttribute('readonly')).toEqual(null);
        });
        it('Set hover testing ', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            let li: Element = <HTMLLIElement>timeObj.popupWrapper.querySelectorAll('li')[3];
            timeObj.setHover(li, 'e-hover');
            expect(timeObj.popupWrapper.querySelectorAll('li')[3].classList.contains('e-hover')).toBe(true);
        });
        it('Set hover to new element testing ', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            let li: Element = <HTMLLIElement>timeObj.popupWrapper.querySelectorAll('li')[3];
            timeObj.setHover(li, 'e-hover');
            let newLi: Element = <HTMLLIElement>timeObj.popupWrapper.querySelectorAll('li')[4];
            timeObj.setHover(newLi, 'e-hover');
            expect(timeObj.popupWrapper.querySelectorAll('li')[3].classList.contains('e-hover')).toBe(false);
            expect(timeObj.popupWrapper.querySelectorAll('li')[4].classList.contains('e-hover')).toBe(true);
        });
        it('select the value using mouse click testing ', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            let li: Element = <HTMLLIElement>timeObj.popupWrapper.querySelectorAll('li')[0];
            (<HTMLLIElement>li).click();
            expect(li.classList.contains('e-active')).toBe(true);
        });
        it('mouse hover testing', () => {
            timeObj.show();
            let li: Element[] = timeObj.popupWrapper.querySelectorAll('li');
            mouseEventArgs.target = li[0];
            expect((li[0] as Element).classList.contains('e-hover')).toBe(false);
            timeObj.onMouseOver(mouseEventArgs);
            expect((li[0] as Element).classList.contains('e-hover')).toBe(true);
        });
        it('mouse leave testing', () => {
            timeObj.show();
            let li: Element[] = timeObj.popupWrapper.querySelectorAll('li');
            mouseEventArgs.target = li[0];
            expect((li[0] as Element).classList.contains('e-hover')).toBe(false);
            timeObj.onMouseOver(mouseEventArgs);
            expect((li[0] as Element).classList.contains('e-hover')).toBe(true);
            timeObj.onMouseLeave(mouseEventArgs);
            expect((li[0] as Element).classList.contains('e-hover')).toBe(false);
        });
        it('mouse click on disabled input', () => {
            timeObj.enabled = false;
            timeObj.dataBind();
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.isPopupOpen()).toBe(false);
        });
        it('timeformat value', () => {
            timeObj.format = 'HH:mm \'tt\'';
            timeObj.dataBind();
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.getText()).toBe('10:00 tt');
        });
        it('timeformat value with minutes', () => {
            timeObj.format = 'mm';
            timeObj.dataBind();
            expect(timeObj.getText()).toBe('00');
            expect((timeObj.value).getHours()).toBe(10);
            expect((timeObj.value).getMinutes()).toBe(0);
            timeObj.value = new Date('2/2/2017 10:30');
            timeObj.dataBind();
            expect(timeObj.getText()).toBe('30');
            expect((timeObj.value).getHours()).toBe(10);
            expect((timeObj.value).getMinutes()).toBe(30);
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
        });
        it('timeformat value as skeleton object while Creation', () => {
            timeObj.destroy();
            timeObj = new TimePicker({ value: new Date('2/2/2017 10:30'),format : {skeleton:'medium'}, strictMode: true });
            timeObj.appendTo('#timepicker1');
            expect(timeObj.getText()).toBe('10:30:00 AM');
            expect((timeObj.value).getHours()).toBe(10);
            expect((timeObj.value).getMinutes()).toBe(30);
        });
        it('timeformat value as skeleton object', () => {
            timeObj.format = {skeleton:'ms'};
            timeObj.dataBind();
            expect(timeObj.getText()).toBe('00:00');
            expect((timeObj.value).getHours()).toBe(10);
            expect((timeObj.value).getMinutes()).toBe(0);
            expect((timeObj.value).getSeconds()).toBe(0);
            timeObj.value = new Date('2/2/2017 10:30');
            timeObj.format = {skeleton:'Hm'};
            timeObj.dataBind();
            expect(timeObj.getText()).toBe('10:30');
            expect((timeObj.value).getHours()).toBe(10);
            expect((timeObj.value).getMinutes()).toBe(30);
            timeObj.format = {skeleton:'medium'};
            timeObj.dataBind();
            expect(timeObj.getText()).toBe('10:30:00 AM');
            expect((timeObj.value).getHours()).toBe(10);
            expect((timeObj.value).getMinutes()).toBe(30);
        });
    });
    describe('DOM Wrapper Testing with min & max value', () => {
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepicker2' });
            document.body.appendChild(ele);
            timeObj = new TimePicker({ min: new Date("12/12/2016 10:00"), max: new Date("12/12/2016 14:00"), step: 15, value: new Date("12/12/2016 11:00"), strictMode: true });
            timeObj.appendTo('#timepicker2');
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('popup first element value start with min value', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            let liVal: string = timeObj.popupWrapper.querySelector('.e-list-item').getAttribute('data-value');
            expect(timeObj.globalize.formatDate(timeObj.createDateObj(timeObj.min), { format: timeObj.cldrTimeFormat(), type: 'time' })).toEqual(liVal);
        });
        it('value exceeds the max value testing', () => {
            timeObj = new TimePicker({ min: new Date("12/12/2016 10:00"), max: new Date("12/12/2016 14:00"), step: 15, value: new Date("12/12/2016 15:00"), strictMode: true });
            timeObj.appendTo('#timepicker2');
            expect(timeObj.getValue(timeObj.value)).toEqual(timeObj.getValue(timeObj.max));
        });
        it('min value as empty testing', () => {
            timeObj = new TimePicker({ min: null, max: new Date("12/12/2016 14:00"), step: 15, value: new Date("12/12/2016 15:00"), strictMode: true });
            timeObj.appendTo('#timepicker2');
            expect(timeObj.getValue(timeObj.initMin)).toEqual('12:00 AM');
            expect(timeObj.getValue(timeObj.min)).toEqual(null);
        });
        it('disable time icon testing', () => {
            timeObj = new TimePicker({ min: new Date("12/12/2016 16:00"), max: new Date("12/12/2016 14:00"), value: null });
            timeObj.appendTo('#timepicker2');
            expect(timeObj.inputWrapper.buttons[0].classList.contains('e-disabled')).toBe(true);
        });
        it('max value as empty testing', () => {
            timeObj = new TimePicker({ max: null, min: new Date("12/12/2016 2:00"), step: 15, value: new Date("12/12/2016 15:00"), strictMode: true });
            timeObj.appendTo('#timepicker2');
            expect(timeObj.getValue(timeObj.initMax)).toEqual('11:59 PM');
            expect(timeObj.getValue(timeObj.max)).toEqual(null);
        });
        it('max value equal to min value testing', () => {
            timeObj = new TimePicker({ strictMode: true, max: new Date("12/12/2016 2:00"), min: new Date("12/12/2016 2:00"), value: new Date('12/12/2016 5:00') });
            timeObj.appendTo('#timepicker2');
            expect(timeObj.getValue(timeObj.max)).toEqual('2:00 AM');
            expect(timeObj.getValue(timeObj.min)).toEqual('2:00 AM');
        });
        it('worst case number value testing', () => {
            timeObj.strictMode = false;
            timeObj.dataBind();
            timeObj.appendTo('#timepicker2');
            timeObj.focusIn();
            timeObj.inputElement.value = '12334234';
            timeObj.inputBlurHandler();
            expect(timeObj.getText()).toEqual('');
            expect(timeObj.inputElement.value).toEqual('12334234');
            expect(timeObj.value).toEqual(null);
        });
        it('worst case empty value testing', () => {
            timeObj = new TimePicker({ strictMode: false });
            timeObj.appendTo('#timepicker2');
            timeObj.focusIn();
            timeObj.inputElement.value = ' ';
            timeObj.inputBlurHandler();
            expect(timeObj.getText()).toEqual('');
            expect(timeObj.value).toEqual(null);
        });
        it('max value is less then min value testing', () => {
            timeObj = new TimePicker({ max: new Date("12/12/2016 6:00"), min: new Date("12/12/2016 8:00"), step: 15, value: new Date("12/12/2016 15:00"), strictMode: true });
            timeObj.appendTo('#timepicker2');
            expect(timeObj.getValue(timeObj.max)).toEqual('6:00 AM');
            expect(timeObj.getValue(timeObj.value)).toEqual('6:00 AM');
            expect(timeObj.getText()).toEqual('6:00 AM');
        });
        it('value less than the min value testing', () => {
            timeObj = new TimePicker({ min: new Date("12/12/2016 10:00"), max: new Date("12/12/2016 14:00"), step: 15, value: new Date("12/12/2016 8:00"), strictMode: true });
            timeObj.appendTo('#timepicker2');
            expect(timeObj.getText()).toEqual(timeObj.getValue(timeObj.min));
        });
        it('Error Class for start value before 1905-Chrome testing',()=>{
            timeObj = new TimePicker({ min: new Date("1/1/1900 12:00 AM")});
            timeObj.appendTo('#timepicker2');
            timeObj.inputElement.value = '12:00 AM';
            timeObj.dataBind();
            timeObj.inputBlurHandler();
            expect((<HTMLElement>document.getElementsByClassName('e-time-wrapper')[0]).classList.contains('e-error')).toBe(false);
            expect(timeObj.getValue(timeObj.value)).toEqual('12:00 AM');
            expect(timeObj.getText()).toEqual('12:00 AM');
        });
        it('popup last element value end with max value', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            let liVal: string = timeObj.popupWrapper.querySelectorAll('.e-list-item')[timeObj.popupWrapper.querySelectorAll('.e-list-item').length - 1].getAttribute('data-value');
            expect(timeObj.globalize.formatDate(timeObj.createDateObj(timeObj.max), { format: timeObj.cldrTimeFormat(), type: 'time' })).toEqual('2:00 PM');
        });
        it('max value testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            let liVal: string = timeObj.popupWrapper.querySelectorAll('.e-list-item')[timeObj.popupWrapper.querySelectorAll('.e-list-item').length - 1].getAttribute('data-value');
            expect(liVal).toEqual('2:00 PM');
        });
        it('step value 15 testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.popupWrapper.querySelectorAll('.e-list-item')[1].getAttribute('data-value')).toEqual("10:15 AM");
        });
        it('max value less than min value  set model testing', () => {
            timeObj.value = new Date("12/12/2016 9:00");
            timeObj.dataBind();
            expect(timeObj.getText()).toEqual('10:00 AM');
            timeObj.max = new Date("12/12/2016 8:00");
            timeObj.dataBind();
            expect(timeObj.getValue(timeObj.max)).toEqual('8:00 AM');
            expect(timeObj.getText()).toEqual('8:00 AM');
            expect(timeObj.getValue(timeObj.value)).toEqual('8:00 AM');
        });
        it('max & min value as same set model testing', () => {
            timeObj.max = new Date("12/12/2016 10:00");
            timeObj.dataBind();
            expect(timeObj.getValue(timeObj.max)).toEqual('10:00 AM');
            expect(timeObj.getText()).toEqual('10:00 AM');
        });
        it('max & value is less than min value testing', () => {
            timeObj = new TimePicker({ min: new Date("12/12/2016 20:00"), max: new Date("12/12/2016 14:00"), step: 15, value: new Date("12/12/2016 8:00"), strictMode: true });
            timeObj.appendTo('#timepicker2');
            expect(timeObj.getValue(timeObj.max)).toEqual('2:00 PM');
            expect(timeObj.getValue(timeObj.value)).toEqual('2:00 PM');
            expect(timeObj.getText()).toEqual('2:00 PM');
        });
        it('element ARIA placeholder testing', () => {
            timeObj = new TimePicker({ placeholder: 'Select Time', floatLabelType: 'Never' });
            timeObj.appendTo('#timepicker2');
            expect(timeObj.element.getAttribute('aria-placeholder')).toEqual('Select Time');
        });
        it('element placeholder testing', () => {
            timeObj = new TimePicker({ placeholder: 'Select Time', floatLabelType: 'Never' });
            timeObj.appendTo('#timepicker2');
            expect(timeObj.element.getAttribute('placeholder')).toEqual('Select Time');
        });
        it('Element created with floatLabelType property with Auto type', () => {
            timeObj = new TimePicker({ placeholder: 'Select Time', floatLabelType: 'Auto' });
            timeObj.appendTo('#timepicker2');
            expect(timeObj.floatLabelType).toBe('Auto');
            expect(timeObj.inputWrapper.container.tagName == 'DIV').toBe(true);
            expect(timeObj.inputWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(timeObj.inputWrapper.container.children[1].classList.contains('e-float-line')).toBe(true);
            expect(timeObj.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(true);
            expect(timeObj.inputWrapper.container.children[2].classList.contains('e-label-bottom')).toBe(true);
            expect(timeObj.inputWrapper.container.children[2].innerText).toBe('Select Time');
            timeObj.value = new Date('04/16/2018 10:30 AM');
            timeObj.dataBind();
            expect(timeObj.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
        });
        it('Element created with floatLabelType property with Always type', () => {
            timeObj = new TimePicker({ placeholder: 'Select Time', floatLabelType: 'Always' });
            timeObj.appendTo('#timepicker2');
            expect(timeObj.floatLabelType).toBe('Always');
            expect(timeObj.inputWrapper.container.tagName == 'DIV').toBe(true);
            expect(timeObj.inputWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(timeObj.inputWrapper.container.children[1].classList.contains('e-float-line')).toBe(true);
            expect(timeObj.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(true);
            expect(timeObj.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
            expect(timeObj.inputWrapper.container.children[2].innerText).toBe('Select Time');
            timeObj.value = new Date('04/16/2018 10:30 AM');
            timeObj.dataBind();
            expect(timeObj.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
        });
        it('Element created with floatLabelType property with Never type', () => {
            timeObj = new TimePicker({ placeholder: 'Select Time', floatLabelType: 'Never' });
            timeObj.appendTo('#timepicker2');
            expect(timeObj.floatLabelType).toBe('Never');
            expect(timeObj.inputWrapper.container.tagName == 'SPAN').toBe(true);
            expect(timeObj.inputWrapper.container.classList.contains('e-float-input')).toBe(false);
            expect(timeObj.inputElement.getAttribute('placeholder')).toBe('Select Time');
            expect(timeObj.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(false);
        });
        it('autocorrect attribute test case', () => {
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker2');
            expect(timeObj.element.getAttribute('autocorrect') == 'off').toBe(true);
        });
        it('autocapitalize attribute test case', () => {
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker2');
            expect(timeObj.element.getAttribute('autocapitalize') == 'off').toBe(true);
        });
        it('spellcheck attribute test case', () => {
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker2');
            expect(timeObj.element.getAttribute('spellcheck') == 'false').toBe(true);
        });
        it('autocomplete attribute test case', () => {
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker2');
            expect(timeObj.element.getAttribute('autocomplete') == 'off').toBe(true);
        });
    });
    describe('DOM Wrapper Testing with basic properites', () => {
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepicker3' });
            document.body.appendChild(ele);
            timeObj = new TimePicker({ readonly: true, enabled: false, placeholder: "select value", floatLabelType: 'Never', strictMode: true });
            timeObj.appendTo('#timepicker3');
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('readonly testing', () => {
            expect(timeObj.element.getAttribute('readonly')).toEqual('');
        });
        it('enabled false DISABLED attribute testing', () => {
            expect(timeObj.element.getAttribute('disabled')).toEqual('disabled');
        });
        it('enabled false input element ARIA-DISABELD testing', () => {
            expect(timeObj.element.getAttribute('aria-disabled')).toEqual('true');
        });
        it('placeholder ARIA-PLACEHOLDER testing', () => {
            expect(timeObj.element.getAttribute('aria-placeholder')).toEqual(timeObj.placeholder);
        });
        it('placeholder attribute testing', () => {
            expect(timeObj.element.getAttribute('placeholder')).toEqual(timeObj.placeholder);
        });
        it('tab index of focus element in disable state ', () => {
            expect(timeObj.inputWrapper.container.children[0].tabIndex === -1).toBe(true);
            timeObj.enabled = true;
            timeObj.dataBind();
        });
    });
    describe('DOM Wrapper Testing FloatLabel properites', () => {
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepicker30' });
            document.body.appendChild(ele);
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker30');
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('placeholder ARIA-PLACEHOLDER testing', () => {
            expect(timeObj.element.getAttribute('aria-placeholder')).toEqual(null);
        });
        it('placeholder attribute testing', () => {
            expect(timeObj.element.getAttribute('placeholder')).toEqual(null);
        });
         /**
         * tabIndex
         */
        it('tab index of focus element', () => {
            expect(timeObj.inputWrapper.container.children[0].getAttribute('tabindex') === '0').toBe(true);
        });
        it('while give tab index to the timepicker element', () => {
            timeObj.element.tabIndex = '4';
            expect(timeObj.inputWrapper.container.children[0].getAttribute('tabindex') === '4').toBe(true);
        });
    });
    describe('tab index testing', () => {
        beforeEach(() => {
            /*no code */
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Tab index checking while destroy the component', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker', attrs: { "tabindex": "1" } });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({});
            timepicker.appendTo('#timepicker');
            timepicker.destroy();
            expect(inputEle.getAttribute('tabindex') === '1').toBe(true);
            timepicker = null;
        });
        it('Tab index checking while destroy the Angular component', () => {
            let element: any = createElement('ejs-timepicker', { id: 'time' });
            element.setAttribute('tabindex', '1');
            document.body.appendChild(element);
            timepicker = new TimePicker();
            timepicker.appendTo(element);
            timepicker.destroy();
            expect(element.getAttribute('tabindex') === null).toBe(true);
            timepicker = null;
        });
    });
    describe('DOM Wrapper Testing enableRtl properites', () => {
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepicker4' });
            document.body.appendChild(ele);
            timeObj = new TimePicker({ enableRtl: true });
            timeObj.appendTo('#timepicker4');
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('enableRtl wrapper class testing', () => {
            expect(timeObj.inputWrapper.container.classList.contains('e-rtl')).toBe(true);
        });
        it('enableRtl popup class testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.popupWrapper.classList.contains('e-rtl')).toBe(true);
        });
        it('enableRtl popup class testing with setModel', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            timeObj.enableRtl = false;
            timeObj.dataBind();
            expect(timeObj.popupWrapper.classList.contains('e-rtl')).toBe(false);
        });
    });
    describe('Public method testing', () => {
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepicker5' });
            document.body.appendChild(ele);
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker5');
        });
        afterEach(() => {
            if (timeObj) {
                timeObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('show popup testing', () => {
            timeObj.show();
            expect(timeObj.isPopupOpen()).toBe(true);
            expect(timeObj.element.parentElement.classList.contains('e-input-focus')).toBe(true);
        });
        it('focus in testing', () => {
            timeObj.focusIn();
            expect(document.activeElement).toBe(timeObj.inputElement);
        });
        it('focus out testing', () => {
            timeObj.inputElement.focus();
            timeObj.focusOut();
            expect(document.activeElement === timeObj.inputElement).toBe(false);
        });
        it('show popup testing in opened state', (done) => {
            timeObj.show();
            timeObj.show();
            setTimeout(function () {
                expect(timeObj.isPopupOpen()).toBe(true);
                done();
            }, 450);
        });
        it('hide popup testing', (done) => {
            timeObj.hide();
            setTimeout(function () {
                expect(timeObj.isPopupOpen()).toBe(false);
                done();
            }, 450);
        });
        it('scrollTo intermediate value testing', (done) => {
            timeObj.scrollTo = new Date("11/11/2011 2:00 PM");
            timeObj.dataBind();
            timeObj.show();
            setTimeout(function () {
                expect(timeObj.popupWrapper.scrollTop).toBe(0);
                done();
            }, 450);
        });
        it('scrollTo initial value testing', (done) => {
            timeObj.scrollTo = new Date("11/11/2011 12:00 AM");
            timeObj.dataBind();
            timeObj.show();
            setTimeout(function () {
                expect(timeObj.popupWrapper.scrollTop).toBe(0);
                done();
            }, 450);
        });
        it('scrollTo last value testing', (done) => {
            timeObj.scrollTo = new Date("11/11/2011 11:00 AM");
            timeObj.dataBind();
            timeObj.show();
            setTimeout(function () {
                expect(timeObj.popupWrapper.scrollTop).toBe(0);
                done();
            }, 450);
        });
        it('scrollTo false testing', (done) => {
            timeObj.scrollTo = null;
            timeObj.dataBind();
            timeObj.show();
            setTimeout(function () {
                expect(timeObj.popupWrapper.scrollTop).toBe(0);
                done();
            }, 450);
        });
        it('scrollTo invalid date testing', () => {
            timeObj.scrollTo = new Date('');
            timeObj.dataBind();
            expect(timeObj.scrollTo).toBe(null);
        });
        it('getText testing', () => {
            expect(timeObj.getText()).toEqual('');
        });
        it('destroy testing', () => {
            timeObj.destroy();
            expect((document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')).length).toBe(0);
            timeObj = null;
        });
        it('destroy with popup wrapper testing', (done) => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            timeObj.destroy();
            setTimeout(function () {
                expect(isNullOrUndefined(timeObj.popupWrapper)).toBe(true);
                timeObj = null;
                done();
            }, 450);
        });
    });
    describe('Internal method testing', () => {
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepicker9' });
            document.body.appendChild(ele);
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker9');
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('get Date Object testing', () => {
            expect(timeObj.getDateObject('12:00 AMt', 'value')).toBe(null);
        });
        it('get formated value testing', () => {
            expect(timeObj.getFormattedValue(new Date('12/12/2016 10:00 AM'))).toBe('10:00:00 AM');
        });
        it('get current date testing', () => {
            let date: Date = timeObj.setCurrentDate(new Date('12/12/2016 10:00 AM'));
            let current: Date = new Date();
            expect(date.getDate()).toBe(current.getDate());
            expect(date.getMonth()).toBe(current.getMonth());
            expect(date.getFullYear()).toBe(current.getFullYear());
        });
        it('get meridian text testing', () => {
            expect(timeObj.getMeridianText().am).toBe('AM');
            expect(timeObj.getMeridianText().pm).toBe('PM');
            expect(timeObj.getTextFormat()).toBe(0);
        });
        it('get time section position testing', () => {
            loadCultureFiles('zh');
            timeObj.locale = 'zh';
            timeObj.dataBind();
            expect(timeObj.getMeridianText().am).toBe('上午');
            expect(timeObj.getMeridianText().pm).toBe('下午');
            expect(timeObj.getTextFormat()).toBe(1);
        });
        it('date value with custom format testing', () => {
            timeObj.value = new Date('12/12/2016 10:00 AM');
            timeObj.dataBind();
            loadCultureFiles('zh');
            timeObj.locale = 'zh';
            timeObj.dataBind();
            timeObj.format = 'HH mm \'t\'';
            timeObj.dataBind();
            expect(timeObj.element.value).toBe('10 00 t');
        });
    });
    describe('Set model testing', () => {
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepicker5' });
            document.body.appendChild(ele);
            timeObj = new TimePicker({ floatLabelType: 'Never' });
            timeObj.appendTo('#timepicker5');
        });
        afterEach(() => {
            if (timeObj) {
                timeObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('floatLabelType testing', () => {
            timeObj.floatLabelType = 'Auto';
            timeObj.dataBind();
            expect(timeObj.floatLabelType).toBe('Auto');
        });
        it('enableRtl testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            timeObj.enableRtl = true;
            timeObj.dataBind();
            expect(timeObj.inputWrapper.container.classList.contains('e-rtl')).toBe(true);
            expect(timeObj.popupWrapper.classList.contains('e-rtl')).toBe(true);
        });
        it('cssClass testing', () => {
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            timeObj.cssClass = 'e-custom-class';
            timeObj.dataBind();
            expect(timeObj.inputWrapper.container.classList.contains(timeObj.cssClass)).toBe(true);
            expect(timeObj.popupWrapper.classList.contains(timeObj.cssClass)).toBe(true);
            timeObj.cssClass = "e-ternary e-cssClass";
            timeObj.dataBind();
            expect(timeObj.inputWrapper.container.classList.contains('e-ternary')).toBe(true);
            expect(timeObj.inputWrapper.container.classList.contains('e-cssClass')).toBe(true);
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj.popupWrapper.classList.contains('e-ternary')).toBe(true);
            expect(timeObj.popupWrapper.classList.contains('e-cssClass')).toBe(true);

        });

        it('placeholder testing', () => {
            timeObj.placeholder = 'select';
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('placeholder')).toBe(timeObj.placeholder);
            expect(timeObj.element.getAttribute('aria-placeholder')).toBe(timeObj.placeholder);
        });
        it('min testing', () => {
            timeObj.min = new Date("12/12/2016 10:00 AM");
            timeObj.dataBind();
            expect(timeObj.getValue(timeObj.min)).toBe('10:00 AM');
        });
        it('max testing', () => {
            timeObj.max = new Date("12/12/2016 6:00 PM");
            timeObj.dataBind();
            expect(timeObj.getValue(timeObj.max)).toBe('6:00 PM');
        });
        it('value testing', () => {
            timeObj.value = "12/12/2016 6:00 PM";
            timeObj.dataBind();
            expect(timeObj.getValue(timeObj.value)).toBe('6:00 PM');
        });
        it('width testing with 200px value', () => {
            timeObj.width = '200px';
            timeObj.dataBind();
            expect(timeObj.inputWrapper.container.style.width).toBe('200px');
        });
        it('width testing with 20em value', () => {
            timeObj.width = '20em';
            timeObj.dataBind();
            expect(timeObj.inputWrapper.container.style.width).toBe('20em');
        });
        it('width testing with empty value', () => {
            timeObj.width = '200';
            timeObj.dataBind();
            expect(timeObj.inputWrapper.container.style.width).toBe('200px');
        });
        it('width testing with 100% value', () => {
            timeObj.width = '100%';
            timeObj.dataBind();
            expect(timeObj.inputWrapper.container.style.width).toBe('100%');
        });
        it('width testing with 100 value', () => {
            timeObj.width = 100;
            timeObj.dataBind();
            expect(timeObj.inputWrapper.container.style.width).toBe('100px');
        });
        it('readonly testing', () => {
            timeObj.readonly = true;
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('readonly')).toBe('');
        });
        it('enabled false testing', () => {
            timeObj.enabled = false;
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('disabled')).toBe('disabled');
            expect(timeObj.element.getAttribute('aria-disabled')).toBe('true');
        });
        it('enabled true testing', () => {
            timeObj.enabled = false;
            timeObj.enabled = true;
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('disabled')).toBe(null);
            expect(timeObj.element.getAttribute('aria-disabled')).toBe('false');
        });
        it('strict Mode false testing', () => {
            timeObj.max = new Date("12/12/2016 6:00 PM");
            timeObj.value = new Date("12/12/2016 7:00 PM");
            timeObj.dataBind();
            expect(+timeObj.value).toBe(+new Date("12/12/2016 7:00 PM"));
            expect(timeObj.strictMode).toBe(false);
            expect(timeObj.inputElement.value).toBe('7:00 PM');
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('strict Mode true after false testing', () => {
            timeObj.max = new Date("12/12/2016 6:00 PM");
            timeObj.value = new Date("12/12/2016 7:00 PM");
            timeObj.dataBind();
            expect(+timeObj.value).toBe(+new Date("12/12/2016 7:00 PM"));
            expect(timeObj.strictMode).toBe(false);
            expect(timeObj.inputElement.value).toBe('7:00 PM');
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
            timeObj.strictMode = true;
            timeObj.dataBind();
            expect(timeObj.getValue(timeObj.value)).toBe('6:00 PM');
            expect(timeObj.strictMode).toBe(true);
            expect(timeObj.inputElement.value).toBe('6:00 PM');
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
        });
        it('locale testing', () => {
            loadCultureFiles('zh');
            timeObj.locale = 'zh';
            timeObj.dataBind();
            expect(timeObj.globalize.culture).toBe('zh');
        });
    });
    describe('Localization testing', () => {
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepicker6' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('english culture initial time testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 5:00") });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.cldrDateFormat()).toEqual('M/d/yy');
            expect(timeObj.cldrTimeFormat()).toEqual('h:mm a');
            expect(timeObj.getText()).toEqual('5:00 AM');
            expect((<HTMLInputElement>timeObj.element).value).toEqual('5:00 AM');
        });
        it('Chinese culture (zh-CN) initial time testing', () => {
            loadCultureFiles('zh');
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00"), locale: 'zh' });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.cldrDateFormat()).toEqual('y/M/d');
            expect(timeObj.cldrTimeFormat()).toEqual('ah:mm');
            expect(timeObj.getText()).toEqual('下午2:00');
            expect((<HTMLInputElement>timeObj.element).value).toEqual('下午2:00');
        });
        it('Chinese culture (zh-CN) testing', () => {
            loadCultureFiles('zh');
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00"), locale: 'zh' });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.locale).toBe('zh');
            expect((<HTMLInputElement>timeObj.element).value).toEqual('下午2:00');
        });
        it('Chinese culture (zh-CN) with initial value testing', () => {
            loadCultureFiles('zh');
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00"), locale: 'zh' });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.locale).toBe('zh');
            timeObj.value = new Date("12/12/2016 17:00");
            timeObj.dataBind();
            expect(timeObj.getText()).toBe('下午5:00');
            expect(timeObj.cldrDateFormat()).toEqual('y/M/d');
            expect(timeObj.cldrTimeFormat()).toEqual('ah:mm');
        });
        it('German culture (de-DE) testing', () => {
            loadCultureFiles('de');
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00"), locale: 'de', format: 'HH:mm \'tt\'' });
            timeObj.appendTo('#timepicker6');
            timeObj.value = new Date("12/12/2016 15:00");
            timeObj.dataBind();
            expect(timeObj.locale).toBe('de');
            expect(timeObj.getText()).toBe('15:00 tt');
            // expect(timeObj.getSeparator()).toBe(':');
            expect(timeObj.cldrDateFormat()).toEqual('dd.MM.yy');
            expect(timeObj.cldrTimeFormat()).toEqual('HH:mm \'tt\'');
        });
        it('Vietnamese culture (vi) testing', () => {
            loadCultureFiles('vi');
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00"), locale: 'vi' });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.locale).toBe('vi');
            expect(timeObj.getText()).toBe('14:00');
            expect(timeObj.cldrDateFormat()).toEqual('dd/MM/y');
            expect(timeObj.cldrTimeFormat()).toEqual('HH:mm');
        });
        it('Jakarta culture (ja) testing', () => {
            loadCultureFiles('ja');
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00"), locale: 'ja' });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.locale).toBe('ja');
            expect(timeObj.getText()).toBe('14:00');
            expect(timeObj.cldrDateFormat()).toEqual('y/MM/dd');
            expect(timeObj.cldrTimeFormat()).toEqual('H:mm');
        });
        it('Arabian culture (ar) testing', () => {
            loadCultureFiles('ar', true);
            loadCultureFiles('ar');
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00"), locale: 'ar' });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.locale).toBe('ar');
            expect(timeObj.getText()).toBe('٢:٠٠ م');
            expect(timeObj.cldrDateFormat()).toEqual('d‏/M‏/y');
            expect(timeObj.cldrTimeFormat()).toEqual('h:mm a');
        });
        it('Arabian culture (ar - QA) testing', () => {
            loadCultureFiles('ar-QA', true);
            loadCultureFiles('ar-QA');
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00"), locale: 'ar-QA' });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.locale).toBe('ar-QA');
            expect(timeObj.getText()).toBe('٢:٠٠ م');
            timeObj.value = new Date('12/12/2016 11:00 PM');
            timeObj.dataBind();
            expect(timeObj.getText()).toBe('١١:٠٠ م');
            expect(timeObj.cldrDateFormat()).toEqual('d‏/M‏/y');
            expect(timeObj.cldrTimeFormat()).toEqual('h:mm a');
        });
    });
    describe('Initial time input attribute testing', () => {
        let ele: HTMLElement;
        beforeEach(() => {
            ele = createElement('input', { id: 'timepicker6' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('disabled attribute testing', () => {
            ele.setAttribute('disabled', 'true');
            timeObj = new TimePicker({ value: new Date("12/12/2016 5:00") });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.enabled).toBe(false);
        });
        it('readonly attribute testing', () => {
            ele.setAttribute('readonly', 'true');
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00") });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.readonly).toEqual(true);
        });
        it('name attribute testing', () => {
            ele.setAttribute('name', 'timePicker');
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00") });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.element.getAttribute('name')).toEqual('timePicker');
        });
        it('without name attribute testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00") });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.element.getAttribute('name')).toEqual(timeObj.element.id);
        });
        it('allowedit property with true test case ', () => {
            timeObj = new TimePicker({ allowEdit: true });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.element.getAttribute('readonly')).toBe(null);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-timepicker.e-popup').classList.contains('e-popup')).toBe(true);
        });
        it('allowedit property with false test case ', () => {
            timeObj = new TimePicker({ allowEdit: false });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.element.getAttribute('readonly')).toBe('');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-timepicker.e-popup').classList.contains('e-popup')).toBe(true);
        });
        it('allowedit onproperty test case ', () => {
            timeObj = new TimePicker({});
            timeObj.appendTo('#timepicker6');
            timeObj.allowEdit = false;
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('readonly')).toBe('');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-timepicker.e-popup').classList.contains('e-popup')).toBe(true);
            timeObj.allowEdit = true;
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('readonly')).toBe(null);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-timepicker.e-popup').classList.contains('e-popup')).toBe(true);
        });
        it('allowedit property with e-non-edit calss ', () => {
            timeObj = new TimePicker({value: new Date('3/3/2017 10:00 AM')});
            timeObj.appendTo('#timepicker6');
            expect(timeObj.element.getAttribute('readonly')).toBe(null);
            expect(timeObj.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
            timeObj.allowEdit = false;
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('readonly')).toBe('');
            expect(timeObj.inputWrapper.container.classList.contains('e-non-edit')).toBe(true);
        });
        it('allowedit property with e-non-edit calss with readonly ', () => {
            timeObj = new TimePicker({value: new Date('3/3/2017 10:00 AM')});
            timeObj.appendTo('#timepicker6');
            expect(timeObj.element.getAttribute('readonly')).toBe(null);
            expect(timeObj.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
            timeObj.allowEdit = false;
            timeObj.readonly = true;
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('readonly')).toBe('');
            expect(timeObj.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
        });
        it('allowedit property invalid value with e-non-edit calss  ', () => {
            timeObj = new TimePicker({});
            timeObj.appendTo('#timepicker6');
            timeObj.value = 'invalid';
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('readonly')).toBe(null);
            expect(timeObj.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
            timeObj.allowEdit = false;
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('readonly')).toBe('');
            expect(timeObj.inputWrapper.container.classList.contains('e-non-edit')).toBe(true);
        });
        it('step attibute testing', () => {
            ele.setAttribute('step', '10');
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00") });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.step).toEqual(10);
        });
        it('style attribute testing', () => {
            ele.setAttribute('style', 'background-color:yellow');
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00") });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.element.getAttribute('style')).toEqual('background-color:yellow');
        });
        it('style attribute testing', () => {
            ele.setAttribute('style', 'background-color:yellow');
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00") });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.element.getAttribute('style')).toEqual('background-color:yellow');
        });
        it('min attibute testing', () => {
            ele.setAttribute('min', '10/10/2010 06:00');
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker6');
            expect(timeObj.getValue(timeObj.min)).toEqual('6:00 AM');
        });
        it('max attribute testing', () => {
            ele.setAttribute('max', '10/10/2013 16:00');
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00") });
            timeObj.appendTo('#timepicker6');
            expect(timeObj.getValue(timeObj.max)).toEqual('4:00 PM');
        });
        it('value attribute testing', () => {
            ele.setAttribute('value', '05/05/2015 17:00');
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker6');
            expect(timeObj.getText()).toEqual('5:00 PM');
        });
        it('value attribute testing', () => {
            ele.setAttribute('placeholder', 'select value');
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker6');
            expect(timeObj.placeholder).toEqual('select value');
        });
    });
    describe('clear button related testing', () => {
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepickerClear' });
            document.body.appendChild(ele);
            timeObj = new TimePicker({ value: new Date("12/12/2016 10:00"), showClearButton: true });
            timeObj.appendTo('#timepickerClear');
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('clear icon', () => {
            expect(timeObj.inputWrapper.clearButton.classList.contains('e-clear-icon')).toBe(true);
        });
        it('Clear button Setmodel', () => {
            timeObj.showClearButton = false;
            timeObj.dataBind();
            expect(document.body.querySelectorAll('e-clear-icon').length == 0);
            timeObj.showClearButton = true;
            timeObj.dataBind();
            expect(document.body.querySelectorAll('e-clear-icon').length != 0);
        });
        it('clear button default state', () => {
            expect(timeObj.value.valueOf()).toBe(new Date("12/12/2016 10:00").valueOf());
            expect(timeObj.inputWrapper.clearButton.classList.contains('e-clear-icon-hide')).toBe(true);
        });
        it('clear button with destroy state', () => {
            timeObj.showClearButton = false;
            timeObj.dataBind();
            timeObj.destroy();
            expect(timeObj.inputWrapper === undefined).toBe(true);
            timeObj = null;
        });
        it('click on clear button', (done) => {
            expect(timeObj.value.valueOf()).toBe(new Date("12/12/2016 10:00").valueOf());
            timeObj.show();
            setTimeout(function () {
                (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
                expect(timeObj.element.value).toBe("");
                timeObj.clearHandler(mouseEventArgs);
                expect(timeObj.value).toBe(null);
                done();
            }, 450);
        });
        it('showclearbutton with false test case', () => {
            timeObj = new TimePicker({ showClearButton: false });
            timeObj.appendTo('#timepickerClear');
            expect(document.querySelector('.e-clear-icon').classList.contains('e-clear-icon-hide')).toBe(true);
        });
    });
    describe('zIndex property related testing', () => {
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepickerClear' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('zIndex default value ', () => {
            timeObj = new TimePicker();
            timeObj.appendTo('#timepickerClear');
            (<HTMLElement>document.getElementsByClassName('e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            // expect(timeObj.popupWrapper.style.zIndex).toEqual('');            
            timeObj.zIndex = 2000;
            timeObj.dataBind();
            (<HTMLElement>document.getElementsByClassName('e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            expect(timeObj.popupWrapper.style.zIndex).toEqual('2000');
        });
        it('zIndex initial value change ', () => {
            timeObj = new TimePicker({ zIndex: 1500 });
            timeObj.appendTo('#timepickerClear');
            (<HTMLElement>document.getElementsByClassName('e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            expect(timeObj.popupWrapper.style.zIndex).toEqual('1500');
        });
    });
    describe('Cursor focus related testing', () => {
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepicker7' });
            document.body.appendChild(ele);
            timeObj = new TimePicker({ value: new Date("12/12/2016 10:00") });
            timeObj.appendTo('#timepicker7');
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('mouseup in input element value whole selection testing', () => {
            timeObj.element.setSelectionRange(7, 7);
            timeObj.mouseUpHandler(mouseEventArgs);
            let result: any = timeObj.getCursorSelection();
            expect(result.end).toBe(timeObj.element.value.length);
        });
        it('mouseup in input element value as number whole selection testing', () => {
            timeObj.element.setSelectionRange(7, 7);
            timeObj.element.value = '123123131';
            timeObj.isSelection = true;
            timeObj.mouseUpHandler(mouseEventArgs);
            let result: any = timeObj.getCursorSelection();
            expect(result.end).toBe(timeObj.element.value.length);
        });
        it('mouseup in input element value whole selection testing', () => {
            loadCultureFiles('zh');
            timeObj.locale = 'zh';
            timeObj.dataBind();
            timeObj.element.setSelectionRange(7, 7);
            timeObj.mouseUpHandler(mouseEventArgs);
            let result: any = timeObj.getCursorSelection();
            expect(result.end).toBe(timeObj.element.value.length);
        });
        it('mouseup in text last place testing', () => {
            timeObj.element.setSelectionRange(8, 8);
            timeObj.mouseUpHandler(mouseEventArgs);
            let result: any = timeObj.focusSelection();
            expect(result.end).toBe(timeObj.element.value.length);
        });

        it('mouseup in input element meridiem section testing', () => {
            //for whole value selection
            timeObj.element.setSelectionRange(7, 7);
            timeObj.mouseUpHandler(mouseEventArgs);
            // now call for select the meridiem text
            timeObj.element.setSelectionRange(7, 7);
            timeObj.mouseUpHandler(mouseEventArgs);
            let result: any = timeObj.focusSelection();
            expect(result.end).toBe(timeObj.element.value.length);
            expect(result.start).toBe(6);
        });
        it('mouseup in input minutes section element testing', () => {
            //for whole value selection
            timeObj.element.setSelectionRange(7, 7);
            timeObj.mouseUpHandler(mouseEventArgs);
            // now call for select the meridiem text
            timeObj.element.setSelectionRange(4, 4);
            timeObj.mouseUpHandler(mouseEventArgs);
            let result: any = timeObj.focusSelection();
            expect(result.end).toBe(5);
            expect(result.start).toBe(3);
        });
        it('mouseup in input hour section element testing', () => {
            //for whole value selection
            timeObj.element.setSelectionRange(7, 7);
            timeObj.mouseUpHandler(mouseEventArgs);
            // now call for select the meridiem text
            timeObj.element.setSelectionRange(1, 1);
            timeObj.mouseUpHandler(mouseEventArgs);
            let result: any = timeObj.focusSelection();
            expect(result.end).toBe(2);
            expect(result.start).toBe(0);
        });
        it('mousedown with already selection input element testing', () => {
            timeObj.element.setSelectionRange(0, timeObj.element.value.length);
            timeObj.mouseDownHandler();
            let result: any = timeObj.focusSelection();
            expect(result.start).toBe(0);
            expect(result.end).toBe(2);
        });
    });
    describe('Keyboard Navigation in input testing', () => {
        let KeyboardEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation: (): void => { /** No Code */ },
            action: '',
            altKey: false,
            keyCode: ''
        };
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepicker7' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('popup open testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 10:00") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'open';
            KeyboardEventArgs.altKey = true;
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.isPopupOpen()).toBe(true);
            timeObj.scrollHandler();
        });
        it('popup open testing with step value 0', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 10:00"), step: 0 });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'open';
            KeyboardEventArgs.altKey = true;
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.isPopupOpen()).toBe(false);
        });
        it('press tab key testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 10:00") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'tab';
            KeyboardEventArgs.keyCode = 9;
            timeObj.inputHandler(KeyboardEventArgs);
            timeObj.scrollHandler();
            expect(timeObj.inputElement.value).toBe('10:00 AM');
        });
        it('popup close testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 10:00") });
            timeObj.appendTo('#timepicker7');
            timeObj.show();
            KeyboardEventArgs.action = 'close';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('10:00 AM');
        });
        it('next element value navigation testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 10:00") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'down';
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('10:30 AM');
            expect(timeObj.getText()).toBe('10:00 AM');
        });
        it('step value as negative testing', () => {
            timeObj = new TimePicker({ step: 0 });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'down';
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
        });
        it('previous element value navigation testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 10:00") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'up';
            KeyboardEventArgs.keyCode = 38;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('9:30 AM');
            expect(timeObj.getText()).toBe('10:00 AM');
        });
        it('null value with down navigation testing', () => {
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'down';
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('12:00 AM');
            expect(timeObj.getText()).toBe('');
        });
        it('null value with up navigation testing', () => {
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'up';
            KeyboardEventArgs.keyCode = 38;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('12:00 AM');
            expect(timeObj.getText()).toBe('');
        });
        it('first element to last element navigation testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 00:00") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'up';
            KeyboardEventArgs.keyCode = 38;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('11:30 PM');
            expect(timeObj.getText()).toBe('12:00 AM');
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('11:00 PM');
            expect(timeObj.getText()).toBe('12:00 AM');
        });
        it('last element to first element navigation testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 23:30") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'down';
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('12:00 AM');
            expect(timeObj.getText()).toBe('11:30 PM');
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('12:30 AM');
            expect(timeObj.getText()).toBe('11:30 PM');
        });
        it('last element to previous element navigation testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 23:20") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'up';
            KeyboardEventArgs.keyCode = 38;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getText()).toBe('11:20 PM');
            expect(timeObj.inputElement.value).toBe('11:00 PM');
        });
        it('inbetween value to first element navigation testing', (done) => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 00:10") });
            timeObj.appendTo('#timepicker7');
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            timeObj.hide();
            setTimeout(function () {
                timeObj.element.focus();
                KeyboardEventArgs.action = 'up';
                KeyboardEventArgs.keyCode = 38;
                timeObj.inputHandler(KeyboardEventArgs);
                expect(timeObj.inputElement.value).toBe('12:00 AM');
                expect(timeObj.getText()).toBe('12:10 AM');
                done();
            }, 450);

        });
        it('inbetween value to next element navigation testing', (done) => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 00:10") });
            timeObj.appendTo('#timepicker7');
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            timeObj.hide();
            setTimeout(function () {
                timeObj.element.focus();
                KeyboardEventArgs.action = 'down';
                KeyboardEventArgs.keyCode = 40;
                timeObj.inputHandler(KeyboardEventArgs);
                expect(timeObj.inputElement.value).toBe('12:30 AM');
                expect(timeObj.getText()).toBe('12:10 AM');
                done();
            }, 450);
        });
        it('last element to previous element navigation testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 23:30") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'up';
            KeyboardEventArgs.keyCode = 38;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('11:00 PM');
            expect(timeObj.getText()).toBe('11:30 PM');
        });
        it('disable timeicon testing', () => {
            timeObj = new TimePicker({ min: new Date("12/12/2016 23:30"), max: new Date("12/12/2016 13:30"), strictMode: true });
            timeObj.appendTo('#timepicker7');
            expect(timeObj.inputWrapper.buttons[0].classList.contains('e-disabled')).toBe(true);
        });
        it('empty textbox navigation testing', () => {
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'down';
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getText()).toBe('');
            expect(timeObj.inputElement.value).toBe('12:00 AM');
        });
        it('Enter key testing', () => {
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            timeObj.element.value = "12:30 AM";
            KeyboardEventArgs.action = 'enter';
            KeyboardEventArgs.keyCode = 13;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getText()).toBe('12:30 AM');
        });
        it('Escape key testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 12:30") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'escape';
            KeyboardEventArgs.keyCode = 27;
            timeObj.inputHandler(KeyboardEventArgs);
        });
        it('readonly state keyboard navigation testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 12:30"), readonly: true });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'escape';
            KeyboardEventArgs.keyCode = 27;
            timeObj.inputHandler(KeyboardEventArgs);
        });
        it('label element innerHTML testing', () => {
            timeObj = new TimePicker({ placeholder: 'Select Time' });
            timeObj.appendTo('#timepicker7');
        });
    });
    describe('Keyboard Navigation in popup testing', () => {
        let KeyboardEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation: (): void => { /** NO Code */ },
            action: '',
            altKey: false,
            keyCode: ''
        };
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'timepicker7' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('readonly navigation testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 10:00"), readonly: true });
            timeObj.appendTo('#timepicker7');
            timeObj.show();
            timeObj.element.focus();
            KeyboardEventArgs.action = 'down';
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
        });
        it('next element value navigation testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 10:00") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'open';
            KeyboardEventArgs.altKey = true;
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.action = 'down';
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('10:30 AM');
            expect(timeObj.getText()).toBe('10:00 AM');
        });
        it('previous element value navigation testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 10:00") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'open';
            KeyboardEventArgs.altKey = true;
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.action = 'up';
            KeyboardEventArgs.keyCode = 38;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('9:30 AM');
            expect(timeObj.getText()).toBe('10:00 AM');
        });
        it('null value with down navigation testing', () => {
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'open';
            KeyboardEventArgs.altKey = true;
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.action = 'down';
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('12:00 AM');
            expect(timeObj.getText()).toBe('');
        });
        it('null value with up navigation testing', () => {
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'open';
            KeyboardEventArgs.altKey = true;
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.action = 'up';
            KeyboardEventArgs.keyCode = 38;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('12:00 AM');
            expect(timeObj.getText()).toBe('');
        });
        it('first element to last element navigation testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 00:00") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'open';
            KeyboardEventArgs.altKey = true;
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.action = 'end';
            KeyboardEventArgs.keyCode = 35;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('11:30 PM');
            expect(timeObj.getText()).toBe('12:00 AM');
            KeyboardEventArgs.action = 'up';
            KeyboardEventArgs.keyCode = 38;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('11:00 PM');
            expect(timeObj.getText()).toBe('12:00 AM');
        });
        it('right arrow navigation testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 00:00") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'open';
            KeyboardEventArgs.altKey = true;
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.action = 'right';
            KeyboardEventArgs.keyCode = 39;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('12:00 AM');
            expect(timeObj.getText()).toBe('12:00 AM');
        });
        it('left arrow navigation testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 00:00") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'open';
            KeyboardEventArgs.altKey = true;
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.action = 'left';
            KeyboardEventArgs.keyCode = 37;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('12:00 AM');
            expect(timeObj.getText()).toBe('12:00 AM');
        });
        it('last element to first element navigation testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 23:30") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'open';
            KeyboardEventArgs.altKey = true;
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.action = 'home';
            KeyboardEventArgs.keyCode = 36;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('12:00 AM');
            expect(timeObj.getText()).toBe('11:30 PM');
            KeyboardEventArgs.action = 'down';
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('12:30 AM');
            expect(timeObj.getText()).toBe('11:30 PM');
            KeyboardEventArgs.action = 'up';
            KeyboardEventArgs.keyCode = 38;
            timeObj.inputHandler(KeyboardEventArgs);
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('11:30 PM');
            expect(timeObj.getText()).toBe('11:30 PM');
        });
        it('Enter key testing', () => {
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'open';
            KeyboardEventArgs.altKey = true;
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.action = 'down';
            KeyboardEventArgs.keyCode = 40;
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.action = 'enter';
            KeyboardEventArgs.keyCode = 13;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('12:00 AM');
            expect(timeObj.getText()).toBe('12:00 AM');
        });
        it('Escape key testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 12:30") });
            timeObj.appendTo('#timepicker7');
            timeObj.element.focus();
            KeyboardEventArgs.action = 'escape';
            KeyboardEventArgs.keyCode = 27;
            timeObj.inputHandler(KeyboardEventArgs);
        });
    });
    describe('strict mode false with out of range model value testing', () => {
        let ele: HTMLElement;
        let KeyboardEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation: (): void => { /** NO Code */ },
            action: '',
            altKey: false,
            keyCode: ''
        };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeEach(() => {
            ele = createElement('input', { id: 'timepicker10' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('min with value out of range testing', () => {
            timeObj = new TimePicker({
                value: new Date("12/12/2016 9:00 AM")
                , min: new Date("12/12/2016 10:00 AM")
            });
            timeObj.appendTo('#timepicker10');
            expect(+timeObj.value).toBe(+new Date("12/12/2016 9:00 AM"));
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(timeObj.element.value).toBe('9:00 AM');
        });
        it('max with value out of range testing', () => {
            timeObj = new TimePicker({
                value: new Date("12/12/2016 11:00 PM")
                , max: new Date("12/12/2016 10:00 AM")
            });
            timeObj.appendTo('#timepicker10');
            expect(+timeObj.value).toBe(+new Date("12/12/2016 11:00 PM"));
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(timeObj.element.value).toBe('11:00 PM');
        });
        it('onproperty changes of min and value in out of range testing', () => {
            timeObj = new TimePicker({
            });
            timeObj.appendTo('#timepicker10');
            timeObj.min = new Date("12/12/2016 10:00 AM");
            timeObj.dataBind();
            timeObj.value = new Date("12/12/2016 9:00 AM");
            timeObj.dataBind();
            expect(+timeObj.value).toBe(+new Date("12/12/2016 9:00 AM"));
            expect(timeObj.element.value).toBe('9:00 AM');
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
            timeObj.value = null;
            timeObj.dataBind();
            expect(timeObj.value).toBe(null);
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(timeObj.element.value).toBe('');
        });
        it('onproperty changes of max and value in out of range testing', () => {
            timeObj = new TimePicker({
            });
            timeObj.appendTo('#timepicker10');
            timeObj.max = new Date("12/12/2016 10:00 AM");
            timeObj.dataBind();
            timeObj.value = new Date("12/12/2016 11:00 AM");
            timeObj.dataBind();
            expect(+timeObj.value).toBe(+new Date("12/12/2016 11:00 AM"));
            expect(timeObj.element.value).toBe('11:00 AM');
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
            timeObj.value = null;
            timeObj.dataBind();
            expect(timeObj.value).toBe(null);
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(timeObj.element.value).toBe('');
        });
    });
    describe('strict mode true testing', () => {
        let ele: HTMLElement;
        let KeyboardEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation: (): void => { /** NO Code */ },
            action: '',
            altKey: false,
            keyCode: ''
        };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeEach(() => {
            ele = createElement('input', { id: 'timepicker10' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('value within a range testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 5:00") });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
        });
        it('value exceeds max a range testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 15:00"), max: new Date("12/12/2016 12:00"), strictMode: false });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value).toBe('3:00 PM');
            expect(+timeObj.value).toBe(+new Date("12/12/2016 15:00"));
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('previous state testing', (done) => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 15:00") });
            timeObj.appendTo('#timepicker10');
            timeObj.show();
            expect(timeObj.element.value).toBe('3:00 PM');
            setTimeout(() => {
                timeObj.previousState(new Date("12/12/2016 15:00"));
                done();
            }, 450);
        });
        it('value exceeds min a range testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 5:00"), min: new Date("12/12/2016 8:00"), strictMode: false });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value).toBe('5:00 AM');
            expect(+timeObj.value).toBe(+new Date("12/12/2016 5:00"));
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('max less than value and min testing', () => {
            timeObj = new TimePicker({
                value: new Date("12/12/2016 14:00"),
                min: new Date("12/12/2016 16:00"), max: new Date("12/12/2016 12:00"), strictMode: false
            });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value).toBe('2:00 PM');
            expect(timeObj.getText()).toBe('2:00 PM');
            expect(timeObj.getValue(timeObj.value)).toBe('2:00 PM');
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(timeObj.getValue(timeObj.max)).toBe('12:00 PM');
            expect(timeObj.getValue(timeObj.min)).toBe('4:00 PM');
        });
        it('max less than value and min true mode testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 14:00"), min: new Date("12/12/2016 16:00"), max: new Date("12/12/2016 12:00"), strictMode: true });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value).toBe('12:00 PM');
            expect(timeObj.getText()).toBe('12:00 PM');
            expect(timeObj.getValue(timeObj.value)).toBe('12:00 PM');
            expect(timeObj.getValue(timeObj.max)).toBe('12:00 PM');
            expect(timeObj.getValue(timeObj.min)).toBe('4:00 PM');
        });
        it('Invalid date (worst case) testing', () => {
            timeObj = new TimePicker({ value: new Date('ads') });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value).toBe('');
            expect(timeObj.value).toBe(null);
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
        });
        it('invalid string type with value test case', () => {
            timeObj = new TimePicker({ value: <any>"hgfnfhg" });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value).toBe("hgfnfhg");
            expect(timeObj.value).toBe(null);
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('invalid string type with value less than six integers test case', () => {
            timeObj = new TimePicker({ value: <any>"2019" });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value).toBe("2019");
            expect(timeObj.value).toBe(null);
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('change event for invalid string type  with test case', () => {
            timeObj = new TimePicker({
                value: <any>'1/1/2019 1:00 AM',
                change: function (args) {
                    expect(+args.value).toBe((new Date()).setHours(1,0,0,0));
                }
             });
            timeObj.appendTo('#timepicker10');
            timeObj.value ="1:00 AM";
            timeObj.dataBind();
            expect(timeObj.element.value).toBe("1:00 AM");
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
        });
        it('change event for invalid string type  with empty string', () => {
            timeObj = new TimePicker({
                value: <any>'1/1/2019 1:00 AM',
                change: function (args) {
                    expect(args.value).toBe(null);
                }
             });
            timeObj.appendTo('#timepicker10');
            timeObj.value ="";
            timeObj.dataBind();
            expect(timeObj.value).toBe(null);
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
        });
        it('invalid number type with value test case', () => {
            timeObj = new TimePicker({ value: <any>12243 });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value).toBe("12243");
            expect(timeObj.value).toBe(null);
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('invalid string type with value test case and strictMode true', () => {
            timeObj = new TimePicker({ value: <any>"hgfnfhg", strictMode: true });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value).toBe("");
            expect(timeObj.value).toBe(null);
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
        });
        it('invalid string type with ISO string value test case', () => {
            timeObj = new TimePicker({ value: <any>"2019-01-01T06:00:00.000Z" });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value).toBe("6:00 AM");
            expect(timeObj.invalidValueString).toBe(null);
        });
        it('string type value with onproperty test case', () => {
            timeObj = new TimePicker({ value: <any>'2/2/2017 1:00 AM' });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value).toBe('1:00 AM');
            expect(+timeObj.value).toBe(+new Date('2/2/2017 1:00 AM'));
            timeObj.value = "1/1/2029 4:00 PM";
            timeObj.dataBind();
            expect(timeObj.element.value).toBe('4:00 PM');
            expect(+timeObj.value).toBe(+new Date("1/1/2029 4:00 PM"));
        });
        it('ISO string type with value test case', () => {
            timeObj = new TimePicker({ value: <any>"2017-02-01T18:30:00.000Z" });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value != '').toBe(true);
            expect(timeObj.value !== null).toBe(true);
        });
        it('ISO string type with value test case', () => {
            timeObj = new TimePicker({ value: <any>"2018-03-03T06:00:00" });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value != '').toBe(true);
            expect(timeObj.value !== null).toBe(true);
        });
        it('ISO string type with value test case', () => {
            timeObj = new TimePicker({ value: <any>"2019-01-02T08:06:13.3426049+00:00" });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value != '').toBe(true);
            expect(timeObj.value !== null).toBe(true);
        });
        it('ISO string type with value test case', () => {
            timeObj = new TimePicker({ value: <any>"2017-02-01T18:30:00.000Z" });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value != '').toBe(true);
            expect(timeObj.value !== null).toBe(true);
        });
        // it('string type with value test case and format', () => {
        //     timeObj = new TimePicker({ value: <any>"11-10",format: 'HH-mm'});
        //     timeObj.appendTo('#timepicker10');
        //     expect(timeObj.element.value).toBe("11-10");
        //     expect(+timeObj.value).toBe((new Date()).setHours(11,10,0,0));
        //     expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
        // });
        // it('string type with value test case and format', () => {
        //     timeObj = new TimePicker({ value: <any>"11:10",format: 'mm:HH'});
        //     timeObj.appendTo('#timepicker10');
        //     expect(timeObj.element.value).toBe("11:10");
        //     expect(+timeObj.value).toBe((new Date()).setHours(10,11,0,0));
        //     expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
        // });
        it('null testing', () => {
            timeObj = new TimePicker({ value: null });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value).toBe('');
            expect(timeObj.value).toBe(null);
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
        });
        it('e-error added and removed with empty testing', () => {
            timeObj = new TimePicker({ value: new Date('12/12/2016 12:00'), max: new Date('12/12/2016 11:00') });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value).toBe('12:00 PM');
            expect(+timeObj.value).toBe(+ new Date('12/12/2016 12:00'));
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
            timeObj.inputElement.value = '';
            timeObj.inputBlurHandler();
            expect(timeObj.element.value).toBe('');
            expect(timeObj.value).toBe(null);
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
        });
        it('prevent blur testing', (done) => {
            timeObj = new TimePicker({ value: new Date('12/12/2016 13:00'), max: new Date('12/12/2016 15:00') });
            timeObj.appendTo('#timepicker10');
            timeObj.show();
            timeObj.isPreventBlur = true;
            expect(timeObj.inputElement.value).toBe('1:00 PM');
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
            setTimeout(() => {
                timeObj.inputBlurHandler();
                done();
            }, 450);
        });

        it('change  event with preventing test case', function () {
            let e: object = {
                stopPropagation(): void {
                }
            }
            timeObj = new TimePicker({
                change: function (args: any): void {
                }
            });
            timeObj.appendTo('#date');
            timeObj.inputChangeHandler(e)
        });
        it('value section in mouseup handler testing', () => {
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker10');
            timeObj.element.value = 'adf';
            timeObj.element.setSelectionRange(2, 2);
            timeObj.mouseUpHandler(mouseEventArgs);
            //second call for get the default text selection
            timeObj.element.setSelectionRange(2, 2);
            timeObj.mouseUpHandler(mouseEventArgs);
            expect(timeObj.cursorDetails.start).toBe(2);
            expect(timeObj.cursorDetails.end).toBe(2);
            timeObj.mouseUpHandler(mouseEventArgs);
            timeObj.mouseUpHandler(mouseEventArgs);
            expect(timeObj.element.value).toBe('adf');
            expect(timeObj.value).toBe(null);
            expect(timeObj.cursorDetails.start).toBe(0);
            expect(timeObj.cursorDetails.end).toBe(3);
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
        });
        it('input editing testing', () => {
            timeObj = new TimePicker({ value: null });
            timeObj.appendTo('#timepicker10');
            timeObj.element.focus();
            timeObj.element.value = 'datevalue';
            KeyboardEventArgs.action = 'enter';
            KeyboardEventArgs.keyCode = 13;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.element.value).toBe('datevalue');
            expect(timeObj.value).toBe(null);
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('input editing with character testing', () => {
            timeObj = new TimePicker({ value: new Date('12/12/2016 10:00') });
            timeObj.appendTo('#timepicker10');
            timeObj.element.focus();
            KeyboardEventArgs.keyCode = 65;
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.element.value).toBe('10:00 AM');
        });
        it('error class added and removed with range value testing', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 5:00"), min: new Date("12/12/2016 8:00") });
            timeObj.appendTo('#timepicker10');
            expect(timeObj.element.value).toBe('5:00 AM');
            expect(+timeObj.value).toBe(+ new Date("12/12/2016 5:00"));
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(true);
            timeObj.value = new Date("12/12/2016 8:10");
            timeObj.dataBind();
            expect(timeObj.element.value).toBe('8:10 AM');
            expect(timeObj.getText()).toBe('8:10 AM');
            expect(timeObj.inputWrapper.container.classList.contains('e-error')).toBe(false);
        });
    });
    describe('HTML attributes at inline element testing', () => {
        let timeObj: any;
        beforeEach((): void => {
            timeObj = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'time' });
            ele.setAttribute('placeholder','Enter a date');
            ele.setAttribute('readonly', '');
            ele.setAttribute('disabled', '');
            ele.setAttribute('value', '5:00 AM');
            ele.setAttribute('min', '1:00 AM');
            ele.setAttribute('max', '10:00 AM');
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (timeObj) {
                timeObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Inline element testing', () => {
            timeObj = new TimePicker();
            timeObj.appendTo('#time');
            expect(timeObj.placeholder).toBe("Enter a date");
            expect(timeObj.element.hasAttribute('readonly')).toBe(true);
            expect(timeObj.element.hasAttribute('enabled')).toBe(false);
            expect(timeObj.element.getAttribute('min')).toBe('1:00 AM');
            expect(timeObj.element.getAttribute('max')).toBe('10:00 AM');
        });
        it('Inline and API testing', () => {
            timeObj = new TimePicker({placeholder:"Select a date", readonly: false, enabled: true, value: new Date("7/4/2016 6:00 AM"), min: new Date("7/4/2016 2:00 AM"), max: new Date("7/4/2016 9:00 AM")});
            timeObj.appendTo('#time');
            expect(timeObj.placeholder).toBe("Select a date");
            expect(timeObj.element.hasAttribute('readonly')).toBe(false);
            expect(timeObj.element.hasAttribute('disabled')).toBe(false);
            expect(timeObj.element.value).toBe('6:00 AM');
            expect(timeObj.getValue(timeObj.initMin)).toBe('2:00 AM');
            expect(timeObj.getValue(timeObj.initMax)).toBe('9:00 AM');
        });
        it('Inline and html attributes API testing', () => {
            timeObj = new TimePicker({ htmlAttributes:{placeholder:"Choose a date", readonly: "false", disabled: "false", value: '7.00 AM', min: '3:00 AM', max: '8:00 AM'}});
            timeObj.appendTo('#time');
            expect(timeObj.placeholder).toBe("Choose a date");
            expect(timeObj.element.hasAttribute('readonly')).toBe(false);
            expect(timeObj.element.hasAttribute('disabled')).toBe(false);
            expect(timeObj.element.getAttribute('min')).toBe('3:00 AM');
            expect(timeObj.element.getAttribute('max')).toBe('8:00 AM');
        });
        it('Inline, API and html attributes API testing', () => {
            timeObj = new TimePicker({ htmlAttributes:{placeholder:"Choose a date", readonly: "true", disabled: "", value: "7:00 AM", min: '3:00 AM', max: '8:00 AM'}, placeholder: "Select a date", readonly: false, enabled: true, value: new Date("7/4/2016 6:00 AM"), min: new Date("7/4/2016 2:00 AM"), max: new Date("7/4/2016 9:00 AM")});
            timeObj.appendTo('#time');
            expect(timeObj.placeholder).toBe("Select a date");
            expect(timeObj.element.hasAttribute('readonly')).toBe(false);
            expect(timeObj.element.hasAttribute('enabled')).toBe(false);
            expect(timeObj.element.value).toBe('6:00 AM');
            expect(timeObj.getValue(timeObj.initMin)).toBe('2:00 AM');
            expect(timeObj.getValue(timeObj.initMax)).toBe('9:00 AM');
        });
    });
    
    describe('HTML attribute API testing', () => {
        let timeObj: any;
        beforeEach((): void => {
            timeObj = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'time' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (timeObj) {
                timeObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('API testing', () => {
            timeObj = new TimePicker({placeholder:"Select a date", readonly: false, enabled: true, value: new Date("7/4/2016 3:00 AM")});
            timeObj.appendTo('#time');
            expect(timeObj.placeholder).toBe("Select a date");
            expect(timeObj.element.hasAttribute('readonly')).toBe(false);
            expect(timeObj.element.hasAttribute('disabled')).toBe(false);
            expect(timeObj.element.value).toBe('3:00 AM');
        });
        it('HTML attributes API testing', () => {
            timeObj = new TimePicker({ htmlAttributes:{placeholder:"Choose a date", readonly: "false", disabled: "false", value: "5.00 AM"}});
            timeObj.appendTo('#time');
            expect(timeObj.placeholder).toBe("Choose a date");
            expect(timeObj.element.hasAttribute('disabled')).toBe(false);
            expect(timeObj.element.hasAttribute('readonly')).toBe(false);
        });
        it('API and HTML attributes API testing', () => {
            timeObj = new TimePicker({ htmlAttributes:{placeholder:"Choose a date", readonly: "true", disabled: "", value: "5.00 AM"}, placeholder: "Select a date", readonly: false, enabled: true, value: new Date("7/4/2016 3:00 AM")});
            timeObj.appendTo('#time');
            expect(timeObj.placeholder).toBe("Select a date");
            expect(timeObj.element.hasAttribute('readonly')).toBe(false);
            expect(timeObj.element.hasAttribute('enabled')).toBe(false);
            expect(timeObj.element.value).toBe('3:00 AM');
        });
        it('Other attribute testing with htmlAttributes API', () => {
            timeObj = new TimePicker({ htmlAttributes:{name:"picker", title:"sample"}});
            timeObj.appendTo('#time');
            expect(timeObj.element.getAttribute('name')).toBe('picker');
            expect(timeObj.inputWrapper.container.getAttribute('title')).toBe('sample');
        });
    });

    describe('HTML attribute API dynamic testing', () => {
        let timeObj: any;
        beforeEach((): void => {
            timeObj = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'time' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (timeObj) {
                timeObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Dynamically change attributes with htmlAttributes API', () => {
            timeObj = new TimePicker({ htmlAttributes:{placeholder:"Enter a date", readonly: "true", disabled: "true", value: "2/2/2018 6:00 AM", max: " 2/2/2018 9:00 AM", min: "2/2/2018 2:00 AM", title:"sample", style: 'background-color:yellow'}});
            timeObj.appendTo('#time');
            expect(timeObj.element.getAttribute('placeholder')).toBe('Enter a date');
            expect(timeObj.element.hasAttribute('readonly')).toBe(true);
            expect(timeObj.element.hasAttribute('disabled')).toBe(true);
            expect(timeObj.element.value).toBe('6:00 AM');
            expect(timeObj.getValue(timeObj.initMin)).toBe('2:00 AM');
            expect(timeObj.getValue(timeObj.initMax)).toBe('9:00 AM');
            expect(timeObj.inputWrapper.container.getAttribute('title')).toBe('sample');
            expect(timeObj.inputWrapper.container.getAttribute('style')).toBe('width: 100%;background-color:yellow');
            timeObj.htmlAttributes = { placeholder:"choose a date", readonly: "false", disabled: "false", value: "2/2/2018 7:00 AM", max: "2/2/2018 10:00 AM", min: "2/2/2018 3:00 AM", title:"heading"};
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('placeholder')).toBe('choose a date');
            expect(timeObj.element.hasAttribute('readonly')).toBe(false);
            expect(timeObj.element.value).toBe('7:00 AM');
            expect(timeObj.getValue(timeObj.initMin)).toBe('3:00 AM');
            expect(timeObj.getValue(timeObj.initMax)).toBe('10:00 AM');
            expect(timeObj.inputWrapper.container.getAttribute('title')).toBe('heading');
        });
        it('Placeholder testing in auto case', () => {
            timeObj = new TimePicker({ floatLabelType: "Auto", htmlAttributes:{placeholder:"Enter a name" }});
            timeObj.appendTo('#time');
            expect(timeObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter a name');
            timeObj.htmlAttributes = { placeholder:"choose a date"};
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            timeObj.floatLabelType = "Always";
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            timeObj.floatLabelType = "Never";
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('placeholder')).toBe('choose a date');
        });
        it('Placeholder testing in always case', () => {
            timeObj = new TimePicker({ floatLabelType: "Always", htmlAttributes:{placeholder:"Enter a name" }});
            timeObj.appendTo('#time');
            expect(timeObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter a name');
            timeObj.htmlAttributes = { placeholder:"choose a date"};
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            timeObj.floatLabelType = "Auto";
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            timeObj.floatLabelType = "Never";
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('placeholder')).toBe('choose a date');
        });
        it('Placeholder testing in never case', () => {
            timeObj = new TimePicker({ floatLabelType: "Never", htmlAttributes:{placeholder:"Enter a name" }});
            timeObj.appendTo('#time');
            expect(timeObj.element.getAttribute('placeholder')).toBe('Enter a name');
            timeObj.htmlAttributes = { placeholder:"choose a date"};
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('placeholder')).toBe('choose a date');
            timeObj.floatLabelType = "Always";
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            timeObj.floatLabelType = "Auto";
            timeObj.dataBind();
            expect(timeObj.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
        });
    });
    describe('HTML attribute API at inital rendering and dynamic rendering', () => {
        let timeObj: any;
        beforeEach((): void => {
            timeObj = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'time' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (timeObj) {
                timeObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Html attributes at initial rendering', () => {
            timeObj = new TimePicker({ htmlAttributes:{placeholder:"Choose a time", class: "sample" } });
            timeObj.appendTo('#time');
            expect(timeObj.element.getAttribute('placeholder')).toBe('Choose a time');
            expect(timeObj.inputWrapper.container.classList.contains('sample')).toBe(true);
        });
        it('Pass multiple attributes dynamically', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 1:00 AM") });
            timeObj.appendTo('#time');
            timeObj.htmlAttributes = { class:"sample", readonly: "true", disabled: "true"};
            timeObj.dataBind();
            expect(timeObj.element.value).toBe('1:00 AM');
            expect(timeObj.inputWrapper.container.classList.contains('sample')).toBe(true);
            expect(timeObj.element.hasAttribute('readonly')).toBe(true);
            expect(timeObj.element.hasAttribute('disabled')).toBe(true);
        });
        it('Dynamically change attributes through htmlAttributes API', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 1:00 AM") });
            timeObj.appendTo('#time');
            timeObj.inputElement.value = "10/10/2016 1:00 AM";
            timeObj.htmlAttributes = { class:"sample" };
            timeObj.dataBind();
            expect(timeObj.element.value).toBe('10/10/2016 1:00 AM');
        });
        it('Dynamically change multiple attributes through htmlAttributes API', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 1:00 AM") });
            timeObj.appendTo('#time');
            timeObj.element.value = "10/10/2016 1:00 AM";
            timeObj.htmlAttributes = { class:"sample" , max:'10/20/2019', min:'10/5/2019'};
            timeObj.dataBind();
            expect(timeObj.element.value).toBe("10/10/2016 1:00 AM");
            expect(timeObj.element.getAttribute('max')).toBe('10/20/2019');
            expect(timeObj.element.getAttribute('min')).toBe('10/5/2019');
        });
        it('Pass null value in htmlAttributes', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 1:00 AM") });
            timeObj.appendTo('#time');
            timeObj.htmlAttributes = { null: "null"};
            timeObj.dataBind();
            expect(timeObj.element.value).toBe('1:00 AM');
        });
        it('Pass undefined in htmlAttributes', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 1:00 AM") });
            timeObj.appendTo('#time');
            timeObj.htmlAttributes = { undefined: "undefined"};
            timeObj.dataBind();
            expect(timeObj.element.value).toBe('1:00 AM');
        });
        it('Pass empty value in htmlAttributes', () => {
            timeObj = new TimePicker({ value: new Date("12/12/2016 1:00 AM") });
            timeObj.appendTo('#time');
            timeObj.inputElement.value = "12/12/2016 1:00 AM";
            timeObj.htmlAttributes = {};
            timeObj.dataBind();
            expect(timeObj.element.value).toBe('12/12/2016 1:00 AM');
        });
    });

    describe('mobile layout testing', () => {
        let ele: HTMLElement = createElement('input', { id: 'timepicker31' });
        let ua = Browser.userAgent;
        beforeAll(() => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            document.body.appendChild(ele);
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker31');
        });
        afterAll(() => {
            if (ele) {
                timeObj.destroy();
                document.body.innerHTML = '';
            }
            Browser.userAgent = ua;
        })
        it('initial items choosing', (done) => {
            timeObj.value = new Date('12/12/2016 1:00 AM');
            timeObj.dataBind();
            timeObj.hide();
            setTimeout(() => {
                timeObj.show();
                expect(timeObj.getText()).toBe('1:00 AM');
                expect(timeObj.isPopupOpen()).toBe(true);
                done();
            }, 450);
        })
        it('middle items choosing', (done) => {
            timeObj.value = new Date('12/12/2016 11:00 AM');
            timeObj.dataBind();
            timeObj.hide();
            setTimeout(() => {
                timeObj.show();
                expect(timeObj.getText()).toBe('11:00 AM');
                expect(timeObj.isPopupOpen()).toBe(true);
                done();
            }, 450);
        })
        it('end items choosing', (done) => {
            timeObj.value = new Date('12/12/2016 11:00 PM');
            timeObj.dataBind();
            timeObj.hide();
            setTimeout(() => {
                timeObj.show();
                expect(timeObj.getText()).toBe('11:00 PM');
                expect(timeObj.isPopupOpen()).toBe(true);
                done();
            }, 450);
        })
        it('empty textbox texting', (done) => {
            timeObj.value = null;
            timeObj.dataBind();
            timeObj.hide();
            setTimeout(() => {
                timeObj.show();
                expect(timeObj.getText()).toBe('');
                expect(timeObj.isPopupOpen()).toBe(true);
                done();
            }, 450);
        })
        it('rtl mode testing', (done) => {
            timeObj.enableRtl = true;
            timeObj.dataBind();
            timeObj.show();
            setTimeout(() => {
                expect(timeObj.getText()).toBe('');
                done();
            }, 450);
        })
    });
    describe('document layout testing', () => {
        let clickEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: '',
            target: ''
        };
        let ele: HTMLElement = createElement('input', { id: 'timepicker35' });
        beforeAll(() => {
            document.body.appendChild(ele);
            let btn: HTMLElement = createElement('button', { id: 'btn' });
            document.body.appendChild(btn);
            timeObj = new TimePicker();
            timeObj.appendTo('#timepicker35');
        });
        afterAll(() => {
            if (ele) {
                timeObj.destroy();
                document.body.innerHTML = '';
            }
        })
        it('document click testing', (done) => {
            timeObj.value = new Date('12/12/2016 1:00 AM');
            timeObj.dataBind();
            timeObj.show();
            setTimeout(() => {
                timeObj.inputElement.focus();
                clickEventArgs.currentTarget = document.getElementById('btn');
                clickEventArgs.target = document.getElementById('btn');
                timeObj.documentClickHandler(clickEventArgs);
                setTimeout(() => {
                    expect(timeObj.isPopupOpen()).toBe(false);
                    done();
                }, 450);
                done();
            }, 450);
        })
    });
    describe('document click testing', () => {
        let clickEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation: (): void => { /** NO Code */ },
            currentTarget: '',
            target: ''
        };
        let ele: HTMLElement = createElement('input', { id: 'timepicker38' });
        beforeAll(() => {
            document.body.appendChild(ele);
            timeObj3 = new TimePicker();
            timeObj3.appendTo('#timepicker38');
        });
        afterAll(() => {
            if (ele) {
                timeObj3.destroy();
                document.body.innerHTML = '';
            }
        })
        it('document popup click (open) testing', (done) => {
            timeObj3.value = new Date('12/12/2016 1:00 AM');
            timeObj3.dataBind();
            if (!timeObj.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            }
            setTimeout(() => {
                expect(timeObj3.isPopupOpen()).toBe(true);
                done();
            }, 450);
        })
    });

    describe('document click testing', () => {
        let clickEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation: (): void => { /** NO Code */ },
            currentTarget: '',
            target: ''
        };
        let ele: HTMLElement = createElement('input', { id: 'timepicker38' });
        beforeAll(() => {
            document.body.appendChild(ele);
            timeObj2 = new TimePicker();
            timeObj2.appendTo('#timepicker38');
        });
        afterAll(() => {
            if (ele) {
                timeObj2.destroy();
                document.body.innerHTML = '';
            }
        })
        it('document popup click (close) testing', (done) => {
            timeObj2.value = new Date('12/12/2016 1:00 AM');
            timeObj2.dataBind();
            timeObj2.show();
            setTimeout(() => {
                clickEventArgs.currentTarget = (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]);
                clickEventArgs.target = (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]);
                timeObj2.documentClickHandler(clickEventArgs);
                setTimeout(() => {
                    expect(timeObj2.isPopupOpen()).toBe(false);
                    done();
                }, 450);
                done();
            }, 450);
        })
    });

    describe('document click testing', () => {
        let clickEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation: (): void => { /** NO Code */ },
            currentTarget: '',
            target: ''
        };
        let ele: HTMLElement = createElement('input', { id: 'timepicker37' });
        beforeAll(() => {
            document.body.appendChild(ele);
            let btn: HTMLElement = createElement('button', { id: 'btn' });
            document.body.appendChild(btn);
            timeObj1 = new TimePicker();
            timeObj1.appendTo('#timepicker37');
        });
        afterAll(() => {
            if (ele) {
                timeObj1.destroy();
                document.body.innerHTML = '';
            }
        })
        it('document popup click (open) testing', (done) => {
            timeObj1.value = new Date('12/12/2016 12:00 AM');
            timeObj1.dataBind();
            timeObj1.show();
            setTimeout(() => {
                clickEventArgs.currentTarget = (<HTMLElement>document.getElementsByClassName(' e-content')[0]);
                clickEventArgs.target = <HTMLLIElement>document.getElementsByClassName('e-list-item')[2];
                timeObj1.documentClickHandler(clickEventArgs);
                expect(timeObj1.getText()).toBe('12:00 AM');
                done();
            }, 450);
        })
    });
    describe('Angular tag testing ', () => {
        let element: any;
        beforeEach(() => {
            element = createElement('EJS-TIMEPICKER');
            element.setAttribute('required','');
            element.setAttribute('aria-required',true);
        });
        afterEach(() => {
            timeObj.destroy();
            document.body.innerHTML = '';
        });
        it('Wrapper testing with ID', () => {
            element.setAttribute('id', 'timepicker');
            element.setAttribute('name', 'angular');
            document.body.appendChild(element);
            timeObj = new TimePicker({ value: new Date() });
            timeObj.appendTo(element);
            expect(timeObj.element.tagName).toEqual('EJS-TIMEPICKER');
            expect(timeObj.inputWrapper.container.tagName).toBe('SPAN');
            expect(timeObj.element.getAttribute('name')).toBe(null);
            expect(timeObj.inputElement.getAttribute('name')).toBe('angular');
            expect(timeObj.inputWrapper.container.parentElement.tagName).toBe(timeObj.element.tagName);
            expect(timeObj.inputElement.tagName).toBe('INPUT')
        });
        it('Wrapper testing without ID ', () => {
            document.body.appendChild(element);
            timeObj = new TimePicker({ value: new Date() });
            timeObj.appendTo(element);
            expect(timeObj.element.tagName).toEqual('EJS-TIMEPICKER');
            expect(timeObj.inputWrapper.container.tagName).toBe('SPAN');
            expect(timeObj.inputWrapper.container.parentElement.tagName).toBe(timeObj.element.tagName);
            expect(timeObj.inputElement.tagName).toBe('INPUT')
        });
    });

    describe('Mobile testing for readonly attribute', () => {
        let ele: HTMLElement;
        let ua = Browser.userAgent;
        beforeAll(() => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
        });
        afterAll(() => {
            if (ele) {
                timeObj.destroy();
                document.body.innerHTML = '';
            }
            Browser.userAgent = ua;
        })
        it('Add and remove readonly attribute for angular platform', () => {
            let ele: HTMLElement = createElement('EJS-TIMEPICKER', { id: 'time' });
            document.body.appendChild(ele);
            timeObj = new TimePicker();
            timeObj.appendTo('#time');
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                currentTarget: null,
                target: null,
                stopPropagation: (): void => { /** NO Code */ }
            };
            timeObj.popupHandler(mouseEventArgs);
            expect(timeObj.element.hasAttribute('readonly')).toBe(false);
            expect(timeObj.inputElement.hasAttribute('readonly')).toBe(true);
            timeObj.closePopup();
            expect(timeObj.inputElement.hasAttribute('readonly')).toBe(false);
        });
        it('Add and remove readonly attribute for other platform', () => {
            let ele: HTMLElement = createElement('input', { id: 'time' });
            document.body.appendChild(ele);
            timeObj = new TimePicker();
            timeObj.appendTo('#time');
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                currentTarget: null,
                target: null,
                stopPropagation: (): void => { /** NO Code */ }
            };
            timeObj.popupHandler(mouseEventArgs);
            expect(timeObj.inputElement.hasAttribute('readonly')).toBe(true);
            timeObj.closePopup();
            expect(timeObj.inputElement.hasAttribute('readonly')).toBe(false);
        });
    });

    describe('Step value testing ', () => {
        let element: any;
        let KeyboardEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation: (): void => { /** NO Code */ },
            action: '',
            altKey: false,
            keyCode: ''
        };
        beforeEach(() => {
            element = createElement('input', { id: 'timepicker' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            timeObj.destroy();
            document.body.innerHTML = '';
        });
        it('24 hours value with meridian text', () => {
            timeObj = new TimePicker({ value: new Date('8/8/2016 14:00 AM') });
            timeObj.appendTo(element);
            expect(timeObj.value).toEqual(null);
        });
        it('24 hours max value with meridian text', () => {
            timeObj = new TimePicker({ min: new Date('8/8/2016 14:00 AM') });
            timeObj.appendTo(element);
            expect(timeObj.getValue(timeObj.max)).toEqual(null);
            expect(timeObj.getValue(timeObj.min)).toEqual(null);
            expect(timeObj.getValue(timeObj.initMin)).toEqual('12:00 AM');
            expect(timeObj.getValue(timeObj.initMax)).toEqual('11:59 PM');
        });
        it('24 hours min value with meridian text', () => {
            timeObj = new TimePicker({ max: new Date('8/8/2018 14:00 AM') });
            timeObj.appendTo(element);
            expect(timeObj.getValue(timeObj.max)).toEqual(null);
            expect(timeObj.getValue(timeObj.min)).toEqual(null);
            expect(timeObj.getValue(timeObj.initMin)).toEqual('12:00 AM');
            expect(timeObj.getValue(timeObj.initMax)).toEqual('11:59 PM');
        });
        it('step value 0.5 testing ', () => {
            timeObj = new TimePicker({ step: 0.50 });
            timeObj.appendTo(element);
            timeObj.focusIn(e);
            KeyboardEventArgs.keyCode = 40;
            KeyboardEventArgs.action = 'down';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.liCollections[0].innerHTML).toEqual('12:00 AM');
            KeyboardEventArgs.keyCode = 13;
            KeyboardEventArgs.action = 'enter';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getExactDateTime(timeObj.value)).toEqual('12:00:00 AM');
            expect(timeObj.getExactDateTime(null)).toEqual(null);
            expect(timeObj.liCollections[1].innerHTML).toEqual('12:00 AM');
            expect(timeObj.liCollections[2].innerHTML).toEqual('12:01 AM');
        });
        it('step value 0.25 testing ', () => {
            timeObj = new TimePicker({ step: 0.25 });
            timeObj.appendTo(element);
            timeObj.focusIn(e);
            KeyboardEventArgs.keyCode = 40;
            KeyboardEventArgs.action = 'down';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.liCollections[0].innerHTML).toEqual('12:00 AM');
            KeyboardEventArgs.keyCode = 13;
            KeyboardEventArgs.action = 'enter';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getExactDateTime(timeObj.value)).toEqual('12:00:00 AM');
            expect(timeObj.liCollections[1].innerHTML).toEqual('12:00 AM');
            expect(timeObj.liCollections[2].innerHTML).toEqual('12:00 AM');
            expect(timeObj.liCollections[3].innerHTML).toEqual('12:00 AM');
            expect(timeObj.liCollections[4].innerHTML).toEqual('12:01 AM');
        });
        it('step value 0.75 testing ', () => {
            timeObj = new TimePicker({ step: 0.75 });
            timeObj.appendTo(element);
            timeObj.focusIn(e);
            KeyboardEventArgs.keyCode = 40;
            KeyboardEventArgs.action = 'down';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.liCollections[0].innerHTML).toEqual('12:00 AM');
            expect(timeObj.liCollections[1].innerHTML).toEqual('12:00 AM');
            expect(timeObj.liCollections[2].innerHTML).toEqual('12:01 AM');
            expect(timeObj.inputWrapper.buttons[0].classList.contains('e-disabled')).toBe(false);
        });
        it('step value null testing ', () => {
            timeObj = new TimePicker({ value: new Date(), step: null });
            timeObj.appendTo(element);
            expect(timeObj.inputWrapper.buttons[0].classList.contains('e-disabled')).toBe(true);
        });
        it('step value testing in keyboard down testing', () => {
            timeObj = new TimePicker({ step: 0.25 });
            timeObj.appendTo(element);
            timeObj.focusIn(e);
            KeyboardEventArgs.keyCode = 40;
            KeyboardEventArgs.action = 'down';
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.keyCode = 13;
            KeyboardEventArgs.action = 'enter';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getExactDateTime(timeObj.value)).toBe('12:00:00 AM');
            expect(timeObj.inputElement.value).toBe('12:00 AM');
            KeyboardEventArgs.keyCode = 40;
            KeyboardEventArgs.action = 'down';
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.keyCode = 13;
            KeyboardEventArgs.action = 'enter';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getExactDateTime(timeObj.value)).toBe('12:00:15 AM');
            expect(timeObj.inputElement.value).toBe('12:00 AM');
            KeyboardEventArgs.keyCode = 40;
            KeyboardEventArgs.action = 'down';
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.keyCode = 13;
            KeyboardEventArgs.action = 'enter';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getExactDateTime(timeObj.value)).toBe('12:00:30 AM');
            expect(timeObj.inputElement.value).toBe('12:00 AM');
        });
        it('step value testing in keyboard up testing', () => {
            timeObj = new TimePicker({ step: 0.25 });
            timeObj.appendTo(element);
            timeObj.focusIn(e);
            KeyboardEventArgs.keyCode = 38;
            KeyboardEventArgs.action = 'up';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.inputElement.value).toBe('12:00 AM');
            KeyboardEventArgs.keyCode = 13;
            KeyboardEventArgs.action = 'enter';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getExactDateTime(timeObj.value)).toBe('12:00:00 AM');
            KeyboardEventArgs.keyCode = 38;
            KeyboardEventArgs.action = 'up';
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.keyCode = 13;
            KeyboardEventArgs.action = 'enter';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getExactDateTime(timeObj.value)).toBe('11:59:45 PM');
            expect(timeObj.inputElement.value).toBe('11:59 PM');
            KeyboardEventArgs.keyCode = 38;
            KeyboardEventArgs.action = 'up';
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.keyCode = 13;
            KeyboardEventArgs.action = 'enter';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getExactDateTime(timeObj.value)).toBe('11:59:30 PM');
            expect(timeObj.inputElement.value).toBe('11:59 PM');
            KeyboardEventArgs.keyCode = 38;
            KeyboardEventArgs.action = 'up';
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.keyCode = 13;
            KeyboardEventArgs.action = 'enter';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getExactDateTime(timeObj.value)).toBe('11:59:15 PM');
            expect(timeObj.inputElement.value).toBe('11:59 PM');
            KeyboardEventArgs.keyCode = 38;
            KeyboardEventArgs.action = 'up';
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.keyCode = 13;
            KeyboardEventArgs.action = 'enter';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getExactDateTime(timeObj.value)).toBe('11:59:00 PM');
            expect(timeObj.inputElement.value).toBe('11:59 PM');
        });
        it('step value with home key testing', () => {
            timeObj = new TimePicker({ value: new Date(), step: 0.25 });
            timeObj.appendTo(element);
            timeObj.focusIn(e);
            KeyboardEventArgs.keyCode = 36;
            KeyboardEventArgs.action = 'home';
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.keyCode = 13;
            KeyboardEventArgs.action = 'enter';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getExactDateTime(timeObj.value)).toBe('12:00:00 AM');
            expect(timeObj.inputElement.value).toBe('12:00 AM');
        });
        it('step value with end key testing', () => {
            timeObj = new TimePicker({ value: new Date(), step: 0.25 });
            timeObj.appendTo(element);
            timeObj.focusIn(e);
            KeyboardEventArgs.keyCode = 35;
            KeyboardEventArgs.action = 'end';
            timeObj.inputHandler(KeyboardEventArgs);
            KeyboardEventArgs.keyCode = 13;
            KeyboardEventArgs.action = 'enter';
            timeObj.inputHandler(KeyboardEventArgs);
            expect(timeObj.getExactDateTime(timeObj.value)).toBe('11:59:45 PM');
            expect(timeObj.inputElement.value).toBe('11:59 PM');
        });
    });
    describe('Popup position customization using open event in desktop', () => {
        let ele: HTMLElement = createElement('input', { id: 'timepicker42' });
        beforeEach(() => {
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (ele) {
                timeObj1.destroy();
                document.body.innerHTML = '';
            }
        });
        it('position values with pixel', () => {
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: pixel
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj1.popupObj.position.X).toEqual('100px');
            expect(timeObj1.popupObj.position.Y).toEqual('100px');
        });
        it('position values with pixel string', () => {
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: pixel
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj1.popupObj.position.X).toEqual('100px');
            expect(timeObj1.popupObj.position.Y).toEqual('100px');
        });
        it('position values with pixel numbers', () => {
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: pixelNumber
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj1.popupObj.position.X).toEqual('100px');
            expect(timeObj1.popupObj.position.Y).toEqual('100px');
        });
        it('Left Top position', () => {
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: leftTop
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj1.popupObj.position.X).toEqual('left');
            expect(timeObj1.popupObj.position.Y).toEqual('top');
        });
        it('Left Bottom position', () => {
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: leftBottom
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj1.popupObj.position.X).toEqual('left');
            expect(timeObj1.popupObj.position.Y).toEqual('bottom');
        });
        it('Right Top position', () => {
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: rightTop
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj1.popupObj.position.X).toEqual('right');
            expect(timeObj1.popupObj.position.Y).toEqual('top');
        });
        it('Right Bottom position', () => {
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: rightBottom
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj1.popupObj.position.X).toEqual('right');
            expect(timeObj1.popupObj.position.Y).toEqual('bottom');
        });
        it('Center Center position', () => {
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: centerCenter
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj1.popupObj.position.X).toEqual('center');
            expect(timeObj1.popupObj.position.Y).toEqual('center');
        });
    });
    describe('Popup position customization using open event in mobile', () => {
        let ele: HTMLElement;
        let ua = Browser.userAgent;
        beforeAll(() => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
        });
        afterAll(() => {
            if (ele) {
                timeObj.destroy();
                document.body.innerHTML = '';
            }
            Browser.userAgent = ua;
        })
        it('position values with pixel', () => {
            var ele = createElement('input', { id: 'timepicker41' });
            document.body.appendChild(ele);
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: pixel
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj1.popupObj.position.X).toEqual('100px');
            expect(timeObj1.popupObj.position.Y).toEqual('100px');
            timeObj1.destroy();
            document.body.innerHTML = '';
        });
        it('position values with pixel numbers', (done) => {
            var ele = createElement('input', { id: 'timepicker41' });
            document.body.appendChild(ele);
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: pixelNumber
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            setTimeout(function () {
                expect(timeObj1.popupObj.position.X).toEqual('100px');
                expect(timeObj1.popupObj.position.Y).toEqual('100px');
                done();
            }, 500);
            timeObj1.destroy();
            document.body.innerHTML = '';
        });
        it('Left Top position', () => {
            var ele = createElement('input', { id: 'timepicker41' });
            document.body.appendChild(ele);
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: leftTop
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj1.popupObj.position.X).toEqual('left');
            expect(timeObj1.popupObj.position.Y).toEqual('top');
            timeObj1.destroy();
            document.body.innerHTML = '';
        });
        it('Left Bottom position', (done) => {
            var ele = createElement('input', { id: 'timepicker41' });
            document.body.appendChild(ele);
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: leftBottom
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            setTimeout(function () {
                expect(timeObj1.popupObj.position.X).toEqual('left');
                expect(timeObj1.popupObj.position.Y).toEqual('bottom');
                done();
            }, 500);
            timeObj1.destroy();
            document.body.innerHTML = '';
        });
        it('Right Top position', () => {
            var ele = createElement('input', { id: 'timepicker41' });
            document.body.appendChild(ele);
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: rightTop
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj1.popupObj.position.X).toEqual('right');
            expect(timeObj1.popupObj.position.Y).toEqual('top');
            timeObj1.destroy();
            document.body.innerHTML = '';
        });
        it('Right Bottom position', (done) => {
            var ele = createElement('input', { id: 'timepicker41' });
            document.body.appendChild(ele);
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: rightBottom
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            setTimeout(function () {
                expect(timeObj1.popupObj.position.X).toEqual('right');
                expect(timeObj1.popupObj.position.Y).toEqual('bottom');
                done();
            }, 500);
            timeObj1.destroy();
            document.body.innerHTML = '';
        });
        it('Center Center position', () => {
            var ele = createElement('input', { id: 'timepicker41' });
            document.body.appendChild(ele);
            timeObj1 = new TimePicker({
                value: new Date('12/12/2016 12:00 AM'),
                open: centerCenter
            });
            timeObj1.appendTo(ele);
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            }
            expect(timeObj1.popupObj.position.X).toEqual('center');
            expect(timeObj1.popupObj.position.Y).toEqual('center');
            timeObj1.destroy();
            document.body.innerHTML = '';
        });
    });
    describe('before item render event', () => {
        let ItemEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation: (): void => { /** NO Code */ },
            currentTarget: '',
            target: ''
        };
        let KeyboardEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation: (): void => { /** NO Code */ },
            action: '',
            altKey: false,
            keyCode: ''
        };
        let ele: HTMLElement = createElement('input', { id: 'timepicker37' });
        beforeEach(() => {
            document.body.appendChild(ele);
            timeObj1 = new TimePicker({
                itemRender: onRender,
                value: new Date('12/12/2016 12:00 AM')
            });
            timeObj1.appendTo('#timepicker37');
        });
        afterEach(() => {
            if (ele) {
                timeObj1.destroy();
                document.body.innerHTML = '';
            }
        });
        it('Item render event testing', () => {
            timeObj1.value = new Date('12/12/2016 3:00 AM');
            timeObj1.dataBind();
            (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            ItemEventArgs.element = <HTMLElement>document.getElementsByClassName('e-list-item')[2];
            expect(ItemEventArgs.element.classList.contains('e-list-item')).toBe(true);
            ItemEventArgs.element.classList.add("e-class");
            expect(document.getElementsByClassName('e-list-item')[2].classList.contains('e-class')).toBe(true);
        });
        it('disable value testing', () => {
            expect(timeObj1.value).toBe(null);
            expect(timeObj1.inputElement.value).toBe('12:00 AM');
            expect(timeObj1.inputWrapper.container.classList.contains('e-error')).toBe(true);
            timeObj1.disableItemCollection = [];
        });
        it('disable value testing', () => {
            timeObj1.disableItemCollection = ['12:00 AM'];
            timeObj1.strictMode = true;
            timeObj1.dataBind();
            expect(timeObj1.value).toBe(null);
            expect(timeObj1.inputElement.value).toBe('');
            expect(timeObj1.inputWrapper.container.classList.contains('e-error')).toBe(false);
            timeObj1.disableItemCollection = [];
        });
        it('disable value testing from 0th Index to last index', (done) => {
            timeObj1.value = new Date('12/12/2016 12:30 AM');
            timeObj1.dataBind();
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
                (document.querySelector('.e-timepicker')).dispatchEvent(clickEvent);
            }
            setTimeout(function () {
                KeyboardEventArgs.keyCode = 38;
                KeyboardEventArgs.action = 'up';
                timeObj1.inputHandler(KeyboardEventArgs);
                expect(timeObj1.inputElement.value).toBe('11:30 PM');
                done();
            }, 450);

        });
        it('disable value testing from last Index to first index', (done) => {
            timeObj1.value = new Date('12/12/2016 11:30 PM');
            timeObj1.dataBind();
            if (!timeObj1.isPopupOpen()) {
                (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
                (<HTMLElement>document.querySelector('.e-timepicker')).dispatchEvent(clickEvent);
            }
            setTimeout(function () {
                KeyboardEventArgs.keyCode = 40;
                KeyboardEventArgs.action = 'down';
                timeObj1.inputHandler(KeyboardEventArgs);
                expect(timeObj1.inputElement.value).toBe('12:30 AM');
                done();
            }, 450);

        });
    });

    describe('Form element', () => {
        let timepicker: any;
        beforeEach(() => {
            let formEle: HTMLElement = createElement('form', { id: "form-element" });
            let Ele: HTMLElement = createElement('input', { id: "timepicker" });
            formEle.appendChild(Ele);
            document.body.appendChild(formEle);
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        // Test cases for reset the component when value has been given.
        it('Input element value reset test case (initialized)', () => {
            timepicker = new TimePicker({ value: new Date('02/02/2017')});
            timepicker.appendTo('#timepicker');
            (<any>document.getElementById("form-element")).reset();
            timepicker.dataBind();
            expect(timepicker.element.value).toBe('12:00 AM');
            expect(timepicker.value !== null).toBe(true);
        });
        it('Input element value changing dynamically (initialized)', () => {
            timepicker = new TimePicker({ value: new Date('02/02/2017') });
            timepicker.appendTo('#timepicker');
            timepicker.element.value = new Date('02/12/2018 4:00 PM');
            (<any>document.getElementById("form-element")).reset();
            timepicker.dataBind();
            expect(timepicker.element.value).toBe('12:00 AM');
            expect(timepicker.value !== null).toBe((true));
        });
        it('Input element value changing dynamically to null value (initialized)', () => {
            timepicker = new TimePicker({ value: new Date('02/02/2017') });
            timepicker.appendTo('#timepicker');
            timepicker.element.value = null;
            (<any>document.getElementById("form-element")).reset();
            timepicker.dataBind();
            expect(timepicker.element.value).toBe('12:00 AM');
            expect(timepicker.value !== null).toBe((true));
        });
        it('Clear the Input element value dynamically via clear button (initialized)', () => {
            timepicker = new TimePicker({ value: new Date('02/02/2017') });
            timepicker.appendTo('#timepicker');
            (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
            (<any>document.getElementById("form-element")).reset();
            timepicker.dataBind();
            expect(timepicker.element.value).toBe('12:00 AM');
            expect(timepicker.value !== null).toBe((true));
        });
        // below test cases are modified since this behavior has been changed in all input component.
        it('Form reset with floatLabeltype("Auto") property test case (initialized)', () => {
            timepicker = new TimePicker({ value: new Date('02/02/2017'), floatLabelType: "Auto" });
            timepicker.appendTo('#timepicker');
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            (<any>document.getElementById("form-element")).reset();
            timepicker.dataBind();
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            expect(timepicker.element.value === '12:00 AM').toBe(true);
        });
        it('Form reset with floatLabeltype("Always") property test case (initialized)', () => {
            timepicker = new TimePicker({ value: new Date('02/02/2017'), floatLabelType: "Always" });
            timepicker.appendTo('#timepicker');
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            (<any>document.getElementById("form-element")).reset();
            timepicker.dataBind();
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            expect(timepicker.element.value === '12:00 AM').toBe(true);
        });
        it('Form reset with floatLabeltype("Never") property test case (initialized)', () => {
            timepicker = new TimePicker({ value: new Date('02/02/2017'), floatLabelType: "Never" });
            timepicker.appendTo('#timepicker');
            expect(document.querySelector('.e-float-text')).toBe(null);
            (<any>document.getElementById("form-element")).reset();
            timepicker.dataBind();
            expect(document.querySelector('.e-float-text')).toBe(null);
            expect(timepicker.element.value === '12:00 AM').toBe(true);
        });
        it('Form destroy event test case (initialized)',()=>{
            timepicker = new TimePicker({ value: new Date()});
            timepicker.appendTo('#timepicker');
            expect(document.getElementById('timepicker').classList.contains('e-timepicker')).toBe(true);
            expect(!isNullOrUndefined(timepicker.inputWrapper)).toBe(true);
            expect(document.forms[0].__eventList.events[0].name).toBe('reset');
            timepicker.destroy();
            expect(document.getElementById('timepicker').classList.contains('e-timepicker')).toBe(false);
            expect(!isNullOrUndefined(timepicker.inputWrapper)).toBe(false);
            expect(document.forms[0].__eventList.events.length).toBe(0);
            timepicker.appendTo('#timepicker');
        });
         // Test cases for reset the component when value not initialized
         it('Input element value changing dynamically', () => {
            timepicker = new TimePicker({  });
            timepicker.appendTo('#timepicker');
            timepicker.element.value = new Date('02/12/2018');
            (<any>document.getElementById("form-element")).reset();
            timepicker.dataBind();
            expect(timepicker.element.value).toBe('');
            expect(timepicker.value === null).toBe((true));
        });
        it('Clear the Input element value dynamically via clear button', () => {
            timepicker = new TimePicker({ });
            timepicker.appendTo('#timepicker');
            timepicker.element.value = new Date('02/12/2018');
            (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
            (<any>document.getElementById("form-element")).reset();
            timepicker.dataBind();
            expect(timepicker.element.value).toBe('');
            expect(timepicker.value === null).toBe((true));
        });
        // Below test case get failed since this is need to be fixed.
        // it('Form reset with floatLabeltype("Auto") property test case', () => {
        //     timepicker = new TimePicker({ floatLabelType: "Auto" });
        //     timepicker.appendTo('#timepicker');
        //     timepicker.element.value = new Date('02/12/2018');
        //     expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
        //     (<any>document.getElementById("form-element")).reset();
        //     timepicker.dataBind();
        //     expect(document.querySelector('.e-float-text').classList.contains('e-label-bottom')).toBe(true);
        //     expect(timepicker.element.value === '').toBe(true);
        // });
        it('Form reset with floatLabeltype("Always") property test case', () => {
            timepicker = new TimePicker({ floatLabelType: "Always" });
            timepicker.appendTo('#timepicker');
            timepicker.element.value = new Date('02/12/2018');
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            (<any>document.getElementById("form-element")).reset();
            timepicker.dataBind();
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            expect(timepicker.element.value === '').toBe(true);
        });
        it('Form reset with floatLabeltype("Never") property test case', () => {
            timepicker = new TimePicker({ floatLabelType: "Never" });
            timepicker.appendTo('#timepicker');
            expect(document.querySelector('.e-float-text')).toBe(null);
            timepicker.element.value = new Date('02/12/2018');
            (<any>document.getElementById("form-element")).reset();
            timepicker.dataBind();
            expect(document.querySelector('.e-float-text')).toBe(null);
            expect(timepicker.element.value === '').toBe(true);
        });
        it('Form destroy event test case',()=>{
            timepicker = new TimePicker({ });
            timepicker.appendTo('#timepicker');
            expect(document.getElementById('timepicker').classList.contains('e-timepicker')).toBe(true);
            expect(!isNullOrUndefined(timepicker.inputWrapper)).toBe(true);
            expect(document.forms[0].__eventList.events[0].name).toBe('reset');
            timepicker.destroy();
            expect(document.getElementById('timepicker').classList.contains('e-timepicker')).toBe(false);
            expect(!isNullOrUndefined(timepicker.inputWrapper)).toBe(false);
            expect(document.forms[0].__eventList.events.length).toBe(0);
            timepicker.appendTo('#timepicker');
        });
    });
    /**
     * Model dialog test case
     */
    describe('Model dialog', function () {
        let timepicker: any;
        beforeEach(()=>{
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            timepicker = new TimePicker({
                value: new Date('4/4/2017 1:00 AM')
            });
            timepicker.appendTo('#date');
        });
        afterEach(()=>{
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it(' desktop test case', function () {
            (<HTMLElement>document.getElementsByClassName('e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.getElementsByClassName('e-time-modal').length === 0).toBe(true);
            expect(timepicker.popupObj.position.X).toBe('left');
            expect(timepicker.popupObj.position.Y).toBe('bottom');
            expect(timepicker.popupObj.relateTo).toBe(timepicker.inputWrapper.container);
        });
        it(' desktop no value test case', function () {
            timepicker.value = null;
            timepicker.dataBind();
            (<HTMLElement>document.getElementsByClassName('e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.getElementsByClassName('e-time-modal').length === 0).toBe(true);
            expect(timepicker.popupObj.position.X).toBe('left');
            expect(timepicker.popupObj.position.Y).toBe('bottom');
            expect(timepicker.popupObj.relateTo).toBe(timepicker.inputWrapper.container);
        });
    });
    describe('Model dialog-mobile', function () {
        let timepicker: any;
        beforeAll(() => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
        });
        beforeEach(()=>{
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            timepicker = new TimePicker({
                value: new Date('4/5/2017 1:00 AM')
            });
            timepicker.appendTo('#date');
        });
        afterEach(()=>{
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        afterAll(() => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
        });
        it(' mobile test case', function () {
            (<HTMLElement>document.getElementsByClassName('e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.getElementsByClassName('e-time-modal').length === 1).toBe(true);
            expect(timepicker.popupObj.position.X).toBe('center');
            expect(timepicker.popupObj.position.Y).toBe('center');
            expect(timepicker.popupObj.relateTo).toBe(document.body)
        });
        it(' mobile no value test case', function () {
            timepicker.value = null;
            timepicker.dataBind();
            (<HTMLElement>document.getElementsByClassName('e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.getElementsByClassName('e-time-modal').length === 1).toBe(true);
            expect(timepicker.popupObj.position.X).toBe('center');
            expect(timepicker.popupObj.position.Y).toBe('center');
            expect(timepicker.popupObj.relateTo).toBe(document.body)
        });
    });
    it('memory leak', () => {     
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
    describe('Timepicker', function () {
        let timePicker:any;
        beforeEach(function () {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(function () {
            if (timePicker) {
                timePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('focus event checking on document click when the calendar is open test case', function () {
            timePicker = new TimePicker({
            });
            timePicker.appendTo('#date');
            let e ={
                preventDefault : () => {},
                target:document.getElementById('date')
            }
            document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0].dispatchEvent(clickEvent);
            expect(timePicker.popupObj != null).toBe(true);
            e.target = document.getElementsByTagName('body')[0];
            timePicker.documentClickHandler(e);
            expect(timePicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(false);
        });
    });
    describe('Dynamic CssClass testcase', function (){
        let timepicker: any;
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('input', { id: 'timepicker'});
            document.body.appendChild(inputElement);
        });
        afterEach(function() {
            if (timepicker) {
                timepicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('single css class',function() {
            timepicker = new TimePicker({
                cssClass: 'e-custom'
            });
            timepicker.appendTo('#timepicker');
            expect(timepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            timepicker.cssClass = 'e-test';
            timepicker.dataBind();
            expect(timepicker.inputWrapper.container.classList.contains('e-test')).toBe(true);
        });
        it('more than one css class',function() {
            timepicker = new TimePicker({
                cssClass: 'e-custom e-secondary'
            });
            timepicker.appendTo('#timepicker');
            expect(timepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            expect(timepicker.inputWrapper.container.classList.contains('e-secondary')).toBe(true);
            timepicker.cssClass = 'e-test e-ternary';
            timepicker.dataBind();
            expect(timepicker.inputWrapper.container.classList.contains('e-custom')).toBe(false);
            expect(timepicker.inputWrapper.container.classList.contains('e-secondary')).toBe(false);
            expect(timepicker.inputWrapper.container.classList.contains('e-test')).toBe(true);
            expect(timepicker.inputWrapper.container.classList.contains('e-test')).toBe(true);
        });
    });
    describe('Popup hide testing when crosses view port', function (){
        let timepicker: any;
        let divElement: HTMLElement;
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('input', { id: 'datepicker'});
            document.body.appendChild(inputElement);
            divElement = createElement('div', { id: 'divElement'});
            divElement.style.height = '900px';
        });
        afterEach(function() {
            if (timepicker) {
                timepicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('Popup hide testing',function() {
            timepicker = new TimePicker({});
            timepicker.appendTo('#datepicker');
            (<HTMLInputElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            expect(timepicker.popupWrapper !== null).toBe(true);
            document.body.appendChild(divElement);
            scrollBy({top: 500, behavior: 'smooth'});
            timepicker.popupObj.trigger('targetExitViewport');
        });
    });

    describe('Cleared event test case', function () {
        let timepicker:any;
        beforeEach(function () {
            let ele: HTMLElement = createElement('input', { id: 'date' });
                document.body.appendChild(ele);
        });
        afterEach(function () {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('check value after button click', function () {
            timepicker = new TimePicker({
                value: new Date('4/5/2017 1:00 AM'),
                cleared: function(args: any) {
                    expect(args.name).toBe("cleared");
                    expect(timepicker.value).toBe(null);
                }
            });
            timepicker.appendTo('#date');
            timepicker.element.parentElement.querySelectorAll('.e-clear-icon')[0].click();
            expect(timepicker.inputElement.value === "").toBe(true);
        });
    });
    describe('EJ2-36604 - While giving the class name with empty space for HtmlAttributes, console error is produced.', function () {
        let timepicker: any;
        beforeEach(function () {
            let inputElement: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputElement);
        });
        afterEach(function () {
            if (timepicker) {
                timepicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('Entering the class name without any empty space', function () {
            timepicker = new TimePicker({
                htmlAttributes: { class: 'custom-class' }
            });
            timepicker.appendTo('#timepicker');
            expect(timepicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving empty space before and after the class name', function () {
            timepicker = new TimePicker({
                htmlAttributes: { class: ' custom-class ' }
            });
            timepicker.appendTo('#timepicker');
            expect(timepicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving more than one empty space between two class names', function () {
            timepicker = new TimePicker({
                htmlAttributes: { class: 'custom-class-one     custom-class-two' }
            });
            timepicker.appendTo('#timepicker');
            expect(timepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(timepicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving more than one empty space between two class names as well before and after the class name', function () {
            timepicker = new TimePicker({
                htmlAttributes: { class: '  custom-class-one     custom-class-two  ' }
            });
            timepicker.appendTo('#timepicker');
            expect(timepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(timepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
        });
        it('Giving only empty space  without entering any class Name', function () {
            timepicker = new TimePicker({
            });
            timepicker.appendTo('#timepicker');
            let beforeAddClass = timepicker.inputWrapper.container.classList.length;
            timepicker.htmlAttributes = { class: '  ' };
            timepicker.appendTo('#timepicker');
            let AfterAddClass = timepicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        });
        it('Keep input as empty without entering any class Name', function () {
            timepicker = new TimePicker({
            });
            timepicker.appendTo('#timepicker');
            let beforeAddClass = timepicker.inputWrapper.container.classList.length;
            timepicker.htmlAttributes = { class: '' };
            timepicker.appendTo('#timepicker');
            let AfterAddClass = timepicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        });
        it('Entering class name without any empty space', function () {
            timepicker = new TimePicker({
                cssClass: 'custom-class'
            });
            timepicker.appendTo('#timepicker');
            expect(timepicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving empty space before and after the class name', function () {
            timepicker = new TimePicker({
                cssClass: ' custom-class '
            });
            timepicker.appendTo('#timepicker');
            expect(timepicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving more than one empty space between two class names', function () {
            timepicker = new TimePicker({
                cssClass: 'custom-class-one   custom-class-two'
            });
            timepicker.appendTo('#timepicker');
            expect(timepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(timepicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving more than one empty space between two class names as well as before and after the class names', function () {
            timepicker = new TimePicker({
                cssClass: '  custom-class-one   custom-class-two  '
            });
            timepicker.appendTo('#timepicker');
            expect(timepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(timepicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving only empty space  without entering any class Name', function () {
            timepicker = new TimePicker({
            });
            timepicker.appendTo('#timepicker');
            let beforeAddClass = timepicker.inputWrapper.container.classList.length;
            timepicker.cssClass = '  ';
            timepicker.appendTo('#timepicker');
            let AfterAddClass = timepicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        }); 
        it('Keep input as empty without entering any class Name', function () {
            timepicker = new TimePicker({
            });
            timepicker.appendTo('#timepicker');
            let beforeAddClass = timepicker.inputWrapper.container.classList.length;
            timepicker.cssClass = '';
            timepicker.appendTo('#timepicker');
            let AfterAddClass = timepicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        });
        it('Giving class name with underscore in the beginning', function () {
            timepicker = new TimePicker({
                htmlAttributes : { class : '  _custom-class-one  '},
                cssClass : '   _custom-class-two  '
            });
            timepicker.appendTo('#timepicker');
            expect(timepicker.inputWrapper.container.classList.contains('_custom-class-one')).toBe(true);
            expect(timepicker.inputWrapper.container.classList.contains('_custom-class-two')).toBe(true);
        });
        it('Giving class name with empty space in both cases seperatly', function () {
            timepicker = new TimePicker({
                htmlAttributes : { class : '  custom-class-one  '},
                cssClass : '   custom-class-two  '
            });
            timepicker.appendTo('#timepicker');
            expect(timepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(timepicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });   
    });
});

