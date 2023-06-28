import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
import { PopupEventArgs } from '../../src/timepicker/timepicker';

import { Ajax } from '@syncfusion/ej2-base';
import { Component, EventHandler, Property, Event, CreateBuilder, Internationalization, setCulture } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, KeyboardEvents, KeyboardEventArgs, L10n, Browser } from '@syncfusion/ej2-base';
import { cldrData, loadCldr, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';
import { createElement, removeClass, remove, addClass, setStyleAttribute, detach } from '@syncfusion/ej2-base';
import { isNullOrUndefined, merge, getEnumValue, getValue, getUniqueID } from '@syncfusion/ej2-base';
import '../../node_modules/es6-promise/dist/es6-promise';
import { RenderDayCellEventArgs } from '../../src/calendar/calendar';
import { Calendar, ChangedEventArgs, Islamic } from '../../src/index';
import  {profile , inMB, getMemoryProfile} from '../common/common.spec';
import { MaskedDateTime } from '../../src/index';

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
        'datetimepicker': { placeholder: 'Enter the value' }
    },
    'de': {
        'datetimepicker': { placeholder: 'Geben Sie den Wert ein' }
    },
    'zh': {
        'datetimepicker': { placeholder: '輸入值' }
    },
    'vi': {
        'datetimepicker': { placeholder: 'Chọn thời gian' }
    },
    'ar': {
        'datetimepicker': { placeholder: 'حدد الوقت' }
    },
    'ar-QA': {
        'datetimepicker': { placeholder: 'حدد الوقت' }
    },
    'ja': {
        'datetimepicker': { placeholder: 'Pilih Waktu' }
    }
});
/**
 * DateTimePicker spec document
 */
/**
 * @param  {} 'DateTimePicker'
 * @param  {} function(
 */
function getIdValue(ele: any): number {
    let str: string = ele.id;
    return new Date(parseInt(str, 0)).valueOf();
}
function onRender(args: RenderDayCellEventArgs) {
    if (args.date.getDate() == 2) {
        args.isDisabled = true;
    }
}
let clickEvent: MouseEvent = document.createEvent('MouseEvents');
clickEvent.initEvent('mousedown', true, true);
document.dispatchEvent(clickEvent);
describe('DateTimePicker',() => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
describe('DateTimepicker', () => {
    describe('DOM Wrapper Testing without default value', () => {
        let datetimepicker: any;
        let ele: HTMLElement
        beforeEach(() => {
            ele = createElement('input', { id: 'dateTime' });
            document.body.appendChild(ele);
            datetimepicker = new DateTimePicker();
            datetimepicker.appendTo('#dateTime');
        });
        afterEach(() => {
            if (datetimepicker) {
                datetimepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('element class e-datetimpicker testing', () => {
            expect(datetimepicker.element.classList.contains('e-datetimepicker')).toBe(true);
        });
        it('element class e-control testing', () => {
            expect(datetimepicker.element.classList.contains('e-control')).toBe(true);
        });
        it('name and min attribute testing', () => {
            expect(datetimepicker.element.getAttribute('name')).toBe(datetimepicker.element.getAttribute('id'));
            ele.setAttribute('min', '10/10/2010 06:00 AM');
            datetimepicker = new DateTimePicker();
            datetimepicker.appendTo('#dateTime');
            expect(datetimepicker.min.valueOf()).toEqual(new Date('10/10/2010 06:00 AM').valueOf());
        });
        it('placeholder and min attribute testing', () => {
            ele.setAttribute('placeholder', 'enter DateTime');
            datetimepicker = new DateTimePicker();
            datetimepicker.appendTo('#dateTime');
        });
        it('type attribute testing', () => {
            ele.setAttribute('type', 'DateTime');
            datetimepicker = new DateTimePicker();
            datetimepicker.appendTo('#dateTime');
        });
        it('type attribute testing', () => {
            ele.setAttribute('type', 'text');
            datetimepicker = new DateTimePicker();
            datetimepicker.appendTo('#dateTime');
        });
        it('max element attribute testing', () => {
            ele.setAttribute('max', '10/10/2013 16:00');
            datetimepicker = new DateTimePicker();
            datetimepicker.appendTo('#dateTime');
            expect(datetimepicker.max.valueOf()).toEqual(new Date('10/10/2013 04:00 PM').valueOf());
        });
        it('max element attribute testing', () => {
            ele.setAttribute('max', 'text');
            datetimepicker = new DateTimePicker();
            datetimepicker.appendTo('#dateTime');
        });
        it('min element attribute testing', () => {
            ele.setAttribute('min', 'text');
            datetimepicker = new DateTimePicker();
            datetimepicker.appendTo('#dateTime');
        });
        it('step element attribute testing', () => {
            ele.setAttribute('step', '10');
            datetimepicker = new DateTimePicker();
            datetimepicker.appendTo('#dateTime');
            expect(datetimepicker.step).toEqual(10);
        });
        it('wrapper class testing', () => {
            expect(datetimepicker.inputWrapper.container.classList.contains('e-datetime-wrapper')).toBe(true);
        });
        it('icon class e-date-icon and e-time-icon testing', () => {
            expect(datetimepicker.inputWrapper.buttons[0].classList.contains('e-date-icon')).toBe(true);
            expect(datetimepicker.inputWrapper.container.children[3].classList.contains('e-time-icon')).toBe(true);
        });
        it('popup button class e-input-group-icon testing', () => {
            expect(datetimepicker.inputWrapper.buttons[0].classList.contains('e-input-group-icon')).toBe(true);
            expect(datetimepicker.inputWrapper.container.children[3].classList.contains('e-input-group-icon')).toBe(true);
        });
        it('popup button DOM testing', () => {
            expect(datetimepicker.inputWrapper.buttons[0].tagName === "SPAN").toBe(true);
        });
        it('wrapper DOM testing', () => {
            expect(datetimepicker.inputWrapper.container.tagName === "SPAN").toBe(true);
        });     
        it('wrapper ARIA expanded attribute testing', () => {
            expect(datetimepicker.element.getAttribute('aria-expanded')).toEqual('false');
        });
        it('required attribute testing', () => {
            expect(datetimepicker.element.getAttribute('required')).toEqual(null);
        });
        it('wrapper ARIA expanded attribute popup testing', () => {
            if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(datetimepicker.element.getAttribute('aria-expanded')).toBe('true');
        });
        it('element placeholder testing', () => {
            expect(datetimepicker.element.getAttribute('placeholder')).toEqual(null);
        });
        it('popup element class popup testing', () => {
            if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(datetimepicker.popupWrapper.classList.contains('e-popup')).toBe(true);
        });
        it('popup element class control testing', () => {
            if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(datetimepicker.popupWrapper.classList.contains('e-control')).toBe(true);
        });
        it('popup element class e-DateTimePicker testing', () => {
            if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(datetimepicker.dateTimeWrapper.classList.contains('e-datetimepicker')).toBe(true);
        });
        it('previous value reset testing', () => {
            datetimepicker.value = new Date('8/8/2017 10:30');
            datetimepicker.dataBind();
            expect(datetimepicker.inputElement.value).toBe('8/8/2017 10:30 AM');
        });
        it('previous value reset testing', () => {
            datetimepicker = new DateTimePicker({ value: new Date('4/8/2017'), format: 'dd/MM/yyyy' });
            datetimepicker.appendTo('#dateTime');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            let tableRow = datetimepicker.popupWrapper.getElementsByTagName("tr")[3];
            let tableData = tableRow.getElementsByTagName("td")[3];
            tableData.click();
            // need to ensure the below test case 
            // expect(+new Date(datetimepicker.inputElement.value)).toBe(getIdValue(tableData));
        });
        it('previous value reset testing', () => {
            datetimepicker = new DateTimePicker({ value: new Date('4/8/2017 10:30') });
            datetimepicker.appendTo('#dateTime');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
            let tableRow = datetimepicker.dateTimeWrapper.getElementsByTagName("li")[3];
            tableRow.click();
            expect(tableRow.getAttribute("data-value")).toBe("1:30 AM");
        });
        it('string type with value test case ', () => {
            datetimepicker = new DateTimePicker({ value: <any>'2/2/2017' });
            datetimepicker.appendTo('#dateTime');
            expect(datetimepicker.element.value).toBe('2/2/2017 12:00 AM');
            expect(+datetimepicker.value).toBe(+new Date('2/2/2017 12:00 AM'))
        });
        it('string type value with onproperty test case ', () => {
            datetimepicker = new DateTimePicker({ value: <any>'2/2/2017' });
            datetimepicker.appendTo('#dateTime');
            expect(datetimepicker.element.value).toBe('2/2/2017 12:00 AM');
            expect(+datetimepicker.value).toBe(+new Date('2/2/2017 12:00 AM'));
            datetimepicker.value = "3/2/2017 12:00 AM";
            datetimepicker.dataBind();
            expect(datetimepicker.element.value).toBe('3/2/2017 12:00 AM');
            expect(+datetimepicker.value).toBe(+new Date('3/2/2017 12:00 AM'));
        });
        it('allowedit property with true test case ', () => {
            datetimepicker = new DateTimePicker({ allowEdit: true });
            datetimepicker.appendTo('#dateTime');
            expect(datetimepicker.element.getAttribute('readonly')).toBe(null);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-datepicker.e-popup-wrapper').classList.contains('e-popup-wrapper')).toBe(true);
        });
        it('allowedit property with false test case ', () => {
            datetimepicker = new DateTimePicker({ allowEdit: false });
            datetimepicker.appendTo('#dateTime');
            expect(datetimepicker.element.getAttribute('readonly')).toBe('');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-datepicker.e-popup-wrapper').classList.contains('e-popup-wrapper')).toBe(true);
        });
        it('allowedit onproperty test case ', () => {
            datetimepicker = new DateTimePicker({});
            datetimepicker.appendTo('#dateTime');
            datetimepicker.allowEdit = false;
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('readonly')).toBe('');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-datepicker.e-popup-wrapper').classList.contains('e-popup-wrapper')).toBe(true);
            datetimepicker.allowEdit = true;
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('readonly')).toBe(null);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-datepicker.e-popup-wrapper').classList.contains('e-popup-wrapper')).toBe(true);
        });
        it('allowedit property with e-non-edit calss ', () => {
            datetimepicker = new DateTimePicker({value: new Date('3/3/2017 10:00 AM')});
            datetimepicker.appendTo('#dateTime');
            expect(datetimepicker.element.getAttribute('readonly')).toBe(null);
            expect(datetimepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
            datetimepicker.allowEdit = false;
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('readonly')).toBe('');
            expect(datetimepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(true);
        });
        it('allowedit property with e-non-edit calss ', () => {
            datetimepicker = new DateTimePicker({value: new Date('3/3/2017 10:00 AM')});
            datetimepicker.appendTo('#dateTime');
            expect(datetimepicker.element.getAttribute('readonly')).toBe(null);
            expect(datetimepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
            datetimepicker.allowEdit = false;
            datetimepicker.readonly = true;
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('readonly')).toBe('');
            expect(datetimepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
        });
        it('allowedit property invalid value with e-non-edit calss  ', () => {
            datetimepicker = new DateTimePicker({});
            datetimepicker.appendTo('#dateTime');
            datetimepicker.value = 'invalid';
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('readonly')).toBe(null);
            expect(datetimepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
            datetimepicker.allowEdit = false;
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('readonly')).toBe('');
            expect(datetimepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(true);
        });
        it('Error Class for start value before 1905-Chrome testing',()=>{
            datetimepicker = new DateTimePicker();
            datetimepicker.appendTo('#dateTime');
            datetimepicker.inputElement.value = '1/1/1900 12:00 AM';
            datetimepicker.dataBind();
            datetimepicker.inputBlurHandler();
            expect((<HTMLElement>document.getElementsByClassName('e-datetime-wrapper')[0]).classList.contains('e-error')).toBe(false);
            expect(+datetimepicker.value).toBe(+new Date('1/1/1900 12:00 AM'));
        });
        it('IOS string type with value test case ', () => {
            datetimepicker = new DateTimePicker({ value: <any>"2017-02-01T18:30:00.000Z" });
            datetimepicker.appendTo('#dateTime');
            expect(datetimepicker.element.value != '').toBe(true);
            expect(datetimepicker.value != null).toBe(true)
        });
        it('popup element id testing', () => {
            if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(datetimepicker.popupWrapper.getAttribute('id')).toBe(datetimepicker.inputElement.getAttribute('id') + '_datepopup');
        });
        it('popup opened state display style attribute', () => {
            if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            }
            expect(datetimepicker.popupWrapper.style.display).toEqual('');
        });
        it('popup element selection testing', () => {
            let element: HTMLElement;
            if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
            }
            element = <HTMLElement>datetimepicker.dateTimeWrapper.querySelectorAll('.e-list-item')[0];
            (element).click();
            expect(element.classList.contains('e-active')).toBe(true);
        });
        it('popup open and close testing', () => {
            if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
            }
            if (datetimepicker.isTimePopupOpen()) {
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
            }
        });
    })
});
describe('DateTimePicker', () => {
    describe('DOM Element Testing', () => {
        describe('Input Element Testing', () => {
            let datetimepicker: any;
            let ele: any;
            beforeEach(() => {
                let ele: HTMLElement = createElement('input', { id: 'dateTime' });
                document.body.appendChild(ele);
            });
            afterEach(() => {
                if (datetimepicker) {
                    datetimepicker.destroy();
                }
                document.body.innerHTML = '';
            });
            it('Element created with cssClass property', () => {
                datetimepicker = new DateTimePicker({ cssClass: 'e-custom' });
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            });
            it('multiple cssClass  test case', () => {
                datetimepicker = new DateTimePicker({
                    cssClass: 'e-custom e-secondary-class'
                });
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
                expect(datetimepicker.inputWrapper.container.classList.contains('e-secondary-class')).toBe(true);
                datetimepicker.show();
                expect(datetimepicker.popupWrapper.classList.contains('e-custom')).toBe(true);
                expect(datetimepicker.popupWrapper.classList.contains('e-secondary-class')).toBe(true);
                datetimepicker.dataBind();
                datetimepicker.cssClass = "e-ternary e-cssClass";
                datetimepicker.dataBind();
                expect(datetimepicker.inputWrapper.container.classList.contains('e-ternary')).toBe(true);
                expect(datetimepicker.inputWrapper.container.classList.contains('e-cssClass')).toBe(true);
                datetimepicker.show();
                expect(datetimepicker.popupWrapper.classList.contains('e-ternary')).toBe(true);
                expect(datetimepicker.popupWrapper.classList.contains('e-cssClass')).toBe(true);
            });

            it('Element created with cssClass property', () => {
                datetimepicker = new DateTimePicker({ cssClass: 'e-custom' });
                datetimepicker.appendTo('#dateTime');
                datetimepicker.show('time');
                expect(datetimepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            });
            it('Element created with enableRtl property', () => {
                datetimepicker = new DateTimePicker({ enableRtl: true });
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.inputWrapper.container.classList.contains('e-rtl')).toBe(true);
            });
            it('zIndex default value ', () => {
                datetimepicker = new DateTimePicker({ placeholder: 'Select a DateTime' });
                datetimepicker.appendTo('#dateTime');
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
                datetimepicker.zIndex = 2000;
                datetimepicker.dataBind();
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
                expect(datetimepicker.popupWrapper.style.zIndex).toEqual('2000');
            });
            it('zIndex initial value change ', () => {
                datetimepicker = new DateTimePicker({ zIndex: 1500 });
                datetimepicker.appendTo('#dateTime');
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
                expect(datetimepicker.popupWrapper.style.zIndex).toEqual('1500');
            });
            it('Element created with string Format property', () => {
                datetimepicker = new DateTimePicker({ format: 'MM/dd/yyyy hh:mm a', value: new Date('04/06/2018 10:30 AM') });
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.inputElement.value == '04/06/2018 10:30 AM').toBe(true);
            });
            it('Element created with object Format property', () => {
                datetimepicker = new DateTimePicker({ format: {skeleton:'short'}, value: new Date("12/12/2016 10:15 AM") });
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.inputElement.value == '12/12/16, 10:15 AM').toBe(true);
            });
            it('Element created with Format property', () => {
                datetimepicker = new DateTimePicker();
                datetimepicker.appendTo('#dateTime');
                datetimepicker.element.value = '1/1/17';
                datetimepicker.inputBlurHandler();
                expect(+datetimepicker.value).toBe(+new Date('1/1/17'));
                expect(datetimepicker.inputElement.value == '1/1/2017 12:00 AM').toBe(true);
            });
            it('Element created with placeholder property', () => {
                datetimepicker = new DateTimePicker({ placeholder: 'Select a DateTime' });
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.placeholder).toBe('Select a DateTime');
                expect(datetimepicker.inputWrapper.container.tagName == 'SPAN').toBe(true);
                expect(datetimepicker.inputElement.getAttribute('placeholder')).toBe('Select a DateTime');
            });
            it('Element created with floatLabelType property with Auto type', () => {
                datetimepicker = new DateTimePicker({ placeholder: 'Select a DateTime', floatLabelType: 'Auto' });
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.floatLabelType).toBe('Auto');
                expect(datetimepicker.inputWrapper.container.tagName == 'DIV').toBe(true);
                expect(datetimepicker.inputWrapper.container.classList.contains('e-float-input')).toBe(true);
                expect(datetimepicker.inputWrapper.container.children[1].classList.contains('e-float-line')).toBe(true);
                expect(datetimepicker.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(true);
                expect(datetimepicker.inputWrapper.container.children[2].classList.contains('e-label-bottom')).toBe(true);
                expect(datetimepicker.inputWrapper.container.children[2].innerText).toBe('Select a DateTime');
                datetimepicker.value = new Date('04/16/2018');
                datetimepicker.dataBind();
                expect(datetimepicker.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
            });
            it('Element created with floatLabelType property with Always type', () => {
                datetimepicker = new DateTimePicker({ placeholder: 'Select a DateTime', floatLabelType: 'Always' });
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.floatLabelType).toBe('Always');
                expect(datetimepicker.inputWrapper.container.tagName == 'DIV').toBe(true);
                expect(datetimepicker.inputWrapper.container.classList.contains('e-float-input')).toBe(true);
                expect(datetimepicker.inputWrapper.container.children[1].classList.contains('e-float-line')).toBe(true);
                expect(datetimepicker.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(true);
                expect(datetimepicker.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
                expect(datetimepicker.inputWrapper.container.children[2].innerText).toBe('Select a DateTime');
                datetimepicker.value = new Date('04/16/2018');
                datetimepicker.dataBind();
                expect(datetimepicker.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
            });
            it('Element created with floatLabelType property with Never type', () => {
                datetimepicker = new DateTimePicker({ placeholder: 'Select a DateTime', floatLabelType: 'Never' });
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.floatLabelType).toBe('Never');
                expect(datetimepicker.inputWrapper.container.tagName == 'SPAN').toBe(true);
                expect(datetimepicker.inputWrapper.container.classList.contains('e-float-input')).toBe(false);
                expect(datetimepicker.inputElement.getAttribute('placeholder')).toBe('Select a DateTime');
                expect(datetimepicker.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(false);
            });
            it('autocorrect attribute test case', () => {
                datetimepicker = new DateTimePicker();
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.element.getAttribute('autocorrect') == 'off').toBe(true);
            });
            it('autocapitalize attribute test case', () => {
                datetimepicker = new DateTimePicker();
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.element.getAttribute('autocapitalize') == 'off').toBe(true);
            });
            it('spellcheck attribute test case', () => {
                datetimepicker = new DateTimePicker();
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.element.getAttribute('spellcheck') == 'false').toBe(true);
            });
            it('autocomplete attribute test case', () => {
                datetimepicker = new DateTimePicker();
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.element.getAttribute('autocomplete') == 'off').toBe(true);
            });
            /**
           * tabIndex
            */
            it('tab index of focus element', () => {
                datetimepicker = new DateTimePicker({});
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.inputWrapper.container.children[0].getAttribute('tabindex') === '0').toBe(true);
            });
            it('while give tab index to the datetimepicker element', () => {
                datetimepicker = new DateTimePicker({});
                datetimepicker.appendTo('#dateTime');
                datetimepicker.element.tabIndex = '4';
                expect(datetimepicker.inputWrapper.container.children[0].getAttribute('tabindex') === '4').toBe(true);
            });
            it('tab index of focus element in disable state ', () => {
                datetimepicker = new DateTimePicker({ enabled: false });
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.inputWrapper.container.children[0].tabIndex === -1).toBe(true);
                datetimepicker.enabled = true;
                datetimepicker.dataBind();
            });
            it('Tab index checking while destroy the component', () => {
                let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker', attrs: { "tabindex": "1" } });
                document.body.appendChild(inputEle);
                datetimepicker = new DateTimePicker({});
                datetimepicker.appendTo('#datetimepicker');
                datetimepicker.destroy();
                expect(inputEle.getAttribute('tabindex') === '1').toBe(true);
                datetimepicker = null;
            });
            it('Tab index checking while destroy the Angular component', () => {
                let element: any = createElement('ejs-datetimepicker', { id: 'datetime' });
                element.setAttribute('tabindex', '1');
                document.body.appendChild(element);
                datetimepicker = new DateTimePicker();
                datetimepicker.appendTo(element);
                datetimepicker.destroy();
                expect(element.getAttribute('tabindex') === null).toBe(true);
                datetimepicker = null;
            });
			it('Tab index checking while disabled the Angular component', () => {
                let element: any = createElement('ejs-datetimepicker', { id: 'datetime' });
                document.body.appendChild(element);
                datetimepicker = new DateTimePicker();
                datetimepicker.enabled = false;
                datetimepicker.dataBind();
                datetimepicker.appendTo(element);
                expect(datetimepicker.inputWrapper.container.children[0].tabIndex === -1).toBe(true);
            });
        });
    });
});

