import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
import { Ajax } from '@syncfusion/ej2-base';
import { Component, EventHandler, Property, Event, CreateBuilder, Internationalization, setCulture } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, KeyboardEvents, KeyboardEventArgs, L10n, Browser } from '@syncfusion/ej2-base';
import { cldrData, loadCldr, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';
import { createElement, removeClass, remove, addClass, setStyleAttribute, detach } from '@syncfusion/ej2-base';
import { isNullOrUndefined, merge, getEnumValue, getValue, getUniqueID } from '@syncfusion/ej2-base';
import '../../node_modules/es6-promise/dist/es6-promise';
import { RenderDayCellEventArgs } from '../../src/calendar/calendar';

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
        it('wrapper ARIA-HASPOPUP attribute testing', () => {
            expect(datetimepicker.element.getAttribute('aria-haspopup')).toEqual('true');
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
        it('element ARIA placeholder testing', () => {
            expect(datetimepicker.element.getAttribute('aria-placeholder')).toEqual(null);
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
            datetimepicker = new DateTimePicker({ value: new Date('4/8/2017 10:30') });
            datetimepicker.appendTo('#dateTime');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
            let tableRow = datetimepicker.popupWrapper.getElementsByTagName("tr")[3];
            let tableData = tableRow.getElementsByTagName("td")[3];
            tableData.click();
            expect(+new Date(datetimepicker.inputElement.value)).toBe(getIdValue(tableData));
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
            it('Element created with Format property', () => {
                datetimepicker = new DateTimePicker({ format: 'MM/dd/yyyy hh:mm a', value: new Date('04/06/2018 10:30 AM') });
                datetimepicker.appendTo('#dateTime');
                expect(datetimepicker.inputElement.value == '04/06/2018 10:30 AM').toBe(true);
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
        });
    });
});

describe('DOM Wrapper Testing with default value ', () => {
    let mouseEventArgs: any = { preventDefault: function () { }, target: null };
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
        expect(datetimepicker.inputElement.getAttribute('aria-placeholder')).toEqual('select DateTime');
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
    it('placeholder ARIA-PLACEHOLDER testing', () => {
        expect(datetimepicker.inputElement.getAttribute('aria-placeholder')).toEqual(null);
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
    let mouseEventArgs: any = { preventDefault: function () { }, target: null };
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
    it('onproperty change format testing', () => {
        datetimepicker = new DateTimePicker();
        datetimepicker.appendTo('#dateTime');
        datetimepicker.value = new Date('3/3/2017 11:00 AM');
        datetimepicker.dataBind();
        datetimepicker.format = 'dd/MM/yyyy HH:mm';
        datetimepicker.dataBind();
        expect(datetimepicker.inputElement.value).toBe('03/03/2017 11:00');
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
    let mouseEventArgs: any = { preventDefault: function () { }, target: null };
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
        expect(datetimepicker.inputElement.getAttribute('aria-activedescendant')).toEqual('null');
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

describe('keyboard events', () => {
    let datetimepicker: any;
    let keyEventArgs: any = {
        preventDefault: (): void => { /** NO Code */ },
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
        datetimepicker.CalendarKeyActionHandle(keyEventArgs);
    });
    it('enter key test case', function () {
        datetimepicker = new DateTimePicker({
        });
        datetimepicker.appendTo('#dateTime');
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        keyEventArgs.action = 'escape';
        datetimepicker.CalendarKeyActionHandle(keyEventArgs);
        setTimeout(function () {
            expect(isNullOrUndefined(datetimepicker.popupWrapper)).toBe(true), 1000
        })
        keyEventArgs.action = 'enter';
        datetimepicker.CalendarKeyActionHandle(keyEventArgs);
        keyEventArgs.action = 'escape';
        // datetimepicker.popupWrapper = datetimepicker.popupObj = null
        datetimepicker.CalendarKeyActionHandle(keyEventArgs);
        // expect(document.activeElement).toBe(datetimepicker.inputElement);
    });
    it('tab key when popup open test case', function () {
        datetimepicker = new DateTimePicker({
        });
        datetimepicker.appendTo('#dateTime');
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-date-icon e-icons')[0]).dispatchEvent(clickEvent);
        keyEventArgs.action = 'tab';
        datetimepicker.CalendarKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:30 PM');
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:30 PM');
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 12:00 AM');
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-active')[0].getAttribute('data-value')).toBe('11:30 PM');
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
            datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
            datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('12:00 AM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 12:00 AM');
    });
    it('readonly state keyboard navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 12:30"), readonly: true });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        keyEventArgs.action = 'escape';
        keyEventArgs.keyCode = 27;
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:00 PM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:00 PM');
        keyEventArgs.action = 'home';
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('12:00 AM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 12:00 AM');
        keyEventArgs.action = 'end';
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
        keyEventArgs.action = 'enter';
        keyEventArgs.keyCode = 13;
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
        keyEventArgs.action = 'up';
        keyEventArgs.keyCode = 38;
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
        keyEventArgs.action = 'enter';
        keyEventArgs.keyCode = 13;
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:20") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        datetimepicker.show('time');
        keyEventArgs.action = 'enter';
        keyEventArgs.keyCode = 13;
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:00") });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        datetimepicker.show('time');
        keyEventArgs.action = 'down';
        keyEventArgs.keyCode = 40;
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:30 PM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:30 PM');
        keyEventArgs.action = 'up';
        keyEventArgs.keyCode = 38;
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
    });
    it('last element to previous element navigation testing', () => {
        datetimepicker = new DateTimePicker({ value: new Date("12/12/2016 23:00"), strictMode: true });
        datetimepicker.appendTo('#dateTime');
        datetimepicker.element.focus();
        datetimepicker.show('time');
        keyEventArgs.action = 'down';
        keyEventArgs.keyCode = 40;
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:30 PM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:30 PM');
        keyEventArgs.action = 'up';
        keyEventArgs.keyCode = 38;
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
        expect(datetimepicker.dateTimeWrapper.querySelectorAll('.e-navigation')[0].getAttribute('data-value')).toBe('11:30 PM');
        expect(datetimepicker.inputElement.value).toBe('12/12/2016 11:30 PM');
        keyEventArgs.action = 'up';
        keyEventArgs.keyCode = 38;
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
        keyEventArgs.action = 'enter';
        keyEventArgs.keyCode = 13;
        datetimepicker.TimeKeyActionHandle(keyEventArgs);
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

describe('document click layout testing', () => {
    let clickEventArgs: any = {
        preventDefault: (): void => { /** NO Code */ },
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
    it('Input element value rest test case', () => {
        datetime = new DateTimePicker({ value: new Date() });
        datetime.appendTo('#datetimepicker');
        (<any>document.getElementById("form-element")).reset();
        expect(datetime.element.value).toBe('');
        expect(datetime.value).toBe(null);
    });
    it('Form rest with floatLabeltype("Auto") property test case', () => {
        datetime = new DateTimePicker({ value: new Date(), floatLabelType: "Auto" });
        datetime.appendTo('#datetimepicker');
        expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
        (<any>document.getElementById("form-element")).reset();
        expect(document.querySelector('.e-float-text').classList.contains('e-label-bottom')).toBe(true);
        expect(datetime.element.value).toBe('');
    });
    it('Form rest with floatLabeltype("Always") property test case', () => {
        datetime = new DateTimePicker({ value: new Date(), floatLabelType: "Always" });
        datetime.appendTo('#datetimepicker');
        expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
        (<any>document.getElementById("form-element")).reset();
        expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
        expect(datetime.element.value).toBe('');
    });
    it('Form rest with floatLabeltype("Never") property test case', () => {
        datetime = new DateTimePicker({ value: new Date(), floatLabelType: "Never" });
        datetime.appendTo('#datetimepicker');
        expect(document.querySelector('.e-float-text')).toBe(null);
        (<any>document.getElementById("form-element")).reset();
        expect(document.querySelector('.e-float-text')).toBe(null);
        expect(datetime.element.value).toBe('');
    });
});
describe('Form element with value', () => {
    let datetime: any;
    beforeEach(() => {
        let formEle: HTMLElement = createElement('form', { id: "form-element" });
        let Ele: HTMLElement = createElement('input', { id: "datetimepicker", attrs: { value: '02/02/2017' } });
        formEle.appendChild(Ele);
        document.body.appendChild(formEle);
    });
    afterEach(() => {
        if (datetime) {
            datetime.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Input element value rest test case', () => {
        datetime = new DateTimePicker({ value: new Date() });
        datetime.appendTo('#datetimepicker');
        (<any>document.getElementById("form-element")).reset();
        expect(datetime.element.value).toBe('02/02/2017');
        expect(+datetime.value).toBe(+new Date('2/2/2017'));
    });
});
