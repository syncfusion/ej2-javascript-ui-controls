/**
 * Schedule hijri calendar spec 
 */
import { createElement, remove, HijriParser } from '@syncfusion/ej2-base';
import { Islamic, Calendar } from '@syncfusion/ej2-calendars';
import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth,
    MonthAgenda
} from '../../../src/schedule/index';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth);
Calendar.Inject(Islamic);
describe('Schedule Islamic Calendar', () => {
    describe('Islamic in Day view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({
                currentView: 'Day',
                selectedDate: new Date(2018, 12, 9),
                calendarMode: 'Islamic'
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-day-view')).toBeTruthy();
        });
        it('current day checking', () => {
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Jumada I 3, 1440');
        });
        it('hijri date checking', () => {
            let date: Date = new Date(parseInt(schObj.element.querySelector('.e-work-cells').getAttribute('data-date'), 10));
            expect(date).toEqual(schObj.dayModule.renderDates[0]);
            let hijriObject: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(3);
            expect(hijriObject.month).toEqual(5);
            expect(hijriObject.year).toEqual(1440);
        });
        it('navigate next date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            let date: Date = new Date(parseInt(schObj.element.querySelector('.e-work-cells').getAttribute('data-date'), 10));
            expect(date).toEqual(schObj.dayModule.renderDates[0]);
            let hijriObject: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(4);
            expect(hijriObject.month).toEqual(5);
            expect(hijriObject.year).toEqual(1440);
        });
        it('navigate previous date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            let date: Date = new Date(parseInt(schObj.element.querySelector('.e-work-cells').getAttribute('data-date'), 10));
            expect(date).toEqual(schObj.dayModule.renderDates[0]);
            let hijriObject: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(3);
            expect(hijriObject.month).toEqual(5);
            expect(hijriObject.year).toEqual(1440);
        });
        it('checking gregorian date', () => {
            schObj.calendarMode = 'Gregorian';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Wed</div><div class="e-header-date e-navigate" role="link">9</div>');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('January 9, 2019');
        });
    });
    describe('Islamic in Week view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({
                selectedDate: new Date(2018, 12, 9),
                calendarMode: 'Islamic',
                views: [
                    { option: 'Week' }
                ],
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-week-view')).toBeTruthy();
        });
        it('hijri date checking', () => {
            let date: Date = new Date(parseInt(schObj.element.querySelector('.e-work-cells').getAttribute('data-date'), 10));
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Rabiʻ II 30 - 06, 1440');
            let hijriObject: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(30);
            expect(hijriObject.month).toEqual(4);
            expect(hijriObject.year).toEqual(1440);
            let lastDate: Date = new Date(
                parseInt(schObj.element.querySelector('.e-date-header-wrap table tr td:nth-child(7)').getAttribute('data-date'), 10));
            hijriObject = HijriParser.getHijriDate(lastDate) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(6);
            expect(hijriObject.month).toEqual(5);
            expect(hijriObject.year).toEqual(1440);
        });
        it('navigate next date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Jumada I 07 - 13, 1440');
            let date: Date = new Date(parseInt(schObj.element.querySelector('.e-work-cells').getAttribute('data-date'), 10));
            let hijriObject: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(7);
            expect(hijriObject.month).toEqual(5);
            expect(hijriObject.year).toEqual(1440);
            let lastDate: Date = new Date(
                parseInt(schObj.element.querySelector('.e-date-header-wrap table tr td:nth-child(7)').getAttribute('data-date'), 10));
            hijriObject = HijriParser.getHijriDate(lastDate) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(13);
            expect(hijriObject.month).toEqual(5);
            expect(hijriObject.year).toEqual(1440);
        });
        it('navigate previous date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Rabiʻ II 30 - 06, 1440');
            let date: Date = new Date(parseInt(schObj.element.querySelector('.e-work-cells').getAttribute('data-date'), 10));
            let hijriObject: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(30);
            expect(hijriObject.month).toEqual(4);
            expect(hijriObject.year).toEqual(1440);
            let lastDate: Date = new Date(
                parseInt(schObj.element.querySelector('.e-date-header-wrap table tr td:nth-child(7)').getAttribute('data-date'), 10));
            hijriObject = HijriParser.getHijriDate(lastDate) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(6);
            expect(hijriObject.month).toEqual(5);
            expect(hijriObject.year).toEqual(1440);
        });
        it('checking gregorian date', () => {
            schObj.calendarMode = 'Gregorian';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">6</div>');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('January 06 - 12, 2019');
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).
                toEqual('<span>12:00 AM</span>');
        });
    });
    describe('Islamic in Work Week view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({
                selectedDate: new Date(2018, 12, 9),
                calendarMode: 'Islamic',
                views: [
                    { option: 'WorkWeek' }
                ],
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-work-week-view')).toBeTruthy();
        });
        it('hijri date checking', () => {
            let date: Date = new Date(parseInt(schObj.element.querySelector('.e-work-cells').getAttribute('data-date'), 10));
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Jumada I 01 - 05, 1440');
            let hijriObject: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(1);
            expect(hijriObject.month).toEqual(5);
            expect(hijriObject.year).toEqual(1440);
            let lastDate: Date = new Date(
                parseInt(schObj.element.querySelector('.e-date-header-wrap table tr td:nth-child(5)').getAttribute('data-date'), 10));
            hijriObject = HijriParser.getHijriDate(lastDate) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(5);
            expect(hijriObject.month).toEqual(5);
            expect(hijriObject.year).toEqual(1440);
        });
        it('navigate next date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Jumada I 08 - 12, 1440');
            let date: Date = new Date(parseInt(schObj.element.querySelector('.e-work-cells').getAttribute('data-date'), 10));
            let hijriObject: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(8);
            expect(hijriObject.month).toEqual(5);
            expect(hijriObject.year).toEqual(1440);
            let lastDate: Date = new Date(
                parseInt(schObj.element.querySelector('.e-date-header-wrap table tr td:nth-child(5)').getAttribute('data-date'), 10));
            hijriObject = HijriParser.getHijriDate(lastDate) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(12);
            expect(hijriObject.month).toEqual(5);
            expect(hijriObject.year).toEqual(1440);
        });
        it('navigate previous date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Jumada I 01 - 05, 1440');
            let date: Date = new Date(parseInt(schObj.element.querySelector('.e-work-cells').getAttribute('data-date'), 10));
            let hijriObject: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(1);
            expect(hijriObject.month).toEqual(5);
            expect(hijriObject.year).toEqual(1440);
            let lastDate: Date = new Date(
                parseInt(schObj.element.querySelector('.e-date-header-wrap table tr td:nth-child(5)').getAttribute('data-date'), 10));
            hijriObject = HijriParser.getHijriDate(lastDate) as { [key: string]: Object };
            expect(hijriObject.date).toEqual(5);
            expect(hijriObject.month).toEqual(5);
            expect(hijriObject.year).toEqual(1440);
        });
        it('checking gregorian date', () => {
            schObj.calendarMode = 'Gregorian';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">7</div>');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('January 07 - 11, 2019');
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).
                toEqual('<span>12:00 AM</span>');
        });
    });
    describe('Islamic in Month view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({
                selectedDate: new Date('9/12/2018'),
                calendarMode: 'Islamic',
                currentView: 'Month'
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-month-view')).toBeTruthy();
        });
        it('elements count', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap tr td').length).toBe(35);
        });
        it('(Muharram1440) month element checking', () => {
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Muharram 1440');
            expect(schObj.element.querySelectorAll('tr td.e-other-month').length).toBe(6);
        });
        it('(Safar1440) month element checking', () => {
            schObj.selectedDate = new Date(2018, 9, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Safar 1440');
            expect(schObj.element.querySelectorAll('tr td.e-other-month').length).toBe(5);
        });

        it('(Rabiʻ I1440) month element checking', () => {
            schObj.selectedDate = new Date(2018, 10, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Rabiʻ I 1440');
            expect(schObj.element.querySelectorAll('tr td.e-other-month').length).toBe(6);
        });
        it('(Rabiʻ II1440) month element checking', () => {
            schObj.selectedDate = new Date(2018, 11, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Rabiʻ II 1440');
            expect(schObj.element.querySelectorAll('tr td.e-other-month').length).toBe(12);
        });
        it('(Jumada I1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 0, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Jumada I 1440');
            expect(schObj.element.querySelectorAll('tr td.e-other-month').length).toBe(5);
        });
        it('(Jumada II1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 1, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Jumada II 1440');
            expect(schObj.element.querySelectorAll('tr td.e-other-month').length).toBe(5);
        });
        it('(Rajab1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 2, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Rajab 1440');
            expect(schObj.element.querySelectorAll('tr td.e-other-month').length).toBe(6);
        });
        it('(Shaʻban1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 3, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Shaʻban 1440');
            expect(schObj.element.querySelectorAll('tr td.e-other-month').length).toBe(12);
        });
        it('(Ramadan1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 4, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Ramadan 1440');
            expect(schObj.element.querySelectorAll('tr td.e-other-month').length).toBe(6);
        });
        it('(Shawwal1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 5, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Shawwal 1440');
            expect(schObj.element.querySelectorAll('tr td.e-other-month').length).toBe(5);
        });
        it('(Dhuʻl-Qiʻdah1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 6, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Dhuʻl-Qiʻdah 1440');
            expect(schObj.element.querySelectorAll('tr td.e-other-month').length).toBe(6);
        });
        it('(Dhuʻl-Hijjah1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 7, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Dhuʻl-Hijjah 1440');
            expect(schObj.element.querySelectorAll('tr td.e-other-month').length).toBe(6);
        });
        it('checking gregorian date', () => {
            schObj.calendarMode = 'Gregorian';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('August 2019');
            expect(schObj.element.querySelectorAll('tr td.e-other-month').length).toBe(4);
        });
    });
    describe('Islamic in Timeline Month view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({
                selectedDate: new Date('9/12/2018'),
                calendarMode: 'Islamic',
                views: [
                    { option: 'TimelineMonth' }
                ],
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-month-view')).toBeTruthy();
        });
        it('(Muharram1440) month element checking', () => {
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Muharram 1440');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toBe(29);
        });
        it('(Safar1440) month element checking', () => {
            schObj.selectedDate = new Date(2018, 9, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Safar 1440');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toBe(30);
        });

        it('(Rabiʻ I1440) month element checking', () => {
            schObj.selectedDate = new Date(2018, 10, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Rabiʻ I 1440');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toBe(29);
        });
        it('(Rabiʻ II1440) month element checking', () => {
            schObj.selectedDate = new Date(2018, 11, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Rabiʻ II 1440');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toBe(30);
        });
        it('(Jumada I1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 0, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Jumada I 1440');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toBe(30);
        });
        it('(Jumada II1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 1, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Jumada II 1440');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toBe(30);
        });
        it('(Rajab1440) month element checking', () => {
            schObj.selectedDate =new Date(2019, 2, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Rajab 1440');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toBe(29);
        });
        it('(Shaʻban1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 3, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Shaʻban 1440');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toBe(30);
        });
        it('(Ramadan1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 4, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Ramadan 1440');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toBe(29);
        });
        it('(Shawwal1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 5, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Shawwal 1440');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toBe(30);
        });
        it('(Dhuʻl-Qiʻdah1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 6, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Dhuʻl-Qiʻdah 1440');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toBe(29);
        });
        it('(Dhuʻl-Hijjah1440) month element checking', () => {
            schObj.selectedDate = new Date(2019, 7, 10);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Dhuʻl-Hijjah 1440');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toBe(29);
        });
        it('checking leap year', () => {
            schObj.selectedDate = new Date(2021, 5, 12);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Dhuʻl-Qiʻdah 1442');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toBe(30);
        });
        it('checking gregorian date', () => {
            schObj.calendarMode = 'Gregorian';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('June 2021');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toBe(30);
        });
    });
});