describe('DOM Wrapper Testing with default value ', () => {
    let mouseEventArgs: any = {
        preventDefault: function () { },
        stopPropagation: (): void => { /** NO Code */ },
        target: null
    };
    let datetimepicker: any;
    let ele: HTMLElement;
    beforeEach(() => {
        let ele: HTMLElement = createElement('input', { id: 'dateTime' });
        document.body.appendChild(ele);
        datetimepicker = new DateTimePicker({ value: new Date("10/10/2017 10:30 PM") });
        datetimepicker.appendTo('#dateTime');
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('popup active class element value equal to model value testing', () => {
        if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        }
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-active')[0].getAttribute('data-value')).toEqual("10:30 PM");
    });
    it('popup active element ARIA-SELECTED testing', () => {
        if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        }
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-active')[0].getAttribute('aria-selected')).toEqual('true');
    });
    it('step value 30 testing ', () => {
        if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        }
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-list-item')[1].getAttribute('data-value')).toEqual("12:30 AM");
    });
    it('toggle method testing', () => {
        datetimepicker = new DateTimePicker({
            value: new Date("4/4/2017 10:30 PM"), min: new Date('12/12/2016 10:00 AM'),
            max: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        }
        expect(typeof (datetimepicker.dateTimeWrapper)).toEqual("undefined");
        expect(typeof (datetimepicker.popupWrapper)).toBe("object");
        if (datetimepicker.isDatePopupOpen()) {
            datetimepicker.toggle();
        }
        expect(typeof (datetimepicker.dateTimeWrapper)).toBe("object");
        expect(datetimepicker.popupWrapper).toEqual(null);
    });
    it('toggle method testing', () => {
        datetimepicker = new DateTimePicker({
            value: new Date("4/4/2017 10:30 PM"), min: new Date('12/12/2016 10:00 AM'),
            max: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        }
        expect(typeof (datetimepicker.popupWrapper)).toBe("object");
        if (datetimepicker.isDatePopupOpen()) {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        }
        expect(datetimepicker.popupWrapper).toEqual(null);
    });
    it('Set hover testing ', () => {
        if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        }
        let li: Element = <HTMLLIElement>datetimepicker.dateTimeWrapper.querySelectorAll('li')[3];
        datetimepicker.setTimeHover(li, 'e-hover');
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('li')[3].classList.contains('e-hover')).toBe(true);
    });
    it('Set hover to new element testing ', () => {
        if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        }
        let li: Element = <HTMLLIElement>datetimepicker.dateTimeWrapper.querySelectorAll('li')[3];
        datetimepicker.setTimeHover(li, 'e-hover');
        let newLi: Element = <HTMLLIElement>datetimepicker.dateTimeWrapper.querySelectorAll('li')[4];
        datetimepicker.setTimeHover(newLi, 'e-hover');
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('li')[3].classList.contains('e-hover')).toBe(false);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('li')[4].classList.contains('e-hover')).toBe(true);
    });
    it('mouse hover testing', () => {
        datetimepicker.setTimeHover();
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        let li: Element[] = datetimepicker.dateTimeWrapper.querySelectorAll('li');
        mouseEventArgs.target = li[0];
        expect((li[0] as Element).classList.contains('e-hover')).toBe(false);
        datetimepicker.onMouseOver(mouseEventArgs);
        expect((li[0] as Element).classList.contains('e-hover')).toBe(true);
    });
    it('mouse leave testing', () => {
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        let li: Element[] = datetimepicker.dateTimeWrapper.querySelectorAll('li');
        mouseEventArgs.target = li[0];
        expect((li[0] as Element).classList.contains('e-hover')).toBe(false);
        datetimepicker.onMouseOver(mouseEventArgs);
        expect((li[0] as Element).classList.contains('e-hover')).toBe(true);
        datetimepicker.onMouseLeave(mouseEventArgs);
        expect((li[0] as Element).classList.contains('e-hover')).toBe(false);
    });
    it('readonly testing', () => {
        expect(datetimepicker.inputElement.getAttribute('readonly')).toEqual(null);
    });
    it('valid value entering when popup is in the open state', function () {
        datetimepicker = new DateTimePicker({});
        datetimepicker.appendTo('#dateTime');
        datetimepicker.show();
        datetimepicker.value = new Date('1/1/2019 1:00 AM');
        datetimepicker.dataBind();
        datetimepicker.focusOut();
        expect(datetimepicker.element.value).toBe('1/1/2019 1:00 AM');
        expect(datetimepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
    });
});
describe('DOM Wrapper Testing with basic properites', () => {
    let datetimepicker: any;
    beforeEach(() => {
        let ele: HTMLElement = createElement('input', { id: 'dateTime' });
        document.body.appendChild(ele);
        datetimepicker = new DateTimePicker({ value: new Date("10/10/2017 10:30 PM"), enabled: false, readonly: true });
        datetimepicker.appendTo('#dateTime');
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('readonly testing', () => {
        expect(datetimepicker.inputElement.getAttribute('readonly')).toEqual('');
    });
    it('placeholder testing', () => {
        datetimepicker = new DateTimePicker({ placeholder: "select DateTime" });
        datetimepicker.appendTo('#dateTime');
    });
    it('Empty value testing', () => {
        datetimepicker = new DateTimePicker({ placeholder: "select DateTime", renderDayCell: onRender, value: new Date('2/1/2018 12:00 PM') });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.valueWithMinutes = null;
        datetimepicker.getDateObject(datetimepicker.value);
    });
    it('enabled false DISABLED attribute testing', () => {
        expect(datetimepicker.inputElement.getAttribute('disabled')).toEqual('disabled');
    });
    it('enabled false input element ARIA-DISABELD testing', () => {
        expect(datetimepicker.inputElement.getAttribute('aria-disabled')).toEqual('true');
    });
    it('placeholder attribute testing', () => {
        expect(datetimepicker.inputElement.getAttribute('placeholder')).toEqual(null);
    });
    it('value checking within min and max range testing', () => {
        datetimepicker = new DateTimePicker({
            value: new Date("2/3/2017 10:30 PM"), min: new Date('12/12/2016 10:00 AM'),
            max: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        expect(datetimepicker.min).toEqual(new Date('12/12/2016 10:00 AM'));
        expect(datetimepicker.max).toEqual(new Date('3/3/2017 11:00 AM'));
        expect(datetimepicker.value).toEqual(new Date("2/3/2017 10:30 PM"));
    });
    it('value checking exeeding min value with max value testing', () => {
        let e: any = { currentTarget: datetimepicker.timeicon }
        datetimepicker = new DateTimePicker({
            value: new Date("4/4/2017 10:30 PM"), min: new Date('12/12/2016 10:00 AM'),
            max: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.timeHandler(e);
        expect(datetimepicker.min).toEqual(new Date('12/12/2016 10:00 AM'));
        expect(datetimepicker.max).toEqual(new Date('3/3/2017 11:00 AM'));
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        expect(datetimepicker.inputWrapper.container.classList.contains("e-error")).toBe(true);
        expect(datetimepicker.inputElement.value).toBe("4/4/2017 10:30 PM");
    });
    it('placeholder testing', function () {
        datetimepicker = new DateTimePicker({
            min: new Date('4/4/2010 10:00 AM'),
            max: new Date('3/3/2017 11:00 AM'),
            value: new Date('10/12/2016 10:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        expect(datetimepicker.placeholder).toBe('');
        datetimepicker.placeholder = 'Select a date and time';
        datetimepicker.dataBind();
        expect(datetimepicker.placeholder).toBe('Select a date and time');
    });
    it('value checking exeeding min value with max value testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('4/4/2017 10:00 AM'),
            max: new Date('3/3/2017 11:00 AM'),
            value: new Date('10/12/2016 10:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        let element = <HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0];
        expect(element.classList.contains("e-disabled")).toBe(true);
        datetimepicker.disablePopupButton(false)
        expect(element.classList.contains("e-disabled")).toBe(false);
    });
    it('value checking exeeding min value with max value testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('4/4/2017 10:00 AM'),
            max: new Date('3/3/2017 11:00 AM'),
            value: new Date('10/12/2016 10:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        let timeFormat: any = datetimepicker.getCldrFormat('time');
        expect(timeFormat).toBe("h:mm a");
        let timeFormat1: any = datetimepicker.cldrTimeFormat();
        expect(timeFormat1).toBe("h:mm a");
        let dateTimeFormat: any = datetimepicker.cldrDateTimeFormat();
        expect(dateTimeFormat).toBe("M/d/y h:mm a");
        datetimepicker.format = "MM/dd/yyyy hh:mm a";
        datetimepicker.dataBind();
        let dateTimeFormat1: any = datetimepicker.cldrDateTimeFormat();
        expect(dateTimeFormat1).toBe("MM/dd/yyyy hh:mm a");
    });
    it('value checking exeeding min value with max value testing', () => {
        datetimepicker = new DateTimePicker({
            value: new Date('10/12/2016 10:00 AM')
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.value = "11/12/2016 10:00 AM";
        datetimepicker.dataBind();
    });
    it('show method with input focus related test case', () => {
        datetimepicker = new DateTimePicker({
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.show('time');
        expect(datetimepicker.element.parentElement.classList.contains('e-input-focus')).toBe(false);
        datetimepicker.show('date');
        expect(datetimepicker.element.parentElement.classList.contains('e-input-focus')).toBe(false);

    });
    it('show Hide public method testing', () => {
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        datetimepicker.enabled = true;
        datetimepicker.dataBind();
        datetimepicker.readonly = false;
        datetimepicker.dataBind();
        (<HTMLElement>document.getElementsByClassName('e-date-icon')[0]).dispatchEvent(clickEvent);
        (<HTMLElement>document.getElementsByClassName('e-time-icon')[0]).dispatchEvent(clickEvent)
        expect(datetimepicker.element.parentElement.classList.contains('e-input-focus')).toBe(true);
        expect(typeof (datetimepicker.dateTimeWrapper)).toBe('object');
        datetimepicker.readonly = true;
        datetimepicker.dataBind();
    });
    it('show Hide public method testing', () => {
        (<HTMLElement>document.getElementsByClassName('e-date-icon')[0]).dispatchEvent(clickEvent);
        datetimepicker.hide();
        datetimepicker.show('time');
        datetimepicker.show('date');
        datetimepicker.enabled = false;
        datetimepicker.dataBind();
    });
    it('readonly testing', () => {
        datetimepicker = new DateTimePicker({ width: 100 });
        datetimepicker.appendTo('#dateTime');
    });


    it('format testing', () => {
        datetimepicker = new DateTimePicker({ format: "dd/MM/yyyy H:mm a" });
        datetimepicker.appendTo('#dateTime');
    });
});
describe('class', () => {
    let mouseEventArgs: any = {
        preventDefault: function () { },
        stopPropagation: (): void => { /** NO Code */ },
        target: null
    };
    let date: DateTimePicker;
    let datetimepicker: any;
    beforeEach(() => {
        let ele: HTMLElement = createElement('input', { id: 'date' });
        document.body.appendChild(ele);

    });
    afterEach(() => {
        if (date) {
            date.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Without error class', () => {
        datetimepicker = new DateTimePicker({
            value: new Date("11/12/2017"), min: new Date("1/12/2017"),
            max: new Date("12/12/2017")
        });
        datetimepicker.appendTo('#date');
        expect(datetimepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        expect(datetimepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
        expect(datetimepicker.element.value).toBe("11/12/2017 12:00 AM");
        expect(datetimepicker.value.valueOf()).toBe(+ new Date("11/12/2017 12:00 AM"));

    });
    it('value out of range with error class', () => {
        datetimepicker = new DateTimePicker({
            value: new Date("11/12/2018"), min: new Date("1/12/2017"),
            max: new Date("12/12/2017")
        });
        datetimepicker.appendTo('#date');
        expect(datetimepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        expect(datetimepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        expect(datetimepicker.element.value).toBe("11/12/2018 12:00 AM");
        expect(datetimepicker.value.valueOf()).toBe(+ new Date("11/12/2018 12:00 AM"));

    });
    it(' min with value out of range with error class', () => {
        datetimepicker = new DateTimePicker({
            value: new Date("1/10/2017"), min: new Date("1/12/2017")
        });
        datetimepicker.appendTo('#date');
        expect(datetimepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        expect(datetimepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        expect(datetimepicker.element.value).toBe("1/10/2017 12:00 AM");
        expect(datetimepicker.value.valueOf()).toBe(+ new Date("1/10/2017 12:00 AM"));

    });
    it('max with value out of range with error class', () => {
        datetimepicker = new DateTimePicker({
            value: new Date("1/15/2017"), max: new Date("1/12/2017")
        });
        datetimepicker.appendTo('#date');
        expect(datetimepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        expect(datetimepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        expect(datetimepicker.element.value).toBe("1/15/2017 12:00 AM");
        expect(datetimepicker.value.valueOf()).toBe(+ new Date("1/15/2017 12:00 AM"));

    });
    // it('onproperty changes with error class test case', () => {
    //     datetimepicker = new DateTimePicker({
    //         min: new Date("1/11/2017"), max: new Date("1/15/2017")
    //     });
    //     datetimepicker.appendTo('#date');
    //     expect(datetimepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
    //     datetimepicker.value = new Date('1/17/2017');
    //     datetimepicker.dataBind();
    //     (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
    //     (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
    //     expect(datetimepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
    //     expect(datetimepicker.element.value).toBe("1/15/2017 12:00 AM");
    //     expect(datetimepicker.value.valueOf()).toBe(+ new Date("1/15/2017 12:00 AM"));
    // });
});
describe('document strict mode testing', () => {
    let datetimepicker: any;
    beforeEach(() => {
        let ele: HTMLElement = createElement('input', { id: 'dateTime' });
        document.body.appendChild(ele);
        datetimepicker = new DateTimePicker({ value: new Date("10/10/2017 10:30 PM") });
        datetimepicker.appendTo('#dateTime');
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('enable strict mode with range value', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('4/4/2016 10:00 AM'),
            max: new Date('3/3/2017 11:00 AM'),
            value: new Date('10/12/2016 10:00 AM'),
            strictMode: true,
        });
        datetimepicker.appendTo('#dateTime');
        expect(datetimepicker.min.valueOf()).toEqual(new Date('4/4/2016 10:00 AM').valueOf());
        expect(datetimepicker.max.valueOf()).toEqual(new Date('3/3/2017 11:00 AM').valueOf());
        expect(datetimepicker.value.valueOf()).toEqual(new Date("10/12/2016 10:00 AM").valueOf());
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        expect(getIdValue(document.querySelector('tr td.e-selected'))).toBe(new Date('10/12/2016 10:00 AM').valueOf());
        datetimepicker.toggle();
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-list-item')[1].getAttribute('data-value')).toEqual("12:30 AM");
    })
    it('strictMode false with out of range test case ', () => {
        datetimepicker = new DateTimePicker({
            value: new Date('3/3/9999 10:00 AM'), min: new Date('3/3/2017 10:00 AM'), max: new Date('3/30/2017 10:00 AM')
            , change: function (args: any) {
                expect(+args.value).toBe(+new Date('3/9/2017 10:00 AM'));
            }
        });
        datetimepicker.appendTo('#dateTime');
        expect(datetimepicker.inputWrapper.container.classList.contains('e-error')).toEqual(true);
        datetimepicker.value = new Date('3/9/2017 10:00 AM');
        datetimepicker.dataBind();
    });
    it('step testing', () => {
        datetimepicker = new DateTimePicker({
            step: 30
        });
        datetimepicker.appendTo('#dateTime');
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        datetimepicker.toggle();
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-list-item')[1].getAttribute('data-value')).toEqual("12:30 AM");
    });
    it('toggle testing', () => {
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#dateTime');
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        datetimepicker.toggle();
        expect(typeof (datetimepicker.popupWrapper)).toBe("object");
    });
    it('Date icon testing', () => {
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#dateTime');
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        expect(typeof (datetimepicker.popupWrapper)).toBe("object");
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        expect(datetimepicker.popupWrapper).toBe(null);
    });
    it('enable strict mode with behind the min value range', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('4/4/2016 10:00 AM'),
            max: new Date('3/3/2017 11:00 AM'),
            value: new Date('3/3/2016 10:00 AM'),
            strictMode: true,
        });
        datetimepicker.appendTo('#dateTime');
        expect(datetimepicker.min.valueOf()).toEqual(new Date('4/4/2016 10:00 AM').valueOf());
        expect(datetimepicker.max.valueOf()).toEqual(new Date('3/3/2017 11:00 AM').valueOf());
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        expect(getIdValue(document.querySelector('tr td.e-selected'))).toBe(new Date('4/4/2016 10:00 AM').valueOf());
        expect(datetimepicker.value.valueOf()).toEqual(new Date('4/4/2016 10:00 AM').valueOf());
        datetimepicker.toggle();
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-list-item')[1].getAttribute('data-value')).toEqual("10:30 AM");
    })
    it('enable strict mode with exeeding the max value range', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('4/4/2016 10:00 AM'),
            max: new Date('3/3/2017 11:00 AM'),
            value: new Date('4/4/2017 10:00 AM'),
            strictMode: true,
        });
        datetimepicker.appendTo('#dateTime');
        expect(datetimepicker.min.valueOf()).toEqual(new Date('4/4/2016 10:00 AM').valueOf());
        expect(datetimepicker.max.valueOf()).toEqual(new Date('3/3/2017 11:00 AM').valueOf());
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        expect(getIdValue(document.querySelector('tr td.e-selected'))).toBe(new Date('3/3/2017 11:00 AM').valueOf());
        expect(datetimepicker.value.valueOf()).toEqual(new Date('3/3/2017 11:00 AM').valueOf());
        datetimepicker.toggle();
        let index = datetimepicker.dateTimeWrapper.querySelectorAll('.e-list-item').length;
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-list-item')[index - 1].getAttribute('data-value')).toEqual("11:00 AM");
    })
    it('enable strict mode with range value to dynamic Date', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('4/4/2016 10:00 AM'),
            max: new Date('3/3/2017 11:00 AM'),
            strictMode: true,
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.value = new Date('10/12/2016 10:00 AM');
        datetimepicker.dataBind();
        datetimepicker.changeEvent();
        expect(datetimepicker.min.valueOf()).toEqual(new Date('4/4/2016 10:00 AM').valueOf());
        expect(datetimepicker.max.valueOf()).toEqual(new Date('3/3/2017 11:00 AM').valueOf());
        expect(datetimepicker.value.valueOf()).toEqual(new Date("10/12/2016 10:00 AM").valueOf());
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        expect(getIdValue(document.querySelector('tr td.e-selected'))).toBe(new Date('10/12/2016 10:00 AM').valueOf());
        datetimepicker.toggle();
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-list-item')[1].getAttribute('data-value')).toEqual("12:30 AM");
    })
    it('enable strict mode with behind the min value range', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('4/4/2016 10:00 AM'),
            max: new Date('3/3/2017 11:00 AM'),
            strictMode: true,
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.value = new Date('3/3/2016 10:00 AM');
        datetimepicker.dataBind();
        expect(datetimepicker.min.valueOf()).toEqual(new Date('4/4/2016 10:00 AM').valueOf());
        expect(datetimepicker.max.valueOf()).toEqual(new Date('3/3/2017 11:00 AM').valueOf());
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        expect(getIdValue(document.querySelector('tr td.e-selected'))).toBe(new Date('4/4/2016 10:00 AM').valueOf());
        expect(datetimepicker.value.valueOf()).toEqual(new Date('4/4/2016 10:00 AM').valueOf());
        datetimepicker.toggle();
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-list-item')[1].getAttribute('data-value')).toEqual("10:30 AM");
    })
    it('enable strict mode with exeeding the max value range', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('4/4/2016 10:00 AM'),
            max: new Date('3/3/2017 11:00 AM'),
            strictMode: true,
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.value = new Date('4/4/2017 10:00 AM');
        datetimepicker.dataBind();
        expect(datetimepicker.min.valueOf()).toEqual(new Date('4/4/2016 10:00 AM').valueOf());
        expect(datetimepicker.max.valueOf()).toEqual(new Date('3/3/2017 11:00 AM').valueOf());
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        expect(getIdValue(document.querySelector('tr td.e-selected'))).toBe(new Date('3/3/2017 11:00 AM').valueOf());
        expect(datetimepicker.value.valueOf()).toEqual(new Date('3/3/2017 11:00 AM').valueOf());
        datetimepicker.toggle();
        let index = datetimepicker.dateTimeWrapper.querySelectorAll('.e-list-item').length;
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-list-item')[index - 1].getAttribute('data-value')).toEqual("11:00 AM");
    })
    it('enable strict mode with exeeding the max value range', () => {
        datetimepicker = new DateTimePicker({
            max: new Date('3/3/2017 11:00 AM'),
            strictMode: true,
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.min = new Date('4/4/2017 10:00 AM');
        datetimepicker.dataBind();
        let element = <HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0];
        expect(element.classList.contains("e-disabled")).toBe(true);
        let elementTime = <HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0];
        expect(elementTime.classList.contains("e-disabled")).toBe(true);
    })
    it('enable strict mode with exeeding the max value range', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
            strictMode: true,
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.max = new Date('4/4/2017 10:00 AM');
        datetimepicker.dataBind();
    })
    it('enable strict mode with exeeding the max value range', () => {
        datetimepicker = new DateTimePicker({
            max: new Date('3/3/2017 11:00 AM'),
            strictMode: false,
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.min = new Date('4/4/2017 10:00 AM');
        datetimepicker.dataBind();
        let element = <HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0];
        expect(element.classList.contains("e-disabled")).toBe(true);
        let elementTime = <HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0];
        expect(elementTime.classList.contains("e-disabled")).toBe(true);
    })
    it('onproperty change strict mode testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.strictMode = true;
        datetimepicker.dataBind();
    })
    it('onproperty change value testing', () => {
        datetimepicker = new DateTimePicker({
            value: new Date('3/3/2017 11:00 AM')
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.value = '3/3/2017 11:00 AM';
        datetimepicker.value = new Date('5/3/2017 11:00 AM')
        datetimepicker.dataBind();
        datetimepicker.element.value = '5/3/2017 11:00 AM';
    })
    it('onproperty change enabled testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.enabled = false;
        datetimepicker.dataBind();
    })
    it('onproperty change value testing', () => {
        datetimepicker = new DateTimePicker({
            value: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.value = null;
        datetimepicker.dataBind();
    })
    it('onproperty change placeHolder testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.placeholder = "hai";
        datetimepicker.dataBind();
    })
    it('onproperty change enableRTL testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.enableRTL = true;
        datetimepicker.dataBind();
    })
    it('onproperty change zIndex testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.zIndex = 1000;
        datetimepicker.dataBind();
    })
    it('onproperty change width 300px testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.width = "300px";
        datetimepicker.dataBind();
        expect(datetimepicker.inputWrapper.container.style.width).toBe('300px');
        datetimepicker.show('time');
        expect(datetimepicker.dateTimeWrapper.style.width).toBe("300px");
    })
    it('onproperty change width 30em testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.width = "30em";
        datetimepicker.dataBind();
        expect(datetimepicker.inputWrapper.container.style.width).toBe('30em');
        datetimepicker.show('time');
        // expect(datetimepicker.dateTimeWrapper.style.width).toBe("30em");
    })
    it('onproperty change width 300 testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.width = "300";
        datetimepicker.dataBind();
        expect(datetimepicker.inputWrapper.container.style.width).toBe('300px');
        datetimepicker.show('time');
        expect(datetimepicker.dateTimeWrapper.style.width).toBe("300px");
    })
    it('onproperty change width 300 testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.width = 300;
        datetimepicker.dataBind();
        expect(datetimepicker.inputWrapper.container.style.width).toBe('300px');
        datetimepicker.show('time');
        expect(datetimepicker.dateTimeWrapper.style.width).toBe("300px");
    })
    it('onproperty change width 40% testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.width = '40%';
        datetimepicker.dataBind();
        expect(datetimepicker.inputWrapper.container.style.width).toBe('40%');
    })
    it('onproperty change width 40% testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.show();
        datetimepicker.show('time');
        expect(datetimepicker.isTimePopupOpen()).toBe(true);
    })
    it('onproperty change readonly testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.readonly = true;
        datetimepicker.dataBind();
        datetimepicker.show();
        expect(datetimepicker.isDatePopupOpen()).toBe(false);
        datetimepicker.show('time');
        expect(datetimepicker.isTimePopupOpen()).toBe(false);
    })
    it('onproperty change disabled testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.enabled = false;
        datetimepicker.dataBind();
        datetimepicker.show();
        expect(datetimepicker.isDatePopupOpen()).toBe(false);
        datetimepicker.show('time');
        expect(datetimepicker.isTimePopupOpen()).toBe(false);
    })
    it('onproperty change enableRTL testing', () => {
        datetimepicker = new DateTimePicker({
            value: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.enableRtl = true;
        datetimepicker.dataBind();
    })
    it('onproperty change cssClass testing', () => {
        datetimepicker = new DateTimePicker({
            value: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.cssClass = "e-main";
        datetimepicker.dataBind();
    })
    it('onproperty change cssClass with timepopup opened state testing', () => {
        datetimepicker = new DateTimePicker({
            value: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.show('time');
        datetimepicker.cssClass = "e-main";
        datetimepicker.dataBind();
    })
    it('onproperty change cssClass with timepopup opened state testing', () => {
        datetimepicker = new DateTimePicker({
            value: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.show();
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        datetimepicker.cssClass = "e-main";
        datetimepicker.dataBind();
    })
    it('onproperty change cssClass with DatePopup opened state testing', () => {
        datetimepicker = new DateTimePicker({
            value: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.show('time');
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        datetimepicker.cssClass = "e-main";
        datetimepicker.dataBind();
    })
    it('onproperty change floatLabelType testing', () => {
        datetimepicker = new DateTimePicker({
            value: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.floatLabelType = 'Always';
        datetimepicker.dataBind();
        expect(datetimepicker.floatLabelType).toBe('Always');
    })
    it('onproperty change string format testing', () => {
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#dateTime');
        datetimepicker.value = new Date('3/3/2017 11:00 AM');
        datetimepicker.dataBind();
        datetimepicker.format = 'dd/MM/yyyy HH:mm';
        datetimepicker.dataBind();
        expect(datetimepicker.inputElement.value).toBe('03/03/2017 11:00');
    })
    it('onproperty change object format testing', () => {
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#dateTime');
        datetimepicker.value = new Date("12/12/2016 10:15 AM");
        datetimepicker.dataBind();
        datetimepicker.format = {skeleton:'short'};
        datetimepicker.dataBind();
        expect(datetimepicker.inputElement.value).toBe('12/12/16, 10:15 AM');
    })
    it('onproperty change cssClass during time popup open time testing', (done) => {
        datetimepicker = new DateTimePicker({
            value: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.show('time');
        setTimeout(function () {
            datetimepicker.cssClass = "e-main";
            datetimepicker.dataBind();
            expect(datetimepicker.dateTimeWrapper.classList.contains('e-main')).toBe(true);
            done();
        }, 450);
    })
    it('onproperty change cssClass during popup open time testing', (done) => {
        datetimepicker = new DateTimePicker({
            value: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.cssClass = "e-main";
        datetimepicker.show('date');
        datetimepicker.dataBind();
        setTimeout(function () {
            expect(datetimepicker.popupWrapper.classList.contains('e-main')).toBe(true);
            done();
        }, 450);
    })
    it('onproperty change weekNumber testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.weekNumber = true;
        datetimepicker.dataBind();
    })
    it('onproperty change firstDayOfWeek testing', () => {
        datetimepicker = new DateTimePicker({
            min: new Date('3/3/2017 11:00 AM'),
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.firstDayOfWeek = 2;
        datetimepicker.dataBind();
    })
    it('enable strict mode with exeeding the max value range', () => {
        datetimepicker = new DateTimePicker({
            max: new Date('3/3/2017 11:00 AM'),
            value: new Date("4/4/2017 10:00 PM"),
            strictMode: false,
        });
        datetimepicker.appendTo('#dateTime');
        <HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0];
    })
});


describe('clear button', () => {
    let mouseEventArgs: any = {
        preventDefault: function () { },
        stopPropagation: (): void => { /** NO Code */ },
        target: null
    };
    let date: DateTimePicker;
    let datetimepicker: any;
    beforeEach(() => {
        let ele: HTMLElement = createElement('input', { id: 'date' });
        document.body.appendChild(ele);
        datetimepicker = new DateTimePicker({
            value: new Date("12/12/2016"), showClearButton: true,
            change: function (args: any) {
                expect(args.value).toBe(null);
            }
        });
        datetimepicker.appendTo('#date');
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Onclick test case', () => {
        expect(datetimepicker.value.valueOf()).toBe(new Date("12/12/2016").valueOf());
        (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
        expect(datetimepicker.element.value).toBe("");
        expect(datetimepicker.value).toBe(null);
    });
});
describe('document layout testing', () => {
    let clickEventArgs: any = {
        preventDefault: (): void => { /** NO Code */ },
        stopPropagation: (): void => { /** NO Code */ },
        currentTarget: '',
        target: ''
    };
    let datetimepicker: any;
    beforeEach(() => {
        let btn: HTMLElement = createElement('button', { id: 'btn' });
        document.body.appendChild(btn);
        let ele: HTMLElement = createElement('input', { id: 'dateTime' });
        document.body.appendChild(ele);
        datetimepicker = new DateTimePicker({ value: new Date("10/10/2017 10:30 PM") });
        datetimepicker.appendTo('#dateTime');
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('open popup by clicking the button element', () => {
        if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        }
        expect(datetimepicker.isTimePopupOpen()).toBe(true);
    });
    it('open popup by clicking the button element with null value ', (done) => {
        datetimepicker = new DateTimePicker({
            max: new Date('3/3/2017 11:00 AM'), value: new Date("4/4/2017 10:00 PM"),
            strictMode: false
        });
        datetimepicker.appendTo('#dateTime');
        if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        }
        datetimepicker.blurHandler();
        clickEventArgs.currentTarget = document.getElementById('btn');
        clickEventArgs.target = document.getElementById('btn');
        datetimepicker.documentClickHandler(clickEventArgs);
        setTimeout(function () {
            // expect(datetimepicker.isTimePopupOpen()).toBe(false);
            done();
        }, 450);
    });
    it('wrapper ARIA-ACTIVEDESCENDANT testing', (done) => {
        if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        }
        expect(datetimepicker.isTimePopupOpen()).toBe(true);
        datetimepicker.setTimeActiveClass();
        let element: HTMLElement = datetimepicker.selectedElement;
        expect(datetimepicker.inputElement.getAttribute('aria-activedescendant')).toBe(element.getAttribute('id'));
        done();
    });
});
describe('ShowTodayButton set as false', () => {
    let datetimepicker: any;
    datetimepicker = undefined;
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'dateTime' });
        document.body.appendChild(ele);
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Dynamically change ShowTodayButton as false', () => {
        datetimepicker = new DateTimePicker({ value: new Date("10/15/2019 10:30 PM") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.min = new Date('10/10/2019 10:00 AM');
        datetimepicker.dataBind();
        datetimepicker.max = new Date('12/20/2019 12:00 AM');
        datetimepicker.ShowTodayButton = false;
        expect(datetimepicker.min).toEqual(new Date('10/10/2019 10:00 AM'));
        expect(datetimepicker.max).toEqual(new Date('12/20/2019 12:00 AM'));
        expect(datetimepicker.ShowTodayButton).toBe(false);
    });
});
describe('Localization testing', () => {
    let datetimepicker: any;
    beforeEach(() => {
        let ele: HTMLElement = createElement('input', { id: 'dateTime' });
        document.body.appendChild(ele);
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('english culture initial time testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 5:00") });
        datetimepicker.appendTo('#dateTime');
        expect(datetimepicker.cldrDateTimeFormat()).toEqual("M/d/y h:mm a");
        expect((<HTMLInputElement>datetimepicker.element).value).toEqual("12/12/2016 5:00 AM");
    });
    it('German culture (de-DE) testing', () => {
        loadCultureFiles('de');
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 14:00"), locale: 'de' });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.value = new Date("12/12/2016 15:00");
        datetimepicker.dataBind();
        expect(datetimepicker.locale).toBe('de');
        expect(datetimepicker.cldrDateTimeFormat()).toEqual('d.M.y HH:mm');
        expect(datetimepicker.cldrTimeFormat()).toEqual('HH:mm');
        expect((<HTMLInputElement>datetimepicker.element).value).toEqual("12.12.2016 15:00");
    });
    it('German culture (de-DE) customeFormat testing', () => {
        loadCultureFiles('de');
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 14:00"), locale: 'de', timeFormat: "hh:mm" });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.value = new Date("12/12/2016 15:00");
        datetimepicker.dataBind();
        expect(datetimepicker.locale).toBe('de');
        expect(datetimepicker.cldrDateTimeFormat()).toEqual('d.M.y HH:mm');
        expect(datetimepicker.cldrTimeFormat()).toEqual('hh:mm');
        expect((<HTMLInputElement>datetimepicker.element).value).toEqual("12.12.2016 15:00");
    });
    it('Jakarta culture (ja) testing', () => {
        loadCultureFiles('ja');
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 15:00") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.locale = 'ja';
        datetimepicker.dataBind();
        datetimepicker.appendTo('#dateTime');
        expect(datetimepicker.locale).toBe('ja');
        expect(datetimepicker.cldrDateTimeFormat()).toEqual("y/M/d H:mm");
        expect((<HTMLInputElement>datetimepicker.element).value).toEqual("2016/12/12 15:00");
    });
    it('Arabian culture (ar) testing', () => {
        loadCultureFiles('ar', true);
        loadCultureFiles('ar');
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 14:00"), locale: 'ar' });
        datetimepicker.appendTo('#dateTime');
        expect(datetimepicker.locale).toBe('ar');
        expect(datetimepicker.cldrDateTimeFormat()).toEqual("d‏/M‏/y h:mm a");
        expect((<HTMLInputElement>datetimepicker.element).value).toEqual("١٢‏/١٢‏/٢٠١٦ ٢:٠٠ م");
    });
    it('Arabian culture (ar - QA) testing', () => {
        loadCultureFiles('ar-QA', true);
        loadCultureFiles('ar-QA');
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 14:00"), locale: 'ar-QA' });
        datetimepicker.appendTo('#dateTime');
        expect(datetimepicker.locale).toBe('ar-QA');
        expect(datetimepicker.cldrDateTimeFormat()).toEqual("d‏/M‏/y h:mm a");
        expect((<HTMLInputElement>datetimepicker.element).value).toEqual("١٢‏/١٢‏/٢٠١٦ ٢:٠٠ م");
    });

    it('firstDayOfWeek based on the culture "de" test case', () => {
        loadCultureFiles('de', true);
        loadCultureFiles('de');
        datetimepicker = new DateTimePicker({ value: new Date('2/2/2017'), locale: 'de' });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.show();
        expect(datetimepicker.firstDayOfWeek).toBe(1)
        expect(datetimepicker.tableHeadElement.querySelector('th').textContent).toBe('Mo.');
    });

    it('firstDayOfWeek based on the culture "ar" test case', () => {
        loadCultureFiles('ar', true);
        loadCultureFiles('ar');
        datetimepicker = new DateTimePicker({ value: new Date('2/2/2017'), locale: 'ar' });
        datetimepicker.appendTo('#dateTime');
        // CLDR Data
        // expect(datetimepicker.firstDayOfWeek).toBe(6)

    });
});
describe('HTML attributes at inline element testing', () => {
    let datetimepicker: any;
    beforeEach((): void => {
        datetimepicker = undefined;
        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'datetime' });
        ele.setAttribute('placeholder','Enter a date');
        ele.setAttribute('readonly', '');
        ele.setAttribute('disabled', '');
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Inline element testing', () => {
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.placeholder).toBe("Enter a date");
        expect(datetimepicker.element.hasAttribute('readonly')).toBe(true);
        expect(datetimepicker.element.hasAttribute('enabled')).toBe(false);
    });
    it('Inline and API testing', () => {
        datetimepicker = new DateTimePicker({placeholder:"Select a date", readonly: false, enabled: true});
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.placeholder).toBe("Select a date");
        expect(datetimepicker.element.hasAttribute('readonly')).toBe(false);
        expect(datetimepicker.element.hasAttribute('disabled')).toBe(false);
    });
    it('Inline and html attributes API testing', () => {
        datetimepicker = new DateTimePicker({ htmlAttributes:{placeholder:"Choose a date"}});
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.placeholder).toBe("Choose a date");
    });
    it('Inline, API and html attributes API testing', () => {
        datetimepicker = new DateTimePicker({ htmlAttributes:{placeholder:"Choose a date", readonly: "true", disabled: "",}, placeholder: "Select a date", readonly: false, enabled: true});
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.placeholder).toBe("Select a date");
        expect(datetimepicker.element.hasAttribute('readonly')).toBe(false);
        expect(datetimepicker.element.hasAttribute('enabled')).toBe(false);
    });
});

describe('HTML attribute API testing', () => {
    let datetimepicker: any;
    beforeEach((): void => {
        datetimepicker = undefined;
        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'datetime' });
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('API testing', () => {
        datetimepicker = new DateTimePicker({placeholder:"Select a date", readonly: false, enabled: true});
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.placeholder).toBe("Select a date");
        expect(datetimepicker.element.hasAttribute('readonly')).toBe(false);
        expect(datetimepicker.element.hasAttribute('disabled')).toBe(false);
    });
    it('HTML attributes API testing', () => {
        datetimepicker = new DateTimePicker({ htmlAttributes:{placeholder:"Choose a date", readonly: "false"}});
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.placeholder).toBe("Choose a date");
        expect(datetimepicker.element.hasAttribute('readonly')).toBe(false);
    });
    it('API and HTML attributes API testing', () => {
        datetimepicker = new DateTimePicker({ htmlAttributes:{placeholder:"Choose a date", readonly: "true", disabled: ""}, placeholder: "Select a date", readonly: false, enabled: true});
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.placeholder).toBe("Select a date");
        expect(datetimepicker.element.hasAttribute('readonly')).toBe(false);
        expect(datetimepicker.element.hasAttribute('enabled')).toBe(false);
    });
    it('Other attribute testing with htmlAttributes API', () => {
        datetimepicker = new DateTimePicker({ htmlAttributes:{name:"picker", class: "test", title:"sample"}});
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.getAttribute('name')).toBe('picker');
        expect(datetimepicker.inputWrapper.container.getAttribute('title')).toBe('sample');
        expect(datetimepicker.inputWrapper.container.classList.contains('test')).toBe(true);
    });
});

describe('HTML attribute API dynamic testing', () => {
    let datetimepicker: any;
    beforeEach((): void => {
        datetimepicker = undefined;
        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'datetime' });
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Dynamically change attributes with htmlAttributes API', () => {
        datetimepicker = new DateTimePicker({ htmlAttributes:{placeholder:"Enter a date", readonly: "", disabled: "true", value: "2/20/2018", max: "2/25/2018", min: "2/10/2018", title:"sample"}});
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.getAttribute('placeholder')).toBe('Enter a date');
        expect(datetimepicker.element.hasAttribute('readonly')).toBe(true);
        expect(datetimepicker.element.hasAttribute('disabled')).toBe(true);
        expect(datetimepicker.element.value).toBe('2/20/2018 12:00 AM');
        expect(datetimepicker.element.min).toBe('2/10/2018');
        expect(datetimepicker.element.max).toBe('2/25/2018');
        expect(datetimepicker.inputWrapper.container.getAttribute('title')).toBe('sample');
        datetimepicker.htmlAttributes = { placeholder:"choose a date", readonly: "false", disabled: "false", value: "4/20/2018", max: "4/25/2018", min: "4/10/2018", title:"heading"};
        datetimepicker.dataBind();
        expect(datetimepicker.element.getAttribute('placeholder')).toBe('choose a date');
        expect(datetimepicker.element.hasAttribute('readonly')).toBe(false);
        expect(datetimepicker.element.hasAttribute('disabled')).toBe(false);
        expect(datetimepicker.element.value).toBe('4/20/2018 12:00 AM');
        expect(datetimepicker.element.min).toBe('4/10/2018');
        expect(datetimepicker.element.max).toBe('4/25/2018');
        expect(datetimepicker.inputWrapper.container.getAttribute('title')).toBe('heading');
    });
    it('Placeholder testing in auto case', () => {
        datetimepicker = new DateTimePicker({ floatLabelType: "Auto", htmlAttributes:{placeholder:"Enter a name" }});
        datetimepicker.appendTo('#datetime');
            expect(datetimepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter a name');
            datetimepicker.htmlAttributes = { placeholder:"choose a date"};
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            datetimepicker.floatLabelType = "Always";
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            datetimepicker.floatLabelType = "Never";
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('placeholder')).toBe('choose a date');
        });
        it('Placeholder testing in always case', () => {
            datetimepicker = new DateTimePicker({ floatLabelType: "Always", htmlAttributes:{placeholder:"Enter a name" }});
            datetimepicker.appendTo('#datetime');
            expect(datetimepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter a name');
            datetimepicker.htmlAttributes = { placeholder:"choose a date"};
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            datetimepicker.floatLabelType = "Auto";
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            datetimepicker.floatLabelType = "Never";
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('placeholder')).toBe('choose a date');
        });
        it('Placeholder testing in never case', () => {
            datetimepicker = new DateTimePicker({ floatLabelType: "Never", htmlAttributes:{placeholder:"Enter a name" }});
            datetimepicker.appendTo('#datetime');
            expect(datetimepicker.element.getAttribute('placeholder')).toBe('Enter a name');
            datetimepicker.htmlAttributes = { placeholder:"choose a date"};
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('placeholder')).toBe('choose a date');
            datetimepicker.floatLabelType = "Always";
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            datetimepicker.floatLabelType = "Auto";
            datetimepicker.dataBind();
            expect(datetimepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
        });
});
describe('HTML attribute API at inital rendering and dynamic rendering', () => {
    let datetimepicker: any;
    beforeEach((): void => {
        datetimepicker = undefined;
        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'datetime' });
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Html attributes at initial rendering', () => {
        datetimepicker = new DateTimePicker({ htmlAttributes:{placeholder:"Choose a date", class: "sample" } });
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.getAttribute('placeholder')).toBe('Choose a date');
        expect(datetimepicker.inputWrapper.container.classList.contains('sample')).toBe(true);
    });
    it('Pass multiple attributes dynamically', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 10:00") });
        datetimepicker.appendTo('#datetime');
        datetimepicker.htmlAttributes = { class:"sample", readonly: "true", disabled: "true"};
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe('12/12/2016 10:00 AM');
        expect(datetimepicker.inputWrapper.container.classList.contains('sample')).toBe(true);
        expect(datetimepicker.element.hasAttribute('readonly')).toBe(true);
        expect(datetimepicker.element.hasAttribute('disabled')).toBe(true);
    });
    it('Dynamically change attributes through htmlAttributes API', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 10:00") });
        datetimepicker.appendTo('#datetime');
        datetimepicker.inputElement.value = '10/10/2016 10:00';
        datetimepicker.htmlAttributes = { class:"sample" };
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe('10/10/2016 10:00');
    });
    it('Dynamically change multiple attributes through htmlAttributes API', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 10:00 AM") });
        datetimepicker.appendTo('#datetime');
        datetimepicker.htmlAttributes = { class:"sample" , max:'10/5/2016 10:00', min:'10/20/2016 10:00'};
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe('12/12/2016 10:00 AM');
        expect(datetimepicker.element.getAttribute('max')).toBe('10/5/2016 10:00');
        expect(datetimepicker.element.getAttribute('min')).toBe('10/20/2016 10:00');
    });
    it('Pass null value in htmlAttributes', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 10:00 AM") });
        datetimepicker.appendTo('#datetime');
        datetimepicker.htmlAttributes = { null: "null"};
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe('12/12/2016 10:00 AM');
    });
    it('Pass undefined in htmlAttributes', () => {
        datetimepicker = new DateTimePicker({value: new Date("12/12/2016 10:00 AM") });
        datetimepicker.appendTo('#datetime');
        datetimepicker.htmlAttributes = { undefined: "undefined"};
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe('12/12/2016 10:00 AM');
    });
    it('Pass empty value in htmlAttributes', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 10:00") });
        datetimepicker.appendTo('#datetime');
        datetimepicker.inputElement.value = "12/12/2016 10:00";
        datetimepicker.htmlAttributes = {};
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe('12/12/2016 10:00');
    });
});
describe('keyboard events', () => {
    let datetimepicker: any;
    let keyEventArgs: any = {
        preventDefault: (): void => { /** NO Code */ },
        stopPropagation: (): void => { /** NO Code */ },
        action: 'altDownArrow'
    };
    beforeEach(() => {
        let ele: HTMLElement = createElement('input', { id: 'dateTime' });
        document.body.appendChild(ele);
        let head: HTMLElement = createElement('head');
        document.body.appendChild(head);
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it(' alt+DownArrow key test case', function () {
        datetimepicker = new DateTimePicker({
        });
        datetimepicker.appendTo('#dateTime');
        keyEventArgs.action = 'altDownArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        expect(document.getElementsByClassName('e-calendar')[0].classList.contains('e-calendar')).toBe(true);
    });
    it(' alt+UpArrow key test case', function () {
        datetimepicker = new DateTimePicker({
        });
        datetimepicker.appendTo('#dateTime');
        keyEventArgs.action = 'altUpArrow';
        datetimepicker.element.focus();
        datetimepicker.inputKeyActionHandle(keyEventArgs);
        expect(document.getElementsByClassName('e-calendar').length).toBe(0);
    });
    it(' escape key test case', function () {
        datetimepicker = new DateTimePicker({
        });
        datetimepicker.appendTo('#dateTime');
        keyEventArgs.action = 'escape'
        datetimepicker.element.focus();
        datetimepicker.inputKeyActionHandle(keyEventArgs);
        expect(document.getElementsByClassName('e-calendar').length).toBe(0);
    });
    it(' enter key test case', function () {
        datetimepicker = new DateTimePicker({});
        datetimepicker.appendTo('#dateTime');
        keyEventArgs.action = 'enter';
        datetimepicker.element.value = '3/3/2017 10:00 PM';
        datetimepicker.inputBlurHandler();
        datetimepicker.element.focus();
        datetimepicker.inputKeyActionHandle(keyEventArgs);
        expect(datetimepicker.element.value).toBe('3/3/2017 10:00 PM');
        expect(document.getElementsByClassName('e-calendar').length).toBe(0);
    });
    it(' control+UpArrow', function () {
        datetimepicker = new DateTimePicker({
        });
        datetimepicker.appendTo('#dateTime');
        keyEventArgs.action = 'escape'
        datetimepicker.element.focus();
        datetimepicker.inputKeyActionHandle(keyEventArgs);
        expect(document.getElementsByClassName('e-calendar').length).toBe(0);
    });
    it('control + UP arrow test case ', () => {
        datetimepicker = new DateTimePicker({});
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'altDownArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        keyEventArgs.action = 'controlUp';
        datetimepicker.inputKeyActionHandle(keyEventArgs);
        expect(datetimepicker.currentView()).toBe("Year");
        datetimepicker.inputKeyActionHandle(keyEventArgs);
        expect(datetimepicker.currentView()).toBe("Decade");
    });
    it('keyboard action with mouse click on next icon test case ', () => {
        datetimepicker = new DateTimePicker({
            value: new Date('2/2/2017')
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'altDownArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        (<HTMLElement>document.querySelector('.e-prev span')).click();
        expect(document.querySelector('.e-title').textContent).toBe('January 2017');
    });
    it('keyboard action with mouse click on previous icon test case ', () => {
        datetimepicker = new DateTimePicker({
            value: new Date('2/2/2017')
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'altDownArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        (<HTMLElement>document.querySelector('.e-next span')).click();
        expect(document.querySelector('.e-title').textContent).toBe('March 2017');
    });
    it('esc key test case', function () {
        datetimepicker = new DateTimePicker({
        });
        datetimepicker.appendTo('#dateTime');
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        keyEventArgs.action = 'escape';
        datetimepicker.calendarKeyActionHandle(keyEventArgs);
    });
    it('enter key test case', function () {
        datetimepicker = new DateTimePicker({
        });
        datetimepicker.appendTo('#dateTime');
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        keyEventArgs.action = 'escape';
        datetimepicker.calendarKeyActionHandle(keyEventArgs);
        setTimeout(function () {
            expect(isNullOrUndefined(datetimepicker.popupWrapper)).toBe(true), 1000
        })
        keyEventArgs.action = 'enter';
        datetimepicker.calendarKeyActionHandle(keyEventArgs);
        keyEventArgs.action = 'escape';
        // datetimepicker.popupWrapper = datetimepicker.popupObj = null
        datetimepicker.calendarKeyActionHandle(keyEventArgs);
        // expect(document.activeElement).toBe(datetimepicker.inputElement);
    });
    it('tab key when popup open test case', function () {
        datetimepicker = new DateTimePicker({
            format: 'dd/MM/yyyy h:mm:ss a'
        });
        datetimepicker.appendTo('#dateTime');
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        keyEventArgs.action = 'tab';
        datetimepicker.calendarKeyActionHandle(keyEventArgs);
        setTimeout(function () {
            expect(isNullOrUndefined(datetimepicker.popupWrapper)).toBe(true), 1000
        })
        expect(datetimepicker.popupObj).toBe(null);
    });
    it('tab key when popup close test case', function () {
        datetimepicker = new DateTimePicker({
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'altDownArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        keyEventArgs.action = 'tab';
        datetimepicker.inputKeyActionHandle(keyEventArgs);
        expect(datetimepicker.popupWrapper).toBe(null)
        expect(document.activeElement).toBe(datetimepicker.element);
    });
    it('DateTimePicker popup open testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 10:00") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'altDownArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        datetimepicker.inputKeyAction(keyEventArgs);
        expect(datetimepicker.isTimePopupOpen()).toBe(true);
    });
    // it('DateTimePicker popup open testing with step value 0', () => {
    //     datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 10:00"), step: 0 });
    //     datetimepicker.appendTo('#dateTime');
    //     datetimepicker.element.focus();
    //     keyEventArgs.action = 'altDownArrow';
    //     datetimepicker.inputKeyAction(keyEventArgs);
    //     datetimepicker.inputKeyAction(keyEventArgs);
    //     expect(datetimepicker.isPopupOpen()).toBe(false);
    // });
    it('DateTimePicker press tab key testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 10:00") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'tab';
        keyEventArgs.keyCode = 9;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 10:00 AM');
    });
    it('popup close testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 10:00") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.show('time');
        keyEventArgs.action = 'altUpArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 10:00 AM');
    });
    it('next element value navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 10:00") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'altDownArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        datetimepicker.inputKeyAction(keyEventArgs);
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 10:00 AM');
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-active')[0].getAttribute('data-value')).toBe('10:00 AM');
    });
    it('previous element value navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 10:00") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'altDownArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        datetimepicker.inputKeyAction(keyEventArgs);
        keyEventArgs.action = 'up';
        keyEventArgs.keyCode = 38;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 9:30 AM');
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('9:30 AM');
    });
    it('null value with down navigation testing', () => {
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'altDownArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        datetimepicker.inputKeyAction(keyEventArgs);
        keyEventArgs.action = 'down';
        keyEventArgs.keyCode = 40;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('12:00 AM');
    });
    it('null value with up navigation testing', () => {
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'up';
        keyEventArgs.keyCode = 38;
        datetimepicker.inputKeyAction(keyEventArgs);
        expect(datetimepicker.inputElement.value).toBe('');
        expect(datetimepicker.dateTimeWrapper).toBe(undefined);
    });
    it('first element to last element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 00:00") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'altDownArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        datetimepicker.inputKeyAction(keyEventArgs);
        keyEventArgs.action = 'up';
        keyEventArgs.keyCode = 38;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:30 PM');
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:30 PM');
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:00 PM');
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:00 PM');
    });
    it('last element to first element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:30") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'altDownArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        datetimepicker.inputKeyAction(keyEventArgs);
        keyEventArgs.action = 'down';
        keyEventArgs.keyCode = 40;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 12:00 AM');
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-active')[0].getAttribute('data-value')).toBe('11:30 PM');
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 12:30 AM');
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-active')[0].getAttribute('data-value')).toBe('11:30 PM');
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:20") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'altDownArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        datetimepicker.inputKeyAction(keyEventArgs);
        keyEventArgs.action = 'up';
        keyEventArgs.keyCode = 38;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:00 PM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:00 PM');
    });
    it('inbetween value to first element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 00:10") });
        datetimepicker.appendTo('#dateTime');
        if (!datetimepicker.isTimePopupOpen()) {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        }
        datetimepicker.hide();
        setTimeout(function () {
            datetimepicker.element.focus();
            datetimepicker.show('time')
            keyEventArgs.action = 'up';
            keyEventArgs.keyCode = 38;
            datetimepicker.timeKeyActionHandle(keyEventArgs);
            expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('12:00 AM');
        }, 450);

    });
    it('inbetween value to next element navigation testing', (done) => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 00:10") });
        datetimepicker.appendTo('#dateTime');
        if (!datetimepicker.isTimePopupOpen()) {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        }
        datetimepicker.hide();
        datetimepicker.show('time');
        setTimeout(function () {
            datetimepicker.element.focus();
            keyEventArgs.action = 'down';
            keyEventArgs.keyCode = 40;
            datetimepicker.timeKeyActionHandle(keyEventArgs);
            expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('12:30 AM');
            done();
        }, 450);
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:30") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        datetimepicker.show('time')
        keyEventArgs.action = 'up';
        keyEventArgs.keyCode = 38;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:00 PM');
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-active')[0].getAttribute('data-value')).toBe('11:30 PM');
    });
    it('disable timeicon testing', () => {
        datetimepicker = new DateTimePicker({ min: new Date("12/12/2016 23:30"), max: new Date("12/12/2016 13:30"), strictMode: true });
        datetimepicker.appendTo('#dateTime');
        expect(datetimepicker.inputWrapper.buttons[0].classList.contains('e-disabled')).toBe(true);
    });
    it('empty textbox navigation testing', () => {
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        datetimepicker.show('time')
        keyEventArgs.action = 'down';
        keyEventArgs.keyCode = 40;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('12:00 AM');
    });
    it('Enter key testing', () => {
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        datetimepicker.element.value = "12/12/2016 12:30 AM";
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 12:30 AM');
    });
    it('Escape key testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 12:30") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'escape';
        keyEventArgs.keyCode = 27;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
    });
    it('keyboard navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 12:30"), readonly: true });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        datetimepicker.show('date');
        expect(datetimepicker.isDatePopupOpen()).toBe(false);
        datetimepicker.show('date');
        expect(datetimepicker.isDatePopupOpen()).toBe(false);
    });
    it('keyboard navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 12:30") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        datetimepicker.show('time')
        keyEventArgs.action = 'end';
        keyEventArgs.keyCode = 35;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:30 PM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:30 PM');
    });
    it(' keyboard navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 12:30") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        datetimepicker.show('time')
        keyEventArgs.action = 'home';
        keyEventArgs.keyCode = 36;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('12:00 AM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 12:00 AM');
    });
    it('readonly state keyboard navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 12:30"), readonly: true });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'escape';
        keyEventArgs.keyCode = 27;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        datetimepicker.timeKeyActionHandle(keyEventArgs);
    });
    it('label element innerHTML testing', () => {
        datetimepicker = new DateTimePicker({ placeholder: 'Select Time' });
        datetimepicker.appendTo('#dateTime');
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:20") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'altDownArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        datetimepicker.inputKeyAction(keyEventArgs);
        keyEventArgs.action = 'up';
        keyEventArgs.keyCode = 38;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:00 PM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:00 PM');
        keyEventArgs.action = 'home';
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('12:00 AM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 12:00 AM');
        keyEventArgs.action = 'end';
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:30 PM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:30 PM');
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:20") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'altDownArrow';
        datetimepicker.inputKeyAction(keyEventArgs);
        datetimepicker.inputKeyAction(keyEventArgs);
        keyEventArgs.action = 'down';
        keyEventArgs.keyCode = 40;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:30 PM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:30 PM');
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:20") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        datetimepicker.show('time');
        keyEventArgs.action = 'down';
        keyEventArgs.keyCode = 40;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        keyEventArgs.action = 'enter';
        keyEventArgs.keyCode = 13;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        datetimepicker.show('time');
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-active')[0].getAttribute('data-value')).toBe('11:30 PM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:30 PM');
    });
    it('previous selected value reselect testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:20") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        datetimepicker.show('time');
        keyEventArgs.action = 'down';
        keyEventArgs.keyCode = 40;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        keyEventArgs.action = 'up';
        keyEventArgs.keyCode = 38;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        keyEventArgs.action = 'enter';
        keyEventArgs.keyCode = 13;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:20") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        datetimepicker.show('time');
        keyEventArgs.action = 'enter';
        keyEventArgs.keyCode = 13;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:00") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        datetimepicker.show('time');
        keyEventArgs.action = 'down';
        keyEventArgs.keyCode = 40;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:30 PM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:30 PM');
        keyEventArgs.action = 'up';
        keyEventArgs.keyCode = 38;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:00"), strictMode: true });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        datetimepicker.show('time');
        keyEventArgs.action = 'down';
        keyEventArgs.keyCode = 40;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:30 PM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:30 PM');
        keyEventArgs.action = 'up';
        keyEventArgs.keyCode = 38;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:00") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.getDateObject();
        datetimepicker.getTimeActiveElement();
        datetimepicker.timeElementValue();
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#dateTime');
        datetimepicker.getDateObject("12/12/2016");
        datetimepicker.createDateObj("12/12/2016");
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:00"), step: -1 });
        datetimepicker.appendTo('#dateTime');
        keyEventArgs.action = 'down';
        keyEventArgs.keyCode = 40;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:00"), width: 40 });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.show('time');
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:00") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.combineDateTime();
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:00") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.valueWithMinutes = "AMDHDFBFJF";
        datetimepicker.getFullDateTime();
        datetimepicker.setSelection();
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:00") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.show('time');
        keyEventArgs.action = 'down';
        keyEventArgs.keyCode = 40;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:30 PM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:30 PM');
        keyEventArgs.action = 'up';
        keyEventArgs.keyCode = 38;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        keyEventArgs.action = 'enter';
        keyEventArgs.keyCode = 13;
        datetimepicker.timeKeyActionHandle(keyEventArgs);
        datetimepicker.updateValue();
    });
    it('Control rendering test for angular support', () => {
        let inputElement: HTMLElement = createElement('EJS-DATETIMEPICKER');
        document.body.appendChild(inputElement);
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo(inputElement);
    });
});
describe('mobile layout testing', () => {
    let ele: HTMLElement = createElement('input', { id: 'dateTime' });
    let ua = Browser.userAgent;
    let datetimepicker: any;
    beforeAll(() => {
        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        Browser.userAgent = androidPhoneUa;
        document.body.appendChild(ele);
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#dateTime');
    });
    afterAll(() => {
        if (ele) {
            datetimepicker.destroy();
            document.body.innerHTML = '';
        }
        Browser.userAgent = ua;
    })
    it('initial items choosing', (done) => {
        datetimepicker.value = new Date('12/12/2016 1:00 AM');
        datetimepicker.dataBind();
        datetimepicker.hide();
        setTimeout(() => {
            datetimepicker.show('time');
            expect(datetimepicker.isTimePopupOpen()).toBe(true);
            datetimepicker.hide();
            done();
        }, 450);
    });
    it('initial items choosing', (done) => {
        datetimepicker.value = new Date('12/12/2016 1:00 AM');
        datetimepicker.dataBind();
        datetimepicker.hide();
        setTimeout(() => {
            datetimepicker.show('time');
            expect(datetimepicker.isTimePopupOpen()).toBe(true);
            datetimepicker.destroy();
            Browser.userAgent = navigator.userAgent;
            done();
        }, 450);
    });
});

