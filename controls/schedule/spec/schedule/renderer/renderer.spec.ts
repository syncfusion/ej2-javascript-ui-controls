/**
 * Schedule data module
 */
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Schedule, Day, Week, WorkWeek, Month, Agenda } from '../../../src/schedule/index';
import { defaultData, timezoneData } from '../base/datasource.spec';
import { triggerMouseEvent, disableScheduleAnimation } from '../util.spec';
import * as cls from '../../../src/schedule/base/css-constant';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Data module', () => {
    describe('Locale data testing', () => {
        let scheduleObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            scheduleObj = new Schedule(
                {
                    eventSettings: {
                        dataSource: defaultData,
                        query: new Query().take(5)
                    },
                    dataBound: dataBound,
                });
            scheduleObj.appendTo('#Schedule');
        });

        it('Generate query testing', () => {
            expect(scheduleObj.dataModule.generateQuery() instanceof Query).toBe(true);
        });

        afterAll(() => {
            if (scheduleObj) {
                scheduleObj.destroy();
            }
            remove(elem);
        });
    });

    describe('Remote data testing', () => {
        let scheduleObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let request: JasmineAjaxRequest;
        let dataManager: DataManager;
        let query: Query = new Query().take(5);
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: 'service/Orders/'
            });
            document.body.appendChild(elem);
            scheduleObj = new Schedule(
                {
                    eventSettings: {
                        dataSource: dataManager,
                        query: query
                    },
                    dataBound: dataBound,
                });
            scheduleObj.appendTo('#Schedule');
            request = jasmine.Ajax.requests.at(1);
            request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: defaultData, __count: 15 })
            });
        });

        it('Events data generated testing', () => {
            expect(scheduleObj.element.querySelectorAll('.e-appointment').length).toBe(0);
        });

        afterAll(() => {
            if (scheduleObj) {
                scheduleObj.destroy();
            }
            remove(scheduleObj.element);
            jasmine.Ajax.uninstall();
        });
    });

    describe('actionFailure testing', () => {
        let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let scheduleObj: Schedule;
        beforeAll(() => {
            jasmine.Ajax.install();
            document.body.appendChild(elem);
            scheduleObj = new Schedule({
                eventSettings: {
                    dataSource: new DataManager({
                        url: '/test/db'
                    })
                },
                actionFailure: actionFailedFunction
            });
            scheduleObj.appendTo('#Schedule');
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1);
            request.respondWith({
                'status': 404,
                'contentType': 'application/json',
                'responseText': 'Page not found'
            });
            setTimeout(() => { done(); }, 100);
        });
        it('actionFailure testing', () => {
            expect(actionFailedFunction).toHaveBeenCalled();
        });

        afterAll(() => {
            if (scheduleObj) {
                scheduleObj.destroy();
            }
            remove(elem);
            jasmine.Ajax.uninstall();
        });
    });

    describe('Timezone in schedule testing', () => {
        let scheduleObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            scheduleObj = new Schedule(
                {
                    timezone: 'America/New_York',
                    eventSettings: {
                        dataSource: defaultData
                    },
                    dataBound: dataBound,
                });
            scheduleObj.appendTo('#Schedule');
        });

        it('Generate query testing', () => {
            expect(scheduleObj.dataModule.generateQuery() instanceof Query).toBe(true);
        });

        afterAll(() => {
            if (scheduleObj) {
                scheduleObj.destroy();
            }
            remove(elem);
        });
    });

    describe('Timezone in local data testing', () => {
        let scheduleObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            scheduleObj = new Schedule({
                eventSettings: {
                    dataSource: timezoneData
                },
                dataBound: dataBound,
            });
            scheduleObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (scheduleObj) {
                scheduleObj.destroy();
            }
            remove(elem);
        });

        it('Generate query testing', () => {
            expect(scheduleObj.dataModule.generateQuery() instanceof Query).toBe(true);
        });
    });

    describe('Timezone in schedule and local data testing', () => {
        let scheduleObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            scheduleObj = new Schedule({
                selectedDate: new Date(2017, 9, 16),
                timezone: 'America/New_York',
                eventSettings: {
                    dataSource: timezoneData
                },
                dataBound: dataBound,
            });
            scheduleObj.appendTo('#Schedule');
        });

        afterAll(() => {
            if (scheduleObj) {
                scheduleObj.destroy();
            }
            remove(elem);
        });

        it('Generate query testing', () => {
            expect(scheduleObj.dataModule.generateQuery() instanceof Query).toBe(true);
        });

        it('edit schedule timezone event testing', (done: Function) => {
            disableScheduleAnimation(scheduleObj);
            let appElement: HTMLElement = scheduleObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement;
            triggerMouseEvent(appElement, 'click');
            triggerMouseEvent(appElement, 'dblclick');
            expect(scheduleObj.eventsData.length).toEqual(4);
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            scheduleObj.dataBound = () => {
                expect(scheduleObj.eventsData.length).toEqual(4);
                done();
            };
        });

        it('edit starttimezone alone event testing', (done: Function) => {
            disableScheduleAnimation(scheduleObj);
            let appElement: HTMLElement = scheduleObj.element.querySelectorAll('.e-appointment')[1] as HTMLElement;
            triggerMouseEvent(appElement, 'click');
            triggerMouseEvent(appElement, 'dblclick');
            expect(scheduleObj.eventsData.length).toEqual(4);
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            scheduleObj.dataBound = () => {
                expect(scheduleObj.eventsData.length).toEqual(4);
                done();
            };
        });

        it('edit endtimezone alone event testing', (done: Function) => {
            disableScheduleAnimation(scheduleObj);
            let appElement: HTMLElement = scheduleObj.element.querySelectorAll('.e-appointment')[2] as HTMLElement;
            triggerMouseEvent(appElement, 'click');
            triggerMouseEvent(appElement, 'dblclick');
            expect(scheduleObj.eventsData.length).toEqual(4);
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            scheduleObj.dataBound = () => {
                expect(scheduleObj.eventsData.length).toEqual(4);
                done();
            };
        });
    });
});