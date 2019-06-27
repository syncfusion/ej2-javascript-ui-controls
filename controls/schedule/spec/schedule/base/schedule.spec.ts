/**
 * Schedule base spec 
 */
import { createElement, remove, L10n, EmitType, Browser } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { VerticalView } from '../../../src/schedule/renderer/vertical-view';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, MonthAgenda, ScheduleModel, TimelineViews } from '../../../src/schedule/index';
import * as util from '../util.spec';
import { triggerScrollEvent, loadCultureFiles, createSchedule, destroy } from '../util.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { readonlyEventsData } from './datasource.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews);

describe('Schedule base module', () => {
    beforeAll(() => {
        // tslint:disable-next-line:no-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
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
            let verticalObj: VerticalView = new VerticalView(schObj);
            // tslint:disable-next-line:no-any
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
            // tslint:disable-next-line:no-any
            (schObj as any).onScheduleResize();
            expect(schObj.element.querySelectorAll('.e-week-view').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-week-agenda-view').length).toEqual(0);
        });

        it('desktop to mobile - month view testing', (done: Function) => {
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
            expect((<HTMLElement>schObj.element.querySelector('.e-work-cells')).offsetWidth).toEqual(86);
            schObj.element.style.width = '300px';
            // tslint:disable-next-line:no-any
            (schObj as any).onScheduleResize();
        });

        it('mobile to desktop', () => {
            document.getElementById('Schedule').style.width = '300px';
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), width: '300px' });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-week-view').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-week-agenda-view').length).toEqual(0);
            schObj.element.style.width = '600px';
            // tslint:disable-next-line:no-any
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

        it('Test visibility of selected date from calendar', () => {
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'] }, '#Schedule');
            schObj.dataBind();
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            let popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            let calendarEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-calendar');
            (calendarEle.querySelector('.e-day') as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            (calendarEle.querySelector('.e-selected') as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            expect(calendarEle.querySelector('.e-header').classList.contains('e-month')).toEqual(true);
            util.triggerMouseEvent(calendarEle.querySelector('.e-next') as HTMLElement, 'mousedown');
            (schObj.element.querySelectorAll('.e-content.e-month tr:last-child td')[2] as HTMLElement).click();
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-content.e-month tr:last-child td:nth-last-child(5) span').innerHTML).toEqual('31');
            expect(schObj.selectedDate).toEqual(new Date(2017, 9, 31));
            expect((schObj.element.querySelector('.e-content-wrap') as HTMLElement).scrollLeft).toEqual(5700);
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            (calendarEle.querySelector('.e-day') as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            (calendarEle.querySelector('.e-selected').nextSibling as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            expect(calendarEle.querySelector('.e-header').classList.contains('e-month')).toEqual(true);
            (schObj.element.querySelectorAll('.e-content.e-month tr:nth-last-child(4) td')[5] as HTMLElement).click();
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-content.e-month tr:nth-last-child(4) td:nth-last-child(2) span').innerHTML).toEqual('17');
            expect(schObj.selectedDate).toEqual(new Date(2017, 10, 17));
            expect((schObj.element.querySelector('.e-content-wrap') as HTMLElement).scrollLeft).toEqual(12900);
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
            jasmine.clock().tick(60050);
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
            let model: ScheduleModel = { height: '600px', eventSettings: { fields: { subject: { name: 'Title' } } } };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check scroll content', () => {
            let contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            let timeCellsArea: HTMLElement = schObj.element.querySelector('.e-time-cells-wrap') as HTMLElement;
            util.triggerScrollEvent(contentArea, 400);
            expect(contentArea.scrollTop).toEqual(400);
            expect(timeCellsArea.scrollTop).toEqual(400);
        });
    });

    describe('Event Settings', () => {
        let schObj: Schedule;
        let eventObj: Object[] = [{
            'Subject': 'test event',
            'StartTime': new Date(2017, 10, 6, 10),
            'EndTime': new Date(2017, 10, 6, 12)
        }];
        beforeAll((done: Function): void => {
            let model: ScheduleModel = { height: '500px', width: '500px', selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, eventObj, done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('check events', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(1);
        });
        it('change dataSource, query, fields through setmodel', (done: Function) => {
            schObj.dataBound = () => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
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

    describe('showWeekNumber property testing', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            document.body.appendChild(createElement('div', { id: 'Schedule' }));
        });
        afterEach((): void => {
            util.destroy(schObj);
        });

        it('week view testing', (done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '500px', width: '500px', selectedDate: new Date(2018, 3, 1),
                showWeekNumber: true, dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            let weekNumber: Element = schObj.element.querySelector('.e-left-indent-wrap .e-header-cells');
            expect(weekNumber.innerHTML).toEqual('<span title="Week 14">14</span>');
            expect(weekNumber.classList.contains('e-week-number')).toEqual(true);
            expect(weekNumber.children[0].getAttribute('title')).toEqual('Week 14');
        });

        it('month view testing', (done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '500px', width: '500px', currentView: 'Month', selectedDate: new Date(2018, 3, 1),
                showWeekend: false, showWeekNumber: true, dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-week-number-wrapper').length).toEqual(1);
            let weekNumber: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-week-number-wrapper .e-week-number'));
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

        it('month agenda view testing', (done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '500px', width: '500px', currentView: 'MonthAgenda', views: ['MonthAgenda'],
                selectedDate: new Date(2018, 3, 1), showWeekNumber: true, dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            let weekNumber: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-week-number-wrapper .e-week-number'));
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

        it('setmodel testing', (done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
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
        let eventDatas: Object[] = [{
            'Subject': 'test event',
            'StartTime': new Date(2017, 10, 6, 10),
            'EndTime': new Date(2017, 10, 6, 12)
        }, {
            'Subject': 'previous test event',
            'StartTime': new Date(2017, 8, 6, 10),
            'EndTime': new Date(2017, 8, 6, 12)
        }];
        beforeAll((done: Function): void => {
            let model: ScheduleModel = { height: '500px', width: '500px', selectedDate: new Date(2017, 10, 6) };
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
            let element: Element = schObj.element.querySelector('.e-appointment');
            let eventObj: { [key: string]: Object } = <{ [key: string]: Object }>schObj.getEventDetails(element);
            expect(eventObj.Subject).toEqual('test event');
        });

        it('getEventDetails other than appointment element', () => {
            let element: Element = schObj.element.querySelector('.e-work-cells');
            let eventObj: Object = schObj.getEventDetails(element);
            expect(Object.keys(eventObj).length).toEqual(0);
        });

        it('refreshEvents', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                done();
            };
            schObj.refreshEvents();
        });

        it('openEditor', () => {
            let element: Element = schObj.element.querySelector('.e-appointment');
            let eventObj: { [key: string]: Object } = <{ [key: string]: Object }>schObj.getEventDetails(element);
            schObj.openEditor(eventObj, 'Save');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
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
    });

    describe('Testing resetWorkHours without parameters in Vertical view', () => {
        let schObj: Schedule;
        beforeAll((done: Function): void => {
            let model: ScheduleModel = {
                height: '560px', width: '100%',
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2019, 5, 12),
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('Checking cells that contain Work hours cells length before calling reset work hours method', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_HOURS_CLASS));
            expect(workCells.length).toEqual(90);
        });
        it('Checking cells that contain Work hours cells length after calling reset work hours method', () => {
            schObj.resetWorkHours();
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_HOURS_CLASS));
            expect(workCells.length).toEqual(0);
        });
    });

    describe('Testing resetWorkHours without parameters in Timeline view', () => {
        let schObj: Schedule;
        beforeAll((done: Function): void => {
            let model: ScheduleModel = {
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
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_HOURS_CLASS));
            expect(workCells.length).toEqual(90);
        });
        it('Checking cells that contain Work hours cells length after calling reset work hours method', () => {
            schObj.resetWorkHours();
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_HOURS_CLASS));
            expect(workCells.length).toEqual(0);
        });
    });

    describe('Testing resetWorkHours with parameteres in Vertical view', () => {
        let schObj: Schedule;
        beforeAll((done: Function): void => {
            let model: ScheduleModel = {
                height: '560px', width: '100%',
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2019, 5, 12),
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('Checking Work hour class is avilable or not on particular cell', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
            expect(workCells[136].classList.contains('e-work-hours')).toEqual(true);
            expect(workCells[164].classList.contains('e-work-hours')).toEqual(true);
        });
        it('Removing the work cell class from the particular cell', () => {
            let dates: Date[] = [new Date(2019, 5, 12)];
            schObj.resetWorkHours(dates, '09:30', '12:00');
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
            expect(workCells[136].classList.contains('e-work-hours')).toEqual(false);
            expect(workCells[164].classList.contains('e-work-hours')).toEqual(false);
        });
    });

    describe('Testing resetWorkHours with parameteres in Timeline view', () => {
        let schObj: Schedule;
        beforeAll((done: Function): void => {
            let model: ScheduleModel = {
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
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
            expect(workCells[163].classList.contains('e-work-hours')).toEqual(true);
            expect(workCells[166].classList.contains('e-work-hours')).toEqual(true);
        });
        it('Removing the work cell class from the particular cell', () => {
            let dates: Date[] = [new Date(2019, 5, 12)];
            schObj.resetWorkHours(dates, '09:30', '12:00');
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
            expect(workCells[163].classList.contains('e-work-hours')).toEqual(false);
            expect(workCells[166].classList.contains('e-work-hours')).toEqual(false);
        });
    });

    describe('Testing resetWorkHours on passing group index in Vertical view', () => {
        let schObj: Schedule;
        beforeAll((done: Function): void => {
            let model: ScheduleModel = {
                height: '560px', width: '100%',
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2019, 5, 12),
            };
            schObj = util.createGroupSchedule(2, model, [], done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('Checking the particular cell contains a work hour class or not', () => {
            let tableRows: NodeListOf<HTMLTableRowElement> = schObj.element.querySelectorAll('tr');
            expect(tableRows[80].children[10].classList.contains('e-work-hours')).toEqual(true);
            expect(tableRows[82].children[10].classList.contains('e-work-hours')).toEqual(true);
        });
        it('Removing work hour class from particular cell by calling resetWorkHours', () => {
            let dates: Date[] = [new Date(2019, 5, 12)];
            schObj.resetWorkHours(dates, '09:30', '12:00', 1);
            let tableRows: NodeListOf<HTMLTableRowElement> = schObj.element.querySelectorAll('tr');
            expect(tableRows[80].children[10].classList.contains('e-work-hours')).toEqual(false);
            expect(tableRows[82].children[10].classList.contains('e-work-hours')).toEqual(false);
        });
    });

    describe('Testing resetWorkHours on passing group index in Timeline view', () => {
        let schObj: Schedule;
        beforeAll((done: Function): void => {
            let model: ScheduleModel = {
                height: '560px', width: '100%',
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2019, 5, 12),
                currentView: 'TimelineWeek',
            };
            schObj = util.createGroupSchedule(2, model, [], done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('Checking the particular cell contains a work hour class or not', () => {
            let tableRows: NodeListOf<HTMLTableRowElement> = schObj.element.querySelectorAll('tr');
            expect(tableRows[11].children[163].classList.contains('e-work-hours')).toEqual(true);
            expect(tableRows[11].children[166].classList.contains('e-work-hours')).toEqual(true);
        });
        it('Removing work hour class from particular cell by calling resetWorkHours', () => {
            let dates: Date[] = [new Date(2019, 5, 12)];
            schObj.resetWorkHours(dates, '09:30', '12:00', 2);
            let tableRows: NodeListOf<HTMLTableRowElement> = schObj.element.querySelectorAll('tr');
            expect(tableRows[11].children[163].classList.contains('e-work-hours')).toEqual(false);
            expect(tableRows[11].children[166].classList.contains('e-work-hours')).toEqual(false);
        });
    });

    describe('CR Issue EJ2-16536 Schedule within hidden element', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let hiddenEle: HTMLElement = createElement('div', { styles: 'display:none' });
        hiddenEle.appendChild(elem);
        beforeAll((done: Function) => {
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
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        util.loadCultureFiles('fr-CH');
        beforeAll((done: Function) => {
            Browser.userAgent = androidUserAgent;
            let model: ScheduleModel = { height: '550px', width: '500px', locale: 'fr-CH', selectedDate: new Date(2017, 10, 6) };
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
        // tslint:disable-next-line:no-any
        let keyModule: any;
        beforeAll((done: Function) => {
            let model: ScheduleModel = { height: '500px', width: '500px' };
            schObj = createSchedule(model, readonlyEventsData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });
        it('Delete key', () => {
            keyModule = schObj.keyboardInteractionModule;
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            let selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            keyModule.keyActionHandler({ action: 'delete', target: selectedElement[0] });
            expect(schObj.quickPopup.quickPopup.element.querySelector('.e-edit').getAttribute('disabled')).toBe('');
            expect(schObj.quickPopup.quickPopup.element.querySelector('.e-delete').getAttribute('disabled')).toBe('');
            expect(schObj.quickPopup.quickPopup.element.querySelector('.e-close').getAttribute('disabled')).toBe(null);
            (<HTMLElement>schObj.quickPopup.quickPopup.element.querySelector('.e-close')).click();
        });
    });

    it('memory leak', () => {
        profile.sample();
        // tslint:disable:no-any
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        // tslint:enable:no-any
    });
});
