/**
 * Schedule data module
 */
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, ScheduleModel } from '../../../src/schedule/index';
import { defaultData, timezoneData } from '../base/datasource.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Data module', () => {
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

    describe('Locale data testing', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = { eventSettings: { query: new Query().take(5) } };
            schObj = util.createSchedule(model, defaultData, done);
        });

        it('Generate query testing', () => {
            expect(schObj.dataModule.generateQuery() instanceof Query).toBe(true);
        });

        afterAll(() => {
            util.destroy(schObj);
        });
    });

    describe('Remote data testing', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            let dataManager: DataManager = new DataManager({ url: 'service/Orders/' });
            let model: ScheduleModel = { eventSettings: { query: new Query().take(5) } };
            schObj = util.createSchedule(model, dataManager, done);
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1);
            request.respondWith({ status: 200, responseText: JSON.stringify({ d: defaultData, __count: 15 }) });
        });

        it('Events data generated testing', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toBe(0);
        });

        afterAll(() => {
            util.destroy(schObj);
            jasmine.Ajax.uninstall();
        });
    });

    describe('actionFailure testing', () => {
        let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        let schObj: Schedule;
        beforeAll(() => {
            jasmine.Ajax.install();
            let dataManager: DataManager = new DataManager({ url: 'service/Orders/' });
            let model: ScheduleModel = { actionFailure: actionFailedFunction };
            schObj = util.createSchedule(model, dataManager);
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1);
            request.respondWith({ 'status': 404, 'contentType': 'application/json', 'responseText': 'Page not found' });
            setTimeout(() => { done(); }, 100);
        });
        it('actionFailure testing', () => {
            expect(actionFailedFunction).toHaveBeenCalled();
        });

        afterAll(() => {
            util.destroy(schObj);
            jasmine.Ajax.uninstall();
        });
    });

    describe('Timezone in schedule testing', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = { timezone: 'America/New_York' };
            schObj = util.createSchedule(model, defaultData, done);
        });

        it('Generate query testing', () => {
            expect(schObj.dataModule.generateQuery() instanceof Query).toBe(true);
        });

        afterAll(() => {
            util.destroy(schObj);
        });
    });

    describe('Timezone in local data testing', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            schObj = util.createSchedule({}, timezoneData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Generate query testing', () => {
            expect(schObj.dataModule.generateQuery() instanceof Query).toBe(true);
        });
    });

    describe('Timezone in schedule and local data testing', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = { selectedDate: new Date(2017, 9, 16), timezone: 'America/New_York' };
            schObj = util.createSchedule(model, timezoneData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Generate query testing', () => {
            expect(schObj.dataModule.generateQuery() instanceof Query).toBe(true);
        });

        it('edit schedule timezone event testing', (done: Function) => {
            let appElement: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(4);
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
        });

        it('edit starttimezone alone event testing', (done: Function) => {
            let appElement: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(4);
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
        });

        it('edit endtimezone alone event testing', (done: Function) => {
            let appElement: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[2] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(4);
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
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
