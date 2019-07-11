/**
 * Month view appointment rendering spec 
 */
import { closest, Browser, Internationalization } from '@syncfusion/ej2-base';
import { Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda } from '../../../src/schedule/index';
import { testData } from '../base/datasource.spec';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Month Event Render Module', () => {
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

    describe('Schedule Month view appointment rendering', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = { currentView: 'Month', height: '550px', width: '500px', selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('elements in DOM', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(9);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(8);
            expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
        });
    });

    describe('Mobile view', () => {
        let schObj: Schedule;
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

        beforeAll((done: Function) => {
            Browser.userAgent = androidUserAgent;
            let model: ScheduleModel = { views: [{ option: 'Day', readonly: true }, { option: 'Week' }, { option: 'WorkWeek', readonly: true }, { option: 'Month' }], currentView: 'Month', height: '550px', width: '500px', selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });

        it('More event click testing and read only for add icon testing', () => {
            expect((schObj.element.querySelector('.e-icon-add') as HTMLElement).offsetHeight).toEqual(25);
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(9);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(8);
            expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
            let element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            expect((schObj.element.querySelector('.e-icon-add') as HTMLElement).offsetHeight).toEqual(0);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
        });
    });

    describe('Schedule Hide week end in Month view appointment rendering', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                currentView: 'Month', height: '550px', width: '500px',
                showWeekend: false, selectedDate: new Date(2017, 10, 6)
            };
            schObj = util.createSchedule(model, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('elements in DOM', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(9);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(8);
            expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(2);
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
            expect(schObj.getWorkCellElements().length).toEqual(25);
            schObj.showWeekend = true;
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(35);
        });
    });

    describe('Schedule month view appointment rendering in RTL Mode', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                currentView: 'Month', height: '550px', width: '500px',
                enableRtl: true, selectedDate: new Date(2017, 10, 6)
            };
            schObj = util.createSchedule(model, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('elements in DOM', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(9);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(8);
            expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
        });
    });

    describe('Schedule month view appointment template checking', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                currentView: 'Month', height: '550px', width: '500px', selectedDate: new Date(2017, 10, 6),
                eventSettings: { template: '<span>${Subject}</span>' }
            };
            schObj = util.createSchedule(model, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('elements in DOM', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(9);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(8);
            expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
            expect(eventElementList[0].querySelector('.e-appointment-details').innerHTML)
                .toEqual('<span>Spanned - Greater than 24 hour</span><div class="e-indicator e-icons e-right-icon"></div>');
        });
        it('change event template through setmodel', (done: Function) => {
            schObj.dataBound = () => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(9);
                let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(8);
                expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
                let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(2);
                expect(eventElementList[0].querySelector('.e-appointment-details').innerHTML)
                    .toEqual('<span class="event-template">Spanned - Greater than 24 hour</span>' +
                        '<div class="e-indicator e-icons e-right-icon"></div>');
                done();
            };
            schObj.eventSettings.template = '<span class="event-template">${Subject}</span>';
            schObj.dataBind();
        });
    });

    describe('EJ2-11284 Events start and end on same time', () => {
        let schObj: Schedule;
        let eventDatas: Object[] = [{
            Id: 1,
            Subject: 'Normal event',
            StartTime: new Date(2017, 10, 2, 10),
            EndTime: new Date(2017, 10, 2, 10)
        }, {
            Id: 2,
            Subject: 'Recurrence event',
            StartTime: new Date(2017, 10, 3, 10),
            EndTime: new Date(2017, 10, 3, 10),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
        }];
        beforeAll((done: Function) => {
            let model: ScheduleModel = { currentView: 'Month', height: '550px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, eventDatas, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('appointment element present in DOM', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(6);
        });
    });

    describe('Start and end time in event template', () => {
        let schObj: Schedule;
        let eventData: Object[] = [{
            Id: 1,
            Subject: 'Normal event',
            StartTime: new Date(2017, 10, 2, 10),
            EndTime: new Date(2017, 10, 2, 11)
        }];
        beforeAll((done: Function) => {
            let instance: Internationalization = new Internationalization();
            (window as TemplateFunction).getTimeString = (value: Date) => {
                return instance.formatDate(value, { skeleton: 'hm' });
            };
            interface TemplateFunction extends Window {
                getTimeString?: Function;
            }
            let model: ScheduleModel = { currentView: 'Month', height: '550px', selectedDate: new Date(2017, 10, 2),
             eventSettings: { template: '<div class="time">${getTimeString(data.StartTime)}</div>' }};
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('check event start time in template', () => {
            expect(schObj.element.querySelector('.e-appointment .time').innerHTML).toEqual('10:00 AM');
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
