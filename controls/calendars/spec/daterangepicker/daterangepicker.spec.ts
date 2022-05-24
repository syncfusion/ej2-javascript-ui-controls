import { DateRangePicker, RangeEventArgs, RangePopupEventArgs } from '../../src/daterangepicker/daterangepicker';
import { DateRangePickerModel } from '../../src/daterangepicker/daterangepicker-model';
import { createElement, removeClass, remove, addClass, setStyleAttribute } from '@syncfusion/ej2-base';
import { EventHandler, Component, Browser, Ajax, L10n, loadCldr } from '@syncfusion/ej2-base';
import { profile, inMB, getMemoryProfile } from '../common/common.spec';


/**
 * DateRangePicker spec document
 */
/**
 * @param  {} 'DateRangePicker'
 * @param  {} function(
 */
function getCalendarElement(ele: HTMLElement): CalendarElement {
    let elements: CalendarElement = {
        leftCalTitle: <HTMLElement>ele.querySelector('.e-left-calendar .e-title'),
        rightCalTitle: <HTMLElement>ele.querySelector('.e-right-calendar .e-title'),
        leftCalNexticon: <HTMLElement>ele.querySelector('.e-left-calendar .e-next'),
        leftCalpreviousIcon: <HTMLElement>ele.querySelector('.e-left-calendar .e-prev'),
        rightCalNexticon: <HTMLElement>ele.querySelector('.e-right-calendar .e-next'),
        rightCalpreviousIcon: <HTMLElement>ele.querySelector('.e-right-calendar .e-prev'),
    };
    return elements
}
function getDeviceCalendarElement(ele: HTMLElement): DeviceCalendarElement {
    let elements: DeviceCalendarElement = {
        title: <HTMLElement>ele.querySelector('.e-calendar .e-title'),
        nextIcon: <HTMLElement>ele.querySelector('.e-calendar .e-next'),
        previousIcon: <HTMLElement>ele.querySelector('.e-calendar .e-prev'),
    };
    return elements
}
function createControl(model?: DateRangePickerModel, isDevice?: boolean): any {
    let daterangepicker: any = new DateRangePicker(model);
    daterangepicker.appendTo('#date');
    if (isDevice) {
        daterangepicker.isMobile = true;
        daterangepicker.refreshControl();
    }
    if (!daterangepicker.isPopupOpen()) {
        <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
    }
    return daterangepicker;
}
L10n.load({
    'ja': {
        'daterangepicker': {
            placeholder: '範囲を選択',
            startLabel: '開始日',
            endLabel: '終了日',
            applyText: '適用',
            cancelText: 'キャンセル',
            selectedDays: '選択した日数',
            days: '日々',
            customRange: 'カスタムレンジ'
        }
    },
    'de': {
        'daterangepicker': {
            placeholder: 'Einen Bereich auswählen',
            startLabel: 'Anfangsdatum',
            endLabel: 'Enddatum',
            applyText: 'Sich bewerben',
            cancelText: 'Stornieren',
            selectedDays: 'Ausgewählte Tage',
            days: 'Tage',
            customRange: 'benutzerdefinierten Bereich'
        }
    },
    'vi': {
        'daterangepicker': {
            placeholder: 'Chọn một phạm vi',
            startLabel: 'Ngày Bắt đầu',
            endLabel: 'Ngày Kết thúc',
            applyText: 'Ứng dụng',
            cancelText: 'Hủy',
            selectedDays: 'Những ngày được chọn',
            days: 'Ngày',
            customRange: 'phạm vi tùy chỉnh'
        }
    },
    'en-US': {
        'daterangepicker': {
            placeholder: 'Select a range ',
            startLabel: 'Start Date',
            endLabel: 'End Date',
            applyText: 'Apply',
            cancelText: 'Cancel',
            selectedDays: 'Selected Days',
            days: 'Days',
            customRange: 'Custom Range'
        }
    },
});
function loadCultureFiles(name: string, base?: boolean): void {
    let files: string[] = !base ?
        ['ca-gregorian.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json'] : ['numberingSystems.json', "weekData.json"];
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
let clickEvent: MouseEvent = document.createEvent('MouseEvents');
clickEvent.initEvent('mousedown', true, true);
describe('DateRangePicker', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('DOM Element Testing', () => {
        describe('Input Element Testing', () => {
            let daterangepicker: any;
            let ele: HTMLInputElement;
            beforeEach(() => {
                ele = <HTMLInputElement>createElement('input', { id: 'date' });
                document.body.appendChild(ele);
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
            });
            afterEach(() => {
                if (daterangepicker) {
                    daterangepicker.destroy();
                }
                document.body.innerHTML = '';
            });
            it('Element created testing', () => {
                expect(document.querySelectorAll('#date').length > 0).toBe(true);
            });
            it('Element class e-daterangepicker testing', () => {
                expect(daterangepicker.element.classList.contains('e-daterangepicker')).toBe(true);
            });
            it('Element class e-control testing', () => {
                expect(daterangepicker.element.classList.contains('e-control')).toBe(true);
            });
            it('Input object Created ?', () => {
                expect(daterangepicker.inputWrapper.container != null).toBe(true);
            });
            it('Input buttons created for popup?', () => {
                expect(daterangepicker.inputWrapper.buttons.length > 0).toBe(true);
            });
            it('Input Element DOM tag ', () => {
                expect(daterangepicker.inputWrapper.container.tagName == "SPAN").toBe(true);
            });
            it('Popup button DOM tag ', () => {
                expect(daterangepicker.inputWrapper.buttons[0].tagName == "SPAN").toBe(true);
            });
            it('Input Element focus ', () => {
                daterangepicker.element.focus();
                expect(daterangepicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
                expect(document.activeElement === daterangepicker.element).toBe(true);
            });
            it('Input Element blur ', () => {
                daterangepicker.element.focus();
                expect(daterangepicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
                expect(document.activeElement === daterangepicker.element).toBe(true);
                daterangepicker.element.blur();
                expect(daterangepicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(false);
            });
            it('width string type test case ', () => {
                daterangepicker = createControl({ width: '200px' });
                expect(daterangepicker.inputWrapper.container.style.width).toBe('200px');
            });
            it('width number type test case ', () => {
                daterangepicker = createControl({ width: 200 });
                expect(daterangepicker.inputWrapper.container.style.width).toBe('200px');
            });
            it('width with value em test case ', () => {
                daterangepicker = createControl({ width: "200em" });
                expect(daterangepicker.inputWrapper.container.style.width).toBe('200em');
            });
            it('Element role testing ', () => {
                expect(daterangepicker.element.getAttribute('role') == "combobox").toBe(true);
            });
            it('Element name attribute testing', () => {
                expect(daterangepicker.firstHiddenChild.hasAttribute('name') && daterangepicker.firstHiddenChild.getAttribute('name') === daterangepicker.element.id).toBe(true);
            });
            it('Element disabled ARIA attribute default values', () => {
                expect(daterangepicker.element.getAttribute('aria-disabled') == 'false').toBe(true);
            });
            it('Element Expanded ARIA attribute default values', () => {
                expect(daterangepicker.element.getAttribute('aria-expanded') == 'false').toBe(true);
            });
            it('Element haspopup ARIA attribute default values', () => {
                expect(daterangepicker.element.getAttribute('aria-haspopup') == 'true').toBe(true);
            });
            it('Element readonly ARIA attribute default values', () => {
                expect(daterangepicker.element.getAttribute('aria-readonly') == 'false').toBe(true);
            });
            it('Element placeholder testing ', () => {
                daterangepicker = createControl({ placeholder: 'Select the Date Range' });
                expect(daterangepicker.element.getAttribute("placeholder")).toBe('Select the Date Range');
            });
            it('Element cssClass testing', () => {
                daterangepicker = createControl({ cssClass: 'e-custom' });
                expect(daterangepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            });
            it('Element disable testing', () => {
                daterangepicker = createControl({ enabled: false });
                expect(daterangepicker.element.hasAttribute('disabled')).toBe(true);
            });
            it('Element readonly property testing', () => {
                daterangepicker = createControl({ readonly: true });
                expect(daterangepicker.element.hasAttribute('readonly') && daterangepicker.element.getAttribute('aria-readonly') == 'true').toBe(true);
            });
            it('placeholder maintained after empty value testing ', () => {
                daterangepicker = createControl({ placeholder: 'Select the Date Range', startDate: new Date('05/24/2017'), endDate: new Date('08/10/2017') });
                daterangepicker.element.value = '';
                daterangepicker.preventBlur = false;
                daterangepicker.inputBlurHandler();
                expect(daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
                expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
                expect(daterangepicker.element.getAttribute("placeholder")).toBe('Select the Date Range');
            });
        });
        describe('DateRangePicker', () => {
            describe('DOM Element Testing', () => {
                describe('Input Element Testing', () => {
                    let daterangepicker: any;
                    let ele: HTMLInputElement;
                    beforeEach(() => {
                        ele = <HTMLInputElement>createElement('input', { id: 'date' });
                        document.body.appendChild(ele);
                    });
                    afterEach(() => {
                        if (daterangepicker) {
                            daterangepicker.destroy();
                        }
                        document.body.innerHTML = '';
                    });
                    it('allowedit property with true test case ', () => {
                        daterangepicker = new DateRangePicker({ allowEdit: true });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.element.getAttribute('readonly')).toBe(null);
                        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-range-icon e-icons')[0]).dispatchEvent(clickEvent);
                        expect(document.querySelector('.e-daterangepicker.e-popup').classList.contains('e-popup')).toBe(true);
                    });
                    it('allowedit property with false test case ', () => {
                        daterangepicker = new DateRangePicker({ allowEdit: false });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.element.getAttribute('readonly')).toBe('');
                        (<HTMLElement>document.getElementsByClassName('e-input-group-icon e-range-icon e-icons')[0]).dispatchEvent(clickEvent);
                        expect(document.querySelector('.e-daterangepicker.e-popup').classList.contains('e-popup')).toBe(true);
                    });
                    it('allowedit onproperty test case ', () => {
                        daterangepicker = new DateRangePicker({});
                        daterangepicker.appendTo('#date');
                        daterangepicker.allowEdit = false;
                        daterangepicker.dataBind();
                        expect(daterangepicker.element.getAttribute('readonly')).toBe('');
                        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-range-icon e-icons')[0]).dispatchEvent(clickEvent);
                        expect(document.querySelector('.e-daterangepicker.e-popup').classList.contains('e-popup')).toBe(true);
                        daterangepicker.allowEdit = true;
                        daterangepicker.dataBind();
                        expect(daterangepicker.element.getAttribute('readonly')).toBe(null);
                        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-range-icon e-icons')[0]).dispatchEvent(clickEvent);
                        expect(document.querySelector('.e-daterangepicker.e-popup').classList.contains('e-popup')).toBe(true);
                    });
                    it('allowedit property with e-non-edit calss ', () => {
                        daterangepicker = new DateRangePicker({ value: [new Date('02/11/2017'), new Date('03/11/2017')] });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.element.getAttribute('readonly')).toBe(null);
                        expect(daterangepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
                        daterangepicker.allowEdit = false;
                        daterangepicker.dataBind();
                        expect(daterangepicker.element.getAttribute('readonly')).toBe('');
                        expect(daterangepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(true);
                    });
                    it('allowedit property with e-non-edit calss with readonly ', () => {
                        daterangepicker = new DateRangePicker({ value: [new Date('02/11/2017'), new Date('03/11/2017')] });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.element.getAttribute('readonly')).toBe(null);
                        expect(daterangepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
                        daterangepicker.allowEdit = false;
                        daterangepicker.readonly = true;
                        daterangepicker.dataBind();
                        expect(daterangepicker.element.getAttribute('readonly')).toBe('');
                        expect(daterangepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
                    });
                    it('allowedit property invalid value with e-non-edit calss  ', () => {
                        daterangepicker = new DateRangePicker({});
                        daterangepicker.appendTo('#date');
                        daterangepicker.value = 'invalid';
                        daterangepicker.dataBind();
                        expect(daterangepicker.element.getAttribute('readonly')).toBe(null);
                        expect(daterangepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(false);
                        daterangepicker.allowEdit = false;
                        daterangepicker.dataBind();
                        expect(daterangepicker.element.getAttribute('readonly')).toBe('');
                        expect(daterangepicker.inputWrapper.container.classList.contains('e-non-edit')).toBe(true);
                    });
                    it('Element created with cssClass property', () => {
                        daterangepicker = new DateRangePicker({ cssClass: 'e-custom' });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
                    });
                    it('Element created with enableRtl property', () => {
                        daterangepicker = new DateRangePicker({ enableRtl: true });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.inputWrapper.container.classList.contains('e-rtl')).toBe(true);
                    });
                    it('Element created with enabled property', () => {
                        daterangepicker = new DateRangePicker({ enabled: false });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.isPopupOpen()).toBe(false);
                        expect(daterangepicker.enabled === false && daterangepicker.element.hasAttribute('disabled')).toBe(true);
                        <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).click();
                        expect(daterangepicker.isPopupOpen()).toBe(false);
                    });
                    it('show method with readonly property ', () => {
                        daterangepicker = new DateRangePicker({ readonly: true });
                        daterangepicker.appendTo('#date');
                        daterangepicker.show();
                        expect(daterangepicker.isPopupOpen()).toBe(false);
                        expect(daterangepicker.readonly === true && daterangepicker.element.hasAttribute('readonly')).toBe(true);
                        <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).click();
                        expect(daterangepicker.isPopupOpen()).toBe(false);
                    });
                    it('show method  with enabled property', () => {
                        daterangepicker = new DateRangePicker({ enabled: false });
                        daterangepicker.appendTo('#date');
                        daterangepicker.show();
                        expect(daterangepicker.isPopupOpen()).toBe(false);
                        expect(daterangepicker.enabled === false && daterangepicker.element.hasAttribute('disabled')).toBe(true);
                        <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).click();
                        expect(daterangepicker.isPopupOpen()).toBe(false);
                    });
                    it('Element created with firstDayofWeek property', () => {
                        daterangepicker = new DateRangePicker({ firstDayOfWeek: 2 });
                        daterangepicker.appendTo('#date');
                        daterangepicker.show();
                        expect(document.querySelectorAll('.e-content th')[0].textContent).toBe('Tu');
                        expect(document.querySelectorAll('.e-left-calendar .e-content th')[0].textContent == 'Tu' &&
                            document.querySelectorAll('.e-right-calendar .e-content th')[0].textContent == 'Tu').toBe(true);
                    });
                    it('Element created with Format property', () => {
                        let date = new Date('04/06/2018 10:30 AM');
                        daterangepicker = new DateRangePicker({ format: 'MM/dd/yyyy hh:mm a', startDate: date, endDate: new Date(new Date('04/06/2018 10:30 AM').setDate(date.getDate() + 10)) });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.inputElement.value == '04/06/2018 10:30 AM - 04/16/2018 10:30 AM').toBe(true);
                    });
                    it('Element created with object type Format property', () => {
                        let date = new Date('04/06/2018');
                        daterangepicker = new DateRangePicker({ format: { skeleton: 'short' }, startDate: date, endDate: new Date(new Date('04/06/2018 10:30 AM').setDate(date.getDate() + 10)) });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.inputElement.value == '4/6/18 - 4/16/18').toBe(true);
                    });
                    it('onproperty change for object type Format property', () => {
                        let date = new Date('04/06/2018 10:30 AM');
                        daterangepicker = new DateRangePicker({ startDate: date, endDate: new Date(new Date('04/06/2018 10:30 AM').setDate(date.getDate() + 10)) });
                        daterangepicker.appendTo('#date');
                        daterangepicker.format = { skeleton: 'short' };
                        daterangepicker.dataBind();
                        expect(daterangepicker.inputElement.value == '4/6/18 - 4/16/18').toBe(true);
                    });
                    it('Element created with placeholder property', () => {
                        daterangepicker = new DateRangePicker({ placeholder: 'Select a range' });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.placeholder).toBe('Select a range');
                        expect(daterangepicker.inputWrapper.container.tagName == 'SPAN').toBe(true);
                        expect(daterangepicker.inputElement.getAttribute('placeholder')).toBe('Select a range');
                    });
                    it('FloatLabelType model testing', () => {
                        daterangepicker = new DateRangePicker({ placeholder: 'Select a range', floatLabelType: 'Auto' });
                        daterangepicker.appendTo('#date');
                        daterangepicker.floatLabelType = 'None';
                        daterangepicker.dataBind();
                        expect(daterangepicker.floatLabelType).toBe('None');
                    });
                    it('Element created with floatLabelType property with Auto type', () => {
                        daterangepicker = new DateRangePicker({ placeholder: 'Select a range', floatLabelType: 'Auto' });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.floatLabelType).toBe('Auto');
                        expect(daterangepicker.inputWrapper.container.tagName == 'DIV').toBe(true);
                        expect(daterangepicker.inputWrapper.container.classList.contains('e-float-input')).toBe(true);
                        expect(daterangepicker.inputWrapper.container.children[1].classList.contains('e-float-line')).toBe(true);
                        expect(daterangepicker.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(true);
                        expect(daterangepicker.inputWrapper.container.children[2].classList.contains('e-label-bottom')).toBe(true);
                        expect(daterangepicker.inputWrapper.container.children[2].innerText).toBe('Select a range');
                        daterangepicker.startDate = new Date('04/06/2018');
                        daterangepicker.endDate = new Date('04/16/2018');
                        daterangepicker.dataBind();
                        expect(daterangepicker.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
                    });
                    it('Element created with floatLabelType property with Always type', () => {
                        daterangepicker = new DateRangePicker({ placeholder: 'Select a range', floatLabelType: 'Always' });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.floatLabelType).toBe('Always');
                        expect(daterangepicker.inputWrapper.container.tagName == 'DIV').toBe(true);
                        expect(daterangepicker.inputWrapper.container.classList.contains('e-float-input')).toBe(true);
                        expect(daterangepicker.inputWrapper.container.children[1].classList.contains('e-float-line')).toBe(true);
                        expect(daterangepicker.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(true);
                        expect(daterangepicker.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
                        expect(daterangepicker.inputWrapper.container.children[2].innerText).toBe('Select a range');
                        daterangepicker.startDate = new Date('04/06/2018');
                        daterangepicker.endDate = new Date('04/16/2018');
                        daterangepicker.dataBind();
                        expect(daterangepicker.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
                    });
                    it('Element created with floatLabelType property with Never type', () => {
                        daterangepicker = new DateRangePicker({ placeholder: 'Select a range', floatLabelType: 'Never' });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.floatLabelType).toBe('Never');
                        expect(daterangepicker.inputWrapper.container.tagName == 'SPAN').toBe(true);
                        expect(daterangepicker.inputWrapper.container.classList.contains('e-float-input')).toBe(false);
                        expect(daterangepicker.inputElement.getAttribute('placeholder')).toBe('Select a range');
                        expect(daterangepicker.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(false);
                    });
                    it('disabled property with popup prevent test case', () => {
                        daterangepicker = new DateRangePicker({ enabled: false });
                        daterangepicker.appendTo('#date');
                        daterangepicker.show();
                        expect(document.querySelector('.e-daterangepicker.e-popup')).toBe(null);
                    });
                    it('Readonly property with popup prevent test case', () => {
                        daterangepicker = new DateRangePicker({ readonly: true });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.element.hasAttribute('readonly') && daterangepicker.element.getAttribute('aria-readonly') == 'true').toBe(true);
                        daterangepicker.show();
                        expect(document.querySelector('.e-daterangepicker.e-popup')).toBe(null);
                        daterangepicker.readonly = false;
                        daterangepicker.dataBind();
                        daterangepicker.show();
                        expect(document.querySelector('.e-daterangepicker.e-popup')).toBe(daterangepicker.popupWrapper);

                    });
                    it('autocorrect attribute test case', () => {
                        daterangepicker = new DateRangePicker({ readonly: true });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.element.getAttribute('autocorrect') == 'off').toBe(true);
                    });
                    it('autocapitalize attribute test case', () => {
                        daterangepicker = new DateRangePicker({ readonly: true });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.element.getAttribute('autocapitalize') == 'off').toBe(true);
                    });
                    it('spellcheck attribute test case', () => {
                        daterangepicker = new DateRangePicker({ readonly: true });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.element.getAttribute('spellcheck') == 'false').toBe(true);
                    });
                    it('autocomplete attribute test case', () => {
                        daterangepicker = new DateRangePicker({ readonly: true });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.element.getAttribute('autocomplete') == 'off').toBe(true);
                    });
                    /**
                   * tabIndex
                   */
                    it('tab index of focus element', () => {
                        daterangepicker = new DateRangePicker({});
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.inputWrapper.container.children[0].getAttribute('tabindex') === '0').toBe(true);
                    });
                    it('while give tab index to the daterangepicker element', () => {
                        daterangepicker = new DateRangePicker({});
                        daterangepicker.appendTo('#date');
                        daterangepicker.element.tabIndex = '4';
                        expect(daterangepicker.inputWrapper.container.children[0].getAttribute('tabindex') === '4').toBe(true);
                    });
                    it('tab index of focus element in disable state ', () => {
                        daterangepicker = new DateRangePicker({ enabled: false });
                        daterangepicker.appendTo('#date');
                        expect(daterangepicker.inputWrapper.container.children[0].tabIndex === -1).toBe(true);
                        daterangepicker.enabled = true;
                        daterangepicker.dataBind();
                    });
                    it('Tab index checking while destroy the component', () => {
                        let inputEle: HTMLElement = createElement('input', { id: 'daterangepicker', attrs: { "tabindex": "1" } });
                        document.body.appendChild(inputEle);
                        daterangepicker = new DateRangePicker({});
                        daterangepicker.appendTo('#daterangepicker');
                        daterangepicker.destroy();
                        expect(inputEle.getAttribute('tabindex') === '1').toBe(true);
                        daterangepicker = null;
                    });
                    it('Tab index checking while destroy the Angular component', () => {
                        let element: any = createElement('ejs-daterangepicker', { id: 'daterange' });
                        element.setAttribute('tabindex', '1');
                        document.body.appendChild(element);
                        daterangepicker = new DateRangePicker();
                        daterangepicker.appendTo(element);
                        daterangepicker.destroy();
                        expect(element.getAttribute('tabindex') === null).toBe(true);
                        daterangepicker = null;
                    });
                });
            });
        });
        describe('clear button related testing', () => {
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            let daterangepicker: any;
            beforeEach(() => {
                let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
                document.body.appendChild(ele);
                daterangepicker = new DateRangePicker({ startDate: new Date("07/05/2017"), endDate: new Date("05/05/2018"), showClearButton: true });
                daterangepicker.appendTo('#date');
                if (!daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
            });
            afterEach(() => {
                if (daterangepicker) {
                    daterangepicker.destroy();
                }
                document.body.innerHTML = '';
            });
            it('clear icon', () => {
                expect(daterangepicker.inputWrapper.clearButton.classList.contains('e-clear-icon')).toBe(true);
            });
            it('Clear button Setmodel', () => {
                daterangepicker.showClearButton = false;
                daterangepicker.dataBind();
                expect(document.body.querySelectorAll('e-clear-icon').length == 0);
                daterangepicker.showClearButton = true;
                daterangepicker.dataBind();
                expect(document.body.querySelectorAll('e-clear-icon').length != 0);
            });
            it('clear button default state', () => {
                expect(daterangepicker.startDate.valueOf()).toBe(new Date("07/05/2017").valueOf());
                expect(daterangepicker.endDate.valueOf()).toBe(new Date("05/05/2018").valueOf());
                daterangepicker.inputElement.focus();
                expect(daterangepicker.inputWrapper.clearButton.classList.contains('e-clear-icon-hide')).toBe(false);
            });
            it('click on clear button', () => {
                expect(daterangepicker.startDate.valueOf()).toBe(new Date("07/05/2017").valueOf());
                expect(daterangepicker.endDate.valueOf()).toBe(new Date("05/05/2018").valueOf());
                (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
                expect(daterangepicker.element.value).toBe("");
                daterangepicker.resetHandler(mouseEventArgs);
                expect(daterangepicker.startDate).toBe(null);
                expect(daterangepicker.endDate).toBe(null);
            });
        });
        describe('Popup Element Testing', () => {
            let daterangepicker: any;
            beforeEach(() => {
                let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
                document.body.appendChild(ele);
                daterangepicker = new DateRangePicker({ cssClass: 'e-custom' });
                daterangepicker.appendTo('#date');
                if (!daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
            });
            afterEach(() => {
                if (daterangepicker) {
                    daterangepicker.destroy();
                }
                document.body.innerHTML = '';
            });
            it('Popup Element creation testing', () => {
                expect(document.body.querySelector('.e-popup') !== null).toBe(true);
            });
            it('Popup class testing', () => {
                expect(daterangepicker.popupWrapper.classList.contains('e-popup')).toBe(true);
            });
            it('Popup Element cssClass', () => {
                expect(daterangepicker.popupWrapper.classList.contains(daterangepicker.cssClass)).toBe(true);
            });
            it('Popup Control class testing', () => {
                expect(daterangepicker.popupWrapper.classList.contains('e-control')).toBe(true);
            });
            it('Popup class e-daterangepicker testing', () => {
                expect(daterangepicker.popupWrapper.classList.contains('e-daterangepicker')).toBe(true);
            });
            it('Element Expanded ARIA attribute default values', () => {
                expect(daterangepicker.element.getAttribute('aria-expanded') == 'true').toBe(true);
            });
            it('is Popup Element open class', () => {
                expect(daterangepicker.popupWrapper.classList.contains('e-popup-open')).toBe(true);
            });
            it('is Popup Element opened(function)', (done) => {
                setTimeout(() => {
                    expect(daterangepicker.isPopupOpen()).toBe(true);
                    done();
                }, 450);
            });
            it('is Popup Element Closed', () => {
                if (daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
                expect(daterangepicker.isPopupOpen()).toBe(false);
            });
            it('active class added for button while Popup Element open', () => {
                expect(daterangepicker.inputWrapper.buttons[0].classList.contains('e-active')).toBe(true);
            });
            it('is Popup Element Closed(Cancel Button)', () => {
                <HTMLElement>(daterangepicker.cancelButton.element).click();
                expect(daterangepicker.isPopupOpen()).toBe(false);
            });
            it('is Popup Element created with ID', () => {
                expect(daterangepicker.popupWrapper.id === daterangepicker.element.id + '_popup').toBe(true);
            });
            it('Popup not open when Element disable testing', () => {
                daterangepicker.enabled = false;
                daterangepicker.dataBind();
                expect(daterangepicker.isPopupOpen()).toBe(false);
                expect(daterangepicker.enabled === false && daterangepicker.element.hasAttribute('disabled')).toBe(true);
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                expect(daterangepicker.isPopupOpen()).toBe(false);
            });
            it('Element target testing', () => {
                let element: HTMLElement = <HTMLElement>createElement('input', { id: 'daterange', attrs: { type: 'hidden' } });
                document.body.appendChild(element);
                daterangepicker = new DateRangePicker({ cssClass: 'e-custom' });
                daterangepicker.appendTo('#daterange');
                let target: HTMLElement = <HTMLElement>createElement('input', { id: 'target' });
                document.body.appendChild(target);
                daterangepicker.hide();
                daterangepicker.show(target);
                if (!daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
                expect(daterangepicker.inputWrapper.container.style.display).toBe('');
                expect(daterangepicker.targetElement === target && daterangepicker.popupObj.relateTo === target).toBe(true);
                let e: any = {
                    preventDefault: (): void => { /** NO Code */ },
                    target: target
                };
                daterangepicker.documentHandler(e);
            });
        });
        describe('Set Model testing', () => {
            let daterangepicker: any;
            beforeEach(() => {
                let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
                document.body.appendChild(ele);
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
            });
            afterEach(() => {
                if (daterangepicker) {
                    daterangepicker.destroy();
                }
                document.body.innerHTML = '';
            });
            it('Element width testing ', () => {
                daterangepicker.width = 200;
                daterangepicker.dataBind();
                expect(daterangepicker.inputWrapper.container.style.width).toBe('200px');
            });
            it('Element placeholder testing ', () => {
                daterangepicker.placeholder = 'Select the Date Range';
                daterangepicker.dataBind();
                expect(daterangepicker.element.getAttribute("placeholder")).toBe('Select the Date Range');
            });
            it('Element cssClass testing', () => {
                daterangepicker.cssClass = 'e-custom';
                daterangepicker.dataBind();
                expect(daterangepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
                expect(daterangepicker.cssClass === 'e-custom').toBe(true);
            });

            it('multiple cssClass  test case', () => {
                daterangepicker = new DateRangePicker({
                    cssClass: 'e-custom e-secondary-class'
                });
                daterangepicker.appendTo('#date');
                expect(daterangepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
                expect(daterangepicker.inputWrapper.container.classList.contains('e-secondary-class')).toBe(true);
                daterangepicker.cssClass = "e-ternary e-cssClass";
                daterangepicker.dataBind();
                expect(daterangepicker.inputWrapper.container.classList.contains('e-ternary')).toBe(true);
                expect(daterangepicker.inputWrapper.container.classList.contains('e-cssClass')).toBe(true);
                daterangepicker.show();
                expect(daterangepicker.popupWrapper.classList.contains('e-ternary')).toBe(true);
                expect(daterangepicker.popupWrapper.classList.contains('e-cssClass')).toBe(true);

            });
            it('Element disable testing', () => {
                daterangepicker.enabled = false;
                daterangepicker.dataBind();
                expect(daterangepicker.enabled === false && daterangepicker.element.hasAttribute('disabled') && daterangepicker.element.getAttribute('aria-disabled') == 'true').toBe(true);
            });
            it('Element readonly property testing', () => {
                daterangepicker.readonly = true;
                daterangepicker.dataBind();
                expect(daterangepicker.readonly === true && daterangepicker.element.hasAttribute('readonly') && daterangepicker.element.getAttribute('aria-readonly') == 'true').toBe(true);
            });
            it('Element Value testing ', () => {
                daterangepicker.value = [new Date('02/11/2001'), new Date('03/11/2001')];
                daterangepicker.dataBind();
                expect(+daterangepicker.startDate === +(new Date('02/11/2001')) && daterangepicker.isPopupOpen() == false).toBe(true);
                expect(+daterangepicker.startDate === +(new Date('02/11/2001')) && daterangepicker.isPopupOpen() == false).toBe(true);
            });
            it('Element startDate testing ', () => {
                daterangepicker.startDate = new Date('02/11/2001');
                daterangepicker.dataBind();
                expect(+daterangepicker.startDate === +(new Date('02/11/2001')) && daterangepicker.isPopupOpen() == false).toBe(true);
            });
            it('Element endDate testing ', () => {
                daterangepicker.endDate = new Date('03/11/2001');
                daterangepicker.dataBind();
                expect(+daterangepicker.endDate === +(new Date('03/11/2001')) && daterangepicker.isPopupOpen() == false).toBe(true);
            });
            it('range separator testing', () => {
                daterangepicker = createControl({ startDate: new Date('05/24/2017'), endDate: new Date('08/10/2017') });
                daterangepicker.separator = '+';
                daterangepicker.dataBind();
                expect(daterangepicker.separator === '+' && daterangepicker.element.value.indexOf('+') > -1).toBe(true);
            });
            it('Element format testing', () => {
                daterangepicker = createControl({ startDate: new Date('05/24/2017'), endDate: new Date('08/10/2018') });
                daterangepicker.format = 'y';
                daterangepicker.dataBind();
                expect(daterangepicker.format === 'y' && daterangepicker.element.value === '2017 - 2018' && daterangepicker.isPopupOpen() == false).toBe(true);
            });
            it('Date format testing', () => {
                daterangepicker = createControl({ startDate: new Date('05/24/2017'), endDate: new Date('08/10/2018') });
                daterangepicker.format = 'MM-dd-yyyy';
                daterangepicker.dataBind();
                daterangepicker.element.focus();
                daterangepicker.preventBlur = false;
                daterangepicker.inputBlurHandler();
                expect(+daterangepicker.startDate).toBe(+new Date('05/24/2017'));
                expect(+daterangepicker.endDate).toBe(+new Date('08/10/2018'));
                expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false)
            });
            it('Element minDays property testing', () => {
                daterangepicker.minDays = 4;
                daterangepicker.dataBind();
                expect(daterangepicker.minDays === 4 && daterangepicker.isPopupOpen() == false).toBe(true);
            });
            it('Element maxDays property testing', () => {
                daterangepicker.maxDays = 10;
                daterangepicker.dataBind();
                expect(daterangepicker.maxDays === 10 && daterangepicker.isPopupOpen() == false).toBe(true);
            });
            it('Element locale property testing', () => {
                daterangepicker.locale = 'de';
                daterangepicker.dataBind();
                expect(daterangepicker.locale === 'de' && daterangepicker.isPopupOpen() == false).toBe(true);
            });
            it('Element min property testing', () => {
                daterangepicker.min = new Date('1/1/2017');
                daterangepicker.dataBind();
                expect(+daterangepicker.min === +new Date('1/1/2017') && daterangepicker.isPopupOpen() == false).toBe(true);
            });
            it('Element max property testing', () => {
                daterangepicker.max = new Date('12/1/2017');
                daterangepicker.dataBind();
                expect(+daterangepicker.max === +new Date('12/1/2017') && daterangepicker.isPopupOpen() == false).toBe(true);
            });
            it('Element strictMode property testing', () => {
                daterangepicker.strictMode = true;
                daterangepicker.dataBind();
                expect(daterangepicker.strictMode === true && daterangepicker.isPopupOpen() == false).toBe(true);
            });
            it('Rtl property testing', () => {
                daterangepicker.enableRtl = true;
                daterangepicker.dataBind();
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                expect(daterangepicker.enableRtl === true && daterangepicker.inputWrapper.container.classList.contains('e-rtl')).toBe(true);
            });
            /**
             * zIndex
             */
            it('zIndex default value ', () => {
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-range-icon e-icons')[0]).dispatchEvent(clickEvent);
                // expect(daterangepicker.popupWrapper.style.zIndex).toEqual('');                
                daterangepicker.zIndex = 2000;
                daterangepicker.dataBind();
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-range-icon e-icons')[0]).dispatchEvent(clickEvent);
                expect(daterangepicker.popupWrapper.style.zIndex).toEqual('2000');
                document.querySelector('.e-left-calendar .e-header .e-date-icon-prev').dispatchEvent(clickEvent);
            });
            it('zIndex initial value change ', () => {
                daterangepicker = new DateRangePicker({ zIndex: 1500 });
                daterangepicker.appendTo('#date');
                (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-range-icon e-icons')[0]).dispatchEvent(clickEvent);
                expect(daterangepicker.popupWrapper.style.zIndex).toEqual('1500');
            });
            it('Firstdayofweek property testing', () => {
                daterangepicker = createControl({ firstDayOfWeek: 1 });
                expect(document.querySelectorAll('.e-content th')[0].textContent).toBe('Mo');
                expect(document.querySelectorAll('.e-left-calendar .e-content th')[0].textContent == 'Mo' && document.querySelectorAll('.e-right-calendar .e-content th')[0].textContent == 'Mo').toBe(true);
            });
            it('Floatlabeltype property testing', () => {
                daterangepicker = new DateRangePicker({ placeholder: 'Select a range', floatLabelType: 'Auto' });
                daterangepicker.appendTo('#date');
                daterangepicker.floatLabelType = 'None';
                daterangepicker.dataBind();
                expect(daterangepicker.floatLabelType).toBe('None');
            });
            it('Floatlabeltype property with Auto type', () => {
                daterangepicker = new DateRangePicker({ placeholder: 'Select a range', floatLabelType: 'Auto' });
                daterangepicker.appendTo('#date');
                expect(daterangepicker.floatLabelType).toBe('Auto');
                expect(daterangepicker.inputWrapper.container.tagName == 'DIV').toBe(true);
                expect(daterangepicker.inputWrapper.container.classList.contains('e-float-input')).toBe(true);
                expect(daterangepicker.inputWrapper.container.children[1].classList.contains('e-float-line')).toBe(true);
                expect(daterangepicker.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(true);
                expect(daterangepicker.inputWrapper.container.children[2].classList.contains('e-label-bottom')).toBe(true);
                expect(daterangepicker.inputWrapper.container.children[2].innerText).toBe('Select a range');
                daterangepicker.startDate = new Date('04/06/2018');
                daterangepicker.endDate = new Date('04/16/2018');
                daterangepicker.dataBind();
                expect(daterangepicker.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
            });
            it('Floatlabeltype property with Always type', () => {
                daterangepicker = new DateRangePicker({ placeholder: 'Select a range', floatLabelType: 'Always' });
                daterangepicker.appendTo('#date');
                expect(daterangepicker.floatLabelType).toBe('Always');
                expect(daterangepicker.inputWrapper.container.tagName == 'DIV').toBe(true);
                expect(daterangepicker.inputWrapper.container.classList.contains('e-float-input')).toBe(true);
                expect(daterangepicker.inputWrapper.container.children[1].classList.contains('e-float-line')).toBe(true);
                expect(daterangepicker.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(true);
                expect(daterangepicker.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
                expect(daterangepicker.inputWrapper.container.children[2].innerText).toBe('Select a range');
                daterangepicker.startDate = new Date('04/06/2018');
                daterangepicker.endDate = new Date('04/16/2018');
                daterangepicker.dataBind();
                expect(daterangepicker.inputWrapper.container.children[2].classList.contains('e-label-top')).toBe(true);
            });
            it('Floatlabeltype with Never type', () => {
                daterangepicker = new DateRangePicker({ placeholder: 'Select a range', floatLabelType: 'Never' });
                daterangepicker.appendTo('#date');
                expect(daterangepicker.floatLabelType).toBe('Never');
                expect(daterangepicker.inputWrapper.container.tagName == 'SPAN').toBe(true);
                expect(daterangepicker.inputWrapper.container.classList.contains('e-float-input')).toBe(false);
                expect(daterangepicker.inputElement.getAttribute('placeholder')).toBe('Select a range');
                expect(daterangepicker.inputWrapper.container.children[2].classList.contains('e-float-text')).toBe(false);
            });
            it('Weeknumber prooperty testing', () => {
                daterangepicker = createControl({ weekNumber: true });
                expect(daterangepicker.popupObj.element.querySelectorAll('.e-week-number').length > 0).toBe(true);
            });
            it('Presets testing', () => {
                daterangepicker = createControl({ presets: [{ label: 'Today', start: new Date(), end: new Date() }, { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }] });
                <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
                let startDate: string = daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
                let endDate: string = daterangepicker.globalize.formatDate(daterangepicker.endDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
                expect(daterangepicker.element.value === startDate + ' - ' + endDate).toBe(true);
            })
            it('Error Class for start value before 1905-Chrome testing', () => {
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                daterangepicker.inputElement.value = '1/1/1900 - 1/1/2018';
                daterangepicker.dataBind();
                daterangepicker.inputBlurHandler();
                expect((<HTMLElement>document.getElementsByClassName('e-date-range-wrapper')[0]).classList.contains('e-error')).toBe(false);
                expect(+daterangepicker.startDate).toBe(+new Date('1/1/1900'));
            });
        });
        describe('Clear value with strict mode enabled ', () => {
            let daterangepicker: any;
            beforeEach(() => {
                let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
                document.body.appendChild(ele);
            });
            afterEach(() => {
                if (daterangepicker) {
                    daterangepicker.destroy();
                }
                document.body.innerHTML = '';
            });
            it('Clear input with strict mode enabled initially', () => {
                daterangepicker = new DateRangePicker({ startDate: new Date('05/24/2017'), endDate: new Date('08/10/2017'), strictMode: true });
                daterangepicker.appendTo('#date');
                daterangepicker.inputElement.value = '';
                daterangepicker.inputBlurHandler();
                expect(daterangepicker.inputElement.value).toBe('');
            });
            it('Clear input with strict mode enabled dynamically', () => {
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                daterangepicker.startDate = '4/3/2018';
                daterangepicker.endDate = '5/1/2018';
                daterangepicker.strictMode = true;
                daterangepicker.dataBind();
                daterangepicker.inputElement.value = '';
                daterangepicker.inputBlurHandler();
                expect(daterangepicker.inputElement.value).toBe('');
            });
            it('Clear input through show clear button', function () {
                daterangepicker = new DateRangePicker({ startDate: new Date('05/24/2017'), endDate: new Date('08/10/2017'), strictMode: true, showClearButton: true });
                daterangepicker.appendTo('#date');
                daterangepicker.clear();
                expect(daterangepicker.inputElement.value).toBe('');
            });
            it('Clear input with empty space ', function () {
                daterangepicker = new DateRangePicker({ startDate: new Date('05/24/2017'), endDate: new Date('08/10/2017'), strictMode: true });
                daterangepicker.appendTo('#date');
                daterangepicker.inputElement.value = '     ';
                daterangepicker.inputBlurHandler();
                expect(daterangepicker.inputElement.value).toBe('');
            });
            it('Delete Partial input ', function () {
                daterangepicker = new DateRangePicker({ startDate: new Date('05/24/2017'), endDate: new Date('08/10/2017'), strictMode: true });
                daterangepicker.appendTo('#date');
                daterangepicker.inputElement.value = '5/24/2017 - 8/1';
                daterangepicker.inputBlurHandler();
                expect(daterangepicker.inputElement.value).toBe('5/24/2017 - 8/10/2017');
            });
        });
        describe('Input via attribute testing', () => {
            let daterangepicker: any;
            let ele: HTMLElement;
            beforeEach(() => {
                ele = <HTMLElement>createElement('input', { id: 'date' });
                document.body.appendChild(ele);
            });
            afterEach(() => {
                if (daterangepicker) {
                    daterangepicker.destroy();
                }
                document.body.innerHTML = '';
            });
            it('name attribute testing', () => {
                ele.setAttribute('name', 'dateRangePicker1');
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                expect(daterangepicker.firstHiddenChild.getAttribute('name')).toEqual('dateRangePicker1');
            });
            it('without name attribute testing', () => {
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                expect(daterangepicker.firstHiddenChild.getAttribute('name')).toEqual(daterangepicker.element.id);
            });
            it('style attribute testing', () => {
                ele.setAttribute('style', 'background-color:yellow');
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                expect(daterangepicker.element.getAttribute('style')).toEqual('background-color:yellow');
            });
            it('Element placeholder testing ', () => {
                ele.setAttribute('placeholder', 'Select the Date Range');
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                expect(daterangepicker.placeholder === 'Select the Date Range' && daterangepicker.element.getAttribute("placeholder") === 'Select the Date Range').toBe(true);
                expect(daterangepicker.element.getAttribute('aria-placeholder')).toBe('Select the Date Range');
            });
            it('Element Model placeholder testing ', () => {
                ele.setAttribute('placeholder', 'Select the Date Range');
                daterangepicker = new DateRangePicker({ placeholder: 'Select Range' });
                daterangepicker.appendTo('#date');
                expect(daterangepicker.placeholder === 'Select Range' && daterangepicker.element.getAttribute("placeholder") === 'Select Range').toBe(true);
                expect(daterangepicker.element.getAttribute('aria-placeholder')).toBe('Select Range');
            });
            it('Element disable testing', () => {
                ele.setAttribute('disabled', '');
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                expect(daterangepicker.enabled).toBe(false);
                expect(daterangepicker.element.hasAttribute('disabled') && daterangepicker.element.getAttribute('aria-disabled') === 'true').toBe(true);
            });
            it('Element readonly property testing', () => {
                ele.setAttribute('readonly', 'readonly');
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                expect(daterangepicker.readonly === true).toBe(true);
                expect(daterangepicker.element.hasAttribute('readonly') && daterangepicker.element.getAttribute('aria-readonly') === 'true').toBe(true);
            });
            it('Element readonly property testing', () => {
                ele.setAttribute('readonly', '');
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                expect(daterangepicker.readonly === true).toBe(true);
                expect(daterangepicker.element.hasAttribute('readonly') && daterangepicker.element.getAttribute('aria-readonly') === 'true').toBe(true);
            });
            it('Element startDate testing ', () => {
                ele.setAttribute('startDate', '02/11/2001');
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                expect(daterangepicker.startDate.toDateString() === (new Date('02/11/2001').toDateString())).toBe(true);
            });
            it('Element Model startDate testing ', () => {
                ele.setAttribute('startDate', '02/11/2001');
                daterangepicker = new DateRangePicker({ startDate: new Date('5/24/2017') });
                daterangepicker.appendTo('#date');
                expect(daterangepicker.startDate.toDateString() === (new Date('5/24/2017').toDateString())).toBe(true);
            });
            it('Element endDate testing ', () => {
                ele.setAttribute('endDate', '03/11/2001');
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                expect(daterangepicker.endDate.toDateString() === (new Date('03/11/2001').toDateString())).toBe(true);
            });
            it('Element minDays property testing', () => {
                ele.setAttribute('minDays', '4');
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                expect(daterangepicker.minDays === 4).toBe(true);
            });
            it('Element maxDays property testing', () => {
                ele.setAttribute('maxDays', '10');
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                expect(daterangepicker.maxDays === 10).toBe(true);
            });
            it('Element Model maxDays property testing', () => {
                ele.setAttribute('maxDays', '10');
                daterangepicker = new DateRangePicker({ maxDays: 15 });
                daterangepicker.appendTo('#date');
                expect(daterangepicker.maxDays === 15).toBe(true);
            });
            it('Element min property testing', () => {
                ele.setAttribute('min', '1/1/2017');
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                expect(daterangepicker.min.toDateString() === new Date('1/1/2017').toDateString()).toBe(true);
            });
            it('Element Model min property testing', () => {
                ele.setAttribute('min', '1/1/2017');
                daterangepicker = new DateRangePicker({ min: new Date('5/24/2017') });
                daterangepicker.appendTo('#date');
                expect(daterangepicker.min.toDateString() === new Date('5/24/2017').toDateString()).toBe(true);
            });
            it('Element max property testing', () => {
                ele.setAttribute('max', '12/1/2017');
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                expect(daterangepicker.max.toDateString() === new Date('12/1/2017').toDateString()).toBe(true);
            });
        });
        describe('PopUp Element Structure(Desktop)', () => {
            let daterangepicker: any;
            let months = ["January", "February", "March", "April", "May",
                "June", "July", "August", "September", "October", "November", "December", "January"];
            beforeEach(() => {
                let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
                document.body.appendChild(ele);
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                if (!daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
            });

            afterEach(() => {
                if (daterangepicker) {
                    daterangepicker.destroy();
                }
                document.body.innerHTML = '';
            });
            it('DateRange container is added', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-date-range-container') !== null).toBe(true);
            });
            it('Footer Element added', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-footer') !== null).toBe(true);
            });
            it('Footer Element added after DateRange container', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-date-range-container').nextSibling.classList.contains('e-footer')).toBe(true);
            });
            it('Action Buttons(Apply and cancel) created', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-footer').getElementsByClassName('e-cancel').length > 0 && daterangepicker.popupWrapper.querySelector('.e-footer').getElementsByClassName('e-apply').length > 0).toBe(true);
            });
            it('Start and end label created', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-start-end').getElementsByClassName('e-start-label').length > 0 && daterangepicker.popupWrapper.querySelector('.e-start-end').getElementsByClassName('e-end-label').length > 0).toBe(true);
            });
            it('Seperator element created', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-separator') !== null).toBe(true);
            });
            it('Seperator element added after range header', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-separator').previousElementSibling.classList.contains('e-range-header') !== null).toBe(true);
            });
            it('Range Indicator created', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-day-span') !== null).toBe(true);
            });
            it('Range Indicator created after start and end header', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-start-end').nextElementSibling.classList.contains('e-day-span') !== null).toBe(true);
            });
            it('two Calendars created', () => {
                expect(daterangepicker.popupWrapper.querySelectorAll('.e-calendar').length == 2).toBe(true);
            });
            it('first Calendar class added', () => {
                expect(daterangepicker.popupWrapper.querySelectorAll('.e-calendar')[0].classList.contains('e-left-calendar')).toBe(true);
            });
            it('Second Calendar class added', () => {
                expect(daterangepicker.popupWrapper.querySelectorAll('.e-calendar')[1].classList.contains('e-right-calendar')).toBe(true);
            });
            it('Left Calendar created inside left container', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-left-container').firstChild.classList.contains('e-left-calendar')).toBe(true);
            });
            it('Right Calendar created inside right container', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-right-container').firstChild.classList.contains('e-right-calendar')).toBe(true);
            });
            it('is Successive months generated ?', () => {
                expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-title').textContent.indexOf(months[new Date().getMonth()]) > -1 && daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-title').textContent.indexOf(months[new Date().getMonth() + 1]) > -1).toBe(true);
            });
            it('is icons disabled correctly in successive months?', () => {
                expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled") && daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")).toBe(false);
            });
            it('Left calendar Date Selection in calendar', () => {
                let tdCell: HTMLElement = daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar .e-content td')[10];
                tdCell.dispatchEvent(clickEvent);
                let date: Date = daterangepicker.getIdValue(null, tdCell);
                expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.globalize.formatDate(date, { type: 'date', skeleton: 'yMMMd' }) === daterangepicker.popupObj.element.querySelector('.e-start-label').text).toBe(true);
            });

            it('Other months date selection in calendar', () => {
                let tdCell: HTMLElement = daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar .e-content td')[38];
                tdCell.dispatchEvent(clickEvent);
                let date: Date = daterangepicker.getIdValue(null, tdCell);
                expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.globalize.formatDate(date, { type: 'date', skeleton: 'yMMMd' }) === daterangepicker.popupObj.element.querySelector('.e-start-label').text).toBe(true);
            });
            it('Right calendar Date Selection in calendar', () => {
                let cells: HTMLElement = daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar .e-content td')[10];
                cells.dispatchEvent(clickEvent);
                let tdCell: HTMLElement = daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar .e-content td')[10];
                tdCell.dispatchEvent(clickEvent);
                let date: Date = daterangepicker.getIdValue(null, tdCell);
                expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.globalize.formatDate(date, { type: 'date', skeleton: 'yMMMd' }) === daterangepicker.popupObj.element.querySelector('.e-end-label').text).toBe(true);
            });
            it('is header navigation disabled ?', () => {
                let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
                elements.leftCalTitle.click();
                elements.rightCalTitle.click();
                expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-content').classList.contains("e-month") && daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-content').classList.contains("e-month")).toBe(false);
            });
            it('Right Calendar Navigated next month?', () => {
                let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
                let value: string = elements.rightCalTitle.textContent;
                elements.rightCalNexticon.dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-title').text !== value).toBe(true);
            });
            it('Left Calendar Navigated previous month?', () => {
                let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
                let value: string = elements.leftCalTitle.textContent;
                elements.leftCalpreviousIcon.dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-title').text !== value).toBe(true);
            });
            it('is calendar rendered with given value ?', () => {
                daterangepicker.destroy();
                daterangepicker = createControl({ startDate: new Date("07/05/2017"), endDate: new Date("05/05/2018") });
                expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-title').textContent.indexOf("July") > -1 && daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-title').textContent.indexOf("May 2018") > -1).toBe(true);
            });
            it('Setting min range to be selected ?', () => {
                daterangepicker.destroy();
                daterangepicker = createControl({ startDate: new Date("07/06/2017"), endDate: new Date("08/06/2017"), min: new Date("05/05/2017") });
                document.querySelector('.e-left-calendar .e-header .e-date-icon-prev').dispatchEvent(clickEvent);
                document.querySelector('.e-left-calendar .e-header .e-date-icon-prev').dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")).toBe(true);
            });
            it('Setting max range to be selected ?', () => {
                daterangepicker.destroy();
                daterangepicker = createControl({ startDate: new Date("07/06/2017"), endDate: new Date("08/06/2017"), max: new Date("10/05/2017") });
                let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
                document.querySelector('.e-right-calendar .e-header .e-date-icon-next').dispatchEvent(clickEvent);
                document.querySelector('.e-right-calendar .e-header .e-date-icon-next').dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")).toBe(true);
            });
            it('range restricted while navigating next left calendar ?', () => {
                daterangepicker = createControl({ startDate: new Date("07/06/2017"), endDate: new Date("10/05/2017") });
                let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
                document.querySelector('.e-left-calendar .e-header .e-date-icon-next').dispatchEvent(clickEvent);
                document.querySelector('.e-left-calendar .e-header .e-date-icon-next').dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")).toBe(false);
            });
            it('range restricted while navigating previous left calendar ?', () => {
                daterangepicker = createControl({ startDate: new Date("06/06/2017"), endDate: new Date("08/05/2017"), min: new Date("04/05/2017") });
                let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
                document.querySelector('.e-left-calendar .e-header .e-date-icon-prev').dispatchEvent(clickEvent);
                document.querySelector('.e-left-calendar .e-header .e-date-icon-prev').dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")).toBe(true);
            });
            it('Apply button enabled ?', () => {
                daterangepicker.destroy();
                daterangepicker = createControl({ startDate: new Date("07/05/2017"), endDate: new Date("05/05/2018") });
                expect(daterangepicker.applyButton.disabled === false).toBe(true);
            });
            it('Apply button disabled ?', () => {
                expect(daterangepicker.applyButton.disabled === true).toBe(true);
            });
            it('Apply button disabled after start date selected ?', () => {
                daterangepicker = createControl({ startDate: new Date("07/05/2017") });
                expect(daterangepicker.applyButton.disabled === true).toBe(true);
            });
            it('Apply button enabled after range selection', () => {
                let cells: HTMLElement = daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar .e-content td')[10];
                cells.dispatchEvent(clickEvent);
                expect(daterangepicker.applyButton.disabled === true).toBe(true);
                let tdCell: HTMLElement = daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar .e-content td')[10];
                tdCell.dispatchEvent(clickEvent);
                expect(daterangepicker.applyButton.disabled === false).toBe(true);
            });
            it('Apply button disabled after clear the range selection', () => {
                let cells: HTMLElement = daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar .e-content td')[10];
                cells.dispatchEvent(clickEvent);
                expect(daterangepicker.applyButton.disabled === true).toBe(true);
                let tdCell: HTMLElement = daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar .e-content td')[10];
                tdCell.dispatchEvent(clickEvent);
                expect(daterangepicker.applyButton.disabled === false).toBe(true);
                daterangepicker.element.focus();
                let clearCell: HTMLElement = daterangepicker.inputWrapper.container.querySelectorAll('.e-clear-icon')[0];
                clearCell.dispatchEvent(clickEvent);
                expect(daterangepicker.applyButton.disabled === true).toBe(true);
            });
            it('Apply button enabled with set value ?', () => {
                daterangepicker = createControl({ value: [new Date('02/11/2017'), new Date('03/11/2017')] });
                expect(daterangepicker.applyButton.disabled === false).toBe(true);
            });
            it('Rtl enabled ?', () => {
                daterangepicker.destroy();
                daterangepicker = createControl({ enableRtl: true });
                expect(daterangepicker.enableRtl === true && daterangepicker.popupObj.element.querySelector('.e-calendar.e-rtl') !== null).toBe(true);
                expect(daterangepicker.popupObj.element.classList.contains('e-rtl')).toBe(true);
            });
            it('Rtl enabled -dataBind ?', () => {
                daterangepicker.enableRtl = true;
                daterangepicker.dataBind();
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                expect(daterangepicker.enableRtl === true && daterangepicker.popupObj.element.querySelector('.e-calendar.e-rtl') !== null).toBe(true);
                expect(daterangepicker.popupObj.element.classList.contains('e-rtl')).toBe(true);
            });
            it('Header title with out of range test case', () => {
                daterangepicker = createControl({ startDate: new Date("07/06/2017"), endDate: new Date("08/06/9999") });
                daterangepicker.show();
                expect(daterangepicker.popupObj.element.querySelector('.e-start-label').textContent).toBe("Start Date");
                expect(daterangepicker.popupObj.element.querySelector('.e-end-label').textContent).toBe("End Date");
                expect(daterangepicker.popupObj.element.querySelector('.e-day-span').textContent).toBe("Selected Days");
            });
            it('StartDate and endDate in out of range test case', () => {
                daterangepicker = createControl({ startDate: new Date("07/06/2017"), endDate: new Date("08/06/9999") });
                expect(daterangepicker.startDate.toDateString() === (new Date("07/06/2017").toDateString())).toBe(true);
                expect(daterangepicker.endDate.toDateString() === (new Date("08/06/9999").toDateString())).toBe(true);
                expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            });
        });
        describe('PopUp Presets Element Structure(Desktop)', () => {
            let daterangepicker: any;
            beforeEach(() => {
                let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
                document.body.appendChild(ele);
                daterangepicker = new DateRangePicker({ startDate: new Date(), endDate: new Date(), presets: [{ label: 'Today', start: new Date(), end: new Date() }, { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }] });
                daterangepicker.appendTo('#date');
                if (!daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
            });

            afterEach(() => {
                if (daterangepicker) {
                    daterangepicker.destroy();
                }
                document.body.innerHTML = '';
            });
            it('preset class Element created', () => {
                expect(daterangepicker.popupObj.element.querySelector('.e-presets') !== null).toBe(true);
            });
            it('list item class Element added', () => {
                expect(daterangepicker.popupObj.element.querySelectorAll('.e-list-item').length === 3).toBe(true);
            });
            it('preset list only created ?', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-date-range-container') === null).toBe(true);
            });
            it('preset list li Element created', () => {
                expect(daterangepicker.popupObj.element.querySelector('.e-presets').getElementsByTagName('li').length == 3).toBe(true);
            });
            it('preset list Custom LI Element created', () => {
                expect(daterangepicker.popupObj.element.querySelector('.e-presets  li:last-child').textContent.indexOf('Custom') > -1).toBe(true);
            });
            it('Presets custom ranges selection', () => {
                <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:last-child')).click();
                expect(daterangepicker.popupObj.element.querySelector('.e-date-range-container') !== null && daterangepicker.popupObj.element.querySelectorAll('.e-calendar').length > 0).toBe(true);
            });
            it('Presets custom ranges opened again', () => {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child').classList.contains('e-active')).toBe(true);
                <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:last-child')).click();
                expect(daterangepicker.popupObj.element.querySelector('.e-date-range-container') !== null && daterangepicker.popupObj.element.querySelectorAll('.e-calendar').length > 0).toBe(true);
                <HTMLElement>(daterangepicker.cancelButton.element).click();
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:last-child')).click();
                expect(daterangepicker.popupObj.element.querySelector('.e-presets li:last-child').classList.contains('e-active')).toBe(true);
            });
            it('Preset range selection', () => {
                <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
                let startDate: string = daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
                let endDate: string = daterangepicker.globalize.formatDate(daterangepicker.endDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
                expect(daterangepicker.isPopupOpen() === true && daterangepicker.element.value === startDate + ' - ' + endDate).toBe(true);
            });
            it('is preset only created while opening again', () => {
                <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
                if (!daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
                expect(daterangepicker.popupObj.element.querySelector('.e-date-range-container') === null && daterangepicker.popupObj.element.querySelector('.e-presets') !== null).toBe(true);
                expect(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child').classList.contains('e-active')).toBe(true);

            });
        });

        describe("Preset", () => {
            let daterangepicker: any;
            beforeEach(() => {
                let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
                document.body.appendChild(ele);
                daterangepicker = new DateRangePicker({
                    startDate: new Date(), endDate: new Date(),
                    presets: [{ label: 'Today', start: new Date(), end: new Date() },
                    { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() },
                    { label: 'Today', start: new Date(), end: new Date() }, { label: 'Test', start: new Date('03/03/2017 2:00'), end: new Date('04/03/2017 2:00') }]
                });
                daterangepicker.appendTo('#date');
                if (!daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
            });

            afterEach(() => {
                if (daterangepicker) {
                    daterangepicker.destroy();
                }
                document.body.innerHTML = '';
            });
            it('selection with datetime support in higher resolution', () => {
                expect(daterangepicker.popupObj.element.querySelector('.e-presets li.e-active').classList.contains('e-active')).toBe(true);
                expect(document.querySelector('.e-presets li:first-child').textContent).toBe("Today");
                daterangepicker.hide();
                daterangepicker.startDate = new Date('03/03/2017 2:00');
                daterangepicker.endDate = new Date('04/03/2017 2:00');
                daterangepicker.dataBind();
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-date-range-container') === null && daterangepicker.popupObj.element.querySelectorAll('.e-calendar').length == 0).toBe(true);
                expect(document.querySelector('.e-presets li.e-active').textContent).toBe("Test");
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).click();
                daterangepicker.startDate = new Date('3/3/2017');
                daterangepicker.dataBind();
                daterangepicker.endDate = new Date('3/10/2017');
                daterangepicker.dataBind();
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                expect(document.querySelector('.e-presets li.e-active').textContent).toBe("Custom Range");
                expect(daterangepicker.popupObj.element.querySelector('.e-date-range-container') !== null && daterangepicker.popupObj.element.querySelectorAll('.e-calendar').length > 0).toBe(true);
                daterangepicker.hide();
                daterangepicker.startDate = new Date('03/03/2017 2:00');
                daterangepicker.endDate = new Date('04/03/2017 2:00');
                daterangepicker.dataBind();
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-date-range-container') === null && daterangepicker.popupObj.element.querySelectorAll('.e-calendar').length == 0).toBe(true);
                expect(document.querySelector('.e-presets li.e-active').textContent).toBe("Test");
            });


        });

        describe("Preset", () => {
            let daterangepicker: any;
            beforeEach(() => {
                let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
                document.body.appendChild(ele);
                daterangepicker = new DateRangePicker({
                    presets:
                        [{ label: 'Today', start: new Date(), end: new Date() },
                        { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() },
                        { label: 'Today', start: new Date(), end: new Date() }, { label: 'Test', start: new Date('03/03/2017 2:00'), end: new Date('04/03/2017 2:00') }]
                });
                daterangepicker.appendTo('#date');
                daterangepicker.isMobile = true;
                daterangepicker.refreshControl();
                if (!daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
            });

            afterEach(() => {
                if (daterangepicker) {
                    daterangepicker.destroy();
                }
                document.body.innerHTML = '';


            });
            it('selection with datetime support in lower resolution', () => {
                expect(document.querySelector('.e-presets li.e-active').textContent).toBe("Custom Range");
                expect(daterangepicker.popupObj.element.querySelector('.e-date-range-container') === null && daterangepicker.popupObj.element.querySelectorAll('.e-calendar').length == 0).toBe(true);
                daterangepicker.hide();
                daterangepicker.startDate = new Date('03/03/2017 2:00');
                daterangepicker.endDate = new Date('04/03/2017 2:00');
                daterangepicker.dataBind();
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-date-range-container') === null && daterangepicker.popupObj.element.querySelectorAll('.e-calendar').length == 0).toBe(true);
                expect(document.querySelector('.e-presets li.e-active').textContent).toBe("Test");
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).click();
                daterangepicker.startDate = new Date('3/2/2017');
                daterangepicker.dataBind();
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                expect(document.querySelector('.e-presets li.e-active').textContent).toBe("Custom Range");
                (<HTMLElement>document.querySelector('.e-presets li.e-active')).click()
                expect(daterangepicker.popupObj.element.querySelector('.e-date-range-container') !== null && daterangepicker.popupObj.element.querySelectorAll('.e-calendar').length > 0).toBe(true);
                daterangepicker.hide();
                daterangepicker.startDate = new Date('03/03/2017 2:00');
                daterangepicker.endDate = new Date('04/03/2017 2:00');
                daterangepicker.dataBind();
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-date-range-container') === null && daterangepicker.popupObj.element.querySelectorAll('.e-calendar').length == 0).toBe(true);
                expect(document.querySelector('.e-presets li.e-active').textContent).toBe("Test");
            });
        });
        describe('PopUp Element Structure(Device)', () => {
            let daterangepicker: any;
            let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            beforeEach(() => {
                let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
                document.body.appendChild(ele);
                daterangepicker = new DateRangePicker();
                daterangepicker.appendTo('#date');
                daterangepicker.isMobile = true;
                daterangepicker.refreshControl();
                if (!daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
            });
            afterEach(() => {
                if (daterangepicker) {
                    daterangepicker.destroy();
                }
                document.body.innerHTML = '';
            });
            it('Device class added', () => {
                expect(daterangepicker.popupWrapper.classList.contains('.e-device') !== null).toBe(true);
            });
            it('DateRange container is added', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-device .e-date-range-container') !== null).toBe(true);
            });
            it('Footer Element added', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-device .e-footer') !== null).toBe(true);
            });
            it('Footer Element added after DateRange container', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-device .e-date-range-container').nextElementSibling.classList.contains('e-footer')).toBe(true);
            });
            it('Action Buttons(Apply and cancel) created', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-device .e-footer').getElementsByClassName('e-cancel').length > 0 && daterangepicker.popupWrapper.querySelector('.e-footer').getElementsByClassName('e-apply').length > 0).toBe(true);
            });
            it('Buttons(start and and) created', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-device .e-start-btn') !== null && daterangepicker.popupWrapper.querySelector('.e-end-btn') !== null).toBe(true);
                expect(daterangepicker.popupObj.element.querySelector('.e-start-btn').classList.contains('e-active') && !daterangepicker.popupObj.element.querySelector('.e-end-btn').classList.contains('e-active')).toBe(true);
            });
            it('Seperator element created', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-device .e-separator') !== null).toBe(true);
            });
            it('Seperator element added after range header', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-device .e-separator').previousSibling.classList.contains('e-range-header') !== null).toBe(true);
            });
            it('Range Indicator created', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-device .e-day-span') !== null).toBe(true);
            });
            it('Only one calendar created ?', () => {
                expect(daterangepicker.popupWrapper.querySelectorAll('.e-device .e-calendar').length == 1).toBe(true);
            });
            it('is header navigation disabled ?', () => {
                <HTMLElement>(daterangepicker.popupWrapper.querySelector('.e-device .e-calendar .e-title')).click();
                expect(daterangepicker.popupObj.element.querySelector('.e-device .e-calendar .e-content').classList.contains("e-month")).toBe(false);
            });
            it('Calendar Navigated next month?', () => {
                let value: string = daterangepicker.popupWrapper.querySelector('.e-device .e-calendar .e-title').text;
                <HTMLElement>(daterangepicker.popupWrapper.querySelector('.e-device .e-calendar .e-next')).dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-device .e-calendar .e-title').textContent !== value).toBe(true);
            });
            it('Calendar Navigated previous month?', () => {
                let value: string = daterangepicker.popupWrapper.querySelector('.e-device .e-calendar .e-title').text;
                <HTMLElement>(daterangepicker.popupWrapper.querySelector('.e-device .e-calendar .e-prev')).dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-device .e-calendar .e-title').textContent !== value).toBe(true);
            });
            it('is calendar rendered with given value ?', () => {
                daterangepicker.destroy();
                daterangepicker = createControl({ startDate: new Date("07/05/2017"), endDate: new Date("05/05/2018"), zIndex: 1500 }, true);
                expect(daterangepicker.popupObj.element.querySelector('.e-device .e-calendar .e-title').textContent.indexOf("July") > -1).toBe(true);
                document.querySelector('.e-device .e-calendar .e-prev').dispatchEvent(clickEvent);
            });
            it('Setting min range to be selected ?', () => {
                daterangepicker.destroy();
                daterangepicker = createControl({ startDate: new Date("07/06/2017"), endDate: new Date("08/06/2017"), min: new Date("05/05/2017") }, true);
                let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
                elements.previousIcon.dispatchEvent(clickEvent);
                elements.previousIcon.dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-device .e-calendar .e-prev').classList.contains("e-disabled")).toBe(true);
            });
            it('Setting max range to be selected ?', () => {
                daterangepicker.destroy();
                daterangepicker = createControl({ startDate: new Date("07/06/2017"), endDate: new Date("08/06/2017"), max: new Date("09/05/2017") }, true
                );
                let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
                elements.nextIcon.dispatchEvent(clickEvent);
                elements.nextIcon.dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-device .e-calendar .e-next').classList.contains("e-disabled")).toBe(true);
            });
            it('Apply button enabled ?', () => {
                daterangepicker.destroy();
                daterangepicker = createControl({ startDate: new Date("07/05/2017"), endDate: new Date("05/05/2018") }, true);
                expect(daterangepicker.applyButton.disabled === false).toBe(true);
            });
            it('Apply button disabled ?', () => {
                expect(daterangepicker.applyButton.disabled === true).toBe(true);
            });
            it('Apply button enabled after range selection', () => {
                let cells: HTMLElement = daterangepicker.popupObj.element.querySelectorAll('.e-calendar .e-content td')[10];
                cells.dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.applyButton.disabled === true).toBe(true);
                let tdCell: HTMLElement = daterangepicker.popupObj.element.querySelectorAll('.e-calendar .e-content td')[15];
                tdCell.dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-end-date') !== null && daterangepicker.applyButton.disabled === false).toBe(true);
            });
            it('Header Button state - end disabled', () => {
                daterangepicker.destroy();
                daterangepicker = createControl({}, true);
                expect(daterangepicker.popupObj.element.querySelector('.e-device .e-end-btn').hasAttribute('disabled')).toBe(true);
            });
            it('Header Button state - active class for start', () => {
                daterangepicker.destroy();
                daterangepicker = createControl({ startDate: new Date('3/4/2017') }, true);
                expect(daterangepicker.popupObj.element.querySelector('.e-device .e-end-btn').hasAttribute('disabled')).toBe(false);
                expect(daterangepicker.popupObj.element.querySelector('.e-device .e-end-btn').classList.contains('e-active')).toBe(true);
            });
            it('Device end header click', () => {
                daterangepicker.destroy();
                daterangepicker = createControl({ startDate: new Date("07/06/2017"), endDate: new Date("08/06/2017"), min: new Date("05/05/2017") }, true);
                <HTMLElement>(daterangepicker.popupWrapper.querySelector('.e-device .e-end-btn')).click();
                expect(daterangepicker.popupObj.element.querySelector('.e-device .e-end-date') !== null && daterangepicker.popupObj.element.querySelector('.e-device .e-calendar .e-start-date') === null).toBe(true);
            });
            it('Device start header click', () => {
                daterangepicker.destroy();
                daterangepicker = createControl({ startDate: new Date("07/06/2017"), endDate: new Date("08/06/2017"), min: new Date("05/05/2017") }, true);
                <HTMLElement>(daterangepicker.popupWrapper.querySelector('.e-device .e-end-btn')).click();
                expect(daterangepicker.popupObj.element.querySelector('.e-device .e-calendar .e-end-date') !== null && daterangepicker.popupObj.element.querySelector('.e-device .e-calendar .e-start-date') === null).toBe(true);
                <HTMLElement>(daterangepicker.popupWrapper.querySelector('.e-device .e-start-btn')).click();
                expect(daterangepicker.popupObj.element.querySelector('.e-device .e-calendar .e-end-date') === null && daterangepicker.popupObj.element.querySelector('.e-device .e-calendar .e-start-date') !== null).toBe(true);
            });
            it('Rtl enabled ?', () => {
                daterangepicker.destroy();
                daterangepicker = createControl({ enableRtl: true }, true);
                expect(daterangepicker.enableRtl === true && daterangepicker.popupObj.element.querySelector('.e-calendar.e-rtl') !== null).toBe(true);
                expect(daterangepicker.popupObj.element.classList.contains('e-rtl')).toBe(true);
            });
            it('Rtl enabled - dataBind ?', () => {
                daterangepicker.enableRtl = true;
                daterangepicker.dataBind();
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                expect(daterangepicker.enableRtl === true && daterangepicker.popupObj.element.querySelector('.e-calendar.e-rtl') !== null).toBe(true);
                expect(daterangepicker.popupObj.element.classList.contains('e-rtl')).toBe(true);
            });
            it('Modal element added?', () => {
                expect(document.body.querySelector('.e-range-modal') !== null).toBe(true);
            });
            it('Modal element Removed?', () => {
                <HTMLElement>(daterangepicker.cancelButton.element).click();
                expect(document.body.querySelector('.e-range-modal') === null).toBe(true);
            });
        });

        describe('Header Element (Device)', () => {
            let daterangepicker: any;
            let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            beforeEach(() => {
                let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
                document.body.appendChild(ele);

            });
            afterEach(() => {
                if (daterangepicker) {
                    daterangepicker.destroy();
                }
                document.body.innerHTML = '';
            });
            it('Disabled Date in range with header update in endDate disabled test case', function () {
                daterangepicker = new DateRangePicker({
                    startDate: new Date('1/1/2017'), endDate: new Date('1/3/2017'),
                    renderDayCell: function (args: any): void {
                        if (+args.date === +new Date('1/1/2017')) {
                            args.isDisabled = true;
                        }
                    }
                });
                daterangepicker.appendTo('#date');
                daterangepicker.isMobile = true;
                daterangepicker.refreshControl();
                if (!daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
                expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
                expect(+daterangepicker.startDate).toBe(+new Date('1/1/2017'));
                expect(+daterangepicker.endDate).toBe(+new Date('1/3/2017'));
                expect(daterangepicker.popupObj.element.querySelector('.e-start-btn').textContent).toBe("Start Date");
                expect(daterangepicker.popupObj.element.querySelector('.e-end-btn').textContent).toBe("End Date");
                expect(daterangepicker.popupObj.element.querySelector('.e-day-span').textContent).toBe("Selected Days");
            });
            it('Disabled Date in range with header update in startDate disabled test case', function () {
                daterangepicker = new DateRangePicker({
                    startDate: new Date('1/1/2017'), endDate: new Date('1/3/2017'),
                    renderDayCell: function (args: any): void {
                        if (+args.date === +new Date('1/3/2017')) {
                            args.isDisabled = true;
                        }
                    }
                });
                daterangepicker.appendTo('#date');
                daterangepicker.isMobile = true;
                daterangepicker.refreshControl();
                if (!daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
                expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
                expect(+daterangepicker.startDate).toBe(+new Date('1/1/2017'));
                expect(+daterangepicker.endDate).toBe(+new Date('1/3/2017'));
                expect(daterangepicker.popupObj.element.querySelector('.e-start-btn').textContent).toBe("Start Date");
                expect(daterangepicker.popupObj.element.querySelector('.e-end-btn').textContent).toBe("End Date");
                expect(daterangepicker.popupObj.element.querySelector('.e-day-span').textContent).toBe("Selected Days");
            });
        });
        describe('PopUp Presets Element Structure(Device)', () => {
            let daterangepicker: any;
            beforeEach(() => {
                let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
                document.body.appendChild(ele);
                daterangepicker = new DateRangePicker({ presets: [{ label: 'Today', start: new Date(), end: new Date() }, { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }] });
                daterangepicker.appendTo('#date');
                daterangepicker.isMobile = true;
                daterangepicker.refreshControl();
                if (!daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
            });
            afterEach(() => {
                if (daterangepicker) {
                    daterangepicker.destroy();
                }
                document.body.innerHTML = '';
            });
            it('device class Element created', () => {
                expect(daterangepicker.popupObj.element.classList.contains('e-device')).toBe(true);
            });
            it('preset class Element created', () => {
                expect(daterangepicker.popupObj.element.querySelector('.e-device .e-presets') !== null).toBe(true);
            });
            it('list item class Element added', () => {
                expect(daterangepicker.popupObj.element.querySelectorAll('.e-list-item').length === 3).toBe(true);
            });
            it('preset list only created ?', () => {
                expect(daterangepicker.popupWrapper.querySelector('.e-date-range-container') === null).toBe(true);
            });
            it('preset list li Element created', () => {
                expect(daterangepicker.popupObj.element.querySelector('.e-presets').getElementsByTagName('li').length == 3).toBe(true);
            });
            it('preset list Custom LI Element created', () => {
                expect(daterangepicker.popupObj.element.querySelector('.e-presets  li:last-child').textContent.indexOf('Custom') > -1).toBe(true);
            });
            it('Presets custom ranges selection', () => {
                <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:last-child')).click();
                expect(daterangepicker.popupObj.element.querySelector('.e-date-range-container') !== null && daterangepicker.popupObj.element.querySelectorAll('.e-calendar').length > 0).toBe(true);
            });
            it('Presets custom ranges selection opened again', () => {
                <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:last-child')).click();
                expect(daterangepicker.popupObj.element.querySelector('.e-date-range-container') !== null && daterangepicker.popupObj.element.querySelectorAll('.e-calendar').length > 0).toBe(true);
                <HTMLElement>(daterangepicker.cancelButton.element).click();
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                expect(daterangepicker.popupObj.element.querySelector('.e-date-range-container') === null && daterangepicker.popupObj.element.querySelectorAll('.e-calendar').length === 0).toBe(true);
                expect(daterangepicker.popupObj.element.querySelector('.e-presets li:last-child').classList.contains('e-active')).toBe(true);
            });
            it('Preset range selection', () => {
                <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
                let startDate: string = daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
                let endDate: string = daterangepicker.globalize.formatDate(daterangepicker.endDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
                expect(daterangepicker.isPopupOpen() === false && daterangepicker.element.value === startDate + ' - ' + endDate).toBe(true);
            });
            it('is preset only created while opening again', () => {
                <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
                if (!daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
                expect(daterangepicker.popupObj.element.querySelector('.e-date-range-container') === null && daterangepicker.popupObj.element.querySelector('.e-presets') !== null).toBe(true);
                expect(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child').classList.contains('e-active')).toBe(true);
            });
            it('Modal element added?', () => {
                expect(document.body.querySelector('.e-range-modal') === null).toBe(true);
            });
            it('Modal element added in custom range?', () => {
                <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:last-child')).click();
                expect(document.body.querySelector('.e-range-modal') !== null).toBe(true);
            });
        });
    });
    describe('multiple attributes testing', () => {
        let daterangepicker: any;
        let ele: HTMLElement;
        beforeEach(() => {
            ele = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('mindays and startdate desktop test case ', () => {
            daterangepicker = new DateRangePicker({
                minDays: 5,
                startDate: new Date('3/6/2018')
            });
            daterangepicker.appendTo('#date');
            (<HTMLElement>(document.getElementsByClassName('  e-input-group-icon e-range-icon e-icons')[0])).dispatchEvent(clickEvent);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-selected')[0]);
            let nextCell: HTMLElement = <HTMLElement>(selectedCell.nextElementSibling);
            expect(nextCell.classList.contains('e-date-disabled')).toBe(true);
            for (let i = daterangepicker.minDays - 3; i > 0; i--) {
                nextCell = <HTMLElement>(nextCell.nextElementSibling);
                expect(nextCell.classList.contains('e-date-disabled')).toBe(true);
            };
        });
        it('mindays and startdate mobile test case ', () => {
            daterangepicker = new DateRangePicker({
                minDays: 5,
                startDate: new Date('3/6/2018')
            });
            daterangepicker.appendTo('#date');
            daterangepicker.isMobile = true;
            daterangepicker.refreshControl();
            (<HTMLElement>(document.getElementsByClassName('  e-input-group-icon e-range-icon e-icons')[0])).dispatchEvent(clickEvent);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-selected')[0]);
            let previousCell: HTMLElement = <HTMLElement>(selectedCell.previousElementSibling);
            let nextCell: HTMLElement = <HTMLElement>(selectedCell.nextElementSibling);
            expect(previousCell.classList.contains('e-date-disabled')).toBe(true);
            expect(nextCell.classList.contains('e-date-disabled')).toBe(true);
            for (let i = daterangepicker.minDays - 3; i > 0; i--) {
                nextCell = <HTMLElement>(nextCell.nextElementSibling);
                expect(nextCell.classList.contains('e-date-disabled')).toBe(true);
            };
            let startButtonelement = <HTMLElement>document.getElementsByClassName(' e-start-btn ')[0];
            let endButtonelement = <HTMLElement>document.getElementsByClassName(' e-end-btn ')[0];
            expect(startButtonelement.innerText).toBe('Mar 6, 2018');
            expect(startButtonelement.classList.contains('e-active')).toBe(false);
            expect(endButtonelement.classList.contains('e-active')).toBe(true);
        });
        it('mindays,startdate,endDate mobile test case ', () => {
            daterangepicker = new DateRangePicker({
                minDays: 5,
                startDate: new Date('3/6/2018'),
                endDate: new Date('3/13/2018')
            });
            daterangepicker.appendTo('#date');
            daterangepicker.isMobile = true;
            daterangepicker.refreshControl();
            (<HTMLElement>(document.getElementsByClassName('  e-input-group-icon e-range-icon e-icons')[0])).dispatchEvent(clickEvent);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-selected')[0]);
            let nextCell: HTMLElement = <HTMLElement>(selectedCell.nextElementSibling);
            expect(nextCell.classList.contains('e-date-disabled')).toBe(false);
            let startButtonelement = <HTMLElement>document.getElementsByClassName(' e-start-btn ')[0];
            let endButtonelement = <HTMLElement>document.getElementsByClassName(' e-end-btn ')[0];
            expect(startButtonelement.innerText).toBe('Mar 6, 2018');
            expect(startButtonelement.classList.contains('e-active')).toBe(true);
            expect(endButtonelement.innerText).toBe('Mar 13, 2018');
            expect(endButtonelement.classList.contains('e-active')).toBe(false);
        });
    });




    describe('Range Selection - Model', () => {
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = createControl({ startDate: new Date('05/24/2017'), endDate: new Date('08/10/2017') });
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Selection maintained while navigating(end)', () => {
            let nextEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                currentTarget: document.querySelector('.e-right-calendar .e-header .e-next')
                , target: document.querySelector('.e-right-calendar .e-header .e-next')
            };
            let prevEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                currentTarget: document.querySelector('.e-right-calendar .e-header .e-prev'),
                target: document.querySelector('.e-right-calendar .e-header .e-prev')
            };
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            daterangepicker.navNextMonth(nextEventArgs);
            daterangepicker.navPrevMonth(prevEventArgs);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-end-date').length > 0).toBe(true);
        });

        it('Selection through model', () => {
            let startDate: string = daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(daterangepicker.endDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('Start Date Selected correctly', () => {
            let startValue: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-start-date'));
            expect(+startValue === +daterangepicker.startDate).toBe(true);
        });
        it('End Date Selected correctly', () => {
            let endValue: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-end-date'));
            expect(+endValue === +daterangepicker.endDate).toBe(true);
        });
        it('Start and End header', () => {
            let startValue: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-start-date'));
            let endValue: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-end-date'));
            expect(daterangepicker.popupObj.element.querySelector('.e-start-label').text === daterangepicker.globalize.formatDate(startValue, { type: 'date', skeleton: 'yMMMd' }) && daterangepicker.popupObj.element.querySelector('.e-end-label').text === daterangepicker.globalize.formatDate(endValue, { type: 'date', skeleton: 'yMMMd' })).toBe(true);
        });
        it('hover Class added', () => {
            let cells: HTMLElement[] = daterangepicker.popupObj.element.querySelectorAll('.e-range-hover');
            expect(cells.length > 0).toBe(true);
        });

        it('Selection maintained while navigating(start)', () => {
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            elements.leftCalpreviousIcon.dispatchEvent(clickEvent);
            elements.leftCalNexticon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length > 0).toBe(true);
        });
        it('Selection maintained while navigating(hover)', () => {
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            elements.leftCalpreviousIcon.dispatchEvent(clickEvent);
            elements.leftCalNexticon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-range-hover').length > 0).toBe(true);
        });
        it('Selection Cleared', () => {
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]).dispatchEvent(clickEvent);
            expect(daterangepicker.applyButton.disabled == true).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-range-hover').length == 0 && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('Range indicator', () => {
            expect(daterangepicker.popupObj.element.querySelector('.e-day-span').textContent === '79 Days').toBe(true);
        });
        it('seperator value updated', () => {
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('05/24/2017'), separator: '+', endDate: new Date('08/10/2017') });
            expect(daterangepicker.element.value.indexOf(daterangepicker.separator) > -1).toBe(true);
        });
        it('start date only - start Month Opened', () => {
            daterangepicker.element.value = '';
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('05/24/2017') });
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-title').textContent.indexOf('May') > -1 && daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-start-date') !== null).toBe(true);
            expect(daterangepicker.inputElement.value === '').toBe(true);
            expect(daterangepicker.endDate === null && +daterangepicker.startDate === +new Date('05/24/2017')).toBe(true);
        });
        it('end Date only', () => {
            daterangepicker.element.value = '';
            daterangepicker.destroy();
            daterangepicker = createControl({ endDate: new Date('08/10/2017') });
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(daterangepicker.inputElement.value === '').toBe(true);
            expect(+daterangepicker.endDate === +new Date('08/10/2017') && daterangepicker.startDate === null).toBe(true);
        });
        it('Range updated in input', () => {
            daterangepicker.element.value = '1/3/2017 - 11/3/2017 ';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            expect(+new Date('1/3/2017') === +daterangepicker.startDate && +new Date('11/3/2017') === +daterangepicker.endDate).toBe(true);
            expect(daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' }) === '1/3/2017').toBe(true);
        });
        it('Range updated in calendar', () => {
            daterangepicker.element.value = '1/3/2017 - 11/3/2017 ';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            daterangepicker.hide();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            let startDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-start-date'));
            let endDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-end-date'));
            expect(daterangepicker.globalize.formatDate(startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' }) === '1/3/2017' && daterangepicker.globalize.formatDate(endDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' }) === '11/3/2017').toBe(true);
            expect(+daterangepicker.startDate === +startDate && +daterangepicker.endDate === +endDate).toBe(true);
        });
        it('error class for seperator', () => {
            daterangepicker.element.value = '3/3/2017 + 11/3/2017 ';
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            daterangepicker.preventBlur = false;
            clickEvent.initEvent('blur', true, true);
            daterangepicker.element.dispatchEvent(clickEvent);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('error class for invalid date(Date)', () => {
            daterangepicker.element.value = '3/3/2017 - 14/3/2017 '; // month -14
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            daterangepicker.hide();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.endDate === null && daterangepicker.startDate === null).toBe(true);
        });
        it('error class for invalid date(string)', () => {
            daterangepicker.element.value = 'start-end';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            daterangepicker.hide();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.element.value === 'start-end').toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.endDate === null && daterangepicker.startDate === null).toBe(true);
        });
        it('error class removed for correct date(enter)', () => {
            daterangepicker.element.value = '3/3/2017 - 14/3/2017 '; // month -14
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            daterangepicker.element.value = '3/3/2017 - 4/3/2017 '; // month -14
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
        });
        it('error class removed for correct date(dataBind)', () => {
            daterangepicker.element.value = '';
            daterangepicker.startDate = new Date('5/1/2017');
            daterangepicker.endDate = new Date('1/1/2017');
            daterangepicker.dataBind();
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            daterangepicker.startDate = new Date('5/1/2017');
            daterangepicker.endDate = new Date('6/1/2017');
            daterangepicker.dataBind();
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
        });
        it('Date moved to next month ?', () => {
            daterangepicker.element.value = '8/1/2017 - 9/31/2017'; //No 31 in sep so moved to dec 1
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            daterangepicker.hide();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            // let endDate: Date = daterangepicker.getIdValue(null,daterangepicker.popupObj.element.querySelector('.e-end-date'));
            // expect(daterangepicker.globalize.formatDate(endDate,{format: daterangepicker.format,type:'date',skeleton:'yMd'}) === '10/1/2017').toBe(true);
            expect(daterangepicker.endDate === null).toBe(true);
        });
        it('error class for startDate greater than end date', () => {
            daterangepicker.element.value = '';
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('09/24/2017'), endDate: new Date('08/10/2017') });
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(+daterangepicker.endDate === +new Date('08/10/2017') && +daterangepicker.startDate === +new Date('09/24/2017')).toBe(true);
            expect(daterangepicker.element.value === '9/24/2017 - 8/10/2017').toBe(true);
        });
        it('Same date for start and end', () => {
            daterangepicker.element.value = '';
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('09/24/2017'), endDate: new Date('09/24/2017') });
            expect(+daterangepicker.startDate === +daterangepicker.endDate).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date').classList.contains('e-start-date')).toBe(true);
        });
        it('error class for empty date', () => {
            daterangepicker.element.value = ' ';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            daterangepicker.hide();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.endDate === null && daterangepicker.startDate === null).toBe(true);
        });
        it('Invalid Date Model', () => {
            daterangepicker.element.value = '';
            daterangepicker = createControl({ startDate: new Date('fff'), endDate: new Date('08/10/2017') });
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(+daterangepicker.endDate === +new Date('08/10/2017') && daterangepicker.startDate === null).toBe(true);
        });

        it('error class for startDate greater than end date(enter)', () => {
            daterangepicker.element.value = '3/3/2017 - 1/3/2017 ';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            daterangepicker.hide();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(+daterangepicker.endDate === +new Date('1/3/2017') && +daterangepicker.startDate === +new Date('3/3/2017')).toBe(true);
        });
        it('error class for startDate greater than end date(Set Model)', () => {
            daterangepicker.element.value = '';
            daterangepicker.startDate = new Date('5/24/2017');
            daterangepicker.dataBind();
            daterangepicker.endDate = new Date('1/1/2017');
            daterangepicker.dataBind();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(+daterangepicker.endDate === +new Date('1/1/2017') && +daterangepicker.startDate === +new Date('5/24/2017')).toBe(true);
            expect(daterangepicker.element.value === '5/24/2017 - 1/1/2017').toBe(true);
        });
        it('icon disabled in last and first month', () => {
            daterangepicker.element.value = '';
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('12/24/2017'), endDate: new Date('1/24/2018') });
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled") && daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")).toBe(false);
        });
    });



    describe('Range Selection - Interaction', () => {
        let daterangepicker: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
        };
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter'
        };
        let startEle: HTMLElement;
        let startValue: Date;
        let endEle: HTMLElement;
        let endValue: Date;
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            startEle = daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar.e-calendar td')[10];
            startValue = daterangepicker.getIdValue(null, startEle);
            endEle = daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[10];
            endValue = daterangepicker.getIdValue(null, endEle);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Selection maintained while navigating(end)', () => {
            let nextEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                target: document.querySelector('.e-right-calendar .e-header .e-next'),
                currentTarget: document.querySelector('.e-right-calendar .e-header .e-next')
            };
            let prevEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                currentTarget: document.querySelector('.e-right-calendar .e-header .e-prev'),
                target: document.querySelector('.e-right-calendar .e-header .e-prev')
            };
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            daterangepicker.navNextMonth(nextEventArgs);
            daterangepicker.navPrevMonth(prevEventArgs);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-end-date').length > 0).toBe(true);
        });
        it('Selecting Start date', () => {
            (startEle).dispatchEvent(clickEvent);
            expect(+daterangepicker.startDate === +startValue)
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length == 1 && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('Selecting end date', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            expect(+daterangepicker.endDate === +endValue)
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-end-date').length == 1 && daterangepicker.popupObj.element.querySelector('.e-start-date') !== null).toBe(true);
        });
        it('Added hover class inbetween start and end', () => {
            (startEle).dispatchEvent(clickEvent);
            mouseEventArgs.currentTarget = startEle.nextElementSibling.nextElementSibling;
            daterangepicker.hoverSelection(mouseEventArgs);
            (endEle).dispatchEvent(clickEvent);
            expect(+daterangepicker.startDate === +startValue)
            expect(+daterangepicker.endDate === +endValue)
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-range-hover').length > 0).toBe(true);
        });
        it('Start date updated', () => {
            (startEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar.e-calendar td')[5]).click();
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length == 1 && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('end date selected selecting start date again', () => {
            (startEle).dispatchEvent(clickEvent);
            (startEle).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date').classList.contains('e-end-date')).toBe(true);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            let startDate: string = daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(daterangepicker.endDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);

        });
        it('selected date after navigating', () => {
            (startEle).dispatchEvent(clickEvent);
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            document.querySelector('.e-right-calendar .e-header .e-date-icon-next').dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[10]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length == 1 && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
        });
        it('hover class added after navigating', () => {
            (startEle).dispatchEvent(clickEvent);
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            document.querySelector('.e-right-calendar .e-header .e-date-icon-next').dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[10]).dispatchEvent(clickEvent);
            elements.rightCalpreviousIcon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-range-hover').length > 0).toBe(true);
        });
        it('Selection Cleared', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            expect(daterangepicker.applyButton.disabled == false).toBe(true);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[15]).dispatchEvent(clickEvent);
            expect(daterangepicker.applyButton.disabled == true).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-range-hover').length == 0 && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('input value Updated', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            let startDate: string = daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(daterangepicker.endDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('Range Indicator Udpated', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-day-span').textContent === (Math.round(Math.abs((daterangepicker.startValue.getTime() - daterangepicker.endValue.getTime()) / (1000 * 60 * 60 * 24))) + 1).toString() + ' Days').toBe(true);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-day-span').textContent === (Math.round(Math.abs((daterangepicker.startDate.getTime() - daterangepicker.endDate.getTime()) / (1000 * 60 * 60 * 24))) + 1).toString() + ' Days').toBe(true);
        });
        it('Current Month open while cancel(No Range) ', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.cancelButton.element).click();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-title').textContent.indexOf(months[new Date().getMonth()]) > -1).toBe(true);
        });

        it('Selection maintained while navigating(start)', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            elements.leftCalpreviousIcon.dispatchEvent(clickEvent);
            elements.leftCalNexticon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length > 0).toBe(true);
        });
        it('Selection maintained while navigating(hover)', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            elements.leftCalpreviousIcon.dispatchEvent(clickEvent);
            elements.leftCalNexticon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-range-hover').length > 0).toBe(true);
        });
        it('is calendar moved to left when range in right calendar', () => {
            let startEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[10]);
            let endEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[15]);
            let startValue: Date = daterangepicker.getIdValue(null, startEle);
            let endValue: Date = daterangepicker.getIdValue(null, endEle);
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            // expect(+startValue === +daterangepicker.startDate && +endValue === +daterangepicker.endDate).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar').querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-left-calendar').querySelector('.e-end-date') !== null).toBe(true);
        });
        it('previous value maintained while cancel', () => {
            daterangepicker = createControl({ startDate: new Date('05/24/2017'), endDate: new Date('08/10/2017') });
            let startEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar.e-calendar td')[10]);
            let endEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[10]);
            let startValue: Date = daterangepicker.getIdValue(null, startEle);
            let endValue: Date = daterangepicker.getIdValue(null, endEle);
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.cancelButton.element).click();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(+startValue !== +daterangepicker.startDate && +endValue !== +daterangepicker.endDate).toBe(true);
        });
        it('WeekNumber not selected', () => {
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('05/24/2017'), endDate: new Date('08/10/2017'), weekNumber: true });
            let ele: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar.e-calendar .e-week-number')[1]);
            (ele).dispatchEvent(clickEvent);
            expect(ele.classList.contains('e-start-date')).toBe(false);
        });
        it('previous value maintained while popup open without completing selection', () => {
            daterangepicker = createControl({ startDate: new Date('05/24/2017'), endDate: new Date('08/10/2017') });
            let ele: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar.e-calendar td')[19]);
            (ele).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            let startValue: Date = new Date('05/24/2017');
            //expect(+startValue === +daterangepicker.startDate).toBe(true);
        });
        //// it('Document click apply selected value', () => {
        //     let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        //     clickEvent.initEvent('click', true, true);
        //     (startEle).dispatchEvent(clickEvent);
        //     (endEle).dispatchEvent(clickEvent);
        //     let click: MouseEvent = document.createEvent('MouseEvents');
        //     click.initEvent('mousedown', true, true);
        //     document.body.dispatchEvent(click);
        //     expect(+daterangepicker.startDate === +startValue && +daterangepicker.endDate === +endValue).toBe(true);
        //     let startDate: string = daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
        //     let endDate: string = daterangepicker.globalize.formatDate(daterangepicker.endDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
        //     // expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        // });
    });

    describe('Device Range Selection - Model', () => {
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = createControl({ startDate: new Date('05/04/2017'), endDate: new Date('05/24/2017') }, true);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Selection through model', () => {
            let startDate: string = daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(daterangepicker.endDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('Start Date Selected correctly', () => {
            let startValue: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-start-date'));
            expect(+startValue === +daterangepicker.startDate).toBe(true);
        });
        it('End Date Selected correctly', () => {
            let endValue: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-end-date'));
            expect(+endValue === +daterangepicker.endDate).toBe(true);
        });
        it('hover Class added', () => {
            let cells: HTMLElement[] = daterangepicker.popupObj.element.querySelectorAll('.e-range-hover');
            expect(cells.length > 0).toBe(true);
        });
        it('start and end button class', () => {
            expect(daterangepicker.popupObj.element.querySelector('.e-start-btn').classList.contains('e-active') && !daterangepicker.popupObj.element.querySelector('.e-end-btn').classList.contains('e-active')).toBe(true);
        });
        it('Selection maintained while navigating(end)', () => {
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.nextIcon.dispatchEvent(clickEvent);
            elements.previousIcon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-end-date').length > 0).toBe(true);
        });
        it('Selection maintained while navigating(start)', () => {
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.nextIcon.dispatchEvent(clickEvent);
            elements.previousIcon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length > 0).toBe(true);
        });
        it('Selection maintained while navigating(hover)', () => {
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.nextIcon.dispatchEvent(clickEvent);
            elements.previousIcon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-range-hover').length > 0).toBe(true);
        });
        it('Selection Cleared', () => {
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]).dispatchEvent(clickEvent);
            expect(daterangepicker.applyButton.disabled == true).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-range-hover').length == 0 && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('Range indicator', () => {
            expect(daterangepicker.popupObj.element.querySelector('.e-day-span').textContent === '21 Days').toBe(true);
        });
        it('seperator value updated', () => {
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('05/24/2017'), separator: '+', endDate: new Date('08/10/2017') });
            expect(daterangepicker.element.value.indexOf(daterangepicker.separator) > -1).toBe(true);
        });
        it('start date only - start month opened', () => {
            daterangepicker.inputElement.value = '';
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('05/24/2017') });
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(daterangepicker.popupObj.element.querySelector('.e-calendar .e-title').textContent.indexOf('May') > -1 && daterangepicker.popupObj.element.querySelector('.e-calendar .e-start-date') !== null).toBe(true);
            expect(daterangepicker.inputElement.value === '').toBe(true);
            expect(daterangepicker.endDate === null && +daterangepicker.startDate === +new Date('05/24/2017')).toBe(true);
        });
        it('end Date only', () => {
            daterangepicker.inputElement.value = '';
            daterangepicker.destroy();
            daterangepicker = createControl({ endDate: new Date('08/10/2017') });
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(daterangepicker.inputElement.value === '').toBe(true);
            expect(+daterangepicker.endDate === +new Date('08/10/2017') && daterangepicker.startDate === null).toBe(true);
        });
        it('Range through input', () => {
            daterangepicker.element.value = '1/3/2017 - 11/3/2017 ';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            expect(daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' }) === '1/3/2017').toBe(true);
        });
        it('Range updated in calendar', () => {
            daterangepicker.element.value = '1/3/2017 - 11/3/2017 ';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            daterangepicker.hide();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            let startDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-start-date'));
            expect(daterangepicker.globalize.formatDate(startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' }) === '1/3/2017').toBe(true);
        });
        it('error class for seperator', () => {
            daterangepicker.element.value = '3/3/2017 + 11/3/2017 ';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('error class for invalid date', () => {
            daterangepicker.element.value = '3/3/2017 - 14/3/2017 '; // month -14
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            daterangepicker.hide();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null && daterangepicker.popupObj.element.querySelector('.e-start-date') === null).toBe(true);
        });
        it('Date moved to next month', () => {
            daterangepicker.element.value = '9/31/2017 - 10/10/2017'; //No 31 in sep so moved to dec 1
            daterangepicker.hide();
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            // let startDate: Date = daterangepicker.getIdValue(null,daterangepicker.popupObj.element.querySelector('.e-start-date'));
            // expect(daterangepicker.globalize.formatDate(startDate,{format: daterangepicker.format,type:'date',skeleton:'yMd'}) === '10/1/2017').toBe(true);
            expect(daterangepicker.startDate === null).toBe(true);
        });
        it('error class for startDate greater than end date', () => {
            daterangepicker = createControl({ startDate: new Date('09/24/2017'), endDate: new Date('08/10/2017') });
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.element.value === '9/24/2017 - 8/10/2017')
        });
        it('Same date for start and end', () => {
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('09/24/2017'), endDate: new Date('09/24/2017') });
            expect(+daterangepicker.startDate === +daterangepicker.endDate).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date').classList.contains('e-start-date')).toBe(true);
        });
        it('error class for empty date', () => {
            daterangepicker.element.value = ' ';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(daterangepicker.endDate === null && daterangepicker.startDate === null).toBe(true);
        });
        it('previous value maintained while cancel', () => {
            let startEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            let endEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[19]);
            let startValue: Date = daterangepicker.getIdValue(null, startEle);
            let endValue: Date = daterangepicker.getIdValue(null, endEle);
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.cancelButton.element).click();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(+startValue !== +daterangepicker.startDate && +endValue !== +daterangepicker.endDate).toBe(true);
        });
        it('previous value maintained while popup open without completing selection', () => {
            let ele: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[19]);
            (ele).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            let startValue: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-start-date'));
            expect(+startValue === +daterangepicker.startDate).toBe(true);
        });
        it('New selection updated in the calendar', () => {
            let startEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            let endEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[19]);
            let startValue: Date = daterangepicker.getIdValue(null, startEle);
            let endValue: Date = daterangepicker.getIdValue(null, endEle);
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(+startValue === +daterangepicker.startDate && +endValue === +daterangepicker.endDate).toBe(true);
        });
        it('Invalid Date Model', () => {
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('fff'), endDate: new Date('08/10/2017') });
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(+daterangepicker.endDate === +new Date('08/10/2017') && daterangepicker.startDate === null).toBe(true);
        });
        it('Invalid Date Set Model', () => {
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('07/10/2017'), endDate: new Date('08/10/2017') });
            daterangepicker.endDate = new Date('ssss');
            daterangepicker.dataBind();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') === false && daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.endDate === null && +daterangepicker.startDate === +new Date('07/10/2017')).toBe(true);
            expect(daterangepicker.element.value === '').toBe(true);
        });
        it('error class for startDate greater than end date(enter)', () => {
            daterangepicker.element.value = '3/3/2017 - 1/3/2017 ';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            daterangepicker.hide();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(+daterangepicker.endDate === +new Date('1/3/2017') && +daterangepicker.startDate === +new Date('3/3/2017')).toBe(true);
        });
        it('error class for startDate greater than end date(Set Model)', () => {
            daterangepicker.startDate = new Date('5/24/2017');
            daterangepicker.endDate = new Date('1/1/2017');
            daterangepicker.dataBind();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(+daterangepicker.endDate === + new Date('1/1/2017') && +daterangepicker.startDate === +new Date('5/24/2017')).toBe(true);
        });
        it('endDate repicked ?', () => {
            <HTMLElement>(daterangepicker.endButton.element).click();
            (daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[16]).dispatchEvent(clickEvent);
            expect(+daterangepicker.endValue !== +new Date('05/24/2017')).toBe(true);
            <HTMLElement>(daterangepicker.applyButton.element).dispatchEvent(clickEvent);
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
        });
    });
    describe('Device Range Selection-Interaction', () => {
        let daterangepicker: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
        };
        let startEle: HTMLElement;
        let startValue: Date;
        let endEle: HTMLElement;
        let endValue: Date;
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#date');
            daterangepicker.isMobile = true;
            daterangepicker.refreshControl();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            startEle = daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10];
            startValue = daterangepicker.getIdValue(null, startEle);
            endEle = daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[15];
            endValue = daterangepicker.getIdValue(null, endEle);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Selecting Start date', () => {
            (startEle).dispatchEvent(clickEvent);
            expect(+daterangepicker.startDate === +startValue)
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length == 1 && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(!daterangepicker.popupObj.element.querySelector('.e-start-btn').classList.contains('e-active') && daterangepicker.popupObj.element.querySelector('.e-end-btn').classList.contains('e-active')).toBe(true);
        });
        it('Selecting end date', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            expect(+daterangepicker.endDate === +endValue)
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-end-date').length == 1 && daterangepicker.popupObj.element.querySelector('.e-start-date') !== null).toBe(true);
            expect(!daterangepicker.popupObj.element.querySelector('.e-start-btn').classList.contains('e-active') && daterangepicker.popupObj.element.querySelector('.e-end-btn').classList.contains('e-active')).toBe(true);
        });
        it('Added hover class inbetween start and end', () => {
            (startEle).dispatchEvent(clickEvent);
            mouseEventArgs.currentTarget = endEle;
            daterangepicker.hoverSelection(mouseEventArgs);
            (endEle).dispatchEvent(clickEvent);
            expect(+daterangepicker.startDate === +startValue)
            expect(+daterangepicker.endDate === +endValue)
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-range-hover').length > 0).toBe(true);
        });
        it('Start date updated', () => {
            (startEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[7]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length == 1 && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('end date selected selecting start date again', () => {
            (startEle).dispatchEvent(clickEvent);
            (startEle).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date').classList.contains('e-start-date')).toBe(true);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            let startDate: string = daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(daterangepicker.endDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('selected date after navigating', () => {
            (startEle).dispatchEvent(clickEvent);
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.nextIcon.dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
        });
        it('hover class added after navigating', () => {
            (startEle).dispatchEvent(clickEvent);
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.nextIcon.dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]).dispatchEvent(clickEvent);
            elements.previousIcon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-range-hover').length > 0).toBe(true);
        });
        it('Selection Cleared(startBtn)', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            expect(daterangepicker.applyButton.disabled == false).toBe(true);
            <HTMLElement>(daterangepicker.startButton.element).click();
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[15]).dispatchEvent(clickEvent);
            expect(daterangepicker.applyButton.disabled == true).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-range-hover').length === 0 && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('Selection not Cleared(EndBtn)', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            expect(daterangepicker.applyButton.disabled == false).toBe(true);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[15]).dispatchEvent(clickEvent);
            expect(daterangepicker.applyButton.disabled == false).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-range-hover').length > 0 && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
        });
        it('input Updated', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            let startDate: string = daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(daterangepicker.endDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('Range Indicator', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            (daterangepicker.applyButton.element).click();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-day-span').textContent === (Math.round(Math.abs((daterangepicker.startDate.getTime() - daterangepicker.endDate.getTime()) / (1000 * 60 * 60 * 24))) + 1).toString() + ' Days').toBe(true);
        });
        it('Current Month open while cancel(No Range) ', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.cancelButton.element).click();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-calendar .e-title').textContent.indexOf(months[new Date().getMonth()]) > -1).toBe(true);
        });
        it('Selection maintained while navigating(end)', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.nextIcon.dispatchEvent(clickEvent);
            elements.previousIcon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-end-date').length > 0).toBe(true);
        });
        it('Selection maintained while navigating(start)', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.nextIcon.dispatchEvent(clickEvent);
            elements.previousIcon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length > 0).toBe(true);
        });
        it('Selection maintained while navigating(hover)', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.nextIcon.dispatchEvent(clickEvent);
            elements.previousIcon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-range-hover').length > 0).toBe(true);
        });
        it('WeekNumber not selected', () => {
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('05/24/2017'), endDate: new Date('08/10/2017'), weekNumber: true });
            let ele: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar .e-week-number')[1]);
            (ele).dispatchEvent(clickEvent);
            expect(ele.classList.contains('e-start-date')).toBe(false);
        });
        it('endDate repicked ?', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            endValue = daterangepicker.getIdValue(null, endEle);
            (daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[16]).dispatchEvent(clickEvent);;
            <HTMLElement>(daterangepicker.applyButton.element).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(+daterangepicker.endDate !== +endValue).toBe(true);
            expect(+daterangepicker.endDate === endValue.setDate(endValue.getDate() + 1)).toBe(true);
        });
        it('startDate selected again ?', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.startButton.element).click();
            (daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[16]).dispatchEvent(clickEvent);;
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('date disabled before startDate ?', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            expect(elements.previousIcon.classList.contains('e-disabled')).toBe(true); //icon disabled
            startEle = daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[9];
            expect(startEle.classList.contains('e-disabled')).toBe(true); // date disabled
        });
        it('date disabled maintained after nav startDate ?', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.nextIcon.dispatchEvent(clickEvent);
            elements.previousIcon.dispatchEvent(clickEvent);
            expect(elements.previousIcon.classList.contains('e-disabled')).toBe(true); //icon disabled
            startEle = daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[9];
            expect(startEle.classList.contains('e-disabled')).toBe(true); // date disabled
        });
        it('date disabled removed start header click ?', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.startButton.element).click();
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            expect(elements.previousIcon.classList.contains('e-disabled')).toBe(false);
            startEle = daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[9];
            expect(startEle.classList.contains('e-disabled')).toBe(false);
        });
        it('date disabled added end header click', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.startButton.element).click();
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            expect(elements.previousIcon.classList.contains('e-disabled')).toBe(false); //icon disabled
            startEle = daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[9];
            expect(startEle.classList.contains('e-disabled')).toBe(false); // date disabled
            <HTMLElement>(daterangepicker.endButton.element).click();
            expect(elements.previousIcon.classList.contains('e-disabled')).toBe(true);
            startEle = daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[9];
            expect(startEle.classList.contains('e-disabled')).toBe(true);
        });
        it('date disabled before startdatwe - Model', () => {
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            expect(elements.previousIcon.classList.contains('e-disabled')).toBe(false); //icon disabled
            startEle = daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[9];
            expect(startEle.classList.contains('e-disabled')).toBe(false); // date disabled
            <HTMLElement>(daterangepicker.endButton.element).click();
            expect(elements.previousIcon.classList.contains('e-disabled')).toBe(true);
            startEle = daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[9];
            expect(startEle.classList.contains('e-disabled')).toBe(true);
        });
    });

    describe('Min/Max test case -  Desktop', () => {
        let daterangepicker: any;
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February"];
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('min and max null value', () => {
            daterangepicker = createControl({ min: null, max: null });
            expect(+daterangepicker.min === +new Date(1900, 0, 1) && +daterangepicker.max === +new Date(2099, 11, 31)).toBe(true);
        });
        it('min value greater than max', () => {
            daterangepicker = createControl({ startDate: new Date('6/2/2017'), endDate: new Date('6/12/2017'), min: new Date('05/10/2018'), max: new Date('12/24/2017') });
            expect(daterangepicker.element.hasAttribute('disabled') && daterangepicker.enabled === false && daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
            expect(daterangepicker.inputElement.value === '6/2/2017 - 6/12/2017' && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('min and max in same month', () => {
            daterangepicker = createControl({ min: new Date('05/10/2017'), max: new Date('05/24/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-title').textContent.indexOf(months[daterangepicker.min.getMonth() - 1]) > -1).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-title').textContent.indexOf(months[daterangepicker.min.getMonth()]) > -1).toBe(true);
        });
        it('Same min and max range', () => {
            daterangepicker = createControl({ startDate: new Date('08/10/2017'), endDate: new Date('08/10/2017'), min: new Date('08/10/2017'), max: new Date('08/10/2017') });
            let endValue: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-end-date'));
            let startValue: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-start-date'));
            expect(+daterangepicker.startDate === +daterangepicker.min && +daterangepicker.startDate === +startValue).toBe(true);
            expect(+daterangepicker.endDate === +daterangepicker.max && +daterangepicker.endDate === +endValue).toBe(true);
            expect(+daterangepicker.min === +daterangepicker.max).toBe(true);
        });
        it('min value greater than current date', () => {
            daterangepicker = createControl({ min: new Date(new Date().setMonth(new Date().getMonth() + 1)) });
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-title').textContent.indexOf(months[daterangepicker.min.getMonth()]) > -1).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-title').textContent.indexOf(months[daterangepicker.min.getMonth() + 1]) > -1).toBe(true);
        });
        it('max value lesser than current date', () => {
            daterangepicker = createControl({ max: new Date('04/24/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-title').textContent.indexOf(months[daterangepicker.max.getMonth() - 1]) > -1).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-title').textContent.indexOf(months[daterangepicker.max.getMonth()]) > -1).toBe(true);
        });
        it('Range inbetween min and max', () => {
            daterangepicker = createControl({ startDate: new Date('05/24/2017'), endDate: new Date('08/10/2017'), min: new Date('01/10/2017'), max: new Date('12/24/2017') });
            expect((+daterangepicker.startDate <= +daterangepicker.max && +daterangepicker.startDate >= +daterangepicker.min) && (+daterangepicker.endDate <= +daterangepicker.max && +daterangepicker.endDate >= +daterangepicker.min)).toBe(true);
            expect(!daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length > 0).toBe(true);
        });
        it('Range on min and max', () => {
            daterangepicker = createControl({ startDate: new Date('01/10/2017'), endDate: new Date('12/24/2017'), min: new Date('01/10/2017'), max: new Date('12/24/2017') });
            expect(+daterangepicker.startDate === +daterangepicker.min && +daterangepicker.endDate === +daterangepicker.max).toBe(true);
            expect(!daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length > 0).toBe(true);
        });
        it('startDate out of min range(month)', () => {
            daterangepicker = createControl({ startDate: new Date('04/24/2017'), endDate: new Date('08/10/2017'), min: new Date('05/10/2017'), max: new Date('12/24/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/24/2017') && +daterangepicker.endDate === + new Date('08/10/2017') && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
        });
        it('endDate out of max range(month)', () => {
            daterangepicker = createControl({ startDate: new Date('04/24/2017'), endDate: new Date('08/10/2017'), min: new Date('1/10/2017'), max: new Date('7/24/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/24/2017') && +daterangepicker.endDate === +new Date('08/10/2017') && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
        });
        it('start and end date out of min and max range(month)', () => {
            daterangepicker = createControl({ startDate: new Date('04/24/2017'), endDate: new Date('08/10/2017'), min: new Date('5/10/2017'), max: new Date('7/24/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/24/2017') && +daterangepicker.endDate === +new Date('08/10/2017') && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('04/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('08/10/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('Start and end value in max month', () => {
            daterangepicker = createControl({ startDate: new Date('04/10/2017'), endDate: new Date('04/24/2017'), min: new Date('02/10/2017'), max: new Date('04/29/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-title').textContent.indexOf(months[daterangepicker.endDate.getMonth() - 1]) > -1).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-title').textContent.indexOf(months[daterangepicker.endDate.getMonth()]) > -1).toBe(true);
        });
        it('Start and end value in min month', () => {
            daterangepicker = createControl({ startDate: new Date('04/10/2017'), endDate: new Date('04/24/2017'), min: new Date('04/01/2017'), max: new Date('04/29/2018') });
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-title').textContent.indexOf(months[daterangepicker.endDate.getMonth()]) > -1).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-title').textContent.indexOf(months[daterangepicker.endDate.getMonth() + 1]) > -1).toBe(true);
        });
        it('Min/max range updated through keyboard', () => {
            daterangepicker = createControl({ startDate: new Date('04/10/2017'), endDate: new Date('04/24/2017'), min: new Date('02/10/2017'), max: new Date('04/29/2017') });
            daterangepicker.element.value = '1/3/2017 - 11/3/2018';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            daterangepicker.hide();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date')).toBe(null);
            expect(+daterangepicker.startDate === +new Date('1/3/2017') && +daterangepicker.endDate === +new Date('11/3/2018') && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('1/3/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('11/3/2018'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('Min/max range updated through dataBind', () => {
            daterangepicker = createControl({ startDate: new Date('04/10/2017'), endDate: new Date('04/24/2017'), min: new Date('02/10/2017'), max: new Date('04/29/2017') });
            daterangepicker.min = new Date('4/15/2017');
            daterangepicker.dataBind();
            expect(+daterangepicker.startDate === +new Date('04/10/2017') && +daterangepicker.endDate === +new Date('04/24/2017') && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('04/10/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('04/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('Min/max error class remvoed through dataBind', () => {
            daterangepicker = createControl({ startDate: new Date('04/10/2017'), endDate: new Date('04/24/2017'), min: new Date('02/10/2017'), max: new Date('04/29/2017') });
            daterangepicker.min = new Date('4/15/2017');
            daterangepicker.dataBind();
            expect(+daterangepicker.startDate === +new Date('04/10/2017') && +daterangepicker.endDate === +new Date('04/24/2017') && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            daterangepicker.min = new Date('2/15/2017');
            daterangepicker.startDate = new Date('04/10/2017');
            daterangepicker.endDate = new Date('04/24/2017');
            daterangepicker.dataBind();
            expect(daterangepicker.startDate !== null && daterangepicker.endDate !== null && daterangepicker.inputWrapper.container.classList.contains('e-error') === false).toBe(true);
        });
        it('strict mode min > max', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/10/2017'), endDate: new Date('04/24/2017'), min: new Date('02/10/2017'), max: new Date('04/29/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-title').textContent.indexOf(months[daterangepicker.endDate.getMonth()]) > -1).toBe(true);
            daterangepicker.min = new Date('05/11/2017');
            daterangepicker.dataBind();
            expect(daterangepicker.inputElement.value === '4/10/2017 - 4/24/2017').toBe(true);
        });
    });
    describe('KeyBoard action - DateRangePicker element', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'alt+right',
            target: 'target'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#date');
            daterangepicker.show();
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });

        it('drill up to year view', function () {
            daterangepicker.value = [new Date('1/1/2019'), new Date('1/1/2020')];
            daterangepicker.dataBind();
            daterangepicker.show();
            keyEventArgs.action = 'controlUp';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2019');
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2010 - 2019');
            keyEventArgs.action = 'controlDown';
            daterangepicker.keyInputHandler(keyEventArgs);
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('January 2019');
        });

        it('move focus from left to right calendar', function () {
            daterangepicker.value = [new Date('1/1/2019'), new Date('1/1/2020')];
            daterangepicker.dataBind();
            daterangepicker.show();
            keyEventArgs.action = 'altRightArrow';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            daterangepicker.leftCalendar.querySelector('table').focus();
            daterangepicker.keyInputHandler(keyEventArgs);
            expect(document.activeElement === daterangepicker.rightCalendar.children[1].firstElementChild).toBe(true);
            keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            keyEventArgs.action = 'controlUp';
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2020');
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2020 - 2029');
            keyEventArgs.action = 'controlDown';
            daterangepicker.keyInputHandler(keyEventArgs);
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('January 2020');
        });
        it('move focus from on td to other td cell', function () {
            daterangepicker.value = [new Date('2/1/2019'), new Date('1/1/2020')];
            daterangepicker.dataBind();
            daterangepicker.show();
            keyEventArgs.action = 'controlUp';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).textContent).toBe('Feb');
            keyEventArgs.action = 'moveLeft';
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).textContent).toBe('Jan');
            keyEventArgs.action = 'moveDown';
            daterangepicker.keyInputHandler(keyEventArgs);
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).textContent).toBe('Sep');
            keyEventArgs.action = 'moveRight';
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).textContent).toBe('Oct');
            keyEventArgs.action = 'moveUp';
            daterangepicker.keyInputHandler(keyEventArgs);
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).textContent).toBe('Feb');
            keyEventArgs.action = 'home';
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).textContent).toBe('Jan');
            keyEventArgs.action = 'end';
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).textContent).toBe('Dec');
            keyEventArgs.action = 'controlUp';
            daterangepicker.keyInputHandler(keyEventArgs);
            keyEventArgs.action = 'home';
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).textContent).toBe('2010');
            keyEventArgs.action = 'end';
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).textContent).toBe('2019');
        });

        it('move focus from right to cancel button', function () {
            keyEventArgs.action = 'altRightArrow';
            keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            daterangepicker.rightCalendar.querySelector('table').focus();
            daterangepicker.keyInputHandler(keyEventArgs);
            expect(document.activeElement === daterangepicker.cancelButton.element).toBe(true);
        });

        it('select td from month view to day view', function () {
            daterangepicker.value = [new Date('2/1/2019'), new Date('1/1/2020')];
            daterangepicker.dataBind();
            daterangepicker.show();
            keyEventArgs.action = 'controlUp';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            daterangepicker.leftCalendar.querySelector('table').focus();
            daterangepicker.keyInputHandler(keyEventArgs);
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).textContent).toBe('2019');
            keyEventArgs.action = 'select';
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).textContent).toBe('Feb');
            daterangepicker.keyInputHandler(keyEventArgs);
            expect((<HTMLElement>document.querySelectorAll('.e-selected')[0]).textContent).toBe('1');
        });

        it('move focus from cancel to apply button', function () {
            daterangepicker.value = [new Date('1/1/2019'), new Date('1/1/2020')];
            daterangepicker.dataBind();
            daterangepicker.show();
            keyEventArgs.action = 'altRightArrow';
            keyEventArgs.target = daterangepicker.cancelButton.element;
            daterangepicker.cancelButton.element.focus();
            daterangepicker.popupKeyActionHandle(keyEventArgs);
            expect(document.activeElement === daterangepicker.applyButton.element).toBe(true);
        });
        it('move focus from cancel to left Calendar with apply button disabled', function () {
            keyEventArgs.action = 'altRightArrow';
            keyEventArgs.target = daterangepicker.cancelButton.element;
            daterangepicker.cancelButton.element.focus();
            daterangepicker.popupKeyActionHandle(keyEventArgs);
            expect(document.activeElement === daterangepicker.applyButton.element).toBe(false);
            expect(document.activeElement === daterangepicker.leftCalendar.children[1].firstElementChild).toBe(true);
        });

        it('move focus from right Calendar to preset element', function () {
            daterangepicker.presets = [{ label: 'Last Month', start: new Date('1/1/2017'), end: new Date('5/24/2017') },
            { label: 'Last', start: new Date('1/1/2017'), end: new Date('5/24/2017') }];
            daterangepicker.dataBind();
            daterangepicker.show();
            keyEventArgs.action = 'altRightArrow';
            keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            daterangepicker.rightCalendar.querySelector('table').focus();
            daterangepicker.keyInputHandler(keyEventArgs);
            expect(document.activeElement === daterangepicker.cancelButton.element).toBe(false);
            expect(document.activeElement === daterangepicker.presetElement).toBe(true);
        });

        it('move focus from preset element to cancel', function () {
            daterangepicker.presets = [{ label: 'Last Month', start: new Date('1/1/2017'), end: new Date('5/24/2017') },
            { label: 'Last', start: new Date('1/1/2017'), end: new Date('5/24/2017') }];
            daterangepicker.dataBind();
            daterangepicker.show();
            keyEventArgs.action = 'altRightArrow';
            keyEventArgs.target = daterangepicker.presetElement;
            daterangepicker.presetElement.focus();
            daterangepicker.popupKeyActionHandle(keyEventArgs);
            expect(document.activeElement === daterangepicker.cancelButton.element).toBe(true);
        });

        it('move focus from left to cancel button', function () {
            keyEventArgs.action = 'altLeftArrow';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            daterangepicker.keyInputHandler(keyEventArgs);
            expect(document.activeElement === daterangepicker.cancelButton.element).toBe(true);
            expect(document.activeElement === daterangepicker.applyButton.element).toBe(false);
        });

        it('move focus from cancel to right calendar', function () {
            keyEventArgs.action = 'altLeftArrow';
            keyEventArgs.target = daterangepicker.cancelButton.element;
            daterangepicker.cancelButton.element.focus();
            daterangepicker.popupKeyActionHandle(keyEventArgs);
            expect(document.activeElement === daterangepicker.rightCalendar.children[1].firstElementChild).toBe(true);
        });
        it('move focus from right to left calendar', function () {
            keyEventArgs.action = 'altLeftArrow';
            keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            daterangepicker.rightCalendar.querySelector('table').focus();
            daterangepicker.keyInputHandler(keyEventArgs);
            expect(document.activeElement === daterangepicker.leftCalendar.children[1].firstElementChild).toBe(true);
        });
        it('move focus from left to apply button', function () {
            daterangepicker.value = [new Date('1/1/2019'), new Date('1/1/2020')];
            daterangepicker.dataBind();
            daterangepicker.show();
            keyEventArgs.action = 'altLeftArrow';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            daterangepicker.leftCalendar.querySelector('table').focus();
            daterangepicker.keyInputHandler(keyEventArgs);
            expect(document.activeElement === daterangepicker.applyButton.element).toBe(true);
        });
        it('move focus from apply button to cancel button', function () {
            daterangepicker.value = [new Date('1/1/2019'), new Date('1/1/2020')];
            daterangepicker.dataBind();
            daterangepicker.show();
            keyEventArgs.action = 'altLeftArrow';
            keyEventArgs.target = daterangepicker.applyButton.element;
            daterangepicker.applyButton.element.focus();
            daterangepicker.popupKeyActionHandle(keyEventArgs);
            expect(document.activeElement === daterangepicker.cancelButton.element).toBe(true);
        });
        it('move focus from cancel to preset element', function () {
            daterangepicker.presets = [{ label: 'Last Month', start: new Date('1/1/2017'), end: new Date('5/24/2017') },
            { label: 'Last', start: new Date('1/1/2017'), end: new Date('5/24/2017') }];
            daterangepicker.dataBind();
            daterangepicker.show();
            keyEventArgs.action = 'altLeftArrow';
            keyEventArgs.target = daterangepicker.cancelButton.element;
            daterangepicker.cancelButton.element.focus();
            daterangepicker.popupKeyActionHandle(keyEventArgs);
            expect(document.activeElement === daterangepicker.presetElement).toBe(true);
        });
        it('move focus from preset element to right calendar', function () {
            daterangepicker.presets = [{ label: 'Last Month', start: new Date('1/1/2017'), end: new Date('5/24/2017') },
            { label: 'Last', start: new Date('1/1/2017'), end: new Date('5/24/2017') }];
            daterangepicker.dataBind();
            daterangepicker.show();
            keyEventArgs.action = 'altLeftArrow';
            keyEventArgs.target = daterangepicker.presetElement;
            daterangepicker.presetElement.focus();
            daterangepicker.popupKeyActionHandle(keyEventArgs);
            expect(document.activeElement === daterangepicker.rightCalendar.children[1].firstElementChild).toBe(true);
        });
    });
    describe('Tab KeyBoard action - DateRangePicker element', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'alt+right',
            target: 'target'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#date');
            daterangepicker.show();
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('move focus from left to right calendar using tab', function () {
            daterangepicker.value = [new Date('1/1/2019'), new Date('1/1/2020')];
            daterangepicker.dataBind();
            daterangepicker.show();
            keyEventArgs.action = 'tab';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            daterangepicker.leftCalendar.querySelector('table').focus();
            daterangepicker.keyInputHandler(keyEventArgs);
            expect(document.activeElement === daterangepicker.rightCalendar.children[1].firstElementChild).toBe(true);
            keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            keyEventArgs.action = 'shiftTab';
            daterangepicker.keyInputHandler(keyEventArgs);
            expect(document.activeElement === daterangepicker.leftCalendar.children[1].firstElementChild).toBe(true);
        });
    });
    describe('Min/Max test case - Device', () => {
        let daterangepicker: any;
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February"];
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('min and max null value', () => {
            daterangepicker = createControl({ min: null, max: null }, true);
            expect(+daterangepicker.min === +new Date(1900, 0, 1) && +daterangepicker.max === +new Date(2099, 11, 31)).toBe(true);
        });
        it('min value greater than max', () => {
            daterangepicker = createControl({ min: new Date('05/10/2018'), max: new Date('12/24/2017') }, true);
            expect(daterangepicker.element.hasAttribute('disabled') && daterangepicker.enabled === false).toBe(true);
        });
        it('min and max in same month', () => {
            daterangepicker = createControl({ min: new Date('05/10/2017'), max: new Date('05/24/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-calendar .e-prev').classList.contains('e-disabled') && daterangepicker.popupObj.element.querySelector('.e-calendar .e-next').classList.contains('e-disabled')).toBe(false);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar .e-disabled').length > 0).toBe(true);
        });
        it(' min onproperty change test case ', () => {
            daterangepicker = createControl({ min: new Date('05/1/2017'), max: new Date('04/24/2017') });
            expect(daterangepicker.element.hasAttribute('disabled') && daterangepicker.enabled === false).toBe(true);
            expect(daterangepicker.inputElement.value === '' && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            daterangepicker.min = new Date('3/1/2017');
            daterangepicker.dataBind();
            expect(daterangepicker.element.hasAttribute('disabled') == false && daterangepicker.enabled === true).toBe(true);

        });
        it('Same min and max range', () => {
            daterangepicker = createControl({ startDate: new Date('08/10/2017'), endDate: new Date('08/10/2017'), min: new Date('08/10/2017'), max: new Date('08/10/2017') }, true);
            let endValue: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-end-date'));
            let startValue: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-start-date'));
            expect(+daterangepicker.startDate === +daterangepicker.min && +daterangepicker.startDate === +startValue).toBe(true);
            expect(+daterangepicker.endDate === +daterangepicker.max && +daterangepicker.endDate === +endValue).toBe(true);
            expect(+daterangepicker.min === +daterangepicker.max).toBe(true);
        });
        it('max value lesser than current date', () => {
            daterangepicker = createControl({ min: new Date('03/10/2017'), max: new Date('04/24/2017') }, true);
            expect(daterangepicker.popupObj.element.querySelector('.e-calendar .e-title').textContent.indexOf(months[daterangepicker.max.getMonth()]) > -1).toBe(true);
        });
        it('min value greater than current date', () => {
            daterangepicker = createControl({ min: new Date(new Date().setMonth(new Date().getMonth() + 1)), max: new Date('04/24/2018') }, true);
            daterangepicker.show();
            // expect(daterangepicker.popupObj.element.querySelector('.e-calendar .e-title').textContent.indexOf(months[daterangepicker.min.getMonth()]) > -1).toBe(true);
        });
        it('Range inbetween min and max', () => {
            daterangepicker = createControl({ startDate: new Date('05/24/2017'), endDate: new Date('08/10/2017'), min: new Date('01/10/2017'), max: new Date('12/24/2017') }, true);
            expect((+daterangepicker.startDate <= +daterangepicker.max && +daterangepicker.startDate >= +daterangepicker.min) && (+daterangepicker.endDate <= +daterangepicker.max && +daterangepicker.endDate >= +daterangepicker.min)).toBe(true);
            expect(!daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length > 0).toBe(true);
        });
        it('Range on min and max', () => {
            daterangepicker = createControl({ startDate: new Date('01/10/2017'), endDate: new Date('12/24/2017'), min: new Date('01/10/2017'), max: new Date('12/24/2017') }, true);
            expect(+daterangepicker.startDate === +daterangepicker.min && +daterangepicker.endDate === +daterangepicker.max).toBe(true);
            expect(!daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length > 0).toBe(true);
        });
        it('startDate out of min range(month)', () => {
            daterangepicker = createControl({ startDate: new Date('04/24/2017'), endDate: new Date('08/10/2017'), min: new Date('05/10/2017'), max: new Date('12/24/2017') }, true);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/24/2017') && +daterangepicker.endDate === +new Date('08/10/2017') && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
        });
        it('endDate out of min range(month)', () => {
            daterangepicker = createControl({ startDate: new Date('08/01/2017'), endDate: new Date('08/10/2017'), min: new Date('1/10/2017'), max: new Date('7/24/2017') }, true);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('08/01/2017') && +daterangepicker.endDate === +new Date('08/10/2017') && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
        });
        it('start and end date out of min and max range(month)', () => {
            daterangepicker = createControl({ startDate: new Date('04/24/2017'), endDate: new Date('08/10/2017'), min: new Date('5/10/2017'), max: new Date('7/24/2017') }, true);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/24/2017') && +daterangepicker.endDate === +new Date('08/10/2017') && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('04/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('08/10/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('Min/max range updated through dataBind', () => {
            daterangepicker = createControl({ startDate: new Date('04/10/2017'), endDate: new Date('04/24/2017'), min: new Date('02/10/2017'), max: new Date('04/29/2017') }, true);
            daterangepicker.min = new Date('4/15/2017');
            daterangepicker.dataBind();
            expect(+daterangepicker.startDate === +new Date('04/10/2017') && +daterangepicker.endDate === +new Date('04/24/2017') && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('04/10/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('04/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });

    });

    describe('Min/Max interaction - Desktop', () => {
        let daterangepicker: any;
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), min: new Date('01/15/2017'), max: new Date('09/05/2017') });
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Min range restricted(Month)', () => {
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            elements.leftCalpreviousIcon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains('e-disabled')).toBe(true);
        });
        it('Max range restricted(Month)', () => {
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            elements.rightCalNexticon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains('e-disabled')).toBe(true);
        });
        it('Min range restricted(date)', () => {
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            elements.leftCalpreviousIcon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar.e-calendar td')[10].classList.contains('e-disabled')).toBe(true);
        });
        it('Max range restricted(date)', () => {
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            elements.rightCalNexticon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[10].classList.contains('e-disabled')).toBe(true);
        });
        it('Disabled date selection', () => {
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            document.querySelector('.e-right-calendar .e-header .e-date-icon-next').dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[1]).click();
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[10]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
    });
    describe('Min/Max interaction - Device', () => {
        let daterangepicker: any;
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = createControl({ startDate: new Date('03/04/2017'), endDate: new Date('03/10/2017'), min: new Date('02/15/2017'), max: new Date('04/05/2017') }, true);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Min range restricted(Month)', () => {
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.previousIcon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-calendar .e-prev').classList.contains('e-disabled')).toBe(true);
        });
        it('Max range restricted(Month)', () => {
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.nextIcon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-calendar .e-next').classList.contains('e-disabled')).toBe(true);
        });
        it('Min range restricted(date)', () => {
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.previousIcon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10].classList.contains('e-disabled')).toBe(true);
        });
        it('Max range restricted(date)', () => {
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.nextIcon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[15].classList.contains('e-disabled')).toBe(true);
        });
        it('Disabled date selection', () => {
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.nextIcon.dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[7]).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[15]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('date disabled before startDate ?', () => {
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            expect(elements.previousIcon.classList.contains('e-disabled')).toBe(false); //icon disabled
            <HTMLElement>(daterangepicker.endButton.element).click();
            expect(elements.previousIcon.classList.contains('e-disabled')).toBe(true); //icon disabled
        });
    });

    describe('KeyBoard events', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = createControl({ startDate: new Date('05/04/2017'), endDate: new Date('05/24/2017') });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it(' enter key test case(Correct Value)', function () {
            keyEventArgs.action = 'enter';
            daterangepicker.element.value = '3/3/2017 - 11/3/2017 ';
            daterangepicker.element.focus();
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.inputElement.value === daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' }) + ' ' + daterangepicker.separator + ' ' + daterangepicker.globalize.formatDate(daterangepicker.endDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' })).toBe(true);
        });
        it(' enter key test case(Wrong Value)', function () {
            keyEventArgs.action = 'enter';
            daterangepicker.element.value = '3/3/2017 - 13/3/2017 ';
            daterangepicker.element.focus();
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
        });
        it(' enter key test case(empty Value)', function () {
            keyEventArgs.action = 'enter';
            daterangepicker.element.value = '';
            daterangepicker.element.focus();
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.element.value === '').toBe(true);
        });
        it(' enter key test case(Correct Value) - strictMode', function () {
            daterangepicker.strictMode = true;
            daterangepicker.dataBind();
            keyEventArgs.action = 'enter';
            daterangepicker.element.value = '3/3/2017 - 12/3/2017 ';
            daterangepicker.element.focus();
            daterangepicker.inputHandler(keyEventArgs);
            expect(!daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate !== null && daterangepicker.endDate !== null).toBe(true);
            expect(daterangepicker.inputElement.value === daterangepicker.globalize.formatDate(new Date('3/3/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' }) + ' ' + daterangepicker.separator + ' ' + daterangepicker.globalize.formatDate(new Date('12/3/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' })).toBe(true);
        });
        it(' enter key test case(Wrong Value) - strictMode', function () {
            daterangepicker.strictMode = true;
            daterangepicker.dataBind();
            keyEventArgs.action = 'enter';
            daterangepicker.element.value = '3/3/2017 - 13/3/2017 ';
            daterangepicker.element.focus();
            daterangepicker.inputHandler(keyEventArgs);
            expect(!daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate !== null && daterangepicker.endDate !== null).toBe(true);
            expect(daterangepicker.inputElement.value === daterangepicker.globalize.formatDate(new Date('05/04/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' }) + ' ' + daterangepicker.separator + ' ' + daterangepicker.globalize.formatDate(new Date('05/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' })).toBe(true);
        });
        it(' keydown key test case', function () {
            daterangepicker.element.value = '05/25/2018 - 06/25/2018 ';
            daterangepicker.element.focus();
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
            keyEventArgs.action = 'down';
            keyEventArgs.keyCode = 40;
            daterangepicker.inputHandler(keyEventArgs);
        });

        it('altdown key test case', function () {
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            daterangepicker.element.value = '05/25/2018 - 06/25/2018 ';
            daterangepicker.element.focus();
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
            <HTMLElement>(daterangepicker.cancelButton.element).click();
        });
        it(' keydown key test case', function () {
            daterangepicker.element.value = '05/31/2018 - 06/12/2018 ';
            daterangepicker.element.focus();
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
            keyEventArgs.action = 'moveright';
            daterangepicker.inputHandler(keyEventArgs);
        });
        it(' keydown key test case', function () {
            daterangepicker.element.value = '05/31/2018 - 06/12/2018 ';
            daterangepicker.element.focus();
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
            keyEventArgs.action = 'moveright';
            daterangepicker.inputHandler(keyEventArgs);
            keyEventArgs.action = 'moveleft';
            daterangepicker.inputHandler(keyEventArgs);
        });
        it(' keydown key test case', function () {
            daterangepicker.element.value = '05/31/2018 - 06/12/2018 ';
            daterangepicker.element.focus();
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
            keyEventArgs.action = 'moveright';
            daterangepicker.inputHandler(keyEventArgs);
            keyEventArgs.action = 'moveup';
            daterangepicker.inputHandler(keyEventArgs);
        });
        it(' down key with maxdays test case', function () {
            daterangepicker.maxDays = 5;
            daterangepicker.dataBind();
            daterangepicker.element.focus();
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
            keyEventArgs.action = 'enter';
            daterangepicker.inputHandler(keyEventArgs);
            keyEventArgs.action = 'movedown';
            daterangepicker.inputHandler(keyEventArgs);
        });
    });
    describe('KeyBoard action - Input element', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#date');
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('alt+DownArrow key test case', function () {
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
        });
        it('alt+Up Arrow key test case', function (done) {
            daterangepicker.show();
            setTimeout(() => {
                daterangepicker.inputElement.focus();
                keyEventArgs.action = 'altUpArrow';
                daterangepicker.inputHandler(keyEventArgs);
                expect(daterangepicker.isPopupOpen()).toBe(true);
                done();
            }, 450);
        });
        it(' alt+DownArrow key without input focus test case', function () {
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
            daterangepicker.startDate = new Date('03/03/2017');
            daterangepicker.endDate = new Date('04/03/2017');
            daterangepicker.dataBind();
            <HTMLElement>(daterangepicker.applyButton.element).click();
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
        });
        it(' space key test case', function () {
            daterangepicker.startDate = new Date('03/03/2017');
            daterangepicker.endDate = new Date('04/03/2017');
            daterangepicker.dataBind();
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
            keyEventArgs.action = 'spacebar';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            daterangepicker.keyInputHandler(keyEventArgs);
        });
        it(' alt+DownArrow key without input focus test case', function () {
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
            daterangepicker.startDate = new Date('03/03/2017');
            daterangepicker.endDate = new Date('04/03/2017');
            daterangepicker.dataBind();
            <HTMLElement>(daterangepicker.applyButton.element).click();
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
        });
        it(' alt+UpArrow key test case', function () {
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.inputHandler(keyEventArgs);
            keyEventArgs.action = 'altUpArrow';
            daterangepicker.inputHandler(keyEventArgs);
            // expect(daterangepicker.isPopupOpen()).toBe(false);
        });

        it(' escape key test case', function () {
            keyEventArgs.action = 'escape';
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(false);
        });
        it(' enter key test case', function () {
            keyEventArgs.action = 'enter';
            daterangepicker.element.value = '3/3/2017 - 4/4/2017';
            daterangepicker.element.focus();
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.element.value).toBe('3/3/2017 - 4/4/2017');
            expect(+daterangepicker.startDate === +new Date('3/3/2017')).toBe(true);
        });
        it(' tab key test case', function () {
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            keyEventArgs.action = 'tab';
            daterangepicker.element.value = '3/3/2017 - 4/4/2017';
            daterangepicker.element.focus();
            daterangepicker.inputHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(false);
        });
    });

    describe('Disabled', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter',
            target: 'target'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker({
                startDate: new Date('9/1/2017'), endDate: new Date('9/8/2017'),
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() === 2 || args.date.getDate() === 9) {
                        args.isDisabled = true;
                    }
                }
            });
            daterangepicker.appendTo('#date');
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Disabled Date test case', function () {
            (daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            (daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.keyInputHandler(keyEventArgs);
            keyEventArgs.action = 'moveRight';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            // let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-start-date'));
            // daterangepicker.keyInputHandler(keyEventArgs);
            // expect(+daterangepicker.currentDate === focusedDate.setDate(focusedDate.getDate() + 2)).toBe(true);
        });
    });
    describe('KeyBoard action - Calendar element', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter',
            target: 'target'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#date');
            daterangepicker.show();
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('move left key test case', function () {
            keyEventArgs.action = 'moveLeft';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date:not(.e-today)'));
            expect(focusedDate.setDate(focusedDate.getDate() - 1) === +currentDate).toBe(true);
        });
        it('AltUpArrow test case', function (done) {
            daterangepicker.startDate = new Date('10/10/2016');
            daterangepicker.endDate = new Date('11/11/2016');
            daterangepicker.dataBind();
            daterangepicker.show();
            daterangepicker.inputElement.focus();
            setTimeout(() => {
                expect(daterangepicker.isPopupOpen()).toBe(true);
                keyEventArgs.action = 'altUpArrow';
                daterangepicker.keyInputHandler(keyEventArgs);
                done();
            }, 450);
        });
        it('move left key test case - switch calendar', function () {
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('9/21/2017'), endDate: new Date('10/1/2017') });
            (<HTMLElement>daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            daterangepicker.show();
            keyEventArgs.action = 'moveLeft';
            keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            // daterangepicker.keyInputHandler(keyEventArgs);
            // let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-end-date'));
            // let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            // expect(focusedDate.setDate(focusedDate.getDate() - 1) === +currentDate).toBe(true);
        });
        it('move right key test case', function () {
            keyEventArgs.action = 'moveRight';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date:not(.e-today)'));
            expect(focusedDate.setDate(focusedDate.getDate() + 1) === +currentDate).toBe(true);
        });
        it('move right key test case-switch calendar', function () {
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('9/30/2017'), endDate: new Date('10/10/2017') });
            (<HTMLElement>daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            daterangepicker.show();
            keyEventArgs.action = 'moveRight';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            // daterangepicker.keyInputHandler(keyEventArgs);
            // let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-start-date'));  
            // let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            // expect(focusedDate.setDate(focusedDate.getDate() + 1) === +currentDate).toBe(true);
        });
        it('move up key test case', function () {
            keyEventArgs.action = 'moveUp';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date:not(.e-today)'));
            expect(focusedDate.setDate(focusedDate.getDate() - 7) === +currentDate).toBe(true);
        });
        it('move up key test case -switch calendar', function () {
            daterangepicker.destroy();
            daterangepicker = createControl({ startDate: new Date('9/21/2017'), endDate: new Date('10/1/2017') });
            (<HTMLElement>daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            daterangepicker.show();
            keyEventArgs.action = 'moveUp';
            // daterangepicker.keyInputHandler(keyEventArgs);
            // keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            // let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-end-date'));

            // let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            // expect(focusedDate.setDate(focusedDate.getDate() - 7) === +currentDate).toBe(true);
        });
        it('move down key test case', function () {
            keyEventArgs.action = 'moveDown';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date:not(.e-today)'));
            expect(focusedDate.setDate(focusedDate.getDate() + 7) === +currentDate).toBe(true);
        });
        it('home key test case', function () {
            keyEventArgs.action = 'home';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            expect(focusedDate.setDate(1) === +currentDate).toBe(true);
        });
        it('end key test case', function () {
            keyEventArgs.action = 'end';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            expect(+new Date(focusedDate.getFullYear(), focusedDate.getMonth() + 1, 0, focusedDate.getHours(), focusedDate.getMinutes(), focusedDate.getMilliseconds()) === +currentDate.setSeconds(0)).toBe(true);
        });
        it('control Home key test case', function () {
            keyEventArgs.action = 'controlHome';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date;
            let focusedDateLength = daterangepicker.popupObj.element.querySelectorAll('.e-focused-date').length;
            if (focusedDateLength === 2) {
                currentDate = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelectorAll('.e-focused-date')[1]);
            }
            else {
                currentDate = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            }
            expect(+new Date(focusedDate.getFullYear(), 0, 1) === +currentDate).toBe(true);
        });
        it('control end test case', function () {
            keyEventArgs.action = 'controlEnd';
            keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.rightCalendar.querySelectorAll('td')[10]);
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.rightCalendar.querySelector('.e-focused-date'));
            expect(+new Date(focusedDate.getFullYear(), 11, 31) === +currentDate).toBe(true);
        });
        it('page up test case', function () {
            keyEventArgs.action = 'pageUp';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            daterangepicker.addMonths(focusedDate, -1);
            expect(+focusedDate === +currentDate).toBe(true);
        });
        it('page down test case', function () {
            keyEventArgs.action = 'pageDown';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.leftCalendar.querySelector('.e-focused-date'));
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.rightCalendar.querySelector('.e-focused-date'));
            daterangepicker.addMonths(focusedDate, 1);
            expect(+focusedDate === +currentDate).toBe(true);
        });
        it('shift page up test case', function () {
            keyEventArgs.action = 'shiftPageUp';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            daterangepicker.addYears(focusedDate, -1);
            expect(+focusedDate === +currentDate).toBe(true);
        });
        it('shift page down test case', function () {
            keyEventArgs.action = 'shiftPageDown';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.leftCalendar.querySelector('.e-focused-date'));
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.rightCalendar.querySelector('.e-focused-date'));
            daterangepicker.addYears(focusedDate, 1);
            expect(+focusedDate === +currentDate).toBe(true);
        });
        it('select test case - start value', function () {
            keyEventArgs.action = 'moveLeft';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            keyEventArgs.action = 'select';
            daterangepicker.keyInputHandler(keyEventArgs);
            expect(+daterangepicker.startValue === +currentDate).toBe(true);
        });
        it('select test case - end date', function () {
            keyEventArgs.action = 'moveLeft';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            daterangepicker.keyInputHandler(keyEventArgs);
            keyEventArgs.action = 'select';
            daterangepicker.keyInputHandler(keyEventArgs);
            keyEventArgs.action = 'moveRight';
            keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.rightCalendar.querySelector('.e-focused-date'));
            keyEventArgs.action = 'select';
            daterangepicker.keyInputHandler(keyEventArgs);
            expect(+daterangepicker.endValue === +currentDate).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-range-hover').length > 0).toBe(true);
        });
        it('control Home key test case - right Calendar', function () {
            keyEventArgs.action = 'moveRight';
            keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            daterangepicker.keyInputHandler(keyEventArgs);
            keyEventArgs.action = 'controlHome';
            keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.rightCalendar.querySelectorAll('td')[10]);
            daterangepicker.keyInputHandler(keyEventArgs);
            focusedDate.setDate(2);
            let focusedDateLength = daterangepicker.popupObj.element.querySelectorAll('.e-focused-date').length;
            let currentDate: Date;
            if (focusedDateLength === 2) {
                currentDate = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelectorAll('.e-focused-date')[1]);
            }
            else {
                currentDate = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            }
            expect(+new Date(focusedDate.getFullYear(), 0, 1) === +currentDate).toBe(true);
        });
        it('control end test case - left Calendar restricted', function () {
            keyEventArgs.action = 'controlEnd';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.leftCalendar.querySelector('.e-focused-date'));
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date;
            if (daterangepicker.rightCalendar.querySelector('.e-focused-date') !== null) {
                currentDate = daterangepicker.getIdValue(null, daterangepicker.rightCalendar.querySelector('.e-focused-date'));
            } else {
                currentDate = daterangepicker.getIdValue(null, daterangepicker.leftCalendar.querySelector('.e-focused-date'));
            }
            expect(+new Date(focusedDate.getFullYear(), 11, 31) === +currentDate).toBe(true);
        });
        it('page up key test case - right Calendar', function () {
            keyEventArgs.action = 'moveRight';
            keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            daterangepicker.keyInputHandler(keyEventArgs);
            keyEventArgs.action = 'pageUp';
            keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.rightCalendar.querySelectorAll('td')[10]);
            daterangepicker.keyInputHandler(keyEventArgs);
            focusedDate.setDate(2);
            let focusedDateLength = daterangepicker.popupObj.element.querySelectorAll('.e-focused-date').length;
            let currentDate: Date;
            if (focusedDateLength === 2) {
                currentDate = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelectorAll('.e-focused-date')[1]);
            }
            else {
                currentDate = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            }
            daterangepicker.addMonths(focusedDate, -1);
            expect(+focusedDate === +currentDate).toBe(true); // not moved
        });
        it('page down test case - left Calendar restricted', function () {
            keyEventArgs.action = 'pageDown';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.leftCalendar.querySelector('.e-focused-date'));
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.rightCalendar.querySelector('.e-focused-date'));
            daterangepicker.addMonths(focusedDate, 1);
            expect(+focusedDate === +currentDate).toBe(true);
        });
        it('shift page up key test case - right Calendar restricted', function () {
            keyEventArgs.action = 'moveRight';
            keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            daterangepicker.keyInputHandler(keyEventArgs);
            keyEventArgs.action = 'shiftPageUp';
            keyEventArgs.target = daterangepicker.rightCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.rightCalendar.querySelectorAll('td')[10]);
            daterangepicker.keyInputHandler(keyEventArgs);
            focusedDate.setDate(2);
            daterangepicker.addYears(focusedDate, -1);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            expect(+focusedDate === +currentDate).toBe(true);
        });
        it('shift page down test case - left Calendar restricted', function () {
            keyEventArgs.action = 'shiftPageDown';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.leftCalendar.querySelector('.e-focused-date'));
            daterangepicker.keyInputHandler(keyEventArgs);
            let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.rightCalendar.querySelector('.e-focused-date'));
            daterangepicker.addYears(focusedDate, 1);
            expect(+focusedDate === +currentDate).toBe(true);
        });
        it('Escape action', function () {
            keyEventArgs.action = 'escape';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            daterangepicker.popupKeyActionHandle(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(false);
        });
        it('Escape action with altdown keys', function () {
            keyEventArgs.action = 'altUpArrow';
            daterangepicker.keyInputHandler(keyEventArgs);
            daterangepicker.element.focus();
            keyEventArgs.action = 'altDownArrow';
            daterangepicker.inputHandler(keyEventArgs);
            keyEventArgs.action = 'escape';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            daterangepicker.popupKeyActionHandle(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(false);
        });
    });
    describe('KeyBoard action - popup element', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter',
            target: 'target'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('escape key', function () {
            keyEventArgs.action = 'escape';
            daterangepicker.popupKeyActionHandle(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(false);
        });
        it('escape key', function () {
            keyEventArgs.action = 'escape';
            daterangepicker.popupCloseHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
        });
        it('tab key', function () {
            keyEventArgs.action = 'tab';
            daterangepicker.popupKeyActionHandle(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(false);
        });
        it('enter key', function () {
            keyEventArgs.action = 'escape';
            daterangepicker.popupKeyActionHandle(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(false);
            keyEventArgs.action = 'enter';
            daterangepicker.popupKeyActionHandle(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
        });
    });




    describe('KeyBoard action - presets element', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter',
            target: 'target'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker({
                //same date value will gives milli seconds difference leads error class
                //startDate: new Date(), endDate: new Date(),
                startDate: new Date(), endDate: new Date(new Date().setDate(new Date().getDate() + 6)),
                presets: [
                    { label: 'Today', start: new Date(), end: new Date() },
                    { label: 'Last Week', start: new Date(new Date().setDate(new Date().getDate() - 6)), end: new Date() },
                    { label: 'Last Month', start: new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)), end: new Date() },
                    { label: 'Last Year', start: new Date(new Date().getFullYear() - 1, 0, 1), end: new Date() },
                ]
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('First presets element selected', function () {
            (daterangepicker.presetElement.querySelectorAll('li')[0]).click();
            keyEventArgs.action = 'moveDown';
            expect(daterangepicker.presetElement.querySelector('.e-hover') === null).toBe(true);
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            expect(daterangepicker.presetElement.querySelector('.e-hover') !== null).toBe(true);
        });
        it('next presets element selected', function () {
            (daterangepicker.presetElement.querySelectorAll('li')[0]).click();
            keyEventArgs.action = 'moveDown';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            expect(daterangepicker.presetElement.querySelectorAll('li')[1].classList.contains('e-hover')).toBe(false);
            expect(daterangepicker.presetElement.querySelectorAll('li')[2].classList.contains('e-hover')).toBe(true);
        });
        it('next presets element selected', function () {
            (daterangepicker.presetElement.querySelectorAll('li')[0]).click();
            keyEventArgs.action = 'tab';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(false);
        });
        it('previous presets element selected', function () {
            (daterangepicker.presetElement.querySelectorAll('li')[0]).click();
            keyEventArgs.action = 'moveDown';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            keyEventArgs.action = 'moveUp';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            expect(daterangepicker.presetElement.querySelectorAll('li')[0].classList.contains('e-hover')).toBe(false);
            expect(daterangepicker.presetElement.querySelectorAll('li')[1].classList.contains('e-hover')).toBe(true);
        });
        it('Active preset element', function () {
            (daterangepicker.presetElement.querySelectorAll('li')[0]).click();
            keyEventArgs.action = 'moveDown';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            keyEventArgs.action = 'enter';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(false);
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.presetElement.querySelector('.e-active') !== null).toBe(true);
        });
        it('Active hover element - down', function () {
            (daterangepicker.presetElement.querySelectorAll('li')[0]).click();
            keyEventArgs.action = 'moveDown';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            keyEventArgs.action = 'enter';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(false);
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.presetElement.querySelector('.e-active') !== null).toBe(true);
            keyEventArgs.action = 'moveDown';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            let nextElement: HTMLElement = daterangepicker.presetElement.querySelector('.e-active').nextElementSibling;
            expect(nextElement.classList.contains('e-hover')).toBe(true);
        });
        it('Active hover element - up', function () {
            (daterangepicker.presetElement.querySelectorAll('li')[0]).click();
            keyEventArgs.action = 'moveDown';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            daterangepicker.presetKeyActionHandler(keyEventArgs)
            keyEventArgs.action = 'enter';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(false);
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.presetElement.querySelector('.e-active') !== null).toBe(true);
            keyEventArgs.action = 'moveUp';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            let previousElement: HTMLElement = daterangepicker.presetElement.querySelector('.e-active').previousElementSibling;
            expect(previousElement.classList.contains('e-hover')).toBe(true);
            keyEventArgs.action = 'tab';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
        });
        it('Focus moved to calendar - custom range', function () {
            (daterangepicker.presetElement.querySelectorAll('li')[4]).click();
            keyEventArgs.action = 'moveDown';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            // daterangepicker.keyInputHandler(keyEventArgs);
            // let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date:not(.e-today)'));
            // expect(+currentDate === focusedDate.setDate(focusedDate.getDate() + 7)).toBe(true);
        });
        it('Focus moved to presets', function () {
            <HTMLElement>(daterangepicker.presetElement.querySelectorAll('li')[4]).click();
            keyEventArgs.action = 'moveDown';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            // daterangepicker.keyInputHandler(keyEventArgs);
            // let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date:not(.e-today)'));
            // expect(+currentDate === focusedDate.setDate(focusedDate.getDate() + 7)).toBe(true);
            keyEventArgs.action = 'shiftTab';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            daterangepicker.keyInputHandler(keyEventArgs);
            keyEventArgs.action = 'moveUp';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            expect(daterangepicker.presetElement.querySelector('.e-hover') !== null).toBe(true);
        });
        it('Focus moved to calendar again', function () {
            <HTMLElement>(daterangepicker.presetElement.querySelectorAll('li')[4]).click();
            keyEventArgs.action = 'moveDown';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            let focusedDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date'));
            // daterangepicker.keyInputHandler(keyEventArgs);
            // let currentDate: Date = daterangepicker.getIdValue(null, daterangepicker.popupObj.element.querySelector('.e-focused-date:not(.e-today)'));
            // expect(+currentDate === focusedDate.setDate(focusedDate.getDate() + 7)).toBe(true);
            keyEventArgs.action = 'shiftTab';
            keyEventArgs.action = 'shiftTab';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            // daterangepicker.keyInputHandler(keyEventArgs);
            // keyEventArgs.action = 'moveUp';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            // expect(daterangepicker.presetElement.querySelector('.e-hover') !== null).toBe(true);
            keyEventArgs.action = 'moveDown';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            keyEventArgs.action = 'enter';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            expect(daterangepicker.presetElement.querySelector('.e-hover') === null).toBe(true);
        });
        it('tab key test case', function () {
            (daterangepicker.presetElement.querySelectorAll('li')[4]).click();
            keyEventArgs.action = 'tab';
            daterangepicker.presetKeyActionHandler(keyEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
        });
    });
    describe('format testing - Desktop', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Default format test case', function () {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017') });
            expect(daterangepicker.format === null && daterangepicker.inputElement.value === '2/24/2017 - 8/10/2017').toBe(true);
        });
        it('format(y) test case', function () {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), format: 'y', endDate: new Date('08/10/2017') });
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length > 0 && daterangepicker.popupObj.element.querySelectorAll('.e-end-date').length > 0).toBe(true);
            expect(daterangepicker.format === 'y' && daterangepicker.inputElement.value === '2017 - 2017').toBe(true);
        });
        it('format(dddd/MMMM/yyyy) test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), format: 'dddd/MMMM/yyyy' });
            expect(daterangepicker.element.value).toBe('24/February/2017 - 10/August/2017');
        });
        it('custom format test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), format: 'ddd/MMMMTet/y' });
            expect(daterangepicker.element.value).toBe('24/FebruaryTet/2017 - 10/AugustTet/2017');
        });
        it(' format(MMMM) test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), format: 'MMMM' });
            expect(daterangepicker.element.value).toBe('February - August');
        });
        it(' invalid format test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), format: 'ssss' });
            expect(daterangepicker.element.value).toBe('0 - 0');
            expect(daterangepicker.startDate !== null && daterangepicker.endDate !== null).toBe(true);
        });
        it(' invalid format test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), format: 'MMMM' });
            expect(daterangepicker.element.value).toBe('February - August');
            daterangepicker.element.value = '02/24/2017 - 03/24/2017';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            expect(daterangepicker.startDate === null && daterangepicker.endDate === null && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('Update format test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), format: 'MMMM' });
            expect(daterangepicker.element.value).toBe('February - August');
            daterangepicker.format = 'd/M/yy';
            daterangepicker.dataBind();
            expect(daterangepicker.format).toBe('d/M/yy');
            expect(daterangepicker.element.value).toBe('24/2/17 - 10/8/17');
        });
        it(' Interaction format(MMMM) test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/2/2017'), endDate: new Date('2/10/2017'), format: 'MMMM' });
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            elements.leftCalNexticon.dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]).click();
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[15]).click();
            <HTMLElement>(daterangepicker.applyButton.element).click();
            expect(daterangepicker.element.value).toBe('February - February');
        });
    });
    describe('format testing - Device', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Default format test case', function () {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017') }, true);
            expect(daterangepicker.format === null && daterangepicker.inputElement.value === '2/24/2017 - 8/10/2017').toBe(true);
        });
        it('format(y) test case', function () {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), format: 'y', endDate: new Date('08/10/2017') }, true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-start-date').length > 0).toBe(true);
            expect(daterangepicker.format === 'y' && daterangepicker.inputElement.value === '2017 - 2017').toBe(true);
        });
        it('format(dddd/MMMM/yyyy) test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), format: 'dddd/MMMM/yyyy' }, true);
            expect(daterangepicker.element.value).toBe('24/February/2017 - 10/August/2017');
        });
        it('custom format test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), format: 'ddd/MMMMTet/y' }, true);
            expect(daterangepicker.element.value).toBe('24/FebruaryTet/2017 - 10/AugustTet/2017');
        });
        it(' format(MMMM) test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), format: 'MMMM' }, true);
            expect(daterangepicker.element.value).toBe('February - August');
        });
        it('invalid format test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), format: 'ssss' }, true);
            expect(daterangepicker.element.value).toBe('0 - 0');
            expect(daterangepicker.startDate !== null && daterangepicker.endDate !== null).toBe(true);
        });
        it('invalid value (format) test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), format: 'MMMM' }, true);
            expect(daterangepicker.element.value).toBe('February - August');
            daterangepicker.element.value = '02/24/2017 - 03/24/2017';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            expect(daterangepicker.startDate === null && daterangepicker.endDate === null && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('Update format test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), format: 'MMMM' }, true);
            expect(daterangepicker.element.value).toBe('February - August');
            daterangepicker.format = 'd/M/yy';
            daterangepicker.dataBind();
            expect(daterangepicker.format).toBe('d/M/yy');
            expect(daterangepicker.element.value).toBe('24/2/17 - 10/8/17');
        });
        it(' Interaction format(MMMM) test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/2/2017'), endDate: new Date('2/10/2017'), format: 'MMMM' }, true);
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            elements.nextIcon.dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[15]).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            expect(daterangepicker.element.value).toBe('March - March');
        });
    });
    /**
     * Internationalization related test case
     */
    describe('Internationalization', function () {
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Default Locale test case', function () {
            daterangepicker = createControl();
            expect(daterangepicker.locale === 'en-US').toBe(true);
        });
        it('Locale test case de', function () {
            daterangepicker = createControl({ locale: 'de' });
            expect(daterangepicker.locale === 'de').toBe(true);
        });
        it('Update Locale test case', function () {
            daterangepicker = createControl({ placeholder: 'Select Range' });
            daterangepicker.locale = 'de';
            daterangepicker.dataBind();
            expect(daterangepicker.locale === 'de').toBe(true);
            expect(daterangepicker.element.getAttribute('aria-placeholder') === daterangepicker.l10n.getConstant('placeholder')).toBe(true);
        });
        it('Update Locale test case(ja)', function () {
            daterangepicker = createControl({ placeholder: 'Select Range' });
            daterangepicker.locale = 'ja';
            daterangepicker.dataBind();
            expect(daterangepicker.locale === 'ja').toBe(true);
            expect(daterangepicker.element.getAttribute('aria-placeholder') === daterangepicker.l10n.getConstant('placeholder')).toBe(true);
        });
        it('Update Locale range test case', function () {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017') });
            daterangepicker.locale = 'de';
            daterangepicker.dataBind();
            expect(daterangepicker.locale === 'de').toBe(true);
            expect(daterangepicker.inputElement.value === '24.2.2017 - 10.8.2017').toBe(true);
        });
        it('Locale format(MMMM) test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('10/10/2017'), locale: 'de', format: 'MMMM' });
            expect(daterangepicker.element.value).toBe('Februar - Oktober');
        });
        it('Locale format(MMMM) test case ', () => {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('10/10/2017'), locale: 'de', format: 'MMMM' });
            expect(daterangepicker.element.value).toBe('Februar - Oktober');
        });
        it('Update Locale range test case(ja)', function () {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), format: null });
            daterangepicker.locale = 'ja';
            daterangepicker.dataBind();
            expect(daterangepicker.locale === 'ja').toBe(true);
            expect(daterangepicker.inputElement.value === '2017/2/24 - 2017/8/10').toBe(true);
        });
        // it('Update Locale range test case(vi)', function () {
        //     daterangepicker = createControl({startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), format : null});
        //     daterangepicker.locale = 'vi';
        //     daterangepicker.dataBind();
        //     expect(daterangepicker.locale === 'vi').toBe(true);
        //     expect(daterangepicker.inputElement.value === '24/2/2017 - 10/8/2017').toBe(true);
        // });
        it('Interaction Locale test case(de)', function () {
            daterangepicker = createControl({ format: null, locale: 'de' });
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            elements.leftCalNexticon.dispatchEvent(clickEvent);
            let startEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
            let endEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[19]);
            let startValue: Date = daterangepicker.getIdValue(null, startEle);
            let endValue: Date = daterangepicker.getIdValue(null, endEle);
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            expect(daterangepicker.element.value).toBe(daterangepicker.globalize.formatDate(startValue, { format: this.format, type: 'date', skeleton: 'yMd' }) + ' - ' + daterangepicker.globalize.formatDate(endValue, { format: this.format, type: 'date', skeleton: 'yMd' }));
        });
        it('Interaction Locale test case(ja)', function () {
            daterangepicker = null;
            daterangepicker = createControl({ format: null, locale: 'ja' });
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            elements.leftCalNexticon.dispatchEvent(clickEvent);
            let startEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
            let endEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[19]);
            let startValue: Date = daterangepicker.getIdValue(null, startEle);
            let endValue: Date = daterangepicker.getIdValue(null, endEle);
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            expect(daterangepicker.element.value).toBe(daterangepicker.globalize.formatDate(startValue, { format: this.format, type: 'date', skeleton: 'yMd' }) + ' - ' + daterangepicker.globalize.formatDate(endValue, { format: this.format, type: 'date', skeleton: 'yMd' }));
        });
        // it('Interaction Locale test case(vi)', function () {
        //     daterangepicker = createControl({format : null, locale: 'vi'});
        //     let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
        //   elements.leftCalNexticon.dispatchEvent(clickEvent);
        //     let startEle: HTMLElement =  <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
        //     let endEle: HTMLElement =  <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[19]);
        //     let startValue: Date = daterangepicker.getIdValue(null, startEle);
        //     let endValue: Date = daterangepicker.getIdValue(null, endEle);
        //     (startEle).dispatchEvent(clickEvent);
        //    (endEle).dispatchEvent(clickEvent);
        //     <HTMLElement>(daterangepicker.applyButton.element).click();
        //      expect(daterangepicker.element.value).toBe(daterangepicker.globalize.formatDate(startValue, { format: this.format, type: 'date', skeleton: 'yMd' }) +' - ' + daterangepicker.globalize.formatDate(endValue, { format: this.format, type: 'date', skeleton: 'yMd' }));
        // });
        it('Locale label test case(de)', function () {
            daterangepicker = null;
            daterangepicker = createControl({ locale: 'de' });
            expect(daterangepicker.locale === 'de').toBe(true);
            expect(daterangepicker.l10n.getConstant('startLabel') === daterangepicker.popupObj.element.querySelector('.e-start-label').text).toBe(true);
            expect(daterangepicker.l10n.getConstant('endLabel') === daterangepicker.popupObj.element.querySelector('.e-end-label').text).toBe(true);
        });
        it('Locale label test case(ja)', function () {
            daterangepicker = null;
            daterangepicker = createControl({ locale: 'ja' });
            expect(daterangepicker.locale === 'ja').toBe(true);
            expect(daterangepicker.l10n.getConstant('startLabel') === daterangepicker.popupObj.element.querySelector('.e-start-label').text).toBe(true);
        });
        // it('Locale label test case(vi)', function () {
        //     daterangepicker = createControl({locale: 'vi'});
        //     expect(daterangepicker.locale === 'vi').toBe(true);
        //     expect(daterangepicker.l10n.getConstant('startLabel') === daterangepicker.popupObj.element.querySelector('.e-start-label').text).toBe(true);
        // });
    });
    describe('Locale with hidden input testing', function () {
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Hidden input value test case with de culture', function () {
            daterangepicker = null;
            daterangepicker = createControl({ value: [new Date("1/1/2019"), new Date("1/20/2019")] });
            daterangepicker.locale = 'de';
            expect(daterangepicker.firstHiddenChild.value === daterangepicker.globalize.formatDate(daterangepicker.startDate, { type: 'date', skeleton: 'yMd' })).toBe(true);
            expect(daterangepicker.secondHiddenChild.value === daterangepicker.globalize.formatDate(daterangepicker.endDate, { type: 'date', skeleton: 'yMd' })).toBe(true);
        });
    });
    describe('Check placeholder after load culture', () => {
        let daterangepicker: any;
        L10n.load({
            'en-US': {
                'daterangepicker': { placeholder: 'Select a range' }
            },
            'de': {
                'daterangepicker': { placeholder: 'Einen Bereich auswählen' }
            },
            'vi': {
                'daterangepicker': { placeholder: 'Chọn một phạm vi' }
            },
        });
        beforeEach((): void => {
            daterangepicker = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'daterange' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Pass placeholder through l10n load', () => {
            daterangepicker = new DateRangePicker({ floatLabelType: 'Auto', locale: 'en-US' });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.placeholder).toEqual('Select a range');
        });
        it('Pass placeholder through l10n load in de culture', () => {
            daterangepicker = new DateRangePicker({ floatLabelType: 'Auto', locale: 'de' });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.placeholder).toEqual('Einen Bereich auswählen');
        });
        it('Set placeholder through API', () => {
            daterangepicker = new DateRangePicker({ floatLabelType: 'Auto', locale: 'vi', placeholder: 'Testo daterange' });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.placeholder).toEqual('Testo daterange');
        });
    });
    describe('Special Dates,weekNumber, disabled Dates and firstDayofWeek - Desktop', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Special Date created', function () {
            daterangepicker = createControl({
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() === 10 || args.date.getDate() === 15) {
                        args.element.className = 'e-icons highlight';
                        args.element.setAttribute("title", "Have a nice day");
                    }
                }
            });
            expect(daterangepicker.popupObj.element.querySelectorAll('.highlight').length > 0).toBe(true);
        });
        it('firstDayOfWeek test case', function () {
            daterangepicker = createControl({ firstDayOfWeek: 2 });
            expect(document.querySelectorAll('.e-content th')[0].textContent).toBe('Tu');
            expect(document.querySelectorAll('.e-left-calendar .e-content th')[0].textContent == 'Tu' && document.querySelectorAll('.e-right-calendar .e-content th')[0].textContent == 'Tu').toBe(true);
        });
        it('Week number test case', function () {
            daterangepicker = createControl({ weekNumber: true });
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-week-number').length > 0).toBe(true);
        });
        it('Week number not selected in range test case', function () {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), weekNumber: true });
            expect(daterangepicker.popupObj.element.querySelector('.e-week-number').classList.contains('.e-range-hover')).toBe(false);
        });
        it('Week number not selected in interaction range test case', function () {
            daterangepicker = createControl({ weekNumber: true });
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]).click();;
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[19]).click();
            expect(daterangepicker.popupObj.element.querySelector('.e-week-number').classList.contains('.e-range-hover')).toBe(false);
        });
        it('Week number not selected  test case', function () {
            daterangepicker = createControl({ weekNumber: true });
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-week-number')).click();;
            expect(daterangepicker.popupObj.element.querySelector('.e-week-number').classList.contains('.e-start-date')).toBe(false);
        });
        it('Disabled Date test case', function () {
            daterangepicker = createControl({
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() === 10 || args.date.getDate() === 15) {
                        args.isDisabled = true;
                    }
                }
            });
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-disabled').length > 0).toBe(true);
        });
        it('Min and Max Disabled Date test case', function () {
            daterangepicker = createControl({
                startDate: new Date('10/11/2017'), endDate: new Date('10/15/2017'), min: new Date('10/10/2017'), max: new Date('10/15/2017'),
                renderDayCell: function (args: any): void {
                    if (+args.date === +new Date('10/10/2017') || +args.date === +new Date('10/15/2017')) {
                        args.isDisabled = true;
                    }
                }
            });
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && +daterangepicker.startDate === +new Date('10/11/2017') && +daterangepicker.endDate === + new Date('10/15/2017')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('*[id^="/id"]'.replace('/id', '' + (+new Date('10/10/2017')))).classList.contains('e-disabled') && daterangepicker.popupObj.element.querySelector('*[id^="/id"]'.replace('/id', '' + (+new Date('10/15/2017')))).classList.contains('e-disabled')).toBe(true);
        });
        it('Disabled Date in range test case(error class)', function () {
            daterangepicker = createControl({
                startDate: new Date('10/10/2017'), endDate: new Date('10/15/2017'),
                renderDayCell: function (args: any): void {
                    if (+args.date === +new Date('10/10/2017') || +args.date === +new Date('10/15/2017')) {
                        args.isDisabled = true;
                    }
                }
            });
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('Disabled Date in range with header update in endDate disabled test case', function () {
            daterangepicker = createControl({
                startDate: new Date('1/1/2017'), endDate: new Date('1/3/2017'),
                renderDayCell: function (args: any): void {
                    if (+args.date === +new Date('1/3/2017')) {
                        args.isDisabled = true;
                    }
                }
            });
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(+daterangepicker.startDate).toBe(+new Date('1/1/2017'));
            expect(+daterangepicker.endDate).toBe(+new Date('1/3/2017'));
            expect(daterangepicker.popupObj.element.querySelector('.e-start-label').textContent).toBe("Start Date");
            expect(daterangepicker.popupObj.element.querySelector('.e-end-label').textContent).toBe("End Date");
            expect(daterangepicker.popupObj.element.querySelector('.e-day-span').textContent).toBe("Selected Days");
        });
        it('Disabled Date in range with header update in startDate disabled test case', function () {
            daterangepicker = createControl({
                startDate: new Date('1/1/2017'), endDate: new Date('1/3/2017'),
                renderDayCell: function (args: any): void {
                    if (+args.date === +new Date('1/1/2017')) {
                        args.isDisabled = true;
                    }
                }
            });
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(+daterangepicker.startDate).toBe(+new Date('1/1/2017'));
            expect(+daterangepicker.endDate).toBe(+new Date('1/3/2017'));
            expect(daterangepicker.popupObj.element.querySelector('.e-start-label').textContent).toBe("Start Date");
            expect(daterangepicker.popupObj.element.querySelector('.e-end-label').textContent).toBe("End Date");
            expect(daterangepicker.popupObj.element.querySelector('.e-day-span').textContent).toBe("Selected Days");
        });

        it('Disabled Date in enter test case(error class)', function () {
            daterangepicker = createControl({
                startDate: new Date('10/11/2017'), endDate: new Date('10/19/2017'),
                renderDayCell: function (args: any): void {
                    if (+args.date === +new Date('10/10/2017') || +args.date === +new Date('10/15/2017')) {
                        args.isDisabled = true;
                    }
                }
            });
            daterangepicker.element.value = '10/11/2017 - 10/15/2017';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('Disabled Date in dataBind test case(error class)', function () {
            daterangepicker = createControl({
                startDate: new Date('10/11/2017'), endDate: new Date('10/19/2017'),
                renderDayCell: function (args: any): void {
                    if (+args.date === +new Date('10/10/2017') || +args.date === +new Date('10/15/2017')) {
                        args.isDisabled = true;
                    }
                }
            });
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            daterangepicker.endDate = new Date('10/15/2017');
            daterangepicker.dataBind();
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('Disabled Date not selected interaction', function () {
            daterangepicker = createControl({
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() === 10 || args.date.getDate() === 15) {
                        args.isDisabled = true;
                    }
                }
            });
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-disabled')).click();;
            expect(daterangepicker.popupObj.element.querySelector('.e-disabled').classList.contains('.e-start-date')).toBe(false);
        });
    });
    describe('Special Dates,weekNumber, disabled Dates and firstDayofWeek - Device', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Special Date created', function () {
            daterangepicker = createControl({
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() === 10 || args.date.getDate() === 15) {
                        args.element.className = 'e-icons highlight';
                        args.element.setAttribute("title", "Have a nice day");
                    }
                }
            }, true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.highlight').length > 0).toBe(true);
        });
        it('firstDayOfWeek test case', function () {
            daterangepicker = createControl({ firstDayOfWeek: 2 }, true);
            expect(document.querySelectorAll('.e-content th')[0].textContent).toBe('Tu');
            expect(document.querySelectorAll('.e-calendar .e-content th')[0].textContent == 'Tu').toBe(true);
        });
        it('Week number test case', function () {
            daterangepicker = createControl({ weekNumber: true }, true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-week-number').length > 0).toBe(true);
        });
        it('Week number not selected in range test case', function () {
            daterangepicker = createControl({ startDate: new Date('02/24/2017'), endDate: new Date('08/10/2017'), weekNumber: true }, true);
            expect(daterangepicker.popupObj.element.querySelector('.e-week-number').classList.contains('.e-range-hover')).toBe(false);
        });
        it('Week number not selected in interaction range test case', function () {
            daterangepicker = createControl({ weekNumber: true }, true);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[19]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-week-number').classList.contains('.e-range-hover')).toBe(false);
        });
        it('Week number not selected  test case', function () {
            daterangepicker = createControl({ weekNumber: true }, true);
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-week-number')).click();;
            expect(daterangepicker.popupObj.element.querySelector('.e-week-number').classList.contains('.e-start-date')).toBe(false);
        });
        it('Disabled Date test case', function () {
            daterangepicker = createControl({
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() === 10 || args.date.getDate() === 15) {
                        args.isDisabled = true;
                    }
                }
            }, true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-disabled').length > 0).toBe(true);
        });
        it('Min and Max Disabled Date test case', function () {
            daterangepicker = createControl({
                startDate: new Date('10/11/2017'), endDate: new Date('10/15/2017'), min: new Date('10/10/2017'), max: new Date('10/15/2017'),
                renderDayCell: function (args: any): void {
                    if (+args.date === +new Date('10/10/2017') || +args.date === +new Date('10/15/2017')) {
                        args.isDisabled = true;
                    }
                }
            }, true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && +daterangepicker.startDate === +new Date('10/11/2017') && +daterangepicker.endDate === +new Date('10/15/2017')).toBe(true);
        });
        it('Disabled Date in range test case(error class)', function () {
            daterangepicker = createControl({
                startDate: new Date('10/10/2017'), endDate: new Date('10/15/2017'),
                renderDayCell: function (args: any): void {
                    if (+args.date === +new Date('10/10/2017') || +args.date === +new Date('10/15/2017')) {
                        args.isDisabled = true;
                    }
                }
            }, true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('Disabled Date in dataBind test case(error class)', function () {
            daterangepicker = createControl({
                startDate: new Date('10/11/2017'), endDate: new Date('10/19/2017'),
                renderDayCell: function (args: any): void {
                    if (+args.date === +new Date('10/10/2017') || +args.date === +new Date('10/15/2017')) {
                        args.isDisabled = true;
                    }
                }
            }, true);
            daterangepicker.endDate = new Date('10/15/2017');
            daterangepicker.dataBind();
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('Disabled Date not selected interaction', function () {
            daterangepicker = createControl({
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() === 10 || args.date.getDate() === 15) {
                        args.isDisabled = true;
                    }
                }
            }, true);
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-disabled')).click();;
            expect(daterangepicker.popupObj.element.querySelector('.e-disabled').classList.contains('.e-start-date')).toBe(false);
        });
    });
    describe('HTML attributes at inline element testing', () => {
        let daterangepicker: any;
        beforeEach((): void => {
            daterangepicker = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'daterange' });
            ele.setAttribute('placeholder', 'Enter a date');
            ele.setAttribute('readonly', '');
            ele.setAttribute('disabled', '');
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Inline element testing', () => {
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.placeholder).toBe("Enter a date");
            expect(daterangepicker.element.hasAttribute('readonly')).toBe(true);
            expect(daterangepicker.element.hasAttribute('enabled')).toBe(false);
        });
        it('Inline and API testing', () => {
            daterangepicker = new DateRangePicker({ placeholder: "Select a date", readonly: false, enabled: true });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.placeholder).toBe("Select a date");
            expect(daterangepicker.element.hasAttribute('readonly')).toBe(false);
            expect(daterangepicker.element.hasAttribute('disabled')).toBe(false);
        });
        it('Inline and html attributes API testing', () => {
            daterangepicker = new DateRangePicker({ htmlAttributes: { placeholder: "Choose a date", readonly: "false", disabled: "false" } });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.placeholder).toBe("Choose a date");
            expect(daterangepicker.element.hasAttribute('readonly')).toBe(false);
            expect(daterangepicker.element.hasAttribute('disabled')).toBe(false);
        });
        it('Inline, API and html attributes API testing', () => {
            daterangepicker = new DateRangePicker({ htmlAttributes: { placeholder: "Choose a date", readonly: "true", disabled: "" }, placeholder: "Select a date", readonly: false, enabled: true });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.placeholder).toBe("Select a date");
            expect(daterangepicker.element.hasAttribute('readonly')).toBe(false);
            expect(daterangepicker.element.hasAttribute('enabled')).toBe(false);
        });
    });

    describe('HTML attribute API testing', () => {
        let daterangepicker: any;
        beforeEach((): void => {
            daterangepicker = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'daterange' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('API testing', () => {
            daterangepicker = new DateRangePicker({ placeholder: "Select a date", readonly: false, enabled: true });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.placeholder).toBe("Select a date");
            expect(daterangepicker.element.hasAttribute('readonly')).toBe(false);
            expect(daterangepicker.element.hasAttribute('disabled')).toBe(false);
        });
        it('HTML attributes API testing', () => {
            daterangepicker = new DateRangePicker({ htmlAttributes: { placeholder: "Choose a date", readonly: "false", disabled: "false" } });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.placeholder).toBe("Choose a date");
            expect(daterangepicker.element.hasAttribute('readonly')).toBe(false);
            expect(daterangepicker.element.hasAttribute('disabled')).toBe(false);
        });
        it('API and HTML attributes API testing', () => {
            daterangepicker = new DateRangePicker({ htmlAttributes: { placeholder: "Choose a date", readonly: "true", disabled: "" }, placeholder: "Select a date", readonly: false, enabled: true });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.placeholder).toBe("Select a date");
            expect(daterangepicker.element.hasAttribute('readonly')).toBe(false);
            expect(daterangepicker.element.hasAttribute('enabled')).toBe(false);
        });
        it('Other attribute testing with htmlAttributes API', () => {
            daterangepicker = new DateRangePicker({ htmlAttributes: { class: "test", title: "sample" } });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.inputWrapper.container.getAttribute('title')).toBe('sample');
            expect(daterangepicker.inputWrapper.container.classList.contains('test')).toBe(true);
        });
    });
    describe('HTML attribute API dynamic testing', () => {
        let daterangepicker: any;
        beforeEach((): void => {
            daterangepicker = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'daterange' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Dynamically change attributes with htmlAttributes API', () => {
            daterangepicker = new DateRangePicker({ htmlAttributes: { placeholder: "Enter a date", readonly: "", disabled: "disabled", value: "2/20/2018", max: "2/25/2018", min: "2/10/2018", class: "test", title: "sample", style: 'background-color:yellow' } });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.element.getAttribute('placeholder')).toBe('Enter a date');
            expect(daterangepicker.element.hasAttribute('readonly')).toBe(true);
            expect(daterangepicker.element.hasAttribute('disabled')).toBe(true);
            expect(daterangepicker.element.value).toBe('2/20/2018');
            expect(daterangepicker.element.min).toBe('2/10/2018');
            expect(daterangepicker.element.max).toBe('2/25/2018');
            expect(daterangepicker.inputWrapper.container.getAttribute('title')).toBe('sample');
            expect(daterangepicker.inputWrapper.container.classList.contains('test')).toBe(true);
            expect(daterangepicker.inputWrapper.container.getAttribute('style')).toBe('background-color:yellow');
            daterangepicker.htmlAttributes = { placeholder: "choose a date", readonly: "false", disabled: "false", value: "4/20/2018", max: "4/25/2018", min: "4/10/2018", title: "heading" };
            daterangepicker.dataBind();
            expect(daterangepicker.element.getAttribute('placeholder')).toBe('choose a date');
            expect(daterangepicker.element.hasAttribute('readonly')).toBe(false);
            expect(daterangepicker.element.hasAttribute('disabled')).toBe(false);
            expect(daterangepicker.element.value).toBe('4/20/2018');
            expect(daterangepicker.element.min).toBe('4/10/2018');
            expect(daterangepicker.element.max).toBe('4/25/2018');
            expect(daterangepicker.inputWrapper.container.getAttribute('title')).toBe('heading');
        });
        it('Placeholder testing in auto case', () => {
            daterangepicker = new DateRangePicker({ floatLabelType: "Auto", htmlAttributes: { placeholder: "Enter a name" } });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter a name');
            daterangepicker.htmlAttributes = { placeholder: "choose a date" };
            daterangepicker.dataBind();
            expect(daterangepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            daterangepicker.floatLabelType = "Always";
            daterangepicker.dataBind();
            expect(daterangepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            daterangepicker.floatLabelType = "Never";
            daterangepicker.dataBind();
            expect(daterangepicker.element.getAttribute('placeholder')).toBe('choose a date');
        });
        it('Placeholder testing in always case', () => {
            daterangepicker = new DateRangePicker({ floatLabelType: "Always", htmlAttributes: { placeholder: "Enter a name" } });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter a name');
            daterangepicker.htmlAttributes = { placeholder: "choose a date" };
            daterangepicker.dataBind();
            expect(daterangepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            daterangepicker.floatLabelType = "Auto";
            daterangepicker.dataBind();
            expect(daterangepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            daterangepicker.floatLabelType = "Never";
            daterangepicker.dataBind();
            expect(daterangepicker.element.getAttribute('placeholder')).toBe('choose a date');
        });
        it('Placeholder testing in never case', () => {
            daterangepicker = new DateRangePicker({ floatLabelType: "Never", htmlAttributes: { placeholder: "Enter a name" } });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.element.getAttribute('placeholder')).toBe('Enter a name');
            daterangepicker.htmlAttributes = { placeholder: "choose a date" };
            daterangepicker.dataBind();
            expect(daterangepicker.element.getAttribute('placeholder')).toBe('choose a date');
            daterangepicker.floatLabelType = "Always";
            daterangepicker.dataBind();
            expect(daterangepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
            daterangepicker.floatLabelType = "Auto";
            daterangepicker.dataBind();
            expect(daterangepicker.element.getAttribute('placeholder')).toBe(null);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('choose a date');
        });
    });

    describe('HTML attribute API at inital rendering and dynamic rendering', () => {
        let daterangepicker: any;
        beforeEach((): void => {
            daterangepicker = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'daterange' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Html attributes at initial rendering', () => {
            daterangepicker = new DateRangePicker({ htmlAttributes: { placeholder: "Choose a date", class: "sample" } });
            daterangepicker.appendTo('#daterange');
            expect(daterangepicker.element.getAttribute('placeholder')).toBe('Choose a date');
            expect(daterangepicker.inputWrapper.container.classList.contains('sample')).toBe(true);
        });
        it('Pass multiple attributes dynamically', () => {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/24/2017'), endDate: new Date('8/10/2017') });
            daterangepicker.appendTo('#daterange');
            daterangepicker.htmlAttributes = { class: "sample", readonly: "true", disabled: "true" };
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/24/2017 - 8/10/2017');
            expect(daterangepicker.inputWrapper.container.classList.contains('sample')).toBe(true);
            expect(daterangepicker.element.hasAttribute('readonly')).toBe(true);
            expect(daterangepicker.element.hasAttribute('disabled')).toBe(true);
        });
        it('Dynamically change attributes through htmlAttributes API', () => {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/24/2017'), endDate: new Date('8/10/2017') });
            daterangepicker.appendTo('#daterange');
            daterangepicker.inputElement.value = "5/5/2019 - 6/10/2019";
            daterangepicker.htmlAttributes = { class: "sample" };
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('5/5/2019 - 6/10/2019');
        });
        it('Dynamically change multiple attributes through htmlAttributes API', () => {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/24/2017'), endDate: new Date('8/10/2017') });
            daterangepicker.appendTo('#daterange');
            daterangepicker.htmlAttributes = { class: "sample", max: '5/15/2019', min: '6/5/2019' };
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/24/2017 - 8/10/2017');
            expect(daterangepicker.element.getAttribute('max')).toBe('5/15/2019');
            expect(daterangepicker.element.getAttribute('min')).toBe('6/5/2019');
        });
        it('Pass null value in htmlAttributes', () => {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/24/2017'), endDate: new Date('8/10/2017') });
            daterangepicker.appendTo('#daterange');
            daterangepicker.htmlAttributes = { null: "null" };
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/24/2017 - 8/10/2017');
        });
        it('Pass undefined in htmlAttributes', () => {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/24/2017'), endDate: new Date('8/10/2017') });
            daterangepicker.appendTo('#daterange');
            daterangepicker.htmlAttributes = { undefined: "undefined" };
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/24/2017 - 8/10/2017');
        });
        it('Pass empty value in htmlAttributes', () => {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/24/2017'), endDate: new Date('8/10/2017') });
            daterangepicker.appendTo('#daterange');
            daterangepicker.inputElement.value = "5/5/2019 - 6/10/2019";
            daterangepicker.htmlAttributes = {};
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('5/5/2019 - 6/10/2019');
        });
    });

    describe('MinDays and MaxDays - Desktop', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('minDays > maxDays', function () {
            daterangepicker = createControl({ minDays: 10, maxDays: 5 });
            expect(daterangepicker.minDays === 10 && daterangepicker.maxDays === null).toBe(true);
        });
        it('minDays < 0 ', function () {
            daterangepicker = createControl({ minDays: -1, maxDays: 5 });
            expect(daterangepicker.minDays === null && daterangepicker.maxDays === 5).toBe(true);
        });
        it('maxDays < 0 ', function () {
            daterangepicker = createControl({ maxDays: -1, minDays: 5 });
            expect(daterangepicker.maxDays === null && daterangepicker.minDays === 5).toBe(true);
        });
        it('Selecting range of 5 mindays', function () {
            daterangepicker = createControl({ minDays: 5 });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(selectedCell.nextElementSibling.classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[12].classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[13].classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[14].classList.contains('e-date-disabled')).toBe(false);
        });
        it('minDays and maxDays with keyboard test case', function () {
            daterangepicker = createControl({ minDays: 5, maxDays: 5 });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            keyEventArgs.action = 'moveright';
            keyEventArgs.target = daterangepicker.leftCalendar.querySelector('table');
            daterangepicker.keyInputHandler(keyEventArgs);
            expect(selectedCell.nextElementSibling.classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[12].classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[13].classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[14].classList.contains('e-date-disabled')).toBe(false);
        });
        it('Selecting range of 10 maxdays', function () {
            daterangepicker = createControl({ maxDays: 10 });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[19].classList.contains('e-date-disabled')).toBe(false);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[20].classList.contains('e-date-disabled')).toBe(true);
        });
        it('Minimum days need to be selected is greater than available date', function () {
            daterangepicker = createControl({ minDays: 5, max: new Date('9/20/2017') });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[22]);
            selectedCell.dispatchEvent(clickEvent);
            expect(selectedCell.nextElementSibling.classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[30].classList.contains('e-disabled')).toBe(true);
        });
        it('is Days are disabled in next month when maxDays', function () {
            daterangepicker = createControl({ maxDays: 5 });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[22]);
            selectedCell.dispatchEvent(clickEvent);
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            elements.rightCalNexticon.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[23].classList.contains('e-date-disabled')).toBe(true);
        });
        it('is Days are not selectable in next month when maxDays', function () {
            daterangepicker = createControl({ maxDays: 5 });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[22]);
            selectedCell.dispatchEvent(clickEvent);
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            elements.rightCalNexticon.dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[12]).click();
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[23].classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-end-date').length === 0).toBe(true);
        });
        it('Selecting range using minDays and maxDays', function () {
            daterangepicker = createControl({ minDays: 5, maxDays: 10 });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(selectedCell.nextElementSibling.classList.contains('e-date-disabled')).toBe(true);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[19]).click();
            <HTMLElement>(daterangepicker.applyButton.element).click();
            expect(daterangepicker.element.value !== '');
        });
        it('minDays > (min-max)', function () {
            daterangepicker = createControl({ minDays: 15, min: new Date('9/10/2017'), max: new Date('9/20/2017') });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[16]);
            selectedCell.dispatchEvent(clickEvent);
            expect(selectedCell.nextElementSibling.classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[30].classList.contains('e-disabled')).toBe(true);
        });
        it('Cells not selected before minDays range', function () {
            daterangepicker = createControl({ minDays: 5 });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[11]).click();
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('Cells not selected after maxDays range', function () {
            daterangepicker = createControl({ maxDays: 8 });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[20]).click();
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('previous cells are enabled', function () {
            daterangepicker = createControl({ minDays: 5 });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[9].classList.contains('e-date-disabled')).toBe(false);
        });
        it('Same minDays and maxDays', function () {
            daterangepicker = createControl({ minDays: 5, maxDays: 5 });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[11].classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[14].classList.contains('e-date-disabled')).toBe(false);
        });
        it('Selecting same cell when minDays != null', function () {
            daterangepicker = createControl({ minDays: 5, maxDays: 5 });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('Disabled Date maintained during minDays and maxDays', function () {
            daterangepicker = createControl({
                startDate: new Date('9/1/2017'), endDate: new Date('9/12/2017'),
                renderDayCell: function (args: any): void {
                    if (+args.date === +new Date('9/10/2017') || +args.date === +new Date('9/15/2017')) {
                        args.isDisabled = true;
                    }
                }, minDays: 5
            });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[11].classList.contains('e-date-disabled')).toBe(true);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[19]).click();
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-disabled').length > 0).toBe(true);
        });
        it('Week Number not included in minDays', function () {
            daterangepicker = createControl({ minDays: 5, weekNumber: true, startDate: new Date('8/10/2017'), endDate: new Date('8/18/2017') });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[22]);
            selectedCell.dispatchEvent(clickEvent);
            expect(selectedCell.nextElementSibling.classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[24].classList.contains('e-week-number') && !daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[24].classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[26].classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[27].classList.contains('e-date-disabled')).toBe(false);
        });
        it('Selected range lesser minDays(input)', function () {
            daterangepicker = createControl({ minDays: 5, startDate: new Date('8/10/2017'), endDate: new Date('8/11/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
        });
        it('Selected range greater maxDays(input)', function () {
            daterangepicker = createControl({ maxDays: 5, startDate: new Date('8/10/2017'), endDate: new Date('8/19/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
        });
        it('Selected range lesser minDays(enter)', function () {
            daterangepicker = createControl({ minDays: 5 });
            daterangepicker.element.value = '8/10/2017 - 8/11/2017';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
        });
        it('Selected range greater maxDays(enter)', function () {
            daterangepicker = createControl({ maxDays: 5 });
            daterangepicker.element.value = '8/10/2017 - 8/19/2017';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
        });
        it('Selected range lesser minDays(dataBind)', function () {
            daterangepicker = createControl({ startDate: new Date('8/10/2017'), endDate: new Date('8/11/2017') });
            daterangepicker.minDays = 5;
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
        });
        it('Selected range greater maxDays(dataBind)', function () {
            daterangepicker = createControl({ startDate: new Date('8/10/2017'), endDate: new Date('8/19/2017') });
            daterangepicker.maxDays = 5;
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
        });
        it('Disabled Date excluded in range count', function () {
            daterangepicker = createControl({
                startDate: new Date('9/5/2017'), endDate: new Date('9/12/2017'),
                renderDayCell: function (args: any): void {
                    if (args.date.getDay() === 0 || args.date.getDay() === 6) {
                        args.isDisabled = true;
                    }
                }
            });
            expect(daterangepicker.popupObj.element.querySelector('.e-day-span').textContent.indexOf('6') > -1).toBe(true);
            expect(daterangepicker.getSelectedRange().daySpan === 6).toBe(true);
        });
        it('Disabled Date excluded in range count - databind', function () {
            daterangepicker = createControl({
                startDate: new Date('9/6/2017'), endDate: new Date('9/12/2017'),
                renderDayCell: function (args: any): void {
                    if (args.date.getDay() === 0 || args.date.getDay() === 6 || args.date.getDate() === 10) {
                        args.isDisabled = true;
                    }
                }
            });
            daterangepicker.endDate = new Date('11/15/2017');
            daterangepicker.dataBind();
            expect(daterangepicker.getSelectedRange().daySpan === 49).toBe(true);
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-day-span').textContent.indexOf('49') > -1).toBe(true);
        });
        it('Disabled Date excluded in range count - enter', function () {
            daterangepicker = createControl({
                startDate: new Date('9/6/2017'), endDate: new Date('9/12/2017'),
                renderDayCell: function (args: any): void {
                    if (args.date.getDay() === 0 || args.date.getDay() === 6 || args.date.getDate() === 10) {
                        args.isDisabled = true;
                    }
                }
            });
            daterangepicker.element.value = '9/5/2017 - 9/19/2017';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            expect(daterangepicker.getSelectedRange().daySpan === 11).toBe(true);
        });
        it('Disabled Date excluded in range count - strict Mode', function () {
            daterangepicker = createControl({
                strictMode: true, startDate: new Date('9/3/2017'), endDate: new Date('9/12/2017'),
                renderDayCell: function (args: any): void {
                    if (args.date.getDay() === 0 || args.date.getDay() === 6 || args.date.getDate() === 10) {
                        args.isDisabled = true;
                    }
                }
            });
            expect(daterangepicker.getSelectedRange().daySpan === 0).toBe(true);
        });
        it('Icon Disabled in right calendar', function () {
            daterangepicker = createControl({ maxDays: 10 });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.rightCalNextIcon.classList.contains('e-icon-disabled')).toBe(true);
        });
        it('Icon Disabled in both calendar', function () {
            daterangepicker = createControl({ maxDays: 10 });
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            document.querySelector('.e-right-calendar .e-header .e-date-icon-next').dispatchEvent(clickEvent);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.rightCalNextIcon.classList.contains('e-icon-disabled') && daterangepicker.rightCalPrevIcon.classList.contains('e-icon-disabled') && daterangepicker.leftCalNextIcon.classList.contains('e-icon-disabled')).toBe(true);
        });
        it('Icon Disabled class removed in both calendar', function () {
            daterangepicker = createControl({ maxDays: 5 });
            let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
            elements.rightCalNexticon.dispatchEvent(clickEvent);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            selectedCell = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[11]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.rightCalNextIcon.classList.contains('e-icon-disabled')).toBe(false);
            expect(daterangepicker.rightCalPrevIcon.classList.contains('e-icon-disabled')).toBe(false);
            expect(daterangepicker.leftCalNextIcon.classList.contains('e-icon-disabled')).toBe(false);
        });
        it('Icon Disabled class in both calendar without navigating', function () {
            daterangepicker = createControl({ maxDays: 5 });
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.rightCalNextIcon.classList.contains('e-icon-disabled')).toBe(true);
            expect(daterangepicker.rightCalPrevIcon.classList.contains('e-icon-disabled')).toBe(true);
            expect(daterangepicker.leftCalNextIcon.classList.contains('e-icon-disabled')).toBe(true);
        });
    });
    describe('MinDays and MaxDays - Device', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('minDays > maxDays', function () {
            daterangepicker = createControl({ minDays: 10, maxDays: 5 }, true);
            expect(daterangepicker.minDays === 10 && daterangepicker.maxDays === null).toBe(true);
        });
        it('minDays < 0 ', function () {
            daterangepicker = createControl({ minDays: -1, maxDays: 5 }, true);
            expect(daterangepicker.minDays === null && daterangepicker.maxDays === 5).toBe(true);
        });
        it('maxDays < 0 ', function () {
            daterangepicker = createControl({ maxDays: -1, minDays: 5 }, true);
            expect(daterangepicker.maxDays === null && daterangepicker.minDays === 5).toBe(true);
        });
        it('Selecting range of 5 mindays', function () {
            daterangepicker = createControl({ minDays: 5 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(selectedCell.nextElementSibling.classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[12].classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[13].classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[14].classList.contains('e-date-disabled')).toBe(false);
        });
        it('Selecting range of 10 maxdays', function () {
            daterangepicker = createControl({ maxDays: 10 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[19].classList.contains('e-date-disabled')).toBe(false);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[20].classList.contains('e-date-disabled')).toBe(true);
        });
        it('Minimum days need to be selected is greater than available date', function () {
            daterangepicker = createControl({ minDays: 5, max: new Date('8/20/2017') }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[15]);
            selectedCell.dispatchEvent(clickEvent);
            expect(selectedCell.nextElementSibling.classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[17].classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[30].classList.contains('e-disabled')).toBe(true);
        });
        it('is Days are disabled in next month when maxDays', function () {
            daterangepicker = createControl({ maxDays: 5 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[22]);
            selectedCell.dispatchEvent(clickEvent);
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            expect(elements.nextIcon.classList.contains('e-disabled')).toBe(true);
        });
        it('is Days are not selectable in next month when maxDays', function () {
            daterangepicker = createControl({ maxDays: 5 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[22]);
            selectedCell.dispatchEvent(clickEvent);
            let elements: DeviceCalendarElement = getDeviceCalendarElement(daterangepicker.popupObj.element);
            expect(elements.nextIcon.classList.contains('e-disabled')).toBe(true);
        });
        it('Selecting range using minDays and maxDays', function () {
            daterangepicker = createControl({ minDays: 5, maxDays: 10 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(selectedCell.nextElementSibling.classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[14].classList.contains('e-date-disabled')).toBe(false);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[19].classList.contains('e-date-disabled')).toBe(false);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[20].classList.contains('e-date-disabled')).toBe(true);
        });
        it('minDays > (min-max)', function () {
            daterangepicker = createControl({ minDays: 15, min: new Date('9/10/2017'), max: new Date('9/20/2017') }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[16]);
            selectedCell.dispatchEvent(clickEvent);
            expect(selectedCell.nextElementSibling.classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[30].classList.contains('e-disabled')).toBe(true);
        });
        it('Cells not selected before minDays', function () {
            daterangepicker = createControl({ minDays: 5 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[11]).click();
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('Cells not selected after maxDays', function () {
            daterangepicker = createControl({ maxDays: 8 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[20]).click();
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('previous cells are enabled', function () {
            daterangepicker = createControl({ minDays: 5 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[9].classList.contains('e-date-disabled')).toBe(true);
        });
        it('Same minDays and maxDays', function () {
            daterangepicker = createControl({ minDays: 5, maxDays: 5 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[11].classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[14].classList.contains('e-date-disabled')).toBe(false);
        });
        it('Selecting same cell when minDays != null', function () {
            daterangepicker = createControl({ minDays: 5, maxDays: 5 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
        });
        it('Disabled Date maintained during minDays and maxDays', function () {
            daterangepicker = createControl({
                startDate: new Date('9/1/2017'), endDate: new Date('9/12/2017'),
                renderDayCell: function (args: any): void {
                    if (+args.date === +new Date('9/10/2017') || +args.date === +new Date('9/15/2017')) {
                        args.isDisabled = true;
                    }
                }, minDays: 5
            }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[11].classList.contains('e-date-disabled')).toBe(true);
            <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[19]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-disabled').length > 0).toBe(true);
        });
        it('Week Number not included in minDays', function () {
            daterangepicker = createControl({ minDays: 5, weekNumber: true, startDate: new Date('8/10/2017'), endDate: new Date('8/18/2017') }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[22]);
            selectedCell.dispatchEvent(clickEvent);
            expect(selectedCell.nextElementSibling.classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[24].classList.contains('e-week-number') && !daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[24].classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[26].classList.contains('e-date-disabled')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[27].classList.contains('e-date-disabled')).toBe(false);
        });
        it('Selected range lesser minDays(input)', function () {
            daterangepicker = createControl({ minDays: 5, startDate: new Date('8/10/2017'), endDate: new Date('8/11/2017') }, true);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
        });
        it('Selected range greater maxDays(input)', function () {
            daterangepicker = createControl({ maxDays: 5, startDate: new Date('8/10/2017'), endDate: new Date('8/19/2017') }, true);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
        });
        it('Selected range greater maxDays(enter)', function () {
            daterangepicker = createControl({ maxDays: 5 }, true);
            daterangepicker.element.value = '8/10/2017 - 8/19/2017';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
        });
        it('Selected range lesser minDays(dataBind)', function () {
            daterangepicker = createControl({ startDate: new Date('8/10/2017'), endDate: new Date('8/11/2017') }, true);
            daterangepicker.minDays = 5;
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
        });
        it('Selected range lesser minDays(dataBind)', function () {
            daterangepicker = createControl({ startDate: new Date('8/10/2017'), endDate: new Date('8/11/2017') }, true);
            daterangepicker.minDays = 5;
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
        });
        it('Selected range greater maxDays(dataBind)', function () {
            daterangepicker = createControl({ startDate: new Date('8/10/2017'), endDate: new Date('8/19/2017') }, true);
            daterangepicker.maxDays = 5;
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') && daterangepicker.startDate === null && daterangepicker.endDate === null).toBe(true);
        });
        it('Icon Disabled in calendar', function () {
            daterangepicker = createControl({ maxDays: 10 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.nextIcon.classList.contains('e-icon-disabled')).toBe(true);
        });
        it('Cell disabled after enddate in calendar', function () {
            daterangepicker = createControl({ maxDays: 10 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            selectedCell = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[11]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-date-disabled').length > 0).toBe(true);
        });
        it('Cell enabled in startdate and disabled in enddate in calendar', function () {
            daterangepicker = createControl({ maxDays: 10 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            selectedCell = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[11]);
            selectedCell.dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.startButton.element).click();
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-date-disabled').length === 0).toBe(true);
            <HTMLElement>(daterangepicker.endButton.element).click();
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-date-disabled').length > 0).toBe(true);
        });
        it('Cell enabled in startdate and disabled in enddate in calendar(Apply)', function () {
            daterangepicker = createControl({ maxDays: 10 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            selectedCell = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[11]);
            selectedCell.dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.startButton.element).click();
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-date-disabled').length === 0).toBe(true);
            <HTMLElement>(daterangepicker.endButton.element).click();
            expect(daterangepicker.popupObj.element.querySelectorAll('.e-date-disabled').length > 0).toBe(true);
        });
        it('Icon Disabled class removed in calendar(startBtn)', function () {
            daterangepicker = createControl({ maxDays: 5 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            selectedCell = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[11]);
            selectedCell.dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.startButton.element).click();
            expect(daterangepicker.nextIcon.classList.contains('e-icon-disabled')).toBe(false);
        });
        it('Icon Disabled class not removed in calendar(endBtn)', function () {
            daterangepicker = createControl({ maxDays: 5 }, true);
            let selectedCell: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[10]);
            selectedCell.dispatchEvent(clickEvent);
            selectedCell = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-calendar td')[11]);
            selectedCell.dispatchEvent(clickEvent);
            expect(daterangepicker.nextIcon.classList.contains('e-icon-disabled')).toBe(true);
        });
    });
    describe('StrictMode -  Desktop', () => {
        let daterangepicker: any;
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('min > max', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('6/2/2017'), endDate: new Date('6/12/2017'), min: new Date('5/24/2017'), max: new Date('1/1/2017') });
            expect(daterangepicker.element.hasAttribute('disabled') && daterangepicker.enabled === false).toBe(true);
            expect(daterangepicker.inputElement.value === '' && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('startDate out of min range(month)', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/24/2017'), endDate: new Date('08/10/2017'), min: new Date('05/10/2017'), max: new Date('12/24/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('05/10/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
        });
        it('startDate out of min range(min:default)', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/24/1017'), endDate: new Date('08/10/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('1/1/1900') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date').nextElementSibling.classList.contains('e-range-hover')).toBe(true);
        });

        it('endDate out of max range(month)', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/24/2017'), endDate: new Date('08/10/2017'), min: new Date('1/10/2017'), max: new Date('7/24/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.endDate === +new Date('7/24/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
        });
        it('start and end date out of min and max range(month)', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/24/2017'), endDate: new Date('08/10/2017'), min: new Date('5/10/2017'), max: new Date('7/24/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('5/10/2017') && +daterangepicker.endDate === +new Date('7/24/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('5/10/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('7/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('startDate > endDate', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('09/24/2017'), endDate: new Date('08/10/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(+daterangepicker.endDate !== +daterangepicker.max && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
        });
        it('range value less than minDays', () => {
            daterangepicker = createControl({ strictMode: true, minDays: 5, startDate: new Date('04/24/2017'), endDate: new Date('04/25/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.endDate === +new Date('4/28/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value === '4/24/2017 - 4/28/2017').toBe(true);
        });
        it('range value greater than maxDays', () => {
            daterangepicker = createControl({ strictMode: true, maxDays: 5, startDate: new Date('04/24/2017'), endDate: new Date('05/25/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.endDate === +new Date('4/28/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value === '4/24/2017 - 4/28/2017').toBe(true);
        });
        it('minDays not available(max)', () => {
            daterangepicker = createControl({ strictMode: true, minDays: 5, startDate: new Date('04/24/2017'), endDate: new Date('04/25/2017'), max: new Date('04/26/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.endDate === +new Date('4/26/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value === '4/24/2017 - 4/26/2017').toBe(true);
        });
        it('maxDays not available(max)', () => {
            daterangepicker = createControl({ strictMode: true, maxDays: 5, startDate: new Date('04/24/2017'), endDate: new Date('04/28/2017'), max: new Date('04/26/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.endDate === +new Date('4/26/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value === '4/24/2017 - 4/26/2017').toBe(true);
        });
        it('Disabled Date', () => {
            daterangepicker = createControl({
                strictMode: true,
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() === 25) {
                        args.isDisabled = true;
                    }
                },
                startDate: new Date('04/24/2017'), endDate: new Date('04/25/2017')
            });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.startDate == null && daterangepicker.endDate == null && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value === '').toBe(true);
        });
        it('range updated through enter', () => {
            daterangepicker = createControl({ strictMode: true, min: new Date('04/15/2017'), max: new Date('05/20/2017') });
            daterangepicker.element.value = '1/3/2017 - 11/3/2018';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            daterangepicker.hide();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/15/2017') && +daterangepicker.endDate === +new Date('05/20/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('04/15/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('05/20/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('Previous value maintained ', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/24/2017'), endDate: new Date('04/25/2017') });
            daterangepicker.element.value = '1/33/2017 - 11/3/2018';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/24/2017') && +daterangepicker.endDate === +new Date('04/25/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('04/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('04/25/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('minDays alerted ', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/24/2017'), endDate: new Date('04/25/2017') });
            daterangepicker.minDays = 5;
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/24/2017') && +daterangepicker.endDate === +new Date('04/28/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('04/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('04/28/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('maxDays alerted ', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/24/2017'), endDate: new Date('05/25/2017') });
            daterangepicker.maxDays = 5;
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/24/2017') && +daterangepicker.endDate === +new Date('04/28/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('04/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('04/28/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('Disabled Date - previous value maintained', () => {
            daterangepicker = createControl({
                strictMode: true,
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() === 25) {
                        args.isDisabled = true;
                    }
                },
                startDate: new Date('04/24/2017'), endDate: new Date('04/26/2017')
            });
            daterangepicker.endDate = new Date('04/25/2017');
            daterangepicker.dataBind();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/24/2017') && +daterangepicker.endDate == +new Date('04/26/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value === '4/24/2017 - 4/26/2017').toBe(true);
        });
        it('StrictMode(remove error class) - enter key', () => {
            daterangepicker = createControl({ startDate: new Date('04/24/2017'), endDate: new Date('08/10/2017'), min: new Date('05/10/2017'), max: new Date('12/24/2017') });
            expect(daterangepicker.inputElement.value !== '' && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            daterangepicker.strictMode = true;
            daterangepicker.startDate = new Date('04/24/2017');
            daterangepicker.endDate = new Date('08/10/2017');
            daterangepicker.dataBind();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(+daterangepicker.startDate === +new Date('05/10/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('strictMode with format test case  ', () => {
            daterangepicker = new DateRangePicker({ strictMode: true, format: 'y  /MMM/d' });
            daterangepicker.appendTo('#date');
            daterangepicker.element.value = '2017  /Mar/1 - 2017  /Apr/1';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            expect(daterangepicker.strictMode).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            daterangepicker.element.value = '2017  /Mar/1sssss - 2017  /Apr/1';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            expect(daterangepicker.element.value).toBe('2017  /Mar/1 - 2017  /Apr/1');
        });
        it('Same min and max range(month)', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/24/2017'), endDate: new Date('08/10/2017'), min: new Date('5/24/2017'), max: new Date('5/24/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('5/24/2017') && +daterangepicker.endDate === +new Date('5/24/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('5/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('5/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
    });
    describe('StrictMode -  Device', () => {
        let daterangepicker: any;
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('min > max', () => {
            daterangepicker = createControl({ strictMode: true, min: new Date('5/24/2017'), max: new Date('1/1/2017') }, true);
            expect(daterangepicker.element.hasAttribute('disabled') && daterangepicker.enabled === false).toBe(true);
        });
        it('startDate out of min range(month)', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/24/2017'), endDate: new Date('08/10/2017'), min: new Date('05/10/2017'), max: new Date('12/24/2017') }, true);
            expect(+daterangepicker.startDate === +new Date('05/10/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
        });
        it('endDate out of max range(month)', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/24/2017'), endDate: new Date('08/10/2017'), min: new Date('1/10/2017'), max: new Date('7/24/2017') }, true);
            expect(+daterangepicker.endDate === +new Date('7/24/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
        });
        it('start and end date out of min and max range(month)', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/24/2017'), endDate: new Date('08/10/2017'), min: new Date('5/10/2017'), max: new Date('7/24/2017') }, true);
            expect(+daterangepicker.startDate === +new Date('5/10/2017') && +daterangepicker.endDate === +new Date('7/24/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('5/10/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('7/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('startDate > endDate', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('09/24/2017'), endDate: new Date('08/10/2017') }, true);
            expect(+daterangepicker.endDate !== +daterangepicker.max && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value !== '').toBe(true);
        });
        it('range value less than minDays', () => {
            daterangepicker = createControl({ strictMode: true, minDays: 5, startDate: new Date('04/24/2017'), endDate: new Date('04/25/2017') }, true);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.endDate === +new Date('4/28/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value === '4/24/2017 - 4/28/2017').toBe(true);
        });
        it('range value greater than maxDays', () => {
            daterangepicker = createControl({ strictMode: true, maxDays: 5, startDate: new Date('04/24/2017'), endDate: new Date('05/25/2017') });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.endDate === +new Date('4/28/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value === '4/24/2017 - 4/28/2017').toBe(true);
        });
        it('minDays not available(max)', () => {
            daterangepicker = createControl({ strictMode: true, minDays: 5, startDate: new Date('04/24/2017'), endDate: new Date('04/25/2017'), max: new Date('04/26/2017') }, true);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.endDate === +new Date('4/26/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value === '4/24/2017 - 4/26/2017').toBe(true);
        });
        it('maxDays not available(max)', () => {
            daterangepicker = createControl({ strictMode: true, maxDays: 5, startDate: new Date('04/24/2017'), endDate: new Date('04/28/2017'), max: new Date('04/26/2017') }, true);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.endDate === +new Date('4/26/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value === '4/24/2017 - 4/26/2017').toBe(true);
        });
        it('Disabled Date', () => {
            daterangepicker = createControl({
                strictMode: true,
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() === 25) {
                        args.isDisabled = true;
                    }
                },
                startDate: new Date('04/24/2017'), endDate: new Date('04/25/2017')
            });
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') === null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.startDate == null && daterangepicker.endDate == null && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value === '').toBe(true);
        });
        it('range updated through enter', () => {
            daterangepicker = createControl({ strictMode: true, min: new Date('04/15/2017'), max: new Date('05/20/2017') }, true);
            daterangepicker.element.value = '1/3/2017 - 11/3/2018';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            daterangepicker.hide();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/15/2017') && +daterangepicker.endDate === +new Date('05/20/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('04/15/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('05/20/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('Previous value maintained ', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/24/2017'), endDate: new Date('04/25/2017') }, true);
            daterangepicker.element.value = '1/33/2017 - 11/3/2018';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/24/2017') && +daterangepicker.endDate === +new Date('04/25/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('04/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('04/25/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('minDays alerted ', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/24/2017'), endDate: new Date('04/25/2017') }, true);
            daterangepicker.minDays = 5;
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/24/2017') && +daterangepicker.endDate === +new Date('04/28/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('04/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('04/28/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('maxDays alerted ', () => {
            daterangepicker = createControl({ strictMode: true, startDate: new Date('04/24/2017'), endDate: new Date('05/25/2017') }, true);
            daterangepicker.maxDays = 5;
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/24/2017') && +daterangepicker.endDate === +new Date('04/28/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            let startDate: string = daterangepicker.globalize.formatDate(new Date('04/24/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(new Date('04/28/2017'), { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.inputElement.value === startDate + ' ' + daterangepicker.separator + ' ' + endDate).toBe(true);
        });
        it('Disabled Date - previous value maintained', () => {
            daterangepicker = createControl({
                strictMode: true,
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() === 25) {
                        args.isDisabled = true;
                    }
                },
                startDate: new Date('04/24/2017'), endDate: new Date('04/26/2017')
            }, true);
            daterangepicker.endDate = new Date('04/25/2017');
            daterangepicker.dataBind();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(+daterangepicker.startDate === +new Date('04/24/2017') && +daterangepicker.endDate == +new Date('04/26/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.inputElement.value === '4/24/2017 - 4/26/2017').toBe(true);
        });
        it('StrictMode(remove error class) - enter key', () => {
            daterangepicker = createControl({ startDate: new Date('04/24/2017'), endDate: new Date('08/10/2017'), min: new Date('05/10/2017'), max: new Date('12/24/2017') }, true);
            expect(daterangepicker.inputElement.value !== '' && daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            daterangepicker.strictMode = true;
            daterangepicker.startDate = new Date('04/24/2017');
            daterangepicker.endDate = new Date('08/10/2017');
            daterangepicker.dataBind();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(!daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(+daterangepicker.startDate === +new Date('05/10/2017') && !daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
    });
    describe('Presets Range Desktop)', () => {
        let daterangepicker: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null,
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker({ presets: [{ label: 'Today', start: new Date(), end: new Date() }, { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }] });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
        });

        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Preset range selection', () => {
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            let startDate: string = daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(daterangepicker.endDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.isPopupOpen() === false && daterangepicker.element.value === startDate + ' - ' + endDate).toBe(true);
        });
        it('active class added', () => {
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child').classList.contains('e-active')).toBe(true);
        });
        it('Mouse hover class added', () => {
            mouseEventArgs.target = daterangepicker.popupObj.element.querySelector('.e-presets li:first-child');
            daterangepicker.onMouseOver(mouseEventArgs);
            expect(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child').classList.contains('e-hover')).toBe(true);
        });
        it('Mouse hover class added', () => {
            mouseEventArgs.target = daterangepicker.popupObj.element.querySelector('.e-presets li:first-child');
            daterangepicker.onMouseOver(mouseEventArgs);
            expect(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child').classList.contains('e-hover')).toBe(true);
            daterangepicker.onMouseLeave(mouseEventArgs);
            expect(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child').classList.contains('e-hover')).toBe(false);
        });
        it('Custom ranges -cleared start and end date', () => {
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:last-child')).click();
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(daterangepicker.element.value !== '').toBe(true);
        });
        it('Custom range at model', () => {
            daterangepicker.hide();
            daterangepicker = createControl({ startDate: new Date('1/1/2017'), endDate: new Date('5/24/2017'), presets: [{ label: 'Today', start: new Date(), end: new Date() }, { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }] });
            expect(daterangepicker.popupObj.element.querySelector('.e-presets li:last-child').classList.contains('e-active')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(daterangepicker.element.value === '1/1/2017 - 5/24/2017').toBe(true);
        });
        it('wrong preset range - error class', () => {
            daterangepicker.hide();
            daterangepicker = createControl({ min: new Date('1/1/2017'), max: new Date('5/24/2017'), presets: [{ label: 'Today', start: new Date(), end: new Date() }, { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }] });
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('presets - dataBind', () => {
            daterangepicker.presets = [{ label: 'Today', start: new Date(), end: new Date() }, { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }];
            daterangepicker.dataBind();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-presets') !== null).toBe(true);
        });
        it('Locale label test case(de)', function () {
            daterangepicker.destroy();
            daterangepicker = createControl({ locale: 'de', presets: [{ label: 'Today', start: new Date(), end: new Date() }, { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }] });
            expect(daterangepicker.locale === 'de').toBe(true);
            expect(daterangepicker.l10n.getConstant('customRange') === daterangepicker.popupObj.element.querySelector('.e-presets li:last-child').textContent).toBe(true);
        });
    });

    describe('Presets custom label test case', () => {
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        })
        it('presets label  without selection test case', () => {
            daterangepicker = new DateRangePicker({ startDate: null, endDate: null, presets: [{ label: 'Presets01', start: new Date('1/1/2017'), end: new Date('2/1/2017') }, { label: 'Presets02', start: new Date('3/1/2017'), end: new Date('4/1/2017') }] });
            daterangepicker.appendTo('#date');
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-list-item.e-active').textContent).toBe('Custom Range');
        });
        it('presets label  with selection test case', () => {
            daterangepicker = new DateRangePicker({ startDate: new Date('3/1/2017'), endDate: new Date('4/1/2017'), presets: [{ label: 'Presets01', start: new Date('1/1/2017'), end: new Date('2/1/2017') }, { label: 'Presets02', start: new Date('3/1/2017'), end: new Date('4/1/2017') }] });
            daterangepicker.appendTo('#date');
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-list-item.e-active').textContent).toBe('Presets02');
        });
        it('Today presets label selection test case', () => {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/1/2017'), endDate: new Date('2/1/2017'), presets: [{ label: 'Presets01', start: new Date('1/1/2017'), end: new Date('2/1/2017') }, { label: 'Presets02', start: new Date('3/1/2017'), end: new Date('4/1/2017') }] });
            daterangepicker.appendTo('#date');
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-list-item.e-active').textContent).toBe('Presets01');
        });

        it('Custom Range presets label selection test case', () => {
            daterangepicker = new DateRangePicker({ startDate: new Date('6/1/2017'), endDate: new Date('7/1/2017'), presets: [{ label: 'Presets01', start: new Date('1/1/2017'), end: new Date('2/1/2017') }, { label: 'Presets02', start: new Date('3/1/2017'), end: new Date('4/1/2017') }] });
            daterangepicker.appendTo('#date');
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-list-item.e-active').textContent).toBe('Custom Range');

        });
        it('Custom range at model', () => {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/1/2017'), endDate: new Date('5/24/2017'), presets: [{ label: 'Today', start: new Date(), end: new Date() }, { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }] });
            daterangepicker.appendTo('#date');
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-calendar').classList.contains('e-calendar')).toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null).toBe(true);
            expect(daterangepicker.element.value === '1/1/2017 - 5/24/2017').toBe(true);
        });

    });
    describe('Presets Range Device', () => {
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker({ presets: [{ label: 'Today', start: new Date(), end: new Date() }, { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }] });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
        });

        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Preset range selection', () => {
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            let startDate: string = daterangepicker.globalize.formatDate(daterangepicker.startDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = daterangepicker.globalize.formatDate(daterangepicker.endDate, { format: daterangepicker.format, type: 'date', skeleton: 'yMd' });
            expect(daterangepicker.isPopupOpen() === false && daterangepicker.element.value === startDate + ' - ' + endDate).toBe(true);
        });
        it('active class added', () => {
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child').classList.contains('e-active')).toBe(true);
        });
        it('Custom ranges -cleared start and end date', () => {
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:last-child')).click();
            expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true);
            expect(daterangepicker.element.value !== '').toBe(true);
        });
        it('wrong preset range - error class', () => {
            daterangepicker.hide();
            daterangepicker = createControl({ min: new Date('1/1/2017'), max: new Date('5/24/2017'), presets: [{ label: 'Today', start: new Date(), end: new Date() }, { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }] });
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('presets - dataBind', () => {
            daterangepicker.presets = [{ label: 'Today', start: new Date(), end: new Date() }, { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }];
            daterangepicker.dataBind();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj.element.querySelector('.e-presets') !== null).toBe(true);
        });
        it('Locale label test case(de)', function () {
            daterangepicker.destroy();
            daterangepicker = createControl({ locale: 'de', presets: [{ label: 'Today', start: new Date(), end: new Date() }, { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }] });
            expect(daterangepicker.locale === 'de').toBe(true);
            expect(daterangepicker.l10n.getConstant('customRange') === daterangepicker.popupObj.element.querySelector('.e-presets li:last-child').textContent).toBe(true);
        });
    });
    describe('Public Method Testing', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#date');
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('getModuleName method', function () {
            expect(daterangepicker.getModuleName() === 'daterangepicker').toBe(true);
        });
        it('getPersistData method for code coverage', () => {
            let stringItems: any = daterangepicker.getPersistData();
        });
        it('getSelectedRange method', () => {
            daterangepicker = createControl({ startDate: new Date('8/10/2017'), endDate: new Date('8/13/2017') });
            let values = daterangepicker.getSelectedRange();
            expect(+values.startDate === +new Date('8/10/2017')).toBe(true);
            expect(+values.endDate === +new Date('8/13/2017')).toBe(true);
            expect(values.daySpan === 4).toBe(true);
        });
        it('hide method', function () {
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.isPopupOpen()).toBe(true);
            daterangepicker.hide();
            expect(daterangepicker.isPopupOpen()).toBe(false);
            expect(document.body.querySelector('.e-popup-open')).toBe(null);
        });
        it('show method', function () {
            expect(daterangepicker.isPopupOpen()).toBe(false);
            expect(document.body.querySelector('.e-popup-open')).toBe(null);
            daterangepicker.show();
            expect(daterangepicker.isPopupOpen()).toBe(true);
            expect(document.body.querySelector('.e-popup-open') !== null).toBe(true);
        });
        it('focusIn method test case ', function () {
            daterangepicker.focusIn();
            expect(daterangepicker.element.parentElement.classList.contains('e-input-focus')).toBe(true);
            expect(document.activeElement).toBe(daterangepicker.element);
        });
        it('focusIn method with enabled fasle  test case ', function () {
            daterangepicker.enabled = false;
            daterangepicker.dataBind();
            daterangepicker.focusIn();
            expect(daterangepicker.element.parentElement.classList.contains('e-input-focus')).toBe(false);
        });
        it('focusOut method test case ', function () {
            daterangepicker.focusOut();
            expect(daterangepicker.element.parentElement.classList.contains('e-input-focus')).toBe(false);
        });
        it('focus method test case ', function () {
            daterangepicker.enabled = true;
            daterangepicker.dataBind();
            daterangepicker.focusIn();
            expect(daterangepicker.element.parentElement.classList.contains('e-input-focus')).toBe(true);
            daterangepicker.focusOut();
            expect(daterangepicker.element.parentElement.classList.contains('e-input-focus')).toBe(false);
        });
        it('destroy method', () => {
            daterangepicker.destroy();
            expect(document.getElementById('date').parentElement.classList.contains('e-input-group')).toBe(false);
            daterangepicker = null;
        });
    });
    describe('Angular tag testing ', () => {
        let element: any;
        let daterangepicker: any;
        beforeEach(() => {
            element = createElement('EJS-DATERANGEPICKER');
            element.setAttribute('name', 'angular');
        });
        afterEach(() => {
            daterangepicker.destroy();
            document.body.innerHTML = '';
        });
        it('Wrapper testing with ID', () => {
            element.setAttribute('id', 'DateRangePicker');
            element.setAttribute('name', 'angular');
            document.body.appendChild(element);
            daterangepicker = new DateRangePicker({});
            daterangepicker.appendTo(element);
            expect(daterangepicker.element.tagName).toEqual('EJS-DATERANGEPICKER');
            expect(daterangepicker.element.getAttribute('name')).toBe(null);
            expect(daterangepicker.firstHiddenChild.getAttribute('name')).toBe('angular');
            expect(daterangepicker.inputWrapper.container.tagName).toBe('SPAN');
            expect(daterangepicker.element.getAttribute('name')).toBe(null);
            expect(daterangepicker.firstHiddenChild.getAttribute('name')).toBe('angular');
            expect(daterangepicker.inputWrapper.container.parentElement.tagName).toBe(daterangepicker.element.tagName);
            expect(daterangepicker.inputElement.tagName).toBe('INPUT')
        });
        it('Wrapper testing without ID ', () => {
            document.body.appendChild(element);
            daterangepicker = new DateRangePicker({});
            daterangepicker.appendTo(element);
            expect(daterangepicker.element.tagName).toEqual('EJS-DATERANGEPICKER');
            expect(daterangepicker.inputWrapper.container.tagName).toBe('SPAN');
            expect(daterangepicker.inputWrapper.container.parentElement.tagName).toBe(daterangepicker.element.tagName);
            expect(daterangepicker.inputElement.tagName).toBe('INPUT')
        });
    });

    describe('Mobile testing for readonly attribute', function () {
        let daterangepicker: any;
        beforeEach(() => {
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Add and remove readonly attribute for angular platform', () => {
            let ele: HTMLElement = <HTMLElement>createElement('EJS-DATERANGEPICKER', { id: 'range' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#range');
            daterangepicker.isMobile = true;
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                currentTarget: null,
                target: null,
                stopPropagation: (): void => { /** NO Code */ }
            };
            daterangepicker.rangeIconHandler(mouseEventArgs);
            expect(daterangepicker.element.hasAttribute('readonly')).toBe(false);
            expect(daterangepicker.inputElement.hasAttribute('readonly')).toBe(true);
            daterangepicker.hide();
            expect(daterangepicker.inputElement.hasAttribute('readonly')).toBe(false);
        });
        it('Add and remove readonly attribute for other platform', () => {
            let ele: HTMLElement = createElement('input', { id: 'range' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#range');
            daterangepicker.isMobile = true;
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                currentTarget: null,
                target: null,
                stopPropagation: (): void => { /** NO Code */ }
            };
            daterangepicker.rangeIconHandler(mouseEventArgs);
            expect(daterangepicker.inputElement.hasAttribute('readonly')).toBe(true);
            daterangepicker.hide();
            expect(daterangepicker.inputElement.hasAttribute('readonly')).toBe(false);
        });
    });

    describe('events Testing', () => {
        let daterangepicker: any;
        let startValue: Date;
        let endValue: Date;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: null,
            stopPropagation: (): void => { /** NO Code */ }
        };
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('value property with array type emits in change event test case', function () {
            daterangepicker = new DateRangePicker({
                change: function (args: any) {
                    expect(+args.value[0]).toBe(+new Date('2/2/2017'));
                    expect(+args.value[1]).toBe(+new Date('3/2/2017'));
                }
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.value = [new Date('2/2/2017'), new Date('3/2/2017')];
            daterangepicker.dataBind();
            expect(+daterangepicker.value[0]).toBe(+new Date('2/2/2017'));
            expect(+daterangepicker.value[1]).toBe(+new Date('3/2/2017'));
        });
        it('value property on property  with object type emits in change event test case', function () {
            daterangepicker = new DateRangePicker({
                change: function (args: any) {
                    expect(+args.value.start).toBe(+new Date('2/2/2017'));
                    expect(+args.value.end).toBe(+new Date('3/2/2017'));
                }
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.value = { start: new Date('2/2/2017'), end: new Date('3/2/2017') };
            daterangepicker.dataBind();
            expect(+daterangepicker.value.start).toBe(+new Date('2/2/2017'));
            expect(+daterangepicker.value.end).toBe(+new Date('3/2/2017'));
        });
        it('value property with null on property  with object type emits test case', function () {
            daterangepicker = new DateRangePicker({
                value: {
                    start: new Date('2/2/2017'),
                    end: new Date('3/2/2017')
                },
                change: function (args: any) {
                    expect(args.value.start).toBe(null);
                    expect(args.value.end).toBe(null);
                }
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.value = null;
            daterangepicker.dataBind();
            expect(daterangepicker.value.start).toBe(null);
            expect(daterangepicker.value.end).toBe(null);
        });

        it('value property with null on property  with array type emits test case', function () {
            daterangepicker = new DateRangePicker({
                value: [new Date('2/2/2017'), new Date('3/2/2017')],
                change: function (args: any) {
                    expect(args.value).toBe(null);
                }
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.value = null;
            daterangepicker.dataBind();
            expect(daterangepicker.value).toBe(null);
        });
        it('value property with object type  emits in change event test case', function () {
            daterangepicker = new DateRangePicker({
                change: function (args: any) {
                    expect(+args.value.start).toBe(+new Date('2/2/2017'));
                    expect(+args.value.end).toBe(+new Date('3/2/2017'));
                }
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.value = { start: new Date('2/2/2017'), end: new Date('3/2/2017') };
            daterangepicker.dataBind();
        });
        let count: number = 0;
        it('Created event', function () {
            let func = { created: function (args: any): void { console.log(args.date); } };
            spyOn(func, 'created');
            daterangepicker = new DateRangePicker({ created: func.created });
            daterangepicker.appendTo('#date');
            if (daterangepicker.element.classList.contains("e-daterangepicker") == true) count++;
            expect(count).toBe(1);
            expect(func.created).toHaveBeenCalled();
        });

        it('Select event', function () {
            let func = { select: function (args: any): void { console.log(args.date); } };
            spyOn(func, 'select');
            daterangepicker = new DateRangePicker({ select: func.select });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            let startEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar.e-calendar td')[10]);
            let endEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[10]);
            startValue = daterangepicker.getIdValue(null, startEle);
            endValue = daterangepicker.getIdValue(null, endEle);
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            expect(func.select).toHaveBeenCalled();
        });
        it('Select event with start date only', function () {
            let func = {
                select: function (args: RangeEventArgs): void {
                    expect(args.endDate).toBe(null);
                    expect(args.daySpan).toBe(0);
                    expect(args.text).toBe("");
                }
            };
            spyOn(func, 'select');
            daterangepicker = new DateRangePicker({ select: func.select });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            let startEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar.e-calendar td')[10]);
            startValue = daterangepicker.getIdValue(null, startEle);
            (startEle).dispatchEvent(clickEvent);
        });
        it('Change event', function () {
            let func = { change: function (args: any): void { console.log(args.date); } };
            spyOn(func, 'change');
            daterangepicker = new DateRangePicker({ change: func.change });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            let startEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar.e-calendar td')[10]);
            let endEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[10]);
            startValue = daterangepicker.getIdValue(null, startEle);
            endValue = daterangepicker.getIdValue(null, endEle);
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            expect(func.change).toHaveBeenCalled();
        });
        it('Change event in input', function () {
            let func = { change: function (args: any): void { console.log(args.date); } };
            spyOn(func, 'change');
            daterangepicker = new DateRangePicker({ startDate: new Date('2/3/2018'), endDate: new Date('5/24/2018'), change: func.change });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.element.value = '5/24/2017 - 6/23/2017';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            expect(func.change).toHaveBeenCalled();
        });
        it('change  event with preventing test case', function () {
            let e: object = {
                stopPropagation(): void {
                }
            }
            daterangepicker = new DateRangePicker({
                change: function (args: any): void {
                }
            });
            daterangepicker.appendTo('#date');
            daterangepicker.inputChangeHandler(e)
        });
        it('Change event in dataBind', function () {
            let func = { change: function (args: any): void { console.log(args.date); } };
            spyOn(func, 'change');
            daterangepicker = new DateRangePicker({ startDate: new Date('2/3/2018'), endDate: new Date('5/24/2018'), change: func.change });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.startDate = new Date('3/3/2017');
            daterangepicker.dataBind();
            expect(func.change).toHaveBeenCalled();
        });
        it('Change event not triggered', function () {
            let func = { change: function (args: any): void { console.log(args.date); } };
            spyOn(func, 'change');
            daterangepicker = new DateRangePicker({ startDate: new Date('2/3/2018'), endDate: new Date('5/24/2018'), change: func.change });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.element.value = '2/3/2018 - 5/24/2018';
            daterangepicker.preventBlur = false;
            daterangepicker.inputBlurHandler();
            expect(func.change).not.toHaveBeenCalled();
        });
        it('close event', function () {
            let func = { close: function (args: any): void { console.log(args.date); } };
            spyOn(func, 'close');
            daterangepicker = new DateRangePicker({ close: func.close });
            daterangepicker.appendTo('#date');
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(func.close).toHaveBeenCalled();
        });
        it('open event', function () {
            let func = { open: function (args: any): void { console.log(args.date); } };
            spyOn(func, 'open');
            daterangepicker = new DateRangePicker({ open: func.open });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(func.open).toHaveBeenCalled();
        });
    });

    describe('Datetime support', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('startDate and endDate property with time test case', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('3/3/2017 03:40'), endDate: new Date("4/3/2017 03:40"), format: 'dd/MM/yyyy hh:mm' });
            daterangepicker.appendTo('#date');
            expect(+daterangepicker.startDate).toBe(+new Date('3/3/2017 03:40'));
            expect(+daterangepicker.endDate).toBe(+new Date('4/3/2017 03:40'));
            expect(daterangepicker.element.value).toBe('03/03/2017 03:40 - 03/04/2017 03:40');
            expect(+daterangepicker.startDate).toBe(+new Date('03/03/2017 03:40'));
            expect(+daterangepicker.endDate).toBe(+new Date('04/03/2017 03:40'));
        });
        it('startDate and endDate property with format test case', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('3/3/2017 03:40'), endDate: new Date("4/3/2017 03:40"), format: 'MM/dd/yyyy hh:mm a' });
            daterangepicker.appendTo('#date');
            expect(+daterangepicker.startDate).toBe(+new Date('3/3/2017 03:40'));
            expect(+daterangepicker.endDate).toBe(+new Date('4/3/2017 03:40'));
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('03/03/2017 03:40 AM - 04/03/2017 03:40 AM');
            expect(+daterangepicker.startDate).toBe(+new Date('03/03/2017 03:40'));
            expect(+daterangepicker.endDate).toBe(+new Date('04/03/2017 03:40'));
        });
        it('startDate and endDate property with time options', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/3/2017 03:40'), endDate: new Date("2/3/2017 03:40") });
            daterangepicker.appendTo('#date');
            daterangepicker.startDate = new Date('1/5/2017 04:00');
            daterangepicker.endDate = new Date('2/5/2017 04:00');
            daterangepicker.dataBind();
            expect(+daterangepicker.startDate).toBe(+new Date('1/5/2017 04:00'));
            expect(+daterangepicker.endDate).toBe(+new Date('2/5/2017 04:00'));
            expect(daterangepicker.element.value).toBe('1/5/2017 - 2/5/2017');
        });
        it('startDate and endDate property with  different time value test case', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/3/2017 01:00'), endDate: new Date("2/3/2017 3:00") });
            daterangepicker.appendTo('#date');
            expect(+daterangepicker.startDate).toBe(+new Date('1/3/2017 1:00'));
            expect(+daterangepicker.endDate).toBe(+new Date('2/3/2017 3:00'));
            daterangepicker.startDate = new Date('1/5/2017 03:00');
            daterangepicker.endDate = new Date('2/5/2017 04:00');
            daterangepicker.dataBind();
            expect(+daterangepicker.startDate).toBe(+new Date('1/5/2017 03:00'));
            expect(+daterangepicker.endDate).toBe(+new Date('2/5/2017 04:00'));
            expect(daterangepicker.element.value).toBe('1/5/2017 - 2/5/2017');
        });
        it('startDate and endDate property with  different time value with format(dd/MM/yyy hh) test case', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/3/2017 01:00'), endDate: new Date("2/3/2017 3:00"), format: 'dd/MM/yyyy hh' });
            daterangepicker.appendTo('#date');
            expect(+daterangepicker.startDate).toBe(+new Date('1/3/2017 1:00'));
            expect(+daterangepicker.endDate).toBe(+new Date('2/3/2017 3:00'));
            daterangepicker.startDate = new Date('1/5/2017 6:00');
            daterangepicker.endDate = new Date('2/5/2017 04:00');
            daterangepicker.dataBind();
            expect(+daterangepicker.startDate).toBe(+new Date('1/5/2017 06:00'));
            expect(+daterangepicker.endDate).toBe(+new Date('2/5/2017 04:00'));
            expect(daterangepicker.element.value).toBe('05/01/2017 06 - 05/02/2017 04');
        });
        it('range selection with different time value test case', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('3/3/2017 01:00'), endDate: new Date("4/3/2017 05:00"), format: 'dd/MM/yyyy hh:mm' });
            daterangepicker.appendTo('#date');
            (daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            let tdLeftCell: any = daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar .e-content td')[10];
            tdLeftCell.dispatchEvent(clickEvent);
            let tdRightCell = daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar .e-content td')[10];
            tdRightCell.dispatchEvent(clickEvent);
            (<HTMLElement>document.getElementsByClassName('e-apply')[0]).click();
            daterangepicker.dataBind();
            expect(+daterangepicker.startDate).toBe(+new Date(parseInt(tdLeftCell.getAttribute('id').split('_')[0])));
            expect(+daterangepicker.endDate).toBe(+new Date(parseInt(tdRightCell.getAttribute('id').split('_')[0])));
            expect(daterangepicker.element.value).toBe('08/03/2017 01:00 - 05/04/2017 05:00');
        });
        it('startDate and endDate property with time options on onproperty change test case with format', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('3/3/2017 03:40'), endDate: new Date("4/3/2017 03:40"), format: 'dd/MM/yyyy hh:mm' });
            daterangepicker.appendTo('#date');
            (daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            let tdLeftCell: any = daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar .e-content td')[10];
            tdLeftCell.dispatchEvent(clickEvent);
            let tdRightCell = daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar .e-content td')[10];
            tdRightCell.dispatchEvent(clickEvent);
            (<HTMLElement>document.getElementsByClassName('e-apply')[0]).click();
            daterangepicker.dataBind();
            expect(+daterangepicker.startDate).toBe(+new Date(parseInt(tdLeftCell.getAttribute('id').split('_')[0])));
            expect(+daterangepicker.endDate).toBe(+new Date(parseInt(tdRightCell.getAttribute('id').split('_')[0])));
            expect(daterangepicker.element.value).toBe('08/03/2017 03:40 - 05/04/2017 03:40');
        });
    });

    describe('strictMode', () => {
        let daterangepicker: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter'
        };
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('strictMode false with startDate and endDate date value', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('3/3/9999'), endDate: new Date("4/3/9999") });
            daterangepicker.appendTo('#date');
            expect(+daterangepicker.startDate).toBe(+new Date('3/3/9999'));
            expect(+daterangepicker.endDate).toBe(+new Date('4/3/9999'));
            expect(daterangepicker.element.value).toBe('3/3/9999 - 4/3/9999');
            expect(+daterangepicker.startDate).toBe(+new Date('03/03/9999'));
            expect(+daterangepicker.endDate).toBe(+new Date('04/03/9999'));
        });
        it('strictMode false with startDate value out of range test case', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('3/3/9999'), endDate: new Date("4/3/2017") });
            daterangepicker.appendTo('#date');
            expect(+daterangepicker.startDate).toBe(+new Date('3/3/9999'));
            expect(+daterangepicker.endDate).toBe(+new Date('4/3/2017'));
            expect(daterangepicker.element.value).toBe('3/3/9999 - 4/3/2017');
            expect(+daterangepicker.startDate).toBe(+new Date('03/03/9999'));
            expect(+daterangepicker.endDate).toBe(+new Date('04/03/2017'));
        });

    });

    describe('Drill down navigation support for Desktop', () => {
        function leftCalendarTitleClick(): void {
            (<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).click();
        }
        function rightCalendarTitleClick(): void {
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).click();
        }
        function monthIconDisabled(): void {
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(true);
        }
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });

        it('navigation in left calendar', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/3/2018'), endDate: new Date("5/1/2018") });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            leftCalendarTitleClick();
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('April 2018')
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('May 2018')
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });
        it('navigation in right calendar', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/3/2018'), endDate: new Date("5/1/2018") });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            rightCalendarTitleClick();
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[1]).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('April 2018')
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('May 2018')
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });
        it('navigation to decade view in  left calendar test case ', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/3/2018'), endDate: new Date("2/1/2018") });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            leftCalendarTitleClick();
            leftCalendarTitleClick();
            expect(+daterangepicker.startDate).toBe(+new Date('1/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('2/1/2018'));
            (<HTMLElement>document.querySelector('.e-focused-date').nextElementSibling).click();
            (<HTMLElement>document.querySelector('.e-focused-date').nextElementSibling).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('February 2019')
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('February 2018')
            expect(+daterangepicker.startDate).toBe(+new Date('1/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('2/1/2018'));
        });
        it('navigation to decade view in  right calendar test case ', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/3/2018'), endDate: new Date("2/1/2018") });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            rightCalendarTitleClick();
            rightCalendarTitleClick();
            expect(+daterangepicker.startDate).toBe(+new Date('1/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('2/1/2018'));
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[1].nextElementSibling).click();
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[1].nextElementSibling).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('January 2018')
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('March 2019')
            expect(+daterangepicker.startDate).toBe(+new Date('1/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('2/1/2018'));
        });
        it('Icon disabled in left calendar after drill down test case ', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/3/2018'), endDate: new Date("5/1/2018") });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            leftCalendarTitleClick();
            (<HTMLElement>document.querySelector('.e-focused-date')).click();
            (<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-date-icon-prev')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('March 2018')
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            (<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-date-icon-next')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('April 2018');
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('April 2018');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('May 2018')
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });
        it('Icon disabled in right calendar after drill down test case ', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/3/2018'), endDate: new Date("5/1/2018") });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            rightCalendarTitleClick();
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[1]).click();
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-date-icon-next')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('June 2018');
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-date-icon-prev')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('May 2018');
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('April 2018');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('May 2018');
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });

        it('Left calendar drill down navigation with right calendar in month view test case ', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/3/2018'), endDate: new Date("5/1/2018") });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            leftCalendarTitleClick();
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('May 2018');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2018');
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-date-icon-next')).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('June 2018');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2018');
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-date-icon-prev')).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });

        it('Left calendar drill down navigation with right calendar in year view test case ', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/3/2018'), endDate: new Date("5/1/2018") });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            leftCalendarTitleClick();
            rightCalendarTitleClick();
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2018');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2018');
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-date-icon-next')).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2019');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2018');
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-date-icon-prev')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2018');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2018');
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });

        it('Right calendar drill down navigation with left calendar in month view test case ', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/3/2018'), endDate: new Date("5/1/2018") });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            rightCalendarTitleClick();
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2018');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('April 2018');
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            (<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-date-icon-prev')).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('March 2018');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2018');
            (<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-date-icon-next')).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });

        it('Right and left  calendar drill down navigation test case', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/3/2018'), endDate: new Date("5/1/2018") });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            leftCalendarTitleClick();
            rightCalendarTitleClick();
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            leftCalendarTitleClick();
            rightCalendarTitleClick();
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).click();
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[1]).click();
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            (<HTMLElement>document.querySelector('.e-focused-date')).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('April 2018');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('May 2018');
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });

        it('left calendar drill down with min and max test case ', function () {
            daterangepicker = new DateRangePicker({
                min: new Date('2/3/2018'),
                max: new Date('3/29/2018'),
                startDate: new Date('2/4/2018'),
                endDate: new Date('3/28/2018')
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            leftCalendarTitleClick();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2018')
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('March 2018')
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(true);
            (<HTMLElement>document.querySelector('.e-focused-date').nextElementSibling).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('March 2018');
            // expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('April 2018');
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
        });

        it('right  calendar drill down with min and max test case ', function () {
            daterangepicker = new DateRangePicker({
                min: new Date('2/3/2018'),
                max: new Date('3/29/2018'),
                startDate: new Date('2/4/2018'),
                endDate: new Date('3/28/2018')
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            rightCalendarTitleClick();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('February 2018')
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2018')
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(true);
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[1]).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('February 2018');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('March 2018');
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-start-date').children[0].textContent).toBe('4');
            expect(document.querySelector('.e-end-date').children[0].textContent).toBe('28');
        });

        it('Mobile navigation test case ', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/3/2018'), endDate: new Date("5/1/2018") });
            daterangepicker.appendTo('#date');
            daterangepicker.isMobile = true;
            daterangepicker.refreshControl();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            (<HTMLElement>document.querySelector('.e-calendar .e-header .e-day.e-title')).click();
            expect(document.querySelector('.e-calendar .e-content').classList.contains('e-year')).toBe(true);
            (<HTMLElement>document.querySelector('.e-calendar .e-header .e-day.e-title')).click();
            expect(document.querySelector('.e-calendar .e-content').classList.contains('e-decade')).toBe(true);
            (<HTMLElement>document.querySelector('.e-focused-date')).click();
            expect(document.querySelector('.e-calendar .e-content').classList.contains('e-year')).toBe(true);
            (<HTMLElement>document.querySelector('.e-focused-date')).click();
            expect(document.querySelector('.e-calendar .e-content').classList.contains('e-month')).toBe(true);
        });

        it('Mobile navigation with selection  test case ', function () {
            daterangepicker = new DateRangePicker({});
            daterangepicker.appendTo('#date');
            daterangepicker.isMobile = true;
            daterangepicker.refreshControl();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            (<HTMLElement>document.querySelector('.e-focused-date')).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-calendar .e-content').classList.contains('e-month')).toBe(true);
            // document.querySelector('.e-selected').nextElementSibling.dispatchEvent(clickEvent);
            expect(document.querySelector('.e-start-date').children[0].textContent).toBe('' + new Date().getDate());
            // expect(document.querySelector('.e-end-date').children[0].textContent).toBe('' + new Date((new Date().setDate(new Date().getDate() + 1))).getDate());
            //document.querySelector('.e-selected').nextElementSibling.dispatchEvent(clickEvent);
            // document.querySelector('.e-selected').nextElementSibling.dispatchEvent(clickEvent);
            expect(document.querySelector('.e-start-date').children[0].textContent).toBe('' + new Date().getDate());
            // expect(document.querySelector('.e-end-date').children[0].textContent).toBe('' + new Date((new Date().setDate(new Date().getDate() + 1))).getDate());
            <HTMLElement>(daterangepicker.applyButton.element).click();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            (<HTMLElement>document.querySelector('.e-calendar .e-header .e-day.e-title')).click();
            (<HTMLElement>document.querySelector('.e-calendar .e-header .e-day.e-title')).click();
            (<HTMLElement>document.querySelector('.e-focused-date')).click();
            (<HTMLElement>document.querySelector('.e-focused-date')).click();
            expect(document.querySelector('.e-start-date').children[0].textContent).toBe('' + new Date().getDate());
            // expect(document.querySelector('.e-end-date').children[0].textContent).toBe('' + new Date((new Date().setDate(new Date().getDate() + 1))).getDate());
            expect(+daterangepicker.startValue).toBe(+new Date(new Date().setHours(0, 0, 0, 0)));
            // expect(+daterangepicker.endDate).toBe(+new Date(new Date(new Date().setHours(0, 0, 0, 0)).setDate(new Date().getDate() + 1)));
            // expect(+daterangepicker.endDate).toBe(0);
            // expect(+daterangepicker.endDate).toBe(+new Date(new Date(new Date().setHours(0, 0, 0, 0)).setDate(new Date().getDate() + 1)));
        });

        it('Icon navigation in mobile test case ', function () {
            daterangepicker = new DateRangePicker({});
            daterangepicker.appendTo('#date');
            daterangepicker.isMobile = true;
            daterangepicker.refreshControl();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            (<HTMLElement>document.querySelector('.e-focused-date')).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-calendar .e-content').classList.contains('e-month')).toBe(true);
            // document.querySelector('.e-selected').nextElementSibling.dispatchEvent(clickEvent);
            expect(document.querySelector('.e-start-date').children[0].textContent).toBe('' + new Date().getDate());
            // expect(document.querySelector('.e-end-date').children[0].textContent).toBe('' + new Date((new Date().setDate(new Date().getDate() + 1))).getDate());
            // need to change the test case
            //document.querySelector('.e-selected').nextElementSibling.dispatchEvent(clickEvent);
            // document.querySelector('.e-selected').nextElementSibling.dispatchEvent(clickEvent);
            expect(document.querySelector('.e-start-date').children[0].textContent).toBe('' + new Date().getDate());
            // expect(document.querySelector('.e-end-date').children[0].textContent).toBe('' + new Date((new Date().setDate(new Date().getDate() + 1))).getDate());
            <HTMLElement>(daterangepicker.applyButton.element).click();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            (<HTMLElement>document.querySelector('.e-calendar .e-header .e-date-icon-prev')).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelector('.e-calendar .e-header .e-date-icon-prev')).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelector('.e-calendar .e-header .e-date-icon-next')).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelector('.e-calendar .e-header .e-date-icon-next')).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-start-date').children[0].textContent).toBe('' + new Date().getDate());
            // expect(document.querySelector('.e-end-date').children[0].textContent).toBe('' + new Date((new Date().setDate(new Date().getDate() + 1))).getDate());
            expect(+daterangepicker.startValue).toBe(+new Date(new Date().setHours(0, 0, 0, 0)));
            // expect(+daterangepicker.endDate).toBe(+new Date(new Date(new Date().setHours(0, 0, 0, 0)).setDate(new Date().getDate() + 1)));
            // expect(+daterangepicker.endDate).toBe(0);
            // expect(+daterangepicker.endDate).toBe(+new Date(new Date(new Date().setHours(0, 0, 0, 0)).setDate(new Date().getDate() + 1)));
        });
        it('Invalid Date Set Model', () => {
            daterangepicker.element.value = '';
            daterangepicker = createControl({ startDate: new Date('07/10/2017'), endDate: new Date('08/10/2017') });
            daterangepicker.endDate = new Date('ssss');
            daterangepicker.dataBind();
            <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error') === false && daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') === null).toBe(true);
            expect(daterangepicker.endDate === null && +daterangepicker.startDate === +new Date('07/10/2017')).toBe(true);
            expect(daterangepicker.element.value === '').toBe(true);
        });

        it('Drill down selection within the same month issue test case ', function () {
            daterangepicker = new DateRangePicker({
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            leftCalendarTitleClick();
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).click();
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).dispatchEvent(clickEvent);
            rightCalendarTitleClick();
            if (<HTMLElement>document.querySelector('.e-right-calendar .e-focused-date').previousElementSibling) {
                ((document.querySelector('.e-right-calendar .e-focused-date').previousElementSibling) as HTMLElement).click();
            } else if (<HTMLElement>document.querySelector('.e-right-calendar .e-focused-date').parentElement.previousElementSibling) {
                ((document.querySelector('.e-right-calendar .e-focused-date').parentElement.previousElementSibling.lastElementChild) as HTMLElement).click();
            } else {
                document.querySelector('.e-right-calendar .e-header .e-prev').dispatchEvent(clickEvent);
                ((document.querySelector('.e-right-calendar .e-focused-date').parentElement.parentElement.lastElementChild.lastElementChild) as HTMLElement).click();
            }
            expect(document.querySelectorAll('.e-start-date').length).toBe(2)
            expect((<HTMLElement>document.querySelector('.e-start-date')).textContent).toBe('' + new Date().getDate())
        });
        // it('Right calendar Date Selection in calendar with drilldown', () => {
        //     daterangepicker = new DateRangePicker({
        //     });
        //     daterangepicker.appendTo('#date');
        //     if (!daterangepicker.isPopupOpen()) {
        //         <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
        //     }
        //     let cells: HTMLElement = daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar .e-content td')[20];
        //     cells.dispatchEvent(clickEvent);
        //     expect(daterangepicker.applyButton.disabled === true).toBe(true);
        //     let elements: CalendarElement = getCalendarElement(daterangepicker.popupObj.element);
        //     elements.rightCalTitle.click();
        //     daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar .e-content td')[10].click();
        //     let dateCell: HTMLElement = daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar .e-content td')[12];
        //     dateCell.dispatchEvent(clickEvent);
        //     expect(daterangepicker.applyButton.disabled === false).toBe(true);
        //     expect(daterangepicker.popupObj.element.querySelector('.e-start-date') !== null && daterangepicker.popupObj.element.querySelector('.e-end-date') !== null).toBe(true)
        // });

    });


    describe('Value Property test case', () => {
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('value property with array type test case ', function () {
            daterangepicker = new DateRangePicker({ value: [new Date('4/3/2018'), new Date("5/1/2018")] });
            daterangepicker.appendTo('#date');
            expect(daterangepicker.element.value).toBe('4/3/2018 - 5/1/2018');
            expect(+daterangepicker.value[0]).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.value[1]).toBe(+new Date("5/1/2018"));
            expect(daterangepicker.value.length).toBe(2);
        });
        it('value property with object type test case ', function () {
            daterangepicker = new DateRangePicker({ value: { start: new Date('4/3/2018'), end: new Date("5/1/2018") } });
            daterangepicker.appendTo('#date');
            expect(daterangepicker.element.value).toBe('4/3/2018 - 5/1/2018');
            expect(+daterangepicker.value.start).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.value.end).toBe(+new Date("5/1/2018"));
        });
        it('value property with custom object with string type test case ', function () {
            daterangepicker = new DateRangePicker({ value: { start: <any>('4/3/2018'), end: <any>("5/1/2018") } });
            daterangepicker.appendTo('#date');
            expect(daterangepicker.element.value).toBe('4/3/2018 - 5/1/2018');
            expect(+daterangepicker.value.start).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.value.end).toBe(+new Date("5/1/2018"));
        });
        it('click on clear button with onproperty test case', () => {
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            daterangepicker = new DateRangePicker({ value: { start: <any>('4/3/2018'), end: <any>("5/1/2018") } });
            daterangepicker.appendTo('#date');
            (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.element.value).toBe("");
            daterangepicker.resetHandler(mouseEventArgs);
            expect(daterangepicker.startDate).toBe(null);
            expect(daterangepicker.endDate).toBe(null);
            daterangepicker.value = { start: <any>('4/3/2018'), end: <any>("5/1/2018") };
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/3/2018 - 5/1/2018');
            expect(+daterangepicker.value.start).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.value.end).toBe(+new Date("5/1/2018"));
        });
        it('Onproperty value property with custom object test case ', function () {
            daterangepicker = new DateRangePicker({ value: { start: <any>('4/3/2018'), end: <any>("5/1/2018") } });
            daterangepicker.appendTo('#date');
            daterangepicker.value = { start: null, end: null };
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('');
            expect(daterangepicker.value.start).toBe(null);
            expect(daterangepicker.value.end).toBe(null);
        });
        it('property initial rendering test case ', function () {
            daterangepicker = new DateRangePicker({ value: [new Date('4/3/2018'), new Date("5/1/2018")] });
            daterangepicker.appendTo('#date');
            expect(daterangepicker.element.value).toBe('4/3/2018 - 5/1/2018');
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });
        it(' value onproperty with null  test case ', function () {
            daterangepicker = new DateRangePicker({ value: [new Date('12/12/2016'), new Date('3/3/2017')] });
            daterangepicker.appendTo('#date');
            daterangepicker.value = null;
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('');
            expect(daterangepicker.startDate).toBe(null);
            expect(daterangepicker.endDate).toBe(null);
            expect(daterangepicker.value).toBe(null);
        });
        it(' value onproperty with [null]  test case ', function () {
            daterangepicker = new DateRangePicker({ value: [new Date('12/12/2016'), new Date('3/3/2017')] });
            daterangepicker.appendTo('#date');
            daterangepicker.value = [null];
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('');
            expect(daterangepicker.startDate).toBe(null);
            expect(daterangepicker.endDate).toBe(null);
            expect(daterangepicker.value).toBe(null);
        });
        it(' value onproperty with [null, null]  test case ', function () {
            daterangepicker = new DateRangePicker({ value: [new Date('12/12/2016'), new Date('3/3/2017')] });
            daterangepicker.appendTo('#date');
            daterangepicker.value = [null, null];
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('');
            expect(daterangepicker.startDate).toBe(null);
            expect(daterangepicker.endDate).toBe(null);
            expect(daterangepicker.value).toBe(null);
        });
        it('onproperty rendering for startDate and endDate with string type test case ', function () {
            daterangepicker = new DateRangePicker({});
            daterangepicker.appendTo('#date');
            daterangepicker.startDate = '4/3/2018';
            daterangepicker.endDate = "5/1/2018";
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/3/2018 - 5/1/2018');
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });
        it('onproperty rendering test case ', function () {
            daterangepicker = new DateRangePicker({});
            daterangepicker.appendTo('#date');
            daterangepicker.value = [new Date('4/3/2018'), new Date("5/1/2018")];
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/3/2018 - 5/1/2018');
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });

        it('Initial rendering of start and endDate with string type value test case ', function () {
            daterangepicker = new DateRangePicker({ startDate: <any>'4/3/2018', endDate: <any>"5/1/2018" });
            daterangepicker.appendTo('#date');
            expect(daterangepicker.element.value).toBe('4/3/2018 - 5/1/2018');
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });
        it('Initial rendering of value with string type value test case ', function () {
            daterangepicker = new DateRangePicker({ value: [new Date('4/3/2018'), new Date("5/1/2018")] });
            daterangepicker.appendTo('#date');
            expect(daterangepicker.element.value).toBe('4/3/2018 - 5/1/2018');
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });
        it('property initial rendering with string type test case ', function () {
            daterangepicker = new DateRangePicker({});
            daterangepicker.appendTo('#date');
            daterangepicker.value = ['4/3/2018', '5/1/2018'];
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/3/2018 - 5/1/2018');
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });
    });

    describe('Form element', () => {
        let range: any;
        beforeEach(() => {
            let formEle: HTMLElement = createElement('form', { id: "form-element" });
            let Ele: HTMLElement = createElement('input', { id: "range" });
            formEle.appendChild(Ele);
            document.body.appendChild(formEle);
        });
        afterEach(() => {
            if (range) {
                range.destroy();
            }
            document.body.innerHTML = '';
        });
        // Test cases for reset the component when value has been given.
        it('Input element value reset test case (initialized)', () => {
            range = new DateRangePicker({ value: [new Date('2/2/2018'), new Date('4/4/2018')] });
            range.appendTo('#range');
            (<any>document.getElementById("form-element")).reset();
            range.dataBind();
            expect(range.element.value).toBe('2/2/2018 - 4/4/2018');
            expect(range.value !== null).toBe(true);
        });
        it('Input element value changing dynamically (initialized)', () => {
            range = new DateRangePicker({ value: [new Date('2/2/2018'), new Date('4/4/2018')] });
            range.appendTo('#range');
            range.element.value = [new Date('02/12/2018'), new Date('5/7/2017')];
            (<any>document.getElementById("form-element")).reset();
            range.dataBind();
            expect(range.element.value).toBe('2/2/2018 - 4/4/2018');
            expect(range.value !== null).toBe(true);
        });
        it('Input element value changing dynamically to null (initialized)', () => {
            range = new DateRangePicker({ value: [new Date('2/2/2018'), new Date('4/4/2018')] });
            range.appendTo('#range');
            range.element.value = null;
            (<any>document.getElementById("form-element")).reset();
            range.dataBind();
            expect(range.element.value).toBe('2/2/2018 - 4/4/2018');
            expect(range.value !== null).toBe(true);
        });
        it('clear Input element value changing dynamically by clear icon (initialized)', () => {
            range = new DateRangePicker({ value: [new Date('2/2/2018'), new Date('4/4/2018')] });
            range.appendTo('#range');
            (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
            (<any>document.getElementById("form-element")).reset();
            range.dataBind();
            expect(range.element.value).toBe('2/2/2018 - 4/4/2018');
            expect(range.value !== null).toBe(true);
        });

        // below test cases are modified since this behavior has been changed in all input component.

        it('Input element value reset with enabled test case (initialized)', () => {
            range = new DateRangePicker({ value: [new Date('2/2/2018'), new Date('4/4/2018')], enabled: false });
            range.appendTo('#range');
            (<any>document.getElementById("form-element")).reset();
            range.dataBind();
            expect(range.element.value).toBe('2/2/2018 - 4/4/2018');
        });
        it('Form reset with floatLabeltype("Auto") property test case (initialized)', () => {
            range = new DateRangePicker({ value: [new Date('2/2/2018'), new Date('4/4/2018')], floatLabelType: "Auto" });
            range.appendTo('#range');
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            (<any>document.getElementById("form-element")).reset();
            range.dataBind();
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            expect(range.element.value).toBe('2/2/2018 - 4/4/2018');
        });
        it('Form reset with floatLabeltype("Always") property test case (initialized)', () => {
            range = new DateRangePicker({ value: [new Date('2/2/2018'), new Date('4/4/2018')], floatLabelType: "Always" });
            range.appendTo('#range');
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            (<any>document.getElementById("form-element")).reset();
            range.dataBind();
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            expect(range.element.value).toBe('2/2/2018 - 4/4/2018');
        });
        it('Form reset with floatLabeltype("Never") property test case (initialized)', () => {
            range = new DateRangePicker({ value: [new Date('2/2/2018'), new Date('4/4/2018')], floatLabelType: "Never" });
            range.appendTo('#range');
            expect(document.querySelector('.e-float-text')).toBe(null);
            (<any>document.getElementById("form-element")).reset();
            range.dataBind();
            expect(document.querySelector('.e-float-text')).toBe(null);
            expect(range.element.value).toBe('2/2/2018 - 4/4/2018');
        });
        it('Input value reset in destroy case (initialized) ', () => {
            range = new DateRangePicker({ value: [new Date('02/02/2017'), new Date('4/4/2018')] });
            range.appendTo('#range');
            range.destroy();
            (<any>document.getElementById("form-element")).reset();
            expect((<any>document.getElementById('range')).value !== '2/2/2017 - 4/4/2018').toBe(true);
            range = null;
        });

        // Test cases for reset the component when value not initialized

        it('Input element value changing dynamically', () => {
            range = new DateRangePicker();
            range.appendTo('#range');
            range.element.value = [new Date('02/12/2018'), new Date('5/7/2017')];
            (<any>document.getElementById("form-element")).reset();
            range.dataBind();
            expect(range.element.value).toBe('');
            expect(range.value === null).toBe(true);
        });
        it('Input element value changing dynamically to null', () => {
            range = new DateRangePicker();
            range.appendTo('#range');
            range.element.value = null;
            (<any>document.getElementById("form-element")).reset();
            range.dataBind();
            expect(range.element.value).toBe('');
            expect(range.value === null).toBe(true);
        });
        it('clear Input element value changing dynamically by clear icon', () => {
            range = new DateRangePicker();
            range.appendTo('#range');
            (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
            (<any>document.getElementById("form-element")).reset();
            range.dataBind();
            expect(range.element.value).toBe('');
            expect(range.value === null).toBe(true);
        });
        it('Input element value reset with enabled test case', () => {
            range = new DateRangePicker();
            range.appendTo('#range');
            (<any>document.getElementById("form-element")).reset();
            range.dataBind();
            expect(range.element.value).toBe('');
        });

        // Below case need to be fixed by the component.

        // it('Form reset with floatLabeltype("Auto") property test case', () => {
        //     range = new DateRangePicker({ floatLabelType: "Auto" });
        //     range.appendTo('#range');
        //     expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
        //     (<any>document.getElementById("form-element")).reset();
        //     range.dataBind();
        //     expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
        //     expect(range.element.value).toBe('');
        // });

        it('Form reset with floatLabeltype("Always") property test case', () => {
            range = new DateRangePicker({ floatLabelType: "Always" });
            range.appendTo('#range');
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            (<any>document.getElementById("form-element")).reset();
            range.dataBind();
            expect(document.querySelector('.e-float-text').classList.contains('e-label-top')).toBe(true);
            expect(range.element.value).toBe('');
        });
        it('Form reset with floatLabeltype("Never") property test case', () => {
            range = new DateRangePicker({ floatLabelType: "Never" });
            range.appendTo('#range');
            expect(document.querySelector('.e-float-text')).toBe(null);
            (<any>document.getElementById("form-element")).reset();
            range.dataBind();
            expect(document.querySelector('.e-float-text')).toBe(null);
            expect(range.element.value).toBe('');
        });
        it('Input value reset in destroy case ', () => {
            range = new DateRangePicker({});
            range.appendTo('#range');
            range.destroy();
            (<any>document.getElementById("form-element")).reset();
            expect((<any>document.getElementById('range')).value === '').toBe(true);
            range = null;
        });
    });

    describe('FirstDayOfWeek test case', () => {
        let range: any;
        beforeEach(() => {
            let Ele: HTMLElement = createElement('input', { id: "range" });
            document.body.appendChild(Ele);
        });
        afterEach(() => {
            if (range) {
                range.destroy();
            }
            document.body.innerHTML = '';
        });
        it('firstDayOfWeek based on the culture "de" test case', () => {
            loadCultureFiles('de', true);
            loadCultureFiles('de');
            range = new DateRangePicker({ locale: 'de' });
            range.appendTo('#range');
            expect(range.firstDayOfWeek).toBe(1)
        });

        it('firstDayOfWeek based on the culture "ar" test case', () => {
            loadCultureFiles('ar', true);
            loadCultureFiles('ar');
            range = new DateRangePicker({ locale: 'ar' });
            range.appendTo('#range');
            //CLDR Data
            // expect(range.firstDayOfWeek).toBe(6)
        });
    });


    describe('Hidden input testing', () => {
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#date');
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Hidden value testing', () => {
            daterangepicker.value = null;
            daterangepicker.dataBind();
            expect(daterangepicker.inputWrapper.container.childElementCount).toBe(5);
            daterangepicker.value = [new Date("1/1/2019"), new Date("3/1/2019")];
            daterangepicker.dataBind();
            expect(daterangepicker.inputWrapper.container.childElementCount).toBe(5);
            expect(daterangepicker.inputWrapper.container.children[3].name).toBe("date");
            expect(daterangepicker.inputWrapper.container.children[3].type).toBe("text");
            expect(daterangepicker.inputWrapper.container.children[4].name).toBe("date");
            expect(daterangepicker.inputWrapper.container.children[4].type).toBe("text");
        });
    });

    describe('open event customization ', () => {
        let range: any;
        beforeEach(() => {
            let Ele: HTMLElement = createElement('input', { id: "range" });
            document.body.appendChild(Ele);
        });
        afterEach(() => {
            if (range) {
                range.destroy();
            }
            document.body.innerHTML = '';
        });
        it('PopupCreated event appendTo input container test case ', () => {
            range = new DateRangePicker({
                open: function (args: RangePopupEventArgs) {
                    args.appendTo = this.inputWrapper.container;
                }
            });
            range.appendTo('#range');
            (<HTMLElement>(document.getElementsByClassName('  e-input-group-icon e-range-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(range.popupObj.element.parentElement).toBe(range.inputWrapper.container);
        });
        it('PopupCreated event appendTo body test case ', () => {
            range = new DateRangePicker({
                open: function (args: RangePopupEventArgs) {
                }
            });
            range.appendTo('#range');
            (<HTMLElement>(document.getElementsByClassName('  e-input-group-icon e-range-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(range.popupObj.element.parentElement).toBe(document.body);
        });
        it('PopupCreated event  relateTo  body test case ', () => {
            range = new DateRangePicker({
                open: function (args: RangePopupEventArgs) {
                    args.popup.relateTo = document.body;
                }
            });
            range.appendTo('#range');
            (<HTMLElement>(document.getElementsByClassName('  e-input-group-icon e-range-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(range.popupObj.relateTo).toBe(document.body);
        });
        it('PopupCreated event  offsetY  body test case ', () => {
            range = new DateRangePicker({
                open: function (args: RangePopupEventArgs) {
                    args.popup.offsetY = 20;
                }
            });
            range.appendTo('#range');
            (<HTMLElement>(document.getElementsByClassName('  e-input-group-icon e-range-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(range.popupObj.offsetY).toBe(20);
        });
        it('PopupCreated event  collision  body test case ', () => {
            range = new DateRangePicker({
                open: function (args: RangePopupEventArgs) {
                    args.popup.collision = { X: 'flip' };
                }
            });
            range.appendTo('#range');
            (<HTMLElement>(document.getElementsByClassName('  e-input-group-icon e-range-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(range.popupObj.collision.X).toBe('flip');
        });
        it('PopupCreated event  position  body test case ', () => {
            range = new DateRangePicker({
                open: function (args: RangePopupEventArgs) {
                    args.popup.position = { X: 'right', Y: 'top' };
                }
            });
            range.appendTo('#range');
            (<HTMLElement>(document.getElementsByClassName('  e-input-group-icon e-range-icon e-icons')[0])).dispatchEvent(clickEvent);
            expect(range.popupObj.position.X).toBe('right')
        });
    });
    describe('Data attribue testing', () => {
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            ele.setAttribute("data-value", "true");
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Data attribute at hidden element testing', () => {
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#date');
            expect(daterangepicker.inputWrapper.container.childElementCount).toBe(5);
            expect(daterangepicker.inputWrapper.container.children[3].getAttribute('data-value')).toBe("true");
            expect(daterangepicker.inputWrapper.container.children[4].getAttribute('data-value')).toBe("true");
            expect(daterangepicker.inputWrapper.container.children[3].classList.contains('e-daterange-hidden')).toBe(true);
            expect(daterangepicker.inputWrapper.container.children[4].classList.contains('e-daterange-hidden')).toBe(true);
        });
        it('Data attribute at hidden element testing', () => {
            daterangepicker = new DateRangePicker({ htmlAttributes: { "data-valmsg-replace": "true" } });
            daterangepicker.appendTo('#date');
            expect(daterangepicker.inputWrapper.container.childElementCount).toBe(5);
            expect(daterangepicker.inputWrapper.container.children[3].getAttribute('data-value')).toBe("true");
            expect(daterangepicker.inputWrapper.container.children[3].getAttribute('data-valmsg-replace')).toBe("true");
            expect(daterangepicker.inputWrapper.container.children[4].getAttribute('data-value')).toBe("true");
            expect(daterangepicker.inputWrapper.container.children[4].getAttribute('data-valmsg-replace')).toBe("true");
            expect(daterangepicker.inputWrapper.container.children[3].classList.contains('e-daterange-hidden')).toBe(true);
            expect(daterangepicker.inputWrapper.container.children[4].classList.contains('e-daterange-hidden')).toBe(true);
        });
    });
    describe('invalid String', () => {
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('input', { id: 'range' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('valid string array Value Test Case', () => {
            daterangepicker = new DateRangePicker({ value: [<any>'1/9/2018', <any>'4/10/2019'] });
            daterangepicker.appendTo('#range');
            expect(daterangepicker.element.value).toBe('1/9/2018 - 4/10/2019');
            expect(+daterangepicker.value[0]).toBe(+new Date('1/9/2018'));
            expect(+daterangepicker.value[1]).toBe(+new Date('4/10/2019'));
            daterangepicker.value = [new Date('1/9/2018'), '4/10/2020'];
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('1/9/2018 - 4/10/2020');
            expect(+daterangepicker.value[0]).toBe(+new Date('1/9/2018'));
            expect(+daterangepicker.value[1]).toBe(+new Date('4/10/2020'));
        });
        it('valid string object Value Test Case', () => {
            daterangepicker = new DateRangePicker({ value: { start: <any>'1/9/2018', end: <any>'4/10/2019' } });
            daterangepicker.appendTo('#range');
            expect(daterangepicker.element.value).toBe('1/9/2018 - 4/10/2019');
            expect(+daterangepicker.value.start).toBe(+new Date('1/9/2018'));
            expect(+daterangepicker.value.end).toBe(+new Date('4/10/2019'));
            daterangepicker.value = { start: new Date('1/9/2018'), end: '4/10/2020' };
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('1/9/2018 - 4/10/2020');
            expect(+daterangepicker.value.start).toBe(+new Date('1/9/2018'));
            expect(+daterangepicker.value.end).toBe(+new Date('4/10/2020'));
        });
        it('valid string Value Test Case', () => {
            daterangepicker = new DateRangePicker({ value: <any>'1/9/2018 - 4/10/2019' });
            daterangepicker.appendTo('#range');
            expect(daterangepicker.element.value).toBe('1/9/2018 - 4/10/2019');
            expect(+daterangepicker.value[0]).toBe(+new Date('1/9/2018'));
            expect(+daterangepicker.value[1]).toBe(+new Date('4/10/2019'));
        });
        it('valid string on property Value Test Case', () => {
            daterangepicker = new DateRangePicker({ value: <any>'1/9/2018 - 4/10/2019' });
            daterangepicker.appendTo('#range');
            expect(daterangepicker.element.value).toBe('1/9/2018 - 4/10/2019');
            expect(+daterangepicker.value[0]).toBe(+new Date('1/9/2018'));
            expect(+daterangepicker.value[1]).toBe(+new Date('4/10/2019'));
            daterangepicker.value = '1/5/2018 - 4/10/2020';
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('1/5/2018 - 4/10/2020');
            expect(+daterangepicker.value[0]).toBe(+new Date('1/5/2018'));
            expect(+daterangepicker.value[1]).toBe(+new Date('4/10/2020'));
            daterangepicker.value = ['1/9/2018', '4/10/2019'];
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('1/9/2018 - 4/10/2019');
            expect(+daterangepicker.value[0]).toBe(+new Date('1/9/2018'));
            expect(+daterangepicker.value[1]).toBe(+new Date('4/10/2019'));
            daterangepicker.value = { start: '1/5/2018', end: '4/10/2020' };
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('1/5/2018 - 4/10/2020');
            expect(+daterangepicker.value.start).toBe(+new Date('1/5/2018'));
            expect(+daterangepicker.value.end).toBe(+new Date('4/10/2020'));
        });
        it('invalid string type with value test case', () => {
            daterangepicker = new DateRangePicker({ value: <any>'dfgggdf - 4/10/2019' });
            daterangepicker.appendTo('#range');
            expect(daterangepicker.element.value).toBe('dfgggdf - 4/10/2019');
            expect(daterangepicker.value).toBe(null)
            daterangepicker.value = '4/10/2020 - 2/2/2023'
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/10/2020 - 2/2/2023');
            expect(daterangepicker.value !== null).toBe(true)
            daterangepicker.value = '4/10/2019 - dfg'
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/10/2019 - dfg');
            expect(daterangepicker.value).toBe(null)
        });
        it('invalid string Array type with value test case', () => {
            daterangepicker = new DateRangePicker({ value: [<any>'dfgggdf', <any>'4/10/2019'] });
            daterangepicker.appendTo('#range');
            expect(daterangepicker.element.value).toBe('dfgggdf - 4/10/2019');
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.value).toBe(null)
            daterangepicker.value = [<any>'4/10/2020', <any>'2/2/2023']
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/10/2020 - 2/2/2023');
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(daterangepicker.value !== null).toBe(true)
            daterangepicker.value = [<any>'4/10/2019', <any>'dfg']
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/10/2019 - dfg');
            expect(daterangepicker.value).toBe(null)
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('invalid string Object type with value test case', () => {
            daterangepicker = new DateRangePicker({ value: [<any>'dfgggdf', <any>'4/10/2019'] });
            daterangepicker.appendTo('#range');
            expect(daterangepicker.element.value).toBe('dfgggdf - 4/10/2019');
            expect(daterangepicker.value).toBe(null)
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            daterangepicker.value = [<any>'4/10/2020', <any>'2/2/2023']
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/10/2020 - 2/2/2023');
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(daterangepicker.value !== null).toBe(true)
            daterangepicker.value = [new Date('4/10/2019'), <any>'dfg']
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/10/2019 - dfg');
            expect(daterangepicker.value).toBe(null)
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('invalid number type with value test case ', () => {
            daterangepicker = new DateRangePicker({ value: [<any>'4/10/2019', <any>42019] });
            daterangepicker.appendTo('#range');
            expect(daterangepicker.element.value).toBe('4/10/2019 - 42019');
            expect(daterangepicker.value).toBe(null)
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            daterangepicker.value = '4/10/2020 - 2/2/2023';
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/10/2020 - 2/2/2023');
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(daterangepicker.value !== null).toBe(true)
            daterangepicker.value = { start: <any>1234, end: new Date('4/10/2019') };
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('1234 - 4/10/2019');
            expect(daterangepicker.value).toBe(null)
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('invalid string type with value test case and strictMode true ', () => {
            daterangepicker = new DateRangePicker({ value: { start: new Date('4/10/2019'), end: <any>'123werf4' }, strictMode: true });
            daterangepicker.appendTo('#range');
            expect(daterangepicker.element.value).toBe("");
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(daterangepicker.value).toBe(null)
            daterangepicker.value = '4/10/2020 - 2/2/2023';
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/10/2020 - 2/2/2023');
            daterangepicker.value = ['4/10/2019', '123werf4'];
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('');
            expect(daterangepicker.value).toBe(null)
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
        });
        it('invalid number type with value test case and strictMode true', () => {
            daterangepicker = new DateRangePicker({ value: [<any>'4/10/2019', <any>1234], strictMode: true });
            daterangepicker.appendTo('#range');
            expect(daterangepicker.element.value).toBe("");
            expect(daterangepicker.value).toBe(null)
        });

        it('single value test case', () => {
            daterangepicker = new DateRangePicker({ value: <any>'1234' });
            daterangepicker.appendTo('#range');
            expect(daterangepicker.element.value).toBe("1234");
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            expect(daterangepicker.value).toBe(null);
            daterangepicker.value = ['4/10/2019'];
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/10/2019');
            expect(daterangepicker.value).toBe(null)
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
            daterangepicker.value = { start: '4/10/209' };
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/10/209');
            expect(daterangepicker.value).toBe(null)
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(true);
        });
        it('ISO string type with value test case ', () => {
            daterangepicker = new DateRangePicker({ value: [<any>"2017-02-02T12:30:00.000Z", <any>"2019-01-02T08:06:13.3426049+00:00"] });
            daterangepicker.appendTo('#range');
            expect(daterangepicker.element.value != '').toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(daterangepicker.value !== null).toBe(true);
            // expect(daterangepicker.element.value).toBe('2/2/2017 - 1/2/2019');
        });
        it('invalid object type with value test case  ', () => {
            daterangepicker = new DateRangePicker({ value: { start: new Date('4/10/2019'), end: <any>{ a: 'b' } } });
            daterangepicker.appendTo('#range');
            expect(daterangepicker.element.value).toBe("");
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
            expect(daterangepicker.value).toBe(null)
            daterangepicker.value = '4/10/2020 - 2/2/2023';
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('4/10/2020 - 2/2/2023');
            daterangepicker.value = [{ a: 'b' }, '123werf4'];
            daterangepicker.dataBind();
            expect(daterangepicker.element.value).toBe('');
            expect(daterangepicker.value).toBe(null)
            expect(daterangepicker.inputWrapper.container.classList.contains('e-error')).toBe(false);
        });
    });

    describe('Start and Depth-Desktop', () => {
        function leftCalendarTitleClick(): void {
            (<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).click();
        }

        function rightCalendarTitleClick(): void {
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).click();
        }
        function navIconDisabled(): void {
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(true);
        }
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('default value testing', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2019'), new Date('1/10/2019')] });
            expect(daterangepicker.start).toBe('Month');
            expect(daterangepicker.depth).toBe('Month');
        });
        it('start and Depth as year', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2018'), new Date('1/10/2018')], start: 'Year', depth: 'Year' });
            expect(daterangepicker.start).toBe('Year');
            expect(daterangepicker.depth).toBe('Year');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2018');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2019');
            leftCalendarTitleClick();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2010 - 2019');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2019');
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            (<HTMLElement>document.querySelector('.e-focused-date').nextElementSibling).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2019');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2019');
            (<HTMLElement>document.querySelectorAll('.e-left-calendar .e-content td')[2]).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelectorAll('.e-right-calendar .e-content td')[2]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-left-calendar .e-content').classList.contains('e-year')).toBe(true);
            expect(document.querySelector('.e-right-calendar .e-content').classList.contains('e-year')).toBe(true);
            expect(document.querySelector('.e-start-label').innerHTML).toBe('Mar 1, 2019');
            expect(document.querySelector('.e-end-label').innerHTML).toBe('Mar 31, 2019');
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-next')).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-prev')).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-end-date').length).toBe(1);
            rightCalendarTitleClick();
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).click();
            expect(document.querySelectorAll('.e-end-date').length).toBe(2);
        });
        it('start as Decade and Depth as Year', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2019'), new Date('1/10/2039')], start: 'Decade', depth: 'Year' });
            expect(daterangepicker.start).toBe('Decade');
            expect(daterangepicker.depth).toBe('Year');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2010 - 2019');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2030 - 2039');
            (<HTMLElement>document.querySelectorAll('.e-left-calendar .e-content td')[2]).click();
            (<HTMLElement>document.querySelectorAll('.e-left-calendar .e-content td')[2]).dispatchEvent(clickEvent);;
            (<HTMLElement>document.querySelectorAll('.e-right-calendar .e-content td')[5]).dispatchEvent(clickEvent);;
            expect(document.querySelector('.e-left-calendar .e-content').classList.contains('e-year')).toBe(true);
            expect(document.querySelector('.e-right-calendar .e-content').classList.contains('e-year')).toBe(true);
            expect(document.querySelector('.e-start-label').innerHTML).toBe('Mar 1, 2011');
            expect(document.querySelector('.e-end-label').innerHTML).toBe('Jun 30, 2039');
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-next')).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-prev')).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-end-date').length).toBe(1);
        });
        it('start and Depth as Decade', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2019'), new Date('1/10/2019')], start: 'Decade', depth: 'Decade' });
            expect(daterangepicker.start).toBe('Decade');
            expect(daterangepicker.depth).toBe('Decade');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2010 - 2019');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2020 - 2029');
            (<HTMLElement>document.querySelectorAll('.e-left-calendar .e-content td')[2]).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelectorAll('.e-right-calendar .e-content td')[2]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-left-calendar .e-content').classList.contains('e-decade')).toBe(true);
            expect(document.querySelector('.e-right-calendar .e-content').classList.contains('e-decade')).toBe(true);
            expect(document.querySelector('.e-start-label').innerHTML).toBe('Jan 1, 2011');
            expect(document.querySelector('.e-end-label').innerHTML).toBe('Dec 31, 2021');
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-next')).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-prev')).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-end-date').length).toBe(1);
        })
        it('start and Depth as Decade on property', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2019'), new Date('1/10/2039')] });
            expect(daterangepicker.start).toBe('Month');
            expect(daterangepicker.depth).toBe('Month');
            daterangepicker.depth = 'Decade';
            daterangepicker.start = 'Decade';
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.start).toBe('Decade');
            expect(daterangepicker.depth).toBe('Decade');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2010 - 2019');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2030 - 2039');
            (<HTMLElement>document.querySelectorAll('.e-left-calendar .e-content td')[2]).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelectorAll('.e-right-calendar .e-content td')[2]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-left-calendar .e-content').classList.contains('e-decade')).toBe(true);
            expect(document.querySelector('.e-right-calendar .e-content').classList.contains('e-decade')).toBe(true);
            expect(document.querySelector('.e-start-label').innerHTML).toBe('Jan 1, 2011');
            expect(document.querySelector('.e-end-label').innerHTML).toBe('Dec 31, 2031');
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-next')).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-prev')).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-end-date').length).toBe(1);
        });
        it('start as Decade and Depth as Year on property', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2019'), new Date('1/10/2039')] });
            expect(daterangepicker.start).toBe('Month');
            expect(daterangepicker.depth).toBe('Month');
            daterangepicker.depth = 'Year';
            daterangepicker.start = 'Decade';
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.start).toBe('Decade');
            expect(daterangepicker.depth).toBe('Year');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2010 - 2019');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2030 - 2039');
            (<HTMLElement>document.querySelectorAll('.e-left-calendar .e-content td')[2]).click();
            (<HTMLElement>document.querySelectorAll('.e-left-calendar .e-content td')[2]).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelectorAll('.e-right-calendar .e-content td')[5]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-left-calendar .e-content').classList.contains('e-year')).toBe(true);
            expect(document.querySelector('.e-right-calendar .e-content').classList.contains('e-year')).toBe(true);
            expect(document.querySelector('.e-start-label').innerHTML).toBe('Mar 1, 2011');
            expect(document.querySelector('.e-end-label').innerHTML).toBe('Jun 30, 2039');
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-next')).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-prev')).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-end-date').length).toBe(1);
        });
        it('start and Depth as year on property', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2018'), new Date('1/10/2020')] });
            expect(daterangepicker.start).toBe('Month');
            expect(daterangepicker.depth).toBe('Month');
            daterangepicker.depth = 'Year';
            daterangepicker.start = 'Year';
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.start).toBe('Year');
            expect(daterangepicker.depth).toBe('Year');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2018');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2020');
        });
        it('start and Depth as year and end Exceding max', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2018'), new Date('1/10/2118')], start: 'Year', depth: 'Year' });
            expect(daterangepicker.start).toBe('Year');
            expect(daterangepicker.depth).toBe('Year');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe(((new Date()).getFullYear()).toString());
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe(((new Date()).getFullYear() + 1).toString());
        });
        it('start and Depth as Decade and end Exceding max', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2019'), new Date('1/10/2119')], start: 'Decade', depth: 'Decade' });
            expect(daterangepicker.start).toBe('Decade');
            expect(daterangepicker.depth).toBe('Decade');
            let startyear: number = (new Date()).getFullYear();
            let stDec: number = (startyear - (startyear % 10));
            let startDecade = (stDec.toString()) + ' - ' + ((stDec + 9).toString());
            let endDecade = ((stDec + 10).toString()) + ' - ' + ((stDec + 19).toString());
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe(startDecade);
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe(endDecade);
        });
        it('navigation via drill up and selction with start Date only', () => {
            daterangepicker = createControl({ startDate: new Date('1/2/2011') });
            expect(daterangepicker.start).toBe('Month');
            expect(daterangepicker.depth).toBe('Month');
            rightCalendarTitleClick();
            (<HTMLElement>document.querySelectorAll('.e-right-calendar .e-content td')[5]).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('January 2011');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('June 2011');
            daterangepicker.start = 'Year';
            daterangepicker.depth = 'Year';
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.start).toBe('Year');
            expect(daterangepicker.depth).toBe('Year');
            rightCalendarTitleClick();
            (<HTMLElement>document.querySelectorAll('.e-right-calendar .e-content td')[5]).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2011');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2014');
        })
        it('navigation via drill up and selction with start and End Date', () => {
            daterangepicker = createControl({ startDate: new Date('1/1/2011'), endDate: new Date('6/30/2011') });
            expect(daterangepicker.start).toBe('Month');
            expect(daterangepicker.depth).toBe('Month');
            rightCalendarTitleClick();
            (<HTMLElement>document.querySelectorAll('.e-right-calendar .e-content td')[5]).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('January 2011');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('June 2011');
            daterangepicker.start = 'Year';
            daterangepicker.depth = 'Year';
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.start).toBe('Year');
            expect(daterangepicker.depth).toBe('Year');
            rightCalendarTitleClick();
            (<HTMLElement>document.querySelectorAll('.e-right-calendar .e-content td')[5]).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2011');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2014');
        })
        it('start and Depth as year with mindays and maxdays', () => {
            daterangepicker = createControl({ value: [new Date('2/1/2018'), new Date('5/31/2018')], start: 'Year', depth: 'Year', minDays: 65, maxDays: 159 });
            expect(daterangepicker.start).toBe('Year');
            expect(daterangepicker.depth).toBe('Year');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2018');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2019');
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-start-date')).nextElementSibling.classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-end-date')).nextElementSibling.classList.contains('e-disabled')).toBe(false);
            (<HTMLElement>document.querySelectorAll('.e-left-calendar .e-content td')[5]).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-start-date')).nextElementSibling.classList.contains('e-disabled')).toBe(true);
            expect((<HTMLElement>document.querySelectorAll('.e-right-calendar .e-content td')[3]).classList.contains('e-disabled')).toBe(true);
        });
        it('start and Depth as year Selection maintained on navigation', () => {
            daterangepicker = createControl({ value: [new Date('2/1/2018'), new Date('5/31/2018')], start: 'Year', depth: 'Year', minDays: 64 });
            expect(daterangepicker.start).toBe('Year');
            expect(daterangepicker.depth).toBe('Year');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2018');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2019');
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-start-date')).nextElementSibling.classList.contains('e-disabled')).toBe(false);
            (<HTMLElement>document.querySelectorAll('.e-left-calendar .e-content td')[5]).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-start-date')).innerText).toBe('Jun')
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-start-date')).nextElementSibling.classList.contains('e-disabled')).toBe(true);
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-next')).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-prev')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-start-date')).innerText).toBe('Jun')
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-start-date')).nextElementSibling.classList.contains('e-disabled')).toBe(true);
            (<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-prev')).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-next')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-start-date')).innerText).toBe('Jun')
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-start-date')).nextElementSibling.classList.contains('e-disabled')).toBe(true);
        });
        it('start and Depth as Decade Selection maintained on navigation', () => {
            daterangepicker = createControl({ value: [new Date('1/1/2015'), new Date('12/31/2018')], start: 'Decade', depth: 'Decade', minDays: 864 });
            expect(daterangepicker.start).toBe('Decade');
            expect(daterangepicker.depth).toBe('Decade');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2010 - 2019');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2020 - 2029');
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-start-date')).nextElementSibling.classList.contains('e-disabled')).toBe(false);
            (<HTMLElement>document.querySelectorAll('.e-left-calendar .e-content td')[5]).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-start-date')).innerText).toBe('2014')
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-start-date')).nextElementSibling.classList.contains('e-disabled')).toBe(true);
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-next')).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-prev')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-start-date')).innerText).toBe('2014')
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-start-date')).nextElementSibling.classList.contains('e-disabled')).toBe(true);
            (<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-prev')).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-next')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-start-date')).innerText).toBe('2014')
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-start-date')).nextElementSibling.classList.contains('e-disabled')).toBe(true);
        });
        it('start and Depth as Decade ,no rangehover for same start and end date', () => {
            daterangepicker = createControl({ value: [new Date('1/1/2016'), new Date('12/31/2018')], start: 'Decade', depth: 'Decade' });
            expect(daterangepicker.start).toBe('Decade');
            expect(daterangepicker.depth).toBe('Decade');
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2010 - 2019');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2020 - 2029');
            expect((<HTMLElement>document.querySelector('.e-start-date')).classList.contains('e-range-hover')).toBe(true);
            expect((<HTMLElement>document.querySelector('.e-end-date')).classList.contains('e-range-hover')).toBe(true);
            (<HTMLElement>document.querySelectorAll('.e-left-calendar .e-content td')[5]).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelectorAll('.e-left-calendar .e-content td')[5]).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-start-date')).innerText).toBe('2014')
            expect((<HTMLElement>document.querySelector('.e-end-date')).innerText).toBe('2014');
            expect((<HTMLElement>document.querySelector('.e-start-date')).classList.contains('e-range-hover')).toBe(false);
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-next')).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-prev')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-start-date')).innerText).toBe('2014')
            expect((<HTMLElement>document.querySelector('.e-start-date')).classList.contains('e-range-hover')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-end-date')).innerText).toBe('2014');
            (<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-prev')).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-next')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-start-date')).innerText).toBe('2014')
            expect((<HTMLElement>document.querySelector('.e-end-date')).innerText).toBe('2014')
            expect((<HTMLElement>document.querySelector('.e-start-date')).classList.contains('e-range-hover')).toBe(false);
        });
    });
    describe('Start and Depth-Mobile', () => {
        function calendarTitleClick(): void {
            (<HTMLElement>document.querySelector('.e-day.e-title')).click();
        }
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('default value testing', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2019'), new Date('1/10/2019')] }, true);
            expect(daterangepicker.start).toBe('Month');
            expect(daterangepicker.depth).toBe('Month');
        });
        it('start and Depth as year', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2018'), new Date('2/10/2018')], start: 'Year', depth: 'Year' }, true);
            expect(daterangepicker.start).toBe('Year');
            expect(daterangepicker.depth).toBe('Year');
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2018');
            (<HTMLElement>document.querySelectorAll('.e-content td')[2]).dispatchEvent(clickEvent);
            /*next Button*/
            (<HTMLElement>document.querySelector('.e-next')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2019');
            (<HTMLElement>document.querySelectorAll('.e-content td')[6]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-content').classList.contains('e-year')).toBe(true);
            /*next Button*/
            (<HTMLElement>document.querySelector('.e-next')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2020');
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            expect(document.querySelectorAll('.e-start-date').length).toBe(0);
            /*prev Button*/
            (<HTMLElement>document.querySelector('.e-prev')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2019');
            expect(document.querySelectorAll('.e-end-date').length).toBe(1);
            expect(document.querySelectorAll('.e-start-date').length).toBe(0);
            /*prev Button*/
            (<HTMLElement>document.querySelector('.e-prev')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2018');
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            expect(document.querySelectorAll('.e-start-date').length).toBe(1);
            (<HTMLElement>document.querySelector('.e-start-date')).nextElementSibling.dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-end-date').length).toBe(1);
            expect(document.querySelectorAll('.e-start-date').length).toBe(1);
        });
        it('start and Depth as year, navigation with start alone', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2018'), new Date('2/10/2018')], start: 'Year', depth: 'Year' }, true);
            expect(daterangepicker.start).toBe('Year');
            expect(daterangepicker.depth).toBe('Year');
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2018');
            (<HTMLElement>document.querySelectorAll('.e-content td')[2]).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelectorAll('.e-content td')[2]).classList.contains('e-start-date')).toBe(true);
            expect((<HTMLButtonElement>document.querySelector('.e-end-btn.e-btn')).disabled).toBe(false);
            expect(document.querySelector('.e-start-btn.e-btn').classList.contains('e-active')).toBe(false);
            expect(document.querySelector('.e-end-btn.e-btn').classList.contains('e-active')).toBe(true);
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(true);
            /*next Button*/
            (<HTMLElement>document.querySelector('.e-next')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2019');
            expect(document.querySelector('.e-start-date')).toBe(null);
            /*prev Button*/
            (<HTMLElement>document.querySelector('.e-prev')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2018');
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(true);
            /*start Button*/
            (<HTMLElement>document.querySelector('.e-start-btn.e-btn')).click();
            expect((<HTMLElement>document.querySelectorAll('.e-content td')[2]).classList.contains('e-start-date')).toBe(true);
            expect((<HTMLButtonElement>document.querySelector('.e-end-btn.e-btn')).disabled).toBe(false);
            expect(document.querySelector('.e-start-btn.e-btn').classList.contains('e-active')).toBe(true);
            expect(document.querySelector('.e-end-btn.e-btn').classList.contains('e-active')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            /*end Button not working so selecting same date again*/
            (<HTMLElement>document.querySelectorAll('.e-content td')[2]).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2018');
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(true);
        });
        it('start and Depth as year and navigation', () => {
            daterangepicker = createControl({ value: [new Date('2/1/2018'), new Date('5/31/2018')], start: 'Year', depth: 'Year' }, true);
            expect(daterangepicker.start).toBe('Year');
            expect(daterangepicker.depth).toBe('Year');
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2018');
            expect((<HTMLButtonElement>document.querySelector('.e-end-btn.e-btn')).disabled).toBe(false);
            expect(document.querySelector('.e-end-btn.e-btn').classList.contains('e-active')).toBe(false);
            /*end Button*/
            (<HTMLElement>document.querySelector('.e-end-btn.e-btn')).click();
            expect(document.querySelector('.e-start-btn.e-btn').classList.contains('e-active')).toBe(false);
            expect(document.querySelector('.e-end-btn.e-btn').classList.contains('e-active')).toBe(true);
            /*start Button*/
            (<HTMLElement>document.querySelector('.e-start-btn.e-btn')).click();
            calendarTitleClick();
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2010 - 2019');
            (<HTMLElement>document.querySelector('.e-focused-date').nextElementSibling).click();
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2019');
            expect((<HTMLButtonElement>document.querySelector('.e-end-btn.e-btn')).disabled).toBe(false);
            expect(document.querySelector('.e-end-btn.e-btn').classList.contains('e-active')).toBe(false);
            expect(document.querySelector('.e-date-disabled')).toBe(null);
            /*prev Button*/
            (<HTMLElement>document.querySelector('.e-prev')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            /*end Button*/
            (<HTMLElement>document.querySelector('.e-end-btn.e-btn')).click();
            expect(document.querySelector('.e-start-btn.e-btn').classList.contains('e-active')).toBe(false);
            expect(document.querySelector('.e-end-btn.e-btn').classList.contains('e-active')).toBe(true);
            /*start Button*/
            (<HTMLElement>document.querySelector('.e-start-btn.e-btn')).click();
            daterangepicker.value = '';
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect((<HTMLButtonElement>document.querySelector('.e-end-btn.e-btn')).disabled).toBe(true);
            expect(document.querySelector('.e-end-btn.e-btn').classList.contains('e-active')).toBe(false);
            expect(document.querySelector('.e-start-btn.e-btn').classList.contains('e-active')).toBe(true);
        });
        it('start and Depth as Decade', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2018'), new Date('2/10/2018')], start: 'Decade', depth: 'Decade' }, true);
            expect(daterangepicker.start).toBe('Decade');
            expect(daterangepicker.depth).toBe('Decade');
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2010 - 2019');
            (<HTMLElement>document.querySelectorAll('.e-content td')[2]).dispatchEvent(clickEvent);
            /*next Button*/
            (<HTMLElement>document.querySelector('.e-next')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2020 - 2029');
            (<HTMLElement>document.querySelectorAll('.e-content td')[6]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-content').classList.contains('e-decade')).toBe(true);
            /*next Button*/
            (<HTMLElement>document.querySelector('.e-next')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2030 - 2039');
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            expect(document.querySelectorAll('.e-start-date').length).toBe(0);
            /*prev Button*/
            (<HTMLElement>document.querySelector('.e-prev')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2020 - 2029');
            expect(document.querySelectorAll('.e-end-date').length).toBe(1);
            expect(document.querySelectorAll('.e-start-date').length).toBe(0);
            /*prev Button*/
            (<HTMLElement>document.querySelector('.e-prev')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2010 - 2019');
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            expect(document.querySelectorAll('.e-start-date').length).toBe(1);
            (<HTMLElement>document.querySelector('.e-start-date')).nextElementSibling.dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-end-date').length).toBe(1);
            expect(document.querySelectorAll('.e-start-date').length).toBe(1);
        });
        it('start and Depth as Decade, navigation with start alone', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2018'), new Date('2/10/2018')], start: 'Decade', depth: 'Decade' }, true);
            expect(daterangepicker.start).toBe('Decade');
            expect(daterangepicker.depth).toBe('Decade');
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2010 - 2019');
            (<HTMLElement>document.querySelectorAll('.e-content td')[2]).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelectorAll('.e-content td')[2]).classList.contains('e-start-date')).toBe(true);
            expect((<HTMLButtonElement>document.querySelector('.e-end-btn.e-btn')).disabled).toBe(false);
            expect(document.querySelector('.e-start-btn.e-btn').classList.contains('e-active')).toBe(false);
            expect(document.querySelector('.e-end-btn.e-btn').classList.contains('e-active')).toBe(true);
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(true);
            /*next Button*/
            (<HTMLElement>document.querySelector('.e-next')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2020 - 2029');
            expect(document.querySelector('.e-start-date')).toBe(null);
            /*prev Button*/
            (<HTMLElement>document.querySelector('.e-prev')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2010 - 2019');
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(true);
            /*start Button*/
            (<HTMLElement>document.querySelector('.e-start-btn.e-btn')).click();
            expect((<HTMLElement>document.querySelectorAll('.e-content td')[2]).classList.contains('e-start-date')).toBe(true);
            expect((<HTMLButtonElement>document.querySelector('.e-end-btn.e-btn')).disabled).toBe(false);
            expect(document.querySelector('.e-start-btn.e-btn').classList.contains('e-active')).toBe(true);
            expect(document.querySelector('.e-end-btn.e-btn').classList.contains('e-active')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            /*end Button not working so selecting same date again*/
            (<HTMLElement>document.querySelectorAll('.e-content td')[2]).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2010 - 2019');
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(true);
        });
        it('start and Depth as Decade and navigation', () => {
            daterangepicker = createControl({ value: [new Date('1/1/2018'), new Date('12/31/2018')], start: 'Decade', depth: 'Decade' }, true);
            expect(daterangepicker.start).toBe('Decade');
            expect(daterangepicker.depth).toBe('Decade');
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2010 - 2019');
            expect((<HTMLButtonElement>document.querySelector('.e-end-btn.e-btn')).disabled).toBe(false);
            expect(document.querySelector('.e-end-btn.e-btn').classList.contains('e-active')).toBe(false);
            /*end Button*/
            (<HTMLElement>document.querySelector('.e-end-btn.e-btn')).click();
            expect(document.querySelector('.e-start-btn.e-btn').classList.contains('e-active')).toBe(false);
            expect(document.querySelector('.e-end-btn.e-btn').classList.contains('e-active')).toBe(true);
            /*start Button*/
            (<HTMLElement>document.querySelector('.e-start-btn.e-btn')).click();
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            daterangepicker.value = '';
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect((<HTMLButtonElement>document.querySelector('.e-end-btn.e-btn')).disabled).toBe(true);
            expect(document.querySelector('.e-end-btn.e-btn').classList.contains('e-active')).toBe(false);
            expect(document.querySelector('.e-start-btn.e-btn').classList.contains('e-active')).toBe(true);
        });
        it('start and Depth as Decade on property', () => {
            daterangepicker = createControl({ value: [new Date('1/1/2017'), new Date('12/31/2037')] }, true);
            expect(daterangepicker.start).toBe('Month');
            expect(daterangepicker.depth).toBe('Month');
            daterangepicker.depth = 'Decade';
            daterangepicker.start = 'Decade';
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.start).toBe('Decade');
            expect(daterangepicker.depth).toBe('Decade');
            expect(document.querySelector('.e-content').classList.contains('e-decade')).toBe(true);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2010 - 2019');
            expect(document.querySelector('.e-start-btn').innerHTML).toBe('Jan 1, 2017');
            expect(document.querySelector('.e-end-btn').innerHTML).toBe('Dec 31, 2037');
        });
        it('start as Decade and Depth as Year on property', () => {
            daterangepicker = createControl({ value: [new Date('1/1/2019'), new Date('1/31/2039')] }, true);
            expect(daterangepicker.start).toBe('Month');
            expect(daterangepicker.depth).toBe('Month');
            daterangepicker.depth = 'Year';
            daterangepicker.start = 'Decade';
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.start).toBe('Decade');
            expect(daterangepicker.depth).toBe('Year');
            expect(document.querySelector('.e-content').classList.contains('e-decade')).toBe(true);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2010 - 2019');
            (<HTMLElement>document.querySelectorAll('.e-content td')[2]).click();
            expect(document.querySelector('.e-content').classList.contains('e-year')).toBe(true);
            (<HTMLElement>document.querySelectorAll('.e-content td')[2]).dispatchEvent(clickEvent);
            /*next Button*/
            (<HTMLElement>document.querySelector('.e-next')).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelectorAll('.e-content td')[5]).dispatchEvent(clickEvent);
            expect(document.querySelector('.e-start-btn').innerHTML).toBe('Mar 1, 2011');
            expect(document.querySelector('.e-end-btn').innerHTML).toBe('Jun 30, 2012');
        });
        it('start and Depth as year on property', () => {
            daterangepicker = createControl({ value: [new Date('1/8/2018'), new Date('1/10/2020')] }, true);
            expect(daterangepicker.start).toBe('Month');
            expect(daterangepicker.depth).toBe('Month');
            expect(document.querySelector('.e-content').classList.contains('e-month')).toBe(true);
            daterangepicker.depth = 'Year';
            daterangepicker.start = 'Year';
            daterangepicker.dataBind();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            expect(daterangepicker.start).toBe('Year');
            expect(daterangepicker.depth).toBe('Year');
            expect(document.querySelector('.e-content').classList.contains('e-year')).toBe(true);
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2018');
            expect(document.querySelector('.e-start-btn').innerHTML).toBe('Jan 8, 2018');
            expect(document.querySelector('.e-end-btn').innerHTML).toBe('Jan 10, 2020');
        });
        // it('start and Depth as year and end Exceding max', () => {
        //     daterangepicker = createControl({ value: [new Date('1/1/2018'), new Date('1/31/2118')], start: 'Year', depth: 'Year' },true);
        //     expect(daterangepicker.start).toBe('Year');
        //     expect(daterangepicker.depth).toBe('Year');
        //     expect(document.querySelector('.e-content').classList.contains('e-year')).toBe(true);
        //     expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe(((new Date()).getFullYear()).toString());
        //     expect((<HTMLButtonElement>document.querySelector('.e-end-btn.e-btn')).disabled).toBe(true);
        //     expect(document.querySelector('.e-end-btn.e-btn').classList.contains('e-active')).toBe(false);
        //     expect(document.querySelector('.e-start-btn.e-btn').classList.contains('e-active')).toBe(true);
        // });
        // it('start and Depth as Decade and end Exceding max', () => {
        //     daterangepicker = createControl({ value: [new Date('1/1/2009'), new Date('12/31/2119')], start: 'Decade', depth: 'Decade' },true);
        //     expect(daterangepicker.start).toBe('Decade');
        //     expect(daterangepicker.depth).toBe('Decade');
        //     expect(document.querySelector('.e-content').classList.contains('e-decade')).toBe(true);
        //     let startyear:number = (new Date()).getFullYear();
        //     let stDec:number = (startyear-(startyear%10));
        //     let startDecade = (stDec.toString())+' - '+((stDec + 9).toString());
        //     expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe(startDecade);
        //     expect((<HTMLButtonElement>document.querySelector('.e-end-btn.e-btn')).disabled).toBe(true);
        //     expect(document.querySelector('.e-end-btn.e-btn').classList.contains('e-active')).toBe(false);
        //     expect(document.querySelector('.e-start-btn.e-btn').classList.contains('e-active')).toBe(true);
        // });
        it('start and Depth as year with mindays and maxdays', () => {
            daterangepicker = createControl({ value: [new Date('2/1/2018'), new Date('5/31/2018')], start: 'Year', depth: 'Year', minDays: 65, maxDays: 159 });
            expect(daterangepicker.start).toBe('Year');
            expect(daterangepicker.depth).toBe('Year');
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2018');
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-start-date')).nextElementSibling.classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-end-date')).nextElementSibling.classList.contains('e-disabled')).toBe(false);
            (<HTMLElement>document.querySelectorAll('.e-content td')[5]).dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-end-date').length).toBe(0);
            expect((<HTMLElement>document.querySelector('.e-start-date')).previousElementSibling.classList.contains('e-disabled')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-start-date')).nextElementSibling.classList.contains('e-disabled')).toBe(true);
        });
        it('start and Depth as Decade ,no rangehover for same start and end date', () => {
            daterangepicker = createControl({ value: [new Date('1/1/2016'), new Date('12/31/2018')], start: 'Decade', depth: 'Decade' }, true);
            expect(daterangepicker.start).toBe('Decade');
            expect(daterangepicker.depth).toBe('Decade');
            expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2010 - 2019');
            expect((<HTMLElement>document.querySelector('.e-start-date')).classList.contains('e-range-hover')).toBe(true);
            expect((<HTMLElement>document.querySelector('.e-end-date')).classList.contains('e-range-hover')).toBe(true);
            (<HTMLElement>document.querySelectorAll('.e-content td')[5]).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelectorAll('.e-content td')[5]).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-start-date')).innerText).toBe('2014')
            expect((<HTMLElement>document.querySelector('.e-end-date')).innerText).toBe('2014');
            expect((<HTMLElement>document.querySelector('.e-start-date')).classList.contains('e-range-hover')).toBe(false);
            (<HTMLElement>document.querySelector('.e-next')).dispatchEvent(clickEvent);
            (<HTMLElement>document.querySelector('.e-prev')).dispatchEvent(clickEvent);
            expect((<HTMLElement>document.querySelector('.e-start-date')).innerText).toBe('2014')
            expect((<HTMLElement>document.querySelector('.e-start-date')).classList.contains('e-range-hover')).toBe(false);
            expect((<HTMLElement>document.querySelector('.e-end-date')).innerText).toBe('2014');
        });
    });
    describe('NavigateTo', () => {
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Navigation for mobile view', function () {
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#date');
            if (daterangepicker.isMobile) {
                if (!daterangepicker.isPopupOpen()) {
                    <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
                }
                daterangepicker.navigateTo("Month", new Date("2/4/2018"));
                expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('February 2018');
                daterangepicker.navigateTo("Year", new Date("2/4/2018"));
                expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2018');
                daterangepicker.navigateTo("Decade", new Date("2/4/2018"));
                expect((<HTMLElement>document.querySelector('.e-day.e-title')).textContent).toBe('2010 - 2019');
            }
        });
        it('Navigation in desktop view calendar', function () {
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.navigateTo("Month", new Date("5/4/2018"));
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('May 2018');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('June 2018');
            daterangepicker.navigateTo("Year", new Date("5/4/2018"));
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2018');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2019');
            daterangepicker.navigateTo("Decade", new Date("5/4/2018"));
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2010 - 2019');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2020 - 2029');
        });

    });
    describe('Navigated event trigger testing', () => {
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Navigated events in desktop mode test case', () => {
            daterangepicker = new DateRangePicker({});
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.navigateTo("Month", new Date("2/3/2019"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "February 2019").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "March 2019").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Year", new Date("2/3/2025"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "2025").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "2026").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Decade", new Date("2/3/2055"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "2050 - 2059").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "2060 - 2069").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
        });
        it('Navigated events in mobile mode test case ', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/3/2019'), endDate: new Date("2/1/2019") });
            daterangepicker.appendTo('#date');
            daterangepicker.isMobile = true;
            daterangepicker.refreshControl();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            (<HTMLElement>document.querySelector('.e-calendar .e-header .e-day.e-title')).click();
            expect(document.querySelector('.e-calendar .e-content').classList.contains('e-year')).toBe(true);
            (<HTMLElement>document.querySelector('.e-calendar .e-header .e-day.e-title')).click();
            expect(document.querySelector('.e-calendar .e-content').classList.contains('e-decade')).toBe(true);
            (<HTMLElement>document.querySelector('.e-focused-date')).click();
            expect(document.querySelector('.e-calendar .e-content').classList.contains('e-year')).toBe(true);
            (<HTMLElement>document.querySelector('.e-focused-date')).click();
            expect(document.querySelector('.e-calendar .e-content').classList.contains('e-month')).toBe(true);
        });
        it('Navigated events in mobile mode test case for next and previous icon ', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/3/2019'), endDate: new Date("2/1/2019") });
            daterangepicker.appendTo('#date');
            daterangepicker.isMobile = true;
            daterangepicker.refreshControl();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.navigateTo("Month", new Date("2/3/2028"));
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Year", new Date("2/3/2028"));
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Decade", new Date("2/3/2028"));
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-overlay"))).toBe(false);
        });
        it('Navigated events in mobile mode given date is less then min value', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/3/2019'), endDate: new Date("2/1/2019") });
            daterangepicker.appendTo('#date');
            daterangepicker.isMobile = true;
            daterangepicker.refreshControl();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.navigateTo("Month", new Date("2/3/1028"));
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Year", new Date("2/3/2018"));
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Decade", new Date("2/3/1028"));
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-overlay"))).toBe(false);
        });
        it('Navigated events in mobile mode given date is greater then max value', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/3/2019'), endDate: new Date("2/1/2019") });
            daterangepicker.appendTo('#date');
            daterangepicker.isMobile = true;
            daterangepicker.refreshControl();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.navigateTo("Month", new Date("2/3/2222"));
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-overlay"))).toBe(true);
            daterangepicker.navigateTo("Year", new Date("2/3/2222"));
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-overlay"))).toBe(true);
            daterangepicker.navigateTo("Decade", new Date("2/3/2222"));
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-overlay"))).toBe(true);
        });
        it('Navigated events in mobile mode for empty date', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/3/2019'), endDate: new Date("2/1/2019") });
            daterangepicker.appendTo('#date');
            daterangepicker.isMobile = true;
            daterangepicker.refreshControl();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.navigateTo("Month", new Date(' '));
            expect(daterangepicker.popupObj.element.querySelector('.e-day.e-title').textContent === "January 2019").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Year", new Date(' '));
            expect(daterangepicker.popupObj.element.querySelector('.e-day.e-title').textContent === "2019").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Decade", new Date(' '));
            expect(daterangepicker.popupObj.element.querySelector('.e-day.e-title').textContent === "2010 - 2019").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
        });
        it('Navigated events in mobile mode for invalid date(Date)', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/3/2019'), endDate: new Date("2/1/2019") });
            daterangepicker.appendTo('#date');
            daterangepicker.isMobile = true;
            daterangepicker.refreshControl();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.navigateTo("Month", new Date("23/3/2017"));
            expect(daterangepicker.popupObj.element.querySelector('.e-day.e-title').textContent === "January 2019").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Year", new Date("23/3/2017"));
            expect(daterangepicker.popupObj.element.querySelector('.e-day.e-title').textContent === "2019").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Decade", new Date("23/3/2017"));
            expect(daterangepicker.popupObj.element.querySelector('.e-day.e-title').textContent === "2010 - 2019").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
        });
        it('Navigated events in mobile mode for invalid date(string)', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/3/2019'), endDate: new Date("2/1/2019") });
            daterangepicker.appendTo('#date');
            daterangepicker.isMobile = true;
            daterangepicker.refreshControl();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.navigateTo("Month", new Date("date"));
            expect(daterangepicker.popupObj.element.querySelector('.e-day.e-title').textContent === "January 2019").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-next').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Year", new Date("date"));
            expect(daterangepicker.popupObj.element.querySelector('.e-day.e-title').textContent === "2019").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Decade", new Date("date"));
            expect(daterangepicker.popupObj.element.querySelector('.e-day.e-title').textContent === "2010 - 2019").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-prev').classList.contains("e-overlay"))).toBe(false);
        });
        it('Navigated arugument property test case ', function () {
            daterangepicker = new DateRangePicker({
                navigated: function (args: any): void {
                    expect(typeof (args.view) === "string").toBe(true);
                    expect(typeof (args.date) === "object").toBe(true);
                    expect(typeof (args.name) === "string").toBe(true);
                    expect((Object.keys(args)).length === 3).toBe(true);
                }
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.navigateTo("Year", new Date("1/8/2019"));
        });
        it('current date is less then min value', () => {
            daterangepicker = new DateRangePicker({ min: new Date('1/1/1900'), max: new Date("11/31/2099") });
            daterangepicker.appendTo('#date');
            daterangepicker.refreshControl();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.navigateTo("Month", new Date("2/3/1800"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "January 1900").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "February 1900").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Year", new Date("2/3/1800"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "1900").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "1901").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next')).dispatchEvent(clickEvent);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Decade", new Date("2/3/1800"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "1900 - 1909").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "1910 - 1919").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next')).dispatchEvent(clickEvent);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
        });
        it('current date is greater then max value', () => {
            daterangepicker = new DateRangePicker({ min: new Date('1/1/1900'), max: new Date("11/31/2099") });
            daterangepicker.appendTo('#date');
            daterangepicker.refreshControl();
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.navigateTo("Month", new Date("2/3/3000"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "November 2099").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "December 2099").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(true);
            daterangepicker.navigateTo("Year", new Date("2/3/3000"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "2098").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "2099").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(true);
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev')).click();
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Decade", new Date("2/3/3000"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "2080 - 2089").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "2090 - 2099").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(true);
            <HTMLElement>(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev')).click();
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
        });
        // it('error class for invalid date(Date) in desktop mode', () => {
        // daterangepicker.appendTo('#date');
        // daterangepicker.strictMode = true;
        // daterangepicker.inputBlurHandler();
        // if (!daterangepicker.isPopupOpen()) {
        // <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
        // }
        // daterangepicker.navigateTo("Year", new Date("23/3/2017"));
        // expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === (new Date().getUTCFullYear()).toString()).toBe(true);
        // expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === (new Date().getUTCFullYear() + 1).toString()).toBe(true);
        // expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
        // expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
        // expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
        // expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
        // });
        // it('error class for invalid date(string) in desktop mode', () => {
        // daterangepicker.appendTo('#date');
        // daterangepicker.inputBlurHandler();
        // if (!daterangepicker.isPopupOpen()) {
        // <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
        // }
        // daterangepicker.navigateTo('Year', new Date('date'));
        // expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === (new Date().getUTCFullYear()).toString()).toBe(true);
        // expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === (new Date().getUTCFullYear() + 1).toString()).toBe(true);
        // expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
        // expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
        // expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
        // expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
        // });
        // it('error class for empty date in desktop mode', () => {
        // daterangepicker.appendTo('#date');
        // daterangepicker.inputBlurHandler();
        // if (!daterangepicker.isPopupOpen()) {
        // <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
        // }
        // daterangepicker.navigateTo("Year", new Date(' '));
        // expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === (new Date().getUTCFullYear()).toString()).toBe(true);
        // expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === (new Date().getUTCFullYear() + 1).toString()).toBe(true);
        // expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
        // expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
        // expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
        // expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
        // });
        // it('error class for invalid date in strict mode', () => {
        // daterangepicker.appendTo('#date');
        // daterangepicker.strictMode = true;
        // daterangepicker.inputBlurHandler();
        // if (!daterangepicker.isPopupOpen()) {
        // <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
        // }
        // daterangepicker.navigateTo("Year", new Date("23/3/2017"));
        // expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === (new Date().getUTCFullYear()).toString()).toBe(true);
        // expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === (new Date().getUTCFullYear() + 1).toString()).toBe(true);
        // expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
        // expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
        // expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
        // expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
        // });

        it('current date is less then min value in Rtl mode', () => {
            daterangepicker = new DateRangePicker({ min: new Date('1/1/1900'), max: new Date("11/31/2099") });
            daterangepicker.appendTo('#date');
            daterangepicker.refreshControl();
            daterangepicker.enableRtl = true;
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.navigateTo("Month", new Date("2/3/1800"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "January 1900").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "February 1900").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Year", new Date("2/3/1800"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "1900").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "1901").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            daterangepicker.navigateTo("Decade", new Date("2/3/1800"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "1900 - 1909").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "1910 - 1919").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
        });
        it('current date is greater then max value in Rtl mode', () => {
            daterangepicker = new DateRangePicker({ min: new Date('1/1/1900'), max: new Date("11/31/2099") });
            daterangepicker.appendTo('#date');
            daterangepicker.refreshControl();
            daterangepicker.enableRtl = true;
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.navigateTo("Month", new Date("2/3/3000"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "November 2099").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "December 2099").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(true);
            daterangepicker.navigateTo("Year", new Date("2/3/3000"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "2098").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "2099").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(true);
            daterangepicker.navigateTo("Decade", new Date("2/3/3000"));
            expect(daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-day.e-title').textContent === "2080 - 2089").toBe(true);
            expect(daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-day.e-title').textContent === "2090 - 2099").toBe(true);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-left-calendar .e-next').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-prev').classList.contains("e-overlay"))).toBe(false);
            expect((daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-disabled")) && (daterangepicker.popupObj.element.querySelector('.e-right-calendar .e-next').classList.contains("e-overlay"))).toBe(true);
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
    describe('DateRangePicker', function () {
        let daterangepicker: any;
        beforeEach(function () {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(function () {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('focus event checking on document click when the calendar is open test case', function () {
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#date');
            let e = {
                preventDefault: () => { },
                target: document.getElementById('date')
            };
            document.getElementsByClassName(' e-input-group-icon e-range-icon e-icons')[0].dispatchEvent(clickEvent);
            expect(daterangepicker.popupObj != null).toBe(true);
            e.target = document.getElementsByTagName('body')[0];
            daterangepicker.documentHandler(e);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(false);
        });
    });
    describe('Change event Testing', () => {
        let daterangepicker: any;
        let startValue: Date;
        let endValue: Date;
        let changeCount: number = 0;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
            changeCount = 0;
        });

        it('Format is MM yyyy', function () {
            daterangepicker = new DateRangePicker({
                format: "MM yyyy",
                change: function onChange() {
                    changeCount++;
                }
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            let startEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar.e-calendar td')[10]);
            let endEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[10]);
            startValue = daterangepicker.getIdValue(null, startEle);
            endValue = daterangepicker.getIdValue(null, endEle);
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            daterangepicker.inputBlurHandler();
            expect(changeCount).toBe(1);
        });
        it('Format is M yyyy', function () {
            daterangepicker = new DateRangePicker({
                format: "M yyyy",
                change: function onChange() {
                    changeCount++;
                }
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            let startEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar.e-calendar td')[10]);
            let endEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[10]);
            startValue = daterangepicker.getIdValue(null, startEle);
            endValue = daterangepicker.getIdValue(null, endEle);
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            daterangepicker.inputBlurHandler();
            expect(changeCount).toBe(1);
        });
        it('Format is yyyy MM', function () {
            daterangepicker = new DateRangePicker({
                format: "yyyy MM",
                change: function onChange() {
                    changeCount++;
                }
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            let startEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-left-calendar.e-calendar td')[10]);
            let endEle: HTMLElement = <HTMLElement>(daterangepicker.popupObj.element.querySelectorAll('.e-right-calendar.e-calendar td')[10]);
            startValue = daterangepicker.getIdValue(null, startEle);
            endValue = daterangepicker.getIdValue(null, endEle);
            (startEle).dispatchEvent(clickEvent);
            (endEle).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.applyButton.element).click();
            daterangepicker.inputBlurHandler();
            expect(changeCount).toBe(1);
        });
    });
    describe('Dynamic CssClass testcase', function () {
        let daterangepicker: any;
        beforeEach(function () {
            let inputElement: HTMLElement = createElement('input', { id: 'daterangepicker' });
            document.body.appendChild(inputElement);
        });
        afterEach(function () {
            if (daterangepicker) {
                daterangepicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('single css class', function () {
            daterangepicker = new DateRangePicker({
                cssClass: 'e-custom'
            });
            daterangepicker.appendTo('#daterangepicker');
            expect(daterangepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            daterangepicker.cssClass = 'e-test';
            daterangepicker.dataBind();
            expect(daterangepicker.inputWrapper.container.classList.contains('e-custom')).toBe(false);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-test')).toBe(true);
        });
        it('more than one css class', function () {
            daterangepicker = new DateRangePicker({
                cssClass: 'e-custom e-secondary'
            });
            daterangepicker.appendTo('#daterangepicker');
            expect(daterangepicker.inputWrapper.container.classList.contains('e-custom')).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-secondary')).toBe(true);
            daterangepicker.cssClass = 'e-test e-ternary';
            daterangepicker.dataBind();
            expect(daterangepicker.inputWrapper.container.classList.contains('e-custom')).toBe(false);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-secondary')).toBe(false);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-test')).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('e-ternary')).toBe(true);
        });
    });
    describe('Popup hide testing when crosses view port', function () {
        let daterangepicker: any;
        let divElement: HTMLElement;
        beforeEach(function () {
            let inputElement: HTMLElement = createElement('input', { id: 'datepicker' });
            document.body.appendChild(inputElement);
            divElement = createElement('div', { id: 'divElement' });
            divElement.style.height = '900px';
        });
        afterEach(function () {
            if (daterangepicker) {
                daterangepicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('Popup hide testing', function () {
            daterangepicker = new DateRangePicker({});
            daterangepicker.appendTo('#datepicker');
            (<HTMLInputElement>document.getElementsByClassName(' e-input-group-icon e-range-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(daterangepicker.popupWrapper !== null).toBe(true);
            document.body.appendChild(divElement);
            scrollBy({ top: 500, behavior: 'smooth' });
            daterangepicker.popupObj.trigger('targetExitViewport');
        });
    });

    describe('Cleared event test case', function () {
        let dateRangePicker: any;
        beforeEach(function () {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(function () {
            if (dateRangePicker) {
                dateRangePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('check value after button click', function () {
            dateRangePicker = new DateRangePicker({
                value: [new Date('02/11/2017'), new Date('03/11/2017')],
                cleared: function (args: any) {
                    expect(args.name).toBe("cleared");
                    expect(dateRangePicker.value).toBe(null);
                }
            });
            dateRangePicker.appendTo('#date');
            dateRangePicker.element.parentElement.querySelectorAll('.e-clear-icon')[0].click();
            expect(dateRangePicker.inputElement.value === "").toBe(true);
        });
    });
    describe('Consecutive month displaying', () => {
        function leftCalendarTitleClick(): void {
            (<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).click();
        }
        function rightCalendarTitleClick(): void {
            (<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).click();
        }
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });

        it('navigation functionality in left calendar', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/3/2018'), endDate: new Date("5/1/2018") });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            leftCalendarTitleClick();
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[0]).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('April 2018')
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('May 2018')
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });
        it('navigation functionality in right calendar', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('4/3/2018'), endDate: new Date("5/1/2018") });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            rightCalendarTitleClick();
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[1].nextElementSibling).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('April 2018');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('June 2018');
            expect(+daterangepicker.startDate).toBe(+new Date('4/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('5/1/2018'));
        });
        it('navigating to decade view in left calendar', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/3/2018'), endDate: new Date("2/1/2018") });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            leftCalendarTitleClick();
            leftCalendarTitleClick();
            expect(+daterangepicker.startDate).toBe(+new Date('1/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('2/1/2018'));
            (<HTMLElement>document.querySelector('.e-focused-date').nextElementSibling).click();
            (<HTMLElement>document.querySelector('.e-focused-date').nextElementSibling).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('February 2019')
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('February 2018')
            expect(+daterangepicker.startDate).toBe(+new Date('1/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('2/1/2018'));
        });
        it('navigating to decade view in right calendar', function () {
            daterangepicker = new DateRangePicker({ startDate: new Date('1/3/2018'), endDate: new Date("2/1/2018") });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            rightCalendarTitleClick();
            rightCalendarTitleClick();
            expect(+daterangepicker.startDate).toBe(+new Date('1/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('2/1/2018'));
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[1].nextElementSibling).click();
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[1].nextElementSibling).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('January 2018')
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('March 2019')
            expect(+daterangepicker.startDate).toBe(+new Date('1/3/2018'));
            expect(+daterangepicker.endDate).toBe(+new Date('2/1/2018'));
        });
        it('drill down left calendar with min and max test case ', function () {
            daterangepicker = new DateRangePicker({
                min: new Date('2/3/2018'),
                max: new Date('3/29/2018'),
                startDate: new Date('2/4/2018'),
                endDate: new Date('3/28/2018')
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            leftCalendarTitleClick();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('2018')
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('March 2018')
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(true);
            (<HTMLElement>document.querySelector('.e-focused-date').nextElementSibling).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('March 2018');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('March 2018');
        });

        it('drill down right calendar with min and max test case ', function () {
            daterangepicker = new DateRangePicker({
                min: new Date('2/3/2018'),
                max: new Date('3/29/2018'),
                startDate: new Date('2/4/2018'),
                endDate: new Date('3/28/2018')
            });
            daterangepicker.appendTo('#date');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            rightCalendarTitleClick();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('February 2018')
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('2018')
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(true);
            (<HTMLElement>document.querySelectorAll('.e-focused-date')[1]).click();
            expect((<HTMLElement>document.querySelector('.e-left-calendar .e-header .e-day.e-title')).textContent).toBe('February 2018');
            expect((<HTMLElement>document.querySelector('.e-right-calendar .e-header .e-day.e-title')).textContent).toBe('March 2018');
            expect(document.querySelector('.e-left-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-left-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('.e-right-calendar .e-header .e-next').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('.e-right-calendar .e-header .e-prev').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('.e-start-date').children[0].textContent).toBe('4');
            expect(document.querySelector('.e-end-date').children[0].textContent).toBe('28');
        });
    });
    describe('EJ2-36604 - While giving the class name with empty space for HtmlAttributes, console error is produced.', function () {
        let daterangepicker: any;
        beforeEach(function () {
            let inputElement: HTMLElement = createElement('input', { id: 'daterangepicker' });
            document.body.appendChild(inputElement);
        });
        afterEach(function () {
            if (daterangepicker) {
                daterangepicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('Entering the class name without any empty space', function () {
            daterangepicker = new DateRangePicker({
                htmlAttributes: { class: 'custom-class' }
            });
            daterangepicker.appendTo('#daterangepicker');
            expect(daterangepicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving empty space before and after the class name', function () {
            daterangepicker = new DateRangePicker({
                htmlAttributes: { class: ' custom-class ' }
            });
            daterangepicker.appendTo('#daterangepicker');
            expect(daterangepicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving more than one empty space between two class names', function () {
            daterangepicker = new DateRangePicker({
                htmlAttributes: { class: 'custom-class-one     custom-class-two' }
            });
            daterangepicker.appendTo('#daterangepicker');
            expect(daterangepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving more than one empty space between two class names as well before and after the class name', function () {
            daterangepicker = new DateRangePicker({
                htmlAttributes: { class: '  custom-class-one     custom-class-two  ' }
            });
            daterangepicker.appendTo('#daterangepicker');
            expect(daterangepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
        });
        it('Giving only empty space  without entering any class Name', function () {
            daterangepicker = new DateRangePicker({
            });
            daterangepicker.appendTo('#daterangepicker');
            let beforeAddClass = daterangepicker.inputWrapper.container.classList.length;
            daterangepicker.htmlAttributes = { class: '  ' };
            daterangepicker.appendTo('#daterangepicker');
            let AfterAddClass = daterangepicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        });
        it('Keep input as empty without entering any class Name', function () {
            daterangepicker = new DateRangePicker({
            });
            daterangepicker.appendTo('#daterangepicker');
            let beforeAddClass = daterangepicker.inputWrapper.container.classList.length;
            daterangepicker.htmlAttributes = { class: '' };
            daterangepicker.appendTo('#daterangepicker');
            let AfterAddClass = daterangepicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        });
        it('Entering class name without any empty space', function () {
            daterangepicker = new DateRangePicker({
                cssClass: 'custom-class'
            });
            daterangepicker.appendTo('#daterangepicker');
            expect(daterangepicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving empty space before and after the class name', function () {
            daterangepicker = new DateRangePicker({
                cssClass: ' custom-class '
            });
            daterangepicker.appendTo('#daterangepicker');
            expect(daterangepicker.inputWrapper.container.classList.contains('custom-class')).toBe(true);
        });
        it('Giving more than one empty space between two class names', function () {
            daterangepicker = new DateRangePicker({
                cssClass: 'custom-class-one   custom-class-two'
            });
            daterangepicker.appendTo('#daterangepicker');
            expect(daterangepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving more than one empty space between two class names as well as before and after the class names', function () {
            daterangepicker = new DateRangePicker({
                cssClass: '  custom-class-one   custom-class-two  '
            });
            daterangepicker.appendTo('#daterangepicker');
            expect(daterangepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving only empty space  without entering any class Name', function () {
            daterangepicker = new DateRangePicker({
            });
            daterangepicker.appendTo('#daterangepicker');
            let beforeAddClass = daterangepicker.inputWrapper.container.classList.length;
            daterangepicker.cssClass = '  ';
            daterangepicker.appendTo('#daterangepicker');
            let AfterAddClass = daterangepicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        });
        it('Keep input as empty without entering any class Name', function () {
            daterangepicker = new DateRangePicker({
            });
            daterangepicker.appendTo('#daterangepicker');
            let beforeAddClass = daterangepicker.inputWrapper.container.classList.length;
            daterangepicker.cssClass = '';
            daterangepicker.appendTo('#daterangepicker');
            let AfterAddClass = daterangepicker.inputWrapper.container.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
        });
        it('Giving class name with underscore in the beginning', function () {
            daterangepicker = new DateRangePicker({
                htmlAttributes: { class: '  _custom-class-one  ' },
                cssClass: '   _custom-class-two  '
            });
            daterangepicker.appendTo('#daterangepicker');
            expect(daterangepicker.inputWrapper.container.classList.contains('_custom-class-one')).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('_custom-class-two')).toBe(true);
        });
        it('Giving class name with empty space in both cases seperatly', function () {
            daterangepicker = new DateRangePicker({
                htmlAttributes: { class: '  custom-class-one  ' },
                cssClass: '   custom-class-two  '
            });
            daterangepicker.appendTo('#daterangepicker');
            expect(daterangepicker.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
            expect(daterangepicker.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
        });
    });
    describe('popup open while focus the component', function () {
        let dateRangePicker: any;
        let keyEventArgs: any = {
            action: 'tab'
        };
        beforeEach(function () {
            let element: HTMLElement = createElement('input', { id: 'daterange' });
            document.body.appendChild(element);
        });
        afterEach(function () {
            if (dateRangePicker) {
                dateRangePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('check the popup open', function () {
            dateRangePicker = new DateRangePicker({
                openOnFocus: true
            });
            dateRangePicker.appendTo('#daterange');
            keyEventArgs.action = 'tab';
            dateRangePicker.inputHandler(keyEventArgs);
            expect((dateRangePicker.popupObj) !== null).toBe(true);
        });
    });
    describe('bug(EJMVC-273): EJ2 Dropdown list is preventing form submission with integer data type as value property', () => {
        let daterangepicker: any;
        beforeEach(() => {
            let ele: HTMLElement = <HTMLElement>createElement('input', { id: 'date' });
            document.body.appendChild(ele);
            ele.setAttribute('data-val', 'true');
        });
        afterEach(() => {
            if (daterangepicker) {
                daterangepicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Data attribute at hidden element testing', () => {
            daterangepicker = new DateRangePicker();
            daterangepicker.appendTo('#date');
            expect(daterangepicker.element.getAttribute('data-val')).toBe('false');
        });
    });
    describe('EJ2-42298- cannot select end date when dynamically changing property through select event', function () {
        let daterangepicker: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
        };
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        beforeEach(function () {
            let inputElement: HTMLElement = createElement('input', { id: 'daterangepicker' });
            document.body.appendChild(inputElement);
        });
        afterEach(function () {
            if (daterangepicker) {
                daterangepicker.destroy();
                document.body.innerHTML = '';
            }
        });
        it('dynamically change property on select event- minDays & maxDays', function () {
            daterangepicker = new DateRangePicker({
                minDays: 2,
                maxDays: 4,
                select: function () {
                    daterangepicker.minDays = 3;
                    daterangepicker.maxDays = 6;
                }
            });
            daterangepicker.appendTo('#daterangepicker');
            daterangepicker.isMobile = true;
            mouseEventArgs.target = '.e-input-group-icon .e-range-icon .e-icons';
            mouseEventArgs.type = 'click';
            daterangepicker.rangeIconHandler(mouseEventArgs);
            expect(daterangepicker.isPopupOpen()).toBe(true);
            <HTMLElement>(daterangepicker.tableBodyElement.querySelectorAll('tr td')[1]).dispatchEvent(clickEvent);
            <HTMLElement>(daterangepicker.tableBodyElement.querySelectorAll('tr td')[5]).dispatchEvent(clickEvent);
            expect(daterangepicker.minDays).toBe(3);
            expect(daterangepicker.maxDays).toBe(6);
            expect(daterangepicker.isPopupOpen()).toBe(true);
        });
        it('dynamically change minDays greater than selected end date when strictmode is disabled', function () {
            daterangepicker = new DateRangePicker({
                startDate: new Date('11/11/2020'),
                endDate: new Date('11/12/2020')
            });
            daterangepicker.appendTo('#daterangepicker');
            daterangepicker.minDays = 3;
            daterangepicker.dataBind();
            expect(daterangepicker.startDate).toBe(null);
            expect(daterangepicker.endDate).toBe(null);
        });
        it('dynamically change minDays greater than selected end date when strictmode is enabled', function () {
            daterangepicker = new DateRangePicker({
                startDate: new Date('11/11/2020'),
                endDate: new Date('11/12/2020'),
                strictMode: true
            });
            daterangepicker.appendTo('#daterangepicker');
            daterangepicker.minDays = 3;
            daterangepicker.dataBind();
            expect(daterangepicker.startDate).not.toBe(null);
            expect(daterangepicker.endDate).not.toBe(null);
        });
        it('dynamically change maxDays less than selected end date when strictmode is disabled', function () {
            daterangepicker = new DateRangePicker({
                startDate: new Date('11/11/2020'),
                endDate: new Date('11/17/2020'),
            });
            daterangepicker.appendTo('#daterangepicker');
            daterangepicker.maxDays = 3;
            daterangepicker.dataBind();
            expect(daterangepicker.startDate).toBe(null);
            expect(daterangepicker.endDate).toBe(null);
        });
        it('dynamically change maxDays less than selected end date when strictmode is enabled', function () {
            daterangepicker = new DateRangePicker({
                startDate: new Date('11/11/2020'),
                endDate: new Date('11/17/2020'),
                strictMode: true
            });
            daterangepicker.appendTo('#daterangepicker');
            daterangepicker.maxDays = 3;
            daterangepicker.dataBind();
            expect(daterangepicker.startDate).not.toBe(null);
            expect(daterangepicker.endDate).not.toBe(null);
        });
        it('dynamically change minDays greated than maxDays when strictmode is enabled', function () {
            daterangepicker = new DateRangePicker({
                startDate: new Date('11/11/2020'),
                endDate: new Date('11/17/2020'),
                strictMode: true
            });
            daterangepicker.appendTo('#daterangepicker');
            daterangepicker.maxDays = 3;
            daterangepicker.dataBind();
            daterangepicker.minDays = 4;
            daterangepicker.dataBind();
            expect(daterangepicker.startDate).not.toBe(null);
            expect(daterangepicker.endDate).not.toBe(null);
        });
        it('dynamically change minDays greated than maxDays when strictmode is disabled', function () {
            daterangepicker = new DateRangePicker({
                startDate: new Date('11/11/2020'),
                endDate: new Date('11/17/2020'),
            });
            daterangepicker.appendTo('#daterangepicker');
            daterangepicker.maxDays = 3;
            daterangepicker.dataBind();
            daterangepicker.minDays = 4;
            daterangepicker.dataBind();
            expect(daterangepicker.startDate).toBe(null);
            expect(daterangepicker.endDate).toBe(null);
        });
        it('dynamically change minDays greated than maxDays when strictmode is enabled and popup opened', function () {
            daterangepicker = new DateRangePicker({
                startDate: new Date('11/11/2020'),
                endDate: new Date('11/17/2020'),
                strictMode: true
            });
            daterangepicker.appendTo('#daterangepicker');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.maxDays = 3;
            daterangepicker.dataBind();
            daterangepicker.minDays = 4;
            daterangepicker.dataBind();
            expect(daterangepicker.startDate).not.toBe(null);
            expect(daterangepicker.endDate).not.toBe(null);
        });
        it('dynamically change minDays greated than maxDays when strictmode is disabled and popup opened', function () {
            daterangepicker = new DateRangePicker({
                startDate: new Date('11/11/2020'),
                endDate: new Date('11/17/2020'),
            });
            daterangepicker.appendTo('#daterangepicker');
            if (!daterangepicker.isPopupOpen()) {
                <HTMLElement>(daterangepicker.inputWrapper.buttons[0]).dispatchEvent(clickEvent);
            }
            daterangepicker.maxDays = 3;
            daterangepicker.dataBind();
            daterangepicker.minDays = 4;
            daterangepicker.dataBind();
            expect(daterangepicker.startDate).toBe(null);
            expect(daterangepicker.endDate).toBe(null);
        });
    });
    describe('EJ2-45532 - DateRangepicker popup closing when updating value dynamically', function () {
        let daterangePicker: any;
        beforeEach(function () {
            let element: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(element);
        });
        afterEach(function () {
            if (daterangePicker) {
                daterangePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('check the popup open', function () {
            daterangePicker = new DateRangePicker({
            });
            daterangePicker.appendTo('#date');
            daterangePicker.show();
            daterangePicker.value = [new Date('1/1/2020'), new Date('2/2/2020')];
            daterangePicker.dataBind();
            expect((daterangePicker.popupObj) !== null).toBe(true);
            expect(daterangePicker.inputElement.value === "1/1/2020 - 2/2/2020").toBe(true)
        });
    });
    describe('EJ2-47722 - If openOnFocus property is enabled then DateRangePicker popup does not closed properly', function () {
        let dateRangePicker: any;
        beforeEach(function () {
            let element: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(element);
            dateRangePicker = new DateRangePicker({
                openOnFocus: true,
                presets: [{
                    label: 'Today', start: new Date(), end: new Date()
                },
                {
                    label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date()
                }],
            });
            dateRangePicker.appendTo('#date');
        });
        afterEach(function () {
            if (dateRangePicker) {
                dateRangePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('check the popup open by focus the control', function () {
            dateRangePicker.inputFocusHandler();
            expect(dateRangePicker.popupObj.element.querySelector('.e-date-range-container')).not.toBe(null);
            expect(dateRangePicker.popupObj.element.querySelector('.e-presets')).not.toBe(null);
            <HTMLElement>(dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            expect(document.body.contains(dateRangePicker.popupObj)).toBe(false);
            dateRangePicker.preventFocus = false;
            dateRangePicker.inputFocusHandler();
            expect(dateRangePicker.popupObj.element.querySelector('.e-date-range-container')).toBe(null);
            expect(dateRangePicker.popupObj.element.querySelector('.e-presets')).not.toBe(null);
            expect(dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child').classList.contains('e-active')).toBe(true);
            dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child').nextElementSibling.click();
            expect(document.body.contains(dateRangePicker.popupObj)).toBe(false);
            dateRangePicker.preventFocus = false;
            dateRangePicker.inputFocusHandler();
            expect(dateRangePicker.popupObj.element.querySelector('.e-date-range-container')).toBe(null);
            expect(dateRangePicker.popupObj.element.querySelector('.e-presets')).not.toBe(null);
            expect(dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child').nextElementSibling.classList.contains('e-active')).toBe(true);
            <HTMLElement>(dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            expect(document.body.contains(dateRangePicker.popupObj)).toBe(false);
            dateRangePicker.preventFocus = false;
            dateRangePicker.inputFocusHandler();
            <HTMLElement>(dateRangePicker.popupObj.element.querySelector('.e-presets li:last-child')).click();
            expect(dateRangePicker.popupObj.element.querySelector('.e-date-range-container')).not.toBe(null);
            expect(dateRangePicker.popupObj.element.querySelector('.e-presets')).not.toBe(null);
            document.getElementsByClassName('e-day')[15].dispatchEvent(clickEvent);
            document.getElementsByClassName('e-day')[16].dispatchEvent(clickEvent);
            dateRangePicker.applyButton.element.click();
            dateRangePicker.preventFocus = false;
            dateRangePicker.inputFocusHandler();
            expect(dateRangePicker.popupObj.element.querySelector('.e-date-range-container')).not.toBe(null);
            expect(dateRangePicker.popupObj.element.querySelector('.e-presets')).not.toBe(null);
            <HTMLElement>(dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            expect(document.body.contains(dateRangePicker.popupObj)).toBe(false);
        });
        it('check the popup open by focus the control as well as by click the date range icon', function () {
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-range-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(dateRangePicker.popupObj.element.querySelector('.e-date-range-container')).not.toBe(null);
            expect(dateRangePicker.popupObj.element.querySelector('.e-presets')).not.toBe(null);
            <HTMLElement>(dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            expect(document.body.contains(dateRangePicker.popupObj)).toBe(false);
            dateRangePicker.preventFocus = false;
            dateRangePicker.inputFocusHandler();
            expect(dateRangePicker.popupObj.element.querySelector('.e-date-range-container')).toBe(null);
            expect(dateRangePicker.popupObj.element.querySelector('.e-presets')).not.toBe(null);
            expect(dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child').classList.contains('e-active')).toBe(true);
            dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child').nextElementSibling.click();
            expect(document.body.contains(dateRangePicker.popupObj)).toBe(false);
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-range-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(dateRangePicker.popupObj.element.querySelector('.e-date-range-container')).toBe(null);
            expect(dateRangePicker.popupObj.element.querySelector('.e-presets')).not.toBe(null);
            expect(dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child').nextElementSibling.classList.contains('e-active')).toBe(true);
            <HTMLElement>(dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            expect(document.body.contains(dateRangePicker.popupObj)).toBe(false);
            dateRangePicker.preventFocus = false;
            dateRangePicker.inputFocusHandler();
            <HTMLElement>(dateRangePicker.popupObj.element.querySelector('.e-presets li:last-child')).click();
            expect(dateRangePicker.popupObj.element.querySelector('.e-date-range-container')).not.toBe(null);
            expect(dateRangePicker.popupObj.element.querySelector('.e-presets')).not.toBe(null);
            document.getElementsByClassName('e-day')[15].dispatchEvent(clickEvent);
            document.getElementsByClassName('e-day')[16].dispatchEvent(clickEvent);
            dateRangePicker.applyButton.element.click();
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-range-icon e-icons')[0]).dispatchEvent(clickEvent);
            expect(dateRangePicker.popupObj.element.querySelector('.e-date-range-container')).not.toBe(null);
            expect(dateRangePicker.popupObj.element.querySelector('.e-presets')).not.toBe(null);
            <HTMLElement>(dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            expect(document.body.contains(dateRangePicker.popupObj)).toBe(false);
        });
    });
    describe('EJ2-48804- Preset ranges with time value', function () {
        let dateRangePicker: any;
        beforeEach(function () {
            let element: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(element);

        });
        afterEach(function () {
            if (dateRangePicker) {
                dateRangePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Checking preset item is selected when popup is opened', function () {
            dateRangePicker = new DateRangePicker({
                presets: [
                    { label: 'Custom Date', start: new Date(2020, 1, 1, 10, 10, 50), end: new Date(2020, 3, 1, 9, 30, 40) },
                    { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }
                ],
            });
            dateRangePicker.appendTo('#date');
            dateRangePicker.show();
            <HTMLElement>(dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child')).click();
            let startDate: string = dateRangePicker.globalize.formatDate(dateRangePicker.startDate, { format: dateRangePicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = dateRangePicker.globalize.formatDate(dateRangePicker.endDate, { format: dateRangePicker.format, type: 'date', skeleton: 'yMd' });
            expect(dateRangePicker.element.value === startDate + ' - ' + endDate).toBe(true);
            dateRangePicker.hide();
            dateRangePicker.focusOut();
            dateRangePicker.show();
            expect((dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child')).classList.contains('e-active')).toBe(true);
        })
        it('Checking preset item is selected when popup is opened with predefined value', function () {
            dateRangePicker = new DateRangePicker({
                value: [new Date(2020, 1, 1, 10, 10, 50), new Date(2020, 3, 1, 9, 30, 40)],
                presets: [
                    { label: 'Custom Date', start: new Date(2020, 1, 1, 10, 10, 50), end: new Date(2020, 3, 1, 9, 30, 40) },
                    { label: 'My Date', start: new Date('1/1/2020'), end: new Date('3/2/2020') },
                    { label: 'Today', start: new Date(), end: new Date() },
                    { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }
                ],
            });
            dateRangePicker.appendTo('#date');
            let startDate: string = dateRangePicker.globalize.formatDate(dateRangePicker.startDate, { format: dateRangePicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = dateRangePicker.globalize.formatDate(dateRangePicker.endDate, { format: dateRangePicker.format, type: 'date', skeleton: 'yMd' });
            expect(dateRangePicker.element.value === startDate + ' - ' + endDate).toBe(true);
            dateRangePicker.show();
            expect((dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child')).classList.contains('e-active')).toBe(true);
            dateRangePicker.hide();
            dateRangePicker.focusOut();
            dateRangePicker.show();
            expect((dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child')).classList.contains('e-active')).toBe(true);
        })
        it('Checking preset item is selected when popup is opened with predefined startdate and enddate', function () {
            dateRangePicker = new DateRangePicker({
                startDate: new Date(2020, 1, 1, 10, 10, 50),
                endDate: new Date(2020, 3, 1, 9, 30, 40),
                presets: [
                    { label: 'Custom Date', start: new Date(2020, 1, 1, 10, 10, 50), end: new Date(2020, 3, 1, 9, 30, 40) },
                    { label: 'My Date', start: new Date('1/1/2020'), end: new Date('3/2/2020') },
                    { label: 'Today', start: new Date(), end: new Date() },
                    { label: 'Last week', start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() }
                ],
            });
            dateRangePicker.appendTo('#date');
            let startDate: string = dateRangePicker.globalize.formatDate(dateRangePicker.startDate, { format: dateRangePicker.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = dateRangePicker.globalize.formatDate(dateRangePicker.endDate, { format: dateRangePicker.format, type: 'date', skeleton: 'yMd' });
            expect(dateRangePicker.element.value === startDate + ' - ' + endDate).toBe(true);
            dateRangePicker.show();
            expect((dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child')).classList.contains('e-active')).toBe(true);
            dateRangePicker.hide();
            dateRangePicker.focusOut();
            dateRangePicker.show();
            expect((dateRangePicker.popupObj.element.querySelector('.e-presets li:first-child')).classList.contains('e-active')).toBe(true);
        })
    })
    describe('EJ2-56196 - Component get freeze if we enter invalid value', function () {
        let daterangePicker: any;
        beforeEach(function () {
            let element: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(element);
        });
        afterEach(function () {
            if (daterangePicker) {
                daterangePicker.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Check the performance issue while entering invalid start or end date', function () {
            daterangePicker = new DateRangePicker({
            });
            daterangePicker.appendTo('#date');
            daterangePicker.startDate = new Date('1/1/2020');
            daterangePicker.endDate = new Date('2/2/20201');
            daterangePicker.dataBind();
            daterangePicker.show();
            expect((daterangePicker.popupObj) !== null).toBe(true);
            expect(daterangePicker.inputElement.value === "1/1/2020 - 2/2/20201").toBe(true)
        });
    });
});
interface CalendarElement {
    leftCalTitle: HTMLElement;
    rightCalTitle: HTMLElement;
    leftCalpreviousIcon: HTMLElement;
    rightCalpreviousIcon: HTMLElement;
    leftCalNexticon: HTMLElement;
    rightCalNexticon: HTMLElement;
}
interface DeviceCalendarElement {
    title: HTMLElement;
    previousIcon: HTMLElement;
    nextIcon: HTMLElement;
}

