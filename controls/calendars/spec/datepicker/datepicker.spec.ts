import { DatePicker, PopupObjectArgs } from "../../src/datepicker/datepicker";
import { Component, EventHandler, Property, Event, CreateBuilder, Internationalization, setCulture, Ajax } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { cldrData, loadCldr, Touch, SwipeEventArgs, L10n, Browser } from '@syncfusion/ej2-base';
import { createElement, removeClass, remove, addClass, setStyleAttribute } from '@syncfusion/ej2-base';
import { isNullOrUndefined, merge, getEnumValue, getValue, getUniqueID } from '@syncfusion/ej2-base';
import '../../node_modules/es6-promise/dist/es6-promise';
import { Calendar, ChangedEventArgs, Islamic } from '../../src/index';
import  {profile , inMB, getMemoryProfile} from '../common/common.spec';


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
    files.push('weekData.json');
    for (let prop of files) {
        let val: Object;
        let ajax: Ajax;
        if (base || prop === 'weekData.json') {
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
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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
        it('invalid string type with value test case', () => {
            datepicker = new DatePicker({ value: <any>"hgfnfhg" });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe("hgfnfhg");
            expect(datepicker.value).toBe(null)
        });
        it('invalid object type with value test case', () => {
            datepicker = new DatePicker({ value: <any>{ab:'bc'} });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe("");
            expect(datepicker.value).toBe(null)
        });
        it('invalid object type with value onproperty test case', () => {
            datepicker = new DatePicker({ value: <any>'12/12/2012' });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe("12/12/2012");
            datepicker.value = <any>{ab:'bc'};
            datepicker.dataBind();
            expect(datepicker.element.value).toBe("");
            expect(datepicker.value).toBe(null)
        });
        it('invalid number type with value test case ', () => {
            datepicker = new DatePicker({ value: <any>12243 });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe("12243");
            expect(datepicker.value).toBe(null)
        });
        it('invalid string type with value test case and strictMode true ', () => {
            datepicker = new DatePicker({ value: <any>"hgfnfhg", strictMode:true });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe("");
            expect(datepicker.value).toBe(null)
        });
        it('invalid number type with value test case and strictMode true', () => {
            datepicker = new DatePicker({ value: <any>12243, strictMode:true });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe("");
            expect(datepicker.value).toBe(null)
        });
        it('invalid number type with value test case and strictMode conditions', () => {
            datepicker = new DatePicker({ value: <any>12243, strictMode:true });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe("");
            datepicker.strictMode = false;
            datepicker.value = <any>"avdsaghd";
            datepicker.dataBind();
            expect(datepicker.element.value).toBe("avdsaghd");
            expect(datepicker.value).toBe(null)
            datepicker.value = <any>12345;
            datepicker.dataBind();
        });
        it('invalid string type with ISO string value on property test case', () => {
            datepicker = new DatePicker({ value: <any>'2/2/2017' });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe('2/2/2017');
            datepicker.value = "2019-01-01T06:00:00.000Z";
            datepicker.dataBind();
            expect(datepicker.element.value).toBe("1/1/2019");
            expect(datepicker.invalidValueString).toBe(null);
        });
        it('string type with format on property test case', () => {
            datepicker = new DatePicker({ value: <any>'2/2/2017' });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe('2/2/2017');
            datepicker.format = 'dd/MM/yyyy';
            datepicker.value = "19/05/1997";
            datepicker.dataBind();
            expect(datepicker.element.value).toBe("19/05/1997");
            expect(+datepicker.value).toBe(+new Date("05/19/1997"));
            expect(datepicker.invalidValueString).toBe(null);
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
        it('allowedit property with e-non-edit calss ', () => {
            datepicker = new DatePicker({value: new Date('3/3/2017')});
            datepicker.appendTo('#date');
            expect(datepicker.element.getAttribute('readonly')).toBe(null);
            expect(datepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-datepicker.e-popup-wrapper').classList.contains('e-popup-wrapper')).toBe(true);
            datepicker.allowEdit = false;
            datepicker.dataBind();
            expect(datepicker.element.getAttribute('readonly')).toBe('');
            expect(datepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(true);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-datepicker.e-popup-wrapper').classList.contains('e-popup-wrapper')).toBe(true);
        });
        it('allowedit property with e-non-edit calss with readonly', () => {
            datepicker = new DatePicker({value: new Date('3/3/2017')});
            datepicker.appendTo('#date');
            expect(datepicker.element.getAttribute('readonly')).toBe(null);
            expect(datepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
            datepicker.allowEdit = false;
            datepicker.readonly = true;
            datepicker.dataBind();
            expect(datepicker.element.getAttribute('readonly')).toBe('');
            expect(datepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
        });
        it('allowedit property invalid value with e-non-edit calss  ', () => {
            datepicker = new DatePicker({});
            datepicker.appendTo('#date');
            datepicker.value = 'invalid';
            datepicker.dataBind();
            expect(datepicker.element.getAttribute('readonly')).toBe(null);
            expect(datepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-datepicker.e-popup-wrapper').classList.contains('e-popup-wrapper')).toBe(true);
            datepicker.allowEdit = false;
            datepicker.dataBind();
            expect(datepicker.element.getAttribute('readonly')).toBe('');
            expect(datepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(true);
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
         * tabIndex
         */
        it('tab index of focus element', () => {
            datepicker = new DatePicker({ });
            datepicker.appendTo('#date');
            expect(datepicker.inputWrapper.container.children[0].getAttribute('tabindex') === '0').toBe(true);
        });
        it('while give tab index to the datepicker element', () => {
            datepicker = new DatePicker({ });
            datepicker.appendTo('#date');
            datepicker.element.tabIndex = '4';
            expect(datepicker.inputWrapper.container.children[0].getAttribute('tabindex') === '4').toBe(true);
        });
        it('tab index of focus element in disable state ', () => {
            datepicker = new DatePicker({ enabled: false });
            datepicker.appendTo('#date');
            expect(datepicker.inputWrapper.container.children[0].tabIndex === -1).toBe(true);
            datepicker.enabled = true;
            datepicker.dataBind();
        });
        it('Tab index checking while destroy the component', () => {
            let inputEle: HTMLElement = createElement('input', { id: 'datepicker', attrs: { "tabindex": "1" } });
            document.body.appendChild(inputEle);
            datepicker = new DatePicker({  });
            datepicker.appendTo('#datepicker');
            datepicker.destroy();
            expect(inputEle.getAttribute('tabindex') === '1' ).toBe(true);
            datepicker = null;
        });
        it('Tab index checking while destroy the Angular component', () => {
            let element: any = createElement('ejs-datepicker', { id: 'date' });
            element.setAttribute('tabindex', '1');
            document.body.appendChild(element);
            datepicker = new DatePicker();
            datepicker.appendTo(element);
            datepicker.destroy();
            expect(element.getAttribute('tabindex') === null ).toBe(true);
            datepicker = null;
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
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('5/5');
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
        it('value with string type test case ', () => {
            datepicker = new DatePicker({ value: <any>('3/3/2017') });
            datepicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            datepicker.element.value = '3/3/17';
            datepicker.inputBlurHandler();
            dateString(datepicker, '3/3/2017');
            expect(datepicker.element.value).toBe('3/3/2017');
            
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
        it('object type format test case', () => {
            datepicker = new DatePicker({ format: { skeleton:'full'}, value: new Date("12/12/2016") });
            datepicker.appendTo('#date');
            expect(datepicker.element.value == 'Monday, December 12, 2016').toBe(true);
        });
        it('object type format onproperty Change test case', () => {
            datepicker = new DatePicker({value: new Date("12/12/2016") });
            datepicker.appendTo('#date');
            datepicker.format = {skeleton:'full'};
            datepicker.dataBind();
            expect(datepicker.element.value == 'Monday, December 12, 2016').toBe(true);
        });
        it('valid value entering when popup is in the open state', function () {
            datepicker = new DatePicker({});
            datepicker.appendTo('#date');
            datepicker.show();
            datepicker.value = new Date('1/1/2019');
            datepicker.dataBind();
            datepicker.focusOut();
            expect(datepicker.element.value).toBe('1/1/2019');
            expect(document.getElementsByClassName('e-input-group')[0].classList.contains('e-error')).toBe(false);
        });
        it('invalid value entering when popup is in the open state', function () {
            datepicker = new DatePicker({});
            datepicker.appendTo('#date');
            datepicker.show();
            datepicker.element.value = 'fdsgjsg';
            datepicker.inputBlurHandler();
            expect(datepicker.value).toBe(null);
            expect(datepicker.element.value).toBe('fdsgjsg');
            expect(document.getElementsByClassName('e-input-group')[0].classList.contains('e-error')).toBe(true);
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

        it('Date Format without year issue ', () => {
            datepicker = new DatePicker({
                value: new Date('1/7/1900'),
                min: new Date('1/1/1900'),
                max: new Date('12/31/1900'),
                format: "dd.MM",
            });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe('07.01');
        });
        it('Date Format without year issue with strictmode ', () => {
            datepicker = new DatePicker({
                value: new Date('1/7/2019'),
                min: new Date('1/1/1900'),
                max: new Date('12/31/1900'),
                format: "dd.MM",
                strictMode: true
            });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe('31.12');
        });
        it('Date Format without year issue with blur ', () => {
            datepicker = new DatePicker({
                value: new Date('1/7/1900'),
                min: new Date('1/1/1900'),
                max: new Date('12/31/1900'),
                format: "dd.MM",
                strictMode: true
            });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe('07.01');
            datepicker.element.focus();
            datepicker.inputBlurHandler();
            expect(datepicker.element.value).toBe('07.01');
        });
        it('Date Format without year issue with disabled ', () => {
            datepicker = new DatePicker({
                value: new Date('1/7/1900'),
		        min: new Date('1/1/1900'),
		        max: new Date('12/31/1900'),
		        format: "dd.MM",
		        strictMode: true,
		        enabled: false
            });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe('07.01');
        });
        it('Date Format without year issue with inputHandler ', () => {
            datepicker = new DatePicker({
                value: new Date('1/7/1900'),
		        min: new Date('1/1/1900'),
		        max: new Date('12/31/1900'),
		        format: "dd.MM",
		        strictMode: true
            });
            datepicker.appendTo('#date');
            expect(datepicker.element.value).toBe('07.01');
            datepicker.focusIn();
            datepicker.inputHandler();
            expect(datepicker.isPopupClicked).toBe(false);
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
        it('Error Class for start value before 1905-Chrome testing',()=>{
            datepicker = new DatePicker();
            datepicker.appendTo('#date');
            datepicker.inputElement.value = '1/1/1900';
            datepicker.dataBind();
            datepicker.inputBlurHandler();
            expect((<HTMLElement>document.getElementsByClassName('e-date-wrapper')[0]).classList.contains('e-error')).toBe(false);
            expect(+datepicker.value).toBe(+new Date('1/1/1900'));
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
        it('floatLabelType onproperty test case', () => {
            let ele = document.getElementById('date');
            datepicker = new DatePicker({ placeholder: 'Select a date' });
            datepicker.appendTo('#date');            
            datepicker.floatLabelType = "Auto";
            datepicker.dataBind();
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
            expect(datepicker.element.classList.contains('e-lib')).toEqual(true);
            expect(datepicker.inputWrapper.container.classList.contains('e-date-wrapper')).toEqual(true);
            expect(datepicker.inputWrapper.container.children[0].classList.contains('e-lib')).toEqual(true);
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
    describe('Change the value via keyboard to check isInteracted', () => {
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation: ():void=>{/** NO Code */},
            action: 'altDownArrow'
        };
        let datepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            datepicker = new DatePicker({ value: new Date("12/12/2016") });
            datepicker.appendTo('#date');
        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Key events enter after changing value', () => {
            datepicker.inputElement.value = '1/1/1900';
            keyEventArgs.action = 'enter';
            datepicker.inputKeyActionHandle(keyEventArgs);
            expect(datepicker.changedArgs.isInteracted).toBe(true);
            datepicker.value = new Date('2/2/2000');
            datepicker.dataBind();
            datepicker.changeEvent(keyEventArgs);
            expect(datepicker.changedArgs.isInteracted).toBe(false);
            datepicker.inputElement.value = '3/3/2010';
            keyEventArgs.action = 'tab';
            datepicker.inputKeyActionHandle(keyEventArgs);
            expect(datepicker.changedArgs.isInteracted).toBe(true);
            datepicker.inputElement.value = '5/5/2020';
            datepicker.inputBlurHandler();
            expect(datepicker.changedArgs.isInteracted).toBe(true);
        });
    });
    describe('Change the value via mouse to check isInteracted', () => {
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let datepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            datepicker = new DatePicker({ value: new Date("12/12/2016") });
            datepicker.appendTo('#date');
        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Key events enter after changing value', () => {
            datepicker.clear(mouseEventArgs);
            expect(datepicker.changedArgs.isInteracted).toBe(true);
            datepicker.value = new Date('2/2/2000');
            datepicker.dataBind();
            datepicker.changeEvent(mouseEventArgs);
            expect(datepicker.changedArgs.isInteracted).toBe(false);
            datepicker.inputElement.value = '5/5/2020';
            datepicker.inputBlurHandler();
            expect(datepicker.changedArgs.isInteracted).toBe(true);
        });
    });
    describe('Change the same value with interaction and without interaction', () => {
        let datepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            datepicker = new DatePicker({ value: new Date("12/12/2016") });
            datepicker.appendTo('#date');
        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Key events enter after changing value', () => {
            datepicker.todayElement.click();
            expect(datepicker.changedArgs.isInteracted).toBe(true);
            datepicker.value = new Date();
            datepicker.dataBind();
            datepicker.inputElement.value = '5/5/2020';
            datepicker.inputBlurHandler();
            expect(datepicker.changedArgs.isInteracted).toBe(true);
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
        it('clear button with destroy state', () => {
            datepicker.showClearButton = false;
            datepicker.dataBind();
            datepicker.destroy();
            expect(datepicker.inputWrapper.clearButton===null).toBe(true);
            datepicker = null;
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

    describe('Remove selected date while cleared using backspace key', () => {
        let datePicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (datePicker) {
                datePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Remove selected date', function () {
            datePicker = new DatePicker({
                value: new Date('2/2/2017'),
            });
            datePicker.appendTo('#date');
            datePicker.element.value = "";
            datePicker.show();
            expect((getIdValue(datePicker.tableBodyElement.querySelector('tr td.e-focused-date')))).toBe(new Date('2/2/2017').valueOf());
            expect(datePicker.tableBodyElement.querySelector('td.e-focused-date').classList.contains('e-selected-date')).toBe(false);
        });
        it('Check Start and Depth as Year', function () {
            datePicker = new DatePicker({
                start: 'Year',
                depth: 'Year'
            });
            datePicker.appendTo('#date');
            let e ={
                preventDefault : () => {},
                target: document.getElementById('date')
            }
            document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0].dispatchEvent(clickEvent);
            expect(datePicker.popupObj != null).toBe(true);
            document.getElementsByClassName('e-day')[3].dispatchEvent(clickEvent)
            expect(datePicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
            document.getElementsByTagName('body')[0].dispatchEvent(clickEvent)
            e.target = document.getElementsByTagName('body')[0];
            datePicker.documentHandler(e);
            expect(datePicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(false);
        });
    });
    describe('close prevented events', () => {
        let datePicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation: ():void=>{/** NO Code */},
            action: 'altDownArrow'
        };
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (datePicker) {
                datePicker.destroy();
            }
            document.body.innerHTML = '';
        });

	it('click on clear button with popup close disabled', function () {
	    datePicker = new DatePicker({ 
            value: new Date("12/12/2016"), 
            close:function(e){ e.preventDefault()},
            showClearButton: true 
        });
            datePicker.appendTo('#date');
            expect((document.querySelectorAll('.e-selected')).length != 0);
            (<HTMLElement>document.getElementsByClassName(' e-clear-icon')[0]).dispatchEvent(clickEvent);
            expect(datePicker.value).toBe(null);
            expect(document.querySelector('.e-selected')).toBe(null);
            expect((datePicker.popupObj) !== null).toBe(true);
        });
        it('enter key after clearing value when popup open test case', function () {
            datePicker = new DatePicker({
                close:function(e){ e.preventDefault()},
                value: new Date('2/2/2017')
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);	    
            datePicker.value='';	  
            keyEventArgs.action = 'enter';
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(datePicker.value).toBe(null);
            expect(document.querySelector('.e-selected')).toBe(null);
            expect((datePicker.popupObj) !== null).toBe(true);
        });
        it('enter key after new value when popup open test case', function () {
            datePicker = new DatePicker({
                close:function(e){ e.preventDefault()},
                value: new Date('2/2/2017')
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);	    
            datePicker.value=new Date('12/12/2016');	  
            keyEventArgs.action = 'enter';
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(datePicker.value.valueOf()).toBe(new Date('12/12/2016').valueOf());
            expect((document.querySelectorAll('.e-selected')).length != 0);
            expect((getIdValue(datePicker.tableBodyElement.querySelector('tr td.e-selected')))).toBe(new Date('12/12/2016').valueOf());
            expect((datePicker.popupObj) !== null).toBe(true);
            keyEventArgs.action = 'moveLeft';
            datePicker.keyActionHandle(keyEventArgs);
            expect((getIdValue(datePicker.tableBodyElement.querySelector('tr td.e-selected')))).toBe(new Date('12/12/2016').valueOf());
            expect((getIdValue(datePicker.tableBodyElement.querySelector('tr td.e-focused-date')))).toBe(new Date('12/11/2016').valueOf());
        });
        it('enter key after value higher than max when popup open test case', function () {
            datePicker = new DatePicker({
                close:function(e){ e.preventDefault()},
                value: new Date('2/2/2017')
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);	    
            datePicker.value=new Date('12/12/2116');	  
            keyEventArgs.action = 'enter';
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(datePicker.value.valueOf()).toBe(new Date('12/12/2116').valueOf());
            expect((document.querySelectorAll('.e-selected')).length == 0);
            expect((datePicker.popupObj) !== null).toBe(true);
        });
        it('tab key after clearing value when popup open test case', function () {
            datePicker = new DatePicker({
                close:function(e){ e.preventDefault()},
                value: new Date('2/2/2017')
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);	    
            datePicker.value='';	  
            keyEventArgs.action = 'tab';
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(datePicker.value).toBe(null);
            expect(document.querySelector('.e-selected')).toBe(null);
            expect((datePicker.popupObj) !== null).toBe(true);
        });
        it('tab key after new value when popup open test case', function () {
            datePicker = new DatePicker({
                close:function(e){ e.preventDefault()},
                value: new Date('2/2/2017')
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);	    
            datePicker.value=new Date('12/12/2016');	  
            keyEventArgs.action = 'tab';
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(datePicker.value.valueOf()).toBe(new Date('12/12/2016').valueOf());
            expect((document.querySelectorAll('.e-selected')).length != 0);
            expect((getIdValue(datePicker.tableBodyElement.querySelector('tr td.e-selected')))).toBe(new Date('12/12/2016').valueOf());
            expect((datePicker.popupObj) !== null).toBe(true);
            keyEventArgs.action = 'moveLeft';
            datePicker.keyActionHandle(keyEventArgs);
            expect((getIdValue(datePicker.tableBodyElement.querySelector('tr td.e-selected')))).toBe(new Date('12/12/2016').valueOf());
            expect((getIdValue(datePicker.tableBodyElement.querySelector('tr td.e-focused-date')))).toBe(new Date('12/11/2016').valueOf());
        });
        it('tab key after value higher than max when popup open test case', function () {
            datePicker = new DatePicker({
                close:function(e){ e.preventDefault()},
                value: new Date('2/2/2017')
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);	    
            datePicker.value=new Date('12/12/2116');	  
            keyEventArgs.action = 'tab';
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(datePicker.value.valueOf()).toBe(new Date('12/12/2116').valueOf());
            expect((document.querySelectorAll('.e-selected')).length == 0);
            expect((datePicker.popupObj) !== null).toBe(true);
        });
        it('inputblur after clearing value when popup open test case', function () {
            datePicker = new DatePicker({
                close:function(e){ e.preventDefault()},
                value: new Date('2/2/2017')
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);	    
            datePicker.value='';	  
            datePicker.inputBlurHandler();
            expect(datePicker.value).toBe(null);
            expect(document.querySelector('.e-selected')).toBe(null);
            expect((datePicker.popupObj) !== null).toBe(true);
        });
        it('inputblur after new value when popup open test case', function () {
            datePicker = new DatePicker({
                close:function(e){ e.preventDefault()},
                value: new Date('2/2/2017')
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);	    
            datePicker.value=new Date('12/12/2016');	  
            datePicker.inputBlurHandler();
            expect(datePicker.value.valueOf()).toBe(new Date('12/12/2016').valueOf());
            expect((document.querySelectorAll('.e-selected')).length != 0);
            expect((getIdValue(datePicker.tableBodyElement.querySelector('tr td.e-selected')))).toBe(new Date('12/12/2016').valueOf());
            expect((datePicker.popupObj) !== null).toBe(true);
        });
        it('inputblur after value higher than max when popup open test case', function () {
            datePicker = new DatePicker({
                close:function(e){ e.preventDefault()},
                value: new Date('2/2/2017')
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);	    
            datePicker.value=new Date('12/12/2116');	  
            datePicker.inputBlurHandler();
            expect(datePicker.value.valueOf()).toBe(new Date('12/12/2116').valueOf());
            expect((document.querySelectorAll('.e-selected')).length == 0);
            expect((datePicker.popupObj) !== null).toBe(true);
        });

        it('enter key on already selected value test cases', function () {
            datePicker = new DatePicker({
                close:function(e){ e.preventDefault()},
                value: new Date('2/2/2017')
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);	  
            keyEventArgs.action = 'enter';
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect(datePicker.value.valueOf()).toBe(new Date('2/2/2017').valueOf());
            expect((document.querySelectorAll('.e-selected')).length !== 0);
            expect((datePicker.popupObj) !== null).toBe(true);
        });
    });
    describe('Check placeholder after load culture', () => {
        let datePicker: any;
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
        });
        beforeEach((): void => {
            datePicker = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (datePicker) {
                datePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Pass placeholder through l10n load', () => {
            datePicker = new DatePicker({ floatLabelType: 'Auto', locale: 'en' }, '#date');
            expect(datePicker.placeholder).toEqual('Enter Date');
        });
        it('Pass placeholder through l10n load in de culture', () => {
            datePicker = new DatePicker({ floatLabelType: 'Auto', locale: 'de' }, '#date');
            expect(datePicker.placeholder).toEqual('Datum eingeben');
        });
        it('Set placeholder through API', () => {
            datePicker = new DatePicker({ floatLabelType: 'Auto', locale: 'zh', placeholder: 'Testo date' }, '#date');
            expect(datePicker.placeholder).toEqual('Testo date');
        });
    });

    describe('HTML attributes at inline element testing', () => {
        let datePicker: any;
        beforeEach((): void => {
            datePicker = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'date' });
            ele.setAttribute('placeholder','Enter a date');
            ele.setAttribute('readonly', '');
            ele.setAttribute('disabled', '');
            ele.setAttribute('value', '5/4/2017');
            ele.setAttribute('min', '1/1/2019');
            ele.setAttribute('max', '10/10/2019');
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (datePicker) {
                datePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Inline element testing', () => {
            datePicker = new DatePicker();
            datePicker.appendTo('#date');
            expect(datePicker.placeholder).toBe("Enter a date");
            expect(datePicker.element.hasAttribute('readonly')).toBe(true);
            expect(datePicker.element.hasAttribute('enabled')).toBe(false);
            expect(datePicker.element.getAttribute('value')).toBe('5/4/2017');
            expect(datePicker.element.getAttribute('min')).toBe('1/1/2019');
            expect(datePicker.element.getAttribute('max')).toBe('10/10/2019');
        });
        it('Inline and API testing', () => {
            datePicker = new DatePicker({placeholder:"Select a date", readonly: false, enabled: true, value: new Date('7/4/2017'), min: new Date('2/2/2019'), max: new Date('9/9/2019')});
            datePicker.appendTo('#date');
            expect(datePicker.placeholder).toBe("Select a date");
            expect(datePicker.element.hasAttribute('readonly')).toBe(false);
            expect(datePicker.element.hasAttribute('disabled')).toBe(false);
            expect(datePicker.element.value).toBe('7/4/2017');
            expect(datePicker.min.toDateString()).toBe(new Date('2/2/2019').toDateString());
            expect(datePicker.max.toDateString()).toBe(new Date('9/9/2019').toDateString());
        });
        it('Inline and html attributes API testing', () => {
            datePicker = new DatePicker({ htmlAttributes:{placeholder:"Choose a date", readonly: "false", disabled: "false", value: '10/4/2017', min: '3/3/2019', max: '8/8/2019'}});
            datePicker.appendTo('#date');
            expect(datePicker.placeholder).toBe("Choose a date");
            expect(datePicker.element.hasAttribute('readonly')).toBe(false);
            expect(datePicker.element.hasAttribute('disabled')).toBe(false);
            expect(datePicker.element.value).toBe('10/4/2017');
            expect(datePicker.element.min).toBe('3/3/2019');
            expect(datePicker.element.max).toBe('8/8/2019');
        });
        it('Inline, API and html attributes API testing', () => {
            datePicker = new DatePicker({ htmlAttributes:{placeholder:"Choose a date", disabled: "true", value: "10/4/2017", min: '3/3/2019', max: '8/8/2019'}, placeholder: "Select a date", readonly: false, enabled: true, value: new Date('7/4/2017'), min: new Date('2/2/2019'), max: new Date('9/9/2019')});
            datePicker.appendTo('#date');
            expect(datePicker.placeholder).toBe("Select a date");
            expect(datePicker.element.hasAttribute('enabled')).toBe(false);
            expect(datePicker.element.value).toBe('7/4/2017');
            expect(datePicker.min.toDateString()).toBe(new Date('2/2/2019').toDateString());
            expect(datePicker.max.toDateString()).toBe(new Date('9/9/2019').toDateString());
        });
    });
    
    describe('HTML attribute API testing', () => {
        let datePicker: any;
        beforeEach((): void => {
            datePicker = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (datePicker) {
                datePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('API testing', () => {
            datePicker = new DatePicker({placeholder:"Select a date", readonly: false, enabled: true, value: new Date('7/4/2017')});
            datePicker.appendTo('#date');
            expect(datePicker.placeholder).toBe("Select a date");
            expect(datePicker.element.hasAttribute('readonly')).toBe(false);
            expect(datePicker.element.hasAttribute('disabled')).toBe(false);
            expect(datePicker.element.value).toBe('7/4/2017');
        });
        it('HTML attributes API testing', () => {
            datePicker = new DatePicker({ htmlAttributes:{placeholder:"Choose a date", readonly: "false", disabled: "false", value: "10/4/2017"}});
            datePicker.appendTo('#date');
            expect(datePicker.placeholder).toBe("Choose a date");
            expect(datePicker.element.hasAttribute('readonly')).toBe(false);
            expect(datePicker.element.hasAttribute('disabled')).toBe(false);
            expect(datePicker.element.value).toBe('10/4/2017');
        });
        it('API and HTML attributes API testing', () => {
            datePicker = new DatePicker({ htmlAttributes:{placeholder:"Choose a date", readonly: "true", disabled: "", value: "10/4/2017"}, placeholder: "Select a date", readonly: false, enabled: true, value: new Date('7/4/2017')});
            datePicker.appendTo('#date');
            expect(datePicker.placeholder).toBe("Select a date");
            expect(datePicker.element.hasAttribute('readonly')).toBe(false);
            expect(datePicker.element.hasAttribute('enabled')).toBe(false);
            expect(datePicker.element.value).toBe('7/4/2017');
        });
        it('Other attribute testing with htmlAttributes API', () => {
            datePicker = new DatePicker({ htmlAttributes:{name:"picker", class: "test", title:"sample"}});
            datePicker.appendTo('#date');
            expect(datePicker.element.getAttribute('name')).toBe('picker');
            expect(datePicker.inputWrapper.container.getAttribute('title')).toBe('sample');
            expect(datePicker.inputWrapper.container.classList.contains('test')).toBe(true);
        });
    });

    describe('HTML attribute API dynamic testing', () => {
        let datePicker: any;
        beforeEach((): void => {
            datePicker = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (datePicker) {
                datePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Dynamically change attributes with htmlAttributes API', () => {
            datePicker = new DatePicker({ htmlAttributes:{placeholder:"Enter a date", readonly: "true", disabled: "true", value: "2/20/2018", max: "2/25/2018", min: "2/10/2018", class: "test", title:"sample", style: 'background-color:yellow'}});
            datePicker.appendTo('#date');
            expect(datePicker.element.getAttribute('placeholder')).toBe('Enter a date');
            expect(datePicker.element.hasAttribute('readonly')).toBe(true);
            expect(datePicker.element.hasAttribute('disabled')).toBe(true);
            expect(datePicker.element.value).toBe('2/20/2018');
            expect(datePicker.element.min).toBe('2/10/2018');
            expect(datePicker.element.max).toBe('2/25/2018');
            expect(datePicker.inputWrapper.container.getAttribute('title')).toBe('sample');
            expect(datePicker.inputWrapper.container.classList.contains('test')).toBe(true);
            expect(datePicker.inputWrapper.container.getAttribute('style')).toBe('width: 100%;background-color:yellow');
            datePicker.htmlAttributes = { placeholder:"choose a date", readonly: "false", disabled: "false", value: "4/20/18", max: "4/25/18", min: "4/10/18", class: "multiple", title:"heading"};
            datePicker.dataBind();
            expect(datePicker.element.getAttribute('placeholder')).toBe('choose a date');
            expect(datePicker.element.hasAttribute('readonly')).toBe(false);
            expect(datePicker.element.hasAttribute('disabled')).toBe(false);
            expect(datePicker.element.value).toBe('4/20/2018');
            expect(datePicker.element.min).toBe('4/10/18');
            expect(datePicker.element.max).toBe('4/25/18');
            expect(datePicker.inputWrapper.container.getAttribute('title')).toBe('heading');
            expect(datePicker.inputWrapper.container.classList.contains('multiple')).toBe(true);
        });
        it('Placeholder testing in auto case', () => {
            datePicker = new DatePicker({ floatLabelType: "Auto", htmlAttributes:{placeholder:"Enter a name" }});
            datePicker.appendTo('#date');
            expect(datePicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter a name');
            datePicker.htmlAttributes = { placeholder:"choose a date"};
            datePicker.dataBind();
            expect(datePicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            datePicker.floatLabelType = "Always";
            datePicker.dataBind();
            expect(datePicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            datePicker.floatLabelType = "Never";
            datePicker.dataBind();
            expect(datePicker.element.getAttribute('placeholder')).toBe('choose a date');
        });
        it('Placeholder testing in always case', () => {
            datePicker = new DatePicker({ floatLabelType: "Always", htmlAttributes:{placeholder:"Enter a name" }});
            datePicker.appendTo('#date');
            expect(datePicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter a name');
            datePicker.htmlAttributes = { placeholder:"choose a date"};
            datePicker.dataBind();
            expect(datePicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            datePicker.floatLabelType = "Auto";
            datePicker.dataBind();
            expect(datePicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            datePicker.floatLabelType = "Never";
            datePicker.dataBind();
            expect(datePicker.element.getAttribute('placeholder')).toBe('choose a date');
        });
        it('Placeholder testing in never case', () => {
            datePicker = new DatePicker({ floatLabelType: "Never", htmlAttributes:{placeholder:"Enter a name" }});
            datePicker.appendTo('#date');
            expect(datePicker.element.getAttribute('placeholder')).toBe('Enter a name');
            datePicker.htmlAttributes = { placeholder:"choose a date"};
            datePicker.dataBind();
            expect(datePicker.element.getAttribute('placeholder')).toBe('choose a date');
            datePicker.floatLabelType = "Always";
            datePicker.dataBind();
            expect(datePicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            datePicker.floatLabelType = "Auto";
            datePicker.dataBind();
            expect(datePicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
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
    describe('HTML attribute API at inital rendering and dynamic rendering', () => {
        let datePicker: any;
        beforeEach((): void => {
            datePicker = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (datePicker) {
                datePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Html attributes at initial rendering', () => {
            datePicker = new DatePicker({ htmlAttributes:{placeholder:"Choose the date", class: "sample" } });
            datePicker.appendTo('#date');
            expect(datePicker.element.getAttribute('placeholder')).toBe('Choose the date');
            expect(datePicker.inputWrapper.container.classList.contains('sample')).toBe(true);
        });
        it('Pass multiple attributes dynamically', () => {
            datePicker = new DatePicker({ value: new Date("12/12/2016") });
            datePicker.appendTo('#date');
            datePicker.htmlAttributes = { class:"sample", readonly: "true", disabled: "true"};
            datePicker.dataBind();
            expect(datePicker.element.value).toBe('12/12/2016');
            expect(datePicker.inputWrapper.container.classList.contains('sample')).toBe(true);
            expect(datePicker.element.hasAttribute('readonly')).toBe(true);
            expect(datePicker.element.hasAttribute('disabled')).toBe(true);
        });
        it('Dynamically change attributes through htmlAttributes API', () => {
            datePicker = new DatePicker({ value: new Date("12/12/2016") });
            datePicker.appendTo('#date');
            datePicker.inputElement.value = "10/12/2016";
            datePicker.htmlAttributes = { class:"sample" };
            datePicker.dataBind();
            expect(datePicker.element.value).toBe('10/12/2016');
        });
        it('Dynamically change multiple attributes through htmlAttributes API', () => {
            datePicker = new DatePicker({ value: new Date("12/12/2019") });
            datePicker.appendTo('#date');
            datePicker.htmlAttributes = { class:"sample" , max:'10/20/19', min:'10/5/19'};
            datePicker.dataBind();
            expect(datePicker.element.value).toBe("12/12/2019");
            expect(datePicker.element.getAttribute('max')).toBe('10/20/19');
            expect(datePicker.element.getAttribute('min')).toBe('10/5/19');
        });
        it('Pass null value in htmlAttributes', () => {
            datePicker = new DatePicker({ value: new Date("12/12/2016") });
            datePicker.appendTo('#date');
            datePicker.htmlAttributes = { null: "null"};
            datePicker.dataBind();
            expect(datePicker.element.value).toBe('12/12/2016');
        });
        it('Pass undefined in htmlAttributes', () => {
            datePicker = new DatePicker({ value: new Date("12/12/2016") });
            datePicker.appendTo('#date');
            datePicker.htmlAttributes = { undefined: "undefined"};
            datePicker.dataBind();
            expect(datePicker.element.value).toBe('12/12/2016');
        });
        it('Pass empty value in htmlAttributes', () => {
            datePicker = new DatePicker({ value: new Date("12/12/2016") });
            datePicker.appendTo('#date');
            datePicker.inputElement.value = "10/12/2016";
            datePicker.htmlAttributes = {};
            datePicker.dataBind();
            expect(datePicker.element.value).toBe('10/12/2016');
        });
    });
    describe('keyboard events', () => {
        let datePicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation:(): void=>{},
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
        it('alt + down arrow key changed shift + down arrow test case ', () => {
            datePicker = new DatePicker({
                start: 'Decade',
                keyConfigs: {altDownArrow: 'shift+downarrow'}
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
            datePicker.calendarKeyActionHandle(keyEventArgs);
        });
        it('enter key test case', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            keyEventArgs.action = 'escape';
            datePicker.calendarKeyActionHandle(keyEventArgs);
            setTimeout(function () {
                expect(isNullOrUndefined(datePicker.popupWrapper)).toBe(true), 1000
            })
            keyEventArgs.action = 'enter';
            datePicker.calendarKeyActionHandle(keyEventArgs);
            keyEventArgs.action = 'escape';
            datePicker.popupWrapper = datePicker.popupObj = null
            datePicker.calendarKeyActionHandle(keyEventArgs);
            expect(document.activeElement).toBe(document.querySelector('.e-input'));
        });
        it('tab key when popup open test case', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            keyEventArgs.action = 'tab';
            datePicker.calendarKeyActionHandle(keyEventArgs);
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
    describe('Mobile testing for readonly attribute', function () {
        let datepicker: any;
        let ua = Browser.userAgent;
        beforeAll(() => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
        });
        afterAll(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
            Browser.userAgent = ua;
        });
        it('Add and remove readonly attribute for angular platform', () => {
            let ele: HTMLElement = createElement('EJS-DATEPICKER', { id: 'date' });
            document.body.appendChild(ele);
            datepicker = new DatePicker();
            datepicker.appendTo('#date');
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                currentTarget: null,
                target: null,
                stopPropagation: (): void => { /** NO Code */ }
            };
            datepicker.dateIconHandler(mouseEventArgs);
            expect(datepicker.element.hasAttribute('readonly')).toBe(false);
            expect(datepicker.inputElement.hasAttribute('readonly')).toBe(true);
            datepicker.hide();
            expect(datepicker.inputElement.hasAttribute('readonly')).toBe(false);
        });
        it('Add and remove readonly attribute for other platform', () => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            datepicker = new DatePicker();
            datepicker.appendTo('#date');
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                currentTarget: null,
                target: null,
                stopPropagation: (): void => { /** NO Code */ }
            };
            datepicker.dateIconHandler(mouseEventArgs);
            expect(datepicker.inputElement.hasAttribute('readonly')).toBe(true);
            datepicker.hide();
            expect(datepicker.inputElement.hasAttribute('readonly')).toBe(false);
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
            if (!datepicker.popupObj) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            }
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
        // Test cases for reset the component when value has been given.
        it('Input element value reset test case (initialized)', () => {
            datepicker = new DatePicker({ value: new Date('02/02/2017') });
            datepicker.appendTo('#datepicker');
            (<any>document.getElementById("form-element")).reset();
            datepicker.dataBind();
            expect(datepicker.element.value).toBe('2/2/2017');
            expect(+datepicker.value !== null).toBe(true);
        });
        it('Input element value changing dynamically (initialized)', () => {
            datepicker = new DatePicker({ value: new Date('02/02/2017') });
            datepicker.appendTo('#datepicker');
            datepicker.element.value = new Date('02/12/2018');
            (<any>document.getElementById("form-element")).reset();
            datepicker.dataBind();
            expect(datepicker.element.value).toBe('2/2/2017');
            expect(datepicker.value !== null).toBe((true));
        });
        it('Input element value changing dynamically to null value (initialized)', () => {
            datepicker = new DatePicker({ value: new Date('02/02/2017') });
            datepicker.appendTo('#datepicker');
            datepicker.element.value = null;
            (<any>document.getElementById("form-element")).reset();
            datepicker.dataBind();
            expect(datepicker.element.value).toBe('2/2/2017');
            expect(datepicker.value !== null).toBe((true));
        });
        it('Clear the Input element value dynamically via clear button (initialized)', () => {
            datepicker = new DatePicker({ value: new Date('02/02/2017') });
            datepicker.appendTo('#datepicker');
            (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
            (<any>document.getElementById("form-element")).reset();
            datepicker.dataBind();
            expect(datepicker.element.value).toBe('2/2/2017');
            expect(datepicker.value !== null).toBe((true));
        });

        // below test cases are modified since this behavior has been changed in all input component.

        it('Form reset with floatLabeltype("Auto") property test case (initialized)', () => {
            datepicker = new DatePicker({ value: new Date('02/02/2017'), floatLabelType: "Auto" });
            datepicker.appendTo('#datepicker');
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            (<any>document.getElementById("form-element")).reset();
            datepicker.dataBind();
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            expect(datepicker.element.value === '2/2/2017').toBe(true);
        });
        it('Form reset with floatLabeltype("Always") property test case (initialized)', () => {
            datepicker = new DatePicker({ value: new Date('02/02/2017'), floatLabelType: "Always" });
            datepicker.appendTo('#datepicker');
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            (<any>document.getElementById("form-element")).reset();
            datepicker.dataBind();
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            expect(datepicker.element.value !== null).toBe(true);
        });
        it('Form reset with floatLabeltype("Never") property test case (initialized)', () => {
            datepicker = new DatePicker({ value: new Date('02/02/2017'), floatLabelType: "Never" });
            datepicker.appendTo('#datepicker');
            expect(document.querySelector('.e-float-text')).toBe(null);
            (<any>document.getElementById("form-element")).reset();
            datepicker.dataBind();
            expect(document.querySelector('.e-float-text')).toBe(null);
            expect(datepicker.element.value !== null).toBe(true);
        });
        it('Input value reset in destroy case (initialized)', () => {
            datepicker = new DatePicker({ value: new Date('02/02/2017') });
            datepicker.appendTo('#datepicker');
            datepicker.destroy();
            (<any>document.getElementById("form-element")).reset();
            expect((<any>document.getElementById('datepicker')).value !== '2/2/2017').toBe(true);
            datepicker = null;
        });
        // Test cases for reset the component when value not initialized
        it('Input element value changing dynamically', () => {
            datepicker = new DatePicker({  });
            datepicker.appendTo('#datepicker');
            datepicker.element.value = new Date('02/12/2018');
            (<any>document.getElementById("form-element")).reset();
            datepicker.dataBind();
            expect(datepicker.element.value).toBe('');
            expect(datepicker.value === null).toBe((true));
        });
        it('Clear the Input element value dynamically via clear button', () => {
            datepicker = new DatePicker({ });
            datepicker.appendTo('#datepicker');
            datepicker.element.value = new Date('02/12/2018');
            (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
            (<any>document.getElementById("form-element")).reset();
            datepicker.dataBind();
            expect(datepicker.element.value).toBe('');
            expect(datepicker.value === null).toBe((true));
        });
        // Below case need to be fixed by the component.
        // it('Form reset with floatLabeltype("Auto") property test case', () => {
        //     datepicker = new DatePicker({ floatLabelType: "Auto" });
        //     datepicker.appendTo('#datepicker');
        //     datepicker.value = new Date('02/12/2018');
        //     expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
        //     (<any>document.getElementById("form-element")).reset();
        //     datepicker.dataBind();
        //     expect(document.querySelector('.e-float-text').classList.contains('e-label-bottom')).toBe(true);
        //     expect(datepicker.element.value === '').toBe(true);
        // });
        it('Form reset with floatLabeltype("Always") property test case', () => {
            datepicker = new DatePicker({ floatLabelType: "Always" });
            datepicker.appendTo('#datepicker');
            datepicker.element.value = new Date('02/12/2018');
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            (<any>document.getElementById("form-element")).reset();
            datepicker.dataBind();
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            expect(datepicker.element.value === '').toBe(true);
        });
        it('Form reset with floatLabeltype("Never") property test case', () => {
            datepicker = new DatePicker({ floatLabelType: "Never" });
            datepicker.appendTo('#datepicker');
            expect(document.querySelector('.e-float-text')).toBe(null);
            datepicker.element.value = new Date('02/12/2018');
            (<any>document.getElementById("form-element")).reset();
            datepicker.dataBind();
            expect(document.querySelector('.e-float-text')).toBe(null);
            expect(datepicker.element.value === '').toBe(true);
        });
        it('Input value reset in destroy case ', () => {
            datepicker = new DatePicker({ });
            datepicker.appendTo('#datepicker');
            datepicker.destroy();
            (<any>document.getElementById("form-element")).reset();
            expect((<any>document.getElementById('datepicker')).value === '').toBe(true);
            datepicker = null;
        });
        it('Input value reset case_1 ', () => {
            datepicker = new DatePicker({ });
            datepicker.appendTo('#datepicker');
            (<any>document.getElementById("form-element")).reset();
            datepicker.dataBind();
            expect(datepicker.previousElementValue === "").toBe(true);
        });
        it('Input value reset case_2 ', () => {
            datepicker = new DatePicker({
                value: new Date("2/12/2018")
            });
            datepicker.appendTo('#datepicker');
            (<any>document.getElementById("form-element")).reset();
            datepicker.dataBind();
            expect(datepicker.previousElementValue === "2/12/2018").toBe(true);
        });
        it('Input value reset case_3 ', () => {
            datepicker = new DatePicker({
                value: new Date("2/12/2018"),
                format: "yyyy/MMM/dd"
            });
            datepicker.appendTo('#datepicker');
            (<any>document.getElementById("form-element")).reset();
            datepicker.dataBind();
            expect(datepicker.previousElementValue === "2018/Feb/12").toBe(true);
        });
    });
	describe('Form element', () => {
        let datepicker: any;
        beforeEach(() => {
            let formEle: HTMLElement = createElement('form', { id: "form-element" });
            let Ele: HTMLElement = createElement('EJS-DATEPICKER',{ id: "date" });
            formEle.appendChild(Ele);
            document.body.appendChild(formEle);
        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Reset for angular support', () => {
            datepicker = new DatePicker({value:new Date('2/2/2012')});
            datepicker.appendTo('#date');
            datepicker.start='Year';
            datepicker.dataBind();
            datepicker.depth='Decade';
            datepicker.dataBind();
            expect(datepicker.depth === 'Month').toBe(true);
            (<any>document.getElementById("form-element")).reset();
            expect(datepicker.value === null).toBe(true);
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
    Calendar.Inject(Islamic)
    describe('Islamic ', () => {
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
        it('Islamic  test case ', () => {
            datepicker = new DatePicker({
                calendarMode: 'Islamic',
                value: new Date(), open: function (args: PopupObjectArgs) {
                    args.appendTo = this.inputWrapper.container;
                }
            });
            datepicker.appendTo('#datepicker');
            (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(datepicker.popupObj.element.parentElement).toBe(datepicker.inputWrapper.container);
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
    describe('focus event checking on document click when the calendar is open test case', function () {
        let datePicker:any;
        beforeEach(function () {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(function () {
            if (datePicker) {
                datePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Start and Depth are Month', function () {
            datePicker = new DatePicker({
                start: 'Month',
                depth: 'Month'
            });
            datePicker.appendTo('#date');
            let e ={
                preventDefault : () => {},
                target: document.getElementById('date')
            }
            document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0].dispatchEvent(clickEvent);
            expect(datePicker.popupObj != null).toBe(true);
            document.getElementsByClassName('e-day')[3].dispatchEvent(clickEvent)
            expect(datePicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
            document.getElementsByTagName('body')[0].dispatchEvent(clickEvent)
            e.target = document.getElementsByTagName('body')[0];
            datePicker.documentHandler(e);
            expect(datePicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(false);
        });
        it('Start and Depth are Year', function () {
            datePicker = new DatePicker({
                start: 'Year',
                depth: 'Year'
            });
            datePicker.appendTo('#date');
            let e ={
                preventDefault : () => {},
                target: document.getElementById('date')
            }
            document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0].dispatchEvent(clickEvent);
            expect(datePicker.popupObj != null).toBe(true);
            document.getElementsByClassName('e-day')[3].dispatchEvent(clickEvent)
            expect(datePicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
            document.getElementsByTagName('body')[0].dispatchEvent(clickEvent)
            e.target = document.getElementsByTagName('body')[0];
            datePicker.documentHandler(e);
            expect(datePicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(false);
        });
        it('Start and Depth are Decade', function () {
            datePicker = new DatePicker({
                start: 'Decade',
                depth: 'Decade'
            });
            datePicker.appendTo('#date');
            let e ={
                preventDefault : () => {},
                target: document.getElementById('date')
            }
            document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0].dispatchEvent(clickEvent);
            expect(datePicker.popupObj != null).toBe(true);
            document.getElementsByClassName('e-day')[3].dispatchEvent(clickEvent)
            expect(datePicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
            document.getElementsByTagName('body')[0].dispatchEvent(clickEvent)
            e.target = document.getElementsByTagName('body')[0];
            datePicker.documentHandler(e);
            expect(datePicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(false);
        });
    });
    describe('Dynamic CssClass testcase', function (){
        let datePicker: any;
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('input', { id: 'datepicker'});
            document.body.appendChild(inputElement);
        });
        afterEach(function() {
            if (datePicker) {
                datePicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('single css class',function() {
            datePicker = new DatePicker({
                cssClass: 'e-custom'
            });
            datePicker.appendTo('#datepicker');
            expect(datePicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            datePicker.cssClass = 'e-test';
            datePicker.dataBind();
            expect(datePicker.inputWrapper.container.classList.contains('e-custom')).toBe(false);
            expect(datePicker.inputWrapper.container.classList.contains('e-test')).toBe(true);
        });
        it('more than one css class',function() {
            datePicker = new DatePicker({
                cssClass: 'e-custom e-secondary'
            });
            datePicker.appendTo('#datepicker');
            expect(datePicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            expect(datePicker.inputWrapper.container.classList.contains('e-secondary')).toBe(true);
            datePicker.cssClass = 'e-test e-ternary';
            datePicker.dataBind();
            expect(datePicker.inputWrapper.container.classList.contains('e-custom')).toBe(false);
            expect(datePicker.inputWrapper.container.classList.contains('e-secondary')).toBe(false);
            expect(datePicker.inputWrapper.container.classList.contains('e-test')).toBe(true);
            expect(datePicker.inputWrapper.container.classList.contains('e-ternary')).toBe(true);
        });
    });
    describe('Popup hide testing when crosses view port', function (){
        let datePicker: any;
        let divElement: HTMLElement;
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('input', { id: 'datepicker'});
            document.body.appendChild(inputElement);
            divElement = createElement('div', { id: 'divElement'});
            divElement.style.height = '900px';
        });
        afterEach(function() {
            if (datePicker) {
                datePicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('Popup hide testing',function() {
            datePicker = new DatePicker({});
            datePicker.appendTo('#datepicker');
            (<HTMLInputElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datePicker.popupWrapper !== null).toBe(true);
            document.body.appendChild(divElement);
            scrollBy({top: 500, behavior: 'smooth'})
            datePicker.popupObj.trigger('targetExitViewport');
            expect(datePicker.popupWrapper === null).toBe(true);
        });
    });
    describe('EJ2-35535- While pressing shift + tab key to move the previous item ', () => {
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation: ():void=>{/** NO Code */},
            action: ''
        };
        let datepicker: any;
        let datepicker1: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            datepicker = new DatePicker();
            datepicker.appendTo('#date');
            let ele1: HTMLElement = createElement('input', { id: 'date1' });
            document.body.appendChild(ele1);
            datepicker1 = new DatePicker();
            datepicker1.appendTo('#date1');
        });
        afterEach(() => {
            if (datepicker) {
                datepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('popup will not closed.', () => {
            datepicker1.focusIn();
            datepicker1.show();
            keyEventArgs.action = 'shiftTab';
            datepicker1.inputKeyActionHandle(keyEventArgs);
            expect(isNullOrUndefined(datepicker1.popupObj)).toBe(true);
        });
    });
    describe('Timezone offset', function (){
        let datePicker: any;
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('input', { id: 'datepicker'});
            document.body.appendChild(inputElement);
        });
        afterEach(function() {
            if (datePicker) {
                datePicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('server timezone offset with +10',function() {
            datePicker = new DatePicker({
                value: new Date('5/7/2018'),
                serverTimezoneOffset: +4.5
            });
            datePicker.appendTo('#datepicker');
        });
    });
    describe('Cleared event test case', function () {
        let datePicker:any;        
        beforeEach(function () {
            let ele: HTMLElement = createElement('input', { id: 'date' });
                document.body.appendChild(ele);
        });
        afterEach(function () {
            if (datePicker) {
                datePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('check value after button click', function () {
            datePicker = new DatePicker({
                value: new Date(),
                cleared: function(args: any) {
                    expect(args.name).toBe("cleared");
                    expect(datePicker.value).toBe(null);
                }
            });
            datePicker.appendTo('#date');
            datePicker.element.parentElement.querySelectorAll('.e-clear-icon')[0].click();
            expect(datePicker.inputElement.value === "").toBe(true);
        });
    });
    describe('EJ2-35061 - change event triggered twice with strict mode and format', function (){
        let datePicker: any;
        let onChange: jasmine.Spy;
        let blurEvent: MouseEvent = document.createEvent('MouseEvents');
        blurEvent.initEvent('blur', true, true);
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('input', { id: 'datepicker'});
            document.body.appendChild(inputElement);
            onChange = jasmine.createSpy('change');
        });
        afterEach(function() {
            if (datePicker) {
                datePicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('Checking whether the change is called after inputblur',function(done) {
            datePicker = new DatePicker({
                width: "250px",    
                value: new Date('2019-12-26'),    
                format: 'yyyy-MM-dd',    
                strictMode: true, 
                change: onChange
            });
            datePicker.appendTo('#datepicker');
            (<HTMLInputElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            setTimeout(() => {
                (<HTMLSpanElement>document.getElementsByClassName("e-month-hide")[0].nextElementSibling.querySelectorAll(".e-day")[4]).dispatchEvent(clickEvent);
                setTimeout(() => {
                    datePicker.inputBlurHandler(blurEvent);
                    setTimeout(() => {                        
                        expect(onChange).toHaveBeenCalledTimes(0);
                        done();
                    }, 110);
                }, 110);
            }, 110);
        });
    });
    describe('EJ2-36108', function () {
        let datePicker:any;
        let userAgent = Browser.userAgent;
        beforeAll(function () {
            let edgeAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.74 Safari/537.36 Edg/79.0.309.43";
            let ele: HTMLElement = createElement('input', { id: 'date' });
                document.body.appendChild(ele);
        });
        afterAll(function () {
            if (datePicker) {
                datePicker.destroy();
            }
            Browser.userAgent = userAgent;
            document.body.innerHTML = '';
        });
        it('Timezone issue on selecting 1/1/1970', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            datePicker.show();
            datePicker.navigateTo('decade',new Date('1/1/1970'));
            expect(datePicker.currentView()).toBe("Decade");
            (document.getElementsByClassName('e-focused-date')[0] as HTMLElement).click();
            expect(datePicker.currentView()).toBe("Year");
            (document.getElementsByClassName('e-focused-date')[0] as HTMLElement).click();
            expect(datePicker.currentView()).toBe("Month");
            (document.getElementsByClassName('e-focused-date')[0] as HTMLElement).click();
            expect(+datePicker.value).toBe(+new Date('1/1/1970'));
            expect(datePicker.inputElement.value === "1/1/1970").toBe(true);
        });
    });
    describe('EJ2-36604 - While giving the class name with empty space for HtmlAttributes, console error is produced.', function () {
        let datePicker: any;
        beforeEach(function () {
            let inputElement: HTMLElement = createElement('input', { id: 'datepicker' });
            document.body.appendChild(inputElement);
        });
        afterEach(function () {
            if (datePicker) {
                datePicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('Entering the class name without any empty space', function () {
            datePicker = new DatePicker({
                htmlAttributes: { class: 'custom-class' }
            });
            datePicker.appendTo('#datepicker');
            expect(datePicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving empty space before and after the class name', function () {
            datePicker = new DatePicker({
                htmlAttributes: { class: ' custom-class ' }
            });
            datePicker.appendTo('#datepicker');
            expect(datePicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving more than one empty space between two class names', function () {
            datePicker = new DatePicker({
                htmlAttributes: { class: 'custom-class1     custom-class2' }
            });
            datePicker.appendTo('#datepicker');
            expect(datePicker.inputWrapper.container.classList.contains('custom-class1')).toBe(true);
            expect(datePicker.inputWrapper.container.classList.contains('custom-class2')).toBe(true);
        });
        it('Giving more than one empty space between two class names as well as before and after the class names', function () {
            datePicker = new DatePicker({
                htmlAttributes: { class: '   custom-class1     custom-class2   ' }
            });
            datePicker.appendTo('#datepicker');
            expect(datePicker.inputWrapper.container.classList.contains('custom-class1')).toBe(true);
            expect(datePicker.inputWrapper.container.classList.contains('custom-class2')).toBe(true);
        });
        it('Giving only empty space  without entering any class Name', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#datepicker');
            let beforeAddClass = datePicker.inputWrapper.container.classList.length;
            datePicker.htmlAttributes = { class: '  '};
            datePicker.appendTo('#datepicker');
            let AfterAddClass = datePicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        });
        it('Keep input as empty without entering any class Name', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#datepicker');
            let beforeAddClass = datePicker.inputWrapper.container.classList.length;
            datePicker.htmlAttributes = { class: '' };
            datePicker.appendTo('#datepicker');
            let AfterAddClass = datePicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        });
        it('Entering class name without any empty space', function () {
            datePicker = new DatePicker({
                cssClass :'custom-class'
            });
            datePicker.appendTo('#datepicker');
            expect(datePicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving empty space before and after the class name', function () {
            datePicker = new DatePicker({
                cssClass :' custom-class '
            });
            datePicker.appendTo('#datepicker');
            expect(datePicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving more than one empty space between two class names', function () {
            datePicker = new DatePicker({
                cssClass :'custom-class-one   custom-class-two'
            });
            datePicker.appendTo('#datepicker');
            expect(datePicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(datePicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving more than one empty space between two class names as well as before and after the class names', function () {
            datePicker = new DatePicker({
                cssClass :'  custom-class-one   custom-class-two  '
            });
            datePicker.appendTo('#datepicker');
            expect(datePicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(datePicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving only empty space  without entering any class Name', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#datepicker');
            let beforeAddClass = datePicker.inputWrapper.container.classList.length;
            datePicker.cssClass = '  ';
            datePicker.appendTo('#datepicker');
            let AfterAddClass = datePicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        });
        it('Keep input as empty without entering any class Name', function () {
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#datepicker');
            let beforeAddClass = datePicker.inputWrapper.container.classList.length;
            datePicker.cssClass = '';
            datePicker.appendTo('#datepicker');
            let AfterAddClass = datePicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        });
        it('Giving class name with underscore in the beginning', function () {
            datePicker = new DatePicker({
                htmlAttributes : { class : '_custom-class-one'},
                cssClass : '_custom-class-two'
            });
            datePicker.appendTo('#datepicker');
            expect(datePicker.inputWrapper.container.classList.contains('_custom-class-one')).toBe(true);
            expect(datePicker.inputWrapper.container.classList.contains('_custom-class-two')).toBe(true);
        });
        it('Giving class name with empty space in both cases seperatly', function () {
            datePicker = new DatePicker({
                htmlAttributes : { class : '  custom-class-one  '},
                cssClass : '   custom-class-two  '
            });
            datePicker.appendTo('#datepicker');
            expect(datePicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(datePicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });
    });
    describe('EJ2-39692', function () {
        let datePicker: any;
        beforeAll(function () {
            let inputElement: HTMLElement = createElement('input', { id: 'datepicker' });
            document.body.appendChild(inputElement);
        });
        afterAll(function () {
            if (datePicker) {
                datePicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('Disabled date are allowed to type in input when strict mode is enabled', function () {
            datePicker = new DatePicker({
                value: new Date(),
                strictMode: true,
                renderDayCell: function (args: any): void {
                    if (args.date.getDay() === 0 || args.date.getDay() === 6) {
                        args.isDisabled = true;
                    }
                }
            });
            datePicker.appendTo('#datepicker');
            datePicker.focusIn();
            datePicker.element.value = '5/17/2020';
            datePicker.inputBlurHandler();
            expect(datePicker.value).toBe(null);
        });
    });
    describe('popup open while focus the component',function(){
        let datePicker:any;
        let keyEventArgs:any={
            action:'tab'
        };
        beforeEach(function(){
            let element: HTMLElement = createElement('input',{id:'date'});
            document.body.appendChild(element);
        });
        afterEach(function(){
            if(datePicker){
                datePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('check the popup open',function(){
            datePicker = new DatePicker({
                openOnFocus:true
            });
            datePicker.appendTo('#date');
            keyEventArgs.action = 'tab';
            datePicker.inputKeyActionHandle(keyEventArgs);
            expect((datePicker.popupObj) !== null).toBe(true);
        });
    });
    describe('EJ2-45532 - Datepicker popup closing when updating value dynamically',function(){
        let datePicker:any;
        beforeEach(function(){
            let element: HTMLElement = createElement('input',{id:'date'});
            document.body.appendChild(element);
        });
        afterEach(function(){
            if(datePicker){
                datePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('check the popup open',function(){
            datePicker = new DatePicker({
            });
            datePicker.appendTo('#date');
            datePicker.show();
            datePicker.value = new Date('1/1/2020');
            datePicker.dataBind();
            expect((datePicker.popupObj) !== null).toBe(true);
            expect(datePicker.inputElement.value === "1/1/2020").toBe(true)
        });
    });
});