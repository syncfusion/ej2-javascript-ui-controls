/**
 * Schedule base spec 
 */
import { createElement, remove, L10n, EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { VerticalView } from '../../../src/schedule/renderer/vertical-view';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, MonthAgenda } from '../../../src/schedule/index';
import { triggerScrollEvent, loadCultureFiles } from '../util.spec';
import * as cls from '../../../src/schedule/base/css-constant';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda);
describe('Schedule base module', () => {
    describe('Default functionalities', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule();
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
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
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
        });

        it('vietnamese test case', () => {
            loadCultureFiles('vi');
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
            loadCultureFiles('zh');
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
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
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
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
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
                views: [{ option: 'Day', isSelected: true },
                { option: 'Week' }, { option: 'Month' }]
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
            schObj = new Schedule({
                selectedDate: new Date(2017, 9, 4),
                views: ['Day', 'Week', 'Month']
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');

            schObj.currentView = 'Month';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
        });

        it('currentView not in views list', () => {
            schObj = new Schedule({
                selectedDate: new Date(2017, 9, 4),
                views: ['Day', 'Month'],
                currentView: 'Week'
            });
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
    });

    describe('Current time indicator', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
            jasmine.clock().install();
        });
        afterEach((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
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
            let elem: HTMLElement = createElement('div', { id: 'Schedule1' });
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule1'));
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
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
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
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
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
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '600px',
                eventSettings: { fields: { subject: { name: 'Title' } } }
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('check scroll content', () => {
            let contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            let timeCellsArea: HTMLElement = schObj.element.querySelector('.e-time-cells-wrap') as HTMLElement;
            triggerScrollEvent(contentArea, 400);
            expect(contentArea.scrollTop).toEqual(400);
            expect(timeCellsArea.scrollTop).toEqual(400);
        });
    });

    describe('Event Settings', () => {
        let schObj: Schedule;
        beforeAll((done: Function): void => {
            schObj = undefined;
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '500px',
                width: '500px',
                selectedDate: new Date(2017, 10, 6),
                eventSettings: {
                    dataSource: [{
                        'Subject': 'test event',
                        'StartTime': new Date(2017, 10, 6, 10),
                        'EndTime': new Date(2017, 10, 6, 12)
                    }]
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
        });
        it('check events', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(1);
        });
        it('change dataSource, query, fields through setmodel', (done: Function) => {
            let dataBound: EmitType<Object> = () => {
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
            schObj.dataBound = dataBound;
            schObj.dataBind();
        });
    });

    describe('showWeekNumber property testing', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            if (schObj) {
                schObj.destroy();
                schObj = undefined;
            }
            remove(document.querySelector('#Schedule'));
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
        beforeAll((done: Function): void => {
            schObj = undefined;
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '500px',
                width: '500px',
                selectedDate: new Date(2017, 10, 6),
                eventSettings: {
                    dataSource: [{
                        'Subject': 'test event',
                        'StartTime': new Date(2017, 10, 6, 10),
                        'EndTime': new Date(2017, 10, 6, 12)
                    }, {
                        'Subject': 'previous test event',
                        'StartTime': new Date(2017, 8, 6, 10),
                        'EndTime': new Date(2017, 8, 6, 12)
                    }]
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
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
                done();
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
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
    });

    describe('CR Issue EJ2-16536 Schedule within hidden element', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let hiddenEle: HTMLElement = createElement('div', { styles: 'display:none' })
        hiddenEle.appendChild(elem)
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
});
