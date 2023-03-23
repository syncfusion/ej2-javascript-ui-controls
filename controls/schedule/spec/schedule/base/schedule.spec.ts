/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Schedule base spec
 */
import { createElement, remove, L10n, EmitType, Browser, isVisible } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { VerticalView } from '../../../src/schedule/renderer/vertical-view';
import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, MonthAgenda, ScheduleModel, TimelineViews, TimelineMonth, Timezone, resetTime
} from '../../../src/schedule/index';
import * as util from '../util.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { readonlyEventsData, defaultData, tooltipData } from './datasource.spec';
import { EJ2Instance } from '../../../src/schedule/base/interface';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DateTimePicker } from '@syncfusion/ej2-calendars';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth);

describe('Schedule base module', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Default functionalities', () => {
        let schObj: Schedule;
        beforeAll(() => {
            schObj = util.createSchedule({}, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('control class testing', () => {
            expect(document.getElementById('Schedule').classList.contains('e-schedule')).toEqual(true);
        });

        it('get component name testing', () => {
            expect(schObj.getModuleName()).toEqual('schedule');
        });

        it('enable RTL testing', () => {
            schObj.enableRtl = true;
            schObj.dataBind();
            expect(schObj.element.classList.contains('e-rtl')).toBeTruthy();
        });

        it('disable RTL testing', () => {
            schObj.enableRtl = false;
            schObj.dataBind();
            expect(schObj.element.classList.contains('e-rtl')).toBeFalsy();
        });

        it('vertical view module name testing', () => {
            const verticalObj: VerticalView = new VerticalView(schObj);
            expect((verticalObj as any).getModuleName()).toEqual('verticalView');
        });
    });

    describe('Locale', () => {
        let schObj: Schedule;
        L10n.load({
            'vi': {
                'schedule': {
                    'day': 'Ngày',
                    'week': 'Tuần',
                    'workWeek': 'Tuần làm việc',
                    'month': 'tháng',
                    'agenda': 'chương trình nghị sự',
                    'today': 'Hôm nay',
                    'noEvents': 'Không có Sự kiện'
                }
            },
            'zh': {
                'schedule': {
                    'day': '天',
                    'week': '周',
                    'workWeek': '工作周',
                    'month': '月',
                    'agenda': '议程',
                    'today': '今天',
                    'noEvents': '没有事件'
                }
            }
        });
        beforeEach((): void => {
            schObj = undefined;
            document.body.appendChild(createElement('div', { id: 'Schedule' }));
        });
        afterEach((): void => {
            util.destroy(schObj);
        });

        it('vietnamese test case', () => {
            util.loadCultureFiles('vi');
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), locale: 'vi' }, '#Schedule');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('01 - 07 Tháng 10 2017');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-day .e-tbar-btn-text').innerHTML).
                toEqual('Ngày');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-week .e-tbar-btn-text').innerHTML).
                toEqual('Tuần');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-work-week .e-tbar-btn-text').innerHTML).
                toEqual('Tuần làm việc');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-month .e-tbar-btn-text').innerHTML).
                toEqual('tháng');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-agenda .e-tbar-btn-text').innerHTML).
                toEqual('chương trình nghị sự');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-today .e-tbar-btn-text').innerHTML).
                toEqual('Hôm nay');

            schObj.selectedDate = new Date(2017, 10, 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('29 Thg 10 - 04 Thg 11 2017');

            schObj.selectedDate = new Date(2019, 0, 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('30 Thg 12 2018 - 05 Thg 1 2019');

            schObj.selectedDate = new Date(2017, 9, 4);
            schObj.dataBind();

            schObj.locale = 'en-US';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 01 - 07, 2017');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-day .e-tbar-btn-text').innerHTML).
                toEqual('Day');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-week .e-tbar-btn-text').innerHTML).
                toEqual('Week');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-work-week .e-tbar-btn-text').innerHTML).
                toEqual('Work Week');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-month .e-tbar-btn-text').innerHTML).
                toEqual('Month');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-agenda .e-tbar-btn-text').innerHTML).
                toEqual('Agenda');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-today .e-tbar-btn-text').innerHTML).
                toEqual('Today');
        });

        it('chinese test case', () => {
            util.loadCultureFiles('zh');
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), locale: 'zh' }, '#Schedule');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('2017年10月1日 - 2017年10月7日');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-day .e-tbar-btn-text').innerHTML).
                toEqual('天');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-week .e-tbar-btn-text').innerHTML).
                toEqual('周');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-work-week .e-tbar-btn-text').innerHTML).
                toEqual('工作周');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-month .e-tbar-btn-text').innerHTML).
                toEqual('月');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-agenda .e-tbar-btn-text').innerHTML).
                toEqual('议程');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-today .e-tbar-btn-text').innerHTML).
                toEqual('今天');

            schObj.selectedDate = new Date(2017, 10, 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('2017年10月29日 - 2017年11月4日');

            schObj.selectedDate = new Date(2019, 0, 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('2018年12月30日 - 2019年1月5日');

            schObj.selectedDate = new Date(2017, 9, 4);
            schObj.dataBind();

            schObj.locale = 'en-US';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 01 - 07, 2017');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-day .e-tbar-btn-text').innerHTML).
                toEqual('Day');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-week .e-tbar-btn-text').innerHTML).
                toEqual('Week');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-work-week .e-tbar-btn-text').innerHTML).
                toEqual('Work Week');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-month .e-tbar-btn-text').innerHTML).
                toEqual('Month');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-agenda .e-tbar-btn-text').innerHTML).
                toEqual('Agenda');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-today .e-tbar-btn-text').innerHTML).
                toEqual('Today');
        });
    });

    describe('Window resize', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            document.body.appendChild(createElement('div', { id: 'Schedule' }));
        });
        afterEach((): void => {
            util.destroy(schObj);
        });

        it('desktop to mobile', () => {
            document.getElementById('Schedule').style.width = '600px';
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), width: '600px' });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-week-view').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-week-agenda-view').length).toEqual(0);
            schObj.element.style.width = '300px';
            (schObj as any).onScheduleResize();
            expect(schObj.element.querySelectorAll('.e-week-view').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-week-agenda-view').length).toEqual(0);
        });

        it('desktop to mobile - month view testing', (done: DoneFn) => {
            document.getElementById('Schedule').style.width = '600px';
            schObj = new Schedule({
                selectedDate: new Date(2017, 9, 4),
                width: '600px', currentView: 'Month',
                dataBound: () => {
                    expect((<HTMLElement>schObj.element.querySelector('.e-work-cells')).offsetWidth).toEqual(43);
                    done();
                }
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-active-view').classList.contains('e-month')).toEqual(true);
            expect((<HTMLElement>schObj.element.querySelector('.e-work-cells')).offsetWidth).toBeGreaterThanOrEqual(85);
            schObj.element.style.width = '300px';
            (schObj as any).onScheduleResize();
        });

        it('mobile to desktop', () => {
            document.getElementById('Schedule').style.width = '300px';
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), width: '300px' });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-week-view').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-week-agenda-view').length).toEqual(0);
            schObj.element.style.width = '600px';
            (schObj as any).onScheduleResize();
            expect(schObj.element.querySelectorAll('.e-week-view').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-week-agenda-view').length).toEqual(0);
        });
    });

    describe('Views and current view', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            document.body.appendChild(createElement('div', { id: 'Schedule' }));
        });
        afterEach((): void => {
            util.destroy(schObj);
        });

        it('same view change in headerbar', () => {
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4) });
            schObj.appendTo('#Schedule');
            let viewElement: HTMLElement = schObj.element.querySelector('.e-toolbar-item.e-active-view');
            expect(viewElement.classList.contains('e-week')).toEqual(true);
            viewElement.click();
            viewElement = schObj.element.querySelector('.e-toolbar-item.e-active-view');
            expect(viewElement.classList.contains('e-week')).toEqual(true);
        });

        it('view', () => {
            schObj = new Schedule({
                selectedDate: new Date(2017, 9, 4),
                views: [{ option: 'Day', isSelected: true }, { option: 'Week' }, { option: 'Month' }]
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(8);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
            schObj.views = ['Day', 'Week'];
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(7);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
        });

        it('currentView', () => {
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), views: ['Day', 'Week', 'Month'] });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
            schObj.currentView = 'Month';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
        });

        it('currentView not in views list', () => {
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), views: ['Day', 'Month'], currentView: 'Week' });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
        });

        it('currentView not in views list - setmodel checking', () => {
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4) });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-views').length).toEqual(5);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
            schObj.views = ['Agenda', 'Month'];
            schObj.currentView = 'Agenda';
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-views').length).toEqual(2);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-agenda');
            schObj.currentView = 'Day';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-agenda');
        });

        it('same view with different intervals', () => {
            schObj = new Schedule({
                selectedDate: new Date(2017, 9, 4),
                views: [
                    { option: 'Day', isSelected: true },
                    { option: 'Day', interval: 5, displayName: '5 Days' }
                ],
                currentView: 'Week'
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-views').length).toEqual(2);
        });

        it('dateFormat - setmodel testing', () => {
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), currentView: 'Month', dateFormat: 'MMM yy' });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(1);
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 17');
            expect(schObj.firstDayOfWeek).toEqual(0);
            expect((<HTMLElement>schObj.element.querySelector('.e-header-cells')).innerHTML).toEqual('<span>Sunday</span>');
            schObj.showHeaderBar = false;
            schObj.dataBind();
            schObj.dateFormat = 'MMM yyyy';
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(0);
            schObj.firstDayOfWeek = 1;
            schObj.dataBind();
            expect((<HTMLElement>schObj.element.querySelector('.e-header-cells')).innerHTML).toEqual('<span>Monday</span>');
            schObj.enableRtl = true;
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(0);
        });

        it('selectedDate - setmodel testing', () => {
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), currentView: 'Month' }, '#Schedule');
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(1);
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 2017');
            schObj.showHeaderBar = false;
            schObj.dataBind();
            schObj.selectedDate = new Date(2018, 3, 1);
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(0);
        });

        it('selectedDate - with minDate and maxDate', () => {
            schObj = new Schedule({
                minDate: new Date(2017, 9, 3),
                selectedDate: new Date(2017, 9, 4),
                maxDate: new Date(2017, 9, 5),
                currentView: 'Week'
            });
            schObj.appendTo('#Schedule');
            expect(schObj.selectedDate).toEqual(new Date(2017, 9, 4));
            schObj.selectedDate = new Date(2017, 8, 1);
            schObj.dataBind();
            expect(schObj.selectedDate).toEqual(new Date(2017, 9, 3));
            schObj.selectedDate = new Date(2017, 10, 1);
            schObj.dataBind();
            expect(schObj.selectedDate).toEqual(new Date(2017, 9, 5));
        });

        it('Test visibility of selected date from calendar', () => {
            schObj = new Schedule({
                selectedDate: new Date(2017, 9, 4), currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek']
            });
            schObj.appendTo('#Schedule');
            schObj.dataBind();
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            const calendarEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-calendar');
            (calendarEle.querySelector('.e-day') as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            (calendarEle.querySelector('.e-selected') as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            expect(calendarEle.querySelector('.e-header').classList.contains('e-month')).toEqual(true);
            util.triggerMouseEvent(calendarEle.querySelector('.e-next') as HTMLElement, 'mousedown');
            (schObj.element.querySelectorAll('.e-content.e-month tr:last-child td')[2] as HTMLElement).click();
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-content.e-month tr:last-child td:nth-last-child(5) span').innerHTML).toEqual('31');
            expect(resetTime(new Date(+schObj.selectedDate))).toEqual(new Date(2017, 9, 31));
            expect((schObj.element.querySelector('.e-content-wrap') as HTMLElement).scrollLeft).toEqual(5700);
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            (calendarEle.querySelector('.e-day') as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            (calendarEle.querySelector('.e-selected').nextSibling as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            expect(calendarEle.querySelector('.e-header').classList.contains('e-month')).toEqual(true);
            (schObj.element.querySelectorAll('.e-content.e-month tr:nth-last-child(4) td')[5] as HTMLElement).click();
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-content.e-month tr:nth-last-child(4) td:nth-last-child(2) span').innerHTML)
                .toEqual('17');
            expect(resetTime(new Date(+schObj.selectedDate))).toEqual(new Date(2017, 10, 17));
            expect((schObj.element.querySelector('.e-content-wrap') as HTMLElement).scrollLeft).toEqual(12900);
        });

        it('currentView not in views list - direct rendering checking', () => {
            schObj = new Schedule({
                selectedDate: new Date(2019, 11, 5),
                currentView: 'TimelineMonth',
                showHeaderBar: false,
                views: [
                    { option: 'Day' },
                    { option: 'Week' },
                    { option: 'Month' }
                ]
            });
            schObj.appendTo('#Schedule');
            expect(schObj.selectedDate).toEqual(new Date(2019, 11, 5));
            expect(schObj.currentView).toEqual('Day');
        });

        it('currentView not in views list - direct not rendering checking', () => {
            schObj = new Schedule({
                selectedDate: new Date(2019, 11, 5),
                currentView: 'TimelineYear',
                views: [{ option: 'TimelineMonth' }, { option: 'TimelineYear' }]
            });
            schObj.appendTo('#Schedule');
            expect(schObj.selectedDate).toEqual(new Date(2019, 11, 5));
            expect(schObj.element.querySelector('.e-active-view').classList.contains('e-timeline-year')).toEqual(true);
        });
    });

    describe('Current time indicator', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            document.body.appendChild(createElement('div', { id: 'Schedule' }));
            jasmine.clock().install();
        });
        afterEach((): void => {
            util.destroy(schObj);
            jasmine.clock().uninstall();
        });

        it('disable', () => {
            schObj = new Schedule({ showTimeIndicator: false });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-current-time').length).toEqual(0);
            expect(schObj.weekModule.currentTimeIndicatorTimer).toBeUndefined();
        });

        it('property change to false', () => {
            schObj = new Schedule({ showTimeIndicator: true });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-current-time').length).toEqual(1);
            const currentTime: Date = schObj.getCurrentTime();
            const interval: number = 60000 - currentTime.getSeconds() * 1000 + currentTime.getMilliseconds();
            jasmine.clock().tick(interval);
            expect(schObj.element.querySelectorAll('.e-current-time').length).toEqual(1);
            jasmine.clock().tick(60000);
            expect(schObj.element.querySelectorAll('.e-current-time').length).toEqual(1);
            schObj.showTimeIndicator = false;
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-current-time').length).toEqual(0);
            expect(schObj.weekModule.currentTimeIndicatorTimer).toBeNull();
        });

        it('property change to true', () => {
            schObj = new Schedule({ showTimeIndicator: false });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-current-time').length).toEqual(0);
            expect(schObj.weekModule.currentTimeIndicatorTimer).toBeUndefined();
            schObj.showTimeIndicator = true;
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-current-time').length).toEqual(1);
            expect(schObj.weekModule.currentTimeIndicatorTimer).not.toBeNull();
        });

        it('exception scenario property in month view', () => {
            schObj = new Schedule({ currentView: 'Month' });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-current-time').length).toEqual(0);
            schObj.showTimeIndicator = false;
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-current-time').length).toEqual(0);
        });

        it('showTimeIndicator - setmodel testing', () => {
            schObj = new Schedule({ selectedDate: new Date() }, '#Schedule');
            expect(schObj.element.querySelectorAll('.e-current-timeline').length).toEqual(1);
            schObj.timeScale = { enable: false };
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-current-timeline').length).toEqual(0);
            schObj.showTimeIndicator = false;
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-current-timeline').length).toEqual(0);
        });
    });

    describe('Persistence', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            document.body.appendChild(createElement('div', { id: 'Schedule1' }));
        });
        afterEach((): void => {
            util.destroy(schObj);
        });

        it('enablePersistence with true', () => {
            schObj = new Schedule({ enablePersistence: true, currentView: 'Month', selectedDate: new Date(2017, 9, 4) });
            schObj.appendTo('#Schedule1');
            schObj.destroy();
            schObj = new Schedule({ enablePersistence: true });
            schObj.appendTo('#Schedule1');
            expect(schObj.selectedDate.toDateString()).toBe(new Date(2017, 9, 4).toDateString());
            expect(schObj.currentView).toBe('Month');
        });

        it('enablePersistence with false', () => {
            schObj = new Schedule({ enablePersistence: false });
            schObj.appendTo('#Schedule1');
            expect(schObj.selectedDate.toDateString()).toBe(new Date().toDateString());
            expect(schObj.currentView).toBe('Week');
        });
    });

    describe('Css class', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            document.body.appendChild(createElement('div', { id: 'Schedule' }));
        });
        afterEach((): void => {
            util.destroy(schObj);
        });
        it('cssClass at initial', () => {
            schObj = new Schedule({ cssClass: 'myCustomClass' });
            schObj.appendTo('#Schedule');
            expect(schObj.element.classList.contains('myCustomClass')).toEqual(true);
        });
        it('cssClass at property change', () => {
            schObj = new Schedule();
            schObj.appendTo('#Schedule');
            schObj.cssClass = 'myCustomClass';
            schObj.dataBind();
            expect(schObj.element.classList.contains('myCustomClass')).toEqual(true);
        });
        it('update cssClass', () => {
            schObj = new Schedule({ cssClass: 'myCustomClass1' });
            schObj.appendTo('#Schedule');
            expect(schObj.element.classList.contains('myCustomClass1')).toEqual(true);
            schObj.cssClass = 'myCustomClass2';
            schObj.dataBind();
            expect(schObj.element.classList.contains('myCustomClass1')).toEqual(false);
            expect(schObj.element.classList.contains('myCustomClass2')).toEqual(true);
            schObj.cssClass = null;
            schObj.dataBind();
            expect(schObj.element.classList.contains('myCustomClass2')).toEqual(false);
        });
    });

    describe('Width and Height', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            document.body.appendChild(createElement('div', { id: 'Schedule' }));
        });
        afterEach((): void => {
            util.destroy(schObj);
        });
        it('default auto width and height', () => {
            schObj = new Schedule();
            schObj.appendTo('#Schedule');
            expect(document.getElementById('Schedule').style.width).toEqual('auto');
            expect(document.getElementById('Schedule').style.height).toEqual('auto');
        });
        it('width and height in percentage', () => {
            schObj = new Schedule({ height: '100%', width: '100%' });
            schObj.appendTo('#Schedule');
            expect(document.getElementById('Schedule').style.width).toEqual('100%');
            expect(document.getElementById('Schedule').style.height).toEqual('100%');
        });
        it('width and height in pixel', () => {
            schObj = new Schedule({ height: '600px', width: '500px' });
            schObj.appendTo('#Schedule');
            expect(document.getElementById('Schedule').style.width).toEqual('500px');
            expect(document.getElementById('Schedule').style.height).toEqual('600px');
            expect(document.getElementById('Schedule').offsetWidth).toEqual(500);
            expect(document.getElementById('Schedule').offsetHeight).toEqual(600);
        });
        it('width and height in number', () => {
            schObj = new Schedule({ height: 600, width: 600 });
            schObj.appendTo('#Schedule');
            expect(document.getElementById('Schedule').style.width).toEqual('600px');
            expect(document.getElementById('Schedule').style.height).toEqual('600px');
        });
        it('width and height through setmodel', () => {
            schObj = new Schedule({ height: '600px', width: '500px' });
            schObj.appendTo('#Schedule');
            expect(document.getElementById('Schedule').style.width).toEqual('500px');
            expect(document.getElementById('Schedule').style.height).toEqual('600px');
            schObj.width = 800;
            schObj.dataBind();
            expect(document.getElementById('Schedule').style.width).toEqual('800px');
            expect(document.getElementById('Schedule').style.height).toEqual('600px');
            schObj.height = 700;
            schObj.dataBind();
            expect(document.getElementById('Schedule').style.width).toEqual('800px');
            expect(document.getElementById('Schedule').style.height).toEqual('700px');
        });
    });

    describe('Scroll', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const model: ScheduleModel = { height: '600px', eventSettings: { fields: { subject: { name: 'Title' } } } };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check scroll content', () => {
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            const timeCellsArea: HTMLElement = schObj.element.querySelector('.e-time-cells-wrap') as HTMLElement;
            util.triggerScrollEvent(contentArea, 400);
            expect(contentArea.scrollTop).toEqual(400);
            expect(timeCellsArea.scrollTop).toEqual(400);
        });
    });

    describe('changeCurrentView', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const model: ScheduleModel = {
                height: '600px',
                views: [
                    { option: 'Day', isSelected: true },
                    { option: 'Day', interval: 2, displayName: '2 Days' },
                    { option: 'Week' },
                    { option: 'Week', interval: 2, displayName: '2 Weeks' },
                    { option: 'WorkWeek' },
                    { option: 'WorkWeek', interval: 2, displayName: '2 WorkWeeks' },
                    { option: 'Month' },
                    { option: 'Month', interval: 2, displayName: '2 Months' }
                ]
            };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking views change', () => {
            expect(schObj.viewCollections.length).toEqual(8);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
            schObj.changeCurrentView('Month', 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
            expect((schObj.element.querySelector('.e-active-view') as HTMLElement).innerText.toUpperCase()).toContain('2 MONTHS');
            schObj.changeCurrentView('WorkWeek');
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-work-week');
            expect((schObj.element.querySelector('.e-active-view') as HTMLElement).innerText.toUpperCase()).toContain('WORK WEEK');
            schObj.changeCurrentView('Week', 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
            expect((schObj.element.querySelector('.e-active-view') as HTMLElement).innerText.toUpperCase()).toContain('2 WEEKS');
        });
    });

    describe('Event Settings', () => {
        let schObj: Schedule;
        const eventObj: Record<string, any>[] = [{
            'Subject': 'test event',
            'StartTime': new Date(2017, 10, 6, 10),
            'EndTime': new Date(2017, 10, 6, 12)
        }];
        beforeAll((done: DoneFn): void => {
            const model: ScheduleModel = { height: '500px', width: '500px', selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, eventObj, done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('check events', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(1);
        });
        it('change dataSource, query, fields through setmodel', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(2);
                done();
            };
            schObj.eventSettings = {
                dataSource: [{
                    'Title': 'test event 1',
                    'Start': new Date(2017, 10, 6, 10),
                    'End': new Date(2017, 10, 6, 12)
                },
                {
                    'Title': 'test event 2',
                    'Start': new Date(2017, 10, 6, 13),
                    'End': new Date(2017, 10, 6, 14)
                },
                {
                    'Title': 'test event 3',
                    'Start': new Date(2017, 10, 6, 15),
                    'End': new Date(2017, 10, 6, 16)
                }],
                query: new Query().take(2),
                fields: {
                    subject: { name: 'Title' },
                    startTime: { name: 'Start' },
                    endTime: { name: 'End' }
                }
            };
            schObj.dataBind();
        });
    });

    describe('Testing event setting fields', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '600px',
                eventSettings: {
                    fields: {
                        subject: { default: 'Default Subject' },
                        location: { default: 'Default Location' },
                        description: { default: 'Default Description' }
                    }
                }
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('default values', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]');
                eventElement.click();
                const eventPopup: HTMLElement = document.querySelector('.' + cls.EVENT_POPUP_CLASS);
                expect(eventPopup).toBeTruthy();
                expect(eventPopup.querySelector('.' + cls.SUBJECT_CLASS).innerHTML).toEqual('Default Subject');
                expect(eventPopup.querySelector('.' + cls.LOCATION_DETAILS_CLASS).innerHTML).toEqual('Default Location');
                expect(eventPopup.querySelector('.' + cls.DESCRIPTION_DETAILS_CLASS).innerHTML).toEqual('Default Description');
                (eventPopup.querySelector('.' + cls.CLOSE_CLASS) as HTMLElement).click();
                done();
            };
            const workCell: HTMLElement = schObj.element.querySelector('.e-work-hours');
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
        });
    });

    describe('showWeekNumber property testing', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            document.body.appendChild(createElement('div', { id: 'Schedule' }));
        });
        afterEach((): void => {
            util.destroy(schObj);
        });

        it('week view testing', (done: DoneFn) => {
            const dataBound: EmitType<Record<string, any>> = () => { done(); };
            schObj = new Schedule({
                height: '500px', width: '500px', selectedDate: new Date(2018, 3, 1),
                showWeekNumber: true, dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            const weekNumber: Element = schObj.element.querySelector('.e-left-indent-wrap .e-header-cells');
            expect(weekNumber.innerHTML).toEqual('<span title="Week 14">14</span>');
            expect(weekNumber.classList.contains('e-week-number')).toEqual(true);
            expect(weekNumber.children[0].getAttribute('title')).toEqual('Week 14');
        });

        it('month view testing', (done: DoneFn) => {
            const dataBound: EmitType<Record<string, any>> = () => { done(); };
            schObj = new Schedule({
                height: '500px', width: '500px', currentView: 'Month', selectedDate: new Date(2018, 3, 1),
                showWeekend: false, showWeekNumber: true, dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-week-number-wrapper').length).toEqual(1);
            const weekNumber: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-week-number-wrapper .e-week-number'));
            expect(weekNumber[0].innerHTML).toEqual('14');
            expect(weekNumber[0].getAttribute('title')).toEqual('Week 14');
            expect(weekNumber[1].innerHTML).toEqual('15');
            expect(weekNumber[1].getAttribute('title')).toEqual('Week 15');
            expect(weekNumber[2].innerHTML).toEqual('16');
            expect(weekNumber[2].getAttribute('title')).toEqual('Week 16');
            expect(weekNumber[3].innerHTML).toEqual('17');
            expect(weekNumber[3].getAttribute('title')).toEqual('Week 17');
            expect(weekNumber[4].innerHTML).toEqual('18');
            expect(weekNumber[4].getAttribute('title')).toEqual('Week 18');
        });

        it('month agenda view testing', (done: DoneFn) => {
            const dataBound: EmitType<Record<string, any>> = () => { done(); };
            schObj = new Schedule({
                height: '500px', width: '500px', currentView: 'MonthAgenda', views: ['MonthAgenda'],
                selectedDate: new Date(2018, 3, 1), showWeekNumber: true, dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            const weekNumber: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-week-number-wrapper .e-week-number'));
            expect(weekNumber[0].innerHTML).toEqual('14');
            expect(weekNumber[0].getAttribute('title')).toEqual('Week 14');
            expect(weekNumber[1].innerHTML).toEqual('15');
            expect(weekNumber[1].getAttribute('title')).toEqual('Week 15');
            expect(weekNumber[2].innerHTML).toEqual('16');
            expect(weekNumber[2].getAttribute('title')).toEqual('Week 16');
            expect(weekNumber[3].innerHTML).toEqual('17');
            expect(weekNumber[3].getAttribute('title')).toEqual('Week 17');
            expect(weekNumber[4].innerHTML).toEqual('18');
            expect(weekNumber[4].getAttribute('title')).toEqual('Week 18');
        });

        it('setmodel testing', (done: DoneFn) => {
            const dataBound: EmitType<Record<string, any>> = () => { done(); };
            schObj = new Schedule({
                height: '500px', width: '500px', selectedDate: new Date(2018, 3, 1),
                showWeekNumber: true, dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            let weekNumber: Element = schObj.element.querySelector('.e-left-indent-wrap .e-header-cells');
            expect(weekNumber.innerHTML).toEqual('<span title="Week 14">14</span>');
            expect(weekNumber.classList.contains('e-week-number')).toEqual(true);
            expect(weekNumber.children[0].getAttribute('title')).toEqual('Week 14');

            schObj.showWeekNumber = false;
            schObj.dataBind();
            weekNumber = schObj.element.querySelector('.e-left-indent-wrap .e-header-cells');
            expect(weekNumber.classList.contains('e-week-number')).toEqual(false);
            expect(weekNumber.getAttribute('title')).toBeNull();
        });
    });

    describe('Public methods', () => {
        let schObj: Schedule;
        const eventDatas: Record<string, any>[] = [{
            'Subject': 'test event',
            'StartTime': new Date(2017, 10, 6, 10),
            'EndTime': new Date(2017, 10, 6, 12)
        }, {
            'Subject': 'previous test event',
            'StartTime': new Date(2017, 8, 6, 10),
            'EndTime': new Date(2017, 8, 6, 12)
        }];
        beforeAll((done: DoneFn): void => {
            const model: ScheduleModel = { height: '500px', width: '500px', selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, eventDatas, done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });

        it('getEvents', () => {
            expect(schObj.getEvents().length).toEqual(2);
        });

        it('getCurrentViewEvents', () => {
            expect(schObj.getCurrentViewEvents().length).toEqual(1);
        });

        it('getCurrentViewDates', () => {
            expect(schObj.getCurrentViewDates().length).toEqual(7);
        });

        it('getEventDetails', () => {
            const element: Element = schObj.element.querySelector('.e-appointment');
            const eventObj: Record<string, any> = schObj.getEventDetails(element);
            expect(eventObj.Subject).toEqual('test event');
        });

        it('getEventDetails other than appointment element', () => {
            const element: Element = schObj.element.querySelector('.e-work-cells');
            const eventObj: Record<string, any> = schObj.getEventDetails(element);
            expect(Object.keys(eventObj).length).toEqual(0);
        });

        it('refreshEvents', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                done();
            };
            schObj.refreshEvents();
        });

        it('openEditor', () => {
            const element: Element = schObj.element.querySelector('.e-appointment');
            const eventObj: Record<string, any> = schObj.getEventDetails(element);
            schObj.openEditor(eventObj, 'Save');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('.e-event-cancel') as HTMLElement).click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('isSlotAvailable', () => {
            let availablity: boolean = schObj.isSlotAvailable(new Date(2017, 9, 30, 10, 0), new Date(2017, 9, 30, 11, 0));
            expect(availablity).toEqual(true);
            availablity = schObj.isSlotAvailable(new Date(2017, 10, 6, 10, 0), new Date(2017, 10, 6, 11, 0));
            expect(availablity).toEqual(false);
        });

        it('getStartEndTime with valid time format', () => {
            expect(schObj.getStartEndTime('08:30')).toEqual(new Date(new Date().setHours(8, 30, 0, 0)));
        });
        it('getStartEndTime with empty value', () => {
            expect(schObj.getStartEndTime('')).toEqual(null);
        });
        it('getStartEndTime with null value', () => {
            expect(schObj.getStartEndTime(null)).toEqual(null);
        });
        it('getStartEndTime with invalid time format', () => {
            expect(schObj.getStartEndTime('08')).toEqual(new Date(new Date().setHours(0, 0, 0, 0)));
        });
        it('block events public method testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.getBlockEvents().length).toEqual(2);
                const start: Date = schObj.activeView.startDate();
                const end: Date = schObj.activeView.endDate();
                expect(schObj.getBlockEvents(start, end, false).length).toEqual(2);
                expect(schObj.getBlockEvents(start, end, true).length).toEqual(6);
                done();
            };
            const eventDatas: Record<string, any>[] = [{
                'Subject': 'test event',
                'StartTime': new Date(2017, 10, 6, 9),
                'EndTime': new Date(2017, 10, 6, 10, 30),
                'IsBlock': true
            }, {
                'Subject': 'previous test event',
                'StartTime': new Date(2017, 10, 6, 12),
                'EndTime': new Date(2017, 10, 6, 13, 30),
                'RecurrenceRule': 'FREQ=DAILY;INTERVAL=1;COUNT=5',
                'IsBlock': true
            }];
            schObj.eventSettings.dataSource = eventDatas;
            schObj.dataBind();
        });

        it('openQuickInfoPopup - Event', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventObj: Record<string, any> = {
                    Id: 2,
                    Subject: 'Event',
                    StartTime: new Date(2017, 10, 5, 13),
                    EndTime: new Date(2017, 10, 5, 14),
                    IsAllDay: false
                };
                schObj.openQuickInfoPopup(eventObj);
                const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
                expect(eventPopup.classList).toContain('e-popup-open');
                expect(eventPopup.querySelector('.e-date-time-details').innerHTML).toEqual('November 5, 2017 (1:00 PM&nbsp;-&nbsp;2:00 PM)');
                expect(eventPopup.querySelector('.e-subject').innerHTML).toEqual('Event');
                (<HTMLElement>eventPopup.querySelector('.e-close')).click();
                done();
            };
            const eventData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Recurring Event',
                StartTime: new Date(2017, 10, 5, 10),
                EndTime: new Date(2017, 10, 5, 11, 30),
                IsAllDay: false,
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10'
            },
            {
                Id: 2,
                Subject: 'Event',
                StartTime: new Date(2017, 10, 5, 13),
                EndTime: new Date(2017, 10, 5, 14),
                IsAllDay: false
            }];
            schObj.eventSettings.dataSource = eventData;
            schObj.dataBind();
        });

        it('openQuickInfoPopup - Recurring Event', () => {
            const eventObj: Record<string, any> = {
                Id: 1,
                Subject: 'Recurring Event',
                StartTime: new Date(2017, 10, 6, 10),
                EndTime: new Date(2017, 10, 6, 11, 30),
                IsAllDay: false,
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10'
            };
            schObj.openQuickInfoPopup(eventObj);
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            expect(eventPopup.querySelector('.e-date-time-details').innerHTML).toEqual('November 6, 2017 (10:00 AM&nbsp;-&nbsp;11:30 AM)');
            expect(eventPopup.querySelector('.e-subject').innerHTML).toEqual('Recurring Event');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('openQuickInfoPopup - Cell', () => {
            const eventObj: Record<string, any> = { StartTime : new Date(2017, 10, 6, 10), EndTime: new Date(2017, 10, 6, 11) };
            schObj.openQuickInfoPopup(eventObj);
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            expect(eventPopup.querySelector('.e-date-time-details').innerHTML).toEqual('November 6, 2017 (10:00 AM&nbsp;-&nbsp;11:00 AM)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('openQuickInfoPopup - in Timeline views for cells', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventObj: Record<string, any> = { StartTime: new Date(2017, 10, 6, 10), EndTime: new Date(2017, 10, 6, 11)};
                schObj.openQuickInfoPopup(eventObj);
                const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
                expect(eventPopup.classList).toContain('e-popup-open');
                expect(eventPopup.querySelector('.e-date-time-details').innerHTML).toEqual('November 6, 2017 (10:00 AM&nbsp;-&nbsp;11:00 AM)');
                (<HTMLElement>eventPopup.querySelector('.e-close')).click();
                schObj.currentView = 'TimelineMonth';
                schObj.dataBind();
                schObj.openQuickInfoPopup(eventObj);
                expect(eventPopup.classList).toContain('e-popup-open');
                expect(eventPopup.querySelector('.e-date-time-details').innerHTML).toEqual('November 6, 2017 (10:00 AM&nbsp;-&nbsp;11:00 AM)');
                (<HTMLElement>eventPopup.querySelector('.e-close')).click();
                schObj.currentView = 'TimelineYear';
                schObj.dataBind();
                schObj.openQuickInfoPopup(eventObj);
                expect(eventPopup.classList).toContain('e-popup-open');
                expect(eventPopup.querySelector('.e-date-time-details').innerHTML).toEqual('November 6, 2017 (10:00 AM&nbsp;-&nbsp;11:00 AM)');
                (<HTMLElement>eventPopup.querySelector('.e-close')).click();
                done();
            };
            schObj.views = ['TimelineDay', 'TimelineMonth', 'TimelineYear'];
            schObj.currentView = 'TimelineDay';
            schObj.dataBind();
        });

        it('openQuickInfoPopup - in Timeline day view for events', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventObj: Record<string, any> = {
                    Id: 1,
                    Subject: 'Recurring Event',
                    StartTime: new Date(2017, 10, 6, 10),
                    EndTime: new Date(2017, 10, 6, 11, 30),
                    IsAllDay: false,
                    RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10'
                };
                schObj.openQuickInfoPopup(eventObj);
                const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
                expect(eventPopup.classList).toContain('e-popup-open');
                expect(eventPopup.querySelector('.e-date-time-details').innerHTML).toEqual('November 6, 2017 (10:00 AM&nbsp;-&nbsp;11:30 AM)');
                expect(eventPopup.querySelector('.e-subject').innerHTML).toEqual('Recurring Event');
                (<HTMLElement>eventPopup.querySelector('.e-close')).click();
                done();
            };
            schObj.currentView = 'TimelineDay';
            schObj.dataBind();
        });
        it('openQuickInfoPopup - in TimeineYear view for events', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventObj: Record<string, any> = {
                    Id: 1,
                    Subject: 'Recurring Event',
                    StartTime: new Date(2017, 10, 6, 10),
                    EndTime: new Date(2017, 10, 6, 11, 30),
                    IsAllDay: false,
                    RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10'
                };
                schObj.openQuickInfoPopup(eventObj);
                const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
                expect(eventPopup.classList).toContain('e-popup-open');
                expect(eventPopup.querySelector('.e-date-time-details').innerHTML).toEqual('November 6, 2017 (10:00 AM&nbsp;-&nbsp;11:30 AM)');
                expect(eventPopup.querySelector('.e-subject').innerHTML).toEqual('Recurring Event');
                (<HTMLElement>eventPopup.querySelector('.e-close')).click();
                done();
            };
            schObj.currentView = 'TimelineYear';
            schObj.dataBind();
        });
        it('openQuickInfoPopup - in Timeline Month view for events', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventObj: Record<string, any> = {
                    Id: 1,
                    Subject: 'Recurring Event',
                    StartTime: new Date(2017, 10, 6, 10),
                    EndTime: new Date(2017, 10, 6, 11, 30),
                    IsAllDay: false,
                    RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10'
                };
                schObj.openQuickInfoPopup(eventObj);
                const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
                expect(eventPopup.classList).toContain('e-popup-open');
                expect(eventPopup.querySelector('.e-date-time-details').innerHTML).toEqual('November 6, 2017 (10:00 AM&nbsp;-&nbsp;11:30 AM)');
                expect(eventPopup.querySelector('.e-subject').innerHTML).toEqual('Recurring Event');
                (<HTMLElement>eventPopup.querySelector('.e-close')).click();
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });

    });

    describe('Testing resetWorkHours without parameters in Vertical view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn): void => {
            const model: ScheduleModel = {
                height: '560px', width: '100%',
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2019, 5, 12)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('Checking cells that contain Work hours cells length before calling reset work hours method', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_HOURS_CLASS));
            expect(workCells.length).toEqual(90);
        });
        it('Checking cells that contain Work hours cells length after calling reset work hours method', () => {
            schObj.resetWorkHours();
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_HOURS_CLASS));
            expect(workCells.length).toEqual(0);
        });
    });

    describe('Testing resetWorkHours without parameters in Timeline view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn): void => {
            const model: ScheduleModel = {
                height: '560px', width: '100%',
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2019, 5, 12),
                currentView: 'TimelineWeek'
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('Checking cells that contain Work hours cells length before calling reset work hours method', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_HOURS_CLASS));
            expect(workCells.length).toEqual(90);
        });
        it('Checking cells that contain Work hours cells length after calling reset work hours method', () => {
            schObj.resetWorkHours();
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_HOURS_CLASS));
            expect(workCells.length).toEqual(0);
        });
    });

    describe('Testing resetWorkHours with parameteres in Vertical view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn): void => {
            const model: ScheduleModel = {
                height: '560px', width: '100%',
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2019, 5, 12)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('Checking Work hour class is avilable or not on particular cell', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
            expect(workCells[136].classList.contains('e-work-hours')).toEqual(true);
            expect(workCells[164].classList.contains('e-work-hours')).toEqual(true);
        });
        it('Removing the work cell class from the particular cell', () => {
            const dates: Date[] = [new Date(2019, 5, 12)];
            schObj.resetWorkHours(dates, '09:30', '12:00');
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
            expect(workCells[136].classList.contains('e-work-hours')).toEqual(false);
            expect(workCells[164].classList.contains('e-work-hours')).toEqual(false);
        });
    });

    describe('Testing resetWorkHours with parameteres in Timeline view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn): void => {
            const model: ScheduleModel = {
                height: '560px', width: '100%',
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2019, 5, 12),
                currentView: 'TimelineWeek'
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('Checking Work hour class is avilable or not on particular cell', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
            expect(workCells[163].classList.contains('e-work-hours')).toEqual(true);
            expect(workCells[166].classList.contains('e-work-hours')).toEqual(true);
        });
        it('Removing the work cell class from the particular cell', () => {
            const dates: Date[] = [new Date(2019, 5, 12)];
            schObj.resetWorkHours(dates, '09:30', '12:00');
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
            expect(workCells[163].classList.contains('e-work-hours')).toEqual(false);
            expect(workCells[166].classList.contains('e-work-hours')).toEqual(false);
        });
    });

    describe('Testing resetWorkHours on passing group index in Vertical view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn): void => {
            const model: ScheduleModel = {
                height: '560px', width: '100%',
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2019, 5, 12)
            };
            schObj = util.createGroupSchedule(2, model, [], done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('Checking the particular cell contains a work hour class or not', () => {
            const tableRows: NodeListOf<HTMLTableRowElement> = schObj.element.querySelectorAll('tr');
            expect(tableRows[80].children[10].classList.contains('e-work-hours')).toEqual(true);
            expect(tableRows[82].children[10].classList.contains('e-work-hours')).toEqual(true);
        });
        it('Removing work hour class from particular cell by calling resetWorkHours', () => {
            const dates: Date[] = [new Date(2019, 5, 12)];
            schObj.resetWorkHours(dates, '09:30', '12:00', 1);
            const tableRows: NodeListOf<HTMLTableRowElement> = schObj.element.querySelectorAll('tr');
            expect(tableRows[80].children[10].classList.contains('e-work-hours')).toEqual(false);
            expect(tableRows[82].children[10].classList.contains('e-work-hours')).toEqual(false);
        });
    });

    describe('Testing resetWorkHours on passing group index in Timeline view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn): void => {
            const model: ScheduleModel = {
                height: '560px', width: '100%',
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2019, 5, 12),
                currentView: 'TimelineWeek'
            };
            schObj = util.createGroupSchedule(2, model, [], done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('Checking the particular cell contains a work hour class or not', () => {
            const tableRows: NodeListOf<HTMLTableRowElement> = schObj.element.querySelectorAll('tr');
            expect(tableRows[11].children[163].classList.contains('e-work-hours')).toEqual(true);
            expect(tableRows[11].children[166].classList.contains('e-work-hours')).toEqual(true);
        });
        it('Removing work hour class from particular cell by calling resetWorkHours', () => {
            const dates: Date[] = [new Date(2019, 5, 12)];
            schObj.resetWorkHours(dates, '09:30', '12:00', 2);
            const tableRows: NodeListOf<HTMLTableRowElement> = schObj.element.querySelectorAll('tr');
            expect(tableRows[11].children[163].classList.contains('e-work-hours')).toEqual(false);
            expect(tableRows[11].children[166].classList.contains('e-work-hours')).toEqual(false);
        });
    });

    describe('CR Issue EJ2-16536 Schedule within hidden element', () => {
        let schObj: Schedule;
        const elem: HTMLElement = createElement('div', { id: 'Schedule' });
        const hiddenEle: HTMLElement = createElement('div', { styles: 'display:none' });
        hiddenEle.appendChild(elem);
        beforeAll((done: DoneFn) => {
            document.body.appendChild(hiddenEle);
            schObj = new Schedule({ dataBound: () => done() });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(hiddenEle);
        });
        it('control class testing', () => {
            expect(document.getElementById('Schedule').classList.contains('e-schedule')).toEqual(true);
        });
    });

    describe('EJ2-23004-24 hours format is not displaying in time cells in adaptive mode only', () => {
        let schObj: Schedule;
        const uA: string = Browser.userAgent;
        const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        util.loadCultureFiles('fr-CH');
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            const model: ScheduleModel = { height: '550px', width: '500px', locale: 'fr-CH', selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });
        it('Checking elements', () => {
            expect((schObj.element.querySelector('.e-time-cells-wrap tbody tr:nth-child(1) td') as HTMLElement).innerText).
                toEqual('0');
            expect((schObj.element.querySelector('.e-time-cells-wrap tbody tr:nth-child(3) td') as HTMLElement).innerText).
                toEqual('1');
            expect((schObj.element.querySelector('.e-time-cells-wrap tbody tr:nth-child(25) td') as HTMLElement).innerText).
                toEqual('12');
            expect((schObj.element.querySelector('.e-time-cells-wrap tbody tr:nth-child(27) td') as HTMLElement).innerText).
                toEqual('13');
            expect((schObj.element.querySelector('.e-time-cells-wrap tbody tr:nth-child(45) td') as HTMLElement).innerText).
                toEqual('22');
            expect((schObj.element.querySelector('.e-time-cells-wrap tbody tr:nth-child(47) td') as HTMLElement).innerText).
                toEqual('23');
        });
    });

    describe('CR Issue EJ2-26338 readonly events', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', width: '500px' };
            schObj = util.createSchedule(model, readonlyEventsData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Delete key', () => {
            keyModule = schObj.keyboardInteractionModule;
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            const selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            keyModule.keyActionHandler({ action: 'delete', target: selectedElement[0] });
            expect(schObj.quickPopup.quickPopup.element.querySelector('.e-edit').getAttribute('disabled')).toBe('');
            expect(schObj.quickPopup.quickPopup.element.querySelector('.e-delete').getAttribute('disabled')).toBe('');
            expect(schObj.quickPopup.quickPopup.element.querySelector('.e-close').getAttribute('disabled')).toBe(null);
            (<HTMLElement>schObj.quickPopup.quickPopup.element.querySelector('.e-close')).click();
        });
    });

    describe('Issue EJ2-30234 exposing getEventMaxID as public', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn): void => {
            const model: ScheduleModel = {
                height: '560px', width: '100%',
                views: ['Day'],
                selectedDate: new Date(2018, 1, 15),
                eventSettings: {
                    dataSource: [{
                        Id: 1,
                        Subject: 'Meeting',
                        StartTime: new Date(2018, 1, 15, 10, 0),
                        EndTime: new Date(2018, 1, 15, 12, 30)
                    }]
                }
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('Checking public method getEventMaxID functionality', () => {
            expect(schObj.getEventMaxID()).toEqual(2);
        });
    });

    describe('CR Issue EJ2-28683 recurrence appoinments', () => {
        let schObj: Schedule;
        const timeZone: Timezone = new Timezone();
        const data: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Paris',
            StartTime: timeZone.removeLocalOffset(new Date('2019-02-06T04:30:00.000Z')),
            EndTime: timeZone.removeLocalOffset(new Date('2019-02-06T06:00:00.000Z')),
            IsAllDay: false,
            RecurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=5,6,7;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=1'
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', width: '500px', selectedDate: new Date(2019, 6, 5),
                currentView: 'Month', views: ['Week', 'WorkWeek', 'Month']
            };
            schObj = util.createSchedule(model, data, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Check Aug 2019 Appointment', (done: DoneFn) => {
            schObj.dataBound = () => {
                const selector: string = `.e-work-cells[data-date="${new Date(2019, 7, 5).getTime()}"] .e-appointment`;
                expect(schObj.element.querySelector(selector)).not.toBeNull();
                done();
            };
            (schObj.element.querySelector('.e-schedule-toolbar .e-icon-next') as HTMLElement).click();
            schObj.dataBind();
        });
        it('Check September 2019 Appointment', (done: DoneFn) => {
            schObj.dataBound = () => {
                const selector: string = `.e-work-cells[data-date="${new Date(2019, 8, 5).getTime()}"] .e-appointment`;
                expect(schObj.element.querySelector(selector)).not.toBeNull();
                done();
            };
            (schObj.element.querySelector('.e-schedule-toolbar .e-icon-next') as HTMLElement).click();
            schObj.dataBind();
        });
        it('Check October 2019 Appointment', (done: DoneFn) => {
            schObj.dataBound = () => {
                const selector: string = `.e-work-cells[data-date="${new Date(2019, 9, 7).getTime()}"] .e-appointment`;
                expect(schObj.element.querySelector(selector)).not.toBeNull();
                done();
            };
            (schObj.element.querySelector('.e-schedule-toolbar .e-icon-next') as HTMLElement).click();
            schObj.dataBind();
        });
        it('Check November 2019 Appointment', (done: DoneFn) => {
            schObj.dataBound = () => {
                const selector: string = `.e-work-cells[data-date="${new Date(2019, 10, 5).getTime()}"] .e-appointment`;
                expect(schObj.element.querySelector(selector)).not.toBeNull();
                done();
            };
            (schObj.element.querySelector('.e-schedule-toolbar .e-icon-next') as HTMLElement).click();
            schObj.dataBind();
        });
        it('Check December 2019 Appointment', (done: DoneFn) => {
            schObj.dataBound = () => {
                const selector: string = `.e-work-cells[data-date="${new Date(2019, 11, 5).getTime()}"] .e-appointment`;
                expect(schObj.element.querySelector(selector)).not.toBeNull();
                done();
            };
            (schObj.element.querySelector('.e-schedule-toolbar .e-icon-next') as HTMLElement).click();
            schObj.dataBind();
        });
    });
    describe('Testing first day of week on view basis', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Event',
            StartTime: new Date(2017, 10, 6),
            EndTime: new Date(2017, 10, 7),
            IsAllDay: true
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px',
                selectedDate: new Date(2017, 10, 6),
                currentView: 'Day',
                views: [
                    { option: 'Day', firstDayOfWeek: 1 },
                    { option: 'Week', firstDayOfWeek: 6 },
                    { option: 'WorkWeek', firstDayOfWeek: 3 },
                    { option: 'Month', firstDayOfWeek: 4 },
                    { option: 'Agenda', firstDayOfWeek: 5 },
                    { option: 'MonthAgenda', firstDayOfWeek: 6 },
                    { option: 'TimelineDay', firstDayOfWeek: 4 },
                    { option: 'TimelineWeek', firstDayOfWeek: 1 },
                    { option: 'TimelineWorkWeek', firstDayOfWeek: 2 },
                    { option: 'TimelineMonth', firstDayOfWeek: 3 }
                ]
            };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking first day of week in day view.', () => {
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            expect(popupEle.querySelector('.e-week-header th').textContent).toBe('Mo');
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startTimePicker: DateTimePicker =
                (dialogElement.querySelector('.e-start') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            expect(startTimePicker.firstDayOfWeek.toString()).toEqual('1');
            const endTimePicker: DateTimePicker =
                (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            expect(endTimePicker.firstDayOfWeek.toString()).toEqual('1');
            const untilDatePicker: DateTimePicker =
                (dialogElement.querySelector('.e-until-date') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            expect(untilDatePicker.firstDayOfWeek.toString()).toEqual('1');
            const repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            repeatElement.index = 2; repeatElement.dataBind();
            const btnElement: HTMLElement = ([].slice.call(document.querySelectorAll('.e-round.e-lib.e-btn.e-control')))[1] as HTMLElement;
            expect(btnElement.title).toEqual('Monday');
            repeatElement.index = 3; repeatElement.dataBind();
            const dayElement: DropDownList =
                (dialogElement.querySelector('.e-month-week') as EJ2Instance).ej2_instances[0] as DropDownList;
            dayElement.index = 0; dayElement.dataBind();
            expect(dayElement.value).toEqual('MO');
            (document.querySelector('.e-control.e-btn.e-lib.e-event-cancel.e-flat') as HTMLElement).click();
        });
        it('Checking first day of week in week view.', (done: DoneFn) => {
            schObj.dataBound = () => {
                (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
                const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
                expect(popupEle.querySelector('.e-week-header th').textContent).toBe('Sa');
                (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
                const headerElement: HTMLElement = (schObj.element.querySelector('.e-header-row').children[0].children[0]) as HTMLElement;
                expect(headerElement.innerText).toEqual('Sat');
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                const startTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-start') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(startTimePicker.firstDayOfWeek.toString()).toEqual('6');
                const endTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(endTimePicker.firstDayOfWeek.toString()).toEqual('6');
                const untilDatePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-until-date') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(untilDatePicker.firstDayOfWeek.toString()).toEqual('6');
                const repeatElement: DropDownList =
                    (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
                repeatElement.index = 2; repeatElement.dataBind();
                const btnElement: HTMLElement =
                    ([].slice.call(document.querySelectorAll('.e-round.e-lib.e-btn.e-control')))[1] as HTMLElement;
                expect(btnElement.title).toEqual('Saturday');
                repeatElement.index = 3; repeatElement.dataBind();
                const dayElement: DropDownList =
                    (dialogElement.querySelector('.e-month-week') as EJ2Instance).ej2_instances[0] as DropDownList;
                dayElement.index = 0; dayElement.dataBind();
                expect(dayElement.value).toEqual('SA');
                (document.querySelector('.e-control.e-btn.e-lib.e-event-cancel.e-flat') as HTMLElement).click();
                done();
            };
            schObj.currentView = 'Week';
            schObj.dataBind();
        });
        it('Checking first day of week in work week view.', (done: DoneFn) => {
            schObj.dataBound = () => {
                (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
                const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
                expect(popupEle.querySelector('.e-week-header th').textContent).toBe('We');
                (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
                const headerElement: HTMLElement = (schObj.element.querySelector('.e-header-row').children[0].children[0]) as HTMLElement;
                expect(headerElement.innerText).toEqual('Wed');
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                const startTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-start') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(startTimePicker.firstDayOfWeek.toString()).toEqual('3');
                const endTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(endTimePicker.firstDayOfWeek.toString()).toEqual('3');
                const untilDatePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-until-date') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(untilDatePicker.firstDayOfWeek.toString()).toEqual('3');
                const repeatElement: DropDownList =
                    (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
                repeatElement.index = 2; repeatElement.dataBind();
                const btnElement: HTMLElement =
                    ([].slice.call(document.querySelectorAll('.e-round.e-lib.e-btn.e-control')))[1] as HTMLElement;
                expect(btnElement.title).toEqual('Wednesday');
                repeatElement.index = 3; repeatElement.dataBind();
                const dayElement: DropDownList =
                    (dialogElement.querySelector('.e-month-week') as EJ2Instance).ej2_instances[0] as DropDownList;
                dayElement.index = 0; dayElement.dataBind();
                expect(dayElement.value).toEqual('WE');
                (document.querySelector('.e-control.e-btn.e-lib.e-event-cancel.e-flat') as HTMLElement).click();
                done();
            };
            schObj.currentView = 'WorkWeek';
            schObj.dataBind();
        });
        it('Checking first day of week in Month view.', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect((schObj.element.querySelector('.e-header-cells') as HTMLElement).innerText).toEqual('Thursday');
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                const startTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-start') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(startTimePicker.firstDayOfWeek.toString()).toEqual('4');
                const endTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(endTimePicker.firstDayOfWeek.toString()).toEqual('4');
                const untilDatePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-until-date') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(untilDatePicker.firstDayOfWeek.toString()).toEqual('4');
                const repeatElement: DropDownList =
                    (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
                repeatElement.index = 2; repeatElement.dataBind();
                const btnElement: HTMLElement =
                    ([].slice.call(document.querySelectorAll('.e-round.e-lib.e-btn.e-control')))[1] as HTMLElement;
                expect(btnElement.title).toEqual('Thursday');
                repeatElement.index = 3; repeatElement.dataBind();
                const dayElement: DropDownList =
                    (dialogElement.querySelector('.e-month-week') as EJ2Instance).ej2_instances[0] as DropDownList;
                dayElement.index = 0; dayElement.dataBind();
                expect(dayElement.value).toEqual('TH');
                (document.querySelector('.e-control.e-btn.e-lib.e-event-cancel.e-flat') as HTMLElement).click();
                done();
            };
            schObj.currentView = 'Month';
            schObj.dataBind();
        });
        it('Checking first day of week in agenda view.', (done: DoneFn) => {
            schObj.dataBound = () => {
                (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
                const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
                expect(popupEle.querySelector('.e-week-header th').textContent).toBe('Fr');
                (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
                done();
            };
            schObj.currentView = 'Agenda';
            schObj.dataBind();
        });
        it('Checking first day of week in month agenda view.', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect((schObj.element.querySelector('.e-header-cells') as HTMLElement).innerText).toEqual('Sat');
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                const startTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-start') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(startTimePicker.firstDayOfWeek.toString()).toEqual('6');
                const endTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(endTimePicker.firstDayOfWeek.toString()).toEqual('6');
                const untilDatePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-until-date') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(untilDatePicker.firstDayOfWeek.toString()).toEqual('6');
                const repeatElement: DropDownList =
                    (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
                repeatElement.index = 2; repeatElement.dataBind();
                const btnElement: HTMLElement =
                    ([].slice.call(document.querySelectorAll('.e-round.e-lib.e-btn.e-control')))[1] as HTMLElement;
                expect(btnElement.title).toEqual('Saturday');
                repeatElement.index = 3; repeatElement.dataBind();
                const dayElement: DropDownList =
                    (dialogElement.querySelector('.e-month-week') as EJ2Instance).ej2_instances[0] as DropDownList;
                dayElement.index = 0; dayElement.dataBind();
                expect(dayElement.value).toEqual('SA');
                (document.querySelector('.e-control.e-btn.e-lib.e-event-cancel.e-flat') as HTMLElement).click();
                done();
            };
            schObj.currentView = 'MonthAgenda';
            schObj.dataBind();
        });
        it('Checking first day of week in timeline day view.', (done: DoneFn) => {
            schObj.dataBound = () => {
                (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
                const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
                expect(popupEle.querySelector('.e-week-header th').textContent).toBe('Th');
                (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                const startTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-start') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(startTimePicker.firstDayOfWeek.toString()).toEqual('4');
                const endTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(endTimePicker.firstDayOfWeek.toString()).toEqual('4');
                const untilDatePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-until-date') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(untilDatePicker.firstDayOfWeek.toString()).toEqual('4');
                const repeatElement: DropDownList =
                    (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
                repeatElement.index = 2; repeatElement.dataBind();
                const btnElement: HTMLElement =
                    ([].slice.call(document.querySelectorAll('.e-round.e-lib.e-btn.e-control')))[1] as HTMLElement;
                expect(btnElement.title).toEqual('Thursday');
                repeatElement.index = 3; repeatElement.dataBind();
                const dayElement: DropDownList =
                    (dialogElement.querySelector('.e-month-week') as EJ2Instance).ej2_instances[0] as DropDownList;
                dayElement.index = 0; dayElement.dataBind();
                expect(dayElement.value).toEqual('TH');
                (document.querySelector('.e-control.e-btn.e-lib.e-event-cancel.e-flat') as HTMLElement).click();
                done();
            };
            schObj.currentView = 'TimelineDay';
            schObj.dataBind();
        });
        it('Checking first day of week in timeline week view.', (done: DoneFn) => {
            schObj.dataBound = () => {
                (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
                const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
                expect(popupEle.querySelector('.e-week-header th').textContent).toBe('Mo');
                (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
                expect((schObj.element.querySelector('.e-header-cells') as HTMLElement).innerText).toEqual('Nov 6, Monday');
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                const startTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-start') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(startTimePicker.firstDayOfWeek.toString()).toEqual('1');
                const endTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(endTimePicker.firstDayOfWeek.toString()).toEqual('1');
                const untilDatePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-until-date') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(untilDatePicker.firstDayOfWeek.toString()).toEqual('1');
                const repeatElement: DropDownList =
                    (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
                repeatElement.index = 2; repeatElement.dataBind();
                const btnElement: HTMLElement =
                    ([].slice.call(document.querySelectorAll('.e-round.e-lib.e-btn.e-control')))[1] as HTMLElement;
                expect(btnElement.title).toEqual('Monday');
                repeatElement.index = 3; repeatElement.dataBind();
                const dayElement: DropDownList =
                    (dialogElement.querySelector('.e-month-week') as EJ2Instance).ej2_instances[0] as DropDownList;
                dayElement.index = 0; dayElement.dataBind();
                expect(dayElement.value).toEqual('MO');
                (document.querySelector('.e-control.e-btn.e-lib.e-event-cancel.e-flat') as HTMLElement).click();
                done();
            };
            schObj.currentView = 'TimelineWeek';
            schObj.dataBind();
        });
        it('Checking first day of week in timeline work week view.', (done: DoneFn) => {
            schObj.dataBound = () => {
                (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
                const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
                expect(popupEle.querySelector('.e-week-header th').textContent).toBe('Tu');
                (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
                expect((schObj.element.querySelector('.e-header-cells') as HTMLElement).innerText).toEqual('Oct 31, Tuesday');
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                const startTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-start') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(startTimePicker.firstDayOfWeek.toString()).toEqual('2');
                const endTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(endTimePicker.firstDayOfWeek.toString()).toEqual('2');
                const untilDatePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-until-date') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(untilDatePicker.firstDayOfWeek.toString()).toEqual('2');
                const repeatElement: DropDownList =
                    (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
                repeatElement.index = 2; repeatElement.dataBind();
                const btnElement: HTMLElement =
                    ([].slice.call(document.querySelectorAll('.e-round.e-lib.e-btn.e-control')))[1] as HTMLElement;
                expect(btnElement.title).toEqual('Tuesday');
                repeatElement.index = 3; repeatElement.dataBind();
                const dayElement: DropDownList =
                    (dialogElement.querySelector('.e-month-week') as EJ2Instance).ej2_instances[0] as DropDownList;
                dayElement.index = 0; dayElement.dataBind();
                expect(dayElement.value).toEqual('TU');
                (document.querySelector('.e-control.e-btn.e-lib.e-event-cancel.e-flat') as HTMLElement).click();
                done();
            };
            schObj.currentView = 'TimelineWorkWeek';
            schObj.dataBind();
        });
        it('Checking first day of week in timeline month view.', (done: DoneFn) => {
            schObj.dataBound = () => {
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                const startTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-start') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(startTimePicker.firstDayOfWeek.toString()).toEqual('3');
                const endTimePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(endTimePicker.firstDayOfWeek.toString()).toEqual('3');
                const untilDatePicker: DateTimePicker =
                    (dialogElement.querySelector('.e-until-date') as EJ2Instance).ej2_instances[0] as DateTimePicker;
                expect(untilDatePicker.firstDayOfWeek.toString()).toEqual('3');
                const repeatElement: DropDownList =
                    (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
                repeatElement.index = 2; repeatElement.dataBind();
                const btnElement: HTMLElement =
                    ([].slice.call(document.querySelectorAll('.e-round.e-lib.e-btn.e-control')))[1] as HTMLElement;
                expect(btnElement.title).toEqual('Wednesday');
                repeatElement.index = 3; repeatElement.dataBind();
                const dayElement: DropDownList =
                    (dialogElement.querySelector('.e-month-week') as EJ2Instance).ej2_instances[0] as DropDownList;
                dayElement.index = 0; dayElement.dataBind();
                expect(dayElement.value).toEqual('WE');
                (document.querySelector('.e-control.e-btn.e-lib.e-event-cancel.e-flat') as HTMLElement).click();
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });
    });

    describe('view-based template checking', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Event',
            StartTime: new Date(2019, 11, 1, 10),
            EndTime: new Date(2019, 11, 1, 11, 30),
            IsAllDay: false,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10',
            RecurrenceException: '20191205T043000Z,20191209T043000Z'
        }];
        const dateHeaderTemplate: string = '<div class="e-custom-date-header">${date.toLocaleString()}</div>';
        const cellHeaderTemplate: string = '<div class="e-custom-cell-header">${date.toLocaleString()}</div>';
        const cellTemplate: string = '<div class="e-custom-cell">${date.toLocaleString()}</div>';
        const dateRangeTemplate: string = '<div class="date-text">${(data.startDate).getDate()}-${(data.endDate).getDate()}</div>';
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                selectedDate: new Date(2019, 11, 5),
                views: [
                    { option: 'Week', dateHeaderTemplate: dateHeaderTemplate },
                    { option: 'Month', cellHeaderTemplate: cellHeaderTemplate, cellTemplate: cellTemplate },
                    { option: 'Year', dateRangeTemplate: dateRangeTemplate }
                ]
            };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('templates testing in week view', () => {
            expect(schObj.element.querySelectorAll('.e-custom-date-header').length).toEqual(7);
            expect(schObj.element.querySelectorAll('.e-custom-cell').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-custom-cell-header').length).toEqual(0);
            expect(schObj.getDeletedOccurrences(1).length).toEqual(2);
        });
        it('templates testing in month view', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-custom-date-header').length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-custom-cell').length).toEqual(35);
                expect(schObj.element.querySelectorAll('.e-custom-cell-header').length).toEqual(35);
                expect(schObj.getDeletedOccurrences(schObj.eventsData[0]).length).toEqual(2);
                done();
            };
            schObj.currentView = 'Month';
            schObj.dataBind();
        });
        it('templates testing in year view', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-tbar-btn-text').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-tbar-btn-text')[0].innerHTML).toEqual('<div class="date-text">1-31</div>');
                done();
            };
            schObj.currentView = 'Year';
            schObj.dataBind();
        });
    });

    describe('refreshTemplate checking', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Event',
            StartTime: new Date(2020, 0, 1, 10),
            EndTime: new Date(2020, 0, 1, 12),
            IsAllDay: false,
            RoomId: 1,
            OwnerId: 1
        }, {
            Id: 2,
            Subject: 'Testing',
            StartTime: new Date(2020, 0, 4, 10),
            EndTime: new Date(2020, 0, 4, 12),
            IsAllDay: false,
            RoomId: 2,
            OwnerId: 2
        }];
        const appTemplate: string = '<div class="app-template"><div class="subject">~${Subject}~</div></div>';
        const dateHeaderTemplate: string = '<span>~${getDateHeaderText(data.date)}~</span>';
        const cellTemplate: string = '${if(type === "workCells")}<div class="templatewrap">${getCellText(data.date)}</div>${/if}' +
            '${if(type === "monthCells")}<div class="templatewrap">${getMonthCellText(data.date)}</div>${/if}';
        const cellHeaderTemplate: string = '<div class="e-custom-cell">~${getDateHeaderText(data.date)}</div>';
        const resourceHeaderTemp: string = '<div class="resource-template">' +
            '<div class="resource-details"><div class="resource-name">~${resourceData.Text}~</div></div></div>';
        const dateRangeTemplate: string = '<div class="date-text">${(data.startDate).getDate()}-${(data.endDate).getDate()}</div>';
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                selectedDate: new Date(2020, 0, 4),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [
                    {
                        field: 'RoomId', name: 'Rooms',
                        dataSource: [
                            { Text: 'Room 1', Id: 1, Color: '#cb6bb2' },
                            { Text: 'Room 2', Id: 2, Color: '#56ca85' }
                        ]
                    },
                    {
                        field: 'OwnerId', name: 'Owners',
                        dataSource: [
                            { Text: 'Nancy', Id: 1, GroupID: 1, Color: '#ffaa00' },
                            { Text: 'Steven', Id: 2, GroupID: 2, Color: '#f8a398' },
                            { Text: 'Michael', Id: 3, GroupID: 1, Color: '#7499e1' }
                        ]
                    }
                ],
                resourceHeaderTemplate: resourceHeaderTemp,
                dateHeaderTemplate: dateHeaderTemplate,
                cellTemplate: cellTemplate,
                dateRangeTemplate: dateRangeTemplate,
                views: [
                    { option: 'Day' },
                    { option: 'Week' },
                    { option: 'WorkWeek' },
                    { option: 'Month', cellHeaderTemplate: cellHeaderTemplate },
                    { option: 'Agenda' },
                    { option: 'MonthAgenda' },
                    { option: 'TimelineDay' },
                    { option: 'TimelineWeek' },
                    { option: 'TimelineWorkWeek' },
                    { option: 'TimelineMonth' }
                ],
                eventSettings: { template: appTemplate, dataSource: eventData }
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('refresh templates testing in Day view', (done: DoneFn) => {
            schObj.dataBound = () => {
                // resourceHeaderTemplate checking
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                schObj.refreshTemplates('resourceHeaderTemplate');
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                // appointment template checking
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(1);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Testing~');
                schObj.refreshTemplates('eventTemplate');
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(1);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Testing~');
                // dateHeaderTemplate checking
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>~Sat, 1/4~</span>');
                schObj.refreshTemplates('dateHeaderTemplate');
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>~Sat, 1/4~</span>');
                // dateRangeTemplate checking
                expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">4-4</div>');
                schObj.refreshTemplates('dateRangeTemplate');
                expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">4-4</div>');
                done();
            };
            schObj.currentView = 'Day';
            schObj.dataBind();
        });
        it('refresh templates testing in Week view', (done: DoneFn) => {
            schObj.dataBound = () => {
                // resourceHeaderTemplate checking
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                schObj.refreshTemplates('resourceHeaderTemplate');
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                // appointment template checking
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(2);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Event~');
                schObj.refreshTemplates('eventTemplate');
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(2);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Event~');
                // dateHeaderTemplate checking
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>~Sun, 12/29~</span>');
                schObj.refreshTemplates('dateHeaderTemplate');
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>~Sun, 12/29~</span>');
                // dateRangeTemplate checking
                expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">29-4</div>');
                schObj.refreshTemplates('dateRangeTemplate');
                expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">29-4</div>');
                done();
            };
            schObj.currentView = 'Week';
            schObj.dataBind();
        });
        it('refresh templates testing in Month view', (done: DoneFn) => {
            schObj.dataBound = () => {
                // resourceHeaderTemplate checking
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                schObj.refreshTemplates('resourceHeaderTemplate');
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                // appointment template checking
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(2);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Event~');
                schObj.refreshTemplates('eventTemplate');
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(2);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Event~');
                done();
            };
            schObj.currentView = 'Month';
            schObj.dataBind();
        });
        it('refresh templates testing in Agenda views', (done: DoneFn) => {
            schObj.dataBound = () => {
                // resourceHeaderTemplate checking
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(2);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 2~');
                schObj.refreshTemplates('resourceHeaderTemplate');
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(2);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 2~');
                // appointment template checking
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(1);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Testing~');
                schObj.refreshTemplates('eventTemplate');
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(1);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Testing~');
                // dateHeaderTemplate checking
                expect(schObj.element.querySelector('.e-agenda-cells .e-day-date-header').innerHTML).toEqual('<span>~Sat, 1/4~</span>');
                schObj.refreshTemplates('dateHeaderTemplate');
                expect(schObj.element.querySelector('.e-agenda-cells .e-day-date-header').innerHTML).toEqual('<span>~Sat, 1/4~</span>');
                // dateRangeTemplate checking
                expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">4-10</div>');
                schObj.refreshTemplates('dateRangeTemplate');
                expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">4-10</div>');
                done();
            };
            schObj.currentView = 'Agenda';
            schObj.dataBind();
        });
        it('refresh templates testing in MonthAgenda views', (done: DoneFn) => {
            schObj.dataBound = () => {
                // resourceHeaderTemplate checking
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                schObj.refreshTemplates('resourceHeaderTemplate');
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                // appointment template checking
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(1);
                expect(schObj.element.querySelectorAll('.e-appointment-indicator').length).toEqual(2);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Testing~');
                schObj.refreshTemplates('eventTemplate');
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(1);
                expect(schObj.element.querySelectorAll('.e-appointment-indicator').length).toEqual(2);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Testing~');
                done();
            };
            schObj.currentView = 'MonthAgenda';
            schObj.dataBind();
        });
        it('refresh templates testing in TimelineDay view', (done: DoneFn) => {
            schObj.dataBound = () => {
                // resourceHeaderTemplate checking
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                schObj.refreshTemplates('resourceHeaderTemplate');
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                // appointment template checking
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(1);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Testing~');
                schObj.refreshTemplates('eventTemplate');
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(1);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Testing~');
                // dateHeaderTemplate checking
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>~Sat, 1/4~</span>');
                schObj.refreshTemplates('dateHeaderTemplate');
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>~Sat, 1/4~</span>');
                // dateRangeTemplate checking
                expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">4-4</div>');
                schObj.refreshTemplates('dateRangeTemplate');
                expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">4-4</div>');
                done();
            };
            schObj.currentView = 'TimelineDay';
            schObj.dataBind();
        });
        it('refresh templates testing in TimelineWeek view', (done: DoneFn) => {
            schObj.dataBound = () => {
                // resourceHeaderTemplate checking
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                schObj.refreshTemplates('resourceHeaderTemplate');
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                // appointment template checking
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(2);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Event~');
                schObj.refreshTemplates('eventTemplate');
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(2);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Event~');
                // dateHeaderTemplate checking
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>~Sun, 12/29~</span>');
                schObj.refreshTemplates('dateHeaderTemplate');
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>~Sun, 12/29~</span>');
                // dateRangeTemplate checking
                expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">29-4</div>');
                schObj.refreshTemplates('dateRangeTemplate');
                expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">29-4</div>');
                done();
            };
            schObj.currentView = 'TimelineWeek';
            schObj.dataBind();
        });
        it('refresh templates testing in TimelineWorkWeek view', (done: DoneFn) => {
            schObj.dataBound = () => {
                // resourceHeaderTemplate checking
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                schObj.refreshTemplates('resourceHeaderTemplate');
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                // appointment template checking
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(1);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Event~');
                schObj.refreshTemplates('eventTemplate');
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(1);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Event~');
                // dateHeaderTemplate checking
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>~Mon, 12/30~</span>');
                schObj.refreshTemplates('dateHeaderTemplate');
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>~Mon, 12/30~</span>');
                // dateRangeTemplate checking
                expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">30-3</div>');
                schObj.refreshTemplates('dateRangeTemplate');
                expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">30-3</div>');
                done();
            };
            schObj.currentView = 'TimelineWorkWeek';
            schObj.dataBind();
        });
        it('refresh templates testing in TimelineMonth view', (done: DoneFn) => {
            schObj.dataBound = () => {
                // resourceHeaderTemplate checking
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                schObj.refreshTemplates('resourceHeaderTemplate');
                expect(schObj.element.querySelectorAll('.resource-template').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.resource-template .resource-name')[0].innerHTML).toEqual('~Room 1~');
                // appointment template checking
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(2);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Event~');
                schObj.refreshTemplates('eventTemplate');
                expect(schObj.element.querySelectorAll('.app-template').length).toEqual(2);
                expect(schObj.element.querySelector('.app-template .subject').innerHTML).toEqual('~Event~');
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });
        it('openQuickInfoPopup with resource - Event', () => {
            const element: Element = schObj.element.querySelector('.e-appointment');
            const eventObj: Record<string, any> = {
                Id: 1,
                Subject: 'Event',
                StartTime: new Date(2020, 0, 1, 10),
                EndTime: new Date(2020, 0, 1, 12),
                IsAllDay: false,
                RoomId: 1,
                OwnerId: 1
            };
            schObj.openQuickInfoPopup(eventObj);
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            expect(eventPopup.querySelector('.e-date-time-details').innerHTML).toEqual('January 1, 2020 (10:00 AM&nbsp;-&nbsp;12:00 PM)');
            expect(eventPopup.querySelector('.e-resource-details').innerHTML).toEqual('Nancy');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });
        it('openQuickInfoPopup with resource - Cell', () => {
            const eventObj: Record<string, any> = {
                StartTime: new Date(2020, 0, 4, 10),
                EndTime: new Date(2020, 0, 4, 12),
                IsAllDay: false,
                RoomId: 2,
                OwnerId: 2
            };
            schObj.openQuickInfoPopup(eventObj);
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.e-date-time-details').innerHTML).toEqual('January 4, 2020 (10:00 AM&nbsp;-&nbsp;12:00 PM)');
            expect(cellPopup.querySelector('.e-resource-details').innerHTML).toEqual('Steven');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });
    });

    describe('Capitalization checking on french culture', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Event',
            StartTime: new Date(2019, 10, 7),
            EndTime: new Date(2019, 10, 8),
            RecurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;INTERVAL=1;COUNT=12;',
            IsAllDay: true
        }];
        beforeEach((): void => {
            schObj = undefined;
            document.body.appendChild(createElement('div', { id: 'Schedule' }));
        });
        afterEach((): void => {
            util.destroy(schObj);
        });

        it('Checking french culture on week view', () => {
            util.loadCultureFiles('fr-CH');
            schObj = new Schedule({ selectedDate: new Date(2019, 10, 19), locale: 'fr-CH' }, '#Schedule');

            const headerRows: NodeListOf<Element> = schObj.element.querySelectorAll('.e-header-day');
            expect(headerRows[0].innerHTML).toEqual('Dim.');
            expect(headerRows[1].innerHTML).toEqual('Lun.');
            expect(headerRows[2].innerHTML).toEqual('Mar.');
            expect(headerRows[3].innerHTML).toEqual('Mer.');
            expect(headerRows[4].innerHTML).toEqual('Jeu.');
            expect(headerRows[5].innerHTML).toEqual('Ven.');
            expect(headerRows[6].innerHTML).toEqual('Sam.');

            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('17 - 23 Novembre 2019');

            schObj.selectedDate = new Date(2019, 11, 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('01 - 07 Décembre 2019');

            schObj.selectedDate = new Date(2019, 0, 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('30 Déc. 2018 - 05 Janv. 2019');
        });

        it('Checking french culture on month view', () => {
            util.loadCultureFiles('fr-CH');
            schObj = new Schedule({ selectedDate: new Date(2019, 10, 1), currentView: 'Month', locale: 'fr-CH' }, '#Schedule');

            const headerRows: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-header-cells')) as HTMLElement[];
            expect(headerRows[0].innerText).toEqual('Dimanche');
            expect(headerRows[1].innerText).toEqual('Lundi');
            expect(headerRows[2].innerText).toEqual('Mardi');
            expect(headerRows[3].innerText).toEqual('Mercredi');
            expect(headerRows[4].innerText).toEqual('Jeudi');
            expect(headerRows[5].innerText).toEqual('Vendredi');
            expect(headerRows[6].innerText).toEqual('Samedi');

            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Novembre 2019');

            schObj.selectedDate = new Date(2019, 11, 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Décembre 2019');

            schObj.selectedDate = new Date(2019, 0, 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Janvier 2019');
        });

        it('Checking french culture event popup on month view', (done: DoneFn) => {
            util.loadCultureFiles('fr-CH');
            schObj = new Schedule(
                { selectedDate: new Date(2019, 10, 1), currentView: 'Month', locale: 'fr-CH', eventSettings: { dataSource: eventData } },
                '#Schedule');
            schObj.dataBound = () => {
                (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
                const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
                expect(eventPopup).toBeTruthy();
                expect((eventPopup.querySelector('.e-date-time-details') as HTMLElement).innerText).
                    toEqual('7 Novembre 2019 (All day)');
                expect((eventPopup.querySelector('.e-recurrence-summary') as HTMLElement).innerText).
                    toEqual('Every week(s) on Dim., Lun., Mar., Mer., Jeu., Ven., Sam., 12 time(s)');
                (eventPopup.querySelector('.e-close') as HTMLElement).click();
                done();
            };
        });

        it('Checking french culture on timeline week view', () => {
            util.loadCultureFiles('fr-CH');
            schObj = new Schedule(
                { selectedDate: new Date(2019, 10, 1), views: ['TimelineWeek'], currentView: 'TimelineWeek', locale: 'fr-CH' },
                '#Schedule');

            const headerRows: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-header-cells')) as HTMLElement[];
            expect(headerRows[0].innerText).toEqual('27 Oct., Dimanche');
            expect(headerRows[1].innerText).toEqual('28 Oct., Lundi');
            expect(headerRows[2].innerText).toEqual('29 Oct., Mardi');
            expect(headerRows[3].innerText).toEqual('30 Oct., Mercredi');
            expect(headerRows[4].innerText).toEqual('31 Oct., Jeudi');
            expect(headerRows[5].innerText).toEqual('1 Nov., Vendredi');
            expect(headerRows[6].innerText).toEqual('2 Nov., Samedi');

            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('27 Oct. - 02 Nov. 2019');

            schObj.selectedDate = new Date(2019, 11, 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('01 - 07 Décembre 2019');

            schObj.selectedDate = new Date(2019, 0, 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('30 Déc. 2018 - 05 Janv. 2019');
        });

        it('Checking french culture on timeline month view', () => {
            util.loadCultureFiles('fr-CH');
            schObj = new Schedule(
                { selectedDate: new Date(2019, 10, 1), views: ['TimelineMonth'], currentView: 'TimelineMonth', locale: 'fr-CH' },
                '#Schedule');

            expect((schObj.element.querySelector('.e-header-cells') as HTMLElement).innerText).toEqual('Nov. 1');

            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Novembre 2019');

            schObj.selectedDate = new Date(2019, 11, 1);
            schObj.dataBind();
            expect((schObj.element.querySelector('.e-header-cells') as HTMLElement).innerText).toEqual('Déc. 1');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Décembre 2019');

            schObj.selectedDate = new Date(2019, 0, 1);
            schObj.dataBind();
            expect((schObj.element.querySelector('.e-header-cells') as HTMLElement).innerText).toEqual('Janv. 1');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Janvier 2019');
        });
    });

    describe('EJ2-50031 - Form validator locale not working', () => {
        let schObj: Schedule;
        L10n.load({
            'zh': {
                'schedule': {
                    'day': '天',
                    'week': '周',
                    'workWeek': '工作周',
                    'month': '月',
                    'agenda': '议程',
                    'today': '今天',
                    'noEvents': '没有事件'
                },
                'formValidator': {
                    'required': '此字段是必需的。'
                }
            }
        });
        util.loadCultureFiles('zh');
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', currentView: 'Agenda', locale: 'zh',
                eventSettings: {
                    fields: {
                        id: 'Id',
                        subject: { name: 'Subject', validation: { required: true } },
                        location: { name: 'Location', validation: { required: true } },
                        description: {
                            name: 'Description', validation: {
                                required: true
                            }
                        },
                        startTime: { name: 'StartTime', validation: { required: true } },
                        endTime: { name: 'EndTime', validation: { required: true } }
                    }
                }, selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(schOptions, defaultData, done);
        });
        afterEach((): void => {
            util.destroy(schObj);
        });

        it('Testing chinese locale form validator', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            expect((document.querySelector('.e-tip-content') as HTMLElement).innerText).toEqual('此字段是必需的。');
        });
    });

    describe('EJ2-59128 - Events are not displayed when min-max date set to schedule', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                selectedDate: new Date(2022, 3, 4),
                minDate: new Date(2022, 3, 5),
                maxDate: new Date(2022, 3, 7),
                eventSettings: {
                    dataSource: [
                        {
                            Id: 1,
                            Subject: 'Explosion of Betelgeuse Star',
                            Location: 'Space Centre USA',
                            StartTime: new Date(2022, 3, 4, 9, 30),
                            EndTime: new Date(2022, 3, 4, 11, 0),
                            CategoryColor: '#1aaa55'
                        },
                        {
                            Id: 2,
                            Subject: 'Thule Air Crash Report',
                            Location: 'Newyork City',
                            StartTime: new Date(2022, 3, 6, 12, 0),
                            EndTime: new Date(2022, 3, 6, 14, 0),
                            CategoryColor: '#357cd2'
                        },
                        {
                            Id: 3,
                            Subject: 'MaxDate Appointments',
                            Location: 'Newyork City',
                            StartTime: new Date(2022, 3, 8, 12, 0),
                            EndTime: new Date(2022, 3, 8, 14, 0),
                            CategoryColor: '#357cd2'
                        }
                    ]
                }
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointments rendering in min-max date range in week and Month view ', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsProcessed.length).toEqual(3);
                const renderedAppointments: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS));
                expect(renderedAppointments.length).toEqual(1);
                done();
            };
            expect(schObj.eventsProcessed.length).toEqual(3);
            const renderedAppointments: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS));
            expect(renderedAppointments.length).toEqual(1);
            schObj.currentView = 'Month';
            schObj.dataBind();
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

    describe('Hide Tooltip when context menu is triggered', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px',
                selectedDate: new Date(2018, 0, 1),
                currentView: 'Month',
                eventSettings: {
                    enableTooltip: true,
                    fields: { subject: { name: 'Subject', default: 'No Title' } }
                }
            };
            schObj = util.createSchedule(model, tooltipData, done);
            util.disableTooltipAnimation((schObj.eventTooltip as any).tooltipObj);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Hiding tooltip with closeTooltip api', () => {
            const target: HTMLElement = [].slice.call(schObj.element.querySelectorAll('.e-appointment'))[1];
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseover');
            const tooltipEle: HTMLElement = document.querySelector('.e-schedule-event-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-subject').innerHTML).toBe('Normal Event');
            expect(tooltipEle.querySelector('.e-location').innerHTML).toBe('');
            expect(tooltipEle.querySelector('.e-details').innerHTML).toBe('January 3, 2018');
            expect(tooltipEle.querySelector('.e-all-day').innerHTML).toBe('10:00 AM - 11:00 AM');
            schObj.closeTooltip();
            schObj.dataBind();
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });
    });
});

