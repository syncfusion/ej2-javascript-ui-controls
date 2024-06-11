/* eslint-disable @typescript-eslint/no-explicit-any */
import { extend, closest } from '@syncfusion/ej2-base';
import { Query, DataManager, UrlAdaptor, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, EJ2Instance, ActionEventArgs, ScheduleModel,
    Timezone, EventSettingsModel, DataBindingEventArgs
} from '../../../src/schedule/index';
import * as cls from '../../../src/schedule/base/css-constant';
import { defaultData, stringData, cloneDataSource, resourceData } from '../base/datasource.spec';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { triggerMouseEvent } from '../util.spec';

/**
 * Schedule CRUD module
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Schedule CRUD', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Add Actions', () => {
        let schObj: Schedule;
        const eventData: Record<string, any> = {
            Id: 1,
            Subject: 'test event',
            StartTime: new Date(2017, 9, 19, 10, 0),
            EndTime: new Date(2017, 9, 19, 11, 0),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
        };
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 3) };
            schObj = util.createSchedule(schOptions, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before add checking', () => {
            expect(schObj.eventsData.length).toEqual(0);
        });

        it('After add checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            schObj.addEvent(eventData);
        });

        it('Multiple events add checking', (done: DoneFn) => {
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

        it('readonly API checking', () => {
            schObj.eventSettings.allowAdding = true;
            schObj.readonly = true;
            schObj.dataBind();
            schObj.addEvent(eventData);
            expect(schObj.eventsData.length).toEqual(8);
        });
    });

    describe('EJ2-54104 Problem with error message when we use more then one validation for fields', () => {
        let schObj: Schedule;
        const events: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Testing',
                StartTime: new Date(2018, 1, 11, 9, 0),
                EndTime: new Date(2018, 1, 11, 10, 0),
                IsAllDay: false
            }
        ];
        beforeAll((done: DoneFn) => {
            const customFn: () => boolean = () => {
                const startDate: Date = (document.querySelector('#StartTime') as any).ej2_instances[0].value;
                const endDate: Date = (document.querySelector('#EndTime') as any).ej2_instances[0].value;
                return endDate > startDate;
            };
            const schOptions: ScheduleModel = {
                height: '500px',
                selectedDate: new Date(2018, 1, 13), eventSettings: {
                    query: new Query(), fields: {
                        id: 'Id',
                        startTime: { name: 'StartTime', validation: { required: true } },
                        endTime: {
                            name: 'EndTime', validation: {
                                required: true, range: [
                                    customFn,
                                    'Please select a date greater than the startDate'
                                ]
                            }
                        }
                    }
                }
            };
            schObj = util.createSchedule(schOptions, events, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('End time validation', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const endElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            ((endElement as EJ2Instance).ej2_instances[0] as DateTimePicker).value = null;
            ((endElement as EJ2Instance).ej2_instances[0] as DateTimePicker).dataBind();
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            expect((dialogElement.querySelector('#EndTime-info') as HTMLElement).innerText)
                .toEqual('This field is required.');
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Start time greater than End time validation', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const endElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            ((endElement as EJ2Instance).ej2_instances[0] as DateTimePicker).value = new Date(2017, 9, 28);
            ((endElement as EJ2Instance).ej2_instances[0] as DateTimePicker).dataBind();
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            expect((dialogElement.querySelector('#EndTime-info') as HTMLElement).innerText)
                .toEqual('Please select a date greater than the startDate');
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });
    });

    describe('EJ2CORE-624 Script error occurred while saving the event using saveEvent method with timezone property', () => {
        let schObj: Schedule;
        const events: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Testing',
                StartTime: new Date(2018, 1, 11, 9, 0),
                EndTime: new Date(2018, 1, 11, 10, 0),
                IsAllDay: false
            }
        ];
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', timezone: 'UTC',
                selectedDate: new Date(2018, 1, 13), eventSettings: { query: new Query() }
            };
            schObj = util.createSchedule(schOptions, events, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking for save event using saveEvent method', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                expect(dataObj[0].Subject).toEqual('Edited');
                done();
            };
            const data: Record<string, any> = {
                Id: 1,
                Subject: 'Edited',
                StartTime: '2018-02-11T04:00:00.000Z',
                EndTime: '2018-02-11T04:00:00.000Z',
                IsAllDay: false
            };
            schObj.actionBegin = (args: ActionEventArgs) => { return args.cancel = false; };
            schObj.saveEvent(data);
        });
    });

    describe('Save Actions', () => {
        let schObj: Schedule;
        const events: Record<string, any>[] = [
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
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 9, 19), eventSettings: { query: new Query() } };
            schObj = util.createSchedule(schOptions, events, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before save checking', () => {
            expect(schObj.eventsData.length).toEqual(3);
        });

        it('Checking action begin event for save', () => {
            const data: Record<string, any> = {
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

        it('test normal appointment save', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                expect(dataObj[1].Subject).toEqual('event 1 edited');
                done();
            };
            const data: Record<string, any> = {
                Id: 11,
                Subject: 'event 1 edited',
                StartTime: new Date(2017, 9, 19, 11, 0),
                EndTime: new Date(2017, 9, 19, 12, 30)
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            schObj.saveEvent(data);
        });

        it('test normal appointment save with second parameter', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                expect(dataObj[1].IsAllDay).toBeTruthy();
                done();
            };
            const data: Record<string, any> = {
                Id: 11,
                Subject: 'event 1 edited',
                StartTime: new Date(2017, 9, 19, 11, 0),
                EndTime: new Date(2017, 9, 19, 12, 30),
                IsAllDay: true
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            schObj.saveEvent(data, 'Save');
        });

        it('test edit occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('recurrence event');
                expect(dataObj[3].Id).toEqual(20);
                expect(dataObj[3].RecurrenceID).toEqual(10);
                expect(dataObj[3].Subject).toEqual('2nd occurrence edited');
                done();
            };
            expect(schObj.eventsData.length).toEqual(3);
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[2], null, true) as Record<string, any>;
            data.Subject = '2nd occurrence edited';
            data.Id = 20;
            schObj.saveEvent(data, 'EditOccurrence');
        });

        it('test edited occurrence save', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('recurrence event');
                expect(dataObj[3].Id).toEqual(20);
                expect(dataObj[3].RecurrenceID).toEqual(10);
                expect(dataObj[3].Subject).toEqual('2nd occurrence edited twice');
                done();
            };
            expect(schObj.eventsData.length).toEqual(4);
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[2], null, true) as Record<string, any>;
            data.Subject = '2nd occurrence edited twice';
            schObj.saveEvent(data, 'EditOccurrence');
        });

        it('test cancel action begin event in edit occurrence', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            expect(schObj.eventsData.length).toEqual(4);
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[2], null, true) as Record<string, any>;
            schObj.saveEvent(data, 'EditOccurrence');
            expect(schObj.eventsData.length).toEqual(4);
        });

        it('test 4th occurrence edit', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                const exDate: string = <string>dataObj[0].RecurrenceException;
                expect(exDate.split(',').length).toEqual(2);
                expect(dataObj[4].Id).toEqual(21);
                expect(dataObj[4].RecurrenceID).toEqual(10);
                expect(dataObj[4].Subject).toEqual('4th occurrence edited');
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            expect(schObj.eventsData.length).toEqual(4);
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[4], null, true) as Record<string, any>;
            data.Id = 21;
            data.Subject = '4th occurrence edited';
            schObj.saveEvent(data, 'EditOccurrence');
        });

        it('test cancel action begin event in edit series', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            expect(schObj.eventsData.length).toEqual(5);
            schObj.saveEvent(schObj.eventsProcessed[0], 'EditSeries');
            expect(schObj.eventsData.length).toEqual(5);
        });

        it('test edit series', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            const data: Record<string, any> = {
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

        it('test recurrence appointment save', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            const data: Record<string, any> = {
                Id: 24,
                Subject: 'recurrence event',
                StartTime: new Date(2017, 9, 19, 10, 0),
                EndTime: new Date(2017, 9, 19, 11, 0),
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
                RecurrenceID: 10,
                Description: 'Recurrence event edited'
            };
            schObj.saveEvent(data, 'Save');
        });

        it('test edit series', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            const data: Record<string, any> = {
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
            schObj.saveEvent(schObj.eventsData[0]);
            expect(schObj.eventsData.length).toEqual(3);
        });

        it('test saveEvent with array type', () => {
            schObj.eventSettings.allowEditing = true;
            schObj.dataBind();
            schObj.saveEvent([schObj.eventsData[0]]);
            expect(schObj.eventsData.length).toEqual(3);
        });

        it('readonly API checking', () => {
            schObj.readonly = true;
            schObj.dataBind();
            schObj.saveEvent(schObj.eventsData[0]);
            expect(schObj.eventsData.length).toEqual(3);
        });
    });

    describe('Delete Actions', () => {
        let schObj: Schedule;
        const testData: Record<string, any>[] = [{
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
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 9, 18) };
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

        it('test normal appointment delete using id', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            schObj.deleteEvent(11);
        });

        it('test normal appointment, delete using object', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            const data: Record<string, any> = {
                Id: 12,
                Subject: 'event 2',
                StartTime: new Date(2017, 9, 16, 11, 0),
                EndTime: new Date(2017, 9, 16, 12, 30)
            };
            schObj.deleteEvent(data);
        });

        it('test normal appointment, delete using array of object', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            const data: Record<string, any>[] = [{
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

        it('test recurrence appointment delete occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            const occurence: Record<string, any> = {
                Id: 10,
                RecurrenceID: 10,
                Subject: 'Be 2',
                StartTime: new Date(2017, 9, 19, 10, 0),
                EndTime: new Date(2017, 9, 19, 11, 0),
                IsAllDay: false,
                RecurrenceException: '2017-10-19T04:30:00:000z',
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            };
            schObj.deleteEvent(occurence, 'DeleteOccurrence');
        });

        it('test recurrence appointment delete series', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(0);
                done();
            };
            const data: Record<string, any>[] = [{
                Id: 10,
                Subject: 'Be 2',
                RecurrenceID: 10,
                StartTime: new Date(2017, 9, 19, 10, 0),
                EndTime: new Date(2017, 9, 19, 11, 0),
                IsAllDay: false,
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            }];
            schObj.deleteEvent(data, 'DeleteSeries');
        });

        it('test add recurrence event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(4);
                done();
            };
            const data: Record<string, any>[] = [{
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

        it('readonly API checking', () => {
            schObj.eventSettings.allowDeleting = true;
            schObj.readonly = true;
            schObj.dataBind();
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('enabling allowDeleting API', () => {
            schObj.eventSettings.allowDeleting = true;
            schObj.readonly = false;
            schObj.dataBind();
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('test delete series without edit any occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(0);
                done();
            };
            schObj.deleteEvent(10, 'DeleteSeries');
        });
    });

    describe('Delete Actions with string id', () => {
        let schObj: Schedule;
        const testData: Record<string, any>[] = [{
            Id: '1',
            Subject: 'recurrence event',
            StartTime: new Date(2017, 9, 19, 10, 0),
            EndTime: new Date(2017, 9, 19, 11, 0),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
        }];
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 9, 18) };
            schObj = util.createSchedule(schOptions, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before delete checking', () => {
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('Checking cancel action begin event for delete', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            schObj.deleteEvent('1');
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('test normal appointment delete using string id', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(0);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            schObj.deleteEvent('1');
        });
    });

    describe('Remote data testing', () => {
        let schObj: Schedule;
        let dataSource: Record<string, any>[] = cloneDataSource(defaultData.slice(0, 10));
        let fetchSpy: any;
        beforeAll((done: DoneFn) => {
            fetchSpy = spyOn(window, 'fetch');
            fetchSpy.and.returnValue(Promise.resolve(new Response(JSON.stringify({ d: dataSource, __count: dataSource.length }), {
                    status: 200,
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                })
            ));
            const dataManager: DataManager = new DataManager({
                url: 'api/Schedule/GetData/',
                adaptor: new UrlAdaptor()
            });
            const model: ScheduleModel = {
                selectedDate: new Date(2019, 11, 5),
                currentView: 'Month',
                eventSettings: { query: new Query() }
            };
            schObj = util.createSchedule(model, dataManager);
            done();
        });
        beforeEach((done: DoneFn) => {
            done();
        });
        it('Check remote data loading', () => {
            expect(schObj.eventsData.length).toEqual(10);
        });
        afterAll(() => {
            fetchSpy.calls.reset();
            util.destroy(schObj);
        });
    });

    describe('Remote data CRUD testing', () => {
        let schObj: Schedule;
        let dataSource: Record<string, any>[] = cloneDataSource(defaultData.slice(0, 10));
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Remote Data Testing',
            StartTime: new Date(2019, 11, 2, 10),
            EndTime: new Date(2019, 11, 2, 11, 30),
            IsAllDay: false
        }];
        let fetchSpy: any;
        beforeAll(() => {
            const dataManager: DataManager = new DataManager({
                url: 'api/Schedule/GetData/',
                crudUrl: 'api/Schedule/UpdateData/',
                adaptor: new UrlAdaptor()
            });
            const model: ScheduleModel = {
                selectedDate: new Date(2019, 11, 5),
                currentView: 'Month',
                eventSettings: { query: new Query() },
            };
            schObj = util.createSchedule(model, dataManager);
        });
        beforeEach((done: DoneFn) => {
            fetchSpy = spyOn(window, 'fetch');
            fetchSpy.and.returnValue(Promise.resolve(new Response(JSON.stringify({ d: dataSource, __count: dataSource.length }), {
                    status: 200,
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                })
            ));
            done();
        });
        it('add action using remote data', () => {
            dataSource = dataSource.concat(eventData);
            schObj.addEvent(eventData);
        });
        it('action complete checking for add action result', () => {
            expect(schObj.eventsData.length).toEqual(0);
        });
        it('event get action after adding new event', () => {
            expect(schObj.eventsData.length).toEqual(11);
        });
        afterAll(() => {
            fetchSpy.calls.reset();
            util.destroy(schObj);
        });
    });

    xdescribe('Remote data testing with OdataV4 service', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const dataManager: DataManager = new DataManager({
                url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Orders/',
                adaptor: new ODataV4Adaptor(),
                crossDomain: true
            });
            const model: ScheduleModel = {
                selectedDate: new Date(1996, 6, 9),
                currentView: 'Month',
                eventSettings: {
                    query: new Query(),
                    includeFiltersInQuery: true,
                    fields: {
                        id: 'Id',
                        subject: { name: 'ShipName' },
                        location: { name: 'ShipCountry' },
                        description: { name: 'ShipAddress' },
                        startTime: { name: 'OrderDate' },
                        endTime: { name: 'RequiredDate' },
                        recurrenceRule: { name: 'ShipRegion' }
                    }
                }
            };
            schObj = util.createSchedule(model, dataManager, done);
            schObj.dataBinding = (args: DataBindingEventArgs) => {
                expect(args.result.length).toEqual(200);
                expect((args as any).query.params.length).toBe(0);
                expect((args as any).query.queries.length).toBe(1);
                const events: Record<string, any>[] = args.result.filter((x: Record<string, any>) => !x.ShipRegion);
                expect(events.length).toEqual(15);
                expect((args as any).xhr.url).toEqual('https://services.odata.org/V4/Northwind/Northwind.svc/Orders/?$filter=((((OrderDate%20ge%201996-06-30T00:00:00.000Z)%20and%20(RequiredDate%20ge%201996-06-30T00:00:00.000Z))%20and%20(OrderDate%20lt%201996-08-04T00:00:00.000Z))%20or%20((OrderDate%20le%201996-06-30T00:00:00.000Z)%20and%20(RequiredDate%20gt%201996-06-30T00:00:00.000Z)))%20or%20((ShipRegion%20ne%20null)%20and%20(ShipRegion%20ne%20%27%27))');
                done();
            };
            schObj.dataBound = () => {
                const appointmentEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(appointmentEle.length).toEqual(11);
                const moreIndicator: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicator.length).toEqual(27);
                expect(schObj.getCurrentViewEvents().length).toBe(15);
                done();
            };
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Check the server end filtering by disabling the includeFiltersInQuery property', (done: DoneFn) => {
            schObj.dataBinding = (args: DataBindingEventArgs) => {
                expect(args.result.length).toEqual(200);
                expect((args as any).query.params.length).toBe(2);
                expect((args as any).query.queries.length).toBe(0);
                const events: Record<string, any>[] = args.result.filter((x: Record<string, any>) => !x.ShipRegion);
                expect(events.length).toEqual(124);
                expect((args as any).xhr.url).toEqual('https://services.odata.org/V4/Northwind/Northwind.svc/Orders/?StartDate=1996-06-30T00:00:00.000Z&EndDate=1996-08-04T00:00:00.000Z');
                done();
            };
            schObj.dataBound = () => {
                const appointmentEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(appointmentEle.length).toEqual(11);
                const moreIndicator: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicator.length).toEqual(27);
                expect(schObj.getCurrentViewEvents().length).toBe(15);
                done();
            };
            schObj.eventSettings.includeFiltersInQuery = false;
            schObj.dataBind();
        });
    });

    describe('Timezone Events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 1), timezone: 'Asia/Kolkata' };
            schObj = util.createSchedule(schOptions, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before add checking', () => {
            expect(schObj.eventsData.length).toEqual(0);
        });

        it('checking with both start and end timezone', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            const data: Record<string, any> = {
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

        it('checking with start timezone', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            const data: Record<string, any> = {
                Id: 10,
                Subject: 'test',
                StartTime: new Date(2017, 9, 30, 10, 0),
                EndTime: new Date(2017, 11, 1, 9, 0),
                IsAllDay: false,
                StartTimezone: 'Asia/Kolkata'
            };
            schObj.addEvent(data);
        });

        it('checking with end timezone', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            const data: Record<string, any> = {
                Id: 10,
                Subject: 'test',
                StartTime: new Date(2017, 8, 16, 10, 0),
                EndTime: new Date(2017, 9, 16, 12, 30),
                IsAllDay: false,
                EndTimezone: 'Asia/Kolkata'
            };
            schObj.addEvent(data);
        });

        it('delete appointment', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(0);
                done();
            };
            schObj.deleteEvent(schObj.eventsData, 'DeleteSeries');
        });

        it('add events while schedule timezone set', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            const data: Record<string, any> = {
                Id: 10,
                Subject: 'test',
                StartTime: new Date(2017, 9, 30, 10, 0),
                EndTime: new Date(2017, 9, 30, 12, 30)
            };
            expect(schObj.eventsData.length).toEqual(0);
            schObj.addEvent(data);
        });

        it('add events while schedule timezone in default', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            schObj.timezone = null;
            const data: Record<string, any> = {
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
        const datas: Record<string, any>[] = [{
            Id: 8,
            Subject: 'test',
            StartTime: '2017-10-30T10:00:00.000Z',
            EndTime: '2017-10-30T12:00:00.000Z',
            IsAllDay: false,
            StartTimezone: 'Europe/Moscow',
            EndTimezone: 'Europe/Moscow',
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10;'
        }];
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 1), timezone: 'UTC' };
            schObj = util.createSchedule(schOptions, datas, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('delete occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                const elements: NodeListOf<Element> = schObj.element.querySelectorAll('.e-appointment');
                const event: Record<string, any> = schObj.getEventDetails(elements[0]) as Record<string, any>;
                expect(elements.length).toEqual(5);
                expect(event.RecurrenceException).not.toBeNull();
                done();
            };
            const recurrenceEle: NodeListOf<Element> = schObj.element.querySelectorAll('.e-recurrence-icon');
            expect(recurrenceEle.length).toEqual(6);
            const appointmentElement: HTMLElement = closest(recurrenceEle[1], '.e-appointment') as HTMLElement;
            appointmentElement.click();
            (<HTMLElement>(<HTMLElement>schObj.quickPopup.quickPopup.content).querySelector('.e-event-edit')).click();
            (<HTMLElement>schObj.eventWindow.dialogObject.element.querySelector('.e-event-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-delete')).click();
        });
    });

    describe('Public methods', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            schObj = util.createSchedule({ selectedDate: new Date(2017, 10, 1) }, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('getOccurrencesByID', () => {
            const occurrence: Record<string, any>[] = schObj.getOccurrencesByID(11);
            expect(occurrence.length).toBe(5);
        });

        it('getOccurrencesByRange', () => {
            const occurrence: Record<string, any>[] = schObj.getOccurrencesByRange(new Date(2017, 9, 29), new Date(2017, 10, 4));
            expect(occurrence.length).toBe(1);
        });
    });

    describe('Event Id as string', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(schOptions, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before add checking', () => {
            expect(schObj.eventsData.length).toEqual(0);
        });

        it('After add checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                const dataObj: Record<string, any> = schObj.eventsData[0];
                expect(dataObj.Subject).toEqual('New');
                expect(dataObj.Id).toEqual('4');
                done();
            };
            const data: Record<string, any> = {
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
            schObj.addEvent(stringData[0]);
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('Multiple events add checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                expect(dataObj[2].Subject).toEqual('Event2');
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            schObj.addEvent(stringData);
        });

        it('actionBegin before save event checking', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            const data: Record<string, any> = {
                Id: '2',
                Subject: 'Edited',
                StartTime: new Date(2017, 10, 1, 10, 0),
                EndTime: new Date(2017, 10, 1, 11, 30),
                IsAllDay: false
            };
            schObj.saveEvent(data);
            const dataObj: Record<string, any>[] = schObj.eventsData;
            expect(dataObj[1].Subject).toEqual('Event1');
        });

        it('Save normal appointment', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                expect(dataObj[2].Subject).toEqual('Edited');
                expect(dataObj[2].Id).toEqual('2');
                done();
            };
            const data: Record<string, any> = {
                Id: '2',
                Subject: 'Edited',
                StartTime: new Date(2017, 10, 1, 10, 0),
                EndTime: new Date(2017, 10, 1, 11, 30)
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

        it('Normal appointment delete checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            schObj.deleteEvent('2');
        });

        it('Action begin event for edit occurrence save checking ', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            const data: Record<string, any> = {
                Id: 'rEvent1',
                Subject: 'Meeting',
                StartTime: new Date(2017, 9, 31, 12, 0),
                EndTime: new Date(2017, 9, 31, 13, 0),
                RecurrenceID: 'recEvent',
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            };
            schObj.currentAction = 'EditOccurrence';
            schObj.saveEvent(data, schObj.currentAction);
        });

        it('After recurrence appointment, edit occurrence save checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditOccurrence');
                expect(schObj.eventsData.length).toEqual(5);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                const exDate: string = <string>dataObj[3].RecurrenceException;
                expect(exDate.split(',').length).toEqual(1);
                expect(dataObj[4].RecurrenceID).toEqual('recEvent');
                done();
            };
            schObj.currentAction = 'EditOccurrence';
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[3], null, true) as Record<string, any>;
            data.Id = 'rEvent1';
            schObj.saveEvent(data, schObj.currentAction);
        });

        it('After recurrence appointment, edit series save checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                expect(dataObj[3].RecurrenceException).toEqual(null);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            const data: Record<string, any> = {
                Id: 'rEvent2',
                Subject: 'Meeting',
                StartTime: new Date(2017, 9, 30, 12, 0),
                EndTime: new Date(2017, 9, 30, 13, 0),
                RecurrenceID: 'recEvent',
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            };
            schObj.saveEvent(data, 'EditSeries');
        });

        it('Delete recurrence appointment', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            const datas: Record<string, any> = {
                Id: 'recEvent',
                Subject: 'Meeting',
                StartTime: new Date(2017, 9, 30, 12, 0),
                EndTime: new Date(2017, 9, 30, 13, 0),
                AllDay: false,
                RecurrenceID: 'recEvent',
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            };
            schObj.deleteEvent(datas, 'DeleteOccurrence');
        });

        it('Delete series appointment', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            const datas: Record<string, any> = {
                Id: 'recEvent',
                Subject: 'Meeting',
                StartTime: new Date(2017, 9, 30, 12, 0),
                EndTime: new Date(2017, 9, 30, 13, 0),
                AllDay: false,
                RecurrenceID: 'recEvent',
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            };
            schObj.deleteEvent(datas, 'DeleteSeries');
        });
    });

    describe('EJ2-24382 - isSlotAvaliable method is not working properly, while using saveEvent public method', () => {
        let schObj: Schedule;
        const scheduleData: Record<string, any>[] = [{
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
        beforeAll((done: DoneFn) => {
            const scheduleOptions: ScheduleModel = {
                width: '500px', height: '500px',
                selectedDate: new Date(2018, 6, 1),
                actionBegin: (args: ActionEventArgs) => {
                    if (args.data) {
                        const eventData: Record<string, any> = args.data instanceof Array ? args.data[0] : args.data;
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
            const appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            expect(appointment.querySelector('.e-subject').textContent).toEqual('Meeting');
            schObj.dataBound = () => {
                const appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
                expect(appointment.querySelector('.e-subject').textContent).toEqual('Meeting - Edited');
            };
            const eventData: Record<string, any> = {
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
        const timezone: Timezone = new Timezone();
        const events: Record<string, any>[] = [
            {
                Id: 10,
                Subject: 'recurrence event',
                StartTime: timezone.removeLocalOffset(new Date(2017, 9, 16, 10, 0)),
                EndTime: timezone.removeLocalOffset(new Date(2017, 9, 16, 11, 0)),
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=15;'
            }
        ];
        beforeAll((done: DoneFn) => {
            const eventSettingOption: EventSettingsModel = {
                editFollowingEvents: true,
                dataSource: cloneDataSource(events)
            };
            const schOptions: ScheduleModel = {
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

        it('test edit occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('recurrence event');
                expect(dataObj[0].RecurrenceException as string).toEqual('20171018T100000Z');
                expect(dataObj[1].Id).toEqual(11);
                expect(dataObj[1].RecurrenceID).toEqual(10);
                expect(dataObj[1].Subject).toEqual('2nd occurrence edited');
                done();
            };
            expect(schObj.eventsData.length).toEqual(1);
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[2], null, true) as Record<string, any>;
            data.Subject = '2nd occurrence edited';
            data.Id = 11;
            schObj.saveEvent(data, 'EditOccurrence');
        });

        it('test edited occurrence save', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('recurrence event');
                expect(dataObj[1].Id).toEqual(11);
                expect(dataObj[1].RecurrenceID).toEqual(10);
                expect(dataObj[1].Subject).toEqual('2nd occurrence edited twice');
                done();
            };
            expect(schObj.eventsData.length).toEqual(2);
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[2], null, true) as Record<string, any>;
            data.Subject = '2nd occurrence edited twice';
            schObj.saveEvent(data, 'EditOccurrence');
        });
        it('test edit with future occurrences only option', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditFollowingEvents');
                expect(schObj.eventsData.length).toEqual(3);
                const dataObj: Record<string, any>[] = schObj.eventsProcessed;
                expect(dataObj[3].Id).toEqual(12);
                expect(dataObj[3].Subject).toEqual('future event edit parent');
                expect(dataObj[3].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                expect(dataObj[0].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171018T100000Z;');
                done();
            };
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[3], null, true) as Record<string, any>;
            data.Id = 12;
            data.FollowingID = 10;
            data.Subject = 'future event edit parent';
            schObj.saveEvent(data, 'EditFollowingEvents');
        });
        it('test edit with future occurrences only option on existing edited future occurrences', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditFollowingEvents');
                expect(schObj.eventsData.length).toEqual(4);
                const dataObj: Record<string, any>[] = schObj.eventsProcessed;
                const eventObj: Record<string, any>[] = schObj.eventsData;
                expect(eventObj[3].Id).toEqual(13);
                expect(eventObj[3].FollowingID).toEqual(12);
                expect(eventObj[3].Subject).toEqual('future event edit child1');
                expect(eventObj[3].RecurrenceRule).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                expect(dataObj[0].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171018T100000Z;');
                expect(dataObj[3].Subject).toEqual('future event edit parent');
                expect(dataObj[3].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171020T100000Z;');
                done();
            };
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[5], null, true) as Record<string, any>;
            data.Id = 13;
            data.FollowingID = 12;
            data.Subject = 'future event edit child1';
            schObj.saveEvent(data, 'EditFollowingEvents');
        });
        it('test edit occurrence on already edited occurrences with future occurence option ', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditOccurrence');
                expect(schObj.eventsData.length).toEqual(5);
                const dataObj: Record<string, any>[] = schObj.eventsProcessed;
                const eventData: Record<string, any>[] = schObj.eventsData;
                expect(dataObj[5].Id).toEqual(14);
                expect(dataObj[5].RecurrenceID).toEqual(13);
                expect(dataObj[5].Subject).toEqual('Edit occurence on future edited event');
                expect(dataObj[5].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                expect(eventData[3].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                done();
            };
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[5], null, true) as Record<string, any>;
            data.Id = 14;
            data.RecurrenceID = 13;
            delete (data.FollowingID);
            data.Subject = 'Edit occurence on future edited event';
            schObj.saveEvent(data, 'EditOccurrence');
        });
        it('test edit future occurrences after edit single occurrence ', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditFollowingEvents');
                expect(schObj.eventsData.length).toEqual(4);
                const dataObj: Record<string, any>[] = schObj.eventsProcessed;
                expect(dataObj[3].Id).toEqual(15);
                expect(dataObj[3].Subject).toEqual('Edit future edited occurence');
                expect(dataObj[3].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                done();
            };
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[3], null, true) as Record<string, any>;
            data.Id = 15;
            data.FollowingID = 12;
            data.Subject = 'Edit future edited occurence';
            schObj.saveEvent(data, 'EditFollowingEvents');
        });
        it('test edit series', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditSeries');
                expect(schObj.eventsData.length).toEqual(1);
                const dataObj: Record<string, any>[] = schObj.eventsProcessed;
                expect(dataObj[0].Id).toEqual(10);
                expect(dataObj[0].Subject).toEqual('Edit entire series');
                expect(dataObj[0].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T043000Z;');
                done();
            };
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[0], null, true) as Record<string, any>;
            data.Subject = 'Edit entire series';
            data.RecurrenceRule = 'FREQ=DAILY;INTERVAL=1;UNTIL=20171030T043000Z;';
            schObj.saveEvent(data, 'EditSeries');
        });
        it('test edit following events', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                const dataObj: Record<string, any>[] = schObj.eventsProcessed;
                expect(dataObj[0].Id).toEqual(11);
                expect(dataObj[0].Subject).toEqual('Edit following events');
                expect(dataObj[0].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                done();
            };
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[0], null, true) as Record<string, any>;
            data.Subject = 'Edit following events';
            data.Id = 11;
            data.FollowingID = 10;
            schObj.saveEvent(data, 'EditFollowingEvents');
        });

        it('test edit occurrence to Ensure Ignore edited occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                expect((<string>dataObj[1].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[2].Subject).toEqual('occurrence edited');
                expect(dataObj[1].RecurrenceException as string).toEqual('20171018T100000Z');
                done();
            };
            expect(schObj.eventsData.length).toEqual(2);
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[2], null, true) as Record<string, any>;
            data.Subject = 'occurrence edited';
            data.Id = 12;
            schObj.saveEvent(data, 'EditOccurrence');
        });

        it('test edit future occurrences with Ignore edited occurrence ', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditFollowingEvents');
                const dataObj: Record<string, any>[] = schObj.eventsProcessed;
                const eventObj: Record<string, any>[] = schObj.eventsData;
                expect(eventObj.length).toEqual(4);
                expect(eventObj[3].FollowingID).toEqual(11);
                expect(dataObj[1].Id).toEqual(13);
                expect(dataObj[1].Subject).toEqual('Edit future edited occurence');
                expect(dataObj[1].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                done();
            };
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[1], null, true) as Record<string, any>;
            data.Id = 13;
            data.FollowingID = 11;
            data.RecurrenceException = '20171018T100000Z';
            delete data.RecurrenceID;
            schObj.uiStateValues.isIgnoreOccurrence = true;
            data.Subject = 'Edit future edited occurence';
            schObj.saveEvent(data, 'EditFollowingEvents');
        });

        it('test edit series with updated recurrence rule', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditSeries');
                expect(schObj.eventsData.length).toEqual(1);
                const dataObj: Record<string, any>[] = schObj.eventsProcessed;
                expect(dataObj[1].Id).toEqual(10);
                expect(dataObj[1].FollowingID).toEqual(undefined);
                expect(dataObj[1].Subject).toEqual('Edit Series');
                expect(dataObj[1].RecurrenceRule as string).toEqual('FREQ=DAILY;');
                done();
            };
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[0], null, true) as Record<string, any>;
            data.Subject = 'Edit Series';
            data.RecurrenceRule = 'FREQ=DAILY;';
            schObj.saveEvent(data, 'EditSeries');
        });
    });

    describe('Save & Delete Actions with Future Occurrences', () => {
        let schObj: Schedule;
        const timezone: Timezone = new Timezone();
        const events: Record<string, any>[] = [{
            Id: 10,
            Subject: 'recurrence event',
            StartTime: timezone.removeLocalOffset(new Date(2017, 9, 16, 10, 0)),
            EndTime: timezone.removeLocalOffset(new Date(2017, 9, 16, 11, 0)),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=15;'
        }];
        beforeAll((done: DoneFn) => {
            const eventSettingOption: EventSettingsModel = {
                editFollowingEvents: true,
                dataSource: cloneDataSource(events)
            };
            const schOptions: ScheduleModel = {
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

        it('test edit occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditOccurrence');
                expect(schObj.eventsData.length).toEqual(2);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('recurrence event');
                expect(dataObj[0].RecurrenceException as string).toEqual('20171018T100000Z');
                expect(dataObj[1].Id).toEqual(20);
                expect(dataObj[1].RecurrenceID).toEqual(10);
                expect(dataObj[1].Subject).toEqual('2nd occurrence edited');
                done();
            };
            expect(schObj.eventsData.length).toEqual(1);
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[2], null, true) as Record<string, any>;
            data.Subject = '2nd occurrence edited';
            data.Id = 20;
            schObj.saveEvent(data, 'EditOccurrence');
        });
        it('test edit with future occurrences only option', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditFollowingEvents');
                expect(schObj.eventsData.length).toEqual(3);
                const dataObj: Record<string, any>[] = schObj.eventsProcessed;
                const eventObj: Record<string, any>[] = schObj.eventsData;
                expect(eventObj[0].RecurrenceException).toEqual('20171018T100000Z');
                expect(dataObj[3].Id).toEqual(21);
                expect(dataObj[3].Subject).toEqual('future event edit parent');
                expect(dataObj[3].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                expect(dataObj[0].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171018T100000Z;');
                done();
            };
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[3].click();
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[3], null, true) as Record<string, any>;
            data.Id = 21;
            data.FollowingID = 10;
            data.Subject = 'future event edit parent';
            data.StartTime = timezone.removeLocalOffset(new Date(2017, 9, 19, 10, 0));
            schObj.saveEvent(data, 'EditFollowingEvents');
        });
        it('test edit with future occurrences only option on existing edited future occurrences', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditFollowingEvents');
                expect(schObj.eventsData.length).toEqual(4);
                const dataObj: Record<string, any>[] = schObj.eventsProcessed;
                expect(dataObj[5].Id).toEqual(22);
                expect(dataObj[5].Subject).toEqual('future event edit child1');
                expect(dataObj[5].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                expect(dataObj[3].RecurrenceRule).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171020T100000Z;');
                done();
            };
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[5], null, true) as Record<string, any>;
            data.Id = 22;
            data.Subject = 'future event edit child1';
            data.FollowingID = 21;
            schObj.saveEvent(data, 'EditFollowingEvents');
        });
        it('test edit occurrence on already edited occurrences with future occurence option ', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditOccurrence');
                expect(schObj.eventsData.length).toEqual(5);
                const dataObj: Record<string, any>[] = schObj.eventsProcessed;
                const eventData: Record<string, any>[] = schObj.eventsData;
                const exDate: string = eventData[3].RecurrenceException as string;
                expect(exDate.split(',').length).toEqual(1);
                expect(dataObj[5].Id).toEqual(23);
                expect(dataObj[5].RecurrenceID).toEqual(22);
                expect(dataObj[5].Subject).toEqual('Edit occurence on future edited event');
                expect(dataObj[5].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                expect(eventData[3].RecurrenceException as string).toEqual('20171021T100000Z');
                expect(eventData[3].RecurrenceRule as string).toEqual('FREQ=DAILY;INTERVAL=1;UNTIL=20171030T100000Z;');
                done();
            };
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[5].click();
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[5], null, true) as Record<string, any>;
            data.Id = 23;
            data.Subject = 'Edit occurence on future edited event';
            schObj.saveEvent(data, 'EditOccurrence');
        });
        it('test delete future occurrences', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('DeleteFollowingEvents');
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[3].click();
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[2], null, true) as Record<string, any>;
            data.Id = 24;
            schObj.deleteEvent(data, 'DeleteFollowingEvents');
        });
        it('test delete series', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('DeleteSeries');
                expect(schObj.eventsData.length).toEqual(0);
                done();
            };
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[0], null, true) as Record<string, any>;
            data.Id = 10;
            data.RecurrenceID = 10;
            schObj.deleteEvent(data, 'DeleteSeries');
        });
    });

    describe('Delete Events with Future Occurences', () => {
        let schObj: Schedule;
        const testData: Record<string, any>[] = [{
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
        beforeAll((done: DoneFn) => {
            const eventSettingOption: EventSettingsModel = {
                editFollowingEvents: true,
                dataSource: cloneDataSource(testData)
            };
            const schOptions: ScheduleModel = {
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

        it('test normal appointment, delete using object', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            const occurence: Record<string, any> = {
                Id: 15,
                RecurrenceID: 15,
                Subject: 'recurrence event - Part1',
                FollowingID: 10,
                StartTime: new Date(2017, 9, 19, 10, 0),
                EndTime: new Date(2017, 9, 19, 11, 0)
            };
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[6], null, true) as Record<string, any>;
            occurence.Guid = data.Guid;
            schObj.deleteEvent(occurence, 'DeleteFollowingEvents');
        });
        it('test recurrence appointment delete series', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(4);
                done();
            };
            const data: Record<string, any> = extend({}, schObj.eventsProcessed[0], null, true) as Record<string, any>;
            schObj.deleteEvent(data, 'DeleteSeries');
        });

        it('test add recurrence event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(8);
                done();
            };
            const data: Record<string, any>[] = [{
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

    describe('Events are missing after block pop thrown ', () => {
        let schObj: Schedule;
        const data: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Burning Man',
            StartTime: '2018-06-09T09:30:00.000Z',
            EndTime: '2018-06-09T11:30:00.000Z',
            OwnerId: 1,
            IsBlock: false
        },
        {
            Id: 6,
            Subject: 'Burning',
            StartTime: '2018-06-11',
            EndTime: '2018-06-11',
            OwnerId: 1
        },
        {
            Id: 2,
            Subject: 'Marketing Forum',
            StartTime: '2018-06-03T04:30:00.000Z',
            EndTime: '2018-06-03T06:00:00.000Z',
            OwnerId: 2,
            IsBlock: true
        }, {
            Id: 3,
            Subject: 'Business Factory',
            StartTime: '2018-06-03T08:00:00.000Z',
            EndTime: '2018-06-03T09:30:00.000Z',
            OwnerId: 3,
            IsBlock: true
        }, {
            Id: 4,
            Subject: 'Burning Man1',
            StartTime: '2018-06-04T06:00:00.000Z',
            EndTime: '2018-06-04T07:30:00.000Z',
            OwnerId: 1,
            IsBlock: true
        }, {
            Id: 5,
            Subject: 'Funnel Hacking',
            StartTime: '2018-06-05T04:00:00.000Z',
            EndTime: '2018-06-05T05:30:00.000Z',
            OwnerId: 3,
            IsBlock: true
        },
        {
            Id: 7,
            Subject: 'Burning',
            StartTime: '2018-06-05T06:00:00.000Z',
            EndTime: '2018-06-05T07:30:00.000Z',
            OwnerId: 1,
            IsBlock: false,
            IsAllDay: false
        }
        ];
        const ownerCollections: Record<string, any>[] = [
            { OwnerText: 'Margaret', OwnerId: 1, Color: '#ea7a57', workDays: [1, 2, 3, 4, 5, 6] },
            { OwnerText: 'Robert', OwnerId: 2, Color: '#df5286' },
            { OwnerText: 'Laura', OwnerId: 3, Color: '#865fcf' }
        ];
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%',
                height: '550px',
                showWeekend: false,
                selectedDate: new Date(2018, 5, 5),
                views: ['Week', 'TimelineMonth'],
                group: {
                    resources: ['Owners']
                },
                resources: [
                    {
                        field: 'OwnerId', title: 'Owners', name: 'Owners', allowMultiple: true,
                        dataSource: ownerCollections, textField: 'OwnerText', idField: 'OwnerId',
                        colorField: 'Color', workDaysField: 'workDays'
                    }
                ],
                eventSettings: {
                    dataSource: data
                }
            };
            schObj = util.createSchedule(schOptions, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('checking appointment rendering', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                const eventList: Element = schObj.element.querySelector('.e-appointment');
                expect(eventList.querySelector('.e-subject').innerHTML).toBe('Burning');
                (schObj.element.querySelector('.e-schedule-toolbar .e-toolbar-right .e-week') as HTMLElement).click();
                done();
            };
            expect(schObj.eventsData.length).toEqual(5);
            const eventList: Element = schObj.element.querySelector('.e-appointment');
            expect(eventList.querySelector('.e-subject').innerHTML).toBe('Burning');
            util.triggerMouseEvent((eventList) as HTMLElement, 'click');
            util.triggerMouseEvent((eventList) as HTMLElement, 'dblclick');
            const startTime: DateTimePicker = (document.querySelector('.e-start.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            startTime.value = new Date(2018, 5, 4, 11, 0);
            startTime.dataBind();
            const endTime: DateTimePicker = (document.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            endTime.value = new Date(2018, 5, 4, 12, 0);
            endTime.dataBind();
            (document.querySelector('.e-schedule-dialog .e-event-save') as HTMLElement).click();
            const popupElement: HTMLElement = document.querySelector('.e-quick-dialog.e-popup') as HTMLElement;
            expect(popupElement.classList.contains('e-popup-open'));
            const okButton: HTMLElement = popupElement.querySelector('.e-footer-content .e-quick-alertok') as HTMLElement;
            okButton.click();
            (schObj.element.querySelector('.e-schedule-toolbar .e-toolbar-right .e-timeline-month') as HTMLElement).click();
        });

        it('Checking appointments without opening the block popup', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                const eventList: Element = schObj.element.querySelector('.e-appointment');
                expect(eventList.querySelector('.e-subject').innerHTML).toBe('Burning');
                (schObj.element.querySelector('.e-schedule-toolbar .e-toolbar-right .e-week') as HTMLElement).click();
                done();
            };
            expect(schObj.eventsData.length).toEqual(5);
            const eventList: Element = schObj.element.querySelector('.e-appointment');
            expect(eventList.querySelector('.e-subject').innerHTML).toBe('Burning');
            util.triggerMouseEvent((eventList) as HTMLElement, 'click');
            util.triggerMouseEvent((eventList) as HTMLElement, 'dblclick');
            const startTime: DateTimePicker = (document.querySelector('.e-start.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            startTime.value = new Date(2018, 5, 6);
            startTime.dataBind();
            const endTime: DateTimePicker = (document.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            endTime.value = new Date(2018, 5, 7);
            endTime.dataBind();
            (document.querySelector('.e-schedule-dialog .e-event-save') as HTMLElement).click();
            (schObj.element.querySelector('.e-schedule-toolbar .e-toolbar-right .e-week') as HTMLElement).click();
        });
    });

    describe('Es-835427 - Duplicate event created after changing recurring of the following events', () => {
        let schObj: Schedule;
        const data: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Meeting',
            StartTime: new Date(2018, 1, 13, 10, 0),
            EndTime: new Date(2018, 1, 13, 12, 30),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=4'
        }
        ];
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%',
                height: '550px',
                showWeekend: false,
                selectedDate: new Date(2018, 1, 15),
                eventSettings: {editFollowingEvents: true}
            };
            schObj = util.createSchedule(schOptions, data, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Editing recurrence appointment', () => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
            };
            const eventElementList: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(4);
            eventElementList[2].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (eventPopup.querySelector('.e-edit') as HTMLElement).click();
            const quickDialog: Element = document.querySelector('.e-dialog.e-quick-dialog');
            (quickDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement).click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startTime: DateTimePicker = (dialogElement.querySelector('.e-start') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            startTime.value = new Date(2018, 1, 15, 8, 30);
            startTime.dataBind();
            const endTime: DateTimePicker = (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            endTime.value = new Date(2018, 1, 15, 11, 0);
            endTime.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });
        it('To check recurrence appointment after changing editing following events', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            const eventElementList: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(4);
            util.triggerMouseEvent(eventElementList[0] as HTMLElement, 'click');
            util.triggerMouseEvent(eventElementList[0] as HTMLElement, 'dblclick');
            const quickDialog: Element = document.querySelector('.e-dialog.e-quick-dialog');
            (quickDialog.querySelector('.e-quick-dialog-following-events') as HTMLElement).click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startTime: DateTimePicker = (dialogElement.querySelector('.e-start') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            startTime.value = new Date(2018, 1, 12, 10, 0);
            startTime.dataBind();
            const endTime: DateTimePicker = (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            endTime.value = new Date(2018, 1, 12, 12, 30);
            endTime.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            (document.querySelector( '.e-quick-dialog-alert-btn') as HTMLElement).click();
            done();
        });
    });

    describe('Es-184224 - checking server query params', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%',
                height: '550px',
                selectedDate: new Date(2023, 7, 23),
                currentView: 'Day',
                timezone: 'Europe/London',
            };
            schObj = util.createSchedule(schOptions, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('with timezone', () => {
            schObj.dataBinding = (args: DataBindingEventArgs) => {
                expect((args as any).query.params.length).toBe(2);
                expect((args as any).query.params[0].value).toEqual("2023-08-22T23:00:00.000Z");
                expect((args as any).query.params[1].value).toEqual("2023-08-23T23:00:00.000Z");
            };
        });
    });

    describe('Schedule addEvent in appointment template checking', () => {
        let schObj: Schedule;
        const data: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Meeting',
            StartTime: new Date(2023, 7, 23, 10, 0),
            EndTime: new Date(2023, 7, 23, 12, 30),
            RoomId: 1
        }
        ];
        const eventTemplate: string = '<div>Subject: ${Subject}</div>';
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2023, 7, 23),
                eventSettings: { template: eventTemplate },
                views: ['Week'],
                currentView: 'Week',
                group: { resources: ['Rooms'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', RoomId: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', RoomId: 2, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'RoomId', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('adding appointment', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                expect((schObj.element.querySelector('.e-appointment') as HTMLElement).innerText).toEqual('Subject: Meeting');
                done();
            };
            expect(schObj.eventsData.length).toEqual(0);
            schObj.addEvent(data[0]);
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
