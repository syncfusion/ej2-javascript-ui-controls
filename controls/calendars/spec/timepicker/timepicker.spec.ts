import { TimePicker, ItemEventArgs } from '../../src/timepicker/timepicker';
import { Ajax } from '@syncfusion/ej2-base';
import { Component, EventHandler, Property, Event, CreateBuilder, Internationalization, setCulture } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, KeyboardEvents, KeyboardEventArgs, L10n, Browser } from '@syncfusion/ej2-base';
import { cldrData, loadCldr, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';
import { createElement, removeClass, remove, addClass, setStyleAttribute, detach } from '@syncfusion/ej2-base';
import { isNullOrUndefined, merge, getEnumValue, getValue, getUniqueID } from '@syncfusion/ej2-base';
import '../../node_modules/es6-promise/dist/es6-promise';
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
            timeObj.popupCalculation();
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

    describe('Step value testing ', () => {
        let element: any;
        let KeyboardEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
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
    describe('before item render event', () => {
        let ItemEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: '',
            target: ''
        };
        let KeyboardEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
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
        it('Input element value rest test case', () => {
            timepicker = new TimePicker({ value: new Date() });
            timepicker.appendTo('#timepicker');
            (<any>document.getElementById("form-element")).reset();
            expect(timepicker.element.value).toBe('');
            expect(timepicker.value).toBe(null);
        });
        it('Form rest with floatLabeltype("Auto") property test case', () => {
            timepicker = new TimePicker({ value: new Date(), floatLabelType: "Auto" });
            timepicker.appendTo('#timepicker');
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            (<any>document.getElementById("form-element")).reset();
            expect(document.querySelector('.e-float-text').classList.contains('e-label-bottom')).toBe(true);
            expect(timepicker.element.value).toBe('');
        });
        it('Form rest with floatLabeltype("Always") property test case', () => {
            timepicker = new TimePicker({ value: new Date(), floatLabelType: "Always" });
            timepicker.appendTo('#timepicker');
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            (<any>document.getElementById("form-element")).reset();
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            expect(timepicker.element.value).toBe('');
        });
        it('Form rest with floatLabeltype("Never") property test case', () => {
            timepicker = new TimePicker({ value: new Date(), floatLabelType: "Never" });
            timepicker.appendTo('#timepicker');
            expect(document.querySelector('.e-float-text')).toBe(null);
            (<any>document.getElementById("form-element")).reset();
            expect(document.querySelector('.e-float-text')).toBe(null);
            expect(timepicker.element.value).toBe('');
        });
    });
    describe('Form element with value ', () => {
        let timepicker: any;
        beforeEach(() => {
            let formEle: HTMLElement = createElement('form', { id: "form-element" });
            let Ele: HTMLElement = createElement('input', { id: "timepicker", attrs: { value: '2/2/2017' } });
            formEle.appendChild(Ele);
            document.body.appendChild(formEle);
        });
        afterEach(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Input element value rest test case', () => {
            timepicker = new TimePicker({ value: new Date() });
            timepicker.appendTo('#timepicker');
            (<any>document.getElementById("form-element")).reset();
            (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent);
            expect(timepicker.element.value).toBe('2/2/2017');
            expect(+timepicker.value).toBe(+new Date('2/2/2017'));
        });
    });
});

