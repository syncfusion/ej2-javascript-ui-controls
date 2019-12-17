import { extend, closest } from '@syncfusion/ej2-base';
import { Query, DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, ActionEventArgs,
    ScheduleModel, Timezone, EventSettingsModel
} from '../../../src/schedule/index';
import { defaultData, stringData, cloneDataSource } from '../base/datasource.spec';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

/**
 * Schedule CRUD module
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Schedule CRUD', () => {
    beforeAll(() => {
        // tslint:disable:no-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Add Actions', () => {
        let schObj: Schedule;
        let eventData: Object = {
            Id: 1,
            Subject: 'test event',
            StartTime: new Date(2017, 9, 19, 10, 0),
            EndTime: new Date(2017, 9, 19, 11, 0),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
        };
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 3) };
            schObj = util.createSchedule(schOptions, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before add checking', () => {
            expect(schObj.eventsData.length).toEqual(0);
        });

        it('After add checking', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            schObj.addEvent(eventData);
        });

        it('Multiple events add checking', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(8);
                done();
            };
            schObj.addEvent(defaultData.slice(0, 7));
        });

        it('actionBegin event checking', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            schObj.addEvent(eventData);
        });

        it('allowAdding API checking', () => {
            schObj.eventSettings.allowAdding = false;
            schObj.dataBind();
            schObj.addEvent(eventData);
            expect(schObj.eventsData.length).toEqual(8);
        });
    });

    describe('Save Actions', () => {
        let schObj: Schedule;
        let events: Object[] = [
            {
                Id: 10,
                Subject: 'recurrence event',
                StartTime: new Date(2017, 9, 19, 10, 0),
                EndTime: new Date(2017, 9, 19, 11, 0),
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            }, {
                Id: 11,
                Subject: 'event 1',
                StartTime: new Date(2017, 9, 19, 11, 0),
                EndTime: new Date(2017, 9, 19, 12, 30)
            }, {
                Id: 12,
                Subject: 'event 2',
                StartTime: new Date(2017, 9, 20, 11, 0),
                EndTime: new Date(2017, 9, 20, 12, 30)
            }
        ];
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 9, 19), eventSettings: { query: new Query() } };
            schObj = util.createSchedule(schOptions, events, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before save checking', () => {
            expect(schObj.eventsData.length).toEqual(3);
        });

        it('Checking action begin event for save', () => {
            let data: { [key: string]: Object } = {
                Id: 11,
                Subject: 'Edited',
                StartTime: new Date(2017, 9, 19, 11, 0),
                EndTime: new Date(2017, 9, 19, 12, 30),
                IsAllDay: false
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            schObj.saveEvent(data);
            expect(schObj.eventsData.length).toEqual(3);
        });

        it('test normal appointment save', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect(dataObj[1].Subject).toEqual('event 1 edited');
                done();
            };
            let data: { [key: string]: Object } = {
                Id: 11,
                Subject: 'event 1 edited',
                StartTime: new Date(2017, 9, 19, 11, 0),
                EndTime: new Date(2017, 9, 19, 12, 30)
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            schObj.saveEvent(data);
        });

        it('test edit occurrence', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('recurrence event');
                expect(dataObj[3].Id).toEqual(20);
                expect(dataObj[3].RecurrenceID).toEqual(10);
                expect(dataObj[3].Subject).toEqual('2nd occurrence edited');
                done();
            };
            expect(schObj.eventsData.length).toEqual(3);
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[2], null, true) as { [key: string]: Object };
            data.Subject = '2nd occurrence edited';
            data.Id = 20;
            schObj.saveEvent(data, 'EditOccurrence');
        });

        it('test edited occurrence save', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('recurrence event');
                expect(dataObj[3].Id).toEqual(20);
                expect(dataObj[3].RecurrenceID).toEqual(10);
                expect(dataObj[3].Subject).toEqual('2nd occurrence edited twice');
                done();
            };
            expect(schObj.eventsData.length).toEqual(4);
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[2], null, true) as { [key: string]: Object };
            data.Subject = '2nd occurrence edited twice';
            schObj.saveEvent(data, 'EditOccurrence');
        });

        it('test cancel action begin event in edit occurrence', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            expect(schObj.eventsData.length).toEqual(4);
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[2], null, true) as { [key: string]: Object };
            schObj.saveEvent(data, 'EditOccurrence');
            expect(schObj.eventsData.length).toEqual(4);
        });

        it('test 4th occurrence edit', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                let exDate: string = <string>dataObj[0].RecurrenceException;
                expect(exDate.split(',').length).toEqual(2);
                expect(dataObj[4].Id).toEqual(21);
                expect(dataObj[4].RecurrenceID).toEqual(10);
                expect(dataObj[4].Subject).toEqual('4th occurrence edited');
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            expect(schObj.eventsData.length).toEqual(4);
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[4], null, true) as { [key: string]: Object };
            data.Id = 21;
            data.Subject = '4th occurrence edited';
            schObj.saveEvent(data, 'EditOccurrence');
        });

        it('test cancel action begin event in edit series', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            expect(schObj.eventsData.length).toEqual(5);
            schObj.saveEvent(schObj.eventsProcessed[0] as { [key: string]: Object }, 'EditSeries');
            expect(schObj.eventsData.length).toEqual(5);
        });

        it('test edit series', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            let data: { [key: string]: Object } = {
                Id: 10,
                Subject: 'recurrence',
                StartTime: new Date(2017, 9, 16, 10, 0),
                EndTime: new Date(2017, 9, 16, 11, 0),
                AllDay: false,
                RecurrenceID: 10,
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            };
            schObj.saveEvent(data, 'EditSeries');
        });

        it('test edit series', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            let data: { [key: string]: Object } = {
                Id: 10,
                Subject: 'recurrence edited',
                StartTime: new Date(2017, 9, 16, 10, 0),
                EndTime: new Date(2017, 9, 16, 11, 0),
                AllDay: true,
                RecurrenceID: 10,
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            };
            schObj.saveEvent(data, 'EditSeries');
        });

        it('allowEditing API checking', () => {
            schObj.eventSettings.allowEditing = false;
            schObj.dataBind();
            schObj.saveEvent(schObj.eventsData[0] as { [key: string]: Object });
            expect(schObj.eventsData.length).toEqual(3);
        });
    });

    describe('Delete Actions', () => {
        let schObj: Schedule;
        let testData: { [key: string]: Object }[] = [{
            Id: 10,
            Subject: 'recurrence event',
            StartTime: new Date(2017, 9, 19, 10, 0),
            EndTime: new Date(2017, 9, 19, 11, 0),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
        }, {
            Id: 11,
            Subject: 'event 1',
            StartTime: new Date(2017, 9, 19, 11, 0),
            EndTime: new Date(2017, 9, 19, 12, 30)
        }, {
            Id: 12,
            Subject: 'event 2',
            StartTime: new Date(2017, 9, 16, 11, 0),
            EndTime: new Date(2017, 9, 16, 12, 30)
        }, {
            Id: 13,
            Subject: 'event 3',
            StartTime: new Date(2017, 9, 17, 11, 0),
            EndTime: new Date(2017, 9, 17, 12, 30)
        }, {
            Id: 14,
            Subject: 'event 4',
            StartTime: new Date(2017, 9, 18, 11, 0),
            EndTime: new Date(2017, 9, 18, 12, 30)
        }];
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 9, 18) };
            schObj = util.createSchedule(schOptions, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before delete checking', () => {
            expect(schObj.eventsData.length).toEqual(5);
        });

        it('Checking cancel action begin event for delete', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            schObj.deleteEvent(10);
            expect(schObj.eventsData.length).toEqual(5);
        });

        it('test normal appointment delete using id', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            schObj.deleteEvent(11);
        });

        it('test normal appointment, delete using string id', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            schObj.deleteEvent('12');
        });

        it('test normal appointment, delete using object', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            let data: { [key: string]: Object } = {
                Id: 12,
                Subject: 'event 2',
                StartTime: new Date(2017, 9, 16, 11, 0),
                EndTime: new Date(2017, 9, 16, 12, 30)
            };
            schObj.deleteEvent(data);
        });

        it('test normal appointment, delete using array of object', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            let data: { [key: string]: Object }[] = [{
                Id: 13,
                Subject: 'event 3',
                StartTime: new Date(2017, 9, 17, 11, 0),
                EndTime: new Date(2017, 9, 17, 12, 30)
            }, {
                Id: 14,
                Subject: 'event 4',
                StartTime: new Date(2017, 9, 18, 11, 0),
                EndTime: new Date(2017, 9, 18, 12, 30)
            }];
            schObj.deleteEvent(data);
        });

        it('test recurrence appointment delete occurrence', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            let occurence: { [key: string]: Object } = {
                Id: 10,
                RecurrenceID: 10,
                Subject: 'Be 2',
                StartTime: new Date(2017, 9, 19, 10, 0),
                EndTime: new Date(2017, 9, 19, 11, 0),
                IsAllDay: false,
                RecurrenceException: '2017-10-19T04:30:00:000z',
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
            };
            schObj.deleteEvent(occurence, 'DeleteOccurrence');
        });

        it('test recurrence appointment delete series', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(0);
                done();
            };
            let data: { [key: string]: Object }[] = [{
                Id: 10,
                Subject: 'Be 2',
                RecurrenceID: 10,
                StartTime: new Date(2017, 9, 19, 10, 0),
                EndTime: new Date(2017, 9, 19, 11, 0),
                IsAllDay: false,
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
            }];
            schObj.deleteEvent(data, 'DeleteSeries');
        });

        it('test add recurrence event', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(4);
                done();
            };
            let data: { [key: string]: Object }[] = [{
                Id: 10,
                Subject: 'daily recurrence',
                StartTime: new Date(2017, 9, 18, 10, 0),
                EndTime: new Date(2017, 9, 18, 11, 0),
                IsAllDay: false,
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            }];
            schObj.addEvent(data);
        });

        it('allowDeleting API checking', () => {
            schObj.eventSettings.allowDeleting = false;
            schObj.dataBind();
            schObj.deleteEvent(10, 'DeleteSeries');
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('enabling allowDeleting API', () => {
            schObj.eventSettings.allowDeleting = true;
            schObj.dataBind();
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('test delete series without edit any occurrence', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(0);
                done();
            };
            schObj.deleteEvent(10, 'DeleteSeries');
        });
    });

    describe('Remote data testing', () => {
        let schObj: Schedule;
        let dataSource: Object[] = cloneDataSource(defaultData.slice(0, 10));
        let eventData: Object[] = [{
            Id: 1,
            Subject: 'Remote Data Testing',
            StartTime: new Date(2019, 11, 2, 10),
            EndTime: new Date(2019, 11, 2, 11, 30),
            IsAllDay: false
        }];
        beforeAll(() => {
            jasmine.Ajax.install();
            let dataManager: DataManager = new DataManager({
                url: 'api/Schedule/GetData/',
                crudUrl: 'api/Schedule/UpdateData/',
                adaptor: new UrlAdaptor()
            });
            let model: ScheduleModel = {
                selectedDate: new Date(2019, 11, 5),
                currentView: 'Month',
                eventSettings: { query: new Query() },
                actionComplete: (args: ActionEventArgs) => {
                    if (args.requestType === 'eventCreated') {
                        jasmine.Ajax.requests.reset();
                    }
                }
            };
            schObj = util.createSchedule(model, dataManager);
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1) || jasmine.Ajax.requests.mostRecent();
            request.respondWith({ 'status': 200, 'responseText': JSON.stringify({ d: dataSource, __count: dataSource.length }) });
            done();
        });
        it('add action using remote data', () => {
            jasmine.Ajax.requests.reset();
            expect(schObj.eventsData.length).toEqual(10);
            dataSource = dataSource.concat(eventData);
            schObj.addEvent(eventData);
        });
        it('action complete checking for add action result', () => {
            expect(schObj.eventsData.length).toEqual(10);
        });
        it('event get action after adding new event', () => {
            expect(schObj.eventsData.length).toEqual(11);
        });
        afterAll(() => {
            util.destroy(schObj);
            jasmine.Ajax.uninstall();
        });
    });

    describe('Timezone Events', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 1), timezone: 'Asia/Kolkata' };
            schObj = util.createSchedule(schOptions, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before add checking', () => {
            expect(schObj.eventsData.length).toEqual(0);
        });

        it('checking with both start and end timezone', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            let data: { [key: string]: Object } = {
                Id: 8,
                Subject: 'test',
                StartTime: new Date(2017, 9, 30, 10, 0),
                EndTime: new Date(2017, 9, 30, 12, 30),
                IsAllDay: false,
                StartTimezone: 'Asia/Kolkata',
                EndTimezone: 'Asia/Kolkata'
            };
            schObj.addEvent(data);
        });

        it('checking with start timezone', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            let data: { [key: string]: Object } = {
                Id: 10,
                Subject: 'test',
                StartTime: new Date(2017, 9, 30, 10, 0),
                EndTime: new Date(2017, 11, 1, 9, 0),
                IsAllDay: false,
                StartTimezone: 'Asia/Kolkata',
            };
            schObj.addEvent(data);
        });

        it('checking with end timezone', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            let data: { [key: string]: Object } = {
                Id: 10,
                Subject: 'test',
                StartTime: new Date(2017, 8, 16, 10, 0),
                EndTime: new Date(2017, 9, 16, 12, 30),
                IsAllDay: false,
                EndTimezone: 'Asia/Kolkata'
            };
            schObj.addEvent(data);
        });

        it('delete appointment', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(0);
                done();
            };
            schObj.deleteEvent(schObj.eventsData as { [key: string]: Object }[], 'DeleteSeries');
        });

        it('add events while schedule timezone set', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            let data: { [key: string]: Object } = {
                Id: 10,
                Subject: 'test',
                StartTime: new Date(2017, 9, 30, 10, 0),
                EndTime: new Date(2017, 9, 30, 12, 30)
            };
            expect(schObj.eventsData.length).toEqual(0);
            schObj.addEvent(data);
        });

        it('add events while schedule timezone in default', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            schObj.timezone = null;
            let data: { [key: string]: Object } = {
                Id: 11,
                Subject: 'test',
                StartTime: new Date(2017, 9, 30, 10, 0),
                EndTime: new Date(2017, 9, 30, 12, 30),
                StartTimezone: 'Asia/Kolkata',
                EndTimezone: 'Asia/Kolkata'
            };
            expect(schObj.eventsData.length).toEqual(1);
            schObj.addEvent(data);
        });
    });

    describe('Timezone Recurrence Events', () => {
        let schObj: Schedule;
        let datas: Object[] = [{
            Id: 8,
            Subject: 'test',
            StartTime: '2017-10-30T10:00:00.000Z',
            EndTime: '2017-10-30T12:00:00.000Z',
            IsAllDay: false,
            StartTimezone: 'Europe/Moscow',
            EndTimezone: 'Europe/Moscow',
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10;'
        }];
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 1), timezone: 'UTC' };
            schObj = util.createSchedule(schOptions, datas, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('delete occurrence', (done: Function) => {
            schObj.dataBound = () => {
                let elements: NodeListOf<Element> = schObj.element.querySelectorAll('.e-appointment');
                let event: { [key: string]: Object } = schObj.getEventDetails(elements[0]) as { [key: string]: Object };
                expect(elements.length).toEqual(5);
                expect(event.RecurrenceException).not.toBeNull();
                done();
            };
            let recurrenceEle: NodeListOf<Element> = schObj.element.querySelectorAll('.e-recurrence-icon');
            expect(recurrenceEle.length).toEqual(6);
            let appointmentElement: HTMLElement = closest(recurrenceEle[1], '.e-appointment') as HTMLElement;
            appointmentElement.click();
            (<HTMLElement>(<HTMLElement>schObj.quickPopup.quickPopup.content).querySelector('.e-event-edit')).click();
            (<HTMLElement>schObj.eventWindow.dialogObject.element.querySelector('.e-event-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-delete')).click();
        });
    });

    describe('Public methods', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            schObj = util.createSchedule({ selectedDate: new Date(2017, 10, 1) }, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('getOccurrencesByID', () => {
            let occurrence: Object[] = schObj.getOccurrencesByID(11);
            expect(occurrence.length).toBe(5);
        });

        it('getOccurrencesByRange', () => {
            let occurrence: Object[] = schObj.getOccurrencesByRange(new Date(2017, 9, 29), new Date(2017, 10, 4));
            expect(occurrence.length).toBe(1);
        });
    });

    describe('Event Id as string', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(schOptions, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before add checking', () => {
            expect(schObj.eventsData.length).toEqual(0);
        });

        it('After add checking', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                let dataObj: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect(dataObj.Subject).toEqual('New');
                expect(dataObj.Id).toEqual('4');
                done();
            };
            let data: { [key: string]: Object } = {
                Id: '4',
                Subject: 'New',
                StartTime: new Date(2017, 10, 1, 10, 0),
                EndTime: new Date(2017, 10, 1, 11, 0),
                IsAllDay: false
            };
            schObj.addEvent(data);
        });

        it('actionBegin before add event checking', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            schObj.addEvent(stringData[0] as { [key: string]: Object });
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('Multiple events add checking', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect(dataObj[2].Subject).toEqual('Event2');
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            schObj.addEvent(stringData);
        });

        it('actionBegin before save event checking', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            let data: { [key: string]: Object } = {
                Id: '2',
                Subject: 'Edited',
                StartTime: new Date(2017, 10, 1, 10, 0),
                EndTime: new Date(2017, 10, 1, 11, 30),
                IsAllDay: false
            };
            schObj.saveEvent(data);
            let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
            expect(dataObj[1].Subject).toEqual('Event1');
        });

        it('Save normal appointment', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect(dataObj[2].Subject).toEqual('Edited');
                expect(dataObj[2].Id).toEqual('2');
                done();
            };
            let data: { [key: string]: Object } = {
                Id: '2',
                Subject: 'Edited',
                StartTime: new Date(2017, 10, 1, 10, 0),
                EndTime: new Date(2017, 10, 1, 11, 30),
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            schObj.saveEvent(data);
        });

        it('Before delete normal appointment checking', () => {
            expect(schObj.eventsData.length).toEqual(5);
        });

        it('Checking action begin event for delete a normal appointment', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            schObj.deleteEvent('2');
            expect(schObj.eventsData.length).toEqual(5);
        });

        it('Normal appointment delete checking', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            schObj.deleteEvent('2');
        });

        it('Action begin event for edit occurrence save checking ', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            let data: { [key: string]: Object } = {
                Id: 'rEvent1',
                Subject: 'Meeting',
                StartTime: new Date(2017, 9, 31, 12, 0),
                EndTime: new Date(2017, 9, 31, 13, 0),
                RecurrenceID: 'recEvent',
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
            };
            schObj.currentAction = 'EditOccurrence';
            schObj.saveEvent(data, schObj.currentAction);
        });

        it('After recurrence appointment, edit occurrence save checking', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditOccurrence');
                expect(schObj.eventsData.length).toEqual(5);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                let exDate: string = <string>dataObj[3].RecurrenceException;
                expect(exDate.split(',').length).toEqual(1);
                expect(dataObj[4].RecurrenceID).toEqual('recEvent');
                done();
            };
            schObj.currentAction = 'EditOccurrence';
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[3], null, true) as { [key: string]: Object };
            data.Id = 'rEvent1';
            schObj.saveEvent(data, schObj.currentAction);
        });

        it('After recurrence appointment, edit series save checking', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect(dataObj[3].RecurrenceException).toEqual(null);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            let data: { [key: string]: Object } = {
                Id: 'rEvent2',
                Subject: 'Meeting',
                StartTime: new Date(2017, 9, 30, 12, 0),
                EndTime: new Date(2017, 9, 30, 13, 0),
                RecurrenceID: 'recEvent',
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            };
            schObj.saveEvent(data, 'EditSeries');
        });

        it('Delete recurrence appointment', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            let datas: { [key: string]: Object } = {
                Id: 'recEvent',
                Subject: 'Meeting',
                StartTime: new Date(2017, 9, 30, 12, 0),
                EndTime: new Date(2017, 9, 30, 13, 0),
                AllDay: false,
                RecurrenceID: 'recEvent',
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
            };
            schObj.deleteEvent(datas, 'DeleteOccurrence');
        });

        it('Delete series appointment', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            let datas: { [key: string]: Object } = {
                Id: 'recEvent',
                Subject: 'Meeting',
                StartTime: new Date(2017, 9, 30, 12, 0),
                EndTime: new Date(2017, 9, 30, 13, 0),
                AllDay: false,
                RecurrenceID: 'recEvent',
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
            };
            schObj.deleteEvent(datas, 'DeleteSeries');
        });
    });

    describe('EJ2-24382 - isSlotAvaliable method is not working properly, while using saveEvent public method', () => {
        let schObj: Schedule;
        let scheduleData: Object[] = [{
            Id: 1,
            Subject: 'Conference',
            StartTime: new Date(2018, 6, 4, 10, 0),
            EndTime: new Date(2018, 6, 4, 11, 30),
            IsAllDay: false
        }, {
            Id: 2,
            Subject: 'Meeting',
            StartTime: new Date(2018, 6, 4, 12, 0),
            EndTime: new Date(2018, 6, 4, 14, 30),
            IsAllDay: false
        }];
        beforeAll((done: Function) => {
            let scheduleOptions: ScheduleModel = {
                width: '500px', height: '500px',
                selectedDate: new Date(2018, 6, 1),
                actionBegin: (args: ActionEventArgs) => {
                    if (args.data) {
                        let eventData: Object = args.data instanceof Array ? args.data[0] : args.data;
                        args.cancel = !schObj.isSlotAvailable(eventData);
                    }
                }
            };
            schObj = util.createSchedule(scheduleOptions, scheduleData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Start time and End time value null or undefined testing', () => {
            expect(schObj.isSlotAvailable(new Date(), null)).toEqual(true);
            expect(schObj.isSlotAvailable(new Date(), new Date())).toEqual(true);
        });

        it('slot checking using public save event method', () => {
            let appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            expect(appointment.querySelector('.e-subject').textContent).toEqual('Meeting');
            schObj.dataBound = () => {
                let appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
                expect(appointment.querySelector('.e-subject').textContent).toEqual('Meeting - Edited');
            };
            let eventData: { [key: string]: Object } = {
                Id: 2,
                Subject: 'Meeting - Edited',
                StartTime: new Date(2018, 6, 4, 12),
                EndTime: new Date(2018, 6, 4, 14, 30),
                IsAllDay: false
            };
            schObj.saveEvent(eventData);
        });
    });

    describe('Save Actions with Future Occurrences', () => {
        let schObj: Schedule;
        let timezone: Timezone = new Timezone();
        let events: Object[] = [
            {
                Id: 10,
                Subject: 'recurrence event',
                StartTime: timezone.removeLocalOffset(new Date(2017, 9, 16, 10, 0)),
                EndTime: timezone.removeLocalOffset(new Date(2017, 9, 16, 11, 0)),
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=15;'
            }
        ];
        beforeAll((done: Function) => {
            let eventSettingOption: EventSettingsModel = {
                editFollowingEvents: true,
                dataSource: cloneDataSource(events)
            };
            let schOptions: ScheduleModel = {
                height: '500px',
                selectedDate: new Date(2017, 9, 16),
                eventSettings: eventSettingOption
            };
            schObj = util.createSchedule(schOptions, events, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before save checking', () => {
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('test edit occurrence', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('recurrence event');
                expect(dataObj[0].RecurrenceException as string).toEqual('20171018T100000Z');
                expect(dataObj[1].Id).toEqual(11);
                expect(dataObj[1].RecurrenceID).toEqual(10);
                expect(dataObj[1].Subject).toEqual('2nd occurrence edited');
                done();
            };
            expect(schObj.eventsData.length).toEqual(1);
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[2], null, true) as { [key: string]: Object };
            data.Subject = '2nd occurrence edited';
            data.Id = 11;
            schObj.saveEvent(data, 'EditOccurrence');
        });

        it('test edited occurrence save', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('recurrence event');
                expect(dataObj[1].Id).toEqual(11);
                expect(dataObj[1].RecurrenceID).toEqual(10);
                expect(dataObj[1].Subject).toEqual('2nd occurrence edited twice');
                done();
            };
            expect(schObj.eventsData.length).toEqual(2);
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[2], null, true) as { [key: string]: Object };
            data.Subject = '2nd occurrence edited twice';
            schObj.saveEvent(data, 'EditOccurrence');
        });
        it('test edit with future occurrences only option', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditFollowingEvents');
                expect(schObj.eventsData.length).toEqual(3);
                let dataObj: { [key: string]: Object }[] = schObj.eventsProcessed as { [key: string]: Object }[];
                expect(dataObj[3].Id).toEqual(12);
                expect(dataObj[3].Subject).toEqual('future event edit parent');
                expect(dataObj[3].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                expect(dataObj[0].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171018T100000Z;');
                done();
            };
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[3], null, true) as { [key: string]: Object };
            data.Id = 12;
            data.FollowingID = 10;
            data.Subject = 'future event edit parent';
            schObj.saveEvent(data, 'EditFollowingEvents');
        });
        it('test edit with future occurrences only option on existing edited future occurrences', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditFollowingEvents');
                expect(schObj.eventsData.length).toEqual(4);
                let dataObj: { [key: string]: Object }[] = schObj.eventsProcessed as { [key: string]: Object }[];
                let eventObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect(eventObj[3].Id).toEqual(13);
                expect(eventObj[3].FollowingID).toEqual(12);
                expect(eventObj[3].Subject).toEqual('future event edit child1');
                expect(eventObj[3].RecurrenceRule).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                expect(dataObj[0].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171018T100000Z;');
                expect(dataObj[3].Subject).toEqual('future event edit parent');
                expect(dataObj[3].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171020T100000Z;');
                done();
            };
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[5], null, true) as { [key: string]: Object };
            data.Id = 13;
            data.FollowingID = 12;
            data.Subject = 'future event edit child1';
            schObj.saveEvent(data, 'EditFollowingEvents');
        });
        it('test edit occurrence on already edited occurrences with future occurence option ', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditOccurrence');
                expect(schObj.eventsData.length).toEqual(5);
                let dataObj: { [key: string]: Object }[] = schObj.eventsProcessed as { [key: string]: Object }[];
                let eventData: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect(dataObj[5].Id).toEqual(14);
                expect(dataObj[5].RecurrenceID).toEqual(13);
                expect(dataObj[5].Subject).toEqual('Edit occurence on future edited event');
                expect(dataObj[5].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                expect(eventData[3].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                done();
            };
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[5], null, true) as { [key: string]: Object };
            data.Id = 14;
            data.RecurrenceID = 13;
            delete (data.FollowingID);
            data.Subject = 'Edit occurence on future edited event';
            schObj.saveEvent(data, 'EditOccurrence');
        });
        it('test edit future occurrences after edit single occurrence ', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditFollowingEvents');
                expect(schObj.eventsData.length).toEqual(4);
                let dataObj: { [key: string]: Object }[] = schObj.eventsProcessed as { [key: string]: Object }[];
                expect(dataObj[3].Id).toEqual(15);
                expect(dataObj[3].Subject).toEqual('Edit future edited occurence');
                expect(dataObj[3].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                done();
            };
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[3], null, true) as { [key: string]: Object };
            data.Id = 15;
            data.FollowingID = 12;
            data.Subject = 'Edit future edited occurence';
            schObj.saveEvent(data, 'EditFollowingEvents');
        });
        it('test edit series', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditSeries');
                expect(schObj.eventsData.length).toEqual(1);
                let dataObj: { [key: string]: Object }[] = schObj.eventsProcessed as { [key: string]: Object }[];
                expect(dataObj[0].Id).toEqual(10);
                expect(dataObj[0].Subject).toEqual('Edit entire series');
                expect(dataObj[0].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T043000Z;');
                done();
            };
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[0], null, true) as { [key: string]: Object };
            data.Subject = 'Edit entire series';
            data.RecurrenceRule = 'FREQ=DAILY;INTERVAL=1;UNTIL=20171030T043000Z;';
            schObj.saveEvent(data, 'EditSeries');
        });
        it('test edit following events', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                let dataObj: { [key: string]: Object }[] = schObj.eventsProcessed as { [key: string]: Object }[];
                expect(dataObj[0].Id).toEqual(11);
                expect(dataObj[0].Subject).toEqual('Edit following events');
                expect(dataObj[0].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171029T100000Z;');
                done();
            };
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[0], null, true) as { [key: string]: Object };
            data.Subject = 'Edit following events';
            data.Id = 11;
            data.FollowingID = 10;
            schObj.saveEvent(data, 'EditFollowingEvents');
        });

        it('test edit occurrence to Ensure Ignore edited occurrence', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect((<string>dataObj[1].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[2].Subject).toEqual('occurrence edited');
                expect(dataObj[1].RecurrenceException as string).toEqual('20171018T100000Z');
                done();
            };
            expect(schObj.eventsData.length).toEqual(2);
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[2], null, true) as { [key: string]: Object };
            data.Subject = 'occurrence edited';
            data.Id = 12;
            schObj.saveEvent(data, 'EditOccurrence');
        });

        it('test edit future occurrences with Ignore edited occurrence ', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditFollowingEvents');
                let dataObj: { [key: string]: Object }[] = schObj.eventsProcessed as { [key: string]: Object }[];
                let eventObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect(eventObj.length).toEqual(4);
                expect(eventObj[3].FollowingID).toEqual(11);
                expect(dataObj[1].Id).toEqual(13);
                expect(dataObj[1].Subject).toEqual('Edit future edited occurence');
                expect(dataObj[1].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171029T100000Z;');
                done();
            };
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[1], null, true) as { [key: string]: Object };
            data.Id = 13;
            data.FollowingID = 11;
            data.RecurrenceException = '20171018T100000Z';
            delete data.RecurrenceID;
            schObj.uiStateValues.isIgnoreOccurrence = true;
            data.Subject = 'Edit future edited occurence';
            schObj.saveEvent(data, 'EditFollowingEvents');
        });

        it('test edit series with updated recurrence rule', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditSeries');
                expect(schObj.eventsData.length).toEqual(1);
                let dataObj: { [key: string]: Object }[] = schObj.eventsProcessed as { [key: string]: Object }[];
                expect(dataObj[1].Id).toEqual(10);
                expect(dataObj[1].FollowingID).toEqual(undefined);
                expect(dataObj[1].Subject).toEqual('Edit Series');
                expect(dataObj[1].RecurrenceRule as string).toEqual('FREQ=DAILY;');
                done();
            };
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[0], null, true) as { [key: string]: Object };
            data.Subject = 'Edit Series';
            data.RecurrenceRule = 'FREQ=DAILY;';
            schObj.saveEvent(data, 'EditSeries');
        });
    });

    describe('Save & Delete Actions with Future Occurrences', () => {
        let schObj: Schedule;
        let timezone: Timezone = new Timezone();
        let events: Object[] = [{
            Id: 10,
            Subject: 'recurrence event',
            StartTime: timezone.removeLocalOffset(new Date(2017, 9, 16, 10, 0)),
            EndTime: timezone.removeLocalOffset(new Date(2017, 9, 16, 11, 0)),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=15;'
        }];
        beforeAll((done: Function) => {
            let eventSettingOption: EventSettingsModel = {
                editFollowingEvents: true,
                dataSource: cloneDataSource(events)
            };
            let schOptions: ScheduleModel = {
                height: '500px',
                selectedDate: new Date(2017, 9, 16),
                eventSettings: eventSettingOption
            };
            schObj = util.createSchedule(schOptions, events, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before save checking', () => {
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('test edit occurrence', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditOccurrence');
                expect(schObj.eventsData.length).toEqual(2);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('recurrence event');
                expect(dataObj[0].RecurrenceException as string).toEqual('20171018T100000Z');
                expect(dataObj[1].Id).toEqual(20);
                expect(dataObj[1].RecurrenceID).toEqual(10);
                expect(dataObj[1].Subject).toEqual('2nd occurrence edited');
                done();
            };
            expect(schObj.eventsData.length).toEqual(1);
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[2], null, true) as { [key: string]: Object };
            data.Subject = '2nd occurrence edited';
            data.Id = 20;
            schObj.saveEvent(data, 'EditOccurrence');
        });
        it('test edit with future occurrences only option', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditFollowingEvents');
                expect(schObj.eventsData.length).toEqual(3);
                let dataObj: { [key: string]: Object }[] = schObj.eventsProcessed as { [key: string]: Object }[];
                let eventObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect(eventObj[0].RecurrenceException).toEqual('20171018T100000Z');
                expect(dataObj[3].Id).toEqual(21);
                expect(dataObj[3].Subject).toEqual('future event edit parent');
                expect(dataObj[3].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                expect(dataObj[0].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171018T100000Z;');
                done();
            };
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[3].click();
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[3], null, true) as { [key: string]: Object };
            data.Id = 21;
            data.FollowingID = 10;
            data.Subject = 'future event edit parent';
            data.StartTime = timezone.removeLocalOffset(new Date(2017, 9, 19, 10, 0));
            schObj.saveEvent(data, 'EditFollowingEvents');
        });
        it('test edit with future occurrences only option on existing edited future occurrences', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditFollowingEvents');
                expect(schObj.eventsData.length).toEqual(4);
                let dataObj: { [key: string]: Object }[] = schObj.eventsProcessed as { [key: string]: Object }[];
                expect(dataObj[5].Id).toEqual(22);
                expect(dataObj[5].Subject).toEqual('future event edit child1');
                expect(dataObj[5].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                expect(dataObj[3].RecurrenceRule).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171020T100000Z;');
                done();
            };
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[5], null, true) as { [key: string]: Object };
            data.Id = 22;
            data.Subject = 'future event edit child1';
            data.FollowingID = 21;
            schObj.saveEvent(data, 'EditFollowingEvents');
        });
        it('test edit occurrence on already edited occurrences with future occurence option ', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditOccurrence');
                expect(schObj.eventsData.length).toEqual(5);
                let dataObj: { [key: string]: Object }[] = schObj.eventsProcessed as { [key: string]: Object }[];
                let eventData: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                let exDate: string = eventData[3].RecurrenceException as string;
                expect(exDate.split(',').length).toEqual(1);
                expect(dataObj[5].Id).toEqual(23);
                expect(dataObj[5].RecurrenceID).toEqual(22);
                expect(dataObj[5].Subject).toEqual('Edit occurence on future edited event');
                expect(dataObj[5].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                expect(eventData[3].RecurrenceException as string).toEqual('20171021T100000Z');
                expect(eventData[3].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                done();
            };
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[5].click();
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[5], null, true) as { [key: string]: Object };
            data.Id = 23;
            data.Subject = 'Edit occurence on future edited event';
            schObj.saveEvent(data, 'EditOccurrence');
        });
        it('test delete future occurrences', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('DeleteFollowingEvents');
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[3].click();
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[2], null, true) as { [key: string]: Object };
            data.Id = 24;
            schObj.deleteEvent(data, 'DeleteFollowingEvents');
        });
        it('test delete series', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('DeleteSeries');
                expect(schObj.eventsData.length).toEqual(0);
                done();
            };
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[0], null, true) as { [key: string]: Object };
            data.Id = 10;
            data.RecurrenceID = 10;
            schObj.deleteEvent(data, 'DeleteSeries');
        });
    });

    describe('Delete Events with Future Occurences', () => {
        let schObj: Schedule;
        let testData: { [key: string]: Object }[] = [{
            Id: 10,
            Subject: 'recurrence event',
            StartTime: new Date(2017, 9, 16, 10, 0),
            EndTime: new Date(2017, 9, 16, 11, 0),
            RecurrenceException: '20171016T100000Z',
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=15;UNTIL=20171016T100000Z;'
        }, {
            Id: 11,
            Subject: 'event 1',
            StartTime: new Date(2017, 9, 19, 11, 0),
            EndTime: new Date(2017, 9, 19, 12, 30)
        }, {
            Id: 12,
            Subject: 'event 2',
            StartTime: new Date(2017, 9, 16, 11, 0),
            EndTime: new Date(2017, 9, 16, 12, 30)
        }, {
            Id: 13,
            Subject: 'event 3',
            StartTime: new Date(2017, 9, 17, 11, 0),
            EndTime: new Date(2017, 9, 17, 12, 30)
        }, {
            Id: 14,
            Subject: 'event 4',
            StartTime: new Date(2017, 9, 18, 11, 0),
            EndTime: new Date(2017, 9, 18, 12, 30)
        }, {
            Id: 15,
            Subject: 'recurrence event - Part1',
            FollowingID: 10,
            StartTime: new Date(2017, 9, 18, 10, 0),
            EndTime: new Date(2017, 9, 18, 11, 0),
            RecurrenceException: '20171019T100000Z',
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=15;UNTIL=20171019T100000Z;'
        }, {
            Id: 16,
            Subject: 'recurrence event - Part2',
            FollowingID: 15,
            StartTime: new Date(2017, 9, 20, 10, 0),
            EndTime: new Date(2017, 9, 20, 11, 0),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=15;'
        }, {
            Id: 17,
            Subject: 'recurrence event - Part1 edited',
            FollowingID: 16,
            RecurrenceID: 15,
            StartTime: new Date(2017, 9, 19, 10, 0),
            EndTime: new Date(2017, 9, 19, 11, 0),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=15;'
        }];
        beforeAll((done: Function) => {
            let eventSettingOption: EventSettingsModel = {
                editFollowingEvents: true,
                dataSource: cloneDataSource(testData)
            };
            let schOptions: ScheduleModel = {
                height: '500px',
                selectedDate: new Date(2017, 9, 16),
                eventSettings: eventSettingOption
            };
            schObj = util.createSchedule(schOptions, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before delete checking', () => {
            expect(schObj.eventsData.length).toEqual(8);
        });

        it('test normal appointment, delete using object', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            let occurence: { [key: string]: Object } = {
                Id: 15,
                RecurrenceID: 15,
                Subject: 'recurrence event - Part1',
                FollowingID: 10,
                StartTime: new Date(2017, 9, 19, 10, 0),
                EndTime: new Date(2017, 9, 19, 11, 0),
            };
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[6], null, true) as { [key: string]: Object };
            occurence.Guid = data.Guid;
            schObj.deleteEvent(occurence, 'DeleteFollowingEvents');
        });
        it('test recurrence appointment delete series', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(4);
                done();
            };
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[0], null, true) as { [key: string]: Object };
            data.Guid = data.Guid;
            schObj.deleteEvent(data, 'DeleteSeries');
        });

        it('test add recurrence event', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(8);
                done();
            };
            let data: { [key: string]: Object }[] = [{
                Id: 16,
                Subject: 'daily recurrence',
                StartTime: new Date(2017, 9, 18, 10, 0),
                EndTime: new Date(2017, 9, 18, 11, 0),
                IsAllDay: false,
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            }];
            schObj.addEvent(data);
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