describe('mobile full-screen layout testing', () => {
    let ele: HTMLElement = createElement('input', { id: 'dateTime' });
    let ua = Browser.userAgent;
    let datetimepicker: any;
    beforeAll(() => {
        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        Browser.userAgent = androidPhoneUa;
        document.body.appendChild(ele);
        datetimepicker = new DateTimePicker({
            fullScreenMode: true
        });
        datetimepicker.appendTo('#dateTime');
    });
    afterAll(() => {
        if (ele) {
            datetimepicker.destroy();
            document.body.innerHTML = '';
        }
        Browser.userAgent = ua;
    })
    it('initial items choosing', (done) => {
        datetimepicker.value = new Date('12/12/2016 1:00 AM');
        datetimepicker.dataBind();
        datetimepicker.hide();
        setTimeout(() => {
            datetimepicker.show('time');
            expect(datetimepicker.isTimePopupOpen()).toBe(true);
            datetimepicker.hide();
            done();
        }, 450);
    });
    it('initial items choosing', (done) => {
        datetimepicker.value = new Date('12/12/2016 1:00 AM');
        datetimepicker.dataBind();
        datetimepicker.hide();
        setTimeout(() => {
            datetimepicker.show('time');
            expect(datetimepicker.isTimePopupOpen()).toBe(true);
            datetimepicker.destroy();
            Browser.userAgent = navigator.userAgent;
            done();
        }, 450);
    });
});

