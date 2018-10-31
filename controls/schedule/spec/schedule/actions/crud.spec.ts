import { createElement, remove, EmitType, extend } from '@syncfusion/ej2-base';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, ReturnType, ActionEventArgs } from '../../../src/schedule/index';
import { defaultData, stringData, cloneDataSource } from '../base/datasource.spec';
import { createSchedule, destroy } from '../util.spec';

/**
 * Schedule CRUD module
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Schedule CRUD', () => {
    describe('Add Actions', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let eventData: Object = {
            Id: 1,
            Subject: 'test event',
            StartTime: new Date(2017, 9, 19, 10, 0),
            EndTime: new Date(2017, 9, 19, 11, 0),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
        };
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', selectedDate: new Date(2017, 10, 3),
                eventSettings: { dataSource: [] }, dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Before add checking', () => {
            expect(schObj.eventsData.length).toEqual(0);
        });

        it('After add checking', (done: Function) => {
            let dataBound: (args: ReturnType) => void = (args: ReturnType) => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            schObj.dataBound = dataBound;
            schObj.addEvent(eventData as { [key: string]: Object });
        });

        it('Multiple events add checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(8);
                done();
            };
            schObj.dataBound = dataBound;
            schObj.addEvent(defaultData.slice(0, 7));
        });

        it('actionBegin event checking', () => {
            schObj.actionBegin = (args: ActionEventArgs) => {
                args.cancel = true;
            };
            schObj.addEvent(eventData as { [key: string]: Object });
        });
    });

    describe('Save Actions', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
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
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                eventSettings: { dataSource: events },
                selectedDate: new Date(2017, 9, 19), dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
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
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = true; };
            schObj.saveEvent(data);
            expect(schObj.eventsData.length).toEqual(3);
        });

        it('test normal appointment save', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
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
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = false; };
            schObj.saveEvent(data);
            schObj.dataBound = dataBound;
        });

        it('test edit occurrence', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.currentAction).toEqual('EditOccurrence');
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
            schObj.currentAction = 'EditOccurrence';
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[2], null, true) as { [key: string]: Object };
            data.Subject = '2nd occurrence edited';
            data.Id = 20;
            schObj.saveEvent(data, schObj.currentAction);
            schObj.dataBound = dataBound;
        });

        it('test edited occurrence save', (done: Function) => {
            schObj.dataBound = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(4);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('recurrence event');
                expect(dataObj[3].Id).toEqual(20);
                expect(dataObj[3].RecurrenceID).toEqual(10);
                expect(dataObj[3].Subject).toEqual('2nd occurrence edited twice');
                done();
            };
            schObj.dataBind();
            expect(schObj.eventsData.length).toEqual(4);
            schObj.currentAction = 'EditOccurrence';
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[2], null, true) as { [key: string]: Object };
            data.Subject = '2nd occurrence edited twice';
            schObj.saveEvent(data);
            expect(schObj.eventsData.length).toEqual(4);
        });

        it('test cancel action begin event in edit occurrence', () => {
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = true; };
            schObj.dataBind();
            expect(schObj.eventsData.length).toEqual(4);
            schObj.currentAction = 'EditOccurrence';
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[2], null, true) as { [key: string]: Object };
            schObj.saveEvent(data, schObj.currentAction);
            expect(schObj.eventsData.length).toEqual(4);
        });

        it('test 4th occurrence edit', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.currentAction).toEqual('EditOccurrence');
                expect(schObj.eventsData.length).toEqual(5);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                let exDate: string = <string>dataObj[0].RecurrenceException;
                expect(exDate.split(',').length).toEqual(2);
                expect(dataObj[4].Id).toEqual(21);
                expect(dataObj[4].RecurrenceID).toEqual(10);
                expect(dataObj[4].Subject).toEqual('4th occurrence edited');
                done();
            };
            schObj.dataBound = dataBound;
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = false; };
            schObj.dataBind();
            expect(schObj.eventsData.length).toEqual(4);
            schObj.currentAction = 'EditOccurrence';
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[4], null, true) as { [key: string]: Object };
            data.Id = 21;
            data.Subject = '4th occurrence edited';
            schObj.saveEvent(data, schObj.currentAction);
        });

        it('test cancel action begin event in edit series', () => {
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = true; };
            schObj.dataBind();
            schObj.currentAction = 'EditSeries';
            expect(schObj.eventsData.length).toEqual(5);
            schObj.saveEvent(schObj.eventsProcessed[0] as { [key: string]: Object }, schObj.currentAction);
            expect(schObj.eventsData.length).toEqual(5);
        });

        it('test edit series', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            schObj.dataBound = dataBound;
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = false; };
            schObj.dataBind();
            let data: { [key: string]: Object } = {
                Id: 10,
                Subject: 'recurrence',
                StartTime: new Date(2017, 9, 16, 10, 0),
                EndTime: new Date(2017, 9, 16, 11, 0),
                AllDay: false,
                RecurrenceID: 10,
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            };
            schObj.currentAction = 'EditSeries';
            schObj.saveEvent(data, schObj.currentAction);
        });
    });

    describe('Delete Actions', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
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
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', selectedDate: new Date(2017, 9, 18),
                eventSettings: { dataSource: cloneDataSource(testData) }, dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Before delete checking', () => {
            expect(schObj.eventsData.length).toEqual(5);
        });

        it('Checking cancel action begin event for delete', () => {
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = true; };
            schObj.deleteEvent(10);
            expect(schObj.eventsData.length).toEqual(5);
        });

        it('test normal appointment delete using id', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = false; };
            schObj.deleteEvent(11);
            schObj.dataBound = dataBound;
        });

        it('test normal appointment, delete using string id', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            schObj.deleteEvent('12');
            schObj.dataBound = dataBound;
        });

        it('test normal appointment, delete using object', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            schObj.deleteEvent({
                Id: 12,
                Subject: 'event 2',
                StartTime: new Date(2017, 9, 16, 11, 0),
                EndTime: new Date(2017, 9, 16, 12, 30)
            });
            schObj.dataBound = dataBound;
        });

        it('test normal appointment, delete using array of object', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            schObj.deleteEvent([{
                Id: 13,
                Subject: 'event 3',
                StartTime: new Date(2017, 9, 17, 11, 0),
                EndTime: new Date(2017, 9, 17, 12, 30)
            }, {
                Id: 14,
                Subject: 'event 4',
                StartTime: new Date(2017, 9, 18, 11, 0),
                EndTime: new Date(2017, 9, 18, 12, 30)
            }]);
            schObj.dataBound = dataBound;
        });

        it('test recurrence appointment delete occurrence', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
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
            schObj.dataBound = dataBound;
        });

        it('test recurrence appointment delete series', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
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
            schObj.dataBound = dataBound;
        });

        it('test add recurrence event', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
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
            schObj.dataBound = dataBound;
        });

        it('test delete series without edit any occurrence', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(0);
                done();
            };
            schObj.deleteEvent(10, 'DeleteSeries');
            schObj.dataBound = dataBound;
        });
    });

    describe('Timezone Events', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', selectedDate: new Date(2017, 10, 1),
                eventSettings: { dataSource: [] }, dataBound: dataBound
            });
            schObj.timezone = 'Asia/kolkata';
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Before add checking', () => {
            expect(schObj.eventsData.length).toEqual(0);
        });

        it('checking with both start and end timezone', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
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
            schObj.dataBound = dataBound;
        });

        it('checking with start timezone', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
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
            schObj.dataBound = dataBound;
        });

        it('checking with end timezone', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
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
            schObj.dataBound = dataBound;
        });
        it('delete appointment', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(0);
                done();
            };
            schObj.deleteEvent(schObj.eventsData as { [key: string]: Object }[], 'DeleteSeries');
            schObj.dataBound = dataBound;
        });

        it('add events while schedule timezone set', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            let data: { [key: string]: Object } = {
                Id: 10,
                Subject: 'test',
                StartTime: new Date(2017, 9, 30, 10, 0),
                EndTime: new Date(2017, 9, 30, 12, 30)
            };
            schObj.addEvent(data);
            schObj.dataBound = dataBound;
        });

        it('add events while schedule timezone in default', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
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
            schObj.addEvent(data);
            schObj.dataBound = dataBound;
        });

    });

    describe('Public methods', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            schObj = createSchedule({ selectedDate: new Date(2017, 10, 1) }, defaultData, done)
        });
        afterAll(() => {
            destroy(schObj);
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
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                selectedDate: new Date(2017, 10, 1),
                eventSettings: { dataSource: [] },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Before add checking', () => {
            expect(schObj.eventsData.length).toEqual(0);
        });

        it('After add checking', (done: Function) => {
            let dataBound: (args: ReturnType) => void = (args: ReturnType) => {
                expect(schObj.eventsData.length).toEqual(1);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect(dataObj[0].Subject).toEqual('New');
                expect(dataObj[0].Id).toEqual('4');
                done();
            };
            let data: { [key: string]: Object } = {
                Id: '4',
                Subject: 'New',
                StartTime: new Date(2017, 10, 1, 10, 0),
                EndTime: new Date(2017, 10, 1, 11, 0),
                IsAllDay: false
            };
            schObj.dataBound = dataBound;
            schObj.addEvent(data);
        });

        it('actionBegin before add event checking', () => {
            schObj.actionBegin = (args: ActionEventArgs) => {
                args.cancel = true;
            };
            schObj.addEvent(stringData[0] as { [key: string]: Object });
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('Multiple events add checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(5);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect(dataObj[2].Subject).toEqual('Event2');
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => {
                args.cancel = false;
            };
            schObj.addEvent(stringData);
            schObj.dataBound = dataBound;
        });

        it('actionBegin before save event checking', () => {
            schObj.actionBegin = (args: ActionEventArgs) => {
                args.cancel = true;
            };
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
            let dataBound: (args: Object) => void = (args: Object) => {
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
            schObj.actionBegin = (args: ActionEventArgs) => {
                args.cancel = false;
            };
            schObj.saveEvent(data);
            schObj.dataBound = dataBound;
        });

        it('Before delete normal appointment checking', () => {
            expect(schObj.eventsData.length).toEqual(5);
        });

        it('Checking action begin event for delete a normal appointment', () => {
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = true; };
            schObj.deleteEvent('2');
            expect(schObj.eventsData.length).toEqual(5);
        });

        it('Normal appointment delete checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = false; };
            schObj.deleteEvent('2');
            schObj.dataBound = dataBound;
        });

        it('Action begin event for edit occurrence save checking ', () => {
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = true; };
            schObj.dataBind();
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
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.currentAction).toEqual('EditOccurrence');
                expect(schObj.eventsData.length).toEqual(5);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                let exDate: string = <string>dataObj[3].RecurrenceException;
                expect(exDate.split(',').length).toEqual(1);
                expect(dataObj[4].RecurrenceID).toEqual('recEvent');
                done();
            };
            schObj.currentAction = 'EditOccurrence';
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = false; };
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[3], null, true) as { [key: string]: Object };
            data.Id = 'rEvent1';
            schObj.saveEvent(data, schObj.currentAction);
            schObj.dataBound = dataBound;
        });

        it('After recurrence appointment, edit series save checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.currentAction).toEqual('EditSeries');
                expect(schObj.eventsData.length).toEqual(4);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect(dataObj[3].RecurrenceException).toEqual(null);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = false; };
            schObj.dataBind();
            let data: { [key: string]: Object } = {
                Id: 'rEvent2',
                Subject: 'Meeting',
                StartTime: new Date(2017, 9, 30, 12, 0),
                EndTime: new Date(2017, 9, 30, 13, 0),
                RecurrenceID: 'recEvent',
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            };
            schObj.currentAction = 'EditSeries';
            schObj.saveEvent(data, schObj.currentAction);
            schObj.dataBound = dataBound;
        });

        it('Delete recurrence appointment', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
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
            schObj.dataBound = dataBound;
        });

        it('Delete series appointment', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
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
            schObj.dataBound = dataBound;
        });
    });
});
