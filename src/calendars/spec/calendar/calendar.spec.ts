/**
 * Calendar spec document
 */
import { Ajax, isRippleEnabled, enableRipple, rippleEffect } from '@syncfusion/ej2-base';
import '../../node_modules/es6-promise/dist/es6-promise';
import { Calendar, ChangedEventArgs } from '../../src/calendar/calendar';
import { Component, EventHandler, Property, Event, CreateBuilder, Internationalization, setCulture } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { cldrData, loadCldr, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';
import { createElement, removeClass, remove, addClass, setStyleAttribute } from '@syncfusion/ej2-base';
import { isNullOrUndefined, merge, getEnumValue, getValue, getUniqueID } from '@syncfusion/ej2-base';
import { Animation, AnimationOptions, Effect } from '@syncfusion/ej2-base';
import { calculatePosition } from '@syncfusion/ej2-popups';
function getWeek(date: Date): number {
    let date1: number = new Date("" + date).valueOf();
    let date2: number = new Date(date.getFullYear(), 0, 1).valueOf();
    let d: number = new Date("" + date).valueOf();
    let a: number = (date1 - date2);
    return Math.ceil((((a) / 86400000) + new Date(date2).getDay() + 1) / 7);
}
function getIdValue(ele: any): number {
    let str: string = ele.id;
    return new Date(parseInt(str, 0)).valueOf();
}
function dateObjToNum(date: Date): number {
    return new Date("" + date).valueOf();
}
function dateValue(date: string): number {
    return (new Date(date).valueOf());
}
function loadCultureFiles(name: string, base?: boolean): void {
    let files: string[] = !base ?
        ['ca-gregorian.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json'] : ['numberingSystems.json', 'weekData.json'];
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

describe('Calendar', () => {
    let clickEvent: MouseEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('mousedown', true, true);
    describe('Daycell ', () => {
        let cal: any;
        let calendar: Calendar;
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'calendar' });
            document.body.appendChild(ele);
            cal = new Calendar({ value: new Date('2/2/2017') });
            cal.appendTo('#calendar');
        });
        afterEach(() => {
            if (calendar) {
                calendar.destroy();
                expect(document.getElementById('calendar').classList.contains('e-control')).toBe(false);
                expect(document.getElementById('calendar').classList.contains('e-calendar')).toBe(false);
                expect(document.getElementById('calendar').getAttribute('class')).toBe('');
                expect(document.getElementById('calendar').attributes.length).toBe(2);
            }
            document.body.innerHTML = '';
        });
        it(' element count test case', () => {
            expect(cal.tableBodyElement.querySelectorAll('tr td').length).toBe(42);
        });
        it(' other month element count test case', () => {
            expect(cal.tableBodyElement.querySelectorAll('tr td.e-other-month').length).toBe(14);
        });
        it('element count for the month (February 2017) test case', () => {
            expect(cal.tableBodyElement.querySelectorAll('tr td:not(.e-other-month)').length).toBe(28);
        });
        it(' element count for the month (February 2016) test case', () => {
            cal = new Calendar({ value: new Date('2/2/2016') });
            cal.appendTo('#calendar');
            expect(cal.tableBodyElement.querySelectorAll('tr td:not(.e-other-month)').length).toBe(29);
        });
        it(' element count for the month (March 2016) test case', () => {
            cal = new Calendar({ value: new Date('3/3/2016') });
            cal.appendTo('#calendar');
            expect(cal.tableBodyElement.querySelectorAll('tr td:not(.e-other-month)').length).toBe(31);
        });
        it(' cell value test case ', () => {
            cal = new Calendar({ value: new Date('3/3/2016') });
            cal.appendTo('#calendar');
            expect(getIdValue(cal.tableBodyElement.querySelectorAll('tr td:not(.e-other-month)')[0])).toBe(new Date('3/1/2016').valueOf());
        });
        it(' first date in a first row of calendar for the month (March) test case', () => {
            cal = new Calendar({ value: new Date('3/3/2016') });
            cal.appendTo('#calendar');
            expect(getIdValue(cal.tableBodyElement.querySelectorAll('tr td:not(.e-other-month)')[0])).toBe(new Date('3/1/2016').valueOf());
        });
        it(' last date in a last row of calendar for the month (March)  test case ', () => {
            cal = new Calendar({ value: new Date('3/3/2016') });
            cal.appendTo('#calendar');
            expect(getIdValue(cal.tableBodyElement.querySelectorAll('tr td:not(.e-other-month)')[30])).toBe(new Date('3/31/2016').valueOf());
        });
        it(' first date in a first row of calendar for the month (April) test case ', () => {
            cal = new Calendar({ value: new Date('4/3/2016') });
            cal.appendTo('#calendar');
            expect(getIdValue(cal.tableBodyElement.querySelectorAll('tr td:not(.e-other-month)')[0])).toBe(new Date('4/1/2016').valueOf());
        });
        it('   last date in a last row of calendar for the month (March) test case ', () => {
            cal = new Calendar({ value: new Date('4/3/2016') });
            cal.appendTo('#calendar');
            expect(getIdValue(cal.tableBodyElement.querySelectorAll('tr td:not(.e-other-month)')[29])).toBe(new Date('4/30/2016').valueOf());
        });
    });
    describe('Element render', () => {
        let Cal: any;
        beforeEach(() => {

            let ele: HTMLElement = createElement('div', { id: 'calendar' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (Cal) {
                Cal.destroy();
                document.body.innerHTML = '';
            }
        });


        it('Jan month element test case ', () => {
            Cal = new Calendar({ min: new Date('1/2/2016'), max: new Date('1/31/2016') });
            Cal.appendTo('#calendar');
            let tds: any = document.querySelectorAll('.e-cell:not(.e-disabled)');
            expect(document.querySelectorAll('.e-cell:not(.e-disabled)')[0].children[0].textContent).toBe('2')
            expect((document.querySelectorAll('.e-cell:not(.e-disabled)')[tds.length - 1]).children[0].textContent).toBe('31')
        });
        it(' Feb month element in leap year test case', () => {
            Cal = new Calendar({ min: new Date('2/2/2016'), max: new Date('2/29/2016') });
            Cal.appendTo('#calendar');
            let tds: any = document.querySelectorAll('.e-cell:not(.e-disabled)');
            expect(document.querySelectorAll('.e-cell:not(.e-disabled)')[0].children[0].textContent).toBe('2')
            expect((document.querySelectorAll('.e-cell:not(.e-disabled)')[tds.length - 1]).children[0].textContent).toBe('29')
        });
        it(' March month element test case', () => {
            Cal = new Calendar({ min: new Date('3/2/2016'), max: new Date('3/31/2016') });
            Cal.appendTo('#calendar');
            let tds: any = document.querySelectorAll('.e-cell:not(.e-disabled)');
            expect(document.querySelectorAll('.e-cell:not(.e-disabled)')[0].children[0].textContent).toBe('2')
            expect((document.querySelectorAll('.e-cell:not(.e-disabled)')[tds.length - 1]).children[0].textContent).toBe('31')
        });
        it(' April month element test case', () => {
            Cal = new Calendar({ min: new Date('4/2/2016'), max: new Date('4/30/2016') });
            Cal.appendTo('#calendar');
            let tds: any = document.querySelectorAll('.e-cell:not(.e-disabled)');
            expect(document.querySelectorAll('.e-cell:not(.e-disabled)')[0].children[0].textContent).toBe('2')
            expect((document.querySelectorAll('.e-cell:not(.e-disabled)')[tds.length - 1]).children[0].textContent).toBe('30')
        });
        it(' May month element test case', () => {
            Cal = new Calendar({ min: new Date('5/2/2016'), max: new Date('5/31/2016') });
            Cal.appendTo('#calendar');
            let tds: any = document.querySelectorAll('.e-cell:not(.e-disabled)');
            expect(document.querySelectorAll('.e-cell:not(.e-disabled)')[0].children[0].textContent).toBe('2')
            expect((document.querySelectorAll('.e-cell:not(.e-disabled)')[tds.length - 1]).children[0].textContent).toBe('31')
        });
        it(' June month element test case', () => {
            Cal = new Calendar({ min: new Date('6/2/2016'), max: new Date('6/30/2016') });
            Cal.appendTo('#calendar');
            let tds: any = document.querySelectorAll('.e-cell:not(.e-disabled)');
            expect(document.querySelectorAll('.e-cell:not(.e-disabled)')[0].children[0].textContent).toBe('2')
            expect((document.querySelectorAll('.e-cell:not(.e-disabled)')[tds.length - 1]).children[0].textContent).toBe('30')
        });
        it(' July month element test case', () => {
            Cal = new Calendar({ min: new Date('7/2/2016'), max: new Date('7/31/2016') });
            Cal.appendTo('#calendar');
            let tds: any = document.querySelectorAll('.e-cell:not(.e-disabled)');
            expect(document.querySelectorAll('.e-cell:not(.e-disabled)')[0].children[0].textContent).toBe('2')
            expect((document.querySelectorAll('.e-cell:not(.e-disabled)')[tds.length - 1]).children[0].textContent).toBe('31')
        });
        it(' Auguest  month element test case', () => {
            Cal = new Calendar({ min: new Date('8/2/2016'), max: new Date('8/31/2016') });
            Cal.appendTo('#calendar');
            let tds: any = document.querySelectorAll('.e-cell:not(.e-disabled)');
            expect(document.querySelectorAll('.e-cell:not(.e-disabled)')[0].children[0].textContent).toBe('2')
            expect((document.querySelectorAll('.e-cell:not(.e-disabled)')[tds.length - 1]).children[0].textContent).toBe('31')
        });
        it(' September  month element test case', () => {
            Cal = new Calendar({ min: new Date('9/2/2016'), max: new Date('9/30/2016') });
            Cal.appendTo('#calendar');
            let tds: any = document.querySelectorAll('.e-cell:not(.e-disabled)');
            expect(document.querySelectorAll('.e-cell:not(.e-disabled)')[0].children[0].textContent).toBe('2')
            expect((document.querySelectorAll('.e-cell:not(.e-disabled)')[tds.length - 1]).children[0].textContent).toBe('30')
        });
        it(' October  month element test case', () => {
            Cal = new Calendar({ min: new Date('10/2/2016'), max: new Date('10/31/2016') });
            Cal.appendTo('#calendar');
            let tds: any = document.querySelectorAll('.e-cell:not(.e-disabled)');
            expect(document.querySelectorAll('.e-cell:not(.e-disabled)')[0].children[0].textContent).toBe('2')
            expect((document.querySelectorAll('.e-cell:not(.e-disabled)')[tds.length - 1]).children[0].textContent).toBe('31')
        });
        it(' November  month element test case', () => {
            Cal = new Calendar({ min: new Date('11/2/2016'), max: new Date('11/30/2016') });
            Cal.appendTo('#calendar');
            let tds: any = document.querySelectorAll('.e-cell:not(.e-disabled)');
            expect(document.querySelectorAll('.e-cell:not(.e-disabled)')[0].children[0].textContent).toBe('2')
            expect((document.querySelectorAll('.e-cell:not(.e-disabled)')[tds.length - 1]).children[0].textContent).toBe('30')
        });
        it(' December  month element test case', () => {
            Cal = new Calendar({ min: new Date('12/2/2016'), max: new Date('12/31/2016') });
            Cal.appendTo('#calendar');
            let tds: any = document.querySelectorAll('.e-cell:not(.e-disabled)');
            expect(document.querySelectorAll('.e-cell:not(.e-disabled)')[0].children[0].textContent).toBe('2')
            expect((document.querySelectorAll('.e-cell:not(.e-disabled)')[tds.length - 1]).children[0].textContent).toBe('31')
        });

        it(' Feb month element without leap year test case', () => {
            Cal = new Calendar({ min: new Date('2/2/2018'), max: new Date('2/28/2018') });
            Cal.appendTo('#calendar');
            let tds: any = document.querySelectorAll('.e-cell:not(.e-disabled)');
            expect(document.querySelectorAll('.e-cell:not(.e-disabled)')[0].children[0].textContent).toBe('2')
            expect((document.querySelectorAll('.e-cell:not(.e-disabled)')[tds.length - 1]).children[0].textContent).toBe('28')
        });
        it(' Feb month element without leap year test case', () => {
            Cal = new Calendar({ min: new Date('2/2/2018'), max: new Date('2/28/2018') });
            Cal.appendTo('#calendar');
            let tds: any = document.querySelectorAll('.e-cell:not(.e-disabled)');
            expect(document.querySelectorAll('.e-cell:not(.e-disabled)')[0].children[0].textContent).toBe('2')
            expect((document.querySelectorAll('.e-cell:not(.e-disabled)')[tds.length - 1]).children[0].textContent).toBe('28')
        });

        it('Weeknumber with e-month-hide  class test case', () => {
            Cal = new Calendar({ value: new Date('10/2/2017'), weekNumber: true });
            Cal.appendTo('#calendar');
            expect(Cal.tableBodyElement.firstElementChild.classList.contains('e-month-hide')).toBe(true);
        });
        it('e-month-hide  class test case', () => {
            Cal = new Calendar({ value: new Date('10/2/2017') });
            Cal.appendTo('#calendar');
            expect(Cal.tableBodyElement.firstElementChild.classList.contains('e-month-hide')).toBe(true);
        });
    });
    describe('DOM ', () => {
        let Cal: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'calendar' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (Cal) {
                Cal.destroy();
                document.body.innerHTML = '';
            }
        });
        it(' root class testing', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(document.getElementById('calendar').classList.contains('e-calendar')).toBe(true);
        });
        it(' child element count testing ', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(document.getElementById('calendar').children.length).toBe(3);
        });
        it(' header element class testing ', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(Cal.headerElement.classList.contains('e-header')).toBe(true);
        });
        it(' content element class testing ', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(Cal.contentElement.classList.contains('e-content')).toBe(true);
        });
        it(' header inner element count testing', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(Cal.headerElement.children.length).toBe(2);
        });
        it(' header element title class  testing', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(Cal.headerTitleElement.classList.contains('e-title')).toBe(true);
        });
        it(' header element icon-container class  testing', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(Cal.headerTitleElement.classList.contains('e-title')).toBe(true);
        });
        it(' header element previous icon class testing', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(Cal.previousIcon.classList.contains('e-prev')).toBe(true);
        });
        it(' header element next icon class testing', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(Cal.nextIcon.classList.contains('e-next')).toBe(true);
        });
        it(' header element previous span element testing ', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(Cal.nextIcon.children[0].nodeName).toBe('SPAN');
        });
        it(' header element icon container class testing ', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(document.getElementById('calendar').querySelector('.e-header .e-icon-container .e-prev .e-date-icon-prev').classList.contains('e-date-icon-prev'))
                .toBe(true);
        });
        it(' header next span element  testing ', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(document.getElementById('calendar').querySelector('.e-header .e-icon-container').classList.contains('e-icon-container')).toBe(true);
        });
        it(' header  span element e-date-icon-next class testing ', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(document.getElementById('calendar').querySelector('.e-header .e-icon-container .e-next .e-date-icon-next').classList.contains('e-date-icon-next')
            ).toBe(true);
        });
        it(' week-header element  testing ', () => {
            Cal = new Calendar({ value: new Date('4/4/2017') });
            Cal.appendTo('#calendar');
            expect(document.getElementById('calendar').getElementsByTagName('tr')[0].firstChild.textContent).toBe('Su');
        });
        it(' tr element count  testing ', () => {
            Cal = new Calendar({ value: new Date('5/5/2017') });
            Cal.appendTo('#calendar');
            expect(document.getElementById('calendar').getElementsByTagName('tr').length).toBe(7);
        });
        it(' tr element count testing ', () => {
            Cal = new Calendar({ value: new Date('4/4/2017') });
            Cal.appendTo('#calendar');
            expect(document.querySelectorAll('.e-content tr td').length).toBe(42);
        });
        it(' tr element with week number count testing ', () => {
            Cal = new Calendar({ value: new Date('4/4/2017'), weekNumber: true });
            Cal.appendTo('#calendar');
            expect(document.querySelectorAll('.e-content tr td').length).toBe(48);
        });
        it('calendar table header (td) element count testing ', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(Cal.tableHeadElement.querySelectorAll('th').length).toBe(7);
        });
        it(' calendar table body  (tr) element count testing ', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(Cal.tableBodyElement.childElementCount).toBe(6);
        });
        it(' calendar table body  (td) element count testing ', () => {
            Cal = new Calendar({});
            Cal.appendTo('#calendar');
            expect(Cal.tableBodyElement.querySelectorAll('tr td').length).toBe(42);
        });
        it('year view (tr) element count  test case', () => {
            Cal = new Calendar({ start: "Year" });
            Cal.appendTo('#calendar');
            expect(Cal.tableBodyElement.querySelectorAll('tr td').length).toBe(12);
        });
        it('year view textContent test case', () => {
            Cal = new Calendar({ start: "Year" });
            Cal.appendTo('#calendar');
            expect(Cal.tableBodyElement.querySelector('tr td span').textContent).toBe('Jan');
        });
        it('decade view (tr) element count test case', () => {
            Cal = new Calendar({ start: "Decade" });
            Cal.appendTo('#calendar');
            expect(Cal.tableBodyElement.querySelectorAll('tr td').length).toBe(12);
        });
        it('decade view textContent test case', () => {
            Cal = new Calendar({ start: "Decade", value: new Date('1/1/2017') });
            Cal.appendTo('#calendar');
            expect(Cal.tableBodyElement.querySelector('tr td span').textContent).toBe('2009');
        });
        it('calender table header week element  count testing ', () => {
            Cal = new Calendar({ weekNumber: true });
            Cal.appendTo('#calendar');
            expect(Cal.tableHeadElement.querySelectorAll('th').length).toBe(8);
        });
        it(' calendar table body (td) with week number element count testing ', () => {
            Cal = new Calendar({ weekNumber: true });
            Cal.appendTo('#calendar');
            expect(Cal.tableBodyElement.querySelectorAll('tr td').length).toBe(48);
        });
        it(' week number element with (tr) count testing ', () => {
            Cal = new Calendar({ weekNumber: true });
            Cal.appendTo('#calendar');
            expect(Cal.tableBodyElement.querySelectorAll('tr').length).toBe(6);
        });
        it(' week number element with (th) count testing ', () => {
            Cal = new Calendar({ weekNumber: true });
            Cal.appendTo('#calendar');
            expect(Cal.tableHeadElement.querySelectorAll('th').length).toBe(8);
        });

        it(' week number  "e-week-number" class test case   ', () => {
            Cal = new Calendar({ weekNumber: true });
            Cal.appendTo('#calendar');
            expect(Cal.tableBodyElement.children[0].children[0].classList.contains('e-week-number')).toBe(true);
        });
        it('calendar  start week number test case   ', () => {
            Cal = new Calendar({ weekNumber: true, value: new Date('2/2/2015') });
            Cal.appendTo('#calendar');
            expect(Cal.tableBodyElement.querySelectorAll('tr .e-week-number')[0].textContent).toBe('' + Cal.getWeek(new Date('1/29/2017')));
        });
        it('  calendar last month week number test case   ', () => {
            Cal = new Calendar({ weekNumber: true, value: new Date('2/2/2015') });
            Cal.appendTo('#calendar');
            expect(Cal.tableBodyElement.querySelectorAll('tr .e-week-number')[5].textContent).toBe('' + Cal.getWeek(new Date('3/10/2017')));
        });
        it('calendar e-today class test case ', () => {
            Cal = new Calendar({ value: new Date() });
            Cal.appendTo('#calendar');
            expect(document.querySelectorAll('.e-today span')[0].textContent).toBe('' + new Date().getDate());
        });
    });
    describe('Property', () => {
        let calendar: any;
        calendar = undefined;
        let dateNum: number = new Date().setMonth(0);
        let dateMon: number = new Date(dateNum).setDate(1);
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: null,
            stopPropagation: (): void => { /** NO Code */ }
        };
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'calendar' });
            document.body.appendChild(ele);

        });
        afterEach(() => {
            if (calendar) {
                calendar.destroy();
            }
            document.body.innerHTML = '';
        });
        /**
         * navigation test case 
         */
        it('  selected date with previous and next icon navigation test case in month view ', () => {
            calendar = new Calendar({ value: new Date() });
            calendar.appendTo('#calendar');
            (<HTMLElement>document.getElementsByClassName('e-date-icon-next')[0]).click();
            (<HTMLElement>document.getElementsByClassName('e-date-icon-prev')[0]).click();
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toDateString()).toBe(new Date().toDateString())
            expect(calendar.value.toDateString()).toBe((new Date().toDateString()));
        });
        it(' selected date with previous and next icon navigation test case in year view ', () => {
            calendar = new Calendar({ start: 'Year', depth: 'Year', value: new Date() });
            calendar.appendTo('#calendar');
            (<HTMLElement>document.getElementsByClassName('e-date-icon-next')[0]).click();
            (<HTMLElement>document.getElementsByClassName('e-date-icon-prev')[0]).click();
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toDateString()).toBe(new Date(new Date().setDate(1)).toDateString())
            expect(calendar.value.toDateString()).toBe((new Date().toDateString()));
        });
        it('  selected date with previous and next icon navigation test case in decade view ', () => {
            calendar = new Calendar({ start: 'Decade', depth: 'Decade', value: new Date() });
            calendar.appendTo('#calendar');
            (<HTMLElement>document.getElementsByClassName('e-date-icon-next')[0]).click();
            (<HTMLElement>document.getElementsByClassName('e-date-icon-prev')[0]).click();
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toDateString()).toBe(new Date(dateMon).toDateString());
            expect(calendar.value.toDateString()).toBe((new Date().toDateString()));
        });
        it('selected date with title navigation test case', () => {
            calendar = new Calendar({ value: new Date() });
            calendar.appendTo('#calendar');
            (<HTMLElement>document.getElementsByClassName('e-date-icon-next')[0]).click();
            (<HTMLElement>document.getElementsByClassName('e-date-icon-prev')[0]).click();
            (<HTMLElement>document.getElementsByClassName('e-title')[0]).click();
            (<HTMLElement>document.getElementsByClassName('e-date-icon-next')[0]).click();
            (<HTMLElement>document.getElementsByClassName('e-date-icon-prev')[0]).click();
            calendar.navigateTo('Month', new Date());
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toDateString()).toBe(new Date().toDateString())
            expect(calendar.value.toDateString()).toBe((new Date().toDateString()));
        });
        it(' selected date with previous, next and title navigation  test case ', () => {
            calendar = new Calendar({ value: new Date() });
            calendar.appendTo('#calendar');
            (<HTMLElement>document.getElementsByClassName('e-date-icon-next')[0]).click();
            (<HTMLElement>document.getElementsByClassName('e-date-icon-prev')[0]).click();
            (<HTMLElement>document.getElementsByClassName('e-title')[0]).click();
            (<HTMLElement>document.getElementsByClassName('e-date-icon-next')[0]).click();
            (<HTMLElement>document.getElementsByClassName('e-date-icon-prev')[0]).click();
            calendar.navigateTo('Year', new Date());
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toDateString()).toBe(new Date(new Date().setDate(1)).toDateString());
            expect(calendar.value.toDateString()).toBe((new Date().toDateString()));
        });
        it(' selected date with previous and next navigation test case ', () => {
            calendar = new Calendar({ value: new Date() });
            calendar.appendTo('#calendar');
            (<HTMLElement>document.getElementsByClassName('e-date-icon-next')[0]).click();
            (<HTMLElement>document.getElementsByClassName('e-date-icon-next')[0]).click();
            (<HTMLElement>document.getElementsByClassName('e-date-icon-prev')[0]).click();
            (<HTMLElement>document.getElementsByClassName('e-date-icon-prev')[0]).click();
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toDateString()).toBe(new Date().toDateString());
            expect(calendar.value.toDateString()).toBe((new Date().toDateString()));
        });
        /**
         * value test case 
         */
        it(' value test  case', () => {
            calendar = new Calendar({ value: new Date() });
            calendar.appendTo('#calendar');
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toDateString()).toBe(new Date().toDateString())
            expect(calendar.value.toDateString()).toBe((new Date().toDateString()));
        });
        it(' value with null type test  case', () => {
            calendar = new Calendar({ value: null });
            calendar.appendTo('#calendar');
            expect((calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(null);
            expect(calendar.value).toBe(null);
        });
        it(' value with undefined  type test  case', () => {
            calendar = new Calendar({ value: undefined });
            calendar.appendTo('#calendar');
            expect((calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(null);
            expect(calendar.value).toBe(null);
        });
        // Date Parser issue
        it(' value with out of min range  test  case', () => {
            calendar = new Calendar({ value: new Date('2/2/1111') });
            calendar.appendTo('#calendar');
            expect((getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toBe(new Date(1900, 0, 1).valueOf());
            expect(calendar.value.valueOf()).toBe(new Date(1900, 0, 1).valueOf());
            expect(calendar.min.valueOf()).toBe(new Date(1900, 0, 1).valueOf());
        });
        it(' value with out of max range  test  case', () => {
            calendar = new Calendar({ value: new Date('2/2/9999') });
            calendar.appendTo('#calendar');
            expect((getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toBe(new Date(2099, 11, 31).valueOf());
            expect(calendar.value.valueOf()).toBe(new Date(2099, 11, 31).valueOf());
        });
        it(' value test case', () => {
            calendar = new Calendar({ value: new Date('2/2/2017') });
            calendar.appendTo('#calendar');
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('2/2/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(dateObjToNum(new Date('2/2/2017')));
        });
        it(' value with date not in a month test case', () => {
            calendar = new Calendar({ value: new Date('31/9/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.value).toBe(null);
        });
        it(' value with invalid test case', () => {
            calendar = new Calendar({ value: new Date('rtytr') });
            calendar.appendTo('#calendar');
            expect(calendar.value).toBe(null);
        });
        it('value with min setmodel test case  ', () => {
            calendar = new Calendar({});
            calendar.appendTo('#calendar');
            calendar.value = new Date('3/3/2017');
            calendar.dataBind();
            expect(calendar.value.valueOf()).toBe(dateObjToNum(new Date('3/3/2017')));
            calendar.min = new Date('3/4/2017');
            calendar.dataBind();
            expect((calendar.min).valueOf()).toBe(dateObjToNum(new Date('3/4/2017')));
            expect(calendar.value.valueOf()).toBe(dateObjToNum(new Date('3/4/2017')));
            expect(getIdValue((calendar.tableBodyElement.querySelector('tr td.e-selected')))).toBe(dateObjToNum(new Date('3/4/2017')));
        });
        it('value with max setmodel test case  ', () => {
            calendar = new Calendar({});
            calendar.appendTo('#calendar');
            calendar.value = new Date('3/3/2017');
            calendar.dataBind();
            expect(calendar.value.valueOf()).toBe(dateObjToNum(new Date('3/3/2017')));
            calendar.max = new Date('3/2/2017');
            calendar.dataBind();
            expect(calendar.max.valueOf()).toBe(dateObjToNum(new Date('3/2/2017')));
            expect(calendar.value.valueOf()).toBe(new Date('3/2/2017').valueOf());
            expect((getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toBe(new Date('3/2/2017').valueOf());
        });
        it(' value with null type test case', () => {
            calendar = new Calendar({});
            calendar.appendTo('#calendar');
            expect(calendar.tableBodyElement.querySelector('tr td.e-selected')).toBe(null);
            expect(calendar.value).toBe(null);
        });
        /**
         * min and max test case
         */
        it('min and max  with undefined type test case', () => {
            calendar = new Calendar({
                min: undefined,
                max: undefined
            });
            calendar.appendTo('#calendar');
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(!calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.min.valueOf()).toBe(new Date(1900, 0, 1).valueOf());
            expect(calendar.max.valueOf()).toBe(new Date(2099, 11, 31).valueOf());
        });
        it('min and max  with null type test case', () => {
            calendar = new Calendar({
                min: null,
                max: null
            });
            calendar.appendTo('#calendar');
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(!calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.min.valueOf()).toBe(new Date(1900, 0, 1).valueOf());
            expect(calendar.max.valueOf()).toBe(new Date(2099, 11, 31).valueOf());
        });
        it('min test case', () => {
            calendar = new Calendar({
                min: new Date('2/2/2017')
            });
            calendar.appendTo('#calendar');
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(!calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.min.valueOf()).toBe(new Date('2/2/2017').valueOf());
            expect(calendar.max.valueOf()).toBe(new Date(2099, 11, 31).valueOf());
        });
        it('max test case', () => {
            calendar = new Calendar({
                max: new Date('2/2/2017')
            });
            calendar.appendTo('#calendar');
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.min.valueOf()).toBe(new Date(1900, 0, 1).valueOf());
            expect(calendar.max.valueOf()).toBe(new Date('2/2/2017').valueOf());
        });
        it(' min & max with setmodel test case', () => {
            calendar = new Calendar({
            });
            calendar.appendTo('#calendar');
            expect(calendar.min.valueOf()).toBe(new Date(1900, 0, 1).valueOf());
            expect(calendar.max.valueOf()).toBe(new Date(2099, 11, 31).valueOf());
            calendar.min = new Date('2/2/2017');
            calendar.dataBind();
            calendar.max = new Date('3/2/2017');
            calendar.dataBind();
            expect(calendar.min.valueOf()).toBe(new Date('2/2/2017').valueOf());
            expect(calendar.max.valueOf()).toBe(new Date('3/2/2017').valueOf());
        });
        it(' min & max with value  setmodel test case', () => {
            calendar = new Calendar({
            });
            calendar.appendTo('#calendar');
            calendar.value = new Date('2/2/2017');
            calendar.dataBind();
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('2/2/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('2/2/2017').valueOf());
            expect(calendar.min.valueOf()).toBe(new Date(1900, 0, 1).valueOf());
            expect(calendar.max.valueOf()).toBe(new Date(2099, 11, 31).valueOf());
            calendar.min = new Date('2/2/2017');
            calendar.dataBind();
            calendar.max = new Date('3/2/2017');
            calendar.dataBind();
            expect(calendar.min.valueOf()).toBe(new Date('2/2/2017').valueOf());
            expect(calendar.max.valueOf()).toBe(new Date('3/2/2017').valueOf());
            calendar.value = new Date('6/2/2017');
            calendar.dataBind();
            expect(calendar.value.valueOf()).toBe(new Date('3/2/2017').valueOf());
            calendar.value = new Date('3/1/2017');
            calendar.dataBind();
            expect(calendar.value.valueOf()).toBe(new Date('3/1/2017').valueOf());
        });

        it(' value with year view  test case', () => {
            calendar = new Calendar({ start: "Decade", depth: "Year", value: new Date('1/1/2017') });
            calendar.appendTo('#calendar');
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('1/1/2017').valueOf());
            expect(calendar.value.toDateString()).toBe('Sun Jan 01 2017');
            expect(calendar.currentView()).toBe('Decade');
            calendar.appendTo('#calendar');
        });
        it(' value with decade  view  test case', () => {
            calendar = new Calendar({ start: "Decade", depth: "Decade", value: new Date('1/1/2018') });
            calendar.appendTo('#calendar');
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('1/1/2018').valueOf());
            expect(calendar.value.toDateString()).toBe('Mon Jan 01 2018');
            expect(calendar.currentView()).toBe('Decade');
            calendar.appendTo('#calendar');
        });


        it(' weekNumber test case', () => {
            calendar = new Calendar({ weekNumber: true });
            calendar.appendTo('#calendar');
            expect(calendar.tableHeadElement.querySelector('th').textContent).toBe('');
        });
        it('  month view  test case', () => {
            calendar = new Calendar({ start: "Month" });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-month')).toBe(true);
        });
        it('start property test case', () => {
            calendar = new Calendar({});
            calendar.appendTo('#calendar');
            calendar.start = 'Year';
            calendar.dataBind();
            expect(calendar.contentElement.classList.contains('e-year')).toBe(true);
            expect(calendar.currentView()).toBe('Year');
            calendar.start = 'Month';
            calendar.dataBind();
            expect(calendar.contentElement.classList.contains('e-month')).toBe(true);
            expect(calendar.currentView()).toBe('Month');
        });
        it('year view  test case', () => {
            calendar = new Calendar({ start: "Year" });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-year')).toBe(true);
        });
        it('decade view  test case', () => {
            calendar = new Calendar({ start: "Decade" });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-decade')).toBe(true);
        });
        it('  month view  test case', () => {
            calendar = new Calendar({ start: "Month" });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-month')).toBe(true);
        });
        it('year view  test case', () => {
            calendar = new Calendar({ start: "Year" });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-year')).toBe(true);
        });

        it(' calendar initial start view with value property test case', () => {
            calendar = new Calendar({ value: new Date('2/2/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.headerTitleElement.textContent).toBe('February 2017');
        });
        it(' calendar initial start view with value property in string title test case', () => {
            calendar = new Calendar();
            calendar.appendTo('#calendar');
            calendar.value = '5/5/2017';
            calendar.dataBind();
            expect((calendar.value).toDateString()).toBe('Fri May 05 2017');
        });
        it(' calendar initial start view with value property in string test case', () => {
            calendar = new Calendar();
            calendar.appendTo('#calendar');
            calendar.value = '5/5/2017';
            calendar.dataBind();
            expect(calendar.headerTitleElement.textContent).toBe('May 2017');
        });
        it(' calendar initial start view with value property in worst case', () => {
            calendar = new Calendar();
            calendar.appendTo('#calendar');
            calendar.value = '5/5/2017';
            calendar.dataBind();
            expect(calendar.value.getMonth()).toEqual(4);
        });
        it(' calendar initial start view with min property in string test case', () => {
            calendar = new Calendar();
            calendar.appendTo('#calendar');
            calendar.min = '5/5/2017';
            calendar.dataBind();
            expect((calendar.min).toDateString()).toBe('Fri May 05 2017');
        });
        it(' calendar initial start view with max property in string test case', () => {
            calendar = new Calendar();
            calendar.appendTo('#calendar');
            calendar.max = '5/5/2017';
            calendar.dataBind();
            expect((calendar.max).toDateString()).toBe('Fri May 05 2017');
        });
        it(' calendar initial start view with min property in string worst test case', () => {
            calendar = new Calendar();
            calendar.appendTo('#calendar');
            calendar.min = '5/5/2017';
            calendar.dataBind();
            expect(calendar.min.getMonth()).toEqual(4);
        });
        it(' calendar initial start view with max property in string worst test case', () => {
            calendar = new Calendar();
            calendar.appendTo('#calendar');
            calendar.max = '5/5/2017';
            calendar.dataBind();
            expect(calendar.max.getMonth()).toEqual(4);
        });
        it(' calendar initial start view with value,min,max property test case', () => {
            calendar = new Calendar({ value: new Date('2/2/2017'), min: new Date('3/3/2017'), max: new Date('4/4/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.headerTitleElement.textContent).toBe('March 2017');
        });
        it('min and max with value property higher that the min test case', () => {
            calendar = new Calendar({
                value: new Date('2/3/2017')
                , min: new Date('2/2/2017'),
                max: new Date('2/2/2017')
            });
            calendar.appendTo('#calendar');
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('2/2/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('2/2/2017').valueOf());
            expect((calendar.max).toDateString()).toBe('Thu Feb 02 2017');
            expect((calendar.min).toDateString()).toBe('Thu Feb 02 2017');
        });
        it('min and max test case', () => {
            calendar = new Calendar({
                min: new Date('1/1/2017'),
                max: new Date('2/2/2017')
            });
            calendar.appendTo('#calendar');
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            calendar.navigateTo('Month', new Date('2/2/2017'));
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect(Date.parse(calendar.min)).toBe(Date.parse('1/1/2017'));
            expect(Date.parse(calendar.max)).toBe(Date.parse('2/2/2017'));
        });
        it('min and max with improper date test case', () => {
            calendar = new Calendar({
                value: new Date('2/2/2017'),
                min: new Date('2/1/2017'),
                max: new Date('1/2/2017')
            });
            calendar.appendTo('#calendar');
            expect(calendar.element.classList.contains('e-overlay')).toBe(true);
            calendar.navigateTo('Month', new Date('2/2/2017'));
            expect(calendar.element.classList.contains('e-overlay')).toBe(true);
            expect((calendar.value).valueOf()).toBe(dateValue('2/2/2017'));
        });
        it('min and max with value test case', () => {
            calendar = new Calendar({
                value: new Date('2/1/2017'),
                min: new Date('1/1/2017'),
                max: new Date('2/2/2017')
            });
            calendar.appendTo('#calendar');
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            calendar.navigateTo('Month', new Date('2/2/2017'));
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('2/1/2017').valueOf());
            expect((calendar.min).valueOf()).toBe(new Date('1/1/2017').valueOf());
            expect((calendar.max).valueOf()).toBe(new Date('2/2/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('2/1/2017').valueOf());
        });
        it('min and max with  invalid value property test case', () => {
            calendar = new Calendar({
                value: new Date('10/1/2017'),
                min: new Date('1/1/2017'),
                max: new Date('2/2/2017')
            });
            calendar.appendTo('#calendar');
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            calendar.navigateTo('Month', new Date('2/2/2017'));
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.tableBodyElement.querySelector('tr td.e-selected').classList.contains('e-selected')).toBe(true);
            expect((calendar.min).valueOf()).toBe(new Date('1/1/2017').valueOf());
            expect((calendar.max).valueOf()).toBe(new Date('2/2/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('2/2/2017').valueOf());
        });
        it('value with invalid min and max date test case', () => {
            calendar = new Calendar({
                value: new Date('10/10/2017'),
                min: new Date('2/1/2017'),
                max: new Date('1/2/2017')
            });
            calendar.appendTo('#calendar');
            expect(calendar.element.classList.contains('e-overlay')).toBe(true);
            calendar.navigateTo('Month', new Date('2/2/2017'));
            expect(calendar.element.classList.contains('e-overlay')).toBe(true);
            calendar.navigateTo('Month', new Date('10/2/2017'));
            expect(calendar.tableBodyElement.querySelector('tr td.e-selected')).toBe(null);
            expect((calendar.min).valueOf()).toBe(new Date('2/1/2017').valueOf());
            expect((calendar.max).valueOf()).toBe(new Date('1/2/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('10/10/2017').valueOf());
        });
        it('value with min test case', () => {
            calendar = new Calendar({
                value: new Date('2/10/2017'),
                min: new Date('2/1/2017'),
            });
            calendar.appendTo('#calendar');
            expect(calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(!calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('2/10/2017').valueOf());
            expect((calendar.min).valueOf()).toBe(new Date('2/1/2017').valueOf());
            expect((calendar.max).valueOf()).toBe(new Date(2099, 11, 31).valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('2/10/2017').valueOf());
        });
        it('value with max test case', () => {
            calendar = new Calendar({
                value: new Date('2/1/2017'),
                max: new Date('2/10/2017'),
            });
            calendar.appendTo('#calendar');
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('2/1/2017').valueOf());
            expect((calendar.min).valueOf()).toBe(new Date(1900, 0, 1).valueOf());
            expect((calendar.max).valueOf()).toBe(new Date('2/10/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('2/1/2017').valueOf());
        });

        it('min with invalid value test case', () => {
            calendar = new Calendar({
                value: new Date('3/10/2016'),
                min: new Date('2/1/2017'),
            });
            calendar.appendTo('#calendar');
            expect(calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(!calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect((calendar.min).valueOf()).toBe(new Date('2/1/2017').valueOf());
            expect((calendar.max).valueOf()).toBe(new Date(2099, 11, 31).valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('2/1/2017').valueOf());
        });
        it('max with invalid value test  case', () => {
            calendar = new Calendar({
                value: new Date('3/10/2017'),
                max: new Date('2/1/2017'),
            });
            calendar.appendTo('#calendar');
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect((calendar.min).valueOf()).toBe(new Date(1900, 0, 1).valueOf());
            expect((calendar.max).valueOf()).toBe(new Date('2/1/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('2/1/2017').valueOf());
        });
        it('max,max and value proerty with same Date test case', () => {
            calendar = new Calendar({
                value: new Date('2/1/2017'),
                max: new Date('2/1/2017'),
                min: new Date('2/1/2017'),
            });
            calendar.appendTo('#calendar');
            expect(calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('2/1/2017').valueOf());
            expect((calendar.min).valueOf()).toBe(new Date('2/1/2017').valueOf());
            expect((calendar.max).valueOf()).toBe(new Date('2/1/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('2/1/2017').valueOf());
        });
        it('max,max , value with year view test  case', () => {
            calendar = new Calendar({
                value: new Date('2/1/2017'),
                max: new Date('2/1/2017'),
                min: new Date('2/1/2017'), start: "Year", depth: "Year"
            });
            calendar.appendTo('#calendar');
            expect(calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('2/1/2017').valueOf());
            expect((calendar.min).valueOf()).toBe(new Date('2/1/2017').valueOf());
            expect((calendar.max).valueOf()).toBe(new Date('2/1/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('2/1/2017').valueOf());
        });
        it('max,max with improper value in year view test  case', () => {
            calendar = new Calendar({
                value: new Date('10/1/2017'),
                max: new Date('2/1/2017'),
                min: new Date('2/1/2017'), start: "Year", depth: "Year"
            });
            calendar.appendTo('#calendar');
            expect(calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            calendar.navigateTo('Month', new Date('10/1/2017'));
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected').valueOf())).toBe(new Date('2/1/2017').valueOf());
            expect((calendar.min).valueOf()).toBe(new Date('2/1/2017').valueOf());
            expect((calendar.max).valueOf()).toBe(new Date('2/1/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('2/1/2017').valueOf());
        });
        it('focused date with value test  case', () => {
            calendar = new Calendar({
                value: new Date('1/1/2017'),
                max: new Date('2/1/2017'),
                min: new Date('1/1/2017')
            });
            calendar.appendTo('#calendar');
            calendar.navigateTo('Month', new Date('2/1/2017'));
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date')))
                .toBe(new Date('2/1/2017').valueOf());
            expect(dateObjToNum((calendar.min))).toBe(new Date('1/1/2017').valueOf());
            expect((dateObjToNum(calendar.max))).toBe(new Date('2/1/2017').valueOf());
            expect(dateObjToNum(calendar.value)).toBe(new Date('1/1/2017').valueOf());
        });
        it('focused date with min and max test  case', () => {
            calendar = new Calendar({
                max: new Date('2/1/2017'),
                min: new Date('1/1/2017')
            });
            calendar.appendTo('#calendar');
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date')))
                .toBe((new Date('2/1/2017')).valueOf());
            expect(dateObjToNum((calendar.min))).toBe(new Date('1/1/2017').valueOf());
            expect((dateObjToNum(calendar.max))).toBe(new Date('2/1/2017').valueOf());
            expect((calendar.value)).toBe(null);
        });
        it('focused date with currentDate test case', () => {
            calendar = new Calendar({
                max: new Date('3/1/2017'),
                min: new Date('1/1/2017')
            });
            calendar.appendTo('#calendar');
            calendar.navigateTo('Month', new Date('2/1/2017'));
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe((new Date('2/1/2017')).valueOf());
            expect(dateObjToNum((calendar.min))).toBe(new Date('1/1/2017').valueOf());
            expect((dateObjToNum(calendar.max))).toBe(new Date('3/1/2017').valueOf());
            expect((calendar.value)).toBe(null);
        });
        it(' min date as focused date case', () => {
            calendar = new Calendar({
                min: new Date('1/30/2017'),
                max: new Date('2/2/2017'),
            });
            calendar.appendTo('#calendar');
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(new Date('2/2/2017').valueOf());
            calendar.navigateTo('Month', new Date('1/1/2017'));
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(new Date('1/30/2017').valueOf());
            expect(dateObjToNum((calendar.min))).toBe(new Date('1/30/2017').valueOf());
            expect((dateObjToNum(calendar.max))).toBe(new Date('2/2/2017').valueOf());
        });
        it('focused date without value test case', () => {
            calendar = new Calendar({
            });
            calendar.appendTo('#calendar');
            expect(new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toLocaleString())
                .toBe((new Date(new Date().setHours(0, 0, 0, 0)).toLocaleString()));
            expect((calendar.value)).toBe(null);
        });
        it('value with navigateTo methods test  case', () => {
            calendar = new Calendar({
                value: new Date('1/1/2017')
            });
            calendar.appendTo('#calendar');
            calendar.navigateTo('Month', new Date('2/2/2017'));
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date')))
                .toBe((new Date('2/2/2017')).valueOf());
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date')))
                .toBe((new Date('2/2/2017')).valueOf());
            expect((calendar.value).valueOf()).toBe(new Date('1/1/2017').valueOf());
        });
        it('destroy method test  case', () => {
            calendar = new Calendar({
                value: new Date('1/1/2017')
            });
            calendar.appendTo('#calendar');
            calendar.destroy();
            calendar.dataBind();
            expect((<any>document.getElementById('calendar')).ej2_instances[0]).toBe(undefined);
            expect(document.getElementById('calendar').classList.length).toBe(0);
        });
        it('value with min test  case', () => {
            calendar = new Calendar({
                value: new Date('1/5/2017'),
                min: new Date('1/10/2017')
            });
            calendar.appendTo('#calendar');
            expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))
                .toBe(null);
            calendar.navigateTo('Month', new Date('2/2/2017'));
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date')))
                .toBe((new Date('2/2/2017')).valueOf());
            expect((calendar.value.valueOf())).toBe(new Date('1/10/2017').valueOf());
        });
        it('focused date as max date test case', () => {
            calendar = new Calendar({
                value: new Date('1/15/2017'),
                max: new Date('2/10/2017')
            });
            calendar.appendTo('#calendar');
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))
                .toBe((new Date('1/15/2017')).valueOf());
            calendar.navigateTo('Month', new Date('2/10/2017'));
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date')))
                .toBe((new Date('2/10/2017')).valueOf());
            expect((calendar.value).valueOf()).toBe(new Date('1/15/2017').valueOf());
        });
        it('focused date as min date test case', () => {
            calendar = new Calendar({
                value: new Date('2/1/2017'),
                max: new Date('3/10/2017')
            });
            calendar.appendTo('#calendar');
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(dateValue('2/1/2017'));
            calendar.navigateTo('Month', new Date('4/10/2017'));
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(dateValue('3/10/2017'));
            expect((calendar.value).valueOf()).toBe(new Date('2/1/2017').valueOf());
        });



        it(' firstDayOfWeek based on the culture "de" test case', () => {
            loadCultureFiles('de', true);
            loadCultureFiles('de');
            calendar = new Calendar({ value: new Date('2/2/2017'), locale: 'de' });
            calendar.appendTo('#calendar');
            expect(calendar.firstDayOfWeek).toBe(1)
            expect(calendar.tableHeadElement.querySelector('th').textContent).toBe('Mo.');
        });

        it(' firstDayOfWeek based on the culture "ar" test case', () => {
            loadCultureFiles('ar', true);
            loadCultureFiles('ar');
            calendar = new Calendar({ value: new Date('2/2/2017'), locale: 'ar' });
            calendar.appendTo('#calendar');
            // ClDR data 
            // expect(calendar.firstDayOfWeek).toBe(6)
            expect(calendar.tableHeadElement.querySelector('th').textContent).toBe('الأحد');
            let instance = calendar.tableBodyElement.querySelectorAll('tr td');
            expect(parseInt(instance[0].id, 0)).toBe(new Date('1/29/2017').valueOf());
        });

        it(' firstDayOfWeek with worst test case', () => {
            calendar = new Calendar({ value: new Date('2/2/2017'), firstDayOfWeek: 8 });
            calendar.appendTo('#calendar');
            expect(calendar.firstDayOfWeek).toBe(0)
            expect(calendar.tableHeadElement.querySelector('th').textContent).toBe('Su');
            let instance = calendar.tableBodyElement.querySelectorAll('tr td');
            expect(parseInt(instance[0].id, 0)).toBe(new Date('1/29/2017').valueOf());
        });

        it(' firstDayOfWeek with 0 test case', () => {
            calendar = new Calendar({ firstDayOfWeek: 0, value: new Date('2/2/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.tableHeadElement.querySelector('th').textContent).toBe('Su');
            let instance = calendar.tableBodyElement.querySelectorAll('tr td');
            expect(parseInt(instance[0].id, 0)).toBe(new Date('1/29/2017').valueOf());
        });
        it(' firstDayOfWeek with 0 test case', () => {
            calendar = new Calendar({ firstDayOfWeek: 0, value: new Date('2/2/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.tableHeadElement.querySelector('th').textContent).toBe('Su');
            let instance = calendar.tableBodyElement.querySelectorAll('tr td');
            expect(parseInt(instance[instance.length - 1].id, 0)).toBe(new Date('3/11/2017').valueOf());
        });
        it(' firstDayOfWeek with value 1 test case', () => {
            calendar = new Calendar({ firstDayOfWeek: 1, value: new Date('2/2/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.tableHeadElement.querySelector('th').textContent).toBe('Mo');
            let instance = calendar.tableBodyElement.querySelectorAll('tr td');
            expect(parseInt(instance[0].id, 0)).toBe(new Date('1/30/2017').valueOf());
            expect(parseInt(instance[instance.length - 1].id, 0)).toBe(new Date('3/12/2017').valueOf());
        });
        it(' firstDayOfWeek with value 3 test case', () => {
            calendar = new Calendar({ firstDayOfWeek: 3, value: new Date('2/2/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.tableHeadElement.querySelector('th').textContent).toBe('We');
            let instance = calendar.tableBodyElement.querySelectorAll('tr td');
            expect(parseInt(instance[0].id, 0)).toBe(new Date('1/25/2017').valueOf());
            expect(parseInt(instance[instance.length - 1].id, 0)).toBe(new Date('3/7/2017').valueOf());
        });
        it(' firstDayOfWeek with value 4 test case', () => {
            calendar = new Calendar({ firstDayOfWeek: 4, value: new Date('2/2/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.tableHeadElement.querySelector('th').textContent).toBe('Th');
            let instance = calendar.tableBodyElement.querySelectorAll('tr td');
            expect(parseInt(instance[0].id, 0)).toBe(new Date('1/26/2017').valueOf());
            expect(parseInt(instance[instance.length - 1].id, 0)).toBe(new Date('3/8/2017').valueOf());
        });
        it(' firstDayOfWeek with value 5  test case', () => {
            calendar = new Calendar({ firstDayOfWeek: 5, value: new Date('2/2/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.tableHeadElement.querySelector('th').textContent).toBe('Fr');
            let instance = calendar.tableBodyElement.querySelectorAll('tr td');
            expect(parseInt(instance[0].id, 0)).toBe(new Date('1/27/2017').valueOf());
            expect(parseInt(instance[instance.length - 1].id, 0)).toBe(new Date('3/9/2017').valueOf());
        });
        it(' firstDayOfWeek with value 6 test case', () => {
            calendar = new Calendar({ firstDayOfWeek: 6, value: new Date('2/2/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.tableHeadElement.querySelector('th').textContent).toBe('Sa');
            let instance = calendar.tableBodyElement.querySelectorAll('tr td');
            expect(parseInt(instance[0].id, 0)).toBe(new Date('1/28/2017').valueOf());
            expect(parseInt(instance[instance.length - 1].id, 0)).toBe(new Date('3/10/2017').valueOf());
        });
        it(' firstDayOfWeek with value 1 test case', () => {
            calendar = new Calendar({ firstDayOfWeek: 1, value: new Date('2/2/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.tableHeadElement.querySelector('th').textContent).toBe('Mo');
            let instance = calendar.tableBodyElement.querySelectorAll('tr td');
            expect(parseInt(instance[0].id, 0)).toBe(new Date('1/30/2017').valueOf());
            expect(parseInt(instance[instance.length - 1].id, 0)).toBe(new Date('3/12/2017').valueOf());
        });
        it(' firstDayOfWeek with value 7 worst test case', () => {
            calendar = new Calendar({ firstDayOfWeek: 7, value: new Date('2/2/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.tableHeadElement.querySelector('th').textContent).toBe('Su');
            let instance = calendar.tableBodyElement.querySelectorAll('tr td');
            expect(parseInt(instance[0].id, 0)).toBe(new Date('1/29/2017').valueOf());
            expect(parseInt(instance[instance.length - 1].id, 0)).toBe(new Date('3/11/2017').valueOf());
        });
        it(' enableRtl with true test case', () => {
            calendar = new Calendar({ enableRtl: true });
            calendar.appendTo('#calendar');
            expect(document.getElementById('calendar').classList.contains('e-rtl')).toEqual(true);
        });
        it(' enableRtl with false test case', () => {
            calendar = new Calendar({ enableRtl: false });
            calendar.appendTo('#calendar');
            expect(document.getElementById('calendar').classList.contains('e-rtl')).toEqual(false);
        });
        /**
         * view test case
         */
        it(' Without value property  in year view test case', function () {
            calendar = new Calendar({ start: "Year", depth: 'Year' });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-year')).toBe(true);
            expect(calendar.currentView()).toBe('Year');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[0].textContent).toBe('Jan');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[11].textContent).toBe('Dec');
        });
        it(' value property  in year view test case', function () {
            let currentDate: Date = new Date();
            calendar = new Calendar({ start: "Year", depth: 'Year', value: new Date() });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-year')).toBe(true);
            expect(calendar.currentView()).toBe('Year');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[0].textContent).toBe('Jan');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[11].textContent).toBe('Dec');
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toDateString()).toBe(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toDateString());
        });
        it('maximum value in year view test case', function () {
            calendar = new Calendar({ start: "Year", depth: 'Year', value: new Date("1/30/2017") });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-year')).toBe(true);
            expect(calendar.currentView()).toBe('Year');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[0].textContent).toBe('Jan');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[11].textContent).toBe('Dec');
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toDateString()).toBe(new Date("1/1/2017").toDateString());
            expect(calendar.value.toDateString()).toBe(new Date("1/30/2017").toDateString());
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            calendar.tableBodyElement.querySelectorAll('tr td')[1].click()
            expect(calendar.value.toDateString()).toBe(new Date("2/28/2017").toDateString());

        });
        it(' min, max and value in year view test case', function () {
            calendar = new Calendar({
                start: "Year", depth: 'Year', value: new Date('5/5/2017'),
                min: new Date('5/1/2017'), max: new Date('5/10/2017')
            });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-year')).toBe(true);
            expect(calendar.currentView()).toBe('Year');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[0].textContent).toBe('Jan');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[11].textContent).toBe('Dec');
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).
                toDateString()).toBe(new Date("5/1/2017").toDateString());
            expect(calendar.value.toDateString()).toBe(new Date("5/5/2017").toDateString());
        });
        it('min, max property with value minimum than min in year view test case', function () {
            let currentDate: Date = new Date();
            calendar = new Calendar({
                start: "Year", depth: 'Year', value: new Date('5/1/2017'),
                min: new Date('5/3/2017'), max: new Date('5/10/2017')
            });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-year')).toBe(true);
            expect(calendar.currentView()).toBe('Year');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[0].textContent).toBe('Jan');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[11].textContent).toBe('Dec');
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toDateString()).
                toBe(new Date("5/1/2017").toDateString());
            expect(calendar.value.toDateString()).toBe(new Date("5/3/2017").toDateString());
        });

        it(' Without value property  in decade view test case', function () {
            calendar = new Calendar({ start: "Decade", depth: 'Decade', value: new Date('4/4/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-decade')).toBe(true);
            expect(calendar.currentView()).toBe('Decade');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[0].textContent).toBe('2009');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[11].textContent).toBe('2020');
        });
        it(' value property  in decade view test case', function () {
            let currentDate: Date = new Date();
            calendar = new Calendar({ start: "Decade", depth: 'Decade', value: new Date('3/3/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-decade')).toBe(true);
            expect(calendar.currentView()).toBe('Decade');
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toDateString()).
                toBe(new Date('1/1/2017').toDateString());
            expect(calendar.value.toDateString()).toBe(new Date("3/3/2017").toDateString());
        });
        it('maximum value in decade view test case', function () {
            calendar = new Calendar({ start: "Decade", depth: 'Decade', value: new Date("1/30/2017") });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-decade')).toBe(true);
            expect(calendar.currentView()).toBe('Decade');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[0].textContent).toBe('2009');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[11].textContent).toBe('2020');
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toDateString()).toBe(new Date("1/1/2017").toDateString());
            expect(calendar.value.toDateString()).toBe(new Date("1/30/2017").toDateString());
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            calendar.tableBodyElement.querySelectorAll('tr td')[1].click();
            expect(calendar.value.toDateString()).toBe(new Date("1/30/2010").toDateString());
        });
        it(' min, max and value in year decade test case', function () {
            calendar = new Calendar({
                start: "Decade", depth: 'Decade', value: new Date('5/5/2017'),
                min: new Date('5/1/2017'), max: new Date('5/10/2017')
            });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-decade')).toBe(true);
            expect(calendar.currentView()).toBe('Decade');
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).
                toDateString()).toBe(new Date("1/1/2017").toDateString());
            expect(calendar.value.toDateString()).toBe(new Date("5/5/2017").toDateString());
        });
        it('min, max property with value minimum than min in decade view test case', function () {
            let currentDate: Date = new Date();
            calendar = new Calendar({
                start: "Decade", depth: 'Decade', value: new Date('5/1/2017'),
                min: new Date('5/3/2017'), max: new Date('5/10/2017')
            });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-decade')).toBe(true);
            expect(calendar.currentView()).toBe('Decade');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[0].textContent).toBe('2009');
            expect(document.getElementById('calendar').querySelectorAll('tr td span')[11].textContent).toBe('2020');
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toDateString()).
                toBe(new Date("1/1/2017").toDateString());
            expect(calendar.value.toDateString()).toBe(new Date("5/3/2017").toDateString());
        });

        /**
         * start and depth test case 
         */
        it(' start with  "Month" test case', function () {
            calendar = new Calendar({ start: "Month", value: new Date('3/3/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-month')).toBe(true);
            expect(document.querySelector('.e-title').textContent).toBe('March 2017');
            expect(calendar.currentView()).toBe('Month');
        });
        it(' start with  "Year" test case', function () {
            calendar = new Calendar({ start: "Year", value: new Date('3/3/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-year')).toBe(true);
            expect(document.querySelector('.e-title').textContent).toBe('2017');
            expect(calendar.currentView()).toBe('Year');
        });
        it(' start with  "Decade" test case', function () {
            calendar = new Calendar({ start: "Decade", value: new Date('3/3/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-decade')).toBe(true);
            expect(document.querySelector('.e-title').textContent).toBe('2010 - 2019');
            expect(calendar.currentView()).toBe('Decade');
        });
        it(' start value higher than decade test case', function () {
            calendar = new Calendar({ start: "Decade", depth: 'Year', value: new Date('3/3/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-decade')).toBe(true);
            expect(document.querySelector('.e-title').textContent).toBe('2010 - 2019');
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            (<HTMLElement>document.querySelectorAll('.e-content td')[3]).click();
            expect(calendar.currentView()).toBe('Year');
            (<HTMLElement>document.querySelectorAll('.e-content td')[4]).click();
            expect(calendar.currentView()).toBe('Year');
        });
        it(' start value higher than decade value test case', function () {
            calendar = new Calendar({ start: "Year", depth: 'Month', value: new Date('3/3/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-year')).toBe(true);
            expect(document.querySelector('.e-title').textContent).toBe('2017');
            mouseEventArgs.currentTarget = calendar.tableBodyElement.querySelectorAll('tr td')[1];
            calendar.clickHandler(mouseEventArgs);
            expect(calendar.currentView()).toBe('Month');
        });
        it(' start , depth  same value test case', function () {
            calendar = new Calendar({ start: "Year", depth: "Year", value: new Date('3/3/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-year')).toBe(true);
            mouseEventArgs.currentTarget = calendar.tableBodyElement.querySelectorAll('tr td')[1];
            calendar.clickHandler(mouseEventArgs);
            expect(document.querySelector('.e-title').textContent).toBe('2017');
        });
        it(' start , depth with invalid value test case', function () {
            calendar = new Calendar({ start: "Year", depth: "Decade", value: new Date('3/3/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.contentElement.classList.contains('e-year')).toBe(true);
            mouseEventArgs.currentTarget = calendar.tableBodyElement.querySelectorAll('tr td')[1];
            calendar.clickHandler(mouseEventArgs);
            expect(document.querySelector('.e-title').textContent).toBe('February 2017');
        });
        it('enablePersistence with false test case', () => {
            calendar = new Calendar({ enablePersistence: false, value: new Date() });
            calendar.appendTo('#calendar');
            expect(calendar.value.toDateString()).toBe(new Date().toDateString());
        });

        it('enablePersistence with true test case', () => {
            calendar = new Calendar({ value: new Date() });
            calendar.appendTo('#calendar');
            expect(calendar.value.toDateString()).toBe(new Date().toDateString());
            calendar.enablePersistence = true;
            calendar.dataBind();
            calendar.destroy();
            calendar = new Calendar({ enablePersistence: true });
            calendar.appendTo('#calendar');
            expect(calendar.value.toDateString()).toBe(new Date().toDateString());
        });
        /**
         * renderDayCell event test case
         */
        it('renderDayCell test case', function () {
            calendar = new Calendar({
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() == 1) {
                        args.isDisabled = true;
                    }
                }, min: new Date('5/5/2017'), max: new Date('8/8/2017'), value: new Date('6/5/2017')
            });
            calendar.appendTo('#calendar');
            calendar.value = new Date('7/5/2017');
        });

        it('enabling the date value of disabled dates in renderDayCell event', function () {
            calendar = new Calendar({
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() == 7) {
                        args.isDisabled = true;
                    }
                }, min: new Date('5/5/2017'), max: new Date('5/8/2017'), value: new Date('6/5/2017')
            });
            calendar.appendTo('#calendar');
            calendar.value = new Date('5/7/2017');
            calendar.dataBind();
            expect(calendar.value).toBe(null);
        });

        it(' renderDayCell event', function () {
            calendar = new Calendar({
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() == 4) {
                        args.isDisabled = false;
                    }
                }, min: new Date('5/5/2017'), max: new Date('5/8/2017'), value: new Date('6/5/2017')
            });
            calendar.appendTo('#calendar');
            calendar.value = new Date('5/4/2017');
            calendar.dataBind();
            expect(calendar.value.toDateString()).toBe('Fri May 05 2017');
        });
        it(' value and disabled date same value renderDayCell event', function () {
            calendar = new Calendar({
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() === 1) {
                        args.isDisabled = true;
                    }
                }, value: new Date('1/1/2017')
            });
            calendar.appendTo('#calendar');
            expect(calendar.value).toBe(null);
        });

        it(' renderDayCell event td element test case', function () {
            calendar = new Calendar({
                renderDayCell: function (args: any): void {
                    renderDayCellEle(args);
                },
                value: new Date('6/5/2017')
            });
            calendar.appendTo('#calendar');
        });

        function renderDayCellEle(args: any): void {
            expect(args.element.nodeName).toBe('TD');
        }


        /**
         * strictMode test case
         */
        it('min and max with value higher during intialization test case', function () {
            calendar = new Calendar({ min: new Date('5/5/2017'), max: new Date('6/6/2017'), value: new Date('7/7/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.min.valueOf()).toBe(new Date('5/5/2017').valueOf());
            expect(calendar.max.valueOf()).toBe(new Date('6/6/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('6/6/2017').valueOf());
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('6/6/2017').valueOf());
        });
        it('min and max with value higher than the min test case', function () {
            calendar = new Calendar({ min: new Date('5/5/2017'), max: new Date('6/6/2017'), value: new Date('1/1/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.min.valueOf()).toBe(new Date('5/5/2017').valueOf());
            expect(calendar.max.valueOf()).toBe(new Date('6/6/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('5/5/2017').valueOf());
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('5/5/2017').valueOf());
        });
        it('value null test case', function () {
            calendar = new Calendar({ min: new Date('5/5/2017'), max: new Date('6/6/2017'), value: null });
            calendar.appendTo('#calendar');
            expect(calendar.min.valueOf()).toBe(new Date('5/5/2017').valueOf());
            expect(calendar.max.valueOf()).toBe(new Date('6/6/2017').valueOf());
            expect(calendar.value).toBe(null);
            expect(calendar.tableBodyElement.querySelector('tr td.e-selected')).toBe(null);
        });
        it('value with invalid date test case', function () {
            calendar = new Calendar({ min: new Date('5/5/2017'), max: new Date('6/6/2017'), value: new Date('sdfsd') });
            calendar.appendTo('#calendar');
            expect(calendar.min.valueOf()).toBe(new Date('5/5/2017').valueOf());
            expect(calendar.max.valueOf()).toBe(new Date('6/6/2017').valueOf());
            expect(calendar.value).toBe(null);
            expect(calendar.tableBodyElement.querySelector('tr td.e-selected')).toBe(null);
        });
        it('value with invalid min and max contradiction date test case', function () {
            calendar = new Calendar({ min: new Date('6/6/2017'), max: new Date('5/5/2017'), value: new Date('3/7/2017') });
            calendar.appendTo('#calendar');
            expect(calendar.min.valueOf()).toBe(new Date('6/6/2017').valueOf());
            expect(calendar.max.valueOf()).toBe(new Date('5/5/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('3/7/2017').valueOf());
            expect(calendar.tableBodyElement.querySelector('tr td.e-selected')).toBe(null);
        });
        it('enableRtl test case', function () {
            calendar = new Calendar({ enableRtl: true });
            calendar.appendTo('#calendar');
            expect(calendar.enableRtl).toBe(true);
        });
    });
    describe(' notify property changes of', () => {
        let calendar: any;
        calendar = undefined;
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'calendar' });
            document.body.appendChild(ele);
        });
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: null,
            stopPropagation: (): void => { /** NO Code */ }
        };
        afterEach(() => {
            if (calendar) {
                calendar.destroy();
            }
            document.body.innerHTML = '';
        });
        it(' value test case', () => {
            calendar = new Calendar({
                value: new Date('1/10/2017'),
                min: new Date('1/1/2017'),
                max: new Date('2/2/2017')
            });
            calendar.appendTo('#calendar');
            expect(calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(!calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            calendar.navigateTo('Month', new Date('2/2/2017'));
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            calendar.navigateTo('Month', new Date('1/10/2017'));
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('1/10/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('1/10/2017').valueOf());
            calendar.value = new Date('1/12/2017');
            calendar.dataBind();
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('1/12/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('1/12/2017').valueOf());
            calendar.value = new Date('4/11/2017');
            calendar.dataBind();
            expect(calendar.tableBodyElement.querySelector('tr td.e-selected').classList.contains('e-selected')).toBe(true);
            expect(calendar.value.valueOf()).toBe(new Date('2/2/2017').valueOf());
        });
        it(' value test case', () => {
            calendar = new Calendar({
                value: new Date('1/10/2017'),
                min: new Date('1/1/2017'),
                max: new Date('2/2/2017')
            });
            calendar.appendTo('#calendar');
            calendar.value = new Date('xcvcxb');
            calendar.dataBind();
            expect(calendar.value.valueOf()).toBe(new Date('1/10/2017').valueOf());
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('1/10/2017').valueOf());
        });
        it(' min test case', () => {
            calendar = new Calendar({
                min: new Date('1/1/2017')
            });
            calendar.appendTo('#calendar');
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(!calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.value).toBe(null);
            expect(calendar.min.valueOf()).toBe(new Date('1/1/2017').valueOf());
            expect(calendar.max.valueOf()).toBe(new Date(2099, 11, 31).valueOf());
            calendar.min = new Date('2/12/2017');
            calendar.dataBind();
            expect(calendar.value).toBe(null);
            calendar.value = new Date('3/1/2017');
            calendar.dataBind();
        });
        it(' min  and max test case', () => {
            calendar = new Calendar({
                min: new Date('1/1/2017'),
                max: new Date('2/2/2017'), value: new Date('2/1/2017')
            });
            calendar.appendTo('#calendar');
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.nextIcon.classList.contains('e-disabled')).toBe(true);
            expect(calendar.value.valueOf()).toBe(new Date('2/1/2017').valueOf());
            expect((calendar.min).valueOf()).toBe(new Date('1/1/2017').valueOf());
            expect((calendar.max).valueOf()).toBe(new Date('2/2/2017').valueOf());
            mouseEventArgs.currentTarget = calendar.tableBodyElement.querySelectorAll('tr td')[8];
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(new Date('2/1/2017').valueOf());
            expect(calendar.value.valueOf()).toBe(new Date('2/1/2017').valueOf());
        });
        it(' value test case', () => {
            calendar = new Calendar({
                value: new Date('1/1/2017'),
            });
            calendar.appendTo('#calendar');
            expect(!calendar.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(!calendar.nextIcon.children[0].classList.contains('e-disabled')).toBe(true);
            expect(calendar.value.valueOf()).toBe(new Date('1/1/2017').valueOf());
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected'))).toBe(dateValue('1/1/2017'));
            mouseEventArgs.target = calendar.previousIcon;
            calendar.navigatePrevious(mouseEventArgs);
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(new Date('12/1/2016').valueOf());
            mouseEventArgs.target = calendar.previousIcon;
            calendar.navigatePrevious(mouseEventArgs);
        });
        it('min date as focused date ', () => {
            calendar = new Calendar({
                max: new Date('3/3/2017')
            });
            calendar.appendTo('#calendar');
            expect(calendar.value).toBe(null);
            mouseEventArgs.target = calendar.previousIcon;
            calendar.navigatePrevious(mouseEventArgs);
            expect(new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).getDate())
                .toBe(new Date('3/3/2017').getDate());
            mouseEventArgs.target = calendar.previousIcon;
            calendar.navigatePrevious(mouseEventArgs);
        });
        it('focused date on previous icon click ', () => {
            calendar = new Calendar({
                value: new Date('2/2/2017')
            });
            calendar.appendTo('#calendar');
            calendar.min = new Date('1/29/2017');
            calendar.dataBind();
            mouseEventArgs.target = calendar.previousIcon;
            calendar.navigatePrevious(mouseEventArgs);
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(dateValue('1/29/2017'));
        });

        it(' week weekNumber test case', () => {
            calendar = new Calendar({
                value: new Date('3/3/2017')
            });
            calendar.appendTo('#calendar');
            calendar.weekNumber = true;
            calendar.dataBind();
            expect(calendar.tableBodyElement.querySelectorAll('tr td').length).toBe(48);
            expect(calendar.tableHeadElement.querySelectorAll('th').length).toBe(8);
            expect(calendar.tableBodyElement.querySelector('tr td.e-week-number').textContent).toBe('9');
            calendar.appendTo('#calendar');
            calendar.weekNumber = false;
            calendar.dataBind();
            expect(calendar.tableBodyElement.querySelectorAll('tr td').length).toBe(42);
            expect(calendar.tableHeadElement.querySelectorAll('th').length).toBe(7);
            expect(calendar.tableHeadElement.querySelectorAll('th.e-week-number').length).toBe(0);
            expect(!calendar.tableHeadElement.querySelectorAll('th.e-week-number')).toBe(false);
        });
        it(' start and depth test case', () => {
            calendar = new Calendar({
                value: new Date('3/3/2017')
            });
            calendar.appendTo('#calendar');
            calendar.start = 'Month';
            expect(calendar.currentView()).toBe('Month');
            expect(document.querySelector('.e-title').textContent).toBe('March 2017');
            calendar.dataBind();
            calendar.start = 'Year';
            calendar.dataBind();
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            (<HTMLElement>document.querySelectorAll('.e-content td')[8]).click();
            expect(document.querySelector('.e-title').textContent).toBe('September 2017');
            expect(calendar.currentView()).toBe('Month');
            expect(calendar.contentElement.classList.contains('e-month')).toBe(true);
        });
        it('enableRtl  test case', () => {
            calendar = new Calendar({
            });
            calendar.appendTo('#calendar');
            calendar.enableRtl = true;
            calendar.dataBind();
            expect(document.getElementById('calendar').classList.contains('e-rtl')).toEqual(true);
            calendar.enableRtl = false;
            calendar.dataBind();
            expect(!document.getElementById('calendar').classList.contains('e-rtl')).toEqual(true);
        });
    });
    describe('events', () => {
        let cal: any;
        let calendar: Calendar;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: null,
            stopPropagation: (): void => { /** NO Code */ }
        };
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'calendar' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (calendar) {
                calendar.destroy();
            }
            document.body.innerHTML = '';
        });
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        it('start view with min ,max test case', () => {
            cal = new Calendar({
                max: new Date('2/10/2017'),
                min: new Date('1/10/2017')
            });
            cal.appendTo('#calendar');
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            cal.tableBodyElement.querySelectorAll('tr td')[8].click();
            expect(document.querySelector('.e-title').textContent).toBe('February 2017');
        });
        it('switch view from month to depth test case', () => {
            cal = new Calendar({});
            cal.appendTo('#calendar');
            expect(cal.tableBodyElement.querySelectorAll('tr td').length).toBe(42);
            mouseEventArgs.target = document.querySelector('.e-title');
            cal.navigateTitle(mouseEventArgs);
            expect(cal.currentView()).toBe("Year");
            expect(cal.tableBodyElement.querySelectorAll('tr td').length).toBe(12);
            cal.navigateTitle(mouseEventArgs);
            expect(cal.currentView()).toBe("Decade");
            expect(cal.tableBodyElement.querySelectorAll('tr td').length).toBe(12);
            cal.navigateTitle(mouseEventArgs);
            expect(cal.currentView()).toBe("Decade");
        });
        it('mouse click on title on year view ', () => {
            cal = new Calendar({ value: new Date(), start: "Year" });
            cal.appendTo('#calendar');
            mouseEventArgs.target = document.querySelector('.e-title');
            cal.navigateTitle(mouseEventArgs);
            expect(cal.currentView()).toBe("Decade");
        });

        it('mouse click on title on decade  view ', () => {
            cal = new Calendar({ value: new Date(), start: "Decade" });
            cal.appendTo('#calendar');
            (<HTMLElement>document.querySelector('.e-title')).click();
            cal.navigateTitle(mouseEventArgs);
            expect(cal.currentView()).toBe("Decade");
        });
        it('mouse click on previous icon on month view', () => {
            cal = new Calendar({ value: new Date('2/2/2017'), start: "Month" });
            cal.appendTo('#calendar');
            (<HTMLElement>document.querySelector('.e-prev span')).click();
            expect(document.querySelector('.e-title').textContent).toBe('January 2017');
        });

        it('mouse click on next icon on month view', () => {
            cal = new Calendar({ value: new Date('2/2/2017'), start: "Month" });
            cal.appendTo('#calendar');
            (<HTMLElement>document.querySelector('.e-next span')).click();;
            expect(document.querySelector('.e-title').textContent).toBe('March 2017');
        });
        it('mouse click on previous icon on year view', () => {
            cal = new Calendar({ value: new Date('2/2/2017'), start: "Year" });
            cal.appendTo('#calendar');
            (<HTMLElement>document.querySelector('.e-prev span')).click();;
            expect(document.querySelector('.e-title').textContent).toBe('2016');
        });

        it('mouse click on next icon on year view', () => {
            cal = new Calendar({ value: new Date('2/2/2017'), start: "Year" });
            cal.appendTo('#calendar');
            (<HTMLElement>document.querySelector('.e-next span')).click();;
            expect(document.querySelector('.e-title').textContent).toBe('2018');
        });
        it('mouse click on previous icon on decade view', () => {
            cal = new Calendar({ value: new Date('2/2/2017'), start: "Decade" });
            cal.appendTo('#calendar');
            (<HTMLElement>document.querySelector('.e-prev span')).click();;
            expect(document.querySelector('.e-title').textContent).toBe('2000 - 2009');
        });
        it('mouse click on next icon on decade view', () => {
            cal = new Calendar({ value: new Date('2/2/2017'), start: "Decade" });
            cal.appendTo('#calendar');
            (<HTMLElement>document.querySelector('.e-next span')).click();;
            expect(document.querySelector('.e-title').textContent).toBe('2020 - 2029');
        });

        it(' min and max  with current date  test case ', () => {
            cal = new Calendar({
                min: new Date('3/4/2018'), max: new Date('4/4/2018')
            });
            cal.appendTo('#calendar');
            expect(+cal.value).toBe(0);
            expect(cal.contentElement.classList.contains('e-month')).toBe(true);
            expect(document.querySelector('.e-title').textContent).toBe('April 2018');
            expect(cal.previousIcon.classList.contains('e-disabled')).toBe(false);
            expect(cal.nextIcon.classList.contains('e-disabled')).toBe(true);
            (<HTMLElement>document.querySelector('.e-prev span')).click();
            expect(document.querySelector('.e-title').textContent).toBe('March 2018');
            expect(cal.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(cal.nextIcon.classList.contains('e-disabled')).toBe(false);
        })


        it('mouse click on other months dates of month view ', () => {
            cal = new Calendar({ value: new Date() });
            cal.appendTo('#calendar');
            (<HTMLElement>document.querySelectorAll('.e-content td')[8]).click();
            expect(cal.currentView()).toBe("Month");
        });
        it('mouse click on year view of calendar ', () => {
            cal = new Calendar({ value: new Date('2/2/2017'), start: "Year" });
            cal.appendTo('#calendar');
            (<HTMLElement>document.querySelectorAll('.e-content td')[8]).click();
            expect(cal.currentView()).toBe("Month");
        });
        it('mouse click on decade view of calendar ', () => {
            cal = new Calendar({ value: new Date('2/2/2017'), start: "Decade" });
            cal.appendTo('#calendar');
            (<HTMLElement>document.querySelectorAll('.e-content td')[8]).click();
            expect(cal.currentView()).toBe("Year");
        });

        it('mouse click to select Date on month view ', () => {
            cal = new Calendar({ value: new Date(), start: "Month" });
            cal.appendTo('#calendar');
            (<HTMLElement>document.querySelectorAll('.e-content td')[8]).click();
            expect(cal.currentView()).toBe("Month");
        });
        it('mouse click decade view   ', () => {
            cal = new Calendar({
                value: new Date(), start: "Decade", min: new Date('1/1/2017')
                , max: new Date('3/3/2017')
            });
            cal.appendTo('#calendar');
            (<HTMLElement>document.querySelectorAll('.e-content td')[8]).click();
            expect(cal.currentView()).toBe("Year");
        });
        it('mouse click on  year view   with start and depth property (year view)of calendar', () => {
            cal = new Calendar({
                value: new Date(), start: "Year", depth: "Year"
            });
            cal.appendTo('#calendar');
            (<HTMLElement>document.querySelectorAll('.e-content td')[8]).click();
            expect(cal.currentView()).toBe("Year");
        });

        it('mouse click on  decade view   with start and depth property (decade view)of calendar    ', () => {
            cal = new Calendar({
                value: new Date(), start: "Decade", depth: "Decade"
            });
            cal.appendTo('#calendar');
            (<HTMLElement>document.querySelectorAll('.e-content td')[8]).click();
            expect(cal.currentView()).toBe("Decade");
        });
        it('focused date with next icon click test case   ', () => {
            cal = new Calendar({
                min: new Date('3/29/2017')
            });
            cal.appendTo('#calendar');
            cal.max = new Date('4/28/2017')
            cal.dataBind();
            mouseEventArgs.target = cal.nextIcon;
            cal.navigateNext(mouseEventArgs);
            expect(cal.tableBodyElement.querySelector('tr td.e-focused-date')).toBe(null);
        });
        it('focused date with min and max test case  ', () => {
            cal = new Calendar({
                min: new Date('1/10/2017'),
                max: new Date('2/3/2017'),
            });
            cal.appendTo('#calendar');
            expect(cal.headerTitleElement.textContent).toBe('February 2017');
            expect(getIdValue(cal.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(dateValue('2/3/2017'));
            mouseEventArgs.target = cal.previousIcon;
            cal.navigatePrevious(mouseEventArgs);
            expect(getIdValue(cal.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(dateValue('1/10/2017'));
        });
        it('previous and nextIcon disable state test case ', () => {
            cal = new Calendar({
                max: new Date('2/2/2017'), min: new Date('1/1/2017')
            });
            cal.appendTo('#calendar');
            mouseEventArgs.target = document.querySelector('.e-title');
            expect(!cal.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(cal.nextIcon.classList.contains('e-disabled')).toBe(true);
            cal.navigateTitle(mouseEventArgs);
            expect(cal.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(cal.nextIcon.classList.contains('e-disabled')).toBe(true);
            cal.navigateTitle(mouseEventArgs);
            expect(cal.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(cal.nextIcon.classList.contains('e-disabled')).toBe(true);
            cal.navigateTitle(mouseEventArgs);
            expect(cal.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(cal.nextIcon.classList.contains('e-disabled')).toBe(true);
            cal.min = new Date('3/3/2016');
            cal.dataBind();
            cal.max = new Date('3/3/2017');
            cal.dataBind();
            expect(cal.previousIcon.classList.contains('e-disabled')).toBe(true);
            expect(cal.nextIcon.classList.contains('e-disabled')).toBe(true);
        });
        it('other month element(td) clik  test case ', () => {
            cal = new Calendar({
                value: new Date('3/29/2017'), start: "Year"
            });
            cal.appendTo('#calendar');
            mouseEventArgs.currentTarget = cal.tableBodyElement.querySelectorAll('tr td')[1];
            cal.contentClick(mouseEventArgs, 0, null);
            expect(document.querySelector('.e-title').textContent).toBe('February 2017');
        });
    });
    describe('methods', () => {
        let calendar: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'calendar' });
            document.body.appendChild(ele);
            calendar = new Calendar({});
            calendar.appendTo('#calendar');
        });
        afterEach(() => {
            if (calendar) {
                calendar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('navigateTo minimum date test case', () => {
            calendar.min = new Date('2/2/2017');
            calendar.dataBind();
            calendar.navigateTo('Month', new Date('1/2/2017'));
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(dateValue('2/2/2017'));
            expect(calendar.currentView()).toBe('Month');
        });
        it('navigateTo maximum date test case', () => {
            calendar.max = new Date('5/2/2017');
            calendar.dataBind();
            calendar.navigateTo('Month', new Date('7/2/2017'));
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(dateValue('5/2/2017'));
            expect(calendar.currentView()).toBe('Month');
        });

        it('navigate to year view test case', () => {
            calendar.navigateTo('Year', new Date('2/2/2017'));
            expect(document.querySelector('.e-title').textContent).toBe('2017');
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(new Date('2/1/2017').valueOf());
            expect(calendar.currentView()).toBe('Year');
        });
        it('navigate to decade view test case', () => {
            calendar.navigateTo('Decade', new Date('3/3/2017'));
            expect(document.querySelector('.e-title').textContent).toBe('2010 - 2019');
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(new Date('1/1/2017').valueOf());
            expect(calendar.currentView()).toBe('Decade');
        });
        it('navigate to decade view test case', () => {
            calendar.navigateTo('Decade', new Date('4/4/2017'));
            expect(document.querySelector('.e-title').textContent).toBe('2010 - 2019');
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(new Date('1/1/2017').valueOf());
            expect(calendar.currentView()).toBe('Decade');
        });
        it('navigate to month view test case', () => {
            calendar.navigateTo('Month', new Date('2/2/2017'));
            expect(document.querySelector('.e-title').textContent).toBe('February 2017');
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(new Date('2/2/2017').valueOf());
            expect(calendar.value).toBe(null);
            expect(calendar.currentView()).toBe('Month');
        });
        it('navigate to month  view test case ', () => {
            calendar.navigateTo('Month', new Date('10/2/2017'));
            expect(document.querySelector('.e-title').textContent).toBe('October 2017');
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(new Date('10/2/2017').valueOf());
            expect(calendar.currentView()).toBe('Month');
        });
        it('navigate to year view from month test case ', () => {
            calendar.navigateTo('Year', new Date('10/2/2016'));
            expect(document.querySelector('.e-title').textContent).toBe('2016');
            expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date'))).toBe(new Date('10/1/2016').valueOf());
            expect(calendar.currentView()).toBe('Year');
        });
        it('navigate to year view from month test case ', () => {
            calendar.start = "Decade";
            calendar.depth = "Decade";
            calendar.navigateTo('Year');
            expect(calendar.currentView()).toBe('Decade');
            calendar.start = "Decade";
            calendar.depth = "Year";
            calendar.navigateTo('Month');
            expect(calendar.currentView()).toBe('Year');
        });
        it('currentView to check year view test case', () => {
            calendar.navigateTo('Month', new Date('2/1/2016'));
            expect(calendar.currentView()).toBe('Month');
            expect(calendar.contentElement.classList.contains('e-month')).toBe(true);
        });
        it('currentView to check decade view test case', () => {
            calendar.navigateTo('Decade', new Date('1/2/2016'));
            expect(calendar.currentView()).toBe('Decade');
            expect(calendar.contentElement.classList.contains('e-decade')).toBe(true);
        });
        it('currentView to check month view test case', () => {
            expect(calendar.currentView()).toBe('Month');
            expect(calendar.contentElement.classList.contains('e-month')).toBe(true);
        });
        it('destroy method test case', () => {
            calendar.destroy()
            expect(document.getElementById('calendar').children.length).toBe(0);
        });
    });

    describe(' event argument', () => {
        let cal: any;
        let calendar: Calendar;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: null,
            stopPropagation: (): void => { /** NO Code */ }
        };
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'calendar' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (calendar) {
                calendar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('change test case ', () => {
            cal = new Calendar({
                value: new Date('2/2/2017'), change: function (args: ChangedEventArgs): void {
                    expect(args.value.valueOf()).toBe(cal.value.valueOf());
                }
            });
            cal.appendTo('#calendar');
            cal.value = new Date('3/3/2017');
            cal.dataBind();
        });
        it('navigate year test case ', () => {
            cal = new Calendar({ value: new Date('2/2/2017') });
            cal.appendTo('#calendar');
            mouseEventArgs.currentTarget = document.querySelector('.e-title');
            cal.navigateTitle(mouseEventArgs);
        });
        it('navigate decade test case ', () => {
            cal = new Calendar({
                value: new Date('2/2/2017'), navigated: function (args: any): void {
                    expect(args.view).toBe('Decade');

                }, start: "Decade"
            });
            cal.appendTo('#calendar');
        });
        it('Dayrendercell test case ', () => {
            cal = new Calendar({
                renderDayCell: function (args: any): void {
                    if (args.date.getDay() == 0 || args.date.getDay() == 6) {
                        args.isDisabled = true;
                        args.element.textContent = '-';
                    }

                }
            });
            cal.appendTo('#calendar');
        });

        describe('Keyboard interaction ', () => {
            let calendar: any;
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                target: null,
                action: 'controlUp'
            };
            beforeEach(() => {
                let ele: HTMLElement = createElement('div', { id: 'calendar' });
                document.body.appendChild(ele);
            });
            afterEach(() => {
                if (calendar) {
                    calendar.destroy();
                }
                document.body.innerHTML = '';
            });

            it(' control +up arrow test case ', () => {
                calendar = new Calendar({ value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                expect(document.querySelector('.e-title').textContent).toBe('March 2017');
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Year");
                expect(document.querySelector('.e-title').textContent).toBe('2017');
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Decade");
                expect(document.querySelector('.e-title').textContent).toBe('2010 - 2019');
            });
            it(' home and end button testing on year and decade view ', () => {
                calendar = new Calendar({ value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                expect(document.querySelector('.e-title').textContent).toBe('March 2017');
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Year");
                keyEventArgs.action = 'home';
                calendar.keyActionHandle(keyEventArgs);
                expect(document.querySelector('.e-focused-date').textContent).toBe('Jan');
                keyEventArgs.action = 'end';
                calendar.keyActionHandle(keyEventArgs);
                expect(document.querySelector('.e-focused-date').textContent).toBe('Dec');
                keyEventArgs.action = 'controlUp';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Decade");
                keyEventArgs.action = 'home';
                calendar.keyActionHandle(keyEventArgs);
                expect(document.querySelector('.e-focused-date').textContent).toBe('2009');
                keyEventArgs.action = 'end';
                calendar.keyActionHandle(keyEventArgs);
                expect(document.querySelector('.e-focused-date').textContent).toBe('2010');
            });
            it('Today button enter key support case ', () => {
                calendar = new Calendar({ value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                var element: HTMLElement = calendar.todayElement;
                element.focus();
                keyEventArgs.target = element;
                keyEventArgs.action = 'select';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.value.toDateString()).toBe(new Date().toDateString());
            });
            it(' up arrow with min and max  on month view test case ', () => {
                calendar = new Calendar({ value: new Date('1/2/2017'), min: new Date('1/1/2017'), max: new Date('2/2/2017') });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'moveUp';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Month");
                expect(document.querySelector('.e-title').textContent).toBe('January 2017');
            });
            it('  left arrow with min and max   on month view test case ', () => {
                calendar = new Calendar({ value: new Date('1/2/2017'), min: new Date('1/1/2017'), max: new Date('2/2/2017') });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'moveLeft';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Month");
                expect(document.querySelector('.e-title').textContent).toBe('January 2017');
            });
            it('  down arrow with min and max   on month view test case ', () => {
                calendar = new Calendar({ value: new Date('1/2/2017'), min: new Date('1/1/2017'), max: new Date('1/5/2017') });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'Down';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Month");
                expect(document.querySelector('.e-title').textContent).toBe('January 2017');
            });
            it(' up arrow with min and max  on year view test case ', () => {
                calendar = new Calendar({ value: new Date('1/2/2017'), min: new Date('1/1/2017'), max: new Date('2/2/2017') });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'moveUp';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Month");
                expect(document.querySelector('.e-title').textContent).toBe('January 2017');
            });

            it('keyboard focused date on year view test case ', () => {
                calendar = new Calendar({
                    value: new Date('1/2/2017'),
                    min: new Date('1/1/2017'),
                    max: new Date('2/2/2017')
                });
                calendar.appendTo('#calendar');
                (<HTMLElement>calendar.tableBodyElement.querySelectorAll('tr td')[10]).click();
                keyEventArgs.action = 'controlUp';
                calendar.keyActionHandle(keyEventArgs);
                keyEventArgs.action = 'moveRight';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Year");
                expect(document.querySelector('.e-title').textContent).toBe('2017');
                expect(document.querySelector('.e-focused-date').textContent).toBe('Feb');
            });

            it('keyboard focused date on decade view test case ', () => {
                calendar = new Calendar({
                    value: new Date('1/2/2017'),
                    min: new Date('1/1/2017'),
                    max: new Date('2/2/2020')
                });
                calendar.appendTo('#calendar');
                (<HTMLElement>calendar.tableBodyElement.querySelectorAll('tr td')[10]).click();
                keyEventArgs.action = 'controlUp';
                calendar.keyActionHandle(keyEventArgs);
                keyEventArgs.action = 'controlUp';
                calendar.keyActionHandle(keyEventArgs);
                keyEventArgs.action = 'moveRight';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Decade");
                expect(document.querySelector('.e-title').textContent).toBe('2010 - 2019');
                expect(document.querySelector('.e-focused-date').textContent).toBe('2018');
            });
            it('  left arrow with min and max   on year view test case ', () => {
                calendar = new Calendar({
                    value: new Date('1/2/2017'),
                    min: new Date('1/1/2017'), max: new Date('2/2/2017'), start: "Year"
                });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'moveLeft';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Year");
                expect(document.querySelector('.e-title').textContent).toBe('2017');
            });
            it(' up arrow with min and max  on decade view test case ', () => {
                calendar = new Calendar({
                    value: new Date('1/2/2017'),
                    min: new Date('1/1/2017'), max: new Date('2/2/2017'), start: "Decade"
                });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'moveUp';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Decade");
                expect(document.querySelector('.e-title').textContent).toBe('2010 - 2019');
            });
            it('  left arrow with min and max   on year view test case ', () => {
                calendar = new Calendar({ value: new Date('1/2/2017'), min: new Date('1/1/2017'), max: new Date('2/2/2017') });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'moveLeft';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Month");
                expect(document.querySelector('.e-title').textContent).toBe('January 2017');
            });
            it('control + down arrow test case ', () => {
                calendar = new Calendar({ start: "Decade" });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'controlDown';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Year");
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Month");
            });
            it('down arrow on decade view test case ', () => {
                calendar = new Calendar({ start: "Decade", value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('2017');
                keyEventArgs.action = 'moveDown';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('2021');
                expect(calendar.currentView()).toBe("Decade");
            });
            it('down arrow on month view test case ', () => {
                calendar = new Calendar({ start: "Month", value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('3');
                keyEventArgs.action = 'moveDown';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('10');
                expect(calendar.currentView()).toBe("Month");
            });
            it('left arrow test case ', () => {
                calendar = new Calendar({ start: "Year", value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('Mar');
                keyEventArgs.action = 'moveLeft';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('Feb');
                expect(calendar.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
                expect(calendar.currentView()).toBe("Year");
            });
            it('right arrow test case ', () => {
                calendar = new Calendar({ start: "Month", value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('3');
                keyEventArgs.action = 'moveRight';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('4');
                expect(calendar.currentView()).toBe("Month");
            });
            it(' enter key on month view test case ', () => {
                calendar = new Calendar({ start: "Month", value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('3');
                keyEventArgs.action = 'moveRight';
                calendar.keyActionHandle(keyEventArgs);
                keyEventArgs.action = 'select';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('4');
                expect(calendar.value.valueOf()).toBe(new Date('3/4/2017').valueOf());
                expect(calendar.currentView()).toBe("Month");
            });
            it(' enter key on month view  of fucused test case ', () => {
                calendar = new Calendar({ start: "Month" });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'select';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.currentView()).toBe("Month");
            });

            it(' enter key on year view test case ', () => {
                calendar = new Calendar({ start: "Year", value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('Mar');
                keyEventArgs.action = 'moveRight';
                calendar.keyActionHandle(keyEventArgs);
                keyEventArgs.action = 'select';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('3');
                expect(calendar.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
                expect(calendar.currentView()).toBe("Month");
            });
            it('home key test case ', () => {
                calendar = new Calendar({ value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'home';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('1');
                expect(calendar.currentView()).toBe("Month");
            });
            it('end key test case ', () => {
                calendar = new Calendar({ value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'end';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('31');
                expect(calendar.currentView()).toBe("Month");
            });
            it('pageup key test case ', () => {
                calendar = new Calendar({ value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'pageUp';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('3');
                expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date')))
                    .toBe((new Date('2/3/2017')).valueOf());
                expect(calendar.currentView()).toBe("Month");
            });
            it('pageDown key test case ', () => {
                calendar = new Calendar({ value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'pageDown';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('3');
                expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date')))
                    .toBe((new Date('4/3/2017')).valueOf());
                expect(calendar.currentView()).toBe("Month");
            });
            it('shiftPageUp key test case ', () => {
                calendar = new Calendar({ value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'shiftPageUp';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('3');
                expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date')))
                    .toBe((new Date('3/3/2016')).valueOf());
                expect(calendar.currentView()).toBe("Month");
            });
            it('shiftPageDown key test case ', () => {
                calendar = new Calendar({ value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'shiftPageDown';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('3');
                expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date')))
                    .toBe((new Date('3/3/2018')).valueOf());
                expect(calendar.currentView()).toBe("Month");
            });
            it('controlHome key test case ', () => {
                calendar = new Calendar({ value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'controlHome';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('1');
                expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date')))
                    .toBe((new Date('1/1/2017')).valueOf());
                expect(calendar.currentView()).toBe("Month");
            });
            it('controlEnd key test case ', () => {
                calendar = new Calendar({ value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                keyEventArgs.action = 'controlEnd';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('31');
                expect(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date')))
                    .toBe((new Date('12/31/2017')).valueOf());
                expect(calendar.currentView()).toBe("Month");
            });
            it(' enter key on year view of slected element test case ', () => {
                calendar = new Calendar({ start: "Year", value: new Date('3/3/2017') });
                calendar.appendTo('#calendar');
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('Mar');
                keyEventArgs.action = 'select';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('3');
                expect(calendar.value.valueOf()).toBe(new Date('3/3/2017').valueOf());
                expect(calendar.currentView()).toBe("Month");
            });
            it(' enter key on  month view of slected element test case ', () => {
                calendar = new Calendar({
                    start: "Month", value: new Date('3/2/2017')
                    , min: new Date('3/1/2017'), max: new Date('3/2/2017')
                });
                calendar.appendTo('#calendar');
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('2');
                keyEventArgs.action = 'select';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('2');
                expect(calendar.value.valueOf()).toBe(new Date('3/2/2017').valueOf());
                expect(calendar.currentView()).toBe("Month");
            });
            it(' enter key on year view with start and depth value on year element test case ', () => {
                calendar = new Calendar({ start: "Year", depth: "Year", value: new Date('3/2/2017') });
                calendar.appendTo('#calendar');
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('Mar');
                keyEventArgs.action = 'controlDown';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('Mar');
                expect(calendar.value.valueOf()).toBe(new Date('3/2/2017').valueOf());
                expect(calendar.currentView()).toBe("Year");
            });
            it(' enter key on decade view with start and depth value on year element test case ', () => {
                calendar = new Calendar({ start: "Decade", depth: "Decade", value: new Date('3/2/2017') });
                calendar.appendTo('#calendar');
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('2017');
                keyEventArgs.action = 'controlDown';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('2017');
                expect(calendar.value.valueOf()).toBe(new Date('3/2/2017').valueOf());
                expect(calendar.currentView()).toBe("Decade");
            });
            it(' enter key with start value greater than the depth value test case ', () => {
                calendar = new Calendar({ start: "Decade", depth: "Year", value: new Date('3/2/2017') });
                calendar.appendTo('#calendar');
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('2017');
                keyEventArgs.action = 'controlDown';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('Mar');
                expect(calendar.value.valueOf()).toBe(new Date('3/2/2017').valueOf());
                expect(calendar.currentView()).toBe("Year");
            });
            it(' enter key with start ,depth value test case ', () => {
                calendar = new Calendar({ start: "Year", depth: "Month", value: new Date('3/2/2017') });
                calendar.appendTo('#calendar');
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('Mar');
                keyEventArgs.action = 'controlDown';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('2');
                expect(calendar.value.valueOf()).toBe(new Date('3/2/2017').valueOf());
                expect(calendar.currentView()).toBe("Month");
            });
            it('Up arrow  on month view test case ', () => {
                calendar = new Calendar({ start: "Month", value: new Date('7/3/2017') });
                calendar.appendTo('#calendar');
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('3');
                keyEventArgs.action = 'moveUp';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('26');
                expect(calendar.currentView()).toBe("Month");
            });
            it('Up arrow  on year view test case ', () => {
                calendar = new Calendar({ start: "Year", value: new Date('7/3/2017') });
                calendar.appendTo('#calendar');
                expect(calendar.tableBodyElement.querySelector('tr td.e-selected').textContent).toBe('Jul');
                keyEventArgs.action = 'moveUp';
                calendar.keyActionHandle(keyEventArgs);
                expect(calendar.tableBodyElement.querySelector('tr td.e-focused-date').textContent).toBe('Mar');
                expect(calendar.currentView()).toBe("Year");
            });
        });

        function loadCultureFiles(name: string, base?: boolean): void {
            let files: string[] = !base ?
                ['ca-gregorian.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json'] : ['numberingSystems.json'];
            for (let prop of files) {
                let val: Object;
                let ajax: Ajax;
                if (base) {
                    ajax = new Ajax('base/spec/cldr/main/' + prop, 'GET', false);
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

        describe('locale ', () => {
            let calendar: any;
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                action: 'controlUp'
            };
            beforeEach(() => {
                let ele: HTMLElement = createElement('div', { id: 'calendar' });
                document.body.appendChild(ele);
            });
            afterEach(() => {
                if (calendar) {
                    calendar.destroy();
                }
                document.body.innerHTML = '';
            });
            it('culture(ja) title test case', () => {
                loadCultureFiles('ja');
                setCulture('ja');
                cal = new Calendar({ value: new Date('2/2/2017') });
                cal.appendTo('#calendar');
                expect(cal.locale).toBe('ja');
                expect(document.querySelector('.e-title').textContent).toBe('2017年2月');
                expect(document.querySelector('tr td.e-selected span').textContent).toBe("2日");
                (<HTMLElement>document.querySelector('.e-title')).click();
                expect(document.querySelector('.e-title').textContent).toBe('2017年');
                expect(document.querySelector('tr td.e-selected span').textContent).toBe("2月");
                (<HTMLElement>document.querySelector('.e-title')).click();
                expect(document.querySelector('.e-title').textContent).toBe('2010年 - 2019年');
                expect(document.querySelector('tr td.e-selected span').textContent).toBe("2017年");
                setCulture('en-US');
            });
            it('culture(en-US) title test case', () => {
                cal = new Calendar({ value: new Date('2/2/2017') });
                cal.appendTo('#calendar');
                cal.locale = 'en-US';
                cal.dataBind();
                expect(cal.locale).toBe('en-US');
                expect(document.querySelector('.e-title').textContent).toBe('February 2017');
                expect(document.querySelector('tr td.e-selected span').textContent).toBe("2");
                (<HTMLElement>document.querySelector('.e-title')).click();
                expect(document.querySelector('.e-title').textContent).toBe('2017');
                expect(document.querySelector('tr td.e-selected span').textContent).toBe("Feb");
                (<HTMLElement>document.querySelector('.e-title')).click();
                expect(document.querySelector('.e-title').textContent).toBe('2010 - 2019');
                expect(document.querySelector('tr td.e-selected span').textContent).toBe("2017");
            });
            // Date Parser issue
            // it('setCulture test case', () => {
            //     loadCultureFiles('vi');
            //     setCulture('vi');
            //     cal = new Calendar({ value: new Date('2/2/2017') });
            //     cal.appendTo('#calendar');
            //     expect(cal.locale).toBe('vi');
            //     expect(document.querySelector('.e-title').textContent).toBe('Tháng 2 năm 2017');
            // });
            // it('locale with setculture  test case', () => {
            //     loadCultureFiles('vi');
            //     loadCultureFiles('ja');
            //     setCulture('ja');
            //     setCulture('vi');
            //     cal = new Calendar({ value: new Date('2/2/2017'), locale: 'vi' });
            //     cal.appendTo('#calendar');
            //     expect(cal.locale).toBe('vi');
            //     expect(document.querySelector('.e-title').textContent).toBe('Tháng 2 năm 2017');
            //     setCulture('en-US');
            // });
        });
    });
    describe('Class name', () => {
        let calendar: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'controlUp'
        };
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'calendar' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (calendar) {
                calendar.destroy();
            }
            document.body.innerHTML = '';
        });
        /**
         * e-day class  
         */
        it('e-day test case', () => {
            calendar = new Calendar({ value: new Date() });
            calendar.appendTo('#calendar');
            expect(document.querySelectorAll('.e-content table tbody tr td span.e-day')[0].classList.contains('e-day')).toBe(true)
        });
        /**
         * e-focused-date class  
         */
        it('e-focused-date test case', () => {
            calendar = new Calendar({ value: new Date('4/4/2017') });
            calendar.appendTo('#calendar');
            expect(document.querySelectorAll('.e-content table tbody tr td.e-selected')[0].classList.contains('e-selected')).toBe(true)
            keyEventArgs.action = 'moveRight';
            calendar.keyActionHandle(keyEventArgs);
            expect((new Date(getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date')))).toDateString()).toBe(new Date('4/5/2017').toDateString());
        });
        /**
         * enable ripple animation  
         */
        it('e-ripple test case', () => {
            enableRipple(true);
            calendar = new Calendar({ value: new Date() });
            calendar.appendTo('#calendar');
            expect(document.querySelector('.e-content table tbody tr td span.e-day').getAttribute('data-ripple')).toBe('true')
            expect(document.querySelectorAll('.e-content table tbody tr td span.e-day')[0].classList.contains('e-day')).toBe(true)
            enableRipple(false);
        });
        /**
       * disable ripple animation  
       */
        it('disabled ripple animation test case', () => {
            enableRipple(false);
            calendar = new Calendar({ value: new Date() });
            calendar.appendTo('#calendar');
            expect(document.querySelector('.e-content table tbody tr td span.e-day').getAttribute('data-ripple')).toBe(null)
            expect(document.querySelectorAll('.e-content table tbody tr td span.e-day')[0].classList.contains('e-day')).toBe(true)
        });
    });
    describe('testing issue', () => {
        let calendar: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'moveLeft'
        };
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: null,
            stopPropagation: (): void => { /** NO Code */ }
        };
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'calendar' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (calendar) {
                calendar.destroy();
            }
            document.body.innerHTML = '';
        });
        it(' EJ2-1395 Navigation state is not maintaining after moving months.', function () {
            calendar = new Calendar({
                value: new Date('2/10/2017')
            });
            calendar.appendTo('#calendar');
            (<HTMLElement>document.querySelector('.e-title')).click();
            (<HTMLElement>document.querySelector('.e-title')).click();
            (<HTMLElement>calendar.tableBodyElement.querySelectorAll('tr td')[1]).click();
            (<HTMLElement>calendar.tableBodyElement.querySelectorAll('tr td')[1]).click();
            (<HTMLElement>calendar.tableBodyElement.querySelectorAll('tr td')[1]).click();
            expect(document.querySelector('.e-title').textContent).toBe('February 2010');
        });
        it(' EJ2-1535 selected value is not maintained properly in year view using keyboard ', () => {
            calendar = new Calendar({ value: new Date('4/3/2017') });
            calendar.appendTo('#calendar');
            keyEventArgs.action = 'controlUp';
            calendar.keyActionHandle(keyEventArgs);
            expect(calendar.currentView()).toBe("Year");
            keyEventArgs.action = 'moveLeft';
            calendar.keyActionHandle(keyEventArgs);
            expect((getIdValue(calendar.tableBodyElement.querySelector('tr td.e-selected')))).toBe(new Date("4/1/2017").valueOf());
            expect((getIdValue(calendar.tableBodyElement.querySelector('tr td.e-focused-date')))).toBe(new Date("3/1/2017").valueOf());
        });
    })
    describe('Date with time options', () => {
        let calendarObj: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'calendar' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (calendarObj) {
                calendarObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('value with time', () => {
            calendarObj = new Calendar({});
            calendarObj.appendTo('#calendar');
            calendarObj.value = new Date('4/4/2017 4:00 AM');
            expect(calendarObj.value.toLocaleString()).toBe(new Date('4/4/2017 4:00 AM').toLocaleString());
        });
        it('min value with current date', () => {
            calendarObj = new Calendar({ value: new Date(), min: new Date() });
            calendarObj.appendTo('#calendar');
            expect(document.querySelector('.e-selected') !== null).toBe(true);
        });
        it('min value with time (error case)', () => {
            calendarObj = new Calendar({ value: new Date('11/1/2017 14:00'), min: new Date('11/1/2017 16:00') });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.value.valueOf()).toBe(new Date('11/1/2017 16:00').valueOf());
        });
        it('min value with time (lesser than current time)', () => {
            calendarObj = new Calendar({ value: new Date('11/3/2017 14:00'), min: new Date('11/1/2017 16:00') });
            calendarObj.appendTo('#calendar');
            (<HTMLElement>calendarObj.tableBodyElement.querySelectorAll('tr td')[3]).click();
            expect(calendarObj.value.valueOf()).toBe(new Date('11/1/2017 16:00').valueOf());
        });
        it('max value with time (greater than current time)', () => {
            calendarObj = new Calendar({ value: new Date('11/3/2017 23:00'), max: new Date('11/5/2017 16:00') });
            calendarObj.appendTo('#calendar');
            (<HTMLElement>calendarObj.tableBodyElement.querySelectorAll('tr td')[7]).click();
            expect(calendarObj.value.valueOf()).toBe(new Date('11/5/2017 16:00').valueOf());
        });
    })
    describe('today button property', () => {
        let calendarObj: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'calendar' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (calendarObj) {
                calendarObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('default behavior of today button', () => {
            calendarObj = new Calendar({});
            calendarObj.appendTo('#calendar');
            expect(calendarObj.showTodayButton).toBe(true);
        });
        it('min value with today button', () => {
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 3);
            calendarObj = new Calendar({ value: new Date(), min: new Date(currentDate.toDateString()) });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.element.lastChild.lastElementChild.classList.contains('e-disabled')).toBe(true);
        });
        it('max value with today button', () => {
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - 3);
            calendarObj = new Calendar({ value: new Date(), max: new Date(currentDate.toDateString()) });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.element.lastChild.lastElementChild.classList.contains('e-disabled')).toBe(true);
        });
        it('today button test case', () => {
            calendarObj = new Calendar({
            });
            calendarObj.appendTo('#calendar');
            let ele = document.getElementById('date');
            calendarObj.showTodayButton = false;
            calendarObj.dataBind();
            expect(calendarObj.footer).toBe(undefined);
            expect(calendarObj.showTodayButton).toBe(false);
        })
        it('today button set model test case', () => {
            calendarObj = new Calendar({
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.todayElement.classList.contains("e-today")).toBe(true);
            calendarObj.showTodayButton = false;
            calendarObj.dataBind();
            expect(calendarObj.todayElement).toBe(undefined);
            expect(calendarObj.footer).toBe(undefined);
        });
        it('today button with min property test case', () => {
            calendarObj = new Calendar({
            });
            calendarObj.appendTo('#calendar');
            calendarObj.min = new Date(new Date().setDate(new Date().getDate() + 1));
            calendarObj.dataBind();
            expect(calendarObj.element.lastChild.lastElementChild.classList.contains('e-disabled')).toBe(true);
            calendarObj.min = new Date(new Date().setDate(new Date().getDate() - 2));
            calendarObj.dataBind();
            expect(calendarObj.element.lastChild.lastElementChild.classList.contains('e-disabled')).toBe(false);
            expect(calendarObj.todayElement.classList.contains("e-today")).toBe(true);
            calendarObj.todayElement.click();
            expect(calendarObj.element.lastChild.lastElementChild.classList.contains('e-disabled')).toBe(false);
            let today = new Date();
            expect(+calendarObj.value).toBe(+ new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
        });
        it('current view for today click', (done) => {
            calendarObj = new Calendar({ value: new Date("1/1/2011"), start: "Decade" });
            calendarObj.appendTo('#calendar');
            calendarObj.todayElement.click();
            setTimeout(() => {
                expect(calendarObj.currentView()).toBe('Month');
                done();
            }, 450);

        });
        it('today button with start and depth property test case', () => {
            calendarObj = new Calendar({
                start: 'Year'
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.todayElement.classList.contains("e-today")).toBe(true);
            calendarObj.todayElement.click();
            expect(calendarObj.currentView()).toBe('Month');
            calendarObj.start = 'Decade';
            calendarObj.dataBind();
            calendarObj.depth = 'Year';
            calendarObj.dataBind();
            calendarObj.todayElement.click();
            expect(calendarObj.currentView()).toBe('Year');
            calendarObj.start = 'Year';
            calendarObj.dataBind();
            calendarObj.depth = 'Decade';
            calendarObj.dataBind();
            calendarObj.todayElement.click();
            expect(calendarObj.currentView()).toBe('Month');
        });
    });

    describe('MultipleSelection property', () => {
        let calendarObj: any;
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'calendar' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (calendarObj) {
                calendarObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('default behavior of without multiSelection Property', () => {
            calendarObj = new Calendar();
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values).toBe(null);
            expect(calendarObj.value).toBe(null);
            expect(calendarObj.isMultiSelection).toBe(false);
        });
        it('with multiSelection Property', () => {
            calendarObj = new Calendar({ isMultiSelection: true });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values).toBe(null);
            expect(calendarObj.value).toBe(null);
            expect(calendarObj.isMultiSelection).toBe(true);
        });
        it('setmodel multiSelection Property', () => {
            calendarObj = new Calendar();
            calendarObj.appendTo('#calendar');
            calendarObj.isMultiSelection = true;
            calendarObj.dataBind();
            expect(calendarObj.isMultiSelection).toBe(true);
            expect(calendarObj.values).toBe(null);
            expect(calendarObj.value).toBe(null);
        });
        it('values initialization Property', () => {
            calendarObj = new Calendar({
                isMultiSelection: true,
                values: [new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018'), new Date('5/01/2018')],
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.isMultiSelection).toBe(true);
            expect(+calendarObj.value).toBe(+new Date('5/01/2018'));
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
            expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[2]));
            expect(+calendarObj.values[2]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[3]));
            expect(+calendarObj.values[3]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
        });
        it('setmodel values Property', () => {
            calendarObj = new Calendar({
                isMultiSelection: true,
                value: new Date('5/12/2018'),
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.isMultiSelection).toBe(true);
            calendarObj.values = [new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018'), new Date('5/01/2018')];
            calendarObj.dataBind();
            expect(+calendarObj.value).toBe(+new Date('5/01/2018'));
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
            expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[2]));
            expect(+calendarObj.values[2]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[3]));
            expect(+calendarObj.values[3]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
        });
        it('setModel behavior of values with multiselection Property', () => {
            calendarObj = new Calendar({
                value: new Date('5/12/2018'),
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values).toBe(null);
            expect(+calendarObj.value).toBe(+new Date('5/12/2018'));
            expect(calendarObj.isMultiSelection).toBe(false);
            calendarObj.isMultiSelection = true;
            calendarObj.dataBind();
            expect(calendarObj.isMultiSelection).toBe(true);
            expect(calendarObj.values).toBe(null);
            calendarObj.values = [new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018'), new Date('5/01/2018')];
            calendarObj.dataBind();
            expect(+calendarObj.value).toBe(+new Date('5/01/2018'));
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
            expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[2]));
            expect(+calendarObj.values[2]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[3]));
            expect(+calendarObj.values[3]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
        });
        it('values exceeding max Property', () => {
            calendarObj = new Calendar({
                value: new Date('5/12/2018'),
                max: new Date("5/13/2018"),
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values).toBe(null);
            expect(calendarObj.isMultiSelection).toBe(false);
            calendarObj.removeDate([new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018')]);
            expect(calendarObj.values).toBe(null);
            calendarObj.isMultiSelection = true;
            calendarObj.dataBind();
            expect(calendarObj.isMultiSelection).toBe(true);
            calendarObj.addDate([new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018')]);
            expect(calendarObj.values.length).toBe(2);
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
            expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
            calendarObj.removeDate([new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018')]);
            expect(calendarObj.values.length).toBe(0);
        });
        it('values exceeding setmodel max Property', () => {
            calendarObj = new Calendar({
                value: new Date('5/12/2018'),
                isMultiSelection: true,
                max: new Date("5/13/2018"),
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values).toBe(null);
            expect(calendarObj.isMultiSelection).toBe(true);
            calendarObj.values = [new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018')];
            calendarObj.dataBind();
            expect(+calendarObj.value).toBe(+new Date('5/13/2018'));
            expect(+calendarObj.max).toBe(+new Date("5/13/2018"));
            expect(+calendarObj.values.length).toBe(2);
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
            expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
        });
        it('addDate method of single value in values Property', () => {
            calendarObj = new Calendar({
                value: new Date('5/12/2018'),
                isMultiSelection: true,
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.isMultiSelection).toBe(true);
            expect(+calendarObj.value).toBe(+new Date('5/12/2018'));
            expect(calendarObj.values).toBe(null);
            calendarObj.addDate(new Date("5/2/2018"));
            expect(+calendarObj.value).toBe(+new Date("5/2/2018"));
            expect(calendarObj.values.length).toBe(1);
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
        });
        it('addDate method of single value with setmodel of multiselection Property', () => {
            calendarObj = new Calendar({
                value: new Date('5/12/2018'),
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values).toBe(null);
            expect(+calendarObj.value).toBe(+new Date('5/12/2018'));
            calendarObj.addDate(new Date("5/2/2018"));
            expect(calendarObj.values.length).toBe(1);
            expect(+calendarObj.values[0]).toBe(+new Date("5/2/2018"));
            calendarObj.isMultiSelection = true;
            calendarObj.dataBind();
            calendarObj.addDate(new Date("5/2/2018"));
            expect(+calendarObj.value).toBe(+new Date('5/2/2018'));
            expect(calendarObj.values.length).toBe(1);
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
        });
        it('addDate method of array values in values Property', () => {
            calendarObj = new Calendar({
                value: new Date('5/12/2018'),
                isMultiSelection: true,
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values).toBe(null);
            calendarObj.addDate([new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018')]);
            expect(+calendarObj.value).toBe(+new Date('5/20/2018'));
            expect(calendarObj.values.length).toBe(3);
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
            expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
            expect(+calendarObj.values[2]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[2]));
        });
        it('addDate method of array values in setmodel multiselection Property', () => {
            calendarObj = new Calendar({
                value: new Date('5/12/2018'),
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values).toBe(null);
            calendarObj.isMultiSelection = true;
            calendarObj.dataBind();
            calendarObj.addDate([new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018')]);
            expect(+calendarObj.value).toBe(+new Date('5/20/2018'));
            expect(calendarObj.values.length).toBe(3);
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
            expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
            expect(+calendarObj.values[2]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[2]));
        });
        it('removeDate method of single value in values Property', () => {
            calendarObj = new Calendar({
                value: new Date('5/12/2018'),
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values).toBe(null);
            calendarObj.removeDate(new Date("5/2/2018"));
            expect(calendarObj.values).toBe(null);
            calendarObj.isMultiSelection = true;
            calendarObj.dataBind();
            calendarObj.addDate(new Date("5/2/2018"));
            expect(calendarObj.values.length).toBe(1);
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
            calendarObj.removeDate(new Date("5/2/2018"));
            expect(calendarObj.values.length).toBe(0);
        });
        it('addDate method of array values in values Property', () => {
            calendarObj = new Calendar({
                value: new Date('5/12/2018'),
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values).toBe(null);
            calendarObj.removeDate([new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018')]);
            expect(calendarObj.values).toBe(null);
            calendarObj.isMultiSelection = true;
            calendarObj.dataBind();
            calendarObj.addDate([new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018')]);
            expect(calendarObj.values.length).toBe(3);
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
            expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
            expect(+calendarObj.values[2]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[2]));
            calendarObj.removeDate([new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018')]);
            expect(calendarObj.values.length).toBe(0);
        });
        it('deselect behavior of multiSelection Property', () => {
            calendarObj = new Calendar({
                isMultiSelection: true,
                values: [new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018'), new Date('5/01/2018')],
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
            expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[2]));
            expect(+calendarObj.values[2]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[3]));
            expect(+calendarObj.values[3]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
            calendarObj.tableBodyElement.querySelectorAll('.e-selected')[1].click();
            expect(calendarObj.values.length).toBe(3);
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
        });
        it('select behavior of multiSelection Property', () => {
            calendarObj = new Calendar({
                isMultiSelection: true,
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values).toBe(null);
            (<HTMLElement>calendarObj.tableBodyElement.querySelectorAll('tr td')[5]).click();
            expect(calendarObj.values.length).toBe(1);
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
        });
        it('value as today date setmodel behavior of multiSelection Property', () => {
            calendarObj = new Calendar({
                isMultiSelection: true,
                values: [new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018'), new Date('5/01/2018')],
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
            expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[2]));
            expect(+calendarObj.values[2]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[3]));
            expect(+calendarObj.values[3]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
            calendarObj.addDate(new Date());
            expect(calendarObj.values.length).toBe(5);
        });
        // we have comment this section for intimate this case to be covered at our Automation testing. 
        // because this case was not working at typeScript platform. 
        // it('value as ISO string date behavior of multiSelection Property', () => {
        //     calendarObj = new Calendar({
        //         isMultiSelection: true,
        //         values: ["2018-05-11T18:30:00.000Z", "2018-05-12T18:30:00.000Z", "2018-05-19T18:30:00.000Z", "2018-04-30T18:30:00.000Z"],
        //     });
        //     calendarObj.appendTo('#calendar');
        //     expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
        //     expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
        //     expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[2]));
        //     expect(+calendarObj.values[2]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[3]));
        //     expect(+calendarObj.values[3]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
        //     calendarObj.addDate(new Date());
        //     expect(calendarObj.values.length).toBe(5);
        // });
        it('select behavior of multiSelection Property', () => {
            calendarObj = new Calendar({
                isMultiSelection: true,
                values: [new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018'), new Date('5/01/2018')],
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
            expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[2]));
            expect(+calendarObj.values[2]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[3]));
            expect(+calendarObj.values[3]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
            (<HTMLElement>calendarObj.tableBodyElement.querySelectorAll('tr td')[5]).click();
            expect(calendarObj.values.length).toBe(5);
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
        });
        it('select otherMonth behavior of multiSelection Property', () => {
            calendarObj = new Calendar({
                isMultiSelection: true,
                values: [new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018'), new Date('5/01/2018')],
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
            expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[2]));
            expect(+calendarObj.values[2]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[3]));
            expect(+calendarObj.values[3]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
            (<HTMLElement>calendarObj.tableBodyElement.querySelectorAll('tr td')[1]).click();
            expect(calendarObj.values.length).toBe(5);
            expect(calendarObj.element.querySelectorAll('.e-selected').length).toBe(1);
        });
        it('next Icon Click behavior of multiSelection Property', () => {
            calendarObj = new Calendar({
                isMultiSelection: true,
                values: [new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018'), new Date('5/01/2018')],
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
            expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[2]));
            expect(+calendarObj.values[2]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[3]));
            expect(+calendarObj.values[3]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
            (<HTMLElement>document.getElementsByClassName('e-date-icon-next')[0]).click();
            expect(calendarObj.values.length).toBe(4);
        });
        it('title Click behavior of multiSelection Property', () => {
            calendarObj = new Calendar({
                isMultiSelection: true,
                values: [new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018'), new Date('5/01/2018')],
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            (<HTMLElement>document.getElementsByClassName('e-title')[0]).click();
            calendarObj.tableBodyElement.querySelectorAll('tr td')[3].click();
            expect(calendarObj.values.length).toBe(4);
        });
        it('todayButton click behavior of multiSelection Property', (done) => {
            calendarObj = new Calendar({
                isMultiSelection: true,
                values: [new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018'), new Date('5/01/2018')],
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values.length).toBe(calendarObj.element.querySelectorAll('.e-selected').length);
            expect(+calendarObj.values[0]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[1]));
            expect(+calendarObj.values[1]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[2]));
            expect(+calendarObj.values[2]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[3]));
            expect(+calendarObj.values[3]).toBe(getIdValue(calendarObj.element.querySelectorAll('.e-selected')[0]));
            calendarObj.todayElement.click();
            setTimeout(() => {
                expect(calendarObj.values.length).toBe(5);
                expect(calendarObj.element.querySelectorAll('.e-selected').length).toBe(1);
                done();
            }, 450);
        });
        it('enabling the date values of disabled dates in renderDayCell event', function () {
            calendarObj = new Calendar({
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() == 7) {
                        args.isDisabled = true;
                    }
                }, min: new Date('5/5/2017'), max: new Date('5/8/2017'),
                isMultiSelection: true,
                values: [new Date('5/5/2017'), new Date('5/6/2017'), new Date('5/7/2017')],
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values.length).toBe(2);
        });
        it('dynamically enabling the date values of disabled dates in renderDayCell event', function () {
            calendarObj = new Calendar({
                renderDayCell: function (args: any): void {
                    if (args.date.getDate() == 7) {
                        args.isDisabled = true;
                    }
                }, min: new Date('5/5/2017'), max: new Date('5/8/2017'),
                isMultiSelection: true,
            });
            calendarObj.appendTo('#calendar');
            calendarObj.values = [new Date('5/5/2017'), new Date('5/6/2017'), new Date('5/7/2017')];
            calendarObj.dataBind();
            expect(calendarObj.values.length).toBe(2);
        });
        it('enabling the date values of disabled dates in Min and Max', function () {
            calendarObj = new Calendar({
                min: new Date('5/5/2017'), max: new Date('5/8/2017'),
                isMultiSelection: true,
            });
            calendarObj.appendTo('#calendar');
            calendarObj.values = [new Date('5/5/2017'), new Date('5/6/2017'), new Date('5/9/2017')];
            calendarObj.dataBind();
            expect(calendarObj.values.length).toBe(2);
        });
        it('enabling the date values of disabled dates in Min and Max', function () {
            calendarObj = new Calendar({
                isMultiSelection: true,
                values: [new Date('5/5/2017'), new Date('5/6/2017'), new Date('5/9/2017')],
            });
            calendarObj.appendTo('#calendar');
            expect(calendarObj.values.length).toBe(3);
            calendarObj.max = new Date('5/8/2017');
            calendarObj.dataBind();
            expect(calendarObj.values.length).toBe(2);
        });
    });
    describe('Form element', () => {
        let calendarObj: any;
        beforeEach(() => {
            let formEle: HTMLElement = createElement('form', { id: "form-element" });
            let Ele: HTMLElement = createElement('div', { id: "calendar" });
            formEle.appendChild(Ele);
            document.body.appendChild(formEle);
        });
        afterEach(() => {
            if (calendarObj) {
                calendarObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Input element value rest test case', () => {
            calendarObj = new Calendar({ value: new Date() });
            calendarObj.appendTo('#calendar');
            (<any>document.getElementById("form-element")).reset();
            expect(calendarObj.element.value).toBe(undefined);
            expect(calendarObj.value).toBe(null);
        });
    });
});



