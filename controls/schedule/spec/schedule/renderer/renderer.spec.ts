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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Locale data testing', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { eventSettings: { query: new Query().take(5) } };
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
        beforeAll((done: DoneFn) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve(
                new Response(JSON.stringify({ d: defaultData, __count: 15 }), {
                    status: 200
                })
            ));
            const dataManager: DataManager = new DataManager({ url: 'api/Schedule/Events/' });
            const model: ScheduleModel = { eventSettings: { query: new Query().take(5) } };
            schObj = util.createSchedule(model, dataManager, done);
        });

        it('Events data generated testing', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toBe(0);
        });

        afterAll(() => {
            util.destroy(schObj);
        });
    });

    describe('actionFailure testing', () => {
        const actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        let schObj: Schedule;
        beforeAll(() => {
            const dataManager: DataManager = new DataManager({ url: 'api/Schedule/Events/' });
            const model: ScheduleModel = { actionFailure: actionFailedFunction };
            schObj = util.createSchedule(model, dataManager);
        });
        beforeEach((done: DoneFn) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: false,
                status: 404,
                headers: { 'Content-type': 'application/json' },
                statusText: 'Page not found'
            }));
            done();
        });
        it('actionFailure testing', () => {
            expect(actionFailedFunction).toHaveBeenCalled();
        });
        afterAll(() => {
            util.destroy(schObj);
        });
    });

    describe('Timezone in schedule testing', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { timezone: 'America/New_York' };
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
        beforeAll((done: DoneFn) => {
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
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { selectedDate: new Date(2017, 9, 16), timezone: 'America/New_York' };
            schObj = util.createSchedule(model, timezoneData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Generate query testing', () => {
            expect(schObj.dataModule.generateQuery() instanceof Query).toBe(true);
        });

        it('edit schedule timezone event testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(4);
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('edit starttimezone alone event testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(4);
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('edit endtimezone alone event testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[2] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(4);
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