describe('Mobile testing for readonly attribute', function () {
    let ua = Browser.userAgent;
    let datetimepicker: any;
    beforeAll(() => {
        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        Browser.userAgent = androidPhoneUa;
    });
    afterAll(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
        Browser.userAgent = ua;
    })
    it('Add and remove readonly attribute for angular platform', () => {
        let ele: HTMLElement = createElement('EJS-DATETIMEPICKER', { id: 'datetime' });
        document.body.appendChild(ele);
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#datetime');
        let e: any = { currentTarget: datetimepicker.timeicon }
        datetimepicker.timeHandler(e);
        expect(datetimepicker.inputElement.hasAttribute('readonly')).toBe(true);
        datetimepicker.hide();
        expect(datetimepicker.inputElement.hasAttribute('readonly')).toBe(false);
    });
    it('Add and remove readonly attribute for other platform', () => {
        let ele: HTMLElement = createElement('input', { id: 'datetime' });
        document.body.appendChild(ele);
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#datetime');
        let e: any = { currentTarget: datetimepicker.timeicon }
        datetimepicker.timeHandler(e);
        expect(datetimepicker.inputElement.hasAttribute('readonly')).toBe(true);
        datetimepicker.hide();
        expect(datetimepicker.inputElement.hasAttribute('readonly')).toBe(false);
    });
});

