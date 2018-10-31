
import { DatePicker, PopupObjectArgs } from "../../src/datepicker/datepicker";
import { Component, EventHandler, Property, Event, CreateBuilder, Internationalization, setCulture, Ajax } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { cldrData, loadCldr, Touch, SwipeEventArgs, L10n, Browser } from '@syncfusion/ej2-base';
import { createElement, removeClass, remove, addClass, setStyleAttribute } from '@syncfusion/ej2-base';
import { isNullOrUndefined, merge, getEnumValue, getValue, getUniqueID } from '@syncfusion/ej2-base';
import '../../node_modules/es6-promise/dist/es6-promise';


/**
 * Datepicker spec document
 */
function resetTime(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
}
function getIdValue(ele: any): number {
    let str: string = ele.id;
    return new Date(parseInt(str, 0)).valueOf();
}

function dateString(datepicker: DatePicker, date: string) {
    expect(datepicker.value.toDateString()).toBe(new Date(date).toDateString())
}
function stringToDateObj(date: string): number {
    return resetTime(new Date(date)).valueOf();
}
let ele = document.getElementById('date');
let clickEvent: MouseEvent = document.createEvent('MouseEvents');
clickEvent.initEvent('mousedown', true, true);
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
L10n.load({
    'en': {
        'datepicker': { placeholder: 'Enter Date' }
    },
    'de': {
        'datepicker': { placeholder: 'Datum eingeben' }
    },
    'zh': {
        'datepicker': { placeholder: '输入日期' }
    },
    'vi': {
        'datepicker': { placeholder: 'Nhập ngày' }
    },
    'ja': {
        'datepicker': { placeholder: '日付を入力' }
    }
});
describe('Datepicker', () => {
    describe('property', () => {
        let datepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        /**
         * Html Attributes
         */
        it('Input element value attributes test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { "value": "3/3/17" } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker();
            datepicker.appendTo('#datepicker');
            expect(datepicker.element.value).toBe('3/3/2017');
            (<HTMLInputElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(getIdValue(document.querySelector('tr td.e-selected'))).toBe(new Date('3/3/17').valueOf());
        });
        it('Input element type attributes with date test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { "type": "date" } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker();
            datepicker.appendTo('#datepicker');
            expect(datepicker.element.getAttribute('type')).toBe('text');
        });
        it('Input element type attributes with time test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { "type": "time" } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker();
            datepicker.appendTo('#datepicker');
            expect(datepicker.element.getAttribute('type')).toBe('text');
        });
        it('Input element value attributes test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { "value": "3/3" } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker({ format: 'd/M' });
            datepicker.appendTo('#datepicker');
            expect(datepicker.element.value).toBe('3/3');
            expect(document.getElementsByClassName(' e-input-group')[0].classList.contains('e-error')).toBe(false);
        });
        it('Input element max attributes test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { "max": "3/3" } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker({ format: 'd/M' });
            datepicker.appendTo('#datepicker');
            expect(datepicker.max).toBe(null);
        });
        it('Input element min attributes test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { "min": "3/3" } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker({ format: 'd/M' });
            datepicker.appendTo('#datepicker');
            expect(datepicker.min).toBe(null);
        });
        it('Input element value html attributes along with control value property defined test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { "value": "3/3/17" } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker({ value: new Date('4/4/17') });
            datepicker.appendTo('#datepicker');
            expect(datepicker.element.value).toBe('4/4/2017');
            (<HTMLInputElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(getIdValue(document.querySelector('tr td.e-selected'))).toBe(new Date('4/4/17').valueOf());
        });
        it('Input element readonly attributes test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { 'readonly': 'readonly' } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker();
            datepicker.appendTo('#datepicker');
            expect(datepicker.readonly).toBe(true)
            expect(datepicker.element.getAttribute('readonly')).toBe('');
        });
        it('Input element readonly  test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { 'readonly': '' } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker();
            datepicker.appendTo('#datepicker');
            expect(datepicker.readonly).toBe(true)
            expect(datepicker.element.getAttribute('readonly')).toBe('');
        });
        it('Input element placeholder attributes test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { 'placeholder': 'Enter date' } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker();
            datepicker.appendTo('#datepicker');
            expect(datepicker.placeholder).toBe('Enter date')
        });
        it('Input element placeholder attributes with control property defined test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { 'placeholder': 'Enter date' } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker({ placeholder: 'select a date' });
            datepicker.appendTo('#datepicker');
            expect(datepicker.placeholder).toBe('select a date')
        });
        it('Input element disabled attributes test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { 'disabled': '' } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker({});
            datepicker.appendTo('#datepicker');
            expect(datepicker.enabled).toBe(false);
        });
        it('Input element min attributes test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { min: '3/3/17' } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker({});
            datepicker.appendTo('#datepicker');
            expect(datepicker.min.toDateString()).toBe(new Date('3/3/17').toDateString())
        });
        it('Input element min html attributes along with control min property defined test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { min: '3/3/17' } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker({ min: new Date('4/4/17') });
            datepicker.appendTo('#datepicker');
            expect(datepicker.min.toDateString()).toBe(new Date('4/4/17').toDateString())
        });
        it('Input element min html attributes along with control enabled property defined test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { disabled: 'disabled' } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker();
            datepicker.appendTo('#datepicker');
            expect(datepicker.enabled).toBe(false)
        });
        it('Input element max attributes test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { max: '3/3/17' } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker({});
            datepicker.appendTo('#datepicker');
            expect(datepicker.max.toDateString()).toBe(new Date('3/3/17').toDateString())
        });
        it('Input element max html attributes along with control max property defined test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { max: '3/3/17' } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker({ max: new Date('4/4/17') });
            datepicker.appendTo('#datepicker');
            expect(datepicker.max.toDateString()).toBe(new Date('4/4/17').toDateString())
        });
        it('Input element name attributes test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { name: 'Date' } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker({});
            datepicker.appendTo('#datepicker');
            expect(datepicker.element.getAttribute('name')).toBe('Date');
        });
        it('Input element style attributes test case', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { style: 'background:red' } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker({});

            datepicker.appendTo('#datepicker');
            expect(datepicker.element.getAttribute('style')).toBe("background:red");

        });
        it('width string type with value in px test case ', () => {
            datepicker = new DatePicker({ width: '200px' });
            datepicker.appendTo('#date');
            expect((<HTMLElement>document.querySelector('.e-date-wrapper')).style.width).toBe('200px');
        });
        it('string type with value test case ', () => {
            datepicker = new DatePicker({ value: <any>'2/2/2017' });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe('2/2/2017');
            expect(+datepicker.value).toBe(+new Date('2/2/2017'))
        });
        it('string type value with onproperty test case ', () => {
            datepicker = new DatePicker({ value: <any>'2/2/2017' });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe('2/2/2017');
            expect(+datepicker.value).toBe(+new Date('2/2/2017'));
            datepicker.value = "3/3/2017";
            datepicker.dataBind();
            expect(datepicker.element.value).toBe('3/3/2017');
            expect(+datepicker.value).toBe(+new Date('3/3/2017'));
        });
        it('IOS string type with value test case ', () => {
            datepicker = new DatePicker({ value: <any>"2017-02-01T18:30:00.000Z" });
            datepicker.appendTo('#date');
            expect(datepicker.element.value != '').toBe(true);
            expect(datepicker.value !== null).toBe(true);
        });
        it('width string type with value in em test case ', () => {
            datepicker = new DatePicker({ width: '200em' });
            datepicker.appendTo('#date');
            expect((<HTMLElement>document.querySelector('.e-date-wrapper')).style.width).toBe('200em');
        });
        it('width number type test case ', () => {
            datepicker = new DatePicker({ width: 200 });
            datepicker.appendTo('#date');
            expect((<HTMLElement>document.querySelector('.e-date-wrapper')).style.width).toBe('200px');
        });
        it('width 100% test case ', () => {
            datepicker = new DatePicker({});
            datepicker.appendTo('#date');
            expect((<HTMLElement>document.querySelector('.e-date-wrapper')).style.width).toBe('100%');
        });
        it('allowedit property with true test case ', () => {
            datepicker = new DatePicker({ allowEdit: true });
            datepicker.appendTo('#date');
            expect(datepicker.element.getAttribute('readonly')).toBe(null);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-datepicker.e-popup-wrapper').classList.contains('e-popup-wrapper')).toBe(true);
        });
        it('allowedit property with false test case ', () => {
            datepicker = new DatePicker({ allowEdit: false });
            datepicker.appendTo('#date');
            expect(datepicker.element.getAttribute('readonly')).toBe('');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-datepicker.e-popup-wrapper').classList.contains('e-popup-wrapper')).toBe(true);
        });
        it('allowedit onproperty test case ', () => {
            datepicker = new DatePicker({});
            datepicker.appendTo('#date');
            datepicker.allowEdit = false;
            datepicker.dataBind();
            expect(datepicker.element.getAttribute('readonly')).toBe('');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-datepicker.e-popup-wrapper').classList.contains('e-popup-wrapper')).toBe(true);
            datepicker.allowEdit = true;
            datepicker.dataBind();
            expect(datepicker.element.getAttribute('readonly')).toBe(null);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-datepicker.e-popup-wrapper').classList.contains('e-popup-wrapper')).toBe(true);
        });
        it('cssClass  test case', () => {
            datepicker = new DatePicker({
                cssClass: 'e-custom'
            });
            datepicker.appendTo('#date');
            expect(datepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            datepicker.dataBind();
        });
        it('multiple cssClass  test case', () => {
            datepicker = new DatePicker({
                cssClass: 'e-custom e-secondary-class'
            });
            datepicker.appendTo('#date');
            expect(datepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            expect(datepicker.inputWrapper.container.classList.contains('e-secondary-class')).toBe(true);
            datepicker.show();
            expect(datepicker.popupWrapper.classList.contains('e-custom')).toBe(true);
            expect(datepicker.popupWrapper.classList.contains('e-secondary-class')).toBe(true);
            datepicker.cssClass = "e-ternary e-cssClass";
            datepicker.dataBind();
            expect(datepicker.inputWrapper.container.classList.contains('e-ternary')).toBe(true);
            expect(datepicker.inputWrapper.container.classList.contains('e-cssClass')).toBe(true);
            datepicker.show();
            expect(datepicker.popupWrapper.classList.contains('e-ternary')).toBe(true);
            expect(datepicker.popupWrapper.classList.contains('e-cssClass')).toBe(true);

        });
        it('placeholder test case ', function () {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({
                placeholder: 'Pick the Date'
            });
            datepicker.appendTo('#date');
            expect(datepicker.placeholder).toBe('Pick the Date');
        });
        it('readonly test case ', function () {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({
                readonly: false
            });
            datepicker.appendTo('#date');
            expect(datepicker.readonly).toBe(false);
            expect(ele.getAttribute('readonly')).toBe(null);
        });
        it('enabled test case ', function () {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({
                enabled: false
            });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.enabled).toBe(false);
            expect(document.getElementById('date').getAttribute('aria-disabled')).toBe("true");
        });
        /**
         * value test case
         */
        it('value with null type test case ', () => {
            datepicker = new DatePicker({});
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('');
        });
        it('string value type test case ', () => {
            datepicker = new DatePicker({});
            datepicker.appendTo('#date');
            datepicker.value = '5/5/2017';
            datepicker.dataBind();
            expect(datepicker.value.valueOf()).toBe(stringToDateObj('5/5/2017'));
            expect(datepicker.element.value).toBe('5/5/2017');
        });
        it('string value worst test case ', () => {
            datepicker = new DatePicker({});
            datepicker.appendTo('#date');
            datepicker.value = '5/5';
            datepicker.dataBind();
            expect(+datepicker.value).toBe(+new Date('5/5/2001'));
            expect(datepicker.element.value).toBe('5/5/2001');
        });
        it('string value worst test case with format ', () => {
            datepicker = new DatePicker({ format: 'd/M' });
            datepicker.appendTo('#date');
            datepicker.value = '5/5';
            datepicker.dataBind();
            expect(datepicker.element.value).toBe('5/5');
        });
        it('value with date Object type test case ', () => {
            datepicker = new DatePicker({ value: new Date('3/3/2017'), format: 'M/d/yyyy' });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.value.valueOf()).toBe(stringToDateObj('3/3/2017'));
            expect(datepicker.element.value).toBe('3/3/2017');

        });
        it('value with invalid type  test case ', () => {
            datepicker = new DatePicker({ value: new Date('dfdf') });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('');
        });
        it('value test case ', () => {
            datepicker = new DatePicker({ value: new Date('3/3/2017') });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.element.value).toBe('3/3/2017');
        });
        it(' value with date not in a month test case', () => {
            datepicker = new DatePicker({});
            datepicker.appendTo('#date');
            datepicker.element.value = '31/9/2017';
            datepicker.inputBlurHandler();
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('31/9/2017');
            expect(document.getElementsByClassName(' e-input-group')[0].classList.contains('e-error')).toBe(true);
        });
        it('Invalid value with strictMode test case ', () => {
            datepicker = new DatePicker({ value: new Date('3/3/2017') });
            datepicker.appendTo('#date');
            datepicker.element.value = '3/55/2017';
            datepicker.inputBlurHandler();
            expect(datepicker.element.value).toBe('3/55/2017');
        });
        it('Input with different format value with test case ', () => {
            datepicker = new DatePicker({ value: new Date('3/3/2017') });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datepicker.element.value = '3/3/17';
            datepicker.inputBlurHandler();
            dateString(datepicker, '3/3/2017');
            expect(datepicker.element.value).toBe('3/3/2017');
        });
        it('value with format(y) test case ', () => {
            datepicker = new DatePicker({ value: new Date('2017'), format: 'y' });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            dateString(datepicker, '' + new Date('2017'));
            expect(datepicker.element.value).toBe('2017');
        });
        it('value with format(short) test case ', () => {
            datepicker = new DatePicker({ value: new Date('3/3/2017'), format: 'd/M/yy' });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            dateString(datepicker, '3/3/2017');
            expect(datepicker.element.value).toBe('3/3/17');
        });
        it('value with format(short) test case ', () => {
            datepicker = new DatePicker({ value: new Date('3/3/2017'), format: 'd/M/yy' });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            dateString(datepicker, '3/3/2017');
            expect(datepicker.element.value).toBe('3/3/17');
        });
        /**
         * format test case 
         */
        it('default format test case ', () => {
            datepicker = new DatePicker({ value: new Date('3/3/2017') });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.element.value).toBe('3/3/2017');
        });
        it('format(dddd/MMMM/yyyy) test case ', () => {
            datepicker = new DatePicker({ value: new Date('3/3/2017'), format: 'dddd/MMMM/yyyy' });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.element.value).toBe('3/March/2017');
        });
        it('format(ddd/MM/y) test case ', () => {
            datepicker = new DatePicker({ value: new Date('3/3/2017'), format: 'ddd/MM/y' });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.element.value).toBe('3/03/2017');
        });
        it(' custom format test case ', () => {
            datepicker = new DatePicker({ value: new Date('3/3/2017'), format: 'ddd/MMMMTet/y' });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.element.value).toBe('3/MarchTet/2017');
        });

        it(' format(ddd/MMMMMONTH/y) test case ', () => {
            datepicker = new DatePicker({ value: new Date('3/3/2017'), format: "ddd/MMMM'MONTH'/y" });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.element.value).toBe('3/MarchMONTH/2017');
        });

        it(' format(MMMM) test case ', () => {
            datepicker = new DatePicker({ value: new Date('3/3/2017'), format: 'MMMM' });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            dateString(datepicker, '' + new Date('3/3/2017'));
            expect(datepicker.element.value).toBe('March');
        });
        it('format(dddd/MMM) test case ', () => {
            datepicker = new DatePicker({ value: new Date('3/3/2017'), format: 'dddd/MMM' });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.element.value).toBe('3/Mar');
        });
        it('format(ddddd/MMMMWWW/y) test case ', () => {
            datepicker = new DatePicker({ value: new Date('3/3/2017'), format: "ddddd/MMMM'WWW'/y" });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.element.value).toBe('3/MarchWWW/2017');
        });
        /**
         * strictMode true test  case 
         */
        it('strictMode true with min and max as same value', () => {
            datepicker = new DatePicker({
                strictMode: true,
                value: new Date(),
                min: new Date('3/3/2017'),
                max: new Date('3/3/2017'),
                format: 'M/d/yyyy'
            });
            datepicker.appendTo('#date');
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.element.value).toBe('3/3/2017');
        });
        it('strictMode true with min greater than max ', () => {
            datepicker = new DatePicker({
                value: new Date('3/3/2017'),
                min: new Date('4/3/2017'),
                max: new Date('3/3/2017'),
                format: 'M/d/yyyy',
                strictMode: true
            });
            datepicker.appendTo('#date');
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.min.valueOf()).toBe(new Date('4/3/2017').valueOf());
            expect(datepicker.max.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.element.value).toBe('3/3/2017');
        });
        it('strictMode true with  min and max as same value', () => {
            datepicker = new DatePicker({
                strictMode: true,
                value: new Date(),
                min: new Date('3/3/2017'),
                max: new Date('3/3/2017'),
                format: 'M/d/yyyy'
            });
            datepicker.appendTo('#date');
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.element.value).toBe('3/3/2017');
        });
        it('strictMode with value higher than the max value test case', () => {
            datepicker = new DatePicker({ strictMode: true, value: new Date('4/4/9999'), format: 'M/d/yyyy' });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value.valueOf()).toBe(new Date('12/31/2099').valueOf());
            expect(datepicker.element.value).toBe('12/31/2099');
        });
        it('strictMode test case with value lower than the min value test case', () => {
            datepicker = new DatePicker({
                strictMode: true, value: new Date('1/1/1111'), format: 'M/d/y'
            });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value.valueOf()).toBe(new Date(1900, 0, 1).valueOf());
            expect(datepicker.element.value).toBe('1/1/1900');
        });
        it('strictMode with value out of min and max  test case ', () => {
            datepicker = new DatePicker({
                strictMode: true, value: new Date('3/3/2017'),
                min: new Date('4/4/2017'), max: new Date('6/6/2017'), format: 'M/d/yyyy'
            });
            datepicker.appendTo('#date');
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value.valueOf()).toBe(new Date('4/4/2017').valueOf());
            expect(datepicker.element.value).toBe('4/4/2017');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.min.valueOf()).toBe(new Date('4/4/2017').valueOf());
            expect(datepicker.max.valueOf()).toBe(new Date('6/6/2017').valueOf());
        });
        it('strictMode with invalid string test case  ', () => {
            datepicker = new DatePicker({ strictMode: true, value: new Date('5/5/2017'), format: 'M/d/yyyy' });
            datepicker.appendTo('#date');
            datepicker.element.value = 'erterg';
            datepicker.inputBlurHandler();
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value.valueOf()).toBe(new Date('5/5/2017').valueOf());
            expect(datepicker.element.value).toBe('5/5/2017');
        });
        it('strictMode with format test case  ', () => {
            datepicker = new DatePicker({ strictMode: true, format: 'y  /MMM/d' });
            datepicker.appendTo('#date');
            datepicker.element.value = '2017  /Mar/1';
            datepicker.inputBlurHandler();
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value.valueOf()).toBe(new Date('3/1/2017').valueOf());
            expect(datepicker.element.value).toBe('2017  /Mar/1');
            datepicker.element.value = '2017  /Mar/1dsfds';
            datepicker.inputBlurHandler();
            dateString(datepicker, '3/1/2017');
            expect(datepicker.element.value).toBe('2017  /Mar/1');
        });
        it('strictMode with invalid date test case ', () => {
            datepicker = new DatePicker({ strictMode: true, value: new Date('fd') });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('');
        });
        it('strictMode with null value test case ', () => {
            datepicker = new DatePicker({ strictMode: true, value: null });
            datepicker.appendTo('#date');
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('');
        });
        it('strictMode with null value in input element test case ', () => {
            datepicker = new DatePicker({ strictMode: true });
            datepicker.appendTo('#date');
            expect(datepicker.strictMode).toBe(true);
            datepicker.element.value = '';
            datepicker.inputBlurHandler();
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('');
        });
        it('strictMode with value in input element test case ', () => {
            datepicker = new DatePicker({ strictMode: true, value: new Date('4/4/2017'), format: 'M/d/yyyy' });
            datepicker.appendTo('#date');
            datepicker.element.value = '4/4/2017';
            datepicker.inputBlurHandler();
            expect(datepicker.value.valueOf()).toBe(new Date('4/4/2017').valueOf());
            expect(datepicker.value.valueOf()).toBe(new Date('4/4/2017').valueOf());
            expect(datepicker.strictMode).toBe(true);
            datepicker.element.value = '';
            datepicker.inputBlurHandler();
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('');
        });
        it('strictMode  true with null value test case ', () => {
            datepicker = new DatePicker({ strictMode: true });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('');
        });
        it('strictMode  true with value out of min test case ', () => {
            datepicker = new DatePicker({
                strictMode: true, value: new Date('3/3/2017'),
                min: new Date('4/4/2017'), max: new Date('6/6/2017'), format: 'M/d/yyyy'
            });
            datepicker.appendTo('#date');
            datepicker.element.value = '4/3/2017';
            datepicker.inputBlurHandler();
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value.valueOf()).toBe(new Date('4/4/2017').valueOf());
            expect(datepicker.element.value).toBe('4/4/2017');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.min.valueOf()).toBe(new Date('4/4/2017').valueOf());
            expect(datepicker.max.valueOf()).toBe(new Date('6/6/2017').valueOf());
        });
        it('strictMode  true with value out of max  test case ', () => {
            datepicker = new DatePicker({
                strictMode: true, value: new Date('3/3/2017'),
                min: new Date('4/4/2017'), max: new Date('6/6/2017'), format: 'M/d/yyyy'
            });
            datepicker.appendTo('#date');
            datepicker.element.value = '6/10/2017';
            datepicker.inputBlurHandler();
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value.valueOf()).toBe(new Date('6/6/2017').valueOf());
            expect(datepicker.element.value).toBe('6/6/2017');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.min.valueOf()).toBe(new Date('4/4/2017').valueOf());
            expect(datepicker.max.valueOf()).toBe(new Date('6/6/2017').valueOf());
        });
        it('strictMode  true test case ', () => {
            datepicker = new DatePicker({ strictMode: true, value: new Date('3/3/2017') });
            datepicker.appendTo('#date');
            datepicker.element.value = 'rtjrkebgjkdf';
            datepicker.inputBlurHandler();
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.element.value).toBe('3/3/2017');
        });
        it('one and two digit Format issue ', () => {
            datepicker = new DatePicker({
                strictMode: true, value: new Date('3/3/2017'),
                format: 'MM/dd/yyyy'
            });
            datepicker.appendTo('#date');
            datepicker.element.value = '04/3/2017';
            datepicker.inputBlurHandler();
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value.valueOf()).toBe(new Date('4/3/2017').valueOf());
            expect(datepicker.element.value).toBe('04/03/2017');
        });
        /**
         * strictMode false test case.
         */
        it('strictMode  false with value higher than the max value test case', () => {
            datepicker = new DatePicker({ strictMode: false, value: new Date('4/4/9999'), format: 'M/d/yyyy' });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.strictMode).toBe(false);
            expect(datepicker.value.valueOf()).toBe(new Date('4/4/9999').valueOf());
            expect(datepicker.element.value).toBe('4/4/9999');
        });
        it('strictMode false test case with value lower than the min value test case', () => {
            datepicker = new DatePicker({
                strictMode: false, value: new Date('1/1/1111'), format: 'M/d/yyyy'
            });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.strictMode).toBe(false);
            expect(datepicker.value.valueOf()).toBe(new Date('1/1/1111').valueOf());
            expect(datepicker.element.value).toBe('1/1/1111');
        });
        it('strictMode with value out of min and max  test case ', () => {
            datepicker = new DatePicker({ strictMode: false, value: new Date('3/3/2017'), min: new Date('4/4/2017'), max: new Date('6/6/2017'), format: 'M/d/yyyy' });
            datepicker.appendTo('#date');
            expect(datepicker.strictMode).toBe(false);
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.element.value).toBe('3/3/2017');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.min.valueOf()).toBe(new Date('4/4/2017').valueOf());
            expect(datepicker.max.valueOf()).toBe(new Date('6/6/2017').valueOf());
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
        });
        it('strictMode with invalid string test case  ', () => {
            datepicker = new DatePicker({ strictMode: true });
            datepicker.appendTo('#date');
            datepicker.element.value = 'erterg';
            datepicker.inputBlurHandler();
            expect(datepicker.strictMode).toBe(true);
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('');
        });
        it('strictMode with format test case  ', () => {
            datepicker = new DatePicker({ strictMode: false, format: 'y  /MMM/d' });
            datepicker.appendTo('#date');
            datepicker.element.value = '2017  /Mar/1';
            datepicker.inputBlurHandler();
            expect(datepicker.strictMode).toBe(false);
            dateString(datepicker, '3/1/2017');
            expect(datepicker.element.value).toBe('2017  /Mar/1');
        });
        it('strictMode with invalid date test case ', () => {
            datepicker = new DatePicker({ strictMode: false, value: new Date('fd') });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.strictMode).toBe(false);
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('');
        });
        it('strictMode with null value test case ', () => {
            datepicker = new DatePicker({ strictMode: false, value: null });
            datepicker.appendTo('#date');
            expect(datepicker.strictMode).toBe(false);
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('');
        });
        it('strictMode  true with null value test case ', () => {
            datepicker = new DatePicker({ strictMode: false });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.strictMode).toBe(false);
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('');
        });
        it('strictMode  false with value out of min and max  test case ', () => {
            datepicker = new DatePicker({
                strictMode: false, value: new Date('3/3/2017'),
                min: new Date('4/4/2017'), max: new Date('6/6/2017')
            });
            datepicker.appendTo('#date');
            datepicker.element.value = '3/3/2017';
            datepicker.inputBlurHandler();
            expect(datepicker.strictMode).toBe(false);
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
            expect(datepicker.element.value).toBe('3/3/2017');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.min.valueOf()).toBe(new Date('4/4/2017').valueOf());
            expect(datepicker.max.valueOf()).toBe(new Date('6/6/2017').valueOf());
        });
        it('strictMode  false test case ', () => {
            datepicker = new DatePicker({ strictMode: false });
            datepicker.appendTo('#date');
            datepicker.element.value = 'rtjrkebgjkdf';
            datepicker.inputBlurHandler();
            expect(datepicker.strictMode).toBe(false);
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('rtjrkebgjkdf');
        });

        it('strictMode false with outofrange value test case', () => {
            datepicker = new DatePicker({
                min: new Date('1/7/2018'),
                max: new Date('1/27/2018'),
                value: new Date('1/14/2018')
            });
            datepicker.appendTo('#date');
            datepicker.element.value = '1/29/2018';
            datepicker.inputBlurHandler();
            expect(datepicker.strictMode).toBe(false);
            expect(+datepicker.value).toBe(+new Date('1/29/2018'));
            expect(datepicker.element.value).toBe('1/29/2018');
        });
        it('strictMode and min with outofrange value test case', () => {
            datepicker = new DatePicker({
                min: new Date('1/7/2018'),
                value: new Date('1/3/2018')
            });
            datepicker.appendTo('#date');
            datepicker.element.value = '1/3/2018';
            datepicker.inputBlurHandler();
            expect(datepicker.strictMode).toBe(false);
            expect(+datepicker.value).toBe(+new Date('1/3/2018'));
            expect(datepicker.element.value).toBe('1/3/2018');
        });
        it('strictMode and max with outofrange value test case', () => {
            datepicker = new DatePicker({
                max: new Date('1/7/2018'),
                value: new Date('1/30/2018')
            });
            datepicker.appendTo('#date');
            datepicker.element.value = '1/30/2018';
            datepicker.inputBlurHandler();
            expect(datepicker.strictMode).toBe(false);
            expect(+datepicker.value).toBe(+new Date('1/30/2018'));
            expect(datepicker.element.value).toBe('1/30/2018');
        });
        it(' enableRtl  true test case', () => {
            datepicker = new DatePicker({ enableRtl: true });
            datepicker.appendTo('#date');
            expect(document.querySelector('.e-input-group').classList.contains('e-rtl')).toEqual(true);
        });
        it(' enableRtl  false test case', () => {
            datepicker = new DatePicker({ enableRtl: false });
            datepicker.appendTo('#date');
            expect(document.querySelector('.e-input-group').classList.contains('e-rtl')).toEqual(false);
        });
        it('strictMode false with out of range test case ', () => {
            datepicker = new DatePicker({
                value: new Date('3/3/9999'), min: new Date('3/3/2017'), max: new Date('3/30/2017')
                , change: function (args) {
                    expect(+args.value).toBe(+new Date('3/9/2017'));
                }
            });
            datepicker.appendTo('#date');
            expect(document.querySelector('.e-input-group').classList.contains('e-error')).toEqual(true);
            datepicker.value = new Date('3/9/2017');
            datepicker.dataBind();
        });
        it('strictMode false with out of range value onproperty change test case', () => {
            datepicker = new DatePicker({
                value: new Date('3/3/9999'), min: new Date('3/3/2017'), max: new Date('3/30/2017')
                , change: function (args) {
                    expect(+args.value).toBe(+new Date('3/9/2017'));
                }
            });
            datepicker.appendTo('#date');
            expect(document.querySelector('.e-input-group').classList.contains('e-error')).toEqual(true);
            datepicker.value = new Date('3/9/2017');
            datepicker.dataBind();
        });
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'moveLeft'
        };
        it('strictMode false with key test case ', () => {
            datepicker = new DatePicker({
                value: new Date('3/3/9999')
                , change: function (args) {
                    expect(+args.value).toBe(+new Date('3/3/9999'));
                }
            });
            datepicker.appendTo('#date');
            expect(document.querySelector('.e-input-group').classList.contains('e-error')).toEqual(true);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datepicker.inputKeyActionHandle(keyEventArgs);
            expect(document.querySelector('.e-focused-date').textContent).toBe('30');
            keyEventArgs.action = "moveRight";
            datepicker.inputKeyActionHandle(keyEventArgs);
            expect(document.querySelector('.e-focused-date').textContent).toBe('31');
        });
        it('strictMode false with key test case ', () => {
            datepicker = new DatePicker({
                value: new Date('3/3/2017')
                , change: function (args) {
                    expect(+args.value).toBe(+new Date('3/3/9999'));
                }
            });
            datepicker.appendTo('#date');
            expect(document.querySelector('.e-input-group').classList.contains('e-error')).toEqual(false);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            keyEventArgs.action = 'moveDown';
            datepicker.inputKeyActionHandle(keyEventArgs);
            expect(document.querySelector('.e-focused-date').textContent).toBe('10');
            datepicker.inputKeyActionHandle(keyEventArgs);
            expect(document.querySelector('.e-focused-date').textContent).toBe('17');
            keyEventArgs.action = 'controlUp';
            datepicker.inputKeyActionHandle(keyEventArgs);
            expect(document.querySelector('.e-title').textContent).toBe('2017');
            keyEventArgs.action = 'controlDown';
            datepicker.inputKeyActionHandle(keyEventArgs);
            expect(document.querySelector('.e-title').textContent).toBe('March 2017');
        });
        /**
         * zIndex
         */
        it('zIndex default value ', () => {
            datepicker = new DatePicker();
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            // expect(datepicker.popupWrapper.style.zIndex).toEqual('');            
            datepicker.zIndex = 2000;
            datepicker.dataBind();
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.popupWrapper.style.zIndex).toEqual('2000');
        });
        it('zIndex initial value change ', () => {
            datepicker = new DatePicker({ zIndex: 1500 });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.popupWrapper.style.zIndex).toEqual('1500');
        });

        it('value with input element test case', () => {
            datepicker = new DatePicker({
                format: 'M/d/y'
            });
            datepicker.appendTo('#date');
            datepicker.value = new Date('2/2/2017');
            datepicker.dataBind();
            dateString(datepicker, '2/2/2017');
            datepicker.element.value = '4/4/2017';
            datepicker.inputBlurHandler();
            datepicker.element.value = '4/4/2017';
            datepicker.inputBlurHandler();
            dateString(datepicker, '4/4/2017');
        });
        it('Input value  blur test case', () => {
            datepicker = new DatePicker({
                format: 'M/d/y'
            });
            datepicker.appendTo('#date');
            datepicker.element.value = '2/2/2017';
            datepicker.inputBlurHandler();
            expect(datepicker.element.value).toBe('2/2/2017');
            datepicker.element.value = '2/2/2019';
            datepicker.inputBlurHandler();
            expect(datepicker.element.value).toBe('2/2/2019');
            dateString(datepicker, '2/2/2019');

        });
        /**
         * Calendar property related test case
         */
        it('weekNumber test case', function () {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({
                weekNumber: true
            });
            datepicker.appendTo('#date');
            expect(datepicker.weekNumber).toBe(true);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-content tr td').length).toBe(48);
        });
        it('firstDayOfWeek test case', function () {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({
                firstDayOfWeek: 2
            });
            datepicker.appendTo('#date');
            expect(datepicker.firstDayOfWeek).toBe(2);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-content th')[0].textContent).toBe('Tu');
        });
        it('enableRtl test case', function () {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({
                enableRtl: true
            });
            datepicker.appendTo('#date');
            expect(datepicker.enableRtl).toBe(true);
            expect(document.querySelector('.e-date-wrapper').classList.contains('e-rtl')).toBe(true);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-calendar').classList.contains('e-rtl')).toEqual(true);
        });
        /**
         * Input test case
         */
        it('placeholder test case ', function () {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({
                placeholder: 'pick a date'
            });
            datepicker.appendTo('#date');
            expect(datepicker.placeholder).toBe('pick a date');
        });
        it('readonly true test case ', function () {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({
                readonly: true
            });
            datepicker.appendTo('#date');
            expect(datepicker.readonly).toBe(true);
            expect(ele.getAttribute('readonly')).toBe('');
        });
        it('readonly false test case ', function () {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({
                readonly: false
            });
            datepicker.appendTo('#date');
            expect(datepicker.readonly).toBe(false);
            expect(ele.getAttribute('readonly')).toBe(null);
        });
        it('enabled test case ', function () {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({
                enabled: false
            });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.enabled).toBe(false);
            expect(document.getElementById('date').getAttribute('aria-disabled')).toBe('true');
        });
        it('weekNumber test case ', function () {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({
                weekNumber: false
            });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datepicker.weekNumber = true;
            datepicker.dataBind();
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-content tr td').length).toBe(48);
            expect(document.querySelectorAll('.e-content tr').length).toBe(7);
            expect(datepicker.weekNumber).toBe(true);
        });
        /**
         * floatLabelType test cases
         */
        it('Element created with floatLabelType property with Auto type', () => {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({ placeholder: 'Select a date', floatLabelType: 'Auto' });
            datepicker.appendTo('#date');
            expect(datepicker.floatLabelType).toBe('Auto');
            expect(datepicker.inputWrapper.container.tagName == 'DIV').toBe(true);
            expect(datepicker.inputWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(datepicker.inputWrapper.container.children[1].classList.contains('e-float-line')).toBe(true);
            expect(datepicker.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(true);
            expect(datepicker.inputWrapper.container.children[2].classList.contains('e-label-bottom')).toBe(true);
            expect(datepicker.inputWrapper.container.children[2].innerText).toBe('Select a date');
            datepicker.value = new Date('04/16/2018');
            datepicker.dataBind();
            expect(datepicker.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
        });
        it('Element created with floatLabelType property with Always type', () => {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({ placeholder: 'Select a date', floatLabelType: 'Always' });
            datepicker.appendTo('#date');
            expect(datepicker.floatLabelType).toBe('Always');
            expect(datepicker.inputWrapper.container.tagName == 'DIV').toBe(true);
            expect(datepicker.inputWrapper.container.classList.contains('e-float-input')).toBe(true);
            expect(datepicker.inputWrapper.container.children[1].classList.contains('e-float-line')).toBe(true);
            expect(datepicker.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(true);
            expect(datepicker.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
            expect(datepicker.inputWrapper.container.children[2].innerText).toBe('Select a date');
            datepicker.value = new Date('04/16/2018');
            datepicker.dataBind();
            expect(datepicker.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
        });
        it('Element created with floatLabelType property with Never type', () => {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({ placeholder: 'Select a date', floatLabelType: 'Never' });
            datepicker.appendTo('#date');
            expect(datepicker.floatLabelType).toBe('Never');
            expect(datepicker.inputWrapper.container.tagName == 'SPAN').toBe(true);
            expect(datepicker.inputWrapper.container.classList.contains('e-float-input')).toBe(false);
            expect(datepicker.inputElement.getAttribute('placeholder')).toBe('Select a date');
            expect(datepicker.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(false);
        });
        /**
         * Attribute testing  
         */
        it('autocorrect attribute test case', () => {
            let ele = document.getElementById('date');
            datepicker = new DatePicker();
            datepicker.appendTo('#date');
            expect(datepicker.element.getAttribute('autocorrect') == 'off').toBe(true);
        });
        it('autocapitalize attribute test case', () => {
            let ele = document.getElementById('date');
            datepicker = new DatePicker();
            datepicker.appendTo('#date');
            expect(datepicker.element.getAttribute('autocapitalize') == 'off').toBe(true);
        });
        it('spellcheck attribute test case', () => {
            let ele = document.getElementById('date');
            datepicker = new DatePicker();
            datepicker.appendTo('#date');
            expect(datepicker.element.getAttribute('spellcheck') == 'false').toBe(true);
        });
        it('autocomplete attribute test case', () => {
            let ele = document.getElementById('date');
            datepicker = new DatePicker();
            datepicker.appendTo('#date');
            expect(datepicker.element.getAttribute('autocomplete') == 'off').toBe(true);
        });
        /**
         * DatePicker angular support
         */
        it('Control rendering test for angular support', () => {
            document.body.removeChild(document.getElementsByTagName('INPUT')[0]);
            let inputElement: HTMLElement = createElement('EJS-DATEPICKER');
            document.body.appendChild(inputElement);
            datepicker = new DatePicker();
            datepicker.appendTo(inputElement);
        });

    });
    // angular tag testing
    describe('Angular tag testing ', () => {
        let datepicker: any;
        beforeEach(() => {
            let element: any = createElement('EJS-DATEPICKER', { id: 'date' });
            element.setAttribute('name', 'angular');
            document.body.appendChild(element);
            datepicker = new DatePicker();
            datepicker.appendTo(element);
        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Wrapper testing ', () => {
            expect(datepicker.element.tagName).toEqual('EJS-DATEPICKER');
            expect(datepicker.element.getAttribute('name')).toBe(null);
            expect(datepicker.inputElement.getAttribute('name')).toBe('angular');
            expect(datepicker.element.classList.contains('e-datepicker')).toEqual(true);
            expect(datepicker.element.classList.contains('e-control')).toEqual(true);
            expect(datepicker.inputWrapper.container.classList.contains('e-date-wrapper')).toEqual(true);
            expect(datepicker.inputWrapper.container.children[0].classList.contains('e-control')).toEqual(true);
            expect(datepicker.inputElement.id).toEqual(datepicker.element.id + '_input');
        });
    });
    describe('notify property changes', () => {
        let date: DatePicker;
        let datepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);

        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('value test case', function () {
            datepicker = new DatePicker({
                format: 'M/d/y'
            });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datepicker.value = new Date('3/3/2016');
            datepicker.dataBind();
            dateString(datepicker, '3/3/2016');
            expect(datepicker.element.value).toBe('3/3/2016');
            datepicker.value = null;
            datepicker.dataBind();
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('');
        });
        it('strictMode true test case', function () {
            datepicker = new DatePicker({
                value: new Date('5/5/2017'), strictMode: true, format: 'M/d/yyyy'
            });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datepicker.value = new Date('3/3/2016');
            datepicker.dataBind();
            expect(datepicker.value.valueOf()).toBe(new Date('3/3/2016').valueOf());
            expect(datepicker.element.value).toBe('3/3/2016');
            datepicker.element.value = '';
            datepicker.inputBlurHandler();
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('');
            datepicker.value = new Date('4/4/2016');
            datepicker.dataBind();
            datepicker.element.value = 'hgbhj';
            datepicker.inputBlurHandler();
            expect(datepicker.value.valueOf()).toBe(new Date('4/4/2016').valueOf());
            expect(datepicker.element.value).toBe('4/4/2016');
            datepicker.element.value = '2/2/1000';
            datepicker.inputBlurHandler();
            expect(datepicker.value.valueOf()).toBe(new Date('1/1/1900').valueOf());
            expect(datepicker.element.value).toBe('1/1/1900');
            datepicker.element.value = '2/2/1000';
            datepicker.inputBlurHandler();
            expect(datepicker.value.valueOf()).toBe(new Date('1/1/1900').valueOf());
            expect(datepicker.element.value).toBe('1/1/1900');
            datepicker.element.value = '2/2/4000';
            datepicker.inputBlurHandler();
            dateString(datepicker, '12/31/2099');
            expect(datepicker.value.getTime()).toBe(new Date('12/31/2099').getTime());
            datepicker.element.value = '2/2/4000Test';
            datepicker.inputBlurHandler();
            dateString(datepicker, '12/31/2099');
            expect(datepicker.value.toDateString()).toBe(new Date('12/31/2099').toDateString());
        });
        it('strictMode false test case', function () {
            datepicker = new DatePicker({
                value: new Date('5/5/2017'), format: 'M/d/yyyy'
            });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datepicker.value = new Date('3/3/2016');
            datepicker.dataBind();
            dateString(datepicker, '3/3/2016');
            expect(datepicker.element.value).toBe('3/3/2016');
            datepicker.element.value = 'theritb';
            datepicker.inputBlurHandler();
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('theritb');
            datepicker.element.value = '4/4/2016';
            datepicker.inputBlurHandler();
            dateString(datepicker, '4/4/2016');
            expect(datepicker.element.value).toBe('4/4/2016');
            datepicker.element.value = '2/2/1000Test';
            datepicker.inputBlurHandler();
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('2/2/1000Test');
            datepicker.element.value = '2/2/2000';
            datepicker.inputBlurHandler();
            dateString(datepicker, '2/2/2000');
            expect(datepicker.element.value).toBe('2/2/2000');
            datepicker.element.value = '2/2/4000';
            datepicker.inputBlurHandler();
            expect(+datepicker.value).toBe(new Date('2/2/4000').valueOf());
            expect(datepicker.element.value).toBe('2/2/4000');
            datepicker.element.value = '2/2/4000Test';
            datepicker.inputBlurHandler();
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('2/2/4000Test');
        });
        it('format test case', function () {
            datepicker = new DatePicker({
            });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datepicker.value = new Date('3/3/2016');
            datepicker.dataBind();
            datepicker.format = 'M/d/yyyy';
            datepicker.dataBind();
            expect(datepicker.format).toBe('M/d/yyyy');
            dateString(datepicker, '3/3/2016');
            expect(datepicker.element.value).toBe('3/3/2016');
        });
        it('enableRtl  test case', () => {
            datepicker = new DatePicker({
            });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datepicker.enableRtl = true;
            datepicker.dataBind();
            expect(document.querySelector('.e-input-group').classList.contains('e-rtl')).toEqual(true);
            datepicker.enableRtl = false;
            datepicker.dataBind();
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-input-group').classList.contains('e-rtl')).toEqual(false);
            expect(document.querySelector('.e-calendar').classList.contains('e-rtl')).toEqual(false);
        });
        it('readonly test case', () => {
            datepicker = new DatePicker({
                readonly: true
            });
            datepicker.appendTo('#date');
            datepicker.readonly = true;
            datepicker.dataBind();
            expect(document.getElementById('date').getAttribute('readonly')).toBe('');
            datepicker.readonly = false;
            datepicker.dataBind();
        });
        it('enabled  test case', () => {
            datepicker = new DatePicker({
            });
            datepicker.appendTo('#date');
            datepicker.enabled = true;
            datepicker.dataBind();
            expect(document.getElementById('date').getAttribute('disabled')).toBe(null);
            datepicker.enabled = false;
            datepicker.dataBind();
            expect(document.getElementById('date').getAttribute('aria-disabled')).toBe("true");
        });
        it('strictMode  test case', () => {
            datepicker = new DatePicker({
                strictMode: true
            });
            datepicker.appendTo('#date');
            datepicker.strictMode = true;
            datepicker.strictMode = false;
            datepicker.dataBind();
        });
        it('cssClass  test case', () => {
            datepicker = new DatePicker({
                cssClass: 'e-custom'
            });
            datepicker.appendTo('#date');
            expect(datepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            datepicker.cssClass = 'e-custom-date';
            datepicker.dataBind();
            expect(datepicker.inputWrapper.container.classList.contains('e-custom-date')).toBe(true);

        });
        it('width  test case', () => {
            datepicker = new DatePicker({
                width: '300px'
            });
            datepicker.appendTo('#date');
            expect((<HTMLElement>document.querySelector('.e-date-wrapper')).style.width).toBe('300px');
            datepicker.width = '100px';
            datepicker.dataBind();
            expect((<HTMLElement>document.querySelector('.e-date-wrapper')).style.width).toBe('100px');
        });
        /**
         * input related test case 
         */
        it('placeholder test case', function () {
            datepicker = new DatePicker({
            });
            datepicker.appendTo('#date');
            let ele = document.getElementById('date');
            datepicker.placeholder = 'pick a date';
            datepicker.dataBind();
            expect(datepicker.placeholder).toBe('pick a date');
        });
        it('readonly test case ', function () {
            datepicker = new DatePicker({
            });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            let ele = document.getElementById('date');
            datepicker.readonly = true;
            datepicker.dataBind();
            expect(datepicker.readonly).toBe(true);
            expect(ele.getAttribute('readonly')).toBe('');
            datepicker.readonly = false;
            datepicker.dataBind();
            expect(datepicker.readonly).toBe(false);
            expect(ele.getAttribute('readonly')).toBe(null);
        });
        it('enabled test case ', function () {
            datepicker = new DatePicker({
            });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datepicker.enabled = true;
            datepicker.dataBind();
            expect(datepicker.enabled).toBe(true);
            expect(document.getElementById('date').getAttribute('disabled')).toBe(null);
            expect(document.getElementById('date').getAttribute('aria-disabled')).toBe('false');
            datepicker.enabled = false;
            datepicker.dataBind();
            expect(datepicker.enabled).toBe(false);
            expect(document.getElementById('date').getAttribute('aria-disabled')).toBe('true');
        });
        /**
         * renderDayCell event test case
         */
        it('renderDayCell with disabled date test case ', function () {
            datepicker = new DatePicker({
                min: new Date('2/2/2017'),
                max: new Date('2/20/2017'),
                renderDayCell: function (args: any): void {
                    if (args.date.getDate == 1) {
                        args.isDisabled = true;
                    }
                }
            });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        });
        //// it('renderDayCell with disabled date test case during initialization ', function () {
        //     datepicker = new DatePicker({
        //         value: new Date('3/3/17'),
        //         renderDayCell: function (args: any): void {
        //             if (args.date.getDate() == 3) {
        //                 args.isDisabled = true;
        //             }
        //         }
        //     });
        //     datepicker.appendTo('#date');
        //     expect(document.getElementsByClassName(' e-input-group')[0].classList.contains('e-error')).toBe(true);
        //     expect(document.querySelector('tr td.e-selected')).toBe(null);
        //     expect(datepicker.element.value).toBe('3/3/2017');
        //     expect(+datepicker.value).toBe(+ new Date('3/3/17'));
        //     (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);

        // });
        it('renderDayCell event with disabled date in strictMode true test case ', function () {
            datepicker = new DatePicker({
                min: new Date('1/2/2017'),
                max: new Date('1/2/2017'),
                value: new Date('1/4/2017'),
                strictMode: true,
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() == 4) {
                        args.isDisabled = true;
                    }
                }
            });
            datepicker.appendTo('#date');
            expect(document.querySelector('tr td.e-selected')).toBe(null);
            expect(datepicker.element.value).toBe('1/2/2017');
            expect(datepicker.value.valueOf()).toBe(new Date('1/2/2017').valueOf());
        });
        it('renderDayCell event with disabled date in strictMode false test case ', function () {
            datepicker = new DatePicker({
                min: new Date('1/2/2017'),
                max: new Date('1/20/2017'),
                value: new Date('4/4/2016'),
                strictMode: false,
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() == 4) {
                        args.isDisabled = true;
                    }
                }
            });
            datepicker.appendTo('#date');
            expect(document.querySelector('tr td.e-selected')).toBe(null);
            expect(datepicker.element.value).toBe('4/4/2016');
            expect(document.getElementsByClassName(' e-input-group')[0].classList.contains('e-error')).toBe(true);
        });
        it('onproperty change with disabled date in strictMode false test case', function () {
            datepicker = new DatePicker({
                min: new Date('1/2/2017'),
                max: new Date('1/20/2017'),
                value: new Date('4/4/2016'),
                strictMode: false,
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() == 4) {
                        args.isDisabled = true;
                    }
                }
            });
            datepicker.appendTo('#date');
            expect(document.querySelector('tr td.e-selected')).toBe(null);
            expect(datepicker.element.value).toBe('4/4/2016');
            expect(document.getElementsByClassName(' e-input-group')[0].classList.contains('e-error')).toBe(true);
            datepicker.value = new Date('3/4/2017');
            datepicker.dataBind();
            expect(datepicker.element.value).toBe('3/4/2017');
            expect(document.getElementsByClassName(' e-input-group')[0].classList.contains('e-error')).toBe(true);
        });
    });
    describe('public method', () => {
        let datepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);

        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('open method test case ', function () {
            datepicker = new DatePicker({
            });
            datepicker.appendTo('#date');
            datepicker.show();
        });
        // it('open method when the calendar is open test case', function () {
        //     datepicker = new DatePicker({
        //     });
        //     datepicker.appendTo('#date');
        //     (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        //     datepicker.show();
        // });
        //// it('close method test case ', function () {
        //     datepicker = new DatePicker({
        //     });
        //     datepicker.appendTo('#date');
        //     (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        //     datepicker.hide();
        // });
        it('focusIn method test case ', function () {
            datepicker = new DatePicker({
            });
            datepicker.appendTo('#date');
            datepicker.focusIn();
            expect(datepicker.element.parentElement.classList.contains('e-input-focus')).toBe(true);
            expect(document.activeElement).toBe(datepicker.element);
        });
        it('focusOut method test case ', function () {
            datepicker = new DatePicker({
            });
            datepicker.appendTo('#date');
            datepicker.focusOut();
            expect(datepicker.element.parentElement.classList.contains('e-input-focus')).toBe(false);
        });
    });
    describe('clear button related testing', () => {
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let date: DatePicker;
        let datepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            datepicker = new DatePicker({ value: new Date("12/12/2016"), showClearButton: true });
            datepicker.appendTo('#date');
        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('clear icon', () => {
            expect(datepicker.inputWrapper.clearButton.classList.contains('e-clear-icon')).toBe(true);
        });
        it('clear button default state', () => {
            expect(datepicker.value.valueOf()).toBe(new Date("12/12/2016").valueOf());
            expect(datepicker.inputWrapper.clearButton.classList.contains('e-clear-icon-hide')).toBe(true);
        });
        it('Clear button Setmodel', () => {
            datepicker.showClearButton = false;
            datepicker.dataBind();
            expect(document.body.querySelectorAll('e-clear-icon').length == 0);
            datepicker.showClearButton = true;
            datepicker.dataBind();
            expect(document.body.querySelectorAll('e-clear-icon').length != 0);
        });
        it('click on clear button without focus', () => {
            expect(datepicker.value.valueOf()).toBe(new Date("12/12/2016").valueOf());
            (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
            datepicker.resetHandler(mouseEventArgs);
            expect(datepicker.element.value).toBe("");
        });
    });

    describe('today button', () => {
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let date: DatePicker;
        let datepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            datepicker = new DatePicker({ value: new Date("12/12/2016"), showClearButton: true });
            datepicker.appendTo('#date');
        });
        afterEach(() => {
            if (date) {
                date.destroy();
            }
            document.body.innerHTML = '';
        });
        it('click test case', () => {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datepicker.todayElement.click();
            expect(datepicker.element.value).toBe(new Date().toLocaleDateString());
            expect(datepicker.value.valueOf()).toBe(+new Date(new Date().setHours(0, 0, 0, 0)));
            expect(datepicker.popupObj).toBe(null);
        });
    });
    describe('class', () => {
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let date: DatePicker;
        let datepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);

        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Without error class', () => {
            datepicker = new DatePicker({
                value: new Date("11/12/2017"), min: new Date("1/12/2017"),
                max: new Date("12/12/2017")
            });
            datepicker.appendTo('#date');
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(datepicker.element.value).toBe(new Date("11/12/2017").toLocaleDateString());
            expect(datepicker.value.valueOf()).toBe(+ new Date("11/12/2017"));
            expect(datepicker.popupObj).toBe(null);
        });
        it('value out of range with error class', () => {
            datepicker = new DatePicker({
                value: new Date("11/12/2018"), min: new Date("1/12/2017"),
                max: new Date("12/12/2017")
            });
            datepicker.appendTo('#date');
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(datepicker.element.value).toBe(new Date("11/12/2018").toLocaleDateString());
            expect(datepicker.value.valueOf()).toBe(+ new Date("11/12/2018"));
            expect(datepicker.popupObj).toBe(null);
        });

        it('value with max property error class test case ', () => {
            datepicker = new DatePicker({
                value: new Date(),
                max: new Date()
            });
            datepicker.appendTo('#date');
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(datepicker.element.value).toBe(new Date().toLocaleDateString());
            expect(datepicker.popupObj).toBe(null);
        });

        it('value with min property error class test case ', () => {
            datepicker = new DatePicker({
                value: new Date(),
                min: new Date()
            });
            datepicker.appendTo('#date');
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(datepicker.element.value).toBe(new Date().toLocaleDateString());
            expect(datepicker.popupObj).toBe(null);
        });
        it(' min with value out of range with error class', () => {
            datepicker = new DatePicker({
                value: new Date("1/10/2017"), min: new Date("1/12/2017")
            });
            datepicker.appendTo('#date');
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(datepicker.element.value).toBe(new Date("1/10/2017").toLocaleDateString());
            expect(datepicker.value.valueOf()).toBe(+ new Date("1/10/2017"));
            expect(datepicker.popupObj).toBe(null);
        });
        it('max with value out of range with error class', () => {
            datepicker = new DatePicker({
                value: new Date("1/15/2017"), max: new Date("1/12/2017")
            });
            datepicker.appendTo('#date');
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(datepicker.element.value).toBe(new Date("1/15/2017").toLocaleDateString());
            expect(datepicker.value.valueOf()).toBe(+ new Date("1/15/2017"));
            expect(datepicker.popupObj).toBe(null);
        });
        it('onproperty changes with error class test case', () => {
            datepicker = new DatePicker({
                min: new Date("1/11/2017"), max: new Date("1/15/2017")
            });
            datepicker.appendTo('#date');
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            datepicker.value = new Date('1/17/2017');
            datepicker.dataBind();
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(datepicker.element.value).toBe(new Date("1/17/2017").toLocaleDateString());
            expect(datepicker.value.valueOf()).toBe(+ new Date("1/17/2017"));
            expect(datepicker.popupObj).toBe(null);
        });
    });
    describe('keyboard events', () => {
        let datePicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'altDownArrow'
        };
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            let head: HTMLElement = createElement('head');
            document.body.appendChild(ele);
            document.body.appendChild(head);
        });
        afterEach(() => {
            if (datePicker) {
                datePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('alt+DownArrow key test case', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            keyEventArgs.action = 'altDownArrow';
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(document.getElementsByClassName('e-calendar')[0].classList.contains('e-calendar')).toBe(true);
        });

        it('leftarrow key with current date focus test case', function () {
            datePicker = new DatePicker({
                value: new Date()
            });
            datePicker.appendTo('#date');
            keyEventArgs.action = 'altDownArrow';
            datePicker.inputKeyActionHandle(keyEventArgs);
            keyEventArgs.action = 'moveLeft';
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(document.querySelector('.e-datepicker.e-popup-wrapper').classList.contains('e-popup-wrapper')).toBe(true);
            expect(document.getElementsByClassName('e-calendar')[0].classList.contains('e-calendar')).toBe(true);
        });

        it(' alt+UpArrow key test case', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            keyEventArgs.action = 'altUpArrow';
            datePicker.element.focus();
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(document.getElementsByClassName('e-calendar').length).toBe(0);
        });
        it(' escape key test case', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            keyEventArgs.action = 'escape'
            datePicker.element.focus();
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(document.getElementsByClassName('e-calendar').length).toBe(0);
        });
        it(' enter key test case', function () {
            datePicker = new DatePicker({
                format: 'M/d/y'
            });
            datePicker.appendTo('#date');
            keyEventArgs.action = 'enter';
            datePicker.element.value = '3/3/2017';
            datePicker.inputBlurHandler();
            datePicker.element.focus();
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(datePicker.element.value).toBe('3/3/2017');
            dateString(datePicker, '3/3/2017');
            expect(document.getElementsByClassName('e-calendar').length).toBe(0);
        });
        it(' control+UpArrow', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            keyEventArgs.action = 'escape'
            datePicker.element.focus();
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(document.getElementsByClassName('e-calendar').length).toBe(0);
        });
        it('control + down arrow test case ', () => {
            datePicker = new DatePicker({
                start: 'Decade'
            });
            datePicker.appendTo('#date');
            datePicker.element.focus();
            keyEventArgs.action = 'altDownArrow';
            datePicker.inputKeyActionHandle(keyEventArgs);
            keyEventArgs.action = 'controlDown';
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(datePicker.currentView()).toBe("Year");
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(datePicker.currentView()).toBe("Month");
        });
        it('keyboard action with mouse click on next icon test case ', () => {
            datePicker = new DatePicker({
                value: new Date('2/2/2017')
            });
            datePicker.appendTo('#date');
            datePicker.element.focus();
            keyEventArgs.action = 'altDownArrow';
            datePicker.inputKeyActionHandle(keyEventArgs);
            (<HTMLElement>document.querySelector('.e-prev span')).click();
            expect(document.querySelector('.e-title').textContent).toBe('January 2017');
        });
        it('keyboard action with mouse click on previous icon test case ', () => {
            datePicker = new DatePicker({
                value: new Date('2/2/2017')
            });
            datePicker.appendTo('#date');
            datePicker.element.focus();
            keyEventArgs.action = 'altDownArrow';
            datePicker.inputKeyActionHandle(keyEventArgs);
            (<HTMLElement>document.querySelector('.e-next span')).click();
            expect(document.querySelector('.e-title').textContent).toBe('March 2017');
        });
        it('esc key test case', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            keyEventArgs.action = 'escape';
            datePicker.CalendarKeyActionHandle(keyEventArgs);
        });
        it('enter key test case', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            keyEventArgs.action = 'escape';
            datePicker.CalendarKeyActionHandle(keyEventArgs);
            setTimeout(function () {
                expect(isNullOrUndefined(datePicker.popupWrapper)).toBe(true), 1000
            })
            keyEventArgs.action = 'enter';
            datePicker.CalendarKeyActionHandle(keyEventArgs);
            keyEventArgs.action = 'escape';
            datePicker.popupWrapper = datePicker.popupObj = null
            datePicker.CalendarKeyActionHandle(keyEventArgs);
            expect(document.activeElement).toBe(document.querySelector('.e-input'));
        });
        it('tab key when popup open test case', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            keyEventArgs.action = 'tab';
            datePicker.CalendarKeyActionHandle(keyEventArgs);
            setTimeout(function () {
                expect(isNullOrUndefined(datePicker.popupWrapper)).toBe(true), 1000
            })
            expect(datePicker.popupObj).toBe(null);
        });
        it('tab key when popup close test case', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            datePicker.element.focus();
            keyEventArgs.action = 'altDownArrow';
            datePicker.inputKeyActionHandle(keyEventArgs);
            keyEventArgs.action = 'tab';
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(datePicker.popupWrapper).toBe(null)
            expect(document.activeElement).toBe(datePicker.element);
        });
    });
    describe('events', () => {
        let datePicker: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: null,
            stopPropagation: (): void => { /** NO Code */ }
        };
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            let head: HTMLElement = createElement('head');
            document.body.appendChild(ele);
            document.body.appendChild(head);
        });
        afterEach(() => {
            if (datePicker) {
                datePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('selecting date in calendar test case', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datePicker.calendarElement.querySelector('.e-content td').dispatchEvent(clickEvent);
        });
        it('input element click test case ', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            datePicker.element.nextElementSibling.dispatchEvent(clickEvent);
        });
        it('input element click when the opoup is open test case', function () {
            datePicker = new DatePicker({
            });
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                currentTarget: null,
                target: null,
                stopPropagation: (): void => { /** NO Code */ }
            };
            datePicker.appendTo('#date');
            datePicker.element.nextElementSibling.dispatchEvent(clickEvent);
            datePicker.dateIconHandler(mouseEventArgs);
        });
        it('document click test case', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            mouseEventArgs.target = document.head;
            datePicker.documentHandler(mouseEventArgs);
        });
        it('document click when the calendar is open test case', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datePicker.documentHandler(mouseEventArgs);
        });
        it('DatePicker icon click test case', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName('e-date-icon')[0]).dispatchEvent(clickEvent);
            expect(document.getElementsByClassName('e-calendar')[0].classList.contains('e-calendar')).toBe(true);
        });
        it('navigated  test case', function () {
            datePicker = new DatePicker({
                navigated: function (args: any): void {
                    expect(args.view).toBe("Year");
                }
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datePicker.navigateTo("Year", new Date());
        });
        it('open event with preventing the popup test case', function () {
            datePicker = new DatePicker({
                open: function (args: any): void {
                    args.preventDefault();
                }
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(isNullOrUndefined(document.getElementsByClassName('e-popup')[0])).toBe(true);
        });
        it('change  event with preventing test case', function () {
            let e: object = {
                stopPropagation(): void {
                }
            }
            datePicker = new DatePicker({
                change: function (args: any): void {
                }
            });
            datePicker.appendTo('#date');
            datePicker.inputChangeHandler(e)
        });
        it('close event with preventing the close test case', function () {
            datePicker = new DatePicker({
                close: function (args: any): void {
                    args.preventDefault();
                    expect((document.getElementsByClassName('e-popup')[0]).classList.contains('e-popup-wrapper')).toBe(true);
                }
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datePicker.hide();
        });
        it('open event without preventing the popup test case', function () {
            datePicker = new DatePicker({
                open: function (args: any): void {
                }
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect((document.getElementsByClassName('e-popup')[0]).classList.contains('e-popup-wrapper')).toBe(true);
        });

        it('strictMode false with error class test case', function () {
            datePicker = new DatePicker({
                value: new Date('5/5/2017'),
                min: new Date('6/5/2017'),
                max: new Date('6/20/2017')
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        });

    });
    /**
     * Model dialog test case
     */
    describe('Model dialog', function () {
        let datepicker: any;
        beforeAll(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;

            document.body.appendChild(ele);
            datepicker = new DatePicker({
                value: new Date('4/4/2017')
            });
            datepicker.appendTo('#date');
        });
        afterAll(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
            let androidPhoneUa: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
        });
        it(' mobile test case', function () {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.getElementsByClassName('e-date-modal')[0].classList.contains('e-date-modal')).toBe(true);

        });
        it(' mobile header with today date test case', function () {
            datepicker.value = null;
            datepicker.dataBind();
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.getElementsByClassName('e-date-modal')[0].classList.contains('e-date-modal')).toBe(true);
        });
    });

    describe('method', function () {
        let datePicker: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: null,
            stopPropagation: (): void => { /** NO Code */ }
        };
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            let head: HTMLElement = createElement('head');
            document.body.appendChild(ele);
            document.body.appendChild(head);
        });
        afterEach(() => {
            if (datePicker) {
                datePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('currentView test case  ', function () {
            datePicker = new DatePicker({});
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datePicker.currentView()).toBe('Month')
        });
        it('currentView month test case  ', function () {
            datePicker = new DatePicker({});
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datePicker.currentView()).toBe('Month')
        });
        it('navigateTo  test case  ', function () {
            datePicker = new DatePicker({});
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datePicker.navigateTo('Month', new Date());
            expect(datePicker.currentView()).toBe('Month');
        });
        it('currentView month test case  ', function () {
            datePicker = new DatePicker({});
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datePicker.navigateTo('Month', new Date());
            expect(datePicker.currentView()).toBe('Month');
            expect(document.getElementsByClassName('e-content e-month')[0].classList.contains('e-month')).toBe(true);
        });
    });

    /**
    * method test case
    */
    describe('method', function () {
        let datepicker: any;
        beforeAll(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            datepicker = new DatePicker({
                value: new Date('4/4/2017')
            });
            datepicker.appendTo('#date');
        });
        afterAll(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('destroy test case', () => {
            datepicker.destroy();
            expect(document.getElementById('date').parentElement.classList.contains('e-input-group')).toBe(false);
        });
    });
    /**
    * DatePicker popup test case
    */
    describe('Popup', function () {
        let datepicker: any;
        beforeAll(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            datepicker = new DatePicker({
                value: new Date('4/4/2017')
            });
            datepicker.appendTo('#date');
        });
        afterAll(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('popup element visiblity test case', () => {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.popupObj.element.classList.contains('e-popup-wrapper')).toBe(true);
            expect(document.getElementsByClassName('e-popup-wrapper')[0].classList.contains('e-popup-wrapper')).toBe(true);
            datepicker.destroy();
            expect(isNullOrUndefined(document.getElementsByClassName('e-popup-wrapper')[0])).toBe(true);
            expect(isNullOrUndefined(datepicker.popupObj)).toBe(true);
            expect(isNullOrUndefined(datepicker.popupWrapper)).toBe(true);
        });
    });
    /**
     * Internationalization related test case
     */
    describe('Internationalization', function () {
        let datepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('default culture test case', () => {
            datepicker = new DatePicker({
                value: new Date('4/4/2017')
            });
            datepicker.appendTo('#date');
            datepicker.locale = 'en-US';
            datepicker.dataBind();
            expect(datepicker.locale).toBe('en-US');
            expect(datepicker.element.value).toBe('4/4/2017');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(getIdValue(document.querySelector('tr td.e-selected'))).toBe(new Date('4/4/17').valueOf())
        });
        it('firstDayOfWeek based on the culture "de" test case ', () => {
            loadCultureFiles('de', true);
            loadCultureFiles('de');
            datepicker = new DatePicker({ value: new Date('2/2/2017'), locale: 'de' });
            datepicker.appendTo('#date');
            expect(datepicker.firstDayOfWeek).toBe(1)
            expect(datepicker.tableHeadElement.querySelector('th').textContent).toBe('Mo.');
        });

        it('firstDayOfWeek based on the culture "ar" test case', () => {
            loadCultureFiles('ar', true);
            loadCultureFiles('ar');
            datepicker = new DatePicker({ value: new Date('2/2/2017'), locale: 'ar' });
            datepicker.appendTo('#date');
            // ClDR data 
            // expect(datepicker.firstDayOfWeek).toBe(6)
        });

        it(' culture(ja) test case', () => {
            loadCultureFiles('ja');
            datepicker = new DatePicker({
                value: new Date('4/4/2017'), locale: 'ja'
            });
            datepicker.appendTo('#date');
            expect(datepicker.locale).toBe('ja');
            expect(datepicker.element.value).toBe('2017/4/4');
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
        });

        it(' culture(de) test case', () => {
            loadCultureFiles('de');
            datepicker = new DatePicker({
                value: new Date('4/4/2017')
            });
            datepicker.appendTo('#date');
            datepicker.locale = 'de';
            datepicker.dataBind();
            expect(datepicker.locale).toBe('de');
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(datepicker.element.value).toBe('4.4.2017');
        });
    });
    describe('Date with time options', () => {
        let datepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('value with time', () => {
            datepicker = new DatePicker({
                format: 'dd/MM/yyyy H:mm', value: new Date('4/4/2017 4:00')
            });
            datepicker.appendTo('#date');
            expect(datepicker.value.toLocaleString()).toBe(new Date('4/4/2017 4:00 AM').toLocaleString());
            expect(datepicker.element.value).toBe('04/04/2017 4:00');
        })
        it('value with time onproperty change test case ', () => {
            datepicker = new DatePicker({
                format: 'dd/MM/yyyy H:mm', value: new Date('4/4/2017 4:00')
            });
            datepicker.appendTo('#date');
            datepicker.value = new Date('3/4/2017 3:00');
            datepicker.dataBind();
            expect(datepicker.value.toLocaleString()).toBe(new Date('3/4/2017 3:00 AM').toLocaleString());
            expect(datepicker.element.value).toBe('04/03/2017 3:00');
        })
        it('enabled onproperty change test case ', () => {
            datepicker = new DatePicker();
            datepicker.appendTo('#date');
            datepicker.enabled = false;
            datepicker.dataBind();
            expect(datepicker.inputElement.getAttribute('aria-disabled')).toBe('true');
            datepicker.enabled = true;
            datepicker.dataBind();
            expect(datepicker.inputElement.getAttribute('aria-disabled')).toBe('false');
        })
        it('enabled initial time change test case ', () => {
            datepicker = new DatePicker({ enabled: false });
            datepicker.appendTo('#date');
            expect(datepicker.inputElement.getAttribute('aria-disabled')).toBe('true');
        })
        it('value with format test case', () => {
            datepicker = new DatePicker({
                format: 'dd/MM/yyyy H:mm', value: new Date('4/4/2017')
            });
            datepicker.appendTo('#date');
            expect(datepicker.value.toLocaleString()).toBe(new Date('4/4/2017 0:00 AM').toLocaleString());
            expect(datepicker.element.value).toBe('04/04/2017 0:00');
        })
        it('value without time', () => {
            datepicker = new DatePicker({
                format: 'dd/MM/yyyy', value: new Date('4/4/2017')
            });
            datepicker.appendTo('#date');
            expect(datepicker.value.toLocaleString()).toBe(new Date('4/4/2017').toLocaleString());
            expect(datepicker.element.value).toBe('04/04/2017');
        })
        it('value greater than the min and max time test case ', () => {
            datepicker = new DatePicker({
                format: 'dd/MM/yyyy H:mm a',
                value: new Date('5/7/2017 2:00 AM'),
                min: new Date('1/1/2017 12:00 AM'),
                max: new Date('4/4/2017 1:00 AM')
            });
            datepicker.appendTo('#date');
            expect(+datepicker.value).toBe(new Date('5/7/2017 2:00 AM').valueOf());
            expect(datepicker.element.value).toBe('07/05/2017 2:00 AM');
            expect(document.getElementsByClassName(' e-input-group')[0].classList.contains('e-error')).toBe(true);
        })
        it('value with min and max time test case ', () => {
            datepicker = new DatePicker({
                format: 'dd/MM/yyyy H:mm a',
                value: new Date('4/5/2017 2:00 AM'),
                min: new Date('1/1/2017 12:00 AM'),
                max: new Date('4/8/2017 1:00 AM')
            });
            datepicker.appendTo('#date');
            expect(+datepicker.value).toBe(+new Date('4/5/2017 2:00 AM'));
            expect(datepicker.element.value).toBe('05/04/2017 2:00 AM');
            expect(document.getElementsByClassName(' e-input-group')[0].classList.contains('e-error')).toBe(false);
        })
        it(' min and max  with current date  test case ', () => {
            datepicker = new DatePicker({
                min: new Date('3/4/2018'), max: new Date('4/4/2018')
            });
            datepicker.appendTo('#date');
            expect(+datepicker.value).toBe(0);
            expect(datepicker.element.value).toBe('');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datepicker.contentElement.classList.contains('e-month')).toBe(true);
            expect(document.querySelector('.e-datepicker .e-calendar .e-title').textContent).toBe('April 2018');
            expect(datepicker.previousIcon.classList.contains('e-disabled')).toBe(false);
            expect(datepicker.nextIcon.classList.contains('e-disabled')).toBe(true);
            (<HTMLElement>document.querySelector('.e-datepicker .e-prev span')).click();
            expect(document.querySelector('.e-title').textContent).toBe('March 2018');
            expect(datepicker.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(datepicker.nextIcon.classList.contains('e-disabled')).toBe(false);
        });
        /**
         * Time Zone issue
         */
        // it('value with format(MM/dd/yyyy hh:mm a)test case ', () => {
        //     datepicker = new DatePicker({
        //         format: 'MM/dd/yyyy hh:mm a',
        //         value: new Date('4/5/2017 02:00 AM')
        //     });
        //     datepicker.appendTo('#date');
        //     expect(datepicker.value.toLocaleString()).toBe(new Date('4/5/2017 02:00 AM').toLocaleString());
        //     expect(datepicker.element.value).toBe('04/05/2017 02:00 AM');
        //     (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
        //     (<HTMLElement>document.querySelectorAll('.e-content td')[3]).click();
        //     expect(datepicker.element.value).toBe('03/29/2017 02:00 AM');
        //     expect(datepicker.value.toLocaleString()).toBe(new Date('03/29/2017 02:00 AM').toLocaleString());
        //     expect(document.getElementsByClassName(' e-input-group')[0].classList.contains('e-error')).toBe(false);
        // })
        it('value with format (MM/dd/yyyy H:mm a) test case ', () => {
            datepicker = new DatePicker({
                format: 'MM/dd/yyyy H:mm a',
                value: new Date('4/5/2017 21:00')
            });
            datepicker.appendTo('#date');
            // Date Parser issue
            // expect(datepicker.value.toLocaleString()).toBe(new Date('4/5/2017 9:00 AM').toLocaleString());
            // expect(datepicker.element.value).toBe('04/05/2017 9:00 AM');
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelectorAll('.e-content td')[3]).click();
            //// expect(datepicker.element.value).toBe('03/29/2017 21:00 PM');
            expect(datepicker.value.toLocaleString()).toBe(new Date('03/29/2017 9:00 PM').toLocaleString());
            expect(document.getElementsByClassName(' e-input-group')[0].classList.contains('e-error')).toBe(false);
        })
        it(' Unmatched value with format (MM/dd/yyyy hh:mm) test case ', () => {
            datepicker = new DatePicker({
                format: 'MM/dd/yyyy h:mm',
                value: new Date('4/5/2017 9:00')
            });
            datepicker.appendTo('#date');
            expect(datepicker.value.toLocaleString()).toBe(new Date('04/05/2017 9:00 AM').toLocaleString());
            expect(datepicker.element.value).toBe('04/05/2017 9:00');
            datepicker.element.value = "04/05/2017";
            datepicker.inputBlurHandler();
            // Date Parser issue
            // expect(datepicker.value).toBe(null);
            // expect(datepicker.element.value).toBe('4/5/2017');
            // expect(document.getElementsByClassName(' e-input-group')[0].classList.contains('e-error')).toBe(true);

        })
        it('min value with time (error case)', () => {
            datepicker = new DatePicker({ value: new Date('11/1/2017 14:00'), min: new Date('11/1/2017 16:00') });
            datepicker.appendTo('#date');
            expect(datepicker.value.valueOf()).toBe(new Date('11/1/2017 14:00').valueOf());
        });
        it('min value with time (strict Mode case)', () => {
            datepicker = new DatePicker({ strictMode: true, value: new Date('11/1/2017 14:00'), min: new Date('11/1/2017 16:00') });
            datepicker.appendTo('#date');
            expect(datepicker.value.valueOf()).toBe(new Date('11/1/2017 16:00').valueOf());
        });
        it('min value with time (lesser than current time)', () => {
            datepicker = new DatePicker({ value: new Date('11/3/2017 14:00'), min: new Date('11/1/2017 16:00') });
            datepicker.appendTo('#date');
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelectorAll('.e-content td')[3]).click();
            expect(datepicker.value.valueOf()).toBe(new Date('11/1/2017 16:00').valueOf());
        });
        it('max value with time (greater than current time)', () => {
            datepicker = new DatePicker({ value: new Date('11/3/2017 23:00'), max: new Date('11/5/2017 16:00') });
            datepicker.appendTo('#date');
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelectorAll('.e-content td')[7]).click();
            expect(datepicker.value.valueOf()).toBe(new Date('11/5/2017 16:00').valueOf());
        });
        it('min value with time (strictMode false)', () => {
            datepicker = new DatePicker({ value: new Date('11/3/2017 14:00'), format: 'MM/dd/yyyy h:mm', min: new Date('11/1/2017 16:00') });
            datepicker.appendTo('#date');
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
            datepicker.element.value = "11/1/2017 14:00";
            datepicker.inputBlurHandler();
            expect(datepicker.value.valueOf()).toBe(new Date('11/1/2017 14:00').valueOf());
        });
        it('min value with time (strictMode true)', () => {
            datepicker = new DatePicker({ value: new Date('11/3/2017 14:00'), strictMode: true, format: 'MM/dd/yyyy h:mm', min: new Date('11/1/2017 16:00') });
            datepicker.appendTo('#date');
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
            datepicker.element.value = "11/1/2017 14:00";
            datepicker.inputBlurHandler();
            expect(datepicker.value.valueOf()).toBe(new Date('11/1/2017 16:00').valueOf());
        });
        it('Calendar view after setting the value as null through onproperty changes', () => {
            datepicker = new DatePicker({ value: new Date('10/3/2017 14:00') });
            datepicker.appendTo('#date');
            datepicker.value = null;
            datepicker.dataBind();
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-focused-date').classList.contains('e-today')).toBe(true);
        });
    });
    describe('Form element', () => {
        let datepicker: any;
        beforeEach(() => {
            let formEle: HTMLElement = createElement('form', { id: "form-element" });
            let Ele: HTMLElement = createElement('input', { id: "datepicker" });
            formEle.appendChild(Ele);
            document.body.appendChild(formEle);
        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Input element value rest test case', () => {
            datepicker = new DatePicker({ value: new Date() });
            datepicker.appendTo('#datepicker');
            (<any>document.getElementById("form-element")).reset();
            expect(datepicker.element.value).toBe('');
            expect(datepicker.value).toBe(null);
        });
        it('Form rest with floatLabeltype("Auto") property test case', () => {
            datepicker = new DatePicker({ value: new Date(), floatLabelType: "Auto" });
            datepicker.appendTo('#datepicker');
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            (<any>document.getElementById("form-element")).reset();
            expect(document.querySelector('.e-float-text').classList.contains('e-label-bottom')).toBe(true);
            expect(datepicker.element.value).toBe('');
        });
        it('Form rest with floatLabeltype("Always") property test case', () => {
            datepicker = new DatePicker({ value: new Date(), floatLabelType: "Always" });
            datepicker.appendTo('#datepicker');
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            (<any>document.getElementById("form-element")).reset();
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            expect(datepicker.element.value).toBe('');
        });
        it('Form rest with floatLabeltype("Never") property test case', () => {
            datepicker = new DatePicker({ value: new Date(), floatLabelType: "Never" });
            datepicker.appendTo('#datepicker');
            expect(document.querySelector('.e-float-text')).toBe(null);
            (<any>document.getElementById("form-element")).reset();
            expect(document.querySelector('.e-float-text')).toBe(null);
            expect(datepicker.element.value).toBe('');
        });
    });
    describe('Form element with value ', () => {
        let datepicker: any;
        beforeEach(() => {
            let formEle: HTMLElement = createElement('form', { id: "form-element" });
            let Ele: HTMLElement = createElement('input', { id: "datepicker", attrs: { value: '02/02/2017' } });
            formEle.appendChild(Ele);
            document.body.appendChild(formEle);
        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Input element value rest test case', () => {
            datepicker = new DatePicker({ value: new Date() });
            datepicker.appendTo('#datepicker');
            (<any>document.getElementById("form-element")).reset();
            expect(datepicker.element.value).toBe('02/02/2017');
            expect(+datepicker.value).toBe(+new Date('2/2/2017'));
        });
    });

    describe('open event customization ', () => {
        let datepicker: any;
        beforeEach(() => {
            let input: HTMLElement = createElement('input', { id: "datepicker" });
            document.body.appendChild(input);
        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('PopupCreated event appendTo input container test case ', () => {
            datepicker = new DatePicker({
                value: new Date(), open: function (args: PopupObjectArgs) {
                    args.appendTo = this.inputWrapper.container;
                }
            });
            datepicker.appendTo('#datepicker');
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(datepicker.popupObj.element.parentElement).toBe(datepicker.inputWrapper.container);
        });
        it('PopupCreated event appendTo body test case ', () => {
            datepicker = new DatePicker({
                value: new Date(), open: function (args: PopupObjectArgs) {
                }
            });
            datepicker.appendTo('#datepicker');
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(datepicker.popupObj.element.parentElement).toBe(document.body);
        });
        it('PopupCreated event  relateTo  body test case ', () => {
            datepicker = new DatePicker({
                value: new Date(), open: function (args: PopupObjectArgs) {
                    args.popup.relateTo = document.body;
                }
            });
            datepicker.appendTo('#datepicker');
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(datepicker.popupObj.relateTo).toBe(document.body);
        });
        it('PopupCreated event  offsetY  body test case ', () => {
            datepicker = new DatePicker({
                value: new Date(), open: function (args: PopupObjectArgs) {
                    args.popup.offsetY = 20;
                }
            });
            datepicker.appendTo('#datepicker');
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(datepicker.popupObj.offsetY).toBe(20);
        });
        it('PopupCreated event  collision  body test case ', () => {
            datepicker = new DatePicker({
                value: new Date(), open: function (args: PopupObjectArgs) {
                    args.popup.collision = { X: 'flip' };
                }
            });
            datepicker.appendTo('#datepicker');
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(datepicker.popupObj.collision.X).toBe('flip');
        });
        it('PopupCreated event  position  body test case ', () => {
            datepicker = new DatePicker({
                value: new Date(), open: function (args: PopupObjectArgs) {
                    args.popup.position = { X: 'right', Y: 'top' };
                }
            });
            datepicker.appendTo('#datepicker');
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(datepicker.popupObj.position.X).toBe('right')
        });
    });
});