describe('document click layout testing', () => {
    let clickEventArgs: any = {
        preventDefault: (): void => { /** NO Code */ },
        stopPropagation: (): void => { /** NO Code */ },
        currentTarget: '',
        target: ''
    };
    let datetimepicker: any;
    beforeEach(() => {
        let btn: HTMLElement = createElement('button', { id: 'btn' });
        document.body.appendChild(btn);
        let ele: HTMLElement = createElement('input', { id: 'dateTime' });
        document.body.appendChild(ele);
        datetimepicker = new DateTimePicker({ value: new Date("10/10/2017 10:30 PM") });
        datetimepicker.appendTo('#dateTime');
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('document click testing', (done) => {
        datetimepicker.value = new Date('12/12/2016 1:00 AM');
        datetimepicker.dataBind();
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        setTimeout(() => {
            datetimepicker.focusIn();
            datetimepicker.focusOut();
            clickEventArgs.currentTarget = document.getElementById('btn');
            clickEventArgs.target = document.getElementById('btn');
            datetimepicker.documentClickHandler(clickEventArgs);
            setTimeout(() => {
                expect(datetimepicker.isTimePopupOpen()).toBe(false);
                done();
            }, 600);
            done();
        }, 450);
    })
});

// angular tag testing
describe('Angular tag testing ', () => {
    let datetimepicker: any;
    beforeEach(() => {
        let element: any = createElement('EJS-DATETIMEPICKER', { id: 'dateTime' });
        element.setAttribute('name', 'angular');
        document.body.appendChild(element);
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo(element);
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Wrapper testing ', () => {
        expect(datetimepicker.element.tagName).toEqual('EJS-DATETIMEPICKER');
        expect(datetimepicker.element.getAttribute('name')).toBe(null);
        expect(datetimepicker.inputElement.getAttribute('name')).toBe('angular');
        expect(datetimepicker.inputWrapper.container.classList.contains('e-datetime-wrapper')).toEqual(true);
        expect(datetimepicker.inputWrapper.container.children[0].classList.contains('e-datetimepicker')).toEqual(true);
    });
});

describe('Form element', () => {
    let datetime: any;
    beforeEach(() => {
        let formEle: HTMLElement = createElement('form', { id: "form-element" });
        let Ele: HTMLElement = createElement('input', { id: "datetimepicker" });
        formEle.appendChild(Ele);
        document.body.appendChild(formEle);
    });
    afterEach(() => {
        if (datetime) {
            datetime.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Input element value reset test case (initialized)', () => {
        datetime = new DateTimePicker({ value: new Date('02/02/2017') });
        datetime.appendTo('#datetimepicker');
        (<any>document.getElementById("form-element")).reset();
        datetime.dataBind();
        expect(datetime.element.value).toBe('2/2/2017 12:00 AM');
        expect(datetime.value !== null).toBe(true);
    });
    it('Input element value changing dynamically (initialized)', () => {
        datetime = new DateTimePicker({ value: new Date('02/02/2017') });
        datetime.appendTo('#datetimepicker');
        datetime.element.value = new Date('02/12/2018');
        (<any>document.getElementById("form-element")).reset();
        datetime.dataBind();
        expect(datetime.element.value).toBe('2/2/2017 12:00 AM');
        expect(datetime.value !== null).toBe((true));
    });
    it('Input element value changing dynamically to null value (initialized)', () => {
        datetime = new DateTimePicker({ value: new Date('02/02/2017') });
        datetime.appendTo('#datetimepicker');
        datetime.element.value = null;
        (<any>document.getElementById("form-element")).reset();
        datetime.dataBind();
        expect(datetime.element.value).toBe('2/2/2017 12:00 AM');
        expect(datetime.value !== null).toBe((true));
    });
    it('Clear the Input element value dynamically via clear button (initialized)', () => {
        datetime = new DateTimePicker({ value: new Date('02/02/2017') });
        datetime.appendTo('#datetimepicker');
        (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
        (<any>document.getElementById("form-element")).reset();
        datetime.dataBind();
        expect(datetime.element.value).toBe('2/2/2017 12:00 AM');
        expect(datetime.value !== null).toBe((true));
    });
    it('Form reset with floatLabeltype("Auto") property test case (initialized)', () => {
        datetime = new DateTimePicker({ value: new Date('02/02/2017'), floatLabelType: "Auto" });
        datetime.appendTo('#datetimepicker');
        expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
        (<any>document.getElementById("form-element")).reset();
        datetime.dataBind();
        expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
        expect(datetime.element.value === '2/2/2017 12:00 AM').toBe(true);
    });
    it('Form reset with floatLabeltype("Always") property test case (initialized)', () => {
        datetime = new DateTimePicker({ value: new Date(), floatLabelType: "Always" });
        datetime.appendTo('#datetimepicker');
        expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
        (<any>document.getElementById("form-element")).reset();
        datetime.dataBind();
        expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
        expect(datetime.element.value !== null).toBe(true);
    });
    it('Form reset with floatLabeltype("Never") property test case (initialized)', () => {
        datetime = new DateTimePicker({ value: new Date('02/02/2017'), floatLabelType: "Never" });
        datetime.appendTo('#datetimepicker');
        expect(document.querySelector('.e-float-text')).toBe(null);
        (<any>document.getElementById("form-element")).reset();
        datetime.dataBind();
        expect(document.querySelector('.e-float-text')).toBe(null);
        expect(datetime.element.value !== null).toBe(true);
    });
    it('Input value reset in destroy case (initialized)', () => {
        datetime = new DateTimePicker({ value: new Date('02/02/2017') });
        datetime.appendTo('#datetimepicker');
        datetime.destroy();
        (<any>document.getElementById("form-element")).reset();
        expect((<any>document.getElementById('datetimepicker')).value !== '2/2/2017 12:00 AM').toBe(true);
        datetime = null;
    });
    it('TimePopup dom element in destroy case', () => {
        datetime = new DateTimePicker({ value: new Date('02/02/2017') });
        datetime.appendTo('#datetimepicker');
        datetime.show('time');
        expect(isNullOrUndefined(datetime.dateTimeWrapper)).toBe(false);
        datetime.destroy();
        expect(isNullOrUndefined(datetime.dateTimeWrapper)).toBe(true);
        datetime = null;
    });
    // Test cases for reset the component when value not initialized
    it('Input element value changing dynamically', () => {
        datetime = new DateTimePicker({  });
        datetime.appendTo('#datetimepicker');
        datetime.element.value = new Date('02/12/2018');
        (<any>document.getElementById("form-element")).reset();
        datetime.dataBind();
        expect(datetime.element.value).toBe('');
        expect(datetime.value === null).toBe((true));
    });
    it('Clear the Input element value dynamically via clear button', () => {
        datetime = new DateTimePicker({ });
        datetime.appendTo('#datetimepicker');
        datetime.element.value = new Date('02/12/2018');
        (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
        (<any>document.getElementById("form-element")).reset();
        datetime.dataBind();
        expect(datetime.element.value).toBe('');
        expect(datetime.value === null).toBe((true));
    });
    //Below case need to be fixed in the component.
    // it('Form reset with floatLabeltype("Auto") property test case', () => {
    //     datetime = new DateTimePicker({ floatLabelType: "Auto" });
    //     datetime.appendTo('#datetimepicker');
    //     datetime.element.value = new Date('02/12/2018');
    //     expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
    //     (<any>document.getElementById("form-element")).reset();
    //     datetime.dataBind();
    //     expect(document.querySelector('.e-float-text').classList.contains('e-label-bottom')).toBe(true);
    //     expect(datetime.element.value === '').toBe(true);
    // });
    it('Form reset with floatLabeltype("Always") property test case', () => {
        datetime = new DateTimePicker({ floatLabelType: "Always" });
        datetime.appendTo('#datetimepicker');
        datetime.element.value = new Date('02/12/2018');
        expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
        (<any>document.getElementById("form-element")).reset();
        datetime.dataBind();
        expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
        expect(datetime.element.value === '').toBe(true);
    });
    it('Form reset with floatLabeltype("Never") property test case', () => {
        datetime = new DateTimePicker({ floatLabelType: "Never" });
        datetime.appendTo('#datetimepicker');
        expect(document.querySelector('.e-float-text')).toBe(null);
        datetime.element.value = new Date('02/12/2018');
        (<any>document.getElementById("form-element")).reset();
        datetime.dataBind();
        expect(document.querySelector('.e-float-text')).toBe(null);
        expect(datetime.element.value === '').toBe(true);
    });
    it('Input value reset in destroy case ', () => {
        datetime = new DateTimePicker({ });
        datetime.appendTo('#datetimepicker');
        datetime.destroy();
        (<any>document.getElementById("form-element")).reset();
        expect((<any>document.getElementById('datetimepicker')).value === '').toBe(true);
        datetime = null;
    });
    it('Input value reset case', () => {
        datetime = new DateTimePicker({ });
        datetime.appendTo('#datetimepicker');
        (<any>document.getElementById("form-element")).reset();
        datetime.dataBind();
        expect(datetime.previousElementValue === "").toBe(true);
    });
    it('Input value reset case_2', () => {
        datetime = new DateTimePicker({ 
            value: new Date('2/12/2018 2:00 AM')
        });
        datetime.appendTo('#datetimepicker');
        (<any>document.getElementById("form-element")).reset();
        datetime.dataBind();
        expect(datetime.previousElementValue === "2/12/2018 2:00 AM").toBe(true);
    });
    it('Input value reset case_3', () => {
        datetime = new DateTimePicker({ 
            value: new Date('2/12/2018 2:00 AM'),
            format: "yyyy/MMM/dd HH:mm"
        });
        datetime.appendTo('#datetimepicker');
        (<any>document.getElementById("form-element")).reset();
        datetime.dataBind();
        expect(datetime.previousElementValue === "2018/Feb/12 02:00").toBe(true);
    });
});

describe('Islamic ', () => {
    let datetimepicker: any;
    beforeEach(() => {
        let input: HTMLElement = createElement('input', { id: "datetimepicker" });
        document.body.appendChild(input);
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it(' calendar test case', () => {
        Calendar.Inject(Islamic);
        datetimepicker = new DateTimePicker({
            calendarMode: 'Islamic',
            value: new Date(), open: function (args: PopupEventArgs) {
            }
        });
        datetimepicker.appendTo('#datetimepicker');
        (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
    });
    it(' calendar format  test case', () => {
        Calendar.Inject(Islamic);
        datetimepicker = new DateTimePicker({
            calendarMode: 'Gregorian', format: 'dd/MM/yyyy h:mm:ss a',
            value: new Date(), open: function (args: PopupEventArgs) {
            }
        });
        datetimepicker.appendTo('#datetimepicker');
        (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
        datetimepicker.strictModeUpdate();
    });
    it(' calendar format  test case', () => {
        Calendar.Inject(Islamic);
        datetimepicker = new DateTimePicker({
            calendarMode: 'Islamic', format: 'dd/MM/yyyy h:mm:ss a',
            value: new Date(), open: function (args: PopupEventArgs) {
            }
        });
        datetimepicker.appendTo('#datetimepicker');
        (<HTMLElement>(document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0])).dispatchEvent(clickEvent);
        datetimepicker.strictModeUpdate();
    });
    // it('German culture (de-DE) testing', () => {
    //     Calendar.Inject(Islamic);
    //     loadCultureFiles('de');
    //     datetimepicker = new DateTimePicker({ calendarMode: "Islamic", value: new Date("12/12/2016 14:00"), locale: 'de' });
    //     datetimepicker.appendTo('#dateTime');
    // });
});

describe('SetScrollTo testing', () => {
    let datetimepicker: any;
    beforeEach(() => {
        let ele: HTMLElement = createElement('input', { id: 'datetimepickerscroll' });
        document.body.appendChild(ele);
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#datetimepickerscroll');
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('scrollTo intermediate value testing', (done) => {
        datetimepicker.show('time');
        datetimepicker.hide();
        datetimepicker.scrollTo = new Date("11/11/2011 2:00 PM");
        datetimepicker.dataBind();
        setTimeout(function () {
            datetimepicker.show('time');
            expect(datetimepicker.dateTimeWrapper.scrollTop).toBe(0);
            done();
        }, 450);
    });
    it('scrollTo initial value testing', (done) => {
        datetimepicker.scrollTo = new Date("11/11/2011 12:00 AM");
        datetimepicker.dataBind();
        datetimepicker.show('time');
        setTimeout(function () {
            expect(datetimepicker.dateTimeWrapper.scrollTop).toBe(0);
            done();
        }, 450);
    });
    it('scrollTo last value testing', (done) => {
        datetimepicker.scrollTo = new Date("11/11/2011 11:00 AM");
        datetimepicker.dataBind();
        datetimepicker.show('time');
        setTimeout(function () {
            expect(datetimepicker.dateTimeWrapper.scrollTop).toBe(0);
            done();
        }, 450);
    });
    it('scrollTo false testing', (done) => {
        datetimepicker.scrollTo = null;
        datetimepicker.dataBind();
        datetimepicker.show('time');
        setTimeout(function () {
            expect(datetimepicker.dateTimeWrapper.scrollTop).toBe(0);
            done();
        }, 450);
    });
    it('scrollTo invalid date testing', () => {
        datetimepicker.scrollTo = new Date('');
        datetimepicker.dataBind();
        expect(datetimepicker.scrollTo).toBe(null);
    });
});


describe('invalid String', () => {
    let datetimepicker: any;
    beforeEach(() => {
        let ele: HTMLElement = createElement('input', { id: 'datetime' });
        document.body.appendChild(ele);
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('valid Date only Value Test Case', () => {
        datetimepicker = new DateTimePicker({value:new Date('1/9/2018')});
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe('1/9/2018 12:00 AM');
        expect(+datetimepicker.value).toBe(+new Date('1/9/2018 12:00 AM'));
    });
    it('invalid string type with value test case', () => {
        datetimepicker = new DateTimePicker({ value: <any>"hgfnfhg" });
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe("hgfnfhg");
        expect(datetimepicker.value).toBe(null)
    });
    it('invalid string type with value test case(popup)', () => {
        datetimepicker = new DateTimePicker({ value: <any>"hgfnfhg" });
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe("hgfnfhg");
        expect(datetimepicker.value).toBe(null);
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        expect(datetimepicker.isTimePopupOpen()).toBe(true);
        expect(datetimepicker.selectedElement).toBe(null);
    });
    it('invalid object type with value test case', () => {
        datetimepicker = new DateTimePicker({ value: <any>{ab:'bc'} });
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe("");
        expect(datetimepicker.value).toBe(null)
    });
    it('invalid object type with value onproperty test case', () => {
        datetimepicker = new DateTimePicker({ value: <any>'12/12/2012' });
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe("12/12/2012 12:00 AM");
        datetimepicker.value = <any>{ab:'bc'};
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe("");
        expect(datetimepicker.value).toBe(null)
    });
    it('invalid number type with value test case ', () => {
        datetimepicker = new DateTimePicker({ value: <any>12243 });
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe("12243");
        expect(datetimepicker.value).toBe(null)
    });
    it('invalid string type with value test case and strictMode true ', () => {
        datetimepicker = new DateTimePicker({ value: <any>"hgfnfhg", strictMode:true });
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe("");
        expect(datetimepicker.value).toBe(null)
    });
    it('invalid number type with value test case and strictMode true', () => {
        datetimepicker = new DateTimePicker({ value: <any>12243, strictMode:true });
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe("");
        expect(datetimepicker.value).toBe(null)
    });
    it('invalid number type with value test case and strictMode true with format', () => {
        datetimepicker = new DateTimePicker({ value: <any>240201,format:'yyMMdd', strictMode:true });
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe("240201");
        expect(+datetimepicker.value).toBe(+new Date('02/01/2024'));
    });
    it('invalid number type with value test case and strictMode true with format onproperty', () => {
        datetimepicker = new DateTimePicker({ value: new Date('11/12/2014')});
        datetimepicker.appendTo('#datetime');
        expect(+datetimepicker.value).toBe(+new Date('11/12/2014'));
        datetimepicker.strictMode = true;
        datetimepicker.format='yyMMdd';
        datetimepicker.dataBind();
        datetimepicker.value=240201;
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe("240201");
        expect(+datetimepicker.value).toBe(+new Date('02/01/2024'));
    });
    it('number value in onproperty along with format', () => {
        datetimepicker = new DateTimePicker({ value: new Date('11/12/2014')});
        datetimepicker.appendTo('#datetime');
        expect(+datetimepicker.value).toBe(+new Date('11/12/2014'));
        datetimepicker.format='yyMMdd';
        datetimepicker.dataBind();
        datetimepicker.value=240201;
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe("240201");
        expect(+datetimepicker.value).toBe(+new Date('02/01/2024'));
    });
    it('string value in onproperty along with format', () => {
        datetimepicker = new DateTimePicker({ value: new Date('11/12/2014')});
        datetimepicker.appendTo('#datetime');
        expect(+datetimepicker.value).toBe(+new Date('11/12/2014'));
        datetimepicker.format='HHmmddMMyy';
        datetimepicker.dataBind();
        datetimepicker.value='2356011224';
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe("2356011224");
        expect(+datetimepicker.value).toBe(+new Date('12/01/2024 23:56'));
    });
    it('string value(number) along with format', () => {
        datetimepicker = new DateTimePicker({ format:'HHmmddMMyy',value:<any>'2356011224'});
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe("2356011224");
        expect(+datetimepicker.value).toBe(+new Date('12/01/2024 23:56'));
    });
    it('string value(string) along with format', () => {
        datetimepicker = new DateTimePicker({ value: new Date('11/12/2014')});
        datetimepicker.appendTo('#datetime');
        expect(+datetimepicker.value).toBe(+new Date('11/12/2014'));
        datetimepicker.format='dd MMM yyyy, HH-mm';
        datetimepicker.dataBind();
        datetimepicker.value='12 May 2017, 02-00';
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe("12 May 2017, 02-00");
        expect(+datetimepicker.value).toBe(+new Date('05/12/2017 02:00'));
    });
    it('string value(string) along with format on property', () => {
        datetimepicker = new DateTimePicker({ format:'dd MMM yyyy, HH-mm',value:<any>'12 May 2017, 02-00'});
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe("12 May 2017, 02-00");
        expect(+datetimepicker.value).toBe(+new Date('05/12/2017 02:00'));
    });
    it('number value along with format', () => {
        datetimepicker = new DateTimePicker({ value:<any>2356011224,format:'HHmmddMMyy'});
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe("2356011224");
        expect(+datetimepicker.value).toBe(+new Date('12/01/2024 23:56'));
    });
    it('invalid number type with value test case and strictMode conditions', () => {
        datetimepicker = new DateTimePicker({ value: <any>12243, strictMode:true });
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe("");
        datetimepicker.strictMode = false;
        datetimepicker.value = <any>"avdsaghd";
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe("avdsaghd");
        expect(datetimepicker.value).toBe(null);
        datetimepicker.value = <any>12345;
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe("12345");
        expect(datetimepicker.value).toBe(null)
    });
    it('string type value with onproperty test case ', () => {
        datetimepicker = new DateTimePicker({ value: <any>'2/2/2017 2:30 AM' });
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe('2/2/2017 2:30 AM');
        expect(+datetimepicker.value).toBe(+new Date('2/2/2017 2:30 AM'));
        datetimepicker.value = "3/3/2017 5:30 AM";
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe('3/3/2017 5:30 AM');
        expect(+datetimepicker.value).toBe(+new Date('3/3/2017 5:30 AM'));
    });
    it('IOS string type with value test case ', () => {
        datetimepicker = new DateTimePicker({ value: <any>"2017-02-01T18:30:00.000Z" });
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value != '').toBe(true);
        expect(datetimepicker.value !== null).toBe(true);
    });
    it('IOS string type with value test case on property', () => {
        datetimepicker = new DateTimePicker({ strictMode:true,value: <any>"2017-02-01T18:30:00.000Z" });
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value != '').toBe(true);
        expect(datetimepicker.value !== null).toBe(true);
    });
    it('string type with format on property test case', () => {
        datetimepicker = new DateTimePicker({ value: <any>'2/2/2017' });
        datetimepicker.appendTo('#datetime');
        expect(datetimepicker.element.value).toBe('2/2/2017 12:00 AM');
        datetimepicker.format = 'dd/MM/yyyy mm:HH';
        datetimepicker.value = "19/05/1997 10:20";
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe("19/05/1997 10:20");
        expect(+datetimepicker.value).toBe(+new Date("05/19/1997 20:10"));
        expect(datetimepicker.invalidValueString).toBe(null);
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
    describe('Datetimepicker', function () {
        let datetimepicker:any;
        beforeEach(function () {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(function () {
            if (datetimepicker) {
                datetimepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('focus event checking on document click when the calendar is open test case', function () {
            datetimepicker = new DateTimePicker();
            datetimepicker.appendTo('#date');
            datetimepicker.popupObj
            let e ={
                preventDefault : () => {},
                target:document.getElementById('date')
            };
            document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0].dispatchEvent(clickEvent);
            expect(isNullOrUndefined(datetimepicker.popupWrapper)).toBe(true);
            e.target = document.getElementsByTagName('body')[0];
            datetimepicker.documentClickHandler(e);
            expect(datetimepicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(false);
        });
    });
    describe('Dynamic CssClass testcase', function (){
        let datetimepicker: any;
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('input', { id: 'datetimepicker'});
            document.body.appendChild(inputElement);
        });
        afterEach(function() {
            if (datetimepicker) {
                datetimepicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('single css class',function() {
            datetimepicker = new DateTimePicker({
                cssClass: 'e-custom'
            });
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            datetimepicker.cssClass = 'e-test';
            datetimepicker.dataBind();
            expect(datetimepicker.inputWrapper.container.classList.contains('e-custom')).toBe(false);
            expect(datetimepicker.inputWrapper.container.classList.contains('e-test')).toBe(true);
        });
        it('more than one css class',function() {
            datetimepicker = new DateTimePicker({
                cssClass: 'e-custom e-secondary'
            });
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            expect(datetimepicker.inputWrapper.container.classList.contains('e-secondary')).toBe(true);            
            datetimepicker.cssClass = 'e-test e-ternary';
            datetimepicker.dataBind();
            expect(datetimepicker.inputWrapper.container.classList.contains('e-custom')).toBe(false);
            expect(datetimepicker.inputWrapper.container.classList.contains('e-secondary')).toBe(false);
            expect(datetimepicker.inputWrapper.container.classList.contains('e-test')).toBe(true);
            expect(datetimepicker.inputWrapper.container.classList.contains('e-ternary')).toBe(true);
        });
    });
    describe('Popup hide testing when crosses view port', function (){
        let datetimepicker: any;
        let divElement: HTMLElement;
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('input', { id: 'datetimepicker'});
            document.body.appendChild(inputElement);
            divElement = createElement('div', { id: 'divElement'});
            divElement.style.height = '900px';
        });
        afterEach(function() {
            if (datetimepicker) {
                datetimepicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('Popup hide testing',function() {
            datetimepicker = new DateTimePicker({});
            datetimepicker.appendTo('#datetimepicker');
            (<HTMLInputElement>document.getElementsByClassName('e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(datetimepicker.popupWrapper !== null).toBe(true);
            document.body.appendChild(divElement);
            scrollBy({top: 500, behavior: 'smooth'});
            let popupObj: Element = document.querySelectorAll('.e-popup')[0];
            (popupObj as any).ej2_instances[0].trigger('targetExitViewport');
        });
    });
    describe('Timezone offset', function (){
        let datetimepicker: any;
        beforeEach(function() {
            let inputElement: HTMLElement = createElement('input', { id: 'datetimepicker'});
            document.body.appendChild(inputElement);
        });
        afterEach(function() {
            if (datetimepicker) {
                datetimepicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('server timezone with offset +10 testing',function() {
            datetimepicker = new DateTimePicker({
                value: new Date("9/25/2019 16:00"),
                placeholder: "select Date Time",
                width: "250px",
                serverTimezoneOffset: +10
            });
            datetimepicker.appendTo('#datetimepicker');
        });
    });
    describe('Cleared event test case', function () {
        let datetimepicker:any;
        beforeEach(function () {
            let ele: HTMLElement = createElement('input', { id: 'date' });
                document.body.appendChild(ele);
        });
        afterEach(function () {
            if (datetimepicker) {
                datetimepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('check value after button click', function () {
            datetimepicker = new DateTimePicker({
                value: <any>'2/2/2017',
                cleared: function(args: any) {
                    expect(args.name).toBe("cleared");
                    expect(datetimepicker.value).toBe(null);
                }
            });
            datetimepicker.appendTo('#date');
            datetimepicker.element.parentElement.querySelectorAll('.e-clear-icon')[0].click();
            expect(datetimepicker.inputElement.value === "").toBe(true);
        });
    });
    describe('EJ2-36604 - While giving the class name with empty space for HtmlAttributes, console error is produced.', function () {
        let datetimepicker: any;
        beforeEach(function () {
            let inputElement: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputElement);
        });
        afterEach(function () {
            if (datetimepicker) {
                datetimepicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('Entering the class name without any empty space', function () {
            datetimepicker = new DateTimePicker({
                htmlAttributes: { class: 'custom-class' }
            });
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving empty space before and after the class name', function () {
            datetimepicker = new DateTimePicker({
                htmlAttributes: { class: ' custom-class ' }
            });
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving more than one empty space between two class names', function () {
            datetimepicker = new DateTimePicker({
                htmlAttributes: { class: 'custom-class-one     custom-class-two' }
            });
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(datetimepicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving more than one empty space between two class names as well before and after the class name', function () {
            datetimepicker = new DateTimePicker({
                htmlAttributes: { class: '  custom-class-one     custom-class-two  ' }
            });
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(datetimepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
        });
        it('Giving only empty space  without entering any class Name', function () {
            datetimepicker = new DateTimePicker({
            });
            datetimepicker.appendTo('#datetimepicker');
            let beforeAddClass = datetimepicker.inputWrapper.container.classList.length;
            datetimepicker.htmlAttributes = { class: '  ' };
            datetimepicker.appendTo('#datetimepicker');
            let AfterAddClass = datetimepicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        });
        it('Keep input as empty without entering any class Name', function () {
            datetimepicker = new DateTimePicker({
            });
            datetimepicker.appendTo('#datetimepicker');
            let beforeAddClass = datetimepicker.inputWrapper.container.classList.length;
            datetimepicker.htmlAttributes = { class: '' };
            datetimepicker.appendTo('#datetimepicker');
            let AfterAddClass = datetimepicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        });
        it('Entering class name without any empty space', function () {
            datetimepicker = new DateTimePicker({
                cssClass: 'custom-class'
            });
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving empty space before and after the class name', function () {
            datetimepicker = new DateTimePicker({
                cssClass: ' custom-class '
            });
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving more than one empty space between two class names', function () {
            datetimepicker = new DateTimePicker({
                cssClass: 'custom-class-one   custom-class-two'
            });
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(datetimepicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving more than one empty space between two class names as well as before and after the class names', function () {
            datetimepicker = new DateTimePicker({
                cssClass: '  custom-class-one   custom-class-two  '
            });
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(datetimepicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving only empty space  without entering any class Name', function () {
            datetimepicker = new DateTimePicker({
            });
            datetimepicker.appendTo('#datetimepicker');
            let beforeAddClass = datetimepicker.inputWrapper.container.classList.length;
            datetimepicker.cssClass = '  ';
            datetimepicker.appendTo('#datetimepicker');
            let AfterAddClass = datetimepicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        }); 
        it('Keep input as empty without entering any class Name', function () {
            datetimepicker = new DateTimePicker({
            });
            datetimepicker.appendTo('#datetimepicker');
            let beforeAddClass = datetimepicker.inputWrapper.container.classList.length;
            datetimepicker.cssClass = '';
            datetimepicker.appendTo('#datetimepicker');
            let AfterAddClass = datetimepicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        });
        it('Giving class name with underscore in the beginning', function () {
            datetimepicker = new DateTimePicker({
                htmlAttributes : { class : '  _custom-class-one  '},
                cssClass : '   _custom-class-two  '
            });
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.inputWrapper.container.classList.contains('_custom-class-one')).toBe(true);
            expect(datetimepicker.inputWrapper.container.classList.contains('_custom-class-two')).toBe(true);
        });
        it('Giving class name with empty space in both cases seperatly', function () {
            datetimepicker = new DateTimePicker({
                htmlAttributes : { class : '  custom-class-one  '},
                cssClass : '   custom-class-two  '
            });
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(datetimepicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });   
    });
    describe('popup open while focus the component',function(){
        let dateTimePicker:any;
        let keyEventArgs:any={
            action:'tab'
        };
        beforeEach(function(){
            let element: HTMLElement = createElement('input',{id:'datetime'});
            document.body.appendChild(element);
        });
        afterEach(function(){
            if(dateTimePicker){
                dateTimePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('check the popup open',function(){
            dateTimePicker = new DateTimePicker({
                openOnFocus:true
            });
            dateTimePicker.appendTo('#datetime');
            keyEventArgs.action = 'tab';
            dateTimePicker.inputKeyAction(keyEventArgs);
            expect((dateTimePicker.popupObj) !== null).toBe(true);
        });
    });
    describe('EJ2-45532 - DateTimePicker popup closing when updating value dynamically',function(){
        let dateTimePicker:any;
        beforeEach(function(){
            let element: HTMLElement = createElement('input',{id:'date'});
            document.body.appendChild(element);
        });
        afterEach(function(){
            if(dateTimePicker){
                dateTimePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('check the popup open',function(){
            dateTimePicker = new DateTimePicker({
            });
            dateTimePicker.appendTo('#date');
            dateTimePicker.show();
            dateTimePicker.value = new Date('1/1/2020');
            dateTimePicker.dataBind();
            expect((dateTimePicker.popupObj) !== null).toBe(true);
            expect(dateTimePicker.inputElement.value === "1/1/2020 12:00 AM").toBe(true)
        });
    });
});




function loadCultureFiles_mask(name: string, base?: boolean): void {
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
        'datetimepicker': { day: 'day' , month: 'month', year: 'year', hour: 'hour' ,minute: 'minute', second:'second' }
    },
    'de': {
        'datetimepicker': { day: 'Tag' , month: 'Monat', year: 'Jahr', hour: 'Stunde' ,minute: 'Minute', second:'Sekunden' }
    },
    'zh': {
        'datetimepicker': { day: '日' , month: '月', year: '年', hour: '小時' ,minute: '分鐘', second:'第二' }
    },
    'ja': {
        'datetimepicker': { day: '日' , month: '月', year: '年', hour: '時間' ,minute: '分', second:'秒'}
    },
});


DateTimePicker.Inject(MaskedDateTime);
describe('Datetimepicker', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Masked DateTimePicker', () => {
        let datetimepicker: any;
        let maskedDateTime: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation:(): void=>{},
            action: 'ArrowLeft',
            code: 'ArrowLeft',
            key: 'ArrowLeft'
        };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (datetimepicker) {
                datetimepicker.destroy();
            }
            document.body.innerHTML = '';
            maskedDateTime = new MaskedDateTime();
            maskedDateTime.destroy();
        });
        it('default rendering without enableMask property ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker();
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.element.value).toBe('');
            
            expect(datetimepicker.value).toBe(null);
        });
        it('default rendering with enableMask property ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true});
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.element.value).toBe('month/day/year hour:minute AM');
            expect(datetimepicker.value).toBe(null);
        });
        it('Rendering with maskPlaceholder as custom type ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true, format: 'dd/MM/yyyy hh:mm:ss' , maskPlaceholder: {day: 'd.',month: 'M.' ,year: 'y.', hour: 'h.', minute: 'm.', second: 's.'}});
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.element.value).toBe('d./M./y. h.:m.:s.');
            expect(datetimepicker.value).toBe(null);
        });
        it('With format property ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'd:M:yyyy E'});
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.element.value).toBe('day:month:year day of the week');
            expect(datetimepicker.value).toBe(null);
        });
        it('With format property -1 ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'MM yyyy EEEE'});
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.element.value).toBe('month year day of the week');
            expect(datetimepicker.value).toBe(null);
        });
        it('with format property -2', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'MM/dd/yyyy EEEEE'});
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.element.value).toBe('month/day/year day of the week');
            expect(datetimepicker.value).toBe(null);
        });
        it('with format property -3', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'MMM yy'});
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.element.value).toBe('month year');
            expect(datetimepicker.value).toBe(null);
        });
        it('with format property -4', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yy hh:mm:ss'});
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.element.value).toBe('day/month/year hour:minute:second');
            expect(datetimepicker.value).toBe(null);
        });
        it('with format property -5', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yy E'});
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.element.value).toBe('day/month/year day of the week');
            expect(datetimepicker.value).toBe(null);
        });
        // it('Clear button', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
        //     document.body.appendChild(inputEle);
        //     datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yy hh:mm:ss' , value: new Date('01/01/2021 01:01:01')});
        //     datetimepicker.appendTo('#datetimepicker');
        //     expect(datetimepicker.element.value).toBe('01/01/2021 01:01:01');
        //     expect(datetimepicker.value).toBe(null);
        // (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
        // expect(datetimepicker.element.value).toBe('day/month/year hour:minute:second');
        // expect(datetimepicker.value).toBe(null);
        // });
        it('Focusing the component', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yyyy hh:mm:ss'});
            datetimepicker.appendTo('#datetimepicker');
            datetimepicker.focusIn();
            datetimepicker.mouseUpHandler(mouseEventArgs);
            expect(datetimepicker.element.value).toBe('day/month/year hour:minute:second');
            expect(datetimepicker.element.selectionStart).toBe(0);
            expect(datetimepicker.element.selectionEnd).toBe(3);
            expect(datetimepicker.value).toBe(null);
        });
        it('Selection navigation using keyboard action', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yy'});
            datetimepicker.appendTo('#datetimepicker');
            datetimepicker.focusIn();
            datetimepicker.mouseUpHandler(mouseEventArgs);
            expect(datetimepicker.element.value).toBe('day/month/year');
            expect(datetimepicker.element.selectionStart).toBe(0);
            expect(datetimepicker.element.selectionEnd).toBe(3);
            expect(datetimepicker.value).toBe(null);
            keyEventArgs.action = keyEventArgs.key = keyEventArgs.code =  'ArrowRight';
            datetimepicker.keydownHandler(keyEventArgs);
            expect(datetimepicker.element.selectionStart).toBe(4);
            expect(datetimepicker.element.selectionEnd).toBe(9);
            datetimepicker.keydownHandler(keyEventArgs);
            expect(datetimepicker.element.selectionStart).toBe(10);
            expect(datetimepicker.element.selectionEnd).toBe(14);
            keyEventArgs.action = keyEventArgs.key = keyEventArgs.code =  'Home';
            datetimepicker.keydownHandler(keyEventArgs);
            expect(datetimepicker.element.selectionStart).toBe(0);
            expect(datetimepicker.element.selectionEnd).toBe(3);
            keyEventArgs.action = keyEventArgs.key = keyEventArgs.code =  'End';
            datetimepicker.keydownHandler(keyEventArgs);
            expect(datetimepicker.element.selectionStart).toBe(10);
            expect(datetimepicker.element.selectionEnd).toBe(14);



        });
        it('Selection navigation using tab and shiftTab ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yy'});
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.element.value).toBe('day/month/year');
            datetimepicker.focusIn();
            expect(datetimepicker.element.selectionStart).toBe(10);
            expect(datetimepicker.element.selectionEnd).toBe(14);
            expect(datetimepicker.value).toBe(null);
            keyEventArgs.action = keyEventArgs.key = keyEventArgs.code = 'shiftTab'
            datetimepicker.inputKeyActionHandle(keyEventArgs);
            expect(datetimepicker.element.selectionStart).toBe(4);
            expect(datetimepicker.element.selectionEnd).toBe(9);
            datetimepicker.inputKeyActionHandle(keyEventArgs);
            expect(datetimepicker.element.selectionStart).toBe(0);
            expect(datetimepicker.element.selectionEnd).toBe(3);
             keyEventArgs.key = keyEventArgs.code  = 'Tab';
             keyEventArgs.action = 'tab';
            datetimepicker.inputKeyActionHandle(keyEventArgs);
            expect(datetimepicker.element.selectionStart).toBe(4);
            expect(datetimepicker.element.selectionEnd).toBe(9);
            datetimepicker.inputKeyActionHandle(keyEventArgs);
            expect(datetimepicker.element.selectionStart).toBe(10);
            expect(datetimepicker.element.selectionEnd).toBe(14);
        });
        // it('Increment and decrement of date using up arrow', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
        //     document.body.appendChild(inputEle);
        //     datetimepicker = new DateTimePicker({enableMask: true , format: 'd/MM/yyyy hh:mm:ss'});
        //     datetimepicker.appendTo('#datetimepicker');
        //     datetimepicker.focusIn();
        //     expect(datetimepicker.element.value).toBe('day/month/year hour:minute:second');
        //     datetimepicker.element.selectionStart = 0;
        //     datetimepicker.element.selectionEnd = 3;
        //     keyEventArgs.key = keyEventArgs.code =  'ArrowUp';
        //     let date: Date = new Date();
        //     datetimepicker.keydownHandler(keyEventArgs);
        //     expect(datetimepicker.element.value).toBe((date.getDate() + 1).toString() + '/month/year hour:minute:second');
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.element.selectionStart = 0;
        //     datetimepicker.element.selectionEnd = 2;
        //     keyEventArgs.key = keyEventArgs.code =  'ArrowDown';
        //     datetimepicker.keydownHandler(keyEventArgs);
        //     expect(datetimepicker.element.value).toBe((date.getDate()).toString() + '/month/year hour:minute:second');
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.element.selectionStart = 3;
        //     datetimepicker.element.selectionEnd = 8;
        //     keyEventArgs.key = keyEventArgs.key = keyEventArgs.code  =  'ArrowUp';
        //     datetimepicker.keydownHandler(keyEventArgs);
        //     expect(datetimepicker.element.value).toBe((date.getDate()).toString()+ '/02' + '/year hour:minute:second');
        //     datetimepicker.element.selectionStart = 6;
        //     datetimepicker.element.selectionEnd = 10;
        //     keyEventArgs.key = keyEventArgs.key = keyEventArgs.code  =  'ArrowUp';
        //     datetimepicker.keydownHandler(keyEventArgs);
        //     expect(datetimepicker.element.value).toBe((date.getDate()).toString()+ '/02' + '/' + (date.getFullYear() + 1).toString() + ' hour:minute:second');
        //     datetimepicker.element.selectionStart = 11;
        //     datetimepicker.element.selectionEnd = 15;
        //     keyEventArgs.key = keyEventArgs.key = keyEventArgs.code  =  'ArrowUp';
        //     datetimepicker.keydownHandler(keyEventArgs);
        //     expect(datetimepicker.element.value).toBe((date.getDate()).toString()+ '/02' + '/' + (date.getFullYear() + 1).toString() + ' 01:minute:second');
        //     datetimepicker.element.selectionStart = 14;
        //     datetimepicker.element.selectionEnd = 20;
        //     keyEventArgs.key = keyEventArgs.key = keyEventArgs.code  =  'ArrowUp';
        //     datetimepicker.keydownHandler(keyEventArgs);
        //     expect(datetimepicker.element.value).toBe((date.getDate()).toString()+ '/02' + '/' + (date.getFullYear() + 1).toString() + ' 01:01:second');
        //     datetimepicker.element.selectionStart = 17;
        //     datetimepicker.element.selectionEnd = 23;
        //     keyEventArgs.key = keyEventArgs.key = keyEventArgs.code  =  'ArrowUp';
        //     datetimepicker.keydownHandler(keyEventArgs);
        //     expect(datetimepicker.element.value).toBe((date.getDate()).toString()+ '/02' + '/' + (date.getFullYear() + 1).toString() + ' 01:01:01');
        // });
        it('Validation', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yy'});
            datetimepicker.appendTo('#datetimepicker');
            datetimepicker.focusIn();
            expect(datetimepicker.element.value).toBe('day/month/year');
            datetimepicker.element.selectionStart = 0;
            datetimepicker.element.selectionEnd = 3;
            datetimepicker.element.value = '3/month/year';
            datetimepicker.element.selectionStart = 1;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('03/month/year');
            datetimepicker.element.selectionStart = 0;
            datetimepicker.element.selectionEnd = 2;
            datetimepicker.element.value = '1/month/year';
            datetimepicker.element.selectionStart = 1;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('31/month/year');
            datetimepicker.element.selectionStart = 3;
            datetimepicker.element.selectionEnd = 8;
            datetimepicker.element.value = '31/2/year';
            datetimepicker.element.selectionStart = 4;
            datetimepicker.inputHandler();
            let date: Date = new Date();
            expect(datetimepicker.element.value).toBe(new Date(date.getFullYear(), 1 + 1, 0).getDate().toString() +'/02/year');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = 'a/2/year';
            datetimepicker.element.selectionStart = 1;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe(new Date(date.getFullYear(), 1 + 1, 0).getDate().toString() +'/02/year');
            expect(datetimepicker.value).toBe(null);
        });
        it('Value property', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yyyy hh:mm:ss'});
            datetimepicker.appendTo('#datetimepicker');
            datetimepicker.focusIn();
            datetimepicker.mouseUpHandler(mouseEventArgs);
            expect(datetimepicker.element.value).toBe('day/month/year hour:minute:second');
            expect(datetimepicker.element.selectionStart).toBe(0);
            expect(datetimepicker.element.selectionEnd).toBe(3);
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '1/month/year';
            datetimepicker.element.selectionStart = 1;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/month/year hour:minute:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/1/year';
            datetimepicker.element.selectionStart = 4;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/year hour:minute:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/2';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/0002 hour:minute:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/0';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/0020 hour:minute:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/1';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/0201 hour:minute:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/2';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/2012 hour:minute:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/2012 1:minute:second';
            datetimepicker.element.selectionStart = 12;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/2012 01:minute:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/2012 01:2:second';
            datetimepicker.element.selectionStart = 15;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/2012 01:02:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/2012 01:02:9';
            datetimepicker.element.selectionStart = 18;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/2012 01:02:09');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.inputBlurHandler()
            expect(+datetimepicker.value).toBe(+new Date('01/01/2012 01:02:09'));
        });
        
        it('strict mode ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yyyy' ,
            strictMode: true
            });
            datetimepicker.appendTo('#datetimepicker');
            datetimepicker.focusIn();
            datetimepicker.element.selectionStart = 14;
            datetimepicker.mouseUpHandler(mouseEventArgs);
            expect(datetimepicker.element.value).toBe('day/month/year');
            expect(datetimepicker.element.selectionStart).toBe(0);
            expect(datetimepicker.element.selectionEnd).toBe(3);
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '1/month/year';
            datetimepicker.element.selectionStart = 1;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/month/year');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/1/year';
            datetimepicker.element.selectionStart = 4;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/year');
            datetimepicker.inputBlurHandler();
            expect(datetimepicker.element.value).toBe('day/month/year');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.focusIn();
            datetimepicker.mouseUpHandler(mouseEventArgs);
            expect(datetimepicker.element.value).toBe('day/month/year');
            expect(datetimepicker.element.selectionStart).toBe(0);
            expect(datetimepicker.element.selectionEnd).toBe(3);
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '1/month/year';
            datetimepicker.element.selectionStart = 1;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/month/year');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/1/year';
            datetimepicker.element.selectionStart = 4;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/year');
            datetimepicker.element.value = '01/01/2';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/0002');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/1';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/0021');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/0';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/0210');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/0';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/2100');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.inputBlurHandler();
            expect(datetimepicker.element.value).toBe('31/12/2099');
            expect(+datetimepicker.value).toBe(+new Date('12/31/2099'));
        });
        it('Deletion', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yyyy'});
            datetimepicker.appendTo('#datetimepicker');
            datetimepicker.focusIn();
            datetimepicker.mouseUpHandler(mouseEventArgs);
            expect(datetimepicker.element.value).toBe('day/month/year');
            expect(datetimepicker.element.selectionStart).toBe(0);
            expect(datetimepicker.element.selectionEnd).toBe(3);
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '1/month/year';
            datetimepicker.element.selectionStart = 1;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/month/year');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/1/year';
            datetimepicker.element.selectionStart = 4;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/year');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/2';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/0002');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/0';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/0020');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/1';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/0201');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/2';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/2012');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.inputBlurHandler();
            expect(+datetimepicker.value).toBe(+new Date('01/01/2012'));
            datetimepicker.focusIn();
            datetimepicker.mouseUpHandler(mouseEventArgs);
            expect(datetimepicker.element.value).toBe('01/01/2012');
            expect(datetimepicker.element.selectionStart).toBe(6);
            expect(datetimepicker.element.selectionEnd).toBe(10);
            datetimepicker.element.value = '01/01/';
            datetimepicker.element.selectionStart = 6;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/year');
            expect(datetimepicker.element.selectionStart).toBe(3);
            expect(datetimepicker.element.selectionEnd).toBe(5);
            datetimepicker.element.value = '01//year';
            datetimepicker.element.selectionStart = 3;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/month/year');
            expect(datetimepicker.element.selectionStart).toBe(0);
            expect(datetimepicker.element.selectionEnd).toBe(2);
            datetimepicker.element.value = '/month/year';
            datetimepicker.element.selectionStart = 0;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('day/month/year');
            expect(datetimepicker.element.selectionStart).toBe(0);
            expect(datetimepicker.element.selectionEnd).toBe(3);
            datetimepicker.inputBlurHandler();
            expect(datetimepicker.value).toBe(null);
        });
        it('strict mode with min and max property', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yyyy' ,
            strictMode: true,
            min: new Date(2021,0,1),
            max: new Date(2021,0,31)
            });
            datetimepicker.appendTo('#datetimepicker');
            expect(datetimepicker.element.value).toBe('day/month/year');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '1/month/year';
            datetimepicker.element.selectionStart = 1;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/month/year');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/2/year';
            datetimepicker.element.selectionStart = 4;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/02/year');
            datetimepicker.element.value = '01/02/2';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/02/0002');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/02/0';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/02/0020');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/02/2';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/02/0202');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/02/1';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/02/2021');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.inputBlurHandler();
            expect(datetimepicker.element.value).toBe('31/01/2021');
            expect(+datetimepicker.value).toBe(+new Date('01/31/2021'));
        });
        it('RTL mode with maskedDatepicker ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
            document.body.appendChild(inputEle);
            datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yyyy hh:mm:ss', enableRtl: true});
            datetimepicker.appendTo('#datetimepicker');
            datetimepicker.focusIn();
            datetimepicker.mouseUpHandler(mouseEventArgs);
            expect(datetimepicker.element.value).toBe('day/month/year hour:minute:second');
            expect(datetimepicker.element.selectionStart).toBe(0);
            expect(datetimepicker.element.selectionEnd).toBe(3);
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '1/month/year';
            datetimepicker.element.selectionStart = 1;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/month/year hour:minute:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/1/year';
            datetimepicker.element.selectionStart = 4;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/year hour:minute:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/2';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/0002 hour:minute:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/0';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/0020 hour:minute:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/1';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/0201 hour:minute:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/2';
            datetimepicker.element.selectionStart = 7;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/2012 hour:minute:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/2012 1:minute:second';
            datetimepicker.element.selectionStart = 12;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/2012 01:minute:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/2012 01:2:second';
            datetimepicker.element.selectionStart = 15;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/2012 01:02:second');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.element.value = '01/01/2012 01:02:9';
            datetimepicker.element.selectionStart = 18;
            datetimepicker.inputHandler();
            expect(datetimepicker.element.value).toBe('01/01/2012 01:02:09');
            expect(datetimepicker.value).toBe(null);
            datetimepicker.inputBlurHandler()
            expect(+datetimepicker.value).toBe(+new Date('01/01/2012 01:02:09'));
        });
        // it('Enable mask with placeholder', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
        //     document.body.appendChild(inputEle);
        //     datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yy ddd' , placeholder: 'Enter the date'});
        //     datetimepicker.appendTo('#datetimepicker');
        //     expect(datetimepicker.element.value).toBe('');
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.focusIn();
        //     expect(datetimepicker.element.value).toBe('day/month/year');
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.focusOut();
        //     expect(datetimepicker.element.value).toBe('');
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.focusIn();
        //     datetimepicker.element.value = '1/month/year';
        //     datetimepicker.element.selectionStart = 1;
        //     datetimepicker.inputHandler();
        //     expect(datetimepicker.element.value).toBe('01/month/year');
        //     datetimepicker.focusOut();
        //     expect(datetimepicker.element.value).toBe('01/month/year');
        //     expect(datetimepicker.value).toBe(null);
        // });
        // it('FloatLabel type as auto', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
        //     document.body.appendChild(inputEle);
        //     datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yy ddd' , placeholder: 'Enter the date' , floatLabelType: 'Auto'});
        //     datetimepicker.appendTo('#datetimepicker');
        //     expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter the date');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-bottom')).toBe(true);
        //     expect(datetimepicker.element.value).toBe('');
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.focusIn();
        //     expect(datetimepicker.element.value).toBe('day/month/year');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top')).toBe(true);
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.focusOut();
        //     expect(datetimepicker.element.value).toBe('');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-bottom')).toBe(true);
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.focusIn();
        //     datetimepicker.element.value = '1/month/year';
        //     datetimepicker.element.selectionStart = 1;
        //     datetimepicker.inputHandler();
        //     expect(datetimepicker.element.value).toBe('01/month/year');
        //     datetimepicker.focusOut();
        //     expect(datetimepicker.element.value).toBe('01/month/year');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top')).toBe(true);
        //     expect(datetimepicker.value).toBe(null);
        // });
        // it('FloatLabel type as always', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
        //     document.body.appendChild(inputEle);
        //     datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yy ddd' , placeholder: 'Enter the date' , floatLabelType: 'Always'});
        //     datetimepicker.appendTo('#datetimepicker');
        //     expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter the date');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top')).toBe(true);
        //     expect(datetimepicker.element.value).toBe('day/month/year');
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.focusIn();
        //     expect(datetimepicker.element.value).toBe('day/month/year');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top')).toBe(true);
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.focusOut();
        //     expect(datetimepicker.element.value).toBe('');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top')).toBe(true);
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.focusIn();
        //     datetimepicker.element.value = '1/month/year';
        //     datetimepicker.element.selectionStart = 1;
        //     datetimepicker.inputHandler();
        //     expect(datetimepicker.element.value).toBe('01/month/year');
        //     datetimepicker.focusOut();
        //     expect(datetimepicker.element.value).toBe('01/month/year');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top')).toBe(true);
        //     expect(datetimepicker.value).toBe(null);
        // });
        it('culture(ja) test case - mask', () => {
            loadCultureFiles_mask('ja');
            datetimepicker = new DateTimePicker({
                locale: 'ja',
                format: 'dd/MMM/yyyy hh:mm:ss',
                enableMask: true
            });
            datetimepicker.appendTo('#date');
            expect(datetimepicker.locale).toBe('ja');
            datetimepicker.focusIn();
            expect(datetimepicker.element.value).toBe('日/月/年 時間:分:秒');
        });
        // it('culture(de) test case', () => {
        //     loadCultureFiles_mask('ja');
        //     datetimepicker = new DateTimePicker({
        //         locale: 'de',
        //         format: 'dd/MMM/yyyy hh:mm:ss',
        //         enableMask: true
        //     });
        //     datetimepicker.appendTo('#date');
        //     expect(datetimepicker.locale).toBe('de');
        //     expect(datetimepicker.element.value).toBe('Tag/Monat/Jahr Stunde:Minute:Sekunden');
        // });
        // it('culture(zh) test case - mask', () => {
        //     loadCultureFiles_mask('zh');
        //     datetimepicker = new DateTimePicker({
        //         locale: 'zh',
        //         format: 'dd/MMM/yyyy hh:mm:ss',
        //         enableMask: true
        //     });
        //     datetimepicker.appendTo('#date');
        //     expect(datetimepicker.locale).toBe('zh');
        //     datetimepicker.focusIn();
        //     setTimeout(() => {
        //     expect(datetimepicker.element.value).toBe('日/月/年 小時:分鐘:第二');
        //     },100);
        // });
        // it('dynamic mask module ', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
        //     document.body.appendChild(inputEle);
        //     datetimepicker = new DateTimePicker();
        //     datetimepicker.appendTo('#datetimepicker');
        //     expect(datetimepicker.element.value).toBe('');
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.enableMask = true;
        //     datetimepicker.dataBind();
        //     expect(datetimepicker.element.value).toBe('day/month/year');
        //     expect(datetimepicker.value).toBe(null);
        // });
        // it('ChangeEvent ', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'datetimepicker' });
        //     document.body.appendChild(inputEle);
        //     datetimepicker = new DateTimePicker({enableMask: true , format: 'dd/MM/yyyy' ,
        //  change: function(args) {
        //     expect(+args.value).toBe(+new Date('01/01/2012'));
        //   }
        // });
        //     datetimepicker.appendTo('#datetimepicker');
        //     datetimepicker.focusIn();
        //     datetimepicker.mouseUpHandler(mouseEventArgs);
        //     expect(datetimepicker.element.value).toBe('day/month/year');
        //     expect(datetimepicker.element.selectionStart).toBe(10);
        //     expect(datetimepicker.element.selectionEnd).toBe(14);
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.element.value = '1/month/year';
        //     datetimepicker.element.selectionStart = 1;
        //     datetimepicker.inputHandler();
        //     expect(datetimepicker.element.value).toBe('01/month/year');
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.element.value = '01/1/year';
        //     datetimepicker.element.selectionStart = 4;
        //     datetimepicker.inputHandler();
        //     expect(datetimepicker.element.value).toBe('01/01/year');
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.element.value = '01/01/2';
        //     datetimepicker.element.selectionStart = 7;
        //     datetimepicker.inputHandler();
        //     expect(datetimepicker.element.value).toBe('01/01/0002');
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.element.value = '01/01/0';
        //     datetimepicker.element.selectionStart = 7;
        //     datetimepicker.inputHandler();
        //     expect(datetimepicker.element.value).toBe('01/01/0020');
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.element.value = '01/01/1';
        //     datetimepicker.element.selectionStart = 7;
        //     datetimepicker.inputHandler();
        //     expect(datetimepicker.element.value).toBe('01/01/0201');
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.element.value = '01/01/2';
        //     datetimepicker.element.selectionStart = 7;
        //     datetimepicker.inputHandler();
        //     expect(datetimepicker.element.value).toBe('01/01/2012');
        //     expect(datetimepicker.value).toBe(null);
        //     datetimepicker.inputBlurHandler();
        //     expect(+datetimepicker.value).toBe(+new Date('01/01/2012'));
        // });

        

});
describe('EJ2-56658:change event is not triggered while remove the selected time in datetimepicker', () => {
    let datetimepicker: any;
    beforeEach(() => {
        let ele: HTMLElement = createElement('input', { id: 'dateTime' });
        document.body.appendChild(ele);
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('change event testing', () => {
        datetimepicker = new DateTimePicker({
            change: function (args: any) {
            expect((args.value) == (datetimepicker.value)).toBe(true);
            }
        });
        datetimepicker.appendTo('#dateTime');
        if (!datetimepicker.isDatePopupOpen() && !datetimepicker.isTimePopupOpen()) {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon e-icons')[0]).dispatchEvent(clickEvent);
        }
        let element: HTMLElement;
        element = <HTMLElement>datetimepicker.dateTimeWrapper.querySelectorAll('.e-list-item')[0];
        (element).click();
        expect(element.classList.contains('e-active')).toBe(true);
        (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
        expect(datetimepicker.value).toEqual(null);
    });

});
describe('EJ2-59142', () => {
    let datetimepicker: any;
    let keyEventArgs: any = {
        preventDefault: (): void => { /** NO Code */ },
        stopPropagation:(): void=>{},
        action: 'ArrowLeft',
        code: 'ArrowLeft',
        key: 'ArrowLeft'
    };
    beforeEach(() => {
        let ele: HTMLElement = createElement('input', { id: 'dateTime' });
        document.body.appendChild(ele);
    });
    afterEach(() => {
        if (datetimepicker) {
            datetimepicker.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Typing a value in the Datetime picker mask is not working properly.', () => {
        datetimepicker = new DateTimePicker({
            placeholder: 'Select a date and time',
            format: 'dd/MM/yyyy',
            enableMask: true,
            value: new Date('01/01/2020')
        });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.focusIn();
        expect(datetimepicker.element.value).toBe('01/01/2020');
        datetimepicker.element.selectionStart = 0;
        datetimepicker.element.selectionEnd = 2;
        datetimepicker.element.value = '0/01/2020';
        datetimepicker.element.selectionStart = 1;
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('0/01/2020');
        expect(datetimepicker.element.selectionStart === 0).toBe(true);
        expect(datetimepicker.element.selectionEnd === 1).toBe(true);
        datetimepicker.element.value = '4/01/2020';
        datetimepicker.element.selectionStart = 1;
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('04/01/2020');
        expect(datetimepicker.element.selectionStart === 3).toBe(true);
        expect(datetimepicker.element.selectionEnd === 5).toBe(true);
        datetimepicker.element.value = '04/0/2020';
        datetimepicker.element.selectionStart = 4;
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('04/0/2020');
        expect(datetimepicker.element.selectionStart === 3).toBe(true);
        expect(datetimepicker.element.selectionEnd === 4).toBe(true);
        datetimepicker.element.value = '04/5/2020';
        datetimepicker.element.selectionStart = 4;
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('04/05/2020');
        expect(datetimepicker.element.selectionStart === 6).toBe(true);
        expect(datetimepicker.element.selectionEnd === 10).toBe(true);
        datetimepicker.format = 'MM/dd/yyyy';
        datetimepicker.dataBind();
        datetimepicker.element.selectionStart = 0;
        datetimepicker.element.selectionEnd = 2;
        datetimepicker.element.value = '1/01/2020';
        datetimepicker.element.selectionStart = 1;
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('01/01/2020');
        expect(datetimepicker.element.selectionStart === 0).toBe(true);
        expect(datetimepicker.element.selectionEnd === 2).toBe(true);
        datetimepicker.element.value = '2/01/2020';
        datetimepicker.element.selectionStart = 1;
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('12/01/2020');
        datetimepicker.element.selectionStart = 3;
        datetimepicker.element.selectionEnd = 5;
        datetimepicker.element.value = '12/1/2020';
        datetimepicker.element.selectionStart = 4;
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('12/01/2020');
        expect(datetimepicker.element.selectionStart === 3).toBe(true);
        expect(datetimepicker.element.selectionEnd === 5).toBe(true);
        datetimepicker.element.value = '12/0/2020';
        datetimepicker.element.selectionStart = 4;
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('12/10/2020');
        expect(datetimepicker.element.selectionStart === 6).toBe(true);
        expect(datetimepicker.element.selectionEnd === 10).toBe(true);
        datetimepicker.keydownHandler(keyEventArgs);
        expect(datetimepicker.element.selectionStart).toBe(3);
        expect(datetimepicker.element.selectionEnd).toBe(5);
        datetimepicker.element.value = '12/0/2020';
        datetimepicker.element.selectionStart = 4;
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('12/0/2020');
        expect(datetimepicker.element.selectionStart === 3).toBe(true);
        expect(datetimepicker.element.selectionEnd === 4).toBe(true);
        datetimepicker.element.value = '12/6/2020';
        datetimepicker.element.selectionStart = 4;
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('12/06/2020');
        expect(datetimepicker.element.selectionStart === 6).toBe(true);
        expect(datetimepicker.element.selectionEnd === 10).toBe(true);
        datetimepicker.format = 'yyyy-MM-dd';
        datetimepicker.dataBind();
        expect(datetimepicker.element.value).toBe('2020-01-01');
        datetimepicker.element.selectionStart = 5;
        datetimepicker.element.selectionEnd = 7;
        datetimepicker.element.value = '2020-0-01';
        datetimepicker.element.selectionStart = 6;
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('2020-0-01');
        expect(datetimepicker.element.selectionStart === 5).toBe(true);
        expect(datetimepicker.element.selectionEnd === 6).toBe(true);
        datetimepicker.element.value = '2020-9-01';
        datetimepicker.element.selectionStart = 6;
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('2020-09-01');
        expect(datetimepicker.element.selectionStart === 8).toBe(true);
        expect(datetimepicker.element.selectionEnd === 10).toBe(true);
        datetimepicker.element.value = '2020-09-1';
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('2020-09-01');
        expect(datetimepicker.element.selectionStart === 8).toBe(true);
        expect(datetimepicker.element.selectionEnd === 10).toBe(true);
        datetimepicker.element.value = '2020-09-0';
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('2020-09-10');
        datetimepicker.keydownHandler(keyEventArgs);
        expect(datetimepicker.element.selectionStart === 5).toBe(true);
        expect(datetimepicker.element.selectionEnd === 7).toBe(true);
        datetimepicker.element.value = '2020-1-10';
        datetimepicker.element.selectionStart = 6;
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('2020-01-10');
        expect(datetimepicker.element.selectionStart === 5).toBe(true);
        expect(datetimepicker.element.selectionEnd === 7).toBe(true);
        datetimepicker.element.value = '2020-2-10';
        datetimepicker.element.selectionStart = 6;
        datetimepicker.inputHandler();
        expect(datetimepicker.element.value).toBe('2020-12-10');
        expect(datetimepicker.element.selectionStart === 8).toBe(true);
        expect(datetimepicker.element.selectionEnd === 10).toBe(true);
    });
});
});

